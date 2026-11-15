// Crypto part 3, "not anonymous": ten wordless shots, one per board beat (shot list: episodes/techforbadguys/explain-crypto-03-world/shots.md).
//   0 the public page: rows of address → address ink in one by one and stay; a padlock, forever
//   1 one address on it gets a name card: the exchange tower hands over the ID card, a stamp lands on it
//   2 a light runs back up every arrow from that address: all the earlier rows light up; a clock turns backwards
//   3 2011: a door in a dark alley, a scarf-shaped sign "Silk Road"; inside, a hidden market of unmarked parcels; coins in and out
//   4 OCT 2013: a library, a masked laptop between the shelves; a spotlight, handcuffs click round it
//   5 a gavel, cell bars slide shut; a pardon seal; JAN 2025, the bars swing open
//   6 out of the market's back door a sack "50,000" tiptoes away
//   7 the trail stays lit in the ledger while 2012 → 2021 flies past; three knocks shake a house door
//   8 a popcorn tin on a closet shelf: the lid pops, a little drive glows inside
//   9 (host left) 2016: the Bitfinex tower's vault pours out 120,000; the trail lights to a house; 2022, two pairs of cuffs; a microphone with notes
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3anon.v.js";
import { house, stars, skyline } from "./bank.js";
import { calPage, calFlip, laptop } from "./props.js";
import { P, mix, coin, WHO, hexOf, tower, drive, tin, cuffs } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x1 = 2800) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -900, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f", x0 = -2000, x1 = 6000) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="1500" fill="${fill}"/>`;
const COLS = ["blue", "pink", "teal", "violet", "gold"];

// ---- the public page: shared by shots 0–2 ----
// rows of [from colour, to colour]; row y from the top of the page
const ROWS = [["teal", "blue"], ["blue", "violet"], ["pink", "teal"], ["blue", "pink"], ["violet", "blue"], ["gold", "teal"], ["blue", "gold"]];
const ME = 6;      // the row whose sender gets the name card (the blue address, last row)
const PG = { x: 960, y: 560, w: 1000, h: 820 };
const rowY = (i) => PG.y - PG.h / 2 + 120 + i * 92;
// one row: dot + code, arrow, dot + code. `ink` 0..1 how far it is written, `lit` 0..1 gold glow, `meLit` for the card row
function ledgerRow(i, ink, lit) {
  if (ink <= 0) return ""; const y = rowY(i), [fa, fb] = ROWS[i], x0 = PG.x - 400, x1 = PG.x + 70;
  const addr = (x, col, seed) => `<circle cx="${x}" cy="${y}" r="20" fill="${WHO[col][0]}"/>${text(x + 34, y + 14, hexOf(seed, 6) + "…", 40, P.ink, { anchor: "start" })}`;
  const arrow = drawn(`M${x0 + 250} ${y}H${x1 - 40}`, seg(ink, 0.3, 0.8), lit > 0.05 ? mix("#bda97c", P.goldD, lit) : "#bda97c", 8) + (ink > 0.8 ? `<path d="M${x1 - 54} ${y - 14}L${x1 - 34} ${y}L${x1 - 54} ${y + 14}" fill="none" stroke="${lit > 0.05 ? P.goldD : "#bda97c"}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` : "");
  const glow = lit > 0.02 ? `<path d="${rr(PG.x - PG.w / 2 + 30, y - 38, PG.w - 60, 76, 18)}" fill="${P.gold}" opacity="${(0.35 * lit).toFixed(2)}"/>` : "";
  return glow + `<g opacity="${clamp(ink * 3).toFixed(2)}">${addr(x0, fa, i * 7 + 1)}</g>` + arrow + (ink > 0.75 ? `<g opacity="${clamp((ink - 0.75) * 4).toFixed(2)}">${addr(x1, fb, i * 7 + 4)}</g>` : "");
}
const pageBack = () => `<path d="${rr(PG.x - PG.w / 2 + 16, PG.y - PG.h / 2 + 16, PG.w, PG.h, 26)}" fill="${P.creamD}"/><path d="${rr(PG.x - PG.w / 2, PG.y - PG.h / 2, PG.w, PG.h, 26)}" fill="${P.cream}"/>
  <path d="M${PG.x - PG.w / 2 + 70} ${PG.y - PG.h / 2}V${PG.y + PG.h / 2}" stroke="#f3c7c7" stroke-width="5"/>${rings(PG.x, PG.y, 640, P.gold, 0.05)}`;
// the ID card clipped to an address: a house where a photo would be
const idCard = () => `${two(rr(-110, -70, 220, 140, 14), "#e8f0ff", "#b9c6e6", 0, 7)}<path d="${rr(-110, -70, 220, 26, 12)}" fill="${P.blue}"/>${at(-56, 40, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.26)}
  <path d="M-10 -14h90M-10 12h70M-10 38h84" stroke="#8792bb" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="-82" r="12" fill="${P.steel}"/>`;

// ---- 0: everything is written, forever ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.18], [3.69, 960, 560, 1.1]]);
  let rows = ""; ROWS.forEach((_, i) => { rows += ledgerRow(i, seg(a, 0.15 + i * 0.28, 0.75 + i * 0.28), 0); });
  // a gold bead runs along the last row's arrow on "from address to address"
  const bead = a > 2.55 ? at(lerp(PG.x - 150, PG.x + 30, ease(seg(a, 2.6, 3.2))), rowY(ROWS.length - 1), rings(0, 0, 22, P.gold, 0.4) + `<circle r="14" fill="${P.gold}"/>`) : "";
  // forever: a padlock snaps onto the page's corner, a ∞ ribbon
  const lock = at(PG.x + PG.w / 2 - 40, PG.y - PG.h / 2 + 40, `${rings(0, 0, 90, P.gold, 0.2 * seg(a, 2.0, 2.3))}<path d="M-30 -20v-26a30 30 0 0 1 60 0v26" fill="none" stroke="${P.steel}" stroke-width="14"/>${two(rr(-46, -24, 92, 76, 14), P.gold, P.goldD, 6, 6)}${text(0, 40, "∞", 56, P.ink)}`, pop(a - 2.0), -8);
  const g = night(c, tot, 13) + layer(ground(1040) + pageBack() + rows + bead + lock, c);
  return { g, out: toScreen(c, PG.x, rowY(ME)), outC: P.cream, outZ: 14 };
}
// ---- 1: one address gets your name ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.12], [1.6, 1060, 600, 1.0], [3.77, 1080, 610, 0.98]]);
  let rows = ""; ROWS.forEach((_, i) => { rows += ledgerRow(i, 1, 0); });
  const TW = [1820, 1000], fly = seg(a, 0.85, 1.45), cardAt = bez([TW[0] - 40, TW[1] - 520], [1500, 260], [PG.x - 400 + 20, rowY(ME) - 96], ease(fly));
  const tw = at(TW[0], TW[1], tower({ name: "", h: 760, seed: 3 }), 0.8 * pop(a - 0.1));
  const stampHit = seg(a, 2.55, 2.75), stampMark = a > 2.75 ? at(70, 0, `<circle r="42" fill="none" stroke="${P.red}" stroke-width="8" opacity=".85"/><path d="M-20 0l14 14l26 -28" fill="none" stroke="${P.red}" stroke-width="9" stroke-linecap="round"/>`, pop(a - 2.75), -12) : "";
  const stamper = a > 2.1 && a < 3.3 ? at(cardAt[0] + 70, cardAt[1] - 110 + 90 * ease(stampHit) - 60 * seg(a, 2.9, 3.2), `${two(rr(-26, -130, 52, 100, 18), P.wood, P.woodD, 6, 0)}${two(rr(-60, -36, 120, 36, 10), P.red, P.redD, 0, 6)}`, pop(a - 2.1)) : "";
  const card = fly > 0 ? at(cardAt[0], cardAt[1], idCard() + stampMark, lerp(0.5, 1.0, ease(fly)), lerp(-30, -6, ease(fly))) : "";
  const clip = fly >= 1 ? rings(PG.x - 400, rowY(ME), 60, P.blue, 0.3 * (1 - seg(a, 1.45, 1.9))) : "";
  const g = night(c, tot, 13) + layer(ground(1040) + tw + pageBack() + rows + clip + card + stamper, c);
  return { g, in: toScreen(c, PG.x, rowY(ME)), inC: P.cream, inZ: 14 };
}
// ---- 2: everything before it lights up, backwards ----
function s2(a, tot) {
  const c = camAt(a, [[0, 1080, 610, 0.98], [2.38, 1020, 570, 0.92]]);
  // the light climbs from the carded row back up through the rows that share the blue address
  let rows = ""; ROWS.forEach((r, i) => { const mine = r.includes("blue"), t0 = 0.15 + (ME - i) * 0.17; rows += ledgerRow(i, 1, mine ? ease(seg(a, t0, t0 + 0.25)) : 0); });
  let trail = ""; const blueRows = ROWS.map((r, i) => (r.includes("blue") ? i : -1)).filter((i) => i >= 0).reverse();
  for (let k = 0; k < blueRows.length - 1; k++) { const i0 = blueRows[k], i1 = blueRows[k + 1], t0 = 0.15 + (ME - i0) * 0.17, p = seg(a, t0, t0 + 0.3), x = PG.x - PG.w / 2 + 40;
    trail += drawn(`M${x} ${rowY(i0)}C${x - 60} ${rowY(i0)} ${x - 60} ${rowY(i1)} ${x} ${rowY(i1)}`, p, P.gold, 9); }
  const card = at(PG.x - 380, rowY(ME) - 96, idCard(), 1, -6);
  // retroactively: a clock whose hand runs backwards
  const back = -tot * 0 - 6.283 * ease(seg(a, 1.3, 2.3)) * 1.5, cl = at(PG.x + PG.w / 2 + 170, PG.y - 140, `${disc(0, 0, 110, P.cream, P.creamD)}${[0, 1, 2, 3].map((i) => `<path d="M${Math.cos(i * 1.571) * 82} ${Math.sin(i * 1.571) * 82}L${Math.cos(i * 1.571) * 96} ${Math.sin(i * 1.571) * 96}" stroke="${P.ink}" stroke-width="9" stroke-linecap="round"/>`).join("")}
    <path d="M0 0L${(Math.cos(back - 1.571) * 76).toFixed(1)} ${(Math.sin(back - 1.571) * 76).toFixed(1)}" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/><circle r="10" fill="${P.red}"/>
    <path d="M-150 -40A150 150 0 0 1 -60 -138" fill="none" stroke="${P.gold}" stroke-width="12" stroke-linecap="round"/><path d="M-168 -64L-150 -30L-120 -56" fill="${P.gold}"/>`, pop(a - 1.2));
  const g = night(c, tot, 13) + layer(ground(1040) + pageBack() + trail + rows + card + cl, c);
  return { g, out: toScreen(c, PG.x - 400, rowY(ME)), outC: "#141038", outZ: 16 };
}

// ---- the alley and the market: shots 3 and 6 ----
const DOOR = [1000, 900];      // the market door, base centre
function alley(a, tot, c, o = {}) {
  const G = DOOR[1], open = o.open ?? 0, inner = o.inner ?? 0;
  const walls = `<path d="${rr(380, G - 640, 1240, 640, 0)}" fill="#2b2160"/>${Array.from({ length: 9 }, (_, r) => Array.from({ length: 10 }, (_, q) => `<path d="${rr(390 + q * 124 + (r % 2) * 60, G - 630 + r * 70, 112, 60, 6)}" fill="#33286e"/>`).join("")).join("")}`;
  const lamp = `<path d="M1420 ${G - 640}v-40h60" stroke="${P.steelD}" stroke-width="10" fill="none"/>${rings(1480, G - 640, 80, P.win, 0.25)}<circle cx="1480" cy="${G - 640}" r="20" fill="${P.win}"/>`;
  // inside the door: warm light, shelves of unmarked parcels with "?"
  const insideW = 300, ih = 470;
  let parcels = ""; for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { const pp = pop(inner * 3 - (r * 3 + q) * 0.12);
    parcels += at(DOOR[0] - 90 + q * 90, G - 340 + r * 110, `${two(rr(-36, -40, 72, 60, 6), "#c9773a", "#a35c28", 0, 6)}<path d="M-36 -18h72" stroke="#7a4a20" stroke-width="5"/>${text(0, 14, "?", 34, "#fff3c2")}`, pp); }
  const inside = `<path d="${rr(DOOR[0] - insideW / 2, G - ih, insideW, ih, 0)}" fill="${mix("#141038", "#ffb066", 0.55 * open)}"/>${open > 0.3 ? parcels : ""}`;
  // the door swings open (seen as a narrowing panel)
  const door = `<path d="M${DOOR[0] - insideW / 2} ${G - ih}h${(insideW * (1 - 0.85 * ease(open))).toFixed(1)}v${ih}h${(-insideW * (1 - 0.85 * ease(open))).toFixed(1)}Z" fill="#5a3a28"/><circle cx="${DOOR[0] - insideW / 2 + insideW * (1 - 0.85 * ease(open)) - 30}" cy="${G - 230}" r="10" fill="${P.gold}"/>`;
  // the sign: a silk scarf with the name
  const sw = 3 * Math.sin(tot * 2), sign = at(DOOR[0], G - ih - 90, `<path d="M-230 -46Q-120 ${-70 + sw} 0 -46Q120 ${-22 - sw} 230 -46L250 40Q120 ${20 + sw} 0 44Q-120 ${68 - sw} -250 40Z" fill="${P.pink}"/><path d="M-230 -46Q-120 ${-70 + sw} 0 -46Q120 ${-22 - sw} 230 -46" fill="none" stroke="${P.pinkD}" stroke-width="10"/>${text(0, 22, "Silk Road", 64, "#fff")}`, pop((o.sign ?? 1) * 10));
  return walls + lamp + inside + door + sign;
}
function s3(a, tot) {
  const c = camAt(a, [[0, 1000, 600, 1.1], [1.4, 1000, 620, 1.2], [3.3, 1060, 640, 1.32], [5.02, 1080, 640, 1.34]]);
  const cal = at(560, 260, calPage("2011", "", 1, 150), 0.7 * pop(a - 0.2), -6);
  const open = ease(seg(a, 1.3, 1.9)), inner = seg(a, 1.6, 3.4);
  // bitcoin goes in and out of the door on "the payment: bitcoin"
  let coins = ""; for (let i = 0; i < 6; i++) { const t = a - 4.1 - i * 0.12; if (t < 0 || t > 0.9) continue; const p = ease(t / 0.9), inn = i % 2 === 0;
    const from = inn ? [1500, 700] : [DOOR[0], DOOR[1] - 200], to = inn ? [DOOR[0], DOOR[1] - 200] : [1520, 560], b = bez(from, [1300, 480], to, p);
    coins += at(b[0], b[1], coin(34, "B"), inn ? lerp(1, 0.5, p) : lerp(0.5, 1, p)); }
  const g = night(c, tot, 21) + layer(ground(DOOR[1], "#1e1446") + alley(a, tot, c, { open, inner, sign: seg(a, 2.6, 2.75) }) + cal + coins, c);
  return { g, in: toScreen(c, DOOR[0], DOOR[1] - 230), inC: "#141038", inZ: 16, out: toScreen(c, 1260, 380), outC: "#1b1f4a", outZ: 18 };
}

// ---- 4: the library ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 540, 0.9], [1.5, 960, 560, 1.0], [3.94, 960, 600, 1.25]]);
  const G = 900;
  let shelves = ""; [[220, 0], [1700, 1]].forEach(([x, s]) => { shelves += `<path d="${rr(x - 200, G - 760, 400, 760, 8)}" fill="${P.woodD}"/>`;
    for (let r = 0; r < 5; r++) { shelves += `<path d="${rr(x - 186, G - 740 + r * 148 + 124, 372, 16, 4)}" fill="#6a3e1f"/>`;
      for (let q = 0; q < 9; q++) { const h = 80 + rnd(x + r * 13 + q) * 36, col = [P.red, P.blue, P.teal, P.violet, P.gold, P.green][Math.floor(rnd(q * 7 + r + s) * 6)]; shelves += `<path d="${rr(x - 176 + q * 40, G - 740 + r * 148 + 124 - h, 34, h, 4)}" fill="${col}"/>`; } } });
  const table = `${two(rr(600, G - 300, 720, 40, 10), P.wood, P.woodD, 0, 10)}<path d="${rr(640, G - 260, 30, 260, 6)}" fill="${P.woodD}"/><path d="${rr(1250, G - 260, 30, 260, 6)}" fill="${P.woodD}"/>`;
  // the laptop with a mask on its screen: the one who thought he was hidden
  const mask = `<path d="M-80 -120Q-70 -150 -30 -142Q0 -136 0 -120Q0 -136 30 -142Q70 -150 80 -120Q70 -84 30 -88Q8 -90 0 -104Q-8 -90 -30 -88Q-70 -84 -80 -120Z" fill="${P.ink}"/>${[-36, 36].map((x) => `<ellipse cx="${x}" cy="-118" rx="16" ry="11" fill="#9fe7ff"/>`).join("")}`;
  const lap = at(960, G - 300, laptop("#9fe7ff", mask), 1.4);
  // the spotlight snaps on, then the cuffs close round the laptop
  const spot = a > 1.45 ? `<path d="M900 -100L1080 -100L1330 ${G - 280}L590 ${G - 280}Z" fill="#fff3c2" opacity="${(0.18 * ease(seg(a, 1.45, 1.6))).toFixed(3)}"/>${rings(960, G - 300, 340, "#fff3c2", 0.08 * seg(a, 1.45, 1.6))}` : "";
  const cuff = a > 2.1 ? at(960, G - 420, cuffs({ shut: ease(seg(a, 2.6, 3.0)) }), 1.5 * pop(a - 2.1), -8) : "";
  const cal = at(1440, 200, calPage("2013", "OCT", 1, 150), 0.62 * pop(a - 2.0), 6);
  const dark = `<rect x="-1000" y="-600" width="4000" height="2400" fill="#0b0828" opacity="${(0.45 * ease(seg(a, 1.45, 1.6))).toFixed(2)}"/>`;
  const g = night(c, tot, 29) + layer(`<rect x="-1000" y="-600" width="4000" height="2400" fill="#2a1d5c"/>` + ground(G, "#3a2a70") + shelves + table + dark + spot + lap + cuff + cal, c);
  return { g, in: [960, 300], inC: "#1b1f4a", inZ: 18, out: toScreen(c, 960, G - 420), outC: P.steel, outZ: 18 };
}

// ---- 5: life, then a pardon ----
function s5(a, tot) {
  const c = camAt(a, [[0, 900, 560, 1.05], [3.61, 920, 540, 1.1]]);
  const G = 900, slide = ease(seg(a, 0.45, 0.8)), swing = ease(seg(a, 2.7, 3.3));
  const cell = `<path d="${rr(560, G - 560, 800, 560, 10)}" fill="#24346f"/><path d="${rr(600, G - 520, 720, 520, 8)}" fill="#141038"/>`;
  // the bars: slide in from the left, later swing open as a door (shown by narrowing)
  const bw = 720 * (1 - 0.85 * swing), bx = 600 - 720 * (1 - slide);
  const bars = `<g>${Array.from({ length: 9 }, (_, i) => `<rect x="${(bx + i * (bw / 8.5)).toFixed(1)}" y="${G - 520}" width="16" height="520" fill="${P.steel}"/>`).join("")}<rect x="${bx.toFixed(1)}" y="${G - 520}" width="${bw.toFixed(1)}" height="18" fill="${P.steelD}"/><rect x="${bx.toFixed(1)}" y="${G - 280}" width="${bw.toFixed(1)}" height="18" fill="${P.steelD}"/></g>`;
  const hit = ease(seg(a, 0.2, 0.45)), gv = at(330, G - 20, `${two(rr(-120, -36, 240, 36, 10), P.woodD, "#6a3e1f", 0, 6)}<g transform="rotate(${(-50 + 50 * hit).toFixed(1)} 150 -40)"><path d="M150 -40L20 -120" stroke="${P.wood}" stroke-width="26" stroke-linecap="round"/><g transform="translate(0 -130) rotate(-32)">${two(rr(-80, -46, 160, 92, 22), P.wood, P.woodD, 0, 10)}<path d="M-60 -46v92M60 -46v92" stroke="${P.gold}" stroke-width="12"/></g></g>`, 1.5) + (a > 0.45 && a < 1.0 ? rings(340, G - 140, 120 * spring(a - 0.45, 8, 12), P.gold, 0.3 * (1 - seg(a, 0.6, 1.0))) : "");
  // the pardon: a ribboned seal pops on the bars, then the door swings open on light
  const seal = at(960, G - 600, `${[-1, 1].map((d) => `<path d="M${d * 20} 30L${d * 60} 130L${d * 30} 110L${d * 10} 140Z" fill="${P.red}"/>`).join("")}${disc(0, 0, 70, P.gold, P.goldD)}<circle r="48" fill="none" stroke="${P.goldD}" stroke-width="8"/>${text(0, 22, "★", 64, P.goldD)}`, pop(a - 1.75));
  const light = swing > 0 ? `<path d="${rr(600, G - 520, 720, 520, 8)}" fill="#ffe6a0" opacity="${(0.85 * swing).toFixed(2)}"/>` : "";
  const flip = seg(a, 2.35, 2.7), cal = at(1560, 300, (flip < 1 ? calFlip("2013", "", flip, 150) : "") + (flip > 0 ? calPage("2025", "JAN", 1, 150) : ""), 0.66 * pop(a - 0.1), 5);
  const g = night(c, tot, 31) + layer(ground(G, "#2c1f63") + cell + light + bars + gv + seal + cal, c);
  return { g, in: [960, 500], inC: P.steel, inZ: 18 };
}
// ---- 6: a sack of 50,000 tiptoes out the back ----
function s6(a, tot) {
  const c = camAt(a, [[0, 1000, 560, 1.0], [2.53, 1180, 560, 1.05]]);
  const G = DOOR[1], go = seg(a, 0.45, 2.5), hop = Math.abs(Math.sin(go * Math.PI * 5)) * 40, x = lerp(DOOR[0], 1620, go);
  const sack = at(x, G - 80 - hop, `${two("M-80 60Q-100 -40 -40 -70L-20 -96H20L40 -70Q100 -40 80 60Z", "#c9a46a", "#a8834a", 0, 10)}<path d="M-30 -90Q0 -78 30 -90" stroke="#7a5a2a" stroke-width="8" fill="none"/>${text(0, 30, "B", 60, "#7a5a2a")}`, pop(a - 0.3), -8 * Math.sin(go * Math.PI * 5));
  const tag = a > 1.15 ? at(x, G - 290 - hop, `${two(rr(-140, -40, 280, 80, 40), P.gold, P.goldD, 4, 4)}${text(0, 22, "50,000", 58, P.ink)}`, pop(a - 1.15)) : "";
  const steps = Array.from({ length: Math.floor(go * 8) }, (_, i) => `<ellipse cx="${DOOR[0] + 60 + i * 80}" cy="${G + 20}" rx="18" ry="7" fill="#3a2a70"/>`).join("");
  const g = night(c, tot, 21) + layer(ground(G, "#1e1446") + alley(a, tot, c, { open: 1, inner: 1 }) + steps + sack + tag, c);
  return { g };
}
// ---- 7: the ledger remembered: the trail stays lit for nine years, then a knock ----
function s7(a, tot) {
  const G = 900, HX = 1900, c = camAt(a, [[0, 700, 560, 0.75], [1.2, 900, 560, 0.72], [2.4, 1640, 620, 0.85], [3.69, 1660, 620, 0.9]]);
  // a glowing dotted trail on the ground from the market's door to a house far off
  const trail = drawn(`M-200 ${G - 60}C300 ${G - 200} 900 ${G + 40} ${HX - 120} ${G - 60}`, 1, P.gold, 10, `stroke-dasharray="4 26" opacity="${(0.7 + 0.3 * Math.sin(tot * 4)).toFixed(2)}"`);
  const small = at(-260, G, `<path d="${rr(-150, -260, 300, 260, 0)}" fill="#2b2160"/><path d="${rr(-60, -200, 120, 200, 0)}" fill="#5a3a28"/>${at(0, -280, `<path d="M-120 -24Q0 -40 120 -24L130 24Q0 8 -130 24Z" fill="${P.pink}"/>`)}`);
  // the book over it, its row with the trail still lit
  const bk = at(420, 340, `${two(rr(-200, -120, 400, 240, 16), P.cream, P.creamD, 0, 8)}<path d="${rr(-170, -6, 340, 40, 12)}" fill="${P.gold}" opacity="${(0.4 + 0.2 * Math.sin(tot * 4)).toFixed(2)}"/>${[-60, 20, 60].map((y) => `<path d="M-150 ${y}h300" stroke="#dccaa0" stroke-width="8" stroke-linecap="round"/>`).join("")}<circle cx="-140" cy="14" r="12" fill="${P.blue}"/>`, 1);
  const beam = drawn(`M420 460Q500 ${G - 200} 560 ${G - 120}`, 1, P.gold, 4, 'stroke-dasharray="6 12" opacity=".6"');
  // the years fly past
  const yr = 2012 + Math.round(9 * ease(seg(a, 1.15, 2.35))), cal = at(1000, 260, calPage(String(yr), "", 1, 150), 0.75 * pop(a - 1.0), -4);
  // the house; three knocks shake the door
  const knocks = [2.75, 3.0, 3.25], kn = knocks.reduce((s, t) => s + (a > t ? Math.exp(-(a - t) * 14) * Math.sin((a - t) * 60) : 0), 0);
  const hs = at(HX, G, house(P.teal, P.tealD, { lit: [1, 1, 1] }) + `<path d="M-24 0V-66A24 24 0 0 1 24 -66V0Z" fill="${P.ink}" transform="translate(${(6 * kn).toFixed(1)} 0)"/>`, 1.3);
  const rr_ = knocks.map((t) => (a > t && a < t + 0.5 ? rings(HX - 60, G - 50, 40 + 140 * (a - t), P.cream, 0.3 * (1 - (a - t) / 0.5)) : "")).join("");
  const g = night(c, tot, 37) + layer(skyline(41, -800, 3000, G - 40, 80, 260, "#221a5c", "#ffb066"), c, 0.5) + layer(ground(G, "#1e1446") + small + trail + beam + bk + cal + hs + rr_, c);
  return { g, out: toScreen(c, HX, G - 60), outC: P.ink, outZ: 18 };
}
// ---- 8: the popcorn tin ----
function s8(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [0.9, 960, 520, 1.25], [6.34, 960, 500, 1.4]]);
  const G = 760, open = ease(seg(a, 0.25, 0.6)), glow = seg(a, 0.85, 1.25);
  const closet = `<rect x="-1000" y="-600" width="4000" height="2400" fill="#3a2a70"/><path d="${rr(560, 120, 800, 900, 10)}" fill="#2a1d5c"/>${two(rr(540, G, 840, 30, 6), P.wood, P.woodD, 0, 8)}
    ${at(700, G, `${two(rr(-70, -150, 140, 150, 10), "#e8f0ff", "#b9c6e6", 0, 6)}<path d="M-40 -110h80M-40 -80h60" stroke="#8792bb" stroke-width="8"/>`)}${at(1230, G, `${two(rr(-60, -110, 120, 110, 30), "#9fe7ff", P.blue, 0, 6)}`)}`;
  const t = at(960, G, tin({ open, glow }), 1.5);
  const dev = glow > 0 ? at(960, G - 420 - 120 * ease(glow), drive({ glow: 1 }), 1.3 * glow) : "";
  const g = night(c, tot, 41) + layer(closet + t + dev, c);
  return { g, in: [960, 540], inC: P.ink, inZ: 18 };
}
// ---- 9: Bitfinex, the couple, the rapper (host left) ----
function s9(a, tot) {
  const G = 940, TX = 820, HX = 1500;
  const c = camAt(a, [[0, 980, 520, 0.85], [3.3, 1050, 520, 0.85], [4.4, 1260, 600, 1.15], [8.19, 1270, 600, 1.17]]);
  const cal16 = seg(a, 4.4, 4.75), cal = at(1620, 220, (cal16 < 1 ? calFlip("2016", "", cal16, 150) : "") + (cal16 > 0 ? calPage("2022", "", 1, 150) : ""), 0.64 * pop(a - 0.2), 5);
  const tw = at(TX, G, tower({ name: "Bitfinex", h: 720, seed: 9 }), 0.95);
  // the vault at its foot spills a stream of coins and a counter rolls to 120,000
  const spill = seg(a, 1.5, 3.2); let coins = "";
  for (let i = 0; i < 18; i++) { const t = (spill * 2.2 - i * 0.07); if (t <= 0 || t > 1) continue; const b = bez([TX + 120, G - 70], [TX + 330, G - 360 + (i % 3) * 40], [TX + 560 + (i % 5) * 30, G - 30], ease(t)); coins += at(b[0], b[1], coin(26, "B")); }
  const cnt = a > 1.5 ? at(TX + 470, G - 560, `${two(rr(-210, -54, 420, 108, 54), P.gold, P.goldD, 5, 5)}${number(0, 24, Math.round(120000 * ease(seg(a, 1.6, 3.2))).toLocaleString("en"), 70, P.ink)}`, pop(a - 1.5)) : "";
  // the trail lights from the spill to a house
  const trail = drawn(`M${TX + 600} ${G - 20}Q${(TX + HX) / 2 + 150} ${G - 160} ${HX - 120} ${G - 40}`, seg(a, 3.2, 3.75), P.gold, 9, 'stroke-dasharray="4 22"');
  const hs = at(HX, G, house(P.violet, P.violetD, { lit: [1, 1, 1] }), 1.1 * pop(a - 3.0));
  // two pairs of cuffs pop over the house; a microphone with notes beside one of them
  const cf = [0, 1].map((i) => at(HX - 120 + i * 240, G - 420, cuffs({ shut: ease(seg(a, 3.9 + i * 0.15, 4.2 + i * 0.15)) }), 1.15 * pop(a - 3.75 - i * 0.15), i ? 10 : -10)).join("");
  const mic = a > 5.5 ? at(HX + 330, G - 240, `${two(rr(-22, -110, 44, 80, 22), P.steel, P.steelD, 4, 0)}<path d="M-34 -60Q-34 -10 0 -10Q34 -10 34 -60" fill="none" stroke="${P.steelD}" stroke-width="8"/><path d="M0 -10v40M-28 30h56" stroke="${P.steelD}" stroke-width="8" stroke-linecap="round"/>
    ${[0, 1, 2].map((i) => { const t = (a * 0.9 + i / 3) % 1; return at(40 + 60 * t, -120 - 120 * t, text(0, 0, i % 2 ? "♪" : "♫", 54, P.pink), 1, 0, `opacity="${(1 - t).toFixed(2)}"`); }).join("")}`, 1.2 * pop(a - 5.5)) : "";
  const crime = a > 7.15 ? cross(HX + 420, G - 420, 40, P.red, a - 7.15) : "";
  const g = night(c, tot, 43) + layer(skyline(51, -800, 3200, G - 40, 80, 260, "#221a5c", "#ffb066"), c, 0.5) + layer(ground(G, "#1e1446") + tw + coins + cnt + trail + hs + cf + mic + crime + cal, c);
  return { g };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];
export const c3anonSet = makeSet(SHOTS, V, P);
