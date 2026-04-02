import { Container } from "@/components/layout/Container";
import { SkillGridSkeleton } from "@/components/skills/SkillGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsLoading() {
  return (
    <Container className="pt-6 pb-12 sm:pt-8">
      <Skeleton className="h-8 w-24 sm:h-10 sm:w-32" />
      <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:gap-5">
        <div className="flex gap-2 sm:gap-4">
          <Skeleton className="h-10 flex-1 sm:h-11" />
          <Skeleton className="h-10 w-36 sm:h-11 sm:w-48" />
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 sm:h-9 sm:w-24" />
          ))}
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <SkillGridSkeleton count={6} />
      </div>
    </Container>
  );
}
