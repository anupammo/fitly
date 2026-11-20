import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolRunner from "@/components/ToolRunner";
import JsonLd from "@/components/JsonLd";
import { TOOLS, getTool } from "@/lib/tools";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool((await params).slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Free & Accurate`,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: tool.name, description: tool.description },
  };
}

export default async function ToolPage({ params }: Props) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  const related = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/tools">Tools</Link> / {tool.name}
      </nav>
      <h1>{tool.name}</h1>
      <p className="lead">{tool.description}</p>

      <ToolRunner slug={tool.slug} />

      <div className="prose">
        <h2>How it works</h2>
        <p>{tool.howItWorks}</p>

        <h2>Frequently asked questions</h2>
        <div className="faq">
          {tool.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p className="muted small">This tool gives estimates for healthy adults and is not a substitute for medical advice.</p>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2>Related tools</h2>
          <div className="grid">
            {related.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card">
                <h3>{t.name}</h3>
                <p>{t.short}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: tool.name,
              url: `${SITE.url}/tools/${tool.slug}`,
              applicationCategory: "HealthApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
            },
            {
              "@type": "FAQPage",
              mainEntity: tool.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
    </>
  );
}
