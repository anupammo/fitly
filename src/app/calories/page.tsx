import type { Metadata } from "next";
import FoodSearch from "@/components/FoodSearch";
import { FOODS } from "@/data/foods";

export const metadata: Metadata = {
  title: "Calories in Indian Food — Calorie Chart",
  description: `Calories, protein, carbs and fat in ${FOODS.length}+ Indian foods per serving: roti, rice, dal, idli, dosa, paneer, biryani, sweets and more.`,
  alternates: { canonical: "/calories" },
};

export default function CaloriesPage() {
  return (
    <>
      <h1>Calories in Indian food</h1>
      <p className="lead">
        Calories and nutrition for {FOODS.length} everyday Indian foods, per typical home serving (katori, piece or plate).
      </p>
      <FoodSearch />
    </>
  );
}
