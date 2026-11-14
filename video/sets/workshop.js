// Science part 1, section 2 "science is not a book": six shots.
//   0 a huge book on a pedestal, lit from above, opens by itself (what humans think science is: a book of answers)
//   1 its pages: the planet goes round the sun on the left page; a kettle boils at 100 on the right one
//   2 pull back: the book is only the end of a conveyor belt that comes out of a busy workshop door (what is left after)
//   3 the method on a bench: a "?" card is set down (say something testable), a flask bubbles over it (test it), a hammer
//     swings at it (try to break it)
//   4 one hammer: the card holds and glows a little; then hammers of many colours from every side: it holds and shines gold
//   5 a library wall; its shelves swing round into workbenches with tools, and the tower of blocks on c from section 1 is
//     taken apart and put back together in a vise (everything can be rebuilt, even Einstein). Host left.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, at, check, FW, FH, makeSet } from "./kit.js";
import { book } from "./bank.js";
import { P, G0, paperBg, mix, dur, pop, room, sun, card, hammer, flask, bench, shelf } from "./sci.js";

const WALL = P.wall, FLOOR = P.floor;
const pedestalLit = (on) => `<path d="M-170 -60L-90 -900H90L170 -60Z" fill="#fff3c2" opacity="${(0.1 * on).toFixed(3)}"/>${two(rr(-200, -70, 400, 70, 10), P.blue, P.blueD, 0, 10)}${two(rr(-160, -120, 320, 54, 10), P.mint, P.blue, 0, 8)}`;
// the big book, `open` 0..1, with `inner` on its pages (book() is 324 x 206 around (0, 0))
const bigBook = (open, inner = "") => open < 0.5
  ? at(0, 0, `<path d="${rr(-162, -100, 324, 206, 12)}" fill="${P.wood}"/>${disc(0, 0, 40, P.gold, P.goldD)}`, [lerp(0.5, 0.05, open * 2), 1])
  : book(open > 0.7 ? inner : "", { cover: P.wood, coverD: P.woodD });
const kettle = (steam, tot) => `${two("M-70 0Q-90 -110 0 -120Q90 -110 70 0Z", P.steel, P.steelD, 6, 0)}<path d="M60 -70L120 -110" stroke="${P.steel}" stroke-width="18" stroke-linecap="round"/><path d="M-50 -110Q0 -170 50 -110" stroke="${P.ink}" stroke-width="10" fill="none"/>
  ${steam > 0 ? [0, 1, 2].map((i) => { const q = (tot * 0.8 + i / 3) % 1; return `<path d="M${120 + 10 * Math.sin(tot * 3 + i)} ${-120 - 90 * q}q-14 -16 0 -32q14 -16 0 -32" stroke="${P.chalk}" stroke-width="8" fill="none" stroke-linecap="round" opacity="${(0.7 * (1 - q) * steam).toFixed(2)}"/>`; }).join("") : ""}`;

// ---- 0: the book of answers ----
function s0(a, tot, s) {
  const D = dur(s, 0, 4.4), c = camAt(a, [[0, 960, 600, 0.9], [D, 960, 560, 1.05]]), op = ease(seg(a, D * 0.3, D * 0.75));
  const g = layer(room(900, WALL, FLOOR), c, 0.8) + layer(at(960, 900, pedestalLit(seg(a, 0.2, 0.8))) + at(960, 640, bigBook(op), 1.6 * pop(a - 0.1, 7, 12)) + (op > 0.8 ? rings(960, 640, 300, P.gold, 0.08 * op) : ""), c);
  return { g, out: toScreen(c, 960, 640), outC: P.cream, outZ: 10 };
}

// ---- 1: the planet round the sun, water boiling at 100 ----
function s1(a, tot, s) {
  const D = dur(s, 1, 4.0), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.05]]);
  const orb = a * 1.4, ex = -75 + Math.cos(orb) * 52, ey = -10 + Math.sin(orb) * 26, t2 = D * 0.5;
  const left = `<ellipse cx="-75" cy="-10" rx="52" ry="26" fill="none" stroke="#d9c39a" stroke-width="3" stroke-dasharray="6 6"/>${at(-75, -10, sun(16, tot, 0.6))}${at(ex, ey, `<circle r="9" fill="${P.blue}"/><circle cx="-2" cy="-2" r="4" fill="${P.green}"/>`)}`;
  const right = a > t2 ? at(75, 40, kettle(seg(a, t2 + 0.3, t2 + 0.8), tot), 0.38 * pop(a - t2)) + at(75, -55, text(0, 0, "100°", 30, P.coral), pop(a - t2 - 0.4)) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="${P.cream}"/>` + layer(at(960, 560, book(left + right), 3.6), c);
  return { g, in: [960, 540], inC: P.cream, inZ: 10 };
}

// ---- 2: the book is what comes out of the workshop ----
function s2(a, tot, s) {
  const D = dur(s, 2, 3.8), c = camAt(a, [[0, 1240, 560, 3.2], [D * 0.55, 960, 520, 0.95], [D, 920, 520, 0.92]]);
  const belt = `${two(rr(-80, 760, 1500, 50, 25), P.blueD, P.ink, 0, 8)}${Array.from({ length: 16 }, (_, i) => `<circle cx="${-50 + i * 95 + ((tot * 60) % 95)}" cy="785" r="10" fill="${P.steel}"/>`).join("")}`;
  const door = `<path d="${rr(-120, 300, 360, 460, 10)}" fill="#ffb066" opacity=".35"/><path d="${rr(-100, 320, 320, 440, 8)}" fill="#ffd27a"/>${[0, 1, 2, 3, 4].map((i) => { const q = (tot * 1.3 + i / 5) % 1; return `<circle cx="${60 + 80 * Math.sin(i * 2.1 + tot)}" cy="${380 + 300 * q}" r="${6 + (i % 3) * 3}" fill="${P.gold}" opacity="${(1 - q).toFixed(2)}"/>`; }).join("")}`;
  const sh = `<path d="M-300 300H520V250Q110 140 -300 250Z" fill="${P.ground}"/>${[0, 1, 2].map((i) => { const q = (tot * 0.4 + i / 3) % 1; return `<circle cx="${380 + i * 30}" cy="${230 - 200 * q}" r="${30 + 50 * q}" fill="${P.steel}" opacity="${(0.4 * (1 - q)).toFixed(2)}"/>`; }).join("")}<path d="${rr(360, 120, 60, 140, 6)}" fill="${P.ground}"/>`;
  const shop = `<path d="${rr(-320, 250, 840, 560, 12)}" fill="${P.violetD}"/>` + sh + door + [[-240, 360], [320, 360]].map(([x, y], i) => `<path d="${rr(x, y, 140, 110, 10)}" fill="${P.win}"/>`).join("");
  const g = layer(room(900, WALL, FLOOR), c, 0.7) + layer(shop + belt + at(1240, 760 - 10, book(), 0.9), c);
  return { g, out: toScreen(c, 60, 540), outC: "#ffd27a" };
}

// ---- 3: say, test, try to break ----
function s3(a, tot, s) {
  const D = dur(s, 3, 6.0), c = camAt(a, [[0, 960, 560, 1.15], [D, 960, 540, 1.2]]);
  const t1 = D * 0.18, t2 = D * 0.38, t3 = D * 0.62;
  const cardDrop = a > t1 ? at(960, lerp(120, 400, easeOut(seg(a, t1, t1 + 0.4))), card("?"), 0.9) : "";
  const fl = a > t2 ? at(700, 504, flask(P.mint, a - t2), 1.2 * pop(a - t2)) + (a > t2 + 0.4 ? `<path d="M720 300Q820 200 880 300" stroke="${P.mint}" stroke-width="8" stroke-dasharray="14 12" fill="none" opacity=".7"/>` : "") : "";
  const sw = seg(a, t3, t3 + 0.5), rot = a < t3 ? 0 : sw < 1 ? lerp(-10, -95, easeIn(sw)) : -95 + 20 * Math.exp(-6 * (a - t3 - 0.5)) * Math.sin((a - t3 - 0.5) * 20);
  const hm = a > t3 - 0.3 ? at(1400, 470, hammer(), 1.3 * pop(a - t3 + 0.3), rot) : "";
  const bang = sw >= 1 && a < t3 + 0.9 ? rings(1050, 420, 140 * spring(a - t3 - 0.5), "#fff", 0.35) : "";
  const g = layer(room(900, WALL, FLOOR), c, 0.8) + layer(at(960, 900, bench({ flask: false }), 2.2) + cardDrop + fl + hm + bang, c);
  return { g, in: [960, 540], inC: "#ffd27a" };
}

// ---- 4: it holds; it holds against many ----
const hammerCols = [[P.coral, P.coralD], [P.blue, P.blueD], [P.pink, P.pinkD], [P.mint, P.mintD], [P.gold, P.goldD], ["#b58cff", "#8a5be0"]];
function s4(a, tot, s) {
  const D = dur(s, 4, 5.4), CX = 960, CY = 520, c = camAt(a, [[0, 960, 540, 1.05], [D * 0.5, 960, 540, 1.0], [D, 960, 540, 0.9]]);
  const h1 = D * 0.12, many = D * 0.52;
  const one = (() => { const p = seg(a, h1, h1 + 0.35), back = seg(a, h1 + 0.5, h1 + 0.9); if (a < h1 - 0.2 || back >= 1) return ""; const d = lerp(420, 200, easeIn(p)) + 260 * ease(back); return at(CX + d, CY + 40, hammer(), 1.0, -90); })();
  const ring = Array.from({ length: 6 }, (_, i) => { const t0 = many + i * 0.12, p = seg(a, t0, t0 + 0.3), back = seg(a, t0 + 0.4, t0 + 0.8); if (a < t0 - 0.2) return ""; const ang = -Math.PI / 2 + i * Math.PI / 3 + 0.3, d = lerp(560, 230, easeIn(p)) + 200 * ease(back);
    return at(CX + Math.cos(ang) * d, CY + Math.sin(ang) * d, hammer(...hammerCols[i]), 0.9, ang * 57.3 + 180); }).join("");
  const glow = clamp(0.35 * seg(a, h1 + 0.35, h1 + 0.8) + 0.65 * seg(a, many + 0.9, many + 1.6));
  const hits = [h1 + 0.35, ...Array.from({ length: 6 }, (_, i) => many + i * 0.12 + 0.3)].map((t) => (a > t && a < t + 0.4 ? rings(CX, CY, 120 + 120 * seg(a, t, t + 0.4), "#fff", 0.25 * (1 - seg(a, t, t + 0.4))) : "")).join("");
  const g = layer(room(900, WALL, FLOOR), c, 0.7) + layer(at(CX, CY, card(glow > 0.8 ? "✓" : "?", glow), 1.3 + 0.08 * glow) + hits + one + ring, c);
  return { g, out: toScreen(c, CX, CY), outC: P.gold };
}

// ---- 5: not a library, a workshop ----
const vise = (open = 0) => `${two(rr(-160, -40, 320, 40, 8), P.steelD, "#6a7298", 0, 6)}${two(rr(-150 - 40 * open, -200, 60, 160, 8), P.steel, P.steelD, 6, 0)}${two(rr(90 + 40 * open, -200, 60, 160, 8), P.steel, P.steelD, 6, 0)}<path d="M150 -120H260" stroke="${P.steelD}" stroke-width="16" stroke-linecap="round"/><circle cx="268" cy="-120" r="16" fill="${P.coral}"/>`;
const blockCols = [[P.violet, P.violetD], [P.blue, P.blueD], [P.coral, P.coralD], [P.gold, P.goldD], [P.mint, P.mintD]];
function s5(a, tot, s) {
  const D = dur(s, 5, 9.6), c = camAt(a, [[0, 1100, 520, 0.95], [D, 1160, 520, 1.02]]);
  const turn = ease(seg(a, D * 0.15, D * 0.4));   // shelves swing round into benches
  const shelves = [700, 1260, 1820].map((x, i) => { const k = Math.cos(Math.PI * turn); return k > 0 ? at(x, 860, shelf(i * 9 + 3, 3, 460), [k, 1]) : at(x, 860, bench({ liquid: [P.mint, P.coral, P.gold][i] }), [-k * 0.9, 0.9]); }).join("");
  // the tower on c in a vise: blocks lift off one by one, then drop back
  const T0 = D * 0.5, BX = 1260, BY = 700;
  let blocks = "";
  for (let i = 0; i < 5; i++) { const off = seg(a, T0 + i * 0.15, T0 + i * 0.15 + 0.35) - seg(a, T0 + 1.6 + (4 - i) * 0.15, T0 + 1.6 + (4 - i) * 0.15 + 0.35), [cc, cD] = blockCols[i];
    const x = BX + (i % 2 ? 1 : -1) * 260 * ease(off), y = BY - 100 - i * 70 - 60 * Math.sin(Math.PI * clamp(off));
    blocks += two(rr(x - 110, y, 220, 64, 8), cc, cD, 0, 6); }
  const tw = turn > 0.5 ? at(BX, BY + 160, vise(0.2 * Math.sin(Math.PI * seg(a, T0, T0 + 2.6))), 1.0) + two(rr(BX - 120, BY - 36, 240, 70, 8), P.gold, P.goldD, 0, 8) + text(BX, BY + 26, "c", 64, "#8a5200") + blocks : "";
  const done = a > T0 + 2.6 ? check(BX + 220, BY - 520, 56, P.green, a - T0 - 2.6) : "";
  const g = layer(room(860, WALL, FLOOR), c, 0.8) + layer(shelves + tw + done, c);
  return { g, in: [960, 540], inC: P.gold };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const workshopSet = makeSet(SHOTS, [], P);
