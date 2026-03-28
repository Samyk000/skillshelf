"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface LikeButtonProps {
  skillId: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthenticated: boolean;
}

export function LikeButton({
  skillId,
  initialLiked,
  initialCount,
  isAuthenticated,
}: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleLike = async () => {
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

    if (liked) {
      setLiked(false);
      setCount((c) => c - 1);
      await supabase
        .from("skill_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("skill_id", skillId);
    } else {
      setLiked(true);
      setCount((c) => c + 1);
      await supabase
        .from("skill_likes")
        .insert({ user_id: user.id, skill_id: skillId });
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 border-2 px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-colors ${
        liked
          ? "border-primary text-primary"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      <svg
        className="h-4 w-4"
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="square"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {count}
    </button>
  );
}
