// "Steam" (electricity part 2): how most stations make electricity. Five shots, no people.
//   0 a boiler as big as a building beside the teal house; water fills it, coal tumbles in under it, a gas flame lights
//   1 steam rushes along a pipe into the turbine, the turbine spins the generator, a bulb lights (one chain, tracked)
//   2 a nuclear plant: an atom splits with a flash inside the reactor… and all that comes out is the same steam (host right)
//   3 a fingertip pellet on one pan, a mountain of coal on the other: the scale balances
//   4 a volcano land: steam pours out of cracks straight into a turbine
// Shots hand over through steam (white), the bulb's glow, the flash, the pellet's glow.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, cross, check, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, E, mix, house, stars, skyline, pop, bulb, atom, nucleus, electron, tagV } from "./elec.js";
import { V } from "./steam.v.js";

export const bump = (a, t0, amt = 0.12) => (a > t0 ? 1 + amt * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 14) : 1);
export const sky = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -1200, 3100, 900, tot), c, 0.12);
export const ground = (G, w0 = -1600, w1 = 3600) => `<rect x="${w0}" y="${G}" width="${w1 - w0}" height="1400" fill="${P.ground}"/><rect x="${w0}" y="${G}" width="${w1 - w0}" height="14" fill="#0e3a4e"/>`;

// ---- props (base on y = 0 unless noted) ----
// a puff of steam (centre), r its size
export const puff = (r, o = 0.9) => `<g opacity="${o.toFixed(2)}"><circle cx="${-r * 0.5}" cy="0" r="${r * 0.7}" fill="#eaf6ff"/><circle cx="${r * 0.35}" cy="${-r * 0.25}" r="${r * 0.8}" fill="#f6fbff"/><circle cx="${r * 0.9}" cy="${r * 0.1}" r="${r * 0.55}" fill="#dceefb"/></g>`;
// a stream of steam puffs along a path of points pts (array), flowing with t; p 0..1 how far it has reached
export const steamFlow = (pts, t, p = 1, r = 34, n = 9) => { let out = ""; for (let i = 0; i < n; i++) { const q = ((t * 0.9 + i / n) % 1); if (q > p) continue; const k = q * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), f = k - j; const x = lerp(pts[j][0], pts[j + 1][0], f), y = lerp(pts[j][1], pts[j + 1][1], f); out += at(x, y, puff(r * (0.7 + 0.5 * rnd(i * 3)), 0.8)); } return out; };
// the boiler: a tall riveted drum on legs, `fill` 0..1 water seen through its window, `heat` 0..1 glow of its belly
export const boiler = (fill = 0, heat = 0, h = 620) => { const w = 360;
  return `<path d="M${-w / 2 + 30} 0L${-w / 2 + 50} -90M${w / 2 - 30} 0L${w / 2 - 50} -90" stroke="${P.steelD}" stroke-width="22" stroke-linecap="round"/>
    ${heat > 0 ? rings(0, -110, 220 * (0.7 + 0.3 * heat), "#ff8a3c", 0.25 * heat, 1.4) : ""}${two(rr(-w / 2, -h, w, h - 80, 60), "#7b8fa8", "#5d7089", 18, 0)}
    <path d="${rr(-w / 2, -150, w, 70, 30)}" fill="${mix("#5d7089", "#ff7a3c", heat * 0.8)}"/>
    ${[0.22, 0.45, 0.68].map((f) => `<path d="M${-w / 2} ${-h + h * f}H${w / 2}" stroke="#5d7089" stroke-width="8"/>` + [-1, 1].map((s) => `<circle cx="${s * (w / 2 - 20)}" cy="${-h + h * f}" r="7" fill="#4b5c73"/>`).join("")).join("")}
    <path d="${rr(-60, -h + 120, 120, h - 300, 30)}" fill="${P.ink}"/><path d="${rr(-52, -170 - (h - 316) * clamp(fill), 104, (h - 316) * clamp(fill), 24)}" fill="${E.water}"/>
    <path d="${rr(-40, -h - 60, 80, 70, 14)}" fill="#5d7089"/>`; };
// coal lumps (centre of the pile, base y = 0), n of them
export const coalPile = (n, s = 1) => { let out = ""; for (let i = 0; i < n; i++) { const row = Math.floor(Math.sqrt(i)), x = (i - row * row - row) * 46 * s + rnd(i) * 10, y = -row * 34 * s; out += at(x, y, `<path d="M-26 6L-20 -18L4 -26L26 -10L22 14L-6 20Z" fill="#2b2b38"/><path d="M-20 -18L4 -26L10 -12L-10 -6Z" fill="#4a4a5c"/>`, s); } return out; };
// a gas flame (base y = 0), flicker with t
export const flame = (t, s = 1, c = "#4f8cff", cIn = "#bfe4ff") => at(0, 0, `<path d="M-40 0Q-60 -60 ${-8 + 6 * Math.sin(t * 13)} ${-120 - 10 * Math.sin(t * 9)}Q10 -70 40 -100Q60 -40 40 0Z" fill="${c}"/><path d="M-18 0Q-26 -40 ${2 + 4 * Math.sin(t * 11)} -74Q16 -40 22 0Z" fill="${cIn}"/>`, s);
// the turbine seen face on (centre): a ring of blades turning by angle `ang`
export const turbine = (ang, r = 150) => { let bl = ""; for (let i = 0; i < 12; i++) bl += `<path d="M0 0L${r * 0.95} -18Q${r} 0 ${r * 0.95} 18Z" fill="${i % 2 ? "#c9d6e8" : "#aebfd6"}" transform="rotate(${(ang + i * 30).toFixed(2)})"/>`;
  return `${disc(0, 0, r + 26, "#5d7089", "#4b5c73", 0.06)}<circle r="${r + 8}" fill="#0a2233"/>${bl}${disc(0, 0, r * 0.22, P.gold, P.goldD)}`; };
// the generator (centre): a drum with a spinning magnet inside a copper coil, seen cut open
export const generator = (ang, glow = 0, s = 1) => at(0, 0, `${glow > 0 ? rings(0, 0, 200, P.gold, 0.22 * glow, 1.4) : ""}${two(rr(-150, -130, 300, 260, 50), "#4b5c73", "#3a495d", 10, 8)}<circle r="100" fill="#0a2233"/>
  ${Array.from({ length: 10 }, (_, i) => `<path d="M${(92 * Math.cos(i * 0.628)).toFixed(1)} ${(92 * Math.sin(i * 0.628)).toFixed(1)}L${(72 * Math.cos(i * 0.628)).toFixed(1)} ${(72 * Math.sin(i * 0.628)).toFixed(1)}" stroke="${E.cu}" stroke-width="16" stroke-linecap="round"/>`).join("")}
  <g transform="rotate(${ang.toFixed(2)})"><path d="${rr(-56, -18, 56, 36, 6)}" fill="${P.red}"/><path d="${rr(0, -18, 56, 36, 6)}" fill="#e8ecf6"/></g><circle r="10" fill="${P.ink}"/>`, s);
// a cooling tower (base y = 0), 420 tall
export const tower = (t, steamOn = 1) => `${steamOn > 0 ? [0, 1, 2, 3].map((i) => { const q = ((t * 0.3 + i / 4) % 1); return at(lerp(-30, 60, q) + 20 * Math.sin(t + i), -430 - q * 380, puff(70 + q * 70, 0.85 * steamOn * (1 - q))); }).join("") : ""}
  ${two("M-180 0Q-110 -220 -150 -420H150Q110 -220 180 0Z", "#c9d6e8", "#9fb0c8", 0, 0)}<path d="M-150 -420H150" stroke="#9fb0c8" stroke-width="14"/><path d="M-110 -120Q0 -100 110 -120" stroke="#9fb0c8" stroke-width="8" fill="none" opacity=".6"/>`;
// the reactor building: a dome (base y = 0), `inside` drawn in its window
export const reactor = (inside = "") => `${two("M-170 0V-200A170 170 0 0 1 170 -200V0Z", "#e3e9f2", "#bcc7d6", 10, 0)}<path d="${rr(-90, -250, 180, 160, 80)}" fill="#0a2233"/>${inside}<path d="M-170 -40H170" stroke="#bcc7d6" stroke-width="10"/>`;
// a fuel pellet (centre), a small dark-gold cylinder
export const pellet = (s = 1, glow = 0) => at(0, 0, `${glow > 0 ? rings(0, 0, 50, "#9cff6a", 0.3 * glow, 1.5) : ""}${two(rr(-22, -30, 44, 60, 10), "#9aa35a", "#737a3e", 6, 0)}<ellipse cx="0" cy="-30" rx="22" ry="8" fill="#b9c27a"/>`, s);
// a balance (pivot at 0, -h), tilt in degrees (+ = right pan down); L and R are drawn on the pans
export const balance = (tilt, L = "", R = "", w = 420, h = 420) => { const a = tilt * Math.PI / 180, lx = -w * Math.cos(a), ly = -h - w * Math.sin(a), rx = w * Math.cos(a), ry = -h + w * Math.sin(a);
  const pan = (x, y, inner) => `<path d="M${x} ${y}L${x - 120} ${y + 120}M${x} ${y}L${x + 120} ${y + 120}" stroke="${P.goldD}" stroke-width="5"/><path d="M${x - 150} ${y + 120}H${x + 150}Q${x + 130} ${y + 160} ${x} ${y + 160}Q${x - 130} ${y + 160} ${x - 150} ${y + 120}Z" fill="${P.gold}"/>${at(x, y + 120, inner)}`;
  return `<path d="M-120 0H120L60 -40H-60Z" fill="${P.wood}"/><path d="${rr(-14, -h, 28, h - 30, 8)}" fill="${P.wood}"/><path d="M${lx} ${ly}L${rx} ${ry}" stroke="${P.gold}" stroke-width="20" stroke-linecap="round"/>${disc(0, -h, 22, P.gold, P.goldD)}${pan(lx, ly, L)}${pan(rx, ry, R)}`; };
// a volcano (base y = 0), 900 wide
export const volcano = (t, smoke = 1) => `${[0, 1, 2].map((i) => { const q = ((t * 0.18 + i / 3) % 1); return at(30 * Math.sin(t * 0.7 + i), -560 - q * 300, `<circle r="${70 + q * 110}" fill="#4a5568" opacity="${(0.55 * smoke * (1 - q)).toFixed(2)}"/>`); }).join("")}
  ${two("M-480 0L-90 -540H90L480 0Z", "#3a3448", "#2a2536", 0, 0)}<path d="M-90 -540H90L60 -500H-60Z" fill="#ff7a3c"/><path d="M-30 -510Q-50 -380 -110 -300Q-60 -330 -20 -420Z" fill="#ff7a3c" opacity=".8"/>`;

// ---- 0: a boiler the size of a building ----
function s0(a, tot) {
  const G = 900, c = camAt(a, [[0, 960, 560, 1.15], [1.3, 960, 540, 1.1], [3.5, 960, 470, 0.95], [4.72, 960, 450, 0.82]]);
  const fill = ease(seg(a, 1.33, 2.2)), coal = Math.floor(kf(a, [[2.56, 0], [3.0, 15]])), gas = seg(a, 3.02, 3.2), big = ease(seg(a, 3.51, 4.3));
  const heat = clamp(0.5 * seg(a, 2.6, 3.0) + 0.5 * gas), h = lerp(520, 980, big), X = 960;
  const coalG = coal > 0 ? at(X - 110, G - 4, coalPile(coal, 0.9)) : "", flames = gas > 0 ? [-60, 20, 100].map((dx, i) => at(X + dx, G - 4, flame(tot + i, 0.8 * spring(a - 3.02 - i * 0.05, 9, 16)))).join("") : "";
  const drops = a > 1.2 && a < 2.4 ? Array.from({ length: 6 }, (_, i) => { const q = ((a * 2 + i / 6) % 1); return `<circle cx="${X + 10 * Math.sin(i)}" cy="${G - h - 100 + q * 140}" r="12" fill="${E.water}" opacity="${(1 - q).toFixed(2)}"/>`; }).join("") : "";
  const hs = at(1460, G, house(E.houseA, E.houseAD, { roof: E.roof }), 0.95);
  const g = sky(c, tot, 41) + layer(skyline(5, -1200, 3200, G - 60, 120, 300, E.far, E.farLit), c, 0.4)
    + layer(ground(G) + hs + at(X, G, boiler(fill, heat, h), pop(a, 7, 12)) + coalG + flames + drops + (a > 0.5 && fill > 0.98 ? at(X, G - h - 60, puff(50, 0.7 * seg(a, 2.6, 3.4))) : ""), c);
  return { g, out: toScreen(c, X, G - h - 40), outC: "#f6fbff", outZ: 14 };
}

// ---- 1: steam → turbine → generator → bulb, one chain ----
// L: positions of boiler mouth, turbine, generator, bulb and the camera keys (landscape or portrait)
export const CHAIN_L = { boiler: [260, 760], pipe: [[300, 260], [560, 260], [760, 380]], turbine: [820, 470], gen: [1250, 470], wire: [[1400, 470], [1560, 470], [1560, 300]], bulb: [1560, 330],
  cam: [[0, 520, 500, 1.2], [1.6, 820, 480, 1.15], [2.9, 1150, 470, 1.05], [4.5, 1000, 450, 0.92]] };
export function chain(a, tot, L = CHAIN_L) {
  const c = camAt(a, L.cam), sp = seg(a, 0.34, 1.29), spin = clamp(seg(a, 1.29, 1.9)), genOn = seg(a, 2.83, 3.2), lit = seg(a, 4.0, 4.3);
  const ang = 360 * (0.6 * Math.max(0, a - 1.29) ** 2 * (a < 2.5 ? 1 : 0) + (a >= 2.5 ? 0.6 * 1.21 ** 2 + 1.7 * (a - 2.5) : 0));
  const [tx, ty] = L.turbine, [gx, gy] = L.gen, pipeD = "M" + L.pipe.map((p) => p.join(" ")).join("L") + `L${tx} ${ty}`;
  const pipe = `<path d="${pipeD}" stroke="#5d7089" stroke-width="70" fill="none" stroke-linejoin="round"/><path d="${pipeD}" stroke="#3a495d" stroke-width="44" fill="none" stroke-linejoin="round"/>`;
  const flow = steamFlow([...L.pipe, [tx, ty]], tot, sp, 26);
  const shaft = `<path d="M${tx} ${ty}L${gx} ${gy}" stroke="#aebfd6" stroke-width="26" stroke-linecap="round"/>`;
  const wd = "M" + L.wire.map((p) => p.join(" ")).join("L"), wire = `<path d="${wd}" stroke="${E.cuD}" stroke-width="16" fill="none"/>` + (genOn > 0 ? drawn(wd, genOn, E.el, 8) : "");
  const bx = at(L.boiler[0], L.boiler[1], boiler(0.6, 1, 520), 0.9);
  const g = sky(c, tot, 43) + layer(`<rect x="-1400" y="${Math.max(L.boiler[1], L.gen[1] + 200)}" width="4600" height="1600" fill="${P.ground}"/>` + bx + pipe + flow + shaft + at(tx, ty, turbine(ang * (0.4 + 0.6 * spin), 170), 1) + at(gx, gy, generator(ang * 1.0, genOn), 1) + wire + at(L.bulb[0], L.bulb[1], bulb(lit), [1.1, -1.1]), c);
  return { g, out: toScreen(c, L.bulb[0], L.bulb[1] + 180), outC: "#fff3b0", outZ: 16 };
}
const s1 = (a, tot) => chain(a, tot);

// ---- 2: nuclear: split the atom… to boil water (host right: keep the lower right clear) ----
export function nuclear(a, tot, o = {}) {
  const G = o.G ?? 860, RX = o.RX ?? 620, TX = o.TX ?? 1180, c = camAt(a, o.cam || [[0, 900, 520, 0.95], [2.9, 760, 440, 1.25], [4.4, 840, 420, 1.05], [5.66, 880, 400, 0.92]]);
  const split = seg(a, 3.1, 3.5), flash = a > 3.1 ? Math.exp(-(a - 3.1) * 4) : 0, steamOn = seg(a, 4.94, 5.3);
  const at0 = split <= 0 ? atom(tot, { n: 3, R: 62, r: 10, nr: 22 }) : [-1, 1].map((s) => at(s * 50 * ease(split), 0, nucleus(16 * (1 - 0.2 * split)))).join("") + Array.from({ length: 3 }, (_, i) => at(Math.cos(i * 2.1) * 90 * split, Math.sin(i * 2.1) * 90 * split, electron(9))).join("");
  const inside = at(0, -170, at0, pop(a - 0.95, 7, 12));
  const R = at(RX, G, reactor(inside), 1.2);
  const T = at(TX, G, tower(tot, steamOn), 1.15 * bump(a, 4.94, 0.06));
  const g = sky(c, tot, 47) + layer(skyline(9, -1200, 3200, G - 60, 100, 260, E.far, E.farLit), c, 0.4) + layer(ground(G) + R + T + (flash > 0.02 ? rings(RX, G - 200 * 1.2, 260 * (1 + split), "#fff3b0", 0.5 * flash, 1.6) : ""), c)
    + (flash > 0.02 ? `<rect width="${FW}" height="${FH}" fill="#fff8dc" opacity="${(0.35 * flash).toFixed(3)}"/>` : "");
  return { g, out: toScreen(c, TX, G - 520), outC: "#f6fbff", outZ: 14 };
}
const s2 = (a, tot) => nuclear(a, tot);

// ---- 3: one pellet weighs (in energy) as much as a ton of coal ----
export function scale3(a, tot, o = {}) {
  const X = o.X ?? 960, c = camAt(a, o.cam || [[0, 960, 560, 1.25], [1.6, 960, 520, 1.1], [3.68, 960, 520, 1.02]]), G = o.G ?? 960;
  const pIn = pop(a - 0.6), coalIn = Math.floor(kf(a, [[2.4, 0], [3.0, 36]])), tilt = kf(a, [[0.6, 0], [1.0, -16], [2.5, -16], [3.13, 0]]);
  const L = pIn > 0 ? at(0, -34, pellet(1.6 * pIn, seg(a, 1.81, 2.2))) : "", R = coalIn > 0 ? at(0, -8, coalPile(coalIn, 0.62)) : "";
  const g = sky(c, tot, 53) + layer(ground(G) + at(X, G, balance(tilt, L, R, o.w ?? 440, 460), 1.05) + (a > 3.13 ? at(X, G - 560, check(0, 0, 44, P.green, a - 3.13)) : ""), c);
  return { g, in: toScreen(c, X, G - 400), inC: "#f6fbff", out: toScreen(c, X - (o.w ?? 440), G - 340), outC: "#9cff6a", outZ: 12 };
}
const s3 = (a, tot) => scale3(a, tot);

// ---- 4: a volcano land: steam from the ground ----
export function geo(a, tot, o = {}) {
  const G = o.G ?? 880, c = camAt(a, o.cam || [[0, 760, 460, 0.9], [1.6, 900, 560, 1.05], [3.46, 1080, 600, 1.15]]), TX = o.TX ?? 1380, CR = o.CR ?? [760, 920, 1080];
  const vents = seg(a, 1.02, 1.4), into = seg(a, 1.55, 2.4), spin = seg(a, 2.0, 2.64), ang = 360 * 1.2 * Math.max(0, a - 2.0) ** 1.5;
  const cracks = CR.map((x, i) => `<path d="M${x - 60} ${G + 4}L${x - 20} ${G - 6}L${x + 10} ${G + 6}L${x + 60} ${G - 4}" stroke="#ff7a3c" stroke-width="10" fill="none" opacity="${(0.4 + 0.6 * vents).toFixed(2)}"/>` + (vents > 0 ? [0, 1, 2].map((j) => { const q = ((tot * 0.7 + j / 3 + i * 0.2) % 1); const x0 = x + 20 * Math.sin(tot + j), y0 = G - q * 300; const tx = lerp(x0, TX - 220, into * q), ty = lerp(y0, G - 260, into * q); return at(tx, ty, puff(30 + 40 * q, 0.75 * vents * (1 - q))); }).join("") : "")).join("");
  const g = sky(c, tot, 59) + layer(at(o.VX ?? 320, G, volcano(tot), 1.1), c, 0.55) + layer(ground(G) + `<rect x="-1600" y="${G}" width="4800" height="20" fill="#3a2a2a"/>` + cracks + at(TX, G - 260, turbine(ang * spin, 140)) + `<path d="M${TX} ${G - 120}V${G}" stroke="#5d7089" stroke-width="36"/>`, c);
  return { g, in: toScreen(c, 900, G - 200), inC: "#f6fbff" };
}
const s4 = (a, tot) => geo(a, tot);

export const SHOTS = [s0, s1, s2, s3, s4];
export const steamSet = makeSet(SHOTS, V, P);
