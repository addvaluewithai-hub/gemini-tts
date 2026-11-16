// Crypto part 4, value: fourteen wordless shots (shots.md, scene value).
//   0 the coin on its pedestal; behind it a vault door opens on empty shelves: no gold behind it
//   1 a government building behind it, dark: no government
//   2 a company tower hands out a dividend envelope that opens empty: no profits
//   3 two things light up behind it: a short stack marked 21,000,000 (scarce) and a row of houses whose windows glow at it (belief)
//   4 a gold bar: a little factory takes only a sliver, the rest just glows, and the houses around it light up (agreement)
//   5 the coin steps up beside the gold bar, DIGITAL GOLD; 21,000,000; a mine entrance is boarded up
//   6 a pylon's bolt runs into the coin with a price tag: wrong; a million dollars poured into a hole; the hole's tag is crossed
//   7 two heaps at their 2025 peak: the coin heap $2,500,000,000,000 beside a gold heap more than ten times taller
//   8-11 the four buyers, one house each: the speculator (dice, sell higher; most houses are his), the one fleeing a
//     falling currency (suitcase), the one sending money past a closed bank gate, the institutions arriving late
//   12 phones light up one by one, wired together, and the coin grows; the very first phone stood alone with no one to call
//   13 nobody sets the price: an empty chair at the price board; the board shows the last trade between a seller and a buyer
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4value.v.js";
import { P, mix, house, coin, note, stars, skyline } from "./bank.js";
import { calPage, goldBar, pedestal, banknote } from "./props.js";
import { pylon, bolt } from "./c2props.js";
import { tower } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 2900, 1080, tot), c, 0.15);
const G = 900;
const town = (c, seed = 41) => layer(skyline(seed, -900, 2900, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(seed + 36, -900, 2900, G, 80, 230, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c);
// the coin on its pedestal, at x, standing on the ground
const coinOn = (x, a, tot, k = 1, o = {}) => at(x, G, pedestal(o.on ?? 0.6) + at(0, -260 + 8 * Math.sin(tot * 2), rings(0, 0, 150, P.gold, 0.14) + coin(110, "B")), k);
const label = (x, y, t, a, size = 64, fill = P.gold) => (a > 0 ? at(x, y, `${two(rr(-t.length * size * 0.29 - 26, -size * 0.62, t.length * size * 0.58 + 52, size * 1.1, 14), P.ink, "#0d0b33", 0, 6)}${text(0, size * 0.32, t, size, fill)}`, pop(a)) : "");
const fmtN = (v) => Math.round(v).toLocaleString("en");

// ---- 0-2: what is behind the coin? three doors, all empty ----
const CX = 700, BX = 1220;
function vault(a, open) { return `${two(rr(-230, -470, 460, 470, 16), "#5a6aa8", "#44529a", 0, 12)}<path d="${rr(-190, -430, 380, 400, 10)}" fill="#141038"/>${[0, 1, 2].map((i) => `<path d="M-170 ${-360 + i * 110}h340" stroke="#2c366f" stroke-width="10"/>`).join("")}
  <g transform="translate(-190 0) scale(${(1 - 0.92 * ease(open)).toFixed(3)} 1) translate(190 0)">${two(rr(-190, -430, 380, 400, 10), P.steel, P.steelD, 0, 10)}<circle cx="60" cy="-230" r="70" fill="none" stroke="${P.steelD}" stroke-width="16"/>${[0, 1, 2, 3].map((i) => `<path d="M60 -230l${(Math.cos(i * 1.57 + open * 3) * 60).toFixed(1)} ${(Math.sin(i * 1.57 + open * 3) * 60).toFixed(1)}" stroke="${P.steelD}" stroke-width="12" stroke-linecap="round"/>`).join("")}</g>`; }
function s0(a, tot) {
  const c = camAt(a, [[0, 820, 660, 1.3], [2.5, 900, 660, 1.35], [3.2, 1150, 620, 1.5], [4.3, 1170, 620, 1.55]]);
  const open = seg(a, 2.9, 3.5), v = at(BX, G, vault(a, open) + (open > 0.5 ? `<path d="M-120 -140l20 -20l20 20M40 -260q20 -30 40 0" stroke="#3a3570" stroke-width="5" fill="none"/>` : ""), pop(a - 1.7));
  const no = a > 3.85 ? cross(BX + 220, G - 500, 60, P.red, a - 3.85) : "", q = a > 1.3 && a < 3 ? at(CX + 180, G - 420, text(0, 0, "?", 110, P.cream), pop(a - 1.3)) : "";
  const g = night(c, tot, 11) + town(c) + layer(v + coinOn(CX, a, tot, 1) + q + no, c);
  return { g, out: toScreen(c, BX, G - 230), outC: "#141038", outZ: 16 };
}
function s1(a, tot) {
  const c = camAt(a, [[0, 1040, 620, 1.35], [1.47, 1060, 620, 1.4]]);
  const gov = at(BX, G, `<path d="${rr(-290, -30, 580, 30, 6)}" fill="#44529a"/>${two(rr(-250, -310, 500, 280, 6), "#5a6aa8", "#44529a", 12, 0)}${[-190, -95, 0, 95, 190].map((x) => `<path d="${rr(x - 20, -300, 40, 260, 4)}" fill="#6d7cc0"/>`).join("")}<path d="M-270 -310H270L0 -410Z" fill="#44529a"/>${two("M-110 -410A110 110 0 0 1 110 -410Z", "#5a6aa8", "#44529a", 0, 8)}<path d="M0 -520V-620" stroke="${P.steel}" stroke-width="10"/><path d="M0 -620h90l-16 22l16 22h-90Z" fill="${P.steel}"/><path d="M-60 0V-150A60 60 0 0 1 60 -150V0Z" fill="${P.ink}"/>`);
  const no = a > 1.0 ? cross(BX + 260, G - 560, 60, P.red, a - 1.0) : "";
  const g = night(c, tot, 11) + town(c) + layer(gov + coinOn(CX, a, tot, 1) + no, c);
  return { g, in: [BX, G - 200], inC: "#141038", inZ: 16, out: toScreen(c, BX, G - 75), outC: P.ink, outZ: 16 };
}
function s2(a, tot) {
  const c = camAt(a, [[0, 1040, 600, 1.3], [2.42, 1060, 600, 1.35]]);
  const tw = at(BX + 40, G, tower({ name: "INC", h: 620, lit: 1, c: "#4b5fae", cD: "#394b92", seed: 3 }), 0.85);
  // the dividend envelope flies out and opens: nothing inside
  const fly = ease(seg(a, 0.6, 1.3)), op = seg(a, 1.5, 1.9), E = bez([BX - 30, G - 220], [BX - 200, G - 520], [CX + 220, G - 420], fly);
  const env = a > 0.6 ? at(E[0], E[1], `${two(rr(-90, -55, 180, 110, 10), P.cream, P.creamD, 0, 6)}<path d="M-90 -55L0 ${(-55 + 70 * (1 - op) - 60 * op).toFixed(1)}L90 -55" fill="${op > 0.5 ? P.creamD : P.cream}" stroke="${P.creamD}" stroke-width="5"/>${text(0, 30, "$", 50, P.greenD)}`, 1.3) : "";
  const moth = op > 0.6 ? at(E[0] + 20, E[1] - 100 - 80 * seg(a, 1.8, 2.4), `<ellipse cx="-14" cy="0" rx="16" ry="10" fill="#9a90b8"/><ellipse cx="14" cy="0" rx="16" ry="10" fill="#9a90b8"/><circle r="5" fill="${P.ink}"/>`, 1.2) : "";
  const no = a > 2.05 ? cross(E[0] + 150, E[1] - 80, 54, P.red, a - 2.05) : "";
  const g = night(c, tot, 11) + town(c) + layer(tw + coinOn(CX, a, tot, 1) + env + moth + no, c);
  return { g, in: [BX, G - 100], inC: P.ink, inZ: 16 };
}

// ---- 3: scarcity and belief ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 660, 1.3], [3.8, 960, 650, 1.34], [12.56, 960, 650, 1.38]]);
  const sc = a > 1.3 ? at(380, G, `${Array.from({ length: 9 }, (_, i) => `<ellipse cx="0" cy="${-20 - i * 26}" rx="90" ry="22" fill="${i % 2 ? P.goldD : P.gold}"/>`).join("")}`, pop(a - 1.3)) + label(380, G - 330, "21,000,000", a - 1.5, 52) : "";
  const HS = [[1180, P.blue, P.blueD], [1370, P.pink, P.pinkD], [1560, P.teal, P.tealD], [1275, P.violet, P.violetD], [1465, P.gold, P.goldD]];
  let hs = "", beams = "";
  HS.forEach(([x, col, colD], i) => { const back = i > 2, y = back ? G - 70 : G, t = a - 2.35 - i * 0.12, lit = t > 0 ? 1 : 0;
    hs += at(x, y, house(col, colD, { lit: [lit, lit, lit] }), (back ? 0.62 : 0.78) * pop(a - 2.2 - i * 0.08));
    if (t > 0.1) beams += drawn(`M${x} ${y - 160}Q${(x + 960) / 2} ${G - 620} 960 ${G - 330}`, seg(t, 0.1, 0.6), P.gold, 4, `stroke-dasharray="8 12" opacity=".7"`); });
  const g = night(c, tot, 17) + town(c, 77) + layer(sc + beams + hs + coinOn(960, a, tot, 1.15, { on: 0.6 + 0.4 * seg(a, 2.6, 3.3) }), c);
  return { g, out: toScreen(c, 960, G - 300), outC: P.gold, outZ: 18 };
}

// ---- 4: gold: a sliver is used, the rest is scarce and agreed on ----
function s4(a, tot) {
  const GB = [900, G], c = camAt(a, [[0, 900, 650, 1.55], [2.2, 1060, 640, 1.38], [3.7, 1060, 640, 1.38], [6.36, 980, 640, 1.28]]);
  const bar = at(GB[0], GB[1], pedestal(0.5 + 0.5 * seg(a, 4.2, 4.7)) + at(0, -100, rings(0, -40, 170, P.gold, 0.1 + 0.12 * seg(a, 4.2, 4.7)) + goldBar(1.6)));
  const fac = at(1430, G, `${two(rr(-150, -200, 300, 200, 8), "#5a6aa8", "#44529a", 0, 10)}<path d="M-150 -200l60 -60v60l60 -60v60l60 -60v60" fill="#44529a"/><path d="${rr(70, -330, 50, 140, 6)}" fill="#44529a"/>${[0, 1, 2].map((i) => `<path d="${rr(-120 + i * 80, -150, 50, 40, 6)}" fill="${P.win}"/>`).join("")}`, pop(a - 2.3));
  const sl = seg(a, 2.7, 3.4), S = bez([GB[0] + 80, GB[1] - 200], [1200, G - 520], [1430, G - 220], ease(sl));
  const sliver = sl > 0 && sl < 1 ? at(S[0], S[1], `<path d="M-30 0L-20 -16H20L30 0Z" fill="${P.gold}"/>`, 1.2) : "";
  const HS = [[300, P.blue, P.blueD], [520, P.pink, P.pinkD], [1700, P.teal, P.tealD]];
  let hs = ""; HS.forEach(([x, col, colD], i) => { const lit = a > 5.0 + i * 0.12 ? 1 : 0; hs += at(x, G, house(col, colD, { lit: [lit, lit, lit] }) + (lit ? at(0, -330, check(0, 0, 30, P.green, a - 5.0 - i * 0.12)) : ""), 0.8 * pop(a - 4.8 - i * 0.1)); });
  const g = night(c, tot, 23) + town(c, 91) + layer(hs + fac + bar + sliver, c);
  return { g, in: [GB[0], GB[1] - 150], inC: P.gold, inZ: 18 };
}
// ---- 5: digital gold, 21 million, no new mine ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 640, 1.25], [2.2, 960, 620, 1.25], [3.4, 1150, 640, 1.35], [4.98, 1170, 640, 1.38]]);
  const bar = at(600, G, pedestal(1) + at(0, -100, rings(0, -40, 150, P.gold, 0.14) + goldBar(1.5)));
  const step = ease(seg(a, 0.2, 1.1)), cx = lerp(1400, 980, step), hop = Math.sin(Math.PI * step) * 160, edge = seg(a, 1.1, 1.6);
  const cn = at(cx, G, pedestal(edge) + at(0, -260 - hop + 6 * Math.sin(tot * 2), rings(0, 0, 150, P.gold, 0.14 + 0.16 * edge) + `<circle r="${116 + 10 * edge}" fill="none" stroke="#fff3c2" stroke-width="${(8 * edge).toFixed(1)}"/>` + coin(110, "B")));
  const lab = label(790, G - 560, "DIGITAL GOLD", a - 1.3, 60) + label(980, G - 440, "21,000,000", a - 2.45, 48, "#fff3c2");
  const nail = (i) => seg(a, 3.7 + i * 0.22, 3.85 + i * 0.22);
  const mine = at(1500, G, `<path d="M-180 0V-170A180 170 0 0 1 180 -170V0Z" fill="#4a3a2a"/><path d="M-130 0V-150A130 130 0 0 1 130 -150V0Z" fill="${P.ink}"/>${[0, 1, 2].map((i) => nail(i) > 0 ? at(0, -70 - i * 60, `<path d="${rr(-170, -18, 340, 36, 6)}" fill="${P.wood}"/><circle cx="-140" r="6" fill="${P.steel}"/><circle cx="140" r="6" fill="${P.steel}"/>`, 1, (i % 2 ? -14 : 12) * ease(nail(i))) : "").join("")}`, pop(a - 3.3));
  const g = night(c, tot, 23) + town(c, 91) + layer(bar + cn + mine + lab, c);
  return { g, out: toScreen(c, cx, G - 260), outC: P.gold, outZ: 18 };
}
// ---- 6: electricity is not value; a million in a hole is still a hole (host right) ----
function s6(a, tot) {
  const c = camAt(a, [[0, 700, 640, 1.25], [3.7, 720, 640, 1.25], [4.3, 980, 640, 1.2], [7.74, 980, 640, 1.22]]);
  const PY = [260, G], CN = [720, G];
  const zap = seg(a, 1.3, 2.9), Z = bez([PY[0] + 120, PY[1] - 480], [460, G - 650], [CN[0], CN[1] - 330], zap);
  const bolts = zap > 0 && zap < 1 ? at(Z[0], Z[1], bolt(P.gold, 0.9)) + at(...bez([PY[0] + 120, PY[1] - 480], [460, G - 650], [CN[0], CN[1] - 330], Math.max(0, zap - 0.2)), bolt(P.gold, 0.6)) : "";
  const tagT = seg(a, 2.6, 3.0), tagG = tagT > 0 && a < 4.6 ? at(CN[0] + 210, CN[1] - 470, `${two("M-20 -10L40 -60H230V60H40Z", P.cream, P.creamD, 0, 6)}<circle cx="18" cy="0" r="10" fill="${P.ink}"/>${at(110, 0, bolt(P.gold, 0.55))}${text(170, 22, "= $", 50, P.ink)}`, pop(a - 2.6)) : "";
  const wrong = a > 3.6 && a < 4.6 ? cross(CN[0] + 420, CN[1] - 520, 56, P.red, a - 3.6) : "";
  // the hole: a shovel digs, coins pour in with a $1,000,000 counter, and the hole's own tag says it is still just a hole
  const H = [1300, G], dig = seg(a, 4.2, 4.8), pour = seg(a, 4.8, 5.7), m = Math.round(1000000 * ease(pour));
  const hole = at(H[0], H[1], `<ellipse cx="0" cy="10" rx="${(200 * dig).toFixed(1)}" ry="${(55 * dig).toFixed(1)}" fill="${P.ink}"/><ellipse cx="0" cy="10" rx="${(170 * dig).toFixed(1)}" ry="${(40 * dig).toFixed(1)}" fill="#0a0820"/>${dig > 0 ? `<path d="M210 -10l90 -60" stroke="${P.wood}" stroke-width="14" stroke-linecap="round"/><path d="M300 -70l40 -20l10 40l-36 10Z" fill="${P.steel}"/>` : ""}`);
  let coins = ""; for (let i = 0; i < 10; i++) { const t = seg(a, 4.85 + i * 0.08, 5.25 + i * 0.08); if (t > 0 && t < 1) coins += at(H[0] - 80 + (i % 5) * 40, lerp(H[1] - 420, H[1] + 10, easeIn(t)), coin(26, ""), 1); }
  const cnt = pour > 0 ? label(H[0], H[1] - 300, "$" + fmtN(m), pour, 56) : "";
  const htag = a > 6.2 ? at(H[0] + 160, H[1] - 150, `${two("M-20 -10L40 -50H200V50H40Z", P.cream, P.creamD, 0, 6)}<circle cx="18" cy="0" r="9" fill="${P.ink}"/>${text(120, 18, "$1M", 46, P.ink)}${drawn("M50 -30L190 30", seg(a, 6.8, 7.1), P.red, 10)}`, pop(a - 6.2), -8) : "";
  const g = night(c, tot, 37) + town(c, 51) + layer(at(PY[0], PY[1], pylon(), 1) + coinOn(CN[0], a, tot, 1) + bolts + tagG + wrong + hole + coins + cnt + htag, c);
  return { g };
}
// ---- 7: the whole coin heap at its 2025 peak, beside gold: more than ten heaps like it (host left) ----
function s7(a, tot) {
  const c = camAt(a, [[0, 820, 640, 1.45], [4.6, 900, 640, 1.3], [5.6, 1120, 600, 1.0], [7.92, 1140, 600, 1.0]]);
  const heap = (cx, w, h, col, colD) => two(`M${cx - w / 2} ${G}Q${cx - w * 0.3} ${G - h * 0.9} ${cx} ${G - h}Q${cx + w * 0.3} ${G - h * 0.9} ${cx + w / 2} ${G}Z`, col, colD, 0, 10);
  const hb = 150 * ease(seg(a, 0.8, 3.1));
  const coins = heap(640, 260, Math.max(4, hb), P.gold, P.goldD) + (hb > 40 ? at(640, G - hb - 70, coin(50, "B"), 1) : "");
  let gold = ""; for (let i = 0; i < 11; i++) { const t = seg(a, 5.66 + i * 0.16, 5.96 + i * 0.16); if (t <= 0) continue; const row = i < 6 ? 0 : 1, x = 1000 + (i - row * 6) * 175 + row * 88, y = row ? 0 : -150;
    gold += at(0, y, heap(x, 200, 150 * easeOut(t), "#ffe08a", P.goldD)) ; }
  const cal = a > 2.6 ? at(300, G - 420, calPage("2025", "PEAK", 1, 150), 0.62 * pop(a - 2.6), -6) : "";
  const lab = label(640, G - hb - 200, "$2,500,000,000,000", a - 4.1, 46) + (a > 7.4 ? label(1440, G - 420, "× 10+", a - 7.4, 110) : "") + (a > 5.6 ? at(1440, G - 290, goldBar(1.0), pop(a - 5.6)) : "");
  const g = night(c, tot, 43) + town(c, 63) + layer(cal + coins + gold + lab, c);
  return { g, out: toScreen(c, 640, G - 60), outC: P.gold, outZ: 18 };
}

// ---- 8-11: the four buyers ----
const buyerShot = (o) => (a, tot) => {
  const c = camAt(a, [[0, o.cx || 960, 660, o.z || 1.4], [o.len || 4, o.cx || 960, 660, (o.z || 1.4) * 1.04]]);
  const g = night(c, tot, o.seed || 51) + town(c, o.town || 71) + layer(o.draw(a, tot), c);
  return { g, in: o.first ? [960, 540] : [960, G - 200], inC: o.inC || P.gold, inZ: 18, out: o.out ? toScreen(c, ...o.out) : undefined, outC: o.outC || P.gold, outZ: 18 };
};
const B = [880, G];
const s8 = buyerShot({ len: 4.45, out: [B[0], B[1] - 150], first: true, inC: P.gold, draw: (a, tot) => {
  const dice = `<path d="${rr(-30, -30, 60, 60, 10)}" fill="#fff"/>${[[-14, -14], [14, 14], [0, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${P.red}"/>`).join("")}`;
  const h = at(B[0], B[1], house(P.red, P.redD, { lit: [1, 1, 1] }) + at(40, -330, dice, 1, 12 * Math.sin(tot * 3)), 1.1 * pop(a + 0.2));
  const fly = seg(a, 1.6, 2.3), F = bez([1500, G - 500], [1200, G - 700], [B[0] + 20, B[1] - 250], ease(fly));
  const cn = fly > 0 && fly < 1 ? at(F[0], F[1], coin(50, "B")) : fly >= 1 ? at(B[0] + 150, B[1] - 60, coin(40, "B")) : "";
  const sign = a > 2.4 ? at(B[0] + 380, B[1], `<path d="M0 0V-220" stroke="${P.woodD}" stroke-width="12"/>${two(rr(-150, -340, 300, 120, 12), P.cream, P.creamD, 0, 6)}${text(0, -295, "SELL", 40, P.ink)}${text(-20, -250, "HIGHER", 40, P.green)}<path d="M100 -250l20 -30l20 30" fill="${P.green}"/>`, pop(a - 2.4)) : "";
  let many = ""; for (let i = 0; i < 7; i++) { const t = a - 3.6 - i * 0.07; if (t > 0) many += at(200 + i * 230 + (i > 2 ? 520 : 0), G - 60, house(P.red, P.redD, { lit: [1, 0, 1] }), 0.5 * pop(t)); }
  return many + h + sign + cn; } });
const s9 = buyerShot({ len: 3.69, out: [B[0], B[1] - 150], draw: (a, tot) => {
  const shrink = 1 - 0.5 * ease(seg(a, 1.0, 2.0));
  let notes = ""; for (let i = 0; i < 5; i++) notes += at(1350 + (i % 3) * 120, G - 120 - Math.floor(i / 3) * 90, banknote(1.1 * shrink, mix("#6fe3a1", "#8a8a8a", 1 - shrink), mix("#3fbf7a", "#6a6a6a", 1 - shrink)), 1, -8 + i * 5);
  const down = a > 1.1 ? at(1480, G - 400, `<path d="M0 -60V60M-40 20L0 60L40 20" stroke="${P.red}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - 1.1)) : "";
  const h = at(B[0], B[1], house(P.blue, P.blueD, { lit: [1, 1, 1] }) + at(-200, -40, `${two(rr(-60, -50, 120, 90, 12), "#c47f22", "#a86010", 0, 6)}<path d="M-24 -50v-18h48v18" fill="none" stroke="#a86010" stroke-width="8"/>`), 1.1);
  const grab = seg(a, 2.6, 3.2), C = bez([620, G - 520], [700, G - 640], [B[0] + 60, B[1] - 260], ease(grab));
  return notes + down + h + (a > 2.4 ? at(C[0], C[1], coin(50, "B"), pop(a - 2.4)) : ""); } });
const s10 = buyerShot({ len: 2.48, out: [1500, G - 150], draw: (a, tot) => {
  const h = at(560, G, house(P.teal, P.tealD, { lit: [1, 1, 1] }), 1.0);
  const bankGate = at(1000, G, `${two(rr(-150, -360, 300, 360, 10), "#5a6aa8", "#44529a", 0, 10)}${text(0, -300, "BANK", 50, P.cream)}<path d="${rr(-110, -240, 220, 240, 6)}" fill="${P.steelD}"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${-90 + i * 45} -230V0" stroke="${P.steel}" stroke-width="10"/>`).join("")}${at(0, -130, `<path d="M-18 -16v-12a18 18 0 0 1 36 0v12" fill="none" stroke="${P.gold}" stroke-width="8"/><path d="${rr(-26, -16, 52, 40, 8)}" fill="${P.gold}"/>`)}`);
  const fence = `<path d="M1240 ${G}V${G - 160}M1300 ${G}V${G - 160}M1360 ${G}V${G - 160}M1220 ${G - 120}H1380M1220 ${G - 60}H1380" stroke="${P.steelD}" stroke-width="10"/>`;
  const far = at(1600, G, house(P.violet, P.violetD, { lit: [a > 1.9 ? 1 : 0, a > 1.9 ? 1 : 0, 1] }), 0.85);
  const f = seg(a, 0.7, 1.9), C = bez([620, G - 260], [1100, G - 760], [1600, G - 200], ease(f));
  return h + bankGate + fence + far + (f > 0 && f < 1 ? at(C[0], C[1], coin(46, "B")) : f >= 1 ? at(1680, G - 60, coin(34, "B")) : ""); } });
const s11 = buyerShot({ len: 3.52, draw: (a, tot) => {
  const arrive = ease(seg(a, 0.5, 1.5)), x = lerp(2200, 1200, arrive);
  const tw = at(x, G, tower({ name: "FUND", h: 640, lit: 1, c: "#6a4fc0", cD: "#523ba0", seed: 7 }), 0.95);
  const bag = a > 1.9 ? at(x - 300, G - 90, `${two("M-80 0Q-100 -110 -30 -130H30Q100 -110 80 0Z", "#c9a46a", "#a8834a", 0, 8)}<path d="M-30 -130l-10 -30h80l-10 30" fill="#a8834a"/>${at(0, -60, coin(34, "B"))}`, pop(a - 1.9) * 1.3) : "";
  const yr = 2009 + Math.round(15 * ease(seg(a, 0.0, 2.5))), cal = at(520, G - 420, calPage(String(yr), "", 1, 150), 0.7);
  const late = a > 2.6 ? at(520, G - 120, `<circle r="80" fill="${P.cream}" stroke="${P.red}" stroke-width="10"/><path d="M0 0V-55M0 0L40 20" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/>`, pop(a - 2.6)) : "";
  return cal + late + tw + bag; } });

// ---- 12: the more people accept it, the more it is worth; the first phone had nobody to call (host left) ----
function s12(a, tot) {
  const c = camAt(a, [[0, 1150, 520, 1.0], [2.0, 1150, 520, 1.0], [2.9, 1500, 600, 1.4], [6.04, 1520, 600, 1.45]]);
  const PH = [[700, 600], [900, 420], [1100, 640], [1280, 380], [880, 760], [1180, 820], [560, 360]];
  const phone = (on) => `${two(rr(-40, -70, 80, 140, 14), on ? "#2c1f63" : "#2c1f63", P.ink, 0, 6)}<path d="${rr(-30, -56, 60, 100, 6)}" fill="${on ? "#9fe7ff" : "#203070"}"/>`;
  let lines = "", ph = ""; PH.forEach(([x, y], i) => { const t = a - 0.2 - i * 0.2; if (t <= 0) return; ph += at(x, y, (t > 0.1 ? rings(0, 0, 70, "#9fe7ff", 0.14) : "") + phone(1), pop(t) * 0.9);
    PH.slice(0, i).forEach(([x2, y2]) => { lines += drawn(`M${x} ${y}L${x2} ${y2}`, seg(t, 0.1, 0.4), "#9fe7ff", 4, 'opacity=".5"'); }); });
  const grow = 0.6 + 0.6 * ease(seg(a, 0.6, 1.9)), cn = at(1000, 230, rings(0, 0, 120 * grow, P.gold, 0.15) + coin(80 * grow, "B"));
  // the very first phone, alone on its pole, a ? over it
  const first = at(1560, 780, `<path d="M0 0V200" stroke="${P.woodD}" stroke-width="14"/>${phone(1)}`, 1.5) + (a > 3.1 ? at(1660, 520, `${two(rr(-80, -70, 160, 120, 40), P.cream, P.creamD, 0, 6)}<path d="M-20 50l-20 40l50 -40Z" fill="${P.cream}"/>${text(0, 25, "?", 90, P.ink)}`, pop(a - 3.1)) : "") + (a > 3.1 ? at(1440, 650, `<path d="M0 0q-30 -40 0 -80" stroke="#9fe7ff" stroke-width="8" fill="none" opacity="${(0.5 + 0.5 * Math.sin(tot * 9)).toFixed(2)}"/>`) : "");
  const g = night(c, tot, 61) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c) + layer(lines + ph + cn + first, c);
  return { g, out: toScreen(c, 1560, 780), outC: "#9fe7ff", outZ: 18 };
}
// ---- 13: nobody sets the price; it is the last trade between a seller and a buyer (host right) ----
function s13(a, tot) {
  const c = camAt(a, [[0, 720, 520, 1.4], [1.9, 720, 520, 1.4], [2.6, 880, 600, 1.25], [7.76, 880, 600, 1.28]]);
  const BD = [860, 360], flick = a < 6.0 ? Math.floor(tot * 12) : 0;
  const bars = Array.from({ length: 5 }, (_, i) => { const h = a < 6.0 ? 20 + 60 * rnd(flick * 7 + i) : 40 + 10 * i % 30; return `<path d="${rr(-170 + i * 70, 40 - h, 46, h, 6)}" fill="${a >= 6.0 ? P.green : "#9fe7ff"}"/>`; }).join("");
  const board = at(BD[0], BD[1], `${two(rr(-240, -120, 480, 220, 16), P.ink, "#0d0b33", 0, 8)}${text(0, -70, "PRICE", 44, P.gold)}${bars}${a > 6.0 ? text(150, -66, "✓", 50, P.green) : ""}`);
  const chair = at(BD[0] - 520, G, `${two(rr(-80, -320, 160, 200, 30), "#4b3d8f", "#36296e", 0, 8)}${two(rr(-90, -140, 180, 40, 14), "#4b3d8f", "#36296e", 0, 6)}<path d="M-70 -100V0M70 -100V0" stroke="${P.ink}" stroke-width="12"/>`, pop(a - 0.3)) + (a > 1.2 ? cross(BD[0] - 520, G - 400, 46, P.red, a - 1.2) : "");
  const S = [640, G], Bh = [1180, G];
  const seller = at(S[0], S[1], house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.85 * pop(a - 4.6)), buyer = at(Bh[0], Bh[1], house(P.pink, P.pinkD, { lit: [1, 1, 1] }), 0.85 * pop(a - 5.7));
  const sw = seg(a, 6.0, 6.8), C1 = bez([S[0] + 60, S[1] - 260], [910, G - 520], [Bh[0] - 60, Bh[1] - 260], ease(sw)), C2 = bez([Bh[0] - 60, Bh[1] - 260], [910, G - 420], [S[0] + 60, S[1] - 260], ease(sw));
  const swap = a > 4.8 ? at(C1[0], C1[1], coin(46, "B"), pop(a - 4.8)) + (a > 5.9 ? at(C2[0], C2[1], note(), 1.6 * pop(a - 5.9)) : "") : "";
  const link = sw > 0.95 ? `<path d="M${S[0]} ${S[1] - 300}L${BD[0]} ${BD[1] + 100}L${Bh[0]} ${Bh[1] - 300}" stroke="${P.green}" stroke-width="5" fill="none" stroke-dasharray="10 10" opacity=".8"/>` : "";
  const g = night(c, tot, 67) + town(c, 83) + layer(chair + board + link + seller + buyer + swap, c);
  return { g, in: [BD[0], BD[1]], inC: "#9fe7ff", inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13];
export const c4valueSet = makeSet(SHOTS, V, P);
