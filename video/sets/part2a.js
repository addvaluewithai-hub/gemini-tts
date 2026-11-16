// Science part 2, first half of the sets: intro (s2intro), the paper (paper), a fair test (fairtest), the twelve sailors (lind).
// Shot lists:
//  s2intro 0 2015: newspapers fly in from every side, all with the same front page: a chocolate bar and an arrow down
//          1 a heart pops; a shop window full of chocolate lights up, an arrow up
//          2 the planet; a chocolate bar dangles on a fishing line from above; the newspapers swarm to it (bait). Host right.
//          3 a newspaper on a scale with ✓ on one pan and ✗ on the other, rocking: believe it or not? Host left.
//  paper   0 a megaphone in the street is crossed out; a paper slides in instead
//          1 the paper's three blocks appear in turn: question (?), method (flask), result (bars)
//          2 the method block glows and a copy flies to a second bench, whose result comes out the same, ✓. Host right.
//          3 papers rain into a heap; a counter rolls to 3,000,000
//          4 a desk with a lamp reads one page a day; the calendar flips; a counter rolls to 8,000 years beside the heap
//  fairtest 0 two identical pots; a spice jar pours into the left one
//           1 a spoon tastes; a heart over the left pot, then a "?"
//           2 water lines, flames and clocks match under both pots: = = =
//           3 the plain pot gets a gold outline and a ruler (the control). Host right.
//           4 two identical pill boxes; both get a smile; one opens on sugar cubes (placebo)
//           5 a row of eyes over each group; blindfolds slide over all of them (blind)
//           6 the ladle (the cook) gets a blindfold too: two bands (double blind). Host left.
//  lind    0 dusk at sea; a sailing ship sails in; 1747
//          1 below deck, quiet: twelve grey hammocks swaying (calm)
//          2 the remedies pop up: vinegar, a bucket of sea water, a bottle of cider
//          3 the twelve hammocks light up in six coloured pairs; each pair gets its own remedy; one bowl for all
//          4 the citrus pair turns bright and one hammock empties: a door opens on daylight; the rest stay grey
//          5 the twelve hammocks against a whole fleet: a gold ✓ over the twelve. Host right.
//          6 the calendar crawls from 1747 to 1795; only then crates of lemons go up the gangway
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { globe, calPage, calFlip } from "./props.js";
import { P, G0, mix, pop, paperBg, nightSky, room, bench, magnifier, desk, hourglass } from "./sci.js";
import { choc, newspaper, slimArrow, pot, flame, spice, pillBox, eye, ladle, ship, waves, hammock, bottle, citrus, tagNum, paperSheet } from "./sci2.js";

const front = () => at(0, 0, choc(), 0.75) + at(110, 10, slimArrow(), 0.8);
const floor = (G) => `<rect x="-800" y="${G}" width="3600" height="600" fill="${P.floor}"/>`;

// ================= s2intro =================
function i0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [6.87, 960, 540, 1.06]]);
  const from = [[-300, 200], [2200, 300], [-300, 900], [2200, 900], [960, -400], [400, 1400], [1500, 1400]], to = [[560, 420], [1360, 420], [760, 640], [1160, 640], [960, 380], [500, 760], [1420, 760]];
  const ps = from.map((f, i) => { const t0 = 1.5 + i * 0.25, p = easeOut(seg(a, t0, t0 + 0.6)); return p > 0 ? at(lerp(f[0], to[i][0], p), lerp(f[1], to[i][1], p), newspaper(a > 4.3 ? front() : "", 0.62), 1, lerp(30 - i * 9, -8 + i * 3, p)) : ""; }).join("");
  return { g: paperBg(c, tot) + layer(ps + at(250, 200, calPage("2015", "", 0.8), pop(a - 0.2)), c) };
}
function i1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [2.06, 960, 540, 1.04]]), G = 860;
  const shop = `${two(rr(560, 300, 800, 560, 10), P.violet, P.violetD, 14, 0)}<path d="${rr(620, 380, 680, 380, 8)}" fill="${a > 1.05 ? "#ffe6b0" : "#5a4a3a"}"/>${[0, 1, 2].map((r) => [0, 1, 2, 3].map((q) => at(720 + q * 160, 470 + r * 110, choc(), 0.5)).join("")).join("")}`;
  const up = a > 1.1 ? at(1460, 420, `<path d="M-30 60h60v-70h40l-70 -80l-70 80h40Z" fill="${P.green}"/>`, pop(a - 1.1)) : "";
  const heart = a > 0.25 ? at(400, 380, two("M0 70C-40 40 -110 0 -110 -50C-110 -100 -40 -110 0 -60C40 -110 110 -100 110 -50C110 0 40 40 0 70Z", P.pink, P.pinkD, 0, 10), pop(a - 0.25)) : "";
  return { g: paperBg(c, tot) + layer(floor(G) + shop + up + heart, c), out: [960, 540], outC: P.sky0 };
}
function i2(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.0], [6.8, 800, 560, 1.03]]), GX = 760, GY = 760;
  const line = seg(a, 2.5, 3.2), bx = GX, by = lerp(-200, 300, easeOut(line)) + 10 * Math.sin(tot * 2);
  const hook = line > 0 ? `<path d="M${bx} -300V${by - 60}" stroke="${P.ink}" stroke-width="5"/>` + at(bx, by, choc(), 0.8, 6 * Math.sin(tot * 2)) : "";
  const swarm = Array.from({ length: 8 }, (_, i) => { const t0 = 4.4 + i * 0.12, p = easeIn(seg(a, t0, t0 + 0.9)); if (p <= 0) return ""; const ang = i * 0.8, sx = GX + Math.cos(ang) * 420, sy = GY + Math.sin(ang) * 300; return at(lerp(sx, bx + Math.cos(ang) * 120, p), lerp(sy, by + 60 + Math.sin(ang) * 80, p), newspaper(front(), 0.28), 1, 20 * Math.sin(i)); }).join("");
  return { g: paperBg(c, tot) + layer(at(GX, GY, globe(330, 0.08, { id: "s2i2", ...G0 })) + hook + swarm, c), in: [960, 540], inC: P.sky0 };
}
function i3(a, tot) {
  const c = camAt(a, [[0, 1080, 540, 1.0], [4.31, 1100, 540, 1.04]]), CX = 1160, rock = 12 * Math.sin(tot * 2.2);
  const beam = `<g transform="rotate(${rock.toFixed(2)} ${CX} 420)"><path d="M${CX - 380} 420H${CX + 380}" stroke="${P.woodD}" stroke-width="18" stroke-linecap="round"/>${[-1, 1].map((s) => `<path d="M${CX + s * 360} 420v120" stroke="${P.steelD}" stroke-width="6"/><path d="M${CX + s * 360 - 120} 540h240l-30 30h-180Z" fill="${P.steel}"/>` + (s < 0 ? check(CX + s * 360, 500, 46, P.green, a - 0.9) : cross(CX + s * 360, 500, 46, P.red, a - 1.2))).join("")}</g>`;
  return { g: paperBg(c, tot) + layer(`<path d="M${CX} 420V880" stroke="${P.woodD}" stroke-width="22"/><path d="${rr(CX - 140, 870, 280, 30, 10)}" fill="${P.woodD}"/>` + beam + at(CX, 300, newspaper(front(), 0.45), 1, rock * 0.5) + (a > 2.0 ? at(CX, 120, `<circle r="60" fill="${P.ink}"/>${text(0, 30, "?", 90, P.gold)}`, pop(a - 2.0)) : ""), c) };
}
export const s2introSet = makeSet([i0, i1, i2, i3], [{ z: 0.6 }, { z: 0.6 }, { z: 0.7 }, { z: 0.75 }], P);

// ================= paper =================
const megaphone = () => `${two("M-80 -40L60 -110V110L-80 40Z", P.coral, P.coralD, 0, 8)}${two(rr(-120, -44, 50, 88, 10), P.steel, P.steelD, 0, 6)}${[0, 1, 2].map((i) => `<path d="M${100 + i * 40} ${-60 - i * 20}q30 ${60 + i * 20} 0 ${120 + i * 40}" stroke="${P.ink}" stroke-width="8" fill="none" opacity=".4"/>`).join("")}`;
function p0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [5.37, 960, 540, 1.04]]), slide = easeOut(seg(a, 2.9, 3.6));
  return { g: paperBg(c, tot) + layer(at(560, 500, megaphone(), 1.1) + (a > 1.3 ? cross(680, 340, 60, P.red, a - 1.3) : "") + (slide > 0 ? at(lerp(2300, 1300, slide), 540, paperSheet([0, 0, 0]), 1.2, lerp(20, -4, slide)) : ""), c), out: [1300, 540], outC: "#fffaf0" };
}
function p1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [4.21, 960, 540, 1.04]]);
  return { g: paperBg(c, tot) + layer(at(960, 540, paperSheet([pop(a - 0.3), pop(a - 2.1), pop(a - 3.5)]), 2.1), c), in: [960, 540], inC: "#fffaf0" };
}
function p2(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.0], [7.82, 860, 540, 0.96]]), glow = seg(a, 1.0, 1.6), fly = seg(a, 4.4, 5.6);
  const card = fly > 0 && fly < 1 ? at(...bez([560, 560], [900, 160], [1240, 560], ease(fly)), `<path d="${rr(-50, -50, 100, 100, 12)}" fill="${P.gold}"/><path d="M-12 -34V-6L-34 30H34L12 -6V-34Z" fill="none" stroke="${P.blueD}" stroke-width="8"/>`, 1.2) : "";
  const res = a > 6.3 ? at(1240, 380, `<path d="${rr(-80, -60, 160, 120, 12)}" fill="#efe3c8"/>${[0, 1, 2].map((i) => `<path d="${rr(-50 + i * 38, 40 - (30 + i * 28), 26, 30 + i * 28, 4)}" fill="${[P.coral, P.gold, P.green][i]}"/>`).join("")}` + check(100, -60, 36, P.green, a - 6.8), pop(a - 6.3)) : "";
  return { g: paperBg(c, tot) + layer(floor(900) + at(500, 540, paperSheet([1, 1, 1], 1, glow), 1.4) + at(1240, 900, bench({ liquid: P.mint }), 1.1) + card + res, c) };
}
function p3(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [5.22, 960, 560, 0.92]]), n = Math.round(3000000 * ease(seg(a, 1.6, 3.6)));
  let heap = ""; const k = Math.floor(60 * ease(seg(a, 0.3, 3.6)));
  for (let i = 0; i < k; i++) { const r = Math.floor(Math.sqrt(i * 2)), x = 960 + (i % 9 - 4) * 60 + (r % 2) * 30, y = 900 - r * 40; heap += at(x, y, paperSheet([1, 1, 1], 0.3), 1, (i * 37) % 40 - 20); }
  return { g: paperBg(c, tot) + layer(floor(900) + heap + (a > 1.6 ? at(960, 200, tagNum(n.toLocaleString("en"), 110), 1) : ""), c), out: [960, 200], outC: P.ink };
}
function p4(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.0], [5.32, 800, 560, 1.0]]), days = Math.floor(a * 6);
  const cal = at(560, 300, calFlip(String(1 + (days % 30)), "DAY", (a * 6) % 1, 150), 0.8);
  const yrs = a > 3.9 ? at(1360, 220, tagNum(Math.round(8000 * ease(seg(a, 3.9, 4.8))).toLocaleString("en") + " YEARS", 70), 1) : "";
  let heap = ""; for (let i = 0; i < 40; i++) { const r = Math.floor(Math.sqrt(i * 2)); heap += at(1360 + (i % 7 - 3) * 60, 900 - r * 40, paperSheet([1, 1, 1], 0.18), 1, (i * 37) % 40 - 20); }
  return { g: paperBg(c, tot) + layer(floor(900) + at(560, 900, desk({ tot, flame: 1 }), 1.3) + cal + heap + yrs, c), in: [960, 200], inC: P.ink };
}
export const s2paperSet = makeSet([p0, p1, p2, p3, p4], [], P);

// ================= fairtest =================
const kitchen = (G) => `<rect x="-800" y="-400" width="3600" height="${G + 400}" fill="#f6e3c6"/>${Array.from({ length: 30 }, (_, i) => `<path d="M${-800 + i * 120} -400V${G}" stroke="#efd6b0" stroke-width="4"/>`).join("")}${two(rr(-800, G, 3600, 60, 0), "#c9a57a", "#a8835a", 0, 8)}<rect x="-800" y="${G + 60}" width="3600" height="600" fill="#e8cfa8"/>`;
const pots = (a, tot, o = {}) => { const G = 760, L = 660, R = 1260;
  return `${[L, R].map((x, i) => at(x, G + 6, flame(1, tot)) + at(x, G - 6, pot({ tot, steam: 1, lvl: o.lvl, glow: i === 1 ? o.glow || 0 : 0 }))).join("")}`; };
function f0(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [3.38, 960, 540, 1.04]]), tip = seg(a, 1.5, 2.0) * (1 - seg(a, 2.9, 3.3));
  const grains = tip > 0.6 ? Array.from({ length: 8 }, (_, i) => { const q = (a * 2 + i / 8) % 1; return `<circle cx="${560 + 10 * Math.sin(i)}" cy="${300 + 260 * q}" r="6" fill="${P.coral}"/>`; }).join("") : "";
  return { g: kitchen(760) && (paperBg(c, tot) + layer(kitchen(760) + pots(a, tot) + at(560, 300, spice(tip), 1) + grains, c)) }; }
function f1(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [3.12, 960, 540, 1.04]]);
  const spoon = at(lerp(1300, 700, ease(seg(a, 0, 0.5))), 330, `<path d="M0 0L160 -60" stroke="${P.steelD}" stroke-width="16" stroke-linecap="round"/>${disc(0, 0, 34, P.steel, P.steelD)}`);
  const heart = a > 0.7 ? at(660, 230, two("M0 50C-30 30 -80 0 -80 -36C-80 -72 -30 -80 0 -44C30 -80 80 -72 80 -36C80 0 30 30 0 50Z", P.pink, P.pinkD, 0, 8), pop(a - 0.7)) : "";
  const q = a > 2.3 ? at(840, 200, `<circle r="56" fill="${P.ink}"/>${text(0, 28, "?", 84, P.gold)}`, pop(a - 2.3)) : "";
  return { g: paperBg(c, tot) + layer(kitchen(760) + pots(a, tot) + spoon + heart + q, c) }; }
function f2(a, tot) { const c = camAt(a, [[0, 960, 600, 1.0], [4.93, 960, 600, 1.04]]);
  const eqs = [[2.6, 400], [3.4, 800], [4.1, 230]].map(([t, y], i) => (a > t ? at(960, y, `<path d="M-40 -14H40M-40 14H40" stroke="${P.green}" stroke-width="14" stroke-linecap="round"/>`, pop(a - t)) : "")).join("");
  const clocks = a > 4.1 ? [660, 1260].map((x) => at(x, 230, `<circle r="50" fill="#fffaf0" stroke="${P.ink}" stroke-width="8"/><path d="M0 0V-34M0 0L24 10" stroke="${P.ink}" stroke-width="8" stroke-linecap="round"/>`, pop(a - 4.1))).join("") : "";
  return { g: paperBg(c, tot) + layer(kitchen(760) + pots(a, tot, { lvl: a > 2.6 }) + eqs + clocks, c) }; }
function f3(a, tot) { const c = camAt(a, [[0, 1000, 540, 1.0], [5.44, 1100, 540, 1.12]]), g = seg(a, 1.3, 1.9);
  const ruler = g > 0 ? at(1480, 560, `${two(rr(-30, -220, 60, 440, 6), P.gold, P.goldD, 6, 0)}${Array.from({ length: 10 }, (_, i) => `<path d="M-30 ${-200 + i * 44}h${i % 2 ? 24 : 40}" stroke="#8a5200" stroke-width="5"/>`).join("")}`, pop(a - 1.3)) : "";
  const alone = a > 3.9 ? at(660, 230, `<circle r="56" fill="${P.ink}"/>${text(0, 28, "?", 84, P.gold)}`, pop(a - 3.9)) : "";
  return { g: paperBg(c, tot) + layer(kitchen(760) + pots(a, tot, { glow: g }) + ruler + alone + (a > 3.8 ? `<rect x="1060" y="300" width="420" height="500" fill="#f6e3c6" opacity="${(0.7 * seg(a, 3.8, 4.2)).toFixed(2)}"/>` : ""), c) }; }
const smile = () => `<circle r="44" fill="${P.gold}"/><circle cx="-14" cy="-10" r="6" fill="${P.ink}"/><circle cx="14" cy="-10" r="6" fill="${P.ink}"/><path d="M-20 10Q0 30 20 10" stroke="${P.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
function f4(a, tot) { const c = camAt(a, [[0, 960, 560, 1.0], [8.29, 960, 560, 1.06]]), open = seg(a, 6.2, 6.8);
  return { g: paperBg(c, tot) + layer(floor(800) + at(660, 800, pillBox(0, "pill", P.blue), 1.6 * pop(a - 0.2)) + at(1260, 800, pillBox(open, "sugar", P.blue), 1.6 * pop(a - 0.4)) + [660, 1260].map((x, i) => (a > 4.4 + i * 0.2 ? at(x, 460, smile(), pop(a - 4.4 - i * 0.2)) : "")).join(""), c) }; }
function f5(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [7.06, 960, 540, 1.04]]), band = ease(seg(a, 5.6, 6.3));
  const eyes = [0, 1].map((g) => [0, 1, 2].map((i) => at(420 + g * 600 + i * 170, 420, eye(band, Math.sin(tot * 2 + i)), 0.9 * pop(a - 1.5 - i * 0.1 - g * 0.2))).join("")).join("");
  return { g: paperBg(c, tot) + layer(floor(800) + eyes + [0, 1].map((g) => at(590 + g * 600, 800, pillBox(0, "pill", P.blue), 1.0 * pop(a - 2.4 - g * 0.2))).join(""), c), out: [960, 420], outC: P.ink }; }
function f6(a, tot) { const c = camAt(a, [[0, 1080, 540, 1.0], [5.8, 1100, 540, 1.04]]), band = ease(seg(a, 1.9, 2.5));
  const two_ = a > 4.6 ? [0, 1].map((i) => at(1500 + i * 120, 220, `<path d="${rr(-50, -18, 100, 36, 12)}" fill="${P.ink}"/>`, pop(a - 4.6 - i * 0.15))).join("") : "";
  return { g: paperBg(c, tot) + layer(floor(860) + at(780, 860, ladle(band), 1.4) + [0, 1, 2].map((i) => at(1200 + i * 180, 520, eye(1, 0), 0.9)).join("") + two_, c), in: [960, 420], inC: P.ink }; }
export const fairtestSet = makeSet([f0, f1, f2, f3, f4, f5, f6], [{ z: 0.6 }, { z: 0.6 }, { z: 0.6 }, { z: 0.7 }, { z: 0.8 }, { z: 0.8 }, { z: 0.75 }], P);

// ================= lind =================
const sea = (c, tot, dusk = 1) => `<rect width="${FW}" height="${FH}" fill="url(#bsky)"/>` + layer(`<circle cx="1500" cy="520" r="120" fill="#ffd98a" opacity="${dusk}"/>`, c, 0.2);
function l0(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [7.09, 1000, 520, 1.06]]), x = lerp(-500, 900, easeOut(seg(a, 0.2, 3.4)));
  return { g: sea(c, tot) + layer(at(x, 760, ship(tot), 0.9) + at(0, 780, waves(-800, 3000, tot)) + at(1560, 260, calPage("1747", "", 0.8), pop(a - 4.1)), c) }; }
const deck = (G) => `<rect x="-800" y="-400" width="3600" height="${G + 400}" fill="#7a5a3a"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${-200 + i * 220} -400V${G}" stroke="#6a4a2a" stroke-width="10"/>`).join("")}<rect x="-800" y="${G}" width="3600" height="600" fill="#5a3f2a"/>`;
const PAIRS = [[P.coral, P.coralD], [P.blue, P.blueD], ["#9a7ad0", "#7a5ab0"], [P.pink, P.pinkD], [P.gold, P.goldD], [P.teal, P.tealD]];
const hx = (i) => { const pr = Math.floor(i / 2); return 330 + (pr % 3) * 630 + (i % 2) * 260; }, hy = (i) => (Math.floor(i / 2) < 3 ? 280 : 620);
const rows = (a, tot, o = {}) => Array.from({ length: 12 }, (_, i) => { const pr = Math.floor(i / 2), x = hx(i), y = hy(i), sw = 4 * Math.sin(tot * 1.5 + i);
  const lit = o.lit ? seg(a, o.lit + pr * 0.25, o.lit + pr * 0.25 + 0.3) : 0, well = o.well && pr === 4 ? o.well : 0, empty = o.empty && i === 8 ? o.empty : 0;
  return at(x, y, `<g transform="rotate(${sw.toFixed(2)})">${hammock(...PAIRS[pr], Math.max(lit * 0.7, well), empty)}</g>`, 1.0); }).join("");
// pair p's hammocks are 2p and 2p+1: positions
const pairPos = (p) => [hx(2 * p) + 130, hy(2 * p)];
function l1(a, tot) { const c = camAt(a, [[0, 960, 480, 1.0], [4.79, 960, 500, 1.05]]);
  const tooth = a > 3.2 ? at(hx(5) - 60, lerp(600, 900, easeIn(seg(a, 3.2, 3.8))), `<path d="M-14 -20Q-20 20 -8 26Q0 10 8 26Q20 20 14 -20Z" fill="#fffaf0"/>`) : "";
  return { g: layer(deck(900) + rows(a, tot) + tooth, c) + `<rect width="${FW}" height="${FH}" fill="#2a3a30" opacity=".18"/>` }; }
const REM = [bottle("#c9d48a", ""), `${two("M-60 0L-70 -110H70L60 0Z", P.steel, P.steelD, 6, 0)}<ellipse cy="-110" rx="70" ry="16" fill="${P.blue}"/>`, bottle("#e8a23c", `<circle cy="-100" r="16" fill="${P.red}"/>`), bottle("#9aa3b8", ""), citrus(), bottle("#b58cff", "")];
function l2(a, tot) { const c = camAt(a, [[0, 960, 480, 1.0], [3.43, 960, 500, 1.04]]);
  const items = [[600, REM[0], 1.0], [960, REM[1], 1.6], [1320, REM[2], 2.4]].map(([x, g, t]) => (a > t ? at(x, 520, g, 1.4 * pop(a - t)) : "")).join("");
  return { g: layer(deck(900) + rows(a, tot), c) + `<rect width="${FW}" height="${FH}" fill="#2a1a10" opacity=".35"/>` + items }; }
function l3(a, tot) { const c = camAt(a, [[0, 960, 480, 1.0], [9.29, 960, 460, 0.96]]);
  const rem = PAIRS.map((_, p) => { const [x, y] = pairPos(p), t = 5.8 + p * 0.2; return a > t ? at(x, y - 50, REM[p], 0.75 * pop(a - t)) : ""; }).join("");
  const bowl = a > 7.7 ? at(960, 860, `${two("M-120 -40Q-120 30 0 30Q120 30 120 -40Z", P.wood, P.woodD, 0, 8)}<ellipse cy="-40" rx="120" ry="20" fill="#e8cfa8"/>`, pop(a - 7.7)) : "";
  return { g: layer(deck(900) + rows(a, tot, { lit: 3.4 }) + rem + bowl, c) }; }
function l4(a, tot) { const c = camAt(a, [[0, 960, 480, 1.0], [5.73, 1000, 500, 1.04]]), well = ease(seg(a, 1.5, 2.4)), empty = ease(seg(a, 3.4, 4.0));
  const door = a > 3.4 ? `<path d="${rr(1680, 560, 160, 300, 10)}" fill="#3a2010"/><path d="${rr(1680, 560, 160 * ease(seg(a, 3.4, 4.0)), 300, 10)}" fill="#ffe6b0"/>` : "";
  const [x, y] = pairPos(4);
  return { g: layer(deck(900) + door + rows(a, tot, { well, empty }) + at(x, y - 60, citrus(), 0.9) + (well > 0.5 ? rings(x, y + 40, 200 * well, P.gold, 0.15) : ""), c) + `<rect width="${FW}" height="${FH}" fill="#2a3a30" opacity="${(0.15 * (1 - well)).toFixed(2)}"/>` }; }
function l5(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [4.04, 800, 540, 1.04]]);
  const fleet = Array.from({ length: 9 }, (_, i) => at(1100 + (i % 3) * 300, 300 + Math.floor(i / 3) * 230, ship(tot + i), 0.22)).join("");
  const twelve = Array.from({ length: 12 }, (_, i) => at(260 + (i % 4) * 130, 380 + Math.floor(i / 4) * 140, hammock(...PAIRS[Math.floor(i / 2)], 0.8), 0.55)).join("");
  return { g: sea(c, tot, 0.6) + layer(at(0, 980, waves(-800, 3000, tot)) + fleet, c) + layer(`<path d="${rr(150, 280, 560, 480, 30)}" fill="#fffaf0" opacity=".85"/>` + twelve + (a > 1.4 ? check(640, 300, 56, P.green, a - 1.4) : ""), c) }; }
function l6(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [3.59, 960, 540, 1.04]]), yr = Math.round(lerp(1747, 1795, ease(seg(a, 0.8, 3.0))));
  const crates = a > 3.0 ? [0, 1, 2].map((i) => at(lerp(300, 820, ease(seg(a, 3.0 + i * 0.15, 3.5 + i * 0.15))), 720 - i * 6, `${two(rr(-60, -60, 120, 60, 6), P.wood, P.woodD, 0, 6)}${disc(-20, -70, 20, "#ffe066", "#e8c43a")}${disc(20, -70, 20, "#ff9f43", "#e07b1a")}`)).join("") : "";
  return { g: sea(c, tot, 0.8) + layer(at(1260, 780, ship(tot), 0.8) + at(0, 800, waves(-800, 3000, tot)) + `<path d="M300 760L900 640" stroke="${P.woodD}" stroke-width="16"/>` + crates + at(420, 260, calPage(String(yr), "", 0.9)), c) }; }
export const lindSet = makeSet([l0, l1, l2, l3, l4, l5, l6], [{ z: 0.65 }, { z: 0.8 }, { z: 0.6, bg: ["#1a1240", "#5a3f2a"] }, { z: 0.6, bg: ["#1a1240", "#5a3f2a"] }, { z: 0.6, bg: ["#1a1240", "#5a3f2a"] }, { z: 0.6 }, { z: 0.75 }], P);
