import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fitly — Health & Fitness",
    short_name: "Fitly",
    description: "Daily water, steps, sleep and food tracker with Indian food calories.",
    start_url: "/tracker",
    display: "standalone",
    background_color: "#f7f9f8",
    theme_color: "#0f9d6b",
  };
}
