import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditSkillForm } from "@/components/admin/EditSkillForm";
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

  return <EditSkillForm skill={skill as Skill} />;
}
