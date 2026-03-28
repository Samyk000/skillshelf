"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

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

    if (open) {
      loadUser();
    }
  }, [open]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    onClose();
    router.push("/");
    router.refresh();
  };

  if (!open) return null;

  const navLinks = [
    { href: "/skills", label: "EXPLORE" },
    { href: "/dashboard", label: "DASHBOARD" },
  ];

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
