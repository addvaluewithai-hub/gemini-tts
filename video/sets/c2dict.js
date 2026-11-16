// Crypto part 2, "the humans' dictionary": two wordless shots (shots.md, scene dict).
//   0 NODE: a laptop holding the book, a magnifier checks a page (✓), a gavel bangs, an empty wallet opens on $0
//   1 HALVING: a coin is cut in two, four calendar pages flip, a countdown board 3 · 2 · 1 with confetti (host right)
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2dict.v.js";
import { P, mix, book, coin, stars, skyline } from "./bank.js";
import { laptop, calPage } from "./props.js";
import { WHO } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);
// a gold word label, ink letters
const label = (word, w) => `${two(rr(-w / 2, -60, w, 120, 60), P.gold, P.goldD, 0, 10)}${text(0, 34, word, 96, P.ink)}`;
const desk = (y) => `<rect x="-800" y="${y}" width="3600" height="40" fill="${P.wood}"/><rect x="-800" y="${y + 40}" width="3600" height="600" fill="${P.woodD}"/>`;

// ---- 0: NODE ----
function s0(a, tot) {
  const D = 900, LX = 760, LK = 1.9, SC = [LX, D - 110 * LK];
  const c = camAt(a, [[0, 1000, 690, 1.35], [5.92, 1040, 670, 1.22]]);
  const rowsIn = [["blue", "pink", "30"], ["teal", "violet", "5"], ["pink", "teal", "12"]].map((r, i) => `<circle cx="-120" cy="${-50 + i * 34}" r="11" fill="${WHO[r[0]][0]}"/><circle cx="-80" cy="${-50 + i * 34}" r="11" fill="${WHO[r[1]][0]}"/>${text(-20, -38 + i * 34, r[2], 32, P.ink)}`).join("");
  const scr = at(0, -110, book(rowsIn + `<path d="M30 -50h90M30 -16h70M30 18h90" stroke="#dccaa0" stroke-width="8" stroke-linecap="round"/>`), 0.62);
  // the magnifier sweeps the page, then a check
  const mx = kf(a, [[2.3, -120], [3.2, 60], [3.9, -40]]), my = kf(a, [[2.3, -150], [3.2, -110], [3.9, -80]]), mOn = seg(a, 2.2, 2.5) * (1 - seg(a, 4.2, 4.5));
  const mag = mOn > 0 ? at(mx, my, `<circle r="58" fill="#cfe9ff" opacity=".25"/><circle r="58" fill="none" stroke="${P.gold}" stroke-width="14"/><path d="M42 42L100 100" stroke="${P.woodD}" stroke-width="22" stroke-linecap="round"/>`, mOn) : "";
  const lap = at(LX, D, rings(0, -110, 230, "#9fe7ff", 0.12) + laptop("#9fe7ff", scr + mag) + (a > 3.9 ? check(150, -230, 34, P.green, a - 3.9) : ""), LK);
  // the gavel and its block
  const bang = a > 4.7 ? Math.exp(-(a - 4.7) * 5) * Math.cos((a - 4.7) * 18) : 1;
  const gav = a > 4.4 ? at(1240, D, `<path d="${rr(-90, -36, 180, 36, 10)}" fill="${P.woodD}"/><g transform="rotate(${(-35 * clamp(bang)).toFixed(1)} 80 -60)">${two(rr(-80, -150, 120, 70, 16), P.wood, P.woodD, 0, 8)}<path d="M40 -115H200" stroke="${P.wood}" stroke-width="22" stroke-linecap="round"/></g>${a > 4.7 && a < 5.2 ? rings(-20, -40, 80 * seg(a, 4.7, 5.0), P.cream, 0.4 * (1 - seg(a, 4.8, 5.2))) : ""}`, 1.5 * pop(a - 4.4)) : "";
  // the empty wallet: opens, a moth flutters out, $0
  const open = ease(seg(a, 5.15, 5.5)), wal = a > 5.0 ? at(1530, D, `${two(rr(-130, -150, 260, 150, 20), "#7a4a2a", "#5a341c", 0, 8)}<g transform="translate(0 -150) scale(1 ${(1 - 1.8 * open).toFixed(3)}) translate(0 150)">${two(rr(-130, -230, 260, 86, 20), "#8a5a34", "#6a4224", 0, 8)}</g>${open > 0.5 ? `<path d="${rr(-100, -150, 200, 20, 6)}" fill="${P.ink}"/>` : ""}${open > 0.6 ? at(30 * Math.sin(tot * 7), -250 - 80 * seg(a, 5.4, 5.9), `<ellipse cx="-14" rx="18" ry="${(10 + 6 * Math.sin(tot * 30)).toFixed(1)}" fill="#cfc2a8"/><ellipse cx="14" rx="18" ry="${(10 + 6 * Math.sin(tot * 30)).toFixed(1)}" fill="#cfc2a8"/>`) : ""}${a > 5.3 ? at(0, -330, text(0, 0, "$0", 120, P.cream), pop(a - 5.3)) : ""}`, 1.3 * pop(a - 5.0)) : "";
  const lab = a > 1.7 ? at(1060, 360, label("NODE", 380), pop(a - 1.7)) : "";
  const g = night(c, tot, 43) + layer(skyline(17, -800, 2800, D - 10, 80, 300, "#2a1d66", "#ffb066"), c, 0.5) + layer(desk(D) + lap + gav + wal + lab, c);
  return { g, out: toScreen(c, 1060, 360), outC: P.gold, outZ: 18 };
}

// ---- 1: HALVING ----
function s1(a, tot) {
  const CX = 820, CY = 560, Rc = 230;
  const c = camAt(a, [[0, 960, 540, 1.08], [6.47, 940, 540, 1.0]]);
  const cut = seg(a, 1.4, 1.7), apart = ease(seg(a, 1.8, 2.6)), away = ease(seg(a, 4.3, 4.8)), ANG = -35;
  const half = (side) => { const dx = side * (130 * apart + 600 * away), dy = 40 * apart, r = side * 12 * apart;
    return `<g transform="translate(${(CX + dx).toFixed(1)} ${(CY + dy).toFixed(1)}) rotate(${r.toFixed(1)})" opacity="${(1 - away).toFixed(2)}"><clipPath id="hc${side > 0 ? "r" : "l"}"><rect x="${side > 0 ? 0 : -400}" y="-400" width="400" height="800" transform="rotate(${ANG})"/></clipPath><g clip-path="url(#hc${side > 0 ? "r" : "l"})">${coin(Rc, "B")}</g></g>`; };
  let g = apart > 0 ? half(-1) + half(1) : at(CX, CY, rings(0, 0, Rc * 1.2, P.gold, 0.18) + coin(Rc, "B"), pop(a + 0.5));
  if (cut > 0 && cut < 1 || (a > 1.7 && a < 2.0)) { const L = 520, ux = Math.sin(-ANG * Math.PI / 180), uy = Math.cos(-ANG * Math.PI / 180);
    g += drawn(`M${CX + ux * L / 2} ${CY - uy * L / 2}L${CX - ux * L / 2} ${CY + uy * L / 2}`, cut, "#ffffff", 14, `opacity="${(1 - seg(a, 1.75, 2.0)).toFixed(2)}"`); }
  g += apart > 0.6 && away < 1 ? at(CX, CY + 330, text(0, 0, "÷ 2", 120, P.cream), pop(a - 2.3) * (1 - away)) : "";
  // four calendar pages flip: every four years
  const yi = Math.min(4, Math.floor(seg(a, 3.3, 4.3) * 5)), yrs = ["2012", "2016", "2020", "2024", "2028"];
  g += a > 3.2 ? at(1420, 300, calPage(yrs[yi], "", 1, 120), 0.8 * pop(a - 3.2) * (1 + 0.06 * Math.exp(-((a - 3.3) % 0.2) * 10))) : "";
  // the countdown board
  if (a > 4.45) { const n = a < 5.0 ? "3" : a < 5.4 ? "2" : "1", tick = a < 5.0 ? a - 4.6 : a < 5.4 ? a - 5.0 : a - 5.4;
    g += at(CX, CY, `${two(rr(-230, -170, 460, 340, 30), "#2c1f63", P.ink, 0, 10)}<path d="${rr(-200, -140, 400, 280, 20)}" fill="#141038"/>${at(0, 0, text(0, 90, n, 260, P.gold), 0.6 + 0.4 * spring(Math.max(0, tick), 10, 18))}`, 1.35 * pop(a - 4.45));
    if (a > 5.55) for (let i = 0; i < 40; i++) { const u = a - 5.55, an = rnd(i) * 6.283, sp = 500 + rnd(i + 3) * 500, x = CX + Math.cos(an) * sp * u, y = CY - 100 + Math.sin(an) * sp * u * 0.7 + 400 * u * u; if (x > 1500 && y > 480) continue;
      g += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="22" height="12" fill="${[P.pink, P.teal, P.gold, P.blue, P.green][i % 5]}" transform="rotate(${(tot * 300 + i * 40) % 360} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; } }
  const lab = a > 0.5 ? at(960, 140, label("HALVING", 520), pop(a - 0.5)) : "";
  return { g: night(c, tot, 47) + layer(g + lab, c), in: toScreen(c, CX, CY), inC: P.gold, inZ: 18 };
}

const SHOTS = [s0, s1];
export const c2dictSet = makeSet(SHOTS, V, P);
