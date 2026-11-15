// The human dictionary of electricity part 2 of 4: two shots, each a word in Latin letters with a picture.
//   0 HERTZ: a plate drops on «Hertz»; a generator's wheel turns and a counter rolls to "50 / s" on «الثانية»; a heartbeat
//     line pulses across on «نبض الشبكة»
//   1 MEGAWATT: a plate on «Megawatt»; "1 MW = 1,000,000 W" on «مليون وات»; a street of houses lights up window by window on
//     «مئات البيوت»; then a small data centre (a box of server racks with blinking lights) lights on «مخزن كمبيوترات».
//     Host right: the lower right is kept clear.
import { clamp, lerp, ease, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH, portrait } from "./kit.js";
import { P, E, mix, stars, house, pop, plate } from "./elec.js";
import { gen } from "./faraday.js";
import { V } from "./e2dict.v.js";

const NIGHT = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(41, 90, -600, 2600, 1000, tot), c, 0.15);
const tagBox = (t, size = 70, fill = P.gold) => { const w = t.length * size * 0.5 + size; return `${two(rr(-w / 2, -size * 0.75, w, size * 1.5, size * 0.75), P.ink, "#0d0826", 0, 6)}${text(0, size * 0.34, t, size, fill)}`; };

// ---- 0: Hertz ----
function s0(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 640, 1.0], [4.07, 960, 660, 1.02]]) : camAt(a, [[0, 960, 540, 1.0], [4.07, 960, 540, 1.04]]);
  const PX = v ? 960 : 960, PY = v ? 160 : 170;
  const pl = at(PX, PY - 240 * (1 - pop(a - 1.39)), plate("HERTZ", 96), pop(a - 1.39));
  const GX = v ? 960 : 620, GY = v ? 620 : 560, ang = a * 6;
  const g0 = at(GX, GY, gen(ang, { R: v ? 230 : 210, el: 1, glow: a > 2.0 ? 0.5 : 0 }));
  const n = Math.round(lerp(0, 50, ease(seg(a, 2.0, 2.9))));
  const cnt = a > 1.99 ? at(v ? 960 : 1250, v ? 1000 : 560, tagBox(`${n} / s`, v ? 110 : 120), pop(a - 1.99)) : "";
  // the heartbeat line across the bottom
  const HX0 = v ? 120 : 160, HX1 = v ? 1800 : 1760, HY = v ? 1280 : 880;
  let d = `M${HX0} ${HY}`; for (let i = 0; i < 6; i++) { const x = lerp(HX0, HX1, (i + 0.5) / 6); d += `H${x - 50}L${x - 25} ${HY - 120}L${x} ${HY + 70}L${x + 25} ${HY}`; } d += `H${HX1}`;
  const beat = a > 3.2 ? drawn(d, seg(a, 3.2, 3.9), P.green, 10, 'stroke-linejoin="round"') : "";
  const g = NIGHT(c, tot) + layer(g0 + pl + cnt + beat, c);
  return { g, out: toScreen(c, GX, GY), outC: P.gold, outZ: 14 };
}

// ---- 1: Megawatt ----
const racks = (on, t) => `${two(rr(-280, -260, 560, 260, 16), "#2b5a74", "#1c4157", 12, 0)}${[0, 1, 2, 3].map((k) => `<path d="${rr(-250 + k * 128, -230, 108, 210, 8)}" fill="#0a2230"/>` + [0, 1, 2, 3, 4, 5].map((r) => { const lit = on > 0 && (Math.sin(t * 7 + k * 3 + r * 1.7) > -0.3); return `<path d="${rr(-240 + k * 128, -218 + r * 34, 88, 22, 4)}" fill="#123447"/><circle cx="${-160 + k * 128}" cy="${-207 + r * 34}" r="6" fill="${lit ? (r % 2 ? P.green : E.el) : "#1d4a5e"}"/>`; }).join("")).join("")}`;
function s1(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 640, 1.0], [4.71, 960, 660, 1.0]]) : camAt(a, [[0, 900, 520, 1.0], [4.71, 880, 520, 1.02]]);
  const PX = v ? 960 : 760, PY = v ? 160 : 150;
  const pl = at(PX, PY, plate("MEGAWATT", 92), pop(a - 0.3));
  const eq = a > 0.7 ? at(PX, PY + (v ? 190 : 170), tagBox("1 MW = 1,000,000 W", v ? 58 : 62), pop(a - 0.71)) : "";
  const G = v ? 1000 : 760;
  const street = Array.from({ length: v ? 4 : 5 }, (_, i) => { const lit = a > 2.09 + i * 0.07, x = (v ? 600 : 150) + i * (v ? 240 : 185);
    return at(x, G, house(i % 2 ? E.houseB : E.houseA, i % 2 ? E.houseBD : E.houseAD, { roof: E.roof, lit: [lit, lit, lit] }), v ? 0.85 : 0.82); }).join("");
  const dc = a > 3.19 ? at(v ? 960 : 1310, v ? 1460 : G, racks(seg(a, 3.4, 3.6), tot), (v ? 0.95 : 0.85) * pop(a - 3.19)) : "";
  const g = NIGHT(c, tot) + layer(`<rect x="-900" y="${G}" width="3800" height="${v ? 120 : 900}" fill="${P.ground}"/>` + (v ? `<rect x="-900" y="1460" width="3800" height="900" fill="${P.ground}"/>` : "") + street + dc + pl + eq, c);
  return { g, in: toScreen(c, PX, PY), inC: P.gold };
}

export const SHOTS = [s0, s1];
export const e2dictSet = makeSet(SHOTS, V, P);
