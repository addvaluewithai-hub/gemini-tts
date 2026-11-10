#!/usr/bin/env node
// Screenshots the top of news articles for use as slides.
//   node capture.cjs <slides.json> <outDir>
// slides.json: { "name": { "url": "...", "source": "site name" }, ... }
// Each capture is the article header (headline plus what follows it), 1600x900 at 2x. A page that
// answers with a bot check or an error is skipped and reported; the stage then draws a plain headline
// card for that story instead. Pages go through the session proxy when HTTPS_PROXY is set.
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
(async () => {
  const [listPath, outDir] = process.argv.slice(2);
  if (!listPath || !outDir) { console.error("usage: node capture.cjs <slides.json> <outDir>"); process.exit(2); }
  const list = JSON.parse(fs.readFileSync(listPath, "utf8")); fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
  const report = {};
  for (const [name, item] of Object.entries(list)) {
    if (!item.url) continue;
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1400 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    try {
      const res = await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(3500);
      const title = await page.title(), status = res ? res.status() : 0;
      const h1 = await page.evaluate(() => { const h = [...document.querySelectorAll("h1")].find((x) => x.innerText.trim().length > 20); if (!h) return null; const b = h.getBoundingClientRect(); return { text: h.innerText.trim(), x: b.x, y: b.y + scrollY, w: b.width, h: b.height }; });
      if (status >= 400 || !h1 || /confirm you are human|checking your browser|access denied/i.test(title + " " + (h1 ? h1.text : ""))) { report[name] = { ok: false, status, title }; await ctx.close(); continue; }
      // Frame the headline: a 16:9 window that starts a little above it.
      const x = Math.max(0, Math.min(h1.x - 60, 1600 - 1280)), y = Math.max(0, h1.y - 70), w = Math.min(1600 - x, Math.max(1280, h1.w + 120)), h = Math.round(w * 9 / 16);
      await page.setViewportSize({ width: 1600, height: Math.max(1400, Math.ceil(y + h + 40)) });
      await page.evaluate((yy) => scrollTo(0, 0), y);
      await page.screenshot({ path: path.join(outDir, name + ".png"), clip: { x, y, width: w, height: h } });
      report[name] = { ok: true, headline: h1.text, focus: [(h1.x - x) / w, (h1.y - y) / h, h1.w / w, h1.h / h].map((v) => Math.round(v * 1000) / 1000) };
    } catch (e) { report[name] = { ok: false, error: String(e.message).slice(0, 140) }; }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, "captured.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
})();
