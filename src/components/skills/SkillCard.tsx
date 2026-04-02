"use client";

import { memo, useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { downloadMarkdown } from "@/lib/download";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
  likeCount?: number;
  viewCount?: number;
}

export const SkillCard = memo(function SkillCard({
  skill,
  likeCount,
  viewCount,
}: SkillCardProps) {
  const supabase = useMemo(() => createClient(), []);
  const [isVisible, setIsVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const fetchSkillMarkdown = async (): Promise<string | null> => {
    if (skill.skill_markdown) return skill.skill_markdown;

    setFetching(true);
    const { data, error } = await supabase
      .from("skills")
      .select("skill_markdown")
      .eq("id", skill.id)
      .single();

    setFetching(false);

    if (error || !data) {
      toast.error("Failed to fetch skill content");
      return null;
    }

    return data.skill_markdown;
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const content = await fetchSkillMarkdown();
    if (!content) return;

    try {
      navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Copied to clipboard!");
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const content = await fetchSkillMarkdown();
    if (!content) return;

    downloadMarkdown(skill.slug, content);
    toast.success("Downloaded!");
  };

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded-lg border-2 border-border bg-card transition-colors hover:border-primary"
    >
      <Link href={`/skills/${skill.slug}`} className="flex flex-1 flex-col">
        {skill.cover_image_url ? (
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={skill.cover_image_url}
              alt={skill.title}
              width={400}
              height={300}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : skill.preview_html ? (
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            {isVisible ? (
              <iframe
                srcDoc={skill.preview_html}
                sandbox="allow-scripts allow-popups"
                title={`Preview: ${skill.title}`}
                className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0 opacity-0 transition-opacity duration-300"
                loading="lazy"
                onLoad={(e) => {
                  e.currentTarget.classList.remove("opacity-0");
                  e.currentTarget.classList.add("opacity-100");
                }}
              />
            ) : (
              <SkillCardSkeleton />
            )}
          </div>
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
            <span className="font-display text-lg font-bold tracking-wider text-muted-foreground">
              {`// ${skill.category.toUpperCase()}`}
            </span>
          </div>
        )}
      </Link>

      {/* Hover Overlay — 2-row layout */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full border-t-2 border-transparent bg-card/90 backdrop-blur-sm transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:border-border">
        {/* Row 1: Category + View/Like counts */}
        <div className="flex items-center justify-between px-3 pt-2">
          <Link
            href={`/skills/${skill.slug}`}
            className="shrink-0 border border-primary px-2 py-0.5 text-[9px] font-semibold tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {skill.category.toUpperCase()}
          </Link>

          <div className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] tracking-wider text-foreground" aria-label={`${viewCount ?? 0} views`}>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {viewCount ?? 0}
            </span>
            <span className="flex items-center gap-1 text-[10px] tracking-wider text-foreground" aria-label={`${likeCount ?? 0} likes`}>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {likeCount ?? 0}
            </span>
          </div>
        </div>

        {/* Row 2: Title + Action icons */}
        <div className="flex items-center justify-between px-3 pt-1.5 pb-2.5">
          <Link
            href={`/skills/${skill.slug}`}
            className="min-w-0 flex-1"
          >
            <h3 className="truncate text-xs font-bold tracking-wider text-foreground transition-colors group-hover:text-primary">
              {skill.title}
            </h3>
          </Link>

          <div className="flex shrink-0 items-center gap-2.5">
            {/* Open in new tab */}
            <a
              href={`/preview/${skill.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${skill.title} preview in new tab`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>

            {/* Copy */}
            <button
              onClick={handleCopy}
              disabled={fetching}
              aria-label="Copy SKILL.md"
              className="text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
            >
              {fetching ? (
                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="0" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={fetching}
              aria-label="Download .md file"
              className="text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
            >
              {fetching ? (
                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

function SkillCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted p-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-3 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="mt-2 h-24 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
