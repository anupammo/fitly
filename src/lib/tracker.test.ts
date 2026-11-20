import { describe, expect, it } from "vitest";
import { defaultState, emptyDay, foodTotals, goals, parseState, streak } from "./tracker";

describe("tracker", () => {
  it("recovers from missing or corrupt storage", () => {
    expect(parseState(null)).toEqual(defaultState());
    expect(parseState("{not json")).toEqual(defaultState());
    expect(parseState(JSON.stringify({ version: 99 }))).toEqual(defaultState());
  });

  it("keeps saved days and fills missing profile fields", () => {
    const s = parseState(JSON.stringify({ version: 1, profile: { age: 40 }, days: { "2026-01-01": emptyDay() } }));
    expect(s.profile.age).toBe(40);
    expect(s.profile.sex).toBe("female");
    expect(Object.keys(s.days)).toEqual(["2026-01-01"]);
  });

  it("totals logged food", () => {
    const day = { ...emptyDay(), foods: [{ slug: "roti", qty: 2 }, { slug: "dal-tadka", qty: 1 }, { slug: "unknown", qty: 1 }] };
    expect(foodTotals(day)).toEqual({ kcal: 374, protein: 15 });
  });

  it("derives goals from the profile", () => {
    const g = goals(defaultState().profile);
    expect(g.calories).toBeGreaterThan(1500);
    expect(g.waterGlasses).toBe(12);
  });

  it("counts streaks that end today or yesterday", () => {
    const logged = { ...emptyDay(), water: 1 };
    const days = { "2026-01-01": logged, "2026-01-02": logged, "2026-01-03": logged };
    expect(streak(days, "2026-01-03")).toBe(3);
    expect(streak(days, "2026-01-04")).toBe(3);
    expect(streak(days, "2026-01-05")).toBe(0);
    expect(streak({ ...days, "2026-01-02": emptyDay() }, "2026-01-03")).toBe(1);
  });
});
