// Pure health and fitness formulas. No UI code here, so every function is unit-tested.
// Units: kg, cm, years, minutes. Dates are ISO strings (YYYY-MM-DD) handled in UTC.

export type Sex = "male" | "female";

const round = (n: number, dp = 1) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

// ---------- Body ----------

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return round(weightKg / (m * m), 1);
}

export type BmiStandard = "asian" | "who";

/**
 * Asian-Indian cut-offs (Consensus Statement for India, 2009) are the default
 * because South Asians carry more risk at a lower BMI. WHO cut-offs are offered too.
 */
export function bmiCategory(value: number, standard: BmiStandard = "asian"): string {
  const [over, obese] = standard === "asian" ? [23, 25] : [25, 30];
  if (value < 18.5) return "Underweight";
  if (value < over) return "Normal";
  if (value < obese) return "Overweight";
  return "Obese";
}

/** Weight range (kg) that keeps BMI inside the healthy band for the chosen standard. */
export function healthyWeightRange(heightCm: number, standard: BmiStandard = "asian"): [number, number] {
  const m = heightCm / 100;
  const upper = standard === "asian" ? 22.9 : 24.9;
  return [round(18.5 * m * m, 1), round(upper * m * m, 1)];
}

/** Devine formula, the one most clinical references use. */
export function idealWeightDevine(heightCm: number, sex: Sex): number {
  const inchesOver5ft = Math.max(0, heightCm / 2.54 - 60);
  const base = sex === "male" ? 50 : 45.5;
  return round(base + 2.3 * inchesOver5ft, 1);
}

/** Mifflin-St Jeor resting energy expenditure, kcal/day. */
export function bmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "male" ? base + 5 : base - 161);
}

export const ACTIVITY_LEVELS = {
  sedentary: { factor: 1.2, label: "Sedentary (desk job, little exercise)" },
  light: { factor: 1.375, label: "Light (exercise 1–3 days/week)" },
  moderate: { factor: 1.55, label: "Moderate (exercise 3–5 days/week)" },
  active: { factor: 1.725, label: "Active (exercise 6–7 days/week)" },
  athlete: { factor: 1.9, label: "Very active (physical job or 2x training)" },
} as const;
export type ActivityLevel = keyof typeof ACTIVITY_LEVELS;

export function tdee(bmrKcal: number, activity: ActivityLevel): number {
  return Math.round(bmrKcal * ACTIVITY_LEVELS[activity].factor);
}

export type WeightGoal = "lose" | "maintain" | "gain";

/** Daily calorie target: about 0.5 kg/week loss or a lean gain, never below a safe floor. */
export function calorieTarget(tdeeKcal: number, goal: WeightGoal, sex: Sex): number {
  const floor = sex === "male" ? 1500 : 1200;
  if (goal === "lose") return Math.max(floor, tdeeKcal - 500);
  if (goal === "gain") return tdeeKcal + 300;
  return tdeeKcal;
}

/** US Navy circumference method. Returns body fat %. */
export function bodyFatNavy(
  sex: Sex,
  heightCm: number,
  neckCm: number,
  waistCm: number,
  hipCm = 0,
): number {
  if (sex === "male") {
    const d = waistCm - neckCm;
    if (d <= 0) return NaN;
    return round(495 / (1.0324 - 0.19077 * Math.log10(d) + 0.15456 * Math.log10(heightCm)) - 450, 1);
  }
  const d = waistCm + hipCm - neckCm;
  if (d <= 0) return NaN;
  return round(495 / (1.29579 - 0.35004 * Math.log10(d) + 0.221 * Math.log10(heightCm)) - 450, 1);
}

export function bodyFatCategory(pct: number, sex: Sex): string {
  // American Council on Exercise ranges.
  const t = sex === "male" ? [6, 14, 18, 25] : [14, 21, 25, 32];
  if (pct < t[0]) return "Essential fat";
  if (pct < t[1]) return "Athletic";
  if (pct < t[2]) return "Fit";
  if (pct < t[3]) return "Average";
  return "Obese";
}

export function waistToHip(waistCm: number, hipCm: number): number {
  return round(waistCm / hipCm, 2);
}

/** WHO 2008: substantially increased risk above 0.90 (men) / 0.85 (women). */
export function waistToHipRisk(ratio: number, sex: Sex): "Low" | "High" {
  return ratio > (sex === "male" ? 0.9 : 0.85) ? "High" : "Low";
}

// ---------- Nutrition ----------

/** ml/day: 35 ml per kg, +500 ml per 30 min of exercise, +500 ml in hot weather. */
export function waterIntakeMl(weightKg: number, exerciseMin: number, hotClimate: boolean): number {
  const ml = weightKg * 35 + (exerciseMin / 30) * 500 + (hotClimate ? 500 : 0);
  return Math.round(ml / 50) * 50;
}

export const PROTEIN_GOALS = {
  sedentary: { range: [0.8, 1.0], label: "Sedentary adult" },
  active: { range: [1.2, 1.6], label: "Regular exercise" },
  muscle: { range: [1.6, 2.2], label: "Building muscle" },
  loss: { range: [1.2, 1.6], label: "Losing weight (keep muscle)" },
  senior: { range: [1.0, 1.2], label: "Age 60+" },
} as const;
export type ProteinGoal = keyof typeof PROTEIN_GOALS;

export function proteinGrams(weightKg: number, goal: ProteinGoal): [number, number] {
  const [lo, hi] = PROTEIN_GOALS[goal].range;
  return [Math.round(weightKg * lo), Math.round(weightKg * hi)];
}

export const MACRO_SPLITS = {
  balanced: { carbs: 50, protein: 20, fat: 30, label: "Balanced (typical Indian diet)" },
  highProtein: { carbs: 40, protein: 30, fat: 30, label: "High protein" },
  lowCarb: { carbs: 25, protein: 35, fat: 40, label: "Low carb" },
} as const;
export type MacroSplit = keyof typeof MACRO_SPLITS;

export function macros(calories: number, split: MacroSplit) {
  const s = MACRO_SPLITS[split];
  return {
    carbsG: Math.round((calories * s.carbs) / 100 / 4),
    proteinG: Math.round((calories * s.protein) / 100 / 4),
    fatG: Math.round((calories * s.fat) / 100 / 9),
  };
}

// ---------- Fitness ----------

/** MET values from the 2011 Compendium of Physical Activities. */
export const ACTIVITIES = {
  walkingSlow: { met: 2.8, label: "Walking, slow (3 km/h)" },
  walkingBrisk: { met: 4.3, label: "Walking, brisk (5.5 km/h)" },
  running: { met: 9.8, label: "Running (9.5 km/h)" },
  cycling: { met: 6.8, label: "Cycling, moderate" },
  swimming: { met: 5.8, label: "Swimming, moderate" },
  yoga: { met: 2.5, label: "Yoga (hatha)" },
  skipping: { met: 11.8, label: "Skipping rope" },
  dancing: { met: 5.0, label: "Dancing (Zumba, garba, bhangra)" },
  strength: { met: 3.5, label: "Strength training, moderate" },
  cricket: { met: 4.8, label: "Cricket" },
  badminton: { met: 5.5, label: "Badminton" },
  chores: { met: 3.3, label: "Household chores" },
} as const;
export type Activity = keyof typeof ACTIVITIES;

export function caloriesBurned(activity: Activity, weightKg: number, minutes: number): number {
  return Math.round(ACTIVITIES[activity].met * weightKg * (minutes / 60));
}

export function stepsToDistance(steps: number, heightCm: number, sex: Sex, weightKg: number) {
  const strideM = (heightCm * (sex === "male" ? 0.415 : 0.413)) / 100;
  return {
    km: round((steps * strideM) / 1000, 2),
    kcal: Math.round(steps * weightKg * 0.0005),
  };
}

/** Tanaka formula (208 - 0.7 x age), more accurate than 220 - age for adults. */
export function maxHeartRate(age: number): number {
  return Math.round(208 - 0.7 * age);
}

export function heartRateZones(age: number) {
  const max = maxHeartRate(age);
  const zones = [
    { name: "Zone 1 · Warm-up", lo: 0.5, hi: 0.6 },
    { name: "Zone 2 · Fat burn", lo: 0.6, hi: 0.7 },
    { name: "Zone 3 · Aerobic", lo: 0.7, hi: 0.8 },
    { name: "Zone 4 · Threshold", lo: 0.8, hi: 0.9 },
    { name: "Zone 5 · Maximum", lo: 0.9, hi: 1.0 },
  ];
  return { max, zones: zones.map((z) => ({ name: z.name, min: Math.round(max * z.lo), max: Math.round(max * z.hi) })) };
}

// ---------- Dates (women's health, sleep) ----------

const DAY = 86_400_000;
const parseDate = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
export const addDays = (iso: string, days: number) => new Date(parseDate(iso) + days * DAY).toISOString().slice(0, 10);
export const daysBetween = (fromIso: string, toIso: string) => Math.round((parseDate(toIso) - parseDate(fromIso)) / DAY);

export function cyclePrediction(lastPeriodIso: string, cycleLength: number, cycles = 3) {
  return Array.from({ length: cycles }, (_, i) => {
    const nextPeriod = addDays(lastPeriodIso, cycleLength * (i + 1));
    const ovulation = addDays(nextPeriod, -14);
    return {
      nextPeriod,
      ovulation,
      fertileStart: addDays(ovulation, -5),
      fertileEnd: addDays(ovulation, 1),
    };
  });
}

/** Naegele's rule adjusted for cycle length. */
export function dueDate(lastPeriodIso: string, cycleLength = 28, todayIso?: string) {
  const due = addDays(lastPeriodIso, 280 + (cycleLength - 28));
  const today = todayIso ?? new Date().toISOString().slice(0, 10);
  const daysPregnant = daysBetween(lastPeriodIso, today) - (cycleLength - 28);
  return {
    due,
    weeks: Math.floor(daysPregnant / 7),
    days: ((daysPregnant % 7) + 7) % 7,
    trimester: daysPregnant < 14 * 7 ? 1 : daysPregnant < 28 * 7 ? 2 : 3,
  };
}

/** Institute of Medicine (2009) total gain for a single baby, by pre-pregnancy BMI (WHO bands). */
export function pregnancyWeightGain(preWeightKg: number, heightCm: number): { bmi: number; range: [number, number] } {
  const b = bmi(preWeightKg, heightCm);
  const range: [number, number] = b < 18.5 ? [12.5, 18] : b < 25 ? [11.5, 16] : b < 30 ? [7, 11.5] : [5, 9];
  return { bmi: b, range };
}

/** Bedtimes for 6, 5 and 4 full 90-minute cycles, plus 15 minutes to fall asleep. */
export function bedtimesFor(wakeHHMM: string): { cycles: number; bedtime: string; hours: number }[] {
  const [h, m] = wakeHHMM.split(":").map(Number);
  const wake = h * 60 + m;
  return [6, 5, 4].map((cycles) => {
    const t = (((wake - cycles * 90 - 15) % 1440) + 1440) % 1440;
    const hh = String(Math.floor(t / 60)).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");
    return { cycles, bedtime: `${hh}:${mm}`, hours: (cycles * 90) / 60 };
  });
}
