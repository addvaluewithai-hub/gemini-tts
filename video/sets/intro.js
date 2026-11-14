// "Intro": the cover and the pizza hook of crypto part 1, four shots with nothing to read but a year and amounts.
//   0 a coin with the bitcoin mark lands between the bank and a stack of paper money; the bank sinks, the paper blows away
//   1 2010: coins pour onto a shop counter, ten thousand of them, next to two pizza boxes
//   2 the heap slides over the counter and the two boxes slide back: ten thousand for two pizzas
//   3 the heap swells into a mountain of gold and the price rolls up to $700,000,000; the boxes stay small at its foot
// Shots 1–3 are one counter seen by one camera (no hand-over shape between them: the camera simply carries on).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, cross, play, frame } from "./kit.js";
import { P, mix, fmt, bank, book, rows, coin, stars, skyline } from "./bank.js";
import { calPage, banknote, pizzaBox } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
// a coin with the bitcoin mark: a B with two short bars through its top and bottom
export const btc = (r, spin = 1) => at(0, 0, `${disc(0, 0, r, P.gold, P.goldD)}<circle r="${r * 0.76}" fill="none" stroke="${P.goldD}" stroke-width="${r * 0.08}"/>
  ${spin > 0.25 ? `<rect x="${-r * 0.2}" y="${-r * 0.66}" width="${r * 0.1}" height="${r * 1.32}" rx="${r * 0.04}" fill="#8a5200"/><rect x="${r * 0.04}" y="${-r * 0.66}" width="${r * 0.1}" height="${r * 1.32}" rx="${r * 0.04}" fill="#8a5200"/>${text(0, r * 0.42, "B", r * 1.18, "#8a5200")}` : ""}`, [Math.max(0.04, Math.abs(spin)), 1]);
// a heap of coins, base on y = 0: `n` of its `N` coins are there, bottom row first
const HEAP = (() => { const out = []; const rowsN = [9, 8, 7, 6, 5, 4, 3, 2, 1]; rowsN.forEach((w, r) => { for (let i = 0; i < w; i++) out.push([(i - (w - 1) / 2) * 44 + (r % 2 ? 0 : 0), -26 - r * 30]); }); return out; })();
export const heap = (n = HEAP.length, glint = 0) => HEAP.slice(0, Math.max(0, Math.min(HEAP.length, Math.floor(n)))).map(([x, y], i) => at(x, y, `${disc(0, 0, 28, P.gold, P.goldD)}<ellipse cx="0" cy="0" rx="20" ry="20" fill="none" stroke="${P.goldD}" stroke-width="3.5"/>${(i * 7 + Math.floor(glint)) % 17 === 0 ? `<path d="M-6 -10l3 7l7 3l-7 3l-3 7l-3 -7l-7 -3l7 -3Z" fill="#fff" transform="translate(10 -6)"/>` : ""}`)).join("");
export const HEAPN = HEAP.length;

// ---- 0: money with no bank and no paper ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1], [2.0, 960, 520, 1.04], [3.3, 960, 520, 1.05], [4.69, 960, 510, 1.08]]), G = 880, BX = 520, NX = 1500;
  const sink = easeIn(seg(a, 3.62, 4.25)), bk = at(BX, G + 1000 * sink, bank({ night: 1, sign: [1, 1, 1, 1], inside: P.ink, inner: at(0, -225, book(rows("100", "50")), 0.62) }), 0.92);
  const x1 = a > 3.46 ? at(0, 1000 * sink, cross(BX, G - 300, 70, P.red, a - 3.46)) : "";
  // a stack of notes that blows away on "paper"
  let notes = "";
  for (let i = 0; i < 9; i++) { const t0 = 4.0 + (8 - i) * 0.05, u = Math.max(0, a - t0), fly = u * u, x = NX + (i % 2 ? 6 : -6) + 900 * fly + 120 * u, y = G - 28 - i * 30 - 1500 * fly + 8 * Math.sin(tot * 3 + i) * (a < 3.9 ? 0.15 : 1);
    notes += at(x, y, banknote(2.0), 1, (i % 3 - 1) * 3 + 300 * fly * (i % 2 ? 1 : -1)); }
  const x2 = a > 4.22 ? at(0, 0, cross(NX - 60, G - 330, 70, P.red, a - 4.22), 1, 0, `opacity="${(1 - seg(a, 4.5, 4.69)).toFixed(2)}"`) : "";
  // the coin: a star that falls, lands with weight, turns to face us
  const fall = seg(a, 0.85, 1.22), land = a > 1.22 ? spring(a - 1.22, 7, 13) : 0, cy = a < 1.22 ? lerp(-260, 450, easeIn(fall)) : 450 + 40 * (1 - land), spin = a < 1.22 ? 0.3 : Math.cos(Math.max(0, 2.2 - a) * 4.5);
  const glow = a > 1.22 ? rings(960, 450, 270 * (0.6 + 0.4 * land) * (1 + 0.03 * Math.sin(tot * 2.4)), P.gold, 0.2, 1.4) : "";
  const wave = a > 3.46 ? rings(960, 450, 200 + 900 * seg(a, 3.46, 3.9), "#fff3c2", 0.12 * (1 - seg(a, 3.6, 3.9)), 1.05) : "";
  const trail = a > 0.85 && a < 1.3 ? [1, 2, 3].map((q) => `<circle cx="960" cy="${(cy - q * 60).toFixed(1)}" r="${(30 - q * 7) * 1.8}" fill="${P.gold}" opacity="${(0.45 - q * 0.12) * (1 - seg(a, 1.22, 1.3))}"/>`).join("") : "";
  const theCoin = a > 0.85 ? at(960, cy, btc(190, spin), [1 + 0.12 * (1 - land) * (a > 1.22 ? 1 : 0), 1 - 0.12 * (1 - land) * (a > 1.22 ? 1 : 0)]) : "";
  const street = `<rect x="-600" y="${G}" width="3200" height="500" fill="${P.ground}"/><rect x="-600" y="${G + 60}" width="3200" height="130" fill="${P.road}"/><path d="M-600 ${G + 125}H2600" stroke="#ff8a5c" stroke-width="8" stroke-dasharray="70 60" opacity=".5"/>`;
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(5, 70, -300, 2300, 700, tot) + `<circle cx="1640" cy="170" r="56" fill="${P.cream}"/><circle cx="1620" cy="156" r="50" fill="${P.night0}"/>`, c, 0.15)
    + layer(skyline(11, -400, 2400, 760, 120, 330, "#2a1f66", "#ffb066"), c, 0.5) + layer(street + bk + notes + glow + wave + trail + theCoin + x1 + x2, c);
  return { g, out: toScreen(c, 960, 450), outC: P.gold, outZ: 14 };
}

// ---- 1–3: the counter of a pizza shop at night ----
const G = 760, HX0 = 1250, HX1 = 620, BX0 = 650, BX1 = 1320;
function counter(t, c, tot, s) {
  const T2 = (s.ends || [])[1] || 2.26, T3 = T2 + ((s.ends || [])[2] || 1.51), u2 = t - T2, u3 = t - T3;
  // the swap: heap to the left, boxes to the right
  const sw = ease(seg(u2, 0.22, 0.85)), hx = lerp(HX0, HX1, sw), bx = lerp(BX0, BX1, ease(seg(u2, 0.3, 0.92))), hop = Math.sin(Math.PI * sw) * 40, bhop = Math.sin(Math.PI * seg(u2, 0.3, 0.92)) * 60;
  // coins pour in from above: how many are on the heap
  const fill = kf(t, [[0.45, 0], [1.9, HEAPN]], (p) => 1 - Math.pow(1 - p, 1.6)), n = Math.floor(fill);
  const stream = t > 0.4 && t < 1.95 ? Array.from({ length: 7 }, (_, i) => { const q = ((t * 2.6 + i / 7) % 1); return at(HX0 + 30 * Math.sin(i * 2.3) + 10 * Math.sin(t * 5 + i), lerp(-80, G - 60, q * q), coin(26), [Math.max(0.1, Math.abs(Math.cos(t * 8 + i))), 1]); }).join("") : "";
  // the heap grows into a mountain
  const grow = ease(seg(u3, 1.0, 2.45)), k = lerp(1.25, 1.9, grow);
  const settle = (t0) => (t > t0 ? 1 - 0.06 * Math.exp(-(t - t0) * 9) * Math.cos((t - t0) * 16) : 1);
  const mount = at(hx, G - hop, (grow > 0 ? rings(0, -260 * k * 0.5, 240 * k, P.gold, 0.14 * grow, 1.3) : "") + heap(n, tot * 3), [k, k * settle(T2 + 0.85)]);
  const boxes = at(bx, G - bhop, at(0, 0, pizzaBox(0)) + at(6, -48, pizzaBox(0)) + [0, 1, 2].map((i) => { const q = ((tot * 0.6 + i / 3) % 1); return `<circle cx="${-40 + i * 40 + 10 * Math.sin(tot * 2 + i)}" cy="${-110 - q * 120}" r="${10 + q * 16}" fill="${P.cream}" opacity="${(0.4 * (1 - q)).toFixed(2)}"/>`; }).join(""), 2.1);
  // the number over the heap: first how many coins, then what they are worth today
  const flip = seg(u3, 0.85, 1.15), cnt = Math.round(lerp(0, 10000, clamp(fill / HEAPN))), worth = lerp(41, 700000000, ease(seg(u3, 1.14, 2.4)));
  const lx = lerp(hx, 1330, ease(seg(u3, 0.85, 1.4))), ly = lerp(G - 470 - hop, 230, ease(seg(u3, 0.85, 1.4)));
  const label = t > 1.0 ? at(lx, ly, flip < 0.5 ? `${rings(-180, -40, 46, P.gold, 0.25)}${at(-180, -40, coin(34))}${number(60, 0, fmt(cnt), 110, P.gold)}`
    : `${rings(0, -40, 120, P.gold, 0.16)}${number(0, 0, "$" + fmt(worth), 120, P.gold)}`, [Math.max(0.04, Math.abs(Math.cos(Math.PI * flip))) * pop(t - 1.0), pop(t - 1.0)]) : "";
  const cal = at(640, 220, calPage("2010", "", 0.95, 150), pop(t - 0.19) * (1 - ease(seg(u2, -0.05, 0.25))));
  const shop = `<path d="${rr(120, 40, 1680, 800, 0)}" fill="#4a2b8a"/><path d="${rr(1380, 150, 300, 360, 20)}" fill="${P.ink}"/><path d="${rr(1400, 170, 260, 320, 14)}" fill="#ff8a3c"/><circle cx="1530" cy="420" r="70" fill="#ffd27a" opacity="${(0.6 + 0.2 * Math.sin(tot * 5)).toFixed(2)}"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M${120 + i * 140} 40h140v70a70 30 0 0 1 -140 0Z" fill="${i % 2 ? P.cream : P.red}"/>`).join("")}<path d="${rr(200, 160, 300, 300, 150)}" fill="${P.ink}"/>${disc(350, 310, 120, "#e8a23c", "#c47f22")}${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${350 + Math.cos(i) * 70}" cy="${310 + Math.sin(i) * 70}" r="16" fill="${P.red}"/>`).join("")}`;
  const desk = `<rect x="-600" y="${G}" width="3200" height="60" fill="${P.wood}"/><rect x="-600" y="${G + 60}" width="3200" height="500" fill="${P.woodD}"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${-400 + i * 260}" y="${G + 90}" width="200" height="300" rx="12" fill="#6e4322"/>`).join("")}`;
  return `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(19, 50, -400, 2400, 400, tot), c, 0.15) + layer(shop, c, 0.7) + layer(desk + stream + mount + boxes + label + cal, c);
}
function s1(a, tot, s) { const c = camAt(a, [[0, 985, 480, 1.1], [2.26, 975, 470, 1.12]]); return { g: counter(a, c, tot, s) }; }
function s2(a, tot, s) { const T2 = (s.ends || [])[1] || 2.26, c = camAt(a, [[0, 975, 470, 1.12], [1.51, 965, 470, 1.1]]); return { g: counter(T2 + a, c, tot, s) }; }
function s3(a, tot, s) { const T3 = ((s.ends || [])[1] || 2.26) + ((s.ends || [])[2] || 1.51), c = camAt(a, [[0, 965, 470, 1.1], [1.0, 960, 470, 1.08], [2.5, 960, 470, 1.03], [2.93, 960, 470, 1.02]]); return { g: counter(T3 + a, c, tot, s) }; }

const SHOTS = [s0, s1, s2, s3];
export const introSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
