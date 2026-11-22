# Fitly

Health and fitness website for India: free calculators, an Indian food calorie database, a blog and a daily tracker.
This is the Phase 0 web MVP from the strategy and roadmap.

## What's included

| Area | Route | Notes |
| --- | --- | --- |
| 16 calculators | `/tools`, `/tools/[slug]` | BMI (Indian cut-offs), calorie/TDEE, BMR, ideal weight, body fat, waist-to-hip, water, protein, macros, calories burned, steps to km, heart-rate zones, period/ovulation, due date, pregnancy weight gain, sleep cycle. Height in cm or ft/in. FAQ structured data on every page. |
| Indian food calories | `/calories`, `/calories/[slug]` | 77 foods with English + Hindi names, per serving and per 100 g, veg/egg/non-veg markers, search in English or Hindi. |
| Blog | `/blog`, `/blog/[slug]` | Markdown files in `content/blog`. Posts without `reviewedBy` show a notice, get `noindex` and stay out of the sitemap. |
| Daily tracker | `/tracker` | Water, steps, food (from the database), sleep, weight, mood, streaks, goals from your profile. Stored in the browser only, with data download and delete. |
| SEO | `/sitemap.xml`, `/robots.txt` | Every page is pre-rendered as static HTML. |
| PWA | `/manifest.webmanifest`, `/sw.js`, `/offline` | Installable app with icons, shortcuts (including "Add a glass of water") and install-dialog screenshots. Works offline: the home page, tracker, all tools and the food list are saved on first visit; other pages are saved as they are opened. Install banner (iPhone gets Add to Home Screen steps), update banner on new deploys, offline indicator. |

The original HTML prototypes are kept in `prototypes/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # formula, food data and tracker tests
npm run build      # static production build
```

Set `NEXT_PUBLIC_SITE_URL` (for example `https://fitly.in`) in production so canonical URLs and the sitemap use the real domain.

## PWA notes

- The service worker is generated at build time by `src/app/sw.js/route.ts`; its cache name changes with every deploy, and old caches are deleted when the new version takes over.
- It only registers in production builds (`npm run build && npm start`), not in `npm run dev`.
- Regenerate icons after editing `scripts/icon.svg`: `node scripts/make-icons.js`.
- Regenerate install screenshots against a running build: `node scripts/make-screenshots.js`.

## Code map

- `src/lib/calculators.ts` — every health formula, pure functions with unit tests
- `src/lib/tools.ts` — tool page text (description, how it works, FAQs)
- `src/lib/toolDefs.ts` — each tool's form fields and result layout
- `src/data/foods.ts` — food database seed
- `src/lib/tracker.ts` — tracker state, goals and streak logic
- `content/blog/*.md` — articles (front matter: title, description, date, author, reviewedBy, tags, relatedTool)

## Before launch

- [ ] Dietitian panel verifies every food value against IFCT 2017, then sets `verified: true`
- [ ] Medical reviewer signs off the three starter articles (`reviewedBy` in front matter)
- [ ] Hindi versions of tool and food pages
- [ ] Accounts and cloud sync for the tracker (needs DPDP consent flow)
- [ ] Push notification reminders (water, sleep) — needs a small backend for Web Push
- [ ] Publish the PWA to Google Play as a Trusted Web Activity (Bubblewrap), then decide whether a native app is still needed
