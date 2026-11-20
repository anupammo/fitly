"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FOODS } from "@/data/foods";
import { ACTIVITY_LEVELS, addDays, type ActivityLevel, type Sex, type WeightGoal } from "@/lib/calculators";
import {
  STORAGE_KEY,
  emptyDay,
  foodTotals,
  goals,
  parseState,
  streak,
  type DayLog,
  type Mood,
  type Profile,
  type TrackerState,
} from "@/lib/tracker";

// The user's local calendar date (IST for most users), not the UTC date.
const localToday = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

const MOODS: [Mood, string][] = [
  ["great", "😄 Great"],
  ["good", "🙂 Good"],
  ["okay", "😐 Okay"],
  ["low", "😔 Low"],
  ["stressed", "😣 Stressed"],
];

function Progress({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(100, goal > 0 ? (value / goal) * 100 : 0);
  return (
    <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Tracker() {
  const [state, setState] = useState<TrackerState | null>(null);
  const [today, setToday] = useState("");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked (private mode): run in memory */
    }
    const t = localToday();
    setState(parseState(raw));
    setToday(t);
    setDate(t);
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return FOODS.filter((f) => f.name.toLowerCase().includes(q) || f.hindi.includes(q)).slice(0, 8);
  }, [query]);

  if (!state || !date) return <p className="muted">Loading your tracker…</p>;

  const day: DayLog = state.days[date] ?? emptyDay();
  const g = goals(state.profile);
  const totals = foodTotals(day);
  const currentStreak = streak(state.days, today);

  const updateDay = (patch: Partial<DayLog>) =>
    setState((s) => (s ? { ...s, days: { ...s.days, [date]: { ...(s.days[date] ?? emptyDay()), ...patch } } } : s));
  const updateProfile = (patch: Partial<Profile>) => setState((s) => (s ? { ...s, profile: { ...s.profile, ...patch } } : s));
  const numberOr0 = (v: string) => Math.max(0, Number(v) || 0);

  const addFood = (slug: string) => {
    const existing = day.foods.find((f) => f.slug === slug);
    updateDay({
      foods: existing ? day.foods.map((f) => (f.slug === slug ? { ...f, qty: f.qty + 1 } : f)) : [...day.foods, { slug, qty: 1 }],
    });
    setQuery("");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fitly-data-${today}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const clearData = () => {
    if (confirm("Delete all your tracker data from this device? This cannot be undone.")) setState(parseState(null));
  };

  return (
    <>
      <div className="date-nav">
        <button className="btn secondary" onClick={() => setDate(addDays(date, -1))} aria-label="Previous day">
          ←
        </button>
        <input type="date" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} aria-label="Date" />
        <button className="btn secondary" onClick={() => setDate(addDays(date, 1))} disabled={date >= today} aria-label="Next day">
          →
        </button>
        {date !== today && (
          <button className="link-button" onClick={() => setDate(today)}>
            Back to today
          </button>
        )}
        <span className="pill" style={{ marginLeft: "auto", marginBottom: 0 }}>
          🔥 {currentStreak}-day streak
        </span>
      </div>

      <div className="tracker-grid">
        <section className="card">
          <h3>Water</h3>
          <div className="counter">
            <button onClick={() => updateDay({ water: Math.max(0, day.water - 1) })} aria-label="Remove a glass">
              −
            </button>
            <b>{day.water}</b>
            <button onClick={() => updateDay({ water: day.water + 1 })} aria-label="Add a glass">
              +
            </button>
            <span className="muted">of {g.waterGlasses} glasses</span>
          </div>
          <Progress value={day.water} goal={g.waterGlasses} />
        </section>

        <section className="card">
          <h3>Steps</h3>
          <input type="number" inputMode="numeric" min={0} value={day.steps || ""} placeholder="0" onChange={(e) => updateDay({ steps: numberOr0(e.target.value) })} aria-label="Steps" />
          <p className="small">
            Goal {g.steps.toLocaleString("en-IN")} · ≈ {((day.steps * state.profile.height * 0.414) / 100000).toFixed(1)} km
          </p>
          <Progress value={day.steps} goal={g.steps} />
        </section>

        <section className="card" style={{ gridColumn: "1 / -1" }}>
          <h3>Food</h3>
          <p className="small">
            {Math.round(totals.kcal).toLocaleString("en-IN")} of {g.calories.toLocaleString("en-IN")} kcal · {Math.round(totals.protein)} of{" "}
            {g.proteinG} g protein
          </p>
          <Progress value={totals.kcal} goal={g.calories} />
          <div style={{ marginTop: 12 }}>
            <input type="search" placeholder="Add food: roti, poha, दाल…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search food" />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((f) => (
                  <li key={f.slug}>
                    <button onClick={() => addFood(f.slug)}>
                      <span>
                        {f.name} <span className="muted small">({f.serving})</span>
                      </span>
                      <span className="muted">{f.kcal} kcal</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {day.foods.length > 0 && (
            <ul className="food-log">
              {day.foods.map((e) => {
                const f = FOODS.find((x) => x.slug === e.slug);
                if (!f) return null;
                return (
                  <li key={e.slug}>
                    <span>
                      {e.qty} × <Link href={`/calories/${f.slug}`}>{f.name}</Link> <span className="muted small">({f.serving})</span>
                    </span>
                    <span>
                      {Math.round(f.kcal * e.qty)} kcal{" "}
                      <button
                        onClick={() =>
                          updateDay({
                            foods: e.qty > 1 ? day.foods.map((x) => (x.slug === e.slug ? { ...x, qty: x.qty - 1 } : x)) : day.foods.filter((x) => x.slug !== e.slug),
                          })
                        }
                        aria-label={`Remove one ${f.name}`}
                      >
                        −
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card">
          <h3>Sleep</h3>
          <span className="with-unit">
            <input type="number" inputMode="decimal" min={0} max={24} step={0.5} value={day.sleep || ""} placeholder="0" onChange={(e) => updateDay({ sleep: Math.min(24, numberOr0(e.target.value)) })} aria-label="Hours slept" />
            <span className="unit">hours</span>
          </span>
          <Progress value={day.sleep} goal={g.sleepHours} />
        </section>

        <section className="card">
          <h3>Weight</h3>
          <span className="with-unit">
            <input
              type="number"
              inputMode="decimal"
              min={20}
              max={300}
              step={0.1}
              value={day.weight ?? ""}
              placeholder={String(state.profile.weight)}
              onChange={(e) => {
                const w = e.target.value === "" ? null : Number(e.target.value);
                updateDay({ weight: w });
                if (w && w >= 20 && w <= 300 && date === today) updateProfile({ weight: w });
              }}
              aria-label="Weight in kg"
            />
            <span className="unit">kg</span>
          </span>
        </section>

        <section className="card">
          <h3>Mood</h3>
          <div className="mood">
            {MOODS.map(([m, label]) => (
              <button key={m} aria-pressed={day.mood === m} onClick={() => updateDay({ mood: day.mood === m ? null : m })}>
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>

      <details className="card section">
        <summary>
          <b>Your profile and goals</b> <span className="muted small">— daily target {g.calories.toLocaleString("en-IN")} kcal</span>
        </summary>
        <div className="tool-form" style={{ border: 0, padding: "16px 0 0" }}>
          <div className="field">
            <label htmlFor="p-sex">Sex</label>
            <select id="p-sex" value={state.profile.sex} onChange={(e) => updateProfile({ sex: e.target.value as Sex })}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          {(["age", "height", "weight"] as const).map((k) => (
            <div className="field" key={k}>
              <label htmlFor={`p-${k}`}>{k === "age" ? "Age (years)" : k === "height" ? "Height (cm)" : "Weight (kg)"}</label>
              <input id={`p-${k}`} type="number" value={state.profile[k]} onChange={(e) => updateProfile({ [k]: numberOr0(e.target.value) || state.profile[k] })} />
            </div>
          ))}
          <div className="field">
            <label htmlFor="p-act">Activity level</label>
            <select id="p-act" value={state.profile.activity} onChange={(e) => updateProfile({ activity: e.target.value as ActivityLevel })}>
              {Object.entries(ACTIVITY_LEVELS).map(([k, a]) => (
                <option key={k} value={k}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="p-goal">Goal</label>
            <select id="p-goal" value={state.profile.goal} onChange={(e) => updateProfile({ goal: e.target.value as WeightGoal })}>
              <option value="lose">Lose weight</option>
              <option value="maintain">Maintain weight</option>
              <option value="gain">Gain muscle</option>
            </select>
          </div>
        </div>
      </details>

      <p className="small muted section">
        Your data stays on this device only.{" "}
        <button className="link-button" onClick={exportData}>
          Download my data
        </button>{" "}
        ·{" "}
        <button className="link-button" onClick={clearData}>
          Delete my data
        </button>
      </p>
    </>
  );
}
