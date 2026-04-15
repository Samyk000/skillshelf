"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/sanitize";
import { SkillCard } from "@/components/skills/SkillCard";
import { SkillGridSkeleton } from "@/components/skills/SkillGridSkeleton";
import type { Skill } from "@/types/skill";

const BATCH_SIZE = 8;

interface SkillsListClientProps {
  initialSkills: Skill[];
  initialHasMore: boolean;
  initialViewCounts: Record<string, number>;
  initialLikeCounts: Record<string, number>;
  searchQuery?: string;
  category?: string;
  sort?: string;
}

export function SkillsListClient({
  initialSkills,
  initialHasMore,
  initialViewCounts,
  initialLikeCounts,
  searchQuery,
  category,
  sort,
}: SkillsListClientProps) {
  const searchParamsHook = useSearchParams();
  const currentClientQuery = searchParamsHook.get("q") ?? "";
  const currentClientCategory = searchParamsHook.get("category") ?? "";
  const currentClientSort = searchParamsHook.get("sort") ?? "";

  const supabase = useMemo(() => createClient(), []);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialSkills.length);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>(initialViewCounts);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(initialLikeCounts);
  const [clientPending, setClientPending] = useState(false);

  useEffect(() => {
    const handleFilterStart = () => setClientPending(true);
    window.addEventListener("on-filter-start", handleFilterStart);
    return () => window.removeEventListener("on-filter-start", handleFilterStart);
  }, []);

  // Keep a copy of the default, unfiltered skills for instant recall
  const defaultCache = useRef<{
    skills: Skill[];
    hasMore: boolean;
    viewCounts: Record<string, number>;
    likeCounts: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    // If there's no search query or category, this is our default state
    if (!searchQuery && !category && (!sort || sort === "recent")) {
      defaultCache.current = {
        skills: initialSkills,
        hasMore: initialHasMore,
        viewCounts: initialViewCounts,
        likeCounts: initialLikeCounts,
      };
    }
    
    // Sync state when props change. This replaces the full remount behavior.
    setClientPending(false);
    setSkills(initialSkills);
    setHasMore(initialHasMore);
    setOffset(initialSkills.length);
    setViewCounts(initialViewCounts);
    setLikeCounts(initialLikeCounts);
  }, [initialSkills, initialHasMore, initialViewCounts, initialLikeCounts, searchQuery, category, sort]);

  // If client query from URL doesn't match the server prop searchQuery,
  // we are in the middle of a Next.js transition fetching new data.
  const isPendingSearch = currentClientQuery !== (searchQuery ?? "");
  const isPendingCategory = currentClientCategory !== (category ?? "");
  const isPendingSort = currentClientSort !== (sort ?? "");
  const isPendingTransition = isPendingSearch || isPendingCategory || isPendingSort || clientPending;

  // Instant recall: if clearing search, instantly show cache if available
  const displaySkills = (isPendingTransition && !currentClientQuery && !currentClientCategory && defaultCache.current)
    ? defaultCache.current.skills
    : skills;
  const displayViewCounts = (isPendingTransition && !currentClientQuery && !currentClientCategory && defaultCache.current)
    ? defaultCache.current.viewCounts
    : viewCounts;
  const displayLikeCounts = (isPendingTransition && !currentClientQuery && !currentClientCategory && defaultCache.current)
    ? defaultCache.current.likeCounts
    : likeCounts;
  const displayHasMore = (isPendingTransition && !currentClientQuery && !currentClientCategory && defaultCache.current)
    ? defaultCache.current.hasMore
    : hasMore;

  const fetchCounts = useCallback(async (skillIds: string[]) => {
    if (skillIds.length === 0) return;

    const { data: countsData, error } = await supabase.rpc("get_skills_counts", {
      p_skill_ids: skillIds
    });

    if (error || !countsData) return;

    const newViewCounts: Record<string, number> = {};
    const newLikeCounts: Record<string, number> = {};

    for (const row of countsData) {
      newViewCounts[row.skill_id] = Number(row.view_count || 0);
      newLikeCounts[row.skill_id] = Number(row.like_count || 0);
    }

    setViewCounts((prev) => ({ ...prev, ...newViewCounts }));
    setLikeCounts((prev) => ({ ...prev, ...newLikeCounts }));
  }, [supabase]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const categoryFilter = category
      ? sanitizeSearchQuery(category) || null
      : null;

    let newSkills: Skill[] = [];

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
        newSkills = data as Skill[];
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
        newSkills = data as Skill[];
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
        newSkills = data as Skill[];
        setHasMore(data.length === BATCH_SIZE);
      } else {
        setHasMore(false);
      }
    }

    if (newSkills.length > 0) {
      setSkills((prev) => [...prev, ...newSkills]);
      setOffset((prev) => prev + newSkills.length);
      fetchCounts(newSkills.map(s => s.id));
    }

    setLoading(false);
  }, [loading, hasMore, offset, sort, searchQuery, category, supabase, fetchCounts]);

  if (isPendingTransition && (currentClientQuery || currentClientCategory || currentClientSort || clientPending)) {
    return (
      <div>
        <SkillGridSkeleton count={12} />
      </div>
    );
  }

  return (
    <div>
      {displaySkills.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displaySkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              viewCount={displayViewCounts[skill.id] ?? 0}
              likeCount={displayLikeCounts[skill.id] ?? 0}
            />
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

      {displayHasMore && !isPendingTransition && (
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
