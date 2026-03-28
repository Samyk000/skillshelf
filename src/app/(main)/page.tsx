import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { SkillCard } from "@/components/skills/SkillCard";
import { HeroShowcase } from "@/components/skills/HeroShowcase";
import type { Skill } from "@/types/skill";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: showcaseData }, { data: allSkillsData }] = await Promise.all([
    supabase
      .from("skills")
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("skills")
      .select("*")
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  const showcaseSkills = (showcaseData as Skill[]) ?? [];
  const allSkills = (allSkillsData as Skill[]) ?? [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b-2 border-border py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: Copy */}
            <div className="flex flex-col items-start gap-6">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary">
                <span className="inline-block animate-spin-slow text-lg leading-none">
                  //
                </span>
                FREE DESIGN SKILL LIBRARY
              </p>
              <h1 className="max-w-4xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                YOUR AI CODES.{" "}
                <span className="text-primary">YOUR DESIGN.</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Stop shipping ugly. Get SKILL.md files that turn your AI-generated
                code into premium, pixel-perfect UI. No more basic mess — just clean,
                intentional design that actually looks good.
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
                  <SkillCard key={skill.id} skill={skill} />
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
          <div className="border-2 border-primary bg-card p-10 text-center md:p-14">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
              // PRICING
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold tracking-wide md:text-4xl">
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
