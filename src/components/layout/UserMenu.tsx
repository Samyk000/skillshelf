"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "./UserProvider";

export function UserMenu() {
  const { user, loading, openAuthModal } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { signOut } = await import("@/app/actions/auth");
    await signOut();
    setMenuOpen(false);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <div className="h-9 w-20 rounded-xl bg-muted/50 animate-pulse" />
        <div className="h-9 w-20 rounded-xl bg-muted/50 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <button
          onClick={() => openAuthModal("login")}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted/50"
        >
          Login
        </button>
        <button
          onClick={() => openAuthModal("signup")}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-3 md:flex">
      {user.role === "admin" && (
        <Link
          href="/admin"
          className="rounded-xl bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-all duration-200 hover:bg-accent/20"
        >
          Admin
        </Link>
      )}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted/50"
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="square" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {user.email.split("@")[0]}
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setMenuOpen(false);
              }}
              role="presentation"
            />
            <div
              className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
              role="menu"
              aria-label="User menu"
              onKeyDown={(e) => {
                if (e.key === "Escape") setMenuOpen(false);
              }}
            >
              <Link
                href="/dashboard"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="block border-b border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted/50 hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="block border-b border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted/50 hover:text-foreground"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-sm text-destructive transition-colors duration-200 hover:bg-destructive/10"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
