import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillGridSkeletonProps {
  count?: number;
}

export const SkillGridSkeleton = memo(function SkillGridSkeleton({ count = 6 }: SkillGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border-2 border-border bg-card"
        >
          <Skeleton className="aspect-[4/3] w-full" />
        </div>
      ))}
    </div>
  );
});
