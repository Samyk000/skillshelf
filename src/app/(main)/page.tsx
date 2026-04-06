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
  { loading: () => (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#080808]">
      <div className="h-full w-full animate-shimmer opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-14 border-t border-white/10 bg-black/50" />
    </div>
  ) }
);

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

  const { count: totalSkills } = await supabase
    .from("skills")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

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
      <section className="reveal relative overflow-hidden border-b border-border pt-12 pb-14 md:pt-16 md:pb-20">
        {/* Background Decorations */}
        <div className="bg-grid absolute inset-0 opacity-[0.4]" />
        <div className="bg-grid-mask absolute inset-0" />
        <div className="bg-orb bg-orb-blue absolute -top-24 -left-24 h-96 w-96 opacity-[0.08]" />
        <div className="bg-orb bg-orb-violet absolute top-1/2 -right-48 h-[500px] w-[500px] -translate-y-1/2 opacity-[0.06]" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
            {/* Left: Copy */}
            <div className="flex flex-col items-start gap-8 lg:col-span-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase font-mono">
                  The Visual Genome for AI
                </span>
              </div>
              
              <div className="space-y-6">
                <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                  Your AI doesn&apos;t know Design. <br />
                  <span className="text-primary">
                    Now it does.
                  </span>
                </h1>
                <p className="max-w-xl text-xl leading-relaxed text-muted-foreground/80">
                  Bridge the gap between generic AI code and premium UI. Skillshelf provides the
                  proven blueprints your AI needs to build pixel-perfect interfaces with exact design DNA.
                </p>

                <div className="flex items-center gap-16 pt-2">
                  {[
                    { label: "Genomic Skills", value: (totalSkills ?? 37).toString() },
                    { label: "Output Accuracy", value: "99%" },
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                      <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Showcase */}
            <div className="lg:col-span-6 relative lg:ml-auto w-full max-w-2xl">
              <div className="bg-shape bg-shape-rect absolute -top-8 -right-8 h-32 w-32 animate-rotate-slow opacity-10" />
              <div className="bg-shape bg-shape-circle absolute -bottom-12 -left-12 h-48 w-48 animate-float-slow opacity-10" />
              <HeroShowcase skills={showcaseSkills} />
            </div>
          </div>
        </Container>
      </section>

      {/* Skills Section */}
      <section className="reveal pt-6 pb-12 md:pt-8 md:pb-16">
        <Container>
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
          <Suspense fallback={<SkillGridSkeleton count={9} />}>
            <SkillsList searchParams={searchParams} />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border pt-12 pb-20 md:pt-16 md:pb-32">
        <div className="bg-grid absolute inset-0 opacity-[0.4]" />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
            {/* Skeleton Left: Copy */}
            <div className="flex flex-col items-start gap-8 lg:col-span-6">
              <Skeleton className="h-8 w-48 rounded-full" />
              <div className="space-y-6 w-full">
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full max-w-lg" />
                  <Skeleton className="h-16 w-3/4" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="flex items-center gap-16 pt-2">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Right: Showcase */}
            <div className="lg:col-span-6 relative lg:ml-auto w-full max-w-2xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#080808]">
                <Skeleton className="h-full w-full opacity-50" />
                <div className="absolute inset-x-0 bottom-0 h-14 border-t border-white/10 bg-black/50" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-64" />
          </div>
          <SkillGridSkeleton count={9} />
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
