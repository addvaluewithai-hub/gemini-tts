// Props and icons. Each returns an SVG string; origin and size are noted per prop. No brand names anywhere.
import { tr, g, f1, clamp, lerp, mix, rnd, wob, cloud, sparkle, nextId, bump, TAU } from "./lib.js";

export const PAL = {
  ink: "#141033", night: "#1A1147", night2: "#2B1A6B", cyan: "#35E0FF", yellow: "#FFD23F", white: "#F7FAFF", red: "#FF3B5C",
  tile: "#1FA9A0", tileHi: "#2CC0B4", tileLo: "#168C86", grout: "#12777A", floor: "#0E5468", floorHi: "#146A80",
  gas: "#C9E22B", gasHi: "#E9F56A", gasLo: "#8FB81A", gasInk: "#2F3D00", gas2: "#B58CFF", gas2Hi: "#D9C2FF", gas2Lo: "#8456E0", gas2Ink: "#2A1466",
  water: "#7FD8F5",
};

// gradients and patterns used everywhere; drawn once
export const DEFS = `
<linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2AC2B4"/><stop offset="1" stop-color="#17968F"/></linearGradient>
<linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#136E84"/><stop offset="1" stop-color="#0A4256"/></linearGradient>
<pattern id="pTile" width="135" height="135" patternUnits="userSpaceOnUse"><rect width="135" height="135" fill="none"/><path d="M0 0H135M0 0V135" stroke="#12777A" stroke-width="5" opacity=".55"/><rect x="8" y="8" width="52" height="10" rx="5" fill="#fff" opacity=".1"/></pattern>
<pattern id="pFloor" width="180" height="90" patternUnits="userSpaceOnUse"><path d="M0 0H180M0 0V90M90 45V90M0 45H180" stroke="#0A3E50" stroke-width="5" opacity=".5"/></pattern>
<pattern id="pBand" width="90" height="70" patternUnits="userSpaceOnUse"><rect width="90" height="70" fill="#0E6F78"/><path d="M45 8L78 35L45 62L12 35Z" fill="#FFD23F"/><circle cx="45" cy="35" r="9" fill="#0E6F78"/></pattern>
<radialGradient id="gSpot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="gVig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>
<linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#150D3D"/><stop offset=".6" stop-color="#2A1A6B"/><stop offset="1" stop-color="#3B2392"/></linearGradient>
<radialGradient id="gHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7A5CFF" stop-opacity=".55"/><stop offset="1" stop-color="#7A5CFF" stop-opacity="0"/></radialGradient>
<linearGradient id="gGas" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF76E"/><stop offset="1" stop-color="#A9CC1E"/></linearGradient>
<linearGradient id="gGas2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCC8FF"/><stop offset="1" stop-color="#9468EE"/></linearGradient>
<linearGradient id="gCer" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F1F6FD"/><stop offset="1" stop-color="#C9D8EC"/></linearGradient>
<linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FA9F5"/><stop offset=".55" stop-color="#8FD3FF"/><stop offset="1" stop-color="#FFE3B8"/></linearGradient>
<linearGradient id="gScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E2A4D"/><stop offset="1" stop-color="#0A1B36"/></linearGradient>
<linearGradient id="gLab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B2140"/><stop offset="1" stop-color="#123A63"/></linearGradient>
<linearGradient id="gBeam" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C9" stop-opacity=".55"/><stop offset="1" stop-color="#FFF6C9" stop-opacity="0"/></linearGradient>
<filter id="fGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="fSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
`;

// ---- bottles: origin at the centre of the base, about 270 tall. kind: bleach | toilet | vinegar | glass ----
export function bottle(kind, x, y, s = 1, rot = 0, o = {}) {
  let b = "";
  if (kind === "bleach") b = `
    <path d="M70 -150 C 118 -150 118 -60 70 -60" fill="none" stroke="#DCE6F5" stroke-width="20" stroke-linecap="round"/>
    <path d="M-74 -8 C -74 4 -66 8 -56 8 L 56 8 C 66 8 74 4 74 -8 L 74 -168 C 74 -196 40 -206 30 -226 L -30 -226 C -40 -206 -74 -196 -74 -168 Z" fill="#F7FAFF"/>
    <path d="M40 8 L 56 8 C 66 8 74 4 74 -8 L 74 -168 C 74 -190 52 -200 40 -212 Z" fill="#D5E1F2"/>
    <rect x="-34" y="-270" width="68" height="48" rx="10" fill="#2979FF"/><rect x="-34" y="-270" width="68" height="14" rx="7" fill="#5C9BFF"/>
    <rect x="-56" y="-150" width="104" height="104" rx="16" fill="#2979FF"/>
    <text x="-4" y="-76" text-anchor="middle" font-family="Anton, sans-serif" font-size="66" fill="#fff">Cl</text>
    <rect x="-62" y="-190" width="14" height="60" rx="7" fill="#fff" opacity=".9"/>`;
  if (kind === "toilet") b = `
    <path d="M-10 -196 L 44 -262 L 74 -240 L 34 -186 Z" fill="#C4183C"/>
    <g transform="translate(62 -254) rotate(38)"><rect x="-22" y="-26" width="44" height="38" rx="9" fill="#FFD23F"/></g>
    <path d="M-62 -6 C -62 4 -54 8 -46 8 L 46 8 C 54 8 62 4 62 -6 L 62 -150 C 62 -184 36 -196 20 -206 L -20 -206 C -36 -196 -62 -184 -62 -150 Z" fill="#E8274F"/>
    <path d="M30 8 L 46 8 C 54 8 62 4 62 -6 L 62 -150 C 62 -176 44 -190 30 -198 Z" fill="#B8173A"/>
    <circle cx="-4" cy="-92" r="46" fill="#fff"/>
    <path d="M-28 -104 h 48 v 8 c 0 22 -14 30 -24 30 c -10 0 -24 -8 -24 -30 Z" fill="#E8274F"/><rect x="-26" y="-122" width="18" height="16" rx="4" fill="#E8274F"/>
    <rect x="-50" y="-176" width="12" height="52" rx="6" fill="#fff" opacity=".55"/>`;
  if (kind === "vinegar") b = `
    <path d="M-50 -4 C -50 4 -44 8 -38 8 L 38 8 C 44 8 50 4 50 -4 L 50 -150 C 50 -180 22 -190 20 -216 L -20 -216 C -22 -190 -50 -180 -50 -150 Z" fill="#FDF3C7"/>
    <path d="M-50 -4 C -50 4 -44 8 -38 8 L 38 8 C 44 8 50 4 50 -4 L 50 -140 Q 0 -128 -50 -140 Z" fill="#F4C430"/>
    <path d="M26 8 L 38 8 C 44 8 50 4 50 -4 L 50 -140 L 26 -136 Z" fill="#D9A514"/>
    <rect x="-24" y="-262" width="48" height="50" rx="9" fill="#E53935"/><rect x="-24" y="-262" width="48" height="13" rx="6" fill="#FF6B66"/>
    <rect x="-40" y="-118" width="80" height="84" rx="12" fill="#fff"/>
    <g transform="translate(0 -76) rotate(-28)"><rect x="-27" y="-13" width="54" height="26" rx="13" fill="#5BA83C"/><circle cx="-10" cy="-3" r="3.5" fill="#3D7F25"/><circle cx="4" cy="4" r="3.5" fill="#3D7F25"/><circle cx="14" cy="-4" r="3.5" fill="#3D7F25"/></g>
    <rect x="-40" y="-176" width="10" height="44" rx="5" fill="#fff" opacity=".8"/>`;
  if (kind === "glass") b = `
    <path d="M-58 -4 C -58 4 -50 8 -44 8 L 44 8 C 50 8 58 4 58 -4 L 58 -130 C 58 -168 26 -170 22 -200 L -22 -200 C -26 -170 -58 -168 -58 -130 Z" fill="#BFE9FF"/>
    <path d="M-58 -4 C -58 4 -50 8 -44 8 L 44 8 C 50 8 58 4 58 -4 L 58 -120 Q 0 -108 -58 -120 Z" fill="#35B6FF"/>
    <path d="M30 8 L 44 8 C 50 8 58 4 58 -4 L 58 -120 L 30 -116 Z" fill="#1C93DB"/>
    <rect x="-24" y="-222" width="48" height="28" rx="6" fill="#2A2347"/>
    <path d="M-66 -274 L 30 -274 C 40 -274 44 -266 44 -258 L 44 -222 L -20 -222 L -20 -240 L -66 -246 Z" fill="#2A2347"/><rect x="-82" y="-272" width="22" height="24" rx="5" fill="#FFD23F"/>
    <path d="M10 -222 C 26 -206 30 -196 28 -180" fill="none" stroke="#2A2347" stroke-width="12" stroke-linecap="round"/>
    <rect x="-38" y="-104" width="76" height="72" rx="10" fill="#fff"/><rect x="-26" y="-92" width="52" height="48" rx="4" fill="#35B6FF"/><path d="M0 -92 V -44 M -26 -68 H 26" stroke="#fff" stroke-width="6"/>
    <rect x="-48" y="-160" width="10" height="40" rx="5" fill="#fff" opacity=".8"/>`;
  return g(tr(x, y, rot, s * (o.flip ? -1 : 1), s), `${o.shadow === false ? "" : `<ellipse cx="0" cy="10" rx="78" ry="13" fill="#03222E" opacity=".25"/>`}${b}`);
}
// where the liquid leaves each bottle, in bottle space
export const SPOUT = { bleach: [0, -270], toilet: [76, -268], vinegar: [0, -262], glass: [-82, -260] };
export const LIQ = { bleach: "#EAF4FF", toilet: "#3D7BFF", vinegar: "#F4C430", glass: "#35B6FF" };

// ---- toilet: origin at the floor under the bowl, about 560 tall and 360 wide ----
export function toilet(x, y, s = 1, o = {}) {
  const water = o.water || "#8ED8F5", id = nextId("tw"), glow = o.glow ?? 0, wy = -262 + (o.rise ?? 0) * -8;
  return g(tr(x, y, 0, s), `<ellipse cx="6" cy="6" rx="190" ry="26" fill="#03222E" opacity=".28"/>
    <rect x="-150" y="-548" width="300" height="250" rx="34" fill="url(#gCer)"/><rect x="-164" y="-566" width="328" height="44" rx="20" fill="#fff"/><rect x="-164" y="-534" width="328" height="12" rx="6" fill="#C9D8EC" opacity=".8"/>
    <rect x="-26" y="-576" width="52" height="16" rx="8" fill="#B9C7DB"/>
    <path d="M-128 -470 C -128 -500 128 -500 128 -470 L 118 -262 L -118 -262 Z" fill="#E6EEF9"/>
    <path d="M-104 -448 C -104 -470 104 -470 104 -448 L 96 -290 L -96 -290 Z" fill="#D5E1F2"/>
    <path d="M-176 -262 C -176 -120 -104 -70 -96 0 L 96 0 C 104 -70 176 -120 176 -262 Z" fill="url(#gCer)"/>
    <path d="M60 0 L 96 0 C 104 -70 176 -120 176 -262 L 120 -262 C 120 -140 66 -80 60 0 Z" fill="#C9D8EC" opacity=".7"/>
    <rect x="-112" y="-26" width="224" height="34" rx="14" fill="#fff"/><rect x="40" y="-26" width="72" height="34" rx="14" fill="#C9D8EC" opacity=".8"/>
    <ellipse cx="0" cy="-262" rx="186" ry="56" fill="#fff"/><ellipse cx="0" cy="-254" rx="186" ry="56" fill="#C9D8EC" opacity=".0"/>
    <ellipse cx="0" cy="-264" rx="146" ry="38" fill="#B7C8DE"/>
    <clipPath id="${id}"><ellipse cx="0" cy="-264" rx="146" ry="38"/></clipPath>
    <g clip-path="url(#${id})"><ellipse cx="0" cy="${f1(wy + 14)}" rx="130" ry="30" fill="${water}"/><ellipse cx="-30" cy="${f1(wy + 8)}" rx="60" ry="9" fill="#fff" opacity=".35"/>${o.inWater || ""}</g>
    ${glow > 0 ? `<ellipse cx="0" cy="-264" rx="150" ry="40" fill="${o.glowColor || PAL.gasHi}" opacity="${f1(glow * 0.8)}" filter="url(#fSoft)"/>` : ""}
    <path d="M-150 -240 C -140 -150 -100 -90 -84 -40" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".9"/>`);
}

// ---- gas: a living cloud with a mean little face. origin at its base centre; grow 0..1 ----
const GB = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * TAU + rnd(i) * 0.5, R = 0.5 + rnd(i + 40) * 0.5; return [Math.cos(a) * R * 150, -150 + Math.sin(a) * R * 105, 62 + rnd(i + 80) * 46, rnd(i + 9) * 6]; });
export function gas(x, y, s, grow, t, o = {}) {
  if (grow <= 0.01) return "";
  const two = o.kind === 2, ink = two ? PAL.gas2Ink : PAL.gasInk, k = clamp(grow), face = o.face ?? 1, mood = o.mood ?? 0;
  const blobs = [[0, -150, 135 * k]].concat(GB.map(([bx, by, r, ph]) => [bx * k + wob(t, ph, 0.35) * 9, by * k - 150 * (1 - k) * 0 + wob(t, ph + 3, 0.28) * 9, r * clamp(k * 1.25 - rnd(ph) * 0.2) * (1 + 0.05 * wob(t, ph + 7, 0.5))]));
  const hi = [[-46, -196, 62 * k], [34, -214, 40 * k], [-96, -150, 30 * k]];
  const blinkK = 1 - bump((t + (o.seed ?? 0)) % 3.1, 2.6, 0.18);
  const eyes = face <= 0 ? "" : `<g transform="${tr(0, -150 + wob(t, 2, 0.4) * 5, 0, k)}" opacity="${f1(clamp(face))}">
    <path d="M-74 ${-32 - mood * 8} L -18 -12" stroke="${ink}" stroke-width="13" stroke-linecap="round"/><path d="M74 ${-32 - mood * 8} L 18 -12" stroke="${ink}" stroke-width="13" stroke-linecap="round"/>
    <ellipse cx="-44" cy="6" rx="19" ry="${f1(22 * blinkK)}" fill="${ink}"/><ellipse cx="44" cy="6" rx="19" ry="${f1(22 * blinkK)}" fill="${ink}"/>
    <circle cx="-38" cy="0" r="6" fill="#fff" opacity="${blinkK > 0.5 ? 1 : 0}"/><circle cx="50" cy="0" r="6" fill="#fff" opacity="${blinkK > 0.5 ? 1 : 0}"/>
    <path d="M-52 58 L -30 44 L -10 60 L 10 44 L 30 60 L 52 44" fill="none" stroke="${ink}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  return g(tr(x, y, o.rot ?? 0, s), `${o.glow === false ? "" : cloud(blobs.map(([a, b, r]) => [a, b, r * 1.12]), two ? PAL.gas2 : PAL.gas, `opacity=".35" filter="url(#fGlow)"`)}
    ${cloud(blobs.map(([a, b, r]) => [a + 10, b + 14, r]), two ? PAL.gas2Lo : PAL.gasLo)}${cloud(blobs, two ? "url(#gGas2)" : "url(#gGas)")}${cloud(hi, "#fff", `opacity=".28"`)}${eyes}`, o.op !== undefined ? `opacity="${f1(o.op)}"` : "");
}
// loose puffs drifting up: a stream of small circles. origin at the source
export function puffs(x, y, t, n, o = {}) {
  const two = o.kind === 2, sp = o.speed ?? 0.5, spread = o.spread ?? 120, rise = o.rise ?? 520, k = o.amount ?? 1; let out = "";
  for (let i = 0; i < n; i++) {
    const u = ((t * sp + rnd(i + (o.seed ?? 0)) * 7) % 1 + 1) % 1, px = (rnd(i * 3 + 1) - 0.5) * spread * (0.3 + u) + wob(t, i, 0.4) * 22, py = -u * rise;
    const r = (o.size ?? 44) * (0.5 + rnd(i * 5 + 2) * 0.8) * Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.7 * k;
    if (r > 1) out += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r)}" fill="${two ? PAL.gas2 : (i % 3 ? PAL.gas : PAL.gasHi)}" opacity="${f1((o.op ?? 0.85) * (1 - u * 0.5))}"/>`;
  }
  return g(tr(x, y), out);
}

// ---- small things ----
export const skull = (x, y, s = 1, rot = 0, fill = "#fff", ink = PAL.ink) => g(tr(x, y, rot, s), `<path d="M-52 -8 C -52 -64 52 -64 52 -8 C 52 12 42 24 30 30 L 30 48 L -30 48 L -30 30 C -42 24 -52 12 -52 -8 Z" fill="${fill}"/>
  <ellipse cx="-22" cy="-6" rx="14" ry="17" fill="${ink}"/><ellipse cx="22" cy="-6" rx="14" ry="17" fill="${ink}"/><path d="M0 14 l 7 13 h -14 Z" fill="${ink}"/><path d="M-12 36 v 12 M 0 36 v 12 M 12 36 v 12" stroke="${ink}" stroke-width="5"/>`);
export const warn = (x, y, s = 1, rot = 0) => g(tr(x, y, rot, s), `<path d="M0 -62 L 66 52 L -66 52 Z" fill="${PAL.yellow}" stroke="${PAL.yellow}" stroke-width="20" stroke-linejoin="round"/><rect x="-8" y="-34" width="16" height="50" rx="8" fill="${PAL.ink}"/><circle cx="0" cy="34" r="9" fill="${PAL.ink}"/>`);
export const check = (x, y, s = 1, rot = 0, draw = 1) => g(tr(x, y, rot, s), `<circle r="78" fill="#19C37D"/><circle r="78" fill="none" stroke="#fff" stroke-width="10" opacity=".35"/><path d="M-36 2 L -10 30 L 40 -28" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" stroke-dashoffset="${f1(120 * (1 - clamp(draw)))}"/>`);
export const nope = (x, y, s = 1, rot = 0) => g(tr(x, y, rot, s), `<circle r="150" fill="none" stroke="${PAL.red}" stroke-width="40"/><path d="M-106 -106 L 106 106" stroke="${PAL.red}" stroke-width="40" stroke-linecap="round"/>`);
export const plus = (x, y, s = 1, rot = 0, fill = "#fff") => g(tr(x, y, rot, s), `<rect x="-44" y="-11" width="88" height="22" rx="11" fill="${fill}"/><rect x="-11" y="-44" width="22" height="88" rx="11" fill="${fill}"/>`);
export const pin = (x, y, s = 1) => g(tr(x, y, 0, s), `<path d="M0 0 C -14 -34 -46 -52 -46 -90 A 46 46 0 0 1 46 -90 C 46 -52 14 -34 0 0 Z" fill="${PAL.red}"/><circle cx="0" cy="-90" r="18" fill="#fff"/>`);
export const bucket = (x, y, s = 1, rot = 0, o = {}) => g(tr(x, y, rot, s), `${o.shadow === false ? "" : `<ellipse cx="0" cy="6" rx="110" ry="16" fill="#03222E" opacity=".25"/>`}
  <path d="M-112 -190 C -112 -280 112 -280 112 -190" fill="none" stroke="#C7D3E3" stroke-width="12" stroke-linecap="round" transform="rotate(${o.handle ?? 0} 0 -190)"/>
  <path d="M-118 -196 L -88 0 L 88 0 L 118 -196 Z" fill="#FF4D6D"/><path d="M40 0 L 88 0 L 118 -196 L 70 -196 Z" fill="#D92F52"/>
  <ellipse cx="0" cy="-196" rx="118" ry="24" fill="#FF7A93"/><ellipse cx="0" cy="-192" rx="100" ry="17" fill="${o.empty ? "#B3203F" : PAL.water}"/>${o.empty ? "" : `<ellipse cx="-30" cy="-195" rx="40" ry="5" fill="#fff" opacity=".5"/>`}`);
export const squeegee = (x, y, s = 1, rot = 0) => g(tr(x, y, rot, s), `<rect x="-9" y="-560" width="18" height="540" rx="9" fill="#F2B705"/><rect x="-120" y="-34" width="240" height="26" rx="10" fill="#2A2347"/><rect x="-126" y="-12" width="252" height="16" rx="6" fill="#111"/>`);
export const brush = (len = 240) => `<rect x="-9" y="${-len}" width="18" height="${len}" rx="9" fill="#35B6FF"/><ellipse cx="0" cy="${-len - 44}" rx="48" ry="56" fill="#fff"/><g stroke="#C9D8EC" stroke-width="6" stroke-linecap="round">${[-30, -15, 0, 15, 30].map((a) => `<path d="M0 ${-len - 44} l ${Math.sin(a * 0.035) * 46} ${-Math.cos(a * 0.035) * 52}"/>`).join("")}</g><rect x="-22" y="${-len - 8}" width="44" height="22" rx="8" fill="#1C93DB"/>`;
export const phone = (x, y, s = 1, rot = 0, lit = 1) => g(tr(x, y, rot, s), `<rect x="-36" y="-66" width="72" height="132" rx="16" fill="#1B1730"/><rect x="-28" y="-54" width="56" height="100" rx="8" fill="${mix("#2B2A4A", "#7CF0C1", lit)}"/><circle cx="0" cy="55" r="5" fill="#555"/>`);
export function ambulance(x, y, s = 1, t = 0, o = {}) {
  const fl = Math.sin(t * TAU * 2.5) > 0 ? 1 : 0;
  return g(tr(x, y + Math.abs(Math.sin(t * 22)) * -3 * (o.drive ?? 1), 0, s), `<ellipse cx="0" cy="6" rx="210" ry="16" fill="#000" opacity=".2"/>
    <rect x="-200" y="-190" width="290" height="170" rx="22" fill="#fff"/><path d="M90 -150 L 150 -150 C 170 -150 200 -100 200 -74 L 200 -20 L 90 -20 Z" fill="#fff"/><path d="M104 -134 L 146 -134 C 160 -134 180 -98 182 -84 L 104 -84 Z" fill="#7FD8F5"/>
    <rect x="-200" y="-96" width="400" height="26" fill="#FF7A1A"/><rect x="-200" y="-44" width="400" height="30" rx="8" fill="#D5E1F2"/>
    <g transform="translate(-60 -134)"><rect x="-11" y="-34" width="22" height="68" rx="4" fill="${PAL.red}"/><rect x="-34" y="-11" width="68" height="22" rx="4" fill="${PAL.red}"/></g>
    <rect x="-52" y="-222" width="60" height="34" rx="12" fill="${fl ? "#FF3B5C" : "#3D7BFF"}"/><circle cx="-22" cy="-205" r="${fl ? 70 : 50}" fill="${fl ? "#FF3B5C" : "#3D7BFF"}" opacity=".3" filter="url(#fSoft)"/>
    ${[-110, 110].map((wx) => `<circle cx="${wx}" cy="-12" r="40" fill="#1B1730"/><circle cx="${wx}" cy="-12" r="17" fill="#C7D3E3"/>`).join("")}`);
}
export function earth(x, y, r, t = 0) {
  const id = nextId("ea"), sp = (t * 22) % 400;
  return g(tr(x, y), `<circle r="${r * 1.14}" fill="#35E0FF" opacity=".18"/><clipPath id="${id}"><circle r="${r}"/></clipPath><circle r="${r}" fill="#2E8BFF"/>
    <g clip-path="url(#${id})"><g transform="scale(${r / 100}) translate(${f1(-sp)} 0)">${[0, 400].map((dx) => `<g transform="translate(${dx} 0)"><path d="M-70 -50 C -30 -80 20 -64 30 -30 C 44 -8 16 16 -10 10 C -30 30 -70 20 -80 -10 Z" fill="#3ED68A"/><path d="M60 20 C 90 6 130 24 126 54 C 110 80 70 78 56 56 Z" fill="#3ED68A"/><path d="M150 -60 C 190 -76 240 -50 232 -16 C 200 6 160 -6 150 -34 Z" fill="#3ED68A"/><path d="M-40 60 C -10 50 20 66 10 90 C -14 104 -44 90 -40 60 Z" fill="#3ED68A"/></g>`).join("")}</g>
      <circle cx="${r * 0.35}" cy="${r * 0.3}" r="${r * 1.1}" fill="none" stroke="#0B2A6B" stroke-width="${r * 0.5}" opacity=".28"/><ellipse cx="${-r * 0.4}" cy="${-r * 0.5}" rx="${r * 0.4}" ry="${r * 0.2}" fill="#fff" opacity=".2"/></g>`);
}
export const saucer = (x, y, s = 1, rot = 0, t = 0) => g(tr(x, y, rot, s), `<ellipse cx="0" cy="34" rx="40" ry="60" fill="#35E0FF" opacity="${f1(0.12 + 0.06 * Math.sin(t * 20))}"/>
  <path d="M-46 -8 C -46 -66 46 -66 46 -8 Z" fill="#9FE8FF"/><ellipse cx="-14" cy="-36" rx="12" ry="8" fill="#fff" opacity=".7"/>
  <ellipse cx="0" cy="0" rx="110" ry="30" fill="#FF4FA3"/><ellipse cx="0" cy="-7" rx="110" ry="24" fill="#FF7FBF"/>
  ${[-70, -24, 24, 70].map((dx, i) => `<circle cx="${dx}" cy="6" r="8" fill="${(Math.floor(t * 6) + i) % 2 ? "#FFD23F" : "#fff"}"/>`).join("")}`);
export function bell(x, y, s = 1, swing = 0) {
  return g(tr(x, y, swing, s), `<circle cx="0" cy="-118" r="16" fill="#F0AE10"/>
    <path d="M-92 60 C -62 30 -76 -100 0 -100 C 76 -100 62 30 92 60 Z" fill="${PAL.yellow}"/><path d="M30 -92 C 70 -70 56 30 92 60 L 52 60 C 34 20 40 -50 30 -92 Z" fill="#F0AE10"/>
    <rect x="-104" y="52" width="208" height="26" rx="13" fill="#F0AE10"/><ellipse cx="-34" cy="-40" rx="12" ry="34" fill="#fff" opacity=".5" transform="rotate(12 -34 -40)"/>
    <circle cx="${f1(-swing * 1.3)}" cy="92" r="20" fill="#F0AE10"/>`);
}
// a curved liquid stream from (x0,y0) falling to (x1,y1); head 0..1 is how far it has travelled, tail 0..1 how much has left the bottle
export function stream(x0, y0, x1, y1, head, tail, color, w = 20, t = 0) {
  if (head <= 0 || tail >= 1) return "";
  const N = 14; let d = "";
  for (let i = 0; i <= N; i++) { const u = lerp(tail, head, i / N), px = lerp(x0, x1, u) + Math.sin(u * 9 + t * 18) * 3, py = y0 + (y1 - y0) * (u * u * 0.75 + u * 0.25); d += (i ? " L " : "M ") + f1(px) + " " + f1(py); }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w * 0.3}" stroke-linecap="round" opacity=".5" transform="translate(${-w * 0.2} 0)"/>`;
}
// drops flying out from a point; k 0..1 is the life of the burst
export function splash(x, y, k, color, n = 9, size = 1, seed = 0) {
  if (k <= 0 || k >= 1) return ""; let out = "";
  for (let i = 0; i < n; i++) { const a = -Math.PI * (0.12 + 0.76 * (i + rnd(i + seed) * 0.6) / n), v = (150 + rnd(i * 7 + seed) * 190) * size, px = Math.cos(a) * v * k, py = Math.sin(a) * v * k + 520 * size * k * k; out += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1((9 + rnd(i + 3 + seed) * 12) * size * (1 - k * 0.7))}" fill="${color}"/>`; }
  return g(tr(x, y), out);
}
export const sparkles = (pts, t, fill = "#fff") => pts.map(([x, y, r, ph], i) => sparkle(x, y, r * (0.55 + 0.45 * Math.sin(t * 5 + (ph ?? i) * 2.1)) , fill, (ph ?? i) * 20 + t * 30)).join("");
export const sheet = () => "";
