"use client";

import Link from "next/link";
import { toast } from "sonner";
import { downloadMarkdown } from "@/lib/download";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
  likeCount?: number;
  viewCount?: number;
}

export function SkillCard({ skill, likeCount, viewCount }: SkillCardProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(skill.skill_markdown);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadMarkdown(skill.slug, skill.skill_markdown);
    toast.success("Downloaded!");
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border-2 border-border bg-card transition-colors hover:border-primary">
      {/* Clickable Link Wrapper */}
      <Link href={`/skills/${skill.slug}`} className="flex flex-1 flex-col">
        {/* Preview */}
        {skill.cover_image_url ? (
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={skill.cover_image_url}
              alt={skill.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : skill.preview_html ? (
          <div className="aspect-[4/3] w-full overflow-hidden bg-white">
            <iframe
              srcDoc={skill.preview_html}
              sandbox="allow-scripts allow-same-origin"
              title={`Preview: ${skill.title}`}
              className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
            <span className="font-display text-lg font-bold tracking-wider text-muted-foreground">
              // {skill.category.toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      {/* Footer - Hidden by default, smooth pop-up on hover */}
      <div className="max-h-0 overflow-hidden border-t-2 border-transparent bg-card px-3 transition-all duration-300 ease-out group-hover:max-h-[60px] group-hover:border-border group-hover:py-2.5">
        <div className="flex items-center justify-between">
          <Link
            href={`/skills/${skill.slug}`}
            className="flex min-w-0 items-center gap-2"
          >
            <span className="shrink-0 border border-primary px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.1em] text-primary">
              {skill.category.toUpperCase()}
            </span>
            <h3 className="truncate text-xs font-bold tracking-wider text-foreground transition-colors group-hover:text-primary">
              {skill.title}
            </h3>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {/* View Count */}
            {viewCount !== undefined && viewCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] tracking-wider text-muted-foreground">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {viewCount}
              </span>
            )}

            {/* Like Count */}
            {likeCount !== undefined && likeCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] tracking-wider text-muted-foreground">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {likeCount}
              </span>
            )}

            {/* Open in Tab */}
            <a
              href={`/preview/${skill.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Open preview in new tab"
              className="border border-border p-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>

            {/* Copy */}
            <button
              onClick={handleCopy}
              aria-label="Copy SKILL.md"
              className="border border-border p-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect x="9" y="9" width="13" height="13" rx="0" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              aria-label="Download .md file"
              className="border border-border p-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
