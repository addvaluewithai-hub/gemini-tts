// "Generations" (network part 1): the brick phone, then the five generations as a staircase. Thirteen shots, nothing to
// read but years, amounts, 1G…5G, a few English text-speak words and the first text message.
//   0 the brick phone on a kitchen scale: the needle swings past 1 kg
//   1 a charger plugs in, a clock races round ten hours, the battery on the phone fills
//   2 a call: a stopwatch sweeps half an hour and the battery runs dry
//   3 a 1983 calendar page; a price tag on the aerial rolls up to $4,000
//   4 1979, a night city: step 1G rises with the brick on it, a voice wave runs to it and an old radio in a window
//     catches the same wave (anyone with a radio could listen)
//   5 step 2G (1991) rises: the wave above it turns into digits; an envelope pops out; DEC 1992; it opens: Merry Christmas
//   6 the message as 160 slots that fill; it squeezes into a gap between the network's own signals; text-speak (LOL,
//     BRB, GR8, C U) bubbles out of it; the gap glows
//   7 step 3G rises and a little globe drops into its phone (the internet comes into the phone)
//   8 step 4G: a letter, a picture, a song and then the voice itself all turn into the same gold packets
//   9 step 5G (2019): packets stream much faster, and a car and a robot arm talk to each other
//   10 pull back over the five steps: a fanfare over each; then each shows the same video, sharper on every step
//   11 a globe that a teal cover spreads over: 55%
//   12 two glass bars beside a rich house and a poor hut: 84% and 4%
// Shots 0–3 are one table, 4–5 and 7–10 one staircase seen by one camera (no hand-over shape inside them).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, digitX, drawn, at, check, cross, makeSet, FW, FH } from "./kit.js";
import { P, mix, fmt, house, stars, skyline, coin } from "./bank.js";
import { calPage, globe, car } from "./props.js";
import { tower, radio, brick, stopwatch, waveLine, phone, bluePhone, pop, WAVE, WAVED, PULSE } from "./net.js";

const E = (s) => s.ends || [1.64, 1.25, 1.6, 3.7, 6.6, 8.22, 8.2, 1.86, 2.91, 5.22, 6.38, 3.02, 4.77];
const start = (s, k) => E(s).slice(0, k).reduce((x, y) => x + y, 0);

// ---- 0–3: the brick phone on the kitchen table ----
const TG = 820, BX = 760;
const battery = (lvl, col) => `<path d="${rr(-34, -18, 68, 36, 6)}" fill="#3a3a4a"/><path d="${rr(34, -8, 8, 16, 3)}" fill="#3a3a4a"/><path d="${rr(-30, -14, Math.max(0, 60 * clamp(lvl)), 28, 4)}" fill="${col}"/>`;
const wallClock = (turns, r = 120) => { const an = 2 * Math.PI * turns - Math.PI / 2, ah = 2 * Math.PI * turns / 12 - Math.PI / 2;
  return `${disc(0, 0, r, P.cream, P.creamD, 0.1)}<circle r="${r * 0.86}" fill="#fffaf0"/>${Array.from({ length: 12 }, (_, i) => { const q = i * Math.PI / 6; return `<path d="M${(Math.cos(q) * r * 0.72).toFixed(1)} ${(Math.sin(q) * r * 0.72).toFixed(1)}L${(Math.cos(q) * r * 0.8).toFixed(1)} ${(Math.sin(q) * r * 0.8).toFixed(1)}" stroke="${P.ink}" stroke-width="6"/>`; }).join("")}
    <path d="M0 0L${(Math.cos(ah) * r * 0.45).toFixed(1)} ${(Math.sin(ah) * r * 0.45).toFixed(1)}" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/><path d="M0 0L${(Math.cos(an) * r * 0.7).toFixed(1)} ${(Math.sin(an) * r * 0.7).toFixed(1)}" stroke="${P.red}" stroke-width="7" stroke-linecap="round"/><circle r="9" fill="${P.ink}"/>`; };
function table(t, c, tot, s) {
  const T1 = start(s, 1), T2 = start(s, 2), T3 = start(s, 3), u1 = t - T1, u2 = t - T2, u3 = t - T3;
  // the scale: the needle swings past 1 kg on "kilo"
  const weigh = t < 0.35 ? 0 : kf(t, [[0.35, 0], [0.75, 1.25], [0.95, 1.05], [1.13, 1.14], [1.4, 1.1]]), scaleOff = ease(seg(u1, -0.1, 0.3));
  const needle = -Math.PI / 2 - 1.2 + weigh * 1.6, sc = `${two(rr(-200, -70, 400, 70, 18), "#e8ecff", "#b8bfdc", 0, 8)}<path d="${rr(-230, -86, 460, 20, 8)}" fill="#c4cbe6"/>`;
  const dial = at(BX + 420, TG - 300, `${disc(0, 0, 130, P.cream, P.creamD, 0.1)}<circle r="112" fill="#fffaf0"/>${drawn("M-80 -40A90 90 0 0 1 80 -40", 1, "#d8cfb8", 10)}<path d="M${Math.cos(-Math.PI / 2 + 0.4) * 96} ${Math.sin(-Math.PI / 2 + 0.4) * 96}L${Math.cos(-Math.PI / 2 + 0.4) * 76} ${Math.sin(-Math.PI / 2 + 0.4) * 76}" stroke="${P.red}" stroke-width="10"/>${text(56, -24, "1 kg", 34, P.red)}<path d="M0 0L${(Math.cos(needle) * 92).toFixed(1)} ${(Math.sin(needle) * 92).toFixed(1)}" stroke="${P.ink}" stroke-width="9" stroke-linecap="round"/><circle r="12" fill="${P.ink}"/>${t > 1.13 ? rings(0, 0, 150, P.red, 0.25 * (1 - seg(t, 1.6, 2.0))) : ""}`, (t > 0.2 ? pop(t - 0.2) : 0) * (1 - scaleOff) * 1.5);
  const brickY = TG - 86 * (1 - scaleOff) - 6 * Math.max(0, weigh - 1) * (1 - scaleOff);
  // the charge: a cable from the wall, a clock races ten hours, the battery fills
  const plug = ease(seg(u1, 0.0, 0.3)) * (1 - ease(seg(u2, 0.05, 0.3))), charge = clamp(seg(u1, 0.25, 0.9)) * (u2 < 0 ? 1 : 1 - seg(u2, 0.2, 1.1));
  const cord = plug > 0 ? drawn(`M1700 ${TG - 300}Q1500 ${TG + 60} ${BX + 40} ${TG - 6}`, plug, "#2a2550", 12) + `<path d="${rr(1680, TG - 340, 60, 80, 10)}" fill="#e8ecff"/>` : "";
  const clockA = u1 > 0 && u2 < 0.15 ? at(1350, 380, wallClock(10 * ease(seg(u1, 0.1, 0.8))) + (u1 > 0.72 ? at(0, 210, `${two(rr(-90, -40, 180, 80, 20), P.gold, P.goldD, 0, 6)}${text(0, 24, "10 h", 60, "#8a5200")}`, pop(u1 - 0.72)) : ""), pop(u1 - 0.0) * (1 - seg(u2, 0, 0.15)) * 1.5) : "";
  const watch = u2 > 0 && u3 < 0.3 ? at(1350, 380, stopwatch(130, 0.5 * ease(seg(u2, 0.2, 1.1)), { fill: P.red }) + (u2 > 0.79 ? at(0, 230, `${two(rr(-110, -40, 220, 80, 20), P.gold, P.goldD, 0, 6)}${text(0, 24, "30 min", 56, "#8a5200")}`, pop(u2 - 0.79)) : ""), pop(u2) * (1 - seg(u3, 0, 0.3)) * 1.5) : "";
  const talk = u2 > 0.3 && u3 < 0 ? radio(BX + 30, TG - 520, tot, 240, { n: 3, speed: 1.3, w: 8 }) : "";
  const lvl = u2 < 0 ? lerp(0.1, 1, charge) : charge, batCol = lvl < 0.25 ? P.red : lvl < 0.6 ? P.gold : P.green;
  const bat = t > 1.64 && u3 < 0 ? at(BX, TG - 640, battery(lvl, batCol), 2.2) : "";
  // 1983 and the price tag
  const cal = u3 > 0.26 ? at(1560, 240, calPage("1983", "", 1, 150), pop(u3 - 0.26)) : "";
  const price = Math.round(lerp(0, 4000, ease(seg(u3, 2.05, 3.22)))), tagK = u3 > 1.9 ? pop(u3 - 1.9) : 0;
  const ptag = tagK > 0 ? `<path d="M${BX + 30} ${TG - 500}Q${BX + 160} ${TG - 560} ${BX + 260} ${TG - 470}" stroke="${P.creamD}" stroke-width="5" fill="none"/>` + at(BX + 360, TG - 440, `${rings(0, 0, 210, P.gold, 0.12)}${two("M-190 -80h290l80 80l-80 80h-290Z", P.gold, P.goldD, 0, 8)}<circle cx="100" cy="0" r="12" fill="#8a5200"/>${text(-50, 34, "$" + fmt(price), 96, "#8a5200")}`, tagK, Math.sin(tot * 2) * 3) : "";
  const room = `<rect x="-1000" y="-1000" width="4000" height="${TG + 1000}" fill="#2c1f63"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${-400 + i * 420}" y="-1000" width="200" height="${TG + 1000}" fill="#33246f"/>`).join("")}<rect x="-1000" y="${TG}" width="4000" height="40" fill="${P.wood}"/><rect x="-1000" y="${TG + 40}" width="4000" height="800" fill="${P.woodD}"/>`;
  const g = layer(room, c, 0.8) + layer(cord + (scaleOff < 1 ? at(BX, TG, sc, 1, 0, `opacity="${(1 - scaleOff).toFixed(2)}"`) : "") + at(BX, brickY, brick(), 1.25) + bat + talk + dial + clockA + watch + cal + ptag, c);
  return g;
}
function s0(a, tot, s) { const c = camAt(a, [[0, 980, 480, 1.0], [1.64, 990, 470, 1.04]]); return { g: table(a, c, tot, s) }; }
function s1(a, tot, s) { const c = camAt(a, [[0, 990, 470, 1.04], [1.25, 1000, 460, 1.06]]); return { g: table(start(s, 1) + a, c, tot, s) }; }
function s2(a, tot, s) { const c = camAt(a, [[0, 1000, 460, 1.06], [1.6, 1010, 455, 1.08]]); return { g: table(start(s, 2) + a, c, tot, s) }; }
function s3(a, tot, s) { const c = camAt(a, [[0, 1010, 455, 1.08], [1.8, 1060, 460, 1.0], [3.7, 1070, 455, 1.03]]); return { g: table(start(s, 3) + a, c, tot, s), out: toScreen(c, BX + 330, TG - 440), outC: P.gold, outZ: 16 }; }

// ---- 4–5 and 7–10: the staircase of generations, in a night city ----
const SX = (i) => 260 + i * 330, STOP = (i) => 820 - i * 120, YEARS = ["1979", "1991", "2001", "2009", "2019"];
const STC = [[P.violet, P.violetD], [P.blue, P.blueD], [P.teal, P.tealD], [P.pink, P.pinkD], [P.gold, P.goldD]];
const candy = () => `${two(rr(-40, -190, 80, 190, 18), "#5a6378", "#3e4658", 6, 0)}<path d="${rr(-30, -170, 60, 56, 6)}" fill="#a8e06a"/>${[0, 1, 2, 3].map((r) => [0, 1, 2].map((q) => `<circle cx="${-20 + q * 20}" cy="${-90 + r * 22}" r="7" fill="#c4cbe6"/>`).join("")).join("")}`;
const robotArm = (sw) => `<path d="${rr(-50, -30, 100, 30, 8)}" fill="${P.steelD}"/><g transform="rotate(${(-20 + sw * 25).toFixed(1)} 0 -30)"><path d="M0 -30L0 -170" stroke="${P.gold}" stroke-width="30" stroke-linecap="round"/><g transform="translate(0 -170) rotate(${(60 - sw * 30).toFixed(1)})"><path d="M0 0L0 -110" stroke="${P.gold}" stroke-width="24" stroke-linecap="round"/><path d="M-20 -110l-14 -30M20 -110l14 -30" stroke="${P.steel}" stroke-width="12" stroke-linecap="round"/></g></g><circle cx="0" cy="-30" r="22" fill="${P.goldD}"/>`;
// a video screen showing a sun over a hill, drawn in blocks of size px (big blocks = poor quality)
const video = (px, on = 1) => { let g = `${two(rr(-120, -90, 240, 180, 16), "#2c2766", P.ink, 0, 8)}`; const W = 200, H = 140, n = Math.max(1, Math.round(W / px)), m = Math.max(1, Math.round(H / px)), bw = W / n, bh = H / m;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const x = -100 + (i + 0.5) * bw, y = -70 + (j + 0.5) * bh, sun = Math.hypot(x - 40, y + 20) < 30, hill = y > 30 - 40 * Math.cos((x + 20) / 60); g += `<rect x="${(-100 + i * bw).toFixed(1)}" y="${(-70 + j * bh).toFixed(1)}" width="${(bw + 0.6).toFixed(1)}" height="${(bh + 0.6).toFixed(1)}" fill="${hill ? "#3ddc97" : sun ? "#ffd04a" : "#7fd0ff"}"/>`; }
  return g + (on > 0 ? `<circle r="${30 * on}" fill="#fff" opacity=".85"/><path d="M-10 -16L18 0L-10 16Z" fill="${P.ink}" opacity="${on}"/>` : ""); };
const packet = (k = 1) => at(0, 0, `${two(rr(-26, -20, 52, 40, 8), P.gold, P.goldD, 0, 5)}<path d="M-14 -6h28M-14 6h18" stroke="#8a5200" stroke-width="5" stroke-linecap="round"/>`, k);
const envelope = (open = 0, k = 1) => at(0, 0, `${two(rr(-120, -80, 240, 160, 12), P.cream, P.creamD, 0, 8)}${open < 0.5 ? `<path d="M-120 -80L0 ${lerp(10, -80, open * 2)}L120 -80" fill="none" stroke="${P.creamD}" stroke-width="8" stroke-linejoin="round"/>` : `<path d="M-120 -80L0 ${lerp(-80, -170, open * 2 - 1)}L120 -80Z" fill="${P.creamD}"/>`}`, k);
const icons = [
  () => envelope(0, 0.35),
  () => `${two(rr(-40, -32, 80, 64, 8), "#7fd0ff", "#4fa8e0", 0, 5)}<path d="M-34 24L-8 -4L10 14L22 2L34 24Z" fill="#3ddc97"/><circle cx="18" cy="-14" r="8" fill="${P.gold}"/>`,
  () => `<path d="M-10 26V-30L30 -38V16" stroke="${P.pink}" stroke-width="10" fill="none" stroke-linejoin="round"/><circle cx="-20" cy="26" r="14" fill="${P.pink}"/><circle cx="20" cy="16" r="14" fill="${P.pink}"/>`,
];
function stairs(t, c, tot, s) {
  // t: time from the start of shot 4 (shot 6, the message close-up, is skipped: its time still passes)
  const T5 = E(s)[4], T7 = T5 + E(s)[5] + E(s)[6], T8 = T7 + E(s)[7], T9 = T8 + E(s)[8], T10 = T9 + E(s)[9];
  const riseAt = [2.76, T5 + 0.27, T7 + 0.0, T8 + 0.0, T9 + 0.0], u5 = t - T5, u7 = t - T7, u8 = t - T8, u9 = t - T9, u10 = t - T10;
  let steps = "";
  for (let i = 0; i < 5; i++) { const u = t - riseAt[i]; if (u <= 0) continue; const r = spring(u, 7, 12), top = STOP(i) + (1 - r) * 500, [cc, cD] = STC[i], x = SX(i);
    let ontop = "";
    if (i === 0) ontop = at(0, 0, brick(), 0.55);
    else if (i === 1) ontop = candy();
    else if (i === 2) { const drop = seg(u7, 0.5, 0.95); ontop = bluePhone({ inner: u7 > 0.95 ? at(0, -125, globe(40, tot * 0.1, { id: "g3" }), pop(u7 - 0.95)) : "" }) + (drop > 0 && drop < 1 ? at(0, lerp(-600, -125, easeIn(drop)), globe(40, tot * 0.1, { id: "g3f" })) : ""); }
    else if (i === 3) ontop = bluePhone({ inner: u8 > 0.72 ? at(0, -125, packet(1.1 + 0.1 * Math.sin(tot * 6))) : "" });
    else ontop = at(-70, 0, bluePhone(), 0.8) + (u9 > 3.6 ? at(40, 0, car(P.red, P.redD), 0.45) + at(120, 0, robotArm(0.5 + 0.5 * Math.sin(tot * 3)), 0.55) : "");
    const fan = u10 > 1.02 + i * 0.25 && u10 < 3.0 ? burst(0, -330, 80 * pop(u10 - 1.02 - i * 0.25), tot + i, 1 - seg(u10, 2.5, 3.0)) : "";
    const scr = u10 > 4.1 + i * 0.12 ? at(0, -380, video([40, 25, 14, 7, 3][i], u10 > 4.1 + i * 0.12 + 0.3 ? 1 : 0), pop(u10 - 4.1 - i * 0.12)) : "";
    steps += at(x, top, `${two(rr(-165, 0, 330, 1400, 18), cc, cD, 14, 0)}<path d="${rr(-165, 0, 330, 18, 8)}" fill="#fff" opacity=".2"/>${text(0, 120, (i + 1) + "G", 110, "#fff")}${text(0, 190, YEARS[i], 50, mix(cc, "#ffffff", 0.6))}${at(0, -4, ontop, 1.1)}${fan}${scr}`); }
  // 1G: the voice wave runs from the city tower to the brick; an old radio in a window catches it too
  const radioOn = seg(t, 4.35, 4.8);
  const waveG = t > 3.5 && t < T5 + 1.9 ? `<g opacity="${(1 - seg(u5, 1.6, 1.9)).toFixed(2)}">${drawn(`M-120 260Q100 320 ${SX(0)} ${STOP(0) - 200}`, seg(t, 3.5, 3.9), WAVE, 10, 'stroke-dasharray="26 16"')}${radioOn > 0 ? drawn(`M-120 260Q500 140 760 470`, radioOn, WAVE, 10, 'stroke-dasharray="26 16"') : ""}</g>` : "";
  const oldRadio = at(760, 560, `${two(rr(-130, -90, 260, 160, 22), P.wood, P.woodD, 0, 8)}<circle cx="-50" cy="-10" r="48" fill="#5a3a20"/>${[0, 1, 2].map((k) => `<circle cx="-50" cy="-10" r="${16 + k * 12}" fill="none" stroke="#7a5230" stroke-width="5"/>`).join("")}<path d="${rr(20, -50, 80, 34, 6)}" fill="#f6e3b0"/><path d="M${40 + 30 * Math.sin(tot * 7) * radioOn} -50v34" stroke="${P.red}" stroke-width="5"/>${radioOn > 0 ? [1, 2].map((k) => `<path d="M${-120 - k * 26} -40q${-20} 30 0 60" fill="none" stroke="${P.gold}" stroke-width="8" stroke-linecap="round" opacity="${(radioOn * (0.5 + 0.5 * Math.sin(tot * 12 + k))).toFixed(2)}"/>`).join("") : ""}`, 1);
  const win = `${two(rr(560, 380, 400, 300, 14), "#3c3088", "#2c2370", 0, 8)}<path d="${rr(590, 410, 340, 230, 8)}" fill="#ffd27a"/><rect x="580" y="640" width="360" height="22" fill="#2c2370"/>`;
  const cityTower = at(-160, 900, tower({ t: tot, lit: t > 3.5 && t < T5 ? 1 : 0 }), 1.1);
  // 2G: the wave above the step turns into digits; the envelope, DEC 1992, Merry Christmas
  let two2 = "";
  if (u5 > 1.5 && t < T7) { const x0 = SX(1) - 260, x1 = SX(1) + 260, y = STOP(1) - 420, dg = seg(u5, 2.0, 2.6);
    two2 += `<g opacity="${(1 - dg).toFixed(2)}">${waveLine(x0, x1, y, 140, 46, tot)}</g>`;
    "0110100101".split("").forEach((d, k) => { const u = u5 - 2.1 - k * 0.04; if (u > 0) two2 += at(x0 + 26 + k * 52, y + 24, text(0, 0, d, 76, P.gold), pop(u)); });
    const ek = u5 > 3.23 ? pop(u5 - 3.23) : 0, op = ease(seg(u5, 6.44, 6.9)), card = u5 > 6.7 ? easeOut(seg(u5, 6.7, 7.3)) : 0;
    if (ek > 0) two2 += at(SX(1) + 420, STOP(1) - 330, `${card > 0 ? at(0, -40 - 170 * card, `${two(rr(-260, -70, 520, 140, 16), "#fffaf0", P.creamD, 0, 8)}${text(0, 26, "Merry Christmas", 72, P.red)}`, 0.6 + 0.7 * card) : ""}${envelope(op, 1)}`, ek * 1.25);
    if (u5 > 3.71) two2 += at(1500, 260, calPage("1992", "3 DEC", 1, 150), pop(u5 - 3.71) * (1 - ease(seg(u5, 7.6, 8.1)))); }
  const cal79 = t > 1.47 && t < T5 + 0.4 ? at(1200, 260, calPage("1979", "", 1, 150), pop(t - 1.47) * (1 - ease(seg(u5, -0.2, 0.3)))) : "";
  // 4G: a letter, a picture, a song and the voice become the same packets, flowing into the phone
  let four = "";
  if (u8 > 0 && u9 < 1.5) { const ph = [SX(3), STOP(3) - 140], fade = 1 - seg(u9, 1.0, 1.5);
    icons.forEach((ic, k) => { const x = SX(3) - 260 + k * 260, y = STOP(3) - 560, tr = seg(u8, 0.72 + k * 0.2, 1.1 + k * 0.2);
      if (tr < 0.5) four += at(x, y + 6 * Math.sin(tot * 3 + k), ic(), pop(u8 - 0.1 - k * 0.12) * (1 - tr * 2) * 1.4);
      for (let q = 0; q < 3; q++) { const p = (u8 - 1.0 - k * 0.2 + q * 0.33) % 1; if (u8 > 1.0 + k * 0.2 && p > 0) { const b = bez([x, y], [(x + ph[0]) / 2, y - 80], ph, p); four += at(b[0], b[1], packet(0.9), 1, 0, `opacity="${fade.toFixed(2)}"`); } } });
    const vw = seg(u8, 1.93, 2.46), vy = STOP(3) - 380;
    if (u8 > 1.6) four += `<g opacity="${((1 - vw) * fade).toFixed(2)}">${waveLine(SX(3) + 220, SX(3) + 560, vy, 120, 40, tot)}</g>` + (vw > 0 ? Array.from({ length: 5 }, (_, k) => at(SX(3) + 240 + k * 70 - 300 * seg(u8, 2.4 + k * 0.05, 2.9 + k * 0.05), vy - 80 * seg(u8, 2.4 + k * 0.05, 2.9 + k * 0.05), packet(0.9), pop(u8 - 1.93 - k * 0.07), 0, `opacity="${fade.toFixed(2)}"`)).join("") : ""); }
  // 5G: 2019, much faster packets, machines that talk to each other
  let five = "";
  if (u9 > 0 && u10 < 1.0) { const fade = 1 - seg(u10, 0.5, 1.0);
    if (u9 > 0.83) five += at(640, 170, calPage("2019", "", 1, 150), pop(u9 - 0.83) * fade);
    if (u9 > 1.81) for (let q = 0; q < 8; q++) { const p = (u9 * 2.4 + q / 8) % 1, y = STOP(4) - 520 + (q % 4) * 40; five += at(lerp(SX(4) - 700, SX(4) - 60, p), y, packet(0.7), 1, 0, `opacity="${(fade * (1 - p * 0.3)).toFixed(2)}"`) + `<path d="M${(lerp(SX(4) - 700, SX(4) - 60, p) - 110).toFixed(1)} ${y}h70" stroke="${P.gold}" stroke-width="6" stroke-linecap="round" opacity="${(0.5 * fade).toFixed(2)}"/>`; }
    if (u9 > 3.92) five += radio(SX(4) + 40, STOP(4) - 70, tot, 120, { n: 2, speed: 1.6, w: 7, k: fade }) + radio(SX(4) + 130, STOP(4) - 250, tot + 0.3, 120, { n: 2, speed: 1.6, w: 7, k: fade }); }
  const ground = `<rect x="-2000" y="900" width="6000" height="900" fill="#1f1650"/>`;
  return `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(83, 120, -1000, 3200, 800, tot), c, 0.15) + layer(skyline(91, -1600, 3600, 900, 160, 420, "#251a5c", "#ff8ac0"), c, 0.45)
    + layer(ground + (u5 < 1.9 ? `<g opacity="${(1 - seg(u5, 1.4, 1.9)).toFixed(2)}">${win + oldRadio}</g>` : "") + cityTower + waveG + steps + two2 + cal79 + four + five, c);
}
const burst = (x, y, r, tot, o = 1) => (r <= 0 ? "" : at(x, y, Array.from({ length: 10 }, (_, k) => { const an = k * Math.PI / 5 + tot * 0.3, c = [P.gold, P.pink, WAVE][k % 3]; return `<path d="M${(Math.cos(an) * r * 0.5).toFixed(1)} ${(Math.sin(an) * r * 0.5).toFixed(1)}L${(Math.cos(an) * r).toFixed(1)} ${(Math.sin(an) * r).toFixed(1)}" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`; }).join(""), 1, 0, `opacity="${clamp(o).toFixed(2)}"`));
function s4(a, tot, s) { const c = camAt(a, [[0, 600, 480, 1.05], [2.6, 560, 520, 1.0], [3.4, 420, 480, 1.0], [4.3, 520, 460, 0.95], [6.6, 560, 450, 0.95]]); return { g: stairs(a, c, tot, s), in: toScreen(c, 1200, 260), inC: P.gold, inZ: 16 }; }
function s5(a, tot, s) { const T5 = E(s)[4], c = camAt(a, [[0, 560, 450, 0.95], [0.6, 820, 380, 0.95], [3.0, 860, 360, 0.95], [5.6, 960, 360, 0.92], [8.22, 960, 330, 0.95]]);
  return { g: stairs(T5 + a, c, tot, s), out: toScreen(c, SX(1) + 420, STOP(1) - 540), outC: "#fffaf0", outZ: 18 }; }
function s7(a, tot, s) { const T7 = E(s)[4] + E(s)[5] + E(s)[6], c = camAt(a, [[0, 1000, 330, 0.95], [1.86, 1010, 320, 0.96]]); return { g: stairs(T7 + a, c, tot, s), in: toScreen(c, SX(2), STOP(2) - 125), inC: P.gold, inZ: 16 }; }
function s8(a, tot, s) { const T8 = E(s)[4] + E(s)[5] + E(s)[6] + E(s)[7], c = camAt(a, [[0, 1010, 320, 0.96], [0.6, 1160, 280, 0.95], [2.91, 1180, 270, 0.96]]); return { g: stairs(T8 + a, c, tot, s) }; }
function s9(a, tot, s) { const T9 = E(s)[4] + E(s)[5] + E(s)[6] + E(s)[7] + E(s)[8], c = camAt(a, [[0, 1180, 270, 0.96], [0.6, 1300, 260, 0.95], [5.22, 1320, 250, 0.98]]); return { g: stairs(T9 + a, c, tot, s) }; }
function s10(a, tot, s) { const T10 = E(s)[4] + E(s)[5] + E(s)[6] + E(s)[7] + E(s)[8] + E(s)[9], c = camAt(a, [[0, 1320, 250, 0.98], [1.0, 1000, 420, 0.76], [6.38, 1000, 400, 0.78]]);
  return { g: stairs(T10 + a, c, tot, s), out: toScreen(c, SX(4), STOP(4) - 380), outC: "#1d6fb8", outZ: 18 }; }

// ---- 6: the first text message, 160 slots, squeezed into a gap ----
function s6(a, tot) {
  const c = camAt(a, [[0, 1100, 460, 1.0], [2.0, 1100, 500, 1.0], [8.2, 1120, 520, 1.04]]);
  const filled = Math.floor(160 * ease(seg(a, 0.5, 1.4))), shrink = ease(seg(a, 1.9, 2.8)), slide = ease(seg(a, 2.3, 3.0));
  // the card of 160 slots: 20 x 8, the first slots spell the message
  let slots = ""; for (let k = 0; k < 160; k++) { const i = k % 20, j = Math.floor(k / 20); slots += `<rect x="${-380 + i * 38}" y="${-150 + j * 38}" width="30" height="30" rx="5" fill="${k < filled ? (k < 15 ? P.red : P.gold) : "#d8cfb8"}"/>`; }
  const cw = lerp(1, 0.32, shrink), cx = lerp(1100, 940, slide), cy = lerp(330, 700, slide);
  const card = at(cx, cy, `${two(rr(-410, -180, 820, 340, 24), "#fffaf0", P.creamD, 0, 10)}${slots}`, [cw * 1.2, lerp(1, 0.32, shrink) * 1.2]);
  const count = a > 0.5 && shrink < 1 ? at(1720, 380, `${rings(0, -40, 120, P.gold, 0.15)}${number(0, 0, String(filled), 140, P.gold)}`, 1 - shrink) : "";
  // the network's own signal: blocks that slide past, with one gap the card fits into
  const off = (tot * 120) % 260; let track = "";
  for (let k = -1; k < 8; k++) { const x = 420 + k * 260 + (a < 3.0 ? off : 0) * 0; if (k === 2) continue; track += `<path d="${rr(Math.max(420, x - 110), 640, Math.max(0, Math.min(220, x + 110 - Math.max(420, x - 110))), 120, 14)}" fill="${WAVED}"/><path d="${rr(Math.max(420, x - 100), 650, Math.max(0, Math.min(200, x + 100 - Math.max(420, x - 100))), 30, 10)}" fill="${WAVE}"/>`; }
  const gapGlow = a > 7.52 ? rings(940, 700, 170 * pop(a - 7.52), P.gold, 0.3) : (a > 2.98 && a < 4.0 ? rings(940, 700, 150, P.gold, 0.2 * (1 - seg(a, 3.5, 4.0))) : "");
  // text-speak bubbles out of the message
  const W = [["LOL", 760, 280, 4.95], ["BRB", 1160, 200, 5.33], ["GR8", 1560, 300, 5.67], ["C U", 1360, 430, 6.0]];
  const talk = W.map(([w, x, y, t0]) => (a > t0 ? at(x, y + 6 * Math.sin(tot * 3 + x), `${two(rr(-130, -60, 260, 120, 30), P.pink, P.pinkD, 0, 8)}<path d="M-20 60l10 30l30 -30Z" fill="${P.pinkD}"/>${text(0, 30, w, 84, "#fff")}`, pop(a - t0)) : "")).join("");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(97, 80, -400, 2400, 600, tot), c, 0.2) + layer(`<rect x="420" y="760" width="2400" height="20" fill="#1a1446"/>${track}${gapGlow}${card}${count}${talk}`, c);
  return { g, in: toScreen(c, 1100, 330), inC: "#fffaf0", inZ: 18, out: toScreen(c, 940, 700), outC: P.gold, outZ: 16 };
}

// ---- 11: 5G covers more than half the planet ----
function s11(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [3.02, 960, 540, 1.05]]), R = 330, cov = 0.55 * ease(seg(a, 0.6, 2.42)), id = "g5";
  const curtain = `<clipPath id="${id}c"><circle r="${R}"/></clipPath><g clip-path="url(#${id}c)"><rect x="${-R}" y="${-R}" width="${(2 * R * cov).toFixed(1)}" height="${2 * R}" fill="${WAVE}" opacity=".8"/>${Array.from({ length: 14 }, (_, k) => { const x = -R + rnd(k * 7) * 2 * R * cov, y = -R * 0.8 + rnd(k * 7 + 1) * 1.6 * R; return x < -R + 2 * R * cov ? rings(x, y, 16, "#fff", 0.6) : ""; }).join("")}</g>${cov > 0.02 ? `<path d="M${(-R + 2 * R * cov).toFixed(1)} ${-R}V${R}" stroke="#fff" stroke-width="6" stroke-dasharray="14 12" opacity=".7"/>` : ""}`;
  const pct = Math.round(lerp(0, 55, ease(seg(a, 1.14, 2.42))));
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(101, 120, -200, 2200, 1100, tot), c, 0.2) + layer(at(820, 560, globe(R, tot * 0.02, { id }) + curtain, pop(a + 0.3)) + (a > 1.14 ? at(1440, 600, `${rings(0, -40, 170, WAVE, 0.15)}${text(0, 0, pct + "%", 200, WAVE)}`, pop(a - 1.14)) : ""), c);
  return { g, in: toScreen(c, 820, 560), inC: "#1d6fb8", inZ: 14, out: toScreen(c, 820, 560), outC: "#1d6fb8", outZ: 14 };
}

// ---- 12: not fairly: 84% and 4% ----
function s12(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [4.77, 960, 520, 1.03]]), G2 = 900, H = 560;
  const bar = (x, p, col, n, t0) => { const h = H * p;
    return at(x, G2 - 20, `<path d="${rr(-90, -H - 20, 180, H + 20, 40)}" fill="#ffffff" opacity=".1"/><path d="${rr(-90, -H - 20, 180, H + 20, 40)}" fill="none" stroke="#c4cbe6" stroke-width="8"/>${h > 2 ? `<path d="${rr(-78, -h - 8, 156, h, Math.min(30, h / 2))}" fill="${col}"/>` : ""}${a > t0 ? at(0, -H - 90, text(0, 0, Math.round(100 * p) + "%", 120, col), pop(a - t0)) : ""}`); };
  const rich = ease(seg(a, 0.9, 1.9)) * 0.84, poor = ease(seg(a, 3.3, 4.1)) * 0.04;
  const richHouse = at(420, G2, house(P.gold, P.goldD, { roof: "#8a5200" }), 1.5);
  const hut = at(1500, G2, `${two("M-110 0V-130H110V0Z", "#8a7a6a", "#6a5a4a", 10, 0)}${two("M-150 -120L0 -230L150 -120Z", "#a08560", "#7a6040", 0, 8)}<path d="M-24 0V-70H24V0Z" fill="${P.ink}"/>`, 1.4);
  const ground = `<rect x="-600" y="${G2}" width="3200" height="400" fill="#1f1650"/><rect x="-600" y="${G2}" width="3200" height="12" fill="#3a2f80"/>`;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(107, 90, -300, 2300, 700, tot), c, 0.2) + layer(ground + richHouse + hut + bar(760, rich, WAVE, 84, 1.82) + bar(1180, poor, P.red, 4, 4.05), c);
  return { g, in: [960, 540], inC: "#1d6fb8", inZ: 12 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12];
export const gensSet = makeSet(SHOTS, [], P);
