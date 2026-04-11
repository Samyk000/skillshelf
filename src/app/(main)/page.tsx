import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/layout/Container";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SkillGridSkeleton } from "@/components/skills/SkillGridSkeleton";
import { FilterChips } from "@/components/explore/FilterChips";
import { SearchBar } from "@/components/explore/SearchBar";
import { SortTabs } from "@/components/explore/SortTabs";
import { SkillsList } from "@/components/skills/SkillsList";
import { CATEGORIES } from "@/lib/constants";
import type { Skill } from "@/types/skill";

const HeroShowcase = dynamic(
  () => import("@/components/skills/HeroShowcase").then((mod) => ({ default: mod.HeroShowcase })),
  {
    loading: () => (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#080808]">
        <div className="h-full w-full animate-shimmer opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-14 border-t border-white/10 bg-black/50" />
      </div>
    )
  }
);

export const unstable_instant = {
  prefetch: 'static',
  samples: [{ searchParams: { q: null, category: null, sort: null } }]
};

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;

async function getHeroData() {
  "use cache";

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const columns =
    "id, slug, title, short_description, category, cover_image_url, preview_html, preview_external_url, featured, created_at, updated_at";

  const [{ data: showcaseData }, { count: totalSkills }, { data: counts }] = await Promise.all([
    supabase
      .from("skills")
      .select(columns)
      .eq("status", "published")
      .eq("featured", true)
      .order("updated_at", { ascending: false })
      .limit(20),
    supabase
      .from("skills")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.rpc("get_category_counts")
  ]);

  const categoryCounts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    categoryCounts[cat] = 0;
  }

  if (counts) {
    for (const row of counts) {
      if (row.category in categoryCounts) {
        categoryCounts[row.category] = Number(row.count);
      }
    }
  }

  return {
    showcaseSkills: (showcaseData as Skill[]) ?? [],
    totalSkills: totalSkills ?? 0,
    categoryCounts
  };
}

export default async function HomePage(props: { searchParams: SearchParams }) {
  const { showcaseSkills, totalSkills, categoryCounts } = await getHeroData();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="reveal relative overflow-hidden border-b border-border pt-6 pb-0 md:pt-8">
        {/* Background Decorations */}
        <div className="bg-grid absolute inset-0 opacity-[0.1]" />
        <div className="bg-grid-mask absolute inset-0" />
        <div className="bg-orb bg-orb-blue absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[500px] opacity-[0.1] blur-[80px]" />

        <Container className="relative z-10 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column: Mission Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 backdrop-blur-sm">
                <span className="relative flex h-1 w-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-1 w-1 rounded-full bg-primary"></span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase font-mono">
                  The Visual Genome for AI
                </span>
              </div>
              
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl text-foreground">
                  Your AI doesn&apos;t know Design. <br className="hidden md:block" />
                  <span className="bg-linear-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent">
                    Now it does.
                  </span>
                </h1>
                <p className="max-w-xl mx-auto lg:mx-0 text-sm md:text-base font-medium leading-relaxed text-foreground/80">
                  Bridge the gap between generic AI code and premium UI. Skillshelf provides the 
                  proven blueprints your AI needs to build pixel-perfect interfaces with exact design DNA.
                </p>

                <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 border-t border-border/10">
                  {[
                    { label: "Skills", value: (totalSkills ?? 0).toString() },
                    { label: "Accuracy", value: "99%" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <p className="text-xl font-bold tracking-tight text-foreground">{stat.value}</p>
                      <p className="text-[10px] font-bold tracking-[0.2em] text-foreground/50 uppercase">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Illustration */}
            <div className="relative w-full max-w-[380px] mx-auto lg:ml-auto lg:mr-0 order-1 lg:order-2">
              <div className="relative w-full group">
                <div className="absolute inset-x-4 inset-y-8 bg-primary/10 blur-[60px] rounded-full opacity-40 transition-opacity group-hover:opacity-60" />
                
                {/* Theme-Aware Illustrations (Theme Cross-fade + Flicker-free Blink) */}
                <div className="relative w-full overflow-hidden rounded-[2rem] group/blink">
                  {/* Light Illustration Stack */}
                  <div className="transition-opacity duration-500 ease-in-out dark:opacity-0 will-change-opacity">
                    {/* Baseline (Closed Eyes) - Always visible in this theme layer */}
                    <img 
                      src="/Heroillustration(White).jpg" 
                      alt="Skillshelf Genome" 
                      className="w-full h-auto object-contain ml-auto rounded-[2rem]"
                    />
                    {/* Hover Overlay (Open Eyes) - Cross-fades on top */}
                    <img 
                      src="/Heroillustration(White-OpenEyes).jpg" 
                      alt="Skillshelf Genome" 
                      className="absolute inset-0 w-full h-auto object-contain ml-auto rounded-[2rem] opacity-0 transition-opacity duration-300 ease-in-out group-hover/blink:opacity-100 will-change-opacity"
                    />
                  </div>
                  
                  {/* Dark Illustration Stack */}
                  <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 dark:opacity-100 will-change-opacity">
                    {/* Baseline (Closed Eyes) - Always visible in this theme layer */}
                    <img 
                      src="/Heroillustration(Dark).jpg" 
                      alt="Skillshelf Genome" 
                      className="w-full h-auto object-contain ml-auto rounded-[2rem]"
                    />
                    {/* Hover Overlay (Open Eyes) - Cross-fades on top */}
                    <img 
                      src="/Heroillustration(Dark-OpenEyes).jpg" 
                      alt="Skillshelf Genome" 
                      className="absolute inset-0 w-full h-auto object-contain ml-auto rounded-[2rem] opacity-0 transition-opacity duration-300 ease-in-out group-hover/blink:opacity-100 will-change-opacity"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Full-Width Showcase Strip */}
        <div className="mt-4 w-full relative group/marquee overflow-hidden py-4">
          <HeroShowcase skills={showcaseSkills} />
        </div>
      </section>

      {/* Skills Section */}
      <section className="reveal pt-6 pb-12 md:pt-8 md:pb-16">
        <Container>
          <Suspense fallback={<div className="h-10 w-full animate-pulse bg-muted rounded-md mb-8" />}>
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
          </Suspense>
          <Suspense fallback={<SkillGridSkeleton count={12} />}>
            <SkillsList searchParams={props.searchParams} />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}
