import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SkillGrid } from "@/components/skills/SkillGrid";
import type { Skill } from "@/types/skill";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Liked Skills",
};

export default async function LikedSkillsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: likes } = await supabase
    .from("skill_likes")
    .select("skill_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const skillIds = likes?.map((l) => l.skill_id) ?? [];

  let skills: Skill[] = [];
  if (skillIds.length > 0) {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .in("id", skillIds)
      .eq("status", "published");
    skills = (data as Skill[]) ?? [];
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // LIKED
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-wide">
          LIKED SKILLS
        </h2>
      </div>
      {skills.length === 0 ? (
        <div className="border-2 border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            You have not liked any skills yet.
          </p>
          <Link
            href="/skills"
            className="mt-4 inline-block border-2 border-primary px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase hover:bg-primary hover:text-primary-foreground"
          >
            EXPLORE SKILLS
          </Link>
        </div>
      ) : (
        <SkillGrid skills={skills} />
      )}
    </div>
  );
}
