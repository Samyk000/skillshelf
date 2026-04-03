"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleSave } from "@/app/actions/user";
import { useUser } from "@/components/layout/UserProvider";

interface SaveButtonProps {
  skillId: string;
  skillSlug?: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}

export function SaveButton({
  skillId,
  skillSlug,
  initialSaved,
  isAuthenticated,
}: SaveButtonProps) {
  const router = useRouter();
  const { openAuthModal } = useUser();
  const [saved, setSaved] = useState(initialSaved);
  const isBusy = useRef(false);

  const handleSave = async () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    // Guard against rapid double-clicks (M10)
    if (isBusy.current) return;
    isBusy.current = true;

    const wasSaved = saved;

    // Optimistic update
    setSaved(!wasSaved);

    const result = await toggleSave(skillId, skillSlug);

    if (result.error) {
      // Roll back on failure
      setSaved(wasSaved);
      toast.error(result.error);
    }

    isBusy.current = false;
  };

  return (
    <button
      onClick={handleSave}
      aria-pressed={saved}
      aria-label={saved ? "Unsave this skill" : "Save this skill"}
      className="flex items-center gap-1.5 text-sm font-semibold tracking-wider uppercase transition-colors"
    >
      <svg
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="square"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <span className={saved ? "text-accent" : "text-muted-foreground"}>
        {saved ? "SAVED" : "SAVE"}
      </span>
    </button>
  );
}
