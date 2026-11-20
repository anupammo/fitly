import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  reviewedBy: string;
  tags: string[];
  relatedTool?: string;
  html: string;
  readingMinutes: number;
};

const DIR = path.join(process.cwd(), "content", "blog");

function load(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.md$/, ""),
    title: String(data.title),
    description: String(data.description ?? ""),
    date: String(data.date),
    author: String(data.author ?? "Fitly Editorial Team"),
    reviewedBy: String(data.reviewedBy ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    relatedTool: data.relatedTool ? String(data.relatedTool) : undefined,
    html: marked.parse(content, { async: false }),
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Health content is only indexed by search engines after a named expert has reviewed it. */
export const isReviewed = (p: Post) => p.reviewedBy.trim().length > 0;
