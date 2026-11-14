// "Intro" in portrait (1080 x 1920), for the Shorts. Shot 0 (the coin between the bank and the paper money) is the
// landscape shot reframed; shots 1–3, the pizza-shop counter, are redrawn for the tall frame: the shop wall and its sign
// above, the counter low, the heap and the two boxes swapping places on it, and the heap then rising into a mountain
// that fills the height of the frame with the price above its peak.
import { clamp, lerp, ease, seg, kf, layer, rr, disc, rings, number, at, FW, FH } from "./kit.js";
import { P, fmt, coin, stars } from "./bank.js";
import { calPage, pizzaBox } from "./props.js";
import { heap, HEAPN } from "./intro.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * (1 - Math.exp(-k * a) * Math.cos(w * a)));
const G = 1480, HX0 = 770, HX1 = 300, BX0 = 250, BX1 = 790;
function counterV(t, c, tot, s) {
  const T2 = (s.ends || [])[1] || 2.26, T3 = T2 + ((s.ends || [])[2] || 1.51), u2 = t - T2, u3 = t - T3;
  // the swap: the heap goes left, the boxes go right
  const sw = ease(seg(u2, 0.22, 0.85)), grow = ease(seg(u3, 1.0, 2.45)), hx = lerp(lerp(HX0, HX1, sw), 540, grow), bx = lerp(BX0, BX1, ease(seg(u2, 0.3, 0.92))), hop = Math.sin(Math.PI * sw) * 40, bhop = Math.sin(Math.PI * seg(u2, 0.3, 0.92)) * 60;
  const fill = kf(t, [[0.45, 0], [1.9, HEAPN]], (p) => 1 - Math.pow(1 - p, 1.6)), n = Math.floor(fill);
  const stream = t > 0.4 && t < 1.95 ? Array.from({ length: 7 }, (_, i) => { const q = ((t * 2.6 + i / 7) % 1); return at(HX0 + 30 * Math.sin(i * 2.3) + 10 * Math.sin(t * 5 + i), lerp(200, G - 60, q * q), coin(26), [Math.max(0.1, Math.abs(Math.cos(t * 8 + i))), 1]); }).join("") : "";
  // the heap rises into a mountain as tall as half the frame
  const k = lerp(1.15, 2.1, grow), settle = (t0) => (t > t0 ? 1 - 0.06 * Math.exp(-(t - t0) * 9) * Math.cos((t - t0) * 16) : 1);
  const mount = at(hx, G - hop, (grow > 0 ? rings(0, -150 * k, 240 * k, P.gold, 0.14 * grow, 1.3) : "") + heap(n, tot * 3), [k, k * settle(T2 + 0.85)]);
  const boxes = at(bx, G - bhop, at(0, 0, pizzaBox(0)) + at(6, -48, pizzaBox(0)) + [0, 1, 2].map((i) => { const q = ((tot * 0.6 + i / 3) % 1); return `<circle cx="${-40 + i * 40 + 10 * Math.sin(tot * 2 + i)}" cy="${-110 - q * 120}" r="${10 + q * 16}" fill="${P.cream}" opacity="${(0.4 * (1 - q)).toFixed(2)}"/>`; }).join(""), 1.5);
  // the number: first how many coins, over the heap; then what they are worth today, over the peak
  const flip = seg(u3, 0.85, 1.15), cnt = Math.round(lerp(0, 10000, clamp(fill / HEAPN))), worth = lerp(41, 700000000, ease(seg(u3, 1.14, 2.4)));
  const lx = lerp(hx, 540, ease(seg(u3, 0.85, 1.4))), ly = lerp(G - 420 - hop, 790, ease(seg(u3, 0.85, 1.4)));
  const label = t > 1.0 ? at(lx, ly, flip < 0.5 ? `${rings(-170, -40, 46, P.gold, 0.25)}${at(-170, -40, coin(34))}${number(60, 0, fmt(cnt), 104, P.gold)}`
    : `${rings(0, -40, 120, P.gold, 0.16)}${number(0, 0, "$" + fmt(worth), 112, P.gold)}`, [Math.max(0.04, Math.abs(Math.cos(Math.PI * flip))) * pop(t - 1.0), pop(t - 1.0)]) : "";
  const cal = at(540, 560, calPage("2010", "", 1.0, 150), pop(t - 0.19) * (1 - ease(seg(u2, -0.05, 0.25))));
  // the shop: awning across the top, the pizza sign on the left, the warm window on the right
  const shop = `<path d="${rr(-200, 200, 1480, 1300, 0)}" fill="#4a2b8a"/><path d="${rr(720, 330, 300, 380, 20)}" fill="${P.ink}"/><path d="${rr(740, 350, 260, 340, 14)}" fill="#ff8a3c"/><circle cx="870" cy="610" r="70" fill="#ffd27a" opacity="${(0.6 + 0.2 * Math.sin(tot * 5)).toFixed(2)}"/>
    ${Array.from({ length: 10 }, (_, i) => `<path d="M${-200 + i * 150} 200h150v74a75 32 0 0 1 -150 0Z" fill="${i % 2 ? P.cream : P.red}"/>`).join("")}<path d="${rr(80, 360, 300, 300, 150)}" fill="${P.ink}"/>${disc(230, 510, 120, "#e8a23c", "#c47f22")}${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${230 + Math.cos(i) * 70}" cy="${510 + Math.sin(i) * 70}" r="16" fill="${P.red}"/>`).join("")}`;
  const desk = `<rect x="-600" y="${G}" width="2300" height="60" fill="${P.wood}"/><rect x="-600" y="${G + 60}" width="2300" height="700" fill="${P.woodD}"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${-400 + i * 260}" y="${G + 90}" width="200" height="300" rx="12" fill="#6e4322"/>`).join("")}`;
  return `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(19, 60, -400, 1500, 300, tot), c, 0.15) + layer(shop, c, 0.85) + layer(desk + stream + mount + boxes + label + cal, c);
}
const v1 = (a, tot, s) => ({ g: counterV(a, { x: 540, y: 960, z: 1 + 0.015 * a }, tot, s) });
const v2 = (a, tot, s) => { const T2 = (s.ends || [])[1] || 2.26; return { g: counterV(T2 + a, { x: 540, y: 960, z: 1.034 }, tot, s) }; };
const v3 = (a, tot, s) => { const T3 = ((s.ends || [])[1] || 2.26) + ((s.ends || [])[2] || 1.51); return { g: counterV(T3 + a, { x: 540, y: kf(a, [[0, 960], [2.5, 930]]), z: kf(a, [[0, 1.034], [2.5, 0.98]]) }, tot, s) }; };
export const V = [{ z: 1.0 }, v1, v2, v3];
