"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sanitizeSkillInput } from "@/lib/sanitize";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Auth Guard — Discriminated Union (no redundant null checks downstream)
// ---------------------------------------------------------------------------

type AdminAuthSuccess = {
  ok: true;
  supabase: SupabaseClient;
  user: User;
};

type AdminAuthFailure = {
  ok: false;
  error: string;
};

type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Not authorized" };
  }

  return { ok: true, supabase, user };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkillFormData {
  title: string;
  slug: string;
  short_description: string | null;
  category: string;
  status: "draft" | "published" | "archived";
  skill_markdown: string;
  preview_html: string | null;
  featured: boolean;
  cover_image_url: string | null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function createSkill(data: SkillFormData) {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

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

  const { error } = await auth.supabase.from("skills").insert({
    title: sanitized.title,
    slug: sanitized.slug,
    short_description: sanitized.short_description,
    skill_markdown: sanitized.skill_markdown,
    preview_html: sanitized.preview_html,
    category: data.category,
    status: data.status,
    featured: data.featured,
    cover_image_url: data.cover_image_url || null,
    created_by: auth.user.id,
  });

  if (error) {
    console.error("Failed to create skill:", error);
    if (error.code === "23505") {
      return { error: "A skill with this slug already exists" };
    }
    return { error: "Failed to create skill. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/skills");
  return { error: null };
}

export async function updateSkill(skillId: string, data: SkillFormData) {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  if (!/^[a-z0-9-]+$/.test(data.slug)) {
    return { error: "Slug must only contain lowercase letters, numbers, and hyphens" };
  }

  const { data: existingSlug } = await auth.supabase
    .from("skills")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", skillId)
    .maybeSingle();

  if (existingSlug) {
    return { error: "A skill with this slug already exists" };
  }

  const sanitized = sanitizeSkillInput({
    title: data.title,
    slug: data.slug,
    short_description: data.short_description,
    skill_markdown: data.skill_markdown,
    preview_html: data.preview_html,
  });

  const { error } = await auth.supabase
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
      cover_image_url: data.cover_image_url || null,
    })
    .eq("id", skillId);

  if (error) {
    console.error("Failed to update skill:", error);
    if (error.code === "23505") {
      return { error: "A skill with this slug already exists" };
    }
    return { error: "Failed to update skill. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/skills/${skillId}/edit`);
  revalidatePath("/skills");
  return { error: null };
}

export async function deleteSkill(skillId: string) {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const { error } = await auth.supabase.from("skills").delete().eq("id", skillId);

  if (error) {
    console.error("Failed to delete skill:", error);
    return { error: "Failed to delete skill. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/skills");
  return { error: null };
}

export async function toggleSkillStatus(skillId: string, currentStatus: string) {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const newStatus = currentStatus === "published" ? "draft" : "published";

  const { error } = await auth.supabase
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
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const newFeatured = !currentFeatured;

  const { error } = await auth.supabase
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
