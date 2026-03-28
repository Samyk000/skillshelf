"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard/settings`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <Container className="flex flex-col items-center justify-center py-20">
      <div className="w-full max-w-md border-2 border-border bg-card p-8">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
          // RESET PASSWORD
        </p>
        <h1 className="mb-2 font-display text-2xl font-bold tracking-wide">
          FORGOT PASSWORD
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Enter your email address and we will send you a reset link.
        </p>

        {success ? (
          <div className="border-2 border-primary p-4">
            <p className="text-sm text-primary">
              Check your email for a password reset link.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="border-2 border-destructive p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="border-2 border-primary bg-primary px-4 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
            <Link
              href="/login"
              className="text-center text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              Back to login
            </Link>
          </form>
        )}
      </div>
    </Container>
  );
}
