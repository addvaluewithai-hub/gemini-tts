// Crypto part 2, scene "cap": the prize that halves, the 21 million ceiling, and the satoshi. Eight wordless shots, one
// per board beat (shot list: episodes/techforbadguys/explain-crypto-02-world/shots.md), in the world of part 1.
//   0 a page and its prize, a heap of 50 coins, 2009; a blade halves the heap
//   1 stacks step down: 50 2009, 25 2012, 12.5 2016, 6.25 2020, 3.125 2024
//   2 the 3.125 stack halves again, 1.5625, 2028; a rig with a big bill switches off and is driven away
//   3 coins rain into a silo with a 21,000,000 line; the lid clamps on; the rules' code case glows behind it
//   4 the silo fills to about 95%; a long road from it to a calendar, 2140
//   5 a counter rolls to 20,000,000, March 2026; the last thin slice of the silo; an hourglass, 100+ years
//   6 the prize coins dwindle; only small fee coins drip into the miner's bowl; a guard booth flickers; a big ?
//   7 a coin breaks into a grid of tiny pieces, 100,000,000; one piece floats to the empty hooded chair
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2cap.v.js";
import { stars, skyline } from "./bank.js";
import { calPage, calFlip, hoodChair } from "./props.js";
import { P, mix, coin, page, rig, silo, container, booth } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x1 = 2600) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f", x0 = -1200, x1 = 6400) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="900" fill="${fill}"/>`;
const city = (c, seed, G, x1 = 2800) => layer(skyline(seed, -800, x1, G - 20, 80, 240, "#1f1652", "#ffb066"), c, 0.45);
// a flat coin seen from the side, for stacks and heaps
const flat = (x, y, rx = 70, ry = 18, i = 0) => `<ellipse cx="${x}" cy="${y + ry * 0.45}" rx="${rx}" ry="${ry}" fill="${P.goldD}"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${i % 2 ? P.gold : "#ffdc6a"}"/>`;
// a stack of n coins standing on y = 0 (n may be fractional: the top coin is then thinner)
const stack = (n, rx = 70, step = 15) => { let g = ""; const full = Math.floor(n), part = n - full; for (let i = 0; i < full; i++) g += flat(0, -i * step, rx, rx * 0.26, i);
  if (part > 0.05) g += `<g transform="translate(0 ${-full * step}) scale(1 ${part.toFixed(3)})">${flat(0, 0, rx, rx * 0.26, full)}</g>`; return g; };
// a heap of coins: rows from the bottom, `n` coins in all, radius r
const heap = (n, r = 44) => { let g = "", k = 0; for (let row = 0; k < n; row++) { const w = Math.max(1, 6 - row); for (let i = 0; i < w && k < n; i++, k++) g += at((i - (w - 1) / 2) * r * 1.6, -r * 0.6 - row * r * 0.95, coin(r)); } return g; };
// a cleaver that comes down along x = 0 from above: p 0 up, 1 down to y = 0
const cleaver = (p) => at(0, lerp(-900, -40, easeIn(p)), `${two("M-16 -340H16V-120L60 -60V40H-60V-60L-16 -120Z", "#dfe6ff", P.steelD, 0, 6)}<path d="${rr(-30, -460, 60, 140, 14)}" fill="${P.wood}"/><path d="M-60 40H60" stroke="#fff" stroke-width="6"/>`);

// ---- 0: fifty coins a page, and every four years the prize is cut in two ----
function s0(a, tot) {
  const c = camAt(a, [[0, 1000, 600, 1.0], [2.0, 1020, 600, 1.02], [3.3, 1130, 680, 1.2], [4.2, 1140, 680, 1.24]]);
  const PG = [560, 560], HP = [1180, 880];
  const pg = at(PG[0], PG[1], rings(0, 0, 230, P.gold, 0.1) + page({ rows: [["blue", "pink", "30"], ["teal", "violet", "5"], ["pink", "teal", "12"], ["violet", "blue", "7"]], seal: 11, prev: 10, block: 1 }), 1.3 * pop(a));
  const arrow = drawn(`M${PG[0] + 200} ${PG[1] - 40}Q${HP[0] - 160} ${PG[1] - 140} ${HP[0] - 220} ${HP[1] - 190}`, seg(a, 1.5, 2.0), P.gold, 12, 'stroke-dasharray="1 0"');
  const cut = seg(a, 3.55, 3.75), apart = easeOut(seg(a, 3.7, 4.2)) * 120;
  const hp = heap(15, 46), clipL = `<clipPath id="hl"><rect x="-600" y="-600" width="600" height="700"/></clipPath><clipPath id="hr"><rect x="0" y="-600" width="600" height="700"/></clipPath>`;
  const H = at(HP[0], HP[1], clipL + `<g transform="translate(${-apart} 0)"><g clip-path="url(#hl)">${hp}</g></g><g transform="translate(${apart} 0)"><g clip-path="url(#hr)">${hp}</g></g>`, pop(a - 0.3));
  const fifty = at(HP[0], HP[1] - 420, text(0, 0, "50", 150, P.gold), pop(a - 0.74));
  const flip = seg(a, 2.45, 2.95), cal = at(1560, 390, (flip < 1 ? calFlip("2009", "", flip, 150) : "") + (flip > 0 ? calPage("2012", "", 1, 150) : ""), 0.7 * pop(a - 0.4), 5);
  const blade = a > 3.3 && a < 4.2 ? at(HP[0], HP[1], cleaver(seg(a, 3.3, 3.6)), 1, 0, `opacity="${(1 - seg(a, 3.95, 4.2)).toFixed(2)}"`) : "";
  const g = night(c, tot, 13) + city(c, 3, 900) + layer(ground(900) + pg + arrow + H + blade + fifty + cal, c);
  return { g, out: toScreen(c, HP[0] + apart + 40, HP[1] - 120), outC: P.gold, outZ: 18 };
}

// ---- 1: fifty, twenty-five, twelve and a half … three and a bit ----
const VAL = ["50", "25", "12.5", "6.25", "3.125"], YR = ["2009", "2012", "2016", "2020", "2024"], NC = [40, 20, 10, 5, 2.5], AT1 = [0, 0.4, 0.9, 2.0, 3.25], SX = (i) => 250 + i * 265;
function s1(a, tot) {
  const c = camAt(a, [[0, 480, 600, 1.2], [1.0, 560, 600, 1.16], [3.4, 820, 620, 1.0], [4.14, 840, 620, 1.0]]), G = 900;
  let g = "";
  NC.forEach((n, i) => { const u = a - AT1[i]; if (u < -0.05) return; const grow = easeOut(seg(u, 0, 0.35)), x = SX(i);
    g += at(x, G, stack(n * grow, 78, 13.5)) + at(x, G - n * 13.5 - 90, text(0, 0, VAL[i], 76, P.gold), pop(u - 0.15)) + text(x, G + 74, YR[i], 46, P.cream, { opacity: clamp(u / 0.3).toFixed(2) });
    if (i > 0 && u > 0) g += drawn(`M${SX(i - 1) + 90} ${G - NC[i - 1] * 13.5 - 40}Q${x - 40} ${G - NC[i - 1] * 13.5 - 60} ${x - 30} ${G - n * 13.5 - 60}`, seg(u, 0, 0.3), P.cream, 6, 'stroke-dasharray="8 12" opacity=".5"'); });
  const last = toScreen(c, SX(4), G - 50);
  return { g: night(c, tot, 19) + city(c, 7, G) + layer(ground(G) + g, c), in: toScreen(c, SX(0), G - 300), inC: P.gold, inZ: 18, out: last, outC: P.gold, outZ: 22 };
}

// ---- 2: 2028, half again; the rig with the big bill switches off and leaves ----
function s2(a, tot) {
  const c = camAt(a, [[0, 900, 640, 1.12], [3.9, 960, 640, 1.06], [6.32, 1020, 640, 1.04]]), G = 920, SXc = 720;
  const half = seg(a, 2.75, 3.0), apart = easeOut(seg(a, 2.75, 3.2)) * 110, gone = easeIn(seg(a, 3.2, 3.9));
  const st = stack(5, 150, 30), clip = `<clipPath id="sl2"><rect x="-300" y="-400" width="300" height="500"/></clipPath><clipPath id="sr2"><rect x="0" y="-400" width="300" height="500"/></clipPath>`;
  const base = at(SXc, G, clip + `<g transform="translate(${-apart * 0.4} 0)"><g clip-path="url(#sl2)">${st}</g></g>`);
  const top = at(SXc + apart + 260 * gone, G + 500 * gone * gone, `<g clip-path="url(#sr2)">${st}</g>`, 1, 50 * gone, `opacity="${(1 - seg(a, 3.6, 3.9)).toFixed(2)}"`);
  const blade = a > 2.4 && a < 3.4 ? at(SXc, G, cleaver(seg(a, 2.4, 2.75)), 1, 0, `opacity="${(1 - seg(a, 3.1, 3.4)).toFixed(2)}"`) : "";
  const lab = at(SXc, G - 260, text(0, 0, half > 0.5 ? "1.5625" : "3.125", 100, P.gold), half > 0.5 ? pop(a - 3.0) : pop(a));
  const cal = at(1130, 380, calPage("2028", "", 1, 150), 0.72 * pop(a - 1.3), -4);
  // a container on a truck: its bill, its lights going out, then away it goes
  const drive = easeIn(seg(a, 5.25, 6.3)) * 1100, on = a < 4.8 ? 1 : 0;
  const bill = a > 4.3 ? at(-120, -250, `<path d="M0 0v40" stroke="${P.steel}" stroke-width="4"/>${two(rr(-90, 40, 180, 90, 12), P.cream, P.creamD, 0, 5)}${text(0, 108, "$$$", 58, P.red)}`, pop(a - 4.3), 6 * Math.sin(tot * 3)) : "";
  const truck = `${two(rr(-260, -60, 560, 40, 8), "#3a2a7a", "#291d5c", 0, 6)}${two("M300 -20V-170Q300 -190 320 -190H400L450 -120V-20Z", P.blue, P.blueD, 0, 8)}<path d="M330 -170h56l38 50h-94Z" fill="#bfe6ff"/>${[-170, 120, 380].map((x) => `<circle cx="${x}" cy="-14" r="34" fill="${P.ink}"/><circle cx="${x}" cy="-14" r="13" fill="${P.steel}"/>`).join("")}`;
  const tr = at(1420 + drive, G, truck + at(20, -60, container({ spin: tot * 8 * on, on }) + bill), 0.95);
  const dark = on ? "" : rings(1420 + drive, G - 200, 160, P.ink, 0.0);
  const g = night(c, tot, 29) + city(c, 11, G) + layer(ground(G) + base + top + blade + lab + cal + tr + dark, c);
  return { g, in: toScreen(c, SXc, G - 40), inC: P.gold, inZ: 22, out: toScreen(c, SXc, G - 30), outC: P.gold, outZ: 18 };
}

// ---- 3: twenty-one million, and not one more: the lid, and the code behind it ----
const SI = [820, 1000], SK = 1.25;
const codeCase = (shine, a) => { const rows = Array.from({ length: 6 }, (_, r) => { const ind = [0, 1, 2, 2, 1, 0][r], w = [190, 230, 160, 200, 120, 60][r], cols = [P.pink, P.teal, P.gold, P.blue, P.green, P.violet];
    return `<path d="${rr(-170 + ind * 34, -400 + r * 54, w, 20, 10)}" fill="${cols[r]}"/>`; }).join("");
  return `${shine > 0 ? [0, 1, 2, 3, 4].map((i) => { const an = -Math.PI / 2 + (i - 2) * 0.5; return `<path d="M0 -240L${(Math.cos(an) * 1000 - 60).toFixed(0)} ${(-240 + Math.sin(an) * 1000).toFixed(0)}L${(Math.cos(an) * 1000 + 60).toFixed(0)} ${(-240 + Math.sin(an) * 1000).toFixed(0)}Z" fill="#ffd98a" opacity="${(0.08 * shine).toFixed(3)}"/>`; }).join("") + rings(0, -240, 300, P.gold, 0.12 * shine) : ""}
    <path d="${rr(-220, -450, 440, 400, 20)}" fill="#0e1240"/>${text(-196, -404, "{", 46, P.gold, { anchor: "start" })}${rows}<path d="${rr(-240, -470, 480, 440, 24)}" fill="#cfe9ff" opacity=".12" stroke="#cfe9ff" stroke-width="10"/>${two(rr(-270, -40, 540, 40, 10), P.violet, P.violetD, 0, 10)}`; };
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.0], [2.8, 960, 590, 1.02], [3.6, 1060, 600, 0.95], [4.94, 1080, 600, 0.96]]);
  const fill = lerp(0.18, 0.6, ease(seg(a, 0, 2.8))), lid = ease(seg(a, 3.0, 3.35));
  let rain = ""; if (a < 3.2) for (let i = 0; i < 9; i++) { const u = ((a * 1.4 + i / 9) % 1), x = SI[0] + (rnd(i) - 0.5) * 220, y = lerp(-80, SI[1] - 700 * fill * SK, u); rain += at(x, y, coin(18), 1, 0, `opacity="${(1 - seg(a, 2.9, 3.2)).toFixed(2)}"`); }
  const S = at(SI[0], SI[1], silo(fill, { lid, mark: a > 1.2, id: "c3" }), SK);
  const topY = SI[1] - 620 * SK;
  const lab = at(SI[0] + 220, topY + 30, text(0, 0, "21,000,000", 96, P.gold, { anchor: "start" }), pop(a - 1.6));
  const slam = a > 3.3 ? rings(SI[0], topY, 260 * spring(a - 3.3, 7, 10), P.cream, 0.25 * (1 - seg(a, 3.5, 4.0))) : "";
  const up = ease(seg(a, 3.55, 4.0)), CC = at(1640, 1000 + 600 * (1 - up), codeCase(seg(a, 3.75, 4.3), a), 0.8);
  const tie = up > 0.9 ? drawn(`M${SI[0] + 200} ${topY - 10}Q${1500} ${topY - 40} ${1600} ${640}`, seg(a, 3.9, 4.4), P.gold, 6, 'stroke-dasharray="10 12"') : "";
  const g = night(c, tot, 37) + city(c, 15, 1000) + layer(ground(1000) + CC + tie + rain + S + slam + lab, c);
  return { g, in: toScreen(c, SI[0], SI[1] - 300), inC: P.gold, inZ: 18, out: toScreen(c, SI[0], SI[1] - 250), outC: "#1b1550", outZ: 16 };
}

// ---- 4: about 95% already mined; the last coin, around 2140 ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.0], [2.0, 980, 600, 1.0], [3.6, 3300, 600, 0.92], [4.95, 3340, 600, 0.94]]), G = 1000;
  const fill = lerp(0.6, 0.95, ease(seg(a, 0.3, 1.6)));
  const S = at(SI[0], SI[1], silo(fill, { lid: 1, mark: true, id: "c4" }), SK), topY = SI[1] - 620 * SK;
  const lab = at(SI[0] + 220, topY + 30, text(0, 0, "21,000,000", 96, P.gold, { anchor: "start" }));
  const pct = at(SI[0] + 360, topY + 170, `${two(rr(-130, -50, 260, 100, 50), P.gold, P.goldD, 0, 6)}${text(0, 26, "≈ " + Math.round(lerp(60, 95, ease(seg(a, 0.3, 1.6)))) + "%", 64, P.ink)}`, pop(a - 0.4));
  // the road to 2140, with posts going by
  const road = `<path d="M${SI[0] + 200} ${G + 40}C1800 ${G + 40} 2400 ${G - 20} 3600 ${G + 30}" fill="none" stroke="#3a2a7a" stroke-width="70" stroke-linecap="round"/><path d="M${SI[0] + 200} ${G + 40}C1800 ${G + 40} 2400 ${G - 20} 3600 ${G + 30}" fill="none" stroke="${P.gold}" stroke-width="6" stroke-dasharray="30 30" opacity=".6"/>`;
  const posts = Array.from({ length: 7 }, (_, i) => { const x = 1400 + i * 300; return `<path d="M${x} ${G - 10}V${G - 120}" stroke="${P.steelD}" stroke-width="12"/>${disc(x, G - 130, 18, P.cream, P.creamD)}`; }).join("");
  const cal = at(3600, 620, calPage("2140", "", 1, 150), 1.1 * pop(a - 3.2), -4) + (a > 3.4 ? rings(3600, 620, 240, P.gold, 0.12 * seg(a, 3.4, 3.8)) : "");
  const g = night(c, tot, 43, 4400) + layer(skyline(21, -800, 4400, G - 20, 80, 240, "#1f1652", "#ffb066"), c, 0.45) + layer(ground(G) + road + posts + S + lab + pct + cal, c);
  return { g, in: toScreen(c, SI[0], SI[1] - 250), inC: "#1b1550", inZ: 16, out: toScreen(c, 3600, 640), outC: P.cream, outZ: 18 };
}

// ---- 5: coin number 20,000,000 in March 2026; the last million takes over a century ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [5.9, 980, 560, 1.02]]), G = 1000, SX5 = 540;
  const S = at(SX5, G, silo(0.95, { lid: 1, id: "c5" }), 1.0), top = G - 620, sliceY = top + 10, sliceH = (620 - 80) * 0.05 + 40;
  const slice = a > 3.2 ? `<path d="${rr(SX5 - 150, sliceY, 300, sliceH, 18)}" fill="none" stroke="${P.gold}" stroke-width="8" stroke-dasharray="16 10" opacity="${(0.6 + 0.4 * Math.sin(tot * 6)).toFixed(2)}"/>` + rings(SX5, sliceY + sliceH / 2, 200, P.gold, 0.1 * seg(a, 3.2, 3.6)) : "";
  const v = Math.round(lerp(19990000, 20000000, ease(seg(a, 0.5, 1.6))) / 1000) * 1000, s = v.toLocaleString("en");
  const counter = at(1060, 300, `${two(rr(-380, -100, 760, 150, 30), "#2c1f63", P.ink, 0, 8)}${text(0, 22, s, 112, P.gold)}`, pop(a - 0.3));
  const cal = at(1470, 470, calPage("2026", "MAR", 1, 150), 0.62 * pop(a - 1.9), 6);
  // the hourglass: comes in, turns over, sand falls
  const turn = ease(seg(a, 4.2, 4.8)), sand = seg(a, 4.8, 5.9);
  const glass = `<path d="M-90 -180H90M-90 180H90" stroke="${P.wood}" stroke-width="26" stroke-linecap="round"/><path d="M-76 -170Q-76 -40 -10 0Q-76 40 -76 170H76Q76 40 10 0Q76 -40 76 -170Z" fill="#cfe9ff" opacity=".18" stroke="#cfe9ff" stroke-width="8"/>
    <path d="M${-60 + 30 * sand} ${-150 + 120 * sand}Q0 ${-20} ${60 - 30 * sand} ${-150 + 120 * sand}Z" fill="${P.gold}"/><path d="M-60 160Q0 ${160 - 120 * sand - 30} 60 160Z" fill="${P.gold}"/>${sand > 0 && sand < 1 ? `<path d="M0 -10V150" stroke="${P.gold}" stroke-width="5"/>` : ""}`;
  const HG = at(1120, 760, glass, 1.0 * pop(a - 3.7), 180 * (1 - turn));
  const yrs = at(1120, 520, text(0, 0, "100+", 90, P.cream), pop(a - 4.4));
  const arrow = a > 3.5 ? drawn(`M${SX5 + 170} ${sliceY + 30}Q${880} ${sliceY - 60} ${1030} ${640}`, seg(a, 3.5, 4.0), P.gold, 7, 'stroke-dasharray="10 12"') : "";
  const g = night(c, tot, 47) + city(c, 23, G) + layer(ground(G) + S + slice + arrow + counter + cal + HG + yrs, c);
  return { g, in: toScreen(c, 1470, 470), inC: P.cream, inZ: 18, out: toScreen(c, 1120, 900), outC: P.gold, outZ: 18 };
}

// ---- 6: when the prize runs out, only the fees are left: enough to guard the book? ----
const BIG6 = [0, 0.3, 0.6, 1.0, 1.5], FEE6 = [1.9, 2.25, 2.6, 3.1, 3.7, 4.4, 5.1, 5.8];
function s6(a, tot) {
  const c = camAt(a, [[0, 1225, 680, 1.3], [6.27, 1235, 680, 1.35]]), G = 960, BW = [940, G];
  const R = at(1230, G, rig({ spin: tot * 9, blink: tot }), 1.2);
  // coins falling from the sky into the bowl: the big ones stop, the small ones drip
  let fall = "", got = 0; const drop = (t, r, i) => { const u = a - t; if (u < 0) return; const land = seg(u, 0, 0.55); if (land >= 1) { got += r > 30 ? 1 : 0.25; return; }
    fall += at(BW[0] + (rnd(i) - 0.5) * 60, lerp(-80, BW[1] - 60, easeIn(land)), coin(r), 1, u * 200); };
  BIG6.forEach((t, i) => drop(t, 44, i)); FEE6.forEach((t, i) => drop(t, 16, 20 + i));
  let inBowl = ""; const nb = Math.min(5, BIG6.filter((t) => a - t > 0.55).length), nf = FEE6.filter((t) => a - t > 0.55).length;
  for (let i = 0; i < nb; i++) inBowl += `<ellipse cx="${BW[0] - 80 + i * 40}" cy="${BW[1] - 70 - (i % 2) * 10}" rx="34" ry="12" fill="${i % 2 ? P.gold : P.goldD}"/>`;
  for (let i = 0; i < nf; i++) inBowl += `<circle cx="${BW[0] - 60 + i * 18}" cy="${BW[1] - 88 - (i % 3) * 6}" r="10" fill="${P.gold}"/>`;
  const bowl = `${inBowl}<path d="M${BW[0] - 150} ${BW[1] - 80}H${BW[0] + 150}Q${BW[0] + 140} ${BW[1]} ${BW[0]} ${BW[1]}Q${BW[0] - 140} ${BW[1]} ${BW[0] - 150} ${BW[1] - 80}Z" fill="${P.steel}"/><path d="M${BW[0] - 150} ${BW[1] - 80}H${BW[0] + 150}" stroke="#cdd5ee" stroke-width="10" stroke-linecap="round"/>`;
  const sky = a > 1.6 && a < 2.2 ? rings(BW[0], 120, 120, P.gold, 0.08) : "";
  const lamp = a < 2.9 ? 1 : a < 3.6 ? (Math.sin(a * 40) > 0 ? 1 : 0.15) : 0.35 + 0.25 * (Math.sin(tot * 9) > 0.6 ? 1 : 0);
  const B = at(1580, G, booth({ lamp, cap: true }), 1.0);
  const q = a > 4.05 ? at(1300, 560, text(0, 90, "?", 300, P.cream), pop(a - 4.05) * (1 + 0.04 * Math.sin(tot * 3)), 4 * Math.sin(tot * 2)) : "";
  const g = night(c, tot, 59) + city(c, 31, G) + layer(ground(G) + sky + R + bowl + fall + B + q, c);
  return { g, in: toScreen(c, 1230, 820), inC: P.gold, inZ: 18, out: toScreen(c, BW[0], BW[1] - 80), outC: P.gold, outZ: 20 };
}

// ---- 7: a hundred million pieces; the piece is called after the one who is gone ----
function s7(a, tot) {
  const c = camAt(a, [[0, 900, 560, 1.0], [2.4, 900, 560, 1.02], [3.6, 1000, 600, 1.05], [4.57, 1010, 600, 1.06]]);
  const C0 = [760, 460], RC = 230, grid = ease(seg(a, 1.0, 1.7)), N = 12, cell = (RC * 2) / N, pick = [7, 8];
  let dots = ""; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const x = -RC + (i + 0.5) * cell, y = -RC + (j + 0.5) * cell; if (Math.hypot(x, y) > RC - cell * 0.4) continue; if (i === pick[0] && j === pick[1] && a > 2.5) continue;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(cell * 0.38 * grid + 0.1).toFixed(1)}" fill="${(i + j) % 2 ? P.gold : "#ffdc6a"}"/>`; }
  const face = `<g opacity="${(1 - grid).toFixed(2)}">${coin(RC, "B")}</g>${grid > 0 ? `<circle r="${RC}" fill="${P.goldD}" opacity="${(0.9 * grid).toFixed(2)}"/>${dots}` : ""}`;
  const C = at(C0[0], C0[1], rings(0, 0, RC + 40, P.gold, 0.12) + face, pop(a));
  const lab = at(C0[0], C0[1] + RC + 120, text(0, 0, "100,000,000", 96, P.cream), pop(a - 1.3));
  // the chosen piece rises, glows and floats over to the empty chair
  const CH = [1360, 940], seat = [CH[0], CH[1] - 205], start = [C0[0] - RC + (pick[0] + 0.5) * cell, C0[1] - RC + (pick[1] + 0.5) * cell];
  const fly = ease(seg(a, 2.75, 3.85)), b = bez(start, [1150, 180], seat, fly), dk = lerp(1, 1.6, seg(a, 2.5, 2.8)) * (fly > 0.95 ? 1 : 1);
  const piece = a > 2.5 ? at(b[0], b[1] + (fly >= 1 ? 4 * Math.sin(tot * 3) : 0), rings(0, 0, cell * 1.0, P.gold, 0.3) + `<circle r="${(cell * 0.38).toFixed(1)}" fill="#fff3c2"/>`, dk) : "";
  const chair = at(CH[0], CH[1], hoodChair(), 1.0 * pop(a - 2.3));
  const name = a > 2.8 ? at(CH[0] - 250, CH[1] - 560, `${two(rr(-120, -36, 240, 72, 36), P.cream, P.creamD, 0, 5)}${text(0, 20, "satoshi", 50, P.ink)}`, pop(a - 2.8)) : "";
  const g = night(c, tot, 67) + city(c, 41, 940) + layer(ground(940) + C + lab + chair + piece + name, c);
  return { g, in: toScreen(c, C0[0], C0[1]), inC: P.gold, inZ: 20 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7];
// in a Short (cfg.vertical) the portrait versions of c2cap.v.js (see makeSet in kit.js)
export const c2capSet = makeSet(SHOTS, V, P);
