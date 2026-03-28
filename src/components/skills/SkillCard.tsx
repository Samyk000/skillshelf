import Link from "next/link";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group flex flex-col border-2 border-border bg-card transition-colors hover:border-primary"
    >
      {/* Preview or Cover Image or Placeholder */}
      {skill.cover_image_url ? (
        <div className="aspect-video w-full overflow-hidden border-b-2 border-border">
          <img
            src={skill.cover_image_url}
            alt={skill.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : skill.preview_html ? (
        <div className="aspect-video w-full overflow-hidden border-b-2 border-border bg-white">
          <iframe
            srcDoc={skill.preview_html}
            sandbox="allow-scripts"
            title={`Preview: ${skill.title}`}
            className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center border-b-2 border-border bg-muted">
          <span className="text-2xl font-display font-bold text-muted-foreground tracking-wider">
            // {skill.category.toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Category Badge */}
        <span className="w-fit border border-primary px-2 py-0.5 text-[10px] font-semibold tracking-[0.15em] text-primary">
          {skill.category.toUpperCase()}
        </span>

        {/* Title */}
        <h3 className="font-display text-lg font-bold tracking-wide text-foreground group-hover:text-primary transition-colors">
          {skill.title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {skill.short_description}
        </p>

        {/* Tags */}
        {skill.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {skill.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="border border-border px-2 py-0.5 text-[10px] tracking-wider text-muted-foreground"
              >
                {tag.toUpperCase()}
              </span>
            ))}
            {skill.tags.length > 3 && (
              <span className="border border-border px-2 py-0.5 text-[10px] tracking-wider text-muted-foreground">
                +{skill.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
