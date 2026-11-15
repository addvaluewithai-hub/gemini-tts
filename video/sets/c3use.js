// Crypto part 3, scene "use": how humans buy the coin and send it. Ten wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-03-world/shots.md), in the world of parts 1 and 2.
//   0 the exchange tower: notes go in, a coin comes out; an ID card and a face photo are stamped at its counter
//   1 two houses over a fence: a coin hops straight from one to the other
//   2 a long code on a paper slip is copied onto the phone, and keeps getting longer
//   3 a small fee coin flies up from the phone to the page being written
//   4 the page fills and is sealed, our slip inside
//   5 one character flips red, the coin flies to a stranger's dark house, the complaints window slams (host right)
//   6 a bug swaps the copied code; a magnifier checks the first and last characters and catches it (host left)
//   7 SEP 2023: a company tower sends a small pile, $2,000
//   8 the fee heap rolls up to $500,000 and the balance slams down
//   9 the miners' warehouse sends the heap back with a bow and a heart; the courthouse stays dark (host left)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3use.v.js";
import { stars, skyline, house, note } from "./bank.js";
import { calPage } from "./props.js";
import { P, mix, coin, page, slip, warehouse, balance } from "./c2props.js";
import { tower, hotPhone, stamp, bug, heart, mailbox } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x1 = 2800) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -900, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f", x0 = -1400, x1 = 4400) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="900" fill="${fill}"/>`;
const town = (c, seed = 11) => layer(skyline(seed, -900, 2900, 860, 120, 330, "#3a1f72"), c, 0.35) + layer(skyline(seed + 30, -900, 2900, 900, 80, 230, "#2c1860", "#ffb066"), c, 0.6);
// the ID card and the face photo
const idCard = () => `${two(rr(-120, -76, 240, 152, 14), P.cream, P.creamD, 0, 7)}<path d="${rr(-120, -76, 240, 30, 12)}" fill="${P.blue}"/><circle cx="-62" cy="18" r="36" fill="#9fb0ff"/><circle cx="-62" cy="6" r="15" fill="${P.blueD}"/><path d="M-90 46q28 -32 56 0" fill="${P.blueD}"/>${[0, 1, 2].map((i) => `<path d="M0 ${-6 + i * 26}h${88 - i * 18}" stroke="#c9b48a" stroke-width="10" stroke-linecap="round"/>`).join("")}`;
const photo = () => `${two(rr(-80, -96, 160, 192, 10), "#fff", "#d8dcef", 0, 7)}<path d="${rr(-64, -80, 128, 128, 6)}" fill="#9fb0ff"/><circle cx="0" cy="-26" r="28" fill="${P.blueD}"/><path d="M-46 48q46 -60 92 0" fill="${P.blueD}"/>`;
// the code we send to (the pink house's address); WRONG has one character changed; THIEF is the swapped one
const CODE = "bc1q7c0355f9a2e4", WRONG = "bc1q7c0355f9a2e8", THIEF = "bc1qx9d4kk20mr7z";
const codeText = (x, y, str, size, fill, o = {}) => text(x, y, str, size, fill, { anchor: o.anchor || "middle", extra: 'letter-spacing="3"' });

// ---- 0: the exchange: money in, coin out, then your ID and your face ----
const TX = 1100, G0 = 880;
function s0(a, tot) {
  const c = camAt(a, [[0, 760, 620, 1.12], [3.9, 790, 610, 1.14], [4.7, 1060, 700, 1.5], [7.55, 1070, 700, 1.55]]);
  const blue = at(390, G0, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.1);
  const tw = at(TX, G0, tower({ h: 720, lit: 0.85 + 0.1 * Math.sin(tot * 2) }), 1.0);
  // the counter in front of the tower
  const counter = `${two(rr(TX - 330, G0 - 120, 660, 120, 10), P.wood, P.woodD, 0, 10)}<path d="${rr(TX - 350, G0 - 136, 700, 24, 8)}" fill="${P.cream}"/>`;
  // notes fly from the house into the counter (2.0–2.8), a coin comes back (3.2–3.9)
  let fly = "";
  for (let i = 0; i < 3; i++) { const p = seg(a, 2.0 + i * 0.12, 2.7 + i * 0.12); if (p <= 0 || p >= 1) continue; const b = bez([420, G0 - 260], [700, G0 - 520], [TX - 40, G0 - 160], easeIn(p) * 0.4 + ease(p) * 0.6); fly += at(b[0], b[1], note(), 1.4, 20 * p + i * 10); }
  const cp = seg(a, 3.2, 3.9); if (cp > 0) { const b = cp < 1 ? bez([TX, G0 - 180], [720, G0 - 560], [400, G0 - 230], ease(cp)) : [400, G0 - 230]; fly += at(b[0], b[1] + (cp >= 1 ? 4 * Math.sin(tot * 3) : 0), rings(0, 0, 50, P.gold, 0.2) + coin(36, "B"), cp >= 1 ? 1 : 1 + 0.3 * Math.sin(Math.PI * cp)); }
  // the ID card and the photo drop onto the counter (4.9, 5.3); a stamp comes down on each (5.6, 6.2); a gold ring at 6.6
  const card = a > 4.85 ? at(TX - 150, G0 - 200 - 260 * (1 - spring(a - 4.85, 10, 14)), idCard(), 0.9, -4) : "";
  const ph = a > 5.3 ? at(TX + 130, G0 - 214 - 260 * (1 - spring(a - 5.3, 10, 14)), photo(), 0.8, 5) : "";
  const stp = (x, t0) => { if (a < t0 - 0.4 || a > t0 + 0.6) return ""; const down = a < t0 ? -140 * (1 - ease(seg(a, t0 - 0.4, t0))) : -140 * ease(seg(a, t0 + 0.15, t0 + 0.55)); return at(x, G0 - 230 + down, stamp(1), 0.8); };
  const ink = (x, t0) => (a > t0 ? at(x, G0 - 168, `<circle r="34" fill="none" stroke="${P.red}" stroke-width="7" opacity=".85"/><path d="M-16 0l10 12l22 -24" fill="none" stroke="${P.red}" stroke-width="7" stroke-linecap="round"/>`, pop(a - t0), -12) : "");
  const ring = a > 6.55 ? rings(TX - 10, G0 - 210, 200 + 30 * Math.sin((a - 6.55) * 5), P.gold, 0.14 * seg(a, 6.55, 6.9)) : "";
  const g = night(c, tot, 5) + town(c) + layer(ground(G0) + ring + blue + tw + counter + fly + card + ph + ink(TX - 120, 5.6) + ink(TX + 140, 6.2) + stp(TX - 120, 5.6) + stp(TX + 140, 6.2), c);
  return { g, out: toScreen(c, TX - 150, G0 - 200), outC: P.cream, outZ: 18 };
}

// ---- 1: person to person, straight over the fence ----
function s1(a, tot) {
  const G = 860, c = camAt(a, [[0, 960, 560, 1.15], [1.62, 960, 560, 1.18]]);
  const fence = Array.from({ length: 9 }, (_, i) => `<path d="${rr(900 + (i - 4) * 40, G - 150, 22, 150, 6)}" fill="${P.woodD}"/>`).join("") + `<path d="${rr(720, G - 120, 480, 14, 6)}" fill="${P.wood}"/>`;
  const p = seg(a, 0.25, 1.0), b = bez([620, G - 300], [960, G - 560], [1300, G - 300], ease(p)), land = a > 1.0 ? 1 + 0.25 * Math.exp(-(a - 1.0) * 9) * Math.cos((a - 1.0) * 16) : 1;
  const coinG = at(b[0], b[1], rings(0, 0, 60, P.gold, 0.22) + coin(44, "B"), land);
  const g = night(c, tot, 9) + town(c, 23) + layer(ground(G) + at(560, G, house(P.blue, P.blueD), 1.15) + at(1360, G, house(P.pink, P.pinkD, { lit: [1, 1, a > 1.0 ? 1 : 0] }), 1.15) + fence + coinG, c);
  return { g, in: toScreen(c, 620, G - 300), inC: P.cream, inZ: 18, out: toScreen(c, 1300, G - 300), outC: P.gold, outZ: 18 };
}

// ---- 2–6: the phone and the paper slip with the address ----
const PH = [1180, 600], SL = [560, 560];
const desk = (c) => `<rect x="-1200" y="840" width="4400" height="900" fill="#3a2470"/><path d="M-1200 840h4400" stroke="#4b3190" stroke-width="16"/>`;
// the paper slip with the pink house's address
const addrSlip = (hl = 0) => `${two(rr(-300, -90, 600, 180, 14), P.cream, P.creamD, 0, 8)}<circle cx="-246" cy="-40" r="20" fill="${P.pink}"/><path d="M-216 -40h90" stroke="#c9b48a" stroke-width="10" stroke-linecap="round"/>
  ${hl > 0 ? `<path d="${rr(-276, 4, 552 * hl, 60, 10)}" fill="#9fe7ff" opacity=".6"/>` : ""}${codeText(0, 50, CODE, 50, P.ink)}`;
// the phone: a send screen with a code field; `code` the text in it (shown chars), `codeFill`, `extra` drawn on screen
const sendScreen = (code, o = {}) => `<path d="${rr(-74, -140, 148, 40, 10)}" fill="${o.head || P.violet}"/>${text(0, -112, "SEND", 26, "#fff")}
  <path d="${rr(-74, -82, 148, 64, 10)}" fill="#fff"/>${code ? codeText(-66, -40, code.slice(0, 9), 24, o.codeFill || P.ink, { anchor: "start" }) : ""}
  ${at(0, 40, coin(34, "B"))}<path d="${rr(-60, 96, 120, 36, 18)}" fill="${o.btn || P.green}"/>${o.extra || ""}`;
const phone = (inner, k = 1.3) => at(PH[0], PH[1], hotPhone({ inner }), k);
function s2(a, tot) {
  const c = camAt(a, [[0, 870, 560, 1.18], [2.4, 890, 560, 1.2], [3.3, 960, 600, 1.12], [4.41, 980, 600, 1.12]]);
  const hl = ease(seg(a, 0.75, 1.35));
  // the copy floats from the slip to the phone (1.4–2.0)
  const cp = seg(a, 1.4, 2.0), fly = cp > 0 && cp < 1 ? at(...bez([SL[0], SL[1] + 50], [880, 280], [PH[0], PH[1] - 50], ease(cp)), `<path d="${rr(-150, -24, 300, 48, 10)}" fill="#9fe7ff" opacity=".85"/>${codeText(0, 14, CODE.slice(0, 10) + "…", 30, P.ink)}`, lerp(1, 0.5, cp)) : "";
  const typed = cp >= 1 ? CODE.slice(0, Math.round(lerp(4, 9, seg(a, 2.0, 2.3)))) : "";
  // the long line: the code keeps unrolling out of the phone (2.6–3.9)
  const un = ease(seg(a, 2.55, 3.9)), longStr = (CODE + "0a7d93kq5x2v8mfe7").slice(0, Math.round(lerp(16, 33, un)));
  const ribbon = un > 0 ? at(PH[0] - 120, 900 - 8, `<path d="${rr(-30, -40, 30 + 30 * longStr.length, 80, 16)}" fill="${P.cream}"/>${codeText(0, 18, longStr, 46, P.ink, { anchor: "start" })}`, 1) : "";
  const g = night(c, tot, 12) + layer(desk(c) + at(SL[0], SL[1], addrSlip(hl), 1.05, -3) + phone(sendScreen(typed)) + fly + (un > 0 ? `<g transform="translate(${-420 * un} 0)">${ribbon}</g>` : ""), c);
  return { g, in: [960, 540], inC: P.gold, inZ: 18 };
}
// shots 3 and 4: the camera rises from the phone to the page being written
const PG = [1180, -240];
const pageRows = (n) => [["teal", "violet", "5"], ["violet", "blue", "12"], ["blue", "pink", "30"], ["pink", "teal", "7"], ["teal", "blue", "2"], ["violet", "pink", "9"]].slice(0, n);
function s3(a, tot) {
  const c = camAt(a, [[0, 1100, 560, 1.0], [0.45, 1120, 400, 0.9], [1.4, 1170, -120, 0.95], [1.84, 1175, -170, 0.98]]);
  const fp = seg(a, 0.4, 1.15), b = bez([PH[0] + 60, PH[1] + 40], [1500, 120], [PG[0] + 126, PG[1] + 84], ease(fp));
  const fee = fp > 0 ? at(b[0], b[1], rings(0, 0, 40, P.gold, 0.2) + coin(24, ""), fp < 1 ? 1 : pop(a - 1.15) * 0 + 1) : "";
  const pg = at(PG[0], PG[1], page({ rows: pageRows(2), block: 0 }) + (fp >= 1 ? at(90, 60, coin(24, "")) : ""), 1.4);
  const g = night(c, tot, 12) + layer(desk(c) + at(SL[0], SL[1], addrSlip(1), 1.05, -3) + phone(sendScreen(CODE, { btn: a > 0.3 ? P.gold : P.green })) + pg + (fp < 1 ? fee : ""), c);
  return { g };
}
function s4(a, tot) {
  const c = camAt(a, [[0, 1175, -170, 0.98], [1.44, 1180, -220, 1.4]]);
  const n = 2 + Math.round(4 * ease(seg(a, 0.1, 0.6))), ours = 2;
  const pg = at(PG[0], PG[1], page({ rows: pageRows(n).map((r, i) => (i === ours ? [r[0], r[1], r[2], P.goldD] : r)), seal: 31, sealP: seg(a, 0.6, 1.1), block: ease(seg(a, 0.75, 1.1)) }) + at(90, 60, coin(24, "")), 1.4);
  const glow = a > 0.3 ? rings(PG[0], PG[1] + 1.4 * (-74 + ours * 38), 160, P.gold, 0.18 * seg(a, 0.3, 0.6)) : "";
  const g = night(c, tot, 12) + layer(desk(c) + phone(sendScreen(CODE)) + glow + pg, c);
  return { g, out: toScreen(c, PG[0], PG[1]), outC: P.cream, outZ: 18 };
}
// ---- 5: no way back: one wrong character, the coin is gone, no one to complain to ----
function s5(a, tot) {
  const c = camAt(a, [[0, 860, 380, 1.5], [1.6, 870, 390, 1.5], [2.4, 800, 600, 1.12], [4.08, 790, 600, 1.12]]);
  const flip = seg(a, 0.8, 1.2), shown = flip > 0.5 ? WRONG : CODE;
  // the big code over the scene, with its last character flipping red
  const big = at(860, 330, `<path d="${rr(-470, -60, 940, 110, 20)}" fill="${P.cream}"/>${codeText(-30, 30, shown.slice(0, -1), 64, P.ink)}${at(410, 30, text(0, 0, shown.slice(-1), 64, flip > 0.5 ? P.red : P.ink), [1, Math.abs(Math.cos(Math.PI * flip))])}${flip >= 1 ? rings(410, 6, 46, P.red, 0.25) : ""}`, 1);
  // the coin leaves the pink house's direction and flies to a dark house with no lights (2.0–2.6)
  const G = 880, cp = seg(a, 2.0, 2.65), b = bez([860, 470], [700, 300], [330, G - 300], ease(cp));
  const coinG = cp < 1 ? at(b[0], b[1], rings(0, 0, 50, P.gold, 0.2) + coin(40, "B"), 1) : "";
  const dark = at(330, G, house("#3d3a5c", "#2c2a48", { lit: [0, 0, 0], roof: "#1d1a33" }), 1.1) + (cp >= 1 ? at(330, G - 150, `<circle r="30" fill="${P.ink}"/>${text(0, 14, "?", 44, "#6d6a9a")}`, pop(a - 2.65)) : "");
  const pink = at(1180, G, house(P.pink, P.pinkD, { lit: [1, 1, 0] }), 1.0);
  // the complaints window: a counter with a bell; its shutter slams down at 3.15
  const sh = ease(seg(a, 3.1, 3.4)), bump = a > 3.4 ? 6 * Math.exp(-(a - 3.4) * 10) * Math.sin((a - 3.4) * 50) : 0;
  const win = at(820, G, `${two(rr(-150, -330, 300, 330, 12), "#5a6aa8", "#44529a", 0, 10)}<path d="${rr(-110, -290, 220, 170, 8)}" fill="${P.win}"/>${disc(0, -150, 18, P.gold, P.goldD)}
    <path d="${rr(-114, -294, 228, 178 * sh, 4)}" fill="${P.steel}"/>${sh > 0 ? Array.from({ length: Math.floor(8 * sh) }, (_, i) => `<path d="M-114 ${-294 + 22 * (i + 1)}h228" stroke="${P.steelD}" stroke-width="5"/>`).join("") : ""}<path d="${rr(-170, -120, 340, 26, 8)}" fill="${P.wood}"/>`, a > 2.6 ? pop(a - 2.6) : 0, 0);
  const g = night(c, tot, 14) + town(c, 41) + layer(ground(G) + dark + pink + `<g transform="translate(0 ${bump.toFixed(1)})">${win}</g>` + coinG + big, c);
  return { g, in: [960, 300], inC: P.cream, inZ: 18 };
}
// ---- 6: the clipboard bug, and checking the first and last characters (host left) ----
function s6(a, tot) {
  const c = camAt(a, [[0, 1220, 540, 1.15], [1.6, 1220, 520, 1.25], [4.2, 1220, 420, 1.3], [7.63, 1220, 420, 1.3]]);
  // the bug crawls in from the right to the phone's code field (0.6–1.9), then the code flips to the thief's (1.95–2.6)
  const bp = seg(a, 0.6, 1.9), bx = lerp(1900, PH[0] + 40, ease(bp)), by = PH[1] - 60 * 1.3 + 30 * Math.sin(bp * 12), gone = seg(a, 2.7, 3.1);
  const swapped = a > 1.95, cf = seg(a, 1.95, 2.5), shown = swapped ? THIEF : CODE;
  const bugG = bp > 0 && gone < 1 ? at(bx, by, bug(tot), 1.4 * (1 - gone), 180) : "";
  // the thief's house: a mask over a dark house appears at the code's other end (3.4)
  const G = 880, thief = at(1640, G, house("#3d3a5c", "#2c2a48", { lit: [0, 0, 0], roof: "#1d1a33" }) + at(0, -110, `<path d="M-90 -10Q-80 -36 -40 -30Q0 -24 0 -8Q0 -24 40 -30Q80 -36 90 -10Q80 24 40 20Q10 18 0 4Q-10 18 -40 20Q-80 24 -90 -10Z" fill="${P.ink}"/><ellipse cx="-44" cy="-6" rx="18" ry="12" fill="${P.red}"/><ellipse cx="44" cy="-6" rx="18" ry="12" fill="${P.red}"/>`), 0.8 * pop(a - 3.4));
  // the code shown big over the phone; the magnifier checks the first four (4.4–5.3) and the last four (5.6–6.4)
  const BX = 1220, BY = 190, w = 940, chars = shown.split(""), n = chars.length, cw = 54;
  const first = seg(a, 4.4, 5.2), last = seg(a, 5.6, 6.4), fixed = a > 6.8;
  const str = fixed ? CODE : shown;
  let codeRow = `<path d="${rr(-w / 2, -66, w, 116, 20)}" fill="${P.cream}"/>`;
  str.split("").forEach((ch, i) => { const x = (i - (n - 1) / 2) * cw, edge = i < 4 || i >= n - 4, bad = swapped && !fixed && i >= 4 && ch !== CODE[i];
    const lit = (i < 4 && first > 0 && first < 1) || (i >= n - 4 && last > 0 && last < 1);
    codeRow += (edge && (first > 0) ? `<path d="${rr(x - cw / 2 + 2, -56, cw - 4, 96, 8)}" fill="${lit ? "#ffe8a0" : i >= n - 4 && last <= 0 ? "none" : (str.slice(-4) !== CODE.slice(-4) && i >= n - 4 && last >= 1 ? "#ffd3d8" : "#d6f5e3")}"/>` : "")
      + text(x, 24, ch, 60, bad && cf > 0.5 ? P.red : P.ink); });
  const glass = first > 0 && last < 1 ? at(BX + (last > 0 ? lerp(4.5 * cw, 7.5 * cw, ease(last)) : lerp(-7.5 * cw, -4.5 * cw, ease(first))), BY - 10, `<circle r="70" fill="#cfe9ff" opacity=".25" stroke="${P.steel}" stroke-width="14"/><path d="M50 50l70 70" stroke="${P.wood}" stroke-width="22" stroke-linecap="round"/>`) : "";
  const verdict = (a > 6.45 && !fixed ? cross(BX + w / 2 + 60, BY - 6, 44, P.red, a - 6.45) : "") + (fixed ? check(BX + w / 2 + 60, BY - 6, 44, P.green, a - 6.8) : "");
  const row = at(BX, BY, codeRow, swapped && !fixed ? 1 + 0.04 * Math.exp(-(a - 1.95) * 6) : 1);
  const g = night(c, tot, 16) + layer(desk(c) + thief + phone(sendScreen(fixed ? CODE : shown, { codeFill: swapped && !fixed ? P.red : P.ink })) + bugG + row + glass + verdict, c);
  return { g };
}
// ---- 7–9: the company, the $2,000 transfer, the $500,000 fee, given back ----
const CT = [430, 900], fmt = (v) => "$" + Math.round(v).toLocaleString("en");
const pile = (n, k = 1) => { let g = ""; for (let i = 0; i < n; i++) { const row = Math.floor(Math.sqrt(i * 2)), x = (i - row * (row + 1) / 2) * 52 - row * 26, y = -row * 40; g += at(x, y - 30, `<ellipse rx="40" ry="16" fill="${P.goldD}"/><ellipse cy="-8" rx="40" ry="16" fill="${P.gold}"/>`); } return at(0, 0, g, k); };
function s7(a, tot) {
  const c = camAt(a, [[0, 820, 600, 1.1], [3.42, 860, 600, 1.14]]);
  const cal = at(1480, 260, calPage("2023", "SEP", 1, 150), 0.95 * pop(a - 0.25), 6);
  const tw = at(CT[0], CT[1], tower({ h: 700, c: "#5a3a9a", cD: "#44297c", seed: 4 }), 0.95);
  const go = seg(a, 2.1, 2.9), px = lerp(CT[0] + 220, 1000, ease(go));
  const small = a > 1.9 ? at(px, 840, pile(3, 2.0), pop(a - 1.9)) + (a > 2.5 ? at(px, 640, `<path d="${rr(-170, -56, 340, 100, 18)}" fill="${P.ink}"/>${text(0, 24, "$2,000", 70, P.green)}`, pop(a - 2.5)) : "") : "";
  const arrow = a > 2.1 ? drawn(`M${CT[0] + 200} 900L1300 900`, ease(seg(a, 2.1, 2.9)), P.cream, 10, 'stroke-dasharray="20 18" opacity=".5"') : "";
  const g = night(c, tot, 18) + town(c, 61) + layer(ground(CT[1]) + arrow + tw + small + cal, c);
  return { g, in: toScreen(c, CT[0], CT[1] - 400), inC: "#5a3a9a", inZ: 14 };
}
function s8(a, tot) {
  const c = camAt(a, [[0, 1040, 560, 1.28], [3.01, 1060, 540, 1.22]]);
  const v = lerp(2000, 500000, easeIn(seg(a, 0.55, 1.9))), grow = seg(a, 0.55, 1.9), slam = a > 2.3 ? 1 : 0.25 * grow;
  const tilt = kf(a, [[0, 0], [0.5, 0], [1.9, 0.4], [2.3, 0.4], [2.55, 1.0]], ease);
  const bal = at(1060, 960, balance(tilt, pile(3, 0.9), pile(Math.round(lerp(3, 21, grow)), 0.9)), 0.95);
  const labels = at(1060 - 330, 330, `<path d="${rr(-130, -40, 260, 70, 14)}" fill="${P.ink}"/>${text(0, 16, "$2,000", 44, P.green)}`, 1.3) + (a > 0.5 ? at(1060 + 330, 250 + 140 * ease(seg(a, 2.3, 2.55)), `<path d="${rr(-190, -48, 380, 84, 16)}" fill="${P.ink}"/>${text(0, 20, fmt(v), 56, P.red)}`, 1.3 * pop(a - 0.5)) : "");
  const oops = a > 2.35 ? rings(1060 + 330, 700, 220 * spring(a - 2.35, 7, 10), P.red, 0.25 * (1 - seg(a, 2.5, 3.0))) : "";
  const tw = at(CT[0] + 40, CT[1], tower({ h: 700, c: "#5a3a9a", cD: "#44297c", seed: 4 }), 0.8);
  const g = night(c, tot, 18) + town(c, 61) + layer(ground(CT[1]) + tw + oops + bal + labels, c);
  return { g, out: toScreen(c, 1060 + 330, 700), outC: P.gold, outZ: 16 };
}
function s9(a, tot) {
  const G = 900, WH = [1320, G], c = camAt(a, [[0, 1060, 640, 1.12], [3.22, 1060, 640, 1.16]]);
  const bow = a > 1.5 ? 6 * Math.sin(Math.PI * seg(a, 1.5, 2.2)) : 0;
  const wh = at(WH[0], WH[1], `<g transform="rotate(${(-bow).toFixed(2)} -400 0)">${warehouse(800, { spin: tot * 6, t: tot, heat: 0.6 })}</g>`, 0.85);
  // the heap flies back from the warehouse to the company tower (0.4–1.2)
  const fp = seg(a, 0.4, 1.2), b = bez([WH[0] - 100, G - 360], [900, 120], [560, G - 300], ease(fp));
  const heap = fp < 1 ? at(b[0], b[1], pile(18, 0.9), 1) : at(560, G - 150, pile(18, 0.9));
  const tw = at(400, G, tower({ h: 640, c: "#5a3a9a", cD: "#44297c", seed: 4, lit: fp >= 1 ? 1 : 0.6 }), 0.8);
  const hrt = a > 1.65 ? at(WH[0] - 120, G - 430 - 40 * seg(a, 1.65, 3.2), heart(P.pink), pop(a - 1.65) * 1.3) : "";
  // the courthouse stays dark and gets crossed out (2.2–2.7): no law made them do it
  const court = a > 2.0 ? at(880, G, `<path d="M-160 -230L0 -300L160 -230Z" fill="#4a4a78"/>${[-120, -60, 0, 60, 120].map((x) => `<path d="${rr(x - 16, -226, 32, 196, 4)}" fill="#5a5a8a"/>`).join("")}<path d="${rr(-180, -34, 360, 34, 6)}" fill="#3a3a66"/>`, 1.0 * pop(a - 2.0)) + (a > 2.4 ? cross(880, G - 380, 50, P.red, a - 2.4) : "") : "";
  const g = night(c, tot, 21) + town(c, 71) + layer(ground(G) + tw + heap + court + wh + hrt, c);
  return { g };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];
export const c3useSet = makeSet(SHOTS, V, P);
