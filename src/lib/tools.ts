// Tool metadata used for pages, navigation, sitemap and SEO. Server-safe (no functions).

export type ToolCategory = "Body" | "Nutrition" | "Fitness" | "Women's health" | "Wellness";

export type ToolMeta = {
  slug: string;
  name: string;
  category: ToolCategory;
  short: string;
  description: string;
  howItWorks: string;
  faqs: { q: string; a: string }[];
};

export const TOOLS: ToolMeta[] = [
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "Body",
    short: "Check if your weight is healthy for your height.",
    description: "Free BMI calculator with Asian-Indian cut-offs. Enter height in cm or feet and inches to see your BMI and healthy weight range.",
    howItWorks:
      "BMI is weight in kg divided by height in metres squared. Indians and other South Asians face higher diabetes and heart risk at lower BMI, so Indian guidelines treat 23 and above as overweight and 25 and above as obese, instead of the WHO's 25 and 30.",
    faqs: [
      { q: "What is a normal BMI for Indians?", a: "18.5 to 22.9 under Indian guidelines. The WHO range of 18.5 to 24.9 is also shown for comparison." },
      { q: "Is BMI accurate for athletes?", a: "No. Muscle weighs more than fat, so muscular people can show a high BMI. Use the body fat calculator alongside it." },
      { q: "Can I use BMI for children?", a: "Children need age- and sex-specific BMI percentiles. Ask a paediatrician to plot your child's growth chart." },
    ],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "Nutrition",
    short: "Daily calories to lose, keep or gain weight.",
    description: "Find how many calories you need per day to lose weight, maintain or gain muscle, using the Mifflin-St Jeor formula and your activity level.",
    howItWorks:
      "We estimate your resting calories (BMR) with the Mifflin-St Jeor equation, multiply by your activity level to get total daily energy expenditure (TDEE), then subtract 500 kcal to lose about 0.5 kg a week or add 300 kcal for a lean gain.",
    faqs: [
      { q: "How many calories should I eat to lose weight?", a: "About 500 kcal below your TDEE loses roughly 0.5 kg a week. We never suggest less than 1,200 kcal (women) or 1,500 kcal (men) without medical supervision." },
      { q: "Do I need to count calories forever?", a: "No. Logging for 2–4 weeks teaches portion sizes; after that many people track only occasionally." },
    ],
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "Body",
    short: "Calories your body burns at complete rest.",
    description: "Calculate your Basal Metabolic Rate (BMR), the calories your body burns at rest, with the Mifflin-St Jeor equation.",
    howItWorks: "BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age, then +5 for men or −161 for women. It is the energy your body needs for breathing, circulation and organ function.",
    faqs: [
      { q: "How can I increase my BMR?", a: "Building muscle through strength training is the most reliable way. Very low-calorie diets lower BMR." },
    ],
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "Body",
    short: "Healthy weight range for your height.",
    description: "Find your ideal body weight and healthy weight range by height, using the Devine formula and Asian-Indian BMI ranges.",
    howItWorks: "We show the weight range that keeps your BMI between 18.5 and 22.9 (Indian guidelines), plus the Devine formula used in clinical dosing as a single reference number.",
    faqs: [{ q: "Is there one perfect weight?", a: "No. A range is healthier to aim for than a single number; waist size and fitness matter too." }],
  },
  {
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    category: "Body",
    short: "Estimate body fat % with a measuring tape.",
    description: "Estimate your body fat percentage at home with the US Navy method using neck, waist and hip measurements.",
    howItWorks: "The US Navy method uses height and neck and waist circumference (plus hips for women). Measure the waist at the navel for men and at the narrowest point for women, relaxed, not sucked in.",
    faqs: [{ q: "How accurate is it?", a: "Typically within 3–4% of DEXA scans. Measure at the same time of day each time to track change." }],
  },
  {
    slug: "waist-to-hip-ratio-calculator",
    name: "Waist-to-Hip Ratio",
    category: "Body",
    short: "Belly-fat risk check in 10 seconds.",
    description: "Calculate your waist-to-hip ratio and check your risk of heart disease and diabetes using WHO thresholds.",
    howItWorks: "Divide waist circumference by hip circumference. The WHO links ratios above 0.90 in men and 0.85 in women to substantially higher metabolic risk.",
    faqs: [{ q: "Why does belly fat matter more?", a: "Fat around the organs (visceral fat) is linked to insulin resistance, a common problem for Indians even at normal weight." }],
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator",
    category: "Nutrition",
    short: "How much water to drink every day.",
    description: "Calculate how much water you should drink per day based on your weight, exercise and Indian summer heat.",
    howItWorks: "A common guideline is 35 ml per kg of body weight, plus about 500 ml for every 30 minutes of exercise and another 500 ml in hot weather. Food and other drinks count towards the total.",
    faqs: [{ q: "Does tea count as water?", a: "Yes, mostly. Chai and coffee hydrate too, though plain water is best for most of your intake." }],
  },
  {
    slug: "protein-calculator",
    name: "Protein Calculator",
    category: "Nutrition",
    short: "Daily protein need for your goal.",
    description: "Calculate daily protein requirement in grams for weight loss, muscle gain or general health, with vegetarian Indian food examples.",
    howItWorks: "Protein needs range from 0.8 g per kg of body weight for sedentary adults to 1.6–2.2 g per kg when building muscle. Most Indian diets fall short, especially vegetarian ones.",
    faqs: [{ q: "How can vegetarians get enough protein?", a: "Combine dal, paneer, curd, soya, chana, sprouts and milk through the day; 1 katori dal has about 8 g, 100 g paneer about 18 g." }],
  },
  {
    slug: "macro-calculator",
    name: "Macro Calculator",
    category: "Nutrition",
    short: "Split calories into carbs, protein and fat.",
    description: "Convert your daily calories into grams of carbohydrates, protein and fat for a balanced, high-protein or low-carb diet.",
    howItWorks: "Carbohydrates and protein have 4 kcal per gram, fat has 9. We split your calorie target by the chosen ratio and convert it to grams.",
    faqs: [{ q: "Which split is best?", a: "The one you can stick to. Balanced suits most people; high protein helps when losing weight or building muscle." }],
  },
  {
    slug: "calories-burned-calculator",
    name: "Calories Burned Calculator",
    category: "Fitness",
    short: "Calories burned walking, yoga, cricket and more.",
    description: "Calculate calories burned in walking, running, yoga, cycling, dancing, cricket, badminton and household work.",
    howItWorks: "Each activity has a MET value from the Compendium of Physical Activities. Calories = MET × weight (kg) × hours.",
    faqs: [{ q: "Are fitness band numbers more accurate?", a: "Bands use heart rate and can be closer for you personally, but both are estimates." }],
  },
  {
    slug: "steps-to-km-calculator",
    name: "Steps to KM Calculator",
    category: "Fitness",
    short: "Convert steps to distance and calories.",
    description: "Convert your daily steps to kilometres and calories burned using your height and weight.",
    howItWorks: "Stride length is roughly 41% of your height. Distance = steps × stride length. Calories are an estimate based on body weight.",
    faqs: [{ q: "Is 10,000 steps a day necessary?", a: "Health benefits rise steadily up to about 7,000–8,000 steps a day for most adults; more is a bonus." }],
  },
  {
    slug: "heart-rate-zone-calculator",
    name: "Heart Rate Zone Calculator",
    category: "Fitness",
    short: "Training zones from your age.",
    description: "Find your maximum heart rate and five training zones, including the fat-burning zone, from your age.",
    howItWorks: "Maximum heart rate is estimated with the Tanaka formula, 208 − 0.7 × age. Zones are percentages of that maximum.",
    faqs: [{ q: "Should I train in the fat-burn zone?", a: "Zone 2 builds endurance and is easy to sustain; mixing in harder zones burns more calories overall." }],
  },
  {
    slug: "period-calculator",
    name: "Period & Ovulation Calculator",
    category: "Women's health",
    short: "Next period, ovulation and fertile days.",
    description: "Predict your next three periods, ovulation day and fertile window from your last period date and cycle length.",
    howItWorks: "Ovulation usually happens about 14 days before the next period. The fertile window is the 5 days before ovulation and the day after.",
    faqs: [{ q: "Can I use this as contraception?", a: "No. Cycles vary, so calendar predictions are not reliable birth control." }],
  },
  {
    slug: "pregnancy-due-date-calculator",
    name: "Pregnancy Due Date Calculator",
    category: "Women's health",
    short: "Due date and current week of pregnancy.",
    description: "Calculate your baby's due date, current pregnancy week and trimester from the first day of your last period.",
    howItWorks: "Naegele's rule adds 280 days to the first day of your last period, adjusted if your cycle is longer or shorter than 28 days. Your doctor may update it after an ultrasound.",
    faqs: [{ q: "How many babies arrive on the due date?", a: "Only about 4–5%. Most arrive within two weeks either side." }],
  },
  {
    slug: "pregnancy-weight-gain-calculator",
    name: "Pregnancy Weight Gain Calculator",
    category: "Women's health",
    short: "Healthy total weight gain in pregnancy.",
    description: "See the recommended total weight gain during pregnancy based on your pre-pregnancy BMI.",
    howItWorks: "Recommendations follow the Institute of Medicine (2009) ranges for a single baby, based on BMI before pregnancy.",
    faqs: [{ q: "Is it different for twins?", a: "Yes, twin pregnancies need higher gain. Follow your obstetrician's advice." }],
  },
  {
    slug: "sleep-calculator",
    name: "Sleep Cycle Calculator",
    category: "Wellness",
    short: "Best bedtime to wake up fresh.",
    description: "Find the best time to go to sleep so you wake up between 90-minute sleep cycles and feel refreshed.",
    howItWorks: "Sleep runs in cycles of about 90 minutes. Waking at the end of a cycle feels easier. We add 15 minutes for falling asleep.",
    faqs: [{ q: "How much sleep do adults need?", a: "7–9 hours a night, which is 5 or 6 full cycles." }],
  },
];

export const TOOL_CATEGORIES: ToolCategory[] = ["Body", "Nutrition", "Fitness", "Women's health", "Wellness"];

export function getTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}
