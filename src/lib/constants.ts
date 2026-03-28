export const CATEGORIES = [
  "Paper",
  "Minimal SaaS",
  "Editorial",
  "Soft Dashboard",
  "Brutalist",
  "Enterprise",
  "Premium Dark",
  "Bento Product",
  "Docs-Focused",
  "Pricing-Page-Focused",
] as const;

export const TAGS = [
  "landing-page",
  "dashboard",
  "component",
  "layout",
  "typography",
  "color-system",
  "animation",
  "form",
  "navigation",
  "card",
  "button",
  "pricing",
  "auth",
  "settings",
  "data-display",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Tag = (typeof TAGS)[number];
