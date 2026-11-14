// "The idea": six shots, one per board beat of the idea scene. The book leaves the bank and every computer on the
// planet keeps a copy of it; they all write the same line, outvote a cheater, and the whole book is public, with long
// numbers where the names were. Built in the bank set's world (same bank, same book with the blue and pink rows).
//   0 the book lifts out of the bank's arch and flies off; the bank goes dark
//   1 the book splits into copies that land on laptops standing on the planet; pull back: laptops all over it
//   2 the blue house pays the pink house: a pulse runs through the network and every copy rolls 100 · 50 to 70 · 80
//   3 one copy writes 700; its neighbours cross it out and it rolls back to 70
//   4 a huge public book under a glass dome: read from row 1, the names turn into long numbers, the houses put on masks
//   5 a coin no ice can freeze, a press in chains, and the rules as code in a glass case lit from every side
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, play, frame } from "./kit.js";
import { P, mix, house, bank, book, rows, LINES, coin, stars, skyline, clouds, dusk } from "./bank.js";
import { laptop, globe, padlock, press, banknote } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(seed, 80, -600, 2600, 1080, tot), c, 0.15);
const roll = (from, to, p) => String(Math.round(lerp(from, to, ease(p))));

// ---- 0: the book leaves the bank ----
function s0(a, tot) {
  const G = 900, BX = 960, rise = ease(seg(a, 1.95, 2.85)), fly = seg(a, 2.6, 3.49);
  const c = camAt(a, [[0, BX, G - 250, 2.3], [1.7, BX, G - 260, 2.1], [2.7, BX, G - 330, 1.25], [3.49, BX + 60, G - 380, 1.1]]);
  const dark = ease(seg(a, 2.75, 3.1)), sign = [0, 1, 2, 3].map((j) => (a < 2.75 + j * 0.06 ? 1 : 0));
  const glowB = 1 + 0.08 * Math.sin(tot * 3) + (a > 1.76 ? 0.3 * Math.exp(-(a - 1.76) * 4) : 0);
  const inner = `${rings(0, -225, 150 * glowB * (1 - dark), P.gold, 0.22)}${two(rr(-34, -130, 68, 90, 6), "#7a55c9", "#5b3aa6", 10, 0)}<path d="${rr(-70, -46, 140, 12, 5)}" fill="#5b3aa6"/>`;
  const bk = at(BX, G, bank({ inside: mix("#3b1d74", P.ink, dark), inner, sign }));
  // the book: up out of the arch, then off over the roofs, glowing as it goes
  const bp = rise < 1 ? [BX, lerp(G - 225, G - 520, rise)] : bez([BX, G - 520], [BX + 300, G - 760], [BX + 520, G - 640], ease(fly)), k = lerp(1, 1.25, rise) * (1 - 0.15 * fly);
  const theBook = at(bp[0], bp[1] + 6 * Math.sin(tot * 3), (rise > 0 ? rings(0, 0, 210, P.gold, 0.18 * rise, 1.3) : "") + book(rows("70", "80")), k, -8 * Math.sin(Math.PI * fly));
  const town = `<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/>` + [[260, P.blue, P.blueD], [1660, P.pink, P.pinkD], [-80, P.teal, P.tealD], [2000, P.violet, P.violetD]].map(([x, col, colD]) => at(x, G, house(col, colD, { lit: [1, 1, 1] }), 1.2)).join("");
  const g = dusk(c, tot, 1500, 700) + layer(skyline(11, -600, 2600, 760, 120, 330, P.far), c, 0.35) + layer(skyline(47, -600, 2600, 820, 80, 240, P.mid, "#ffb066"), c, 0.65) + layer(town + bk + theBook, c);
  return { g, out: toScreen(c, bp[0] - 70, bp[1]), outC: P.cream, outZ: 18 };
}

// ---- 1–3: one planet of laptops, one camera across three beats ----
const GX = 960, GY = 640, R = 380;
const RIM = [-0.84, -0.42, 0, 0.42, 0.84, -1.85, 1.85, -2.35, 2.35, -2.85, 2.85], HOUSE = { blue: -1.33, pink: 1.33 };
const onRim = (th, lift = 0) => [GX + (R + lift) * Math.sin(th), GY - (R + lift) * Math.cos(th)];
const DOTS = Array.from({ length: 44 }, (_, i) => { const rr_ = Math.sqrt(rnd(i * 7 + 1)) * 0.86 * R, an = rnd(i * 7 + 2) * Math.PI * 2; return [GX + rr_ * Math.cos(an), GY + rr_ * Math.sin(an), rnd(i * 7 + 3)]; });
const NB = DOTS.map((d, i) => DOTS.map((e, j) => [j, Math.hypot(d[0] - e[0], d[1] - e[1])]).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 2).map(([j]) => j));
// t: seconds since shot 1 began; T2, T3: when shots 2 and 3 began
function planet(t, c, tot, s) {
  const E = s.ends || [], T2 = E[1] || 5.22, T3 = T2 + (E[2] || 4.57), u2 = t - T2, u3 = t - T3;
  // the copies: the book hangs over the planet, splits, and a copy lands on each of the five laptops on top
  const split = seg(t, 1.1, 2.15), held = 1 - seg(t, 1.9, 2.2);
  let g = "";
  // network lines between the dots, gold where the pulse has passed
  const bx = onRim(HOUSE.blue, 60), front = u2 > 1.15 ? (u2 - 1.15) * 900 : -1, litAt = (x, y) => Math.hypot(x - bx[0], y - bx[1]) < front;
  const dotsOn = (d) => t > 2.6 + d[2] * 1.5;
  let net = "";
  DOTS.forEach((d, i) => NB[i].forEach((j) => { if (j < i || !dotsOn(d) || !dotsOn(DOTS[j])) return; const e = DOTS[j], hot = litAt(d[0], d[1]) && litAt(e[0], e[1]);
    net += `<path d="M${d[0].toFixed(1)} ${d[1].toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}" stroke="${hot ? P.gold : "#9fe7ff"}" stroke-width="${hot ? 3.4 : 2}" opacity="${hot ? 0.9 : 0.45}"/>`; }));
  // a dashed ring around the planet joins the rim laptops
  net += t > 2.4 ? `<circle cx="${GX}" cy="${GY}" r="${R + 70}" fill="none" stroke="${front > 0 ? P.gold : "#9fe7ff"}" stroke-width="3" stroke-dasharray="4 14" opacity="${(0.5 * seg(t, 2.4, 3)).toFixed(2)}"/>` : "";
  let dots = "";
  DOTS.forEach((d, i) => { if (!dotsOn(d)) return; const p = pop(t - 2.6 - d[2] * 1.5), hit = front > 0 && litAt(d[0], d[1]), dist = Math.hypot(d[0] - bx[0], d[1] - bx[1]), ft = front > 0 ? (front - dist) / 900 : -1, flash = ft > 0 ? Math.exp(-ft * 6) : 0;
    dots += at(d[0], d[1], (flash > 0.05 ? rings(0, 0, 18 + 20 * flash, P.gold, 0.4 * flash) : rings(0, 0, 14, hit ? P.gold : "#9fe7ff", 0.2)) + `<path d="${rr(-13, -9, 26, 16, 3)}" fill="${hit ? "#fff3c2" : P.cream}"/><path d="M-16 8h32" stroke="${P.steel}" stroke-width="4" stroke-linecap="round"/>`, p); });
  // the laptops standing round the rim; the five on top carry the copies we can read
  let tops = "";
  RIM.forEach((th, i) => { const top = i < 5, at0 = top ? 1.3 + i * 0.12 : 2.7 + (i - 5) * 0.1; if (t < at0 - 0.4 && !top) return;
    const [x, y] = onRim(th), dist = Math.hypot(x - bx[0], y - bx[1]), got = front > 0 && dist < front, rollP = top ? seg(t, T2 + 2.88 + i * 0.08, T2 + 3.4 + i * 0.08) : 0;
    const cheat = i === 3 && u3 > 0.95, back = i === 3 ? seg(u3, 3.65, 4.05) : 0;
    let bl = top ? (rollP > 0 ? roll(100, 70, rollP) : "100") : "", pk = top ? (rollP > 0 ? roll(50, 80, rollP) : "50") : "", fill = P.ink;
    if (cheat) { const w = seg(u3, 0.95, 1.25); bl = back > 0 ? roll(700, 70, back) : roll(70, 700, w); fill = back > 0.9 ? P.ink : P.red; }
    const flash = got ? Math.exp(-Math.max(0, (front - dist) / 900) * 5) : 0, screen = cheat && back < 1 ? "#ffd6d9" : mix("#9fe7ff", "#fff3c2", flash);
    const landed = top ? seg(t, 1.6 + i * 0.1, 1.95 + i * 0.1) : 1;
    const inner = top && landed >= 1 ? at(0, -110, book(`<circle cx="-128" cy="-40" r="10" fill="${P.blue}"/><circle cx="128" cy="-40" r="10" fill="${P.pink}"/>${at(-62, -38, number(0, 18, bl, bl.length > 2 ? 46 : 52, fill), cheat && back < 1 ? 1 + 0.12 * Math.exp(-(u3 - 1.25) * 6) : 1)}${number(62, -20, pk, 52, P.ink)}${LINES}`), 0.7) : "";
    const k = (top ? 0.42 : 0.3) * (i === 3 ? 1 + 0.25 * seg(u3, 0.7, 1.0) * (1 - seg(u3, 4.0, 4.4)) : 1), sh = cheat && u3 > 1.9 && u3 < 3.6 ? 4 * Math.sin(u3 * 45) : 0;
    tops += at(x + sh, y, (flash > 0.05 ? rings(0, -90, 160 * flash + 60, P.gold, 0.3 * flash) : "") + laptop(screen, inner), k * (top ? 1 : pop(t - at0)), th * 180 / Math.PI); });
  // the houses that pay each other, on the sides of the planet
  const hb = onRim(HOUSE.blue), hp = onRim(HOUSE.pink);
  const houses = at(hb[0], hb[1], house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.7 * pop(u2 - 0.15), HOUSE.blue * 180 / Math.PI) + at(hp[0], hp[1], house(P.pink, P.pinkD, { lit: [1, 1, u2 > 2.5 ? 1 : 0] }), 0.7 * pop(u2 - 0.7), HOUSE.pink * 180 / Math.PI);
  const pulse = front > 0 && front < 1600 ? `<circle cx="${bx[0]}" cy="${bx[1]}" r="${front.toFixed(1)}" fill="none" stroke="${P.gold}" stroke-width="${(10 * (1 - front / 1600)).toFixed(1)}" opacity="${(0.7 * (1 - front / 1600)).toFixed(2)}"/>` : "";
  const coinGo = u2 > 0.4 && u2 < 1.2 ? at(...bez(onRim(HOUSE.blue, 140), [GX - 260, GY - R - 60], [bx[0] + 120, bx[1] - 160], seg(u2, 0.4, 1.1)), coin(40, "30")) : "";
  // the book over it all, splitting into copies that fly down to the top five
  let copies = "";
  const BK = [GX, GY - R - 330];
  if (held > 0) copies += at(BK[0], BK[1] + 6 * Math.sin(tot * 3), rings(0, 0, 200, P.gold, 0.18) + book(rows("100", "50")), 1.0 * held + 0.0001);
  for (let i = 0; i < 5; i++) { const p = seg(t, 1.1 + i * 0.1, 1.6 + i * 0.1 + 0.35); if (p <= 0 || p >= 1) continue; const [x, y] = onRim(RIM[i]), to = [x + 110 * 0.42 * Math.sin(RIM[i]) - 0, y - 110 * 0.42], b = bez(BK, [lerp(BK[0], to[0], 0.5), BK[1] - 60], to, ease(p));
    copies += at(b[0], b[1], book(rows("100", "50")), lerp(0.9, 0.3, ease(p)), RIM[i] * 180 / Math.PI * p); }
  // the cheater outvoted: a red cross from each neighbour, over the cheater's laptop
  let votes = "";
  if (u3 > 1.8 && u3 < 4.2) { const ch = onRim(RIM[3], 60); [0, 1, 2, 4].forEach((j, n) => { const t0 = 1.9 + n * 0.17, [x, y] = onRim(RIM[j], 120), gone = seg(u3, 3.7, 3.95);
    if (u3 < t0) return; const p = ease(seg(u3, t0, t0 + 0.3)), b = bez([x, y - 40], [(x + ch[0]) / 2, Math.min(y, ch[1]) - 160], [ch[0] - 75 + n * 50, ch[1] - 130 - (n % 2) * 36], p);
    votes += drawn(`M${x} ${y - 40}Q${(x + ch[0]) / 2} ${Math.min(y, ch[1]) - 160} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`, 1, P.red, 4, `stroke-dasharray="6 10" opacity="${(0.6 * (1 - gone)).toFixed(2)}"`) + at(b[0], b[1], cross(0, 0, 26, P.red, u3 - t0 - 0.25), 1 - gone); });
    if (u3 > 3.75) votes += rings(ch[0], ch[1] - 60, 200 * spring(u3 - 3.75, 7, 11), P.green, 0.18 * (1 - seg(u3, 4.1, 4.6))); }
  g += at(GX, GY, globe(R, tot * 0.01, { night: 0.35 }), 1) + net + dots + houses + tops + pulse + coinGo + copies + votes;
  return night(c, tot, 11) + layer(g, c);
}
function s1(a, tot, s) { const c = camAt(a, [[0, GX, GY - R - 215, 1.9], [1.2, GX, GY - R - 210, 1.9], [2.2, GX, GY - R - 60, 2.4], [2.65, GX, GY - R - 55, 2.35], [4.2, GX, GY - 30, 0.95], [5.22, GX, GY - 40, 0.92]]);
  return { g: planet(a, c, tot, s), in: [960, 540], inC: P.cream, inZ: 18 }; }
function s2(a, tot, s) { const T2 = (s.ends || [])[1] || 5.22, c = camAt(a, [[0, GX, GY - 40, 0.92], [2.55, GX, GY - 50, 0.95], [3.2, GX + 40, GY - R - 55, 2.3], [4.57, GX + 50, GY - R - 55, 2.35]]); return { g: planet(T2 + a, c, tot, s) }; }
function s3(a, tot, s) { const E = s.ends || [], T3 = (E[1] || 5.22) + (E[2] || 4.57), c = camAt(a, [[0, GX + 50, GY - R - 55, 2.35], [0.9, GX + 120, GY - R - 50, 2.6], [1.8, GX + 90, GY - R - 70, 2.1], [4.6, GX + 90, GY - R - 72, 2.05]]);
  const ch = onRim(RIM[3]); return { g: planet(T3 + a, c, tot, s), out: toScreen(c, ch[0] + 20, ch[1] - 50), outC: P.cream, outZ: 20 }; }

// ---- 4: the book is public: anyone reads it from row 1; names are long numbers; a masked ball with invoices ----
const ADDR = ["1A1zP1eP5QGe", "3J98t1WpEZ73", "bc1qar0srrr7", "1BvBMSEYstWe", "3FZbgi29cpjq", "bc1qxy2kgdyg"], AMT = ["50", "10", "70", "80", "25", "4"];
const HOUSES4 = [[180, 1.0, P.teal, P.tealD], [470, 1.15, P.blue, P.blueD], [1400, 1.15, P.pink, P.pinkD], [1230, 0.8, P.violet, P.violetD], [690, 0.8, P.gold, P.goldD]];
function s4(a, tot) {
  const G = 940, BK = [960, 520], KB = 1.7;
  const c = camAt(a, [[0, 960, 470, 2.4], [0.9, 960, 470, 2.3], [1.4, 920, 410, 2.9], [3.0, 920, 640, 2.9], [3.4, 920, 560, 2.5], [5.9, 920, 560, 2.5], [7.0, 960, 560, 1.0], [11.06, 960, 560, 1.04]]);
  // the page: six rows, a coloured house where a name would be, then the long number takes its place
  let page = "";
  const scan = kf(a, [[1.4, -70], [2.9, 80]], (p) => p);
  ADDR.forEach((ad, r) => { const y = -66 + r * 27, flip = seg(a, 3.6 + r * 0.22, 3.85 + r * 0.22), col = [P.blue, P.pink, P.teal, P.violet, P.gold, P.red][r];
    const icon = flip < 0.5 ? at(-132, y - 6, `<path d="M-8 6V-2L0 -9L8 -2V6Z" fill="${col}"/>`, [Math.cos(Math.PI * flip), 1]) : "";
    const addr = flip >= 0.5 ? at(-142, y, `<text x="0" y="0" font-family="Anton" font-size="17" fill="${P.ink}">${ad.slice(0, Math.round(lerp(0, 12, seg(flip, 0.5, 1))))}…</text>`, [1, 1]) : `<path d="M-118 ${y - 6}h${60 + r * 7 % 30}" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/>`;
    const lit = a > 1.4 && a < 3.2 && Math.abs(scan - y) < 14 ? `<path d="${rr(-148, y - 20, 296, 26, 6)}" fill="${P.gold}" opacity=".3"/>` : "";
    page += lit + icon + addr + `<path d="M24 ${y - 6}h70" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/>` + text(124, y + 2, AMT[r], 22, P.ink) + (r === 0 ? text(-160, y + 2, "1", 14, "#a58f5e") : ""); });
  const big = at(BK[0], BK[1], rings(0, 0, 250, P.gold, 0.14 + 0.06 * Math.sin(tot * 2), 1.3) + book(page), KB);
  // the lectern and the glass dome, lit from every side
  const lit = ease(seg(a, 0.45, 0.9)), dome = `<path d="M${BK[0] - 330} ${G - 40}V${BK[1] - 60}A330 330 0 0 1 ${BK[0] + 330} ${BK[1] - 60}V${G - 40}" fill="#cfe9ff" opacity=".1" stroke="#cfe9ff" stroke-width="8"/><path d="M${BK[0] - 250} ${BK[1] - 200}Q${BK[0] - 200} ${BK[1] - 300} ${BK[0] - 100} ${BK[1] - 340}" stroke="#fff" stroke-width="10" fill="none" opacity=".3" stroke-linecap="round"/>`;
  const rays = lit > 0 ? [-2.6, -2.1, -1.0, -0.5, 0.5, 1.0, 2.1, 2.6].map((an, i) => `<path d="M${BK[0]} ${BK[1]}L${(BK[0] + Math.cos(an - Math.PI / 2) * 1400 - 60).toFixed(0)} ${(BK[1] + Math.sin(an - Math.PI / 2) * 1400).toFixed(0)}L${(BK[0] + Math.cos(an - Math.PI / 2) * 1400 + 60).toFixed(0)} ${(BK[1] + Math.sin(an - Math.PI / 2) * 1400).toFixed(0)}Z" fill="#ffd98a" opacity="${(0.07 * lit * (1 + 0.2 * Math.sin(tot * 2 + i))).toFixed(3)}"/>`).join("") : "";
  const stand = `${two(rr(BK[0] - 70, BK[1] + 160, 140, G - BK[1] - 200, 8), "#7a55c9", "#5b3aa6", 12, 0)}<path d="${rr(BK[0] - 200, G - 50, 400, 50, 10)}" fill="#5b3aa6"/>`;
  // the town square: houses that look at the book, then wear masks and pin up a bill
  let hs = "";
  HOUSES4.forEach(([x, k, col, colD], i) => { const back = k < 1, y = back ? G - 70 : G, look = a > 6.3 ? 1 : 0, mask = seg(a, 9.3 + i * 0.12, 9.6 + i * 0.12), bill = a - 9.9 - i * 0.1, q = a - 7.9 - i * 0.12;
    const m = mask > 0 ? `<g transform="translate(0 ${(-115 - 300 * (1 - easeOut(mask))).toFixed(1)})"><path d="M-130 -14Q-120 -50 -60 -40Q0 -30 0 -10Q0 -30 60 -40Q120 -50 130 -14Q120 34 60 30Q16 26 0 6Q-16 26 -60 30Q-120 34 -130 -14Z" fill="${P.ink}"/><path d="M-130 -14Q-120 -50 -60 -40Q0 -30 0 -10Q0 -30 60 -40Q120 -50 130 -14" fill="none" stroke="${P.gold}" stroke-width="7"/>${[-63, 63].map((ex) => `<ellipse cx="${ex}" cy="-6" rx="26" ry="18" fill="${P.win}"/>`).join("")}<path d="M130 -14l46 -30M-130 -14l-46 -30" stroke="${P.pink}" stroke-width="8" stroke-linecap="round"/></g>` : "";
    const pin = bill > 0 ? at(36, -60, `<path d="${rr(-24, -34, 48, 64, 4)}" fill="#fff"/><path d="M-14 -18h28M-14 -6h20M-14 6h28" stroke="#c9b48a" stroke-width="5"/>${text(0, 26, "$", 16, P.redD)}<circle cy="-34" r="6" fill="${P.red}"/>`, pop(bill), -6) : "";
    const qm = q > 0 && q < 99 ? at(0, -380, text(0, 0, "?", 110, P.cream), pop(q) * (1 - 0.06 * Math.sin(tot * 3 + i))) : "";
    hs += at(x, y, house(col, colD, { lit: [1, 1, 1] }) + m + pin + qm, k * (back ? 0.9 : 1), (look ? (x < BK[0] ? 3 : -3) * ease(seg(a, 6.3, 6.8)) : 0)); });
  const ground = `<rect x="-800" y="${G}" width="3600" height="600" fill="#1b2054"/><ellipse cx="${BK[0]}" cy="${G + 20}" rx="640" ry="70" fill="#2c366f"/>`;
  const g = night(c, tot, 19) + layer(skyline(83, -600, 2600, G - 40, 140, 320, "#221a5c", "#ffb066"), c, 0.5) + layer(rays + ground + hs + stand + big + dome, c);
  return { g, in: toScreen(c, BK[0], BK[1]), inC: P.cream, inZ: 18 };
}

// ---- 5: nobody can freeze it, nobody can print more: the rules are code, in front of everyone ----
function s5(a, tot) {
  const G = 900, CX = 640, PX = 1560, CASE = [1100, G];
  const c = camAt(a, [[0, 760, 560, 1.35], [2.2, 760, 560, 1.4], [2.9, 1420, 560, 1.35], [4.7, 1440, 560, 1.38], [5.4, 1100, 530, 1.0], [7.94, 1100, 520, 1.03]]);
  // the coin on its pedestal; an ice beam hits it and breaks into mist, the coin keeps turning
  const beam = seg(a, 1.0, 1.4) * (1 - seg(a, 2.0, 2.3)), fizz = seg(a, 1.5, 2.2), spinC = Math.cos(tot * 2.2);
  const ice = beam > 0 ? `<path d="M${CX - 640} 120L${CX - 30} ${G - 330}" stroke="#bfe6ff" stroke-width="${(26 * beam).toFixed(1)}" stroke-linecap="round" opacity=".85"/><path d="M${CX - 640} 120L${CX - 30} ${G - 330}" stroke="#fff" stroke-width="${(8 * beam).toFixed(1)}" stroke-linecap="round"/>` : "";
  const mist = fizz > 0 && fizz < 1 ? Array.from({ length: 9 }, (_, i) => { const an = i * 0.7, d = 40 + 160 * fizz; return `<circle cx="${(CX + Math.cos(an) * d).toFixed(1)}" cy="${(G - 300 + Math.sin(an) * d * 0.6).toFixed(1)}" r="${(18 * (1 - fizz) + 6).toFixed(1)}" fill="#e8f6ff" opacity="${(0.8 * (1 - fizz)).toFixed(2)}"/>`; }).join("") : "";
  const gun = at(CX - 660, 110, `${two(rr(-60, -40, 140, 80, 18), "#7fd0ff", P.blueD, 8, 6)}<path d="${rr(70, -16, 60, 32, 10)}" fill="${P.steel}"/>`, pop(a - 0.6), 30);
  const coinA = at(CX, G - 300, rings(0, 0, 170, P.gold, 0.16 + (fizz > 0 && fizz < 1 ? 0.15 : 0)) + `<g transform="scale(${Math.max(0.15, Math.abs(spinC)).toFixed(3)} 1)">${coin(120, "B")}</g>`) + at(CX, G, `${two(rr(-150, -60, 300, 60, 10), P.violet, P.violetD, 0, 10)}${two(rr(-110, -150, 220, 96, 10), "#7a55c9", P.violet, 0, 8)}`);
  // the press tries to stamp more coins and jams in its chain
  const tryP = a > 2.64 && a < 4.6 ? Math.min(0.55, Math.abs(Math.sin((a - 2.64) * 5))) : 0, jam = a > 3.4 ? 5 * Math.sin(a * 60) * Math.exp(-(a - 3.4) * 2) : 0;
  const chain = Array.from({ length: 13 }, (_, i) => `<ellipse cx="${-250 + i * 42}" cy="${-260 + 18 * Math.sin(i * 0.9)}" rx="26" ry="14" fill="none" stroke="${P.steelD}" stroke-width="9" transform="rotate(${i % 2 ? 20 : -20} ${-250 + i * 42} ${-260 + 18 * Math.sin(i * 0.9)})"/>`).join("");
  const pr = at(PX + jam, G, press(tryP, { lamp: a > 3.4 ? 0 : 3 }) + (a > 2.2 ? chain + at(0, -250, padlock(1.2, 0), pop(a - 2.9)) : ""), 1.1);
  const sparks = a > 3.4 && a < 4.4 ? [0, 1, 2, 3].map((i) => { const u = ((a - 3.4) * 2 + i / 4) % 1; return `<circle cx="${PX + (i - 1.5) * 90 + 60 * u}" cy="${G - 360 - 100 * u}" r="${8 * (1 - u)}" fill="${P.gold}"/>`; }).join("") : "";
  // the rules: a glass case rises out of the ground with the code inside, lit from all sides
  const up = ease(seg(a, 5.0, 5.8)), shine = ease(seg(a, 6.6, 7.2)), cy = CASE[1] + (1 - up) * 700;
  const code = Array.from({ length: 7 }, (_, r) => { const ind = [0, 1, 2, 2, 1, 1, 0][r], w = [190, 230, 160, 200, 120, 210, 40][r], cols = [P.pink, P.teal, P.gold, P.blue, P.green, P.violet, P.pink];
    return `${r === 0 ? text(-190, -380 + r * 52 + 18, "{", 48, P.gold, { anchor: "start" }) : ""}${r === 6 ? text(-190, -380 + r * 52 + 18, "}", 48, P.gold, { anchor: "start" }) : `<path d="${rr(-150 + ind * 34, -380 + r * 52 - 8, w * seg(a, 5.6 + r * 0.08, 5.9 + r * 0.08), 18, 9)}" fill="${cols[r]}"/>`}`; }).join("");
  const glass = at(CASE[0], cy, `${shine > 0 ? [0, 1, 2, 3, 4, 5].map((i) => { const an = -Math.PI / 2 + (i - 2.5) * 0.5; return `<path d="M0 -230L${(Math.cos(an) * 1100 - 70).toFixed(0)} ${(-230 + Math.sin(an) * 1100).toFixed(0)}L${(Math.cos(an) * 1100 + 70).toFixed(0)} ${(-230 + Math.sin(an) * 1100).toFixed(0)}Z" fill="#ffd98a" opacity="${(0.07 * shine).toFixed(3)}"/>`; }).join("") + rings(0, -230, 330, P.gold, 0.12 * shine) : ""}
    <path d="${rr(-240, -470, 480, 430, 20)}" fill="#0e1240"/>${code}<path d="${rr(-260, -490, 520, 470, 24)}" fill="#cfe9ff" opacity=".12" stroke="#cfe9ff" stroke-width="10"/><path d="M-200 -440L-120 -440L-220 -120Z" fill="#fff" opacity=".12"/>${two(rr(-300, -40, 600, 40, 10), P.violet, P.violetD, 0, 10)}`);
  const ground = `<rect x="-800" y="${G}" width="3600" height="600" fill="#2c1a66"/>`;
  const g = night(c, tot, 23) + layer(skyline(61, -600, 2800, G - 60, 100, 280, "#3a2470"), c, 0.5) + layer(ground + ice + gun + coinA + mist + pr + sparks + glass, c);
  return { g };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const ideaSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
