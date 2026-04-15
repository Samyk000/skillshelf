"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CATEGORIES } from "@/lib/constants";

interface FilterChipsProps {
  categoryCounts: Record<string, number>;
}

export function FilterChips({ categoryCounts }: FilterChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";
  const [isPending, startTransition] = useTransition();

  const handleFilter = (category: string) => {
    window.dispatchEvent(new Event("on-filter-start"));
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === activeCategory) {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            aria-pressed={isActive}
            disabled={isPending}
            className={`shrink-0 inline-flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-xl border text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-[1.02]"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted"
            } ${isPending ? "opacity-70 pointer-events-none" : ""}`}
          >
            {category}
            {categoryCounts[category] > 0 && (
              <span
                className={`ml-2 font-mono text-[10px] tabs-nums rounded-md px-1.5 py-0.5 ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted-foreground/10 text-muted-foreground"
                }`}
              >
                {categoryCounts[category]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
