// PEEK drawn as a soft, volumetric cartoon: gradients for form, no outlines, glossy eyes,
// a brim shadow across the face. Same expression object as characters.js.
// paper: "roll" (rolled paper in hand, face visible) | "over" (peeking over) | "holes" (hidden behind, two holes)

const DEFS = `
<defs>
  <radialGradient id="p3-bg" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#6FD6FF"/><stop offset=".6" stop-color="#1F96E8"/><stop offset="1" stop-color="#0C57A0"/></radialGradient>
  <radialGradient id="p3-skin" cx=".36" cy=".3" r=".82"><stop offset="0" stop-color="#FFA9D3"/><stop offset=".48" stop-color="#FF4FA3"/><stop offset="1" stop-color="#A81F65"/></radialGradient>
  <linearGradient id="p3-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2367F"/><stop offset="1" stop-color="#F0489A"/></linearGradient>
  <radialGradient id="p3-sclera" cx=".4" cy=".34" r=".78"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".62" stop-color="#EDF0F6"/><stop offset="1" stop-color="#AEB8CC"/></radialGradient>
  <radialGradient id="p3-iris"><stop offset="0" stop-color="#FFF4B8"/><stop offset=".55" stop-color="#FFC533"/><stop offset="1" stop-color="#D27A00"/></radialGradient>
  <linearGradient id="p3-coat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0D3A2"/><stop offset=".5" stop-color="#CBA66E"/><stop offset="1" stop-color="#8A6736"/></linearGradient>
  <linearGradient id="p3-coat2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C39D63"/><stop offset="1" stop-color="#7B5A2E"/></linearGradient>
  <linearGradient id="p3-collar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F3D9AC"/><stop offset="1" stop-color="#B58F56"/></linearGradient>
  <radialGradient id="p3-brim" cx=".34" cy=".3" r=".85"><stop offset="0" stop-color="#565666"/><stop offset=".55" stop-color="#24242E"/><stop offset="1" stop-color="#0B0B10"/></radialGradient>
  <linearGradient id="p3-crown" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A5A6B"/><stop offset=".42" stop-color="#282832"/><stop offset="1" stop-color="#0A0A0E"/></linearGradient>
  <linearGradient id="p3-band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFB1D8"/><stop offset=".4" stop-color="#FF4FA3"/><stop offset="1" stop-color="#8E1754"/></linearGradient>
  <radialGradient id="p3-ball" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="#FFD0E8"/><stop offset=".5" stop-color="#FF4FA3"/><stop offset="1" stop-color="#9A1A5B"/></radialGradient>
  <radialGradient id="p3-shoe" cx=".35" cy=".25" r=".9"><stop offset="0" stop-color="#5C5C6C"/><stop offset=".5" stop-color="#1E1E26"/><stop offset="1" stop-color="#07070A"/></radialGradient>
  <linearGradient id="p3-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFCF1"/><stop offset=".6" stop-color="#F0E8D2"/><stop offset="1" stop-color="#C9BEA0"/></linearGradient>
  <linearGradient id="p3-roll" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#CFC4A6"/><stop offset=".38" stop-color="#FFFCF1"/><stop offset="1" stop-color="#B5AA8C"/></linearGradient>
  <linearGradient id="p3-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFEBA6"/><stop offset="1" stop-color="#C98F12"/></linearGradient>
  <radialGradient id="p3-btn" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#8A6A45"/><stop offset="1" stop-color="#3A2913"/></radialGradient>
  <radialGradient id="p3-mouth" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="#5A0C2E"/><stop offset="1" stop-color="#22030F"/></radialGradient>
  <filter id="p3-b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="p3-b14" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="p3-b28" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
  <filter id="p3-drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#06223F" flood-opacity=".38"/></filter>
  <filter id="p3-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"/></filter>
  <clipPath id="p3-head"><path d="M600 196 C440 196 350 296 350 404 C350 522 460 592 600 594 C740 592 850 522 850 404 C850 296 760 196 600 196 Z"/></clipPath>
  <clipPath id="p3-coatc"><path d="M600 560 C500 560 430 590 410 660 C385 750 380 850 392 925 C460 950 740 950 808 925 C820 850 815 750 790 660 C770 590 700 560 600 560 Z"/></clipPath>
  <clipPath id="p3-eL"><circle cx="512" cy="414" r="76"/></clipPath><clipPath id="p3-eR"><circle cx="688" cy="414" r="76"/></clipPath>
  <mask id="p3-holes"><rect width="1200" height="1200" fill="#fff"/><circle cx="512" cy="414" r="70" fill="#000"/><circle cx="688" cy="414" r="70" fill="#000"/></mask>
</defs>`;

const HEAD = "M600 196 C440 196 350 296 350 404 C350 522 460 592 600 594 C740 592 850 522 850 404 C850 296 760 196 600 196 Z";
const COAT = "M600 560 C500 560 430 590 410 660 C385 750 380 850 392 925 C460 950 740 950 808 925 C820 850 815 750 790 660 C770 590 700 560 600 560 Z";

function eye(cx, side, e) {
  const cy = 414, R = 76, id = side < 0 ? "p3-eL" : "p3-eR";
  const ix = cx + e.look * 22 - side * 5, iy = cy + 9;
  const edge = cy - R + 14 + e.lid * R * 1.5;
  const yIn = edge + 12, yOut = edge - 6;
  const x0 = cx - R - 12, x1 = cx + R + 12;
  const yL = side < 0 ? yOut : yIn, yR = side < 0 ? yIn : yOut;
  const curve = `M${x0} ${yL} Q${cx} ${edge - 16} ${x1} ${yR}`;
  let spokes = "";
  for (let a = 0; a < 18; a++) { const t = a * Math.PI / 9; spokes += `M${ix + Math.cos(t) * 23} ${iy + Math.sin(t) * 23} L${ix + Math.cos(t) * 41} ${iy + Math.sin(t) * 41} `; }
  return `
  <circle cx="${cx}" cy="${cy + 2}" r="${R + 10}" fill="#8E1754" opacity=".5" filter="url(#p3-b6)"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#p3-sclera)"/>
  <g clip-path="url(#${id})">
    <circle cx="${ix}" cy="${iy}" r="45" fill="url(#p3-iris)"/>
    <path d="${spokes}" stroke="#A85F00" stroke-width="2.2" opacity=".3"/>
    <circle cx="${ix}" cy="${iy}" r="45" fill="none" stroke="#5E3200" stroke-width="5" opacity=".6"/>
    <circle cx="${ix}" cy="${iy}" r="21" fill="#140B02"/>
    <ellipse cx="${ix - 17}" cy="${iy - 19}" rx="15" ry="10.5" transform="rotate(-32 ${ix - 17} ${iy - 19})" fill="#fff" opacity=".96"/>
    <circle cx="${ix + 16}" cy="${iy + 17}" r="5.5" fill="#fff" opacity=".7"/>
    <path d="M${x0} ${cy - R - 14} H${x1} V${yR + 20} Q${cx} ${edge + 6} ${x0} ${yL + 20} Z" fill="#1A0612" opacity=".3" filter="url(#p3-b6)"/>
    <path d="M${x0} ${cy - R - 14} H${x1} V${yR} Q${cx} ${edge - 16} ${x0} ${yL} Z" fill="url(#p3-lid)"/>
    <path d="${curve}" fill="none" stroke="#5A0E36" stroke-width="7" stroke-linecap="round"/>
    <path d="M${x0} ${cy + R + 14} H${x1} V${cy + R + 2} Q${cx} ${cy + R - 12} ${x0} ${cy + R + 2} Z" fill="url(#p3-lid)" opacity=".85"/>
  </g>`;
}

function mouth(e) {
  if (e.mouth === "talk") return `
    <path d="M546 506 Q604 490 662 506 Q654 578 604 582 Q554 578 546 506 Z" fill="url(#p3-mouth)"/>
    <clipPath id="p3-mc"><path d="M546 506 Q604 490 662 506 Q654 578 604 582 Q554 578 546 506 Z"/></clipPath>
    <g clip-path="url(#p3-mc)"><rect x="566" y="494" width="76" height="26" rx="9" fill="#FFFDF6"/><ellipse cx="606" cy="566" rx="34" ry="19" fill="#FF7DB8"/><ellipse cx="598" cy="560" rx="14" ry="6" fill="#FFB1D8" opacity=".7"/></g>
    <path d="M546 506 Q604 490 662 506 Q654 578 604 582 Q554 578 546 506 Z" fill="none" stroke="#8E1754" stroke-width="6"/>`;
  if (e.mouth === "flat") return `
    <path d="M552 524 Q602 518 654 526" fill="none" stroke="#7A1846" stroke-width="10" stroke-linecap="round"/>
    <path d="M560 540 Q602 534 646 541" fill="none" stroke="#FFB1D8" stroke-width="6" stroke-linecap="round" opacity=".45"/>`;
  return `
    <path d="M540 508 Q598 552 672 494" fill="none" stroke="#7A1846" stroke-width="10" stroke-linecap="round"/>
    <path d="M556 532 Q600 562 656 520" fill="none" stroke="#FFB1D8" stroke-width="7" stroke-linecap="round" opacity=".45"/>
    <path d="M672 494 q10 -8 16 -2" fill="none" stroke="#8E1754" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
}

const hand = (cx, cy) => `<g filter="url(#p3-drop)"><circle cx="${cx}" cy="${cy}" r="36" fill="url(#p3-ball)"/>
  <ellipse cx="${cx - 22}" cy="${cy + 26}" rx="14" ry="20" fill="url(#p3-ball)"/><ellipse cx="${cx + 2}" cy="${cy + 32}" rx="14" ry="21" fill="url(#p3-ball)"/><ellipse cx="${cx + 25}" cy="${cy + 25}" rx="13" ry="19" fill="url(#p3-ball)"/></g>`;
const grip = (x, y, flip) => [0, 44, 88].map((dy) => `<ellipse cx="${x}" cy="${y + dy}" rx="40" ry="20" transform="rotate(${flip * 8} ${x} ${y + dy})" fill="url(#p3-ball)"/>`).join("");

function newspaper(top, holes) {
  const h = 900 - top, rows = (x, w, y0, n) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y0 + i * 22}" width="${w}" height="9" rx="2" fill="#A39A84"/>`).join("");
  const my = holes ? 584 : top + 92, hy = my + 82, n = Math.max(2, Math.floor((900 - hy - 66) / 22));
  return `<g filter="url(#p3-drop)"><g transform="rotate(-2 600 ${top + h / 2})" ${holes ? 'mask="url(#p3-holes)"' : ""}>
    <rect x="290" y="${top}" width="620" height="${h}" rx="8" fill="url(#p3-paper)"/>
    <rect x="596" y="${top}" width="8" height="${h}" fill="#B9AE90" opacity=".45"/><rect x="604" y="${top}" width="40" height="${h}" fill="#fff" opacity=".18"/>
    <text x="600" y="${my}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="84" letter-spacing="5" fill="#22201C">EARTH DAILY</text>
    <rect x="320" y="${my + 18}" width="560" height="6" fill="#22201C"/>
    <text x="600" y="${hy}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="42" letter-spacing="1" fill="#22201C">HUMANS: STILL NOT PATCHING</text>
    <rect x="320" y="${hy + 18}" width="560" height="4" fill="#22201C"/>
    ${rows(322, 168, hy + 44, n)}${rows(516, 168, hy + 44, n)}
    <rect x="712" y="${hy + 42}" width="166" height="${Math.min(120, 900 - hy - 66)}" fill="#D9D0B8"/><ellipse cx="795" cy="${hy + 100}" rx="48" ry="12" fill="#22201C"/><path d="M769 ${hy + 96} a26 22 0 0 1 52 0 z" fill="#22201C"/>
  </g>${holes ? '<circle cx="512" cy="414" r="70" fill="none" stroke="#8C8268" stroke-width="5" opacity=".7"/><circle cx="688" cy="414" r="70" fill="none" stroke="#8C8268" stroke-width="5" opacity=".7"/>' : ""}</g>`;
}

export function peek3d(e, { paper = "roll", size = 1200 } = {}) {
  const showArms = paper === "roll";
  const sleeve = (m) => `<g ${m ? 'transform="translate(1200,0) scale(-1,1)"' : ""}><path d="M436 636 C388 690 370 772 378 838 C400 856 438 856 458 838 C460 772 472 702 490 650 Z" fill="url(#p3-coat${m ? "2" : ""})"/><path d="M380 800 C404 814 436 814 458 800 L458 822 C436 836 402 836 379 822 Z" fill="#8A6736" opacity=".55"/></g>`;
  const antenna = (m) => `<g ${m ? 'transform="translate(1200,0) scale(-1,1)"' : ""}><path d="M396 240 C366 190 340 160 324 118" fill="none" stroke="#B02268" stroke-width="15" stroke-linecap="round"/><path d="M394 238 C364 190 338 160 322 118" fill="none" stroke="#FF6FB4" stroke-width="7" stroke-linecap="round"/><circle cx="318" cy="100" r="27" fill="url(#p3-ball)"/><ellipse cx="309" cy="90" rx="8" ry="6" fill="#fff" opacity=".8"/></g>`;
  const body = `
  <ellipse cx="600" cy="1012" rx="300" ry="36" fill="#031A33" opacity=".5" filter="url(#p3-b14)"/>
  <rect x="524" y="900" width="52" height="84" rx="16" fill="#1E1E26"/><rect x="624" y="900" width="52" height="84" rx="16" fill="#15151B"/>
  <ellipse cx="536" cy="990" rx="58" ry="25" fill="url(#p3-shoe)"/><ellipse cx="664" cy="990" rx="58" ry="25" fill="url(#p3-shoe)"/>
  <ellipse cx="516" cy="980" rx="18" ry="7" fill="#fff" opacity=".28"/><ellipse cx="644" cy="980" rx="18" ry="7" fill="#fff" opacity=".28"/>
  <path d="${COAT}" fill="url(#p3-coat)"/>
  <g clip-path="url(#p3-coatc)">
    <ellipse cx="860" cy="760" rx="110" ry="260" fill="#5B4220" opacity=".4" filter="url(#p3-b28)"/>
    <ellipse cx="600" cy="960" rx="260" ry="46" fill="#4A3418" opacity=".5" filter="url(#p3-b14)"/>
    <ellipse cx="600" cy="600" rx="170" ry="40" fill="#3D2A12" opacity=".5" filter="url(#p3-b14)"/>
    <path d="M604 620 C596 720 596 840 588 940" fill="none" stroke="#7B5A2E" stroke-width="5" opacity=".7"/>
    <path d="M388 778 C460 800 740 800 812 778 L814 824 C740 846 460 846 386 824 Z" fill="url(#p3-coat2)"/>
    <path d="M388 778 C460 800 740 800 812 778" fill="none" stroke="#F0D3A2" stroke-width="4" opacity=".5"/>
  </g>
  <rect x="572" y="784" width="58" height="46" rx="9" fill="url(#p3-gold)"/><rect x="584" y="795" width="34" height="24" rx="4" fill="#7B5A2E"/>
  ${[[556, 688], [646, 688], [556, 738], [646, 738]].map(([x, y]) => `<circle cx="${x}" cy="${y + 3}" r="14" fill="#5B4220" opacity=".5"/><circle cx="${x}" cy="${y}" r="14" fill="url(#p3-btn)"/><ellipse cx="${x - 4}" cy="${y - 5}" rx="5" ry="3" fill="#fff" opacity=".35"/>`).join("")}`;
  const roll = `<g transform="translate(806 760) rotate(16)" filter="url(#p3-drop)"><rect x="-34" y="-170" width="68" height="320" rx="30" fill="url(#p3-roll)"/><ellipse cx="0" cy="-166" rx="34" ry="13" fill="#EFE7D1"/><ellipse cx="0" cy="-166" rx="20" ry="7" fill="none" stroke="#A39A84" stroke-width="3"/><ellipse cx="0" cy="-166" rx="8" ry="3" fill="#A39A84"/>
    <text transform="rotate(-90)" x="20" y="12" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="34" letter-spacing="3" fill="#22201C">EARTH DAILY</text></g>`;
  const collar = `
  <path d="M600 664 L452 632 C400 602 370 560 364 508 C430 540 520 592 600 664 Z" fill="url(#p3-collar)"/>
  <path d="M600 664 L748 632 C800 602 830 560 836 508 C770 540 680 592 600 664 Z" fill="url(#p3-coat2)"/>
  <path d="M536 606 H664 L600 700 Z" fill="#1F2A44"/>
  <path d="M588 612 h24 l8 20 l-20 62 l-20 -62 z" fill="#E5333F"/><path d="M588 612 h24 l8 20 h-40 z" fill="#B3202C"/>
  <path d="M600 664 L506 626 L478 712 L574 762 Z" fill="url(#p3-coat2)" opacity=".95"/><path d="M600 664 L694 626 L722 712 L626 762 Z" fill="#7B5A2E" opacity=".95"/>`;
  const head = `
  <ellipse cx="600" cy="612" rx="150" ry="24" fill="#2A1A0A" opacity=".45" filter="url(#p3-b14)"/>
  <path d="${HEAD}" fill="url(#p3-skin)"/>
  <g clip-path="url(#p3-head)">
    <path d="M850 300 C900 420 860 540 720 600" fill="none" stroke="#B9ECFF" stroke-width="16" opacity=".55" filter="url(#p3-b6)"/>
    <ellipse cx="424" cy="486" rx="52" ry="34" fill="#FF2E88" opacity=".45" filter="url(#p3-b14)"/><ellipse cx="776" cy="486" rx="52" ry="34" fill="#FF2E88" opacity=".4" filter="url(#p3-b14)"/>
    <ellipse cx="402" cy="352" rx="12" ry="8" fill="#C92F78" opacity=".5"/><ellipse cx="424" cy="330" rx="7" ry="5" fill="#C92F78" opacity=".5"/><ellipse cx="800" cy="350" rx="9" ry="6" fill="#8E1754" opacity=".4"/>
  </g>
  ${eye(512, -1, e)}${eye(688, 1, e)}
  <ellipse cx="590" cy="488" rx="5" ry="3.5" fill="#8E1754" opacity=".7"/><ellipse cx="612" cy="488" rx="5" ry="3.5" fill="#8E1754" opacity=".7"/>
  ${mouth(e)}
  <g clip-path="url(#p3-head)"><ellipse cx="600" cy="262" rx="330" ry="74" fill="#3A0822" opacity=".62" filter="url(#p3-b14)"/></g>`;
  const hat = `<g transform="rotate(-5 600 240)">
    <ellipse cx="600" cy="262" rx="336" ry="62" fill="#050508"/>
    <ellipse cx="600" cy="246" rx="336" ry="60" fill="url(#p3-brim)"/>
    <ellipse cx="520" cy="222" rx="170" ry="16" fill="#fff" opacity=".1" filter="url(#p3-b6)"/>
    <path d="M430 240 C420 124 470 62 600 68 C730 62 780 124 770 240 C720 268 480 268 430 240 Z" fill="url(#p3-crown)"/>
    <ellipse cx="600" cy="86" rx="92" ry="15" fill="#07070A" opacity=".75" filter="url(#p3-b6)"/>
    <path d="M470 116 C476 92 500 80 530 76" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".16"/>
    <path d="M431 200 C480 230 720 230 769 200 L770 240 C720 268 480 268 430 240 Z" fill="url(#p3-band)"/>
    <path d="M440 208 C480 228 560 234 610 233" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/>
    <g transform="rotate(12 716 196)" filter="url(#p3-drop)"><rect x="672" y="162" width="96" height="60" rx="5" fill="url(#p3-paper)"/><text x="720" y="201" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="24" fill="#22201C">PRESS</text></g>
    ${antenna(false)}${antenna(true)}
  </g>`;
  const paperLayer = paper === "over" ? newspaper(494, false) + grip(300, 610, -1) + grip(900, 600, 1)
    : paper === "holes" ? newspaper(292, true) + grip(300, 560, -1) + grip(900, 550, 1) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="${size}" height="${size}">${DEFS}
  <rect width="1200" height="1200" fill="url(#p3-bg)"/>
  <ellipse cx="600" cy="1080" rx="900" ry="200" fill="#8FE0FF" opacity=".22" filter="url(#p3-b28)"/>
  ${body}
  ${showArms ? sleeve(false) + sleeve(true) + hand(416, 852) + roll + hand(786, 852) : ""}
  ${collar}${head}${paperLayer}${hat}
  <rect width="1200" height="1200" filter="url(#p3-grain)" opacity=".1" style="mix-blend-mode:overlay"/>
  </svg>`;
}
