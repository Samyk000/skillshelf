import Link from "next/link";
import { Container } from "@/components/layout/Container";

const categories = [
  { name: "PAPER", count: 0 },
  { name: "MINIMAL SAAS", count: 0 },
  { name: "EDITORIAL", count: 0 },
  { name: "SOFT DASHBOARD", count: 0 },
  { name: "BRUTALIST", count: 0 },
  { name: "ENTERPRISE", count: 0 },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b-2 border-border py-20 md:py-32">
        <Container>
          <div className="flex flex-col items-start gap-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              // FREE DESIGN SKILL LIBRARY
            </p>
            <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              BROWSE. PREVIEW.{" "}
              <span className="text-primary">COPY.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
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
        </Container>
      </section>

      {/* Featured Skills Placeholder */}
      <section className="border-b-2 border-border py-16">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-2 border-border bg-card p-6 transition-colors hover:border-primary"
              >
                <div className="mb-4 h-4 w-24 animate-pulse bg-muted" />
                <div className="mb-2 h-3 w-full animate-pulse bg-muted" />
                <div className="h-3 w-3/4 animate-pulse bg-muted" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Skills will appear here once published from the admin panel.
          </p>
        </Container>
      </section>

      {/* How It Works */}
      <section className="border-b-2 border-border py-16">
        <Container>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
            // HOW IT WORKS
          </p>
          <h2 className="mb-12 font-display text-2xl font-bold tracking-wide md:text-3xl">
            THREE STEPS
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "BROWSE",
                description:
                  "Explore the library of curated design skills. Filter by category, search by keyword.",
              },
              {
                step: "02",
                title: "PREVIEW",
                description:
                  "See what the skill looks like. Live preview rendered in a sandboxed environment.",
              },
              {
                step: "03",
                title: "COPY & USE",
                description:
                  "Copy or download the SKILL.md file. Paste it directly into Claude, Cursor, or ChatGPT.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border-2 border-border bg-card p-8 transition-colors hover:border-primary"
              >
                <p className="mb-4 text-4xl font-bold text-primary font-display">
                  {item.step}
                </p>
                <h3 className="mb-2 font-display text-lg font-bold tracking-wider">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="border-b-2 border-border py-16">
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
