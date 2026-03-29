export function sanitizePreviewHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  // Only strip <script> tags and their content - the sandbox handles the rest
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<script\b[^>]*\/>/gi, "")
    .replace(/<script\b[^>]*>/gi, "")
    .replace(/<\/script>/gi, "");
}

export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== "string") return "";
  return query.replace(/[^\w\s\-]/g, "").trim();
}

export function sanitizeSkillInput(data: {
  title: string;
  slug: string;
  short_description: string | null;
  skill_markdown: string;
  preview_html: string | null;
}): {
  title: string;
  slug: string;
  short_description: string | null;
  skill_markdown: string;
  preview_html: string | null;
} {
  return {
    ...data,
    title: data.title?.trim().slice(0, 200) ?? "",
    slug: data.slug?.trim().toLowerCase().slice(0, 100) ?? "",
    short_description: data.short_description?.trim().slice(0, 500) ?? null,
    skill_markdown: data.skill_markdown?.trim() ?? "",
    // Store HTML as-is - the iframe sandbox provides security
    preview_html: data.preview_html?.trim() ?? null,
  };
}
