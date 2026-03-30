import { Container } from "@/components/layout/Container";

export default function AdminLoading() {
  return (
    <Container className="py-8">
      <div className="mb-8 animate-pulse">
        <div className="h-4 w-24 bg-muted" />
        <div className="mt-2 h-8 w-48 bg-muted" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse border-2 border-border bg-muted" />
        ))}
      </div>
    </Container>
  );
}
