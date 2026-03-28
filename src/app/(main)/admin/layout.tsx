import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <Container className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary">
            // ADMIN
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-wide">
            CONTENT MANAGEMENT
          </h1>
        </div>
        <Link
          href="/admin/skills/new"
          className="border-2 border-primary bg-primary px-6 py-2 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
        >
          + NEW SKILL
        </Link>
      </div>
      {children}
    </Container>
  );
}
