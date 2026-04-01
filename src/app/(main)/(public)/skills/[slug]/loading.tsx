import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillDetailLoading() {
  return (
    <Container className="py-8">
      <div className="mb-6">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-10 w-96" />
        <Skeleton className="mt-3 h-4 w-64" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <Skeleton className="h-[500px] w-full" />
        </div>
        <div className="space-y-4 lg:w-[260px]">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </Container>
  );
}
