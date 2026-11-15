// "The domino" (electricity part 3 of 4): how one fault darkens a region.
//   0 a grid: gold stations, lit city clusters, the lines between them, each line carrying moving dots
//   1 one line trips; its dots slide onto the neighbours, which thicken red and trip, then the next, and the next
//   2 pull back: the dark spreads across the map like a wave, a stopwatch
//   3 a heavy beam on a row of posts; one post slides away, the weight lands on the next, which buckles, and so on (host right)
//   4 a line between two pylons with a protection box; the shield lights, the box clicks open, the line goes dark;
//     then the same box opens on every line in turn
// No people: the "workers" are posts. Exports the grid and the map of north-east America for e3intro.js and ohio.js.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./domino.v.js";
import { P, E, mix, house, stars, pop, station, pylon, pylonTips, span, plate, tagV } from "./elec.js";

export const RED = "#ff4d5a", LAND = "#164a62", LANDD = "#0f3a4f";
export const tall = () => FH > FW;
export const sky = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -1400, 3400, 900, tot), c, 0.12);
export const bump = (a, t0, amt = 0.12) => (a > t0 ? 1 + amt * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 14) : 1);

// ---- the grid: stations (gold), cities (lit clusters), lines ----
export const NODES = [
  { x: 260, y: 300, k: "s" }, { x: 560, y: 220, k: "c" }, { x: 900, y: 300, k: "s" }, { x: 1240, y: 210, k: "c" }, { x: 1600, y: 320, k: "s" },
  { x: 400, y: 560, k: "c" }, { x: 760, y: 520, k: "c" }, { x: 1080, y: 560, k: "s" }, { x: 1420, y: 560, k: "c" },
  { x: 240, y: 820, k: "s" }, { x: 600, y: 820, k: "c" }, { x: 940, y: 840, k: "c" }, { x: 1280, y: 830, k: "s" }, { x: 1640, y: 800, k: "c" }];
export const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 6], [2, 7], [3, 7], [4, 8], [5, 6], [6, 7], [7, 8], [5, 9], [5, 10], [6, 10], [7, 11], [7, 12], [8, 12], [8, 13], [9, 10], [10, 11], [11, 12], [12, 13]];
// a city: a cluster of small lit windows (centre), lit 0..1
export const city = (lit, seed = 1, k = 1) => { let s = ""; for (let i = 0; i < 9; i++) { const x = (i % 3 - 1) * 26, y = (Math.floor(i / 3) - 1) * 26 - (i % 2) * 6;
  s += `<rect x="${x - 10}" y="${y - 14}" width="20" height="${28 + (rnd(seed + i) * 18).toFixed(0) * 1}" rx="3" fill="${mix("#0f3047", "#1f5a72", 0.4)}"/><rect x="${x - 5}" y="${y - 8}" width="10" height="10" rx="2" fill="${mix("#123a57", P.win, lit * (rnd(seed * 3 + i) > 0.25 ? 1 : 0.4))}"/>`; }
  return at(0, 0, (lit > 0 ? rings(0, 0, 70, P.win, 0.18 * lit, 1.4) : "") + s, k); };
export const plantDot = (lit, k = 1) => at(0, 0, (lit > 0 ? rings(0, 0, 46, P.gold, 0.25 * lit, 1.5) : "") + disc(0, 0, 30, mix("#2a4a60", P.gold, lit), mix("#1a3446", P.goldD, lit)) + `<path d="M-8 -14L10 -14L0 2H12L-10 22L-2 4H-14Z" fill="${mix("#3a5a70", P.ink, lit)}"/>`, k);
// draw the grid. st(i) for each edge: { draw 0..1, load 1.., red 0..1, dark 0..1 }; lit(n) for each node 0..1
export const drawGrid = (t, st, lit, o = {}) => {
  const lines = EDGES.map(([i, j], e) => { const s = st(e), A = NODES[i], B = NODES[j]; if (s.draw <= 0) return "";
    const d = `M${A.x} ${A.y}L${B.x} ${B.y}`, w = 7 + 9 * clamp((s.load || 1) - 1) + 6 * (s.red || 0), col = mix(mix(E.el, RED, s.red || 0), "#16384c", s.dark || 0);
    const dots = s.draw >= 1 && (s.dark || 0) < 0.6 && o.dots !== false ? Array.from({ length: Math.round(3 * (s.load || 1)) }, (_, k2) => { const q = ((t * 0.45 * (e % 2 ? 1 : -1) + k2 / Math.round(3 * (s.load || 1)) + e * 0.13) % 1 + 1) % 1;
      return `<circle cx="${lerp(A.x, B.x, q).toFixed(1)}" cy="${lerp(A.y, B.y, q).toFixed(1)}" r="${9 + 3 * (s.red || 0)}" fill="${mix(P.gold, "#ffd0c2", s.red || 0)}" opacity="${(1 - (s.dark || 0)).toFixed(2)}"/>`; }).join("") : "";
    const flash = s.flash > 0 && s.flash < 1 ? rings((A.x + B.x) / 2, (A.y + B.y) / 2, 60 + 80 * s.flash, RED, 0.4 * (1 - s.flash), 1.4) : "";
    return drawn(d, s.draw, col, w, `opacity="${(1 - 0.5 * (s.dark || 0)).toFixed(2)}"`) + dots + flash; }).join("");
  const nodes = NODES.map((n, i) => { const L = lit(i); if (L.pop <= 0) return ""; return at(n.x, n.y, n.k === "s" ? plantDot(L.on, 1) : city(L.on, i + 2, 1), pop(L.pop)); }).join("");
  return lines + nodes; };

// ---- the map of north-east America and Canada (world 200..1720 x 140..960), the lakes, the cities ----
export const NEAM = "M220 820L300 700L280 600L360 520L340 420L440 340L560 300L660 220L800 180L960 160L1120 190L1260 160L1400 200L1520 260L1620 340L1700 440L1680 540L1600 600L1560 700L1480 760L1420 860L1340 920L1240 940L1120 900L1000 940L880 930L760 960L620 940L480 920L340 900Z";
export const LAKES = "M560 520Q640 470 720 500Q760 540 700 570Q620 590 560 560Z M760 470Q830 420 900 450Q930 490 880 520Q810 530 760 500Z M940 520Q1000 500 1060 520Q1080 545 1040 560Q980 570 940 550Z M1080 470Q1150 440 1220 460Q1240 490 1190 505Q1120 510 1080 490Z";
export const NECITIES = [[600, 640, "c"], [700, 700, "c"], [820, 640, "s"], [900, 760, "c"], [1040, 650, "c"], [1150, 730, "s"], [1260, 640, "c"], [1360, 720, "c"], [1440, 640, "c"], [1300, 380, "s"], [1100, 360, "c"], [880, 360, "c"], [480, 720, "s"]];
export const OHIO = [760, 700], NYC = [1360, 720];
// lit(i) 0..1 per city; ring: optional dark wave {x, y, r}
export const neMap = (tot, lit, o = {}) => two(NEAM, LAND, LANDD, 0, 10) + `<path d="${LAKES}" fill="#0b2c40"/>` + (o.border ? `<path d="M300 560L520 470L760 430L1000 400L1240 330L1460 300" fill="none" stroke="#2a6a82" stroke-width="5" stroke-dasharray="18 14"/>` : "")
  + NECITIES.map(([x, y, k], i) => at(x, y, k === "s" ? plantDot(lit(i, x, y), 0.8) : city(lit(i, x, y), i + 5, 0.9))).join("");
// the dark wave: how lit a point is when darkness spreads from (x0, y0) with radius r
export const waveLit = (x, y, x0, y0, r) => clamp(1 - (r - Math.hypot(x - x0, y - y0)) / 120);

// ---- 0: a grid that shares the load ----
function d0(a, tot, s) {
  const c = camAt(a, [[0, 960, 560, 1.12], [4.71, 960, 540, 1.0]]);
  const lit = (i) => { const n = NODES[i], t0 = n.k === "s" ? 0.76 : 1.55; return { pop: a - t0 - (i % 5) * 0.06, on: 1 }; };
  const st = (e) => ({ draw: ease(seg(a, 2.11 + e * 0.02, 2.6 + e * 0.02)), load: 1 + 0.15 * seg(a, 2.89, 3.4) });
  const g = sky(c, tot, 21) + layer(drawGrid(a > 2.89 ? tot : 0, st, lit), c);
  return { g, out: toScreen(c, 760, 520), outC: E.el, outZ: 14 };
}
// ---- 1: one line trips; the load moves to the neighbours; they trip in turn ----
// the chain: edge 11 (6-7) trips first; its load goes to 6, 7 (6-10, 7-11, 2-7, 7-8); those trip at the next words
const CHAIN = [{ e: [11], at: 0.53 }, { e: [7, 16], at: 6.62 }, { e: [12, 17, 3], at: 7.77 }, { e: [8, 18, 22, 19], at: 8.55 }];
const HOT = [[7, 16, 15, 6], [12, 17, 3, 8], [18, 22, 19, 9]];
function d1(a, tot, s) {
  const c = camAt(a, [[0, 920, 600, 1.55], [3.6, 940, 600, 1.5], [6.4, 980, 600, 1.25], [9.39, 1000, 580, 1.05]]);
  const trip = (e) => { for (const k of CHAIN) if (k.e.includes(e)) return a > k.at ? clamp((a - k.at) / 0.35) : 0; return 0; };
  const hot = (e) => { let h = 0; HOT.forEach((grp, i) => { if (grp.includes(e)) { const t0 = i === 0 ? 3.88 : CHAIN[i].at; h = Math.max(h, seg(a, t0, t0 + (i === 0 ? 2.2 : 0.6))); } }); return h; };
  const st = (e) => { const tr = trip(e), h = hot(e) * (1 - tr); return { draw: 1, load: 1 + 1.4 * h, red: h, dark: tr, flash: tr > 0 && tr < 1 ? tr : (a > 0.53 && a < 1.0 && e === 11 ? (a - 0.53) / 0.47 : 0) }; };
  const darkNode = (i) => { const n = NODES[i]; const near = EDGES.filter(([p, q]) => p === i || q === i).map((_, k2) => k2); const all = EDGES.map(([p, q], e) => (p === i || q === i ? trip(e) : 1)).filter((v, k2) => EDGES[k2][0] === i || EDGES[k2][1] === i); return Math.min(...all); };
  const lit = (i) => ({ pop: 1, on: 1 - 0.85 * darkNode(i) });
  // "for any reason": a question mark over the first line
  const q = a > 1.09 && a < 3.6 ? at(918, 420, text(0, 0, "?", 140, P.gold), pop(a - 1.09) * (1 - seg(a, 3.2, 3.6))) : "";
  const g = sky(c, tot, 22) + layer(drawGrid(tot, st, lit) + q, c);
  return { g, out: toScreen(c, 940, 560), outC: "#04121e", outZ: 12 };
}
// ---- 2: the dark spreads across the whole map ----
function d2(a, tot, s) {
  const c = camAt(a, [[0, 1000, 580, 1.05], [3.35, 960, 560, 0.82]]), r = lerp(260, 2000, easeIn(seg(a, 0.0, 2.9)));
  const lit = (i) => ({ pop: 1, on: 0.15 + 0.85 * waveLit(NODES[i].x, NODES[i].y, 920, 540, r) });
  const st = (e) => { const [i, j] = EDGES[e], m = [(NODES[i].x + NODES[j].x) / 2, (NODES[i].y + NODES[j].y) / 2]; return { draw: 1, dark: 1 - waveLit(m[0], m[1], 920, 540, r) }; };
  const watch = at(tall() ? 960 : 1700, tall() ? 120 : 160, `${disc(0, 0, 80, P.cream, P.creamD, 0.08)}<path d="${rr(-14, -104, 28, 24, 6)}" fill="${P.steelD}"/><path d="M0 0L${(60 * Math.sin(a * 3)).toFixed(1)} ${(-60 * Math.cos(a * 3)).toFixed(1)}" stroke="${RED}" stroke-width="9" stroke-linecap="round"/><circle r="8" fill="${P.ink}"/>`, pop(a - 0.19));
  const g = sky(c, tot, 23) + layer(drawGrid(tot, st, lit), c) + watch;
  return { g, out: toScreen(c, 920, 540), outC: "#04121e", outZ: 10 };
}
// ---- 3: a heavy beam on posts; one lets go, the next buckles ----
// a thick timber post, base on y = 0, h tall; bend 0..1 buckles it (kinks sideways with a red crack), lean tilts it
export const post = (h = 300, bend = 0, lean = 0) => { const k = 34 * bend;
  return `<g transform="rotate(${lean.toFixed(2)})">${two(`M-30 0L${-30 + k} ${-h * 0.5}L-30 ${-h}H30L${30 + k} ${-h * 0.5}L30 0Z`, "#d8955e", "#a8693a", 8, 0)}<path d="${rr(-40, -h - 22, 80, 26, 8)}" fill="#7a4a2a"/><path d="${rr(-44, -8, 88, 16, 6)}" fill="#7a4a2a"/>
    ${bend > 0.2 ? `<path d="M${-30 + k - 6} ${-h * 0.5 - 30}l20 18l-16 14l22 20" fill="none" stroke="${RED}" stroke-width="8" stroke-linecap="round" opacity="${bend.toFixed(2)}"/>` : ""}</g>`; };
function d3(a, tot, s) {
  const T = tall(), N = 5, DX = T ? 190 : 300, X0 = 960 - 2 * DX, G = 860, H = 320;
  const c = camAt(a, [[0, 960, 640, T ? 1.0 : 1.18], [2.2, 960, 650, T ? 1.0 : 1.2], [6.66, 1000, 650, T ? 1.0 : 1.24]]);
  const gone = easeIn(seg(a, 1.9, 2.4)), b1 = ease(seg(a, 4.35, 5.1)), b2 = ease(seg(a, 6.02, 6.5));
  // the beam rests on the post tops; where posts are gone or bent it drops
  const top = (i) => i === 0 ? H - 150 * gone : i === 1 ? H - 70 * b1 : i === 2 ? H - 60 * b2 : H;
  const ys = Array.from({ length: N }, (_, i) => G - top(i) - 22);
  const beamY = (x) => { const u = (x - X0) / DX; if (u <= 0) return ys[0] + (u * (ys[1] - ys[0])); const i = Math.min(N - 2, Math.floor(u)); return lerp(ys[i], ys[i + 1], u - i); };
  let posts = ""; for (let i = 0; i < N; i++) { const x = X0 + i * DX, sx = i === 0 ? -420 * gone : 0, bend = i === 1 ? b1 : i === 2 ? b2 : 0, lean = i === 0 ? -18 * gone : 0;
    const strain = i === 1 ? seg(a, 2.38, 3.1) : i === 2 ? seg(a, 5.1, 5.6) : 0;
    posts += (strain > 0.05 && bend < 0.9 ? rings(x, G - top(i) - 10, 70, RED, 0.3 * strain, 1.5) : "") + at(x + sx, G, post(top(i), bend, lean), 1, 0, i === 0 ? `opacity="${(1 - seg(a, 2.7, 3.1)).toFixed(2)}"` : ""); }
  const x0 = X0 - 170, x1 = X0 + (N - 1) * DX + 170, y0 = beamY(x0), y1 = beamY(x1);
  const beam = `<path d="M${x0} ${y0 - 70}L${x1} ${y1 - 70}L${x1} ${y1}L${x0} ${y0}Z" fill="#6f7f98"/><path d="M${x0} ${y0 - 70}L${x1} ${y1 - 70}L${x1} ${y1 - 52}L${x0} ${y0 - 52}Z" fill="#aab4d4"/>`
    + Array.from({ length: 10 }, (_, i) => { const x = lerp(x0 + 50, x1 - 50, i / 9); return `<rect x="${x - 6}" y="${(beamY(x) - 64).toFixed(1)}" width="12" height="58" fill="#56657c"/>`; }).join("");
  const mx = X0 + 2 * DX, my = beamY(mx), weight = `<path d="M${mx - 150} ${my - 70}l30 -120h240l30 120Z" fill="#33445c"/><path d="M${mx - 110} ${my - 160}h220" stroke="#56657c" stroke-width="10"/>${text(mx, my - 98, "t", 70, "#aab4d4")}`;
  const g = sky(c, tot, 24) + layer(`<rect x="-1200" y="${G}" width="4400" height="1400" fill="${P.ground}"/>` + posts + beam + weight, c);
  return { g, out: toScreen(c, mx, my - 120), outC: "#33445c", outZ: 12 };
}
// ---- 4: a protection box on every line ----
// a box on a line (centre): a shield that lights (sh) and a switch blade that opens (op)
export const guard = (sh, op) => `${two(rr(-90, -80, 180, 160, 18), "#ece8ff", "#c6c0e6", 6, 6)}${sh > 0 ? rings(0, -20, 70, E.el, 0.3 * sh, 1.4) : ""}
  <path d="M0 -60L44 -46V-10Q44 24 0 44Q-44 24 -44 -10V-46Z" fill="${mix("#7f93b8", E.el, sh)}"/><path d="M-16 -8l12 14l24 -26" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="${sh.toFixed(2)}"/>
  <g transform="translate(-60 64) rotate(${(-38 * ease(op)).toFixed(2)})"><path d="${rr(-6, -7, 126, 14, 7)}" fill="${E.cu}"/></g><circle cx="-60" cy="64" r="10" fill="${P.ink}"/><circle cx="66" cy="64" r="10" fill="${P.ink}"/>`;
function d4(a, tot, s) {
  const T = tall(), W = T ? 640 : 1160, P0 = 960 - W / 2, G = 900, h = 600, tl = pylonTips(h), NS = 7;
  const c = camAt(a, [[0, 960, 560, T ? 1.0 : 1.35], [3.5, 960, 560, T ? 1.0 : 1.35], [5.75, 960, 580, T ? 0.95 : 1.1], [7.15, 960 + W * 1.2, 620, T ? 0.42 : 0.5]]);
  // spans: k = 0 is the one we watch; the others open in turn after 5.8
  let spans = "";
  for (let k = -1; k < NS; k++) { const xa = P0 + k * W, xb = xa + W, mid = (xa + xb) / 2, ya = G + tl[0][1] + 46, yb = G + tl[1][1] + 46;
    const sh = k === 0 ? seg(a, 2.76, 3.2) : seg(a, 5.8 + k * 0.18, 6.0 + k * 0.18), op = k === 0 ? seg(a, 5.34, 5.72) : k > 0 ? seg(a, 6.0 + k * 0.18, 6.2 + k * 0.18) : 0, live = 1 - op;
    spans += span([xa + tl[1][0], ya], [xb + tl[0][0], yb], 26, mix("#0f3047", E.el, live), 8);
    if (live > 0.05) spans += Array.from({ length: 5 }, (_, i) => { const q = ((a * 0.4 + i / 5 + k * 0.1) % 1); return `<circle cx="${lerp(xa + tl[1][0], xb + tl[0][0], q).toFixed(1)}" cy="${(ya + 52 * Math.sin(Math.PI * q)).toFixed(1)}" r="10" fill="${P.gold}" opacity="${live.toFixed(2)}"/>`; }).join("");
    if (k >= 0) spans += at(mid, ya + 120, guard(sh, op), k === 0 ? 1.15 * pop(a - 0.3) : 1.0); }
  let pyl = ""; for (let k = -1; k <= NS; k++) pyl += at(P0 + k * W, G, pylon(h));
  const fault = a > 1.55 && a < 3.2 ? rings(P0 + W * 0.18, G + tl[0][1] + 70, 40 + 30 * Math.sin(a * 20), RED, 0.45, 1.4) : "";
  const g = sky(c, tot, 25) + layer(`<rect x="-3000" y="${G}" width="12000" height="1400" fill="${P.ground}"/>` + pyl + spans + fault, c);
  return { g, out: toScreen(c, P0 + W / 2, G - h * 0.5), outC: "#04121e", outZ: 12 };
}

const SHOTS = [d0, d1, d2, d3, d4];
export const dominoSet = makeSet(SHOTS, V, P);
