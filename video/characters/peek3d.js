// PEEK drawn as a soft, volumetric cartoon: gradients for form, no outlines, glossy eyes,
// a brim shadow across the face. Same expression object as characters.js.
//   peek3d(expression, { face, paper, size, viewBox })
// face:  a key of FACES (head shape, eyes, colours, features)
// paper: "pockets" (hands in coat pockets, paper tucked in the belt) | "roll" (paper in hand) |
//        "over" (peeking over the open paper) | "holes" (hidden behind it, two eye holes)

const IRIS = {
  amber: { c: ["#FFF4B8", "#FFC533", "#D27A00"], rim: "#5E3200" },
  blue: { c: ["#D6F1FF", "#3BA7F0", "#0B5EA8"], rim: "#063A6B" },
  green: { c: ["#EBFFC2", "#6BD12F", "#2E7A0A"], rim: "#1B4D05" },
  teal: { c: ["#D4FFF6", "#22D3B6", "#0A7A68"], rim: "#064A40" },
  ember: { c: ["#FFE1CC", "#FF6A3D", "#A82A08"], rim: "#5E1503" },
};
const PINK = { skin: ["#FFA9D3", "#FF4FA3", "#A81F65"], lid: ["#D2367F", "#F0489A"], dark: "#8E1754", line: "#7A1846", blush: "#FF2E88", spot: "#C92F78" };

export const FACES = {
  A: { name: "ROUND", note: "The first soft-3D face: wide round head, big amber eyes.", ...PINK, iris: IRIS.amber,
    head: "M600 196 C440 196 350 296 350 404 C350 522 460 592 600 594 C740 592 850 522 850 404 C850 296 760 196 600 196 Z", bottom: 594,
    eyes: [{ cx: 512, cy: 414, rx: 76, ry: 76 }, { cx: 688, cy: 414, rx: 76, ry: 76 }], irisR: 45, pupilR: 21, lidBase: 0,
    my: 508, mw: 60, ny: 488, blushAt: [424, 776, 486] },
  egg: { name: "EGG", note: "Tall narrow head, close-set heavy-lidded eyes, a long thin smirk. Mint skin, fin ears.",
    skin: ["#B4F5E3", "#2FC9A6", "#0E7560"], lid: ["#1FA88A", "#38D1AE"], dark: "#0B5C4C", line: "#0A4F42", blush: "#FF9E7A", spot: "#1C9C80", iris: IRIS.amber,
    head: "M600 200 C480 200 410 290 410 410 C410 540 500 640 600 644 C700 640 790 540 790 410 C790 290 720 200 600 200 Z", bottom: 644,
    eyes: [{ cx: 541, cy: 404, rx: 58, ry: 58 }, { cx: 659, cy: 404, rx: 58, ry: 58 }], irisR: 33, pupilR: 14, lidBase: 0.14,
    my: 556, mw: 72, ny: 506, blushAt: [462, 738, 500],
    under: (g) => [0, 1].map((m) => `<g ${m ? 'transform="translate(1200,0) scale(-1,1)"' : ""}><path d="M420 392 C356 366 330 418 350 468 C374 480 404 470 422 456 Z" fill="url(#${g}skin)"/><path d="M404 410 C374 402 364 428 372 450" fill="none" stroke="#0E7560" stroke-width="6" stroke-linecap="round" opacity=".5"/></g>`).join("") },
  pear: { name: "PEAR", note: "Small skull, huge cheeks, small blue eyes set wide apart, a nose bump and one tooth.", ...PINK, iris: IRIS.blue,
    head: "M600 200 C500 200 440 260 430 340 C380 380 330 450 340 520 C352 600 480 630 600 630 C720 630 848 600 860 520 C870 450 820 380 770 340 C760 260 700 200 600 200 Z", bottom: 630,
    eyes: [{ cx: 506, cy: 384, rx: 50, ry: 50 }, { cx: 694, cy: 384, rx: 50, ry: 50 }], irisR: 30, pupilR: 14, lidBase: 0.04,
    my: 536, mw: 88, teeth: true, blushAt: [420, 780, 510],
    over: (g) => `<ellipse cx="600" cy="470" rx="34" ry="22" fill="#7A1846" opacity=".35" filter="url(#${g}b6)"/><circle cx="600" cy="452" r="27" fill="url(#${g}ball)"/><ellipse cx="591" cy="442" rx="9" ry="6" fill="#fff" opacity=".55"/>` },
  goggle: { name: "GOGGLE", note: "Round lilac head with two huge eyes pressed together under one brow. Tiny mouth.",
    skin: ["#E4D4FF", "#A47BFF", "#4E2BA6"], lid: ["#8257E6", "#B08CFF"], dark: "#3A1F80", line: "#34197A", blush: "#FF7AC2", spot: "#7C54E0", iris: IRIS.teal,
    head: "M600 200 C450 200 370 300 370 410 C370 520 460 600 600 602 C740 600 830 520 830 410 C830 300 750 200 600 200 Z", bottom: 602,
    eyes: [{ cx: 520, cy: 412, rx: 92, ry: 92 }, { cx: 680, cy: 412, rx: 92, ry: 92 }], irisR: 54, pupilR: 28, lidBase: -0.04,
    my: 548, mw: 32, blushAt: [420, 780, 520],
    over: (g) => `<ellipse cx="600" cy="320" rx="210" ry="30" fill="#3A1F80" opacity=".35" filter="url(#${g}b14)"/>` },
  tall: { name: "TALL-EYED", note: "Small peach head, tall oval green eyes, a pale muzzle with a little nose.",
    skin: ["#FFDDB8", "#FF9A4D", "#B3540F"], lid: ["#E67A2B", "#FFA862"], dark: "#8A3F0A", line: "#7A3608", blush: "#FF5A5A", spot: "#E07A2E", iris: IRIS.green,
    head: "M600 210 C460 210 380 300 380 402 C380 506 470 580 600 582 C730 580 820 506 820 402 C820 300 740 210 600 210 Z", bottom: 582,
    eyes: [{ cx: 536, cy: 392, rx: 54, ry: 84 }, { cx: 664, cy: 392, rx: 54, ry: 84 }], irisR: 36, pupilR: 17, lidBase: 0,
    my: 528, mw: 38, blushAt: [436, 764, 480],
    over: (g) => `<ellipse cx="600" cy="518" rx="104" ry="54" fill="#FFE9D0" opacity=".6" filter="url(#${g}b6)"/><path d="M584 486 Q600 476 616 486 Q612 502 600 504 Q588 502 584 486 Z" fill="#8A3F0A"/><ellipse cx="596" cy="487" rx="5" ry="3" fill="#fff" opacity=".5"/>` },
  block: { name: "BLOCK", note: "Square steel-blue head, one heavy brow, small ember eyes. Permanently unimpressed.",
    skin: ["#DDE6F5", "#8BA0C8", "#3C4C70"], lid: ["#6F85B0", "#9FB2D6"], dark: "#2C3957", line: "#27324D", blush: "#FF8FB3", spot: "#6F85B0", iris: IRIS.ember,
    head: "M600 204 C470 204 400 230 384 300 C370 370 370 470 390 530 C410 590 500 612 600 612 C700 612 790 590 810 530 C830 470 830 370 816 300 C800 230 730 204 600 204 Z", bottom: 612,
    eyes: [{ cx: 522, cy: 404, rx: 62, ry: 62 }, { cx: 678, cy: 404, rx: 62, ry: 62 }], irisR: 34, pupilR: 14, lidBase: 0.2,
    my: 546, mw: 64, ny: 500, blushAt: [430, 770, 500], flatSmirk: true,
    over: (g) => `<path d="M436 328 Q600 292 764 328 L764 352 Q600 320 436 352 Z" fill="#2C3957" opacity=".55" filter="url(#${g}b6)"/><path d="M586 590 q14 8 28 0" fill="none" stroke="#27324D" stroke-width="5" stroke-linecap="round" opacity=".5"/>` },
};

const G = "p3-"; // id prefix; made unique per face by the final replaceAll
const grad = (id, type, attrs, stops) => `<${type}Gradient id="${G}${id}" ${attrs}>${stops.map((c, i) => `<stop offset="${typeof c === "string" ? i / (stops.length - 1) : c[0]}" stop-color="${typeof c === "string" ? c : c[1]}"/>`).join("")}</${type}Gradient>`;

function defs(c) {
  const [hi, mid, lo] = c.skin;
  return `<defs>
  ${grad("bg", "radial", 'cx=".5" cy=".42" r=".8"', ["#6FD6FF", [0.6, "#1F96E8"], "#0C57A0"])}
  ${grad("skin", "radial", 'cx=".36" cy=".3" r=".82"', [hi, [0.48, mid], lo])}
  ${grad("lid", "linear", 'x1="0" y1="0" x2="0" y2="1"', c.lid)}
  ${grad("sclera", "radial", 'cx=".4" cy=".34" r=".78"', ["#FFFFFF", [0.62, "#EDF0F6"], "#AEB8CC"])}
  ${grad("iris", "radial", "", [c.iris.c[0], [0.55, c.iris.c[1]], c.iris.c[2]])}
  ${grad("coat", "linear", 'x1="0" y1="0" x2="1" y2="1"', ["#F0D3A2", "#CBA66E", "#8A6736"])}
  ${grad("coat2", "linear", 'x1="0" y1="0" x2="1" y2="1"', ["#C39D63", "#7B5A2E"])}
  ${grad("collar", "linear", 'x1="0" y1="0" x2="1" y2="0"', ["#F3D9AC", "#B58F56"])}
  ${grad("brim", "radial", 'cx=".34" cy=".3" r=".85"', ["#565666", [0.55, "#24242E"], "#0B0B10"])}
  ${grad("crown", "linear", 'x1="0" y1="0" x2="1" y2="0"', ["#5A5A6B", [0.42, "#282832"], "#0A0A0E"])}
  ${grad("band", "linear", 'x1="0" y1="0" x2="1" y2="0"', [hi, [0.4, mid], lo])}
  ${grad("ball", "radial", 'cx=".36" cy=".3" r=".78"', [hi, [0.5, mid], lo])}
  ${grad("shoe", "radial", 'cx=".35" cy=".25" r=".9"', ["#5C5C6C", "#1E1E26", "#07070A"])}
  ${grad("paper", "linear", 'x1="0" y1="0" x2="1" y2="1"', ["#FFFCF1", [0.6, "#F0E8D2"], "#C9BEA0"])}
  ${grad("roll", "linear", 'x1="0" y1="0" x2="1" y2="0"', ["#CFC4A6", [0.38, "#FFFCF1"], "#B5AA8C"])}
  ${grad("gold", "linear", 'x1="0" y1="0" x2="1" y2="1"', ["#FFEBA6", "#C98F12"])}
  ${grad("btn", "radial", 'cx=".35" cy=".3" r=".8"', ["#8A6A45", "#3A2913"])}
  ${grad("fing", "linear", 'x1="0" y1="0" x2="1" y2="0"', [hi, [0.45, mid], lo])}
  ${grad("fingH", "linear", 'x1="0" y1="0" x2="0" y2="1"', [hi, [0.45, mid], lo])}
  ${grad("tooth", "linear", 'x1="0" y1="0" x2="0" y2="1"', ["#CFC8BA", [0.3, "#FFFFFF"], "#E3E9F2"])}
  ${grad("mouth", "radial", 'cx=".5" cy=".2" r=".9"', ["#5A0C2E", "#22030F"])}
  <filter id="${G}b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="${G}b14" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="${G}b28" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
  <filter id="${G}drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#06223F" flood-opacity=".38"/></filter>
  <filter id="${G}grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"/></filter>
  <clipPath id="${G}head"><path d="${c.head}"/></clipPath>
  <linearGradient id="${G}rimg" gradientUnits="userSpaceOnUse" x1="610" y1="0" x2="850" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${G}rim"><rect width="1200" height="1200" fill="url(#${G}rimg)"/></mask>
  <clipPath id="${G}coatc"><path d="${COAT}"/></clipPath>
  ${c.eyes.map((q, i) => `<clipPath id="${G}e${i}"><ellipse cx="${q.cx}" cy="${q.cy}" rx="${q.rx}" ry="${q.ry}"/></clipPath>`).join("")}
  <mask id="${G}holes"><rect width="1200" height="1200" fill="#fff"/>${c.eyes.map((q) => `<ellipse cx="${q.cx}" cy="${q.cy}" rx="${q.rx - 6}" ry="${q.ry - 6}" fill="#000"/>`).join("")}</mask>
</defs>`;
}

const COAT = "M600 560 C500 560 430 590 410 660 C385 750 380 850 392 925 C460 950 740 950 808 925 C820 850 815 750 790 660 C770 590 700 560 600 560 Z";

function eye(q, i, e, c) {
  const { cx, cy, rx, ry } = q, side = i === 0 ? -1 : 1, k = c.irisR / 45;
  const lid = Math.max(0, Math.min(1, e.lid + c.lidBase));
  const ix = cx + e.look * rx * 0.29 - side * rx * 0.065, iy = cy + ry * 0.12;
  const edge = cy - ry + ry * 0.18 + lid * ry * 1.5;
  const yIn = edge + ry * 0.16, yOut = edge - ry * 0.08;
  const x0 = cx - rx - 12, x1 = cx + rx + 12;
  const yL = side < 0 ? yOut : yIn, yR = side < 0 ? yIn : yOut, ctl = edge - ry * 0.21;
  let spokes = "";
  for (let a = 0; a < 18; a++) { const t = a * Math.PI / 9; spokes += `M${ix + Math.cos(t) * c.irisR * 0.5} ${iy + Math.sin(t) * c.irisR * 0.5} L${ix + Math.cos(t) * c.irisR * 0.9} ${iy + Math.sin(t) * c.irisR * 0.9} `; }
  return `
  <ellipse cx="${cx}" cy="${cy + 2}" rx="${rx + 10}" ry="${ry + 10}" fill="${c.dark}" opacity=".5" filter="url(#${G}b6)"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${G}sclera)"/>
  <g clip-path="url(#${G}e${i})">
    <circle cx="${ix}" cy="${iy}" r="${c.irisR}" fill="url(#${G}iris)"/>
    <path d="${spokes}" stroke="${c.iris.rim}" stroke-width="2.2" opacity=".28"/>
    <circle cx="${ix}" cy="${iy}" r="${c.irisR}" fill="none" stroke="${c.iris.rim}" stroke-width="${5 * k}" opacity=".6"/>
    <circle cx="${ix}" cy="${iy}" r="${c.pupilR}" fill="#120A04"/>
    <ellipse cx="${ix - 17 * k}" cy="${iy - 19 * k}" rx="${15 * k}" ry="${10.5 * k}" transform="rotate(-32 ${ix - 17 * k} ${iy - 19 * k})" fill="#fff" opacity=".96"/>
    <circle cx="${ix + 16 * k}" cy="${iy + 17 * k}" r="${5.5 * k}" fill="#fff" opacity=".7"/>
    <path d="M${x0} ${cy - ry - 14} H${x1} V${yR + 20} Q${cx} ${ctl + 22} ${x0} ${yL + 20} Z" fill="#1A0612" opacity=".3" filter="url(#${G}b6)"/>
    <path d="M${x0} ${cy - ry - 14} H${x1} V${yR} Q${cx} ${ctl} ${x0} ${yL} Z" fill="url(#${G}lid)"/>
    <path d="M${x0} ${yL} Q${cx} ${ctl} ${x1} ${yR}" fill="none" stroke="${c.dark}" stroke-width="7" stroke-linecap="round"/>
    <path d="M${x0} ${cy + ry + 14} H${x1} V${cy + ry + 2} Q${cx} ${cy + ry - 12} ${x0} ${cy + ry + 2} Z" fill="url(#${G}lid)" opacity=".85"/>
  </g>`;
}

function mouth(e, c) {
  const y = c.my, w = c.mw, s = w / 58, hi = c.skin[0];
  const tooth = (x, ty, tw, th) => `<rect x="${x}" y="${ty}" width="${tw}" height="${th}" rx="${tw * 0.34}" fill="url(#${G}tooth)"/><rect x="${x}" y="${ty}" width="${tw}" height="${th}" rx="${tw * 0.34}" fill="none" stroke="#B9B2A2" stroke-width="2" opacity=".55"/>`;
  if (e.mouth === "talk") {
    const o = Math.max(0.1, Math.min(1, e.open ?? 1)), v = w * (0.6 + 0.4 * o);   // v: mouth narrows as it closes
    const d = `M${600 - v} ${y} Q600 ${y - 16 * s} ${600 + v} ${y} Q${600 + v - 8 * s} ${y + 72 * s * o} 600 ${y + 76 * s * o} Q${600 - v + 8 * s} ${y + 72 * s * o} ${600 - v} ${y} Z`;
    const row = c.teeth
      ? [[-45, 20, 20], [-23, 22, 30], [1, 22, 30], [25, 20, 20]].map(([dx, tw, th]) => tooth(600 + dx * s, y - 12 * s, tw * s, th * s)).join("")
      : `<rect x="${600 - 38 * s}" y="${y - 12 * s}" width="${76 * s}" height="${26 * s}" rx="${9 * s}" fill="#FFFDF6"/>`;
    return `<path d="${d}" fill="url(#${G}mouth)"/><clipPath id="${G}mc"><path d="${d}"/></clipPath>
      <g clip-path="url(#${G}mc)"><ellipse cx="602" cy="${y + 20 * s + 42 * s * o}" rx="${36 * s}" ry="${20 * s}" fill="#FF7DB8"/>${row}</g>
      <path d="${d}" fill="none" stroke="${c.dark}" stroke-width="6"/>`;
  }
  if (e.mouth === "flat") return `
    ${c.teeth ? tooth(600 - 21, y + 10, 20, 20) + tooth(600 + 1, y + 10, 19, 18) : ""}
    <path d="M${600 - w * 0.85} ${y + 14} Q600 ${y + 8} ${600 + w * 0.9} ${y + 16}" fill="none" stroke="${c.line}" stroke-width="10" stroke-linecap="round"/>
    ${c.teeth ? "" : `<path d="M${600 - w * 0.7} ${y + 30} Q600 ${y + 24} ${600 + w * 0.75} ${y + 31}" fill="none" stroke="${hi}" stroke-width="6" stroke-linecap="round" opacity=".45"/>`}`;
  const dip = c.flatSmirk ? 0.34 : 0.73, rise = c.flatSmirk ? 10 : 14;
  const mid = y + dip * w * 0.5 - rise * 0.25;   // lip height at x = 600
  return `${c.teeth ? tooth(600 - 27, mid - 5, 26, 33) + tooth(600 + 2, mid - 7, 24, 30) : ""}
    <path d="M${600 - w} ${y} Q${600 - 2} ${y + dip * w} ${600 + w * 1.2} ${y - rise}" fill="none" stroke="${c.line}" stroke-width="10" stroke-linecap="round"/>
    ${c.teeth ? "" : `<path d="M${600 - w * 0.73} ${y + 24} Q600 ${y + dip * w + 12} ${600 + w * 0.93} ${y + 12}" fill="none" stroke="${hi}" stroke-width="7" stroke-linecap="round" opacity=".45"/>`}
    <path d="M${600 + w * 1.2} ${y - rise} q10 -8 16 -2" fill="none" stroke="${c.dark}" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
}

// Hands are single silhouettes lit as one object: three finger bumps separated by soft creases
// and a thumb lobe. No separate finger shapes, so every pose reads as the same glove-like hand.
const crease = (d, lo) => `<path d="${d}" fill="none" stroke="${lo}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>`;
const glint = (x, y, rx, ry, a = 0.26) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${a}"/>`;

// Relaxed mitt hanging from a cuff, seen from the back. d = +1 puts the thumb on the right.
function mitt(cx, cy, d, lo) {
  const X = (x) => cx + x * d, Y = (y) => cy + y, P = (x, y) => `${X(x)} ${Y(y)}`;
  const shape = `M${P(-30, -42)} C${P(-46, -34)} ${P(-50, 4)} ${P(-42, 26)} C${P(-40, 46)} ${P(-20, 52)} ${P(-15, 32)} C${P(-12, 58)} ${P(12, 58)} ${P(15, 32)} C${P(20, 52)} ${P(40, 46)} ${P(42, 26)} C${P(50, 40)} ${P(66, 36)} ${P(66, 18)} C${P(66, 0)} ${P(54, -16)} ${P(40, -22)} C${P(38, -32)} ${P(34, -40)} ${P(30, -42)} Z`;
  return `<g filter="url(#${G}drop)"><path d="${shape}" fill="url(#${G}ball)"/>
    ${crease(`M${P(-15, 32)} Q${P(-17, 20)} ${P(-14, 10)}`, lo)}${crease(`M${P(15, 32)} Q${P(17, 20)} ${P(14, 10)}`, lo)}${crease(`M${P(42, 26)} Q${P(36, 16)} ${P(38, 6)}`, lo)}
    ${glint(X(-14), Y(-18), 17, 9, 0.3)}${glint(X(-29), Y(36), 6, 4)}${glint(X(-2), Y(44), 6, 4)}${glint(X(26), Y(36), 6, 4)}</g>`;
}

// A fist closed round a vertical tube whose centre line is x = 0; the hand arrives from the right.
function fist(y, lo) {
  const shape = `M38 ${y} C54 ${y + 2} 58 ${y + 24} 58 ${y + 46} C58 ${y + 74} 50 ${y + 93} 30 ${y + 93} L-30 ${y + 93} C-54 ${y + 93} -54 ${y + 62} -30 ${y + 62} C-54 ${y + 62} -54 ${y + 31} -30 ${y + 31} C-54 ${y + 31} -54 ${y} -30 ${y} C-6 ${y - 4} 16 ${y - 4} 38 ${y} Z`;
  const thumb = `M46 ${y + 8} C32 ${y - 20} -8 ${y - 16} -24 ${y + 2} C-32 ${y + 14} -22 ${y + 28} -8 ${y + 24} C10 ${y + 18} 32 ${y + 24} 46 ${y + 8} Z`;
  return `<g filter="url(#${G}drop)"><path d="${shape}" fill="url(#${G}ball)"/>
    ${crease(`M-30 ${y + 62} Q4 ${y + 58} 36 ${y + 64}`, lo)}${crease(`M-30 ${y + 31} Q4 ${y + 28} 36 ${y + 34}`, lo)}
    ${glint(-38, y + 46, 5, 8)}${glint(-38, y + 77, 5, 8)}</g>
    <g filter="url(#${G}drop)"><path d="${thumb}" fill="url(#${G}ball)"/>${glint(-4, y - 2, 14, 6, 0.3)}</g>`;
}

// Fingertips over the edge of a sheet at x. d = +1 for the left edge (fingers point right).
const gripBack = (x, y, d) => `<rect x="${d > 0 ? x - 40 : x - 6}" y="${y - 6}" width="46" height="105" rx="22" fill="url(#${G}ball)"/>`;
function grip(x, y, d, lo) {
  const X = (v) => x + v * d;
  const shape = `M${X(-16)} ${y} L${X(22)} ${y} C${X(50)} ${y} ${X(50)} ${y + 31} ${X(22)} ${y + 31} C${X(50)} ${y + 31} ${X(50)} ${y + 62} ${X(22)} ${y + 62} C${X(50)} ${y + 62} ${X(50)} ${y + 93} ${X(22)} ${y + 93} L${X(-16)} ${y + 93} C${X(-26)} ${y + 93} ${X(-26)} ${y} ${X(-16)} ${y} Z`;
  return `<g filter="url(#${G}drop)"><path d="${shape}" fill="url(#${G}ball)"/>
    ${crease(`M${X(22)} ${y + 31} H${X(-8)}`, lo)}${crease(`M${X(22)} ${y + 62} H${X(-8)}`, lo)}
    ${glint(X(26), y + 12, 7, 5)}${glint(X(26), y + 43, 7, 5)}${glint(X(26), y + 74, 7, 5)}</g>`;
}

function newspaper(top, holes, c) {
  const h = 900 - top, rows = (x, w, y0, n) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y0 + i * 22}" width="${w}" height="9" rx="2" fill="#A39A84"/>`).join("");
  const low = Math.max(...c.eyes.map((q) => q.cy + q.ry));
  const my = holes ? low + 94 : top + 92, hy = my + 82, n = Math.max(2, Math.floor((900 - hy - 66) / 22));
  const rims = holes ? c.eyes.map((q) => `<ellipse cx="${q.cx}" cy="${q.cy}" rx="${q.rx - 6}" ry="${q.ry - 6}" fill="none" stroke="#8C8268" stroke-width="5" opacity=".7"/>`).join("") : "";
  return `<g filter="url(#${G}drop)"><g transform="rotate(-2 600 ${top + h / 2})" ${holes ? `mask="url(#${G}holes)"` : ""}>
    <rect x="290" y="${top}" width="620" height="${h}" rx="8" fill="url(#${G}paper)"/>
    <rect x="596" y="${top}" width="8" height="${h}" fill="#B9AE90" opacity=".45"/><rect x="604" y="${top}" width="40" height="${h}" fill="#fff" opacity=".18"/>
    <text x="600" y="${my}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="84" letter-spacing="5" fill="#22201C">EARTH DAILY</text>
    <rect x="320" y="${my + 18}" width="560" height="6" fill="#22201C"/>
    <text x="600" y="${hy}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="42" letter-spacing="1" fill="#22201C">HUMANS: STILL NOT PATCHING</text>
    <rect x="320" y="${hy + 18}" width="560" height="4" fill="#22201C"/>
    ${rows(322, 168, hy + 44, n)}${rows(516, 168, hy + 44, n)}
    <rect x="712" y="${hy + 42}" width="166" height="${Math.max(40, Math.min(120, 900 - hy - 66))}" fill="#D9D0B8"/><ellipse cx="795" cy="${hy + 92}" rx="48" ry="12" fill="#22201C"/><path d="M769 ${hy + 88} a26 22 0 0 1 52 0 z" fill="#22201C"/>
  </g>${rims}</g>`;
}

// Animation hooks: e.open (0..1 mouth opening while talking), paperShift (px the open newspaper is lowered),
// bob / tilt (head and hat offset in px and degrees), bg and grain (turn off for compositing and speed).
export function peek3d(e, { face = "A", paper = "pockets", size = 1200, viewBox = "0 0 1200 1200", paperShift = 0, bob = 0, tilt = 0, bg = true, grain = true } = {}) {
  const c = FACES[face];
  const [hi, mid, lo] = c.skin;
  const arm = "M436 636 C388 690 370 772 380 832 C402 846 438 846 458 832 C460 772 472 702 490 650 Z";
  const flip = (m, inner) => `<g ${m ? 'transform="translate(1200,0) scale(-1,1)"' : ""}>${inner}</g>`;
  const sleeve = (m) => flip(m, `<path d="${arm}" transform="translate(12 6)" fill="#4A3418" opacity=".5" filter="url(#${G}b6)"/><path d="${arm}" fill="url(#${G}coat${m ? "2" : ""})"/><path d="M432 652 C394 702 380 770 386 822" fill="none" stroke="#F6E0B8" stroke-width="6" stroke-linecap="round" opacity="${m ? 0.25 : 0.5}"/>`);
  const cuff = (m) => flip(m, `<ellipse cx="419" cy="836" rx="43" ry="15" fill="#6E5126"/><ellipse cx="419" cy="831" rx="43" ry="14" fill="url(#${G}coat2)"/><path d="M380 828 C400 838 438 838 458 828" fill="none" stroke="#F0D3A2" stroke-width="3" opacity=".5"/>`);
  const antenna = (m) => `<g ${m ? 'transform="translate(1200,0) scale(-1,1)"' : ""}><path d="M396 240 C366 190 340 160 324 118" fill="none" stroke="${lo}" stroke-width="15" stroke-linecap="round"/><path d="M394 238 C364 190 338 160 322 118" fill="none" stroke="${mid}" stroke-width="7" stroke-linecap="round"/><circle cx="318" cy="100" r="27" fill="url(#${G}ball)"/><ellipse cx="309" cy="90" rx="8" ry="6" fill="#fff" opacity=".8"/></g>`;
  const body = `
  <ellipse cx="600" cy="1012" rx="300" ry="36" fill="#031A33" opacity=".5" filter="url(#${G}b14)"/>
  <rect x="524" y="900" width="52" height="84" rx="16" fill="#1E1E26"/><rect x="624" y="900" width="52" height="84" rx="16" fill="#15151B"/>
  <ellipse cx="536" cy="990" rx="58" ry="25" fill="url(#${G}shoe)"/><ellipse cx="664" cy="990" rx="58" ry="25" fill="url(#${G}shoe)"/>
  <ellipse cx="516" cy="980" rx="18" ry="7" fill="#fff" opacity=".28"/><ellipse cx="644" cy="980" rx="18" ry="7" fill="#fff" opacity=".28"/>
  <path d="${COAT}" fill="url(#${G}coat)"/>
  <g clip-path="url(#${G}coatc)">
    <ellipse cx="860" cy="760" rx="110" ry="260" fill="#5B4220" opacity=".4" filter="url(#${G}b28)"/>
    <ellipse cx="600" cy="960" rx="260" ry="46" fill="#4A3418" opacity=".5" filter="url(#${G}b14)"/>
    <ellipse cx="600" cy="600" rx="170" ry="40" fill="#3D2A12" opacity=".5" filter="url(#${G}b14)"/>
    <path d="M604 620 C596 720 596 840 588 940" fill="none" stroke="#7B5A2E" stroke-width="5" opacity=".7"/>
    <path d="M388 778 C460 800 740 800 812 778 L814 824 C740 846 460 846 386 824 Z" fill="url(#${G}coat2)"/>
    <path d="M388 778 C460 800 740 800 812 778" fill="none" stroke="#F0D3A2" stroke-width="4" opacity=".5"/>
  </g>
  <rect x="572" y="784" width="58" height="46" rx="9" fill="url(#${G}gold)"/><rect x="584" y="795" width="34" height="24" rx="4" fill="#7B5A2E"/>
  ${[[556, 688], [646, 688], [556, 738], [646, 738]].map(([x, y]) => `<circle cx="${x}" cy="${y + 3}" r="14" fill="#5B4220" opacity=".5"/><circle cx="${x}" cy="${y}" r="14" fill="url(#${G}btn)"/><ellipse cx="${x - 4}" cy="${y - 5}" rx="5" ry="3" fill="#fff" opacity=".35"/>`).join("")}`;
  const tube = `<rect x="-34" y="-170" width="68" height="320" rx="30" fill="url(#${G}roll)"/><ellipse cx="0" cy="-166" rx="34" ry="13" fill="#EFE7D1"/><ellipse cx="0" cy="-166" rx="20" ry="7" fill="none" stroke="#A39A84" stroke-width="3"/><ellipse cx="0" cy="-166" rx="8" ry="3" fill="#A39A84"/>
    <text transform="rotate(-90)" x="48" y="12" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="34" letter-spacing="3" fill="#22201C">EARTH DAILY</text>`;
  const roll = `<g transform="translate(792 752) rotate(14)"><g filter="url(#${G}drop)">${tube}</g>${fist(54, lo)}</g>`;
  // Hands-in-pockets pose: the rolled paper is tucked under the arm, the sleeves vanish behind pocket flaps.
  const tucked = `<g transform="translate(796 748) rotate(15)" filter="url(#${G}drop)">${tube}</g>`;
  const flap = (m) => flip(m, `<path d="M384 846 C408 834 452 832 478 842" fill="none" stroke="#3D2A12" stroke-width="12" stroke-linecap="round" opacity=".75"/>
    <path d="M384 848 C408 838 452 836 478 846 L474 904 C450 914 410 914 390 906 Z" fill="url(#${G}coat${m ? "2" : ""})"/>
    <path d="M384 848 C408 838 452 836 478 846" fill="none" stroke="#F0D3A2" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>
    <path d="M394 860 C414 852 448 850 468 857" fill="none" stroke="#7B5A2E" stroke-width="2.5" stroke-dasharray="7 7" opacity=".7"/>
    <ellipse cx="430" cy="882" rx="26" ry="14" fill="#fff" opacity=".1" filter="url(#${G}b6)"/>`);
  const collar = `
  <path d="M600 664 L452 632 C400 602 370 560 364 508 C430 540 520 592 600 664 Z" fill="url(#${G}collar)"/>
  <path d="M600 664 L748 632 C800 602 830 560 836 508 C770 540 680 592 600 664 Z" fill="url(#${G}coat2)"/>
  <path d="M536 606 H664 L600 700 Z" fill="#1F2A44"/>
  <path d="M588 612 h24 l8 20 l-20 62 l-20 -62 z" fill="#E5333F"/><path d="M588 612 h24 l8 20 h-40 z" fill="#B3202C"/>
  <path d="M600 664 L506 626 L478 712 L574 762 Z" fill="url(#${G}coat2)" opacity=".95"/><path d="M600 664 L694 626 L722 712 L626 762 Z" fill="#7B5A2E" opacity=".95"/>`;
  const [bl, br, by] = c.blushAt;
  const nose = c.ny ? `<ellipse cx="590" cy="${c.ny}" rx="5" ry="3.5" fill="${c.dark}" opacity=".7"/><ellipse cx="612" cy="${c.ny}" rx="5" ry="3.5" fill="${c.dark}" opacity=".7"/>` : "";
  const head = `
  <ellipse cx="600" cy="${c.bottom + 18}" rx="150" ry="24" fill="#2A1A0A" opacity=".45" filter="url(#${G}b14)"/>
  ${c.under ? c.under(G) : ""}
  <path d="${c.head}" fill="url(#${G}skin)"/>
  <g clip-path="url(#${G}head)">
    <g mask="url(#${G}rim)"><path d="${c.head}" fill="none" stroke="#B9ECFF" stroke-width="26" opacity=".5" filter="url(#${G}b6)"/></g>
    <ellipse cx="${bl}" cy="${by}" rx="52" ry="34" fill="${c.blush}" opacity=".42" filter="url(#${G}b14)"/><ellipse cx="${br}" cy="${by}" rx="52" ry="34" fill="${c.blush}" opacity=".38" filter="url(#${G}b14)"/>
    <ellipse cx="${bl - 16}" cy="${by - 132}" rx="12" ry="8" fill="${c.spot}" opacity=".5"/><ellipse cx="${bl + 6}" cy="${by - 154}" rx="7" ry="5" fill="${c.spot}" opacity=".5"/><ellipse cx="${br + 22}" cy="${by - 134}" rx="9" ry="6" fill="${c.spot}" opacity=".4"/>
    ${c.over ? c.over(G) : ""}
  </g>
  ${c.eyes.map((q, i) => eye(q, i, e, c)).join("")}
  ${nose}${mouth(e, c)}
  <g clip-path="url(#${G}head)"><ellipse cx="600" cy="262" rx="330" ry="74" fill="#1F0614" opacity=".55" filter="url(#${G}b14)"/></g>`;
  const hat = `<g transform="rotate(-5 600 240)">
    <ellipse cx="600" cy="262" rx="336" ry="62" fill="#050508"/>
    <ellipse cx="600" cy="246" rx="336" ry="60" fill="url(#${G}brim)"/>
    <ellipse cx="520" cy="222" rx="170" ry="16" fill="#fff" opacity=".1" filter="url(#${G}b6)"/>
    <path d="M430 240 C420 124 470 62 600 68 C730 62 780 124 770 240 C720 268 480 268 430 240 Z" fill="url(#${G}crown)"/>
    <ellipse cx="600" cy="86" rx="92" ry="15" fill="#07070A" opacity=".75" filter="url(#${G}b6)"/>
    <path d="M470 116 C476 92 500 80 530 76" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".16"/>
    <path d="M431 200 C480 230 720 230 769 200 L770 240 C720 268 480 268 430 240 Z" fill="url(#${G}band)"/>
    <path d="M440 208 C480 228 560 234 610 233" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/>
    <g transform="rotate(12 716 196)" filter="url(#${G}drop)"><rect x="672" y="162" width="96" height="60" rx="5" fill="url(#${G}paper)"/><text x="720" y="201" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="24" fill="#22201C">PRESS</text></g>
    ${antenna(false)}${antenna(true)}
  </g>`;
  const low = Math.max(...c.eyes.map((q) => q.cy + q.ry));
  const sheet = (top, holes, y) => gripBack(292, y, 1) + gripBack(908, y - 8, -1) + newspaper(top, holes, c) + grip(292, y, 1, lo) + grip(908, y - 8, -1, lo);
  const paperLayer = paper === "over" ? sheet(low + 4, false, low + 110) : paper === "holes" ? sheet(292, true, 560) : "";
  const pose = `translate(0 ${bob}) rotate(${tilt} 600 620)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}">${defs(c)}
  ${bg ? `<rect width="1200" height="1200" fill="url(#${G}bg)"/><ellipse cx="600" cy="1080" rx="900" ry="200" fill="#8FE0FF" opacity=".22" filter="url(#${G}b28)"/>` : ""}
  ${body}
  ${paper === "roll" ? sleeve(false) + mitt(419, 872, 1, lo) + cuff(false) + sleeve(true) + cuff(true) + roll : ""}
  ${paper !== "roll" ? tucked + sleeve(false) + sleeve(true) + flap(false) + flap(true) : ""}
  ${collar}<g transform="${pose}">${head}</g><g transform="translate(0 ${paperShift})">${paperLayer}</g><g transform="${pose}">${hat}</g>
  ${grain ? `<rect width="1200" height="1200" filter="url(#${G}grain)" opacity=".1" style="mix-blend-mode:overlay"/>` : ""}
  </svg>`;
  return svg.replaceAll(G, `p3${face}${paper}-`);
}
