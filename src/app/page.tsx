import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { FOODS } from "@/data/foods";
import { getAllPosts } from "@/lib/blog";

const FEATURED = ["bmi-calculator", "calorie-calculator", "protein-calculator", "water-intake-calculator", "period-calculator", "sleep-calculator"];
const POPULAR_FOODS = ["roti", "white-rice", "idli", "poha", "dal-tadka", "paneer", "samosa", "banana"];

export default function Home() {
  const tools = FEATURED.map((s) => TOOLS.find((t) => t.slug === s)!);
  const foods = POPULAR_FOODS.map((s) => FOODS.find((f) => f.slug === s)!);
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="hero">
        <h1>Get fitter, one day at a time</h1>
        <p className="lead">
          Free health calculators made for Indians, calories in {FOODS.length}+ Indian foods, and a simple daily tracker for water, steps,
          sleep and meals. No sign-up needed.
        </p>
        <div className="btn-row">
          <Link href="/tracker" className="btn">
            Start today&apos;s tracker
          </Link>
          <Link href="/tools" className="btn secondary">
            Browse {TOOLS.length} free tools
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Popular tools</h2>
        <div className="grid">
          {tools.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="card">
              <span className="pill">{t.category}</span>
              <h3>{t.name}</h3>
              <p>{t.short}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Calories in Indian food</h2>
        <ul className="food-list">
          {foods.map((f) => (
            <li key={f.slug}>
              <Link href={`/calories/${f.slug}`}>
                <span>
                  <i className={`diet ${f.diet}`} aria-hidden />
                  {f.name}
                </span>
                <span className="muted">{f.kcal} kcal</span>
              </Link>
            </li>
          ))}
        </ul>
        <p>
          <Link href="/calories">See all {FOODS.length} foods →</Link>
        </p>
      </section>

      {posts.length > 0 && (
        <section className="section">
          <h2>From the blog</h2>
          <div className="grid">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
                <span className="pill">{p.tags[0] ?? "Health"}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
