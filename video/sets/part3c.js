// Science part 3, last sets: eggs (eggs), ice cream and drowning (icecream), brick and wall (brick), dictionary, recap.
// No food advice: the egg sits on a scale and in headlines, never on a plate being recommended or refused.
//  eggs     0 a guidelines sheet with a red limit line; an egg under a spotlight (the suspect)
//           1 2015: the limit line fades off the sheet; a funnel of studies, and a faint line between a plate and a blood drop
//           2 a newspaper flips: the egg ✗ becomes the egg ✓
//           3 the sheet again: a small green arrow down stays (keep it low). Host right.
//           4 a seesaw that barely moves under the egg, beside a headline sign that flips all the way over
//  icecream 0 a sunny beach: an ice-cream cart selling cones; a lifeguard tower raises its flag
//           1 two lines on a chart rise and fall together; a "?" arrow from cone to buoy
//           2 the sun rises behind both and sends an arrow to each; the "?" arrow is crossed out
//           3 a heart (health) with three things beside it: a coin bag, a bed, a clock
//           4 a headline flips: heart ✓, heart ✗. Host right.
//  brick    0 one brick lands; a crack runs through it
//           1 small labs of different colours each send a brick; they stack into a wall
//           2 newspapers chase a new brick; the wall stays; a heavy weight drops, the wall falls and a better one rises
//           3 three walls: the sun with an orbit, a germ, a tap; at the foot of the third, a small headstone with flowers
//           4 a single brick tagged 100: it may go to the wall or the bin
//           5 a newspaper with a blank where the answer should be: brick or wall? Host right.
//  s3dict   0 two lines moving together, no arrow between them
//           1 five separate labs, each reaching the same ✓. Host right.
//  s3recap  0 a scientist's arrow turning to follow a new card of evidence. Host right.
//           1 a tap, two continents and a bacterium: first ✗, then ✓. Host right.
//           2 bricks fly past a wall that stays standing. Host right.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, mix, pop, dur, paperBg, sun, germ, tapSoap, flask, magnifier, grave } from "./sci.js";
import { newspaper } from "./sci2.js";
import { figure, egg, guide, plate, drop, seesaw, cart, iceCone, lifeguard, buoy, lineChart, brick, wall, bin, weight, team, SAM, AFR, continent, bug } from "./sci3.js";

const floor = (G, c = P.floor) => `<rect x="-800" y="${G}" width="3600" height="600" fill="${c}"/>`;
const heart = (c = P.pink) => `<path d="M0 60L-80 -20Q-120 -70 -70 -100Q-30 -120 0 -70Q30 -120 70 -100Q120 -70 80 -20Z" fill="${c}"/>`;
const coinBag = () => `${two("M-60 0Q-80 -80 -30 -110H30Q80 -80 60 0Z", "#c9a06a", "#a67c48", 6, 0)}<path d="M-30 -110L-40 -130H40L30 -110" fill="#a67c48"/>${disc(0, -50, 22, P.gold, P.goldD)}`;
const bedIc = () => `${two(rr(-90, -50, 180, 30, 6), P.cream, P.creamD, 0, 4)}<path d="M-90 -20V0M90 -20V0" stroke="${P.steelD}" stroke-width="10"/><path d="${rr(-100, -90, 20, 70, 6)}" fill="${P.steel}"/><circle cx="-60" cy="-62" r="16" fill="#fffaf0"/>`;
const clockIc = () => `${disc(0, -60, 60, "#fffaf0", P.creamD)}<path d="M0 -60V-100M0 -60L26 -46" stroke="${P.ink}" stroke-width="8" stroke-linecap="round"/>`;
// a headline card that flips over (scaleX through 0) from `front` to `back` at p
const flipCard = (p, front, back) => { const sx = Math.cos(Math.PI * clamp(p)); return `<g transform="scale(${Math.max(0.04, Math.abs(sx)).toFixed(3)} 1)">${newspaper(sx >= 0 ? front : back, 0.9)}</g>`; };
const spot = (o = 1) => `<path d="M-60 -520L-200 0H200L60 -520Z" fill="#fff3b0" opacity="${(0.35 * o).toFixed(2)}"/>`;

// ================= eggs =================
function e0(a, tot, s) { const D = dur(s, 0, 8), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.04]]), G = 880;
  return { g: paperBg(c, tot) + layer(floor(G) + at(620, 700, guide(1), 1.3 * pop(a - 0.2)) + (a > D * 0.6 ? at(1340, G, spot(pop(a - D * 0.6)) + at(0, -30, egg(1.2)), 1) : ""), c) }; }
function e1(a, tot, s) { const D = dur(s, 1, 10), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.03]]), G = 880, fade = 1 - seg(a, 0.8, D * 0.3);
  const pile = Array.from({ length: 8 }, (_, i) => (a > D * 0.35 + i * 0.12 ? at(1140 + (i % 4) * 60, 260 + Math.floor(i / 4) * 40, `<path d="${rr(-40, -50, 80, 100, 6)}" fill="#fffaf0" stroke="${P.creamD}" stroke-width="4"/>`, 0.8, -10 + i * 5) : "")).join("");
  const link = a > D * 0.6 ? at(1060, G, plate(), 0.7) + at(1060, G - 40, egg(0.5)) + at(1500, G - 40, drop(), 1.1) + `<path d="M1150 ${G - 70}H1440" stroke="${P.ink}" stroke-width="6" stroke-dasharray="10 16" opacity=".3"/>` : "";
  return { g: paperBg(c, tot) + layer(floor(G) + at(500, 700, guide(fade), 1.2) + at(500, 300, calPage("2015", "", 0.6), pop(a - 0.3)) + pile + link, c) }; }
function e2(a, tot, s) { const D = dur(s, 2, 4.5), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.04]]), p = seg(a, D * 0.35, D * 0.6);
  const front = `${at(-30, 0, egg(0.45))}${cross(50, -10, 22, P.red, 1)}`, back = `${at(-30, 0, egg(0.45))}${check(50, -10, 22, P.green, 1)}`;
  return { g: paperBg(c, tot) + layer(at(960, 540, flipCard(p, front, back), 1.4), c) }; }
function e3(a, tot, s) { const D = dur(s, 3, 6), c = camAt(a, [[0, 800, 540, 1.0], [D, 800, 540, 1.05]]);
  return { g: paperBg(c, tot) + layer(floor(880) + at(760, 720, guide(0, pop(a - D * 0.45)), 1.5), c) }; }
function e4(a, tot, s) { const D = dur(s, 4, 7), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.03]]), G = 880, p = seg(a, D * 0.35, D * 0.6), tilt = 2 * Math.sin(a * 2);
  const sign = at(1440, 520, flipCard(p, `${at(-30, 0, egg(0.45))}${cross(50, -10, 22, P.red, 1)}`, `${at(-30, 0, egg(0.45))}${check(50, -10, 22, P.green, 1)}`), 1.1, 0);
  return { g: paperBg(c, tot) + layer(floor(G) + at(620, G, seesaw(tilt, egg(0.8), at(0, 0, `<path d="${rr(-50, -60, 100, 60, 8)}" fill="${P.steel}"/>`))) + sign, c) }; }
export const eggsSet = makeSet([e0, e1, e2, e3, e4], [], P);

// ================= ice cream and drowning =================
const beach = (G) => `<rect x="-800" y="${G - 60}" width="3600" height="100" fill="#4a90c8"/><rect x="-800" y="${G}" width="3600" height="600" fill="#f2d39a"/>`;
function c0(a, tot, s) { const D = dur(s, 0, 6), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.04]]), G = 880;
  const cones = [0, 1, 2].map((i) => (a > 1 + i * 0.5 ? at(380 + i * 70, 560 - 40 * seg(a, 1 + i * 0.5, 1.6 + i * 0.5), iceCone([P.pink, P.green, P.gold][i]), 0.6) : "")).join("");
  return { g: `<rect width="${FW}" height="${FH}" fill="#bfe3ff"/>` + layer(beach(G) + at(1600, 220, sun(80, tot)) + at(480, G, cart(1), 1.1) + cones + at(1300, G, lifeguard(seg(a, D * 0.5, D * 0.6), tot), 1.1 * pop(a - D * 0.45)), c) }; }
const L1 = [[300, 700], [480, 560], [660, 420], [840, 360], [1020, 420], [1200, 560], [1380, 700]];
function c1(a, tot, s) { const D = dur(s, 1, 5.5), c = camAt(a, [[0, 900, 540, 1.0], [D, 900, 540, 1.04]]), p = seg(a, 0.3, D * 0.6);
  const axes = `<path d="M260 200V760H1440" stroke="${P.ink}" stroke-width="8" fill="none"/>`;
  return { g: paperBg(c, tot) + layer(axes + lineChart(L1, p, P.pink) + lineChart(L1.map(([x, y]) => [x, y + 60]), p, P.blue) + at(1560, 400, iceCone(), 0.8) + at(1560, 560, buoy(), 0.8) + (a > D * 0.65 ? at(1700, 480, `<path d="M-40 -60Q40 0 -40 60" stroke="${P.ink}" stroke-width="8" fill="none"/>${at(40, 0, `<circle r="34" fill="${P.ink}"/>${text(0, 18, "?", 50, P.gold)}`)}`, pop(a - D * 0.65)) : ""), c) }; }
function c2(a, tot, s) { const D = dur(s, 2, 8), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 540, 1.04]]), G = 880, rise = easeOut(seg(a, D * 0.3, D * 0.55));
  const arrows = a > D * 0.6 ? drawn("M960 380Q700 420 560 600", seg(a, D * 0.6, D * 0.75), P.goldD, 10) + drawn("M960 380Q1220 420 1360 600", seg(a, D * 0.65, D * 0.8), P.goldD, 10) : "";
  return { g: `<rect width="${FW}" height="${FH}" fill="#bfe3ff"/>` + layer(beach(G) + at(960, lerp(900, 260, rise), sun(100, tot)) + at(520, G, cart(1), 0.9) + at(1400, G, lifeguard(1, tot), 0.9) + arrows + (a > 0.4 ? at(960, 700, `<path d="M-200 0H200" stroke="${P.ink}" stroke-width="8" stroke-dasharray="16 12"/>`, 1) + cross(960, 700, 40, P.red, a - 0.6) : ""), c) }; }
function c3(a, tot, s) { const D = dur(s, 3, 9), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.04]]), G = 860;
  const items = [coinBag(), bedIc(), clockIc()].map((g, i) => (a > D * 0.4 + i * D * 0.12 ? at(1180 + i * 220, G, g, 1.2 * pop(a - D * 0.4 - i * D * 0.12)) : "")).join("");
  return { g: paperBg(c, tot) + layer(floor(G) + at(620, G, figure(P.mint, P.mintD), 1.1) + at(620, 330, heart(), pop(a - 0.6)) + items, c) }; }
function c4(a, tot, s) { const D = dur(s, 4, 8), c = camAt(a, [[0, 820, 540, 1.0], [D, 820, 540, 1.04]]), p1 = seg(a, D * 0.15, D * 0.3), p2 = seg(a, D * 0.55, D * 0.7);
  const A = `${at(-20, 0, heart(), 0.4)}${check(60, -10, 22, P.green, 1)}`, B = `${at(-20, 0, heart(), 0.4)}${cross(60, -10, 22, P.red, 1)}`;
  return { g: paperBg(c, tot) + layer(at(800, 540, p2 > 0 ? flipCard(p2, A, B) : flipCard(p1, `${at(0, 0, heart(P.steel), 0.4)}`, A), 1.4) + (a > D * 0.45 ? at(1260, 300, calPage("+1", "", 0.5), pop(a - D * 0.45)) : ""), c) }; }
export const icecreamSet = makeSet([c0, c1, c2, c3, c4], [], P);

// ================= brick and wall =================
const TEAMS = [[P.blue, P.blueD], [P.pink, P.pinkD], [P.mint, P.mintD], [P.gold, P.goldD], [P.coral, P.coralD]];
function b0(a, tot, s) { const D = dur(s, 0, 5), c = camAt(a, [[0, 960, 560, 1.06], [D, 960, 560, 1.14]]), G = 860, fall = easeIn(seg(a, 0.2, 0.7));
  return { g: paperBg(c, tot) + layer(floor(G) + at(960, lerp(300, G - 40, fall), brick(undefined, undefined, seg(a, D * 0.55, D * 0.8)), 1.6), c) }; }
function b1(a, tot, s) { const D = dur(s, 1, 9), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 520, 0.98]]), G = 880, n = Math.floor(seg(a, D * 0.3, D * 0.75) * 33);
  const labs = TEAMS.map(([cc, cd], i) => at(240 + i * 360, 330, team(cc, cd), 0.9 * pop(a - 0.2 - i * 0.15))).join("");
  return { g: paperBg(c, tot) + layer(floor(G) + labs + at(960, G, wall(5, 6, n), 0.9) + check(960, 300, 40, P.green, a - D * 0.85), c) }; }
function b2(a, tot, s) { const D = dur(s, 2, 9), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.02]]), G = 880, hit = seg(a, D * 0.5, D * 0.6), down = seg(a, D * 0.6, D * 0.7), up = seg(a, D * 0.72, D * 0.95);
  const chase = a < D * 0.5 ? at(lerp(1700, 1300, seg(a, 0.2, D * 0.45)), 520, brick(), 0.9) + [0, 1, 2].map((i) => at(lerp(1900, 1480, seg(a, 0.4 + i * 0.2, D * 0.45)) + i * 120, 600 + (i % 2) * 60, newspaper("", 0.35), 1, 8 * Math.sin(a * 8 + i))).join("") : "";
  const w = down < 1 ? at(760, G, wall(5, 6, 99), 0.9, 0, `opacity="${(1 - down).toFixed(2)}"`) : at(760, G, wall(6, 6, Math.floor(up * 39)), 0.9);
  return { g: paperBg(c, tot) + layer(floor(G) + w + (hit > 0 && down < 1 ? at(760, lerp(-200, 340, easeIn(hit)), weight(), 1.1) : "") + chase, c) }; }
function b3(a, tot, s) { const D = dur(s, 3, 11), c = camAt(a, [[0, 960, 560, 0.95], [D, 1000, 580, 1.0]]), G = 880;
  const icons = [at(0, -620, sun(80, tot), 1.2), at(0, -600, germ(70, P.green, P.greenD, tot * 3), 1.3), at(0, -520, tapSoap(1, 0), 0.6)];
  const walls = [0, 1, 2].map((i) => (a > D * (0.1 + i * 0.27) ? at(420 + i * 540, G, wall(4, 2, 99) + icons[i], 0.8 * pop(a - D * (0.1 + i * 0.27))) : "")).join("");
  const stone = a > D * 0.75 ? at(1400, G, grave(""), 0.45 * pop(a - D * 0.75)) + at(1470, G - 10, `${disc(0, -20, 14, P.pink, P.pinkD)}${disc(22, -14, 12, P.gold, P.goldD)}<path d="M0 0V-20M22 0V-14" stroke="${P.greenD}" stroke-width="5"/>`, pop(a - D * 0.8)) : "";
  return { g: paperBg(c, tot) + layer(floor(G) + walls + stone, c) }; }
function b4(a, tot, s) { const D = dur(s, 4, 9), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.03]]), G = 880;
  const tag = `${two(rr(-60, -36, 120, 72, 12), P.ink, "#000", 0, 0)}${text(0, 22, "100", 54, P.gold)}`;
  const w = seg(a, D * 0.5, D * 0.7), b = seg(a, D * 0.75, D * 0.95), bx = w < 1 ? lerp(960, 420, ease(w)) : lerp(420, 1500, ease(b)), by = w < 1 ? lerp(560, 420, ease(w)) : lerp(420, 640, ease(b));
  return { g: paperBg(c, tot) + layer(floor(G) + at(420, G, wall(4, 3, 99), 0.7) + at(1500, G, bin(), 1.2) + at(bx, by, brick() + at(0, -90, tag, 0.8), 1.3) + (w >= 1 && b <= 0 ? `<path d="M480 300Q960 120 1440 460" stroke="${P.ink}" stroke-width="6" stroke-dasharray="14 12" fill="none" opacity=".4"/>` : ""), c) }; }
function b5(a, tot, s) { const D = dur(s, 5, 4), c = camAt(a, [[0, 800, 540, 1.0], [D, 800, 540, 1.05]]);
  return { g: paperBg(c, tot) + layer(at(760, 540, newspaper(`<rect x="-90" y="-50" width="180" height="100" rx="10" fill="none" stroke="${P.ink}" stroke-width="6" stroke-dasharray="14 10"/>${text(0, 22, "?", 70, P.ink)}`, 1.3)), c) }; }
export const brickSet = makeSet([b0, b1, b2, b3, b4, b5], [], P);

// ================= dictionary and recap =================
function d0(a, tot, s) { const D = dur(s, 0, 9), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.03]]), p = seg(a, D * 0.3, D * 0.8);
  return { g: paperBg(c, tot) + layer(`<path d="M260 200V760H1660" stroke="${P.ink}" stroke-width="8" fill="none"/>` + lineChart(L1.map(([x, y]) => [x + 120, y]), p, P.pink) + lineChart(L1.map(([x, y]) => [x + 120, y + 70]), p, P.blue) + (a > D * 0.85 ? cross(1600, 300, 40, P.red, a - D * 0.85) + `<path d="M1500 300H1560" stroke="${P.ink}" stroke-width="8"/>` : ""), c) }; }
function d1(a, tot, s) { const D = dur(s, 1, 6), c = camAt(a, [[0, 820, 540, 1.0], [D, 820, 540, 1.04]]), G = 820;
  return { g: paperBg(c, tot) + layer(floor(G) + TEAMS.map(([cc, cd], i) => at(240 + i * 300, G, team(cc, cd), 1.1 * pop(a - 0.2 - i * 0.2)) + check(240 + i * 300, G - 260, 34, P.green, a - D * 0.45 - i * 0.15)).join(""), c) }; }
export const s3dictSet = makeSet([d0, d1], [], P);
const marker = (n, on) => `${on > 0 ? rings(0, 0, 80 * on, P.gold, 0.25) : ""}${disc(0, 0, 58, mix("#e3c79a", P.gold, clamp(on)), mix("#c9a57a", P.goldD, clamp(on)))}${text(0, 28, String(n), 80, mix("#8a6a4a", "#8a5200", clamp(on)))}`;
function q0(a, tot, s) { const D = dur(s, 0, 7), c = camAt(a, [[0, 820, 540, 1.0], [D, 820, 540, 1.04]]), G = 880, turn = ease(seg(a, D * 0.55, D * 0.75));
  const signpost = `<path d="M0 0V-360" stroke="${P.woodD}" stroke-width="18"/>${at(0, -320, two("M-160 -36H120L160 0L120 36H-160Z", P.gold, P.goldD, 0, 6), 1, lerp(0, -40, turn))}`;
  return { g: paperBg(c, tot) + layer(floor(G) + at(240, 180, marker(1, spring(a - 1.0, 8, 13))) + at(760, G, signpost) + at(560, G, figure(P.blue, P.blueD)) + at(lerp(1500, 1060, easeOut(seg(a, D * 0.35, D * 0.5))), 380, `${two(rr(-80, -100, 160, 200, 12), "#fffaf0", P.creamD, 6, 6)}${magnifier(40, "", "q0m")}`, 0.9) + check(560, 520, 44, P.green, a - D * 0.8), c) }; }
function q1(a, tot, s) { const D = dur(s, 1, 9), c = camAt(a, [[0, 820, 540, 1.0], [D, 820, 540, 1.04]]), G = 840;
  const xs = [460, 820, 1180], items = [at(0, 0, tapSoap(1, 0), 0.45), at(0, -120, continent(SAM), 0.45) + at(60, -110, continent(AFR, "#e3b06a", "#c48a3a"), 0.4), at(0, -120, bug(tot * 4), 1.6)];
  return { g: paperBg(c, tot) + layer(floor(G) + at(240, 180, marker(2, spring(a - 0.5, 8, 13))) + xs.map((x, i) => at(x, G, items[i], pop(a - 0.8 - i * 0.4)) + (a < D * 0.6 ? cross(x, G - 300, 36, P.red, a - 1.2 - i * 0.4) : check(x, G - 300, 36, P.green, a - D * 0.6 - i * 0.2))).join(""), c) }; }
function q2(a, tot, s) { const D = dur(s, 2, 9), c = camAt(a, [[0, 820, 540, 1.0], [D, 820, 540, 1.04]]), G = 880;
  const fly = Array.from({ length: 5 }, (_, i) => { const t0 = 1 + i * D * 0.14, p = seg(a, t0, t0 + 1.6); return p > 0 && p < 1 ? at(lerp(1700, -200, p), 260 + (i % 3) * 120, brick(), 0.6, 360 * p) : ""; }).join("");
  return { g: paperBg(c, tot) + layer(floor(G) + at(240, 180, marker(3, spring(a - 0.5, 8, 13))) + at(820, G, wall(5, 5, 99), 0.85) + fly, c) }; }
export const s3recapSet = makeSet([q0, q1, q2], [], P);
