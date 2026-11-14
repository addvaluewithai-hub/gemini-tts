// Props of the network file (network part 1, "the phone is a radio"), drawn in the world of the bank set (bank.js):
// the same palette, night town and houses. Things that travel through the episode:
//   the BLUE phone (the caller) and the PINK phone (the one who answers), the cell TOWER with its three panels and red
//   light, the radio RINGS (always teal: a radio wave), the underground CABLE (gold pulse: the voice as numbers), the
//   network CORE (a long building of blinking racks), the SIM card (gold chip), the hexagonal CELLS.
// Everything is drawn around (0, 0) with its base on y = 0 unless said otherwise.
import { clamp, lerp, ease, easeOut, seg, spring, rnd, at, rr, circ, two, disc, rings, text, drawn } from "./kit.js";
import { P, mix } from "./bank.js";

export { P, mix };
export const WAVE = "#5ff0d8", WAVED = "#22c7b8";       // radio
export const PULSE = "#ffd04a";                          // the voice as numbers, in a cable
export const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));

// ---- a smartphone, 130 x 250, base on y = 0. o.c/o.cD: the body (blue for the caller, pink for the other one);
// o.screen: the screen colour; o.inner: drawn on the screen (centre of the screen is (0, -125)); o.on: screen lit 0..1
export const phone = (o = {}) => { const c = o.c || P.blue, cD = o.cD || P.blueD, on = o.on ?? 1, scr = mix("#1a1446", o.screen || "#9fe7ff", on);
  return `${two(rr(-65, -250, 130, 250, 22), c, cD, 8, 0)}<path d="${rr(-54, -232, 108, 208, 12)}" fill="${scr}"/><path d="${rr(-18, -244, 36, 6, 3)}" fill="${cD}"/>${on > 0.05 ? `<path d="${rr(-54, -232, 108, 40, 12)}" fill="#fff" opacity="${(0.12 * on).toFixed(3)}"/>` : ""}${o.inner || ""}<circle cx="0" cy="-12" r="6" fill="${cD}"/>`; };
export const bluePhone = (o = {}) => phone({ ...o, c: P.blue, cD: P.blueD });
export const pinkPhone = (o = {}) => phone({ ...o, c: P.pink, cD: P.pinkD, screen: o.screen || "#ffd1e6" });
// a phone that rings: it shakes and two little arcs flick at its top corners (t: time, a: how much it rings)
export const ringing = (inner, t, a = 1) => { const sh = a * 5 * Math.sin(t * 46); return at(sh, 0, inner, 1, a * 4 * Math.sin(t * 46)) + (a > 0.05 ? [-1, 1].map((s) => `<path d="M${s * 84} -230q${s * 18} 20 0 40M${s * 104} -240q${s * 28} 30 0 60" fill="none" stroke="${P.gold}" stroke-width="8" stroke-linecap="round" opacity="${(a * (0.6 + 0.4 * Math.sin(t * 20))).toFixed(2)}"/>`).join("") : ""); };

// ---- radio: rings that leave a point. t: time, r: how far they go, n: how many at once, speed: rings per second.
// o.arc: [from, to] in degrees for a beam instead of a full circle; o.fade: how much they fade with distance
export const radio = (x, y, t, r = 300, o = {}) => { const n = o.n || 3, sp = o.speed || 0.9, col = o.c || WAVE, w = o.w || 10, k = o.k ?? 1; let g = "";
  for (let i = 0; i < n; i++) { const q = ((t * sp + i / n) % 1 + 1) % 1, rr_ = 30 + q * r, op = k * (1 - q) * (o.op || 0.9);
    if (op <= 0.01) continue;
    if (o.arc) { const [a0, a1] = o.arc.map((d) => d * Math.PI / 180), p0 = [x + rr_ * Math.cos(a0), y + rr_ * Math.sin(a0)], p1 = [x + rr_ * Math.cos(a1), y + rr_ * Math.sin(a1)];
      g += `<path d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}A${rr_.toFixed(1)} ${rr_.toFixed(1)} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity="${op.toFixed(3)}"/>`; }
    else g += `<circle cx="${x}" cy="${y}" r="${rr_.toFixed(1)}" fill="none" stroke="${col}" stroke-width="${w}" opacity="${op.toFixed(3)}"/>`; }
  return g; };
// a wave line (the radio wave seen side on) from x0 to x1 at height y: wavelength lam, amplitude amp, moving with t
export const waveLine = (x0, x1, y, lam, amp, t, col = WAVE, w = 10, speed = 300) => { let d = ""; for (let x = x0; x <= x1; x += Math.max(4, lam / 16)) { const v = y + amp * Math.sin(2 * Math.PI * (x - t * speed) / lam); d += (d ? "L" : "M") + x.toFixed(1) + " " + v.toFixed(1); }
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; };

// ---- a cell tower, 560 high, base on y = 0: a lattice mast, three panels near the top, a red light that blinks.
// o.lit: the panels glow (0..1); o.t: time for the light; o.k: scale of the panels (they are the tower's "ears")
export const tower = (o = {}) => { const t = o.t || 0, lit = o.lit || 0, k = o.k || 1, col = o.c || "#c7cfe8", colD = o.cD || "#8792bb";
  let lat = ""; for (let i = 0; i < 7; i++) { const y0 = -60 - i * 66, y1 = y0 - 66, w0 = lerp(70, 22, i / 7), w1 = lerp(70, 22, (i + 1) / 7); lat += `M${-w0} ${y0}L${w1} ${y1}M${w0} ${y0}L${-w1} ${y1}M${-w1} ${y1}H${w1}`; }
  const panel = (x, rot) => at(x, -480, `${two(rr(-16, -56, 32, 112, 8), lit > 0 ? mix("#e8ecff", WAVE, lit) : "#e8ecff", colD, 6, 0)}`, k, rot);
  const blink = 0.5 + 0.5 * Math.sin(t * 4);
  return `<path d="M-80 0L-24 -520H24L80 0Z" fill="none" stroke="${col}" stroke-width="12" stroke-linejoin="round"/><path d="${lat}" stroke="${colD}" stroke-width="7" fill="none"/><path d="${rr(-110, -14, 220, 14, 6)}" fill="${colD}"/>
    <path d="M-6 -520V-600" stroke="${col}" stroke-width="10"/>${panel(-52, -8)}${panel(52, 8)}${panel(0, 0)}${lit > 0 ? rings(0, -480, 90 * k * lit, WAVE, 0.18 * lit) : ""}
    ${rings(0, -606, 22, P.red, 0.35 * blink)}<circle cx="0" cy="-606" r="12" fill="${mix(P.redD, P.red, blink)}"/>`; };

// ---- a cable under the ground along a path d, with a gold pulse running along it (p: where the pulse is, 0..1;
// len: how long the pulse is, as a share of the cable). draw: how much of the cable is there (it draws itself)
export const cable = (d, draw = 1, p = -1, o = {}) => { const w = o.w || 22, len = o.len || 0.12;
  return `${drawn(d, draw, "#0e0a2c", w + 14)}${drawn(d, draw, o.c || "#3b3a7a", w)}${p > -len && p < 1 + len ? `<path d="${d}" pathLength="1" fill="none" stroke="${PULSE}" stroke-width="${w * 0.7}" stroke-linecap="round" stroke-dasharray="${len} 3" stroke-dashoffset="${(-(p - len)).toFixed(4)}" opacity=".95"/>` : ""}`; };

// ---- the core of the network: a long low building of blinking racks, 760 wide, 330 high, base on y = 0
export const core = (t = 0, o = {}) => { let racks = ""; for (let i = 0; i < 6; i++) { const x = -300 + i * 120; racks += `<path d="${rr(x - 40, -250, 80, 200, 8)}" fill="#1a1446"/>`;
    for (let j = 0; j < 6; j++) { const on = rnd(i * 13 + j * 7 + Math.floor(t * 3 + i)) > 0.4; racks += `<rect x="${x - 28}" y="${-236 + j * 31}" width="56" height="18" rx="4" fill="${on ? (o.glow || "#7ff7c9") : "#2c2766"}"/>`; } }
  return `${two(rr(-380, -330, 760, 330, 18), "#5a4fb0", "#433a8f", 14, 0)}<path d="${rr(-400, -350, 800, 36, 12)}" fill="#3a2f80"/>${racks}<path d="${rr(-380, -20, 760, 20, 4)}" fill="#433a8f"/>${o.inner || ""}`; };

// ---- a SIM card, 150 x 190 centred on (0, 0), with its cut corner and gold chip; o.key: a small key on it
export const sim = (o = {}) => `${two("M-75 -95H40L75 -60V95H-75Z", o.c || "#f1f4ff", o.cD || "#c4cbe6", 0, 10)}${two(rr(-46, -40, 92, 74, 10), P.gold, P.goldD, 0, 6)}<path d="M-46 -3H46M-15 -40V34M15 -40V34" stroke="${P.goldD}" stroke-width="5"/>${o.inner || ""}`;

// ---- a hexagon of radius r (corner up = false: flat top) centred on (x, y)
export const hexPath = (x, y, r) => { let d = ""; for (let i = 0; i < 6; i++) { const an = Math.PI / 180 * (60 * i); d += (i ? "L" : "M") + (x + r * Math.cos(an)).toFixed(1) + " " + (y + r * Math.sin(an)).toFixed(1); } return d + "Z"; };
// the centres of a hex grid of flat-topped cells of radius r, cols x rows, starting at (x0, y0); each with its colour
// group 0..2 (the cell pattern that lets cells that do not touch reuse the same group)
export const hexGrid = (x0, y0, r, cols, rows) => { const out = []; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const x = x0 + i * r * 1.5, y = y0 + j * r * Math.sqrt(3) + (i % 2 ? r * Math.sqrt(3) / 2 : 0); const q = i, ar = j - (i - (i & 1)) / 2; out.push({ i, j, x, y, g: (((q - ar) % 3) + 3) % 3 }); } return out; };   // odd columns sit half a cell lower; (q - r) mod 3 never repeats between neighbours
export const GROUP = [["#ff5fa2", "#d6407f"], ["#3fa9ff", "#2a80d2"], ["#ffd04a", "#f09a1a"]];

// ---- a satellite, about 360 wide, centred on (0, 0): body and two solar wings
export const satellite = (o = {}) => `${[-1, 1].map((s) => `${two(rr(s > 0 ? 60 : -180, -34, 120, 68, 6), "#3a6fd8", "#2a4fa8", 0, 6)}<path d="M${s > 0 ? 60 : -180} 0h120M${s > 0 ? 100 : -140} -34v68M${s > 0 ? 140 : -100} -34v68" stroke="#7fb0ff" stroke-width="4"/><path d="M${s * 44} 0H${s * 60}" stroke="${P.steel}" stroke-width="10"/>`).join("")}${two(rr(-44, -50, 88, 100, 14), P.cream, P.creamD, 8, 0)}<path d="M0 -50V-84" stroke="${P.steel}" stroke-width="8"/><circle cx="0" cy="-90" r="12" fill="${o.light || P.gold}"/>`;

// ---- a wifi router, 240 wide, base on y = 0, with two antennas and blinking lights
export const router = (t = 0) => `<path d="M-80 -100L-96 -260M80 -100L96 -260" stroke="${P.steelD}" stroke-width="16" stroke-linecap="round"/>${two(rr(-120, -110, 240, 100, 20), "#f1f4ff", "#c4cbe6", 0, 10)}${[0, 1, 2, 3].map((i) => `<circle cx="${-60 + i * 40}" cy="-55" r="9" fill="${rnd(i + Math.floor(t * 5)) > 0.3 ? P.green : "#c4cbe6"}"/>`).join("")}<path d="${rr(-100, -12, 200, 12, 6)}" fill="#c4cbe6"/>`;
// an earbud, about 90 high, centred
export const earbud = () => `${two("M-30 -40A40 40 0 1 1 20 30L20 80Q20 96 6 96Q-8 96 -8 80V34Q-36 22 -30 -40Z", "#f6f7ff", "#c4cbe6", 0, 8)}<circle cx="6" cy="-6" r="16" fill="#8792bb"/>`;
// a bus stop: a shelter with a sign, 420 wide, base on y = 0
export const busStop = () => `<path d="M-200 0V-300M200 0V-300" stroke="${P.steelD}" stroke-width="14"/>${two(rr(-230, -330, 460, 40, 12), P.violet, P.violetD, 0, 8)}<path d="${rr(-170, -270, 340, 200, 10)}" fill="#9fe7ff" opacity=".18"/><path d="${rr(-150, -70, 300, 20, 8)}" fill="${P.wood}"/><path d="M260 0V-380" stroke="${P.steelD}" stroke-width="10"/>${disc(260, -410, 46, P.gold, P.goldD)}${busIcon(260, -410)}`;
const busIcon = (x, y) => `<path d="${rr(x - 24, y - 22, 48, 38, 8)}" fill="#8a5200"/><path d="${rr(x - 18, y - 16, 36, 14, 3)}" fill="${P.gold}"/><circle cx="${x - 13}" cy="${y + 18}" r="6" fill="#8a5200"/><circle cx="${x + 13}" cy="${y + 18}" r="6" fill="#8a5200"/>`;

// ---- signal bars (the symbol on every phone): n of 5 lit, centred, 200 wide, base on y = 0
export const bars = (n, col = P.green, off = "#3a3478") => [0, 1, 2, 3, 4].map((i) => `<path d="${rr(-100 + i * 42, -30 - i * 30, 32, 30 + i * 30, 6)}" fill="${n > i + 0.5 ? col : off}"/>`).join("");

// ---- a stopwatch, radius r, centred; p: how far the hand has gone (0..1 of a turn); o.fill: the swept part
export const stopwatch = (r, p, o = {}) => { const an = -Math.PI / 2 + 2 * Math.PI * clamp(p), hx = Math.cos(an) * r * 0.78, hy = Math.sin(an) * r * 0.78, large = p > 0.5 ? 1 : 0;
  return `<path d="${rr(-r * 0.18, -r * 1.3, r * 0.36, r * 0.24, 6)}" fill="${P.steelD}"/>${disc(0, 0, r, P.cream, P.creamD, 0.1)}<circle r="${r * 0.86}" fill="#fffaf0"/>${p > 0.002 ? `<path d="M0 0L0 ${(-r * 0.86).toFixed(1)}A${r * 0.86} ${r * 0.86} 0 ${large} 1 ${(Math.cos(an) * r * 0.86).toFixed(1)} ${(Math.sin(an) * r * 0.86).toFixed(1)}Z" fill="${o.fill || P.gold}" opacity=".55"/>` : ""}<path d="M0 0L${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="${P.ink}" stroke-width="${r * 0.08}" stroke-linecap="round"/><circle r="${r * 0.09}" fill="${P.ink}"/>`; };

// ---- the old brick phone of 1973, 120 x 420, base on y = 0
export const brick = (o = {}) => `<path d="M30 -420V-520" stroke="#3a3a4a" stroke-width="22" stroke-linecap="round"/>${two(rr(-60, -420, 120, 420, 18), o.c || "#e9e2cf", o.cD || "#b9b09a", 10, 0)}<path d="${rr(-40, -380, 80, 50, 6)}" fill="#c0392b" opacity=".85"/>${[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => `<path d="${rr(-38 + c * 28, -300 + r * 44, 20, 30, 4)}" fill="#6d6a5e"/>`).join("")).join("")}<path d="M-30 -60h60M-30 -40h60" stroke="#6d6a5e" stroke-width="6"/>`;

// ---- a palm tree that is a tower in disguise: trunk with bark rings, fronds; o.ears: how much the panels show
export const palmTower = (o = {}) => { const ears = o.ears ?? 0, sway = o.sway || 0;
  let trunk = ""; for (let i = 0; i < 9; i++) trunk += `<path d="M${-24 + i * 1} ${-i * 54}l48 0l-4 -54h-40Z" fill="${i % 2 ? "#8a5a32" : "#a86a3a"}"/>`;
  const frond = (rot, len, c) => at(0, -500, `<path d="M0 0Q${len * 0.5} -60 ${len} 30Q${len * 0.5} -10 0 20Z" fill="${c}"/>`, 1, rot + sway * 6);
  return `${trunk}${[-160, -120, -60, -20, 20, 70].map((r, i) => frond(r, 240 - (i % 2) * 30, i % 2 ? "#1fa86c" : "#3ddc97")).join("")}
    ${ears > 0 ? [-1, 0, 1].map((s) => at(s * 60, -520 - 40 * ears, two(rr(-14, -50, 28, 100, 7), "#e8ecff", "#8792bb", 5, 0), 1, s * 10)).join("") + `<circle cx="0" cy="${-600 - 40 * ears}" r="12" fill="${P.red}"/>` : ""}`; };
