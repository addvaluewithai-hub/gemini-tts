// Crypto part 2, "mining": fourteen wordless shots, one per board beat of the mine scene (shot list:
// episodes/techforbadguys/explain-crypto-02-world/shots.md, rows 28-41). Built in the world of part 1 with the part 2 props.
//   0 the contest: a page through the hash machine gives 7f3a…, ✗; the target lights 0000
//   1 number after number: cards fly out faster and faster; pull back to a planet of machines, 10^21 tries a second
//   2 one card reads 0000a1 ✓; its page joins the chain; new coins pour out to its machine
//   3 every laptop checks the card in a blink; a needle in a haystack, then held up
//   4 no pickaxe, no mine cart: a warehouse of blinking rigs, fans, heat
//   5 the winning card unrolls into a certificate, a pylon's power runs into its seal, a forged copy burns
//   6 more rigs arrive, the clock races, the target grows by itself (14 days), the clock is back to ten minutes
//   7 the hooded chair mining at home in 2009; pull back to a warehouse as big as a stadium
//   8 a bill outweighs the prize and the rig goes dark; containers go to a dam, a gas flare, a volcano
//   9 the planet: containers piled on CHINA, 2021, a ban; they fly to USA and RUSSIA, boxes with fans
//  10 one container left in CHINA under a tarp, still blinking; the ban sign droops
//  11 small rigs wire up into teams; a pie where two slices make about half
//  12 a network without a manager, two dots swell into giants, the small ones shiver
//  13 laptops with the book check every passing page, a gavel each, and their pay is $0
// The host leans in on beats 4, 8, 10 (right) and 5, 6, 7, 12, 13 (left): that lower corner is kept clear.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2mine.v.js";
import { house, book, rows, stars, skyline, pill } from "./bank.js";
import { laptop, globe, calPage, hoodChair } from "./props.js";
import { P, mix, coin, page, card, whorl, hashBox, HASH_IN, HASH_OUT, link, rig, warehouse, clock, balance, container, pylon, bolt } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -1600, 3600, 1080, tot), c, 0.15);
const ground = (G, fill = "#241455", x0 = -3000, w = 9000) => `<rect x="${x0}" y="${G}" width="${w}" height="3000" fill="${fill}"/>`;
const far = (c, G, seed = 31) => layer(skyline(seed, -1400, 3400, G - 30, 90, 260, "#2a1d66", "#5a3a9a"), c, 0.45);
const WIN = "#2a1d66";   // the colour of the hash machine's window, the shape two shots hand over through
// the target board: n slots, `lit[i]` 0..1 how far slot i shows a gold 0
const target = (n, lit, o = {}) => { const w = 110 * n + 60;
  return `${two(rr(-w / 2, -90, w, 180, 24), "#2c1f63", P.ink, 0, 10)}${Array.from({ length: n }, (_, i) => { const x = -w / 2 + 85 + i * 110, l = clamp(lit[i] || 0);
    return `<path d="${rr(x - 45, -62, 90, 124, 14)}" fill="${mix("#3a2a7a", "#4a3410", l)}"/>${l > 0 ? rings(x, 0, 52 * (0.6 + 0.4 * l), P.gold, 0.2 * l) + at(x, 0, text(0, 36, "0", 100, P.gold), 0.4 + 0.6 * spring(l * 0.5, 10, 18)) : text(x, 30, "?", 80, "#5a4a9a")}`; }).join("")}`; };
const nugget = (x, y, r) => `<path d="M${x - r} ${y}l${r * 0.4} ${-r * 0.9}l${r * 0.9} ${-r * 0.2}l${r * 0.7} ${r * 0.8}l${-r * 0.4} ${r * 0.5}Z" fill="${P.gold}"/><path d="M${x - r * 0.6} ${y - r * 0.9}l${r * 0.9} ${-r * 0.2}l${r * 0.2} ${r * 0.3}l${-r * 0.8} ${r * 0.2}Z" fill="#fff0a8"/>`;

// ---- 0: the contest ----
function s0(a, tot) {
  const G = 920, MX = 650, TG = [1250, 330];
  const c = camAt(a, [[0, 900, 560, 1.22], [6.14, 930, 545, 1.3]]);
  const drop = seg(a, 0.05, 0.85), into = seg(a, 0.95, 1.35), run = seg(a, 1.3, 2.1);
  const pg = into < 1 ? at(MX, lerp(40, G - 470, easeIn(drop)) + 40 * ease(into), page({ rows: [["blue", "pink", "30"], ["teal", "violet", "5"], ["pink", "teal", "12"]], prev: 2 }), 0.62 * (1 - 0.7 * ease(into)), -6 * (1 - drop)) : "";
  const mach = at(MX, G, hashBox({ spin: tot * 0.6 + 9 * ease(run), shake: run > 0 && run < 1 ? 5 * Math.sin(a * 70) : 0, lights: [run > 0.2 ? P.gold : 0, run > 0.5 ? P.gold : 0, a > 2.1 ? P.red : 0], lamp: a > 2.9 ? P.red : P.green }), 1.15);
  // the card: out of the slot, then up under the target to be compared with it
  const out = seg(a, 2.0, 2.45), up = ease(seg(a, 2.45, 2.95)), cs = [MX + HASH_OUT[0] * 1.15, G + HASH_OUT[1] * 1.15];
  const cp = [lerp(cs[0] + 150 * easeOut(out), TG[0], up), lerp(cs[1], 600, up)];
  const crd = out > 0 ? at(cp[0], cp[1], card(5, { hex: "7f3a9", shown: Math.round(5 * seg(a, 2.1, 2.6)) }), lerp(0.6, 1.25, Math.max(easeOut(out) * 0.4, up))) : "";
  const bad = a > 3.0 ? cross(cp[0] + 190, cp[1] - 70, 48, P.red, a - 3.0) : "";
  // the target: 0000 lights one zero at a time; the card's first digit flashes red against it
  const lit = [0, 1, 2, 3].map((i) => seg(a, 3.7 + i * 0.4, 4.0 + i * 0.4));
  const tgt = at(TG[0], TG[1], (a > 3.7 ? rings(0, 0, 330, P.gold, 0.08 + 0.05 * Math.sin(tot * 3)) : "") + target(4, lit), pop(a + 0.5) * 1.05);
  const flash = a > 5.3 ? at(cp[0] - 26, cp[1] + 6, `<path d="${rr(-40, -44, 80, 80, 12)}" fill="none" stroke="${P.red}" stroke-width="8" opacity="${(0.6 + 0.4 * Math.sin(a * 12)).toFixed(2)}"/>`, 1.25) : "";
  const g = night(c, tot, 3) + far(c, G) + layer(ground(G) + mach + pg + tgt + crd + bad + flash, c);
  return { g, out: toScreen(c, MX, G - 200 * 1.15), outC: WIN, outZ: 18 };
}

// ---- 1: number after number, then the whole planet ----
const SPITS = (() => { const t = []; let x = 0.85, d = 0.62; while (x < 8.4) { t.push(x); x += d; d = Math.max(0.09, d * 0.8); } return t; })();
const RIMS = [-1.45, -1.1, -0.76, -0.4, 0.4, 0.76, 1.1, 1.45, 1.85, -1.85, 2.3, -2.3, 2.75, -2.75];
function s1(a, tot) {
  const GX = 960, GR = 1100, GC = [GX, 900 + GR], MY = 900;
  const c = camAt(a, [[0, 960, 640, 1.0], [3.0, 960, 650, 1.04], [5.2, 960, 1640, 0.3], [8.23, 960, 1660, 0.29]]);
  const n = Math.floor(1 + 1.6 * a + 9 * a * a), spin = tot * 0.6 + a * a * 1.5;
  let w = at(GC[0], GC[1], globe(GR, tot * 0.004, { night: 0.3 }));
  // the other machines round the planet, each spitting little cards once the camera pulls back
  RIMS.forEach((th, i) => { const x = GC[0] + GR * Math.sin(th), y = GC[1] - GR * Math.cos(th); let m = hashBox({ spin: tot * 4 + i, id: "r" + i, lamp: P.red });
    for (let k = 0; k < 4; k++) { const u = ((tot * 1.7 + k * 0.25 + rnd(i) ) % 1); m += at(HASH_OUT[0] + 40 + 260 * u, HASH_OUT[1] - 120 * Math.sin(Math.PI * u), `<path d="${rr(-60, -30, 120, 60, 10)}" fill="${P.cream}"/>`, 1 - 0.4 * u); }
    w += at(x, y, m, 0.9 * pop(a - 2.6 - rnd(i * 3) * 1.2), th * 57.3); });
  // the machine we watch, on top
  let cards = "";
  SPITS.forEach((t0, k) => { const u = a - t0; if (u < 0 || u > 1.1) return; const p = u / 1.1, x = GX + HASH_OUT[0] + 40 + 620 * easeOut(p), y = MY + HASH_OUT[1] - 260 * Math.sin(Math.PI * p * 0.9) + 120 * p * p;
    cards += at(x, y, card(20 + k, { dots: false }) + (u > 0.22 ? cross(110, -60, 30, P.red, u - 0.22) : ""), 0.62, 14 * p); });
  const me = at(GX, MY, hashBox({ spin, lights: [P.gold, P.gold, P.red], lamp: P.red }));
  const pgIn = at(GX, MY - 470, page({ rows: [["blue", "pink", "30"], ["teal", "violet", "5"]], prev: 2 }), 0.42);
  const dial = at(GX - 330, MY - 520, `${two(rr(-120, -70, 240, 120, 18), P.cream, P.creamD, 0, 7)}${text(-86, 6, "#", 56, "#a58f5e")}${text(20, 12, String(n).slice(-5), 66, P.ink)}<path d="M120 -10L170 30" stroke="${P.creamD}" stroke-width="8"/>`, 1);
  w += me + pgIn + dial + cards;
  // the count: a thousand billion billion a second, in screen space at the top
  const k = Math.round(7 * seg(a, 4.4, 7.7)), num = "1" + ",000".repeat(k);
  const ctr = a > 4.3 ? at(FW / 2, FH > FW ? 220 : 120, `<path d="${rr(-860, -66, 1720, 112, 56)}" fill="${P.ink}" opacity=".82"/>${text(0, 26, num + " / s", 74, P.gold)}`, pop(a - 4.3) * Math.min(1, FW / 1800)) : "";
  const g = night(c, tot, 13) + layer(w, c) + ctr;
  return { g, in: toScreen(c, GX, MY - 200), inC: WIN, inZ: 18, out: toScreen(c, GX, MY - 200), outC: WIN, outZ: 30 };
}

// ---- 2: the winner ----
const CHAIN = [1250, 1530, 1810, 2090, 2370];
function s2(a, tot) {
  const G = 940, MX = 560, CY = 420, NEW = [990, CY];
  const c = camAt(a, [[0, 720, 660, 1.2], [1.7, 760, 640, 1.2], [2.6, 1020, 560, 1.05], [3.3, 760, 660, 1.1], [4.91, 740, 670, 1.14]]);
  const out = seg(a, 0.25, 0.7), cp = [MX + HASH_OUT[0] + 260 * easeOut(out), G + HASH_OUT[1] - 120 * ease(seg(a, 0.6, 1.0))];
  const win = a > 0.25 ? at(cp[0], cp[1], (a > 1.35 ? rings(0, 0, 200, P.green, 0.18 * (1 + 0.2 * Math.sin(tot * 4))) : "") + card(9, { hex: "0000a", shown: Math.round(5 * seg(a, 0.45, 1.3)), colour: P.green }) + (a > 1.35 ? check(150, -66, 40, P.green, a - 1.35) : ""), 1.2 * pop(a - 0.25)) : "";
  // the chain waits on the right; the new page flies from the funnel and snaps onto its end
  let ch = ""; CHAIN.forEach((x, i) => { ch += at(x, CY, page({ rows: [["teal", "pink", ""], ["blue", "violet", ""], ["pink", "gold", ""]], prev: 40 + i, seal: 41 + i, block: 1 }), 0.62); if (i) ch += link(CHAIN[i - 1] + 80, CY, x - 80, CY); });
  const fly = seg(a, 1.85, 2.4), np = fly > 0 ? bez([MX, G - 470], [MX + 120, CY - 240], NEW, ease(fly)) : [MX, G - 470];
  const newPg = at(np[0], np[1], (a > 2.4 ? rings(0, 0, 230, P.gold, 0.25 * Math.exp(-(a - 2.4) * 3)) : "") + page({ rows: [["blue", "pink", "30"], ["teal", "violet", "5"], ["pink", "teal", "12"]], prev: 40, seal: 9, sealC: P.green, block: seg(a, 2.3, 2.7) }), lerp(0.42, 0.62, ease(fly)));
  const lk = link(NEW[0] + 80, CY, CHAIN[0] - 80, CY, P.gold, seg(a, 2.4, 2.65));
  // the prize: new coins out of the page, down to a heap by the machine
  let coins = "", heap = "";
  for (let i = 0; i < 9; i++) { const t0 = 3.25 + i * 0.12, u = seg(a, t0, t0 + 0.6), to = [MX - 380 + (i % 3) * 64 + (Math.floor(i / 3) % 2) * 32, G - 30 - Math.floor(i / 3) * 52];
    if (u <= 0) continue; if (u < 1) { const b = bez(NEW, [lerp(NEW[0], to[0], 0.5), CY - 200], to, easeIn(u)); coins += at(b[0], b[1], coin(34, "B"), 1, 300 * u); } else heap += at(to[0], to[1], coin(34, "B"), 1 + 0.25 * Math.exp(-(a - t0 - 0.6) * 8)); }
  const mach = at(MX, G, hashBox({ spin: tot * 0.8 + 6 * seg(a, 0, 0.4), lights: [P.green, P.green, P.green], lamp: P.green }));
  const g = night(c, tot, 17) + far(c, G, 9) + layer(ground(G) + ch + lk + mach + heap + win + newPg + coins, c);
  return { g, in: toScreen(c, MX, G - 200), inC: WIN, inZ: 18, out: toScreen(c, NEW[0], NEW[1]), outC: P.cream, outZ: 18 };
}

// ---- 3: easy to check, hard to find ----
const STRAW = Array.from({ length: 90 }, (_, i) => [rnd(i * 5 + 1), rnd(i * 5 + 2), rnd(i * 5 + 3)]);
function s3(a, tot) {
  const LY = 470, LX = [420, 780, 1140, 1500], HS = [960, 1500];
  const c = camAt(a, [[0, 960, 400, 1.3], [1.15, 960, 405, 1.3], [1.75, 960, 1150, 1.12], [4.23, 960, 1080, 1.16]]);
  let tops = "";
  LX.forEach((x, i) => { const t0 = 0.45 + i * 0.13, ok = a > t0, flash = ok ? Math.exp(-(a - t0) * 4) : 0;
    tops += at(x, LY, (flash > 0.05 ? rings(0, -110, 150, P.green, 0.3 * flash) : "") + laptop(ok ? "#c9ffe0" : "#9fe7ff", at(0, -110, card(9, { hex: "0000a", colour: P.green }), 0.82)), 0.8) + (ok ? check(x + 110, LY - 220, 34, P.green, a - t0) : ""); });
  // the haystack, with a needle glinting inside, then held up
  let st = ""; STRAW.forEach(([u, v, r], i) => { const x = HS[0] + (u - 0.5) * 820 * Math.sqrt(1 - v * 0.9), y = HS[1] - v * 420 + 20, an = (r - 0.5) * 1.6; st += `<path d="M${(x - Math.cos(an) * 46).toFixed(1)} ${(y - Math.sin(an) * 46).toFixed(1)}L${(x + Math.cos(an) * 46).toFixed(1)} ${(y + Math.sin(an) * 46).toFixed(1)}" stroke="${i % 3 ? "#f2c75a" : "#c9952e"}" stroke-width="9" stroke-linecap="round"/>`; });
  const hay = `<path d="M${HS[0] - 470} ${HS[1]}Q${HS[0] - 420} ${HS[1] - 470} ${HS[0]} ${HS[1] - 470}Q${HS[0] + 420} ${HS[1] - 470} ${HS[0] + 470} ${HS[1]}Z" fill="#e0a83a"/>${st}`;
  const hid = [HS[0] + 150, HS[1] - 180], up = ease(seg(a, 2.75, 3.35)), np = [lerp(hid[0], HS[0] + 60, up), lerp(hid[1], HS[1] - 560, up)];
  const glint = a > 1.55 && a < 2.8 ? rings(hid[0], hid[1], 26 + 10 * Math.sin(a * 14), "#ffffff", 0.5 * seg(a, 1.55, 1.8)) : "";
  const needle = at(np[0], np[1], `<path d="M0 -150L7 120L0 150L-7 120Z" fill="${P.steel}"/><ellipse cx="0" cy="-118" rx="6" ry="18" fill="${P.ink}"/>`, 1.6, lerp(70, -10, up));
  const shine = a > 3.35 ? [0, 1, 2, 3].map((i) => { const an = i * 1.571 + tot; return `<path d="M${np[0]} ${np[1] - 240}L${(np[0] + Math.cos(an) * 90).toFixed(1)} ${(np[1] - 240 + Math.sin(an) * 90).toFixed(1)}" stroke="#fff3c2" stroke-width="8" stroke-linecap="round" opacity="${(0.8 * seg(a, 3.35, 3.6)).toFixed(2)}"/>`; }).join("") + rings(np[0], np[1] - 240, 60, P.gold, 0.35) : "";
  const g = night(c, tot, 21) + layer(`<rect x="-500" y="${LY}" width="2900" height="28" fill="#3a2a7a"/>` + ground(HS[1], "#241455") + tops + (up < 0.5 ? hay + glint + needle : needle + hay) + shine, c);
  return { g, in: toScreen(c, LX[1], LY - 88), inC: P.cream, inZ: 18, out: toScreen(c, np[0], np[1] - 240), outC: P.gold, outZ: 22 };
}

// ---- 4: no pickaxe, no mine ----
function s4(a, tot) {
  const G = 900, CX = 760, WX = 860;
  const c = camAt(a, [[0, 780, 640, 1.2], [1.9, 780, 640, 1.22], [3.0, 860, 560, 0.95], [5.71, 860, 545, 0.99]]);
  const sweep = seg(a, 1.5, 2.1), sx = -900 * easeIn(sweep), sy = 300 * easeIn(sweep), rock = 3 * Math.sin(tot * 2);
  const cart = at(CX + sx, G + sy, `${[-90, 90].map((x) => `<circle cx="${x}" cy="-26" r="30" fill="${P.ink}"/><circle cx="${x}" cy="-26" r="11" fill="${P.steel}"/>`).join("")}${nugget(-60, -150, 50)}${nugget(10, -170, 60)}${nugget(80, -150, 46)}${two("M-170 -190H170L140 -50H-140Z", "#8a5a3a", "#6a4028", 0, 10)}<path d="M-170 -190H170" stroke="${P.steelD}" stroke-width="14"/>`, 1, rock - 30 * sweep);
  const axe = at(CX + 300 + sx * 1.2, G + sy, `<path d="M-40 0L120 -300" stroke="#b98a3e" stroke-width="22" stroke-linecap="round"/><path d="M20 -330Q130 -360 210 -250Q130 -300 70 -290Z" fill="${P.steel}"/><path d="M20 -330Q0 -300 60 -280" fill="${P.steel}"/>`, 1, -10 - 60 * sweep);
  const no = a > 1.3 && a < 2.2 ? cross(CX + 120, G - 380, 90, P.red, a - 1.3) : "";
  const tracks = `<path d="M-600 ${G + 4}H${CX + 500}" stroke="${P.woodD}" stroke-width="12" opacity="${(1 - sweep).toFixed(2)}"/>`;
  const up = ease(seg(a, 2.15, 2.95)), wh = up > 0 ? at(WX, G + (1 - up) * 520, warehouse(1180, { h: 330, t: tot, spin: tot * 7, heat: seg(a, 4.4, 5.1) })) : "";
  const g = night(c, tot, 25) + far(c, G, 61) + layer(ground(G) + tracks + wh + cart + axe + no, c);
  return { g, in: toScreen(c, CX + 10, G - 190), inC: P.gold, inZ: 18, out: toScreen(c, WX - 5, G - 160), outC: "#2b2260", outZ: 22 };
}

// ---- 5: proof of work ----
function s5(a, tot) {
  const G = 920, RX = 1340, PY = [1720, G], CERT = [980, 470];
  const c = camAt(a, [[0, 1300, 600, 1.08], [1.0, 1110, 545, 1.0], [6.75, 1100, 535, 1.04]]);
  const mover = seg(a, 0.15, 0.7), unroll = ease(seg(a, 0.6, 1.15));
  const cardP = bez([RX, G - 140], [RX - 100, 300], CERT, ease(mover));
  const seal = [CERT[0] + 200, CERT[1] + 120], charge = seg(a, 1.8, 4.3);
  let cert = "";
  if (unroll <= 0) cert = at(cardP[0], cardP[1], card(9, { hex: "0000a", colour: P.green }), lerp(0.8, 1.1, mover));
  else { const w = lerp(240, 600, unroll), h = lerp(120, 420, unroll);
    cert = at(CERT[0], CERT[1], `${two(rr(-w / 2, -h / 2, w, h, 18), P.cream, P.creamD, 0, 8)}<path d="${rr(-w / 2, -h / 2, w, 22, 11)}" fill="${P.green}"/>${unroll > 0.7 ? at(-150, 40, whorl(80, 9, P.green)) + text(0, -110, "PROOF OF WORK", 60, P.ink) + `<path d="M-60 40h220M-60 90h160" stroke="#dccaa0" stroke-width="10" stroke-linecap="round"/>` + text(50, 22, "0000a…", 44, P.ink, { anchor: "start" }) : ""}`)
      + (unroll > 0.7 ? at(seal[0], seal[1], rings(0, 0, 60 + 40 * charge, P.gold, 0.15 + 0.25 * charge * (0.7 + 0.3 * Math.sin(tot * 10))) + `<path d="M-30 30L-44 110L0 86L44 110L30 30Z" fill="${P.red}"/>` + disc(0, 0, 58, P.gold, P.goldD) + bolt(P.cream, 0.6)) : ""); }
  // the power: from the pylon along a wire to the seal, bolts running along it
  const wire = `M${PY[0] - 120} ${PY[1] - 470}Q${PY[0] - 250} ${CERT[1] + 260} ${seal[0] + 50} ${seal[1]}`;
  let run = a > 1.7 ? drawn(wire, seg(a, 1.7, 2.2), P.steel, 8) : "";
  if (a > 2.2 && a < 4.6) for (let k = 0; k < 3; k++) { const u = ((a - 2.2) * 0.9 + k / 3) % 1, b = bez([PY[0] - 120, PY[1] - 470], [PY[0] - 250, CERT[1] + 260], [seal[0] + 50, seal[1]], u); run += at(b[0], b[1], rings(0, 0, 30, P.gold, 0.3) + bolt(P.gold, 0.55)); }
  const pyl = at(PY[0], PY[1], pylon(), 0.95);
  const rg = at(RX, G, rig({ spin: tot * 9 }), 1.4);
  // the forger: a pen scribbles a copy, which catches fire and burns away
  const fp = seg(a, 4.95, 5.45), burn = seg(a, 5.5, 6.3), FX = [470, 300];
  const copy = fp > 0 && burn < 1 ? at(FX[0], FX[1], `${two(rr(-150, -105, 300, 210, 14), mix(P.cream, "#ff9a5a", burn), mix(P.creamD, P.redD, burn), 0, 6)}${burn < 0.3 ? at(-60, 0, whorl(60, 9, "#999999")) : ""}${drawn("M0 -40q30 -30 60 0t60 0M0 20q30 -30 60 0t40 0", fp, P.ink, 8)}${burn > 0 ? [-80, -20, 40, 100].map((x, i) => `<path d="M${x - 26} 105Q${x} ${100 - 120 * burn - 20 * Math.sin(tot * 12 + i)} ${x + 26} 105Z" fill="${i % 2 ? P.red : P.gold}"/>`).join("") : ""}`, 1.1 * (1 - 0.6 * burn)) : "";
  const pen = fp > 0 && fp < 1 ? at(FX[0] - 0 + 200 * fp, FX[1] - 40 + 30 * Math.sin(fp * 20), `<path d="M0 0L-16 -20L60 -110L76 -90Z" fill="${P.violet}"/><path d="M0 0L-16 -20L-10 6Z" fill="${P.ink}"/>`) : "";
  const no = a > 5.6 ? cross(FX[0] + 220, FX[1] - 150, 50, P.red, a - 5.6) : "";
  const g = night(c, tot, 29) + far(c, G, 71) + layer(ground(G) + pyl + run + rg + cert + copy + pen + no, c);
  return { g, in: toScreen(c, RX, G - 90), inC: "#43398f", inZ: 18, out: toScreen(c, CERT[0] - 60, CERT[1]), outC: P.cream, outZ: 18 };
}

// ---- 6: the difficulty moves by itself ----
function s6(a, tot) {
  const G = 940, TB = [850, 300], KN = [1290, 300], CK = [1480, 640];
  const c = camAt(a, [[0, 1000, 560, 1.0], [6.06, 1010, 550, 1.03]]);
  let rigs = ""; for (let i = 0; i < 6; i++) { const t0 = 0.15 + i * 0.1, u = easeOut(seg(a, t0, t0 + 0.5)); rigs += at(lerp(-300, 560 + i * 200, u), G, rig({ spin: tot * 8 + i, blink: tot + i }), 0.85, u < 1 ? -4 : 0); }
  const grow = ease(seg(a, 2.1, 2.9)), n = grow > 0.5 ? 6 : 4;
  const lit = Array.from({ length: n }, (_, i) => (i < 4 ? 1 : seg(a, 2.4 + (i - 4) * 0.2, 2.7 + (i - 4) * 0.2)));
  const tb = at(TB[0], TB[1], (grow > 0 && grow < 1 ? rings(0, 0, 360, P.gold, 0.2) : "") + target(n, lit), n === 6 ? 0.8 : 0.95 - 0.1 * grow);
  const knob = at(KN[0], KN[1], `${disc(0, 0, 70, P.steel, P.steelD)}<g transform="rotate(${(-60 + 120 * grow + 4 * Math.sin(tot * 2)).toFixed(1)})"><path d="M-10 -66h20v40h-20Z" fill="${P.red}"/></g>${Array.from({ length: 7 }, (_, i) => { const an = (-150 + i * 20) * Math.PI / 180 - Math.PI / 2 + 1.05; return `<circle cx="${(Math.cos(an) * 92).toFixed(1)}" cy="${(Math.sin(an) * 92).toFixed(1)}" r="6" fill="${P.cream}"/>`; }).join("")}`, 0.9);
  const cal = a > 2.45 ? at(KN[0] + 190, KN[1] + 20, calPage("14"), 0.62 * pop(a - 2.45)) : "";
  // the clock: steady, then racing, then back to ten minutes a page
  const m = a < 1.4 ? 1.2 * a : a < 2.1 ? 1.7 + 230 * ease(seg(a, 1.4, 2.1)) : a < 4.0 ? 231.7 + 6 * seg(a, 2.1, 4.0) : 0;
  const shown = a < 4.0 ? m % 60 : 10 * ease(seg(a, 4.1, 5.8));
  const ck = at(CK[0], CK[1], (a > 1.4 && a < 2.1 ? rings(0, 0, 200, P.red, 0.2) : a > 5.6 ? rings(0, 0, 200, P.green, 0.18) : "") + clock(shown, 170, { sweep: a > 4.0 ? P.gold : P.red }), 1);
  const pages = a > 1.4 && a < 2.3 ? [0, 1, 2, 3].map((i) => { const u = ((a - 1.4) * 3 + i / 4) % 1; return at(CK[0] - 360 - 300 * u, CK[1] - 160 - 60 * u, page({ rows: [["blue", "pink", ""]] }), 0.22 * (1 - u)); }).join("") : "";
  const g = night(c, tot, 33) + far(c, G, 15) + layer(ground(G) + rigs + tb + knob + cal + pages + ck, c);
  return { g, in: toScreen(c, CK[0], CK[1]), inC: P.cream, inZ: 18, out: toScreen(c, CK[0], CK[1]), outC: P.cream, outZ: 18 };
}

// ---- 7: from a laptop at home to warehouses as big as stadiums ----
function stadium(w, t) { const h = w * 0.42;
  return `${[-0.45, 0.45].map((f) => `<path d="M${w * f - 8} ${-h - 240}h16V0h-16Z" fill="${P.steelD}"/>${two(rr(w * f - 70, -h - 300, 140, 70, 10), "#fff3c2", P.goldD, 0, 8)}<path d="M${w * f - 70} ${-h - 230}L${w * f - 260} ${-h + 60}L${w * f + 260} ${-h + 60}L${w * f + 70} ${-h - 230}Z" fill="#fff3c2" opacity="${(0.06 + 0.02 * Math.sin(t * 2)).toFixed(3)}"/>`).join("")}
    <path d="M${-w / 2} 0V${-h * 0.55}Q0 ${-h * 1.25} ${w / 2} ${-h * 0.55}V0Z" fill="#6a40bd"/><ellipse cx="0" cy="${-h * 0.55}" rx="${w / 2}" ry="${h * 0.42}" fill="#8a5be0"/><ellipse cx="0" cy="${-h * 0.53}" rx="${w * 0.36}" ry="${h * 0.26}" fill="${P.green}"/><ellipse cx="0" cy="${-h * 0.53}" rx="${w * 0.08}" ry="${h * 0.06}" fill="none" stroke="#fff" stroke-width="8"/><path d="M0 ${-h * 0.79}V${-h * 0.27}" stroke="#fff" stroke-width="8"/>`; }
function s7(a, tot) {
  const G = 900, HX = 1100, CAL = [HX - 150, G - 270], LAP = [HX + 40, G - 140];
  const c = camAt(a, [[0, HX, G - 190, 1.6], [3.4, HX - 10, G - 185, 1.63], [5.6, -700, 860, 0.42], [6.71, -700, 855, 0.42]]);
  // the house, cut open: a room with a desk, a laptop, the hooded chair, a calendar on the wall
  const room = `${two(rr(-280, -420, 560, 420, 10), P.teal, P.tealD, 16, 0)}${two(`M-320 -416L0 -620L320 -416Z`, "#3a1c71", P.ink, 0, 9)}<circle cx="0" cy="-500" r="34" fill="${P.cream}"/>
    <path d="${rr(-240, -380, 480, 380, 6)}" fill="#7a6ac9"/><path d="${rr(-240, -60, 480, 60)}" fill="#2a1d66"/><path d="${rr(-20, -120, 240, 20, 6)}" fill="${P.wood}"/><path d="M0 -100v100M200 -100v100" stroke="${P.woodD}" stroke-width="14"/>`;
  let coins = ""; [1.0, 2.15].forEach((t0, i) => { const u = a - t0; if (u <= 0) return; const p = seg(u, 0, 0.6), y = -120 - 220 * Math.sin(Math.PI * Math.min(p, 1) * 0.85) ;
    coins += at(LAP[0] - HX + 60 + 90 * i + 20 * p, (p < 1 ? y : -138), coin(22, "B"), 1 + (p >= 1 ? 0.3 * Math.exp(-(u - 0.6) * 8) : 0)); });
  const inside = at(LAP[0] - HX, -120, laptop("#9fe7ff", `<path d="M-90 -150h120M-90 -110h160M-90 -70h90" stroke="#3fa9ff" stroke-width="16" stroke-linecap="round"/>`), 0.55) + at(-130, 0, hoodChair(), 0.5) + at(CAL[0] - HX, -270, calPage("2009"), 0.42) + coins;
  const home = at(HX, G, room + inside);
  const wh = at(0, G, warehouse(1600, { h: 520, t: tot, spin: tot * 6, heat: 1 }));
  const st = at(-1500, G, stadium(1300, tot));
  const g = night(c, tot, 37) + layer(skyline(5, -3600, 3600, G - 20, 60, 200, "#2a1d66"), c, 0.5) + layer(ground(G, "#241455", -4000, 9000) + st + wh + home, c);
  return { g, in: toScreen(c, CAL[0], CAL[1]), inC: P.cream, inZ: 18, out: toScreen(c, HX, G - 500), outC: P.cream, outZ: 40 };
}

// ---- 8: the bill against the prize; then the cheapest power on the planet ----
function s8(a, tot) {
  const G = 920, BX = 740, RX = 1290, SX = [2700, 3200, 3700], SG = 900;
  const c = camAt(a, [[0, 820, 600, 1.0], [3.2, 830, 600, 1.0], [4.6, 3200, 560, 1.0], [8.59, 3205, 555, 1.02]]);
  const tilt = a < 0.8 ? 0.05 * Math.sin(tot * 3) : 0.9 * (1 - Math.exp(-(a - 0.8) * 5) * Math.cos((a - 0.8) * 9));
  const bill = `${two(rr(-90, -170, 180, 170, 10), P.cream, P.creamD, 0, 6)}${at(-30, -110, bolt(P.gold, 0.5))}${text(40, -92, "$", 54, P.redD)}<path d="M-60 -50h120M-60 -26h80" stroke="#dccaa0" stroke-width="8" stroke-linecap="round"/>${text(0, -6, "$$$", 34, P.redD)}`;
  const prize = [0, 1, 2].map((i) => at(-50 + i * 50, -26 - (i === 1 ? 40 : 0), coin(30, "B"))).join("");
  const bal = at(BX, G, balance(tilt, bill, prize), 1.15);
  const off = a > 2.75, rg = at(RX, G, (off ? "" : rings(0, -65, 150, P.green, 0.08)) + rig({ spin: off ? 0.4 : tot * 9, on: off ? 0 : 1 }), 1.3);
  const dark = off ? at(RX, G - 230, `<circle r="40" fill="${P.ink}"/><path d="M-14 -20L14 20M14 -20L-14 20" stroke="${P.red}" stroke-width="10" stroke-linecap="round"/>`, pop(a - 2.75)) : "";
  // the strip of cheap power: a dam, a gas flare, a volcano, each getting a container
  const t = [5.55, 6.3, 7.85];
  const dam = at(SX[0], SG, `<path d="M-260 0V-200H-60V0Z" fill="#2f7fd0"/><path d="M-260 -200Q-160 ${-214 + 6 * Math.sin(tot * 2)} -60 -200" stroke="#7fd0ff" stroke-width="10" fill="none"/>${two("M-60 0L-60 -260L20 -260L120 0Z", "#aab4d4", "#8792bb", 0, 10)}<path d="M120 0Q160 -20 200 0" stroke="#7fd0ff" stroke-width="16" fill="none"/>`);
  const flame = 1 - 0.75 * seg(a, 6.6, 7.1), pipeP = seg(a, 6.6, 7.0);
  const flare = at(SX[1], SG, `<path d="${rr(-24, -360, 48, 360, 8)}" fill="${P.steelD}"/>${[0, 1].map((i) => `<path d="M${-34 + i * 8} -360Q${(0 + 20 * Math.sin(tot * 9 + i)).toFixed(1)} ${(-360 - 200 * flame * (1 - i * 0.4)).toFixed(1)} ${34 - i * 8} -360Z" fill="${i ? P.gold : "#ff7a3a"}"/>`).join("")}${drawn("M24 -40H150", pipeP, P.steel, 22)}`);
  const volc = at(SX[2], SG, `<path d="M-300 0L-80 -330H80L300 0Z" fill="#7a3a6c"/><path d="M-80 -330H80L60 -300H-60Z" fill="${P.red}"/>${rings(0, -340, 90, "#ff7a3a", 0.25 + 0.05 * Math.sin(tot * 4))}<path d="M-30 -310Q-60 -200 -90 -150M30 -310Q50 -230 90 -180" stroke="${P.red}" stroke-width="16" fill="none" stroke-linecap="round"/>`);
  const spots = [[SX[0] + 330, SG], [SX[1] + 300, SG], [SX[2] + 300, SG]];
  let cons = ""; spots.forEach(([x, y], i) => { const u = a - t[i] + 0.55; if (u <= 0) return; const p = seg(u, 0, 0.55), b = bez([x - 700, 140], [x - 200, -60], [x, y], easeIn(p));
    cons += at(b[0], b[1] + (p >= 1 ? -30 * Math.exp(-(u - 0.55) * 6) * Math.abs(Math.cos((u - 0.55) * 12)) : 0), container({ spin: tot * 7, on: 1 }), 0.62); });
  const sites = `<rect x="2100" y="${SG}" width="2200" height="900" fill="#2a1a5a"/>` + dam + flare + volc;
  const g = night(c, tot, 41) + far(c, G, 23) + layer(ground(G, "#241455", -1500, 3600) + bal + rg + dark + sites + cons, c);
  return { g, in: toScreen(c, BX - 391, G - 470), inC: P.cream, inZ: 18, out: toScreen(c, spots[2][0], spots[2][1] - 60), outC: "#d0613a", outZ: 20 };
}

// ---- 9 and 10: China, the ban, the move; and the one that stayed ----
const GL = [960, 610], GRAD = 410, MK = { CHINA: [1185, 610], USA: [720, 520], RUSSIA: [1090, 345] };
const label = (name, c, cD, w) => at(0, 0, pill(name, c, cD, w), 0.9);
function s9(a, tot) {
  const c = camAt(a, [[0, 960, 590, 1.2], [5.7, 960, 585, 1.22], [6.8, 722, 575, 2.9], [7.43, 720, 578, 3.0]]);
  let w = at(GL[0], GL[1], globe(GRAD, 0.3, { night: 0.25 }));
  const lab = [["CHINA", P.red, P.redD, 210], ["USA", P.blue, P.blueD, 150], ["RUSSIA", P.teal, P.tealD, 230]].map(([n, col, colD, wd]) => { const [x, y] = MK[n]; return `<circle cx="${x}" cy="${y}" r="12" fill="${P.cream}"/>` + at(x, y - 110, label(n, col, colD, wd), n === "CHINA" ? 1 : pop(a - 3.3)); }).join("");
  // the containers: a heap on China, then five of them fly off
  const DEST = [[MK.USA, -45, 0], [MK.RUSSIA, -40, 0], [MK.USA, 45, 0], [MK.RUSSIA, 40, 0], [MK.USA, 0, 36]];
  let cons = "";
  for (let i = 0; i < 6; i++) { const home = [MK.CHINA[0] - 74 + (i % 3) * 74, MK.CHINA[1] + 10 - Math.floor(i / 3) * 34];
    if (i === 5) { cons += at(home[0], home[1], container({ spin: tot * 5, on: rnd(Math.floor(tot * 4)) > 0.3 ? 1 : 0 }), 0.19); continue; }
    const t0 = 3.4 + i * 0.28, p = seg(a, t0, t0 + 0.75), d = DEST[i], to = [d[0][0] + d[1], d[0][1] + 40 + d[2]];
    const b = p > 0 ? bez(home, [(home[0] + to[0]) / 2, Math.min(home[1], to[1]) - 260], to, ease(p)) : home;
    cons += at(b[0], b[1], container({ spin: tot * 5 + i, c: "#d0613a" }), 0.19 * (1 + 0.6 * Math.sin(Math.PI * p)), 0); }
  const ban = a > 2.1 ? at(MK.CHINA[0], MK.CHINA[1] - 40, `<circle r="120" fill="none" stroke="${P.red}" stroke-width="22" opacity=".9"/><path d="M-84 -84L84 84" stroke="${P.red}" stroke-width="22" opacity=".9"/>`, pop(a - 2.1)) : "";
  w += lab + cons + ban;
  const cal = a > 1.65 ? at(330, 330, calPage("2021"), 0.75 * pop(a - 1.65)) : "";
  const g = night(c, tot, 45) + layer(w, c) + (a < 5.7 ? cal : "");
  return { g, in: toScreen(c, MK.CHINA[0], MK.CHINA[1] - 50), inC: "#d0613a", inZ: 24, out: toScreen(c, MK.USA[0] - 55, MK.USA[1] + 25), outC: "#d0613a", outZ: 24 };
}
function s10(a, tot) {
  const G = 900, CX = 760, SG = [1260, G];
  const c = camAt(a, [[0, 900, 560, 1.12], [4.29, 920, 550, 1.16]]);
  const lift = ease(seg(a, 1.35, 1.9)), sag = ease(seg(a, 2.75, 3.35));
  const cont = at(CX, G, container({ spin: tot * 8, on: rnd(Math.floor(tot * 5)) > 0.25 ? 1 : 0 }), 1.6);
  const tarp = at(CX, G, `<path d="M-330 -310Q0 -360 330 -310L${360 - 60 * lift} ${-60 - 120 * lift}Q${200 - 40 * lift} ${-40 - 140 * lift} 0 -40Q-200 -40 -360 -60Z" fill="#2f5a3a"/><path d="M-330 -310Q0 -360 330 -310" stroke="#3f7a4e" stroke-width="16" fill="none"/>${[-200, 0, 200].map((x) => `<path d="M${x} -330Q${x + 10} -200 ${x - 10} -60" stroke="#244a2e" stroke-width="8" fill="none"/>`).join("")}`);
  const heat = lift > 0.5 ? [0, 1, 2].map((i) => `<path d="M${CX + 100 + i * 70} ${G - 340}q16 -24 0 -48q-16 -24 0 -48" stroke="#ffb066" stroke-width="7" fill="none" opacity="${(0.4 * (0.6 + 0.4 * Math.sin(tot * 3 + i))).toFixed(2)}"/>`).join("") : "";
  const sign = at(SG[0], SG[1], `<path d="M-8 0V-300h16V0Z" fill="${P.steelD}"/><g transform="translate(0 -300) rotate(${(125 * sag + (sag > 0.9 ? 4 * Math.sin(tot * 3) : 0)).toFixed(1)}) translate(0 -110)"><circle r="110" fill="#fff"/><circle r="110" fill="none" stroke="${P.red}" stroke-width="22"/><path d="M-78 -78L78 78" stroke="${P.red}" stroke-width="22"/></g>`, 1);
  const tag = at(CX, G - 470, label("CHINA", P.red, P.redD, 210), 1.3);
  const g = night(c, tot, 49) + far(c, G, 77) + layer(ground(G) + cont + tarp + heat + sign + tag, c);
  return { g, in: toScreen(c, CX, G - 30), inC: "#d0613a", inZ: 24, out: toScreen(c, CX + 192, G - 136), outC: P.ink, outZ: 26 };
}

// ---- 11: teams, and two of them win about half ----
const HUB = [[300, 330, P.pink, P.pinkD], [640, 300, P.teal, P.tealD], [920, 330, P.violet, P.violetD], [1150, 300, P.gold, P.goldD]];
const RG = Array.from({ length: 21 }, (_, i) => { const x = 140 + (i % 7) * 175 + rnd(i * 3) * 50; return [x, 690 + Math.floor(i / 7) * 130 + rnd(i * 3 + 1) * 30, x < 600 ? 0 : x < 900 ? 1 : x < 1080 ? 2 : 3]; });
function s11(a, tot) {
  const PIE = [1520, 470], R = 250;
  const c = camAt(a, [[0, 900, 560, 1.02], [5.33, 920, 550, 1.0]]);
  let lines = "", rigs = "";
  RG.forEach(([x, y, tm], i) => { const h = HUB[tm], p = seg(a, 0.8 + i * 0.04, 1.3 + i * 0.04);
    lines += drawn(`M${x} ${y - 50}L${h[0]} ${h[1]}`, p, h[2], 4, 'opacity=".7"');
    rigs += at(x, y, rig({ spin: tot * 8 + i, blink: tot + i }), 0.5); });
  const hubs = HUB.map(([x, y, col, colD], i) => at(x, y, rings(0, 0, 60, col, 0.2 * seg(a, 1.6, 2.1)) + disc(0, 0, 52, col, colD) + coin(26, "B"), pop(a - 0.6 - i * 0.1))).join("");
  // the pie of contests won: 30% + 19% + the rest in small slices
  const SL = [[0.30, P.pink], [0.19, P.teal], [0.12, P.violet], [0.09, P.gold], [0.08, "#9fb0ff"], [0.07, "#7a6ac9"], [0.06, "#5a6aa8"], [0.05, "#8792bb"], [0.04, "#6a5aa8"]];
  let pie = "", acc = 0; const grow = ease(seg(a, 2.95, 4.0));
  SL.forEach(([f, col], i) => { const a0 = -Math.PI / 2 + acc * 2 * Math.PI * grow, a1 = -Math.PI / 2 + (acc + f) * 2 * Math.PI * grow; acc += f; if (grow <= 0) return;
    const big = i < 2, off = big ? 18 * seg(a, 4.0, 4.4) : 0, mid = (a0 + a1) / 2, ox = Math.cos(mid) * off, oy = Math.sin(mid) * off, rr_ = big ? R : R * 0.92;
    pie += `<path d="M${ox.toFixed(1)} ${oy.toFixed(1)}L${(ox + Math.cos(a0) * rr_).toFixed(1)} ${(oy + Math.sin(a0) * rr_).toFixed(1)}A${rr_} ${rr_} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${(ox + Math.cos(a1) * rr_).toFixed(1)} ${(oy + Math.sin(a1) * rr_).toFixed(1)}Z" fill="${col}" stroke="#1a1240" stroke-width="5"/>`; });
  const half = a > 4.2 ? at(PIE[0] + 10, PIE[1] - R - 90, `${two(rr(-150, -50, 300, 100, 50), P.cream, P.creamD, 0, 6)}${text(0, 26, "≈ 50%", 72, P.ink)}`, pop(a - 4.2)) + drawn(`M${PIE[0] + R + 30} ${PIE[1]}A${R + 30} ${R + 30} 0 0 0 ${PIE[0]} ${PIE[1] - R - 30}`, seg(a, 4.1, 4.5), P.cream, 8, 'opacity=".0"') : "";
  const g = night(c, tot, 53) + layer(`<rect x="-500" y="600" width="3000" height="1000" fill="#241455"/>` + lines + rigs + hubs + at(PIE[0], PIE[1], pie) + half, c);
  const r0 = RG[9];
  return { g, in: toScreen(c, r0[0] - 50 * 0.5, r0[1] - 65 * 0.5), inC: P.ink, inZ: 30, out: toScreen(c, PIE[0] + R * 0.6 * Math.cos(-Math.PI / 2 + 0.3 * Math.PI), PIE[1] + R * 0.6 * Math.sin(-Math.PI / 2 + 0.3 * Math.PI)), outC: P.pink, outZ: 18 };
}

// ---- 12: a network without a manager, but with giants ----
const ND = Array.from({ length: 46 }, (_, i) => [260 + rnd(i * 7 + 1) * 1400, 170 + rnd(i * 7 + 2) * 760, rnd(i * 7 + 3)]).filter(([x, y]) => y < 800 && !(x < 470 && y > 460) && Math.hypot(x - 820, y - 430) > 150 && Math.hypot(x - 1200, y - 560) > 150);
const NN = ND.map((d, i) => ND.map((e, j) => [j, Math.hypot(d[0] - e[0], d[1] - e[1])]).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 3).map(([j]) => j));
const BIG = [[820, 430, P.pink, P.pinkD], [1200, 560, P.teal, P.tealD]];
function s12(a, tot) {
  const c = camAt(a, [[0, 980, 470, 1.22], [3.91, 980, 470, 1.14]]);
  const sh = (i) => (a > 2.0 ? 4 * Math.sin(tot * 40 + i * 2) * seg(a, 2.0, 2.3) : 0);
  let net = "", dots = "", drops = "";
  ND.forEach((d, i) => NN[i].forEach((j) => { if (j < i) return; const e = ND[j]; net += `<path d="M${d[0]} ${d[1]}L${e[0]} ${e[1]}" stroke="#9fe7ff" stroke-width="2.5" opacity=".35"/>`; }));
  BIG.forEach(([x, y], k) => ND.forEach((d, i) => { if (Math.hypot(d[0] - x, d[1] - y) < 380) net += `<path d="M${d[0]} ${d[1]}L${x} ${y}" stroke="${BIG[k][2]}" stroke-width="3" opacity="${(0.45 * seg(a, 1.0, 1.5)).toFixed(2)}"/>`; }));
  ND.forEach((d, i) => { const x = d[0] + sh(i); dots += `<circle cx="${x.toFixed(1)}" cy="${d[1]}" r="17" fill="#9fe7ff"/><circle cx="${(x - 5).toFixed(1)}" cy="${d[1] - 3}" r="3" fill="${P.ink}"/><circle cx="${(x + 5).toFixed(1)}" cy="${d[1] - 3}" r="3" fill="${P.ink}"/>`;
    if (a > 2.2 && i % 3 === 0) { const u = ((a - 2.2) * 1.4 + d[2]) % 1; drops += `<path d="M${x + 20} ${d[1] - 14 + 26 * u}q-7 10 0 14q7 -4 0 -14Z" fill="#7fd0ff" opacity="${(1 - u).toFixed(2)}"/>`; } });
  const bigs = BIG.map(([x, y, col, colD], k) => { const s = 17 + 105 * spring(a - 1.0 - k * 0.12, 7, 12) * (a > 1.0 ? 1 : 0); return rings(x, y, s * 1.2, col, 0.2) + disc(x, y, s, col, colD) + (s > 40 ? at(x, y, coin(s * 0.45, "B")) : ""); }).join("");
  const g = night(c, tot, 57) + layer(net + dots + drops + bigs, c);
  const o = ND[5];
  return { g, in: toScreen(c, BIG[0][0], BIG[0][1]), inC: P.pink, inZ: 30, out: toScreen(c, o[0], o[1]), outC: "#9fe7ff", outZ: 40 };
}

// ---- 13: the judges nobody pays ----
function s13(a, tot) {
  const LY = 800, LX = [700, 1058, 1416, 1774], CY = 330, SP = 358;
  const c = camAt(a, [[0, 1074, 580, 1.1], [7.14, 1080, 575, 1.12]]);
  // pages pass along a line above the laptops, left to right
  const off = (a * 150) % SP; let pages = `<path d="M-200 ${CY + 120}H2400" stroke="${P.steelD}" stroke-width="10"/>`;
  for (let k = -1; k < 8; k++) { const x = -100 + k * SP + off; pages += at(x, CY, page({ rows: [["blue", "pink", ""], ["teal", "violet", ""], ["pink", "gold", ""]], prev: 60 + k, seal: 61 + k, block: 1 }), 0.5); if (k > -1) pages += link(x - SP + 70, CY, x - 70, CY, P.gold, 1, 0.7); }
  let laps = "";
  LX.forEach((x, i) => { const scan = a > 2.5 + i * 0.12 && a < 4.7, dd = ((x - (-100 + off)) % SP + SP) % SP, near = Math.min(dd, SP - dd) < 80;
    const ok = scan && near, gav = a - 4.95 - i * 0.1;
    const lens = a > 2.5 + i * 0.12 ? at(x - 60, CY + 200, `<path d="M16 34L60 100" stroke="${P.wood}" stroke-width="18" stroke-linecap="round"/><circle r="56" fill="#cfe9ff" opacity="${ok ? 0.5 : 0.25}" stroke="${P.steel}" stroke-width="14"/>`, pop(a - 2.5 - i * 0.12), -20) : "";
    const gv = gav > 0 ? at(x + 70, LY - 250, `<path d="M0 0L90 -90" stroke="${P.woodD}" stroke-width="16" stroke-linecap="round"/><path d="${rr(50, -150, 110, 56, 12)}" fill="${P.wood}" transform="rotate(45 105 -122)"/><path d="${rr(-60, 10, 120, 24, 8)}" fill="${P.woodD}"/>`, 0.8 * pop(gav), -10 + 25 * Math.exp(-gav * 6) * Math.sin(gav * 20)) : "";
    laps += at(x, LY, (ok ? rings(0, -110, 150, P.green, 0.18) : "") + laptop(ok ? "#c9ffe0" : "#9fe7ff", at(0, -110, book(rows("70", "80")), 0.62)), 0.9) + lens + gv + (ok ? check(x, LY - 100, 36, P.green, 0.5) : ""); });
  const env = a > 5.95 ? at(1560, 160, `${two(rr(-150, -90, 300, 180, 14), P.cream, P.creamD, 0, 7)}<path d="M-150 -90L0 10L150 -90" fill="none" stroke="${P.creamD}" stroke-width="8"/>${text(0, 70, "$0", 70, P.redD)}`, 0.8 * pop(a - 5.95), -6) : "";
  const g = night(c, tot, 61) + layer(`<rect x="-400" y="${LY}" width="3000" height="40" fill="#3a2a7a"/><rect x="-400" y="${LY + 40}" width="3000" height="900" fill="#241455"/>` + pages + laps + env, c);
  return { g, in: toScreen(c, LX[1], LY - 99 - 50), inC: "#9fe7ff", inZ: 30 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13];
export const c2mineSet = makeSet(SHOTS, V, P);
