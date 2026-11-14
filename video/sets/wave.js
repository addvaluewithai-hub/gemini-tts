// "Two kinds of current" (electricity part 1): four shots, nothing to read but DC, AC, Hz and numbers.
//   0 a battery and the copper wire cut open: two markers (two kinds), the first wins; the electrons start to flow one way,
//     arrows run along the wire, a river comes in below flowing the same way, the battery glows, DC
//   1 the same wire: the electrons start going and coming in place; a saw comes in on a log below and goes back and forth
//     with them; AC
//   2 two counters roll to 50 and to 60 in one second, the electrons under each shuttle; a globe between them, its lands
//     in the two colours: it depends on the country
//   3 the old bulb, big: lit; the electrons run along its glowing wire one way, then back, and the wire glows each time;
//     the saw cuts the log on both strokes (host right)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, makeSet, FW, FH } from "./kit.js";
import { P, E, mix, stars, electron, tube, battery, bulb } from "./elec.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const sky = () => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>`;
const word = (w, size, fill, t, t0, step = 0.07) => { const n = w.length, cw = size * 0.56; return [...w].map((ch, i) => { const u = t - t0 - i * step; return u > 0 ? at((i - (n - 1) / 2) * cw, 0, text(0, size * 0.36, ch, size, fill), [1, pop(u)]) : ""; }).join(""); };
const marker = (n, on) => `${on > 0 ? rings(0, 0, 80 * on, P.gold, 0.22) : ""}${disc(0, 0, 58, P.gold, P.goldD)}${text(0, 28, String(n), 80, "#8a5200")}`;
// chevrons along y between x0 and x1, pointing dir (+1 right, -1 left), sliding with `off`
const chevrons = (x0, x1, y, dir, off, o = 1, c = P.gold) => { let s = ""; const gap = 160; for (let x = x0 + (((off % gap) + gap) % gap); x < x1; x += gap) s += `<path d="M${x - dir * 24} ${y - 30}L${x + dir * 18} ${y}L${x - dir * 24} ${y + 30}" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity="${o.toFixed(2)}"/>`; return s; };
// a handsaw (blade centre at 0, 0), teeth down, handle on the right
const saw = () => `${two("M-330 -60L250 -80V40L-330 40Z", "#dfe6f5", "#aab4d4", 0, 8)}<path d="M-330 40${Array.from({ length: 22 }, (_, i) => `l13 26l13 -26`).join("")}" fill="#aab4d4"/><circle cx="-280" cy="-20" r="10" fill="#aab4d4"/>
  ${two("M240 -110H360Q420 -110 420 -40V40Q420 90 360 90H240Z", "#c4581e", "#9a4214", 0, 8)}<path d="${rr(290, -60, 80, 90, 30)}" fill="${P.ink}"/>`;
// a log lying down (centre), 520 long; cut 0..1 is how deep the notch is
const log = (cut = 0, nx = 0) => `${two(rr(-260, -90, 520, 180, 70), "#a86a3a", "#84502a", 0, 12)}<ellipse cx="-260" cy="0" rx="40" ry="90" fill="#e8b47a"/><ellipse cx="-260" cy="0" rx="22" ry="54" fill="none" stroke="#c48a52" stroke-width="7"/>
  ${cut > 0 ? `<path d="M${nx - 10} -92h20v${(170 * clamp(cut)).toFixed(1)}h-20Z" fill="${P.ink}"/>` : ""}`;
// sawdust falling from (x, y) at times when the blade moves: n crumbs
const dust = (x, y, t, amount) => amount <= 0 ? "" : Array.from({ length: 10 }, (_, i) => { const q = (t * 1.6 + i / 10) % 1; return `<rect x="${(x + (rnd(i) - 0.5) * 120 + (rnd(i + 3) - 0.5) * 80 * q).toFixed(1)}" y="${(y + q * 260).toFixed(1)}" width="10" height="10" rx="2" fill="#e8b47a" opacity="${(amount * (1 - q)).toFixed(2)}"/>`; }).join("");

// ---- 0: direct, one way like a river ----
const TY = 440, TX0 = 420, TX1 = 1820, TH = 180;
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 520, 0.98], [1.19, 960, 520, 0.98], [1.7, 1060, 470, 1.12], [5.0, 1080, 470, 1.12], [5.7, 1000, 560, 0.98], [9.49, 980, 560, 1.0]]);
  const go = a > 1.94 ? (a - 1.94) * 150 - 40 * (1 - Math.exp(-(a - 1.94) * 3)) : 0;   // gets going with a little wind-up
  const wire = tube(TX0, TX1, TY, TH, tot, go, { n: 18, r: 32 });
  const arrows = a > 2.76 ? chevrons(TX0 + 40, TX1 - 40, TY + 170, 1, go, seg(a, 2.76, 3.1)) : "";
  const b = at(230, 640, battery({ push: a > 7.1 ? 0.5 + 0.5 * Math.sin((a - 7.1) * 8) : 0 }), 0.75 * pop(a - 0.05, 7, 12)) + `<path d="M310 ${TY}H${TX0 - 20}" stroke="${E.cuD}" stroke-width="40"/>`;
  // two kinds: two markers, the second steps aside on «الأول»
  const m1x = lerp(860, 230, ease(seg(a, 1.19, 1.7))), m1y = lerp(220, 220, 1), aside = ease(seg(a, 1.19, 1.6));
  const marks = at(m1x, m1y, marker(1, seg(a, 0.57, 0.9)), pop(a - 0.57) * lerp(1, 0.8, aside)) + (aside < 1 ? at(1060 + 600 * aside, 220, marker(2, 0), pop(a - 0.75) * (1 - aside)) : "");
  // the river, rising in below on «زي النهر»
  const rv = ease(seg(a, 5.21, 5.8)), RY = 760;
  const river = rv > 0 ? `<path d="M-400 ${RY + 200 * (1 - rv)}H2400V1400H-400Z" fill="#0d4a6a"/><path d="M-400 ${RY + 200 * (1 - rv)}H2400V${RY + 22 + 200 * (1 - rv)}H-400Z" fill="#1f7aa0"/>`
    + Array.from({ length: 12 }, (_, i) => { const x = ((i * 230 + go * 1.1) % 2600) - 400; return `<path d="M${x} ${RY + 70 + (i % 3) * 50 + 200 * (1 - rv)}h90" stroke="#5fd6ff" stroke-width="9" stroke-linecap="round" opacity="${(0.6 * rv).toFixed(2)}"/>`; }).join("") : "";
  const dc = a > 8.6 ? at(1120, 200, (a > 8.6 ? rings(0, -10, 200, P.gold, 0.14 * pop(a - 8.6)) : "") + word("DC", 210, P.gold, a, 8.6) + `<path d="M-180 110H180" stroke="${P.gold}" stroke-width="18" stroke-linecap="round" opacity="${seg(a, 8.8, 9.0).toFixed(2)}"/>`) : "";
  const ground = `<rect x="-400" y="${RY}" width="2800" height="600" fill="${P.ground}"/>`;
  const g = sky() + layer(stars(51, 90, -300, 2300, 700, tot), c, 0.2) + layer(ground + river + b + wire + arrows + marks + dc, c);
  return { g, out: toScreen(c, 1120, 200), outC: P.gold, outZ: 14 };
}

// ---- 1: alternating, back and forth like a saw ----
const swing = (a, t0, f = 1.1, amp = 70) => a < t0 ? 0 : amp * Math.min(1, (a - t0) / 0.5) * Math.sin(2 * Math.PI * f * (a - t0));
function s1(a, tot) {
  const c = camAt(a, [[0, 1040, 460, 1.12], [4.3, 1040, 470, 1.12], [5.0, 980, 560, 0.98], [6.9, 980, 540, 1.0]]);
  const sw = swing(a, 0.61), wire = tube(TX0, TX1, TY, TH, tot, sw, { n: 18, r: 32 });
  const dir = Math.cos(2 * Math.PI * 1.1 * (a - 0.61)) > 0 ? 1 : -1, arrows = a > 3.62 ? chevrons(TX0 + 40, TX1 - 40, TY + 170, dir, sw, seg(a, 3.62, 3.9)) : "";
  const gen = at(230, 640, `${two(rr(-120, -300, 240, 300, 30), "#2f8fb0", "#1f6d8c", 12, 0)}${disc(0, -150, 80, P.steel, P.steelD)}<path d="M-50 -150q25 -50 50 0t50 0" fill="none" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/>`, 0.9) + `<path d="M330 ${TY}H${TX0 - 20}" stroke="${E.cuD}" stroke-width="40"/>`;
  // the saw on a log, moving with the electrons
  const sa = a - 4.6, LX = 1100, LY = 830, cut = clamp((a - 4.9) / 2.5) * 0.35;
  const sawG = sa > 0 ? at(LX + 120 + sw * 2.2, LY - 130 + 140 * (1 - easeOut(clamp(sa / 0.35))) * 0 - 600 * (1 - easeOut(clamp(sa / 0.35))), saw()) : "";
  const logG = sa > -0.2 ? at(LX, LY, log(cut, 0), pop(sa + 0.2, 7, 12)) + dust(LX, LY - 60, tot, sa > 0.4 ? 0.8 : 0) : "";
  const ac = a > 6.2 ? at(1600, 200, rings(0, -10, 200, P.gold, 0.14 * pop(a - 6.2)) + word("AC", 210, P.gold, a, 6.2) + drawn("M-200 110q50 -70 100 0t100 0t100 0t100 0", seg(a, 6.4, 6.8), P.gold, 18)) : "";
  const g = sky() + layer(stars(53, 90, -300, 2300, 700, tot), c, 0.2) + layer(`<rect x="-400" y="920" width="2800" height="600" fill="${P.ground}"/>` + gen + wire + arrows + logG + sawG + ac, c);
  return { g, in: toScreen(c, 1100, TY), inC: P.gold, inZ: 14, out: toScreen(c, 1100, TY), outC: E.cuD, outZ: 14 };
}

// ---- 2: fifty or sixty times a second, by country ----
const meter = (x, n, t0, a, tot, col, colD, f) => { const u = a - t0, v = Math.round(lerp(0, n, clamp(u / 1.0)));
  const dial = `${rings(0, 0, 200, col, u > 0 ? 0.12 : 0)}${disc(0, 0, 170, col, colD)}<circle r="130" fill="${P.ink}"/>${number(0, 30, String(Math.max(0, v)), 130, col)}`;
  const sh = u > 0 ? 50 * Math.sin(2 * Math.PI * f * a) : 0;
  return at(x, 380, dial, pop(a, 7, 12)) + tube(x - 260, x + 260, 760, 110, tot, sh, { n: 7, r: 22 }) + at(x, 920, text(0, 30, "Hz", 90, col), pop(u - 0.4)); };
const globeTwo = (r, tot) => { const id = "wg"; const land = [[-0.5, -0.3, 0.32, 0.22, 0], [-0.2, 0.3, 0.2, 0.3, 0], [0.35, -0.2, 0.36, 0.26, 1], [0.45, 0.35, 0.22, 0.16, 1], [-0.1, -0.55, 0.2, 0.1, 1], [0.05, 0.0, 0.14, 0.14, 0]];
  return `${rings(0, 0, r * 1.15, "#5fd6ff", 0.12)}<clipPath id="${id}"><circle r="${r}"/></clipPath>${disc(0, 0, r, "#1d5f86", "#164a6a", 0.06)}<g clip-path="url(#${id})">${land.map(([x, y, w, h, k]) => { const xx = ((x + tot * 0.03 + 1.5) % 2) - 1; return `<ellipse cx="${(xx * r).toFixed(1)}" cy="${y * r}" rx="${w * r}" ry="${h * r}" fill="${k ? "#ffd04a" : "#5fd6ff"}"/>`; }).join("")}</g>`; };
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.06], [3.85, 960, 560, 1.0]]);
  const left = meter(420, 50, 0.98, a, tot, "#5fd6ff", "#2a9fd6", 2.5), right = meter(1500, 60, 1.73, a, tot, P.gold, P.goldD, 3.0);
  const gl = a > 3.0 ? at(960, 440, globeTwo(170, tot), pop(a - 3.0, 7, 12)) : "";
  const g = sky() + layer(stars(57, 80, -300, 2300, 900, tot), c, 0.2) + layer(left + right + gl, c);
  return { g, in: toScreen(c, 420, 760), inC: E.cuD, inZ: 14, out: toScreen(c, 420, 380), outC: P.ink, outZ: 14 };
}

// ---- 3: the bulb lights both ways; the saw cuts both ways ----
const BX = 620, BY = 1000, BK = 2.15;
const FIL = (p) => { const x = lerp(-150, 150, p), y = -20 * 0 + 46 * Math.sin(p * Math.PI * 6); return [BX + x, BY - 238 * BK + y]; };
function s3(a, tot) {
  const c = camAt(a, [[0, 700, 520, 1.15], [5.6, 760, 520, 1.1], [6.1, 960, 540, 1.0], [7.57, 980, 540, 1.02]]);
  const on = ease(seg(a, 0.45, 0.8)), f = 0.55, ph = Math.sin(2 * Math.PI * f * (a - 2.6)), moving = a > 2.6 ? 1 : 0;
  const heat = 0.55 + 0.45 * Math.abs(Math.cos(2 * Math.PI * f * (a - 2.6))) * moving;
  let d = ""; for (let i = 0; i <= 60; i++) { const q = FIL(i / 60); d += `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }
  const filament = `<path d="${d}" fill="none" stroke="#c4581e" stroke-width="30" stroke-linejoin="round" opacity="${(0.35 + 0.5 * heat * on).toFixed(2)}"/><path d="${d}" fill="none" stroke="${mix("#8a7ab8", "#ff5a1a", heat * on)}" stroke-width="14" stroke-linejoin="round"/>`;
  const els = moving ? [0, 1, 2, 3].map((i) => { const q = FIL(clamp(0.12 + i * 0.25 + 0.1 * ph)); return at(q[0], q[1], electron(20)); }).join("") : "";
  const dir = Math.cos(2 * Math.PI * f * (a - 2.6)) > 0 ? 1 : -1, arr = moving ? at(BX, BY - 238 * BK - 150, `<path d="M${-60 * dir} 0H${60 * dir}M${30 * dir} -30L${60 * dir} 0L${30 * dir} 30" fill="none" stroke="${P.ink}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`) : "";
  const theBulb = at(BX, BY, bulb(on), BK) + filament + els + arr;
  // the saw on the log: each stroke deepens the cut and drops dust, both ways
  const sa = a - 5.8, LX = 1260, LY = 440, st = sa > 0 ? Math.sin(2 * Math.PI * 0.9 * sa) : 0, cut = clamp(sa / 1.6) * 0.6, speed = Math.abs(Math.cos(2 * Math.PI * 0.9 * sa));
  const sawPart = sa > -0.3 ? at(LX, LY, log(cut, 0), pop(sa + 0.3, 7, 12)) + (sa > 0 ? at(LX + 120 + 140 * st, LY - 150 + 150 * cut * 0.5 - 500 * (1 - easeOut(clamp(sa / 0.3))), saw()) : "") + dust(LX, LY - 40, tot, sa > 0.3 ? speed : 0) : "";
  const g = sky() + layer(stars(59, 80, -300, 2300, 900, tot), c, 0.2) + layer(theBulb + sawPart, c);
  return { g, in: toScreen(c, BX, BY - 238 * BK), inC: P.ink, inZ: 14 };
}

const SHOTS = [s0, s1, s2, s3];
export const waveSet = makeSet(SHOTS, [], P);
