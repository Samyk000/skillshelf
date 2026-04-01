import { createClient } from "@/lib/supabase/server";
import { sanitizeSearchQuery } from "@/lib/sanitize";
import { SkillsListClient } from "@/components/skills/SkillsListClient";
import type { Skill } from "@/types/skill";

const INITIAL_BATCH_SIZE = 6;

interface SkillsListProps {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export async function SkillsList({ searchParams }: SkillsListProps) {
  const { q, category, sort } = await searchParams;
  const supabase = await createClient();

  let skills: Skill[] = [];
  let totalCount = 0;
  const categoryFilter = category
    ? sanitizeSearchQuery(category) || null
    : null;

  if (sort === "views") {
    const [skillsResult, countResult] = await Promise.all([
      supabase.rpc("get_skills_sorted_by_views", {
        p_limit: INITIAL_BATCH_SIZE,
        p_offset: 0,
        p_category: categoryFilter,
      }),
      supabase
        .from("skills")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .eq("category", categoryFilter ?? ""),
    ]);
    skills = (skillsResult.data as Skill[]) ?? [];
    totalCount = countResult.count ?? 0;
  } else if (sort === "likes") {
    const [skillsResult, countResult] = await Promise.all([
      supabase.rpc("get_skills_sorted_by_likes", {
        p_limit: INITIAL_BATCH_SIZE,
        p_offset: 0,
        p_category: categoryFilter,
      }),
      supabase
        .from("skills")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .eq("category", categoryFilter ?? ""),
    ]);
    skills = (skillsResult.data as Skill[]) ?? [];
    totalCount = countResult.count ?? 0;
  } else {
    let query = supabase
      .from("skills")
      .select(
        "id, slug, title, short_description, category, preview_html, preview_external_url, cover_image_url, featured, created_at, updated_at",
        { count: "exact" }
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(0, INITIAL_BATCH_SIZE - 1);

    if (q) {
      const sanitizedQuery = sanitizeSearchQuery(q);
      if (sanitizedQuery.length > 0) {
        query = query.or(
          `title.ilike.%${sanitizedQuery}%,short_description.ilike.%${sanitizedQuery}%`
        );
      }
    }

    if (category) {
      const sanitizedCategory = sanitizeSearchQuery(category);
      if (sanitizedCategory.length > 0) {
        query = query.eq("category", sanitizedCategory);
      }
    }

    const result = await query;
    skills = (result.data as Skill[]) ?? [];
    totalCount = result.count ?? 0;

    if (result.error) {
      return (
        <div className="border-2 border-destructive p-6 text-destructive">
          Error loading skills.
        </div>
      );
    }
  }

  const hasMore = INITIAL_BATCH_SIZE < totalCount;

  // Fetch view/like counts
  const skillIds = skills.map(s => s.id);
  const viewCounts: Record<string, number> = {};
  const likeCounts: Record<string, number> = {};

  if (skillIds.length > 0) {
    const [viewsResult, likesResult] = await Promise.all([
      supabase.from("skill_views").select("skill_id").in("skill_id", skillIds),
      supabase.from("skill_likes").select("skill_id").in("skill_id", skillIds),
    ]);

    for (const row of viewsResult.data ?? []) {
      viewCounts[row.skill_id] = (viewCounts[row.skill_id] ?? 0) + 1;
    }
    for (const row of likesResult.data ?? []) {
      likeCounts[row.skill_id] = (likeCounts[row.skill_id] ?? 0) + 1;
    }
  }

  return (
    <SkillsListClient
      key={`${q ?? ""}-${category ?? ""}-${sort ?? "recent"}`}
      initialSkills={skills}
      initialHasMore={hasMore}
      initialViewCounts={viewCounts}
      initialLikeCounts={likeCounts}
      searchQuery={q}
      category={category}
      sort={sort}
    />
  );
}
