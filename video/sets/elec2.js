// Props added for electricity part 2 (how it is made), in the file's own look (P and E from elec.js). Drawn around (0, 0),
// base on y = 0 unless the comment says centre. Any part 2 set can use them: the generator (a magnet spinning in a copper
// coil), the turbine (a fan of blades), a dam, a wind turbine, a solar panel, a nuclear cooling tower, a boiler, the sun,
// a tree, a lump of coal, an air conditioner, a screen, a small kettle mark and a field of kettles (an SVG pattern, cheap).
import { clamp, lerp, ease, at, rr, circ, two, disc, rings, text, drawn } from "./kit.js";
import { P, E, mix } from "./elec.js";

// the generator (centre): a copper coil ring with a red/blue magnet spinning inside; spin in radians; glow 0..1
export const generator = (spin = 0, glow = 0, r = 120) => {
  const coil = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `<ellipse cx="${(r * Math.cos(a)).toFixed(1)}" cy="${(r * Math.sin(a)).toFixed(1)}" rx="${r * 0.2}" ry="${r * 0.12}" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(1)} ${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)})" fill="${E.cu}" stroke="${E.cuD}" stroke-width="${r * 0.04}"/>`; }).join("");
  const mag = `<g transform="rotate(${(spin * 180 / Math.PI).toFixed(1)})"><path d="${rr(-r * 0.62, -r * 0.18, r * 0.62, r * 0.36, r * 0.08)}" fill="${P.red}"/><path d="${rr(0, -r * 0.18, r * 0.62, r * 0.36, r * 0.08)}" fill="#3fa9ff"/>${text(-r * 0.36, r * 0.11, "N", r * 0.28, "#fff")}${text(r * 0.36, r * 0.11, "S", r * 0.28, "#fff")}</g>`;
  return `${glow > 0 ? rings(0, 0, r * 1.5, E.el, 0.2 * glow, 1.4) : ""}<circle r="${r * 1.12}" fill="#0a2b40"/>${coil}${mag}${disc(0, 0, r * 0.1, P.steel, P.steelD)}`;
};
// the turbine (centre): n blades, spin in radians, r the radius
export const turbine = (spin = 0, r = 200, n = 7, c = "#cfe0ea", cD = "#9fb6c4") => `<g transform="rotate(${(spin * 180 / Math.PI).toFixed(1)})">${Array.from({ length: n }, (_, i) => `<g transform="rotate(${(i * 360 / n).toFixed(1)})">${two(`M${r * 0.12} ${-r * 0.08}Q${r * 0.6} ${-r * 0.3} ${r} ${-r * 0.05}L${r * 0.98} ${r * 0.1}Q${r * 0.55} ${r * 0.02} ${r * 0.12} ${r * 0.08}Z`, c, cD, 0, 6)}</g>`).join("")}</g>${disc(0, 0, r * 0.18, P.steel, P.steelD)}`;
// a dam across a gorge, base on y = 0, w wide; water 0..1 how much falls from the spillway (moving with t)
export const dam = (t = 0, w = 900, h = 520, water = 1) => {
  const fall = water > 0 ? Array.from({ length: 6 }, (_, i) => `<path d="M${-w * 0.18 + i * w * 0.07} ${-h * 0.5}V0" stroke="${E.water}" stroke-width="${w * 0.03}" stroke-dasharray="40 30" stroke-dashoffset="${(-t * 400 - i * 17).toFixed(1)}" opacity="${(0.8 * water).toFixed(2)}"/>`).join("") : "";
  return `<path d="M${-w * 0.8} 0L${-w * 0.6} ${-h * 1.1}H${-w * 0.5}L${-w * 0.5} 0Z" fill="#0f3a55"/><path d="M${w * 0.8} 0L${w * 0.6} ${-h * 1.1}H${w * 0.5}L${w * 0.5} 0Z" fill="#0f3a55"/>
    <path d="M${-w * 0.5} ${-h}H${w * 0.5}V${-h * 0.92}H${-w * 0.5}Z" fill="${E.waterD}" opacity=".7"/>${two(`M${-w * 0.5} ${-h}H${w * 0.5}L${w * 0.42} 0H${-w * 0.42}Z`, "#b9c6d4", "#8e9db0", 0, 10)}
    ${Array.from({ length: 5 }, (_, i) => `<path d="M${-w * 0.42 + i * w * 0.21} ${-h * 0.96}V${-h * 0.06}" stroke="#8e9db0" stroke-width="6"/>`).join("")}${fall}
    <path d="M${-w * 0.25} ${-h * 0.5}H${w * 0.25}V${-h * 0.42}H${-w * 0.25}Z" fill="#0a2b40"/>`;
};
// a wind turbine, base on y = 0, h tall; spin in radians
export const windTurbine = (spin = 0, h = 600) => `<path d="M${-h * 0.025} 0L${-h * 0.012} ${-h}H${h * 0.012}L${h * 0.025} 0Z" fill="#dfe8ee"/>${at(0, -h, turbine(spin, h * 0.42, 3, "#eef3f6", "#c3d0d8"))}`;
// a solar panel on a stand, base on y = 0; lit 0..1 how much light is on it
export const solarPanel = (lit = 0, w = 420) => `<path d="M-20 0L0 ${-w * 0.36}L20 0Z" fill="${P.steelD}"/><g transform="translate(0 ${-w * 0.36}) skewX(-14)">${two(rr(-w / 2, -w * 0.36, w, w * 0.4, 10), mix("#1f4fa0", "#3f7fe0", lit), "#163a7a", 0, 8)}
  ${[1, 2, 3, 4].map((i) => `<path d="M${-w / 2 + i * w / 5} ${-w * 0.36}V${w * 0.04}" stroke="#7fa8e8" stroke-width="3" opacity=".6"/>`).join("")}<path d="M${-w / 2} ${-w * 0.16}H${w / 2}" stroke="#7fa8e8" stroke-width="3" opacity=".6"/></g>`;
// a nuclear cooling tower, base on y = 0, h tall; steam with time t
export const coolingTower = (t = 0, h = 460) => { const w = h * 0.36;
  const steam = [0, 1, 2, 3].map((i) => { const q = ((t * 0.25 + i / 4) % 1); return `<circle cx="${(Math.sin(t + i) * 20).toFixed(1)}" cy="${(-h - q * h * 0.6).toFixed(1)}" r="${(w * 0.5 + q * w * 0.5).toFixed(1)}" fill="#e8eef2" opacity="${(0.45 * (1 - q)).toFixed(2)}"/>`; }).join("");
  return `${steam}${two(`M${-w} 0Q${-w * 0.5} ${-h * 0.55} ${-w * 0.7} ${-h}H${w * 0.7}Q${w * 0.5} ${-h * 0.55} ${w} 0Z`, "#c9d4dc", "#9fb0bd", 10, 0)}<path d="M${-w * 0.72} ${-h * 0.94}H${w * 0.72}" stroke="#9fb0bd" stroke-width="8"/>`; };
// a boiler as big as a building, base on y = 0, w wide; fire 0..1 (flames under it), t for flicker
export const boiler = (t = 0, fire = 1, w = 420) => { const h = w * 1.3;
  const flames = fire > 0 ? Array.from({ length: 5 }, (_, i) => { const x = -w * 0.36 + i * w * 0.18, fh = w * 0.18 * fire * (0.8 + 0.3 * Math.sin(t * 9 + i * 2)); return `<path d="M${x - 26} -20Q${x} ${-20 - fh * 1.6} ${x + 26} -20Z" fill="${P.gold}"/><path d="M${x - 14} -20Q${x} ${-20 - fh} ${x + 14} -20Z" fill="${P.red}"/>`; }).join("") : "";
  return `${two(rr(-w / 2, -h, w, h - 60, 40), "#6f8796", "#556b78", 14, 0)}${[0, 1, 2].map((i) => `<path d="M${-w / 2} ${-h + 120 + i * (h - 240) / 2}H${w / 2}" stroke="#556b78" stroke-width="10"/>`).join("")}
    <path d="${rr(-w / 2 - 20, -80, w + 40, 80, 12)}" fill="#2b2350"/>${flames}<path d="${rr(-w * 0.1, -h - 80, w * 0.2, 90, 10)}" fill="#556b78"/>`; };
// the sun (centre), r; t makes its rays turn slowly
export const sun = (r = 140, t = 0, c = "#ffd98a") => `${rings(0, 0, r * 1.6, "#ffd27a", 0.18, 1.4)}<g transform="rotate(${(t * 8).toFixed(1)})">${Array.from({ length: 12 }, (_, i) => `<path d="M${r * 1.15} -10L${r * 1.45} 0L${r * 1.15} 10Z" fill="${c}" transform="rotate(${i * 30})"/>`).join("")}</g>${disc(0, 0, r, c, "#f0b04a", 0.12)}`;
// a tree, base on y = 0, h tall; tilt in degrees (it falls), c the leaves colour
export const tree = (h = 360, tilt = 0, c = "#2fae7a", cD = "#1f8a5e") => `<g transform="rotate(${tilt.toFixed(1)})">${two(rr(-h * 0.05, -h * 0.55, h * 0.1, h * 0.55, 6), P.wood, P.woodD, 6, 0)}${disc(0, -h * 0.68, h * 0.3, c, cD)}${disc(-h * 0.18, -h * 0.55, h * 0.2, c, cD)}${disc(h * 0.18, -h * 0.55, h * 0.2, c, cD)}</g>`;
// a lump of coal (centre), r
export const coal = (r = 120, glint = 0) => `${two(`M${-r} ${r * 0.2}L${-r * 0.7} ${-r * 0.6}L${r * 0.1} ${-r * 0.85}L${r * 0.85} ${-r * 0.4}L${r} ${r * 0.35}L${r * 0.3} ${r * 0.8}L${-r * 0.6} ${r * 0.7}Z`, "#3a3f4a", "#22262e", 0, 10)}<path d="M${-r * 0.5} ${-r * 0.3}L${r * 0.1} ${-r * 0.55}L${r * 0.5} ${-r * 0.2}" fill="none" stroke="#6a7280" stroke-width="${r * 0.06}" opacity="${(0.5 + 0.5 * glint).toFixed(2)}"/>`;
// an air conditioner (centre), 180 wide; on 0..1 blows cool air (with t)
export const acUnit = (on = 0, t = 0) => `${two(rr(-90, -40, 180, 80, 14), "#ece8ff", "#c6c0e6", 6, 6)}<path d="M-70 18H70" stroke="#9f98c6" stroke-width="6"/>${on > 0 ? [0, 1, 2].map((i) => `<path d="M${-50 + i * 50} 50q10 ${20 + 6 * Math.sin(t * 6 + i)} 0 40" fill="none" stroke="${E.el}" stroke-width="6" stroke-linecap="round" opacity="${(0.8 * on).toFixed(2)}"/>`).join("") : ""}<circle cx="70" cy="-22" r="6" fill="${on > 0 ? P.green : "#5a6a8a"}"/>`;
// a screen on a stand (centre of the screen), 200 wide; on 0..1 lights it
export const screenProp = (on = 0) => `<path d="M-10 70h20l6 40h-32Z" fill="${P.steelD}"/><path d="${rr(-60, 106, 120, 12, 6)}" fill="${P.steelD}"/>${two(rr(-100, -70, 200, 140, 12), "#1d2c44", "#101a2c", 6, 0)}<path d="${rr(-88, -58, 176, 116, 6)}" fill="${mix("#0b2436", "#5fd6ff", on)}"/>${on > 0.5 ? `<path d="M-60 -20h80M-60 4h120M-60 28h60" stroke="#0b4152" stroke-width="10" stroke-linecap="round" opacity=".6"/>` : ""}`;
// a small kettle mark (centre), about 60 wide at k = 1, for fields and counts
export const kettleMark = (c = "#ece8ff", cD = "#c6c0e6") => `<path d="M-24 22Q-28 -6 -18 -22H18Q28 -6 24 22Z" fill="${c}"/><path d="M20 -12Q38 -18 34 -30" fill="none" stroke="${cD}" stroke-width="7" stroke-linecap="round"/><path d="M-22 -16Q-38 -12 -34 10" fill="none" stroke="${cD}" stroke-width="6" stroke-linecap="round"/><path d="${rr(-16, -28, 32, 8, 4)}" fill="${cD}"/>`;
// a field of small kettles filling a rectangle (x, y, w, h), drawn with an SVG pattern so it stays cheap at any size;
// cell is the spacing in world units, id must be unique in the frame
export const kettleField = (id, x, y, w, h, cell = 60, o = 1) => (w <= 0 || h <= 0 ? "" : `<defs><pattern id="${id}" x="${x}" y="${y}" width="${cell}" height="${cell}" patternUnits="userSpaceOnUse"><g transform="translate(${cell / 2} ${cell / 2}) scale(${(cell / 80).toFixed(3)})">${kettleMark()}</g></pattern></defs><rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="url(#${id})" opacity="${o}"/>`);
