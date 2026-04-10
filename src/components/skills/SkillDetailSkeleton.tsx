import { Skeleton } from "@/components/ui/skeleton";

export function SkillDetailSkeleton() {
  return (
    <div className="mb-10 mt-6 flex flex-col gap-6 lg:flex-row">
      {/* Preview - Left */}
      <div className="min-w-0 flex-1">
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>

      {/* Details Sidebar - Right */}
      <div className="flex shrink-0 flex-col gap-5 lg:w-[260px]">
        {/* Category + Title */}
        <div>
          <Skeleton className="mb-2 h-5 w-16" />
          <Skeleton className="mb-2 h-7 w-3/4" />
          <Skeleton className="mb-1.5 h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Stats Row */}
        <Skeleton className="h-[50px] w-full" />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
