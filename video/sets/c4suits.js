// Crypto part 4, scene "suits": Wall Street and governments arrive. Ten wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-04-world/shots.md), in the world of parts 1 to 3.
//   0 2017: a tall asset-manager tower stamps the coin with a red LAUNDERING label (soap bubbles)
//   1 2024: the same tower opens a gold FUND door and fills with coins; #1
//   2 a house hands its money to the fund building
//   3 the fund buys coins and locks them in its own vault
//   4 the house gets back only a price tag on a string: no key ✗, no twelve-word slip ✗, a fee coin drips out each year
//   5 the house that ran from the bank (part 1) pays a toll at a new middleman's gate, then sits in a deck chair (host left)
//   6 2021: El Salvador raises the coin on its flag pole as official money
//   7 2025: the coin flag comes down; an IMF building hands over a loan bag
//   8 the STRATEGIC RESERVE vault holds only chained, seized coins; its BUY button stays untouched, 0
//   9 Strategy: the old sign falls, borrowed bags pour in, coins bought; 2026, −$8,000,000,000 in three calendar pages
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4suits.v.js";
import { stars, skyline, house, bank, note } from "./bank.js";
import { calPage } from "./props.js";
import { P, mix, coin, tower, fund, key, seedSlip, receipt } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, 2800, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f") => `<rect x="-1200" y="${y}" width="5200" height="900" fill="${fill}"/>`;
const far = (c, base = 900, seed = 61) => layer(skyline(seed, -800, 2800, base, 90, 260, "#2a1d66", "#ffb066"), c, 0.45);
const fmtN = (v) => Math.round(v).toLocaleString("en");
const pill = (t, size, fill, bg) => `<path d="${rr(-t.length * size * 0.27 - 22, -size * 0.86, t.length * size * 0.54 + 44, size * 1.12, size * 0.3)}" fill="${bg}"/>${text(0, 0, t, size, fill)}`;
const cal = (big, small, a, k = 0.6, rot = 6) => (a > 0 ? at(0, 0, calPage(big, small, 1, 150), k * pop(a), rot) : "");
const G = 920;

// ---- 0: 2017, the coin gets a red label ----
const TX = 700;
function s0(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.12], [3.4, 980, 560, 1.15], [5.92, 1000, 560, 1.2]]);
  const tw = at(TX, G, tower({ name: "ASSET MGR", h: 600, nameC: "#fff" }), 0.95 * pop(a - 0.1));
  const cn = a > 3.4 ? at(1300, 520 + 8 * Math.sin(tot * 2), rings(0, 0, 190, P.gold, 0.18) + coin(140, "B"), pop(a - 3.4)) : "";
  // a stamp arm from the tower; a red label slaps on with bubbles
  const hit = 4.55, arm = a > 3.9 ? `<path d="M${TX + 170} 420L${lerp(TX + 170, 1150, ease(seg(a, 3.9, hit)))} ${lerp(420, 560, ease(seg(a, 3.9, hit)))}" stroke="${P.steelD}" stroke-width="22" stroke-linecap="round"/>` : "";
  const lab = a > hit ? at(1300, 720, `${pill("LAUNDERING", 64, "#fff", P.red)}`, pop(a - hit), -6) : "";
  const bub = a > hit ? Array.from({ length: 8 }, (_, i) => { const u = ((a - hit) * 0.6 + i / 8) % 1; return `<circle cx="${1160 + rnd(i) * 300 + 20 * Math.sin(tot * 2 + i)}" cy="${720 - u * 360}" r="${10 + rnd(i + 9) * 18}" fill="none" stroke="#cfe9ff" stroke-width="4" opacity="${(0.8 * (1 - u)).toFixed(2)}"/>`; }).join("") : "";
  const g = night(c, tot, 11) + far(c) + layer(ground(G) + tw + arm + cn + bub + lab + at(380, 300, cal("2017", "", a - 2.3), 1), c);
  return { g, out: toScreen(c, TX, G - 450), outC: "#3c5bb0", outZ: 16 };
}

// ---- 1: 2024, the same tower opens a fund ----
function s1(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.12], [2.0, 1000, 600, 1.1], [4.28, 1040, 600, 1.15]]);
  const FX1 = 1320, up = ease(seg(a, 1.9, 2.6)), fill = seg(a, 2.6, 3.8);
  const bridge = up > 0 ? `<path d="M${TX + 175} ${G - 300}H${lerp(TX + 175, FX1 - 255, up)}" stroke="${P.gold}" stroke-width="18" stroke-linecap="round"/>` : "";
  let coins = ""; for (let i = 0; i < 10; i++) { const t = a - 2.6 - i * 0.11; if (t < 0 || t > 1.0) continue; const p = ease(t), b = bez([1900, 120 + i * 20], [1500, 160], [FX1, G - 330], p); coins += at(b[0], b[1], coin(30, "B"), 1 - 0.3 * p); }
  const fd = up > 0 ? at(FX1, G + 300 * (1 - up), fund({ fill, name: "FUND" }), 0.95) : "";
  const one = a > 2.8 ? at(FX1 + 230, G - 640, pill("#1", 80, P.ink, P.gold), pop(a - 2.8)) : "";
  const g = night(c, tot, 11) + far(c) + layer(ground(G) + at(TX, G, tower({ name: "ASSET MGR", h: 600, nameC: "#fff" }), 0.95) + bridge + fd + coins + one + at(360, 300, cal("2024", "", a - 0.2), 1), c);
  return { g, in: [960, 540], inC: "#3c5bb0", inZ: 16, out: toScreen(c, FX1, G - 300), outC: "#141038", outZ: 18 };
}

// ---- 2–4: you, the fund and what you get back (one street, one camera per shot) ----
const HX = 520, FX = 1300;
const street = (a, tot, o = {}) => { const handP = o.hand || 0, buyP = o.buy || 0;
  let g = at(HX, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.2) + at(FX, G, fund({ fill: o.fill ?? 0.2 }), 1.0);
  if (handP > 0 && handP < 1) { const b = bez([HX + 60, G - 200], [(HX + FX) / 2, G - 520], [FX, G - 330], ease(handP)); g += at(b[0], b[1], note(), 2.2); }
  if (buyP > 0) for (let i = 0; i < 6; i++) { const p = ease(seg(buyP, i * 0.1, 0.5 + i * 0.1)); if (p <= 0 || p >= 1) continue; const b = bez([FX + 700, 150 + i * 40], [FX + 300, 100], [FX, G - 300], p); g += at(b[0], b[1], coin(26, "B")); }
  return g; };
function s2(a, tot) {
  const c = camAt(a, [[0, 900, 640, 1.25], [2.1, 920, 640, 1.28]]);
  const g = night(c, tot, 21) + far(c) + layer(ground(G) + street(a, tot, { hand: seg(a, 1.0, 1.75), fill: 0.15 }), c);
  return { g, in: [960, 540], inC: "#141038", inZ: 18 };
}
function s3(a, tot) {
  const c = camAt(a, [[0, 920, 640, 1.28], [1.56, 1150, 640, 1.4]]);
  const shut = a > 0.95 ? at(FX, G - 300, rings(0, 0, 160 * spring(a - 0.95, 7, 10), P.gold, 0.25 * (1 - seg(a, 1.1, 1.5))), 1) : "";
  const g = night(c, tot, 21) + far(c) + layer(ground(G) + street(a, tot, { buy: seg(a, 0.2, 1.1), fill: lerp(0.15, 1, seg(a, 0.4, 1.1)) }) + shut, c);
  return { g, out: toScreen(c, FX, G - 300), outC: "#141038", outZ: 18 };
}
function s4(a, tot) {
  const c = camAt(a, [[0, 1150, 640, 1.4], [0.6, 840, 600, 1.25], [4.32, 840, 600, 1.28]]);
  // a price tag on a string floats to the house; the key and slip come up crossed; a fee coin drips from the house every "year"
  const tp = ease(seg(a, 0.2, 0.9)), tb = bez([FX, G - 400], [1000, G - 700], [HX + 220, G - 420], tp);
  const tag = `<path d="M0 -90V-10" stroke="${P.cream}" stroke-width="4"/><g>${two("M-80 -10h130l40 40l-40 40h-130Z", P.cream, P.creamD, 0, 6)}<path d="M-60 40l30 -24l24 14l34 -32l26 10" fill="none" stroke="${P.green}" stroke-width="8" stroke-linejoin="round"/></g>`;
  const k = a > 1.2 ? at(HX - 210, G - 520, key({ digits: 6 }), 0.55 * pop(a - 1.2)) + at(HX - 140, G - 580, cross(0, 0, 34, P.red, a - 1.5)) : "";
  const sl = a > 2.0 ? at(HX + 520, G - 560, seedSlip(), 0.55 * pop(a - 2.0)) + at(HX + 600, G - 640, cross(0, 0, 34, P.red, a - 2.3)) : "";
  let fees = ""; for (let i = 0; i < 3; i++) { const t = a - 2.9 - i * 0.45; if (t < 0) continue; const p = ease(clamp(t / 0.8)), b = bez([HX + 60, G - 120], [(HX + FX) / 2, G - 300], [FX - 80, G - 160], p); fees += p < 1 ? at(b[0], b[1], coin(22, "$")) : ""; }
  const yearly = a > 2.9 ? at((HX + FX) / 2, G - 380, pill("FEE / YEAR", 40, "#fff", P.red), pop(a - 2.9)) : "";
  const g = night(c, tot, 21) + far(c) + layer(ground(G) + street(a, tot, { fill: 1 }) + at(tb[0], tb[1] + 6 * Math.sin(tot * 3), tag, 1.4) + k + sl + fees + yearly, c);
  return { g, in: [960, 540], inC: "#141038", inZ: 18, out: toScreen(c, HX + 220, G - 420), outC: P.cream, outZ: 18 };
}

// ---- 5: the house that ran from the bank pays a new middleman (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1080, 600, 1.15], [4.31, 1120, 600, 1.2]]);
  const BX = 520, GX = 1150, run = ease(seg(a, 0.6, 1.5)), hx = lerp(700, GX - 230, run);
  const bk = at(BX, G, bank({}), 0.7);
  const gate = `<rect x="${GX - 14}" y="${G - 300}" width="28" height="300" fill="${P.steelD}"/><g transform="rotate(${(-70 * ease(seg(a, 2.3, 2.7))).toFixed(1)} ${GX} ${G - 280})"><path d="${rr(GX, G - 296, 420, 32, 10)}" fill="${P.red}"/>${[0, 1, 2, 3].map((i) => `<path d="${rr(GX + 40 + i * 100, G - 296, 40, 32, 0)}" fill="#fff"/>`).join("")}</g>${at(GX + 120, G - 340, pill("FUND", 46, P.ink, P.gold), 1)}`;
  const pay = a > 1.8 && a < 2.5 ? at(...bez([hx, G - 240], [GX - 80, G - 420], [GX - 10, G - 320], seg(a, 1.8, 2.4)), coin(30, "$")) : "";
  const chair = a > 3.1 ? at(GX + 520, G, `<path d="M-90 0L-30 -110M90 0L20 -100M-80 -60L70 -60" stroke="${P.wood}" stroke-width="12" stroke-linecap="round"/><path d="M-30 -110Q20 -90 20 -100L70 -60Q0 -40 -80 -60Z" fill="${P.pink}"/>`, 1.3 * pop(a - 3.1)) : "";
  const hs = at(hx + (a > 2.7 ? ease(seg(a, 2.7, 3.3)) * (GX + 380 - hx) : 0), G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.05);
  const g = night(c, tot, 33) + far(c) + layer(ground(G) + bk + gate + chair + hs + pay, c);
  return { g, in: [960, 540], inC: P.cream, inZ: 18 };
}

// ---- 6–7: El Salvador, on and off ----
const PX = 820;
const flagpole = (up, flag) => `<rect x="${PX - 8}" y="${G - 640}" width="16" height="640" fill="${P.steel}"/><circle cx="${PX}" cy="${G - 650}" r="14" fill="${P.gold}"/>${at(PX + 8, lerp(G - 120, G - 600, up), flag)}`;
const salvador = (coinOn) => `<path d="M0 0h300v60H0Z" fill="#1f5fbf"/><path d="M0 60h300v60H0Z" fill="#fff"/><path d="M0 120h300v60H0Z" fill="#1f5fbf"/>${coinOn > 0 ? at(150, 90, coin(48, "B"), coinOn) : `<circle cx="150" cy="90" r="22" fill="none" stroke="#3a8a3a" stroke-width="6"/>`}`;
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.15], [3.35, 980, 580, 1.25]]);
  const up = ease(seg(a, 0.6, 1.8)), cOn = pop(a - 1.4);
  const g = night(c, tot, 41) + far(c, 900, 71) + layer(ground(G) + flagpole(up, salvador(cOn)) + at(PX + 600, G - 560, pill("El Salvador", 58, "#fff", "#1f5fbf"), pop(a - 0.8)) + at(PX - 380, 380, cal("2021", "", a - 2.1), 1), c);
  return { g, out: toScreen(c, PX + 158, lerp(G - 120, G - 600, up) + 90), outC: "#1f5fbf", outZ: 16 };
}
function s7(a, tot) {
  const c = camAt(a, [[0, 980, 580, 1.25], [1.6, 1150, 620, 1.15], [3.51, 1180, 620, 1.18]]);
  const down = ease(seg(a, 0.45, 1.5)), cOn = 1 - seg(a, 1.2, 1.6);
  const imf = at(1560, G, `${two(rr(-200, -380, 400, 380, 12), "#e9e4f6", "#c9c2e2", 0, 10)}${[-140, -70, 0, 70, 140].map((x) => `<rect x="${x - 14}" y="-330" width="28" height="270" fill="#d0c8ea"/>`).join("")}<path d="M-220 -380L0 -470L220 -380Z" fill="#c9c2e2"/>${text(0, -400, "IMF", 52, "#3c5bb0")}`, 1);
  const bp = ease(seg(a, 2.0, 2.9)), bag = a > 1.9 ? at(...bez([1560, G - 200], [1250, G - 520], [PX + 150, G - 160], bp), `${two("M-50 40Q-60 -20 -24 -44H24Q60 -20 50 40Z", "#5a8a3a", "#3f6a28", 0, 6)}${text(0, 24, "$", 44, "#fff")}`, 2.0) : "";
  const g = night(c, tot, 41) + far(c, 900, 71) + layer(ground(G) + flagpole(1 - down, salvador(cOn)) + imf + bag + at(PX - 380, 380, cal("2025", "", a + 1), 1), c);
  return { g, in: [960, 540], inC: "#1f5fbf", inZ: 16, out: toScreen(c, PX + 150, G - 160), outC: "#5a8a3a", outZ: 16 };
}

// ---- 8: the strategic reserve: seized coins only, nothing bought ----
function s8(a, tot) {
  const c = camAt(a, [[0, 1100, 640, 1.25], [4.5, 1140, 640, 1.3]]);
  const VX = 820;
  let heap = ""; for (let i = 0; i < 12; i++) heap += at(VX - 150 + (i % 4) * 100, G - 120 - Math.floor(i / 4) * 70, coin(40, "B"));
  const chain = a > 2.3 ? Array.from({ length: 11 }, (_, i) => { const p = seg(a, 2.3 + i * 0.04, 2.6 + i * 0.04); return p <= 0 ? "" : `<ellipse cx="${VX - 260 + i * 52}" cy="${G - 200 + 30 * Math.sin(i * 0.8)}" rx="28" ry="14" fill="none" stroke="${P.steel}" stroke-width="10" opacity="${p.toFixed(2)}" transform="rotate(${i % 2 ? 20 : -20} ${VX - 260 + i * 52} ${G - 200})"/>`; }).join("") : "";
  const vault = `${two(rr(VX - 330, G - 480, 660, 480, 20), "#5a6aa8", "#44529a", 0, 12)}<path d="${rr(VX - 290, G - 400, 580, 380, 12)}" fill="#141038"/>${at(VX, G - 440, pill("STRATEGIC RESERVE", 40, P.ink, P.gold), pop(a - 0.6))}`;
  const btn = at(1500, G - 260, `${disc(0, 0, 110, P.green, P.greenD)}${text(0, 22, "BUY", 64, "#fff")}${a > 3.4 ? `<path d="M-120 -120L120 120M120 -120L-120 120" stroke="#cfd6ee" stroke-width="3" opacity=".7"/><path d="M-100 -60Q0 -10 100 -60M-90 40Q0 80 90 40" stroke="#cfd6ee" stroke-width="2" fill="none" opacity=".6"/>` : ""}`, pop(a - 3.0));
  const zero = a > 3.9 ? at(1500, G - 470, pill("0", 90, "#fff", P.red), pop(a - 3.9)) : "";
  const g = night(c, tot, 47) + far(c) + layer(ground(G) + vault + heap + chain + btn + zero, c);
  return { g, in: [960, 540], inC: "#5a8a3a", inZ: 16, out: toScreen(c, VX, G - 200), outC: "#141038", outZ: 18 };
}

// ---- 9: Strategy borrows to buy; 2026, −8 billion in three months ----
function s9(a, tot) {
  const c = camAt(a, [[0, 980, 560, 1.12], [3.6, 1040, 560, 1.12], [7.45, 1080, 560, 1.18]]);
  const SX = 760, fall = ease(seg(a, 1.45, 2.0));
  const oldSign = at(SX + 200 * fall, G - 680 + 580 * fall * fall, `<path d="${rr(-150, -40, 300, 80, 10)}" fill="#6a7ab8"/>${text(0, 18, "SOFTWARE", 44, "#fff")}`, 1, 40 * fall);
  const tw = at(SX, G, tower({ name: "Strategy", h: 600, nameC: P.gold }), 1);
  let bags = ""; for (let i = 0; i < 3; i++) { const p = ease(seg(a, 2.3 + i * 0.15, 3.0 + i * 0.15)); if (p <= 0) continue; const b = bez([1900, 200 + i * 60], [1400, 260], [SX + 260 + i * 110, G - 60], p); bags += at(b[0], b[1], `${two("M-40 34Q-50 -16 -20 -36H20Q50 -16 40 34Z", "#5a3a6a", "#43294f", 0, 6)}${text(0, 22, "$", 36, "#fff")}`, 1.8); }
  let coins = ""; for (let i = 0; i < 8; i++) { const t = a - 3.0 - i * 0.08; if (t < 0 || t > 0.8) continue; const b = bez([SX + 350, G - 150], [SX + 200, G - 500], [SX, G - 420], ease(t / 0.8)); coins += at(b[0], b[1], coin(26, "B")); }
  const cnt = a > 4.6 ? at(1420, 380, pill("−$" + fmtN(8000000000 * ease(seg(a, 4.7, 6.1))), 64, "#fff", P.red), pop(a - 4.6)) : "";
  // three calendar pages tear off in turn: three months
  const pages = a > 6.5 ? [0, 1, 2].map((i) => { const p = seg(a, 6.5 + i * 0.25, 6.85 + i * 0.25); return p >= 1 ? "" : at(1440 + i * 8, 640, calPage(String(3 - i), "2026", 1, 150), 0.55, 6 - 30 * p); }).join("") : (a > 3.8 ? at(1440, 640, calPage("2026", "", 1, 150), 0.55 * pop(a - 3.8), 6) : "");
  const g = night(c, tot, 53) + far(c) + layer(ground(G) + tw + oldSign + bags + coins + cnt + pages, c);
  return { g, in: [960, 540], inC: "#141038", inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];
export const c4suitsSet = makeSet(SHOTS, V, P);
