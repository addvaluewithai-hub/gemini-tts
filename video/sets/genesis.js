// "Block 0": four shots, one per board beat of the genesis scene.
//   0 3 Jan 2009: the empty hooded chair at its laptop; the screen sparks and a gold block marked 0 rises out of it
//     and lands on the first page of a new book
//   1 the block opens like a box: a folded newspaper inside unfolds on the day's headline about a second bailout
//   2 fifty coins appear out of thin air over the block; a chain and padlock wrap it (rules fixed from the start);
//     the old printing press beside it keeps spewing notes
//   3 nine days later: two desks on the planet, the hooded chair and Hal Finney's lit desk; ten coins cross between
//     them, a line joins the first two, and a "?" stays over the hooded chair
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, cross, play, frame, FW, FH, makeSet } from "./kit.js";
import { V } from "./genesis.v.js";
import { P, mix, book, LINES, coin, stars, skyline } from "./bank.js";
import { calPage, calFlip, laptop, hoodChair, globe, padlock, press, banknote } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -600, 2600, 1080, tot), c, 0.15);
// a gold block seen a little from above, face 2s x 2s around (0, 0); `lid` 0..1 opens its top
const block = (s = 120, label = "0", lid = 0, inner = "") => { const d = s * 0.45;
  return `${two(`M${-s} ${-s}L${-s + d} ${-s - d}H${s + d}V${s - d}L${s} ${s}Z`, P.goldD, "#c06f10", 0, 0)}${inner}
    <path d="M${s} ${-s}L${s + d} ${-s - d}V${s - d}L${s} ${s}Z" fill="#c9790f"/>${two(rr(-s, -s, 2 * s, 2 * s, 6), P.gold, P.goldD, s * 0.08, s * 0.08)}<path d="${rr(-s * 0.78, -s * 0.78, s * 1.56, s * 1.56, 6)}" fill="none" stroke="${P.goldD}" stroke-width="${s * 0.06}"/>
    ${label ? text(0, s * 0.42, label, s * 1.2, "#8a5200") : ""}
    ${lid < 1 ? `<g transform="translate(0 ${-s}) scale(1 ${(1 - lid * 1.6).toFixed(3)}) translate(0 ${s})"><path d="M${-s} ${-s}L${-s + d} ${-s - d}H${s + d}L${s} ${-s}Z" fill="#ffe27a"/></g>` : `<path d="M${-s} ${-s}L${-s + d} ${-s - d}H${s + d}L${s} ${-s}Z" fill="#3a1d10"/>`}`; };
// a calendar page with room for a month and year in its band (the holes sit at the edges)
const cal2 = (big, small, k = 1) => at(0, 0, `<path d="${rr(-150, -150, 300, 300, 16)}" fill="${P.creamD}"/><path d="${rr(-150, -150, 300, 292, 16)}" fill="${P.cream}"/><path d="M-150 -134a16 16 0 0 1 16 -16h268a16 16 0 0 1 16 16v60h-300Z" fill="${P.red}"/>
  <circle cx="-122" cy="-124" r="9" fill="${P.ink}"/><circle cx="122" cy="-124" r="9" fill="${P.ink}"/>${text(0, -92, small, 44, "#fff")}${text(0, 92, big, 160, P.ink)}`, k);
// a desk with a laptop on it, top at y = -300, 900 wide
const desk = (screen, inner = "") => `${two(rr(-450, -300, 900, 40, 10), P.wood, P.woodD, 0, 10)}<rect x="-410" y="-260" width="34" height="260" fill="${P.woodD}"/><rect x="376" y="-260" width="34" height="260" fill="${P.woodD}"/>${at(-150, -300, laptop(screen, inner), 1.2)}`;

// ---- 0: the network starts, and block 0 is written ----
function s0(a, tot) {
  const G = 940, DK = [1050, G], LT = [900, G - 300];
  const c = camAt(a, [[0, 1080, 620, 1.16], [2.0, 1080, 615, 1.18], [3.0, 1070, 600, 1.2], [4.3, 1090, 610, 1.22], [6.44, 1100, 620, 1.25]]);
  const spark = a > 2.42 ? Math.exp(-(a - 2.42) * 3) : 0, on = seg(a, 2.42, 2.7), scr = mix("#2a2f6e", "#fff3c2", Math.max(on * 0.5, spark));
  const code = on > 0 ? [0, 1, 2, 3].map((r) => `<path d="${rr(-100, -170 + r * 30, 160 * seg(a, 2.6 + r * 0.12, 2.9 + r * 0.12) + 20, 12, 6)}" fill="${[P.teal, P.pink, P.gold, P.blue][r]}"/>`).join("") : "";
  // the block: out of the screen, up, then down onto the book's first page
  const rise = ease(seg(a, 3.4, 4.1)), land = ease(seg(a, 4.35, 4.9)), BK = [1320, G - 330];
  const bp = land > 0 ? bez([LT[0] + 70, LT[1] - 280], [1200, LT[1] - 380], [BK[0] - 75, BK[1] - 60], land) : [LT[0] + 70, lerp(LT[1] - 130, LT[1] - 280, rise)];
  const zeroGlow = a > 5.65 ? Math.exp(-(a - 5.65) * 3) : 0, bk = 1 + 0.12 * zeroGlow;
  const blk = a > 3.35 ? at(bp[0], bp[1], rings(0, 0, 150 + 60 * zeroGlow, P.gold, 0.25 + 0.2 * zeroGlow) + block(100, "0"), lerp(lerp(0.3, 1, rise), 0.62, land) * bk) : "";
  const bookOpen = at(BK[0], BK[1], book(land >= 1 ? at(-75, 0, `<path d="${rr(-60, -70, 120, 140, 6)}" fill="${P.gold}" opacity="${(0.35 + 0.3 * zeroGlow).toFixed(2)}"/>`) : ""), 1.0);
  const flashes = spark > 0.05 ? [0, 1, 2, 3, 4, 5].map((i) => { const an = i * 1.05, d = 120 + 260 * (1 - spark); return `<path d="M${LT[0] + 70 + Math.cos(an) * d * 0.6} ${LT[1] - 110 + Math.sin(an) * d * 0.6}L${LT[0] + 70 + Math.cos(an) * d} ${LT[1] - 110 + Math.sin(an) * d}" stroke="${P.gold}" stroke-width="10" stroke-linecap="round" opacity="${spark.toFixed(2)}"/>`; }).join("") : "";
  const cal = at(1540, 380, cal2("03", "JAN 2009", 0.8), pop(a - 0.2), -4);
  const room = `<rect x="-600" y="-400" width="3200" height="1800" fill="#3b1d74"/><rect x="-600" y="${G}" width="3200" height="500" fill="#2c1a66"/>
    <path d="${rr(150, 120, 520, 400, 16)}" fill="${P.ink}"/><path d="${rr(170, 140, 480, 360, 8)}" fill="${P.night0}"/>${stars(5, 16, 180, 640, 480, tot)}<circle cx="560" cy="230" r="40" fill="${P.cream}"/><circle cx="545" cy="218" r="36" fill="${P.night0}"/>`;
  const glow = on > 0 ? `<path d="M${LT[0] - 80} ${LT[1] - 200}L${LT[0] - 600} ${G}H${LT[0] + 760}L${LT[0] + 220} ${LT[1] - 200}Z" fill="#fff3c2" opacity="${(0.06 * on + 0.15 * spark).toFixed(3)}"/>` : "";
  const g = layer(room, c, 0.7) + layer(glow + at(DK[0], G, desk(scr, code)) + bookOpen + cal + at(600, G + 40, hoodChair(), 1.0) + flashes + blk, c);
  return { g, out: toScreen(c, bp[0], bp[1]), outC: P.gold, outZ: 16 };
}
// ---- 1: inside the block, the day's newspaper ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.05], [1.3, 960, 560, 0.95], [2.6, 960, 520, 1.0], [6.86, 960, 520, 1.04]]);
  const lid = ease(seg(a, 0.25, 0.8)), up = ease(seg(a, 0.8, 1.45)), unfold = ease(seg(a, 1.45, 2.3));
  const B = [960, 820], np = [960, lerp(780, 500, up)];
  const lines = [["Chancellor on brink", 3.56], ["of second bailout", 4.6], ["for banks", 5.35]];
  const W = lerp(240, 1240, unfold), H = lerp(160, 700, unfold), x0 = -W / 2, y0 = -H / 2;
  let paper = `${two(rr(x0, y0, W, H, 10), "#f6f1e4", "#ddd3bc", 0, 12)}`;
  if (unfold < 1) paper += `<path d="M0 ${y0}V${-y0}" stroke="#cfc4a8" stroke-width="5"/>`;
  else { const typeL = (str, t0) => str.slice(0, Math.round(str.length * seg(a, t0, t0 + 0.45)));
    paper += text(0, y0 + 104, "The Times", 92, P.ink, { opacity: seg(a, 2.0, 2.3).toFixed(2), extra: 'font-family="Elite"' }).replace('font-family="Anton"', "") + `<path d="M${x0 + 50} ${y0 + 130}H${-x0 - 50}" stroke="${P.ink}" stroke-width="6"/>`
      + text(0, y0 + 172, a > 2.6 ? "03 / Jan / 2009" : "", 38, "#6b5d45") + `<path d="M${x0 + 50} ${y0 + 194}H${-x0 - 50}" stroke="${P.ink}" stroke-width="3"/>`
      + lines.map(([l, t0], i) => text(-60, y0 + 300 + i * 96, typeL(l, t0), 88, P.ink)).join("")
      + at(470, y0 + 420, `<path d="${rr(-110, -150, 220, 300, 6)}" fill="#e6dcc4"/>${at(0, 110, `<path d="M-90 0h180v-14h-180Z" fill="#8a7a5a"/><path d="M-80 -14V-110h160V-14Z" fill="#b5a47e"/><path d="M-100 -110L0 -170L100 -110Z" fill="#8a7a5a"/>`, 0.9)}${rings(0, -10, 90, P.red, 0.0)}<circle cx="0" cy="-30" r="44" fill="none" stroke="${P.red}" stroke-width="16" stroke-dasharray="26 18"/>`, pop(a - 5.4))
      + [0, 1, 2, 3].map((r) => `<path d="M${x0 + 60} ${y0 + 600 + r * 24}h${-x0 * 2 - 400}" stroke="#cfc4a8" stroke-width="10" stroke-linecap="round"/>`).join(""); }
  const ny = at(np[0], np[1], paper, 1, (1 - unfold) * -6);
  const g = night(c, tot, 13) + layer(`<rect x="-600" y="940" width="3200" height="400" fill="#2c1a66"/>`, c, 0.8) + layer(at(B[0], B[1], rings(0, 0, 260, P.gold, 0.18) + block(160, unfold > 0.5 ? "" : "0", lid)) + ny, c);
  return { g, in: toScreen(c, B[0], B[1]), inC: P.gold, inZ: 16 };
}
// ---- 2: fifty coins out of thin air, by rules locked in from the start; unlike the press next door ----
function s2(a, tot) {
  const G = 920, B = [1000, G - 220], PR = [330, G];
  const c = camAt(a, [[0, 980, 480, 1.12], [3.3, 980, 490, 1.14], [4.0, 1000, 600, 1.25], [6.4, 990, 600, 1.2], [7.2, 760, 560, 0.95], [8.86, 760, 560, 0.97]]);
  // the coins: a sparkle in empty air, then a coin, fifty times, settling in a heap beside the block
  let coins = "", count = 0;
  for (let i = 0; i < 50; i++) { const t0 = 0.94 + i * 0.03, u = a - t0; if (u < 0) continue; count++;
    const ax = B[0] - 200 + rnd(i * 3) * 400, ay = 170 + rnd(i * 3 + 1) * 140, row = Math.floor(i / 10), w = 10 - row * 1.5, hx = B[0] + 38 + ((i % 10) - 4.5) * 30 * (w / 10) + (row % 2) * 12, hy = B[1] - 222 - row * 22;
    const fall = easeIn(seg(u, 0.25, 0.75)), x = lerp(ax, hx, fall), y = lerp(ay, hy, fall);
    if (u < 0.25) coins += at(ax, ay, `<path d="M0 -30L8 -8L30 0L8 8L0 30L-8 8L-30 0L-8 -8Z" fill="#fff3c2"/>`, (0.4 + spring(u, 10, 16)) * (1 - u / 0.25 * 0.5));
    else coins += at(x, y, coin(24), 1, 0); }
  const shown = Math.round(lerp(0, 50, ease(seg(a, 1.0, 2.5))));
  const counter = a > 1.0 ? at(1270, 400, `<path d="${rr(-110, -60, 220, 100, 50)}" fill="${P.ink}" opacity=".6"/>${disc(-60, -10, 30, P.gold, P.goldD)}${number(30, 22, String(shown), 80, P.gold)}`, pop(a - 1.0)) : "";
  // the chain and the padlock
  const wrap = seg(a, 3.75, 4.5), lockA = a - 4.45;
  const chainL = Array.from({ length: 18 }, (_, i) => { const p = i / 17; if (wrap <= 0 || p > wrap) return ""; const x = B[0] - 230 + p * 460, y = B[1] + 30 * Math.sin(p * Math.PI) - 10; return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="20" ry="12" fill="none" stroke="${P.steel}" stroke-width="8" transform="rotate(${i % 2 ? 25 : -25} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join("");
  const chainV = Array.from({ length: 12 }, (_, i) => { const p = i / 11; if (wrap <= 0 || p > wrap) return ""; const y = B[1] - 220 + p * 400, x = B[0] + 10 * Math.sin(p * 3); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="12" ry="20" fill="none" stroke="${P.steel}" stroke-width="8"/>`; }).join("");
  const lock = lockA > 0 ? at(B[0], B[1] + 30, padlock(1.4, 0) + rings(0, 0, 160 * spring(lockA, 7, 11), P.gold, 0.2 * (1 - seg(lockA, 0.4, 1))), pop(lockA)) : "";
  // the press next door, printing as fast as ever
  const ph = 1.8 * a, cyc = ph % 1, stamp = cyc < 0.3 ? Math.sin(Math.PI * cyc / 0.3) : 0, n = Math.floor(ph), pa = seg(a, 6.4, 7.0);
  let spew = ""; for (let j = 0; j < 6; j++) { const u = ((a * 1.8 + j / 6) % 1), x = PR[0] + 150 + 420 * u, y = G - 140 - 300 * Math.sin(Math.PI * u) + 260 * u; spew += at(x, y, banknote(1.2), 1, 200 * u + j * 40); }
  const pile = Array.from({ length: Math.min(16, 6 + n) }, (_, i) => at(PR[0] + 480 + (i % 4) * 30 - 40, G - 12 - Math.floor(i / 4) * 20 - (i % 2) * 6, banknote(1.1), 1, (i * 37) % 50 - 25)).join("");
  const presses = pa > 0 ? at(PR[0], G, press(stamp, { lamp: 3 }), 1.2 * pop(a - 6.4)) + spew + pile + `<path d="M${PR[0] + 700} ${G - 700}V${G}" stroke="#4a3791" stroke-width="10" stroke-dasharray="20 18"/>` : "";
  const ground = `<rect x="-800" y="${G}" width="3600" height="500" fill="#2c1a66"/>`;
  const g = night(c, tot, 29) + layer(skyline(41, -600, 2800, G - 60, 100, 280, "#3a2470"), c, 0.5) + layer(ground + presses + at(B[0], B[1], rings(0, 0, 280, P.gold, 0.16) + block(170, "0")) + chainL + chainV + lock + coins + counter, c);
  return { g, out: toScreen(c, B[0], B[1]), outC: P.gold, outZ: 18 };
}
// ---- 3: nine days later, the first payment: from the hooded chair to Hal Finney's desk ----
function s3(a, tot) {
  const GX = 960, GY = 1700, R = 1300, TH = [-0.235, 0.235], pos = (th, lift = 0) => [GX + (R + lift) * Math.sin(th), GY - (R + lift) * Math.cos(th)];
  const c = camAt(a, [[0, 960, 170, 1.22], [7.15, 960, 165, 1.25]]);
  const L = pos(TH[0]), Rt = pos(TH[1]);
  const linked = seg(a, 4.67, 5.2), hal = seg(a, 4.11, 4.5), q = a - 5.79;
  const scrL = mix("#9fe7ff", "#fff3c2", linked), deskL = `${two(rr(-260, -180, 520, 30, 8), P.wood, P.woodD, 0, 8)}<rect x="-230" y="-150" width="22" height="150" fill="${P.woodD}"/><rect x="208" y="-150" width="22" height="150" fill="${P.woodD}"/>${at(40, -180, laptop(scrL), 0.7)}`;
  const left = at(L[0], L[1], deskL + at(-60, 30, hoodChair(), 0.5), 1.15, TH[0] * 57.3) + (q > 0 ? at(L[0] + 60, L[1] - 440, text(0, 60, "?", 190, P.cream), pop(q) * (1 + 0.04 * Math.sin(tot * 3))) : "");
  const lampOn = 0.5 + 0.5 * hal;
  const deskR = `${two(rr(-260, -180, 520, 30, 8), P.wood, P.woodD, 0, 8)}<rect x="-230" y="-150" width="22" height="150" fill="${P.woodD}"/><rect x="208" y="-150" width="22" height="150" fill="${P.woodD}"/>${at(-40, -180, laptop(mix("#9fe7ff", "#fff3c2", linked)), 0.7)}
    <path d="M150 -180V-330L210 -380" stroke="${P.ink}" stroke-width="10" fill="none"/><path d="M190 -400l60 -20l30 60l-60 20Z" fill="${P.red}"/><path d="M220 -370L360 -180H100Z" fill="#ffd98a" opacity="${(0.25 * lampOn).toFixed(2)}"/>
    <path d="${rr(-230, -240, 50, 60, 8)}" fill="${P.blue}"/><path d="M-180 -226q24 0 24 18q0 18 -24 18" stroke="${P.blue}" stroke-width="8" fill="none"/>
    ${at(-60, -100, `<path d="${rr(-170, -34, 340, 68, 10)}" fill="${P.gold}"/>${text(0, 20, "Hal Finney", 50, "#5a3400")}`, 0.3 + 0.7 * pop(a - 4.0))}`;
  const right = at(Rt[0], Rt[1], (hal > 0 ? rings(0, -200, 280, P.win, 0.14 * hal) : "") + deskR, 1.15, TH[1] * 57.3);
  // ten coins along an arc from one laptop to the other
  const from = pos(TH[0] + 0.03, 330), to = pos(TH[1] - 0.05, 330), mid = [GX, -80];
  let coins = "";
  for (let i = 0; i < 10; i++) { const t0 = 2.1 + i * 0.12, p = seg(a, t0, t0 + 1.2); if (p <= 0) continue; const b = bez(from, mid, to, ease(p));
    coins += p < 1 ? at(b[0], b[1], coin(40), 1, 0) : at(to[0] - 120 + (i % 5) * 30 + 40, to[1] + 120 - Math.floor(i / 5) * 18, coin(18)); }
  const link = linked > 0 ? drawn(`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1]} ${to[0]} ${to[1]}`, linked, P.gold, 8) : drawn(`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1]} ${to[0]} ${to[1]}`, seg(a, 1.2, 1.8), "#9fe7ff", 3, 'stroke-dasharray="6 14"');
  // the calendar: from the 3rd to the 12th
  const day = Math.round(lerp(3, 12, ease(seg(a, 0.3, 1.0)))), cal = at(560, -100, cal2(String(day).padStart(2, "0"), "JAN 2009", 0.6), pop(a - 0.1), -4);
  const g = night(c, tot, 31) + layer(at(GX, GY, globe(R, 0.15, { night: 0.3, id: "g3" })), c, 1) + layer(link + left + right + coins + cal, c);
  return { g, in: [960, 540], inC: P.gold, inZ: 14 };
}

const SHOTS = [s0, s1, s2, s3];
// in a Short (cfg.vertical) the portrait versions of genesis.v.js (see makeSet in kit.js)
export const genesisSet = makeSet(SHOTS, V, P);
