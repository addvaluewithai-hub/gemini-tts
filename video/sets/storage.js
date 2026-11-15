// "Storage" (electricity part 4 of 4): electricity can't be stored… and that is changing. Four shots, nothing to read
// but "$", "112 GW", "2025", "2010", "$1,500", "$108", "−90%+" and "kWh".
//   0 the warehouse of part 2, doors shut, a padlock and ✗ («مابتتخزنش»); on «بدأ يتغير» the padlock springs open, the
//     doors swing and gold light pours out over rows of battery boxes inside
//   1 a mountain with a lake on top and a lake at its foot: cheap spare power (a "$") pumps water up the pipe
//     («يرفعوا بيها مية»), the top lake fills; at night it runs down through the turbine and the town lights
//     («ينزّلوا المية»); on «بطارية.. من مية» a gold battery outline draws itself round the top lake
//   2 a phone with its battery; it grows into a field of warehouse-sized battery boxes («قد المخازن»); calendar 2025,
//     a counter rolls to "112 GW"; two bars, water and batteries: the battery bar edges past («عدّت المية»)
//   3 the price of storing one kWh as a hill: a battery with a price tag sits on top in 2010 at "$1,500" and slides down
//     the slope, the tag rolling to "$108" in 2025; "−90%+" lands. Host right: the lower right is kept clear.
// Props used by the other part 4 sets are exported (depot, battBox, phone, pill, sky).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, through, rr, two, disc, rings, text, drawn, at, check, cross, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./storage.v.js";
import { P, E, mix, stars, house, pop, flow } from "./elec.js";
import { padlock, calPage, hills } from "./props.js";

export const sky = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -1400, 3400, 900, tot), c, 0.12);
// a dark pill with a short value (centre)
export const pill = (t, size = 60, fill = P.gold) => { const w = String(t).length * size * 0.52 + size; return `${two(rr(-w / 2, -size * 0.78, w, size * 1.5, size * 0.75), P.ink, "#020c16", 0, 7)}${text(0, size * 0.36, t, size, fill)}`; };
export const GOLDL = "#ffe9a8";

// the warehouse of part 2 (base on y = 0, 520 wide, 410 tall). o.doors 1 shut .. 0 open; o.lock 0 locked .. 1 open
// (o.lockK scales it, 0 hides it; o.lockRot, o.lockDY move it); o.seam 0..1 a gold line of light between the doors;
// o.glow 0..1 light inside; o.inside: what stands in the doorway (drawn behind the doors)
export const depot = (o = {}) => { const d = o.doors ?? 1, glow = o.glow || 0, seam = o.seam || 0, lk = o.lockK ?? 1;
  const inside = `<path d="${rr(-170, -230, 340, 230, 6)}" fill="${mix("#04121c", "#3a2f14", glow)}"/>${glow > 0 ? `<path d="${rr(-170, -230, 340, 230, 6)}" fill="#ffd98a" opacity="${(0.35 * glow).toFixed(2)}"/>` : ""}${o.inside || ""}`;
  const door = (x0, w) => w <= 1 ? "" : `<path d="${rr(x0, -230, w, 230, 4)}" fill="#3f7590"/><path d="M${x0 + w * 0.33} -222V-8M${x0 + w * 0.66} -222V-8" stroke="#336680" stroke-width="6"/>`;
  return `${glow > 0 ? rings(0, -110, 260 * (0.6 + 0.4 * glow), "#ffd98a", 0.22 * glow, 1.5) : ""}${two(rr(-260, -300, 520, 300, 10), "#2b5a74", "#1c4157", 14, 0)}${two("M-290 -296L0 -410L290 -296Z", E.roof, P.ink, 0, 9)}
    ${inside}${door(-170, 170 * d)}${door(170 - 170 * d, 170 * d)}
    ${seam > 0 ? `${rings(0, -115, 90 * seam, "#ffd98a", 0.35 * seam, 1.6)}<path d="${rr(-5 - 6 * seam, -228, 10 + 12 * seam, 226, 4)}" fill="#ffe9a8"/>` : ""}
    ${lk > 0 ? at(0, -110 + (o.lockDY || 0), padlock(1, o.lock || 0), 1.5 * lk, o.lockRot || 0, o.lockOp != null ? `opacity="${o.lockOp.toFixed(2)}"` : "") : ""}`; };

// a grid battery: a shipping-container box (base on y = 0, 360 wide, 200 tall); charge 0..1 fills its window
export const battBox = (charge = 1, o = {}) => { const c = o.c || "#dfeef2", cD = o.cD || "#a9c6d1";
  return `<path d="M-160 0V12M160 0V12" stroke="${P.ink}" stroke-width="16"/>${two(rr(-180, -196, 360, 196, 14), c, cD, 12, 0)}<path d="${rr(-188, -206, 376, 18, 8)}" fill="#5d8597"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="${rr(-156 + i * 26, -160, 12, 116, 6)}" fill="${cD}"/>`).join("")}
    <path d="${rr(6, -166, 152, 64, 12)}" fill="${P.ink}"/><path d="${rr(14, -158, 136 * clamp(charge), 48, 8)}" fill="${mix(P.red, P.green, clamp(charge * 1.6))}"/>
    <path d="M86 -86L56 -42H80L68 -10L104 -58H80Z" fill="${P.gold}"/>`; };

// a phone (centre), 210 x 400 at k = 1; o.on 0..1 lights its screen; o.charge shows a battery on the screen; o.inner draws on it
export const phone = (o = {}) => { const on = o.on ?? 1;
  return `${two(rr(-105, -200, 210, 400, 36), "#9fb3c8", "#7890a5", 8, 8)}<path d="${rr(-90, -176, 180, 340, 20)}" fill="${mix("#0a2233", "#123f58", on)}"/><path d="${rr(-30, -192, 60, 10, 5)}" fill="#5f7891"/><circle cx="0" cy="182" r="10" fill="#5f7891"/>
    ${o.charge != null ? `<path d="${rr(-50, -90, 100, 170, 18)}" fill="none" stroke="${mix("#4d6b80", "#fff", on)}" stroke-width="10"/><path d="${rr(-18, -106, 36, 16, 5)}" fill="${mix("#4d6b80", "#fff", on)}"/><path d="${rr(-36, 66 - 142 * clamp(o.charge), 72, 142 * clamp(o.charge), 8)}" fill="${mix(P.red, P.green, clamp(o.charge * 1.6))}" opacity="${(0.4 + 0.6 * on).toFixed(2)}"/>` : ""}
    ${o.inner || ""}`; };

const moon = (r = 60) => `${rings(0, 0, r, GOLDL, 0.18, 1.6)}<circle r="${r}" fill="${GOLDL}"/><circle cx="${-r * 0.3}" cy="${-r * 0.2}" r="${r * 0.18}" fill="#f1d98a"/>`;
const groundAt = (G) => `<rect x="-1400" y="${G}" width="4800" height="1600" fill="${P.ground}"/>`;
const comma = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// ---- 0: shut and padlocked… then it opens ----
function s0(a, tot) {
  const v = portrait(), G = v ? 1240 : 990, X = 960, K = v ? 1.45 : 1.9;
  const c = camAt(a, v ? [[0, 960, 900, 0.95], [3.2, 960, 920, 1.0], [4.65, 960, 960, 1.1]] : [[0, 960, 590, 1.0], [3.2, 960, 600, 1.05], [4.65, 960, 640, 1.18]]);
  const lockOpen = ease(seg(a, 3.4, 3.62)), fall = seg(a, 3.75, 4.3), doors = 1 - ease(seg(a, 3.8, 4.35)), glow = ease(seg(a, 3.75, 4.3));
  const shake = a > 1.55 && a < 2.6 ? 10 * Math.sin((a - 1.55) * 30) * Math.exp(-(a - 1.55) * 3) : 0;
  const rows = [0, 1, 2].map((i) => at(-110 + i * 110, -14, battBox(0.4 + 0.3 * i, {}), 0.28)).join("") + [0, 1].map((i) => at(-55 + i * 110, -80, battBox(0.9, {}), 0.24)).join("");
  const dp = at(X, G, depot({ doors, lock: lockOpen, lockRot: shake + 40 * fall, lockDY: 260 * easeIn(fall), lockOp: 1 - seg(a, 4.1, 4.3), lockK: a > 4.3 ? 0 : pop(a + 1), glow, seam: seg(a, 3.4, 3.8) * (1 - glow), inside: glow > 0 ? `<g opacity="${glow.toFixed(2)}">${rows}</g>` : "" }), K);
  const no = a > 2.3 ? at(X + (v ? 0 : 620), G - (v ? 760 : 640), cross(0, 0, 70, P.red, a - 2.35), 1, 0, `opacity="${(1 - seg(a, 3.3, 3.6)).toFixed(2)}"`) : "";
  const g = sky(c, tot, 21) + layer(hills(9, -1400, 3400, G - 60, 90, "#0d3a4e"), c, 0.6) + layer(groundAt(G) + dp + no, c);
  return { g, out: toScreen(c, X, G - 115 * K), outC: GOLDL, outZ: 16 };
}

// ---- 1: a battery made of water ----
// mountain with a plateau (lake on top) and a lake at its foot, a pipe down the right slope into a turbine house
const MT = "M-500 950L180 560L440 300L820 300L1060 600L1330 950Z";
const UP = [470, 790, 300], LO = [1330, 1590, 950];   // lake x0, x1, rim y
const lake = (L, depth, level, id) => { const [x0, x1, y] = L, d = `M${x0} ${y}Q${(x0 + x1) / 2} ${y + depth * 2} ${x1} ${y}Z`;
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="#0a2a3c"/><g clip-path="url(#${id})"><rect x="${x0}" y="${y + depth * (1 - clamp(level)) - 2}" width="${x1 - x0}" height="${depth * 2}" fill="${E.water}"/><rect x="${x0}" y="${y + depth * (1 - clamp(level)) - 2}" width="${x1 - x0}" height="10" fill="#9ad6ff"/></g>`; };
const turbHouse = (spin, lit) => `${two(rr(-90, -150, 180, 150, 8), "#5b7f8f", "#45687a", 10, 0)}${two("M-104 -146L0 -200L104 -146Z", E.roof, P.ink, 0, 6)}
  ${at(0, -70, `${disc(0, 0, 52, "#2b5a74", "#1c4157")}<g transform="rotate(${spin.toFixed(1)})">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 0L44 -12L44 12Z" fill="${mix("#6f93a8", E.water, lit)}" transform="rotate(${i * 60})"/>`).join("")}</g><circle r="10" fill="${P.ink}"/>`)}`;
function s1(a, tot) {
  const v = portrait(), G = 950;
  const c = camAt(a, v ? [[0, 900, 520, 0.58], [9.43, 820, 480, 0.62]] : [[0, 960, 590, 0.92], [5.0, 940, 580, 0.95], [7.6, 880, 560, 1.0], [9.43, 760, 470, 1.22]]);
  const up = 3.41, down = 6.33;
  const lvlU = a < down ? lerp(0.25, 0.9, ease(seg(a, up, 5.6))) : lerp(0.9, 0.45, ease(seg(a, down, 9.0)));
  const lvlL = a < down ? lerp(0.85, 0.4, ease(seg(a, up, 5.6))) : lerp(0.4, 0.8, ease(seg(a, down, 9.0)));
  const pumping = a > up && a < 5.7, falling = a > down;
  const pipe = "M1270 930L1130 760L960 540L800 330";
  const pipeG = flow(pipe, tot, pumping ? -1 : falling ? 1.4 : 0, 34, { pipe: "#3d5d70" });
  const spin = falling ? (a - down) * 520 : pumping ? -(a - up) * 300 : 0;
  // cheap spare power comes in along a wire from the right; a "$" over it
  const wire = `M2150 760Q1900 820 1700 790Q1500 760 1330 800`;
  const pulses = a > 1.6 && a < 5.8 ? [0, 1, 2].map((k) => { const p = ((tot * 0.6 + k / 3) % 1); const x = lerp(2150, 1330, p), y = 760 + 40 * Math.sin(p * Math.PI); return rings(x, y, 20, P.gold, 0.6, 1.5); }).join("") : "";
  const cheap = a > 2.6 ? at(1720, 660, pill("$", 56, P.green), 0.9 * pop(a - 2.7), 0, `opacity="${(1 - seg(a, 5.6, 6.0)).toFixed(2)}"`) : "";
  // the town: lit when the water runs down
  const lit = falling && a > 7.2;
  const town = at(1700, G, house(E.houseA, E.houseAD, { roof: E.roof, lit: [lit, lit, lit] }), 0.62) + at(1900, G, house(E.houseB, E.houseBD, { roof: E.roof, lit: [lit, a > 7.4, lit] }), 0.62);
  const out = falling && a > 6.9 && a < 7.4 ? rings(lerp(1360, 1700, seg(a, 6.9, 7.3)), 840, 26, P.gold, 0.7, 1.5) : "";
  // the battery round the top lake
  const bp = seg(a, 7.84, 8.6), batt = bp > 0 ? `${drawn(rr(410, 230, 440, 230, 40), bp, P.gold, 16)}<path d="${rr(850, 305, 34, 80, 10)}" fill="${P.gold}" opacity="${seg(a, 8.4, 8.7).toFixed(2)}"/>${a > 8.6 ? rings(630, 340, 200, P.gold, 0.18 * (1 - seg(a, 8.6, 9.4)), 1.3) : ""}` : "";
  const shimmer = a > 0.9 && a < 1.9 ? rings(630, 320, 100, "#9ad6ff", 0.3 * (1 - seg(a, 1.4, 1.9)), 1.4) : "";
  const world = groundAt(G) + two(MT, "#1b5068", "#12405a", 0, 14) + lake(UP, 120, lvlU, "lkU") + lake(LO, 90, lvlL, "lkL")
    + `<path d="${wire}" fill="none" stroke="${E.cuD}" stroke-width="8"/>` + pulses + pipeG + at(1300, G, turbHouse(spin, falling ? 1 : 0), 0.9) + town + out + cheap + shimmer + batt;
  const g = sky(c, tot, 33) + layer(at(300, 190, moon(56)), c, 0.3) + layer(hills(4, -1400, 3400, G - 80, 140, "#0b3346"), c, 0.6) + layer(world, c);
  const mc = toScreen({ x: c.x * 0.3 + (FW / 2) * 0.7, y: c.y * 0.3 + (FH / 2) * 0.7, z: Math.pow(c.z, 0.3) }, 300, 190);
  return { g, in: mc, inC: GOLDL, out: toScreen(c, 630, 300), outC: E.water, outZ: 14 };
}

// ---- 2: batteries like the phone's, as big as warehouses; 112 GW in 2025; past the water ----
function s2(a, tot) {
  const v = portrait(), G = v ? 1500 : 940;
  const c = camAt(a, v ? [[0, 960, 900, 1.25], [2.4, 960, 900, 1.3], [3.3, 960, 1000, 0.95], [9.71, 960, 980, 0.97]] : [[0, 960, 560, 1.35], [2.4, 960, 560, 1.4], [3.3, 960, 560, 0.92], [9.71, 960, 560, 0.95]]);
  const grow = ease(seg(a, 2.55, 3.3));
  // the phone, big, then small beside the field for scale
  const PX = lerp(960, v ? 1300 : 1760, grow), PY = lerp(v ? 900 : 560, v ? G - 120 : G - 110, grow), PK = lerp(v ? 1.4 : 1.3, v ? 0.5 : 0.45, grow);
  const ph = at(PX, PY, phone({ on: 1, charge: 0.5 + 0.5 * Math.abs(Math.sin(tot * 0.8)) }), PK);
  // the field of battery boxes
  const cols = v ? 3 : 5, rowsN = 2;
  let field = "";
  for (let r = 0; r < rowsN; r++) for (let k = 0; k < cols; k++) { const i = r * cols + k, t0 = 2.65 + i * 0.07;
    if (a < t0) continue; const x = v ? 640 + k * 300 : 260 + k * 300 + (r ? 150 : 0), y = G - (r ? 150 : 0), kk = (r ? 0.6 : 0.72) * (v ? 0.85 : 1);
    field = (r ? at(x, y, battBox(0.4 + 0.5 * rnd(i), { c: "#c3d9e0", cD: "#93b2be" }), kk * pop(a - t0)) : "") + field + (r ? "" : at(x, y, battBox(0.5 + 0.5 * rnd(i + 9)), kk * pop(a - t0))); }
  // 2025, then the counter
  const CY = v ? 330 : 190;
  const cal = a > 3.8 ? at(v ? 700 : 330, CY + (v ? 30 : 60), calPage("2025", "", 1, 92), (v ? 0.8 : 0.7) * pop(a - 3.84)) : "";
  const gw = 112 * ease(seg(a, 5.4, 7.0));
  const ctr = a > 5.0 ? at(v ? 1150 : 960, CY, pill(`${Math.round(gw)} GW`, v ? 84 : 96, P.gold), pop(a - 5.03)) : "";
  // the race: water vs batteries
  const BX = v ? 620 : 1220, BY = v ? 620 : 120, L = v ? 520 : 520;
  const race = a > 7.9 ? (() => { const o = pop(a - 7.95), w1 = L * 0.78, w2 = L * lerp(0.35, 0.86, ease(seg(a, 8.2, 9.1))), pass = seg(a, 8.95, 9.2);
    const drop = `<path d="M0 -36Q24 -6 24 10A24 24 0 0 1 -24 10Q-24 -6 0 -36Z" fill="${E.water}"/>`;
    const cell = `<path d="${rr(-20, -30, 40, 60, 8)}" fill="none" stroke="${P.green}" stroke-width="8"/><path d="${rr(-8, -40, 16, 10, 3)}" fill="${P.green}"/><path d="${rr(-10, -10, 20, 32, 4)}" fill="${P.green}"/>`;
    return at(BX, BY, `${at(0, 0, drop, 1.6)}<path d="${rr(50, -24, w1, 48, 24)}" fill="${E.waterD}"/>${at(0, 110, cell, 1.6)}<path d="${rr(50, 86, w2, 48, 24)}" fill="${P.green}"/>${pass > 0 ? rings(50 + w2, 110, 40, P.gold, 0.4 * (1 - pass * 0.5), 1.5) : ""}`, o); })() : "";
  const g = sky(c, tot, 41) + layer(hills(6, -1400, 3400, G - 210, 110, "#0b3346"), c, 0.6) + layer(groundAt(G) + field + ph + cal + ctr + race, c);
  return { g, in: toScreen(c, PX, PY), inC: "#123f58" };
}

// ---- 3: the price slides down a hill (host right) ----
function s3(a, tot) {
  const v = portrait();
  const X0 = v ? 520 : 380, X1 = v ? 1360 : 1290, Y0 = v ? 620 : 450, DROP = v ? 820 : 440;
  const hill = (p) => [lerp(X0, X1, p), Y0 + DROP * (1 - Math.pow(1 - p, 2.2))];
  let top = ""; for (let i = 0; i <= 40; i++) { const [x, y] = hill(i / 40); top += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }
  const land = `${two(`${top}L${X1 + 900} ${hill(1)[1]}L${X1 + 900} 2400L${X0 - 900} 2400L${X0 - 900} ${Y0}Z`, "#11455c", "#0c3149", 0, 14)}${drawn(top, ease(seg(a, 0.2, 1.4)), P.gold, 12)}`;
  const c = camAt(a, v ? [[0, 900, 760, 0.9], [4.9, 880, 760, 0.92], [8.0, 960, 980, 0.86], [9.94, 960, 980, 0.88]] : [[0, 800, 450, 0.95], [4.9, 760, 470, 1.0], [8.0, 860, 560, 1.0], [9.94, 860, 550, 1.02]]);
  // the battery with its price tag, at the top in 2010, sliding down to 2025
  const p = ease(seg(a, 5.0, 7.9)), [bx, by] = hill(p), [bx2, by2] = hill(Math.min(1, p + 0.02)), ang = Math.atan2(by2 - by, bx2 - bx) * 180 / Math.PI * (p < 1 ? 1 : 0);
  const price = a < 5.0 ? 1500 : lerp(1500, 108, p);
  const tagS = `$${comma(price)}`;
  const tagW = tagS.length * 34 + 70;
  const tg = a > 2.9 ? at(0, -330, `<path d="M0 100V140" stroke="${P.ink}" stroke-width="6"/>${two(`M${-tagW / 2} 20h${tagW - 30}l30 40l-30 40h${-(tagW - 30)}Z`, P.cream, P.creamD, 0, 6)}${text(-15, 80, tagS, 64, P.ink)}`, pop(a - 3.0)) : "";
  const batt = `${two(rr(-110, -170, 220, 170, 26), "#dfeef2", "#a9c6d1", 10, 0)}<path d="${rr(-34, -190, 68, 24, 8)}" fill="${P.steel}"/><path d="${rr(-80, -140, 160, 52, 10)}" fill="${P.ink}"/><path d="${rr(-72, -132, 144 * 0.8, 36, 6)}" fill="${P.green}"/>${text(0, -30, "kWh", 52, P.ink)}`;
  const rider = a > 1.2 ? at(bx, by - 6, at(0, 0, batt + `<g transform="translate(0 -170) rotate(${(-ang * 0.45).toFixed(1)}) translate(0 170)">${tg}</g>`, 1, 0), (v ? 1.3 : 1.3) * pop(a - 1.26), ang * 0.45) : "";
  const trail = p > 0 ? drawn((() => { let d = ""; for (let i = 0; i <= 30; i++) { const [x, y] = hill(p * i / 30); d += `${i ? "L" : "M"}${x.toFixed(1)} ${(y - 8).toFixed(1)}`; } return d; })(), 1, "#fff2b8", 18) : "";
  const y10 = a > 4.0 ? at(X0 - (v ? 0 : 250), Y0 - (v ? 520 : 120), pill("2010", 56, P.cream), pop(a - 4.02)) : "";
  const y25 = a > 6.8 ? at(X1 - (v ? 300 : 330), hill(1)[1] - (v ? 160 : 140), pill("2025", 56, P.cream), pop(a - 6.82)) : "";
  const pct = a > 8.0 ? at(v ? 1000 : 1200, v ? 300 : 210, pill("−90%+", v ? 110 : 120, P.green), pop(a - 8.05)) : "";
  const g = sky(c, tot, 57) + layer(land + trail + rider + y10 + y25 + pct, c);
  return { g };
}

const SHOTS = [s0, s1, s2, s3];
export const storageSet = makeSet(SHOTS, V, P);
