import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { SkillGridSkeleton } from "@/components/skills/SkillGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterChips } from "@/components/explore/FilterChips";
import { SearchBar } from "@/components/explore/SearchBar";
import { SortTabs } from "@/components/explore/SortTabs";
import { SkillsList } from "@/components/skills/SkillsList";
import { CATEGORIES } from "@/lib/constants";
import type { Skill } from "@/types/skill";

const HeroShowcase = dynamic(
  () => import("@/components/skills/HeroShowcase").then((mod) => ({ default: mod.HeroShowcase })),
  { loading: () => <Skeleton className="h-[500px] w-full rounded-lg" /> }
);

/**
 * Revalidate this page every 60 seconds.
 * Repeat visitors get edge-cached responses; new/updated skills
 * appear within a minute.
 */
export const revalidate = 60;

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;

async function HomeContent({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient();

  const columns =
    "id, slug, title, short_description, category, cover_image_url, preview_html, preview_external_url, featured, created_at, updated_at";

  const { data: showcaseData } = await supabase
    .from("skills")
    .select(columns)
    .eq("status", "published")
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(5);

  const showcaseSkills = (showcaseData as Skill[]) ?? [];

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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b-2 border-border py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: Copy */}
            <div className="flex flex-col items-start gap-5">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary">
                <span className="inline-block animate-spin-slow text-lg leading-none">
                  //
                </span>
                SKILL.MD LIBRARY
              </p>
              <h1 className="max-w-4xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                THE UI YOU IMAGINE.{" "}
                <span className="text-primary">THE CODE YOUR AI WRITES.</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                You know what looks good. Your AI doesn&apos;t. Give it a SKILL.md — a
                design blueprint with exact tokens, patterns, and rules. One copy.
                Pixel-perfect output.
              </p>
              <div className="flex items-center gap-4 text-[11px] tracking-wider text-muted-foreground">
                {[
                  { step: "01", title: "BROWSE" },
                  { step: "02", title: "PREVIEW" },
                  { step: "03", title: "COPY & USE" },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center gap-2">
                    <span className="font-bold text-primary">{item.step}</span>
                    <span className="font-semibold">{item.title}</span>
                    {index < 2 && <span className="text-border">/</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Showcase */}
            <HeroShowcase skills={showcaseSkills} />
          </div>
        </Container>
      </section>

      {/* Skills */}
      <section className="pt-6 pb-12">
        <Container>
          {/* New UI for categories, search, and sort */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left side: Categories (FilterChips) */}
            <div className="w-full overflow-x-auto pb-2 lg:w-auto lg:pb-0">
              <FilterChips categoryCounts={categoryCounts} />
            </div>

            {/* Right side: Search Bar & Sort */}
            <div className="flex w-full shrink-0 flex-row items-center justify-between gap-2 sm:gap-4 lg:w-auto lg:justify-end">
              <div className="flex-1 min-w-0">
                <SearchBar />
              </div>
              <div className="h-6 w-px bg-border/50 shrink-0" />
              <div className="shrink-0 w-28 sm:w-auto">
                <SortTabs />
              </div>
            </div>
          </div>
          <Suspense fallback={<SkillGridSkeleton count={12} />}>
            <SkillsList searchParams={searchParams} />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}

/**
 * Skeleton fallback for the entire home page while data is loading.
 */
function HomePageSkeleton() {
  return (
    <div className="flex flex-col">
      <section className="border-b-2 border-border py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-12 w-full max-w-md" />
              <Skeleton className="h-16 w-full max-w-xl" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </Container>
      </section>

      <section className="pt-6 pb-12">
        <Container>
          <div className="mb-8 flex justify-between gap-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-64" />
          </div>
          <SkillGridSkeleton count={10} />
        </Container>
      </section>
    </div>
  );
}

export default function HomePage(props: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent searchParams={props.searchParams} />
    </Suspense>
  );
}
