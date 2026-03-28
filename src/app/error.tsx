"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center justify-center py-32">
      <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
        // ERROR
      </p>
      <h1 className="mb-4 font-display text-4xl font-bold tracking-wide">
        SOMETHING WENT WRONG
      </h1>
      <p className="mb-8 text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="border-2 border-primary bg-primary px-8 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
      >
        TRY AGAIN
      </button>
    </Container>
  );
}
