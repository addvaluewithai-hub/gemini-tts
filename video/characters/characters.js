// Candidate mascots for techforbadguys, drawn as parametric SVG so the
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

// ---- second batch -----------------------------------------------------------

// Generic round eye with a slanted lid. Returns markup; `o.lid` is the lid fill.
function eyeball(id, cx, cy, rx, ry, e, o = {}) {
  const side = o.side ?? (cx < 200 ? -1 : 1);
  const dx = e.look * (o.dx ?? rx * 0.32);
  const top = cy - ry - 8, x0 = cx - rx - 6, x1 = cx + rx + 6;
  const yb = cy - ry + e.lid * ry * 1.7;
  const s = o.slant ?? 8;
  const yL = side < 0 ? yb : yb + s, yR = side < 0 ? yb + s : yb;
  const pr = o.pr ?? rx * 0.45;
  const pupil = o.pupil
    ? o.pupil(cx + dx, cy)
    : `<circle cx="${cx + dx}" cy="${cy + 2}" r="${pr}" fill="#111"/><circle cx="${cx + dx + pr * 0.4}" cy="${cy - 2}" r="${pr * 0.3}" fill="#fff"/>`;
  return `<clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${o.white ?? "#fff"}" stroke="#111" stroke-width="5"/>
    <g clip-path="url(#${id})">${pupil}
      <path d="M${x0} ${top} H${x1} V${yR} L${x0} ${yL} Z" fill="${o.lid}"/>
      <path d="M${x0} ${yL} L${x1} ${yR}" stroke="#111" stroke-width="5"/>
    </g>`;
}
const line = (d, w = 6, c = "#111") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

function phish(e) {
  const T = "#2EC4B6", D = "#1B8F86", Y = "#FFE66D";
  const q = (x) => { const t = (x - 118) / 164; return (1 - t) * (1 - t) * 262 + 2 * (1 - t) * t * 304 + t * t * 250; };
  const tooth = (d) => `<path d="${d}" fill="#fff" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/>`;
  let mouth;
  if (e.mouth === "talk") {
    mouth = `<path d="M118 256 Q200 244 282 256 Q276 334 200 338 Q124 334 118 256 Z" fill="#0B2A33" ${O}/>`
      + [142, 171, 200, 229, 258].map((x) => tooth(`M${x - 12} 256 L${x} 280 L${x + 12} 256 Z`)).join("")
      + [158, 186, 214, 242].map((x) => tooth(`M${x - 12} 330 L${x} 306 L${x + 12} 330 Z`)).join("");
  } else if (e.mouth === "flat") {
    mouth = tooth("M140 272 L152 250 L164 272 Z") + tooth("M236 272 L248 250 L260 272 Z") + line("M124 272 H276", 7);
  } else {
    mouth = [140, 166, 192, 218, 244, 266].map((x) => tooth(`M${x - 11} ${q(x - 11)} L${x} ${q(x) - 25} L${x + 11} ${q(x + 11)} Z`)).join("")
      + line("M118 262 Q200 304 282 250", 7);
  }
  return `
  <circle cx="304" cy="84" r="50" fill="${Y}" opacity=".16"/>
  <path d="M150 126 L162 84 L182 112 L200 74 L218 112 L238 84 L250 126 Z" fill="${D}" ${O}/>
  ${both(`<path d="M88 214 C40 196 28 252 52 284 C70 272 86 262 94 250 Z" fill="${D}" ${O}/>`)}
  <circle cx="200" cy="228" r="122" fill="${T}" ${O}/>
  <ellipse cx="200" cy="322" rx="64" ry="16" fill="#9FE8DF" opacity=".5"/>
  ${line("M200 108 C200 44 276 22 302 66", 14)}${line("M200 108 C200 44 276 22 302 66", 5, D)}
  <circle cx="304" cy="84" r="25" fill="${Y}" ${O}/>
  <text x="304" y="94" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="28" fill="#111">@</text>
  ${eyeball("ph-l", 150, 188, 27, 27, e, { lid: T })}${eyeball("ph-r", 250, 188, 27, 27, e, { lid: T })}
  ${mouth}`;
}

function trojan(e) {
  const W = "#C98B4B", D = "#8B5A2B", R = "#D7263D";
  const pr = Math.max(0.8, 4.6 * (1 - e.lid));
  const mouth = e.mouth === "talk"
    ? `<path d="M36 106 H90 Q78 132 46 126 Z" fill="#5A1E2A" stroke="#111" stroke-width="5" stroke-linejoin="round"/>`
    : e.mouth === "flat" ? line("M40 110 H86", 6) : line("M38 108 Q60 124 88 106", 6);
  return `<g transform="translate(16,8)">
  ${line("M306 194 C352 182 358 234 340 264", 22)}${line("M306 194 C352 182 358 234 340 264", 11, D)}
  <rect x="118" y="248" width="30" height="76" fill="${W}" ${O}/><rect x="252" y="248" width="30" height="76" fill="${W}" ${O}/>
  <rect x="94" y="170" width="218" height="102" rx="32" fill="${W}" ${O}/>
  ${line("M104 200 H170 M262 200 H302 M104 244 H170 M262 244 H302", 3.5, D)}
  <rect x="178" y="194" width="74" height="58" rx="8" fill="${D}" ${O}/>
  <rect x="186" y="204" width="58" height="17" rx="4" fill="#1A120A"/>
  <ellipse cx="${205 + e.look * 5}" cy="212.5" rx="4.6" ry="${pr}" fill="#fff"/><ellipse cx="${225 + e.look * 5}" cy="212.5" rx="4.6" ry="${pr}" fill="#fff"/>
  <circle cx="215" cy="238" r="4" fill="#111"/>
  <path d="M158 176 L178 150 L158 146 L172 120 L152 116 L160 94 L138 100 Z" fill="${D}" ${O}/>
  <path d="M110 190 L160 176 L140 98 L90 114 Z" fill="${W}" ${O}/>
  <g transform="rotate(-18 92 98)">
    <path d="M116 76 L126 34 L146 80 Z" fill="${W}" ${O}/>
    <rect x="30" y="70" width="116" height="58" rx="25" fill="${W}" ${O}/>
    ${eyeball("tr-e", 108, 92, 15, 15, e, { lid: W, side: 1, slant: 6 })}
    <circle cx="46" cy="90" r="4" fill="#111"/>
    ${mouth}
  </g>
  <rect x="66" y="318" width="270" height="22" rx="9" fill="${D}" ${O}/>
  <circle cx="112" cy="352" r="25" fill="${R}" ${O}/><circle cx="112" cy="352" r="6" fill="#111"/>
  <circle cx="290" cy="352" r="25" fill="${R}" ${O}/><circle cx="290" cy="352" r="6" fill="#111"/>
  </g>`;
}

function cookie(e) {
  const C = "#D9A066", CH = "#4A2C17";
  const down = e.lid > 0.4 ? 27 : 0;
  const chip = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${CH}" stroke="#111" stroke-width="4"/><circle cx="${x - rx * 0.3}" cy="${y - ry * 0.35}" r="2.6" fill="#8A5A36"/>`;
  const eye = (cx) => `<ellipse cx="${cx}" cy="192" rx="21" ry="17" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="${cx + e.look * 9}" cy="189" r="8" fill="#111"/>`;
  const mouth = e.mouth === "talk"
    ? `<ellipse cx="202" cy="274" rx="23" ry="16" fill="#5A1E2A" ${O}/>`
    : e.mouth === "flat" ? line("M170 272 H234", 7) : line("M160 266 Q204 292 248 256", 7);
  return `
  <mask id="ck-m"><rect width="400" height="400" fill="#fff"/><circle cx="318" cy="104" r="64" fill="#000"/></mask>
  <clipPath id="ck-c"><circle cx="200" cy="215" r="138"/></clipPath>
  <g mask="url(#ck-m)">
    <circle cx="200" cy="215" r="135" fill="${C}" ${O}/>
    <circle cx="200" cy="215" r="118" fill="none" stroke="#B97E45" stroke-width="3" stroke-dasharray="3 14" stroke-linecap="round"/>
    ${chip(120, 128, 16, 13)}${chip(222, 104, 13, 11)}${chip(92, 238, 13, 12)}${chip(140, 322, 15, 12)}${chip(258, 318, 13, 11)}${chip(306, 246, 14, 12)}
  </g>
  <g clip-path="url(#ck-c)"><circle cx="318" cy="104" r="64" fill="none" stroke="#111" stroke-width="7"/></g>
  <circle cx="350" cy="92" r="7" fill="${C}" stroke="#111" stroke-width="4"/><circle cx="326" cy="62" r="4.5" fill="${C}" stroke="#111" stroke-width="3.5"/>
  ${eye(154)}${eye(246)}
  ${line("M122 156 L186 166", 9)}${line("M278 156 L214 166", 9)}
  <g transform="translate(0,${down})">
    ${line("M114 186 L72 176 M286 186 L322 180", 7)}${line("M190 188 H210", 9)}
    <rect x="112" y="172" width="82" height="46" rx="15" fill="#111"/><rect x="206" y="172" width="82" height="46" rx="15" fill="#111"/>
    ${line("M126 186 l16 -7 M220 186 l16 -7", 4.5, "#fff")}
  </g>
  ${mouth}`;
}

function nul(e) {
  const K = "#14161B", G = "#39FF88";
  const ry = Math.max(2.5, 14 * (1 - e.lid));
  const eye = (cx, rot) => `<ellipse cx="${cx + e.look * 10}" cy="178" rx="22" ry="${ry}" transform="rotate(${rot} ${cx} 178)" fill="${G}"/>`;
  const mouth = e.mouth === "talk"
    ? [[176, 14], [190, 32], [204, 20], [218, 36], [232, 12]].map(([x, h]) => `<rect x="${x - 4}" y="${238 - h / 2}" width="8" height="${h}" rx="3" fill="${G}"/>`).join("")
    : e.mouth === "flat" ? `<rect x="178" y="234" width="46" height="8" rx="3" fill="${G}"/>` : line("M170 232 Q206 250 238 222", 8, G);
  return `
  <defs><filter id="n-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <path d="M36 400 C46 330 98 300 160 290 L240 290 C302 300 354 330 364 400 Z" fill="${K}" ${O}/>
  <path d="M200 38 C108 38 76 120 82 212 C86 264 118 300 150 312 L250 312 C282 300 314 264 318 212 C324 120 292 38 200 38 Z" fill="${K}" ${O}/>
  <ellipse cx="200" cy="192" rx="80" ry="98" fill="#000" stroke="#2C313D" stroke-width="5"/>
  <g filter="url(#n-glow)">${eye(166, 12)}${eye(234, -12)}${mouth}</g>
  ${line("M174 312 L170 362 M226 312 L230 354", 6, "#2C313D")}
  <rect x="164" y="360" width="12" height="18" rx="4" fill="${G}"/><rect x="224" y="352" width="12" height="18" rx="4" fill="${G}"/>`;
}

function quack(e) {
  const Y = "#FFD23F", S = "#F4B63F", B = "#FF7A1A";
  const open = e.mouth === "talk";
  const lip = e.mouth === "flat" ? line("M124 212 H198", 5) : open ? "" : line("M120 210 Q160 226 204 204", 5);
  return `
  <path d="M296 276 C320 232 372 212 370 250 C368 284 340 304 316 304 Z" fill="${Y}" ${O}/>
  <path d="M62 322 C56 262 120 244 190 252 C260 244 340 256 344 306 C346 362 276 386 196 386 C116 386 68 372 62 322 Z" fill="${Y}" ${O}/>
  <path d="M168 306 C206 284 262 292 274 322 C252 350 196 352 168 306 Z" fill="${S}" ${O}/>
  <circle cx="170" cy="160" r="94" fill="${Y}" ${O}/>
  ${line("M82 128 Q170 92 260 134", 7)}
  ${eyeball("qk-e", 136, 152, 18, 20, e, { lid: Y })}
  ${line("M110 122 L158 134", 9)}
  <path d="M182 134 Q206 124 232 138 Q234 170 208 180 Q184 172 182 134 Z" fill="#111"/>
  ${open ? `<ellipse cx="160" cy="234" rx="36" ry="19" fill="${B}" ${O}/><ellipse cx="160" cy="224" rx="30" ry="11" fill="#7A2434"/>` : ""}
  <path d="M104 198 Q160 166 216 198 Q204 226 160 228 Q116 226 104 198 Z" fill="${B}" ${O}/>
  <circle cx="150" cy="194" r="3" fill="#111"/><circle cx="170" cy="194" r="3" fill="#111"/>
  ${lip}`;
}

function octo(e) {
  const P = "#7B4BD6", L = "#A98BF0";
  const ts = ["M132 232 C112 300 52 322 44 282 C40 262 60 256 68 270", "M166 244 C150 330 96 376 78 342 C72 326 86 316 96 326", "M190 250 C188 330 170 384 146 372"];
  const tent = ts.map((d) => line(d, 38)).join("") + ts.map((d) => line(d, 24, P)).join("");
  const slit = (x, y) => `<rect x="${x - 14}" y="${y - 4}" width="28" height="12" rx="6" fill="#111"/>`;
  const mouth = e.mouth === "talk"
    ? `<ellipse cx="202" cy="222" rx="14" ry="11" fill="#3A1C6E" stroke="#111" stroke-width="5"/>`
    : e.mouth === "flat" ? line("M182 222 H222", 6) : line("M176 218 Q204 234 232 210", 6);
  return `
  ${both(tent)}
  <path d="M106 236 C92 120 150 56 200 56 C250 56 308 120 294 236 C270 264 130 264 106 236 Z" fill="${P}" ${O}/>
  <circle cx="140" cy="104" r="10" fill="${L}"/><circle cx="168" cy="84" r="6" fill="${L}"/><circle cx="262" cy="112" r="8" fill="${L}"/>
  ${eyeball("oc-l", 164, 168, 26, 30, e, { lid: P, pupil: slit })}${eyeball("oc-r", 236, 168, 26, 30, e, { lid: P, pupil: slit })}
  ${mouth}`;
}

function locksley(e) {
  const G = "#F4B63F", S = "#C9CED6";
  const tilt = e.mouth === "smirk" ? -7 : 0;
  const mouth = e.mouth === "talk"
    ? `<circle cx="200" cy="330" r="10" fill="#111"/><path d="M194 334 L189 352 H211 L206 334 Z" fill="#111"/>`
    : e.mouth === "flat" ? line("M190 330 H212", 6) : line("M192 326 Q206 336 218 322", 6);
  const sh = "M140 214 V132 C140 58 262 58 262 132 V158";
  return `
  <g transform="rotate(-9 140 200)">${line(sh, 44)}${line(sh, 30, S)}${line("M152 132 C152 78 250 78 250 132", 5, "#fff")}</g>
  <rect x="88" y="188" width="224" height="176" rx="34" fill="${G}" ${O}/>
  <path d="M92 318 H308 V330 Q308 360 278 360 H122 Q92 360 92 330 Z" fill="#D99A22"/>
  <rect x="88" y="188" width="224" height="176" rx="34" fill="none" ${O}/>
  ${line("M112 222 Q112 208 126 208 H176", 7, "#FFE9A8")}
  ${eyeball("lk-l", 160, 250, 21, 21, e, { lid: G })}${eyeball("lk-r", 240, 250, 21, 21, e, { lid: G })}
  <circle cx="240" cy="250" r="32" fill="#fff" fill-opacity=".14" stroke="#111" stroke-width="6"/>
  ${line("M268 266 C292 292 282 328 300 356", 3.5)}
  <g transform="rotate(${tilt} 200 300)"><path d="M200 296 C182 280 150 284 124 306 C116 296 112 286 116 278 C104 290 106 314 126 320 C156 326 182 318 200 306 C218 318 244 326 274 320 C294 314 296 290 284 278 C288 286 284 296 276 306 C250 284 218 280 200 296 Z" fill="#111"/></g>
  ${mouth}`;
}

function toasty(e) {
  const C = "#DADFE6", T = "#E9B872", CR = "#B5793A", R = "#FF3B47";
  const mouth = e.mouth === "talk"
    ? `<path d="M170 256 H234 Q230 292 202 292 Q174 292 170 256 Z" fill="#7A2434" stroke="#111" stroke-width="5" stroke-linejoin="round"/>`
    : e.mouth === "flat" ? line("M172 264 H232", 7) : line("M162 260 Q204 286 244 250", 7);
  const cord = "M82 304 C30 300 22 352 62 360";
  return `
  ${line(cord, 13)}${line(cord, 5, "#5A5F6B")}
  <g transform="rotate(12 72 364)"><path d="M74 350 v-12 M88 350 v-12" stroke="#111" stroke-width="5" stroke-linecap="round"/><rect x="62" y="350" width="38" height="26" rx="7" fill="#5A5F6B" ${O}/></g>
  ${both(`<path d="M118 152 V92 C96 82 100 46 150 48 C196 46 200 82 180 92 V152 Z" fill="${CR}" ${O}/><path d="M130 152 V100 C114 88 120 62 150 62 C180 62 186 88 170 100 V152 Z" fill="${T}"/>`)}
  <rect x="84" y="298" width="232" height="30" rx="12" fill="#5A5F6B" ${O}/>
  <rect x="66" y="124" width="268" height="188" rx="46" fill="${C}" ${O}/>
  ${line("M92 164 Q92 148 108 148 H168", 7, "#fff")}
  <rect x="336" y="168" width="12" height="84" rx="6" fill="#5A5F6B" stroke="#111" stroke-width="4"/>
  <rect x="328" y="${e.mouth === "talk" ? 174 : 208}" width="32" height="19" rx="8" fill="${R}" ${O}/>
  ${line("M306 96 a24 24 0 0 1 34 0 M296 82 a40 40 0 0 1 54 0", 6, "#fff")}<circle cx="323" cy="108" r="5.5" fill="#fff"/>
  <circle cx="298" cy="286" r="6" fill="${R}" stroke="#111" stroke-width="3"/>
  ${eyeball("ty-l", 156, 204, 23, 25, e, { lid: C })}${eyeball("ty-r", 244, 204, 23, 25, e, { lid: C })}
  ${mouth}`;
}

function spoof(e) {
  const W = "#FFFFFF";
  const ry = Math.max(3, 26 * (1 - e.lid * 0.85));
  const eye = (cx) => `<ellipse cx="${cx + e.look * 8}" cy="170" rx="18" ry="${ry}" fill="#111"/>${ry > 12 ? `<circle cx="${cx + e.look * 8 + 6}" cy="160" r="5" fill="#fff"/>` : ""}`;
  const brow = e.lid > 0.4 ? line("M146 132 H188 M212 132 H254", 7) : line("M144 128 L188 138 M256 128 L212 138", 7);
  const mouth = e.mouth === "talk"
    ? `<ellipse cx="202" cy="220" rx="17" ry="15" fill="#111"/><ellipse cx="202" cy="228" rx="9" ry="6" fill="#FF6FAE"/>`
    : e.mouth === "flat" ? line("M184 216 H222", 6) : line("M176 212 Q204 230 230 204", 6);
  return `
  ${both(`<path d="M104 236 C68 220 48 252 60 280 C76 270 92 270 104 276 Z" fill="${W}" ${O}/>`)}
  <path d="M100 384 V190 C100 100 150 58 200 58 C250 58 300 100 300 190 V384 L267 352 L233 384 L200 352 L167 384 L133 352 Z" fill="${W}" ${O}/>
  <path d="M268 100 C290 130 290 180 290 362 L297 369 V190 C297 150 288 122 268 100 Z" fill="#D7E6EE"/>
  ${brow}${eye(166)}${eye(234)}
  <ellipse cx="136" cy="204" rx="14" ry="8" fill="#FF6FAE" opacity=".55"/><ellipse cx="264" cy="204" rx="14" ry="8" fill="#FF6FAE" opacity=".55"/>
  ${mouth}
  <g transform="rotate(-6 200 292)">
    <rect x="144" y="256" width="112" height="76" rx="10" fill="#fff"/>
    <path d="M144 266 a10 10 0 0 1 10 -10 h92 a10 10 0 0 1 10 10 v16 h-112 z" fill="#E5333F"/>
    <rect x="144" y="256" width="112" height="76" rx="10" fill="none" stroke="#111" stroke-width="5"/>
    <text x="200" y="276" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="15" letter-spacing="2" fill="#fff">HELLO</text>
    <text x="200" y="298" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700" font-size="11" letter-spacing="1" fill="#111">I AM</text>
    <text x="200" y="322" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="22" fill="#111">YOU</text>
  </g>`;
}

function proxy(e) {
  const F = "#F2742B", W = "#FFF7EA", D = "#2A1A12", N = "#1F2A44";
  const HP = "M200 96 C130 96 84 140 76 196 C60 212 42 232 30 252 C72 264 112 302 200 320 C288 302 328 264 370 252 C358 232 340 212 324 196 C316 140 270 96 200 96 Z";
  const slit = (x, y) => `<ellipse cx="${x}" cy="${y + 1}" rx="6" ry="15" fill="#111"/>`;
  const mouth = e.mouth === "talk"
    ? `${line("M200 276 V284", 5)}<ellipse cx="202" cy="294" rx="13" ry="9" fill="#7A2434" stroke="#111" stroke-width="4"/>`
    : e.mouth === "flat" ? line("M200 276 V287 M184 289 H218", 5) : line("M200 276 V285 M200 285 Q216 299 238 284", 5);
  return `
  <path d="M292 400 C384 384 396 296 352 244 C344 292 304 330 276 400 Z" fill="${F}" ${O}/>
  <path d="M352 244 C374 268 382 298 376 324 C364 308 350 298 336 294 C344 278 350 260 352 244 Z" fill="${W}" ${O}/>
  <path d="M70 400 C78 344 118 320 170 312 L230 312 C282 320 322 344 330 400 Z" fill="${N}" ${O}/>
  <path d="M172 312 L200 358 L228 312 Z" fill="${W}" ${O}/>
  <path d="M192 324 h16 l5 14 l-13 50 l-13 -50 z" fill="#E5333F" ${O}/>
  ${both(`<path d="M98 152 L88 38 L182 102 Z" fill="${F}" ${O}/><path d="M110 128 L104 66 L156 104 Z" fill="${D}"/>`)}
  <path d="${HP}" fill="${F}" ${O}/>
  <clipPath id="fx-h"><path d="${HP}"/></clipPath>
  <g clip-path="url(#fx-h)"><path d="M20 250 C80 244 124 236 160 220 C180 246 220 246 240 220 C276 236 320 244 380 250 L380 340 H20 Z" fill="${W}"/></g>
  <path d="${HP}" fill="none" ${O}/>
  ${eyeball("fx-l", 150, 194, 22, 19, e, { white: "#FFD23F", lid: F, pupil: slit, slant: 10 })}${eyeball("fx-r", 250, 194, 22, 19, e, { white: "#FFD23F", lid: F, pupil: slit, slant: 10 })}
  <path d="M184 258 Q200 248 216 258 Q212 274 200 276 Q188 274 184 258 Z" fill="#111"/>
  ${mouth}`;
}

// ---- third batch: faceless / masked busts, black on one loud colour -----------

const SHOULDERS = "M36 400 C46 330 98 300 160 292 L240 292 C302 300 354 330 364 400 Z";
const HOOD = "M200 38 C108 38 76 120 82 212 C86 264 118 300 150 312 L250 312 C282 300 314 264 318 212 C324 120 292 38 200 38 Z";

function zero(e) {
  const K = "#17171B", H = "#23232A", B = "#F2EFE8", R = "#E5333F";
  const lens = (x, y) => `<circle cx="${x}" cy="${y + 1}" r="9" fill="#fff"/><circle cx="${x}" cy="${y + 1}" r="4" fill="#111"/>`;
  const jaw = e.mouth === "talk" ? 14 : 0;
  const tilt = e.mouth === "smirk" ? 4 : 0;
  const beak = "M170 198 Q200 184 230 200 Q214 272 160 340 Q150 346 150 332 Q160 262 170 198 Z";
  return `
  <path d="${SHOULDERS}" fill="${K}" ${O}/>
  ${both(`<path d="M160 292 L128 332 L196 374 L200 322 Z" fill="${H}" ${O}/>`)}
  <path d="M200 92 C138 92 110 138 112 196 C114 252 150 294 200 298 C250 294 286 252 288 196 C290 138 262 92 200 92 Z" fill="${H}" ${O}/>
  ${line("M132 172 H112 M268 172 H288", 7)}
  <path d="M132 104 C128 52 150 34 200 34 C250 34 272 52 268 104 Z" fill="${K}" ${O}/>
  <path d="M131 84 Q200 96 269 84 L268 104 Q200 116 132 104 Z" fill="${R}"/>
  <ellipse cx="200" cy="106" rx="150" ry="19" fill="${K}" ${O}/>
  ${eyeball("zr-l", 160, 172, 28, 28, e, { white: R, lid: H, pupil: lens })}${eyeball("zr-r", 240, 172, 28, 28, e, { white: R, lid: H, pupil: lens })}
  <circle cx="160" cy="172" r="33" fill="none" stroke="#9BA0AA" stroke-width="5"/><circle cx="240" cy="172" r="33" fill="none" stroke="#9BA0AA" stroke-width="5"/>
  <g transform="rotate(${tilt} 200 200)">
    <g transform="rotate(${-jaw} 200 200)"><path d="${beak}" fill="#CFC8B6" ${O}/></g>
    <path d="${beak}" fill="${B}" ${O}/>
    ${line("M197 204 Q190 270 160 328", 3, "#B9B3A4")}
    <ellipse cx="186" cy="248" rx="3" ry="7" transform="rotate(14 186 248)" fill="#111"/>
  </g>`;
}

function patch(e) {
  const K = "#1B1B1F", W = "#F2EFE8", L = "#BDB6A6";
  const down = e.lid > 0.4 ? 24 : 0;
  const HP = "M128 176 C128 126 160 104 200 104 C240 104 272 126 272 176 C272 236 240 274 200 274 C160 274 128 236 128 176 Z";
  const mouth = e.mouth === "talk"
    ? `<ellipse cx="202" cy="240" rx="15" ry="11" fill="#111"/>`
    : e.mouth === "flat" ? line("M176 240 H228", 7) : line("M172 234 Q202 252 232 226", 7);
  const brow = e.lid > 0.4 ? line("M142 150 H190 M210 150 H258", 6) : line("M142 146 L190 156 M258 146 L210 156", 6);
  const lensAt = (cx) => `<circle cx="${cx}" cy="178" r="27" fill="#111"/><circle cx="${cx - 8 + e.look * 8}" cy="170" r="6" fill="#fff"/>`;
  return `
  <path d="${SHOULDERS}" fill="${K}" ${O}/>
  ${both(`<path d="M158 288 L118 262 L136 332 L196 358 L200 324 Z" fill="#2C2C33" ${O}/>`)}
  <rect x="178" y="252" width="44" height="46" fill="${W}" ${O}/>${line("M180 270 L220 264 M180 286 L220 282", 3.5, L)}
  <path d="M268 222 L314 236 L308 252 L266 240 Z" fill="${W}" ${O}/><path d="M308 238 L328 264 L315 272 L300 250 Z" fill="${W}" ${O}/>
  <path d="${HP}" fill="${W}" ${O}/>
  <clipPath id="pt-h"><path d="${HP}"/></clipPath>
  <g clip-path="url(#pt-h)">${line("M120 134 L280 122 M120 206 L282 216 M122 226 L280 218 M126 256 L276 264 M150 100 L176 138", 3.5, L)}</g>
  <ellipse cx="166" cy="178" rx="17" ry="13" fill="#2A2A30"/><ellipse cx="234" cy="178" rx="17" ry="13" fill="#2A2A30"/>
  ${brow}
  <g transform="translate(0,${down})">${line("M140 172 L126 166 M260 172 L274 166", 6)}${line("M190 178 Q200 170 210 178", 6)}${lensAt(166)}${lensAt(234)}</g>
  ${mouth}
  <path d="M130 100 C126 30 274 30 270 100 Z" fill="${K}" ${O}/>
  <path d="M130 80 Q200 92 270 80 L270 102 H130 Z" fill="#FFD23F"/>
  <path d="M92 96 Q200 126 308 96 Q312 110 300 114 Q200 138 100 114 Q88 110 92 96 Z" fill="${K}" ${O}/>`;
}

function leak(e) {
  const Y = "#FFD60A", YD = "#D9B300", M = "#23232A", GL = "#9FF4F0";
  const pup = (x, y) => `<circle cx="${x}" cy="${y + 2}" r="9" fill="#111"/><circle cx="${x + 3}" cy="${y - 1}" r="3" fill="#fff"/>`;
  const grille = e.mouth === "talk"
    ? `<circle cx="200" cy="258" r="12" fill="#111"/>${line("M246 240 q12 18 0 36 M262 230 q18 28 0 56", 5, Y)}`
    : e.mouth === "flat" ? line("M186 252 H214 M186 264 H214", 4.5) : line("M186 252 Q200 260 216 248 M188 264 Q202 272 216 260", 4.5);
  return `
  <path d="${SHOULDERS}" fill="${Y}" ${O}/>
  ${line("M200 314 V400", 5)}
  <rect x="234" y="338" width="68" height="28" rx="5" fill="#111"/>
  <text x="268" y="358" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="17" letter-spacing="2" fill="${Y}">LEAK</text>
  <path d="${HOOD}" fill="${Y}" ${O}/>
  <ellipse cx="200" cy="198" rx="94" ry="106" fill="${YD}"/>
  <path d="M200 100 C146 100 118 140 120 196 C122 250 156 292 200 296 C244 292 278 250 280 196 C282 140 254 100 200 100 Z" fill="${M}" ${O}/>
  ${eyeball("hz-l", 160, 178, 30, 27, e, { white: GL, lid: M, pupil: pup })}${eyeball("hz-r", 240, 178, 30, 27, e, { white: GL, lid: M, pupil: pup })}
  <g transform="rotate(-24 126 264)"><rect x="96" y="246" width="54" height="38" rx="10" fill="#8E929C" ${O}/>${line("M110 254 V276 M123 254 V276 M136 254 V276", 3.5)}</g>
  <circle cx="200" cy="258" r="31" fill="#8E929C" ${O}/><circle cx="200" cy="258" r="21" fill="#5A5F6B"/>
  ${grille}`;
}

function oni(e) {
  const K = "#17171B", R = "#E5333F", G = "#FFD23F";
  const ry = Math.max(3, 14 * (1 - e.lid * 0.8));
  const eye = (cx, rot) => `<g transform="rotate(${rot} ${cx} 184)"><ellipse cx="${cx}" cy="184" rx="27" ry="${ry + 2}" fill="#111"/><circle cx="${cx + e.look * 10}" cy="184" r="${Math.min(7, ry)}" fill="${G}"/></g>`;
  const fang = (d) => `<path d="${d}" fill="#fff" stroke="#111" stroke-width="4" stroke-linejoin="round"/>`;
  let mouth;
  if (e.mouth === "talk") {
    mouth = `<path d="M150 246 Q200 234 250 246 Q246 294 200 298 Q154 294 150 246 Z" fill="#111" ${O}/>`
      + fang("M162 246 L172 268 L182 244 Z") + fang("M218 244 L228 268 L238 246 Z") + fang("M178 294 L186 274 L194 296 Z") + fang("M206 296 L214 274 L222 294 Z");
  } else if (e.mouth === "flat") {
    mouth = fang("M156 258 L166 234 L176 258 Z") + fang("M224 258 L234 234 L244 258 Z") + line("M150 258 H250", 7);
  } else {
    mouth = fang("M158 257 L168 232 L178 262 Z") + fang("M224 259 L234 230 L244 248 Z") + line("M146 250 Q200 282 256 238", 7);
  }
  return `
  <path d="${SHOULDERS}" fill="${K}" ${O}/>
  <path d="${HOOD}" fill="${K}" ${O}/>
  ${both(`<path d="M146 118 C130 84 140 50 168 26 C172 58 180 84 190 108 Z" fill="${G}" ${O}/>`)}
  <path d="M200 92 C142 92 112 128 114 186 C116 250 160 302 200 316 C240 302 284 250 286 186 C288 128 258 92 200 92 Z" fill="${R}" ${O}/>
  <path d="M200 110 l10 16 l-10 16 l-10 -16 z" fill="${G}" stroke="#111" stroke-width="4" stroke-linejoin="round"/>
  ${both(`<path d="M124 146 L190 168 L190 180 L124 162 Z" fill="#111"/>`)}
  ${eye(160, 14)}${eye(240, -14)}
  <path d="M186 216 Q200 206 214 216 L218 228 Q200 236 182 228 Z" fill="#B3202C" stroke="#111" stroke-width="4" stroke-linejoin="round"/>
  ${line("M128 214 Q140 228 134 246 M272 214 Q260 228 266 246", 4, "#B3202C")}
  ${mouth}
  ${line("M174 316 L170 364 M226 316 L230 356", 6, "#2C313D")}`;
}

function source(e) {
  const K = "#17171B", BG = "#D2A86A", BD = "#A87D45";
  const mouth = e.mouth === "talk"
    ? line("M184 238 Q204 226 224 238 Q228 258 204 262 Q180 258 184 238 Z", 5.5)
    : e.mouth === "flat" ? line("M172 246 L236 243", 6) : line("M166 240 Q204 264 242 230", 6);
  const brow = e.lid > 0.4 ? line("M140 140 H188 M212 140 H260", 6) : line("M140 134 L188 146 M260 134 L212 146", 6);
  return `
  <path d="${SHOULDERS}" fill="${K}" ${O}/>
  <path d="M168 292 L200 350 L232 292 Z" fill="#F2EFE8" ${O}/>
  <path d="M191 310 h18 l5 16 l-14 60 l-14 -60 z" fill="#FFD23F" ${O}/>
  ${both(`<path d="M160 292 L146 340 L194 362 L200 328 Z" fill="#2C2C33" ${O}/>`)}
  <path d="M112 300 L104 92 Q104 74 122 72 L278 72 Q296 74 296 92 L288 300 L272 286 L256 302 L240 286 L224 302 L208 286 L192 302 L176 286 L160 302 L144 286 L128 302 Z" fill="${BG}" ${O}/>
  ${line("M134 78 L140 288 M266 78 L260 288 M106 100 L134 78 M294 100 L266 78", 3, BD)}
  ${line("M226 108 l18 -7 M150 272 l14 7 M252 262 l10 -9", 3, BD)}
  ${brow}
  ${eyeball("sr-l", 164, 178, 24, 24, e, { lid: "#111" })}${eyeball("sr-r", 236, 178, 24, 24, e, { lid: "#111" })}
  ${mouth}`;
}

function watcher(e) {
  const K = "#17171B", B = "#F2EFE8", S = "#C9CED6", R = "#E5333F";
  const iris = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="${R}"/><circle cx="${x}" cy="${y}" r="7" fill="#111"/><circle cx="${x + 5}" cy="${y - 5}" r="3" fill="#fff"/>`;
  const mouth = e.mouth === "talk"
    ? [[180, 8], [190, 18], [200, 10], [210, 20], [220, 8]].map(([x, h]) => `<rect x="${x - 3}" y="${248 - h / 2}" width="6" height="${h}" rx="2.5" fill="#111"/>`).join("")
    : e.mouth === "flat" ? line("M180 248 H220", 5) : line("M176 244 Q202 258 228 238", 5);
  const cable = "M288 220 C334 230 338 292 300 318";
  return `
  <path d="${SHOULDERS}" fill="${K}" ${O}/>
  <path d="M168 292 L200 350 L232 292 Z" fill="${B}" ${O}/>
  <path d="M191 310 h18 l5 16 l-14 60 l-14 -60 z" fill="${R}" ${O}/>
  ${both(`<path d="M160 292 L146 340 L194 362 L200 328 Z" fill="#2C2C33" ${O}/>`)}
  ${line(cable, 11)}${line(cable, 4, "#5A5F6B")}
  <rect x="184" y="262" width="32" height="46" rx="6" fill="#8E929C" ${O}/><circle cx="200" cy="292" r="6" fill="#5A5F6B" stroke="#111" stroke-width="3"/>
  <rect x="108" y="108" width="184" height="166" rx="26" fill="${B}" ${O}/>
  <path d="M90 126 L104 88 Q108 80 118 80 H282 Q292 80 296 88 L310 126 Z" fill="${S}" ${O}/>
  <circle cx="200" cy="180" r="50" fill="#23232A" ${O}/>
  ${eyeball("wt-e", 200, 180, 35, 35, e, { white: "#10203A", lid: "#5A5F6B", pupil: iris, side: -1, slant: 0, dx: 13 })}
  <circle cx="130" cy="146" r="4" fill="#8E929C"/><circle cx="270" cy="146" r="4" fill="#8E929C"/>
  <circle cx="268" cy="252" r="7" fill="${R}" stroke="#111" stroke-width="3"/>
  ${mouth}`;
}

function zip(e) {
  const K = "#17171B", J = "#2A2A31", P = "#F7F3E8", Z = "#D9DEE6", G = "#FFD23F";
  const HP = "M200 58 C130 58 96 108 98 180 C100 250 140 302 200 306 C260 302 300 250 302 180 C304 108 270 58 200 58 Z";
  const yb = 152 + e.lid * 30, dx = e.look * 12;
  const track = (d) => `${line(d, 17)}<path d="${d}" fill="none" stroke="${Z}" stroke-width="9" stroke-dasharray="3.5 4.5"/>`;
  const pull = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-7" y="-9" width="14" height="18" rx="4" fill="${G}" stroke="#111" stroke-width="4"/><rect x="-5" y="9" width="10" height="20" rx="5" fill="${G}" stroke="#111" stroke-width="4"/></g>`;
  const mouth = e.mouth === "talk"
    ? `<path d="M150 250 Q200 222 250 250 Q200 294 150 250 Z" fill="#7A2434"/>${track("M150 250 Q200 222 250 250")}${track("M150 250 Q200 294 250 250")}${pull(144, 250, 0)}`
    : e.mouth === "flat" ? `${track("M150 252 H250")}${pull(256, 252, 0)}` : `${track("M150 254 Q200 270 250 240")}${pull(256, 238, -20)}`;
  const ribs = [140, 170, 200, 230, 260].map((x) => `M${x} 58 Q${x + (x - 200) * 0.2} 180 ${x} 306`).join(" ");
  return `
  <path d="${SHOULDERS}" fill="${J}" ${O}/>
  ${line("M70 356 L122 316 M330 356 L278 316", 7, P)}
  <rect x="158" y="280" width="84" height="38" rx="12" fill="${K}" ${O}/>
  <path d="${HP}" fill="${K}" ${O}/>
  <clipPath id="zp-h"><path d="${HP}"/></clipPath>
  <g clip-path="url(#zp-h)">${line(ribs, 3, "#2E2E37")}</g>
  <clipPath id="zp-s"><rect x="116" y="152" width="168" height="58" rx="29"/></clipPath>
  <rect x="116" y="152" width="168" height="58" rx="29" fill="${P}" stroke="#111" stroke-width="6"/>
  <g clip-path="url(#zp-s)">
    <circle cx="${166 + dx}" cy="186" r="10" fill="#111"/><circle cx="${234 + dx}" cy="186" r="10" fill="#111"/>
    <circle cx="${169 + dx}" cy="183" r="3" fill="#fff"/><circle cx="${237 + dx}" cy="183" r="3" fill="#fff"/>
    <path d="M108 140 H292 V${yb} L200 ${yb + 12} L108 ${yb} Z" fill="${K}"/>
    ${line(`M112 ${yb} L200 ${yb + 12} L288 ${yb}`, 5)}
  </g>
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
  { id: "phish", name: "PHISH", role: "The deep-sea scammer", line: "An anglerfish whose lure is an @ sign. You will click it.",
    bg: "#06232B", fg: "#FFE66D", sub: "#8FC9C2", palette: ["#06232B", "#2EC4B6", "#FFE66D", "#FFFFFF"], draw: phish },
  { id: "trojan", name: "TROJAN", role: "The gift horse", line: "A wooden horse on wheels. Someone inside is watching you.",
    bg: "#27306B", fg: "#F2C185", sub: "#A9B1E0", palette: ["#27306B", "#C98B4B", "#8B5A2B", "#D7263D"], draw: trojan },
  { id: "cookie", name: "COOKIE", role: "The third-party tracker", line: "A cookie in shades. Knows every site you visited this week.",
    bg: "#1E3A5F", fg: "#E8B06E", sub: "#9DB4D0", palette: ["#1E3A5F", "#D9A066", "#4A2C17", "#111111"], draw: cookie },
  { id: "null", name: "NULL", role: "The empty hoodie", line: "Nobody inside. Just two eyes and a blinking cursor.",
    bg: "#39FF88", fg: "#14161B", sub: "#0E5A32", palette: ["#39FF88", "#14161B", "#000000", "#2C313D"], draw: nul },
  { id: "quack", name: "QUACK", role: "The pirate debug duck", line: "A rubber duck with an eyepatch. Cracks software, and jokes.",
    bg: "#0E5E6F", fg: "#FFD23F", sub: "#9AD0DA", palette: ["#0E5E6F", "#FFD23F", "#FF7A1A", "#111111"], draw: quack },
  { id: "octo", name: "OCTO", role: "The keylogger", line: "Eight arms, every keyboard. Reads what you type, then sighs.",
    bg: "#FFE8D6", fg: "#4B2A9C", sub: "#8A6F5C", palette: ["#FFE8D6", "#7B4BD6", "#A98BF0", "#111111"], draw: octo },
  { id: "locksley", name: "SIR LOCKSLEY", role: "The open padlock", line: "Monocle, mustache, and a shackle nobody ever closed.",
    bg: "#101B3A", fg: "#F4B63F", sub: "#93A0C7", palette: ["#101B3A", "#F4B63F", "#C9CED6", "#111111"], draw: locksley },
  { id: "toasty", name: "TOASTY", role: "The smart toaster", line: "Connected to Wi-Fi, and to three botnets. Your move.",
    bg: "#FF8A3D", fg: "#17171B", sub: "#6B3410", palette: ["#FF8A3D", "#DADFE6", "#E9B872", "#FF3B47"], draw: toasty },
  { id: "spoof", name: "SPOOF", role: "The identity thief", line: "A ghost wearing your name tag. Says hello as you.",
    bg: "#B8F2E6", fg: "#17323A", sub: "#3F6B66", palette: ["#B8F2E6", "#FFFFFF", "#E5333F", "#FF6FAE"], draw: spoof },
  { id: "proxy", name: "PROXY", role: "The fox in the middle", line: "Sits between you and the server. Smiles the whole time.",
    bg: "#F6E7C8", fg: "#1F2A44", sub: "#7A6A52", palette: ["#F6E7C8", "#F2742B", "#1F2A44", "#E5333F"], draw: proxy },
  { id: "zero", name: "DR. ZERO", role: "The plague doctor", line: "Treats viruses the old way. Sends the bill on day zero.",
    bg: "#F7E733", fg: "#17171B", sub: "#5C560F", palette: ["#F7E733", "#17171B", "#F2EFE8", "#E5333F"], draw: zero },
  { id: "patch", name: "PATCH", role: "The invisible man", line: "Bandaged head to toe. The only thing here that is fully patched.",
    bg: "#19D3DA", fg: "#17171B", sub: "#0B5A5E", palette: ["#19D3DA", "#1B1B1F", "#F2EFE8", "#FFD23F"], draw: patch },
  { id: "leak", name: "LEAK", role: "The hazmat cleaner", line: "Arrives after every data spill. Never once in time.",
    bg: "#6A3BFF", fg: "#FFD60A", sub: "#CFC2FF", palette: ["#6A3BFF", "#FFD60A", "#23232A", "#9FF4F0"], draw: leak },
  { id: "oni", name: "ONI", role: "The masked demon", line: "Hoodie, horns and a fanged grin. Reads your logs for fun.",
    bg: "#F2EFE8", fg: "#E5333F", sub: "#6B6457", palette: ["#F2EFE8", "#17171B", "#E5333F", "#FFD23F"], draw: oni },
  { id: "source", name: "THE SOURCE", role: "The anonymous tip", line: "Suit, tie, paper bag. A person familiar with the matter.",
    bg: "#2B4BFF", fg: "#F2EFE8", sub: "#BFCBFF", palette: ["#2B4BFF", "#D2A86A", "#17171B", "#FFD23F"], draw: source },
  { id: "watcher", name: "WATCHER", role: "The camera in a suit", line: "A CCTV head on a corporate body. Always recording.",
    bg: "#FF6A1A", fg: "#17171B", sub: "#6B2C08", palette: ["#FF6A1A", "#F2EFE8", "#17171B", "#E5333F"], draw: watcher },
  { id: "zip", name: "ZIP", role: "The zipped lip", line: "A balaclava with a zipper for a mouth. Says nothing, unzips everything.",
    bg: "#FF3D8B", fg: "#17171B", sub: "#6E0F36", palette: ["#FF3D8B", "#17171B", "#F7F3E8", "#FFD23F"], draw: zip },
];

export const svg = (c, expr = "idle", size = 400) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${size}" height="${size}">${c.draw(EXPRESSIONS[expr] || expr)}</svg>`;
