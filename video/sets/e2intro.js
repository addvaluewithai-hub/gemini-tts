// "Intro" of electricity part 2 (how it is made): three shots, nothing to read but a "?" and a year.
//   0 inside the copper wire from part 1, electrons drifting; a "?" springs up on «بيمشّيها»; the camera pulls out of the
//     wire and back over the night land: the wire runs on poles to a far station on the horizon, a "?" over it on «منين»
//   1 four stations in a row pop up on their words (coal chimney, nuclear cooling tower, dam, wind turbine); in each a
//     round window shows the same magnet; on «بنفس الحركة» every magnet glows gold and spins in step
//   2 the camera goes through one window: the magnet alone, big, spinning in its coil; a calendar page "1831"
// Hand-overs: through the copper (0 → 1, the window's glow) and the gold of the window (1 → 2).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, through, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH, portrait } from "./kit.js";
import { P, E, mix, stars, skyline, pop, tube, pole, span, station } from "./elec.js";
import { calPage, hills } from "./props.js";
import { gen, turbine } from "./faraday.js";
import { V } from "./e2intro.v.js";

const qmark = (a, s = 1) => (a <= 0 ? "" : at(0, 0, `${rings(0, -60, 150, P.gold, 0.2, 1.4)}${text(0, 40, "?", 300, P.gold)}`, pop(a, 8, 14) * s));
const sky = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(31, 90, -900, 2900, 700, tot), c, 0.15);

// ---- 0: inside the wire, then out over the land ----
function s0(a, tot) {
  const v = portrait(), T = 4.9;
  if (a < T) {
    const c = camAt(a, [[0, 960, 540, 1.0], [T, 960, 540, 1.12]]);
    const g = `<rect width="${FW}" height="${FH}" fill="${E.cuD}"/>` + layer(`<rect x="-900" y="-900" width="3800" height="2900" fill="${E.cuD}"/>` + tube(-800, 2700, 540, v ? 900 : 560, tot, 24 * a, { n: 44, r: 34 }) + at(960, v ? 200 : 300, qmark(a - 4.36)), c);
    return { g: through(g, 960, 540, easeIn(seg(a, T - 0.5, T)), E.cuD, 18) };
  }
  // out over the land: the wire on poles to a station far away
  const u = a - T, c = camAt(u, [[0, 960, 600, 1.6], [1.9, 960, 520, 1]]);
  const G = 860, SX = v ? 960 : 1500, SY = G - 120;
  const poles = [[220, 1], [620, 0.78], [960, 0.6], [1220, 0.45]].map(([x, k], i) => at(v ? lerp(960, 960, 0) + (i - 1.5) * 140 * (1 - i * 0.15) : x, G + 40 - i * 40, pole(560), k)).join("");
  const line = v ? "" : `<path d="M220 ${G - 500}Q700 ${G - 330} ${SX - 80} ${SY - 40}" fill="none" stroke="${E.cu}" stroke-width="7"/>`;
  const pulse = (() => { const q = ((tot * 0.6) % 1); if (v) return ""; const x = lerp(SX - 80, 220, q), y = lerp(SY - 40, G - 500, q) + Math.sin(q * Math.PI) * 60; return rings(x, y, 26, E.el, 0.5, 1.6); })();
  const land = hills(7, -900, 2900, G - 40, 120, "#0d3a4e") + `<rect x="-900" y="${G}" width="3800" height="800" fill="${P.ground}"/>`;
  const st = at(SX, SY, station(tot, { lit: 1 }), 0.5);
  const g = through(sky(c, tot) + layer(skyline(5, -900, 2900, G - 120, 60, 160, E.far, false), c, 0.4) + layer(land + st + (v ? "" : poles + line + pulse) + at(SX, SY - 330, qmark(u - 1.0, 0.7)), c), 960, 540, 1 - easeOut(seg(u, 0, 0.55)), E.cuD, 18);
  return { g, out: toScreen(c, SX, SY - 120), outC: P.gold, outZ: 14 };
}

// ---- 1: four stations, one motion ----
const coal = (t) => station(t, { lit: 1 });
const nuke = (t) => `${[0, 1, 2].map((i) => { const q = ((t * 0.3 + i / 3) % 1); return `<circle cx="${20 * Math.sin(t + i)}" cy="${-520 - q * 260}" r="${50 + q * 60}" fill="#dfeef3" opacity="${(0.45 * (1 - q)).toFixed(2)}"/>`; }).join("")}${two("M-200 0Q-150 -260 -180 -520H180Q150 -260 200 0Z", "#b9cdd6", "#8fa7b3", 14, 0)}<path d="M-180 -520H180" stroke="#8fa7b3" stroke-width="14"/>`;
const dam = (t) => `${two("M-280 0L-220 -480H220L280 0Z", "#9fb6c8", "#7890a5", 0, 10)}<rect x="-90" y="-300" width="180" height="300" fill="${E.water}" opacity=".7"/>${[0, 1, 2].map((i) => `<path d="M${-60 + i * 60} -300v300" stroke="#cfe9ff" stroke-width="8" stroke-dasharray="30 30" stroke-dashoffset="${(-t * 300).toFixed(0)}"/>`).join("")}`;
const windT = (t) => `<path d="M-14 0L-8 -560H8L14 0Z" fill="#e8f3f6"/>${at(0, -560, [0, 1, 2].map((i) => `<path d="M-14 0Q-10 -150 0 -260Q12 -150 14 0Z" fill="#e8f3f6" transform="rotate(${t * 70 + i * 120})"/>`).join("") + `<circle r="22" fill="#cfe6f0"/>`)}`;
const KINDS = [[coal, 3.40], [nuke, 3.86], [dam, 4.46], [windT, 5.03]];
function s1(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 560, 1.0], [7, 960, 560, 1.04]]) : camAt(a, [[0, 960, 500, 1.0], [7.06, 960, 520, 1.06]]);
  const sync = seg(a, 5.82, 6.2), G = 820;
  const pos = v ? [[730, 200], [1190, 200], [730, 1000], [1190, 1000]] : [[330, G], [760, G], [1170, G], [1600, G]];
  const items = KINDS.map(([fn, t0], i) => { const [x, y] = pos[i], A = pop(a - t0); if (A <= 0) return "";
    const ang = (a > 5.82 ? (a - 5.82) * 4 : tot * (1.3 + i * 0.7) + i) , w = at(0, -220, `<circle r="92" fill="#0a2a3a" stroke="${mix("#2c5d73", P.gold, sync)}" stroke-width="10"/>${at(0, 0, gen(ang, { R: 66, el: 0, glow: sync }), 1)}`);
    return at(x, y, `${fn(tot)}${w}`, [0.62 * A, 0.62 * A]); }).join("");
  const ground = v ? [200, 1000].map((y) => `<rect x="300" y="${y}" width="1320" height="18" rx="9" fill="#0d3a4e"/>`).join("") : `<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`;
  const g = sky(c, tot) + layer(hills(3, -900, 2900, G - 60, 140, "#0d3a4e"), c, 0.5) + layer(ground + items, c);
  const k = v ? 2 : 1, [ox, oy] = pos[k];
  return { g, in: toScreen(c, 960, 540), inC: P.gold, out: toScreen(c, ox, oy - 220 * 0.62), outC: "#0a2a3a", outZ: 16 };
}

// ---- 2: the magnet, alone ----
function s2(a, tot) {
  const v = portrait(), c = camAt(a, [[0, 960, 540, 1.25], [3.77, 960, 540, v ? 1.0 : 1.05]]);
  const ang = a < 2.36 ? 0.3 * Math.sin(a * 2) : (a - 2.36) * 3.5 * clamp((a - 2.36) / 0.5);
  const cal = at(v ? 960 : 1520, v ? -80 : 300, calPage("1831", "", 1, 150), pop(a - 1.7) * (v ? 1.05 : 0.95));
  const g = sky(c, tot) + layer(at(960, v ? 640 : 560, gen(ang, { R: 300, glow: a > 2.9 ? 0.8 : 0.3 })) + cal, c);
  return { g, in: toScreen(c, 960, 560), inC: "#0a2a3a" };
}

export const SHOTS = [s0, s1, s2];
export const e2introSet = makeSet(SHOTS, V, P);
