// Crypto part 2, "intro": two shots with nothing to read.
//   0 a ledger with no guard that guards itself: the book on a lectern in the night square, the guard booth beside it
//     empty (a cap on its hook, the lamp goes out); the book's pages fly out and lock round it as a ring of gold-linked pages
//   1 last report in one picture: the bank with the book in its arch; the book lifts out and its copies land on laptops
//     all round the night planet
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2intro.v.js";
import { P, mix, bank, book, rows, stars, skyline, house } from "./bank.js";
import { laptop, globe } from "./props.js";
import { page, link, booth } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -600, 2600, 1080, tot), c, 0.15);

// ---- 0: no guard, and it guards itself ----
const RING = 6, RX = 430, RY = 250;
function s0(a, tot) {
  const G = 930, BX = 1060, BY = 520;
  const c = camAt(a, [[0, 820, 560, 1.12], [1.9, 860, 560, 1.1], [2.9, 1040, 540, 1.0], [4.08, 1060, 530, 1.04]]);
  // the empty booth: lamp on, then it flickers out on "no guard"
  const lamp = a < 1.5 ? 1 : a < 2.2 ? (Math.sin((a - 1.5) * 40) > 0 ? 1 : 0.2) * (1 - seg(a, 1.9, 2.2)) : 0;
  const bth = at(420, G, booth({ cap: 1, lamp }), 1.25);
  const lect = `${two(rr(BX - 60, BY + 150, 120, G - BY - 190, 8), "#7a55c9", "#5b3aa6", 12, 0)}<path d="${rr(BX - 200, G - 50, 400, 50, 10)}" fill="#5b3aa6"/><path d="M${BX - 220} ${BY + 150}h440l-40 -40h-360Z" fill="#5b3aa6"/>`;
  const bk = at(BX, BY, rings(0, 0, 230, P.gold, 0.12 + 0.05 * Math.sin(tot * 2)) + book(rows("70", "80")), 1.3);
  // the pages: out of the book from 2.9, each to its place on a ring; the links close from 3.4; a gold ring of light at 3.8
  let pages = "", links = "";
  const pos = Array.from({ length: RING }, (_, i) => { const th = -Math.PI / 2 + (i + 0.5) * Math.PI * 2 / RING, p = ease(seg(a, 2.85 + i * 0.07, 3.45 + i * 0.07)), fx = BX + Math.cos(th) * RX, fy = BY + 20 + Math.sin(th) * RY;
    return [lerp(BX, fx, p) + Math.sin(Math.PI * p) * 60 * Math.cos(th + 1), lerp(BY - 40, fy, p) - Math.sin(Math.PI * p) * 90, p]; });
  pos.forEach(([x, y, p], i) => { if (p <= 0) return; const j = (i + 1) % RING, q = pos[j], lp = seg(a, 3.45 + i * 0.06, 3.7 + i * 0.06);
    if (q[2] >= 1 && p >= 1) links += link(x, y, q[0], q[1], P.gold, lp, 0.55); });
  pos.forEach(([x, y, p], i) => { if (p <= 0) return; pages += at(x, y + (p >= 1 ? 5 * Math.sin(tot * 2 + i) : 0), page({ rows: [["blue", "pink", ""], ["teal", "violet", ""], ["pink", "teal", ""]], seal: i, block: 0 }), lerp(0.2, 0.42, p), lerp(0, (i % 2 ? 6 : -6), p)); });
  const shut = seg(a, 3.75, 4.0), halo = shut > 0 ? `<ellipse cx="${BX}" cy="${BY + 20}" rx="${RX + 40}" ry="${RY + 40}" fill="none" stroke="${P.gold}" stroke-width="${(10 * (1 - 0.6 * shut)).toFixed(1)}" opacity="${(0.7 * (1 - seg(a, 4.0, 4.6) * 0.5)).toFixed(2)}"/>` + rings(BX, BY, 300 * spring(a - 3.75, 7, 11), P.gold, 0.12 * (1 - shut * 0.5)) : "";
  const ground = `<rect x="-800" y="${G}" width="3600" height="2400" fill="#1b2054"/><ellipse cx="${BX}" cy="${G + 20}" rx="620" ry="60" fill="#2c366f"/>`;
  const town = [[-60, P.teal, P.tealD], [1720, P.pink, P.pinkD], [2050, P.violet, P.violetD]].map(([x, col, colD]) => at(x, G - 40, house(col, colD, { lit: [1, 0, 1] }), 0.85)).join("");
  const g = night(c, tot, 13) + layer(skyline(83, -600, 2600, G - 40, 140, 320, "#221a5c", "#ffb066"), c, 0.5) + layer(ground + town + bth + lect + links + halo + bk + pages, c);
  return { g, out: toScreen(c, BX, BY), outC: P.cream, outZ: 20 };
}

// ---- 1: last report: the book leaves the bank and is copied over the planet ----
const GX = 1380, GY = 650, R = 330, RIM = [-1.1, -0.66, -0.22, 0.22, 0.66, 1.1, -1.6, 1.6, -2.1, 2.1];
const onRim = (th, lift = 0) => [GX + (R + lift) * Math.sin(th), GY - (R + lift) * Math.cos(th)];
function s1(a, tot) {
  const G = 900, BX = 470;
  const c = camAt(a, [[0, 760, 570, 1.08], [1.5, 780, 570, 1.06], [2.6, 960, 560, 0.93], [4.45, 970, 560, 0.94]]);
  const rise = ease(seg(a, 1.55, 2.05)), fly = seg(a, 2.0, 2.75), dark = ease(seg(a, 2.05, 2.4));
  const inner = `${rings(0, -225, 150 * (1 - dark), P.gold, 0.22)}`;
  const bk = at(BX, G, bank({ night: 1, inside: mix("#3b1d74", P.ink, dark), inner, sign: [1, 1, 1, 1].map((v, j) => (a < 2.1 + j * 0.05 ? 1 : 0)) }), 0.8);
  const BK1 = [GX, GY - R - 170];
  const bp = rise < 1 ? [BX, lerp(G - 180, G - 420, rise)] : bez([BX, G - 420], [900, 120], BK1, ease(fly));
  const held = 1 - seg(a, 2.9, 3.1);
  let theBook = held > 0 ? at(bp[0], bp[1] + 5 * Math.sin(tot * 3), rings(0, 0, 190, P.gold, 0.18 * rise) + book(rows("70", "80")), lerp(0.62, 0.8, rise) * held + 0.0001, -8 * Math.sin(Math.PI * fly)) : "";
  // copies: from 2.7 the book splits; each copy flies down to a laptop on the rim
  let copies = "", tops = "";
  RIM.forEach((th, i) => { const t0 = 2.7 + i * 0.12, p = seg(a, t0, t0 + 0.45), [x, y] = onRim(th), landed = p >= 1;
    if (p > 0 && p < 1) { const b = bez(BK1, [lerp(BK1[0], x, 0.5), BK1[1] - 20], [x, y - 60], ease(p)); copies += at(b[0], b[1], book(rows("70", "80")), lerp(0.7, 0.25, ease(p)), th * 57.3 * p); }
    const lit = landed ? Math.exp(-(a - t0 - 0.45) * 4) : 0;
    tops += at(x, y, (lit > 0.05 ? rings(0, -90, 120 + 60 * lit, P.gold, 0.35 * lit) : "") + laptop(landed ? mix("#9fe7ff", "#fff3c2", lit) : "#4a5a9a", landed ? at(0, -110, book(rows("70", "80")), 0.66) : ""), 0.36 * pop(a - t0 - 0.3), th * 57.3); });
  // dots on the planet light up last: thousands more
  const dots = Array.from({ length: 22 }, (_, i) => { const rr_ = Math.sqrt(rnd(i * 5 + 1)) * 0.85 * R, an = rnd(i * 5 + 2) * 6.283, on = a > 3.2 + rnd(i * 5 + 3) * 0.8; return on ? `<circle cx="${(GX + rr_ * Math.cos(an)).toFixed(1)}" cy="${(GY + rr_ * Math.sin(an)).toFixed(1)}" r="9" fill="${P.gold}"/>` + rings(GX + rr_ * Math.cos(an), GY + rr_ * Math.sin(an), 16, P.gold, 0.25) : ""; }).join("");
  const ground = `<rect x="-800" y="${G}" width="1900" height="2400" fill="#1b2054"/>`;
  const g = night(c, tot, 29) + layer(skyline(41, -600, 1000, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.5) + layer(ground + bk + at(GX, GY, globe(R, tot * 0.01, { night: 0.35 })) + dots + tops + copies + theBook, c);
  return { g };
}

const SHOTS = [s0, s1];
export const c2introSet = makeSet(SHOTS, V, P);
