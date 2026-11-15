// "The trip" (electricity part 2 of 4): from the generator to the socket, eleven shots, no people.
//   0 the generator makes 20,000 V; the line runs into a transformer box and the tag jumps to 100,000s V
//   1 the transformer cut open: an iron ring, a coil of few turns on the left, many on the right; nothing moves; the pressure grows on the right
//   2 the camera rides a gold pulse over pylons and hills, through a city substation and a street transformer into the teal house's socket: 110 / 240 V
//   3 a wall of plug shapes fills up; 15
//   4 a suitcase opens on a travel adapter: two different plugs meet through it (host right)
//   5 a wire glows with current; more current, more heat (a thermometer climbs), heat waves leave the wire
//   6 the same power two ways: a fat red current at low pressure (hot, losing), a thin cyan one at high pressure (cool) ✓
//   7 a thousand little cars jam the road and smoke; one fast train passes them all: HIGH V
//   8 the transformer hums with an AC wave in it ✓; a DC straight line does nothing ✗; TESLA ✓ EDISON (host left)
//   9 a line of pylons sheds small sparks along the way: ~5% (USA); an old sagging line sheds many; a hook on a wire steals some
//  10 the bare high-voltage line glows faintly in the air; a kite drifts close and a spark jumps the air gap; a skull sign on the pylon (host right)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { fmt } from "./bank.js";
import { hills, car } from "./props.js";
import { P, E, mix, house, stars, skyline, pop, socket, pylon, pylonTips, span, spanAt, station, pole, plate, tagV, flag, spark, bolt } from "./elec.js";
import { V } from "./trip.v.js";

const tall = () => FH > FW;
const bump = (a, t0, amt = 0.12) => (a > t0 ? 1 + amt * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 14) : 1);
const sky = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -1400, 3400, 900, tot), c, 0.12);
const sine = (x0, x1, y, amp, n, phase = 0) => { let d = ""; for (let i = 0; i <= 80; i++) { const x = lerp(x0, x1, i / 80); d += (i ? "L" : "M") + x.toFixed(1) + " " + (y + amp * Math.sin(phase + (i / 80) * n * 2 * Math.PI)).toFixed(1); } return d; };

// ---- props of this set (around (0, 0)) ----
// the generator from "faraday": a copper coil ring with a red and blue magnet spinning in it (centre), r = 150
export const generator = (t, spin = 1) => { const a = t * 6 * spin;
  return `${disc(0, 0, 170, "#2b5a74", "#1c4157")}<circle r="128" fill="none" stroke="${E.cuD}" stroke-width="40"/><circle r="128" fill="none" stroke="${E.cu}" stroke-width="22" stroke-dasharray="10 8"/>
    <g transform="rotate(${(a * 57.3).toFixed(1)})"><path d="${rr(-90, -26, 90, 52, 10)}" fill="${P.red}"/><path d="${rr(0, -26, 90, 52, 10)}" fill="${E.water}"/></g><circle r="16" fill="${P.steel}"/>`; };
// a transformer box (base on y = 0), 300 wide; hum 0..1 shakes it a little and lights its coil window
export const xfBox = (t = 0, hum = 0) => { const s = hum > 0 ? Math.sin(t * 90) * 2 * hum : 0;
  return at(s, 0, `${two(rr(-150, -300, 300, 300, 18), "#3d7a6a", "#2b5c50", 12, 0)}${[0, 1, 2, 3, 4].map((i) => `<path d="${rr(-170, -270 + i * 52, 20, 36, 6)}${rr(150, -270 + i * 52, 20, 36, 6)}" fill="#2b5c50"/>`).join("")}
    <path d="${rr(-80, -360, 40, 70, 10)}${rr(40, -360, 40, 70, 10)}" fill="${P.cream}"/>${[-60, 60].map((x) => `<circle cx="${x}" cy="-362" r="16" fill="${P.creamD}"/>`).join("")}
    <path d="${rr(-90, -220, 180, 120, 14)}" fill="#1c4157"/><circle cx="0" cy="-160" r="${30 + 8 * hum}" fill="${mix("#2b5a74", P.gold, hum)}"/>`); };
// the transformer cut open: an iron ring with two coils; nl / nr turns, glow 0..1 on each side
const xfOpen = (nl, nr, gl = 0, gr = 0) => { const ring = `<path d="${rr(-360, -260, 720, 520, 40)}M-220 -120H220V120H-220Z" fill="#6f7f98" fill-rule="evenodd"/><path d="${rr(-360, -260, 720, 40, 20)}" fill="#8b9bb4"/>`;
  const coil = (x, n, g) => { let s = ""; const h = 360, top = -h / 2; for (let i = 0; i < n; i++) { const y = top + (i + 0.5) * (h / n); s += `<path d="${rr(x - 90, y - h / n * 0.32, 180, h / n * 0.64, h / n * 0.3)}" fill="${mix(E.cuD, E.cuL, g)}"/>`; } return (g > 0 ? rings(x, 0, 200, P.gold, 0.18 * g, 1.3) : "") + s; };
  return ring + coil(-290, nl, gl) + coil(290, nr, gr); };
// a plug face (centre), one of several shapes; k picks the shape
const plugFace = (k, w = 150) => { const h = w * 1.1, body = two(rr(-w / 2, -h / 2, w, h, 26), ["#ece8ff", P.cream, "#c6e6ff", "#ffe0c2", "#d9f5e4"][k % 5], P.creamD, 6, 6);
  const pins = [
    `<path d="${rr(-34, -30, 16, 50, 6)}${rr(18, -30, 16, 50, 6)}" fill="${P.steelD}"/>`,
    `<circle cx="-30" cy="0" r="14" fill="${P.steelD}"/><circle cx="30" cy="0" r="14" fill="${P.steelD}"/>`,
    `<path d="${rr(-40, -34, 16, 40, 5)}${rr(24, -34, 16, 40, 5)}${rr(-8, 14, 16, 34, 5)}" fill="${P.steelD}"/>`,
    `<path d="${rr(-42, -10, 26, 14, 5)}${rr(16, -10, 26, 14, 5)}${rr(-7, -46, 14, 30, 5)}" fill="${P.steelD}"/>`,
    `<circle cx="-34" cy="10" r="12" fill="${P.steelD}"/><circle cx="34" cy="10" r="12" fill="${P.steelD}"/><circle cx="0" cy="-30" r="12" fill="${P.steelD}"/>`,
    `<path d="M-40 -30L-22 0L-40 30M40 -30L22 0L40 30" stroke="${P.steelD}" stroke-width="14" fill="none" stroke-linecap="round"/>`,
    `<path d="${rr(-36, -26, 14, 52, 6)}${rr(22, -26, 14, 52, 6)}" fill="${P.steelD}"/><circle cx="0" cy="34" r="10" fill="${P.steelD}"/>`];
  return body + pins[k % pins.length]; };
// a suitcase (base on y = 0), lid opens 0..1 upward
const suitcase = (open = 0, inner = "") => `${two(rr(-260, -200, 520, 200, 24), "#b06a35", "#8a4f24", 0, 10)}${inner}
  <g transform="translate(0 -200) scale(1 ${(1 - 1.85 * ease(open)).toFixed(3)}) translate(0 200)">${two(rr(-260, -380, 520, 180, 24), "#c27a40", "#8a4f24", 0, 10)}<path d="${rr(-60, -410, 120, 40, 14)}" fill="none" stroke="#6a3a18" stroke-width="16"/></g>`;
// a little skull sign (centre), r = half its width
const skullSign = (r = 90) => `${two(`M0 ${-r}L${r} 0L0 ${r}L${-r} 0Z`, E.warn, P.goldD, 0, 8)}<circle cx="0" cy="-12" r="${r * 0.32}" fill="${P.ink}"/><path d="${rr(-r * 0.2, r * 0.12, r * 0.4, r * 0.2, 4)}" fill="${P.ink}"/><circle cx="${-r * 0.12}" cy="-14" r="${r * 0.08}" fill="${E.warn}"/><circle cx="${r * 0.12}" cy="-14" r="${r * 0.08}" fill="${E.warn}"/>
  <path d="M${-r * 0.5} ${r * 0.48}L${r * 0.5} ${r * 0.2}M${-r * 0.5} ${r * 0.2}L${r * 0.5} ${r * 0.48}" stroke="${P.ink}" stroke-width="${r * 0.1}" stroke-linecap="round"/>`;
// a kite (centre of the diamond)
const kite = (t = 0) => `${two("M0 -110L80 0L0 130L-80 0Z", P.red, P.redD, 0, 8)}<path d="M0 -110V130M-80 0H80" stroke="#ffd0c2" stroke-width="5"/><path d="M0 130Q30 180 0 230Q-30 280 0 330" stroke="${P.cream}" stroke-width="4" fill="none"/>${[0, 1, 2].map((i) => `<path d="M${-10 + 6 * Math.sin(t * 4 + i)} ${170 + i * 55}l20 -10l0 20Z" fill="${E.warn}"/>`).join("")}`;
// a train (base on y = 0, nose to the right), length L
const train = (L = 900) => `${two(`M${-L / 2} -150H${L / 2 - 120}Q${L / 2} -150 ${L / 2} -40V0H${-L / 2}Z`, "#ece8ff", "#c6c0e6", 0, 10)}<path d="M${-L / 2} -70H${L / 2 - 10}" stroke="${E.el}" stroke-width="16"/>
  ${Array.from({ length: Math.floor((L - 200) / 120) }, (_, i) => `<path d="${rr(-L / 2 + 40 + i * 120, -130, 80, 44, 10)}" fill="#0b4152"/>`).join("")}<path d="M${L / 2 - 110} -136Q${L / 2 - 30} -130 ${L / 2 - 14} -80H${L / 2 - 110}Z" fill="#0b4152"/>
  ${[0.2, 0.45, 0.7].map((p) => `<circle cx="${-L / 2 + L * p}" cy="0" r="16" fill="${P.ink}"/>`).join("")}`;

// ---- 0: 20,000 V out of the generator; a transformer lifts it ----
const G0 = 880;
function s0(a, tot, s, layout) {
  const L = layout || { gen: [640, G0 - 260], box: [1440, G0], tag0: [560, 250], tag1: [1460, 230], cam: [[0, 720, 560, 1.15], [3.6, 760, 560, 1.12], [5.0, 1060, 540, 1.0], [7.2, 1120, 540, 1.02]] };
  const c = camAt(a, L.cam);
  const v = Math.round(lerp(0, 20000, ease(seg(a, 2.68, 3.4)))), jump = seg(a, 6.07, 6.6);
  const run = seg(a, 3.73, 4.93), hum = seg(a, 5.42, 5.7);
  const [gx, gy] = L.gen, [bx, by] = L.box, vert = Math.abs(bx - gx) < 50, line = vert ? `M${gx} ${gy}V${by - 330}` : `M${gx} ${gy}H${bx - 80}`;
  const pulse = run > 0 && run < 1 ? rings(lerp(gx, vert ? gx : bx - 80, run), lerp(gy, vert ? by - 330 : gy, run), 40, P.gold, 0.5, 1.6) : "";
  const tag = a > 2.68 ? (jump < 0.5 ? at(L.tag0[0], L.tag0[1], tagV(fmt(v), "V", { size: 100 }), pop(a - 2.68)) : at(L.tag1[0], L.tag1[1], tagV("100,000s", "V", { size: 104 }), [1, pop(a - 6.33)])) : "";
  const g = sky(c, tot, 3) + layer(hills(61, -900, 3200, G0 - 60, 140, E.hill), c, 0.5)
    + layer(`<rect x="-900" y="${G0}" width="3800" height="600" fill="${P.ground}"/>` + `<path d="${rr(gx - 320, gy - 300, 640, 640, 24)}" fill="#0f3a55"/>` + at(gx, gy, generator(tot, 1), 1.35)
      + `<path d="${line}" stroke="#16113a" stroke-width="12" fill="none"/>` + (run > 0 ? drawn(line, run, P.gold, 10) : "") + pulse
      + at(bx, by, xfBox(tot, hum), 1.45 * bump(a, 5.42, 0.08)) + (hum > 0 ? rings(bx, by - 180, 260, P.gold, 0.18 * hum, 1.3) : "")
      + (jump > 0 && !vert ? drawn(`M${bx} ${by - 400}V${by - 700}`, jump, P.gold, 12) + at(bx, by - 720, `<path d="M-40 30L0 -20L40 30Z" fill="${P.gold}"/>`, pop(a - 6.3)) : ""), c) + tag;
  return { g, out: toScreen(c, bx, by - 160), outC: "#3d7a6a", outZ: 14 };
}
// ---- 1: the transformer cut open ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.05], [7.04, 960, 540, 0.98]]), CX = 960, CY = 560;
  const gl = seg(a, 1.6, 2.2), gr = seg(a, 1.9, 2.5), iron = seg(a, 2.6, 3.0);
  const cntL = a > 3.32 ? at(CX - 290, CY + 330, tagV("4", "", { size: 90, fill: P.cream }), pop(a - 3.32)) : "", cntR = a > 3.81 ? at(CX + 290, CY + 330, tagV("12", "", { size: 90 }), pop(a - 3.81)) : "";
  const pr = seg(a, 4.86, 5.7);
  const arrowL = a > 4.6 ? at(CX - 560, CY, `<path d="M-50 -30H20V-60L70 0L20 60V30H-50Z" fill="${P.cream}" opacity=".85"/>`, 0.9 * pop(a - 4.6)) : "";
  const arrowR = pr > 0 ? at(CX + 560, CY, `<path d="M-50 -30H20V-60L70 0L20 60V30H-50Z" fill="${P.gold}"/>`, [0.9 + 1.0 * pr, 0.9 + 1.0 * pr]) : "";
  const still = a > 0.85 && a < 1.6 ? at(CX, CY - 380, cross(0, 0, 50, P.red, a - 0.85), 1) : "";
  const g = sky(c, tot, 5) + layer(`<rect x="-900" y="-400" width="3800" height="1900" fill="#0b3149"/>` + at(CX, CY, xfOpen(4, 12, gl, gr), 1) + (iron > 0 ? at(CX, CY, `<path d="${rr(-360, -260, 720, 520, 40)}M-220 -120H220V120H-220Z" fill="${E.el}" fill-rule="evenodd" opacity="${(0.18 * iron * (0.7 + 0.3 * Math.sin(tot * 6))).toFixed(3)}"/>`) : "")
    + `<path d="M${CX - 760} ${CY}H${CX - 380}" stroke="${P.gold}" stroke-width="14" opacity=".7"/><path d="M${CX + 380} ${CY}H${CX + 760}" stroke="${P.gold}" stroke-width="${14 + 10 * pr}"/>` + arrowL + arrowR + cntL + cntR + still + check(CX + 470, CY - 330, 50, P.green, a - 6.44), c);
  return { g, in: [960, 560], inC: "#3d7a6a" };
}
// ---- 2: the trip, riding the pulse to the socket ----
const G2 = 880, TRIP = { gen: 300, x1: 700, pyl: [1100, 1700, 2300, 2900], sub: 3500, pole: 4300, house: 4900 };
export function tripWorld(a, tot, c) {
  const P0 = TRIP, pyH = 520, tipY = G2 - pyH * 0.98;
  const land = hills(71, -900, 6600, G2 - 120, 220, "#0d3550") + hills(81, -900, 6600, G2 - 30, 120, E.hill) + `<rect x="-900" y="${G2}" width="7600" height="700" fill="${P.ground}"/>`;
  const path = [[P0.gen + 140, G2 - 200], [P0.x1, G2 - 360], ...P0.pyl.map((x) => [x, tipY]), [P0.sub, G2 - 300], [P0.pole - 80, G2 - 500], [P0.house - 60, G2 - 220]];
  let d = `M${path[0][0]} ${path[0][1]}`; for (let i = 1; i < path.length; i++) { const [x0, y0] = path[i - 1], [x1, y1] = path[i]; d += `Q${(x0 + x1) / 2} ${Math.max(y0, y1) + 60} ${x1} ${y1}`; }
  const ride = clamp(a / 7.3);
  const city = skyline(91, P0.sub - 400, P0.house + 900, G2 - 20, 120, 300, E.far, E.farLit);
  const subTag = a > 3.54 ? at(P0.sub, G2 - 520, tagV("↓", "V", { size: 80, fill: P.cream }), pop(a - 3.54)) : "";
  const poleX = at(P0.pole, G2, pole(560)) + at(P0.pole + 60, G2 - 420, xfBox(tot, seg(a, 5.17, 5.4)), 0.35);
  const hs = at(P0.house, G2, house(E.houseA, E.houseAD, { roof: E.roof, lit: [1, 1, 1] }), 1.4) + at(P0.house - 60, G2 - 220, socket(), 0.55 * bump(a, 7.18, 0.15));
  const glow = drawn(d, ride, P.gold, 10);
  const head = (() => { const n = 60; let best = ""; const pp = clamp(ride); if (pp <= 0 || pp >= 1) return ""; // place a bright head near the end of the drawn part
    let lx = 0, ly = 0; const seg2 = Math.min(path.length - 2, Math.floor(pp * (path.length - 1))), q = pp * (path.length - 1) - seg2; const [x0, y0] = path[seg2], [x1, y1] = path[seg2 + 1]; lx = lerp(x0, x1, q); ly = lerp(y0, y1, q) + 30 * Math.sin(Math.PI * q);
    return rings(lx, ly, 46, P.gold, 0.5, 1.7) + `<circle cx="${lx}" cy="${ly}" r="18" fill="#fff6c8"/>`; })();
  return layer(city, c, 0.6) + layer(land + at(P0.gen, G2, station(tot, { lit: 1 }), 0.55) + at(P0.x1, G2, xfBox(tot, 1), 0.6) + P0.pyl.map((x) => at(x, G2, pylon(pyH))).join("")
    + `<path d="${d}" stroke="#16113a" stroke-width="6" fill="none"/>` + glow + at(P0.sub, G2, xfBox(tot, seg(a, 3.54, 3.8)), 0.9) + at(P0.sub + 220, G2, xfBox(tot, 0), 0.6) + subTag + poleX + hs + head, c);
}
function s2(a, tot) {
  const c = camAt(a, [[0, 900, 560, 0.95], [1.5, 1700, 520, 0.9], [2.7, 2700, 520, 0.9], [3.6, 3500, 560, 1.0], [5.2, 4300, 560, 1.0], [7.2, 4800, 640, 1.25], [9.65, 4840, 660, 1.4]]);
  const v = a > 7.44 ? at(tall() ? 540 : 960, tall() ? 330 : 200, tagV("110 / 240", "V", { size: 104 }), pop(a - 7.44)) : "";
  return { g: sky(c, tot, 11) + tripWorld(a, tot, c) + v, in: [960, 540], inC: "#3d7a6a", out: toScreen(c, TRIP.house - 60, G2 - 220), outC: P.cream, outZ: 16 };
}
// ---- 3: a wall of plugs, 15 ----
const PLUGS = Array.from({ length: 15 }, (_, i) => i);
function s3(a, tot, s, layout) {
  const L = layout || { cols: 5, x0: 500, y0: 300, dx: 230, dy: 250, k: 1.2, tag: [1650, 520] };
  const c = camAt(a, L.cam || [[0, 960, 560, 1.12], [5.39, 960, 540, 1.0]]);
  const n = Math.min(15, Math.floor(seg(a, 2.6, 4.4) * 15 + (a > 2.6 ? 1 : 0)));
  const wall = `<rect x="-900" y="-600" width="3800" height="2400" fill="#0b3149"/>` + Array.from({ length: 30 }, (_, i) => `<rect x="${-900 + i * 140}" y="-600" width="6" height="2400" fill="#0d3a55"/>`).join("");
  const units = a < 2.4 ? at(960, 520, `${tagV("V", "", { size: 110, fill: P.cream })}`, pop(a - 0.94)) + at(1160, 520, tagV("A", "", { size: 110, fill: P.cream }), pop(a - 1.36)) + at(760, 520, tagV("Ω", "", { size: 110, fill: P.cream }), pop(a - 1.85)) + (a > 1.85 ? at(960, 720, check(0, 0, 60, P.green, a - 1.95)) : "") : "";
  const plugs = a >= 2.4 ? PLUGS.map((i) => { const col = i % L.cols, row = Math.floor(i / L.cols); return i < n ? at(L.x0 + col * L.dx, L.y0 + row * L.dy, plugFace(i), L.k * pop(a - 2.6 - i * 0.11)) : ""; }).join("") : "";
  const cnt = a > 4.17 ? at(L.tag[0], L.tag[1], `${rings(0, -30, 120, P.gold, 0.18)}${number(0, 20, "15", 170, P.gold)}`, pop(a - 4.17)) : "";
  return { g: layer(wall + plugs + units, c) + cnt, in: [960, 540], inC: P.cream };
}
// ---- 4: the travel adapter makes peace (host right) ----
function s4(a, tot, s, layout) {
  const L = layout || { x: 760, y: 1000, k: 1.6 };
  const c = camAt(a, [[0, L.x, L.y - 420, 1.0], [3.46, L.x, L.y - 440, 1.06]]);
  const open = seg(a, 0.98, 1.4), rise = ease(seg(a, 1.4, 2.0)), join = ease(seg(a, 2.07, 2.6));
  const adapter = `${two(rr(-90, -90, 180, 180, 24), "#2b2350", "#1c1638", 8, 8)}<circle r="34" fill="none" stroke="${E.el}" stroke-width="8"/>`;
  const plugL = at(lerp(-420, -170, join), 0, `<path d="M-400 0H-80" stroke="#ece8ff" stroke-width="22"/>` + at(0, 0, plugFace(1, 130), 1, 90));
  const plugR = at(lerp(420, 170, join), 0, `<path d="M80 0H400" stroke="#ece8ff" stroke-width="22"/>` + at(0, 0, plugFace(3, 130), 1, -90));
  const shake = a > 2.58 ? rings(0, 0, 160 + 60 * seg(a, 2.58, 3.0), P.gold, 0.25 * (1 - seg(a, 2.9, 3.4)), 1.3) + at(0, -190, `<path d="M-30 0L0 -30L30 0L0 30Z" fill="${P.gold}"/>`, pop(a - 2.6)) : "";
  const g = sky(c, tot, 13) + layer(`<rect x="-900" y="${L.y}" width="3800" height="900" fill="${P.ground}"/>` + at(L.x, L.y, suitcase(open), L.k) + (rise > 0 ? at(L.x, L.y - (180 + 200 * rise) * L.k, (join > 0 ? plugL + plugR : "") + adapter + shake, L.k) : ""), c);
  return { g, in: [960, 540], inC: "#b06a35" };
}
// ---- 5: current heats the wire ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [6.39, 960, 540, 1.06]]), Y = 560;
  const heat = seg(a, 2.57, 3.2), more = seg(a, 3.83, 4.6), out = seg(a, 5.0, 5.8);
  const col = mix(E.cu, "#ff5a2a", 0.5 * heat + 0.5 * more);
  const wireW = 60;
  const dots = Array.from({ length: 18 }, (_, i) => { const q = ((tot * (0.25 + 0.5 * more) + i / 18) % 1); return `<circle cx="${(260 + q * 1200).toFixed(0)}" cy="${Y + (i % 3 - 1) * 12}" r="9" fill="${E.el}"/>`; }).join("");
  const waves = heat > 0 ? Array.from({ length: 7 }, (_, i) => { const q = ((tot * 0.6 + i / 7) % 1), x = 340 + i * 200; return `<path d="M${x} ${Y - 60 - q * 260}q20 -30 0 -60q-20 -30 0 -60" fill="none" stroke="#ff8a5c" stroke-width="8" stroke-linecap="round" opacity="${((0.3 + 0.5 * out) * (1 - q) * heat).toFixed(2)}"/>`; }).join("") : "";
  const th = at(1600, 760, `${two(rr(-30, -420, 60, 420, 30), P.cream, P.creamD, 4, 0)}<circle cx="0" cy="20" r="56" fill="${P.red}"/><path d="${rr(-16, -400 * (0.15 + 0.45 * heat + 0.4 * more), 32, 400 * (0.15 + 0.45 * heat + 0.4 * more) + 20, 16)}" fill="${P.red}"/>`, pop(a - 2.5));
  const g = sky(c, tot, 17) + layer(`<path d="M200 ${Y}H1500" stroke="${E.cuD}" stroke-width="${wireW + 16}" stroke-linecap="round"/><path d="M200 ${Y}H1500" stroke="${col}" stroke-width="${wireW}" stroke-linecap="round"/>` + (heat > 0 ? `<path d="M200 ${Y}H1500" stroke="#ffb07a" stroke-width="${wireW + 60}" stroke-linecap="round" opacity="${(0.15 * (heat + more)).toFixed(2)}"/>` : "") + dots + waves + th, c);
  return { g, in: [960, 540], inC: E.cuD };
}
// ---- 6: the same power two ways ----
function s6(a, tot, s, layout) {
  const L = layout || { x0: 380, x1: 1720, y1: 360, y2: 760, lab: 230 };
  const c = camAt(a, L.cam || [[0, 960, 540, 1.0], [6.34, 960, 540, 1.02]]);
  const p1 = seg(a, 1.87, 2.7), p2 = seg(a, 3.38, 4.2), loss = seg(a, 5.0, 5.4);
  const lane = (y, w, colr, n, sp, on) => { if (on <= 0) return ""; let d = `<path d="M${L.x0} ${y}H${lerp(L.x0, L.x1, on)}" stroke="${colr}" stroke-width="${w}" stroke-linecap="round" opacity=".9"/>`;
    for (let i = 0; i < n; i++) { const q = ((tot * sp + i / n) % 1); if (q < on) d += `<circle cx="${lerp(L.x0, L.x1, q).toFixed(0)}" cy="${y + ((i % 3) - 1) * w * 0.22}" r="${Math.max(6, w * 0.12)}" fill="#ffffff" opacity=".7"/>`; } return d; };
  const sparks = loss > 0 ? Array.from({ length: 12 }, (_, i) => { const q = ((tot * 0.9 + rnd(i) ) % 1); return `<circle cx="${(L.x0 + 80 + rnd(i * 3) * (L.x1 - L.x0 - 160)).toFixed(0)}" cy="${(L.y1 + 70 + q * 160).toFixed(0)}" r="${(12 * (1 - q) + 3).toFixed(1)}" fill="#ff8a5c" opacity="${(loss * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const g1 = p1 > 0 ? at(L.lab, L.y1 - 120, tagV("LOW V", "", { size: 60, fill: P.cream }), pop(a - 1.87)) : "", g2 = p2 > 0 ? at(L.lab, L.y2 - 120, tagV("HIGH V", "", { size: 60 }), pop(a - 3.38)) : "";
  const g = sky(c, tot, 19) + layer(lane(L.y1, 110, "#ff5a2a", 10, 0.3, p1) + (p1 > 0 ? `<path d="M${L.x0} ${L.y1}H${lerp(L.x0, L.x1, p1)}" stroke="#ff8a5c" stroke-width="190" stroke-linecap="round" opacity="${(0.12 + 0.1 * loss).toFixed(2)}"/>` : "") + lane(L.y2, 26, E.el, 8, 0.6, p2) + sparks + g1 + g2
    + (loss > 0 ? cross(L.x1 + 70, L.y1, 50, P.red, a - 5.2) + check(L.x1 + 70, L.y2, 50, P.green, a - 5.6) : ""), c);
  return { g, in: [960, 540], inC: "#ff5a2a" };
}
// ---- 7: a thousand cars or one train ----
function s7(a, tot, s, layout) {
  const L = layout || { road: 470, rail: 860, w: 1920 };
  const c = camAt(a, L.cam || [[0, 960, 600, 0.95], [5.66, 960, 620, 1.0]]);
  const fill = seg(a, 1.2, 2.4);
  let cars = ""; const N = 46; for (let i = 0; i < N; i++) { if (i / N > fill) continue; const row = i % 3, x = -200 + Math.floor(i / 3) * 150 + row * 50 + 4 * Math.sin(tot * 3 + i), y = L.road - 40 + row * 70;
    cars += at(x * 1.25 - 100, y, car(["#ff8a3c", "#22c7b8", "#ffd04a", "#ff5fa2", "#3fa9ff"][i % 5], "#13324a"), 0.7); }
  const smoke = a > 2.71 ? Array.from({ length: 10 }, (_, i) => { const q = ((tot * 0.4 + i / 10) % 1); return `<circle cx="${(-100 + i * 220 + 20 * Math.sin(tot + i)).toFixed(0)}" cy="${(L.road - 60 - q * 220).toFixed(0)}" r="${(26 + q * 50).toFixed(0)}" fill="#5f7480" opacity="${(0.4 * (1 - q) * seg(a, 2.71, 3.2)).toFixed(2)}"/>`; }).join("") : "";
  const tx = lerp(-900, L.w / 2, easeOut(seg(a, 3.5, 4.3))) + 260 * seg(a, 4.3, 5.66), trainG = a > 3.5 ? at(tx, L.rail, train(1100), 1.25) : "";
  const tag = a > 4.47 ? at(clamp(tx, 400, L.w - 300), L.rail - 300, tagV("HIGH V", "", { size: 70 }), pop(a - 4.47)) : "";
  const g = sky(c, tot, 23) + layer(`<rect x="-900" y="${L.road - 120}" width="${L.w + 1800}" height="260" fill="${P.road}"/><rect x="-900" y="${L.road + 140}" width="${L.w + 1800}" height="${L.rail - L.road - 140}" fill="${P.ground}"/>
    <rect x="-900" y="${L.rail}" width="${L.w + 1800}" height="30" fill="${P.steelD}"/><rect x="-900" y="${L.rail + 30}" width="${L.w + 1800}" height="600" fill="${P.ground}"/>` + cars + smoke + trainG + tag + (a > 0.6 ? at(L.w / 2, 150, tagV("1,000", "", { size: 80, fill: P.cream }), pop(a - 0.6)) : ""), c);
  return { g, in: [960, 540], inC: P.road };
}
// ---- 8: transformers work only on AC (host left: lower left kept clear) ----
function s8(a, tot, s, layout) {
  const L = layout || { ac: [820, 560], dc: [1440, 560], plates: [[820, 940], [1440, 940]], k: 1.5 };
  const c = camAt(a, L.cam || [[0, 1100, 540, 1.0], [5.46, 1120, 540, 1.03]]);
  const acIn = seg(a, 1.85, 2.6), dcIn = seg(a, 2.0, 2.8);
  const box = (x, y, hum, inner, ok, t0) => at(x, y, at(0, 160 * L.k, xfBox(tot, hum), 0.9 * L.k) + at(0, 0, inner, L.k) + (ok === 1 ? check(170 * L.k, -260 * L.k, 56, P.green, a - t0) : ok === 0 ? cross(170 * L.k, -260 * L.k, 56, P.red, a - t0) : ""));
  const acW = acIn > 0 ? drawn(sine(-300, 0, -60, 24, 3, -tot * 10), acIn, P.gold, 10) : "", dcL = dcIn > 0 ? `<path d="M-300 -60H${lerp(-300, 0, dcIn)}" stroke="${E.el}" stroke-width="10" stroke-linecap="round"/>` : "";
  const t = at(L.plates[0][0], L.plates[0][1], plate("TESLA", 64), pop(a - 4.5)) + (a > 4.6 ? check(L.plates[0][0] + 190, L.plates[0][1], 40, P.green, a - 4.7) : "");
  const e = at(L.plates[1][0], L.plates[1][1], plate("EDISON", 64, { fill: "#9fb3c8" }), pop(a - 5.0));
  const g = sky(c, tot, 29) + layer(`<rect x="-900" y="${L.ac[1] + 160 * L.k}" width="3800" height="1400" fill="${P.ground}"/>` + box(L.ac[0], L.ac[1], seg(a, 2.42, 2.7), acW, a > 2.42 ? 1 : -1, 2.5) + box(L.dc[0], L.dc[1], 0, dcL, a > 2.72 ? 0 : -1, 2.8) + t + e, c);
  return { g, in: [960, 540], inC: "#3d7a6a" };
}
// ---- 9: losses on the way, ~5%; old lines lose more; a hook steals ----
function s9(a, tot) {
  const c = camAt(a, [[0, 960, 420, 1.0], [4.2, 960, 420, 1.0], [4.6, 960, 620, 0.9], [7.6, 980, 640, 0.92], [8.4, 1300, 720, 1.2], [10.52, 1320, 720, 1.25]]);
  const Y1 = 300, Y2 = 760, xs = [200, 700, 1200, 1700, 2200];
  const lineA = xs.map((x) => at(x, Y1 + 420, pylon(420))).join("") + xs.slice(1).map((x, i) => span([xs[i], Y1 + 10], [x, Y1 + 10], 26, "#16113a", 6)).join("");
  const old = a > 4.2 ? xs.map((x, i) => at(x + 60, Y2 + 420, pole(420 - 20 * (i % 2)), [1, 1], (i % 2 ? 4 : -3))).join("") + xs.slice(1).map((x, i) => span([xs[i] - 20, Y2 + 30], [x - 20, Y2 + 30], 60, "#16113a", 6)).join("") : "";
  const sp = (n, y, w, on, col) => on <= 0 ? "" : Array.from({ length: n }, (_, i) => { const q = ((tot * 0.8 + rnd(i * 7 + y)) % 1), x = 220 + rnd(i * 11 + y) * w; return `<circle cx="${x.toFixed(0)}" cy="${(y + 40 + q * 300).toFixed(0)}" r="${(10 * (1 - q) + 3).toFixed(1)}" fill="${col}" opacity="${(on * (1 - q)).toFixed(2)}"/>`; }).join("");
  const flow = drawn(`M200 ${Y1 + 10}H2200`, seg(a, 0.3, 1.3), P.gold, 5);
  const usa = a > 2.04 ? at(tall() ? 600 : 1560, tall() ? 330 : 150, `${at(-230, 0, flag("us", 130))}${tagV("~5", "%", { size: 92 })}`, pop(a - 2.04)) : "";
  const hook = a > 7.86 ? at(1340, Y2 + 70, `<path d="M0 0Q30 -40 0 -60" stroke="${P.steel}" stroke-width="12" fill="none"/>${drawn("M0 0Q120 160 240 360", seg(a, 8.0, 8.6), "#2b2350", 10)}`, pop(a - 7.86)) + (a > 9.74 ? at(1580, Y2 + 400, `${two(rr(-90, -120, 180, 120, 8), "#5a4630", "#3d2f20", 0, 8)}<path d="${rr(-30, -90, 60, 40, 6)}" fill="${P.win}"/>`, pop(a - 9.74)) + rings(1340, Y2 + 70, 60, P.red, 0.3, 1.4) : "") : "";
  const g = sky(c, tot, 31) + layer(`<rect x="-900" y="${Y1 + 420}" width="3800" height="${Y2 - Y1}" fill="${P.ground}" opacity=".6"/><rect x="-900" y="${Y2 + 420}" width="3800" height="600" fill="${P.ground}"/>` + lineA + flow + sp(10, Y1, 1900, seg(a, 1.06, 1.6), P.gold) + old + sp(34, Y2, 1900, seg(a, 6.43, 7.0), "#ff8a5c") + hook, c) + usa;
  return { g, in: [960, 540], inC: P.night1 };
}
// ---- 10: the bare line, the air gap, the skull (host right: lower right kept clear) ----
function s10(a, tot, s, layout) {
  const L = layout || { px: 1180, g: 1000, h: 900, kx0: 300, kx1: 660, ky: 360 };
  const c = camAt(a, L.cam || [[0, 960, 520, 1.0], [3.4, 960, 500, 1.05], [6.9, 900, 480, 1.1], [10.89, 880, 480, 1.12]]);
  const tips = pylonTips(L.h), wy = L.g + tips[0][1] + L.h * 0.06;
  const wire = `<path d="M-900 ${wy}H${L.px + tips[0][0]}" stroke="#9fb3c8" stroke-width="8"/>`;
  const air = seg(a, 3.42, 4.2), halo = air > 0 ? `<path d="M-900 ${wy}H${L.px + tips[0][0]}" stroke="${E.el}" stroke-width="${60 + 10 * Math.sin(tot * 4)}" opacity="${(0.12 * air).toFixed(3)}"/>` : "";
  const kx = lerp(L.kx0, L.kx1, ease(seg(a, 4.78, 6.9))) + 14 * Math.sin(tot * 1.7), ky = L.ky + 30 * Math.sin(tot * 2.1) + 120 * ease(seg(a, 4.78, 6.9)), gap = seg(a, 7.46, 8.0);
  const jump = gap > 0 && gap < 1 ? spark([kx, ky - 110], [kx + 40, wy], 1, 9) : "", after = gap >= 1 ? rings(kx, ky, 60, "#ff8a5c", 0.2 * (1 - seg(a, 8.0, 9.0)), 1.4) : "";
  const sign = a > 9.24 ? at(L.px, L.g - L.h * 0.42, skullSign(70), pop(a - 9.24)) : "";
  const noJacket = a > 1.98 && a < 3.4 ? at(L.kx1 - 120, wy - 120, cross(0, 0, 44, P.red, a - 1.98)) : "";
  const g = sky(c, tot, 37) + layer(hills(131, -900, 3200, L.g - 60, 140, E.hill), c, 0.6) + layer(`<rect x="-900" y="${L.g}" width="3800" height="900" fill="${P.ground}"/>` + at(L.px, L.g, pylon(L.h)) + halo + wire + `<path d="M${kx} ${ky + 130}Q${kx - 200} ${ky + 400} ${kx - 360} ${L.g}" stroke="${P.cream}" stroke-width="3" fill="none"/>` + at(kx, ky, kite(tot), 0.8, -12) + jump + after + noJacket + sign, c);
  return { g, out: [960, 540], outC: P.night1 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
export const tripSet = makeSet(SHOTS, V, P);
export { s0, s3, s4, s6, s7, s8, s10, sky, tall, bump, G2, TRIP };
