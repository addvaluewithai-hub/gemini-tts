// The recap of the whole electricity file (part 4 of 4).
//   0 four cards on «واحد» (1.27), «اتنين» (4.74), «تلاتة» (9.91), «وأربعة» (12.40); the camera visits each and pulls back
//     over all four at the end:
//     1 a loop of wire with electrons going round and a bulb lit; a straight DC line on «مستمر», an AC wave on «متردد»
//     2 the magnet spinning in its coil on «بمغناطيس بيلفّ», two pylons with a gold pulse on «وبتسافر», the balance level
//       at 50 with a check on «كل ثانية»
//     3 a small grid whose lines go dark one after another on «بتقع زي الدومينو»
//     4 a battery filling on «البطارية», the sun on «والشمس», and one bulb that stays dark
//     Host right: every card stays left of x = 1530.
//   1 the file folder with its four reports closes on «اتقفل», a stamp "4 / 4" lands on «أربع تقارير»; the camera pulls back
//     to the planet with question marks popping round it («حاجات كتير محتاجة شرح»)
import { clamp, lerp, ease, seg, spring, camAt, layer, rr, two, disc, rings, text, drawn, at, check, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./e4recap.v.js";
import { P, E, mix, stars, pop, electron, wire, bulb, battery, pylon, pylonTips, span, gauge } from "./elec.js";
import { gen, wave } from "./faraday.js";
import { sun, earth } from "./enemies.js";

const CW = 340, CH = 470, T = [1.27, 4.74, 9.91, 12.4];
const marker = (n, on) => `${on > 0 ? rings(0, 0, 60 * on, P.gold, 0.25) : ""}${disc(0, 0, 44, mix("#1f6d8c", P.gold, clamp(on)), mix("#164a6a", P.goldD, clamp(on)))}${text(0, 22, String(n), 62, mix("#5a8aa6", "#8a5200", clamp(on)))}`;
const card = (inner, n, on, act) => `${act > 0 ? rings(0, 0, 260, P.gold, 0.06 * act, 1.15) : ""}${two(rr(-CW / 2, -CH / 2, CW, CH, 30), "#0f3a55", "#0a2b40", 10, 8)}<path d="${rr(-CW / 2 + 14, -CH / 2 + 14, CW - 28, CH - 28, 22)}" fill="#071d2c"/>${inner}${at(-CW / 2 + 18, -CH / 2 + 18, marker(n, on))}`;
const G3N = [[-110, -120], [0, -140], [110, -110], [-120, 0], [0, -10], [115, 10], [-100, 120], [10, 130], [115, 115]];
const G3E = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8]];

function s0(a, tot) {
  const v = portrait();
  const CX = v ? [760, 1160, 760, 1160] : [250, 620, 990, 1360], CY = v ? [380, 380, 900, 900] : [430, 430, 430, 430];
  const vis = (k) => [CX[k], CY[k]];
  const Z = v ? 1.25 : 1.55, W = v ? [960, 700, 1.0] : [985, 470, 0.98];
  const keys = [[0, W[0], W[1], W[2]]];
  const stops = [[1.1, 4.4], [4.55, 9.6], [9.75, 12.1], [12.25, 15.0]];
  stops.forEach(([t0, t1], k) => { keys.push([t0, vis(k)[0], vis(k)[1], Z], [t1, vis(k)[0] + (v ? 0 : 10), vis(k)[1], Z]); });
  keys.push([15.6, W[0], W[1] + 10, W[2]], [19.01, W[0], W[1] + 10, W[2] * 1.03]);
  const c = camAt(a, keys);
  const act = (k) => seg(a, T[k], T[k] + 0.35) * (k < 3 ? 1 - seg(a, stops[k + 1][0] - 0.3, stops[k + 1][0]) : 1) + (a > 15.2 ? seg(a, 15.2, 15.6) : 0);
  // 1: electrons round a loop, a lit bulb; DC and AC
  const loop = "M-110 -120H110V40H-110Z";
  const round = a > 1.66 ? (a - 1.66) * 0.25 : 0;
  const els = Array.from({ length: 8 }, (_, i) => { const q = ((i / 8 + round) % 1), L = 760, d = q * L; let x, y;
    if (d < 220) { x = -110 + d; y = -120; } else if (d < 380) { x = 110; y = -120 + (d - 220); } else if (d < 600) { x = 110 - (d - 380); y = 40; } else { x = -110; y = 40 - (d - 600); }
    return at(x, y, electron(16, { sign: false })); }).join("");
  const lit = seg(a, 2.0, 2.4);
  const c1 = card(at(0, 0, wire(loop, 14) + els + at(0, -120, bulb(lit), 0.3))
    + (a > 3.2 ? drawn(`M-120 120H120`, seg(a, 3.25, 3.7), E.el, 10) + at(-150, 128, text(0, 0, "DC", 34, E.el, {}), seg(a, 3.25, 3.5)) : "")
    + (a > 4.0 ? wave(-120, 120, 190, 26, 2, seg(a, 4.08, 4.6), tot, P.gold, 9) + at(-150, 198, text(0, 0, "AC", 34, P.gold), seg(a, 4.08, 4.3)) : ""), 1, seg(a, 1.27, 1.5), act(0));
  // 2: magnet, pylons, balance
  const tip = pylonTips(170)[2], P1 = [-70, 110], P2 = [70, 110];
  const tr = seg(a, 6.8, 7.6);
  const pulse = tr > 0 && tr < 1 ? rings(lerp(P1[0], P2[0], tr), P1[1] + tip[1] + 10 * Math.sin(tr * Math.PI), 14, P.gold, 0.7, 1.6) : "";
  const wob = a > 7.94 ? 9 * Math.sin((a - 7.94) * 6) * Math.exp(-(a - 7.94) * 1.4) : 0;
  const bal = a > 7.8 ? at(0, 175, `<path d="M0 0V-20" stroke="${P.steelD}" stroke-width="10"/>${at(0, -24, `<path d="M-110 0H110" stroke="${P.gold}" stroke-width="10" stroke-linecap="round"/><path d="M-110 0V20M110 0V20" stroke="${P.gold}" stroke-width="4"/><path d="M-150 20h80l-12 16h-56ZM70 20h80l-12 16h-56Z" fill="${P.steel}"/>`, 1, wob)}${at(0, 22, gauge(0.5 + wob * 0.01), 0.3)}`, pop(a - 7.94)) : "";
  const c2 = card(at(0, -120, gen(a * 4, { R: 70, el: 1, glow: a > 5.6 ? 0.4 : 0 }), seg(a, 5.5, 5.8) > 0 ? 1 : 0.9)
    + (a > 6.5 ? at(0, 0, at(P1[0], P1[1], pylon(170), 0.9) + at(P2[0], P2[1], pylon(170), 0.9) + span([P1[0] + tip[0] * 0.9, P1[1] + tip[1] * 0.9], [P2[0] + tip[0] * 0.9, P2[1] + tip[1] * 0.9], 8, "#9aa6d8", 4) + pulse, pop(a - 6.68)) : "")
    + bal + (a > 9.5 ? check(120, 190, 28, P.green, a - 9.57) : ""), 2, seg(a, 4.74, 5.0), act(1));
  // 3: the domino
  const fall = (e) => seg(a, 11.42 + e * 0.07, 11.55 + e * 0.07);
  const g3 = G3E.map(([i, j], e) => `<path d="M${G3N[i][0]} ${G3N[i][1]}L${G3N[j][0]} ${G3N[j][1]}" stroke="${mix(fall(e) > 0 && fall(e) < 1 ? "#ff4d5a" : E.el, "#21495c", fall(e) >= 1 ? 1 : 0)}" stroke-width="7"/>`).join("")
    + G3N.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="15" fill="${mix(P.win, "#21495c", seg(a, 11.42 + i * 0.06, 11.6 + i * 0.06))}"/>`).join("");
  const c3 = card(at(0, 30, g3), 3, seg(a, 9.91, 10.1), act(2));
  // 4: a battery, the sun, one dark bulb
  const fill = ease(seg(a, 12.98, 13.8));
  const batt = at(-70, 30, `${two(rr(-60, -200, 120, 200, 16), "#2b2350", "#1c1638", 8, 0)}<path d="${rr(-22, -218, 44, 20, 6)}" fill="${P.steel}"/><path d="${rr(-46, -14 - 172 * fill, 92, 172 * fill, 8)}" fill="${P.green}"/>`);
  const sn = a > 13.5 ? at(80, -120, sun(48, tot), pop(a - 13.59)) : "";
  const dark = a > 14.3 ? at(80, 190, `${bulb(0)}${text(110, -150, "?", 110, P.cream)}`, 0.36 * pop(a - 14.38)) : "";
  const c4 = card(batt + sn + dark, 4, seg(a, 12.4, 12.6), act(3));
  const cards = [c1, c2, c3, c4].map((g, k) => (a > T[k] - 0.3 ? at(CX[k], CY[k], g, pop(a - T[k] + 0.3, 7, 12)) : at(CX[k], CY[k], card("", k + 1, 0, 0), 0.92))).join("");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(89, 120, -300, 2300, 1400, tot), c, 0.2) + layer((v ? "" : `<rect x="-400" y="740" width="2800" height="600" fill="${P.ground}"/>`) + cards, c);
  return { g };
}

// ---- 1: the file closes ----
const sheet = (icon, k) => `${two(rr(-150, -200, 300, 240, 12), P.cream, P.creamD, 0, 6)}${at(0, -130, icon)}`;
const ICONS = [
  `<path d="M-14 -40L22 -40L2 -4H26L-22 44L-6 8H-30Z" fill="${E.el}"/>`,
  `<path d="M-30 40L-8 -40H8L30 40M-22 10H22M-16 -12H16" stroke="#3b6a82" stroke-width="7" fill="none"/>`,
  `<path d="M-40 30L-40 -20M-10 30L-6 -24M20 30L34 -16" stroke="#ff4d5a" stroke-width="12" stroke-linecap="round"/>`,
  `<path d="${rr(-20, -40, 40, 80, 8)}" fill="#2b2350"/><path d="${rr(-14, -6, 28, 40, 4)}" fill="${P.green}"/><circle cx="34" cy="-30" r="16" fill="#ffd04a"/>`,
];
function s1(a, tot) {
  const v = portrait();
  const FX = 960, FY = v ? 900 : 560;
  const c = v ? camAt(a, [[0, 960, 900, 1.25], [1.7, 960, 900, 1.3], [2.6, 960, 900, 0.75], [4.2, 960, 900, 0.72]]) : camAt(a, [[0, 960, 540, 1.15], [1.7, 960, 540, 1.2], [2.6, 960, 700, 0.66], [4.2, 960, 710, 0.64]]);
  const close = ease(seg(a, 0.45, 0.85));
  const back = `${two(rr(-260, -260, 520, 380, 20), E.amberD, "#a85a08", 0, 0)}<path d="M-260 -260h170l30 -36h-170Z" fill="${E.amberD}"/>`;
  const sheets = ICONS.map((ic, i) => at(-150 + i * 100, -40 - 60 * (1 - close) + i * 6, sheet(ic, i), 0.62, (i - 1.5) * 4)).join("");
  const flapH = 360 * lerp(0.25, 1, close);
  const front = `<path d="${rr(-280, 120 - flapH, 560, flapH, 20)}" fill="${E.amber}"/><path d="${rr(-280, 120 - flapH, 560, 14, 7)}" fill="#ffc86a"/>`;
  const st = a > 0.9 ? at(70, -30, `<path d="${rr(-170, -74, 340, 148, 22)}" fill="none" stroke="${P.red}" stroke-width="16"/>${text(0, 36, "4 / 4", 100, P.red)}`, lerp(2.2, 1, ease(seg(a, 0.96, 1.12))), -12, `opacity="${seg(a, 0.96, 1.06).toFixed(2)}"`) : "";
  const thud = a > 1.1 && a < 1.6 ? rings(70, -30, 200 * seg(a, 1.1, 1.6), P.red, 0.25 * (1 - seg(a, 1.1, 1.6)), 1.2) : "";
  const folder = at(FX, FY, back + sheets + front + thud + st, lerp(1, 0.55, ease(seg(a, 1.8, 2.6))));
  // the planet and its open questions
  const pl = a > 1.9 ? at(FX, FY + (v ? 700 : 600), earth(v ? 360 : 400, "", { id: "rc" }), pop(a - 1.95)) : "";
  const Q = [[-620, 360], [-480, 20], [-560, 760], [480, 40], [640, 380], [600, 780], [-760, 560], [780, 600]];
  const qs = Q.map(([x, y], i) => (a > 2.19 + i * 0.18 ? at(FX + x, FY + y + (v ? 300 : 120), text(0, 0, "?", 110, i % 2 ? P.gold : P.cream), pop(a - 2.19 - i * 0.18)) : "")).join("");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(93, 160, -1200, 3200, 1800, tot), c, 0.2) + layer(pl + qs + folder, c);
  return { g };
}

const SHOTS = [s0, s1];
export const e4recapSet = makeSet(SHOTS, V, P);
