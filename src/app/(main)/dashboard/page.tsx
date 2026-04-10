import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export const unstable_instant = false;

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ count: savedCount }, { count: likedCount }] = await Promise.all([
    supabase
      .from("skill_saves")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("skill_likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const stats = [
    { label: "SAVED SKILLS", value: savedCount ?? 0, href: "/dashboard/saved" },
    { label: "LIKED SKILLS", value: likedCount ?? 0, href: "/dashboard/liked" },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // OVERVIEW
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-wide">
          YOUR STATS
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border-2 border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <p className="text-4xl font-bold text-primary font-display">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-semibold tracking-[0.15em] text-muted-foreground">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/skills"
          className="inline-block border-2 border-primary bg-primary px-6 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
        >
          EXPLORE SKILLS
        </Link>
      </div>
    </div>
  );
}
