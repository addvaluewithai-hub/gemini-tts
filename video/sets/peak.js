// "Peak hour" of electricity part 2 of 4: four shots, nothing to read but hours, "2 h" and price marks ($).
//   0 a day across the frame: the sky turns from night to dawn to day to dusk to night as a sun/moon crosses; under it the
//     demand curve draws itself: low at dawn («الفجر»), up in the morning («الصبح»), highest after sunset («المغرب»), when
//     the town under the curve lights up window by window («يرجع البيت ويشغّل كل حاجة»)
//   1 two stations side by side: the left one always running (lit, smoking) on «طول الوقت»; the right one dark and asleep
//     («مطفية»), wakes on «وتشتغل», a "2 h" clock pops on «ساعتين», the peak of the curve glows over it on «للذروة»; a
//     price tag "$$$" swings on it on «أغلى»
//   2 a heat wave: a big hot sun over the teal and orange houses, air conditioners pop on every wall («التكييفات»), the
//     curve hits a red top line; a snowflake on «موجة برد»; then the grid is drawn as a row of stations sized to that top
//     line («أسوأ ساعة»), and on «نصها قاعد» half of them go dark with "z". Host right: the lower right is kept clear.
//   3 a price tag that changes with the clock's hand («من ساعة لساعة»); a washing machine under the moon with "$"
//     («نص الليل») and the same machine under the sunset with "$$$" («المغرب»)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH, portrait } from "./kit.js";
import { P, E, mix, stars, skyline, house, pop, station } from "./elec.js";
import { V } from "./peak.v.js";

// the demand of one day: hour 0..24 -> 0..1 (low at dawn, a morning rise, the evening peak)
const demand = (h) => 0.25 + 0.18 * Math.exp(-((h - 9) ** 2) / 8) + 0.12 * Math.exp(-((h - 14) ** 2) / 10) + 0.5 * Math.exp(-((h - 19.5) ** 2) / 3.2) - 0.12 * Math.exp(-((h - 4) ** 2) / 4);
// the sky colour at hour h
const skyAt = (h) => { const d = Math.max(0, Math.sin(((h - 6) / 12) * Math.PI)), dawn = Math.exp(-((h - 6.2) ** 2) / 1.2) + Math.exp(-((h - 18.6) ** 2) / 1.2);
  return mix(mix("#041624", "#2f7fa3", d), "#ff9a4a", clamp(dawn * 0.55)); };
const curvePath = (x0, x1, yb, H, p) => { let d = ""; const N = 96; for (let i = 0; i <= N * p; i++) { const h = (i / N) * 24; d += (i ? "L" : "M") + lerp(x0, x1, i / N).toFixed(1) + " " + (yb - H * demand(h)).toFixed(1); } return d; };
const sleepZ = (t, on) => (on <= 0 ? "" : [0, 1, 2].map((i) => { const q = ((t * 0.5 + i / 3) % 1); return text(30 + q * 50, -40 - q * 120, "z", 40 + q * 30, "#cfe6f0", { opacity: (on * (1 - q)).toFixed(2) }); }).join(""));
const ac = (on) => `${two(rr(-60, -40, 120, 80, 10), "#ece8ff", "#c6c0e6", 6, 6)}${[0, 1, 2, 3].map((i) => `<path d="M-44 ${-24 + i * 14}h88" stroke="#9aa6d8" stroke-width="5"/>`).join("")}${on > 0 ? `<circle cx="44" cy="-26" r="7" fill="${P.green}"/>` : ""}`;
const priceTag = (n, k = 1, c = P.gold) => at(0, 0, `${two("M-40 -54h150l44 54l-44 54h-150Z", P.cream, P.creamD, 0, 6)}<circle cx="-20" cy="0" r="10" fill="${P.ink}"/>${text(60, 22, "$".repeat(n), 62, c === P.gold ? "#8a5200" : c)}`, k);
const washer = (spin) => `${two(rr(-130, -300, 260, 300, 24), "#ece8ff", "#c6c0e6", 10, 8)}<path d="${rr(-110, -284, 220, 40, 10)}" fill="#c6c0e6"/><circle cy="-120" r="88" fill="#16323f"/><circle cy="-120" r="70" fill="#2f86d6"/>${[0, 1, 2].map((i) => `<path d="M0 -120l0 -64" stroke="#9fd6ff" stroke-width="12" stroke-linecap="round" transform="rotate(${spin + i * 120} 0 -120)"/>`).join("")}`;

// ---- 0: one day of demand ----
function s0(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 560, 1.0], [8.08, 960, 560, 1.0]]) : camAt(a, [[0, 960, 540, 1.0], [8.08, 960, 540, 1.04]]);
  const hour = kf(a, [[0, 0], [2.78, 5.5], [3.81, 9], [5.4, 19], [7.6, 21.5]], (p) => p);
  const X0 = v ? 340 : 140, X1 = v ? 1580 : 1780, YB = v ? 880 : 900, H = v ? 560 : 560;
  const sunX = lerp(X0, X1, hour / 24), sunY = YB - 120 - 520 * Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI)), up = hour > 6 && hour < 18.5;
  const body = up ? `${rings(sunX, sunY, 90, "#ffe7a0", 0.25)}<circle cx="${sunX}" cy="${sunY}" r="60" fill="#ffd98a"/>` : `<circle cx="${sunX}" cy="${YB - 600}" r="44" fill="${P.cream}"/><circle cx="${sunX - 16}" cy="${YB - 612}" r="40" fill="${skyAt(hour)}"/>`;
  // the town under the curve lights window by window after sunset
  const townLit = seg(a, 6.3, 7.8);
  let wins = ""; for (let i = 0; i < 40; i++) { const x = X0 + 20 + (i % 20) * ((X1 - X0 - 40) / 20), y = YB + 40 + Math.floor(i / 20) * 50, on = rnd(i * 7) < townLit; wins += `<path d="${rr(x, y, 30, 30, 4)}" fill="${on ? P.win : "#0a2638"}"/>`; }
  const town = `<rect x="${X0 - 40}" y="${YB + 20}" width="${X1 - X0 + 80}" height="${v ? 140 : 130}" rx="16" fill="#0c2f42"/>` + wins;
  const p = clamp(hour / 24);
  const axis = `<path d="M${X0} ${YB}H${X1}" stroke="#2c5d73" stroke-width="6"/>`;
  const curve = drawn(curvePath(X0, X1, YB, H, 1), p, P.gold, 14, 'stroke-linejoin="round"');
  const tip = p > 0.02 ? rings(lerp(X0, X1, p), YB - H * demand(hour), 26, P.gold, 0.5, 1.6) : "";
  const peakGlow = a > 5.4 ? rings(lerp(X0, X1, 19.5 / 24), YB - H * demand(19.5), 70, P.gold, 0.2 * seg(a, 5.4, 5.8), 1.4) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="${skyAt(hour)}"/>` + layer(stars(17, 70, -400, 2400, 600, tot), c, 0.15, ) + layer(body + axis + curve + tip + peakGlow + town, c);
  return { g, out: toScreen(c, lerp(X0, X1, 19.5 / 24), YB - H * demand(19.5)), outC: P.gold, outZ: 16 };
}

// ---- 1: base stations and peak stations ----
function s1(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 700, 1.0], [7.18, 960, 720, 1.0]]) : camAt(a, [[0, 960, 560, 1.05], [7.18, 960, 560, 1.0]]);
  const G = v ? 1500 : 900, LX = v ? 960 : 560, RX = v ? 960 : 1300, LY = v ? 700 : G, RY = v ? 1500 : G;
  const wake = ease(seg(a, 3.24, 3.7));
  const left = at(LX, LY, (a > 0.3 ? rings(0, -150, 260, P.gold, 0.12, 1.3) : "") + station(tot, { lit: 1 }), (v ? 0.85 : 0.9) * pop(a - 0.3));
  const right = a > 1.77 ? at(RX, RY, (wake > 0 ? rings(0, -150, 260, P.gold, 0.12 * wake, 1.3) : "") + station(tot, { lit: wake, smoke: wake > 0.5 }) + at(120, -360, sleepZ(tot, 1 - wake)), (v ? 0.85 : 0.9) * pop(a - 1.77)) : "";
  const clock = a > 3.77 ? at(RX + (v ? 300 : 340), (v ? RY - 420 : RY - 420), `${disc(0, 0, 70, P.cream, P.creamD, 0.08)}<circle r="54" fill="#fffaec"/><path d="M0 0V-40M0 0L28 12" stroke="${P.ink}" stroke-width="7" stroke-linecap="round"/>${at(0, 120, `${two(rr(-70, -36, 140, 72, 36), P.ink, "#0d0826", 0, 6)}${text(0, 22, "2 h", 54, P.gold)}`)}`, pop(a - 3.77)) : "";
  // the evening peak over the sleeping station
  const pk = a > 4.83 ? at(RX, (v ? RY - 820 : RY - 700), `<path d="M-260 80Q-120 70 -60 -20Q0 -120 60 -20Q120 70 260 80" fill="none" stroke="${P.gold}" stroke-width="14" stroke-linecap="round"/>${rings(0, -60, 50, P.gold, 0.4)}`, pop(a - 4.83)) : "";
  const tag = a > 6.14 ? at(RX - (v ? 260 : 280), (v ? RY - 520 : RY - 420), priceTag(3, 0.9), pop(a - 6.14), 8 * Math.sin(tot * 3)) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(5, 90, -600, 2600, 900, tot), c, 0.15) + layer(`<rect x="-900" y="${G}" width="3800" height="900" fill="${P.ground}"/>` + (v ? `<rect x="-900" y="${LY}" width="3800" height="24" fill="#0d3a4e"/>` : "") + left + right + clock + pk + tag, c);
  return { g, in: toScreen(c, RX, (v ? RY - 820 : RY - 700) - 60), inC: P.gold };
}

// ---- 2: the worst hour of the year ----
function s2(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 640, 1.0], [9.46, 960, 680, 0.98]]) : camAt(a, [[0, 900, 520, 1.05], [5.0, 860, 520, 1.0], [9.46, 860, 540, 0.96]]);
  const G = v ? 1000 : 720, heat = seg(a, 1.6, 2.2) * (1 - seg(a, 4.6, 4.9)), cold = seg(a, 4.6, 4.9) * (1 - seg(a, 5.2, 5.5));
  const SX = v ? 960 : 330, SY = v ? 280 : 200;
  const sun = heat > 0 ? `${rings(SX, SY, 170 * (1 + 0.04 * Math.sin(tot * 3)), "#ff8a3c", 0.25 * heat, 1.5)}<circle cx="${SX}" cy="${SY}" r="130" fill="#ffb04a" opacity="${heat.toFixed(2)}"/>` : "";
  const flake = cold > 0 ? at(SX, SY, [0, 1, 2].map((i) => `<path d="M0 -110V110" stroke="#dff6ff" stroke-width="16" stroke-linecap="round" transform="rotate(${i * 60})"/>`).join(""), cold) : "";
  const hx = v ? [740, 1180] : [640, 1180];
  const HK = v ? 1.3 : 1.6, houses = at(hx[0], G, house(E.houseA, E.houseAD, { roof: E.roof }), HK) + at(hx[1], G, house(E.houseB, E.houseBD, { roof: E.roof }), HK);
  const acs = a > 2.95 ? [[hx[0] - 95, G - 120], [hx[0] + 95, G - 120], [hx[1] - 95, G - 120], [hx[1] + 95, G - 120]].map(([x, y], i) => at(x, y, ac(1), 0.95 * pop(a - 2.95 - i * 0.08))).join("") : "";
  // the curve rises to a red top line
  const CX0 = v ? 420 : 160, CX1 = v ? 1500 : 1500, CY = v ? 1500 : 1000;
  const cv = a > 3.4 && a < 5.3 ? drawn(`M${CX0} ${CY}Q${(CX0 + CX1) / 2} ${CY - 40} ${CX1 - 220} ${CY - 220}`, seg(a, 3.4, 3.9), P.gold, 12) + (a > 3.9 ? `<path d="M${CX0} ${CY - 230}H${CX1}" stroke="${P.red}" stroke-width="8" stroke-dasharray="26 16" opacity="${seg(a, 3.9, 4.1).toFixed(2)}"/>` : "") : "";
  // the grid sized for the worst hour: a row of stations, half go to sleep
  const sized = seg(a, 5.3, 5.8), sleep = seg(a, 8.2, 8.6);
  const row = sized > 0 ? Array.from({ length: 6 }, (_, i) => { const x = v ? 600 + (i % 3) * 360 : 170 + i * 260, y = v ? 1300 + Math.floor(i / 3) * 260 : 1020, off = i >= 3 ? sleep : 0;
    return at(x, y, station(tot, { lit: 1 - off, smoke: off < 0.5 }) + at(150, -340, sleepZ(tot, off)), (v ? 0.42 : 0.4) * pop(a - 5.3 - i * 0.07)); }).join("") : "";
  const top = sized > 0 ? `<path d="M${v ? 340 : 60} ${v ? 1150 : 820}H${v ? 1580 : 1500}" stroke="${P.red}" stroke-width="8" stroke-dasharray="26 16" opacity="${sized.toFixed(2)}"/>` : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(29, 80, -600, 2600, 700, tot), c, 0.15)
    + layer(sun + flake + `<rect x="-900" y="${G}" width="3800" height="${v ? 140 : 900}" fill="${P.ground}"/>` + houses + acs + (sized > 0 ? "" : cv) + top + row, c);
  return { g };
}

// ---- 3: the price changes by the hour ----
function s3(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 640, 1.0], [6.44, 960, 660, 1.0]]) : camAt(a, [[0, 960, 520, 1.05], [6.44, 960, 540, 1.0]]);
  const hand = kf(a, [[1.4, 0], [2.9, 360]]), n = a < 1.96 ? 2 : 1 + (Math.floor(hand / 90) % 3);
  const clockX = v ? 960 : 960, clockY = v ? 220 : 210;
  const clk = at(clockX, clockY, `${disc(0, 0, 110, P.cream, P.creamD, 0.08)}<circle r="88" fill="#fffaec"/><path d="M0 0L${70 * Math.sin((hand * Math.PI) / 180)} ${-70 * Math.cos((hand * Math.PI) / 180)}" stroke="${P.ink}" stroke-width="9" stroke-linecap="round"/><circle r="10" fill="${P.ink}"/>`, 1.4 * pop(a - 0.1));
  const tag0 = a < 3.3 ? at(clockX + 300, clockY, priceTag(n, 1.4), pop(a - 1.39) * (1 - seg(a, 3.0, 3.3))) : "";
  const L = v ? [960, 860] : [560, 900], R = v ? [960, 1480] : [1360, 900];
  const night = a > 3.37 ? at(L[0], L[1], `<circle cx="-230" cy="-420" r="60" fill="${P.cream}"/><circle cx="-250" cy="-434" r="54" fill="#041624"/>` + washer(a > 4.2 ? (a - 4.2) * 300 : 0) + at(40, -440, priceTag(1, 0.7, P.green), pop(a - 4.51)), (v ? 1.15 : 1.35) * pop(a - 3.37)) : "";
  const dusk = a > 4.96 ? at(R[0], R[1], `${rings(230, -420, 90, "#ff9a4a", 0.25)}<circle cx="230" cy="-420" r="64" fill="#ffb04a"/>` + washer((a - 5.0) * 300) + at(-60, -440, priceTag(3, 0.7, P.red), pop(a - 5.9), -6), (v ? 1.15 : 1.35) * pop(a - 4.96)) : "";
  const G = v ? 1480 : 900;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(37, 80, -600, 2600, 800, tot), c, 0.15) + layer(`<rect x="-900" y="${G}" width="3800" height="900" fill="${P.ground}"/>` + (v ? `<rect x="-900" y="900" width="3800" height="20" fill="#0d3a4e"/>` : "") + clk + tag0 + night + dusk, c);
  return { g, in: toScreen(c, clockX, clockY), inC: P.cream };
}

export const SHOTS = [s0, s1, s2, s3];
export const peakSet = makeSet(SHOTS, V, P);
