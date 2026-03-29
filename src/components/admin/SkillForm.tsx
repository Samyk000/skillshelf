"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { CATEGORIES, TAGS } from "@/lib/constants";
import type { Skill } from "@/types/skill";

interface SkillFormProps {
  skill?: Skill;
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function SkillForm({ skill }: SkillFormProps) {
  const router = useRouter();
  const isEditing = !!skill;

  const [form, setForm] = useState({
    title: skill?.title ?? "",
    slug: skill?.slug ?? "",
    short_description: skill?.short_description ?? "",
    category: skill?.category ?? CATEGORIES[0],
    tags: skill?.tags ?? [],
    status: skill?.status ?? "draft",
    skill_markdown: skill?.skill_markdown ?? "",
    preview_html: skill?.preview_html ?? "",
    featured: skill?.featured ?? false,
  });

  const [saving, setSaving] = useState(false);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!/^[a-z0-9-]+$/.test(form.slug)) {
      toast.error("Slug must only contain lowercase letters, numbers, and hyphens");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const payload = {
      ...form,
      preview_html: form.preview_html || null,
      short_description: form.short_description || null,
      created_by: user.id,
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("skills")
        .update(payload)
        .eq("id", skill.id);
      error = result.error;
    } else {
      const result = await supabase.from("skills").insert(payload);
      error = result.error;
    }

    if (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} skill: ${error.message}`);
    } else {
      toast.success(`Skill ${isEditing ? "updated" : "created"}!`);
      router.push("/admin");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title + Slug */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            TITLE *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="e.g. Paper Design"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            SLUG *
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            required
            className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="paper-design"
          />
        </div>
      </div>

      {/* Description + Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            DESCRIPTION
          </label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, short_description: e.target.value }))
            }
            className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="A one-line description"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            CATEGORY *
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
            className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          TAGS
        </label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`border-2 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                form.tags.includes(tag)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Status + Featured */}
      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            STATUS
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as "draft" | "published" | "archived",
              }))
            }
            className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="draft">DRAFT</option>
            <option value="published">PUBLISHED</option>
            <option value="archived">ARCHIVED</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, featured: e.target.checked }))
            }
            className="h-4 w-4 border-2 border-input accent-primary"
          />
          <label
            htmlFor="featured"
            className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
          >
            FEATURED
          </label>
        </div>
      </div>

      {/* Skill Markdown + Preview HTML */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            SKILL MARKDOWN *
          </label>
          <textarea
            value={form.skill_markdown}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, skill_markdown: e.target.value }))
            }
            required
            rows={14}
            className="border-2 border-input bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="Paste your SKILL.md content here..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            PREVIEW HTML
          </label>
          <textarea
            value={form.preview_html}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, preview_html: e.target.value }))
            }
            rows={14}
            className="border-2 border-input bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="Paste full HTML for the preview..."
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="border-2 border-primary bg-primary px-8 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
        >
          {saving
            ? "SAVING..."
            : isEditing
              ? "UPDATE SKILL"
              : "CREATE SKILL"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border-2 border-border px-8 py-3 text-sm font-bold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
