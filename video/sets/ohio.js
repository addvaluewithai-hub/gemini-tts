// "2003" (electricity part 3 of 4): a tree and a stuck alarm darken fifty million people.
//   0 a hot August day in OHIO, 2003: a high-voltage line sags with the heat until it touches an untrimmed tree; flash; it trips
//   1 the control room: screens all green ✓, while the alarm program has frozen (an hourglass, greyed bell) (host right)
//   2 the map: the domino spreads from Ohio; 50,000,000; NEW YORK goes dark; the calendar runs from 14 to 16 August
//   3 the dark city: a metro train stopped in its tunnel, lights moving over the bridges (people walking home), $ billions
// No people: crowds are small moving lights.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./ohio.v.js";
import { P, E, mix, pop, pylon, pylonTips, span, spanAt, plate, tagV, skyline } from "./elec.js";
import { calPage } from "./props.js";
import { RED, sky, tall, neMap, waveLit, OHIO, NYC } from "./domino.js";
import { tree, frozen } from "./e3intro.js";
import { screen, chair } from "./balance.js";

const fmt = (v) => Math.round(v).toLocaleString("en");
const GREEN = "#3ddc97";

// ---- 0: the hot line sags into the tree ----
function o0(a, tot, s) {
  const T = tall(), G = 900, h = 620, PL = T ? 600 : 360, PR = T ? 1320 : 1560, tl = pylonTips(h);
  const c = camAt(a, [[0, 960, 520, T ? 1.0 : 1.0], [3.8, 960, 540, T ? 1.0 : 1.05], [7.4, (PL + PR) / 2, 620, T ? 1.15 : 1.35], [10.09, (PL + PR) / 2, 640, T ? 1.15 : 1.3]]);
  const sag = 40 + 70 * ease(seg(a, 4.41, 5.27)) + 95 * ease(seg(a, 6.95, 7.86)), touch = a > 7.86, trip = seg(a, 9.51, 9.8);
  const A = [PL + tl[1][0], G + tl[1][1] + 46], B = [PR + tl[0][0], G + tl[0][1] + 46], mid = spanAt(A, B, sag, 0.5);
  const heat = seg(a, 2.32, 3.0);
  const sun = layer(rings(T ? 860 : 1500, 150, 140, "#ffcf6b", 0.25 * heat, 1.5) + disc(T ? 860 : 1500, 150, 90, mix("#7a6a40", "#ffcf6b", heat), mix("#5a4a30", "#f0a020", heat)), c, 0.3);
  const waves = heat > 0 ? Array.from({ length: 4 }, (_, i) => { const x = lerp(A[0], B[0], 0.2 + i * 0.2), y = spanAt(A, B, sag, 0.2 + i * 0.2)[1] - 40 - ((a * 60 + i * 30) % 90);
    return `<path d="M${x} ${y}q14 -18 0 -36q-14 -18 0 -36" fill="none" stroke="#ffb066" stroke-width="6" stroke-linecap="round" opacity="${(0.5 * heat * (1 - trip)).toFixed(2)}"/>`; }).join("") : "";
  const treeTop = mid[1] + 10, tr = at(mid[0], G, tree(Math.max(0.6, (G - treeTop) / 400), 2 * Math.sin(a * 1.5)));
  const live = 1 - trip, wire = span(A, B, sag, touch ? mix(RED, "#16384c", trip) : mix("#0f3047", E.el, live * (0.6 + 0.4 * heat)), 9);
  const flash = touch && a < 9.6 ? rings(mid[0], mid[1], 70 + 40 * Math.sin(a * 30), "#fff3b0", 0.55 * (1 - seg(a, 8.6, 9.6)), 1.6) : "";
  const cal = a > 0.97 ? at(T ? 760 : 300, T ? 260 : 220, calPage("2003", "AUG", 1, 150), pop(a - 0.97) * (1 - seg(a, 7.0, 7.4))) : "";
  const pl = a > 3.23 ? at(T ? 1120 : 620, T ? 260 : 200, plate("OHIO", 80), pop(a - 3.23) * (1 - seg(a, 7.0, 7.4))) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bsky)"/>` + sun + layer(`<rect x="-1200" y="${G}" width="4400" height="1400" fill="${P.ground}"/>` + tr + at(PL, G, pylon(h)) + at(PR, G, pylon(h)) + wire + waves + flash + cal + pl, c);
  return { g, out: toScreen(c, mid[0], mid[1]), outC: "#fff3b0", outZ: 14 };
}
// ---- 1: the control room says everything is fine ----
const bell = (frozenP, t) => { const grey = frozenP; return `${rings(0, -10, 80, mix(P.gold, "#7f93b8", grey), 0.3 * (1 - grey), 1.4)}<path d="M-62 44C-62 -46 -40 -82 0 -82C40 -82 62 -46 62 44L80 62H-80Z" fill="${mix(P.gold, "#56657c", grey)}"/><circle cy="-92" r="14" fill="${mix(P.gold, "#56657c", grey)}"/><circle cy="80" r="20" fill="${mix(P.goldD, "#3a4a62", grey)}"/>`
  + (grey > 0.5 ? at(70, 50, `${disc(0, 0, 44, P.cream, P.creamD)}<path d="M-18 -26H18L0 0L18 26H-18L0 0Z" fill="none" stroke="${P.ink}" stroke-width="6"/>`, pop(grey - 0.5)) : ""); };
function o1(a, tot, s) {
  const T = tall(), c = camAt(a, [[0, 900, 520, T ? 1.0 : 1.05], [4.0, 860, 520, T ? 1.0 : 1.12], [8.39, 900, 520, T ? 1.0 : 1.08]]);
  const fr = seg(a, 4.05, 4.6), ok = seg(a, 7.54, 7.9);
  const SX = T ? [700, 960, 1220] : [420, 760, 1100], SY = T ? [480, 480, 480] : [430, 430, 430];
  let scr = ""; for (let i = 0; i < 3; i++) scr += at(SX[i], SY[i], screen(T ? 220 : 280, T ? 160 : 190, a, i * 5, 1, at(0, 0, check(0, 0, T ? 44 : 56, GREEN, a - 0.4 - i * 0.12 - (i === 1 ? ok * 0 : 0)), 1 + 0.25 * ok)));
  const desk = `<path d="${rr(T ? 520 : 240, 640, T ? 880 : 1060, 30, 12)}" fill="#1f5a72"/><path d="${rr(T ? 540 : 260, 670, T ? 840 : 1020, 140, 10)}" fill="#174a5e"/>` + [0, 1, 2].map((i) => at(SX[i], 900, chair(), 1.1)).join("");
  const alarm = at(T ? 960 : 1360, T ? 860 : 330, bell(fr, a), (T ? 1.3 : 1.4) * pop(a - 1.69));
  const g = sky(c, tot, 33) + layer(`<rect x="-1200" y="0" width="4400" height="2400" fill="#06192a"/><rect x="-1200" y="880" width="4400" height="1400" fill="#0a2536"/>` + desk + scr + alarm, c);
  return { g, out: toScreen(c, SX[1], SY[1]), outC: "#0b3346", outZ: 14 };
}
// ---- 2: the domino from Ohio; fifty million; New York; two days ----
function o2(a, tot, s) {
  const T = tall(), c = camAt(a, [[0, 960, 560, T ? 0.62 : 1.0], [4.9, 1000, 560, T ? 0.62 : 1.0], [6.0, NYC[0] - 80, NYC[1] - 60, T ? 0.9 : 1.6], [7.96, NYC[0] - 80, NYC[1] - 60, T ? 0.9 : 1.65]]);
  const r = lerp(-50, 1500, easeOut(seg(a, 1.32, 3.6)));
  const map = neMap(tot, (i, x, y) => waveLit(x, y, OHIO[0], OHIO[1], r));
  const origin = a > 0.2 && a < 2.6 ? rings(OHIO[0], OHIO[1], 40 + 20 * Math.sin(a * 12), RED, 0.5, 1.5) : "";
  const cnt = a > 2.29 ? at(FW / 2, T ? 1560 : 130, tagV(fmt(lerp(0, 50000000, ease(seg(a, 2.29, 3.6)))), "", { size: 92 }), pop(a - 2.29) * (1 - seg(a, 4.6, 5.0))) : "";
  // New York's skyline rising out of its dot, then going dark
  const nyDark = seg(a, 5.4, 5.9), ny = a > 4.9 ? at(NYC[0], NYC[1] + 10, skyline(71, -200, 200, 0, 60, 200, "#1d4a62", mix(P.win, "#1d4a62", nyDark)), 0.9 * pop(a - 4.9)) + at(NYC[0], NYC[1] + 50, plate("NEW YORK", 34), pop(a - 5.2)) : "";
  const days = a > 6.45 ? at(NYC[0] + (T ? 0 : 260), NYC[1] - (T ? 360 : 150), a < 7.13 ? calPage("14", "AUG", 0.55, 150) : calPage(a < 7.3 ? "15" : "16", "AUG", 0.55, 150), pop(a - 6.45)) : "";
  const g = sky(c, tot, 34) + layer(map + origin + ny + days, c) + (cnt ? at(0, 0, cnt) : "");
  return { g, out: toScreen(c, NYC[0], NYC[1]), outC: "#04121e", outZ: 12 };
}
// ---- 3: the dark city: a train stopped in a tunnel, people walking over the bridges, billions lost ----
function o3(a, tot, s) {
  const T = tall(), c = camAt(a, [[0, 960, T ? 560 : 640, 1.0], [1.4, 960, T ? 560 : 520, 1.0], [5.43, 960, T ? 520 : 480, 0.96]]);
  const GY = T ? 1050 : 760, TY = T ? 1380 : 940;
  const city = skyline(81, -400, 2400, GY - 160, 120, 380, "#123a57", "#16405a");
  // the river and a bridge with tiny moving lights (people), from 1.55
  const walk = seg(a, 1.55, 2.0), bridge = `<rect x="-400" y="${GY - 40}" width="2800" height="60" fill="#0b2c40"/><path d="M-200 ${GY - 70}H2200" stroke="#5a7a92" stroke-width="16"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 260 - 100} ${GY - 70}V${GY - 190}" stroke="#5a7a92" stroke-width="10"/>`).join("")}<path d="M-200 ${GY - 190}H2200" stroke="#5a7a92" stroke-width="8"/>`
    + (walk > 0 ? Array.from({ length: 40 }, (_, i) => { const x = ((i * 61 + a * 30 * (i % 2 ? 1 : 0.8)) % 2400) - 200; return `<circle cx="${x.toFixed(1)}" cy="${GY - 84 - (i % 3) * 4}" r="5" fill="${P.win}" opacity="${(walk * (0.6 + 0.4 * Math.sin(a * 4 + i))).toFixed(2)}"/>`; }).join("") : "");
  // the tunnel under the ground: a stopped train with its own lit windows
  const tunnel = `<rect x="-400" y="${TY - 120}" width="2800" height="240" fill="#05141f"/><path d="M-400 ${TY - 120}H2400M-400 ${TY + 120}H2400" stroke="#123a57" stroke-width="10"/>`;
  const train = at(T ? 960 : 900, TY + 60, `${two(rr(-620, -150, 1240, 150, 40), "#7f93b8", "#5f7299", 0, 8)}${Array.from({ length: 10 }, (_, i) => `<path d="${rr(-580 + i * 120, -126, 80, 60, 10)}" fill="${P.win}"/>`).join("")}<path d="M-620 -40H620" stroke="${RED}" stroke-width="8"/>`, (T ? 0.8 : 1) * pop(a - 0.05));
  const stop = a > 0.34 ? at(T ? 960 : 1500, TY - 170, `${disc(0, 0, 50, RED, "#c41e2a")}<path d="${rr(-26, -8, 52, 16, 6)}" fill="#fff"/>`, pop(a - 0.34)) : "";
  const money = a > 3.45 ? at(T ? 960 : 960, T ? 300 : 220, tagV("$ billions", "", { size: 110, fill: "#ff8a8a" }), pop(a - 3.45)) : "";
  const g = sky(c, tot, 35) + layer(city + bridge + `<rect x="-1200" y="${GY}" width="4400" height="2400" fill="${P.ground}"/>` + tunnel + train + stop + money, c);
  return { g, out: toScreen(c, 960, TY), outC: "#05141f", outZ: 12 };
}

const SHOTS = [o0, o1, o2, o3];
export const ohioSet = makeSet(SHOTS, V, P);
