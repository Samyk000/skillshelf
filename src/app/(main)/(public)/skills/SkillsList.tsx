import { createClient } from "@/lib/supabase/server";
import { sanitizeSearchQuery } from "@/lib/sanitize";
import { SkillsListClient } from "@/components/skills/SkillsListClient";
import type { Skill } from "@/types/skill";

const INITIAL_BATCH_SIZE = 6;

interface SkillsListProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function SkillsList({ searchParams }: SkillsListProps) {
  const { q, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("skills")
    .select(
      "id, slug, title, short_description, category, tags, preview_html, preview_external_url, cover_image_url, featured, created_at, updated_at",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(0, INITIAL_BATCH_SIZE - 1);

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

  const { data: skills, error, count } = await query;

  if (error) {
    return (
      <div className="border-2 border-destructive p-6 text-destructive">
        Error loading skills.
      </div>
    );
  }

  const totalCount = count ?? 0;
  const hasMore = INITIAL_BATCH_SIZE < totalCount;

  return (
    <SkillsListClient
      key={`${q ?? ""}-${category ?? ""}`}
      initialSkills={(skills as Skill[]) ?? []}
      initialHasMore={hasMore}
      searchQuery={q}
      category={category}
    />
  );
}
