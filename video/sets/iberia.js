// "2025" (electricity part 3 of 4): Spain and Portugal, dark in seconds at noon.
//   0 a sunny noon over Spain and Portugal, 28 April 2025, 12:33; everything lit
//   1 the voltage gauge climbs into red; stations unplug themselves one by one, the gauge climbs more; in seconds both
//     countries go dark; 10,000,000s; a clock to 16 h
//   2 a thick report lands, 2026; its cover opens on a question mark made of many small icons: no single cause (host right)
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./iberia.v.js";
import { P, E, mix, pop, plate, tagV, gauge, bolt } from "./elec.js";
import { calPage } from "./props.js";
import { RED, bump, plant, stopwatch } from "./balance.js";

const LAND = "#1f6a7a", LANDD = "#16505d", DARK = "#0a2433", NOON = "#3f8fb0";
// Spain and Portugal, stylised, about 520..1420 x 260..860; Portugal is the west strip
const SPAIN = "M640 300L820 270L1000 290L1180 300L1290 330L1380 380L1300 430L1280 520L1220 600L1160 700L1080 770L960 820L840 840L760 800L720 720L700 620L710 520L690 420L660 360Z";
const PORTUGAL = "M560 330L640 300L660 360L690 420L710 520L700 620L720 720L760 800L700 840L620 820L590 720L560 600L570 480L540 400Z";
const CITY = [[600, 420], [620, 640], [900, 520], [1140, 440], [1200, 640], [960, 760], [800, 380], [1030, 360]];
export const iberia = (lit, o = {}) => { const land = mix(LANDD, LAND, 0.4 + 0.6 * lit);
  return two(PORTUGAL, mix(land, "#2a7f74", 0.3), LANDD, 0, 8) + two(SPAIN, land, LANDD, 0, 8)
    + CITY.map(([x, y], i) => { const l = lit * (o.flick ? 0.8 + 0.2 * Math.sin((o.flick || 0) * 9 + i) : 1); return `${l > 0.05 ? rings(x, y, 30, P.win, 0.3 * l, 1.5) : ""}<circle cx="${x}" cy="${y}" r="12" fill="${mix("#21485a", P.win, l)}"/>`; }).join(""); };
// a day sky that dims to night by `dark`
const day = (c, dark, tot, cx = 1560, cy = 200) => `<rect width="${FW}" height="${FH}" fill="${mix(NOON, "#041624", dark)}"/>` + layer(`${rings(cx, cy, 160, "#ffe9a8", 0.3 * (1 - dark), 1.5)}<circle cx="${cx}" cy="${cy}" r="110" fill="${mix("#fff3c8", "#3a5a6a", dark)}"/>`, c, 0.2);

// ---- 0: sunny noon, 28 April 2025, 12:33 ----
function s0(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 700, 1.2], [5.51, 960, 700, 1.24]] : [[0, 960, 560, 1.0], [5.51, 960, 560, 1.06]]);
  const map = at(0, 0, iberia(ease(seg(a, 0.1, 0.7))), 1);
  const cal = a > 1.1 ? at(v ? 700 : 330, v ? 1050 : 300, calPage("2025", "28 APR", 0.85, 150), pop(a - 1.21)) : "";
  const es = a > 1.5 ? at(1050, 560, plate("SPAIN", 50), pop(a - 1.58)) : "", pt = a > 1.9 ? at(560, 900, plate("PORTUGAL", 40), pop(a - 1.95)) : "";
  const clock = a > 4.0 ? at(v ? 1220 : 1600, v ? 1050 : 820, `${two(rr(-160, -70, 320, 140, 24), "#0f2a3a", "#071c28", 0, 8)}${text(0, 34, "12:33", 92, E.el)}`, pop(a - 4.15)) : "";
  const g = day(c, 0, tot, v ? 1240 : 1560, v ? 150 : 200) + layer(map + es + pt + cal + clock, c);
  return { g, out: toScreen(c, 960, 560), outC: LAND };
}

// ---- 1: voltage up; stations unplug; both countries dark; 10,000,000s; 16 h ----
const PL = [[700, 480], [900, 640], [1100, 420], [1200, 680]];
function s1(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 860, 1.12], [12.41, 960, 860, 1.12]] : [[0, 900, 560, 1.0], [12.41, 900, 560, 1.0]]);
  const up = ease(seg(a, 0.34, 1.09)) * 0.35 + ease(seg(a, 3.76, 4.37)) * 0.3 + ease(seg(a, 4.8, 5.48)) * 0.2;
  const off = PL.map((_, i) => ease(seg(a, [1.54, 2.33, 4.8, 5.29][i], [1.54, 2.33, 4.8, 5.29][i] + 0.25)));
  const dark = ease(seg(a, 6.07, 6.9));
  const map = at(0, 0, iberia(1 - dark), 1);
  const plants = PL.map(([x, y], i) => at(x, y, plant(tot + i, 1 - Math.max(off[i], dark)) + (off[i] > 0 ? `<path d="M0 -330V${-330 - 140 * off[i]}" stroke="${E.grid}" stroke-width="10"/>` + cross(0, -470, 40, RED, (a - 1.54) * 4 * off[i]) : `<path d="M0 -330V-420" stroke="${E.el}" stroke-width="10"/>`), 0.32 * pop(a - 0.1 - i * 0.08) * bump(a, [1.54, 2.33, 4.8, 5.29][i], 0.1))).join("");
  const gx = v ? 960 : 1600, gy = v ? 260 : 300, gg = at(gx, gy, (up > 0.5 ? rings(0, 0, 130, RED, 0.25 * up, 1.4) : "") + gauge(clamp(0.45 + up), { mark: "V" }), 1.15 * pop(a - 0.2) * bump(a, 3.76, 0.06));
  const cnt = a > 8.6 ? at(v ? 960 : 900, v ? 1340 : 960, tagV("10,000,000s", "", { size: 84 }), pop(a - 8.78)) : "";
  const h16 = a > 11.3 ? at(v ? 960 : 1600, v ? 1560 : 760, `${stopwatch(clamp((a - 11.44) / 0.8) * 0.66, 70)}` + text(170, 30, "16 h", 84, P.gold), pop(a - 11.44)) : "";
  const g = day(c, dark, tot, v ? 1240 : 1560, v ? 120 : 160) + layer(map + plants + gg + cnt + h16, c);
  return { g, in: toScreen(c, 960, 560), inC: LAND, out: toScreen(c, 960, 560), outC: "#04121e" };
}

// ---- 2: the final report, 2026: no single cause (host right) ----
const ICONS = (t) => [
  `<path d="M0 30V-10" stroke="${P.wood}" stroke-width="10"/><circle cx="0" cy="-26" r="26" fill="#3ddc97"/>`,
  `${[0, 1, 2].map((i) => `<path d="M0 0L${30 * Math.cos(i * Math.PI / 3)} ${30 * Math.sin(i * Math.PI / 3)}M0 0L${-30 * Math.cos(i * Math.PI / 3)} ${-30 * Math.sin(i * Math.PI / 3)}" stroke="#e8f4ff" stroke-width="7" stroke-linecap="round"/>`).join("")}`,
  `<path d="M6 -34L-16 4H2L-6 34L18 -6H0Z" fill="${P.gold}"/>`,
  `${disc(0, 0, 28, P.cream, P.creamD, 0.1)}<path d="M0 0L14 -16" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>`,
  `<circle r="24" fill="#ffcf6b"/>`,
  `<path d="${rr(-26, -20, 52, 40, 8)}" fill="#7f93b8"/><path d="M-10 -20V-32M10 -20V-32" stroke="${P.steel}" stroke-width="6"/>`,
  `<path d="M-30 10Q-15 -20 0 10T30 10" fill="none" stroke="${E.el}" stroke-width="7"/>`,
  `<circle r="14" fill="${E.el}"/><rect x="-6" y="-2" width="12" height="4" fill="#fff"/>`];
// points along a question mark, about 300 tall, centred
const QPTS = [[-70, -110], [-50, -150], [0, -170], [50, -155], [80, -115], [75, -70], [45, -40], [15, -15], [5, 20], [5, 55], [5, 130]];
function s2(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 900, 1.0], [5.31, 960, 900, 1.04]] : [[0, 860, 540, 1.0], [5.31, 860, 540, 1.04]]);
  const x0 = v ? 960 : 760, y0 = v ? 900 : 560, land = easeOut(seg(a, 0, 0.4)), open = ease(seg(a, 2.7, 3.3));
  const book = at(x0, lerp(y0 - 600, y0, land), `${two(rr(-260, -330, 520, 660, 22), "#ece8ff", "#c6c0e6", 10, 10)}${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M-230 ${300 - i * 14}H230" stroke="#c6c0e6" stroke-width="5"/>`).join("")}
    <g transform="translate(-260 0) scale(${(1 - 1.9 * open).toFixed(3)} 1) translate(260 0)">${two(rr(-260, -330, 520, 660, 22), "#1f4f6a", "#163a50", 0, 10)}${a > 1.2 ? at(0, -120, text(0, 0, "2026", 110, P.gold), pop(a - 1.35)) : ""}<path d="M-160 40H160M-160 100H120M-160 160H140" stroke="#5f8fa8" stroke-width="16" stroke-linecap="round"/></g>`, 1 * bump(a, 0.4, 0.06));
  const ic = ICONS(tot), q = open > 0.5 ? QPTS.map(([x, y], i) => at(x0 + x * 1.5, y0 - 20 + y * 1.5, ic[i % ic.length], 1.15 * pop(a - 3.59 - i * 0.06))).join("") : "";
  const g = `<rect width="${FW}" height="${FH}" fill="#041624"/>` + layer(book + q, c);
  return { g, in: toScreen(c, x0, y0), inC: "#04121e" };
}

const SHOTS = [s0, s1, s2];
export { s0, s1, s2 };
export const iberiaSet = makeSet(SHOTS, V, P);
