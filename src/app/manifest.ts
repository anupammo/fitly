import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Fitly — Health & Fitness",
    short_name: "Fitly",
    description: "Daily water, steps, sleep and food tracker with Indian food calories and free health calculators.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#f7f9f8",
    theme_color: "#0f9d6b",
    lang: "en-IN",
    dir: "ltr",
    categories: ["health", "fitness", "lifestyle", "food"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Add a glass of water", short_name: "Water +1", url: "/tracker?add=water&source=shortcut", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Daily tracker", short_name: "Tracker", url: "/tracker?source=shortcut", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "BMI calculator", short_name: "BMI", url: "/tools/bmi-calculator?source=shortcut", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Food calories", short_name: "Calories", url: "/calories?source=shortcut", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
    screenshots: [
      { src: "/screenshots/tracker-narrow.png", sizes: "824x1830", type: "image/png", form_factor: "narrow", label: "Daily tracker for water, steps, food and sleep" },
      { src: "/screenshots/tools-narrow.png", sizes: "824x1830", type: "image/png", form_factor: "narrow", label: "Free BMI and calorie calculators" },
      { src: "/screenshots/home-wide.png", sizes: "1280x800", type: "image/png", form_factor: "wide", label: "Fitly home" },
    ],
  };
}
