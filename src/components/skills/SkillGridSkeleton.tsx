import { Skeleton } from "@/components/ui/skeleton";

interface SkillGridSkeletonProps {
  count?: number;
}

export function SkillGridSkeleton({ count = 6 }: SkillGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden border-2 border-border bg-card"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
