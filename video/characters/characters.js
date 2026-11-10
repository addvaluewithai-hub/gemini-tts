// Five candidate mascots for techforbadguys, drawn as parametric SVG so the
// chosen one can be animated later (blink, eye direction, mouth driven by voice).
// Each draw(e) takes an expression: { lid: 0..1 (closed), look: -1..1, mouth: 'smirk'|'talk'|'flat' }
// and returns the inner markup of a 400x400 SVG.

const O = 'stroke="#111" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"';
const mirror = (s) => `<g transform="translate(400,0) scale(-1,1)">${s}</g>`;
const both = (s) => s + mirror(s);

export const EXPRESSIONS = {
  idle: { lid: 0.15, look: 0, mouth: "smirk" },
  talk: { lid: 0.05, look: 0, mouth: "talk" },
  deadpan: { lid: 0.62, look: 0.85, mouth: "flat" },
};

function glitch(e) {
  const A = "#FFB000";
  const h = 30 * (1 - e.lid * 0.85);
  const dx = e.look * 9;
  const eye = (m) => {
    const p = [[128, 150], [180, 164], [180, 164 + h * 0.7], [128, 150 + h]]
      .map(([x, y]) => `${(m ? 400 - x : x) + dx},${y}`).join(" ");
    return `<polygon points="${p}" fill="${A}"/>`;
  };
  const mouth = e.mouth === "talk"
    ? `<polyline points="140,224 156,206 172,238 188,204 204,240 220,206 236,236 252,212 262,224" fill="none" stroke="${A}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>`
    : e.mouth === "flat"
      ? `<path d="M150 224 H250" fill="none" stroke="${A}" stroke-width="8" stroke-linecap="round"/>`
      : `<path d="M146 222 H232 Q254 222 262 204" fill="none" stroke="${A}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `
  <defs>
    <filter id="g-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <pattern id="g-scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000" opacity=".3"/></pattern>
    <radialGradient id="g-scr" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#3D2800"/><stop offset="1" stop-color="#120B00"/></radialGradient>
  </defs>
  <path d="M318 246 C374 246 382 316 340 330 C318 338 322 358 348 354" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round"/>
  <path d="M318 246 C374 246 382 316 340 330 C318 338 322 358 348 354" fill="none" stroke="#FF3B47" stroke-width="8" stroke-linecap="round"/>
  <polygon points="344,338 382,346 352,372" fill="#FF3B47" ${O}/>
  ${both(`<path d="M118 98 C94 80 84 52 94 28 C118 42 148 60 164 92 Z" fill="#FF3B47" ${O}/>`)}
  <path d="M168 296 h64 l10 36 h-84 z" fill="#CFC5AE" ${O}/>
  <rect x="112" y="330" width="176" height="24" rx="12" fill="#E8DFCB" ${O}/>
  <rect x="66" y="84" width="268" height="214" rx="38" fill="#E8DFCB" ${O}/>
  <rect x="90" y="106" width="220" height="160" rx="22" fill="url(#g-scr)" ${O}/>
  <g filter="url(#g-glow)">${eye(false)}${eye(true)}${mouth}</g>
  <rect x="94" y="110" width="212" height="152" rx="18" fill="url(#g-scan)"/>
  <circle cx="302" cy="282" r="5.5" fill="#FF3B47"/>
  <path d="M98 282 h54" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>`;
}

function redacted(e) {
  const eh = Math.max(2.5, 13 * (1 - e.lid));
  const dx = e.look * 10;
  const mouth = e.mouth === "talk"
    ? `<ellipse cx="203" cy="232" rx="15" ry="11" fill="#111"/>`
    : e.mouth === "flat"
      ? `<path d="M176 232 H228" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/>`
      : `<path d="M170 228 Q200 244 234 218" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/>`;
  return `
  <path d="M56 400 C62 332 98 298 160 284 L200 322 L240 284 C302 298 338 332 344 400 Z" fill="#1B1B1F" ${O}/>
  <path d="M166 286 L200 344 L234 286 Z" fill="#F7F3E8" ${O}/>
  <path d="M191 300 h18 l5 16 l-14 62 l-14 -62 z" fill="#D7263D" ${O}/>
  ${both(`<path d="M160 284 L146 334 L194 356 L200 322 Z" fill="#2C2C33" ${O}/>`)}
  <rect x="178" y="248" width="44" height="42" fill="#F7F3E8" ${O}/>
  <path d="M128 172 C128 122 160 102 200 102 C240 102 272 122 272 172 C272 232 240 270 200 270 C160 270 128 232 128 172 Z" fill="#F7F3E8" ${O}/>
  <path d="M132 118 C126 68 150 42 200 50 C250 42 274 68 268 118 Z" fill="#1B1B1F" ${O}/>
  <path d="M131 98 Q200 112 269 98 L268 118 Q200 132 132 118 Z" fill="#D7263D"/>
  <ellipse cx="200" cy="120" rx="130" ry="20" fill="#1B1B1F" ${O}/>
  <g transform="rotate(-4 200 174)">
    <rect x="108" y="152" width="184" height="46" fill="#111"/>
    <rect x="${150 + dx}" y="${175 - eh / 2}" width="28" height="${eh}" fill="#F7F3E8"/>
    <rect x="${224 + dx}" y="${175 - eh / 2}" width="28" height="${eh}" fill="#F7F3E8"/>
  </g>
  ${mouth}`;
}

function byte(e) {
  const C = "#17141D", K = "#0B0910", Y = "#D6FF3F", L = "#7A68A6";
  const eye = (cx, inner) => {
    const dx = e.look * 11;
    const y1 = 168 + e.lid * 44, y2 = y1 + 12; // outer, inner edge of the lid
    const lid = inner > 0
      ? `M${cx - 44} 150 H${cx + 44} V${y2} L${cx - 44} ${y1} Z`
      : `M${cx - 44} 150 H${cx + 44} V${y1} L${cx - 44} ${y2} Z`;
    const edge = inner > 0 ? `M${cx - 40} ${y1} L${cx + 40} ${y2}` : `M${cx - 40} ${y2} L${cx + 40} ${y1}`;
    return `<clipPath id="b-eye-${cx}"><ellipse cx="${cx}" cy="200" rx="37" ry="33"/></clipPath>
      <ellipse cx="${cx}" cy="200" rx="37" ry="33" fill="${Y}" stroke="${K}" stroke-width="6"/>
      <g clip-path="url(#b-eye-${cx})">
        <ellipse cx="${cx + dx}" cy="202" rx="${8 + e.lid * 6}" ry="27" fill="${K}"/>
        <circle cx="${cx + dx + 10}" cy="190" r="5.5" fill="#fff"/>
        <path d="${lid}" fill="${C}"/>
        <path d="${edge}" fill="none" stroke="${K}" stroke-width="6"/>
      </g>`;
  };
  const mouth = e.mouth === "talk"
    ? `<ellipse cx="200" cy="256" rx="12" ry="10" fill="#FF6FAE" stroke="${K}" stroke-width="4"/>`
    : e.mouth === "flat"
      ? `<path d="M182 252 H218" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round"/>`
      : `<path d="M200 244 q-12 14 -26 6 M200 244 q12 14 26 6" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round"/>`;
  return `
  <path d="M284 356 C360 356 372 280 330 262 C308 254 298 278 318 286" fill="none" stroke="${K}" stroke-width="40" stroke-linecap="round"/>
  <path d="M284 356 C360 356 372 280 330 262 C308 254 298 278 318 286" fill="none" stroke="${C}" stroke-width="28" stroke-linecap="round"/>
  <path d="M108 400 C98 322 138 282 200 282 C262 282 302 322 292 400 Z" fill="${C}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  ${both(`<path d="M94 152 L102 50 L180 104 Z" fill="${C}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M112 128 L116 80 L156 108 Z" fill="#FF6FAE"/>`)}
  <ellipse cx="200" cy="196" rx="126" ry="104" fill="${C}" stroke="${K}" stroke-width="7"/>
  ${eye(152, 1)}${eye(248, -1)}
  <path d="M190 230 h20 l-10 13 z" fill="#FF6FAE"/>
  ${mouth}
  <path d="M112 236 L62 226 M112 250 L64 258 M288 236 L338 226 M288 250 L336 258" fill="none" stroke="${L}" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M124 290 Q200 326 276 290" fill="none" stroke="#FF3B47" stroke-width="16" stroke-linecap="round"/>
  <path d="M192 322 v-14 a9 9 0 0 1 18 0 v3" fill="none" stroke="#FFD23F" stroke-width="5" stroke-linecap="round"/>
  <rect x="186" y="320" width="28" height="24" rx="5" fill="#FFD23F" stroke="${K}" stroke-width="4"/>`;
}

function skully(e) {
  const B = "#F2EFE8", K = "#17171B", Y = "#FFD23F";
  const j = e.mouth === "talk" ? 16 : 0;
  const socket = (cx) => {
    const dx = e.look * 12;
    const ly = 136 + e.lid * 46;
    return `<clipPath id="s-eye-${cx}"><ellipse cx="${cx}" cy="172" rx="33" ry="35"/></clipPath>
      <ellipse cx="${cx}" cy="172" rx="33" ry="35" fill="${K}"/>
      <g clip-path="url(#s-eye-${cx})">
        <circle cx="${cx + dx}" cy="178" r="10" fill="${Y}"/>
        <circle cx="${cx + dx + 3}" cy="175" r="3" fill="#fff"/>
        <rect x="${cx - 40}" y="120" width="80" height="${ly - 120}" fill="${B}"/>
        <path d="M${cx - 40} ${ly} H${cx + 40}" stroke="#111" stroke-width="6"/>
      </g>`;
  };
  const teeth = [166, 183, 200, 217, 234].map((x) => `M${x} 252 V276`).join(" ");
  const lower = [170, 190, 210, 230].map((x) => `M${x} ${262 + j} V${280 + j}`).join(" ");
  const smirk = e.mouth === "smirk" ? `<path d="M250 262 Q272 256 276 236" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/>` : "";
  return `
  <path d="M52 400 C60 340 108 312 170 304 L230 304 C292 312 340 340 348 400 Z" fill="${K}" ${O}/>
  <path d="M170 304 L200 352 L230 304 Z" fill="${B}" ${O}/>
  <rect x="186" y="284" width="28" height="28" fill="${B}" ${O}/>
  <rect x="152" y="${252 + j}" width="96" height="46" rx="18" fill="${B}" ${O}/>
  <path d="${lower}" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M92 165 C92 95 148 58 200 58 C252 58 308 95 308 165 C308 205 290 228 264 242 L264 262 Q264 276 250 276 L150 276 Q136 276 136 262 L136 242 C110 228 92 205 92 165 Z" fill="${B}" ${O}/>
  <path d="${teeth}" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M240 64 l-10 22 l16 8 l-8 20" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  ${socket(154)}${socket(246)}
  <path d="M200 204 l-13 24 q13 9 26 0 z" fill="${K}"/>
  ${smirk}
  <path d="M82 172 C82 28 318 28 318 172" fill="none" stroke="#111" stroke-width="20" stroke-linecap="round"/>
  <path d="M82 172 C82 28 318 28 318 172" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/>
  <rect x="62" y="146" width="34" height="68" rx="14" fill="${K}" ${O}/>
  <rect x="304" y="146" width="34" height="68" rx="14" fill="${K}" ${O}/>
  <path d="M78 214 C78 292 110 304 138 298" fill="none" stroke="#111" stroke-width="9" stroke-linecap="round"/>
  <rect x="128" y="288" width="30" height="18" rx="9" fill="${Y}" ${O}/>
  <path d="M200 326 l-32 -18 v36 z M200 326 l32 -18 v36 z" fill="${Y}" ${O}/>
  <circle cx="200" cy="326" r="9" fill="${Y}" ${O}/>`;
}

function bandit(e) {
  const G = "#9A9EA8", D = "#2A2C33", W = "#F2EFE8", H = "#F4B63F";
  const eye = (cx, inner) => {
    const dx = e.look * 8;
    const y1 = 180 + e.lid * 30, y2 = y1 + 9;
    const lid = inner > 0
      ? `M${cx - 26} 170 H${cx + 26} V${y2} L${cx - 26} ${y1} Z`
      : `M${cx - 26} 170 H${cx + 26} V${y1} L${cx - 26} ${y2} Z`;
    return `<clipPath id="r-eye-${cx}"><circle cx="${cx}" cy="204" r="21"/></clipPath>
      <circle cx="${cx}" cy="204" r="21" fill="${W}" stroke="#111" stroke-width="5"/>
      <g clip-path="url(#r-eye-${cx})">
        <circle cx="${cx + dx}" cy="206" r="10" fill="#111"/>
        <circle cx="${cx + dx + 4}" cy="202" r="3" fill="#fff"/>
        <path d="${lid}" fill="${D}"/>
      </g>`;
  };
  const mouth = e.mouth === "talk"
    ? `<path d="M200 248 V254" stroke="#111" stroke-width="5" stroke-linecap="round"/><ellipse cx="202" cy="266" rx="15" ry="10" fill="#7A2434" stroke="#111" stroke-width="4"/>`
    : e.mouth === "flat"
      ? `<path d="M200 248 V258 M182 260 H220" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>`
      : `<path d="M200 248 V257 M200 257 Q218 272 238 254" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/><path d="M222 263 l5 12 l6 -15 z" fill="#fff" stroke="#111" stroke-width="3" stroke-linejoin="round"/>`;
  const tail = "M296 388 C378 366 386 274 342 232";
  return `
  <path d="${tail}" fill="none" stroke="#111" stroke-width="60" stroke-linecap="round"/>
  <path d="${tail}" fill="none" stroke="${G}" stroke-width="46" stroke-linecap="round"/>
  <path d="${tail}" fill="none" stroke="${D}" stroke-width="46" stroke-dasharray="20 28" stroke-dashoffset="-14"/>
  <ellipse cx="200" cy="306" rx="128" ry="40" fill="#D99A22" ${O}/>
  <path d="M46 400 C56 338 102 310 166 300 L234 300 C298 310 344 338 354 400 Z" fill="${H}" ${O}/>
  <path d="M180 312 V352 M220 312 V346" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <circle cx="180" cy="356" r="5" fill="#111"/><circle cx="220" cy="350" r="5" fill="#111"/>
  ${both(`<path d="M90 152 C78 100 96 68 122 64 C152 70 172 98 174 124 Z" fill="${G}" ${O}/><path d="M108 132 C102 104 112 86 124 84 C140 90 150 104 152 120 Z" fill="${D}"/>`)}
  <path d="M72 205 C72 140 130 100 200 100 C270 100 328 140 328 205 C328 225 350 240 356 254 C330 264 300 292 200 294 C100 292 70 264 44 254 C50 240 72 225 72 205 Z" fill="${G}" ${O}/>
  <path d="M186 103 L191 176 L209 176 L214 103 Z" fill="${D}"/>
  ${both(`<ellipse cx="146" cy="160" rx="44" ry="15" transform="rotate(-12 146 160)" fill="${W}"/>`)}
  <path d="M200 192 C170 162 110 162 82 202 C70 224 84 248 110 246 C150 242 180 228 200 216 C220 228 250 242 290 246 C316 248 330 224 318 202 C290 162 230 162 200 192 Z" fill="${D}"/>
  ${eye(150, 1)}${eye(250, -1)}
  <ellipse cx="200" cy="250" rx="54" ry="36" fill="${W}" ${O}/>
  <path d="M183 228 Q200 217 217 228 Q213 246 200 248 Q187 246 183 228 Z" fill="#111"/>
  ${mouth}`;
}

export const characters = [
  { id: "glitch", name: "GLITCH", role: "The possessed monitor", line: "A beige CRT that grew horns. Deadpan sysadmin from hell.",
    bg: "#17120A", fg: "#FFB000", sub: "#B9A27A", palette: ["#17120A", "#E8DFCB", "#FFB000", "#FF3B47"], draw: glitch },
  { id: "redacted", name: "MR. REDACTED", role: "The censored informant", line: "Trench coat, fedora, and a black bar where his eyes should be.",
    bg: "#E9E2D0", fg: "#1B1B1F", sub: "#6B6457", palette: ["#E9E2D0", "#1B1B1F", "#F7F3E8", "#D7263D"], draw: redacted },
  { id: "byte", name: "BYTE", role: "The villain's cat", line: "Unimpressed by your security posture. Wears an open padlock.",
    bg: "#2B1B4A", fg: "#D6FF3F", sub: "#A796D1", palette: ["#2B1B4A", "#17141D", "#D6FF3F", "#FF6FAE"], draw: byte },
  { id: "skully", name: "SKULLY", role: "The dead-serious anchor", line: "A skull with a headset and a bow tie. Reads the news, judges you.",
    bg: "#E5333F", fg: "#F2EFE8", sub: "#FFD0D3", palette: ["#E5333F", "#F2EFE8", "#17171B", "#FFD23F"], draw: skully },
  { id: "bandit", name: "BANDIT", role: "The trash-panda hacker", line: "Born with the mask on. Smug, fanged, and already in your account.",
    bg: "#12332F", fg: "#F4B63F", sub: "#8FB5AE", palette: ["#12332F", "#9A9EA8", "#2A2C33", "#F4B63F"], draw: bandit },
];

export const svg = (c, expr = "idle", size = 400) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${size}" height="${size}">${c.draw(EXPRESSIONS[expr] || expr)}</svg>`;
