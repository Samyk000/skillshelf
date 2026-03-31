"use client";

import { memo } from "react";
import { downloadMarkdown } from "@/lib/download";
import { toast } from "sonner";

interface DownloadButtonProps {
  slug: string;
  content: string;
}

export const DownloadButton = memo(function DownloadButton({ slug, content }: DownloadButtonProps) {
  const handleDownload = () => {
    downloadMarkdown(slug, content);
    toast.success("Skill downloaded!");
  };

  return (
    <button
      onClick={handleDownload}
      className="border-2 border-border px-6 py-2.5 text-sm font-bold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
    >
      DOWNLOAD .MD
    </button>
  );
});
