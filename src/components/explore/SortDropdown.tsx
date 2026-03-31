"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "recent";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/skills?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      aria-label="Sort skills by"
      className="border-2 border-border bg-background px-4 py-2.5 text-xs font-semibold tracking-wider uppercase focus:border-primary focus:outline-none"
    >
      <option value="recent">RECENT</option>
      <option value="views">MOST VIEWED</option>
      <option value="likes">MOST LIKED</option>
    </select>
  );
}
