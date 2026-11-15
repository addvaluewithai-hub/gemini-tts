// "Current" (electricity part 1): twelve shots, one per board beat of the current scene. Nothing to read but units.
//   0 the copper wire cut open: free electrons milling about inside it
//   1 a battery slides up to the end of the wire and pushes: the electrons lean and drift
//   2 one circuit on a board: battery, bulb, knife switch; the wire draws itself round and back to where it began
//   3 the switch closes, the electrons go round, the bulb lights
//   4 inside the wire: one electron crawls ("< 1 mm/s") and the snail on top of the wire overtakes it
//   5 the circuit again: the push races round the whole loop in an instant (a streak of light)
//   6 a garden hose already full of water: the tap opens, a red drop goes in, at once a blue drop leaves the far end
//   7 the switch opens: every electron stops at once, the bulb goes dark
//   8 a bare piece of wire drops across the bulb: the electrons rush through it, the wire glows red and catches fire
//   9 the breaker panel on the house wall: one breaker trips by itself, the fire dies
//  10 copper (electrons roam: it conducts ✓) beside rubber (each electron held to its atom: it insulates ✗)
//  11 the bare wire puts on a rubber jacket, with buttons
// Shots 0, 1 and 4 are the same cut-open wire; 2, 3, 5, 7 and 8 the same circuit (battery left, bulb on top, switch below).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, drawn, at, check, cross, makeSet, FW, FH } from "./kit.js";
import { P, E, mix, house, stars, electron, nucleus, bulb, wire, battery, knife, breaker, snail, spark, tagV, pop } from "./elec.js";
import { V } from "./circuit.v.js";

// ---- helpers ----
// a polyline with its lengths, and the point at arc length s along it (wrapping round when closed)
const poly = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, L, len: L[L.length - 1] }; };
const ptOn = (pl, s, wrap = true) => { const n = pl.len; s = wrap ? ((s % n) + n) % n : clamp(s, 0, n); let i = 1; while (i < pl.L.length - 1 && pl.L[i] < s) i++;
  const p = (s - pl.L[i - 1]) / Math.max(1e-6, pl.L[i] - pl.L[i - 1]); return [lerp(pl.pts[i - 1][0], pl.pts[i][0], p), lerp(pl.pts[i - 1][1], pl.pts[i][1], p)]; };
const dOf = (pts) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join("L");
// distance covered by something that starts at t0, is up to speed v at t1 and keeps going
const move = (a, t0, t1, v) => (a <= t0 ? 0 : a < t1 ? (v * (a - t0) * (a - t0)) / (2 * (t1 - t0)) : v * ((t1 - t0) / 2 + a - t1));
const night = (c, tot, seed = 5) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 70, -400, 2400, 1100, tot), c, 0.15);
// a flame (base centre on y = 0), flickering with t
const flame = (t, k = 1) => { const f = 1 + 0.08 * Math.sin(t * 23) + 0.05 * Math.sin(t * 37), s = 0.06 * Math.sin(t * 17);
  return at(0, 0, `${rings(0, -70, 90, "#ff8a3c", 0.22, 1.5)}<path d="M-60 0Q-80 -60 -30 -120Q-20 -70 0 -170Q40 -90 30 -60Q60 -90 50 -140Q100 -60 60 0Z" fill="#ff8a3c"/><path d="M-30 0Q-40 -40 -10 -80Q0 -50 10 -100Q40 -50 30 0Z" fill="${P.gold}"/>`, [k * (1 + s), k * f]); };

// ---- the cut-open wire (shots 0, 1, 4) ----
const TX0 = 100, TX1 = 1820, TY = 560, TH = 470;
// the copper tube with its free electrons; drift moves them all along, pops makes them arrive one by one from `pin`
function wireWorld(t, tot, drift, o = {}) {
  const L = TX1 - TX0, n = 22, out = [];
  for (let i = 0; i < n; i++) {
    const base = (i / n) * L + rnd(i * 11) * 40, wob = Math.sin(tot * (1.1 + rnd(i) * 0.8) + i * 2) * 26;   // milling about: each one wanders on its own
    const x = TX0 + (((base + drift + wob) % L) + L) % L, y = TY + (rnd(i * 7 + 1) - 0.5) * TH * 0.62 + Math.sin(tot * 1.7 + i * 1.3) * 18;
    const k = o.pin === undefined ? 1 : pop(t - o.pin - rnd(i * 3) * 0.5);
    if (k > 0 && i !== o.skip) out.push(at(x, y, electron(26), k));
  }
  const id = "cwt";
  const shine = o.shine !== undefined ? `<path d="${rr(lerp(TX0 - 200, TX1, o.shine), TY - TH / 2 - 16, 160, 26, 12)}" fill="#fff" opacity="${(0.35 * Math.sin(Math.PI * clamp(o.shine))).toFixed(2)}"/>` : "";
  return `<path d="${rr(TX0 - 40, TY - TH / 2 - 26, L + 80, TH + 52, TH / 2 + 26)}" fill="${E.cuD}"/><path d="${rr(TX0 - 40, TY - TH / 2 - 26, L + 80, 40, 20)}" fill="${E.cu}"/><path d="${rr(TX0 - 40, TY + TH / 2 - 4, L + 80, 30, 15)}" fill="#8e4a20"/>${shine}
    <clipPath id="${id}"><path d="${rr(TX0 - 20, TY - TH / 2, L + 40, TH, TH / 2)}"/></clipPath><path d="${rr(TX0 - 20, TY - TH / 2, L + 40, TH, TH / 2)}" fill="#3a1a10"/>
    <g clip-path="url(#${id})">${Array.from({ length: 9 }, (_, i) => `<circle cx="${TX0 + 90 + i * 190}" cy="${TY + (i % 2 ? -70 : 70)}" r="20" fill="#5a2a18"/>`).join("")}${out.join("")}${o.inner || ""}</g>`;
}

// ---- the circuit on its board (shots 2, 3, 5, 7, 8) ----
// the path the electrons take: out of the battery's minus (bottom), along the bottom through the switch, up the right side,
// over the bulb, along the top and into the battery's plus
// The geometry lives in an object so that the Shorts can draw the same circuit tall (GV, used by circuit.v.js); the episode
// uses GL. `cam` maps a landscape camera onto the geometry; `bot` is the y of the bottom wire; `bump` the middle of the bulb's bump.
const mkGeo = (g) => ({ ...g, LOOP: poly(g.loop), SHORT: poly(g.short), ROUND: [...g.loop].reverse(),
  board: `${two(rr(...g.boardR, 44), "#0f3a55", "#0a2c42", 0, 14)}${g.screws.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#0a2c42"/>`).join("")}` });
export const GL = mkGeo({ BAT: [380, 860], BULB: [960, 300], HINGE: [860, 900], SW: 200, bot: 900, bump: [960, 380], br: [1300, 900], bm: [700, 900], barX: [840, 1080], barY: 384,
  loop: [[380, 860], [380, 900], [860, 900], [1060, 900], [1540, 900], [1540, 380], [1040, 380], [1040, 300], [880, 300], [880, 380], [380, 380], [380, 448]],
  short: [[380, 860], [380, 900], [860, 900], [1060, 900], [1540, 900], [1540, 380], [1040, 380], [880, 380], [380, 380], [380, 448]],
  W1: [[380, 860], [380, 900], [860, 900]], W2: [[1060, 900], [1540, 900], [1540, 380], [1040, 380], [1040, 300], [880, 300], [880, 380], [380, 380], [380, 448]],
  boardR: [230, 120, 1460, 880], screws: [[280, 170], [1640, 170], [280, 950], [1640, 950]], cam: (c) => c });
// tall: battery up the left side, the bulb on top, the switch on the bottom wire; the camera's landscape centre (960, 545) maps to (540, 760)
export const GV = mkGeo({ BAT: [230, 1250], BULB: [540, 360], HINGE: [440, 1290], SW: 200, bot: 1290, bump: [540, 440], br: [760, 1290], bm: [330, 1290], barX: [420, 660], barY: 444,
  loop: [[230, 1250], [230, 1290], [440, 1290], [640, 1290], [850, 1290], [850, 440], [620, 440], [620, 360], [460, 360], [460, 440], [230, 440], [230, 838]],
  short: [[230, 1250], [230, 1290], [440, 1290], [640, 1290], [850, 1290], [850, 440], [620, 440], [460, 440], [230, 440], [230, 838]],
  W1: [[230, 1250], [230, 1290], [440, 1290]], W2: [[640, 1290], [850, 1290], [850, 440], [620, 440], [620, 360], [460, 360], [460, 440], [230, 440], [230, 838]],
  boardR: [80, 130, 920, 1290], screws: [[130, 180], [950, 180], [130, 1370], [950, 1370]], cam: (c) => ({ x: c.x - 420, y: c.y + 215, z: c.z * 1.02 }) });
let GEO = GL;
export const withGeo = (g, fn) => { const keep = GEO; GEO = g; try { return fn(); } finally { GEO = keep; } };
// o: closed 0..1 (switch), lit 0..1, off: how far the electrons have gone, drawP: how much of the wire is drawn (undefined = all),
// short 0..1 (the bare wire across the bulb), hot 0..1 (the wire glowing red), pulse: a streak of light at 0..1 round the loop
function circuit(t, tot, o = {}) {
  const { BAT, BULB, HINGE, SW, LOOP, SHORT, W1, W2, ROUND, board } = GEO;
  const closed = o.closed ?? 1, lit = o.lit ?? 0, pl = o.short >= 1 ? SHORT : LOOP, n = Math.floor(pl.len / 64);
  let wires;
  if (o.drawP !== undefined) wires = drawn(dOf(ROUND), o.drawP, E.cuD, 26, 'stroke-linejoin="round"') + drawn(dOf(ROUND), o.drawP, E.cu, 13, 'stroke-linejoin="round"');
  else wires = wire(dOf(W1), 26) + wire(dOf(W2), 26);
  const hot = o.hot ? `<path d="${dOf(ROUND)}" fill="none" stroke="#ff4d2a" stroke-width="${16 + 10 * o.hot}" stroke-linejoin="round" opacity="${(0.85 * o.hot).toFixed(2)}"/><path d="${dOf(ROUND)}" fill="none" stroke="#ffb38a" stroke-width="6" stroke-linejoin="round" opacity="${(0.8 * o.hot).toFixed(2)}"/>` : "";
  let dots = "";
  if (o.dots !== false) for (let i = 0; i < n; i++) { const [x, y] = ptOn(pl, i * 64 + (o.off || 0) + 10);
    if (y === GEO.bot && x > HINGE[0] - 6 && x < HINGE[0] + SW + 6 && closed < 0.95) continue;
    dots += at(x, y, electron(19), o.dotK ?? 1); }
  const shortBar = o.short > 0 ? at(0, -260 * (1 - easeIn(clamp(o.short))), `<path d="M${GEO.barX[0]} ${GEO.barY}H${GEO.barX[1]}" stroke="${E.cuD}" stroke-width="40" stroke-linecap="round"/><path d="M${GEO.barX[0]} ${GEO.barY - 6}H${GEO.barX[1]}" stroke="${o.hot ? mix(E.cuL, "#ff5a2a", o.hot) : E.cuL}" stroke-width="20" stroke-linecap="round"/><circle cx="${GEO.barX[0]}" cy="${GEO.barY}" r="14" fill="${E.cuD}"/><circle cx="${GEO.barX[1]}" cy="${GEO.barY}" r="14" fill="${E.cuD}"/>`) : "";
  const glow = o.glow ? `<path d="${dOf(ROUND)}" fill="none" stroke="${P.gold}" stroke-width="${70}" stroke-linejoin="round" opacity="${(0.25 * o.glow).toFixed(2)}"/>` : "";
  const pulse = o.pulse !== undefined && o.pulse >= 0 && o.pulse <= 1.15 ? `<path d="${dOf(ROUND)}" pathLength="1" fill="none" stroke="#fffbe0" stroke-width="22" stroke-linecap="round" stroke-dasharray="0.16 1.2" stroke-dashoffset="${(0.16 - o.pulse * 1.16).toFixed(4)}"/><path d="${dOf(ROUND)}" pathLength="1" fill="none" stroke="${P.gold}" stroke-width="54" stroke-linecap="round" opacity=".35" stroke-dasharray="0.16 1.2" stroke-dashoffset="${(0.16 - o.pulse * 1.16).toFixed(4)}"/>` : "";
  return board + glow + wires + hot + shortBar + dots + pulse + at(HINGE[0], HINGE[1], knife(closed, SW)) + at(BULB[0], BULB[1], bulb(lit), 0.85) + at(BAT[0], BAT[1], battery({ push: o.push || 0 }), 1.05) + (o.extra || "");
}
const CC = (a, keys) => GEO.cam(camAt(a, keys || [[0, 960, 560, 0.97]]));

// ---- 0: the copper wire is full of free electrons ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.06], [2.37, 960, 560, 1.14]]);
  const g = night(c, tot) + layer(wireWorld(a, tot, 0, { pin: 1.2, shine: seg(a, 0.2, 1.1) }), c);
  return { g };
}
// ---- 1: something has to push them: the battery ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.14], [1.2, 800, 560, 0.95], [3.4, 610, 560, 0.86]]), k = 1.3, len = 392 * k;
  const slide = easeOut(seg(a, 1.5, 1.95)), bx = lerp(-900, TX0 - 60 - len, slide), push = seg(a, 1.96, 2.2) > 0 ? 1 - 0.6 * seg(a, 2.6, 3.4) : 0;
  const drift = move(a, 1.96, 2.5, 150), lean = a > 1.96 ? spring(a - 1.96, 7, 12) : 0;
  const ringsOut = a > 1.96 ? [0, 1, 2].map((i) => { const q = ((a - 1.96) * 1.4 + i / 3) % 1; return `<circle cx="${TX0 + q * 900}" cy="${TY}" r="${120 + q * 120}" fill="none" stroke="${P.gold}" stroke-width="10" opacity="${(0.5 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const bat = at(bx, TY, battery({ push }), k, 90);
  const g = night(c, tot) + layer(wireWorld(a, tot, drift + lean * 30) + ringsOut + bat, c);
  return { g, out: toScreen(c, bx + len - 60, TY), outC: P.gold, outZ: 18 };
}
// ---- 2: and a closed road that brings them back: the circuit ----
function s2(a, tot) {
  const { BAT, ROUND } = GEO, c = CC(a, [[0, 960, 590, 1.02], [3.5, 960, 560, 0.97]]), drawP = ease(seg(a, 0.3, 2.1));
  const tr = seg(a, 1.21, 2.04), arrowAt = ptOn(poly(ROUND), tr * poly(ROUND).len, false), last = ptOn(poly(ROUND), Math.max(0, tr * poly(ROUND).len - 30), false), ang = Math.atan2(arrowAt[1] - last[1], arrowAt[0] - last[0]) * 180 / Math.PI;
  const arrow = tr > 0 && tr < 1 ? at(arrowAt[0], arrowAt[1], `${rings(0, 0, 40, P.gold, 0.3)}<path d="M-30 -26L30 0L-30 26Z" fill="${P.gold}"/>`, 1.2, ang) : "";
  const home = a > 2.04 ? rings(BAT[0], BAT[1] - 20, 90 * spring(a - 2.04, 7, 12), P.gold, 0.35 * (1 - seg(a, 2.6, 3.0))) : "";
  const glow = a > 3.0 ? spring(a - 3.0, 6, 10) * (1 - 0.5 * seg(a, 3.3, 3.5)) : 0;
  const g = night(c, tot) + layer(circuit(a, tot, { closed: 0, drawP: drawP >= 1 ? undefined : drawP, dots: drawP >= 1, dotK: pop(a - 2.1), glow, extra: arrow + home }), c);
  return { g, in: toScreen(c, BAT[0], BAT[1] - 330), inC: P.gold, inZ: 18 };
}
// ---- 3: close the switch: the circuit is complete, the electrons move, the bulb lights ----
function s3(a, tot) {
  const { HINGE, SW } = GEO, c = CC(a, [[0, 960, 545, 0.95], [4.2, 960, 560, 1.0]]), closed = easeIn(seg(a, 0.3, 0.7)), clack = a > 0.7 ? rings(HINGE[0] + SW, HINGE[1], 70 * spring(a - 0.7, 8, 14), "#fff", 0.3 * (1 - seg(a, 0.9, 1.2))) : "";
  const glow = a > 1.06 ? Math.sin(Math.PI * seg(a, 1.06, 1.7)) : 0, off = move(a, 2.0, 2.6, 120), lit = ease(seg(a, 3.29, 3.6));
  const g = night(c, tot) + layer(circuit(a, tot, { closed, off, lit, glow, extra: clack }), c);
  return { g, out: toScreen(c, ...GEO.br), outC: E.cuD, outZ: 22 };
}
// ---- 4: the electron itself crawls; the snail overtakes it ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [1.5, 960, 540, 1.0], [2.4, 760, 520, 1.12], [4.3, 790, 520, 1.1], [5.52, 860, 520, 1.06]]);
  const ex = 700 + move(a, 2.08, 2.5, 9), sx = 380 + move(a, 1.6, 2.2, 130), top = TY - TH / 2 - 26;
  const me = at(ex, TY, electron(40, { glow: 1 + 0.3 * Math.sin(tot * 5) }), a > 1.51 ? 1 + 0.3 * pop(a - 1.51) : 1);
  const crawl = a > 2.34 ? [1, 2, 3].map((i) => `<circle cx="${ex - 40 - i * 30}" cy="${TY}" r="${8 - i * 2}" fill="${E.el}" opacity="${(0.5 - i * 0.12).toFixed(2)}"/>`).join("") : "";
  const tag = a > 3.0 ? at(ex, TY + TH / 2 + 100, tagV("< 1", "mm/s", { size: 76 }), pop(a - 3.0)) : "";
  const pass = a > 4.6 ? rings(sx + 40, top - 110, 150 * spring(a - 4.6, 7, 12), P.gold, 0.25 * (1 - seg(a, 5.0, 5.5))) : "";
  const g = night(c, tot) + layer(wireWorld(a, tot, a * 3, { skip: 9 }) + `<path d="M${TX0} ${top + 2}H${TX1}" stroke="${E.cuL}" stroke-width="6" opacity=".4"/>` + me + crawl + pass + at(sx, top + 4, snail(tot), 1.25) + tag, c);
  return { g, in: [960, 540], inC: E.cuD, inZ: 22, out: toScreen(c, ex, TY), outC: E.cuD, outZ: 22 };
}
// ---- 5: but the push goes round the whole loop at nearly the speed of light ----
function s5(a, tot) {
  const c = CC(a, [[0, 960, 545, 1.1], [3.57, 960, 545, 0.95]]), off = 40 + a * 120;
  const pulse = a > 1.1 && a < 3.4 ? ((a - 1.1) % 0.55) / 0.42 : -1;
  const g = night(c, tot) + layer(circuit(a, tot, { closed: 1, off, lit: 1, pulse }), c);
  return { g, in: toScreen(c, ...GEO.br), inC: E.cuD, inZ: 22, out: toScreen(c, GEO.BULB[0], GEO.BULB[1] - 200), outC: "#fff3b0", outZ: 16 };
}
// ---- 6: the hose is already full: open the tap, water comes out of the far end at once, not the water that went in ----
const hosePoly = (c1, c2) => { const pts = [];
  const cub = (q, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * q[0][k] + 3 * u * u * t * q[1][k] + 3 * u * t * t * q[2][k] + t * t * t * q[3][k]); };
  for (let i = 0; i <= 40; i++) pts.push(cub(c1, i / 40)); for (let i = 1; i <= 30; i++) pts.push(cub(c2, i / 30)); return poly(pts); };
// the garden of shot 6: landscape (HL), and tall for the Shorts (HV: the hose hangs down from the tap and its nozzle points left)
const HL = { HOSE: hosePoly([[420, 450], [420, 900], [880, 930], [1000, 770]], [[1000, 770], [1100, 630], [1220, 560], [1380, 560]]), NOZ: [1380, 560], LAND: [1430, 880], dir: 1,
  nozzle: "M1350 518h70l24 -14v112l-24 -14h-70Z", tap: [410, 400], wallX: -600, wallW: 1000, wallH: 1400, rows: 12, grassY: 960, grassH: 400, grassX: -600,
  keys: [[0, 960, 690, 1.12], [5.6, 950, 690, 1.15], [6.5, 720, 690, 1.25], [6.95, 760, 690, 1.22], [7.6, 1180, 720, 1.22], [8.18, 1200, 720, 1.24]] };
export const HV = { HOSE: hosePoly([[300, 450], [300, 760], [810, 560], [810, 860]], [[810, 860], [810, 1060], [640, 1090], [540, 1090]]), NOZ: [540, 1090], LAND: [330, 1330], dir: -1,
  nozzle: "M570 1048h-70l-24 -14v112l24 -14h70Z", tap: [290, 400], wallX: -800, wallW: 1030, wallH: 2400, rows: 24, grassY: 1360, grassH: 1200, grassX: -800,
  keys: [[0, 540, 820, 1.14], [5.6, 540, 820, 1.16], [6.5, 420, 620, 1.26], [6.95, 430, 640, 1.22], [7.6, 450, 1090, 1.18], [8.18, 450, 1110, 1.2]] };
let HG = HL;
export const withHose = (h, fn) => { const keep = HG; HG = h; try { return fn(); } finally { HG = keep; } };
function s6(a, tot) {
  const { HOSE, NOZ, LAND, dir } = HG, c = camAt(a, HG.keys);
  const show = 1, fill = seg(a, 2.2, 2.7), open = ease(seg(a, 2.98, 3.3)), flowing = move(a, 3.25, 3.45, 70);
  const n = Math.floor(HOSE.len / 64), drops = [];
  const exit = a > 4.15 ? clamp((a - 4.15) / 0.55) : 0;
  for (let i = 0; i < n; i++) { const s = i * 64 + 32 + flowing; if (i === n - 1) continue; if (s > HOSE.len) continue; if (i / n > fill) continue; const [x, y] = ptOn(HOSE, s, false); drops.push(at(x, y, disc(0, 0, 28, E.water, E.waterD))); }
  // the drop that was waiting at the end: it is the one that comes out
  const lastS = (n - 1) * 64 + 32; let blue = "";
  if (fill >= 1 || a > 2.7) { const p0 = ptOn(HOSE, Math.min(HOSE.len, lastS), false), arc = [lerp(p0[0], LAND[0], exit), lerp(p0[1], LAND[1], easeIn(exit)) - 160 * Math.sin(Math.PI * exit)];
    const hl = a > 6.96 ? pop(a - 6.96) : 0; blue = (hl > 0 ? rings(arc[0], arc[1], 70 * hl, P.gold, 0.35) : "") + at(arc[0], arc[1], disc(0, 0, 30, E.water, E.waterD), exit > 0 ? 1.3 : 1); }
  // the red drop that goes in at the tap: still near the start when the blue one is out
  const red = a > 3.3 ? (() => { const [x, y] = ptOn(HOSE, move(a, 3.3, 3.5, 70), false), hl = a > 5.83 ? pop(a - 5.83) : 0; return (hl > 0 ? rings(x, y, 70 * hl, "#fff", 0.3) : "") + at(x, y, disc(0, 0, 30, P.red, P.redD), pop(a - 3.3)); })() : "";
  const stream = a > 4.3 ? Array.from({ length: 6 }, (_, i) => { const q = ((a * 1.6 + i / 6) % 1); return `<circle cx="${lerp(NOZ[0] + 30 * dir, LAND[0] - 20 * dir, q)}" cy="${lerp(NOZ[1], LAND[1], q * q) - 120 * Math.sin(Math.PI * q) * 0.6}" r="12" fill="${E.water}" opacity=".7"/>`; }).join("") + `<ellipse cx="${LAND[0]}" cy="${LAND[1] + 30}" rx="${60 * seg(a, 4.6, 5.6)}" ry="14" fill="${E.waterD}" opacity=".7"/>` : "";
  const hose = at(0, 0, `<path d="${dOf(HOSE.pts)}" fill="none" stroke="#1f8a4c" stroke-width="104" stroke-linecap="round" stroke-linejoin="round"/><path d="${dOf(HOSE.pts)}" fill="none" stroke="#3ddc97" stroke-width="86" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/><path d="${dOf(HOSE.pts)}" fill="none" stroke="#0a2c42" stroke-width="74" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`)
    + drops.join("") + red + blue + `<path d="${HG.nozzle}" fill="${P.steelD}"/>`;
  const wall = `${two(rr(HG.wallX, -200, HG.wallW, HG.wallH, 0), E.houseA, E.houseAD, -14, 0)}${Array.from({ length: HG.rows }, (_, r) => Array.from({ length: 6 }, (_, k) => `<rect x="${HG.wallX + 40 + k * 160 + (r % 2) * 80}" y="${-180 + r * 90}" width="150" height="80" rx="6" fill="${E.houseAD}" opacity=".35"/>`).join("")).join("")}`;
  const [tx, ty] = HG.tap, tap = `<path d="${rr(tx - 40, ty + 20, 80, 60, 12)}" fill="${P.steel}"/><path d="${rr(tx - 80, ty, 50, 100, 10)}" fill="${P.steelD}"/><g transform="translate(${tx} ${ty}) rotate(${(-90 * open).toFixed(1)})"><path d="${rr(-60, -14, 120, 28, 14)}" fill="${P.red}"/><circle r="16" fill="${P.redD}"/></g>`;
  const grass = `<rect x="${HG.grassX}" y="${HG.grassY}" width="${3200 - HG.grassX - 600}" height="${HG.grassH}" fill="${E.hill}"/>`;
  const g = night(c, tot, 9) + layer(grass + wall + tap + at(0, 0, hose, [1, show > 0 ? 1 : 0]) + stream, c);
  return { g, in: toScreen(c, 1100, 640), inC: "#fff3b0", inZ: 16, out: toScreen(c, LAND[0], LAND[1] - 20), outC: E.water, outZ: 20 };
}
// ---- 7: open the switch: the circuit is cut, everything stops, in the whole wire at once ----
function s7(a, tot) {
  const { HINGE, SW, LOOP } = GEO, c = CC(a, [[0, 1000, 600, 1.1], [2.9, 980, 580, 1.05], [4.2, 960, 545, 0.92], [4.67, 960, 545, 0.92]]);
  const closed = 1 - ease(seg(a, 0.45, 0.85)), stop = 1.15, off = 60 + 120 * Math.min(a, stop), lit = 1 - ease(seg(a, 1.1, 1.3));
  const zap = a > 0.8 && a < 1.1 ? spark([HINGE[0] + SW - 40, HINGE[1] - 50], [HINGE[0] + SW + 10, HINGE[1] - 10], seg(a, 0.8, 0.9)) : "";
  const freeze = a > 3.95 ? Math.sin(Math.PI * seg(a, 3.95, 4.5)) : 0, frozen = freeze > 0 ? Array.from({ length: Math.floor(LOOP.len / 64) }, (_, i) => { const [x, y] = ptOn(LOOP, i * 64 + off + 10); return y === GEO.bot && x > HINGE[0] && x < HINGE[0] + SW ? "" : `<circle cx="${x}" cy="${y}" r="${24 + 14 * freeze}" fill="none" stroke="#fff" stroke-width="5" opacity="${(0.7 * freeze).toFixed(2)}"/>`; }).join("") : "";
  const g = night(c, tot) + layer(circuit(a, tot, { closed, off, lit, extra: zap + frozen }), c);
  return { g, in: toScreen(c, ...GEO.bm), inC: E.water, inZ: 20 };
}
// ---- 8: a shortcut with no bulb: everything rushes through it, the wire heats up and catches fire ----
function s8(a, tot) {
  const shake = a > 5.3 ? 10 * Math.exp(-(a - 5.3) * 5) * Math.sin((a - 5.3) * 60) : 0;
  const c = CC(a, [[0, 1030, 560, 0.98], [3.5, 1030, 540, 1.05], [6.18, 1010, 480, 1.2]]); c.x += shake;
  const sh = easeIn(seg(a, 1.0, 1.24)), lit = 1 - ease(seg(a, 1.6, 2.1)), off = 40 + a * 90 + move(a, 2.5, 2.9, 420), hot = ease(seg(a, 3.82, 4.4));
  const [bx, by] = GEO.bump, land = a > 1.24 ? rings(bx, by, 80 * spring(a - 1.24, 8, 14), "#fff", 0.3 * (1 - seg(a, 1.4, 1.7))) : "";
  const fire = a > 4.6 ? at(bx, by - 10, flame(tot, 1.3 * pop(a - 4.6, 6, 10))) : "";
  const boom = a > 5.3 ? [0, 1, 2, 3, 4, 5].map((i) => spark([bx, by - 20], [bx + 170 * Math.cos(i * 1.05), by - 20 + 170 * Math.sin(i * 1.05)], seg(a, 5.3, 5.45) * (1 - seg(a, 5.7, 6.0)), i + 3)).join("") : "";
  const g = night(c, tot) + layer(circuit(a, tot, { closed: 1, lit, off, short: sh >= 1 ? 1 : sh, hot, extra: land + fire + boom }), c);
  return { g, out: toScreen(c, bx, by - 120), outC: "#ff8a3c", outZ: 18 };
}
// ---- 9: so every house has a breaker that cuts it by itself when the current is too much ----
function s9(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.12], [3.91, 960, 560, 1.0]]), trip = a > 1.88 ? clamp(spring(a - 1.88, 9, 16)) : 0, cool = ease(seg(a, 2.0, 2.7));
  const wall = `<rect x="-600" y="-400" width="3200" height="2000" fill="${E.houseB}"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${-600 + i * 380}" y="-400" width="190" height="2000" fill="${E.houseBD}" opacity=".25"/>`).join("")}`;
  const panel = `${two(rr(620, 250, 680, 600, 30), P.steel, P.steelD, 12, 10)}<path d="${rr(660, 330, 600, 480, 18)}" fill="#0a2c42"/>
    ${at(960, 300, `${two("M-46 10L0 -30L46 10Z", E.houseA, E.houseAD, 0, 4)}<path d="${rr(-32, 8, 64, 34, 4)}" fill="${E.houseA}"/>`, 1)}
    ${[0, 1, 2, 3].map((i) => at(760 + i * 133, 580, breaker(i === 1 ? trip : 0), 1.3)).join("")}`;
  const hotW = mix("#ff4d2a", E.cu, cool), cable = `<path d="M1300 450H1520Q1600 450 1600 370V250" fill="none" stroke="${E.cuD}" stroke-width="30"/><path d="M1300 450H1520Q1600 450 1600 370V250" fill="none" stroke="${hotW}" stroke-width="16"/>`;
  const fire = cool < 1 ? at(1600, 262, flame(tot, 1.1 * (1 - cool))) : "";
  const smoke = a > 2.3 ? [0, 1, 2].map((i) => { const q = clamp((a - 2.3 - i * 0.2) / 1.4); return q > 0 ? `<circle cx="${1600 + 30 * Math.sin(q * 4 + i)}" cy="${240 - q * 260}" r="${24 + q * 40}" fill="#9fb3c4" opacity="${(0.45 * (1 - q)).toFixed(2)}"/>` : ""; }).join("") : "";
  const click = a > 1.88 ? rings(893, 580, 110 * spring(a - 1.88, 8, 14), "#fff", 0.3 * (1 - seg(a, 2.1, 2.4))) : "";
  const g = layer(wall + cable + fire + smoke + panel + click, c);
  return { g, in: toScreen(c, 1600, 220), inC: "#ff8a3c", inZ: 18, out: toScreen(c, 1450, 450), outC: E.cu, outZ: 20 };
}
// ---- 10: two kinds of stuff: copper lets its electrons go (it conducts), rubber holds them (it insulates) ----
const slab = (x, y, w, h, c, cD, inner, id) => `${two(rr(x, y, w, h, 36), c, cD, 0, 16)}<clipPath id="${id}"><path d="${rr(x + 24, y + 24, w - 48, h - 48, 24)}"/></clipPath><path d="${rr(x + 24, y + 24, w - 48, h - 48, 24)}" fill="${mix(cD, "#000", 0.25)}"/><g clip-path="url(#${id})">${inner}</g>`;
// shot 10's layout: side by side in the episode (ML), one above the other in a Short (MV)
const ML = { CX: 440, CY: 230, RX: 1100, RY: 230, keys: [[0, 750, 530, 1.12], [4.2, 750, 530, 1.12], [5.0, 1060, 525, 0.95], [8.0, 1070, 525, 0.93]] };
export const MV = { CX: 230, CY: 150, RX: 230, RY: 1000, keys: [[0, 540, 520, 1.12], [4.2, 540, 520, 1.12], [5.0, 540, 900, 0.95], [8.0, 540, 910, 0.93]] };
let MG = ML;
export const withSlabs = (m, fn) => { const keep = MG; MG = m; try { return fn(); } finally { MG = keep; } };
function s10(a, tot) {
  const c = camAt(a, MG.keys);
  const CX = MG.CX, CW = 620, RX = MG.RX, RW = 620, Y = MG.CY, RY = MG.RY, H = 610;
  const flowV = move(a, 2.65, 3.3, 160);
  let cu = ""; for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) cu += at(CX + 130 + k * 120, Y + 120 + r * 125, nucleus(24, { sign: false }));
  for (let i = 0; i < 14; i++) { const x = CX + 40 + ((((rnd(i * 5) * (CW - 80)) + flowV + 40 * Math.sin(tot * (1 + rnd(i)) + i)) % (CW - 80)) + (CW - 80)) % (CW - 80), y = Y + 60 + rnd(i * 5 + 2) * (H - 120) + 30 * Math.sin(tot * 1.4 + i * 2);
    cu += at(x, y, electron(22), pop(a - 1.3 - rnd(i) * 0.4)); }
  let ru = ""; const grip = a > 6.58 ? pop(a - 6.58) : 0;
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { const ax = RX + 130 + k * 120, ay = RY + 120 + r * 125, ang = tot * 3 + r + k, ex = ax + 38 * Math.cos(ang), ey = ay + 38 * Math.sin(ang);
    ru += `<circle cx="${ax}" cy="${ay}" r="38" fill="none" stroke="${E.el}" stroke-width="4" opacity="${(0.25 + 0.5 * grip).toFixed(2)}"/>` + at(ax, ay, nucleus(22, { sign: false })) + at(ex, ey, electron(19), pop(a - 5.97 - (r * 4 + k) * 0.03) || (a > 4.4 ? 1 : 0)); }
  const copper = slab(CX, Y, CW, H, E.cu, E.cuD, cu, "slcu"), rubber = a > 4.39 ? at(RX + RW / 2, RY + H / 2, at(-RX - RW / 2, -RY - H / 2, slab(RX, RY, RW, H, "#3a2f6a", E.rubber, ru, "slru") + Array.from({ length: 7 }, (_, i) => `<path d="M${RX + 40 + i * 74} ${RY}l30 -26l30 26Z" fill="#3a2f6a"/>`).join("")), pop(a - 4.39)) : "";
  const arrow = a > 3.26 ? at(CX + CW / 2, Y + H + 70, `<path d="M-150 0H120" stroke="${E.el}" stroke-width="18" stroke-linecap="round"/><path d="M110 -34L160 0L110 34Z" fill="${E.el}"/>`, pop(a - 3.26)) : "";
  const g = night(c, tot, 13) + layer(copper + rubber + arrow + (MG === ML ? check(CX + CW / 2, Y - 70, 54, P.green, a - 3.67) : check(CX + CW + 30, Y + 60, 54, P.green, a - 3.67)) + (MG === ML ? cross(RX + RW / 2, RY - 70, 54, P.red, a - 7.34) : cross(RX + RW + 30, RY + 60, 54, P.red, a - 7.34)), c);
  return { g, in: toScreen(c, CX + CW / 2, Y + H / 2), inC: E.cu, inZ: 20, out: toScreen(c, RX + RW / 2, RY + H / 2), outC: E.rubber, outZ: 20 };
}
// ---- 11: that's why every wire wears a jacket ----
// shot 11's wire: across the frame in the episode (JL), down it in a Short (JV); q: the two cubic pieces, ends: where the bare strands stick out
const JL = { q: [[[120, 600], [500, 380], [760, 760], [1100, 560]], [[1100, 560], [1440, 360], [1600, 420], [1800, 520]]], keys: [[0, 960, 545, 1.12], [2.44, 960, 535, 1.2]], rot: [0, 0] };
export const JV = { q: [[[540, 200], [300, 520], [800, 640], [560, 960]], [[560, 960], [320, 1280], [780, 1380], [540, 1640]]], keys: [[0, 540, 920, 1.0], [2.44, 540, 900, 1.06]], rot: [90, 90] };
let JG = JL;
export const withJacket = (j, fn) => { const keep = JG; JG = j; try { return fn(); } finally { JG = keep; } };
const jPath = (j) => `M${j.q[0][0].join(" ")}C${j.q[0][1].join(" ")} ${j.q[0][2].join(" ")} ${j.q[0][3].join(" ")}C${j.q[1][1].join(" ")} ${j.q[1][2].join(" ")} ${j.q[1][3].join(" ")}`;
function s11(a, tot) {
  const c = camAt(a, JG.keys), d = JG === JL ? "M120 600C500 380 760 760 1100 560S1600 420 1800 520" : jPath(JG), wrap = ease(seg(a, 0.5, 1.75));
  const jacket = `<path d="${d}" pathLength="1" fill="none" stroke="${P.redD}" stroke-width="96" stroke-linecap="round" stroke-dasharray="${(0.88 * wrap).toFixed(4)} 2" stroke-dashoffset="-0.06"/><path d="${d}" pathLength="1" fill="none" stroke="${P.red}" stroke-width="70" stroke-linecap="round" stroke-dasharray="${(0.88 * wrap).toFixed(4)} 2" stroke-dashoffset="-0.06" transform="translate(-4 -7)"/>`;
  const buttons = [0.3, 0.5, 0.7].map((p, i) => { const pt = bezPt(p); return at(pt[0], pt[1], disc(0, 0, 30, P.gold, P.goldD) + `<circle cx="-8" cy="-7" r="5" fill="${P.goldD}"/><circle cx="8" cy="7" r="5" fill="${P.goldD}"/>`, pop(a - 1.81 - i * 0.12)); }).join("");
  const strands = (x, y, s, rot = 0) => at(x, y, [-1, 0, 1].map((k) => `<path d="M0 0l${s * 46} ${k * 14}" stroke="${E.cuL}" stroke-width="8" stroke-linecap="round"/>`).join(""), 1, rot);
  const [p0, p1] = [JG.q[0][0], JG.q[1][3]];
  const g = night(c, tot, 17) + layer(wire(d, 54) + strands(p0[0], p0[1], -1, JG.rot[0]) + strands(p1[0], p1[1], 1, JG.rot[1]) + jacket + buttons, c);
  return { g, in: toScreen(c, ...(JG === JL ? [300, 520] : [540, 400])), inC: E.rubber, inZ: 20 };
}
// points on the jacket's curve (two cubic pieces: M120 600 C500 380 760 760 1100 560, then S: 1440 360 1600 420 1800 520)
const bezPt = (p) => { const cub = (q, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * q[0][k] + 3 * u * u * t * q[1][k] + 3 * u * t * t * q[2][k] + t * t * t * q[3][k]); };
  return p < 0.5 ? cub(JG.q[0], p * 2) : cub(JG.q[1], p * 2 - 1); };

export const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11];
export const circuitSet = makeSet(SHOTS, V, P);
