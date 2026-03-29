"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleSave } from "@/app/actions/user";

interface SaveButtonProps {
  skillId: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}

export function SaveButton({
  skillId,
  initialSaved,
  isAuthenticated,
}: SaveButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const wasSaved = saved;

    setSaved(!wasSaved);

    const result = await toggleSave(skillId);

    if (result.error) {
      setSaved(wasSaved);
      toast.error(result.error);
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
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
