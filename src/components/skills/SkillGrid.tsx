import { SkillCard } from "./SkillCard";
import type { Skill } from "@/types/skill";

interface SkillGridProps {
  skills: Skill[];
}

export function SkillGrid({ skills }: SkillGridProps) {
  if (skills.length === 0) {
    return (
      <div className="border-2 border-border bg-card p-12 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-2">
          // NO RESULTS
        </p>
        <p className="text-muted-foreground">
          No skills found. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
