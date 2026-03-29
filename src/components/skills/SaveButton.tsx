"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

    const wasSaved = saved;

    if (saved) {
      setSaved(false);
      const { error } = await supabase
        .from("skill_saves")
        .delete()
        .eq("user_id", user.id)
        .eq("skill_id", skillId);
      if (error) {
        setSaved(wasSaved);
        toast.error("Failed to unsave. Please try again.");
        return;
      }
    } else {
      setSaved(true);
      const { error } = await supabase
        .from("skill_saves")
        .insert({ user_id: user.id, skill_id: skillId });
      if (error) {
        setSaved(wasSaved);
        toast.error("Failed to save. Please try again.");
        return;
      }
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
