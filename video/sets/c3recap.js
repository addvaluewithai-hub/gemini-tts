// Crypto part 3, the summary: one shot, the camera travelling over three stops (host right).
//   1 the key turns in the address box and it opens: the key is ownership
//   2 the book: a trail of arrows lights up backwards from one named address: not anonymous, never forgets
//   3 the exchange tower cracks and falls on one side; on the other a key slips through a crack in the floor
// The words here were placed by roughwords.cjs (a gap in the listen-back), so the actions are kept loose.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3recap.v.js";
import { P, coin, stars, skyline, book } from "./bank.js";
import { key, mailbox, tower } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const badge = (n) => `${disc(0, 0, 54, P.gold, P.goldD)}${text(0, 24, String(n), 66, P.ink)}`;
const ADDR = [[-150, -50], [-70, 10], [10, -40], [80, 20], [150, -30]];

function s0(a, tot) {
  const G = 940, X1 = 700, X2 = 2300, X3 = 3900;
  const c = camAt(a, [[0, 700, 560, 1.05], [2.6, 760, 560, 1.05], [3.3, 2300, 540, 1.05], [5.5, 2320, 540, 1.05], [6.1, 3860, 540, 1.0], [8.77, 3880, 540, 1.0]]);
  // stop 1: the key opens the box
  const ins = ease(seg(a, 1.6, 2.2)), opn = ease(seg(a, 2.2, 2.6));
  const s1 = at(X1 + 120, G, mailbox({ open: opn, colour: P.blue, seed: 7 }), 1.3) + at(lerp(X1 - 420, X1 - 120, ins), G - 360, `<g transform="translate(-110 0)">${key({ digits: 6 })}</g>`, 0.8) + (opn > 0.5 ? rings(X1 + 120, G - 400, 140, P.gold, 0.25) : "") + at(X1 - 300, 200, badge(1), pop(a - 1.4));
  // stop 2: the book with arrows; a light runs back along them from the last (named) address
  const lit = seg(a, 3.6, 4.9);
  let trail = ""; ADDR.forEach((p, i) => { if (i === 0) return; const q = ADDR[i - 1], on = lit * ADDR.length > ADDR.length - i; trail += `<path d="M${q[0]} ${q[1]}L${p[0]} ${p[1]}" stroke="${on ? P.gold : "#bda97c"}" stroke-width="${on ? 9 : 6}" stroke-linecap="round"/>`; });
  ADDR.forEach((p, i) => { const on = lit * ADDR.length > ADDR.length - 1 - i; trail += `<circle cx="${p[0]}" cy="${p[1]}" r="14" fill="${on ? P.gold : "#a58f5e"}"/>`; });
  const name = a > 3.3 ? at(150, -30, `<path d="${rr(-30, -86, 60, 44, 6)}" fill="${P.blue}"/><path d="M-6 -42v20" stroke="${P.blue}" stroke-width="4"/>`, pop(a - 3.3)) : "";
  const s2 = at(X2, 520, rings(0, 0, 220, P.gold, 0.06 + 0.1 * lit, 1.25) + book(trail + name), 1.9) + at(X2 - 380, 200, badge(2), pop(a - 3.2));
  // stop 3: the tower falls on the left, the key slips through a crack on the right
  const fall = easeIn(seg(a, 6.4, 7.2)), crack = seg(a, 7.4, 7.8), slip = easeIn(seg(a, 7.8, 8.4));
  const tw = at(X3 - 220, G, tower({ name: "", h: 620, seed: 9, crack: seg(a, 6.1, 6.4), lit: 1 - fall }), 0.9, -80 * fall);
  const hole = crack > 0 ? `<path d="M${X3 + 90} ${G}l40 ${(-6 * crack).toFixed(0)}l40 ${(8 * crack).toFixed(0)}l50 ${(-5 * crack).toFixed(0)}l40 ${(6 * crack).toFixed(0)}l${(-20 * crack).toFixed(0)} ${(120 * crack).toFixed(0)}l-60 ${(-30 * crack).toFixed(0)}l-50 ${(40 * crack).toFixed(0)}Z" fill="#05030f"/>` : "";
  const k3 = slip < 1 ? at(X3 + 220, G - 60 + 200 * slip, `<g transform="translate(-110 0)">${key({ digits: 4 })}</g>`, 0.6 * (1 - 0.7 * slip), 70 * slip, `opacity="${(1 - seg(slip, 0.5, 1)).toFixed(2)}"`) : "";
  const s3 = tw + hole + k3 + at(X3 - 120, 200, badge(3), pop(a - 6.0));
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(83, 160, -800, 5200, 1080, tot), c, 0.15) + layer(skyline(61, -800, 5200, G - 10, 80, 280, "#2a1d66", "#ffb066"), c, 0.5)
    + layer(`<rect x="-800" y="${G}" width="6400" height="600" fill="#221650"/>` + s1 + s2 + s3, c);
  return { g, in: [960, 540], inC: P.gold, inZ: 16 };
}

const SHOTS = [s0];
export const c3recapSet = makeSet(SHOTS, V, P);
