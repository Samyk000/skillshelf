"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface UserState {
  email: string;
  role: string;
}

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authUser.id)
          .single();

        setUser({
          email: authUser.email ?? "",
          role: profile?.role ?? "user",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-20 animate-pulse border-2 border-border" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-4 md:flex">
        <Link
          href="/login"
          className="border-2 border-border px-4 py-2 text-sm font-semibold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
        >
          LOGIN
        </Link>
        <Link
          href="/signup"
          className="border-2 border-primary bg-primary px-4 py-2 text-sm font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
        >
          SIGN UP
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-4 md:flex">
      {user.role === "admin" && (
        <Link
          href="/admin"
          className="border-2 border-accent px-3 py-1.5 text-xs font-semibold tracking-widest text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          ADMIN
        </Link>
      )}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 border-2 border-border px-3 py-2 text-sm font-semibold tracking-wider text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="square"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {user.email.split("@")[0].toUpperCase()}
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-1 w-48 border-2 border-border bg-card">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block border-b border-border px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-primary"
              >
                DASHBOARD
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setMenuOpen(false)}
                className="block border-b border-border px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-primary"
              >
                SETTINGS
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-3 text-left text-xs font-semibold tracking-widest text-destructive uppercase transition-colors hover:bg-muted"
              >
                SIGN OUT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
