"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useRef, useCallback } from "react";
import { Search } from "lucide-react";

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
          router.push(`/?${params.toString()}`, { scroll: false });
        });
      }, 300);
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="relative flex-1 w-full sm:w-auto">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        aria-label="Search skills"
        className="h-9 w-full min-w-0 md:min-w-[200px] md:w-[300px] rounded-xl border border-border bg-surface/50 px-4 py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 hover:bg-surface focus:border-primary/50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      )}
    </div>
  );
}
