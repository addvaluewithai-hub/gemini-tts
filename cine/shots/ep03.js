// Peek · Episode 3 · WHY DO ASTRONAUTS FLOAT? (about 89 s). Timing comes from out/ep03.json (audio/ep03_sound.py, mouths.cjs).
//  Cold open (0 - rs): fear at the top of the drop tower; the release, "I... I FLOAT!"; the brakes; Crowe at the gate; "Uh-oh."; title.
//  Report A (rs - is): the reveal (he reports from the prize shelf, among pink alien plush toys), then the board; cut on "They are..."
//  Interruption (is - bs): Crowe checks the plush toys' teeth against the bitten apple: "Not you." "Not you." "...You." He takes the wrong one.
//  Report B (bs - ts): "...falling." Peek frozen in his plush pose under the board.
//  Tag (ts - end): Crowe on a bench with the wrong plush: "These teeth... are sewn on."  NEXT REPORT / DO HEAVY THINGS FALL FASTER?
// Layout keeps faces, captions and titles out of the Shorts interface (bottom 480 px, right 190 px).
import { MOUTHS } from "../lib/peek.js";
import * as fx from "../lib/fx.js";
import * as N from "../sets/night.js";
import * as M from "../sets/moon.js";
import * as FR from "../sets/fair.js";
import * as X from "../lib/explain.js";
import { crowe as drawCrowe, croweHands, WALK_CYCLE } from "../lib/crowe.js";
import { F, blend, ants, speak, lv, blink, blinks, peek, night, finish, PANIC, BLISS, DEADPAN } from "../lib/act.js";

const { seg, lerp, ease, easeOut, easeIn, easeOutBack, kf, clamp, spring, pulse, noise, W, H } = fx;
export const ENV = "out/ep03.json";
export const DUR = 89;
export const duration = (env) => (env ? env.dur : DUR);
const caps = (env, t, o) => (env ? X.captions(env.words, t, o) : "");
const OUT = { y: 1340 }, BOARD = { y: 1100 };
const NOMOON = { x: -5000, y: -5000, r: 1 };
const TALK = F("neutral", { lid: 0.3, browL: -0.1, browR: 0.3 });
const FROZEN = F("grin", { lid: 0.05, eyeScale: 1.12, sweat: 0.7, blush: 0.3 });     // his plush pose: a fixed grin, eyes wide
const popIn = (t, at, d = 0.3) => easeOutBack(seg(t, at, at + d));
const fade = (t, a, d = 0.2) => seg(t, a, a + d);
const NOTE = (x, y, text, size, col, o, rot = -5) => (o <= 0 ? "" : `<g transform="rotate(${rot} ${x} ${y})">${X.label(x, y, text, size, col, o)}</g>`);
const skyG = () => N.sky(NOMOON);

// ---- Agent Crowe on the rig (lib/crowe.js, the black silhouette): placed at (x, y), scale k, mirrored to face left
const CK = 0.85;
function CR(x, o, { flip = false, k = CK, y = FR.FLOOR_Y } = {}) {
  const h = croweHands(o), sg = flip ? -1 : 1, P = ([a, b]) => [x + sg * a * k, y + b * k], aim = o.aim ?? -8;
  return { svg: `<g transform="translate(${x.toFixed(1)} ${y}) scale(${(sg * k).toFixed(3)} ${k})">${drawCrowe(o)}</g>`, lens: P(h.lens), far: P(h.far), beamA: flip ? 180 - aim : aim };
}
// a walk from x0 to x1 between t0 and t1: eased, `settle` blending the stance in and out over the first and last half step,
// a lean that follows his speed, a head settle after the stop, and `arrive` for the torch arm to come to rest a beat late
function walkOf(t, t0, t1, x0, x1, k = CK) {
  const u = seg(t, t0, t1), x = lerp(x0, x1, ease(u)), speed = 6 * u * (1 - u) / 1.5, d = Math.abs(x - x0) / k, total = Math.abs(x1 - x0) / k, half = WALK_CYCLE / 2;
  const settle = u <= 0 ? 1 : Math.max(1 - clamp(d / half), 1 - clamp((total - d) / half));
  return { x, walk: d, settle, lean: 3 * speed, nodSettle: t > t1 ? spring(t - t1, 5, 12) : 0, arrive: ease(seg(t, t1 - 0.05, t1 + 0.45)) };
}
const swingHand = (Wk, rest, arrive) => { const d = croweHands({ walk: Wk.walk, settle: Wk.settle }).near; return { x: lerp(d[0], rest.x, arrive), y: lerp(d[1], rest.y, arrive) }; };
const ALERT = (t) => (Math.sin(t * 40) > 0 ? 1 : 0.35);
const HOLD = { x: 150, y: -700 };                            // the torch hand at rest by his chest (the torch is off at the fair)

// ============================================================ COLD OPEN
const TOP = { x: 540, y: 1520 };                             // where Peek's seat is in the close shots
function bokeh(t, y0 = 1400, o = 1) {                        // the fair's lights far below, out of focus
  return fx.blurred(Array.from({ length: 46 }, (_, i) => { const x = fx.rnd(i * 3) * 1300 - 110, y = y0 + fx.rnd(i * 7) * 520, r = 16 + fx.rnd(i * 11) * 30, c = ["#ffe08a", "#ff9fd0", "#9fe6ff", "#ffd27a", "#b9ff9f"][i % 5];
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${c}" opacity="${((0.35 + 0.3 * Math.sin(t * 3 + i)) * o).toFixed(2)}"/>`; }).join(""), 7);
}
function seatClose(t, env, e, o, { lift = 0, k = 1.3, shake = 0, streak = 0, by = 0 } = {}) {
  // a close on one seat: the seat back, Peek, the lap bar; the fair's lights below; streak > 0 makes them rush upward
  const sx = TOP.x + noise(t * 30, 1) * shake, sy = TOP.y + noise(t * 30, 2) * shake;
  const seatBack = `<g transform="translate(${sx} ${sy}) scale(${k * 2.2})"><rect x="-62" y="-250" width="124" height="270" rx="34" fill="#7a1f3a"/><rect x="-50" y="-236" width="100" height="244" rx="26" fill="#a3304f"/><rect x="-70" y="10" width="140" height="60" rx="14" fill="#4a1426"/></g>`;
  const bar = `<g transform="translate(${sx} ${sy - 70 * k}) scale(${k * 2.2})"><path d="M-62 -80 C-62 10 -30 30 0 30 C30 30 62 10 62 -80" fill="none" stroke="#ffd23f" stroke-width="20" stroke-linecap="round"/><path d="M-62 -80 C-62 10 -30 30 0 30 C30 30 62 10 62 -80" fill="none" stroke="#fff3a8" stroke-width="6" stroke-linecap="round" opacity=".6"/></g>`;
  const lights = streak > 0 ? fx.blurred(Array.from({ length: 40 }, (_, i) => { const x = fx.rnd(i * 5) * 1200 - 60, y = ((fx.rnd(i * 9) * 2400 - t * 3200 * streak) % 2400 + 2400) % 2400 - 200, c = ["#ffe08a", "#ff9fd0", "#9fe6ff", "#ffd27a"][i % 4];
    return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} v${(260 * streak).toFixed(0)}" stroke="${c}" stroke-width="${10 + (i % 3) * 6}" stroke-linecap="round" opacity=".5"/>`; }).join(""), 4) : bokeh(t, 1350 + by);
  const f = night("Ls3", [{ color: "#ffd9a0", az: 100, power: 1.3, size: 12 }, { color: "#9fd0ff", az: 250, power: 0.7, size: 9 }], [0.82, 0.74, 0.98], 0.03);
  return [`<rect width="${W}" height="${H}" fill="#0a0b26"/>`, fx.layer(skyG(), { x: 540, y: 960, z: 1, rot: 0 }, 0.04), M.bigMoon(860, 300, 230, 0.6), lights,
    seatBack, peek(e, { filter: f, shadow: false, ...o }, sx, sy - lift, k), bar];
}
function coTop(t, env) {                                    // 0 - 0.8: frame one: white-knuckled, eyes down at the drop
  const e = ants({ ...PANIC, look: 0.1, lookY: 1, eyeScale: 1.38, pupil: 0.3, sweat: 1, m: { ...MOUTHS.o, w: 0.46, smile: -0.4, jaw: 1, smirk: 0, tongue: 0 } }, -44 + noise(t * 25, 2) * 12, -44 - noise(t * 25, 3) * 12);
  return [...seatClose(t, env, e, { nod: 0.85, armL: { x: 380, y: 880 }, armR: { x: 820, y: 880 }, tilt: noise(t * 20, 4) * 2 }, { k: 1.3, shake: 3 }), ...finish(t, t, { rain: false, vig: 0.62, grade: ["#2a3cc0", 0.2] }), caps(env, t, OUT)];
}
function coWide(t, env) {                                   // 0.8 - 2.0: the tower against the Moon; Peek alone at the top; Crowe far below at the gate
  const c = fx.camera(t, [[0.8, 540, 320, 0.5, 0], [2.0, 540, 280, 0.52, 0]]);
  const ring = FR.seatRing(540, -1060, 1), [px, py] = ring.seat(0);
  const C = CR(150, { hand: HOLD, aim: 30, torch: 0.3, led: "#46ff7a", ledO: 0.9 }, { k: 0.85 });
  const plane = FR.tower(540, -1400, FR.FLOOR_Y, t) + ring.back + peek(ants(F("worried", { lookY: 1 }), -30, -30), { shadow: false }, px, py, 0.3) + ring.front
    + `<rect x="-200" y="${FR.FLOOR_Y}" width="1500" height="400" fill="#0d0b22"/><rect x="40" y="${FR.FLOOR_Y - 120}" width="220" height="120" fill="none" stroke="#3b3374" stroke-width="10"/>` + C.svg;
  return [fx.layer(skyG(), c, 0.04), fx.layer(M.bigMoon(760, 420, 300, 0.8), c, 0.04), fx.layer(FR.fairground(1700, t), c, 0.6), fx.layer(plane, c, 1), ...finish(t, t, { rain: false, vig: 0.6, grade: ["#2a3cc0", 0.22] }), caps(env, t, OUT)];
}
function coDrop(t, env) {                                   // 2.0 - 4.4: the release; he floats a little off the seat, the hat above his head; "I... I FLOAT!"
  const u = t - 2.0, lift = easeOut(clamp(u / 0.35)) * 26, joy = ease(seg(t, 2.35, 2.75));
  const e0 = blend({ ...PANIC, lookY: 0.2, look: 0, eyeScale: 1.3, m: { ...MOUTHS.o, w: 0.6, jaw: 0.9, tongue: 0 } }, { ...BLISS, lid: 0.3, squint: 0.3 }, joy);
  const e = ants(speak(e0, env, t), lerp(-30, 26, joy) + Math.sin(t * 5) * 6, lerp(-30, 26, joy) - Math.sin(t * 5) * 6);
  const arms = { armL: { x: lerp(380, 260, joy), y: lerp(880, 520, joy) + Math.sin(t * 3) * 10 }, armR: { x: lerp(820, 940, joy), y: lerp(880, 500, joy) - Math.sin(t * 3) * 10 } };
  return [...seatClose(t, env, e, { ...arms, hatLift: -lerp(10, 70, easeOut(clamp(u / 0.6))) + Math.sin(t * 4) * 6, legL: { y: -20, rot: -14 }, legR: { y: -20, rot: 14 }, tilt: Math.sin(t * 2) * 3 }, { k: 1.3, lift, shake: u < 0.15 ? 18 : 2, streak: clamp(u / 0.5) }),
    fx.flash(pulse(t, 2.0, 2.12, 0.04) * 0.35, "#fff8e0"), ...finish(t, t, { rain: false, vig: 0.55, grade: ["#2a3cc0", 0.18], warm: 0.08 * joy }), caps(env, t, OUT)];
}
function coBrake(t, env) {                                  // 4.4 - 5.4: the brakes: he slams into the seat, the hat comes down over his eyes
  const u = t - 4.4, sq = 1 - 0.16 * Math.exp(-u * 8) * Math.cos(u * 30);
  const e = ants({ ...F("worried", { lid: 0.2 }), m: { ...MOUTHS.o, w: 0.5, jaw: 0.5, tongue: 0 } }, -50, -50);
  return [...seatClose(t, env, e, { squash: sq, hatLift: lerp(-40, 95, easeIn(clamp(u / 0.18))), armL: { x: 380, y: 880 }, armR: { x: 820, y: 880 } }, { k: 1.3, shake: 30 * Math.exp(-u * 6), streak: 1 - clamp(u / 0.2) }),
    ...finish(t, t, { rain: false, vig: 0.6, grade: ["#2a3cc0", 0.2] }), caps(env, t, OUT)];
}
function coBottom(t, env) {                                 // 5.4 - 8.0: the seats arrive at the bottom; Crowe takes two steps toward them; the detector goes red
  const c = fx.camera(t, [[6.2, 60, 1330, 0.62, 0], [7.2, 180, 1330, 0.63, 0], [8.0, 185, 1330, 0.635, 0]]);  // pans with his step; the frame width caps the push-in
  const ringY = lerp(-400, 1560, easeOut(seg(t, 5.4, 5.95))), ring = FR.seatRing(540, ringY, 1), [px, py] = ring.seat(0);
  const Wk = walkOf(t, 6.2, 7.2, -560, -560 + WALK_CYCLE * CK), red = t > 6.0;
  const C = CR(Wk.x, { walk: Wk.walk, settle: Wk.settle, hand: swingHand(Wk, HOLD, Wk.arrive), aim: 30, torch: 0.3, lean: Wk.lean, nod: 6 + 4 * Wk.nodSettle, led: red ? "#ff3b3b" : "#46ff7a", ledO: red ? ALERT(t) : 0.9 });
  const e = ants(F("worried", { lid: 0.2 }), -40, -40);
  const plane = `<rect x="-1400" y="${FR.FLOOR_Y}" width="4000" height="900" fill="#1a1436"/>${[-500, 0, 700, 1200].map((x, i) => `<ellipse cx="${x}" cy="${FR.FLOOR_Y + 120 + i * 30}" rx="260" ry="40" fill="${['#ffd27a', '#ff9fd0', '#9fe6ff', '#ffd27a'][i]}" opacity=".08"/>`).join('')}` + FR.tower(540, -1400, FR.FLOOR_Y, t) + ring.back + peek(e, { shadow: false, hatLift: 95 }, px, py, 0.3) + ring.front
    + `<rect x="-760" y="${FR.FLOOR_Y - 180}" width="240" height="180" fill="none" stroke="#3b3374" stroke-width="10"/>` + C.svg;
  return [fx.layer(skyG(), c, 0.04), fx.layer(FR.fairground(1700, t), c, 0.6), fx.layer(plane, c, 1),
    red ? fx.glow(...fx.toScreen(c, Wk.x - 0.85 * 110, FR.FLOOR_Y - 0.85 * 520), 50, "#ff3b3b", 0.4 * ALERT(t)) : "", ...finish(t, t, { rain: false, vig: 0.6, grade: ["#2a3cc0", 0.24] }), caps(env, t, OUT)];
}
function coUhoh(t, env) {                                   // 8.0 - rs: he pushes the hat up and sees him (off frame left); "Uh-oh."; the title
  const up = ease(seg(t, 8.0, 8.3));
  const e = ants(speak({ ...F("worried", { lid: 0.1, look: -1, lookY: 0.1, browTilt: 1, sweat: 0.8 }), lid: Math.max(0.1, blink(t, [9.9])) }, env, t), -36, -36);
  const title = `<g opacity="${seg(t, 9.5, 9.65)}">${X.label(540, 1290, "FIELD REPORT #3", 70, "#ffe66d", 1, 1)}${X.label(540, 1425, "FLOATING", 150, "#fff", 1, lerp(1.25, 1, easeOut(seg(t, 9.52, 9.75))))}</g>`;
  return [...seatClose(t, env, e, { hatLift: lerp(95, 0, up), armR: { x: lerp(820, 700, pulse(t, 7.95, 8.45, 0.12)), y: lerp(880, 240, pulse(t, 7.95, 8.45, 0.12)), front: true }, armL: { x: 380, y: 880 }, turn: -0.4 }, { k: 1.1, by: 120 }),
    ...finish(t, t, { rain: false, vig: 0.62, grade: ["#2a3cc0", 0.2] }), t < 9.5 ? caps(env, t, OUT) : "", title];
}

// ============================================================ THE PRIZE STALL (live shots)
// the shelf line-up (world x): the plush toys and Peek, 153 apart (one half step of Crowe's at CK 0.85), so his stops fall
// on whole half steps; the third toy has the biggest teeth
const LINE = [{ x: 160, hat: "party", teeth: 1 }, { x: 313, hat: "cowboy", teeth: 0.95 }, { x: 466, peek: true }, { x: 619, hat: "crown", teeth: 1.35 }, { x: 772, hat: "beanie", teeth: 1 }];
const PEEK_X = 466, PK = 0.33;
function shelfRow(t, pe, po, { taken = 0, carried = null } = {}) {
  return LINE.map((q, i) => q.peek ? peek(pe, { shadow: false, ...po }, q.x, FR.SHELF_Y, PK) + priceTag(q.x + 40, FR.SHELF_Y - 120)
    : i === 3 && taken ? "" : FR.plush(q.x, FR.SHELF_Y, 0.95, q.hat, { teeth: q.teeth, tilt: Math.sin(t * 0.7 + i) * 1.2 })).join("");
}
const priceTag = (x, y) => `<path d="M${x - 14} ${y - 20} L${x} ${y}" stroke="#c9b98a" stroke-width="2"/><g transform="translate(${x} ${y}) rotate(14)"><rect x="-4" y="0" width="48" height="30" rx="5" fill="#fffbe8"/><text x="20" y="23" text-anchor="middle" font-family="Anton" font-size="18" fill="#c2405a">$5</text></g>`;
const stallLight = () => fx.def("stallF", "") && "";
function stallShot(t, env, c, plane, extra = [], front = "") {
  return [`<rect width="${W}" height="${H}" fill="#0a0820"/>`, fx.layer(FR.stall(t) + plane + FR.counter() + front, c, 1), ...extra, fx.vignette(0.5), fx.grain(t, 0.08)];
}
const pkLight = () => night("Lst", [{ color: "#ffe0a8", az: 90, power: 1.2, size: 12 }], [0.92, 0.84, 0.95], 0.06);
function rReveal(t, env) {                                  // rs - news: the reveal (he is on the prize shelf), then on him: "Commander. Field report number three."
  const b = env.beats, wide = t < env.rs + 1.15;
  const c = wide ? fx.camera(t, [[env.rs, 540, 960, 0.98, 0], [env.rs + 1.15, 540, 950, 1.02, 0]]) : fx.camera(t, [[env.rs + 1.15, PEEK_X, 900, 2.3, 0], [b.news, PEEK_X, 900, 2.4, 0]]);
  const e = ants(speak({ ...blend(DEADPAN, TALK, seg(t, b.report - 0.2, b.report + 0.1)), look: 0.4, lid: Math.max(0.3, blinks(t, 2.6)) }, env, t), Math.sin(t * 6) * 6, -Math.sin(t * 6) * 6);
  const tips = [-1, 1].map((sg) => [PEEK_X + sg * 285 * PK, FR.SHELF_Y - 915 * PK]);
  const radio = tips.map(([x, y]) => fx.glow(x, y, 26, "#ffe66d", 0.8) + `<circle cx="${x}" cy="${y}" r="${10 + ((t * 2.2) % 1) * 30}" fill="none" stroke="#ffe66d" stroke-width="3" opacity="${(0.8 * (1 - (t * 2.2) % 1)).toFixed(2)}"/>`).join("");
  return [...stallShot(t, env, c, shelfRow(t, e, { filter: pkLight(), armR: { x: 820, y: 640 } }) + radio), caps(env, t, OUT)];
}

// ============================================================ THE REPORT BOARD
const ZONE = { x: 40, y: 190, w: 1000, h: 820 }, ZC = [540, 600];
// under the board: Peek on the shelf between two plush toys. frozen = 1 in report B: stiff plush pose, fixed grin, eyes darting
function strip(t, env, face = TALK, gesture = null, g = 0, frozen = 0) {
  const dart = frozen ? (Math.sin(t * 1.7) > 0.6 ? -0.9 : Math.sin(t * 1.7) < -0.6 ? 0.9 : 0) : null;
  let e = frozen ? { ...FROZEN, look: dart, lookY: -0.1, lid: Math.max(0.05, blinks(t, 3.4)) } : { ...face, lid: Math.max(face.lid, blinks(t, 2.9)), look: face.look ?? 0.55, lookY: face.lookY ?? -0.6 };
  e = speak(e, env, t);
  if (frozen) e = { ...e, m: fx.mix(FROZEN.m, e.m, 0.25) };                                   // his lips barely move
  e = ants(e, frozen ? -4 : Math.sin(t * 2) * 3, frozen ? 4 : Math.sin(t * 2 + 1) * 3);
  g *= 1 - frozen;
  const arms = frozen ? { armL: { x: 300, y: 650 }, armR: { x: 900, y: 650 } }
    : gesture === "point" ? { armR: { x: lerp(770, 900, g), y: lerp(770, 470, g) + Math.sin(t * 5) * 6 } }
    : gesture === "palm" ? { armR: { x: lerp(770, 652, g), y: lerp(770, 420, g), front: true } } : {};
  const sh = `<rect x="0" y="1740" width="${W}" height="200" fill="#2a1630"/><rect x="0" y="1740" width="${W}" height="16" fill="#b07a4a"/><rect x="0" y="1740" width="${W}" height="5" fill="#e0a86a" opacity=".6"/>`;
  return sh + FR.plush(70, 1748, 1.6, "beanie", { tilt: frozen ? 0 : Math.sin(t) * 1.5 }) + FR.plush(640, 1748, 1.6, "crown", { teeth: 1.35, tilt: frozen ? 0 : Math.sin(t + 1) * 1.5 })
    + peek(e, { turn: frozen ? 0 : 0.4, tilt: frozen ? 0 : Math.sin(t * 1.7) * 1.5, bob: frozen ? 0 : Math.sin(t * 3.1) * 3, ...arms }, 330, 1750, 0.62) + (frozen ? priceTag(395, 1600) : "");
}
function boardFrame(t, env, t0, inner, face, gesture, g, frozen = 0) {
  const age = t - t0, slide = (1 - easeOut(clamp(age / 0.22))) * 260, drift = 1 + 0.03 * clamp(age / 4);
  fx.def("zonec", `<clipPath id="zonec"><rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44"/></clipPath>`);
  fx.def("zoneg", `<radialGradient id="zoneg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#232b6e"/><stop offset="1" stop-color="#0b0e30"/></radialGradient>`);
  return [X.board(t, frozen ? "#10143a" : "#161b4a"), `<rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44" fill="url(#zoneg)"/>
    <g clip-path="url(#zonec)"><g transform="translate(${ZC[0] + slide} ${ZC[1]}) scale(${drift.toFixed(4)}) translate(${-ZC[0]} ${-ZC[1]})" opacity="${clamp(age / 0.12)}">${inner}</g></g>
    <rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44" fill="none" stroke="#7fd4ff" stroke-width="5" opacity=".55"/>`,
    fx.vignette(0.4), strip(t, env, face, gesture, g, frozen), fx.grain(t, 0.07), caps(env, t, BOARD)];
}
const A = (t, env, t0, inner, face = TALK, gesture = "point", g = 0) => boardFrame(t, env, t0, inner, face, gesture, g, 0);
const B = (t, env, t0, inner) => boardFrame(t, env, t0, inner, FROZEN, null, 0, 1);
const tinyPeek = (x, y, e, o = {}, k = 0.2) => peek(e, { shadow: false, id: o.id || "tiny", ...o }, x, y, k);
const planet = (x, y, R, turn = 0) => { if (R < 600) return X.earth(x, y, R, turn); const id = `pc${Math.round(R)}`;
  return `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${(R * 1.006).toFixed(1)}"/></clipPath><g clip-path="url(#${id})">${X.earth(x, y, R, turn)}</g><circle cx="${x}" cy="${y}" r="${(R * 1.003).toFixed(1)}" fill="none" stroke="#7fd4ff" stroke-width="8" opacity=".45"/>`; };
const bracket = (x, y0, y1, col, o = 1, side = 1) => o <= 0 ? "" : `<path d="M${x - 16 * side} ${y0} H${x} V${y1} H${x - 16 * side}" fill="none" stroke="${col}" stroke-width="6" stroke-linejoin="round" opacity="${o}"/>`;

// ---- report A
function bStopwatch(t, env) {                               // "Good news: I floated. Bad news: for two seconds."
  const b = env.beats, fall = ease(seg(t, b.news + 0.1, b.bad + 0.9)), ringY = lerp(500, 880, fall), sec = clamp((t - b.news - 0.1) / Math.max(0.6, b.bad + 0.9 - b.news - 0.1)) * 2;
  const ring = `<rect x="160" y="250" width="44" height="700" fill="#2f2860"/><rect x="100" y="${ringY - 40}" width="164" height="60" rx="14" fill="#a3304f"/><rect x="100" y="${ringY + 14}" width="164" height="16" rx="6" fill="#ffd23f"/>`;
  const me = tinyPeek(182, ringY - 30 - 24 * Math.sin(Math.PI * fall), { ...BLISS, lid: 0.4 }, { armL: { x: 260, y: 520 }, armR: { x: 940, y: 520 }, hatLift: -40 }, 0.22);
  const ang = -90 + sec / 2 * 360, cx = 680, cy = 600, R = 250;
  const watch = `<circle cx="${cx}" cy="${cy}" r="${R + 24}" fill="#cfd6ee"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#0b0e30"/><rect x="${cx - 26}" y="${cy - R - 70}" width="52" height="50" rx="10" fill="#cfd6ee"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return `<path d="M${cx + Math.sin(a) * (R - 30)} ${cy - Math.cos(a) * (R - 30)} L${cx + Math.sin(a) * (R - 8)} ${cy - Math.cos(a) * (R - 8)}" stroke="#7fd4ff" stroke-width="7"/>`; }).join("")}
    <path d="M${cx} ${cy} L${cx + Math.cos(ang * Math.PI / 180) * (R - 40)} ${cy + Math.sin(ang * Math.PI / 180) * (R - 40)}" stroke="#ff4f6d" stroke-width="12" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="16" fill="#ff4f6d"/>`;
  return A(t, env, b.news - 0.12, ring + me + watch + X.label(cx, cy + 40, `${sec.toFixed(1)} s`, 110, "#ffe66d", fade(t, b.bad)), TALK, "point", pulse(t, b.bad, b.theory - 0.2, 0.2));
}
const EC = [540, 1190], ER = 370;                           // the planet at the bottom of the "higher = weaker" picture
function bHigher(t, env) {                                  // "Theory: the higher you go, the weaker their pull."
  const b = env.beats, pts = [[1.1, -122], [1.5, -90], [2.0, -58]];
  const items = pts.map(([r, deg], i) => { const a = deg * Math.PI / 180, x = EC[0] + Math.cos(a) * r * ER, y = EC[1] + Math.sin(a) * r * ER, L = 300 / (r * r), on = popIn(t, b.higher + 0.15 + i * 0.35);
    return on > 0 ? `<g transform="translate(${x} ${y}) scale(${on}) translate(${-x} ${-y})">${X.apple(x, y, 44, 0)}</g>` + X.arrow(x - Math.cos(a) * 52, y - Math.sin(a) * 52, x - Math.cos(a) * (52 + L), y - Math.sin(a) * (52 + L), 14, "#ffe66d", t * 2, seg(t, b.higher + 0.3 + i * 0.35, b.higher + 0.5 + i * 0.35)) : ""; }).join("");
  return A(t, env, b.theory - 0.12, X.earth(EC[0], EC[1], ER, t * 0.1) + items + NOTE(270, 300, "PEEK'S THEORY", 56, "#ff9fd0", fade(t, b.theory + 0.3)), TALK, "point", pulse(t, b.higher, b.upwhere - 0.2, 0.2));
}
function bZero(t, env) {                                    // "Up where their astronauts live, it is switched off. Zero gravity. I checked. Wrong."
  const b = env.beats, sx = 540, sy = 430, x = 600, stamp = popIn(t, b.wrong, 0.25);
  return A(t, env, b.upwhere - 0.12, X.earth(EC[0], EC[1], ER, t * 0.1) + M.station(sx, sy, 0.7, 0)
    + `<g opacity="${fade(t, b.upwhere + 0.4)}">${X.arrow(sx, sy + 70, sx, sy + 260, 16, "#ffe66d", t * 2)}<path d="M${sx - 70} ${sy + 110} L${sx + 70} ${sy + 230} M${sx + 70} ${sy + 110} L${sx - 70} ${sy + 230}" stroke="#ff4f6d" stroke-width="16" stroke-linecap="round" opacity="${fade(t, b.zero - 0.2)}"/></g>`
    + X.label(800, 370, "0", 150, "#ff4f6d", fade(t, b.zero)) + NOTE(270, 300, "PEEK'S THEORY", 56, "#ff9fd0", 1)
    + (stamp > 0 ? `<g transform="translate(330 470) rotate(-12) scale(${stamp})"><rect x="-170" y="-70" width="340" height="120" rx="12" fill="none" stroke="#ff4f6d" stroke-width="12"/>${X.label(0, 30, "WRONG", 96, "#ff4f6d")}</g>` : ""),
    F("skeptical"), "point", pulse(t, b.zero, b.station - 0.2, 0.2));
}
function bScale(t, env) {                                   // "Their station is only two hundred and fifty miles up." TO SCALE: the orbit hugs the planet
  const b = env.beats, z = lerp(1.6, 1, easeOut(seg(t, b.station - 0.12, b.station + 0.5))), R = 1400, top = 880, cy = top + R, ro = R * (6771 / 6371), oy = cy - ro;
  const inner = `<g transform="translate(540 ${top}) scale(${z}) translate(-540 ${-top})">${planet(540, cy, R, 0)}<circle cx="540" cy="${cy}" r="${ro}" fill="none" stroke="#ffe66d" stroke-width="5" stroke-dasharray="10 12"/>${M.station(540, oy, 0.28, 0)}</g>`
    + bracket(780, oy, top, "#ffe66d", fade(t, b.station + 0.6), 1) + X.label(900, (oy + top) / 2 + 22, "400 km", 64, "#ffe66d", fade(t, b.station + 0.6))
    + X.label(540, 330, "TO SCALE", 92, "#fff", fade(t, b.station + 0.2)) + X.label(540, 420, "IT HUGS THE PLANET", 56, "#9fd0ff", fade(t, b.station + 1.0));
  return A(t, env, b.station - 0.12, inner, TALK, "point", pulse(t, b.station + 0.3, b.pull - 0.2, 0.2));
}
function bPull(t, env) {                                    // "And the pull there is about nine tenths of the pull down here. Almost the same."
  const b = env.beats, L = 520, y0 = 330, g = popIn(t, b.pull + 0.1), s = ease(seg(t, b.pull + 0.5, b.pull + 1.3)) * 0.885;
  return A(t, env, b.pull - 0.12, X.arrow(330, y0, 330, y0 + L * clamp(g), 26, "#ffe66d", t * 2) + (s > 0.02 ? X.arrow(720, y0, 720, y0 + L * s, 26, "#ffe66d", t * 2) : "")
    + bracket(440, y0, y0 + L, "#ffe66d", g, 1) + X.label(550, y0 + L / 2 + 28, "100 %", 84, "#ffe66d", g)
    + bracket(820, y0, y0 + L * 0.885, "#ffe66d", fade(t, b.pull + 1.3), 1) + X.label(915, y0 + L * 0.44 + 28, "90 %", 84, "#ffe66d", fade(t, b.pull + 1.3))
    + X.label(330, 935, "GROUND", 76, "#fff", g) + X.label(720, 935, "STATION", 76, "#fff", fade(t, b.pull + 0.4)), TALK, "point", pulse(t, b.pull, b.why - 0.2, 0.2));
}
function bWhy(t, env) {                                     // "So why do they float? Here is the secret. They are..."
  const b = env.beats, port = popIn(t, b.why - 0.1, 0.35), drift = Math.sin(t * 1.3) * 22, spin = t * 22;
  return A(t, env, b.why - 0.12, `<g transform="translate(540 600) scale(${port})"><circle r="330" fill="#cfd6ee"/><circle r="300" fill="#0b0e30"/><clipPath id="portc3"><circle r="300"/></clipPath><g clip-path="url(#portc3)"><rect x="-320" y="150" width="640" height="16" fill="#3a4490"/>
    <g transform="translate(0 ${drift - 20}) rotate(${spin})">${M.astronaut(0, 0, 1.6)}</g></g></g>` + X.label(860, 410, "?", 200, "#ffe66d", fade(t, b.why + 0.8), easeOutBack(seg(t, b.why + 0.8, b.why + 1.1))),
    F("skeptical", { lookY: -0.6 }), "point", pulse(t, b.secret, b.they + 0.3, 0.2));
}

// ============================================================ THE INTERRUPTION (live, the stall)
function interrupt(t, env) {
  const b = env.beats, IS = env.is, bs = env.bs, n1 = b.not1, n2 = b.not2, you = b.you;
  const appleH = { x: 150, y: -1080 };                       // his far hand raised beside a toy's face (the apple in it)
  const stops = [160, 313, 619].map((x) => x - 198);          // his body x when the apple is beside toy 1, 2 and 3
  // his moves: in from the left (3 half steps), a half step, a whole step past Peek, then away to the left (3 cycles)
  let Wk, flip = false;
  if (t < n2 - 0.85) Wk = walkOf(t, IS + 0.7, n1 - 0.3, stops[0] - 2 * 180 * CK, stops[0]);
  else if (t < you - 1.0) Wk = walkOf(t, n2 - 0.85, n2 - 0.15, stops[0], stops[1]);
  else if (t < you + 0.9) Wk = walkOf(t, you - 1.0, you - 0.15, stops[1], stops[2]);
  else { flip = true; Wk = walkOf(t, you + 0.95, bs + 0.6, stops[2], stops[2] - 3 * WALK_CYCLE * CK); }
  const raise = Math.max(pulse(t, n1 - 0.35, n2 - 0.75, 0.25), pulse(t, n2 - 0.15, you - 1.0, 0.2), ease(seg(t, you - 0.2, you + 0.1)) * (1 - ease(seg(t, you + 0.5, you + 0.8))));
  const tucked = t > you + 0.6, carried = ease(seg(t, you + 0.5, you + 0.8));
  const rest = { x: -40, y: -520 }, handL = tucked ? { x: 90, y: -760 } : { x: lerp(rest.x, appleH.x, raise), y: lerp(rest.y, appleH.y, raise) };
  const o = { walk: Wk.walk, settle: Wk.settle, hand: swingHand(Wk, HOLD, Wk.arrive), handL, handLFront: raise > 0.15 || tucked, aim: 40, torch: 0.2, lean: Wk.lean,
    nod: 12 * raise + 5 * Wk.nodSettle, glint: 0.6 + 0.4 * raise, led: "#ff3b3b", ledO: ALERT(t) };
  const C = CR(Wk.x, o, { flip });
  const apple = !tucked && raise > 0.05 ? M.bitten(C.far[0] + 4, C.far[1] - 30, 30, -10) : "";
  const prize = tucked ? FR.plush(C.far[0] + (flip ? -10 : 10), C.far[1] + 120, 0.7, "crown", { teeth: 1.35, tilt: flip ? -14 : 14 }) : "";
  // Peek: snapped into his plush pose; in his close-up he hides his teeth (lips shut, cheeks puffed)
  const hide = pulse(t, b.not2_end - 0.1, you + 0.3, 0.15);
  const snap = ease(seg(t, IS + 0.2, IS + 0.45));
  let pe = snap > 0.5 ? { ...FROZEN, look: hide > 0.3 ? (Math.sin(t * 2.4) > 0 ? -0.7 : 0.7) : 0, lookY: 0 } : { ...F("surprised", { look: -1 }) };
  if (hide > 0.3) pe = { ...pe, m: { ...MOUTHS.flat, w: 0.5, smile: -0.05, jaw: 0, tongue: 0 }, blush: 0.9, sweat: 1 };
  if (t > bs - 0.6) pe = speak({ ...HUSHf(), look: -0.6, sweat: 0.6 }, env, t);
  pe = ants(pe, snap > 0.5 ? -4 : 20, snap > 0.5 ? 4 : 20);
  const po = { filter: pkLight(), armL: { x: lerp(400, 300, snap), y: lerp(700, 650, snap) }, armR: { x: lerp(800, 900, snap), y: lerp(700, 650, snap) }, squash: hide > 0.3 ? 1.03 : 1 };
  // cameras: close on Peek at the start, wide on the line-up, close on Peek between "Not you" and "You" (no Crowe), close at the end
  const closeA = t < IS + 0.7, closeB = t > b.not2_end + 0.05 && t < you - 1.0, closeC = t > bs - 0.6;
  const c = closeA || closeB || closeC ? fx.camera(t, [[IS, PEEK_X, 930, 2.6, 0], [bs + 2, PEEK_X, 935, 2.7, 0]]) : fx.camera(t, [[IS + 0.7, 400, 1075, 0.95, 0], [bs, 420, 1065, 0.97, 0]]);
  const showCrowe = !(closeA || closeB || closeC);
  const plane = shelfRow(t, pe, po, { taken: tucked });
  // hiding his teeth: lips pressed shut over them, cheeks puffed (the face rig always draws the teeth)
  const my = FR.SHELF_Y - (1010 - 540) * PK, lips = hide > 0.3 ? `<g opacity="${clamp((hide - 0.3) / 0.3)}"><ellipse cx="${PEEK_X}" cy="${my + 4}" rx="${46 * PK}" ry="${30 * PK}" fill="#e83e93"/><path d="M${PEEK_X - 30 * PK} ${my} Q${PEEK_X} ${my + 8 * PK} ${PEEK_X + 30 * PK} ${my}" stroke="#7a1846" stroke-width="${5 * PK}" fill="none" stroke-linecap="round"/>${[-1, 1].map((sg) => `<ellipse cx="${PEEK_X + sg * 150 * PK}" cy="${my - 20 * PK}" rx="${46 * PK}" ry="${36 * PK}" fill="#ff5fae" opacity=".6"/>`).join("")}</g>` : "";
  return [...stallShot(t, env, c, plane + lips, [], showCrowe ? C.svg + apple + prize : ""), closeB ? "" : caps(env, t, OUT)];
}
const HUSHf = () => F("worried", { lid: 0.1, lookY: -0.2, look: -0.9, browTilt: 0.9, sweat: 0.7, m: { ...MOUTHS.flat, tongue: 0 } });

// ============================================================ REPORT B (Peek frozen in his plush pose under the board)
const OC = [540, 620];
const tang = (th) => [Math.sin(th), -Math.cos(th)];
function orbitPic(t, R, rs, th, { pull = 1, side = 0, label = null, sideLen = 200 } = {}) {
  const sx = OC[0] + Math.cos(th) * rs, sy = OC[1] + Math.sin(th) * rs, dx = OC[0] - sx, dy = OC[1] - sy, L = Math.hypot(dx, dy), [vx, vy] = tang(th);
  return `<circle cx="${OC[0]}" cy="${OC[1]}" r="${rs}" fill="none" stroke="#9fd0ff" stroke-width="4" stroke-dasharray="6 14" opacity=".5"/>` + X.earth(OC[0], OC[1], R, t * 0.15)
    + M.station(sx, sy, 0.34, th * 180 / Math.PI + 90)
    + (pull > 0 ? X.arrow(sx + dx / L * 44, sy + dy / L * 44, sx + dx / L * (L - R - 24), sy + dy / L * (L - R - 24), 13, "#ffe66d", t * 2, pull) : "")
    + (side > 0 ? X.arrow(sx + vx * 50, sy + vy * 50, sx + vx * sideLen, sy + vy * sideLen, 13, "#ff7ab8", t * 2, side) : "");
}
function bFalling(t, env) {                                 // "...falling. All the time."
  const b = env.beats, th = -Math.PI * 0.7 - (t - b.alltime) * 0.6, rs = 290, sx = OC[0] + Math.cos(th) * rs, sy = OC[1] + Math.sin(th) * rs;
  return B(t, env, b.alltime - 0.15, orbitPic(t, 190, rs, th, { pull: fade(t, b.alltime - 0.1) }) + X.label(OC[0] + (sx - OC[0]) / rs * (rs + 115), OC[1] + (sy - OC[1]) / rs * (rs + 115) + 25, "PULL", 70, "#ffe66d", fade(t, b.alltime), lerp(1.2, 1, easeOut(seg(t, b.alltime, b.alltime + 0.3)))));
}
function seatPanel(cx, top, falling, t, t0, peekE) {        // one panel of the ride picture: the seat, Peek, the arrows
  const drop = falling ? ease(seg(t, t0, t0 + 0.6)) * 120 : 0, gap = falling ? 26 * ease(seg(t, t0 + 0.1, t0 + 0.5)) : 0, y = top + 360 + drop;
  const seat = `<rect x="${cx - 80}" y="${y - 130}" width="160" height="150" rx="26" fill="#a3304f"/><rect x="${cx - 90}" y="${y + 10}" width="180" height="34" rx="10" fill="#4a1426"/>`;
  const me = tinyPeek(cx, y + 10 - gap, peekE, { shadow: false, armL: { x: 330, y: falling ? 560 : 760 }, armR: { x: 870, y: falling ? 560 : 760 } }, 0.27);
  const pull = X.arrow(cx + 120, y - 160 - gap, cx + 120, y - 30 - gap, 13, "#ffe66d", t * 2) + (falling ? X.arrow(cx - 120, y - 10, cx - 120, y + 120, 13, "#ffe66d", t * 2) : "");
  const push = falling ? "" : X.arrow(cx - 130, y + 140, cx - 130, y + 30, 13, "#ff7ab8", t * 2);
  return (falling ? `<g opacity=".45">${[0, 1, 2].map((i) => `<path d="M${cx - 60 + i * 60} ${top + 120} v120" stroke="#9fd0ff" stroke-width="6" stroke-linecap="round"/>`).join("")}</g>` : `<rect x="${cx - 140}" y="${y + 44}" width="280" height="14" fill="#5661a8"/>`) + seat + me + pull + push;
}
function bRide(t, env) {                                    // "On that ride, my seat fell with me. Nothing pushed on me. So I floated."
  const b = env.beats, r = popIn(t, b.nothing - 0.2, 0.3);
  const left = seatPanel(290, 230, false, t, 0, F("neutral", { lid: 0.3 })) + X.label(290, 300, "STANDING", 56, "#9fd0ff", 1) + X.label(290, 860, "YOU FEEL", 56, "#ff9fd0", fade(t, b.ride + 0.5)) + X.label(290, 925, "THE PUSH", 56, "#ff9fd0", fade(t, b.ride + 0.5));
  const right = r > 0 ? `<g opacity="${clamp(r)}">${seatPanel(790, 230, true, t, b.nothing - 0.2, t > b.floated ? { ...BLISS, lid: 0.4 } : F("surprised"))}${X.label(790, 300, "FALLING", 56, "#ffe66d", 1)}${X.label(790, 860, "NOTHING", 56, "#ffe66d", fade(t, b.nothing + 0.2))}${X.label(790, 925, "PUSHES", 56, "#ffe66d", fade(t, b.nothing + 0.2))}</g>` : "";
  return B(t, env, b.ride - 0.12, `<path d="M540 230 V950" stroke="#7fd4ff" stroke-width="4" opacity=".4"/>` + left + right);
}
function bTogether(t, env) {                                // "Their station is a ride that never stops."
  const b = env.beats, drift = Math.sin(t * 1.2) * 16;
  return B(t, env, b.never - 0.12, planet(540, 2200, 1300, t * 0.02) + `<rect x="140" y="300" width="800" height="440" rx="120" fill="#cfd6ee" opacity=".15" stroke="#cfd6ee" stroke-width="10"/>`
    + `<g transform="translate(470 ${500 + drift}) rotate(${Math.sin(t) * 10})">${M.astronaut(0, 0, 1.0)}</g>` + X.arrow(470, 640 + drift, 470, 780 + drift, 13, "#ffe66d", t * 2, fade(t, b.never + 0.4))
    + X.arrow(850, 650, 850, 790, 13, "#ffe66d", t * 2, fade(t, b.never + 0.6)) + X.label(800, 400, "SHIP", 60, "#cfd6ee", fade(t, b.never + 0.6))
    + X.label(540, 872, "FALLING TOGETHER", 64, "#ffe66d", fade(t, b.never + 0.8)));
}
function bOrbit(t, env) {                                   // "It falls toward the planet, but it moves sideways seventeen thousand miles an hour, so it keeps missing."
  const b = env.beats, th = -Math.PI * 0.75 - (t - b.falls) * 0.9;
  return B(t, env, b.falls - 0.12, orbitPic(t, 180, 280, th, { pull: 1, side: fade(t, b.sideways), sideLen: 230 })
    + `<g opacity="${fade(t, b.mph)}" transform="translate(290 880) scale(${lerp(1.25, 1, easeOut(seg(t, b.mph, b.mph + 0.3)))})">${X.label(0, 0, "27,600 km/h", 72, "#ffe66d")}</g>`);
}
function bMoon(t, env) {                                    // "Just like their Moon, only lower and faster."
  const b = env.beats, Rm = 330, a = -Math.PI / 2 - (t - b.moon) * 0.25, mx = OC[0] + Math.cos(a) * Rm, my = OC[1] + Math.sin(a) * Rm, ths = -(t - b.moon) * 3.2;
  return B(t, env, b.moon - 0.12, `<circle cx="${OC[0]}" cy="${OC[1]}" r="${Rm}" fill="none" stroke="#9fd0ff" stroke-width="4" stroke-dasharray="6 14" opacity=".5"/>` + orbitPic(t, 110, 160, ths, { pull: 0.9 })
    + M.bigMoon(mx, my, 50, 0.5) + X.label(mx - 150, my + 20, "MOON", 56, "#fff", fade(t, b.moon + 0.2)) + X.label(OC[0], OC[1] + 240, "STATION", 56, "#ffe66d", fade(t, b.lower)) + X.label(830, 300, "NOT TO SCALE", 56, "#9fd0ff", 0.9));
}
function bSummary(t, env) {                                 // "So: astronauts are not out of the pull. They float because they fall around the planet, together with their ship."
  const b = env.beats, row = (y, at, inner, text, col = "#fff") => { const a = popIn(t, at, 0.3); return a <= 0 ? "" : `<g transform="translate(540 ${y}) scale(${a}) translate(-540 ${-y})"><rect x="80" y="${y - 108}" width="920" height="216" rx="40" fill="#1c2250" stroke="#7fd4ff" stroke-width="5" opacity=".95"/>${inner}${X.label(650, y + 22, text, 60, col)}</g>`; };
  return B(t, env, b.sum1 - 0.15, row(320, b.sum1 + 0.3, M.station(200, 290, 0.28, 0) + X.arrow(200, 320, 200, 400, 10, "#ffe66d", t), "STILL PULLED")
    + row(580, b.sum2 + 0.3, `<circle cx="200" cy="580" r="70" fill="none" stroke="#ffe66d" stroke-width="5"/>${X.earth(200, 580, 30, t * 0.2)}${M.station(200 + Math.cos(-t * 2) * 70, 580 + Math.sin(-t * 2) * 70, 0.13, 0)}`, "FALL + MISS", "#ffe66d")
    + row(840, b.sum3 + 0.2, `<g transform="translate(200 ${840 + Math.sin(t * 2) * 8})">${M.astronaut(0, 0, 0.32)}</g>`, "SHIP FALLS TOO"));
}
function bWrench(t, env) {                                  // "Which raises a question... a wrench floats right beside a pencil. So do heavy things fall faster?"
  const b = env.beats, d = Math.sin(t * 1.1) * 14, w = fade(t, b.wrench + 0.2), mv = ease(seg(t, b.wrench, b.wrench + 0.45));   // a big "?" from "question"; it rises as the wrench and pencil float in
  const wrench = `<g transform="translate(380 ${600 + d}) rotate(${-20 + Math.sin(t * 0.8) * 6})"><rect x="-140" y="-24" width="280" height="48" rx="20" fill="#9aa4c8"/><path d="M140 -70 C210 -70 230 -10 220 -24 L170 -24 L170 24 L220 24 C230 10 210 70 140 70 C110 70 100 40 100 0 C100 -40 110 -70 140 -70 Z" fill="#9aa4c8"/><path d="M-140 -58 C-190 -58 -205 -12 -198 -20 L-160 -20 L-160 20 L-198 20 C-205 12 -190 58 -140 58 C-118 58 -110 30 -110 0 C-110 -30 -118 -58 -140 -58 Z" fill="#9aa4c8"/><rect x="-120" y="-8" width="230" height="10" fill="#cfd6ee" opacity=".7"/></g>`;
  const pencil = `<g transform="translate(720 ${560 - d}) rotate(${30 + Math.sin(t * 0.9) * 6})"><rect x="-150" y="-16" width="260" height="32" fill="#ffd23f"/><path d="M110 -16 L170 0 L110 16 Z" fill="#f0c890"/><path d="M152 -5 L170 0 L152 5 Z" fill="#333"/><rect x="-180" y="-16" width="30" height="32" fill="#ff9fb0"/></g>`;
  return B(t, env, b.question - 0.15, `<g opacity="${w}">${wrench}${pencil}</g>` + X.label(380, 800, "HEAVY", 56, "#fff", w) + X.label(720, 800, "LIGHT", 56, "#fff", w)
    + X.label(540, lerp(700, 430, mv), "?", 200, "#ffe66d", fade(t, b.question), easeOutBack(seg(t, b.question, b.question + 0.35)) * lerp(2.2, 1, mv)));
}
function rExit(t, env) {                                    // "Investigating. Peek out." he tips his hat, hops off the shelf and drops behind the counter
  const b = env.beats, tip = pulse(t, b.peekout - 0.1, b.peekout + 0.45, 0.15), hop = seg(t, b.peekout + 0.5, env.ts + 0.2);
  const c = fx.camera(t, [[b.out - 0.12, PEEK_X, 980, 2.0, 0], [env.ts, PEEK_X + 30, 1000, 1.8, 0]]);
  const e = ants(speak({ ...F("sly", { look: -0.4 }), lid: Math.max(0.4, blinks(t, 2.5)) }, env, t), 6, 6);
  const px = PEEK_X + hop * 160, py = FR.SHELF_Y + (hop > 0 ? -Math.sin(Math.min(1, hop * 1.6) * Math.PI) * 90 + Math.max(0, hop - 0.5) * 900 : 0);
  const pe = peek(e, { filter: pkLight(), shadow: false, turn: hop > 0 ? 0.8 : 0, armR: tip > 0.02 ? { x: lerp(820, 800, tip), y: lerp(700, 300, tip), front: true } : { x: 820, y: 700 }, hatRot: -6 * tip, legL: hop > 0 ? { y: -40, rot: -20 } : null, legR: hop > 0 ? { y: -40, rot: 20 } : null }, px, py, PK);
  const row = LINE.map((q, i) => q.peek ? "" : i === 3 ? "" : FR.plush(q.x, FR.SHELF_Y, 0.95, q.hat, { teeth: q.teeth })).join("");
  return [...stallShot(t, env, c, row + `<clipPath id="abovec"><rect x="-200" y="-400" width="1600" height="${FR.COUNTER_Y + 400 - 20}"/></clipPath><g clip-path="url(#abovec)">${pe}</g>`), caps(env, t, OUT)];
}

// ============================================================ TAG: Crowe on a bench with the wrong plush: "These teeth... are sewn on."
function tag(t, env) {
  const u = t - env.ts, nb = env.beats.next, line = env.beats.tagline, close = t > env.beats.tagline_end + 0.08;
  const q = seg(t, nb, nb + 0.2);
  fx.def("tagfade", `<linearGradient id="tagfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02030c" stop-opacity="0"/><stop offset=".25" stop-color="#02030c" stop-opacity=".88"/><stop offset=".85" stop-color="#02030c" stop-opacity=".88"/><stop offset="1" stop-color="#02030c" stop-opacity="0"/></linearGradient>`);
  let shot;
  if (!close) {                                             // under the lamp: he walks in (one cycle), stops and raises the plush to his face
    const c = fx.camera(t, [[env.ts, 470, 1250, 1.0, 0], [line, 480, 1240, 1.06, 0], [env.beats.tagline_end, 485, 1235, 1.1, 0]]);
    const Wk = walkOf(u, 0, 0.75, 360 - WALK_CYCLE * CK, 360), raise = ease(seg(u, 0.7, 1.05));
    const o = { walk: Wk.walk, settle: Wk.settle, lean: Wk.lean, hand: swingHand(Wk, HOLD, Wk.arrive), aim: 50, torch: 0, handL: { x: lerp(90, 160, raise), y: lerp(-700, -900, raise) }, handLFront: true,
      nod: 6 + 12 * raise + 5 * Wk.nodSettle, glint: 0.8 + 0.2 * raise, led: "#46ff7a", ledO: 0.9 };
    const C = CR(Wk.x, o, { y: FR.FLOOR_Y });
    shot = [fx.layer(skyG(), c, 0.04), fx.layer(M.bigMoon(820, 360, 200, 0.6), c, 0.04), fx.layer(FR.fairground(1640, t), c, 0.5, { blur: 3 }),
      fx.layer(`<rect x="-600" y="${FR.FLOOR_Y}" width="2400" height="600" fill="#0d0b22"/>` + FR.lamp(760, FR.FLOOR_Y) + C.svg
        + FR.plush(C.far[0] + 30, C.far[1] + 110, 0.6, "crown", { teeth: 1.35, tilt: 10 }), c, 1),
      ...finish(t, t, { rain: false, vig: 0.66, grade: ["#2a3cc0", 0.24] })];
  } else {                                                  // the close: the plush's sewn teeth beside the bitten apple, both big in the lamp light
    const push = 1 + 0.05 * ease(seg(t, env.beats.tagline_end, env.end)), up = ease(seg(t, nb - 0.4, nb));
    shot = [`<rect width="${W}" height="${H}" fill="#0a0820"/>`, fx.layer(FR.fairground(1640, t), { x: 540, y: 1300, z: 1.4, rot: 0 }, 0.5, { blur: 8 }), `<rect width="${W}" height="${H}" fill="#03040e" opacity=".45"/>`,
      fx.glow(560, 390, 560, "#ffd59a", 0.4), `<g transform="translate(540 510) scale(${push}) translate(-540 -760)">${FR.plush(380, 1180, 2.2, "crown", { teeth: 1.35, tilt: -4 })}${M.bitten(820, 640 - up * 30, 200, -14)}</g>`,
      fx.vignette(0.7), fx.grain(t, 0.1)];
  }
  return [...shot, q > 0 ? "" : caps(env, t, OUT), `<rect x="0" y="930" width="${W}" height="560" fill="url(#tagfade)" opacity="${q}"/>`,
    X.label(540, 1040, "NEXT REPORT", 62, "#7fd4ff", q), X.label(540, 1150, "DO HEAVY THINGS", 92, "#fff", q, lerp(1.2, 1, easeOut(seg(t, nb, nb + 0.3)))),
    X.label(540, 1290, "FALL FASTER?", 120, "#ffe66d", seg(t, nb + 0.2, nb + 0.4), lerp(1.2, 1, easeOut(seg(t, nb + 0.2, nb + 0.5)))),
    fx.flash(seg(t, env.end - 0.12, env.end) ** 2, "#000")];
}

export function draw(t, env) {
  if (!env) return fx.frame(() => `<text x="40" y="100" fill="#fff" font-size="40">run audio/ep03_sound.py first (out/ep03.json)</text>`);
  const b = env.beats;
  let f;
  if (t < env.rs) f = t < 0.8 ? coTop : t < 2.0 ? coWide : t < 4.4 ? coDrop : t < 5.4 ? coBrake : t < 8.0 ? coBottom : coUhoh;
  else if (t < env.is) f = t < b.news - 0.12 ? rReveal : t < b.theory - 0.12 ? bStopwatch : t < b.upwhere - 0.12 ? bHigher : t < b.station - 0.12 ? bZero : t < b.pull - 0.12 ? bScale : t < b.why - 0.12 ? bPull : bWhy;
  else if (t < env.ts) f = t < b.alltime - 0.15 ? interrupt : t < b.ride - 0.12 ? bFalling : t < b.never - 0.12 ? bRide : t < b.falls - 0.12 ? bTogether : t < b.moon - 0.12 ? bOrbit
    : t < b.sum1 - 0.15 ? bMoon : t < b.question - 0.15 ? bSummary : t < b.out - 0.12 ? bWrench : rExit;
  else f = tag;
  return fx.frame(() => f(t, env));
}
