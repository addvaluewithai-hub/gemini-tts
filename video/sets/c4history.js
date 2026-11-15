// Crypto part 4, scene "history": the price mountain. Sixteen wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-04-world/shots.md), in the world of parts 1 to 3.
// One world: a night ridge whose peaks and falls are the real dated peaks of the price (PEAKS in c4props.js, log scale),
// drawn by a gold coin riding its tip. Every price carries its year; nothing points beyond the last fall.
//   0 the line starts: 2011 $30, down to $2
//   1 2013 $1,100 → $200, 2017 $20,000 → $3,000 (host right)
//   2 2021 $69,000 → $15,000, 2025 $126,000 → under $60,000 (host left)
//   3 the whole mountain: every fall a red bar, the first −93%, the last −54%, then a "?" (host right)
//   4–7 a story board planted on each peak: 2013 Cyprus, 2017 coins from nothing, 2021 printing at home, 2025 Wall Street
//   8 the cycle: up, the papers, the taxi, everyone on, down, and round again in four years (host right)
//   9 bought at the 2017 top: three years until the line came back to that level
//   10 bought at the 2021 top: two and a half years
//   11 the central banks' study: the app downloads came when the price was high; most of those buyers lost (host left)
//   12 a newspaper prints the coin's obituary
//   13 the obituaries pile up: 400+
//   14 the coin in the frame still breathes (host right)
//   15 each peak came a year to a year and a half after a halving (host right)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4history.v.js";
import { stars, house } from "./bank.js";
import { calPage, press, banknote, stall, padlock, car, hills } from "./props.js";
import { P, mix, coin, tower, ridge, priceLine, newspaper } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 110, -1600, 4800, 1080, tot), c, 0.15);
const fmt = (v) => "$" + Math.round(v).toLocaleString("en");

// ---- the mountain ----
const W = 3200, H = 900, G = 1000, PTS = ridge(W, H).map((q) => ({ ...q, y: G + q.y }));
const HALVINGS = [2012, 2016, 2020, 2024];
// the point at u (0..11 along the ridge's points)
const along = (u) => { const k = Math.min(PTS.length - 2, Math.floor(u)), f = u - k; return [lerp(PTS[k].x, PTS[k + 1].x, f), lerp(PTS[k].y, PTS[k + 1].y, f)]; };
// a price tag over a peak (size kept on screen by 1/z)
const peakTag = (x, y, year, price, a, z, o = {}) => { if (a <= 0) return ""; const k = 1.35 * pop(a) * (o.k || 1) / z;
  return at(x, y - 16 / z, `<path d="M-14 -10L0 8L14 -10Z" fill="${P.ink}"/>${two(rr(-118, -112, 236, 102, 18), P.ink, "#0a0626", 0, 6)}<path d="${rr(-118, -112, 236, 102, 18)}" fill="none" stroke="${o.c || P.gold}" stroke-width="5"/>${text(0, -78, String(year), 30, o.c || P.gold)}${text(0, -28, fmt(price), 46, P.cream)}`, k); };
const lowTag = (x, y, price, a, z, o = {}) => { if (a <= 0) return ""; const k = 1.3 * pop(a) / z, label = (o.under ? "< " : "") + fmt(price);
  return at(x, y + 22 / z, `${two(rr(-96, 0, 192, 60, 14), P.red, P.redD, 0, 5)}${text(0, 44, label, 38, "#fff")}`, k); };
// the ridge, drawn to u, with its tags; ages[i] are the ages since the tip reached point i (or -1)
function mountain(u, c, tot, o = {}) {
  const z = c.z, p = clamp(u / (PTS.length - 1)), pl = priceLine(p, { w: W, h: H, fill: "#3a2884", stroke: P.gold, width: 9 / Math.sqrt(z) });
  let g = at(0, G, `<path d="M${-1400} 0H${W + 1600}V700H-1400Z" fill="#241656"/>`) + at(0, G, pl.g);
  // tags: each peak (odd index) and low (even index) once the tip has passed it
  PTS.forEach((q, i) => { if (!q.year) return; const a = o.tagAge ? o.tagAge(i) : (u >= i ? 1 : -1); if (a <= 0 || (o.hide && o.hide(i))) return;
    g += q.peak ? peakTag(q.x, q.y, q.year, q.price, a, z) : lowTag(q.x, q.y, q.price, a, z, { under: q.year === 2025 }); });
  const [tx, ty] = along(Math.min(u, PTS.length - 1));
  if (o.rider !== false) g += at(tx, ty, rings(0, 0, 40, P.gold, 0.25) + coin(30, "B"), 0.9 / Math.sqrt(z), 0, "");
  return { g, tip: [tx, ty] };
}
const back = (c, tot) => night(c, tot, 13) + layer(hills(5, -2000, 5200, G - 40, 260, "#271a5e"), c, 0.5);
// the camera as one key, so it can follow something computed (and still be reframed in portrait)
const cam1 = (x, y, z) => camAt(0, [[0, x, y, z]]);

// ---- 0–2: the line is drawn peak by peak ----
const U0 = [[0, 0], [1.4, 0], [3.7, 1], [4.55, 1], [5.3, 2]], U1 = [[0, 2], [1.6, 3], [2.5, 3], [2.9, 4], [3.3, 4], [4.5, 5], [5.45, 5], [5.9, 6]], U2 = [[0, 6], [0.3, 6], [2.05, 7], [2.1, 7], [2.45, 8], [2.6, 8], [4.4, 9], [5.97, 9], [6.6, 10]];
// the age since the tip reached point i, given the shot's u keys and its age a (points reached in earlier shots count as old)
const ageAt = (keys, a, i) => { if (i <= keys[0][1]) return 9; for (let k = 1; k < keys.length; k++) if (keys[k][1] >= i && keys[k - 1][1] < i) { const t = lerp(keys[k - 1][0], keys[k][0], (i - keys[k - 1][1]) / (keys[k][1] - keys[k - 1][1])); return a - t; } return -1; };
const drawShot = (keys, ck) => (a, tot) => { const u = kf(a, keys, ease), c = camAt(a, ck), m = mountain(u, c, tot, { tagAge: (i) => ageAt(keys, a, i) });
  return { g: back(c, tot) + layer(m.g, c) }; };
const s0 = drawShot(U0, [[0, 210, 830, 1.75], [5.44, 300, 800, 1.62]]);
const s1 = drawShot(U1, [[0, 300, 800, 1.62], [1.4, 700, 690, 1.25], [5.0, 1000, 580, 1.1], [6.47, 1040, 570, 1.08]]);
const s2 = drawShot(U2, [[0, 1040, 570, 1.08], [2.0, 1700, 480, 1.04], [5.0, 2150, 500, 1.0], [7.84, 2200, 520, 0.98]]);

// ---- 3: every fall a red bar; the first −93%, the last −54% ----
const FULL = [1600, 590, 0.58];
function s3(a, tot) {
  const c = camAt(a, [[0, 2200, 520, 0.98], [0.9, ...FULL], [8.35, FULL[0], FULL[1], 0.6]]), m = mountain(10, c, tot);
  let bars = "";
  [1, 3, 5, 7, 9].forEach((pi, n) => { const hi = PTS[pi], lo = PTS[pi + 1], t = a - 0.9 - n * 0.24; if (t <= 0) return; const bx = (hi.x + lo.x) / 2 + 40, grow = ease(clamp(t / 0.4));
    bars += `<path d="M${bx} ${hi.y}V${lerp(hi.y, lo.y, grow)}" stroke="${P.red}" stroke-width="${16 / c.z}" stroke-linecap="round" opacity=".9"/><path d="M${bx - 22 / c.z} ${lerp(hi.y, lo.y, grow) - 26 / c.z}L${bx} ${lerp(hi.y, lo.y, grow)}L${bx + 22 / c.z} ${lerp(hi.y, lo.y, grow) - 26 / c.z}" fill="none" stroke="${P.red}" stroke-width="${10 / c.z}" stroke-linejoin="round"/>`; });
  const pct = (x, y, s, t) => (t > 0 ? at(x, y, `${two(rr(-110, -44, 220, 88, 18), P.red, P.redD, 0, 6)}${text(0, 24, s, 60, "#fff")}`, pop(t) / c.z) : "");
  const first = pct((PTS[1].x + PTS[2].x) / 2 + 210, (PTS[1].y + PTS[2].y) / 2 - 40, "−93%", a - 3.28), last = pct(PTS[10].x - 40, PTS[10].y + 330, "−54%", a - 5.0);
  const q = a > 7.36 ? at(PTS[10].x + 170, PTS[10].y - 70, text(0, 0, "?", 170, P.cream), pop(a - 7.36) / c.z * (1 + 0.05 * Math.sin(tot * 4))) : "";
  return { g: back(c, tot) + layer(m.g + bars + first + last + q, c) };
}

// ---- 4–7: a story board planted on each peak ----
const BOARD = { 2013: 3, 2017: 5, 2021: 7, 2025: 9 };
const boardAt = (yr) => { const q = PTS[BOARD[yr]]; return [q.x, q.y - 430]; };
function storyBoard(yr, a, tot, inner) { if (a <= 0) return ""; const q = PTS[BOARD[yr]], [bx, by] = boardAt(yr), drop = 1 - easeOut(clamp(a / 0.45));
  return `<path d="M${q.x} ${q.y - 10}V${by + 140 - 60 * drop}" stroke="${P.woodD}" stroke-width="12"/>` + at(bx, by - 140 * drop, `${two(rr(-200, -150, 400, 290, 20), P.cream, P.creamD, 0, 9)}<path d="M-182 -150h364a18 18 0 0 1 18 18v40h-400v-40a18 18 0 0 1 18 -18Z" fill="${P.red}"/>${text(0, -110, String(yr), 40, "#fff")}<clipPath id="sb${yr}"><path d="${rr(-190, -90, 380, 220, 10)}"/></clipPath><g clip-path="url(#sb${yr})">${inner}</g>`, 1.15 * pop(a, 8, 14)); }
// 2013: a padlocked bank; three houses run from it toward a coin
const cyprus = (a) => { const run = ease(seg(a, 2.5, 3.6)), shut = seg(a, 2.0, 2.4);
  return `${at(-110, 110, `<path d="M-80 0V-110L0 -150L80 -110V0Z" fill="#e8d2a8"/>${[-50, -17, 17, 50].map((x) => `<rect x="${x - 8}" y="-104" width="16" height="104" fill="#f6e6c4"/>`).join("")}<path d="M-90 -110L0 -160L90 -110Z" fill="#c9a86e"/>`)}
    ${at(-110, 50, padlock(0.75, 1 - shut))}${[0, 1, 2].map((i) => at(lerp(-30, 90 + i * 10, run) + i * 34, 112, house([P.blue, P.pink, P.teal][i], [P.blueD, P.pinkD, P.tealD][i]), 0.28)).join("")}
    ${at(150, 0, coin(34, "B"), pop(a - 3.0))}${run > 0.1 ? `<path d="M${-10 + 120 * run} 40h60m-16 -14l16 14l-16 14" stroke="${P.gold}" stroke-width="7" fill="none" stroke-linecap="round"/>` : ""}${a > 3.3 ? text(0, -50, "CYPRUS", 34, P.ink) : ""}`; };
// 2017: three little stalls, coins popping out of thin air
const tokens = (a) => [-120, 0, 120].map((x, i) => { const t = a - 1.3 - i * 0.18; let g = at(x, 120, stall([P.pink, P.teal, P.violet][i], [P.pinkD, P.tealD, P.violetD][i], 0, 200), 0.42);
  for (let k = 0; k < 3; k++) { const tt = t - k * 0.32; if (tt <= 0) continue; const up = easeOut(clamp(tt / 0.5)); g += at(x + (k - 1) * 22, 60 - 120 * up, coin(20, "?"), pop(tt)); }
  return g; }).join("");
// 2021: a press spewing notes; houses with their lights on
const printing = (a) => { const st = a > 1.8 ? Math.abs(Math.sin((a - 1.8) * 7)) : 0; let notes = "";
  for (let i = 0; i < 6; i++) { const t = a - 1.9 - i * 0.22; if (t <= 0) continue; const u = clamp(t / 0.9); notes += at(lerp(-90, 40 + i * 25, u), lerp(40, -40 + (i % 3) * 30, u), banknote(0.42), 1, -20 + 60 * u); }
  return at(-90, 120, press(st), 0.32) + notes + [0, 1].map((i) => at(80 + i * 80, 125, house([P.blue, P.pink][i], [P.blueD, P.pinkD][i], { lit: a > 3.1 ? [1, 1, 1] : [0, 0, 0] }), 0.3)).join(""); };
// 2025: a Wall Street tower with the coin on its roof
const wallst = (a) => at(0, 130, tower({ name: "WALL ST", h: 640, lit: a > 1.4 ? 1 : 0.3 }), 0.3 * pop(a - 1.3)) + (a > 1.6 ? [0, 1, 2].map((i) => { const t = a - 1.6 - i * 0.2, u = clamp(t / 0.6); return t > 0 && u < 1 ? at(lerp(-170 + i * 30, -20, u), lerp(100, -20, u), coin(18, "B")) : ""; }).join("") : "");
const STORY = { 2013: cyprus, 2017: tokens, 2021: printing, 2025: wallst };
// all four boards, each with its own age
function storyWorld(c, tot, ages) { const m = mountain(10, c, tot, { rider: false });
  let g = m.g; [2013, 2017, 2021, 2025].forEach((yr) => { const a = ages[yr]; if (a === undefined || a <= 0) return; g += storyBoard(yr, a, tot, STORY[yr](a)); });
  return back(c, tot) + layer(g, c); }
// the stories' ages: each board drops on its year word and stays
const E = (s, i, d) => (s.ends || [])[i] || d;
function s4(a, tot, s) { const c = camAt(a, [[0, ...FULL], [1.3, 800, 180, 1.25], [3.87, 780, 180, 1.27]]); return { g: storyWorld(c, tot, { 2013: a - 1.55 }) }; }
function s5(a, tot, s) { const t4 = E(s, 4, 3.87), c = camAt(a, [[0, 780, 180, 1.27], [0.9, 1376, -80, 1.27], [2.94, 1390, -80, 1.29]]); return { g: storyWorld(c, tot, { 2013: t4 + a, 2017: a - 0.05 }) }; }
function s6(a, tot, s) { const t4 = E(s, 4, 3.87), t5 = E(s, 5, 2.94), c = camAt(a, [[0, 1390, -80, 1.29], [0.9, 2016, -170, 1.29], [3.95, 2030, -170, 1.31]]); return { g: storyWorld(c, tot, { 2013: t4 + t5 + a, 2017: t5 + a, 2021: a - 0.05 }) }; }
function s7(a, tot, s) { const t4 = E(s, 4, 3.87), t5 = E(s, 5, 2.94), t6 = E(s, 6, 3.95), c = camAt(a, [[0, 2030, -170, 1.31], [0.9, 2656, -210, 1.31], [2.44, 2670, -210, 1.34]]);
  const [bx, by] = boardAt(2025); return { g: storyWorld(c, tot, { 2013: 99, 2017: t5 + t6 + a, 2021: t6 + a, 2025: a - 0.05 }), out: toScreen(c, bx, by), outC: P.cream, outZ: 18 }; }

// ---- 8: the cycle, round and round every four years ----
function s8(a, tot) {
  const c = camAt(a, [[0, 840, 600, 1.3], [8.08, 860, 610, 1.34]]), loop = a > 5.76 ? (a - 5.76) / 2.3 : 0;
  const HX = 820, HY = 760, hill = `<path d="M${HX - 520} ${HY}Q${HX - 200} ${HY - 40} ${HX} ${HY - 420}Q${HX + 200} ${HY - 40} ${HX + 520} ${HY}Z" fill="#3a2884"/><path d="M${HX - 520} ${HY}Q${HX - 200} ${HY - 40} ${HX} ${HY - 420}Q${HX + 200} ${HY - 40} ${HX + 520} ${HY}" fill="none" stroke="${P.gold}" stroke-width="10" stroke-linejoin="round"/>`;
  // the coin goes up (1.0–1.5), stays on top through the frenzy, slides down (5.1–5.6); then the loop takes it round
  const pos = (u) => u <= 0.5 ? bez([HX - 520, HY], [HX - 200, HY - 40], [HX, HY - 420], u * 2) : bez([HX, HY - 420], [HX + 200, HY - 40], [HX + 520, HY], (u - 0.5) * 2);
  const ph = loop > 0 ? (0.5 * ((loop % 1) * 2)) % 1 : kf(a, [[0.9, 0], [1.5, 0.5], [5.1, 0.5], [5.7, 1]], easeIn);
  const [cx, cy] = pos(loop > 0 ? (loop * 0.8) % 1 : ph);
  const paper = a > 1.6 ? at(HX - 330, HY - 470, newspaper({}) + `<path d="M-40 -40L0 -80L40 -40M0 -80V20" stroke="${P.green}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(-80 30)"/>`, 0.62 * pop(a - 1.6), -6) : "";
  const taxi = a > 2.7 ? at(lerp(HX + 760, HX + 420, easeOut(seg(a, 2.7, 3.2))), HY, car(P.gold, P.goldD), 0.9) + (a > 3.1 ? at(HX + 470, HY - 230, `${two(rr(-80, -60, 160, 100, 30), "#fff", "#d8dcef", 0, 5)}<path d="M-20 40l-20 30l40 -30Z" fill="#fff"/>${coin(26, "B")}<path d="M44 10V-30m-14 14l14 -14l14 14" stroke="${P.green}" stroke-width="8" fill="none" stroke-linecap="round"/>`, pop(a - 3.1)) : "") : "";
  // everyone climbs on (4.1–4.7), and tumbles when it slides (5.2)
  let crowd = ""; for (let i = 0; i < 7; i++) { const t0 = 4.1 + i * 0.08, on = ease(seg(a, t0, t0 + 0.4)), fall = seg(a, 5.2 + i * 0.05, 5.9 + i * 0.05);
    if (a < t0 || loop > 0.3) continue; const start = [HX - 700 + i * 60, HY], top = pos(0.36 + i * 0.04), down = [HX + 300 + i * 70, HY];
    const p = fall > 0 ? [lerp(top[0], down[0], fall), lerp(top[1], down[1], fall) - 60 * Math.sin(Math.PI * fall)] : [lerp(start[0], top[0], on), lerp(start[1], top[1], on) - 40 * Math.sin(Math.PI * on)];
    crowd += at(p[0], p[1], house([P.blue, P.pink, P.teal, P.violet][i % 4], [P.blueD, P.pinkD, P.tealD, P.violetD][i % 4]), 0.34, fall > 0 ? 140 * fall : 0); }
  const ring = a > 5.7 ? `<path d="M${HX - 560} ${HY + 60}A${600} 200 0 1 0 ${HX + 560} ${HY + 60}" fill="none" stroke="${P.cream}" stroke-width="8" stroke-dasharray="${(1400 * seg(a, 5.7, 6.4)).toFixed(0)} 4000"/>${a > 6.2 ? at(HX + 560, HY + 60, `<path d="M-30 -30L0 0L-36 18" fill="none" stroke="${P.cream}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`) : ""}${a > 6.1 ? at(HX, HY + 200, `${two(rr(-150, -46, 300, 80, 20), P.ink, "#0a0626", 0, 5)}${text(0, 18, "4 YEARS", 52, P.gold)}`, pop(a - 6.1)) : ""}` : "";
  const g = night(c, tot, 23) + layer(at(0, HY, `<rect x="-1200" y="0" width="4400" height="600" fill="#241656"/>`) + hill + ring + paper + taxi + crowd + at(cx, cy, rings(0, 0, 50, P.gold, 0.25) + coin(40, "B")), c);
  return { g, in: toScreen(c, HX - 330, HY - 470), inC: "#f4f0e6", inZ: 16, out: toScreen(c, HX - 330, HY - 470), outC: "#f4f0e6", outZ: 16 };
}

// ---- 9–10: bought at a top, waiting for the line to come back ----
const crossing = (pi) => { const y = PTS[pi].y; for (let k = pi + 1; k < PTS.length - 1; k++) { const A = PTS[k], B = PTS[k + 1]; if (B.y <= y && A.y > y) return [lerp(A.x, B.x, (A.y - y) / (A.y - B.y)), y]; } return [PTS[pi].x + 400, y]; };
function waitShot(pi, a, tot, c, o) { const q = PTS[pi], [ex] = crossing(pi), m = mountain(10, c, tot, { rider: false, hide: (i) => i !== pi });
  const flag = a > o.flag ? rings(q.x, q.y, 46 / c.z * (1 + 0.08 * Math.sin(tot * 6)), P.gold, 0.35 * seg(a, o.flag, o.flag + 0.3)) + at(q.x, q.y, coin(26, "B"), pop(a - o.flag) / c.z) : "";
  const line = drawn(`M${q.x} ${q.y}H${ex}`, seg(a, o.line[0], o.line[1]), P.cream, 6 / c.z, `stroke-dasharray="${18 / c.z} ${14 / c.z}"`) + (a > o.line[1] ? at(ex, q.y, check(0, 0, 30, P.green, a - o.line[1]), 1 / c.z) : "");
  let cals = ""; o.years.forEach((yr, i) => { const t = a - o.cal - i * 0.25; if (t <= 0) return; cals += at(lerp(q.x, ex, (i + 1.6) / (o.years.length + 1.4)), q.y - 110 / c.z, calPage(String(yr), "", 1, 120), 0.4 * pop(t) / c.z); });
  const lab = a > o.lab ? at((q.x + ex) / 2, q.y + 110 / c.z, `${two(rr(-150, -44, 300, 80, 20), P.ink, "#0a0626", 0, 5)}${text(0, 18, o.label, 50, P.gold)}`, pop(a - o.lab) / c.z) : "";
  return back(c, tot) + layer(m.g + line + flag + cals + lab, c); }
function s9(a, tot) { const c = camAt(a, [[0, 1600, 300, 1.5], [4.27, 1640, 300, 1.55]]);
  return { g: waitShot(5, a, tot, c, { flag: 0.5, line: [1.0, 2.6], cal: 1.8, years: [2018, 2019, 2020], lab: 2.2, label: "3 YEARS" }), in: toScreen(c, PTS[5].x, PTS[5].y), inC: "#f4f0e6", inZ: 16 }; }
function s10(a, tot) { const c = camAt(a, [[0, 1640, 300, 1.55], [0.6, 2290, 220, 1.55], [2.71, 2300, 220, 1.56]]);
  return { g: waitShot(7, a, tot, c, { flag: 0.65, line: [0.85, 1.9], cal: 1.0, years: [2022, 2023], lab: 1.6, label: "2.5 YEARS" }), out: toScreen(c, crossing(7)[0], crossing(7)[1]), outC: P.green, outZ: 18 }; }

// ---- 11: the app downloads came high; most of those buyers lost ----
function s11(a, tot) {
  const c = camAt(a, [[0, 1100, 520, 1.0], [8.01, 1110, 520, 1.03]]);
  // a small mountain at the top; dots where the downloads came, most of them on the peaks
  const MX = 650, MY = 380, mini = priceLine(10 / 11, { w: 1000, h: 300, fill: "#3a2884", stroke: P.gold, width: 7 });
  const mp = ridge(1000, 300); let dots = "";
  for (let i = 0; i < 16; i++) { const peak = i % 4 !== 3, base = peak ? mp[1 + 2 * (i % 5)] : mp[2 + 2 * (i % 5)], t = a - 5.3 - i * 0.12; if (t <= 0 || !base) continue;
    dots += at(MX + base.x + (rnd(i) - 0.5) * 50, MY + base.y - 16 - rnd(i + 3) * 30, `<circle r="13" fill="${peak ? P.gold : "#9fe7ff"}"/><path d="M0 -7v12m-6 -5l6 6l6 -6" stroke="${P.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`, pop(t)); }
  const glowPeaks = a > 6.3 ? mp.filter((q) => q.peak).map((q) => rings(MX + q.x, MY + q.y, 60, P.gold, 0.28 * seg(a, 6.3, 6.8))).join("") : "";
  // the study: a stack of data sheets and "7 YEARS"
  const sheets = a > 1.2 ? at(1560, 330, [0, 1, 2].map((i) => `<path d="${rr(-90 + i * 12, -110 - i * 12, 180, 220, 10)}" fill="${["#e8e2d2", "#f2ecdc", "#fffaf0"][i]}"/>`).join("") + [0, 1, 2, 3].map((i) => `<path d="M-50 ${-120 + i * 34}h${90 - (i % 2) * 30}" stroke="#b0a890" stroke-width="10" stroke-linecap="round"/>`).join("") + at(10, 70, `${two(rr(-110, -40, 220, 72, 18), P.ink, "#0a0626", 0, 5)}${text(0, 16, "7 YEARS", 44, P.gold)}`, pop(a - 1.6)), pop(a - 1.2)) : "";
  // the phone with an app arrow; the buyers below it
  const phone = at(1330, 700, `${two(rr(-80, -150, 160, 300, 26), "#2c1f63", P.ink, 0, 8)}<path d="${rr(-66, -126, 132, 250, 12)}" fill="#9fe7ff"/><path d="M0 -70V30m-34 -30l34 34l34 -34" stroke="${P.blueD}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${at(0, 80, coin(24, "B"))}`, 1.4 * pop(a - 2.6));
  let buyers = ""; for (let i = 0; i < 12; i++) { const col = i % 4, row = Math.floor(i / 4), x = 560 + col * 170 + row * 50, y = 830 + row * 95, t = a - 2.9 - i * 0.06; if (t <= 0) continue;
    const lost = i % 4 !== 1, mark = a > 4.55 + i * 0.03 ? (lost ? cross(0, -120, 22, P.red, a - 4.55 - i * 0.03) : check(0, -120, 22, P.green, a - 4.55 - i * 0.03)) : "";
    buyers += at(x, y, house(lost && a > 4.55 ? "#7a5aa8" : P.blue, lost && a > 4.55 ? "#5a3a88" : P.blueD, { lit: [1, 1, 1] }) + mark, 0.42 * pop(t)); }
  const g = night(c, tot, 31) + layer(at(0, 900, `<rect x="-800" y="0" width="3600" height="400" fill="#241656"/>`) + at(MX, MY, mini.g) + glowPeaks + dots + sheets + buyers + phone, c);
  return { g, in: toScreen(c, 1330, 700), inC: "#9fe7ff", inZ: 16, out: toScreen(c, 1330, 640), outC: "#9fe7ff", outZ: 16 };
}

// ---- 12–14: the obituaries ----
const NX = 900, NY = 520;
function papers(a12, tot, c, o = {}) {
  const st = a12 > 1.6 ? Math.abs(Math.sin((a12 - 1.6) * 6)) * (a12 < 2.6 ? 1 : 0) : 0;
  let g = at(NX - 520, NY + 420, press(st, { lamp: 3 }), 0.9);
  // the one paper slides out of the press and grows
  const out = ease(seg(a12, 1.7, 2.4)), main = at(lerp(NX - 520, NX, out), lerp(NY + 260, NY, out), newspaper({ obit: true }), lerp(0.4, 1.3, out) * (o.shrink ?? 1), lerp(0, -4, out));
  // more and more papers fan out behind it
  let pile = ""; const n = o.pile || 0; for (let i = 0; i < n; i++) { const r = rnd(i * 7 + 1), an = (r - 0.5) * 70, d = 280 + rnd(i * 7 + 2) * 420; pile += at(NX + Math.cos((an - 90) * Math.PI / 180) * d * 1.4, NY + 60 + Math.sin((an - 90) * Math.PI / 180) * d * 0.5 + 200, newspaper({ obit: true }), 0.45, (r - 0.5) * 40); }
  return { g: g + pile + main };
}
function s12(a, tot) { const c = camAt(a, [[0, 820, 600, 0.95], [2.95, 860, 580, 1.0]]); const p = papers(a, tot, c);
  return { g: night(c, tot, 41) + layer(at(0, 940, `<rect x="-800" y="0" width="3600" height="400" fill="#241656"/>`) + p.g, c), in: toScreen(c, NX - 520, NY + 120), inC: P.violet, inZ: 14 }; }
function s13(a, tot, s) { const a12 = E(s, 12, 2.95) + a, c = camAt(a, [[0, 860, 580, 1.0], [2.54, 900, 560, 0.92]]), n = Math.floor(28 * ease(seg(a, 0.1, 1.9)));
  const p = papers(a12, tot, c, { pile: n });
  const counter = a > 1.0 ? at(NX, 150, `${two(rr(-190, -64, 380, 120, 24), P.ink, "#0a0626", 0, 6)}${text(0, 34, String(Math.round(400 * ease(seg(a, 1.0, 2.0)))) + (a > 2.0 ? "+" : ""), 90, P.cream)}`, pop(a - 1.0)) : "";
  return { g: night(c, tot, 41) + layer(at(0, 940, `<rect x="-800" y="0" width="3600" height="400" fill="#241656"/>`) + p.g + counter, c) }; }
// the coin in its black frame, still breathing: the camera pushes into the frame on the main paper
function s14(a, tot, s) { const a12 = E(s, 12, 2.95) + E(s, 13, 2.54) + a, c = camAt(a, [[0, 900, 560, 0.92], [0.5, NX - 105, NY + 60, 1.8], [1.27, NX - 105, NY + 60, 1.86]]);
  const p = papers(a12, tot, c, { pile: 28 }), beat = 1 + 0.06 * Math.max(0, Math.sin(tot * 7)) ** 6;
  // the frame on the main paper sits at (-80, 15) of the paper, scaled 1.3 and rotated −4°
  const fx = NX - 104, fy = NY + 25, ecg = a > 0.35 ? drawn(`M${fx - 110} ${fy + 120}h50l14 -40l16 70l14 -50l10 20h120`, seg(a, 0.35, 0.9), P.green, 6) : "";
  const pulse = at(fx, fy, rings(0, 0, 75, P.gold, 0.22 * (beat - 1) * 15) + coin(72, "B"), beat);
  return { g: night(c, tot, 41) + layer(at(0, 940, `<rect x="-800" y="0" width="3600" height="400" fill="#241656"/>`) + p.g + pulse + ecg, c), out: toScreen(c, fx, fy), outC: P.gold, outZ: 16 }; }

// ---- 15: each peak came a year to a year and a half after a halving ----
function s15(a, tot) {
  const c = camAt(a, [[0, ...FULL], [8, FULL[0] + 20, FULL[1], 0.6]]), m = mountain(10, c, tot);
  let g = m.g;
  [3, 5, 7, 9].forEach((pi, n) => { const pk = PTS[pi], prev = PTS[pi - 1], hx = lerp(prev.x, pk.x, 0.7), hy = lerp(prev.y, pk.y, 0.7), t = a - 1.2 - n * 0.35;
    if (t <= 0) return;
    // the halving: a coin cut in two, with its year, on the rise before the peak
    g += at(hx, hy + 140 / c.z, `<clipPath id="hv${n}"><rect x="-40" y="-40" width="40" height="80"/></clipPath><g clip-path="url(#hv${n})" transform="translate(-6 0)">${coin(36, "B")}</g><g transform="translate(6 0) scale(-1 1)"><clipPath id="hw${n}"><rect x="-40" y="-40" width="40" height="80"/></clipPath><g clip-path="url(#hw${n})">${coin(36, "B")}</g></g>${text(0, 82, String(HALVINGS[n]), 40, P.cream)}`, pop(t) / c.z);
    // a dotted arc from the halving to its peak
    const d = seg(a, 2.6 + n * 0.25, 3.4 + n * 0.25); if (d > 0) g += drawn(`M${hx} ${hy}Q${(hx + pk.x) / 2} ${Math.min(hy, pk.y) - 160} ${pk.x} ${pk.y - 10}`, d, P.cream, 5 / c.z, `stroke-dasharray="${12 / c.z} ${12 / c.z}"`);
    // the peak catches fire at the end
    if (a > 7.0) g += rings(pk.x, pk.y, 70 / c.z * (1 + 0.1 * Math.sin(tot * 9 + n)), "#ff8a3c", 0.3 * seg(a, 7.0, 7.4)); });
  const lab = a > 3.7 ? at(FULL[0] - 200, 920, `${two(rr(-230, -50, 460, 90, 22), P.ink, "#0a0626", 0, 5)}${text(0, 20, "+1 – 1.5 YEARS", 52, P.gold)}`, pop(a - 3.7) / c.z * 0.8) : "";
  return { g: back(c, tot) + layer(g + lab, c), in: toScreen(c, PTS[10].x, PTS[10].y), inC: P.gold, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
// in a Short (cfg.vertical) the portrait versions of c4history.v.js (see makeSet in kit.js)
export const c4historySet = makeSet(SHOTS, V, P);
