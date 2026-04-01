"use client";

import { useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/sanitize";
import { SkillCard } from "@/components/skills/SkillCard";
import type { Skill } from "@/types/skill";

const BATCH_SIZE = 6;

interface SkillsListClientProps {
  initialSkills: Skill[];
  initialHasMore: boolean;
  searchQuery?: string;
  category?: string;
  sort?: string;
}

export function SkillsListClient({
  initialSkills,
  initialHasMore,
  searchQuery,
  category,
  sort,
}: SkillsListClientProps) {
  const supabase = useMemo(() => createClient(), []);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const offset = skills.length;
    const categoryFilter = category
      ? sanitizeSearchQuery(category) || null
      : null;

    if (sort === "views") {
      const { data, error } = await supabase.rpc(
        "get_skills_sorted_by_views",
        {
          p_limit: BATCH_SIZE,
          p_offset: offset,
          p_category: categoryFilter,
        }
      );
      if (!error && data && data.length > 0) {
        setSkills((prev) => [...prev, ...(data as Skill[])]);
        setHasMore(data.length === BATCH_SIZE);
      } else {
        setHasMore(false);
      }
    } else if (sort === "likes") {
      const { data, error } = await supabase.rpc(
        "get_skills_sorted_by_likes",
        {
          p_limit: BATCH_SIZE,
          p_offset: offset,
          p_category: categoryFilter,
        }
      );
      if (!error && data && data.length > 0) {
        setSkills((prev) => [...prev, ...(data as Skill[])]);
        setHasMore(data.length === BATCH_SIZE);
      } else {
        setHasMore(false);
      }
    } else {
      let query = supabase
        .from("skills")
        .select(
          "id, slug, title, short_description, category, preview_html, preview_external_url, cover_image_url, featured, created_at, updated_at"
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .range(offset, offset + BATCH_SIZE - 1);

      if (searchQuery) {
        const sanitized = sanitizeSearchQuery(searchQuery);
        if (sanitized.length > 0) {
          query = query.or(
            `title.ilike.%${sanitized}%,short_description.ilike.%${sanitized}%`
          );
        }
      }

      if (category) {
        const sanitizedCategory = sanitizeSearchQuery(category);
        if (sanitizedCategory.length > 0) {
          query = query.eq("category", sanitizedCategory);
        }
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        setSkills((prev) => [...prev, ...(data as Skill[])]);
        setHasMore(data.length === BATCH_SIZE);
      } else {
        setHasMore(false);
      }
    }

    setLoading(false);
  }, [loading, hasMore, sort, searchQuery, category, skills.length]);

  return (
    <div>
      {skills.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-border bg-card p-12 text-center">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
            {"// NO RESULTS"}
          </p>
          <p className="text-muted-foreground">
            No skills found. Try adjusting your search or filters.
          </p>
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 border-2 border-primary px-8 py-3 text-xs font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                LOADING...
              </>
            ) : (
              "LOAD MORE"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
