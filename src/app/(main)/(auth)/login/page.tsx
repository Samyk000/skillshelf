"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { loginUser } from "@/app/actions/auth";
import { Container } from "@/components/layout/Container";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await loginUser(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    toast.success("Logged in successfully!");

    // Hard redirect — ensures the entire app re-initializes with new auth cookies.
    // Soft navigation (router.push) is unreliable here because the client-side
    // Supabase SDK may not detect the server-set cookies before rendering.
    window.location.href = "/dashboard";
  };

  return (
    <Container className="flex flex-col items-center justify-center py-20">
      <div className="w-full max-w-md border-2 border-border bg-card p-8">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
          // AUTHENTICATE
        </p>
        <h1 className="mb-6 font-display text-2xl font-bold tracking-wide">
          LOG IN
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="border-2 border-destructive p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-primary bg-primary px-4 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>
          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              href="/signup"
              className="text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
