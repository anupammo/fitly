import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Health & Fitness Blog",
  description: "Practical articles on weight loss, Indian diet, protein, diabetes prevention and fitness.",
  alternates: { canonical: "/blog" },
};

const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <h1>Health &amp; fitness blog</h1>
      <p className="lead">Practical, evidence-based guides for everyday Indian life.</p>
      <div className="grid">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
            <span className="pill">{p.tags[0] ?? "Health"}</span>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p className="small" style={{ marginTop: 8 }}>
              {fmt(p.date)} · {p.readingMinutes} min read
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
