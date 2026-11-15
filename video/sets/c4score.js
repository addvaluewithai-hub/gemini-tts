// Crypto part 4, scene "score": money's three jobs from part 1 as three report cards on one desk, one camera across
// three shots (shot list: episodes/techforbadguys/explain-crypto-04-world/shots.md):
//   0 PAY: a coin at a shop counter, the queue's clock runs and the fee tag keeps changing; the holder hides the coin. Mark ~
//   1 PRICE: a loaf whose price tag in coins keeps rolling before its steam is gone. Mark ✗
//   2 SAVE: a jar that fills over the years; a crack takes half in one year. Mark ½
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4score.v.js";
import { stars, house } from "./bank.js";
import { jar } from "./props.js";
import { P, mix, coin, reportCard, clock } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const CARDS = [[520, "PAY", P.blue], [1000, "PRICE", P.pink], [1480, "SAVE", P.teal]], CY = 560;
// the desk with the three cards; t: seconds since shot 0 began; T1, T2 when shots 1 and 2 began
function desk(t, tot, s) {
  const E = s.ends || [], T1 = E[0] || 5.33, T2 = T1 + (E[1] || 4.67), u1 = t - T1, u2 = t - T2;
  const marks = [t > 0.85 ? "~" : "", u1 > 0.8 ? "✗" : "", u2 > 0.95 ? "½" : ""];
  let g = `<rect x="-600" y="${CY + 240}" width="3200" height="700" fill="${P.wood}"/><rect x="-600" y="${CY + 240}" width="3200" height="22" fill="${P.woodD}"/>`;
  // 0 PAY: a small counter with a coin; a clock spins, a fee tag flips; the holder pulls the coin back behind a house
  const fee = ["$1", "$9", "$3", "$22", "$5"][Math.floor(clamp((t - 1.5) / 0.25, 0, 4.99))], hide = ease(seg(t, 3.3, 4.2));
  const pay = `${clock(((t * 40) % 60), 52)}`;
  const inner0 = at(-60, -40, pay) + at(70, -80, `<path d="M-40 -22h70l20 22l-20 22h-70Z" fill="${P.creamD}"/>${text(-6, 14, t > 1.5 ? fee : "$1", 32, P.red)}`) + at(lerp(30, 100, hide), lerp(40, 70, hide), coin(38, "B"), 1 - 0.4 * hide) + at(60, 80, house(P.violet, P.violetD, { lit: [1, 1, 1] }), 0.32 * pop(t - 3.1));
  // 1 PRICE: a loaf with steam; its price in coins rolls
  const roll = u1 > 0 ? Math.floor(u1 * 6) : 0, price = ["0.00001", "0.00003", "0.00002", "0.00004", "0.00001"][roll % 5], steam = clamp(1 - u1 / 4.4);
  const inner1 = at(0, -10, `${[0, 1, 2].map((j) => `<path d="M${-30 + j * 30} -60q-14 -20 0 -40q14 -20 0 -40" stroke="#fff" stroke-width="7" fill="none" opacity="${(0.6 * steam).toFixed(2)}" transform="translate(0 ${(-((u1 * 30 + j * 15) % 30)).toFixed(1)})"/>`).join("")}${two("M-90 10Q-100 -60 0 -64Q100 -60 90 10Z", "#f0a65a", "#c9773a", 0, 9)}`) + at(0, 80, `<path d="${rr(-110, -26, 220, 52, 12)}" fill="${P.ink}"/>${text(10, 16, price, 34, P.gold)}${at(-82, -4, coin(16, "B"))}`);
  // 2 SAVE: a jar that fills over years, then cracks and loses half
  const fill = u2 > 0 ? (u2 < 2.6 ? 0.2 + 0.8 * ease(seg(u2, 1.4, 2.5)) : 1 - 0.5 * ease(seg(u2, 3.0, 3.8))) : 0.2, crack = seg(u2, 2.9, 3.3);
  const inner2 = at(0, 110, jar(fill), 0.68) + (crack > 0 ? drawn("M-30 -60L-10 -20L-40 10L-5 40", crack, P.ink, 6) : "") + (u2 > 3.0 ? at(80, 60, text(0, 0, "-50%", 34, P.red), pop(u2 - 3.3)) : "") + (u2 > 1.4 && u2 < 3 ? at(-80, -110, text(0, 0, "+", 50, P.green), pop(u2 - 1.6)) : "");
  const inners = [inner0, inner1, inner2], starts = [0, T1, T2];
  CARDS.forEach(([x, label, col], i) => { const lit = t >= starts[i] - 0.2 ? 1 : 0.55;
    g += at(x, CY, `<g opacity="${lit}">${reportCard(label, { c: col, mark: marks[i], inner: t >= starts[i] - 0.3 ? inners[i] : "" })}</g>`, 1.25 * pop(t + 0.6 - i * 0.12)); });
  return g;
}
const night = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(53, 90, -600, 2600, 1080, tot), c, 0.15);
function s0(a, tot, s) { const c = camAt(a, [[0, 1000, 600, 0.85], [0.9, 540, 600, 1.55], [5.33, 540, 600, 1.6]]); return { g: night(c, tot) + layer(desk(a, tot, s), c) }; }
function s1(a, tot, s) { const T1 = (s.ends || [])[0] || 5.33, c = camAt(a, [[0, 540, 600, 1.6], [0.6, 1000, 600, 1.6], [4.67, 1010, 600, 1.65]]); return { g: night(c, tot) + layer(desk(T1 + a, tot, s), c) }; }
function s2(a, tot, s) { const E = s.ends || [], T2 = (E[0] || 5.33) + (E[1] || 4.67), c = camAt(a, [[0, 1010, 600, 1.65], [0.6, 1470, 600, 1.6], [3.3, 1470, 600, 1.65], [4.58, 1000, 600, 0.9]]); return { g: night(c, tot) + layer(desk(T2 + a, tot, s), c) }; }

const SHOTS = [s0, s1, s2];
export const c4scoreSet = makeSet(SHOTS, V, P);
