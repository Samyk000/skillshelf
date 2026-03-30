import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/explore/SearchBar";
import { FilterChips } from "@/components/explore/FilterChips";
import { SkillGridSkeleton } from "@/components/skills/SkillGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillsList } from "./SkillsList";

export const metadata = {
  title: "Explore Skills",
  description: "Browse and search the full library of design skills.",
};

export default function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  return (
    <Container className="py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // EXPLORE
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-wide md:text-4xl">
          ALL SKILLS
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse the full collection. Filter by category or search by keyword.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="mb-8 flex flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </div>
        }
      >
        <div className="mb-8 flex flex-col gap-4">
          <SearchBar />
          <FilterChips />
        </div>
      </Suspense>

      <Suspense fallback={<SkillGridSkeleton count={6} />}>
        <SkillsList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
