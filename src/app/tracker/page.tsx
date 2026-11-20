import type { Metadata } from "next";
import Tracker from "@/components/Tracker";

export const metadata: Metadata = {
  title: "Daily Health Tracker — Water, Steps, Food, Sleep",
  description: "Free daily tracker for water, steps, Indian food calories, sleep, weight and mood. Works without sign-up; data stays on your device.",
  alternates: { canonical: "/tracker" },
};

export default function TrackerPage() {
  return (
    <>
      <h1>Daily tracker</h1>
      <p className="lead">Log water, steps, meals, sleep and mood in seconds. Keep your streak going.</p>
      <Tracker />
    </>
  );
}
