// Peek · Episode 1 · GRAVITY (about 58 s), final cut. Timing comes from out/ep01.json (audio/ep01_sound.py, mouths.cjs).
//  Cold open (0 - 11): Peek screaming in the capsule's porthole; the capsule hits a roof; he climbs out with no hat;
//    "Relax, Commander."; he steps off the edge and floats ("On my planet... we float."); "Uh-oh."; the dumpster; the
//    hat comes up alone, looks left and right, then his eyes come up under it.
//  Report (11 - tag): from inside the dumpster, then pictures on a framed board with Peek below it.
//  Tag: Agent Crowe at the capsule. "What... is this?"  The next question lands on the same shot; cut to black.
// Layout keeps faces, captions and titles out of the Shorts interface (bottom 480 px, right 190 px).
import { MOUTHS } from "../lib/peek.js";
import * as fx from "../lib/fx.js";
import * as N from "../sets/night.js";
import * as X from "../lib/explain.js";
import { K, PY, F, blend, ants, speak, lv, blink, blinks, peek, night, finish, rainBack, roof, PANIC, BLISS, DREAD, AWE, DEADPAN } from "../lib/act.js";

const { seg, lerp, ease, easeOut, easeIn, easeOutBack, kf, clamp, spring, pulse, noise, W, H } = fx;
export const ENV = "out/ep01.json";
export const DUR = 65;
export const duration = (env) => (env ? env.dur : DUR);
const CAP_X = 2100, FLOAT_X = N.EDGE + 330, FLOAT_Y = 1210;
const caps = (env, t, o) => (env ? X.captions(env.words, t, o) : "");
const OUT = { y: 1400 };                                    // captions in the outdoor shots

// ============================================================ COLD OPEN
function porthole(t, env) {                                 // 0 - 0.7: frame one is his face
  const sx = noise(t * 34, 1) * 16, sy = noise(t * 34, 2) * 16;
  const e = ants({ ...PANIC, look: noise(t * 8, 3) * 0.5, lookY: 0.2, eyeScale: 1.3, pupil: 0.5, m: { ...MOUTHS.o, w: 0.78, jaw: 1, tongue: 0.3 } }, -44 + noise(t * 30, 4) * 14, -44 - noise(t * 30, 5) * 14);
  fx.def("portc", `<clipPath id="portc"><circle cx="540" cy="900" r="402"/></clipPath>`);
  fx.def("wallg", `<linearGradient id="wallg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd0e6"/><stop offset=".5" stop-color="#ff6fb1"/><stop offset="1" stop-color="#8e1754"/></linearGradient>`);
  fx.def("cabing", `<radialGradient id="cabing" cx=".5" cy=".7" r=".8"><stop offset="0" stop-color="#ff8a3c"/><stop offset=".5" stop-color="#7a1f4a"/><stop offset="1" stop-color="#1a0a24"/></radialGradient>`);
  const flames = Array.from({ length: 16 }, (_, i) => { const a = ((t * 2.6 + fx.rnd(i * 3)) % 1), x = fx.rnd(i * 7) * 1300 - 100 - a * 420, y = 2000 - a * 2300, l = 240 + fx.rnd(i * 5) * 320;
    return `<path d="M${x} ${y} l${-l * 0.22} ${-l}" stroke="${i % 3 ? "#ffb347" : "#fff1c2"}" stroke-width="${26 + fx.rnd(i) * 40}" stroke-linecap="round" opacity="${(0.55 * Math.sin(a * Math.PI)).toFixed(2)}"/>`; }).join("");
  const f = night("Lp", [{ color: "#ffb347", az: 90, power: 2.2, size: 14 }, { color: "#ffe3a8", az: 200, power: 1.0, size: 10 }], [1.0, 0.82, 0.86], 0.04);
  return [`<g transform="translate(${sx} ${sy})"><rect x="-60" y="-60" width="1200" height="2040" fill="url(#wallg)"/>
      ${[[150, 330], [930, 330], [150, 1470], [930, 1470], [540, 250], [540, 1550]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="24" fill="#8e1754"/><circle cx="${x - 6}" cy="${y - 6}" r="9" fill="#ffd0e6" opacity=".7"/>`).join("")}
      <circle cx="540" cy="900" r="470" fill="#7a1846"/><circle cx="540" cy="900" r="446" fill="#c2307f"/><circle cx="540" cy="900" r="402" fill="url(#cabing)"/>
      <g clip-path="url(#portc)">${peek(e, { hat: false, shadow: false, filter: f, tilt: noise(t * 12, 6) * 4, id: "ph" }, 540 + noise(t * 26, 7) * 12, 1650 + noise(t * 26, 8) * 12, 1.25)}
        <ellipse cx="380" cy="640" rx="210" ry="70" fill="#fff" opacity=".2" transform="rotate(-32 380 640)"/><ellipse cx="700" cy="1170" rx="150" ry="40" fill="#fff" opacity=".1" transform="rotate(-32 700 1170)"/></g>
      <circle cx="540" cy="900" r="402" fill="none" stroke="#3a0d28" stroke-width="10" opacity=".6"/></g>`,
    fx.blurred(flames, 9), fx.tint("#ff7a2a", 0.28, "screen"), fx.vignette(0.5), fx.grain(t, 0.1), fx.flash(seg(t, 0.62, 0.7) * 0.9, "#fff1d0")];
}
function arrive(t, env) {                                   // 0.7 - 1.3: the capsule comes down on the roof
  let c = fx.camera(t, [[0.7, 2070, 1000, 0.86, -4], [0.98, 2090, 1215, 0.92, 0], [1.3, 2095, 1225, 0.95, 0]], easeIn);
  const hit = t - 1.0;
  c = fx.shake(c, t, hit > 0 ? 70 * Math.exp(-hit * 6) : 8, 2, 16);
  const [ex, ey] = fx.toScreen(c, CAP_X, N.FLOOR - 120), u = clamp((t - 0.5) / 0.5), px = lerp(-260, ex, u ** 1.4), py = lerp(-420, ey, u ** 1.4);
  const dx = ex + 260, dy = ey + 420, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, tail = 760 * (0.4 + u);
  const comet = hit < 0 ? `<defs><linearGradient id="cometg" gradientUnits="userSpaceOnUse" x1="${px}" y1="${py}" x2="${px - ux * tail}" y2="${py - uy * tail}"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".15" stop-color="#ff9fd0" stop-opacity=".9"/><stop offset="1" stop-color="#ff4fa3" stop-opacity="0"/></linearGradient></defs>
    ${fx.blurred(`<path d="M${px} ${py} L${px - ux * tail} ${py - uy * tail}" stroke="url(#cometg)" stroke-width="64" stroke-linecap="round"/>`, 10)}
    <path d="M${px} ${py} L${px - ux * tail * 0.7} ${py - uy * tail * 0.7}" stroke="url(#cometg)" stroke-width="22" stroke-linecap="round"/>${fx.glow(px, py, 220, "#ffd0ea", 1)}<circle cx="${px}" cy="${py}" r="26" fill="#fff"/>` : "";
  const dust = hit > 0 ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = Math.PI * (0.08 + 0.84 * fx.rnd(i * 5)), v = 500 + 500 * fx.rnd(i * 3), x = CAP_X - Math.cos(a) * v * hit * (i % 2 ? 1 : -1), y = N.FLOOR - Math.sin(a) * v * hit + 1500 * hit * hit;
    return `<path d="M${x - 16} ${y + 10} L${x - 8} ${y - 12} L${x + 14} ${y - 8} L${x + 18} ${y + 12} Z" fill="#3d4780"/>`; }).join("")
    + `<ellipse cx="${CAP_X}" cy="${N.FLOOR - 10}" rx="${200 + 900 * easeOut(hit / 0.5)}" ry="${50 + 150 * easeOut(hit / 0.5)}" fill="#aab6ff" opacity="${(0.4 * (1 - clamp(hit / 0.5))).toFixed(2)}"/>` : "";
  const plane = hit > 0 ? `<g transform="translate(${CAP_X} ${N.FLOOR + 30})">${N.crater()}<g transform="rotate(-9) scale(1.25) translate(0 ${-30 + 40 * Math.exp(-hit * 12)})">${N.capsule(0, 1)}</g></g>${dust}` : "";
  return [...roof(c, t, t, { plane, hut: false, far: 1.5 }), comet, fx.impact(ex, ey + 80, seg(hit, 0, 0.3), { color: "#ffd0ea" }), fx.flash(Math.max(hit > 0 ? Math.exp(-hit * 12) : 0, 1 - seg(t, 0.7, 0.8)), "#ffe3f1"), ...finish(t, t, { warm: 0.1 })];
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
  e = ants(speak({ ...e, look: scan * 0.6, lid: Math.max(e.lid, blink(t, [2.3, 3.9])) }, env, t), 10 * radioOn * Math.sin(t * 40) + land * 20, -10 * radioOn * Math.sin(t * 40) - land * 20);
  const o = { hat: false, filter: night("Lh", [{ color: "#ff9fd0", az: 90, power: 1.2, size: 12 }, { color: "#9fd0ff", az: 315, power: 0.9, size: 8 }], [0.9, 0.74, 0.98], 0.02),
    turn: t < 3.3 ? scan : 0.2, nod: t > 2.45 && t < 2.9 ? -0.4 : 0, shadow: out && hop >= 1, squash: 1 - Math.max(0, land) * 0.1 + arc * 0.08,
    legL: out && hop < 1 ? { y: -40 * arc, rot: -18 } : null, legR: out && hop < 1 ? { y: -30 * arc, rot: 18 } : null,
    armR: t > 3.42 ? { x: lerp(770, 905, easeOutBack(seg(t, 3.42, 3.62))), y: lerp(760, 560, easeOut(seg(t, 3.42, 3.62))) + Math.sin(t * 16) * 12 } : (out && hop < 1 ? { x: 900, y: 600 } : null),
    armL: out && hop < 1 ? { x: 300, y: 600 } : null };
  const k = 0.6, tips = [-1, 1].map((s) => [px + s * 162 * k, py + (90 - 1010) * k]);
  const radio = radioOn > 0.05 ? tips.map(([x, y]) => fx.glow(x, y, 80 + 80 * radioOn, "#ffe66d", 0.9 * radioOn) + [0, 0.5].map((d) => { const a = (t * 2.4 + d) % 1; return `<circle cx="${x}" cy="${y}" r="${30 + a * 90}" fill="none" stroke="#ffe66d" stroke-width="7" opacity="${(0.85 * (1 - a)).toFixed(2)}"/>`; }).join("")).join("") : "";
  const smoke = [0, 1, 2, 3, 4].map((i) => { const a = ((t * 0.55 + i * 0.2) % 1); return `<ellipse cx="${CAP_X - 150 + i * 70 + Math.sin(t + i) * 20}" cy="${N.FLOOR - 40 - a * 420}" rx="${50 + a * 90}" ry="${36 + a * 60}" fill="#c9d2ff" opacity="${(0.2 * (1 - a) * (1 - seg(t, 2.6, 4))).toFixed(3)}"/>`; }).join("");
  const capG = (part) => `<g transform="translate(${CAP_X} ${N.FLOOR + 30}) rotate(-9) scale(1.25)">${N.capsule(open, 0.55 * (1 - seg(t, 1.3, 3.5)), part)}</g>`;
  const plane = `<g transform="translate(${CAP_X} ${N.FLOOR + 30})">${N.crater()}</g>` + capG("back") + (out ? capG("front") + peek(e, o, px, py, k) : peek(e, o, px, py, k) + capG("front")) + smoke + radio;
  return [...roof(c, t, t, { plane, hut: false, far: 2 }), fx.flash(pulse(t, 1.45, 1.6, 0.03) * 0.25, "#ffe3f1"), ...finish(t, t, { warm: 0.12, vig: 0.7 }), caps(env, t, OUT)];
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
  if (slow) e = speak({ ...BLISS, squint: 0.2 + 0.15 * Math.sin(t * 2) }, env, t);
  else { e = blend({ ...BLISS }, DREAD, open2); e.lidL = lerp(1, 0, open2); e.lidR = lerp(1, 0, open1); e.lid = 0; e.lookY = down; e.look = 0; e.pupil = lerp(1, 0.45, down); e.sweat = seg(t, 7.45, 8) * 0.8; e = speak(e, env, t); }
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
    ...finish(t, wt, { streak: slow ? 0.06 : 1, o: slow ? 0.5 : 0.3, vig: slow ? 0.55 : 0.7, grade: ["#2a3cc0", 0.26], warm: slow ? 0.16 : 0 }),
    fx.flash(pulse(t, 4.8, 5.02, 0.04) * 0.55), caps(env, t, OUT)];
}

// ---- the dumpster: where he lands, where he finds the hat, and where he files the report from
const PEEL = (slide = 0) => (slide >= 1 ? "" : `<g transform="translate(${392 - slide * 60} ${196 + slide * 700}) rotate(${-14 + slide * 200})"><path d="M0 0 C-26 22 -40 60 -30 96 C-14 70 -4 40 6 8 Z" fill="#f2d14b"/><path d="M4 0 C36 14 62 44 66 84 C42 66 22 40 2 10 Z" fill="#e6c13a"/><path d="M0 -4 C-4 -30 8 -52 22 -62 C20 -40 14 -18 8 2 Z" fill="#f7dc62"/><circle cx="4" cy="0" r="9" fill="#8a6a1a"/></g>`);
const DUMP_CAM = { x: 540, y: 1250, z: 1.42, rot: 0 };
function dumpsterPeek(t, env, e, o, { rise = 1, lid = 0.12, cam = DUMP_CAM, peel = 0, extra = "", extraFront = "", grade = {} } = {}) {
  const k = 0.9, py = 1772 + (1 - rise) * 520;
  const f = night("Ld", [{ color: "#ffb866", az: 320, power: 1.5, size: 10 }, { color: "#9fd0ff", az: 200, power: 0.8, size: 9 }], [0.92, 0.78, 0.92], 0.02);
  const back = lid < 0.55;
  fx.def("binc", `<clipPath id="binc"><rect x="-400" y="-3000" width="1900" height="4426"/></clipPath>`);      // nothing of him shows below the rim
  const inner = N.alley() + (back ? N.dumpsterLid(lid) : "") + N.dumpsterBack() + extra + `<g clip-path="url(#binc)">${peek(e, { filter: f, shadow: false, hatExtra: PEEL(peel), ...o }, 540, py, k)}</g>` + N.dumpster(lid, 0, false) + (back ? "" : N.dumpsterLid(lid)) + extraFront;
  return [fx.layer(inner, cam, 1), ...finish(t, t, { vig: 0.66, grade: ["#3a2a90", 0.22], warm: 0.12, o: 0.2, ...grade })];
}
function alleyFall(t, env) {                                // 8.0 - 11.0: the crash, then the hat
  const u = t - 8.0, hitT = 0.55, hit = u - hitT;
  if (t < 9.05) {
    const y = u < hitT ? -560 + 2060 * (u / hitT) ** 1.5 : 1500, lid = hit > 0.06 ? easeIn(seg(hit, 0.06, 0.14)) : 0, sq = hit > 0 ? Math.exp(-hit * 9) * Math.cos(hit * 30) : 0;
    const c = fx.shake({ x: 540, y: 1020, z: 1.02, rot: 0 }, t, hit > 0 ? 60 * Math.exp(-hit * 7) : 5, 11, 14);
    const e = ants({ ...PANIC, lookY: 1, m: { ...MOUTHS.o, w: 0.7, jaw: 1, tongue: 0 } }, -60, -60);
    const o = { hat: false, filter: night("L6", [{ color: "#ffb866", az: 320, power: 1.6, size: 10 }], [0.9, 0.74, 0.88]), shadow: false, squash: 1.3, tilt: Math.sin(u * 20) * 5, armL: { x: 330 + Math.sin(u * 40) * 30, y: 440 }, armR: { x: 870 - Math.sin(u * 40) * 30, y: 440 }, legL: { y: -30, rot: -20 + Math.sin(u * 44) * 16 }, legR: { y: -30, rot: 20 - Math.sin(u * 44) * 16 } };
    const debris = hit > 0 ? [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = -Math.PI / 2 + (fx.rnd(i * 3) - 0.5) * 2.2, v = 900 + fx.rnd(i * 7) * 700, x = 540 + Math.cos(a) * v * hit, yy = 1400 + Math.sin(a) * v * hit + 1900 * hit * hit;
      return `<ellipse cx="${x}" cy="${yy}" rx="${22 + i * 3}" ry="${15 + i * 2}" fill="#0b0b12"/>`; }).join("") : "";
    return [fx.layer(N.alley() + N.dumpsterBack() + (u < hitT + 0.04 ? peek(e, o, 540, y, 0.86) : "") + N.dumpster(lid, sq) + debris, c, 1), u < hitT ? fx.blurred(fx.speedLines(t, { angle: 90, o: 0.4, n: 20 }), 2) : "",
      fx.impact(540, 1380, seg(hit, 0, 0.32)), fx.flash(hit > 0 ? Math.exp(-hit * 16) * 0.85 : 0), ...finish(t, t, { vig: 0.7, grade: ["#3a2a90", 0.25], warm: 0.12 })];
  }
  // the lid lifts: the hat comes up on its own, looks left, looks right; then his eyes come up under it
  const hatUp = easeOutBack(seg(t, 9.12, 9.38)), eyesUp = easeOutBack(seg(t, 9.95, 10.25)), rise = 0.4 * hatUp + 0.6 * eyesUp;
  const cam = fx.camera(t, [[9.05, 540, 1020, 1.02, 0], [9.7, 540, 1235, 1.34, 0], [11.0, 540, 1250, 1.42, 0]]);
  const peekT = kf(t, [[9.4, 0], [9.5, -0.9], [9.62, -0.9], [9.72, 0.9], [9.86, 0.9], [9.96, 0]]);
  const e = ants({ ...DEADPAN, lid: Math.max(0.5, blink(t, [10.55])), look: kf(t, [[10.2, 0], [10.3, -0.8], [10.5, -0.8], [10.62, 0.8], [10.8, 0.8], [10.9, 0]]) }, -8 + spring(t - 9.38, 8, 26) * 14, -8 - spring(t - 9.38, 8, 26) * 14);
  const title = `<g opacity="${seg(t, 10.3, 10.45)}">${X.label(540, 1290, "FIELD REPORT #1", 70, "#ffe66d", 1, 1)}${X.label(540, 1425, "GRAVITY", 150, "#fff", 1, lerp(1.25, 1, easeOut(seg(t, 10.32, 10.55))))}</g>`;
  return [...dumpsterPeek(t, env, e, { armL: null, armR: null, turn: peekT, hatRot: spring(t - 9.38, 7, 24) * 6 + peekT * 3 }, { rise, lid: lerp(1, 0.12, easeOut(seg(t, 9.08, 9.32))), cam }),
    fx.glow(540, 760, 420, "#ffd27a", 0.25 * pulse(t, 9.95, 10.4, 0.15)), title];
}

// ============================================================ THE REPORT
const TALK = F("neutral", { lid: 0.3, browL: -0.1, browR: 0.3 });
const ZONE = { x: 40, y: 190, w: 1000, h: 820 }, ZC = [540, 600];       // the picture panel and its centre
// Peek below the panel, talking, with a gesture: "point" | "shrug" | "palm" | none
function below(t, env, face = TALK, gesture = null, g = 0, o = {}) {
  const e = ants(speak({ ...face, lid: Math.max(face.lid, blinks(t, 2.9)), look: face.look ?? 0.55, lookY: face.lookY ?? -0.6 }, env, t), Math.sin(t * 2) * 3, Math.sin(t * 2 + 1) * 3);
  const arms = gesture === "point" ? { armR: { x: lerp(770, 900, g), y: lerp(770, 470, g) + Math.sin(t * 5) * 6 } }
    : gesture === "shrug" ? { armL: { x: lerp(430, 322, g), y: lerp(770, 664, g) }, armR: { x: lerp(770, 878, g), y: lerp(770, 664, g) }, shrug: g }
    : gesture === "palm" ? { armR: { x: lerp(770, 652, g), y: lerp(770, 420, g), front: true } } : {};
  return `<rect x="0" y="1722" width="${W}" height="200" fill="#0c0f2e"/><rect x="0" y="1722" width="${W}" height="6" fill="#3a4490" opacity=".7"/>` + peek(e, { turn: 0.4, tilt: Math.sin(t * 1.7) * 1.5, bob: Math.sin(t * 3.1) * 3, ...arms, ...o }, 245, 1750, 0.66);
}
function boardFrame(t, env, t0, inner, face, gesture, g, o) {
  const age = t - t0, slide = (1 - easeOut(clamp(age / 0.22))) * 260, drift = 1 + 0.035 * clamp(age / 4);
  fx.def("zonec", `<clipPath id="zonec"><rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44"/></clipPath>`);
  fx.def("zoneg", `<radialGradient id="zoneg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#232b6e"/><stop offset="1" stop-color="#0b0e30"/></radialGradient>`);
  return [X.board(t, "#161b4a"), `<rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44" fill="url(#zoneg)"/>
    <g clip-path="url(#zonec)"><g transform="translate(${ZC[0] + slide} ${ZC[1]}) scale(${drift.toFixed(4)}) translate(${-ZC[0]} ${-ZC[1]})" opacity="${clamp(age / 0.12)}">${inner}</g></g>
    <rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44" fill="none" stroke="#7fd4ff" stroke-width="5" opacity=".55"/>`,
    fx.vignette(0.4), below(t, env, face, gesture, g, o), fx.grain(t, 0.07), caps(env, t, { y: 1100 })];
}
const popIn = (t, at, d = 0.3) => easeOutBack(seg(t, at, at + d));

function rDumpster(t, env) {                                // "Commander. Field report number one ... Apples. Cups. Me."
  const b = env.beats, peel = seg(t, b.report + 0.9, b.report + 1.6), ap = t - (b.apples + 0.12), cu = t - (b.cups + 0.14);
  const lookUp = seg(t, b.falls, b.falls + 0.25) * (1 - seg(t, b.me - 0.1, b.me));
  let e = blend(DEADPAN, TALK, seg(t, b.report - 0.2, b.report + 0.1));
  e = { ...e, lookY: -0.8 * lookUp + (ap > 0 && ap < 0.5 ? 0.5 : 0), look: cu > 0 && cu < 0.6 ? 0.9 : 0, lid: Math.max(e.lid, blinks(t, 2.6), pulse(ap, 0, 0.3, 0.05) * 0.9), browL: e.browL + lookUp * 0.5, browR: e.browR + lookUp * 0.5 };
  e = ants(speak(e, env, t), Math.sin(t * 2) * 3 + spring(ap, 7, 26) * 18, Math.sin(t * 2 + 1) * 3 - spring(ap, 7, 26) * 18);
  const o = { armL: { x: 322, y: 598 }, armR: { x: 878, y: 598 }, hatLift: ap > 0 ? -spring(ap + 0.06, 8, 22) * 16 - 10 * Math.exp(-ap * 14) : 0, hatRot: spring(ap, 8, 20) * 4, bob: Math.sin(t * 3) * 2, tilt: Math.sin(t * 1.4) * 1.2, squash: 1 - (ap > 0 ? Math.exp(-ap * 16) * 0.05 : 0) };
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
  const b = env.beats, t0 = b.gravity - 0.05, letters = [..."GRAVITY"].map((ch, i) => { const a = t - (b.gravity + 0.38 + i * 0.07), y = a < 0 ? -200 : 620 - Math.abs(spring(a, 5, 16)) * 170 * (a < 0.6 ? 1 : 0) - (a < 0.22 ? (1 - a / 0.22) ** 2 * 900 : 0);
    return a < 0 ? "" : X.label(204 + i * 112, y, ch, 215, i % 2 ? "#ffe66d" : "#ffffff", 1, 1); }).join("");
  return boardFrame(t, env, t0, letters + X.arrow(540, 700, 540, 930, 24, "#ff4fa3", t, seg(t, b.gravity + 0.95, b.gravity + 1.15)), TALK, "point", pulse(t, b.gravity + 0.3, b.pulls - 0.2, 0.2));
}
function rPulls(t, env) {                                   // "Everything pulls on everything else."
  const b = env.beats, u = seg(t, b.pulls, b.heavier), pull = ease(u) * 0.17, P = [[250, 370], [840, 430], [540, 850]], [cx, cy] = [540, 560];
  const p = P.map(([x, y]) => [lerp(x, cx, pull), lerp(y, cy, pull)]);
  const arrows = seg(t, b.pulls + 0.5, b.pulls + 0.8), ar = (i, j) => { const [x1, y1] = p[i], [x2, y2] = p[j], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); return X.arrow(x1 + dx / L * 150, y1 + dy / L * 150, x1 + dx / L * (L * 0.47), y1 + dy / L * (L * 0.47), 15, "#ffe66d", t, arrows); };
  return boardFrame(t, env, b.pulls - 0.15, ar(0, 1) + ar(1, 0) + ar(1, 2) + ar(2, 1) + ar(0, 2) + ar(2, 0)
    + `<g transform="translate(${p[0][0]} ${p[0][1]}) scale(${popIn(t, b.pulls - 0.1)})">${X.apple(0, 0, 130, Math.sin(t) * 6)}</g><g transform="translate(${p[1][0]} ${p[1][1]}) scale(${popIn(t, b.pulls)})">${X.cup(0, 0, 125, Math.sin(t + 1) * 5)}</g><g transform="translate(${p[2][0]} ${p[2][1]}) scale(${popIn(t, b.pulls + 0.15)})">${X.rock(0, 0, 135, Math.sin(t + 2) * 4)}</g>`, TALK, "point", pulse(t, b.pulls + 0.4, b.heavier - 0.2, 0.2));
}
function rHeavier(t, env) {                                 // "The heavier the thing, the harder it pulls." the same apple, by a light rock and by a heavy one
  const b = env.beats, A = 400, Bz = 800, slow = ease(seg(t, b.heavier + 0.5, b.planet)) * 70, zip = t - (b.harder + 0.25), k = clamp(zip / 0.3) ** 2, bx = lerp(840, 520, k), bump = zip > 0.3 ? 1 + spring(zip - 0.3, 9, 26) * 0.18 : 1;
  return boardFrame(t, env, b.heavier - 0.12,
    `<g opacity="${seg(t, b.heavier - 0.05, b.heavier + 0.15)}">${X.rock(250, A, 70, 0)}${X.label(250, A - 110, "LIGHT", 62, "#9fd0ff")}${X.arrow(760 - slow, A, 420, A, 7, "#9fd0ff", t * 0.6, seg(t, b.heavier + 0.35, b.heavier + 0.55))}${X.apple(840 - slow, A, 62, -slow * 0.4)}${X.label(600, A + 78, "weak pull", 50, "#9fd0ff", seg(t, b.heavier + 0.4, b.heavier + 0.6))}</g>
     <g opacity="${seg(t, b.harder - 0.25, b.harder - 0.05)}"><g transform="translate(290 ${Bz}) scale(${bump})">${X.rock(0, 0, 200, 8)}</g>${X.label(290, Bz - 250, "HEAVY", 78, "#ffe66d")}${k < 1 ? X.arrow(bx - 80, Bz, 520, Bz, 30, "#ffe66d", t * 2.4, seg(t, b.harder - 0.05, b.harder + 0.1)) : ""}${X.apple(bx, Bz, 62, -k * 260)}${X.label(700, Bz + 110, "STRONG PULL", 60, "#ffe66d", seg(t, b.harder + 0.1, b.harder + 0.3))}</g>`, TALK, "point", pulse(t, b.harder, b.planet - 0.25, 0.2));
}
function rPlanet(t, env) {                                  // "And the heaviest thing around here... is the planet. So it wins. Every time."
  const b = env.beats, R = 290, ex = 540, ey = 630, eIn = popIn(t, b.is - 0.1, 0.45), win = t - b.wins;
  const things = [[X.apple, 130, 400, 0.0], [X.cup, 950, 420, 0.12], [X.rock, 140, 920, 0.24], [X.phone, 940, 910, 0.36]].map(([fn, x, y, d], i) => { const a = clamp((win - d) / 0.45), k = easeIn(a), ang = Math.atan2(y - ey, x - ex), lx = ex + Math.cos(ang) * (R + 44), ly = ey + Math.sin(ang) * (R + 44);
    const px = lerp(x, lx, k), py = lerp(y, ly, k), bounce = a >= 1 ? 1 + spring(win - d - 0.45, 9, 24) * 0.25 : 1;
    return (a < 1 && win > d - 0.5 ? X.arrow(px - Math.cos(ang) * 70, py - Math.sin(ang) * 70, ex + Math.cos(ang) * (R + 110), ey + Math.sin(ang) * (R + 110), 16, "#ffe66d", t * 2, seg(win, d - 0.4, d - 0.2)) : "")
      + `<g opacity="${seg(t, b.is + 0.3 + d, b.is + 0.5 + d)}"><g transform="translate(${px} ${py}) scale(${bounce})">${fn(0, 0, 60, a * 300 + i * 30)}</g></g>`; }).join("");
  const q = `<g opacity="${1 - seg(t, b.is - 0.15, b.is)}">${X.rock(540, 620, 200, 8)}${X.label(540, 330, "HEAVY?", 90, "#ffe66d")}</g>`;
  return boardFrame(t, env, b.planet - 0.1, q + `<g transform="translate(${ex} ${ey}) scale(${eIn})">${X.earth(0, 0, R, t * 0.12, { lid: 0.55 - 0.25 * pulse(win, 0.9, 2.2, 0.2), look: Math.sin(t) })}</g>` + things
    + X.label(540, 290, "IT WINS.", 110, "#ffe66d", seg(win, 0.05, 0.2), lerp(1.3, 1, easeOut(seg(win, 0.05, 0.3)))), F("smug", { lid: 0.4 }), "point", pulse(t, b.is, b.wins, 0.2));
}
function rDown(t, env) {                                    // "That's all DOWN means: toward the planet." people all round it, each one's down points in
  const b = env.beats, R = 180, ex = 540, ey = 665, cols = [["#ffb347", "#5a3a22"], ["#7fd4a8", "#2a2a2a"], ["#ff8fa8", "#8a5a2a"], ["#8fb8ff", "#3a2a1a"]];
  const people = [-90, 0, 90, 180].map((deg, i) => { const a = deg * Math.PI / 180, on = popIn(t, b.down + 0.1 + i * 0.16, 0.25), x = ex + Math.cos(a) * R, y = ey + Math.sin(a) * R, tx = -Math.sin(a) * 96, ty = Math.cos(a) * 96;
    const x1 = ex + Math.cos(a) * (R + 215) + tx, y1 = ey + Math.sin(a) * (R + 215) + ty, x2 = ex + Math.cos(a) * (R + 60) + tx, y2 = ey + Math.sin(a) * (R + 60) + ty, show = seg(t, b.down + 0.75 + i * 0.1, b.down + 0.95 + i * 0.1);
    return `<g transform="translate(${x} ${y}) scale(${on}) translate(${-x} ${-y})">${X.human(x, y, 0.5, { shirt: cols[i][0], hair: cols[i][1], rot: deg + 90 })}</g>` + X.arrow(x1, y1, x2, y2, 13, "#ffe66d", t * 1.6, show)
      + X.label(ex + Math.cos(a) * (R + 140) + tx * 2.0, ey + Math.sin(a) * (R + 140) + ty * 2.0 + 16, "down", 46, "#ffe66d", show); }).join("");
  return boardFrame(t, env, b.down - 0.15, X.earth(ex, ey, R, t * 0.15) + people + `<circle cx="${ex}" cy="${ey}" r="${16 + 6 * Math.sin(t * 6)}" fill="#ffe66d" opacity="${seg(t, b.toward, b.toward + 0.2)}"/>`
    + X.label(540, 262, "DOWN = TOWARD THE PLANET", 58, "#fff", seg(t, b.toward, b.toward + 0.2), lerp(1.15, 1, easeOut(seg(t, b.toward, b.toward + 0.3)))), TALK, "point", pulse(t, b.down + 0.3, b.speed - 0.25, 0.2));
}
function rSpeed(t, env) {                                   // "It speeds you up. Every second you fall, you go 22 miles an hour faster. I hit that dumpster at 35."
  const b = env.beats, top = 250, span = 610, s = lerp(0, 3.25, seg(t, b.every + 0.1, b.hit - 0.15)), yOf = (q) => top + span * (q / 3.1) ** 2, hit = t - (b.hit + 0.15);
  const e = ants({ ...PANIC, lookY: 1, m: { ...MOUTHS.o, w: 0.7, jaw: 1, tongue: 0 } }, -60, -60);
  const marks = [1, 2, 3].map((q) => { const on = popIn(t, b.every + 0.1 + (b.hit - 0.25 - b.every) * (q / 3.25) - 0.05, 0.22), y = yOf(q);
    return `<path d="M150 ${y} H470" stroke="#7fd4ff" stroke-width="5" stroke-dasharray="10 12" opacity=".7"/>${X.label(120, y + 16, q + "s", 50, "#7fd4ff")}`
      + (on > 0 ? `<g transform="translate(740 ${y}) scale(${on})">${X.label(0, 22, q * 22 + " mph", 60 + q * 14, "#ffe66d")}${X.label(0, 74 + q * 4, Math.round(q * 35.3) + " km/h", 40, "#9fd0ff")}</g>` : ""); }).join("");
  const faller = hit < 0 ? `<path d="M310 ${top - 20} V${yOf(Math.min(s, 3.1)) - 150}" stroke="#ff9fd0" stroke-width="10" stroke-linecap="round" opacity=".5" stroke-dasharray="4 22"/>` + peek(e, { hat: false, shadow: false, squash: 1.2, armL: { x: 330, y: 440 }, armR: { x: 870, y: 440 }, legL: { y: -30, rot: -20 }, legR: { y: -30, rot: 20 }, id: "fall" }, 310, yOf(Math.min(s, 3.1)) + 30, 0.2) : "";
  const sp = (env.words.find((w) => w.t > b.speed && /^speeds/i.test(w.w)) || { t: b.speed + 1 }).t;
  const fact = `<g opacity="${1 - seg(t, b.every - 0.1, b.every + 0.1)}">${X.label(540, lerp(640, 400, easeOut(seg(t, sp - 0.3, sp))), "IT DOESN'T JUST PULL", 64, "#9fd0ff", seg(t, b.speed + 0.05, b.speed + 0.25), lerp(1.35, 1, easeOut(seg(t, sp - 0.3, sp))))}<g opacity="${seg(t, sp - 0.05, sp + 0.12)}">${X.label(540, 580, "IT SPEEDS", 120, "#fff")}${X.label(540, 740, "YOU UP", 150, "#ffe66d", 1, lerp(1.3, 1, easeOut(seg(t, sp + 0.2, sp + 0.5))))}</g>${X.arrow(540, 790, 540, 960, 26, "#ff4fa3", t * 2.5, seg(t, sp + 0.1, sp + 0.3))}</g>`;
  const crash = hit > -0.2 ? `<rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" fill="#141a48" opacity="${seg(hit, -0.2, 0)}"/><g opacity="${seg(hit, -0.2, 0)}"><g transform="translate(540 820) scale(${0.52 * (1 + Math.max(0, spring(hit, 9, 26)) * 0.12)}) translate(-540 -1590)">${N.dumpsterBack()}${N.dumpster(0.1, hit > 0 ? Math.exp(-hit * 8) * Math.cos(hit * 28) : 0)}</g>
      ${hit > 0 ? [-1, 1].map((q) => `<g transform="translate(${540 + q * 40} 728) scale(.84) rotate(${q * 16 + Math.sin(t * 22 + q) * 8})"><rect x="-13" y="-70" width="26" height="70" rx="12" fill="#1E1E26"/><ellipse cx="0" cy="-78" rx="32" ry="15" fill="#0d0d12"/></g>`).join("") : ""}
      ${X.label(540, 370, "35 mph", 150, "#ffe66d", seg(hit, 0, 0.1), lerp(1.4, 1, easeOut(seg(hit, 0, 0.3))))}${X.label(540, 440, "56 km/h", 56, "#9fd0ff", seg(hit, 0.15, 0.3))}</g>` + fx.impact(540, 730, seg(hit, 0, 0.35), { n: 14 }) : "";
  return boardFrame(t, env, b.speed - 0.15, fact + `<g opacity="${seg(t, b.every - 0.05, b.every + 0.15)}">${marks}${faller}</g>` + crash, hit > 0 ? F("worried", { lid: 0.2, look: 0 }) : TALK, hit > 0 ? "palm" : "point", hit > 0 ? pulse(t, b.hit + 0.3, b.strange - 0.2, 0.2) : pulse(t, b.every + 0.2, b.hit - 0.1, 0.2));
}
function rYou(t, env) {                                     // "You pull on the planet exactly as hard as it pulls on you. It's just too heavy to care."
  const b = env.beats, R = 900, ex = 540, ey = 1560, top = ey - R, eq = popIn(t, b.exactly - 0.05, 0.25), care = seg(t, b.care, b.care + 0.3), hop = Math.abs(Math.sin(clamp((t - b.care - 0.5) / 0.9) * Math.PI * 2)) * 60;
  const e = ants({ ...F("proud", { lid: 0.3 }), look: 0, lookY: 0.6 }, 4, 4);
  const aL = popIn(t, b.strange + 0.5, 0.2), aR = popIn(t, b.youpull - 0.05, 0.2);
  return boardFrame(t, env, b.strange - 0.15, X.earth(ex, ey, R, t * 0.05, null)
    + `<g opacity="${care}"><ellipse cx="430" cy="${top + 150}" rx="34" ry="${34 * (1 - 0.72)}" fill="#fff"/><ellipse cx="650" cy="${top + 150}" rx="34" ry="${34 * (1 - 0.72)}" fill="#fff"/><circle cx="436" cy="${top + 152}" r="8" fill="#0a1030"/><circle cx="656" cy="${top + 152}" r="8" fill="#0a1030"/><path d="M390 ${top + 118} H470 M610 ${top + 118} H690" stroke="#0a3f86" stroke-width="10" stroke-linecap="round"/><path d="M500 ${top + 222} H580" stroke="#0a1030" stroke-width="9" stroke-linecap="round"/></g>`
    + X.arrow(300, top - 330, 300, top - 40, 26, "#ffe66d", t * 1.5, aL) + X.label(300, top - 372, "IT PULLS YOU", 56, "#ffe66d", aL)
    + X.arrow(780, top - 40, 780, top - 330, 26, "#ff7ab8", t * 1.5, aR) + X.label(780, top - 372, "YOU PULL IT", 56, "#ff9fd0", aR)
    + `<g transform="translate(540 ${top - 330}) scale(${eq})">${X.label(0, 50, "=", 170, "#fff")}</g>`
    + peek(e, { shadow: false, id: "tiny" }, 540, top + 12 - hop, 0.27)
    + X.label(540, top + 330, "TOO HEAVY TO CARE", 64, "#fff", care), blend(F("skeptical"), TALK, 0.3), "shrug", pulse(t, b.care, b.phone - 0.2, 0.2));
}
function rPhone(t, env) {                                   // "Drop your phone: the planet takes it."
  const b = env.beats, G = 930, d = t - (b.phone + 0.35), fall = d > 0 ? Math.min(1, (d / (b.takes + 0.45 - b.phone - 0.35)) ** 2) : 0, py = lerp(G - 330, G - 50, fall), crack = seg(t, b.takes + 0.45, b.takes + 0.55);
  return boardFrame(t, env, b.phone - 0.15, `<rect x="0" y="${G}" width="${W}" height="14" rx="7" fill="#5661a8"/><ellipse cx="400" cy="${G + 8}" rx="130" ry="14" fill="#03040c" opacity=".5"/>`
    + X.human(400, G, 1.7, { shirt: "#7fd4a8", hair: "#2a2a2a", armR: d > 0 ? -50 : -100, mood: fall >= 1 ? "shock" : "ok" }) + X.phone(590, py, 62, fall * 160 + (fall >= 1 ? 70 : 0), crack)
    + X.arrow(760, G - 520, 760, G - 200, 24, "#ffe66d", t * 2, seg(d, -0.1, 0.05) * (1 - fall)) + X.label(760, G - 560, "GRAVITY", 60, "#ffe66d", seg(d, -0.1, 0.05) * (1 - fall))
    + fx.impact(590, G - 50, seg(t, b.takes + 0.45, b.takes + 0.7), { n: 10 }), TALK, null, 0);
}
function rHumans(t, env) {                                  // "Humans do this daily... and still act surprised."
  const b = env.beats, G = 900, cols = [["#ffb347", "#5a3a22"], ["#7fd4a8", "#2a2a2a"], ["#ff8fa8", "#8a5a2a"]];
  return boardFrame(t, env, b.humans - 0.12, `<rect x="0" y="${G}" width="${W}" height="14" rx="7" fill="#5661a8"/>` + [0, 1, 2].map((i) => { const x = 220 + i * 320, a = t - (b.humans + 0.1 + i * 0.3), fall = clamp(a / 0.35) ** 2, sur = t - (b.surprised + i * 0.12);
    return X.human(x - 40, G, 1.12, { shirt: cols[i][0], hair: cols[i][1], armR: a > 0 ? -50 : -100, mood: sur > 0 ? "shock" : "ok", stretch: sur > 0 ? Math.max(0, spring(sur, 8, 22)) * 0.1 : 0 })
      + X.phone(x + 72, lerp(G - 210, G - 44, fall), 52, fall * 150 + (fall >= 1 ? 80 : 0), fall >= 1 ? 1 : 0) + (sur > 0 ? X.label(x - 40, G - 400 - Math.max(0, spring(sur, 6, 20)) * 40, "!", 150, "#ffe66d", 1, easeOutBack(clamp(sur / 0.2))) : ""); }).join(""),
    F("deadpan", { look: 0.5 }), "palm", pulse(t, b.surprised + 0.1, b.sum1 - 0.2, 0.2));
}
function rSummary(t, env) {                                 // "So: everything pulls everything. Heavier pulls harder. That's gravity."
  const b = env.beats, row = (y, at, inner, text, col = "#fff") => { const a = popIn(t, at, 0.3); return a <= 0 ? "" : `<g transform="translate(540 ${y}) scale(${a}) translate(-540 ${-y})"><rect x="80" y="${y - 108}" width="920" height="216" rx="40" fill="#1c2250" stroke="#7fd4ff" stroke-width="5" opacity=".95"/>${inner}${X.label(680, y + 24, text, 62, col)}</g>`; };
  return boardFrame(t, env, b.sum1 - 0.15, row(330, b.sum1, X.apple(180, 330, 50) + X.cup(340, 330, 48) + X.arrow(232, 312, 290, 312, 8, "#ffe66d", t) + X.arrow(290, 352, 232, 352, 8, "#ffe66d", t), "EVERYTHING PULLS")
    + row(600, b.sum2, X.rock(160, 620, 34) + X.rock(320, 600, 76) + X.arrow(262, 600, 206, 612, 14, "#ffe66d", t), "HEAVIER PULLS HARDER")
    + row(870, b.sum3, X.earth(250, 870, 86, t * 0.2), "THAT'S GRAVITY", "#ffe66d"), F("proud", { lid: 0.3 }), "point", pulse(t, b.sum1 + 0.2, b.question - 0.25, 0.2));
}
function rQuestion(t, env) {                                // "Which raises a question, Commander." he looks up
  const b = env.beats, up = ease(seg(t, b.question + 0.2, b.question + 0.6));
  let e = blend(TALK, F("skeptical", { lookY: -1, look: 0.3 }), up); e = ants(speak({ ...e, lid: Math.max(e.lid, blinks(t, 2.6)) }, env, t), 6 * up, 6 * up);
  return [...dumpsterPeek(t, env, e, { armL: { x: 322, y: 598 }, armR: { x: 878, y: 598 }, nod: -0.5 * up, tilt: 3 * up }, { peel: 1, cam: fx.camera(t, [[b.question, 540, 1250, 1.42, 0], [b.moon, 540, 1200, 1.6, 0]]) }), caps(env, t)];
}
function rMoon(t, env) {                                    // "It even holds their Moon. So why doesn't the Moon fall on them?"
  const b = env.beats, loom = ease(seg(t, b.why + 0.2, b.out - 0.1)), a = t * 0.9 - 0.6, ex = 540, ey = lerp(690, 800, loom), rx = 380, ry = 140;
  const mx = lerp(ex + Math.cos(a) * rx, 540, loom), my = lerp(ey - 60 + Math.sin(a) * ry, 440, loom), mr = lerp(60, 250, loom), behind = Math.sin(a) < 0 && loom < 0.05;
  const moonG = X.moon(mx, my, mr), leash = loom < 0.4 ? `<path d="M${ex} ${ey - 60} L${mx} ${my}" stroke="#ffe66d" stroke-width="5" stroke-dasharray="14 12" opacity="${(0.8 * (1 - loom / 0.4)).toFixed(2)}"/>` : "";
  const ring = `<ellipse cx="${ex}" cy="${ey - 60}" rx="${rx}" ry="${ry}" fill="none" stroke="#7fd4ff" stroke-width="4" stroke-dasharray="6 14" opacity="${0.6 * (1 - loom)}"/>`;
  return boardFrame(t, env, b.moon - 0.12, ring + (behind ? moonG : "") + X.earth(ex, ey, lerp(170, 200, loom), t * 0.2) + leash + (behind ? "" : moonG)
    + X.label(850, 900, "?", 260, "#ffe66d", seg(t, b.why + 0.9, b.why + 1.1), easeOutBack(seg(t, b.why + 0.9, b.why + 1.2))), blend(TALK, F("worried", { lookY: -1, look: 0.4, lid: 0.05 }), loom), null, 0, { nod: -0.4 * loom });
}
function rOut(t, env) {                                     // "Investigating. Peek out." he tips his hat and shuts the lid
  const b = env.beats, tip = pulse(t, b.out + 0.05, b.peekout + 0.1, 0.15), sink = easeIn(seg(t, b.peekout + 0.2, b.peekout + 0.5)), lid = lerp(0.12, 1, easeIn(seg(t, b.peekout + 0.28, b.peekout + 0.5)));
  let e = blend(F("sly", { look: 0 }), F("smug", { look: 0.6 }), seg(t, b.peekout, b.peekout + 0.2)); e = ants(speak(e, env, t), 4, 4);
  return [...dumpsterPeek(t, env, e, { armL: { x: 322, y: 598 }, armR: tip > 0.02 ? { x: lerp(878, 800, tip), y: lerp(598, 300, tip), front: true } : { x: 878, y: 598 }, hatRot: -6 * tip, nod: 0.4 * tip }, { peel: 1, rise: 1 - sink * 0.75, lid }), caps(env, t)];
}

// ============================================================ TAG: Crowe finds the capsule; the next question lands; cut to black
function tag(t, env) {
  const u = t - env.ts, c = fx.shake(fx.camera(u, [[0, CAP_X - 150, 1230, 0.86, 0], [4.2, CAP_X + 30, 1230, 0.98, 0]]), t, 3, 9, 2);
  const lean = ease(seg(u, 0.5, 1.4)) * 10, cx = CAP_X - 520, aim = lerp(-8, 14, ease(seg(u, 0.3, 1.2))), [tx, ty] = N.croweTorch(aim);
  const bx = cx + tx * 0.99, by = N.FLOOR - 4 + ty * 0.99, sweep = lerp(8, 22, ease(seg(u, 2.3, 3.6)));
  const rate = lerp(3, 12, clamp(u / 4.2)), green = 0.5 + 0.5 * Math.sign(Math.sin(u * rate * 3.1)), q = seg(u, 2.55, 2.75);
  const plane = `<g transform="translate(${CAP_X} ${N.FLOOR + 30})">${N.crater()}<g transform="rotate(-9) scale(1.25)">${N.capsule(1, 0)}</g></g>` + N.footprints(CAP_X + 300, N.EDGE - 10, PY + 14, 0.5 + 0.5 * seg(u, 2.3, 3.2))
    + `<g transform="translate(${cx} ${N.FLOOR - 4}) scale(0.99)">${N.crowe({ aim, lean, glint: 0.7 + 0.3 * Math.sin(t * 9), green })}</g>` + fx.beam(bx, by, sweep, 2400, 16, "#fff3d6", 0.5, 10) + fx.glow(bx, by, 130, "#fff6dc", 0.9);
  return [...roof(c, t, t, { plane, hut: false, far: 1.4 }), ...finish(t, t, { vig: 0.72 }), q > 0 ? "" : caps(env, t, OUT),
    X.label(540, 1215, "NEXT REPORT", 62, "#7fd4ff", q), X.label(540, 1330, "WHY DOESN'T", 96, "#fff", q, lerp(1.2, 1, easeOut(seg(u, 2.55, 2.85)))), X.label(540, 1440, "THE MOON FALL?", 104, "#ffe66d", seg(u, 2.7, 2.9), lerp(1.2, 1, easeOut(seg(u, 2.7, 3.0)))),
    fx.flash(seg(u, 4.08, 4.2) ** 2, "#000")];
}

export function draw(t, env) {
  if (!env) return fx.frame(() => `<text x="40" y="100" fill="#fff" font-size="40">run audio/ep01_sound.py first (out/ep01.json)</text>`);
  const b = env.beats;
  let f;
  if (t < env.rs) f = t < 0.7 ? porthole : t < 1.3 ? arrive : t < 4.2 ? hatch : t < 4.8 ? toEdge : t < 8.0 ? float : alleyFall;
  else if (t < env.ts) f = t < b.me - 0.06 ? rDumpster : t < b.gravity - 0.05 ? rMe : t < b.pulls - 0.15 ? rGravity : t < b.heavier - 0.12 ? rPulls : t < b.planet - 0.1 ? rHeavier : t < b.down - 0.15 ? rPlanet
    : t < b.speed - 0.15 ? rDown : t < b.strange - 0.15 ? rSpeed : t < b.phone - 0.15 ? rYou : t < b.humans - 0.12 ? rPhone : t < b.sum1 - 0.15 ? rHumans : t < b.question - 0.12 ? rSummary : t < b.moon - 0.12 ? rQuestion : t < b.out - 0.12 ? rMoon : rOut;
  else f = tag;
  return fx.frame(() => f(t, env));
}
