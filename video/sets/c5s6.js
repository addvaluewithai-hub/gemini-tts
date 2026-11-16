// Crypto part 5, s6 (the freeze button): eight wordless shots (shots.md, scene s6).
//   0 the green coin; behind it the company's desk with a big blue snowflake button that lights up
//   1 OCT 2026: the Binance tower drains coins into a thief's sack; the button is pressed and ice spreads over the sack
//   2 $1,500,000,000 on the ice; a clock sweeps half an hour; the robbed house smiles (host right)
//   3 a pocket of green coins; an ice glove hovers over it and the coins frost: your pocket, someone else's hand
//   4 the book goes back into its guard booth (part 2), the cap is on the hook again; a coin on a seesaw of formulas,
//     no real dollars behind it
//   5 MAY 2022: the seesaw tips, the formula cracks, $40,000,000,000 goes up as steam (host left)
//   6 a gavel, a cell door, 15 YEARS; 2025: the domed building stamps a scroll, a law
//   7 behind each green coin a real banknote locks in place on its thread: ✓
import { clamp, lerp, ease, easeOut, seg, spring, rnd, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s6.v.js";
import { P, mix, house, stars, skyline, book, rows } from "./bank.js";
import { calPage, banknote } from "./props.js";
import { booth, clock } from "./c2props.js";
import { gavel, heart } from "./c3props.js";
import { dollarCoin, freezeBtn, tower } from "./c5props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 2900, 1080, tot), c, 0.15);
const G = 900;
const town = (c, seed = 91) => layer(skyline(seed, -900, 2900, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(seed + 36, -900, 2900, G, 80, 230, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c);
const label = (x, y, t, a, size = 64, fill = P.gold) => (a > 0 ? at(x, y, `${two(rr(-t.length * size * 0.29 - 26, -size * 0.62, t.length * size * 0.58 + 52, size * 1.1, 14), P.ink, "#0d0b33", 0, 6)}${text(0, size * 0.32, t, size, fill)}`, pop(a)) : "");
const fmtN = (v) => Math.round(v).toLocaleString("en");
const ICE = "#dff4ff";
// a thief's sack, 220 wide, base on y = 0; frost 0..1 covers it in ice from the bottom
const sack = (fill = 1, frost = 0) => `${two("M-110 0Q-130 -150 -50 -210H50Q130 -150 110 0Z", "#3a3048", "#2a2238", 0, 10)}<path d="M-50 -210l-20 -40h140l-20 40Z" fill="#2a2238"/>${fill > 0.3 ? `<circle cx="-20" cy="-210" r="24" fill="${P.gold}"/><circle cx="24" cy="-218" r="22" fill="${P.goldD}"/>` : ""}
  ${frost > 0 ? `<clipPath id="sk"><path d="M-110 0Q-130 -150 -50 -210H50Q130 -150 110 0Z"/></clipPath><g clip-path="url(#sk)"><rect x="-140" y="${(-260 * frost).toFixed(0)}" width="280" height="${(260 * frost + 10).toFixed(0)}" fill="${ICE}" opacity=".85"/>${[-70, -10, 50].map((x, i) => `<path d="M${x} 0l20 ${(-60 - 40 * i) * frost}l20 ${(60 + 40 * i) * frost}" fill="#bfe6ff"/>`).join("")}</g>` : ""}`;
// a company desk, 420 wide, base on y = 0
const desk = () => `${two(rr(-210, -150, 420, 30, 8), P.wood, P.woodD, 0, 8)}<rect x="-190" y="-120" width="24" height="120" fill="${P.woodD}"/><rect x="166" y="-120" width="24" height="120" fill="${P.woodD}"/>`;
// a domed building, 560 wide, base on y = 0
const domeB = () => `${two(rr(-280, -60, 560, 60, 8), P.stone, P.stoneD, 0, 8)}${[-220, -130, -40, 50, 140, 230].map((x) => two(rr(x - 18, -300, 36, 240, 4), P.cream, P.creamD, 8, 0)).join("")}
  <path d="M-300 -300h600l-40 -40h-520Z" fill="${P.stone}"/><path d="M-170 -340A170 150 0 0 1 170 -340Z" fill="${P.cream}"/><rect x="-10" y="-530" width="20" height="50" fill="${P.steel}"/>`;

// ---- 0: there is a company; the company has a freeze button ----
function s0(a, tot) {
  const c = camAt(a, [[0, 820, 600, 1.6], [1.0, 830, 600, 1.6], [1.8, 1040, 640, 1.5], [3.55, 1060, 640, 1.6]]);
  const coinG = at(760, G - 330 + 6 * Math.sin(tot * 2), rings(0, 0, 130, P.green, 0.15) + dollarCoin(100));
  const tw = at(1350, G, tower({ h: 520, c: "#2f8a5c", cD: "#1f6a44", lit: 0.7 }) + at(0, -670, dollarCoin(60)), pop(a - 1.2) * 0.9);
  const dk = at(1080, G, desk(), pop(a - 1.3));
  const glow = seg(a, 2.5, 2.8), btn = at(1080, G - 150, (glow > 0 ? rings(0, -60, 150, "#9fe7ff", 0.35 * glow * (0.8 + 0.2 * Math.sin(tot * 8))) : "") + freezeBtn(0), 1.1 * pop(a - 2.4));
  const g = night(c, tot, 37) + town(c) + layer(tw + dk + btn + coinG, c);
  return { g, out: toScreen(c, 1080, G - 230), outC: "#3fa9ff", outZ: 16 };
}

// ---- 1: OCT 2026, Binance drained; the company freezes part of what was stolen ----
function s1(a, tot) {
  const c = camAt(a, [[0, 820, 600, 1.25], [2.8, 880, 600, 1.25], [3.4, 1260, 640, 1.4], [4.8, 1280, 640, 1.45]]);
  const tw = at(520, G, tower({ name: "Binance", h: 640 }), 1);
  const SX = 1180, drain = a < 3.6 ? 1 : 1 - seg(a, 3.6, 3.9);
  let flow = ""; for (let i = 0; i < 12; i++) { const t = (a * 0.8 + i / 12) % 1, b = bez([700, G - 420], [960, G - 650], [SX, G - 230], t); flow += at(b[0], b[1], `<circle r="18" fill="${P.gold}"/>`, drain); }
  const cal = a > 0.8 ? at(300, 230, calPage("2026", "OCT", 1, 140), 0.7 * pop(a - 0.8), -5) : "";
  const press = seg(a, 3.45, 3.6) * (1 - seg(a, 3.8, 4.0)), btn = at(1470, G, freezeBtn(press) + (a > 3.5 ? rings(0, -100, 160 * spring(a - 3.5, 6, 10), "#9fe7ff", 0.3 * (1 - seg(a, 3.8, 4.4))) : ""), 1.1);
  const frost = ease(seg(a, 3.6, 4.8));
  const sk = at(SX, G, sack(1, frost * 0.55), 1.3);
  const g = night(c, tot, 41) + town(c, 101) + layer(tw + cal + flow + sk + btn, c);
  return { g, in: [960, 540], inC: "#3fa9ff", inZ: 16, out: toScreen(c, SX, G - 120), outC: ICE, outZ: 16 };
}

// ---- 2: $1,500,000,000 in half an hour; nice if you were the one robbed (host right) ----
function s2(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.35], [3.31, 840, 560, 1.4]]);
  const sk = at(700, G, sack(1, 0.55), 1.4);
  const v = 1.5e9 * ease(seg(a, 0.0, 1.0)), cnt = label(700, G - 470, "$" + fmtN(v), a + 0.2, 60, "#9fe7ff");
  const ck = at(1140, 360, clock(30 * ease(seg(a, 1.4, 1.85)), 110, { sweep: "#9fe7ff" }), pop(a - 1.3));
  const smile = a > 2.2 ? 1 : 0, hs = at(1300, G, house(P.blue, P.blueD), 1) + (smile ? at(1300, G - 120, `<path d="M-40 0q40 36 80 0" stroke="${P.ink}" stroke-width="10" fill="none" stroke-linecap="round"/>`) : "");
  const ht = a > 2.4 ? at(1300, G - 380 - 40 * seg(a, 2.4, 3.3), heart(P.pink, 1.2), pop(a - 2.4)) : "";
  const g = night(c, tot, 43) + town(c, 111) + layer(sk + cnt + ck + hs + ht, c);
  return { g, in: toScreen(c, 700, G - 170), inC: ICE, inZ: 16 };
}

// ---- 3: what's in your pocket is in someone else's hand ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 500, 1.45], [2.08, 960, 520, 1.6]]);
  const fr = ease(seg(a, 0.8, 1.7)), hover = 10 * Math.sin(tot * 3);
  const pocket = `${two("M-300 -260H300V60Q300 260 0 300Q-300 260 -300 60Z", "#3c5bb0", "#2c4590", 0, 12)}<path d="M-300 -260H300" stroke="#24346f" stroke-width="20"/><path d="M-260 -250Q0 -40 260 -250" fill="#24346f"/>
    <path d="M-280 -230V40Q-280 230 0 270Q280 230 280 40V-230" fill="none" stroke="${P.gold}" stroke-width="6" stroke-dasharray="14 12"/>`;
  const cns = [[-120, -170], [0, -200], [120, -165], [-60, -120], [70, -118]].map(([x, y]) => at(x, y, dollarCoin(60, { frost: fr }))).join("");
  const glove = at(0, -540 + hover + 90 * ease(seg(a, 0.5, 1.0)), `${rings(0, 0, 150, "#9fe7ff", 0.25)}${two("M-120 -60Q-130 -200 -60 -200V-110H-40V-230Q-40 -260 -10 -260Q20 -260 20 -230V-110H40V-220Q40 -250 70 -250Q100 -250 100 -220V-110H110V-180Q110 -205 135 -205Q160 -205 160 -180V40Q160 120 60 130H-60Q-130 120 -120 -60Z", "#cfeeff", "#9fd8f5", 0, 10)}`, pop(a - 0.4), 180);
  const g = night(c, tot, 47) + layer(at(960, 640, pocket + cns) + at(960, 640, glove), c);
  return { g };
}

// ---- 4: the ledger is back with its guard; a coin kept at a dollar by a formula alone ----
function s4(a, tot) {
  const c = camAt(a, [[0, 700, 640, 1.75], [1.0, 710, 640, 1.75], [1.5, 1460, 640, 1.6], [4.06, 1480, 630, 1.7]]);
  const bp = ease(seg(a, 0.0, 0.8)), bk = at(lerp(1000, 760, bp), lerp(G - 500, G - 330, bp), book(rows("70", "80")), 0.55);
  const bt = at(640, G, booth({ cap: a > 0.8 ? 1 : 0, lamp: a > 0.8 ? 1 : 0 }), 1);
  // the formula seesaw: a coin balanced on a plank of math, nothing behind it
  const SX = 1380, plankG = `<path d="M-60 0L0 -110L60 0Z" fill="${P.steelD}"/><g transform="translate(0 -110) rotate(${(4 * Math.sin(tot * 2)).toFixed(2)})"><path d="${rr(-320, -16, 640, 32, 10)}" fill="${P.violet}"/>${["x", "+", "y", "=", "1"].map((t, i) => text(-240 + i * 120, 10, t, 34, "#fff")).join("")}
    ${at(0, -90, `<circle r="70" fill="#7fd0ff"/><circle r="54" fill="none" stroke="#2a80d2" stroke-width="8"/>${text(0, 22, "$1", 58, "#123a6a")}`)}</g>`;
  const ghost = a > 2.7 ? at(SX + 220, G - 420, `<path d="${rr(-80, -42, 160, 84, 8)}" fill="none" stroke="${P.cream}" stroke-width="5" stroke-dasharray="12 10"/>`, pop(a - 2.7)) + (a > 3.2 ? cross(SX + 300, G - 470, 30, P.red, a - 3.2) : "") : "";
  const g = night(c, tot, 53) + town(c, 121) + layer(bt + bk + at(SX, G, plankG, pop(a - 1.3)) + ghost, c);
  return { g, out: toScreen(c, SX, G - 200), outC: "#7fd0ff", outZ: 16 };
}

// ---- 5: MAY 2022, the formula broke; $40,000,000,000 gone as steam in a week (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1100, 600, 1.55], [5.03, 1090, 580, 1.6]]);
  const SX = 1100, tip = ease(seg(a, 0.2, 0.9)), crack = seg(a, 1.7, 2.0), fall = seg(a, 1.9, 2.8);
  const plankG = `<path d="M-60 0L0 -110L60 0Z" fill="${P.steelD}"/><g transform="translate(0 -110) rotate(${(-22 * tip).toFixed(2)})"><path d="${rr(-320, -16, 640, 32, 10)}" fill="${P.violet}"/>${["x", "+", "y", "=", "1"].map((t, i) => text(-240 + i * 120, 10, t, 34, "#fff")).join("")}
    ${crack > 0 ? drawn("M-40 -16l20 14l-16 10l24 10", crack, P.ink, 8) : ""}</g>`;
  const coinX = SX - 260 * ease(fall), coinY = G - 310 + 300 * fall * fall;
  const coinB = at(coinX, coinY, `<circle r="70" fill="#7fd0ff"/><circle r="54" fill="none" stroke="#2a80d2" stroke-width="8"/>${text(0, 22, "$1", 58, "#123a6a")}`, 1, -200 * fall);
  const cal = a > 0.8 ? at(1520, 360, calPage("2022", "MAY", 1, 140), 0.7 * pop(a - 0.8), 5) : "";
  const v = 4e10 * ease(seg(a, 2.3, 3.2)), up = seg(a, 3.3, 4.6), cnt = a > 2.3 ? at(1100, 470 - 120 * up, label(0, 0, "$" + fmtN(v), 1, 60, P.red), 1, 0, `opacity="${(1 - up).toFixed(2)}"`) : "";
  const steam = a > 3.2 ? Array.from({ length: 7 }, (_, i) => { const t = (a - 3.2) * 0.8 + i * 0.13; return `<circle cx="${(900 + i * 60 + 30 * Math.sin(t * 3 + i)).toFixed(0)}" cy="${(560 - 160 * (t % 1)).toFixed(0)}" r="${(30 + 20 * (t % 1)).toFixed(0)}" fill="#e8f0ff" opacity="${(0.5 * (1 - (t % 1))).toFixed(2)}"/>`; }).join("") : "";
  const g = night(c, tot, 59) + town(c, 131) + layer(at(SX, G, plankG) + coinB + cal + steam + cnt, c);
  return { g, in: toScreen(c, SX, G - 200), inC: "#7fd0ff", inZ: 16 };
}

// ---- 6: 15 years; then in 2025 a law ----
function s6(a, tot) {
  const c = camAt(a, [[0, 640, 640, 1.6], [1.3, 650, 640, 1.6], [1.9, 1320, 600, 1.45], [4.55, 1330, 590, 1.5]]);
  const gv = at(360, G - 40, gavel(seg(a, 0.1, 0.35)), 1.3);
  const bars = at(800, G, `${two(rr(-150, -420, 300, 420, 10), "#2c366f", "#1b2054", 0, 8)}${[-110, -55, 0, 55, 110].map((x) => `<rect x="${x - 7}" y="-410" width="14" height="${(400 * ease(seg(a, 0.4, 0.9))).toFixed(0)}" fill="${P.steel}"/>`).join("")}`, 1);
  const yrs = label(650, G - 520, "15 YEARS", a - 0.8, 60, P.red);
  const cal = a > 2.2 ? at(1650, 240, calPage("2025", "", 1, 150), 0.7 * pop(a - 2.2), 5) : "";
  const db = at(1250, G, domeB(), 0.9);
  const sp = ease(seg(a, 2.7, 3.6)), scroll = a > 2.6 ? at(1250, G - 420 - 120 * sp, `${two(rr(-150, -100, 300, 200, 12), P.cream, P.creamD, 0, 6)}<path d="M-110 -60h220M-110 -20h180M-110 20h200" stroke="#c9b48a" stroke-width="10"/>${a > 3.6 ? at(90, 60, `<circle r="40" fill="${P.red}"/><circle r="28" fill="none" stroke="#fff" stroke-width="5"/>`, pop(a - 3.6)) : ""}`, pop(a - 2.6)) : "";
  const g = night(c, tot, 61) + town(c, 141) + layer(gv + bars + yrs + db + scroll + cal, c);
  return { g, out: toScreen(c, 1250, G - 540), outC: P.cream, outZ: 16 };
}

// ---- 7: every digital dollar must have a real one behind it ----
function s7(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.45], [2.21, 960, 600, 1.55]]);
  const cs = [620, 960, 1300].map((x, i) => at(x, 640, dollarCoin(90, { backed: seg(a, 0.1 + i * 0.3, 0.6 + i * 0.3) })), 1).join("");
  const ok = a > 1.55 ? check(960, 860, 60, P.green, a - 1.55) : "";
  const g = night(c, tot, 67) + layer(cs + ok, c);
  return { g, in: [960, 540], inC: P.cream, inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7];
export const c5s6Set = makeSet(SHOTS, V, P);
