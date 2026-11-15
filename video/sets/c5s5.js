// Crypto part 5, s5 (the digital dollar): six wordless shots (shots.md, scene s5).
//   0 a plain green $1 coin on a pedestal under a spotlight; confetti pops, then droops; a yawn: it worked, and it's boring
//   1 a price board: two coins' lines jump while the green $1 line stays flat (STABLECOIN); a real banknote goes in at a window
//   2 a green coin comes out and zips along the ledger's chain across the planet; days spin, flags flick past (host right)
//   3 a coin hops a border fence between two houses; a house whose own notes shrink fills a jar with green coins
//   4 most green coins pour into an exchange tower; OCT 2026; a green stack rolls to $300,000,000,000
//   5 a slice of the stack marked REAL MONEY USE; the biggest company sends bags to a domed treasury, bonds come back (host left)
import { clamp, lerp, ease, easeOut, seg, spring, rnd, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s5.v.js";
import { P, mix, house, stars, skyline } from "./bank.js";
import { calPage, banknote, pedestal, jar, globe } from "./props.js";
import { dollarCoin, tower, coin } from "./c5props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 2900, 1080, tot), c, 0.15);
const G = 900;
const town = (c, seed = 51) => layer(skyline(seed, -900, 2900, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(seed + 36, -900, 2900, G, 80, 230, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c);
const label = (x, y, t, a, size = 64, fill = P.gold) => (a > 0 ? at(x, y, `${two(rr(-t.length * size * 0.29 - 26, -size * 0.62, t.length * size * 0.58 + 52, size * 1.1, 14), P.ink, "#0d0b33", 0, 6)}${text(0, size * 0.32, t, size, fill)}`, pop(a)) : "");
const fmtN = (v) => Math.round(v).toLocaleString("en");
const GREEN = P.green, GREEND = P.greenD;
// a stack of green coins, n high
const stack = (n, w = 1) => Array.from({ length: Math.round(n) }, (_, i) => `<ellipse cx="0" cy="${-14 - i * 16}" rx="${60 * w}" ry="16" fill="${i % 2 ? GREEND : GREEN}"/>`).join("");
// a domed building, 560 wide, base on y = 0
const domeB = (name) => `${two(rr(-280, -60, 560, 60, 8), P.stone, P.stoneD, 0, 8)}${[-220, -130, -40, 50, 140, 230].map((x) => two(rr(x - 18, -300, 36, 240, 4), P.cream, P.creamD, 8, 0)).join("")}
  <path d="M-300 -300h600l-40 -40h-520Z" fill="${P.stone}"/><path d="M-170 -340A170 150 0 0 1 170 -340Z" fill="${P.cream}"/><rect x="-10" y="-530" width="20" height="50" fill="${P.steel}"/>${name ? text(0, -20, name, 40, P.ink) : ""}`;

// ---- 0: the one that worked, and the most boring ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 640, 1.55], [3.9, 990, 620, 1.75]]);
  const spot = `<path d="M960 -100L760 ${G - 40}H1160Z" fill="#fff3c2" opacity=".1"/>`;
  const pops = [[640, -1], [1280, 1]].map(([x, d]) => { const t = a - 1.2; if (t < 0) return at(x, G - 40, `<path d="M-30 0L0 -110L30 0Z" fill="${P.pink}"/>`, 1, d * 20);
    const droop = seg(a, 2.0, 3.0);
    const bits = Array.from({ length: 12 }, (_, i) => { const an = -Math.PI / 2 + d * 0.5 + (i - 5.5) * 0.12, v = 280 + 80 * rnd(i), dist = v * Math.min(t, 0.5) * (1 - 0.6 * droop), drop = 260 * droop * droop;
      return `<rect x="${(Math.cos(an) * dist).toFixed(1)}" y="${(-110 + Math.sin(an) * dist + drop).toFixed(1)}" width="12" height="18" fill="${[P.pink, P.gold, P.teal, P.violet][i % 4]}" opacity="${(1 - 0.5 * droop).toFixed(2)}"/>`; }).join("");
    return at(x, G - 40, `<path d="M-30 0L0 -110L30 0Z" fill="${P.pink}"/>${bits}`, 1, d * 20); }).join("");
  const yawn = a > 3.0 ? at(1180, G - 520, `<ellipse rx="90" ry="60" fill="${P.cream}"/><path d="M-30 50l-20 40l50 -30Z" fill="${P.cream}"/>${text(-20, 14, "z", 50, P.ink)}${text(26, -6, "z", 36, P.ink)}`, pop(a - 3.0)) : "";
  const coinG = at(960, G - 300 + 6 * Math.sin(tot * 2), rings(0, 0, 160, GREEN, 0.15) + dollarCoin(120));
  const g = night(c, tot, 13) + town(c) + layer(spot + at(960, G, pedestal(0.8)) + coinG + pops + yawn, c);
  return { g, out: toScreen(c, 960, G - 300), outC: GREEN, outZ: 18 };
}

// ---- 1: always one dollar; STABLECOIN; a real dollar in at the window ----
function s1(a, tot) {
  const c = camAt(a, [[0, 760, 470, 1.55], [3.0, 760, 470, 1.6], [3.6, 1350, 640, 1.5], [4.96, 1380, 650, 1.6]]);
  const BX = 300, BY = 220, W = 900, H = 440, p = seg(a, 0.2, 1.8);
  const jag = (seed, amp) => { let d = ""; for (let i = 0; i <= 30 * p; i++) { const x = BX + 40 + i * (W - 80) / 30, y = BY + H / 2 + amp * (rnd(seed + i) - 0.5) * 2 + 30 * Math.sin(i * 0.7 + seed); d += `${i ? "L" : "M"}${x.toFixed(0)} ${y.toFixed(0)}`; } return d; };
  const flat = `M${BX + 40} ${BY + H / 2}H${(BX + 40 + (W - 80) * p).toFixed(0)}`;
  const board = `${two(rr(BX, BY, W, H, 22), "#2c1f63", "#1b1550", 0, 10)}<path d="${jag(3, 150)}" fill="none" stroke="${P.gold}" stroke-width="8" stroke-linejoin="round" opacity=".7"/><path d="${jag(9, 120)}" fill="none" stroke="${P.violet}" stroke-width="8" stroke-linejoin="round" opacity=".7"/>
    <path d="${flat}" fill="none" stroke="${GREEN}" stroke-width="14" stroke-linecap="round"/>${p > 0.9 ? at(BX + W - 30, BY + H / 2, dollarCoin(44), pop(a - 1.6)) : ""}`;
  const tw = at(1500, G, tower({ h: 560, lit: 0.8, c: "#2f8a5c", cD: "#1f6a44" }) + at(0, -710, dollarCoin(72)), 1);
  const win = `<path d="${rr(1430, G - 260, 140, 100, 10)}" fill="#fff3c2"/>`;
  const np = seg(a, 3.5, 4.4), note = a > 3.3 ? at(lerp(1200, 1500, ease(np)), lerp(G - 220, G - 210, np), banknote(1.1), np < 1 ? 1 : 1 - seg(a, 4.4, 4.7)) : "";
  const g = night(c, tot, 17) + town(c) + layer(board + label(BX + W / 2, BY + H + 70, "STABLECOIN", a - 2.05, 72) + tw + win + note, c);
  return { g, in: [960, 540], inC: GREEN, inZ: 18, out: toScreen(c, 1500, G - 210), outC: "#fff3c2", outZ: 18 };
}

// ---- 2: out comes a digital dollar; it zips across the planet; any day, any country (host right) ----
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.15], [4.32, 940, 520, 1.2]]);
  const GX = 800, GY = 600, R = 330, ang = (t) => [GX + (R + 30) * Math.sin(t), GY - (R + 30) * Math.cos(t)];
  const A = -1.2, B = 1.25, h1 = ang(A), h2 = ang(B);
  let chain = ""; for (let i = 0; i < 18; i++) { const t = A + (B - A) * i / 17, [x, y] = ang(t); const q = ang(t); chain += `<circle cx="${(GX + (R + 70) * Math.sin(t)).toFixed(0)}" cy="${(GY - (R + 70) * Math.cos(t)).toFixed(0)}" r="9" fill="${P.gold}" opacity=".7"/>`; }
  const mv = ease(seg(a, 1.15, 2.35)), t = lerp(A, B, mv), cp = [GX + (R + 70) * Math.sin(t), GY - (R + 70) * Math.cos(t)];
  const appear = a < 0.8 ? at(h1[0], h1[1] - 160, dollarCoin(48), pop(a)) : "";
  const zip = a >= 0.8 ? at(cp[0], cp[1], (mv > 0 && mv < 1 ? rings(0, 0, 60, GREEN, 0.3) : "") + dollarCoin(46)) : "";
  const hs = at(h1[0], h1[1], house(P.blue, P.blueD), 0.55, A * 57.3) + at(h2[0], h2[1], house(P.pink, P.pinkD, { lit: [1, 1, mv >= 1 ? 1 : 0] }), 0.55, B * 57.3);
  const day = a > 2.7 ? at(1450, 260, calPage(String(1 + Math.floor(Math.max(0, a - 2.7) * 9) % 28), "", 1, 140), 0.75 * pop(a - 2.7), 4) : "";
  const FL = [[P.red, "#fff", P.ink], [P.green, "#fff", P.red], [P.blue, P.gold, P.blue], [P.teal, P.cream, P.teal], [P.violet, P.gold, P.red]];
  const fi = Math.floor(Math.max(0, a - 3.4) * 7) % FL.length, flag = a > 3.4 ? at(1450, 520, `<rect x="-8" y="-20" width="12" height="200" fill="${P.steel}"/><g transform="translate(4 -20)">${FL[fi].map((col, k) => `<rect x="0" y="${k * 40}" width="190" height="40" fill="${col}"/>`).join("")}</g>`, 0.9 * pop(a - 3.4)) : "";
  const g = night(c, tot, 19) + layer(at(GX, GY, globe(R, tot * 0.01, { night: 0.35 })) + chain + hs + appear + zip + day + flag, c);
  return { g, in: toScreen(c, h1[0], h1[1] - 160), inC: "#fff3c2", inZ: 18 };
}

// ---- 3: across a border; and a house paid in green coins while its own notes shrink ----
function s3(a, tot) {
  const c = camAt(a, [[0, 760, 680, 1.7], [1.8, 770, 680, 1.75], [2.4, 1600, 650, 1.55], [4.77, 1620, 650, 1.65]]);
  const fence = Array.from({ length: 9 }, (_, i) => `<rect x="${740 + (i % 3) * 14}" y="${G - 220 + Math.floor(i / 3) * 0}" width="10" height="220" fill="${P.steel}" opacity="0"/>`).join("") + `<path d="M760 ${G}V${G - 230}M800 ${G}V${G - 230}M740 ${G - 200}H820M740 ${G - 120}H820" stroke="${P.steel}" stroke-width="12"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${746 + i * 12} ${G - 236}l6 -14l6 14" stroke="${P.steelD}" stroke-width="4" fill="none"/>`).join("");
  const hp = seg(a, 0.5, 1.4), cb = bez([460, G - 260], [780, G - 560], [1060, G - 260], ease(hp));
  const hop = a > 0.4 ? at(cb[0], cb[1], dollarCoin(40)) : "";
  const left = at(400, G, house(P.teal, P.tealD), 1), right = at(1120, G, house(P.violet, P.violetD, { lit: [1, 1, hp >= 1 ? 1 : 0] }), 1);
  // the house with a falling currency: its own notes shrink and fade; green coins fill a jar
  const HX = 1560, sh = seg(a, 2.1, 3.1), fill = seg(a, 3.4, 4.4);
  const notes = [0, 1, 2].map((i) => at(HX - 260 + i * 70, G - 420 - i * 30, banknote(1 - 0.6 * sh, mix("#6fe3a1", "#8a8aa0", sh), mix("#3fbf7a", "#6a6a80", sh), mix("#2b9a5e", "#55556a", sh)), 1, -8)).join("");
  const fall = sh > 0.3 ? at(HX - 330, G - 520, `<path d="M0 0v70m-26 -26l26 26l26 -26" stroke="${P.red}" stroke-width="12" fill="none" stroke-linecap="round"/>`, pop(a - 2.4)) : "";
  const pay = a > 3.3 && a < 4.2 ? at(lerp(HX - 120, HX + 210, seg(a, 3.3, 3.8)), lerp(G - 380, G - 180, seg(a, 3.3, 3.8)), dollarCoin(30)) : "";
  const g = night(c, tot, 23) + town(c, 61) + layer(left + right + fence + hop + at(HX, G, house(P.gold, P.goldD), 1) + notes + fall + at(HX + 230, G, jar(fill), 1) + pay, c);
  return { g };
}

// ---- 4: most of it is traded on exchanges; Oct 2026: about $300,000,000,000 ----
function s4(a, tot) {
  const c = camAt(a, [[0, 760, 600, 1.35], [2.5, 820, 600, 1.35], [3.2, 1300, 560, 1.4], [6.02, 1320, 560, 1.45]]);
  let flow = "";
  for (let i = 0; i < 14; i++) { const t = (a * 0.9 + i / 14) % 1, b = bez([120, 300 + 50 * (i % 5)], [500, 120], [780, G - 260], t); if (a < 1.6) flow += at(b[0], b[1], dollarCoin(22), 1 - seg(a, 1.3, 1.6)); }
  const tw = at(820, G, tower({ name: "EXCHANGE", h: 620 }), 1);
  const cal = a > 2.8 ? at(1700, 240, calPage("2026", "OCT", 1, 140), 0.75 * pop(a - 2.8), 5) : "";
  const grow = ease(seg(a, 4.1, 5.5)), st = at(1300, G, stack(4 + 26 * grow, 1.2));
  const v = 300e9 * grow, cnt = a > 4.0 ? label(1300, G - 560, "$" + fmtN(v), a - 4.0, 60, GREEN) : "";
  const g = night(c, tot, 29) + town(c, 71) + layer(flow + tw + cal + st + cnt, c);
  return { g, out: toScreen(c, 1300, G - 300), outC: GREEN, outZ: 16 };
}

// ---- 5: the real-money slice; the biggest issuer buys US government debt (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.5], [1.6, 840, 560, 1.5], [2.3, 1330, 580, 1.25], [5.91, 1350, 580, 1.3]]);
  const SX = 760;
  const st = at(SX, G, stack(30, 1.2)) + `<path d="${rr(SX - 90, G - 14 - 30 * 16 + 4, 180, 80, 10)}" fill="none" stroke="${P.gold}" stroke-width="8" opacity="${seg(a, 0.5, 0.9).toFixed(2)}"/>`;
  const lab = label(SX, G - 590, "REAL MONEY USE", a - 0.5, 46, P.gold);
  const TW = 1120, DB = 1650;
  const tw = at(TW, G, tower({ h: 560, c: "#2f8a5c", cD: "#1f6a44" }) + at(0, -710, dollarCoin(72)), pop(a - 1.8));
  let bags = "";
  for (let i = 0; i < 4; i++) { const t0 = 2.2 + i * 0.45, p = seg(a, t0, t0 + 0.9); if (p <= 0 || p >= 1) continue; const b = bez([TW + 120, G - 300], [(TW + DB) / 2, G - 620], [DB - 120, G - 260], ease(p));
    bags += at(b[0], b[1], `<g transform="scale(2)"><path d="M-30 -10Q-40 40 0 44Q40 40 30 -10Z" fill="#c9a46a"/><path d="M-20 -14h40l-8 -14h-24Z" fill="#a8844a"/>${text(0, 30, "$", 30, P.ink)}</g>`); }
  let bonds = "";
  for (let i = 0; i < 3; i++) { const t0 = 4.3 + i * 0.3, p = seg(a, t0, t0 + 0.8); if (p <= 0) continue; const b = bez([DB - 140, G - 240], [(TW + DB) / 2, G - 520], [TW + 140, G - 330 + i * 30], ease(p));
    bonds += at(b[0], b[1], `<g transform="scale(1.7)">${two(rr(-46, -30, 92, 60, 6), P.cream, P.creamD, 0, 4)}<path d="M-30 -12h60M-30 4h44" stroke="#c9b48a" stroke-width="6"/><circle cx="28" cy="16" r="9" fill="${P.red}"/></g>`); }
  const db = at(DB, G, domeB("US TREASURY"), 0.9 * pop(a - 1.9));
  const g = night(c, tot, 31) + town(c, 81) + layer(st + lab + tw + db + bags + bonds, c);
  return { g, in: toScreen(c, SX, G - 300), inC: GREEN, inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const c5s5Set = makeSet(SHOTS, V, P);
