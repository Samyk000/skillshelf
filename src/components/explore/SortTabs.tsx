"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "recent", label: "RECENT" },
  { value: "views", label: "VIEWED" },
  { value: "likes", label: "LIKED" },
];

export function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "recent";

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/skills?${params.toString()}`);
  };

  return (
    <div
      role="tablist"
      aria-label="Sort skills by"
      className="flex shrink-0 gap-0"
    >
      {SORT_OPTIONS.map((option, index) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={currentSort === option.value}
          onClick={() => handleClick(option.value)}
          className={`border-y-2 border-r-2 px-3 py-2.5 text-[9px] font-bold tracking-wider uppercase transition-colors first:rounded-l last:rounded-r last:border-r-2 sm:px-4 sm:text-[10px] ${
            index === 0 ? "border-l-2" : ""
          } ${
            currentSort === option.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
