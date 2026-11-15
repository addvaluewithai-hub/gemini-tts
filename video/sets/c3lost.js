// Crypto part 3, "lost": sixteen wordless shots, one per board beat (shot list: episodes/techforbadguys/explain-crypto-03-world/shots.md).
//   0 2013: a hard drive is thrown out of a window into a bin            1 inside it a gold key; ≈ 8,000 coins
//   2 a landfill, a shovel digging for years; a ¼ offer to the council; a gavel says no
//   3 AUG 2025: the shovel is laid down, a white flag on the heap
//   4 a locked flash drive, 7,002 coins                                   5 a thought bubble: **** turns to ????
//   6 ten attempt dots; eight turn red one by one                          7 3–4 million coins sink and go dark
//   8 no thief: the mask is crossed out; a thought bubble pops            9 a key on an empty chair goes grey; its row in the book stays grey
//  10 a dark van passes a house with drawn curtains; a hush sign, a ? on the door
//  11 JUL 2026: a cold wallet cracks                                       12 keys come out of it and a die matches each one
//  13 cold wallets, unplugged, drain into a dark sack: $100,000,000+
//  14 the left path: an exchange tower, easy ✓, then the ground cracks and it falls
//  15 the right path: your own box, an ice beam bounces off; a little flower of memory wilts, ?
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3lost.v.js";
import { house, stars, skyline, book, LINES } from "./bank.js";
import { calPage } from "./props.js";
import { P, mix, coin, key, drive, flash, dump, coldBox, tower, gavel, heart } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x1 = 2800) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f", x0 = -1500, x1 = 4500) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="1200" fill="${fill}"/>`;
const tag = (label, w = 300) => `${two(rr(-w / 2, -34, w, 68, 14), P.cream, P.creamD, 0, 6)}${text(0, 14, label, 40, P.ink)}`;
const cal = (big, small, a, size = 150) => calPage(big, small, 1, size);
const bubble = (inner, w = 380, h = 170) => `<circle cx="${-w * 0.42}" cy="${h * 0.62}" r="16" fill="#eef0ff"/><circle cx="${-w * 0.52}" cy="${h * 0.8}" r="9" fill="#eef0ff"/>${two(rr(-w / 2, -h / 2, w, h, h / 2), "#eef0ff", "#c9cdf0", 0, 8)}${inner}`;
const bin = (lid = 0) => `${two("M-110 -260H110L90 0H-90Z", "#3d7a5a", "#2e5a4a", 0, 10)}${[-50, 0, 50].map((x) => `<path d="M${x} -230v200" stroke="#2e5a4a" stroke-width="12"/>`).join("")}<g transform="translate(-120 -270) rotate(${(-75 * (1 - ease(lid))).toFixed(1)})">${two(rr(0, -20, 240, 30, 10), "#4a8f6a", "#2e5a4a", 0, 6)}</g>`;
const shovel = (rot = 0) => at(0, 0, `<path d="M0 0L0 -330" stroke="${P.wood}" stroke-width="18" stroke-linecap="round"/><path d="M-30 -330h60" stroke="${P.woodD}" stroke-width="16" stroke-linecap="round"/>${two("M-50 0H50L40 90Q0 130 -40 90Z", P.steel, P.steelD, 0, 8)}`, 1, rot);
const flag = (up = 1) => `<path d="M0 0V${-220 * up}" stroke="${P.cream}" stroke-width="10"/>${up > 0.6 ? `<path d="M0 ${-220 * up}h${110 * seg(up, 0.6, 1)}q-14 30 0 60h${-110 * seg(up, 0.6, 1)}Z" fill="#fff"/>` : ""}`;

// ---- 0: 2013, the drive goes in the bin ----
function s0(a, tot) {
  const G = 860, HX = 700, BX = 1240;
  const c = camAt(a, [[0, 940, 640, 1.45], [3.84, 1020, 650, 1.6]]);
  const fly = seg(a, 1.7, 2.35), dp = fly < 1 ? bez([HX + 60, G - 240], [ (HX + BX) / 2 + 40, G - 620], [BX, G - 280], ease(fly)) : [BX, G - 280];
  const d = a > 1.6 && fly < 1 ? at(dp[0], dp[1], drive(), 0.85, 360 * fly) : "";
  const lid = seg(a, 2.35, 2.6);
  const g = night(c, tot, 13) + layer(skyline(21, -600, 2700, G - 40, 120, 320, "#2a1d66", "#ffb066"), c, 0.5)
    + layer(ground(G) + at(HX, G, house(P.teal, P.tealD, { lit: [1, a > 1.5 ? 1 : 0, 1] }), 1.3) + at(BX, G, bin(lid), 1.0) + d
      + at(HX + 40, G - 420, tag("James Howells", 360), pop(a - 0.5))
      + (a > 2.6 ? at(1440, G - 330, cal("2013", "", a), 0.7 * pop(a - 2.6), 6) : ""), c);
  return { g, out: toScreen(c, BX, G - 130), outC: "#2e5a4a", outZ: 20 };
}
// ---- 1: inside: a gold key, ≈ 8,000 coins ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [2.88, 960, 520, 1.1]]);
  const n = Math.round(8000 * ease(seg(a, 0.85, 2.3))), glow = seg(a, 0.2, 0.6);
  let coins = ""; const k = Math.round(26 * ease(seg(a, 0.85, 2.3)));
  for (let i = 0; i < k; i++) { const x = 1280 + (i % 7) * 70 - 210 + (Math.floor(i / 7) % 2) * 35, y = 760 - Math.floor(i / 7) * 52; coins += at(x, y, coin(34, "B"), pop(a - 0.85 - i * 0.05)); }
  const g = `<rect width="${FW}" height="${FH}" fill="#14102f"/>` + layer(rings(620, 560, 300, P.gold, 0.12 * glow) + at(620, 600, drive({ glow }), 2.2)
    + at(470, 360, key({ digits: 8, unroll: 0.7 }), 0.9 * pop(a - 0.45)) + coins
    + (a > 0.85 ? at(1280, 330, text(0, 0, "≈ " + n.toLocaleString("en"), 120, P.gold), pop(a - 0.85)) : ""), c);
  return { g, in: [960, 540], inC: "#2e5a4a", inZ: 20 };
}
// ---- 2: years of digging; the council says no ----
function s2(a, tot) {
  const G = 900, DX = 700, CX = 1560;
  const c = camAt(a, [[0, 820, 640, 1.3], [2.5, 860, 640, 1.3], [3.3, 1260, 620, 1.25], [5.46, 1300, 620, 1.28]]);
  const dig = a < 2.6 ? Math.sin(a * 9) : 0, yr = 2013 + Math.round(11 * ease(seg(a, 0.4, 2.4)));
  const sh = at(DX + 160, G - 300 + 30 * Math.max(0, dig), shovel(-25 + 25 * dig));
  const dirt = a < 2.6 ? [0, 1, 2].map((i) => { const u = (a * 1.6 + i / 3) % 1; return `<circle cx="${DX + 230 + 120 * u}" cy="${G - 360 - 160 * Math.sin(Math.PI * u)}" r="${14 - 4 * i}" fill="#5a3a6a"/>`; }).join("") : "";
  const council = `${two(rr(-200, -360, 400, 360, 10), P.stone, P.stoneD, 0, 10)}${two("M-230 -350L0 -470L230 -350Z", P.cream, P.creamD, 0, 8)}${[-120, -40, 40, 120].map((x) => `<rect x="${x - 14}" y="-330" width="28" height="240" fill="${P.creamD}"/>`).join("")}<path d="M-50 0V-120H50V0Z" fill="${P.ink}"/>`;
  const env = a > 2.8 && a < 3.9 ? at(...bez([DX + 200, G - 420], [1180, G - 700], [CX, G - 120], ease(seg(a, 2.8, 3.8))), `${two(rr(-60, -40, 120, 80, 8), P.cream, P.creamD, 0, 5)}${text(0, 20, "¼", 56, P.goldD)}`, 1) : "";
  const offer = a > 3.6 ? at(CX + 260, G - 300, `${two(circ(0, 0, 70), P.gold, P.goldD)}${text(0, 26, "¼", 80, "#8a5200")}`, pop(a - 3.6)) : "";
  const g = night(c, tot, 29) + layer(skyline(5, -600, 2700, G - 60, 100, 260, "#2a1d66"), c, 0.5)
    + layer(ground(G, "#2a1f5a") + at(DX, G, dump(1300, { seed: 4 })) + sh + dirt + at(CX, G, council) + env + offer
      + at(DX - 380, G - 560, cal(String(yr), "", a), 0.75, -5)
      + (a > 4.3 ? at(CX - 60, G - 420, gavel(seg(a, 4.3, 4.6)), 0.9) + cross(CX + 170, G - 560, 54, P.red, a - 4.62) : ""), c);
  return { g };
}
// ---- 3: AUG 2025: he gives up ----
function s3(a, tot) {
  const G = 900, DX = 860;
  const c = camAt(a, [[0, 960, 640, 1.3], [2.0, 960, 650, 1.4], [7.66, 960, 650, 1.42]]);
  const lay = ease(seg(a, 0.9, 1.4)), up = ease(seg(a, 1.3, 2.0));
  const sh = at(DX + 220 + 120 * lay, G - 300 + 260 * lay, shovel(-25 - 65 * lay));
  const g = night(c, tot, 31) + layer(skyline(5, -600, 2700, G - 60, 100, 260, "#2a1d66"), c, 0.5)
    + layer(ground(G, "#2a1f5a") + at(DX, G, dump(1300, { seed: 4 })) + sh + at(DX, G - 290, flag(up), 1.2)
      + at(1360, G - 520, cal("2025", "AUG", a), 0.8 * pop(a - 0.2), 5), c);
  return { g, in: [960, 540], inC: "#2a1f5a", inZ: 16 };
}
// ---- 4: Stefan Thomas: an encrypted flash drive, 7,002 coins ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 580, 1.25], [4.8, 960, 570, 1.35]]);
  const n = Math.round(7002 * ease(seg(a, 2.3, 3.3)));
  let coins = ""; const k = Math.round(22 * ease(seg(a, 2.3, 3.3)));
  for (let i = 0; i < k; i++) coins += at(1320 + (i % 6) * 66 - 165 + (Math.floor(i / 6) % 2) * 33, 850 - Math.floor(i / 6) * 50, coin(32, "B"), pop(a - 2.3 - i * 0.03));
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(41, 70, -400, 2400, 1080, tot), c, 0.15)
    + layer(rings(620, 600, 260, P.violet, 0.15) + at(620, 600, flash({ lock: 1, dots: 0 }), 1.8 * pop(a - 0.05)) + at(620, 330, tag("Stefan Thomas", 380), pop(a - 0.68)) + coins
      + (a > 2.3 ? at(1320, 470, text(0, 0, n.toLocaleString("en"), 140, P.gold), pop(a - 2.3)) : ""), c);
  return { g };
}
// ---- 5: forgot the password ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 570, 1.35], [0.94, 960, 570, 1.4]]);
  const f = seg(a, 0.25, 0.65), txt = f < 0.5 ? "****" : "????";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(41, 70, -400, 2400, 1080, tot), c, 0.15)
    + layer(at(620, 600, flash({ lock: 1, dots: 0 }), 1.8) + at(1180, 470, bubble(text(0, 40, txt, 130, f < 0.5 ? P.ink : P.red)), 1.3 * pop(a)), c);
  return { g };
}
// ---- 6: ten tries, eight used ----
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [1.4, 960, 560, 1.2], [6.37, 960, 560, 1.24]]);
  const shown = Math.min(10, Math.floor(seg(a, 0.75, 1.35) * 10 + (a > 0.75 ? 1 : 0)));
  const used = Math.min(8, Math.max(0, Math.floor((a - 3.15) / 0.06)));
  const shake = used > 0 && used < 8 ? 6 * Math.sin(a * 60) : 0;
  const wipe = a > 1.9 ? at(1420, 330, `${two(rr(-80, -60, 160, 150, 14), P.steel, P.steelD, 0, 8)}<path d="${rr(-100, -84, 200, 26, 10)}" fill="${P.steelD}"/>${[-40, 0, 40].map((x) => `<path d="M${x} -30v90" stroke="${P.steelD}" stroke-width="10"/>`).join("")}`, 0.9 * pop(a - 1.9)) + (a > 2.4 ? `<path d="M1260 400L1340 360" stroke="${P.red}" stroke-width="8" stroke-dasharray="14 10" opacity="${(0.7 * seg(a, 2.4, 2.7)).toFixed(2)}"/>` : "") : "";
  const dots = Array.from({ length: shown }, (_, i) => at(-40 + i * 19, 0, `<circle r="9" fill="${i < used ? P.red : "#fff3c2"}"/>${i >= 8 && a > 4.2 ? `<circle r="${12 + 3 * Math.sin(tot * 6)}" fill="none" stroke="${P.gold}" stroke-width="3"/>` : ""}`, i < used && a - 3.15 - i * 0.06 < 0.25 ? 1.5 : 1)).join("");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(41, 70, -400, 2400, 1080, tot), c, 0.15)
    + layer(at(900 + shake, 600, flash({ lock: 1, dots: 0 }) + dots, 2.2) + wipe, c);
  return { g, out: toScreen(c, 900 + 8 * 2.2 * 19, 600), outC: P.red, outZ: 18 };
}
// ---- 7: 3–4 million coins sink and go dark ----
function s7(a, tot) {
  const G = 760;
  const c = camAt(a, [[0, 960, 520, 1.0], [4.22, 960, 560, 0.94]]);
  let coins = "";
  for (let i = 0; i < 80; i++) { const x = 140 + (i % 16) * 106 + (Math.floor(i / 16) % 2) * 50, y = G - 20 + Math.floor(i / 16) * 52, t0 = 2.6 + rnd(i * 3) * 1.2, sink = ease(seg(a, t0, t0 + 0.5)), dark = seg(a, t0, t0 + 0.6);
    coins += `<ellipse cx="${x}" cy="${y + 40 * sink}" rx="${44 * (1 - 0.4 * sink)}" ry="${16 * (1 - 0.5 * sink)}" fill="${mix(P.gold, "#2a1f5a", dark)}" opacity="${(1 - 0.7 * sink).toFixed(2)}"/>`; }
  const lbl = a > 0.9 ? at(960, 300, text(0, 0, "3,000,000 – 4,000,000", 120, mix(P.gold, "#8a7ab0", seg(a, 3.0, 4.0))), pop(a - 0.9)) : "";
  const g = night(c, tot, 17) + layer(ground(G - 40, "#2a1f5a") + coins + lbl, c);
  return { g };
}
// ---- 8: nobody stole them; they forgot ----
function s8(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [2.14, 960, 540, 1.06]]);
  const mask = `<path d="M-130 -14Q-120 -50 -60 -40Q0 -30 0 -10Q0 -30 60 -40Q120 -50 130 -14Q120 34 60 30Q16 26 0 6Q-16 26 -60 30Q-120 34 -130 -14Z" fill="${P.ink}"/>${[-63, 63].map((ex) => `<ellipse cx="${ex}" cy="-6" rx="26" ry="18" fill="#3a2a7a"/>`).join("")}`;
  const popB = seg(a, 1.5, 1.75);
  const bub = popB < 1 ? at(1300, 480, bubble(at(0, 0, key({ digits: 4, unroll: 0.5 }), 0.5) , 380, 170), 2 * (1 + 0.25 * popB) * pop(a - 0.6), 0, `opacity="${(1 - popB).toFixed(2)}"`) : "";
  const burst = popB > 0 && popB < 1 ? Array.from({ length: 8 }, (_, i) => `<circle cx="${(1300 + Math.cos(i * 0.785) * 260 * popB).toFixed(0)}" cy="${(480 + Math.sin(i * 0.785) * 160 * popB).toFixed(0)}" r="${20 * (1 - popB)}" fill="#eef0ff"/>`).join("") : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(43, 70, -400, 2400, 1080, tot), c, 0.15)
    + layer(at(620, 560, mask, 3.0 * pop(a)) + cross(620, 330, 80, P.red, a - 0.3) + bub + burst, c);
  return { g };
}
// ---- 9: the owner is gone; the key goes grey; the row stays ----
function s9(a, tot) {
  const G = 860;
  const c = camAt(a, [[0, 1150, 620, 1.45], [4.92, 1200, 600, 1.5]]);
  const off = seg(a, 0.9, 1.1), grey = seg(a, 2.6, 3.5);
  const chair = `${two(rr(-150, -200, 300, 120, 30), "#7a3d6a", "#5a2a50", 0, 10)}${two(rr(-150, -430, 300, 240, 40), "#8a4a7a", "#6a3560", 12, 0)}${two(rr(-190, -260, 60, 200, 24), "#7a3d6a", "#5a2a50", 0, 6)}${two(rr(130, -260, 60, 200, 24), "#7a3d6a", "#5a2a50", 0, 6)}<rect x="-130" y="-80" width="20" height="80" fill="${P.ink}"/><rect x="110" y="-80" width="20" height="80" fill="${P.ink}"/>`;
  const lamp = `<rect x="-8" y="-420" width="16" height="420" fill="${P.steelD}"/>${two("M-80 -420L-50 -520H50L80 -420Z", mix(P.gold, "#3a2a7a", off), mix(P.goldD, "#2a1d66", off), 0, 8)}${off < 1 ? `<path d="M-80 -420L-220 0H220L80 -420Z" fill="#ffd98a" opacity="${(0.1 * (1 - off)).toFixed(2)}"/>` : ""}`;
  const k = at(960, G - 230, `<g opacity="${(1 - 0.5 * grey).toFixed(2)}">${key({ digits: 6, unroll: 0.6, c: mix(P.gold, "#8a86a8", grey), cD: mix(P.goldD, "#6a6688", grey) })}</g>`, 0.55);
  const row = a > 3.5 ? at(1440, 380, book(`<circle cx="-128" cy="-40" r="10" fill="${mix(P.violet, "#8a86a8", grey)}"/>${text(10, -24, "bc1q7c03…", 34, "#8a86a8")}${number(118, 40, "∞", 44, "#8a86a8")}${LINES}`), 0.8 * pop(a - 3.5)) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="#1a1240"/>` + layer(`<rect x="-400" y="${G}" width="3200" height="600" fill="#24164f"/>` + at(1000, G, chair) + at(1340, G, lamp) + k + row, c);
  return { g };
}
// ---- 10: say nothing about how much you hold ----
function s10(a, tot) {
  const G = 860;
  const c = camAt(a, [[0, 880, 660, 1.5], [4.58, 860, 660, 1.55]]);
  const vx = lerp(-500, 2400, seg(a, 0.2, 1.6));
  const van = at(vx, G, `${two("M-260 -40V-200Q-260 -230 -230 -230H120L240 -130V-40Z", "#2a2440", "#1a1430", 0, 10)}<path d="M130 -210L220 -130H130Z" fill="#0d0a20"/><path d="${rr(-220, -200, 300, 70, 8)}" fill="#0d0a20"/>${[-160, 140].map((x) => `<circle cx="${x}" cy="-30" r="34" fill="${P.ink}"/>`).join("")}`);
  const curtains = (o) => `<path d="M-88 -140h25v50h-25ZM-63 -140h25v50h-25Z" fill="#c45a7a" opacity="${o}"/><path d="M38 -140h25v50h-25ZM63 -140h25v50h-25Z" fill="#c45a7a" opacity="${o}"/>`;
  const cu = ease(seg(a, 1.0, 1.5));
  const hs = at(700, G, house(P.blue, P.blueD, { lit: [1, 1, 0] }) + curtains(cu.toFixed(2)) + (a > 2.3 ? at(0, -40, `${two(rr(-30, -26, 60, 52, 8), P.cream, P.creamD, 0, 4)}${text(0, 16, "?", 44, P.ink)}`, pop(a - 2.3)) : ""), 1.4);
  const hush = a > 3.3 ? at(1160, G - 340, `${two(circ(0, 0, 120), P.cream, P.creamD)}<path d="M-60 10h120" stroke="${P.ink}" stroke-width="16" stroke-linecap="round"/>${[-40, -15, 10, 35].map((x) => `<path d="M${x} -2v24" stroke="${P.ink}" stroke-width="7"/>`).join("")}${text(0, -40, "$", 60, P.red)}<path d="M-40 -84L40 -28" stroke="${P.red}" stroke-width="10" stroke-linecap="round"/>`, pop(a - 3.3)) : "";
  const g = night(c, tot, 47) + layer(skyline(9, -600, 2700, G - 40, 120, 300, "#2a1d66", "#ffb066"), c, 0.5)
    + layer(ground(G) + hs + van + hush, c);
  return { g };
}
// ---- 11: JUL 2026: a famous cold wallet has a flaw ----
function s11(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [2.8, 960, 560, 1.05], [4.38, 900, 580, 1.25]]);
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(53, 70, -400, 2400, 1080, tot), c, 0.15)
    + layer(rings(860, 600, 280, "#9fe7ff", 0.12) + at(860, 600, coldBox({ frost: 1, crack: seg(a, 2.95, 4.1) }), 2.6 * pop(a - 0.1)) + (a > 1.6 ? at(1500, 330, cal("2026", "JUL", a), 0.8 * pop(a - 1.6), 6) : ""), c);
  return { g, out: toScreen(c, 860, 600), outC: "#9fe7ff", outZ: 16 };
}
// ---- 12: its keys could be guessed ----
function s12(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [2.19, 960, 540, 1.05]]);
  const die = (n) => { const pips = { 1: [[0, 0]], 2: [[-22, -22], [22, 22]], 3: [[-22, -22], [0, 0], [22, 22]], 4: [[-22, -22], [22, -22], [-22, 22], [22, 22]], 5: [[-22, -22], [22, -22], [0, 0], [-22, 22], [22, 22]], 6: [[-22, -22], [22, -22], [-22, 0], [22, 0], [-22, 22], [22, 22]] }[n];
    return `${two(rr(-55, -55, 110, 110, 20), "#fff", "#d8dcf0", 0, 8)}${pips.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${P.ink}"/>`).join("")}`; };
  const roll = a < 1.4 ? 1 + Math.floor(a * 14) % 6 : 6;
  let keys = "";
  [0, 1, 2].forEach((i) => { const t = a - 0.3 - i * 0.25; if (t < 0) return; const p = ease(clamp(t / 0.45)); keys += at(lerp(560, 1060, p), lerp(600, 300 + i * 160, p), key({ digits: 6, unroll: 0.5 }), 0.95) + check(1560, 300 + i * 160, 46, P.green, a - 1.0 - i * 0.2); });
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(53, 70, -400, 2400, 1080, tot), c, 0.15)
    + layer(at(460, 640, coldBox({ frost: 1, crack: 1 }), 1.6) + keys + at(1580, 860, die(roll), 1.6, a < 1.4 ? a * 400 : 0), c);
  return { g, in: [960, 540], inC: "#9fe7ff", inZ: 16 };
}
// ---- 13: drained while offline: $100,000,000+ ----
function s13(a, tot) {
  const G = 820, SX = 1520;
  const c = camAt(a, [[0, 980, 620, 1.2], [3.98, 1020, 620, 1.2]]);
  let boxes = "", drops = "";
  [0, 1, 2, 3].forEach((i) => { const x = 240 + i * 260, y = G - 70 - (i % 2) * 120; boxes += at(x, y, coldBox({ frost: 0.6, crack: 1 }), 0.85) + `<path d="M${x - 40} ${y + 60}q-20 60 -80 70" fill="none" stroke="${P.ink}" stroke-width="10"/>` + at(x - 128, y + 130, `<path d="${rr(-22, -12, 44, 24, 6)}" fill="${P.steelD}"/><path d="M22 -6h16M22 6h16" stroke="${P.steel}" stroke-width="6"/>`, 1, 20);
    for (let k = 0; k < 3; k++) { const u = ((a * 0.9 + k / 3 + i * 0.17) % 1); if (a < 0.3) continue; const b = bez([x, y - 40], [(x + SX) / 2, 120], [SX, G - 260], u); drops += at(b[0], b[1], coin(20, ""), 1 - 0.4 * u); } });
  const sack = at(SX, G, `${two("M-180 0Q-220 -200 -90 -300L-60 -340H60L90 -300Q220 -200 180 0Z", "#2a2440", "#1a1430", 0, 10)}<path d="M-70 -330Q0 -300 70 -330" stroke="${P.ink}" stroke-width="12" fill="none"/>`);
  const n = Math.round(100 * ease(seg(a, 1.2, 2.0)));
  const lbl = a > 1.2 ? at(SX, G - 470, text(0, 0, "$" + n + ",000,000+", 92, P.red), pop(a - 1.2)) : "";
  const unpl = a > 2.4 ? rings(240 - 128, G - 70 + 130, 50, P.gold, 0.4 * Math.exp(-(a - 2.4) * 2)) : "";
  const g = night(c, tot, 59) + layer(ground(G + 60) + boxes + unpl + drops + sack + lbl, c);
  return { g };
}
// ---- 14: two paths; the left one: an exchange, easy, until it falls ----
const PATHS = (G, crackP) => `<path d="M960 ${G + 300}L960 ${G + 60}L520 ${G - 40}" fill="none" stroke="${P.stoneD}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/><path d="M960 ${G + 60}L1400 ${G - 40}" fill="none" stroke="${P.stoneD}" stroke-width="40" stroke-linecap="round"/>`;
function s14(a, tot) {
  const G = 900, TX = 480;
  const c = camAt(a, [[0, 960, 620, 1.1], [1.0, 960, 620, 1.1], [1.6, 700, 560, 1.3], [4.55, 680, 580, 1.3]]);
  const cr = seg(a, 2.75, 3.1), fall = easeIn(seg(a, 3.2, 3.9));
  const crack = cr > 0 ? `<path d="M${TX - 300} ${G - 20}L${TX - 140} ${G + 10}L${TX - 40} ${G - 30}L${TX + 80} ${G + 20}L${TX + 220} ${G - 10}L${TX + 300} ${G + 10}L${TX + 300} ${G + 60 + 200 * cr}L${TX - 300} ${G + 60 + 200 * cr}Z" fill="${P.ink}"/>` : "";
  const tw = at(TX, G - 20 + 700 * fall, tower({ name: "EXCHANGE", h: 640 }), 0.85, 18 * fall);
  const g = night(c, tot, 61) + layer(ground(G, "#2a1f5a") + PATHS(G) + crack + tw + (a > 1.9 && fall < 0.3 ? check(TX + 230, G - 640, 52, P.green, a - 1.9) : "")
      + at(1400, G - 100, coldBox({ frost: 0.4 }), 0.9 * pop(a - 0.3)), c);
  return { g };
}
// ---- 15: the right path: your own box; nobody can freeze it, nobody reminds you ----
function s15(a, tot) {
  const G = 900, BX = 1280;
  const c = camAt(a, [[0, 1340, 640, 1.35], [5.01, 1380, 620, 1.4]]);
  const beam = seg(a, 1.2, 1.5) * (1 - seg(a, 1.9, 2.2)), bounce = seg(a, 1.5, 2.1);
  const ice = beam > 0 ? `<path d="M520 160L${BX - 120} ${G - 330}" stroke="#bfe6ff" stroke-width="${(24 * beam).toFixed(1)}" stroke-linecap="round" opacity=".85"/>` + (bounce > 0 ? `<path d="M${BX - 120} ${G - 330}L${lerp(BX - 120, 700, bounce)} ${lerp(G - 330, G - 700, bounce)}" stroke="#bfe6ff" stroke-width="10" stroke-linecap="round" opacity="${(0.8 * (1 - bounce)).toFixed(2)}"/>` : "") : "";
  const shield = a > 1.5 ? rings(BX, G - 280, 200, P.green, 0.25 * Math.exp(-(a - 1.5) * 3)) : "";
  const wilt = seg(a, 2.5, 3.8), FX = 1720;
  const flower = at(FX, G - 40, `<path d="M0 0Q${10 + 40 * wilt} -100 ${60 * wilt} ${-180 + 90 * wilt}" fill="none" stroke="${mix(P.green, "#6a6688", wilt)}" stroke-width="10"/>${at(60 * wilt, -180 + 90 * wilt, [0, 1, 2, 3, 4].map((i) => `<circle cx="${(Math.cos(i * 1.257) * 26).toFixed(1)}" cy="${(Math.sin(i * 1.257) * 26).toFixed(1)}" r="20" fill="${mix(P.blue, "#6a6688", wilt)}"/>`).join("") + `<circle r="14" fill="${mix(P.gold, "#6a6688", wilt)}"/>`, 1, 80 * wilt)}`, 1.8, 0, `opacity="${(1 - 0.55 * wilt).toFixed(2)}"`);
  const q = a > 3.75 ? at(FX - 120, G - 380, text(0, 0, "?", 200, P.cream), pop(a - 3.75)) : "";
  const g = night(c, tot, 67) + layer(ground(G, "#2a1f5a") + `<path d="M760 ${G + 300}L860 ${G}L${BX} ${G - 30}" fill="none" stroke="${P.stoneD}" stroke-width="40" stroke-linecap="round"/>`
      + at(BX, G, `${two(rr(-160, -120, 320, 120, 12), P.violet, P.violetD, 0, 10)}`) + at(BX, G - 200, coldBox({ frost: 0.3 }), 1.1) + at(BX - 120, G - 360, key({ digits: 6, unroll: 0.5 }), 0.5 * pop(a - 0.2)) + shield + ice + flower + q, c);
  return { g };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
export const c3lostSet = makeSet(SHOTS, V, P);
