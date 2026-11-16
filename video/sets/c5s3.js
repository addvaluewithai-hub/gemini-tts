// Crypto part 5, scene "s3": guarding without electricity (proof of stake). Ten wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-05-world/shots.md, rows 22-31).
//   0 part 2's mining warehouse roars; a bolt runs in and a country-sized power bar fills
//   1 its cord is pulled, it goes dark; the camera slides to the staking vault and a house locks its diamond coins in
//   2 houses round the vault; a lottery wheel picks one; it writes a page and gets a reward; a "?" over a sly house
//   3 the sly house's stake burns; split: burned electricity (left) against coins at risk (right)
//   4 a stack of diamond coins counts up to 32; a heavy weight lands under it
//   5 a small house hands its few coins to a company tower that stakes them (host left)
//   6 a MIDDLEMAN stamp, PROOF OF STAKE, SEP 2022: the network's power bar falls to a sliver, -99%
//   7 a moon crosses; two roads split; the left road's warehouse grows and wins a trophy
//   8 the right road: the bigger stake wins the bigger pile; the rich pile grows taller (host right)
//   9 the right road leads into an old city under an ECONOMY sign
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s3.v.js";
import { stars, skyline, house, pill } from "./bank.js";
import { rig, pylon } from "./c2props.js";
import { P, mix, coin, warehouse, bolt, tower, calPage, stakeVault, padlock } from "./c5props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 31) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 110, -1200, 4200, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f") => `<rect x="-2400" y="${y}" width="9000" height="900" fill="${fill}"/>`;
const label = (w, a, size = 64, c = P.gold) => (a > 0 ? `<g transform="scale(${(0.2 + 0.8 * spring(a, 9, 16)).toFixed(3)})"><path d="${rr(-(w.length * size * 0.24 + 40), -size * 0.62, w.length * size * 0.48 + 80, size * 1.12, 20)}" fill="${c}"/>${text(0, size * 0.32, w, size, P.ink)}</g>` : "");
// a diamond coin (the network's own coin), r its half height
const gem = (r = 34, c = "#a78bfa", cD = P.violetD) => `<path d="M0 ${-r}L${r * 0.72} 0L0 ${r}L${-r * 0.72} 0Z" fill="${c}"/><path d="M0 ${-r}L${r * 0.72} 0L0 ${r * 0.18}Z" fill="${cD}" opacity=".55"/><path d="M${-r * 0.36} ${-r * 0.45}L0 ${-r * 0.7}" stroke="#fff" stroke-width="${r * 0.12}" stroke-linecap="round" opacity=".6"/>`;
// a bag with gems peeking out
const bag = (k = 1) => at(0, 0, `${two("M-60 0Q-80 -70 -36 -100L-24 -120H24L36 -100Q80 -70 60 0Z", "#c9a06a", "#a67c47", 0, 8)}<path d="M-30 -112h60" stroke="${P.woodD}" stroke-width="10" stroke-linecap="round"/>${at(-14, -128, gem(18))}${at(16, -132, gem(16))}`, k);
// the network's power bar: a long tube with a fill 0..1 and a little country (a row of houses) at its end
const powerBar = (fill, o = {}) => { const w = o.w || 700, f = clamp(fill);
  return `<path d="${rr(-w / 2, -40, w, 80, 40)}" fill="#1b1550" stroke="#cfe9ff" stroke-width="6" opacity=".95"/><path d="${rr(-w / 2 + 10, -30, Math.max(0, (w - 20) * f), 60, 30)}" fill="${o.c || P.gold}"/>${at(-w / 2 - 70, 0, bolt(P.gold, 0.9))}${o.country ? at(w / 2 + 90, 30, [-40, 0, 40].map((x, i) => at(x, 0, house([P.teal, P.pink, P.blue][i], [P.tealD, P.pinkD, P.blueD][i], { lit: [1, 1, 1] }), 0.22)).join("")) : ""}`; };
const trophy = (k = 1) => at(0, 0, `${two("M-50 -150H50Q50 -60 0 -50Q-50 -60 -50 -150Z", P.gold, P.goldD, 0, 8)}<path d="M-50 -130q-40 0 -36 30q4 26 40 26M50 -130q40 0 36 30q-4 26 -40 26" fill="none" stroke="${P.goldD}" stroke-width="10"/><path d="${rr(-10, -52, 20, 30, 4)}" fill="${P.goldD}"/>${two(rr(-46, -24, 92, 24, 6), P.wood, P.woodD, 0, 5)}`, k);
const wheel = (ang, r = 120) => { const cols = [P.blue, P.pink, P.teal, P.violet, P.gold, P.green];
  return `${cols.map((c, i) => { const a0 = ang + i * Math.PI / 3, a1 = a0 + Math.PI / 3; return `<path d="M0 0L${(Math.cos(a0) * r).toFixed(1)} ${(Math.sin(a0) * r).toFixed(1)}A${r} ${r} 0 0 1 ${(Math.cos(a1) * r).toFixed(1)} ${(Math.sin(a1) * r).toFixed(1)}Z" fill="${c}"/>`; }).join("")}<circle r="${r}" fill="none" stroke="${P.cream}" stroke-width="10"/><circle r="16" fill="${P.cream}"/><path d="M-22 ${-r - 36}h44l-22 40Z" fill="${P.red}"/>`; };

// ---- one world for shots 0-1: the warehouse on the left, the vault on the right ----
const G = 880, WH = [520, G], VA = [1560, G];
function world01(a, tot, s, t1) {   // a: time in shot 0 (or ends[0] + time in shot 1); t1: time in shot 1 (or -1)
  const cut = t1 >= 0 ? seg(t1, 0.5, 1.0) : 0, dark = t1 >= 0 ? ease(seg(t1, 0.7, 1.15)) : 0;
  let g = ground(G);
  g += at(WH[0] - 420, G, pylon(), 0.75);
  // the cord from the pylon to the warehouse: pulled out at shot 1's 0.5 s
  const plugX = lerp(WH[0] - 270, WH[0] - 330, cut), plugY = lerp(G - 230, G - 120, cut);
  g += `<path d="M${WH[0] - 420 - 0} ${G - 360}Q${WH[0] - 330} ${G - 160} ${plugX.toFixed(1)} ${plugY.toFixed(1)}" fill="none" stroke="${P.ink}" stroke-width="12"/>${at(plugX, plugY, `<path d="${rr(-16, -14, 32, 28, 6)}" fill="${P.steelD}"/>`)}`;
  if (!cut) { const on = seg(a, 0.4, 0.9); if (on > 0) for (let i = 0; i < 3; i++) { const u = ((tot * 1.4 + i / 3) % 1); g += at(lerp(WH[0] - 410, WH[0] - 280, u), lerp(G - 350, G - 230, u), bolt(P.gold, 0.5), 1); } }
  g += at(WH[0], G, warehouse(620, { heat: 1 - dark, spin: tot * 9 * (1 - dark), t: tot }), 1);
  if (dark > 0) g += `<path d="${rr(WH[0] - 310, G - 300, 620, 300, 10)}" fill="${P.ink}" opacity="${(0.65 * dark).toFixed(2)}"/>`;
  if (t1 >= 1.2) g += cross(WH[0], G - 380, 46, P.red, t1 - 1.2);
  // the power bar over the warehouse
  const fill = t1 >= 0 ? 1 - ease(seg(t1, 0.6, 1.2)) : ease(seg(a, 0.9, 2.2));
  g += at(WH[0] + 20, G - 450, powerBar(fill, { w: 560, country: true }), pop(a - 0.6) * (t1 >= 0 ? 1 - seg(t1, 1.3, 1.6) : 1));
  // the vault and the house that locks its coins in (shot 1)
  if (t1 >= 0) { const walk = ease(seg(t1, 1.8, 2.7)), lock = seg(t1, 3.0, 3.9);
    g += at(VA[0], G, stakeVault({ coins: 0.25 + 0.6 * ease(lock), t: tot }), pop(t1 - 1.5));
    const hx = lerp(VA[0] + 520, VA[0] + 300, walk);
    g += at(hx, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.8 * pop(t1 - 1.7), 4 * Math.sin(t1 * 14) * (walk > 0 && walk < 1 ? 1 : 0));
    if (t1 > 2.6) { if (lock < 1) g += at(lerp(hx - 140, VA[0] + 60, ease(lock)), lerp(G - 120, G - 160, ease(lock)) - 80 * Math.sin(Math.PI * lock), bag(0.9)); }
    if (t1 > 3.9) g += at(VA[0] + 150, G - 230, rings(0, 0, 40, P.gold, 0.3 * (1 - seg(t1, 3.9, 4.3)), 1.8)); }
  return g;
}
function s0(a, tot, s) { const c = camAt(a, [[0, 520, 650, 1.42], [2.7, 540, 640, 1.48]]);
  return { g: night(c, tot) + layer(skyline(41, -1200, 3400, G - 20, 100, 300, "#241a5c", "#ffb066"), c, 0.45) + layer(world01(a, tot, s, -1), c), out: toScreen(c, WH[0], G - 150), outC: P.ink, outZ: 14 }; }
function s1(a, tot, s) { const c = camAt(a, [[0, 540, 640, 1.48], [1.35, 540, 640, 1.48], [2.0, 1640, 700, 1.55], [4.34, 1660, 700, 1.62]]);
  return { g: night(c, tot) + layer(skyline(41, -1200, 3400, G - 20, 100, 300, "#241a5c", "#ffb066"), c, 0.45) + layer(world01((s.ends || [])[0] || 2.7, tot, s, a), c), out: toScreen(c, VA[0], G - 130), outC: "#1b1550", outZ: 16 }; }

// ---- 2: the lottery among the stakers (host right: keep x > 1560, y > 480 clear) ----
const HS = [[330, P.pink, P.pinkD, "sly"], [540, P.teal, P.tealD], [1110, P.blue, P.blueD, "win"], [1300, P.violet, P.violetD]];
function s2(a, tot) {
  const c = camAt(a, [[0, 840, 620, 1.3], [3.8, 840, 615, 1.33]]), V0 = [820, G];
  const spin = a < 0.3 ? 0 : a < 0.9 ? (a - 0.3) * 18 : 0.6 * 18 + 3.2 * (1 - Math.exp(-(a - 0.9) * 6));
  let g = ground(G) + at(V0[0], V0[1], stakeVault({ coins: 1, t: tot }));
  HS.forEach(([x, col, colD, who], i) => { const win = who === "win", lit = win && a > 1.0;
    g += at(x, G, (lit ? rings(0, -120, 150, P.gold, 0.22) : "") + house(col, colD, { lit: [1, 1, 1] }), 0.78);
    g += `<path d="M${x} ${G - 170}Q${(x + V0[0]) / 2} ${G - 330} ${V0[0] + (x < V0[0] ? -120 : 120)} ${G - 200}" fill="none" stroke="#a78bfa" stroke-width="5" stroke-dasharray="8 12" opacity=".5"/>`;
    g += at(x + 70, G - 30, gem(26)); });
  g += at(V0[0], 420, `<path d="M0 0V200" stroke="${P.steelD}" stroke-width="12"/>` + wheel(spin), pop(a - 0.1));
  // the pointer on top of the wheel, and a beam to the winner once it stops
  if (a > 1.0) g += `<path d="M${V0[0]} 300L${HS[2][0]} ${G - 230}" stroke="${P.gold}" stroke-width="8" stroke-dasharray="14 10" opacity="${seg(a, 1.0, 1.3).toFixed(2)}"/>`;
  // it writes a page: a page pops over the winner with a check, then a reward coin
  if (a > 1.37) g += at(HS[2][0], G - 420, `<path d="${rr(-70, -90, 140, 180, 12)}" fill="${P.cream}"/>${[0, 1, 2, 3].map((r) => `<path d="M-46 ${-56 + r * 34}h${70 + (r % 2) * 20}" stroke="#c9b48a" stroke-width="10" stroke-linecap="round"/>`).join("")}`, pop(a - 1.37)) + check(HS[2][0] + 70, G - 500, 34, P.green, a - 1.71);
  if (a > 2.14) g += at(HS[2][0] - 110, G - 470 - 40 * easeOut(seg(a, 2.14, 2.6)), gem(40, P.gold, P.goldD), pop(a - 2.14));
  // the sly house: a "?"
  if (a > 2.97) g += at(HS[0][0], G - 340, text(0, 0, "?", 150, P.cream), pop(a - 2.97));
  return { g: night(c, tot, 33) + layer(skyline(57, -800, 3000, G - 20, 80, 240, "#241a5c", "#ffb066"), c, 0.45) + layer(g, c), out: toScreen(c, HS[0][0], G - 120), outC: P.pinkD, outZ: 16 };
}

// ---- 3: the cheat's stake burns; burned electricity against something to lose ----
function s3(a, tot) {
  const split = ease(seg(a, 1.0, 1.4)), c = camAt(a, [[0, 900, 700, 1.5], [0.9, 900, 700, 1.5], [1.4, 960, 660, 1.28], [4.85, 960, 655, 1.3]]);
  const burn = seg(a, 0.0, 0.6);
  let g = ground(G);
  // the vault: one stake drops through the grate and burns
  const VX = lerp(900, 1380, split);
  g += at(VX, G, stakeVault({ coins: 1, burn: a < 1.2 ? Math.max(0.3, burn) : 0.6 * seg(a, 2.9, 3.3), t: tot }));
  if (a < 0.9) g += at(VX - 40, G - 120 + 140 * easeIn(burn), gem(30, burn > 0.5 ? "#ff7a3a" : "#a78bfa"), 1 - seg(a, 0.5, 0.75));
  if (a < 1.1) g += at(VX - 330, G, house(P.pink, P.pinkD, { lit: [0, 0, 0] }), 0.72 * (1 - split));
  // left half: the warehouse with its bolt (burned electricity)
  if (split > 0) { const on = seg(a, 1.3, 1.6) * (1 - 0.6 * seg(a, 2.5, 2.9));
    g += `<path d="M960 ${300}V${G + 200}" stroke="${P.cream}" stroke-width="6" stroke-dasharray="18 14" opacity="${(0.5 * split).toFixed(2)}"/>`;
    g += at(560, G, warehouse(560, { heat: on, spin: tot * 9, t: tot }), 1.0 * split);
    g += at(560, G - 430, bolt(P.gold, 1.8 + 0.25 * Math.sin(tot * 9) * on), pop(a - 1.3)) + (on > 0.2 ? at(560, G - 430, rings(0, 0, 120, P.gold, 0.25 * on)) : "");
    // right half: the vault's coins glow, lit by the flames under them (at risk)
    if (a > 2.9) g += at(VX, G - 130, rings(0, 0, 230, "#a78bfa", 0.22 * seg(a, 2.9, 3.4))) + at(VX + 200, G - 300, `<path d="M0 -60L52 30H-52Z" fill="${P.gold}"/>${text(0, 22, "!", 64, P.ink)}`, pop(a - 3.4)); }
  return { g: night(c, tot, 35) + layer(skyline(57, -800, 3000, G - 20, 80, 240, "#241a5c", "#ffb066"), c, 0.45) + layer(g, c), out: toScreen(c, VX, G - 130), outC: "#1b1550", outZ: 16 };
}

// ---- 4: 32 coins; a heavy weight ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [2.8, 960, 500, 1.08], [4.14, 960, 520, 1.1]]);
  const n = Math.round(32 * ease(seg(a, 1.1, 2.7))), w = a - 3.16, dip = w > 0 ? 18 * Math.exp(-w * 5) * Math.sin(w * 20) : 0;
  let g = ground(G) + `<path d="${rr(560, G - 50 + Math.max(0, dip), 800, 50, 10)}" fill="${P.steelD}"/>`;
  let st = "";
  for (let i = 0; i < n; i++) { const col = i % 8, row = Math.floor(i / 8); st += at(700 + col * 74, G - 110 - row * 96 + Math.max(0, dip), gem(40, i % 2 ? P.violet : "#a78bfa")); }
  g += st;
  g += at(960, 180, text(0, 60, String(n), 200, P.gold), a > 1.0 ? 1 + 0.08 * (n === 32 ? Math.exp(-(a - 2.7) * 6) : 0) : 0);
  if (w > 0) { const y = lerp(-200, G - 520, easeIn(seg(w, 0, 0.3)));
    g += at(1500, y, `${two("M-120 0Q-130 -150 0 -160Q130 -150 120 0Z", "#3a3570", "#2a2560", 0, 10)}<path d="M-60 -150Q-60 -230 0 -230Q60 -230 60 -150" fill="none" stroke="#3a3570" stroke-width="30"/>`, 1, 0);
    g += at(1500, G - 520 + 20, `<ellipse rx="${140 + 40 * seg(w, 0.3, 0.6)}" ry="18" fill="${P.ink}" opacity="${(0.4 * seg(w, 0.25, 0.4)).toFixed(2)}"/>`); }
  return { g: night(c, tot, 37) + layer(g, c) };
}

// ---- 5: a small house gives its coins to a company that stakes them (host left: keep x < 360, y > 480 clear) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1130, 610, 1.38], [3.19, 1140, 605, 1.42]]), HX = 760, TX = 1420;
  let g = ground(G) + at(TX, G, tower({ name: "STAKE INC", h: 470, seed: 3 }), 0.95) + at(TX + 260, G, stakeVault({ coins: 0.5 + 0.4 * ease(seg(a, 1.9, 2.5)), t: tot }), 0.55);
  g += at(HX, G, house(P.teal, P.tealD, { lit: [1, 1, 1] }), 0.8);
  for (let i = 0; i < 3; i++) { const p = ease(seg(a, 0.7 + i * 0.25, 1.6 + i * 0.25)); if (p >= 1) continue;
    g += at(lerp(HX + 90, TX - 60, p), lerp(G - 60, G - 260, p) - 140 * Math.sin(Math.PI * p), gem(28)); }
  if (a < 0.7) for (let i = 0; i < 3; i++) g += at(HX + 100 + i * 40, G - 30, gem(24));
  if (a > 2.37) g += at(TX + 120, G - 620, text(0, 0, "!", 120, P.cream), pop(a - 2.37));
  return { g: night(c, tot, 39) + layer(skyline(63, -800, 3000, G - 20, 80, 240, "#241a5c", "#ffb066"), c, 0.45) + layer(g, c), out: toScreen(c, TX, G - 300), outC: "#2c4590", outZ: 14 };
}

// ---- 6: MIDDLEMAN; PROOF OF STAKE; SEP 2022; the power bar falls to a sliver ----
function s6(a, tot) {
  const c = camAt(a, [[0, 1340, 620, 1.35], [0.9, 1340, 620, 1.35], [1.9, 1060, 600, 1.12], [7.54, 1060, 595, 1.15]]), TX = 1420;
  let g = ground(G) + at(TX, G, tower({ name: "STAKE INC", h: 470, seed: 3 }), 0.95);
  // the MIDDLEMAN stamp slams onto the tower
  g += at(TX, G - 300, `<g transform="rotate(-10)"><path d="${rr(-230, -50, 460, 100, 12)}" fill="none" stroke="${P.red}" stroke-width="12"/>${text(0, 26, "MIDDLEMAN", 70, P.red)}</g>`, a < 0.05 ? 0 : 1.6 - 0.6 * ease(seg(a, 0.05, 0.3)), 0, `opacity="${seg(a, 0.0, 0.15).toFixed(2)}"`);
  g += at(720, 300, label("PROOF OF STAKE", a - 1.1, 84, P.gold));
  g += at(1700, 330, calPage("2022", "SEP", 1, 120), 0.7 * pop(a - 3.0), 6);
  // the network's power bar: full, then down to a sliver
  const f = 1 - 0.99 * ease(seg(a, 4.8, 7.0));
  g += at(700, 560, powerBar(f, { w: 760, c: f < 0.3 ? P.green : P.gold }), pop(a - 2.6));
  if (a > 6.0) g += at(700, 680, text(0, 0, "−99%", 110, P.green), pop(a - 6.0));
  return { g: night(c, tot, 41) + layer(skyline(63, -800, 3000, G - 20, 80, 240, "#241a5c", "#ffb066"), c, 0.45) + layer(g, c), out: toScreen(c, 700, 560), outC: "#1b1550", outZ: 14 };
}

// ---- 7-9: one road that forks: machines on the left, stakes on the right, and the right road ends in an old city ----
const FX = 960, FY = 980;
function roads(a7, a8, a9, tot) {   // times within shots 7, 8, 9 (-1 when not yet)
  let g = ground(FY - 200, "#24164f");
  const road = (x1, y1) => `<path d="M${FX - 90} ${FY + 200}L${x1 - 60} ${y1}H${x1 + 60}L${FX + 90} ${FY + 200}Z" fill="#1f0f47"/><path d="M${FX} ${FY + 200}L${x1} ${y1}" stroke="${P.gold}" stroke-width="8" stroke-dasharray="30 26" opacity=".7"/>`;
  const split = a7 >= 0 ? ease(seg(a7, 1.1, 1.7)) : 1;
  g += road(lerp(FX, 380, split), lerp(FY, 760, split)) + road(lerp(FX, 1560, split), lerp(FY, 760, split));
  // left: the warehouse grows; a trophy
  const grow = a7 >= 0 ? ease(seg(a7, 2.5, 3.6)) : 1;
  g += at(380, 760, warehouse(420 + 240 * grow, { heat: 1, spin: tot * 9, t: tot, h: 240 + 80 * grow }), 0.9 * split + 0.0001);
  if (a7 >= 3.4 || a7 < 0) g += at(380, 380 - 70 * grow, trophy(1.1), a7 >= 0 ? pop(a7 - 3.4) : 1);
  // right: the vault and the stakers' piles
  g += at(1560, 760, stakeVault({ coins: 1, t: tot }), 0.8 * split + 0.0001);
  const big = a8 >= 0 ? ease(seg(a8, 0.6, 1.7)) : a9 >= 0 ? 1 : 0, rich = a8 >= 0 ? ease(seg(a8, 2.07, 3.1)) : a9 >= 0 ? 1 : 0;
  const pile = (x, h, c) => { let s = ""; for (let i = 0; i < h; i++) s += at(x + ((i * 37) % 3 - 1) * 10, 760 - 30 - i * 26, gem(26, i % 2 ? c : mix(c, "#ffffff", 0.2))); return s; };
  if (a8 >= 0 || a9 >= 0) { g += at(1350, 760, house(P.teal, P.tealD, { lit: [1, 1, 1] }), 0.5) + pile(1350 + 90, 2 + Math.round(1 * big), P.violet);
    g += at(1780, 760, house(P.gold, P.goldD, { lit: [1, 1, 1], roof: "#7a4a12" }), 0.62) + pile(1780 - 100, 3 + Math.round(6 * big + 9 * rich), "#a78bfa");
    if (rich > 0.9 && a8 >= 0) g += at(1680, 760 - 30 - (3 + 15) * 26 - 50, `<path d="M0 -50L36 0H14V50H-14V0H-36Z" fill="${P.gold}"/>`, pop(a8 - 3.1)); }
  // shot 7: the moon crosses the sky
  if (a7 >= 0 && a7 < 1.2) g += at(lerp(200, 1700, ease(seg(a7, 0, 0.9))), 160 + 60 * Math.sin(Math.PI * seg(a7, 0, 0.9)), `<circle r="50" fill="#fff3c2"/><circle cx="18" cy="-10" r="40" fill="#1a1240"/>`, 1 - seg(a7, 0.9, 1.2));
  // shot 9: the right road runs on into an old city with an ECONOMY arch
  if (a9 >= 0) { const cx = 2700, up = ease(seg(a9, 0.4, 1.4));
    g += `<path d="M1620 760L${cx - 100} 700H${cx + 100}L1680 760Z" fill="#1f0f47"/>`;
    [[-320, 260, "#5a6aa8"], [-160, 380, "#44529a"], [140, 330, "#5a6aa8"], [300, 240, "#3c5bb0"]].forEach(([dx, h, col], i) => { g += at(cx + dx, 700, `${two(rr(-70, -h * up, 140, h * up, 6), col, mix(col, P.ink, 0.25), 0, 8)}${[0, 1, 2].map((r) => `<path d="${rr(-40, -h * up + 30 + r * 70, 24, 30, 4)}" fill="${P.win}"/><path d="${rr(16, -h * up + 30 + r * 70, 24, 30, 4)}" fill="${P.win}"/>`).join("")}`); });
    g += at(cx, 700, `<path d="M-120 0V-240A120 120 0 0 1 120 -240V0" fill="none" stroke="${P.stone}" stroke-width="28"/>`, up);
    if (a9 > 1.6) g += at(cx, 400, label("ECONOMY", a9 - 1.6, 70, P.cream)); }
  return g;
}
function s7(a, tot) { const c = camAt(a, [[0, 960, 520, 1.0], [1.7, 960, 560, 1.0], [2.4, 620, 540, 1.2], [4.62, 600, 520, 1.25]]);
  return { g: night(c, tot, 43) + layer(roads(a, -1, -1, tot), c) }; }
function s8(a, tot) { const c = camAt(a, [[0, 1200, 520, 1.15], [3.62, 1210, 505, 1.2]]);
  return { g: night(c, tot, 43) + layer(roads(-1, a, -1, tot), c) }; }
function s9(a, tot) { const c = camAt(a, [[0, 1210, 505, 1.2], [1.2, 1800, 560, 0.85], [2.94, 2000, 560, 0.8]]);
  return { g: night(c, tot, 43) + layer(roads(-1, -1, a, tot), c) }; }

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];
export const c5s3Set = makeSet(SHOTS, V, P);
