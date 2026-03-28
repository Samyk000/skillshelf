"use client";

import Link from "next/link";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/skills", label: "EXPLORE" },
  { href: "/dashboard", label: "DASHBOARD" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="border-t-2 border-border bg-background md:hidden">
      <nav className="flex flex-col gap-1 p-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="border-2 border-transparent px-4 py-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-2 flex flex-col gap-2">
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
        </div>
      </nav>
    </div>
  );
}
