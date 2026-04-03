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
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        aria-label="Search skills"
        className="h-9 w-full min-w-0 md:min-w-[200px] md:w-[300px] rounded-none border border-border/50 bg-muted/30 px-4 py-2 pl-9 pr-4 text-xs font-medium tracking-wide text-foreground placeholder:text-muted-foreground transition-all hover:bg-muted/50 focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
