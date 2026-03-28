import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

const dashboardLinks = [
  { href: "/dashboard", label: "OVERVIEW" },
  { href: "/dashboard/saved", label: "SAVED" },
  { href: "/dashboard/liked", label: "LIKED" },
  { href: "/dashboard/settings", label: "SETTINGS" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <Container className="py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // DASHBOARD
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-wide">
          {user.email?.toUpperCase()}
        </h1>
      </div>

      {/* Dashboard Nav */}
      <nav className="mb-8 flex flex-wrap gap-2 border-b-2 border-border pb-4">
        {dashboardLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-2 border-border px-4 py-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Content */}
      {children}
    </Container>
  );
}
