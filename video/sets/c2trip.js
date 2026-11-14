// Crypto part 2, "the trip of one transfer": seven wordless shots, one per board beat (shots.md, scene trip).
//   0 a slip leaves the blue house; a ring spreads over the night planet and lights the laptops one by one
//   1 the waiting room: slips on benches with their stacks of fee coins; the tallest stacks go through the door first
//   2 our slip goes through the door and becomes a row in the page
//   3 pages stack on top of ours, a check for each, six of them; a clock sweeps an hour
//   4 a narrow lane with a gate (7 / s) under a highway of cards (1000s / s); a padlock lights over the lane
//   5 the room overflows; the fee tag catches fire and rolls $1 to $55 (DEC 2017); a $3 coffee is crossed out and slides off
//   6 a bolt-shaped line between the blue and pink houses: coins zip on it, a tab sums them, one row drops into the chain;
//     then the grocer's counter with the same tab
// Host beats: 4 and 6 host right, 5 host left; that lower corner is kept clear.
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2trip.v.js";
import { P, mix, house, book, coin, stars, skyline } from "./bank.js";
import { laptop, globe, padlock, calPage, stall } from "./props.js";
import { slip, page, link, clock, WHO } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);
const OURS = ["blue", "pink", "30"];

// ---- 0: broadcast over the planet ----
const GX = 960, GY = 700, R = 360, TH = -0.62;
const onRim = (th, lift = 0) => [GX + (R + lift) * Math.sin(th), GY - (R + lift) * Math.cos(th)];
const RIM = [-0.2, 0.15, 0.45, 0.85, 1.3, 1.8, 2.3, -1.6, -2.1, -2.6, 2.75, -2.95];
const DOTS = Array.from({ length: 18 }, (_, i) => { const r = Math.sqrt(rnd(i * 5 + 3)) * 0.8 * R, an = rnd(i * 5 + 4) * 6.283; return [GX + r * Math.cos(an), GY + r * Math.sin(an)]; });
function s0(a, tot) {
  const c = camAt(a, [[0, 800, 330, 1.55], [1.9, 790, 320, 1.5], [3.0, 960, 590, 0.95], [4.34, 960, 595, 0.94]]);
  const hp = onRim(TH), go = ease(seg(a, 1.0, 1.8)), sp = bez(onRim(TH, 40), onRim(TH + 0.25, 200), onRim(TH, 250), go);
  const front = a > 2.4 ? (a - 2.4) * 1150 : -1, lit = (x, y) => front > 0 && Math.hypot(x - sp[0], y - sp[1]) < front;
  const flash = (x, y) => { const d = front - Math.hypot(x - sp[0], y - sp[1]); return d > 0 ? Math.exp(-d / 220) : 0; };
  let g = at(GX, GY, globe(R, tot * 0.01, { night: 0.35 }));
  DOTS.forEach(([x, y], i) => { const on = lit(x, y), f = flash(x, y); g += at(x, y, (f > 0.05 ? rings(0, -100, 120 + 60 * f, P.gold, 0.35 * f) : "") + laptop(on ? "#fff3c2" : "#5a6aa8", on ? `<path d="M-90 -150h120M-90 -110h160M-90 -70h90" stroke="${P.goldD}" stroke-width="16" stroke-linecap="round"/>` : ""), 0.26); });
  RIM.forEach((th, i) => { const [x, y] = onRim(th), on = lit(x, y), f = flash(x, y); g += at(x, y, (f > 0.05 ? rings(0, -110, 150 + 70 * f, P.gold, 0.35 * f) : "") + laptop(on ? "#fff3c2" : "#5a6aa8", on ? `<path d="M-90 -150h120M-90 -110h160M-90 -70h90" stroke="${P.goldD}" stroke-width="16" stroke-linecap="round"/>` : ""), 0.36, th * 180 / Math.PI); });
  g += at(hp[0], hp[1], house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.62, TH * 180 / Math.PI);
  const ring = front > 0 && front < 2200 ? `<circle cx="${sp[0].toFixed(1)}" cy="${sp[1].toFixed(1)}" r="${front.toFixed(1)}" fill="none" stroke="${P.gold}" stroke-width="${(12 * (1 - front / 2200)).toFixed(1)}" opacity="${(0.8 * (1 - front / 2200)).toFixed(2)}"/>` : "";
  const waves = a > 2.0 ? [0, 1, 2].map((k) => { const u = ((a - 2.0) * 1.6 + k / 3) % 1; return `<circle cx="${sp[0]}" cy="${sp[1]}" r="${(90 + 130 * u).toFixed(1)}" fill="none" stroke="${P.cream}" stroke-width="6" opacity="${(0.5 * (1 - u)).toFixed(2)}"/>`; }).join("") : "";
  const theSlip = a > 0.9 ? at(sp[0], sp[1] + 5 * Math.sin(tot * 3), rings(0, 0, 120, P.gold, 0.15) + slip(...OURS), (0.3 + 0.7 * pop(a - 0.95)) * 0.9, TH * 50 * (1 - go)) : "";
  g += ring + waves + theSlip;
  return { g: night(c, tot, 5) + layer(g, c), out: toScreen(c, sp[0], sp[1]), outC: P.cream, outZ: 18 };
}

// ---- 1, 2, 5: the waiting room ----
const FLOOR = 830, DOOR = [1680, 600];
// the slips on the benches: [x, y, who, to, amount, fee]; index 0 is ours
const SEATS = [[640, FLOOR - 10, ...OURS, 1], [300, FLOOR - 10, "teal", "violet", "5", 4], [980, FLOOR - 10, "pink", "teal", "12", 2], [1300, FLOOR - 10, "violet", "blue", "7", 6],
  [380, 560, "pink", "blue", "9", 1], [720, 560, "teal", "pink", "40", 5], [1060, 560, "blue", "teal", "3", 2], [1380, 560, "violet", "pink", "20", 3]];
const ORDER = [3, 5, 1];   // the tallest stacks go first
const stack = (n, x, y) => Array.from({ length: n }, (_, i) => `<ellipse cx="${x}" cy="${y - i * 16}" rx="30" ry="11" fill="${P.goldD}"/><ellipse cx="${x}" cy="${y - i * 16 - 4}" rx="30" ry="11" fill="${P.gold}"/>`).join("");
function room(t, c, tot, o = {}) {
  const wall = `<rect x="-600" y="-400" width="3200" height="${FLOOR + 400}" fill="#3a2470"/><rect x="-600" y="${FLOOR - 160}" width="3200" height="160" fill="#2f1d5e"/><rect x="-600" y="${FLOOR}" width="3200" height="600" fill="#24164f"/>
    ${[200, 760, 1220].map((x) => `<path d="${rr(x, 120, 180, 150, 14)}" fill="#20154a"/>${stars(x, 8, x + 10, x + 170, 140, tot).replace(/cy="([\d.]+)"/g, (m, v) => `cy="${(+v + 125).toFixed(1)}"`)}`).join("")}`;
  const doorLight = o.doorGlow ?? 1;
  const door = `${rings(DOOR[0], DOOR[1], 260, "#fff3c2", 0.12 * doorLight)}<path d="${rr(DOOR[0] - 140, DOOR[1] - 270, 280, FLOOR - DOOR[1] + 270, 20)}" fill="#5b3aa6"/><path d="${rr(DOOR[0] - 120, DOOR[1] - 250, 240, FLOOR - DOOR[1] + 250, 14)}" fill="#fff3c2"/>`
    + at(DOOR[0], DOOR[1] - 20, page({ rows: o.rows || [["teal", "violet", "5"], ["violet", "blue", "7"], ["teal", "pink", "40"]], prev: 2 }), 0.62);
  const bx0 = o.hideLeft || 160, bench = (y) => `${two(rr(bx0, y, 1500 - bx0, 26, 10), P.wood, P.woodD, 0, 8)}${[220, 820, 1420].filter((x) => x > bx0).map((x) => `<rect x="${x}" y="${y + 20}" width="20" height="${FLOOR - y - 20 > 0 ? FLOOR - y - 20 : 60}" fill="${P.woodD}"/>`).join("")}`;
  let seats = "";
  SEATS.forEach(([x, y, f, to, amt, fee], i) => { if (x < (o.hideLeft || 0)) return; const k = ORDER.indexOf(i), t0 = k >= 0 ? 3.3 + k * 0.5 : 99, u = seg(t, t0, t0 + 0.55);
    if (u >= 1) return;
    let px = x, py = y - 56, sc = 0.95, r = 0;
    if (i === 0 && o.go > 0) { const b = bez([x, y - 56], [(x + DOOR[0]) / 2, y - 360], [DOOR[0], DOOR[1] - 40], ease(o.go)); px = b[0]; py = b[1]; sc = lerp(0.95, 0.4, ease(o.go)); }
    else if (u > 0) { const b = bez([x, y - 56], [(x + DOOR[0]) / 2, Math.min(y, DOOR[1]) - 300], [DOOR[0], DOOR[1] - 40], ease(u)); px = b[0]; py = b[1]; sc = lerp(0.95, 0.35, ease(u)); r = 20 * Math.sin(u * 3.14); }
    const hopIdle = i === 0 ? 0 : 4 * Math.sin(tot * 3 + i);
    const wait = i === 0 && t > 3.3 && t < 5.4 && !(o.go > 0) ? 3 * Math.sin(t * 30) * Math.exp(-((t - 3.3) % 0.5) * 6) : 0;
    seats += (u <= 0 && !(i === 0 && o.go > 0) ? stack(fee, x + 125, y - 6) : "") + at(px + wait, py + hopIdle, (i === 0 ? rings(0, 0, 130, P.gold, 0.16) : "") + slip(f, to, amt), sc, r);
    if (u > 0) seats += stack(fee, px + 90 * sc, py + 50 * sc).replace(/<ellipse/g, `<ellipse opacity="${(1 - u).toFixed(2)}"`); });
  return wall + door + bench(560 + 0) + bench(FLOOR - 40) + seats;
}
function s1(a, tot) {
  const c = camAt(a, [[0, 700, 650, 1.6], [1.0, 760, 620, 1.35], [2.9, 960, 560, 1.0], [5.45, 990, 555, 1.02]]);
  return { g: layer(room(a, c, tot), c), in: toScreen(c, 640, FLOOR - 66), inC: P.cream, inZ: 18, out: toScreen(c, DOOR[0], DOOR[1]), outC: "#fff3c2", outZ: 14 };
}
function s2(a, tot) {
  const go = seg(a, 0.0, 0.55), row = seg(a, 0.5, 0.85);
  const c = camAt(a, [[0, 1100, 560, 1.05], [0.35, 1300, 560, 1.3], [1.22, DOOR[0], DOOR[1] - 30, 2.4]]);
  const rows = [["teal", "violet", "5"], ["violet", "blue", "7"], ["teal", "pink", "40"]];
  if (row > 0) rows.push([...OURS.slice(0, 2), OURS[2], mix(P.ink, P.goldD, row)]);
  let g = room(9, c, tot, { go: go < 1 ? go : 0, rows });
  if (go >= 1 && row < 1) g += at(DOOR[0], DOOR[1] - 40, slip(...OURS), 0.4 * (1 - row));
  if (row > 0) g += rings(DOOR[0] - 30, DOOR[1] - 20 + (-74 + 3 * 38) * 0.62, 90 * spring(row, 8, 14), P.gold, 0.25 * (1 - seg(a, 0.9, 1.2)));
  return { g: layer(g, c), in: toScreen(c, DOOR[0], DOOR[1]), inC: "#fff3c2", inZ: 14, out: toScreen(c, DOOR[0], DOOR[1] - 20), outC: P.cream, outZ: 16 };
}

// ---- 3: six pages on top of ours, an hour ----
function s3(a, tot) {
  const B = 860, GAP = 310, K = 0.85;
  const c = camAt(a, [[0, 960, 760, 1.35], [0.6, 960, 700, 1.2], [4.2, 1010, -60, 0.49], [5.4, 1010, -70, 0.48], [9.7, 1010, -70, 0.475]]);
  let g = "";
  const ourRows = [["teal", "violet", "5"], ["violet", "blue", "7"], ["teal", "pink", "40"], [...OURS, P.goldD]];
  for (let k = 0; k <= 6; k++) { const t0 = k === 0 ? -1 : 0.3 + (k - 1) * 0.62, p = k === 0 ? 1 : seg(a, t0, t0 + 0.45); if (p <= 0) continue;
    const y = B - k * GAP - (1 - easeOut(p)) * 500, rws = k === 0 ? ourRows : [["pink", "blue", String(3 + k)], ["teal", "pink", String(10 + k * 3)], ["violet", "teal", String(k * 7)]];
    if (k > 0 && p >= 1) g += link(960, y + 125, 960, y + GAP - 125, P.gold, seg(a, t0 + 0.4, t0 + 0.6));
    g += at(960, y, (k === 0 ? rings(0, 0, 260, P.gold, 0.14 + 0.05 * Math.sin(tot * 3)) : "") + page({ rows: rws, seal: 10 + k, prev: k ? 9 + k : 2, block: 1 }), K);
    if (k > 0) g += at(1280, y, check(0, 0, 70, P.green, a - t0 - 0.3) + (a > t0 + 0.4 ? text(150, 50, String(k), 150, P.cream) : ""), 1); }
  const clk = a > 3.9 ? at(420, 540, rings(0, 0, 210, P.gold, 0.15) + clock(60 * ease(seg(a, 4.4, 5.3)), 160), pop(a - 3.9)) : "";
  return { g: night(c, tot, 13) + layer(g, c) + clk, in: toScreen(c, 960, B), inC: P.cream, inZ: 16 };
}

// ---- 4: a narrow lane and a highway ----
function s4(a, tot) {
  const LANE = 820, HW = 400, GATE = 880;
  const c = camAt(a, [[0, 760, 720, 1.4], [2.3, 790, 700, 1.3], [3.1, 940, 560, 1.0], [7.32, 950, 560, 1.01]]);
  const ground = `<rect x="-800" y="${HW + 120}" width="3600" height="900" fill="#2a1556"/><rect x="-800" y="${HW - 110}" width="3600" height="220" fill="#1f1a4a"/>${[-60, 0, 60].map((d) => `<path d="M-800 ${HW + d}H2800" stroke="#5a6aa8" stroke-width="6" stroke-dasharray="40 40" stroke-dashoffset="${(-tot * 900) % 80}"/>`).join("")}
    <path d="M-800 ${LANE - 40}H1480Q1520 ${LANE} 1480 ${LANE + 40}H-800Z" fill="#1f0f47"/>`;
  // the cards on the highway, a flood
  let cards = "";
  if (a > 2.5) for (let i = 0; i < 46; i++) { const lane = i % 3, sp = 1500 + rnd(i) * 500, x = ((tot * sp + rnd(i + 9) * 3600) % 3600) - 800, y = HW - 60 + lane * 60, col = [P.pink, P.teal, P.gold, P.blue, P.violet][i % 5];
    cards += `<g transform="translate(${x.toFixed(0)} ${y})"><path d="M-160 0h120" stroke="${col}" stroke-width="6" opacity=".35"/><path d="${rr(-34, -20, 68, 40, 6)}" fill="${col}"/><path d="M-34 -8h68" stroke="${P.ink}" stroke-width="6"/></g>`; }
  // the lane: slips one at a time through a gate
  let lane = "", period = 1.05;
  for (let i = 0; i < 9; i++) { const t = a - i * period; if (t < 0) continue; const x = t < 0.6 ? lerp(-200, GATE - 150, ease(t / 0.6)) : t < 0.9 ? GATE - 150 : lerp(GATE - 150, 1700, ease((t - 0.9) / 0.9)); if (x > 1500) continue; lane += at(x, LANE - 62, slip(...[["blue", "pink", "30"], ["teal", "violet", "5"], ["pink", "teal", "12"]][i % 3]), 0.85); }
  const lift = Math.max(...Array.from({ length: 9 }, (_, i) => { const t = a - i * period - 0.6; return t > 0 && t < 0.7 ? Math.sin(Math.PI * t / 0.7) : 0; }));
  const gate = `<rect x="${GATE - 10}" y="${LANE - 190}" width="22" height="150" fill="${P.steel}"/>${disc(GATE, LANE - 190, 22, P.red, P.redD)}<g transform="rotate(${(70 * lift).toFixed(1)} ${GATE} ${LANE - 190})"><path d="${rr(GATE - 330, LANE - 200, 330, 22, 10)}" fill="${P.cream}"/>${[0, 1, 2].map((i) => `<path d="${rr(GATE - 300 + i * 100, LANE - 200, 44, 22, 0)}" fill="${P.red}"/>`).join("")}</g>`;
  const lock = a > 4.5 ? at(GATE, LANE - 380, rings(0, 0, 150 * (1 + 0.04 * Math.sin(tot * 4)), P.gold, 0.25) + padlock(1.6, 0), pop(a - 4.5)) : "";
  const shine = a > 4.8 ? `<path d="M${GATE - 300} ${LANE - 380}L${GATE - 700} ${LANE + 80}H${GATE + 700}L${GATE + 300} ${LANE - 380}Z" fill="#ffd98a" opacity="${(0.08 * seg(a, 4.8, 5.4)).toFixed(3)}"/>` : "";
  const l1 = a > 1.0 ? at(300, LANE + 140, text(0, 0, "7 / s", 110, P.cream), pop(a - 1.0)) : "";
  const l2 = a > 2.9 ? at(1360, HW - 150, text(0, 0, "1000s / s", 96, P.gold), pop(a - 2.9)) : "";
  const g = night(c, tot, 29) + layer(skyline(41, -800, 2800, HW - 110, 80, 260, "#2a1d66", "#ffb066"), c, 0.5) + layer(ground + cards + shine + gate + lane + lock + l1 + l2, c);
  return { g, out: toScreen(c, GATE, LANE - 380), outC: P.gold, outZ: 18 };
}

// ---- 5: rush hour ----
const feeTag = (v, burn, tot) => { const fl = burn > 0 ? [-90, -40, 10, 60, 100].map((x, i) => { const h = (90 + 50 * Math.sin(tot * 9 + i * 2)) * burn; return `<path d="M${x - 34} -50Q${x - 20} ${-50 - h * 0.6} ${x} ${-50 - h}Q${x + 20} ${-50 - h * 0.6} ${x + 34} -50Z" fill="${i % 2 ? P.red : "#ff8a3d"}"/><path d="M${x - 16} -50Q${x} ${-50 - h * 0.5} ${x + 16} -50Z" fill="${P.gold}"/>`; }).join("") : "";
  return `${fl}${two("M-150 -70h240l70 70l-70 70h-240Z", P.gold, P.goldD, 0, 10)}<circle cx="100" cy="0" r="14" fill="${P.ink}"/>${text(-30, 46, "$" + v, 130, P.ink)}`; };
function s5(a, tot) {
  const c = camAt(a, [[0, 1000, 420, 1.5], [1.0, 1020, 450, 1.3], [4.8, 1150, 480, 1.12], [8, 1160, 485, 1.1]]);
  let g = room(99, c, tot, { doorGlow: 0.4, hideLeft: 700 });
  // the crowd: slips piling up everywhere except the host's corner
  for (let i = 0; i < 34; i++) { const t0 = 0.1 + rnd(i * 3) * 0.9, x = 700 + rnd(i * 3 + 1) * 1000, y = 300 + rnd(i * 3 + 2) * 560; if (a < t0) continue;
    g += at(x, y + 3 * Math.sin(tot * 4 + i), slip(["blue", "pink", "teal", "violet"][i % 4], ["pink", "teal", "violet", "blue"][i % 4], String(1 + (i * 7) % 40)), 0.6 * pop(a - t0), (rnd(i) - 0.5) * 30); }
  const burn = seg(a, 1.3, 1.9), v = Math.round(kf(a, [[1.6, 1], [4.6, 55]], (p) => p * p));
  g += at(980, 400, rings(0, 0, 230, burn > 0 ? P.red : P.gold, 0.18) + feeTag(v, burn, tot), 1 + 0.06 * Math.sin(tot * 6) * burn);
  g += a > 2.9 ? at(1480, 300, calPage("2017", "DEC", 1, 120), 0.75 * pop(a - 2.9)) : "";
  const slide = easeOut(seg(a, 6.6, 7.6)) * 900, cup = a > 5.3 ? at(1600 + slide, 860, `${two("M-80 -150h160l-20 150h-120Z", P.cream, P.creamD, 0, 8)}<path d="M80 -120q60 0 50 50q-10 40 -60 30" fill="none" stroke="${P.creamD}" stroke-width="16"/><path d="M-30 -180q-20 -30 0 -60M20 -180q-20 -30 0 -60" fill="none" stroke="${P.cream}" stroke-width="8" stroke-linecap="round" opacity=".6"/>${at(0, -60, text(0, 20, "$3", 64, P.redD))}${cross(110, -170, 40, P.red, a - 6.0)}`, 1.3 * pop(a - 5.3)) : "";
  g += cup;
  return { g: layer(g, c), in: toScreen(c, 980, 400), inC: P.gold, inZ: 18, out: toScreen(c, 980, 400), outC: P.gold, outZ: 18 };
}

// ---- 6: Lightning, a tab over the big book ----
function s6(a, tot) {
  const G = 560, BH = [380, G], PH = [1300, G], CH = 900, NB = [840, 200], ST = [-640, 900];
  const c = camAt(a, [[0, 840, 400, 1.6], [2.6, 840, 560, 1.15], [5.9, 850, 580, 1.12], [6.6, -640, 660, 1.5], [7.65, -650, 660, 1.53]]);
  const ground = `<rect x="-1400" y="${G}" width="4000" height="140" fill="#2a1556"/><rect x="-1400" y="${G + 140}" width="4000" height="700" fill="#1f0f47"/>`;
  const houses = at(BH[0], BH[1], house(P.blue, P.blueD), 0.85) + at(PH[0], PH[1], house(P.pink, P.pinkD), 0.85);
  // the chain below
  let chain = ""; [300, 620, 940, 1260].forEach((x, i) => { if (i) chain += link(x - 210, CH, x - 110, CH, P.gold); chain += at(x, CH, page({ rows: [["teal", "pink", "8"], ["violet", "blue", "4"], ...(i === 3 && a > 5.3 ? [["blue", "pink", "12", P.goldD]] : [])], seal: 20 + i, prev: 19 + i, block: 1 }), 0.55); });
  // the bolt-shaped line
  const zz = `M480 380L620 320L700 400L840 320L960 400L1060 320L1200 380`, draw = ease(seg(a, 2.5, 3.1));
  const bolt = draw > 0 ? `<path d="${zz}" fill="none" stroke="${P.gold}" stroke-width="30" stroke-linejoin="round" opacity=".25"/>${`<path d="${zz}" pathLength="1" fill="none" stroke="#fff3c2" stroke-width="12" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="${draw.toFixed(3)} 1"/>`}` : "";
  const pts = [[480, 380], [620, 320], [700, 400], [840, 320], [960, 400], [1060, 320], [1200, 380]], along = (p) => { const s = p * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(s)), f = s - k; return [lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)]; };
  let coins = "", trips = 0;
  for (let i = 0; i < 6; i++) { const t0 = 3.4 + i * 0.16, u = seg(a, t0, t0 + 0.2); if (u >= 1) trips++; if (u <= 0 || u >= 1) continue; const p = i % 2 ? 1 - u : u, [x, y] = along(p); coins += at(x, y, rings(0, 0, 40, P.gold, 0.3) + coin(26)); }
  // the tab: one tally per trip, then one row drops into the chain
  const tally = (n) => Array.from({ length: n }, (_, i) => `<path d="M${-110 + i * 26} -50v60" stroke="${P.ink}" stroke-width="9" stroke-linecap="round"/>`).join("");
  const nbShow = a > 3.3 ? at(NB[0], NB[1], book(at(-75, 10, tally(Math.min(trips, 5))) + (trips > 5 ? `<path d="M-120 -10L30 -40" stroke="${P.red}" stroke-width="9" stroke-linecap="round"/>` : "")), 0.6 * pop(a - 3.3)) : "";
  const dropP = seg(a, 4.5, 5.4), drop = dropP > 0 && dropP < 1 ? at(...bez([NB[0], NB[1] + 60], [1150, 360], [1260, CH - 40], ease(dropP)), slip("blue", "pink", "12"), 0.6) : "";
  const landed = a > 5.3 ? rings(1260, CH, 160 * spring(a - 5.3, 8, 14), P.gold, 0.25 * (1 - seg(a, 5.6, 6.0))) : "";
  // the grocer's counter, with the same tab
  const grocer = at(ST[0], ST[1], stall(P.green, P.greenD, 0, 520) + at(0, -190, book(at(-75, 10, tally(4))), 0.55) + (a > 6.6 ? `<path d="${`M60 -250l${(30 * Math.sin(tot * 10)).toFixed(1)} -40`}" stroke="${P.gold}" stroke-width="10" stroke-linecap="round"/>` : "") + at(-150, -170, `<ellipse cx="0" cy="0" rx="50" ry="40" fill="${P.red}"/><ellipse cx="60" cy="10" rx="40" ry="34" fill="${P.gold}"/>`), 1.1);
  const g = night(c, tot, 37) + layer(skyline(71, -1400, 2600, G - 20, 80, 240, "#2a1d66", "#ffb066"), c, 0.5) + layer(ground + grocer + chain + houses + bolt + coins + nbShow + drop + landed, c);
  return { g, in: toScreen(c, 840, 360), inC: P.gold, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6];
export const c2tripSet = makeSet(SHOTS, V, P);
