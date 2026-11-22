// Captures the app screenshots used in the install dialog. Needs a running build:
//   npm run build && npx next start -p 3100 & node scripts/make-screenshots.js
const { chromium } = require("playwright");
const path = require("path");
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = path.join(__dirname, "..", "public", "screenshots");

(async () => {
  const browser = await chromium.launch();
  const phone = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, colorScheme: "light" });
  const p = await phone.newPage();
  // Sample data so the tracker screenshot shows a real day.
  await p.goto(`${base}/tracker`);
  await p.evaluate(() => {
    const d = new Date();
    const today = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const day = { water: 6, steps: 6420, sleep: 7.5, weight: 61.5, mood: "good", foods: [{ slug: "poha", qty: 1 }, { slug: "masala-chai", qty: 2 }, { slug: "roti", qty: 2 }, { slug: "dal-tadka", qty: 1 }] };
    const days = { [today]: day };
    for (let i = 1; i <= 4; i++) days[new Date(Date.parse(today) - i * 864e5).toISOString().slice(0, 10)] = { ...day, foods: [] };
    localStorage.setItem("fitly:tracker:v1", JSON.stringify({ version: 1, profile: { sex: "female", age: 30, height: 160, weight: 61.5, activity: "light", goal: "lose" }, days }));
    sessionStorage.setItem("fitly:install-dismissed", "1");
  });
  await p.reload();
  await p.waitForSelector("text=Water");
  await p.screenshot({ path: path.join(out, "tracker-narrow.png") });
  await p.goto(`${base}/tools/calorie-calculator`);
  await p.waitForSelector(".result-headline");
  await p.screenshot({ path: path.join(out, "tools-narrow.png") });

  const desk = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const d = await desk.newPage();
  await d.goto(base);
  await d.evaluate(() => sessionStorage.setItem("fitly:install-dismissed", "1"));
  await d.reload();
  await d.screenshot({ path: path.join(out, "home-wide.png") });
  await browser.close();
  console.log("screenshots written");
})();
