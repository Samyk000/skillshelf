import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Container } from "@/components/layout/Container";
import { CopyButton } from "@/components/skills/CopyButton";
import { DownloadButton } from "@/components/skills/DownloadButton";
import { LikeButton } from "@/components/skills/LikeButton";
import { SaveButton } from "@/components/skills/SaveButton";
import { ViewTracker } from "@/components/skills/ViewTracker";
import { createClient } from "@/lib/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";
import type { Skill } from "@/types/skill";

const SkillPreview = dynamic(
  () => import("@/components/skills/SkillPreview").then((mod) => ({ default: mod.SkillPreview })),
  { loading: () => <Skeleton className="h-[500px] w-full" /> }
);

interface SkillDetailPageProps {
  params: Promise<{ slug: string }>;
}

const getSkill = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
});

export async function generateMetadata({ params }: SkillDetailPageProps) {
  const { slug } = await params;
  const skill = await getSkill(slug);

  if (!skill) return { title: "Skill Not Found" };

  return {
    title: skill.title,
    description: skill.short_description,
  };
}

export default async function SkillDetailPage({
  params,
}: SkillDetailPageProps) {
  const { slug } = await params;

  // Batch 1: Fetch skill + auth in parallel (skill uses cache for dedup with generateMetadata)
  const [skill, userResult] = await Promise.all([
    getSkill(slug),
    (async () => {
      try {
        const supabase = await createClient();
        return await supabase.auth.getUser();
      } catch {
        return { data: { user: null } };
      }
    })(),
  ]);

  if (!skill) {
    notFound();
  }

  const user = userResult.data.user;

  // Batch 2: Fetch counts, like/save status, and related skills in parallel
  let likesCount = 0;
  let viewsCount = 0;
  let isLiked = false;
  let isSaved = false;
  let relatedSkills: Skill[] = [];

  try {
    const supabase = await createClient();
    const [likesResult, viewsResult, likeResult, saveResult, relatedResult] =
      await Promise.all([
        supabase
          .from("skill_likes")
          .select("*", { count: "exact", head: true })
          .eq("skill_id", skill.id),
        supabase
          .from("skill_views")
          .select("*", { count: "exact", head: true })
          .eq("skill_id", skill.id),
        user
          ? supabase
              .from("skill_likes")
              .select("id")
              .eq("user_id", user.id)
              .eq("skill_id", skill.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        user
          ? supabase
              .from("skill_saves")
              .select("id")
              .eq("user_id", user.id)
              .eq("skill_id", skill.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("skills")
          .select("id, slug, title, short_description, category")
          .eq("status", "published")
          .eq("category", skill.category)
          .neq("id", skill.id)
          .limit(3),
      ]);

    likesCount = likesResult.count ?? 0;
    viewsCount = viewsResult.count ?? 0;
    isLiked = !!likeResult.data;
    isSaved = !!saveResult.data;
    relatedSkills = (relatedResult.data as Skill[]) ?? [];
  } catch {
    // Queries failed, use defaults
  }

  return (
    <Container className="py-8">
      <ViewTracker skillId={skill.id} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs tracking-wider text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          HOME
        </Link>
        <span>/</span>
        <Link href="/skills" className="hover:text-primary">
          SKILLS
        </Link>
        <span>/</span>
        <span className="text-primary">{skill.title.toUpperCase()}</span>
      </nav>

      {/* Main Content: Preview (left) + Details (right) */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row">
        {/* Preview - Left */}
        <div className="min-w-0 flex-1">
          {skill.preview_html ? (
            <SkillPreview
              previewHtml={skill.preview_html}
              title={skill.title}
              slug={skill.slug}
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-border bg-muted">
              <span className="font-display text-lg font-bold tracking-wider text-muted-foreground">
                // NO PREVIEW AVAILABLE
              </span>
            </div>
          )}
        </div>

        {/* Details Sidebar - Right */}
        <div className="flex shrink-0 flex-col gap-5 lg:w-[260px]">
          {/* Category + Title */}
          <div>
            <span className="mb-2 inline-block border border-primary px-2 py-0.5 text-[10px] font-semibold tracking-[0.15em] text-primary">
              {skill.category.toUpperCase()}
            </span>
            <h1 className="font-display text-xl font-bold tracking-wide">
              {skill.title}
            </h1>
            {skill.short_description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {skill.short_description}
              </p>
            )}
          </div>

          {/* Stats Row: Views + Like + Save */}
          <div className="grid grid-cols-3 border-y-2 border-border py-3">
            {/* Views */}
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="tracking-wider">{viewsCount}</span>
            </div>

            {/* Like */}
            <div className="flex items-center justify-center border-x-2 border-border">
              <LikeButton
                skillId={skill.id}
                skillSlug={skill.slug}
                initialLiked={isLiked}
                initialCount={likesCount}
                isAuthenticated={!!user}
              />
            </div>

            {/* Save */}
            <div className="flex items-center justify-center">
              <SaveButton
                skillId={skill.id}
                skillSlug={skill.slug}
                initialSaved={isSaved}
                isAuthenticated={!!user}
              />
            </div>
          </div>

          {/* Actions: Copy + Download (stacked) */}
          <div className="flex flex-col gap-3">
            {/* Copy */}
            <CopyButton content={skill.skill_markdown} />

            {/* Download */}
            <DownloadButton slug={skill.slug} content={skill.skill_markdown} />
          </div>

        </div>
      </div>

      {/* Related Skills */}
      {relatedSkills.length > 0 && (
        <div className="border-t-2 border-border pt-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
            // RELATED
          </p>
          <h2 className="mb-6 font-display text-2xl font-bold tracking-wide">
            MORE {skill.category.toUpperCase()} SKILLS
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedSkills.map((related) => (
              <Link
                key={related.id}
                href={`/skills/${related.slug}`}
                className="rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <span className="mb-2 inline-block border border-primary px-2 py-0.5 text-[10px] font-semibold tracking-[0.15em] text-primary">
                  {related.category.toUpperCase()}
                </span>
                <h3 className="font-display text-lg font-bold tracking-wide">
                  {related.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {related.short_description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
