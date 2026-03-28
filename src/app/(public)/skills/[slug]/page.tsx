import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SkillPreview } from "@/components/skills/SkillPreview";
import { SkillMarkdown } from "@/components/skills/SkillMarkdown";
import { CopyButton } from "@/components/skills/CopyButton";
import { DownloadButton } from "@/components/skills/DownloadButton";
import { LikeButton } from "@/components/skills/LikeButton";
import { SaveButton } from "@/components/skills/SaveButton";
import { createClient } from "@/lib/supabase/server";

interface SkillDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SkillDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: skill } = await supabase
    .from("skills")
    .select("title, short_description")
    .eq("slug", slug)
    .single();

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
  const supabase = await createClient();

  // Get skill
  const { data: skill } = await supabase
    .from("skills")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!skill) notFound();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // Get counts
  const [{ count: likesCount }, { count: viewsCount }] = await Promise.all([
    supabase
      .from("skill_likes")
      .select("*", { count: "exact", head: true })
      .eq("skill_id", skill.id),
    supabase
      .from("skill_views")
      .select("*", { count: "exact", head: true })
      .eq("skill_id", skill.id),
  ]);

  // Check if user liked/saved
  let isLiked = false;
  let isSaved = false;
  if (user) {
    const [{ data: like }, { data: save }] = await Promise.all([
      supabase
        .from("skill_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("skill_id", skill.id)
        .maybeSingle(),
      supabase
        .from("skill_saves")
        .select("id")
        .eq("user_id", user.id)
        .eq("skill_id", skill.id)
        .maybeSingle(),
    ]);
    isLiked = !!like;
    isSaved = !!save;

    // Record view
    await supabase
      .from("skill_views")
      .insert({ skill_id: skill.id, user_id: user.id });
  } else {
    // Record anonymous view
    await supabase.from("skill_views").insert({ skill_id: skill.id });
  }

  // Get related skills
  const { data: relatedSkills } = await supabase
    .from("skills")
    .select("id, slug, title, short_description, category")
    .eq("status", "published")
    .eq("category", skill.category)
    .neq("id", skill.id)
    .limit(3);

  return (
    <Container className="py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs tracking-wider text-muted-foreground">
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

      {/* Hero */}
      <div className="mb-8">
        <span className="mb-3 inline-block border border-primary px-2 py-0.5 text-[10px] font-semibold tracking-[0.15em] text-primary">
          {skill.category.toUpperCase()}
        </span>
        <h1 className="font-display text-3xl font-bold tracking-wide md:text-4xl">
          {skill.title}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {skill.short_description}
        </p>
        {skill.long_description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {skill.long_description}
          </p>
        )}

        {/* Tags */}
        {skill.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skill.tags.map((tag: string) => (
              <span
                key={tag}
                className="border border-border px-2 py-0.5 text-[10px] tracking-wider text-muted-foreground"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Stats + Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-xs tracking-wider text-muted-foreground">
            {viewsCount ?? 0} VIEWS
          </span>
          <LikeButton
            skillId={skill.id}
            initialLiked={isLiked}
            initialCount={likesCount ?? 0}
            isAuthenticated={isAuthenticated}
          />
          <SaveButton
            skillId={skill.id}
            initialSaved={isSaved}
            isAuthenticated={isAuthenticated}
          />
          <CopyButton content={skill.skill_markdown} />
          <DownloadButton slug={skill.slug} content={skill.skill_markdown} />
          {skill.preview_external_url && (
            <a
              href={skill.preview_external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-border px-4 py-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
            >
              OPEN EXTERNAL PREVIEW
            </a>
          )}
        </div>
      </div>

      {/* Preview */}
      {skill.preview_html && (
        <div className="mb-8">
          <SkillPreview previewHtml={skill.preview_html} title={skill.title} />
          <Link
            href={`/preview/${skill.slug}`}
            className="mt-2 inline-block text-xs tracking-wider text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
          >
            OPEN FULL PREVIEW IN NEW TAB &rarr;
          </Link>
        </div>
      )}

      {/* Markdown */}
      <div className="mb-12">
        <SkillMarkdown content={skill.skill_markdown} />
      </div>

      {/* Related Skills */}
      {relatedSkills && relatedSkills.length > 0 && (
        <div className="border-t-2 border-border pt-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
            {/* RELATED */}
          </p>
          <h2 className="mb-6 font-display text-2xl font-bold tracking-wide">
            MORE {skill.category.toUpperCase()} SKILLS
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedSkills.map((related) => (
              <Link
                key={related.id}
                href={`/skills/${related.slug}`}
                className="border-2 border-border bg-card p-5 transition-colors hover:border-primary"
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
