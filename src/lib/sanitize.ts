// Tags that need to be removed WITH their content
const DANGEROUS_TAGS_WITH_CONTENT = ["script", "iframe", "object", "embed"];

// Self-closing or empty tags to remove (no content to preserve)
const DANGEROUS_TAGS_EMPTY = [
  "form",
  "input",
  "textarea",
  "select",
  "button",
  "link",
  "meta",
  "base",
];

const DANGEROUS_ATTRS = [
  "onload",
  "onerror",
  "onclick",
  "onmouseover",
  "onmouseout",
  "onfocus",
  "onblur",
  "onsubmit",
  "onreset",
  "onchange",
  "onkeydown",
  "onkeyup",
  "onkeypress",
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function sanitizePreviewHtml(html: string): string {
  let sanitized = html;

  // Remove dangerous tags WITH their content (script, iframe, object, embed)
  for (const tag of DANGEROUS_TAGS_WITH_CONTENT) {
    const tagWithContentRegex = new RegExp(
      `<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`,
      "gi"
    );
    sanitized = sanitized.replace(tagWithContentRegex, "");

    // Also remove self-closing variants
    const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/>`, "gi");
    sanitized = sanitized.replace(selfClosingRegex, "");

    // Remove any remaining unclosed tags
    const openTagRegex = new RegExp(`<${tag}\\b[^>]*>`, "gi");
    sanitized = sanitized.replace(openTagRegex, "");
  }

  // Remove self-closing or empty dangerous tags (form, input, meta, etc.)
  for (const tag of DANGEROUS_TAGS_EMPTY) {
    const openTagRegex = new RegExp(`<${tag}\\b[^>]*>`, "gi");
    const closeTagRegex = new RegExp(`<\\/${tag}>`, "gi");
    const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/>`, "gi");

    sanitized = sanitized.replace(openTagRegex, "");
    sanitized = sanitized.replace(closeTagRegex, "");
    sanitized = sanitized.replace(selfClosingRegex, "");
  }

  // Remove dangerous event handler attributes
  for (const attr of DANGEROUS_ATTRS) {
    const attrRegex = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, "gi");
    sanitized = sanitized.replace(attrRegex, "");
  }

  // Remove javascript: URLs in href and src
  sanitized = sanitized.replace(
    /\s(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi,
    ""
  );

  // Remove data: URLs that could contain scripts
  sanitized = sanitized.replace(
    /\s(href|src)\s*=\s*["']\s*data:[^"']*["']/gi,
    ""
  );

  return sanitized;
}

export function sanitizeSearchQuery(query: string): string {
  // Remove special characters that could be used for injection
  // Keep alphanumeric, spaces, hyphens, and underscores
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
    title: data.title.trim().slice(0, 200),
    slug: data.slug.trim().toLowerCase().slice(0, 100),
    short_description: data.short_description?.trim().slice(0, 500) ?? null,
    skill_markdown: data.skill_markdown.trim(),
    preview_html: data.preview_html ? sanitizePreviewHtml(data.preview_html) : null,
  };
}
