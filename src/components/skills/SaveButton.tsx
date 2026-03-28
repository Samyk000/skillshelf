"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    if (saved) {
      setSaved(false);
      await supabase
        .from("skill_saves")
        .delete()
        .eq("user_id", user.id)
        .eq("skill_id", skillId);
    } else {
      setSaved(true);
      await supabase
        .from("skill_saves")
        .insert({ user_id: user.id, skill_id: skillId });
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className={`flex items-center gap-2 border-2 px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-colors ${
        saved
          ? "border-accent text-accent"
          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
      }`}
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
      {saved ? "SAVED" : "SAVE"}
    </button>
  );
}
