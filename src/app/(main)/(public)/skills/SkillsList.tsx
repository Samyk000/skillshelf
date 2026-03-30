import { createClient } from "@/lib/supabase/server";
import { sanitizeSearchQuery } from "@/lib/sanitize";
import { SkillGrid } from "@/components/skills/SkillGrid";
import type { Skill } from "@/types/skill";

const SKILLS_PER_PAGE = 12;

interface SkillsListProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export async function SkillsList({ searchParams }: SkillsListProps) {
  const { q, category, page } = await searchParams;
  const supabase = await createClient();

  const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const from = (pageNum - 1) * SKILLS_PER_PAGE;
  const to = from + SKILLS_PER_PAGE - 1;

  // Only select fields needed for listing (exclude skill_markdown)
  let query = supabase
    .from("skills")
    .select("id, slug, title, short_description, category, tags, preview_html, preview_external_url, cover_image_url, featured, created_at, updated_at", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(from, to);

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
  const hasMore = to + 1 < totalCount;

  return (
    <div>
      <SkillGrid skills={(skills as Skill[]) ?? []} />
      {hasMore && (
        <div className="mt-8 text-center">
          <a
            href={`/skills?page=${pageNum + 1}${q ? `&q=${q}` : ""}${category ? `&category=${category}` : ""}`}
            className="inline-block border-2 border-primary px-8 py-3 text-sm font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            LOAD MORE ({totalCount - (to + 1)} remaining)
          </a>
        </div>
      )}
    </div>
  );
}
