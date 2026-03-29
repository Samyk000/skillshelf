"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  if (password.length < 6) {
    return "Password must be at least 6 characters";
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

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists" };
    }
    return { error: "Failed to create account. Please try again." };
  }

  return { error: null, success: true };
}

export async function forgotPassword(email: string) {
  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth/callback?next=/dashboard/settings`,
  });

  if (error) {
    return { error: "Failed to send reset email. Please try again." };
  }

  return { error: null, success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { error: null };
}
