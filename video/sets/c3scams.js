// Crypto part 3, "scams": ten wordless shots (shots.md, scene scams), in the world of parts 1 and 2.
//   0 a pyramid of houses: coins from each new row flow up to pay the rows above a monthly "+" ribbon
//   1 OneCoin: a tower and its heap roll to $4,000,000,000; its front falls away on nothing, no chain; 2017, a coat on
//     an empty hook, a WANTED poster with a "?" (host left)
//   2 romance: hearts go back and forth on a phone for months, a heart brings an app, the app is a trap door
//   3 fake support: a phone rings with a headset, a wrench bubble, then a hook reaching for the twelve-word slip ✗
//   4 deepfake: a screen with a plain silhouette, 1 ₿ → 2 ₿, the silhouette glitches into code (AI); the real one shrugs ?
//   5 recovery scam: a second caller with a RECOVERY badge, a fee coin goes in, the badge flips to the same mask (host right)
//   6–9 the four warning signs on a road, one shot each, the camera walking from sign to sign:
//     1 GUARANTEED cracks · 2 an hourglass racing with an alarm · 3 a hook reaching for the slip ✗ · 4 a withdraw button
//     locked behind a fee
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3scams.v.js";
import { P, mix, house, coin, stars, skyline } from "./bank.js";
import { calPage, monitor } from "./props.js";
import { tower, seedSlip, hotPhone, heart } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 3600, 1080, tot), c, 0.15);
const ground = (y, fill = "#221650") => `<rect x="-1200" y="${y}" width="5200" height="900" fill="${fill}"/>`;
const label = (word, w, size = 70, bg = P.gold, bgD = P.goldD, ink = P.ink) => `${two(rr(-w / 2, -50, w, 100, 50), bg, bgD, 0, 8)}${text(0, size * 0.36, word, size, ink)}`;
// the mask from part 1's masquerade, for the scammers
const mask = (c = P.ink, rim = P.gold) => `<path d="M-130 -14Q-120 -50 -60 -40Q0 -30 0 -10Q0 -30 60 -40Q120 -50 130 -14Q120 34 60 30Q16 26 0 6Q-16 26 -60 30Q-120 34 -130 -14Z" fill="${c}"/><path d="M-130 -14Q-120 -50 -60 -40Q0 -30 0 -10Q0 -30 60 -40Q120 -50 130 -14" fill="none" stroke="${rim}" stroke-width="7"/>${[-63, 63].map((ex) => `<ellipse cx="${ex}" cy="-6" rx="26" ry="18" fill="${P.win}"/>`).join("")}`;
// a hook on a line, coming down from above to (0, 0)
const hook = (len = 600) => `<path d="M0 ${-len}V-60" stroke="${P.steelD}" stroke-width="8"/><path d="M0 -60V0a34 34 0 0 1 -68 0" fill="none" stroke="${P.steel}" stroke-width="16" stroke-linecap="round"/><path d="M-68 0l-14 -22" stroke="${P.steel}" stroke-width="14" stroke-linecap="round"/>`;
// a speech bubble w x h with its tail at the bottom left, centred on (0, 0)
const bubble = (w, h, inner = "", c = "#ffffff") => `<path d="${rr(-w / 2, -h / 2, w, h, 30)}" fill="${c}"/><path d="M${-w / 2 + 40} ${h / 2 - 4}l-30 46l70 -46Z" fill="${c}"/>${inner}`;
const headset = (c = P.ink) => `<path d="M-40 10V-6a40 40 0 0 1 80 0V10" fill="none" stroke="${c}" stroke-width="12"/><path d="${rr(-52, -4, 22, 40, 8)}" fill="${c}"/><path d="${rr(30, -4, 22, 40, 8)}" fill="${c}"/><path d="M40 36q0 24 -30 24" fill="none" stroke="${c}" stroke-width="7"/>`;
const wrench = (c = P.steelD) => `<path d="M-50 40L20 -30" stroke="${c}" stroke-width="22" stroke-linecap="round"/><path d="M10 -40a34 34 0 1 0 40 -10l-22 22l-16 -16l22 -22a34 34 0 0 0 -24 26Z" fill="${c}"/>`;
const shake = (a, t0, t1, amp = 8) => (a > t0 && a < t1 ? amp * Math.sin(a * 50) : 0);

// ---- 0: the pyramid ----
const ROW_Y = (r) => 230 + r * 205, ROW_X = (r, i) => 960 + (i - r / 2) * 300;
function s0(a, tot, s) {
  const E = (s.ends || [])[0] || 6.07, rows = 4;
  const c = camAt(a, [[0, 960, 260, 2.3], [1.4, 960, 270, 2.1], [3.5, 960, 480, 1.2], [E, 960, 560, 1.0]]);
  let hs = "", flow = "";
  for (let r = 0; r < rows; r++) for (let i = 0; i <= r; i++) {
    const t0 = r === 0 ? 0.7 : 3.7 + (r - 1) * 0.55 + i * 0.07, cols = [[P.gold, P.goldD], [P.teal, P.tealD], [P.pink, P.pinkD], [P.blue, P.blueD], [P.violet, P.violetD]][(r + i) % 5];
    if (a < t0) continue;
    // the top house wears a ribbon "+" that pulses each "month"
    const rib = r === 0 && a > 2.35 ? at(150, -170, `${two(rr(-64, -40, 128, 80, 40), P.green, P.greenD, 0, 6)}${text(0, 24, "+%", 54, "#fff")}`, pop(a - 2.35) * (1 + 0.08 * Math.sin(a * 6))) : "";
    hs += at(ROW_X(r, i), ROW_Y(r) + 100, house(cols[0], cols[1], { lit: [1, 1, 1] }) + rib, 0.68 * pop(a - t0));
  }
  // coins: from each lower row up to the row above, again and again, once there is a row below
  for (let r = 1; r < rows; r++) { const born = 3.7 + (r - 1) * 0.55 + 0.4; if (a < born) continue;
    for (let i = 0; i <= r; i++) for (let k = 0; k < 2; k++) { const u = ((a - born) * 0.9 + k * 0.5 + i * 0.13) % 1, from = [ROW_X(r, i), ROW_Y(r) + 10], to = [ROW_X(r - 1, Math.min(i, r - 1)), ROW_Y(r - 1) + 30];
      const b = bez(from, [(from[0] + to[0]) / 2, from[1] - 90], to, ease(u)); flow += at(b[0], b[1], coin(24, ""), 1 - 0.3 * u); } }
  // a few coins rain onto the top house on "guaranteed every month"
  const pay = a > 2.6 && a < 3.8 ? [0, 1, 2].map((k) => { const u = clamp((a - 2.6 - k * 0.3) / 0.5); return u > 0 && u < 1 ? at(960 + (k - 1) * 40, lerp(80, 300, easeIn(u)), coin(22, "")) : ""; }).join("") : "";
  const g = night(c, tot, 71) + layer(skyline(5, -900, 3000, 1000, 80, 280, "#2a1d66", "#ffb066"), c, 0.4) + layer(ground(1000) + hs + flow + pay, c);
  return { g, out: toScreen(c, 960, 300), outC: P.gold, outZ: 18 };
}

// ---- 1: OneCoin ----
function s1(a, tot) {
  const G = 960, TX = 900, HX = 1340;
  const c = camAt(a, [[0, 1050, 560, 1.1], [3.4, 1080, 560, 1.12], [4.8, 1000, 560, 1.18], [8.24, 1120, 520, 1.05]]);
  const front = ease(seg(a, 3.7, 4.3)), gone = seg(a, 5.2, 5.6);
  // behind the tower: nothing. A dashed outline where a chain should be, crossed out
  const behind = a > 3.6 ? at(TX, G, `<path d="${rr(-180, -760, 360, 760, 14)}" fill="#120c30"/>${[0, 1, 2].map((i) => `<path d="${rr(-120, -620 + i * 170, 240, 120, 16)}" fill="none" stroke="#5a4aa8" stroke-width="6" stroke-dasharray="14 12"/>`).join("")}${a > 4.4 ? cross(0, -380, 60, P.red, a - 4.4) : ""}`) : "";
  const tw = front < 0.98 ? at(TX, G + 900 * easeIn(front), tower({ name: "OneCoin", h: 760, seed: 3 }), 1, 18 * front) : "";
  // the heap with its counter
  const heapN = a < 2.2 ? 0 : Math.round(4e9 * ease(seg(a, 2.2, 3.3)) / 1e7) * 1e7; let heap = "";
  for (let row = 0; row < 6; row++) for (let k = 0; k < 6 - row; k++) { const t0 = 1.4 + (row * 6 + k) * 0.02; if (a > t0) heap += at(HX + (k - (5 - row) / 2) * 62, G - 34 - row * 50, coin(32, ""), pop(a - t0)); }
  const heapG = heap;
  const cnt = a > 2.0 ? at(HX, G - 420, `${two(rr(-250, -54, 500, 108, 54), P.ink, "#0c0826", 0, 6)}${text(0, 26, "$" + heapN.toLocaleString("en"), 64, P.gold)}`, pop(a - 2.0)) : "";
  // 2017: a coat on an empty hook, then WANTED
  const cal = a > 5.6 ? at(1520, 300, calPage("2017", "", 1, 150), 0.6 * pop(a - 5.6), -5) : "";
  const coatHook = a > 5.9 ? at(1250, 180, `<path d="M-60 0h120" stroke="${P.woodD}" stroke-width="14" stroke-linecap="round"/><circle cx="0" cy="10" r="10" fill="${P.steel}"/>${two("M-40 22Q-70 120 -60 260H60Q70 120 40 22Q0 10 -40 22Z", "#3a2a7a", "#291d5c", 8, 0)}<path d="M0 24V250" stroke="#291d5c" stroke-width="6"/>`, pop(a - 5.9)) : "";
  const want = a > 7.2 ? at(1560, 640, `<path d="${rr(-130, -170, 260, 340, 8)}" fill="${P.cream}"/>${text(0, -110, "WANTED", 54, P.redD)}<circle cx="0" cy="-10" r="56" fill="${P.ink}"/><path d="M-80 120Q0 40 80 120Z" fill="${P.ink}"/>${text(0, 10, "?", 90, P.cream)}`, pop(a - 7.2), -4) : "";
  const g = night(c, tot, 29) + layer(skyline(41, -900, 3200, G - 40, 120, 300, "#2a1d66", "#ffb066"), c, 0.45) + layer(ground(G) + behind + tw + heapG + cnt + coatHook + cal + want, c);
  return { g, in: toScreen(c, TX, 220), inC: P.gold, inZ: 18 };
}

// ---- 2: romance ----
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.2], [4.0, 960, 540, 1.15], [5.0, 1100, 540, 1.25], [7.16, 1160, 540, 1.3]]);
  const PH = [760, 820];
  // hearts going back and forth, one after another, from 1.5 to 3.9
  let hearts = "";
  for (let k = 0; k < 7; k++) { const t0 = 1.5 + k * 0.36, u = seg(a, t0, t0 + 0.55); if (u <= 0 || u >= 1) continue; const from = k % 2 ? [1320, 380] : [PH[0], 520], to = k % 2 ? [PH[0], 520] : [1320, 380];
    const b = bez(from, [(from[0] + to[0]) / 2, 230], to, ease(u)); hearts += at(b[0], b[1], heart(k % 2 ? P.pink : P.red, 1.4)); }
  // the other side: a smiling pink "profile" bubble, too perfect
  const other = at(1320, 380, `${rings(0, 0, 120, P.pink, 0.15)}<circle r="96" fill="${P.pink}"/>${heart("#fff", 0.9)}`, 1.3 * pop(a - 1.2));
  // calendar months flip while it goes on
  const mo = ["JAN", "FEB", "MAR", "APR", "MAY"], mi = Math.min(4, Math.floor(seg(a, 3.0, 4.0) * 5));
  const cal = a > 2.9 ? at(560, 260, calPage(mo[mi], "", 1, 120), 0.55 * pop(a - 2.9), -6) : "";
  // a heart brings an app: a shiny card with a rising chart; then the card flips to a trap door, coins drop in
  const app = seg(a, 4.2, 4.7), flip = seg(a, 6.0, 6.4), drop = seg(a, 6.3, 7.1);
  const appPos = bez([1320, 380], [1200, 300], [1180, 700], ease(app));
  const shiny = `${two(rr(-150, -110, 300, 220, 30), "#ffffff", "#d8e2ff", 0, 8)}<path d="M-110 60L-50 10L0 30L90 -60" fill="none" stroke="${P.green}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M90 -60l-34 4l26 22Z" fill="${P.green}"/>`;
  const trap = `<path d="${rr(-150, -110, 300, 220, 30)}" fill="${P.ink}"/><ellipse cx="0" cy="10" rx="110" ry="60" fill="#05030f"/>${at(0, -150, mask(P.ink, P.red), 0.7)}`;
  const card = app > 0 ? at(appPos[0], appPos[1], flip < 0.5 ? `<g transform="scale(${(1 - 2 * flip).toFixed(3)} 1)">${shiny}</g>` : `<g transform="scale(${(2 * flip - 1).toFixed(3)} 1)">${trap}</g>`, 0.6 + 0.9 * ease(app)) : "";
  const coinsIn = drop > 0 && drop < 1 ? [0, 1, 2, 3].map((k) => { const u = clamp(drop * 1.4 - k * 0.12); return u > 0 && u < 1 ? at(lerp(PH[0] + 60, 1180, ease(u)), lerp(560, 720, ease(u)) - 120 * Math.sin(Math.PI * u), coin(26, ""), 1 - 0.6 * u) : ""; }).join("") : "";
  const phone = at(PH[0], PH[1] - 120, hotPhone({ inner: `${heart(P.pink, 1.2)}` }), 1.15);
  const g = night(c, tot, 13) + layer(skyline(23, -900, 3200, 1000, 80, 260, "#2a1d66", "#ffb066"), c, 0.45) + layer(ground(1000) + other + cal + phone + hearts + card + coinsIn, c);
  return { g, in: [960, 540], inC: P.pink, inZ: 16, out: toScreen(c, 1180, 710), outC: P.ink, outZ: 18 };
}

// ---- 3: fake support ----
function s3(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.25], [3.4, 1000, 520, 1.1], [5.2, 1020, 520, 1.12]]);
  const ring = a > 0.6 && a < 2.0 ? 10 * Math.sin(a * 60) * (1 - seg(a, 1.6, 2.0)) : 0;
  const phone = at(700 + ring, 720, hotPhone({ glow: a < 2.0 ? "#ffe066" : "#9fe7ff", inner: at(0, -20, headset(P.ink), 1.3) }), 1.25);
  const waves = a > 0.6 && a < 2.0 ? [1, 2].map((k) => `<path d="M${560 - k * 30} ${520 - k * 20}q-30 40 0 80M${840 + k * 30} ${520 - k * 20}q30 40 0 80" fill="none" stroke="${P.gold}" stroke-width="10" stroke-linecap="round" opacity="${(0.8 * Math.abs(Math.sin(a * 8 + k))).toFixed(2)}"/>`).join("") : "";
  const b1 = a > 1.9 && a < 3.7 ? at(1180, 400, bubble(300, 200, at(0, 0, wrench(), 1.4)), 1.5 * pop(a - 1.9) * (1 - seg(a, 3.5, 3.7))) : "";
  const ask = a > 3.7 ? at(1200, 440, bubble(420, 300, at(0, 10, seedSlip(), 1)), 1.4 * pop(a - 3.7)) : "";
  const hk = a > 4.0 ? at(1330, lerp(-300, 360, ease(seg(a, 4.0, 4.6))), hook(800), 1.3) : "";
  const no = a > 4.75 ? cross(1520, 260, 70, P.red, a - 4.75) : "";
  const g = night(c, tot, 37) + layer(skyline(9, -900, 3200, 1000, 80, 260, "#2a1d66", "#ffb066"), c, 0.45) + layer(ground(1000) + waves + phone + b1 + ask + hk + no, c);
  return { g, in: toScreen(c, 700, 830), inC: P.ink, inZ: 18 };
}

// ---- 4: deepfake giveaway ----
function s4(a, tot) {
  const MX = 820, MG = 960;
  const c = camAt(a, [[0, 840, 560, 1.2], [3.8, 850, 560, 1.22], [5.6, 1060, 560, 1.0], [7.56, 1080, 560, 0.98]]);
  const gl = seg(a, 4.0, 5.1), inner = (() => {
    const sil = `<circle cx="0" cy="-310" r="56" fill="#3a2a7a"/><path d="M-110 -170Q-110 -250 0 -250Q110 -250 110 -170Z" fill="#3a2a7a"/>`;
    const bars = Array.from({ length: 9 }, (_, i) => { const y = -370 + i * 24, w = 60 + rnd(i + Math.floor(a * 12)) * 140; return `<path d="${rr(-120 + rnd(i * 3 + Math.floor(a * 9)) * 60, y, w, 14, 7)}" fill="${[P.green, P.teal, P.pink][i % 3]}" opacity="${gl.toFixed(2)}"/>`; }).join("");
    const offer = a > 1.9 ? `<g opacity="${clamp((a - 1.9) / 0.3).toFixed(2)}">${at(-120, -160, coin(28, "B"), 1)}${text(-80, -146, "1", 44, P.ink, { anchor: "start" })}<path d="M-30 -160h50m-14 -12l14 12l-14 12" fill="none" stroke="${P.ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>${at(70, -160, coin(28, "B"), 1)}${text(110, -146, "2", 44, P.ink, { anchor: "start" })}</g>` : "";
    const jit = gl > 0 && gl < 1 ? `transform="translate(${(14 * Math.sin(a * 70)).toFixed(1)} 0)"` : "";
    return `<path d="${rr(-212, -386, 424, 252, 10)}" fill="#ffe8a8"/><g ${jit} opacity="${(1 - 0.85 * gl).toFixed(2)}">${sil}</g>${bars}${offer}`; })();
  const mon = at(MX, MG, monitor("#ffe8a8", inner), 1.6);
  const ai = gl > 0.5 ? at(MX + 450, 230, label("AI", 150, 70, P.teal, P.tealD, "#fff"), 1.4 * pop(gl * 1.1 - 0.5)) : "";
  // the real one, far away, knows nothing: a plain silhouette with a "?"
  const real = a > 5.7 ? at(1560, MG, `<circle cx="0" cy="-300" r="56" fill="#5a4aa8"/><path d="M-110 -160Q-110 -240 0 -240Q110 -240 110 -160V0H-110Z" fill="#5a4aa8"/>${at(0, -440, text(0, 30, "?", 120, P.cream), pop(a - 6.4))}`, pop(a - 5.7)) : "";
  const g = night(c, tot, 53) + layer(skyline(31, -900, 3200, MG - 10, 80, 260, "#2a1d66", "#ffb066"), c, 0.45) + layer(ground(MG) + mon + ai + real, c);
  return { g, out: toScreen(c, MX, MG - 300), outC: "#ffe8a8", outZ: 18 };
}

// ---- 5: the recovery scam ----
function s5(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.25], [3.5, 920, 540, 1.22], [8.06, 900, 520, 1.18]]);
  const ring = a > 1.4 && a < 2.4 ? 8 * Math.sin(a * 60) : 0;
  const phone = at(560 + ring, 740, hotPhone({ glow: "#9fe7ff", inner: at(0, -20, headset(P.ink), 1.2) }), 1.2);
  // the caller's badge: RECOVERY, a shield; later it flips over to the mask
  const fl = seg(a, 4.7, 5.2), badgeFront = `${two("M0 -130L110 -90V0Q110 90 0 140Q-110 90 -110 0V-90Z", P.green, P.greenD, 0, 8)}${text(0, 18, "RECOVERY", 40, "#fff")}`;
  const badgeBack = `${two("M0 -130L110 -90V0Q110 90 0 140Q-110 90 -110 0V-90Z", P.ink, "#0c0826", 0, 8)}${at(0, 0, mask(P.ink, P.red), 0.75)}`;
  const badge = a > 1.6 ? at(1060, 470, fl < 0.5 ? `<g transform="scale(${(1 - 2 * fl).toFixed(3)} 1)">${badgeFront}</g>` : `<g transform="scale(${(2 * fl - 1).toFixed(3)} 1)">${badgeBack}</g>`, 1.9 * pop(a - 1.6)) : "";
  // a fee coin goes from the phone into the badge, on "small fee"
  const fee = seg(a, 3.7, 4.3), feeC = fee > 0 && fee < 1 ? at(...bez([600, 560], [840, 320], [1060, 470], ease(fee)), coin(42, "$")) : "";
  // robbed twice: two coins with crosses, side by side
  const twice = a > 5.8 ? [0, 1].map((k) => at(840 + k * 200, 170, coin(64, "$") + (a > 6.0 + k * 0.25 ? cross(44, -44, 26, P.red, a - 6.0 - k * 0.25) : ""), pop(a - 5.8 - k * 0.25))).join("") : "";
  const g = night(c, tot, 61) + layer(skyline(57, -900, 3200, 1000, 80, 260, "#2a1d66", "#ffb066"), c, 0.45) + layer(ground(1000) + phone + badge + feeC + twice, c);
  return { g, in: [960, 540], inC: P.ink, inZ: 16, out: toScreen(c, 1080, 420), outC: P.ink, outZ: 18 };
}

// ---- 6–9: the four warning signs on one road ----
const SX = [520, 1220, 1920, 2620], SY = 880;
const signPost = (n, inner, warn = 0) => `<rect x="-12" y="-120" width="24" height="120" fill="${P.steelD}"/>${two("M0 -560L250 -330L0 -100L-250 -330Z", mix(P.gold, P.red, warn), mix(P.goldD, P.redD, warn), 0, 10)}<path d="M0 -536L226 -330L0 -124L-226 -330Z" fill="none" stroke="${P.ink}" stroke-width="10"/>${at(-170, -520, disc(0, 0, 46, P.ink, "#0c0826") + text(0, 22, String(n), 64, P.gold), 1)}${inner}`;
function signs(at0, a, c, tot) {
  // at0: which sign the shot is about (0..3); a: the age in that shot. Earlier signs keep their finished state.
  const age = (k) => (k < at0 ? 99 : k === at0 ? a : -1);
  const i0 = (u) => { // GUARANTEED stamp that cracks
    const cr = seg(u, 2.0, 2.6); return at(0, -330, `${two(rr(-170, -60, 340, 120, 14), P.cream, P.creamD, 0, 6)}${text(0, 22, "GUARANTEED", 52, P.green)}${cr > 0 ? drawn("M-150 -50L-60 0L-90 20L20 40L50 10L140 60", cr, P.ink, 9) : ""}${u > 2.6 ? cross(150, -60, 30, P.red, u - 2.6) : ""}`, 0.85, -8 * seg(u, 2.0, 2.4)); };
  const i1 = (u) => { const sp = u * (u > 0.6 ? 4 : 1); const fill = clamp(1 - ((sp * 0.4) % 1));
    return at(0, -330, `<path d="M-70 -110H70L10 0L70 110H-70L-10 0Z" fill="#cfe9ff" opacity=".35" stroke="${P.ink}" stroke-width="10"/><path d="M${-60 * fill} ${-100 + 90 * (1 - fill)}H${60 * fill}L0 -6Z" fill="${P.gold}"/><path d="M-50 ${100 - 90 * (1 - fill)}H50L50 100H-50Z" fill="${P.gold}"/><path d="M0 -6V100" stroke="${P.gold}" stroke-width="5" stroke-dasharray="8 8"/>${u > 0.6 ? at(120, -120, `${rings(0, 0, 40, P.red, 0.4 * Math.abs(Math.sin(u * 10)))}${disc(0, 0, 26, P.red, P.redD)}`, pop(u - 0.6)) : ""}`, 0.8, u > 0.6 ? 6 * Math.sin(u * 30) : 0); };
  const i2 = (u) => at(0, -300, `${at(0, 20, seedSlip(), 0.6)}${at(60, lerp(-420, -30, ease(seg(u, 1.0, 1.7))), hook(500), 0.7)}${u > 2.2 ? cross(0, -10, 54, P.red, u - 2.2) : ""}`, 1);
  const i3 = (u) => at(0, -330, `${two(rr(-150, -50, 300, 100, 50), P.green, P.greenD, 0, 6)}<path d="M-40 -20v40m-16 -16l16 16l16 -16" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>${u > 0.7 ? at(140, -40, `<path d="M-24 -18v-14a24 24 0 0 1 48 0v14" fill="none" stroke="${P.steel}" stroke-width="10"/>${two(rr(-34, -18, 68, 56, 10), P.gold, P.goldD, 0, 5)}`, pop(u - 0.7)) : ""}${u > 1.6 ? at(-150, -120, coin(36, "$") + text(48, 14, "?", 60, P.cream, { anchor: "start" }), pop(u - 1.6)) : ""}`, 0.85);
  const IN = [i0, i1, i2, i3];
  let road = `<rect x="-1200" y="${SY}" width="5200" height="900" fill="#221650"/><path d="M-1200 ${SY + 90}H4000" stroke="#4a3a8a" stroke-width="12" stroke-dasharray="60 50"/>`;
  SX.forEach((x, k) => { const ag = age(k); if (ag < 0 && k > at0 + 1) return; road += at(x, SY, signPost(k + 1, ag >= 0 ? IN[k](ag) : "", ag > 0 ? 0.25 : 0), ag < 0 ? 0.9 : 1); });
  return night(c, tot, 83) + layer(skyline(77, -900, 4000, SY - 20, 80, 260, "#2a1d66", "#ffb066"), c, 0.45) + layer(road, c);
}
const sCam = (k, a, E) => camAt(a, [[0, k ? SX[k - 1] + 160 : SX[0] - 200, 560, k ? 1.3 : 1.0], [k ? 0.55 : 0.6, SX[k], 560, 1.6], [E, SX[k] + 30, 560, 1.66]]);
function s6(a, tot, s) { const E = (s.ends || [])[6] || 4.05, c = sCam(0, a, E); return { g: signs(0, a, c, tot), in: [960, 540], inC: P.gold, inZ: 16 }; }
function s7(a, tot, s) { const E = (s.ends || [])[7] || 2.63; return { g: signs(1, a, sCam(1, a, E), tot) }; }
function s8(a, tot, s) { const E = (s.ends || [])[8] || 3.43; return { g: signs(2, a, sCam(2, a, E), tot) }; }
function s9(a, tot, s) { const E = (s.ends || [])[9] || 3.14, c = sCam(3, a, E); return { g: signs(3, a, c, tot), out: toScreen(c, SX[3], SY - 330), outC: P.gold, outZ: 18 }; }

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];
export const c3scamsSet = makeSet(SHOTS, V, P);
