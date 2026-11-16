// Crypto part 2, "hash": five shots with nothing to read but a few hex digits.
//   0 the hash machine: a slip "blue pays pink 30" goes into the funnel, the gears spin, a fingerprint card comes out
//   1 the slip's 30 turns to 31; in again; a second card comes out, a whole different whorl and colour: ≠
//   2 the card is pushed back into the slot: the machine shudders, ✗; a one-way sign lights over it
//   3 a hand mincer on a counter: meat in, kofta out; a kofta pushed back at the spout bounces off, ✗ (host right)
//   4 a password card goes into the machine and is not kept: its fingerprint card goes into the cabinet drawer (host left)
// Shots 0–2 are one machine seen by one camera; 2 → 3 → 4 hand over through a cream card and a cream plate.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2hash.v.js";
import { P, mix, stars, skyline } from "./bank.js";
import { hashBox, HASH_IN, HASH_OUT, card, slip, WHO } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -600, 2600, 1080, tot), c, 0.15);
const room = (G) => `<rect x="-900" y="${G}" width="3800" height="2400" fill="#22195a"/><rect x="-900" y="${G}" width="3800" height="14" fill="#3a2a7a"/>`;

// ---- 0–2: the machine ----
const MX = 600, G = 960, MK = 1.4, MOUTH = [MX + HASH_IN[0] * MK, G + HASH_IN[1] * MK], SLOT = [MX + HASH_OUT[0] * MK, G + HASH_OUT[1] * MK];
const CA = [1390, 330], CB = [1390, 730], CK = 2.3;
function machine(t, c, tot, s) {
  const E = s.ends || [], T1 = E[0] || 5.78, T2 = T1 + (E[1] || 3.58), u = t - T1, v = t - T2;
  // the slip: above the funnel, drops in; in shot 1 back above with 30 → 31
  let sl = "";
  const drop0 = seg(t, 1.9, 2.4), drop1 = seg(u, 1.05, 1.5);
  if (t < 2.4) sl = at(MOUTH[0], lerp(MOUTH[1] - 200, MOUTH[1] + 40, easeIn(drop0)), slip("blue", "pink", "30"), 1.5 * pop(t - 0.3) * (1 - 0.6 * drop0));
  if (u >= 0 && u < 1.5) { const r = seg(u, 0.7, 0.95), amt = r < 0.5 ? "30" : "31";
    sl = at(MOUTH[0], lerp(MOUTH[1] - 200, MOUTH[1] + 40, easeIn(drop1)), (r > 0 ? rings(70, 0, 50, P.gold, 0.4 * (1 - seg(u, 1.0, 1.4))) : "") + slip("blue", "pink", amt, { amtFill: r >= 0.5 ? P.goldD : P.ink }), 1.5 * (1 - 0.6 * drop1) * (r > 0 ? 1 + 0.12 * Math.exp(-(u - 0.8) * 8) * (u > 0.8 ? 1 : 0) : 1)); }
  // the gears: fast while a slip is inside; a shudder when a card is pushed back
  const busy = (x0, x1, tt) => clamp(seg(tt, x0, x0 + 0.2) - seg(tt, x1 - 0.2, x1));
  const spin = tot * 0.6 + 14 * (kf(t, [[2.3, 0], [3.9, 1]]) + kf(u, [[1.4, 0], [1.95, 0.5]]));
  const shake = 5 * Math.sin(tot * 50) * (busy(2.3, 3.9, t) + busy(1.4, 1.95, u)) + (v > 0.5 && v < 1.0 ? 14 * Math.sin(v * 70) * (1 - seg(v, 0.5, 1.0)) : 0);
  const lamp = v > 0.5 && v < 1.4 ? P.red : P.green;
  const mach = at(MX, G, hashBox({ spin, shake, lamp, id: "m" }), MK);
  // card A: out of the slot at 3.6, up to its place; hex typed 4.6–5.3
  const cardAt = (t0, to, seed, hex, typeT, k0) => { const outP = seg(t0, 0, 0.3), go = ease(seg(t0, 0.3, 0.7));
    const x = go > 0 ? lerp(SLOT[0] + 80, to[0], go) : lerp(SLOT[0] - 40, SLOT[0] + 80, easeOut(outP)), y = go > 0 ? lerp(SLOT[1], to[1], go) - Math.sin(Math.PI * go) * 120 : SLOT[1];
    return at(x, y, (go >= 1 ? rings(0, 0, 150, mix(P.cream, P.gold, 0.4), 0.08) : "") + card(seed, { hex, shown: Math.floor(lerp(0, hex.length, seg(typeT, 0, 0.6))) }), lerp(0.55, CK, go) * (k0 || 1)); };
  let cards = "";
  if (t > 3.6) cards += cardAt(t - 3.6, CA, 6, "7f3a9", t - 4.55);
  // card B: shot 1, out at 1.8, to its place; typed 2.4–2.8; in shot 2 it is pushed back at the slot and bounces off
  if (u > 1.8) { if (v < 0) cards += cardAt(u - 1.8, CB, 7, "c04e1", u - 2.35);
    else { const back = ease(seg(v, 0.12, 0.5)), ret = ease(seg(v, 0.85, 1.3)), p = back * (1 - ret), hit = v > 0.5 && v < 0.85 ? Math.sin((v - 0.5) * 30) * 10 : 0;
      cards += at(lerp(CB[0], SLOT[0] + 230, p) + hit, lerp(CB[1], SLOT[1], p), card(7, { hex: "c04e1" }), lerp(CK, 0.9, p)); } }
  const neq = u > 2.6 ? at(CA[0] - 360, (CA[1] + CB[1]) / 2, `${disc(0, 0, 54, P.red, P.redD)}<path d="M-28 -12h56M-28 12h56M14 -34L-14 34" stroke="#fff" stroke-width="12" stroke-linecap="round"/>`, pop(u - 2.6)) : "";
  const x = v > 0.55 ? cross(SLOT[0] + 70, SLOT[1] - 120, 54, P.red, v - 0.55) : "";
  // the one-way sign over the machine
  const sign = v > 1.9 ? at(MX, 150, `${rings(0, 0, 190, P.gold, 0.18 * pop(v - 1.9))}${two(rr(-200, -62, 400, 124, 18), "#3fa9ff", "#2a80d2", 0, 8)}<path d="M-140 0h230" stroke="#fff" stroke-width="30" stroke-linecap="round"/><path d="M70 -50L150 0L70 50Z" fill="#fff"/>`, pop(v - 1.9)) : "";
  const path = v > 1.9 ? drawn(`M${MOUTH[0]} ${MOUTH[1] - 60}C${MOUTH[0] - 300} ${MOUTH[1] + 200} ${SLOT[0] - 100} ${SLOT[1] + 200} ${SLOT[0] + 120} ${SLOT[1] + 20}`, seg(v, 1.95, 2.5), P.gold, 8, 'stroke-dasharray="2 22" opacity=".7"') : "";
  return night(c, tot, 31) + layer(skyline(17, -600, 2600, G - 20, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(room(G) + path + mach + sl + cards + neq + x + sign, c);
}
function s0(a, tot, s) { const c = camAt(a, [[0, MX + 40, 420, 1.35], [1.9, MX + 40, 440, 1.3], [3.4, 980, 540, 1.0], [5.78, 990, 540, 1.0]]); return { g: machine(a, c, tot, s) }; }
function s1(a, tot, s) { const E = s.ends || [], c = camAt(a, [[0, 990, 540, 1.0], [3.58, 1000, 540, 1.0]]); return { g: machine((E[0] || 5.78) + a, c, tot, s) }; }
function s2(a, tot, s) { const E = s.ends || [], c = camAt(a, [[0, 1000, 540, 1.0], [0.6, 940, 520, 1.04], [2.98, 930, 510, 1.04]]);
  return { g: machine((E[0] || 5.78) + (E[1] || 3.58) + a, c, tot, s), out: toScreen(c, CB[0], CB[1]), outC: P.cream, outZ: 18 }; }

// ---- 3: the mincer ----
const kofta = (k = 1, rot = 0) => at(0, 0, `${two(rr(-56, -18, 112, 36, 18), "#a8582c", "#7a3c1c", 0, 5)}<path d="M-34 -6h20M0 4h22M28 -4h14" stroke="#c97a44" stroke-width="5" stroke-linecap="round"/>`, k, rot);
const meat = () => `${two("M-90 -10Q-96 -64 -20 -70Q70 -76 92 -30Q104 14 50 34Q-40 54 -90 -10Z", "#e0465a", "#b52f44", 0, 8)}<path d="M-60 -20Q0 -40 60 -16" stroke="#ffd6dc" stroke-width="12" fill="none" stroke-linecap="round"/>`;
const mincer = (crank = 0) => { const cx = 230, cy = -260, hx = cx + Math.cos(crank) * 150, hy = cy + Math.sin(crank) * 150;
  return `<path d="${rr(-50, -200, 100, 200, 10)}" fill="${P.steelD}"/><path d="${rr(-90, -20, 180, 20, 8)}" fill="${P.steelD}"/>
    <path d="M-30 -330L-90 -500H210L150 -330Z" fill="${P.steel}"/><path d="M-90 -500H210L200 -480H-80Z" fill="#cdd5ee"/>
    ${two(rr(-210, -330, 440, 140, 70), P.steel, P.steelD, 0, 10)}${disc(-216, -260, 80, "#c3cbe6", P.steelD)}${[[-240, -290], [-196, -290], [-240, -240], [-196, -236], [-218, -264]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${P.ink}"/>`).join("")}
    <path d="M${cx} ${cy}L${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="${P.steelD}" stroke-width="22" stroke-linecap="round"/>${disc(cx, cy, 24, P.steel, P.steelD)}${two(rr(hx - 22, hy - 60, 44, 70, 20), P.wood, P.woodD, 0, 6)}`; };
function s3(a, tot) {
  const CY = 900, MXc = 1000;
  const c = camAt(a, [[0, 900, 580, 1.05], [2.4, 880, 590, 1.0], [4.37, 860, 600, 1.02]]);
  const crank = 1.2 * kf(a, [[1.15, 0], [2.7, 9]]);
  const meatY = a < 1.0 ? CY - 760 : lerp(CY - 760, CY - 600, easeIn(seg(a, 1.0, 1.4)));
  const m = a < 1.45 ? at(MXc + 60, meatY, meat(), 1.3 * pop(a - 0.35)) : "";
  // the strand of mince out of the spout, cut into koftas that drop on the plate
  const SP = [MXc - 216 * 1.4 - 70, CY - 260 * 1.4]; const PL = [440, CY - 20];
  let ko = "";
  const strand = seg(a, 1.75, 2.45), slots = [-180, 0, 180];
  if (strand > 0 && strand < 1) ko += `<path d="${rr(SP[0] - 150 * strand, SP[1] - 22, 150 * strand + 20, 44, 22)}" fill="#a8582c"/>`;
  slots.forEach((dx, i) => { const t0 = 1.9 + i * 0.2, p = seg(a, t0, t0 + 0.35); if (p <= 0) return;
    const pushed = i === 2 ? seg(a, 3.0, 3.3) * (1 - seg(a, 3.35, 3.7)) : 0, hop = i === 2 && a > 3.35 && a < 3.7 ? Math.sin((a - 3.35) * 9) * 40 : 0;
    const x0 = lerp(SP[0] - 120, PL[0] + dx, p), y0 = lerp(SP[1], PL[1] - 40, easeIn(p)), x = lerp(x0, SP[0] - 60, ease(pushed)), y = lerp(y0, SP[1], ease(pushed)) - hop;
    ko += at(x, y, kofta(1.5, (1 - p) * 20 + (i === 2 && a > 3.35 && a < 3.7 ? 30 * Math.sin((a - 3.35) * 20) : 0))); });
  const x = a > 3.32 ? cross(SP[0] - 40, SP[1] - 130, 60, P.red, a - 3.32) : "";
  const plate = at(PL[0], PL[1] + 10, `<g transform="scale(1.5)"><ellipse cx="0" cy="8" rx="190" ry="36" fill="${P.creamD}"/><ellipse cx="0" cy="0" rx="190" ry="34" fill="${P.cream}"/><ellipse cx="0" cy="0" rx="130" ry="20" fill="#f4e6c4"/></g>`);
  const counter = `<rect x="-600" y="${CY}" width="3200" height="40" fill="${P.wood}"/><rect x="-600" y="${CY + 40}" width="3200" height="2400" fill="${P.woodD}"/><path d="M-600 ${CY - 900}h3200V${CY}h-3200Z" fill="#2c1f63"/>${Array.from({ length: 9 }, (_, i) => `<path d="${rr(-300 + i * 300, CY - 900, 270, 900, 0)}" fill="#33246f" opacity=".6"/>`).join("")}`;
  const g = `<rect width="${FW}" height="${FH}" fill="#2c1f63"/>` + layer(counter + plate + at(MXc, CY, mincer(crank), 1.4) + m + ko + x, c);
  return { g, in: toScreen(c, PL[0], PL[1]), inC: P.cream, inZ: 18, out: toScreen(c, PL[0], PL[1]), outC: P.cream, outZ: 18 };
}

// ---- 4: your password is kept as its fingerprint ----
function s4(a, tot) {
  const MX4 = 860, G4 = 980, K4 = 1.4, M4 = [MX4, G4 + HASH_IN[1] * K4], S4 = [MX4 + HASH_OUT[0] * K4, G4 + HASH_OUT[1] * K4], CAB = [1580, G4];
  const c = camAt(a, [[0, 1060, 560, 1.0], [2.0, 1060, 560, 1.0], [3.3, 1100, 560, 1.02], [5.56, 1110, 560, 1.03]]);
  // everything goes through it: three small things in a row, three small cards fly off
  const items = [["slip", 0.15], ["photo", 0.55], ["mail", 0.95]];
  let small = "";
  items.forEach(([kind, t0], i) => { const d = seg(a, t0, t0 + 0.35), o = seg(a, t0 + 0.45, t0 + 1.2); if (d > 0 && d < 1) {
      const inner = kind === "slip" ? slip(["teal", "pink", "violet"][i], "blue", String(5 + i * 7)) : kind === "photo" ? `${two(rr(-60, -50, 120, 100, 8), "#fff", P.creamD, 0, 6)}<path d="M-46 30L-10 -10L14 14L30 0L48 30Z" fill="${P.green}"/><circle cx="26" cy="-22" r="12" fill="${P.gold}"/>` : `${two(rr(-70, -44, 140, 88, 8), P.cream, P.creamD, 0, 6)}<path d="M-70 -44L0 10L70 -44" fill="none" stroke="${P.creamD}" stroke-width="7"/>`;
      small += at(M4[0], lerp(M4[1] - 160, M4[1] + 30, easeIn(d)), inner, lerp(1.4, 0.6, d)); }
    if (o > 0 && o < 1) small += at(lerp(S4[0], 1300 + i * 120, o), lerp(S4[1], -100, easeIn(o)), card(10 + i), lerp(0.5, 0.7, o)); });
  // the password card, then down the funnel
  const pw = (o = {}) => `${two(rr(-130, -64, 260, 128, 16), P.ink, "#0c0626", 0, 7)}${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${-70 + i * 34}" cy="${o.y || 6}" r="12" fill="${o.dot || "#fff"}"/>`).join("")}<g transform="translate(-104 6)"><circle r="14" fill="none" stroke="${P.gold}" stroke-width="7"/><path d="M12 0h20m-6 0v12" stroke="${P.gold}" stroke-width="7" stroke-linecap="round"/></g>`;
  const pd = seg(a, 2.45, 2.9);
  const pwc = a > 1.95 && pd < 1 ? at(M4[0], lerp(M4[1] - 200, M4[1] + 30, easeIn(pd)), rings(0, 0, 150, P.gold, 0.12) + pw(), 1.3 * pop(a - 1.95) * (1 - 0.6 * pd)) : "";
  // at the cabinet: the outline of the password card is crossed out and turns to dust
  const ghostA = a - 3.3, ghost = ghostA > 0 && ghostA < 1.2 ? at(CAB[0], G4 - 640, `<path d="${rr(-130, -64, 260, 128, 16)}" fill="none" stroke="${P.cream}" stroke-width="6" stroke-dasharray="14 12" opacity="${(1 - seg(ghostA, 0.35, 0.7)).toFixed(2)}"/>` +
    Array.from({ length: 14 }, (_, i) => { const q = seg(ghostA, 0.35, 1.2); return q > 0 ? `<circle cx="${(-110 + (i % 7) * 36 + 30 * q * (rnd(i) - 0.5)).toFixed(1)}" cy="${(-30 + Math.floor(i / 7) * 60 + 260 * q * q).toFixed(1)}" r="${(9 * (1 - q)).toFixed(1)}" fill="${P.cream}"/>` : ""; }).join("") + cross(150, -70, 44, P.red, ghostA - 0.05)) : "";
  // its fingerprint card: out of the slot, over to the drawer, in; the drawer shuts and a ✓
  const fo = seg(a, 3.55, 3.85), fg = ease(seg(a, 3.95, 4.6)), fin = seg(a, 4.6, 4.85);
  const drawerOpen = seg(a, 3.9, 4.2) * (1 - seg(a, 4.85, 5.1));
  let fc = "";
  if (a > 3.55 && fin < 1) { const x = fg > 0 ? lerp(S4[0] + 90, CAB[0], fg) : lerp(S4[0] - 40, S4[0] + 90, easeOut(fo)), y = fg > 0 ? lerp(S4[1], G4 - 400, fg) - Math.sin(Math.PI * fg) * 220 : S4[1];
    fc = at(x, y + 60 * fin, card(6, { hex: "9be04" }), lerp(0.7, 1.3, fg) * (1 - 0.3 * fin)); }
  const cab = at(CAB[0], G4, `${two(rr(-170, -580, 340, 580, 16), "#5a6aa8", "#44529a", 0, 10)}${[0, 1, 2, 3].map((i) => { const dy = i === 1 ? -0 : 0, out = i === 1 ? 40 * drawerOpen : 0;
    return `<path d="${rr(-140 - out * 0.2, -550 + i * 136 + dy, 280 + out * 0.4, 116, 10)}" fill="${i === 1 && drawerOpen > 0 ? "#141038" : "#39447f"}"/><path d="${rr(-40, -500 + i * 136, 80, 18, 9)}" fill="${P.steel}"/>${[0, 1, 2].map((j) => `<circle cx="${100 + j * 0}" cy="${-530 + i * 136 + j * 0}" r="6" fill="${P.green}"/>`).join("")}`; }).join("")}`) + (a > 4.95 ? check(CAB[0] + 140, G4 - 640, 48, P.green, a - 4.95) : "");
  const mach = at(MX4, G4, hashBox({ spin: tot * 0.6 + 10 * kf(a, [[0.3, 0], [1.6, 0.6], [2.9, 0.6], [3.6, 1]]), shake: 4 * Math.sin(tot * 50) * (seg(a, 2.9, 3.0) - seg(a, 3.5, 3.6)), id: "p" }), K4);
  const g = night(c, tot, 37) + layer(skyline(29, -600, 2600, G4 - 20, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(room(G4) + cab + mach + small + pwc + ghost + fc, c);
  return { g, in: toScreen(c, M4[0], M4[1]), inC: P.cream, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4];
export const c2hashSet = makeSet(SHOTS, V, P);
