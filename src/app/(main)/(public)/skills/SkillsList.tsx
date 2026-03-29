import { createClient } from "@/lib/supabase/server";
import { sanitizeSearchQuery } from "@/lib/sanitize";
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
    const sanitizedQuery = sanitizeSearchQuery(q);
    if (sanitizedQuery.length > 0) {
      query = query.or(
        `title.ilike.%${sanitizedQuery}%,short_description.ilike.%${sanitizedQuery}%,tags.cs.{${sanitizedQuery}}`
      );
    }
  }

  if (category) {
    const sanitizedCategory = sanitizeSearchQuery(category);
    if (sanitizedCategory.length > 0) {
      query = query.eq("category", sanitizedCategory);
    }
  }

  const { data: skills, error } = await query;

  if (error) {
    return (
      <div className="border-2 border-destructive p-6 text-destructive">
        Error loading skills.
      </div>
    );
  }

  return <SkillGrid skills={(skills as Skill[]) ?? []} />;
}
