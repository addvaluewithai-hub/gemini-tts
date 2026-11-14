// "The middle man": eight shots, one per beat of the third-party scene. The bank, its book and the blue and pink
// houses are the ones from the bank set.
//   0 a coin sets off straight from the blue house; the bank rises across the road and the coin has to go in at its door
//   1 inside the arch: the book is checked, row by row, ✓   2 the coin rolls on to the pink house; a slice flies back: the fee
//   3 what the keeper can do: snip a slice, keep you waiting, freeze it, sink with it   4 an island at dawn: the town wakes, the bank is shut
//   5 a tower of coins over a line; a scoop takes about half of what is above it, and the bank mends itself   6 calm: money behind bars while the years go by
//   7 an envelope goes round the planet in a second, a coin on a snail takes three days; both turn out to be numbers
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, play, frame } from "./kit.js";
import { P, mix, fmt, house, bank, book, rows, coin, stars, skyline, clouds, dusk } from "./bank.js";
import { calPage, calFlip, banknote, padlock, globe } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const bump = (a, t0, amt = 0.14) => (a > t0 ? 1 + amt * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 14) : 1);
// a coin with a wedge cut out of it (`cut` wedges of 60 degrees, from the upper right)
const cutCoin = (r, cut = 0, id = "cc") => { if (!cut) return coin(r); const a0 = -Math.PI / 2 + cut * Math.PI / 3, R = r * 1.3;
  return `<clipPath id="${id}"><path d="M0 0L${(R * Math.cos(a0)).toFixed(1)} ${(R * Math.sin(a0)).toFixed(1)}A${R} ${R} 0 ${cut <= 3 ? 1 : 0} 1 0 ${-R}Z"/></clipPath><g clip-path="url(#${id})">${coin(r)}</g>`; };
const wedge = (r) => `<path d="M0 0L0 ${-r}A${r} ${r} 0 0 1 ${(r * Math.cos(-Math.PI / 6)).toFixed(1)} ${(r * Math.sin(-Math.PI / 6)).toFixed(1)}Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width="${r * 0.08}"/>`;
const cracks = (p) => drawn("M-120 -440L-90 -360L-140 -300L-100 -230L-130 -150", p, P.ink, 9, 'stroke-linejoin="round"') + drawn("M200 -440L230 -380L190 -320L220 -250", p - 0.2, P.ink, 9, 'stroke-linejoin="round"') + drawn("M-300 -200L-260 -160L-290 -110", p - 0.35, P.ink, 7);
const town = (c, tot, G) => dusk(c, tot, 960, 640) + layer(skyline(11, -400, 2400, G - 160, 100, 300, P.far), c, 0.35) + layer(skyline(47, -400, 2500, G - 70, 60, 210, P.mid, "#ffb066"), c, 0.65);
const street = (G) => `<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/><rect x="-900" y="${G + 60}" width="3800" height="120" fill="${P.road}"/>`;

// ---- 0: from one house to the other, straight; then a bank rises across the road, and the coin must go in ----
const G0 = 860, HB = 430, HP = 1490, HK = 1.45, BK = 0.7, DOOR = G0 - 70, STOP = 640;
function m0(a, tot) {
  const c = camAt(a, [[0, 960, 640, 1.08], [3.0, 960, 640, 1.1], [5.22, 960, 640, 1.13]]);
  const rise = a < 2.95 ? 0 : spring(a - 2.95, 7, 11), by = G0 + (1 - rise) * 560;
  const road = drawn(`M${HB + 90} ${DOOR + 40}H${HP - 90}`, seg(a, 0.3, 1.2), P.gold, 8, 'stroke-dasharray="0.012 0.02" opacity=".8"');
  // the coin: out of the door, straight on; it stops short of the bank that came up in its way, then goes in at its door
  let cx, cy = DOOR, k = 1, rot = 0;
  if (a < 1.5) { cx = HB + 70; k = pop(a - 0.6); }
  else if (a < 3.0) { const p = easeOut(seg(a, 1.5, 2.95)); cx = lerp(HB + 70, STOP, p); rot = p * 360; }
  else if (a < 3.6) { cx = STOP - 24 * Math.exp(-(a - 3.0) * 6) * Math.sin((a - 3.0) * 14); rot = 360; }
  else { const p = ease(seg(a, 3.6, 4.6)), b = bez([STOP, DOOR], [820, DOOR - 90], [960, G0 - 80], p); cx = b[0]; cy = b[1]; rot = 360 + p * 300; k = 1 - 0.25 * p; }
  const inside = a > 4.6 ? rings(960, G0 - 120 * BK - 60, 90 * spring(a - 4.6, 7, 11), P.gold, 0.25) : "";
  const theBank = `<clipPath id="m0g"><rect x="0" y="-400" width="1920" height="${G0 + 400}"/></clipPath><g clip-path="url(#m0g)">${at(960, by, bank({ inside: "#3b1d74", sign: rise > 0.8 ? [1, 1, 1, 1] : [0, 0, 0, 0], inner: inside ? "" : "" }), BK)}</g>`;
  const main = street(G0) + road + at(HB, G0, house(P.blue, P.blueD, { lit: [1, 1, 1] }), HK) + at(HP, G0, house(P.pink, P.pinkD, { lit: [1, 1, a > 4.6 ? 1 : 0] }), HK)
    + (a > 2.95 && a < 3.6 ? rings(960, G0 - 200, 300 * spring(a - 2.95, 6, 10), P.gold, 0.12 * (1 - seg(a, 3.3, 3.6))) : "") + theBank + inside
    + (a < 4.75 ? at(cx, cy - 58 * k, coin(58), k * (a > 4.5 ? 1 - seg(a, 4.5, 4.75) : 1), rot) : "");
  return { g: town(c, tot, G0) + layer(main, c), out: toScreen(c, 960, G0 - 150 * BK), outC: P.ink, outZ: 20 };
}
// ---- 1: inside the arch: the book is open, the blue row is checked, ✓ ----
function m1(a, tot) {
  const c = camAt(a, [[0, 960, 545, 1.0], [1.89, 960, 545, 1.04]]);
  const scan = seg(a, 0.8, 1.3), coinIn = easeOut(seg(a, 0, 0.45));
  const lit = scan > 0 ? `<path d="${rr(-150, -76, 150 * scan, 66, 10)}" fill="${P.gold}" opacity=".35"/>` : "";
  const lamp = scan > 0 && scan < 1 ? at(-150 + 150 * scan, -110, `<path d="M0 0L-26 -60h52Z" fill="#fff3c2" opacity=".5"/><circle r="10" fill="#fff3c2"/>`) : "";
  const inner = `${rings(0, -225, 150 * (1 + 0.03 * Math.sin(tot * 2)), P.gold, 0.2, 1.3)}${two(rr(-34, -130, 68, 90, 6), "#7a55c9", "#5b3aa6", 10, 0)}<path d="${rr(-70, -46, 140, 12, 5)}" fill="#5b3aa6"/>${at(0, -225, book(lit + rows("70", "80") + lamp), 1.08)}
    ${at(lerp(-260, -110, coinIn), -78, coin(34), 1, coinIn * 360)}${check(-62, -330, 34, P.green, a - 1.37)}`;
  const main = street(G0) + at(960, G0, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner }));
  return { g: town(c, tot, G0) + layer(main, c), in: toScreen(c, 960, G0 - 150), inC: P.ink, inZ: 20, out: toScreen(c, 960 - 110, G0 - 78), outC: P.gold, outZ: 22 };
}
// ---- 2: on to the pink house; there a slice comes off and flies back to the bank: the fee ----
function m2(a, tot) {
  const c = camAt(a, [[0, 960, 640, 1.13], [1.79, 960, 640, 1.14]]);
  const p = ease(seg(a, 0.0, 0.62)), cx = lerp(1010, HP - 80, p), cy = DOOR - 30 * Math.sin(Math.PI * p), cut = a > 0.96 ? 1 : 0;
  const fly = seg(a, 0.96, 1.45), w = bez([HP - 60, DOOR - 70], [1250, DOOR - 380], [960, G0 - 110], ease(fly));
  const main = street(G0) + at(HB, G0, house(P.blue, P.blueD), HK) + at(HP, G0, house(P.pink, P.pinkD, { lit: [1, 1, a > 0.5 ? 1 : 0] }), [HK, HK * bump(a, 0.55, 0.06)])
    + (a > 0.5 ? rings(HP, G0 - 220, 260 * spring(a - 0.5, 7, 11), P.win, 0.14, 1.3) : "") + at(960, G0, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1] }), BK)
    + (fly > 0 && fly < 1 ? at(w[0], w[1], wedge(58), 1, fly * 400) : "") + (a > 1.45 ? at(960, G0 - 110, rings(0, 0, 50, P.gold, 0.3 * (1 - seg(a, 1.45, 1.79))) + wedge(58), bump(a, 1.45, 0.3)) : "")
    + at(cx, cy - 58, cutCoin(58, cut, "m2c"), 1, p * 300) + (a > 0.96 ? at(cx, cy - 130, `<path d="${rr(-56, -30, 112, 60, 30)}" fill="${P.red}"/>${text(0, 17, "−", 50, "#fff")}`, 1.4 * pop(a - 1.0) * (1 - seg(a, 1.6, 1.79))) : "");
  return { g: town(c, tot, G0) + layer(main, c), in: toScreen(c, 1010, DOOR - 46), inC: P.gold, inZ: 22 };
}
// ---- 3: the keeper of the book can take a fee, keep it waiting, freeze it, or go under with it ----
function m3(a, tot) {
  const G = 900, BX = 760, c = camAt(a, [[0, BX + 40, 560, 1.0], [3.9, BX + 40, 560, 1.04], [4.84, BX + 40, 570, 1.0]]);
  const sink = easeIn(seg(a, 4.15, 4.84)) * 760, tilt = 4 * seg(a, 4.15, 4.84), shake = a > 3.95 && a < 4.2 ? 6 * Math.sin(a * 70) : 0;
  const cX = BX, cY = G - 104;
  // fee: scissors close on the coin and a slice drops into the bank
  const sc = seg(a, 0.6, 1.13), sOpen = a < 1.13 ? 22 * (1 - seg(a, 0.95, 1.13)) : 22 * seg(a, 1.13, 1.3), sPos = bez([1340, 420], [1150, 450], [cX + 60, cY - 130], easeOut(sc)), sGone = seg(a, 1.35, 1.6);
  const blade = (s) => `<g transform="rotate(${s})"><path d="M0 0L170 -14L170 10Z" fill="${P.steel}"/><circle cx="-46" cy="${s > 0 ? 18 : -18}" r="26" fill="none" stroke="${P.red}" stroke-width="12"/></g>`;
  const scissors = a > 0.6 && sGone < 1 ? at(sPos[0] + 400 * easeIn(sGone), sPos[1] - 300 * easeIn(sGone), blade(sOpen) + blade(-sOpen) + `<circle r="9" fill="${P.ink}"/>`, 1.1, 200) : "";
  const fall = seg(a, 1.15, 1.6), slice = a > 1.13 && fall < 1 ? at(lerp(cX + 20, BX, fall), lerp(cY - 30, G - 260, ease(fall)) + 80 * Math.sin(Math.PI * fall) * 0, wedge(100), 1 - 0.5 * fall, 160 * fall) : "";
  // delay: the calendar goes on and on while the coin waits
  const cal = a > 1.6 ? at(BX + 80, G - 320, calPage(String(Math.min(3, 1 + Math.floor(seg(a, 1.9, 2.5) * 2.99))), "", 0.9, 150) + [0, 1].map((i) => calFlip(String(i + 1), "", seg(a, 1.9 + i * 0.3, 2.2 + i * 0.3), 150)).join(""), 0.5 * pop(a - 1.6) * (1 - seg(a, 4.2, 4.5))) : "";
  const tap = a > 1.72 && a < 2.7 ? -10 * Math.abs(Math.sin((a - 1.72) * 9)) : 0;
  // freeze: a block of ice grows up round it
  const ice = seg(a, 2.78, 3.1), iceG = ice > 0 ? `<path d="${rr(-104, 104 - 208 * ease(ice), 208, Math.max(1, 208 * ease(ice)), 22)}" fill="#bfeaff" opacity=".55" stroke="#e8f8ff" stroke-width="6"/>${ice >= 1 ? `<path d="M-70 -70l40 0M-70 -50l20 0" stroke="#fff" stroke-width="8" stroke-linecap="round"/>${[0, 1, 2].map((i) => at(-80 + i * 80, -120 - 10 * Math.sin(tot * 3 + i), `<path d="M0 -14V14M-14 0H14M-10 -10L10 10M10 -10L-10 10" stroke="#e8f8ff" stroke-width="4"/>`, 0.8 + 0.2 * Math.sin(tot * 4 + i))).join("")}` : ""}` : "";
  const theCoin = at(cX, cY + tap, cutCoin(70, a > 1.13 ? 1 : 0, "m3c") + iceG, 1.45, 0);
  const rot = (inner) => `<g transform="translate(${BX + 400} ${G}) rotate(${tilt}) translate(${-BX - 400} ${-G})">${inner}</g>`;
  const front = `<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/><rect x="-900" y="${G}" width="3800" height="10" fill="#3a2a7a"/>`;
  const dust = a > 4.3 ? [0, 1, 2, 3, 4].map((i) => at(BX - 360 + i * 180, G - 10, `<circle r="${(60 + 30 * rnd(i)) * spring(a - 4.3 - i * 0.04, 6, 9)}" fill="${P.stone}" opacity="${(0.7 * (1 - seg(a, 4.5, 4.84))).toFixed(2)}"/>`)).join("") : "";
  const main = `<g transform="translate(${shake} ${sink})">${rot(at(BX, G, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: cracks(seg(a, 3.95, 4.15) * 1.4) })) + theCoin + slice)}</g>` + front + dust + scissors + cal;
  return { g: town(c, tot, G) + layer(main, c), in: toScreen(c, cX, cY), inC: P.gold, inZ: 22, out: toScreen(c, BX, G + 60), outC: P.ink, outZ: 14 };
}
// ---- 4: an island at dawn; the houses wake up and find the bank shut ----
function m4(a, tot) {
  const c = camAt(a, [[0, 1008, 600, 1.3], [3.7, 1008, 600, 1.33], [5.09, 1008, 605, 1.37]]), G = 820, SEA = 790;
  const sunY = lerp(980, 560, easeOut(seg(a, 0, 3.0))), wake = (i) => (a > 3.36 + i * 0.1 ? 1 : 0), sh = ease(seg(a, 4.2, 4.5));
  const shutter = `<clipPath id="m4a"><path d="M-170 -40V-260A170 170 0 0 1 170 -260V-40Z"/></clipPath><g clip-path="url(#m4a)"><rect x="-180" y="-440" width="360" height="${(400 * sh).toFixed(1)}" fill="${P.steel}"/>${Array.from({ length: Math.floor(16 * sh) }, (_, i) => `<path d="M-180 ${-440 + 25 * (i + 1)}h360" stroke="${P.steelD}" stroke-width="5"/>`).join("")}</g>${sh >= 1 ? at(0, -110, padlock(1.3), pop(a - 4.5)) : ""}`;
  const sky = `<rect width="1920" height="1080" fill="url(#bsky)"/>`;
  const far = layer(rings(1350, sunY, 190, "#ffd27a", 0.22, 1.4) + `<circle cx="1350" cy="${sunY}" r="120" fill="#ffd98a"/>` + clouds(tot, 160, 3, "#ffb199", 0.5), c, 0.15);
  const water = `<rect x="-800" y="${SEA}" width="3600" height="900" fill="#1d6fb8"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${-400 + i * 200 + 30 * Math.sin(tot * 0.8 + i)} ${SEA + 40 + (i % 3) * 60}h100" stroke="#5fb6ff" stroke-width="8" stroke-linecap="round" opacity=".6"/>`).join("")}<path d="M1300 ${SEA + 20}h100M1260 ${SEA + 50}h180" stroke="#ffd98a" stroke-width="8" stroke-linecap="round" opacity=".5"/>`;
  const island = `<path d="M260 ${SEA + 30}Q320 ${G - 40} 520 ${G - 20}H1400Q1600 ${G - 40} 1660 ${SEA + 30}Z" fill="#e8c88a"/><path d="M300 ${SEA + 30}Q600 ${SEA + 50} 1620 ${SEA + 30}" stroke="#c9a76a" stroke-width="10" fill="none"/>`;
  const sign = at(1440, G - 10, `<rect x="-8" y="-260" width="16" height="260" fill="${P.woodD}"/>${two(rr(-130, -300, 260, 90, 12), P.cream, P.creamD, 0, 8)}${text(0, -238, "CYPRUS", 52, P.ink)}`, [1, pop(a - 1.68)]);
  const year = a > 2.43 ? at(530, 430, calPage("2013", "", 0.7, 150), pop(a - 2.43)) : "";
  const main = water + island + at(650, G, house(P.blue, P.blueD, { lit: [wake(0), wake(1), wake(0)] }), 0.9) + at(1270, G, house(P.pink, P.pinkD, { lit: [wake(2), wake(1), wake(2)] }), 0.9)
    + (a > 3.36 ? [650, 1270].map((x, i) => rings(x, G - 160, 200 * spring(a - 3.36 - i * 0.1, 7, 11), P.win, 0.1 * (1 - seg(a, 3.8, 4.3)))).join("") : "")
    + at(960, G, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: shutter }), 0.62) + sign + year;
  return { g: sky + far + layer(main, c), in: toScreen(c, 960, G - 90), inC: P.ink, inZ: 14, out: toScreen(c, 960, G - 110 * 0.62), outC: P.gold, outZ: 18 };
}
// ---- 5: a tower of coins with a line at €100,000; a scoop takes about half of what is above it, and the bank mends itself ----
function m5(a, tot) {
  const c = camAt(a, [[0, 1145, 640, 1.19], [4.53, 1145, 640, 1.22]]), G = 930, TX = 610, N = 16, LINE = 10, H = 28;
  const disk = (x, y) => `<path d="M${x - 130} ${y}v14a130 32 0 0 0 260 0v-14Z" fill="${P.goldD}"/><ellipse cx="${x}" cy="${y}" rx="130" ry="32" fill="${P.gold}"/><ellipse cx="${x}" cy="${y}" rx="92" ry="22" fill="none" stroke="${P.goldD}" stroke-width="5"/>`;
  const scoopT = seg(a, 2.07, 2.45), carry = seg(a, 2.45, 2.95), took = a > 2.45 ? 3 : 0, BX = 1490, BY = G;
  const sp = scoopT < 1 ? bez([1650, 380], [1400, 380], [TX + 120, G - (N - 1.5) * H - 40], easeOut(scoopT)) : bez([TX + 120, G - (N - 1.5) * H - 40], [1100, 300], [BX, BY - 300], ease(carry));
  let tower = "";
  for (let i = 0; i < N; i++) { const t0 = 0.05 + i * 0.04; if (a < t0) continue; if (i >= N - took) continue; const y = G - 20 - i * H - 260 * (1 - easeOut(seg(a, t0, t0 + 0.14)));
    tower += disk(TX, y); }
  const ly = G - 20 - (LINE - 0.5) * H - 14, line = drawn(`M${TX - 180} ${ly}H${TX + 260}`, seg(a, 0.66, 1.13), "#fff3c2", 7, 'stroke-dasharray="0.03 0.025"') + (a > 0.75 ? text(TX + 280, ly + 20, "€100,000", 58, "#fff3c2", { anchor: "start", opacity: seg(a, 0.75, 1.0).toFixed(2) }) : "");
  const load = took && a < 2.97 ? [0, 1, 2].map((i) => disk(0, -i * H)).join("") : "";
  const ex = easeIn(seg(a, 2.95, 3.45)), spx = sp[0] + 500 * ex, spy = sp[1] - 900 * ex;
  const scoop = a > 2.0 && ex < 1 ? at(spx, spy, `<path d="M-40 -400L-10 -60" stroke="${P.steelD}" stroke-width="22"/>${load ? at(0, -14, load, 0.8) : ""}<path d="M-160 -40Q0 100 160 -40L130 -60Q0 40 -130 -60Z" fill="${P.steel}"/>`, 1, carry * -8) : "";
  const fed = a > 2.95 ? spring(a - 2.95, 7, 11) : 0, mend = 1.4 * (1 - seg(a, 3.35, 4.1));
  const bk = at(BX, BY, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: (fed > 0 ? rings(0, -150, 120 * fed, P.gold, 0.3) : "") + cracks(mend) }), [0.72 * bump(a, 3.92, 0.06), 0.72 * bump(a, 3.92, 0.06)]);
  const main = `<rect x="-600" y="${G}" width="3200" height="400" fill="#2c1a66"/>` + bk + tower + line + scoop + (a > 3.92 ? rings(BX, BY - 300, 340 * spring(a - 3.92, 6, 10), P.gold, 0.12 * (1 - seg(a, 4.2, 4.53))) : "");
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(53, 60, -300, 2200, 900, tot), c, 0.2) + layer(main, c);
  return { g, in: toScreen(c, TX, G - 20 - (N - 1) * H), inC: P.gold, inZ: 18, out: toScreen(c, BX, BY - 110), outC: P.ink, outZ: 18 };
}
// ---- 6 (calm): dollars behind bars, a chain and a lock, and the years go by ----
function m6(a, tot) {
  const c = camAt(a, [[0, 860, 585, 1.0], [4.81, 860, 585, 1.04]]), G = 1000, K = 1.2, BX = 840;
  const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"], times = [1.45, 2.0, 2.5, 3.0, 3.5, 4.05];
  const n = times.filter((t) => a >= t).length;
  const cal = a > 0.55 ? at(1440, 290, calPage(years[n], "", 0.95, 150) + (n > 0 ? calFlip(years[n - 1], "", seg(a, times[n - 1], times[n - 1] + 0.35), 150) : ""), pop(a - 0.55, 6, 10)) : "";
  const cash = [[-90, -60], [0, -60], [90, -60], [-45, -110], [45, -110], [0, -160]].map(([x, y]) => at(x, y, banknote(1.0), 1)).join("") + rings(0, -110, 130, P.green, 0.1);
  const bars = [-150, -100, -50, 0, 50, 100, 150].map((x) => `<rect x="${x - 8}" y="-430" width="16" height="390" fill="${P.steel}"/><rect x="${x - 8}" y="-430" width="6" height="390" fill="#cdd5ee"/>`).join("") + `<rect x="-170" y="-250" width="340" height="16" fill="${P.steelD}"/>`;
  const webP = seg(a, 1.2, 4.8), web = (sx) => `<g transform="translate(${sx * 170} -260) scale(${-sx} 1)" opacity=".85">${[[0, 120], [60, 100], [100, 60], [120, 0]].map((e, i) => drawn(`M0 0L${e[0]} ${e[1]}`, webP * 2 - i * 0.15, "#cfc6ff", 3)).join("")}${[40, 80].map((r, i) => drawn(`M0 ${r}Q${r * 0.7} ${r * 0.7} ${r} 0`, webP * 2 - 0.6 - i * 0.3, "#cfc6ff", 3)).join("")}</g>`;
  const sway = 3 * Math.sin(tot * 0.9), chain = `<path d="M-200 -330L200 -130M200 -330L-200 -130" stroke="${P.steelD}" stroke-width="16" stroke-dasharray="26 10" stroke-linecap="round"/>` + at(0, -230 + 4 * Math.sin(tot * 0.7), padlock(1.2), 1, sway);
  const inner = cash + bars + web(-1) + web(1) + chain;
  const motes = Array.from({ length: 10 }, (_, i) => `<circle cx="${(BX - 220 + rnd(i * 3) * 440 + 20 * Math.sin(tot * 0.4 + i)).toFixed(1)}" cy="${(G - 500 + ((rnd(i * 3 + 1) * 400 + tot * 12) % 400)).toFixed(1)}" r="3" fill="${P.cream}" opacity=".4"/>`).join("");
  const main = `<rect x="-600" y="${G}" width="3200" height="400" fill="#2c1a66"/>` + at(BX, G, bank({ inside: P.ink, sign: [1, 1, 1, 1], inner }), K) + motes + cal;
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(59, 50, -300, 2200, 900, tot), c, 0.2) + layer(main, c);
  return { g, in: toScreen(c, BX, G - 160 * K), inC: P.ink, inZ: 16, out: toScreen(c, BX, G - 150 * K), outC: P.ink, outZ: 16 };
}
// ---- 7: an envelope goes round the planet in a second; a coin on a snail takes three days; both are only numbers ----
function m7(a, tot) {
  const c = camAt(a, [[0, 1100, 520, 1.0], [5.49, 1100, 530, 1.03]]), GX = 1100, GY = 480, R = 330, RX = 540, RY = 165;
  const orbit = (th) => [GX + RX * Math.cos(th), GY + 70 + RY * Math.sin(th)];
  const th0 = Math.PI / 2, envT = seg(a, 0.48, 1.23), envTh = th0 + 2 * Math.PI * ease(envT) + 0.75 * ease(seg(a, 1.3, 1.8)), env = orbit(envTh);
  const snailT = seg(a, 1.63, 3.6), snTh = th0 - 1.1 + 0.5 * snailT, sn = orbit(snTh);
  const morph = (t0) => { const u = a - t0; return u < 0 ? 1 : u < 0.2 ? Math.cos(Math.PI / 2 * u / 0.2) : -1; };
  const envGlyph = `${two(rr(-70, -46, 140, 92, 10), P.cream, P.creamD, 0, 6)}<path d="M-70 -46L0 10L70 -46" fill="none" stroke="${P.creamD}" stroke-width="7"/>`;
  const digits = `${rings(0, 0, 90, P.gold, 0.25, 1.3)}${number(0, 42, "0110", 120, "#fff3c2")}`;
  const mE = morph(3.6), mC = morph(3.85), gather = ease(seg(a, 4.3, 4.85));
  const envPos = [lerp(env[0], 720, gather), lerp(env[1], 880, gather)], snPos = [lerp(sn[0], 1460, gather), lerp(sn[1] - 60, 880, gather)];
  const trail = envT > 0 && envT < 1 ? Array.from({ length: 12 }, (_, i) => { const p = orbit(envTh - i * 0.12); return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${12 - i * 0.8}" fill="${P.gold}" opacity="${(0.5 - i * 0.04).toFixed(2)}"/>`; }).join("") : "";
  const snail = (k) => `<path d="M-90 0Q-100 -30 -60 -30H40Q70 -30 80 -60L90 -60Q90 -10 60 0Z" fill="#cfa6ff"/><path d="M76 -60l10 -40M86 -60l20 -34" stroke="#cfa6ff" stroke-width="6" stroke-linecap="round"/><circle cx="86" cy="-100" r="7" fill="${P.ink}"/><circle cx="106" cy="-94" r="7" fill="${P.ink}"/>${at(-10, -80, coin(56), 1, 8 * Math.sin(tot * 2))}`;
  const item = (pos, glyph, m, back) => (back ? "" : "") + at(pos[0], pos[1], m > 0 ? glyph : digits, [Math.max(0.04, Math.abs(m)) * (m > 0 ? 2.1 : 1), m > 0 ? 2.1 : 1]);
  const envItem = item(envPos, envGlyph, mE), snItem = a > 1.5 ? at(snPos[0], snPos[1], mC > 0 ? snail() : digits, [Math.max(0.04, Math.abs(mC)) * pop(a - 1.5) * (mC > 0 ? 2.2 : 1), pop(a - 1.5) * (mC > 0 ? 2.2 : 1)]) : "";
  const behind = (th) => Math.sin(th) < 0 && gather <= 0;
  const watch = a > 0.3 && a < 2.2 ? at(1640, 230, `${disc(0, 0, 90, P.cream, P.creamD)}<rect x="-14" y="-118" width="28" height="22" rx="6" fill="${P.red}"/><path d="M0 0L${(64 * Math.sin(2 * Math.PI * ease(envT))).toFixed(1)} ${(-64 * Math.cos(2 * Math.PI * ease(envT))).toFixed(1)}" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/><circle r="10" fill="${P.ink}"/>${a > 1.23 ? at(0, 160, text(0, 0, "1 s", 80, "#fff3c2"), pop(a - 1.23)) : ""}`, 1.4 * pop(a - 0.3) * (1 - seg(a, 1.9, 2.2))) : "";
  const dayFlip = (i) => calFlip(String(i + 1), "", seg(a, 2.67 + i * 0.24, 2.9 + i * 0.24), 150), cal = a > 2.2 ? at(1660, 260, calPage(String(Math.min(3, 1 + Math.floor(seg(a, 2.67, 3.14) * 2.99))), "", 0.9, 150) + [0, 1].map(dayFlip).join(""), pop(a - 2.2) * (1 - seg(a, 4.3, 4.6))) : "";
  const eq = a > 4.75 ? at(1090, 880, text(0, 50, "=", 150, P.gold), pop(a - 4.75)) : "";
  const path = `<ellipse cx="${GX}" cy="${GY + 70}" rx="${RX}" ry="${RY}" fill="none" stroke="#b9a8ff" stroke-width="4" stroke-dasharray="10 16" opacity="${(0.5 * (1 - gather)).toFixed(2)}"/>`;
  const main = path + (behind(envTh) ? envItem : "") + (behind(snTh) ? snItem : "") + at(GX, GY, globe(R, tot * 0.03)) + trail + (!behind(envTh) ? envItem : "") + (!behind(snTh) ? snItem : "") + eq;
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(67, 80, -300, 2300, 1080, tot), c, 0.15) + layer(main, c) + watch + cal;
  return { g, in: [1500, 200], inC: P.ink, inZ: 12 };
}

const SHOTS = [m0, m1, m2, m3, m4, m5, m6, m7];
export const middleSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
