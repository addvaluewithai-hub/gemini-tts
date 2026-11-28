// The sets. Each is a full 1080 x 1920 picture drawn generously past the edges so the camera can move.
import { tr, g, f1, clamp, lerp, mix, rnd, wob, sparkle, nextId, TAU, E } from "./lib.js";
import { PAL, bottle, bucket, squeegee } from "./props.js";

// camera: put world point (cx, cy) at the centre of the frame at zoom z
export const cam = (cx, cy, z, inner, rot = 0) => `<g transform="translate(540 960) rotate(${f1(rot)}) scale(${Math.round(z * 1000) / 1000}) translate(${f1(-cx)} ${f1(-cy)})">${inner}</g>`;

// drifting motes, used in every set so nothing is ever completely still
export function motes(t, n, o = {}) {
  let out = ""; const col = o.color || "#fff", w = o.w ?? 1080, h = o.h ?? 1920;
  for (let i = 0; i < n; i++) {
    const sp = 12 + rnd(i + 5) * 26, x = (rnd(i * 2 + (o.seed ?? 0)) * w + wob(t, i, 0.12) * 40), y = ((rnd(i * 3 + 1) * h - t * sp * (o.speed ?? 1)) % h + h) % h;
    out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1((o.size ?? 3) * (0.5 + rnd(i * 7) * 1.4))}" fill="${col}" opacity="${f1((o.op ?? 0.35) * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.8 + i))))}"/>`;
  }
  return out;
}

function windowPane(open, t) {
  const o = clamp(open), sw = 1 - o * 0.82;   // each leaf narrows as it swings out
  return `<g transform="translate(850 340)">
    <rect x="-170" y="-196" width="340" height="392" rx="24" fill="#0E6F78" opacity=".35" transform="translate(8 12)"/>
    <rect x="-170" y="-196" width="340" height="392" rx="24" fill="#FFF3D6"/>
    <clipPath id="winc"><rect x="-144" y="-170" width="288" height="340" rx="10"/></clipPath>
    <g clip-path="url(#winc)"><rect x="-144" y="-170" width="288" height="340" fill="url(#gSky)"/>
      <circle cx="70" cy="-90" r="46" fill="#FFE27A"/><circle cx="70" cy="-90" r="70" fill="#FFE27A" opacity=".3"/>
      <g transform="translate(${f1(-40 + wob(t, 1, 0.03) * 30)} 10)"><ellipse cx="0" cy="0" rx="70" ry="24" fill="#fff"/><ellipse cx="-30" cy="-16" rx="36" ry="24" fill="#fff"/><ellipse cx="26" cy="-22" rx="44" ry="30" fill="#fff"/></g>
      <rect x="-144" y="96" width="120" height="80" fill="#E8A66B"/><rect x="-30" y="60" width="90" height="120" fill="#D98F55"/><rect x="60" y="110" width="90" height="70" fill="#F0B880"/>
      <rect x="-120" y="112" width="18" height="22" fill="#7A4A2A"/><rect x="-86" y="112" width="18" height="22" fill="#7A4A2A"/><rect x="-10" y="80" width="18" height="22" fill="#7A4A2A"/><rect x="24" y="80" width="18" height="22" fill="#7A4A2A"/>
    </g>
    <g transform="translate(-144 0) scale(${f1(sw * 100) / 100} 1)"><rect x="0" y="-170" width="144" height="340" fill="#BDEBFF"/><rect x="0" y="-170" width="144" height="340" fill="#fff" opacity=".35"/><path d="M20 -150 L 70 -150 L 20 -60 Z" fill="#fff" opacity=".5"/><rect x="132" y="-170" width="12" height="340" fill="#FFF3D6"/><rect x="0" y="-8" width="144" height="12" fill="#FFF3D6"/></g>
    <g transform="translate(144 0) scale(${f1(-sw * 100) / 100} 1)"><rect x="0" y="-170" width="144" height="340" fill="#BDEBFF"/><rect x="0" y="-170" width="144" height="340" fill="#fff" opacity=".3"/><path d="M20 -150 L 70 -150 L 20 -60 Z" fill="#fff" opacity=".5"/><rect x="132" y="-170" width="12" height="340" fill="#FFF3D6"/><rect x="0" y="-8" width="144" height="12" fill="#FFF3D6"/><circle cx="120" cy="20" r="9" fill="#C9A65C"/></g>
    <rect x="-186" y="186" width="372" height="26" rx="10" fill="#FFF8E6"/>
  </g>`;
}
function heater(t) {
  const lamp = Math.sin(t * 2.2) > -0.3 ? 1 : 0.35;
  return `<g transform="translate(215 380)">
    <path d="M-40 150 V 330 M 40 150 V 330" stroke="#C7D3E3" stroke-width="16" stroke-linecap="round"/><rect x="-52" y="230" width="24" height="20" rx="6" fill="#FF3B5C"/><rect x="28" y="230" width="24" height="20" rx="6" fill="#2979FF"/>
    <rect x="-112" y="-180" width="224" height="340" rx="70" fill="#0E6F78" opacity=".35" transform="translate(10 14)"/>
    <rect x="-112" y="-180" width="224" height="340" rx="70" fill="url(#gCer)"/>
    <rect x="-112" y="40" width="224" height="20" fill="#D5E1F2"/><circle cx="0" cy="100" r="30" fill="#D5E1F2"/><path d="M0 100 L ${f1(Math.cos(-0.9) * 22)} ${f1(100 + Math.sin(-0.9) * 22)}" stroke="#2A2347" stroke-width="8" stroke-linecap="round"/>
    <circle cx="60" cy="100" r="11" fill="#FF3B5C" opacity="${lamp}"/><circle cx="60" cy="100" r="26" fill="#FF3B5C" opacity="${f1(lamp * 0.25)}"/>
    <rect x="-84" y="-140" width="26" height="150" rx="13" fill="#fff"/>
  </g>`;
}
function towel(t, wind = 0) {
  const sw = wob(t, 4, 0.25) * 1.5 + wind * 7;
  return `<g transform="translate(540 290)"><circle r="14" fill="#C9A65C"/><g transform="rotate(${f1(sw)})"><path d="M-62 0 H 62 L 58 250 Q 0 270 -58 250 Z" fill="#FF7FBF"/><path d="M-60 60 H 60 V 92 H -60 Z M -59 150 H 59 V 182 H -59 Z" fill="#FFD23F"/><path d="M30 0 H 62 L 58 250 L 34 256 Z" fill="#000" opacity=".1"/></g></g>`;
}
function door(open) {
  const o = clamp(open), w = 1 - o * 0.75;
  return `<g transform="translate(-36 0)"><rect x="-10" y="520" width="190" height="900" rx="8" fill="#5E3A22"/><rect x="6" y="540" width="160" height="880" fill="${mix("#3B2414", "#FFE3B8", o)}"/>
    <g transform="translate(6 0) scale(${f1(w * 100) / 100} 1)"><rect x="0" y="540" width="160" height="880" fill="#A56B42"/><rect x="18" y="580" width="124" height="330" rx="8" fill="#8A5433"/><rect x="18" y="950" width="124" height="420" rx="8" fill="#8A5433"/><circle cx="134" cy="980" r="13" fill="#FFD23F"/></g></g>`;
}

// the bathroom, wide. o: window 0..1, door 0..1, shelf: bottles on the tank lid [kinds], wind, haze 0..1, kind (haze colour)
export function bathroom(t, o = {}) {
  const win = o.window ?? 0;
  return `<rect x="-600" y="-500" width="2280" height="1920" fill="url(#gWall)"/><rect x="-600" y="-500" width="2280" height="1920" fill="url(#pTile)"/>
    <rect x="-600" y="655" width="2280" height="70" fill="url(#pBand)"/><rect x="-600" y="655" width="2280" height="8" fill="#0A5560"/><rect x="-600" y="717" width="2280" height="8" fill="#0A5560"/>
    <circle cx="820" cy="380" r="${f1(620 + win * 200)}" fill="url(#gSpot)" opacity="${f1(0.7 + win * 0.6)}"/>
    ${heater(t)}${towel(t, o.wind ?? 0)}${windowPane(win, t)}
    ${o.sill === false ? "" : bottle("glass", 742, 532, 0.36, 0, { shadow: false })}
    ${door(o.door ?? 0)}
    <rect x="-600" y="1400" width="2280" height="900" fill="url(#gFloor)"/><rect x="-600" y="1400" width="2280" height="900" fill="url(#pFloor)"/>
    <rect x="-600" y="1392" width="2280" height="22" fill="#0A5560"/>
    <ellipse cx="560" cy="1600" rx="420" ry="46" fill="#fff" opacity=".07"/><ellipse cx="300" cy="1760" rx="300" ry="30" fill="#fff" opacity=".05"/>
    ${win > 0.02 ? `<path d="M700 160 L 1010 160 L ${f1(560)} 1700 L 40 1700 Z" fill="url(#gBeam)" opacity="${f1(win * 0.75)}"/>` : ""}
    ${o.tools === false ? "" : squeegee(64, 1452, 0.9, 7) + bucket(150, 1500, 0.78, 0, o.bucket || {})}`;
}
// haze of gas over a set. k 0..1
export function haze(t, k, kind = 1) {
  if (k <= 0.01) return ""; const c = kind === 2 ? PAL.gas2 : PAL.gas; let out = `<rect x="-200" y="-200" width="1480" height="2320" fill="${c}" opacity="${f1(0.34 * k)}"/>`;
  for (let i = 0; i < 12; i++) { const x = ((rnd(i) * 1500 + t * (20 + rnd(i + 3) * 30)) % 1500) - 200, y = 300 + rnd(i * 5 + 2) * 1300 + wob(t, i, 0.1) * 40; out += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(220 + rnd(i + 7) * 200)}" ry="${f1(70 + rnd(i + 9) * 60)}" fill="${i % 3 ? c : PAL.gasHi}" opacity="${f1(0.16 * k)}"/>`; }
  return out;
}

// Peek's observation post: night, a halo behind him, slow stars
export function hq(t, o = {}) {
  let stars = ""; for (let i = 0; i < 46; i++) stars += sparkle(rnd(i * 3) * 1080, rnd(i * 3 + 1) * 1920, (3 + rnd(i * 3 + 2) * 7) * (0.5 + 0.5 * Math.abs(Math.sin(t * (0.6 + rnd(i) * 1.2) + i))), i % 5 ? "#B9A8FF" : "#35E0FF", 0, 0.7);
  return `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#gNight)"/>${stars}
    <ellipse cx="540" cy="${o.haloY ?? 1150}" rx="640" ry="640" fill="url(#gHalo)" opacity="${f1(0.9 + 0.1 * Math.sin(t * 1.3))}"/>
    <ellipse cx="540" cy="1900" rx="900" ry="260" fill="#0E0830" opacity=".55"/>
    ${motes(t, 26, { color: "#B9A8FF", op: 0.3, size: 2.6 })}`;
}
// the screen he watches Earth on. inner is drawn in a 860 x 540 space with (0,0) at the top left. grow 0..1 pops it in.
export function screen(x, y, w, h, inner, t, o = {}) {
  const id = nextId("sc"), k = o.grow ?? 1; if (k <= 0.01) return "";
  const rx = 36;
  return g(tr(x + w / 2, y + h / 2, o.rot ?? 0, k) + ` translate(${-w / 2} ${-h / 2})`, `
    <rect x="-14" y="-14" width="${w + 28}" height="${h + 28}" rx="${rx + 12}" fill="${PAL.cyan}" opacity="${f1(0.28 + 0.08 * Math.sin(t * 3))}" filter="url(#fGlow)"/>
    <rect x="-16" y="-16" width="${w + 32}" height="${h + 32}" rx="${rx + 14}" fill="#0B0726"/>
    <clipPath id="${id}"><rect width="${w}" height="${h}" rx="${rx}"/></clipPath>
    <g clip-path="url(#${id})"><rect width="${w}" height="${h}" fill="url(#gScreen)"/><g transform="scale(${w / 860})">${inner}</g>
      <rect width="${w}" height="${h}" fill="url(#gVig)" opacity=".6"/>
      <path d="M0 ${f1((t * 90) % (h + 80) - 40)} H ${w}" stroke="#fff" stroke-width="26" opacity=".045"/></g>
    <rect width="${w}" height="${h}" rx="${rx}" fill="none" stroke="${PAL.cyan}" stroke-width="6" opacity=".9"/>
    ${o.rec === false ? "" : `<circle cx="46" cy="44" r="13" fill="${PAL.red}" opacity="${Math.sin(t * 6) > 0 ? 1 : 0.25}"/>`}
    <path d="M${w - 96} 30 h 60 M ${w - 96} 48 h 36" stroke="${PAL.cyan}" stroke-width="8" stroke-linecap="round" opacity=".7"/>`);
}

// inside the reaction: a dark, calm stage for the chemistry
export function lab(t, tint = 0, kind = 1) {
  const c = kind === 2 ? PAL.gas2 : PAL.gas;
  let bub = ""; for (let i = 0; i < 22; i++) { const x = rnd(i * 2) * 1080 + wob(t, i, 0.15) * 30, y = ((rnd(i * 3 + 1) * 1920 - t * (40 + rnd(i) * 60)) % 1920 + 1920) % 1920, r = 8 + rnd(i * 5) * 26; bub += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="#7FD8F5" stroke-width="5" opacity=".22"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.18)}" fill="#fff" opacity=".3"/>`; }
  return `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#gLab)"/>${tint > 0 ? `<rect x="-200" y="-200" width="1480" height="2320" fill="${c}" opacity="${f1(tint * 0.22)}"/>` : ""}
    <circle cx="540" cy="900" r="760" fill="url(#gSpot)" opacity=".8"/>${bub}
    <ellipse cx="540" cy="1420" rx="470" ry="70" fill="#081A33" opacity=".7"/><ellipse cx="540" cy="1410" rx="470" ry="70" fill="#1B4F86"/><ellipse cx="540" cy="1402" rx="430" ry="56" fill="#2462A3"/>`;
}

// the balcony: Cairo roofs, laundry, pigeons. o: gasOut 0..1 (wisps from the door), wind 0..1
export function balcony(t, o = {}) {
  const wind = o.wind ?? 0;
  const bld = (x, y, w, h, c, wc, seed) => { let s = `<rect x="${x}" y="${y}" width="${w}" height="${h + 900}" fill="${c}"/>`; const cols = Math.floor(w / 62), rows = Math.floor(h / 86); for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) if (rnd(i * 7 + j * 13 + seed) > 0.25) s += `<rect x="${x + 20 + i * 62}" y="${y + 30 + j * 86}" width="28" height="40" rx="4" fill="${wc}"/>`; return s; };
  const dish = (x, y, s, fl = 1) => g(tr(x, y, 0, s * fl, s), `<path d="M0 0 V -46" stroke="#6B5A8A" stroke-width="8"/><path d="M-44 -56 A 46 46 0 0 0 40 -76 Z" fill="#F7FAFF"/><path d="M-2 -66 L 20 -96" stroke="#6B5A8A" stroke-width="6" stroke-linecap="round"/>`);
  const tank = (x, y, s) => g(tr(x, y, 0, s), `<path d="M-40 0 V -30 M 40 0 V -30" stroke="#5A4A78" stroke-width="10"/><rect x="-56" y="-110" width="112" height="84" rx="18" fill="#3D7BFF"/><rect x="-56" y="-110" width="112" height="20" rx="10" fill="#6FA0FF"/>`);
  let birds = ""; for (let i = 0; i < 9; i++) { const a = t * 0.5 + i * 0.5, bx = 720 + Math.cos(a) * (230 + i * 12) + i * 8, by = 330 + Math.sin(a * 1.0) * 70 + (i % 3) * 26, fl = Math.sin(t * 9 + i) * 12; birds += `<path d="M${f1(bx - 20)} ${f1(by - fl)} Q ${f1(bx - 8)} ${f1(by - 8)} ${f1(bx)} ${f1(by)} Q ${f1(bx + 8)} ${f1(by - 8)} ${f1(bx + 20)} ${f1(by - fl)}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>`; }
  const sag = (x) => 700 + 46 * Math.sin(Math.PI * (x - 380) / 760);
  const cloth = (x, w, h, c, i) => { const r = wob(t, i, 0.3) * 3 + wind * (7 + i * 2) * (0.6 + 0.4 * Math.sin(t * 5 + i)); return `<g transform="${tr(x, sag(x), r)}"><path d="M${-w / 2} 0 H ${w / 2} L ${w / 2 - 4} ${h} Q 0 ${h + 12} ${-w / 2 + 4} ${h} Z" fill="${c}"/><rect x="${-w / 2 + 6}" y="-10" width="10" height="24" rx="4" fill="#FFD23F"/><rect x="${w / 2 - 16}" y="-10" width="10" height="24" rx="4" fill="#FFD23F"/></g>`; };
  return `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#gSky)"/>
    <circle cx="880" cy="250" r="150" fill="#FFF3B0" opacity=".35"/><circle cx="880" cy="250" r="92" fill="#FFE27A"/>
    <g transform="translate(${f1(((t * 9) % 1500) - 300)} 430)" opacity=".95"><ellipse cx="0" cy="0" rx="130" ry="40" fill="#fff"/><ellipse cx="-50" cy="-28" rx="64" ry="42" fill="#fff"/><ellipse cx="46" cy="-36" rx="80" ry="52" fill="#fff"/></g>
    <g transform="translate(${f1(((t * 5 + 700) % 1500) - 300)} 560)" opacity=".7"><ellipse cx="0" cy="0" rx="100" ry="30" fill="#fff"/><ellipse cx="30" cy="-24" rx="60" ry="36" fill="#fff"/></g>
    ${birds}
    ${bld(380, 900, 220, 500, "#B9A0E8", "#8E74C9", 1)}${bld(640, 830, 190, 500, "#C8B2F0", "#9A82D4", 2)}${bld(860, 940, 260, 500, "#B9A0E8", "#8E74C9", 3)}${tank(700, 830, 0.9)}${dish(960, 940, 1)}${dish(450, 900, 0.9, -1)}
    ${bld(430, 1060, 250, 500, "#F2A766", "#B8683A", 4)}${bld(720, 1000, 230, 600, "#F7BC80", "#C27A46", 5)}${bld(960, 1110, 200, 500, "#EE9A5A", "#B8683A", 6)}${tank(800, 1000, 1.1)}${dish(540, 1060, 1.1)}${tank(1010, 1110, 0.9)}
    <path d="M380 700 Q 760 800 1140 700" fill="none" stroke="#5A4A78" stroke-width="5"/>
    ${cloth(520, 110, 150, "#FF4D6D", 1)}${cloth(660, 90, 190, "#fff", 2)}${cloth(790, 130, 130, "#35B6FF", 3)}${cloth(930, 86, 170, "#FFD23F", 4)}
    <rect x="-200" y="-200" width="630" height="2400" fill="#F4C992"/><rect x="398" y="-200" width="32" height="2400" fill="#D9A56A"/>
    <rect x="60" y="640" width="300" height="900" rx="10" fill="#7A4A2A"/><rect x="84" y="664" width="252" height="880" fill="#16424E"/><rect x="84" y="664" width="252" height="880" fill="${PAL.gas}" opacity="${f1(0.5 * (o.gasOut ?? 0))}"/>
    <g transform="translate(84 0) scale(.22 1)"><rect x="0" y="664" width="252" height="880" fill="#A56B42"/></g>
    <rect x="130" y="380" width="180" height="150" rx="10" fill="#E8B57A"/><rect x="146" y="396" width="148" height="118" rx="6" fill="#7FD8F5"/><path d="M220 396 V 514" stroke="#E8B57A" stroke-width="10"/>
    <rect x="-200" y="1540" width="1480" height="700" fill="#C98E5E"/><rect x="-200" y="1540" width="1480" height="26" fill="#A8703F"/>`;
}
// the balcony rail, drawn in front of whoever stands there
export const rail = () => `<g><rect x="400" y="1236" width="760" height="30" rx="12" fill="#2A2347"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${430 + i * 60}" y="1262" width="14" height="300" fill="#2A2347"/><circle cx="${437 + i * 60}" cy="1400" r="16" fill="none" stroke="#2A2347" stroke-width="8"/>`).join("")}<rect x="400" y="1540" width="760" height="30" rx="8" fill="#2A2347"/>
  <g transform="translate(960 1236)"><path d="M-46 0 L -36 -70 H 36 L 46 0 Z" fill="#E0703A"/><rect x="-52" y="-82" width="104" height="22" rx="8" fill="#F08A52"/><path d="M0 -82 C -40 -130 -50 -170 -20 -190 C -6 -160 0 -130 0 -82 M 0 -82 C 30 -140 60 -150 64 -196 C 30 -180 6 -140 0 -82 M 0 -82 C -10 -150 10 -200 26 -226 C 30 -180 16 -130 0 -82" fill="#3ED68A"/></g></g>`;
