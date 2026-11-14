// "Pipes": volt, ampere, ohm and watt as water, then the kettle, the tea glass, the old bulb, and the four names.
//   0 the teal house; a tank drops onto its roof and a pipe runs down from it to a tap
//   1 the tank climbs on taller legs, the stream from the tap grows; a gauge marked V swings up
//   2 the camera goes to the pipe: the water runs; a stopwatch ticks a second; a gauge marked A
//   3 a clamp squeezes the pipe narrow, the flow thins; a gauge marked Ω
//   4 the tank climbs again, the flow grows; under the street a copper wire does the same and its bulb brightens
//   5 the stream turns a water wheel: V × A = W, the hub glows W, a bill slides out
//   6 a balance: the bulb (10 W) on one pan, the kettle (2,000 W) slams the other down
//   7 the tea glass with 200 small bulbs lighting round it
//   8 inside the old bulb: electrons jammed in the thin wire like cars, glowing red then white
//   9–12 one shelf: VOLTA (Italy, his pile, 1800), AMPÈRE (France), OHM (Germany), WATT (Scotland)
// Shots 0–4 are one place seen by one camera and shots 9–12 one shelf (no hand-over shape inside each run).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, FW, FH, makeSet } from "./kit.js";
import { P, E, pop, house, stars, skyline, mix, tank, flow, gauge, bulb, kettle, tea, plate, flag, tagV, tube, battery } from "./elec.js";
import { calPage } from "./props.js";

const ends = (s) => s.ends || [4.97, 4.9, 4.57, 5.12, 4.59, 5.29, 3.69, 2, 8.79, 5.22, 0.79, 1.13, 1.17];
const cum = (s, k) => ends(s).slice(0, k).reduce((a, b) => a + b, 0);
const fmt = (v) => Math.round(v).toLocaleString("en");

// ---- 0–4: the teal house with a tank on its roof ----
const G = 880, HX = 620, ROOF = G - 292, TAPX = 1180, PY = G - 130, PX0 = 1000, PX1 = 1090;
function rig(T, c, tot, s) {
  const C1 = cum(s, 1), C2 = cum(s, 2), C3 = cum(s, 3), C4 = cum(s, 4);
  const lift = kf(T, [[C1 + 0.22, 0], [C1 + 1.0, 140], [C4 + 0.05, 140], [C4 + 0.9, 230]]);
  const pinch = kf(T, [[C3 + 0.68, 0], [C3 + 0.94, 1], [C4 - 0.05, 1], [C4 + 0.25, 0]]);
  const on = seg(T, 4.35, 4.85), press = 0.45 + 0.55 * lift / 140, fl = on * press * (1 - 0.65 * pinch);
  const drop = T < 2.89 ? -900 : lerp(-500, 0, Math.min(1, spring(T - 2.89, 7, 13) * 1.0)), base = ROOF + 18 - lift;
  const ty = base - 230 + drop, pipeD = `M${HX + 150} ${ty}H940V${PY}H${TAPX}V${PY + 30}`;
  const reveal = seg(T, 3.99, 4.6);
  const stilts = lift > 0 ? `<path d="M${HX - 110} ${ROOF + 20}V${base + drop}M${HX + 110} ${ROOF + 20}V${base + drop}M${HX - 110} ${(ROOF + base) / 2 + drop}H${HX + 110}" stroke="${P.steelD}" stroke-width="16" stroke-linecap="round"/>` : "";
  const tk = at(HX, base + drop, tank(0.75 + 0.1 * Math.sin(tot), { c: P.violet, cD: P.violetD }), [1, T > 2.89 ? 1 + 0.08 * Math.exp(-(T - 3.2) * 6) * Math.cos((T - 3.2) * 18) * (T > 3.2 ? 1 : 0) : 1]);
  // the pipe: drawn on its words, then water runs in it; the clamp's part is narrower
  const w = 40, wN = w * (1 - 0.62 * pinch);
  let pipe = "";
  if (on <= 0) pipe = drawn(pipeD, reveal, P.steelD, w + 16);
  else { const a = `M${HX + 150} ${ty}H940V${PY}H${PX0}`, b = `M${PX0} ${PY}H${PX1}`, cc = `M${PX1} ${PY}H${TAPX}V${PY + 30}`;
    pipe = flow(a, T, fl, w) + flow(cc, T, fl, w) + `<path d="${b}" stroke="${P.steelD}" stroke-width="${wN + 16}"/><path d="${b}" stroke="${E.waterD}" stroke-width="${wN}"/><path d="${b}" stroke="${E.water}" stroke-width="${wN * 0.5}" stroke-dasharray="40 50" stroke-dashoffset="${(-T * 260 * fl).toFixed(1)}"/>`; }
  const clamp2 = pinch > 0 ? [-1, 1].map((d) => `<path d="${rr(PX0 + 5, PY + d * (wN / 2 + 8) + (d < 0 ? -60 : 0), PX1 - PX0 - 10, 60, 10)}" fill="${P.red}"/>`).join("") + `<path d="M${(PX0 + PX1) / 2} ${PY - wN / 2 - 68}V${PY - 170}" stroke="${P.redD}" stroke-width="16"/>` : "";
  // the stream from the tap: as thick as the flow, falling into a drain
  const sw = 10 + 46 * fl, stream = on > 0 ? `<path d="M${TAPX - sw / 2} ${PY + 50}h${sw}V${G}h${-sw}Z" fill="${E.water}" opacity=".9"/><path d="M${TAPX - sw / 4} ${PY + 50}V${G}" stroke="#bfe6ff" stroke-width="${sw * 0.2}" stroke-dasharray="30 40" stroke-dashoffset="${(-T * 400).toFixed(1)}"/>`
    + [0, 1, 2].map((i) => { const q = (T * 1.6 + i / 3) % 1; return `<ellipse cx="${TAPX}" cy="${G}" rx="${(sw + 40 + 120 * q) * fl}" ry="${(14 + 30 * q) * fl}" fill="none" stroke="${E.water}" stroke-width="6" opacity="${(0.7 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const tap = `<path d="${rr(TAPX - 34, PY + 16, 68, 40, 10)}" fill="${P.steel}"/><path d="${rr(TAPX - 14, PY - 40, 28, 40, 8)}" fill="${P.steelD}"/>`;
  // gauges on their words
  const gV = T > C1 + 2.42 && T < C2 + 0.5 ? at(HX - 330, base - 260, (T > C1 + 4.23 ? rings(0, 0, 130, P.gold, 0.3 * (1 - seg(T, C1 + 4.6, C2 + 0.4))) : "") + gauge(0.2 + 0.6 * lift / 140, { mark: "V" }), 1.5 * pop(T - C1 - 2.42) * (1 - seg(T, C2 + 0.2, C2 + 0.5))) : "";
  const gA = T > C2 + 3.1 && T < C3 + 0.5 ? at(1045, PY - 290, (T > C2 + 3.78 ? rings(0, 0, 130, P.gold, 0.3) : "") + gauge(fl * 0.75, { mark: "A" }), 1.3 * pop(T - C2 - 3.1) * (1 - seg(T, C3 + 0.2, C3 + 0.5))) : "";
  const gO = T > C3 + 3.03 && T < C4 + 0.4 ? at(1250, PY - 190, (T > C3 + 4.4 ? rings(0, 0, 130, P.gold, 0.3) : "") + gauge(0.2 + 0.7 * pinch, { mark: "Ω" }), 1.0 * pop(T - C3 - 3.03) * (1 - seg(T, C4 + 0.1, C4 + 0.4))) : "";
  const gVA = T > C4 ? at(HX - 330, base - 260, gauge(0.2 + 0.6 * lift / 140, { mark: "V" }), 1.3 * pop(T - C4 - 0.2)) + at(1300, PY - 300, gauge(fl * 0.75, { mark: "A" }), 1.3 * pop(T - C4 - 1.77)) : "";
  // a stopwatch for "every second"
  const sw2 = T > C2 + 1.44 && T < C2 + 3.2 ? at(820, PY - 250, `${disc(0, 0, 70, P.cream, P.creamD)}<rect x="-12" y="-96" width="24" height="26" rx="6" fill="${P.steelD}"/><path d="M0 0L${50 * Math.sin(seg(T, C2 + 1.5, C2 + 2.5) * 6.283)} ${-50 * Math.cos(seg(T, C2 + 1.5, C2 + 2.5) * 6.283)}" stroke="${P.red}" stroke-width="8" stroke-linecap="round"/><circle r="9" fill="${P.ink}"/>`, 1.1 * pop(T - C2 - 1.44) * (1 - seg(T, C2 + 2.9, C2 + 3.2))) : "";
  // under the street: the copper wire that obeys the same law
  const wIn = ease(seg(T, C4 + 2.89, C4 + 3.5));
  const wy = G + 110, wireG = wIn > 0 ? `<g opacity="${wIn.toFixed(2)}">${at(260, wy + 90, battery({ push: fl }), 0.5)}${tube(380, 1250, wy, 70, tot, T * 300 * fl, { r: 13 })}${at(1360, wy + 110, bulb(clamp(0.2 + fl * 0.8)), 0.7)}</g>` : "";
  const street = `<rect x="-900" y="${G}" width="3800" height="900" fill="${P.ground}"/><rect x="-900" y="${G + 34}" width="3800" height="18" fill="${P.road}"/>`;
  const hs = at(HX, G, house(E.houseA, E.houseAD, { roof: E.roof })) + at(1620, G, house(E.houseB, E.houseBD, { roof: E.roof }), 0.8);
  return `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(31, 70, -600, 2600, 700, tot), c, 0.15) + layer(skyline(41, -800, 2800, G - 60, 80, 210, E.far, E.farLit), c, 0.4)
    + layer(street + hs + stilts + pipe + clamp2 + tap + stream + tk + wireG + gV + gA + gO + gVA + sw2, c);
}
const KEYS = (s) => { const C1 = cum(s, 1), C2 = cum(s, 2), C3 = cum(s, 3), C4 = cum(s, 4), C5 = cum(s, 5);
  return [[0, 920, 560, 1.15], [2.6, 900, 520, 1.25], [C1, 900, 520, 1.27], [C1 + 1.2, 860, 450, 1.12], [C2, 860, 450, 1.12], [C2 + 0.8, 1010, 660, 1.55], [C3, 1030, 670, 1.6], [C3 + 0.6, 1045, 690, 1.95], [C4, 1045, 690, 1.9], [C4 + 0.9, 840, 440, 0.98], [C4 + 2.9, 820, 500, 0.95], [C5, 820, 505, 0.97]]; };
const rigShot = (k) => (a, tot, s) => { const T = cum(s, k) + a, c = camAt(T, KEYS(s)), r = { g: rig(T, c, tot, s) };
  if (k === 4) { r.out = toScreen(c, TAPX, PY + 200); r.outC = E.water; r.outZ = 16; }
  return r; };

// ---- 5: the stream turns a wheel: volts times amperes is watts, and that is the bill ----
function s5(a, tot) {
  const c = camAt(a, [[0, 920, 500, 1.35], [5.3, 940, 480, 1.22]]), WX = 860, WY = 600, R = 270;
  const ang = 40 * a + 30 * a * a * 0.2;
  const paddles = Array.from({ length: 10 }, (_, i) => { const q = (ang + i * 36) * Math.PI / 180; return `<g transform="rotate(${ang + i * 36} ${WX} ${WY})">${two(rr(WX - 26, WY - R - 40, 52, 120, 8), P.wood, P.woodD, 6, 0)}</g>`; }).join("");
  const wheel = `<circle cx="${WX}" cy="${WY}" r="${R}" fill="none" stroke="${P.woodD}" stroke-width="30"/><circle cx="${WX}" cy="${WY}" r="${R - 20}" fill="none" stroke="${P.wood}" stroke-width="14"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${WX} ${WY}l${(R * Math.cos((ang + i * 72) * Math.PI / 180)).toFixed(1)} ${(R * Math.sin((ang + i * 72) * Math.PI / 180)).toFixed(1)}" stroke="${P.woodD}" stroke-width="20"/>`).join("")}${paddles}`;
  const hubW = a > 3.1 ? rings(WX, WY, 120, P.gold, 0.35 * pop(a - 3.1)) : "";
  const hub = at(WX, WY, disc(0, 0, 90, P.gold, P.goldD) + (a > 3.1 ? text(0, 36, "W", 100, "#7a4200") : ""), a > 3.1 ? pop(a - 3.1) * 0.3 + 0.7 : 0.7);
  const fallX = WX - R + 30, stream = `<path d="M${fallX - 30} -300h60V${WY - 20}h-60Z" fill="${E.water}"/><path d="M${fallX} -300V${WY - 20}" stroke="#bfe6ff" stroke-width="10" stroke-dasharray="30 40" stroke-dashoffset="${(-a * 500).toFixed(1)}"/>`
    + [0, 1, 2, 3].map((i) => { const q = (a * 2 + i / 4) % 1; return `<circle cx="${fallX - 40 - q * 120}" cy="${WY + 40 + q * 200}" r="${10 + 8 * (1 - q)}" fill="${E.water}" opacity="${(1 - q).toFixed(2)}"/>`; }).join("");
  const river = `<rect x="-600" y="${WY + 200}" width="3200" height="600" fill="${E.waterD}"/><path d="M-600 ${WY + 230}H2600" stroke="${E.water}" stroke-width="10" stroke-dasharray="80 70" stroke-dashoffset="${(-a * 120).toFixed(1)}"/>`;
  // the sum over the wheel: V × A = W
  const parts = [["V", 1.62, -200], ["×", 2.04, -100], ["A", 2.11, 0], ["=", 2.69, 100], ["W", 3.1, 200]];
  const sum = parts.map(([t, t0, dx]) => (a > t0 ? at(WX + dx, 170, text(0, 40, t, 120, t === "W" ? P.gold : P.cream), pop(a - t0)) : "")).join("");
  // the bill
  const bx = lerp(2200, 1330, easeOut(seg(a, 4.1, 4.7))), bill = a > 4.1 ? at(bx, 400, `${two(rr(-150, -200, 300, 400, 16), P.cream, P.creamD, 8, 6)}<path d="M-100 -120h200M-100 -60h160M-100 0h180M-100 60h120" stroke="${P.creamD}" stroke-width="14" stroke-linecap="round"/>${disc(70, 130, 46, P.gold, P.goldD)}${text(70, 150, "W", 52, "#7a4200")}`, 1, -6 + 6 * ease(seg(a, 4.5, 5))) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(5, 60, -400, 2400, 700, tot), c, 0.15) + layer(skyline(9, -800, 2800, WY + 210, 100, 280, E.far, E.farLit), c, 0.45)
    + layer(river + stream + wheel + hubW + hub + sum + bill, c);
  return { g, in: toScreen(c, fallX, 200), inC: E.water, inZ: 16, out: toScreen(c, WX, WY), outC: P.gold, outZ: 18 };
}

// ---- 6: the balance: 10 W against 2,000 W ----
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.05], [3.69, 960, 540, 1.0]]), PX = 960, PYv = 300, L = 470;
  const tilt = a < 2.0 ? -4 * ease(seg(a, 0.3, 0.8)) : -4 + 20 * spring(a - 2.0, 6, 12);
  const r = tilt * Math.PI / 180, end = (d) => [PX + d * L * Math.cos(r), PYv + d * L * Math.sin(r)];
  const pan = (d, inner) => { const [x, y] = end(d), py = y + 300; return `<path d="M${x} ${y}L${x - 150} ${py}M${x} ${y}L${x + 150} ${py}" stroke="${P.steel}" stroke-width="6"/>${two(`M${x - 190} ${py}h380q-20 50 -80 54h-220q-60 -4 -80 -54Z`, P.steel, P.steelD, 0, 8)}${at(x, py, inner)}`; };
  const bIn = a > 0.0 ? at(0, -900 * (1 - Math.min(1, spring(a, 7, 13))), bulb(1), 0.75) : "";
  const kIn = a > 2.0 ? at(0, 0, kettle(tot, 1), 0.85) : a > 1.7 ? at(0, -900 * (1 - seg(a, 1.7, 2.0)), kettle(tot, 1), 0.85) : "";
  const [lx, ly] = end(-1), [rx, ry] = end(1);
  const t10 = a > 1.21 ? at(lx, ly + 300 - 330, tagV("10", "W", { size: 80 }), pop(a - 1.21)) : "";
  const kw = kf(a, [[2.49, 0], [2.91, 2000]], easeOut), t2k = a > 2.49 ? at(rx, ry + 300 - 360, tagV(fmt(kw), "W", { size: 80, fill: kw > 1999 ? "#ff8a5c" : P.gold }), pop(a - 2.49)) : "";
  const stand = `${two(rr(PX - 30, PYv, 60, 640, 10), P.wood, P.woodD, 8, 0)}${two(rr(PX - 220, PYv + 620, 440, 50, 16), P.wood, P.woodD, 0, 8)}${two("M" + (PX - 40) + " " + (PYv - 70) + "l40 -40l40 40Z", P.gold, P.goldD, 0, 6)}`;
  const beam = `<path d="M${lx} ${ly}L${rx} ${ry}" stroke="${P.goldD}" stroke-width="34" stroke-linecap="round"/><path d="M${lx} ${ly - 6}L${rx} ${ry - 6}" stroke="${P.gold}" stroke-width="18" stroke-linecap="round"/>${disc(PX, PYv, 34, P.gold, P.goldD)}`;
  const thud = a > 2.0 && a < 2.6 ? rings(rx, ry + 330, 120 + 300 * seg(a, 2.0, 2.6), "#fff", 0.2 * (1 - seg(a, 2.0, 2.6)), 1.1) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(77, 60, -300, 2300, 1100, tot), c, 0.15) + layer(`<rect x="-600" y="${PYv + 670}" width="3200" height="500" fill="${P.ground}"/>` + stand + pan(-1, bIn) + pan(1, kIn) + beam + thud + t10 + t2k, c);
  return { g, in: toScreen(c, PX, PYv), inC: P.gold, inZ: 18, out: toScreen(c, rx, ry + 200), outC: "#ece8ff", outZ: 16 };
}

// ---- 7: one glass of tea is two hundred bulbs ----
function s7(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.12], [2.0, 960, 540, 1.0]]), CX = 860, CY = 560;
  let bulbs = ""; let n = 0; const cells = [];
  for (let r = 0; r < 11; r++) for (let q = 0; q < 22; q++) { const x = 60 + q * 82, y = 60 + r * 90; if (Math.abs(x - CX) < 250 && Math.abs(y - CY) < 260) continue; if (x > 1540 && y > 440) continue; cells.push([x, y, Math.hypot(x - CX, y - CY)]); }
  cells.sort((p, q) => p[2] - q[2]); const shown = cells.slice(0, 200);
  shown.forEach(([x, y, d], i) => { const t0 = 1.0 + 0.55 * (i / 200), on = clamp((a - t0) / 0.12); bulbs += at(x, y + 50, bulb(on), 0.2 * (0.5 + 0.5 * Math.min(1, spring(Math.max(0, a - 0.15 - i * 0.002), 9, 16)))); n++; });
  const glass = `${rings(CX, CY - 60, 230, "#ffad2a", 0.18)}${at(CX, CY + 180, tea(tot), 2.4)}`;
  const tg = a > 1.11 ? at(CX, CY + 300, tagV("× 200", "", { size: 100 }), pop(a - 1.11)) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(bulbs, c, 0.9) + layer(glass + tg, c);
  return { g, in: toScreen(c, CX, CY), inC: "#ece8ff", inZ: 16 };
}

// ---- 8: the old bulb: a thin wire, electrons jammed in it like cars ----
// the old bulb's filament in bulb coordinates, as points (the zigzag of elec.js's old bulb)
const FIL = (() => { const pts = [[-30, -120], [-30, -170]]; const q = (a, cc, b) => { for (let i = 1; i <= 8; i++) pts.push(bez(a, cc, b, i / 8)); };
  q([-30, -170], [-20, -196], [-10, -170]); q([-10, -170], [0, -144], [10, -170]); q([10, -170], [20, -196], [30, -170]); pts.push([30, -120]); return pts; })();
const FLEN = (() => { let L = 0; for (let i = 1; i < FIL.length; i++) L += Math.hypot(FIL[i][0] - FIL[i - 1][0], FIL[i][1] - FIL[i - 1][1]); return L; })();
const filAt = (p) => { let d = clamp(p) * FLEN; for (let i = 1; i < FIL.length; i++) { const l = Math.hypot(FIL[i][0] - FIL[i - 1][0], FIL[i][1] - FIL[i - 1][1]); if (d <= l) { const u = d / l; return [lerp(FIL[i - 1][0], FIL[i][0], u), lerp(FIL[i - 1][1], FIL[i][1], u), Math.atan2(FIL[i][1] - FIL[i - 1][1], FIL[i][0] - FIL[i - 1][0])]; } d -= l; } return [...FIL[FIL.length - 1], 0]; };
function s8(a, tot) {
  const BX = 1060, BY = 1000, K = 2.6, FX = BX, FY = BY - 165 * K;
  const c = camAt(a, [[0, 1060, 560, 1.0], [0.9, 1060, 540, 1.05], [2.6, FX, FY + 30, 4.3], [6.0, FX, FY + 30, 4.5], [8.79, FX, FY + 30, 4.2]]);
  const glow = kf(a, [[4.4, 0], [5.0, 0.55], [5.5, 1]]), hot = mix("#ff5a2a", "#fff6c0", seg(a, 5.0, 5.5));
  const thin = a > 1.0 && a < 2.2 ? rings(FX, FY, 60, "#fff", 0.25 * Math.sin(Math.PI * seg(a, 1.0, 2.2))) : "";
  // electrons come in from the left leg and pile up: each one slower than the last
  let cars = "";
  const N = 12;
  for (let i = 0; i < N; i++) { const t0 = 3.0 + i * 0.09, u = a - t0; if (u <= 0) continue;
    const jam = 0.6 - i * 0.05, p = Math.min(jam, u * 0.55) + (a > 7.39 ? 0.006 * Math.sin(tot * 6 + i) : 0), [x, y, ang] = filAt(p);
    const brake = a > 7.3 && Math.sin(tot * 9 + i * 1.3) > 0;
    cars += at(BX + x * K, BY + y * K, `<g transform="rotate(${(ang * 180 / Math.PI).toFixed(1)})"><circle r="6" fill="${E.el}"/><rect x="-2.8" y="-0.9" width="5.6" height="1.8" fill="#fff"/><circle cx="-6" cy="0" r="1.8" fill="${brake ? "#ff3040" : "#7a1a20"}"/></g>`); }
  const honk = a > 7.39 ? [0, 1, 2].map((i) => { const q = (tot * 1.5 + i / 3) % 1; return `<path d="M${FX + 14 + q * 8} ${FY - 22 - q * 6}l4 -3M${FX + 16 + q * 8} ${FY - 18}l5 0" stroke="${P.gold}" stroke-width="1.4" stroke-linecap="round" opacity="${(1 - q).toFixed(2)}"/>`; }).join("") : "";
  const filGlow = glow > 0 ? `<path d="${"M" + FIL.map(([x, y]) => `${(BX + x * K).toFixed(1)} ${(BY + y * K).toFixed(1)}`).join("L")}" fill="none" stroke="${hot}" stroke-width="${6 + 6 * glow}" stroke-linejoin="round" opacity="${glow.toFixed(2)}"/>` + rings(FX, FY + 10, 70 + 40 * glow, hot, 0.25 * glow) : "";
  const filD = "M" + FIL.map(([x, y]) => `${(BX + x * K).toFixed(1)} ${(BY + y * K).toFixed(1)}`).join("L"), filBase = `<path d="${filD}" fill="none" stroke="#3a1a10" stroke-width="16" stroke-linejoin="round" opacity=".55"/><path d="${filD}" fill="none" stroke="${E.cuD}" stroke-width="9" stroke-linejoin="round"/>`;
  const om = a > 2.28 && a < 3.1 ? at(FX, FY - 46, text(0, 14, "Ω", 44, P.gold), pop(a - 2.28) * (1 - seg(a, 2.9, 3.1))) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(3, 60, -300, 2300, 1100, tot), c, 0.15) + layer(at(BX, BY, bulb(0.15 + 0.5 * glow, { old: 1 }), K) + filBase + thin + filGlow + cars + honk + om, c);
  return { g, in: toScreen(c, BX, BY - 175 * K), inC: "#ece8ff", out: toScreen(c, FX, FY), outC: P.gold, outZ: 14 };
}

// ---- 9–12: the four names on one shelf ----
const SY = 780, SLOTS = [400, 840, 1280, 1700];
const pile = (n) => { let d = ""; for (let i = 0; i < n; i++) { const y = -20 - i * 26, col = i % 3 === 0 ? E.cu : i % 3 === 1 ? P.steel : P.creamD; d += `<ellipse cx="0" cy="${y}" rx="70" ry="16" fill="${col}"/><rect x="-70" y="${y - 10}" width="140" height="10" fill="${col}"/>`; }
  return `<path d="M-90 -6V-340M90 -6V-340" stroke="${P.wood}" stroke-width="10"/>${two(rr(-110, -14, 220, 20, 6), P.wood, P.woodD, 0, 6)}${d}`; };
function shelf(L, c, tot, s) {
  const e = ends(s), A = e[9], O = A + e[10], W = O + e[11];
  const slot = (x, name, fl, tp, tf) => (L > tp ? at(x, SY + 70, plate(name, 60), pop(L - tp)) : "") + (L > tf ? at(x + (name === "VOLTA" ? 80 : 0), SY - 140, `<path d="M-90 60V140" stroke="${P.steelD}" stroke-width="10"/>${flag(fl, 200)}`, pop(L - tf)) : "");
  const discs = Math.floor(kf(L, [[2.72, 0], [3.55, 12]], (p) => p));
  const volt = (L > 2.72 ? at(SLOTS[0] - 130, SY, pile(discs), 0.9) : "") + (L > 3.66 ? at(SLOTS[0] + 330, 470, calPage("1800", "", 0.9, 150), pop(L - 3.66) * (1 - seg(L, A + 0.1, A + 0.5))) : "");
  const wall = `<rect x="-900" y="-600" width="3800" height="${SY + 600}" fill="${P.mid}"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-200 + i * 480}" y="-600" width="18" height="${SY + 600}" fill="${P.far}"/>`).join("")}`;
  const board = `${two(rr(-900, SY, 3800, 36, 6), P.wood, P.woodD, 0, 8)}<rect x="-900" y="${SY + 36}" width="3800" height="600" fill="${P.ink}"/>`;
  const lamps = SLOTS.map((x, i) => { const tp = [1.47, A, O, W + 0.49][i]; return L > tp ? `<path d="M${x - 160} ${SY}L${x - 60} -100H${x + 60}L${x + 160} ${SY}Z" fill="#ffd98a" opacity="${(0.1 * clamp((L - tp) / 0.3)).toFixed(3)}"/>` : ""; }).join("");
  return wall + lamps + board + volt + slot(SLOTS[0], "VOLTA", "it", 1.47, 2.11) + slot(SLOTS[1], "AMPÈRE", "fr", A, A + 0.08) + slot(SLOTS[2], "OHM", "de", O, O + 0.45) + slot(SLOTS[3], "WATT", "sco", W + 0.4, W + 0.49);
}
const SKEYS = (s) => { const e = ends(s), A = e[9], O = A + e[10], W = O + e[11];
  return [[0, 470, 560, 1.55], [A - 0.2, 470, 560, 1.6], [A + 0.4, 760, 560, 1.3], [O + 0.5, 960, 590, 1.12], [W + 0.6, 1050, 640, 1.08], [W + 1.2, 1050, 640, 1.07]]; };
const shelfShot = (k) => (a, tot, s) => { const L = cum(s, k) - cum(s, 9) + a, c = camAt(L, SKEYS(s));
  const g = `<rect width="${FW}" height="${FH}" fill="${P.mid}"/>` + layer(shelf(L, c, tot, s), c);
  return k === 9 ? { g, in: toScreen(c, SLOTS[0], SY - 140), inC: P.gold, inZ: 16 } : { g }; };

const SHOTS = [rigShot(0), rigShot(1), rigShot(2), rigShot(3), rigShot(4), s5, s6, s7, s8, shelfShot(9), shelfShot(10), shelfShot(11), shelfShot(12)];
export const pipesSet = makeSet(SHOTS, [], P);
