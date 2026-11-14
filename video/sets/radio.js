// "The phone is a radio" (network part 1): eight shots with nothing to read but numbers.
//   0 a street lamp at night; a short rainbow wave leaves it and reaches a big eye, which opens: ✓ (humans see light)
//   1 the camera pulls back: under it a tower sends a long teal wave; the two fronts race side by side and arrive
//     together; gold brackets show one short and one long wavelength; under the long one the eye stays shut: ✗
//   2 the blue phone hops in and a little mast pops up out of it: teal rings go out while pink rings come in, at once
//     (a radio station in every pocket, sending and receiving)
//   3–7 one bus stop at night, the blue phone on the bench, the camera carrying on from link to link:
//   3 link 1: rings and a dashed line to the tower on the left
//   4 link 2: a router in the window of the house behind lights up, its rings reach the phone
//   5 link 3: an earbud beside the phone on the bench, a small ring between them
//   6 link 4: three satellites rise into the sky, thin lines down to the phone
//   7 a big airplane-mode key drops in and is pressed: every link snaps off, the markers go grey, the street is quiet
// Hand-overs: the radio wave (teal) into the phone's mast, the phone's screen into the bus stop.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { P, mix, house, stars, skyline } from "./bank.js";
import { WAVE, WAVED, pop, bluePhone, tower, radio, waveLine, router, earbud, busStop, satellite } from "./net.js";

const night = (c, tot, seed) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, 3200, 800, tot), c, 0.15);
// a big eye; lid 0 = open, 1 = shut
const eye = (lid, look = 0) => { const id = "ey" + Math.round(lid * 100);
  return `<clipPath id="${id}"><path d="M-150 0Q0 -120 150 0Q0 120 -150 0Z"/></clipPath><path d="M-150 0Q0 -120 150 0Q0 120 -150 0Z" fill="#fff"/><g clip-path="url(#${id})">${disc(look * 20, 0, 60, "#3fa9ff", P.blueD)}<circle cx="${look * 20}" cy="0" r="28" fill="${P.ink}"/><circle cx="${look * 20 + 16}" cy="-18" r="10" fill="#fff"/>
    <path d="M-160 -130H160V${(-130 + 250 * lid).toFixed(1)}H-160Z" fill="#c9a6ff"/></g><path d="M-150 0Q0 ${(-120 + 240 * lid).toFixed(1)} 150 0" fill="none" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/>${lid > 0.9 ? [-90, -30, 30, 90].map((x) => `<path d="M${x} ${48 + Math.abs(x) * -0.25}l${x * 0.15} 34" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/>`).join("") : ""}`; };
const lamp = (on) => `<path d="M0 0V-520Q0 -560 50 -560H90" fill="none" stroke="#5a69b3" stroke-width="18"/>${on > 0 ? rings(100, -530, 70 * on, "#ffe9a8", 0.35) : ""}<path d="M60 -570h80l-16 40h-48Z" fill="#44529a"/><circle cx="100" cy="-528" r="22" fill="${mix("#6a5aa0", "#fff3c2", on)}"/><path d="${rr(-40, -10, 80, 10, 4)}" fill="#44529a"/>`;
const RAIN = ["#ff4d5a", "#ff9a3c", "#ffd04a", "#3ddc97", "#3fa9ff", "#a77bff"];
// a rainbow wave from x0 to x1 (the colours run along it)
const rainbow = (x0, x1, y, t) => { if (x1 <= x0) return ""; const n = RAIN.length, w = (x1 - x0) / n; return RAIN.map((col, i) => waveLine(x0 + i * w, x0 + (i + 1) * w, y, 70, 26, t, col, 12, 420)).join(""); };
const head = (x, y, col) => rings(x, y, 40, col, 0.35) + `<circle cx="${x}" cy="${y}" r="14" fill="#fff"/>`;
const bracket = (x, y, w, col) => `<path d="M${x} ${y + 18}V${y}H${x + w}V${y + 18}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---- 0–1: the lamp and the eye; then the tower, the race, the two lengths ----
const LX = 220, YL = 420, YR = 760, EX = 1500, V = 1150;
function street(T, c, tot, s) {
  const T1 = (s.ends || [])[0] || 1.66, u = T - T1;     // u: time into shot 1
  // the light wave: first on its own, then again in the race
  const race = u > 1.85, lf = race ? Math.min(EX - 170, 470 + V * (u - 1.85)) : Math.min(EX - 170, 470 + V * (T - 0.6));
  const light = T > 0.6 ? rainbow(470, lf, YL, tot) + (lf < EX - 175 ? head(lf, YL, "#ffe9a8") : "") : "";
  const open = 1 - ease(seg(T, 0.95, 1.25));
  const eyeTop = at(EX, YL, eye(Math.max(0.05, open), 0) + "", 1) + check(EX + 150, YL - 120, 42, P.green, T - 1.2);
  // the radio wave from the tower, at the same speed, much longer
  const tOn = u > 0.34, rf = !tOn ? 0 : race ? Math.min(EX - 170, 470 + V * (u - 1.85)) : Math.min(EX - 170, 470 + V * (u - 0.34));
  const rw = tOn ? waveLine(470, rf, YR, 360, 60, tot, WAVED, 22, 420) + waveLine(470, rf, YR, 360, 60, tot, WAVE, 12, 420) + (rf < EX - 175 ? head(rf, YR, WAVE) : "") : "";
  const tw = at(LX + 120, YR + 330, tower({ t: tot, lit: tOn ? seg(u, 0.34, 0.6) : 0 }), 0.62);
  const tie = race && lf >= EX - 175 && u < 3.0 ? rings(EX - 170, (YL + YR) / 2, 260 * seg(u, 2.75, 2.95), P.gold, 0.18 * (1 - seg(u, 2.95, 3.1))) : "";
  // one wavelength each, in gold
  const br = u > 2.95 ? at(0, 0, bracket(700, YL - 80, 70 * 1, P.gold), 1, 0, `opacity="${seg(u, 2.95, 3.1)}"`) + at(0, 0, bracket(700, YR - 120, 360, P.gold), 1, 0, `opacity="${seg(u, 3.21, 3.4)}"`) : "";
  const eyeLow = u > 3.55 ? at(EX, YR, eye(1), pop(u - 3.55)) + cross(EX + 150, YR - 120, 42, P.red, u - 4.34) : "";
  const ground = `<rect x="-600" y="${YR + 330}" width="3400" height="400" fill="#141a45"/>`;
  return night(c, tot, 13) + layer(skyline(5, -500, 2600, YR + 330, 120, 320, "#22195a", "#ffb066"), c, 0.5) + layer(ground + at(LX, YL + 540, lamp(seg(T, 0.2, 0.5)), 1) + light + eyeTop + rw + tw + tie + br + eyeLow, c);
}
function s0(a, tot, s) { const c = camAt(a, [[0, 980, 470, 1.2], [1.66, 980, 460, 1.22]]); return { g: street(a, c, tot, s) }; }
function s1(a, tot, s) { const T1 = (s.ends || [])[0] || 1.66, c = camAt(a, [[0, 980, 460, 1.22], [1.4, 880, 600, 1.0], [5.4, 880, 600, 1.03]]);
  return { g: street(T1 + a, c, tot, s), out: toScreen(c, EX - 300, YR), outC: WAVE, outZ: 16 }; }

// ---- 2: a radio station in the pocket ----
const QX = 1150, QG = 950, QK = 2.0;
function s2(a, tot) {
  const c = camAt(a, [[0, 1080, 520, 0.9], [5.49, 1090, 470, 0.86]]);
  const walk = ease(seg(a, 0.6, 1.5)), hop = Math.abs(Math.sin(walk * Math.PI * 3)) * 60 * (walk < 1 ? 1 : 0), x = lerp(1560, QX, walk);
  const mast = a > 1.85 ? at(x, QG - 250 * QK - hop, tower({ t: tot, lit: seg(a, 3.34, 3.6) }), 0.38 * pop(a - 1.85)) : "", top = [x, QG - 250 * QK - 600 * 0.38 - hop];
  const outR = a > 3.34 ? radio(top[0], top[1] + 90, a - 3.34, 620, { n: 4, speed: 0.9, w: 12, k: seg(a, 3.34, 3.6) }) : "";
  let inR = ""; if (a > 3.87) for (let i = 0; i < 3; i++) { const q = (((a - 3.87) * 0.9 + i / 3) % 1), r = lerp(640, 40, q), op = seg(a, 3.87, 4.1) * Math.sin(Math.PI * q) * 0.9;
    inR += `<circle cx="${top[0]}" cy="${top[1] + 90}" r="${r.toFixed(1)}" fill="none" stroke="${P.pink}" stroke-width="10" stroke-dasharray="26 22" opacity="${op.toFixed(3)}"/>`; }
  const both = a > 4.47 ? rings(top[0], top[1] + 90, 120 * spring(a - 4.47, 7, 12), P.gold, 0.2) : "";
  const ph = at(x, QG - hop, bluePhone(), QK);
  const g = night(c, tot, 23) + layer(skyline(17, -400, 2600, 1000, 140, 340, "#22195a", "#ffb066"), c, 0.5) + layer(`<rect x="-400" y="${QG}" width="3000" height="300" fill="#141a45"/>` + inR + outR + both + mast + ph, c);
  return { g, in: toScreen(c, top[0], top[1] + 90), inC: WAVE, inZ: 16, out: toScreen(c, x, QG - 125 * QK), outC: "#9fe7ff", outZ: 14 };
}

// ---- 3–7: four radios at a bus stop, and the button that silences them ----
const G = 880, BS = 840, PHX = 790, PHY = G - 70 * 1.5 - 20, PK = 1.2, ANT = [PHX, PHY - 250 * PK + 10];
const TX = 170, TK = 0.82, TTOP = [TX, G - 480 * TK], HX = 1470, RT = [HX, G - 150 * 1.45 - 34], EB = [960, PHY - 40], SATS = [[420, 150], [880, 100], [1340, 160]];
const marker = (n, a, grey = 0) => { const on = a > 0 ? spring(a, 8, 13) : 0; if (on <= 0) return "";
  return at(0, 0, rings(0, 0, 64, P.gold, 0.2 * (1 - grey)) + disc(0, 0, 44, mix(P.gold, "#5b5390", grey), mix(P.goldD, "#433a8f", grey)) + text(0, 22, String(n), 62, mix("#8a5200", "#2c2766", grey)), on); };
const plane = (c = "#fff") => `<path d="M0 -62L12 -20L64 10V24L12 8L9 40L24 52V62L0 55L-24 62V52L-9 40L-12 8L-64 24V10L-12 -20Z" fill="${c}"/>`;
function busWorld(T, c, tot, s) {
  const e = s.ends || [], o = (k) => e.slice(3, k).reduce((x, y) => x + y, 0) || 0;
  const t4 = o(4) || 2.34, t5 = o(5) || 3.73, t6 = o(6) || 5.44, t7 = o(7) || 8.09;
  const off = T > t7 + 2.38 ? ease(seg(T, t7 + 2.38, t7 + 2.7)) : 0, live = 1 - off, sn = (x) => (off > 0 ? 1 - off : 1);
  // the four links
  const l1 = seg(T, 0.87, 1.6), l2 = seg(T, t4, t4 + 0.5), l3 = seg(T, t5 + 0.45, t5 + 0.8), l4 = seg(T, t6 + 0.79, t6 + 1.4);
  const dash = (a0, b0, p, col, w = 8) => (p > 0 && live > 0 ? `<path d="M${a0[0]} ${a0[1]}L${lerp(a0[0], b0[0], p).toFixed(1)} ${lerp(a0[1], b0[1], p).toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-dasharray="18 16" stroke-linecap="round" opacity="${(0.85 * live).toFixed(2)}"/>` : "");
  const snap = (pt) => (off > 0 && off < 1 ? rings(pt[0], pt[1], 60 * off, "#fff", 0.4 * (1 - off)) : "");
  const fr = (t0) => live * (T - t0 < 1.6 ? 1 : 0.3);
  const r1 = l1 > 0 ? radio(ANT[0], ANT[1], tot, 700, { arc: [175, 240], n: 3, w: 12, k: fr(0.87) }) + dash(ANT, TTOP, l1, WAVE) + snap([(ANT[0] + TTOP[0]) / 2, (ANT[1] + TTOP[1]) / 2]) : "";
  const r2 = l2 > 0 ? radio(RT[0], RT[1] - 60, tot, 520, { arc: [150, 220], n: 3, w: 10, k: fr(t4), c: "#7fd0ff" }) + dash(RT, ANT, l2, "#7fd0ff") + snap([(RT[0] + ANT[0]) / 2, (RT[1] + ANT[1]) / 2]) : "";
  const r3 = l3 > 0 ? radio((PHX + EB[0]) / 2, PHY - 110, tot * 1.4, 90, { n: 2, w: 7, k: fr(t5 + 0.45), c: P.pink }) + snap([(PHX + EB[0]) / 2, PHY - 110]) : "";
  let r4 = ""; SATS.forEach((sp, i) => { const up = pop(T - t6 - 0.3 - i * 0.12); if (up > 0) r4 += at(sp[0], sp[1] + 200 * (1 - Math.min(1, up)), satellite({ light: live > 0.5 ? P.gold : "#5b5390" }), 0.33);
    r4 += dash([sp[0], sp[1] + 30], ANT, seg(T, t6 + 0.79 + i * 0.1, t6 + 1.4 + i * 0.1), P.gold, 5) + (l4 > 0 ? snap([lerp(sp[0], ANT[0], 0.5), lerp(sp[1], ANT[1], 0.5)]) : ""); });
  // markers 1..4, grey once the key is pressed
  const mk = at(lerp(ANT[0], TTOP[0], 0.55), lerp(ANT[1], TTOP[1], 0.55) - 90, marker(1, T - 1.43, off)) + at(lerp(RT[0], ANT[0], 0.45), lerp(RT[1], ANT[1], 0.45) - 110, marker(2, T - t4 - 0.68, off))
    + at(EB[0] + 40, PHY - 260, marker(3, T - t5 - 1.02, off)) + at(1120, 300, marker(4, T - t6 - 2.08, off));
  // the airplane-mode key
  const kOn = T > t7 + 0.46 ? pop(T - t7 - 0.46) : 0, press = T > t7 + 2.2 ? Math.sin(Math.PI * seg(T, t7 + 2.2, t7 + 2.6)) : 0, done = seg(T, t7 + 2.38, t7 + 2.5);
  const key = kOn > 0 ? at(1060, 330, `${rings(0, 10, 160, done > 0 ? P.gold : "#fff", 0.12 + 0.12 * done)}<circle cx="0" cy="18" r="128" fill="#2c2766"/>${disc(0, 10 * press, 120, mix("#5b5390", P.gold, done), mix("#433a8f", P.goldD, done), 0.1)}${at(0, 10 * press, plane(done > 0.5 ? "#8a5200" : "#fff"), 1.3)}`, kOn) : "";
  // the scene
  const hs = at(HX, G, house(P.teal, P.tealD, { lit: [1, 0, 1] }), 1.45) + at(RT[0], RT[1] + 30, router(tot), 0.42) + (l2 > 0 ? rings(RT[0], RT[1] - 20, 60, "#7fd0ff", 0.18 * live) : "");
  const tw = at(TX, G, tower({ t: tot, lit: l1 * live }), TK);
  const scr = live > 0.5 ? undefined : "#3a3478";
  const ph = at(PHX, PHY, bluePhone({ screen: scr, inner: off > 0.5 ? at(0, -125, plane("#c9a6ff"), 0.6) : "" }), PK);
  const bud = at(EB[0], EB[1], earbud(), 0.8);
  const quiet = off > 0 ? `<rect x="-600" y="-400" width="3200" height="1900" fill="#0d0b33" opacity="${(0.18 * off).toFixed(2)}"/>` : "";
  const ground = `<rect x="-600" y="${G}" width="3200" height="400" fill="#141a45"/><rect x="-600" y="${G}" width="3200" height="10" fill="#2c366f"/>`;
  return night(c, tot, 33) + layer(skyline(29, -600, 2600, G, 140, 330, "#22195a", "#ffb066"), c, 0.5) + layer(ground + hs + tw + at(BS, G, busStop(), 1.5) + r1 + r2 + r3 + r4 + ph + bud + mk + quiet + key, c);
}
const off = (s, k) => (s.ends || []).slice(3, k).reduce((x, y) => x + y, 0);
function s3(a, tot, s) { const c = camAt(a, [[0, 800, 600, 1.2], [2.34, 700, 580, 1.08]]); return { g: busWorld(a, c, tot, s), in: toScreen(c, PHX, PHY - 125 * PK), inC: "#9fe7ff", inZ: 14 }; }
function s4(a, tot, s) { const c = camAt(a, [[0, 700, 580, 1.08], [1.39, 1050, 580, 1.08]]); return { g: busWorld(off(s, 4) + a, c, tot, s) }; }
function s5(a, tot, s) { const c = camAt(a, [[0, 1050, 580, 1.08], [0.5, 880, 640, 1.45], [1.71, 875, 640, 1.48]]); return { g: busWorld(off(s, 5) + a, c, tot, s) }; }
function s6(a, tot, s) { const c = camAt(a, [[0, 875, 640, 1.48], [0.7, 900, 480, 0.97], [2.65, 900, 480, 0.95]]); return { g: busWorld(off(s, 6) + a, c, tot, s) }; }
function s7(a, tot, s) { const c = camAt(a, [[0, 900, 480, 0.95], [0.8, 1060, 500, 1.0], [3.98, 1060, 500, 1.02]]); return { g: busWorld(off(s, 7) + a, c, tot, s) }; }

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7];
export const radioSet = makeSet(SHOTS, [], P);
