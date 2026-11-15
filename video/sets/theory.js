// Science part 1, section 6 "what a theory is": six shots, timed to the words.
//   0 a hallway, two doors; the newspaper on one mat disappears; a thought cloud over the other door: "?" (a hunch)
//   1 a ladder; a "?" card lands on its bottom rung (a hypothesis: a guess that can be tested)
//   2 the card climbs, a ✓ at each rung; a new star appears that it points to (it predicted it); at the top it turns gold
//   3 the camera runs from the bottom of the ladder to the gold card at the top: the top, not the first step. Host right.
//   4 an apple falls from a tree, straight down, and lands; the gold card at the top of a ladder carries an apple
//   5 a microscope; its lens fills the frame with wriggling germs; a gold card with a germ; a tap and soap, bubbles
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { P, mix, pop, paperBg, room, door, thought, ladder, card, apple, microscope, germ, tapSoap, magnifier } from "./sci.js";

const LX = 760, LB = 980, GAP = 170, RUNGS = 4;     // the ladder: x, base, rung spacing
const rungY = (i) => LB - 40 - i * GAP;
const theLadder = (o = {}) => at(LX, LB, ladder(RUNGS, GAP), 1);

// ---- 0: "I have a theory": a hunch about the neighbour ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [5.79, 960, 560, 1.06]]), G = 900;
  const gone = seg(a, 4.6, 5.0);
  const dl = at(560, G, door(P.blue, P.blueD, 0)), dr = at(1360, G, door(P.pink, P.pinkD, 1 - gone));
  const th = a > 2.0 ? at(1360, 300, thought("?"), 1.2 * pop(a - 2.0)) : "";
  const th2 = a > 4.8 ? at(560, 300, thought("?"), 1.0 * pop(a - 4.8)) + at(640, 290, `${two(rr(-40, -14, 80, 28, 5), P.cream, P.creamD, 0, 4)}`, pop(a - 5.0)) : "";
  return { g: layer(room(G) + dl + dr, c) + layer(th + th2, c) };
}
// ---- 1: a hypothesis on the first rung ----
function s1(a, tot) {
  const c = camAt(a, [[0, 820, 640, 1.0], [3.1, 800, 700, 1.1]]);
  const cd = a > 0.9 ? at(LX, lerp(rungY(0) - 500, rungY(0) - 130, easeOut(seg(a, 0.9, 1.3))), card("?"), 0.9) : "";
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="${LB}" width="3000" height="400" fill="${P.floor}"/>` + at(LX, LB, ladder(RUNGS, GAP), pop(a - 0.1, 7, 12)) + cd + (a > 1.8 ? at(LX + 260, rungY(0) - 130, `<path d="M-60 -50h50v100h-50z" fill="none"/>` + at(0, 0, `<path d="M-22 -80V-10L-60 60Q-64 70 -54 70H54Q64 70 60 60L22 -10V-80Z" fill="#cfe9ff" opacity=".5" stroke="${P.blue}" stroke-width="6"/><path d="M-40 30L-56 60H56L40 30Z" fill="${P.mint}"/>`), pop(a - 1.8)) : ""), c) };
}
// ---- 2: tested, held, predicted: it becomes a theory ----
function s2(a, tot) {
  const c = camAt(a, [[0, 800, 700, 1.0], [5.9, 800, 480, 0.85]]), ts = [0.4, 1.1, 1.85, 4.8];
  let r = 0; for (let i = 0; i < 3; i++) r += ease(seg(a, ts[i], ts[i] + 0.4)); r += ease(seg(a, ts[3], ts[3] + 0.4));
  const y = rungY(0) - 130 - r * GAP, gold = seg(a, 5.0, 5.4);
  const ticks = [0, 1, 2].map((i) => (a > ts[i] + 0.4 ? check(LX - 220, rungY(i + 1) - 10, 34, P.green, a - ts[i] - 0.4) : "")).join("");
  const starP = a - 2.9, star = starP > 0 ? at(1400, 260, `${rings(0, 0, 50, P.gold, 0.3)}<path d="M0 -50L12 -12L50 0L12 12L0 50L-12 12L-50 0L-12 -12Z" fill="${P.gold}"/>`, pop(starP)) + (a > 2.5 ? drawn(`M${LX + 100} ${y}L1340 290`, seg(a, 2.5, 2.9), P.goldD, 6, 'stroke-dasharray="14 12"') : "") : "";
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="${LB}" width="3000" height="400" fill="${P.floor}"/>` + theLadder() + ticks + star + at(LX, y, card(gold > 0.5 ? "✓" : "?", gold), 0.9), c), out: toScreen(c, LX, y), outC: P.gold };
}
// ---- 3: the top of the ladder, not the bottom (host right) ----
function s3(a, tot) {
  const top = rungY(4) - 130, c = camAt(a, [[0, 760, 860, 1.4], [1.0, 760, 860, 1.4], [2.3, 760, top + 60, 1.4], [3.19, 760, top + 40, 1.45]]);
  const bottomX = a > 1.2 ? cross(LX + 200, rungY(0) - 40, 44, P.red, a - 1.2) : "";
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="${LB}" width="3000" height="400" fill="${P.floor}"/>` + theLadder() + bottomX + at(LX, top, card("✓", 1), 0.9) + (a > 2.6 ? check(LX + 200, top - 80, 44, P.green, a - 2.6) : ""), c), in: toScreen(c, LX, top), inC: P.gold };
}
// ---- 4: gravity ----
const tree = () => `<path d="M-30 0V-260H30V0Z" fill="${P.woodD}"/>${disc(0, -380, 200, P.green, P.greenD)}${disc(-150, -300, 120, P.green, P.greenD)}${disc(150, -300, 120, P.green, P.greenD)}`;
function s4(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.0], [3.24, 900, 560, 1.04]]), G = 900, fall = easeIn(seg(a, 0.3, 0.9)), y = lerp(G - 420, G - 56, fall), bounce = a > 0.9 ? 20 * Math.exp(-6 * (a - 0.9)) * Math.abs(Math.sin((a - 0.9) * 12)) : 0;
  const arrow = a > 0.9 ? `<path d="M760 ${G - 420}V${G - 120}" stroke="${P.ink}" stroke-width="8" stroke-dasharray="16 12" opacity=".4"/>` : "";
  const top = a > 1.6 ? at(1400, 500, card("✓", 1) + at(0, -10, apple(), 0.7), pop(a - 1.6)) : "";
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="${G}" width="3000" height="400" fill="#b9d49a"/>` + at(620, G, tree()) + arrow + at(760, y - bounce, apple()) + top, c) };
}
// ---- 5: germs; wash your hands ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [7.07, 960, 540, 1.04]]);
  const ms = a < 4.0 ? at(560, 920, microscope(), 1.6 * pop(a - 0.1)) : "";
  const lens = a > 1.4 && a < 4.3 ? at(1200, 470, `<circle r="300" fill="#e9f6ff" stroke="${P.ink}" stroke-width="18"/>` + `<clipPath id="ls5"><circle r="290"/></clipPath><g clip-path="url(#ls5)">${Array.from({ length: 9 }, (_, i) => at(-200 + (i % 3) * 200 + 30 * Math.sin(tot * 2 + i), -200 + Math.floor(i / 3) * 200 + 20 * Math.cos(tot * 3 + i), germ(46, [P.green, P.pink, P.gold][i % 3], [P.greenD, P.pinkD, P.goldD][i % 3], tot * 3 + i))).join("")}</g>`, pop(a - 1.4) * (1 - seg(a, 4.0, 4.3))) : "";
  const cd = a > 4.2 && a < 5.2 ? at(960, 480, card("✓", 1) + at(0, -10, germ(40, P.green, P.greenD, tot)), pop(a - 4.2) * (1 - seg(a, 5.0, 5.2))) : "";
  const tap = a > 5.1 ? at(960, 820, tapSoap(1, a - 5.1), 1.5 * pop(a - 5.1)) : "";
  return { g: paperBg(c, tot) + layer(ms + lens + cd + tap, c) };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const theorySet = makeSet(SHOTS, [], P);
