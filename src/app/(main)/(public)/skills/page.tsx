import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/explore/SearchBar";
import { FilterChips } from "@/components/explore/FilterChips";
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
      <Suspense fallback={<div className="mb-8 h-14 animate-pulse bg-muted" />}>
        <div className="mb-8 flex flex-col gap-4">
          <SearchBar />
          <FilterChips />
        </div>
      </Suspense>

      {/* Skills Grid */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="border-2 border-border bg-card animate-pulse"
              >
                <div className="aspect-video bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-20 bg-muted" />
                  <div className="h-5 w-3/4 bg-muted" />
                  <div className="h-3 w-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <SkillsList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
