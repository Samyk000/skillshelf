"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "recent", label: "Recent" },
  { value: "views", label: "Popular" },
  { value: "likes", label: "Most Liked" },
];

export function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "recent";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative shrink-0 w-full">
      <select
        aria-label="Sort skills by"
        value={currentSort}
        onChange={handleChange}
        className="w-full h-9 appearance-none rounded-none border border-border/50 bg-muted/30 pl-3.5 pr-8 text-xs font-semibold tracking-wide text-foreground hover:bg-muted/50 focus:border-primary focus:bg-background focus:outline-none cursor-pointer focus:ring-1 focus:ring-primary"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
