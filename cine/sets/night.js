// The night world of the cold opens, as layers for the multiplane camera (fx.layer). World units are pixels at
// zoom 1; the rooftop floor line is FLOOR, the roof runs from x = 0 to EDGE, then the alley.
import { rnd, W, H } from "../lib/fx.js";

export const FLOOR = 1600, EDGE = 2620, DOOR_X = 400, AC_X = 1020;
const memo = new Map();
const once = (key, f) => { if (!memo.has(key)) memo.set(key, f()); return memo.get(key); };

// ---- sky: gradient, stars, the moon (drawn on the far layer; pass where the shot wants it)
export const sky = (moon = { x: 830, y: 430, r: 150 }, twinkle = 0) => `
  <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04061a"/><stop offset=".5" stop-color="#121a52"/><stop offset=".8" stop-color="#3b2a78"/><stop offset="1" stop-color="#7a3f8c"/></linearGradient>
  <radialGradient id="moong" cx=".42" cy=".4" r=".7"><stop offset="0" stop-color="#fffdf0"/><stop offset=".7" stop-color="#f3ecd2"/><stop offset="1" stop-color="#cfc7b0"/></radialGradient>
  <radialGradient id="moonglow"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".55"/><stop offset=".4" stop-color="#9fb8ff" stop-opacity=".18"/><stop offset="1" stop-color="#9fb8ff" stop-opacity="0"/></radialGradient></defs>
  <rect x="-1500" y="-1500" width="${W + 3000}" height="${H + 3000}" fill="url(#skyg)"/>
  ${once("stars", () => Array.from({ length: 150 }, (_, i) => `<circle cx="${(rnd(i * 3) * 2400 - 600).toFixed(0)}" cy="${(rnd(i * 7) * 1500 - 300).toFixed(0)}" r="${(0.8 + rnd(i * 11) * 2.2).toFixed(1)}" fill="#fff" opacity="${(0.25 + rnd(i * 13) * 0.6).toFixed(2)}"/>`).join(""))}
  <circle cx="${moon.x}" cy="${moon.y}" r="${moon.r * 3.4}" fill="url(#moonglow)"/>
  <circle cx="${moon.x}" cy="${moon.y}" r="${moon.r}" fill="url(#moong)"/>
  ${[[-0.35, -0.2, 0.2], [0.3, 0.28, 0.26], [0.1, -0.45, 0.12], [-0.42, 0.38, 0.14], [0.5, -0.15, 0.1], [-0.05, 0.1, 0.09]].map(([a, b, c]) => `<circle cx="${moon.x + a * moon.r}" cy="${moon.y + b * moon.r}" r="${c * moon.r}" fill="#b9b196" opacity=".38"/>`).join("")}`;

// ---- a row of buildings with lit windows
function skyline(seed, { x0 = -500, x1 = 3600, base = 1900, minH = 300, maxH = 900, fill = "#141a48", win = "#ffcf7a", lit = 0.35, minW = 120, maxW = 300, edge = "#2a3378" }) {
  let x = x0, out = "", i = 0;
  while (x < x1) {
    const w = minW + rnd(seed + i * 5) * (maxW - minW), h = minH + rnd(seed + i * 7) * (maxH - minH), top = base - h;
    out += `<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 600).toFixed(0)}" fill="${fill}"/><rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${w.toFixed(0)}" height="6" fill="${edge}"/>`;
    if (rnd(seed + i * 13) > 0.6) out += `<rect x="${(x + w * 0.3).toFixed(0)}" y="${(top - 50).toFixed(0)}" width="${(w * 0.25).toFixed(0)}" height="50" fill="${fill}"/><rect x="${(x + w * 0.42).toFixed(0)}" y="${(top - 130).toFixed(0)}" width="5" height="80" fill="${fill}"/>`;
    const cols = Math.max(2, Math.floor(w / 44)), rows = Math.floor(h / 60), cw = w / cols;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const k = rnd(seed + i * 101 + r * 17 + c * 31);
      if (k < lit) out += `<rect x="${(x + c * cw + cw * 0.25).toFixed(0)}" y="${(top + 26 + r * 60).toFixed(0)}" width="${(cw * 0.5).toFixed(0)}" height="30" fill="${k < lit * 0.2 ? "#9fd8ff" : win}" opacity="${(0.45 + k / lit * 0.5).toFixed(2)}"/>`; }
    x += w + rnd(seed + i * 3) * 30 - 8; i++;
  }
  return out;
}
export const cityFar = () => once("far", () => skyline(11, { base: 1500, minH: 250, maxH: 720, fill: "#1d2560", edge: "#39439a", lit: 0.3, minW: 90, maxW: 220 }));
export const cityMid = () => once("mid", () => skyline(29, { base: 1750, minH: 380, maxH: 980, fill: "#131942", edge: "#283070", lit: 0.26, minW: 160, maxW: 340 })
  + `<g transform="translate(1680 1010)"><rect x="-70" y="0" width="12" height="380" fill="#0b0f2c"/><rect x="58" y="0" width="12" height="380" fill="#0b0f2c"/><path d="M-70 120 L70 240 M70 120 L-70 240" stroke="#0b0f2c" stroke-width="8"/><rect x="-105" y="-190" width="210" height="200" rx="10" fill="#0d1232"/><path d="M-120 -190 L0 -270 L120 -190 Z" fill="#0b0f2c"/><rect x="-105" y="-120" width="210" height="8" fill="#232b66"/><rect x="-105" y="-50" width="210" height="8" fill="#232b66"/></g>`);
export const cityNear = () => once("near", () => skyline(53, { base: 1900, minH: 300, maxH: 620, fill: "#0b0f2e", edge: "#1c2458", lit: 0.2, minW: 260, maxW: 520, win: "#ffb85c" }));

// ---- the rooftop (depth 1). Returns the parts so the shot can put Peek between them.
const BRICK = (x, y, w, h, seed, base = "#2b2650", dark = "#211d40", light = "#353062") => { let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${base}"/>`;
  const bh = 28, bw = 74; for (let r = 0; r * bh < h; r++) for (let c = -1; c * bw < w; c++) { const k = rnd(seed + r * 31 + c * 7); if (k > 0.55) { const bx = x + c * bw + (r % 2) * bw / 2, by = y + r * bh;
    if (bx < x || bx + bw > x + w) continue; s += `<rect x="${bx + 3}" y="${by + 3}" width="${bw - 6}" height="${Math.min(bh - 6, y + h - by - 3)}" fill="${k > 0.8 ? light : dark}" opacity=".7"/>`; } }
  return s; };
export const roofBack = () => once("roofBack", () => `
  ${BRICK(-600, FLOOR - 150, EDGE + 600, 150, 3)}
  <rect x="-600" y="${FLOOR - 172}" width="${EDGE + 612}" height="26" rx="6" fill="#4a4680"/><rect x="-600" y="${FLOOR - 172}" width="${EDGE + 612}" height="7" fill="#6d6ab0" opacity=".7"/>`);
// the stairwell hut; open 0..1 swings the door and lets the light out
export const hut = (open = 0) => { const x = DOOR_X - 260, w = 520, top = FLOOR - 700, dx = DOOR_X - 105, dw = 210, dt = FLOOR - 450;
  return `${once("hutBody", () => `${BRICK(x, top, w, 700, 9, "#262148", "#1c183a", "#302a5c")}<rect x="${x - 16}" y="${top - 26}" width="${w + 32}" height="30" rx="6" fill="#3f3b72"/>
    <rect x="${dx - 14}" y="${dt - 14}" width="${dw + 28}" height="${450 + 14}" fill="#15122c"/>`)}
    <rect x="${dx}" y="${dt}" width="${dw}" height="450" fill="${open > 0.02 ? "#fff0c4" : "#0a0818"}"/>
    ${open > 0.02 ? `<rect x="${dx}" y="${dt}" width="${dw}" height="450" fill="#ffd27a" opacity="${0.5 * open}"/>` : ""}
    <g transform="translate(${dx} 0) scale(${(1 - 0.86 * open).toFixed(3)} 1)"><rect x="0" y="${dt}" width="${dw}" height="450" fill="#3a4a5c"/><rect x="14" y="${dt + 16}" width="${dw - 28}" height="190" fill="#31404f"/><rect x="14" y="${dt + 232}" width="${dw - 28}" height="200" fill="#31404f"/><circle cx="${dw - 26}" cy="${dt + 236}" r="10" fill="#b9c4d0"/></g>
    <rect x="${dx - 2}" y="${dt - 60}" width="60" height="26" rx="6" fill="${open > 0.02 ? "#ff5a5a" : "#5a2030"}"/>`; };
export const acUnit = () => once("ac", () => { const x = AC_X - 170, y = FLOOR - 350, w = 340, h = 400;
  let g = `<rect x="${x + 14}" y="${y + 18}" width="${w}" height="${h}" rx="14" fill="#05071a" opacity=".45"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#2d3962"/><rect x="${x}" y="${y}" width="${w}" height="16" rx="8" fill="#5a6aa8"/><rect x="${x}" y="${y}" width="14" height="${h}" rx="7" fill="#3d4b80"/>`;
  for (let i = 0; i < 9; i++) g += `<rect x="${x + 36}" y="${y + 56 + i * 30}" width="${w - 72}" height="13" rx="6" fill="#161d3e"/>`;
  return g + `<circle cx="${x + w - 44}" cy="${y + h - 60}" r="14" fill="#161d3e"/><rect x="${x + 30}" y="${y + h - 84}" width="120" height="44" rx="6" fill="#222c54"/>`; });
export const roofFloor = () => once("floor", () => `
  <defs><linearGradient id="floorg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3266"/><stop offset=".15" stop-color="#1b2150"/><stop offset="1" stop-color="#0a0d2a"/></linearGradient></defs>
  <rect x="-600" y="${FLOOR - 30}" width="${EDGE + 600}" height="900" fill="url(#floorg)"/>
  <rect x="-600" y="${FLOOR - 30}" width="${EDGE + 600}" height="5" fill="#5661a8" opacity=".6"/>
  ${Array.from({ length: 16 }, (_, i) => `<ellipse cx="${(rnd(i * 5 + 2) * (EDGE + 300) - 200).toFixed(0)}" cy="${(FLOOR + 30 + rnd(i * 9) * 240).toFixed(0)}" rx="${(90 + rnd(i * 3) * 190).toFixed(0)}" ry="${(10 + rnd(i * 7) * 16).toFixed(0)}" fill="#8fa2ff" opacity="${(0.07 + rnd(i) * 0.1).toFixed(2)}"/>`).join("")}
  <rect x="${EDGE - 26}" y="${FLOOR - 60}" width="40" height="930" fill="#12163c"/><rect x="${EDGE - 34}" y="${FLOOR - 72}" width="56" height="22" rx="5" fill="#4a4680"/>`);
// what is across the alley: a lower roof with a chimney and a lit sign
export const acrossAlley = () => once("across", () => `
  ${BRICK(EDGE + 420, FLOOR + 260, 1800, 1400, 33, "#17153a", "#100e2c", "#1e1b46")}<rect x="${EDGE + 400}" y="${FLOOR + 238}" width="1840" height="26" rx="6" fill="#34306a"/>
  <rect x="${EDGE + 760}" y="${FLOOR + 60}" width="110" height="190" fill="#141232"/><rect x="${EDGE + 748}" y="${FLOOR + 44}" width="134" height="24" rx="5" fill="#2c2960"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${EDGE + 520 + i * 250}" y="${FLOOR + 380}" width="110" height="150" fill="${i % 2 ? "#ffcf7a" : "#0c0a24"}" opacity="${i % 2 ? 0.75 : 1}"/>`).join("")}`);
// things close to the lens (depth about 1.8): a vent pipe, a mast and a cable
export const fgPipe = () => once("fgp", () => `<rect x="-300" y="${FLOOR - 330}" width="150" height="900" rx="40" fill="#05071a"/><rect x="-350" y="${FLOOR - 390}" width="250" height="90" rx="30" fill="#05071a"/>`);
export const fgMasts = () => once("fgm", () => [1900, 2950, 3900].map((x, i) => `<rect x="${x}" y="${FLOOR - 900}" width="${30 + i * 8}" height="1500" fill="#05071a"/><path d="M${x - 80} ${FLOOR - 760 + i * 40} H${x + 110} M${x - 60} ${FLOOR - 680 + i * 40} H${x + 90}" stroke="#05071a" stroke-width="16" stroke-linecap="round"/>`).join("")
  + `<path d="M1900 ${FLOOR - 820} Q2450 ${FLOOR - 560} 2960 ${FLOOR - 800} Q3450 ${FLOOR - 560} 3910 ${FLOOR - 780}" stroke="#05071a" stroke-width="9" fill="none"/>`);

// ---- Agent Crowe, kept in shadow: a tall lanky silhouette with a torch. Feet at (0, 0), about 1000 tall, facing right.
export function crowe({ glint = 1, green = 1, aim = -8, halo = "#ffd9a0", haloO = 0.85, lean = 0 } = {}) {
  const shape = `<g transform="rotate(${lean} 0 -480)">
    <path d="M-48 -250 L-60 -22 L-22 -22 L-8 -250 Z"/><path d="M8 -250 L22 -22 L62 -22 L48 -250 Z"/>
    <path d="M-76 -14 C-76 -40 -14 -42 -12 -18 L-12 0 L-84 0 Z"/><path d="M14 -18 C14 -42 82 -40 92 -12 L94 0 L14 0 Z"/>
    <path d="M-60 -822 C-108 -812 -118 -760 -110 -690 L-100 -330 C-104 -280 -128 -250 -150 -224 L-60 -214 L0 -232 L70 -214 L112 -226 C104 -270 100 -300 102 -340 L108 -690 C116 -760 104 -814 62 -822 Z"/>
    <path d="M-52 -838 L-84 -770 L-26 -800 Z"/><path d="M54 -838 L86 -770 L28 -800 Z"/>
    <rect x="-16" y="-860" width="36" height="64" rx="10"/>
    <path d="M-40 -1000 C-46 -1052 40 -1062 50 -1004 L54 -930 C64 -926 70 -910 58 -904 L56 -876 C54 -850 30 -838 4 -838 C-24 -838 -42 -852 -42 -880 Z"/>
    <path d="M-44 -1000 C-52 -1070 30 -1086 62 -1040 C40 -1048 14 -1040 -6 -1022 C-20 -1010 -34 -1004 -44 -1000 Z"/>
    <path d="M-84 -780 C-124 -700 -126 -600 -104 -520" fill="none" stroke-width="40" stroke-linecap="round" stroke="currentColor"/>
    <g transform="rotate(${aim} 74 -780)"><path d="M74 -780 C110 -730 150 -712 214 -716" fill="none" stroke-width="40" stroke-linecap="round" stroke="currentColor"/><rect x="204" y="-734" width="110" height="34" rx="8"/><rect x="300" y="-742" width="30" height="50" rx="6"/></g>
    <rect x="-138" y="-540" width="60" height="84" rx="8"/></g>`;
  return `<g fill="${halo}" color="${halo}" opacity="${haloO}" transform="translate(-5 -4) scale(1.012)">${shape}</g><g fill="#04050e" color="#04050e">${shape}</g>
    <g transform="rotate(${lean} 0 -480)"><ellipse cx="20" cy="-952" rx="13" ry="8" fill="#bfe6ff" opacity="${0.85 * glint}"/><ellipse cx="50" cy="-952" rx="9" ry="7" fill="#bfe6ff" opacity="${0.7 * glint}"/>
    <rect x="-128" y="-528" width="40" height="30" rx="4" fill="#46ff7a" opacity="${green}"/></g>`;
}
// where the torch lens is, in Crowe's own coordinates (for the beam)
export const croweTorch = (aim = -8) => { const a = aim * Math.PI / 180, x = 330 - 74, y = -717 + 780; return [74 + x * Math.cos(a) - y * Math.sin(a), -780 + x * Math.sin(a) + y * Math.cos(a)]; };

// ---- the alley, seen from the ground (its own frame, not part of the rooftop world)
export const alley = () => once("alley", () => `
  <defs><linearGradient id="alleyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1038"/><stop offset=".6" stop-color="#1c1d52"/><stop offset="1" stop-color="#3a2a5e"/></linearGradient>
  <radialGradient id="lampg"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".9"/><stop offset=".3" stop-color="#ffa64d" stop-opacity=".35"/><stop offset="1" stop-color="#ffa64d" stop-opacity="0"/></radialGradient></defs>
  <rect x="-400" y="-400" width="1880" height="2720" fill="url(#alleyg)"/>
  ${BRICK(-400, -400, 640, 2400, 41, "#1b1740", "#141033", "#241f52")}${BRICK(860, -400, 640, 2400, 47, "#191539", "#120f2e", "#211c4a")}
  <rect x="236" y="-400" width="14" height="2400" fill="#0b0920"/><rect x="852" y="-400" width="14" height="2400" fill="#0b0920"/>
  ${[300, 760, 1220].map((y) => `<rect x="-60" y="${y}" width="330" height="16" fill="#080616"/><path d="M-40 ${y} V${y - 150} M60 ${y} V${y - 150} M160 ${y} V${y - 150} M260 ${y} V${y - 150} M-60 ${y - 150} H270" stroke="#080616" stroke-width="10" fill="none"/>`).join("")}
  <rect x="920" y="420" width="150" height="210" fill="#ffcf7a" opacity=".7"/><rect x="920" y="980" width="150" height="210" fill="#0b0920"/>
  <rect x="-400" y="1740" width="1880" height="600" fill="#12122e"/><rect x="-400" y="1740" width="1880" height="8" fill="#3d3a70"/>
  <ellipse cx="540" cy="1800" rx="420" ry="34" fill="#9aa8ff" opacity=".12"/>
  <path d="M900 900 V760 Q900 720 860 720" stroke="#080616" stroke-width="14" fill="none"/><circle cx="846" cy="730" r="20" fill="#ffe2a8"/><circle cx="846" cy="730" r="330" fill="url(#lampg)"/>`);
const LID = (deg) => `<g transform="rotate(${deg} 270 1420)"><rect x="262" y="1392" width="556" height="34" rx="10" fill="#2f7a52"/><rect x="262" y="1392" width="556" height="10" rx="5" fill="#4aa474"/></g>`;
// lid 0 = open, 1 = shut. withLid false leaves the lid out, so it can be drawn behind whoever is inside (dumpsterLid).
export const dumpster = (lid = 0, squash = 0, withLid = true) => `<g transform="translate(540 1760) scale(${1 + squash * 0.06} ${1 - squash * 0.07}) translate(-540 -1760)">
  <rect x="270" y="${1420}" width="540" height="340" rx="16" fill="#1d5a3a"/><rect x="270" y="1420" width="540" height="40" rx="10" fill="#2f7a52"/>
  ${[330, 440, 550, 660].map((x) => `<rect x="${x}" y="1490" width="24" height="230" rx="8" fill="#174a30"/>`).join("")}
  <rect x="300" y="1750" width="60" height="30" rx="8" fill="#0a0a14"/><rect x="720" y="1750" width="60" height="30" rx="8" fill="#0a0a14"/>
  ${withLid ? LID(-72 * (1 - lid)) : ""}</g>`;
export const dumpsterLid = (lid = 0) => LID(-104 * (1 - lid));
export const dumpsterBack = () => `<rect x="286" y="1424" width="508" height="60" fill="#06150d"/>${[[360, 1418, 70], [470, 1404, 84], [600, 1412, 76], [700, 1424, 62]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="#0b0b12"/><ellipse cx="${x - r * 0.3}" cy="${y - r * 0.25}" rx="${r * 0.25}" ry="${r * 0.12}" fill="#fff" opacity=".12"/>`).join("")}`;

// ---- Peek's capsule: a small pod, base at (0, 0), about 300 tall. open 0..1 swings the dome back; heat 0..1 glows.
export function capsule(open = 0, heat = 0, part = "all") {
  const back = `<ellipse cx="0" cy="-196" rx="92" ry="26" fill="#3a0d28"/>`;
  const front = `<defs><linearGradient id="capg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe3f1"/><stop offset=".45" stop-color="#ff7ab8"/><stop offset="1" stop-color="#a81f65"/></linearGradient>
    <radialGradient id="capw" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e8fbff"/><stop offset=".5" stop-color="#57c8ff"/><stop offset="1" stop-color="#0b5ea8"/></radialGradient>
    <radialGradient id="caph"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/></radialGradient></defs>
    <path d="M-128 0 L-176 26 L-118 -40 Z" fill="#8e1754"/><path d="M128 0 L176 26 L118 -40 Z" fill="#8e1754"/>
    <path d="M-122 6 C-156 -70 -138 -160 -96 -200 C-60 -184 60 -184 96 -200 C138 -160 156 -70 122 6 Z" fill="url(#capg)"/>
    <path d="M-143 -60 C-80 -40 80 -40 143 -60 L141 -38 C80 -18 -80 -18 -141 -38 Z" fill="#8e1754" opacity=".55"/>
    <circle cx="0" cy="-118" r="50" fill="#7a1846"/><circle cx="0" cy="-118" r="40" fill="url(#capw)"/><ellipse cx="-14" cy="-132" rx="12" ry="8" fill="#fff" opacity=".7"/>
    <ellipse cx="-84" cy="-150" rx="16" ry="34" fill="#fff" opacity=".3" transform="rotate(18 -84 -150)"/>
    ${heat > 0 ? `<ellipse cx="0" cy="0" rx="240" ry="70" fill="url(#caph)" opacity="${heat}"/>` : ""}`;
  const dome = `<g transform="rotate(${(-118 * open).toFixed(1)} -98 -198)"><path d="M-96 -200 C-80 -262 -30 -286 0 -286 C30 -286 80 -262 96 -200 C60 -184 -60 -184 -96 -200 Z" fill="url(#capg)"/>
    <path d="M0 -286 V-318" stroke="#8e1754" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="-326" r="13" fill="#ffe66d"/><ellipse cx="-36" cy="-246" rx="14" ry="22" fill="#fff" opacity=".35" transform="rotate(24 -36 -246)"/></g>`;
  return part === "back" ? back : part === "front" ? front + dome : back + front + dome;
}
export const crater = () => once("crater", () => `<ellipse cx="0" cy="8" rx="250" ry="46" fill="#05071a" opacity=".8"/>
  ${[[-210, 14, 44, 20, -12], [-120, 32, 60, 22, 6], [10, 40, 70, 24, -4], [130, 30, 56, 22, 10], [214, 12, 40, 18, 16]].map(([x, y, w, h, r]) => `<path d="M${x - w / 2} ${y + h / 2} L${x - w / 3} ${y - h / 2} L${x + w / 3} ${y - h / 2 - 6} L${x + w / 2} ${y + h / 2} Z" fill="#2c3566" transform="rotate(${r} ${x} ${y})"/><path d="M${x - w / 3} ${y - h / 2} L${x + w / 3} ${y - h / 2 - 6}" stroke="#5661a8" stroke-width="3"/>`).join("")}
  <path d="M-250 10 L-330 -6 M250 10 L340 0 M-180 40 L-260 70 M190 40 L270 76" stroke="#05071a" stroke-width="6" stroke-linecap="round"/>`);
export const footprints = (x0, x1, y, glow = 1) => { let s = ""; for (let x = x0, i = 0; x < x1; x += 62, i++) s += `<ellipse cx="${x}" cy="${y + (i % 2 ? 16 : -6)}" rx="26" ry="11" fill="#ff4fa3" opacity="${(0.75 * glow).toFixed(2)}"/><ellipse cx="${x}" cy="${y + (i % 2 ? 16 : -6)}" rx="50" ry="22" fill="#ff4fa3" opacity="${(0.18 * glow).toFixed(2)}"/>`; return s; };
