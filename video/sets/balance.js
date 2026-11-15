// "The balance" (electricity part 2 of 4): supply must equal demand every second, kept by one number, the frequency.
//   0 a balance: stations on one pan, the town's lit windows on the other, kept level tick by tick; nothing is stored
//   1 the frequency dial at 50; a generator wheel turning; 50 Hz for most of the planet, 60 Hz for North America
//   2 more windows light, the wheel slows, the needle dips; a signal orders a station up; the needle comes back
//   3 a control room at night: screens, empty chairs, the 50 in the middle, 24 h (host right)
//   4 the heavy steel rotor keeps spinning when a station drops out, holding the needle up for a few seconds
//   5 a big station falls dark, the needle falls fast; districts switch off on purpose and the fall stops
//   6 the needle, huge, trembling at 50; 49 is red (host left)
//   7 a lit pitch at night, 1990, ENG and GER, the ball on the penalty spot
//   8 the whistle; across a sea of houses every kitchen light and kettle comes on at once
//   9 the demand line shoots up: +2,800 MW, two power stations' worth; a record
//  10 the control room's TV schedule, the clock reaching the hour, a station on standby comes in on the second (host right)
// No people anywhere: the control room has screens and empty chairs, the pitch has a ball and no players.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./balance.v.js";
import { P, E, mix, house, stars, skyline, pop, station, kettle, plate, tagV, flag } from "./elec.js";
import { calPage } from "./props.js";

const RED = "#ff4d5a";
const bump = (a, t0, amt = 0.12) => (a > t0 ? 1 + amt * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 14) : 1);
const sky = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 2900, 760, tot), c, 0.12);
const ground = (G, c) => layer(`<rect x="-1200" y="${G}" width="4400" height="1400" fill="${P.ground}"/>`, c);

// ---- the frequency dial (centre): f in Hz; 49 to 51 across the arc ----
export const dial = (f, o = {}) => { const R = o.r || 260, ang = (v) => clamp((v - 50) * 60, -66, 66) * Math.PI / 180, red = o.red || 0;
  const tick = (v, L, w, col) => { const q = ang(v); return `<path d="M${(R * 0.78 * Math.sin(q)).toFixed(1)} ${(-R * 0.78 * Math.cos(q)).toFixed(1)}L${((R * 0.78 - L) * Math.sin(q)).toFixed(1)} ${(-(R * 0.78 - L) * Math.cos(q)).toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`; };
  const lab = (v, s, col) => { const q = ang(v); return text((R * 0.5 * Math.sin(q)).toFixed(1), (-R * 0.5 * Math.cos(q) + s * 0.35).toFixed(1), String(v), s, col); };
  const q = ang(f), nl = R * 0.74;
  return `${rings(0, 0, R * 1.05, o.glow || P.gold, 0.12 * (o.lit ?? 1), 1.3)}${disc(0, 0, R, P.steel, P.steelD, 0.06)}<circle r="${R * 0.88}" fill="${P.cream}"/>
    <path d="M${-R * 0.78 * Math.sin(66 * Math.PI / 180)} ${-R * 0.78 * Math.cos(66 * Math.PI / 180)}A${R * 0.78} ${R * 0.78} 0 0 1 ${-R * 0.78 * Math.sin(30 * Math.PI / 180)} ${-R * 0.78 * Math.cos(30 * Math.PI / 180)}" fill="none" stroke="${mix("#f2b8bd", RED, red)}" stroke-width="${R * 0.07}"/>
    ${[49, 49.5, 50, 50.5, 51].map((v) => tick(v, v === 50 ? R * 0.16 : R * 0.1, v === 50 ? R * 0.035 : R * 0.025, v === 49 ? mix(P.ink, RED, 0.4 + 0.6 * red) : P.ink)).join("")}
    ${lab(49, R * 0.17, mix(P.ink, RED, 0.5 + 0.5 * red))}${lab(50, R * 0.2, P.ink)}${lab(51, R * 0.17, P.ink)}${text(0, R * 0.42, "Hz", R * 0.16, P.steelD)}
    <path d="M0 0L${(nl * Math.sin(q)).toFixed(1)} ${(-nl * Math.cos(q)).toFixed(1)}" stroke="${RED}" stroke-width="${R * 0.05}" stroke-linecap="round"/>${disc(0, 0, R * 0.08, P.ink, "#020c16")}`; };
// a generator wheel seen face on (centre), r; spin in radians
export const rotor = (r, spin, o = {}) => `${disc(0, 0, r, o.c || "#7f93b8", o.cD || "#5f7299", 0.08)}<circle r="${r * 0.78}" fill="none" stroke="${o.cD || "#5f7299"}" stroke-width="${r * 0.06}"/>
  <g transform="rotate(${(spin * 180 / Math.PI).toFixed(2)})">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="${rr(-r * 0.07, -r * 0.74, r * 0.14, r * 0.74, r * 0.05)}" fill="${o.spoke || "#aab4d4"}" transform="rotate(${i * 60})"/>`).join("")}
  <circle cx="0" cy="${-r * 0.62}" r="${r * 0.08}" fill="${P.gold}"/></g>${disc(0, 0, r * 0.2, P.steel, P.steelD)}`;
// motion lines round a spinning wheel
const whoosh = (r, spin, p = 1) => p <= 0 ? "" : [0, 1, 2].map((i) => { const a0 = spin + i * 2.09, a1 = a0 + 0.9; return `<path d="M${(r * 1.18 * Math.cos(a0)).toFixed(1)} ${(r * 1.18 * Math.sin(a0)).toFixed(1)}A${r * 1.18} ${r * 1.18} 0 0 1 ${(r * 1.18 * Math.cos(a1)).toFixed(1)} ${(r * 1.18 * Math.sin(a1)).toFixed(1)}" fill="none" stroke="${E.el}" stroke-width="${r * 0.05}" stroke-linecap="round" opacity="${(0.6 * p).toFixed(2)}"/>`; }).join("");
// a row of little houses with `lit` share of windows lit (deterministic per window)
export const homes = (x0, n, G, lit, seed = 3, k = 0.42) => Array.from({ length: n }, (_, i) => { const on = (j) => rnd(seed + i * 7 + j) < lit; const cA = i % 2 ? E.houseB : E.houseA, cD = i % 2 ? E.houseBD : E.houseAD;
  return at(x0 + i * 230 * k / 0.42, G, house(cA, cD, { roof: E.roof, lit: [on(0), on(1), on(2)] }), k); }).join("");
// a stopwatch (centre), hand at turn p
const stopwatch = (p, r = 70) => `${disc(0, 0, r, P.cream, P.creamD, 0.08)}<path d="${rr(-r * 0.18, -r * 1.32, r * 0.36, r * 0.3, 6)}" fill="${P.steelD}"/><path d="M0 0L${(r * 0.75 * Math.sin(p * 2 * Math.PI)).toFixed(1)} ${(-r * 0.75 * Math.cos(p * 2 * Math.PI)).toFixed(1)}" stroke="${RED}" stroke-width="${r * 0.1}" stroke-linecap="round"/><circle r="${r * 0.1}" fill="${P.ink}"/>`;
// an empty office chair seen from the side, base on y = 0
const chair = () => `<path d="M-50 0L0 -30L50 0" fill="none" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/><rect x="-6" y="-90" width="12" height="62" fill="${P.ink}"/>${two(rr(-70, -110, 140, 30, 12), "#1f5a72", "#174a5e", 0, 6)}${two(rr(36, -230, 34, 150, 14), "#1f5a72", "#174a5e", 6, 0)}`;
// a screen (centre) w x h with a little live trace
const screen = (w, h, t, seed, on = 1, inner = "") => { let d = ""; for (let i = 0; i <= 24; i++) { const x = -w / 2 + 20 + (i / 24) * (w - 40), y = Math.sin(t * 2 + i * 0.7 + seed) * h * 0.12 + (rnd(seed + i) - 0.5) * h * 0.18; d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }
  return `${two(rr(-w / 2 - 12, -h / 2 - 12, w + 24, h + 24, 14), "#123a57", "#0a2a3c", 0, 6)}<path d="${rr(-w / 2, -h / 2, w, h, 8)}" fill="${mix("#04121e", "#0b3346", on)}"/>${on > 0 ? `<path d="${d}" fill="none" stroke="${E.el}" stroke-width="5" opacity="${on.toFixed(2)}"/>` : ""}${inner}`; };
// a station that can be dark (lit 0) with a red cross
const plant = (tot, lit, smoke = true) => station(tot, { lit, smoke: smoke && lit > 0.5 });
// a little signal flying from (x0,y0) to (x1,y1): p 0..1
const signal = (x0, y0, x1, y1, p) => p <= 0 || p >= 1 ? "" : (() => { const x = lerp(x0, x1, p), y = lerp(y0, y1, p) - Math.sin(Math.PI * p) * 160; return rings(x, y, 34, P.gold, 0.35, 1.5) + `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" fill="#fff3b0"/>`; })();
// a simple flag: ENG (white, red cross) or GER (black, red, gold)
export const flagFB = (kind, w = 200) => kind === "de" ? flag("de", w) : (() => { const h = w * 2 / 3, x = -w / 2, y = -h / 2; return `<path d="${rr(x, y, w, h, 10)}" fill="#fff4dc"/><rect x="${x}" y="${-h * 0.1}" width="${w}" height="${h * 0.2}" fill="${RED}"/><rect x="${-w * 0.1 * 0.67}" y="${y}" width="${w * 0.2 * 0.67}" height="${h}" fill="${RED}"/><path d="${rr(x, y, w, h, 10)}" fill="none" stroke="${P.ink}" stroke-width="5" opacity=".4"/>`; })();

// ---- 0: a balance kept level every second ----
export function s0(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 600, 1.22], [3.0, 960, 580, 1.1], [7.54, 960, 570, 1.07]]), X = o.cx || 960, PY = 560, BW = o.bw || 520;
  const wob = 5 * Math.sin(a * 5) * Math.exp(-Math.max(0, a - 5.6) * 3) * clamp(a - 3.4) + 7 * Math.exp(-Math.max(0, a - 6.33) * 4) * Math.sin(Math.max(0, a - 6.33) * 18) * (a > 6.33 ? 1 : 0);
  const tilt = (a < 3.4 ? lerp(8, 0, ease(seg(a, 0.2, 1.4))) : 0) + wob, rad = tilt * Math.PI / 180;
  const L = [X - BW * Math.cos(rad), PY - BW * Math.sin(rad)], Rr = [X + BW * Math.cos(rad), PY + BW * Math.sin(rad)];
  const pan = (p, inner, glow) => `<path d="M${p[0] - 150} ${p[1] + 120}L${p[0]} ${p[1]}L${p[0] + 150} ${p[1] + 120}" fill="none" stroke="${P.steelD}" stroke-width="6"/>${glow > 0 ? rings(p[0], p[1] + 70, 190, P.gold, 0.22 * glow, 1.4) : ""}${at(p[0], p[1] + 130, inner)}<path d="${rr(p[0] - 180, p[1] + 124, 360, 22, 10)}" fill="${P.steel}"/>`;
  const sGlow = seg(a, 3.52, 3.9) * (1 - seg(a, 5.5, 6)), hGlow = seg(a, 5.63, 6.0);
  const plants = at(-60, 0, plant(tot, 1), 0.36) + at(110, 0, plant(tot + 1, 1), 0.26);
  const town = at(-80, 0, house(E.houseA, E.houseAD, { roof: E.roof, lit: [hGlow > 0.3, hGlow > 0.6, 1] }), 0.5) + at(85, 0, house(E.houseB, E.houseBD, { roof: E.roof, lit: [hGlow > 0.5, 1, hGlow > 0.8] }), 0.42);
  const beam = `<path d="M${X} ${PY + 30}L${X - 70} 900H${X + 70}Z" fill="${P.steelD}"/><path d="${rr(X - 170, 892, 340, 30, 12)}" fill="${P.steel}"/><path d="M${L[0]} ${L[1]}L${Rr[0]} ${Rr[1]}" stroke="${P.gold}" stroke-width="22" stroke-linecap="round"/>${disc(X, PY, 30, P.gold, P.goldD)}`;
  const balance = at(0, 0, beam + pan(L, plants, sGlow) + pan(Rr, town, hGlow), pop(a - 0.05, 7, 12) > 0 ? 1 : 0);
  // nothing is stored: a crossed-out store
  const store = a > 1.97 && a < 3.4 ? at(X, 250, `${two(rr(-120, -90, 240, 180, 16), "#123a57", "#0a2a3c", 0, 8)}<path d="M-120 -90L0 -150L120 -90Z" fill="#0a2a3c"/>` + cross(0, 0, 70, RED, a - 2.4), pop(a - 1.97) * (1 - seg(a, 3.1, 3.4))) : "";
  const watch = a > 6.2 ? at(X, 230, stopwatch((a - 6.33) % 1), pop(a - 6.2)) : "";
  const g = sky(c, tot, 41) + ground(900, c) + layer(balance + store + watch, c);
  return { g, out: toScreen(c, X, PY), outC: P.gold, outZ: 16 };
}
// ---- 1: the number that tells: frequency, 50 or 60 ----
export function s1(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 540, 1.05], [7.39, 960, 540, 1.0]]), DX = o.dx ?? 760, DY = o.dy ?? 520;
  const d = at(DX, DY, dial(50 + 0.01 * Math.sin(tot * 3)), 1.05 * pop(a - 0.1) * bump(a, 2.45, 0.08));
  const RX = o.rx ?? 1340, RY = o.ry ?? 420, spin = tot * 2 * Math.PI * 0.8;
  const wheel = a > 3.0 ? at(RX, RY, rotor(170, spin) + whoosh(170, spin, 1), pop(a - 3.26)) + at(RX, RY + 250, text(0, 0, "↻ / s", 64, E.el), pop(a - 3.83)) : "";
  const t50 = a > 4.6 ? at(o.t50x ?? 1220, o.t50y ?? 840, tagV("50", "Hz", { size: 90 }), pop(a - 4.73) * bump(a, 4.73)) : "";
  const t60 = a > 5.9 ? at(o.t60x ?? 1640, o.t60y ?? 840, `${at(0, -150, flag("us", 170))}${tagV("60", "Hz", { size: 74, fill: E.el })}`, pop(a - 6.01)) : "";
  const g = sky(c, tot, 43) + layer(d + wheel + t50 + t60, c);
  return { g, in: toScreen(c, DX, DY), inC: P.gold, out: toScreen(c, DX, DY), outC: P.cream };
}
// ---- 2: demand up, frequency down, a station adds, frequency back ----
export function s2(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 540, 1.0], [9.76, 960, 540, 1.03]]), G = 960;
  const demand = ease(seg(a, 0.61, 1.5)), slow = ease(seg(a, 1.5, 3.4)) * (1 - ease(seg(a, 6.1, 7.2))), f = 50 - 0.42 * ease(seg(a, 3.0, 4.0)) * (1 - ease(seg(a, 6.5, 7.1)));
  const spinRate = lerp(1, 0.35, slow), spin = tot * 2 * Math.PI * 0.8 * spinRate;
  const DX = o.dx ?? 520, DY = o.dy ?? 420, WX = o.wx ?? 1380, WY = o.wy ?? 360;
  const d = at(DX, DY, dial(f, { red: seg(a, 3.6, 4.0) * (1 - seg(a, 6.6, 7.0)) }), 0.85);
  const wheel = at(WX, WY, rotor(150, spin) + whoosh(150, spin, lerp(1, 0.2, slow)), 1) + (slow > 0.1 ? at(WX, WY - 220, `<path d="M-40 -20L40 -20L0 40Z" fill="${RED}"/>`, slow) : "");
  const order = signal(o.ccx ?? 960, o.ccy ?? 150, WX - 180, WY + 340, seg(a, 5.46, 6.1));
  const plantLit = 0.6 + 0.4 * seg(a, 6.0, 6.4);
  const st = at(WX - 180, WY + 470, plant(tot, plantLit), 0.44 * bump(a, 6.1, 0.1)) + (a > 6.1 ? rings(WX - 180, WY + 400, 120, P.gold, 0.3 * (1 - seg(a, 6.1, 7.4)), 1.5) : "");
  const cc = at(o.ccx ?? 960, o.ccy ?? 150, screen(160, 90, tot, 3, 1, text(0, 22, "50", 56, P.gold)), pop(a - 4.63) * (1 - seg(a, 7.4, 7.8)));
  const town = homes(o.hx ?? 40, o.hn ?? 6, G, 0.35 + 0.6 * demand, 21, 0.62);
  const g = sky(c, tot, 47) + ground(G, c) + layer(town + st + wheel + d + order + cc, c);
  return { g, in: toScreen(c, DX, DY), inC: P.cream, out: toScreen(c, DX, DY), outC: P.cream };
}
// ---- 3: the control room ----
export function s3(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 820, 480, 1.15], [3.0, 900, 540, 1.0], [9.06, 900, 520, 0.96]]), G = 900;
  const wall = `<rect x="-800" y="-400" width="3600" height="${G + 400}" fill="#0a2536"/><rect x="-800" y="${G}" width="3600" height="600" fill="#061a28"/>`;
  const on = (i) => seg(a, 2.91 + i * 0.08, 3.2 + i * 0.08);
  const scr = [[200, 300], [540, 300], [1080, 300], [1400, 300], [200, 560], [540, 560], [1080, 560]].map(([x, y], i) => at(x, y, screen(300, 190, tot, i * 3, on(i)))).join("");
  const big = at(810, 420, screen(400, 300, tot, 9, on(3), text(0, 70, "50", 220, mix(P.gold, "#fff3b0", 0.5 + 0.5 * Math.sin(tot * 3)))), bump(a, 6.22, 0.1)) + (a > 6.22 ? rings(810, 420, 280, P.gold, 0.2 * seg(a, 6.22, 6.6), 1.3) : "");
  const desk = `<path d="${rr(60, 760, 1380, 40, 10)}" fill="${P.wood}"/><path d="${rr(80, 800, 1340, 100, 0)}" fill="${P.woodD}"/>` + [260, 600, 960, 1280].map((x) => at(x, G, chair())).join("") + [300, 640, 1000, 1320].map((x) => `<path d="${rr(x - 50, 720, 100, 40, 6)}" fill="#123a57"/>`).join("");
  const clk = a > 3.1 ? at(1440, 150, `${disc(0, 0, 80, P.cream, P.creamD, 0.08)}<path d="M0 0L0 -56M0 0L${(46 * Math.sin(tot)).toFixed(1)} ${(-46 * Math.cos(tot)).toFixed(1)}" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/>` + at(0, 150, tagV("24", "h", { size: 64 })), pop(a - 3.25)) : "";
  const g = layer(wall + scr + big + desk + clk, c);
  return { g, in: toScreen(c, 810, 420), inC: P.gold, out: toScreen(c, 810, 420), outC: "#0b3346" };
}
// ---- 4: spinning iron buys time ----
export function s4(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 540, 1.2], [3.6, 960, 540, 1.0], [8.55, 980, 540, 0.96]]), RX = o.rx ?? 760, RY = o.ry ?? 520;
  const fault = seg(a, 4.83, 5.2), decay = a > 4.83 ? Math.exp(-(a - 4.83) * 0.12) : 1, spin = tot * 2 * Math.PI * 0.6 * decay;
  const iron = at(RX, RY, rotor(300, spin, { c: "#6f7f9a", cD: "#4f5c75", spoke: "#9aa6c4" }) + whoosh(300, spin, 1), pop(a - 0.05, 7, 12) * bump(a, 3.55, 0.06));
  const tons = a > 2.2 ? at(RX - 360, RY + 300, `${two("M-110 0L-80 -150H80L110 0Z", "#4f5c75", "#3c475d", 0, 8)}${text(0, -40, "100s t", 50, P.cream)}`, pop(a - 2.35)) : "";
  const f = 50 - 0.35 * seg(a, 5.0, 8.5);
  const DX = o.dx ?? 1440, DY = o.dy ?? 320;
  const d = a > 4.3 ? at(DX, DY, dial(f), 0.55 * pop(a - 4.3)) : "";
  const st = a > 4.3 ? at(DX, DY + 430, plant(tot, 1 - fault) + (fault > 0 ? cross(0, -150, 70, RED, a - 4.9) : ""), 0.34 * pop(a - 4.3)) : "";
  const sw = a > 6.9 ? at(DX - 260, DY + 40, stopwatch(clamp((a - 7.11) / 1.4)), 0.8 * pop(a - 7.0)) : "";
  const g = sky(c, tot, 53) + ground(940, c) + layer(iron + tons + d + st + sw, c);
  return { g, in: toScreen(c, RX, RY), inC: "#6f7f9a", out: toScreen(c, DX, DY), outC: P.cream };
}
// ---- 5: shed a part so the whole stays up ----
export function s5(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 520, 1.0], [6.56, 960, 520, 1.04]]);
  const fall = seg(a, 0.8, 1.2), f = 50 - 0.9 * ease(seg(a, 1.66, 3.0)) * (1 - 0.15 * seg(a, 5.4, 6.2));
  const shed = (i) => seg(a, 3.2 + i * 0.3, 3.4 + i * 0.3);
  // the town from above: blocks of lit windows
  const B = [[300, 360], [620, 360], [940, 360], [300, 620], [620, 620], [940, 620], [300, 880], [620, 880], [940, 880]], dark = { 2: 0, 6: 1 };
  const blocks = B.map(([x, y], i) => { const off = i in dark ? shed(dark[i]) : 0; let w = ""; for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) w += `<rect x="${x - 110 + q * 56}" y="${y - 80 + r * 56}" width="40" height="40" rx="6" fill="${mix(P.win, "#0a2536", off * (0.7 + 0.3 * rnd(i * 13 + r * 4 + q)))}"/>`;
    return `<path d="${rr(x - 130, y - 100, 260, 200, 16)}" fill="${mix("#1b4e66", "#0d2a3a", off)}"/>${w}${off > 0.5 ? cross(x, y, 44, "#5f7299", (off - 0.5) * 2) : ""}`; }).join("");
  const roads = `<rect x="140" y="220" width="960" height="820" fill="#082a3a"/>`;
  const st = at(1360, 900, plant(tot, 1 - fall) + (fall > 0 ? cross(0, -170, 80, RED, a - 1.0) : ""), 0.55);
  const d = at(1520, 330, dial(f, { red: seg(a, 2.0, 2.4) * (1 - seg(a, 5.4, 6.0)) }), 0.72 * pop(a - 0.3));
  const glow = a > 5.41 ? rings(620, 620, 520, P.gold, 0.12 * seg(a, 5.41, 5.9), 1.15) : "";
  const g = sky(c, tot, 59) + layer(roads + blocks + glow + st + d, c);
  return { g, in: toScreen(c, 620, 620), inC: "#0d2a3a", out: toScreen(c, 1520, 330), outC: P.cream };
}
// ---- 6: everything rests on one number (host left) ----
export function s6(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 1020, 560, 1.0], [4.91, 1020, 560, 1.06]]), X = o.x ?? 1100, Y = o.y ?? 560;
  const red = seg(a, 3.85, 4.2), tremble = 0.04 * Math.sin(tot * 23) + 0.02 * Math.sin(tot * 37);
  const d = at(X, Y, dial(50 + tremble - 0.12 * red * Math.sin(tot * 9), { r: 400, red, glow: red > 0.5 ? RED : P.gold }), pop(a - 0.05, 7, 12) * bump(a, 3.33, 0.05));
  const no = red > 0 ? cross(X - 360, Y - 190, 60, RED, a - 4.23) : "";
  const g = sky(c, tot, 61) + layer(d + no, c);
  return { g, in: toScreen(c, X, Y), inC: P.cream, out: toScreen(c, X, Y + 400), outC: "#0b4152" };
}
// ---- 7: the pitch, 1990, ENG v GER, penalties ----
export function s7(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 500, 0.92], [4.6, 960, 560, 1.05], [6.06, 960, 620, 1.25]]);
  const pitch = `<path d="M260 980L560 470H1360L1660 980Z" fill="#1f8a55"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${lerp(260, 560, 0) + 0} 0" />`).join("")}
    ${[0, 1, 2, 3, 4, 5].map((i) => { const y0 = lerp(470, 980, i / 6), y1 = lerp(470, 980, (i + 1) / 6), xl0 = lerp(560, 260, i / 6), xl1 = lerp(560, 260, (i + 1) / 6); return i % 2 ? `<path d="M${xl0} ${y0}L${1920 - xl0} ${y0}L${1920 - xl1} ${y1}L${xl1} ${y1}Z" fill="#1a7a4b"/>` : ""; }).join("")}
    <path d="M560 470H1360L1660 980H260Z" fill="none" stroke="#e8fff2" stroke-width="6"/><path d="M760 470L720 600H1200L1160 470" fill="none" stroke="#e8fff2" stroke-width="6"/>
    <path d="${rr(860, 410, 200, 60, 4)}" fill="none" stroke="#fff" stroke-width="10"/><path d="M860 410L870 470M1060 410L1050 470" stroke="#cfe" stroke-width="4"/>`;
  const spot = a > 4.67 ? rings(960, 650, 70, "#fff3b0", 0.4 * seg(a, 4.67, 5.0), 1.6) : "";
  const ball = at(960, 650, `${disc(0, 0, 26, "#fff", "#cfd6e6")}<path d="M-8 -8l10 -4l8 8l-4 10l-10 0Z" fill="${P.ink}"/>`, 1 + 0.15 * seg(a, 4.67, 5.0));
  const lights = [[200, 160], [1720, 160]].map(([x, y]) => `<path d="M${x} ${y}V700" stroke="#3a5a6e" stroke-width="16"/>${rings(x, y, 70, "#fff8d8", 0.35, 1.8)}<path d="${rr(x - 60, y - 30, 120, 60, 10)}" fill="#fff8d8"/>`).join("");
  const stands = `<path d="M-200 420Q960 300 2120 420V1200H-200Z" fill="#0d2f42"/>${Array.from({ length: 60 }, (_, i) => `<circle cx="${-150 + i * 40}" cy="${380 + 20 * Math.sin(i)}" r="6" fill="${P.win}" opacity="${(0.3 + 0.5 * rnd(i)).toFixed(2)}"/>`).join("")}`;
  const cal = at(240, 210, calPage("1990", "", 0.9, 150), pop(a - 1.23));
  const fl = at(720, 230, flagFB("en", 190), pop(a - 2.55)) + at(1200, 230, flagFB("de", 190), pop(a - 3.38)) + (a > 3.38 ? text(960, 252, "v", 70, P.cream, { opacity: pop(a - 3.38).toFixed(2) }) : "");
  const g = sky(c, tot, 67) + layer(stands, c, 0.8) + layer(pitch + lights + spot + ball + cal + fl, c);
  return { g, out: toScreen(c, 960, 650), outC: "#fff8d8" };
}
// ---- 8: the whistle, and a whole country puts the kettle on ----
export function s8(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 540, 1.1], [1.2, 960, 560, 0.95], [3.85, 960, 560, 0.9]]);
  const whistle = a < 1.1 ? at(960, 420, `${two("M-120 -40H60Q110 -40 110 10Q110 60 60 60H-30L-120 20Z", P.steel, P.steelD, 0, 8)}<circle cx="40" cy="10" r="26" fill="${P.ink}"/>` + [0, 1, 2].map((i) => `<path d="M${130 + i * 30} ${-40 - i * 20}q20 -10 30 0" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`).join(""), pop(a + 0.1) * (1 - seg(a, 0.8, 1.1))) : "";
  const lit = seg(a, 1.74, 1.9), kOn = seg(a, 2.94, 3.1);
  let rows = ""; for (let r = 0; r < 2; r++) { const G = 640 + r * 330, k = 0.6 + r * 0.14; for (let i = 0; i < 6; i++) { const x = 60 + i * 360 + (r % 2) * 170; rows += at(x, G, house(i % 2 ? E.houseB : E.houseA, i % 2 ? E.houseBD : E.houseAD, { roof: E.roof, lit: [lit > 0, lit > 0, lit > 0] }), k);
      if (kOn > 0) rows += at(x + 150 * k / 0.6, G, kettle(tot + i + r, 1), 0.46 * k / 0.6 * pop(a - 2.94 - (i + r) * 0.02)); } }
  const g = sky(c, tot, 71) + layer(`<rect x="-800" y="640" width="3600" height="1000" fill="${P.ground}"/>` + rows + whistle, c);
  return { g, in: toScreen(c, 960, 420), inC: "#fff8d8" };
}
// ---- 9: the demand line jumps: +2,800 MW, two stations' worth; a record ----
export function s9(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 540, 1.0], [5.52, 960, 540, 1.04]]), X0 = o.x0 ?? 220, X1 = o.x1 ?? 1260, Y0 = o.y0 ?? 760;
  const jump = ease(seg(a, 0.38, 1.6)), pts = []; for (let i = 0; i <= 60; i++) { const q = i / 60, x = lerp(X0, X1, q), y = Y0 - 40 * Math.sin(q * 9) * 0.3 - (q > 0.55 ? 360 * jump * ease(clamp((q - 0.55) / 0.12)) : 0); pts.push(x.toFixed(1) + " " + y.toFixed(1)); }
  const axes = `<path d="M${X0} ${Y0 - 520}V${Y0 + 60}H${X1 + 40}" fill="none" stroke="${P.steelD}" stroke-width="8"/>`;
  const line = drawn("M" + pts.join("L"), clamp(0.55 + 0.45 * seg(a, 0.0, 1.6)), P.gold, 12);
  const tg = a > 0.6 ? at(o.tx ?? 1000, o.ty ?? 230, tagV("+2,800", "MW", { size: 100 }), pop(a - 0.6) * bump(a, 4.54, 0.1)) : "";
  const two_ = a > 2.5 ? [0, 1].map((i) => at((o.sx ?? 1380) + i * 320, o.sy ?? 900, plant(tot + i, 1), 0.5 * pop(a - 2.65 - i * 0.2))).join("") + at((o.sx ?? 1380) + 160, (o.sy ?? 900) - 330, text(0, 0, "= 2", 80, P.cream), pop(a - 3.0)) : "";
  const record = a > 4.4 ? rings(o.tx ?? 1000, o.ty ?? 230, 260, P.gold, 0.3 * seg(a, 4.54, 4.9), 1.25) + at((o.tx ?? 1000) + 300, (o.ty ?? 230) - 70, `<path d="M0 -40L12 -12L42 -10L18 8L26 38L0 22L-26 38L-18 8L-42 -10L-12 -12Z" fill="${P.gold}"/>`, pop(a - 4.54)) : "";
  const g = sky(c, tot, 73) + layer(axes + line + tg + two_ + record, c);
  return { g, out: toScreen(c, o.tx ?? 1000, o.ty ?? 230), outC: P.ink };
}
// ---- 10: the TV schedule; a station comes in on the second (host right) ----
export function s10(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 860, 540, 1.0], [7.46, 820, 540, 1.04]]), G = 900;
  const wall = `<rect x="-800" y="-400" width="3600" height="${G + 400}" fill="#0a2536"/><rect x="-800" y="${G}" width="3600" height="600" fill="#061a28"/>`;
  const sched = at(o.scx ?? 430, o.scy ?? 440, `${two(rr(-230, -300, 460, 600, 18), P.cream, P.creamD, 0, 8)}<path d="M-230 -300h460v90h-460Z" fill="${RED}"/><rect x="-150" y="-275" width="300" height="40" rx="10" fill="#fff" opacity=".85"/>
    ${[0, 1, 2, 3, 4].map((i) => `${text(-150, -130 + i * 95, ["19:00", "20:00", "21:00", "21:30", "22:00"][i], 44, P.ink)}<path d="${rr(-60, -160 + i * 95, 230, 34, 10)}" fill="${i === 2 ? P.gold : "#d9c9a6"}"/>`).join("")}`, pop(a - 2.38));
  const tvOn = seg(a, 3.88, 4.1), tv = at(o.tvx ?? 1000, o.tvy ?? 400, `${two(rr(-200, -140, 400, 280, 20), "#123a57", "#0a2a3c", 0, 8)}<path d="${rr(-180, -120, 360, 240, 10)}" fill="${mix("#04121e", "#1f6f8a", tvOn)}"/>${tvOn > 0 ? `<circle cx="0" cy="-10" r="60" fill="#ffd27a" opacity="${(0.6 * tvOn).toFixed(2)}"/><path d="${rr(-150, 80, 300, 14, 7)}" fill="#0a2a3c"/><path d="${rr(-150, 80, 300 * clamp((a - 3.9) / 3.2), 14, 7)}" fill="${RED}"/>` : ""}<path d="M-60 140L-90 190M60 140L90 190" stroke="${P.ink}" stroke-width="12"/>`, 1.45 * pop(a - 3.7));
  const sec = clamp((a - 4.78) / (7.08 - 4.78)), hand = lerp(0.82, 1, sec);
  const clk = a > 4.5 ? at(o.ckx ?? 1420, o.cky ?? 220, `${disc(0, 0, 120, P.cream, P.creamD, 0.08)}${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<path d="M0 -100V-86" stroke="${P.ink}" stroke-width="8" transform="rotate(${i * 30})"/>`).join("")}<path d="M0 0L0 -70" stroke="${P.ink}" stroke-width="14" stroke-linecap="round"/><path d="M0 0L0 -96" stroke="${RED}" stroke-width="6" transform="rotate(${(hand * 360).toFixed(1)})"/><circle r="12" fill="${P.ink}"/>`, 1.25 * pop(a - 4.6) * bump(a, 7.08, 0.12)) : "";
  const live = seg(a, 7.05, 7.3);
  const st = a > 5.7 ? at(o.stx ?? 1180, o.sty ?? 880, plant(tot, 0.2 + 0.8 * live), 0.5 * pop(a - 5.88)) + (live > 0 ? rings(o.stx ?? 1180, (o.sty ?? 880) - 160, 200, P.gold, 0.3 * live, 1.4) : "") : "";
  const g = layer(wall + sched + tv + clk + st, c);
  return { g, in: toScreen(c, 960, 380), inC: "#0b3346" };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
export const balanceSet = makeSet(SHOTS, V, P);
export { RED, sky, ground, bump, plant, screen, chair, stopwatch, signal, whoosh };
