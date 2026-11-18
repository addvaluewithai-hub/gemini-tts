// Acting and staging helpers shared by the shots: faces from the emote table, blends, speech, Peek placed in a
// world, the night lighting, the rooftop layers and the film finish.
import { peek3d, MOUTHS } from "./peek.js";
import { EMOTES } from "./acting.js";
import * as fx from "./fx.js";
import * as N from "../sets/night.js";
const { lerp, clamp, pulse } = fx;

export const K = 0.7, PY = N.FLOOR + 40;
const M = (m) => (typeof m === "string" ? MOUTHS[m] : m);
export const F = (name, extra = {}) => { const e = EMOTES[name]; return { browL: 0, browR: 0, browTilt: 0, lid: 0.14, squint: 0, eyeScale: 1, pupil: 1, look: 0, lookY: 0, blush: 0, sweat: 0, ant: 0, ...e, m: { tongue: 0, ...M(e.mouth) }, symbol: undefined, mouth: undefined, ...extra }; };
export const blend = (a, b, p) => { const o = fx.mix(a, b, p); o.m = fx.mix(a.m, b.m, p); return o; };
export const ants = (e, l = 0, r = 0) => ({ ...e, antL: (e.ant || 0) + l, antR: (e.ant || 0) + r });
export const say = (e, open) => ({ ...e, m: { ...e.m, jaw: Math.max(e.m.jaw, open * 0.95), w: lerp(e.m.w, 0.78, clamp(open) * 0.6) } });
export const lv = (env, who, t) => (env && env[who] ? clamp((env[who][Math.round(t * env.fps)] || 0) * 1.25) : 0);
// real mouth shapes when the cue file has them (audio/mouths.cjs), loudness otherwise
export const speak = (e, env, t, who = "peek") => { const m = env && env.mouth && env.mouth[who] ? env.mouth[who][Math.round(t * env.fps)] : null;
  if (!m) return say(e, lv(env, who, t));
  const [p, w, smile, jaw, tongue] = m; if (p <= 0.01) return e;
  return { ...e, m: fx.mix(e.m, { w, smile: smile + (e.talk?.smile ?? 0), jaw, smirk: (e.talk?.smirk ?? 0) * 0.5, tongue }, p) }; };
export const blink = (t, at) => at.reduce((v, a) => Math.max(v, pulse(t, a, a + 0.14, 0.06)), 0);
// regular blinks, a little irregular, for long takes
export const blinks = (t, every = 2.7, seed = 1) => { const k = Math.floor(t / every), at = (k + 0.3 + 0.5 * fx.rnd(k * 7 + seed)) * every; return pulse(t, at, at + 0.14, 0.06); };
export const peek = (e, o, x, y, k = K, extra = "") => `<g transform="translate(${(x - 600 * k).toFixed(1)} ${(y - 1010 * k).toFixed(1)}) scale(${k}) ${extra}">${peek3d(e, { face: "pear", bg: false, grain: false, roll: false, ...o })}</g>`;
export const FEAR = F("worried", { lid: 0.0, eyeScale: 1.12, pupil: 0.75, sweat: 0 });
export const PANIC = F("worried", { lid: 0, eyeScale: 1.22, pupil: 0.55, browTilt: 1, m: { ...MOUTHS.o, w: 0.6, jaw: 0.5, tongue: 0 } });
export const BLISS = F("proud", { lid: 1, squint: 0.2, browL: 0.7, browR: 0.7, m: { ...MOUTHS.grin, jaw: 0, tongue: 0 }, ant: 14, blush: 0.6 });
export const DREAD = F("worried", { lid: 0, eyeScale: 1.25, pupil: 0.45, lookY: 1, browTilt: 1.2, browL: 0.9, browR: 0.9, m: { ...MOUTHS.wobble, tongue: 0 }, ant: -30 });
export const AWE = F("surprised", { lid: 0, eyeScale: 1.18, pupil: 1.15, browL: 0.8, browR: 0.8, m: { ...MOUTHS.grin, jaw: 0.35, tongue: 0 }, ant: 18, blush: 0.4 });
export const DEADPAN = F("deadpan", { look: 0, lid: 0.5 });

export const night = (id, lights = [], ambient = [0.76, 0.64, 0.98], bright = 0) => fx.litFilter(id, { ambient, lights, bright });
export const rainBack = (wt, angle, streak = 1, o = 0.26) => fx.rain(wt, { n: 170, speed: 2300, len: 70 * streak + 3, o, seed: 2, width: 1.8, angle });
export const finish = (t, wt, { angle = 8, streak = 1, o = 0.3, vig = 0.62, grade = ["#2030a0", 0.3], warm = 0, grainO = 0.1, rain = true } = {}) => [
  rain ? fx.blurred(fx.rain(wt, { n: 55, speed: 3400, len: 150 * streak + 6, o: o * 0.8, seed: 9, width: 4, angle }), 2.5) : "",
  fx.tint(grade[0], grade[1]), fx.tint("#ff7ab8", warm, "soft-light"), fx.vignette(vig), fx.grain(t, grainO)];
export function roof(c, t, wt, { moon = { x: 830, y: 430, r: 150 }, door = 0, plane = "", front = "", angle = 8, streak = 1, fgBlur = 8, far = 1, fg = "", hut = true } = {}) {
  return [
    fx.layer(N.sky(moon), c, 0.04),
    fx.layer(N.cityFar(), c, 0.12, { blur: 2.2 * far }),
    fx.layer(N.cityMid(), c, 0.3, { blur: 1.4 * far }),
    fx.fog(t, { y: 1220, o: 0.2 }),
    fx.layer(N.cityNear(), c, 0.55, { blur: 0.8 * far }),
    rainBack(wt, angle, streak),
    fx.layer(N.acrossAlley(), c, 0.9),
    fx.layer(N.roofBack() + (hut ? N.hut(door) : "") + N.roofFloor() + plane, c, 1),
    fg ? fx.layer(fg, c, 1.8, { blur: fgBlur }) : "",
    front,
  ];
}
