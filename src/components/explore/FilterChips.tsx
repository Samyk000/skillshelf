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
  const [isPending, startTransition] = useTransition();
  const activeCategory = searchParams.get("category") ?? "";

  const handleFilter = (category: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === activeCategory || category === "") {
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
          className={`shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-none border px-3 h-7 text-[10px] sm:px-4 sm:h-9 sm:text-xs font-semibold tracking-wide transition-all ${
            activeCategory === category
              ? "border-primary bg-primary/20 text-primary"
              : "border-border/50 text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:border-border"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
