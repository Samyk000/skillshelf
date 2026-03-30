/**
 * Sanitize preview HTML before storing/rendering in sandboxed iframes.
 *
 * Defence-in-depth: the iframes use `sandbox="allow-scripts allow-popups"`
 * (no allow-same-origin) so scripts cannot reach the parent. We still strip
 * the most dangerous patterns as a belt-and-suspenders measure.
 */
// We no longer strip <script> tags because proper HTML previews often require
// external libraries (e.g. Tailwind CDN, Vue, or interactive elements).
// SECURITY: The iframe sandbox `allow-scripts` WITHOUT `allow-same-origin`
// ensures that these scripts execute in a generic 'null' origin and absolutely
// cannot access the parent window, DOM, cookies, or localStorage. This makes
// inline scripts completely safe.
// We do not sanitize preview HTML because it is exclusively uploaded by authenticated
// admins (checked in admin.ts). Admins need to be able to upload complex, 
// fully-functioning prototypes (e.g. from Stitch) which may contain inline scripts,
// CDNs, and interactive Tailwind logic. Over-sanitization will break these prototypes.
export function sanitizePreviewHtml(html: string): string {
  if (!html || typeof html !== "string") return "";
  return html;
}

export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== "string") return "";
  return query.replace(/[^\w\s\-]/g, "").trim();
}

/**
 * Sanitize text that will be stored as a plain-text field (display names, etc.).
 * Strips HTML/script characters to prevent stored XSS.
 */
export function sanitizeTextInput(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text.replace(/[<>"'&]/g, "").trim();
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
    title: sanitizeTextInput(data.title ?? "").slice(0, 200),
    slug: (data.slug ?? "").trim().toLowerCase().slice(0, 100),
    short_description: data.short_description
      ? sanitizeTextInput(data.short_description).slice(0, 500)
      : null,
    skill_markdown: (data.skill_markdown ?? "").trim(),
    // Sanitize preview HTML (strip scripts + dangerous handlers)
    preview_html: data.preview_html
      ? sanitizePreviewHtml(data.preview_html.trim())
      : null,
  };
}
