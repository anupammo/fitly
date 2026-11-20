export const SITE = {
  name: "Fitly",
  tagline: "Free health tools, Indian food calories and a daily tracker",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};
