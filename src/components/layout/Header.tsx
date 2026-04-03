"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { UserMenu } from "./UserMenu";
import { UserProvider } from "./UserProvider";
import { AuthModal } from "@/components/auth/AuthModal";

const HOW_TO_USE_STEPS = [
  {
    num: "01",
    title: "BROWSE",
    desc: "Find a design style that matches your vision.",
  },
  {
    num: "02",
    title: "PREVIEW",
    desc: "See the live output before you commit.",
  },
  {
    num: "03",
    title: "COPY",
    desc: "One click. Paste into your project.",
  },
  {
    num: "04",
    title: "BUILD",
    desc: "Your AI reads it. Builds exactly what you want.",
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [githubTooltip, setGithubTooltip] = useState(false);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (howToUseOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [howToUseOpen]);

  return (
    <UserProvider>
      <header className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Container>
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-bold tracking-wider text-primary uppercase"
            >
              <span className="flex items-center justify-center border-2 border-primary px-1.5 py-0.5 text-primary text-xs">
                <span className="inline-block leading-none">
                  {"//"}
                </span>
              </span>
              <span>SKILLSHELF</span>
            </Link>

            {/* Right Side */}
            <div className="hidden items-center gap-3 md:flex">
              {/* Action Icons */}
              <div className="flex items-center gap-1.5 border-r border-border pr-3">
                {/* How To Use */}
                <button
                  onClick={() => setHowToUseOpen(true)}
                  className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  title="How to use"
                  aria-label="How to use"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </button>

                {/* GitHub - shows tooltip */}
                <div className="relative">
                  <button
                    onClick={() => setGithubTooltip(!githubTooltip)}
                    className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    title="GitHub"
                    aria-label="GitHub"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </button>
                  {githubTooltip && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setGithubTooltip(false)} />
                      <div className="absolute right-0 top-full z-50 mt-2 w-56 border-2 border-border bg-card px-4 py-3">
                        <p className="text-[10px] font-semibold tracking-wider text-primary">
                          OPENING SOON
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Will open source the repo soon.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="border-2 border-border p-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
              )}

              {/* User Menu */}
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border-2 border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </Container>

        {/* Mobile Menu */}
        <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>

      {/* How To Use Modal — outside header for proper centering */}
      {howToUseOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setHowToUseOpen(false)}
        >
          <div
            className="relative mx-4 w-full max-w-md border-2 border-border bg-card"
            role="dialog"
            aria-modal="true"
            aria-label="How to use Skillshelf"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-border px-6 py-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary">
                // HOW TO USE
              </p>
              <button
                onClick={() => setHowToUseOpen(false)}
                className="border-2 border-border p-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Steps */}
            <div className="px-6 py-5">
              <div className="space-y-4">
                {HOW_TO_USE_STEPS.map((step, index) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-8 w-8 items-center justify-center border-2 border-primary text-[10px] font-bold text-primary">
                        {step.num}
                      </span>
                      {index < HOW_TO_USE_STEPS.length - 1 && (
                        <div className="mt-1 h-6 w-px bg-border" />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="text-xs font-bold tracking-wider text-foreground">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Where to paste */}
              <div className="mt-6 border-t-2 border-border pt-4">
                <p className="text-[10px] font-semibold tracking-wider text-primary">
                  WHERE TO PASTE
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {["Cursor", "Claude", "ChatGPT", "v0"].map((tool) => (
                    <div key={tool} className="border border-border px-3 py-2 text-center text-[10px] font-semibold tracking-wider text-muted-foreground">
                      {tool.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <AuthModal />
    </UserProvider>
  );
}
