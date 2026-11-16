// Crypto part 3, keys: six wordless shots (shots.md, scene keys).
//   0 the blue house gets a mailbox with a long code (its address); a coin from the pink house drops into it
//   1 a gold key rises from the mailbox, its blade a strip of digits that keeps unrolling; it turns and the box opens
//   2 the key presses a stamp onto a transfer slip; laptops check the mark and light up; the key goes behind a curtain
//   3 three pages, three different marks from the same stamp, each checked; a forger's copy leaves a smudge: crossed out
//   4 a 78-digit number unrolls across the sky, far wider than a whole beach of sand; a die rolls: no chance
//   5 the public book: a magnifier reads any address's balance, even the hooded chair's heap, where small coins with flags keep landing
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3keys.v.js";
import { P, mix, house, book, coin, stars, skyline } from "./bank.js";
import { laptop, hoodChair } from "./props.js";
import { page, slip } from "./c2props.js";
import { key, mailbox, stamp, mark } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);
const G = 880, MB = [880, G];   // the mailbox stands at the blue house's gate
const ground = (c) => layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c);
const backTown = (c) => layer(skyline(21, -800, 2800, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(57, -800, 2800, G, 80, 230, P.mid, "#ffb066"), c, 0.7);

// ---- 0: an address ----
function s0(a, tot) {
  const c = camAt(a, [[0, 760, 640, 1.55], [1.0, 800, 620, 1.7], [3.83, 880, 600, 1.75]]);
  const box = at(MB[0], MB[1], mailbox({ seed: 3, colour: P.blue }), 1.25 * pop(a - 0.1));
  const PK = [1520, G];
  const t = seg(a, 2.3, 3.2), cp = bez([PK[0] - 60, PK[1] - 330], [1250, 180], [MB[0], MB[1] - 400], ease(t));
  const theCoin = a > 2.2 && t < 1 ? at(cp[0], cp[1], rings(0, 0, 60, P.gold, 0.25) + coin(40, "B"), 1.2) : "";
  const thunk = t >= 1 ? rings(MB[0], MB[1] - 380, 140 * spring(a - 3.2, 7, 10), P.gold, 0.3 * (1 - seg(a, 3.3, 3.8))) : "";
  const g = night(c, tot, 13) + backTown(c) + ground(c) + layer(at(560, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.3) + at(PK[0], G, house(P.pink, P.pinkD, { lit: [1, 1, 1] }), 1.1) + box + theCoin + thunk, c);
  return { g, out: toScreen(c, MB[0], MB[1] - 390), outC: "#5a6aa8", outZ: 16 };
}

// ---- 1: the private key ----
function s1(a, tot) {
  const c = camAt(a, [[0, MB[0] + 120, MB[1] - 330, 1.9], [1.1, MB[0] + 300, MB[1] - 420, 1.55], [2.3, MB[0] + 380, MB[1] - 400, 1.4], [3.41, MB[0] + 260, MB[1] - 380, 1.5]]);
  const up = ease(seg(a, 0.25, 0.8)), un = 1 + 0.9 * ease(seg(a, 1.1, 2.3)), turn = ease(seg(a, 2.45, 2.85)), open = seg(a, 2.75, 3.1);
  const KX = MB[0] - 40, KY = lerp(MB[1] - 300, MB[1] - 560, up);
  const k = at(KX, KY + 5 * Math.sin(tot * 3), rings(0, 0, 130, P.gold, 0.22) + key({ digits: 40, unroll: un }), 1.0, -8 * turn);
  const glowOpen = open > 0 ? `<path d="M${MB[0] - 100} ${MB[1] - 330}L${MB[0] - 260} ${MB[1] - 700}H${MB[0] + 260}L${MB[0] + 100} ${MB[1] - 330}Z" fill="#ffd98a" opacity="${(0.18 * open).toFixed(2)}"/>` : "";
  const g = night(c, tot, 13) + backTown(c) + ground(c) + layer(at(560, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.3) + glowOpen + at(MB[0], MB[1], mailbox({ seed: 3, colour: P.blue, open }), 1.25) + k, c);
  return { g, in: toScreen(c, MB[0], MB[1] - 390), inC: "#5a6aa8", inZ: 16, out: toScreen(c, KX, KY), outC: P.gold, outZ: 18 };
}

// ---- 2: the key signs; the network checks the signature without seeing the key ----
function s2(a, tot) {
  const SX = 760, SY = 560;
  const c = camAt(a, [[0, 700, 480, 1.75], [2.3, 760, 500, 1.6], [3.3, 960, 540, 1.15], [4.0, 860, 520, 1.2], [5.35, 860, 520, 1.22]]);
  const sl = at(SX, SY, slip("blue", "pink", "30"), 2.2);
  // the key brings the stamp down (0.9 – 1.4) and lifts it; the mark stays on the slip
  const down = a < 1.25 ? ease(seg(a, 0.85, 1.25)) : 1 - ease(seg(a, 1.45, 1.9)), STY = lerp(SY - 420, SY - 70, down);
  const st = at(SX + 150, STY, stamp(2), 1.0);
  const marked = a > 1.25 ? at(SX + 150, SY + 10, mark(2, 50), 0.4 + 0.6 * spring(a - 1.25, 10, 18)) : "";
  // the key hangs by the stamp, then a curtain draws across it
  const KX = SX - 480, KY = SY - 300, cur = ease(seg(a, 4.05, 4.75));
  const k = at(KX, KY + 6 * Math.sin(tot * 3), rings(0, 0, 110, P.gold, 0.2) + key({ digits: 8 }), 0.9, -20);
  const curtain = cur > 0 ? `<path d="M${KX - 140} ${KY - 220}h${(440 * cur).toFixed(1)}v360h${(-440 * cur).toFixed(1)}Z" fill="${P.red}"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${KX - 140 + i * 73 * cur} ${KY - 220}v360" stroke="${P.redD}" stroke-width="10"/>`).join("")}<path d="${rr(KX - 160, KY - 240, 480, 26, 10)}" fill="${P.woodD}"/>` : "";
  // three laptops on the right shine a beam on the mark and light green
  let laps = "";
  [[1360, 330], [1560, 560], [1360, 800]].forEach(([x, y], i) => { const t0 = 2.5 + i * 0.25, beam = seg(a, t0, t0 + 0.35) * (1 - seg(a, t0 + 0.7, t0 + 1.0)), ok = a > t0 + 0.6;
    if (beam > 0) laps += `<path d="M${x - 70} ${y - 60}L${SX + 120} ${SY - 20}L${SX + 180} ${SY + 40}Z" fill="${P.green}" opacity="${(0.25 * beam).toFixed(2)}"/>`;
    laps += at(x, y, laptop(ok ? "#c8f7dc" : "#5a6aa8", ok ? at(0, -110, mark(2, 50), 1) : ""), 0.65 * pop(a - 2.2 - i * 0.1)) + (ok ? check(x + 100, y - 150, 30, P.green, a - t0 - 0.6) : ""); });
  const g = night(c, tot, 29) + layer(laps + sl + marked + st + k + curtain, c);
  return { g, in: toScreen(c, KX, KY), inC: P.gold, inZ: 18, out: toScreen(c, SX + 150, SY + 10), outC: mix(P.teal, "#ffffff", 0.78), outZ: 18 };
}

// ---- 3: a different mark on every page, checkable, not copyable ----
function s3(a, tot) {
  const c = camAt(a, [[0, 560, 480, 1.7], [1.8, 760, 480, 1.25], [3.5, 860, 470, 1.25], [4.95, 900, 470, 1.28]]);
  const PX = [330, 680, 1030], PY = 470; let g = "";
  PX.forEach((x, i) => { const t0 = 0.25 + i * 0.55, hit = a > t0 + 0.2;
    g += at(x, PY, page({ rows: [["blue", "pink", String(30 - i * 9)], ["teal", "violet", ""]] }), 1.1 * pop(a - i * 0.1));
    if (hit) g += at(x + 60, PY + 110, mark(i + 1, 52), 0.4 + 0.6 * spring(a - t0 - 0.2, 10, 18));
    if (a > 2.1 + i * 0.3) g += check(x + 120, PY - 200, 34, P.green, a - 2.1 - i * 0.3); });
  // the real stamp hops from page to page
  const hop = Math.min(2, Math.floor(Math.max(0, a - 0.05) / 0.55)), ph = clamp((a - 0.05 - hop * 0.55) / 0.55), sx = lerp(PX[Math.max(0, hop)] + 60, PX[Math.min(2, hop + (ph > 0.6 ? 1 : 0))] + 60, ease(seg(ph, 0.6, 1))), sy = PY + 30 - 200 * Math.sin(Math.PI * ph) - (a > 1.9 ? 260 * ease(seg(a, 1.9, 2.3)) : 0);
  g += at(sx, sy, stamp(1), 1.3);
  // a fourth page; a grey forged stamp presses a smudge, crossed out
  const FX = 1380, f = seg(a, 3.7, 4.05), fy = PY + 30 - 280 * (1 - f) + (a > 4.15 ? 280 * ease(seg(a, 4.15, 4.5)) * -1 : 0);
  g += at(FX, PY, page({ rows: [["blue", "pink", "30"], ["teal", "violet", ""]] }), 1.1 * pop(a - 3.3));
  if (a > 4.05) g += at(FX + 60, PY + 110, `<ellipse rx="56" ry="40" fill="#8a8fa8" opacity=".75"/><path d="M-40 -10q20 -20 40 6t40 -8" stroke="#5a5f78" stroke-width="10" fill="none"/>`, 1) + cross(FX + 120, PY - 200, 38, P.red, a - 4.15);
  if (a > 3.4) g += at(FX + 60, fy, stamp(1, {}).replace(new RegExp(P.red, "g"), "#8a8fa8").replace(new RegExp(P.wood, "g"), "#6a6f88"), 1.3);
  return { g: night(c, tot, 31) + layer(g, c), in: toScreen(c, PX[0] + 60, PY + 110), inC: mix(P.teal, "#ffffff", 0.78), inZ: 18 };
}

// ---- 4: more keys than grains of sand ----
const BIG = "115792089237316195423570985008687907852837564279074904382605163141518161494337";
function s4(a, tot) {
  const head = -1100 + 78 * 54 * ease(seg(a, 1.25, 2.6)); const c = camAt(a, [[0, -700, 420, 1.0], [1.25, -700, 420, 1.0], [2.6, 3000, 420, 1.0], [3.4, 1000, 700, 0.42], [5.2, 1000, 700, 0.43], [5.8, 1560, 860, 1.05], [7.09, 1560, 860, 1.08]]);
  // the number unrolls left to right across the sky, one digit after another (1.3 – 2.6)
  const n = Math.round(78 * ease(seg(a, 1.25, 2.6))), DX = 54;
  let digits = ""; for (let i = 0; i < n; i++) digits += text(-1100 + i * DX, 340, BIG[i], 92, i < 1 ? P.gold : P.cream);
  const band = n > 0 ? `<path d="${rr(-1150, 230, n * DX + 60, 150, 24)}" fill="#2a1d66" stroke="${P.gold}" stroke-width="10"/>` : "";
  const counter = n > 0 ? text(-1100 + n * DX + 150, 330, `${n}`, 70, P.gold, { anchor: "start" }) : "";
  // the beach: a heap of sand under it, a fraction of its width
  const BY = 1100, sand = `<path d="M-500 ${BY}Q300 ${BY - 420} 1100 ${BY}Z" fill="#e8b860"/><path d="M-500 ${BY}Q300 ${BY - 330} 1100 ${BY}Z" fill="#d9a24a"/>` + Array.from({ length: 70 }, (_, i) => `<circle cx="${(-120 + rnd(i * 3) * 840).toFixed(0)}" cy="${(BY - 20 - rnd(i * 3 + 1) * 150 * (1 - Math.abs(rnd(i * 3) - 0.5) * 2)).toFixed(0)}" r="4" fill="#f6d690"/>`).join("");
  const sea = `<rect x="-1500" y="${BY}" width="6000" height="1600" fill="#1d4f9a"/><rect x="-1500" y="${BY}" width="4800" height="16" fill="#9fe7ff" opacity=".5"/>`;
  const span = a > 3.2 ? `<path d="M-500 ${BY - 460}h1600" stroke="${P.gold}" stroke-width="22"/><path d="M-500 ${BY - 520}v120M1100 ${BY - 520}v120" stroke="${P.gold}" stroke-width="22"/>` + `<path d="M-1100 450h${(78 * DX).toFixed(0)}" stroke="${P.cream}" stroke-width="22" stroke-dasharray="40 26" opacity="${(0.6 * seg(a, 3.3, 3.8)).toFixed(2)}"/>` : "";
  // a die tumbles and lands; a red cross: no chance of guessing
  const DXX = 1560, roll = seg(a, 5.6, 6.3), dy = BY - 420 + 300 * easeIn(roll) - (roll >= 1 ? 0 : 0), rot = 540 * easeOut(roll);
  const die = a > 5.5 ? at(DXX, roll < 1 ? dy : BY - 150, `${two(rr(-60, -60, 120, 120, 22), "#fff", "#d8d8ee", 0, 8)}${[[-28, -28], [28, 28], [0, 0], [28, -28], [-28, 28]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${P.ink}"/>`).join("")}`, 1.9, rot) : "";
  const no = a > 6.4 ? cross(DXX + 190, BY - 330, 56, P.red, a - 6.4) : "";
  return { g: night(c, tot, 37) + layer(sea + sand + band + digits + counter + span + die + no, c) };
}

// ---- 5: anyone can read any balance, even Satoshi's ----
function s5(a, tot) {
  const BX = 1100, BY = 470, K = 2.4;
  const c = camAt(a, [[0, 1100, 470, 1.1], [1.2, 1100, 460, 1.2], [3.0, 1180, 520, 0.95], [6.1, 1220, 520, 0.98]]);
  const ROWS = [["blue", "12.5"], ["pink", "3"], ["teal", "0.4"], ["hood", "≈ 1,000,000"]];
  let pg = "";
  ROWS.forEach(([who, amt], r) => { const y = -60 + r * 40, col = who === "hood" ? "#4b3d8f" : { blue: P.blue, pink: P.pink, teal: P.teal }[who];
    const lit = (r === 0 && a > 1.7 && a < 3.0) || (r === 3 && a > 3.3);
    if (lit) pg += `<path d="${rr(-150, y - 18, 300, 34, 8)}" fill="${P.gold}" opacity=".35"/>`;
    pg += `<circle cx="-128" cy="${y}" r="10" fill="${col}"/>${text(-110, y + 8, "bc1q" + "7c0e4a9fd5"[r] + "…", 20, P.ink, { anchor: "start" })}${text(130, y + 9, amt, 24, P.ink, { anchor: "end" })}`; });
  const bk = at(BX, BY, rings(0, 0, 230, P.gold, 0.12) + book(pg), K);
  // the magnifier slides to row 1, then to the hooded chair's row
  const mp = a < 3.0 ? [lerp(BX + 700, BX + 160, ease(seg(a, 0.9, 1.6))), BY + K * -60] : [lerp(BX + 160, BX + 160, 1), lerp(BY + K * -60, BY + K * 60, ease(seg(a, 3.0, 3.4)))];
  const mag = at(mp[0], mp[1], `<circle r="70" fill="#cfe9ff" opacity=".25" stroke="${P.steel}" stroke-width="16"/><path d="M50 50L120 120" stroke="${P.woodD}" stroke-width="26" stroke-linecap="round"/>`, 1);
  // the hooded chair beside the book, its heap; small coins with flags keep landing on it
  const HX = BX + 470, HY = 900; let tips = "";
  if (a > 4.5) for (let i = 0; i < 6; i++) { const t = ((a - 4.5) * 0.9 + i / 6) % 1, x = HX + 260 + (i - 2.5) * 40, y = lerp(150, HY - 120, easeIn(t));
    tips += at(x, y, coin(18, "") + `<path d="M0 -18v-40" stroke="${P.steel}" stroke-width="4"/><path d="M0 -58h26l-8 9l8 9h-26Z" fill="${[P.pink, P.teal, P.blue][i % 3]}"/>`, 1); }
  let heap = ""; for (let i = 0; i < 26; i++) heap += `<ellipse cx="${(HX + 260 + (rnd(i * 3) - 0.5) * 300 * (1 - i / 34)).toFixed(0)}" cy="${(HY - i * 7).toFixed(0)}" rx="40" ry="14" fill="${i % 2 ? P.gold : P.goldD}"/>`;
  const chair = a > 3.2 ? rings(HX, HY - 250, 230, "#9fe7ff", 0.12) + at(HX, HY, hoodChair({ coat: 1, colour: "#5a4ab0", colourD: "#43358f" }), 1.15 * pop(a - 3.2)) + heap + (a > 3.4 ? rings(HX + 260, HY - 100, 180, P.gold, 0.15) : "") : "";
  const ground = `<rect x="-900" y="${HY}" width="3800" height="600" fill="#1b2054"/>`;
  return { g: night(c, tot, 41) + layer(skyline(83, -600, 2800, HY - 40, 140, 320, "#221a5c", "#ffb066"), c, 0.5) + layer(ground + chair + tips + bk + mag, c) };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const c3keysSet = makeSet(SHOTS, V, P);
