"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useRef, useCallback } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        startTransition(() => {
          const params = new URLSearchParams(searchParams.toString());
          if (value) {
            params.set("q", value);
          } else {
            params.delete("q");
          }
          router.push(`/skills?${params.toString()}`);
        });
      }, 300);
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="SEARCH SKILLS..."
        aria-label="Search skills"
        className="w-full border-2 border-input bg-background px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
