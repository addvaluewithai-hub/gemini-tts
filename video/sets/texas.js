// "Texas" (electricity part 3 of 4): the grave passage. Still, cold and quiet: snow, dark windows, a clock, a number.
//   0 snow on a Texas town at night, Feb 2021; the station and the gas pipe frost over; every window's heater glows at once
//   1 the balance tips; blocks of the town are switched dark on purpose; 4,000,000+ homes
//   2 a clock stops at 4:37 before a red line; the 50 Hz needle trembles just above the red
//   3 a quiet dark card with 246, snow still falling; nothing else
// No people, no bodies, no suffering shown; the camera barely moves.
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./texas.v.js";
import { P, E, mix, house, pop, plate, tagV, station } from "./elec.js";
import { calPage } from "./props.js";
import { RED, sky, dial } from "./balance.js";

const SNOW = "#e8f4ff", ICE = "#bfe6ff", HEAT = "#ff8a3c";
// falling snow over the whole frame (screen space), gentle
export const snow = (tot, n = 90, w = FW, h = FH, seed = 5) => Array.from({ length: n }, (_, i) => { const sp = 30 + rnd(seed + i) * 50, x = (rnd(seed + i * 3) * (w + 200) + Math.sin(tot * 0.6 + i) * 30) % (w + 100) - 50, y = ((rnd(seed + i * 7) * h + tot * sp) % (h + 40)) - 20, r = 2 + rnd(seed + i * 11) * 5;
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${SNOW}" opacity="${(0.45 + 0.4 * rnd(seed + i * 13)).toFixed(2)}"/>`; }).join("");
// a snow-covered house: the elec house with a white roof cap and a window glow `heat` 0..1 (a heater), `off` 0..1 dark
const snowHouse = (i, heat, off) => { const c = i % 2 ? E.houseB : E.houseA, cD = i % 2 ? E.houseBD : E.houseAD, lit = off < 0.5;
  const glow = heat * (1 - off), base = house(mix(c, "#2a3a48", 0.35 + 0.4 * off), mix(cD, "#1a2833", 0.35 + 0.4 * off), { roof: E.roof, lit: [false, false, false] });
  const wins = [[-63, -115], [63, -115]].map(([x, y]) => `<rect x="${x - 25}" y="${y - 25}" width="50" height="50" rx="8" fill="${mix(P.ink, HEAT, glow)}"/>${glow > 0.05 ? rings(x, y, 34, HEAT, 0.25 * glow, 1.4) : ""}`).join("");
  return base + wins + `<path d="M-150 -166L0 -296L150 -166L130 -160L0 -272L-130 -160Z" fill="${SNOW}"/>`; };
const ground = (G) => `<rect x="-1200" y="${G}" width="4400" height="1400" fill="#2a4a5c"/><rect x="-1200" y="${G}" width="4400" height="26" fill="${SNOW}" opacity=".8"/>`;

// ---- 0: snow, Feb 2021, Texas; the station and the gas freeze; every heater on ----
function s0(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 900, 1.0], [10.4, 960, 880, 1.03]] : [[0, 960, 560, 1.0], [10.4, 960, 550, 1.04]]), G = v ? 1300 : 860;
  const HX = v ? [700, 1220, 700, 1220] : [980, 1260, 1540, 1820], HY = v ? [G, G, G - 380, G - 380] : [G, G, G, G];
  const heat = ease(seg(a, 9.49, 9.9)), frost = ease(seg(a, 5.67, 6.5)), gasF = ease(seg(a, 6.92, 7.5));
  const st = at(v ? 760 : 420, v ? G - 820 : G, station(tot, { lit: 1 - 0.5 * frost, smoke: frost < 0.4 }) + (frost > 0 ? `<path d="M-320 -296L0 -420L320 -296Z" fill="${ICE}" opacity="${(0.9 * frost).toFixed(2)}"/><path d="${rr(150, -575, 110, 30, 6)}" fill="${ICE}" opacity="${frost.toFixed(2)}"/>${[-210, -70, 70, 210].map((x) => `<path d="M${x - 44} -190A44 44 0 0 1 ${x + 44} -190" fill="none" stroke="${ICE}" stroke-width="10" opacity="${frost.toFixed(2)}"/>`).join("")}` : ""), v ? 0.55 : 0.62);
  const px = v ? 300 : 760, py = v ? G - 360 : G - 40;
  const pipe = at(px, py, `<path d="M-200 0H200" stroke="${mix("#c8a24a", ICE, gasF)}" stroke-width="40" stroke-linecap="round"/>${gasF > 0 ? `<path d="M-200 -16H200" stroke="${SNOW}" stroke-width="12" stroke-linecap="round" opacity="${gasF.toFixed(2)}"/>` : ""}
    <path d="${rr(-30, -90, 60, 70, 10)}" fill="${P.steelD}"/>${gasF < 1 ? `<path d="M0 -150Q-26 -116 0 -96Q26 -116 0 -150Z" fill="#5fb6ff" opacity="${(1 - gasF).toFixed(2)}"/>` : ""}`, pop(a - 6.6));
  const houses = HX.map((x, i) => at(x, HY[i], snowHouse(i, heat, 0), 0.72)).join("");
  const cal = a > 1.4 ? at(v ? 960 : 960, v ? 260 : 210, calPage("2021", "FEB", 0.8, 150), pop(a - 1.5)) : "";
  const pl = a > 4.6 ? at(v ? 960 : 1540, v ? 470 : 230, plate("TEXAS", 54), pop(a - 4.78)) : "";
  const g = sky(c, tot, 101) + layer(ground(G) + st + pipe + houses + cal + pl, c) + snow(tot, 90, FW, FH);
  return { g, out: toScreen(c, v ? 960 : 1260, v ? G - 120 : G - 120), outC: "#0a2433" };
}

// ---- 1: the balance tips; blocks switched dark on purpose; 4,000,000+ homes ----
const ROWS = (v) => (v ? [[300, 1050], [300, 1340], [300, 1630]] : [[180, 640], [180, 900]]);
function s1(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 960, 1.0], [7.33, 960, 960, 1.0]] : [[0, 960, 540, 1.0], [7.33, 960, 540, 1.02]]);
  const tip = ease(seg(a, 0.38, 0.9)), bx = v ? 960 : 960, by = v ? 330 : 190;
  const beam = at(bx, by, `<path d="M-30 120L0 0L30 120Z" fill="#7f93b8"/><g transform="rotate(${(-18 * tip).toFixed(1)})"><path d="M-260 0H260" stroke="${P.gold}" stroke-width="14" stroke-linecap="round"/><path d="${rr(-310, 20, 100, 40, 8)}" fill="${HEAT}"/><path d="${rr(210, 20, 100, 40, 8)}" fill="#7f93b8"/></g>${disc(0, 0, 16, P.gold, P.goldD)}`, 0.9 * pop(a - 0.1));
  const N = v ? 6 : 7, rows = ROWS(v), cut = (r, i) => clamp((a - 3.56 - (r * N + i) * 0.11) / 0.12);
  const town = rows.map(([x0, y], r) => Array.from({ length: N }, (_, i) => { const k = cut(r, i); return at(x0 + i * (v ? 120 : 260) + (v ? 0 : (r % 2) * 120), y, snowHouse(i + r, 1 - 0.0 * k, k), v ? 0.42 : 0.58); }).join("")).join("");
  const cnt = a > 5.4 ? at(v ? 960 : 960, v ? 650 : 400, tagV("4,000,000+", "", { size: v ? 96 : 104 }) + at(v ? 360 : 380, -10, house(E.houseA, E.houseAD, { roof: E.roof, lit: [0, 0, 0] }), 0.28), pop(a - 5.52)) : "";
  const g = sky(c, tot, 103) + layer(`<rect x="-1200" y="${v ? 1700 : 960}" width="4400" height="900" fill="#2a4a5c"/>` + beam + town + cnt, c) + snow(tot, 70, FW, FH, 9);
  return { g, in: toScreen(c, 960, v ? 1100 : 700), inC: "#0a2433", out: toScreen(c, 960, v ? 1100 : 700), outC: "#04121e" };
}

// ---- 2: 4:37 from collapse; the needle just above red ----
function s2(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 960, 1.0], [7.61, 960, 960, 1.02]] : [[0, 960, 540, 1.0], [7.61, 960, 540, 1.02]]);
  const run = ease(seg(a, 1.85, 3.59)), secs = Math.round(lerp(600, 277, run)), mm = Math.floor(secs / 60), ss = String(secs % 60).padStart(2, "0");
  const cx = v ? 960 : 700, cy = v ? 600 : 520;
  const clock = at(cx, cy, `${two(rr(-330, -150, 660, 300, 40), "#0f2a3a", "#071c28", 0, 10)}<path d="${rr(-290, -110, 580, 220, 26)}" fill="#04121e"/>${text(0, 70, `${mm}:${ss}`, 200, a > 3.59 ? RED : E.el)}`, pop(a - 0.2));
  const line = `<path d="M${cx - 360} ${cy + 230}H${cx + 360}" stroke="${RED}" stroke-width="10" stroke-dasharray="26 18" opacity="${(0.8 * clamp(a - 2.5)).toFixed(2)}"/>`;
  const f = 49.62 + 0.06 * Math.sin(tot * 9) * clamp(a - 4.3), dl = a > 4.1 ? at(v ? 960 : 1420, v ? 1250 : 560, dial(f, { red: 0.8 }), (v ? 0.95 : 0.85) * pop(a - 4.24)) : "";
  const g = sky(c, tot, 105) + layer(clock + line + dl, c) + snow(tot, 50, FW, FH, 13);
  return { g, in: toScreen(c, cx, cy), inC: "#04121e", out: toScreen(c, cx, cy), outC: "#04121e" };
}

// ---- 3: 246 ----
function s3(a, tot, s, o = {}) {
  const v = !!o.vert, c = { x: 960, y: v ? 960 : 540, z: 1 };
  const k = ease(seg(a, 1.5, 2.3)), n = at(960, v ? 1000 : 600, text(0, 0, "246", 240, mix("#04121e", "#e8f4ff", k)), 1);
  const g = `<rect width="${FW}" height="${FH}" fill="#04121e"/>` + layer(n, c) + snow(tot, 60, FW, FH, 17);
  return { g, in: [FW / 2, FH / 2], inC: "#04121e" };
}

const SHOTS = [s0, s1, s2, s3];
export { s0, s1, s2, s3 };
export const texasSet = makeSet(SHOTS, V, P);
