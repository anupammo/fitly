import { describe, expect, it } from "vitest";
import * as c from "./calculators";

describe("body", () => {
  it("computes BMI and both category standards", () => {
    expect(c.bmi(70, 175)).toBe(22.9);
    expect(c.bmiCategory(22.9)).toBe("Normal");
    expect(c.bmi(80, 170)).toBe(27.7);
    expect(c.bmiCategory(27.7, "asian")).toBe("Obese");
    expect(c.bmiCategory(27.7, "who")).toBe("Overweight");
    expect(c.bmiCategory(17)).toBe("Underweight");
  });

  it("gives a healthy weight range from height", () => {
    expect(c.healthyWeightRange(170, "asian")).toEqual([53.5, 66.2]);
    expect(c.healthyWeightRange(170, "who")).toEqual([53.5, 72]);
  });

  it("uses the Devine formula for ideal weight", () => {
    expect(c.idealWeightDevine(152.4, "male")).toBe(50);
    expect(c.idealWeightDevine(152.4, "female")).toBe(45.5);
    expect(c.idealWeightDevine(177.8, "male")).toBe(73);
  });

  it("computes Mifflin-St Jeor BMR and TDEE", () => {
    expect(c.bmr(70, 175, 30, "male")).toBe(1649);
    expect(c.bmr(70, 175, 30, "female")).toBe(1483);
    expect(c.tdee(1649, "moderate")).toBe(2556);
  });

  it("never sets a calorie target below the safe floor", () => {
    expect(c.calorieTarget(1500, "lose", "female")).toBe(1200);
    expect(c.calorieTarget(2500, "lose", "male")).toBe(2000);
    expect(c.calorieTarget(2500, "gain", "male")).toBe(2800);
  });

  it("estimates body fat with the US Navy method", () => {
    const male = c.bodyFatNavy("male", 178, 38, 86);
    expect(male).toBeGreaterThan(14);
    expect(male).toBeLessThan(20);
    const female = c.bodyFatNavy("female", 163, 33, 76, 98);
    expect(female).toBeGreaterThan(22);
    expect(female).toBeLessThan(32);
    expect(c.bodyFatNavy("male", 178, 40, 38)).toBeNaN();
    expect(c.bodyFatCategory(16, "male")).toBe("Fit");
  });

  it("flags waist-to-hip risk with WHO thresholds", () => {
    expect(c.waistToHip(90, 100)).toBe(0.9);
    expect(c.waistToHipRisk(0.9, "male")).toBe("Low");
    expect(c.waistToHipRisk(0.88, "female")).toBe("High");
  });
});

describe("nutrition", () => {
  it("computes water intake", () => {
    expect(c.waterIntakeMl(60, 30, true)).toBe(3100);
    expect(c.waterIntakeMl(60, 0, false)).toBe(2100);
  });

  it("computes protein and macros", () => {
    expect(c.proteinGrams(70, "muscle")).toEqual([112, 154]);
    expect(c.macros(2000, "balanced")).toEqual({ carbsG: 250, proteinG: 100, fatG: 67 });
  });
});

describe("fitness", () => {
  it("computes calories burned from METs", () => {
    expect(c.caloriesBurned("walkingBrisk", 70, 60)).toBe(301);
  });

  it("converts steps to distance", () => {
    const r = c.stepsToDistance(10000, 170, "male", 70);
    expect(r.km).toBe(7.06);
    expect(r.kcal).toBe(350);
  });

  it("computes heart-rate zones from Tanaka max HR", () => {
    const r = c.heartRateZones(30);
    expect(r.max).toBe(187);
    expect(r.zones[1]).toEqual({ name: "Zone 2 · Fat burn", min: 112, max: 131 });
  });
});

describe("dates", () => {
  it("predicts cycles", () => {
    const [first] = c.cyclePrediction("2026-01-01", 28);
    expect(first).toEqual({
      nextPeriod: "2026-01-29",
      ovulation: "2026-01-15",
      fertileStart: "2026-01-10",
      fertileEnd: "2026-01-16",
    });
  });

  it("computes due date and pregnancy week", () => {
    expect(c.dueDate("2026-01-01", 28, "2026-03-01")).toEqual({ due: "2026-10-08", weeks: 8, days: 3, trimester: 1 });
    expect(c.dueDate("2026-01-01", 32, "2026-03-01").due).toBe("2026-10-12");
  });

  it("gives IOM pregnancy weight gain by BMI", () => {
    expect(c.pregnancyWeightGain(55, 160)).toEqual({ bmi: 21.5, range: [11.5, 16] });
    expect(c.pregnancyWeightGain(45, 160).range).toEqual([12.5, 18]);
  });

  it("suggests bedtimes in 90-minute cycles, wrapping past midnight", () => {
    expect(c.bedtimesFor("06:30").map((b) => b.bedtime)).toEqual(["21:15", "22:45", "00:15"]);
  });
});
