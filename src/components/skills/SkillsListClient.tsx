"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/sanitize";
import { SkillCard } from "@/components/skills/SkillCard";
import { SkillGridSkeleton } from "@/components/skills/SkillGridSkeleton";
import type { Skill } from "@/types/skill";

const BATCH_SIZE = 6;

interface SkillsListClientProps {
  initialSkills: Skill[];
  initialHasMore: boolean;
  searchQuery?: string;
  category?: string;
}

export function SkillsListClient({
  initialSkills,
  initialHasMore,
  searchQuery,
  category,
}: SkillsListClientProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    const supabase = createClient();
    const from = skills.length;
    const to = from + BATCH_SIZE - 1;

    let query = supabase
      .from("skills")
      .select(
        "id, slug, title, short_description, category, tags, preview_html, preview_external_url, cover_image_url, featured, created_at, updated_at"
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchQuery) {
      const sanitized = sanitizeSearchQuery(searchQuery);
      if (sanitized.length > 0) {
        query = query.or(
          `title.ilike.%${sanitized}%,short_description.ilike.%${sanitized}%,tags.cs.{${sanitized}}`
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

    loadingRef.current = false;
    setLoading(false);
  }, [hasMore, searchQuery, category, skills.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

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

      {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}

      {loading && (
        <div className="mt-6">
          <SkillGridSkeleton count={BATCH_SIZE} />
        </div>
      )}
    </div>
  );
}
