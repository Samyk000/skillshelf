"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground hover:text-primary transition-colors"
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
