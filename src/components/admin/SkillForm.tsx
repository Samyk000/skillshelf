"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import { createSkill, updateSkill } from "@/app/actions/admin";
import { CoverImageUpload } from "@/components/admin/CoverImageUpload";
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
    skill_markdown: skill?.skill_markdown ?? "",
    preview_html: skill?.preview_html ?? "",
    cover_image_url: skill?.cover_image_url ?? "",
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
      preview_html: form.preview_html || null,
      short_description: form.short_description || null,
      cover_image_url: form.cover_image_url || null,
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
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Info (One Row) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_2fr_1fr]">
        <div className="flex flex-col gap-2">
          <label htmlFor="skill-title" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            TITLE *
          </label>
          <input
            id="skill-title"
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="e.g. Paper Design"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="skill-description" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            DESCRIPTION
          </label>
          <input
            id="skill-description"
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
          <label htmlFor="skill-category" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            CATEGORY *
          </label>
          <select
            id="skill-category"
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

      {/* Code + Preview + Image (One Row) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1.5fr_1fr]">
        {/* Skill Markdown */}
        <div className="flex flex-col gap-2">
          <label htmlFor="skill-markdown" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            SKILL MARKDOWN *
          </label>
          <textarea
            id="skill-markdown"
            value={form.skill_markdown}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, skill_markdown: e.target.value }))
            }
            required
            rows={14}
            className="border-2 border-input bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none h-full min-h-[300px] resize-none"
            placeholder="Paste your SKILL.md content here..."
          />
        </div>

        {/* Preview HTML */}
        <div className="flex flex-col gap-2">
          <label htmlFor="skill-preview-html" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            PREVIEW HTML
          </label>
          <textarea
            id="skill-preview-html"
            value={form.preview_html}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, preview_html: e.target.value }))
            }
            rows={14}
            className="border-2 border-input bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none h-full min-h-[300px] resize-none"
            placeholder="Paste full HTML for the preview..."
          />
        </div>

        {/* Cover Image Upload + Status + Featured */}
        <div className="flex flex-col gap-4">
          <CoverImageUpload
            value={form.cover_image_url}
            onChange={(url) => setForm((prev) => ({ ...prev, cover_image_url: url }))}
          />
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                SPOTLIGHT
              </label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
                className={`border-2 h-full py-2 text-xs font-bold tracking-widest uppercase transition-colors ${
                  form.featured
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {form.featured ? "FEATURED" : "OFF"}
              </button>
            </div>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full border-2 border-primary bg-primary py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
            >
              {saving
                ? "SAVING..."
                : isEditing
                  ? "UPDATE"
                  : "UPLOAD"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full border-2 border-border py-3 text-sm font-bold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
