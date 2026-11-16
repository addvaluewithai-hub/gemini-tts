// Crypto part 4, scene "who": where the coins are and who holds them. Three wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-04-world/shots.md), in the world of parts 1 to 3.
//   0 the silo of 21 million (part 2) splits into bands: 3–4 M lost (dark), ≈ 1 M by the hooded chair, 1 M+ in funds
//   1 a row of houses; a whole coin is crossed out and breaks into slivers, one sliver per house; 1 / 100,000,000 (host left)
//   2 a domed government building with a chained vault of seized coins, 100,000s; a whale rises behind it and wears the dome (host right)
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4who.v.js";
import { stars, skyline, house } from "./bank.js";
import { hoodChair } from "./props.js";
import { P, mix, coin, silo, whale, tower } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, 2800, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f") => `<rect x="-1200" y="${y}" width="5000" height="900" fill="${fill}"/>`;
const far = (c, base = 900, seed = 41) => layer(skyline(seed, -800, 2800, base, 90, 260, "#2a1d66", "#ffb066"), c, 0.45);
const fmtN = (v) => Math.round(v).toLocaleString("en");
const pill = (t, size, fill, bg) => `<path d="${rr(-t.length * size * 0.27 - 22, -size * 0.86, t.length * size * 0.54 + 44, size * 1.12, size * 0.3)}" fill="${bg}"/>${text(0, 0, t, size, fill)}`;

// ---- 0: the silo splits into who has the coins ----
const SX = 660, SG = 980, SK = 1.4;   // silo base, scale
function s0(a, tot) {
  const c = camAt(a, [[0, 900, 560, 1.0], [3.0, 1000, 560, 1.0], [8.95, 1020, 560, 1.03]]);
  const fill = 0.95 * ease(seg(a, 0.3, 1.6));
  // bands inside the silo, from the bottom: lost (0..0.17), the absent one (next 0.05), funds (next 0.055)
  const H = 540, band = (f0, f1, col, p) => p <= 0 ? "" : `<path d="${rr(-140, -40 - H * f1, 280, H * (f1 - f0), 4)}" fill="${col}" opacity="${(0.82 * p).toFixed(2)}"/>`;
  const pL = ease(seg(a, 3.2, 3.9)), pC = ease(seg(a, 4.9, 5.5)), pF = ease(seg(a, 6.5, 7.2));
  const inner = band(0, 0.17, "#120c2e", pL) + band(0.17, 0.22, P.violet, pC) + band(0.22, 0.275, P.blue, pF);
  const s = at(SX, SG, silo(fill, { id: "w0" }) + inner, SK);
  const yOf = (f) => SG - SK * (40 + H * f);
  // labels on the right, spread out, each joined to its band by a dashed leader
  const lab = (f, ly, t, col, p, extra = "") => { if (p <= 0) return ""; const x0 = SX + 150 * SK, y0 = yOf(f), x1 = x0 + 180, q = ease(p);
    return `<path d="M${x0} ${y0}L${lerp(x0, x1, q)} ${lerp(y0, ly, q)}" stroke="${col}" stroke-width="7" stroke-dasharray="12 9"/>` + at(x1 + 170, ly + 22, pill(t, 66, "#fff", col) + extra, pop(p * 0.6)); };
  const lost = lab(0.085, SG - 90, "3–4 M", "#5a4a9a", pL, at(205, -24, cross(0, 0, 34, P.red, a - 3.9)));
  const chair = pC > 0 ? at(SX + 900, SG, hoodChair(), 0.6 * pop(a - 4.95)) : "";
  const absent = lab(0.195, SG - 360, "≈ 1 M", P.violet, pC);
  const funds = lab(0.25, SG - 640, "1 M+", P.blue, pF) + (pF > 0 ? at(SX + 1150, SG, tower({ name: "FUND", h: 560 }), 0.55 * pop(a - 6.6)) : "");
  // the 20 million mark on the left
  const total = a > 0.9 ? at(SX - 330, yOf(0.95) + 20, pill("20,000,000", 56, P.ink, P.gold), pop(a - 0.9)) : "";
  const g = night(c, tot, 13) + far(c) + layer(ground(SG) + s + total + lost + absent + chair + funds, c);
  return { g, out: toScreen(c, SX, yOf(0.1)), outC: P.gold, outZ: 18 };
}

// ---- 1: people own slivers, not whole coins (host left) ----
const HC = [[P.blue, P.blueD], [P.pink, P.pinkD], [P.teal, P.tealD], [P.violet, P.violetD], [P.gold, P.goldD], [P.red, P.redD]];
function s1(a, tot) {
  const G = 900, c = camAt(a, [[0, 1180, 540, 1.0], [5.51, 1200, 540, 1.06]]);
  const CX = 1180, CY = 330, brk = seg(a, 3.0, 3.6);
  // the whole coin, crossed out on "whole"
  let big = "";
  if (brk < 1) big = at(CX, CY, rings(0, 0, 150, P.gold, 0.16) + coin(110, "B"), pop(a - 0.3) * (1 - 0.3 * brk)) + (a > 2.4 ? at(CX + 120, CY - 100, cross(0, 0, 40, P.red, a - 2.4)) : "");
  // slivers fly to the houses
  let hs = "", sl = "";
  for (let i = 0; i < 6; i++) { const hx = 520 + i * 250, col = HC[i]; hs += at(hx, G, house(col[0], col[1], { lit: [1, 1, 1] }), 0.95);
    if (brk > 0) { const p = ease(seg(a, 3.0 + i * 0.07, 3.7 + i * 0.07)), b = bez([CX, CY], [(CX + hx) / 2, CY - 160], [hx, G - 330], p), an = i * 60;
      sl += at(b[0], b[1] + (p >= 1 ? 4 * Math.sin(tot * 3 + i) : 0), `<path d="M0 0L${(Math.cos(an * Math.PI / 180) * 40).toFixed(1)} ${(Math.sin(an * Math.PI / 180) * 40).toFixed(1)}A40 40 0 0 1 ${(Math.cos((an + 14) * Math.PI / 180) * 40).toFixed(1)} ${(Math.sin((an + 14) * Math.PI / 180) * 40).toFixed(1)}Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width="4"/>` + (p >= 1 ? rings(0, 0, 30, P.gold, 0.25) : ""), 1.6); } }
  const frac = a > 4.0 ? at(CX, 190, pill("1 / 100,000,000", 80, P.ink, P.gold), pop(a - 4.0)) : "";
  const g = night(c, tot, 17) + far(c, 860, 23) + layer(ground(G) + hs + big + sl + frac, c);
  return { g, in: [CX * 1 - (1180 - 960), CY], inC: P.gold, inZ: 18, out: toScreen(c, 520 + 5 * 250, G - 330), outC: P.gold, outZ: 18 };
}

// ---- 2: one of the biggest whales is a government (host right) ----
const dome = (o = {}) => { const cols = [-220, -132, -44, 44, 132, 220].map((x) => two(rr(x - 22, -330, 44, 290, 4), "#e9e4f6", "#c9c2e2", 10, 0)).join("");
  return `<path d="${rr(-320, -40, 640, 40, 6)}" fill="#c9c2e2"/>${cols}<path d="M-300 -330H300L280 -380H-280Z" fill="#e9e4f6"/><path d="M-200 -380A200 170 0 0 1 200 -380Z" fill="#d9d2ee"/><path d="M-200 -380A200 170 0 0 1 200 -380" fill="none" stroke="#b7aedb" stroke-width="10"/><rect x="-8" y="-610" width="16" height="70" fill="${P.steelD}"/><circle cy="-618" r="14" fill="${P.gold}"/>${o.inner || ""}`; };
function s2(a, tot) {
  const G = 900, c = camAt(a, [[0, 820, 520, 0.95], [3.0, 840, 520, 0.98], [7.34, 860, 510, 1.0]]);
  const BX = 640;
  // the vault inside the colonnade: seized bags fly in on "seized from criminals"
  let bags = "";
  for (let i = 0; i < 4; i++) { const p = ease(seg(a, 1.9 + i * 0.15, 2.5 + i * 0.15)); if (p <= 0) continue; const b = bez([-300, 300 + i * 60], [BX - 300, 120], [BX - 90 + i * 60, G - 120], p);
    bags += at(b[0], b[1], `${two("M-36 30Q-44 -20 -16 -34H16Q44 -20 36 30Z", "#5a3a6a", "#43294f", 0, 6)}<path d="M-20 -40Q0 -56 20 -40" stroke="${P.ink}" stroke-width="8" fill="none"/>${at(0, 4, coin(16, "B"))}`, 1.2); }
  const chain = a > 2.6 ? Array.from({ length: 9 }, (_, i) => `<ellipse cx="${BX - 220 + i * 55}" cy="${G - 80 + 10 * Math.sin(i)}" rx="26" ry="13" fill="none" stroke="${P.steel}" stroke-width="9" transform="rotate(${i % 2 ? 20 : -20} ${BX - 220 + i * 55} ${G - 80})"/>`).join("") : "";
  const lab = a > 1.2 ? at(BX, G - 700, pill("100,000s", 72, P.ink, P.gold), pop(a - 1.2)) : "";
  const bld = at(BX, G, dome(), 1.0);
  // the whale rises behind, then wears the dome as a hat
  const wp = ease(seg(a, 3.8, 4.8)), wear = ease(seg(a, 6.5, 7.0)), WX = 1300, WY = lerp(1100, 360, wp);
  const wh = wp > 0 ? at(WX, WY + 10 * Math.sin(tot * 2), whale(Math.sin(tot * 3)) + (wear > 0 ? at(30, -150 - 40 * (1 - wear), `<path d="M-90 0A90 76 0 0 1 90 0Z" fill="#d9d2ee"/><path d="M-110 0h220" stroke="#c9c2e2" stroke-width="14"/><circle cy="-80" r="10" fill="${P.gold}"/>`, wear) : ""), 1.25) : "";
  const water = `<path d="M600 ${G + 40}Q1000 ${G + 10} 1500 ${G + 40}V${G + 300}H600Z" fill="#1d2a6a" opacity=".6"/>`;
  const g = night(c, tot, 29) + far(c, 860, 51) + layer(ground(G) + water + wh + bld + chain + bags + lab, c);
  return { g, in: [960, 540], inC: P.gold, inZ: 18 };
}

const SHOTS = [s0, s1, s2];
export const c4whoSet = makeSet(SHOTS, V, P);
