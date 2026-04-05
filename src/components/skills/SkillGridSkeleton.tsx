import { memo } from "react";

interface SkillGridSkeletonProps {
  count?: number;
}

export const SkillGridSkeleton = memo(function SkillGridSkeleton({ count = 9 }: SkillGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card/50"
        >
          {/* Image Placeholder 16/7.5 */}
          <div className="aspect-[16/7.5] w-full animate-pulse bg-muted/20" />
          
          {/* Content Placeholder side-by-side */}
          <div className="flex items-center justify-between p-3 border-t border-border/10">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted/20" />
              <div className="h-2 w-1/2 animate-pulse rounded bg-muted/10" />
            </div>
            <div className="w-20 space-y-2">
              <div className="ml-auto h-2 w-12 animate-pulse rounded bg-muted/20" />
              <div className="flex justify-end gap-1.5">
                <div className="h-5 w-5 animate-pulse rounded bg-muted/10" />
                <div className="h-5 w-5 animate-pulse rounded bg-muted/10" />
                <div className="h-5 w-5 animate-pulse rounded bg-muted/10" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
