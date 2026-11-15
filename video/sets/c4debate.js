// Crypto part 4, scene "debate": the critics and the believers, one wordless shot per board beat
// (shot list: episodes/techforbadguys/explain-crypto-04-world/shots.md). Two sides of one street, split by a line:
//   0 critics: a factory whose belt carries nothing; houses on a staircase pass the coin up, each paying more; a poison bottle
//   1 believers: a press jammed in a padlocked chain; a vault with no keyhole outside; an umbrella with a shield over the coin
//   2 2022: bread and fuel tags climb and burn; the umbrella glows "this is its day"; the coin falls through it, more than 60%
//   3 rituals: frames with laser eyes; the line drops; a LONG TERM sign is hammered in and closes like bars round the holder
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4debate.v.js";
import { stars, skyline, house } from "./bank.js";
import { calPage, press, padlock } from "./props.js";
import { P, mix, coin, priceLine } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x0 = -800, x1 = 4200) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 110, x0, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f") => `<rect x="-1600" y="${y}" width="8000" height="900" fill="${fill}"/>`;
const G = 900;
// the dividing line between the two sides of the street, at x = 1900
const divider = (tot) => `<path d="M1900 -200V${G + 400}" stroke="${P.cream}" stroke-width="8" stroke-dasharray="26 22" opacity=".35"/>`;

// a factory: a shed, a chimney with no smoke, a belt that carries nothing; `run` moves the belt
const factory = (run, xmark) => `${two(rr(-260, -300, 520, 300, 10), "#5a6aa8", "#44529a", 0, 10)}<path d="M-260 -300L-170 -380L-80 -300L10 -380L100 -300L190 -380L260 -300Z" fill="#44529a"/>
  <path d="${rr(150, -520, 60, 230, 6)}" fill="#39447f"/><path d="${rr(-200, -200, 400, 120, 8)}" fill="#141038"/>
  <path d="M-320 -40H360" stroke="${P.steelD}" stroke-width="30" stroke-linecap="round"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${(-300 + ((i * 100 + run * 160) % 660)).toFixed(1)}" cy="-40" r="9" fill="${P.steel}"/>`).join("")}
  ${xmark > 0 ? cross(380, -120, 60, P.red, xmark) : ""}`;
// a poison bottle with a coin label and a rat mark
const bottle = () => `${two("M-70 -260h140v40q60 40 60 120v200q0 20 -20 20h-220q-20 0 -20 -20v-200q0 -80 60 -120Z", "#3ddc97", P.greenD, 0, 12)}<path d="${rr(-50, -310, 100, 56, 10)}" fill="${P.ink}"/>
  <path d="${rr(-110, -70, 220, 170, 12)}" fill="${P.cream}"/>${at(-40, 10, coin(46, "B"))}<path d="M30 30q20 -40 50 -20q20 14 -6 30q-30 16 -44 -10ZM78 22q24 -2 30 10" fill="${P.ink}" stroke="${P.ink}" stroke-width="4"/><circle cx="72" cy="12" r="4" fill="${P.cream}"/>`;

// ---- 0: critics ----
function s0(a, tot) {
  const c = camAt(a, [[0, 520, 640, 1.45], [2.6, 520, 640, 1.55], [3.5, 1250, 560, 1.12], [6.6, 1300, 520, 1.12], [8.3, 1300, 520, 1.12], [10.2, 1420, 420, 1.35]]);
  const fx = factory(tot, seg(a, 2.8, 3.3) > 0 ? a - 2.8 : 0);
  // a staircase of houses: each hands the coin up and is paid a bigger tag
  const steps = [[900, 0], [1150, -130], [1400, -260], [1650, -390]], cols = [[P.teal, P.tealD], [P.blue, P.blueD], [P.violet, P.violetD], [P.pink, P.pinkD]];
  let stair = "";
  steps.forEach(([x, dy], i) => { const t0 = 3.8 + i * 0.6; stair += `<path d="${rr(x - 125, G + dy, 250, 700, 6)}" fill="#4a3a9a"/><path d="${rr(x - 125, G + dy, 250, 14, 4)}" fill="#6d5cc0"/>` + (a > 3.6 ? at(x, G + dy, house(cols[i][0], cols[i][1], { lit: [1, 1, 1] }), 0.78 * pop(a - 3.6 - i * 0.12)) : "");
    if (a > t0 + 0.45) stair += at(x - 10, G + dy - 300, text(0, 0, "$".repeat(i + 1), 74, P.green), pop(a - t0 - 0.45)); });
  const hop = clamp((a - 3.8) / 0.6), k = Math.min(3, Math.floor(hop * 0 + (a - 3.8) / 0.6)), f = ((a - 3.8) / 0.6) % 1;
  let cn = "";
  if (a > 3.8 && a < 6.6) { const i0 = Math.max(0, Math.min(3, k)), i1 = Math.min(3, i0 + 1), p = i0 === 3 ? 1 : ease(f), b = bez([steps[i0][0] + 60, G + steps[i0][1] - 190], [(steps[i0][0] + steps[i1][0]) / 2, G + Math.min(steps[i0][1], steps[i1][1]) - 380], [steps[i1][0] + 60, G + steps[i1][1] - 190], p);
    cn = at(b[0], b[1], rings(0, 0, 80, P.gold, 0.2) + coin(60, "B")); }
  else if (a >= 6.6 && a < 8.4) cn = at(steps[3][0] + 60, G + steps[3][1] - 190, coin(60, "B"));
  const qm = a > 6.0 && a < 8.4 ? at(steps[3][0] + 230, G + steps[3][1] - 330, text(0, 0, "?", 120, P.cream), pop(a - 6.0)) : "";
  const bt = a > 8.4 ? at(1420, G - 300, rings(0, -60, 220, P.green, 0.12) + bottle(), 0.95 * pop(a - 8.4, 8, 12), 6 * Math.sin(tot * 2)) : "";
  const g = night(c, tot, 31) + layer(skyline(41, -800, 3800, G - 30, 80, 220, "#1f1652", "#ffb066"), c, 0.45) + layer(ground(G) + divider(tot) + at(420, G, fx, 1.1) + stair + cn + qm + bt, c);
  return { g, out: toScreen(c, 1420, G - 340), outC: "#3ddc97", outZ: 16 };
}

// a vault with no keyhole on the outside
const vault = (shut) => `${two(rr(-200, -400, 400, 400, 20), P.steel, P.steelD, 0, 12)}${disc(0, -200, 140, "#cdd5ee", P.steelD)}${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 -200L${(Math.cos(i * 1.047 + shut) * 120).toFixed(1)} ${(-200 + Math.sin(i * 1.047 + shut) * 120).toFixed(1)}" stroke="${P.steelD}" stroke-width="16" stroke-linecap="round"/>`).join("")}${disc(0, -200, 34, P.steel, P.steelD)}`;
// an umbrella over (0, 0) with a shield on it; open 0..1; `rip` 0..1 tears a hole in the middle
const umbrella = (open = 1, rip = 0, glow = 0) => { const w = 260 * (0.2 + 0.8 * ease(open)), h = 150 * (0.4 + 0.6 * ease(open));
  return `${glow > 0 ? rings(0, -h, 260, P.gold, 0.22 * glow) : ""}<path d="M0 -${h + 40}V120" stroke="${P.ink}" stroke-width="12"/><path d="M0 120q0 40 -36 40" stroke="${P.ink}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M${-w} 0Q${-w} ${-h - 30} 0 ${-h - 30}Q${w} ${-h - 30} ${w} 0Q${w * 0.66} -40 ${w * 0.33} 0Q0 -40 ${-w * 0.33} 0Q${-w * 0.66} -40 ${-w} 0Z" fill="${P.blue}"/>
    ${at(0, -h * 0.55, `<path d="M0 -44L36 -30V0Q36 26 0 42Q-36 26 -36 0V-30Z" fill="${P.cream}"/><path d="M-14 0l10 10l18 -20" stroke="${P.blue}" stroke-width="8" fill="none" stroke-linecap="round"/>`, ease(open))}
    ${rip > 0 ? `<path d="M-40 ${-h * 0.4}l20 -30l20 24l22 -28l18 34l-20 30z" fill="url(#bnight)" transform="scale(${(0.3 + 1.2 * rip).toFixed(2)})"/>` : ""}`; };

// ---- 1: believers ----
function s1(a, tot) {
  const c = camAt(a, [[0, 1700, 560, 1.2], [0.7, 2280, 620, 1.45], [2.5, 2280, 620, 1.45], [3.0, 2620, 620, 1.4], [3.6, 3000, 600, 1.4], [5.27, 3020, 600, 1.45]]);
  const jam = a > 1.6 ? 4 * Math.sin(a * 50) * Math.exp(-(a - 1.6) * 2) : 0;
  const chain = Array.from({ length: 11 }, (_, i) => `<ellipse cx="${-210 + i * 42}" cy="${-250 + 14 * Math.sin(i)}" rx="26" ry="14" fill="none" stroke="${P.steelD}" stroke-width="9" transform="rotate(${i % 2 ? 20 : -20} ${-210 + i * 42} ${-250 + 14 * Math.sin(i)})"/>`).join("");
  const pr = at(2250 + jam, G, press(a > 1.2 && a < 1.6 ? 0.4 : 0.1, { lamp: 0 }) + (a > 1.2 ? chain + at(0, -250, padlock(1.2, 0), pop(a - 1.3)) : ""), 0.95);
  const vt = at(2700, G, vault(a > 3.0 ? -0.6 * ease(seg(a, 3.0, 3.3)) : 0), 0.8 * pop(a - 2.6));
  const keyX = a > 3.0 ? at(2700 - 260, G - 200, `<path d="M-60 0h80" stroke="${P.steel}" stroke-width="16" stroke-linecap="round"/><circle cx="-80" r="26" fill="none" stroke="${P.steel}" stroke-width="12"/>`, 0.9) + cross(2700 - 260, G - 280, 40, P.red, a - 3.2) : "";
  const um = at(3080, G - 330, umbrella(seg(a, 3.8, 4.4), 0, seg(a, 4.2, 4.6)), 1.1 * pop(a - 3.7)) + at(3080, G - 150, coin(80, "B"), pop(a - 3.7));
  const g = night(c, tot, 31) + layer(skyline(41, -800, 4200, G - 30, 80, 220, "#1f1652", "#ffb066"), c, 0.45) + layer(ground(G) + divider(tot) + pr + vt + keyX + um, c);
  return { g, in: [960, 540], inC: "#3ddc97", inZ: 16, out: toScreen(c, 3080, G - 380), outC: P.blue, outZ: 16 };
}

// ---- 2: the 2022 test ----
function s2(a, tot) {
  const c = camAt(a, [[0, 560, 470, 1.5], [3.4, 600, 470, 1.5], [4.2, 940, 560, 1.35], [8.87, 960, 580, 1.38]]);
  const cal = at(250, 300, calPage("2022", "", 1, 130), 0.75 * pop(a - 1.0), -4);
  // two tags that climb and catch fire
  const tagItem = (x, label, i) => { const up = seg(a, 2.2 + i * 0.25, 3.3 + i * 0.25), y = 700 - 260 * ease(up), fire = up > 0.6 ? 1 : 0;
    const flame = fire ? [0, 1, 2].map((j) => { const ph = tot * 7 + j * 2 + i; return `<path d="M${-30 + j * 30} 0q${-10 + 6 * Math.sin(ph)} -40 0 ${-70 - 10 * Math.sin(ph * 1.3)}q${16 + 4 * Math.sin(ph)} 30 0 70Z" fill="${j % 2 ? P.gold : P.red}"/>`; }).join("") : "";
    return at(x, y, `${at(0, -70, flame)}${two("M-90 -50h150l40 50l-40 50h-150Z", P.cream, P.creamD, 0, 6)}<circle cx="68" cy="0" r="10" fill="${P.ink}"/>${label}${text(-50, 18, "$", 46, P.red)}${Array.from({ length: 1 + Math.floor(up * 2.9) }, (_, j) => `<path d="M${-14 + j * 26} 16V-14m-11 12l11 -14l11 14" stroke="${P.red}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("")}`, pop(a - 1.9 - i * 0.2)); };
  const bread = `<path d="M-80 -30Q-90 -90 -30 -90Q30 -110 70 -70Q90 -40 80 -20Z" fill="#e8a23c" transform="translate(-150 20) scale(.5)"/>`;
  const fuel = `<path d="${rr(-170, -30, 34, 46, 6)}" fill="${P.red}"/><path d="M-136 -20h10v20" stroke="${P.red}" stroke-width="6" fill="none"/>`;
  // the umbrella over the coin; it glows on "the day it should work"; then the coin drops through a tear
  const glow = seg(a, 4.3, 4.8) * (1 - seg(a, 5.8, 6.2)), rip = seg(a, 6.0, 6.4), fall = easeIn(seg(a, 6.4, 7.6));
  const cx = 1100, um = at(cx, 380, umbrella(1, rip, glow), 1.0);
  const cn = at(cx, lerp(520, 900, fall), rings(0, 0, 70, P.gold, 0.18 * (1 - fall)) + coin(62, "B"), 1, 240 * fall);
  const pct = a > 7.6 ? at(cx - 330, 780, `<path d="${rr(-150, -60, 300, 110, 22)}" fill="${P.ink}"/>${text(-20, 26, "> 60%", 64, P.red) + `<path d="M110 -24V30m-20 -20l20 22l20 -22" stroke="${P.red}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`}`, pop(a - 7.6)) : "";
  const g = night(c, tot, 37) + layer(skyline(43, -800, 2800, G - 30, 80, 220, "#1f1652", "#ffb066"), c, 0.45) + layer(ground(G) + cal + tagItem(420, bread, 0) + tagItem(720, fuel, 1) + um + cn + pct, c);
  return { g, in: [960, 540], inC: P.blue, inZ: 16 };
}

// a round profile frame with a coin face and two laser eyes
const frameFace = (laser, seed) => { const col = [P.pink, P.teal, P.violet][seed % 3];
  return `<circle r="110" fill="${col}"/><circle r="94" fill="${mix(col, P.ink, 0.35)}"/>${coin(70, "")}${[-26, 26].map((x) => `<circle cx="${x}" cy="-10" r="12" fill="${laser > 0 ? "#ff3048" : P.ink}"/>`).join("")}
    ${laser > 0 ? [-26, 26].map((x) => `<path d="M${x} -10L${x * 8 + (seed % 2 ? 600 : -600)} ${-300 - seed * 40}" stroke="#ff3048" stroke-width="${(10 * laser).toFixed(1)}" opacity=".8" stroke-linecap="round"/>`).join("") : ""}`; };

// ---- 3: the rituals (host left: the lower left corner stays clear) ----
function s3(a, tot) {
  const c = camAt(a, [[0, 1040, 330, 1.45], [3.3, 1040, 330, 1.5], [4.1, 1260, 640, 1.4], [6.8, 1300, 650, 1.45], [9.04, 1330, 660, 1.55]]);
  let frames = "";
  [[820, 300], [1150, 230], [1480, 300]].forEach(([x, y], i) => { const t0 = 1.5 + i * 0.35; frames += at(x, y, frameFace(seg(a, t0 + 0.5, t0 + 0.8) * (1 - seg(a, 3.5, 3.8)), i), 0.85 * pop(a - 1.2 - i * 0.12) * (1 - 0.4 * seg(a, 3.6, 4.0))); });
  // the price line drops; then a LONG TERM sign is hammered in; its posts close like bars round the little house
  const drop = seg(a, 3.7, 4.7), line = `<path d="M600 640L900 560L1150 500L${lerp(1150, 1500, drop)} ${lerp(500, 820, ease(drop))}" fill="none" stroke="${drop > 0.3 ? P.red : P.gold}" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>`;
  const hammer = seg(a, 5.4, 6.3), sY = lerp(-300, 0, easeOut(hammer)) + (hammer > 0.95 ? 0 : 0), bump = a > 6.3 ? 8 * Math.exp(-(a - 6.3) * 8) * Math.sin(a * 40) : 0;
  const bars = seg(a, 7.0, 7.8);
  const hs = at(1340, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.6 * pop(a - 4.6));
  const sign = a > 5.3 ? at(1340, G - 330 + sY + bump, `<path d="${rr(-190, -70, 380, 120, 14)}" fill="${P.wood}"/>${text(0, 18, "LONG TERM", 58, P.cream)}<path d="M-120 50V340M120 50V340" stroke="${P.woodD}" stroke-width="22"/>`) : "";
  const cage = bars > 0 ? [-160, -100, -40, 20, 80, 140].map((x, i) => `<path d="M${1340 + x} ${G - 270}V${G - 270 + 270 * ease(seg(bars, i * 0.08, 0.6 + i * 0.08))}" stroke="${P.steel}" stroke-width="16" stroke-linecap="round"/>`).join("") + `<path d="M${1340 - 180} ${G - 270}h360" stroke="${P.steel}" stroke-width="16" stroke-linecap="round" opacity="${ease(bars).toFixed(2)}"/>` : "";
  const g = night(c, tot, 39) + layer(skyline(47, -800, 2800, G - 30, 80, 220, "#1f1652", "#ffb066"), c, 0.45) + layer(ground(G) + frames + (a > 3.6 ? line : "") + hs + cage + sign, c);
  return { g };
}

const SHOTS = [s0, s1, s2, s3];
export const c4debateSet = makeSet(SHOTS, V, P);
