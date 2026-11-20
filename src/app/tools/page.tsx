import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Health & Fitness Calculators",
  description: "BMI, calorie, BMR, protein, macro, water, body fat, heart rate, period, due date and sleep calculators. Free, no sign-up.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <>
      <h1>Free health &amp; fitness tools</h1>
      <p className="lead">{TOOLS.length} calculators built on medical formulas, with Indian guidelines where they differ.</p>
      {TOOL_CATEGORIES.map((cat) => (
        <section key={cat} className="section">
          <h2>{cat}</h2>
          <div className="grid">
            {TOOLS.filter((t) => t.category === cat).map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card">
                <h3>{t.name}</h3>
                <p>{t.short}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
