"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-[6px] hover:border-white/[0.12] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
      <Link href={`/skills/${skill.slug}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-muted/5">
        {skill.cover_image_url ? (
          <>
            {/* Background Blur Layer for consistent feel regardless of aspect ratio */}
            <Image
              src={skill.cover_image_url}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover opacity-30 blur-2xl transition-transform duration-700 ease-out group-hover:scale-110"
              aria-hidden="true"
            />
            {/* Foreground layer (NO CROP) */}
            <Image
              src={skill.cover_image_url}
              alt={skill.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="z-10 object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted/20 text-[10px] font-medium text-muted-foreground/40 tracking-wide">
            {skill.title}
          </div>
        )}
      </Link>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="font-display text-[16px] font-bold tracking-tight truncate text-foreground leading-none">
            {skill.title}
          </div>
          <span className="shrink-0 rounded-md bg-muted border border-black/10 dark:border-white/10 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[#000000] dark:text-[#FFFFFF] uppercase">
            {skill.category}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold text-[#000000] dark:text-[#FFFFFF] tabular-nums select-none shrink-0">
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            <span>{viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
