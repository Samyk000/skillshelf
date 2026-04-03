"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { loginUser, signupUser, forgotPassword } from "@/app/actions/auth";
import { useUser } from "@/components/layout/UserProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalView } = useUser();
  const [view, setView] = useState(authModalView);

  // Sync view when opened from outside
  useEffect(() => {
    if (isAuthModalOpen) {
      setView(authModalView);
    }
  }, [isAuthModalOpen, authModalView]);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent showCloseButton={true} className="border-2 border-border bg-card p-0 sm:max-w-md !rounded-none">
        {view === "forgot-password" ? (
          <ForgotPasswordView setView={setView} />
        ) : (
          <div className="flex flex-col">
            {/* Header Area */}
            <div className="border-b-2 border-border px-8 pt-8 pb-6">
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
                // AUTHENTICATE
              </p>
              <h2 className="font-display text-2xl font-bold tracking-wide">
                WELCOME
              </h2>
            </div>

            {/* Forms Section */}
            <div className="p-8 pb-10">
              {view === "login" ? (
                <LoginForm setView={setView} />
              ) : (
                <SignupForm setView={setView} />
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({ setView }: { setView: (v: "login" | "signup" | "forgot-password") => void }) {
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
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="border-2 border-destructive p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          EMAIL
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          placeholder="your@email.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="login-password" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          PASSWORD
        </label>
        <input
          id="login-password"
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
        className="mt-2 border-2 border-primary bg-primary px-4 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-all hover:bg-background hover:text-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
      >
        {loading ? "LOGGING IN..." : "LOG IN"}
      </button>

      <div className="mt-4 flex flex-col gap-2 text-center text-xs">
        <button
          type="button"
          onClick={() => setView("forgot-password")}
          className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline font-medium"
        >
          Forgot password?
        </button>
        <div className="h-px w-full bg-border/50 my-1" />
        <p className="text-muted-foreground uppercase tracking-widest">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => setView("signup")}
            className="font-bold text-primary hover:underline underline-offset-4"
          >
            SIGN UP
          </button>
        </p>
      </div>
    </form>
  );
}

function SignupForm({ setView }: { setView: (v: "login" | "signup" | "forgot-password") => void }) {
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

  if (success) {
    return (
      <div className="border-2 border-primary p-4">
        <p className="text-sm text-primary">
          Check your email for a confirmation link to complete your registration.
        </p>
        <button
          type="button"
          onClick={() => setView("login")}
          className="mt-4 inline-block text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
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
        className="mt-2 border-2 border-primary bg-primary px-4 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-all hover:bg-background hover:text-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
      >
        {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
      </button>

      <div className="mt-4 flex flex-col gap-2 text-center text-xs">
        <div className="h-px w-full bg-border/50 my-1" />
        <p className="text-muted-foreground uppercase tracking-widest">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setView("login")}
            className="font-bold text-primary hover:underline underline-offset-4"
          >
            LOG IN
          </button>
        </p>
      </div>
    </form>
  );
}

function ForgotPasswordView({ setView }: { setView: (v: "login" | "signup" | "forgot-password") => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await forgotPassword(email);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="border-b-2 border-border px-8 pt-8 pb-6">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
          // RESET PASSWORD
        </p>
        <h2 className="font-display text-2xl font-bold tracking-wide">
          FORGOT PASSWORD
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email address and we will send you a reset link.
        </p>
      </div>
      <div className="p-8">
        {success ? (
          <div className="border-2 border-primary p-4">
            <p className="text-sm text-primary">
              Check your email for a password reset link.
            </p>
            <button
              type="button"
              onClick={() => setView("login")}
              className="mt-4 inline-block text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="border-2 border-destructive p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="forgot-email" className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                EMAIL
              </label>
              <input
                id="forgot-email"
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
              className="mt-2 border-2 border-primary bg-primary px-4 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
            <div className="mt-2 text-center text-sm">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                Back to login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
