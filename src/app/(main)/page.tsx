import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { SkillCard } from "@/components/skills/SkillCard";
import type { Skill } from "@/types/skill";

const categories = [
  { name: "PAPER" },
  { name: "MINIMAL SAAS" },
  { name: "EDITORIAL" },
  { name: "SOFT DASHBOARD" },
  { name: "BRUTALIST" },
  { name: "ENTERPRISE" },
];

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured skills
  const { data: featuredSkills } = await supabase
    .from("skills")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const skills = (featuredSkills as Skill[]) ?? [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b-2 border-border py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col items-start gap-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary">
                // FREE DESIGN SKILL LIBRARY
              </p>
              <h1 className="max-w-4xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                BROWSE. PREVIEW.{" "}
                <span className="text-primary">COPY.</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                A curated collection of design skills for your AI tools. Each skill
                includes a SKILL.md file, live preview, and one-click copy or download.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/skills"
                  className="border-2 border-primary bg-primary px-8 py-3 text-center text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
                >
                  EXPLORE SKILLS
                </Link>
                <Link
                  href="/signup"
                  className="border-2 border-border px-8 py-3 text-center text-sm font-bold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { step: "01", title: "BROWSE", description: "Explore the library" },
                { step: "02", title: "PREVIEW", description: "See it in action" },
                { step: "03", title: "COPY & USE", description: "One-click download" },
              ].map((item) => (
                <div key={item.step} className="flex items-baseline gap-3">
                  <span className="text-sm font-bold text-primary font-display">
                    {item.step}
                  </span>
                  <span className="text-sm font-bold tracking-wider text-foreground">
                    {item.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    — {item.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Skills */}
      <section className="border-b-2 border-border py-10">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-primary">
                // FEATURED
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-wide md:text-3xl">
                CURATED SKILLS
              </h2>
            </div>
            <Link
              href="/skills"
              className="border-2 border-border px-4 py-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
            >
              VIEW ALL
            </Link>
          </div>
          {skills.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="border-2 border-border bg-card p-12 text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-2">
                // NO FEATURED SKILLS YET
              </p>
              <p className="text-sm text-muted-foreground">
                Mark skills as featured from the admin panel to see them here.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Categories */}
      <section className="border-b-2 border-border py-10">
        <Container>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
            // CATEGORIES
          </p>
          <h2 className="mb-8 font-display text-2xl font-bold tracking-wide md:text-3xl">
            BROWSE BY STYLE
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/skills?category=${encodeURIComponent(cat.name)}`}
                className="border-2 border-border bg-card p-4 text-center transition-colors hover:border-primary"
              >
                <p className="text-sm font-bold tracking-wider text-foreground">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="border-2 border-primary bg-card p-12 text-center">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
              // GET STARTED
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold tracking-wide md:text-4xl">
              READY TO EXPLORE?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
              Browse the full library of design skills, preview them live, and
              download the ones you need.
            </p>
            <Link
              href="/skills"
              className="inline-block border-2 border-primary bg-primary px-12 py-4 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
            >
              EXPLORE ALL SKILLS
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
