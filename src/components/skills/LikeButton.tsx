"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleLike } from "@/app/actions/user";
import { useUser } from "@/components/layout/UserProvider";

interface LikeButtonProps {
  skillId: string;
  skillSlug?: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthenticated: boolean;
}

export function LikeButton({
  skillId,
  skillSlug,
  initialLiked,
  initialCount,
  isAuthenticated,
}: LikeButtonProps) {
  const router = useRouter();
  const { openAuthModal } = useUser();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const isBusy = useRef(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    // Guard against rapid double-clicks (M10)
    if (isBusy.current) return;
    isBusy.current = true;

    const wasLiked = liked;
    const prevCount = count;

    // Optimistic update
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? c - 1 : c + 1));

    const result = await toggleLike(skillId, skillSlug);

    if (result.error) {
      // Roll back on failure
      setLiked(wasLiked);
      setCount(prevCount);
      toast.error(result.error);
    }

    isBusy.current = false;
  };

  return (
    <button
      onClick={handleLike}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this skill" : "Like this skill"}
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
