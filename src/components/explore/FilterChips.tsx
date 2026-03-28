"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CATEGORIES } from "@/lib/constants";

export function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const activeCategory = searchParams.get("category") ?? "";

  const handleFilter = (category: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === activeCategory) {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      router.push(`/skills?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleFilter(category)}
          className={`border-2 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors ${
            activeCategory === category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {category.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
