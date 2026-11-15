// Science part 2, sets for sample size (sample), the chocolate hoax (choco) and peer review (review).
//  sample 0 a coin flips three times and lands the same face each time; a "?" (is it loaded?)
//         1 a long row of flips with streaks in it: chance makes streaks all the time. Host right.
//         2 a thousand flips: two bars, 900 against 100; ✓ (now we can talk)
//         3 fifteen bathroom scales, arrows down; one gets a thermometer, three get suitcases (other reasons)
//         4 the scales multiply into a big grid while a pair of dice shrinks (more people, less luck); a magnifier: the sample
//  choco  0 a desk with a notepad and a nameplate "John Bohannon"; a TV camera rolls in beside it
//         1 three groups of five plates: bread crossed out; bread crossed out plus a chocolate bar; plates as usual; 21 days
//         2 eighteen gauges pop up; four of them light: weight, a heart (cholesterol), a moon (sleep), a smile (mood)
//         3 eighteen darts thrown at a wall, scattered; a target is drawn afterwards around the one that stuck
//         4 that dart is the weight gauge: the chocolate group's scale tips down faster
//         5 the paper goes into a journal's door that is really a till: coins, €600, an ACCEPTED stamp in a blink
//         6 a press release flies out; a phone stays silent with a ✗; newspapers multiply, each with a chocolate photo. Host right.
//  review 0 the paper goes to a journal, which sends it on to three desks under lamps, each reviewer a mask; a coin crossed out
//         1 red question marks appear on the paper one by one; a ✗ stamp (rejected)
//         2 a net catches a swarm of little bugs (mistakes); a "2" tag. Host right.
//         3 a reading lamp over the paper while the flask beside it stays untouched (✗); a fake number slips through the net
//         4 a row of journals; coins drop into one of them
//         5 that journal swings open: inside, a till; the chocolate paper goes through. Host left.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, mix, pop, paperBg, room, desk, magnifier, flask, bench } from "./sci.js";
import { choc, newspaper, slimArrow, tagNum, paperSheet } from "./sci2.js";

const floor = (G) => `<rect x="-800" y="${G}" width="3600" height="600" fill="${P.floor}"/>`;
// a coin seen face on (heads: a star) or edge on while flipping; `spin` turns it
const flipCoin = (spin = 0, face = 1) => { const sx = Math.cos(spin); return `<g transform="scale(${Math.max(0.08, Math.abs(sx)).toFixed(3)} 1)">${disc(0, 0, 70, P.gold, P.goldD)}<circle r="52" fill="none" stroke="${P.goldD}" stroke-width="7"/>${sx * face > 0 ? `<path d="M0 -34L10 -10L34 -10L14 6L22 32L0 16L-22 32L-14 6L-34 -10L-10 -10Z" fill="#8a5200"/>` : `<circle r="18" fill="#8a5200"/>`}</g>`; };
const scaleBox = (down = 0, c = P.steel) => `${two(rr(-60, -24, 120, 24, 8), c, mix(c, P.ink, 0.2), 0, 5)}<circle cy="-12" r="9" fill="#fffaf0"/>${down > 0 ? at(0, -70, slimArrow(), 0.5 * down) : ""}`;

// ================= sample =================
function m0(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [4.33, 960, 540, 1.04]]);
  const coins = [0, 1, 2].map((i) => { const t0 = 0.2 + i * 0.5, p = seg(a, t0, t0 + 0.45); if (p <= 0) return ""; const y = 560 - 300 * Math.sin(Math.PI * p); return at(660 + i * 300, p < 1 ? y : 560, flipCoin(p < 1 ? p * Math.PI * 6 : 0)); }).join("");
  return { g: paperBg(c, tot) + layer(coins + (a > 3.2 ? at(960, 260, `<circle r="60" fill="${P.ink}"/>${text(0, 30, "?", 90, P.gold)}`, pop(a - 3.2)) : ""), c) }; }
function m1(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [2.2, 820, 540, 1.04]]); const seq = "1101110001011110100011101100";
  const row = [...seq].map((b, i) => (a > i * 0.05 ? at(220 + (i % 7) * 150, 300 + Math.floor(i / 7) * 160, flipCoin(0, b === "1" ? 1 : -1), 0.7) : "")).join("");
  return { g: paperBg(c, tot) + layer(row, c) }; }
function m2(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [3.82, 960, 540, 1.04]]), n = Math.round(1000 * ease(seg(a, 0.6, 2.4))), h = n * 0.9, t = n * 0.1;
  return { g: paperBg(c, tot) + layer(floor(860) + at(760, 860, `<path d="${rr(-90, -h * 0.55, 180, h * 0.55, 10)}" fill="${P.gold}"/>`) + at(1160, 860, `<path d="${rr(-90, -t * 0.55, 180, t * 0.55, 10)}" fill="${P.steel}"/>`) + at(760, 900 - 540 - 60, flipCoin(0, 1), 0.6) + at(1160, 900 - 120, flipCoin(0, -1), 0.6) + at(960, 200, tagNum(n.toLocaleString("en"), 90), 1) + (a > 2.9 ? check(1400, 300, 56, P.green, a - 2.9) : ""), c) }; }
const therm = () => `${two(rr(-12, -110, 24, 100, 12), "#fffaf0", P.creamD, 4, 0)}${disc(0, -12, 18, P.red, P.redD)}<path d="M-5 -14V-80" stroke="${P.red}" stroke-width="10"/>`;
const suitcase = () => `${two(rr(-50, -70, 100, 70, 10), P.coral, P.coralD, 6, 0)}<path d="M-20 -70v-16h40v16" stroke="${P.ink}" stroke-width="8" fill="none"/>`;
function m3(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [7.02, 960, 540, 1.04]]);
  const s = Array.from({ length: 15 }, (_, i) => { const x = 360 + (i % 5) * 300, y = 380 + Math.floor(i / 5) * 230; return at(x, y, scaleBox(seg(a, 1.4 + i * 0.03, 1.8 + i * 0.03)) + (i === 6 && a > 3.4 ? at(70, -20, therm(), pop(a - 3.4)) : "") + ([2, 9, 13].includes(i) && a > 4.8 ? at(80, 0, suitcase(), 0.8 * pop(a - 4.8)) : ""), 1.2); }).join("");
  return { g: paperBg(c, tot) + layer(s, c) }; }
const die = (n) => `${two(rr(-50, -50, 100, 100, 18), "#fffaf0", P.creamD, 6, 6)}${[[-24, -24], [24, 24], [0, 0], [24, -24], [-24, 24]].slice(0, n).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${P.ink}"/>`).join("")}`;
function m4(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [4.25, 960, 540, 0.96]]), g = ease(seg(a, 0.2, 1.9)), cols = Math.round(lerp(5, 22, g)), rowsN = Math.round(lerp(3, 12, g)), k = lerp(1.0, 0.3, g);
  let grid = ""; for (let r = 0; r < rowsN; r++) for (let q = 0; q < cols; q++) grid += at(960 + (q - (cols - 1) / 2) * 300 * k, 560 + (r - (rowsN - 1) / 2) * 200 * k, scaleBox(1), k);
  const dice = at(1700, 200, die(5) + at(110, 60, die(3)), lerp(1.2, 0.35, g), 10);
  return { g: paperBg(c, tot) + layer(grid + dice + (a > 3.4 ? at(960, 540, magnifier(160, "", "m4"), pop(a - 3.4)) : ""), c) }; }
export const sampleSet = makeSet([m0, m1, m2, m3, m4], [], P);

// ================= choco =================
const tvCam = () => `<path d="M-60 0L0 -140L60 0M0 -140V0" stroke="${P.ink}" stroke-width="12" fill="none"/>${two(rr(-120, -260, 220, 130, 16), P.steel, P.steelD, 0, 8)}${disc(130, -195, 50, P.ink, "#000")}<circle cx="130" cy="-195" r="28" fill="${P.blue}"/><circle cx="-80" cy="-240" r="10" fill="${P.red}"/>`;
function c0(a, tot) { const c = camAt(a, [[0, 900, 600, 1.0], [4.73, 940, 620, 1.08]]);
  const pad = `${two(rr(-60, -250, 120, 50, 6), "#fffaf0", P.creamD, 0, 5)}`;
  return { g: paperBg(c, tot) + layer(floor(900) + at(760, 900, desk({ plate: "John Bohannon", tot, flame: 0 }), 1.4 * pop(a - 1.7, 7, 12)) + (a > 3.3 ? at(lerp(2100, 1450, easeOut(seg(a, 3.3, 4.0))), 900, tvCam(), 1.2) : ""), c) }; }
const plate = (o = {}) => `<ellipse rx="70" ry="24" fill="#fffaf0" stroke="${P.creamD}" stroke-width="6"/>${o.bread ? `<path d="M-30 -10Q-34 -40 0 -40Q34 -40 30 -10Z" fill="#f0a65a"/>` : ""}${o.choc ? at(30, -16, choc(), 0.3, -10) : ""}${o.noBread ? `<path d="M-30 -10Q-34 -40 0 -40Q34 -40 30 -10Z" fill="#f0a65a" opacity=".5"/><path d="M-40 -50L40 10M40 -50L-40 10" stroke="${P.red}" stroke-width="8" stroke-linecap="round"/>` : ""}`;
function c1(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [10.08, 960, 540, 1.04]]);
  const g = [[480, { noBread: a > 3.0 }], [960, { noBread: a > 4.8, choc: a > 6.3 }], [1440, { bread: a > 7.4 }]];
  const groups = g.map(([x, o], gi) => (a > 1.6 + gi * 0.3 ? at(x, 500, `<path d="${rr(-200, -260, 400, 520, 30)}" fill="#fffaf0" opacity=".6" stroke="${[P.coral, P.gold, P.blue][gi]}" stroke-width="10"/>` + Array.from({ length: 5 }, (_, i) => at((i % 2) * 140 - 70 + (i === 4 ? 70 : 0), -170 + Math.floor(i / 2) * 140, plate(o))).join(""), pop(a - 1.6 - gi * 0.3)) : "")).join("");
  return { g: paperBg(c, tot) + layer(groups + (a > 8.7 ? at(1720, 200, calPage("21", "DAYS", 0.7), pop(a - 8.7)) : ""), c) }; }
const gauge = (v = 0.3, c = P.steel, icon = "") => `${disc(0, 0, 56, "#fffaf0", P.creamD, 0.06)}<circle r="56" fill="none" stroke="${c}" stroke-width="10"/><path d="M0 0L${(Math.cos(Math.PI * (1 + v)) * 40).toFixed(1)} ${(Math.sin(Math.PI * (1 + v)) * 40).toFixed(1)}" stroke="${P.ink}" stroke-width="7" stroke-linecap="round"/>${icon ? at(0, 34, icon, 0.4) : ""}`;
const ICONS = [slimArrow(), `<path d="M0 30C-24 14 -60 -6 -60 -30C-60 -56 -24 -60 0 -36C24 -60 60 -56 60 -30C60 -6 24 14 0 30Z" fill="${P.pink}"/>`, `<path d="M20 -50A50 50 0 1 0 50 20A40 40 0 1 1 20 -50Z" fill="${P.blueD}"/>`, `<circle r="44" fill="${P.gold}"/><path d="M-20 10Q0 30 20 10" stroke="${P.ink}" stroke-width="8" fill="none"/>`];
const gpos = (i) => [330 + (i % 6) * 252, 260 + Math.floor(i / 6) * 220];
function c2(a, tot) { const c = camAt(a, [[0, 960, 480, 1.0], [6.09, 960, 480, 1.04]]), lit = [2.5, 3.2, 4.0, 4.8];
  const gs = Array.from({ length: 18 }, (_, i) => { const t0 = 1.0 + i * 0.06; if (a < t0) return ""; const L = i < 4 && a > lit[i]; return at(...gpos(i), gauge(0.3 + 0.4 * Math.sin(tot + i) * 0.2, L ? P.gold : P.steel, L ? ICONS[i] : ""), pop(a - t0) * (L ? 1.15 : 1)); }).join("");
  return { g: paperBg(c, tot) + layer(gs + (a > 2.0 ? at(960, 960, tagNum("18", 90), 1) : ""), c) }; }
const dart = (c = P.red) => `<path d="M0 0L-90 -10" stroke="${P.woodD}" stroke-width="8"/><path d="M0 0l-16 -8v16Z" fill="${P.steelD}"/><path d="M-90 -10l-20 -16l6 16l-6 16Z" fill="${c}"/>`;
const DP = Array.from({ length: 18 }, (_, i) => [300 + rnd(i * 7 + 3) * 1320, 160 + rnd(i * 7 + 5) * 640]);
function c3(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [8.2, 960, 520, 1.05]]);
  const wall = `<rect x="-500" y="-500" width="3000" height="2000" fill="#e9d3b0"/>${Array.from({ length: 20 }, (_, r) => Array.from({ length: 14 }, (_, q) => `<path d="${rr(-400 + q * 200 + (r % 2) * 100, -300 + r * 90, 190, 80, 4)}" fill="#e3c79a"/>`).join("")).join("")}`;
  const ds = DP.map(([x, y], i) => { const t0 = 4.2 + i * 0.05; if (a < t0) return ""; const p = easeIn(seg(a, t0, t0 + 0.2)); return at(lerp(x - 400, x, p), lerp(y + 100, y, p), dart(i === 7 ? P.gold : P.red)); }).join("");
  const T = DP[7], ring = seg(a, 6.3, 7.2);
  const target = ring > 0 ? drawn(`M${T[0] + 110} ${T[1]}A110 110 0 1 1 ${T[0] - 110} ${T[1]}A110 110 0 1 1 ${T[0] + 110} ${T[1]}`, ring, P.red, 12) + (ring >= 1 ? `<circle cx="${T[0]}" cy="${T[1]}" r="60" fill="none" stroke="${P.red}" stroke-width="10"/>` : "") : "";
  return { g: layer(wall + ds + target, c), out: toScreen(c, T[0], T[1]), outC: P.gold }; }
function c4(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [3.65, 960, 540, 1.04]]), tip = ease(seg(a, 2.0, 2.9));
  const sc = [[600, P.coral, 0.3], [960, P.gold, 1], [1320, P.blue, 0.1]].map(([x, cc, k]) => at(x, 760, `${two(rr(-110, -40, 220, 40, 10), cc, mix(cc, P.ink, 0.2), 0, 6)}` + at(0, -110, slimArrow(), 0.9 * tip * k + 0.01)) + (k === 1 ? at(x + 160, 640, choc(), 0.5) : "")).join("");
  return { g: paperBg(c, tot) + layer(floor(760) + at(960, 300, gauge(lerp(0.3, 0.85, tip), P.gold, ICONS[0]), 1.8) + sc, c), in: [960, 300], inC: P.gold }; }
const till = (open = 0) => `${two(rr(-150, -160, 300, 160, 14), P.steel, P.steelD, 0, 8)}${two("M-120 -160L-100 -260H100L120 -160Z", P.steelD, "#6a7298", 0, 6)}<path d="${rr(-80, -250, 160, 60, 8)}" fill="#12302a"/>${text(0, -205, "€600", 44, P.green)}${[0, 1, 2].map((r) => [0, 1, 2, 3].map((q) => `<path d="${rr(-110 + q * 56, -140 + r * 40, 44, 28, 6)}" fill="#fffaf0"/>`).join("")).join("")}<path d="${rr(-160, -10 + 40 * open, 320, 40, 8)}" fill="${P.steelD}"/>`;
function c5(a, tot) { const c = camAt(a, [[0, 960, 560, 1.0], [6.62, 960, 560, 1.04]]), fly = seg(a, 0.6, 1.6);
  const pp = fly < 1 ? at(...bez([400, 500], [800, 200], [1200, 620], ease(fly)), paperSheet([1, 1, 1], 0.35), 1, 360 * fly) : "";
  const coins = a > 3.4 ? Array.from({ length: 6 }, (_, i) => { const q = seg(a, 3.4 + i * 0.12, 3.9 + i * 0.12); return q > 0 && q < 1 ? at(1200 + 20 * Math.sin(i), lerp(200, 640, easeIn(q)), disc(0, 0, 26, P.gold, P.goldD)) : ""; }).join("") : "";
  const stamp = a > 2.2 ? at(1500, 330, `<path d="${rr(-170, -50, 340, 100, 12)}" fill="none" stroke="${P.green}" stroke-width="12"/>${text(0, 22, "ACCEPTED", 60, P.green)}`, pop(a - 2.2, 12, 20), -10) : "";
  return { g: paperBg(c, tot) + layer(floor(860) + at(1200, 860, till(seg(a, 4.3, 4.6)), 1.4) + pp + coins + stamp, c) }; }
const phoneOld = () => `${two(rr(-90, -60, 180, 60, 14), P.ink, "#000", 0, 6)}${two("M-110 -70Q-110 -120 -60 -120H60Q110 -120 110 -70Z", P.ink, "#000", 0, 6)}<circle cy="-30" r="22" fill="${P.steel}"/>`;
function c6(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [7.74, 800, 540, 0.96]]), rel = seg(a, 0.2, 1.0);
  const papers = Array.from({ length: 9 }, (_, i) => { const t0 = 5.1 + i * 0.12; return a > t0 ? at(300 + (i % 3) * 260, 300 + Math.floor(i / 3) * 230, newspaper(at(0, 0, choc(), 0.75), 0.5), pop(a - t0), (i * 13) % 20 - 10) : ""; }).join("");
  return { g: paperBg(c, tot) + layer((rel > 0 && rel < 1 ? at(lerp(960, 600, rel), lerp(500, 400, rel), paperSheet([1, 1, 1], 0.4)) : "") + (a > 2.6 && a < 5.1 ? at(800, 640, phoneOld(), 1.4) + cross(960, 480, 50, P.red, a - 3.6) : "") + papers, c) }; }
export const chocoSet = makeSet([c0, c1, c2, c3, c4, c5, c6], [], P);

// ================= review =================
const journal = (c = P.blue, cD = P.blueD) => `${two(rr(-160, -420, 320, 420, 10), c, cD, 14, 0)}<path d="${rr(-120, -380, 240, 80, 8)}" fill="#fffaf0"/><path d="M-90 -340h180" stroke="${P.ink}" stroke-width="12"/><path d="M-60 0V-180A60 60 0 0 1 60 -180V0Z" fill="${P.ink}"/>`;
const mask = () => `<path d="M-60 -10Q-60 -40 -20 -36Q0 -30 20 -36Q60 -40 60 -10Q60 20 20 14Q0 6 -20 14Q-60 20 -60 -10Z" fill="${P.ink}"/><circle cx="-26" cy="-12" r="10" fill="#fffaf0"/><circle cx="26" cy="-12" r="10" fill="#fffaf0"/>`;
const revDesk = (k = 1) => at(0, 0, `${two(rr(-150, -110, 300, 30, 6), P.wood, P.woodD, 0, 6)}<rect x="-130" y="-80" width="20" height="80" fill="${P.woodD}"/><rect x="110" y="-80" width="20" height="80" fill="${P.woodD}"/><path d="M90 -110V-220l-50 -30" stroke="${P.steelD}" stroke-width="8" fill="none"/><path d="M10 -250l60 -20l20 40Z" fill="${P.gold}"/>${at(-20, -170, mask(), 0.9)}`, k);
function r0(a, tot) { const c = camAt(a, [[0, 960, 560, 1.0], [9.32, 960, 560, 1.0]]), go = seg(a, 2.6, 3.6);
  const pp = go < 1 ? at(lerp(300, 960, ease(go)), lerp(500, 640, ease(go)), paperSheet([1, 1, 1], 0.35)) : "";
  const desks = [0, 1, 2].map((i) => { const t0 = 4.1 + i * 0.5, f = seg(a, t0, t0 + 0.7); return (a > t0 - 0.2 ? at(1420 + (i - 1) * 0, 300 + i * 260, revDesk(0.9)) : "") + (f > 0 && f < 1 ? at(lerp(1000, 1420, ease(f)), lerp(560, 260 + i * 260, ease(f)), paperSheet([1, 1, 1], 0.2)) : ""); }).join("");
  const nofee = a > 7.3 ? at(1720, 200, disc(0, 0, 40, P.gold, P.goldD) + cross(0, 0, 50, P.red, a - 7.5), pop(a - 7.3)) : "";
  return { g: paperBg(c, tot) + layer(floor(900) + at(960, 900, journal(), 1.1) + desks + pp + nofee, c) }; }
function r1(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [4.83, 960, 540, 1.04]]);
  const qs = [[1.2, -60, -110], [2.1, 60, 20], [3.0, -40, 140]].map(([t, x, y]) => (a > t ? at(960 + x * 2.2, 540 + y * 2.2, `<circle r="40" fill="${P.red}"/>${text(0, 22, "?", 64, "#fff")}`, pop(a - t)) : "")).join("");
  const stamp = a > 3.8 ? at(1380, 300, cross(0, 0, 90, P.red, a - 3.8), 1) : "";
  return { g: paperBg(c, tot) + layer(at(960, 540, paperSheet([1, 1, 1]), 2.2) + qs + stamp, c) }; }
const bug = (k = 1) => at(0, 0, `<ellipse rx="22" ry="16" fill="${P.ink}"/><circle cx="20" r="10" fill="${P.ink}"/><path d="M-10 -14l-6 -14M4 -14l6 -14M-10 14l-6 14M4 14l6 14" stroke="${P.ink}" stroke-width="5"/>`, k);
const net = (x, y) => `<path d="M${x - 200} ${y - 200}Q${x} ${y + 120} ${x + 200} ${y - 200}" fill="none" stroke="${P.woodD}" stroke-width="10"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${x - 180 + i * 60} ${y - 190 + (i % 2) * 0}Q${x - 100 + i * 30} ${y} ${x - 40 + i * 14} ${y + 60}" stroke="${P.steelD}" stroke-width="4" fill="none" opacity=".7"/>`).join("")}<path d="M${x + 200} ${y - 200}l120 -160" stroke="${P.woodD}" stroke-width="16" stroke-linecap="round"/>`;
function r2(a, tot) { const c = camAt(a, [[0, 820, 540, 1.0], [3.24, 820, 540, 1.04]]);
  const bugs = Array.from({ length: 10 }, (_, i) => { const p = seg(a, 0.2 + i * 0.08, 1.2 + i * 0.08), sx = 200 + rnd(i) * 1100, sy = 150 + rnd(i + 9) * 300; return at(lerp(sx, 700 + (i % 5) * 40 - 80, ease(p)), lerp(sy, 560 + Math.floor(i / 5) * 40, ease(p)), bug()); }).join("");
  return { g: paperBg(c, tot) + layer(net(700, 520) + bugs + (a > 2.0 ? at(1200, 260, tagNum("2", 100), pop(a - 2.0)) : ""), c) }; }
function r3(a, tot) { const c = camAt(a, [[0, 960, 540, 1.0], [5.29, 960, 540, 1.04]]), slip = seg(a, 3.9, 4.9);
  return { g: paperBg(c, tot) + layer(floor(860) + at(560, 860, revDesk(1.6)) + at(560, 560, paperSheet([1, 1, 1], 0.5)) + at(1300, 860, bench({ liquid: P.mint }), 1.1) + (a > 1.9 ? cross(1300, 380, 56, P.red, a - 1.9) : "") + net(1650, 420) + (slip > 0 ? at(lerp(1650, 1700, slip), lerp(200, 900, easeIn(slip)), `<path d="${rr(-60, -40, 120, 80, 10)}" fill="${P.coral}"/>${text(0, 22, "99", 54, "#fff")}`) : ""), c) }; }
const JCOL = [[P.blue, P.blueD], [P.green, P.greenD], [P.coral, P.coralD], ["#9a7ad0", "#7a5ab0"], [P.teal, P.tealD]];
function r4(a, tot) { const c = camAt(a, [[0, 960, 560, 1.0], [4.37, 1040, 560, 1.08]]);
  const js = JCOL.map(([cc, cD], i) => at(360 + i * 300, 880, journal(cc, cD), 0.62 * pop(a - 0.2 - i * 0.1))).join("");
  const coins = a > 3.5 ? Array.from({ length: 5 }, (_, i) => { const q = seg(a, 3.5 + i * 0.1, 3.9 + i * 0.1); return q > 0 && q < 1 ? at(960, lerp(300, 700, easeIn(q)), disc(0, 0, 24, P.gold, P.goldD)) : ""; }).join("") : "";
  return { g: paperBg(c, tot) + layer(floor(880) + js + coins, c), out: toScreen(c, 960, 720), outC: P.coral }; }
function r5(a, tot) { const c = camAt(a, [[0, 1100, 540, 1.0], [4.29, 1100, 540, 1.06]]), open = ease(seg(a, 1.5, 2.2)), go = seg(a, 3.0, 3.8);
  const door = `<g transform="translate(860 0) scale(${(1 - 0.85 * open).toFixed(3)} 1) translate(-860 0)">${at(1100, 900, journal(P.coral, P.coralD), 1.5)}</g>`;
  return { g: paperBg(c, tot) + layer(floor(900) + `<path d="${rr(860, 280, 480, 620, 10)}" fill="#3a2f55"/>` + at(1100, 900, till(0), 1.2) + door + (go > 0 && go < 1 ? at(lerp(1700, 1100, ease(go)), lerp(300, 700, ease(go)), newspaper(at(0, 0, choc(), 0.75), 0.35)) : ""), c), in: [960, 720], inC: P.coral }; }
export const reviewSet = makeSet([r0, r1, r2, r3, r4, r5], [], P);
