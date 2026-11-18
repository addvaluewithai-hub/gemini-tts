// Peek · Episode 2 · WHY DOESN'T THE MOON FALL? (about 88 s). Timing comes from out/ep02.json (audio/ep02_sound.py, mouths.cjs).
//  Cold open (0 - rs): close on his terrified face under the enormous Moon; three apples thrown at it, harder each time,
//    each landing farther; the bite; the third breaks a window; Crowe's detector in the alley; "...Oops."; the title.
//  Report A (rs - is): the rooftop, then pictures on the board with Peek on the roof strip below; cut on "Because it..."
//  Interruption (is - bs): the stairwell door, Crowe with the bitten apple, the Commander on the radio, the beam passes.
//  Report B (bs - ts): "...is falling." whispered from behind the AC unit; the board continues, darker, the torch sweeping.
//  Tag (ts - end): Crowe at the AC with the apple: "Small mouth... big teeth."  NEXT REPORT / WHY DO ASTRONAUTS FLOAT?
// Layout keeps faces, captions and titles out of the Shorts interface (bottom 480 px, right 190 px).
import { MOUTHS } from "../lib/peek.js";
import * as fx from "../lib/fx.js";
import * as N from "../sets/night.js";
import * as M from "../sets/moon.js";
import * as X from "../lib/explain.js";
import { K, PY, F, blend, ants, speak, lv, blink, blinks, peek, night, finish, rainBack, roof, PANIC, DREAD, DEADPAN } from "../lib/act.js";

const { seg, lerp, ease, easeOut, easeIn, easeOutBack, kf, clamp, spring, pulse, noise, W, H } = fx;
export const ENV = "out/ep02.json";
export const DUR = 88;
export const duration = (env) => (env ? env.dur : DUR);
const caps = (env, t, o) => (env ? X.captions(env.words, t, o) : "");
const OUT = { y: 1340 };                                    // captions in the live shots
const BOARD = { y: 1100 };
const FEAR = F("worried", { lid: 0, eyeScale: 1.2, pupil: 0.6, browTilt: 1, sweat: 0.9, lookY: -0.9, look: 0.5, m: { ...MOUTHS.grimace, jaw: 0.25, tongue: 0 } });
const GLARE = F("angry", { lookY: -0.7, look: 0.6, lid: 0.35 });
const TALK = F("neutral", { lid: 0.3, browL: -0.1, browR: 0.3 });
const HUSH = F("worried", { lid: 0.12, lookY: 0, look: -0.6, browTilt: 0.5, m: { ...MOUTHS.flat, tongue: 0 } });

// the hand of a posed Peek, in world coordinates (the rig's hand target mapped through the figure's placement)
// the roof under his feet in the close shots (screen space): parapet top at y
const ground = (y) => `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="#141a44"/><rect x="0" y="${y}" width="${W}" height="10" fill="#4a4680"/><rect x="0" y="${y + 10}" width="${W}" height="4" fill="#6d6ab0" opacity=".5"/>
  <rect x="0" y="${y + 14}" width="${W}" height="${H - y}" fill="#05071a" opacity=".35"/>`;
const hand = (x, y, k, h) => [x - 600 * k + h.x * k, y - 1010 * k + h.y * k];
const NOMOON = { x: -5000, y: -5000, r: 1 };
const sky = (moon) => N.sky({ x: -5000, y: -5000, r: 1 }) + M.bigMoon(moon.x, moon.y, moon.r);
const AC = { x0: N.AC_X - 170, x1: N.AC_X + 170, top: N.FLOOR - 350 };

// a throw: the arm pose over time. cock at c0..c1, whip forward at rel, follow through after
function throwArm(t, c0, rel, big = 1) {
  const cock = ease(seg(t, c0, rel - 0.08)), whip = easeOut(seg(t, rel - 0.08, rel + 0.06)), back = ease(seg(t, rel + 0.35, rel + 0.8));
  const cx = lerp(800, 850 - 40 * big, cock), cy = lerp(760, 330 - 40 * big, cock);
  if (whip <= 0) return { x: cx, y: cy };
  const fx_ = lerp(cx, 1010, whip), fy = lerp(cy, 420, whip);
  return { x: lerp(fx_, 790, back), y: lerp(fy, 760, back) };
}
// a ballistic apple in world coordinates: from (x0, y0) at t0 to (x1, y1) at t1, rising h above the higher end
function lob(t, t0, t1, x0, y0, x1, y1, h) {
  const u = seg(t, t0, t1), top = Math.min(y0, y1) - h;
  // a parabola through the two ends with its peak at height `top`: solve for the peak's time fraction
  const a0 = y0 - top, a1 = y1 - top, s = Math.sqrt(a0) / (Math.sqrt(a0) + Math.sqrt(a1));
  const y = u < s ? top + a0 * ((s - u) / s) ** 2 : top + a1 * ((u - s) / (1 - s)) ** 2;
  return [lerp(x0, x1, u), y];
}

const puff = (x, y, p, k = 1) => (p <= 0 || p >= 1 ? "" : [0, 1, 2, 3, 4].map((i) => `<ellipse cx="${(x + Math.cos(i * 1.4 + 0.3) * (20 + 70 * p) * k).toFixed(1)}" cy="${(y - 6 - Math.abs(Math.sin(i * 1.4)) * 30 * p * k).toFixed(1)}" rx="${(22 * k * (1 - p * 0.4)).toFixed(1)}" ry="${(14 * k * (1 - p * 0.4)).toFixed(1)}" fill="#c9d2ff" opacity="${(0.45 * (1 - p)).toFixed(2)}"/>`).join(""));
// ============================================================ COLD OPEN
const REL = { 1: 0.68, 2: 3.15, 3: 5.95 };                 // the apple leaves his hand (matches the sound script)
const C1_MOON = { x: 600, y: 470, r: 470 };
function closeFear(t, env) {                                // 0 - 0.62: his terrified face, the Moon filling the sky, arm cocked
  const k = 1.55, px = 470, py = 1850, sh = noise(t * 30, 1) * 6;
  const e = ants(speak({ ...FEAR, lid: 0, look: 0.55 + noise(t * 9, 3) * 0.1 }, env, t), -30 + noise(t * 25, 2) * 10, -30 - noise(t * 25, 4) * 10);
  const arm = { x: lerp(820, 880, ease(seg(t, 0, 0.5))), y: lerp(420, 360, ease(seg(t, 0, 0.5))) };
  const [hx, hy] = hand(px, py, k, arm);
  const f = night("Lc1", [{ color: "#fff3d6", az: 45, power: 1.6, size: 12 }, { color: "#9fd0ff", az: 225, power: 0.5, size: 8 }], [0.82, 0.72, 0.98], 0.04);
  const c = fx.camera(t, [[0, 540, 960, 1.04, 0], [0.62, 540, 960, 1.0, 0]]);
  return [fx.layer(sky(C1_MOON), c, 0.05), fx.layer(N.cityFar(), { ...c, y: c.y - 120 }, 0.12, { blur: 4 }),
    fx.layer(peek(e, { filter: f, shadow: false, turn: 0.35, nod: -0.5, tilt: sh * 0.3, armR: arm, armL: { x: 380, y: 700 } }, px + sh, py, k) + X.apple(hx + 10, hy - 30, 62, 20), c, 1),
    ...finish(t, t, { o: 0.18, vig: 0.62, grade: ["#2a3cc0", 0.22], warm: 0.05 }), fx.flash(seg(t, 0.56, 0.62) * 0.4, "#fff8e0"), caps(env, t, OUT)];
}

const WIDE_MOON = { x: 690, y: 560, r: 380 };
function throw1(t, env) {                                   // 0.62 - 2.4: wide, low; "Back!"; the apple goes up and drops just in front of him
  const k = 0.62, px = 1260, c = fx.shake(fx.camera(t, [[0.62, 1560, 1300, 0.86, 2], [2.4, 1590, 1300, 0.9, 0]]), t, 3, 3, 3);
  const arm = throwArm(t, 0.5, REL[1], 0.6);
  const e = ants(speak({ ...FEAR, sweat: 0.6, look: 0.6, lookY: -0.8 }, env, t), -20, -20);
  const f = night("Lt1", [{ color: "#fff3d6", az: 45, power: 1.5, size: 10 }], [0.82, 0.72, 0.98], 0.02);
  const [hx, hy] = hand(px, PY, k, arm), land = [1520, N.FLOOR + 20];
  let ap = "";
  if (t < REL[1]) ap = X.apple(hx, hy - 20, 34, 0);
  else if (t < 1.92) { const [x, y] = lob(t, REL[1], 1.92, hx, hy - 20, land[0], land[1], 420); ap = X.apple(x, y, 34, (t - REL[1]) * 500); }
  else { const r = seg(t, 1.92, 2.4), x = land[0] + easeOut(r) * 70, b = Math.abs(Math.sin(r * 6)) * 30 * (1 - r); ap = X.apple(x, land[1] - b, 34, 500 + r * 300); }
  const plane = M.bag(2).replace(/^/, `<g transform="translate(${px - 190} ${N.FLOOR + 30}) scale(.55)">`) + "</g>" + peek(e, { filter: f, turn: 0.55, armR: arm, armL: { x: 400, y: 720 } }, px, PY, k) + ap;
  return [fx.layer(N.sky({ x: -5000, y: -5000, r: 1 }), c, 0.04), fx.layer(M.bigMoon(WIDE_MOON.x, WIDE_MOON.y, WIDE_MOON.r), c, 0.04),
    fx.layer(N.cityFar(), c, 0.12, { blur: 2.6 }), fx.layer(N.cityMid(), c, 0.3, { blur: 1.6 }), fx.layer(N.cityNear(), c, 0.55, { blur: 0.8 }), rainBack(t, 8, 1, 0.18), fx.layer(N.roofBack() + N.roofFloor() + plane, c, 1),
    puff(...fx.toScreen(c, land[0], land[1]), seg(t, 1.92, 2.3)), ...finish(t, t, { o: 0.2, vig: 0.6, grade: ["#2a3cc0", 0.25], warm: 0.06 }), caps(env, t, OUT)];
}

function throw2(t, env) {                                   // 2.4 - 4.3: a second apple from the bag, bigger; it lands on the roof across the alley
  const k = 0.7, px = N.EDGE - 260, c = fx.camera(t, [[2.4, px + 40, 1260, 1.05, 0], [3.1, px + 60, 1260, 1.05, 0], [4.3, N.EDGE + 640, 1420, 0.72, 0]]);
  const grab = seg(t, 2.45, 2.8), arm = t < 2.8 ? { x: lerp(780, 600, Math.sin(grab * Math.PI)), y: lerp(760, 900, Math.sin(grab * Math.PI)) } : throwArm(t, 2.8, REL[2], 0.9);
  const e = ants(speak({ ...F("angry", { lookY: -0.8, look: 0.7 }), sweat: 0.4 }, env, t), -10, -10);
  const f = night("Lt2", [{ color: "#fff3d6", az: 45, power: 1.5, size: 10 }], [0.82, 0.72, 0.98], 0.02);
  const [hx, hy] = hand(px, PY, k, arm), land = [N.EDGE + 700, N.FLOOR + 238];
  const [h0x, h0y] = hand(px, PY, k, throwArm(REL[2], 2.8, REL[2], 0.9)), s0 = fx.toScreen(c, h0x, h0y - 20), s1 = fx.toScreen(c, land[0], land[1] - 22, 0.9), zk = c.z;
  let ap = "";                                              // the flight is drawn on the screen: from his hand (depth 1) to the roof across the alley (depth 0.9)
  if (t < REL[2]) ap = t > 2.62 ? X.apple(...fx.toScreen(c, hx, hy - 20), 38 * zk, 0) : "";
  else if (t < 4.08) { const [x, y] = lob(t, REL[2], 4.08, s0[0], s0[1], s1[0], s1[1], 520); ap = X.apple(x, y, 38 * zk, (t - REL[2]) * 600); }
  else ap = X.apple(s1[0] + seg(t, 4.08, 4.3) * 30, s1[1], 38 * zk, 700);
  const plane = `<g transform="translate(${px - 210} ${N.FLOOR + 30}) scale(.6)">${M.bag(t > 2.62 ? 1 : 2)}</g>` + peek(e, { filter: f, turn: 0.6, armR: arm, armL: { x: 420, y: 700 }, squash: 1 - 0.04 * pulse(t, REL[2] - 0.1, REL[2] + 0.2, 0.1) }, px, PY, k);
  return [fx.layer(N.sky(NOMOON), c, 0.04), fx.layer(M.bigMoon(WIDE_MOON.x + 120, WIDE_MOON.y - 40, WIDE_MOON.r * 0.95), c, 0.04), fx.layer(N.cityFar(), c, 0.12, { blur: 2.4 }), fx.layer(N.cityMid(), c, 0.3, { blur: 1.4 }),
    fx.fog(t, { y: 1250, o: 0.2 }), fx.layer(N.cityNear(), c, 0.55, { blur: 0.8 }), rainBack(t, 8, 1, 0.18), fx.layer(N.acrossAlley(), c, 0.9),
    fx.layer(N.roofBack() + N.roofFloor() + plane, c, 1), ap, puff(...fx.toScreen(c, land[0], land[1] - 10, 0.9), seg(t, 4.08, 4.3), 0.7),
    ...finish(t, t, { o: 0.2, vig: 0.6, grade: ["#2a3cc0", 0.25], warm: 0.06 }), caps(env, t, OUT)];
}

function throw3(t, env) {                                   // 4.3 - 6.5: the glare, the bite, the spin, "GET! BACK!", the whip pan
  const k = 1.15, px = 430, py = 1700;
  const bite = seg(t, 4.5, 4.66), chew = t > 4.7 && t < 5.25, spin = seg(t, 5.25, 5.85);
  const toMouth = pulse(t, 4.42, 4.82, 0.12);
  let arm = t < 5.25 ? { x: lerp(820, 650, toMouth), y: lerp(640, 520, toMouth) } : throwArm(t, 5.4, REL[3], 1.2);
  const e0 = t < 4.7 ? GLARE : t < 5.25 ? F("deadpan", { lid: 0.45, lookY: -0.6, look: 0.6, m: { ...MOUTHS.flat, jaw: chew ? Math.abs(Math.sin((t - 4.7) * 22)) * 0.35 : 0, tongue: 0 } }) : F("furious", { lookY: -0.6, look: 0.8 });
  const e = ants(t < 5.25 && t > 4.7 ? e0 : speak({ ...e0, m: bite > 0 && bite < 1 ? { ...MOUTHS.o, w: 0.7, jaw: 0.8 } : e0.m }, env, t), -14, -14);
  const turn = t < 5.25 ? 0.4 : Math.cos(spin * Math.PI * 2) * 0.9;
  const f = night("Lt3", [{ color: "#fff3d6", az: 45, power: 1.6, size: 12 }, { color: "#9fd0ff", az: 225, power: 0.5, size: 8 }], [0.82, 0.72, 0.98], 0.03);
  const [hx, hy] = hand(px, py, k, arm);
  const whip = seg(t, REL[3], 6.5), c = fx.camera(t, [[4.3, 540, 960, 1.0, 0], [REL[3], 560, 960, 1.0, 0], [6.5, 1900, 700, 1.0, -6]], easeIn);
  let ap = "";
  if (t < REL[3]) ap = t > 4.42 ? M.bitten(hx, hy - 30, 66, 20, t > 4.62 ? 1 : 0) : (t > 4.3 ? X.apple(hx, hy - 30, 66, 20) : "");
  else { const u = t - REL[3]; ap = M.bitten(hx + u * 2600, hy - 30 - u * 1500 + u * u * 300, 66, u * 900); }
  const crumbs = bite > 0 && t < 5.0 ? [0, 1, 2, 3].map((i) => `<circle cx="${640 + i * 18 + (t - 4.62) * 200 * (i - 1.5)}" cy="${940 + (t - 4.62) * 600 + i * 6}" r="7" fill="#fff4d2"/>`).join("") : "";
  return [fx.layer(N.sky(NOMOON), c, 0.04), fx.layer(M.bigMoon(760, 420, 520), c, 0.06), fx.layer(N.cityFar(), { ...c, y: c.y - 160 }, 0.12, { blur: 4 }),
    fx.layer(ground(py - 40), c, 1), fx.layer(peek(e, { filter: f, shadow: false, turn, nod: -0.3, armR: arm, armL: { x: 400, y: 720 }, tilt: Math.sin(spin * Math.PI * 2) * 6, squash: 1 + 0.05 * Math.sin(spin * Math.PI) }, px, py, k) + ap + crumbs, c, 1),
    whip > 0 ? fx.blurred(fx.speedLines(t, { angle: -20, o: 0.6 * whip, n: 24 }), 2) : "",
    ...finish(t, t, { o: 0.18, vig: 0.6, grade: ["#2a3cc0", 0.22], warm: 0.06, streak: 1 + whip * 2 }), caps(env, t, OUT)];
}

function window_(t, env) {                                  // 6.5 - 7.4: long lens on a lit window across the city; the apple smashes it
  const hit = 6.86, p = seg(t, hit, hit + 0.55), c = fx.shake(fx.camera(t, [[6.5, 980, 560, 2.2, 0], [7.4, 990, 600, 2.3, 0]]), t, hit < t ? 30 * Math.exp(-(t - hit) * 8) : 2, 5, 12);
  const u = t - 6.5, ax = t < hit ? lerp(640, 990, u / (hit - 6.5)) : 990 + (t - hit) * 60, ay = t < hit ? lerp(380, 520, u / (hit - 6.5)) : 520 + (t - hit) * 300 + 1600 * (t - hit) ** 2;
  return [fx.layer(N.alley() + M.windowPane(920, 420, 150, 210, t < hit ? 0 : p, t) + M.bitten(ax, ay, 26, u * 900), c, 1),
    fx.flash(t > hit ? Math.exp(-(t - hit) * 14) * 0.6 : 0, "#e8f6ff"), ...finish(t, t, { o: 0.15, vig: 0.7, grade: ["#3a2a90", 0.22], warm: 0.1 }), caps(env, t, OUT)];
}

function alleyCrowe(t, env) {                               // 7.4 - 9.2: the alley; the apple bounces to Crowe's shoe; the detector screams; he looks up
  const c = fx.camera(t, [[7.4, 520, 1300, 1.18, 0], [9.2, 540, 1250, 1.24, 0]]);
  const cx = 360, bounce = [[7.4, 300, 900], [7.55, 520, 1735], [7.72, 600, 1690], [7.85, 640, 1735], [8.3, 470, 1735]];
  let ax, ay;
  if (t < 7.55) { const u = seg(t, 7.4, 7.55); ax = lerp(560, 520, u); ay = lerp(1150, 1735, u * u); }
  else if (t < 7.85) { const u = seg(t, 7.55, 7.85); ax = lerp(520, 640, u); ay = 1735 - Math.sin(u * Math.PI) * 120; }
  else { const u = easeOut(seg(t, 7.85, 8.3)); ax = lerp(640, cx + 110, u); ay = 1735; }
  const pick = ease(seg(t, 8.35, 8.75)), raise = ease(seg(t, 8.75, 9.1)), lean = pick * 14 - raise * 18;
  const aim = lerp(-8, -30, raise), [tx_, ty_] = N.croweTorch(aim), tipX = cx + tx_ * 0.78, tipY = 1745 + ty_ * 0.78;
  const apX = lerp(ax, tipX + 70, pick), apY = lerp(ay, tipY - 10, pick) - raise * 50;
  const red = Math.sin(t * 40) > 0 ? 1 : 0.3;
  const crowe = `<g transform="translate(${cx} 1745) scale(.78)">${N.crowe({ aim, lean, glint: 0.5 + 0.5 * raise, green: 0 })}<g transform="rotate(${lean} 0 -480)"><rect x="-128" y="-528" width="40" height="30" rx="4" fill="#ff3b3b" opacity="${red}"/></g></g>`;
  return [fx.layer(N.alley() + N.dumpsterBack() + N.dumpster(1, 0) + crowe + (t < 9.2 ? M.bitten(apX, apY, 24, (8.3 - Math.min(t, 8.3)) * 600) : ""), c, 1),
    fx.glow(...fx.toScreen(c, cx - 85, 1745 - 400), 90, "#ff3b3b", 0.5 * red), pick > 0.3 ? fx.glow(...fx.toScreen(c, apX, apY), 120, "#fff6dc", 0.6 * pick) : "", ...finish(t, t, { o: 0.25, vig: 0.66, grade: ["#3a2a90", 0.24], warm: 0.1 }), caps(env, t, OUT)];
}

function oops(t, env) {                                     // 9.2 - rs: Peek, small, guilty; the Moon is still there; the title
  const k = 0.95, px = 470, py = 1640, c = fx.camera(t, [[9.2, 540, 960, 1.0, 0], [env.rs, 540, 930, 1.05, 0]]);
  const e = ants(speak({ ...F("worried", { lid: 0.35, lookY: -0.2, look: 0.7, browTilt: 0.7, m: { ...MOUTHS.flat, w: 0.6, tongue: 0 } }), lid: Math.max(0.35, blink(t, [9.45, 10.9])) }, env, t), -26, -26);
  const f = night("Lo", [{ color: "#fff3d6", az: 45, power: 1.5, size: 12 }], [0.82, 0.72, 0.98], 0.03);
  const title = `<g opacity="${seg(t, 10.3, 10.45)}">${X.label(540, 1290, "FIELD REPORT #2", 70, "#ffe66d", 1, 1)}${X.label(540, 1425, "THE MOON", 150, "#fff", 1, lerp(1.25, 1, easeOut(seg(t, 10.32, 10.55))))}</g>`;
  return [fx.layer(N.sky(NOMOON), c, 0.04), fx.layer(M.bigMoon(780, 460, 480), c, 0.06), fx.layer(N.cityFar(), { ...c, y: c.y - 150 }, 0.12, { blur: 4 }),
    fx.layer(ground(py - 40), c, 1), fx.layer(peek(e, { filter: f, shadow: false, turn: 0.5, nod: 0.3, shrug: 0.3, armR: { x: 760, y: 790 }, armL: { x: 440, y: 790 } }, px, py, k), c, 1),
    ...finish(t, t, { o: 0.18, vig: 0.62, grade: ["#2a3cc0", 0.24], warm: 0.05 }), t < 10.3 ? caps(env, t, OUT) : "", title];
}


// ============================================================ THE REPORT
const ZONE = { x: 40, y: 190, w: 1000, h: 820 }, ZC = [540, 600];       // the picture panel and its centre
const popIn = (t, at, d = 0.3) => easeOutBack(seg(t, at, at + d));
const fade = (t, a, d = 0.2) => seg(t, a, a + d);
// the roof strip under the board: an AC unit at the left, Peek right of it (B: pressed against it, the torch sweeping over)
function strip(t, env, face = TALK, gesture = null, g = 0, o = {}, hide = 0) {
  const e = ants(speak({ ...face, lid: Math.max(face.lid, blinks(t, 2.9)), look: face.look ?? 0.55, lookY: face.lookY ?? -0.6 }, env, t), Math.sin(t * 2) * 3 - hide * 22, Math.sin(t * 2 + 1) * 3 - hide * 22);
  g *= 1 - 0.45 * hide;
  const arms = gesture === "point" ? { armR: { x: lerp(770, 900, g), y: lerp(770, 470, g) + Math.sin(t * 5) * 6 } }
    : gesture === "shrug" ? { armL: { x: lerp(430, 322, g), y: lerp(770, 664, g) }, armR: { x: lerp(770, 878, g), y: lerp(770, 664, g) }, shrug: g }
    : gesture === "palm" ? { armR: { x: lerp(770, 652, g), y: lerp(770, 420, g), front: true } } : {};
  const glow = hide ? 0.25 : 0.6 + 0.3 * Math.sin(t * 5);              // the antennae carry the radio; dimmed while hiding
  const k = 0.66, px = 330 - hide * 20, py = 1750 + hide * 48;
  const tips = [-1, 1].map((sg) => [px + sg * 285 * k, py - 915 * k]);
  const ac = `<g transform="translate(${-20} ${1752}) scale(.62)"><rect x="14" y="-382" width="340" height="400" rx="14" fill="#05071a" opacity=".45"/><rect x="0" y="-400" width="340" height="400" rx="14" fill="#2d3962"/><rect x="0" y="-400" width="340" height="16" rx="8" fill="#5a6aa8"/><rect x="326" y="-400" width="14" height="400" rx="7" fill="#3d4b80"/>${Array.from({ length: 9 }, (_, i) => `<rect x="36" y="${-344 + i * 30}" width="268" height="13" rx="6" fill="#161d3e"/>`).join("")}</g>`;
  const sweep = hide ? (() => { const ph = (t % 7) / 7, on = pulse(ph, 0.1, 0.45, 0.08); return on > 0 ? fx.beam(-260, 1180, lerp(4, 24, seg(ph, 0.1, 0.45)), 1700, 9, "#fff3d6", 0.28 * on, 12) : ""; })() : "";
  return `<rect x="0" y="1722" width="${W}" height="200" fill="#151a46"/><rect x="0" y="1722" width="${W}" height="7" fill="#4a4680"/>` + ac
    + peek(e, { turn: 0.4 - hide * 0.8, tilt: Math.sin(t * 1.7) * 1.5, bob: hide ? 0 : Math.sin(t * 3.1) * 3, squash: 1 - hide * 0.05, ...arms, ...o }, px, py, k)
    + tips.map(([x, y]) => fx.glow(x, y, 46, "#ffe66d", glow * 0.5)).join("") + sweep;
}
function boardFrame(t, env, t0, inner, face, gesture, g, o, { hide = 0, tone = "#161b4a", dark = 0 } = {}) {
  const age = t - t0, slide = (1 - easeOut(clamp(age / 0.22))) * 260, drift = 1 + 0.03 * clamp(age / 4);
  fx.def("zonec", `<clipPath id="zonec"><rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44"/></clipPath>`);
  fx.def("zoneg", `<radialGradient id="zoneg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#232b6e"/><stop offset="1" stop-color="#0b0e30"/></radialGradient>`);
  return [X.board(t, tone), `<rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44" fill="url(#zoneg)"/>
    <g clip-path="url(#zonec)"><g transform="translate(${ZC[0] + slide} ${ZC[1]}) scale(${drift.toFixed(4)}) translate(${-ZC[0]} ${-ZC[1]})" opacity="${clamp(age / 0.12)}">${inner}</g></g>
    <rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44" fill="none" stroke="#7fd4ff" stroke-width="5" opacity=".55"/>`,
    dark ? `<rect width="${W}" height="${H}" fill="#02030c" opacity="${dark}"/>` : "",
    fx.vignette(0.4 + dark * 0.4), strip(t, env, face, gesture, g, o, hide), fx.grain(t, 0.07), caps(env, t, BOARD)];
}
const NOTE = (x, y, text, size, col, o, rot = -5) => (o <= 0 ? "" : `<g transform="rotate(${rot} ${x} ${y})">${X.label(x, y, text, size, col, o)}</g>`);

// ---- live: Peek on the roof by the AC unit, radio on. "Commander. Field report number two."
function rRoof(t, env) {
  const b = env.beats, k = 0.62, px = 1150, c = fx.camera(t, [[env.rs, 1000, 1290, 1.05, 0], [b.bolted, 990, 1280, 1.12, 0]]);
  const e = ants(speak({ ...blend(DEADPAN, TALK, seg(t, b.report - 0.2, b.report + 0.1)), look: -0.3, lid: Math.max(0.3, blinks(t, 2.6)) }, env, t), Math.sin(t * 6) * 6, -Math.sin(t * 6) * 6);
  const f = night("Lr", [{ color: "#fff3d6", az: 45, power: 1.3, size: 10 }, { color: "#9fd0ff", az: 225, power: 0.6, size: 8 }], [0.82, 0.72, 0.98], 0.02);
  const tips = [-1, 1].map((sg) => [px + sg * 285 * k, PY - 915 * k]);
  const radio = tips.map(([x, y]) => fx.glow(x, y, 70, "#ffe66d", 0.8) + [0, 0.5].map((d) => { const a = (t * 2.2 + d) % 1; return `<circle cx="${x}" cy="${y}" r="${24 + a * 70}" fill="none" stroke="#ffe66d" stroke-width="5" opacity="${(0.8 * (1 - a)).toFixed(2)}"/>`; }).join("")).join("");
  const plane = acUnit2() + peek(e, { filter: f, turn: -0.35, armL: { x: 330, y: 560 }, armR: { x: 760, y: 790 } }, px, PY, k) + radio;
  return [fx.layer(N.sky(NOMOON), c, 0.04), fx.layer(M.bigMoon(760, 480, 330), c, 0.04), fx.layer(N.cityFar(), c, 0.12, { blur: 2.6 }), fx.layer(N.cityMid(), c, 0.3, { blur: 1.6 }),
    fx.fog(t, { y: 1250, o: 0.2 }), fx.layer(N.cityNear(), c, 0.55, { blur: 0.8 }), fx.layer(N.roofBack() + N.hut(0) + N.roofFloor() + plane, c, 1),
    ...finish(t, t, { rain: false, vig: 0.62, grade: ["#2a3cc0", 0.25], warm: 0.05 }), caps(env, t, OUT)];
}
// ---- "Their Moon is not bolted to the sky. I checked."
function rBolted(t, env) {
  const b = env.beats, ck = b.checked, mg = seg(t, ck - 0.25, ck + 0.4), ang = mg * Math.PI * 2.2, gx = 790 + Math.cos(ang) * 120, gy = 600 + Math.sin(ang) * 120, stamp = popIn(t, ck + 0.42, 0.25);
  const glass = mg > 0 && mg < 1 ? `<g transform="translate(${gx} ${gy}) rotate(35)"><circle r="70" fill="#9fd0ff" opacity=".18"/><circle r="70" fill="none" stroke="#e6eeff" stroke-width="12"/><rect x="62" y="-14" width="120" height="28" rx="12" fill="#c98a4e"/></g>` : "";
  return boardFrame(t, env, b.bolted - 0.12,
    `<g transform="translate(280 590) scale(${popIn(t, b.bolted)})">${M.boltedMoon(0, 0, 150)}</g>${X.label(280, 330, "HOME", 80, "#c9a3ff", fade(t, b.bolted))}
     <g transform="translate(790 600) scale(${popIn(t, b.bolted + 0.7)})">${M.bigMoon(0, 0, 150, 0.6)}</g>${X.label(790, 330, "HERE", 80, "#ffe66d", fade(t, b.bolted + 0.7))}
     ${glass}${stamp > 0 ? `<g transform="translate(790 820) rotate(-10) scale(${stamp})"><rect x="-190" y="-62" width="380" height="110" rx="12" fill="none" stroke="#ff4f6d" stroke-width="10"/>${X.label(0, 30, "NO BOLTS", 84, "#ff4f6d")}</g>` : ""}`,
    TALK, "point", pulse(t, b.bolted + 0.6, b.falls - 0.2, 0.2));
}
// ---- "And here, everything falls. So: it is coming down."
function rFalls(t, env) {
  const b = env.beats, G = 960, th = popIn(t, b.coming, 0.35), shake = th > 0 ? noise(t * 30, 4) * 6 : 0;
  const things = [[X.apple, 260, 0], [X.cup, 540, 0.2], [X.rock, 820, 0.4]].map(([fn, x, d]) => { const u = clamp((t - b.falls - 0.1 - d) / 0.45), y = lerp(260, G - 60, u * u), o = 1 - fade(t, b.coming - 0.2);
    return u > 0 ? `<g opacity="${o}">${fn(x, y, 56, u * 120)}</g>` : ""; }).join("");
  const city = Array.from({ length: 9 }, (_, i) => { const x = 90 + i * 105, h = 60 + fx.rnd(i * 7) * 120; return `<rect x="${x}" y="${G - h}" width="90" height="${h}" fill="#2a3170"/><rect x="${x + 20}" y="${G - h + 20}" width="16" height="16" fill="#ffcf7a" opacity=".7"/><rect x="${x + 54}" y="${G - h + 50}" width="16" height="16" fill="#ffcf7a" opacity=".7"/>`; }).join("");
  const theory = th > 0 ? `<g opacity="${clamp(th)}"><g transform="translate(0 ${shake + ease(seg(t, b.coming, b.threw)) * 40})">${M.bigMoon(620, 360, 120, 0.7)}</g>${city}
    <path d="M620 510 V${G - 200}" stroke="#ff4f6d" stroke-width="12" stroke-dasharray="26 18" stroke-dashoffset="${-t * 120}"/><path d="M590 ${G - 210} L620 ${G - 160} L650 ${G - 210} Z" fill="#ff4f6d"/>
    ${peek(F("worried", { lid: 0, lookY: -1, look: 0.4, sweat: 0.8 }), { shadow: false, id: "tinyA" }, 330, G, 0.2)}</g>${NOTE(300, 460, "PEEK'S THEORY", 66, "#ff9fd0", th)}` : "";
  return boardFrame(t, env, b.falls - 0.12, `<rect x="40" y="${G}" width="1000" height="60" fill="#2a3170"/>` + things + theory, th > 0 ? F("worried", { lid: 0.1, lookY: -0.7 }) : TALK, th > 0 ? "palm" : "point", th > 0 ? pulse(t, b.coming + 0.1, b.threw - 0.2, 0.2) : pulse(t, b.falls + 0.2, b.coming - 0.1, 0.2));
}
// ---- the throws on the board, and the planet that turns out to be round
const ER = 9000, ETOP = 880;                               // the board's ground: the planet's top at y ETOP when it is huge
const THROWS = [{ R: 230, at: "threw", d: 0.3, dur: 0.45, lab: "HARD" }, { R: 440, at: "harder", d: 0.0, dur: 0.6, lab: "HARDER" }, { R: 740, at: "farther", d: -0.15, dur: 0.75, lab: "HARDEST" }];
const TH = Math.tan(55 * Math.PI / 180), X0 = 180, Y0 = ETOP - 40;
const arcY = (dx, R) => Y0 - TH * dx + ((40 + TH * R) / (R * R)) * dx * dx;   // one parabola per throw, same angle; the speed sets the range
function flatThrows(t, b, o = 1) {
  return THROWS.map((q, i) => { const t0 = b[q.at] + q.d, u = clamp((t - t0) / q.dur); if (u <= 0) return "";
    const n = 40, pts = Array.from({ length: Math.ceil(n * u) + 1 }, (_, j) => { const dx = Math.min(j / n, u) * q.R; return `${j ? "L" : "M"}${(X0 + dx).toFixed(1)} ${arcY(dx, q.R).toFixed(1)}`; }).join("");
    const ax = X0 + u * q.R, ay = arcY(u * q.R, q.R), done = u >= 1;
    return `<g opacity="${o}"><path d="${pts}" fill="none" stroke="#ffe66d" stroke-width="6" stroke-dasharray="4 16" stroke-linecap="round" opacity=".8"/>${done ? "" : X.apple(ax, ay, 26, u * 400)}
      ${done ? `${i < 2 ? X.apple(X0 + q.R, ETOP - 22, 22, 90) : ""}${X.label(X0 + q.R, ETOP + 52, String(i + 1), 46, "#9fd0ff")}${X.label(X0 + q.R * 0.5, arcY(q.R * 0.5, q.R) - 30, q.lab, 44 + i * 8, i === 2 ? "#ffe66d" : "#fff", fade(t, t0 + q.dur))}` : ""}</g>`; }).join("");
}
const house = (x, crash) => `<rect x="${x - 70}" y="${ETOP - 130}" width="140" height="130" fill="#3a4490"/><path d="M${x - 86} ${ETOP - 126} L${x} ${ETOP - 196} L${x + 86} ${ETOP - 126} Z" fill="#5661a8"/>${M.windowPane(x - 34, ETOP - 106, 52, 56, crash ? 0.25 : 0)}`;
const planet = (x, y, R, turn = 0) => { if (R < 600) return X.earth(x, y, R, turn); const id = `pc${Math.round(R)}`;
  return `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${(R * 1.006).toFixed(1)}"/></clipPath><g clip-path="url(#${id})">${X.earth(x, y, R, turn)}</g><circle cx="${x}" cy="${y}" r="${(R * 1.003).toFixed(1)}" fill="none" stroke="#7fd4ff" stroke-width="8" opacity=".45"/>`; };
function tinyPeek(x, y, e, o = {}, k = 0.2) { return peek(e, { shadow: false, id: o.id || "tiny", ...o }, x, y, k); }
function rThrows(t, env) {
  const b = env.beats, crash = t > b.farther - 0.15 + 0.75, arm = THROWS.some((q) => pulse(t, b[q.at] + q.d - 0.25, b[q.at] + q.d + 0.1, 0.08) > 0);
  return boardFrame(t, env, b.threw - 0.12, planet(540, ETOP + ER, ER, 0) + house(X0 + 740, crash) + flatThrows(t, b)
    + tinyPeek(X0 - 40, ETOP, F("angry", { lookY: -0.6, look: 0.8 }), { turn: 0.7, armR: arm ? { x: 960, y: 380 } : { x: 860, y: 340 } })
    + (crash ? X.label(X0 + 740, ETOP - 240, "CRASH!", 70, "#ff4f6d", 1, easeOutBack(seg(t, b.farther + 0.6, b.farther + 0.8))) : ""), TALK, "point", pulse(t, b.harder, b.round - 0.2, 0.2));
}
// the planet's size and place while the camera pulls back: p 0 = huge and flat, 1 = whole (radius 230 at the centre)
const shrink = (p) => { const R = Math.exp(lerp(Math.log(ER), Math.log(230), p)), top = lerp(ETOP, 640 - 230, ease(p)); return { R, ex: 540, ey: top + R }; };
const PATHS = [0.5, 0.75, 0.9, 1.0].map((f) => M.throwPath(f));
const MT = 1.15;                                           // the mountain top, in planet radii
function mountainScene(t, b, p, { show = [1, 1, 1], orbit = 0, bonk = -1, extra = "" } = {}) {
  const { R, ex, ey } = shrink(p), top = ey - R, mh = (MT - 1) * R * ease(seg(p, 0.35, 0.9)) * (1 + 0 * p);
  const map = (x, y) => [ex + x * R, ey - y * R];
  const mountain = mh > 2 ? `<path d="M${ex - mh * 1.1} ${top + 6} L${ex - mh * 0.12} ${top - mh} L${ex + mh * 0.12} ${top - mh} L${ex + mh * 1.1} ${top + 6} Z" fill="#6b5aa8"/><path d="M${ex - mh * 0.3} ${top - mh * 0.72} L${ex - mh * 0.12} ${top - mh} L${ex + mh * 0.12} ${top - mh} L${ex + mh * 0.3} ${top - mh * 0.72} Z" fill="#fff" opacity=".85"/>` : "";
  const fs = [b.throw + 0.15, b.throw + 0.95, b.curves + 0.3];
  const trails = PATHS.slice(0, 3).map((P, i) => { if (!show[i]) return ""; const u = seg(t, fs[i], fs[i] + 0.55 + 0.25 * i); if (u <= 0) return "";
    const { x, y } = M.along(P, u), [sx, sy] = map(x, y), landed = u >= 1;
    return M.trail(P, u, map, `stroke="#ffe66d" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round" opacity=".8"`) + (landed ? puff(sx, sy, seg(t, fs[i] + 0.8 + 0.25 * i, fs[i] + 1.4 + 0.25 * i), 0.8) + X.apple(sx, sy - 8, 16, 60) : X.apple(sx, sy, 20, u * 600)); }).join("");
  let orb = "";
  if (orbit > 0) { const P = PATHS[3], u = clamp(orbit), { x, y } = M.along(P, u), [sx, sy] = map(x, y), L = Math.hypot(sx - ex, sy - ey);
    orb = M.trail(P, u, map, `stroke="#ff9fd0" stroke-width="7" stroke-dasharray="4 14" stroke-linecap="round"`) + (u < 1 ? X.arrow(sx, sy, sx + (ex - sx) / L * 100, sy + (ey - sy) / L * 100, 10, "#ffe66d", t * 2) + X.apple(sx, sy, 22, u * 900) : ""); }
  const pk = [ex, top - mh], hit = bonk >= 0 ? t - bonk : -1;
  const stars = hit > 0 && hit < 1.4 ? [0, 1, 2, 3, 4].map((i) => { const a = t * 5 + i * 1.256; return `<path d="M${pk[0] + Math.cos(a) * 46} ${pk[1] - 52 + Math.sin(a) * 14} l5 -12 l5 12 l12 2 l-10 8 l3 13 l-10 -7 l-10 7 l3 -13 l-10 -8 Z" fill="#ffe66d"/>`; }).join("") : "";
  const me = true ? tinyPeek(pk[0], pk[1], hit > 0 ? F("worried", { lid: 0.6, look: -0.5 }) : F("angry", { lookY: -0.2, look: 0.8 }), { turn: 0.7, nod: hit > 0 ? 0.6 * Math.exp(-hit * 3) : 0, hatLift: hit > 0 ? -40 * Math.exp(-hit * 5) : 0, armR: { x: 860, y: 520 } }, 0.16) : "";
  return planet(ex, ey, R, 0) + mountain + trails + orb + me + stars + extra;
}
function rRound(t, env) {                                   // "But their planet is round. Throw hard enough, and the ground curves away under the apple as fast as it falls."
  const b = env.beats, p = ease(seg(t, b.round + 0.1, b.round + 1.3)), old = 1 - seg(t, b.round, b.round + 0.4);
  const flat = old > 0 ? `<g opacity="${old}">${house(X0 + 740, true)}${flatThrows(t, b)}</g>` : "";
  return boardFrame(t, env, b.round - 0.12, mountainScene(t, b, p, { extra: flat }) + NOTE(215, 290, "IMAGINE:", 54, "#9fd0ff", fade(t, b.throw - 0.2), -6) + NOTE(215, 350, "NO AIR", 54, "#9fd0ff", fade(t, b.throw - 0.2), -6)
    + X.label(540, 990, "THE GROUND CURVES AWAY", 50, "#ffe66d", fade(t, b.fast - 0.1)), TALK, "point", pulse(t, b.throw, b.never - 0.2, 0.2));
}
function rNever(t, env) {                                   // "It never lands. It falls all the way around... and hits you in the back of the head."
  const b = env.beats, u = seg(t, b.never + 0.05, b.head + 0.45);
  return boardFrame(t, env, b.never - 0.12, `<g opacity=".35">${mountainScene(t, b, 1, { show: [1, 1, 1] })}</g>` + mountainScene(t, b, 1, { show: [0, 0, 0], orbit: u, bonk: b.head + 0.45 })
    + NOTE(215, 290, "IMAGINE:", 54, "#9fd0ff", 1, -6) + NOTE(215, 350, "NO AIR", 54, "#9fd0ff", 1, -6) + X.label(540, 990, "LATER...", 60, "#ff9fd0", pulse(u, 0.3, 0.85, 0.1)) + X.label(540, 990, "BONK.", 80, "#ffe66d", fade(t, b.head + 0.45), easeOutBack(seg(t, b.head + 0.45, b.head + 0.7))),
    t > b.head + 0.45 ? F("deadpan", { lid: 0.5, look: 0.3 }) : TALK, "point", pulse(t, b.never, b.head, 0.2));
}
function rWhy(t, env) {                                     // "So why doesn't the Moon fall? Because it..."
  const b = env.beats, z = ease(seg(t, b.why - 0.1, b.why + 0.9)), R = lerp(230, 60, z), ex = 540, ey = lerp(640, 600, z), mr = 380, a = -Math.PI / 2 + (t - b.why) * 0.35;
  const mx = ex + Math.cos(a) * mr, my = ey + Math.sin(a) * mr;
  return boardFrame(t, env, b.why - 0.12, `<circle cx="${ex}" cy="${ey}" r="${R * MT}" fill="none" stroke="#ff9fd0" stroke-width="5" stroke-dasharray="4 12"/>` + X.earth(ex, ey, R, 0)
    + `<circle cx="${ex}" cy="${ey}" r="${mr}" fill="none" stroke="#9fd0ff" stroke-width="4" stroke-dasharray="6 14" opacity="${z}"/>` + (z > 0.05 ? `<g opacity="${z}">${M.bigMoon(mx, my, 44, 0.5)}</g>` : "")
    + X.label(800, 900, "?", 220, "#ffe66d", fade(t, b.why + 0.9), easeOutBack(seg(t, b.why + 0.9, b.why + 1.2))) + X.label(540, 995, "NOT TO SCALE", 34, "#9fd0ff", z * 0.8),
    blend(TALK, F("skeptical", { lookY: -0.8 }), z), "point", pulse(t, b.why + 0.2, b.because, 0.2));
}

// ============================================================ THE INTERRUPTION (live, on the rooftop)
const PX_SIT = 1150, PX_HIDE = 1060;                     // (the AC unit is moved 200 px left of its Episode 1 place: acUnit2)
const acUnit2 = () => `<g transform="translate(-200 0)">${N.acUnit()}</g>`;                     // Peek reporting by the AC; Peek pressed against its right side
const CRO = (x, aim, { lean = 0, flip = false, glint = 1, red = 0, k = 0.92 } = {}) => `<g transform="translate(${x} ${N.FLOOR - 2}) scale(${flip ? -k : k} ${k})">${N.crowe({ aim, lean, glint, green: red ? 0 : 1 })}${red ? `<g transform="rotate(${lean} 0 -480)"><rect x="-128" y="-528" width="40" height="30" rx="4" fill="#ff3b3b" opacity="${red}"/></g>` : ""}</g>`;
const torchAt = (x, aim, flip = false, k = 0.92) => { const [tx_, ty_] = N.croweTorch(aim); return [x + (flip ? -tx_ : tx_) * k, N.FLOOR - 2 + ty_ * k]; };
function liveRoof(t, c, plane, { door = 0, beam = null, vig = 0.66, rain = 1 } = {}) {
  return [fx.layer(N.sky(NOMOON), c, 0.04), fx.layer(M.bigMoon(760, 470, 300, 0.8), c, 0.04), fx.layer(N.cityFar(), c, 0.12, { blur: 2.6 }), fx.layer(N.cityMid(), c, 0.3, { blur: 1.6 }),
    fx.fog(t, { y: 1250, o: 0.2 }), fx.layer(N.cityNear(), c, 0.55, { blur: 0.8 }), rain ? rainBack(t, 8, 1, 0.12) : "",
    fx.layer(N.roofBack() + N.hut(door) + N.roofFloor() + plane, c, 1), beam || "", ...finish(t, t, { o: 0.12 * rain, vig, grade: ["#2a3cc0", 0.28], warm: 0.04 })];
}
function hiddenPeek(t, env, e, { k = 0.62, clamp_ = 0, px = PX_HIDE } = {}) {
  const f = night("Lh2", [{ color: "#9fd0ff", az: 225, power: 0.9, size: 9 }], [0.7, 0.62, 0.92], 0.0);
  const arms = clamp_ > 0 ? { armL: { x: lerp(420, 350, clamp_), y: lerp(760, 170, clamp_) }, armR: { x: lerp(780, 850, clamp_), y: lerp(760, 170, clamp_) } } : { armL: { x: 380, y: 640 }, armR: { x: 820, y: 700 } };
  return peek(e, { filter: f, turn: -0.6, squash: 0.94, ...arms }, px, PY + 14, k);
}
function interrupt(t, env) {
  const b = env.beats, u = t - env.is, IS = env.is, cmd = b.cmd, cmdE = b.cmd_end, bs = env.bs;
  const door = easeOut(seg(t, IS, IS + 0.12));
  // Crowe: out of the door, the apple in the beam, the beam swings to the AC, then he walks off to the far parapet
  const walkOut = ease(seg(t, IS + 0.5, b.crowe + 0.1)), walkOff = ease(seg(t, cmdE + 0.9, bs + 1.0));
  const flip = t > cmdE + 0.8;
  const cx = flip ? lerp(560, 330, walkOff) : lerp(400, 560, walkOut), stepBob = Math.abs(Math.sin((walkOut + walkOff) * Math.PI * 4)) * 10 * (walkOut < 1 || (walkOff > 0 && walkOff < 1) ? 1 : 0);
  const show = seg(t, IS + 0.35, IS + 0.55);
  let aim = kf(t, [[IS + 0.5, -8], [b.crowe - 0.2, 4], [b.crowe + 0.2, -22], [b.crowe_end + 0.2, -22], [cmd + 0.6, 2], [cmdE + 0.5, 12], [cmdE + 0.85, 12], [bs + 1.0, 30]]);
  const [bx, by] = torchAt(cx, aim, flip), beamA = flip ? 180 - aim - 4 : aim + 4;
  const red = t > cmd && t < cmdE + 1.2 ? (Math.sin(t * 40) > 0 ? 1 : 0.3) : 0;
  const crowe = show > 0 ? `<g opacity="${show}" transform="translate(0 ${-stepBob})">${CRO(cx, aim, { flip, red, lean: walkOut > 0 && walkOut < 1 ? 4 : 0 })}</g>` : "";
  const apple = t > b.crowe - 0.25 && t < b.crowe_end + 0.6 ? (() => { const r = ease(seg(t, b.crowe - 0.25, b.crowe + 0.15)) * (1 - ease(seg(t, b.crowe_end + 0.2, b.crowe_end + 0.6))), [ax, ay] = torchAt(cx, -22, false); return `<g opacity="${r}">${M.bitten(ax + 60, ay - 6, 30, -20)}</g>`; })() : "";
  // Peek: frozen, the dive, pressed flat; the Commander; he clamps the antennae; the beam crawls over the AC
  const dive = seg(t, IS + 0.3, IS + 0.7), px = lerp(PX_SIT, PX_HIDE, easeOut(dive)), hop = Math.sin(dive * Math.PI) * 120;
  const radioOn = lv(env, "commander", t), clampA = ease(seg(t, cmdE - 0.05, cmdE + 0.2));
  let e;
  if (t < IS + 0.3) e = { ...PANIC, lookY: 0, look: -1 };
  else if (t < cmd - 0.1) e = F("worried", { ant: 6, lid: 0, eyeScale: 1.15, look: -0.9, browTilt: 1, m: { ...MOUTHS.flat, w: 0.5, tongue: 0 } });
  else if (t < cmdE + 1.0) e = { ...PANIC, ant: 10, eyeScale: 1.3, look: -0.4, lookY: -0.4, blush: 0.5, m: { ...MOUTHS.flat, w: 0.4, smile: -0.05, tongue: 0 } };
  else e = speak({ ...HUSH, lid: Math.max(0.12, blinks(t, 2.4)) }, env, t);
  e = ants(e, (t < cmdE ? 10 * radioOn * Math.sin(t * 40) : 0) - clampA * 70, (t < cmdE ? -10 * radioOn * Math.sin(t * 40) : 0) - clampA * 70);
  const k = 0.62, hat = t > IS + 0.3 && t < IS + 0.85 ? -60 * Math.sin(seg(t, IS + 0.3, IS + 0.85) * Math.PI) : 0;
  const f = night("Li", [{ color: "#9fd0ff", az: 225, power: 0.9, size: 9 }, { color: "#ffd27a", az: 160, power: 0.6 * door, size: 10 }], [0.72, 0.64, 0.94], 0.0);
  const arms = clampA > 0 ? { armL: { x: lerp(420, 300, clampA), y: lerp(760, 140, clampA) }, armR: { x: lerp(780, 900, clampA), y: lerp(760, 140, clampA) } } : dive > 0 && dive < 1 ? { armL: { x: 300, y: 500 }, armR: { x: 900, y: 500 } } : { armL: { x: 380, y: 640 }, armR: { x: 820, y: 700 } };
  const pk = peek(e, { filter: f, turn: t < IS + 0.3 ? -0.8 : -0.6, squash: dive > 0 ? 0.94 : 1.05, hatLift: hat, legL: dive > 0 && dive < 1 ? { y: -40, rot: -20 } : null, legR: dive > 0 && dive < 1 ? { y: -40, rot: 20 } : null, ...arms }, px, PY + (dive > 0 ? 14 : 0) - hop, k);
  const tips = [-1, 1].map((sg) => [px + sg * 285 * k, PY + 14 - 915 * k]);
  const radio = radioOn > 0.05 && clampA < 0.5 ? tips.map(([x, y]) => fx.glow(x, y, 60 + 60 * radioOn, "#ffe66d", 0.9 * radioOn) + `<circle cx="${x}" cy="${y}" r="${30 + ((t * 2.4) % 1) * 80}" fill="none" stroke="#ffe66d" stroke-width="6" opacity="${(0.8 * (1 - (t * 2.4) % 1)).toFixed(2)}"/>`).join("") : "";
  // cameras: wide for the door and Crowe; close on Peek for the Commander and the beam; close for "...is falling"
  const closeCmd = t > cmd - 0.15 && t < cmdE + 0.55, closeEnd = t > bs - 0.5;
  const c = closeEnd ? fx.camera(t, [[bs - 0.5, PX_HIDE - 30, 1280, 1.6, 0], [bs + 2, PX_HIDE - 20, 1290, 1.7, 0]])
    : closeCmd ? fx.shake(fx.camera(t, [[cmd - 0.15, PX_HIDE - 60, 1270, 1.7, 0], [cmdE + 0.55, PX_HIDE - 50, 1265, 1.8, 0]]), t, 4 * radioOn, 3, 14)
    : fx.shake(fx.camera(t, [[IS, 820, 1240, 0.84, 0], [b.crowe, 800, 1250, 0.86, 0], [cmdE + 0.6, 790, 1250, 0.84, 0], [bs - 0.5, 760, 1250, 0.84, 0]]), t, u < 0.5 ? 26 * Math.exp(-u * 7) : 2, 4, 12);
  const beam = show > 0.5 ? fx.beam(...fx.toScreen(c, bx, by), beamA, 2400, 12, "#fff3d6", 0.45, 10) + fx.glow(...fx.toScreen(c, bx, by), 110 * c.z, "#fff6dc", 0.8) : "";
  const plane = acUnit2() + crowe + apple + pk + radio;
  return [...liveRoof(t, c, plane, { door: Math.max(door, 0.85), beam, rain: 1 }), fx.flash(t < IS + 0.12 ? 0.55 * (1 - u / 0.12) : 0, "#fff3d6"), caps(env, t, OUT)];
}
const footprintsHint = () => "";

// ============================================================ REPORT B (whispered; Peek pressed against the AC in the strip)
const OC = [540, 600], ORB = 330, ER2 = 110;              // the orbit picture: Earth's centre, the Moon's orbit radius, Earth's radius
const mAt = (th) => [OC[0] + Math.cos(th) * ORB, OC[1] + Math.sin(th) * ORB];
const tang = (th) => [Math.sin(th), -Math.cos(th)];      // the direction of motion (counter-clockwise on screen)
function pullArrow(mx, my, t, o = 1, col = "#ffe66d") { const dx = OC[0] - mx, dy = OC[1] - my, L = Math.hypot(dx, dy); return X.arrow(mx + dx / L * 62, my + dy / L * 62, mx + dx / L * (L - ER2 - 30), my + dy / L * (L - ER2 - 30), 14, col, t * 2, o); }
function sideArrow(mx, my, th, t, o = 1, len = 230) { const [vx, vy] = tang(th); return X.arrow(mx + vx * 62, my + vy * 62, mx + vx * len, my + vy * len, 14, "#ff7ab8", t * 2, o); }
const orbitBase = (t, o = 1) => `<circle cx="${OC[0]}" cy="${OC[1]}" r="${ORB}" fill="none" stroke="#9fd0ff" stroke-width="4" stroke-dasharray="6 14" opacity="${0.5 * o}"/>` + X.earth(OC[0], OC[1], ER2, t * 0.15);
const B = (t, env, t0, inner, face = HUSH, gesture = null, g = 0) => boardFrame(t, env, t0, inner, face, gesture, g, {}, { hide: 1, tone: "#10143a", dark: 0.12 });
const TH0 = -Math.PI * 0.72;                             // where the Moon is when report B begins (upper left; it moves down and left)
const thAt = (t, env) => TH0 - (t - env.beats.alltime) * 0.1;
function rFalling(t, env) {                                 // "...is falling. All the time."
  const b = env.beats, th = thAt(t, env), [mx, my] = mAt(th), dx = OC[0] - mx, dy = OC[1] - my, L = Math.hypot(dx, dy);
  return B(t, env, b.alltime - 0.15, orbitBase(t) + M.bigMoon(mx, my, 46, 0.6) + pullArrow(mx, my, t, fade(t, b.alltime - 0.1))
    + X.label(mx + dx / L * 170 + 150, my + dy / L * 170 - 10, "FALLING", 66, "#ffe66d", fade(t, b.alltime), lerp(1.2, 1, easeOut(seg(t, b.alltime, b.alltime + 0.3)))), HUSH, "point", pulse(t, b.alltime, b.sideways - 0.2, 0.2));
}
function rSideways(t, env) {                                // "But it is also moving sideways. Two thousand three hundred miles an hour."
  const b = env.beats, th = thAt(t, env), [mx, my] = mAt(th), [vx, vy] = tang(th), so = fade(t, b.sideways + 0.3);
  return B(t, env, b.sideways - 0.12, orbitBase(t) + M.bigMoon(mx, my, 46, 0.6) + pullArrow(mx, my, t, 1) + sideArrow(mx, my, th, t, so)
    + X.label(210, 660, "SIDEWAYS", 58, "#ff9fd0", so)
    + `<g opacity="${fade(t, b.mph)}" transform="translate(760 880) scale(${lerp(1.25, 1, easeOut(seg(t, b.mph, b.mph + 0.3)))})">${X.label(0, 0, "2,300 mph", 96, "#ffe66d")}${X.label(0, 62, "3,700 km/h", 48, "#9fd0ff")}</g>`, HUSH, "point", pulse(t, b.sideways + 0.2, b.without - 0.2, 0.2));
}
function rWithout(t, env) {                                 // "Without the pull, it would fly off in a straight line."
  const b = env.beats, th = thAt(b.without, env), [mx, my] = mAt(th), [vx, vy] = tang(th), d = ease(seg(t, b.without + 0.3, b.with - 0.1)) * 900;
  const line = `<path d="M${mx} ${my} L${mx + vx * 1400} ${my + vy * 1400}" stroke="#ff9fd0" stroke-width="5" stroke-dasharray="10 14" opacity="${fade(t, b.without)}"/>`;
  return B(t, env, b.without - 0.12, orbitBase(t) + line + `<g opacity=".45">${M.bigMoon(mx, my, 46, 0.3)}</g>` + `<g opacity="${1 - fade(t, b.with - 0.25)}">${M.bigMoon(mx + vx * d, my + vy * d, 46, 0.6)}</g>`
    + `<g opacity="${(1 - fade(t, b.without + 0.2)) }">${pullArrow(mx, my, t)}</g>` + X.label(760, 880, "NO PULL:", 70, "#ff9fd0", fade(t, b.without + 0.1)) + X.label(760, 955, "A STRAIGHT LINE", 52, "#fff", fade(t, b.without + 0.9)), HUSH, "palm", pulse(t, b.without + 0.1, b.with - 0.2, 0.2));
}
// one second of the Moon's path, hugely exaggerated: the straight line it would take, the curve it does take, the gap = the fall
const ZR = 1500, ZC2 = [540, 2140], PH0 = -0.25;
const zP = (ph) => [ZC2[0] + ZR * Math.sin(ph), ZC2[1] - ZR * Math.cos(ph)];
function rDime(t, env) {                                    // "With it, it falls a dime's thickness every second..."
  const b = env.beats, s = ease(seg(t, b.with + 0.2, b.dime + 0.2)) * 0.5, [x0, y0] = zP(PH0), T0 = [Math.cos(PH0), Math.sin(PH0)];
  const [mx, my] = zP(PH0 + s), sx = x0 + T0[0] * ZR * s, sy = y0 + T0[1] * ZR * s, gap = fade(t, b.dime - 0.05), coin = popIn(t, b.dime + 0.35);
  const arc = Array.from({ length: 41 }, (_, i) => { const [x, y] = zP(PH0 + s * i / 40); return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join("");
  return B(t, env, b.with - 0.12, `<path d="M${x0} ${y0} L${x0 + T0[0] * ZR * 0.55} ${y0 + T0[1] * ZR * 0.55}" stroke="#ff9fd0" stroke-width="5" stroke-dasharray="10 14"/>`
    + `<path d="${arc}" stroke="#9fd0ff" stroke-width="8" fill="none"/>` + `<g opacity=".4">${M.bigMoon(sx, sy, 40, 0.2)}</g>` + M.bigMoon(mx, my, 44, 0.6)
    + (gap > 0 ? X.arrow(sx, sy + 44, mx, my - 46, 12, "#ffe66d", t * 2, gap) + X.label(sx - 210, (sy + my) / 2 + 30, "FALLS 1.4 mm", 66, "#ffe66d", gap) : "")
    + X.label(270, 300, "IN ONE SECOND", 56, "#9fd0ff", fade(t, b.with)) + X.label(540, 980, "TO EARTH ↓", 46, "#9fd0ff", fade(t, b.with + 0.3))
    + (coin > 0 ? `<g transform="translate(210 760) scale(${coin})">${M.dime(0, 0, 70, 0.22)}</g>${X.label(255, 880, "A DIME: 1.35 mm", 48, "#fff", coin)}` : "")
    + X.label(840, 990, "NOT TO SCALE", 34, "#9fd0ff", 0.85) + X.label(780, 300, "EVERY SECOND", 56, "#ffe66d", fade(t, b.every)), HUSH, "point", pulse(t, b.dime, b.bend - 0.2, 0.2));
}
function rCircle(t, env) {                                  // "...just enough to bend its path into a circle around this planet. Once every twenty-seven days."
  const b = env.beats, u = ease(seg(t, b.bend + 0.2, b.days + 1.0)), th = TH0 - u * Math.PI * 2, [mx, my] = mAt(th);
  const trail = u > 0 ? `<path d="M${mAt(TH0).join(" ")} A${ORB} ${ORB} 0 ${u > 0.5 ? 1 : 0} 0 ${mx.toFixed(1)} ${my.toFixed(1)}" fill="none" stroke="#ffe66d" stroke-width="8" opacity=".85"/>` : "";
  const day = Math.min(27, Math.floor(u * 27.32)), done = u >= 1;
  return B(t, env, b.bend - 0.12, orbitBase(t) + (u < 0.999 ? trail : `<circle cx="${OC[0]}" cy="${OC[1]}" r="${ORB}" fill="none" stroke="#ffe66d" stroke-width="8" opacity=".85"/>`) + M.bigMoon(mx, my, 46, 0.6) + pullArrow(mx, my, t, 0.9) + sideArrow(mx, my, th, t, 0.9, 190)
    + X.label(540, 790, done ? "" : `DAY ${day}`, 56, "#fff", fade(t, b.days - 0.2) * (done ? 0 : 1)) + (done ? X.label(540, 800, "27 DAYS", 80, "#ffe66d", 1, easeOutBack(seg(t, b.days + 1.0, b.days + 1.3))) : "")
    + X.label(540, 990, "A CIRCLE", 52, "#ffe66d", fade(t, b.circle)), HUSH, "point", pulse(t, b.circle, b.sum1 - 0.2, 0.2));
}
function rSummary(t, env) {                                 // "So: the Moon is falling. It moves sideways so fast that it keeps missing us."
  const b = env.beats, row = (y, at, inner, text, col = "#fff") => { const a = popIn(t, at, 0.3); return a <= 0 ? "" : `<g transform="translate(540 ${y}) scale(${a}) translate(-540 ${-y})"><rect x="80" y="${y - 108}" width="920" height="216" rx="40" fill="#1c2250" stroke="#7fd4ff" stroke-width="5" opacity=".95"/>${inner}${X.label(650, y + 22, text, 58, col)}</g>`; };
  const orbitMini = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="#ffe66d" stroke-width="5"/>${X.earth(cx, cy, 30, t * 0.2)}${M.bigMoon(cx + Math.cos(-t * 1.5) * 70, cy + Math.sin(-t * 1.5) * 70, 16, 0.3)}`;
  return B(t, env, b.sum1 - 0.15, row(330, b.sum1, M.bigMoon(200, 300, 40, 0.4) + X.arrow(200, 350, 200, 420, 10, "#ffe66d", t), "THE MOON IS FALLING")
    + row(600, b.sum2, M.bigMoon(180, 600, 40, 0.4) + X.arrow(230, 600, 320, 600, 10, "#ff7ab8", t), "SIDEWAYS, SO FAST")
    + row(870, b.sum3, orbitMini(200, 870), "IT KEEPS MISSING", "#ffe66d"), HUSH, "point", pulse(t, b.sum1 + 0.2, b.question - 0.25, 0.2));
}
function rAstro(t, env) {                                   // "Which raises a question. The same pull reaches their astronauts. So why do they float?"
  const b = env.beats, ex = 600, ey = 680, R = 170, sr = 245, th = -Math.PI / 2 - (t - b.question) * 0.8, sx = ex + Math.cos(th) * sr, sy = ey + Math.sin(th) * sr, dx = ex - sx, dy = ey - sy, L = Math.hypot(dx, dy);
  const port = popIn(t, b.float - 0.1, 0.3), drift = Math.sin(t * 1.3) * 18, spin = t * 25;
  const porthole = port > 0 ? `<g transform="translate(250 380) scale(${port})"><circle r="150" fill="#cfd6ee"/><circle r="128" fill="#0b0e30"/><clipPath id="portc2"><circle r="128"/></clipPath><g clip-path="url(#portc2)"><rect x="-140" y="40" width="280" height="10" fill="#3a4490"/>
    <g transform="translate(0 ${drift - 10}) rotate(${spin})">${X.human(0, 90, 0.55, { shirt: "#f2f4fb", hair: "#5a3a22", armL: 70, armR: -60 })}</g></g></g>${X.label(250, 330, "?", 150, "#ffe66d", port, easeOutBack(seg(t, b.float + 0.2, b.float + 0.5)))}` : "";
  return B(t, env, b.question - 0.15, `<circle cx="${ex}" cy="${ey}" r="${sr}" fill="none" stroke="#9fd0ff" stroke-width="4" stroke-dasharray="6 14" opacity=".5"/>` + X.earth(ex, ey, R, t * 0.15) + M.station(sx, sy, 0.46, th * 180 / Math.PI + 90)
    + X.arrow(sx + dx / L * 50, sy + dy / L * 50, sx + dx / L * (L - R - 20), sy + dy / L * (L - R - 20), 12, "#ffe66d", t * 2, fade(t, b.astro)) + X.label(820, 330, "SAME PULL", 56, "#ffe66d", fade(t, b.astro + 0.2))
    + porthole + X.label(540, 990, "WHY DO THEY FLOAT?", 56, "#fff", fade(t, b.float + 0.4)), HUSH, "point", pulse(t, b.astro, b.out - 0.2, 0.2));
}
function rExit(t, env) {                                    // "Investigating. Peek out." he tips his hat and tiptoes off behind Crowe's back
  const b = env.beats, c = fx.camera(t, [[b.out - 0.12, 760, 1250, 0.84, 0], [env.ts, 860, 1250, 0.84, 0]]), tip = pulse(t, b.out + 0.05, b.peekout + 0.2, 0.15), go = seg(t, b.peekout + 0.5, env.ts + 0.6), ph = go * Math.PI * 6;
  const px = lerp(PX_HIDE, 1500, go);
  let e = blend(F("sly", { look: 0.6 }), F("smug", { look: -0.5, lid: 0.5 }), seg(t, b.peekout, b.peekout + 0.3)); e = ants(speak(e, env, t), 4, 4);
  const f = night("Lx", [{ color: "#9fd0ff", az: 225, power: 0.9, size: 9 }], [0.72, 0.64, 0.94], 0.0);
  const pk = peek(e, { filter: f, turn: go > 0 ? 0.8 : -0.4, squash: 0.96, bounce: go > 0 ? Math.abs(Math.sin(ph)) * 16 : 0, armR: tip > 0.02 ? { x: lerp(820, 800, tip), y: lerp(700, 300, tip), front: true } : { x: 820, y: 640 }, armL: { x: 380, y: 640 }, hatRot: -6 * tip,
    legL: go > 0 ? { x: 30 * Math.cos(ph), y: -40 * Math.max(0, Math.sin(ph)), rot: 14 * Math.sin(ph) } : null, legR: go > 0 ? { x: -30 * Math.cos(ph), y: -40 * Math.max(0, -Math.sin(ph)), rot: -14 * Math.sin(ph) } : null }, px, PY + 14, 0.62);
  const cx = 330, aim = 30 + Math.sin(t * 0.8) * 6, [bx, by] = torchAt(cx, aim, true);
  const beam = fx.beam(...fx.toScreen(c, bx, by), 180 - aim - 4, 2400, 12, "#fff3d6", 0.45, 10);
  return [...liveRoof(t, c, acUnit2() + CRO(cx, aim, { flip: true }) + N.footprints(PX_HIDE + 40, px - 40, PY + 14, 0.6) + pk, { door: 0.85, beam, rain: 1 }), caps(env, t, OUT)];
}

// ============================================================ TAG: Crowe at the AC with the apple; the next question; cut to black
function tag(t, env) {
  const u = t - env.ts, walk = ease(seg(u, 0, 1.2)), cx = lerp(460, 1340, walk), flip = true, raise = ease(seg(u, 1.0, 1.5));
  const aim = lerp(30, -18, raise), [bx, by] = torchAt(cx, aim, flip), close = u > 1.35;
  const [ax, ay] = [bx - 80, by - 6];
  const c = close ? fx.camera(u, [[1.35, ax + 40, ay + 60, 2.8, 0], [5.2, ax + 30, ay + 50, 3.1, 0]]) : fx.camera(u, [[0, 900, 1250, 0.84, 0], [1.35, 1100, 1230, 1.0, 0]]);
  const beam = fx.beam(...fx.toScreen(c, bx, by), 180 - aim - 4, 2400, 12, "#fff3d6", 0.5, 10) + fx.glow(...fx.toScreen(c, bx, by), 120 * c.z, "#fff6dc", 0.8);
  const apple = raise > 0 ? `<g opacity="${raise}">${M.bitten(ax, ay, 40, 160)}</g>` : "";
  const q = seg(t, env.beats.next, env.beats.next + 0.2);
  const plane = acUnit2() + N.footprints(PX_HIDE + 40, 1900, PY + 14, 0.7) + `<g transform="translate(0 ${-Math.abs(Math.sin(walk * Math.PI * 4)) * 8 * (walk < 1 ? 1 : 0)})">${CRO(cx, aim, { flip, red: Math.sin(t * 30) > 0 ? 1 : 0.3, lean: raise * 4 })}</g>` + apple;
  return [...liveRoof(t, c, plane, { door: 0.85, beam: beam + (close ? fx.glow(...fx.toScreen(c, ax, ay), 260, "#fff6dc", 0.35) : ""), rain: 1, vig: 0.72 }), q > 0 ? "" : caps(env, t, OUT),
    `<rect width="${W}" height="${H}" fill="#02030c" opacity="${0.35 * q}"/>`,
    X.label(540, 1040, "NEXT REPORT", 62, "#7fd4ff", q), X.label(540, 1150, "WHY DO", 96, "#fff", q, lerp(1.2, 1, easeOut(seg(t, env.beats.next, env.beats.next + 0.3)))),
    X.label(540, 1275, "ASTRONAUTS", 112, "#ffe66d", seg(t, env.beats.next + 0.15, env.beats.next + 0.35), lerp(1.2, 1, easeOut(seg(t, env.beats.next + 0.15, env.beats.next + 0.45)))),
    X.label(540, 1400, "FLOAT?", 120, "#ffe66d", seg(t, env.beats.next + 0.3, env.beats.next + 0.5), lerp(1.2, 1, easeOut(seg(t, env.beats.next + 0.3, env.beats.next + 0.6)))),
    fx.flash(seg(t, env.end - 0.12, env.end) ** 2, "#000")];
}

export function draw(t, env) {
  if (!env) return fx.frame(() => `<text x="40" y="100" fill="#fff" font-size="40">run audio/ep02_sound.py first (out/ep02.json)</text>`);
  let f;
  if (t < env.rs) f = t < 0.62 ? closeFear : t < 2.4 ? throw1 : t < 4.3 ? throw2 : t < 6.5 ? throw3 : t < 7.4 ? window_ : t < 9.2 ? alleyCrowe : oops;
  else if (t < env.is) { const b = env.beats; f = t < b.bolted - 0.12 ? rRoof : t < b.falls - 0.12 ? rBolted : t < b.threw - 0.12 ? rFalls : t < b.round - 0.12 ? rThrows : t < b.never - 0.12 ? rRound : t < b.why - 0.12 ? rNever : rWhy; }
  else if (t < env.ts) { const b = env.beats; f = t < b.alltime - 0.15 ? interrupt : t < b.sideways - 0.12 ? rFalling : t < b.without - 0.12 ? rSideways : t < b.with - 0.12 ? rWithout : t < b.bend - 0.12 ? rDime
    : t < b.sum1 - 0.15 ? rCircle : t < b.question - 0.15 ? rSummary : t < b.out - 0.12 ? rAstro : rExit; }
  else f = tag;
  return fx.frame(() => f(t, env));
}
