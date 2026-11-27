// Drives the channel's own Peek rig (characters/peek3d.js, face "pear", emotes and gestures from characters/acting.js).
// The character is not redrawn or restyled here: this file only decides, for a time t, which face he makes, where his
// hands are, when he blinks and how far his mouth opens, as a pure function of t so any frame can be drawn alone.
import { peek3d, MOUTHS } from "../characters/peek3d.js";
import { EMOTES, GESTURES } from "../characters/acting.js";
import { clamp, lerp, E, wob, rnd, n2, mix } from "./kit.js";

const POCKET = { L: { x: 419, y: 872 }, R: { x: 781, y: 872 } };
const shape = (m) => (typeof m === "string" ? MOUTHS[m] : m) || MOUTHS.smirk;
// one acting key: { emote, gesture, look, lookY, tilt, armL, armR, ... } -> flat numbers that can be blended
function flat(k) {
  const em = EMOTES[k.emote || "neutral"], g = k.gesture ? GESTURES[k.gesture] : GESTURES.pockets, m = shape(k.mouth ?? em.mouth);
  const aL = k.armL !== undefined ? k.armL : g.armL, aR = k.armR !== undefined ? k.armR : g.armR;
  return {
    browL: em.browL ?? 0, browR: em.browR ?? 0, browTilt: em.browTilt ?? 0, lid: em.lid ?? 0.14, lidR: em.lidR ?? 0, eyeScale: em.eyeScale ?? 1, pupil: em.pupil ?? 1, squint: em.squint ?? 0,
    look: k.look ?? em.look ?? 0, lookY: k.lookY ?? em.lookY ?? 0, blush: em.blush ?? 0, sweat: k.sweat ?? em.sweat ?? 0, ant: k.ant ?? em.ant ?? 0, tilt: k.tilt ?? em.tilt ?? 0,
    mw: m.w, msmile: m.smile, mjaw: m.jaw, msmirk: m.smirk, tsmile: em.talk?.smile ?? 0, tsmirk: em.talk?.smirk ?? 0.3,
    lx: (aL || POCKET.L).x, ly: (aL || POCKET.L).y, lUp: aL ? 1 : 0, rx: (aR || POCKET.R).x, ry: (aR || POCKET.R).y, rUp: aR ? 1 : 0,
    lFront: aL?.front ? 1 : 0, rFront: aR?.front ? 1 : 0, shrug: g.shrug ?? k.shrug ?? 0, bobY: k.bobY ?? 0, loud: k.loud ?? 1,
  };
}
// track: [[time, key, seconds to ease in], ...]   env(t): 0..1 voice level   blinks: [times]
export function peekAt(t, track, env, { x = 540, y = 960, s = 1, rot = 0, blinks = [], talk = true } = {}) {
  let cur = flat(track[0][1]), since = track[0][0];
  for (let i = 1; i < track.length; i++) { const [t0, k, d = 0.22] = track[i]; if (t <= t0) break; const next = flat(k); since = t0; cur = t >= t0 + d ? next : mix(cur, next, E.io3((t - t0) / d)); }
  let lid = cur.lid; for (const b of blinks) { const d = (t - b) * 30; if (d >= 0 && d < 6) lid = Math.max(lid, d < 2 ? (d + 1) / 2 : 1 - (d - 2) / 4); }
  const v = talk ? clamp(env(t) * cur.loud) : 0, sw = clamp(v * 5), chew = 0.5 + 0.5 * Math.sin(t * 27);
  const m = { w: lerp(cur.mw, 0.78 + 0.14 * chew, sw * 0.8), smile: lerp(cur.msmile, 0.14 + cur.tsmile, sw), jaw: Math.max(cur.mjaw * (1 - sw * 0.5), clamp(v * 1.15)), smirk: lerp(cur.msmirk, cur.tsmirk, sw), tongue: v > 0.5 ? 0.5 : 0 };
  const kick = wob(t, since, 3.2, 4.5, 16);                                           // the antennae spring on every change of face
  const e = { lid, lidR: cur.lidR, look: cur.look, lookY: cur.lookY, browL: cur.browL + v * 0.25, browR: cur.browR + v * 0.25, browTilt: cur.browTilt, eyeScale: cur.eyeScale, pupil: cur.pupil, squint: cur.squint,
    blush: cur.blush, sweat: cur.sweat, m, antL: cur.ant + kick + 3 * Math.sin(t * 2.1), antR: cur.ant - kick * 0.8 + 3 * Math.sin(t * 2.1 + 1.3) };
  const breathe = Math.sin(t * 2.4) * 3, nod = v * 5;
  const svg = peek3d(e, { face: "pear", paper: "pockets", size: 1200, bg: false, grain: false, roll: false, tilt: cur.tilt + wob(t, since, 2.6, 5, 3), bob: cur.bobY + breathe - nod, shrug: cur.shrug,
    armL: cur.lUp > 0.04 ? { x: cur.lx, y: cur.ly, front: cur.lFront > 0.5 } : null, armR: cur.rUp > 0.04 ? { x: cur.rx, y: cur.ry, front: cur.rFront > 0.5 } : null });
  return `<g transform="translate(${n2(x)} ${n2(y)}) rotate(${n2(rot)}) scale(${n2(s)}) translate(-600 -430)">${svg.replace("<svg ", '<svg overflow="visible" ')}</g>`;
}
