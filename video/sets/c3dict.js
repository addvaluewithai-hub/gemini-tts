// Crypto part 3, "the humans' dictionary": two wordless shots (shots.md, scene dict).
//   0 SEED PHRASE: the twelve-word slip slides into a vault's keyhole and the vault swings open on gold
//   1 CUSTODY: one key bounces between the blue house and an exchange tower; a big "?" over it (host right)
// The words here were placed by roughwords.cjs (a gap in the listen-back), so the actions are kept loose.
import { clamp, lerp, ease, easeOut, seg, spring, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3dict.v.js";
import { P, house, coin, stars, skyline } from "./bank.js";
import { key, seedSlip, tower } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);
const label = (word, w) => `${two(rr(-w / 2, -60, w, 120, 60), P.gold, P.goldD, 0, 10)}${text(0, 34, word, 90, P.ink)}`;
const ground = (y) => `<rect x="-800" y="${y}" width="3600" height="600" fill="#221650"/>`;

// ---- 0: SEED PHRASE ----
function s0(a, tot) {
  const G = 960, VX = 1250, VY = 600;
  const c = camAt(a, [[0, 960, 540, 1.05], [2.3, 980, 560, 1.1], [4.87, 1080, 560, 1.15]]);
  const lab = a > 1.2 ? at(960, 170, label("SEED PHRASE", 700), pop(a - 1.2)) : "";
  // the slip, big in front, then it flies into the keyhole
  const go = ease(seg(a, 3.1, 3.8)), sp = bez([620, 560], [900, 360], [VX, VY], go);
  const slipG = a > 1.6 && go < 1 ? at(sp[0], sp[1], seedSlip(), (1.25 * pop(a - 1.6)) * (1 - 0.85 * go), -6 * (1 - go)) : "";
  // the vault: a round steel door that swings open on gold
  const open = ease(seg(a, 3.9, 4.6));
  const inside = `<circle r="230" fill="#141038"/>${open > 0 ? rings(0, 0, 200, P.gold, 0.3 * open) + [[-80, 60], [0, 80], [80, 60], [-40, 0], [40, 0], [0, -60]].map(([x, y]) => at(x, y, coin(44, "B"))).join("") : ""}`;
  const door = `<g transform="translate(-230 0) scale(${(1 - 0.92 * open).toFixed(3)} 1) translate(230 0)">${two(`M-230 0a230 230 0 1 0 460 0a230 230 0 1 0 -460 0Z`, P.steel, P.steelD, 0, 12)}<circle r="160" fill="none" stroke="${P.steelD}" stroke-width="14"/><circle r="60" fill="${P.steelD}"/><path d="${rr(-14, -40, 28, 56, 8)}" fill="${P.ink}"/><circle cy="-40" r="20" fill="${P.ink}"/></g>`;
  const vault = at(VX, VY, `<path d="${rr(-290, -290, 580, 580, 40)}" fill="#3a3570"/>${inside}${door}`, 0.95);
  const g = night(c, tot, 47) + layer(skyline(19, -800, 2800, G - 10, 80, 280, "#2a1d66", "#ffb066"), c, 0.5) + layer(ground(G) + vault + slipG + lab, c);
  return { g, out: toScreen(c, VX, VY), outC: P.gold, outZ: 18 };
}

// ---- 1: CUSTODY ----
function s1(a, tot) {
  const G = 940, HX = 520, TX = 1250;
  const c = camAt(a, [[0, 900, 540, 1.0], [5.57, 900, 520, 1.04]]);
  const lab = at(900, 160, label("CUSTODY", 520), pop(a - 0.1));
  const hs = at(HX, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.15);
  const tw = at(TX, G, tower({ h: 560, seed: 5 }), 0.85);
  // the key hops: house → tower → house → tower, and stops in the middle
  const hops = [[1.0, 0], [1.9, 1], [2.8, 0], [3.5, 0.5]], pos = (w) => [lerp(HX + 40, TX - 10, w), lerp(G - 260, G - 420, Math.abs(w - 0) * 0) + (w === 0.5 ? -40 : 0)];
  let from = 0, to = 0, u = 1;
  for (let i = 0; i < hops.length; i++) { if (a >= hops[i][0]) { from = i ? hops[i - 1][1] : 0; to = hops[i][1]; u = seg(a, hops[i][0], hops[i][0] + 0.6); } }
  const p0 = pos(from), p1 = pos(to), kp = bez(p0, [(p0[0] + p1[0]) / 2, Math.min(p0[1], p1[1]) - 220], p1, ease(u));
  const k = at(kp[0], kp[1] + (to === 0.5 && u >= 1 ? 8 * Math.sin(tot * 3) : 0), `<g transform="translate(-120 0)">${key({ digits: 6 })}</g>`, 1.05, 10 * Math.sin(u * Math.PI));
  const q = a > 3.9 ? at(900, 470, text(0, 60, "?", 220, P.cream), pop(a - 3.9) * (1 + 0.04 * Math.sin(tot * 3))) : "";
  const g = night(c, tot, 59) + layer(skyline(29, -800, 2800, G - 10, 80, 260, "#2a1d66", "#ffb066"), c, 0.5) + layer(ground(G) + hs + tw + k + q + lab, c);
  return { g, in: toScreen(c, 900, 160), inC: P.gold, inZ: 18 };
}

const SHOTS = [s0, s1];
export const c3dictSet = makeSet(SHOTS, V, P);
