// "The bet" (electricity part 4 of 4): the big battery in Australia, built on a dare.
//   0 AUSTRALIA at night, 2017 on «ألفين وسبعتاشر»; one southern state's lights flicker and go dark on «النور بيقطع»
//   1 a phone with a post (the poster is only a bolt avatar, no face): "100 DAYS / OR FREE" types in on «أبني لكم … ببلاش»;
//     then the battery field builds container by container while a 100-day bar fills and stops at "~63 days" with a check
//   2 a pile of coins "A$40M" on «أربعين مليون»; then the 50 Hz dial wobbles on «هزة»: the battery answers at once ("< 1 s")
//     while the far station's clock reads "minutes" (host right: the lower right is kept clear)
// No people: the rich man is a phone. Each shot takes o.vert for the portrait layout (bet.v.js).
import { clamp, lerp, ease, easeOut, seg, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, FW, FH, makeSet } from "./kit.js";
import { V } from "./bet.v.js";
import { P, E, mix, stars, pop, plate, tagV, station } from "./elec.js";
import { calPage, coin } from "./props.js";
import { dial, bump, stopwatch, RED } from "./balance.js";

const sky = (c, tot, seed = 61) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 2900, 900, tot), c, 0.12);
const LAND = "#1f6a7a", LANDD = "#16505d";
// Australia, stylised, about 545..1360 x 180..790; SA the southern middle state
const AUS = "M560 520L600 420L680 380L760 330L820 300L870 330L900 270L960 240L1010 290L1060 300L1100 230L1130 180L1160 260L1200 330L1260 390L1320 460L1360 540L1350 620L1300 700L1250 760L1180 790L1110 780L1060 740L1010 700L980 690L950 720L900 680L840 660L760 690L680 720L600 710L560 660L545 600Z";
const SA = "M870 455L1062 455L1062 735L1010 700L980 690L950 720L900 680L870 668Z";
const TAS = "M1215 830L1270 826L1262 880L1228 884Z";
const AUS_CITIES = [[1290, 640], [1210, 750], [1300, 470], [640, 640], [1150, 300], [700, 450]];
const SA_CITIES = [[1000, 690], [960, 610], [1030, 560], [920, 520]];
export const container = (charge = 1, o = {}) => `${two(rr(-150, -110, 300, 110, 10), "#e8f2f6", "#bcd2dc", 8, 6)}${[-100, -50, 0, 50, 100].map((x) => `<path d="M${x} -96V-14" stroke="#bcd2dc" stroke-width="6"/>`).join("")}
  <path d="${rr(-130, -30, 260, 14, 6)}" fill="#0f3a55"/><path d="${rr(-130, -30, 260 * clamp(charge), 14, 6)}" fill="${o.c || E.el}"/><path d="M-12 -84L-28 -54H-8L-18 -30L14 -64H-4Z" fill="${P.gold}"/>`;
// a phone (centre), 420 x 760; inner drawn on its screen (screen spans -180..180 x -330..320)
const phone = (inner) => `${two(rr(-210, -380, 420, 760, 56), "#16263a", "#0b1828", 10, 10)}<path d="${rr(-182, -332, 364, 654, 28)}" fill="#f4f7fb"/>${inner}<path d="${rr(-50, -360, 100, 14, 7)}" fill="#2e4256"/>`;

// ---- 0: Australia, 2017, one state goes dark ----
function s0(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 660, 0.9], [3.6, 960, 680, 0.92], [5.8, 990, 660, 1.2]] : [[0, 960, 540, 1.0], [3.6, 960, 545, 1.05], [5.8, 1000, 640, 1.4]]);
  const cut = (i) => { const t0 = 4.79 + i * 0.08; if (a < t0) return 1; const q = a - t0; return q < 0.35 ? (Math.sin(q * 40 + i) > 0 ? 0.9 : 0.15) : 0; };
  const sa = SA_CITIES.map(([x, y], i) => { const l = cut(i); return `${l > 0.3 ? rings(x, y, 28, P.win, 0.3 * l, 1.5) : ""}<circle cx="${x}" cy="${y}" r="11" fill="${mix("#21485a", P.win, l)}"/>`; }).join("");
  const rest = AUS_CITIES.map(([x, y]) => `${rings(x, y, 28, P.win, 0.3, 1.5)}<circle cx="${x}" cy="${y}" r="11" fill="${P.win}"/>`).join("");
  const dark = ease(seg(a, 4.79, 5.3));
  const map = at(960, 560, at(-950, -490, two(AUS, LAND, LANDD, 0, 8) + two(TAS, LAND, LANDD, 0, 6) + `<path d="${SA}" fill="${mix("#2a8597", "#0b2a38", dark)}" stroke="${LANDD}" stroke-width="6" stroke-linejoin="round"/>` + rest + sa), 1.2 * pop(a - 0.05, 7, 12));
  const cal = a > 2.3 ? at(v ? 760 : 330, v ? 1180 : 760, calPage("2017", "", 0.8, 150), pop(a - 2.42) * (v ? 1 : 1 - seg(a, 4.6, 5.0))) : "";
  const pl = a > 4.1 ? at(v ? 1080 : 720, v ? 1060 : 960, plate("AUSTRALIA", 60), pop(a - 4.29)) : "";
  const g = sky(c, tot) + layer(map + cal + pl, c);
  return { g, out: toScreen(c, 980, 620), outC: "#0b2a38", outZ: 14 };
}

// ---- 1: "100 days or free"; built in about 63 ----
function s1(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 560, 1.0], [7.87, 960, 600, 1.0]] : [[0, 960, 540, 1.12], [5.6, 960, 540, 1.1], [6.4, 960, 540, 1.0], [7.87, 960, 540, 1.0]]);
  const slide = ease(seg(a, 5.6, 6.3));
  const PX = v ? 960 : lerp(960, 520, slide), PY = v ? lerp(560, 280, slide) : 540, PK = v ? lerp(1.0, 0.62, slide) : lerp(1.0, 0.85, slide);
  const type = (t0, t1) => clamp((a - t0) / (t1 - t0));
  const l1 = type(2.45, 3.6), l2 = type(4.37, 5.3);
  const post = `${disc(-120, -250, 44, P.gold, P.goldD)}<path d="M-114 -282L-138 -244H-118L-128 -216L-98 -258H-118Z" fill="${P.ink}"/><path d="${rr(-60, -272, 170, 22, 11)}" fill="#c9d4e0"/><path d="${rr(-60, -238, 110, 18, 9)}" fill="#dfe6ee"/>
    <clipPath id="bt1"><rect x="-160" y="-160" width="${(330 * l1).toFixed(1)}" height="120"/></clipPath><g clip-path="url(#bt1)">${text(0, -60, "100 DAYS", 100, P.ink)}</g>
    <clipPath id="bt2"><rect x="-160" y="-10" width="${(330 * l2).toFixed(1)}" height="120"/></clipPath><g clip-path="url(#bt2)">${text(0, 90, "OR FREE", 100, RED)}</g>
    <path d="${rr(-160, 260, 320, 4, 2)}" fill="#dfe6ee"/>
    <path d="M-120 300c-14 -16 -34 0 -20 14l20 18l20 -18c14 -14 -6 -30 -20 -14Z" fill="${a > 5.3 ? RED : "#c9d4e0"}"/><path d="${rr(-60, 290, 50, 16, 8)}" fill="#c9d4e0"/><path d="${rr(40, 288, 40, 24, 6)}" fill="#c9d4e0"/>`;
  const ph = at(PX, PY, phone(post), PK * pop(a - 0.05, 7, 12) * bump(a, 5.32, 0.05));
  // the field: containers in rows, popping in as the days run
  const build = seg(a, 5.92, 7.45), FX = v ? 960 : 1360, FY = v ? 1000 : 470, N = 9;
  const field = slide > 0 ? Array.from({ length: N }, (_, i) => { const col = i % 3, row = Math.floor(i / 3), t0 = 5.92 + i * 0.12;
    return a > t0 ? at(FX - 340 + col * 340, FY - 150 + row * 150, container(seg(a, t0, t0 + 1.2)), 0.95 * pop(a - t0)) : ""; }).join("") : "";
  const BX = v ? 960 : 1360, BY = v ? 1420 : 980, BW = v ? 820 : 760, fill = 0.63 * ease(build);
  const days = Math.round(63 * ease(build));
  const bar = slide > 0 ? at(BX, BY, `${two(rr(-BW / 2, -34, BW, 68, 34), "#0f3a55", "#0a2a3c", 0, 6)}<path d="${rr(-BW / 2 + 8, -26, (BW - 16) * fill, 52, 26)}" fill="${P.gold}"/><path d="M${BW / 2 - 6} -60V60" stroke="${RED}" stroke-width="10" stroke-linecap="round"/>${text(BW / 2 - 6, -78, "100", 52, RED)}
    <path d="M${-BW / 2 + 8 + (BW - 16) * fill} -50V50" stroke="${P.cream}" stroke-width="6"/>${text(-BW / 2 + 8 + (BW - 16) * fill, -66, String(days), 52, P.cream)}`, pop(a - 5.95)) : "";
  const tag = a > 6.7 ? at(BX - BW / 2 + 8 + (BW - 16) * 0.63, BY + (v ? -170 : -170), tagV("~63", "days", { size: 72 }) + check(v ? 230 : 240, 0, 40, P.green, a - 7.2), pop(a - 6.81)) : "";
  const g = sky(c, tot, 63) + layer(`<rect x="-1200" y="${v ? 1440 : 900}" width="4400" height="1400" fill="${P.ground}"/>` + field + ph + bar + tag, c);
  return { g, in: toScreen(c, PX, PY), inC: "#f4f7fb", out: toScreen(c, FX, FY), outC: "#e8f2f6", outZ: 12 };
}

// ---- 2: A$40M; under a second against minutes (host right) ----
function s2(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 700, 1.0], [9.17, 960, 720, 1.0]] : [[0, 960, 520, 1.0], [9.17, 960, 520, 1.02]]);
  const move = ease(seg(a, 3.6, 4.3));
  // the coins: a pile that grows, then steps aside
  const CX = v ? 960 : lerp(960, 330, move), CY = v ? lerp(800, 80, move) : lerp(640, 300, move), CK = lerp(1.3, v ? 0.6 : 0.7, move);
  const n = Math.round(14 * ease(seg(a, 0.6, 2.4)));
  const pile = Array.from({ length: n }, (_, i) => { const row = [5, 4, 3, 2][Math.min(3, Math.floor(i < 5 ? 0 : i < 9 ? 1 : i < 12 ? 2 : 3))], k = i < 5 ? i : i < 9 ? i - 5 : i < 12 ? i - 9 : i - 12, r = i < 5 ? 0 : i < 9 ? 1 : i < 12 ? 2 : 3;
    return at((k - (row - 1) / 2) * 92, -r * 74, coin(48), 1); }).join("");
  const coins = at(CX, CY, pile + (a > 2.0 ? at(0, -380, tagV("A$40M", "", { size: 84 }), pop(a - 2.08)) : ""), CK * (a > 0.4 ? 1 : 0));
  // the dial, the battery (left) and the far station (up right)
  const shake = a > 5.5 ? Math.exp(-(a - 5.5) * (a > 6.48 ? 6 : 0.6)) * Math.sin((a - 5.5) * 16) : 0;
  const DX = v ? 960 : 980, DY = v ? 640 : 470, show = seg(a, 3.8, 4.3);
  const dl = show > 0 ? at(DX, DY, dial(50 + 0.75 * shake, { r: 230 }), pop(a - 3.9)) : "";
  const G = v ? 1360 : 860;
  const BXx = v ? 680 : 430, bat = show > 0 ? at(BXx, G, (a > 6.33 ? rings(0, -110, 220, P.gold, 0.4 * (1 - seg(a, 6.33, 7.2)), 1.4) : "") + at(-160, -120, container(1)) + at(160, -120, container(1)) + at(-160, 0, container(1)) + at(160, 0, container(1)), 0.8 * pop(a - 4.18)) : "";
  const zap = a > 6.33 && a < 7.4 ? drawn(`M${BXx + 120} ${G - 210}Q${(BXx + DX) / 2} ${G - 420} ${DX - 150} ${DY + 120}`, seg(a, 6.33, 6.55), P.gold, 14) : "";
  const sw = a > 6.4 ? at(BXx - 60, G - 380, stopwatch(clamp((a - 6.48) / 0.9) * 0.15, 54) + at(150, 0, tagV("< 1 s", "", { size: 64 })), pop(a - 6.48)) : "";
  const SXx = v ? 1240 : 1500, SYy = v ? 1360 : 560;
  const hill = v ? "" : `<path d="M1180 ${SYy}Q1500 ${SYy - 70} 1900 ${SYy}V1200H1180Z" fill="#0a3346"/>`;
  const st = show > 0 ? at(SXx, SYy, station(tot, { lit: 1 }), (v ? 0.5 : 0.42) * pop(a - 4.3)) : "";
  const mn = a > 7.7 ? at(SXx, SYy - (v ? 380 : 330), `${stopwatch((a - 7.8) * 0.06, 54)}${at(0, 110, tagV("minutes", "", { size: 56, fill: P.cream }))}`, pop(a - 7.8)) : "";
  const g = sky(c, tot, 67) + layer(hill + `<rect x="-1200" y="${G}" width="4400" height="1400" fill="${P.ground}"/>` + st + mn + bat + zap + dl + sw + coins, c);
  return { g, in: toScreen(c, CX, CY - 60), inC: P.gold };
}

const SHOTS = [s0, s1, s2];
export { s0, s1, s2 };
export const betSet = makeSet(SHOTS, V, P);
