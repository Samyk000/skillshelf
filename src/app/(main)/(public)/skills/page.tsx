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
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold tracking-wide md:text-4xl">
        EXPLORE
      </h1>

      <Suspense
        fallback={
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-72" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </div>
        }
      >
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <SearchBar />
            <SortTabs />
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
