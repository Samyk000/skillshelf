import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SkillGrid } from "@/components/skills/SkillGrid";
import type { Skill } from "@/types/skill";


export const unstable_instant = false;

export const metadata = {
  title: "Saved Skills",
};

export default async function SavedSkillsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: skills } = await supabase.rpc("get_user_saved_skills", {
    p_user_id: user.id,
  });

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // SAVED
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-wide">
          SAVED SKILLS
        </h2>
      </div>
      {!skills || skills.length === 0 ? (
        <div className="border-2 border-border bg-card p-12 text-center">
          <svg className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <p className="text-muted-foreground">
            You have not saved any skills yet.
          </p>
          <Link
            href="/skills"
            className="mt-4 inline-block border-2 border-primary px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase hover:bg-primary hover:text-primary-foreground"
          >
            EXPLORE SKILLS
          </Link>
        </div>
      ) : (
        <SkillGrid skills={skills as Skill[]} />
      )}
    </div>
  );
}
