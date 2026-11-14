// Crypto part 2, scene "rules": who can change the rules. Seven wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-02-world/shots.md, rules).
//   0 the rules are code in a glass case; copies fly to the laptops and each one switches itself on
//   1 a new version, v2, in pink: some laptops take it, the others keep v1
//   2 the chain splits in two at its tip; the Y becomes a table fork, which lands on a plate of kofta
//   3 2017: company towers and a shed of rigs pull the page wider and wider with ropes
//   4 the laptops raise ✗, the ropes snap, the page snaps back; up on the chain a branch leaves with its own coin, Bitcoin Cash
//   5 2010: one page spits out 184 billion coins; alarm; a wrench fixes the code, every laptop switches, 5 h; the page is cut out
//   6 the silo of 21 million: a lever tries the lid, houses and laptops pile on and hold it down; a little white flag
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2rules.v.js";
import { P, mix, fmt, house, stars, skyline, coin } from "./bank.js";
import { laptop, calPage } from "./props.js";
import { page, link, rig, warehouse, clock, silo } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -600, 2600, 1080, tot), c, 0.15);
const V1 = P.gold, V2 = P.pink, FIX = P.green;

// ---- the rules: code in a glass case (as in part 1), 600 wide, base on y = 0; tint recolours the lines, typed 0..1 draws them ----
const CODE_W = [190, 230, 160, 200, 120, 210], CODE_I = [0, 1, 2, 2, 1, 1];
const codeCase = (o = {}) => { const shine = o.shine ?? 0, tint = o.tint, typed = o.typed ?? 1, cols = [P.pink, P.teal, P.gold, P.blue, P.green, P.violet];
  const lines = CODE_W.map((w, r) => `<path d="${rr(-150 + CODE_I[r] * 34, -380 + (r + 1) * 52 - 8, Math.max(1, w * seg(typed, r / 7, (r + 1) / 7)), 18, 9)}" fill="${tint ? mix(cols[r], tint, o.tintP ?? 1) : cols[r]}"/>`).join("");
  const rays = shine > 0 ? [0, 1, 2, 3, 4, 5].map((i) => { const an = -Math.PI / 2 + (i - 2.5) * 0.5; return `<path d="M0 -230L${(Math.cos(an) * 900 - 60).toFixed(0)} ${(-230 + Math.sin(an) * 900).toFixed(0)}L${(Math.cos(an) * 900 + 60).toFixed(0)} ${(-230 + Math.sin(an) * 900).toFixed(0)}Z" fill="#ffd98a" opacity="${(0.07 * shine).toFixed(3)}"/>`; }).join("") + rings(0, -230, 300, o.glow || P.gold, 0.12 * shine) : "";
  return `${rays}<path d="${rr(-240, -470, 480, 430, 20)}" fill="#0e1240"/>${text(-190, -310, "{", 48, P.gold, { anchor: "start" })}${lines}${text(-190, -20 - 40, "}", 48, P.gold, { anchor: "start" })}
    <path d="${rr(-260, -490, 520, 470, 24)}" fill="#cfe9ff" opacity=".12" stroke="#cfe9ff" stroke-width="10"/><path d="M-200 -440L-120 -440L-220 -120Z" fill="#fff" opacity=".12"/>${two(rr(-300, -40, 600, 40, 10), P.violet, P.violetD, 0, 10)}`; };
// a copy of the code: a little dark card with three coloured lines, tinted
const codeCard = (col) => `${two(rr(-80, -56, 160, 112, 16), "#1c2266", "#0e1240", 0, 8)}<path d="${rr(-80, -56, 160, 112, 16)}" fill="none" stroke="${col}" stroke-width="7"/>${[0, 1, 2].map((r) => `<path d="${rr(-56 + (r % 2) * 18, -32 + r * 26, [92, 70, 84][r], 14, 7)}" fill="${r === 1 ? mix(col, "#ffffff", 0.3) : col}"/>`).join("")}`;
// a version tag: "v1" in gold or "v2" in pink
const tag = (label, col) => `${two(rr(-58, -32, 116, 64, 32), col, mix(col, P.ink, 0.25), 0, 6)}${text(0, 17, label, 46, P.ink)}`;
// a switch: on 0..1
const toggle = (on) => `<path d="${rr(-46, -22, 92, 44, 22)}" fill="${mix("#3a2a7a", P.green, on)}"/><circle cx="${lerp(-22, 22, on).toFixed(1)}" r="17" fill="#fff"/>`;
// the code shown on a laptop screen, in one colour
const scr = (col) => `<path d="M-90 -150h120M-90 -110h160M-90 -70h90" stroke="${col}" stroke-width="16" stroke-linecap="round"/>`;
const lap = (glow, col, k = 1) => laptop(glow, col ? scr(col) : "");

// ---- 0–1: the code case and a row of laptops; one world for both shots ----
const G01 = 900, CASE = [540, G01], LAPS = [1120, 1450, 1780], LK = 0.92, TAKE2 = [0, 2];
const BACK = Array.from({ length: 9 }, (_, i) => [1000 + i * 120 + 40 * rnd(i + 3), G01 - 300 - 30 * rnd(i + 9)]);
function room(t, c, tot, s) {
  const E = s.ends || [], T1 = E[0] || 4.12, u = t - T1;
  let g = `<rect x="-800" y="${G01}" width="3800" height="600" fill="#2c1a66"/><path d="M940 ${G01 - 250}H2400V${G01}H940Z" fill="#241a5c"/>`;
  // the back row: many small laptops, far away
  BACK.forEach(([x, y], i) => { const on = t > 2.7 + i * 0.09, v2 = u > 3.0 + (i % 3) * 0.12 && i % 2 === 0; g += at(x, y, lap(on ? (v2 ? "#ffd6e6" : "#fff3c2") : "#4b3d8f", on ? (v2 ? V2 : P.goldD) : ""), 0.26); });
  g += `<path d="${rr(960, G01 - 40, 980, 40, 8)}" fill="${P.woodD}"/>`;
  // the case with the code, glowing; the v2 card hangs over it in shot 1
  g += at(CASE[0], CASE[1], codeCase({ shine: 0.6 + 0.4 * Math.sin(tot * 2) }), 0.9);
  // copies of the code fly from the case to each laptop and switch it on
  LAPS.forEach((x, i) => {
    const t0 = 1.0 + i * 0.16, land = t0 + 0.6, sw = 2.6 + i * 0.18, got2 = TAKE2.includes(i), t2 = 2.85 + TAKE2.indexOf(i) * 0.17, has2 = got2 && u > t2 + 0.5;
    const on = ease(seg(t, sw, sw + 0.22)), lit = t > land;
    const glow = !lit ? "#4b3d8f" : has2 ? "#ffd6e6" : on > 0.5 ? "#fff3c2" : "#9fe7ff", col = !lit ? "" : has2 ? V2 : P.goldD;
    const flash = has2 ? Math.exp(-(u - t2 - 0.5) * 5) : lit ? Math.exp(-(t - land) * 5) : 0;
    g += at(x, G01 - 40, (flash > 0.05 ? rings(0, -110, 120 + 60 * flash, has2 ? V2 : P.gold, 0.35 * flash) : "") + lap(glow, col), LK);
    g += at(x, G01 + 60, toggle(on), 1.3 * (t > sw - 0.3 ? 1 : 0.85));
    // its version tag, from shot 1 on
    if (u > 0.25) { const ver = has2 ? tag("v2", V2) : tag("v1", V1), bump = has2 ? 1 + 0.25 * Math.exp(-(u - t2 - 0.5) * 6) : 1; g += at(x, G01 - 290, ver, 1.1 * pop(u - 0.25 - i * 0.06) * bump); }
    // the copy in flight
    const p = seg(t, t0, land); if (p > 0 && p < 1) { const b = bez([CASE[0], CASE[1] - 300], [lerp(CASE[0], x, 0.5), 140], [x, G01 - 110], ease(p)); g += at(b[0], b[1], codeCard(V1), lerp(0.9, 0.4, ease(p)), 360 * ease(p)); }
    // the v2 copy in flight
    if (got2) { const q = seg(u, t2, t2 + 0.5); if (q > 0 && q < 1) { const b = bez([CASE[0] + 30, 330], [lerp(CASE[0], x, 0.5), 120], [x, G01 - 110], ease(q)); g += at(b[0], b[1], codeCard(V2), lerp(0.8, 0.4, ease(q))); } }
  });
  // the v2 card: written beside the case, glowing pink
  if (u > 0.9) { const w = seg(u, 1.0, 1.6); g += at(CASE[0] + 30, 330 + 6 * Math.sin(tot * 3), rings(0, 0, 120, V2, 0.2) + codeCard(V2) + at(0, -100, tag("v2", V2), pop(u - 1.3)), 1.3 * pop(u - 0.9)); }
  return night(c, tot, 5) + layer(skyline(21, -600, 2600, G01 - 120, 100, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(g, c);
}
function s0(a, tot, s) { const c = camAt(a, [[0, 600, 640, 1.5], [0.9, 620, 640, 1.46], [2.2, 1140, 640, 1.0], [4.12, 1150, 640, 1.02]]); return { g: room(a, c, tot, s) }; }
function s1(a, tot, s) { const T1 = (s.ends || [])[0] || 4.12, c = camAt(a, [[0, 1150, 640, 1.02], [1.4, 1150, 630, 1.02], [4.08, 1160, 630, 1.06]]);
  return { g: room(T1 + a, c, tot, s), out: toScreen(c, LAPS[2], G01 - 40 - 110 * LK), outC: P.cream, outZ: 20 }; }

// ---- 2: the chain splits; the Y is a fork; the fork goes on a plate of kofta ----
const CY = 540, SPLIT = 720;
const TRUNK = [-260, 0, 260, 520], UP = [[960, 340], [1220, 250]], DN = [[960, 740], [1220, 830]];
function s2(a, tot) {
  const grow = [seg(a, 0.84, 1.2), seg(a, 1.15, 1.6)], morph = ease(seg(a, 2.45, 3.3)), fly = ease(seg(a, 4.15, 5.05)), land = a - 5.05;
  const c = camAt(a, [[0, 640, 540, 1.02], [1.8, 760, 540, 1.0], [3.4, 760, 540, 1.02], [4.15, 770, 560, 0.98], [5.2, 980, 1000, 0.95], [5.76, 982, 1002, 0.96]]);
  // the chain: pages linked along the trunk, then two branches, gold (v1) up and pink (v2) down
  const pk = 0.52, pg = (x, y, i, paper, paperD, seal) => at(x, y, page({ rows: [["blue", "pink", ""], ["teal", "violet", ""], ["pink", "teal", ""]], seal, prev: seal - 1, block: 1, paper, paperD }), pk);
  let chain = "";
  TRUNK.forEach((x, i) => { if (i) chain += link(TRUNK[i - 1] + 70, CY, x - 70, CY); chain += pg(x, CY, i, P.cream, P.creamD, i + 2); });
  chain += link(TRUNK[3] + 70, CY, SPLIT, CY);
  [[UP, V1, "#fff3c2", "#ead7ad"], [DN, V2, "#ffd6e6", "#f0a8c6"]].forEach(([br, col, paper, paperD], b) => br.forEach(([x, y], i) => { const p = grow[i]; if (p <= 0) return; const [px, py] = i ? br[0] : [SPLIT, CY];
    chain += link(px + (i ? 70 : 0), py, lerp(px, x - 70, ease(p)), lerp(py, y, ease(p)), col, 1) + at(x, y, pg(0, 0, i, paper, paperD, 8 + b * 3 + i), pop(p * 0.8 - 0.05) * (b === 0 ? 1 : 1)); }));
  chain += grow[0] > 0 ? rings(SPLIT, CY, 60 + 140 * seg(a, 0.84, 1.3), P.gold, 0.4 * (1 - seg(a, 0.9, 1.6))) : "";
  // the fork: handle along the trunk, four tines; the outer tines lie on the two branches
  const tines = [UP[1][1] + 10, 470, 610, DN[1][1] - 10], head = 880;
  const fork = `${two(`M-340 ${CY - 34}Q300 ${CY - 44} 600 ${CY - 60}L${head} ${tines[0] - 40}H${head + 60}V${tines[3] + 40}H${head}L600 ${CY + 60}Q300 ${CY + 44} -340 ${CY + 34}Q-380 ${CY} -340 ${CY - 34}Z`, "#d5dcf2", P.steelD, 0, 10)}
    ${tines.map((y) => two(rr(head, y - 26, 1290 - head, 52, 26), "#d5dcf2", P.steelD, 0, 9)).join("")}<path d="M-300 ${CY - 14}Q300 ${CY - 24} 590 ${CY - 38}" stroke="#fff" stroke-width="10" fill="none" opacity=".5" stroke-linecap="round"/>`;
  // the plate with kofta skewers, below and to the right
  const PL = [1000, 1120];
  const kofta = (k) => `<path d="M-200 0H210" stroke="${P.wood}" stroke-width="10" stroke-linecap="round"/>${[-140, -60, 20, 100].map((x) => two(rr(x - 34, -26, 70, 52, 26), "#9a5530", "#6e3a1e", 0, 7) + `<path d="M${x - 18} -12l10 4M${x + 4} 8l12 -4" stroke="#c97a48" stroke-width="5" stroke-linecap="round"/>`).join("")}`;
  const plate = a > 3.8 ? at(PL[0], PL[1] + 500 * (1 - easeOut(seg(a, 3.9, 4.6))), `<ellipse cx="0" cy="26" rx="560" ry="160" fill="#1b1550" opacity=".5"/><ellipse rx="560" ry="160" fill="${P.creamD}"/><ellipse rx="460" ry="122" fill="${P.cream}"/><ellipse rx="380" ry="96" fill="#fff9ec"/>
    ${at(-60, -30, kofta(), 1, -6)}${at(40, 40, kofta(), 1, 4)}<path d="M200 -60q30 30 0 60" stroke="${P.green}" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="240" cy="-10" r="22" fill="${P.red}"/>`) : "";
  // the fork leaves the chain's place and lands on the plate's edge
  const fx = lerp(0, PL[0] + 140 - 480 * 0.55, fly), fy = lerp(0, PL[1] - 70 - CY * 0.55, fly), fk = lerp(1, 0.55, fly), rot = -14 * Math.sin(Math.PI * fly) + 6 * fly;
  const bounce = land > 0 ? -18 * Math.exp(-land * 7) * Math.sin(land * 20) : 0;
  const forkG = morph > 0 ? `<g opacity="${morph.toFixed(3)}" transform="translate(${fx.toFixed(1)} ${(fy + bounce).toFixed(1)}) rotate(${rot.toFixed(2)} 480 ${CY}) scale(${fk.toFixed(4)})">${fork}</g>` : "";
  const chainG = morph < 1 ? `<g opacity="${(1 - morph).toFixed(3)}">${chain}</g>` : "";
  const g = night(c, tot, 13) + layer(plate + chainG + forkG, c);
  return { g, in: toScreen(c, TRUNK[0], CY), inC: P.cream, inZ: 18, out: toScreen(c, PL[0], PL[1]), outC: P.cream, outZ: 16 };
}

// ---- 3–4: the block-size war. One world: towers left, a shed of rigs right, the page between, the chain far above ----
const G34 = 920, PG = [960, 560];
// a page w wide (the normal page is 260), centred; rows stretch with it
const widePage = (w, o = {}) => { const h = 340, x0 = -w / 2; let rows = "";
  for (let r = 0; r < 6; r++) { const y = -110 + r * 42, cols = [P.blue, P.pink, P.teal, P.violet, P.gold, P.pink]; rows += `<circle cx="${x0 + 34}" cy="${y}" r="11" fill="${cols[r]}"/><circle cx="${x0 + 80}" cy="${y}" r="11" fill="${cols[(r + 2) % 6]}"/><path d="M${x0 + 110} ${y}h${(w - 150) * (0.6 + 0.4 * rnd(r + 4))}" stroke="#dccaa0" stroke-width="8" stroke-linecap="round"/>`; }
  return `<path d="${rr(x0 + 10, -h / 2 + 10, w, h, 18)}" fill="${P.goldD}"/><path d="${rr(x0 + 5, -h / 2 + 5, w, h, 18)}" fill="${P.gold}"/><path d="${rr(x0, -h / 2, w, h, 18)}" fill="${P.creamD}"/><path d="${rr(x0, -h / 2, w, h - 8, 18)}" fill="${o.paper || P.cream}"/>${rows}`; };
const tower = (h, c, cD) => `${two(rr(-90, -h, 180, h, 8), c, cD, 14, 0)}${Array.from({ length: Math.floor((h - 60) / 56) }, (_, r) => [0, 1, 2].map((q) => `<rect x="${-66 + q * 50}" y="${-h + 30 + r * 56}" width="32" height="32" rx="4" fill="${rnd(r * 3 + q + h) > 0.35 ? "#ffd98a" : "#1d1748"}"/>`).join("")).join("")}${disc(0, -h - 50, 34, P.gold, P.goldD)}<path d="M-14 ${-h - 50}h28M0 ${-h - 64}v28" stroke="${P.goldD}" stroke-width="8"/>`;
const TOWERS = [[330, 560, "#5a6aa8", "#44529a"], [510, 700, "#6a5ab8", "#4f3f9a"], [660, 470, "#4f7ab8", "#3a5a9a"]], SHED = [1580, G34];
// the page's width at time t of shot 3 (tugged in jerks), and in shot 4 (snapping back)
const W34 = (t3, u4) => { let w = 260 + 300 * ease(seg(t3, 1.9, 2.6)) + 200 * ease(seg(t3, 3.4, 4.0)) + 180 * ease(seg(t3, 4.9, 5.6));
  if (u4 !== undefined && u4 > 1.55) { const v = u4 - 1.55; w = 260 + (940 - 260) * Math.exp(-v * 9) * Math.cos(v * 10); } return Math.max(200, w); };
function war(t3, u4, c, tot, noShed) {
  const w = W34(t3, u4), snap = u4 !== undefined && u4 > 1.55, pull = Math.sin(tot * 7) * (snap ? 0 : 6);
  const L = [PG[0] - w / 2, PG[1]], R = [PG[0] + w / 2, PG[1]];
  let g = `<rect x="-800" y="${G34}" width="3800" height="700" fill="#2c1a66"/>`;
  g += TOWERS.map(([x, h, col, colD]) => at(x, G34, tower(h, col, colD))).join("");
  if (!noShed) g += at(SHED[0], SHED[1], warehouse(560, { t: tot, spin: tot * 4, heat: 0.8, h: 260 }));
  // the ropes: taut while they pull; after the snap they fall slack and go back to their owners
  const ropeA = [TOWERS[1][0] + 80, G34 - 520], ropeB = noShed ? [2300, 120] : [SHED[0] - 200, G34 - 200];
  if (!snap) g += `<path d="M${ropeA[0]} ${ropeA[1]}L${(L[0] + pull).toFixed(1)} ${L[1]}" stroke="${P.wood}" stroke-width="12" stroke-linecap="round"/><path d="M${ropeB[0]} ${ropeB[1]}L${(R[0] - pull).toFixed(1)} ${R[1]}" stroke="${P.wood}" stroke-width="12" stroke-linecap="round"/>`;
  else { const f = seg(u4, 1.55, 2.2); g += `<path d="M${ropeA[0]} ${ropeA[1]}Q${lerp(ropeA[0] + 160, ropeA[0] + 20, f)} ${lerp(L[1], G34, f)} ${lerp(ropeA[0] + 200, ropeA[0] + 40, f)} ${lerp(L[1], G34, f)}" stroke="${P.wood}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${ropeB[0]} ${ropeB[1]}Q${lerp(ropeB[0] - 160, ropeB[0] - 20, f)} ${lerp(R[1], G34, f)} ${lerp(ropeB[0] - 200, ropeB[0] - 40, f)} ${lerp(R[1], G34, f)}" stroke="${P.wood}" stroke-width="12" fill="none" stroke-linecap="round"/>`; }
  // the page, tugged; little tremble while it is being pulled
  const tremble = !snap && t3 > 1.9 ? 3 * Math.sin(tot * 40) : 0;
  g += at(PG[0], PG[1] + tremble, rings(0, 0, 230, P.gold, 0.12 + (snap ? 0.25 * Math.exp(-(u4 - 1.55) * 4) : 0)) + widePage(w));
  return g;
}
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.3], [1.6, 960, 600, 1.27], [6.06, 960, 610, 1.18]]);
  const cal = a > 0.55 ? at(1640, 300, calPage("2017", "", 0.75, 150), pop(a - 0.55)) : "";
  const g = night(c, tot, 29) + layer(skyline(37, -600, 2600, G34 - 60, 100, 280, "#221a5c", "#ffb066"), c, 0.45) + layer(war(a, undefined, c, tot) + cal, c);
  return { g, in: toScreen(c, PG[0], PG[1]), inC: P.cream, inZ: 18, out: toScreen(c, PG[0], PG[1]), outC: P.cream, outZ: 18 };
}
// the chain far above the page, with a branch leaving to the upper right
const CH4 = -340, CH4X = [-40, 260, 560, 860, 1160], BR4 = [[1180, -560], [1460, -720]];
function s4(a, tot, s) {
  const T3 = (s.ends || [])[3] || 6.06;
  const c = camAt(a, [[0, 960, 640, 1.12], [1.9, 940, 650, 1.15], [2.3, 940, 650, 1.15], [3.2, 1000, -440, 1.0], [6.16, 1010, -450, 1.02]]);
  let g = war(T3 + a, a, c, tot, true);
  // the laptops in front raise a cross, one after another
  [560, 720, 880, 1040, 1200].forEach((x, i) => { const t0 = 0.55 + i * 0.1; g += at(x, 960, lap("#9fe7ff", P.goldD), 0.52 * pop(a - t0 + 0.4)) + at(x, 790, cross(0, 0, 34, P.red, a - t0 - 0.15), 1); });
  // the chain above: pages in a row, then the branch with its own green coin
  const pk = 0.5, pg = (x, y, n, paper, paperD) => at(x, y, page({ rows: [["blue", "pink", ""], ["teal", "violet", ""], ["pink", "teal", ""]], seal: n, prev: n - 1, block: 1, paper, paperD }), pk);
  CH4X.forEach((x, i) => { if (i) g += link(CH4X[i - 1] + 70, CH4, x - 70, CH4); g += pg(x, CH4, i + 3, P.cream, P.creamD); });
  const go = [seg(a, 2.6, 3.1), seg(a, 3.0, 3.5)];
  BR4.forEach(([x, y], i) => { const p = go[i]; if (p <= 0) return; const [px, py] = i ? BR4[0] : [860 + 60, CH4 - 40]; g += link(px, py, lerp(px, x - 50, ease(p)), lerp(py, y + 30, ease(p)), P.green) + at(x, y, pg(0, 0, 20 + i, "#d9ffe9", "#a8e8c6"), pop(p - 0.05)); });
  const cn = a - 4.4; if (cn > 0) g += at(1660, -800, rings(0, 0, 120, P.green, 0.25) + `${disc(0, 0, 80, "#5fe0a0", "#2fb070")}<circle r="58" fill="none" stroke="#2fb070" stroke-width="8"/>${text(0, 28, "₿", 80, "#1a6a40")}`, pop(cn)) + at(1280, -900, text(0, 0, "Bitcoin Cash", 72, "#9ff0c4"), pop(a - 5.05));
  const g2 = night(c, tot, 29) + layer(skyline(37, -600, 2600, G34 - 60, 100, 280, "#221a5c", "#ffb066"), c, 0.45) + layer(g, c);
  return { g: g2, in: toScreen(c, PG[0], PG[1]), inC: P.cream, inZ: 18, out: toScreen(c, CH4X[2], CH4), outC: P.cream, outZ: 18 };
}

// ---- 5: the 2010 overflow. A page spits out 184 billion coins, the code is fixed, every laptop switches, the page is cut out ----
const CH5 = 330, PK5 = 0.9, HW5 = 130 * PK5, X5 = [-240, 160, 560, 960, 1360, 1760, 2160], BAD = 3, G5 = 1080, CASE5 = [880, G5], LAP5 = [1400, 1660, 1920];
const BIG = 184467440737;
const pg5 = (n, extra = {}) => `<g transform="scale(${PK5})">${page({ rows: [["blue", "pink", ""], ["teal", "violet", ""], ["pink", "teal", ""]], seal: n + 2, prev: n + 1, block: 1, n: 99 + n, ...extra })}</g>`;
function s5(a, tot) {
  const bx = X5[BAD];
  const c = camAt(a, [[0, bx, 310, 1.15], [5.9, bx, 330, 1.08], [6.6, 1170, 760, 0.95], [8.9, 1180, 770, 0.97], [9.3, bx, 330, 1.15], [15.7, bx + 5, 330, 1.17]]);
  const bug = a > 2.8, cut = seg(a, 9.4, 9.9), close = ease(seg(a, 9.95, 10.5)), gone = seg(a, 9.6, 10.3);
  let g = `<rect x="-800" y="${G5}" width="3800" height="700" fill="#2c1a66"/>`;
  // the chain; after the cut the pages to the right slide left by one place and a new link closes the gap
  const xs = X5.map((x, i) => (i > BAD ? x - 400 * close : x));
  X5.forEach((x, i) => { if (i === 0 || i === BAD || i === BAD + 1) return; g += link(xs[i - 1] + HW5, CH5, xs[i] - HW5, CH5); });
  g += link(X5[BAD - 1] + HW5, CH5, X5[BAD] - HW5, CH5, P.gold, 1 - cut) + link(X5[BAD] + HW5, CH5, X5[BAD + 1] - HW5, CH5, P.gold, 1 - cut);
  if (close > 0) g += link(xs[BAD - 1] + HW5, CH5, xs[BAD + 1] - HW5, CH5, P.green, close) + (close < 1 ? rings(xs[BAD - 1] + 200, CH5, 120 * close, P.green, 0.3 * (1 - close)) : "");
  X5.forEach((x, i) => { if (i !== BAD) g += at(xs[i], CH5, pg5(i)); });
  // the bad page: red glow, after the cut it falls away
  const fall = seg(a, 9.9, 10.8);
  if (fall < 1) { const red = bug ? 0.5 + 0.5 * Math.sin(a * 12) : 0;
    g += at(bx, CH5 + 900 * easeIn(fall), (bug ? rings(0, 0, 190 + 25 * red, P.red, 0.25) : "") + pg5(BAD, { rows: [["blue", "pink", ""], [P.red, P.red, bug ? "!!" : "", P.red], ["teal", "violet", ""]] }), 1, 40 * fall); }
  // the coins: a fountain out of the page; they vanish with the page
  if (a > 3.5 && gone < 1) for (let i = 0; i < 60; i++) { const t0 = 3.6 + i * 0.05; if (a < t0) continue; const u = a - t0, vx = (rnd(i) - 0.5) * 1100, vy = -650 - 450 * rnd(i + 50);
    g += at(bx + vx * u, CH5 + vy * u + 1000 * u * u, coin(40), 1 - gone, (u * 300 * (rnd(i + 7) - 0.5)) % 360); }
  // the counter: 184,467,440,737 coins out of thin air
  if (bug && gone < 1) { const p = seg(a, 3.5, 5.6), v = BIG * Math.pow(p, 3), shake = p < 1 ? 3 * Math.sin(a * 50) : 0;
    g += at(bx + shake, CH5 - 290, `${two(rr(-420, -70, 840, 128, 26), P.ink, "#0a0626", 0, 8)}${text(0, 36, fmt(v), 100, p >= 1 ? P.red : P.gold)}`, pop(a - 3.4) * (1 - gone)); }
  // the alarm
  const alarm = a > 5.5 && a < 7.0 ? 0.5 + 0.5 * Math.sin((a - 5.5) * 14) : 0;
  g += at(bx + 560, CH5 - 290, `${alarm > 0.3 ? rings(0, 0, 110, P.red, 0.3 * alarm) : ""}${disc(0, 0, 56, mix("#7a2030", P.red, alarm), P.redD)}<path d="${rr(-74, 46, 148, 30, 8)}" fill="${P.steelD}"/>`, pop(a - 5.3));
  // the calendar: August 2010
  g += a > 1.6 ? at(bx - 620, 60, calPage("2010", "AUG", 0.85, 150), pop(a - 1.6)) : "";
  // down below: a wrench on the code case, its lines turn green; every laptop switches to the fix; a clock runs five hours
  const fix = seg(a, 7.0, 7.6), wr = a > 6.6 && a < 8.0 ? -30 + 60 * Math.sin((a - 6.6) * 8) : 0;
  g += at(CASE5[0], CASE5[1], codeCase({ tint: FIX, tintP: fix, shine: fix }), 1.0);
  if (a > 6.5 && a < 8.3) g += at(CASE5[0] + 200, CASE5[1] - 640, `<g transform="rotate(${wr.toFixed(1)})"><path d="M0 0L170 -170" stroke="${P.steel}" stroke-width="36" stroke-linecap="round"/><path d="M146 -206a54 54 0 1 1 60 60l-24 -24l16 -36l-36 16Z" fill="${P.steel}"/></g>`, pop(a - 6.5) * (1 - seg(a, 8.0, 8.3)));
  LAP5.forEach((x, i) => { const sw = 7.6 + i * 0.3, on = ease(seg(a, sw, sw + 0.25)); g += (on > 0.5 ? rings(x, G5 - 200, 100 * Math.exp(-(a - sw - 0.25) * 4) + 40, FIX, 0.35 * Math.exp(-(a - sw) * 3)) : "") + at(x, G5 - 70, lap(on > 0.5 ? "#d9ffe9" : "#fff3c2", on > 0.5 ? FIX : P.goldD), 0.78) + at(x, G5 - 10, toggle(on), 1.2); });
  if (a > 6.7) g += at(1560, 600, clock((Math.max(0, a - 6.8) * 160) % 60, 90) + text(130, 30, "5 h", 90, P.cream, { anchor: "start" }), pop(a - 6.7) * (1 - seg(a, 9.0, 9.3)));
  // the scissors cut the page out
  if (a > 9.1 && a < 10.4) { const op = Math.abs(Math.sin((a - 9.1) * 9)) * 0.5;
    g += [bx - 160, bx + 160].map((x) => drawn(`M${x} ${CH5 - 260}V${CH5 + 260}`, cut, P.cream, 6, 'stroke-dasharray="16 12"')).join("")
      + at(bx - 160 + 320 * seg(a, 9.65, 9.9), CH5 - 260 + 520 * seg(a, 9.2, 9.6), `<g transform="rotate(90)">${[1, -1].map((d) => `<g transform="rotate(${(d * op * 30).toFixed(1)})"><path d="M0 0L190 ${d * 12}L190 ${d * -6}Z" fill="${P.steel}"/><circle cx="-70" cy="${d * 26}" r="40" fill="none" stroke="${P.red}" stroke-width="16"/><path d="M-34 ${d * 14}L0 0" stroke="${P.red}" stroke-width="16"/></g>`).join("")}</g>`, 1 - seg(a, 10.1, 10.4)); }
  return { g: night(c, tot, 41) + layer(skyline(55, -600, 2600, G5 - 80, 100, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(g, c), in: toScreen(c, X5[2], CH5), inC: P.cream, inZ: 18 };
}

// ---- 6: the 21 million lid: a lever tries it, the town holds it down. Drawn round the silo's base, K times the props' size ----
function s6(a, tot) {
  const G = 980, SX = 1100, K = 1.25;
  const c = camAt(a, [[0, 1180, 520, 1.0], [2.3, 1180, 500, 1.02], [3.5, 1190, 380, 0.9], [7.19, 1200, 350, 0.88]]);
  const tryIt = ease(seg(a, 1.4, 2.2)), hold = ease(seg(a, 3.5, 5.2)), lift = 60 * tryIt * (1 - hold) + (a > 1.4 && a < 3.6 ? 3 * Math.sin(a * 30) * tryIt * (1 - hold) : 0), tilt = -5 * tryIt * (1 - hold);
  const top = -620;
  let s = silo(0.95, { lid: 0, id: "r6" });
  if (lift > 4) s += `<path d="M-140 ${top + 4}L-210 ${top - lift * 2.6}H210L140 ${top + 4}Z" fill="#ffd98a" opacity="${(0.3 * lift / 60).toFixed(2)}"/>`;
  // the lid with its number, and the stack that lands on it
  let lid = `${two(rr(-190, -50, 380, 54, 16), P.steel, P.steelD, 0, 8)}<path d="${rr(-170, -118, 340, 70, 14)}" fill="${P.ink}"/>${text(0, -64, "21,000,000", 56, P.gold)}`;
  const STACK = [[-130, 0, "h", P.blue, P.blueD], [0, 0, "l"], [130, 0, "h", P.pink, P.pinkD], [-66, 1, "h", P.teal, P.tealD], [66, 1, "l"]];
  STACK.forEach(([x, row, kind, col, colD], i) => { const t0 = 3.4 + i * 0.5, u = a - t0; if (u <= 0) return; const drop = Math.min(1, u / 0.35), y = -118 - row * 132 - 700 * (1 - drop * drop), sq = u > 0.35 ? 1 - 0.12 * Math.exp(-(u - 0.35) * 10) * Math.cos((u - 0.35) * 22) : 1, k = kind === "h" ? 0.48 : 0.4;
    lid += at(x, y, kind === "h" ? house(col, colD, { lit: [1, 1, 1] }) : laptop("#fff3c2", scr(P.goldD)), [k, k * sq]); });
  s += at(0, top - lift, lid, 1, tilt);
  // the lever: under the lid's right edge, over a block; its far end goes down while it tries, then flips up; a white flag at the end
  const pv = [330, top + 130], le = tryIt * (1 - hold) - 0.6 * hold, ang = -22 + 26 * le, fl = ease(seg(a, 6.5, 6.9));
  s += at(pv[0], pv[1] + 40, two(rr(-50, -40, 100, 80, 10), P.wood, P.woodD, 0, 8)) + `<g transform="translate(${pv[0]} ${pv[1]}) rotate(${(-ang).toFixed(2)})"><path d="M-170 0H420" stroke="${P.steelD}" stroke-width="26" stroke-linecap="round"/>
    ${a > 6.5 ? `<g transform="translate(410 -10)"><path d="M0 0V${(-130 * fl).toFixed(1)}" stroke="${P.cream}" stroke-width="7"/><g transform="translate(0 ${(-130 * fl).toFixed(1)}) rotate(${(6 * Math.sin(tot * 6)).toFixed(1)})" opacity="${seg(a, 6.6, 6.9).toFixed(2)}"><path d="M0 0q34 -8 70 10q-36 14 -70 26Z" fill="#fff"/></g></g>` : ""}</g>`;
  const g = `<rect x="-800" y="${G}" width="3800" height="700" fill="#2c1a66"/>` + at(SX, G, s, K);
  return { g: night(c, tot, 47) + layer(skyline(71, -600, 2600, G - 80, 100, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(g, c), in: toScreen(c, SX, G + top * K - 60), inC: P.cream, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6];
export const c2rulesSet = makeSet(SHOTS, V, P);
