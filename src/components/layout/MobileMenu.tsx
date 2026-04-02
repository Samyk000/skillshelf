"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser } from "./UserProvider";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { user, loading } = useUser();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    const { signOut } = await import("@/app/actions/auth");
    await signOut();
    onClose();
    window.location.href = "/";
  };

  if (!open) return null;

  return (
    <div
      className="border-t-2 border-border bg-background md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <nav className="flex flex-col gap-1 p-4">
        {user?.role === "admin" && (
          <Link
            href="/admin"
            onClick={onClose}
            className="border-2 border-accent px-4 py-3 text-center text-sm font-semibold tracking-widest text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            ADMIN
          </Link>
        )}

        <div className="mt-2 flex flex-col gap-2">
          {/* Theme Toggle & Social Icons */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="border-2 border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
            <a
              href="https://github.com/Samyk000/skillshelf"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              title="GitHub"
              aria-label="GitHub repository"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              title="X (Twitter)"
              aria-label="X (Twitter)"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {loading ? (
            <div className="h-12 animate-pulse border-2 border-border" />
          ) : user ? (
            <>
              <div className="border-2 border-border px-4 py-3 text-center text-xs tracking-wider text-muted-foreground">
                {user.email.toUpperCase()}
              </div>
              <Link
                href="/dashboard/settings"
                onClick={onClose}
                className="border-2 border-border px-4 py-3 text-center text-sm font-semibold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
              >
                SETTINGS
              </Link>
              <button
                onClick={handleSignOut}
                className="border-2 border-destructive px-4 py-3 text-center text-sm font-semibold tracking-widest text-destructive uppercase transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="border-2 border-border px-4 py-3 text-center text-sm font-semibold tracking-widest text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="border-2 border-primary bg-primary px-4 py-3 text-center text-sm font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
              >
                SIGN UP
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
