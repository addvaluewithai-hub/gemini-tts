// "Intro" of electricity part 2 of 4 (made and delivered): three shots, nothing to read but a "?", "< 1 s" and the
// signs + and −.
//   0 the night land: a far power station on the horizon, a line of poles runs from it to the teal house («بتتعمل فين»,
//     «وبتوصل البيت»); the camera dives into the wire at the house and we are inside the copper from part 1, electrons
//     drifting («شحنات ماشية في سلك»); a "?" springs up on «بيمشّيها» and another on «ومنين»
//   1 the teal house's bulb lights («منوّرة لمبتهم»); a stopwatch under it sweeps and stops at "< 1 s" («أقل من ثانية»);
//     beside the station an empty warehouse, its doors open on nothing, a padlock and ✗ («مفيش مخزن»); a gold pulse
//     runs from the station into the bulb and is gone as it lights («بيتستهلك في لحظتها»)
//   2 the town from above at night: windows switch on and off at random («كل واحد بيدوس زرار»); at the station a big gauge
//     needle chases every change («يطلّع له اللي طلبه»); on «بالظبط» the needle locks on its mark with a check; on
//     «لا أكتر ولا أقل» a + and a − light either side of it. Host right: the lower right is kept clear.
// Hand-overs: through the copper (0 → 1, out of the wire into the bulb's glow) and the gold of the bulb (1 → 2).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, through, rr, two, disc, rings, text, drawn, at, check, cross, makeSet, FW, FH, portrait } from "./kit.js";
import { P, E, mix, stars, skyline, house, pop, tube, pole, span, station, bulb, gauge } from "./elec.js";
import { hills } from "./props.js";
import { V } from "./e2intro.v.js";

const qmark = (a, s = 1) => (a <= 0 ? "" : at(0, 0, `${rings(0, -60, 150, P.gold, 0.2, 1.4)}${text(0, 40, "?", 300, P.gold)}`, pop(a, 8, 14) * s));
const sky = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(31, 90, -900, 2900, 700, tot), c, 0.15);
const G = 860;
// the land: a far station (left), poles to the teal house (right); v lays it out for the tall frame
const land = (tot, v, o = {}) => {
  const SX = v ? 760 : 380, SY = G, HX = v ? 1180 : 1520;
  const xs = v ? [880, 980, 1080] : [640, 900, 1160, 1360];
  const poles = xs.map((x, i) => at(x, G, pole(v ? 420 : 460), v ? 0.8 : 0.85 + i * 0.05)).join("");
  const tipY = (i) => G - (v ? 420 : 460) * (v ? 0.8 : 0.85 + i * 0.05) + 26;
  let line = `M${SX + 120} ${SY - 200}`; xs.forEach((x, i) => { line += `Q${x - 60} ${tipY(i) + 40} ${x} ${tipY(i)}`; }); line += `Q${HX - 120} ${tipY(xs.length - 1) + 50} ${HX - 60} ${G - 200}`;
  const glow = o.pulse != null ? (() => { const p = clamp(o.pulse); return p > 0 && p < 1 ? rings(lerp(SX + 120, HX - 60, p), lerp(SY - 200, G - 200, p) - 40 * Math.sin(p * Math.PI), 34, P.gold, 0.6, 1.6) : ""; })() : "";
  return hills(7, -900, 2900, G - 40, 110, "#0d3a4e") + `<rect x="-900" y="${G}" width="3800" height="900" fill="${P.ground}"/>`
    + at(SX, SY, station(tot, { lit: 1 }), v ? 0.5 : 0.6) + poles + `<path d="${line}" fill="none" stroke="${E.cu}" stroke-width="7"/>` + glow
    + at(HX, G, house(E.houseA, E.houseAD, { roof: E.roof, lit: [o.lit ?? 1, o.lit ?? 1, o.lit ?? 1] }), v ? 0.9 : 1.1);
};

// ---- 0: from the station to the house, then into the wire ----
function s0(a, tot) {
  const v = portrait(), T = 4.55;
  if (a < T) {
    const HX = v ? 1180 : 1520, c = v ? camAt(a, [[0, 960, 740, 1.9], [2.0, 860, 750, 2.1], [3.3, 1100, 760, 2.2], [T, HX - 60, G - 210, 3.4]]) : camAt(a, [[0, 960, 560, 1.0], [2.0, 760, 600, 1.15], [3.3, 1300, 640, 1.2], [T, HX - 60, G - 210, 2.6]]);
    const q1 = a > 1.9 && a < 3.4 ? at(v ? 760 : 380, G - 520, qmark(a - 2.0, 0.6) , 1, 0, `opacity="${(1 - seg(a, 3.0, 3.4)).toFixed(2)}"`) : "";
    const q2 = a > 3.0 ? at(HX, G - 520, qmark(a - 3.1, 0.6), 1, 0, `opacity="${(1 - seg(a, 4.0, 4.4)).toFixed(2)}"`) : "";
    const g = sky(c, tot) + layer(skyline(5, -900, 2900, G - 110, 60, 150, E.far, false), c, 0.4) + layer(land(tot, v, { pulse: (tot * 0.5) % 1 }) + q1 + q2, c);
    return { g: through(g, toScreen(c, HX - 60, G - 210)[0], toScreen(c, HX - 60, G - 210)[1], easeIn(seg(a, T - 0.45, T)), E.cuD, 18) };
  }
  // inside the wire
  const u = a - T, c = camAt(u, [[0, 960, 540, 1.25], [4.8, 960, 540, 1.05]]);
  const drift = 30 * u;
  const g = `<rect width="${FW}" height="${FH}" fill="${E.cuD}"/>` + layer(`<rect x="-900" y="-900" width="3800" height="2900" fill="${E.cuD}"/>` + tube(-900, 2800, 540, v ? 1000 : 600, tot, drift, { n: 46, r: 36 })
    + at(v ? 960 : 760, v ? 300 : 320, qmark(a - 7.75, 0.9)) + at(v ? 960 : 1240, v ? 820 : 320, qmark(a - 8.6, 0.6)), c);
  return { g: through(g, 960, 540, 1 - easeOut(seg(u, 0, 0.5)), E.cuD, 18), out: [960, 540], outC: E.cuD, outZ: 18 };
}

// ---- 1: lit less than a second ago, nothing stored ----
const watch = (p) => { const ang = -Math.PI / 2 + p * Math.PI * 2 * 0.8; return `${disc(0, 0, 110, P.cream, P.creamD, 0.08)}<circle r="88" fill="#fffaec"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<path d="M${76 * Math.cos(i * Math.PI / 6)} ${76 * Math.sin(i * Math.PI / 6)}L${86 * Math.cos(i * Math.PI / 6)} ${86 * Math.sin(i * Math.PI / 6)}" stroke="${P.ink}" stroke-width="5"/>`).join("")}<path d="M0 0L${74 * Math.cos(ang)} ${74 * Math.sin(ang)}" stroke="${P.red}" stroke-width="8" stroke-linecap="round"/><circle r="10" fill="${P.ink}"/><path d="${rr(-22, -140, 44, 26, 8)}" fill="${P.steel}"/>`; };
const store = (open) => `${two(rr(-200, -260, 400, 260, 10), "#2b5a74", "#1c4157", 12, 0)}${two("M-230 -256L0 -360L230 -256Z", E.roof, P.ink, 0, 8)}<path d="${rr(-130, -200, 260, 200, 6)}" fill="#04121c"/>
  <path d="${rr(-130, -200, 130 * (1 - open) + 4, 200, 4)}" fill="#3f7590"/><path d="${rr(130 - 130 * (1 - open) - 4, -200, 130 * (1 - open) + 4, 200, 4)}" fill="#3f7590"/>`;
function s1(a, tot) {
  const v = portrait();
  const c = v ? camAt(a, [[0, 960, 640, 1.0], [8.1, 960, 660, 0.98]]) : camAt(a, [[0, 1100, 520, 1.15], [3.0, 1000, 520, 1.05], [8.15, 960, 520, 0.98]]);
  const BX = v ? 960 : 1300, BY = v ? 560 : 560, lit = ease(seg(a, 1.84, 2.2));
  const pulseP = seg(a, 6.2, 6.9), flash = a > 6.85 ? Math.exp(-(a - 6.85) * 3) : 0;
  const b = at(BX, BY, `<path d="M0 -620V-300" stroke="${P.ink}" stroke-width="8"/>` + at(0, -300, bulb(clamp(lit + flash * 0.3)), [1, -1]), v ? 1.05 : 1.1);
  const w = a > 3.1 ? at(BX, v ? 960 : 800, watch(ease(seg(a, 3.3, 4.7))) + (a > 4.7 ? at(0, 170, `${two(rr(-110, -40, 220, 80, 40), P.ink, "#0d0826", 0, 6)}${text(0, 24, "< 1 s", 60, P.gold)}`, pop(a - 4.72)) : ""), (v ? 0.95 : 0.9) * pop(a - 3.1)) : "";
  const SX = v ? 960 : 430, SY = v ? 1560 : 820, WX = v ? 960 : 520;
  const st = at(v ? 760 : 330, SY, station(tot, { lit: 1 }), v ? 0.6 : 0.8);
  const wh = a > 5.0 ? at(v ? 1200 : 820, SY, store(ease(seg(a, 5.2, 5.6))) + (a > 5.4 ? cross(0, -110, 52, P.red, a - 5.45) : ""), (v ? 0.8 : 1.0) * pop(a - 5.0)) : "";
  const path = v ? `M${760} ${SY - 200}Q${700} ${BY + 400} ${BX} ${BY - 60}` : `M${330 + 80} ${SY - 210}Q${900} ${SY - 520} ${BX - 40} ${BY - 300}`;
  const wire = `<path d="${path}" fill="none" stroke="${E.cuD}" stroke-width="10"/>` + (pulseP > 0 && pulseP < 1 ? drawn(path, pulseP, P.gold, 16) : "");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(9, 90, -600, 2600, 800, tot), c, 0.15)
    + layer(`<rect x="-900" y="${SY}" width="3800" height="900" fill="${P.ground}"/>` + wire + st + wh + b + w, c);
  return { g, in: toScreen(c, BX, BY - 175), inC: "#ffd98a", out: toScreen(c, BX, BY - 175), outC: "#ffd98a", outZ: 16 };
}

// ---- 2: billions of switches, one needle ----
function s2(a, tot) {
  const v = portrait();
  const c = v ? camAt(a, [[0, 960, 700, 1.0], [7.47, 960, 720, 1.02]]) : camAt(a, [[0, 900, 540, 1.0], [7.47, 880, 540, 1.04]]);
  // the town from above: a grid of windows, each switching on its own rhythm
  const cols = v ? 9 : 14, rows = v ? 9 : 6, X0 = v ? 560 : 120, Y0 = v ? 120 : 120, dx = v ? 92 : 80, dy = v ? 84 : 86;
  let wins = ""; const chaos = seg(a, 1.3, 1.9);
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) { const i = r * cols + k, ph = rnd(i * 3 + 1) * 6, sp = 0.5 + rnd(i * 3 + 2) * 1.6, on = chaos > 0 ? (Math.sin(tot * sp + ph) > 0 ? 1 : 0) : (rnd(i) > 0.4 ? 1 : 0);
    wins += `<path d="${rr(X0 + k * dx, Y0 + r * dy, dx * 0.62, dy * 0.6, 6)}" fill="${on ? P.win : "#0a2638"}"/>`; }
  const block = `<path d="${rr(X0 - 30, Y0 - 30, cols * dx + 20, rows * dy + 20, 24)}" fill="#0c2f42"/>` + wins;
  // demand: the share of lit windows; the needle follows it, then locks on «بالظبط»
  let litN = 0; for (let i = 0; i < cols * rows; i++) { const ph = rnd(i * 3 + 1) * 6, sp = 0.5 + rnd(i * 3 + 2) * 1.6; litN += Math.sin(tot * sp + ph) > 0 ? 1 : 0; }
  const demand = chaos > 0 ? litN / (cols * rows) : 0.6, lock = ease(seg(a, 5.5, 5.9));
  const follow = a > 3.3 ? lerp(demand, 0.5, lock) : 0.5;
  const GX = v ? 960 : 1360, GY = v ? 1300 : 760;
  const gz = a > 2.8 ? at(GX, GY, `${gauge(follow, {})}${lock > 0 ? rings(0, 0, 120, P.green, 0.25 * lock) : ""}`, (v ? 1.9 : 1.6) * pop(a - 2.8)) : "";
  const ok = a > 5.6 ? check(GX + (v ? 200 : 170), GY - (v ? 170 : 140), 40, P.green, a - 5.62) : "";
  const pm = a > 6.2 ? at(GX - (v ? 260 : 230), GY, `${disc(0, 0, 44, P.red, P.redD)}<rect x="-22" y="-6" width="44" height="12" rx="6" fill="#fff"/>`, pop(a - 6.23) * 0.9) + at(GX + (v ? 260 : 230), GY, `${disc(0, 0, 44, P.red, P.redD)}<rect x="-22" y="-6" width="44" height="12" rx="6" fill="#fff"/><rect x="-6" y="-22" width="12" height="44" rx="6" fill="#fff"/>`, pop(a - 6.79) * 0.9) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(13, 80, -600, 2600, 900, tot), c, 0.15) + layer(block + gz + ok + pm, c);
  return { g, in: toScreen(c, X0 + cols * dx / 2, Y0 + rows * dy / 2), inC: "#ffd98a" };
}

export const SHOTS = [s0, s1, s2];
export const e2introSet = makeSet(SHOTS, V, P);
