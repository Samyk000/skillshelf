export const CATEGORIES = [
  "Product Design",
  "Typography",
  "Web Design",
  "Branding",
  "Illustration",
  "Mobile",
] as const;

export type Category = (typeof CATEGORIES)[number];
