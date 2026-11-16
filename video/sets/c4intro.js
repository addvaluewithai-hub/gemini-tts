// Crypto part 4, intro: two wordless shots (shots.md, scene intro).
//   0 a price tag on a string swings into frame and hangs over the coin; a "?" pops on it: why does it have a price?
//   1 one glowing row of the public book: a claw grabs at it and comes up empty (nothing to touch), an empty government
//     podium beside it is crossed out (nothing behind it), and the row's number rolls to $126,000 under a 2025 calendar
import { clamp, lerp, ease, easeOut, seg, spring, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4intro.v.js";
import { P, mix, house, book, coin, stars, skyline } from "./bank.js";
import { calPage } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);
const G = 880;
const town = (c) => layer(skyline(31, -800, 2800, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(67, -800, 2800, G, 80, 230, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c);
// a price tag, 300 wide, hanging from its hole at (0, 0)
const priceTag = (inner = "") => `${two("M-20 -10L40 -70H300V70H40Z", P.cream, P.creamD, 0, 8)}<circle cx="18" cy="0" r="14" fill="${P.ink}"/>${inner}`;

// ---- 0: why does it have a price? ----
function s0(a, tot) {
  const C = [960, 600], c = camAt(a, [[0, 960, 560, 1.0], [3.35, 960, 520, 1.12]]);
  const coinG = at(C[0], C[1] + 6 * Math.sin(tot * 2), rings(0, 0, 230, P.gold, 0.16) + coin(170, "B"), pop(a - 0.05, 7, 12));
  // the tag drops on its string from above at "price" and swings to rest
  const t = a - 0.75, sw = t > 0 ? 28 * Math.exp(-t * 2.2) * Math.cos(t * 6) : 0, drop = t > 0 ? easeOut(seg(t, 0, 0.35)) : 0, top = [C[0] + 40, -40];
  const hole = [top[0] + Math.sin(sw * Math.PI / 180) * 300, lerp(-260, 260, drop)];
  const q = a > 2.35 ? at(170, 0, at(0, 0, text(0, 50, "?", 140, P.red), pop(a - 2.35), -70 - sw) ) : "";
  const tag = t > 0 ? `<path d="M${top[0]} ${top[1]}L${hole[0].toFixed(1)} ${hole[1].toFixed(1)}" stroke="${P.cream}" stroke-width="5"/>` + at(hole[0], hole[1], priceTag(q), 1.45, 70 + sw) : "";
  const g = night(c, tot, 13) + town(c) + layer(coinG + tag, c);
  return { g, out: toScreen(c, hole[0] + 60, hole[1] + 170), outC: P.cream, outZ: 18 };
}

// ---- 1: a line in a ledger, nothing to touch, no government, and 126,000 dollars ----
function s1(a, tot) {
  const BK = [760, 470], c = camAt(a, [[0, 820, 500, 1.12], [2.0, 860, 520, 1.05], [3.6, 860, 520, 1.05], [4.6, 780, 480, 1.25], [6.04, 780, 480, 1.28]]);
  // the book, one row glowing
  const roll = seg(a, 3.9, 5.6), val = Math.round(lerp(1, 126000, Math.pow(ease(roll), 2.2))), digits = "$" + val.toLocaleString("en");
  const row = `<path d="${rr(-150, -60, 300, 46, 10)}" fill="${P.gold}" opacity="${(0.35 + 0.15 * Math.sin(tot * 4)).toFixed(2)}"/><circle cx="-128" cy="-37" r="11" fill="${P.blue}"/>` + text(130, -22, a > 3.85 ? digits : "1", a > 3.85 && val > 9999 ? 34 : 38, P.ink, { anchor: "end" });
  const theBook = at(BK[0], BK[1], rings(0, -30, 230, P.gold, 0.12) + book(row + `<path d="M-135 20h100M-135 46h80M15 20h100M15 46h70" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/>`), 1.95 * pop(a + 0.3));
  // an arcade claw comes down on the row, closes, and comes back up holding nothing
  const down = a < 1.25 ? ease(seg(a, 0.55, 1.05)) : 1 - ease(seg(a, 1.45, 1.95)), shut = seg(a, 1.05, 1.3), cy = lerp(-80, BK[1] - 90, down);
  const claw = a > 0.5 && a < 2.1 ? `<path d="M${BK[0] + 60} -100V${cy.toFixed(1)}" stroke="${P.steel}" stroke-width="10"/>` + at(BK[0] + 60, cy, `${two(rr(-40, -30, 80, 40, 10), P.steel, P.steelD, 0, 6)}${[-1, 1].map((d) => `<path d="M${d * 30} 8Q${d * (60 - 34 * shut)} 50 ${d * (24 - 18 * shut)} 90" fill="none" stroke="${P.steelD}" stroke-width="12" stroke-linecap="round"/>`).join("")}`) : "";
  const empty = a > 1.7 && a < 2.4 ? at(BK[0] + 60, BK[1] - 260, text(0, 0, "∅", 90, P.cream, { opacity: (1 - seg(a, 2.1, 2.4)).toFixed(2) }), pop(a - 1.7)) : "";
  // the government podium, empty and dark
  const PD = [1420, 880], gov = at(PD[0], PD[1], `<path d="${rr(-230, -24, 460, 24, 6)}" fill="#44529a"/>${two(rr(-200, -250, 400, 226, 6), "#5a6aa8", "#44529a", 12, 0)}${[-150, -75, 0, 75, 150].map((x) => `<path d="${rr(x - 16, -240, 32, 210, 4)}" fill="#6d7cc0"/>`).join("")}<path d="M-220 -250H220L0 -330Z" fill="#44529a"/>${two("M-90 -330A90 90 0 0 1 90 -330Z", "#5a6aa8", "#44529a", 0, 8)}<path d="M0 -420V-500" stroke="${P.steel}" stroke-width="8"/><path d="M0 -500h70l-12 18l12 18h-70Z" fill="${P.steel}"/><path d="M-50 0V-120A50 50 0 0 1 50 -120V0Z" fill="${P.ink}"/>`, 0.95 * pop(a - 2.1)) + (a > 2.6 ? cross(PD[0] + 170, PD[1] - 420, 56, P.red, a - 2.6) : "");
  const cal = a > 3.7 ? at(BK[0] + 400, BK[1] - 260, calPage("2025", "", 1, 150), 0.6 * pop(a - 3.7), 6) : "";
  const g = night(c, tot, 29) + town(c) + layer(gov + theBook + claw + empty + cal, c);
  return { g, in: [960, 540], inC: P.cream, inZ: 18 };
}

const SHOTS = [s0, s1];
export const c4introSet = makeSet(SHOTS, V, P);
