"use client";

import Link from "next/link";
import { toast } from "sonner";
import { downloadMarkdown } from "@/lib/download";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
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
    <div className="group relative flex flex-col border-2 border-border bg-card transition-colors hover:border-primary">
      {/* Open in Tab Icon - Top Right */}
      <a
        href={`/preview/${skill.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title="Open preview in new tab"
        className="absolute right-2 top-2 z-10 border-2 border-border bg-background/90 p-1.5 text-muted-foreground opacity-0 transition-all hover:border-primary hover:text-primary group-hover:opacity-100"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
        </svg>
      </a>

      {/* Clickable Link Wrapper */}
      <Link href={`/skills/${skill.slug}`} className="flex flex-1 flex-col">
        {/* Preview - Larger Area */}
        {skill.cover_image_url ? (
          <div className="aspect-[4/3] w-full overflow-hidden border-b-2 border-border">
            <img
              src={skill.cover_image_url}
              alt={skill.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : skill.preview_html ? (
          <div className="aspect-[4/3] w-full overflow-hidden border-b-2 border-border bg-white">
            <iframe
              srcDoc={skill.preview_html}
              sandbox="allow-scripts"
              title={`Preview: ${skill.title}`}
              className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center border-b-2 border-border bg-muted">
            <span className="text-lg font-display font-bold text-muted-foreground tracking-wider">
              // {skill.category.toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      {/* Footer with Title + Action Icons */}
      <div className="flex items-center justify-between gap-2 border-t-2 border-border px-3 py-2.5">
        <Link href={`/skills/${skill.slug}`} className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 border border-primary px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.1em] text-primary">
            {skill.category.toUpperCase()}
          </span>
          <h3 className="truncate text-xs font-bold tracking-wider text-foreground group-hover:text-primary transition-colors">
            {skill.title}
          </h3>
        </Link>

        {/* Copy & Download Icons - Bottom Right */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleCopy}
            title="Copy SKILL.md"
            className="border border-border p-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="9" y="9" width="13" height="13" rx="0" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            title="Download .md file"
            className="border border-border p-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
