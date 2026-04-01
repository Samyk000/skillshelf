"use client";

import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillPreviewProps {
  previewHtml: string;
  title: string;
  slug: string;
}

export function SkillPreview({ previewHtml, title, slug }: SkillPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load iframe when the preview section enters the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="border-2 border-border">
      <div className="flex items-center justify-between border-b-2 border-border bg-muted px-4 py-2">
        <span className="text-xs font-semibold tracking-[0.15em] text-primary">
          // PREVIEW
        </span>
        <a
          href={`/preview/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          OPEN FULL PREVIEW
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
      </div>
      <div className="relative h-[480px] w-full bg-white">
        {isVisible ? (
          <iframe
            srcDoc={previewHtml}
            sandbox="allow-scripts allow-popups"
            title={`Preview: ${title}`}
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <PreviewSkeleton />
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for the detail-page preview while it loads.
 */
function PreviewSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted p-8">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="mt-4 h-40 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/5" />
    </div>
  );
}
