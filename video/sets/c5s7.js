// Crypto part 5, scene "s7": a bank without a bank (DeFi). Eight shots (shot list:
// episodes/techforbadguys/explain-crypto-05-world/shots.md, rows 52–59):
//   0 the bank's door is bricked up; in front of it the lending pool: houses pour coins in, a pipe lends to a borrower
//   1 the borrower puts a collateral bag on a scale, bigger than the loan; its price line starts to drop
//   2 the pool's arm sells the collateral at once (a stopwatch at 1 s); the borrower's phone stays silent (host right)
//   3 a swap machine: one coin in, another out; a company tower, opening hours and an ID card are crossed out in turn
//   4 a crack runs across the pool's code panel
//   5 an empty HELP window with a cobweb; the 2016 machine with its red bar flashes up (host left)
//   6 many cracked pools drain into sacks one after another; 2022, a counter to $3,000,000,000+
//   7 the bank has a door and a knocker and a house knocks on it; the pool has no door at all
// Shots 0–2 are one world under one camera; the others hand over through shapes.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s7.v.js";
import { house, bank, stars, skyline } from "./bank.js";
import { calPage } from "./props.js";
import { P, mix, coin, pool, vending, can, codeBars, tower, clock, balance, padlock } from "./c5props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 71) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, 2800, 1080, tot), c, 0.15);
const ground = (G, fill = "#2a1556") => `<rect x="-1200" y="${G}" width="4400" height="900" fill="${fill}"/>`;
const tag = (label, c = P.gold, ink = P.ink, size = 44) => { const w = String(label).length * size * 0.5 + 48; return `${two(rr(-w / 2, -size * 0.75, w, size * 1.5, size * 0.4), c, mix(c, P.ink, 0.25), 0, 6)}${text(0, size * 0.36, label, size, ink)}`; };
// the bank's arch bricked up: drawn over the arch of bank()
const bricks = (p = 1) => { if (p <= 0) return ""; let rows = ""; for (let r = 0; r < 11; r++) for (let i = 0; i < 6; i++) { const y = -60 - r * 20, x = -170 + i * 60 + (r % 2) * 30; if (y < -40 - 220 * p) continue; rows += `<path d="${rr(x, y, 56, 17, 3)}" fill="${(r + i) % 3 ? "#b0563a" : "#94452e"}"/>`; }
  return `<clipPath id="arch7"><path d="M-170 -40V-260A170 170 0 0 1 170 -260V-40Z"/></clipPath><g clip-path="url(#arch7)"><path d="M-170 -40V-430H170V-40Z" fill="#6e2f22"/>${rows}</g>`; };

// ---- 0–2: the pool beside the bricked-up bank ----
const G = 880, BX = 400, PX = 1080, PK = 1.1, OUT = [PX + 310 * PK, G - 50 * PK];
const LENDERS = [[830, P.blue, P.blueD], [1330, P.pink, P.pinkD]], BORROW = [1880, P.teal, P.tealD], SX = 1620, SK = 0.7;
function world(t, tot, s) {
  const E = s.ends || [], T1 = E[0] || 6.02, T2 = T1 + (E[1] || 3.35), u1 = t - T1, u2 = t - T2;
  // the bank, its door bricked up and crossed out
  const bk = at(BX, G, bank({ night: true, inner: bricks(seg(t, 1.0, 1.6)) }), 0.75) + (t > 1.45 ? at(BX, G - 420, cross(0, 0, 66, P.red, t - 1.45)) : "");
  const level = 0.25 + 0.5 * ease(seg(t, 2.4, 3.9)) - 0.15 * ease(seg(t, 4.3, 5.6));
  // lender houses behind the pool pour coins in over its rim
  let coins = "";
  LENDERS.forEach(([x], i) => { for (let k = 0; k < 3; k++) { const t0 = 2.3 + i * 0.35 + k * 0.32, p = seg(t, t0, t0 + 0.6); if (p <= 0 || p >= 1) continue;
    const b = bez([x, G - 380], [lerp(x, PX, 0.5), G - 560], [PX + (i ? 60 : -60), G - 150], ease(p)); coins += at(b[0], b[1], coin(30, "B")); } });
  // the pool lends out of its outflow pipe to the borrower
  for (let k = 0; k < 3; k++) { const t0 = 4.25 + k * 0.4, p = seg(t, t0, t0 + 0.65); if (p <= 0 || p >= 1) continue; const b = bez(OUT, [lerp(OUT[0], BORROW[0], 0.5), G - 420], [BORROW[0] - 70, G - 170], ease(p)); coins += at(b[0], b[1], coin(30, "B")); }
  const lent = Math.round(3 * seg(t, 4.85, 6.0));
  // shot 1: the borrower's scale: the loan on the left, the collateral bag on the right, heavier; its price drops
  let scale = "";
  const sold = u2 > 0.2 ? ease(seg(u2, 0.25, 0.9)) : 0;
  if (u1 > -0.2) { const bag = u1 > 0.6 ? 1 : 0, land = pop(u1 - 0.6), tilt = bag ? 0.55 * (1 - sold) * Math.min(1, land) : -0.2;
    const L = Array.from({ length: 3 }, (_, i) => `<ellipse cx="0" cy="${-12 - i * 16}" rx="40" ry="12" fill="${i % 2 ? P.goldD : P.gold}"/>`).join("");
    const R = bag && sold < 0.5 ? at(0, 0, `${two("M-80 0Q-96 -110 -30 -130L-40 -158H40L30 -130Q96 -110 80 0Z", "#c98a3a", "#a86a2a", 0, 8)}${at(0, -70, coin(36, "B"))}`, Math.max(0.01, land)) : "";
    scale = at(SX, G, balance(tilt, L, R), SK * pop(u1 + 0.2));
    const drop = seg(u1, 2.2, 2.95), pts = [[0, 30], [50, 10], [100, 26], [150, 0], [200, lerp(0, 120, drop)]];
    scale += u1 > 1.6 ? at(SX - 260, G - 480, `${two(rr(-130, -80, 260, 160, 16), "#2c1f63", "#1b1550", 0, 8)}${at(-150, -50, coin(26, "B"))}<path d="M-100 -20${pts.map(([x, y]) => `L${x - 100} ${y - 20}`).join("")}" fill="none" stroke="${drop > 0.1 ? P.red : P.green}" stroke-width="9" stroke-linejoin="round"/>${drop > 0.5 ? text(84, 60, "?", 64, P.red) : ""}`, pop(u1 - 1.6)) : "";
  }
  // shot 2: the pool's arm takes the bag and sells it; a stopwatch at 1 s; the borrower's phone stays silent
  let arm = "";
  if (u2 > 0) { const reach = ease(seg(u2, 0.0, 0.3)) * (1 - ease(seg(u2, 0.75, 1.15))), ax0 = PX + 240, ay0 = G - 230, ax1 = SX + 238 * SK * 1.0, ay1 = G - 330, hx = lerp(ax0, ax1, reach), hy = lerp(ay0, ay1, reach);
    arm = `<path d="M${ax0} ${ay0}Q${(ax0 + hx) / 2} ${Math.min(ay0, hy) - 140} ${hx} ${hy}" fill="none" stroke="${P.red}" stroke-width="24" stroke-linecap="round"/>${at(hx, hy, `<path d="M-30 0l-14 34M30 0l14 34" stroke="${P.redD}" stroke-width="14" stroke-linecap="round"/>${u2 > 0.3 && u2 < 1.15 ? at(0, 60, `${two("M-56 0Q-66 -76 -22 -90H22Q66 -76 56 0Z", "#c98a3a", "#a86a2a", 0, 6)}`, 0.8) : ""}`)}`;
    arm += u2 > 0.9 ? at(SX - 40, G - 160, tag("SOLD", P.red, "#fff", 52), pop(u2 - 0.9), -6) : "";
    arm += at(PX - 240, G - 480, clock(clamp(u2 / 1.0) * 60, 80, { sweep: P.red }), pop(u2 - 0.05)) + (u2 > 0.4 ? at(PX - 240, G - 360, tag("1 s", P.red, "#fff", 44), pop(u2 - 0.4)) : "");
    arm += u2 > 1.55 ? at(BORROW[0] - 20, G - 460, `${two(rr(-50, -86, 100, 172, 18), "#2c1f63", P.ink, 0, 6)}<path d="${rr(-40, -72, 80, 130, 8)}" fill="#1b1550"/><path d="M-20 6q0 -40 20 -40q20 0 20 40l9 9h-58Z" fill="${P.steel}"/>${u2 > 1.95 ? `<path d="M-34 -44L34 34" stroke="${P.red}" stroke-width="10" stroke-linecap="round"/>` : ""}`, pop(u2 - 1.55)) : "";
  }
  const back = `<path d="M600 ${G - 200}H1600V${G}H600Z" fill="#24124d"/><path d="M600 ${G - 200}H1600" stroke="#3a2470" stroke-width="8"/>` + LENDERS.map(([x, c, cD]) => at(x, G - 200, house(c, cD, { lit: [1, 1, 1] }), 0.62)).join("");
  const bor = at(BORROW[0], G, house(BORROW[1], BORROW[2], { lit: [1, lent > 0 ? 1 : 0, 1] }), 0.85)
    + (lent > 0 ? at(BORROW[0] - 140, G - 20, Array.from({ length: lent }, (_, i) => `<ellipse cx="0" cy="${-i * 16}" rx="32" ry="10" fill="${i % 2 ? P.goldD : P.gold}"/>`).join("")) : "");
  return bk + back + at(PX, G, pool(level, { id: "w7" }), PK) + bor + scale + coins + arm;
}
const sky7 = (c) => layer(skyline(41, -900, 3200, G - 120, 80, 260, "#221a5c", "#ffb066"), c, 0.45);
function s0(a, tot, s) { const c = camAt(a, [[0, BX, 560, 1.55], [1.95, BX + 60, 560, 1.5], [2.7, 1130, 560, 1.12], [6.02, 1140, 565, 1.12]]);
  return { g: night(c, tot) + sky7(c) + layer(ground(G) + world(a, tot, s), c) }; }
function s1(a, tot, s) { const T1 = (s.ends || [])[0] || 6.02, c = camAt(a, [[0, 1140, 565, 1.12], [0.7, 1660, 600, 1.5], [3.35, 1670, 600, 1.53]]);
  return { g: night(c, tot) + sky7(c) + layer(ground(G) + world(T1 + a, tot, s), c) }; }
function s2(a, tot, s) { const E = s.ends || [], T2 = (E[0] || 6.02) + (E[1] || 3.35), c = camAt(a, [[0, 1670, 600, 1.53], [0.5, 1500, 580, 1.25], [2.95, 1510, 580, 1.27]]);
  return { g: night(c, tot) + sky7(c) + layer(ground(G) + world(T2 + a, tot, s), c), out: toScreen(c, SX - 40, G - 160), outC: P.red, outZ: 18 }; }

// ---- 3: a swap machine: no company, no opening hours, no ID ----
function s3(a, tot) {
  const c = camAt(a, [[0, 420, 640, 1.35], [1.3, 1120, 600, 1.12], [4.55, 1135, 600, 1.14]]), Gs = 900, MX = 560;
  // the machine: two slots, a gold coin goes in on the left, a teal token comes out on the right
  const inP = seg(a, 0.45, 0.85), outP = seg(a, 0.85, 1.25), turn = a > 0.6 && a < 1.2 ? Math.sin(a * 30) * 3 : 0;
  const machine = at(MX, Gs, `${two(rr(-200, -420, 400, 420, 30), P.violet, P.violetD, 0, 12)}<path d="${rr(-150, -360, 300, 160, 18)}" fill="#1b1550"/>
    <path d="M-80 -280h120m-24 -22l24 22l-24 22" fill="none" stroke="#9fe7ff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" transform="translate(20 0)"/>
    <path d="${rr(-170, -160, 80, 26, 10)}" fill="${P.ink}"/><path d="${rr(90, -110, 80, 26, 10)}" fill="${P.ink}"/>`, 1, turn);
  const cin = inP > 0 && inP < 1 ? at(lerp(MX - 360, MX - 130, ease(inP)), lerp(Gs - 330, Gs - 150, easeIn(inP)), coin(40, "B")) : a < 0.45 ? at(MX - 360, Gs - 330, coin(40, "B"), pop(a + 0.2)) : "";
  const cout = outP > 0 ? at(lerp(MX + 130, MX + 330, ease(outP)), lerp(Gs - 100, Gs - 260, ease(outP)) + (outP >= 1 ? 6 * Math.sin(tot * 3) : 0), `${disc(0, 0, 40, P.teal, P.tealD)}<circle r="28" fill="none" stroke="${P.tealD}" stroke-width="5"/>`) : "";
  // what it doesn't need: a company, opening hours, your name — each pops and gets crossed out
  const items = [[1060, 1.55, at(0, 0, tower({ h: 520 }), 0.6)], [1400, 2.35, at(0, -170, `${clock(15, 120)}${at(0, 175, tag("9 – 5", P.cream, P.ink, 44))}`)], [1740, 3.15, at(0, -170, `${two(rr(-120, -78, 240, 156, 16), P.cream, P.creamD, 0, 8)}<circle cx="-60" cy="-14" r="30" fill="#9fb0ff"/><path d="M-100 52q40 -60 80 0" fill="#9fb0ff"/><path d="M10 -40h80M10 -10h70M10 20h80" stroke="#c9b48a" stroke-width="10" stroke-linecap="round"/>`, 1.3)]];
  let ix = "";
  items.forEach(([x, t0, art], i) => { if (a < t0 - 0.35) return; ix += at(x, Gs - 40, art, pop(a - t0 + 0.35)) + (a > t0 + 0.25 ? at(x, Gs - 420, cross(0, 0, 70, P.red, a - t0 - 0.25)) : ""); });
  const g = night(c, tot, 73) + layer(ground(Gs) + machine + cin + cout + ix, c);
  return { g, in: toScreen(c, MX - 360, Gs - 330), inC: P.gold, inZ: 18, out: toScreen(c, 1740, Gs - 420), outC: P.red, outZ: 18 };
}

// ---- 4: the pool's code panel cracks ----
function s4(a, tot) {
  const c = camAt(a, [[0, PX - 66, G - 250, 2.6], [1.36, PX - 66, G - 250, 2.75]]);
  const g = night(c, tot) + layer(ground(G) + at(PX, G, pool(0.5, { id: "c7", crack: ease(seg(a, 0.2, 1.0)) }), PK) + (a > 0.9 ? rings(PX - 66, G - 253, 120 * spring(a - 0.9, 9, 14), P.red, 0.25) : ""), c);
  return { g, in: toScreen(c, PX - 66, G - 250), inC: P.red, inZ: 16, out: toScreen(c, PX - 66, G - 250), outC: P.ink, outZ: 18 };
}

// ---- 5: nobody to go back to; the 2016 machine flashes up (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1000, 520, 1.15], [2.36, 1040, 520, 1.2]]), Gw = 860, WX = 820;
  const web = seg(a, 0.0, 0.6);
  const win = at(WX, Gw, `${two(rr(-330, -560, 660, 560, 10), "#5a6aa8", "#44529a", 0, 10)}<path d="${rr(-220, -430, 440, 260, 14)}" fill="#0d0b33"/>
    <path d="M-220 -170h440" stroke="${P.steel}" stroke-width="18"/>${at(0, -490, tag("HELP", P.cream, P.ink, 46))}
    ${web > 0 ? `<g opacity="${web.toFixed(2)}" stroke="#cfd5ee" stroke-width="3" fill="none"><path d="M-220 -430l120 120M-220 -430l50 140M-220 -430l140 40"/><path d="M-190 -400q30 -10 40 20M-170 -370q50 -14 70 30M-150 -340q70 -20 100 40"/></g>` : ""}
    <path d="${rr(-60, -100, 120, 100, 6)}" fill="${P.ink}"/>`);
  // the flashback: the 2016 machine with its red bar, cracked, on a calendar
  const fl = seg(a, 0.8, 1.05) * (1 - seg(a, 1.75, 2.0)), flash = a > 0.8 && a < 2.0;
  const back = flash ? at(1420, 620, `<path d="${rr(-260, -330, 520, 520, 26)}" fill="#1b1550" stroke="${P.red}" stroke-width="8"/>${at(-40, 160, vending({ light: "ok", bad: 2, run: (a * 2) % 1, item: can(P.red), drop: 0 }), 0.75)}${drawn("M-170 -260L-110 -170L-150 -120L-60 -40", 1, P.red, 8)}${at(170, -230, calPage("2016", "", 1, 120), 0.5, 6)}`, 0.85 * pop(a - 0.8)) : "";
  const g = night(c, tot, 79) + layer(ground(Gw) + win + `<g opacity="${flash ? (1 - 0.3 * fl).toFixed(2) : 1}"></g>`, c) + (flash ? `<rect width="${FW}" height="${FH}" fill="#0d0b33" opacity="${(0.35 * fl).toFixed(2)}"/>` + layer(back, c) : "");
  return { g, in: toScreen(c, WX, Gw - 300), inC: "#0d0b33", inZ: 16 };
}

// ---- 6: a hundred times over: pools drain into sacks; 2022, $3,000,000,000+ ----
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.12], [5.46, 960, 550, 1.06]]), Gp = 860, XS = [260, 610, 960, 1310, 1660];
  let g = "";
  XS.forEach((x, i) => { const t0 = 0.05 + i * 0.2, d = seg(a, t0, t0 + 0.9), lvl = 0.75 * (1 - d);
    g += at(x, Gp - 160, pool(lvl, { id: "d" + i, crack: seg(a, t0 - 0.05, t0 + 0.2) }), 0.62);
    // coins pour out of the outflow into a dark sack that swells
    const sx = x + 150, sy = Gp + 30, sw = 0.7 + 0.7 * d;
    if (d > 0 && d < 1) for (let k = 0; k < 3; k++) { const p = ((a - t0) * 2.2 + k / 3) % 1; g += at(lerp(x + 190, sx, p), lerp(Gp - 190, sy - 70, p * p), coin(16, "")); }
    g += at(sx, sy, `${two("M-60 0Q-74 -90 -22 -104L-30 -126H30L22 -104Q74 -90 60 0Z", "#6a5aa8", "#4b3d8f", 0, 8)}${text(0, -36, "$", 40, P.gold)}`, sw * pop(a - t0)); });
  const val = Math.round(3000000000 * ease(seg(a, 1.4, 4.6)));
  g += a > 1.3 ? at(900, 300, `${two(rr(-420, -70, 840, 140, 30), "#2c1f63", "#1b1550", 0, 8)}${text(0, 30, "$" + val.toLocaleString("en") + (a > 4.6 ? "+" : ""), 84, P.red)}`, pop(a - 1.3)) : "";
  g += a > 1.4 ? at(1520, 300, calPage("2022", "", 1, 130), 0.7 * pop(a - 1.4), 6) : "";
  return { g: night(c, tot, 83) + layer(ground(Gp) + g, c) };
}

// ---- 7: the bank at least has a door to knock on; the pool has none ----
function s7(a, tot) {
  const c = camAt(a, [[0, 980, 640, 1.3], [3.14, 990, 640, 1.33]]), Gb = 880;
  const knock = a > 1.2 && a < 2.9 ? Math.abs(Math.sin((a - 1.2) * 11)) : 0;
  const door = `<path d="M-90 -40V-250A90 90 0 0 1 90 -250V-40Z" fill="${P.wood}"/><path d="M0 -40V-330" stroke="${P.woodD}" stroke-width="8"/><circle cx="50" cy="-150" r="20" fill="none" stroke="${P.gold}" stroke-width="9"/>`;
  const bk = at(560, Gb, bank({ night: true, inner: door }), 0.85);
  const hx = lerp(920, 800, ease(seg(a, 0.3, 1.0)));
  const hs = at(hx, Gb, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.8, -8 * knock);
  const rip = knock > 0.6 ? [1, 2].map((k) => `<circle cx="600" cy="${Gb - 130}" r="${40 * k + 30 * knock}" fill="none" stroke="${P.gold}" stroke-width="5" opacity="${(0.6 / k).toFixed(2)}"/>`).join("") : "";
  // the pool: no door anywhere, a dashed outline where one would be, crossed out
  const pl = at(1440, Gb, pool(0.6, { id: "nd" }), 0.9) + (a > 0.9 ? at(1440, Gb - 330, `<path d="M-60 0V-120A60 60 0 0 1 60 -120V0Z" fill="none" stroke="${P.cream}" stroke-width="6" stroke-dasharray="14 10"/>`, pop(a - 0.9)) + (a > 1.5 ? at(1440, Gb - 400, cross(0, 0, 50, P.red, a - 1.5)) : "") : "");
  return { g: night(c, tot, 89) + layer(ground(Gb) + bk + hs + rip + pl, c) };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7];
export const c5s7Set = makeSet(SHOTS, V, P);
