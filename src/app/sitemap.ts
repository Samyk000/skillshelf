import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skillshelf.com";

  // Get all published skills
  const supabase = await createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("slug, updated_at")
    .eq("status", "published");

  const skillEntries: MetadataRoute.Sitemap = (skills ?? []).map((skill) => ({
    url: `${baseUrl}/skills/${skill.slug}`,
    lastModified: skill.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...skillEntries,
  ];
}
