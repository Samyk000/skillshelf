import { SkillForm } from "@/components/admin/SkillForm";

export const metadata = {
  title: "New Skill",
};

export default function NewSkillPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // CREATE
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-wide">
          NEW SKILL
        </h2>
      </div>
      <SkillForm />
    </div>
  );
}
