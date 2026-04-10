export const SKILL_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type SkillStatus = typeof SKILL_STATUS[keyof typeof SKILL_STATUS];
