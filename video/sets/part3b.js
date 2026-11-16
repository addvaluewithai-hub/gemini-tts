// Science part 3, middle sets: the moving continents (wegener), the doctor who drank bacteria (marshall), Newton (newton).
//  wegener 0 1912: a world map on the wall; a magnifier sweeps along the Atlantic coasts
//          1 South America and Africa slide together and fit like jigsaw pieces
//          2 the same little fossil pops up on both coasts, linked by a dotted line
//          3 the two continents stuck together, then drifting apart with arrows. Host right.
//          4 a continent with a "?" engine under it: what could push it? Host right.
//          5 1930: snow on a tent in Greenland, a flag in the wind; the map rolls up
//          6 a research ship sends sonar down; the ocean floor shows a ridge with arrows both ways
//          7 the world map again, its plates outlined like a jigsaw, ✓
//  marshall 0 a stomach with a storm cloud of stress and acid drops above it
//           1 a microscope lens fills with little curly bacteria inside the stomach
//           2 a row of heads shaking no; a crossed-out bacterium in an acid pool. Host right.
//           3 1984 on a calendar page; a lab glass with the bacteria swirling in it
//           4 the glass tips and empties (the drink; we only see the glass)
//           5 the stomach turns red; the same bacteria appear in it; ✓ (step one proved)
//           6 many flasks with ✓, then a gold medal with 2005 between two figures
//  newton  0 an apple falls, the Moon swings round the Earth, the planets round the Sun: all ✓
//          1 Mercury's orbit turns a little each time, drawing a rosette; one gap glows
//          2 a telescope hunts for a hidden planet: a dashed "?" circle
//          3 1915: a new curve fits the rosette exactly, ✓
//          4 a bridge and a rocket to the Moon, both ✓
//          5 a house (Newton) gets a new floor built on top of it. Host right.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, mix, pop, dur, paperBg, nightSky, magnifier, microscope, flask, sun, apple, bridge, medal } from "./sci.js";
import { waves } from "./sci2.js";
import { figure, SAM, AFR, continent, fossil, tent, sonarShip, stomach, bug, acidDrop, stressCloud, glass, orbitRose, telescope, rocket, house } from "./sci3.js";

const floor = (G, c = P.floor) => `<rect x="-800" y="${G}" width="3600" height="600" fill="${c}"/>`;
const qmark = (k = 1) => at(0, 0, `<circle r="60" fill="${P.ink}"/>${text(0, 30, "?", 90, P.gold)}`, k);
const ocean = (x, y, w, h) => `<path d="${rr(x, y, w, h, 20)}" fill="#9fd4f5"/>`;
// the two continents at a gap g (0 = joined); South America on the left, Africa on the right
const pair = (g, fos = 0) => at(-150 - 260 * g, 0, continent(SAM) + (fos > 0 ? at(70, -40, fossil(), 0.7 * fos) : ""), 1, lerp(0, -12, g)) + at(190 + 260 * g, -30, continent(AFR, "#e3b06a", "#c48a3a") + (fos > 0 ? at(-120, 0, fossil(), 0.7 * fos) : ""), 1, lerp(0, 8, g));

// ================= Wegener =================
function w0(a, tot, s) { const D = dur(s, 0, 7), c = camAt(a, [[0, 960, 540, 0.95], [D, 960, 540, 1.05]]), sweep = seg(a, D * 0.4, D * 0.95);
  return { g: paperBg(c, tot) + layer(ocean(360, 200, 1200, 680) + at(960, 540, pair(1.0), 0.9) + at(300, 260, calPage("1912", "", 0.7), pop(a - 0.3)) + (a > D * 0.4 ? at(960, lerp(320, 760, sweep), magnifier(90, "", "w0m"), 1) : ""), c) }; }
function w1(a, tot, s) { const D = dur(s, 1, 4), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.1]]), g = 1 - ease(seg(a, 0.4, D * 0.8));
  return { g: paperBg(c, tot) + layer(ocean(360, 200, 1200, 680) + at(960, 540, pair(g), 0.9) + (g < 0.02 ? check(1300, 260, 46, P.green, a - D * 0.8) : ""), c) }; }
function w2(a, tot, s) { const D = dur(s, 2, 4), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.04]]);
  return { g: paperBg(c, tot) + layer(ocean(360, 200, 1200, 680) + at(960, 540, pair(1.0, pop(a - 0.4)), 0.9) + drawn("M790 500Q960 380 1140 520", seg(a, 1.2, 2.2), P.ink, 8, 'stroke-dasharray="0.03 0.03"'), c) }; }
function w3(a, tot, s) { const D = dur(s, 3, 4), c = camAt(a, [[0, 820, 540, 1.0], [D, 820, 540, 1.04]]), g = ease(seg(a, D * 0.35, D * 0.9));
  return { g: paperBg(c, tot) + layer(ocean(200, 200, 1240, 680) + at(820, 540, pair(g), 0.85) + (g > 0.2 ? `<path d="M600 860H380M380 860l30 -20v40Z" stroke="${P.ink}" stroke-width="10" fill="${P.ink}" opacity="${g}"/><path d="M1040 860H1260M1260 860l-30 -20v40Z" stroke="${P.ink}" stroke-width="10" fill="${P.ink}" opacity="${g}"/>` : ""), c) }; }
function w4(a, tot, s) { const D = dur(s, 4, 8), c = camAt(a, [[0, 820, 560, 1.0], [D, 820, 560, 1.04]]), G = 860;
  const heads = [0, 1, 2].map((i) => at(260 + i * 170, G, figure("#8d8676", "#6f6a5e"), 0.7 * pop(a - 0.2 - i * 0.15), 6 * Math.sin(a * 8 + i) * (a < D * 0.35 ? 1 : 0))).join("");
  const engine = a > D * 0.45 ? at(980, 760, `${two(rr(-110, -70, 220, 110, 14), P.steel, P.steelD, 0, 6)}${qmark(0.8)}`, pop(a - D * 0.45)) : "";
  return { g: paperBg(c, tot) + layer(floor(G) + heads + at(980, 520, continent(AFR, "#e3b06a", "#c48a3a"), 0.8) + engine, c) }; }
function w5(a, tot, s) { const D = dur(s, 5, 7), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 580, 1.04]]), G = 840;
  const snow = Array.from({ length: 50 }, (_, i) => { const q = (tot * 0.15 + i / 50) % 1; return `<circle cx="${(i * 47) % 1920 + 18 * Math.sin(tot + i)}" cy="${q * 1000}" r="${3 + (i % 3)}" fill="#fff" opacity=".85"/>`; }).join("");
  return { g: `<rect width="${FW}" height="${FH}" fill="#c9d6e8"/>` + layer(`<path d="M-500 ${G}Q960 ${G - 60} 2400 ${G}V1500H-500Z" fill="#f2f6ff"/>` + at(300, 260, calPage("1930", "", 0.7), pop(a - 0.2)) + at(1060, G, tent(1), 1.3), c) + snow }; }
function w6(a, tot, s) { const D = dur(s, 6, 6.5), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 560, 0.96]]), Y = 300, ridge = seg(a, D * 0.4, D * 0.8);
  const floorD = `M-400 980L300 900Q700 860 900 700L960 640L1020 700Q1220 860 1620 900L2300 980V1300H-400Z`;
  return { g: `<rect width="${FW}" height="${FH}" fill="#4a90c8"/>` + layer(`<rect x="-500" y="-500" width="3000" height="${Y + 500}" fill="#bfe3ff"/>` + at(960, Y, waves(-600, 2600, tot, "#5fa6e0", "#4a90c8")) + at(960, Y, sonarShip(tot, a * 0.6), 1) + `<path d="${floorD}" fill="#8a6a4a"/>` + (ridge > 0 ? `<g opacity="${ridge}"><path d="M880 760H700M700 760l26 -18v36Z" stroke="#fff" stroke-width="10" fill="#fff"/><path d="M1040 760H1220M1220 760l-26 -18v36Z" stroke="#fff" stroke-width="10" fill="#fff"/></g>` : ""), c) }; }
function w7(a, tot, s) { const D = dur(s, 7, 6), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.04]]), lines = seg(a, 0.4, D * 0.6);
  return { g: paperBg(c, tot) + layer(ocean(360, 200, 1200, 680) + at(960, 540, pair(1.0), 0.9) + drawn("M380 360Q700 420 960 300T1560 380", lines, P.ink, 8, 'stroke-dasharray="0.02 0.015"') + drawn("M960 210V870", lines, P.ink, 8, 'stroke-dasharray="0.02 0.015"') + drawn("M380 720Q700 640 960 700T1560 660", lines, P.ink, 8, 'stroke-dasharray="0.02 0.015"') + check(1500, 260, 50, P.green, a - D * 0.7), c) }; }
export const wegenerSet = makeSet([w0, w1, w2, w3, w4, w5, w6, w7], [], P);

// ================= Marshall =================
function k0(a, tot, s) { const D = dur(s, 0, 7.5), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.05]]);
  const drops = [0, 1, 2, 3].map((i) => (a > D * 0.45 + i * 0.25 ? at(820 + i * 90, 260 + ((a * 200 + i * 60) % 240), acidDrop(), 0.8) : "")).join("");
  return { g: paperBg(c, tot) + layer(at(960, 660, stomach(0), 1.4) + (a > D * 0.2 ? at(940, 220, stressCloud(tot), pop(a - D * 0.2)) : "") + drops, c) }; }
function k1(a, tot, s) { const D = dur(s, 1, 7), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.06]]), lens = pop(a - D * 0.3);
  const bugs = Array.from({ length: 6 }, (_, i) => at(-120 + (i % 3) * 120 + 14 * Math.sin(tot * 2 + i), -50 + Math.floor(i / 3) * 110, bug(tot * 4 + i), 0.9)).join("");
  return { g: paperBg(c, tot) + layer(at(760, 700, stomach(0), 1.2) + (a > D * 0.3 ? at(1240, 440, `<circle r="220" fill="#ffe3e6" stroke="${P.ink}" stroke-width="14"/><clipPath id="k1l"><circle r="210"/></clipPath><g clip-path="url(#k1l)">${bugs}</g>`, lens) + `<path d="M880 560L1060 500" stroke="${P.ink}" stroke-width="6" stroke-dasharray="14 10" opacity="${clamp(lens)}"/>` : ""), c) }; }
function k2(a, tot, s) { const D = dur(s, 2, 6), c = camAt(a, [[0, 820, 560, 1.0], [D, 820, 560, 1.04]]), G = 880;
  const heads = [0, 1, 2, 3].map((i) => at(260 + i * 180, G, figure("#8d8676", "#6f6a5e"), 0.65 * pop(a - 0.1 - i * 0.12), 7 * Math.sin(a * 9 + i))).join("");
  const pool = a > D * 0.45 ? at(1160, 640, `<ellipse rx="200" ry="60" fill="#c9e86a" opacity=".85"/>${at(0, -20, bug(tot * 4), 1.2)}`, pop(a - D * 0.45)) + cross(1160, 470, 46, P.red, a - D * 0.65) : "";
  return { g: paperBg(c, tot) + layer(floor(G) + heads + pool, c) }; }
function k3(a, tot, s) { const D = dur(s, 3, 6), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.05]]);
  return { g: paperBg(c, tot) + layer(floor(880) + at(560, 360, calPage("1984", "", 0.8), pop(a - D * 0.3)) + at(1160, 880, glass(1, 1, tot), 1.6 * pop(a - D * 0.5)), c) }; }
function k4(a, tot, s) { const D = dur(s, 4, 3.5), c = camAt(a, [[0, 960, 560, 1.06], [D, 960, 540, 1.14]]), tip = ease(seg(a, D * 0.25, D * 0.6)), fill = 1 - seg(a, D * 0.45, D * 0.9);
  return { g: paperBg(c, tot) + layer(floor(880) + at(960, 880 - 260 * tip, glass(fill, 1, tot), 1.6, -100 * tip), c) }; }
function k5(a, tot, s) { const D = dur(s, 5, 7), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.05]]), hot = seg(a, 0.3, D * 0.4);
  const bugs = a > D * 0.35 ? [[860, 640], [1000, 700], [940, 560]].map(([x, y], i) => at(x, y, bug(tot * 4 + i), 0.8 * pop(a - D * 0.35 - i * 0.2))).join("") : "";
  return { g: paperBg(c, tot) + layer(at(960, 660, stomach(hot), 1.4) + bugs + check(1400, 340, 50, P.green, a - D * 0.7), c) }; }
function k6(a, tot, s) { const D = dur(s, 6, 8), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 540, 1.05]]), G = 880, sw = seg(a, D * 0.5, D * 0.6);
  const flasks = [0, 1, 2, 3, 4].map((i) => (a > 0.2 + i * 0.3 ? at(400 + i * 280, G, flask(P.mint), 0.8 * (1 - sw)) + check(400 + i * 280, G - 200, 30, P.green, (a - 0.6 - i * 0.3) * (1 - sw)) : "")).join("");
  const award = sw > 0 ? at(960, 520, medal(110, ""), pop(a - D * 0.55)) + at(960, 790, calPage("2005", "", 0.45), pop(a - D * 0.65)) + at(620, G, figure(P.blue, P.blueD), 0.8 * pop(a - D * 0.6)) + at(1300, G, figure(P.mint, P.mintD), 0.8 * pop(a - D * 0.7)) : "";
  return { g: paperBg(c, tot) + layer(floor(G) + flasks + award, c) }; }
export const marshallSet = makeSet([k0, k1, k2, k3, k4, k5, k6], [], P);

// ================= Newton =================
function n0(a, tot, s) { const D = dur(s, 0, 7), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.03]]), G = 900, fall = easeIn(seg(a, 0.3, 1.0));
  const moon = at(1000 + 180 * Math.cos(a * 1.4), 380 + 70 * Math.sin(a * 1.4), disc(0, 0, 30, "#e9e4d6", "#c9c2ae"));
  const sys = at(1500, 420, `${sun(46, tot, 0)}${[90, 150].map((r, i) => `<ellipse rx="${r}" ry="${r * 0.4}" fill="none" stroke="${P.ink}" stroke-width="3" opacity=".3"/>${at(r * Math.cos(a * (1.6 - i * 0.6)), r * 0.4 * Math.sin(a * (1.6 - i * 0.6)), disc(0, 0, 14, [P.blue, P.coral][i], [P.blueD, P.coralD][i]))}`).join("")}`, pop(a - D * 0.5));
  return { g: paperBg(c, tot) + layer(floor(G) + at(420, lerp(420, G - 56, fall), apple()) + (a > D * 0.25 ? at(1000, 380, disc(0, 0, 70, P.blue, P.blueD), pop(a - D * 0.25)) + moon : "") + sys + check(420, 300, 40, P.green, a - 1.2) + check(1000, 220, 40, P.green, a - D * 0.45) + check(1500, 220, 40, P.green, a - D * 0.8), c) }; }
function n1(a, tot, s) { const D = dur(s, 1, 8), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.06]]), n = 1 + Math.floor(seg(a, 0.3, D * 0.7) * 6);
  return { g: nightSky(c, tot, 71, false) + layer(at(960, 540, sun(70, tot) + orbitRose(n * 8, n), 1) + (a > D * 0.75 ? at(960 + 330, 540, rings(0, 0, 50, P.gold, 0.35), pop(a - D * 0.75)) : ""), c) }; }
function n2(a, tot, s) { const D = dur(s, 2, 6), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.04]]), sw = 18 * Math.sin(a * 1.2);
  return { g: nightSky(c, tot, 72, false) + layer(`<rect x="-500" y="880" width="3000" height="400" fill="#2a2f4a"/>` + at(560, 880, telescope(-28 + sw), 1.2) + at(1260, 360, `<circle r="80" fill="none" stroke="${P.gold}" stroke-width="8" stroke-dasharray="18 14"/>${text(0, 34, "?", 100, P.gold)}`, pop(a - D * 0.3)), c) }; }
function n3(a, tot, s) { const D = dur(s, 3, 7), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.04]]), fit = seg(a, D * 0.35, D * 0.8);
  return { g: nightSky(c, tot, 71, false) + layer(at(960, 540, sun(70, tot) + orbitRose(48, 6)) + (fit > 0 ? `<g transform="translate(960 540)">${drawn("M330 0A330 230 0 1 1 -330 0A330 230 0 1 1 330 0", fit, P.gold, 10, 'transform="rotate(48)"')}</g>` : "") + at(300, 240, calPage("1915", "", 0.7), pop(a - 0.3)) + check(1500, 300, 50, P.green, a - D * 0.85), c) }; }
function n4(a, tot, s) { const D = dur(s, 4, 8), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.04]]), up = easeIn(seg(a, D * 0.45, D)), G = 900;
  return { g: paperBg(c, tot) + layer(floor(G) + at(560, G, bridge(), 0.7 * pop(a - 0.2)) + check(560, 420, 40, P.green, a - 1.0) + at(1380, lerp(G - 100, 300, up), rocket(up > 0 ? 1 : 0, tot), 1.1 * pop(a - D * 0.3)) + at(1700, 200, disc(0, 0, 60, "#e9e4d6", "#c9c2ae"), pop(a - D * 0.3)) + check(1380, 220, 40, P.green, a - D * 0.9), c) }; }
function n5(a, tot, s) { const D = dur(s, 5, 4), c = camAt(a, [[0, 820, 520, 0.95], [D, 820, 460, 0.92]]), G = 900, top = seg(a, D * 0.3, D * 0.9);
  return { g: paperBg(c, tot) + layer(floor(G) + at(820, G, house(top), 1.1) + (top > 0.5 ? at(820, 200 - 40 * top, text(0, 0, "1915", 60, P.blueD), pop(a - D * 0.75)) : "") + at(1180, G - 100, apple(), 0.7), c) }; }
export const newtonSet = makeSet([n0, n1, n2, n3, n4, n5], [], P);
