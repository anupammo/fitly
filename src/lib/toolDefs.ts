// Form fields and result formatting for each tool. Imported by the client ToolRunner.
import * as c from "./calculators";

export type Field =
  | { name: string; label: string; type: "number"; unit?: string; min: number; max: number; step?: number; default: string }
  | { name: string; label: string; type: "select"; options: [string, string][]; default: string }
  | { name: string; label: string; type: "date"; default: "today" | "minus14" }
  | { name: string; label: string; type: "time"; default: string }
  | { name: string; label: string; type: "height"; default: string }
  | { name: string; label: string; type: "checkbox"; default: "" | "on" };

export type Tone = "good" | "warn" | "bad" | "neutral";
export type Result = { headline: string; sub?: string; tone?: Tone; rows?: [string, string][]; note?: string };
export type ToolDef = { fields: Field[]; compute: (v: Record<string, string>) => Result };

const sex: Field = { name: "sex", label: "Sex", type: "select", options: [["female", "Female"], ["male", "Male"]], default: "female" };
const age: Field = { name: "age", label: "Age", type: "number", unit: "years", min: 15, max: 100, default: "30" };
const height: Field = { name: "height", label: "Height", type: "height", default: "165" };
const weight: Field = { name: "weight", label: "Weight", type: "number", unit: "kg", min: 25, max: 250, step: 0.1, default: "65" };
const activity: Field = {
  name: "activity",
  label: "Activity level",
  type: "select",
  options: Object.entries(c.ACTIVITY_LEVELS).map(([k, v]) => [k, v.label]),
  default: "light",
};

const n = (v: Record<string, string>, k: string) => Number(v[k]);
const S = (v: Record<string, string>) => v.sex as c.Sex;
const kcal = (x: number) => `${x.toLocaleString("en-IN")} kcal`;
const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const fmtTime = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const toneFor = (cat: string): Tone => (cat === "Normal" ? "good" : cat === "Overweight" || cat === "Underweight" ? "warn" : "bad");

export const TOOL_DEFS: Record<string, ToolDef> = {
  "bmi-calculator": {
    fields: [height, weight],
    compute: (v) => {
      const b = c.bmi(n(v, "weight"), n(v, "height"));
      const cat = c.bmiCategory(b, "asian");
      const [lo, hi] = c.healthyWeightRange(n(v, "height"), "asian");
      return {
        headline: `BMI ${b}`,
        sub: cat,
        tone: toneFor(cat),
        rows: [
          ["Indian guideline category", cat],
          ["WHO category", c.bmiCategory(b, "who")],
          ["Healthy weight for your height", `${lo}–${hi} kg`],
        ],
      };
    },
  },
  "calorie-calculator": {
    fields: [sex, age, height, weight, activity],
    compute: (v) => {
      const b = c.bmr(n(v, "weight"), n(v, "height"), n(v, "age"), S(v));
      const t = c.tdee(b, v.activity as c.ActivityLevel);
      return {
        headline: kcal(t),
        sub: "to maintain your weight",
        tone: "neutral",
        rows: [
          ["Lose ~0.5 kg/week", kcal(c.calorieTarget(t, "lose", S(v)))],
          ["Maintain", kcal(t)],
          ["Gain muscle", kcal(c.calorieTarget(t, "gain", S(v)))],
          ["Resting (BMR)", kcal(b)],
        ],
      };
    },
  },
  "bmr-calculator": {
    fields: [sex, age, height, weight],
    compute: (v) => {
      const b = c.bmr(n(v, "weight"), n(v, "height"), n(v, "age"), S(v));
      return {
        headline: kcal(b),
        sub: "burned per day at complete rest",
        rows: Object.entries(c.ACTIVITY_LEVELS).map(([k, a]) => [a.label, kcal(c.tdee(b, k as c.ActivityLevel))]),
      };
    },
  },
  "ideal-weight-calculator": {
    fields: [sex, height],
    compute: (v) => {
      const [lo, hi] = c.healthyWeightRange(n(v, "height"), "asian");
      const [wlo, whi] = c.healthyWeightRange(n(v, "height"), "who");
      return {
        headline: `${lo}–${hi} kg`,
        sub: "healthy range (Indian guidelines)",
        tone: "good",
        rows: [
          ["Devine formula", `${c.idealWeightDevine(n(v, "height"), S(v))} kg`],
          ["WHO healthy range", `${wlo}–${whi} kg`],
        ],
      };
    },
  },
  "body-fat-calculator": {
    fields: [
      sex,
      height,
      { name: "neck", label: "Neck", type: "number", unit: "cm", min: 20, max: 70, step: 0.5, default: "33" },
      { name: "waist", label: "Waist", type: "number", unit: "cm", min: 40, max: 200, step: 0.5, default: "78" },
      { name: "hip", label: "Hip (women only)", type: "number", unit: "cm", min: 50, max: 200, step: 0.5, default: "98" },
    ],
    compute: (v) => {
      const pct = c.bodyFatNavy(S(v), n(v, "height"), n(v, "neck"), n(v, "waist"), n(v, "hip"));
      if (!Number.isFinite(pct)) return { headline: "Check measurements", sub: "Waist must be larger than neck.", tone: "warn" };
      const cat = c.bodyFatCategory(pct, S(v));
      return { headline: `${pct}%`, sub: cat, tone: cat === "Obese" ? "bad" : cat === "Average" ? "warn" : "good" };
    },
  },
  "waist-to-hip-ratio-calculator": {
    fields: [
      sex,
      { name: "waist", label: "Waist", type: "number", unit: "cm", min: 40, max: 200, step: 0.5, default: "80" },
      { name: "hip", label: "Hip", type: "number", unit: "cm", min: 50, max: 200, step: 0.5, default: "98" },
    ],
    compute: (v) => {
      const r = c.waistToHip(n(v, "waist"), n(v, "hip"));
      const risk = c.waistToHipRisk(r, S(v));
      return {
        headline: String(r),
        sub: `${risk} health risk`,
        tone: risk === "Low" ? "good" : "bad",
        note: `WHO threshold: ${S(v) === "male" ? "0.90" : "0.85"}`,
      };
    },
  },
  "water-intake-calculator": {
    fields: [
      weight,
      { name: "exercise", label: "Exercise per day", type: "number", unit: "min", min: 0, max: 300, default: "30" },
      { name: "hot", label: "Hot weather / summer", type: "checkbox", default: "on" },
    ],
    compute: (v) => {
      const ml = c.waterIntakeMl(n(v, "weight"), n(v, "exercise"), v.hot === "on");
      return { headline: `${(ml / 1000).toFixed(1)} litres`, sub: `about ${Math.round(ml / 250)} glasses of 250 ml`, tone: "neutral" };
    },
  },
  "protein-calculator": {
    fields: [
      weight,
      { name: "goal", label: "Goal", type: "select", options: Object.entries(c.PROTEIN_GOALS).map(([k, g]) => [k, g.label]), default: "active" },
    ],
    compute: (v) => {
      const [lo, hi] = c.proteinGrams(n(v, "weight"), v.goal as c.ProteinGoal);
      return {
        headline: `${lo}–${hi} g`,
        sub: "protein per day",
        rows: [
          ["1 katori dal", "~8 g"],
          ["100 g paneer", "~18 g"],
          ["1 katori curd", "~3 g"],
          ["2 eggs", "~13 g"],
        ],
      };
    },
  },
  "macro-calculator": {
    fields: [
      { name: "calories", label: "Daily calories", type: "number", unit: "kcal", min: 1000, max: 5000, step: 50, default: "1800" },
      { name: "split", label: "Diet style", type: "select", options: Object.entries(c.MACRO_SPLITS).map(([k, s]) => [k, s.label]), default: "balanced" },
    ],
    compute: (v) => {
      const m = c.macros(n(v, "calories"), v.split as c.MacroSplit);
      return {
        headline: `${m.carbsG} g · ${m.proteinG} g · ${m.fatG} g`,
        sub: "carbs · protein · fat",
        rows: [
          ["Carbohydrates", `${m.carbsG} g`],
          ["Protein", `${m.proteinG} g`],
          ["Fat", `${m.fatG} g`],
        ],
      };
    },
  },
  "calories-burned-calculator": {
    fields: [
      { name: "activity", label: "Activity", type: "select", options: Object.entries(c.ACTIVITIES).map(([k, a]) => [k, a.label]), default: "walkingBrisk" },
      weight,
      { name: "minutes", label: "Duration", type: "number", unit: "min", min: 1, max: 600, default: "30" },
    ],
    compute: (v) => ({
      headline: kcal(c.caloriesBurned(v.activity as c.Activity, n(v, "weight"), n(v, "minutes"))),
      sub: "burned",
    }),
  },
  "steps-to-km-calculator": {
    fields: [{ name: "steps", label: "Steps", type: "number", min: 100, max: 100000, step: 100, default: "8000" }, sex, height, weight],
    compute: (v) => {
      const r = c.stepsToDistance(n(v, "steps"), n(v, "height"), S(v), n(v, "weight"));
      return { headline: `${r.km} km`, sub: `about ${kcal(r.kcal)} burned` };
    },
  },
  "heart-rate-zone-calculator": {
    fields: [age],
    compute: (v) => {
      const r = c.heartRateZones(n(v, "age"));
      return { headline: `${r.max} bpm`, sub: "estimated maximum heart rate", rows: r.zones.map((z) => [z.name, `${z.min}–${z.max} bpm`]) };
    },
  },
  "period-calculator": {
    fields: [
      { name: "lmp", label: "First day of last period", type: "date", default: "minus14" },
      { name: "cycle", label: "Cycle length", type: "number", unit: "days", min: 21, max: 45, default: "28" },
    ],
    compute: (v) => {
      const cycles = c.cyclePrediction(v.lmp, n(v, "cycle"));
      return {
        headline: fmtDate(cycles[0].nextPeriod),
        sub: "next period expected",
        rows: cycles.flatMap((p, i) => [
          [`Period ${i + 1}`, fmtDate(p.nextPeriod)],
          [`Fertile window ${i + 1}`, `${fmtDate(p.fertileStart)} – ${fmtDate(p.fertileEnd)}`],
        ]) as [string, string][],
        note: "Predictions only. Not a method of contraception.",
      };
    },
  },
  "pregnancy-due-date-calculator": {
    fields: [
      { name: "lmp", label: "First day of last period", type: "date", default: "minus14" },
      { name: "cycle", label: "Cycle length", type: "number", unit: "days", min: 21, max: 45, default: "28" },
    ],
    compute: (v) => {
      const r = c.dueDate(v.lmp, n(v, "cycle"));
      return {
        headline: fmtDate(r.due),
        sub: "estimated due date",
        tone: "good",
        rows: [
          ["Current stage", r.weeks >= 0 ? `${r.weeks} weeks ${r.days} days` : "Date is in the future"],
          ["Trimester", String(r.trimester)],
        ],
      };
    },
  },
  "pregnancy-weight-gain-calculator": {
    fields: [height, { ...weight, label: "Weight before pregnancy" } as Field],
    compute: (v) => {
      const r = c.pregnancyWeightGain(n(v, "weight"), n(v, "height"));
      return { headline: `${r.range[0]}–${r.range[1]} kg`, sub: "recommended total gain (single baby)", rows: [["Pre-pregnancy BMI", String(r.bmi)]] };
    },
  },
  "sleep-calculator": {
    fields: [{ name: "wake", label: "I want to wake up at", type: "time", default: "06:30" }],
    compute: (v) => {
      const times = c.bedtimesFor(v.wake);
      return {
        headline: fmtTime(times[1].bedtime),
        sub: "go to bed for 7.5 hours of sleep",
        rows: times.map((t) => [`${t.cycles} cycles (${t.hours} h)`, fmtTime(t.bedtime)]),
      };
    },
  },
};
