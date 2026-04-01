import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <Container className="py-8">
      <div className="mb-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-8 w-48" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </Container>
  );
}
