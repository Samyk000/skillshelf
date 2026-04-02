import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { SkillCard } from "@/components/skills/SkillCard";
import { SkillGridSkeleton } from "@/components/skills/SkillGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
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

async function HomeContent() {
  const supabase = await createClient();

  const columns =
    "id, slug, title, short_description, category, cover_image_url, preview_html, preview_external_url, featured, created_at, updated_at";

  const [{ data: showcaseData }, { data: allSkillsData }] = await Promise.all([
    supabase
      .from("skills")
      .select(columns)
      .eq("status", "published")
      .eq("featured", true)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("skills")
      .select(columns)
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  const showcaseSkills = (showcaseData as Skill[]) ?? [];
  const allSkills = (allSkillsData as Skill[]) ?? [];

  // Fetch view/like counts for all displayed skills
  const allSkillIds = [...new Set([...showcaseSkills, ...allSkills].map(s => s.id))];
  const viewCountMap: Record<string, number> = {};
  const likeCountMap: Record<string, number> = {};

  if (allSkillIds.length > 0) {
    const [viewsResult, likesResult] = await Promise.all([
      supabase.from("skill_views").select("skill_id").in("skill_id", allSkillIds),
      supabase.from("skill_likes").select("skill_id").in("skill_id", allSkillIds),
    ]);

    for (const row of viewsResult.data ?? []) {
      viewCountMap[row.skill_id] = (viewCountMap[row.skill_id] ?? 0) + 1;
    }
    for (const row of likesResult.data ?? []) {
      likeCountMap[row.skill_id] = (likeCountMap[row.skill_id] ?? 0) + 1;
    }
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
      <section className="py-12">
        <Container>
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              // LIBRARY
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-wide md:text-3xl">
              SKILLS
            </h2>
          </div>
          {allSkills.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    viewCount={viewCountMap[skill.id] ?? 0}
                    likeCount={likeCountMap[skill.id] ?? 0}
                  />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  href="/skills"
                  className="inline-block border-2 border-primary bg-primary px-10 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
                >
                  EXPLORE ALL
                </Link>
              </div>
            </>
          ) : (
            <div className="border-2 border-border bg-card p-12 text-center">
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
                // NO SKILLS YET
              </p>
              <p className="text-sm text-muted-foreground">
                Skills will appear here once they are published.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Stay Tuned */}
      <section className="border-t-2 border-border py-16">
        <Container>
          <div className="border-2 border-primary bg-background p-10 text-center md:p-14">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
              // PRICING
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold tracking-wide text-foreground md:text-4xl">
              STAY TUNED
            </h2>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
              Enjoy free until it&apos;s paid. Once premium, many more skills will be
              uploaded.
            </p>
          </div>
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

      <section className="py-12">
        <Container>
          <div className="mb-8">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-8 w-32" />
          </div>
          <SkillGridSkeleton count={6} />
        </Container>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
