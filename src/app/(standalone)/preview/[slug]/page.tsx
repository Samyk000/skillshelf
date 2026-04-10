import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export const unstable_instant = false;

export async function generateMetadata({ params }: PreviewPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: skill } = await supabase
    .from("skills")
    .select("title")
    .eq("slug", slug)
    .maybeSingle();

  return {
    title: skill ? `Preview: ${skill.title}` : "Preview Not Found",
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: skill } = await supabase
    .from("skills")
    .select("title, preview_html")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!skill || !skill.preview_html) notFound();

  return (
    <iframe
      srcDoc={skill.preview_html}
      /* Standard standalone sandbox: Allow everything needed for a full-page experience */
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      title={`Preview: ${skill.title}`}
      className="absolute inset-0 h-full w-full border-0"
    />
  );
}
