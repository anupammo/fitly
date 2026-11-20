import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FOODS, getFood, per100g } from "@/data/foods";
import { caloriesBurned } from "@/lib/calculators";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FOODS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = getFood((await params).slug);
  if (!f) return {};
  return {
    title: `Calories in ${f.name} (${f.serving}) — ${f.kcal} kcal`,
    description: `${f.serving} of ${f.name} (${f.hindi}) has about ${f.kcal} calories, ${f.protein} g protein, ${f.carbs} g carbs and ${f.fat} g fat.`,
    alternates: { canonical: `/calories/${f.slug}` },
  };
}

const minutesToBurn = (kcal: number, activity: "walkingBrisk" | "running" | "yoga") =>
  Math.round((kcal / caloriesBurned(activity, 60, 60)) * 60);

export default async function FoodPage({ params }: Props) {
  const f = getFood((await params).slug);
  if (!f) notFound();
  const p = per100g(f);
  const similar = FOODS.filter((x) => x.category === f.category && x.slug !== f.slug).slice(0, 6);
  const dietLabel = { veg: "Vegetarian", egg: "Contains egg", nonveg: "Non-vegetarian" }[f.diet];

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/calories">Food calories</Link> / {f.name}
      </nav>
      <h1>
        Calories in {f.name} <span className="muted">({f.hindi})</span>
      </h1>
      <p className="lead">
        {f.serving} ({f.grams} g) of {f.name.toLowerCase()} has about <b>{f.kcal} calories</b>.
      </p>

      <div className="stat-row">
        <div className="stat"><b>{f.kcal}</b><span>kcal</span></div>
        <div className="stat"><b>{f.protein} g</b><span>protein</span></div>
        <div className="stat"><b>{f.carbs} g</b><span>carbs</span></div>
        <div className="stat"><b>{f.fat} g</b><span>fat</span></div>
        <div className="stat"><b>{f.fiber} g</b><span>fibre</span></div>
      </div>

      <div className="prose">
        <h2>Nutrition facts</h2>
        <table className="data-table">
          <thead>
            <tr><th>Nutrient</th><th className="num">Per {f.serving}</th><th className="num">Per 100 g</th></tr>
          </thead>
          <tbody>
            <tr><td>Calories</td><td className="num">{f.kcal} kcal</td><td className="num">{p.kcal} kcal</td></tr>
            <tr><td>Protein</td><td className="num">{f.protein} g</td><td className="num">{p.protein} g</td></tr>
            <tr><td>Carbohydrates</td><td className="num">{f.carbs} g</td><td className="num">{p.carbs} g</td></tr>
            <tr><td>Fat</td><td className="num">{f.fat} g</td><td className="num">{p.fat} g</td></tr>
            <tr><td>Fibre</td><td className="num">{f.fiber} g</td><td className="num">{p.fiber} g</td></tr>
          </tbody>
        </table>
        <p className="small muted">
          <i className={`diet ${f.diet}`} aria-hidden /> {dietLabel} · Category: {f.category}
        </p>

        <h2>How long to burn {f.kcal} calories?</h2>
        <p>For a 60 kg adult, roughly:</p>
        <ul>
          <li>{minutesToBurn(f.kcal, "walkingBrisk")} minutes of brisk walking</li>
          <li>{minutesToBurn(f.kcal, "running")} minutes of running</li>
          <li>{minutesToBurn(f.kcal, "yoga")} minutes of yoga</li>
        </ul>
        <p>
          Find your own numbers with the <Link href="/tools/calories-burned-calculator">calories burned calculator</Link>, or log this food
          in the <Link href="/tracker">daily tracker</Link>.
        </p>

        {!f.verified && (
          <p className="notice">
            Values are approximate and depend on recipe, oil and portion size. This entry is awaiting verification by our dietitian
            panel.
          </p>
        )}
      </div>

      {similar.length > 0 && (
        <section className="section">
          <h2>More {f.category.toLowerCase()}</h2>
          <ul className="food-list">
            {similar.map((s) => (
              <li key={s.slug}>
                <Link href={`/calories/${s.slug}`}>
                  <span>{s.name}</span>
                  <span className="muted">{s.kcal} kcal</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
