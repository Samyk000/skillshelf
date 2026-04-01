"use client";

import { useEffect } from "react";

export default function StandaloneError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Standalone route error:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
        // PREVIEW ERROR
      </p>
      <h1 className="mb-4 font-display text-3xl font-bold tracking-wide">
        PREVIEW UNAVAILABLE
      </h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Unable to load this preview. The content may be temporarily unavailable.
      </p>
      <button
        onClick={reset}
        className="border-2 border-primary bg-primary px-6 py-2 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
