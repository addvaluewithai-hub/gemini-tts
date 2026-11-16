// Crypto part 5, scene "s4": a coin in minutes (tokens). Four wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-05-world/shots.md, rows 32-35).
//   0 the token press on a desk stamps out new coins in different colours; a little timer
//   1 no network (laptops crossed out), no mining (a rig crossed out): a card with two lines of code drops in, a coin pops
//   2 the coin gets a TOKEN tag; 2017: stalls sell brochures of buildings that are only scaffolding; money bags pour in
//   3 one stall's sack swells to $4,000,000,000; behind it the building is still a scaffold with a "?"
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s4.v.js";
import { stars, skyline } from "./bank.js";
import { rig } from "./c2props.js";
import { P, mix, coin, clock, calPage, tokenPress, codeBars, laptop } from "./c5props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 51) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 110, -1200, 4200, 1080, tot), c, 0.15);
const G = 880;
const ground = () => `<rect x="-2400" y="${G}" width="9000" height="900" fill="#24164f"/>`;
const desk = (x, w = 900) => `${two(rr(x - w / 2, G - 210, w, 40, 10), P.wood, P.woodD, 0, 8)}<path d="${rr(x - w / 2 + 40, G - 170, 30, 170, 6)}" fill="${P.woodD}"/><path d="${rr(x + w / 2 - 70, G - 170, 30, 170, 6)}" fill="${P.woodD}"/>`;
// a token: a round coin in a colour with a simple mark
const token = (c, r = 46, i = 0) => `${disc(0, 0, r, c, mix(c, P.ink, 0.3))}<circle r="${r * 0.72}" fill="none" stroke="#fff" stroke-width="${r * 0.08}" opacity=".7"/>${i % 2 ? `<path d="M0 ${-r * 0.4}L${r * 0.35} 0L0 ${r * 0.4}L${-r * 0.35} 0Z" fill="#fff"/>` : `<circle r="${r * 0.3}" fill="#fff"/>`}`;
const TC = [P.pink, P.teal, P.gold, P.blue, P.green, P.violet];
const tag = (label, a) => (a > 0 ? at(0, 0, `<path d="M-90 -36H70L100 0L70 36H-90Z" fill="${P.cream}"/><circle cx="66" cy="0" r="8" fill="${P.ink}"/>${text(-10, 16, label, 44, P.ink)}`, pop(a)) : "");
// a stall with a brochure on its counter and a scaffold behind; `bags` money bags in front
const scaffold = (h = 360) => `${[-90, 0, 90].map((x) => `<path d="M${x} 0V${-h}" stroke="${P.steel}" stroke-width="10"/>`).join("")}${Array.from({ length: Math.floor(h / 90) }, (_, i) => `<path d="M-100 ${-90 * (i + 1)}H100M-90 ${-90 * i}L90 ${-90 * (i + 1)}" stroke="${P.steelD}" stroke-width="8"/>`).join("")}`;
const brochure = (c) => `${two(rr(-70, -90, 140, 180, 8), "#fff", "#d9d2c0", 0, 6)}${at(0, -10, `${two(rr(-40, -60, 80, 110, 4), c, mix(c, P.ink, 0.3), 0, 6)}${[0, 1, 2].map((r) => `<path d="${rr(-26, -48 + r * 32, 18, 18, 3)}" fill="#bfe6ff"/><path d="${rr(8, -48 + r * 32, 18, 18, 3)}" fill="#bfe6ff"/>`).join("")}`)}<path d="M-50 70h100" stroke="#c9b48a" stroke-width="8"/>`;
const moneyBag = (k = 1, label = "$") => at(0, 0, `${two("M-60 0Q-84 -76 -34 -110L-22 -130H22L34 -110Q84 -76 60 0Z", P.green, P.greenD, 0, 8)}<path d="M-28 -120h56" stroke="${P.greenD}" stroke-width="10" stroke-linecap="round"/>${text(0, -40, label, 56, "#fff")}`, k);
const stall = (x, c, a, bags) => { let g = at(x, G - 40, scaffold(380), 1) + at(x, G, `${two(rr(-150, -120, 300, 120, 8), P.wood, P.woodD, 0, 8)}<path d="M-170 -300H170L150 -260H-150Z" fill="${c}"/><path d="M-150 -260V-120M150 -260V-120" stroke="${P.woodD}" stroke-width="12"/>`) + at(x, G - 190, brochure(c), 0.8 * pop(a));
  for (let i = 0; i < bags; i++) g += at(x - 100 + (i % 4) * 66, G - 20 - Math.floor(i / 4) * 70, moneyBag(0.55));
  return g; };

// ---- 0: anyone can press a coin, in minutes ----
const PX = 960;
function pressing(a, tot, n0 = 0) {
  let g = ground() + desk(PX);
  const hits = [0.94, 1.43, 1.96];
  let press = 0; hits.forEach((h) => { const u = a - h + 0.15; if (u > 0 && u < 0.35) press = Math.max(press, Math.sin(Math.PI * u / 0.35)); });
  g += at(PX, G - 210, tokenPress(press, TC[Math.floor(a * 2) % 6]), 1.3);
  hits.forEach((h, i) => { const u = a - h - 0.05; if (u < 0) return; const p = ease(seg(u, 0, 0.55)), x = lerp(PX + 150, PX + 300 + i * 120, p), y = lerp(G - 260, G - 260 - i * 0, p) - 160 * Math.sin(Math.PI * p);
    g += at(x, y, token(TC[i], 52, i), pop(u)); });
  return g;
}
function s0(a, tot) { const c = camAt(a, [[0, 1080, 560, 1.3], [2.9, 1090, 555, 1.34]]);
  let g = pressing(a, tot);
  if (a > 2.26) g += at(PX - 330, G - 420, clock(60 * seg(a, 2.3, 2.9) / 6, 70), pop(a - 2.26));
  return { g: night(c, tot) + layer(skyline(71, -1200, 3400, G - 20, 100, 300, "#241a5c", "#ffb066"), c, 0.45) + layer(g, c) }; }

// ---- 1: no network, no mining: two lines of code make a coin ----
function s1(a, tot) {
  const c = camAt(a, [[0, 820, 580, 1.15], [1.5, 860, 580, 1.15], [2.6, 1040, 560, 1.25], [3.78, 1050, 555, 1.28]]);
  let g = ground() + desk(PX + 80, 700);
  // left: a little ring of laptops (a network) and a rig, each crossed out
  const net = [[-90, -40], [0, -100], [90, -40], [60, 50], [-60, 50]].map(([x, y], i) => at(420 + x * 1.4, 560 + y * 1.4, laptop("#9fe7ff"), 0.3)).join("") + `<circle cx="420" cy="560" r="160" fill="none" stroke="#9fe7ff" stroke-width="4" stroke-dasharray="8 10" opacity=".5"/>`;
  g += at(0, 0, net, 1) + cross(420, 560, 80, P.red, a - 0.3);
  g += at(720, 700, rig({ spin: tot * 8 }), 1.4) + cross(720, 610, 70, P.red, a - 1.1);
  // a card with two code lines drops into the press; the press stamps; a coin pops
  const drop = ease(seg(a, 1.74, 2.4)), press = a > 2.5 && a < 2.95 ? Math.sin(Math.PI * (a - 2.5) / 0.45) : 0;
  g += at(PX + 80, G - 210, tokenPress(press, P.teal), 1.3);
  if (a > 1.6 && drop < 1) g += at(PX + 80, lerp(330, G - 560, drop), `${two(rr(-110, -60, 220, 120, 12), P.cream, P.creamD, 0, 6)}<path d="M-80 -20h120M-80 20h80" stroke="${P.pink}" stroke-width="18" stroke-linecap="round"/>`, pop(a - 1.6));
  if (a > 2.95) { const u = a - 2.95, p = ease(seg(u, 0, 0.5)); g += at(lerp(PX + 230, PX + 420, p), G - 280 - 180 * Math.sin(Math.PI * p), token(P.teal, 64, 1), pop(u)); }
  return { g: night(c, tot, 53) + layer(skyline(71, -1200, 3400, G - 20, 100, 300, "#241a5c", "#ffb066"), c, 0.45) + layer(g, c), out: toScreen(c, PX + 420, G - 280), outC: P.teal, outZ: 16 };
}

// ---- 2-3: the 2017 stalls (host right on 2: keep x > 1560, y > 480 clear) ----
const SX = [380, 820, 1260];
function stalls(t2, t3, tot) {
  let g = ground();
  SX.forEach((x, i) => { const bags = Math.round(Math.min(8, 8 * ease(seg(t2, 2.4 + i * 0.4, 4.8 + i * 0.2)))); g += stall(x, [P.pink, P.teal, P.violet][i], t2 - 2.0 - i * 0.25, i === 1 && t3 >= 0 ? 0 : bags); });
  // money bags rain in
  if (t2 > 2.4 && t3 < 0) for (let k = 0; k < 9; k++) { const u = ((t2 - 2.4) * 0.9 + k / 9) % 1; if (t2 - 2.4 < k / 9 / 0.9) continue; g += at(SX[k % 3] + (rnd(k) - 0.5) * 160, lerp(-100, G - 160, easeIn(u)), moneyBag(0.45), 1 - seg(u, 0.85, 1)); }
  return g;
}
function s2(a, tot) {
  const c = camAt(a, [[0, 1160, 560, 1.5], [1.0, 1160, 560, 1.5], [2.0, 820, 560, 1.0], [5.9, 820, 555, 1.03]]);
  let g = stalls(a, -1, tot);
  // the coin from shot 1 with its TOKEN tag, then the calendar
  g += at(1160, 520, token(P.teal, 70, 1) + at(150, 0, tag("TOKEN", a - 0.2)), 1 - seg(a, 1.6, 2.0));
  g += at(1300, 230, calPage("2017", "", 1, 140), 0.7 * pop(a - 1.12), 6);
  if (a > 4.3) g += at(820, 200, `<path d="${rr(-250, -50, 500, 90, 45)}" fill="#1b1550"/>${text(0, 22, "$1,000,000,000s", 60, P.green)}`, pop(a - 4.3));
  return { g: night(c, tot, 55) + layer(skyline(73, -1200, 3400, G - 20, 100, 300, "#241a5c", "#ffb066"), c, 0.45) + layer(g, c), out: toScreen(c, 820, G - 100), outC: P.greenD, outZ: 14 };
}
function s3(a, tot) {
  const c = camAt(a, [[0, 820, 600, 1.25], [3.21, 820, 590, 1.3]]), swell = ease(seg(a, 0.0, 1.8));
  let g = stalls(99, a, tot);
  g += at(820, G - 30, moneyBag(0.7 + 1.5 * swell));
  g += at(820, 210, `<path d="${rr(-260, -54, 520, 96, 48)}" fill="#1b1550"/>${text(0, 22, "$" + Math.round(4 * swell * 1000).toLocaleString("en") + ",000,000", 60, P.green)}`, pop(a - 0.2));
  g += at(1300, 230, calPage("2017", "", 1, 140), 0.7, 6);
  if (a > 2.34) g += at(980, G - 420, text(0, 0, "?", 170, P.cream), pop(a - 2.34));
  return { g: night(c, tot, 55) + layer(skyline(73, -1200, 3400, G - 20, 100, 300, "#241a5c", "#ffb066"), c, 0.45) + layer(g, c) };
}

const SHOTS = [s0, s1, s2, s3];
export const c5s4Set = makeSet(SHOTS, V, P);
