import { describe, expect, it } from "vitest";
import { FOODS, per100g } from "./foods";

describe("food database", () => {
  it("has unique slugs", () => {
    expect(new Set(FOODS.map((f) => f.slug)).size).toBe(FOODS.length);
  });

  it("has calories consistent with macros (Atwater 4/4/9, within 20%)", () => {
    const off = FOODS.filter((f) => {
      const est = 4 * f.protein + 4 * f.carbs + 9 * f.fat;
      return Math.abs(est - f.kcal) / f.kcal > 0.2;
    }).map((f) => `${f.slug}: ${f.kcal} vs ${Math.round(4 * f.protein + 4 * f.carbs + 9 * f.fat)}`);
    expect(off).toEqual([]);
  });

  it("scales to per 100 g", () => {
    const roti = FOODS.find((f) => f.slug === "roti")!;
    expect(per100g(roti).kcal).toBe(280);
  });
});
