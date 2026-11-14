// "Two words from the humans' dictionary" (electricity part 1): two shots.
//   0 a dictionary lands and opens; AC rises out of it with a wave under it, DC with a straight line; the book sinks and two
//     stacks of amplifiers rise on a stage, the letters drop onto them, and on «عالي جداً» the speakers boom (plain letters,
//     no band's logo)
//   1 an electricity meter: 1,000 W, a clock hand goes round once, the counter rolls to 1 kWh; a bill slides out with a
//     calendar page: what they pay for at the end of every month (host right)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, makeSet, FW, FH } from "./kit.js";
import { P, E, mix, stars, tagV } from "./elec.js";
import { book } from "./bank.js";
import { calPage } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const sky = () => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>`;
const word = (w, size, fill, t, t0, step = 0.07) => { const n = w.length, cw = size * 0.56; return [...w].map((ch, i) => { const u = t - t0 - i * step; return u > 0 ? at((i - (n - 1) / 2) * cw, 0, text(0, size * 0.36, ch, size, fill), [1, pop(u)]) : ""; }).join(""); };
// an amplifier cabinet (centre), 340 x 220; boom 0..1 pushes the speaker cones out
const amp = (boom = 0) => `${two(rr(-170, -110, 340, 220, 14), "#1b2638", "#101a2a", 8, 6)}<path d="${rr(-150, -92, 300, 184, 8)}" fill="#0c1422"/>
  ${[-72, 72].map((x) => `<circle cx="${x}" cy="0" r="${66 * (1 + 0.1 * boom)}" fill="#26344c"/><circle cx="${x}" cy="0" r="${52 * (1 + 0.16 * boom)}" fill="#3a4c6a"/><circle cx="${x}" cy="0" r="${18 * (1 + 0.3 * boom)}" fill="#5a6e90"/>`).join("")}
  <path d="${rr(-150, -108, 300, 14, 6)}" fill="${P.gold}" opacity=".8"/>`;
const stack = (boom) => at(0, -110, amp(boom)) + at(0, -330, amp(boom));

function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.08], [1.6, 960, 520, 1.0], [4.4, 960, 520, 1.0], [5.2, 960, 560, 0.94], [7.41, 960, 560, 0.97]]);
  const land = a < 0.1 ? -1400 : lerp(-500, 0, easeIn(seg(a, 0.1, 0.4))), thud = a > 0.4 ? 1 - 0.08 * Math.exp(-(a - 0.4) * 9) * Math.cos((a - 0.4) * 16) : 1, open = ease(seg(a, 0.6, 1.0));
  const sink = easeIn(seg(a, 4.5, 5.0)), BKY = 640 + land + 700 * sink;
  const theBook = open < 0.5 ? at(960, BKY, `<g transform="scale(${(1 - 2 * open).toFixed(3)} 1)">${two(rr(-260, -170, 520, 340, 24), "#2f8fb0", "#1f6d8c", 0, 14)}<path d="${rr(-200, -110, 400, 220, 16)}" fill="none" stroke="${P.gold}" stroke-width="10"/>${disc(0, 0, 50, P.gold, P.goldD)}${text(0, 22, "A", 64, "#8a5200")}</g>`, [2.2 * thud, 2.2 / thud])
    : at(960, BKY, `<g transform="scale(1 ${(0.6 + 0.4 * (open * 2 - 1)).toFixed(3)})">${book(`<path d="M-120 -40h90M-120 -10h90M-120 20h70M30 -40h90M30 -10h90M30 20h70" stroke="#dccaa0" stroke-width="9" stroke-linecap="round"/>`, { cover: "#2f8fb0", coverD: "#1f6d8c" })}</g>`, [2.2 * thud, 2.2 / thud]);
  // the two words: they rise out of the book, then fly onto the amplifiers
  const fly = ease(seg(a, 4.6, 5.3)), boom = a > 5.8 ? Math.max(0, Math.sin((a - 5.8) * 14)) * Math.min(1, (a - 5.8) * 3) : 0, shake = boom * 8;
  const AX = 470, DX = 1450;
  const wA = [lerp(680, AX, fly), lerp(220, 175, fly)], wD = [lerp(1240, DX, fly), wA[1]];
  const wave = drawn("M-150 110q37 -50 75 0t75 0t75 0t75 0", seg(a, 1.9, 2.3), P.gold, 16, `transform="translate(${-((a > 2.9 ? (a - 2.9) * 150 : 0) % 150) * 0} 0)"`);
  const ac = a > 1.7 ? at(wA[0] + shake * Math.sin(a * 50), wA[1], rings(0, -10, 170, P.gold, 0.12) + word("AC", 190, P.gold, a, 1.7) + `<g transform="translate(0 ${(a > 2.9 && a < 4.4 ? 10 * Math.sin((a - 2.9) * 9) : 0).toFixed(1)})">${wave}</g>`) : "";
  const dc = a > 2.45 ? at(wD[0] - shake * Math.sin(a * 47), wD[1], rings(0, -10, 170, "#5fd6ff", 0.12) + word("DC", 190, "#5fd6ff", a, 2.45) + drawn("M-150 110H150", seg(a, 2.6, 2.9), "#5fd6ff", a > 3.7 && a < 4.4 ? 26 : 16, 'stroke-linecap="round"')) : "";
  // the stage: the amplifiers rise, the lights come on, the sound
  const rise = ease(seg(a, 4.6, 5.3)), SY = 1000 + 520 * (1 - rise);
  const beams = rise > 0 ? [[300, "#5fd6ff"], [960, P.gold], [1620, "#ff8a3c"]].map(([x, col], i) => `<path d="M${x} -40L${x - 220 + 60 * Math.sin(tot + i)} 1000H${x + 220 + 60 * Math.sin(tot + i)}Z" fill="${col}" opacity="${(0.08 * rise).toFixed(3)}"/>`).join("") : "";
  const rings2 = boom > 0 ? [AX, DX].map((x) => [0, 1, 2].map((k) => { const q = ((a - 5.8) * 1.6 + k / 3) % 1; return `<circle cx="${x}" cy="${SY - 320}" r="${(160 + q * 520).toFixed(0)}" fill="none" stroke="${P.gold}" stroke-width="${(14 * (1 - q)).toFixed(1)}" opacity="${(0.5 * (1 - q)).toFixed(2)}"/>`; }).join("")).join("") : "";
  const stage = rise > 0 ? `<rect x="-400" y="${1000}" width="2800" height="400" fill="#06121f"/><rect x="-400" y="1000" width="2800" height="14" fill="${P.goldD}" opacity="${rise.toFixed(2)}"/>` + rings2 + at(AX, SY, stack(boom), 1.45) + at(DX, SY, stack(boom), 1.45) : "";
  const g = sky() + layer(stars(61, 90, -300, 2300, 900, tot), c, 0.2) + layer(beams + stage + theBook + ac + dc, c);
  return { g, out: toScreen(c, AX, SY - 480), outC: "#0c1422", outZ: 16 };
}

// ---- 1: the kilowatt-hour ----
const MX = 900, MY = 560;
const meterBox = (spin, v, glow) => `${two(rr(-230, -300, 460, 600, 40), "#ece8ff", "#c6c0e6", 14, 0)}<circle cx="0" cy="-60" r="190" fill="#1d3a52"/><circle cx="0" cy="-60" r="170" fill="#0b2436"/>
  ${glow > 0 ? rings(0, -60, 170, P.gold, 0.18 * glow) : ""}<path d="${rr(-150, -140, 300, 70, 12)}" fill="#071827"/>${number(0, -88, v, 64, P.gold)}
  <g transform="translate(0 30)"><ellipse rx="140" ry="22" fill="#aab4d4"/><rect x="${(-130 + ((spin * 160) % 260)).toFixed(1)}" y="-10" width="24" height="20" fill="${P.red}" transform="scale(${Math.max(0.1, Math.abs(Math.cos(spin * 3))).toFixed(2)} 1)"/></g>
  ${text(0, 210, "kWh", 70, "#3a4c6a")}`;
const clock = (p) => { const a = p * Math.PI * 2; return `${disc(0, 0, 120, P.cream, P.creamD, 0.08)}${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const q = i / 12 * Math.PI * 2; return `<circle cx="${(96 * Math.sin(q)).toFixed(1)}" cy="${(-96 * Math.cos(q)).toFixed(1)}" r="7" fill="${P.ink}"/>`; }).join("")}
  ${p > 0 ? `<path d="M0 0L0 -100A100 100 0 ${p > 0.5 ? 1 : 0} 1 ${(100 * Math.sin(a)).toFixed(1)} ${(-100 * Math.cos(a)).toFixed(1)}Z" fill="${P.gold}" opacity=".45"/>` : ""}<path d="M0 0L${(86 * Math.sin(a)).toFixed(1)} ${(-86 * Math.cos(a)).toFixed(1)}" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/><circle r="12" fill="${P.ink}"/>`; };
const bill = () => `${two(rr(-160, -210, 320, 420, 14), P.cream, P.creamD, 0, 8)}<path d="${rr(-160, -210, 320, 60, 14)}" fill="#2f8fb0"/>${text(0, -50, "kWh", 72, P.ink)}<path d="M-110 20h220M-110 60h170M-110 100h200" stroke="#b9a986" stroke-width="12" stroke-linecap="round"/>`;
function s1(a, tot) {
  const c = camAt(a, [[0, 900, 520, 1.12], [2.4, 860, 520, 1.04], [4.92, 880, 500, 1.0]]);
  const hour = ease(seg(a, 1.4, 2.25)), v = (lerp(0, 1, hour)).toFixed(1), spin = a * (a > 1.4 && a < 2.4 ? 9 : 2), glow = a > 2.2 ? Math.exp(-(a - 2.2) * 2) : 0;
  const m = at(MX, MY, meterBox(spin, v, glow), 1.3 * pop(a, 7, 12));
  const w = at(320, 290, tagV("1,000", "W", { size: 100 }), pop(a - 0.7));
  const cl = at(300, 640, clock(hour), 1.6 * pop(a - 1.35));
  const bs = easeOut(seg(a, 3.15, 3.6)), bl = bs > 0 ? at(lerp(MX, 1330, bs), lerp(MY, 300, bs), bill(), lerp(0.3, 1, bs), lerp(-20, 6, bs)) : "";
  const cal = at(1620, 170, calPage("30", "", 0.6, 150), pop(a - 4.1));
  const g = sky() + layer(stars(67, 80, -300, 2300, 900, tot), c, 0.2) + layer(cl + w + bl + m + cal, c);
  return { g, in: toScreen(c, MX, MY - 60), inC: "#0b2436", inZ: 14 };
}

const SHOTS = [s0, s1];
export const edictSet = makeSet(SHOTS, [], P);
