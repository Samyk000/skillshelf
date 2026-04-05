import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillDetailLoading() {
  return (
    <Container className="py-8">
      {/* Back Button Placeholder */}
      <div className="mb-6">
        <Skeleton className="h-9 w-24 opacity-20" />
      </div>

      {/* Main Content: Preview (left) + Details (right) */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row">
        {/* Preview - Left */}
        <div className="min-w-0 flex-1">
          <Skeleton className="aspect-[16/10] w-full rounded-lg bg-muted/20 lg:aspect-video lg:h-[500px]" />
        </div>

        {/* Details Sidebar - Right */}
        <div className="flex shrink-0 flex-col gap-5 lg:w-[260px]">
          {/* Category + Title */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-24 opacity-40" />
            <Skeleton className="h-8 w-full opacity-80" />
            <Skeleton className="h-16 w-full opacity-40" />
          </div>

          {/* Stats Row Placeholder */}
          <div className="grid grid-cols-3 border-y-2 border-border/10 py-3">
            <Skeleton className="mx-auto h-5 w-10 opacity-20" />
            <div className="border-x-2 border-border/10">
              <Skeleton className="mx-auto h-5 w-10 opacity-20" />
            </div>
            <Skeleton className="mx-auto h-5 w-10 opacity-20" />
          </div>

          {/* Actions Stack */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-full opacity-60" />
            <Skeleton className="h-12 w-full opacity-40" />
          </div>
        </div>
      </div>

      {/* Related Skills Section */}
      <div className="border-t-2 border-border/10 pt-8">
        <Skeleton className="mb-2 h-4 w-20 opacity-30" />
        <Skeleton className="mb-6 h-8 w-64 opacity-50" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border-2 border-border/10 bg-card/50 p-5">
              <Skeleton className="mb-2 h-4 w-20 opacity-20" />
              <Skeleton className="mb-2 h-6 w-3/4 opacity-40" />
              <Skeleton className="h-10 w-full opacity-20" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
