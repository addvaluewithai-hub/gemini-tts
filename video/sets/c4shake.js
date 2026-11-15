// Crypto part 4, scene "shake": why the price swings so hard. Seven wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-04-world/shots.md), in the world of parts 1 to 3.
//   0 a small pond (the coin's market) beside an ocean (the world's money); one big stone and the whole pond waves
//   1 a ship held by an anchor of profits, a house on a foundation of rent; the coin on a raft with no anchor drifts
//   2 a clock that never stops, a stall whose shutter will not come down
//   3 a speech bubble from a tall tower sends the price up; a government stamp sends it down
//   4 an umbrella over the coin; the stock market falls and the coin falls with it, faster (host left)
//   5 one day of the coin against one year of an ordinary currency (host right)
//   6 the gold whale surfaces under the price line; the small fish tumble (host left)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4shake.v.js";
import { stars, skyline, house } from "./bank.js";
import { calPage } from "./props.js";
import { P, mix, coin, tower, whale } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x1 = 2800) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f", x0 = -1600, x1 = 5000) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="1200" fill="${fill}"/>`;
const far = (c, base = 860, seed = 31) => layer(skyline(seed, -900, 2900, base, 90, 260, "#2a1d66", "#ffb066"), c, 0.45);
const SEA = "#1d6fb8", SEAD = "#155690", POND = "#2f8fd8";
// a wavy water surface from x0 to x1 at y, amplitude amp, phase ph
const waves = (x0, x1, y, amp, ph, fill, depth = 900, k = 0.012) => { let d = `M${x0} ${y + depth}L${x0} ${y}`; for (let x = x0; x <= x1; x += 24) d += `L${x} ${(y + amp * Math.sin(x * k + ph)).toFixed(1)}`; return `${d}L${x1} ${y + depth}Z`; };
// a small price line over a spot: pts are [x, y] pairs, drawn up to p
const line = (pts, p, col = P.gold, w = 9) => { const n = pts.length - 1, u = clamp(p) * n, k = Math.floor(u), f = u - k, q = pts.slice(0, k + 1).concat(k < n ? [[lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)]] : []);
  return q.length < 2 ? "" : `<path d="${q.map((v, i) => `${i ? "L" : "M"}${v[0].toFixed(1)} ${v[1].toFixed(1)}`).join("")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`; };
const arrow = (x, y, up, a, col) => (a <= 0 ? "" : at(x, y, `<path d="M0 ${up ? 50 : -50}V${up ? -30 : 30}" stroke="${col}" stroke-width="22" stroke-linecap="round"/><path d="M-36 ${up ? -14 : 14}L0 ${up ? -60 : 60}L36 ${up ? -14 : 14}Z" fill="${col}"/>`, pop(a)));
const raft = (tilt = 0) => `<g transform="rotate(${tilt.toFixed(1)})"><path d="${rr(-120, -20, 240, 40, 10)}" fill="${P.wood}"/>${[-80, -26, 28, 82].map((x) => `<path d="M${x} -20v40" stroke="${P.woodD}" stroke-width="6"/>`).join("")}${at(0, -90, coin(70, "B"))}</g>`;

// ---- 0: a small pond beside an ocean; one big stone and the whole pond waves ----
const PX = 760, PY = 760;
function s0(a, tot) {
  const c = camAt(a, [[0, PX, 640, 2.0], [2.2, PX, 640, 1.9], [3.6, 1180, 560, 0.62], [4.3, 1150, 560, 0.62], [5.3, PX + 40, 630, 1.25], [6.73, PX + 40, 630, 1.3]]);
  const hit = 5.1, t = a - hit, amp = t > 0 ? 36 * Math.exp(-t * 1.2) : 0;
  // the ocean to the right, very wide, with gentle swells and a few coin glints for "all the money"
  const ocean = `<path d="${waves(1150, 6000, PY - 10, 10, tot * 1.2, SEA, 1400, 0.006)}" fill="${SEA}"/>${Array.from({ length: 14 }, (_, i) => at(1400 + i * 300, PY + 60 + (i % 3) * 90, `<ellipse rx="40" ry="10" fill="${P.gold}" opacity=".5"/>`)).join("")}`;
  // the pond: a small lake with its own coin buoy; once the stone hits, rings and big waves
  const rippled = t > 0 ? [0, 1, 2].map((i) => { const r = 40 + (t - i * 0.18) * 260; return r > 0 && r < 330 ? `<ellipse cx="${PX}" cy="${PY}" rx="${r.toFixed(1)}" ry="${(r * 0.28).toFixed(1)}" fill="none" stroke="#bfe6ff" stroke-width="6" opacity="${(0.8 * (1 - r / 330)).toFixed(2)}"/>` : ""; }).join("") : "";
  const pond = `<ellipse cx="${PX}" cy="${PY + 30}" rx="340" ry="110" fill="#1b1550"/><clipPath id="pond0"><ellipse cx="${PX}" cy="${PY + 30}" rx="320" ry="100"/></clipPath><g clip-path="url(#pond0)"><path d="${waves(PX - 340, PX + 340, PY, 4 + amp, tot * 3 + a * 6, POND, 300, 0.03)}" fill="${POND}"/></g>${rippled}`;
  const bob = t > 0 ? -amp * 1.4 * Math.sin(t * 9) : 3 * Math.sin(tot * 2), tilt = t > 0 ? 18 * Math.exp(-t * 1.4) * Math.sin(t * 7) : 0;
  const buoy = at(PX + 60, PY - 20 + bob, `<path d="M-30 0h60l-10 30h-40Z" fill="${P.red}"/>${at(0, -50, coin(46, "B"))}`, 1, tilt);
  // the stone: a big boulder with $ drops from above on "one big seller"
  const fall = seg(a, 4.45, hit), stone = a > 4.3 && t < 0.35 ? at(PX - 20, lerp(-200, PY - 30, easeIn(fall)), `${two(circ(0, 0, 70), "#8792bb", "#6a759c")}${text(0, 24, "$", 70, P.ink)}`, t > 0 ? 1 - seg(t, 0, 0.35) : 1) : "";
  const splash = t > 0 && t < 0.8 ? Array.from({ length: 8 }, (_, i) => { const an = -Math.PI * (0.15 + 0.7 * i / 7), d = 40 + 260 * t; return `<circle cx="${(PX - 20 + Math.cos(an) * d).toFixed(1)}" cy="${(PY - 30 + Math.sin(an) * d * 1.2 + 500 * t * t).toFixed(1)}" r="${(16 * (1 - t)).toFixed(1)}" fill="#bfe6ff"/>`; }).join("") : "";
  // the price over the pond jumps when it waves
  const pl = t > 0 ? line([[PX - 260, PY - 280], [PX - 180, PY - 280], [PX - 120, PY - 380 + amp], [PX - 40, PY - 190], [PX + 40, PY - 360], [PX + 120, PY - 210], [PX + 220, PY - 320]], seg(t, 0.2, 1.4), P.gold, 10) : `<path d="M${PX - 260} ${PY - 280}h${(480 * seg(a, 0.4, 1.4)).toFixed(0)}" stroke="${P.gold}" stroke-width="10" stroke-linecap="round"/>`;
  const shore = `<path d="M${PX - 420} ${PY + 30}Q${PX} ${PY - 40} ${PX + 420} ${PY + 30}L${PX + 420} ${PY + 400}L${PX - 420} ${PY + 400}Z" fill="#2e7a4a"/>`;
  const g = night(c, tot, 13) + far(c, 820) + layer(ground(PY + 20, "#24164f") + ocean + shore + pond + pl + buoy + stone + splash, c);
  return { g, out: toScreen(c, PX, PY + 20), outC: POND, outZ: 18 };
}

// ---- 1: things with an anchor, and the coin with none ----
function s1(a, tot) {
  const W = 760, c = camAt(a, [[0, 600, 640, 1.5], [2.3, 620, 660, 1.5], [3.3, 1060, 640, 1.5], [4.4, 1440, 640, 1.5], [6.15, 1600, 620, 1.45]]);
  const water = `<path d="${waves(-1200, 4000, W, 8, tot * 1.5, SEA, 900, 0.01)}" fill="${SEA}"/>`;
  // the ship and its anchor marked with profits (%), chain taut
  const sp = pop(a - 1.85), anchorA = seg(a, 2.2, 2.9), ax = 520, ay = lerp(W + 40, W + 170, ease(anchorA));
  const ship = sp > 0 ? at(540, W + 2 * Math.sin(tot * 2), `${two("M-200 -10H200L160 60H-160Z", P.red, P.redD, 0, 8)}${two(rr(-90, -110, 180, 100, 10), P.cream, P.creamD, 0, 6)}<rect x="-6" y="-210" width="12" height="100" fill="${P.wood}"/><path d="M6 -200L80 -150H6Z" fill="${P.gold}"/>`, sp) : "";
  const anchor = anchorA > 0 ? `<path d="M${540 - 120} ${W + 30}L${ax} ${ay - 40}" stroke="${P.steel}" stroke-width="8" stroke-dasharray="14 8"/>` + at(ax, ay, `<path d="M0 -50V40M-46 10Q0 70 46 10" stroke="${P.steel}" stroke-width="14" fill="none" stroke-linecap="round"/><circle cy="-60" r="16" fill="none" stroke="${P.steel}" stroke-width="10"/>${disc(0, -4, 34, P.gold, P.goldD)}${text(0, 12, "%", 44, "#8a5200")}`) : "";
  // the house on solid ground with a rent key on its foundation
  const hp = pop(a - 3.3), home = hp > 0 ? at(1060, W - 10, `${two(rr(-190, 0, 380, 70, 8), "#6b5aa0", "#4f4380", 0, 8)}${at(0, 0, house(P.teal, P.tealD, { lit: [1, 1, 1] }))}${at(130, 40, `${disc(0, 0, 28, P.gold, P.goldD)}${text(0, 12, "$", 36, "#8a5200")}`)}`, hp) : "";
  const island = `<path d="M850 ${W + 6}Q1060 ${W - 40} 1270 ${W + 6}L1270 ${W + 120}L850 ${W + 120}Z" fill="#2e7a4a"/>`;
  // the coin on a raft, no chain, drifting off with the wind
  const cp = pop(a - 4.4), dr = seg(a, 4.7, 6.15), cx = 1500 + 260 * ease(dr), cy = W - 6 + 10 * Math.sin(tot * 2.6);
  const gust = a > 4.8 ? [0, 1, 2].map((i) => { const u = ((a - 4.8) * 0.9 + i / 3) % 1; return `<path d="M${1280 + u * 520} ${W - 260 + i * 60}q60 -30 120 0" stroke="#cfe9ff" stroke-width="7" fill="none" stroke-linecap="round" opacity="${(0.7 * (1 - u)).toFixed(2)}"/>`; }).join("") : "";
  const nochain = a > 5.3 ? at(cx - 10, W + 150, cross(0, 0, 30, P.red, a - 5.3)) : "";
  const coinRaft = cp > 0 ? at(cx, cy, raft(8 * Math.sin(tot * 1.8) + 10 * dr), 1.15 * cp) : "";
  const g = night(c, tot, 17, 3400) + layer(skyline(41, -900, 3400, W - 30, 70, 200, "#2a1d66"), c, 0.45) + layer(island + water + ship + anchor + home + coinRaft + gust + nochain, c);
  return { g, in: [960, 540], inC: POND, inZ: 18, out: toScreen(c, cx, cy - 90), outC: P.gold, outZ: 18 };
}

// ---- 2: open all the time ----
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.05], [4.77, 980, 530, 1.12]]);
  // a clock whose hands race round; day dots light one by one
  const spin = a * 4.2, clk = at(560, 470, `${disc(0, 0, 220, P.cream, P.creamD)}${Array.from({ length: 12 }, (_, i) => { const t = i * 0.5236; return `<path d="M${(Math.cos(t) * 170).toFixed(1)} ${(Math.sin(t) * 170).toFixed(1)}L${(Math.cos(t) * 198).toFixed(1)} ${(Math.sin(t) * 198).toFixed(1)}" stroke="${P.ink}" stroke-width="${i % 3 ? 6 : 12}" stroke-linecap="round"/>`; }).join("")}
    <path d="M0 0L${(Math.cos(spin - 1.57) * 150).toFixed(1)} ${(Math.sin(spin - 1.57) * 150).toFixed(1)}" stroke="${P.ink}" stroke-width="14" stroke-linecap="round"/><path d="M0 0L${(Math.cos(spin / 12 - 1.57) * 100).toFixed(1)} ${(Math.sin(spin / 12 - 1.57) * 100).toFixed(1)}" stroke="${P.ink}" stroke-width="20" stroke-linecap="round"/><circle r="16" fill="${P.red}"/>
    ${text(0, 110, "24", 60, P.red)}`, pop(a - 0.3));
  const days = Array.from({ length: 7 }, (_, i) => { const on = a > 2.5 + i * 0.07; return `<circle cx="${380 + i * 60}" cy="790" r="20" fill="${on ? P.gold : "#3a2a7a"}"/>`; }).join("") + (a > 2.5 ? text(560, 870, "7 / 7", 56, P.cream, { opacity: seg(a, 2.6, 3.0).toFixed(2) }) : "");
  // the stall: lit, OPEN; the shutter tries to come down and springs back up
  const tryD = a > 3.4 ? Math.max(0, Math.sin(clamp((a - 3.4) / 0.9) * Math.PI)) * 0.55 : 0;
  const stall = at(1360, 840, `${two(rr(-260, -440, 520, 440, 16), "#5a6aa8", "#44529a", 0, 10)}<path d="${rr(-220, -380, 440, 300, 10)}" fill="${P.win}"/>${[0, 1, 2].map((i) => at(-120 + i * 120, -170, coin(44, "B"))).join("")}
    <path d="${rr(-220, -380, 440, 300 * tryD, 0)}" fill="${P.steel}"/>${tryD > 0 ? `<path d="${rr(-230, -386 + 300 * tryD, 460, 16, 6)}" fill="${P.steelD}"/>` : ""}
    <path d="M-290 -440L-260 -500H260L290 -440Z" fill="${P.red}"/>${text(0, -455, "OPEN", 44, "#fff")}${a > 4.2 ? at(0, -230, check(0, 0, 40, P.green, a - 4.2)) : ""}`, pop(a - 0.9));
  const g = night(c, tot, 23) + far(c, 860) + layer(ground(840) + clk + days + stall, c);
  return { g };
}

// ---- 3: the news moves it ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [4.41, 960, 520, 1.05]]);
  // the price line across the middle: flat, a jump up on the tweet, a drop on the stamp
  const up = seg(a, 2.1, 2.6), down = seg(a, 3.5, 3.95);
  const hi = 540 - 220 * ease(up), lo = hi + 360 * ease(down), pts = [[260, 540], [700, 540], [760, hi], [1180, hi], [1240, lo], [1700, lo]];
  const ln = line(pts, seg(a, 0.2, 4.1), P.gold, 12);
  // a tall tower with a speech bubble (an up arrow) on "a rich man's statement"
  const tw = at(470, 960, tower({ h: 560, name: "", seed: 2 }), 0.62);
  const bub = a > 1.55 ? at(560, 360, `<path d="M-120 -80h240a20 20 0 0 1 20 20v100a20 20 0 0 1 -20 20h-170l-50 50v-50h-20a20 20 0 0 1 -20 -20v-100a20 20 0 0 1 20 -20Z" fill="#fff"/>${at(-50, -10, coin(36, "B"))}${at(40, -10, arrow(0, 0, true, 1, P.green), 0.6)}`, pop(a - 1.55)) : "";
  // a government building stamps a red seal on "a government decision"
  const gov = at(1480, 960, `${two(rr(-230, -300, 460, 300, 8), P.stone, P.stoneD, 0, 8)}<path d="M-260 -300L0 -420L260 -300Z" fill="${P.cream}"/>${[-160, -60, 60, 160].map((x) => `<rect x="${x - 18}" y="-280" width="36" height="260" fill="${P.stoneD}"/>`).join("")}`, 0.95 * pop(a - 2.9));
  const st = seg(a, 3.1, 3.5), stamp = a > 2.95 ? at(1440, lerp(240, 430, easeIn(st)), `${two(rr(-26, -150, 52, 100, 16), P.wood, P.woodD, 6, 0)}${two(rr(-80, -50, 160, 50, 10), P.red, P.redD, 0, 6)}`, pop(a - 2.95)) : "";
  const mark = a > 3.5 ? at(1440, 470, `<circle r="60" fill="none" stroke="${P.red}" stroke-width="10"/>${text(0, 22, "✗", 64, P.red)}`, pop(a - 3.5)) : "";
  const g = night(c, tot, 29) + layer(ground(960) + ln + tw + bub + gov + stamp + mark + arrow(1100, 300, true, a - 2.4, P.green) + arrow(1250, 820, false, a - 3.8, P.red), c);
  return { g, in: [960, 540], inC: P.gold, inZ: 16 };
}

// ---- 4: a "safe harbour" that falls with the market, faster (host left) ----
function s4(a, tot) {
  const c = camAt(a, [[0, 1080, 520, 1.0], [5.58, 1100, 520, 1.04]]);
  const X0 = 520, X1 = 1700, Y = 520;
  // the stock line (blue) and the coin line (gold), side by side across the frame
  const fall = seg(a, 3.1, 4.3), cf = seg(a, 3.7, 4.9);
  const stock = line([[X0, Y + 40], [900, Y + 20], [1100, Y + 30], [1200, Y + 30 + 120 * ease(fall)], [X1, Y + 30 + 160 * ease(fall)]], seg(a, 0.3, 4.4), P.blue, 12);
  const coinL = line([[X0, Y - 120], [900, Y - 140], [1100, Y - 130], [1200, Y - 130 + 260 * ease(cf)], [X1, Y - 130 + 380 * ease(cf)]], seg(a, 0.5, 5.0), P.gold, 14);
  // the umbrella over the coin at the line's start ("a haven away from their markets")
  const um = pop(a - 0.6), shake = a > 3.7 ? 6 * Math.sin(a * 40) * Math.exp(-(a - 3.7) * 2) : 0;
  const umbrella = um > 0 ? at(820 + shake, Y - 300, `<path d="M-170 0Q0 -150 170 0Q120 -30 85 0Q40 -30 0 0Q-40 -30 -85 0Q-120 -30 -170 0Z" fill="${P.teal}"/><path d="M0 0V170q0 30 -30 30" stroke="${P.ink}" stroke-width="10" fill="none" stroke-linecap="round"/>${at(0, 110, coin(46, "B"))}`, um) : "";
  const tag = (x, y, t, col, a0) => (a > a0 ? at(x, y, `<path d="${rr(-90, -36, 180, 60, 14)}" fill="${col}"/>${text(0, 10, t, 34, "#fff")}`, pop(a - a0)) : "");
  const stockIcon = a > 0.4 ? at(X0 - 60, Y + 40, `${two(rr(-46, -46, 92, 92, 14), P.blue, P.blueD, 0, 6)}<path d="M-26 20l18 -24l14 12l22 -30" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - 0.4)) : "";
  const coinIcon = a > 0.6 ? at(X0 - 60, Y - 120, coin(46, "B"), pop(a - 0.6)) : "";
  const fast = a > 4.9 ? at(1640, Y + 300, arrow(0, 0, false, 1, P.red) + arrow(60, 20, false, 1, P.red), pop(a - 4.9)) : "";
  const g = night(c, tot, 37) + layer(ground(980, "#20134a") + stock + coinL + umbrella + stockIcon + coinIcon + fast, c);
  return { g, out: toScreen(c, 1200, Y), outC: "#1b1550", outZ: 18 };
}

// ---- 5: one day of the coin, one year of a currency (host right) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 900, 500, 1.0], [4.14, 900, 500, 1.03]]);
  const panel = (x, label, sub, pts, p, col) => `${two(rr(x - 330, 160, 660, 520, 22), "#2c1f63", "#1b1550", 0, 10)}${text(x, 250, label, 64, P.cream)}${text(x, 640, sub, 40, "#9fb0ff")}${line(pts, p, col, 10)}`;
  const jag = Array.from({ length: 14 }, (_, i) => [120 + i * 46, 430 + (i % 2 ? -1 : 1) * (40 + 60 * rnd(i * 3)) + (i > 8 ? 60 : 0)]);
  const flat = Array.from({ length: 14 }, (_, i) => [880 + i * 46, 440 + 6 * Math.sin(i * 1.3)]);
  const left = panel(420, "1 DAY", "", jag, seg(a, 0.6, 2.0), P.gold) + at(270, 340, coin(36, "B"));
  const right = a > 2.2 ? panel(1180, "1 YEAR", "", flat, seg(a, 2.4, 3.6), P.green) + at(1030, 340, `${two(rr(-50, -28, 100, 56, 8), "#6fe3a1", "#3fbf7a", 4, 3)}${text(0, 14, "$", 40, "#2b9a5e")}`) : "";
  const g = night(c, tot, 41) + layer(ground(900) + left + (a > 2.2 ? `<g opacity="${seg(a, 2.2, 2.5).toFixed(2)}">${right}</g>` : ""), c);
  return { g, in: [960, 540], inC: "#1b1550", inZ: 18 };
}

// ---- 6: the whale (host left) ----
function s6(a, tot) {
  const c = camAt(a, [[0, 1100, 520, 1.0], [2.0, 1100, 540, 1.05], [5.05, 1140, 560, 1.12]]);
  const W = 620, surf = seg(a, 1.3, 2.0), flip = a > 2.7 ? Math.sin((a - 2.7) * 5) * Math.exp(-(a - 2.7) * 0.8) : 0, wave = a > 2.8 ? 50 * Math.exp(-(a - 2.8) * 1.3) : 0;
  const sea = `<path d="${waves(-600, 3200, W, 8 + wave, tot * 1.6 + a * 2, SEA, 900, 0.008)}" fill="${SEA}"/>`;
  const sea2 = `<path d="${waves(-600, 3200, W + 40, 6, tot * 1.2 + 1, SEAD, 900, 0.01)}" fill="${SEAD}" opacity=".9"/>`;
  // the price line rides just above the surface and bucks when the whale moves
  const pl = line(Array.from({ length: 16 }, (_, i) => [420 + i * 100, 280 - wave * 2.4 * Math.sin(i * 0.8 + a * 3) - (i > 10 ? -30 : 0)]), seg(a, 0.2, 1.4), P.gold, 10);
  const wh = at(1150, lerp(W + 260, W + 40, ease(surf)), whale(flip), 1.5);
  // small fish swim; once the whale moves they tumble
  const fish = Array.from({ length: 7 }, (_, i) => { const t = a - 3.5 - i * 0.12, x = 560 + i * 170 + (i % 2) * 40, y = W + 150 + (i % 3) * 70, spinA = t > 0 ? t * 500 : 10 * Math.sin(tot * 4 + i);
    return at(x + (t > 0 ? 40 * t : 6 * Math.sin(tot * 2 + i)), y + (t > 0 ? 60 * t * t : 0), `<path d="M24 0L46 -16V16Z" fill="${P.pinkD}"/><ellipse rx="34" ry="18" fill="${P.pink}"/><circle cx="-16" cy="-4" r="5" fill="${P.ink}"/>`, 1, spinA); }).join("");
  const spray = a > 1.9 && a < 3.4 ? [0, 1, 2].map((i) => `<path d="M${1210 + i * 18} ${W - 100}q${-30 + i * 30} -80 ${-10 + i * 20} -150" stroke="#cfe9ff" stroke-width="12" fill="none" stroke-linecap="round" opacity="${(0.8 * (1 - seg(a, 2.6, 3.4))).toFixed(2)}"/>`).join("") : "";
  const g = night(c, tot, 43) + layer(sea2 + pl + wh + spray + sea + fish, c);
  return { g, in: [960, 540], inC: SEA, inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6];
export const c4shakeSet = makeSet(SHOTS, V, P);
