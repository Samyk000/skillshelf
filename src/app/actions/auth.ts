"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// We rely entirely on Supabase's native Auth rate limits,
// which are configured in the Supabase Dashboard.
// In-memory Maps do not work well in modern serverless (Vercel) deployments.

function validateEmail(email: string): string | null {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Invalid email format";
  }
  if (trimmed.length > 254) {
    return "Email is too long";
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (password.length > 128) {
    return "Password is too long";
  }
  return null;
}

export async function loginUser(email: string, password: string) {
  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  revalidatePath("/", "layout");
  return { error: null };
}

export async function signupUser(email: string, password: string) {
  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl && process.env.NODE_ENV === "production") {
    console.error("Critical: NEXT_PUBLIC_SITE_URL missing in production");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${siteUrl ?? "http://localhost:3000"}/api/auth/callback`,
    },
  });

  // Always return success to prevent user enumeration
  // The actual error is logged server-side for debugging
  if (error) {
    console.error("Signup error:", error.message);
  }

  return { error: null, success: true };
}

export async function forgotPassword(email: string) {
  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl && process.env.NODE_ENV === "production") {
    console.error("Critical: NEXT_PUBLIC_SITE_URL missing in production");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${siteUrl ?? "http://localhost:3000"}/api/auth/callback?next=/dashboard/settings`,
  });

  // Always return success to prevent user enumeration
  if (error) {
    console.error("Password reset error:", error.message);
  }

  return { error: null, success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { error: null };
}
