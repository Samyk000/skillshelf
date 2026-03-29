"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  skillId: string;
}

export function ViewTracker({ skillId }: ViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill_id: skillId }),
    }).catch(() => {});
  }, [skillId]);

  return null;
}
