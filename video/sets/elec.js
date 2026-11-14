// The props of the electricity file, drawn in the world of the bank set (same palette, same night town, flat shapes with
// one shade step, glow as hard rings). Every scene of the file uses these, so the things that travel through it look the
// same everywhere: the electron (a small cyan ball with a minus), the heart of the atom (pink with a plus), the copper wire,
// the bulb of the blue house, the battery, the switch, the socket, the pylon, the storm cloud and the bolt, the rooftop
// tank of water, the kettle, the charger cube. Props are drawn around (0, 0), base on y = 0 unless the comment says centre.
import { clamp, lerp, ease, seg, spring, rnd, at, rr, circ, two, disc, rings, text, drawn } from "./kit.js";
import { P as P0, mix, house, stars, skyline } from "./bank.js";

// The electricity file has its own night, so it does not look like the crypto file (owner, 2026-11-14): the same world and
// shapes, but a teal-and-navy night lit by electric cyan and warm amber, instead of crypto's violet and pink dusk.
// Pass this P to makeSet/frame so the skies (#bnight, #bsky) follow it; use E.far / E.lit for skylines.
export const P = { ...P0, night0: "#041624", night1: "#0b4152", sky0: "#06223d", sky1: "#17607a", sky2: "#ffb04a", far: "#0f3a55", mid: "#0c3149",
  ground: "#082a3a", road: "#04192a", soil: "#03111d", ink: "#071827", violet: "#2f8fb0", violetD: "#1f6d8c", win: "#ffcf6b" };

// the colours the file adds to the bank set's palette
export const E = { cu: "#e8924f", cuD: "#b9642e", cuL: "#ffc38f", el: "#5fd6ff", elD: "#2a9fd6", plus: "#ff5fa2", plusD: "#d6407f", spark: "#d8f6ff",
  water: "#4fb6ff", waterD: "#2f86d6", rubber: "#2b2350", rubberD: "#1c1638", amber: "#ffad2a", amberD: "#d97a10", warn: "#ffd04a", grid: "#9aa6d8", houseA: "#22c7b8", houseAD: "#15988f", houseB: "#ff8a3c", houseBD: "#d9661f", roof: "#123a57", far: "#0f3a55", farLit: "#ffcf6b", hill: "#0a3346" };
export { mix, house, stars, skyline };

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
export { pop };

// ---- the electron and the heart of the atom (centre) ----
export const minus = (r, c = "#fff") => `<rect x="${-r * 0.46}" y="${-r * 0.13}" width="${r * 0.92}" height="${r * 0.26}" rx="${r * 0.12}" fill="${c}"/>`;
export const plus = (r, c = "#fff") => `${minus(r, c)}<rect x="${-r * 0.13}" y="${-r * 0.46}" width="${r * 0.26}" height="${r * 0.92}" rx="${r * 0.12}" fill="${c}"/>`;
export const electron = (r = 22, o = {}) => `${o.glow ? rings(0, 0, r * 1.5, E.el, 0.22 * o.glow, 1.5) : ""}${disc(0, 0, r, E.el, E.elD)}${o.sign === false ? "" : minus(r)}`;
export const nucleus = (r = 60, o = {}) => `${o.glow ? rings(0, 0, r * 1.4, E.plus, 0.2 * o.glow, 1.5) : ""}${disc(0, 0, r, E.plus, E.plusD)}${o.sign === false ? "" : plus(r * 0.9)}`;
// an atom: the heart and `n` electrons on their rings, turning with `t`; `out` 0..1 lifts electron 0 off its ring toward (ox, oy)
export const atom = (t, o = {}) => { const n = o.n ?? 3, R = o.R ?? 170, r = o.r ?? 22;
  const orb = [0, 1, 2].slice(0, Math.max(1, Math.min(3, n))).map((i) => `<ellipse rx="${R}" ry="${R * 0.38}" fill="none" stroke="${E.el}" stroke-width="5" opacity=".35" transform="rotate(${i * 60 - 30})"/>`).join("");
  const els = Array.from({ length: n }, (_, i) => { const a = t * (1.6 + i * 0.15) + i * 2.1, rot = ((i % 3) * 60 - 30) * Math.PI / 180, ex = R * Math.cos(a), ey = R * 0.38 * Math.sin(a);
    let x = ex * Math.cos(rot) - ey * Math.sin(rot), y = ex * Math.sin(rot) + ey * Math.cos(rot); if (i === 0 && o.out) { x = lerp(x, o.ox || 0, ease(o.out)); y = lerp(y, o.oy || 0, ease(o.out)); }
    return at(x, y, electron(r, { sign: o.signs ?? true })); }).join("");
  return orb + nucleus(o.nr ?? 54, { sign: o.signs ?? true, glow: o.glow }) + els; };

// ---- light ----
// a bulb, base on y = 0, 300 tall at k = 1; `on` 0..1 is how lit it is; o.old draws the old bulb with its thin glowing wire
export const bulb = (on = 0, o = {}) => { const glass = mix("#5a4a9a", "#fff3b0", on), glassD = mix("#463a80", "#ffd04a", on), w = o.old ? mix("#8a7ab8", "#fff", on) : mix("#7a6ab0", "#fff8d0", on);
  const fil = o.old ? `<path d="M-30 -120V-170Q-20 -196 -10 -170Q0 -144 10 -170Q20 -196 30 -170V-120" fill="none" stroke="${w}" stroke-width="${6 + 3 * on}" stroke-linejoin="round"/>`
    : `<path d="M-26 -110V-150h52V-110" fill="none" stroke="${w}" stroke-width="10" stroke-linejoin="round"/><path d="${rr(-34, -172, 68, 26, 10)}" fill="${w}"/>`;
  return `${on > 0 ? rings(0, -175, 170 * (0.6 + 0.4 * on), "#ffd98a", 0.24 * on, 1.55) : ""}<path d="M-40 -60Q-40 -96 -78 -140Q-110 -180 -100 -230A100 100 0 1 1 100 -230Q110 -180 78 -140Q40 -96 40 -60Z" fill="${glassD}"/>
    <path d="M-40 -60Q-40 -96 -78 -140Q-110 -180 -100 -230A100 100 0 0 1 86 -250Q90 -186 56 -140Q28 -100 28 -60Z" fill="${glass}"/>${fil}
    <path d="M-62 -230A66 66 0 0 1 -20 -290" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="${(0.25 + 0.35 * on).toFixed(2)}"/>
    ${two(rr(-44, -62, 88, 52, 8), P.steel, P.steelD, 0, 8)}<path d="M-44 -48h88M-44 -30h88" stroke="${P.steelD}" stroke-width="5"/><path d="M-26 -10h52l-12 10h-28Z" fill="${P.ink}"/>`; };
// a ceiling lamp on its cord (the cord hangs from y = -len), base of the bulb at y = 0
export const lamp = (on = 0, len = 300) => `<path d="M0 ${-len}V-300" stroke="${P.ink}" stroke-width="8"/>` + at(0, -300, bulb(on), [1, -1]);

// ---- wire ----
// copper wire along a path; o.jacket wraps it in rubber (0..1 how much of its length)
export const wire = (d, w = 18, o = {}) => `<path d="${d}" fill="none" stroke="${E.cuD}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${E.cu}" stroke-width="${w * 0.55}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${-w * 0.12} ${-w * 0.12})"/>
  ${o.jacket ? `<path d="${d}" pathLength="1" fill="none" stroke="${o.jc || E.rubber}" stroke-width="${w * 1.9}" stroke-linecap="round" stroke-dasharray="${clamp(o.jacket).toFixed(4)} 1"/>` : ""}`;
// a piece of copper wire cut open (a tube seen from the side), from x0 to x1 at height y, h high; dots: the free electrons,
// drifting by `drift` px (rolls on with time) and jiggling with `t`. o.crowd adds more dots, o.glow lights the tube.
export const tube = (x0, x1, y, h, t, drift = 0, o = {}) => { const n = o.n ?? Math.round((x1 - x0) / 70), L = x1 - x0, r = o.r ?? h * 0.16;
  let dots = ""; for (let i = 0; i < n; i++) { const base = (i / n) * L, x = x0 + ((base + drift) % L + L) % L, yy = y + (rnd(i * 7 + 1) - 0.5) * h * 0.55 + Math.sin(t * 7 + i * 1.7) * h * 0.06;
    dots += at(x + Math.sin(t * 9 + i) * 4, yy, electron(r, { sign: o.signs ?? r > 14 })); }
  const id = "tu" + Math.round(x0) + "_" + Math.round(y);
  return `<path d="${rr(x0 - 20, y - h / 2 - 16, L + 40, h + 32, h / 2 + 16)}" fill="${E.cuD}"/><path d="${rr(x0 - 20, y - h / 2 - 16, L + 40, 16 + h * 0.18, 12)}" fill="${E.cuL}" opacity=".5"/>
    <clipPath id="${id}"><path d="${rr(x0 - 10, y - h / 2, L + 20, h, h / 2)}"/></clipPath><path d="${rr(x0 - 10, y - h / 2, L + 20, h, h / 2)}" fill="${o.glow ? mix("#5a2a1a", "#7a3a20", o.glow) : "#4a2216"}"/><g clip-path="url(#${id})">${dots}</g>`; };

// ---- sources and switches ----
// a battery standing up, base on y = 0, 220 wide and 380 tall at k = 1; o.v: a label on its side (e.g. "1.5 V"); push 0..1 glows the + end
export const battery = (o = {}) => `${two(rr(-110, -360, 220, 360, 28), "#2b2350", "#1c1638", 12, 0)}${two(rr(-110, -360, 220, 130, 28), P.gold, P.goldD, 12, 0)}<path d="${rr(-110, -250, 220, 20, 0)}" fill="${P.goldD}"/>
  <path d="${rr(-40, -392, 80, 36, 10)}" fill="${P.steel}"/>${at(0, -292, plus(46, P.ink))}${at(0, -70, minus(46, "#8a7ab8"))}
  ${o.v ? text(0, -140, o.v, 64, P.cream) : ""}${o.push ? rings(0, -380, 70 * (0.7 + 0.3 * o.push), P.gold, 0.3 * o.push, 1.5) : ""}`;
// a knife switch, hinge at (0, 0): the blade lies flat when closed (closed 1) and stands up when open (0)
export const knife = (closed = 1, len = 200) => { const a = lerp(-62, 0, ease(closed));
  return `${two(rr(-30, -10, len + 60, 40, 10), "#4b3d8f", "#36296e", 0, 8)}${disc(0, 0, 22, P.steel, P.steelD)}${disc(len, 0, 22, P.steel, P.steelD)}
    <g transform="rotate(${a.toFixed(2)})"><path d="${rr(-8, -14, len + 20, 28, 12)}" fill="${E.cu}"/><path d="${rr(-8, -14, len + 20, 10, 6)}" fill="${E.cuL}"/></g>${disc(0, 0, 14, P.ink, P.ink)}`; };
// a wall switch plate (centre), 160 x 240; on 0..1 flips the rocker
export const wallSwitch = (on = 0) => `${two(rr(-80, -120, 160, 240, 22), P.cream, P.creamD, 8, 6)}<path d="${rr(-40, -70, 80, 140, 14)}" fill="${P.creamD}"/><path d="${rr(-36, lerp(-66, 0, ease(on)), 72, 66, 12)}" fill="#fff"/>`;
// a wall socket (centre), 220 across; o.face: two round holes (Europe) or flat slots (o.flat)
export const socket = (o = {}) => `${two(rr(-110, -110, 220, 220, 40), P.cream, P.creamD, 8, 6)}${disc(0, 0, 76, "#f3e6c8", P.creamD, 0.08)}
  ${o.flat ? `<path d="${rr(-38, -30, 18, 52, 6)}${rr(20, -30, 18, 52, 6)}" fill="${P.ink}"/><circle cx="0" cy="40" r="11" fill="${P.ink}"/>` : `<circle cx="-30" cy="0" r="15" fill="${P.ink}"/><circle cx="30" cy="0" r="15" fill="${P.ink}"/>`}`;
// a plug on the end of a cable (centre of the plug body); the cable leaves to the left
export const plugHead = (c = "#2b2350", cD = "#1c1638") => `<path d="M-300 0H-90" stroke="${c}" stroke-width="22" stroke-linecap="round"/>${two(rr(-100, -56, 130, 112, 30), c, cD, 0, 8)}<path d="${rr(30, -36, 70, 16, 6)}${rr(30, 20, 70, 16, 6)}" fill="${P.steel}"/>`;
// the phone charger's cube (centre), 200 across, with its cable going down; o.inW / o.outW draw the wave in and the straight line out
export const charger = (o = {}) => `<path d="M0 100V330" stroke="#ece8ff" stroke-width="20" stroke-linecap="round"/>${two(rr(-100, -100, 200, 200, 30), "#ece8ff", "#c6c0e6", 10, 8)}<path d="${rr(-36, -150, 20, 56, 6)}${rr(16, -150, 20, 56, 6)}" fill="${P.steel}"/>
  <circle cx="0" cy="0" r="34" fill="none" stroke="#c6c0e6" stroke-width="8"/>`;
// a breaker (centre), 120 x 220; tripped 0..1 drops the toggle
export const breaker = (tripped = 0) => `${two(rr(-60, -110, 120, 220, 14), "#ece8ff", "#c6c0e6", 6, 6)}<path d="${rr(-24, -60, 48, 120, 10)}" fill="#3a2a7a"/><path d="${rr(-22, lerp(-58, 4, ease(tripped)), 44, 54, 10)}" fill="${tripped > 0.5 ? P.red : P.green}"/>`;

// ---- the grid ----
// a lattice pylon, base on y = 0, h tall; arms carry three wires at their tips: [x, y] of each tip is in pylonTips(h)
export const pylonTips = (h = 600) => [[-h * 0.32, -h * 0.78], [h * 0.32, -h * 0.78], [0, -h * 0.98]];
export const pylon = (h = 600, c = "#9aa6d8") => { const w = h * 0.3, legs = `M${-w} 0L${-w * 0.16} ${-h * 0.92}M${w} 0L${w * 0.16} ${-h * 0.92}`;
  let lat = ""; for (let i = 0; i < 6; i++) { const y0 = -i * h * 0.15, y1 = -(i + 1) * h * 0.15, x0 = lerp(w, w * 0.16, (i * 0.15) / 0.92), x1 = lerp(w, w * 0.16, ((i + 1) * 0.15) / 0.92); lat += `M${-x0} ${y0}L${x1} ${y1}M${x0} ${y0}L${-x1} ${y1}`; }
  return `<path d="${legs}${lat}M${-h * 0.36} ${-h * 0.76}H${h * 0.36}M${-h * 0.26} ${-h * 0.62}H${h * 0.26}" fill="none" stroke="${c}" stroke-width="${Math.max(4, h * 0.016)}" stroke-linecap="round"/>
    ${pylonTips(h).map(([x, y]) => `<path d="M${x} ${y}v${h * 0.05}" stroke="${c}" stroke-width="${h * 0.012}"/><circle cx="${x}" cy="${y + h * 0.06}" r="${h * 0.014}" fill="${P.cream}"/>`).join("")}`; };
// a wooden street pole with a cross arm, base on y = 0
export const pole = (h = 520) => `${two(rr(-14, -h, 28, h, 6), P.wood, P.woodD, 6, 0)}<path d="${rr(-90, -h + 30, 180, 18, 6)}" fill="${P.woodD}"/><circle cx="-80" cy="${-h + 26}" r="9" fill="${P.cream}"/><circle cx="80" cy="${-h + 26}" r="9" fill="${P.cream}"/>`;
// a hanging wire between two points, sagging by `sag`
export const span = (a, b, sag = 40, c = "#16113a", w = 5) => `<path d="M${a[0]} ${a[1]}Q${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 + sag * 2} ${b[0]} ${b[1]}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
// a point at p along that sagging wire
export const spanAt = (a, b, sag, p) => { const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag * 2]; return [(1 - p) * (1 - p) * a[0] + 2 * (1 - p) * p * c[0] + p * p * b[0], (1 - p) * (1 - p) * a[1] + 2 * (1 - p) * p * c[1] + p * p * b[1]]; };
// a power station: a brick hall with a chimney, base on y = 0, 600 wide; o.smoke with time t; o.lit 0..1 for its windows
export const station = (t = 0, o = {}) => { const lit = o.lit ?? 1, c = o.c || "#a8473a", cD = o.cD || "#84342a";
  const smoke = o.smoke === false ? "" : [0, 1, 2, 3].map((i) => { const q = ((t * 0.35 + i / 4) % 1); return `<circle cx="${190 + q * 120 + 20 * Math.sin(t + i)}" cy="${-560 - q * 300}" r="${30 + q * 60}" fill="#6a5a8a" opacity="${(0.5 * (1 - q)).toFixed(2)}"/>`; }).join("");
  return `${smoke}${two(rr(150, -560, 90, 300, 6), c, cD, 12, 0)}<path d="${rr(140, -575, 110, 26, 6)}" fill="${cD}"/>${two(rr(-300, -300, 600, 300, 8), c, cD, 16, 0)}${two("M-320 -296L0 -420L320 -296Z", "#3a1c71", P.ink, 0, 9)}
    ${[-210, -70, 70, 210].map((x) => `<path d="M${x - 44} -40V-190A44 44 0 0 1 ${x + 44} -190V-40Z" fill="${mix(P.ink, P.win, lit)}"/>`).join("")}`; };

// ---- sky ----
// a storm cloud (centre), 600 wide at k = 1; charge 0..1 fills it with electrons (moving with t)
export const cloud = (t = 0, charge = 0, o = {}) => { const c = o.c || "#2b5a74", cD = o.cD || "#1c4157";
  const body = `M-300 60Q-330 -20 -250 -50Q-250 -150 -140 -150Q-90 -230 20 -200Q100 -260 180 -170Q290 -170 290 -70Q340 -30 300 60Z`;
  let dots = ""; const n = Math.round(14 * charge); for (let i = 0; i < n; i++) dots += at(-220 + (i % 7) * 72 + 18 * Math.sin(t * 3 + i), -20 - Math.floor(i / 7) * 70 + 10 * Math.cos(t * 4 + i), electron(20, { sign: true }));
  return two(body, c, cD, 0, -14) + dots; };
// a bolt from (x0, y0) to (x1, y1), zigzag from `seed`; p 0..1 how much of it has been drawn; flash 0..1 its brightness
export const boltPath = (x0, y0, x1, y1, seed = 1, n = 9) => { let d = `M${x0} ${y0}`; for (let i = 1; i < n; i++) { const p = i / n; d += `L${(lerp(x0, x1, p) + (rnd(seed + i) - 0.5) * 140).toFixed(1)} ${lerp(y0, y1, p).toFixed(1)}`; } return d + `L${x1} ${y1}`; };
export const bolt = (x0, y0, x1, y1, seed = 1, p = 1, flash = 1, w = 34) => { const d = boltPath(x0, y0, x1, y1, seed);
  return drawn(d, p, mix("#2a7fa0", "#9feaff", flash), w * 1.9, `stroke-linejoin="round" opacity="${(0.5 * flash).toFixed(2)}"`) + drawn(d, p, mix("#a8e8ff", "#ffffff", flash), w * 0.7, 'stroke-linejoin="round"'); };
// a spark between two points: a short bright zigzag with a star burst at its middle
export const spark = (a, b, p = 1, seed = 3) => { const d = boltPath(a[0], a[1], b[0], b[1], seed, 4); const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return (p > 0 ? rings(m[0], m[1], 60 * p, E.spark, 0.3 * p, 1.6) : "") + drawn(d, clamp(p * 1.4), E.spark, 12, 'stroke-linejoin="round"'); };

// ---- water (the analogy) ----
// a rooftop water tank on legs (base on y = 0), 300 wide; level 0..1 of water seen through its gauge window
export const tank = (level = 1, o = {}) => `<path d="M-120 0L-100 -160M120 0L100 -160M-110 -60H110" stroke="${P.steelD}" stroke-width="14" stroke-linecap="round"/>${two(rr(-150, -420, 300, 260, 30), o.c || "#5a69b3", o.cD || "#44529a", 12, 0)}
  <path d="${rr(-150, -436, 300, 30, 14)}" fill="${o.cD || "#44529a"}"/><path d="${rr(80, -400, 40, 220, 14)}" fill="${P.ink}"/><path d="${rr(84, -184 - 212 * clamp(level), 32, 212 * clamp(level), 12)}" fill="${E.water}"/>`;
// water running along a pipe path: a dashed stream that rolls with `t * speed`; w the pipe's width
export const flow = (d, t, speed = 1, w = 40, o = {}) => `<path d="${d}" fill="none" stroke="${o.pipe || P.steelD}" stroke-width="${w + 16}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${E.waterD}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
  ${speed > 0 ? `<path d="${d}" fill="none" stroke="${E.water}" stroke-width="${w * 0.5}" stroke-linecap="round" stroke-dasharray="${o.dash || "40 50"}" stroke-dashoffset="${(-t * 260 * speed).toFixed(1)}"/>` : ""}`;
// a gauge (centre), r = 90 at k = 1; v 0..1 moves the needle; o.mark: a letter on its face (V, A, Ω, W)
export const gauge = (v = 0, o = {}) => { const a = lerp(-120, 120, clamp(v)) * Math.PI / 180;
  return `${disc(0, 0, 100, P.steel, P.steelD, 0.1)}<circle r="80" fill="${P.cream}"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => { const q = lerp(-120, 120, i / 6) * Math.PI / 180; return `<path d="M${64 * Math.sin(q)} ${-64 * Math.cos(q)}L${76 * Math.sin(q)} ${-76 * Math.cos(q)}" stroke="${P.ink}" stroke-width="6"/>`; }).join("")}
    ${o.mark ? text(0, 50, o.mark, 44, P.ink) : ""}<path d="M0 0L${62 * Math.sin(a)} ${-62 * Math.cos(a)}" stroke="${P.red}" stroke-width="9" stroke-linecap="round"/><circle r="12" fill="${P.ink}"/>`; };

// ---- things in the house ----
// a kettle, base on y = 0, 300 wide; steam with time t when on
export const kettle = (t = 0, on = 0) => `${on > 0 ? [0, 1, 2].map((i) => { const q = ((t * 0.7 + i / 3) % 1); return `<circle cx="${150 + q * 60 + 14 * Math.sin(t * 3 + i)}" cy="${-300 - q * 200}" r="${18 + q * 30}" fill="#fff" opacity="${(0.45 * on * (1 - q)).toFixed(2)}"/>`; }).join("") : ""}
  ${two("M-110 0Q-130 -150 -90 -260H90Q130 -150 110 0Z", "#ece8ff", "#c6c0e6", 12, 0)}<path d="M100 -200Q190 -240 170 -300" fill="none" stroke="#c6c0e6" stroke-width="26" stroke-linecap="round"/><path d="M-110 -220Q-190 -200 -170 -90" fill="none" stroke="#c6c0e6" stroke-width="22" stroke-linecap="round"/>
  <path d="${rr(-80, -290, 160, 36, 14)}" fill="#c6c0e6"/><path d="${rr(-90, -14, 180, 14, 6)}" fill="#2b2350"/><circle cx="-40" cy="-60" r="12" fill="${on > 0 ? P.red : "#5a4a9a"}"/>`;
// a glass of tea, base on y = 0 (the Egyptian kind: small, clear, amber)
export const tea = (t = 0) => `${[0, 1].map((i) => { const q = ((t * 0.5 + i / 2) % 1); return `<path d="M${-14 + i * 28} ${-150 - q * 90}q14 -20 0 -40" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${(0.5 * (1 - q)).toFixed(2)}"/>`; }).join("")}
  <path d="M-56 -140L-44 0H44L56 -140Z" fill="#cfe9ff" opacity=".35"/><path d="M-52 -110L-43 -6H43L52 -110Z" fill="#c4581e"/><path d="M-52 -110L-43 -6H-20L-26 -110Z" fill="#e0782e"/><path d="M-60 -144H60" stroke="#cfe9ff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`;
// a snail, base on y = 0, 220 long, facing right; t wobbles its eye stalks
export const snail = (t = 0) => `<path d="M-110 0Q-110 -30 -60 -30H90Q120 -30 124 -60L130 -100" fill="none" stroke="#9de07a" stroke-width="34" stroke-linecap="round"/><path d="M-110 -6H100" stroke="#78bf58" stroke-width="12" stroke-linecap="round"/>
  ${disc(-10, -100, 80, "#c98a5a", "#a46a3e")}<path d="M-10 -100m-50 0a50 50 0 1 1 50 50a30 30 0 1 1 -30 -30a12 12 0 1 1 12 12" fill="none" stroke="#7a4a2a" stroke-width="9" stroke-linecap="round"/>
  ${[0, 1].map((i) => { const a = -70 + i * 26 + 6 * Math.sin(t * 3 + i); return `<path d="M128 -96l${(44 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(44 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="#9de07a" stroke-width="10" stroke-linecap="round"/><circle cx="${(128 + 48 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(-96 + 48 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="9" fill="${P.ink}"/>`; }).join("")}`;
// a value tag (centre): a rounded pill with a number and its unit, e.g. tagV("300,000,000", "V")
export const tagV = (num, unit, o = {}) => { const s = o.size || 96, w = (String(num).length + String(unit).length + 1) * s * 0.5 + s * 0.9;
  return `${two(rr(-w / 2, -s * 0.78, w, s * 1.5, s * 0.75), o.c || P.ink, o.cD || "#0d0826", 0, 8)}${text(0, s * 0.34, `${num} ${unit}`.trim(), s, o.fill || P.gold)}`; };
// a warning mark (centre): a yellow triangle with a bolt in it
export const warning = (r = 120) => `${two(`M0 ${-r}L${r * 1.1} ${r * 0.8}H${-r * 1.1}Z`, E.warn, P.goldD, 0, 10)}<path d="M${r * 0.14} ${-r * 0.45}L${-r * 0.3} ${r * 0.18}H${r * 0.02}L${-r * 0.14} ${r * 0.62}L${r * 0.32} ${-r * 0.02}H0Z" fill="${P.ink}"/>`;
// a flag (centre), 180 x 120; kind: "it", "fr", "de", "sco", "us", "cn"
export const flag = (kind, w = 180) => { const h = w * 2 / 3, x = -w / 2, y = -h / 2, v = (cs) => cs.map((c, i) => `<rect x="${x + i * w / 3}" y="${y}" width="${w / 3 + 0.5}" height="${h}" fill="${c}"/>`).join(""), hz = (cs) => cs.map((c, i) => `<rect x="${x}" y="${y + i * h / 3}" width="${w}" height="${h / 3 + 0.5}" fill="${c}"/>`).join("");
  const body = kind === "it" ? v(["#1fa86c", "#fff4dc", "#ff4d5a"]) : kind === "fr" ? v(["#3060d0", "#fff4dc", "#ff4d5a"]) : kind === "de" ? hz(["#1a0f3a", "#ff4d5a", "#ffd04a"])
    : kind === "sco" ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2f6fd6"/><path d="M${x} ${y}L${-x} ${-y}M${-x} ${y}L${x} ${-y}" stroke="#fff4dc" stroke-width="${h * 0.18}"/>`
    : kind === "cn" ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ff4d5a"/><path d="M${x + w * 0.17} ${y + h * 0.16}l${w * 0.035} ${h * 0.1}h${w * 0.06}l${-w * 0.05} ${h * 0.07}l${w * 0.02} ${h * 0.11}l${-w * 0.065} ${-h * 0.07}l${-w * 0.065} ${h * 0.07}l${w * 0.02} ${-h * 0.11}l${-w * 0.05} ${-h * 0.07}h${w * 0.06}Z" fill="#ffd04a"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff4dc"/>${[0, 2, 4, 6].map((i) => `<rect x="${x}" y="${y + i * h / 7}" width="${w}" height="${h / 7}" fill="#ff4d5a"/>`).join("")}<rect x="${x}" y="${y}" width="${w * 0.42}" height="${h * 4 / 7}" fill="#3060d0"/>`;
  const id = "fl" + kind + Math.round(w); return `<clipPath id="${id}"><path d="${rr(x, y, w, h, 10)}"/></clipPath><g clip-path="url(#${id})">${body}</g><path d="${rr(x, y, w, h, 10)}" fill="none" stroke="${P.ink}" stroke-width="5" opacity=".4"/>`; };
// a name plate (centre): a dark plate with a name in Latin letters (names are allowed on screen)
export const plate = (name, size = 72, o = {}) => { const w = String(name).length * size * 0.52 + size * 1.1; return `${two(rr(-w / 2, -size * 0.75, w, size * 1.5, 18), o.c || P.ink, o.cD || "#0d0826", 0, 8)}${text(0, size * 0.34, name, size, o.fill || P.cream)}`; };

// ---- the night town of the file ----
// the town at night with its poles and wires: the blue house (left) and the pink house (right) as in the bank set, a row of
// street poles with a wire between them. lit 0..1 lights every window and street lamp (the town with electricity); o.dark 0..1 turns it off.
export const nightTown = (t, c, layerFn, o = {}) => { const lit = clamp((o.lit ?? 1) * (1 - (o.dark || 0))), G = o.G ?? 880;
  const sky = `<rect width="3000" height="3000" x="-500" y="-1000" fill="url(#bnight)"/>`;
  const far = skyline(11, -600, 2600, G - 120, 120, 330, E.far, lit > 0.5 ? E.farLit : E.far);
  const houses = at(560, G, house(E.houseA, E.houseAD, { roof: E.roof, lit: [lit > 0.3, lit > 0.3, lit > 0.3] })) + at(1360, G, house(E.houseB, E.houseBD, { roof: E.roof, lit: [lit > 0.3, lit > 0.3, lit > 0.3] }));
  const poles = [160, 960, 1760].map((x) => at(x, G, pole(560))).join("") + [[160, 960], [960, 1760]].map(([a, b]) => span([a - 80, G - 534], [b - 80, G - 534], 30) + span([a + 80, G - 534], [b + 80, G - 534], 30)).join("");
  const street = `<rect x="-600" y="${G}" width="3200" height="500" fill="${P.ground}"/><rect x="-600" y="${G + 60}" width="3200" height="130" fill="${P.road}"/>`;
  return { sky, far, near: street + houses + poles };
};
