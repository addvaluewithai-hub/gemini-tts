// "The SIM and roaming" (network part 1): ten shots, nothing to read but digits.
//   0 a SIM card drops into a warm spotlight on a table, big; the camera pulls back and it is the size of a coin
//   1 the SIM sits in the blue phone's tray, the phone number hangs from it on a string; the tray slides out and the SIM
//     flies into a second phone, the number follows the SIM, not the phone, and the new phone lights up with it
//   2 a gold key lands on the SIM's chip; the tower holds out a padlock, the key turns in it, ✓; then the card shrinks
//     and sinks into the phone, where it becomes a small chip on the board (eSIM)
//   3 the back of the phone with its own serial number; a dark sack snatches it and drags it off; the tower fires a beam,
//     a padlock clamps on the phone and its screen goes red ✗ (host left: everything sits right of x 420)
//   4–6 one envelope, one camera: the number on it lights group by group: the first digits and a globe (the country),
//     the next and a tower (the company), the rest and the blue house (you); the envelope flies to that house's door
//   7–9 roaming, one world: home land left, sea, a foreign land right with violet towers. A plane lands, the blue phone
//     greets a violet tower; the violet tower sends a ? across the sea to the home tower; the home tower sends ✓ back,
//     then a coin, then a stream of coins
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, play, frame, FW, FH, makeSet } from "./kit.js";
import { P, mix, house, coin, stars, skyline } from "./bank.js";
import { padlock, globe } from "./props.js";
import { WAVE, PULSE, pop, phone, bluePhone, sim, tower, radio } from "./net.js";

const V = [];
const tealPhone = (o = {}) => phone({ ...o, c: P.teal, cD: P.tealD, screen: o.screen || "#c9fff4" });
// a gold key, lying along x, ring at the right
const key = () => `${disc(70, 0, 34, P.gold, P.goldD)}<circle cx="70" cy="0" r="12" fill="${P.ink}"/><path d="M36 -8h-76v16h76ZM-30 8v18M-14 8v12" fill="${P.gold}" stroke="${P.goldD}" stroke-width="4"/>`;
// the phone number tag on a string: a cream label with digits
const tag = (digits, w = 300) => `${two(rr(-w / 2, -44, w, 88, 18), P.cream, P.creamD, 0, 7)}<circle cx="${-w / 2 + 24}" cy="0" r="9" fill="${P.ink}"/>${number(14, 20, digits, 58, P.ink)}`;
const table = (G) => `<rect x="-3000" y="${G}" width="9000" height="900" fill="${P.wood}"/><rect x="-3000" y="${G}" width="9000" height="16" fill="#c98a52"/>${Array.from({ length: 30 }, (_, i) => `<path d="M${-3000 + i * 300} ${G + 60}h180" stroke="${P.woodD}" stroke-width="8" stroke-linecap="round"/>`).join("")}`;
const room = (tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>`;

// ---- 0: the SIM, big, then its real size beside a coin ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [1.7, 960, 520, 1.05], [2.4, 960, 520, 1.05], [3.3, 960, 640, 0.95], [3.88, 960, 640, 0.93]]), G = 820;
  const fall = seg(a, 1.45, 1.79), land = a > 1.79 ? spring(a - 1.79, 7, 13) : 0, y = a < 1.79 ? lerp(-500, 520, easeIn(fall)) : 520 + 30 * (1 - land);
  // pull-back shrinks the SIM toward its real size: two coins beside it (a fingernail-sized thing)
  const shrink = ease(seg(a, 2.44, 3.3)), k = lerp(2.4, 1.15, shrink);
  const theSim = a > 1.45 ? at(960, lerp(y, G - 95, shrink), (a > 1.79 ? rings(0, 0, 280 * (0.6 + 0.4 * land), P.gold, 0.18 * (1 - shrink * 0.6), 1.3) : "") + sim(), [k * (1 + 0.1 * (1 - land) * (a > 1.79 ? 1 : 0)), k * (1 - 0.1 * (1 - land) * (a > 1.79 ? 1 : 0))], lerp(-6, 0, land)) : "";
  const coins = shrink > 0 ? [-1, 1].map((s, i) => at(960 + s * 300, G - 92, coin(92), pop(a - 2.7 - i * 0.12))).join("") : "";
  const cone = `<path d="M760 -100L1160 -100L1500 ${G}L420 ${G}Z" fill="#ffe6a8" opacity=".08"/><ellipse cx="960" cy="${G + 8}" rx="560" ry="60" fill="#ffe6a8" opacity=".1"/>`;
  const g = room(tot) + layer(stars(31, 60, -400, 2400, 600, tot), c, 0.15) + layer(table(G) + cone + coins + theSim, c);
  return { g, out: toScreen(c, 960, G - 95), outC: "#f1f4ff", outZ: 16 };
}

// ---- 1: the number follows the SIM ----
function s1(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.12], [1.6, 840, 560, 1.12], [3.0, 1060, 560, 1.05], [4.02, 1080, 560, 1.07]]), G = 960;
  const PA = [560, G], PB = [1500, G];
  // the tray slides out of the blue phone's side, then the SIM flies to the teal phone
  const tray = ease(seg(a, 1.5, 1.9)), fly = ease(seg(a, 1.85, 2.75)), lift = Math.sin(Math.PI * fly) * 260;
  const sx = lerp(PA[0] + 170 + 110 * tray, PB[0], fly), sy = lerp(G - 330, G - 300, fly) - lift, sk = lerp(0.85, 0.7, fly) * (fly >= 1 ? 1 + 0.1 * Math.exp(-(a - 2.75) * 9) * Math.cos((a - 2.75) * 16) : 1);
  const inB = fly >= 1 ? ease(seg(a, 2.75, 2.95)) : 0;
  // the number tag swings on its string, tied to the SIM
  const swing = 10 * Math.sin(tot * 2.2) + (fly > 0 && fly < 1 ? -18 * Math.sin(Math.PI * fly) : 0), tx = sx + 40 * Math.sin(swing * Math.PI / 180), ty = lerp(sy - 230, PB[1] - 640, inB);
  const glow = a > 0.34 ? rings(sx, sy, 130 * pop(a - 0.34), P.gold, 0.25) : "";
  const string = inB >= 1 ? "" : `<path d="M${sx} ${sy - 60}Q${(sx + tx) / 2 + 30} ${(sy + ty) / 2} ${tx} ${ty + 44}" stroke="${P.cream}" stroke-width="5" fill="none"/>`;
  const theTag = at(tx, ty, tag("555 0123"), pop(a - 0.34), swing * 0.5);
  // the blue phone goes dark ("not the device"); the teal one lights up when the SIM is in
  const darkA = ease(seg(a, 0.98, 1.3)), onB = ease(seg(a, 2.95, 3.5));
  const phA = at(PA[0], PA[1], (fly < 1 ? `<path d="${rr(55, -250, 10 + 70 * tray, 18, 6)}" fill="${P.steel}"/>` : "") + bluePhone({ on: 1 - 0.85 * darkA }), 2.0);
  const phB = at(PB[0], PB[1], tealPhone({ on: 0.15 + 0.85 * onB, inner: onB > 0 ? at(0, -125, number(0, -10, "555", 44, P.ink) + number(0, 40, "0123", 44, P.ink), 0.9 * pop(a - 2.95)) : "" }), 2.0);
  const xA = a > 1.13 ? at(PA[0], G - 600, cross(0, 0, 50, P.red, a - 1.13), 1, 0, `opacity="${(1 - seg(a, 1.6, 1.9)).toFixed(2)}"`) : "";
  const g = room(tot) + layer(stars(33, 60, -400, 2400, 600, tot), c, 0.15) + layer(table(G) + phA + phB + xA + glow + (fly < 1 ? "" : "") + (inB < 1 ? at(sx, sy, sim(), sk * (1 - inB)) : "") + string + theTag, c);
  return { g, in: toScreen(c, sx, sy), inC: "#f1f4ff", inZ: 14, out: toScreen(c, sx, sy), outC: "#f1f4ff", outZ: 16 };
}

// ---- 2: the secret key; then the SIM becomes part of the phone ----
function s2(a, tot) {
  const c = camAt(a, [[0, 980, 500, 1.18], [3.0, 1000, 500, 1.2], [3.6, 960, 560, 1.0], [7.26, 960, 560, 1.06]]), G = 940, SX = 800, SY = 470;
  // the key flies in and lies on the chip
  const kin = easeOut(seg(a, 0.3, 0.75)), kx = lerp(-200, SX + 30, kin), ky = lerp(200, SY + 10, kin);
  // the tower holds out a padlock; the key slides into it and turns, ✓
  const tw = 1420, lk = ease(seg(a, 1.2, 1.7)), lockX = lerp(tw, 1200, lk), lockY = lerp(G - 560, SY, lk);
  const slide = ease(seg(a, 1.9, 2.35)), turn = ease(seg(a, 2.35, 2.75)), open = turn;
  const keyPos = [lerp(kx, lockX - 120, slide), lerp(ky, lockY + 30, slide)];
  // then the card shrinks and sinks into the phone (3.5 → 6.8)
  const go = ease(seg(a, 3.6, 4.5)), sink = ease(seg(a, 4.6, 5.9)), melt = ease(seg(a, 5.6, 6.4));
  const phoneIn = ease(seg(a, 3.5, 4.2));
  const PH = [960, G];
  const simX = lerp(SX, PH[0], go), simY = lerp(SY, lerp(PH[1] - 360, PH[1] - 200, sink), go), simK = lerp(2.0, lerp(0.7, 0.28, sink), go);
  const ph = phoneIn > 0 ? at(PH[0], lerp(G + 900, G, phoneIn), `${two(rr(-65, -250, 130, 250, 22), P.blue, P.blueD, 8, 0)}<path d="${rr(-54, -232, 108, 208, 12)}" fill="#1f5f9e"/>${[0, 1, 2].map((i) => `<path d="M-40 ${-200 + i * 50}h80" stroke="#4fa0e8" stroke-width="5"/>`).join("")}${melt > 0 ? rings(0, -100, 40 * melt, P.gold, 0.4) + two(rr(-16, -116, 32, 32, 6), P.gold, P.goldD, 0, 4) : ""}`, 2.2) : "";
  const card = melt < 1 ? at(simX, simY, sim(), simK * (1 - melt), 0, melt > 0 ? `opacity="${(1 - melt).toFixed(2)}"` : "") : "";
  const theKey = a > 0.3 && go < 0.3 ? at(keyPos[0], keyPos[1], key(), 2.0 * (1 - go), lerp(-30, 0, kin) + 90 * turn, `opacity="${(1 - seg(a, 3.3, 3.6)).toFixed(2)}"`) : "";
  const lock = a > 1.2 && a < 3.7 ? at(lockX, lockY, padlock(2.4, open), pop(a - 1.2), 0, `opacity="${(1 - seg(a, 3.3, 3.6)).toFixed(2)}"`) : "";
  const ok = a > 2.8 ? at(1180, SY - 230, check(0, 0, 64, P.green, a - 2.8), 1, 0, `opacity="${(1 - seg(a, 3.3, 3.6)).toFixed(2)}"`) : "";
  const tow = at(tw + 120, G, tower({ t: tot, lit: lk * (1 - go) }), 1.15 - 0.3 * go, 0, `opacity="${(1 - go).toFixed(2)}"`);
  const g = room(tot) + layer(stars(35, 60, -400, 2400, 600, tot), c, 0.15) + layer(table(G) + tow + ph + card + theKey + lock + ok, c);
  return { g, in: toScreen(c, SX, SY), inC: "#f1f4ff", inZ: 14 };
}

// ---- 3: the phone's own number; stolen, and locked from afar (host left) ----
function s3(a, tot) {
  const c = camAt(a, [[0, 1080, 480, 1.12], [1.8, 1090, 480, 1.16], [3.0, 1200, 500, 1.05], [4.56, 1220, 500, 1.07]]), G = 900;
  const grab = ease(seg(a, 2.0, 2.5)), drag = easeIn(seg(a, 2.4, 3.3)) * 0.5 + ease(seg(a, 2.4, 3.3)) * 0.5, px = 1000 + 380 * drag, stop = a > 3.46 ? 1 : 0;
  // back of the phone: camera bumps and the engraved serial
  const SER = "35 2099 0017";
  const serial = [...SER].map((ch, i) => { const on = seg(a, 0.64 + i * 0.07, 0.8 + i * 0.07); return text(-128 + i * 23.5, 70, ch, 46, mix("#2a80d2", "#fff3c2", on)); }).join("");
  const back = `${two(rr(-160, -300, 320, 600, 50), P.blue, P.blueD, 12, 0)}<path d="${rr(-120, -260, 110, 110, 30)}" fill="${P.blueD}"/><circle cx="-90" cy="-230" r="22" fill="${P.ink}"/><circle cx="-40" cy="-180" r="22" fill="${P.ink}"/><path d="${rr(-145, 20, 290, 70, 14)}" fill="${P.blueD}"/>${serial}`;
  const red = ease(seg(a, 3.76, 4.0)), lockOn = a > 3.46 ? spring(a - 3.46, 8, 14) : 0;
  const ph = at(px, G - 380, back + (red > 0 ? `<path d="${rr(-160, -300, 320, 600, 50)}" fill="${P.red}" opacity="${(0.55 * red).toFixed(2)}"/>` : "") + (a > 3.46 ? at(0, -40, padlock(3.2, 0, P.gold, P.goldD), lockOn) : ""), 1.1, 8 * Math.sin(Math.PI * grab) * (1 - stop));
  // the sack: comes down over the phone and drags it off to the right
  const sackY = lerp(-500, G - 640, easeOut(seg(a, 1.88, 2.33)));
  const sack = a > 1.88 && a < 3.6 ? at(px + 30, sackY, `${two("M-150 0Q-180 -160 -40 -200L40 -200Q180 -160 150 0Q160 240 0 260Q-160 240 -150 0Z", "#3a2a5e", "#291d4a", 14, 0)}<path d="M-60 -200q60 -40 120 0" stroke="#c9a46a" stroke-width="12" fill="none"/>`, 1, 0, `opacity="${(1 - seg(a, 3.3, 3.6)).toFixed(2)}"`) : "";
  // the tower fires a beam at it
  const beam = seg(a, 2.82, 3.46), tw = [1780, G];
  const beamG = beam > 0 && a < 4.2 ? drawn(`M${tw[0]} ${tw[1] - 480}L${px} ${G - 400}`, beam, WAVE, 14, `opacity="${(1 - seg(a, 3.9, 4.2)).toFixed(2)}"`) + radio(px, G - 400, tot, 160, { n: 2, k: beam }) : "";
  const xx = a > 3.76 ? at(px, G - 800, cross(0, 0, 56, P.red, a - 3.76)) : "";
  const g = room(tot) + layer(stars(37, 60, -400, 2400, 600, tot), c, 0.15) + layer(skyline(5, -400, 2600, G - 40, 120, 300, "#2a1f66", "#ffb066"), c, 0.5) + layer(`<rect x="-1000" y="${G}" width="4000" height="600" fill="${P.ground}"/>` + at(tw[0], tw[1], tower({ t: tot, lit: beam }), 0.95) + ph + sack + beamG + xx, c);
  return { g };
}

// ---- 4–6: the number is an address ----
const GROUPS = [["+00", 0], ["12", 1], ["345 6789", 2]];
function envelopeWorld(t, c, tot, s) {
  const e = s.ends || [], T5 = e[4] || 3.16, T6 = T5 + (e[5] || 1.58);
  const G = 920, EX = 960, EY = 560;
  const lit = [seg(t, 1.29, 1.6), seg(t, T5 + 0.18, T5 + 0.5), seg(t, T6 + 0.63, T6 + 0.9)];
  // the envelope: when the last group lights, it flies to the house's door
  const fly = ease(seg(t, T6 + 2.3, T6 + 3.4)), HX = 1500;
  const ex = lerp(EX, HX - 10, fly), ey = lerp(EY, G - 120, fly) - Math.sin(Math.PI * fly) * 160, ek = lerp(1, 0.22, fly);
  // digits in three groups on the envelope
  const groupX = [-330, -60, 230];
  const nums = GROUPS.map(([d, i]) => { const on = lit[i], col = on > 0 ? mix(P.ink, i === 0 ? "#2a80d2" : i === 1 ? "#15988f" : P.pinkD, on) : P.ink;
    return (on > 0 ? `<path d="${rr(groupX[i] - d.length * 20 - 20, -10, d.length * 40 + 40, 100, 18)}" fill="${i === 0 ? "#bfe0ff" : i === 1 ? "#b8f4ea" : "#ffd1e6"}" opacity="${(on * 0.9).toFixed(2)}"/>` : "") + number(groupX[i], 70, d, 80, col); }).join("");
  const env = `${two(rr(-460, -230, 920, 460, 26), P.cream, P.creamD, 0, 12)}<path d="M-460 -230L0 60L460 -230" fill="none" stroke="${P.creamD}" stroke-width="10"/><path d="${rr(300, -200, 120, 140, 10)}" fill="${P.red}"/><path d="${rr(316, -184, 88, 108, 6)}" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>${nums}`;
  // over each group, its meaning pops up: a globe, a tower, the blue house
  const sym = [at(EX + groupX[0], EY - 360, globe(110, tot * 0.05, { id: "en" }), pop(t - 2.57) * (1 - fly)),
    at(EX + groupX[1], EY - 260, tower({ t: tot, lit: 1 }), 0.42 * pop(t - (T5 + 0.83)) * (1 - fly)),
    at(fly > 0 ? HX : EX + groupX[2], fly > 0 ? G : EY - 250, house(P.blue, P.blueD), lerp(0.6 * pop(t - (T6 + 0.63)), 1.4, ease(seg(t, T6 + 1.0, T6 + 2.2))))].join("");
  return `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(39, 70, -400, 2400, 700, tot), c, 0.15) + layer(`<rect x="-1000" y="${G}" width="4000" height="600" fill="${P.ground}"/>` + sym + at(ex, ey, env, ek, -6 * Math.sin(Math.PI * fly)), c);
}
function s4(a, tot, s) { const c = camAt(a, [[0, 960, 500, 1.05], [3.16, 960, 480, 1.0]]); return { g: envelopeWorld(a, c, tot, s), in: [960, 540], inC: P.cream, inZ: 16 }; }
function s5(a, tot, s) { const T5 = (s.ends || [])[4] || 3.16, c = camAt(a, [[0, 960, 480, 1.0], [1.58, 960, 470, 1.0]]); return { g: envelopeWorld(T5 + a, c, tot, s) }; }
function s6(a, tot, s) { const e = s.ends || [], T6 = (e[4] || 3.16) + (e[5] || 1.58), c = camAt(a, [[0, 960, 470, 1.0], [1.0, 1100, 520, 0.95], [3.82, 1300, 600, 1.0]]); return { g: envelopeWorld(T6 + a, c, tot, s), out: toScreen(c, 1500, 820), outC: P.ink, outZ: 14 }; }

// ---- 7–9: roaming ----
function roamWorld(t, c, tot, s) {
  const e = s.ends || [], T8 = e[7] || 3.63, T9 = T8 + (e[8] || 2.43);
  const G = 860, HT = [500, G], FT = [3180, G];
  // the plane: across the sea, lands on the foreign side
  const pf = seg(t, -0.6, 1.17), px = lerp(800, 2540, ease(pf)), py = lerp(260, G - 70, easeIn(seg(t, 0.4, 1.17))), roll = t > 1.17 ? lerp(2540, 2600, easeOut(seg(t, 1.17, 1.8))) : px;
  const plane = at(roll, py, `${two("M-210 -20Q-210 -60 -150 -60H170Q220 -60 230 -30L250 0H-210Z", "#f1f4ff", "#c4cbe6", 0, 8)}<path d="M-30 -40L-110 40H-60L40 -40Z" fill="${P.violet}"/><path d="M-200 -50L-230 -120H-180L-140 -50Z" fill="${P.violet}"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${-90 + i * 50}" cy="-36" r="9" fill="#9fe7ff"/>`).join("")}`, 1.1, lerp(-6, 0, seg(t, 0.6, 1.17)));
  // the blue phone comes out and greets the violet tower
  const out = t > 1.17 ? ease(seg(t, 1.17, 1.6)) : 0, PX = 2880, phY = G;
  const ph = out > 0 ? at(lerp(2700, PX, out), phY, bluePhone(), 1.0 * pop(t - 1.17)) : "";
  const greet = seg(t, 1.89, 3.13), fLit = clamp(greet * 1.4);
  const hello = greet > 0 ? radio(PX + 40, phY - 200, tot, 330, { n: 3, arc: [-80, 10], k: 1 - seg(t, T8 + 0.2, T8 + 0.7) }) : "";
  // the question across the sea
  const q = seg(t, T8 + 0.65, T8 + 1.85), qp = bez([FT[0], FT[1] - 640], [1750, -200], [HT[0], HT[1] - 640], ease(q));
  const ask = q > 0 && t < T9 + 0.3 ? at(qp[0], qp[1], `${rings(0, 0, 150, P.violet, 0.2)}${disc(0, 0, 120, P.violet, P.violetD)}${text(0, 58, "?", 170, "#fff")}`, (q >= 1 ? 1 + 0.15 * Math.exp(-(t - T8 - 1.85) * 9) : 1) * (1 - seg(t, T9, T9 + 0.3))) : "";
  // the answer: ✓, then a coin, then many coins back to the home side
  const ans = t - T9, okp = bez([HT[0], HT[1] - 640], [1750, -260], [FT[0], FT[1] - 640], ease(seg(ans, 0.98, 1.6)));
  const ok = ans > 0.98 ? at(okp[0], okp[1], check(0, 0, 110, P.green, ans - 0.98)) : "";
  let coins = "";
  const nCoins = ans < 1.51 ? 0 : ans < 2.19 ? 1 : Math.min(14, 1 + Math.floor((ans - 2.19) * 12));
  for (let i = 0; i < nCoins; i++) { const t0 = i === 0 ? 1.51 : 2.19 + (i - 1) / 12, u = seg(ans, t0, t0 + 0.9), b = bez([FT[0] - 40, FT[1] - 500], [1750, -120 - 40 * (i % 3)], [HT[0] + 40, HT[1] - 500], ease(u)); if (u <= 0) continue;
    coins += at(b[0], b[1], (u >= 1 ? "" : rings(0, 0, 90, P.gold, 0.2)) + coin(i === 0 ? 80 : 60), u >= 1 ? 0 : 1); }
  const homeGlow = ans > 0.4 ? rings(HT[0], HT[1] - 480, 140 * pop(ans - 0.4), P.gold, 0.18) : "";
  const piles = ans > 2.4 ? at(HT[0] - 230, G, Array.from({ length: Math.min(9, Math.floor((ans - 2.4) * 14)) }, (_, i) => at(0, -18 - i * 18, `<ellipse rx="44" ry="14" fill="${P.goldD}"/><ellipse cy="-4" rx="44" ry="14" fill="${P.gold}"/>`)).join("")) : "";
  // lands and sea
  const sea = `<rect x="1100" y="${G - 10}" width="1320" height="700" fill="#1d4f9e"/>${[0, 1, 2, 3].map((i) => `<path d="M${1150 + ((tot * 40 + i * 330) % 1250)} ${G + 40 + i * 40}q30 -18 60 0q30 18 60 0" stroke="#5fb6ff" stroke-width="7" fill="none" opacity=".6"/>`).join("")}`;
  const home = `<rect x="-1500" y="${G}" width="2600" height="700" fill="${P.ground}"/>${at(HT[0], G, tower({ t: tot, lit: clamp(ans > 0 ? 1 : 0) + 0 }), 1)}${at(HT[0] + 360, G, house(P.blue, P.blueD), 1.0)}`;
  const foreign = `<rect x="2420" y="${G}" width="2600" height="700" fill="#3b1a63"/>${at(FT[0], G, tower({ t: tot + 1, lit: fLit, c: "#d7b8ff", cD: P.violet }), 1)}${at(FT[0] + 330, G, tower({ t: tot + 2, c: "#d7b8ff", cD: P.violet }), 0.7)}${skyline(13, 3800, 5000, G, 120, 330, "#5a2a8c", "#ffd27a")}`;
  return `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(41, 90, -1500, 5000, 700, tot), c, 0.15) + layer(sea + home + foreign + homeGlow + piles + plane + ph + hello + ask + ok + coins, c);
}
function s7(a, tot, s) { const c = camAt(a, [[0, 2150, 520, 0.9], [1.2, 2700, 540, 0.95], [3.63, 2850, 540, 1.0]]); return { g: roamWorld(a, c, tot, s), in: [960, 540], inC: P.ink, inZ: 14 }; }
function s8(a, tot, s) { const T8 = (s.ends || [])[7] || 3.63, c = camAt(a, [[0, 2850, 540, 1.0], [0.7, 1860, 540, 0.6], [2.43, 1860, 540, 0.61]]); return { g: roamWorld(T8 + a, c, tot, s) }; }
function s9(a, tot, s) { const e = s.ends || [], T9 = (e[7] || 3.63) + (e[8] || 2.43), c = camAt(a, [[0, 1860, 540, 0.61], [3.05, 1860, 550, 0.63]]); return { g: roamWorld(T9 + a, c, tot, s) }; }

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];
// in a Short (cfg.vertical): portrait versions to come (V is empty, so landscape shots are reframed)
export const simSet = makeSet(SHOTS, V, P);
