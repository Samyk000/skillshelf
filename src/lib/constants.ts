export const CATEGORIES = [
  "Branding",
  "Illustration",
  "Mobile",
  "Product Design",
  "Typography",
  "Web Design",
] as const;

export type Category = (typeof CATEGORIES)[number];
