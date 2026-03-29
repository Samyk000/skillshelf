"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sanitizeSkillInput } from "@/lib/sanitize";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", supabase: null, user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Not authorized", supabase: null, user: null };
  }

  return { error: null, supabase, user };
}

export interface SkillFormData {
  title: string;
  slug: string;
  short_description: string | null;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  skill_markdown: string;
  preview_html: string | null;
  featured: boolean;
}

export async function createSkill(data: SkillFormData) {
  const { error: authError, supabase, user } = await requireAdmin();

  if (authError || !supabase || !user) {
    return { error: authError ?? "Not authorized" };
  }

  if (!/^[a-z0-9-]+$/.test(data.slug)) {
    return { error: "Slug must only contain lowercase letters, numbers, and hyphens" };
  }

  const sanitized = sanitizeSkillInput({
    title: data.title,
    slug: data.slug,
    short_description: data.short_description,
    skill_markdown: data.skill_markdown,
    preview_html: data.preview_html,
  });

  const { error } = await supabase.from("skills").insert({
    ...data,
    ...sanitized,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { error: null };
}

export async function updateSkill(skillId: string, data: SkillFormData) {
  const { error: authError, supabase } = await requireAdmin();

  if (authError || !supabase) {
    return { error: authError ?? "Not authorized" };
  }

  if (!/^[a-z0-9-]+$/.test(data.slug)) {
    return { error: "Slug must only contain lowercase letters, numbers, and hyphens" };
  }

  const sanitized = sanitizeSkillInput({
    title: data.title,
    slug: data.slug,
    short_description: data.short_description,
    skill_markdown: data.skill_markdown,
    preview_html: data.preview_html,
  });

  const { error } = await supabase
    .from("skills")
    .update({
      ...data,
      ...sanitized,
    })
    .eq("id", skillId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/skills/${skillId}/edit`);
  return { error: null };
}

export async function deleteSkill(skillId: string) {
  const { error: authError, supabase } = await requireAdmin();

  if (authError || !supabase) {
    return { error: authError ?? "Not authorized" };
  }

  const { error } = await supabase.from("skills").delete().eq("id", skillId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { error: null };
}

export async function toggleSkillStatus(skillId: string, currentStatus: string) {
  const { error: authError, supabase } = await requireAdmin();

  if (authError || !supabase) {
    return { error: authError ?? "Not authorized" };
  }

  const newStatus = currentStatus === "published" ? "draft" : "published";

  const { error } = await supabase
    .from("skills")
    .update({ status: newStatus })
    .eq("id", skillId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { error: null, newStatus };
}
