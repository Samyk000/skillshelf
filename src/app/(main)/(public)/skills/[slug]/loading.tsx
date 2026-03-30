import { Container } from "@/components/layout/Container";

export default function SkillDetailLoading() {
  return (
    <Container className="py-8">
      <div className="mb-6 animate-pulse">
        <div className="h-4 w-48 bg-muted" />
      </div>
      <div className="mb-6 animate-pulse">
        <div className="h-6 w-32 bg-muted" />
        <div className="mt-2 h-10 w-96 bg-muted" />
        <div className="mt-3 h-4 w-64 bg-muted" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 animate-pulse">
          <div className="h-[500px] border-2 border-border bg-muted" />
        </div>
        <div className="lg:w-[260px] animate-pulse space-y-4">
          <div className="h-8 w-full bg-muted" />
          <div className="h-20 w-full bg-muted" />
          <div className="h-12 w-full bg-muted" />
          <div className="h-12 w-full bg-muted" />
          <div className="h-12 w-full bg-muted" />
        </div>
      </div>
    </Container>
  );
}
