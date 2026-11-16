// Science part 3, first sets: intro (s3intro), the weathervane (vane), Semmelweis and handwashing (semmel).
// The deaths of new mothers are shown only as numbers and emptied beds, never people suffering.
//  s3intro 0 1847: a hospital front in Vienna; a young doctor beside a basin; water ripples
//          1 two bars, 18 and 2: the tall one shrinks to the short one as the basin glows
//          2 the basin is carried off (✗) and the doctor walks out through the door, smaller and smaller. Host right.
//          3 a weathervane spinning with an egg on it: ✓ ✗ ✓ ✗
//          4 a scale: a flask on one pan, a "?" on the other, rocking. Host left.
//  vane    0 a stone bust on a plinth, a cobweb grows: never changes its mind
//          1 a scientist at a crossroads: a card of evidence arrives and his arrow turns to follow it, ✓. Host right.
//          2 a press prints papers, each one stamped with a big full stop (the last word)
//          3 the weathervane spins: an egg ✓, an egg ✗, a cup ✓, a cup ✗
//          4 a map being drawn: the pen steps along and corrects the coastline line by line. Host right.
//  semmel  0 the hospital again, nameplate "Ignaz Semmelweis"; a lamp in one window
//          1 two ward doors: a doctor in blue by one, a midwife in pink by the other
//          2 behind the doctors' door many beds empty out; behind the midwives' only one. Host right.
//          3 a dissection table under a sheet, a scalpel; a portrait with a black ribbon (the colleague)
//          4 a dotted path from the dissection room to the delivery room; hands with faint violet dots. Host right.
//          5 the hands wash in a basin of chlorine water; the dots dissolve
//          6 three bars fall in turn, 18 → 2 → 1, with calendar pages 4, 6, 7
//          7 doctors frown; the basin tips over, ✗. Host right.
//          8 the rule's paper tears; footprints lead away from Vienna's front
//          9 a microscope; germs appear in its lens; a framed portrait with a candle beside it. Host right.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, mix, pop, dur, paperBg, room, microscope, germ, tapSoap, flask, magnifier } from "./sci.js";
import { newspaper } from "./sci2.js";
import { bed, hospital, figure, basin, hands, bar, vane, egg, cup, mapSheet, pen, bust } from "./sci3.js";

const floor = (G, c = P.floor) => `<rect x="-800" y="${G}" width="3600" height="600" fill="${c}"/>`;
const scale = (tilt, l, r) => `<path d="M0 0V-300" stroke="${P.ink}" stroke-width="12"/>${two("M-90 0H90L70 -30H-70Z", P.steel, P.steelD, 0, 0)}<g transform="translate(0 -300) rotate(${tilt.toFixed(1)})"><path d="M-260 0H260" stroke="${P.ink}" stroke-width="10"/>
  ${[-1, 1].map((sd) => `<g transform="translate(${sd * 240} 0) rotate(${(-tilt).toFixed(1)})"><path d="M0 0L-70 120M0 0L70 120" stroke="${P.ink}" stroke-width="5"/><path d="M-90 120H90Q80 150 0 150Q-80 150 -90 120Z" fill="${P.steel}"/>${at(0, 118, sd < 0 ? l : r)}</g>`).join("")}</g>`;
const qmark = (k = 1) => at(0, 0, `<circle r="60" fill="${P.ink}"/>${text(0, 30, "?", 90, P.gold)}`, k);

// ================= intro =================
function i0(a, tot, s) { const D = dur(s, 0, 5.5), c = camAt(a, [[0, 960, 560, 0.92], [D, 960, 600, 1.02]]), G = 900;
  return { g: paperBg(c, tot) + layer(floor(G) + at(960, G, hospital(), 1, 0) + at(380, 300, calPage("1847", "", 0.8), pop(a - 0.2)) + at(640, G, figure(P.blue, P.blueD), 0.9 * pop(a - 1.0)) + at(1280, G, basin(tot, seg(a, D * 0.6, D * 0.8)), pop(a - 1.6)), c) }; }
function i1(a, tot, s) { const D = dur(s, 1, 6.5), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.04]]), G = 860, p = ease(seg(a, D * 0.35, D * 0.75));
  return { g: paperBg(c, tot) + layer(floor(G) + at(700, G, bar(lerp(540, 60, p), mix(P.coral, P.green, p), String(Math.round(lerp(18, 2, p))) + "%", 80)) + at(1220, G, basin(tot, p), 1.1 * pop(a - 0.3)), c) }; }
function i2(a, tot, s) { const D = dur(s, 2, 4.5), c = camAt(a, [[0, 900, 560, 0.95], [D, 900, 580, 1.0]]), G = 900, go = ease(seg(a, D * 0.35, D * 0.95)), off = ease(seg(a, 0.3, 1.0));
  return { g: paperBg(c, tot) + layer(floor(G) + at(900, G, hospital()) + at(lerp(1240, 1700, off), G + 30 * off, basin(tot), 1, 30 * off) + (a > 0.9 ? cross(1240, 520, 46, P.red, a - 0.9) : "") + at(lerp(700, 900, go), G - 10 * go, figure(P.blue, P.blueD), lerp(0.9, 0.35, go)), c) }; }
function i3(a, tot, s) { const D = dur(s, 3, 3.8), c = camAt(a, [[0, 960, 520, 1.0], [D, 960, 520, 1.05]]), r = a * 420, flip = Math.floor(r / 180) % 2;
  return { g: paperBg(c, tot) + layer(floor(900) + at(960, 900, vane(r % 360, egg(0.6))) + (flip ? cross(1420, 330, 50, P.red, 1) : check(1420, 330, 50, P.green, 1)), c) }; }
function i4(a, tot, s) { const D = dur(s, 4, 5.5), c = camAt(a, [[0, 1040, 540, 1.0], [D, 1040, 540, 1.04]]), tilt = 12 * Math.sin(a * 2.2) * Math.exp(-a * 0.15);
  return { g: paperBg(c, tot) + layer(floor(900) + at(1100, 880, scale(tilt, at(0, -10, flask(P.mint), 0.6), at(0, -70, qmark(0.9))), 1.2 * pop(a - 0.1)), c) }; }
export const s3introSet = makeSet([i0, i1, i2, i3, i4], [], P);

// ================= the weathervane =================
function v0(a, tot, s) { const D = dur(s, 0, 4), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 520, 1.1]]);
  return { g: paperBg(c, tot) + layer(floor(900) + at(960, 900, bust(seg(a, D * 0.4, D * 0.9)), 1.05), c) }; }
function v1(a, tot, s) { const D = dur(s, 1, 6), c = camAt(a, [[0, 800, 560, 1.0], [D, 800, 560, 1.04]]), G = 900, turn = ease(seg(a, D * 0.5, D * 0.75));
  const signpost = `<path d="M0 0V-360" stroke="${P.woodD}" stroke-width="18"/>${at(0, -320, `${two("M-160 -36H120L160 0L120 36H-160Z", P.gold, P.goldD, 0, 6)}`, 1, lerp(0, -40, turn))}`;
  const ev = a > D * 0.25 ? at(lerp(1500, 1060, easeOut(seg(a, D * 0.25, D * 0.45))), 380, `${two(rr(-80, -100, 160, 200, 12), "#fffaf0", P.creamD, 6, 6)}${magnifier(40, "", "v1m")}`, 0.9) : "";
  return { g: paperBg(c, tot) + layer(floor(G) + at(760, G, signpost) + at(560, G, figure(P.blue, P.blueD), 1) + ev + (a > D * 0.8 ? check(560, 560, 48, P.green, a - D * 0.8) : ""), c), out: [560, 640], outC: P.gold }; }
function v2(a, tot, s) { const D = dur(s, 2, 4.5), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.04]]), G = 880;
  const press = `${two(rr(-200, -320, 400, 320, 12), P.steel, P.steelD, 0, 8)}${two(rr(-160, -420, 320, 100, 10), P.steelD, "#5d6478", 0, 0)}<circle cx="${-60}" cy="-370" r="34" fill="${P.ink}"/><circle cx="60" cy="-370" r="34" fill="${P.ink}"/>`;
  const papers = Array.from({ length: 5 }, (_, i) => { const t0 = 0.6 + i * D * 0.14, p = easeOut(seg(a, t0, t0 + 0.6)); if (p <= 0) return ""; return at(lerp(860, 1180 + i * 130, p), lerp(600, 480 - (i % 2) * 60, p), newspaper(`<circle r="40" fill="${P.ink}"/>`, 0.55), 1, lerp(0, -8 + i * 4, p)); }).join("");
  return { g: paperBg(c, tot) + layer(floor(G) + at(700, G, press) + papers, c) }; }
function v3(a, tot, s) { const D = dur(s, 3, 6), c = camAt(a, [[0, 960, 520, 1.0], [D, 960, 520, 1.04]]), n = Math.min(3, Math.floor(a / (D / 4)));
  const rider = n < 2 ? egg(0.6) : at(0, 30, cup(1, tot), 0.55), good = n % 2 === 0, r = a * 360;
  return { g: paperBg(c, tot) + layer(floor(900) + at(960, 900, vane(r % 360, rider)) + (good ? check(1420, 330, 50, P.green, 1) : cross(1420, 330, 50, P.red, 1)), c) }; }
function v4(a, tot, s) { const D = dur(s, 4, 7), c = camAt(a, [[0, 820, 540, 1.0], [D, 820, 540, 1.06]]), fix = seg(a, D * 0.3, D * 0.9);
  const steps = Array.from({ length: 6 }, (_, i) => (fix > i / 6 ? `<circle cx="${560 + i * 104}" cy="760" r="10" fill="${P.ink}" opacity=".5"/>` : "")).join("");
  return { g: paperBg(c, tot) + layer(at(820, 520, mapSheet(1, fix), 1.2) + steps + at(lerp(520, 1120, fix), lerp(420, 520, fix), pen()), c) }; }
export const vaneSet = makeSet([v0, v1, v2, v3, v4], [], P);

// ================= Semmelweis =================
const wardDoor = (c, cD) => `${two(rr(-150, -420, 300, 420, 8), c, cD, 0, 0)}<path d="${rr(-110, -380, 220, 380, 6)}" fill="${mix(c, "#000", 0.35)}"/>`;
function m0(a, tot, s) { const D = dur(s, 0, 4), c = camAt(a, [[0, 960, 560, 0.95], [D, 960, 560, 1.02]]), G = 900;
  const plate = at(960, G - 600, `${two(rr(-230, -44, 460, 88, 10), P.gold, P.goldD, 0, 6)}${text(0, 22, "Ignaz Semmelweis", 46, "#5a3a00")}`, pop(a - 1.0));
  return { g: paperBg(c, tot) + layer(floor(G) + at(960, G, hospital()) + plate + at(560, G, figure(P.blue, P.blueD), 0.9 * pop(a - 1.4)), c) }; }
function m1(a, tot, s) { const D = dur(s, 1, 5), c = camAt(a, [[0, 960, 560, 1.0], [D, 960, 560, 1.04]]), G = 900;
  return { g: `<rect width="${FW}" height="${FH}" fill="${P.wall}"/>` + layer(floor(G) + at(640, G, wardDoor(P.blue, P.blueD)) + at(1280, G, wardDoor(P.pink, P.pinkD)) + at(400, G, figure(P.blue, P.blueD), 0.85 * pop(a - 0.8)) + at(1520, G, figure(P.pink, P.pinkD), 0.85 * pop(a - 1.6)), c) }; }
function m2(a, tot, s) { const D = dur(s, 2, 7), c = camAt(a, [[0, 820, 560, 1.0], [D, 820, 560, 1.03]]), G = 860;
  const beds = (x, n, emptyN) => Array.from({ length: 6 }, (_, i) => at(x + (i % 2) * 340, G - 40 - Math.floor(i / 2) * 170, bed(i < emptyN ? seg(a, D * 0.25 + i * D * 0.08, D * 0.35 + i * D * 0.08) : 0), 0.8)).join("");
  return { g: `<rect width="${FW}" height="${FH}" fill="${P.wall}"/>` + layer(floor(G) + `<path d="M820 200V${G}" stroke="${P.creamD}" stroke-width="14"/>` + at(200, 0, beds(0, 6, 5)) + at(960, 0, beds(0, 6, 1)) + at(380, 180, `<circle r="40" fill="${P.blue}"/>`, pop(a - 0.3)) + at(1140, 180, `<circle r="40" fill="${P.pink}"/>`, pop(a - 0.5)), c) }; }
function m3(a, tot, s) { const D = dur(s, 3, 6.5), c = camAt(a, [[0, 900, 560, 1.0], [D, 900, 560, 1.04]]), G = 880;
  const table = `${two(rr(-260, -150, 520, 40, 6), P.steel, P.steelD, 0, 6)}<path d="M-220 -110V0M220 -110V0" stroke="${P.steelD}" stroke-width="16"/><path d="M-250 -150Q-200 -230 0 -230Q200 -230 250 -150Z" fill="#f2f6ff"/>`;
  const knife = `<path d="M0 0L120 -10L130 0L120 10Z" fill="#dfe6f2"/><path d="${rr(-90, -9, 90, 18, 6)}" fill="${P.woodD}"/>`;
  const portrait = `${two(rr(-110, -140, 220, 280, 10), P.wood, P.woodD, 0, 8)}<path d="${rr(-86, -116, 172, 232, 6)}" fill="#e9dcc4"/>${at(0, 80, figure("#6a6a7a", "#55556a"), 0.6)}<path d="M60 -140L110 -140L110 -90Z" fill="${P.ink}"/>`;
  return { g: `<rect width="${FW}" height="${FH}" fill="${P.wall}"/>` + layer(floor(G) + at(640, G, table) + at(900, G - 190, knife, pop(a - 0.6)) + (a > D * 0.4 ? at(1340, 420, portrait, pop(a - D * 0.4)) : ""), c) }; }
function m4(a, tot, s) { const D = dur(s, 4, 7), c = camAt(a, [[0, 820, 560, 1.0], [D, 820, 560, 1.05]]), G = 880, path = seg(a, 0.3, D * 0.4);
  return { g: `<rect width="${FW}" height="${FH}" fill="${P.wall}"/>` + layer(floor(G) + at(260, G, wardDoor("#7a7a8a", "#5f5f70"), 0.8) + at(1260, G, wardDoor(P.blue, P.blueD), 0.8) + drawn("M380 560Q780 300 1140 560", path, P.ink, 10, 'stroke-dasharray="0.02 0.02"') + (a > D * 0.45 ? at(760, 780, hands(seg(a, D * 0.55, D * 0.8)), pop(a - D * 0.45)) : ""), c) }; }
function m5(a, tot, s) { const D = dur(s, 5, 5), c = camAt(a, [[0, 960, 600, 1.0], [D, 960, 600, 1.06]]), wash = seg(a, D * 0.3, D * 0.85), bob = 30 * Math.sin(a * 6) * (wash > 0 && wash < 1 ? 1 : 0);
  return { g: `<rect width="${FW}" height="${FH}" fill="${P.wall}"/>` + layer(floor(900) + at(960, 900, basin(tot, wash), 1.6) + at(960, 520 + bob + 120 * ease(seg(a, 0.2, D * 0.3)), hands(1, wash), 1.0), c) }; }
function m6(a, tot, s) { const D = dur(s, 6, 10), c = camAt(a, [[0, 960, 540, 1.0], [D, 960, 540, 1.03]]), G = 860;
  const vals = [[18, 0.1], [2, 0.42], [1, 0.72]], mo = ["4", "6", "7"];
  const bars = vals.map(([v, t], i) => (a > D * t ? at(560 + i * 400, G, bar(v * 30, i ? P.green : P.coral, v + "%", 76), 1, 0) + at(560 + i * 400, G + 110, calPage(mo[i], "1847", 0.38), pop(a - D * t)) : "")).join("");
  return { g: paperBg(c, tot) + layer(floor(G) + bars, c) }; }
function m7(a, tot, s) { const D = dur(s, 7, 6), c = camAt(a, [[0, 820, 560, 1.0], [D, 820, 560, 1.04]]), G = 900, tip = ease(seg(a, D * 0.55, D * 0.75));
  return { g: `<rect width="${FW}" height="${FH}" fill="${P.wall}"/>` + layer(floor(G) + [0, 1, 2].map((i) => at(380 + i * 220, G, figure(P.blue, P.blueD, -1), 0.85 * pop(a - 0.2 - i * 0.2))).join("") + at(1100, G, basin(tot), 1, 80 * tip) + (tip > 0.5 ? cross(1100, 560, 50, P.red, a - D * 0.7) : ""), c) }; }
function m8(a, tot, s) { const D = dur(s, 8, 6), c = camAt(a, [[0, 960, 560, 0.95], [D, 1100, 580, 1.0]]), G = 900, tear = ease(seg(a, 0.4, 1.2)), go = seg(a, D * 0.45, D * 0.95);
  const sheet = (sd) => at(sd * 40 * tear, 0, `<path d="${sd < 0 ? "M-120 -160H0L-14 -80L10 0L-12 80L0 160H-120Z" : "M0 -160H120V160H0L-12 80L10 0L-14 -80Z"}" fill="#fffaf0" stroke="${P.creamD}" stroke-width="6"/>`, 1, sd * 8 * tear);
  const steps = Array.from({ length: 10 }, (_, i) => (go > i / 10 ? `<ellipse cx="${1100 + i * 90}" cy="${G + 30 + (i % 2 ? 14 : -14)}" rx="16" ry="10" fill="${P.ink}" opacity=".45"/>` : "")).join("");
  return { g: paperBg(c, tot) + layer(floor(G) + at(700, G, hospital(), 0.8) + at(1300, 440, sheet(-1) + sheet(1), pop(a - 0.1)) + steps, c) }; }
function m9(a, tot, s) { const D = dur(s, 9, 8), c = camAt(a, [[0, 820, 540, 1.0], [D, 820, 540, 1.04]]), G = 880;
  const lens = a > D * 0.2 ? at(820, 420, `<circle r="200" fill="#e9f6ff" stroke="${P.ink}" stroke-width="14"/><clipPath id="m9l"><circle r="190"/></clipPath><g clip-path="url(#m9l)">${Array.from({ length: 6 }, (_, i) => at(-110 + (i % 3) * 110 + 16 * Math.sin(tot * 2 + i), -60 + Math.floor(i / 3) * 120, germ(30, [P.green, P.pink, P.gold][i % 3], [P.greenD, P.pinkD, P.goldD][i % 3], tot * 3 + i))).join("")}</g>`, pop(a - D * 0.2)) : "";
  const frame = a > D * 0.6 ? at(440, 520, `${two(rr(-110, -140, 220, 280, 10), P.gold, P.goldD, 0, 8)}<path d="${rr(-86, -116, 172, 232, 6)}" fill="#e9dcc4"/>${at(0, 80, figure(P.blue, P.blueD), 0.6)}`, pop(a - D * 0.6)) + at(440, 780, `<path d="${rr(-16, -90, 32, 90, 6)}" fill="#fffaf0"/><path d="M0 -90Q14 -110 0 -${130 + 6 * Math.sin(tot * 9)}Q-14 -110 0 -90Z" fill="${P.gold}"/>`, pop(a - D * 0.7)) : "";
  return { g: paperBg(c, tot) + layer(floor(G) + at(1120, G, microscope(), 1.4) + lens + frame, c) }; }
export const semmelSet = makeSet([m0, m1, m2, m3, m4, m5, m6, m7, m8, m9], [], P);
