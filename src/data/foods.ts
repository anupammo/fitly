// Indian food nutrition seed data, per typical home serving.
// STATUS: approximate values compiled for the MVP. Every row must be verified by the
// dietitian panel against IFCT 2017 (NIN) before `verified` is set to true.

export type Diet = "veg" | "egg" | "nonveg";

export type Food = {
  slug: string;
  name: string;
  hindi: string;
  category: string;
  serving: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  diet: Diet;
  verified: boolean;
};

type Row = [string, string, string, string, string, number, number, number, number, number, number, Diet];

const rows: Row[] = [
  // slug, name, hindi, category, serving, grams, kcal, protein, carbs, fat, fiber, diet
  ["roti", "Roti (Chapati)", "रोटी", "Breads", "1 medium", 40, 112, 3.5, 20, 2.5, 3, "veg"],
  ["phulka", "Phulka", "फुलका", "Breads", "1 piece", 30, 80, 2.6, 16, 0.5, 2.5, "veg"],
  ["plain-paratha", "Plain Paratha", "सादा पराठा", "Breads", "1 piece", 60, 220, 4.5, 29, 9.5, 3, "veg"],
  ["aloo-paratha", "Aloo Paratha", "आलू पराठा", "Breads", "1 piece", 100, 290, 6, 40, 11.5, 4, "veg"],
  ["puri", "Puri", "पूरी", "Breads", "1 piece", 25, 100, 1.7, 11, 5.5, 0.6, "veg"],
  ["naan", "Naan", "नान", "Breads", "1 piece", 90, 260, 8, 45, 5, 2, "veg"],
  ["bhatura", "Bhatura", "भटूरा", "Breads", "1 piece", 80, 300, 6, 38, 14, 1.5, "veg"],
  ["thepla", "Methi Thepla", "मेथी थेपला", "Breads", "1 piece", 40, 120, 3, 15, 5.5, 2, "veg"],

  ["white-rice", "Cooked White Rice", "चावल", "Rice", "1 katori", 150, 195, 4, 43, 0.4, 0.6, "veg"],
  ["brown-rice", "Cooked Brown Rice", "ब्राउन राइस", "Rice", "1 katori", 150, 165, 3.8, 34.5, 1.3, 2.7, "veg"],
  ["jeera-rice", "Jeera Rice", "जीरा राइस", "Rice", "1 katori", 150, 230, 4, 42, 5, 1, "veg"],
  ["veg-biryani", "Veg Biryani", "वेज बिरयानी", "Rice", "1 plate", 250, 400, 9, 60, 13, 4, "veg"],
  ["chicken-biryani", "Chicken Biryani", "चिकन बिरयानी", "Rice", "1 plate", 300, 500, 24, 60, 17, 3, "nonveg"],
  ["khichdi", "Moong Dal Khichdi", "खिचड़ी", "Rice", "1 bowl", 200, 230, 8, 38, 5, 4, "veg"],
  ["curd-rice", "Curd Rice", "दही चावल", "Rice", "1 bowl", 200, 280, 8, 42, 8, 1, "veg"],
  ["lemon-rice", "Lemon Rice", "लेमन राइस", "Rice", "1 bowl", 200, 320, 5, 52, 10, 2, "veg"],

  ["poha", "Poha", "पोहा", "Breakfast", "1 plate", 150, 250, 5, 42, 7, 2, "veg"],
  ["upma", "Upma", "उपमा", "Breakfast", "1 plate", 150, 250, 6, 38, 8, 3, "veg"],
  ["idli", "Idli", "इडली", "Breakfast", "1 piece", 40, 58, 2, 12, 0.2, 0.5, "veg"],
  ["plain-dosa", "Plain Dosa", "सादा डोसा", "Breakfast", "1 piece", 80, 133, 3.5, 22, 3.7, 1, "veg"],
  ["masala-dosa", "Masala Dosa", "मसाला डोसा", "Breakfast", "1 piece", 175, 390, 7, 55, 16, 4, "veg"],
  ["medu-vada", "Medu Vada", "मेदु वड़ा", "Breakfast", "1 piece", 50, 145, 4.5, 14, 8, 2, "veg"],
  ["uttapam", "Onion Uttapam", "उत्तपम", "Breakfast", "1 piece", 120, 210, 6, 34, 5.5, 2, "veg"],
  ["dhokla", "Khaman Dhokla", "ढोकला", "Breakfast", "2 pieces", 80, 130, 5, 20, 3.5, 1.5, "veg"],
  ["besan-chilla", "Besan Chilla", "बेसन चीला", "Breakfast", "1 piece", 80, 160, 7, 17, 7, 3, "veg"],
  ["boiled-egg", "Boiled Egg", "उबला अंडा", "Breakfast", "1 egg", 50, 78, 6.3, 0.6, 5.3, 0, "egg"],
  ["omelette", "Masala Omelette", "ऑमलेट", "Breakfast", "2 eggs", 120, 200, 13, 2, 15, 0.5, "egg"],

  ["sambar", "Sambar", "सांभर", "Dal & Curry", "1 katori", 150, 130, 6, 18, 4, 4, "veg"],
  ["coconut-chutney", "Coconut Chutney", "नारियल चटनी", "Dal & Curry", "2 tbsp", 30, 70, 0.8, 2.5, 6.5, 1.5, "veg"],
  ["dal-tadka", "Dal Tadka (Toor)", "दाल तड़का", "Dal & Curry", "1 katori", 150, 150, 8, 20, 4.5, 4, "veg"],
  ["moong-dal", "Yellow Moong Dal", "मूंग दाल", "Dal & Curry", "1 katori", 150, 120, 8, 17, 2.5, 3, "veg"],
  ["dal-makhani", "Dal Makhani", "दाल मखनी", "Dal & Curry", "1 katori", 150, 260, 9, 24, 14, 6, "veg"],
  ["rajma", "Rajma Curry", "राजमा", "Dal & Curry", "1 katori", 150, 190, 9, 26, 5.5, 7, "veg"],
  ["chole", "Chole (Chickpea Curry)", "छोले", "Dal & Curry", "1 katori", 150, 210, 9, 28, 7, 7, "veg"],
  ["kadhi", "Kadhi", "कढ़ी", "Dal & Curry", "1 katori", 150, 140, 5, 12, 8, 1, "veg"],
  ["palak-paneer", "Palak Paneer", "पालक पनीर", "Dal & Curry", "1 katori", 150, 240, 11, 9, 18, 3, "veg"],
  ["paneer-butter-masala", "Paneer Butter Masala", "पनीर बटर मसाला", "Dal & Curry", "1 katori", 150, 330, 12, 12, 26, 2, "veg"],
  ["aloo-gobi", "Aloo Gobi", "आलू गोभी", "Dal & Curry", "1 katori", 150, 140, 3.5, 16, 7, 4, "veg"],
  ["bhindi-masala", "Bhindi Masala", "भिंडी मसाला", "Dal & Curry", "1 katori", 150, 130, 3, 12, 8, 5, "veg"],
  ["mixed-veg", "Mixed Veg Curry", "मिक्स वेज", "Dal & Curry", "1 katori", 150, 140, 3.5, 15, 7.5, 4, "veg"],
  ["butter-chicken", "Butter Chicken", "बटर चिकन", "Dal & Curry", "1 katori", 150, 340, 24, 9, 23, 1, "nonveg"],
  ["chicken-curry", "Chicken Curry", "चिकन करी", "Dal & Curry", "1 katori", 150, 250, 22, 6, 15, 1, "nonveg"],
  ["fish-curry", "Fish Curry", "मछली करी", "Dal & Curry", "1 katori", 150, 200, 20, 5, 11, 1, "nonveg"],
  ["egg-curry", "Egg Curry", "अंडा करी", "Dal & Curry", "2 eggs with gravy", 200, 260, 14, 8, 19, 1, "egg"],
  ["mutton-curry", "Mutton Curry", "मटन करी", "Dal & Curry", "1 katori", 150, 300, 22, 5, 21, 1, "nonveg"],

  ["paneer", "Paneer", "पनीर", "Protein", "100 g", 100, 265, 18.3, 1.2, 20.8, 0, "veg"],
  ["tofu", "Tofu (firm)", "टोफू", "Protein", "100 g", 100, 120, 13, 2, 7, 1, "veg"],
  ["grilled-chicken-breast", "Grilled Chicken Breast", "ग्रिल्ड चिकन", "Protein", "100 g", 100, 165, 31, 0, 3.6, 0, "nonveg"],
  ["sprouts-salad", "Moong Sprouts Salad", "अंकुरित मूंग", "Protein", "1 bowl", 100, 60, 5, 10, 0.5, 3, "veg"],
  ["roasted-peanuts", "Roasted Peanuts", "मूंगफली", "Protein", "1 handful", 30, 170, 7.5, 5, 14, 2.5, "veg"],
  ["almonds", "Almonds", "बादाम", "Protein", "10 pieces", 14, 82, 3, 3, 7, 1.7, "veg"],
  ["curd", "Curd (Dahi)", "दही", "Dairy", "1 katori", 100, 60, 3.1, 4.7, 3.3, 0, "veg"],
  ["toned-milk", "Toned Milk", "दूध", "Dairy", "1 glass", 250, 145, 7.5, 12, 7.5, 0, "veg"],
  ["chaas", "Buttermilk (Chaas)", "छाछ", "Dairy", "1 glass", 250, 40, 2, 3, 1.5, 0, "veg"],
  ["sweet-lassi", "Sweet Lassi", "मीठी लस्सी", "Dairy", "1 glass", 250, 190, 6, 32, 4.5, 0, "veg"],

  ["samosa", "Samosa", "समोसा", "Snacks", "1 piece", 100, 260, 4, 30, 14, 2.5, "veg"],
  ["pakora", "Onion Pakora", "प्याज़ पकोड़ा", "Snacks", "4 pieces", 80, 240, 5, 20, 16, 2, "veg"],
  ["pav-bhaji", "Pav Bhaji", "पाव भाजी", "Snacks", "1 plate (2 pav)", 300, 450, 11, 62, 18, 7, "veg"],
  ["vada-pav", "Vada Pav", "वड़ा पाव", "Snacks", "1 piece", 150, 300, 7, 42, 12, 3, "veg"],
  ["pani-puri", "Pani Puri", "पानी पूरी", "Snacks", "6 pieces", 90, 180, 3.5, 28, 6, 2, "veg"],
  ["bhel-puri", "Bhel Puri", "भेल पूरी", "Snacks", "1 plate", 100, 200, 5, 32, 6, 3, "veg"],
  ["instant-noodles", "Instant Noodles", "इंस्टेंट नूडल्स", "Snacks", "1 pack (70 g)", 70, 310, 7, 44, 12, 2, "veg"],
  ["roasted-makhana", "Roasted Makhana", "मखाना", "Snacks", "1 bowl", 30, 110, 3, 20, 1.5, 2, "veg"],

  ["gulab-jamun", "Gulab Jamun", "गुलाब जामुन", "Sweets", "1 piece", 40, 150, 2, 22, 6, 0.3, "veg"],
  ["jalebi", "Jalebi", "जलेबी", "Sweets", "2 pieces", 50, 190, 1, 30, 7.5, 0.2, "veg"],
  ["rasgulla", "Rasgulla", "रसगुल्ला", "Sweets", "1 piece", 50, 105, 2, 22, 1, 0, "veg"],
  ["kheer", "Rice Kheer", "खीर", "Sweets", "1 katori", 150, 220, 6, 32, 7.5, 0.5, "veg"],
  ["besan-ladoo", "Besan Ladoo", "बेसन लड्डू", "Sweets", "1 piece", 40, 190, 3.5, 20, 11, 1, "veg"],

  ["banana", "Banana", "केला", "Fruits", "1 medium", 118, 105, 1.3, 27, 0.4, 3.1, "veg"],
  ["apple", "Apple", "सेब", "Fruits", "1 medium", 180, 95, 0.5, 25, 0.3, 4.4, "veg"],
  ["mango", "Mango", "आम", "Fruits", "1 cup sliced", 165, 99, 1.4, 25, 0.6, 2.6, "veg"],
  ["papaya", "Papaya", "पपीता", "Fruits", "1 cup", 145, 62, 0.7, 16, 0.4, 2.5, "veg"],
  ["guava", "Guava", "अमरूद", "Fruits", "1 medium", 100, 68, 2.6, 14, 1, 5.4, "veg"],

  ["masala-chai", "Masala Chai (milk, sugar)", "मसाला चाय", "Drinks", "1 cup", 150, 80, 2, 12, 2.5, 0, "veg"],
  ["filter-coffee", "Filter Coffee (milk, sugar)", "फ़िल्टर कॉफ़ी", "Drinks", "1 cup", 150, 95, 3, 13, 3.5, 0, "veg"],
  ["coconut-water", "Coconut Water", "नारियल पानी", "Drinks", "1 glass", 250, 48, 1.8, 9, 0.5, 2.6, "veg"],
  ["sugarcane-juice", "Sugarcane Juice", "गन्ने का रस", "Drinks", "1 glass", 250, 180, 0.5, 45, 0.2, 0, "veg"],
];

export const FOODS: Food[] = rows.map(
  ([slug, name, hindi, category, serving, grams, kcal, protein, carbs, fat, fiber, diet]) => ({
    slug, name, hindi, category, serving, grams, kcal, protein, carbs, fat, fiber, diet, verified: false,
  }),
);

export const FOOD_CATEGORIES = [...new Set(FOODS.map((f) => f.category))];

export function getFood(slug: string): Food | undefined {
  return FOODS.find((f) => f.slug === slug);
}

export function per100g(f: Food) {
  const k = 100 / f.grams;
  const r = (n: number) => Math.round(n * k * 10) / 10;
  return { kcal: Math.round(f.kcal * k), protein: r(f.protein), carbs: r(f.carbs), fat: r(f.fat), fiber: r(f.fiber) };
}
