"use client";

import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillGridSkeletonProps {
  count?: number;
}

export const SkillGridSkeleton = memo(function SkillGridSkeleton({ count = 9 }: SkillGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card/30"
        >
          {/* Exact Aspect Ratio Match for Skill Cards (16:9) */}
          <div className="aspect-[16/9] w-full animate-shimmer opacity-20" />
          
          {/* Metadata Footer Skeleton */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/10">
            <div className="flex items-center gap-2">
              {/* Title Placeholder */}
              <Skeleton className="h-3.5 w-24 rounded" />
              {/* Category Badge Placeholder */}
              <Skeleton className="h-3.5 w-12 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              {/* Stats Placeholders */}
              <Skeleton className="h-2.5 w-8 rounded" />
              <Skeleton className="h-2.5 w-8 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
