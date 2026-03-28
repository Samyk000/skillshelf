"use client";

interface SkillPreviewProps {
  previewHtml: string;
  title: string;
}

export function SkillPreview({ previewHtml, title }: SkillPreviewProps) {
  return (
    <div className="border-2 border-border">
      <div className="flex items-center justify-between border-b-2 border-border bg-muted px-4 py-2">
        <span className="text-xs font-semibold tracking-[0.15em] text-primary">
          // PREVIEW
        </span>
        <span className="text-xs tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="relative aspect-video w-full bg-white">
        <iframe
          srcDoc={previewHtml}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title={`Preview: ${title}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
