"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { signupUser } from "@/app/actions/auth";
import { Container } from "@/components/layout/Container";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signupUser(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      toast.success("Check your email for a confirmation link!");
    }
    setLoading(false);
  };

  return (
    <Container className="flex flex-col items-center justify-center py-20">
      <div className="w-full max-w-md border-2 border-border bg-card p-8">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
          // CREATE ACCOUNT
        </p>
        <h1 className="mb-6 font-display text-2xl font-bold tracking-wide">
          SIGN UP
        </h1>

        {success ? (
          <div className="border-2 border-primary p-4">
            <p className="text-sm text-primary">
              Check your email for a confirmation link to complete your
              registration.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              Go to login
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
              <label htmlFor="signup-email" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                EMAIL
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-password" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                PASSWORD
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Min 8 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="border-2 border-primary bg-primary px-4 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
            >
              {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary underline-offset-2 hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </Container>
  );
}
