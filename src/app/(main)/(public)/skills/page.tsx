import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/explore/SearchBar";
import { FilterChips } from "@/components/explore/FilterChips";
import { SortDropdown } from "@/components/explore/SortDropdown";
import { SkillGridSkeleton } from "@/components/skills/SkillGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillsList } from "./SkillsList";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants";

export const metadata = {
  title: "Explore Skills",
  description: "Browse and search the full library of design skills.",
};

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const supabase = await createClient();

  // Fetch category counts
  const { data: countRows } = await supabase
    .from("skills")
    .select("category")
    .eq("status", "published");

  const categoryCounts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    categoryCounts[cat] = countRows?.filter((s) => s.category === cat).length ?? 0;
  }

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
          Browse the full collection. Filter by category or sort by popularity.
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
          <div className="flex flex-col gap-4 sm:flex-row">
            <SearchBar />
            <SortDropdown />
          </div>
          <FilterChips categoryCounts={categoryCounts} />
        </div>
      </Suspense>

      <Suspense fallback={<SkillGridSkeleton count={6} />}>
        <SkillsList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
