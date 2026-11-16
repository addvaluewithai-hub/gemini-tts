// Crypto part 5, intro: two wordless shots (shots.md, scene intro), one camera across both.
//   0 the brown book on its lectern grows gears and a little screen (it runs programs); behind it the four earlier
//     reports light up as four framed pictures, one by one
//   1 the camera rises to the four pictures; each gets a tick: why it was made, how it works, how it's held, its price
import { clamp, lerp, ease, easeOut, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, at, check, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5intro.v.js";
import { P, coin, stars, skyline, bank } from "./bank.js";
import { bookGears, key, priceLine } from "./c5props.js";
import { page, link } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const G = 900;
const night = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(29, 80, -800, 2800, 1080, tot), c, 0.15);
const town = (c) => layer(skyline(41, -800, 2800, G - 20, 120, 300, P.far), c, 0.4) + layer(skyline(77, -800, 2800, G, 80, 220, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c);

// the four earlier reports as small framed pictures (centre (0, 0), 260 x 180)
const MINI = [
  () => at(0, 50, bank({ sign: [1, 1, 1, 1] }), 0.18) + at(70, -20, coin(30, "B"), 1),
  () => at(-70, 0, page({ rows: [["blue", "pink", "30"]], seal: 3, block: 1 }), 0.3) + link(-30, 0, 30, 0, "#ffd04a", 1, 0.6) + at(70, 0, page({ rows: [["teal", "pink", "5"]], seal: 4, prev: 3 }), 0.3),
  () => at(-90, 0, key({ unroll: 0.6, digits: 6 }), 0.45),
  () => at(-110, 60, priceLine(1, { w: 220, h: 110, width: 6 }).g, 1),
];
const FR = [[435, 215], [785, 215], [1135, 215], [1485, 215]];
const frame = (i, on, tick) => { const lit = clamp(on);
  return `${lit > 0 ? rings(0, 0, 150, "#ffd98a", 0.12 * lit) : ""}${two(rr(-140, -100, 280, 200, 14), P.wood, P.woodD, 0, 8)}<path d="${rr(-122, -82, 244, 164, 8)}" fill="#1b1550"/>
    <g opacity="${(0.25 + 0.75 * lit).toFixed(2)}"><clipPath id="c5f${i}"><path d="${rr(-122, -82, 244, 164, 8)}"/></clipPath><g clip-path="url(#c5f${i})">${MINI[i]()}</g></g>
    ${text(-104, -56, String(i + 1), 34, P.gold, { anchor: "start" })}${tick > 0 ? check(92, 58, 30, P.green, tick) : ""}`; };

// t: seconds since shot 0 began; T1: when shot 1 began
function scene(t, c, tot, T1) {
  const grow = seg(t, 0.9, 1.5), spin = t > 1.4 ? (t - 1.4) * 2.4 : 0;
  const lights = [2.8, 3.1, 3.5, 3.9], ticks = [0.0, 0.75, 1.7, 2.6];
  const frames = FR.map(([x, y], i) => at(x, y, frame(i, seg(t, lights[i], lights[i] + 0.3), t - T1 - ticks[i]), 1.15 * (pop(t - lights[i] + 0.35) * 0.9 + 0.1 * (t > lights[i] - 0.35 ? 1 : 0)))).join("");
  const lectern = `${two(rr(890, G - 300, 140, 300, 8), "#7a55c9", "#5b3aa6", 12, 0)}<path d="${rr(800, G - 30, 320, 30, 10)}" fill="#5b3aa6"/>`;
  const theBook = at(960, G - 360, rings(0, 0, 200, "#ffd98a", 0.08 + 0.06 * grow, 1.3) + bookGears({ grow, spin }), 1.35);
  return night(c, tot) + town(c) + layer(lectern + theBook + frames, c);
}
function s0(a, tot, s) { const T1 = (s.ends || [])[0] || 4.45;
  const c = camAt(a, [[0, 960, 560, 1.25], [1.6, 960, 540, 1.3], [2.6, 960, 440, 0.95], [T1, 960, 430, 0.95]]);
  return { g: scene(a, c, tot, T1) }; }
function s1(a, tot, s) { const T1 = (s.ends || [])[0] || 4.45;
  const c = camAt(a, [[0, 960, 430, 0.95], [0.6, 960, 300, 1.15], [3.41, 960, 290, 1.18]]);
  return { g: scene(T1 + a, c, tot, T1) }; }

const SHOTS = [s0, s1];
export const c5introSet = makeSet(SHOTS, V, P);
