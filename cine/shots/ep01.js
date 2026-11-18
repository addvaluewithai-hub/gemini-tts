// Peek · Episode 1 · GRAVITY (about 54 s). Timing comes from out/ep01.json (audio/ep01_sound.py).
//  Cold open (0 - 10.3): the capsule hits a roof; Peek climbs out with no hat; "Relax, Commander."; he steps off the
//    edge and floats in slow motion ("On my planet... we float."); "Uh-oh."; the dumpster; he comes up wearing the hat.
//  Report (10.3 - tag): from inside the dumpster, then pictures on a space board with Peek in the corner.
//  Tag: Agent Crowe at the capsule. "It's here."  End card: the next question.
import { MOUTHS } from "../lib/peek.js";
import * as fx from "../lib/fx.js";
import * as N from "../sets/night.js";
import * as X from "../lib/explain.js";
import { K, PY, F, blend, ants, say, lv, blink, blinks, peek, night, finish, rainBack, roof, PANIC, BLISS, DREAD, AWE, DEADPAN } from "../lib/act.js";

const { seg, lerp, ease, easeOut, easeIn, easeOutBack, kf, clamp, spring, pulse, noise, W, H } = fx;
export const ENV = "out/ep01.json";
export const DUR = 54.5;
export const duration = (env) => (env ? env.dur : DUR);
const CAP_X = 2100, FLOAT_X = N.EDGE + 330, FLOAT_Y = 1210;
const caps = (env, t, o) => (env ? X.captions(env.words, t, o) : "");

// ============================================================ COLD OPEN
function arrive(t, env) {                                   // 0 - 1.3: the capsule comes down
  let c = fx.camera(t, [[0, 2040, 700, 0.8, -5], [0.95, 2090, 1215, 0.92, 0], [1.3, 2095, 1225, 0.95, 0]], easeIn);
  const hit = t - 1.0;
  c = fx.shake(c, t, hit > 0 ? 70 * Math.exp(-hit * 6) : 3 + t * 6, 2, 16);
  const [ex, ey] = fx.toScreen(c, CAP_X, N.FLOOR - 120), u = clamp(t / 1.0), px = lerp(-260, ex, u ** 1.4), py = lerp(-420, ey, u ** 1.4);
  const dx = ex + 260, dy = ey + 420, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, tail = 760 * (0.4 + u);
  const comet = hit < 0 ? `<defs><linearGradient id="cometg" gradientUnits="userSpaceOnUse" x1="${px}" y1="${py}" x2="${px - ux * tail}" y2="${py - uy * tail}"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".15" stop-color="#ff9fd0" stop-opacity=".9"/><stop offset="1" stop-color="#ff4fa3" stop-opacity="0"/></linearGradient></defs>
    ${fx.blurred(`<path d="M${px} ${py} L${px - ux * tail} ${py - uy * tail}" stroke="url(#cometg)" stroke-width="64" stroke-linecap="round"/>`, 10)}
    <path d="M${px} ${py} L${px - ux * tail * 0.7} ${py - uy * tail * 0.7}" stroke="url(#cometg)" stroke-width="22" stroke-linecap="round"/>${fx.glow(px, py, 220, "#ffd0ea", 1)}<circle cx="${px}" cy="${py}" r="26" fill="#fff"/>` : "";
  const dust = hit > 0 ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = Math.PI * (0.08 + 0.84 * fx.rnd(i * 5)), v = 500 + 500 * fx.rnd(i * 3), x = CAP_X - Math.cos(a) * v * hit * (i % 2 ? 1 : -1), y = N.FLOOR - Math.sin(a) * v * hit + 1500 * hit * hit;
    return `<path d="M${x - 16} ${y + 10} L${x - 8} ${y - 12} L${x + 14} ${y - 8} L${x + 18} ${y + 12} Z" fill="#3d4780"/>`; }).join("")
    + `<ellipse cx="${CAP_X}" cy="${N.FLOOR - 10}" rx="${200 + 900 * easeOut(hit / 0.5)}" ry="${50 + 150 * easeOut(hit / 0.5)}" fill="#aab6ff" opacity="${(0.4 * (1 - clamp(hit / 0.5))).toFixed(2)}"/>` : "";
  const plane = hit > 0 ? `<g transform="translate(${CAP_X} ${N.FLOOR + 30})">${N.crater()}<g transform="rotate(-9) scale(1.25) translate(0 ${-30 + 40 * Math.exp(-hit * 12)})">${N.capsule(0, 1)}</g></g>${dust}` : "";
  return [...roof(c, t, t, { plane, hut: false, far: 1.5 }), comet, fx.impact(ex, ey + 80, seg(hit, 0, 0.3), { color: "#ffd0ea" }), fx.flash(hit > 0 ? Math.exp(-hit * 12) : 0, "#ffe3f1"), ...finish(t, t, { warm: 0.1 })];
}

function hatch(t, env) {                                    // 1.3 - 4.2: he climbs out
  const c = fx.shake(fx.camera(t, [[1.3, CAP_X + 10, 1290, 1.5, 0], [2.9, CAP_X + 30, 1280, 1.62, 0], [3.4, CAP_X + 170, 1275, 1.42, 0], [4.2, CAP_X + 230, 1270, 1.4, 0]]), t, 3, 4, 2);
  const open = easeOutBack(seg(t, 1.45, 1.72)), up = easeOutBack(seg(t, 1.6, 1.98));
  const hop = seg(t, 2.92, 3.36), out = hop > 0, arc = Math.sin(hop * Math.PI);
  const px = out ? lerp(CAP_X - 4, CAP_X + 268, ease(hop)) : CAP_X - 4, py = out ? lerp(N.FLOOR + 30 - 150, PY, hop) - arc * 210 : N.FLOOR + 30 - 150 + (1 - up) * 330;
  const land = spring(t - 3.36, 8, 24), radioOn = lv(env, "commander", t);
  const scan = kf(t, [[1.9, 0], [2.15, -0.85], [2.5, -0.85], [2.75, 0.9], [2.92, 0.9], [3.4, 0.2], [4.2, 0.6]]);
  let e = t < 2.45 ? AWE : blend(AWE, F("eyeroll"), seg(t, 2.45, 2.62) * (1 - seg(t, 2.85, 2.95)));
  if (t >= 3.2) e = blend(AWE, F("smug", { lid: 0.42 }), seg(t, 3.2, 3.36));
  e = ants(say({ ...e, look: scan * 0.6, lid: Math.max(e.lid, blink(t, [2.3, 3.9])) }, lv(env, "peek", t)), 10 * radioOn * Math.sin(t * 40) + land * 20, -10 * radioOn * Math.sin(t * 40) - land * 20);
  const o = { hat: false, filter: night("Lh", [{ color: "#ff9fd0", az: 90, power: 1.2, size: 12 }, { color: "#9fd0ff", az: 315, power: 0.9, size: 8 }], [0.9, 0.74, 0.98], 0.02),
    turn: t < 3.3 ? scan : 0.2, nod: t > 2.45 && t < 2.9 ? -0.4 : 0, shadow: out && hop >= 1, bounce: 0, squash: 1 - Math.max(0, land) * 0.1 + arc * 0.08,
    legL: out && hop < 1 ? { y: -40 * arc, rot: -18 } : null, legR: out && hop < 1 ? { y: -30 * arc, rot: 18 } : null,
    armR: t > 3.42 ? { x: lerp(770, 905, easeOutBack(seg(t, 3.42, 3.62))), y: lerp(760, 560, easeOut(seg(t, 3.42, 3.62))) + Math.sin(t * 16) * 12 } : (out && hop < 1 ? { x: 900, y: 600 } : null),
    armL: out && hop < 1 ? { x: 300, y: 600 } : null };
  const k = 0.6, tips = [-1, 1].map((s) => [px + s * 162 * k, py + (90 - 1010) * k]);
  const radio = radioOn > 0.05 ? tips.map(([x, y]) => fx.glow(x, y, 60 + 60 * radioOn, "#ffe66d", 0.8 * radioOn) + `<circle cx="${x}" cy="${y}" r="${30 + ((t * 2.4) % 1) * 70}" fill="none" stroke="#ffe66d" stroke-width="5" opacity="${(0.7 * (1 - ((t * 2.4) % 1))).toFixed(2)}"/>`).join("") : "";
  const smoke = [0, 1, 2, 3, 4].map((i) => { const a = ((t * 0.55 + i * 0.2) % 1); return `<ellipse cx="${CAP_X - 150 + i * 70 + Math.sin(t + i) * 20}" cy="${N.FLOOR - 40 - a * 420}" rx="${50 + a * 90}" ry="${36 + a * 60}" fill="#c9d2ff" opacity="${(0.2 * (1 - a) * (1 - seg(t, 2.6, 4))).toFixed(3)}"/>`; }).join("");
  const capG = (part) => `<g transform="translate(${CAP_X} ${N.FLOOR + 30}) rotate(-9) scale(1.25)">${N.capsule(open, 0.55 * (1 - seg(t, 1.3, 3.5)), part)}</g>`;
  const plane = `<g transform="translate(${CAP_X} ${N.FLOOR + 30})">${N.crater()}</g>` + capG("back") + (out ? capG("front") + peek(e, o, px, py, k) : peek(e, o, px, py, k) + capG("front")) + smoke + radio;
  return [...roof(c, t, t, { plane, hut: false, far: 2 }), fx.flash(pulse(t, 1.45, 1.6, 0.03) * 0.25, "#ffe3f1"), ...finish(t, t, { warm: 0.12, vig: 0.7 }), caps(env, t, { y: 1500 })];
}

function toEdge(t, env) {                                   // 4.2 - 4.8: three smug steps to the edge
  const u = seg(t, 4.2, 4.72), px = lerp(CAP_X + 268, N.EDGE - 30, u), ph = u * Math.PI * 3;
  const c = fx.shake(fx.camera(t, [[4.2, px + 120, 1260, 1.05, 0], [4.8, N.EDGE - 40, 1250, 1.15, -2]]), t, 4, 6, 6);
  const e = ants({ ...F("smug", { lid: 0.85 }), m: { ...MOUTHS.smug, tongue: 0 } }, 8 + Math.sin(ph * 2) * 8, 8 - Math.sin(ph * 2) * 8);
  const o = { hat: false, filter: night("Le", [{ color: "#cfe3ff", az: 315, power: 1.2, size: 9 }], [0.88, 0.74, 0.98], 0.02), turn: 0.9, nod: -0.5, sway: 4, bounce: Math.abs(Math.sin(ph)) * 22,
    legL: { x: 40 * Math.cos(ph), y: -50 * Math.max(0, Math.sin(ph)), rot: 18 * Math.sin(ph) }, legR: { x: -40 * Math.cos(ph), y: -50 * Math.max(0, -Math.sin(ph)), rot: -18 * Math.sin(ph) },
    armL: { x: 440 + 40 * Math.cos(ph), y: 790 }, armR: { x: 780 - 40 * Math.cos(ph), y: 790 } };
  return [...roof(c, t, t, { plane: N.footprints(CAP_X + 300, px - 30, PY + 14, 0.5) + peek(e, o, px, PY), hut: false, far: 1.4 }), ...finish(t, t, { warm: 0.08 })];
}

function float(t, env) {                                    // 4.8 - 8.0: the float, the look down, the drop
  const slow = t < 7.2, wt = 4.8 + (t - 4.8) * (slow ? 0.07 : 1);
  const rise = easeOut(seg(t, 4.8, 5.6)), drift = Math.sin((t - 4.8) * 1.3) * 10;
  const px = FLOAT_X + (t - 4.8) * 18, py = FLOAT_Y - rise * 90 + drift;
  const drop = seg(t, 7.78, 8.0), fall = easeIn(drop) * 2400;
  const c = slow ? fx.shake(fx.camera(t, [[4.8, px - 40, py - 440, 1.0, -7], [7.2, px, py - 420, 1.38, 4]]), t, 3, 7, 1.2)
    : fx.shake(fx.camera(t, [[7.2, px, py - 400, 2.1, 0], [7.7, px, py - 392, 2.3, 0], [8.0, px, py - 340, 2.0, 0]]), t, 3 + drop * 26, 7, 8);
  const open1 = seg(t, 7.23, 7.32), down = seg(t, 7.34, 7.44), open2 = seg(t, 7.44, 7.52);
  let e;
  if (slow) e = say({ ...BLISS, squint: 0.2 + 0.15 * Math.sin(t * 2) }, lv(env, "peek", t) * 0.9);
  else { e = blend({ ...BLISS }, DREAD, open2); e.lidL = lerp(1, 0, open2); e.lidR = lerp(1, 0, open1); e.lid = 0; e.lookY = down; e.look = 0; e.pupil = lerp(1, 0.45, down); e.sweat = seg(t, 7.45, 8) * 0.8; e = say(e, lv(env, "peek", t)); }
  e = ants(e, Math.sin(t * 1.7) * 5 - (slow ? 0 : open2 * 40 - drop * 80), Math.sin(t * 1.7 + 1) * 5 - (slow ? 0 : open2 * 40 - drop * 80));
  const spread = slow ? easeOutBack(seg(t, 4.8, 5.3)) : 1 - open2 * 0.35;
  const o = { hat: false, filter: night("Lf", [{ color: "#cfe3ff", az: 225, power: 1.7, size: 10 }, { color: "#cfe3ff", az: 315, power: 1.5, size: 10 }, { color: "#ff7ac0", az: 90, power: 0.5, size: 14 }], [0.88, 0.78, 1.0], 0.03),
    shadow: false, tilt: slow ? -4 + Math.sin(t * 1.1) * 2 : 0, squash: 1 + drop * 0.32, nod: slow ? -0.25 : down * 0.9,
    armL: { x: lerp(430, 268, spread), y: lerp(760, 610 + (slow ? 0 : open2 * 60) - drop * 190, spread) }, armR: { x: lerp(770, 932, spread), y: lerp(760, 610 + (slow ? 0 : open2 * 60) - drop * 190, spread) },
    legL: { x: -16, y: 10 + Math.sin(t * 1.5) * 5, rot: 26 }, legR: { x: 16, y: 16 + Math.sin(t * 1.5 + 0.8) * 5, rot: -22 } };
  const moon = { x: 540 + (px - 540) * 0.04 + 10, y: 900 + (py - 440 - 960) * 0.04 - 60, r: 430 };
  const sparkle = Array.from({ length: 70 }, (_, i) => { const x = fx.rnd(i * 3) * W, y = ((fx.rnd(i * 7) * H + wt * 420) % H), tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i));
    return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="2.6" ry="9" fill="#dfeaff" opacity="${(0.55 * tw).toFixed(2)}"/>`; }).join("");
  const poof = drop > 0 ? [0, 1, 2, 3, 4].map((i) => `<ellipse cx="${px + Math.cos(i * 1.3) * (60 + 160 * drop)}" cy="${py - 330 + Math.sin(i * 1.3) * (40 + 90 * drop)}" rx="${60 * (1 - drop * 0.5)}" ry="${44 * (1 - drop * 0.5)}" fill="#dfe6ff" opacity="${(0.5 * (1 - drop)).toFixed(2)}"/>`).join("") : "";
  return [fx.layer(N.sky(moon), c, 0.04), fx.layer(N.cityFar(), c, 0.12, { blur: 3 }), fx.layer(N.cityMid(), c, 0.3, { blur: 2.4 }), fx.fog(t, { y: 1500, o: 0.3 }),
    fx.layer(N.cityNear(), c, 0.55, { blur: 1.6 }), fx.layer(N.acrossAlley(), c, 0.9, { blur: 1 }), slow ? sparkle : rainBack(wt, 8, 1),
    fx.layer(N.roofBack() + N.roofFloor() + poof + peek(e, o, px, py + fall), c, 1),
    slow ? fx.glow(540, 880, 760, "#bcd0ff", 0.22) : fx.blurred(fx.speedLines(t, { angle: 90, o: 0.5 * drop, n: 22 }), 2),
    ...finish(t, wt, { streak: slow ? 0.06 : 1, o: slow ? 0.5 : 0.3, vig: slow ? 0.5 : 0.7, grade: ["#2a3cc0", 0.26], warm: slow ? 0.16 : 0 }),
    fx.flash(pulse(t, 4.8, 5.02, 0.04) * 0.55), fx.bars(slow ? ease(seg(t, 4.8, 5.1)) : 1 - seg(t, 7.2, 7.3), 120), caps(env, t, { y: slow ? 1560 : 1640 })];
}

// ---- the dumpster: where he lands, where he finds the hat, and where he files the report from
const PEEL = (slide = 0) => (slide >= 1 ? "" : `<g transform="translate(${392 - slide * 60} ${196 + slide * 700}) rotate(${-14 + slide * 200})"><path d="M0 0 C-26 22 -40 60 -30 96 C-14 70 -4 40 6 8 Z" fill="#f2d14b"/><path d="M4 0 C36 14 62 44 66 84 C42 66 22 40 2 10 Z" fill="#e6c13a"/><path d="M0 -4 C-4 -30 8 -52 22 -62 C20 -40 14 -18 8 2 Z" fill="#f7dc62"/><circle cx="4" cy="0" r="9" fill="#8a6a1a"/></g>`);
const DUMP_CAM = { x: 540, y: 1250, z: 1.42, rot: 0 };
function dumpsterPeek(t, env, e, o, { rise = 1, lid = 0.12, cam = DUMP_CAM, peel = 0, extra = "", extraFront = "", grade = {} } = {}) {
  const k = 0.9, py = 1772 + (1 - rise) * 520;
  const f = night("Ld", [{ color: "#ffb866", az: 320, power: 1.5, size: 10 }, { color: "#9fd0ff", az: 200, power: 0.8, size: 9 }], [0.92, 0.78, 0.92], 0.02);
  const back = lid < 0.55;
  const inner = N.alley() + (back ? N.dumpsterLid(lid) : "") + N.dumpsterBack() + extra + peek(e, { filter: f, shadow: false, hatExtra: PEEL(peel), ...o }, 540, py, k) + N.dumpster(lid, 0, false) + (back ? "" : N.dumpsterLid(lid)) + extraFront;
  return [fx.layer(inner, cam, 1), ...finish(t, t, { vig: 0.66, grade: ["#3a2a90", 0.22], warm: 0.12, o: 0.2, ...grade })];
}
function alleyFall(t, env) {                                // 8.0 - 10.3: the crash, then the hat
  const u = t - 8.0, hitT = 0.4, hit = u - hitT;
  if (t < 8.95) {
    const y = u < hitT ? -700 + 2200 * (u / hitT) ** 1.6 : 1500, lid = hit > 0.06 ? easeIn(seg(hit, 0.06, 0.14)) : 0, sq = hit > 0 ? Math.exp(-hit * 9) * Math.cos(hit * 30) : 0;
    const c = fx.shake({ x: 540, y: 1020, z: 1.02, rot: 0 }, t, hit > 0 ? 60 * Math.exp(-hit * 7) : 5, 11, 14);
    const e = ants({ ...PANIC, lookY: 1, m: { ...MOUTHS.o, w: 0.7, jaw: 1, tongue: 0 } }, -60, -60);
    const o = { hat: false, filter: night("L6", [{ color: "#ffb866", az: 320, power: 1.6, size: 10 }], [0.9, 0.74, 0.88]), shadow: false, squash: 1.35, armL: { x: 330, y: 440 }, armR: { x: 870, y: 440 }, legL: { y: -30, rot: -20 }, legR: { y: -30, rot: 20 } };
    const debris = hit > 0 ? [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = -Math.PI / 2 + (fx.rnd(i * 3) - 0.5) * 2.2, v = 900 + fx.rnd(i * 7) * 700, x = 540 + Math.cos(a) * v * hit, yy = 1400 + Math.sin(a) * v * hit + 1900 * hit * hit;
      return `<ellipse cx="${x}" cy="${yy}" rx="${22 + i * 3}" ry="${15 + i * 2}" fill="#0b0b12"/>`; }).join("") : "";
    return [fx.layer(N.alley() + N.dumpsterBack() + (u < hitT + 0.04 ? peek(e, o, 540, y, 0.86) : "") + N.dumpster(lid, sq) + debris, c, 1), u < hitT ? fx.blurred(fx.speedLines(t, { angle: 90, o: 0.45, n: 24 }), 2) : "",
      fx.impact(540, 1380, seg(hit, 0, 0.32)), fx.flash(hit > 0 ? Math.exp(-hit * 16) * 0.85 : 0), ...finish(t, t, { vig: 0.7, grade: ["#3a2a90", 0.25], warm: 0.12 })];
  }
  const rise = easeOutBack(seg(t, 8.98, 9.4)), cam = fx.camera(t, [[8.95, 540, 1020, 1.02, 0], [9.5, 540, 1240, 1.36, 0], [10.3, 540, 1250, 1.42, 0]]);
  const e = ants({ ...DEADPAN, lid: Math.max(0.5, blink(t, [9.75])), look: kf(t, [[9.4, 0], [9.9, 0], [10.0, -0.7], [10.3, -0.7]]) }, -8, -8);
  const title = `<g opacity="${seg(t, 9.45, 9.6)}">${X.label(540, 1560, "FIELD REPORT #1", 70, "#ffe66d", 1, 1)}${X.label(540, 1700, "GRAVITY", 150, "#fff", 1, lerp(1.25, 1, easeOut(seg(t, 9.5, 9.7))))}</g>`;
  return [...dumpsterPeek(t, env, e, { armL: null, armR: null }, { rise, lid: lerp(1, 0.12, easeOut(seg(t, 8.98, 9.3))), cam }), fx.glow(540, 760, 420, "#ffd27a", 0.25 * pulse(t, 9.3, 9.7, 0.15)), title];
}

// ============================================================ THE REPORT
const TALK = F("neutral", { lid: 0.3, browL: -0.1, browR: 0.3 });
function corner(t, env, face = TALK, o = {}) {              // Peek small in the corner of a board, talking
  const e = ants(say({ ...face, lid: Math.max(face.lid, blinks(t, 2.9)), look: face.look ?? 0.5, lookY: face.lookY ?? -0.4 }, lv(env, "peek", t)), Math.sin(t * 2) * 3, Math.sin(t * 2 + 1) * 3);
  return peek(e, { shadow: false, turn: 0.45, tilt: Math.sin(t * 1.7) * 1.5, bob: Math.sin(t * 3.1) * 3 + lv(env, "peek", t) * -4, ...o }, 255, 2140, 0.66);
}
const boardFrame = (t, env, inner, face, o) => [X.board(t), inner, fx.vignette(0.45), corner(t, env, face, o), fx.grain(t, 0.07), caps(env, t)];
const popIn = (t, at, d = 0.3) => easeOutBack(seg(t, at, at + d));
const B = (env, k) => env.beats[k];

function rDumpster(t, env) {                                // "Commander. Field report number one ... Apples. Cups. Me."
  const b = env.beats, peel = seg(t, b.report + 0.9, b.report + 1.6), ap = t - (b.apples + 0.12), cu = t - (b.cups + 0.14);
  const lookUp = seg(t, b.falls, b.falls + 0.25) * (1 - seg(t, b.me - 0.1, b.me));
  let e = blend(DEADPAN, TALK, seg(t, b.report - 0.2, b.report + 0.1));
  e = { ...e, lookY: -0.8 * lookUp + (ap > 0 && ap < 0.5 ? 0.5 : 0), look: cu > 0 && cu < 0.6 ? 0.9 : 0, lid: Math.max(e.lid, blinks(t, 2.6), pulse(ap, 0, 0.3, 0.05) * 0.9), browL: e.browL + lookUp * 0.5, browR: e.browR + lookUp * 0.5 };
  e = ants(say(e, lv(env, "peek", t)), Math.sin(t * 2) * 3 + spring(ap, 7, 26) * 18, Math.sin(t * 2 + 1) * 3 - spring(ap, 7, 26) * 18);
  const o = { armL: { x: 322, y: 598 }, armR: { x: 878, y: 598 }, hatLift: ap > 0 ? -spring(ap + 0.06, 8, 22) * 16 - 10 * Math.exp(-ap * 14) : 0, hatRot: spring(ap, 8, 20) * 4, bob: Math.sin(t * 3) * 2, tilt: Math.sin(t * 1.4) * 1.2, squash: 1 - (ap > 0 ? Math.exp(-ap * 16) * 0.05 : 0) };
  // the apple comes down on his hat and bounces away; the cup breaks on the rim
  const ax = ap < 0 ? 548 : 548 + ap * 520, ay = ap < 0 ? 905 + ap * 2600 : 905 - 620 * ap + 2600 * ap * ap;
  const appleG = ap > -0.45 && ap < 0.9 ? X.apple(ax, ay, 58, ap * 320) : "";
  const cy = cu < 0 ? 1392 + cu * 2800 : 1392, shards = cu > 0 && cu < 0.7 ? [0, 1, 2, 3, 4, 5].map((i) => { const a = -Math.PI / 2 + (fx.rnd(i * 5) - 0.5) * 2.4, v = 500 + 300 * fx.rnd(i); const x = 770 + Math.cos(a) * v * cu, y = 1392 + Math.sin(a) * v * cu + 1700 * cu * cu;
    return `<path d="M${x} ${y} l18 -8 l6 16 l-16 10 Z" fill="#f0ead8" transform="rotate(${cu * 600 + i * 60} ${x} ${y})"/>`; }).join("") : "";
  const cupG = cu > -0.4 && cu < 0 ? X.cup(770, cy, 52, cu * 200) : "";
  return [...dumpsterPeek(t, env, e, o, { peel, extraFront: appleG + cupG + shards }), caps(env, t)];
}
function rMe(t, env) {                                      // "Me." a flash of the fall
  const u = seg(t, env.beats.me - 0.06, env.beats.gravity - 0.05), y = lerp(1050, 1800, u);
  const e = ants({ ...PANIC, lookY: 1, m: { ...MOUTHS.o, w: 0.7, jaw: 1, tongue: 0 } }, -60, -60);
  const c = fx.shake({ x: 540, y: 1000, z: 1.25, rot: -6 }, t, 14, 3, 18);
  return [fx.layer(N.alley() + peek(e, { hat: false, shadow: false, squash: 1.3, armL: { x: 330, y: 440 }, armR: { x: 870, y: 440 }, legL: { y: -30, rot: -20 }, legR: { y: -30, rot: 20 }, filter: night("Lm", [{ color: "#ffb866", az: 320, power: 1.5, size: 10 }], [0.9, 0.74, 0.88]) }, 540, y, 1.0), c, 1),
    fx.blurred(fx.speedLines(t, { angle: 90, o: 0.6, n: 26 }), 2), fx.tint("#ff4fa3", 0.12, "screen"), fx.vignette(0.6), fx.grain(t, 0.1), caps(env, t)];
}
function rGravity(t, env) {                                 // "They call it gravity." the word falls in, letter by letter
  const b = env.beats, word = "GRAVITY", letters = [...word].map((ch, i) => { const a = t - (b.gravity + 0.38 + i * 0.07), y = a < 0 ? -200 : 760 - Math.abs(spring(a, 5, 16)) * 190 * (a < 0.6 ? 1 : 0) - (a < 0.22 ? (1 - a / 0.22) ** 2 * 960 : 0);
    return a < 0 ? "" : X.label(190 + i * 117, y, ch, 230, i % 2 ? "#ffe66d" : "#ffffff", 1, 1); }).join("");
  return boardFrame(t, env, letters + X.arrow(540, 900, 540, 1130, 22, "#ff4fa3", t, seg(t, b.gravity + 0.95, b.gravity + 1.15)), TALK);
}
function rPulls(t, env) {                                   // "Everything pulls on everything else."
  const b = env.beats, u = seg(t, b.pulls, b.heavier), pull = ease(u) * 0.16, P = [[250, 420], [840, 500], [540, 1010]], cx = 540, cy = 660;
  const p = P.map(([x, y]) => [lerp(x, cx, pull), lerp(y, cy, pull)]), a = popIn(t, b.pulls - 0.15);
  const arrows = seg(t, b.pulls + 0.5, b.pulls + 0.8), ar = (i, j) => { const [x1, y1] = p[i], [x2, y2] = p[j], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); return X.arrow(x1 + dx / L * 150, y1 + dy / L * 150, x1 + dx / L * (L * 0.47), y1 + dy / L * (L * 0.47), 15, "#ffe66d", t, arrows); };
  return boardFrame(t, env, ar(0, 1) + ar(1, 0) + ar(1, 2) + ar(2, 1) + ar(0, 2) + ar(2, 0)
    + `<g transform="translate(${p[0][0]} ${p[0][1]}) scale(${a})">${X.apple(0, 0, 135, Math.sin(t) * 6)}</g><g transform="translate(${p[1][0]} ${p[1][1]}) scale(${popIn(t, b.pulls)})">${X.cup(0, 0, 130, Math.sin(t + 1) * 5)}</g><g transform="translate(${p[2][0]} ${p[2][1]}) scale(${popIn(t, b.pulls + 0.15)})">${X.rock(0, 0, 140, Math.sin(t + 2) * 4)}</g>`, TALK);
}
function rHeavier(t, env) {                                 // "The heavier the thing, the harder it pulls."
  const b = env.beats, slide = ease(seg(t, b.heavier + 1.15, b.planet - 0.1)), sx = lerp(210, 470, slide), big = popIn(t, b.heavier + 0.35, 0.35), hard = seg(t, b.heavier + 1.0, b.heavier + 1.25);
  return boardFrame(t, env, X.arrow(740 - 250, 660, sx + 90, 660, lerp(10, 34, hard), "#ffe66d", t * (1 + hard), seg(t, b.heavier + 0.7, b.heavier + 0.9))
    + X.arrow(sx + 60, 800, sx + 150, 800, 6, "#9fd0ff", t, seg(t, b.heavier + 0.7, b.heavier + 0.9) * (1 - slide))
    + `<g transform="scale(${popIn(t, b.heavier - 0.1)})" style="transform-origin:${sx}px 680px">${X.rock(sx, 700, 64, slide * 200)}</g><g transform="translate(760 660) scale(${big})">${X.rock(0, 0, 250, 8)}</g>`
    + X.label(210, 480, "light", 60, "#9fd0ff", seg(t, b.heavier + 0.2, b.heavier + 0.4) * (1 - slide)) + X.label(760, 330, "HEAVY", 84, "#ffe66d", seg(t, b.heavier + 0.5, b.heavier + 0.7)), TALK);
}
function rPlanet(t, env) {                                  // "And the heaviest thing around here... is the planet. So it wins. Every time."
  const b = env.beats, R = 330, ex = 540, ey = 760, eIn = popIn(t, b.is - 0.1, 0.45), shrink = ease(seg(t, b.planet, b.is)), win = t - b.wins;
  const things = [[X.apple, 130, 200, 0.0], [X.cup, 950, 260, 0.12], [X.rock, 120, 1120, 0.24], [X.phone, 960, 1100, 0.36]].map(([fn, x, y, d], i) => { const a = clamp((win - d) / 0.45), k = easeIn(a), ang = Math.atan2(y - ey, x - ex), lx = ex + Math.cos(ang) * (R + 44), ly = ey + Math.sin(ang) * (R + 44);
    const px = lerp(x, lx, k), py = lerp(y, ly, k), bounce = a >= 1 ? 1 + spring(win - d - 0.45, 9, 24) * 0.25 : 1;
    return (a < 1 && win > d - 0.5 ? X.arrow(px - Math.cos(ang) * 70, py - Math.sin(ang) * 70, ex + Math.cos(ang) * (R + 110), ey + Math.sin(ang) * (R + 110), 16, "#ffe66d", t * 2, seg(win, d - 0.4, d - 0.2)) : "")
      + `<g opacity="${seg(t, b.is + 0.3 + d, b.is + 0.5 + d)}"><g transform="translate(${px} ${py}) scale(${bounce})">${fn(0, 0, 60, a * 300 + i * 30)}</g></g>`; }).join("");
  const boulder = `<g opacity="${1 - seg(t, b.is - 0.1, b.is + 0.2)}"><g transform="translate(${lerp(760, 540, shrink)} ${lerp(660, 300, shrink)}) scale(${lerp(1, 0.16, shrink)})">${X.rock(0, 0, 250, 8)}</g></g>`;
  return boardFrame(t, env, boulder + `<g transform="translate(${ex} ${ey}) scale(${eIn})">${X.earth(0, 0, R, t * 0.12, { lid: 0.55 - 0.25 * pulse(win, 0.9, 2.2, 0.2), look: Math.sin(t) })}</g>` + things
    + X.label(540, 250, "IT WINS.", 110, "#ffe66d", seg(win, 0.05, 0.2), lerp(1.3, 1, easeOut(seg(win, 0.05, 0.3)))), F("smug", { lid: 0.4 }));
}
function rYou(t, env) {                                     // "You pull on the planet too. It just doesn't notice."
  const b = env.beats, R = 900, ex = 540, ey = 1760, top = ey - R, n = seg(t, b.notice, b.notice + 0.3), tiny = seg(t, b.you + 0.55, b.you + 0.8);
  const e = ants({ ...F("proud", { lid: 0.3 }), look: 0, lookY: 0.6 }, 4, 4);
  return boardFrame(t, env, X.earth(ex, ey, R, t * 0.05, { lid: lerp(0.5, 0.82, n), look: -1, o: 1 }).replace(/<g opacity="1">/, `<g opacity="1" transform="translate(0 ${-R * 0.72}) scale(0.42)">`)
    + X.arrow(700, top - 330, 700, top - 30, 30, "#ffe66d", t, popIn(t, b.you - 0.05, 0.2)) + X.arrow(380, top - 40, 380, top - 40 - 110 - 10 * Math.sin(t * 9), 8, "#ff7ab8", t * 2, tiny)
    + X.label(700, top - 380, "PLANET PULLS YOU", 54, "#ffe66d", popIn(t, b.you + 0.1, 0.2)) + X.label(330, top - 200, "you pull it", 46, "#ff9fd0", tiny)
    + peek(e, { shadow: false, id: "tiny" }, 540, top + 14, 0.3), F("skeptical"));
}
function rJump(t, env) {                                    // "Jump: it pulls you back. Drop your phone: it takes it."
  const b = env.beats, G = 1080, j = clamp((t - (b.jump + 0.05)) / (b.back + 0.35 - b.jump - 0.05)), h = Math.sin(j * Math.PI) * 330, land = spring(t - (b.back + 0.35), 9, 24);
  const d = t - (b.phone + 0.25), fall = d > 0 ? Math.min(1, (d / (b.takes + 0.05 - b.phone - 0.25)) ** 2) : 0, py = lerp(G - 250, G - 40, fall), crack = seg(t, b.takes + 0.05, b.takes + 0.15);
  return boardFrame(t, env, `<rect x="0" y="${G}" width="${W}" height="14" rx="7" fill="#5661a8"/><ellipse cx="330" cy="${G + 8}" rx="${110 - h * 0.15}" ry="14" fill="#03040c" opacity=".5"/>`
    + X.human(330, G - h, 1.35, { armL: 30 + j * 0 - (h > 20 ? 120 : 0), armR: -30 + (h > 20 ? 120 : 0), jumpStretch: -Math.max(0, land) * 0.12 + (h > 20 ? 0.06 : 0) })
    + X.arrow(500, G - h - 300, 500, G - h - 300 + 200, 18, "#ffe66d", t * 2, seg(j, 0.35, 0.5) * (1 - seg(j, 0.95, 1)))
    + `<g opacity="${seg(t, b.phone - 0.15, b.phone)}">${X.human(780, G, 1.35, { color: "#9fe0c0", armR: d > 0 ? -60 : -95, mood: fall >= 1 ? "shock" : "ok" })}${X.phone(895, py, 46, fall * 160 + (fall >= 1 ? 70 : 0), crack)}</g>`
    + X.arrow(960, G - 330, 960, G - 130, 18, "#ffe66d", t * 2, seg(d, 0, 0.1) * (1 - fall)) + fx.impact(895, G - 40, seg(t, b.takes + 0.05, b.takes + 0.3), { n: 10 }), TALK);
}
function rHumans(t, env) {                                  // "Humans do this daily... and still act surprised."
  const b = env.beats, G = 1080, cols = ["#ffd27a", "#9fe0c0", "#ff9fb0"];
  return boardFrame(t, env, `<rect x="0" y="${G}" width="${W}" height="14" rx="7" fill="#5661a8"/>` + [0, 1, 2].map((i) => { const x = 210 + i * 330, a = t - (b.humans + 0.1 + i * 0.3), fall = clamp(a / 0.35) ** 2, sur = t - (b.surprised + i * 0.12);
    return X.human(x - 40, G, 1.15, { color: cols[i], armR: a > 0 ? -60 : -95, mood: sur > 0 ? "shock" : "ok", jumpStretch: sur > 0 ? Math.max(0, spring(sur, 8, 22)) * 0.1 : 0 })
      + X.phone(x + 70, lerp(G - 210, G - 44, fall), 54, fall * 150 + (fall >= 1 ? 80 : 0), fall >= 1 ? 1 : 0) + (sur > 0 ? X.label(x - 40, G - 400 - Math.max(0, spring(sur, 6, 20)) * 40, "!", 150, "#ffe66d", 1, easeOutBack(clamp(sur / 0.2))) : ""); }).join(""), F("deadpan", { look: 0.5 }));
}
function rSummary(t, env) {                                 // "So: everything pulls everything. Heavier pulls harder. That's gravity."
  const b = env.beats, row = (y, at, inner, text, col = "#fff") => { const a = popIn(t, at, 0.3); return a <= 0 ? "" : `<g transform="translate(540 ${y}) scale(${a}) translate(-540 ${-y})"><rect x="60" y="${y - 130}" width="960" height="260" rx="40" fill="#1c2250" stroke="#7fd4ff" stroke-width="5" opacity=".92"/>${inner}${X.label(680, y + 24, text, 66, col)}</g>`; };
  return boardFrame(t, env, row(330, b.sum1, X.apple(170, 330, 52) + X.cup(330, 330, 50) + X.arrow(222, 310, 280, 310, 8, "#ffe66d", t) + X.arrow(280, 352, 222, 352, 8, "#ffe66d", t), "EVERYTHING PULLS")
    + row(640, b.sum2, X.rock(150, 660, 34) + X.rock(310, 640, 78) + X.arrow(250, 640, 196, 652, 14, "#ffe66d", t), "HEAVIER PULLS HARDER")
    + row(950, b.sum3, X.earth(230, 950, 96, t * 0.2) , "THAT'S GRAVITY", "#ffe66d"), F("proud", { lid: 0.3 }));
}
function rQuestion(t, env) {                                // "Which raises a question, Commander." he looks up
  const b = env.beats, up = ease(seg(t, b.question + 0.2, b.question + 0.6));
  let e = blend(TALK, F("skeptical", { lookY: -1, look: 0.3 }), up); e = ants(say({ ...e, lid: Math.max(e.lid, blinks(t, 2.6)) }, lv(env, "peek", t)), 6 * up, 6 * up);
  return [...dumpsterPeek(t, env, e, { armL: { x: 322, y: 598 }, armR: { x: 878, y: 598 }, nod: -0.5 * up, tilt: 3 * up }, { peel: 1, cam: fx.camera(t, [[b.question, 540, 1250, 1.42, 0], [b.moon, 540, 1200, 1.6, 0]]) }), caps(env, t)];
}
function rMoon(t, env) {                                    // "It even holds their Moon. So why doesn't the Moon fall on them?"
  const b = env.beats, loom = ease(seg(t, b.why + 0.2, b.out - 0.1)), a = t * 0.9 - 0.6, ex = 540, ey = lerp(860, 1000, loom), rx = 400, ry = 150;
  const mx = lerp(ex + Math.cos(a) * rx, 540, loom), my = lerp(ey - 80 + Math.sin(a) * ry, 500, loom), mr = lerp(62, 300, loom), behind = Math.sin(a) < 0 && loom < 0.05;
  const moonG = X.moon(mx, my, mr), leash = loom < 0.4 ? `<path d="M${ex} ${ey - 80} L${mx} ${my}" stroke="#ffe66d" stroke-width="5" stroke-dasharray="14 12" opacity="${(0.8 * (1 - loom / 0.4)).toFixed(2)}"/>` : "";
  const ring = `<ellipse cx="${ex}" cy="${ey - 80}" rx="${rx}" ry="${ry}" fill="none" stroke="#7fd4ff" stroke-width="4" stroke-dasharray="6 14" opacity="${0.6 * (1 - loom)}"/>`;
  return boardFrame(t, env, ring + (behind ? moonG : "") + X.earth(ex, ey, lerp(190, 240, loom), t * 0.2) + leash + (behind ? "" : moonG)
    + X.label(860, 1120, "?", 280, "#ffe66d", seg(t, b.why + 0.9, b.why + 1.1), easeOutBack(seg(t, b.why + 0.9, b.why + 1.2))), blend(TALK, F("worried", { lookY: -1, look: 0.4, lid: 0.05 }), loom), { nod: -0.4 * loom });
}
function rOut(t, env) {                                     // "Investigating. Peek out." he tips his hat and shuts the lid
  const b = env.beats, tip = pulse(t, b.out + 0.05, b.peekout + 0.1, 0.15), sink = easeIn(seg(t, b.peekout + 0.2, b.peekout + 0.5)), lid = lerp(0.12, 1, easeIn(seg(t, b.peekout + 0.28, b.peekout + 0.5)));
  let e = blend(F("sly", { look: 0 }), F("smug", { look: 0.6 }), seg(t, b.peekout, b.peekout + 0.2)); e = ants(say(e, lv(env, "peek", t)), 4, 4);
  return [...dumpsterPeek(t, env, e, { armL: { x: 322, y: 598 }, armR: tip > 0.02 ? { x: lerp(878, 800, tip), y: lerp(598, 300, tip), front: true } : { x: 878, y: 598 }, hatRot: -6 * tip, nod: 0.4 * tip }, { peel: 1, rise: 1 - sink * 0.75, lid }), caps(env, t)];
}

// ============================================================ TAG AND END CARD
function tag(t, env) {
  const u = t - env.ts, c = fx.shake(fx.camera(u, [[0, CAP_X - 150, 1230, 0.86, 0], [3.3, CAP_X + 10, 1230, 0.96, 0]]), t, 3, 9, 2);
  const lean = ease(seg(u, 0.5, 1.4)) * 10, cx = CAP_X - 520, aim = lerp(-8, 14, ease(seg(u, 0.3, 1.2))), [tx, ty] = N.croweTorch(aim);
  const bx = cx + tx * 0.99, by = N.FLOOR - 4 + ty * 0.99, sweep = lerp(8, 22, ease(seg(u, 1.6, 3.0)));
  const rate = lerp(3, 14, clamp(u / 3.3)), green = 0.5 + 0.5 * Math.sign(Math.sin(u * rate * 3.1));
  const plane = `<g transform="translate(${CAP_X} ${N.FLOOR + 30})">${N.crater()}<g transform="rotate(-9) scale(1.25)">${N.capsule(1, 0)}</g></g>` + N.footprints(CAP_X + 300, N.EDGE - 10, PY + 14, 0.55 + 0.45 * seg(u, 1.6, 2.4))
    + `<g transform="translate(${cx} ${N.FLOOR - 4}) scale(0.99)">${N.crowe({ aim, lean, glint: 0.7 + 0.3 * Math.sin(t * 9), green })}</g>` + fx.beam(bx, by, sweep, 2400, 16, "#fff3d6", 0.5, 10) + fx.glow(bx, by, 130, "#fff6dc", 0.9);
  return [...roof(c, t, t, { plane, hut: false, far: 1.4 }), ...finish(t, t, { vig: 0.72 }), caps(env, t, { y: 1500 }), fx.flash(seg(t, env.end - 0.08, env.end) ** 2, "#000")];
}
function endCard(t, env) {
  const u = t - env.end, e = ants({ ...F("worried", { lookY: -1, look: -0.5, lid: 0.05 }) }, -6, -6);
  return [N.sky({ x: 540, y: 520, r: 300 }), fx.glow(540, 520, 700, "#bcd0ff", 0.25),
    X.label(540, 1040, "WHY DOESN'T", 104, "#fff", seg(u, 0.15, 0.35)), X.label(540, 1170, "THE MOON FALL?", 124, "#ffe66d", seg(u, 0.3, 0.5), lerp(1.2, 1, easeOut(seg(u, 0.3, 0.55)))),
    X.label(540, 1330, "FOLLOW FOR REPORT #2", 64, "#7fd4ff", seg(u, 0.8, 1.0)),
    peek(e, { shadow: false, turn: -0.5, nod: -0.7, tilt: -4, hatRot: 3 }, 820 + (1 - easeOut(seg(u, 0.1, 0.5))) * 500, 2060, 0.62), fx.vignette(0.55), fx.grain(t, 0.08), fx.flash(1 - seg(u, 0, 0.25), "#000")];
}

export function draw(t, env) {
  if (!env) return fx.frame(() => `<text x="40" y="100" fill="#fff" font-size="40">run audio/ep01_sound.py first (out/ep01.json)</text>`);
  const b = env.beats;
  let f;
  if (t < env.rs) f = t < 1.3 ? arrive : t < 4.2 ? hatch : t < 4.8 ? toEdge : t < 8.0 ? float : alleyFall;
  else if (t < env.ts) f = t < b.me - 0.06 ? rDumpster : t < b.gravity - 0.05 ? rMe : t < b.pulls - 0.15 ? rGravity : t < b.heavier - 0.12 ? rPulls : t < b.planet - 0.1 ? rHeavier : t < b.you - 0.15 ? rPlanet
    : t < b.jump - 0.15 ? rYou : t < b.humans - 0.12 ? rJump : t < b.sum1 - 0.15 ? rHumans : t < b.question - 0.12 ? rSummary : t < b.moon - 0.12 ? rQuestion : t < b.out - 0.12 ? rMoon : rOut;
  else f = t < env.end ? tag : endCard;
  return fx.frame(() => f(t, env));
}
