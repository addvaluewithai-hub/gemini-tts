// "Sources" (electricity part 2): the three things that turn the turbine, and the one station that does not turn.
//   0 three windows in a row: 1 steam (coal, gas flame, atom) lights; the camera moves to 2: a high dam, water falls on a turbine
//   1 pull back: the biggest dam of all across a gorge, the Chinese flag on its crest
//   2 a wind farm at night: the blades start turning on the wind, more turbines rise behind
//   3 the solar panel (host right): nothing turns (a still turbine, ✗); light rays hit the panel, electrons jump out,
//     run up a wire into a bulb at the top, and a straight DC line appears
// Hand-overs through water (blue), the sky, and the panel's glow.
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, cross, check, FW, FH, makeSet } from "./kit.js";
import { P, E, stars, skyline, pop, bulb, electron, flag, tagV } from "./elec.js";
import { sky, ground, puff, flame, coalPile, turbine, reactor } from "./steam.js";
import { V } from "./sources.v.js";

// ---- props ----
// a dam wall across a gorge (base y = 0), w wide, h high; water level behind it and a spill falling from its middle
export const dam = (t, w = 900, h = 520, spill = 1) => { const fall = spill > 0 ? Array.from({ length: 6 }, (_, i) => { const q = ((t * 1.4 + i / 6) % 1); return `<path d="M${-60 + i * 24} ${-h * 0.62 + q * h * 0.62}v40" stroke="#d8f0ff" stroke-width="10" stroke-linecap="round" opacity="${(0.8 * spill * (1 - q * 0.6)).toFixed(2)}"/>`; }).join("") : "";
  return `<path d="M${-w / 2 - 260} 0L${-w / 2} ${-h - 80}L${-w / 2 + 40} 0Z" fill="#2c4a5e"/><path d="M${w / 2 + 260} 0L${w / 2} ${-h - 80}L${w / 2 - 40} 0Z" fill="#2c4a5e"/>
    <path d="M${-w / 2} ${-h + 20}H${w / 2}V${-h - 40}H${-w / 2}Z" fill="${E.waterD}"/>${two(`M${-w / 2} ${-h}H${w / 2}L${w / 2 - 70} 0H${-w / 2 + 70}Z`, "#b9c6d6", "#8e9db2", 0, -12)}
    ${[0.25, 0.5, 0.75].map((f) => `<path d="M${-w / 2 + 40} ${-h * f}H${w / 2 - 40}" stroke="#8e9db2" stroke-width="6" opacity=".6"/>`).join("")}
    ${spill > 0 ? `<path d="${rr(-80, -h * 0.62, 160, h * 0.62, 10)}" fill="${E.water}" opacity="${(0.85 * spill).toFixed(2)}"/>` : ""}${fall}`; };
// a wind turbine (base y = 0), h tall; ang the rotor angle
export const windmill = (ang, h = 520) => { const hub = -h, L = h * 0.48;
  return `<path d="M-14 0L-6 ${hub}H6L14 0Z" fill="#dfe7f2"/>` + [0, 120, 240].map((d) => `<path d="M0 ${hub}l${(L * Math.cos((ang + d) * Math.PI / 180)).toFixed(1)} ${(L * Math.sin((ang + d) * Math.PI / 180)).toFixed(1)}" stroke="#eef3fa" stroke-width="${(h * 0.035).toFixed(1)}" stroke-linecap="round"/>`).join("") + `<circle cx="0" cy="${hub}" r="${h * 0.03}" fill="#c9d6e8"/>`; };
// a solar panel on a stand (base y = 0), w wide; glow 0..1 lights its cells
export const panel = (glow = 0, w = 560) => { const h = w * 0.6, cells = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) cells.push(`<path d="${rr(-w / 2 + 14 + i * (w - 28) / 6, -h - 160 + 14 + j * (h - 28) / 4, (w - 28) / 6 - 8, (h - 28) / 4 - 8, 4)}" fill="${glow > 0 ? `rgb(${Math.round(40 + 60 * glow)},${Math.round(90 + 90 * glow)},${Math.round(170 + 60 * glow)})` : "#22406a"}"/>`);
  return `<path d="M-20 0L-10 -150H10L20 0Z" fill="${P.steelD}"/>${two(rr(-w / 2, -h - 160, w, h, 14), "#c9d6e8", "#9fb0c8", 0, 10)}<path d="${rr(-w / 2 + 8, -h - 152, w - 16, h - 16, 8)}" fill="#14284a"/>${cells.join("")}`; };

// ---- 0: kind one steam, kind two falling water ----
const DOORS = [400, 960, 1520];
const door = (x, G, lit, inner) => `${lit > 0 ? rings(x, G - 300, 300, "#ffd98a", 0.12 * lit, 1.3) : ""}${two(rr(x - 230, G - 600, 460, 600, 30), "#163a52", "#0f2c40", 0, 10)}<path d="${rr(x - 200, G - 570, 400, 540, 20)}" fill="${lit > 0 ? `rgba(255,217,138,${(0.1 + 0.1 * lit).toFixed(2)})` : "#0a2233"}"/>${inner}${at(x, G - 640, `<circle r="40" fill="${lit > 0 ? P.gold : "#2a4a60"}"/>${text(0, 18, String(DOORS.indexOf(x) + 1), 54, lit > 0 ? P.ink : "#6f93a8")}`, lit > 0 ? 1 + 0.15 * Math.exp(-lit * 5) : 1)}`;
function s0(a, tot) {
  const G = 900, c = camAt(a, [[0, 960, 620, 1.05], [2.4, 700, 620, 1.2], [3.4, 960, 620, 1.35], [5.0, 960, 640, 1.5], [6.0, 960, 640, 1.55]]);
  const l1 = seg(a, 0.64, 0.95), l2 = seg(a, 2.59, 2.9);
  const i1 = (pop(a - 1.17) > 0 ? at(DOORS[0] - 110, G - 140, coalPile(10, 0.8), pop(a - 1.17)) : "") + (a > 1.66 ? at(DOORS[0] + 20, G - 140, flame(tot, 0.9 * pop(a - 1.66))) : "") + (a > 2.08 ? at(DOORS[0] + 120, G - 300, `<circle r="40" fill="${E.plus}"/><ellipse rx="80" ry="28" fill="none" stroke="${E.el}" stroke-width="6"/>`, pop(a - 2.08)) : "")
    + (l1 > 0 ? at(DOORS[0], G - 470, puff(50, 0.8 * l1)) : "");
  const rise = ease(seg(a, 4.14, 4.6)), spill = seg(a, 4.71, 5.0), ang = 360 * 1.4 * Math.max(0, a - 5.05) ** 1.4;
  const i2 = at(DOORS[1], G - 30, `<clipPath id="d2"><path d="${rr(-200, -540, 400, 540, 20)}"/></clipPath><g clip-path="url(#d2)">${at(0, 0, dam(tot, 300, 380 * (0.3 + 0.7 * rise), spill), 1)}${at(0, -40, turbine(ang, 60))}</g>`);
  const g = sky(c, tot, 61) + layer(skyline(13, -1200, 3200, G - 60, 100, 260, E.far, E.farLit), c, 0.4) + layer(ground(G) + door(DOORS[0], G, l1, i1) + door(DOORS[1], G, l2, l2 > 0 ? i2 : "") + door(DOORS[2], G, 0, ""), c);
  return { g, out: toScreen(c, DOORS[1], G - 200), outC: E.water, outZ: 14 };
}

// ---- 1: the biggest station on the planet: a dam in China ----
function s1(a, tot) {
  const G = 960, c = camAt(a, [[0, 960, 520, 2.2], [1.13, 960, 500, 1.3], [2.0, 960, 460, 0.82], [2.69, 960, 450, 0.8]]);
  const f = a > 2.15 ? at(960, G - 760, `<path d="M-100 40V-160" stroke="${P.steel}" stroke-width="8"/>` + at(0, -110, flag("cn", 200)), pop(a - 2.15)) : "";
  const g = sky(c, tot, 67) + layer(`<path d="M-1600 ${G - 280}L-300 ${G - 900}L400 ${G - 500}L1000 ${G - 1000}L1700 ${G - 600}L2600 ${G - 900}L3600 ${G - 300}V${G + 900}H-1600Z" fill="#123448"/>`, c, 0.5)
    + layer(ground(G) + at(960, G, dam(tot, 1500, 640, 1), 1) + `<path d="M${960 - 900} ${G}Q960 ${G + 40} ${960 + 900} ${G}" stroke="${E.water}" stroke-width="30" fill="none" opacity=".6"/>` + f, c);
  return { g, in: toScreen(c, 960, G - 300), inC: E.water };
}

// ---- 2: kind three: the wind ----
function s2(a, tot) {
  const G = 900, c = camAt(a, [[0, 960, 560, 1.15], [1.06, 980, 540, 1.0], [3.24, 1020, 520, 0.9]]);
  const start = (t0) => (a < t0 ? 0 : 360 * (0.5 * Math.min(1, a - t0) ** 2 + Math.max(0, a - t0 - 1) * 0.9));
  const wind = a > 0.53 ? Array.from({ length: 6 }, (_, i) => { const q = ((tot * 0.6 + i / 6) % 1); return `<path d="M${-200 + q * 2400} ${300 + i * 90}q120 -24 240 0" stroke="#bfe4ff" stroke-width="6" fill="none" stroke-linecap="round" opacity="${(0.4 * seg(a, 0.53, 0.9) * Math.sin(Math.PI * q)).toFixed(2)}"/>`; }).join("") : "";
  const back = [[260, 0.55], [600, 0.6], [1320, 0.6], [1700, 0.55]].map(([x, k], i) => at(x, G - 40, windmill(start(1.06 + i * 0.1) + i * 40, 520), k * pop(a - 1.06 - i * 0.1))).join("");
  const front = at(960, G, windmill(start(0.53) + 15, 640), 1.1);
  const g = sky(c, tot, 71) + layer(`<path d="M-1200 ${G - 120}Q200 ${G - 300} 960 ${G - 150}T3200 ${G - 200}V${G + 900}H-1200Z" fill="#103246"/>`, c, 0.5) + layer(back, c, 0.8) + layer(ground(G) + front, c) + wind;
  return { g, in: toScreen(c, 960, 300), inC: "#0b4152", out: toScreen(c, 960, G - 704), outC: "#eef3fa", outZ: 12 };
}

// ---- 3: the exception: the solar panel (host right) ----
export function solar(a, tot, o = {}) {
  const G = o.G ?? 900, PX = o.PX ?? 760, c = camAt(a, o.cam || [[0, 900, 600, 1.3], [2.0, 880, 580, 1.35], [3.17, 860, 560, 1.32], [6.76, 880, 560, 1.28]]);
  const still = seg(a, 2.03, 2.6), rays = seg(a, 3.17, 3.6), jump = seg(a, 3.85, 4.4), run = seg(a, 4.2, 5.4), dc = seg(a, 5.95, 6.3);
  const SX = o.SX ?? 400, SY = o.SY ?? 240, BX = o.BX ?? 1320, BY = o.BY ?? 260;
  const sun = rings(SX, SY, 120, "#ffd98a", 0.25, 1.5) + `<circle cx="${SX}" cy="${SY}" r="80" fill="#ffd98a"/>`;
  const rayG = rays > 0 ? [0, 1, 2, 3].map((i) => { const q = ((tot * 1.2 + i / 4) % 1), x1 = lerp(SX, PX - 140 + i * 90, q), y1 = lerp(SY, G - 420, q); return `<path d="M${SX} ${SY}L${x1} ${y1}" stroke="#ffe9a8" stroke-width="10" stroke-linecap="round" opacity="${(0.7 * rays).toFixed(2)}"/>`; }).join("") : "";
  const wd = `M${PX + 280} ${G - 330}H${BX}V${BY + 40}`, wire = `<path d="${wd}" stroke="${E.cuD}" stroke-width="16" fill="none"/>`;
  const els = jump > 0 ? Array.from({ length: 7 }, (_, i) => { const q = ((tot * 0.5 + i / 7) % 1) * run; const L1 = BX - (PX + 280), L2 = G - 330 - BY - 40, d = q * (L1 + L2);
    const p = run > 0 ? (d < L1 ? [PX + 280 + d, G - 330] : [BX, G - 330 - (d - L1)]) : [PX - 180 + i * 60, G - 470 - 60 * spring(jump, 9, 16)]; return at(p[0], p[1], electron(16)); }).join("") : "";
  const tb = at(o.TX ?? 1180, G - 120, turbine(0, 80), 1) + (still > 0 ? at(o.TX ?? 1180, G - 240, cross(0, 0, 40, P.red, a - 2.03)) : "");
  const line = dc > 0 ? at(BX + 140, BY + 20, `<path d="M-60 0H${lerp(-60, 60, ease(dc))}" stroke="${P.gold}" stroke-width="12" stroke-linecap="round"/>${text(0, 70, "DC", 60, P.gold, { opacity: dc.toFixed(2) })}`) : "";
  const g = sky(c, tot, 73) + layer(sun, c, 0.3) + layer(ground(G) + tb + wire + at(PX, G, panel(rays, 560)) + rayG + els + at(BX, BY, bulb(run > 0.95 ? 1 : 0), [0.5, -0.5]) + line, c);
  return { g, in: toScreen(c, PX, G - 340), inC: "#ffd98a", out: toScreen(c, PX, G - 340), outC: "#14284a", outZ: 12 };
}
const s3 = (a, tot) => solar(a, tot);

export const SHOTS = [s0, s1, s2, s3];
export const sourcesSet = makeSet(SHOTS, V, P);
