import { cache } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditSkillForm } from "@/components/admin/EditSkillForm";
import type { Skill } from "@/types/skill";

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

const getSkillById = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single();
  return data;
});

export async function generateMetadata({ params }: EditSkillPageProps) {
  const { id } = await params;
  const skill = await getSkillById(id);

  return {
    title: skill ? `Edit: ${skill.title}` : "Skill Not Found",
  };
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  const skill = await getSkillById(id);

  if (!skill) notFound();

  return <EditSkillForm skill={skill as Skill} />;
}
