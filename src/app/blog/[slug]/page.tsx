import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { getAllPosts, getPost, isReviewed } from "@/lib/blog";
import { getTool } from "@/lib/tools";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description, publishedTime: p.date },
    // Unreviewed health content stays out of search results until an expert signs it off.
    robots: isReviewed(p) ? undefined : { index: false, follow: true },
  };
}

const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function PostPage({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const tool = p.relatedTool ? getTool(p.relatedTool) : undefined;

  return (
    <article className="prose">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blog">Blog</Link>
      </nav>
      <h1>{p.title}</h1>
      <p className="muted small">
        By {p.author} · {fmt(p.date)} · {p.readingMinutes} min read
        {isReviewed(p) && <> · Medically reviewed by {p.reviewedBy}</>}
      </p>
      {!isReviewed(p) && (
        <p className="notice">This article is awaiting review by a qualified dietitian or doctor. Treat it as general information.</p>
      )}
      <div dangerouslySetInnerHTML={{ __html: p.html }} />
      {tool && (
        <p className="notice" style={{ borderColor: "var(--brand)" }}>
          Try it: <Link href={`/tools/${tool.slug}`}>{tool.name}</Link> — {tool.short}
        </p>
      )}
      <p className="muted small">This article is for general information and is not a substitute for medical advice.</p>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.description,
          datePublished: p.date,
          author: { "@type": "Organization", name: p.author },
          ...(isReviewed(p) ? { reviewedBy: { "@type": "Person", name: p.reviewedBy } } : {}),
          mainEntityOfPage: `${SITE.url}/blog/${p.slug}`,
          publisher: { "@type": "Organization", name: SITE.name },
        }}
      />
    </article>
  );
}
