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
    title: sanitized.title,
    slug: sanitized.slug,
    short_description: sanitized.short_description,
    skill_markdown: sanitized.skill_markdown,
    preview_html: sanitized.preview_html,
    category: data.category,
    status: data.status,
    featured: data.featured,
    created_by: user.id,
  });

  if (error) {
    console.error("Failed to create skill:", error);
    return { error: "Failed to create skill. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/skills");
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
      title: sanitized.title,
      slug: sanitized.slug,
      short_description: sanitized.short_description,
      skill_markdown: sanitized.skill_markdown,
      preview_html: sanitized.preview_html,
      category: data.category,
      status: data.status,
      featured: data.featured,
    })
    .eq("id", skillId);

  if (error) {
    console.error("Failed to update skill:", error);
    return { error: "Failed to update skill. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/skills/${skillId}/edit`);
  revalidatePath("/skills");
  return { error: null };
}

export async function deleteSkill(skillId: string) {
  const { error: authError, supabase } = await requireAdmin();

  if (authError || !supabase) {
    return { error: authError ?? "Not authorized" };
  }

  const { error } = await supabase.from("skills").delete().eq("id", skillId);

  if (error) {
    console.error("Failed to delete skill:", error);
    return { error: "Failed to delete skill. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/skills");
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
    console.error("Failed to toggle skill status:", error);
    return { error: "Failed to update status. Please try again." };
  }

  revalidatePath("/admin");
  return { error: null, newStatus };
}

export async function toggleFeatured(skillId: string, currentFeatured: boolean) {
  const { error: authError, supabase } = await requireAdmin();

  if (authError || !supabase) {
    return { error: authError ?? "Not authorized" };
  }

  const newFeatured = !currentFeatured;

  const { error } = await supabase
    .from("skills")
    .update({ featured: newFeatured })
    .eq("id", skillId);

  if (error) {
    console.error("Failed to toggle featured:", error);
    return { error: "Failed to update featured status. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { error: null, newFeatured };
}
