import { createClient } from "@/lib/supabase/server";
import { SkillTable } from "@/components/admin/SkillTable";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Skill } from "@/types/skill";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin - Skills",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: skills } = await supabase
    .from("skills")
    .select("id, slug, title, category, status, featured, created_at, updated_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminHeader />
      <div>
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary">
            // ALL SKILLS
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {(skills ?? []).length} skills total
          </p>
        </div>
        <SkillTable skills={(skills as Skill[]) ?? []} />
      </div>
    </>
  );
}
