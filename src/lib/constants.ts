export const CATEGORIES = [
  "Landing Page",
  "SaaS",
  "Dashboard",
] as const;

export type Category = (typeof CATEGORIES)[number];
