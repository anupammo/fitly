// Renders public/icons/*.png from scripts/icon.svg. Run: node scripts/make-icons.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const svg = fs.readFileSync(path.join(__dirname, "icon.svg"), "utf8");
// Maskable: full-bleed background, mark scaled into the 80% safe zone.
const maskable = svg
  .replace('rx="112"', 'rx="0"')
  .replace('<g id="mark">', '<g id="mark" transform="translate(51.2 51.2) scale(0.8)">');
// Monochrome-friendly favicon keeps the rounded square.
const out = path.join(__dirname, "..", "public", "icons");
const jobs = [
  ["icon-192.png", svg, 192],
  ["icon-512.png", svg, 512],
  ["maskable-192.png", maskable, 192],
  ["maskable-512.png", maskable, 512],
  ["apple-touch-icon.png", maskable, 180],
  ["favicon-32.png", svg, 32],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [name, source, size] of jobs) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<html><body style="margin:0;background:transparent">${source.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`,
    );
    await page.screenshot({ path: path.join(out, name), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  }
  fs.writeFileSync(path.join(out, "icon.svg"), svg);
  await browser.close();
  console.log("icons written:", jobs.map((j) => j[0]).join(", "));
})();
