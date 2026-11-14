// "Intro" of network part 1: the device every human carries, and more lines than humans. Three shots, nothing to read
// but numbers.
//   0 the blue phone springs up big on "the mobile"; the camera pulls back and it becomes one glow among the phone
//     glows in every window of the night town
//   1 two stacks rise on a plain: little houses (the humans) to 8.2, SIM cards to 8.8; the SIM stack tops the houses
//   2 a row of houses with 5.8 over it (the owners); one blue house gets three phones on its step; all three ring, it
//     picks up one (✓) and lets the other two ring on. Host right: everything sits left of x = 1500.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, at, check, FW, FH, makeSet } from "./kit.js";
import { P, mix, pop, bluePhone, pinkPhone, phone, ringing, sim, WAVE } from "./net.js";
import { house, stars, skyline } from "./bank.js";

const G = 900;
const ground = (G0 = G) => `<rect x="-3000" y="${G0}" width="9000" height="1200" fill="#141a45"/><rect x="-3000" y="${G0}" width="9000" height="12" fill="#2c366f"/>`;
// a small house glyph for the humans' stack (64 wide, base on y = 0)
const hut = (c, cD) => `${two(rr(-30, -40, 60, 40, 4), c, cD, 6, 0)}${two("M-38 -38L0 -70L38 -38Z", "#3a1c71", P.ink, 0, 4)}<rect x="-8" y="-22" width="16" height="22" rx="4" fill="${P.ink}"/>`;
const HUTC = [[P.blue, P.blueD], [P.pink, P.pinkD], [P.teal, P.tealD], [P.violet, P.violetD], [P.gold, P.goldD]];

// ---- 0: one phone, then the phones of the whole town ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 640, 2.3], [1.0, 960, 640, 2.3], [1.7, 960, 660, 2.1], [3.4, 960, 560, 1.05], [3.97, 960, 540, 1.0]]);
  // the town: rows of houses whose windows each hold a phone glow, lit one by one
  let town = "";
  const HX = [-700, -380, -60, 260, 580, 1300, 1620, 1940, 2260, 2580];
  HX.forEach((x, i) => { const [cc, cD] = HUTC[i % 5]; const lit = [0, 1, 2].map((j) => a > 1.7 + rnd(i * 3 + j) * 1.6 ? 1 : 0);
    town += at(x, G, house(cc, cD, { lit }), 1.15);
    [[-63, -138], [83, -138]].forEach(([wx, wy], j) => { if (!lit[j]) return; const u = a - 1.7 - rnd(i * 3 + j) * 1.6; town += at(x + wx * 1.15, G + wy * 1.15, rings(0, 0, 40, "#9fe7ff", 0.35 * pop(u)) + at(0, 18, phone({ c: "#2c366f", cD: "#1a1446", on: 1 }), 0.16)); }); });
  // the blue phone in the middle of the street, big at first
  const up = a > 0.9 ? pop(a - 0.9, 7, 12) : 0, fl = 6 * Math.sin(tot * 2);
  const hero = up > 0 ? at(960, G - 40 + fl * (1 - seg(a, 1.7, 3.0)), rings(0, -125, 160, "#9fe7ff", 0.22) + bluePhone({ inner: `<circle cx="0" cy="-125" r="26" fill="${WAVE}" opacity="${(0.5 + 0.3 * Math.sin(tot * 5)).toFixed(2)}"/>` }), [up, up]) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(3, 90, -1600, 3600, 700, tot) + `<circle cx="1500" cy="160" r="56" fill="${P.cream}"/><circle cx="1480" cy="146" r="50" fill="${P.night0}"/>`, c, 0.15)
    + layer(skyline(21, -1600, 3600, 760, 120, 330, "#2a1f66", "#ffb066"), c, 0.5) + layer(ground() + town + hero, c);
  return { g, out: toScreen(c, 960, G - 165), outC: "#9fe7ff", outZ: 14 };
}

// ---- 1: humans 8.2, lines 8.8 ----
const HK = 1.0;
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.3], [2.4, 960, 560, 1.3], [4.4, 1000, 530, 1.3], [5.94, 1000, 530, 1.32]]);
  const L = 700, R = 1220, rowH = 58, hum = kf(a, [[0.3, 0], [1.94, 8.2]], (p) => 1 - Math.pow(1 - p, 2)), lines = kf(a, [[2.4, 0], [3.95, 8.8]], (p) => 1 - Math.pow(1 - p, 2));
  // a stack: one row of five per "billion", the last row partly there
  let huts = "", sims = "";
  const nH = Math.ceil(hum), nS = Math.ceil(lines);
  for (let r = 0; r < nH; r++) { const part = Math.min(1, hum - r), n = r < nH - 1 ? 5 : Math.max(1, Math.round(5 * part));
    for (let k = 0; k < n; k++) { const [cc, cD] = HUTC[(r + k) % 5]; huts += at(L + (k - 2) * 72, G - r * rowH, hut(cc, cD), 0.95); } }
  for (let r = 0; r < nS; r++) { const part = Math.min(1, lines - r), n = r < nS - 1 ? 5 : Math.max(1, Math.round(5 * part));
    for (let k = 0; k < n; k++) sims += at(R + (k - 2) * 72, G - 30 - r * rowH, sim(), 0.3, (k - 2) * 2); }
  const topH = G - 8.2 * rowH - 40, topS = G - 8.8 * rowH - 40, win = a > 4.6 ? spring(a - 4.6, 8, 13) : 0;
  const line = a > 4.5 ? `<path d="M${L - 220} ${topH}H${R + 220}" stroke="${P.cream}" stroke-width="6" stroke-dasharray="18 14" opacity="${(0.7 * seg(a, 4.5, 4.8)).toFixed(2)}"/>` : "";
  const labH = a > 0.4 ? at(L, topH - 70, number(0, 0, hum.toFixed(1), 110, P.cream), pop(a - 0.4)) : "";
  const labS = a > 2.45 ? at(R, topS - 70, (win > 0 ? rings(0, -40, 130 * win, P.gold, 0.18) : "") + number(0, 0, lines.toFixed(1), 110, a > 4.6 ? P.gold : P.cream), pop(a - 2.45)) : "";
  const gap = a > 4.75 ? `<path d="M${R + 230} ${topH}V${topS + 6}" stroke="${P.gold}" stroke-width="12" stroke-linecap="round" opacity="${seg(a, 4.75, 5.0).toFixed(2)}"/>` : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(9, 80, -400, 2400, 700, tot), c, 0.2) + layer(ground() + huts + sims + line + gap + labH + labS, c);
  return { g, in: toScreen(c, 960, 540), inC: "#9fe7ff", inZ: 14 };
}

// ---- 2: 5.8 owners; one house, three phones, it answers one ----
function s2(a, tot) {
  const c = camAt(a, [[0, 900, 560, 0.85], [2.3, 880, 560, 0.9], [3.0, 760, 600, 1.25], [5.91, 740, 610, 1.32]]);
  // the row of houses with the owners' number
  let row = ""; [-500, -160, 180, 520, 1200, 1540, 1880].forEach((x, i) => { if (a > 2.6 && x > 300 && x < 1300) return; const [cc, cD] = HUTC[i % 5]; row += at(x, G, house(cc, cD, { lit: [1, 1, 1] }), 0.9); });
  const own = kf(a, [[0.9, 0], [2.2, 5.8]], (p) => 1 - Math.pow(1 - p, 2));
  const tagG = a > 0.8 ? at(900, 300, `${rings(0, -40, 120, P.gold, 0.14)}${number(0, 0, own.toFixed(1), 120, P.gold)}`, pop(a - 0.8) * (1 - ease(seg(a, 2.5, 2.9)))) : "";
  // the blue house up close, with three phones on its step
  const BX = 860, ph = [[540, 3.6, "blue"], [700, 3.78, "pink"], [860, 4.2, "teal"]];
  let phones = "";
  const pick = 5.15, ans = a - pick;
  ph.forEach(([x, t0, col], i) => { const u = a - t0; if (u <= 0) return;
    const body = col === "blue" ? bluePhone() : col === "pink" ? pinkPhone() : phone({ c: P.teal, cD: P.tealD, screen: "#c9fff4" }), rg = a > 4.45 ? 1 : 0;
    const answered = i === 0 && ans > 0, sag = i > 0 && ans > 0 ? ease(seg(ans, 0.3, 0.75)) : 0;
    const inner = answered ? at(0, -40 * ease(seg(ans, 0, 0.3)), body + check(0, -300, 44, P.green, ans - 0.1)) : rg ? ringing(body, tot + i * 0.37, 1 - 0.5 * sag) : body;
    phones += at(x, G - 12, inner, [0.85 * pop(u), 0.85 * pop(u) * (1 - 0.12 * sag)], sag * (i === 1 ? -8 : 8)); });
  const big = at(BX + 220, G, house(P.blue, P.blueD, { lit: [1, 1, a > pick ? 1 : 0] }), 1.6);
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(13, 80, -800, 2800, 700, tot), c, 0.2) + layer(skyline(5, -800, 2800, 760, 100, 260, "#2a1f66", "#ffb066"), c, 0.5)
    + layer(ground() + row.replace(/^/, "") + (a > 2.6 ? at(0, 0, big, 1, 0, `opacity="${seg(a, 2.6, 2.9).toFixed(2)}"`) : "") + phones, c) + tagG;
  return { g, in: toScreen(c, 900, 540), inC: P.night1, inZ: 10 };
}

const SHOTS = [s0, s1, s2];
export const nintroSet = makeSet(SHOTS, [], P);
