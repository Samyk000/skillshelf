"use client";

import { memo } from "react";
import Link from "next/link";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
  likeCount?: number;
  viewCount?: number;
}

export const SkillCard = memo(function SkillCard({
  skill,
  likeCount = 0,
  viewCount = 0,
}: SkillCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
      {/* Image Container - Aspect 21/9 for maximum visual focus */}
      <Link href={`/skills/${skill.slug}`} className="relative block aspect-[16/7.5] w-full overflow-hidden bg-muted/5">
        {skill.cover_image_url ? (
          <img
            src={skill.cover_image_url}
            alt={skill.title}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted/20 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
            {skill.title}
          </div>
        )}
      </Link>

      {/* Ultra-Minimalist Footer */}
      <div className="flex items-center justify-between px-3 py-2.5">
        {/* Left: Title & Category */}
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-display text-[13px] font-bold tracking-tight truncate text-foreground group-hover:text-primary transition-colors">
            {skill.title}
          </h3>
          <span className="shrink-0 border border-border px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground uppercase tracking-wider rounded-[2px] bg-muted/20">
            {skill.category}
          </span>
        </div>

        {/* Right: Clean Stats (Matching Title Color) */}
        <div className="flex items-center gap-3 text-[11px] font-bold text-foreground tabular-nums select-none shrink-0">
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            <span>{viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
