// Crypto part 2, the recap: one wordless shot, the camera travelling left to right over three stops (host right).
//   1 linked pages with fingerprint seals; a number changed in red is crossed out and rolls back
//   2 the warehouse of rigs, fed by a pylon's bolt; the book above it inside a ring of gold links
//   3 the code case, the rules, and every laptop around it shows a check
import { clamp, lerp, ease, easeOut, seg, spring, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2recap.v.js";
import { P, mix, book, rows, coin, stars, skyline } from "./bank.js";
import { laptop } from "./props.js";
import { page, link, warehouse, pylon, bolt } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const badge = (n, a) => (a <= 0 ? "" : at(0, 0, rings(0, 0, 70, P.gold, 0.2) + disc(0, 0, 62, P.gold, P.goldD) + text(0, 30, n, 86, P.ink), pop(a)));
const codeCase = (shine, tot) => { const code = Array.from({ length: 7 }, (_, r) => { const ind = [0, 1, 2, 2, 1, 1, 0][r], w = [190, 230, 160, 200, 120, 210, 40][r], cols = [P.pink, P.teal, P.gold, P.blue, P.green, P.violet, P.pink];
    return r === 0 ? text(-190, -362, "{", 48, P.gold, { anchor: "start" }) : r === 6 ? text(-190, -50, "}", 48, P.gold, { anchor: "start" }) : `<path d="${rr(-150 + ind * 34, -380 + r * 52 - 8, w, 18, 9)}" fill="${cols[r]}"/>`; }).join("");
  return `${shine > 0 ? [0, 1, 2, 3, 4, 5].map((i) => { const an = -Math.PI / 2 + (i - 2.5) * 0.5; return `<path d="M0 -230L${(Math.cos(an) * 1000 - 70).toFixed(0)} ${(-230 + Math.sin(an) * 1000).toFixed(0)}L${(Math.cos(an) * 1000 + 70).toFixed(0)} ${(-230 + Math.sin(an) * 1000).toFixed(0)}Z" fill="#ffd98a" opacity="${(0.07 * shine * (1 + 0.2 * Math.sin(tot * 2 + i))).toFixed(3)}"/>`; }).join("") : ""}
    <path d="${rr(-240, -470, 480, 430, 20)}" fill="#0e1240"/>${code}<path d="${rr(-260, -490, 520, 470, 24)}" fill="#cfe9ff" opacity=".12" stroke="#cfe9ff" stroke-width="10"/><path d="M-200 -440L-120 -440L-220 -120Z" fill="#fff" opacity=".12"/>${two(rr(-300, -40, 600, 40, 10), P.violet, P.violetD, 0, 10)}`; };

function s0(a, tot) {
  const G = 900;
  const c = camAt(a, [[0, 900, 540, 1.06], [3.9, 960, 540, 1.0], [4.6, 2900, 540, 1.0], [7.5, 2960, 540, 1.0], [8.2, 4900, 540, 1.0], [11.22, 4960, 540, 1.02]]);
  let g = `<rect x="-800" y="${G}" width="7000" height="600" fill="#2a1556"/>`;
  // stop 1: the chain; the middle page is changed in red, crossed out, and rolls back
  const bad = a > 2.4 && a < 3.6, amt = bad ? "3000" : "30";
  [420, 860, 1300].forEach((x, i) => { if (i) g += link(x - 290, 560, x - 150, 560, bad && i === 2 ? P.red : P.gold);
    g += at(x, 560, page({ rows: [["teal", "violet", "5"], i === 1 ? ["blue", "pink", amt, bad ? P.red : P.ink] : ["pink", "teal", String(12 + i)], ["violet", "blue", "7"]], seal: i === 1 && bad ? 30 : 3 + i, sealC: i === 1 && bad ? P.red : undefined, prev: 2 + i, block: 1 }), 1.25 * pop(a + 0.6 - i * 0.15)); });
  g += bad && a > 2.9 ? at(860, 270, cross(0, 0, 70, P.red, a - 2.9), 1) : "";
  g += a > 3.55 && a < 4.2 ? rings(860, 560, 240 * spring(a - 3.55, 8, 14), P.green, 0.2 * (1 - seg(a, 3.8, 4.2))) : "";
  g += at(200, 170, badge("1", a - 1.35));
  // stop 2: the warehouse, the bolt, the book in its ring of links
  const sp = tot * 6;
  g += at(2860, G, warehouse(860, { heat: 1, t: tot, spin: sp })) + at(3360, G, pylon(), 0.75);
  if (a > 5.2) { const u = ((a - 5.2) * 1.4) % 1; g += `<path d="M3360 ${G - 360}L3260 ${G - 300}" stroke="${P.gold}" stroke-width="6" opacity=".6"/>` + at(lerp(3360, 3180, u), lerp(G - 400, G - 330, u), bolt(P.gold, 0.6)); }
  const BK = [2860, 300];
  g += at(BK[0], BK[1], rings(0, 0, 210, P.gold, 0.14) + book(rows("70", "80")), 0.8);
  for (let i = 0; i < 10; i++) { const t0 = 5.8 + i * 0.09, an0 = i / 10 * 6.283, an1 = (i + 1) / 10 * 6.283, p = seg(a, t0, t0 + 0.25); if (p <= 0) continue;
    g += link(BK[0] + 250 * Math.cos(an0), BK[1] + 160 * Math.sin(an0), BK[0] + 250 * Math.cos(an1), BK[1] + 160 * Math.sin(an1), P.gold, p, 0.6); }
  g += at(2180, 170, badge("2", a - 4.75));
  // stop 3: the rules in their case, every laptop agrees
  const shine = ease(seg(a, 8.4, 9.0));
  g += at(4780, G, codeCase(shine, tot), 0.85);
  [[4290, G], [4330, 600], [4560, 330], [5000, 330], [5230, 600], [5270, G]].forEach(([x, y], i) => { const t0 = 9.0 + i * 0.22;
    g += at(x, y, rings(0, -110, 150, a > t0 ? P.green : "#9fe7ff", 0.14) + laptop(a > t0 ? "#c9f7dd" : "#9fe7ff", at(0, -110, `<path d="M-90 -40h120M-90 0h160M-90 40h90" stroke="${a > t0 ? P.greenD : "#3fa9ff"}" stroke-width="16" stroke-linecap="round"/>`)) + check(0, -270, 40, P.green, a - t0), 0.62); });
  g += at(4180, 170, badge("3", a - 8.35));
  const bg = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(53, 160, -800, 7000, 1080, tot), c, 0.15) + layer(skyline(29, -800, 7000, G - 20, 80, 300, "#2a1d66", "#ffb066"), c, 0.5);
  return { g: bg + layer(g, c) };
}

const SHOTS = [s0];
export const c2recapSet = makeSet(SHOTS, V, P);
