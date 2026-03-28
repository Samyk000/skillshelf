import { createClient } from "@/lib/supabase/server";
import { SkillGrid } from "@/components/skills/SkillGrid";
import type { Skill } from "@/types/skill";

interface SkillsListProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function SkillsList({ searchParams }: SkillsListProps) {
  const { q, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("skills")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,short_description.ilike.%${q}%,tags.cs.{${q}}`
    );
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data: skills, error } = await query;

  if (error) {
    return (
      <div className="border-2 border-destructive p-6 text-destructive">
        Error loading skills: {error.message}
      </div>
    );
  }

  return <SkillGrid skills={(skills as Skill[]) ?? []} />;
}
