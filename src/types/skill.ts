import { SkillStatus } from "./enums";

export interface Skill {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  long_description: string | null;
  category: string;
  status: SkillStatus;
  skill_markdown: string;
  preview_html: string | null;
  preview_external_url: string | null;
  cover_image_url: string | null;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  view_count?: number;
  like_count?: number;
}
