// "Intro" of electricity part 1: five shots with nothing to read but a "?" and the race line.
//   0 night town, a wire between two poles; the camera pushes into the wire and comes out inside it: copper with blue dots
//     milling about; a "?" springs up over them (what is the thing in the wire?)
//   1 pulled back over the dark town: on each word something lights from the wires: street lamps, a phone in a window,
//     a factory with its wheel turning, a hospital with its cross (the whole planet runs on it)
//   2 the same town: every light goes out at once, a clock in the sky turns one hour, cars stop in a line at a dead
//     traffic light (cut it for an hour and everything queues). Host right.
//   3 inside the wire again: one electron with a gold ring and, on the ground under it, the snail; from one start line the
//     snail pulls far ahead (the electron is slower than a snail)
//   4 a room in the teal house: the wall switch flips and the bulb lights the same instant (and yet the lamp lights at once)
// Shots 1 and 2 are one town seen by one camera (no hand-over between them). Every other hand-over goes through copper.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, through, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH } from "./kit.js";
import { P, E, mix, house, stars, skyline, pop, electron, tube, bulb, wallSwitch, snail, pole, span, spanAt, wire } from "./elec.js";
import { car } from "./props.js";
import { V } from "./eintro.v.js";

// ---- shot 0: the wire, then inside it ----
const G = 860, PL = [[-640, 0], [960, 0], [2560, 0]];   // poles
const wireA = [160 + 80, G - 534], wireB = [960 + 80, G - 534];
const qmark = (a) => (a <= 0 ? "" : at(0, 0, `${rings(0, -60, 150, P.gold, 0.2, 1.4)}${text(0, 40, "?", 300, P.gold)}`, pop(a, 8, 14)));
function inside(t, c, o = {}) {
  const drift = o.drift ?? 0;
  return `<rect width="${FW}" height="${FH}" fill="${E.cuD}"/>` + layer(`<rect x="-800" y="-800" width="3600" height="2600" fill="${E.cuD}"/>` + tube(-700, 2600, 540, 560, t, drift, { n: 40, r: 34 }), c);
}
function s0(a, tot) {
  // part A: the town, the camera pushes into the wire (0 .. 2.6); part B: inside the wire (2.6 ..)
  const T = 2.55, mid = spanAt(wireA, wireB, 30, 0.5);
  if (a < T) {
    const c = camAt(a, [[0, 960, 520, 1], [1.2, 900, 470, 1.15], [2.2, mid[0], mid[1], 2.6], [T, mid[0], mid[1], 3.4]]);
    const g = town(tot, c, { lit: 0, pulses: [seg(a, 0.2, 2.4) * 0.5 + 0.12] });
    const p = seg(a, 1.6, T); const [sx, sy] = toScreen(c, mid[0], mid[1]);
    return { g: through(g, sx, sy, easeIn(p), E.cuD, 20) };
  }
  const u = a - T, c = camAt(u, [[0, 960, 540, 1.5], [1.75, 960, 520, 1]]);
  const g = through(inside(tot, c, { drift: 30 * u }) + at(960, 330, qmark(a - 3.4)), 960, 540, 1 - easeOut(seg(u, 0, 0.5)), E.cuD, 20);
  return { g, out: [960, 540], outC: E.cuD, outZ: 14 };
}

// ---- the town of shots 1 and 2 ----
const phone = (on) => `${two(rr(-40, -78, 80, 156, 14), "#16323f", "#0c2230", 0, 6)}<path d="${rr(-32, -64, 64, 120, 6)}" fill="${mix("#0c2230", "#7fe7ff", on)}"/>${on > 0 ? `<path d="${rr(-22, -50, 44, 10, 4)}${rr(-22, -32, 30, 10, 4)}${rr(-22, -14, 38, 10, 4)}" fill="#ffffff" opacity="${(0.7 * on).toFixed(2)}"/>` : ""}`;
const gear = (r, rot, c, cD) => { let d = ""; for (let i = 0; i < 10; i++) { const a0 = (i / 10) * Math.PI * 2; d += `${rr(-r * 0.16, -r * 1.18, r * 0.32, r * 0.4, 4)}`.replace(/^/, ""); }
  const teeth = Array.from({ length: 10 }, (_, i) => `<path d="${rr(-r * 0.15, -r * 1.2, r * 0.3, r * 0.42, 5)}" fill="${c}" transform="rotate(${i * 36})"/>`).join("");
  return `<g transform="rotate(${rot.toFixed(1)})">${teeth}${disc(0, 0, r, c, cD)}<circle r="${r * 0.32}" fill="${P.ink}"/></g>`; };
const lampHead = (on) => `<path d="M0 0h-90" stroke="${P.woodD}" stroke-width="12"/><path d="M-130 -6h80l-10 26h-60Z" fill="#183a4a"/>${on > 0 ? `<path d="M-120 20L-180 300H0L-60 20Z" fill="#ffe7a0" opacity="${(0.16 * on).toFixed(3)}"/>` + rings(-90, 26, 30, "#ffe7a0", 0.5 * on, 1.6) : ""}<circle cx="-90" cy="22" r="14" fill="${on > 0 ? "#fff3c0" : "#2a4a5a"}"/>`;
// everything that runs on the wires; `on` is how lit each one is: [street, phone, factory, hospital], `all` the windows
function town(tot, c, o = {}) {
  const on = o.on || [o.lit ?? 0, o.lit ?? 0, o.lit ?? 0, o.lit ?? 0], all = o.all ?? Math.max(...on), q = o.queue || 0;
  const far = skyline(11, -900, 3000, G - 140, 140, 360, E.far, all > 0.5 ? E.farLit : false);
  const street = `<rect x="-1200" y="${G}" width="4400" height="700" fill="${P.ground}"/><rect x="-1200" y="${G + 60}" width="4400" height="150" fill="${P.road}"/><path d="M-1200 ${G + 135}H3200" stroke="${on[0] > 0.5 ? "#ffcf6b" : "#24485a"}" stroke-width="8" stroke-dasharray="70 60" opacity=".55"/>`;
  // a tower block with the phone in its big window (x 330)
  const block = at(330, G, `${two(rr(-150, -520, 300, 520, 8), "#1d5a74", "#14465c", 14, 0)}${[0, 1, 2, 3].map((r) => [0, 1, 2].map((k) => (r === 1 && k > 0) ? "" : `<rect x="${-118 + k * 84}" y="${-490 + r * 110}" width="64" height="72" rx="8" fill="${all > 0.3 && (r + k) % 2 ? P.win : P.ink}"/>`).join("")).join("")}
    <path d="${rr(-34, -392, 154, 164, 10)}" fill="${mix(P.ink, "#0f4a66", on[1])}"/>${on[1] > 0 ? rings(43, -310, 80, "#7fe7ff", 0.25 * on[1], 1.4) : ""}${at(43, -310, phone(on[1]), 0.9 + 0.1 * pop(o.phoneA ?? 0))}`);
  // the factory: saw-tooth roof, a chimney, a wheel on its front (x 960)
  const fr = (o.wheel || 0) * 140;
  const factory = at(960, G, `${on[2] > 0 ? [0, 1, 2].map((i) => { const k = ((tot * 0.4 + i / 3) % 1); return `<circle cx="${170 + k * 80}" cy="${-560 - k * 220}" r="${26 + k * 46}" fill="#5f7f8f" opacity="${(0.5 * on[2] * (1 - k)).toFixed(2)}"/>`; }).join("") : ""}
    ${two(rr(130, -560, 80, 280, 6), "#c75b3a", "#a2462c", 10, 0)}${two(rr(-260, -300, 520, 300, 6), "#d9682f", "#b2521f", 16, 0)}
    ${[0, 1, 2, 3].map((i) => two(`M${-260 + i * 130} -300L${-260 + i * 130} -400L${-130 + i * 130} -300Z`, "#b2521f", "#8a3e17", 0, 8)).join("")}
    ${[-190, 190].map((x) => `<path d="${rr(x - 50, -230, 100, 90, 8)}" fill="${mix(P.ink, P.win, on[2])}"/>`).join("")}${on[2] > 0 ? rings(0, -140, 95, P.gold, 0.25 * on[2], 1.3) : ""}${at(0, -140, gear(70, fr, mix("#5f7f8f", P.gold, on[2]), mix("#3f5f6f", P.goldD, on[2])))}`);
  // the hospital: white, a cross on its roof that lights red (x 1560)
  const hosp = at(1560, G, `${two(rr(-200, -420, 400, 420, 8), "#e8f3f6", "#c3d7de", 16, 0)}${[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => `<rect x="${-170 + k * 88}" y="${-380 + r * 100}" width="60" height="60" rx="8" fill="${mix("#33515f", "#ffe6a8", on[3])}"/>`).join("")).join("")}
    <path d="${rr(-40, -90, 80, 90, 8)}" fill="#33515f"/>${on[3] > 0 ? rings(0, -530, 90, P.red, 0.3 * on[3], 1.4) : ""}${at(0, -530, `<path d="M-24 -70h48v46h46v48h-46v46h-48v-46h-46v-48h46Z" fill="${mix("#7a8f98", P.red, on[3])}"/>`, 1 + 0.25 * (1 - spring(Math.max(0, o.crossA ?? 0), 9, 16)) * (on[3] > 0 ? 1 : 0))}`);
  // poles with street lamps, and the wires
  const xs = [-640, 160, 960, 1760, 2560];
  const poles = xs.map((x) => at(x, G, pole(560) + at(0, -470, lampHead(on[0])))).join("");
  let wires = ""; for (let i = 0; i < xs.length - 1; i++) wires += span([xs[i] - 80, G - 534], [xs[i + 1] - 80, G - 534], 30, "#0a1e2c", 6) + span([xs[i] + 80, G - 534], [xs[i + 1] + 80, G - 534], 30, "#0a1e2c", 6);
  wires += wire(`M240 ${G - 534}Q640 ${G - 534 + 60} 1040 ${G - 534}`, 9);   // the wire of the story: copper
  // a pulse runs along the wires as each thing lights
  const pulse = (o.pulses || []).map((p) => { if (p <= 0 || p >= 1) return ""; const x = lerp(-640, 2560, p), i = Math.min(3, Math.floor((x + 640) / 800)), f = (x - xs[i]) / 800, pt = spanAt([xs[i] + 80, G - 534], [xs[i + 1] + 80, G - 534], 30, f);
    return rings(pt[0], pt[1], 30, "#9ff2ff", 0.6, 1.8) + `<circle cx="${pt[0]}" cy="${pt[1]}" r="12" fill="#fff"/>`; }).join("");
  // the dead traffic light and the queue (shot 2)
  const tl = at(1240, G + 40, `<rect x="-10" y="-420" width="20" height="420" fill="#183a4a"/>${two(rr(-46, -560, 92, 210, 18), "#183a4a", "#0d2633", 0, 6)}${[0, 1, 2].map((i) => `<circle cy="${-525 + i * 68}" r="24" fill="${q > 0 ? "#0b1a24" : ["#ff4d5a", "#ffd04a", "#3ddc97"][i]}" opacity="${q > 0 ? 1 : 0.35}"/>`).join("")}`);
  const cars = q > 0 ? [[1060, 0.0, P.red, P.redD], [790, 0.18, E.houseA, E.houseAD], [520, 0.36, P.gold, P.goldD], [250, 0.54, E.houseB, E.houseBD], [-20, 0.72, "#7fb2ff", "#5a8ad6"]].map(([x, d, c1, c2]) => {
    const u = q - d; if (u <= 0) return ""; const arrive = easeOut(seg(u, 0, 0.55)), bob = u > 0.55 ? 1 - 0.05 * Math.exp(-(u - 0.55) * 8) * Math.cos((u - 0.55) * 18) : 1;
    return at(lerp(x - 900, x, arrive), G + 170, car(c1, c2), [1.25, 1.25 * bob]); }).join("") : "";
  return `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(7, 80, -900, 3000, 520, tot), c, 0.15) + layer(far, c, 0.5)
    + layer(street + block + factory + hosp + poles + wires + pulse + tl + cars, c) + (o.dim ? `<rect width="${FW}" height="${FH}" fill="#000814" opacity="${o.dim.toFixed(3)}"/>` : "");
}
// shot 1 and 2 are one timeline: t from the start of shot 1
const T2 = (s) => (s.ends || [])[1] || 4.59;
function townAt(t, tot, s, c) {
  const u = t - T2(s);
  const lights = [seg(t, 1.5, 1.7), seg(t, 2.08, 2.25), seg(t, 2.9, 3.1), seg(t, 3.58, 3.75)];
  const off = u > 0.15 ? (u < 0.45 ? (Math.sin(u * 90) > 0 ? 0.3 : 1) : 1) * seg(u, 0.15, 0.5) : 0;   // a flicker, then dark
  const on = lights.map((v) => v * (1 - off));
  return town(tot, c, { on, all: Math.max(...on), wheel: Math.max(0, t - 2.95) * (1 - off), phoneA: t - 2.12, crossA: t - 3.63, pulses: [seg(t, 1.0, 1.6), seg(t, 1.6, 2.3), seg(t, 2.3, 3.1), seg(t, 3.0, 3.8)].map((p) => p * 0.75 + 0.05).map((p, i) => (lights[i] < 1 ? p : 2)), queue: u - 1.6, dim: 0.25 * off });
}
function s1(a, tot, s) {
  const c = camAt(a, [[0, 980, 380, 1.7], [1.4, 960, 470, 1.05], [4.59, 960, 500, 0.95]]);
  const ip = spanAt([240, G - 534], [1040, G - 534], 30, 0.5); return { g: townAt(a, tot, s, c), in: toScreen(c, ip[0], ip[1]), inC: E.cuD };
}
function s2(a, tot, s) {
  const c = camAt(a, [[0, 960, 500, 0.95], [3.47, 840, 520, 0.98]]);
  // the clock: one hour goes round
  const clk = a > 0.4 ? at(560, 230, `${rings(0, 0, 110, "#9ff2ff", 0.15, 1.3)}${disc(0, 0, 100, "#e8f3f6", "#c3d7de", 0.08)}${[0, 1, 2, 3].map((i) => `<rect x="-5" y="-88" width="10" height="20" fill="${P.ink}" transform="rotate(${i * 90})"/>`).join("")}<path d="M0 0V-48" stroke="${P.ink}" stroke-width="12" stroke-linecap="round" transform="rotate(${(30 * ease(seg(a, 0.76, 1.65))).toFixed(1)})"/><path d="M0 0V-76" stroke="${P.red}" stroke-width="8" stroke-linecap="round" transform="rotate(${(360 * ease(seg(a, 0.76, 1.65))).toFixed(1)})"/><circle r="10" fill="${P.ink}"/>${text(200, 34, "1 h", 110, P.cream, { opacity: seg(a, 1.2, 1.5).toFixed(2) })}`, pop(a - 0.4)) : "";
  const p = seg(a, 3.2, 3.47); const wp = spanAt([240, G - 534], [1040, G - 534], 30, 0.5), [sx, sy] = toScreen(c, wp[0], wp[1]);
  return { g: townAt(T2(s) + a, tot, s, c) + clk, out: [sx, sy], outC: E.cuD, outZ: 14 };
}

// ---- shot 3: the race ----
function s3(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.04], [4.35, 1000, 540, 1]]);
  const ex = 470 + 26 * a, sx = 150 + kf(a, [[0, 0], [1.5, 80], [2.7, 220], [4.35, 900]], (p) => p * p * (3 - 2 * p));
  const lane = `<rect x="-600" y="930" width="3200" height="500" fill="${P.ground}"/><path d="M-600 930H2600" stroke="#1f6d8c" stroke-width="10"/>`;
  const start = `<path d="M400 150V1060" stroke="${P.cream}" stroke-width="14" stroke-dasharray="40 30" opacity=".85"/>`;
  const me = at(ex, 380, electron(56, { glow: 1 }) + `<circle r="72" fill="none" stroke="${P.gold}" stroke-width="8"/>`);
    const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(23, 60, -400, 2400, 300, tot), c, 0.15)
    + layer(tube(-600, 2600, 380, 360, tot, 18 * a, { n: 30, r: 28 }) + lane + start + me + at(sx, 930, snail(tot), 2.0) , c);
  return { g, in: toScreen(c, 960, 380), inC: E.cuD, out: toScreen(c, 1400, 380), outC: E.cuD, outZ: 14 };
}

// ---- shot 4: the switch and the bulb, at once ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1], [1.81, 980, 520, 1.06]]), flip = seg(a, 0.45, 0.6), on = a > 0.55 ? clamp(0.2 + 0.8 * spring(a - 0.55, 7, 14)) : 0;
  const wall = `<rect x="-400" y="-400" width="2800" height="1900" fill="#0f4258"/><rect x="-400" y="930" width="2800" height="600" fill="#0a2e3e"/><rect x="-400" y="920" width="2800" height="20" fill="#0c3a4e"/>`
    + `<rect x="-400" y="-400" width="2800" height="1900" fill="#ffe7a0" opacity="${(0.12 * on).toFixed(3)}"/>`;
  const d = "M480 300V150H1180V250";
  const run = a > 0.5 ? drawn(d, ease(seg(a, 0.5, 0.6)), "#fff6c0", 10) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="#0f4258"/>` + layer(wall + wire(d, 16) + run + at(480, 560, wallSwitch(flip), 2.2) + at(1180, 840, bulb(on), 1.7), c);
  return { g, in: toScreen(c, 850, 150), inC: E.cuD };
}

export const SHOTS = [s0, s1, s2, s3, s4];
export const eintroSet = makeSet(SHOTS, V, P);
