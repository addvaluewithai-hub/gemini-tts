// The American home for the English version of the bleach Short. Same layout, light and palette as sets.js (so every
// cue and camera move of the film still lands), with the details an American viewer knows from their own house:
// a white six-panel bathroom door with family photos in the hall (one of them, proudly, of the toilet), a bathroom
// with subway tile, a medicine cabinet, a plunger and a toilet-paper roll, and a front porch on a suburban street
// in place of the Cairo balcony. sets.js is not changed; its defs (setDefs) are shared.
import { clamp, lerp, G, T, n2, rnd, noise, wob, star } from "./kit.js";
import { C } from "./palette.js";
import { bottles, gasCloud, pictToilet } from "./props.js";

export const setDefsUS = `
  <pattern id="pWood" width="1080" height="64" patternUnits="userSpaceOnUse"><rect width="1080" height="64" fill="#3A2A78"/><rect y="58" width="1080" height="6" fill="#241A55"/><path d="M180 0 V58 M560 0 V58 M900 0 V58" stroke="#241A55" stroke-width="5"/><rect y="6" width="1080" height="8" fill="#fff" opacity=".04"/></pattern>
  <pattern id="pWood2" width="1080" height="64" patternUnits="userSpaceOnUse" patternTransform="translate(0 32)"><path d="M380 0 V58 M760 0 V58" stroke="#241A55" stroke-width="5"/></pattern>
  <pattern id="pSubway" width="140" height="70" patternUnits="userSpaceOnUse"><rect width="140" height="70" fill="#1A9C9E"/><rect x="4" y="4" width="132" height="27" rx="6" fill="#23B0AE"/><rect x="-66" y="39" width="132" height="27" rx="6" fill="#23B0AE"/><rect x="74" y="39" width="132" height="27" rx="6" fill="#23B0AE"/><rect x="12" y="8" width="60" height="6" rx="3" fill="#fff" opacity=".18"/></pattern>
  <pattern id="pHex" width="96" height="56" patternUnits="userSpaceOnUse"><rect width="96" height="56" fill="#0A4350"/><path d="M24 0 L40 0 L48 14 L40 28 L24 28 L16 14Z M72 28 L88 28 L96 42 L88 56 L72 56 L64 42Z M-24 28 L-8 28 L0 42 L-8 56 L-24 56 L-32 42Z" fill="#0F5B69"/></pattern>
  <pattern id="pBoards" width="1080" height="70" patternUnits="userSpaceOnUse"><rect width="1080" height="70" fill="#8A5A3A"/><rect y="64" width="1080" height="6" fill="#5E3A22"/><path d="M260 0 V64 M700 0 V64" stroke="#5E3A22" stroke-width="5"/><rect y="6" width="1080" height="8" fill="#fff" opacity=".07"/></pattern>
  <linearGradient id="gMirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D9F6FF"/><stop offset=".5" stop-color="#9ED8E0"/><stop offset="1" stop-color="#6FBFCB"/></linearGradient>
  <linearGradient id="gUSDoor" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4F0FF"/><stop offset=".7" stop-color="#DCD5F2"/><stop offset="1" stop-color="#B9AFDF"/></linearGradient>
  <linearGradient id="gLawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FB86B"/><stop offset="1" stop-color="#2F7F52"/></linearGradient>`;

// a framed photo on the hallway wall; kind 0: the family, kind 1: the toilet, in pride of place
const photo = (x, y, w, h, r, kind) => G(T(x, y, r), `<path d="M0 ${-h / 2 - 50} L${-w / 2 + 10} ${-h / 2}" stroke="#C9B8FF" stroke-width="3"/><path d="M0 ${-h / 2 - 50} L${w / 2 - 10} ${-h / 2}" stroke="#C9B8FF" stroke-width="3"/>
  <rect x="${-w / 2 - 16}" y="${-h / 2 - 16}" width="${w + 32}" height="${h + 32}" rx="8" fill="#C9A24A"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${kind ? "#BFF3EE" : "#FFE29A"}"/>
  ${kind ? `<g transform="translate(0 ${h / 2 - 8}) scale(${n2(h / 900)})"><rect x="-142" y="-530" width="284" height="250" rx="34" fill="#fff"/><path d="M-150 -250 C-150 -120 -92 -72 -72 -60 L-82 0 L82 0 L72 -60 C92 -72 150 -120 150 -250 Z" fill="#fff"/><ellipse cx="0" cy="-252" rx="156" ry="50" fill="#E9F2F5"/></g><path d="${star(14)}" transform="translate(${w / 2 - 22} ${-h / 2 + 24})" fill="${C.sun}"/>`
    : `<circle cx="${-w * 0.2}" cy="${-h * 0.08}" r="${n2(h * 0.17)}" fill="${C.orange}"/><path d="M${-w * 0.42} ${h / 2} q${w * 0.22} ${-h * 0.5} ${w * 0.44} 0Z" fill="${C.orange}"/><circle cx="${w * 0.2}" cy="${h * 0.02}" r="${n2(h * 0.13)}" fill="${C.pink}"/><path d="M${w * 0.02} ${h / 2} q${w * 0.18} ${-h * 0.42} ${w * 0.36} 0Z" fill="${C.pink}"/>`}`);

// Hallway outside the bathroom. gas 0..1: creeping from under the door; glow: the sick light leaking round the door.
export function hallwayUS(t, { gas = 1, glow = 1, skull = 0, puff = 0 } = {}) {
  const flick = 0.85 + 0.15 * noise(t * 6, 2), sway = Math.sin(t * 1.3) * 4;
  const leak = glow > 0.02 ? C.gasHi : "#FFE9A8", lk = glow > 0.02 ? 0.6 + 0.4 * flick * glow : 0.7;
  const panel = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#C9C0EA"/><rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" rx="6" fill="#E6E0FA"/><path d="M${x + 14} ${y + h - 14} H${x + w - 14} V${y + 14}" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`;
  return `<rect width="1080" height="1920" fill="url(#gHall)"/>
    <rect x="0" y="1060" width="1080" height="440" fill="#2F2470" opacity=".7"/><rect x="0" y="1046" width="1080" height="22" rx="4" fill="#4B36A8"/>
    ${[[30, 1110], [240, 1110]].map(([x, y]) => `<rect x="${x}" y="${y}" width="170" height="330" rx="8" fill="none" stroke="#4B36A8" stroke-width="8"/>`).join("")}
    <ellipse cx="230" cy="250" rx="520" ry="620" fill="url(#gLamp)" opacity="${n2(0.9 * flick)}"/>
    <path d="M0 1500 H1080 V1920 H0Z" fill="url(#pWood)"/><path d="M0 1500 H1080 V1920 H0Z" fill="url(#pWood2)"/><rect x="0" y="1500" width="1080" height="420" fill="#120C30" opacity=".3"/><rect x="0" y="1470" width="1080" height="36" fill="#E6E0FA" opacity=".85"/>
    <g transform="translate(230 0) rotate(${n2(sway * 0.6)})"><rect x="-4" y="0" width="8" height="150" fill="#0C0822"/><path d="M-80 220 Q-80 150 0 150 Q80 150 80 220Z" fill="${C.pink}"/><ellipse cx="0" cy="222" rx="80" ry="16" fill="#FFE9A8"/></g>
    ${photo(250, 560, 170, 130, n2(-3 + sway * 0.3), 0)}${photo(140, 820, 120, 150, n2(4 + sway * 0.5), 1)}${photo(330, 820, 110, 110, -2, 0)}
    ${glow > 0.02 ? `<ellipse cx="740" cy="1000" rx="560" ry="780" fill="url(#gGreenGlow)" opacity="${n2(0.55 * glow * flick)}"/>` : `<ellipse cx="740" cy="1500" rx="420" ry="90" fill="#FFE9A8" opacity=".18"/>`}
    <rect x="462" y="286" width="556" height="1220" rx="12" fill="#E6E0FA"/><rect x="480" y="304" width="520" height="1202" rx="6" fill="#0C0822"/>
    <rect x="486" y="310" width="${n2(6 * lk + 2)}" height="1190" fill="${leak}" opacity="${n2(lk)}"/><rect x="486" y="1490" width="508" height="12" fill="${leak}" opacity="${n2(lk)}"/>
    <rect x="${n2(494 + 6 * lk)}" y="310" width="${n2(500 - 6 * lk)}" height="1180" rx="4" fill="url(#gUSDoor)"/>
    ${panel(536, 360, 190, 380)}${panel(760, 360, 190, 380)}${panel(536, 790, 414, 130)}${panel(536, 970, 190, 440)}${panel(760, 970, 190, 440)}
    <rect x="${n2(500 + 6 * lk)}" y="310" width="14" height="1180" fill="#fff" opacity=".5"/>
    <circle cx="560" cy="955" r="26" fill="#9A7414"/><circle cx="556" cy="950" r="22" fill="${C.sun}"/><circle cx="550" cy="944" r="7" fill="#FFF3B0"/>
    ${gas > 0.01 ? gasCloud(720, 1525, 260, t, { seed: 2, n: 10, grow: 0.5 + 0.5 * gas, squashY: 0.45 }) + gasCloud(480, 1560, 150, t * 1.2, { seed: 8, n: 6, grow: gas, squashY: 0.5 }) : ""}
    ${puff > 0.01 ? gasCloud(690, 1180, 150, t * 1.6, { seed: 12, n: 7, grow: puff, skull }) : ""}`;
}

// Bathroom. win 0..1: window open. haze 0..1: gas hanging in the room. day: bright and clean.
export function bathroomUS(t, { win = 0, haze = 0, day = 0, shelf = ["bleach", "toilet", "vinegar", "glass"] } = {}) {
  const wx = 760, wy = 250, ww = 250, wh = 300, open = clamp(win);
  const pane = (side) => { const a = open * 0.82, w = (ww / 2 - 10) * Math.cos(a * Math.PI / 2 * 1.15);
    return `<rect x="${n2(side < 0 ? wx - ww / 2 + 8 : wx + ww / 2 - 8 - Math.max(10, w))}" y="${wy + 8}" width="${n2(Math.max(10, w))}" height="${wh - 16}" rx="8" fill="${open > 0.5 ? "#BEEBFF" : "#C8E6EA"}" opacity="${n2(lerp(0.95, 0.75, open))}"/>`; };
  const sh = (name, i) => G(T(626 + i * 108, 810, 0, 0.42), bottles[name]());
  return `<rect width="1080" height="1920" fill="url(#gBath)"/>
    <rect x="0" y="1010" width="1080" height="470" fill="url(#pSubway)"/><rect x="0" y="994" width="1080" height="26" rx="6" fill="${C.cream}"/><rect x="0" y="1016" width="1080" height="8" fill="#D9C9A0"/>
    ${day > 0 ? `<rect width="1080" height="1480" fill="#BFF3EE" opacity="${n2(0.16 * day)}"/>` : ""}
    <path d="M0 1480 H1080 V1920 H0Z" fill="url(#pHex)"/><rect x="0" y="1480" width="1080" height="440" fill="url(#gBathFloor)" opacity=".45"/><rect x="0" y="1466" width="1080" height="22" fill="${C.cream}" opacity=".9"/>
    <g>
      <rect x="${wx - ww / 2 - 14}" y="${wy - 14}" width="${ww + 28}" height="${wh + 28}" rx="10" fill="#fff"/>
      <rect x="${wx - ww / 2}" y="${wy}" width="${ww}" height="${wh}" rx="4" fill="url(#gDay)" opacity="${n2(lerp(0.25, 1, open))}"/>
      ${open > 0.3 ? `<circle cx="${wx + 50}" cy="${wy + 90}" r="46" fill="#FFF3B0" opacity="${n2(open)}"/><path d="M${wx - 110} ${wy + 230} q40 -40 80 0 q30 -30 60 0 q40 -36 80 0 V${wy + wh} H${wx - 110}Z" fill="#fff" opacity="${n2(0.8 * open)}"/>` : ""}
      ${pane(-1)}${pane(1)}<rect x="${wx - 6}" y="${wy}" width="12" height="${wh}" fill="#fff" opacity="${n2(1 - open)}"/>
      <rect x="${wx - ww / 2 - 26}" y="${wy + wh + 10}" width="${ww + 52}" height="22" rx="6" fill="#fff"/>
    </g>
    ${open > 0.3 ? `<path d="M${wx - ww / 2} ${wy} L${wx + ww / 2} ${wy} L560 1480 L-120 1480Z" fill="url(#gBeam)" opacity="${n2(0.75 * open)}"/>` : ""}
    <g transform="translate(206 300)"><rect x="-120" y="-150" width="240" height="300" rx="14" fill="#fff"/><rect x="-104" y="-134" width="208" height="268" rx="6" fill="url(#gMirror)"/>
      <path d="M-70 -110 L-20 -110 L-90 60 L-104 60 L-104 -40Z" fill="#fff" opacity=".35"/><path d="M30 -134 L60 -134 L-10 134 L-40 134Z" fill="#fff" opacity=".22"/><rect x="88" y="-20" width="8" height="40" rx="4" fill="#C9D6DA"/></g>
    <rect x="566" y="810" width="460" height="22" rx="6" fill="#fff"/><rect x="566" y="826" width="460" height="10" rx="5" fill="#C9D6DA"/><path d="M600 836 l0 40 M990 836 l0 40" stroke="#C9D6DA" stroke-width="10" stroke-linecap="round"/>
    ${shelf.map(sh).join("")}
    <g transform="translate(96 1200)"><rect x="-70" y="-140" width="140" height="18" rx="9" fill="#C9D6DA"/><path d="M-56 -128 H56 V60 Q0 80 -56 60Z" fill="${C.pink}"/><path d="M-56 -70 H56 M-56 -44 H56" stroke="${C.pinkHi}" stroke-width="10"/></g>
    <g transform="translate(1040 1150)"><rect x="-40" y="-8" width="56" height="12" rx="6" fill="#C9D6DA"/><circle cx="0" cy="40" r="40" fill="#fff"/><circle cx="0" cy="40" r="14" fill="#C9D6DA"/><path d="M-40 40 V110 Q-40 120 -30 120 H-6" fill="none" stroke="#fff" stroke-width="12"/></g>
    <g transform="translate(1030 1560)"><rect x="-7" y="-250" width="14" height="210" rx="7" fill="#C98B4E"/><path d="M-50 -30 Q-50 -64 0 -66 Q50 -64 50 -30 L44 0 H-44Z" fill="${C.red}"/><ellipse cx="0" cy="0" rx="46" ry="12" fill="${C.redLo}"/></g>
    ${haze > 0.01 ? `<rect width="1080" height="1920" fill="${C.gas}" opacity="${n2(0.3 * haze)}"/>` : ""}`;
}

// The front porch on a suburban street at golden hour. flutter: wind in the trees. leak: gas from the open front door.
export function porch(t, { flutter = 1, leak = 1 } = {}) {
  const house = (x, y, w, h, body, roof, i) => `<g transform="translate(${x} ${y})"><path d="M${-w / 2 - 30} 0 L0 ${-h * 0.62} L${w / 2 + 30} 0Z" fill="${roof}"/><rect x="${-w / 2}" y="-2" width="${w}" height="${h}" fill="${body}"/>
      ${[[-w * 0.3, h * 0.22], [w * 0.12, h * 0.22]].map(([wx, wy], k) => `<rect x="${n2(wx)}" y="${n2(wy)}" width="${n2(w * 0.2)}" height="${n2(h * 0.26)}" rx="4" fill="#FFE29A" opacity="${n2(0.55 + 0.45 * rnd(i * 3 + k))}"/>`).join("")}
      <rect x="${n2(-w * 0.08)}" y="${n2(h * 0.55)}" width="${n2(w * 0.16)}" height="${n2(h * 0.45)}" fill="${roof}"/><rect x="${n2(w * 0.25)}" y="${n2(-h * 0.45)}" width="${n2(w * 0.1)}" height="${n2(h * 0.25)}" fill="${roof}"/></g>`;
  const tree = (x, y, s, i) => { const a = (2 + 3 * flutter) * Math.sin(t * (1.6 + flutter * 0.8) + i * 1.7); return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-10" width="28" height="200" fill="#4A2F6A"/>
      <g transform="rotate(${n2(a)} 0 0)"><circle cx="-60" cy="-60" r="90" fill="#3E8E5A"/><circle cx="60" cy="-80" r="100" fill="#4FA868"/><circle cx="0" cy="-150" r="100" fill="#5FB86B"/><circle cx="-20" cy="-180" r="40" fill="#8FD98A" opacity=".5"/></g></g>`; };
  let rails = ""; for (let x = 200; x < 1080; x += 62) rails += `<rect x="${x - 9}" y="1330" width="18" height="230" rx="4" fill="#F4F0FF"/><rect x="${x + 5}" y="1330" width="4" height="230" fill="#C9C0EA"/>`;
  return `<rect width="1080" height="1920" fill="url(#gSky)"/><circle cx="800" cy="640" r="330" fill="url(#gSun)"/>
    ${[[160, 420, 1], [520, 330, 0.7], [930, 250, 0.6]].map(([x, y, s], i) => `<g transform="translate(${n2(x + ((t * 14 * (i + 1)) % 200) - 60)} ${y}) scale(${s})" fill="#fff" opacity=".55"><ellipse rx="110" ry="30"/><ellipse cx="-50" cy="-22" rx="56" ry="30"/><ellipse cx="34" cy="-30" rx="70" ry="40"/></g>`).join("")}
    <g opacity=".6">${house(160, 980, 260, 230, "#A86BD8", "#7E4CB8", 1)}${house(560, 960, 300, 250, "#B57BE0", "#7E4CB8", 2)}${house(960, 990, 240, 220, "#A86BD8", "#7E4CB8", 3)}</g>
    <rect x="0" y="1200" width="1080" height="320" fill="url(#gLawn)"/><rect x="0" y="1196" width="1080" height="40" fill="#C9C0EA" opacity=".55"/>
    ${tree(380, 1180, 1.15, 0)}${tree(1010, 1150, 0.95, 1)}
    <g transform="translate(820 1300)"><rect x="-6" y="-120" width="12" height="130" fill="#4A2F6A"/><path d="M-44 -170 H30 Q50 -170 50 -150 V-120 H-44Z" fill="${C.blue}"/><rect x="40" y="-200" width="8" height="50" fill="${C.red}"/><path d="M40 -200 h30 v20 h-30z" fill="${C.red}"/></g>
    <rect x="-20" y="560" width="200" height="960" fill="#E6E0FA"/><rect x="0" y="590" width="150" height="930" fill="#2A1F5C"/>
    <path d="M150 590 L60 610 L60 1500 L150 1520Z" fill="#DCD5F2"/><circle cx="80" cy="1060" r="12" fill="${C.sun}"/>
    ${leak > 0.01 ? gasCloud(70, 1150, 240, t * 1.3, { seed: 14, n: 8, grow: leak }) : ""}
    <g transform="translate(236 640)"><rect x="-24" y="-30" width="48" height="70" rx="12" fill="#2A1F5C"/><rect x="-16" y="-20" width="32" height="50" rx="8" fill="#FFE9A8"/><circle cx="0" cy="5" r="${n2(70 + 6 * Math.sin(t * 3))}" fill="#FFE9A8" opacity=".18"/></g>
    <rect x="0" y="1500" width="1080" height="420" fill="url(#pBoards)"/><rect x="0" y="1500" width="1080" height="420" fill="#2A1F5C" opacity=".25"/>
    ${rails}<rect x="190" y="1300" width="890" height="34" rx="8" fill="#FFFFFF"/><rect x="190" y="1548" width="890" height="22" fill="#E6E0FA"/>
    <rect x="166" y="1240" width="48" height="340" rx="6" fill="#FFFFFF"/><rect x="200" y="1240" width="14" height="340" fill="#C9C0EA"/>
    <g transform="translate(960 1640)"><path d="M-60 -90 H60 L46 0 H-46Z" fill="${C.orange}"/><rect x="-66" y="-102" width="132" height="24" rx="10" fill="#E0622A"/>${[-34, -8, 20, 40].map((x, i) => `<path d="M${x} -100 Q${n2(x - 26 + 8 * Math.sin(t * 2 + i))} -180 ${n2(x + (i - 1.5) * 18 + 10 * Math.sin(t * 2 + i))} ${-230 - i * 12}" fill="none" stroke="#2FA866" stroke-width="16" stroke-linecap="round"/>`).join("")}</g>`;
}
