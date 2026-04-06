"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "recent", label: "Recent" },
  { value: "views", label: "Popular" },
  { value: "likes", label: "Most Liked" },
];

export function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentSortValue = searchParams.get("sort") ?? "recent";
  const currentSort = SORT_OPTIONS.find((opt) => opt.value === currentSortValue) ?? SORT_OPTIONS[0];

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-28 sm:w-36" ref={dropdownRef}>
      {/* Trigger Area - Solid Surface */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full h-9 items-center justify-between rounded-xl border px-3 text-[13px] font-medium transition-all duration-200 outline-none shadow-sm",
          isOpen 
            ? "border-primary bg-white dark:bg-[#111111] ring-2 ring-primary/20" 
            : "border-border bg-white dark:bg-[#111111] hover:bg-gray-50 dark:hover:bg-[#161616]"
        )}
      >
        <span className="text-black dark:text-white truncate">{currentSort.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-black/40 dark:text-white/40 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Popover - 100% Opaque Solid (No transparency/blur) */}
      {isOpen && (
        <div className="absolute right-0 top-full z-[100] mt-1.5 w-full min-w-[140px] overflow-hidden rounded-xl border border-border bg-white dark:bg-[#0A0A0A] p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-75">
          <div className="space-y-0.5">
            {SORT_OPTIONS.map((option) => {
              const active = option.value === currentSortValue;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition-colors outline-none",
                    active 
                      ? "bg-primary text-white" 
                      : "text-black/70 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {active && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
