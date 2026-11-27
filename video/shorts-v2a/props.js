// Props of the bathroom world: the toilet, four unbranded bottles, the gas, sparkles, small pictograms.
import { clamp, lerp, G, T, n2, star, rnd, noise } from "./kit.js";
import { C } from "./palette.js";

export const propDefs = `
  <linearGradient id="pPorc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.white}"/><stop offset=".55" stop-color="${C.porcelain}"/><stop offset="1" stop-color="${C.porcelainLo}"/></linearGradient>
  <linearGradient id="pPorc2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.white}"/><stop offset=".6" stop-color="${C.porcelain}"/><stop offset="1" stop-color="#B9D3DD"/></linearGradient>
  <linearGradient id="pWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.waterHi}"/><stop offset="1" stop-color="${C.water}"/></linearGradient>
  <linearGradient id="pBleach" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#F1F1F6"/><stop offset="1" stop-color="#C9CCE0"/></linearGradient>
  <linearGradient id="pRed" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF7566"/><stop offset=".6" stop-color="${C.red}"/><stop offset="1" stop-color="${C.redLo}"/></linearGradient>
  <linearGradient id="pGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9BE4FF"/><stop offset=".6" stop-color="${C.water}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient>
  <linearGradient id="pVin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6C7"/><stop offset=".6" stop-color="#F4E089"/><stop offset="1" stop-color="#D7B94A"/></linearGradient>
  <radialGradient id="pGasG" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="${C.gasHi}"/><stop offset=".7" stop-color="${C.gas}"/><stop offset="1" stop-color="${C.gasLo}"/></radialGradient>
  <filter id="goo" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1680" height="2520"><feGaussianBlur in="SourceGraphic" stdDeviation="16"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -10"/></filter>
  <filter id="soft" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1680" height="2520"><feGaussianBlur stdDeviation="26"/></filter>
  <filter id="soft2" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1680" height="2520"><feGaussianBlur stdDeviation="60"/></filter>`;

export const sparkle = (x, y, r, t, phase = 0, color = "#fff") => { const k = 0.5 + 0.5 * Math.sin(t * 7 + phase * 6.283); return k < 0.08 ? "" : `<path d="${star(r * (0.4 + 0.6 * k))}" transform="translate(${n2(x)} ${n2(y)}) rotate(${n2(t * 40 + phase * 90)})" fill="${color}" opacity="${n2(0.5 + 0.5 * k)}"/>`; };

// Toilet, base centred on the origin. lid: 0 shut .. 1 open. squash for bounces. extra: drawn on the tank front.
export function toilet({ lid = 1, squash = 0, shine = 0, t = 0, doctor = 0, cap = 0, capSwing = 0, water = 1 } = {}) {
  const ly = lerp(-268, -392, lid), lry = lerp(50, 118, lid);
  const coat = doctor > 0.01 ? `<g opacity="${n2(clamp(doctor * 2))}" transform="translate(0 ${n2((1 - clamp(doctor)) * -60)})">
      <path d="M-150 -246 C-150 -120 -92 -72 -72 -60 L-78 -8 L78 -8 L72 -60 C92 -72 150 -120 150 -246 C100 -216 40 -206 0 -206 C-40 -206 -100 -216 -150 -246Z" fill="#fff"/>
      <path d="M0 -206 L-46 -150 L-20 -120 L0 -150 L20 -120 L46 -150 Z" fill="${C.porcelainLo}"/><path d="M0 -150 L0 -10" stroke="${C.porcelainLo}" stroke-width="5"/>
      <circle cx="14" cy="-110" r="6" fill="${C.blue}"/><circle cx="14" cy="-70" r="6" fill="${C.blue}"/>
      <rect x="-110" y="-150" width="46" height="34" rx="6" fill="none" stroke="${C.porcelainLo}" stroke-width="5"/><rect x="-96" y="-162" width="8" height="26" rx="3" fill="${C.red}"/>
      <path d="M-96 -268 C-130 -180 -70 -120 -20 -150 M96 -268 C130 -190 90 -150 60 -120" fill="none" stroke="${C.indigo}" stroke-width="10" stroke-linecap="round"/>
      <circle cx="58" cy="-108" r="22" fill="${C.lilac}"/><circle cx="58" cy="-108" r="11" fill="${C.indigo}"/></g>` : "";
  const hat = cap > 0.01 ? `<g transform="translate(0 ${n2(-600 - (1 - clamp(cap)) * 500)}) rotate(${n2((1 - clamp(cap)) * -40 - 6)})">
      <path d="M-70 10 L70 10 L60 60 Q0 80 -60 60Z" fill="${C.ink}"/><path d="M-150 0 L0 -52 L150 0 L0 52Z" fill="${C.indigo}"/><path d="M-150 0 L0 52 L150 0 L150 10 L0 62 L-150 10Z" fill="${C.ink}"/>
      <circle cx="0" cy="0" r="10" fill="${C.sun}"/><g transform="rotate(${n2(capSwing)} 0 0)"><path d="M0 0 L112 22 L112 92" fill="none" stroke="${C.sun}" stroke-width="7" stroke-linejoin="round"/><path d="M100 90 h24 l6 44 h-36z" fill="${C.sun}"/></g></g>` : "";
  const inner = `
    <ellipse cx="0" cy="6" rx="190" ry="26" fill="${C.ink}" opacity=".22"/>
    <rect x="-142" y="-530" width="284" height="250" rx="34" fill="url(#pPorc)"/>
    <rect x="-156" y="-556" width="312" height="52" rx="24" fill="${C.white}"/><rect x="-156" y="-520" width="312" height="16" rx="8" fill="${C.porcelainLo}" opacity=".7"/>
    <ellipse cx="0" cy="-548" rx="26" ry="9" fill="${C.porcelainLo}"/><ellipse cx="0" cy="-551" rx="20" ry="6" fill="#E9F2F5"/>
    <ellipse cx="0" cy="${n2(ly)}" rx="134" ry="${n2(lry)}" fill="${C.white}"/><ellipse cx="0" cy="${n2(ly + 4)}" rx="${n2(112)}" ry="${n2(lry * 0.8)}" fill="${C.porcelain}" opacity="${n2(lid)}"/>
    <path d="M-150 -250 C-150 -120 -92 -72 -72 -60 L-82 0 L82 0 L72 -60 C92 -72 150 -120 150 -250 Z" fill="url(#pPorc2)"/>
    <path d="M-82 0 L82 0 L78 -22 L-78 -22Z" fill="${C.porcelainLo}" opacity=".6"/>
    <ellipse cx="0" cy="-252" rx="156" ry="50" fill="${C.white}"/><ellipse cx="0" cy="-250" rx="118" ry="33" fill="#B5CDD6"/>
    ${water > 0 ? `<ellipse cx="0" cy="-242" rx="${n2(104)}" ry="24" fill="url(#pWater)"/><ellipse cx="-30" cy="-248" rx="34" ry="6" fill="#fff" opacity=".6"/>` : ""}
    <path d="M-150 -252 a150 46 0 0 0 300 0" fill="none" stroke="${C.porcelainLo}" stroke-width="5" opacity=".7"/>
    ${lid < 0.5 ? `<ellipse cx="0" cy="${n2(ly)}" rx="150" ry="${n2(lry)}" fill="${C.white}"/><ellipse cx="-40" cy="${n2(ly - 12)}" rx="60" ry="10" fill="#fff"/>` : ""}
    <path d="M-110 -470 q14 -30 46 -34" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".9"/>
    ${coat}${hat}
    ${shine > 0 ? [[-170, -500, 30, 0], [176, -420, 22, 0.3], [-190, -230, 24, 0.6], [150, -150, 30, 0.15], [0, -600, 26, 0.8], [200, -560, 18, 0.45]].map(([x, y, r, ph]) => sparkle(x, y, r * shine, t, ph)).join("") : ""}`;
  return G(`scale(${n2(1 + squash * 0.6)} ${n2(1 - squash)})`, inner);
}

const tag = (inner, w = 84, h = 84, fill = "#fff") => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="16" fill="${fill}"/>${inner}`;
export const pictToilet = (c = C.red) => `<rect x="-17" y="-26" width="34" height="22" rx="5" fill="${c}"/><path d="M-22 0 h44 c0 16 -10 24 -22 24 c-12 0 -22 -8 -22 -24z" fill="${c}"/><rect x="-24" y="-5" width="48" height="7" rx="3.5" fill="${c}"/>`;
export const pictWindow = (c = C.blue) => `<rect x="-24" y="-24" width="48" height="48" rx="6" fill="none" stroke="${c}" stroke-width="7"/><path d="M0 -24 V24 M-24 0 H24" stroke="${c}" stroke-width="6"/>`;
export const pictDrop = (c = "#B89B24") => `<path d="M0 -26 C16 -6 20 4 20 12 a20 20 0 0 1 -40 0 C-20 4 -16 -6 0 -26Z" fill="${c}"/>`;
// Bottles stand on the origin, about 300 high.
export const bottles = {
  bleach: () => `<path d="M-84 -6 Q-84 0 -76 0 H76 Q84 0 84 -6 V-180 C84 -214 50 -224 40 -246 H-28 C-40 -224 -84 -214 -84 -180Z" fill="url(#pBleach)"/>
    <path d="M40 -232 C92 -230 96 -150 60 -128" fill="none" stroke="#DADDED" stroke-width="20" stroke-linecap="round"/>
    <rect x="-34" y="-292" width="80" height="50" rx="12" fill="${C.blue}"/><rect x="-34" y="-258" width="80" height="16" rx="6" fill="${C.blueLo}"/>
    <g transform="translate(-6 -108)"><path d="M0 -62 L62 0 L0 62 L-62 0Z" fill="${C.blue}"/><text x="0" y="19" text-anchor="middle" font-family="Anton, sans-serif" font-size="56" fill="#fff">Cl</text></g>
    <path d="M-66 -30 V-170" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".8"/>`,
  toilet: () => `<path d="M-64 -6 Q-64 0 -56 0 H56 Q64 0 64 -6 V-170 C64 -200 34 -206 30 -226 L-6 -292 L-44 -274 L-22 -224 C-40 -206 -64 -200 -64 -170Z" fill="url(#pRed)"/>
    <g transform="translate(-30 -292) rotate(-28)"><rect x="-26" y="-34" width="52" height="40" rx="10" fill="${C.ink}"/></g>
    <g transform="translate(0 -100)">${tag(pictToilet())}</g><path d="M-48 -26 V-160" stroke="#FFB0A6" stroke-width="10" stroke-linecap="round" opacity=".8"/>`,
  vinegar: () => `<path d="M-52 -6 Q-52 0 -44 0 H44 Q52 0 52 -6 V-150 C52 -186 22 -196 20 -226 V-268 H-20 V-226 C-22 -196 -52 -186 -52 -150Z" fill="url(#pVin)"/>
    <path d="M-52 -150 C-52 -176 -36 -186 -26 -200 H26 C36 -186 52 -176 52 -150" fill="#fff" opacity=".35"/>
    <rect x="-26" y="-302" width="52" height="40" rx="9" fill="#3FB56B"/><rect x="-26" y="-274" width="52" height="12" rx="5" fill="#2B8A4E"/>
    <g transform="translate(0 -86)">${tag(pictDrop(), 78, 84)}</g><path d="M-38 -24 V-140" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".7"/>`,
  glass: () => `<path d="M-58 -6 Q-58 0 -50 0 H50 Q58 0 58 -6 V-160 C58 -190 30 -196 26 -214 H-26 C-30 -196 -58 -190 -58 -160Z" fill="url(#pGlass)"/>
    <rect x="-22" y="-240" width="44" height="30" rx="6" fill="${C.ink}"/><path d="M-30 -292 H40 Q52 -292 52 -280 V-262 H10 V-240 H-30Z" fill="${C.ink}"/><rect x="-62" y="-286" width="36" height="18" rx="6" fill="${C.indigo}"/><path d="M24 -262 q16 26 0 40" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
    <g transform="translate(0 -96)">${tag(pictWindow())}</g><path d="M-44 -24 V-150" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".6"/>`,
};

// A living cloud: blobs that circle and breathe, melted together by the goo filter. grow 0..1.
export function gasCloud(cx, cy, R, t, { seed = 1, n = 9, grow = 1, skull = 0, squashY = 1, hi = true } = {}) {
  if (grow <= 0.001) return "";
  let blobs = "", his = "";
  for (let i = 0; i < n; i++) {
    const a = rnd(seed * 31 + i) * 6.283 + t * (0.25 + 0.3 * rnd(seed * 17 + i)) * (i % 2 ? 1 : -1), d = R * (0.25 + 0.6 * rnd(seed * 7 + i * 3)) * grow;
    const r = R * (0.34 + 0.3 * rnd(seed * 11 + i * 5)) * grow * (1 + 0.08 * Math.sin(t * 2.2 + i));
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.8 * squashY;
    blobs += `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r)}"/>`;
    if (hi && i % 2 === 0) his += `<circle cx="${n2(x - r * 0.25)}" cy="${n2(y - r * 0.3)}" r="${n2(r * 0.45)}"/>`;
  }
  blobs += `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(R * 0.62 * grow)}"/>`;
  const face = skull > 0.01 ? `<g transform="translate(${n2(cx)} ${n2(cy)}) scale(${n2(R / 150 * grow)})" opacity="${n2(clamp(skull) * 0.85)}" fill="${C.gasDeep}">
      <ellipse cx="-42" cy="-16" rx="26" ry="32"/><ellipse cx="42" cy="-16" rx="26" ry="32"/><path d="M0 22 l-12 26 h24z"/><rect x="-44" y="62" width="14" height="30" rx="5"/><rect x="-18" y="66" width="14" height="30" rx="5"/><rect x="8" y="66" width="14" height="30" rx="5"/><rect x="34" y="62" width="14" height="30" rx="5"/></g>` : "";
  return `<g filter="url(#goo)" fill="${C.gas}">${blobs}</g><g fill="${C.gasHi}" opacity=".5" filter="url(#soft)">${his}</g>${face}`;
}
// drifting motes
export const motes = (t, n, color, { seed = 3, speed = 26, size = 5, op = 0.35, x0 = 0, y0 = 0, w = 1080, h = 1920 } = {}) => {
  let s = ""; for (let i = 0; i < n; i++) { const x = x0 + rnd(seed + i * 2.1) * w + Math.sin(t * 0.5 + i) * 30, y = y0 + ((rnd(seed + i * 4.7) * h - t * speed * (0.5 + rnd(i + seed))) % h + h) % h; s += `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(size * (0.4 + rnd(seed + i * 9.3)))}"/>`; }
  return `<g fill="${color}" opacity="${op}">${s}</g>`;
};
export const brush = () => `<rect x="-9" y="-250" width="18" height="230" rx="9" fill="${C.cream}"/><rect x="-9" y="-250" width="18" height="60" rx="9" fill="${C.blue}"/>
  <ellipse cx="0" cy="0" rx="46" ry="54" fill="#fff"/>${[...Array(10)].map((_, i) => `<path d="M0 0 L${n2(Math.cos(i * 0.628) * 58)} ${n2(Math.sin(i * 0.628) * 66)}" stroke="${C.porcelainLo}" stroke-width="7" stroke-linecap="round"/>`).join("")}<ellipse cx="0" cy="0" rx="26" ry="32" fill="#fff"/>`;
