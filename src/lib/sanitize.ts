/**
 * Pass through preview HTML unchanged — security is provided by the iframe
 * sandbox (`allow-scripts allow-popups`), not by string sanitization.
 *
 * Security model: iframes use `sandbox="allow-scripts allow-popups"` without
 * `allow-same-origin`. This ensures scripts execute in an opaque null origin
 * and cannot access the parent window, DOM, cookies, or localStorage.
 *
 * External CDN scripts (Tailwind, Vue, etc.) load from different origins and
 * work fine without `allow-same-origin`. Inline scripts execute within the
 * iframe's isolated context.
 *
 * Only authenticated admins can upload preview HTML (enforced in admin.ts).
 * Complex prototypes (Tailwind CDN, interactive elements) require full HTML.
 */
export function passthroughPreviewHtml(html: string): string {
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
    title: sanitizeTextInput(data.title ?? "").slice(0, 100),
    slug: (data.slug ?? "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 100),
    short_description: data.short_description
      ? sanitizeTextInput(data.short_description).slice(0, 250)
      : null,
    skill_markdown: (data.skill_markdown ?? "").trim(),
    preview_html: data.preview_html
      ? passthroughPreviewHtml(data.preview_html.trim())
      : null,
  };
}
