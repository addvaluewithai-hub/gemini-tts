// "Rooftops" (electricity part 4 of 4): Pakistan built half a grid on its roofs.
//   0 PAKISTAN on the map with its flag on «باكستان»; the town's grid power is dear ("$$$" on «غالية») and cuts out on
//     «وبتقطع»; on «ماستنتش حد» one flat roof gets its own panel and lights up again
//   1 2024 on «ألفين أربعة وعشرين»; crates of panels arrive on «استوردت»; "17 GW" on «بسبعتاشر جيجاوات», "1 year" on
//     «في سنة واحدة»; panels fly out onto the roofs of houses («بيوت»), a factory («ومصانع») and a farm («ومزارع»)
//   2 the grid's highest demand as a tall pylon with a "~30 GW" line at its top; beside it the roofs pile up, panel on
//     panel, to half its height, "½" (host left: the lower left is kept clear)
// Flat roofs (the houses there are flat-roofed). Each shot takes o.vert for the portrait layout (rooftops.v.js).
import { clamp, lerp, ease, seg, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./rooftops.v.js";
import { P, E, mix, stars, pop, plate, tagV, pylon, span, pylonTips } from "./elec.js";
import { calPage } from "./props.js";
import { bump, RED } from "./balance.js";
import { panel } from "./sun.js";

const sky = (c, tot, seed = 91) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 2900, 900, tot), c, 0.12);
const LAND = "#1f6a7a", LANDD = "#16505d";
// Pakistan, stylised, about 640..1120 x 220..780
const PAK = "M780 780L700 700L640 640L700 600L760 560L800 500L860 440L900 380L960 330L1000 260L1060 220L1120 240L1100 300L1060 360L1040 420L1020 480L980 560L940 640L900 720L860 780Z";
const pkFlag = (w = 240) => { const h = w * 2 / 3, x = -w / 2, y = -h / 2;
  return `<path d="${rr(x, y, w, h, 10)}" fill="#1f7a4a"/><path d="${rr(x, y, w / 4, h, 10)}" fill="#fff4dc"/><rect x="${x + w / 8}" y="${y}" width="${w / 8}" height="${h}" fill="#fff4dc"/>
    <circle cx="${w * 0.12}" cy="0" r="${h * 0.3}" fill="#fff4dc"/><circle cx="${w * 0.17}" cy="${-h * 0.06}" r="${h * 0.26}" fill="#1f7a4a"/><circle cx="${w * 0.25}" cy="${-h * 0.14}" r="${h * 0.07}" fill="#fff4dc"/>`; };
// a flat-roofed house, base on y = 0, 280 wide; lit 0..1; pv 0..1 brings its roof panels
export const flatHouse = (c, cD, lit = 1, pv = 0) => `${pv > 0 ? [-70, 60].map((x, i) => at(x, -214, panel(1), 0.42 * clamp(pv * 2 - i * 0.6))).join("") : ""}${two(rr(-140, -200, 280, 200, 6), c, cD, 14, 0)}<path d="${rr(-150, -214, 300, 22, 6)}" fill="${cD}"/>
  <path d="M-24 0V-70A24 24 0 0 1 24 -70V0Z" fill="${P.ink}"/>${[-90, 50].map((x) => `<rect x="${x}" y="-160" width="44" height="50" rx="8" fill="${mix(P.ink, P.win, lit)}"/>`).join("")}`;
// a factory with a saw-tooth roof, base on y = 0, 520 wide; pv 0..1 brings its panels
const factory = (lit = 1, pv = 0) => `${two(rr(-260, -220, 520, 220, 6), "#8a7fb8", "#6a6098", 14, 0)}${[0, 1, 2, 3].map((i) => `<path d="M${-260 + i * 130} -220L${-260 + i * 130} -300L${-130 + i * 130} -220Z" fill="#6a6098"/>`).join("")}
  ${pv > 0 ? [0, 1, 2, 3].map((i) => `<g opacity="${clamp(pv * 4 - i).toFixed(2)}"><path d="M${-256 + i * 130} -224L${-256 + i * 130} -296L${-140 + i * 130} -224Z" fill="#1f4fa0"/><path d="M${-256 + i * 130} -260L${-198 + i * 130} -242" stroke="#5f8fe0" stroke-width="5"/></g>`).join("") : ""}
  ${[-190, -70, 50, 170].map((x) => `<rect x="${x}" y="-150" width="60" height="70" rx="6" fill="${mix(P.ink, P.win, lit)}"/>`).join("")}`;
// a farm: a field of rows, a pump with its pipe, panels on stands beside it; base on y = 0
const farmyard = (pv = 0, t = 0) => `<path d="M-280 0L-220 -60H260L300 0Z" fill="#3f8f4a"/>${[0, 1, 2, 3].map((i) => `<path d="M${-230 + i * 10} ${-12 - i * 13}H${270 - i * 10}" stroke="#2f6f3a" stroke-width="7"/>`).join("")}
  ${two(rr(-60, -170, 90, 110, 8), "#c9773a", "#a45a2a", 8, 0)}<path d="M30 -110H120V-40" fill="none" stroke="${P.steelD}" stroke-width="16"/>${pv > 0.5 ? `<path d="M120 -40v${10 + 8 * Math.sin(t * 8)}" stroke="${E.water}" stroke-width="12" stroke-linecap="round"/>` : ""}
  ${pv > 0 ? [0, 1].map((i) => at(-200 + i * 110, -60, panel(1), 0.45 * clamp(pv * 2 - i * 0.6))).join("") : ""}`;
// a shipping crate of panels (centre bottom), 300 wide
const crate = () => `${two(rr(-150, -170, 300, 170, 8), "#c9773a", "#a45a2a", 10, 0)}${[-100, -50, 0, 50, 100].map((x) => `<path d="M${x} -160V-10" stroke="#a45a2a" stroke-width="7"/>`).join("")}<path d="M-120 -130L-90 -170H110L80 -130Z" fill="#1f4fa0"/><path d="M-120 -130L-90 -170H110L80 -130Z" fill="none" stroke="#5f8fe0" stroke-width="5"/>`;

// ---- 0: Pakistan; the grid is dear and cuts out ----
function s0(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 480, 1.0], [5.31, 960, 560, 1.0]] : [[0, 840, 540, 1.1], [1.9, 840, 540, 1.08], [2.6, 1200, 560, 1.0], [5.31, 1200, 560, 1.02]]);
  const map = at(v ? -184 : -444, v ? -400 : -130, two(PAK, LAND, LANDD, 0, 8) + [[780, 690], [880, 560], [980, 360], [1030, 280]].map(([x, y]) => `${rings(x, y, 24, P.win, 0.3, 1.5)}<circle cx="${x}" cy="${y}" r="10" fill="${P.win}"/>`).join(""), 1.3 * pop(a - 0.05, 7, 12));
  const fl = a > 1.0 ? at(v ? 1300 : 380, v ? 120 : 220, pkFlag(220), pop(a - 1.21)) : "";
  const pl = a > 1.0 ? at(v ? 680 : 860, v ? 680 : 930, plate("PAKISTAN", 64), pop(a - 1.3)) : "";
  // the town: grid wire from a pylon to two flat houses
  const G = v ? 1200 : 860, TX = v ? 1040 : 1620;
  const cut = a < 3.39 ? 1 : a < 3.9 ? (Math.sin((a - 3.39) * 40) > 0.2 ? 0.8 : 0.1) : 0;
  const self = ease(seg(a, 4.5, 5.0));
  const py = at(TX - 420, G, pylon(420), 1);
  const tip = pylonTips(420)[1];
  const wire = span([TX - 420 + tip[0], G + tip[1]], [TX - 110, G - 214], 30, mix("#16323f", E.el, cut), 6) + span([TX - 110, G - 214], [TX + 220, G - 214], 20, mix("#16323f", E.el, cut), 6);
  const hs = at(TX - 110, G, flatHouse(E.houseA, E.houseAD, cut), 0.9) + at(TX + 220, G, flatHouse(E.houseB, E.houseBD, Math.max(cut, self), self), 0.9);
  const price = a > 2.9 ? at(TX + (v ? 160 : 40), G - 470, `${two("M-50 0L0 -56H190V56H0Z", P.cream, P.creamD, 0, 6)}${text(95, 26, "$$$", 66, RED)}`, pop(a - 3.05), 6 * Math.sin(tot * 3)) : "";
  const town = (a > 1.8 || v) ? at(0, 0, `<rect x="-1200" y="${G}" width="4400" height="1400" fill="${P.ground}"/>` + py + wire + hs + price, 1) : "";
  const g = sky(c, tot) + layer(map + fl + pl + town, c);
  return { g, out: toScreen(c, TX + 220, G - 220), outC: E.houseB, outZ: 12 };
}

// ---- 1: 2024: 17 GW in a year, onto roofs ----
function s1(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 560, 1.0], [8.95, 960, 600, 1.0]] : [[0, 960, 520, 1.04], [8.95, 960, 540, 1.0]]);
  const G = v ? 1500 : 900;
  const cal = at(v ? 700 : 300, v ? -200 : 230, calPage("2024", "", 0.8, 150), pop(a - 0.26));
  // crates slide in
  const CX = v ? 960 : 1060, CY = v ? 500 : 560;
  const crates = a > 1.7 ? [0, 1, 2].map((i) => { const q = ease(seg(a, 1.89 + i * 0.15, 2.6 + i * 0.15)); return at(lerp(CX + 1200, CX - 330 + i * 330, q), CY, crate(), 1); }).join("") + [0, 1].map((i) => { const q = ease(seg(a, 2.3 + i * 0.15, 3.0 + i * 0.15)); return at(lerp(CX + 1200, CX - 165 + i * 330, q), CY - 170, crate(), 1); }).join("") : "";
  const gw = a > 3.9 ? at(CX, CY - 420, tagV("17", "GW", { size: 100 }), pop(a - 4.04) * bump(a, 4.26, 0.06)) : "";
  const yr = a > 4.7 ? at(v ? 1240 : 1640, v ? -220 : 230, `${disc(0, 0, 90, P.cream, P.creamD, 0.08)}<circle r="72" fill="#fffaec"/>${drawn("M0 -56A56 56 0 1 1 -1 -56", seg(a, 4.79, 5.3), P.gold, 14)}${text(0, 150, "1 year", 56, P.cream)}`, pop(a - 4.79)) : "";
  // roofs: houses, a factory, a farm
  const HX = v ? [620, 960, 1300] : [260, 560, 1020, 1560], pvH = seg(a, 6.66, 7.4), pvF = seg(a, 7.49, 8.1), pvA = seg(a, 8.09, 8.7);
  const row = v ? at(HX[0], G - 420, flatHouse(E.houseA, E.houseAD, 1, pvH), 0.75) + at(HX[2], G - 420, flatHouse(E.houseB, E.houseBD, 1, pvH), 0.75) + at(HX[1], G - 420, flatHouse(E.houseA, E.houseAD, 1, pvH), 0.75)
      + `<rect x="-1200" y="${G - 420}" width="4400" height="30" fill="#0d3a4e"/>` + at(700, G, factory(1, pvF), 0.7) + at(1260, G, farmyard(pvA, tot), 0.8)
    : at(HX[0], G, flatHouse(E.houseA, E.houseAD, 1, pvH), 0.8) + at(HX[1], G, flatHouse(E.houseB, E.houseBD, 1, pvH), 0.8) + at(HX[2], G, factory(1, pvF), 0.8) + at(HX[3], G, farmyard(pvA, tot), 0.9);
  const fly = (x0, y0, x1, y1, t0) => { const q = clamp((a - t0) / 0.5); return q > 0 && q < 1 ? at(lerp(x0, x1, q), lerp(y0, y1, q) - Math.sin(Math.PI * q) * 200, panel(1), 0.4, -20 * (1 - q)) : ""; };
  const targets = v ? [[HX[0], G - 600, 6.2], [HX[2], G - 600, 6.3], [700, G - 200, 7.05], [1260, G - 60, 7.65]] : [[HX[0], G - 180, 6.2], [HX[1], G - 180, 6.3], [HX[2], G - 220, 7.05], [HX[3], G - 50, 7.65]];
  const flying = targets.map(([x, y, t0]) => fly(CX, CY - 100, x, y, t0)).join("");
  const g = sky(c, tot, 93) + layer(`<rect x="-1200" y="${G}" width="4400" height="1400" fill="${P.ground}"/>` + cal + yr + row + crates + gw + flying, c);
  return { g, in: toScreen(c, CX, CY - 80), inC: "#c9773a" };
}

// ---- 2: the grid's peak ~30 GW; the roofs, half of it (host left) ----
function s2(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 640, 1.0], [5.84, 960, 640, 1.0]] : [[0, 1080, 520, 1.0], [5.84, 1080, 520, 1.03]]);
  const G = v ? 1450 : 960, PX = v ? 740 : 980, PH = v ? 1000 : 660, RX = v ? 1250 : 1500;
  const py = at(PX, G, pylon(PH), pop(a - 0.1, 7, 12));
  const top = G - PH, half = G - PH / 2;
  const peak = a > 1.9 ? `<path d="M${PX - 300} ${top}H${RX + 260}" stroke="${RED}" stroke-width="10" stroke-dasharray="30 18" opacity="${seg(a, 2.0, 2.3).toFixed(2)}"/>` + at(PX + (v ? 0 : 420), top - (v ? 100 : 90), tagV("~30", "GW", { size: 84 }), pop(a - 2.08)) : "";
  // roofs pile up: slabs with panels
  const n = Math.round(8 * ease(seg(a, 3.3, 5.1))), SH = (PH / 2) / 8;
  const pile = Array.from({ length: n }, (_, i) => at(RX, G - i * SH, `${two(rr(-170, -SH + 4, 340, SH - 6, 6), i % 2 ? E.houseB : E.houseA, i % 2 ? E.houseBD : E.houseAD, 0, 6)}${at(-90, -SH + 4, panel(1), 0.22)}${at(0, -SH + 4, panel(1), 0.22)}${at(90, -SH + 4, panel(1), 0.22)}`, 1)).join("");
  const halfL = a > 4.4 ? `<path d="M${PX - 200} ${half}H${RX + 220}" stroke="${P.gold}" stroke-width="10" stroke-dasharray="30 18" opacity="${seg(a, 4.47, 4.8).toFixed(2)}"/>` + at(RX + (v ? 0 : 300), half - (v ? 120 : 0), `${disc(0, 0, 80, P.gold, P.goldD)}${text(0, 34, "½", 100, "#8a5200")}`, pop(a - 4.6)) : "";
  const g = sky(c, tot, 95) + layer(`<rect x="-1200" y="${G}" width="4400" height="1400" fill="${P.ground}"/>` + py + pile + peak + halfL, c);
  return { g, in: toScreen(c, PX, G - PH * 0.6), inC: "#9aa6d8" };
}

const SHOTS = [s0, s1, s2];
export { s0, s1, s2 };
export const rooftopsSet = makeSet(SHOTS, V, P);
