import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PreviewPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: skill } = await supabase
    .from("skills")
    .select("title")
    .eq("slug", slug)
    .single();

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
    .single();

  if (!skill || !skill.preview_html) notFound();

  return (
    <div className="fixed inset-0 bg-white">
      <iframe
        srcDoc={skill.preview_html}
        sandbox="allow-scripts"
        title={`Preview: ${skill.title}`}
        className="h-full w-full border-0"
      />
    </div>
  );
}
