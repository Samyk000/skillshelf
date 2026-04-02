import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/explore/SearchBar";
import { FilterChips } from "@/components/explore/FilterChips";
import { SortTabs } from "@/components/explore/SortTabs";
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

  const categoryCounts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    categoryCounts[cat] = 0;
  }

  try {
    const { data: counts } = await supabase.rpc("get_category_counts");
    if (counts) {
      for (const row of counts) {
        if (row.category in categoryCounts) {
          categoryCounts[row.category] = Number(row.count);
        }
      }
    }
  } catch {
    // RPC not available yet, use defaults
  }

  return (
    <Container className="pt-6 pb-12 sm:pt-8">
      <h1 className="font-display text-2xl font-bold tracking-wide sm:text-3xl md:text-4xl">
        SKILLS
      </h1>

      <Suspense
        fallback={
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
        }
      >
        <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:gap-5">
          {/* Search bar + Sort tabs on same line */}
          <div className="flex items-center gap-2 sm:gap-4">
            <SearchBar />
            <SortTabs />
          </div>

          {/* Category chips */}
          <FilterChips categoryCounts={categoryCounts} />
        </div>
      </Suspense>

      <Suspense fallback={<div className="mt-5 sm:mt-6"><SkillGridSkeleton count={6} /></div>}>
        <div className="mt-5 sm:mt-6">
          <SkillsList searchParams={searchParams} />
        </div>
      </Suspense>
    </Container>
  );
}
