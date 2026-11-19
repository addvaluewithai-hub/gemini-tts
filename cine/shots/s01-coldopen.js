// Peek · Short 01 · the cold open (10 s + title), 2.5D.
//  S1  0.0-1.8  He peeks over an AC unit; a torch beam sweeps the roof and finds his eyes. "Oh no."
//  S2  1.8-3.6  Wide: Agent Crowe, a silhouette in the lit doorway. "STOP RIGHT THERE!" Peek jumps, turns, bolts.
//  S3  3.6-5.5  Tracking run along the roof, the beam chasing; he looks back; the edge is coming.
//  S4  5.5-8.3  The leap, in slow motion against the moon: arms out, eyes shut. "Relax... on my planet... we float."
//  S5  8.3-9.1  Close: one eye opens, looks down. "Uh-oh." He drops out of his hat.
//  S6  9.1-9.9  The alley: he falls into the dumpster, the lid slams, the hat lands last.
//  S7  9.9-10.6 Crowe at the roof edge against the moon, torch down the lens. "Gotcha."  Then the title.
import { peek3d, MOUTHS } from "../lib/peek.js";
import { EMOTES } from "../lib/acting.js";
import * as fx from "../lib/fx.js";
import * as N from "../sets/night.js";

const { seg, lerp, ease, easeOut, easeIn, easeOutBack, kf, clamp, spring, pulse, noise, W, H } = fx;
export const DUR = 11.8;
export const ENV = "out/s01-env.json";
const K = 0.7, PY = N.FLOOR + 40;

// ---- acting helpers
const M = (m) => (typeof m === "string" ? MOUTHS[m] : m);
const F = (name, extra = {}) => { const e = EMOTES[name]; return { browL: 0, browR: 0, browTilt: 0, lid: 0.14, squint: 0, eyeScale: 1, pupil: 1, look: 0, lookY: 0, blush: 0, sweat: 0, ant: 0, ...e, m: { tongue: 0, ...M(e.mouth) }, symbol: undefined, mouth: undefined, ...extra }; };
const blend = (a, b, p) => { const o = fx.mix(a, b, p); o.m = fx.mix(a.m, b.m, p); return o; };
const ants = (e, l = 0, r = 0) => ({ ...e, antL: (e.ant || 0) + l, antR: (e.ant || 0) + r });
const say = (e, open) => ({ ...e, m: { ...e.m, jaw: Math.max(e.m.jaw, open * 0.95), w: lerp(e.m.w, 0.78, clamp(open) * 0.6) } });
const lv = (env, who, t) => (env && env[who] ? clamp((env[who][Math.round(t * env.fps)] || 0) * 1.25) : 0);
const blink = (t, at) => at.reduce((v, a) => Math.max(v, pulse(t, a, a + 0.14, 0.06)), 0);
const peek = (e, o, x, y, k = K, extra = "") => `<g transform="translate(${(x - 600 * k).toFixed(1)} ${(y - 1010 * k).toFixed(1)}) scale(${k}) ${extra}">${peek3d(e, { face: "pear", bg: false, grain: false, roll: false, ...o })}</g>`;
const FEAR = F("worried", { lid: 0.0, eyeScale: 1.12, pupil: 0.75, sweat: 0 }), PANIC = F("worried", { lid: 0, eyeScale: 1.22, pupil: 0.55, browTilt: 1, m: { ...MOUTHS.o, w: 0.6, jaw: 0.5, tongue: 0 } });
const BLISS = F("proud", { lid: 1, squint: 0.2, browL: 0.7, browR: 0.7, m: { ...MOUTHS.grin, jaw: 0, tongue: 0 }, ant: 14, blush: 0.6 });
const DREAD = F("worried", { lid: 0, eyeScale: 1.25, pupil: 0.45, lookY: 1, browTilt: 1.2, browL: 0.9, browR: 0.9, m: { ...MOUTHS.wobble, tongue: 0 }, ant: -30 });

// ---- shared picture pieces
const rainBack = (wt, angle, streak = 1, o = 0.26) => fx.rain(wt, { n: 170, speed: 2300, len: 70 * streak + 3, o, seed: 2, width: 1.8, angle });
const finish = (t, wt, { angle = 8, streak = 1, o = 0.3, vig = 0.62, grade = ["#2030a0", 0.3], warm = 0, grainO = 0.1 } = {}) => [
  fx.blurred(fx.rain(wt, { n: 55, speed: 3400, len: 150 * streak + 6, o: o * 0.8, seed: 9, width: 4, angle }), 2.5),
  fx.tint(grade[0], grade[1]), fx.tint("#ff7ab8", warm, "soft-light"), fx.vignette(vig), fx.grain(t, grainO)];
function roof(c, t, wt, { moon = { x: 830, y: 430, r: 150 }, door = 0, plane = "", front = "", angle = 8, streak = 1, fgBlur = 8, far = 1, fg = "" } = {}) {
  return [
    fx.layer(N.sky(moon), c, 0.04),
    fx.layer(N.cityFar(), c, 0.12, { blur: 2.2 * far }),
    fx.layer(N.cityMid(), c, 0.3, { blur: 1.4 * far }),
    fx.fog(t, { y: 1220, o: 0.2 }),
    fx.layer(N.cityNear(), c, 0.55, { blur: 0.8 * far }),
    rainBack(wt, angle, streak),
    fx.layer(N.acrossAlley(), c, 0.9),
    fx.layer(N.roofBack() + N.hut(door) + N.roofFloor() + plane, c, 1),
    fg ? fx.layer(fg, c, 1.8, { blur: fgBlur }) : "",
    front,
  ];
}
const night = (id, lights = [], ambient = [0.76, 0.64, 0.98], bright = 0) => fx.litFilter(id, { ambient, lights, bright });
const fingers = (x, y, o = 1) => [-1, 1].map((s) => [0, 1, 2].map((i) => `<ellipse cx="${x + s * (96 + i * 27)}" cy="${y + 3}" rx="15" ry="19" fill="#c0408f"/><ellipse cx="${x + s * (96 + i * 27) - 4}" cy="${y - 5}" rx="6" ry="5" fill="#ff9fd0" opacity=".5"/>`).join("")).join("");
const title = (t) => { const a = seg(t, 10.05, 10.25), b = seg(t, 10.2, 10.45);
  return `<rect width="${W}" height="${H}" fill="#000"/><text x="540" y="880" text-anchor="middle" font-family="Anton" font-size="78" letter-spacing="6" fill="#ffe66d" opacity="${a}">FIELD REPORT #1</text>
  <text x="540" y="1040" text-anchor="middle" font-family="Anton" font-size="150" letter-spacing="8" fill="#fff" opacity="${b}" transform="translate(540 1000) scale(${lerp(1.15, 1, easeOut(b))}) translate(-540 -1000)">GRAVITY</text>`; };

// ---- S1: the peek
function s1(t, env) {
  const c = fx.shake(fx.camera(t, [[0, N.AC_X + 20, 1215, 1.75, -1.5], [1.8, N.AC_X, 1195, 2.25, 0.5]]), t, 5, 1, 2.2);
  const sweep = kf(t, [[0, -34], [0.55, -10], [0.95, 2.5], [1.35, 2.5], [1.8, 4]]);            // torch angle; it stops on him
  const hit = seg(t, 0.82, 0.95), up = kf(t, [[0, 78], [0.3, 0], [1.42, 0], [1.62, 120]], easeOut) + spring(t - 0.92, 9, 30) * 10;
  const dart = kf(t, [[0, -0.9], [0.32, -0.9], [0.42, 0.7], [0.66, 0.7], [0.74, -1], [1.8, -1]]);
  let e = blend(F("worried", { lid: 0.1, look: dart, sweat: 0 }), { ...PANIC, look: -1, m: { ...MOUTHS.wobble, tongue: 0 } }, hit);
  e = ants({ ...e, lid: Math.max(e.lid, blink(t, [0.34, 0.68]) * (1 - hit)), sweat: seg(t, 1.0, 1.7) }, -12 + hit * 30 + spring(t - 0.9, 6, 28) * 16, -12 + hit * 30 - spring(t - 0.9, 6, 28) * 16);
  const f = night("L1", [{ color: "#9fd0ff", az: 315, power: 0.9, size: 9 }, { color: "#fff0c8", az: 180, power: 2.2 * hit, size: 12 }], [lerp(0.7, 0.95, hit), lerp(0.6, 0.86, hit), lerp(0.98, 0.88, hit)], hit * 0.04);
  const beamY = 1190, plane = fx.beam(-300, beamY - 60, sweep, 2400, 13, "#fff3d6", 0.5, 10)
    + peek(e, { filter: f, bob: 0, turn: -0.25 * (1 - hit) + dart * 0.12, nod: 0.2, hatRot: spring(t - 0.92, 7, 26) * -5 }, N.AC_X, PY + up)
    + N.acUnit() + (up < 60 ? `<g transform="translate(0 ${Math.max(0, up - 8)})">${fingers(N.AC_X, N.FLOOR - 352)}</g>` : "")
    + fx.beam(-300, beamY - 60, sweep, 2400, 13, "#fff3d6", 0.16 + 0.1 * hit, 16);
  return [...roof(c, t, t, { plane, fgBlur: 14, far: 2.2, fg: N.fgPipe() }), fx.flash(pulse(t, 0.84, 1.0, 0.05) * 0.28, "#fff3d6"), ...finish(t, t, { vig: 0.75, warm: hit * 0.12 })];
}

// ---- S2: the agent in the doorway; the jump; the bolt
function s2(t, env) {
  const u = t - 1.8;
  let c = fx.camera(t, [[1.8, 760, 1235, 0.86, 0], [3.1, 800, 1235, 0.93, 0], [3.6, 1750, 1235, 1.05, 0]], (p) => p);
  c = fx.shake({ ...c, x: lerp(c.x, 1750, 0) }, t, 4 + 22 * pulse(t, 1.8, 2.1, 0.05), 3);
  const whip = seg(t, 3.28, 3.6);
  c.x = lerp(fx.camera(t, [[1.8, 760, 1235, 0.86], [3.28, 805, 1235, 0.94]]).x, 1750, easeIn(whip));
  // Peek: pops up with a jump, lands, winds up, bolts
  const jump = u < 0.75 ? Math.sin(seg(u, 0.12, 0.72) * Math.PI) : 0, land = spring(u - 0.72, 8, 22);
  const wind = pulse(t, 2.62, 3.0, 0.14), go = seg(t, 2.98, 3.6);
  const px = N.AC_X + 20 - wind * 46 + easeIn(go) * 900;
  const ph = (t - 2.98) * 26;
  let e = u < 0.95 ? { ...F("surprised", { pupil: 0.55, eyeScale: 1.25 }), symbol: "!", symbolPop: easeOutBack(seg(u, 0.1, 0.3)) * (1 - seg(u, 0.75, 0.95)) }
    : blend(F("surprised", { pupil: 0.6 }), { ...PANIC, look: 1 }, seg(u, 0.95, 1.15));
  e = ants(say(e, 0), 26 * jump + land * 20, 26 * jump - land * 20);
  const running = go > 0;
  const o = { filter: night("L2", [{ color: "#ffe2a8", az: 180, power: 2.4, size: 12 }, { color: "#9fd0ff", az: 315, power: 0.7, size: 8 }], [0.84, 0.72, 0.92], 0.02),
    bounce: jump * 150 + (running ? Math.abs(Math.sin(ph)) * 26 : 0), squash: 1 + jump * 0.1 - Math.max(0, land) * 0.1 - wind * 0.1,
    hatLift: jump * 46 + Math.max(0, -land) * 10, hatRot: jump * 7 - go * 8, turn: lerp(0, 1, seg(u, 0.85, 1.05)) - wind * 0.5, sway: -wind * 9 + go * 15,
    armL: u < 0.8 ? { x: 310, y: 540 + 60 * (1 - jump) } : { x: 420 + 60 * Math.cos(ph), y: 770 - 30 * Math.sin(ph) }, armR: u < 0.8 ? { x: 890, y: 540 + 60 * (1 - jump) } : { x: 800 - 60 * Math.cos(ph), y: 770 + 30 * Math.sin(ph) },
    legL: running ? { x: 44 * Math.cos(ph), y: -64 * Math.max(0, Math.sin(ph)), rot: 22 * Math.sin(ph) } : { y: -jump * 30, rot: -jump * 20 },
    legR: running ? { x: -44 * Math.cos(ph), y: -64 * Math.max(0, -Math.sin(ph)), rot: -22 * Math.sin(ph) } : { y: -jump * 24, rot: jump * 20 }, shadow: jump < 0.2 };
  const cx = N.DOOR_X + 10, [tx, ty] = N.croweTorch(-6), aim = -6 + noise(t * 3, 4) * 1.2;
  const croweG = `<g transform="translate(${cx} ${N.FLOOR - 4}) scale(0.99)">${N.crowe({ aim, glint: 0.7 + 0.3 * Math.sin(t * 9), green: 0.5 + 0.5 * Math.sin(t * 16) })}</g>`;
  const bx = cx + tx, by = N.FLOOR - 4 + ty, ang = Math.atan2(PY - 420 - o.bounce * K - by, px - bx) * 180 / Math.PI;
  const plane = `<ellipse cx="${cx + 260}" cy="${N.FLOOR + 60}" rx="560" ry="90" fill="#ffd27a" opacity=".22"/>`
    + `<path d="M${cx - 60} ${N.FLOOR + 10} L${cx + 80} ${N.FLOOR + 10} L${cx + 1500} ${N.FLOOR + 250} L${cx + 900} ${N.FLOOR + 330} Z" fill="#03040c" opacity=".45"/>`
    + croweG + fx.beam(bx, by, ang, 2600, 15, "#fff3d6", 0.55, 10)
    + `<g opacity=".5">${peek(e, { ...o, id: "sh", filter: fx.shadowFilter("shf", "#000", 5), shadow: false }, px + 150, PY - 10, K * 1.04, "")}</g>`
    + peek(e, o, px, PY) + N.acUnit() + fx.glow(bx, by, 150, "#fff6dc", 0.9);
  const body = [...roof(c, t, t, { door: 1, plane, fgBlur: 10, far: 1.2 }), fx.flash(pulse(t, 1.8, 2.05, 0.03) * 0.5, "#fff3d6"), ...finish(t, t, { warm: 0.1 })];
  return whip > 0.02 ? [fx.blurred(body.join(""), 70 * Math.sin(whip * Math.PI * 0.5), 0)] : body;
}

// ---- S3: the run
function s3(t, env) {
  const u = seg(t, 3.6, 5.5), ph = (t - 2.98) * 26;
  const px = lerp(1350, N.EDGE - 70, u * (0.9 + 0.1 * u));
  const lookBack = pulse(t, 4.25, 4.95, 0.16), crouch = pulse(t, 5.3, 5.5, 0.1);
  let c = fx.camera(t, [[3.6, px + 330, 1250, 1.05, -2], [4.4, px + 250, 1255, 1.32, -3.5], [5.5, px + 150, 1235, 1.2, -1]], (p) => p);
  c.x = px + kf(t, [[3.6, 230], [4.4, 150], [5.5, 110]]); c.z = kf(t, [[3.6, 1.0], [4.4, 1.18], [5.5, 1.1]]);
  c = fx.shake(c, t, 13, 5, 11);
  let e = blend({ ...PANIC, look: 1, lookY: 0.1 }, { ...FEAR, look: -1, browTilt: 1.1 }, lookBack);
  e = ants(say(e, 0.25 + 0.75 * lv(env, "peek", t)), -32 + Math.sin(ph * 2) * 10, 24 + Math.sin(ph * 2 + 1) * 10);
  e.sweat = (t * 1.7) % 1;
  const o = { filter: night("L3", [{ color: "#fff0c8", az: 180, power: 1.9, size: 12 }, { color: "#9fd0ff", az: 315, power: 1.0, size: 8 }], [0.84, 0.72, 0.94], 0.02),
    bounce: Math.abs(Math.sin(ph)) * 30 * (1 - crouch), squash: 1 + 0.05 * Math.cos(ph * 2) - crouch * 0.16, sway: 16 - lookBack * 5 - crouch * 8, turn: 1 - lookBack * 1.9, nod: 0.25,
    hatRot: -9 + Math.sin(ph * 2) * 3, hatLift: 6 + 8 * Math.abs(Math.cos(ph)),
    armL: { x: 420 + 76 * Math.cos(ph), y: 760 - 36 * Math.sin(ph) }, armR: { x: 800 - 76 * Math.cos(ph), y: 760 + 36 * Math.sin(ph) },
    legL: { x: 50 * Math.cos(ph), y: -70 * Math.max(0, Math.sin(ph)), rot: 24 * Math.sin(ph) }, legR: { x: -50 * Math.cos(ph), y: -70 * Math.max(0, -Math.sin(ph)), rot: -24 * Math.sin(ph) } };
  const bx = px - 1250, by = 1000 + noise(t * 4, 2) * 30, ang = Math.atan2(PY - 380 - by, px - bx) * 180 / Math.PI + noise(t * 6, 8) * 1.5;
  const puff = [0, 1, 2, 3].map((i) => { const a = ((t * 3.4 + i * 0.25) % 1); return `<ellipse cx="${px - 110 - a * 190}" cy="${PY - 6 - a * 34}" rx="${28 + a * 44}" ry="${16 + a * 24}" fill="#aab6ff" opacity="${(0.3 * (1 - a)).toFixed(2)}"/>`; }).join("");
  const plane = fx.beam(bx, by, ang, 2600, 15, "#fff3d6", 0.5, 12)
    + `<g opacity=".42">${peek(e, { ...o, id: "sh", filter: fx.shadowFilter("shf", "#000", 6), shadow: false }, px + 190, PY - 6, K * 1.05)}</g>` + puff + peek(e, o, px, PY);
  const body = [...roof(c, t, t, { plane, angle: 30, fgBlur: 18, far: 1.6, fg: N.fgMasts() }), fx.blurred(fx.speedLines(t, { o: 0.2, angle: 180, n: 18 }), 2), ...finish(t, t, { angle: 34, o: 0.4, warm: 0.06 })];
  const whipIn = 1 - seg(t, 3.6, 3.74);
  return whipIn > 0.02 ? [fx.blurred(body.join(""), 60 * whipIn, 0)] : body;
}

// ---- S4 and S5: the float, then the realisation
const FLOAT_X = N.EDGE + 330, FLOAT_Y = 1210;
function s45(t, env) {
  const slow = t < 8.3, wt = 5.5 + (t - 5.5) * (slow ? 0.07 : 1), T = t - 0.6;   // the float runs 0.6 s longer than first cut; T is the old clock
  const rise = easeOut(seg(t, 5.5, 6.3)), drift = Math.sin((t - 5.5) * 1.3) * 10;
  const px = FLOAT_X + (t - 5.5) * 18, py = FLOAT_Y - rise * 90 + drift;
  const drop = seg(T, 8.14, 8.5), fall = easeIn(drop) * 2600;
  let c;
  if (slow) c = fx.shake(fx.camera(t, [[5.5, px - 40, py - 440, 1.0, -7], [8.3, px, py - 420, 1.38, 4]]), t, 3, 7, 1.2);
  else c = fx.shake(fx.camera(T, [[7.7, px, py - 400, 2.1, 0], [8.1, px, py - 392, 2.3, 0], [8.5, px, py - 340, 2.0, 0]]), t, 3 + drop * 26, 7, 8);
  const open1 = seg(T, 7.72, 7.82), open2 = seg(T, 7.98, 8.06), down = seg(T, 7.86, 7.98);
  let e;
  if (slow) e = say({ ...BLISS, squint: 0.2 + 0.15 * Math.sin(t * 2) }, lv(env, "peek", t) * 0.9);
  else { e = blend({ ...BLISS }, DREAD, open2); e.lidL = lerp(1, 0, open2); e.lidR = lerp(1, 0, open1); e.lid = 0; e.lookY = down; e.look = 0; e.pupil = lerp(1, 0.45, down);
    e.sweat = seg(T, 7.95, 8.5) * 0.8; e = say(e, lv(env, "peek", t)); }
  e = ants(e, Math.sin(t * 1.7) * 5 - (slow ? 0 : open2 * 40 - drop * 70), Math.sin(t * 1.7 + 1) * 5 - (slow ? 0 : open2 * 40 - drop * 70));
  const spread = slow ? easeOutBack(seg(t, 5.5, 6.0)) : 1 - open2 * 0.35;
  const o = { filter: night("L4", [{ color: "#cfe3ff", az: 225, power: 1.7, size: 10 }, { color: "#cfe3ff", az: 315, power: 1.5, size: 10 }, { color: "#ff7ac0", az: 90, power: 0.5, size: 14 }], [0.86, 0.76, 1.0], 0.03),
    shadow: false, tilt: slow ? -4 + Math.sin(t * 1.1) * 2 : 0, squash: 1 + drop * 0.32,
    armL: { x: lerp(430, 268, spread), y: lerp(760, 610 + (slow ? 0 : open2 * 60) - drop * 190, spread) }, armR: { x: lerp(770, 932, spread), y: lerp(760, 610 + (slow ? 0 : open2 * 60) - drop * 190, spread) },
    legL: { x: -16, y: 10 + Math.sin(t * 1.5) * 5, rot: 26 }, legR: { x: 16, y: 16 + Math.sin(t * 1.5 + 0.8) * 5, rot: -22 },
    hatLift: fall / K * (drop < 1 ? 1 : 1), hatRot: slow ? 0 : drop * -8, nod: slow ? -0.25 : down * 0.9 };
  // the hat hangs in the air for a beat after he has gone
  const moon = { x: 540 + (px - 540) * 0.04 + 10, y: 900 + (py - 440 - 960) * 0.04 - 60, r: 430 };
  const sparkle = Array.from({ length: 70 }, (_, i) => { const x = fx.rnd(i * 3) * W, y = ((fx.rnd(i * 7) * H + wt * 420) % H), tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i));
    return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="2.6" ry="${slow ? 9 : 40}" fill="#dfeaff" opacity="${(0.55 * tw).toFixed(2)}"/>`; }).join("");
  const plane = peek(e, o, px, py + fall);
  const layers = [
    fx.layer(N.sky(moon), c, 0.04), fx.layer(N.cityFar(), c, 0.12, { blur: 3 }), fx.layer(N.cityMid(), c, 0.3, { blur: 2.4 }), fx.fog(t, { y: 1500, o: 0.3 }),
    fx.layer(N.cityNear(), c, 0.55, { blur: 1.6 }), fx.layer(N.acrossAlley(), c, 0.9, { blur: 1 }), slow ? sparkle : rainBack(wt, 8, 1),
    fx.layer(N.roofBack() + N.roofFloor() + plane, c, 1),
    slow ? fx.glow(540, 880, 760, "#bcd0ff", 0.22) : fx.blurred(fx.speedLines(t, { angle: 90, o: 0.5 * drop, n: 22 }), 2),
    ...finish(t, wt, { streak: slow ? 0.06 : 1, o: slow ? 0.5 : 0.3, vig: slow ? 0.5 : 0.7, grade: ["#2a3cc0", 0.26], warm: slow ? 0.16 : 0 }),
    fx.flash(pulse(t, 5.5, 5.72, 0.04) * 0.55), fx.bars(slow ? ease(seg(t, 5.5, 5.8)) : 1 - seg(T, 7.7, 7.8), 120),
  ];
  return layers;
}

// ---- S6: the alley
function s6(t, env) {
  const u = t - 8.5, hitT = 0.5, y = u < hitT ? -700 + 2200 * (u / hitT) ** 1.6 : 1500, hit = u - hitT;
  const lid = hit > 0.1 ? easeIn(seg(hit, 0.1, 0.22)) : 0, sq = hit > 0 ? Math.exp(-hit * 9) * Math.cos(hit * 30) : 0;
  const c = fx.shake({ x: 540, y: 960 + 60, z: 1.02, rot: 0 }, t, hit > 0 ? 60 * Math.exp(-hit * 7) : 5, 11, 14);
  const e = ants({ ...PANIC, lookY: 1, m: { ...MOUTHS.o, w: 0.7, jaw: 1, tongue: 0 } }, -60, -60);
  const o = { filter: night("L6", [{ color: "#ffb866", az: 320, power: 1.6, size: 10 }], [0.85, 0.7, 0.85]), shadow: false, squash: 1.35, armL: { x: 330, y: 440 }, armR: { x: 870, y: 440 }, legL: { y: -30, rot: -20 }, legR: { y: -30, rot: 20 }, hatLift: 150 };
  const debris = hit > 0 ? [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = -Math.PI / 2 + (fx.rnd(i * 3) - 0.5) * 2.2, v = 900 + fx.rnd(i * 7) * 700, x = 540 + Math.cos(a) * v * hit, yy = 1400 + Math.sin(a) * v * hit + 1900 * hit * hit;
    return i % 3 === 0 ? `<path d="M${x} ${yy} q20 -34 44 -6 q-18 -8 -44 6" fill="#f2d14b" stroke="#b9962a" stroke-width="3" transform="rotate(${hit * 500 + i * 50} ${x} ${yy})"/>` : `<ellipse cx="${x}" cy="${yy}" rx="${22 + i * 3}" ry="${15 + i * 2}" fill="#0b0b12"/>`; }).join("") : "";
  // the hat arrives last
  const hatU = seg(u, 0.55, 0.78), hatY = lerp(-300, 1392, easeIn(hatU));
  const inner = N.alley() + N.dumpsterBack() + (u < hitT + 0.05 ? peek(e, o, 540, y, K * 0.96) : "") + N.dumpster(lid, sq) + debris;
  return [fx.layer(inner, c, 1), hatU > 0 ? fx.layer(hatOnly(hatY, u), c, 1) : "", u < hitT ? fx.blurred(fx.speedLines(t, { angle: 90, o: 0.45, n: 24 }), 2) : "",
    fx.impact(540, 1380, seg(hit, 0, 0.32)), fx.flash(hit > 0 ? Math.exp(-hit * 16) * 0.85 : 0), ...finish(t, t, { vig: 0.7, grade: ["#3a2a90", 0.25], warm: 0.12 })];
}
// the hat alone (drawn simply, so it can fall and settle on the lid)
function hatOnly(y, u) { const settle = u >= 0.78 ? -spring(u - 0.78, 8, 24) * 30 : 0, rot = u < 0.78 ? (u - 0.55) * 160 - 30 : -6 + spring(u - 0.78, 7, 20) * 12;
  return `<g transform="translate(540 ${y + settle}) rotate(${rot}) scale(${K * 0.96})"><ellipse cx="0" cy="22" rx="336" ry="62" fill="#050508"/><ellipse cx="0" cy="6" rx="336" ry="60" fill="#1c1c26"/><ellipse cx="-80" cy="-18" rx="170" ry="16" fill="#fff" opacity=".08"/>
    <path d="M-170 0 C-180 -116 -130 -178 0 -172 C130 -178 180 -116 170 0 C120 28 -120 28 -170 0 Z" fill="#23232e"/><path d="M-169 -40 C-120 -10 120 -10 169 -40 L170 0 C120 28 -120 28 -170 0 Z" fill="#c8257c"/>
    <g transform="rotate(12 116 -44)"><rect x="72" y="-78" width="96" height="60" rx="5" fill="#d9cfb4"/><text x="120" y="-39" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="24" fill="#22201C">PRESS</text></g></g>`; }

// ---- S7: Gotcha
function s7(t, env) {
  const u = seg(t, 9.3, 10), c = fx.shake({ x: 540, y: 960, z: lerp(1.0, 1.16, easeOut(u)), rot: lerp(5, 2, u) }, t, 4, 13, 3);
  const lean = easeOutBack(seg(t, 9.3, 9.6)) * 18;
  const inner = `<g transform="translate(120 1360) scale(1.25)">${N.crowe({ aim: 62, lean, glint: 0.6 + 0.4 * Math.sin(t * 30), green: 0.5 + 0.5 * Math.sin(t * 44), halo: "#cfe0ff", haloO: 0.9 })}</g>
    <path d="M-400 1180 L1480 980 L1480 2400 L-400 2400 Z" fill="#070818"/><path d="M-400 1180 L1480 980 L1480 1010 L-400 1212 Z" fill="#4a4680"/>`;
  const lx = 560 + lean * 6, ly = 760 + lean * 4;
  return [fx.layer(N.sky({ x: 700, y: 520, r: 300 }), c, 0.04), fx.layer(N.cityFar(), { ...c, y: 1900 }, 0.12, { blur: 3 }), rainBack(t, 8, 1, 0.3), fx.layer(inner, c, 1),
    fx.glow(lx, ly, 520 + 90 * Math.sin(t * 40), "#fff6dc", 0.95), fx.glow(lx, ly, 150, "#ffffff", 1), fx.beam(lx, ly, 90, 1500, 46, "#fff3d6", 0.4, 22),
    ...finish(t, t, { vig: 0.78, grade: ["#2030a0", 0.3] }), fx.flash(seg(t, 9.93, 10) ** 2, "#000")];
}

export function draw(t, env) {
  if (t >= 10.6) return fx.frame(() => title(t - 0.6));
  if (t < 9.1) { const f = t < 1.8 ? s1 : t < 3.6 ? s2 : t < 5.5 ? s3 : s45; return fx.frame(() => f(t, env)); }
  return fx.frame(() => (t < 9.9 ? s6 : s7)(t - 0.6, env));
}
