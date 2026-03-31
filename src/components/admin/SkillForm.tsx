"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import { createSkill, updateSkill } from "@/app/actions/admin";
import type { Skill } from "@/types/skill";

interface SkillFormProps {
  skill?: Skill;
  status: "draft" | "published" | "archived";
  featured: boolean;
  onStatusChange: (status: "draft" | "published" | "archived") => void;
  onFeaturedChange: (featured: boolean) => void;
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

export function SkillForm({ skill, status, featured }: SkillFormProps) {
  const router = useRouter();
  const isEditing = !!skill;

  const [form, setForm] = useState({
    title: skill?.title ?? "",
    slug: skill?.slug ?? "",
    short_description: skill?.short_description ?? "",
    category: skill?.category ?? CATEGORIES[0],
    skill_markdown: skill?.skill_markdown ?? "",
    preview_html: skill?.preview_html ?? "",
  });

  const [saving, setSaving] = useState(false);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
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

    const payload = {
      ...form,
      status,
      featured,
      preview_html: form.preview_html || null,
      short_description: form.short_description || null,
    };

    let result;
    if (isEditing) {
      result = await updateSkill(skill.id, payload);
    } else {
      result = await createSkill(payload);
    }

    if (result.error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} skill: ${result.error}`);
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
