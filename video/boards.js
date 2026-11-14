// Motion-graphics boards for explainer episodes. Each board is a pure function of where it is in time:
//   board(spec, step, age, total, cfg) -> HTML for a 1920 x 1080 frame
// `step` is how many beats the board has been through, `age` the seconds since this step began, `total`
// the seconds since the board appeared. Earlier steps are drawn finished; the current one animates.
// Text can be Latin or Arabic; nothing here measures text, so labels stay short.
import { bankSet } from "./sets/bank.js";
import { moneySet } from "./sets/money.js";
import { introSet } from "./sets/intro.js";
import { middleSet } from "./sets/middle.js";
import { copySet } from "./sets/copy.js";
import { crisisSet } from "./sets/crisis.js";
import { paperSet } from "./sets/paper.js";
import { ideaSet } from "./sets/idea.js";
import { genesisSet } from "./sets/genesis.js";
import { pizzaSet } from "./sets/pizza.js";
import { vanishSet } from "./sets/vanish.js";
import { dictSet } from "./sets/dict.js";
import { recapSet } from "./sets/recap.js";
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (p) => { p = clamp(p); return p * p * (3 - 2 * p); };
const lerp = (a, b, p) => a + (b - a) * p;
const pop = (a) => (a <= 0 ? 0 : Math.min(1, a / 0.1) * (1 + 0.28 * Math.exp(-a * 11) * Math.cos(a * 17)));
const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const since = (i, step, age) => (i < step ? 99 : i === step ? age : -1);       // seconds since item i came in, or -1
// The palette. `BASE` is the original dark set; a theme (see THEMES below) replaces some of it. The surface tokens
// (row, muted, body, land, cube, stamp) hold colours that used to be written inline, with the same values.
const BASE = { ink: "#05060d", navy: "#11152e", panel: "#1c2250", line: "#7fd4ff", white: "#eef0ff", dim: "#9fb0ff", yellow: "#FFE66D", pink: "#ff4fa3", cyan: "#35c8ff", green: "#58d68d", red: "#ff4654", gold: "#f2b632", paper: "#f3efe4",
  row: "#161b40", rowUp: "#173d2c", rowDown: "#40161c", muted: "#3a4170", body: "#232a63", land: "#27306e", cube: ["#141a44", "#0d1230", "#101638", "#1b2360", "#0a0d24"], cubeGlow: "rgba(53,200,255,.35)",
  stamp: (a) => `rgba(5,6,13,${a})`, text: null };
// Themes, chosen by the storyboard (`"theme": "day"`): the boards' palette, `text` (a bright fill that would be hard to read as
// text on this background maps to a darker ink when it is used for text), and `studio`, CSS variables for the set in studio.html.
// Without a theme nothing changes. Add a theme here and every board and the studio pick it up.
const THEMES = {
  day: { ink: "#14182e", navy: "#ffffff", panel: "#e3ebfa", line: "#4f7fd1", white: "#263259", dim: "#6c7798", yellow: "#ffc63a", pink: "#ef4b97", cyan: "#23a7e4", green: "#2fb26a", red: "#e5384a", gold: "#f2b632", paper: "#fffdf6",
    row: "#f2f6fd", rowUp: "#dcf5e6", rowDown: "#fde1e4", muted: "#c6d2ea", body: "#dfe8f8", land: "#cfe0c9", cube: ["#ffffff", "#e4ecfa", "#eef3fc", "#f7faff", "#d6e1f5"], cubeGlow: "rgba(79,127,209,.18)",
    stamp: (a) => `rgba(255,255,255,${Math.min(0.95, a + 0.3)})`,
    text: { "#ffc63a": "#c2500c", "#23a7e4": "#0c74ad", "#2fb26a": "#1b8048", "#f2b632": "#9a6400", "#ef4b97": "#c81f6b" },
    bg: "radial-gradient(ellipse at 50% 38%,#ffffff,#fbf4e4 55%,#efe3c9 100%)",
    studio: { bg: "#f4ecd9", insert: "radial-gradient(ellipse at 50% 38%,#ffffff,#fbf4e4 55%,#efe3c9 100%)", grid: "rgba(80,90,140,.06)",
      wall0: "#cfe3f6", wall1: "#b7d2ee", wall2: "#9fbfe3", glow: ".35", desk0: "#ffffff", desk1: "#d6deef", front0: "#e6ecf7", front1: "#c9d4ea", front2: "#b4c2df",
      logo: "#263259", tag: "#55628a", shelf: "#9aa9cc", pipdesk: "linear-gradient(#ffffff,#d6deef)", chipBg: "rgba(255,255,255,.94)", chipInk: "#14182e", chipSub: "#3b4870",
      brand: "#263259", brandShadow: "0 2px 0 rgba(255,255,255,.8)", brandSub: "#55628a", vig: "radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(60,40,0,.16) 100%)" } },
};
const themeOf = (t) => (!t ? BASE : typeof t === "object" ? { ...BASE, ...t } : THEMES[t] ? { ...BASE, ...THEMES[t] } : BASE);
let C = BASE;
const tx = (f) => (C.text && C.text[f]) || f;          // the colour a fill becomes when it is used for text
const T = (x, y, text, size, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="${o.font || "Anton"}" font-size="${size}" fill="${tx(o.fill || C.white)}" opacity="${o.opacity ?? 1}" ${o.weight ? `font-weight="${o.weight}"` : ""} style="unicode-bidi:plaintext" ${o.extra || ""}>${esc(text)}</text>`;
const G = (x, y, s, inner, extra = "") => `<g transform="translate(${x} ${y}) scale(${s})" ${extra}>${inner}</g>`;
const svg = (inner, defs = "") => `<svg viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg"><defs><filter id="bglow"><feGaussianBlur stdDeviation="14"/></filter>${defs}</defs>${inner}</svg>`;
const heading = (text, a, y = 150) => (text ? G(960, y, pop(a), T(0, 0, text, 84, { fill: C.yellow })) : "");
const caption = (text, a, y = 890) => (text && a > 0 ? `<g opacity="${clamp(a / 0.25)}" transform="translate(0 ${(1 - ease(a / 0.3)) * 20})">${T(960, y, text, 50, { font: "Elite", fill: C.white })}</g>` : "");

// ---- icons, drawn around (0,0), roughly 200 units tall -------------------------------------------------
const ICON = {
  person: (c = C.cyan) => `<circle cx="0" cy="-52" r="40" fill="${c}"/><path d="M-66 84C-66 6 66 6 66 84Z" fill="${c}"/>`,
  bank: (c = C.white) => `<path d="M-100 -34L0 -96L100 -34Z" fill="${c}"/><rect x="-92" y="-22" width="184" height="16" fill="${c}"/>${[-72, -24, 24, 72].map((x) => `<rect x="${x - 13}" y="2" width="26" height="74" rx="4" fill="${c}"/>`).join("")}<rect x="-104" y="80" width="208" height="20" rx="4" fill="${c}"/>`,
  coin: (c = C.gold, letter = "B") => `<circle r="74" fill="${c}"/><circle r="58" fill="none" stroke="#7a5200" stroke-width="6" opacity=".55"/><text y="30" text-anchor="middle" font-family="Anton" font-size="86" fill="#5d3d00">${letter}</text><path d="M-12 -52v-14M12 -52v-14M-12 52v14M12 52v14" stroke="#5d3d00" stroke-width="9" stroke-linecap="round"/>`,
  cash: () => `<rect x="-100" y="-56" width="200" height="112" rx="12" fill="#3fae6a"/><rect x="-84" y="-40" width="168" height="80" rx="6" fill="none" stroke="#d7ffe6" stroke-width="5" opacity=".7"/><circle r="26" fill="#d7ffe6" opacity=".85"/>`,
  gold: () => `<path d="M-90 50L-60 -40H60L90 50Z" fill="${C.gold}"/><path d="M-60 -40H60L48 -8H-48Z" fill="#ffe08a"/>`,
  fish: () => `<path d="M-90 0C-40 -70 50 -60 80 0C50 60 -40 70 -90 0Z" fill="${C.cyan}"/><path d="M70 0L118 -44V44Z" fill="${C.cyan}"/><circle cx="-48" cy="-10" r="9" fill="${C.ink}"/>`,
  bread: () => `<path d="M-96 44C-120 -30 -60 -70 0 -70C60 -70 120 -30 96 44Z" fill="#d79a4a"/><path d="M-40 -50l12 44M0 -58l12 50M40 -50l12 44" stroke="#8a5a1c" stroke-width="9" stroke-linecap="round"/>`,
  phone: () => `<rect x="-58" y="-100" width="116" height="200" rx="20" fill="${C.white}"/><rect x="-46" y="-80" width="92" height="150" rx="8" fill="${C.panel}"/><text y="10" text-anchor="middle" font-family="Anton" font-size="44" fill="${C.yellow}">100</text><circle cy="84" r="7" fill="${C.panel}"/>`,
  file: (label = "") => `<path d="M-70 -96H30L74 -52V96H-70Z" fill="${C.paper}"/><path d="M30 -96V-52H74Z" fill="#cfc8b4"/><text y="30" text-anchor="middle" font-family="Anton" font-size="46" fill="${C.ink}">${esc(label)}</text>`,
  node: (c = C.cyan) => `<rect x="-58" y="-48" width="116" height="80" rx="10" fill="${c}"/><rect x="-46" y="-36" width="92" height="56" rx="4" fill="${C.navy}"/><path d="M-30 -18h60M-30 -2h44" stroke="${c}" stroke-width="7" stroke-linecap="round"/><rect x="-10" y="32" width="20" height="16" fill="${c}"/><rect x="-36" y="46" width="72" height="10" rx="5" fill="${c}"/>`,
  pizza: () => `<circle r="92" fill="#d79a4a"/><circle r="76" fill="#f4c84a"/>${[[-30, -30], [34, -18], [-8, 34], [40, 40], [-48, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#c8402f"/>`).join("")}<path d="M0 -76V76M-66 -38L66 38M-66 38L66 -38" stroke="#d79a4a" stroke-width="5"/>`,
  key: (c = C.yellow) => `<circle cx="-50" cy="0" r="46" fill="none" stroke="${c}" stroke-width="20"/><path d="M-6 0H96M60 0V34M90 0V26" stroke="${c}" stroke-width="20" stroke-linecap="round"/>`,
  mailbox: (c = C.cyan) => `<rect x="-90" y="-60" width="180" height="120" rx="14" fill="${c}"/><path d="M-90 -46L0 20L90 -46" fill="none" stroke="${C.navy}" stroke-width="12" stroke-linejoin="round"/>`,
  drive: () => `<rect x="-96" y="-66" width="192" height="132" rx="14" fill="#8f96b8"/><circle cx="-10" cy="-4" r="46" fill="#c9cee6"/><circle cx="-10" cy="-4" r="10" fill="#8f96b8"/><path d="M60 46L18 14" stroke="#4d5478" stroke-width="10" stroke-linecap="round"/><rect x="50" y="34" width="34" height="20" rx="5" fill="${C.green}"/>`,
  usb: () => `<rect x="-36" y="-30" width="72" height="130" rx="12" fill="#c9cee6"/><rect x="-26" y="-92" width="52" height="64" rx="4" fill="#8f96b8"/><rect x="-14" y="-78" width="10" height="14" fill="${C.navy}"/><rect x="4" y="-78" width="10" height="14" fill="${C.navy}"/><circle cy="60" r="12" fill="${C.red}"/>`,
  bolt: (c = C.yellow) => `<path d="M20 -100L-50 14H-4L-24 100L56 -22H8Z" fill="${c}"/>`,
  trash: () => `<path d="M-64 -40H64L50 96H-50Z" fill="#8f96b8"/><rect x="-80" y="-66" width="160" height="26" rx="8" fill="#c9cee6"/><rect x="-24" y="-86" width="48" height="24" rx="6" fill="#c9cee6"/><path d="M-26 -14V70M0 -14V70M26 -14V70" stroke="#4d5478" stroke-width="9" stroke-linecap="round"/>`,
  gear: (c = C.line) => `<circle r="56" fill="none" stroke="${c}" stroke-width="26"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((d) => `<rect x="-14" y="-92" width="28" height="34" rx="6" fill="${c}" transform="rotate(${d})"/>`).join("")}`,
  tag: (c = C.yellow) => `<path d="M-96 -20L-20 -96H96V20L20 96Z" fill="${c}" transform="rotate(8)"/><circle cx="52" cy="-52" r="16" fill="${C.navy}"/><text x="-10" y="34" text-anchor="middle" font-family="Anton" font-size="78" fill="${C.ink}" transform="rotate(-37)">$</text>`,
  safe: (c = "#8f96b8") => `<rect x="-92" y="-92" width="184" height="176" rx="16" fill="${c}"/><rect x="-70" y="-70" width="140" height="132" rx="8" fill="#c9cee6"/><circle r="34" fill="none" stroke="#4d5478" stroke-width="12"/><path d="M0 -34V-52M0 34V52M-34 0H-52M34 0H52" stroke="#4d5478" stroke-width="10" stroke-linecap="round"/><rect x="-76" y="84" width="34" height="16" fill="${c}"/><rect x="42" y="84" width="34" height="16" fill="${c}"/>`,
  exchange: (c = C.white) => `<rect x="-100" y="-84" width="200" height="140" rx="14" fill="${c}"/><rect x="-86" y="-70" width="172" height="112" rx="6" fill="${C.navy}"/><path d="M-52 -40V20M-12 -54V6M28 -30V28M64 -50V-4" stroke="${C.dim}" stroke-width="4"/><rect x="-62" y="-26" width="20" height="34" fill="${C.green}"/><rect x="-22" y="-42" width="20" height="30" fill="${C.red}"/><rect x="18" y="-14" width="20" height="30" fill="${C.green}"/><rect x="54" y="-40" width="20" height="24" fill="${C.green}"/><rect x="-14" y="56" width="28" height="24" fill="${c}"/><rect x="-56" y="78" width="112" height="14" rx="7" fill="${c}"/>`,
  noundo: (c = C.white) => `<path d="M-58 20A62 62 0 1 0 -30 -54" fill="none" stroke="${c}" stroke-width="20" stroke-linecap="round"/><path d="M-66 -86L-22 -50L-72 -28Z" fill="${c}"/><path d="M-84 84L84 -84" stroke="${C.red}" stroke-width="24" stroke-linecap="round"/>`,
  popcorn: () => `${[[-48, -58], [-10, -78], [34, -70], [58, -44], [-66, -30], [10, -44], [-26, -42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="27" fill="#fff3c4"/>`).join("")}<path d="M-78 -26H78L58 100H-58Z" fill="#f4f4f4"/><path d="M-52 -26L-40 100H-58L-78 -26ZM-12 -26L-8 100H-26L-34 -26ZM30 -26L24 100H8L10 -26ZM78 -26L58 100H42L54 -26Z" fill="${C.red}"/>`,
  cards: () => `<g transform="rotate(-14)"><rect x="-78" y="-88" width="120" height="170" rx="14" fill="${C.paper}"/><text x="-18" y="26" text-anchor="middle" font-family="Anton" font-size="90" fill="${C.red}">♦</text></g><g transform="rotate(12) translate(34 6)"><rect x="-60" y="-88" width="120" height="170" rx="14" fill="#fff"/><rect x="-60" y="-88" width="120" height="170" rx="14" fill="none" stroke="#cfc8b4" stroke-width="5"/><text y="26" text-anchor="middle" font-family="Anton" font-size="90" fill="${C.ink}">♠</text></g>`,
  crown: (c = C.gold) => `<path d="M-90 60L-104 -50L-46 -2L0 -78L46 -2L104 -50L90 60Z" fill="${c}"/><rect x="-90" y="60" width="180" height="26" rx="8" fill="#ffe08a"/><circle cx="-104" cy="-56" r="13" fill="#ffe08a"/><circle cx="0" cy="-84" r="13" fill="#ffe08a"/><circle cx="104" cy="-56" r="13" fill="#ffe08a"/>`,
  pyramid: (c = C.yellow) => `<path d="M0 -96L104 88H-104Z" fill="${c}"/><path d="M-36 -32H36M-70 28H70" stroke="${C.navy}" stroke-width="9"/>${[[0, -56], [-22, 2], [22, 2], [-48, 62], [0, 62], [48, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${C.navy}"/>`).join("")}`,
  heart: (c = C.pink) => `<path d="M0 84C-120 0 -110 -84 -52 -84C-22 -84 0 -62 0 -40C0 -62 22 -84 52 -84C110 -84 120 0 0 84Z" fill="${c}"/>`,
  headset: (c = C.white) => `<path d="M-72 20V-10A72 72 0 0 1 72 -10V20" fill="none" stroke="${c}" stroke-width="18"/><rect x="-96" y="6" width="44" height="74" rx="16" fill="${c}"/><rect x="52" y="6" width="44" height="74" rx="16" fill="${c}"/><path d="M74 80V92Q74 108 52 108H14" fill="none" stroke="${c}" stroke-width="10"/><rect x="-12" y="96" width="34" height="22" rx="10" fill="${c}"/>`,
  mask: (c = C.cyan) => `<rect x="-100" y="-74" width="200" height="148" rx="16" fill="${C.navy}" stroke="${c}" stroke-width="8"/><circle cx="0" cy="-16" r="30" fill="${c}"/><path d="M-52 62C-52 14 52 14 52 62Z" fill="${c}"/><rect x="-100" y="-30" width="200" height="10" fill="${C.pink}" opacity=".8"/><rect x="-60" y="18" width="150" height="8" fill="${C.pink}" opacity=".8"/><text x="62" y="-40" font-family="Anton" font-size="34" fill="${C.pink}">AI</text>`,
  flag: (c = C.red) => `<rect x="-58" y="-96" width="14" height="192" rx="7" fill="${C.white}"/><path d="M-44 -90H70L40 -46L70 -2H-44Z" fill="${c}"/>`,
  frame: () => `<rect x="-96" y="-84" width="192" height="168" rx="8" fill="#b98a3e"/><rect x="-78" y="-66" width="156" height="132" fill="#27306e"/><circle cx="34" cy="-26" r="18" fill="${C.yellow}"/><path d="M-78 66L-24 -6L14 36L40 12L78 66Z" fill="${C.green}"/>`,
  dog: () => `<path d="M-70 -60L-92 -104L-40 -84ZM70 -60L92 -104L40 -84Z" fill="#c98a3a"/><ellipse cx="0" cy="-10" rx="88" ry="80" fill="#e2a95a"/><ellipse cx="0" cy="26" rx="46" ry="38" fill="#fbe7c4"/><circle cx="-32" cy="-28" r="11" fill="${C.ink}"/><circle cx="32" cy="-28" r="11" fill="${C.ink}"/><ellipse cx="0" cy="8" rx="14" ry="10" fill="${C.ink}"/><path d="M-18 34Q0 50 18 34" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`,
  atom: (c = C.cyan) => `${[0, 60, 120].map((d) => `<ellipse rx="96" ry="34" fill="none" stroke="${c}" stroke-width="9" transform="rotate(${d})"/>`).join("")}<circle r="20" fill="${C.yellow}"/>`,
  lock: (c = C.yellow) => `<path d="M-44 -10V-44A44 44 0 0 1 44 -44V-10" fill="none" stroke="${c}" stroke-width="20"/><rect x="-72" y="-14" width="144" height="110" rx="16" fill="${c}"/><circle cy="30" r="15" fill="${C.navy}"/><rect x="-6" y="34" width="12" height="32" fill="${C.navy}"/>`,
  tower: (c = C.white) => `<path d="M-46 100L0 -56L46 100M-32 52H32M-18 6H18" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cy="-66" r="14" fill="${C.pink}"/><path d="M-34 -100A48 48 0 0 0 -34 -32M34 -100A48 48 0 0 1 34 -32M-58 -116A82 82 0 0 0 -58 -16M58 -116A82 82 0 0 1 58 -16" fill="none" stroke="${C.cyan}" stroke-width="9" stroke-linecap="round"/>`,
  mobile: (c = C.white, screen = C.panel) => `<rect x="-56" y="-100" width="112" height="200" rx="20" fill="${c}"/><rect x="-44" y="-82" width="88" height="152" rx="8" fill="${screen}"/><circle cy="84" r="7" fill="${C.panel}"/><rect x="-14" y="-94" width="28" height="6" rx="3" fill="${C.panel}"/>`,
  sat: (c = C.white) => `<g transform="rotate(-30)"><rect x="-26" y="-34" width="52" height="68" rx="8" fill="${c}"/><rect x="-104" y="-22" width="70" height="44" rx="4" fill="${C.cyan}"/><rect x="34" y="-22" width="70" height="44" rx="4" fill="${C.cyan}"/><path d="M-70 -22V22M70 -22V22" stroke="${C.navy}" stroke-width="5"/><path d="M0 34V58" stroke="${c}" stroke-width="8"/><path d="M-24 62A24 24 0 0 0 24 62Z" fill="${c}"/></g>`,
  ship: (c = C.white) => `<path d="M-104 20H104L78 74H-78Z" fill="${c}"/><rect x="-40" y="-26" width="76" height="46" fill="#c9cee6"/><rect x="-6" y="-70" width="20" height="44" fill="${C.red}"/><path d="M-110 92q18 -16 36 0t36 0t36 0t36 0t36 0t36 0" fill="none" stroke="${C.cyan}" stroke-width="9" stroke-linecap="round"/>`,
  router: (c = C.white) => `<rect x="-96" y="6" width="192" height="64" rx="14" fill="${c}"/><circle cx="-60" cy="38" r="8" fill="${C.green}"/><circle cx="-32" cy="38" r="8" fill="${C.green}"/><circle cx="-4" cy="38" r="8" fill="${C.yellow}"/><path d="M-66 6L-84 -70M66 6L84 -70" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M-22 -40A30 30 0 0 1 22 -40M-42 -64A58 58 0 0 1 42 -64" fill="none" stroke="${C.cyan}" stroke-width="9" stroke-linecap="round"/><circle cy="-18" r="9" fill="${C.cyan}"/>`,
  mic: (c = C.white) => `<rect x="-30" y="-100" width="60" height="118" rx="30" fill="${c}"/><path d="M-56 -8A56 56 0 0 0 56 -8M0 48V84M-36 90H36" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`,
  speaker: (c = C.white) => `<path d="M-90 -30H-48L4 -78V78L-48 30H-90Z" fill="${c}"/><path d="M34 -36A50 50 0 0 1 34 36M58 -66A90 90 0 0 1 58 66" fill="none" stroke="${C.cyan}" stroke-width="12" stroke-linecap="round"/>`,
  camera: (c = C.white) => `<rect x="-96" y="-56" width="150" height="112" rx="16" fill="${c}"/><path d="M54 -18L104 -52V52L54 18Z" fill="${c}"/><circle cx="-22" r="34" fill="${C.navy}"/><circle cx="-22" r="16" fill="${C.cyan}"/>`,
  sim: (c = C.gold) => `<path d="M-64 -92H30L64 -58V92H-64Z" fill="${c}"/><rect x="-36" y="-22" width="72" height="78" rx="10" fill="#7a5200" opacity=".55"/><path d="M-36 6H36M-36 30H36M0 -22V56" stroke="${c}" stroke-width="6"/>`,
  server: (c = "#c9cee6") => `${[-78, -22, 34].map((y) => `<rect x="-88" y="${y}" width="176" height="46" rx="8" fill="${c}"/><circle cx="-62" cy="${y + 23}" r="7" fill="${C.green}"/><circle cx="-40" cy="${y + 23}" r="7" fill="${C.green}"/><path d="M0 ${y + 23}H66" stroke="#4d5478" stroke-width="7" stroke-linecap="round"/>`).join("")}`,
  cloud: (c = C.white) => `<path d="M-74 50A44 44 0 0 1 -70 -36A60 60 0 0 1 42 -52A50 50 0 0 1 78 50Z" fill="${c}"/>`,
  anchor: (c = C.white) => `<circle cy="-76" r="18" fill="none" stroke="${c}" stroke-width="12"/><path d="M0 -58V84M-40 -30H40M-78 26A78 78 0 0 0 78 26" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round"/><path d="M-96 34L-76 4L-56 38ZM96 34L76 4L56 38Z" fill="${c}"/>`,
  book: (c = C.cyan) => `<path d="M-92 -70C-60 -84 -24 -80 0 -62C24 -80 60 -84 92 -70V70C60 56 24 60 0 78C-24 60 -60 56 -92 70Z" fill="${c}"/><path d="M0 -62V78" stroke="${C.navy}" stroke-width="8"/><path d="M-70 -36H-22M-70 -8H-22M-70 20H-22M22 -36H70M22 -8H70M22 20H70" stroke="${C.navy}" stroke-width="7" stroke-linecap="round" opacity=".6"/>`,
  car: (c = C.yellow) => `<path d="M-100 20L-84 -20H-40L-18 -62H50L78 -20H100V40H-100Z" fill="${c}"/><path d="M-30 -22L-12 -50H40L60 -22Z" fill="${C.navy}"/><circle cx="-56" cy="44" r="24" fill="${C.ink}"/><circle cx="56" cy="44" r="24" fill="${C.ink}"/><circle cx="-56" cy="44" r="9" fill="#c9cee6"/><circle cx="56" cy="44" r="9" fill="#c9cee6"/>`,
  laptop: (c = C.white) => `<rect x="-84" y="-70" width="168" height="110" rx="10" fill="${c}"/><rect x="-70" y="-56" width="140" height="82" rx="4" fill="${C.panel}"/><path d="M-110 46H110L96 70H-96Z" fill="${c}"/>`,
  eye: (c = C.white) => `<path d="M-100 0C-60 -62 60 -62 100 0C60 62 -60 62 -100 0Z" fill="${c}"/><circle r="36" fill="${C.cyan}"/><circle r="15" fill="${C.ink}"/>`,
  palm: () => `<path d="M-8 100L-2 -20H12L8 100Z" fill="#8a5a1c"/>${[-150, -110, -70, -30, 10].map((d) => `<path d="M4 -24Q60 -70 104 -30Q60 -52 4 -24Z" fill="${C.green}" transform="rotate(${d} 4 -24)"/>`).join("")}<circle cx="4" cy="-30" r="10" fill="${C.pink}"/>`,
  cable: () => `<circle r="96" fill="#2b2f45"/><circle r="78" fill="#8f96b8"/><circle r="58" fill="#c98a3a"/><circle r="40" fill="#e8e3d3"/>${[[0, 0], [-16, -12], [16, -12], [-16, 12], [16, 12], [0, 22], [0, -24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${C.cyan}"/>`).join("")}`,
  shark: (c = "#8f96b8") => `<path d="M-104 6C-60 -38 30 -40 104 0C40 34 -50 36 -104 6Z" fill="${c}"/><path d="M-10 -34L20 -84L34 -30Z" fill="${c}"/><path d="M-104 6L-128 -34L-118 6L-128 40Z" fill="${c}"/><circle cx="62" cy="-8" r="6" fill="${C.ink}"/><path d="M52 16L62 8L70 18L78 9L86 16" fill="none" stroke="#fff" stroke-width="5"/>`,
  ghost: (c = C.white) => `<circle cx="0" cy="-52" r="44" fill="none" stroke="${c}" stroke-width="8" stroke-dasharray="14 12"/><path d="M-72 90C-72 6 72 6 72 90" fill="none" stroke="${c}" stroke-width="8" stroke-dasharray="14 12"/><text y="-28" text-anchor="middle" font-family="Anton" font-size="64" fill="${c}">?</text>`,
  // ---- added for the language-neutral picture (explain-crypto-01-world) ----
  // a city bus, side on
  bus: (c = C.yellow) => `<rect x="-112" y="-70" width="224" height="120" rx="20" fill="${c}"/>${[-80, -30, 20].map((x) => `<rect x="${x}" y="-52" width="40" height="40" rx="6" fill="${C.panel}"/>`).join("")}<rect x="70" y="-52" width="30" height="88" rx="5" fill="${C.panel}"/><rect x="-112" y="8" width="180" height="10" fill="${C.white}" opacity=".35"/><circle cx="-62" cy="52" r="22" fill="${C.ink}"/><circle cx="62" cy="52" r="22" fill="${C.ink}"/><circle cx="-62" cy="52" r="8" fill="#c9cee6"/><circle cx="62" cy="52" r="8" fill="#c9cee6"/>`,
  // a ticket stub with notches and a perforation, a little bus on it
  ticket: (c = C.pink) => `<path d="M-100 -50H100V-14A14 14 0 0 0 100 14V50H-100V14A14 14 0 0 0 -100 -14Z" fill="${c}"/><path d="M40 -44V44" stroke="#fff" stroke-width="5" stroke-dasharray="8 8"/><g transform="translate(-28 0) scale(.42)" fill="#fff"><rect x="-90" y="-56" width="180" height="96" rx="16"/><circle cx="-50" cy="48" r="18"/><circle cx="50" cy="48" r="18"/></g>`,
  // a wheelbarrow, empty (pile things on it from the board)
  barrow: (c = C.red) => `<path d="M-120 -40H90L60 30H-90Z" fill="${c}"/><path d="M-120 -40H90" stroke="${C.ink}" stroke-width="6" opacity=".25"/><path d="M60 30L130 -10M-70 30L-50 70" stroke="#8a5a1c" stroke-width="11" stroke-linecap="round"/><path d="M-90 30L-120 -40" stroke="#8a5a1c" stroke-width="9"/><circle cx="-20" cy="62" r="30" fill="${C.ink}"/><circle cx="-20" cy="62" r="12" fill="#c9cee6"/>`,
  // a printing press: a frame, two rollers and a sheet coming out
  press: (c = "#8f96b8") => `<rect x="-100" y="-90" width="200" height="170" rx="14" fill="${c}"/><rect x="-80" y="-70" width="160" height="60" rx="8" fill="#c9cee6"/><circle cx="-36" cy="-40" r="22" fill="#4d5478"/><circle cx="36" cy="-40" r="22" fill="#4d5478"/><rect x="-80" y="10" width="160" height="16" rx="6" fill="#4d5478"/><rect x="-110" y="80" width="220" height="20" rx="6" fill="#4d5478"/><circle cx="70" cy="50" r="10" fill="${C.red}"/>`,
  // a glass jar with a lid
  jar: (c = C.line) => `<rect x="-62" y="-104" width="124" height="26" rx="8" fill="#b98a3e"/><path d="M-56 -78H56Q78 -60 78 -20V80Q78 100 58 100H-58Q-78 100 -78 80V-20Q-78 -60 -56 -78Z" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="8"/><path d="M-52 -40V60" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".55"/>`,
  // a sack of salt, tied at the top, a few grains
  salt: () => `<path d="M-70 -50Q-96 60 -66 96H66Q96 60 70 -50Z" fill="#f4f1ea" stroke="#cfc8b4" stroke-width="6"/><path d="M-44 -50L-30 -84H30L44 -50Z" fill="#e2dccd"/><path d="M-50 -54H50" stroke="#b98a3e" stroke-width="10" stroke-linecap="round"/>${[[-20, 110], [10, 116], [36, 108], [-44, 114]].map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="10" fill="#e2dccd" transform="rotate(30 ${x} ${y})"/>`).join("")}`,
  // a scallop shell
  shell: (c = "#ffb38a") => `<path d="M0 70L-96 -10Q-90 -96 0 -100Q90 -96 96 -10Z" fill="${c}"/>${[-60, -30, 0, 30, 60].map((x) => `<path d="M0 70L${x * 1.3} -96" stroke="#c96b3a" stroke-width="6" opacity=".6"/>`).join("")}<path d="M-30 70H30L20 96H-20Z" fill="${c}"/>`,
  // a stone wheel with a hole, the kind one island used as money
  stone: () => `<circle r="96" fill="#a9a49a"/><circle r="96" fill="none" stroke="#7d786e" stroke-width="8"/><circle r="22" fill="${C.ink}" opacity=".7"/><path d="M-50 -60Q-20 -76 20 -70" stroke="#d6d1c6" stroke-width="10" stroke-linecap="round" opacity=".7"/>`,
  // a trusted man: a person in a top hat
  banker: (c = "#8f96b8") => `<circle cx="0" cy="-40" r="38" fill="${c}"/><path d="M-62 92C-62 18 62 18 62 92Z" fill="${c}"/><rect x="-30" y="-122" width="60" height="58" rx="4" fill="${C.ink}"/><rect x="-50" y="-70" width="100" height="12" rx="6" fill="${C.ink}"/><path d="M0 22L-12 50L0 80L12 50Z" fill="${C.red}"/>`,
  // a letter
  envelope: (c = C.white) => `<rect x="-90" y="-58" width="180" height="116" rx="12" fill="${c}"/><path d="M-90 -50L0 14L90 -50" fill="none" stroke="${C.navy}" stroke-width="10" stroke-linejoin="round"/>`,
  // a snail, for something slow
  snail: (c = "#c98a3a") => `<path d="M-110 60H90Q120 60 116 34L100 20Q96 50 70 50H-110Z" fill="#9bc46a"/><circle cx="104" cy="6" r="14" fill="#9bc46a"/><path d="M100 -6L92 -40M112 -6L120 -38" stroke="#9bc46a" stroke-width="6" stroke-linecap="round"/><circle cx="-10" cy="-6" r="62" fill="${c}"/><path d="M-10 -6m-40 0a40 40 0 1 1 40 40a26 26 0 1 1 -26 -26a12 12 0 1 1 12 12" fill="none" stroke="#7a4a14" stroke-width="8" stroke-linecap="round"/>`,
  // a wall calendar page; `label` is what is printed on it (a year, a day)
  calendar: (c = C.red, label = "") => `<rect x="-90" y="-80" width="180" height="170" rx="14" fill="${C.paper}" stroke="#cfc8b4" stroke-width="5"/><rect x="-90" y="-80" width="180" height="50" rx="14" fill="${c}"/><rect x="-90" y="-46" width="180" height="16" fill="${c}"/><rect x="-54" y="-100" width="14" height="40" rx="7" fill="#4d5478"/><rect x="40" y="-100" width="14" height="40" rx="7" fill="#4d5478"/><text y="58" text-anchor="middle" font-family="Anton" font-size="${String(label).length > 2 ? 64 : 90}" fill="${C.ink}">${esc(label)}</text>`,
  // a line chart going down, for a crash
  chartdown: (c = C.red) => `<rect x="-96" y="-86" width="192" height="172" rx="14" fill="${C.paper}"/><path d="M-70 -50L-30 -20L0 -36L34 20L70 50" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 52L76 56L72 28" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`,
  // two pages, one on top of the other: a copy
  dup: (c = C.paper) => `<g transform="translate(-26 -20)"><path d="M-60 -76H30L60 -46V86H-60Z" fill="${c}" opacity=".6"/></g><g transform="translate(26 20)"><path d="M-60 -76H30L60 -46V86H-60Z" fill="${c}"/><path d="M30 -76V-46H60Z" fill="#cfc8b4"/><path d="M-36 -10H36M-36 18H36M-36 46H14" stroke="#b9b2a2" stroke-width="9" stroke-linecap="round"/></g>`,
  // a shield, for whoever guards something
  shield: (c = C.cyan) => `<path d="M0 -100L84 -66V0Q84 64 0 104Q-84 64 -84 0V-66Z" fill="${c}"/><path d="M-36 4L-8 32L42 -22" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`,
  // a pickaxe, for mining
  pickaxe: (c = "#8f96b8") => `<path d="M-70 96L60 -40" stroke="#b98a3e" stroke-width="20" stroke-linecap="round"/><path d="M-30 -96Q60 -100 104 -10Q60 -60 6 -64Z" fill="${c}"/><path d="M6 -64L40 -30" stroke="${c}" stroke-width="26" stroke-linecap="round"/>`,
  // a paper with lines and a pen: a rule book being written
  rules: (c = C.paper) => `<rect x="-76" y="-96" width="140" height="190" rx="10" fill="${c}" stroke="#cfc8b4" stroke-width="5"/><path d="M-50 -56H38M-50 -24H38M-50 8H38M-50 40H6" stroke="#b9b2a2" stroke-width="9" stroke-linecap="round"/><path d="M20 70L92 -26L110 -12L38 84L14 90Z" fill="${C.pink}"/>`,

};
const icon = (name, ...a) => (ICON[name] || ICON.person)(...a);
const labelled = (x, y, s, name, label, a, o = {}) => G(x, y, s * pop(a), `${o.glow ? `<circle r="130" fill="${o.glow}" opacity=".25" filter="url(#bglow)"/>` : ""}${icon(name, ...(o.args || []))}`, `opacity="${o.opacity ?? 1}"`)
  + (label && a > 0.1 ? `<g opacity="${clamp((a - 0.1) / 0.2) * (o.opacity ?? 1)}">${T(x, y + 150 * s + 30, label, 46, { font: "Elite", fill: o.labelFill || C.white })}</g>` : "");

// A red cross drawn over (x, y) stroke by stroke, `a` seconds after it starts.
const strike = (x, y, a, r = 110) => (a <= 0 ? "" : `<path d="M${x - r} ${y - r}L${x - r + 2 * r * ease(a / 0.25)} ${y - r + 2 * r * ease(a / 0.25)}" stroke="${C.red}" stroke-width="${r / 5}" stroke-linecap="round"/>`
  + (a > 0.2 ? `<path d="M${x + r} ${y - r}L${x + r - 2 * r * ease((a - 0.2) / 0.25)} ${y - r + 2 * r * ease((a - 0.2) / 0.25)}" stroke="${C.red}" stroke-width="${r / 5}" stroke-linecap="round"/>` : ""));
// A stand-in fingerprint: not a real hash, just something that looks like one and changes completely with its input.
const rnd = (n) => { let t = (n + 0x6D2B79F5) | 0; t = Math.imul(t ^ (t >>> 15), 1 | t); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const fake = (text) => { let h = 2166136261; for (const ch of String(text)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } let out = ""; for (let i = 0; i < 16; i++) out += "0123456789abcdef"[Math.floor(rnd(h + i * 97) * 16)]; return out; };

// ---- richer motion (opt-in per board with `"rich": true`) ---------------------------------------------------------
// A living backdrop behind a board: two soft lights drifting, dust rising, a slow sweep of light.
const ambient = (total) => { let dots = "";
  for (let i = 0; i < 34; i++) { const sp = 14 + rnd(i * 5) * 26, y = 1080 - ((total * sp + rnd(i * 5 + 1) * 1080) % 1140), x = rnd(i * 5 + 2) * 1920 + 30 * Math.sin(total * 0.5 + i), r = 2 + rnd(i * 5 + 3) * 3.5;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${i % 3 ? C.line : C.yellow}" opacity="${(0.12 + 0.2 * Math.abs(Math.sin(total * 1.3 + i))).toFixed(2)}"/>`; }
  return `<svg viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0"><defs><filter id="ambl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="90"/></filter></defs>
    <circle cx="${400 + 160 * Math.sin(total * 0.21)}" cy="${330 + 90 * Math.cos(total * 0.17)}" r="300" fill="${C.cyan}" opacity=".13" filter="url(#ambl)"/><circle cx="${1500 + 140 * Math.cos(total * 0.19)}" cy="${760 + 100 * Math.sin(total * 0.23)}" r="320" fill="${C.pink}" opacity=".12" filter="url(#ambl)"/>${dots}</svg>`; };
// The bank's ledger with weight and light: a panel that settles in, rows that slide, a coin that arcs with a trail and
// lands with a burst, and amounts that roll.  Same spec as `ledger`.
function richLedger(s, step, age, total) {
  const rows = s.rows.map((r) => ({ ...r })), W = 1180, x = 960 - W / 2, y0 = 300, rh = 156, ops = s.ops || [], n = rows.length, H = n * rh + 40, bob = 5 * Math.sin(total * 1.1);
  let mv = null; const vel = rows.map(() => 0);
  ops.forEach((op, k) => { const a = since(k + 1, step, age); if (a < 0) return; const p = ease((a - 1.4) / 0.5), q = ease((a - 0.15) / 0.5);
    rows[op.from].amount -= op.amount * q; rows[op.to].amount += op.amount * p; vel[op.from] = q > 0 && q < 1 ? 1 : 0; vel[op.to] = p > 0 && p < 1 ? 1 : 0; if (a < 3) mv = { op, a }; });
  const enter = step > 0 ? 1 : back01(total / 0.55), rowY = (i) => y0 + 20 + i * rh;
  const digits = (cx, cy, v, fill, moving) => { const t = Math.round(v).toLocaleString("en");
    return (moving ? `<g opacity=".28">${T(cx, cy - 46, Math.round(v + 3).toLocaleString("en"), 96, { anchor: "start", fill })}${T(cx, cy + 46, Math.round(v - 3).toLocaleString("en"), 96, { anchor: "start", fill })}</g>` : "") + T(cx, cy + (moving ? 5 * Math.sin(total * 40) : 0), t, 96, { anchor: "start", fill }); };
  const body = rows.map((r, i) => { const a = step > 0 ? 9 : total - 0.25 - i * 0.14; if (a <= 0) return ""; const y = rowY(i), slide = (1 - back01(a / 0.45)) * 220, from = mv && mv.op.from === i, to = mv && mv.op.to === i;
    const flash = from ? Math.exp(-Math.max(0, mv.a - 0.15) * 2.2) : to ? Math.exp(-Math.max(0, mv.a - 1.45) * 2.2) * (mv.a > 1.4 ? 1 : 0) : 0, tint = from ? C.red : C.green;
    return `<g transform="translate(${slide} 0)" opacity="${clamp(a / 0.2)}"><rect x="${x + 26}" y="${y}" width="${W - 52}" height="${rh - 22}" rx="22" fill="${C.row}"/><rect x="${x + 26}" y="${y}" width="${W - 52}" height="${rh - 22}" rx="22" fill="${tint}" opacity="${(0.32 * flash).toFixed(3)}"/>
      <rect x="${x + 26}" y="${y}" width="${W - 52}" height="${(rh - 22) / 2}" rx="22" fill="#fff" opacity=".035"/>
      <circle cx="${x + W - 110}" cy="${y + 67}" r="44" fill="${r.color || [C.cyan, C.pink, C.green][i % 3]}"/><circle cx="${x + W - 110}" cy="${y + 54}" r="15" fill="${C.ink}" opacity=".55"/><path d="M${x + W - 136} ${y + 96}c0 -30 52 -30 52 0z" fill="${C.ink}" opacity=".55"/>
      ${r.color ? "" : T(x + W - 180, y + 92, r.name, 70, { anchor: "end", font: "Elite" })}${digits(x + 80, y + 100, r.amount, flash > 0.25 ? tint : C.yellow, vel[i] > 0)}</g>`; }).join("");
  let fx = "";
  if (mv) { const { op, a } = mv, ya = rowY(op.from) + 67, yb = rowY(op.to) + 67, sx = x + 40, bx = x - 210;
    const at = (p) => { const u = 1 - p; return [u * u * u * sx + 3 * u * u * p * bx + 3 * u * p * p * bx + p * p * p * sx, u * u * u * ya + 3 * u * u * p * ya + 3 * u * p * p * yb + p * p * p * yb]; };
    const p = ease((a - 0.2) / 1.2);
    fx += `<path d="M${sx} ${ya}C${bx} ${ya} ${bx} ${yb} ${sx} ${yb}" fill="none" stroke="${C.line}" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round" opacity="${(0.55 * (1 - clamp((a - 1.6) / 0.6))).toFixed(2)}" stroke-dashoffset="${-total * 60}"/>`;
    if (a > 0.2 && p < 1) { for (let k = 9; k >= 1; k--) { const [tx2, ty2] = at(Math.max(0, p - k * 0.035)); fx += `<circle cx="${tx2}" cy="${ty2}" r="${26 - k * 2.2}" fill="${C.gold}" opacity="${(0.34 - k * 0.032).toFixed(3)}"/>`; }
      const [cx, cy] = at(p); fx += `<circle cx="${cx}" cy="${cy}" r="60" fill="${C.gold}" opacity=".3" filter="url(#bglow)"/>${G(cx, cy, 0.62 + 0.12 * Math.sin(Math.PI * p), `<g transform="rotate(${p * 540})">${icon("coin")}</g>`)}`; }
    const b = a - 1.4; if (b > 0 && b < 0.6) { const [cx, cy] = at(1); for (let k = 0; k < 12; k++) { const ang = k * Math.PI / 6, r1 = 30 + b * 200, r2 = r1 + 34 * (1 - b / 0.6); fx += `<path d="M${cx + Math.cos(ang) * r1} ${cy + Math.sin(ang) * r1}L${cx + Math.cos(ang) * r2} ${cy + Math.sin(ang) * r2}" stroke="${C.yellow}" stroke-width="7" stroke-linecap="round" opacity="${(1 - b / 0.6).toFixed(2)}"/>`; } }
    const badge = (t0, yy, text, col) => { const u = a - t0; return u > 0 && u < 1.5 ? `<g transform="translate(${x + 470} ${yy - 10 - 70 * ease(u / 1.5)}) scale(${back01(u / 0.3)})" opacity="${(1 - clamp((u - 0.9) / 0.6)).toFixed(2)}"><rect x="-96" y="-44" width="192" height="88" rx="44" fill="${col}"/>${T(0, 24, text, 62, { fill: "#fff" })}</g>` : ""; };
    fx += badge(0.2, ya, "−" + op.amount, C.red) + badge(1.45, yb, "+" + op.amount, C.green); }
  const sweepX = ((total * 260) % 2600) - 500;
  return `<div style="position:absolute;inset:0">${ambient(total)}${svg(`${heading(s.title, 1, 170)}<g transform="translate(960 ${540 + bob}) scale(${(0.7 + 0.3 * enter) * (1 + 0.02 * ease(total / 10))}) translate(-960 -540)" opacity="${clamp(total / 0.2)}">
      <rect x="${x + 14}" y="${y0 + 26}" width="${W}" height="${H}" rx="34" fill="#000" opacity=".35" filter="url(#bglow)"/>
      <rect x="${x}" y="${y0}" width="${W}" height="${H}" rx="34" fill="${C.navy}" stroke="${C.line}" stroke-opacity=".55" stroke-width="4"/>
      <clipPath id="rlc"><rect x="${x}" y="${y0}" width="${W}" height="${H}" rx="34"/></clipPath><g clip-path="url(#rlc)"><path d="M${sweepX} ${y0}l160 0l-220 ${H}l-160 0z" fill="#fff" opacity=".05"/></g>
      ${body}${fx}</g>${caption((s.captions || [])[step], age, 940)}`).replace("<svg ", '<svg style="position:absolute;left:0;top:0" ')}</div>`;
}
const back01 = (p) => { p = clamp(p); const c = 1.70158; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };

const BOARDS = {
  // A name and a line under it, for openings.
  titlecard(s, step, age, total) {
    return svg(`<g transform="translate(960 470) scale(${pop(total)})">${T(0, -150, s.kicker, 56, { font: "Elite", fill: C.dim })}${T(0, 0, s.title, 190, { fill: C.yellow })}</g>
      <rect x="${960 - 300 * ease((total - 0.3) / 0.5)}" y="540" width="${600 * ease((total - 0.3) / 0.5)}" height="10" rx="5" fill="${C.pink}"/>
      <g opacity="${clamp((total - 0.5) / 0.3)}">${T(960, 650, s.sub, 70, { fill: C.white })}</g>`);
  },
  // Things in a row, one per step, joined by arrows: barter, gold, paper, numbers.
  steps(s, step, age) {
    const n = s.items.length, x0 = 960 - (n - 1) * 190 * (n > 4 ? 0.9 : n <= 2 ? 1.9 : 1.15), dx = n > 1 ? (960 - x0) * 2 / (n - 1) : 0;
    const body = s.items.map((it, i) => { const a = since(i, step, age); if (a < 0) return ""; const x = x0 + i * dx, now = i === Math.min(step, n - 1);
      return (i ? `<path d="M${x - dx + 150} 480H${x - 150}" stroke="${C.line}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${dx}" stroke-dashoffset="${dx * (1 - ease(a / 0.4))}" opacity=".7"/><path d="M${x - 148} 480l-22 -16v32z" fill="${C.line}" opacity="${0.7 * clamp(a / 0.4)}"/>` : "")
        + labelled(x, 480, now ? 1.5 : 1.2, it.icon, it.label, a, { glow: now ? C.yellow : null, opacity: now ? 1 : 0.6, args: it.args })
        + (it.sub && a > 0.3 ? `<g opacity="${clamp((a - 0.3) / 0.3) * (now ? 1 : 0.55)}">${T(x, 850, it.sub, 42, { font: "Elite", fill: C.dim })}</g>` : ""); }).join("");
    return svg(heading(s.title, 1) + body + caption((s.captions || [])[step], age));
  },
  // A page of names and balances. Each step after the first moves an amount from one row to another.
  // A row with `color` shows a person in that colour instead of its name.
  ledger(s, step, age, total) {
    if (s.rich) return richLedger(s, step, age, total);
    const rows = s.rows.map((r) => ({ ...r })), W = 1240, x = 960 - W / 2, y0 = 270, rh = 150, ops = s.ops || [];
    let moving = null;
    ops.forEach((op, k) => { const a = since(k + 1, step, age); if (a < 0) return; const p = ease(a / 0.9);
      rows[op.from].amount -= op.amount * p; rows[op.to].amount += op.amount * p; if (a < 1.6) moving = { op, a }; });
    const body = rows.map((r, i) => { const a = step > 0 ? 9 : age - i * 0.18, y = y0 + i * rh, hit = moving && (moving.op.from === i || moving.op.to === i), up = moving && moving.op.to === i;
      return a <= 0 ? "" : `<g opacity="${clamp(a / 0.2)}"><rect x="${x + 30}" y="${y + 10}" width="${W - 60}" height="${rh - 20}" rx="14" fill="${hit ? (up ? C.rowUp : C.rowDown) : C.row}"/>
        ${r.color ? G(x + W - 130, y + 82, 0.5, icon("person", r.color)) : T(x + W - 80, y + 98, r.name, 76, { anchor: "end", font: "Elite" })}${T(x + 90, y + 104, Math.round(r.amount).toLocaleString("en"), 92, { anchor: "start", fill: hit ? (up ? C.green : C.red) : C.yellow })}</g>`; }).join("");
    const arrow = moving ? (() => { const { op, a } = moving, ya = y0 + op.from * rh + 75, yb = y0 + op.to * rh + 75, p = ease(a / 0.9), cx = x - 110, y = lerp(ya, yb, p);
      return `<path d="M${x + 20} ${ya}C${cx} ${ya} ${cx} ${yb} ${x + 20} ${yb}" fill="none" stroke="${C.line}" stroke-width="6" stroke-dasharray="12 12" opacity=".6"/>${G(x - 50 - 36 * Math.sin(Math.PI * p), y, 0.7, icon("coin"))}`; })() : "";
    return svg(`${heading(s.title, 1)}<rect x="${x}" y="${y0 - 30}" width="${W}" height="${rows.length * rh + 60}" rx="26" fill="${C.navy}" stroke="${C.line}" stroke-opacity=".35" stroke-width="4"/>
      ${body}${arrow}${caption((s.captions || [])[step], age, Math.min(890, y0 + rows.length * rh + 110))}`);
  },
  // People and a go-between. Each step is a move of a coin, a set of badges on someone, or a cross through them.
  flow(s, step, age) {
    const n = s.actors.length, xs = s.actors.map((_, i) => 960 + (i - (n - 1) / 2) * (n > 2 ? 620 : 900)), y = 540; let extra = "";
    const crossed = new Set();
    s.sequence.forEach((q, k) => { const a = since(k + 1, step, age); if (a < 0) return;
      if (q.move) { const [f, t] = q.move, p = ease(a / (q.slow ? 1.8 : 0.9)), x = lerp(xs[f], xs[t], p), yy = y - 250 - 66 * Math.sin(Math.PI * p);
        extra += `<path d="M${xs[f]} ${y - 230}Q${(xs[f] + xs[t]) / 2} ${y - 390} ${xs[t]} ${y - 230}" fill="none" stroke="${C.line}" stroke-width="6" stroke-dasharray="14 14" opacity=".5"/>`;
        if (a < (q.slow ? 2.6 : 1.5)) extra += G(x, yy, 0.72, icon(q.token || "coin")) + (q.label && a > 0.2 ? T((xs[f] + xs[t]) / 2, y - 190, q.label, 46, { font: "Elite", fill: C.yellow }) : ""); }
      if (q.badges) q.badges.forEach((b, j) => { const ba = a - j * (q.every ?? 0.45); if (ba <= 0) return; const bx = xs[q.at] + (j - (q.badges.length - 1) / 2) * 350, by = y + 330;
        extra += G(bx, by, pop(ba), `<rect x="-160" y="-44" width="320" height="88" rx="44" fill="${C.red}"/>${T(0, 20, b, 54, { fill: "#fff" })}`); });
      if (q.cross !== undefined) { crossed.add(q.cross); const p = ease(a / 0.35), cx = xs[q.cross];
        extra += `<path d="M${cx - 130} ${y - 130}L${cx - 130 + 260 * p} ${y - 130 + 260 * p}" stroke="${C.red}" stroke-width="26" stroke-linecap="round"/>${a > 0.25 ? `<path d="M${cx + 130} ${y - 130}L${cx + 130 - 260 * ease((a - 0.25) / 0.35)} ${y - 130 + 260 * ease((a - 0.25) / 0.35)}" stroke="${C.red}" stroke-width="26" stroke-linecap="round"/>` : ""}`; }
    });
    const actors = s.actors.map((ac, i) => labelled(xs[i], y, ac.big ? 1.6 : 1.3, ac.icon, ac.label, step > 0 ? 9 : age - i * 0.2, { args: ac.args, opacity: crossed.has(i) ? 0.35 : 1 })).join("");
    return svg(heading(s.title, 1) + actors + extra + caption((s.captions || [])[step], age));
  },
  // A digital thing copies itself; then two people each hold "the only one".
  copy(s, step, age) {
    let body = "";
    if (step === 0) body = labelled(960, 480, 1.3 * (1 + 0.03 * Math.sin(age * 5)), "file", "", age, { args: [s.file || "💰"] }) + (age > 0.2 ? T(960, 760, s.name || "", 54, { font: "Elite", fill: C.dim }) : "");
    else if (step === 1) { const k = Math.min(4, 1 + Math.floor(age / 0.35)), m = 2 ** k;
      for (let i = 0; i < m; i++) { const col = i % 8, row = Math.floor(i / 8), cols = Math.min(m, 8), a = age - Math.floor(Math.log2(i + 1)) * 0.35;
        body += G(960 + (col - (cols - 1) / 2) * 200, 430 + row * 250 - (m > 8 ? 60 : 0), 0.8 * pop(a), icon("file", s.file || "")); }
      body += G(960, 850, pop(age), `<rect x="-250" y="-46" width="230" height="92" rx="14" fill="${C.panel}" stroke="${C.line}" stroke-width="4"/>${T(-135, 20, "COPY", 54)}<rect x="20" y="-46" width="230" height="92" rx="14" fill="${C.panel}" stroke="${C.line}" stroke-width="4"/>${T(135, 20, "PASTE", 54)}`); }
    else { const p = ease(age / 0.8);
      body = labelled(960, 400, 1, "person", s.me, 9) + labelled(380, 620, 1.1, "person", s.a, 9, { args: [C.pink] }) + labelled(1540, 620, 1.1, "person", s.b, 9, { args: [C.green] })
        + G(lerp(960, 380, p), lerp(300, 410, p) - 40 * Math.sin(Math.PI * p), 0.7, icon("file", s.file || "")) + G(lerp(960, 1540, p), lerp(300, 410, p) - 40 * Math.sin(Math.PI * p), 0.7, icon("file", s.file || ""))
        + (age > 0.9 ? G(960, 830, pop(age - 0.9), `<g transform="rotate(-5)"><rect x="-430" y="-80" width="860" height="160" rx="20" fill="${C.stamp(0.5)}" stroke="${C.red}" stroke-width="12"/>${T(0, 38, s.warn, 110, { fill: C.red })}</g>`) : ""); }
    return svg(heading(s.title, 1) + body + caption((s.captions || [])[step], age, 900));
  },
  // A line chart that draws itself, then a stamp across it.
  chart(s, step, age, total) {
    const pts = s.points, n = pts.length, X = (i) => 300 + i * (1320 / (n - 1)), lo = Math.min(...pts), hi = Math.max(...pts), Y = (v) => 800 - (v - lo) / (hi - lo) * 480;
    const p = ease(total / (s.draw || 2.4)), last = (n - 1) * p, k = Math.floor(last), f = last - k;
    const seen = pts.slice(0, k + 1).map((v, i) => `${X(i)} ${Y(v)}`); if (k < n - 1) seen.push(`${lerp(X(k), X(k + 1), f)} ${lerp(Y(pts[k]), Y(pts[k + 1]), f)}`);
    const [ex, ey] = seen[seen.length - 1].split(" ").map(Number);
    return svg(`${heading(s.title, 1)}<path d="M300 300V800H1620" fill="none" stroke="${C.line}" stroke-opacity=".5" stroke-width="5"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M300 ${420 + i * 120}H1620" stroke="${C.line}" stroke-opacity=".12" stroke-width="3"/>`).join("")}
      <path d="M${seen.join("L")}" fill="none" stroke="${s.color || C.red}" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${ex}" cy="${ey}" r="16" fill="${s.color || C.red}"/>
      ${(s.labels || []).map((l) => (last >= l.at ? `<g opacity="${clamp((last - l.at) / 0.6)}">${T(X(l.at), Y(pts[l.at]) - 40, l.text, 44, { font: "Elite" })}${l.below ? T(X(l.at), 856, l.below, 40, { font: "Elite", fill: C.dim }) : ""}</g>` : "")).join("")}
      ${step >= 1 && s.stamp ? G(1180, 440, pop(since(1, step, age)), `<g transform="rotate(-8)"><rect x="-330" y="-84" width="660" height="168" rx="20" fill="${C.stamp(0.55)}" stroke="${C.red}" stroke-width="12"/>${T(0, 38, s.stamp, 104, { fill: C.red })}</g>`) : ""}
      ${caption((s.captions || [])[step], age)}`);
  },
  // A paper: its title, a date stamped on it, and whoever wrote it.
  doc(s, step, age, total) {
    const inA = ease(total / 0.5), typed = s.title.slice(0, Math.floor(clamp((total - 0.3) / 1.2) * s.title.length));
    const lines = Array.from({ length: 9 }, (_, i) => `<rect x="-250" y="${-60 + i * 44}" width="${i % 4 === 3 ? 320 : 500}" height="14" rx="7" fill="#b9b2a2"/>`).join("");
    const a1 = since(1, step, age), a2 = since(2, step, age);
    return svg(`<g transform="translate(${lerp(960, 720, ease(a2 / 0.5))} ${540 + (1 - inA) * 700}) rotate(${-4 + (1 - inA) * 10})"><rect x="-330" y="-430" width="660" height="860" rx="10" fill="${C.paper}"/><rect x="-330" y="-430" width="660" height="860" rx="10" fill="none" stroke="#cfc8b4" stroke-width="6"/>
        <text x="0" y="-320" text-anchor="middle" font-family="Serif, Georgia, serif" font-size="46" fill="${C.ink}">${esc(typed.split("|")[0])}</text><text x="0" y="-262" text-anchor="middle" font-family="Serif, Georgia, serif" font-size="46" fill="${C.ink}">${esc(typed.split("|")[1] || "")}</text>
        <text x="0" y="-190" text-anchor="middle" font-family="Elite" font-size="30" fill="#5b5648" opacity="${clamp((total - 1.4) / 0.3)}">${esc(s.author)}</text>${lines}
        ${a1 > 0 ? `<g transform="translate(150 300) rotate(-12) scale(${pop(a1)})"><rect x="-170" y="-50" width="340" height="100" rx="12" fill="none" stroke="${C.red}" stroke-width="9"/><text y="20" text-anchor="middle" font-family="Anton" font-size="58" fill="${C.red}">${esc(s.date)}</text></g>` : ""}</g>
      ${a2 > 0 ? labelled(1380, 480, 1.5, "ghost", s.who, a2, { labelFill: C.yellow }) : ""}${caption((s.captions || [])[step], age, 900)}`);
  },
  // One ledger becomes many: a slowly turning globe of machines that all hold the same page.
  //   step 0 one big ledger   1 it spreads to every node   2 a payment ripples through   3 a cheat is outvoted
  network(s, step, age, total) {
    const N = s.n || 34, R = 330, cx = 960, cy = 520, rot = total * 0.22, pts = [];
    for (let i = 0; i < N; i++) { const yy = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - yy * yy), th = i * 2.399963 + rot;
      pts.push({ i, x: Math.cos(th) * r, y: yy, z: Math.sin(th) * r }); }
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), src = pts[3], cheat = pts[s.cheat ?? 11];
    const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z);
    let links = "";
    if (a1 > 0.6) for (const p of pts) for (const q of pts) if (p.i < q.i && dist(p, q) < 0.62) links += `<path d="M${cx + p.x * R * 1.9} ${cy + p.y * R}L${cx + q.x * R * 1.9} ${cy + q.y * R}" stroke="${C.line}" stroke-width="2.5" opacity="${0.1 + 0.12 * (p.z + q.z + 2) / 4}"/>`;
    const nodes = [...pts].sort((p, q) => p.z - q.z).map((p) => { const a = a1 < 0 ? -1 : a1 - 0.4 - p.i * 0.03; if (a <= 0) return "";
      const depth = (p.z + 1) / 2, sc = 0.34 + 0.34 * depth; let col = C.cyan, shake = 0, mark = "";
      if (a2 > 0) { const w = a2 * 1.6 - dist(p, src); if (w > 0 && w < 0.5) col = C.yellow; else if (w >= 0.5) col = C.green; }
      if (a3 > 0) { col = C.green; if (p.i === cheat.i) { col = a3 < 2.2 ? C.red : C.green; shake = a3 < 2.2 ? 6 * Math.sin(a3 * 40) : 0; mark = a3 > 0.2 && a3 < 2.2 ? "✗" : ""; }
        else if (dist(p, cheat) < 0.7 && a3 > 0.7 && a3 < 2.2) mark = "!"; }
      return G(cx + p.x * R * 1.9 + shake, cy + p.y * R, sc * pop(a), icon("node", col) + (mark ? `<text y="-70" text-anchor="middle" font-family="Anton" font-size="90" fill="${mark === "✗" ? C.red : C.yellow}">${mark}</text>` : ""), `opacity="${0.45 + 0.55 * depth}"`); }).join("");
    const big = a1 < 0.9 ? G(cx, cy, (step === 0 ? pop(total) : 1 - ease(a1 / 0.6)) * 2.6, icon(step === 0 ? "bank" : "node", step === 0 ? C.white : C.cyan)) : "";
    return svg(heading(s.title, 1) + links + nodes + big + caption((s.captions || [])[step], age, 905));
  },
  // The first page of the ledger as a solid block, turning, with a message set into its face.
  block(s, step, age, total) {
    const rx = 12, S = 420;
    const turn = step >= 1 ? lerp(-28, -4, step > 1 ? 1 : ease(age / 0.8)) + 4 * Math.sin(total * 0.6) : -28 + 9 * Math.sin(total * 0.6);
    const face = (tf, bg, inner = "") => `<div style="position:absolute;left:${-S / 2}px;top:${-S / 2}px;width:${S}px;height:${S}px;transform:${tf};background:${bg};border:6px solid ${C.line};border-radius:18px;box-shadow:inset 0 0 60px ${C.cubeGlow};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px;text-align:center">${inner}</div>`;
    const a1 = since(1, step, age), text = s.message || "", shown = a1 > 0 ? text.slice(0, Math.floor(clamp(a1 / 2.2) * text.length)) : "";
    const front = `<div style="font-family:Anton;font-size:44px;color:${tx(C.yellow)};letter-spacing:.06em">${esc(s.label)}</div><div style="font-family:Elite;font-size:27px;line-height:1.3;color:${C.white};margin-top:18px;min-height:150px;direction:ltr">${esc(shown)}</div><div style="font-family:Anton;font-size:34px;color:${tx(C.pink)};margin-top:10px">${esc(s.date)}</div>`;
    const scale = pop(total) * (step >= 1 ? 1.25 : 1);
    return `<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;perspective:1800px">${svg(heading(s.title, 1) + `<ellipse cx="960" cy="860" rx="${300 * scale}" ry="34" fill="${C.cyan}" opacity=".25" filter="url(#bglow)"/>` + caption((s.captions || [])[step], age, 905)).replace("<svg ", '<svg style="position:absolute;left:0;top:0" ')}
      <div style="position:absolute;left:960px;top:540px;transform-style:preserve-3d;transform:scale(${scale}) rotateX(${-rx}deg) rotateY(${turn}deg)">
        ${face(`translateZ(${S / 2}px)`, C.cube[0], front)}${face(`rotateY(180deg) translateZ(${S / 2}px)`, C.cube[1])}${face(`rotateY(90deg) translateZ(${S / 2}px)`, C.cube[2])}${face(`rotateY(-90deg) translateZ(${S / 2}px)`, C.cube[2])}${face(`rotateX(90deg) translateZ(${S / 2}px)`, C.cube[3])}${face(`rotateX(-90deg) translateZ(${S / 2}px)`, C.cube[4])}
      </div></div>`;
  },
  // A big number that counts, what it bought, and what that is worth now.
  counter(s, step, age, total) {
    const v = Math.round(s.to * ease(total / (s.time || 1.4))), a1 = since(1, step, age), a2 = since(2, step, age);
    const items = Array.from({ length: s.count || 0 }, (_, i) => G(960 + (i - (s.count - 1) / 2) * 280, s.title ? 700 : 650, 1.1 * pop(a1 - i * 0.2), icon(s.icon))).join("");
    return svg(`${heading(s.title, 1)}${G(960, step >= 1 ? (s.title ? 330 : 250) : 520, pop(total) * (step >= 1 ? 0.72 : 1), T(0, 60, v.toLocaleString("en"), 240, { fill: C.yellow }) + T(0, 150, s.unit, 70, { fill: C.gold }))}
      ${a1 > 0 ? T(960, s.title ? 545 : 480, "=", 100, { fill: C.white, opacity: clamp(a1 / 0.2) }) + items.replaceAll("translate(", "translate(").replace(/, 640\)/g, ", 640)") : ""}
      ${a2 > 0 ? G(960, 880, pop(a2), `<rect x="-640" y="-70" width="1280" height="140" rx="24" fill="${C.panel}" stroke="${C.yellow}" stroke-width="5"/>${T(0, 26, s.now, 68, { fill: C.yellow })}`) : caption((s.captions || [])[step], age, 900)}`);
  },
  // Someone nobody can name: an outline, what they said, then gone, and what they left behind.
  person(s, step, age, total) {
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), fade = a2 > 0 ? 1 - 0.85 * ease(a2 / 1.2) : 1;
    return svg(`${heading(s.title, 1)}${G(640, 540, 2.1 * pop(total), icon("ghost", C.white), `opacity="${fade}"`)}<g opacity="${fade}">${T(640, 900, s.name, 64, { fill: C.yellow })}</g>
      ${a1 > 0 ? G(1280, 430, pop(a1), `<path d="M-330 -130H330Q360 -130 360 -100V100Q360 130 330 130H-200L-290 200L-270 130H-330Q-360 130 -360 100V-100Q-360 -130 -330 -130Z" fill="${C.paper}"/>${(s.quote || "").split("|").map((l, i, arr) => T(0, 12 + (i - (arr.length - 1) / 2) * 64, l, 50, { font: "Elite", fill: C.ink })).join("")}`, `opacity="${fade}"`) : ""}
      ${a3 > 0 ? G(1280, 600, pop(a3), `${[-150, -50, 50, 150].map((x, i) => G(x, 40 - (i % 2) * 30, 0.6, icon("coin"))).join("")}${T(0, 250, s.stat, 110, { fill: C.yellow })}${T(0, 320, s.statSub, 44, { font: "Elite", fill: C.dim })}`) : ""}`);
  },
  // The closing frame: what comes next, with room for the platform's own end-screen elements.
  endcard(s, step, age, total) {
    return svg(`${G(960, 190, pop(total), T(0, 0, s.title, 96, { fill: C.yellow }))}<g opacity="${clamp((total - 0.3) / 0.3)}">${T(960, 290, s.next, 60, { font: "Elite" })}</g>
      <rect x="250" y="390" width="760" height="428" rx="24" fill="none" stroke="${C.line}" stroke-width="5" stroke-dasharray="20 16" opacity=".5"/><circle cx="1420" cy="604" r="170" fill="none" stroke="${C.pink}" stroke-width="5" stroke-dasharray="20 16" opacity=".6"/>
      <g opacity="${clamp((total - 0.6) / 0.3)}">${T(960, 930, s.note, 46, { font: "Elite", fill: C.dim })}</g>`);
  },
  // A fingerprint machine: text goes in, a short code comes out; change one letter and the whole code changes; no way back.
  hash(s, step, age) {
    const input = step >= 1 ? s.changed : s.input, out = fake(input), a = step === 0 ? age : since(1, step, age), settle = clamp(a / 0.9);
    const shown = out.split("").map((ch, i) => (i / out.length < settle ? ch : "0123456789abcdef"[Math.floor(rnd(i * 7 + Math.floor(a * 30)) * 16)])).join("");
    const a2 = since(2, step, age), box = (x, w, label, text, fill, big) => `<rect x="${x - w / 2}" y="400" width="${w}" height="200" rx="22" fill="${C.navy}" stroke="${fill}" stroke-width="5"/>${T(x, 372, label, 42, { font: "Elite", fill: C.dim })}${T(x, 525, text, big, { font: "Elite", fill })}`;
    return svg(`${heading(s.title, 1)}${box(390, 620, s.inLabel, input, step >= 1 && a < 1.2 ? C.pink : C.white, 52)}
      ${G(960, 500, 1 + 0.05 * Math.sin(a * 14) * (settle < 1 ? 1 : 0), `<g transform="rotate(${a * 200 * (settle < 1 ? 1 : 0)})">${icon("gear", C.cyan)}</g>`)}${T(960, 690, "HASH", 60, { fill: C.cyan })}
      <path d="M720 500H830M1090 500H1200" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/><path d="M830 500l-22 -16v32zM1200 500l-22 -16v32z" fill="${C.line}"/>
      ${box(1530, 620, s.outLabel, shown.slice(0, 8) + " " + shown.slice(8, 16), step >= 1 ? C.pink : C.yellow, 56)}
      ${a2 > 0 ? `<path d="M1500 720C1300 ${820 + 0}, 700 820, 420 720" fill="none" stroke="${C.red}" stroke-width="8" stroke-dasharray="18 14" opacity="${clamp(a2 / 0.3)}"/>${G(960, 800, pop(a2 - 0.3), `<circle r="54" fill="${C.red}"/><path d="M-24 -24L24 24M24 -24L-24 24" stroke="#fff" stroke-width="14" stroke-linecap="round"/>`)}` : ""}
      ${caption((s.captions || [])[step], age, 900)}`);
  },
  // Pages that each carry the fingerprint of the page before. Change an old page and every page after it breaks.
  //   0 a page of payments  1 its fingerprint  2, 3 the next pages, each holding the last one's print  4 tampering  5 rejected
  chain(s, step, age) {
    const n = Math.min(3, Math.max(1, step - 0)), W = 480, gap = 90, x0 = 960 - (3 * W + 2 * gap) / 2 + W / 2, a4 = since(4, step, age), a5 = since(5, step, age);
    const hashes = s.blocks.map((b, i) => fake(b.lines.join("|") + i)), bad = hashes.map((h, i) => fake(h + "x" + i));
    let body = "";
    s.blocks.forEach((b, i) => { const a = i === 0 ? (step > 0 ? 9 : age) : since(i + 1, step, age); if (a < 0) return;
      const x = x0 + i * (W + gap), broken = a4 > i * 0.8 && a4 > 0, shake = broken && a4 < i * 0.8 + 0.5 ? 8 * Math.sin(a4 * 60) : 0, hs = i === 0 ? since(1, step, age) : a - 0.5, h = broken ? bad[i] : hashes[i];
      body += `<g transform="translate(${x + shake} ${540 + (1 - ease(a / 0.4)) * 60})" opacity="${clamp(a / 0.25)}"><rect x="${-W / 2}" y="-250" width="${W}" height="500" rx="22" fill="${C.navy}" stroke="${broken ? C.red : C.line}" stroke-width="6"/>
        <rect x="${-W / 2}" y="-250" width="${W}" height="84" rx="22" fill="${broken ? C.red : C.cyan}" opacity=".9"/>${T(0, -192, b.name, 52, { fill: C.ink })}
        ${b.lines.map((l, k) => T(W / 2 - 40, -100 + k * 62, k === 0 && i === 0 && a4 > 0 ? s.tamper : l, 42, { anchor: "end", font: "Elite", fill: k === 0 && i === 0 && a4 > 0 ? C.red : C.white })).join("")}
        ${i > 0 ? T(W / 2 - 40, 84, s.prevLabel, 28, { anchor: "end", font: "Elite", fill: C.dim }) + T(W / 2 - 40, 128, hashes[i - 1].slice(0, 8), 40, { anchor: "end", font: "Elite", fill: a4 > (i - 1) * 0.8 + 0.4 && a4 > 0 ? C.red : C.pink }) : ""}
        ${hs > 0 ? `<g opacity="${clamp(hs / 0.2)}">${T(W / 2 - 40, 172, s.hashLabel, 28, { anchor: "end", font: "Elite", fill: C.dim })}${T(W / 2 - 40, 220, h.slice(0, 8), 44, { anchor: "end", font: "Elite", fill: broken ? C.red : C.yellow })}</g>` : ""}</g>`;
      if (i > 0 && a > 0.4) { const cut = a4 > (i - 1) * 0.8 + 0.4 && a4 > 0, xa = x - W - gap + W / 2, xb = x - W / 2;
        body += `<path d="M${xa} 750C${xa + 60} 750 ${xb - 60} 660 ${xb} 660" fill="none" stroke="${cut ? C.red : C.pink}" stroke-width="7" stroke-dasharray="${cut ? "10 12" : "0"}" opacity="${clamp((a - 0.4) / 0.3)}"/>${cut ? G((xa + xb) / 2, 695, pop(a4 - (i - 1) * 0.8 - 0.4), T(0, 26, "✗", 80, { fill: C.red })) : ""}`; } });
    return svg(heading(s.title, 1) + body + (a5 > 0 ? G(960, 540, pop(a5), `<g transform="rotate(-8)"><rect x="-360" y="-100" width="720" height="200" rx="24" fill="${C.stamp(0.8)}" stroke="${C.red}" stroke-width="14"/>${T(0, 46, s.rejected, 130, { fill: C.red })}</g>`) : "") + caption((s.captions || [])[step], age, 900));
  },
  // The guessing race: machines try number after number until one finds a fingerprint that starts with enough zeros.
  //   0 the target  1 everyone guessing  2 one wins and is paid  3 the others check it at once
  mine(s, step, age, total) {
    const n = 4, xs = Array.from({ length: n }, (_, i) => 960 + (i - (n - 1) / 2) * 400), a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), win = s.winner ?? 2;
    const tick = Math.floor(total * 15), tries = a1 > 0 ? Math.floor(Math.min(a1 + (step > 1 ? 9 : 0), 14) ** 3 * 1e7) : 0;
    const miners = xs.map((x, i) => { const won = a2 > 0 && i === win, ok = a3 > i * 0.12 && i !== win, guess = a1 > 0 && !(a2 > 0) ? Math.floor(rnd(i * 31 + tick) * 9e8) : won ? s.nonce : a2 > 0 ? "—" : "?", h = a1 > 0 && !(a2 > 0) ? fake(String(guess)) : won ? "0000" + fake("w").slice(0, 4) : "";
      return labelled(x, 580, won ? 1.5 : 1.25, "node", "", total - i * 0.12, { args: [won ? C.green : ok ? C.green : C.cyan], glow: won ? C.green : null })
        + T(x, 760, String(guess), 46, { font: "Elite", fill: won ? C.green : C.white }) + (h ? T(x, 822, h.slice(0, 8), 40, { font: "Elite", fill: won ? C.green : C.dim }) : "") + (ok ? T(x, 450, "✓", 90, { fill: C.green }) : "")
        + (won ? G(x, 400, 0.8 * pop(a2), icon("coin")) + T(x, 890, s.reward, 50, { fill: C.yellow, opacity: clamp(a2 / 0.3) }) : ""); }).join("");
    return svg(`${heading(s.title, 1)}${G(960, 262, pop(total - 0.2), `<rect x="-520" y="-52" width="1040" height="104" rx="20" fill="${C.navy}" stroke="${C.yellow}" stroke-width="5"/>${T(0, 20, s.target, 56, { fill: C.yellow })}`)}${miners}
      ${a1 > 0 && !(a2 > 0) ? T(960, 920, s.triesLabel + " " + tries.toLocaleString("en"), 48, { font: "Elite", fill: C.dim }) : ""}`);
  },
  // Bars that grow one after another, then a line under them.
  bars(s, step, age, total) {
    const n = s.bars.length, max = Math.max(...s.bars.map((b) => b.value)), bw = Math.min(260, 1400 / n - 40), gap = n <= 2 ? 240 : 40, x0 = 960 - (n - 1) * (bw + gap) / 2;
    const body = s.bars.map((b, i) => { const a = total - 0.3 - i * (s.every ?? 0.45), g = ease(a / 0.6), h = 480 * b.value / max * g, x = x0 + i * (bw + gap); if (a <= 0) return "";
      return `<rect x="${x - bw / 2}" y="${780 - h}" width="${bw}" height="${h}" rx="14" fill="${b.color || C.yellow}"/>${T(x, 760 - h, b.text ?? b.value, 62, { fill: b.color || C.yellow, opacity: clamp((a - 0.4) / 0.2) })}${T(x, 850, b.label, 46, { font: "Elite" })}`; }).join("");
    return svg(`${heading(s.title, 1)}<path d="M${x0 - bw / 2 - 40} 780H${x0 + (n - 1) * (bw + gap) + bw / 2 + 40}" stroke="${C.line}" stroke-opacity=".5" stroke-width="5"/>${body}${caption(step >= 1 ? s.note : "", since(1, step, age), 930)}`);
  },
  // An address anyone may see, and the key that only its owner holds.
  //   0 the address  1 the key  2 the key signs a payment and the network accepts it  3 how many keys there could be
  keys(s, step, age, total) {
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), dim = a3 > 0 ? 0.1 : 1;
    const sign = a2 > 0 ? ease(a2 / 0.7) : 0, kx = lerp(1420, 1080, sign * (a2 < 1.4 ? 1 : 1 - ease((a2 - 1.4) / 0.5))), ky = lerp(470, 560, sign * (a2 < 1.4 ? 1 : 1 - ease((a2 - 1.4) / 0.5)));
    return svg(`${heading(s.title, 1)}<g opacity="${dim}">${labelled(500, 470, 1.5, "mailbox", s.addressLabel, total)}${total > 0.4 ? T(500, 800, s.address, 40, { font: "Elite", fill: C.cyan }) : ""}
      ${a1 > 0 ? G(kx, ky, 1.5 * pop(a1), icon("key")) + T(1420, 730, s.keyLabel, 46, { font: "Elite", opacity: clamp(a1 / 0.3) }) + T(1420, 800, "•••• •••• •••• ••••", 46, { font: "Elite", fill: C.yellow, opacity: clamp(a1 / 0.3) }) : ""}
      ${a2 > 0 ? G(960, 560, pop(a2), `<rect x="-230" y="-70" width="460" height="140" rx="16" fill="${C.paper}"/>${T(0, 18, s.payment, 50, { font: "Elite", fill: C.ink })}`) + (a2 > 0.8 ? G(1110, 500, pop(a2 - 0.8), `<circle r="48" fill="${C.green}"/>${T(0, 26, "✓", 70, { fill: "#fff" })}`) : "") : ""}</g>
      ${a3 > 0 ? G(960, 520, pop(a3), T(-10, 60, s.count, 320, { fill: C.yellow, anchor: "end" }) + T(10, -70, s.exp || "", 170, { fill: C.yellow, anchor: "start" }) + T(0, 190, s.countLabel, 60, { font: "Elite" })) : ""}${caption((s.captions || [])[step], age, 920)}`);
  },
  // One person's story: a thing, a headline, and a line more each step.
  story(s, step, age, total) {
    const lines = s.lines.map((l, i) => { const a = since(i, step, age); return a < 0 ? "" : `<g opacity="${clamp(a / 0.25)}" transform="translate(${(1 - ease(a / 0.35)) * 40} 0)">${T(1560, 430 + i * 120, l, s.size || 62, { anchor: "end", font: "Elite", fill: i === Math.min(step, s.lines.length - 1) ? C.yellow : C.white })}</g>`; }).join("");
    return svg(`${heading(s.title, 1)}${labelled(430, 520, 2 * (1 + 0.02 * Math.sin(total * 3)), s.icon, s.name, total, { labelFill: C.dim, glow: C.cyan })}${lines}`);
  },
  // How much of a fixed supply is gone: a number, a bar filling, and a line or two.
  meter(s, step, age, total) {
    const p = ease((total - 0.5) / 1.6) * s.value, a1 = since(1, step, age);
    return svg(`${heading(s.title, 1)}${G(960, 400, pop(total), T(0, 40, s.big, 210, { fill: C.yellow }) + T(0, 130, s.unit, 56, { font: "Elite" }))}
      <rect x="360" y="640" width="1200" height="70" rx="35" fill="${C.navy}" stroke="${C.line}" stroke-width="5"/><rect x="368" y="648" width="${1184 * p}" height="54" rx="27" fill="${s.color || C.green}"/>
      ${T(960, 780, Math.round(p * 100) + "% " + s.label, 54, { font: "Elite" })}${a1 > 0 ? `<g opacity="${clamp(a1 / 0.3)}">${T(960, 880, s.note, 54, { font: "Elite", fill: C.yellow })}</g>` : ""}`);
  },
  // Two words from the humans' vocabulary, one per step: the word, and what it means.
  dict(s, step, age, total) {
    const n = s.items.length, body = s.items.map((it, i) => { const a = since(i, step, age); if (a < 0) return ""; const y = 540 + (i - (n - 1) / 2) * 290 + 30, now = i === Math.min(step, n - 1);
      return `<g transform="translate(960 ${y}) scale(${0.96 + 0.04 * pop(a)})" opacity="${clamp(a / 0.2) * (now ? 1 : 0.6)}"><rect x="-760" y="-120" width="1520" height="240" rx="26" fill="${C.navy}" stroke="${now ? C.yellow : C.line}" stroke-opacity="${now ? 1 : 0.4}" stroke-width="5"/>
        ${T(0, -18, it.word, 92, { fill: C.yellow })}${T(0, 66, it.means, 48, { font: "Elite" })}</g>`; }).join("");
    return svg(heading(s.title, 1, 140) + body);
  },
  // Who changes the rules: every machine runs the rule book it chooses; when they disagree the chain splits in two.
  //   0 everyone on the same rules  1 some switch to new rules  2 the chain forks  3 the two branches are named
  fork(s, step, age, total) {
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), ch = new Set(s.changed || [1, 4]), dimN = a2 > 0 ? lerp(1, 0.4, ease(a2 / 0.4)) : 1;
    const blk = (x, y, c, a) => (a <= 0 ? "" : `<g transform="translate(${x} ${y}) scale(${pop(a)})"><rect x="-52" y="-52" width="104" height="104" rx="18" fill="${C.navy}" stroke="${c}" stroke-width="7"/><path d="M-26 -14h52M-26 10h34" stroke="${c}" stroke-width="7" stroke-linecap="round" opacity=".7"/></g>`);
    const nodes = Array.from({ length: 6 }, (_, i) => { const x = 460 + i * 200, sw = ch.has(i) && a1 > 0, c = sw ? C.pink : C.cyan;
      return G(x, 330, 0.8 * pop(total - i * 0.08), icon("node", c)) + T(x, 440, sw ? s.v2 : s.v1, 38, { font: "Elite", fill: c }); }).join("");
    const y0 = 720, common = [0, 1, 2, 3].map((k) => blk(330 + k * 150, y0, C.line, total - 0.3 - k * 0.12) + (k ? `<path d="M${330 + k * 150 - 98} ${y0}h46" stroke="${C.line}" stroke-width="7" opacity="${clamp((total - 0.3 - k * 0.12) / 0.2)}"/>` : "")).join("");
    let split = "";
    if (a2 > 0) { const d = 130 * ease(a2 / 0.6);
      for (const [sign, c] of [[-1, C.yellow], [1, C.pink]]) { const y = y0 + sign * d;
        split += `<path d="M832 ${y0}C880 ${y0} 880 ${y} 928 ${y}" fill="none" stroke="${c}" stroke-width="7"/>`;
        for (let j = 0; j < 3; j++) split += blk(980 + j * 150, y, c, a2 - 0.3 - j * 0.18) + (j ? `<path d="M${980 + j * 150 - 98} ${y}h46" stroke="${c}" stroke-width="7" opacity="${clamp((a2 - 0.3 - j * 0.18) / 0.2)}"/>` : "");
        if (a3 > 0) split += `<g opacity="${clamp(a3 / 0.3)}">${T(1400, y + 22, sign < 0 ? s.a : s.b, 60, { anchor: "start", fill: c })}</g>`; }
      if (a3 > 0 && s.year) split += G(580, 900, pop(a3), T(0, 0, s.year, 80, { fill: C.dim })); }
    return svg(`${heading(s.title, 1)}<g opacity="${dimN}">${nodes}</g>${common}${split}${caption((s.captions || [])[step], age, 960)}`);
  },
  // The ledger never forgets: coins hop between unnamed addresses until one of them meets a name; then the whole trail has one.
  //   0 the hops  1 an address is tied to a person  2 the trail lights up backwards
  trace(s, step, age, total) {
    const n = 5, P = Array.from({ length: n }, (_, i) => [330 + i * 290, 500 + (i % 2 ? 100 : -80)]), a1 = since(1, step, age), a2 = since(2, step, age);
    const hot = (i) => (a2 > 0 ? a2 > (n - 1 - i) * 0.4 : a1 > 0 && i === n - 1);
    let body = "";
    for (let i = 0; i < n - 1; i++) { const a = total - 0.3 - i * 0.3, red = a2 > (n - 2 - i) * 0.4 + 0.2 && a2 > 0; if (a <= 0) continue; const [x1, y1] = P[i], [x2, y2] = P[i + 1], p = ease(a / 0.3);
      body += `<path d="M${x1} ${y1}L${lerp(x1, x2, p)} ${lerp(y1, y2, p)}" stroke="${red ? C.red : C.line}" stroke-width="8" stroke-dasharray="16 12" opacity=".8"/>`; }
    if (step === 0 && total > 1.6) { const t = ((total - 1.6) * 0.9) % (n - 1), k = Math.floor(t), f = ease(t - k); body += G(lerp(P[k][0], P[k + 1][0], f), lerp(P[k][1], P[k + 1][1], f), 0.5, icon("coin")); }
    P.forEach(([x, y], i) => { const a = total - i * 0.3; if (a <= 0) return; const h = hot(i), named = (i === n - 1 && a1 > 0.3) || (i === 0 && a2 > (n - 1) * 0.4 + 0.3);
      body += G(x, y, pop(a), `<circle r="78" fill="${C.navy}" stroke="${h ? C.red : C.cyan}" stroke-width="8"/>${named ? G(0, 4, 0.5, icon("person", C.red)) : T(0, 30, "?", 86, { fill: h ? C.red : C.cyan })}`)
        + T(x, y + 132, named ? (i === 0 ? s.owner : s.name) : (s.codes || [])[i] || fake("a" + i).slice(0, 6) + "…", named ? 48 : 36, { font: "Elite", fill: named ? C.yellow : C.dim }); });
    if (a1 > 0) body += G(P[n - 1][0], P[n - 1][1] - 190, pop(a1), `<rect x="-150" y="-52" width="300" height="104" rx="16" fill="${C.paper}"/><circle cx="-92" cy="-6" r="24" fill="#8f96b8"/><path d="M-126 40C-126 6 -58 6 -58 40Z" fill="#8f96b8"/>${T(40, 16, s.id || "ID", 50, { fill: C.ink })}`);
    return svg(heading(s.title, 1) + body + caption((s.captions || [])[step], age, 900));
  },
  // A list that fills in a row at a time, each row with a mark: a red flag, a cross, a tick or a "sort of".
  rows(s, step, age) {
    const n = s.items.length, rh = Math.min(160, 660 / n), y0 = 590 - (n * rh) / 2, ltr = s.dir === "ltr", W = 1380, x = 960 - W / 2;
    const mark = (m) => (m === "flag" ? G(0, 0, 0.42, icon("flag")) : m === "check" ? `<circle r="40" fill="${C.green}"/>${T(0, 22, "✓", 58, { fill: "#fff" })}` : m === "half" ? `<circle r="40" fill="${C.gold}"/>${T(0, 20, "~", 70, { fill: C.ink })}` : m === "x" ? `<circle r="40" fill="${C.red}"/><path d="M-17 -17L17 17M17 -17L-17 17" stroke="#fff" stroke-width="11" stroke-linecap="round"/>` : `<circle r="16" fill="${C.cyan}"/>`);
    const body = s.items.map((it, i) => { const a = since(i, step, age); if (a < 0) return ""; const y = y0 + i * rh + rh / 2, now = i === Math.min(step, n - 1), mx = ltr ? x + 80 : x + W - 80, ma = a - (it.late ? 0.6 : 0);
      return `<g opacity="${clamp(a / 0.2) * (now ? 1 : 0.62)}" transform="translate(${(1 - ease(a / 0.3)) * (ltr ? -40 : 40)} 0)"><rect x="${x}" y="${y - rh / 2 + 10}" width="${W}" height="${rh - 20}" rx="20" fill="${C.navy}" stroke="${now ? C.yellow : C.line}" stroke-opacity="${now ? 0.9 : 0.3}" stroke-width="4"/>
        ${ma > 0 ? G(mx, y, pop(ma), mark(it.mark)) : ""}${T(ltr ? x + 160 : x + W - 160, y + (it.sub ? -6 : 18), it.text, s.size || 56, { anchor: ltr ? "start" : "end", font: "Elite", fill: now ? C.white : C.dim })}
        ${it.sub ? T(ltr ? x + 160 : x + W - 160, y + 42, it.sub, 36, { anchor: ltr ? "start" : "end", font: "Elite", fill: C.dim }) : ""}
        ${it.tag ? T(ltr ? x + W - 50 : x + 50, y + 18, it.tag, 50, { anchor: ltr ? "end" : "start", fill: it.tagFill || C.yellow }) : ""}</g>`; }).join("");
    return svg(heading(s.title, 1) + body + caption(s.note && step >= n ? s.note : "", since(n, step, age), 990));
  },
  // Borrowed money: a small stake of your own under a big bet. A small fall in price takes all of the stake.
  //   0 your money  1 the loan on top  2 the price falls and your part is what burns  3 the position is closed
  lever(s, step, age, total) {
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), x0 = 410, W = 1100, own = W * (s.share ?? 0.1), y = 470, h = 150;
    const burn = a2 > 0 ? ease(a2 / 1.2) : 0, loanW = a1 > 0 ? (W - own) * ease(a1 / 0.7) : 0, ownW = own * (1 - burn);
    return svg(`${heading(s.title, 1)}
      ${a1 > 0 ? `<rect x="${x0 + (W - own) - loanW}" y="${y}" width="${loanW}" height="${h}" rx="16" fill="${C.muted}"/>${T(x0 + (W - own) / 2, y + 96, s.loan, 54, { font: "Elite", fill: C.dim, opacity: clamp((a1 - 0.5) / 0.3) })}` : ""}
      ${G(x0 + W - own / 2, y + h / 2, pop(total), `<rect x="${-own / 2}" y="${-h / 2}" width="${ownW}" height="${h}" rx="16" fill="${a2 > 0 ? C.red : C.green}" transform="translate(${own - ownW} 0)"/>`)}
      ${T(x0 + W - own / 2, y - 40, a2 > 1.2 ? s.zero : s.mine, 50, { font: "Elite", fill: a2 > 1.2 ? C.red : C.green })}
      ${a1 > 0.7 ? `<g opacity="${clamp((a1 - 0.7) / 0.3)}"><path d="M${x0} ${y + h + 40}H${x0 + W}" stroke="${C.line}" stroke-width="5"/><path d="M${x0} ${y + h + 26}v28M${x0 + W} ${y + h + 26}v28" stroke="${C.line}" stroke-width="5"/>${T(x0 + W / 2, y + h + 110, s.total, 58, { fill: C.yellow })}</g>` : ""}
      ${a2 > 0 ? G(960, 300, pop(a2), `<rect x="-300" y="-56" width="600" height="112" rx="20" fill="${C.navy}" stroke="${C.red}" stroke-width="6"/>${T(0, 22, s.drop, 60, { fill: C.red })}`) : ""}
      ${a3 > 0 ? G(960, 560, pop(a3), `<g transform="rotate(-8)"><rect x="-330" y="-96" width="660" height="192" rx="24" fill="${C.stamp(0.85)}" stroke="${C.red}" stroke-width="14"/>${T(0, 44, s.stamp, 124, { fill: C.red })}</g>`) : ""}
      ${caption((s.captions || [])[step], age, 900)}`);
  },
  // Two camps side by side, one per step: what each says, in two or three short lines.
  versus(s, step, age) {
    const ltr = s.dir === "ltr", card = (x, d, a, now) => (a <= 0 ? "" : `<g transform="translate(${x} 580) scale(${0.94 + 0.06 * pop(a)})" opacity="${clamp(a / 0.2) * (now ? 1 : 0.7)}"><rect x="-410" y="-300" width="820" height="600" rx="30" fill="${C.navy}" stroke="${d.color || C.line}" stroke-width="6"/>
      ${d.icon ? G(0, -196, 0.55, icon(d.icon, ...(d.args || []))) : ""}${T(0, d.icon ? -70 : -170, d.title, 72, { fill: d.color || C.yellow })}${(d.lines || []).map((l, i) => T(0, (d.icon ? 30 : -50) + i * 84, l, 46, { font: "Elite" })).join("")}</g>`);
    return svg(heading(s.title, 1) + card(ltr ? 500 : 1420, s.a, since(0, step, age), step === 0) + card(ltr ? 1420 : 500, s.b, since(1, step, age), step >= 1) + caption(s.note && step >= 2 ? s.note : "", since(2, step, age), 990));
  },
  // A contract that runs itself, as a vending machine: money in, the condition is met, the thing comes out. Nobody behind the counter.
  //   0 the machine  1 a coin goes in  2 the rule is checked  3 it pays out
  vending(s, step, age, total) {
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), mx = 960, my = 570;
    const items = [0, 1, 2, 3, 4, 5].map((i) => { const gone = i === 4 && a3 > 0; return gone ? "" : G(mx - 150 + (i % 3) * 110, my - 190 + Math.floor(i / 3) * 150, 0.42, icon("file", "")); }).join("");
    const cp = a1 > 0 ? ease(a1 / 0.8) : 0, drop = a3 > 0 ? ease(a3 / 0.6) : 0;
    return svg(`${heading(s.title, 1)}<g transform="translate(0 ${(1 - pop(total)) * 40})"><rect x="${mx - 300}" y="${my - 330}" width="600" height="700" rx="30" fill="${C.body}" stroke="${C.line}" stroke-width="6"/>
      <rect x="${mx - 250}" y="${my - 280}" width="330" height="340" rx="14" fill="${C.ink}" stroke="${C.line}" stroke-opacity=".5" stroke-width="4"/>${items}
      <rect x="${mx + 130}" y="${my - 260}" width="120" height="60" rx="10" fill="${C.ink}"/><rect x="${mx + 160}" y="${my - 236}" width="60" height="12" rx="6" fill="${C.yellow}"/>
      <circle cx="${mx + 190}" cy="${my - 90}" r="46" fill="${a2 > 0 ? C.green : C.muted}"/>${a2 > 0 ? T(mx + 190, my - 68, "✓", 60, { fill: "#fff" }) : ""}
      <rect x="${mx - 250}" y="${my + 150}" width="500" height="150" rx="14" fill="${C.ink}"/>
      ${a3 > 0 ? G(mx - 40, lerp(my + 30, my + 225, drop), 0.6, icon("file", "✓")) : ""}</g>
      ${a1 > 0 && cp < 1 ? G(lerp(1560, mx + 190, cp), lerp(300, my - 232, cp), 0.6, icon("coin")) : ""}
      ${a1 > 0 ? `<g opacity="${clamp(a1 / 0.3)}">${T(1560, 420, s.in, 50, { font: "Elite", fill: step === 1 ? C.yellow : C.dim })}</g>` : ""}
      ${a2 > 0 ? `<g opacity="${clamp(a2 / 0.3)}">${T(1560, 500, s.rule, 50, { font: "Elite", fill: step === 2 ? C.yellow : C.dim })}</g>` : ""}
      ${a3 > 0 ? `<g opacity="${clamp(a3 / 0.3)}">${T(1560, 580, s.out, 50, { font: "Elite", fill: C.yellow })}</g>` : ""}
      ${T(360, 500, s.label || "", 54, { font: "Elite", fill: C.dim })}${caption((s.captions || [])[step], age, 990)}`);
  },
  // Guarding the ledger with a deposit instead of electricity: lock coins up, get picked by lot, lose the deposit for cheating.
  //   0 everyone locks a stake  1 one is drawn and writes the page  2 a cheat's stake burns
  stake(s, step, age, total) {
    const st = s.stakes || [2, 5, 3, 1], n = st.length, xs = st.map((_, i) => 960 + (i - (n - 1) / 2) * 360), a1 = since(1, step, age), a2 = since(2, step, age), pick = s.pick ?? 1, cheat = s.cheat ?? 3;
    const spot = a1 > 0 ? (a1 < 1.2 ? Math.floor(a1 * 7) % n : pick) : -1;
    const body = xs.map((x, i) => { const burn = a2 > 0 && i === cheat ? ease(a2 / 1.2) : 0, won = a1 > 1.2 && i === pick;
      const coins = Array.from({ length: st[i] }, (_, k) => G(x, 560 - k * 46, 0.42 * pop(total - 0.2 - i * 0.1 - k * 0.07), icon("coin", burn > 0 ? C.red : C.gold), `opacity="${1 - burn}"`)).join("");
      return (i === spot ? `<ellipse cx="${x}" cy="560" rx="150" ry="230" fill="${C.yellow}" opacity=".16" filter="url(#bglow)"/>` : "") + G(x, 730, 0.9, icon("node", won ? C.green : burn > 0 ? C.red : C.cyan)) + coins
        + (total > 0.8 && !(burn > 0) ? G(x + 70, 600, 0.26, icon("lock")) : "") + (won ? G(x, 560 - st[i] * 46 - 10, 0.5 * pop(a1 - 1.2), icon("coin", C.green, "+")) + T(x, 860, s.win, 46, { font: "Elite", fill: C.green }) : "")
        + (burn > 0 ? T(x, 860, s.burn, 46, { font: "Elite", fill: C.red }) + G(x, 520, pop(a2), T(0, 30, "✗", 110, { fill: C.red })) : ""); }).join("");
    return svg(heading(s.title, 1) + body + caption((s.captions || [])[step], age, 960));
  },
  // A field of coins, and how many of them are already dead.
  graveyard(s, step, age, total) {
    const cols = 12, rows = 4, a1 = since(1, step, age); let body = "";
    for (let i = 0; i < cols * rows; i++) { const x = 300 + (i % cols) * 120, y = 420 + Math.floor(i / cols) * 110, a = total - 0.2 - rnd(i * 3) * 0.9, dead = rnd(i * 7 + 1) < (s.share ?? 0.57), da = dead && a1 > 0 ? a1 - rnd(i * 11) * 1.6 : -1;
      if (a <= 0) continue;
      body += da > 0 ? G(x, y, 0.4, `<circle r="74" fill="${C.muted}"/>${T(0, 30, "✗", 90, { fill: "#8f96b8" })}`, `opacity="${lerp(1, 0.75, clamp(da / 0.3))}"`) : G(x, y, 0.4 * pop(a), icon("coin", C.gold, s.letter || "$")); }
    return svg(`${heading(s.title, 1)}${G(960, 290, pop(total), T(0, 0, s.total, 70, { fill: C.yellow }))}${body}${a1 > 0 ? G(960, 930, pop(a1 - 1), T(0, 0, s.dead, 78, { fill: C.red })) : ""}`);
  },
  // A sound becomes numbers: the wave, the points measured on it, then only the numbers.
  //   0 the wave  1 it is measured many times a second  2 the wave goes and the numbers stay  3 the numbers leave as a stream
  wave(s, step, age, total) {
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), x0 = 260, W = 1400, base = 500, N = s.n || 18, drift = step === 0 ? total * 1.4 : 0;
    const f = (u) => 150 * (0.6 * Math.sin(u * 9.2 + drift) + 0.3 * Math.sin(u * 21 + 1.3 + drift * 1.7) + 0.16 * Math.sin(u * 37 + 0.4)) * Math.sin(Math.PI * u) ** 0.5;
    let d = ""; for (let i = 0; i <= 200; i++) { const u = i / 200; d += `${i ? "L" : "M"}${x0 + u * W} ${base - f(u) * Math.min(1, total / 0.5)}`; }
    const waveOp = a2 > 0 ? 1 - 0.85 * ease(a2 / 0.6) : 1; let pts = "", nums = "";
    for (let k = 0; k < N; k++) { const u = (k + 0.5) / N, x = x0 + u * W, v = f(u), a = a1 - k * 0.035; if (a1 < 0 || a <= 0) continue;
      pts += `<path d="M${x} ${base}V${base - v * ease(a / 0.2)}" stroke="${C.cyan}" stroke-width="6" opacity=".8"/><circle cx="${x}" cy="${base - v * ease(a / 0.2)}" r="10" fill="${C.yellow}"/>`;
      if (a2 > k * 0.03) nums += `<g opacity="${clamp((a2 - k * 0.03) / 0.2)}" transform="translate(${a3 > 0 ? ease(a3 / 1.6) * 300 : 0} 0)">${T(x, 790, String(Math.round(v / 1.5 + 100)), 38, { font: "Elite", fill: C.yellow })}</g>`; }
    return svg(`${heading(s.title, 1)}<path d="M${x0} ${base}H${x0 + W}" stroke="${C.line}" stroke-opacity=".35" stroke-width="4"/><path d="${d}" fill="none" stroke="${C.pink}" stroke-width="9" stroke-linecap="round" opacity="${waveOp}"/>
      <g opacity="${a2 > 0 ? lerp(1, 0.5, ease(a2 / 0.6)) : 1}">${pts}</g>${a2 > 0 ? `<rect x="${x0 - 30}" y="740" width="${W + 60}" height="76" rx="16" fill="${C.navy}" stroke="${C.line}" stroke-opacity=".4" stroke-width="4" opacity="${clamp(a2 / 0.3)}"/>` : ""}${nums}
      ${G(150, base, 0.8 * pop(total), icon(s.icon || "mic"))}${caption((s.captions || [])[step], age, 930)}`);
  },
  // Why it is called cellular: land cut into cells, each with a tower; the same few channels used again in cells that do not touch;
  // a phone that whispers "I am here"; and a call handed from tower to tower as it moves.
  //   0 the cells  1 channels reused  2 the phone checks in  3 the call is handed over
  cells(s, step, age, total) {
    const R = 150, hx = R * 1.5, hy = R * Math.sqrt(3), cols = [-2, -1, 0, 1, 2], a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), CO = [C.cyan, C.pink, C.green];
    const cellsL = []; for (const c of cols) for (const r of [-1, 0, 1]) { const x = 960 + c * hx, y = 560 + r * hy + (c & 1 ? hy / 2 : 0); if (y < 250 || y > 900) continue; cellsL.push({ x, y, g: (((c - (r - (c - (c & 1)) / 2)) % 3) + 3) % 3 }); }
    const hex = (x, y) => Array.from({ length: 6 }, (_, k) => `${x + R * Math.cos(k * Math.PI / 3)} ${y + R * Math.sin(k * Math.PI / 3)}`).join("L");
    let ph = null; if (a3 > 0) { const p = ease((a3 % 6) / 5); ph = { x: lerp(960 - 2.2 * hx, 960 + 2.2 * hx, p), y: 560 + 40 * Math.sin(p * 5) }; } else if (a2 > 0) ph = { x: 960 + 40, y: 560 + 60 };
    let near = null; if (ph) near = cellsL.reduce((m, c) => (Math.hypot(c.x - ph.x, c.y - ph.y) < Math.hypot(m.x - ph.x, m.y - ph.y) ? c : m));
    const body = cellsL.map((c, i) => { const a = total - i * 0.06; if (a <= 0) return ""; const col = a1 > 0 ? CO[c.g] : C.line, on = near === c;
      return `<g opacity="${clamp(a / 0.2)}"><path d="M${hex(c.x, c.y)}Z" fill="${on ? col : a1 > 0 ? col : C.navy}" fill-opacity="${on ? 0.42 : a1 > 0 ? 0.16 : 0.5}" stroke="${col}" stroke-width="5" stroke-opacity=".8"/>${G(c.x, c.y - 6, 0.36, icon("tower", on ? C.yellow : C.white))}${a1 > 0 ? T(c.x, c.y + 96, (s.channels || ["A", "B", "C"])[c.g], 40, { fill: col }) : ""}</g>`; }).join("");
    const phone = ph ? (a2 > 0 && !(a3 > 0) ? [0, 1, 2].map((k) => { const p = ((a2 * 0.8 + k / 3) % 1); return `<circle cx="${ph.x}" cy="${ph.y}" r="${20 + p * 120}" fill="none" stroke="${C.yellow}" stroke-width="5" opacity="${0.7 * (1 - p)}"/>`; }).join("") : "")
      + `<path d="M${ph.x} ${ph.y}L${near.x} ${near.y - 30}" stroke="${C.yellow}" stroke-width="6" stroke-dasharray="10 10"/>` + G(ph.x, ph.y, 0.34, icon(a3 > 0 ? "car" : "mobile")) : "";
    return svg(heading(s.title, 1) + body + phone + caption((s.captions || [])[step], age, 990));
  },
  // A journey along a row of stops. Each step lights the next leg; a leg is radio (waves), wire or sea.
  route(s, step, age, total) {
    const n = s.stops.length, x0 = 960 - (n - 1) * (n > 5 ? 130 : n > 4 ? 170 : 210) * 1.0, dx = n > 1 ? (960 - x0) * 2 / (n - 1) : 0, y = 520, sc = n > 5 ? 0.8 : n > 4 ? 0.95 : 1.1; let legs = "";
    for (let i = 0; i < n - 1; i++) { const a = since(i + 1, step, age); if (a < 0) continue; const xa = x0 + i * dx + 110 * sc, xb = x0 + (i + 1) * dx - 110 * sc, kind = s.stops[i].link || "wire", p = ease(a / 0.6), col = kind === "radio" ? C.yellow : kind === "sea" ? C.cyan : C.green;
      if (kind === "radio") { let d = ""; const m = Math.floor((xb - xa) * p / 6); for (let k = 0; k <= m; k++) { const x = xa + k * 6; d += `${k ? "L" : "M"}${x} ${y + 22 * Math.sin((x - xa) / 16 - total * 6)}`; } legs += `<path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`; }
      else legs += `<path d="M${xa} ${y}H${lerp(xa, xb, p)}" stroke="${col}" stroke-width="${kind === "sea" ? 14 : 9}" stroke-linecap="round" ${kind === "sea" ? 'stroke-dasharray="2 20"' : ""}/>`;
      if (a > 0.6) { const q = ((a - 0.6) * 0.9) % 1; legs += `<circle cx="${lerp(xa, xb, q)}" cy="${y + (kind === "radio" ? 22 * Math.sin((lerp(xa, xb, q) - xa) / 16 - total * 6) : 0)}" r="13" fill="#fff"/>`; }
      if (s.stops[i].leg && a > 0.3) legs += `<g opacity="${clamp((a - 0.3) / 0.3)}">${T((xa + xb) / 2, y - 60, s.stops[i].leg, 36, { font: "Elite", fill: col })}</g>`; }
    const stops = s.stops.map((st, i) => { const a = step > 0 ? 9 : age - i * 0.15, reached = i <= step;
      return labelled(x0 + i * dx, y, sc, st.icon, st.label, a, { args: st.args, opacity: reached ? 1 : 0.55, glow: i === Math.min(step, n - 1) && step > 0 ? C.yellow : null }) + (st.sub && a > 0.3 ? `<g opacity="${clamp((a - 0.3) / 0.3) * (reached ? 1 : 0.5)}">${T(x0 + i * dx, y + 150 * sc + 86, st.sub, 34, { font: "Elite", fill: C.dim })}</g>` : ""); }).join("");
    return svg(heading(s.title, 1) + legs + stops + caption((s.captions || [])[step], age, 930));
  },
  // The planet's cables: a flat map, lines of light between the continents, and what happens when one is cut.
  //   0 the map  1 the cables light up  2 (hold)  3 one is cut and the rest carry on
  globe(s, step, age, total) {
    const X = (lon) => 960 + lon * 4.5, Y = (lat) => 590 - lat * 4.6, a1 = since(1, step, age), a3 = since(s.cutStep ?? 2, step, age);
    const LAND = [[[-168,66],[-150,71],[-110,72],[-85,70],[-62,58],[-55,48],[-70,42],[-76,35],[-81,25],[-90,29],[-97,26],[-97,18],[-88,15],[-83,9],[-79,8],[-92,15],[-105,20],[-112,30],[-123,38],[-125,48],[-135,58],[-155,58],[-165,62]],
      [[-79,8],[-62,10],[-50,0],[-35,-7],[-39,-18],[-48,-27],[-57,-37],[-65,-45],[-70,-54],[-75,-48],[-72,-30],[-70,-18],[-80,-5]],
      [[-9,37],[-9,43],[-1,44],[-4,48],[3,51],[8,54],[10,58],[5,61],[14,69],[28,71],[45,68],[70,72],[100,77],[140,73],[170,69],[178,65],[160,60],[155,52],[142,54],[135,44],[128,38],[122,31],[120,23],[109,20],[106,10],[100,13],[98,8],[103,2],[98,16],[92,21],[88,22],[80,13],[77,8],[72,20],[66,25],[57,26],[52,16],[45,13],[43,17],[35,28],[35,36],[27,36],[23,40],[18,40],[15,38],[12,44],[3,43],[-1,37]],
      [[-17,15],[-16,24],[-6,35],[10,37],[20,32],[32,31],[35,28],[43,12],[51,11],[40,-4],[39,-15],[33,-26],[20,-35],[17,-29],[12,-17],[9,-1],[9,4],[-8,4],[-13,9]],
      [[114,-22],[122,-18],[131,-12],[137,-16],[142,-11],[146,-19],[153,-27],[150,-37],[140,-38],[131,-32],[116,-35]],
      [[-55,60],[-43,60],[-22,70],[-20,80],[-45,83],[-68,78]], [[-5,50],[1,51],[-2,58],[-6,57]], [[130,32],[140,36],[142,44],[136,36]]];
    const land = LAND.map((p) => `<path d="M${p.map(([lo, la]) => `${X(lo)} ${Y(la)}`).join("L")}Z" fill="${C.land}" stroke="${C.line}" stroke-opacity=".45" stroke-width="3"/>`).join("");
    const CAB = s.cables || [[[-74,40],[-5,50]], [[-70,42],[-9,39]], [[-38,-4],[-9,38]], [[-80,26],[-38,-4]], [[5,43],[32,31]], [[32,30],[43,12]], [[43,12],[73,19]], [[73,19],[104,1]], [[104,1],[114,22]], [[114,22],[140,36]], [[-9,38],[-17,15],[3,5],[18,-34]], [[18,-34],[40,-4],[73,19]], [[104,1],[151,-34]], [[-118,34],[-176,30]], [[140,36],[176,30]], [[-123,46],[-176,48]], [[142,42],[176,48]]];
    const cut = s.cut ?? 5; let cab = "";
    CAB.forEach((c, i) => { const a = a1 - i * 0.18; if (a1 < 0 || a <= 0) return; const dead = a3 > 0 && i === cut, pts = c.map(([lo, la]) => [X(lo), Y(la)]);
      let d = `M${pts[0][0]} ${pts[0][1]}`; for (let k = 1; k < pts.length; k++) { const [x1, y1] = pts[k - 1], [x2, y2] = pts[k], bow = c.length === 2 ? Math.min(90, Math.abs(x2 - x1) * 0.18) : 0; d += `Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + bow} ${x2} ${y2}`; }
      const len = 1400, p = ease(a / 0.8);
      cab += `<path d="${d}" fill="none" stroke="${dead ? C.red : C.yellow}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${dead ? "8 12" : `${len}`}" stroke-dashoffset="${dead ? 0 : len * (1 - p)}" opacity="${dead ? 0.9 : 0.85}"/>`;
      if (p >= 1 && !dead) { const q = ((total * 0.35 + i * 0.37) % 1), k = Math.min(pts.length - 2, Math.floor(q * (pts.length - 1))), f = q * (pts.length - 1) - k, bow = c.length === 2 ? Math.min(90, Math.abs(pts[1][0] - pts[0][0]) * 0.18) : 0;
        const bx = (1 - f) * (1 - f) * pts[k][0] + 2 * f * (1 - f) * (pts[k][0] + pts[k + 1][0]) / 2 + f * f * pts[k + 1][0], by = (1 - f) * (1 - f) * pts[k][1] + 2 * f * (1 - f) * ((pts[k][1] + pts[k + 1][1]) / 2 + bow) + f * f * pts[k + 1][1];
        cab += `<circle cx="${bx}" cy="${by}" r="${a3 > 0 ? 9 : 7}" fill="#fff"/>`; }
      if (dead) { const mx = (pts[0][0] + pts[pts.length - 1][0]) / 2, my = (pts[0][1] + pts[pts.length - 1][1]) / 2; cab += G(mx, my, pop(a3), `<circle r="34" fill="${C.red}"/><path d="M-14 -14L14 14M14 -14L-14 14" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`); } });
    return svg(`${heading(s.title, 1, 130)}<g opacity="${clamp(total / 0.4)}">${land}</g>${cab}${caption((s.captions || [])[step], age, 925)}`);
  },
  // Anything sent is cut into numbered packets; each finds its own way and they are put back in order at the far end.
  //   0 the whole message  1 cut up  2 on the road, each by its own path  3 back in order  4 (optional) one is lost and nobody waits for it
  packets(s, step, age, total) {
    const N = s.n || 6, a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), a4 = since(4, step, age), lose = s.lose ?? 3;
    const R = [[700, 330], [700, 700], [960, 520], [1220, 330], [1220, 700]], PATHS = [[0, 3], [1, 4], [0, 2, 4], [1, 2, 3], [0, 2, 3], [1, 2, 4]];
    const routers = (a2 > 0 || step >= 2) ? R.map(([x, y], i) => G(x, y, 0.5 * pop((step > 2 ? 9 : a2) - i * 0.08), icon("node", C.cyan))).join("") + PATHS.map((p) => { const pts = [[430, 520], ...p.map((k) => R[k]), [1490, 520]]; return `<path d="M${pts.map((q) => q.join(" ")).join("L")}" fill="none" stroke="${C.line}" stroke-width="3" opacity=".22"/>`; }).join("") : "";
    const box = (x, y, k, col, sc = 1, op = 1) => G(x, y, sc, `<rect x="-38" y="-38" width="76" height="76" rx="12" fill="${col}"/>${T(0, 18, String(k + 1), 50, { fill: C.ink })}`, `opacity="${op}"`);
    let body = "";
    for (let k = 0; k < N; k++) { const hx = 250 + (k % 2) * 84 - 42 + 80, hy = 520 + (Math.floor(k / 2) - 1) * 84, home = [hx - 80, hy], col = k === lose && a4 > 0 ? C.red : C.yellow;
      if (step <= 1) { const sp = a1 > 0 ? ease(a1 / 0.5) : 0; body += box(lerp(250, home[0], sp), lerp(520, home[1], sp), k, col, 1, step === 0 ? 0 : 1); continue; }
      const dest = [1630 + (k % 2) * 84 - 42, 520 + (Math.floor(k / 2) - 1) * 84];
      if (step === 2) { const pts = [home, [430, 520], ...PATHS[k % PATHS.length].map((i) => R[i]), [1490, 520]], q = clamp(((a2 - 0.3 - k * 0.35) * 0.45)), segs = pts.length - 1, i = Math.min(segs - 1, Math.floor(q * segs)), f = q * segs - i;
        body += box(lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f), k, col, 0.8, q >= 1 ? 0.35 : 1); continue; }
      const order = [2, 0, 5, 1, 4, 3], j = order.indexOf(k), from = [1630 + (j % 2) * 84 - 42, 520 + (Math.floor(j / 2) - 1) * 84], p = step > 3 ? 1 : ease((a3 - 0.5) / 0.7);
      const lost = k === lose && a4 > 0; body += box(lerp(from[0], dest[0], p), lerp(from[1], dest[1], p), k, lost ? C.red : p >= 1 ? C.green : C.yellow, 1, lost ? lerp(1, 0.25, ease(a4 / 0.5)) : 1) + (lost ? G(dest[0], dest[1], pop(a4), T(0, 30, "✗", 90, { fill: C.red })) : ""); }
    const whole = step === 0 ? G(250, 520, 1.3 * pop(total), icon(s.icon || "file", "")) : "";
    return svg(`${heading(s.title, 1)}${routers}${whole}${body}${T(250, 760, s.from || "", 44, { font: "Elite", fill: C.dim })}${step >= 2 ? T(1630, 760, s.to || "", 44, { font: "Elite", fill: C.dim }) : ""}${caption((s.captions || [])[step], age, 930)}`);
  },
  // A picture is a grid of coloured squares, each square three numbers; and most of it does not change from one picture to the next.
  //   0 the picture  1 closer: squares and their numbers  2 back out  3 only what changed is sent
  pixels(s, step, age, total) {
    const CW = 32, CH = 18, S = 40, gx = 960 - CW * S / 2, gy = 230, a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age);
    const z = step === 1 ? ease(a1 / 0.9) : step === 2 ? 1 - ease(a2 / 0.7) : 0, sc = 1 + 3.2 * z, fx = gx + 13.5 * S, fy = gy + 9.5 * S;
    const colour = (i, j) => { const dx = (i - 15.5) / 6.6, dy = (j - 10.6) / 5.2;
      if (j >= 2 && j <= 4 && i >= 10 && i <= 21) return j === 4 ? "#ff5fae" : "#16182b"; if (j === 5 && i >= 7 && i <= 24) return "#16182b";
      if ((i === 13 || i === 18) && j === 9) return "#2a6fdb"; if ((i >= 12 && i <= 14 || i >= 17 && i <= 19) && j >= 8 && j <= 10) return "#f4f6ff";
      if (j === 13 && i >= 14 && i <= 17) return "#7a1040"; if (dx * dx + dy * dy < 1) return j > 12 ? "#f0429a" : "#ff5fae"; if (j >= 15 && i >= 9 && i <= 22) return "#c9a36a";
      return (i + j) % 7 === 0 ? "#1d2a63" : "#172152"; };
    const changed = (i, j) => (j === 13 || j === 12) && i >= 13 && i <= 18 || (j === 9 && (i === 13 || i === 18));
    let cellsS = ""; for (let j = 0; j < CH; j++) for (let i = 0; i < CW; i++) { const ch = changed(i, j), dim = a3 > 0 && !ch ? lerp(1, 0.16, ease(a3 / 0.6)) : 1;
      cellsS += `<rect x="${gx + i * S}" y="${gy + j * S}" width="${S + (z > 0.05 || a3 > 0 ? -2 : 0.6)}" height="${S + (z > 0.05 || a3 > 0 ? -2 : 0.6)}" fill="${colour(i, j)}" opacity="${dim}" ${a3 > 0.4 && ch ? `stroke="${C.yellow}" stroke-width="3"` : ""}/>`; }
    const nums = z > 0.7 ? `<g opacity="${clamp((z - 0.7) / 0.3)}">${[[13, 9, "42,111,219"], [12, 9, "244,246,255"], [14, 10, "244,246,255"], [13, 11, "255,95,174"]].map(([i, j, t]) => `<text x="${gx + i * S + S / 2}" y="${gy + j * S + S / 2 + 3}" text-anchor="middle" font-family="Elite" font-size="6" fill="${t.startsWith("42") ? "#fff" : "#05060d"}">${t}</text>`).join("")}</g>` : "";
    return svg(`${heading(s.title, 1, 140)}<g transform="translate(${fx} ${fy}) scale(${sc}) translate(${-fx} ${-fy})">${cellsS}${nums}</g><rect x="${gx - 6}" y="${gy - 6}" width="${CW * S + 12}" height="${CH * S + 12}" rx="10" fill="none" stroke="${C.line}" stroke-opacity="${z > 0.05 ? 0 : 0.5}" stroke-width="5"/>
      ${a3 > 0.8 && s.sent ? G(1500, 880, pop(a3 - 0.8), `<rect x="-250" y="-56" width="500" height="112" rx="20" fill="${C.ink}" stroke="${C.yellow}" stroke-width="5"/>${T(0, 22, s.sent, 58, { fill: C.yellow })}`) : ""}${caption((s.captions || [])[step], age, 1010)}`);
  },
  // Where the time goes: a bar of milliseconds that grows a part at a time, against the line where a conversation still feels natural.
  budget(s, step, age) {
    const max = s.max || 400, x0 = 260, W = 1400, y = 470, h = 120, X = (ms) => x0 + ms / max * W; let acc = 0, body = "";
    s.parts.forEach((p, i) => { const a = since(i, step, age), from = acc; acc += p.ms; if (a < 0) return; const g = ease(a / 0.6), w = (X(from + p.ms) - X(from)) * g, up = i % 2 === 0;
      body += `<rect x="${X(from)}" y="${y}" width="${Math.max(0, w - 4)}" height="${h}" rx="12" fill="${p.color || [C.cyan, C.pink, C.yellow, C.green, C.dim][i % 5]}"/>
        <g opacity="${clamp((a - 0.3) / 0.3)}"><path d="M${X(from + p.ms / 2)} ${up ? y - 8 : y + h + 8}V${up ? y - 46 : y + h + 46}" stroke="${C.line}" stroke-width="4"/>${T(X(from + p.ms / 2), up ? y - 96 : y + h + 92, p.label, 40, { font: "Elite" })}${T(X(from + p.ms / 2), up ? y - 56 : y + h + 136, p.text ?? p.ms + " ms", 36, { font: "Elite", fill: C.yellow })}</g>`; });
    const shown = s.parts.slice(0, Math.min(step, s.parts.length - 1) + 1).reduce((t, p) => t + p.ms, 0);
    const mark = (ms, label, col) => `<path d="M${X(ms)} ${y - 150}V${y + h + 190}" stroke="${col}" stroke-width="5" stroke-dasharray="14 12"/>${T(X(ms), y + h + 250, label, 40, { font: "Elite", fill: col })}`;
    return svg(`${heading(s.title, 1)}<rect x="${x0}" y="${y}" width="${W}" height="${h}" rx="12" fill="${C.navy}" stroke="${C.line}" stroke-opacity=".4" stroke-width="4"/>${body}${mark(s.good || 150, s.goodLabel || "", C.green)}${s.bad ? mark(s.bad, s.badLabel || "", C.red) : ""}
      ${G(960, 270, 1, T(0, 0, (s.totalLabel || "") + " " + shown + " ms", 60, { fill: shown > (s.good || 150) ? C.red : C.yellow }))}`);
  },
  // ---- Boards for a picture that has to work in any language (explain-crypto-01-world): each tells its story with drawings,
  // and the only text is a name, a year, a number or a word or two.

  // A title card made of pictures: the coin in the middle, and on either side the two things it does without (`left`, `right`,
  // icon names, default a bank and a bank note), each struck through in turn. `title` and `sub` (e.g. "1 / 5") under it.
  cover(s, step, age, total) {
    const side = (x, name, a, ca) => (a <= 0 ? "" : G(x, 430, 1.25 * pop(a), `<circle r="150" fill="${C.panel}" opacity=".7"/>${icon(name)}`) + strike(x, 430, ca, 120));
    return svg(`<circle cx="960" cy="420" r="230" fill="${C.yellow}" opacity=".28" filter="url(#bglow)"/>
      ${G(960, 420, 2.1 * pop(total), `<g transform="rotate(${8 * Math.sin(total * 1.3)})">${icon("coin", C.gold, s.coin || "B")}</g>`)}
      ${side(470, s.left || "bank", total - 0.7, total - 1.2)}${side(1450, s.right || "cash", total - 0.9, total - 1.5)}
      <g opacity="${clamp((total - 0.3) / 0.3)}">${T(960, 790, s.title, 150, { fill: C.yellow })}</g>
      <rect x="${960 - 260 * ease((total - 0.5) / 0.5)}" y="818" width="${520 * ease((total - 0.5) / 0.5)}" height="10" rx="5" fill="${C.pink}"/>
      <g opacity="${clamp((total - 0.7) / 0.3)}">${T(960, 910, s.sub, 64, { fill: C.dim })}</g>`);
  },
  // Where money came from, in pictures, one scene per step:
  //   0 a fish swapped for a loaf   1 the baker wants no fish: no deal   2 salt, a shell, a stone wheel bigger than a car
  //   3 gold   4 the gold goes to a trusted man's safe and his receipt changes hands   5 `year`: the note is cut loose from the gold
  //   6 the note becomes numbers on a screen (`balance`)
  money(s, step, age, total) {
    const a = age, st = Math.min(step, 6), fade = (t) => clamp(t / 0.35);
    let body = "", head = "";
    const who = (x, y, col, sc = 1.15, extra = "") => G(x, y, sc, icon("person", col), extra);
    if (st <= 1) {
      const A = 600, B = 1320, y = 600, p = st === 0 ? ease((a - 0.5) / 1.1) : 0, ya = 470;
      const fx = lerp(A + 170, B - 170, p), fy = ya - 170 * Math.sin(Math.PI * p), bx = lerp(B - 170, A + 170, p), by = ya + 90 * Math.sin(Math.PI * p);
      const shake = st === 1 ? 14 * Math.sin(a * 42) * Math.exp(-Math.max(0, a - 0.5) * 4) * (a > 0.5 ? 1 : 0) : 0, slump = st === 1 ? ease((a - 1.0) / 0.6) : 0;
      body += who(A, y + 18 * slump, C.cyan, 1.15 - 0.08 * slump, `opacity="${1 - 0.35 * slump}"`) + who(B + shake, y, C.pink);
      body += G(fx, fy, 0.75, icon("fish")) + G(bx, by, 0.7, icon("bread"));
      if (st === 0) body += `<g opacity="${clamp(total / 0.4) * (1 - clamp((p - 0.8) / 0.2) * 0.6)}"><path d="M800 410Q960 330 1120 410" fill="none" stroke="${C.line}" stroke-width="7" stroke-dasharray="14 12"/><path d="M1120 410l-30 -2l14 -24z" fill="${C.line}"/><path d="M1120 520Q960 590 800 520" fill="none" stroke="${C.line}" stroke-width="7" stroke-dasharray="14 12"/><path d="M800 520l30 4l-16 22z" fill="${C.line}"/></g>`;
      else body += `<path d="M800 430H${lerp(800, 1100, ease(a / 0.4))}" stroke="${C.line}" stroke-width="7" stroke-dasharray="14 12"/>` + strike(960, 440, a - 0.45, 70)
        + (a > 1.1 ? G(A, 330, pop(a - 1.1), `<path d="M-90 40Q-100 -60 0 -64Q100 -60 90 40Q60 70 0 64L-30 92L-26 62Q-80 58 -90 40Z" fill="${C.navy}" stroke="${C.line}" stroke-width="5"/>${G(0, -2, 0.42, icon("bread"))}`) + strike(A, 328, a - 1.4, 46) : "");
    } else if (st === 2) {
      body += G(480, 560, 1.1 * pop(a - 0.1), icon("salt")) + G(820, 590, 0.9 * pop(a - 0.45), icon("shell"))
        + G(1250, 520, 2.1 * pop(a - 0.8), icon("stone")) + G(1440, 700, 0.62 * pop(a - 1.3), icon("car", C.yellow));
    } else if (st === 3) {
      const g = pop(a);
      body += `<circle cx="960" cy="560" r="260" fill="${C.yellow}" opacity=".25" filter="url(#bglow)"/>` + G(960, 600, 1.9 * g, `${G(-70, 40, 1, icon("gold"))}${G(70, 40, 1, icon("gold"))}${G(0, -50, 1, icon("gold"))}`);
      for (let k = 0; k < 5; k++) { const ph = (total * 0.9 + k * 0.23) % 1, x = 960 + [-180, 150, -60, 210, 40][k], y = 470 + [40, -10, -60, 120, 150][k], r = 26 * Math.sin(Math.PI * ph);
        body += `<path d="M${x} ${y - r}L${x + r * 0.25} ${y - r * 0.25}L${x + r} ${y}L${x + r * 0.25} ${y + r * 0.25}L${x} ${y + r}L${x - r * 0.25} ${y + r * 0.25}L${x - r} ${y}L${x - r * 0.25} ${y - r * 0.25}Z" fill="#fff" opacity=".9"/>`; }
    } else if (st === 4) {
      const gp = ease(a / 0.8), px = [1010, 1250, 1490];
      body += who(410, 600, "#8f96b8", 1, "") + G(410, 600, 1, icon("banker")) + G(640, 590, 1.3, icon("safe"));
      if (gp < 1) body += G(lerp(960, 640, gp), lerp(560, 590, gp), 1.2 * (1 - 0.7 * gp), icon("gold"));
      px.forEach((x, i) => { body += who(x, 640, [C.cyan, C.pink, C.green][i], 0.85 * pop(a - 0.5 - i * 0.12)); });
      if (a > 0.9) { const u = (a - 0.9) * 1.1, k = Math.floor(u), f = ease(u - k), from = k === 0 ? [700, 520] : [px[(k - 1) % 3], 450], to = [px[k % 3], 450];
        body += G(lerp(from[0], to[0], f), lerp(from[1], to[1], f) - 90 * Math.sin(Math.PI * f), 0.55, icon("cash")); }
    } else if (st === 5) {
      const br = a - 0.9, fall = br > 0 ? br * br * 420 : 0, bob = br > 0 ? 10 * Math.sin(total * 2.4) - Math.min(40, br * 60) : 0;
      head = heading(s.year, a, 160);
      body += G(960, 430 + bob, 1.6, icon("cash"));
      for (let k = 0; k < 5; k++) { const y = 520 + k * 44, off = br > 0 ? (k < 2 ? -Math.min(40, br * 60) : br * br * 420) : 0;     // the chain: the top links stay with the note, the rest fall with the gold
        if (k === 2 && br > 0) continue;
        body += `<rect x="944" y="${y + off}" width="32" height="40" rx="16" fill="none" stroke="#8f96b8" stroke-width="9" opacity="${br > 0 && k > 2 ? clamp(1 - br * 0.8) : 1}"/>`; }
      body += G(960, 790 + fall, 1.3, icon("gold"), `opacity="${br > 0 ? clamp(1 - br * 0.8) : 1}"`) + (br > 0 && br < 0.6 ? G(960, 610, pop(br), T(0, 26, "✂", 80, { fill: C.red })) : "");
    } else {
      const sh = ease(a / 0.7);
      body += G(960, 540, 2.3 * pop(a - 0.2), icon("mobile", C.white, C.panel)) + G(lerp(960, 960, sh), lerp(300, 520, sh), 1.2 * (1 - sh), icon("cash"));
      const v = (s.balance || 1204.5) * ease((a - 0.5) / 1.2), txt = "$" + v.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      body += a > 0.5 ? T(960, 560, txt, 38, { fill: C.green }) + `<path d="M890 600H1030M890 640H1000" stroke="${C.dim}" stroke-width="10" stroke-linecap="round" opacity=".5"/>` : "";
      body += G(560, 580, 1.1 * pop(a - 1.0), icon("laptop")) + (a > 1.2 ? T(560, 570, "0101 1101", 30, { font: "Elite", fill: C.green }) : "")
        + G(1360, 580, 0.9 * pop(a - 1.3), icon("exchange"));
    }
    return svg(head + `<g opacity="${fade(st === 0 ? total : a + 0.2)}">${body}</g>`);
  },
  // Money that the printing press made worthless:
  //   0 a press runs and notes pile up   1 one note with all its zeros (`note`)   2 a wheelbarrow of those notes = one bus ticket
  inflation(s, step, age, total) {
    let body = "";
    const note = (x, y, sc, rot = 0) => G(x, y, sc, `<g transform="rotate(${rot})">${icon("cash")}</g>`);
    if (step === 0) {
      body += G(640, 560, 1.7 * pop(total), icon("press")) + `<rect x="800" y="${560 - 4 + 3 * Math.sin(total * 30)}" width="70" height="20" fill="#4d5478"/>`;
      const n = Math.min(26, Math.floor(total * 6));
      for (let k = 0; k < n; k++) body += note(1250 + (rnd(k) - 0.5) * 120, 800 - k * 13, 0.75, (rnd(k * 3) - 0.5) * 24);
      for (let k = 0; k < 4; k++) { const ph = (total * 1.6 + k / 4) % 1; body += note(lerp(860, 1250, ph), 560 - 160 * Math.sin(Math.PI * ph) + ph * 120, 0.55, ph * 200); }
    } else if (step === 1) {
      const p = ease(age / 0.5), digits = String(s.note || "100 000 000 000 000"), shown = digits.slice(0, Math.max(1, Math.ceil(clamp((age - 0.3) / 1.2) * digits.length)));
      body += G(lerp(-400, 960, p), 540, 1, `<rect x="-720" y="-230" width="1440" height="460" rx="30" fill="#3fae6a"/><rect x="-680" y="-190" width="1360" height="380" rx="18" fill="none" stroke="#d7ffe6" stroke-width="8" opacity=".75"/>
        <circle cx="-520" cy="0" r="110" fill="#d7ffe6" opacity=".85"/>${T(-520, 46, s.currency || "$", 140, { fill: "#1f6b3e" })}${T(110, 50, shown, 128, { fill: "#0f3d22" })}`);
    } else {
      const roll = ease(age / 1.0), x = lerp(-260, 680, roll), wob = (1 - roll) * 6 * Math.sin(age * 20);
      let pile = ""; for (let k = 0; k < 22; k++) pile += note(-100 + (k % 5) * 50 + (rnd(k) - 0.5) * 30, -70 - Math.floor(k / 5) * 34 - rnd(k + 9) * 10, 0.5, (rnd(k * 5) - 0.5) * 30);
      body += G(x, 650 + wob, 1.5, pile + icon("barrow"));
      body += age > 0.9 ? G(1040, 610, pop(age - 0.9), T(0, 40, "=", 150, { fill: C.dim })) : "";
      body += G(1380, 520, 1.25 * pop(age - 0.2), icon("bus")) + (age > 1.2 ? G(1380, 760, 1.1 * pop(age - 1.2), icon("ticket")) : "") + (age > 1.2 ? G(1490, 700, 0.5 * pop(age - 1.5), T(0, 0, "×1", 110, { fill: C.pink })) : "");
    }
    return svg(heading(s.title, 1) + body + caption((s.captions || [])[step], age, 990));
  },
  // When the bank keeps the money:
  //   0 `a` (place and year): a bank with its shutter coming down, people outside   1 a pile of savings; above `cut` a blade takes
  //   `share` of it   2 `b`: the doors chained, the dollars behind bars, the years going by (`from` .. `to`)
  //   3 a message crosses the planet in `fast`; a payment between two banks takes `slow`, on a snail
  bankrun(s, step, age, total) {
    const facade = (x, y, sc, shut, lock, inside = "") => G(x, y, sc, `<path d="M-280 -150L0 -280L280 -150Z" fill="${C.white}"/><rect x="-270" y="-150" width="540" height="34" fill="${C.white}"/>
      <rect x="-70" y="-100" width="140" height="240" fill="${C.ink}" opacity=".85"/>${inside}
      ${[-210, -120, 120, 210].map((cx) => `<rect x="${cx - 24}" y="-110" width="48" height="250" rx="6" fill="${C.white}"/>`).join("")}<rect x="-300" y="140" width="600" height="36" rx="6" fill="${C.white}"/>
      ${shut > 0 ? `<rect x="-252" y="-110" width="504" height="${250 * shut}" fill="${C.muted}" stroke="${C.line}" stroke-width="4"/>${Array.from({ length: Math.floor(250 * shut / 26) }, (_, k) => `<path d="M-252 ${-110 + (k + 1) * 26}H252" stroke="${C.line}" stroke-width="3" opacity=".6"/>`).join("")}` : ""}
      ${lock > 0 ? G(0, 120, 0.5 * pop(lock), icon("lock", C.red)) : ""}`);
    let body = "", title = "";
    if (step === 0) { title = s.a;
      body += facade(960, 560, 1, ease((age - 0.4) / 1.4), age - 1.9);
      [[560, C.cyan], [1340, C.pink], [1460, C.green]].forEach(([x, c], i) => { const a = age - 1.0 - i * 0.25; body += G(x, 800, 0.6 * pop(a), icon("person", c)) + (a > 0.4 ? G(x, 660, pop(a - 0.4), T(0, 30, "?", 90, { fill: C.red })) : ""); });
    } else if (step === 1) { title = s.a;
      const N = 14, keep = 5, cw = 260, ch = 36, cx = 900, y0 = 860, share = s.share ?? 0.475, cutX = cx - cw / 2 + cw * (1 - share), blade = ease((age - 0.5) / 0.6), slide = ease((age - 1.3) / 1.0);
      body += facade(1600, 430, 0.42, 1, 1);
      for (let k = 0; k < N; k++) { const y = y0 - k * ch, top = k >= keep, a = age - k * 0.04;
        if (a <= 0) continue;
        const coin = (x0, w, dx, op) => `<rect x="${x0 + dx}" y="${y - ch + 4}" width="${w}" height="${ch - 6}" rx="12" fill="${C.gold}" stroke="#b07d10" stroke-width="4" opacity="${op}"/>`;
        if (!top || slide <= 0) body += coin(cx - cw / 2, cw, 0, 1);
        else body += coin(cx - cw / 2, cutX - (cx - cw / 2), 0, 1) + coin(cutX + 6, cx + cw / 2 - cutX - 6, slide * 300, 1 - 0.55 * slide); }
      const ly = y0 - keep * ch + 2;
      body += `<path d="M${cx - 230} ${ly}H${cx + 200}" stroke="${C.green}" stroke-width="6" stroke-dasharray="16 12"/>${T(cx - 250, ly + 16, s.cut || "€100,000", 46, { anchor: "end", fill: C.green })}`;
      if (blade > 0 && slide < 1) { const by = lerp(260, ly - 20, blade); body += `<g transform="translate(${cutX} ${by})"><path d="M-10 -150H10V0L0 30L-10 0Z" fill="#c9cee6" stroke="#4d5478" stroke-width="4"/><rect x="-20" y="-220" width="40" height="80" rx="10" fill="#8a5a1c"/></g>`; }
      if (slide > 0) body += `<g opacity="${clamp(slide / 0.3)}">${T(cutX + 160 + slide * 300, ly - 360, "−" + Math.round(share * 1000) / 10 + "%", 84, { fill: C.red })}</g>`;
    } else if (step === 2) { title = s.b;
      const bars = `${[-50, -18, 14, 46].map((x) => `<rect x="${x - 5}" y="-100" width="10" height="240" fill="#8f96b8"/>`).join("")}`, money = `${G(-20, 40, 0.42, icon("cash"))}${G(20, 90, 0.42, icon("cash"))}`;
      body += facade(960, 560, 1, 0, 0, money + bars) + `<path d="M-60 0L60 60M60 0L-60 60" transform="translate(960 560)" stroke="#8f96b8" stroke-width="12" stroke-linecap="round" opacity="${clamp(age / 0.5)}"/>` + (age > 0.4 ? G(960, 610, 0.5 * pop(age - 0.4), icon("lock", C.red)) : "");
      const from = s.from ?? 2019, to = s.to ?? 2025, yr = Math.min(to, from + Math.floor(Math.max(0, age - 0.8) * 1.3));
      body += G(1460, 360, 0.85 * pop(age - 0.6), icon("calendar", C.red, yr)) + G(470, 790, 0.62, icon("person", C.cyan)) + (age > 1.2 ? G(470, 650, pop(age - 1.2), T(0, 30, "?", 90, { fill: C.red })) : "");
    } else {
      const fly = (age % 1.6) / 1.0, f = ease(clamp(fly)), crawl = ease(age / 9);
      body += G(500, 380, 0.75, icon("mobile")) + G(1420, 380, 0.75, icon("mobile")) + `<path d="M590 360Q960 220 1330 360" fill="none" stroke="${C.line}" stroke-width="5" stroke-dasharray="12 12" opacity=".6"/>`
        + (fly <= 1 ? G(lerp(590, 1330, f), lerp(360, 360, f) - 140 * Math.sin(Math.PI * f), 0.42, icon("envelope", C.cyan)) : "") + T(960, 220, s.fast || "1 s", 64, { fill: C.cyan });
      body += G(500, 760, 0.6, icon("bank")) + G(1420, 760, 0.6, icon("bank")) + `<path d="M600 840H1320" stroke="${C.line}" stroke-width="5" stroke-dasharray="4 16" opacity=".6"/>`
        + G(lerp(640, 1240, crawl), 800, 0.6, icon("snail") + G(-10, -110, 0.5, icon("coin"))) + T(960, 950, s.slow || "3 DAYS", 64, { fill: C.red });
    }
    return svg(heading(title, 1) + body + caption((s.captions || [])[step], age, 990));
  },
  // The three jobs of money, one little action each, a panel per step: 0 pay (a note goes over, a loaf comes back)
  //   1 put a price on things (a tag swings on a loaf)   2 save (a coin drops into a jar; the days go by; it is still there).
  //   `labels` are optional words under the panels.
  jobs(s, step, age, total) {
    const xs = s.x || [470, 890, 1310], y = 540;
    const panel = (i, inner) => { const a = since(i, step, age); if (a < 0) return ""; const now = i === Math.min(step, 2);
      return `<g transform="translate(${xs[i]} ${y}) scale(${0.94 + 0.06 * pop(a)})" opacity="${clamp(a / 0.2)}"><rect x="-200" y="-250" width="400" height="500" rx="30" fill="${C.navy}" stroke="${now ? C.yellow : C.line}" stroke-opacity="${now ? 1 : 0.4}" stroke-width="6"/>
        <circle cx="0" cy="-250" r="40" fill="${now ? C.yellow : C.panel}"/>${T(0, -232, String(i + 1), 54, { fill: C.ink })}${inner(a)}${(s.labels || [])[i] ? T(0, 226, s.labels[i], 44, { fill: now ? C.white : C.dim }) : ""}</g>`; };
    const pay = (a) => { const p = ease((a - 0.3) / 0.8), q = ease((a - 1.3) / 0.8);
      return G(-100, 80, 0.75, icon("person", C.cyan)) + G(100, 80, 0.75, icon("person", C.pink)) + G(lerp(-80, 80, p), -50 - 80 * Math.sin(Math.PI * p), 0.62, icon("cash")) + (a > 1.3 ? G(lerp(80, -80, q), -50 - 70 * Math.sin(Math.PI * q), 0.55, icon("bread")) : ""); };
    const price = (a) => `<path d="M40 -150L60 -40" stroke="${C.dim}" stroke-width="4"/>${G(0, 70, 1.3, icon("bread"))}<g transform="translate(60 -150) rotate(${16 * Math.sin(a * 3.2) * Math.exp(-a * 0.6)}) translate(-60 150)">${G(74, -50, 0.62 * pop(a - 0.2), icon("tag"))}</g>`;
    const save = (a) => { const drop = clamp((a - 0.2) / 0.55), cy = lerp(-200, 106, drop * drop), day = Math.max(0, Math.floor((a - 0.9) / 1.3)), ph = ((a - 0.9) / 1.3) % 1;
      return (a > 0.9 ? G(lerp(-150, 150, ph), -150 - 50 * Math.sin(Math.PI * ph), 0.28, day % 2 ? `<circle r="70" fill="#c9cee6"/><circle cx="26" cy="-14" r="60" fill="${C.navy}"/>` : `<circle r="70" fill="${C.yellow}"/>`) : "")
        + G(0, 66, 1.1, icon("jar")) + G(0, cy, 0.5, icon("coin"))
        + (a > 0.9 ? G(130, -150, 0.36, icon("calendar", C.red, day + 1)) : ""); };
    return svg(heading(s.title, 1) + panel(0, pay) + panel(1, price) + panel(2, save));
  },
  // Words from the humans' dictionary without the dictionary: the word in big letters, an optional `root` under it, and a little
  // scene for what it means. One word per step; `pic` is "hidden" (a message locked into gibberish) or "p2p" (a coin straight
  // from one person to another, the bank in the middle dropping out).
  glossary(s, step, age, total) {
    const it = s.items[Math.min(step, s.items.length - 1)], a = age;
    let pic = "";
    if (it.pic === "hidden") {
      const paper = (x, inner, a2) => G(x, 640, pop(a2), `<rect x="-120" y="-150" width="240" height="300" rx="16" fill="${C.paper}" stroke="#cfc8b4" stroke-width="5"/>${inner}`);
      const lines = [-80, -30, 20, 70].map((y, k) => `<rect x="-80" y="${y}" width="${k === 3 ? 100 : 160}" height="18" rx="9" fill="#8f96b8"/>`).join("");
      const tick = Math.floor(total * 8), junk = [-80, -30, 20, 70].map((y, k) => Array.from({ length: 5 }, (_, j) => `<rect x="${-80 + j * 34}" y="${y}" width="26" height="20" rx="4" fill="${[C.pink, C.cyan, C.green, C.yellow][Math.floor(rnd(tick * 13 + k * 7 + j) * 4)]}"/>`).join("")).join("");
      pic = paper(560, lines, a - 0.2) + (a > 0.5 ? `<path d="M720 640H820" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/><path d="M836 640l-26 -18v36z" fill="${C.line}"/>` : "")
        + G(960, 640, 1.1 * pop(a - 0.6), icon("lock")) + (a > 0.9 ? `<path d="M1100 640H1200" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/><path d="M1216 640l-26 -18v36z" fill="${C.line}"/>` : "") + paper(1360, junk, a - 1.0);
    } else {
      const drop = ease((a - 0.6) / 0.7), q = Math.max(0, a - 1.2), ph = (q / 1.4) % 2, f = ease(ph < 1 ? ph : 2 - ph);
      pic = G(560, 660, 1.15 * pop(a - 0.1), icon("person", C.cyan)) + G(1360, 660, 1.15 * pop(a - 0.2), icon("person", C.pink))
        + G(960, 640 + 260 * drop, 0.9 * pop(a - 0.3), icon("bank"), `opacity="${1 - 0.75 * drop}"`) + strike(960, 640 + 260 * drop, a - 0.9, 100)
        + (a > 1.2 ? `<path d="M700 560H1220" stroke="${C.line}" stroke-width="6" stroke-dasharray="14 12" opacity=".6"/>` + G(lerp(700, 1220, f), 560 - 60 * Math.sin(Math.PI * f), 0.5, icon("coin")) : "");
    }
    return svg(`${G(960, 270, pop(a), T(0, 0, it.word, 140, { fill: C.yellow }))}${it.root ? `<g opacity="${clamp((a - 0.3) / 0.3)}">${T(960, 360, it.root, 50, { font: "Elite", fill: C.dim })}</g>` : ""}${pic}
      ${T(960, 1010, s.items.map((_, i) => (i === Math.min(step, s.items.length - 1) ? "●" : "○")).join("  "), 36, { fill: C.dim })}`);
  },
  // The recap as three pictures that come in on the narrator's "one, two, three" (`at`: seconds after the board appears):
  //   1 two people and the ledger between them   2 the ledger kept by a bank   3 the ledger copied to everyone. `labels` optional.
  recap(s, step, age, total) {
    const xs = [420, 900, 1380], at = s.at || [0.3, 3, 6];
    const panel = (i, inner) => { const a = total - at[i]; if (a <= 0) return ""; const now = i === 2 ? true : total < at[i + 1];
      return `<g transform="translate(${xs[i]} 400) scale(${0.94 + 0.06 * pop(a)})" opacity="${clamp(a / 0.2) * (now ? 1 : 0.75)}"><rect x="-210" y="-210" width="420" height="420" rx="30" fill="${C.navy}" stroke="${now ? C.yellow : C.line}" stroke-opacity="${now ? 1 : 0.4}" stroke-width="6"/>
        <circle cx="0" cy="-210" r="40" fill="${now ? C.yellow : C.panel}"/>${T(0, -192, String(i + 1), 54, { fill: C.ink })}${inner(a)}${(s.labels || [])[i] ? T(0, 290, s.labels[i], 48, { fill: now ? C.white : C.dim }) : ""}</g>`; };
    const one = (a) => G(-105, 100, 0.72, icon("person", C.cyan)) + G(105, 100, 0.72, icon("person", C.pink)) + G(0, -50, 0.8, icon("book")) + (a > 0.5 ? `<path d="M-40 -60l22 22l46 -50" fill="none" stroke="${C.green}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" stroke-dashoffset="${120 * (1 - ease((a - 0.5) / 0.4))}"/>` : "");
    const two = (a) => G(0, -20, 1.3, icon("bank")) + G(0, 120, 0.62 * pop(a - 0.3), icon("book")) + (a > 0.6 ? G(130, 120, 0.4 * pop(a - 0.6), icon("lock")) : "");
    const three = (a) => { let o = G(0, 10, 0.6, icon("book")); for (let k = 0; k < 6; k++) { const th = k / 6 * Math.PI * 2 - Math.PI / 2, x = Math.cos(th) * 150, y = Math.sin(th) * 130 + 30, p = ease((a - 0.3 - k * 0.12) / 0.5);
        o += G(x, y + 20, 0.4 * pop(a - k * 0.1), icon("person", [C.cyan, C.pink, C.green, C.yellow, C.red, C.line][k])) + (p > 0 ? G(lerp(0, x * 0.8, p), lerp(0, y * 0.8 - 30, p), 0.2, icon("book")) : ""); }
      return o; };
    return svg(panel(0, one) + panel(1, two) + panel(2, three));
  },
  // The closing frame without a sentence: `title` (e.g. "NEXT"), `next` (e.g. "2 / 5"), and `icons` for what the next report is about,
  // with the same room as `endcard` for the platform's end-screen elements.
  // The last card of a Short: the channel name, the full report as a video with a play button (two `icons` either side of it, `sub`
  // under it, e.g. "CRYPTO FILE · 1/5"), and at step 1 a ringing bell with SUBSCRIBE. Nothing outside x 340..1580, so it
  // survives the vertical crop (studio.html, boardZoom 0.85).
  shortend(s, step, age, total) {
    const ic = s.icons || [], n = ic.length, f = pop(total - 0.15), b = step >= 1 ? age : -1, swing = b > 0 ? 22 * Math.sin(b * 16) * Math.exp(-b * 2.2) : 0;
    const bell = `<path d="M-62 44C-62 -46 -40 -82 0 -82C40 -82 62 -46 62 44L80 62H-80Z" fill="${C.yellow}"/><path d="M-62 44C-62 -46 -40 -82 0 -82" fill="none" stroke="#fff3b0" stroke-width="10" opacity=".6"/>
      <circle cy="-92" r="14" fill="${C.yellow}"/><circle cy="80" r="20" fill="${C.gold}"/>`;
    const waves = b > 0 ? [1, -1].map((d) => `<path d="M${d * 104} -40Q${d * 128} 0 ${d * 104} 40M${d * 134} -62Q${d * 166} 0 ${d * 134} 62" fill="none" stroke="${C.yellow}" stroke-width="9" stroke-linecap="round" opacity="${clamp(1 - (b % 0.6) / 0.6)}"/>`).join("") : "";
    return svg(`${G(960, 150, pop(total), `<text x="0" y="0" text-anchor="middle" font-family="Anton" font-size="118"><tspan fill="#eef0ff">EARTH </tspan><tspan fill="${C.pink}">REPORT</tspan></text>`)}
      ${G(960, 455, f, `<rect x="-400" y="-225" width="800" height="450" rx="30" fill="${C.panel}" stroke="${C.line}" stroke-width="6"/>
        ${ic.slice(0, 2).map((name, i) => G(i ? 255 : -255, -10, 0.72, icon(name), 'opacity=".6"')).join("")}
        <circle r="96" fill="${C.pink}"/><path d="M-30 -52L58 0L-30 52Z" fill="#fff"/>`)}
      ${G(960, 780, pop(total - 0.45), T(0, 0, "FULL REPORT", 86, { fill: C.yellow }) + T(0, 70, s.sub || "", 50, { fill: C.dim }))}
      ${b >= 0 ? G(960, 965, pop(b), G(-250, 0, 0.82, `<g transform="rotate(${swing} 0 -92)">${bell}</g>${waves}`) + `<rect x="-140" y="-56" width="420" height="112" rx="56" fill="#ff2d3a"/>` + T(70, 26, "SUBSCRIBE", 70, { fill: "#ffffff" })) : ""}`);
  },
  endnext(s, step, age, total) {
    const ic = s.icons || [], n = ic.length;
    return svg(`${G(960, 130, pop(total), T(0, 0, s.title, 96, { fill: C.yellow }) + T(0, 66, s.next || "", 50, { fill: C.dim }))}
      ${ic.map((name, i) => G(960 + (i - (n - 1) / 2) * 190, 300, 0.55 * pop(total - 0.4 - i * 0.2), icon(name))).join("")}
      <rect x="250" y="390" width="760" height="428" rx="24" fill="none" stroke="${C.line}" stroke-width="5" stroke-dasharray="20 16" opacity=".5"/><circle cx="1420" cy="604" r="170" fill="none" stroke="${C.pink}" stroke-width="5" stroke-dasharray="20 16" opacity=".6"/>
      <g opacity="${clamp((total - 0.6) / 0.3)}">${T(960, 930, s.note || "", 46, { font: "Elite", fill: C.dim })}</g>`);
  },
  // "The bank is a ledger": five full-frame illustrated shots with nothing to read, one per beat (sets/bank.js).
  // The host is not in them; give a beat `host: "left"` or `"right"` and he leans in from that side.
  trail: (s, step, age, total) => bankSet(s, step, age, total),
  // Crypto part 1, scene by scene, in the world of the bank set (sets/<scene>.js): one wordless shot per beat, `ends` from sets/beats.cjs.
  money: (s, step, age, total) => moneySet(s, step, age, total),
  intro: (s, step, age, total) => introSet(s, step, age, total),
  middle: (s, step, age, total) => middleSet(s, step, age, total),
  copy: (s, step, age, total) => copySet(s, step, age, total),
  crisis: (s, step, age, total) => crisisSet(s, step, age, total),
  paper: (s, step, age, total) => paperSet(s, step, age, total),
  idea: (s, step, age, total) => ideaSet(s, step, age, total),
  genesis: (s, step, age, total) => genesisSet(s, step, age, total),
  pizza: (s, step, age, total) => pizzaSet(s, step, age, total),
  vanish: (s, step, age, total) => vanishSet(s, step, age, total),
  dict: (s, step, age, total) => dictSet(s, step, age, total),
  recap: (s, step, age, total) => recapSet(s, step, age, total),
};

// Picks the palette for what is drawn next (boards and icons). `theme` is a name from THEMES, an object of colours, or empty for the default.
export function useTheme(theme) { C = themeOf(theme); return C; }
export function board(spec, step, age, total, cfg = {}) {
  useTheme(cfg.theme);
  const fn = BOARDS[spec.kind]; if (!fn) return `<div style="color:#fff;font:40px Anton;padding:80px">unknown board: ${esc(spec.kind)}</div>`;
  return fn(spec, step, age, total, cfg);
}
export const BOARD_KINDS = Object.keys(BOARDS);
export { icon, THEMES };
