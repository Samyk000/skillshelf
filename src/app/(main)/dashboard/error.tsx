"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <Container className="py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // ERROR
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-wide">
          DASHBOARD ERROR
        </h2>
      </div>

      <div className="border-2 border-border bg-card p-8 text-center">
        <p className="mb-4 text-muted-foreground">
          An unexpected error occurred while loading your dashboard.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="border-2 border-primary bg-primary px-6 py-2 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
          >
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="border-2 border-border px-6 py-2 text-sm font-bold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
          >
            GO HOME
          </Link>
        </div>
      </div>
    </Container>
  );
}
