"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Auth Guard — Discriminated Union (mirrors admin.ts pattern)
// ---------------------------------------------------------------------------

type UserAuthSuccess = {
  ok: true;
  supabase: SupabaseClient;
  user: User;
};

type UserAuthFailure = {
  ok: false;
  error: string;
};

type UserAuthResult = UserAuthSuccess | UserAuthFailure;

async function getAuthenticatedUser(): Promise<UserAuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  return { ok: true, supabase, user };
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function toggleLike(skillId: string, skillSlug?: string) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return { error: "Please log in to like skills" };

  if (!skillId || typeof skillId !== "string") {
    return { error: "Invalid skill ID" };
  }

  const { data: existingLike } = await auth.supabase
    .from("skill_likes")
    .select("id")
    .eq("user_id", auth.user.id)
    .eq("skill_id", skillId)
    .maybeSingle();

  if (existingLike) {
    const { error } = await auth.supabase
      .from("skill_likes")
      .delete()
      .eq("user_id", auth.user.id)
      .eq("skill_id", skillId);

    if (error) {
      return { error: "Failed to unlike. Please try again." };
    }

    if (skillSlug) {
      revalidatePath(`/skills/${skillSlug}`, "page");
    }
    return { error: null, liked: false };
  } else {
    const { error } = await auth.supabase
      .from("skill_likes")
      .insert({ user_id: auth.user.id, skill_id: skillId });

    if (error) {
      return { error: "Failed to like. Please try again." };
    }

    if (skillSlug) {
      revalidatePath(`/skills/${skillSlug}`, "page");
    }
    return { error: null, liked: true };
  }
}

export async function toggleSave(skillId: string, skillSlug?: string) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return { error: "Please log in to save skills" };

  if (!skillId || typeof skillId !== "string") {
    return { error: "Invalid skill ID" };
  }

  const { data: existingSave } = await auth.supabase
    .from("skill_saves")
    .select("id")
    .eq("user_id", auth.user.id)
    .eq("skill_id", skillId)
    .maybeSingle();

  if (existingSave) {
    const { error } = await auth.supabase
      .from("skill_saves")
      .delete()
      .eq("user_id", auth.user.id)
      .eq("skill_id", skillId);

    if (error) {
      return { error: "Failed to unsave. Please try again." };
    }

    revalidatePath("/dashboard/saved");
    if (skillSlug) {
      revalidatePath(`/skills/${skillSlug}`, "page");
    }
    return { error: null, saved: false };
  } else {
    const { error } = await auth.supabase
      .from("skill_saves")
      .insert({ user_id: auth.user.id, skill_id: skillId });

    if (error) {
      return { error: "Failed to save. Please try again." };
    }

    revalidatePath("/dashboard/saved");
    if (skillSlug) {
      revalidatePath(`/skills/${skillSlug}`, "page");
    }
    return { error: null, saved: true };
  }
}

export async function updateProfile(displayName: string) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return { error: "Please log in to update your profile" };

  // Sanitize: strip HTML characters, trim, enforce max length
  const { sanitizeTextInput } = await import("@/lib/sanitize");
  const sanitized = sanitizeTextInput(displayName ?? "").slice(0, 100);

  const { error } = await auth.supabase
    .from("profiles")
    .update({ display_name: sanitized || null })
    .eq("id", auth.user.id);

  if (error) {
    return { error: "Failed to update profile. Please try again." };
  }

  revalidatePath("/dashboard/settings");
  return { error: null };
}
