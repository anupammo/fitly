"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FOODS, FOOD_CATEGORIES } from "@/data/foods";

export default function FoodSearch() {
  const [q, setQ] = useState("");
  const [diet, setDiet] = useState<"all" | "veg">("all");
  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    return FOODS.filter(
      (f) => (diet === "all" || f.diet === "veg") && (!s || f.name.toLowerCase().includes(s) || f.hindi.includes(s) || f.slug.includes(s)),
    );
  }, [q, diet]);

  return (
    <>
      <div className="search">
        <label htmlFor="food-q" className="small muted">
          Search in English or Hindi
        </label>
        <input id="food-q" type="search" placeholder="e.g. roti, दाल, biryani" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="check small" style={{ marginTop: 8 }}>
          <input type="checkbox" checked={diet === "veg"} onChange={(e) => setDiet(e.target.checked ? "veg" : "all")} />
          Vegetarian only
        </label>
      </div>
      {matches.length === 0 && <p className="muted">No foods match “{q}”. We add new foods every week.</p>}
      {FOOD_CATEGORIES.map((cat) => {
        const list = matches.filter((f) => f.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} className="section">
            <h2>{cat}</h2>
            <ul className="food-list">
              {list.map((f) => (
                <li key={f.slug}>
                  <Link href={`/calories/${f.slug}`}>
                    <span>
                      <i className={`diet ${f.diet}`} aria-label={f.diet} />
                      {f.name} <span className="muted small">({f.serving})</span>
                    </span>
                    <span className="muted">{f.kcal} kcal</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
