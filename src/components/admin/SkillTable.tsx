"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Skill } from "@/types/skill";

interface SkillTableProps {
  skills: Skill[];
}

export function SkillTable({ skills }: SkillTableProps) {
  const router = useRouter();

  const togglePublish = async (skill: Skill) => {
    const supabase = createClient();
    const newStatus = skill.status === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("skills")
      .update({ status: newStatus })
      .eq("id", skill.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Skill ${newStatus === "published" ? "published" : "unpublished"}`);
      router.refresh();
    }
  };

  const deleteSkill = async (skill: Skill) => {
    if (!confirm(`Delete "${skill.title}"? This cannot be undone.`)) return;

    const supabase = createClient();
    const { error } = await supabase.from("skills").delete().eq("id", skill.id);

    if (error) {
      toast.error("Failed to delete skill");
    } else {
      toast.success("Skill deleted");
      router.refresh();
    }
  };

  if (skills.length === 0) {
    return (
      <div className="border-2 border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No skills yet.</p>
        <Link
          href="/admin/skills/new"
          className="mt-4 inline-block border-2 border-primary px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase hover:bg-primary hover:text-primary-foreground"
        >
          CREATE FIRST SKILL
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-border bg-muted">
            <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-foreground uppercase">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-foreground uppercase">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-foreground uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-foreground uppercase">
              Featured
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-foreground uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr
              key={skill.id}
              className="border-b border-border transition-colors hover:bg-card"
            >
              <td className="px-4 py-3 font-semibold text-foreground">
                {skill.title}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {skill.category}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`border px-2 py-0.5 text-[10px] font-semibold tracking-wider ${
                    skill.status === "published"
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {skill.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {skill.featured ? "YES" : "NO"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/skills/${skill.id}/edit`}
                    className="border border-border px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase hover:border-primary hover:text-primary"
                  >
                    EDIT
                  </Link>
                  <button
                    onClick={() => togglePublish(skill)}
                    className="border border-border px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase hover:border-primary hover:text-primary"
                  >
                    {skill.status === "published" ? "UNPUBLISH" : "PUBLISH"}
                  </button>
                  <button
                    onClick={() => deleteSkill(skill)}
                    className="border border-border px-2 py-1 text-[10px] font-semibold tracking-wider text-destructive uppercase hover:border-destructive"
                  >
                    DELETE
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
