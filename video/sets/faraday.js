// "The magnet" of electricity part 2 (how it is made): six shots, nothing to read but a year, a name plate and a wave.
//   0 a lamp-lit workbench, calendar 1831, plate FARADAY; a bar magnet slides past a copper wire and the electrons in
//     the wire jump (move a magnet past a wire and its electrons move)
//   1 the generator: the magnet spins inside a copper coil, the electrons in the coil rock back and forth, an AC wave
//     draws itself under it (a spinning magnet makes alternating current)
//   2 the same machine backwards: a battery feeds it and the shaft spins; a fan, a washing-machine drum and a car wheel
//     spin in turn (the motor is a generator run in reverse). Host right.
//   3 a small bookbinder's workshop at night: stacks of books, the press, one book opens and glows under a candle
//     (the bookbinder's boy who read what he bound)
//   4 the generator's shaft grows a giant fan of blades: the turbine (what turns the magnet)
//   5 pull back: three arches (steam, falling water, wind) each with its turbine on one long shaft into the generator;
//     each arch lights in turn (only what turns the turbine changes). Host left.
// Hand-overs go through the coil's copper or the gold of the magnet. Portrait versions are in faraday.v.js.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH, portrait } from "./kit.js";
import { P, E, mix, stars, skyline, pop, electron, battery, plate, kettle } from "./elec.js";
import { calPage, car, hills } from "./props.js";
import { V } from "./faraday.v.js";

const NIGHT = (c) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(23, 80, -800, 2800, 900, 0), c, 0.15);

// ---- the generator: a bar magnet spinning inside a copper coil (centre), coil radius R ----
// ang: the magnet's angle in radians; el: how visible the coil's electrons are; glow: gold ring
export const MAG = (len = 300, w = 90) => `${two(rr(-len / 2, -w / 2, len / 2, w, 14), P.red, P.redD, 0, 10)}${two(rr(0, -w / 2, len / 2, w, 14), "#9fb6c8", "#7890a5", 0, 10)}
  ${text(-len * 0.3, w * 0.22, "N", w * 0.62, "#fff")}${text(len * 0.3, w * 0.22, "S", w * 0.62, P.ink)}`;
export function gen(ang, o = {}) {
  const R = o.R ?? 230, el = o.el ?? 1, sway = Math.sin(ang * 2) * 0.32;   // electrons follow the magnet: back and forth
  const back = Array.from({ length: 9 }, (_, i) => `<ellipse cx="${-R * 0.06 * (i - 4)}" cy="0" rx="${R * 0.22}" ry="${R}" fill="none" stroke="${E.cuD}" stroke-width="${R * 0.07}" transform="translate(${(i - 4) * R * 0.07} 0)"/>`).join("");
  const ring = `<circle r="${R}" fill="none" stroke="${E.cuD}" stroke-width="${R * 0.2}"/><circle r="${R}" fill="none" stroke="${E.cu}" stroke-width="${R * 0.12}"/><circle r="${R * 1.06}" fill="none" stroke="${E.cuL}" stroke-width="${R * 0.03}" opacity=".6"/>`;
  const dots = el > 0 ? Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + sway; return at(R * Math.cos(a), R * Math.sin(a), electron(R * 0.075, { sign: false }), el); }).join("") : "";
  const glow = o.glow ? rings(0, 0, R * 1.25, P.gold, 0.22 * o.glow, 1.35) : "";
  const shaft = o.shaft ? `<path d="${rr(-o.shaft, -R * 0.07, o.shaft, R * 0.14, 6)}" fill="${P.steelD}"/>` : "";
  return glow + shaft + `<circle r="${R * 0.9}" fill="#0a2a3a"/>` + ring + dots + at(0, 0, MAG(R * 1.25, R * 0.36), 1, (ang * 180) / Math.PI) + disc(0, 0, R * 0.08, P.steel, P.steelD);
}
// a sine wave drawn left to right: p how much, x0..x1 at y, amplitude A, n cycles, moving with t
export const wave = (x0, x1, y, A, n, p, t = 0, c = P.gold, w = 10) => { let d = ""; const N = 120; for (let i = 0; i <= N; i++) { const q = i / N, x = lerp(x0, x1, q), yy = y - A * Math.sin(q * n * Math.PI * 2 - t * 4); d += (i ? "L" : "M") + x.toFixed(1) + " " + yy.toFixed(1); }
  return drawn(d, p, c, w, 'stroke-linejoin="round"'); };
// a turbine (centre of the hub), blades turning by `rot` degrees, radius r, `grow` 0..1 how far the blades are out
export const turbine = (rot, r = 260, grow = 1, c = "#9fb6c8", cD = "#7890a5") => { const L = r * grow; if (L <= 1) return "";
  const blades = Array.from({ length: 8 }, (_, i) => `<g transform="rotate(${rot + i * 45})">${two(`M-${L * 0.1} 0Q-${L * 0.2} -${L * 0.55} 0 -${L}Q${L * 0.22} -${L * 0.55} ${L * 0.1} 0Z`, c, cD, 0, 6)}</g>`).join("");
  return `<circle r="${L * 1.04}" fill="none" stroke="#2c5d73" stroke-width="${L * 0.06}"/>` + blades + disc(0, 0, r * 0.16, P.steel, P.steelD); };

// ---- 0: the workbench ----
const bench = (c, tot, glowA = 1) => NIGHT(c) + layer(`<rect x="-900" y="180" width="3700" height="1000" fill="#0f3b4f"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-700 + i * 520}" y="200" width="18" height="560" fill="#0b3142"/>`).join("") + `<circle cx="1500" cy="150" r="10" fill="${P.ink}"/>`, c, 0.6)
  + layer(`<path d="M1380 -200V40" stroke="${P.ink}" stroke-width="6"/><path d="M1300 40h160l-20 50h-120Z" fill="#183a4a"/>${rings(1380, 100, 120, "#ffe7a0", 0.18 * glowA, 1.6)}<path d="M1320 90L1180 760H1580L1440 90Z" fill="#ffe7a0" opacity="${(0.07 * glowA).toFixed(3)}"/>`
    + `<rect x="-900" y="760" width="3700" height="40" fill="${P.wood}"/><rect x="-900" y="800" width="3700" height="500" fill="${P.woodD}"/>`, c);
function s0(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 560, 1.15], [8.2, 960, 590, 1.25]]) : camAt(a, [[0, 960, 520, 1], [4.2, 960, 540, 1.08], [8.2, 960, 560, 1.16]]);
  // the wire across the bench with its electrons; the magnet slides past it on «حرّك» (4.47 .. 5.6); they jump on «تتحرك» (7.51)
  const Y = 640, x0 = 360, x1 = 1560, mx = kf(a, [[4.3, -300], [5.5, 900], [7.4, 1150]], ease), my = Y - 170;
  const jump = (i) => { const u = a - 6.0 - i * 0.03; return u > 0 ? Math.sin(u * 7 + i) * 26 * Math.exp(-Math.max(0, a - 7.6) * 0.6) + (a > 7.5 ? 36 * Math.sin(a * 10 + i) * spring(a - 7.5, 6, 10) * 0.6 : 0) : 0; };
  const dots = Array.from({ length: 14 }, (_, i) => { const x = x0 + 40 + i * 82, jx = jump(i); return at(x + jx, Y + 4 * Math.sin(tot * 3 + i), electron(20, { sign: false, glow: a > 6 ? 1 : 0 })); }).join("");
  const wireP = `<path d="M${x0 - 300} ${Y}H${x1 + 300}" stroke="${E.cuD}" stroke-width="54" stroke-linecap="round"/><path d="M${x0 - 300} ${Y - 6}H${x1 + 300}" stroke="${E.cu}" stroke-width="30" stroke-linecap="round"/>`;
  const magnet = a > 4.2 ? at(mx, my, MAG(380, 110), 1, 6 * Math.sin(a * 3)) + (a > 5.2 ? `<path d="M${mx - 260} ${my}h-80M${mx - 260} ${my + 30}h-50" stroke="#cfe6f0" stroke-width="8" stroke-linecap="round" opacity="${(1 - seg(a, 6.6, 7.2)).toFixed(2)}"/>` : "") : "";
  const cal = at(v ? 760 : 470, v ? -40 : 250, calPage("1831", "", 1, 150), pop(a - 0.34) * 0.9);
  const pl = at(v ? 1180 : 1380, v ? -40 : 300, plate("FARADAY", 64), pop(a - 2.8));
  const g = bench(c, tot) + layer(wireP + dots + magnet + cal + pl, c);
  return { g, out: toScreen(c, 960, Y), outC: E.cuD, outZ: 18 };
}

// ---- 1: the generator ----
function s1(a, tot) {
  const v = portrait(), cy = v ? 380 : 470, c = v ? camAt(a, [[0, 960, 600, 1.05], [7.6, 960, 640, 1.0]]) : camAt(a, [[0, 960, 540, 1.15], [4.6, 960, 560, 1.02], [7.6, 960, 590, 0.95]]);
  const ang = Math.max(0, a - 0.1) * 3.2 * clamp(a / 0.6), on = seg(a, 4.6, 4.9);
  const arrows = a > 3.5 ? [[-1, 3.59], [1, 4.15]].map(([d, t0]) => at(960 + d * 350, cy, `<path d="M${-d * 70} 0H${d * 50}" stroke="${E.el}" stroke-width="16" stroke-linecap="round"/><path d="M${d * 80} 0l${-d * 40} -32v64Z" fill="${E.el}"/>`, pop(a - t0) * (a < t0 ? 0 : 1) * (1 - seg(a, 5.5, 5.9)))).join("") : "";
  const wv = wave(v ? 660 : 560, v ? 1260 : 1360, v ? 980 : 880, 70, 3, seg(a, 6.5, 7.4), tot, P.gold, 14);
  const lbl = a > 6.6 ? at(v ? 960 : 1460, v ? 1110 : 880, text(0, 30, "AC", 90, P.gold), pop(a - 6.6)) : "";
  const g = NIGHT(c) + layer(at(960, cy, gen(ang, { R: 260, glow: on })) + arrows + wv + lbl, c);
  return { g, in: toScreen(c, 960, cy), inC: E.cuD, out: toScreen(c, 960, cy), outC: P.gold, outZ: 14 };
}

// ---- 2: the motor, and what runs on motors ----
const fanP = (rot) => `<path d="M0 0V170" stroke="#cfe6f0" stroke-width="16"/><path d="M-70 175h140" stroke="#cfe6f0" stroke-width="18" stroke-linecap="round"/><circle r="120" fill="none" stroke="#cfe6f0" stroke-width="8"/>${[0, 1, 2].map((i) => `<path d="M0 0Q-34 -60 0 -104Q34 -60 0 0Z" fill="#7fe7ff" transform="rotate(${rot + i * 120})"/>`).join("")}<circle r="16" fill="#cfe6f0"/>`;
const washer = (rot) => `${two(rr(-130, -150, 260, 300, 24), "#ece8ff", "#c6c0e6", 10, 8)}<path d="${rr(-110, -134, 220, 40, 10)}" fill="#c6c0e6"/><circle cy="30" r="88" fill="#16323f"/><circle cy="30" r="70" fill="#2f86d6"/>${[0, 1, 2].map((i) => `<path d="M0 30l0 -64" stroke="#9fd6ff" stroke-width="12" stroke-linecap="round" transform="rotate(${rot + i * 120} 0 30)"/>`).join("")}`;
const wheelCar = (rot) => at(0, 80, car(E.houseB, E.houseBD), 1.25) + `<g transform="translate(-102 80) rotate(${rot})">${[0, 1, 2, 3].map((i) => `<path d="M0 0L0 -22" stroke="#cfe6f0" stroke-width="6" transform="rotate(${i * 90})"/>`).join("")}</g>`;
function s2(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 560, 1], [7.36, 960, 560, 0.98]]) : camAt(a, [[0, 960, 520, 1.05], [2.6, 960, 520, 1.05], [7.36, 960, 500, 0.95]]);
  const spin = a > 2.73 ? (a - 2.73) * 6 * clamp((a - 2.73) / 0.4) : 0, feed = seg(a, 1.79, 2.4);
  const GX = v ? 960 : 760, GY = v ? 120 : 380;
  const bat = at(GX - (v ? 0 : 440), v ? GY + 520 : GY + 180, battery({ push: feed }), 0.8, v ? 0 : 0);
  const lead = v ? drawn(`M${GX} ${GY + 190}V${GY + 330}`, 1, E.cuD, 22) + drawn(`M${GX} ${GY + 190}V${GY + 330}`, feed, "#fff6c0", 10) : drawn(`M${GX - 440} ${GY - 135}V${GY - 200}H${GX - 200}`, 1, E.cuD, 22) + drawn(`M${GX - 440} ${GY - 135}V${GY - 200}H${GX - 200}`, feed, "#fff6c0", 10);
  const genG = at(GX, GY, gen(-spin, { R: 190, el: 1, glow: a > 2.73 ? 0.6 : 0 }));
  const items = [[3.22, fanP(spin * 60)], [3.9, washer(spin * 70)], [4.65, wheelCar(spin * 90)]];
  const pos = v ? [[760, 1020], [1180, 1020], [960, 1420]] : [[1260, 280], [1560, 280], [1380, 660]];
  const row = items.map(([t0, g], i) => (a > t0 ? at(pos[i][0], pos[i][1], `${rings(0, 0, 140, P.gold, 0.12 * (a > 5.75 ? 1 : 0.5), 1.3)}${g}`, pop(a - t0) * (i === 2 ? 0.85 : 1)) : "")).join("");
  const g = NIGHT(c) + layer(lead + bat + genG + row, c);
  return { g, in: toScreen(c, GX, GY), inC: P.gold };
}

// ---- 3: the bookbinder's workshop ----
const bookP = (cDark, w = 140, h = 34) => two(rr(-w / 2, -h, w, h, 6), cDark[0], cDark[1], 0, 6) + `<path d="M${-w / 2 + 10} ${-h + 6}h${w - 20}" stroke="${P.cream}" stroke-width="4" opacity=".6"/>`;
const BOOKC = [["#c75b3a", "#a2462c"], ["#2f86d6", "#215f9a"], ["#3ddc97", "#1fa86c"], ["#ffd04a", "#f09a1a"], ["#22c7b8", "#15988f"]];
function s3(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 560, 1.15], [6, 1000, 560, 1.3], [8.4, 1000, 560, 1.38]]) : camAt(a, [[0, 960, 520, 1], [4.4, 960, 540, 1.08], [6, 1060, 560, 1.4], [8.4, 1080, 560, 1.5]]);
  const shelves = [0, 1, 2].map((r) => `<rect x="-200" y="${120 + r * 170}" width="760" height="18" fill="${P.woodD}"/>` + Array.from({ length: 11 }, (_, i) => { const cc = BOOKC[(i * 3 + r) % 5]; return `<path d="${rr(-180 + i * 64 + (rnd(i + r * 11) * 8), 120 + r * 170 - 120 - rnd(i + r) * 30, 50, 120 + rnd(i + r) * 30, 6)}" fill="${cc[0]}"/>`; }).join("")).join("");
  const room = `<rect x="-900" y="-600" width="3700" height="1360" fill="#123d50"/><rect x="-900" y="760" width="3700" height="40" fill="${P.wood}"/><rect x="-900" y="800" width="3700" height="500" fill="${P.woodD}"/>` + shelves;
  // the press (left) and stacks of bound books growing on «كتب»
  const pressP = at(300, 760, `<path d="${rr(-120, -40, 240, 40, 8)}" fill="${P.steelD}"/><path d="${rr(-100, -360, 30, 320, 6)}${rr(70, -360, 30, 320, 6)}" fill="${P.steel}"/><path d="${rr(-130, -390, 260, 40, 10)}" fill="${P.woodD}"/><path d="M0 -350V-${200 - 40 * Math.sin(tot * 2)}" stroke="${P.steelD}" stroke-width="16"/><path d="${rr(-80, -(200 - 40 * Math.sin(tot * 2)), 160, 40, 6)}" fill="${P.wood}"/>`);
  const stack = (x, n0, t0) => { const n = Math.floor(clamp((a - t0) / 0.5) * n0); return at(x, 760, Array.from({ length: n }, (_, i) => at((i % 2 ? 6 : -4), -i * 34, bookP(BOOKC[(i + x) % 5]))).join("")); };
  const stacks = stack(600, 6, 3.6) + stack(780, 4, 3.9);
  // the candle and the one book that opens and glows on «بيقرا»
  const op = ease(seg(a, 4.7, 5.4)), glow = seg(a, 4.8, 5.6);
  const candle = at(1300, 760, `${rings(0, -170, 90, "#ffe7a0", 0.22, 1.5)}<path d="${rr(-18, -150, 36, 150, 6)}" fill="${P.cream}"/><path d="M0 -150q-16 -26 0 -58q16 32 0 58Z" fill="#ffcf6b" transform="scale(${1 + 0.06 * Math.sin(tot * 9)} 1)"/>`);
  const open = at(1080, 740, `${glow > 0 ? rings(0, -60, 200, "#ffe7a0", 0.25 * glow, 1.5) : ""}<g transform="scale(${lerp(0.5, 1, op).toFixed(3)} 1)"><path d="M0 -10Q-90 -40 -180 -14V30Q-90 4 0 30Z" fill="${P.cream}"/><path d="M0 -10Q90 -40 180 -14V30Q90 4 0 30Z" fill="#fffaec"/>
    ${op > 0.6 ? [0, 1, 2, 3].map((i) => `<path d="M${-160 + 8 * i} ${-6 + i * 9}h${120 - i * 10}M${30 + 8 * i} ${-6 + i * 9}h${120 - i * 10}" stroke="#dccaa0" stroke-width="5"/>`).join("") : ""}</g>${op < 0.9 ? at(0, 0, bookP(BOOKC[0], 180, 30), [1 - op, 1]) : ""}`);
  const pl = at(v ? 900 : 1500, v ? -20 : 120, plate("FARADAY", 56), pop(a - 0.05));
  const g = NIGHT(c) + layer(room + pressP + stacks + candle + open + pl, c);
  return { g, out: toScreen(c, 1080, 700), outC: "#ffe7a0", outZ: 14 };
}

// ---- 4: the turbine grows on the shaft ----
function s4(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 640, 1.1], [4.3, 960, 640, 0.95]]) : camAt(a, [[0, 1180, 500, 1.2], [2.6, 1050, 500, 1.0], [4.3, 1000, 500, 0.92]]);
  const GX = v ? 960 : 1360, GY = v ? 1000 : 500, TX = v ? 960 : 560, TY = v ? 260 : 500;
  const grow = ease(seg(a, 2.8, 3.6)), spin = a * 40 + Math.max(0, a - 3.5) * 220, ang = (spin * Math.PI) / 180;
  const shaft = v ? `<path d="${rr(GX - 18, TY, 36, GY - TY, 8)}" fill="${P.steelD}"/>` : `<path d="${rr(TX, GY - 18, GX - TX, 36, 8)}" fill="${P.steelD}"/>`;
  const q = a > 1.4 && a < 2.4 ? at(TX, TY, text(0, 50, "?", 200, P.gold), pop(a - 1.4) * (1 - seg(a, 2.1, 2.4))) : "";
  const ring = a > 3.6 ? rings(TX, TY, 320, P.gold, 0.18 * (1 - seg(a, 4.0, 4.3)), 1.2) : "";
  const g = NIGHT(c) + layer(shaft + ring + at(TX, TY, turbine(spin, 300, grow)) + q + at(GX, GY, gen(ang, { R: 170 })), c);
  return { g, in: toScreen(c, GX, GY), inC: P.gold, out: toScreen(c, TX, TY), outC: "#9fb6c8", outZ: 16 };
}

// ---- 5: three arches, one shaft ----
const steamFx = (t, on) => [0, 1, 2, 3].map((i) => { const q = ((t * 0.6 + i / 4) % 1); return `<circle cx="${-60 + q * 120}" cy="${80 - q * 200}" r="${30 + q * 40}" fill="#e8f3f6" opacity="${(0.55 * on * (1 - q)).toFixed(2)}"/>`; }).join("");
const waterFx = (t, on) => `<path d="M-90 -170h180v${120}" fill="none"/><rect x="-80" y="-180" width="160" height="200" fill="${E.water}" opacity="${(0.55 * on).toFixed(2)}"/>${[0, 1, 2].map((i) => `<path d="M${-60 + i * 60} -180v200" stroke="#cfe9ff" stroke-width="8" stroke-dasharray="30 30" stroke-dashoffset="${(-t * 300).toFixed(0)}" opacity="${on}"/>`).join("")}`;
const windFx = (t, on) => [0, 1, 2].map((i) => `<path d="M-130 ${-80 + i * 70}q60 -30 120 0t120 0" fill="none" stroke="#cfe6f0" stroke-width="10" stroke-linecap="round" stroke-dasharray="80 60" stroke-dashoffset="${(-t * 260).toFixed(0)}" opacity="${(0.8 * on).toFixed(2)}"/>`).join("");
function s5(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 640, 1.0], [6.3, 960, 660, 0.96]]) : camAt(a, [[0, 1100, 470, 1.25], [1.6, 1000, 470, 1.0], [6.3, 960, 460, 0.92]]);
  const spin = a * 120, ang = (spin * Math.PI) / 180;
  const pick = a < 4.24 ? -1 : a < 5.11 ? 0 : a < 5.38 ? 1 : 2;   // which arch is lit
  const pos = v ? [[960, -60], [960, 380], [960, 820]] : [[560, 470], [960, 470], [1360, 470]];
  const GX = v ? 960 : 1760, GY = v ? 1260 : 470;
  const fx = [steamFx, waterFx, windFx];
  const arches = pos.map(([x, y], i) => { const on = pick === -1 ? 0.55 : pick === i ? 1 : 0.25;
    return at(x, y, `<path d="M-180 200V-60A180 180 0 0 1 180 -60V200Z" fill="${mix("#0a2a3a", "#123f55", on)}" stroke="${mix("#2c5d73", P.gold, pick === i ? 1 : 0)}" stroke-width="10"/>${fx[i](tot, on)}${at(0, 40, turbine(spin, 120, 1), 1)}`); }).join("");
  const shaft = v ? `<path d="${rr(GX - 14, pos[0][1] + 40, 28, GY - pos[0][1] - 40, 8)}" fill="${P.steelD}"/>` : `<path d="${rr(pos[0][0], GY + 26, GX - pos[0][0], 28, 8)}" fill="${P.steelD}"/>`;
  const g = NIGHT(c) + layer(shaft + arches + at(GX, GY, gen(ang, { R: v ? 170 : 150, glow: a > 1.58 ? 0.5 : 0 })), c);
  return { g, in: toScreen(c, pos[0][0], pos[0][1]), inC: "#9fb6c8" };
}

export const SHOTS = [s0, s1, s2, s3, s4, s5];
export const faradaySet = makeSet(SHOTS, V, P);
