import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SkillForm } from "@/components/admin/SkillForm";
import type { Skill } from "@/types/skill";

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditSkillPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: skill } = await supabase
    .from("skills")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: skill ? `Edit: ${skill.title}` : "Skill Not Found",
  };
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: skill } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single();

  if (!skill) notFound();

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // EDIT
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-wide">
          {(skill as Skill).title.toUpperCase()}
        </h2>
      </div>
      <SkillForm skill={skill as Skill} />
    </div>
  );
}
