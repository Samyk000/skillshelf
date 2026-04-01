"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

export default function SkillDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Skill detail error:", error);
    }
  }, [error]);

  return (
    <Container className="py-12">
      <nav className="mb-6 flex items-center gap-2 text-xs tracking-wider text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          HOME
        </Link>
        <span>/</span>
        <Link href="/skills" className="hover:text-primary">
          SKILLS
        </Link>
        <span>/</span>
        <span className="text-primary">ERROR</span>
      </nav>

      <div className="border-2 border-border bg-card p-8 text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
          // SKILL NOT FOUND
        </p>
        <h2 className="mb-4 font-display text-2xl font-bold tracking-wide">
          COULD NOT LOAD SKILL
        </h2>
        <p className="mb-6 text-muted-foreground">
          This skill may have been removed or is temporarily unavailable.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="border-2 border-primary bg-primary px-6 py-2 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
          >
            TRY AGAIN
          </button>
          <Link
            href="/skills"
            className="border-2 border-border px-6 py-2 text-sm font-bold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
          >
            BROWSE SKILLS
          </Link>
        </div>
      </div>
    </Container>
  );
}
