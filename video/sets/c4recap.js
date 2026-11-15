// Crypto part 4, scene "recap": one shot, the camera travels left to right over three stops (host right, so the
// lower right corner stays clear; shot list: explain-crypto-04-world/shots.md):
//   1 the scarce stack (the silo with its 21,000,000 lid) and the believing houses lighting up
//   2 the price mountain, and the leverage plank that snaps
//   3 the three report cards PAY ~, PRICE ✗, SAVE ½, and a betting chip: "a bet"
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, rr, circ, two, disc, rings, text, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4recap.v.js";
import { stars, skyline, house } from "./bank.js";
import { P, mix, coin, priceLine, plank, reportCard, silo } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const badge = (n, a) => (a > 0 ? `${disc(0, 0, 46, P.gold, P.goldD)}${text(0, 20, String(n), 56, P.ink)}` : "");
const G = 860;
// what each card is about: a coin at a counter, a loaf with a price, a jar of coins
const INNER = [at(0, -20, coin(60, "B")), at(0, -10, `<path d="M-90 10Q-100 -60 0 -64Q100 -60 90 10Z" fill="#f0a65a"/>`), at(0, 60, `<path d="M-60 -150h120v20q14 16 14 40v90q0 10 -10 10h-128q-10 0 -10 -10v-90q0 -24 14 -40Z" fill="#cfe9ff" opacity=".35" stroke="#cfe9ff" stroke-width="6"/>${[0, 1, 2, 3].map((k) => `<ellipse cx="${-30 + (k % 2) * 40}" cy="${-10 - Math.floor(k / 2) * 26}" rx="22" ry="9" fill="${P.gold}"/>`).join("")}`)];
function s0(a, tot) {
  const c = camAt(a, [[0, 560, 520, 1.25], [3.6, 640, 520, 1.25], [4.4, 1640, 500, 1.15], [7.5, 1700, 500, 1.15], [8.3, 2720, 470, 1.15], [11.44, 2740, 470, 1.18]]);
  // 1: the silo with its lid and the houses that believe: their windows light one by one
  const one = at(330, 220, badge(1, a - 1.4), pop(a - 1.4)) + at(560, G, silo(0.92, { lid: seg(a, 1.9, 2.4), id: "r4" }), 0.62)
    + [[230, P.blue, P.blueD], [880, P.pink, P.pinkD], [1020, P.teal, P.tealD]].map(([x, col, colD], i) => { const on = a > 2.8 + i * 0.2 ? 1 : 0;
      return at(x, G, (on ? rings(0, -200, 120, P.gold, 0.2) : "") + house(col, colD, { lit: [on, on, on] }), 0.6); }).join("");
  // 2: the price mountain drawn while the camera arrives, then the plank snaps
  const pl = priceLine(seg(a, 4.2, 5.8), { w: 900, h: 420 });
  const two_ = at(1240, 220, badge(2, a - 4.1), pop(a - 4.1)) + at(1300, G - 40, pl.g) + at(2000, G - 120, plank({ mine: 3, lent: 8, tilt: a < 6.7 ? 0.25 : 0, snap: seg(a, 6.7, 7.0) }), 0.6);
  // 3: the three report cards and a betting chip
  const marks = ["~", "✗", "½"], cols = [P.blue, P.pink, P.teal], labels = ["PAY", "PRICE", "SAVE"];
  let three = at(2380, 200, badge(3, a - 7.8), pop(a - 7.8));
  labels.forEach((l, i) => { three += at(2440 + i * 290, 520, reportCard(l, { c: cols[i], mark: a > 8.6 + i * 0.4 ? marks[i] : "", inner: INNER[i] }), 0.82 * pop(a - 7.9 - i * 0.12)); });
  const chip = a > 10.6 ? at(2730, 190, `${disc(0, 0, 70, P.red, P.redD)}${[0, 1, 2, 3, 4, 5].map((i) => `<path d="${rr(-10, -70, 20, 22, 4)}" fill="#fff" transform="rotate(${i * 60})"/>`).join("")}<circle r="44" fill="#fff"/>${text(0, 16, "?", 50, P.red)}`, pop(a - 10.6), 20 * Math.sin(tot * 3)) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(73, 140, -600, 4000, 1080, tot), c, 0.15) + layer(skyline(79, -800, 4200, G - 20, 60, 180, "#1f1652", "#ffb066"), c, 0.45)
    + layer(`<rect x="-1200" y="${G}" width="6000" height="700" fill="#24164f"/>` + one + two_ + three + chip, c);
  return { g };
}
export const c4recapSet = makeSet([s0], V, P);
