import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { FOODS } from "@/data/foods";
import { getAllPosts, isReviewed } from "@/lib/blog";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${SITE.url}${path}`;
  return [
    { url: u("/"), changeFrequency: "daily", priority: 1 },
    { url: u("/tools"), changeFrequency: "weekly", priority: 0.9 },
    { url: u("/calories"), changeFrequency: "weekly", priority: 0.9 },
    { url: u("/blog"), changeFrequency: "daily", priority: 0.8 },
    { url: u("/tracker"), changeFrequency: "monthly", priority: 0.7 },
    { url: u("/about"), changeFrequency: "yearly", priority: 0.3 },
    ...TOOLS.map((t) => ({ url: u(`/tools/${t.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...FOODS.map((f) => ({ url: u(`/calories/${f.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...getAllPosts()
      .filter(isReviewed)
      .map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
