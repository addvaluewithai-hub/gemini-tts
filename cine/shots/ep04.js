// Peek · Episode 4 · DO HEAVY THINGS FALL FASTER? (about 89 s). Timing comes from out/ep04.json (audio/ep04_sound.py, mouths.cjs).
//  Cold open (0 - rs): a closed superstore at night. Peek drops a bowling ball and an apple off a plank: "Heavy... light...
//    for SCIENCE!"; Crowe walks in under them; they land together either side of his shoes; he looks up at an empty shelf
//    edge; "Oh... no."; title.
//  Report A (rs - is): the reveal (he reports from the top of the rack), then the board; cut on "Because the ball..."
//  Interruption (is - bs): the store chime; Crowe on the customer-service microphone: "Attention, shoppers." "Have you
//    seen... this?"; the TV wall fills with the plush's face; Peek sinks behind a box.
//  Report B (bs - ts): "...is also forty times harder to get moving." Peek crouched behind a box, hat low, under the board.
//  Tag (ts - end): Crowe's detector plays "...Peek out." back; "...Peek."  NEXT REPORT / WHY DO YOU WEIGH LESS ON THE MOON?
// Layout keeps faces, captions and titles out of the Shorts interface (bottom 480 px, right 190 px).
import { MOUTHS } from "../lib/peek.js";
import * as fx from "../lib/fx.js";
import * as M from "../sets/moon.js";
import * as FR from "../sets/fair.js";
import * as ST from "../sets/store.js";
import * as X from "../lib/explain.js";
import { crowe as drawCrowe, croweHands, WALK_CYCLE } from "../lib/crowe.js";
import { F, blend, ants, speak, blink, blinks, peek, night, finish, PANIC, BLISS, DEADPAN } from "../lib/act.js";

const { seg, lerp, ease, easeOut, easeIn, easeOutBack, clamp, spring, pulse, noise, W, H } = fx;
export const ENV = "out/ep04.json";
export const DUR = 89;
export const duration = (env) => (env ? env.dur : DUR);
const caps = (env, t, o) => (env ? X.captions(env.words, t, o) : "");
const OUT = { y: 1340 }, BOARD = { y: 1100 };
const TALK = F("neutral", { lid: 0.3, browL: -0.1, browR: 0.3 });
const popIn = (t, at, d = 0.3) => easeOutBack(seg(t, at, at + d));
const fade = (t, a, d = 0.2) => seg(t, a, a + d);
const NOTE = (x, y, text, size, col, o, rot = -5) => (o <= 0 ? "" : `<g transform="rotate(${rot} ${x} ${y})">${X.label(x, y, text, size, col, o)}</g>`);
const { FLOOR_Y, TOP_Y, RACK_X, BALL_X, APPLE_X, BALL_R, APPLE_R, PXM } = ST;
const G = 9.81 * PXM;                                         // px per s² (real time)
const DECK = TOP_Y - 4;                                       // the top of the boxes' deck where Peek and the plank sit
const BALL_Y0 = DECK - 18 - BALL_R, APPLE_Y0 = DECK - 18 - APPLE_R;

// ---- Agent Crowe on the rig (lib/crowe.js, the black silhouette): placed at (x, y), scale k, mirrored to face left
const CK = 0.85;
function CR(x, o, { flip = false, k = CK, y = FLOOR_Y } = {}) {
  const h = croweHands(o), sg = flip ? -1 : 1, P = ([a, b]) => [x + sg * a * k, y + b * k];
  return { svg: `<g transform="translate(${x.toFixed(1)} ${y}) scale(${(sg * k).toFixed(3)} ${k})">${drawCrowe(o)}</g>`, lens: P(h.lens), far: P(h.far), near: P(h.near) };
}
function walkOf(t, t0, t1, x0, x1, k = CK) {
  const u = seg(t, t0, t1), x = lerp(x0, x1, ease(u)), speed = 6 * u * (1 - u) / 1.5, d = Math.abs(x - x0) / k, total = Math.abs(x1 - x0) / k, half = WALK_CYCLE / 2;
  const settle = u <= 0 ? 1 : Math.max(1 - clamp(d / half), 1 - clamp((total - d) / half));
  return { x, walk: d, settle, lean: 3 * speed, nodSettle: t > t1 ? spring(t - t1, 5, 12) : 0, arrive: ease(seg(t, t1 - 0.05, t1 + 0.45)) };
}
const swingHand = (Wk, rest, arrive) => { const d = croweHands({ walk: Wk.walk, settle: Wk.settle }).near; return { x: lerp(d[0], rest.x, arrive), y: lerp(d[1], rest.y, arrive) }; };
const HOLD = { x: 150, y: -700 };
const CROWE_X = 385;                                          // where he stops, between the two landing spots
const WALK0 = 1.0, WALK1 = 2.3;                               // he walks in under the plank (four half steps) and stops right under it
const walkIn = (t, b) => walkOf(t, WALK0, WALK1, CROWE_X - 4 * 180 * CK, CROWE_X);
// Crowe with the plush under his arm (near hand at his chest); `det` raises the wrist detector to look at it
function crowePlush(t, Wk, { det = 0, jolt = 0, nod = 0, flip = false } = {}) {
  const o = { walk: Wk.walk, settle: Wk.settle, hand: swingHand(Wk, HOLD, Wk.arrive), handL: { x: lerp(-20, 110, det), y: lerp(-540, -880, det) }, handLFront: det > 0.2, aim: 30, torch: 0,
    lean: Wk.lean, crouch: 0.12 * jolt, nod: nod + 14 * det + 4 * Wk.nodSettle, led: "#46ff7a", ledO: 0.9 };
  const C = CR(Wk.x, o, { flip }), [hx, hy] = C.near;
  return C.svg + FR.plush(hx + (flip ? -8 : 8), hy + 60, 0.36, "crown", { teeth: 1.35, tilt: flip ? -16 : 16 });
}

// a little burst of dust and chips where something lands (p 0..1, k size)
const puff = (x, y, p, k = 1) => p <= 0 || p >= 1 ? "" : Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (1 + i / 8), r = (30 + 120 * easeOut(p)) * k * (0.6 + fx.rnd(i * 3) * 0.6);
  return `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r * 0.5).toFixed(1)}" r="${(10 * k * (1 - p) + 2).toFixed(1)}" fill="#cfd6ee" opacity="${(0.8 * (1 - p)).toFixed(2)}"/>`; }).join("");
// ---- the store, lit for night
const pkLight = () => night("Lsto", [{ color: "#dfe8ff", az: 100, power: 1.1, size: 12 }, { color: "#ff9fd0", az: 260, power: 0.5, size: 9 }], [0.84, 0.82, 1.0], 0.04);
const storeGrade = (t, vig = 0.58) => finish(t, t, { rain: false, vig, grade: ["#2a3cc0", 0.16] });
// the aisle world: the store beyond, the far rack (left, with the bowling balls), Peek's rack (right), the floor
function aisle(t, { cracked = 0, plankOut = 1, plankRot = 0, attached = true, items = true, ballY = BALL_Y0, appleY = APPLE_Y0, appleX = APPLE_X, ballSpin = 0, peekSvg = "", front = "", noPlank = false } = {}) {
  const rot = plankOut === 0 ? -88 : plankRot;                  // the plank is hinged at the shelf edge; after the fall it hangs down
  const onPlank = ST.ball(BALL_X, BALL_Y0, BALL_R, 0) + X.apple(APPLE_X, APPLE_Y0, APPLE_R, 0);
  return ST.back(t) + ST.rack(-2200, -900, { seed: 3, labels: ["BALLS", "BATS", "SKATES", "HELMETS"] }) + ST.ballRack(-1600, ST.LEVELS[0] + 0) + ST.floor(cracked) + ST.shaft(CROWE_X, 1000, 0.13)
    + ST.rack(RACK_X, RACK_X + 1600, { seed: 1 }) + peekSvg + ST.plank(RACK_X + 260, RACK_X, DECK)
    + (noPlank ? "" : `<g transform="rotate(${rot.toFixed(2)} ${RACK_X} ${DECK})">${ST.plank(RACK_X, 150, DECK)}${items && attached ? onPlank : ""}</g>`)
    + (items && !attached ? ST.ball(BALL_X, ballY, BALL_R, ballSpin) + X.apple(appleX, appleY, APPLE_R, 0) : "") + front;
}
const teeter = (t, amp = 1.2) => amp * (Math.sin(t * 7) * 0.7 + Math.sin(t * 11.3) * 0.3);const deckBoxes = () => ST.box(RACK_X + 330, DECK, 300, 330, "PILLOWS") + ST.box(RACK_X + 650, DECK, 260, 280, "DUVETS");

// ============================================================ COLD OPEN
function coClose(t, env) {                                    // 0 - 1.0: frame one: Peek frozen, both hands out toward the teetering plank; the ball and the apple large in the foreground; "Stay..."
  const z = lerp(2.5, 2.6, clamp(t / 1.0)), c = { x: 690, y: DECK - 170, z, rot: 0 };
  const e = ants(speak({ ...F("worried", { lid: 0, eyeScale: 1.32, pupil: 0.45, look: -1, lookY: 0.75, browTilt: 1.1, browL: 0.9, browR: 0.9, sweat: 1 }), m: { ...MOUTHS.wobble, tongue: 0 } }, env, t), -36 + noise(t * 20, 2) * 8, -36 - noise(t * 20, 3) * 8);
  const shake = noise(t * 25, 5) * 6;
  const pk = peek(e, { filter: pkLight(), shadow: false, armL: { x: 240 + shake, y: 720, front: true }, armR: { x: 360 - shake, y: 780, front: true }, turn: -0.45, nod: 0.3 }, 760, DECK, 0.34);
  const rot = teeter(t, 2.2), fg = `<g transform="translate(250 1330) rotate(${rot.toFixed(2)} 330 0)">${ST.plank(-700, 360, 0).replace(/height="22"/g, 'height="34"')}<g transform="scale(1)">${ST.ball(-110, -18 - 150, 150, 0)}${X.apple(150, -18 - 63, 63, 0)}</g></g>`;
  return [fx.layer(aisle(t, { noPlank: true, peekSvg: deckBoxes() + pk }), c, 1), fx.blurred(fg, 1.5), ...storeGrade(t), caps(env, t, OUT)];
}function coHigh(t, env) {                                     // 1.0 - heavyw: the tall view down past the plank: Crowe walks in below with the plush and stops right under it; checks his detector
  const b = env.beats, c = fx.camera(t, [[1.0, 440, 400, 0.64, 0], [b.heavyw, 430, 420, 0.66, 0]]);
  const e = ants(F("worried", { lid: 0, eyeScale: 1.3, look: -1, lookY: 1, sweat: 1, m: { ...MOUTHS.wobble, tongue: 0 } }), -36, -36);
  const pk = peek(speak(e, env, t), { filter: pkLight(), shadow: false, armL: { x: 250, y: 700, front: true }, armR: { x: 380, y: 760, front: true }, turn: -0.4, nod: 0.3 }, 680, DECK, 0.3);
  const Wk = walkIn(t, b), det = ease(seg(t, WALK1 + 0.3, WALK1 + 0.7));
  return [fx.layer(aisle(t, { plankRot: teeter(t, 1.6), peekSvg: pk + deckBoxes(), front: crowePlush(t, Wk, { det }) }), c, 1), ...storeGrade(t), caps(env, t, OUT)];
}function coSide(t, env) {                                     // heavyw - yank + 0.15: the plank creaks and dips; "...heavy one first... then the apple..."; it swings down; Peek squeezes his eyes shut
  const b = env.beats, c = fx.camera(t, [[b.heavyw - 0.1, 470, DECK - 60, 1.25, 0], [b.yank + 0.15, 470, DECK - 40, 1.28, 0]]);
  const dip = -3 * ease(seg(t, b.yank - 0.6, b.yank)) + teeter(t, 1.8), sw = clamp((t - b.yank) / 0.16), rot = dip - 90 * sw * sw;
  const shut = seg(t, b.yank - 0.15, b.yank), u = Math.max(0, t - b.yank), dy = 0.5 * G * u * u;
  const e = ants(speak({ ...F("worried", { lid: shut, eyeScale: 1.3, look: -1, lookY: 0.8, browTilt: 1.2, sweat: 1 }), m: { ...MOUTHS.wobble, tongue: 0 } }, env, t), -40, -40);
  const pk = peek(e, { filter: pkLight(), shadow: false, armL: { x: lerp(260, 420, shut), y: lerp(700, 560, shut), front: true }, armR: { x: lerp(380, 780, shut), y: lerp(760, 560, shut), front: true }, turn: -0.4, squash: 1 + 0.04 * shut }, 680, DECK, 0.34);
  return [fx.layer(aisle(t, { plankRot: rot, attached: t < b.yank, ballY: BALL_Y0 + dy, appleY: APPLE_Y0 + dy, peekSvg: deckBoxes() + pk }), c, 1), ...storeGrade(t), caps(env, t, OUT)];
}function coFall(t, env) {                                     // yank + 0.15 - land + 0.6: tight on the pair, level the whole way; the camera pulls back as they reach the floor; both land on the same frame
  const b = env.beats, dt = clamp(Math.min(t, b.land) - b.yank, 0, 1), dy = 0.5 * G * dt * dt, v = G * dt;
  const landed = t >= b.land, after = Math.max(0, t - b.land);
  const bounce = landed ? Math.abs(Math.sin(after * 9)) * 70 * Math.exp(-after * 6) : 0;
  const ballY = landed ? FLOOR_Y - BALL_R : BALL_Y0 + dy, appleY = landed ? FLOOR_Y - APPLE_R - bounce : APPLE_Y0 + dy;
  const pull = ease(seg(t, b.land - 0.28, b.land));                       // the pull-back to the floor
  const tight = { x: (BALL_X + APPLE_X) / 2, y: (ballY + appleY) / 2, z: 2.8 }, wide = { x: CROWE_X, y: FLOOR_Y - 470, z: 1.45 };
  const c0 = { x: lerp(tight.x, wide.x, pull), y: lerp(Math.min(tight.y, FLOOR_Y - 200), wide.y, pull), z: Math.exp(lerp(Math.log(tight.z), Math.log(wide.z), pull)), rot: 0 };
  const cam = landed ? fx.shake(c0, t, 14 * Math.exp(-after * 8)) : c0;
  const level = !landed && pull < 0.6 ? `<path d="M${BALL_X + BALL_R + 14} ${(ballY + appleY) / 2} H${APPLE_X - APPLE_R - 14}" stroke="#fff" stroke-width="3" stroke-dasharray="10 10" opacity="${(0.5 * (1 - pull)).toFixed(2)}"/>` : "";
  const streak = landed ? "" : [[BALL_X, ballY, BALL_R], [APPLE_X, appleY, APPLE_R]].map(([x, y, r]) => `<path d="M${x} ${y - r - 10} v${-Math.min(300, 0.07 * v)}" stroke="#fff" stroke-width="${r * 0.9}" stroke-linecap="round" opacity=".1"/>`).join("");
  const Wk = walkIn(t, b), jolt = pulse(t, b.land, b.land + 0.35, 0.06), det = 1 - ease(seg(t, b.land, b.land + 0.3));
  const lines = landed || pull > 0.7 ? "" : fx.speedLines(t, { n: 22, angle: 90, o: 0.22 * (0.3 + 0.7 * dt), color: "#cfe0ff", len: 300 + 400 * dt, speed: 2600 + 3000 * dt, seed: 7 });
  return [fx.layer(aisle(t, { cracked: landed ? 1 : 0, plankOut: 0, attached: false, ballY, appleY, appleX: APPLE_X + (landed ? after * 40 * Math.exp(-after * 2) : 0), ballSpin: landed ? 0 : dt * 30,
      front: crowePlush(t, Wk, { det, jolt }) + streak + level + (landed ? puff(BALL_X, FLOOR_Y, seg(t, b.land, b.land + 0.5), 1) + puff(APPLE_X, FLOOR_Y, seg(t, b.land, b.land + 0.35), 0.4) : "") }), cam, 1),
    lines, fx.flash(pulse(t, b.land, b.land + 0.08, 0.02) * 0.25, "#fff"), ...storeGrade(t), caps(env, t, OUT)];
}function coLook(t, env) {                                     // land + 0.6 - ohno - 0.35: he looks down at the ball, at the apple, then up; then his view up the rack: empty
  const b = env.beats, l0 = b.land + 0.6, up = ease(seg(t, l0 + 1.1, l0 + 1.5)), pov = t > l0 + 1.6;
  if (pov) {                                                  // his view: the top deck edge, the plank gone, nobody
    const c = fx.camera(t, [[l0 + 1.6, 700, DECK - 100, 1.25, 0], [env.beats.ohno, 700, DECK - 140, 1.3, 0]]);
    return [fx.layer(aisle(t, { cracked: 1, plankOut: 0, items: false, peekSvg: deckBoxes() + ST.box(RACK_X + 40, DECK, 260, 300, "PILLOWS") }), c, 1), fx.vignette(0.7), ...storeGrade(t, 0.7), caps(env, t, OUT)];
  }
  const nod = 22 * ease(seg(t, l0 + 0.1, l0 + 0.4)) * (1 - up) - 16 * up;
  const C = { svg: crowePlush(t, { x: CROWE_X, walk: 0, settle: 1, lean: 0, nodSettle: 0, arrive: 1 }, { nod, flip: seg(t, l0 + 0.55, l0 + 0.6) > 0.5 && t < l0 + 1.05 }) };
  const c = fx.camera(t, [[l0, CROWE_X, FLOOR_Y - 470, 1.45, 0], [l0 + 1.6, CROWE_X, FLOOR_Y - 520, 1.5, 0]]);
  return [fx.layer(aisle(t, { cracked: 1, plankOut: 0, attached: false, ballY: FLOOR_Y - BALL_R, appleY: FLOOR_Y - APPLE_R, appleX: APPLE_X + 18, front: C.svg }), c, 1), ...storeGrade(t), caps(env, t, OUT)];
}
function coOhno(t, env) {                                     // ohno - 0.35 - rs: Peek flat behind a box, hands at his cheeks; "Oh... no."; the title
  const b = env.beats, c = fx.camera(t, [[b.ohno - 0.35, 760, DECK - 120, 2.6, 0], [env.rs, 760, DECK - 110, 2.7, 0]]);
  const open = ease(seg(t, b.ohno - 0.35, b.ohno + 0.1));
  const e = ants(speak({ ...F("worried", { lid: lerp(1, 0.05, open), squint: 0.4 * (1 - open), eyeScale: 1.25, pupil: 0.6, look: -0.8, lookY: 0.5, browTilt: 1, sweat: 1 }), lid: Math.max(lerp(1, 0.05, open), blink(t, [b.title + 0.6])) }, env, t), -40, -40);
  const pk = peek(e, { filter: pkLight(), shadow: false, armL: { x: 440, y: 600, front: true }, armR: { x: 760, y: 600, front: true }, squash: 1.05 }, 760, DECK + 20, 0.34) + ST.box(600, DECK, 330, 95, "", "#c49468");
  const title = `<g opacity="${seg(t, b.title, b.title + 0.15)}">${X.label(540, 1290, "FIELD REPORT #4", 70, "#ffe66d", 1, 1)}${X.label(540, 1425, "WHICH LANDS FIRST?", 120, "#fff", 1, lerp(1.25, 1, easeOut(seg(t, b.title + 0.02, b.title + 0.25))))}</g>`;
  return [fx.layer(aisle(t, { cracked: 1, plankOut: 0, items: false, peekSvg: pk + ST.box(RACK_X + 520, DECK, 420, 250, "PILLOWS") + ST.box(RACK_X + 940, DECK, 260, 280, "DUVETS") }), c, 1), ...storeGrade(t, 0.62), t < b.title ? caps(env, t, OUT) : "", title];
}

// ============================================================ REPORT A: the reveal
const PEEK_DX = RACK_X + 330;                                  // where Peek sits on the deck in the report
function rReveal(t, env) {
  const b = env.beats, wide = t < env.rs + 1.1;
  const c = wide ? fx.camera(t, [[env.rs, 430, 440, 0.62, 0], [env.rs + 1.1, 440, 430, 0.64, 0]]) : fx.camera(t, [[env.rs + 1.1, PEEK_DX + 40, DECK - 170, 2.3, 0], [b.ran, PEEK_DX + 40, DECK - 170, 2.4, 0]]);
  const e = ants(speak({ ...blend(DEADPAN, TALK, seg(t, b.report - 0.2, b.report + 0.1)), look: -0.3, lid: Math.max(0.3, blinks(t, 2.6)) }, env, t), Math.sin(t * 6) * 6, -Math.sin(t * 6) * 6);
  const tips = [-1, 1].map((sg) => [PEEK_DX + sg * 285 * 0.3, DECK - 915 * 0.3]);
  const radio = tips.map(([x, y]) => fx.glow(x, y, 20, "#ffe66d", 0.8) + `<circle cx="${x}" cy="${y}" r="${8 + ((t * 2.2) % 1) * 24}" fill="none" stroke="#ffe66d" stroke-width="3" opacity="${(0.8 * (1 - (t * 2.2) % 1)).toFixed(2)}"/>`).join("");
  const pk = peek(e, { filter: pkLight(), shadow: false, armR: { x: 820, y: 640 } }, PEEK_DX, DECK, 0.3) + radio;
  return [fx.layer(aisle(t, { cracked: 1, plankOut: 0, ballY: FLOOR_Y - BALL_R, appleY: FLOOR_Y - APPLE_R, appleX: APPLE_X + 18, attached: false, peekSvg: ST.box(RACK_X + 520, DECK, 300, 330, "PILLOWS") + ST.box(RACK_X + 900, DECK, 260, 280, "DUVETS") + pk }), c, 1), ...storeGrade(t), caps(env, t, OUT)];
}

// ============================================================ THE REPORT BOARD
const ZONE = { x: 40, y: 190, w: 1000, h: 820 }, ZC = [540, 600];
// under the board: Peek on the top deck of the rack among boxes. hidden = 1 in report B: crouched behind a box, hat low, eyes darting
function strip(t, env, face = TALK, gesture = null, g = 0, hidden = 0) {
  const dart = hidden ? (Math.sin(t * 1.9) > 0.55 ? -0.9 : Math.sin(t * 1.9) < -0.55 ? 0.9 : 0) : null;
  let e = hidden ? { ...F("worried", { lid: 0.15, browTilt: 0.6, sweat: 0.6 }), look: dart, lookY: -0.2, lid: Math.max(0.15, blinks(t, 3.1)) } : { ...face, lid: Math.max(face.lid, blinks(t, 2.9)), look: face.look ?? 0.55, lookY: face.lookY ?? -0.6 };
  e = ants(speak(e, env, t), hidden ? -24 : Math.sin(t * 2) * 3, hidden ? -24 : Math.sin(t * 2 + 1) * 3);
  g *= 1 - hidden;
  const arms = hidden ? { armL: { x: 420, y: 700, front: true }, armR: { x: 780, y: 700, front: true } }
    : gesture === "point" ? { armR: { x: lerp(770, 900, g), y: lerp(770, 470, g) + Math.sin(t * 5) * 6 } } : {};
  const sh = `<rect x="0" y="1740" width="${W}" height="200" fill="#2f5fb8"/><rect x="0" y="1740" width="${W}" height="12" fill="#5a8ae0"/>`;
  const boxes = ST.box(-20, 1742, 250, 300, "PILLOWS") + ST.box(560, 1742, 330, 240, "DUVETS");
  const pk = peek(e, { filter: pkLight(), turn: hidden ? 0.1 : 0.4, tilt: hidden ? 0 : Math.sin(t * 1.7) * 1.5, bob: hidden ? 0 : Math.sin(t * 3.1) * 3, hatLift: hidden ? 34 : 0, ...arms }, 330, hidden ? 1830 : 1750, 0.62);
  return sh + boxes + pk + (hidden ? ST.box(140, 1742, 400, 150, "PILLOWS", "#c49468") : "");
}
function boardFrame(t, env, t0, inner, face, gesture, g, hidden = 0) {
  const age = t - t0, slide = (1 - easeOut(clamp(age / 0.22))) * 260, drift = 1 + 0.03 * clamp(age / 4);
  fx.def("zonec", `<clipPath id="zonec"><rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44"/></clipPath>`);
  fx.def("zoneg", `<radialGradient id="zoneg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#232b6e"/><stop offset="1" stop-color="#0b0e30"/></radialGradient>`);
  return [X.board(t, hidden ? "#10143a" : "#161b4a"), `<rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44" fill="url(#zoneg)"/>
    <g clip-path="url(#zonec)"><g transform="translate(${ZC[0] + slide} ${ZC[1]}) scale(${drift.toFixed(4)}) translate(${-ZC[0]} ${-ZC[1]})" opacity="${clamp(age / 0.12)}">${inner}</g></g>
    <rect x="${ZONE.x}" y="${ZONE.y}" width="${ZONE.w}" height="${ZONE.h}" rx="44" fill="none" stroke="#7fd4ff" stroke-width="5" opacity=".55"/>`,
    fx.vignette(0.4), strip(t, env, face, gesture, g, hidden), fx.grain(t, 0.07), caps(env, t, BOARD)];
}
const A = (t, env, t0, inner, face = TALK, gesture = "point", g = 0) => boardFrame(t, env, t0, inner, face, gesture, g, 0);
const B = (t, env, t0, inner) => boardFrame(t, env, t0, inner, null, null, 0, 1);
const tinyPeek = (x, y, e, o = {}, k = 0.2) => peek(e, { shadow: false, id: o.id || "tiny", ...o }, x, y, k);
const bracket = (x, y0, y1, col, o = 1, side = 1) => o <= 0 ? "" : `<path d="M${x - 16 * side} ${y0} H${x} V${y1} H${x - 16 * side}" fill="none" stroke="${col}" stroke-width="6" stroke-linejoin="round" opacity="${o}"/>`;
const ground = (y = 905, col = "#3a4490") => `<rect x="40" y="${y}" width="1000" height="40" fill="${col}"/><rect x="40" y="${y}" width="1000" height="6" fill="#7fd4ff" opacity=".5"/>`;
const ballB = (x, y, r = 60, o = 1) => `<g opacity="${o}">${ST.ball(x, y, r, 0)}</g>`;
const appleB = (x, y, r = 24, o = 1) => `<g opacity="${o}">${X.apple(x, y, r, 0)}</g>`;
const dashed = (x0, x1, y, o = 1) => `<path d="M${x0} ${y} H${x1}" stroke="#ffe66d" stroke-width="4" stroke-dasharray="10 12" opacity="${(0.7 * o).toFixed(2)}"/>`;
// the strobe picture: ball (left) and apple (right) at equal time steps, each pair joined by a level line; the gaps grow
function strobe(t, t0, { n = 5, x1 = 330, x2 = 750, top = 290, bot = 830, every = 0.15, r1 = 80, r2 = 34 } = {}) {
  let s = "";
  for (let k = 0; k < n; k++) { const o = fade(t, t0 + k * every, 0.1), y = top + (bot - top) * (k / (n - 1)) ** 2, last = k === n - 1;
    if (o <= 0) continue; const g = last ? 1 : 0.6;
    s += dashed(x1 + r1 + 14, x2 - r2 - 14, y, o) + ballB(x1, y, r1, o * g) + appleB(x2, y, r2, o * g); }
  return s;
}
// ---- report A
function bStrobe(t, env) {                                    // "I ran an experiment. By accident. Right above an agent."
  const b = env.beats, ag = fade(t, b.agent);
  const shoes = ag > 0 ? `<g opacity="${ag}"><path d="M470 885 h70 q14 0 14 14 v6 h-96 v-8 q0 -12 12 -12 Z M560 885 h70 q14 0 14 14 v6 h-96 v-8 q0 -12 12 -12 Z" fill="#05060f"/><rect x="480" y="730" width="40" height="157" fill="#05060f"/><rect x="580" y="730" width="40" height="157" fill="#05060f"/></g>`
    + X.label(540, 680, "!", 160, "#ff4f6d", ag, easeOutBack(seg(t, b.agent, b.agent + 0.3))) : "";
  const crack = ag > 0 ? `<path d="M330 906 l-70 10 M330 906 l60 14 M330 906 l-14 20" stroke="#05060f" stroke-width="5" opacity="${ag}"/>` : "";
  return A(t, env, b.ran - 0.12, ground(905) + strobe(t, b.ran - 0.05, { bot: 820 }) + shoes + crack, TALK, "point", pulse(t, b.ran, b.agent, 0.2));
}
function bReport1(t, env) {                                   // "Remember report one: the heavier the thing, the harder the pull."
  const b = env.beats, d = easeOutBack(seg(t, b.remember - 0.05, b.remember + 0.35)), st = fade(t, b.ball40 - 0.9);
  const pic = `<g transform="translate(540 ${lerp(-200, 560, d)}) rotate(${lerp(-14, -4, d)})"><rect x="-300" y="-330" width="600" height="660" rx="10" fill="#f6f2e6"/><rect x="-260" y="-290" width="520" height="460" fill="#0b0e30"/>
    ${X.earth(0, 330, 260, t * 0.1).replace(/^/, "")}<g>${X.apple(0, -150, 46, 0)}</g>${X.arrow(0, -96, 0, 40, 13, "#ffe66d", t * 2)}</g>`;
  const clip = `<clipPath id="r1clip"><rect x="-260" y="-290" width="520" height="460"/></clipPath>`;
  return A(t, env, b.remember - 0.12, `<defs>${clip}</defs>` + pic.replace(`${X.earth(0, 330, 260, t * 0.1)}`, `<g clip-path="url(#r1clip)">${X.earth(0, 330, 260, t * 0.1)}</g>`)
    + `<g transform="translate(540 ${lerp(-200, 560, d)}) rotate(${lerp(-14, -4, d)})">${X.label(0, 270, "REPORT #1", 72, "#2a2a4a")}</g>` + NOTE(800, 330, "STILL TRUE", 64, "#5fd27a", st, 8), TALK, "point", 0);
}
function bScale(t, env) {                                     // "The ball is forty times heavier than the apple,"
  const b = env.beats, n = Math.floor(clamp((t - b.ball40 - 0.25) / 1.1) * 40), tilt = lerp(-12, 0, n / 40);
  const piv = [540, 520], arm = 330, ang = tilt * Math.PI / 180, L0 = [piv[0] - arm * Math.cos(ang), piv[1] - arm * Math.sin(ang)], R0 = [piv[0] + arm * Math.cos(ang), piv[1] + arm * Math.sin(ang)];
  const pan = ([x, y], w = 220) => `<path d="M${x} ${y} L${x - w / 2} ${y + 170} M${x} ${y} L${x + w / 2} ${y + 170}" stroke="#9aa4c8" stroke-width="4"/><path d="M${x - w / 2 - 10} ${y + 170} h${w + 20} q-10 40 -${(w + 20) / 2} 40 q-${(w + 20) / 2 - 10} 0 -${(w + 20) / 2} -40 Z" fill="#cfd6ee"/>`;
  let apples = ""; const rows = [9, 8, 7, 6, 5, 4, 1]; let k = 0;
  rows.forEach((cnt, r) => { for (let i = 0; i < cnt; i++) { if (k++ >= n) return; apples += X.apple(R0[0] - (cnt - 1) * 11 + i * 22, R0[1] + 152 - r * 19, 12, 0); } });
  return A(t, env, b.ball40 - 0.12, `<rect x="${piv[0] - 14}" y="${piv[1]}" width="28" height="380" fill="#6a7090"/><path d="M${piv[0] - 120} 905 h240 l-30 -30 h-180 Z" fill="#6a7090"/>
    <path d="M${L0[0]} ${L0[1]} L${R0[0]} ${R0[1]}" stroke="#cfd6ee" stroke-width="16" stroke-linecap="round"/><circle cx="${piv[0]}" cy="${piv[1]}" r="18" fill="#ffd23f"/>`
    + pan(L0) + pan(R0) + ballB(L0[0], L0[1] + 112, 58) + apples + X.label(R0[0], R0[1] - 30, "×40", 84, "#ffe66d", fade(t, b.ball40 + 1.0)), TALK, "point", pulse(t, b.ball40, b.pull40 - 0.2, 0.2));
}
function bPull(t, env) {                                      // "so their planet pulls on it forty times harder." (the ball's arrow is cut: forty times the apple's will not fit)
  const b = env.beats, g = ease(seg(t, b.pull40 + 0.15, b.pull40 + 0.8)), y0 = 380, ua = 70;
  const cut = (x, y) => `<rect x="${x - 40}" y="${y - 14}" width="80" height="28" fill="#0b0e30"/><path d="M${x - 34} ${y - 4} l68 -18 M${x - 34} ${y + 18} l68 -18" stroke="#ffe66d" stroke-width="7"/>`;
  return A(t, env, b.pull40 - 0.12, `<path d="M40 905 Q540 860 1040 905 L1040 945 L40 945 Z" fill="#2a8a5a"/><path d="M40 905 Q540 860 1040 905" stroke="#7fd4ff" stroke-width="6" fill="none" opacity=".5"/>`
    + ballB(300, y0, 125) + X.apple(760, y0 + 70, 52, 0)
    + (g > 0.02 ? X.arrow(300, y0 + 132, 300, y0 + 132 + 360 * g, 30, "#ffe66d", t * 2) + (g > 0.6 ? cut(300, y0 + 132 + 180) : "") : "") + X.arrow(760, y0 + 128, 760, y0 + 128 + ua, 22, "#ffe66d", 0)
    + X.label(440, y0 + 330, "×40", 88, "#ffe66d", fade(t, b.pull40 + 0.6)) + X.label(440, y0 + 400, "ARROW CUT", 56, "#ffe66d", fade(t, b.pull40 + 0.8))
    + X.label(870, y0 + 190, "×1", 76, "#ffe66d", 1), TALK, "point", pulse(t, b.pull40, b.theory - 0.2, 0.2));
}function bTheory(t, env) {                                    // "Theory: the harder pull wins. The ball lands first." "Wrong. They landed together. One bang."
  const b = env.beats, u = clamp((t - b.first - 0.05) / 0.5), back = fade(t, b.land2 - 0.2, 0.3), stamp = easeOutBack(seg(t, b.wrong, b.wrong + 0.25)), lab = fade(t, b.first + 0.5);
  const by = lerp(390, 820, u * u), ay = lerp(390, 520, u);
  const theory = `<g opacity="${1 - back}">${ballB(380, by, 82)}${appleB(760, ay, 34)}${u >= 1 ? puff(380, 905, seg(t, b.first + 0.55, b.first + 1.0), 1.2) : ""}
    ${X.label(560, 860, "FIRST", 72, "#ffe66d", lab)}${X.label(900, ay + 14, "LATER", 64, "#ffe66d", lab)}</g>`;
  return A(t, env, b.theory - 0.12, ground(905) + theory + (back > 0 ? `<g opacity="${back}">${strobe(t, b.land2 - 0.1, { every: 0.1, top: 430, bot: 820, x1: 470, x2: 820, r1: 70, r2: 30 })}${puff(470, 905, seg(t, b.bang, b.bang + 0.5), 1.2)}${puff(820, 905, seg(t, b.bang, b.bang + 0.5), 0.8)}</g>` : "")
    + NOTE(250, 290, "PEEK'S THEORY", 56, "#ff9fd0", fade(t, b.theory))
    + (stamp > 0 ? `<g transform="translate(260 380) rotate(-12) scale(${stamp})"><rect x="-170" y="-70" width="340" height="120" rx="12" fill="none" stroke="#ff4f6d" stroke-width="12"/>${X.label(0, 30, "WRONG", 96, "#ff4f6d")}</g>` : ""), TALK, "point", pulse(t, b.theory, b.wrong - 0.2, 0.2));
}function bBecause(t, env) {                                   // "Because the ball..."
  const b = env.beats, p = popIn(t, b.because - 0.05, 0.3);
  return A(t, env, b.because - 0.12, `<g transform="translate(470 420) scale(${p})"><circle r="176" fill="#cfd6ff"/>${ST.ball(0, 0, 170, t * 10)}</g>` + X.arrow(470, 610, 470, 900, 30, "#ffe66d", t * 2, p)
    + X.label(820, 470, "?", 220, "#ffe66d", fade(t, b.because + 0.2), easeOutBack(seg(t, b.because + 0.2, b.because + 0.5))), TALK, "point", 0);
}

// ============================================================ THE INTERRUPTION
const speaker = (x, y) => `<rect x="${x - 70}" y="${y - 16}" width="140" height="22" fill="#2a2d52"/><circle cx="${x}" cy="${y + 46}" r="50" fill="#d8dcf0"/><circle cx="${x}" cy="${y + 46}" r="36" fill="#2a2d52"/>
  ${[0, 1, 2].map((i) => `<circle cx="${x}" cy="${y + 46}" r="${12 + i * 8}" fill="none" stroke="#4a4e7a" stroke-width="3"/>`).join("")}`;
function iChime(t, env) {                                     // is - att: the chime; Peek stops mid-word and looks up at the ceiling speaker
  const b = env.beats, c = fx.camera(t, [[env.is, PEEK_DX + 60, DECK - 300, 2.1, 0], [b.att, PEEK_DX + 60, DECK - 320, 2.15, 0]]);
  const lookUp = ease(seg(t, b.chime + 0.1, b.chime + 0.4));
  const e = ants({ ...F("surprised", { look: 0.4, lookY: lerp(0, -1, lookUp), eyeScale: 1.2 }), m: { ...MOUTHS.o, w: 0.5, jaw: 0.4, tongue: 0 } }, 26, 26);
  const pk = peek(e, { filter: pkLight(), shadow: false, nod: -0.3 * lookUp }, PEEK_DX, DECK, 0.3);
  const rings = [0, 1, 2].map((i) => { const u = ((t - b.chime) * 1.6 + i / 3) % 1; return t < b.chime ? "" : `<circle cx="${PEEK_DX - 120}" cy="${DECK - 594}" r="${40 + u * 120}" fill="none" stroke="#ffe66d" stroke-width="4" opacity="${(0.6 * (1 - u)).toFixed(2)}"/>`; }).join("");
  return [fx.layer(aisle(t, { cracked: 1, plankOut: 0, items: false, peekSvg: ST.box(RACK_X + 520, DECK, 300, 330, "PILLOWS") + pk + speaker(PEEK_DX - 120, DECK - 640) + rings }), c, 1), ...storeGrade(t), caps(env, t, OUT)];
}
const PLUSH_K = 0.42;
function iDesk(t, env) {                                      // att - tvw: Crowe at the customer-service microphone, the plush under his arm; "Attention, shoppers." "Have you seen... this?"
  const b = env.beats, lift = ease(seg(t, b.hys - 0.35, b.hys + 0.3)), c = fx.camera(t, [[b.att - 0.2, 560, FLOOR_Y - 640, 0.95, 0], [b.tvw, 580, FLOOR_Y - 680, 1.0, 0]]);
  const o = { walk: 0, settle: 1, hand: { x: lerp(120, 170, lift), y: lerp(-560, -1180, lift) }, handL: { x: -20, y: -560 }, aim: -60 * lift, torch: 0, lean: 8 * (1 - lift), nod: lerp(10, -14, lift), led: "#46ff7a", ledO: 0.9 };
  const C = CR(420, o), [hx, hy] = C.near;
  const plush = FR.plush(hx + 10, hy + 70, PLUSH_K, "crown", { teeth: 1.35, tilt: lerp(20, -6, lift) });
  return [fx.layer(ST.desk(t) + monitors(t, b, 1) + ST.mic(800, ST.DESK_Y - 30) + ST.dome(860, 470, ALERT(t)) + C.svg + plush, c, 1), ...storeGrade(t, 0.55), caps(env, t, OUT)];
}
const ALERT = (t) => (Math.sin(t * 12) > 0 ? 1 : 0.3);
const plushFace = (i) => `<g transform="scale(0.72)">${FR.plush(0, 150, 1.0, "crown", { teeth: 1.35 })}</g>`;
// a security-camera feed inside a screen (centred at 0,0, size w x h): an aisle in grey-green, a label and a REC dot.
// pan shifts the view (the swivelling camera); hat > 0 shows the top of Peek's hat from behind over a box
function feed(i, w, h, t, { pan = 0, hat = 0, stat = 0 } = {}) {
  const id = `fd${i}_${Math.round(w)}`;
  let s = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#1c2a24"/>`;
  if (stat > 0) return s + Array.from({ length: 60 }, (_, k) => `<rect x="${(-w / 2 + fx.rnd(k * 3 + Math.floor(t * 30)) * w).toFixed(0)}" y="${(-h / 2 + fx.rnd(k * 7 + Math.floor(t * 30)) * h).toFixed(0)}" width="${(6 + fx.rnd(k) * 30).toFixed(0)}" height="3" fill="#cfe0d8" opacity=".7"/>`).join("")
    + `<text x="0" y="8" text-anchor="middle" font-family="Anton" font-size="${h * 0.14}" fill="#cfe0d8">NO SIGNAL</text>`;
  const x0 = -pan * w * 0.8;
  s += `<g clip-path="url(#${id})"><clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath>`
    + [0, 1, 2, 3].map((k) => `<rect x="${x0 + -w / 2 + k * w * 0.42}" y="${-h / 2 + h * 0.12}" width="${w * 0.3}" height="${h * 0.7}" fill="#2c4038"/>` + [0.3, 0.55].map((f) => `<rect x="${x0 + -w / 2 + k * w * 0.42}" y="${-h / 2 + h * f}" width="${w * 0.3}" height="4" fill="#4a6a5c"/>`).join("")).join("")
    + `<rect x="${-w / 2}" y="${h * 0.32}" width="${w}" height="${h * 0.18}" fill="#24362e"/>`;
  if (hat > 0) s += `<g opacity="${hat}" transform="translate(${x0 + w * 0.55} ${h * 0.12}) scale(1.6)"><rect x="-70" y="-10" width="140" height="70" fill="#3a5248"/>
    <ellipse cx="0" cy="-12" rx="62" ry="12" fill="#0d1210"/><path d="M-34 -14 C-34 -52 34 -52 34 -14 Z" fill="#141c18"/><rect x="-34" y="-24" width="68" height="10" fill="#e070b0"/><rect x="6" y="-40" width="20" height="12" fill="#cfe0d8"/>
    <path d="M-30 -40 l-18 -26 M30 -40 l18 -26" stroke="#8a5a7a" stroke-width="4"/><circle cx="-48" cy="-66" r="6" fill="#8a5a7a"/><circle cx="48" cy="-66" r="6" fill="#8a5a7a"/></g>`;
  return s + `</g><text x="${-w / 2 + 10}" y="${-h / 2 + 24}" font-family="Anton" font-size="20" fill="#cfe0d8">CAM ${String(i + 1).padStart(2, "0")}</text><circle cx="${w / 2 - 18}" cy="${-h / 2 + 18}" r="7" fill="#ff3b3b" opacity="${Math.sin(t * 8) > 0 ? 1 : 0.3}"/>`;
}
function iTV(t, env) {                                        // tvw - pillow: the TV wall fills with the plush's face; then the security feeds; one camera swivels and finds the top of Peek's hat
  const b = env.beats, on = Array.from({ length: 9 }, (_, i) => fade(t, b.tvw + 0.04 + i * 0.04, 0.04)), feeds = t >= b.feeds;
  const flick = Array.from({ length: 9 }, (_, i) => t >= b.feeds + i * 0.05);
  const pan = ease(seg(t, b.feeds + 0.05, b.hat)), hat = fade(t, b.hat, 0.1);
  const content = (i) => feeds && flick[i] ? feed(i, 300, 270, t, i === 4 ? { pan, hat } : { pan: 0.15 * (i % 3) }) : `<g transform="scale(0.78)">${FR.plush(0, 150, 1.0, "crown", { teeth: 1.35 })}</g>`;
  const push = ease(seg(t, b.hat - 0.1, b.pillow)), c = { x: lerp(540, 540, push), y: lerp(960, 820, push), z: lerp(1, 1.9, push), rot: 0 };
  const wall = `<rect width="${W}" height="${H}" fill="#0b0c22"/><rect x="0" y="200" width="${W}" height="110" fill="#1c2050"/>` + X.label(540, 280, "ELECTRONICS", 76, "#9fd0ff")
    + ST.tvWall(66, 420, 3, 3, 300, 270, content, feeds ? Array(9).fill(1) : on);
  return [fx.layer(wall, c, 1), fx.glow(540, 960, 600, feeds ? "#9fe6c0" : "#ff9fd0", 0.1), ...storeGrade(t, 0.5)];
}
const secCam = (x, y, led = 1, turn = 0) => `<rect x="${x - 6}" y="${y - 60}" width="12" height="60" fill="#3a3e64"/><g transform="rotate(${turn} ${x} ${y})"><rect x="${x - 70}" y="${y - 22}" width="90" height="44" rx="8" fill="#d8dcf0"/><circle cx="${x - 70}" cy="${y}" r="16" fill="#1a1a2a"/><circle cx="${x - 70}" cy="${y}" r="8" fill="#3a5ab8"/><circle cx="${x + 8}" cy="${y - 10}" r="6" fill="#ff3b3b" opacity="${led}"/></g>`;
function iPillow(t, env) {                                    // pillow - turn: Peek's own shot: the camera's red light is on him; he slaps a pillow over the lens
  const b = env.beats, c = fx.camera(t, [[b.pillow, PEEK_DX + 120, DECK - 200, 2.1, 0], [b.turn, PEEK_DX + 130, DECK - 200, 2.15, 0]]);
  const grab = ease(seg(t, b.pillow + 0.1, b.static - 0.05)), slap = t >= b.static - 0.05;
  const camX = PEEK_DX + 330, camY = DECK - 300;
  const e = ants({ ...F("worried", { lid: 0, eyeScale: 1.3, pupil: 0.5, look: 0.9, lookY: -0.5, browTilt: 1, sweat: 1 }), m: { ...MOUTHS.o, w: 0.45, jaw: 0.6, tongue: 0 } }, -30, -30);
  const pk = peek(e, { filter: pkLight(), shadow: false, turn: 0.4, armR: { x: lerp(800, 1000, grab), y: lerp(700, 300, grab), front: true }, armL: { x: lerp(400, 820, grab), y: lerp(700, 320, grab), front: true } }, PEEK_DX + 60, DECK, 0.3);
  const px = lerp(RACK_X + 700, camX - 50, grab), py = lerp(DECK - 380, camY, grab);
  const pillow = `<g transform="translate(${px} ${py}) rotate(${lerp(0, -12, grab)})"><rect x="-80" y="-48" width="160" height="96" rx="40" fill="#f0e6ff" stroke="#b8a8d8" stroke-width="4"/></g>`;
  return [fx.layer(aisle(t, { cracked: 1, plankOut: 0, items: false, peekSvg: ST.box(RACK_X + 560, DECK, 300, 330, "PILLOWS") + secCam(camX, camY, slap ? 0 : (Math.sin(t * 16) > 0 ? 1 : 0.4), -20) + pk + pillow }), c, 1),
    fx.flash(pulse(t, b.static - 0.05, b.static + 0.05, 0.02) * 0.15, "#fff"), ...storeGrade(t), caps(env, t, OUT)];
}
function iTurn(t, env) {                                      // turn - bs - 0.6: the desk: Crowe turns to the security monitors and takes one step toward them; one shows static
  const b = env.beats, Wk = walkOf(t, b.turn + 0.1, b.turn + 0.65, 420, 420 + 180 * CK), look = ease(seg(t, b.turn, b.turn + 0.3));
  const o = { walk: Wk.walk, settle: Wk.settle, hand: swingHand(Wk, HOLD, Wk.arrive), handL: { x: -20, y: -560 }, aim: 0, torch: 0, lean: Wk.lean, nod: lerp(6, -16, look) + 4 * Wk.nodSettle, glint: 1, led: "#46ff7a", ledO: 0.9 };
  const C = CR(Wk.x, o), [hx, hy] = C.near;
  const c = fx.camera(t, [[b.turn, 560, FLOOR_Y - 680, 1.0, 0], [env.bs, 600, FLOOR_Y - 700, 1.08, 0]]);
  return [fx.layer(ST.desk(t) + monitors(t, b, 1) + ST.mic(800, ST.DESK_Y - 30) + ST.dome(860, 470, ALERT(t)) + C.svg + FR.plush(hx + 8, hy + 60, 0.36, "crown", { teeth: 1.35, tilt: 16 }), c, 1), ...storeGrade(t, 0.55)];
}
// the bank of security monitors on the wall behind the desk (the desk set's three panels); `live` 1 shows the feeds, the middle one goes to static
const monitors = (t, b, live = 1) => live <= 0 ? "" : `<rect x="150" y="${ST.DESK_Y - 820}" width="780" height="236" rx="10" fill="#0e0f22"/>` + [0, 1, 2].map((i) => `<g transform="translate(${285 + i * 255} ${ST.DESK_Y - 702})">${feed(10 + i, 230, 200, t, i === 1 && t >= b.static ? { stat: 1 } : { pan: 0.2 * i })}</g>`).join("");function iPeek(t, env) {                                      // bs - 1.0 - bs: close on Peek crouched behind the box, hat low, a hand over his teeth
  const b = env.beats, c = fx.camera(t, [[env.bs - 0.6, PEEK_DX + 40, DECK - 90, 2.6, 0], [env.bs, PEEK_DX + 40, DECK - 90, 2.66, 0]]);
  const e = ants(speak({ ...F("worried", { lid: 0.2, look: 0.7, lookY: 0.2, browTilt: 1, sweat: 1 }), lid: Math.max(0.2, blink(t, [env.bs - 0.4])) }, env, t), -30, -30);
  const pk = peek(e, { filter: pkLight(), shadow: false, hatLift: 34, armL: { x: 540, y: 610, front: true } }, PEEK_DX, DECK + 20, 0.3);
  return [fx.layer(aisle(t, { cracked: 1, plankOut: 0, items: false, peekSvg: pk + ST.box(PEEK_DX - 170, DECK, 340, 90, "") + ST.box(RACK_X + 900, DECK, 260, 280, "DUVETS") }), c, 1), ...storeGrade(t, 0.65), caps(env, t, OUT)];
}

// ============================================================ REPORT B (Peek crouched behind a box under the board)
function bKick(t, env) {                                      // "...is also forty times harder to get moving."
  const b = env.beats, k1 = b.harder + 0.6, k2 = b.harder + 1.5;
  const fly = clamp((t - k1) / 0.6), roll = ease(seg(t, k2, k2 + 0.8));
  const leg = (at) => pulse(t, at - 0.15, at + 0.2, 0.08);
  const ouch = seg(t, k2 + 0.1, k2 + 0.3);
  const e1 = F("grin", { lid: 0.2 }), e2 = ouch > 0 ? F("worried", { lid: 0.3, sweat: 0.8, m: { ...MOUTHS.o, w: 0.5, jaw: 0.6, tongue: 0 } }) : F("grin", { lid: 0.2 });
  return B(t, env, b.harder - 0.12, `<path d="M540 230 V900" stroke="#7fd4ff" stroke-width="3" opacity=".4"/>` + ground(905) + `<g transform="translate(540 905) scale(1.3) translate(-540 -905)">`
    + tinyPeek(265, 905, e1, { id: "k1", legR: leg(k1) > 0 ? { x: 60 * leg(k1), y: -40 * leg(k1), rot: -40 * leg(k1) } : null }, 0.24) + X.apple(370 + fly * 140, 880 - Math.sin(Math.PI * fly) * 240, 26, fly * 400)
    + tinyPeek(640, 905, e2, { id: "k2", legR: leg(k2) > 0 ? { x: 60 * leg(k2), y: -40 * leg(k2), rot: -40 * leg(k2) } : null, armL: ouch > 0 ? { x: 520, y: 980, front: true } : null }, 0.24) + ballB(775 + roll * 22, 845, 60) + `</g>`
    + X.label(540, 320, "SAME KICK", 72, "#ffe66d", fade(t, b.harder + 0.3)));
}
const cart = (x, y, full = false, t = 0) => `<g transform="translate(${x} ${y})"><path d="M-130 -150 L130 -150 L104 -30 L-104 -30 Z" fill="none" stroke="#cfd6ee" stroke-width="8" stroke-linejoin="round"/>
  ${[-80, -40, 0, 40, 80].map((k) => `<path d="M${k} -150 L${k * 0.8} -30" stroke="#9aa4c8" stroke-width="4"/>`).join("")}<path d="M-126 -110 H124 M-118 -70 H116" stroke="#9aa4c8" stroke-width="4"/>
  <path d="M-130 -150 L-180 -190 L-206 -190" stroke="#cfd6ee" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-104 -30 L-110 0 M104 -30 L110 0" stroke="#cfd6ee" stroke-width="6"/>
  <circle cx="-100" cy="10" r="16" fill="#2a2d52" stroke="#9aa4c8" stroke-width="5"/><circle cx="100" cy="10" r="16" fill="#2a2d52" stroke="#9aa4c8" stroke-width="5"/>
  ${full ? [[-80, -66], [-26, -66], [28, -66], [82, -66], [-54, -112], [0, -112], [54, -112], [-26, -158], [28, -158]].map(([bx, by]) => ballB(bx, by, 30)).join("") : ""}</g>`;
function bCarts(t, env) {                                     // "Same push on two shopping carts: the empty one rolls away, the full one barely moves."
  const b = env.beats, push = (at) => pulse(t, at - 0.25, at + 0.1, 0.08);
  const e1 = Math.max(0, t - b.empty - 0.05), x1 = 330 + 0.5 * 2600 * Math.min(e1, 0.35) ** 2 + (e1 > 0.35 ? 2600 * 0.35 * (e1 - 0.35) : 0);
  const x2 = 330 + 22 * ease(seg(t, b.full, b.full + 0.8));
  const arrow = (x, y, o) => X.arrow(x - 300, y - 170, x - 210, y - 170, 18, "#ff7ab8", t * 2, o);
  return B(t, env, b.carts - 0.12, ground(905) + `<path d="M40 480 H1040" stroke="#3a4490" stroke-width="6"/>` + cart(x1, 470, false, t) + cart(x2, 895, true, t)
    + arrow(330, 470, fade(t, b.carts + 0.2) * (1 - fade(t, b.empty + 0.2))) + arrow(330, 895, fade(t, b.carts + 0.2) * (1 - fade(t, b.full + 0.5))));
}
function bBits(t, env) {                                      // "More pull, but more stuff to move. It evens out."
  const b = env.beats, bits = fade(t, b.evens - 0.5, 0.4), each = fade(t, b.evens);
  const cx = 350, cy = 480, R = 170;
  let pieces = ""; const pts = [];
  for (let r = -3; r <= 3; r++) for (let c = -3; c <= 3; c++) { const x = c * 46 + (r % 2 ? 23 : 0), y = r * 42; if (Math.hypot(x, y) < 150 && pts.length < 40) pts.push([x, y]); }
  while (pts.length < 40) pts.push([0, 0]);
  pts.forEach(([x, y]) => { pieces += `<circle cx="${cx + x}" cy="${cy + y}" r="20" fill="#e5333f" stroke="#7a0f1c" stroke-width="3"/>` + (each > 0 ? X.arrow(cx + x, cy + y + 18, cx + x, cy + y + 58, 7, "#ffe66d", 0, each) : ""); });
  const whole = `<g opacity="${1 - bits}">${ballB(cx, cy, R)}</g>`;
  const big = `<g opacity="${(1 - bits) * fade(t, b.stuff)}">${X.arrow(cx, cy + R + 10, cx, 820, 26, "#ffe66d", t * 2)}<path d="M${cx - 30} 830 l60 -20 M${cx - 30} 850 l60 -20" stroke="#ffe66d" stroke-width="8"/>${X.label(cx + 120, 790, "×40", 76, "#ffe66d")}</g>`;
  return B(t, env, b.stuff - 0.12, whole + big + `<g opacity="${bits}">${pieces}</g>` + X.apple(800, cy, 20, 0) + X.arrow(800, cy + 18, 800, cy + 58, 7, "#ffe66d", 0)
    + X.label(540, 900, "EACH BIT: SAME PULL", 64, "#ffe66d", each));
}
function bSpeed(t, env) {                                     // "Everything speeds up the same: twenty-two miles an hour faster, every second."
  const b = env.beats, top = 280, bot = 860, x1 = 360, x2 = 720;
  let s = ground(905);
  [0, 1, 2].forEach((k) => { const o = fade(t, b.speeds + 0.2 + k * 0.7, 0.15), y = top + (bot - top) * (k / 2) ** 2; if (o <= 0) return; const g = k === 2 ? 1 : 0.5;
    s += dashed(x1 + 70, x2 - 40, y, o) + ballB(x1, y, 56, o * g) + appleB(x2, y, 24, o * g)
      + X.label(x1 - 175, y + 24, `${k * 35} km/h`, 66, "#ffe66d", o) + X.label(x2 + 165, y + 24, `${k * 35} km/h`, 66, "#ffe66d", o); });
  const pa = fade(t, b.speeds + 1.6), yl = top;                // the pulls on the last pair, at one scale (the ball's is broken: 40 times too long to draw)
  s += pa > 0 ? `<g opacity="${pa}">${X.arrow(x1, yl + 62, x1, yl + 150, 16, "#ffe66d", t * 2)}<path d="M${x1 - 26} ${yl + 108} l52 -16 M${x1 - 26} ${yl + 124} l52 -16" stroke="#ffe66d" stroke-width="6"/>${X.arrow(x2, yl + 28, x2, yl + 40, 8, "#ffe66d", 0)}</g>` : "";
  return B(t, env, b.speeds - 0.12, s);
}
function bAir(t, env) {                                       // "Except a feather. Air pushes back on everything, but on light, wide things, it wins."
  const b = env.beats, u = t - b.feather;
  const fy = 300 + u * 70, fx_ = 640 + Math.sin(u * 2.2) * 70, rot = Math.sin(u * 2.2 + 0.5) * 35;
  const by = Math.min(860, 300 + 0.5 * 900 * Math.max(0, u - 0.2) ** 2);
  const air = fade(t, b.air);
  const dots = Array.from({ length: 60 }, (_, i) => `<circle cx="${60 + fx.rnd(i * 3) * 960}" cy="${220 + fx.rnd(i * 7) * 680}" r="4" fill="#9fd0ff" opacity=".35"/>`).join("");
  return B(t, env, b.feather - 0.12, dots + ground(905) + ballB(330, by, 56) + X.arrow(330, by + 62, 330, by + 200 > 900 ? by + 62 : by + 200, 16, "#ffe66d", t * 2, by < 840 ? 1 : 0)
    + `<g transform="translate(${fx_} ${fy}) rotate(${rot})">${ST.feather(0, 0, 1.6, 0)}</g>`
    + X.arrow(fx_ + 110, fy - 20, fx_ + 110, fy + 90, 14, "#ffe66d", t * 2) + X.arrow(fx_ + 150, fy + 100, fx_ + 150, fy - 10, 14, "#ff7ab8", t * 2, air)
    + X.label(fx_ + 225, fy + 70, "AIR", 72, "#ff7ab8", air));
}
function bMoon(t, env) {                                      // "On their Moon there is almost no air."
  const b = env.beats, gone = ease(seg(t, b.moon + 0.1, b.moon + 0.8));
  const dots = Array.from({ length: 60 }, (_, i) => { const x = 60 + fx.rnd(i * 3) * 960 + gone * (300 + fx.rnd(i * 5) * 600), y = 220 + fx.rnd(i * 7) * 680 - gone * 200; return `<circle cx="${x}" cy="${y}" r="4" fill="#9fd0ff" opacity="${(0.35 * (1 - gone)).toFixed(2)}"/>`; }).join("");
  return B(t, env, b.moon - 0.12, moonScene(t) + dots);
}
const moonScene = (t) => `<rect x="40" y="190" width="1000" height="820" fill="#05060f"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${60 + fx.rnd(i * 13) * 960}" cy="${210 + fx.rnd(i * 17) * 500}" r="${1.5 + fx.rnd(i) * 2}" fill="#fff" opacity=".7"/>`).join("")}
  ${X.earth(860, 330, 80, t * 0.1)}<path d="M40 880 Q300 850 540 870 Q800 890 1040 860 L1040 1010 L40 1010 Z" fill="#9a9aa8"/><ellipse cx="260" cy="935" rx="70" ry="14" fill="#7a7a88"/><ellipse cx="820" cy="950" rx="90" ry="16" fill="#7a7a88"/>`;
function standingAstronaut(x, y, k = 1) {                    // feet at (x, y); arms out at shoulder height, hands at (x -/+ 200k, y - 470k)
  return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-40 -60 L-50 0 L-12 0 L-6 -60 Z M40 -60 L50 0 L12 0 L6 -60 Z" fill="#eef1f8"/><rect x="-62" y="-12" width="54" height="16" rx="6" fill="#8a93b0"/><rect x="8" y="-12" width="54" height="16" rx="6" fill="#8a93b0"/>
    <rect x="-80" y="-330" width="160" height="200" rx="26" fill="#b9c0d6"/><rect x="-62" y="-320" width="124" height="270" rx="40" fill="#f4f6fb"/>
    <path d="M-56 -300 L-200 -380 M56 -300 L200 -380" stroke="#eef1f8" stroke-width="40" stroke-linecap="round"/><circle cx="-200" cy="-380" r="22" fill="#c9cfe0"/><circle cx="200" cy="-380" r="22" fill="#c9cfe0"/>
    <circle cx="0" cy="-400" r="78" fill="#eef1f8"/><ellipse cx="6" cy="-400" rx="56" ry="46" fill="#3a2a10"/><ellipse cx="-12" cy="-418" rx="20" ry="12" fill="#ffd27a" opacity=".5"/>
    <rect x="-28" y="-250" width="56" height="34" rx="6" fill="#c9cfe0"/><circle cx="-12" cy="-233" r="6" fill="#ff5a5a"/><circle cx="8" cy="-233" r="6" fill="#57c8ff"/></g>`;
}
const hammer = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-6" y="-10" width="12" height="90" rx="4" fill="#8a6a4a"/><rect x="-34" y="-28" width="68" height="26" rx="6" fill="#b9c0d6"/></g>`;
function bHammer(t, env) {                                    // "An astronaut dropped a hammer and a feather there. They landed together."
  const hand = 905 - 380 * 0.93, drop = 905 - hand - 30, g = 1.62 * drop / 1.6;           // the drop from his hands is 1.6 m; the Moon's 1.62 m/s², real time
  const b = env.beats, d0 = b.astro + 1.2, u = Math.max(0, t - d0), h = 0.5 * g * u * u, landT = Math.sqrt(2 * drop / g), landed = u >= landT;
  const y = Math.min(drop, h), hy = hand + 22 + y;
  const dust = landed ? [[340, 0], [740, 1]].map(([x, i]) => { const v = seg(t, d0 + landT, d0 + landT + 0.8); return `<ellipse cx="${x}" cy="900" rx="${20 + v * 70}" ry="${8 + v * 20}" fill="#c8c8d4" opacity="${(0.6 * (1 - v)).toFixed(2)}"/>`; }).join("") : "";
  return B(t, env, b.astro - 0.12, moonScene(t) + standingAstronaut(540, 905, 0.93) + hammer(354, Math.min(hy, 870), 1.1) + `<g transform="translate(726 ${Math.min(hy + 10, 880)})">${ST.feather(0, 0, 0.9, 80)}</g>`
    + dashed(400, 690, Math.min(hy, 880), u > 0 && !landed ? 1 : 0) + dust + X.label(540, 290, "APOLLO 15", 72, "#fff", fade(t, b.astro + 0.3)));
}
function bSum(t, env) {                                       // "So: heavier means more pull, but also harder to move. Only air gets in the way."
  const b = env.beats, row = (y, at, inner, text, col = "#fff") => { const a = popIn(t, at, 0.3); return a <= 0 ? "" : `<g transform="translate(540 ${y}) scale(${a}) translate(-540 ${-y})"><rect x="80" y="${y - 108}" width="920" height="216" rx="40" fill="#1c2250" stroke="#7fd4ff" stroke-width="5" opacity=".95"/>${inner}${X.label(650, y + 24, text, 64, col)}</g>`; };
  return B(t, env, b.sum1 - 0.15, row(320, b.sum1 + 0.2, ST.ball(200, 300, 40, 0) + X.arrow(200, 344, 200, 410, 12, "#ffe66d", t), "×40 PULL")
    + row(580, b.sum2 + 0.2, ST.ball(200, 580, 46, 0) + X.label(200, 600, "40", 40, "#fff"), "×40 STUFF")
    + row(840, b.sum3 + 0.1, `${ST.ball(170, 840, 30, 0)}${X.apple(240, 840, 16, 0)}<g opacity=".45">${ST.feather(300, 840, 0.7, 60)}</g>`, "SAME FALL (AIR ASIDE)", "#ffe66d"));
}
function bQuestion(t, env) {                                  // "Which raises a question, Commander. Up there, astronauts bounce like bunnies. So why do you weigh less on the Moon?"
  const b = env.beats, mv = ease(seg(t, b.bunny, b.bunny + 0.4)), hopU = Math.max(0, t - b.bunny - 0.3), ph = (hopU / 1.3) % 1, hx = 200 + Math.min(1, hopU / 3.6) * 560;
  const hop = hopU > 0 ? Math.sin(Math.PI * ph) * 260 : 0, scale = fade(t, b.weigh);
  return B(t, env, b.question - 0.15, `<g opacity="${mv}">${moonScene(t)}<g transform="translate(${hx} ${860 - hop}) scale(0.9)">${M.astronaut(0, 0, 1.4)}</g></g>`
    + X.label(540, lerp(700, 430, mv), "?", 200, "#ffe66d", fade(t, b.question), easeOutBack(seg(t, b.question, b.question + 0.35)) * lerp(2.2, 1, mv))
    + (scale > 0 ? `<g opacity="${scale}" transform="translate(860 760)"><rect x="-90" y="-30" width="180" height="60" rx="16" fill="#e8eaf6"/><rect x="-40" y="-20" width="80" height="26" rx="6" fill="#2a2d52"/>${X.label(0, 2, "?", 26, "#ffe66d")}</g>` : ""));
}
function rExit(t, env) {                                      // "Investigating. Peek out." he tips his hat and jumps off the rack into the pillow display; the feathers drift down slowly
  const b = env.beats, tip = pulse(t, b.peekout - 0.1, b.peekout + 0.45, 0.15), j0 = b.peekout + 0.5, u = Math.max(0, t - j0), fallT = Math.sqrt(2 * (FLOOR_Y - 200 - DECK) / G);
  const landed = u >= fallT, py = landed ? FLOOR_Y - 150 : DECK + (u > 0 ? -Math.sin(Math.min(1, u * 3) * Math.PI / 2) * 60 * (1 - u / fallT) + 0.5 * G * u * u : 0), px = PEEK_DX + (u > 0 ? -Math.min(u / fallT, 1) * 420 : 0);
  const c = t < j0 ? fx.camera(t, [[b.out - 0.12, PEEK_DX, DECK - 170, 2.0, 0], [j0, PEEK_DX, DECK - 170, 2.0, 0]])
    : { x: lerp(PEEK_DX - 120, PEEK_DX - 400, ease(clamp(u / fallT))), y: Math.min(Math.max(py - 150, DECK), FLOOR_Y - 420), z: 1.25, rot: 0 };   // follows him down, then holds on the pillows
  const e = ants(speak({ ...F("sly", { look: -0.4 }), lid: Math.max(0.4, blinks(t, 2.5)) }, env, t), 6, 6);
  const pk = landed ? "" : peek(e, { filter: pkLight(), shadow: false, turn: u > 0 ? -0.8 : 0, armR: tip > 0.02 ? { x: lerp(820, 800, tip), y: lerp(700, 300, tip), front: true } : { x: 820, y: 700 }, hatRot: -6 * tip, legL: u > 0 ? { y: -40, rot: -20 } : null, legR: u > 0 ? { y: -40, rot: 20 } : null }, px, py, 0.3);
  const squash = landed ? Math.exp(-(u - fallT) * 5) : 0;
  return [fx.layer(aisle(t, { cracked: 1, plankOut: 0, ballY: FLOOR_Y - BALL_R, appleY: FLOOR_Y - APPLE_R, appleX: APPLE_X + 18, attached: false, peekSvg: ST.box(RACK_X + 520, DECK, 300, 330, "PILLOWS") + pk,
    front: ST.pillows(PEEK_DX - 420, FLOOR_Y, squash) + (landed ? ST.feathers(t, j0 + fallT, PEEK_DX - 420, FLOOR_Y - 160, 26, 560, 1.4) : "") }), c, 1), ...storeGrade(t), caps(env, t, OUT)];
}

// ============================================================ TAG: the detector plays "...Peek out." back; "...Peek."
function tag(t, env) {
  const b = env.beats, nb = b.next, q = seg(t, nb, nb + 0.2);
  fx.def("tagfade", `<linearGradient id="tagfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02030c" stop-opacity="0"/><stop offset=".25" stop-color="#02030c" stop-opacity=".88"/><stop offset=".85" stop-color="#02030c" stop-opacity=".88"/><stop offset="1" stop-color="#02030c" stop-opacity="0"/></linearGradient>`);
  const wrist = ease(seg(t, env.ts + 0.1, b.po - 0.05)) * (1 - ease(seg(t, b.po_end + 0.2, b.po_end + 0.6))), lift = ease(seg(t, b.cpeek - 0.5, b.cpeek + 0.1));
  const o = { walk: 0, settle: 1, hand: { x: lerp(110, 120, lift), y: lerp(-560, -760, lift) }, handL: { x: lerp(-20, 120, wrist), y: lerp(-560, -900, wrist) }, handLFront: true, aim: -40, torch: 0,
    nod: lerp(16, 6, lift), led: "#46ff7a", ledO: 0.9, glint: 0.6 + 0.4 * lift };
  const C = CR(470, o), [hx, hy] = C.near, [dx, dy] = C.far, playing = t >= b.po && t <= b.po_end + 0.1;
  const lvl = env.radio ? clamp((env.radio[Math.round(t * env.fps)] || 0) * 1.3) : 0;
  const det = `<g transform="translate(${dx} ${dy - 10})"><rect x="-70" y="-46" width="140" height="92" rx="16" fill="#0b0d1e" stroke="#46ff7a" stroke-width="5"/>
    ${Array.from({ length: 9 }, (_, i) => { const h = playing ? 8 + lvl * 60 * (0.4 + 0.6 * Math.abs(Math.sin(t * 30 + i * 1.7))) : 4; return `<rect x="${-56 + i * 13}" y="${-h / 2}" width="8" height="${h}" rx="3" fill="#46ff7a"/>`; }).join("")}</g>`
    + fx.glow(dx, dy - 10, 120, "#46ff7a", playing ? 0.45 : 0.15);
  const detShow = wrist > 0.3 ? det : "";
  const faceX = 470 + 100, faceBase = FLOOR_Y - 850 * CK + 300 * PLUSH_K * 0.55;           // the plush's face level with his, just in front of it
  const plush = FR.plush(lerp(hx + 10, faceX, lift), lerp(hy + 70, faceBase, lift), PLUSH_K, "crown", { teeth: 1.35, tilt: lerp(20, 0, lift) });
  const c = fx.camera(t, [[env.ts, 520, FLOOR_Y - 690, 1.25, 0], [b.po, 520, FLOOR_Y - 700, 1.27, 0], [b.tagline_end, 520, FLOOR_Y - 710, 1.32, 0]]);
  const shot = [fx.layer(ST.desk(t) + ST.mic(800, ST.DESK_Y - 30) + ST.dome(860, 470, ALERT(t)) + C.svg + plush + detShow, c, 1), ...storeGrade(t, 0.6)];
  return [...shot, q > 0 ? "" : caps(env, t, OUT), `<rect x="0" y="930" width="${W}" height="560" fill="url(#tagfade)" opacity="${q}"/>`,
    X.label(540, 1040, "NEXT REPORT", 62, "#7fd4ff", q), X.label(540, 1150, "WHY DO YOU WEIGH", 90, "#fff", q, lerp(1.2, 1, easeOut(seg(t, nb, nb + 0.3)))),
    X.label(540, 1290, "LESS ON THE MOON?", 104, "#ffe66d", seg(t, nb + 0.2, nb + 0.4), lerp(1.2, 1, easeOut(seg(t, nb + 0.2, nb + 0.5)))),
    fx.flash(seg(t, env.end - 0.12, env.end) ** 2, "#000")];
}

export function draw(t, env) {
  if (!env) return fx.frame(() => `<text x="40" y="100" fill="#fff" font-size="40">run audio/ep04_sound.py first (out/ep04.json)</text>`);
  const b = env.beats;
  let f;
  if (t < env.rs) f = t < 1.0 ? coClose : t < b.heavyw - 0.1 ? coHigh : t < b.yank + 0.15 ? coSide : t < b.land + 0.6 ? coFall : t < b.ohno - 0.35 ? coLook : coOhno;
  else if (t < env.is) f = t < b.ran - 0.12 ? rReveal : t < b.remember - 0.12 ? bStrobe : t < b.ball40 - 0.12 ? bReport1 : t < b.pull40 - 0.12 ? bScale : t < b.theory - 0.12 ? bPull : t < b.because - 0.12 ? bTheory : bBecause;
  else if (t < env.bs) f = t < b.att - 0.15 ? iChime : t < b.tvw ? iDesk : t < b.pillow ? iTV : t < b.turn ? iPillow : iTurn;
  else if (t < env.ts) f = t < b.carts - 0.12 ? bKick : t < b.stuff - 0.12 ? bCarts : t < b.speeds - 0.12 ? bBits : t < b.feather - 0.12 ? bSpeed : t < b.moon - 0.12 ? bAir : t < b.astro - 0.12 ? bMoon
    : t < b.sum1 - 0.15 ? bHammer : t < b.question - 0.15 ? bSum : t < b.out - 0.12 ? bQuestion : rExit;
  else f = tag;
  return fx.frame(() => f(t, env));
}
