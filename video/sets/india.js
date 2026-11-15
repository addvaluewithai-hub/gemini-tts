// "2012" (electricity part 3 of 4): the largest outage in their history.
//   0 India at night, lit; July 2012; it goes dark, comes back, and goes dark again, larger
//   1 a hot sun; states as boxes drawing more than their share (arrows bigger than their slots); lines overloaded red
//   2 the dark map: 600,000,000+; a train stopped mid-track with its lights on; a mine lift stuck, then rising; half the map dark at once
// No people: trains and lifts are lit machines, crowds are lights.
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./india.v.js";
import { P, E, mix, pop, plate, tagV } from "./elec.js";
import { calPage } from "./props.js";
import { RED, sky, bump } from "./balance.js";

const LAND = "#164a62", LANDD = "#0f3a4f", DARK = "#0a2433";
// India, stylised, about 560..1360 x 140..980
export const INDIA = "M760 150L860 140L930 200L900 260L980 300L1080 290L1160 330L1260 320L1340 360L1320 420L1240 440L1200 480L1150 470L1120 520L1080 600L1020 680L960 780L900 870L860 960L820 980L790 900L760 800L720 700L680 640L620 600L570 560L600 500L660 470L640 420L700 380L700 300L740 240Z";
const CITY = [[760, 330], [850, 400], [700, 500], [800, 520], [920, 470], [1040, 420], [1150, 400], [1250, 380], [880, 600], [960, 560], [800, 680], [900, 760], [850, 860], [1000, 640], [740, 600]];
// a city lights `on` 0..1; dark is a 0..1 front: cities with x below lerp(500, 1400, dark) go out (or all, by mask)
export const india = (on, tot, o = {}) => { const dk = (x, y) => (o.darkAll !== undefined ? o.darkAll : clamp((o.dark || 0) * 1.25 - (y - 140) / 1100));
  const land = two(INDIA, mix(LAND, DARK, o.landDark || 0), LANDD, 0, 10);
  const dots = CITY.map(([x, y], i) => { const l = on * (1 - dk(x, y)), fl = 0.85 + 0.15 * Math.sin(tot * 5 + i * 2); return `${l > 0.05 ? rings(x, y, 30, P.win, 0.32 * l * fl, 1.5) : ""}<circle cx="${x}" cy="${y}" r="12" fill="${mix("#21485a", P.win, l)}"/>`; }).join("");
  const lines = [[0, 1], [1, 3], [2, 3], [3, 9], [1, 4], [4, 5], [5, 6], [6, 7], [9, 8], [8, 10], [10, 11], [11, 12], [9, 13], [2, 14], [14, 10], [4, 9]].map(([i, j]) => { const l = on * (1 - Math.max(dk(...CITY[i]), dk(...CITY[j]))); return `<path d="M${CITY[i].join(" ")}L${CITY[j].join(" ")}" stroke="${mix("#2a5a72", o.lineCol || E.el, l)}" stroke-width="5" opacity="${(0.4 + 0.5 * l).toFixed(2)}"/>`; }).join("");
  return land + lines + dots; };

// ---- 0: July 2012: dark, back, dark again bigger ----
function s0(a, tot, s, o = {}) {
  const c = camAt(a, o.vert ? [[0, 990, 560, 1.28], [3.3, 990, 560, 1.24], [6.72, 990, 560, 1.22]] : [[0, 1000, 560, 1.34], [3.3, 990, 560, 1.24], [6.72, 990, 560, 1.2]]);
  const on = ease(seg(a, 0.1, 0.9));
  const d1 = ease(seg(a, 3.79, 4.05)) * (1 - ease(seg(a, 4.35, 4.7))), d2 = ease(seg(a, 5.07, 5.9));
  const dark = Math.max(0.5 * d1, d2);
  const map = india(on, tot, { dark });
  const pl = at(o.vert ? 1120 : 1480, o.vert ? 1020 : 300, plate("INDIA", 50), pop(a - 1.51));
  const cal = a > 2.0 ? at(o.vert ? 960 : 400, o.vert ? 60 : 330, calPage("2012", "JULY", 0.8, 150), pop(a - 2.04)) : "";
  const blink = a > 3.79 && a < 3.95 ? `<rect width="${FW}" height="${FH}" fill="#000" opacity=".25"/>` : "";
  const g = sky(c, tot, 91) + layer(map + pl + cal, c) + blink;
  return { g, out: toScreen(c, 1150, 400), outC: "#ffd27a" };
}

// ---- 1: heat; states drawing more than their share; lines overloaded ----
// layout: o.vert stacks the four states in a 2x2 block below the sun (portrait)
function s1(a, tot, s, o = {}) {
  const c = camAt(a, o.vert ? [[0, 960, 900, 1.04], [4.92, 960, 900, 1.0]] : [[0, 960, 540, 1.04], [4.92, 960, 540, 1.0]]);
  const sunR = 150 * pop(a - 0.1), sx = o.vert ? 960 : 330, sy = o.vert ? 260 : 270;
  const sun = `${rings(sx, sy, sunR * 1.5 * (1 + 0.04 * Math.sin(tot * 3)), "#ffb04a", 0.3, 1.4)}${disc(sx, sy, sunR, "#ffcf6b", "#ffb04a", 0.08)}` + Array.from({ length: 12 }, (_, i) => { const q = (i / 12) * Math.PI * 2 + tot * 0.2; return `<path d="M${sx + Math.cos(q) * sunR * 1.25} ${sy + Math.sin(q) * sunR * 1.25}L${sx + Math.cos(q) * sunR * 1.55} ${sy + Math.sin(q) * sunR * 1.55}" stroke="#ffcf6b" stroke-width="14" stroke-linecap="round" opacity="${(0.8 * clamp(a - 0.6)).toFixed(2)}"/>`; }).join("");
  const heat = ease(seg(a, 0.68, 1.2)), haze = heat > 0 ? [0, 1, 2, 3, 4].map((i) => `<path d="M${o.vert ? 560 + i * 200 : 640 + i * 230} ${o.vert ? 640 : 230}q30 -40 0 -80q-30 -40 0 -80" fill="none" stroke="#ffb04a" stroke-width="8" stroke-linecap="round" opacity="${(0.35 * heat * (0.6 + 0.4 * Math.sin(tot * 4 + i))).toFixed(2)}"/>`).join("") : "";
  const pos = o.vert ? [[700, 980], [1220, 980], [700, 1440], [1220, 1440]] : [[700, 640], [1040, 640], [1380, 640], [1720, 640]];
  const over = ease(seg(a, 1.81, 2.98)), red = ease(seg(a, 3.59, 4.3));
  const boxes = pos.map(([x, y], i) => { const k = pop(a - 1.36 - i * 0.12);
    const slot = `<path d="${rr(-110, -40, 220, 80, 16)}" fill="none" stroke="${P.cream}" stroke-width="6" stroke-dasharray="14 10" opacity=".7"/>`;
    const fill = `<path d="${rr(-110 - 40 * over, -40 - 14 * over, 220 + 80 * over, 80 + 28 * over, 18)}" fill="${mix(P.gold, RED, over)}" opacity=".85"/>`;
    const st = two(rr(-130, 60, 260, 170, 20), "#1f5f78", LANDD, 0, 8) + [-70, 0, 70].map((dx) => `<rect x="${dx - 20}" y="110" width="40" height="40" rx="6" fill="${P.win}"/>`).join("");
    const arrow = `<path d="M0 -150V-60" stroke="${mix(P.gold, RED, over)}" stroke-width="${18 + 16 * over}" stroke-linecap="round"/><path d="M${-34 - 14 * over} -80L0 ${-30 + 10 * over}L${34 + 14 * over} -80Z" fill="${mix(P.gold, RED, over)}"/>`;
    return at(x, y, st + slot + fill + arrow, k); }).join("");
  const lineY = o.vert ? 820 : 470, x0 = o.vert ? 520 : 560, x1 = o.vert ? 1400 : 1860;
  const wire = `<path d="M${x0} ${lineY}H${x1}" stroke="${mix(E.el, RED, red)}" stroke-width="${10 + 8 * red}"/>` + (red > 0 ? `<path d="M${x0} ${lineY}H${x1}" stroke="${RED}" stroke-width="${40 + 10 * Math.sin(tot * 9)}" opacity="${(0.2 * red).toFixed(2)}"/>` : "")
    + pos.map(([x]) => (o.vert ? "" : `<path d="M${x} ${lineY}V${lineY + 20}" stroke="${E.grid}" stroke-width="6"/>`)).join("");
  const g = sky(c, tot, 93) + layer(sun + haze + wire + boxes, c);
  return { g, in: toScreen(c, sx, sy), inC: "#ffd27a", out: toScreen(c, o.vert ? 960 : 1040, lineY), outC: DARK };
}

// ---- 2: the dark: 600,000,000+; a train; a mine lift; half the country ----
const train = (lit) => `${two(rr(-300, -90, 600, 120, 24), "#2f6178", "#214b60", 0, 8)}${[0, 1, 2, 3, 4, 5].map((i) => `<path d="${rr(-260 + i * 90, -70, 60, 46, 8)}" fill="${mix("#0a2433", P.win, lit)}"/>`).join("")}<path d="M-330 40H330" stroke="${E.grid}" stroke-width="8"/>${[-220, -80, 80, 220].map((x) => `<circle cx="${x}" cy="34" r="18" fill="#0a2433"/>`).join("")}`;
const lift = (y, lit) => `<path d="M-90 -320V340M90 -320V340" stroke="${E.grid}" stroke-width="10"/><path d="M-150 -330H150" stroke="${P.wood}" stroke-width="26"/><circle cx="0" cy="-330" r="34" fill="${P.steel}"/><path d="M0 -330V${y - 70}" stroke="${P.steelD}" stroke-width="6"/>
  <g transform="translate(0 ${y})">${two(rr(-80, -70, 160, 140, 12), "#7f93b8", "#5f7299", 0, 8)}<path d="${rr(-56, -46, 112, 60, 8)}" fill="${mix("#0a2433", P.win, lit)}"/></g>`;
function s2(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 960, 1.0], [10.66, 960, 960, 1.0]] : [[0, 1100, 560, 1.12], [4.0, 1120, 560, 1.06], [10.66, 1110, 560, 1.04]]);
  const half = ease(seg(a, 8.38, 9.4)), flash = a > 9.88 ? Math.exp(-(a - 9.88) * 6) : 0;
  const mapX = v ? 960 - 960 * 0.75 : 0, mapY = v ? 170 : 0, mk = v ? 0.75 : 1;
  const map = at(mapX, mapY, india(1, tot, { dark: lerp(0.62, 0.62, half), landDark: 0.35 + 0.3 * half }), mk);
  const cnt = a > 2.5 ? at(v ? 960 : 960, v ? 120 : 110, tagV(lerp(0, 600, ease(seg(a, 2.68, 3.7))) >= 599 ? "600,000,000+" : Math.round(lerp(0, 600, ease(seg(a, 2.68, 3.7)))) + ",000,000", "", { size: v ? 84 : 92 }), pop(a - 2.6)) : "";
  const tr = a > 4.2 ? at(v ? 960 : 1560, v ? 1040 : 380, train(1) + `<path d="M-330 ${-150}H330" stroke="none"/>`, (v ? 0.7 : 0.62) * pop(a - 4.33) * bump(a, 4.67, 0.05)) : "";
  const ly = lerp(260, -200, ease(seg(a, 7.5, 8.3))), lf = a > 5.7 ? at(v ? 960 : 1560, v ? 1500 : 790, lift(ly, 1) + `<rect x="-200" y="${120}" width="400" height="240" fill="#0a2433" opacity=".6"/>`, (v ? 0.6 : 0.62) * pop(a - 5.8)) : "";
  const dim = half > 0 ? at(mapX, mapY, `<clipPath id="indhalf"><path d="${INDIA}"/></clipPath><g clip-path="url(#indhalf)"><rect x="400" y="100" width="1100" height="${(450 * half).toFixed(1)}" fill="#04121e" opacity=".75"/></g>`, mk) : "";
  const g = sky(c, tot, 95) + layer(map + dim + cnt + tr + lf, c) + (flash > 0 ? `<rect width="${FW}" height="${FH}" fill="#fff" opacity="${(0.25 * flash).toFixed(3)}"/>` : "");
  return { g, in: toScreen(c, v ? 960 : 900, v ? 600 : 560), inC: DARK, out: toScreen(c, v ? 960 : 900, v ? 600 : 560), outC: "#04121e" };
}

const SHOTS = [s0, s1, s2];
export { s0, s1, s2 };
export const indiaSet = makeSet(SHOTS, V, P);
