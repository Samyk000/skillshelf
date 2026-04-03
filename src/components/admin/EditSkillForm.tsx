"use client";

import { useState } from "react";
import { SkillForm } from "@/components/admin/SkillForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Skill } from "@/types/skill";

interface EditSkillFormProps {
  skill: Skill;
}

export function EditSkillForm({ skill }: EditSkillFormProps) {
  const [status, setStatus] = useState<"draft" | "published" | "archived">(skill.status);
  const [featured, setFeatured] = useState(skill.featured);

  return (
    <>
      <AdminHeader>
        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
          className="border-2 border-input bg-background px-3 py-2 text-xs font-semibold tracking-wider text-foreground uppercase focus:border-primary focus:outline-none"
        >
          <option value="draft">DRAFT</option>
          <option value="published">PUBLISHED</option>
          <option value="archived">ARCHIVED</option>
        </select>

        {/* Featured Toggle */}
        <button
          type="button"
          onClick={() => setFeatured(!featured)}
          className={`border-2 px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors ${
            featured
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          FEATURED
        </button>
      </AdminHeader>
      <SkillForm
        skill={skill}
        status={status}
        featured={featured}
      />
    </>
  );
}
