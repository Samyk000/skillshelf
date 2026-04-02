"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "./UserProvider";

export function UserMenu() {
  const { user, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { signOut } = await import("@/app/actions/auth");
    await signOut();
    setMenuOpen(false);
    window.location.href = "/";
  };

  // Loading state — show placeholder with fixed dimensions to prevent layout shift
  if (loading) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <div className="h-8 w-20 border-2 border-border bg-muted" />
        <div className="h-8 w-20 border-2 border-border bg-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-3 md:flex">
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
    <div className="hidden items-center gap-3 md:flex">
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
          aria-expanded={menuOpen}
          aria-haspopup="true"
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
              onKeyDown={(e) => {
                if (e.key === "Escape") setMenuOpen(false);
              }}
              role="presentation"
            />
            <div
              className="absolute right-0 top-full z-50 mt-1 w-48 border-2 border-border bg-card"
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
                className="block border-b border-border px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-primary"
              >
                DASHBOARD
              </Link>
              <Link
                href="/dashboard/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="block border-b border-border px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-primary"
              >
                SETTINGS
              </Link>
              <button
                onClick={handleSignOut}
                role="menuitem"
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
