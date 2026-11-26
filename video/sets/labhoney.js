// Shorts lab 01 honey (producer D): ten portrait shots on the notebook page, one per line of the writer's script.
// Peek stands small at the bottom right the whole time (peekFixed), so the subject sits in the upper two thirds.
//  0 a tomb wall sketch, a torch, a sealed clay jar glowing in the middle
//  1 an archaeologist lifts the lid and dips a finger: a golden drip, a sparkle
//  2 a big pencilled question mark is drawn over that sketch (a story, not a proven find)
//  3 the page turns to a clean glass jar of honey
//  4 the jar's cutaway: a thin blue band (water, under a fifth) and the rest gold, with sugar crystals
//  5 a tiny microbe lands on the honey, wilts and shrinks away
//  6 a bee adds a drop; small bubbles rise and a shield shines
//  7 the bee stands proudly beside a tiny fridge
//  8 the jar open: wavy moisture arrows go in; the lid comes down and closes it
//  9 the sealed jar alone; calendar pages fly past it
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, camAt, layer, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, mix, pop, dur, paperBg, germ } from "./sci.js";
import { figure } from "./sci3.js";
import { jar, drip, comb, bee, tombWall, torch, waterDrop } from "./lab.js";

const CX = 470;   // the subject's column: left of centre, clear of Peek at the bottom right
const floorP = (G) => `<rect x="-600" y="${G}" width="2400" height="900" fill="${P.floor}"/>`;
const shield = () => `<path d="M0 -70L60 -46V0Q60 50 0 76Q-60 50 -60 0V-46Z" fill="${P.mint}"/><path d="M-24 4L-6 22L28 -16" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/>`;
const fridge = () => `${two(rr(-80, -300, 160, 300, 18), "#f2f6ff", "#cdd6ef", 0, 8)}<path d="M-80 -190H80" stroke="#cdd6ef" stroke-width="8"/><path d="M50 -270V-220M50 -160V-110" stroke="${P.steelD}" stroke-width="10" stroke-linecap="round"/>`;
const sparkle = (k = 1) => at(0, 0, `<path d="M0 -50L12 -12L50 0L12 12L0 50L-12 12L-50 0L-12 -12Z" fill="${P.gold}"/>`, k);
const tomb = (tot, G) => at(540, G, tombWall(1500, 1500)) + at(150, G - 300, torch(tot), 1.1) + at(930, G - 300, torch(tot + 1), 1.1);

function h0(a, tot, s) { const D = dur(s, 0, 4), c = camAt(a, [[0, 540, 940, 1.0], [D, 540, 920, 1.06]]), G = 1250;
  return { g: paperBg(c, tot) + layer(tomb(tot, G) + floorP(G) + at(CX, G, jar(1, 1, 0.6 + 0.4 * Math.sin(tot * 2) ** 2, 1), 1.5), c) }; }
function h1(a, tot, s) { const D = dur(s, 1, 8), c = camAt(a, [[0, 540, 940, 1.0], [D, 540, 920, 1.04]]), G = 1250, lid = 1 - ease(seg(a, 0.4, 1.4)), dip = seg(a, D * 0.35, D * 0.6), lift = seg(a, D * 0.6, D * 0.8);
  const hand = at(CX + 40, lerp(G - 700, G - 560, ease(dip)) - 160 * ease(lift), `<path d="M0 0V-240" stroke="#f2c9a0" stroke-width="44" stroke-linecap="round"/>${lift > 0 ? at(0, 20, drip(0.6)) : ""}`);
  return { g: paperBg(c, tot) + layer(tomb(tot, G) + floorP(G) + at(CX, G, jar(1, lid, 0, 1), 1.5) + at(CX - 330, G, figure(P.blue, P.blueD), 1.2) + hand + (lift > 0.6 ? at(CX + 170, G - 920, sparkle(pop(a - D * 0.75))) : ""), c) }; }
function h2(a, tot, s) { const D = dur(s, 2, 6), c = camAt(a, [[0, 540, 940, 1.0], [D, 540, 940, 1.02]]), G = 1250, q = seg(a, 0.3, D * 0.6);
  const qm = drawn("M380 520Q380 380 540 380Q700 380 700 520Q700 620 560 660Q540 668 540 760", q, P.ink, 34) + (q >= 1 ? `<circle cx="540" cy="880" r="26" fill="${P.ink}"/>` : "");
  return { g: paperBg(c, tot) + layer(`<g opacity=".45">${tomb(tot, G) + floorP(G) + at(CX, G, jar(1, 0, 0, 1), 1.5) + at(CX - 330, G, figure(P.blue, P.blueD), 1.2)}</g>` + qm, c) }; }
function h3(a, tot, s) { const D = dur(s, 3, 3), c = camAt(a, [[0, 540, 940, 1.0], [D, 540, 920, 1.06]]), turn = easeOut(seg(a, 0, 0.6)), G = 1200;
  const page = `<path d="M${lerp(-200, 1100, turn)} -200L${lerp(-200, 1100, turn) + 300} 2200" stroke="${P.creamD}" stroke-width="12" opacity="${(1 - turn).toFixed(2)}"/>`;
  return { g: paperBg(c, tot) + layer(at(CX, G, jar(1, 1, seg(a, 1, 2)), 1.9 * pop(a - 0.3)) + page, c) }; }
function h4(a, tot, s) { const D = dur(s, 4, 6), c = camAt(a, [[0, 540, 940, 1.0], [D, 540, 940, 1.03]]), G = 1250, w = seg(a, 0.4, D * 0.35), sg = seg(a, D * 0.35, D * 0.75);
  const col = at(CX, G, `${two(rr(-170, -880, 340, 880, 30), "#f2f6ff", "#cdd6ef", 10, 0)}<path d="${rr(-150, -860 * sg, 300, 860 * sg, 0)}" transform="translate(0 0)" fill="#f2b134"/><path d="${rr(-150, -860, 300, 160 * w, 0)}" fill="#4a90c8"/>
    ${Array.from({ length: 14 }, (_, i) => (sg > i / 14 ? `<path d="${rr(-110 + (i % 3) * 80, -100 - Math.floor(i / 3) * 130, 46, 46, 6)}" fill="#fff3c4" opacity=".75" transform="rotate(${(i * 23) % 40 - 20} ${-87 + (i % 3) * 80} ${-77 - Math.floor(i / 3) * 130})"/>` : "")).join("")}`);
  return { g: paperBg(c, tot) + layer(floorP(G) + col + (w > 0.5 ? at(CX + 300, G - 790, waterDrop(1.2), pop(a - 0.8)) : ""), c) }; }
function h5(a, tot, s) { const D = dur(s, 5, 5), c = camAt(a, [[0, 540, 900, 1.06], [D, 540, 900, 1.12]]), G = 1250, land = easeIn(seg(a, 0.3, 1.0)), wilt = seg(a, 1.4, D * 0.85);
  const g = at(CX, lerp(300, G - 680, land) + 60 * wilt, `<g transform="scale(${(2 * (1 - 0.6 * wilt)).toFixed(3)} ${(2 * (1 - 0.75 * wilt)).toFixed(3)})">${germ(60, mix(P.green, "#9a9a8a", wilt), mix(P.greenD, "#7a7a6a", wilt), tot * 3 * (1 - wilt))}</g>`);
  return { g: paperBg(c, tot) + layer(floorP(G) + at(CX, G, jar(1, 0, 0), 1.9) + g, c) }; }
function h6(a, tot, s) { const D = dur(s, 6, 6), c = camAt(a, [[0, 540, 920, 1.0], [D, 540, 920, 1.04]]), G = 1250, fly = easeOut(seg(a, 0.2, 1.3)), drop = seg(a, D * 0.3, D * 0.5);
  const bx = lerp(980, CX + 60, fly), by = lerp(300, G - 760, fly) + 16 * Math.sin(tot * 7);
  const bubbles = a > D * 0.5 ? Array.from({ length: 8 }, (_, i) => { const q = ((a - D * 0.5) * 0.6 + i / 8) % 1; return `<circle cx="${CX - 120 + (i * 37) % 240}" cy="${G - 120 - q * 440}" r="${10 + (i % 3) * 5}" fill="none" stroke="#fff" stroke-width="5" opacity="${(0.9 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  return { g: paperBg(c, tot) + layer(floorP(G) + at(CX, G, jar(1, 0, 0), 1.9) + (drop > 0 && drop < 1 ? at(CX + 20, lerp(G - 720, G - 560, drop), `<circle r="16" fill="#fff3c4"/>`) : "") + bubbles + at(bx, by, bee(tot * 40), 1.3) + (a > D * 0.62 ? at(CX + 330, G - 900, shield(), 1.6 * pop(a - D * 0.62)) : ""), c) }; }
function h7(a, tot, s) { const D = dur(s, 7, 4.5), c = camAt(a, [[0, 540, 920, 1.0], [D, 540, 900, 1.05]]), G = 1250;
  return { g: paperBg(c, tot) + layer(floorP(G) + at(CX + 200, G, fridge(), 1.5 * pop(a - 0.6)) + at(CX - 180, G - 160 - 10 * Math.abs(Math.sin(a * 3)), bee(tot * 40), 2.0) + (a > D * 0.5 ? at(CX - 180, G - 420, sparkle(pop(a - D * 0.5)), 1) : ""), c) }; }
function h8(a, tot, s) { const D = dur(s, 8, 8), c = camAt(a, [[0, 540, 920, 1.0], [D, 540, 920, 1.04]]), G = 1250, close = ease(seg(a, D * 0.65, D * 0.85)), wet = seg(a, 0.4, D * 0.6) * (1 - close);
  const arrows = [0, 1, 2].map((i) => { const y = G - 1200 + i * 90 + ((a * 120) % 90); return `<path d="M${CX - 300 + i * 160} ${y}q30 -30 0 -60q-30 -30 0 -60" stroke="#4a90c8" stroke-width="18" fill="none" stroke-linecap="round" transform-origin="0 0" opacity="${(0.8 * wet).toFixed(2)}" transform="rotate(180 ${CX - 300 + i * 160} ${y})"/>`; }).join("");
  return { g: paperBg(c, tot) + layer(floorP(G) + at(CX, G, jar(1, close, 0), 1.9) + arrows + (close >= 1 ? check(CX + 290, G - 860, 50, P.green, a - D * 0.85) : ""), c) }; }
function h9(a, tot, s) { const D = dur(s, 9, 7), c = camAt(a, [[0, 540, 920, 1.0], [D, 540, 920, 1.08]]), G = 1250;
  const pages = Array.from({ length: 7 }, (_, i) => { const t0 = 0.5 + i * D * 0.11, p = seg(a, t0, t0 + 1.6); if (p <= 0 || p >= 1) return ""; return at(lerp(1200, -200, p), 420 + (i % 3) * 140 + 80 * Math.sin(p * 6), calPage(String(1800 + i * 37), "", 0.45), 1, lerp(-20, 30, p)); }).join("");
  return { g: paperBg(c, tot) + layer(floorP(G) + at(CX, G, jar(1, 1, 0.5), 1.9) + pages, c) }; }

const SHOTS = [h0, h1, h2, h3, h4, h5, h6, h7, h8, h9];
// the shots are drawn for the tall frame: the same functions serve as the portrait versions
export const honeySet = makeSet(SHOTS, SHOTS, P);
