// Props for the sets of crypto part 4 (price: value, bubbles, swings, leverage, who holds it, Wall Street, the debate,
// the scorecard), drawn in the palette and style of parts 1 to 3. Each is drawn around (0, 0).
//   PEAKS / priceLine  the price mountain: the real dated peaks and falls as a ridge, drawn up to `p` (0..1)
//   whale      the gold whale that swims under the price line
//   plank      the leverage seesaw: your stack on a long plank, the borrowed stack under it; `snap` 0..1
//   newspaper  a folded paper with a framed coin (the obituaries)
//   reportCard one of money's three jobs (PAY, PRICE, SAVE) with a mark
//   fund       a glass fund building with a wall between the buyer and the coins
//   dial       a leverage dial (1x..100x)
import { clamp, lerp, ease, seg, spring, rnd, rr, circ, two, disc, rings, text, number, drawn, at } from "./kit.js";
import { P, mix, coin, WHO, tower, receipt, key, seedSlip, gavel, heart } from "./c3props.js";
import { silo, balance, warehouse, clock, bolt } from "./c2props.js";
export { P, mix, coin, WHO, tower, receipt, key, seedSlip, gavel, heart, silo, balance, warehouse, clock, bolt };

// the dated peaks and lows of the price, from the script: [year, price at the peak, price after the fall]
export const PEAKS = [[2011, 30, 2], [2013, 1100, 200], [2017, 20000, 3000], [2021, 69000, 15000], [2025, 126000, 60000]];
// the ridge: x runs along `w`, height is log(price); returns the path and the points [{x, y, year, price, low}]
export const ridge = (w = 1600, h = 600) => { const ly = (v) => -h * Math.log10(Math.max(1, v)) / Math.log10(150000), pts = [{ x: 0, y: ly(1) }];
  PEAKS.forEach(([yr, hi, lo], i) => { const x0 = w * (i + 0.15) / PEAKS.length, x1 = w * (i + 0.6) / PEAKS.length; pts.push({ x: x0, y: ly(hi), year: yr, price: hi, peak: true }, { x: x1, y: ly(lo), year: yr, price: lo, low: true }); });
  pts.push({ x: w, y: ly(80000) }); return pts; };
// the ridge drawn up to p (0..1 of its length), as a filled night mountain with a gold edge
export const priceLine = (p = 1, o = {}) => { const w = o.w || 1600, h = o.h || 600, pts = ridge(w, h), n = pts.length - 1, upto = p * n, k = Math.floor(upto), f = upto - k;
  const cut = pts.slice(0, k + 1).concat(k < n ? [{ x: lerp(pts[k].x, pts[k + 1].x, f), y: lerp(pts[k].y, pts[k + 1].y, f) }] : []);
  const d = cut.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join("");
  const last = cut[cut.length - 1];
  return { g: `<path d="${d}L${last.x.toFixed(1)} 0L0 0Z" fill="${o.fill || "#2a1d66"}"/><path d="${d}" fill="none" stroke="${o.stroke || P.gold}" stroke-width="${o.width || 10}" stroke-linejoin="round" stroke-linecap="round"/>`, tip: last, pts }; };

// the gold whale, 420 long, facing right; `tail` -1..1 swings the tail
export const whale = (tail = 0) => `${two("M-230 -10Q-200 -150 20 -150Q200 -150 240 -20Q240 60 120 80Q-100 90 -230 -10Z", P.gold, P.goldD, 0, 14)}<path d="M-220 -10Q-270 -20 -300 ${(-30 + tail * 20).toFixed(0)}" stroke="${P.goldD}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-300 ${(-30 + tail * 20).toFixed(0)}l-70 -50q40 50 10 70q40 10 60 -20Z" fill="${P.goldD}"/><path d="M80 40Q140 70 220 30" stroke="${P.goldD}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="150" cy="-60" r="13" fill="${P.ink}"/><path d="M40 -150q-20 -60 -50 -80M40 -150q10 -70 -10 -100M40 -150q30 -60 50 -80" stroke="#9fe7ff" stroke-width="10" fill="none" stroke-linecap="round"/>${at(-30, -60, coin(36, "B"), 1)}`;

// the leverage plank: a long board on a small pivot; `mine` (your stack height) and `lent` (borrowed); tilt -1..1; snap 0..1
export const plank = (o = {}) => { const t = (o.tilt || 0) * 0.25, sn = o.snap || 0, mine = o.mine ?? 1, lent = o.lent ?? 0;
  const stack = (n, x, c, cD) => Array.from({ length: Math.round(n) }, (_, i) => `<ellipse cx="${x}" cy="${-20 - i * 18}" rx="46" ry="14" fill="${i % 2 ? cD : c}"/>`).join("");
  const board = sn > 0 ? `<g transform="rotate(${(t * 57 - 25 * ease(sn)).toFixed(1)} -40 -10)"><path d="${rr(-460, -14, 420, 28, 8)}" fill="${P.wood}"/></g><g transform="rotate(${(t * 57 + 30 * ease(sn)).toFixed(1)} 40 -10)"><path d="${rr(40, -14, 420, 28, 8)}" fill="${P.wood}"/></g>`
    : `<g transform="rotate(${(t * 57).toFixed(1)})"><path d="${rr(-460, -14, 920, 28, 8)}" fill="${P.wood}"/>${stack(mine, 300, P.gold, P.goldD)}${stack(lent, 300 - 100, "#9fb0ff", "#7f90e0")}</g>`;
  return `<path d="M-60 120L0 0L60 120Z" fill="${P.steelD}"/>${board}`; };

// a folded newspaper, 360 x 250; o.obit draws the coin in a black frame
export const newspaper = (o = {}) => `${two(rr(-180, -125, 360, 250, 6), "#f4f0e6", "#d9d2c0", 0, 8)}<path d="M-160 -100h320" stroke="${P.ink}" stroke-width="16"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M30 ${-60 + i * 30}h120" stroke="#b0a890" stroke-width="8"/>`).join("")}
  ${o.obit ? `<path d="${rr(-160, -70, 160, 170, 4)}" fill="${P.ink}"/>${at(-80, 15, coin(56, "B"))}` : `<path d="${rr(-160, -70, 160, 170, 4)}" fill="#cfc7b0"/>`}`;

// a report card, 320 x 400: a coloured header (label), a subject icon drawn by the caller in o.inner (centre (0, -20)), a mark
export const reportCard = (label, o = {}) => { const m = o.mark || "", mc = m === "✗" ? P.red : m === "½" ? P.gold : m === "✓" ? P.green : P.steelD;
  return `${two(rr(-160, -200, 320, 400, 18), P.cream, P.creamD, 0, 8)}<path d="M-142 -200h284a18 18 0 0 1 18 18v52h-320v-52a18 18 0 0 1 18 -18Z" fill="${o.c || P.violet}"/>${text(0, -146, label, 46, "#fff")}${o.inner || ""}
    ${m ? `${rings(90, 140, 50, mc, 0.25)}<circle cx="90" cy="140" r="44" fill="#fff" stroke="${mc}" stroke-width="8"/>${text(90, 158, m, 54, mc)}` : ""}`; };

// a fund building: glass front, a gold door, and inside a vault of coins behind a wall; 520 wide, base on y = 0
export const fund = (o = {}) => { const fill = o.fill ?? 1; let coins = ""; for (let i = 0; i < Math.round(14 * fill); i++) coins += `<ellipse cx="${-120 + (i % 7) * 40}" cy="${-70 - Math.floor(i / 7) * 22}" rx="18" ry="8" fill="${i % 2 ? P.goldD : P.gold}"/>`;
  return `${two(rr(-260, -520, 520, 520, 16), "#3c5bb0", "#2c4590", 0, 12)}<path d="M-280 -520L0 -640L280 -520Z" fill="#24346f"/>${text(0, -560, o.name || "FUND", 52, P.gold)}
    <path d="${rr(-200, -440, 400, 240, 10)}" fill="#141038"/>${at(0, -300, `<path d="${rr(-170, -120, 340, 120, 8)}" fill="#1b1550"/>${coins}`)}<path d="M-200 -200h400" stroke="${P.steel}" stroke-width="14"/>
    ${two(rr(-60, -180, 120, 180, 10), P.gold, P.goldD, 0, 8)}`; };

// a leverage dial, radius r: the needle points at x (1..100, log scale)
export const dial = (x = 1, r = 120) => { const a = -Math.PI * 0.85 + Math.PI * 0.7 * Math.log10(Math.max(1, x)) / 2;
  return `${disc(0, 0, r, P.cream, P.creamD)}<path d="M${(-r * 0.8).toFixed(0)} 0A${r * 0.8} ${r * 0.8} 0 0 1 ${(r * 0.8).toFixed(0)} 0" fill="none" stroke="${P.red}" stroke-width="${r * 0.12}" opacity=".35"/>${["1", "10", "100"].map((s, i) => { const aa = -Math.PI * 0.85 + Math.PI * 0.35 * i; return text(Math.cos(aa) * r * 0.62, Math.sin(aa) * r * 0.62 + 12, s + "×", r * 0.2, P.ink); }).join("")}
    <path d="M0 0L${(Math.cos(a) * r * 0.75).toFixed(1)} ${(Math.sin(a) * r * 0.75).toFixed(1)}" stroke="${P.ink}" stroke-width="${r * 0.07}" stroke-linecap="round"/><circle r="${r * 0.08}" fill="${P.red}"/>`; };
export { check, cross } from "./kit.js";
