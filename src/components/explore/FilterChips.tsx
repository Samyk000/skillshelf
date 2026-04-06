"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";
import { CATEGORIES } from "@/lib/constants";

interface FilterChipsProps {
  categoryCounts: Record<string, number>;
}

export function FilterChips({ categoryCounts }: FilterChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

  const handleFilter = (category: string) => {
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
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleFilter(category)}
          aria-pressed={activeCategory === category}
          className={`shrink-0 inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-medium tracking-widest uppercase transition-all duration-200 ${
            activeCategory === category
              ? "border-primary text-primary"
              : "border-black/5 dark:border-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:border-black/10 dark:hover:border-white/10"
          }`}
        >
          {category}
          {categoryCounts[category] > 0 && (
            <span className="ml-1.5 font-mono text-[9px] text-black dark:text-white opacity-100 tabular-nums">
              {categoryCounts[category]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
