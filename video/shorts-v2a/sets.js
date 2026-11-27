// The places: the hallway outside the bathroom door, the bathroom, the mind's eye, the dark stage, the balcony.
// Each is layered (back wall, furniture, light, drifting particles) and takes time so something is always alive.
import { clamp, lerp, G, T, n2, rnd, noise, wob, star } from "./kit.js";
import { C } from "./palette.js";
import { bottles, gasCloud, motes, pictToilet, sparkle } from "./props.js";

export const setDefs = `
  <linearGradient id="gHall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120C30"/><stop offset=".55" stop-color="${C.indigo}"/><stop offset="1" stop-color="#3A2A86"/></linearGradient>
  <radialGradient id="gLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".5"/><stop offset=".5" stop-color="#FFD36B" stop-opacity=".16"/><stop offset="1" stop-color="#FFD36B" stop-opacity="0"/></radialGradient>
  <radialGradient id="gGreenGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.gasHi}" stop-opacity=".75"/><stop offset=".6" stop-color="${C.gas}" stop-opacity=".25"/><stop offset="1" stop-color="${C.gas}" stop-opacity="0"/></radialGradient>
  <linearGradient id="gDoor" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1FB3AC"/><stop offset=".7" stop-color="${C.teal1}"/><stop offset="1" stop-color="${C.teal0}"/></linearGradient>
  <linearGradient id="gBath" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E6A78"/><stop offset=".5" stop-color="${C.teal1}"/><stop offset="1" stop-color="#17969A"/></linearGradient>
  <linearGradient id="gBathFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A4350"/><stop offset="1" stop-color="#062C38"/></linearGradient>
  <pattern id="pTile" width="135" height="135" patternUnits="userSpaceOnUse"><rect x="5" y="5" width="125" height="125" rx="14" fill="#fff" opacity=".07"/><path d="M14 24 q0 -10 10 -10 h40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".1"/></pattern>
  <pattern id="pFrieze" width="90" height="90" patternUnits="userSpaceOnUse"><rect width="90" height="90" fill="${C.teal0}"/><path d="M45 8 L82 45 L45 82 L8 45Z" fill="${C.teal3}" opacity=".55"/><circle cx="45" cy="45" r="11" fill="${C.sun}"/></pattern>
  <pattern id="pFloor" width="160" height="80" patternUnits="userSpaceOnUse"><rect width="160" height="80" fill="#0A4350"/><path d="M0 40 L80 0 L160 40 L80 80Z" fill="#0F5B69"/></pattern>
  <pattern id="pHallFloor" width="180" height="90" patternUnits="userSpaceOnUse"><rect width="180" height="90" fill="#2B1F66"/><path d="M0 45 L90 0 L180 45 L90 90Z" fill="#4B36A8"/><path d="M45 45 L90 22 L135 45 L90 68Z" fill="${C.pink}" opacity=".55"/></pattern>
  <pattern id="pPaper" width="120" height="160" patternUnits="userSpaceOnUse"><path d="M60 20 L84 80 L60 140 L36 80Z" fill="#fff" opacity=".045"/><circle cx="0" cy="0" r="7" fill="#fff" opacity=".05"/><circle cx="120" cy="160" r="7" fill="#fff" opacity=".05"/><circle cx="120" cy="0" r="7" fill="#fff" opacity=".05"/><circle cx="0" cy="160" r="7" fill="#fff" opacity=".05"/></pattern>
  <radialGradient id="gMind" cx=".5" cy=".62" r=".75"><stop offset="0" stop-color="#FFB3F0"/><stop offset=".35" stop-color="#B56BFF"/><stop offset="1" stop-color="#2A1F5C"/></radialGradient>
  <radialGradient id="gStage" cx=".5" cy=".6" r=".8"><stop offset="0" stop-color="#3D2F8F"/><stop offset=".6" stop-color="${C.night}"/><stop offset="1" stop-color="#0C0822"/></radialGradient>
  <linearGradient id="gSpot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C2" stop-opacity=".5"/><stop offset="1" stop-color="#FFF4C2" stop-opacity=".04"/></linearGradient>
  <radialGradient id="gAlarm" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#FF7A6B"/><stop offset=".45" stop-color="${C.red}"/><stop offset="1" stop-color="#7A0F2A"/></radialGradient>
  <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B3FC4"/><stop offset=".42" stop-color="#F0689B"/><stop offset=".75" stop-color="#FFB45E"/><stop offset="1" stop-color="#FFE29A"/></linearGradient>
  <radialGradient id="gSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".45" stop-color="#FFE38A"/><stop offset=".46" stop-color="#FFE38A" stop-opacity=".45"/><stop offset="1" stop-color="#FFE38A" stop-opacity="0"/></radialGradient>
  <linearGradient id="gDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCFF"/><stop offset="1" stop-color="#D9F6FF"/></linearGradient>
  <radialGradient id="gGlowW" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="gVig" cx=".5" cy=".5" r=".72"><stop offset=".62" stop-color="#0A0620" stop-opacity="0"/><stop offset="1" stop-color="#0A0620" stop-opacity=".5"/></radialGradient>
  <linearGradient id="gBeam" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF7CF" stop-opacity=".55"/><stop offset="1" stop-color="#FFF7CF" stop-opacity="0"/></linearGradient>
  <linearGradient id="gEnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C0822"/><stop offset=".7" stop-color="${C.indigo}"/><stop offset="1" stop-color="#4B36A8"/></linearGradient>
  <radialGradient id="gEarth" cx=".4" cy=".2" r=".9"><stop offset="0" stop-color="#7FDCFF"/><stop offset=".5" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.blueLo}"/></radialGradient>`;

export const vignette = `<rect width="1080" height="1920" fill="url(#gVig)"/>`;

// Hallway. gas 0..1: how much is creeping from under the door; glow: the sick light behind the glass.
export function hallway(t, { gas = 1, glow = 1, skull = 0, puff = 0, door = 0 } = {}) {
  const flick = 0.85 + 0.15 * noise(t * 6, 2), sway = Math.sin(t * 1.3) * 4;
  const glassGas = glow > 0.02 ? `<g clip-path="url(#cGlass)">${gasCloud(740, 700, 200, t * 1.4, { seed: 5, n: 7, grow: 0.75 + 0.25 * glow, hi: false })}<rect x="560" y="400" width="360" height="430" fill="${C.gasHi}" opacity="${n2(0.25 * glow * flick)}"/></g>` : "";
  return `<rect width="1080" height="1920" fill="url(#gHall)"/><rect width="1080" height="1500" fill="url(#pPaper)"/>
    <ellipse cx="230" cy="250" rx="520" ry="620" fill="url(#gLamp)" opacity="${n2(0.9 * flick)}"/>
    <path d="M0 1500 H1080 V1920 H0Z" fill="url(#pHallFloor)"/><rect x="0" y="1500" width="1080" height="420" fill="#120C30" opacity=".28"/><rect x="0" y="1470" width="1080" height="36" fill="#1A1245"/>
    <g transform="translate(230 0) rotate(${n2(sway * 0.6)})"><rect x="-4" y="0" width="8" height="150" fill="#0C0822"/><path d="M-80 220 Q-80 150 0 150 Q80 150 80 220Z" fill="${C.pink}"/><ellipse cx="0" cy="222" rx="80" ry="16" fill="#FFE9A8"/></g>
    <g transform="translate(300 560) rotate(${n2(sway)})"><path d="M0 -130 V-60" stroke="#C9B8FF" stroke-width="5"/><circle r="62" fill="${C.blue}"/><circle r="44" fill="#fff"/><circle r="29" fill="${C.sky}"/><circle r="14" fill="${C.ink}"/><circle cx="-18" cy="-22" r="9" fill="#fff" opacity=".7"/></g>
    ${glow > 0.02 ? `<ellipse cx="740" cy="1000" rx="560" ry="780" fill="url(#gGreenGlow)" opacity="${n2(0.55 * glow * flick)}"/>` : ""}
    <rect x="462" y="286" width="556" height="1220" rx="26" fill="#0C0822"/><rect x="486" y="310" width="508" height="1190" rx="14" fill="url(#gDoor)"/>
    <rect x="536" y="376" width="408" height="478" rx="26" fill="${C.teal0}"/><clipPath id="cGlass"><rect x="560" y="400" width="360" height="430" rx="16"/></clipPath>
    <rect x="560" y="400" width="360" height="430" rx="16" fill="${glow > 0.02 ? "#27402A" : "#FFE9A8"}" opacity="${glow > 0.02 ? 1 : 0.85}"/>${glassGas}
    <path d="M740 400 V830 M560 615 H920" stroke="${C.teal0}" stroke-width="14"/><path d="M584 440 q0 -18 18 -18 h60" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".35"/>
    <rect x="536" y="1000" width="408" height="420" rx="26" fill="${C.teal0}" opacity=".6"/><rect x="566" y="1030" width="348" height="360" rx="14" fill="${C.teal1}" opacity=".7"/>
    <g transform="translate(740 920)"><rect x="-46" y="-46" width="92" height="92" rx="20" fill="${C.cream}"/>${pictToilet(C.teal0)}</g>
    <circle cx="536" cy="960" r="24" fill="#B98913"/><circle cx="532" cy="955" r="20" fill="${C.sun}"/>
    ${gas > 0.01 ? gasCloud(720, 1525, 260, t, { seed: 2, n: 10, grow: 0.5 + 0.5 * gas, squashY: 0.45 }) + gasCloud(480, 1560, 150, t * 1.2, { seed: 8, n: 6, grow: gas, squashY: 0.5 }) : ""}
    ${puff > 0.01 ? gasCloud(690, 1180, 150, t * 1.6, { seed: 12, n: 7, grow: puff, skull }) : ""}`;
}

// Bathroom. win 0..1: window open. haze 0..1: gas hanging in the room. day: bright and clean.
export function bathroom(t, { win = 0, haze = 0, day = 0, shelf = ["bleach", "toilet", "vinegar", "glass"], heaterOn = 1 } = {}) {
  const wx = 760, wy = 250, ww = 250, wh = 300, open = clamp(win);
  const pane = (side) => { const a = open * 0.82, w = (ww / 2 - 10) * Math.cos(a * Math.PI / 2 * 1.15); const x = side < 0 ? wx - ww / 2 + 8 : wx + ww / 2 - 8 - Math.max(8, w);
    return `<rect x="${n2(side < 0 ? wx - ww / 2 + 8 : wx + ww / 2 - 8 - Math.max(10, w))}" y="${wy + 8}" width="${n2(Math.max(10, w))}" height="${wh - 16}" rx="8" fill="${open > 0.5 ? "#BEEBFF" : "#9ED8E0"}" opacity="${n2(lerp(0.95, 0.75, open))}"/>`; };
  const sh = (name, i) => G(T(626 + i * 108, 810, 0, 0.42), bottles[name]());
  return `<rect width="1080" height="1920" fill="url(#gBath)"/><rect width="1080" height="1480" fill="url(#pTile)"/>
    <rect x="0" y="1010" width="1080" height="90" fill="url(#pFrieze)"/><rect x="0" y="1004" width="1080" height="8" fill="${C.teal0}"/><rect x="0" y="1098" width="1080" height="8" fill="${C.teal0}"/>
    ${day > 0 ? `<rect width="1080" height="1480" fill="#BFF3EE" opacity="${n2(0.16 * day)}"/>` : ""}
    <path d="M0 1480 H1080 V1920 H0Z" fill="url(#pFloor)"/><rect x="0" y="1480" width="1080" height="440" fill="url(#gBathFloor)" opacity=".45"/><rect x="0" y="1466" width="1080" height="22" fill="${C.teal0}"/>
    <g>
      <rect x="${wx - ww / 2 - 14}" y="${wy - 14}" width="${ww + 28}" height="${wh + 28}" rx="20" fill="${C.cream}"/>
      <rect x="${wx - ww / 2}" y="${wy}" width="${ww}" height="${wh}" rx="10" fill="url(#gDay)" opacity="${n2(lerp(0.25, 1, open))}"/>
      ${open > 0.3 ? `<circle cx="${wx + 50}" cy="${wy + 90}" r="46" fill="#FFF3B0" opacity="${n2(open)}"/><path d="M${wx - 110} ${wy + 230} q40 -40 80 0 q30 -30 60 0 q40 -36 80 0 V${wy + wh} H${wx - 110}Z" fill="#fff" opacity="${n2(0.8 * open)}"/>` : ""}
      ${pane(-1)}${pane(1)}<rect x="${wx - 6}" y="${wy}" width="12" height="${wh}" fill="${C.cream}" opacity="${n2(1 - open)}"/>
      <rect x="${wx - ww / 2 - 26}" y="${wy + wh + 10}" width="${ww + 52}" height="22" rx="10" fill="${C.cream}"/>
    </g>
    ${open > 0.3 ? `<path d="M${wx - ww / 2} ${wy} L${wx + ww / 2} ${wy} L560 1480 L-120 1480Z" fill="url(#gBeam)" opacity="${n2(0.75 * open)}"/>` : ""}
    <g transform="translate(206 250)"><rect x="-22" y="-80" width="12" height="90" fill="${C.teal0}"/><rect x="34" y="210" width="12" height="130" fill="#C9D6DA"/><rect x="-46" y="210" width="12" height="100" fill="#C9D6DA"/>
      <rect x="-104" y="-10" width="208" height="240" rx="60" fill="url(#pPorc)"/><rect x="-104" y="150" width="208" height="16" fill="${C.porcelainLo}" opacity=".7"/>
      <circle cx="0" cy="190" r="13" fill="${heaterOn ? C.red : "#8A9AA0"}"/><circle cx="0" cy="190" r="${n2(22 + 6 * Math.sin(t * 5))}" fill="${C.red}" opacity="${heaterOn ? 0.25 : 0}"/><path d="M-70 40 q0 -22 22 -22 h40" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/></g>
    <rect x="566" y="810" width="460" height="22" rx="10" fill="${C.cream}"/><rect x="566" y="826" width="460" height="10" rx="5" fill="#D9C9A0"/><path d="M600 836 l0 40 M990 836 l0 40" stroke="#D9C9A0" stroke-width="10" stroke-linecap="round"/>
    ${shelf.map(sh).join("")}
    <g transform="translate(96 1200)"><rect x="-6" y="-130" width="12" height="40" fill="${C.cream}"/><path d="M-56 -100 H56 V60 Q0 90 -56 60Z" fill="${C.pink}"/><path d="M-56 -60 H56 M-56 -30 H56" stroke="${C.pinkHi}" stroke-width="10"/></g>
    ${haze > 0.01 ? `<rect width="1080" height="1920" fill="${C.gas}" opacity="${n2(0.3 * haze)}"/>` : ""}`;
}
export const bucket = (tilt = 0) => `<g transform="rotate(${n2(tilt)})"><path d="M-70 -150 L70 -150 L54 0 L-54 0Z" fill="${C.blue}"/><ellipse cx="0" cy="-150" rx="70" ry="18" fill="${C.blueLo}"/><ellipse cx="0" cy="-150" rx="58" ry="12" fill="${C.water}"/><path d="M-70 -150 Q0 -260 70 -150" fill="none" stroke="#C9D6DA" stroke-width="8"/></g>`;

// The mind's eye: where the doctrine lives.
export function mind(t, glory = 0) {
  let rays = ""; for (let i = 0; i < 12; i++) rays += `<path d="M0 0 L${n2(Math.cos((i * 30 + 8) * Math.PI / 180) * 2400)} ${n2(Math.sin((i * 30 + 8) * Math.PI / 180) * 2400)} L${n2(Math.cos((i * 30 - 8) * Math.PI / 180) * 2400)} ${n2(Math.sin((i * 30 - 8) * Math.PI / 180) * 2400)}Z"/>`;
  let puffs = ""; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283, x = 540 + Math.cos(a) * 700, y = 960 + Math.sin(a) * 1130; puffs += `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(230 + 30 * Math.sin(t * 1.4 + i))}"/>`; }
  return `<rect width="1080" height="1920" fill="url(#gMind)"/>
    <g transform="translate(540 1150) rotate(${n2(t * 9)})" fill="#fff" opacity="${n2(0.07 + 0.3 * glory)}">${rays}</g>
    ${motes(t, 26, "#fff", { seed: 21, speed: 40, size: 6, op: 0.5 })}<g fill="#fff" opacity=".96">${puffs}</g><g fill="#E9DBFF" opacity=".5">${puffs.replace(/r="([\d.]+)"/g, (m, r) => `r="${n2(+r - 36)}"`)}</g>`;
}
export function stage(t, { spot = 1, sx = 540, sy = 1260, sw = 430 } = {}) {
  return `<rect width="1080" height="1920" fill="url(#gStage)"/>${motes(t, 22, C.lilac, { seed: 9, speed: 14, size: 5, op: 0.3 })}
    <ellipse cx="540" cy="1300" rx="700" ry="150" fill="#0C0822" opacity=".5"/>
    ${spot > 0.01 ? `<path d="M${sx - 70} -40 L${sx + 70} -40 L${sx + sw} ${sy} L${sx - sw} ${sy}Z" fill="url(#gSpot)" opacity="${n2(0.5 * spot)}"/><ellipse cx="${sx}" cy="${sy}" rx="${sw}" ry="${n2(sw * 0.2)}" fill="#FFF4C2" opacity="${n2(0.2 * spot)}"/>` : ""}`;
}
export function alarm(t, k = 1) {
  let rays = ""; for (let i = 0; i < 10; i++) rays += `<path d="M0 0 L${n2(Math.cos((i * 36 + 9) * Math.PI / 180) * 2400)} ${n2(Math.sin((i * 36 + 9) * Math.PI / 180) * 2400)} L${n2(Math.cos((i * 36 - 9) * Math.PI / 180) * 2400)} ${n2(Math.sin((i * 36 - 9) * Math.PI / 180) * 2400)}Z"/>`;
  return `<rect width="1080" height="1920" fill="url(#gAlarm)"/><g transform="translate(540 800) rotate(${n2(t * 70)})" fill="#FFD36B" opacity="${n2(0.2 + 0.12 * Math.sin(t * 20) * k)}">${rays}</g>`;
}
// Balcony at golden hour. flutter: wind in the laundry. leak: gas coming from the flat behind.
export function balcony(t, { flutter = 1, leak = 1 } = {}) {
  const far = [[0, 200, 760], [150, 150, 690], [280, 190, 800], [450, 130, 720], [570, 220, 840], [770, 160, 700], [910, 170, 780]], near = [[-20, 230, 980], [200, 180, 1080], [390, 250, 940], [640, 200, 1060], [850, 240, 960]];
  const b = (arr, fill, win) => arr.map(([x, w, y], i) => `<rect x="${x}" y="${y}" width="${w}" height="${1500 - y}" fill="${fill}"/>${[...Array(Math.floor((1400 - y) / 90))].map((_, r) => [...Array(Math.floor(w / 70))].map((_, c) => rnd(i * 31 + r * 7 + c) > 0.45 ? `<rect x="${x + 22 + c * 70}" y="${y + 40 + r * 90}" width="30" height="42" rx="5" fill="${win}" opacity="${n2(0.5 + 0.5 * rnd(i + r + c * 3))}"/>` : "").join("")).join("")}`).join("");
  const dish = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-40" stroke="#2A1F5C" stroke-width="8"/><ellipse cx="6" cy="-58" rx="40" ry="26" transform="rotate(-28 6 -58)" fill="#E9DBFF"/><ellipse cx="10" cy="-60" rx="26" ry="15" transform="rotate(-28 10 -60)" fill="#B9A7F5"/></g>`;
  const clothes = [[150, C.pink, "shirt"], [330, C.cream, "towel"], [520, C.sun, "gal"], [720, C.sky, "shirt"], [900, C.cream, "sock"]].map(([x, col, kind], i) => { const a = (6 + 5 * flutter) * Math.sin(t * (2.2 + flutter) + i * 1.1) + 3 * flutter; const y = 232 + 26 * Math.sin((x / 1080) * Math.PI);
    const shape = kind === "towel" ? `<rect x="-52" y="0" width="104" height="170" rx="10" fill="${col}"/><path d="M-52 120 H52" stroke="${C.orange}" stroke-width="12"/>` : kind === "gal" ? `<path d="M-40 0 H40 L80 40 L58 70 L48 56 L62 240 H-62 L-48 56 L-58 70 L-80 40Z" fill="${col}"/><circle cx="0" cy="110" r="12" fill="${C.orange}"/><circle cx="-24" cy="170" r="12" fill="${C.orange}"/><circle cx="26" cy="190" r="12" fill="${C.orange}"/>` : kind === "sock" ? `<path d="M-18 0 H18 V90 Q18 120 -30 118 Q-52 116 -48 96 Q-44 84 -18 84Z" fill="${col}"/><rect x="-18" y="0" width="36" height="22" fill="${C.red}"/>` : `<path d="M-36 0 H36 L84 36 L64 70 L44 56 V160 H-44 V56 L-64 70 L-84 36Z" fill="${col}"/>`;
    return `<g transform="translate(${x} ${n2(y)}) rotate(${n2(a)})"><rect x="-30" y="-8" width="10" height="26" rx="4" fill="#B98913"/><rect x="20" y="-8" width="10" height="26" rx="4" fill="#B98913"/>${shape}</g>`; }).join("");
  let bars = ""; for (let x = 40; x < 1080; x += 104) bars += `<rect x="${x - 7}" y="1320" width="14" height="250" rx="6" fill="#1A1245"/><circle cx="${x + 52}" cy="1445" r="30" fill="none" stroke="#1A1245" stroke-width="12"/>`;
  return `<rect width="1080" height="1920" fill="url(#gSky)"/><circle cx="800" cy="640" r="330" fill="url(#gSun)"/>
    ${[[160, 420, 1], [520, 330, 0.7], [930, 250, 0.6]].map(([x, y, s], i) => `<g transform="translate(${n2(x + ((t * 14 * (i + 1)) % 200) - 60)} ${y}) scale(${s})" fill="#fff" opacity=".55"><ellipse rx="110" ry="30"/><ellipse cx="-50" cy="-22" rx="56" ry="30"/><ellipse cx="34" cy="-30" rx="70" ry="40"/></g>`).join("")}
    <g opacity=".55">${b(far, "#A86BD8", "#FFE29A")}<path d="M500 720 V560 M488 560 h24 M500 560 l0 -30" stroke="#A86BD8" stroke-width="14"/><circle cx="500" cy="600" r="30" fill="#A86BD8"/></g>
    ${b(near, "#5B3FC4", "#FFD36B")}${dish(250, 1080)}${dish(700, 1060, 0.9)}<rect x="420" y="880" width="90" height="62" rx="12" fill="#4B36A8"/><path d="M430 942 v40 M500 942 v40" stroke="#4B36A8" stroke-width="10"/>
    <path d="M-20 232 Q540 290 1100 232" fill="none" stroke="#2A1F5C" stroke-width="6"/>${clothes}
    <rect x="0" y="1500" width="1080" height="420" fill="#3B2C7A"/><rect x="0" y="1500" width="1080" height="420" fill="url(#pHallFloor)" opacity=".35"/>
    ${leak > 0.01 ? gasCloud(40, 1250, 240, t * 1.3, { seed: 14, n: 8, grow: leak }) : ""}
    <rect x="0" y="1296" width="1080" height="34" rx="12" fill="#1A1245"/>${bars}<rect x="0" y="1560" width="1080" height="26" fill="#1A1245"/>
    <g transform="translate(960 1600)"><path d="M-60 -90 H60 L46 0 H-46Z" fill="${C.orange}"/><rect x="-66" y="-102" width="132" height="24" rx="10" fill="#E0622A"/>${[-34, -8, 20, 40].map((x, i) => `<path d="M${x} -100 Q${n2(x - 26 + 8 * Math.sin(t * 2 + i))} -180 ${n2(x + (i - 1.5) * 18 + 10 * Math.sin(t * 2 + i))} ${-230 - i * 12}" fill="none" stroke="#2FA866" stroke-width="16" stroke-linecap="round"/>`).join("")}</g>`;
}
export function endCard(t) {
  let stars = ""; for (let i = 0; i < 40; i++) stars += sparkle(rnd(i * 3.1) * 1080, rnd(i * 7.7) * 1300, 5 + rnd(i) * 9, t * 0.5 + 10, rnd(i * 2.3));
  return `<rect width="1080" height="1920" fill="url(#gEnd)"/>${stars}
    <circle cx="540" cy="2260" r="800" fill="${C.sky}" opacity=".18"/><circle cx="540" cy="2280" r="780" fill="url(#gEarth)"/>
    <g fill="#39C98A" transform="translate(540 2280) rotate(${n2(-8 + t * 3)})"><ellipse cx="-300" cy="-640" rx="150" ry="70"/><ellipse cx="-170" cy="-700" rx="90" ry="50"/><ellipse cx="220" cy="-690" rx="170" ry="60"/><ellipse cx="380" cy="-600" rx="90" ry="46"/><ellipse cx="20" cy="-590" rx="80" ry="40"/></g>`;
}
