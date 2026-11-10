// PEEK drawn as a soft, volumetric cartoon: gradients for form, no outlines, glossy eyes,
// a brim shadow across the face. Same expression object as characters.js.
//   peek3d(expression, { face, paper, size, viewBox })
// face:  a key of FACES (head shape, eyes, colours, features)
// paper: "roll" (rolled paper in hand, face visible) | "over" (peeking over) | "holes" (hidden behind, two holes)

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
    my: 536, mw: 88, tooth: true, blushAt: [420, 780, 510],
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
  if (e.mouth === "talk") {
    const d = `M${600 - w} ${y} Q600 ${y - 16 * s} ${600 + w} ${y} Q${600 + w - 8 * s} ${y + 72 * s} 600 ${y + 76 * s} Q${600 - w + 8 * s} ${y + 72 * s} ${600 - w} ${y} Z`;
    return `<path d="${d}" fill="url(#${G}mouth)"/><clipPath id="${G}mc"><path d="${d}"/></clipPath>
      <g clip-path="url(#${G}mc)"><rect x="${600 - 38 * s}" y="${y - 12 * s}" width="${76 * s}" height="${26 * s}" rx="${9 * s}" fill="#FFFDF6"/><ellipse cx="602" cy="${y + 60 * s}" rx="${34 * s}" ry="${19 * s}" fill="#FF7DB8"/></g>
      <path d="${d}" fill="none" stroke="${c.dark}" stroke-width="6"/>`;
  }
  if (e.mouth === "flat") return `
    <path d="M${600 - w * 0.85} ${y + 14} Q600 ${y + 8} ${600 + w * 0.9} ${y + 16}" fill="none" stroke="${c.line}" stroke-width="10" stroke-linecap="round"/>
    <path d="M${600 - w * 0.7} ${y + 30} Q600 ${y + 24} ${600 + w * 0.75} ${y + 31}" fill="none" stroke="${hi}" stroke-width="6" stroke-linecap="round" opacity=".45"/>`;
  const dip = c.flatSmirk ? 0.34 : 0.73, rise = c.flatSmirk ? 10 : 14;
  const tooth = c.tooth ? `<rect x="${600 + w * 0.12}" y="${y + w * 0.2}" width="${w * 0.3}" height="${w * 0.34}" rx="6" fill="#FFFDF6"/><rect x="${600 + w * 0.12}" y="${y + w * 0.2}" width="${w * 0.3}" height="${w * 0.34}" rx="6" fill="none" stroke="${c.line}" stroke-width="3" opacity=".5"/>` : "";
  return `${tooth}
    <path d="M${600 - w} ${y} Q${600 - 2} ${y + dip * w} ${600 + w * 1.2} ${y - rise}" fill="none" stroke="${c.line}" stroke-width="10" stroke-linecap="round"/>
    <path d="M${600 - w * 0.73} ${y + 24} Q600 ${y + dip * w + 12} ${600 + w * 0.93} ${y + 12}" fill="none" stroke="${hi}" stroke-width="7" stroke-linecap="round" opacity="${c.tooth ? 0 : 0.45}"/>
    <path d="M${600 + w * 1.2} ${y - rise} q10 -8 16 -2" fill="none" stroke="${c.dark}" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
}

const hand = (cx, cy) => `<g filter="url(#${G}drop)"><circle cx="${cx}" cy="${cy}" r="36" fill="url(#${G}ball)"/>
  <ellipse cx="${cx - 22}" cy="${cy + 26}" rx="14" ry="20" fill="url(#${G}ball)"/><ellipse cx="${cx + 2}" cy="${cy + 32}" rx="14" ry="21" fill="url(#${G}ball)"/><ellipse cx="${cx + 25}" cy="${cy + 25}" rx="13" ry="19" fill="url(#${G}ball)"/></g>`;
const grip = (x, y, flip) => [0, 44, 88].map((dy) => `<ellipse cx="${x}" cy="${y + dy}" rx="40" ry="20" transform="rotate(${flip * 8} ${x} ${y + dy})" fill="url(#${G}ball)"/>`).join("");

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

export function peek3d(e, { face = "A", paper = "roll", size = 1200, viewBox = "0 0 1200 1200" } = {}) {
  const c = FACES[face];
  const [hi, mid, lo] = c.skin;
  const showArms = paper === "roll";
  const sleeve = (m) => `<g ${m ? 'transform="translate(1200,0) scale(-1,1)"' : ""}><path d="M436 636 C388 690 370 772 378 838 C400 856 438 856 458 838 C460 772 472 702 490 650 Z" fill="url(#${G}coat${m ? "2" : ""})"/><path d="M380 800 C404 814 436 814 458 800 L458 822 C436 836 402 836 379 822 Z" fill="#8A6736" opacity=".55"/></g>`;
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
  const roll = `<g transform="translate(806 760) rotate(16)" filter="url(#${G}drop)"><rect x="-34" y="-170" width="68" height="320" rx="30" fill="url(#${G}roll)"/><ellipse cx="0" cy="-166" rx="34" ry="13" fill="#EFE7D1"/><ellipse cx="0" cy="-166" rx="20" ry="7" fill="none" stroke="#A39A84" stroke-width="3"/><ellipse cx="0" cy="-166" rx="8" ry="3" fill="#A39A84"/>
    <text transform="rotate(-90)" x="20" y="12" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="34" letter-spacing="3" fill="#22201C">EARTH DAILY</text></g>`;
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
  const paperLayer = paper === "over" ? newspaper(low + 4, false, c) + grip(300, low + 120, -1) + grip(900, low + 110, 1)
    : paper === "holes" ? newspaper(292, true, c) + grip(300, 560, -1) + grip(900, 550, 1) : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}">${defs(c)}
  <rect width="1200" height="1200" fill="url(#${G}bg)"/>
  <ellipse cx="600" cy="1080" rx="900" ry="200" fill="#8FE0FF" opacity=".22" filter="url(#${G}b28)"/>
  ${body}
  ${showArms ? sleeve(false) + sleeve(true) + hand(416, 852) + roll + hand(786, 852) : ""}
  ${collar}${head}${paperLayer}${hat}
  <rect width="1200" height="1200" filter="url(#${G}grain)" opacity=".1" style="mix-blend-mode:overlay"/>
  </svg>`;
  return svg.replaceAll(G, `p3${face}${paper}-`);
}
