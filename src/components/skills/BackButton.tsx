"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Robust check: If we have history AND the referrer is from our own site
    const hasInternalHistory = window.history.length > 2 && document.referrer.includes(window.location.host);
    
    if (hasInternalHistory) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn("mb-6 flex w-fit items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground hover:text-primary transition-colors", className)}
      aria-label="Go back"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="h-4 w-4"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      // GO BACK
    </button>
  );
}
