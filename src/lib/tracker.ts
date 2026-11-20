// Daily tracker state and pure helpers. Persistence lives in the component (localStorage for the MVP).
import { FOODS } from "@/data/foods";
import * as c from "./calculators";

export type Mood = "great" | "good" | "okay" | "low" | "stressed";
export type FoodEntry = { slug: string; qty: number };
export type DayLog = { water: number; steps: number; sleep: number; weight: number | null; mood: Mood | null; foods: FoodEntry[] };
export type Profile = { sex: c.Sex; age: number; height: number; weight: number; activity: c.ActivityLevel; goal: c.WeightGoal };
export type TrackerState = { version: 1; profile: Profile; days: Record<string, DayLog> };

export const STORAGE_KEY = "fitly:tracker:v1";

export const emptyDay = (): DayLog => ({ water: 0, steps: 0, sleep: 0, weight: null, mood: null, foods: [] });

export const defaultState = (): TrackerState => ({
  version: 1,
  profile: { sex: "female", age: 30, height: 160, weight: 60, activity: "light", goal: "maintain" },
  days: {},
});

export function parseState(raw: string | null): TrackerState {
  if (!raw) return defaultState();
  try {
    const s = JSON.parse(raw);
    if (s?.version !== 1 || typeof s.days !== "object") return defaultState();
    return { ...defaultState(), ...s, profile: { ...defaultState().profile, ...s.profile } };
  } catch {
    return defaultState();
  }
}

export function goals(p: Profile) {
  const t = c.tdee(c.bmr(p.weight, p.height, p.age, p.sex), p.activity);
  return {
    calories: c.calorieTarget(t, p.goal, p.sex),
    waterGlasses: Math.round(c.waterIntakeMl(p.weight, 30, true) / 250),
    steps: 8000,
    sleepHours: 7,
    proteinG: c.proteinGrams(p.weight, p.goal === "lose" ? "loss" : "active")[0],
  };
}

export function foodTotals(day: DayLog) {
  return day.foods.reduce(
    (t, e) => {
      const f = FOODS.find((x) => x.slug === e.slug);
      if (!f) return t;
      return { kcal: t.kcal + f.kcal * e.qty, protein: t.protein + f.protein * e.qty };
    },
    { kcal: 0, protein: 0 },
  );
}

export const hasActivity = (d: DayLog | undefined) =>
  !!d && (d.water > 0 || d.steps > 0 || d.sleep > 0 || d.weight !== null || d.mood !== null || d.foods.length > 0);

/** Consecutive days with any entry, ending today (or yesterday, so the streak survives until the user logs today). */
export function streak(days: Record<string, DayLog>, todayIso: string): number {
  let cursor = hasActivity(days[todayIso]) ? todayIso : c.addDays(todayIso, -1);
  let n = 0;
  while (hasActivity(days[cursor])) {
    n++;
    cursor = c.addDays(cursor, -1);
  }
  return n;
}
