// Science part 2, sets for replication (repeat), the six headline questions (headline), the dictionary (s2dict), the recap (s2recap).
//  repeat 0 the planet; a second lab under a different pennant; the paper's method card flies across; both results match, ✓, gold
//         1 one lab, one result card; three possibilities pop beside it: ✓, a pair of dice, the loose plug. Host right.
//         2 twenty labs pop up in a grid
//         3 nineteen of them show a flat line; their drawers slide out, the cards go in, the drawers shut; one lab lights gold
//         4 a journal shows only the gold result; the camera pulls back on a wall of nineteen shut drawers behind it
//         5 a plan sheet gets a seal and a date before the start; a later swap of its target is stopped with a ✗
//  headline 0 a scale icon ×10 against ×10,000      1 two pots, one of them faded with a "?" (a comparison group?)
//           2 a mouse in a cage; newspapers point at it     3 two labs with the same chart, ✓ (repeated?)
//           4 a money bag tied to the paper; a magnifier (who paid?). Host right.
//           5 a headline arrow shoots up, ×2, then a "?"
//           6 a grid of 10,000 dots: one turns red, then two: "×2"
//           7 pull back: 9,998 grey dots, nothing changed; ✓ on the number, ✗ on the scared face. Host right.
//  s2dict 0 the scales multiply while the dice shrink (sample)   1 the paper goes to masked reviewers; the flask stays untouched (peer review). Host right.
//  s2recap 0 (1) two pots, many scales, a blindfold  1 (2) eighteen darts and a chocolate bar  2 (3) the net, then a second lab repeating, ✓. Host right.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { globe } from "./props.js";
import { P, G0, mix, pop, paperBg, lab, pennant, cablePlug, magnifier, flask, drawerDesk } from "./sci.js";
import { choc, newspaper, slimArrow, tagNum, paperSheet, pot, eye } from "./sci2.js";

const floor = (G) => `<rect x="-800" y="${G}" width="3600" height="600" fill="${P.floor}"/>`;
const chart = (kind = "up", c = P.green) => `<path d="${rr(-80, -60, 160, 120, 12)}" fill="#fffaf0" stroke="${P.ink}" stroke-width="6"/>${kind === "flat" ? `<path d="M-60 20H60" stroke="${P.steelD}" stroke-width="10" stroke-linecap="round"/>` : `<path d="M-60 30L-20 10L10 20L60 -36" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`}`;
const TEAMS = [[P.coral, P.coralD], [P.blue, P.blueD], [P.mint, P.mintD], [P.gold, P.goldD]];
const die = (n) => `${two(rr(-50, -50, 100, 100, 18), "#fffaf0", P.creamD, 6, 6)}${[[-24, -24], [24, 24], [0, 0], [24, -24], [-24, 24]].slice(0, n).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${P.ink}"/>`).join("")}`;
const scaleIc = () => `${two(rr(-60, -24, 120, 24, 8), P.steel, P.steelD, 0, 5)}<circle cy="-12" r="9" fill="#fffaf0"/>`;

// ================= repeat =================
function e0(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [7.69, 960, 540, 1.02]]), fly = seg(a, 2.6, 3.9);
  const A = [560, 620], Bp = [1360, 620];
  const card = fly > 0 && fly < 1 ? at(...bez(A, [960, 120], Bp, ease(fly)), `<path d="${rr(-50, -50, 100, 100, 12)}" fill="${P.gold}"/><path d="M-12 -34V-6L-34 30H34L12 -6V-34Z" fill="none" stroke="${P.blueD}" stroke-width="8"/>`) : "";
  const res = (x, t) => (a > t ? at(x, 330, chart("up", a > 5.8 ? P.goldD : P.green) + check(90, -60, 30, P.green, a - t - 0.3), pop(a - t)) : "");
  return { g: paperBg(c, tot) + layer(at(960, 900, globe(420, 0.06, { id: "e0", ...G0 })) + at(A[0], A[1], lab({}) + at(-260, 0, pennant(P.coral, P.coralD, tot)), 0.6) + at(Bp[0], Bp[1], lab({ c: P.violet, cD: P.violetD }) + at(260, 0, pennant(P.blue, P.blueD, tot)), 0.6 * pop(a - 1.0)) + card + res(560, 4.4) + res(1360, 4.9), c) }; }
function e1(a, tot) { const c = camAt(a, [[0, 820, 560, 1.0], [5.38, 820, 560, 1.04]]);
  const opts = [[2.4, check(0, 0, 56, P.green, a - 2.4)], [3.1, die(5)], [3.9, at(0, 0, cablePlug(0.6, tot), 0.3)]].map(([t, g], i) => (a > t ? at(1150, 250 + i * 250, g, 1.5 * pop(a - t)) : "")).join("");
  return { g: paperBg(c, tot) + layer(floor(900) + at(560, 900, lab({}), 1.0) + at(560, 360, chart("up"), 1.2) + opts, c) }; }
const LP = (i) => [300 + (i % 5) * 330, 300 + Math.floor(i / 5) * 230];
function e2(a, tot) { const c = camAt(a, [[0, 960, 600, 1.0], [4.32, 960, 600, 0.98]]);
  return { g: paperBg(c, tot) + layer(Array.from({ length: 20 }, (_, i) => (a > 2.0 + i * 0.07 ? at(...LP(i), lab({}), 0.32 * pop(a - 2.0 - i * 0.07)) : "")).join(""), c) }; }
function e3(a, tot) { const c = camAt(a, [[0, 960, 600, 0.98], [6.89, 960, 600, 1.0]]), shut = seg(a, 3.3, 4.0), win = a > 5.4;
  return { g: paperBg(c, tot) + layer(Array.from({ length: 20 }, (_, i) => { const [x, y] = LP(i), lucky = i === 12; return at(x, y, lab(lucky && win ? { c: P.gold, cD: P.goldD } : {}), 0.32) + (lucky ? (win ? at(x, y - 210, chart("up", P.goldD), 0.7 * pop(a - 5.4)) : "") : at(x, y - 210 + 140 * ease(shut), chart("flat"), 0.6 * (1 - ease(seg(a, 3.7, 4.0))) + 0.001) + (a > 3.0 ? at(x + 100, y - 20, drawerDesk(1 - shut), 0.25) : "")); }).join(""), c) }; }
function e4(a, tot) { const c = camAt(a, [[0, 960, 480, 1.6], [4.6, 960, 480, 1.6], [5.8, 960, 560, 0.8], [8.05, 960, 560, 0.78]]);
  const wall = Array.from({ length: 19 }, (_, i) => at(260 + (i % 7) * 230, 760 + Math.floor(i / 7) * 160, drawerDesk(0), 0.45)).join("");
  return { g: paperBg(c, tot) + layer(wall + at(960, 480, `${two(rr(-220, -280, 440, 560, 12), P.blue, P.blueD, 10, 0)}<path d="${rr(-170, -230, 340, 80, 8)}" fill="#fffaf0"/>${at(0, 60, chart("up", P.goldD), 1.6)}`, 0.8), c) }; }
function e5(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [6.91, 960, 540, 1.04]]), seal = a - 2.3;
  const sheet = `${two(rr(-200, -260, 400, 520, 10), "#fffaf0", P.creamD, 8, 8)}${[0, 1, 2, 3, 4].map((i) => `<path d="M-150 ${-190 + i * 60}h${200 + (i % 2) * 60}" stroke="#b8a888" stroke-width="12" stroke-linecap="round"/>`).join("")}${at(-90, 160, `<path d="${rr(-60, -50, 120, 100, 12)}" fill="#efe3c8"/>${at(0, 20, scaleIc(), 0.8)}`)}`;
  const swap = a > 5.0 ? at(220, 640, `<path d="${rr(-60, -50, 120, 100, 12)}" fill="#efe3c8"/>${text(0, 26, "?", 70, P.violetD)}`, pop(a - 5.0)) + cross(340, 560, 50, P.red, a - 5.5) : "";
  return { g: paperBg(c, tot) + layer(at(960, 540, sheet + (seal > 0 ? at(130, 180, `${disc(0, 0, 70, P.red, P.redD)}<circle r="50" fill="none" stroke="#fff" stroke-width="6"/>`, pop(seal)) : ""), 1.3) + (a > 3.0 ? at(1500, 300, `${two(rr(-90, -110, 180, 220, 14), "#fffaf0", P.creamD, 6, 6)}<path d="${rr(-90, -110, 180, 50, 14)}" fill="${P.red}"/>${text(0, 70, "DAY 0", 50, P.ink)}`, pop(a - 3.0)) : "") + at(500, 0, swap), c) }; }
export const repeatSet = makeSet([e0, e1, e2, e3, e4, e5], [], P);

// ================= headline =================
function h0(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [2.77, 960, 540, 1.04]]);
  const ten = Array.from({ length: 10 }, (_, i) => at(220 + (i % 5) * 150, 440 + Math.floor(i / 5) * 120, scaleIc(), 1.1)).join("");
  let many = ""; if (a > 1.5) for (let i = 0; i < 400; i++) many += at(1100 + (i % 25) * 28, 300 + Math.floor(i / 25) * 28, `<rect x="-10" y="-4" width="20" height="8" rx="3" fill="${P.steelD}"/>`);
  return { g: paperBg(c, tot) + layer(ten + (a > 1.5 ? `<g opacity="${seg(a, 1.5, 2.0).toFixed(2)}">${many}</g>` : "") + at(960, 560, `<circle r="50" fill="${P.ink}"/>${text(0, 26, "?", 76, P.gold)}`, pop(a - 0.3)), c) }; }
function h1(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [2.34, 960, 540, 1.04]]);
  return { g: paperBg(c, tot) + layer(floor(800) + at(700, 800, pot({ tot, steam: 1 })) + `<g opacity="${(0.25 + 0.75 * (1 - seg(a, 0.6, 1.2))).toFixed(2)}">${at(1240, 800, pot({ tot, steam: 1 }))}</g>` + (a > 1.2 ? at(1240, 500, `<circle r="56" fill="${P.ink}"/>${text(0, 28, "?", 84, P.gold)}`, pop(a - 1.2)) : ""), c) }; }
const mouse = () => `${two("M-110 0Q-120 -90 -20 -100Q80 -100 100 -30Q110 0 80 0Z", "#c9c4d6", "#a8a2ba", 0, 8)}${disc(-30, -100, 30, "#c9c4d6", "#a8a2ba")}${disc(40, -96, 26, "#c9c4d6", "#a8a2ba")}<circle cx="-30" cy="-100" r="16" fill="${P.pink}"/><circle cx="40" cy="-96" r="14" fill="${P.pink}"/><circle cx="96" cy="-40" r="8" fill="${P.ink}"/><circle cx="108" cy="-20" r="7" fill="${P.pink}"/><path d="M-110 -20Q-200 -40 -220 40" stroke="${P.pink}" stroke-width="8" fill="none"/>`;
function h2(a, tot) { const c = camAt(a, [[0, 960, 560, 1.0], [6.85, 960, 560, 1.04]]);
  const cage = `${Array.from({ length: 9 }, (_, i) => `<path d="M${-220 + i * 55} -300V0" stroke="${P.steelD}" stroke-width="8"/>`).join("")}<path d="M-240 -300H240" stroke="${P.steelD}" stroke-width="14"/><path d="${rr(-250, -10, 500, 24, 6)}" fill="${P.steelD}"/>`;
  const papers = [0, 1, 2, 3].map((i) => (a > 2.3 + i * 0.4 ? at([400, 1520, 420, 1500][i], [300, 300, 760, 760][i], newspaper(at(0, 0, mouse(), 0.5), 0.45), pop(a - 2.3 - i * 0.4), (i % 2 ? -8 : 8)) : "")).join("");
  return { g: paperBg(c, tot) + layer(floor(820) + at(960, 820, mouse(), 1.3 * pop(a - 1.8)) + at(960, 820, cage, 1.1) + papers, c) }; }
function h3(a, tot) { const c = camAt(a, [[0, 960, 560, 1.0], [2.88, 960, 560, 1.04]]);
  return { g: paperBg(c, tot) + layer(floor(860) + [[620, 0.5, P.coral], [1300, 1.0, P.blue]].map(([x, t, cc]) => (a > t ? at(x, 860, lab({}), 0.7 * pop(a - t)) + at(x, 380, chart("up"), pop(a - t - 0.3)) : "")).join("") + (a > 2.2 ? check(960, 300, 56, P.green, a - 2.2) : ""), c) }; }
const bag = () => `${two("M-90 0Q-120 -120 -40 -150H40Q120 -120 90 0Z", "#c9a57a", "#a8835a", 6, 0)}<path d="M-40 -150L-60 -190H60L40 -150" fill="#a8835a"/>${text(0, -40, "$", 80, "#7a5a3a")}`;
function h4(a, tot) { const c = camAt(a, [[0, 820, 560, 1.0], [4.54, 820, 560, 1.04]]), tie = seg(a, 0.6, 1.3);
  return { g: paperBg(c, tot) + layer(at(560, 560, paperSheet([1, 1, 1], 0.9)) + at(1050, 760, bag(), 1.2 * pop(a - 0.3)) + (tie > 0 ? drawn("M980 620Q860 560 700 600", tie, P.ink, 6, 'stroke-dasharray="14 10"') : "") + (a > 3.3 ? at(820, 400, magnifier(90, "", "h4"), pop(a - 3.3)) : ""), c) }; }
function h5(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [3.79, 960, 540, 1.04]]), up = easeOut(seg(a, 1.5, 2.2));
  return { g: paperBg(c, tot) + layer(at(760, 560, newspaper(`<path d="M-60 60L-20 0L10 30L60 -60" stroke="${P.red}" stroke-width="16" fill="none" stroke-linecap="round"/>`, 1.3)) + (up > 0 ? at(1180, lerp(700, 380, up), `<path d="M-50 80h100v-90h60l-110 -120l-110 120h60Z" fill="${P.red}"/>`) + at(1380, 380, tagNum("×2", 90, P.red), pop(a - 2.0)) : "") + (a > 2.8 ? at(1380, 640, `<circle r="56" fill="${P.ink}"/>${text(0, 28, "?", 84, P.gold)}`, pop(a - 2.8)) : ""), c) }; }
// a 100 x 100 grid of dots: `red` how many are red (the first ones at fixed places)
const RED = [[37, 52], [71, 23]];
const dotGrid = (red = 0, s = 6) => { let d = `<path d="`; for (let r = 0; r < 100; r++) for (let q = 0; q < 100; q++) d += `M${q * s} ${r * s}h0.01`; d += `" stroke="#b8a888" stroke-width="${s * 0.62}" stroke-linecap="round"/>`;
  return d + RED.slice(0, red).map(([q, r]) => `<circle cx="${q * s}" cy="${r * s}" r="${s * 4}" fill="${P.red}"/>`).join(""); };
function h6(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [7.71, 960, 540, 1.04]]), n = a > 2.9 ? 2 : a > 1.1 ? 1 : 0;
  return { g: paperBg(c, tot) + layer(at(660, 240, dotGrid(n)) + (a > 5.0 ? at(1520, 300, tagNum("×2!", 100, P.red), pop(a - 5.0, 10, 18), -6) : "") + at(1520, 620, `<text x="0" y="0" text-anchor="middle" font-family="Anton" font-size="70" fill="${P.ink}">${n} / 10,000</text>`), c) }; }
const face = (scared) => `<circle r="60" fill="${P.gold}"/><circle cx="-20" cy="-12" r="${scared ? 12 : 8}" fill="${P.ink}"/><circle cx="20" cy="-12" r="${scared ? 12 : 8}" fill="${P.ink}"/>${scared ? `<ellipse cx="0" cy="26" rx="16" ry="20" fill="${P.ink}"/>` : `<path d="M-24 20Q0 40 24 20" stroke="${P.ink}" stroke-width="8" fill="none"/>`}`;
function h7(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [7.19, 820, 540, 1.0]]);
  return { g: paperBg(c, tot) + layer(at(300, 240, dotGrid(2)) + (a > 2.3 ? at(1250, 300, tagNum("9,998", 80, P.green), pop(a - 2.3)) : "") + (a > 4.3 ? at(1250, 520, tagNum("2 / 10,000", 56) + check(230, 0, 40, P.green, a - 4.5), pop(a - 4.3)) : "") + (a > 5.3 ? at(1250, 760, face(true) + cross(110, -50, 40, P.red, a - 5.6), pop(a - 5.3)) : ""), c) }; }
export const headlineSet = makeSet([h0, h1, h2, h3, h4, h5, h6, h7], [], P);

// ================= dictionary and recap =================
const revMask = () => `<path d="M-60 -10Q-60 -40 -20 -36Q0 -30 20 -36Q60 -40 60 -10Q60 20 20 14Q0 6 -20 14Q-60 20 -60 -10Z" fill="${P.ink}"/><circle cx="-26" cy="-12" r="10" fill="#fffaf0"/><circle cx="26" cy="-12" r="10" fill="#fffaf0"/>`;
function d0(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [6.65, 960, 540, 1.02]]), g = ease(seg(a, 2.0, 5.6)), cols = Math.round(lerp(4, 16, g)), rows = Math.round(lerp(2, 8, g)), k = lerp(1.1, 0.42, g);
  let grid = ""; for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) grid += at(860 + (q - (cols - 1) / 2) * 150 * k, 560 + (r - (rows - 1) / 2) * 110 * k, scaleIc(), k);
  return { g: paperBg(c, tot) + layer(grid + at(1640, 300, die(5) + at(110, 60, die(3)), lerp(1.2, 0.35, g), 10), c) }; }
function d1(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [5.79, 820, 540, 1.04]]);
  return { g: paperBg(c, tot) + layer(at(560, 540, paperSheet([1, 1, 1], 0.9)) + [0, 1].map((i) => (a > 1.2 + i * 0.3 ? at(980 + i * 220, 360, revMask(), 1.2 * pop(a - 1.2 - i * 0.3)) : "")).join("") + at(1100, 820, flask(P.mint), 1.3) + (a > 4.7 ? cross(1220, 600, 50, P.red, a - 4.7) : ""), c) }; }
export const s2dictSet = makeSet([d0, d1], [], P);
const marker = (n, on) => `${on > 0 ? rings(0, 0, 80 * on, P.gold, 0.25) : ""}${disc(0, 0, 58, mix("#e3c79a", P.gold, clamp(on)), mix("#c9a57a", P.goldD, clamp(on)))}${text(0, 28, String(n), 80, mix("#8a6a4a", "#8a5200", clamp(on)))}`;
function q0(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [6.82, 820, 540, 1.04]]);
  return { g: paperBg(c, tot) + layer(at(240, 180, marker(1, spring(a - 1.1, 8, 13))) + (a > 3.4 ? at(560, 700, pot({ tot, steam: 1 }), 0.8 * pop(a - 3.4)) + at(860, 700, pot({ tot, steam: 1 }), 0.8 * pop(a - 3.6)) : "") + (a > 4.7 ? Array.from({ length: 12 }, (_, i) => at(1100 + (i % 4) * 90, 420 + Math.floor(i / 4) * 70, scaleIc(), 0.6)).join("") : "") + (a > 5.6 ? at(700, 360, eye(1), pop(a - 5.6)) : ""), c) }; }
const DP = Array.from({ length: 18 }, (_, i) => [420 + rnd(i * 7 + 3) * 900, 260 + rnd(i * 7 + 5) * 500]);
function q1(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [5.6, 820, 540, 1.04]]);
  const ds = DP.map(([x, y], i) => (a > 1.6 + i * 0.05 ? at(x, y, `<path d="M0 0L-70 -8" stroke="${P.woodD}" stroke-width="7"/><path d="M-70 -8l-16 -12l4 12l-4 12Z" fill="${i === 7 ? P.gold : P.red}"/>`) : "")).join("");
  return { g: paperBg(c, tot) + layer(at(240, 180, marker(2, spring(a - 0.6, 8, 13))) + ds + (a > 4.5 ? at(DP[7][0] + 40, DP[7][1] + 90, choc(), 0.6 * pop(a - 4.5)) : ""), c) }; }
function q2(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [5.76, 820, 540, 1.04]]);
  const net = `<path d="M400 300Q600 620 800 300" fill="none" stroke="${P.woodD}" stroke-width="10"/><path d="M800 300l120 -160" stroke="${P.woodD}" stroke-width="16" stroke-linecap="round"/>`;
  return { g: paperBg(c, tot) + layer(at(240, 180, marker(3, spring(a - 0.6, 8, 13))) + (a > 0.9 ? net : "") + (a > 4.3 ? [[960, 4.3], [1300, 4.6]].map(([x, t]) => at(x, 760, lab({}), 0.5 * pop(a - t)) + at(x, 480, chart("up"), 0.8 * pop(a - t - 0.2))).join("") + check(1130, 360, 50, P.green, a - 5.0) : ""), c) }; }
export const s2recapSet = makeSet([q0, q1, q2], [], P);
