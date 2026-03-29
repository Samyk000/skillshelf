const DANGEROUS_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
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

  // Remove dangerous tags and their content
  for (const tag of DANGEROUS_TAGS) {
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
