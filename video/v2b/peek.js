// Agent Peek, exactly as the channel draws him: this file only drives the existing rig (characters/peek3d.js,
// the "pear" face) and its acting vocabulary (characters/acting.js). Nothing about the character is redrawn here.
//   host({ x, y, k, face, talk, ... })   feet at (x, y) on the stage, k = stage pixels per rig pixel
//   faceAt(t, [[time, "emote" | {..}], ...])   eased blend between emotes
import { peek3d, MOUTHS } from "../characters/peek3d.js";
import { EMOTES } from "../characters/acting.js";
import { clamp, lerp, E, blink, wob } from "./lib.js";

const BASE = { lid: 0.14, look: 0, lookY: 0, browL: 0, browR: 0, browTilt: 0, eyeScale: 1, pupil: 1, squint: 0, blush: 0, sweat: 0, ant: 0, tilt: 0 };
const NUM = ["lid", "lidR", "look", "lookY", "browL", "browR", "browTilt", "eyeScale", "pupil", "squint", "blush", "sweat", "ant", "tilt"];
const mouthOf = (m) => ({ tongue: 0, ...(typeof m === "string" ? MOUTHS[m] : m || MOUTHS.smirk) });
export function emote(v) {
  if (typeof v !== "string") return v;
  const em = EMOTES[v]; if (!em) throw new Error("no emote " + v);
  const r = { ...BASE, ...em }; r.lidR = em.lidR ?? r.lid; r.m = mouthOf(em.mouth); r.talk = { smile: 0, smirk: 0.35, ...(em.talk || {}) }; r.symbol = em.symbol || null;
  return r;
}
export function blend(a, b, u) {
  a = emote(a); b = emote(b); if (u <= 0) return a; if (u >= 1) return b;
  const r = {}; for (const k of NUM) r[k] = lerp(a[k] ?? BASE[k] ?? 0, b[k] ?? BASE[k] ?? 0, u);
  r.m = {}; for (const k of ["w", "smile", "jaw", "smirk", "tongue"]) r.m[k] = lerp(a.m[k] ?? 0, b.m[k] ?? 0, u);
  r.talk = { smile: lerp(a.talk.smile, b.talk.smile, u), smirk: lerp(a.talk.smirk, b.talk.smirk, u) };
  r.symbol = u > 0.5 ? b.symbol : a.symbol;
  return r;
}
// track: [[time, emote]]; each change eases in over `d` seconds starting at its time
export function faceAt(t, track, d = 0.24) {
  let cur = emote(track[0][1]);
  for (let i = 1; i < track.length; i++) { const [at, v, dd = d] = track[i]; if (t <= at) break; cur = blend(cur, v, E.io3(clamp((t - at) / dd))); }
  return cur;
}
export const RIG = 1200, FEET = [600, 1000];
// stage position of a point given in rig space (for props in his hands)
export const rigPt = (o, rx, ry) => [o.x + (rx - 600) * o.k * (o.flip ? -1 : 1), o.y + (ry - 1000) * o.k];

export function host(o) {
  const f = emote(o.face || "neutral"), t = o.t ?? 0, lv = clamp(o.talk ?? 0);
  const bl = o.noBlink ? 0 : blink(t, o.seed ?? 1);
  const e = { ...f, look: f.look + (o.look ?? 0), lookY: f.lookY + (o.lookY ?? 0), lid: lerp(f.lid, 1, bl), lidR: lerp(f.lidR, 1, bl),
    antL: f.ant + (o.antL ?? 0), antR: f.ant + (o.antR ?? 0), symbol: o.symbol === undefined ? null : o.symbol, symbolPop: o.symbolPop ?? 1 };
  delete e.mouth;
  if (lv > 0.05) e.m = { w: 0.78 + 0.1 * wob(t, 3, 5.3), smile: 0.16 + f.talk.smile, jaw: clamp(0.12 + lv * 0.95), smirk: f.talk.smirk, tongue: 0 };
  else e.m = f.m;
  const size = RIG * o.k;
  const svg = peek3d(e, { face: "pear", bg: false, grain: false, size, armL: o.armL || null, armR: o.armR || null, shrug: o.shrug || 0, sway: o.sway || 0, bounce: o.bounce || 0,
    squash: o.squash || 1, tilt: (o.tilt ?? 0) + f.tilt, bob: o.bob || 0, roll: false });
  return `<g transform="translate(${o.x - size / 2} ${o.y - size * (1000 / 1200)})${o.flip ? ` translate(${size} 0) scale(-1 1)` : ""}">${svg}</g>`;
}
