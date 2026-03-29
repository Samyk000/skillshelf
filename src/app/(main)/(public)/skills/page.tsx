import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/explore/SearchBar";
import { FilterChips } from "@/components/explore/FilterChips";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillsList } from "./SkillsList";

export const metadata = {
  title: "Explore Skills",
  description: "Browse and search the full library of design skills.",
};

function SkillGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="border-2 border-border bg-card overflow-hidden"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  return (
    <Container className="py-12">
      {/* Header */}
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

      {/* Search + Filter */}
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

      {/* Skills Grid */}
      <Suspense fallback={<SkillGridSkeleton />}>
        <SkillsList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
