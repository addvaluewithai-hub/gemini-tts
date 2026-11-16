// Props for the sets of crypto part 2 (blockchain and mining), drawn in the palette and style of part 1 (bank.js,
// props.js). Each is drawn around (0, 0); "standing" props have their base on y = 0. Every prop is a pure function.
//   page     a ledger page, the block: rows of coloured dots and numbers, a fingerprint seal at the bottom, the previous
//            page's fingerprint at the top, a gold edge once it is a block
//   whorl    a fingerprint, the picture of a hash: one colour and one pattern per seed
//   card     a fingerprint card: the whorl and a short hex string, what the hash machine gives out
//   slip     one transfer: a small note, a coloured dot, an arrow, a coloured dot, an amount
//   hashBox  the hash machine: a funnel on top, gears behind a round window, a slot on the right that cards come out of
//   link     the gold link between two pages
//   rig      a mining machine: a black box with two fans and a row of green lights
//   warehouse a long shed full of rigs, roof fans and heat over it
//   clock, silo, balance, container, booth, pylon, haystack: as said on each
import { clamp, lerp, ease, seg, spring, rnd, rr, circ, two, disc, rings, text, number, drawn, at } from "./kit.js";
import { P, mix, coin } from "./bank.js";
export { P, mix, coin };

// the colours of the people, as houses in part 1: blue Ali, pink Mona, teal Sami, violet Hoda
export const WHO = { blue: [P.blue, P.blueD], pink: [P.pink, P.pinkD], teal: [P.teal, P.tealD], violet: [P.violet, P.violetD], gold: [P.gold, P.goldD] };
// a fake hash, the same for the same seed: n hex digits
export const hexOf = (seed, n = 6) => Array.from({ length: n }, (_, i) => "0123456789abcdef"[Math.floor(rnd(seed * 131 + i * 17) * 16)]).join("");
// the whorl colours, picked by seed
const WC = [P.pink, P.teal, P.gold, P.blue, P.violet, P.green];
export const whorlColour = (seed) => WC[Math.abs(Math.round(seed)) % WC.length];

// a fingerprint of radius r: arcs round a core, with gaps placed by the seed; c overrides the colour
export const whorl = (r = 60, seed = 1, c) => { const col = c || whorlColour(seed); let d = "";
  for (let i = 0; i < 6; i++) { const rad = r * (0.18 + i * 0.16), a0 = rnd(seed * 7 + i) * 6.28, gap = 0.5 + rnd(seed * 11 + i) * 0.9, a1 = a0 + 6.28 - gap, sx = 1 - 0.18 * rnd(seed + 3);
    const p = (a) => `${(Math.cos(a) * rad * sx).toFixed(1)} ${(Math.sin(a) * rad).toFixed(1)}`; d += `M${p(a0)}A${(rad * sx).toFixed(1)} ${rad.toFixed(1)} 0 1 1 ${p(a1)}`; }
  return `<circle r="${r * 1.02}" fill="${mix(col, "#ffffff", 0.78)}"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${(r * 0.075).toFixed(1)}" stroke-linecap="round"/>`; };

// a fingerprint card, 240 x 120 at k = 1: the whorl on the left, hex digits on the right (`shown` of them typed so far)
export const card = (seed = 1, o = {}) => { const hx = o.hex ?? hexOf(seed, 5), shown = o.shown ?? hx.length, col = o.colour || whorlColour(seed);
  return `${two(rr(-120, -60, 240, 120, 16), P.cream, P.creamD, 0, 7)}<path d="${rr(-120, -60, 240, 16, 8)}" fill="${col}"/>${at(-62, 6, whorl(38, seed, col))}
    ${text(-16, 20, hx.slice(0, shown) + (shown >= hx.length && o.dots !== false ? "…" : ""), 36, o.ink || P.ink, { anchor: "start" })}`; };

// one transfer: who pays (colour key of WHO), who gets it, the amount; 200 x 70 at k = 1
export const slip = (from = "blue", to = "pink", amt = "30", o = {}) => `${two(rr(-100, -35, 200, 70, 12), P.cream, P.creamD, 0, 6)}<circle cx="-66" cy="0" r="17" fill="${WHO[from][0]}"/>
  <path d="M-40 0h34m-12 -11l12 11l-12 11" fill="none" stroke="${P.ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="0" r="17" fill="${WHO[to][0]}"/>${text(70, 15, amt, 40, o.amtFill || P.ink)}`;

// a ledger page, 260 x 340 at k = 1, centre (0, 0)
//   o.rows: [[from, to, amount, fill?]] up to 6; o.seal: seed of its own fingerprint (bottom), o.sealC overrides its colour;
//   o.prev: seed of the page before (top); o.block: 0..1 the gold edge and thickness of a finished block;
//   o.n: a small number in the corner (the page's height); o.paper: page colour; o.sealP: 0..1 how far the seal is pressed
export const page = (o = {}) => { const rows = o.rows || [], b = o.block || 0, paper = o.paper || P.cream, paperD = o.paperD || P.creamD;
  let g = b > 0 ? `<path d="${rr(-130 + 14 * b, -170 + 14 * b, 260, 340, 18)}" fill="${P.goldD}" opacity="${b.toFixed(2)}"/><path d="${rr(-130 + 7 * b, -170 + 7 * b, 260, 340, 18)}" fill="${P.gold}" opacity="${b.toFixed(2)}"/>` : "";
  g += `<path d="${rr(-130, -170, 260, 340, 18)}" fill="${paperD}"/><path d="${rr(-130, -170, 260, 332, 18)}" fill="${paper}"/>`;
  if (o.prev !== undefined && o.prev !== null) g += at(-78, -124, whorl(30, o.prev, o.prevC), o.prevP ?? 1) + `<path d="M-38 -130h120M-38 -112h80" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/>`;
  rows.slice(0, 6).forEach((r, i) => { const y = -74 + i * 38; g += `<circle cx="-96" cy="${y}" r="11" fill="${WHO[r[0]] ? WHO[r[0]][0] : r[0]}"/><path d="M-78 ${y}h22" stroke="#bda97c" stroke-width="5" stroke-linecap="round"/><circle cx="-40" cy="${y}" r="11" fill="${WHO[r[1]] ? WHO[r[1]][0] : r[1]}"/>`
    + (r[2] !== undefined && r[2] !== "" ? text(70, y + 12, r[2], 34, r[3] || P.ink) : `<path d="M30 ${y}h70" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/>`); });
  if (o.seal !== undefined && o.seal !== null) { const sp = o.sealP ?? 1; if (sp > 0) g += at(72, 118, rings(0, 0, 44, o.sealC || whorlColour(o.seal), 0.2 * sp) + whorl(36, o.seal, o.sealC), 0.3 + 0.7 * spring(sp * 0.6, 10, 18)); }
  if (o.n !== undefined) g += text(-100, 140, String(o.n), 30, "#a58f5e", { anchor: "start" });
  return g; };

// the gold link between two pages at (x1, y) and (x2, y), or any two points; `c` its colour, `p` 0..1 how far it has snapped shut
export const link = (x1, y1, x2, y2, c = P.gold, p = 1, w = 1) => { if (p <= 0) return ""; const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, len = Math.hypot(x2 - x1, y2 - y1), gap = (1 - p) * 30;
  const l = Math.max(40, len / 2 + 14);
  return `<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${ang.toFixed(1)})"><rect x="${(-len / 2 - gap).toFixed(1)}" y="${-22 * w}" width="${l.toFixed(1)}" height="${44 * w}" rx="${22 * w}" fill="none" stroke="${mix(c, P.ink, 0.25)}" stroke-width="${14 * w}"/><rect x="${(len / 2 - l + gap).toFixed(1)}" y="${-22 * w}" width="${l.toFixed(1)}" height="${44 * w}" rx="${22 * w}" fill="none" stroke="${c}" stroke-width="${14 * w}"/></g>`; };

// the hash machine, 380 wide, base on y = 0. o.spin: gear angle (radians), o.shake: px, o.lamp: colour of the lamp on top,
// o.inner: drawn in the round window (centre (0, -200)). The funnel's mouth is at (0, -430); the slot is at (190, -90).
export const HASH_IN = [0, -430], HASH_OUT = [196, -92];
export const hashBox = (o = {}) => { const sp = o.spin || 0, sh = o.shake || 0;
  const gear = (cx, cy, r, a, c) => { let d = ""; for (let i = 0; i < 10; i++) { const t0 = a + i * 0.628, t1 = t0 + 0.3; d += `M${cx} ${cy}L${(cx + Math.cos(t0) * r * 1.22).toFixed(1)} ${(cy + Math.sin(t0) * r * 1.22).toFixed(1)}L${(cx + Math.cos(t1) * r * 1.22).toFixed(1)} ${(cy + Math.sin(t1) * r * 1.22).toFixed(1)}Z`; }
    return `<path d="${d}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="${P.ink}"/>`; };
  return `<g transform="translate(${sh.toFixed(1)} 0)"><path d="${rr(-200, -30, 400, 30, 8)}" fill="${P.steelD}"/>${two(rr(-190, -360, 380, 330, 30), P.violet, P.violetD, 0, 12)}
    <path d="M-120 -470L120 -470L50 -360H-50Z" fill="${P.steel}"/><path d="M-120 -470L120 -470L104 -446H-104Z" fill="#cdd5ee"/>
    <circle cx="0" cy="-200" r="112" fill="${P.ink}"/><clipPath id="hbw${o.id || ""}"><circle cx="0" cy="-200" r="100"/></clipPath><g clip-path="url(#hbw${o.id || ""})"><rect x="-100" y="-300" width="200" height="200" fill="#2a1d66"/>${gear(-34, -214, 46, sp, P.gold)}${gear(46, -170, 34, -sp * 1.35 + 0.3, P.goldD)}${o.inner || ""}</g>
    <circle cx="0" cy="-200" r="106" fill="none" stroke="${P.steel}" stroke-width="12"/><path d="${rr(150, -120, 54, 56, 8)}" fill="${P.ink}"/><path d="${rr(186, -116, 14, 48, 4)}" fill="#3a2a7a"/>
    ${disc(-130, -320, 18, o.lamp || P.green, mix(o.lamp || P.green, P.ink, 0.3))}${[0, 1, 2].map((i) => `<path d="${rr(-150 + i * 36, -80, 24, 24, 6)}" fill="${o.lights && o.lights[i] ? o.lights[i] : "#3a2a7a"}"/>`).join("")}</g>`; };

// a mining rig, 220 x 130 at k = 1, base on y = 0; o.spin turns the fans, o.on 0..1 lights it, o.c is the case colour
export const rig = (o = {}) => { const sp = o.spin || 0, on = o.on ?? 1, c = o.c || "#43398f", cD = o.cD || "#2f2770";
  const fan = (cx) => `<circle cx="${cx}" cy="-65" r="44" fill="${P.ink}"/>${[0, 1, 2, 3].map((i) => { const a = sp + i * 1.571; return `<path d="M${cx} -65L${(cx + Math.cos(a) * 38).toFixed(1)} ${(-65 + Math.sin(a) * 38).toFixed(1)}A38 38 0 0 1 ${(cx + Math.cos(a + 0.9) * 38).toFixed(1)} ${(-65 + Math.sin(a + 0.9) * 38).toFixed(1)}Z" fill="${mix("#4b3d8f", "#8fb3ff", on * 0.4)}"/>`; }).join("")}<circle cx="${cx}" cy="-65" r="10" fill="${P.steel}"/>`;
  return `${two(rr(-110, -130, 220, 130, 14), c, cD, 0, 8)}${fan(-50)}${fan(50)}${[0, 1, 2, 3].map((i) => `<circle cx="${-30 + i * 20}" cy="-116" r="5" fill="${on > 0.5 && (o.blink === undefined || rnd(i + Math.floor(o.blink * 6)) > 0.25) ? P.green : "#3a2a7a"}"/>`).join("")}`; };

// a shed full of rigs, w wide, base on y = 0; o.spin for its roof fans, o.heat 0..1 for the shimmer above it, o.t for blinking
export const warehouse = (w = 900, o = {}) => { const h = o.h || 300, sp = o.spin || 0, t = o.t || 0, n = Math.floor((w - 80) / 120);
  let racks = ""; for (let r = 0; r < 2; r++) for (let i = 0; i < n; i++) { const x = -w / 2 + 70 + i * 120, y = -h + 110 + r * 90; racks += `<path d="${rr(x, y, 90, 60, 6)}" fill="#2b2260"/>${[0, 1, 2].map((j) => `<circle cx="${x + 20 + j * 25}" cy="${y + 14}" r="5" fill="${rnd(i * 13 + r * 7 + j + Math.floor(t * 5)) > 0.3 ? P.green : "#3a2a7a"}"/>`).join("")}<circle cx="${x + 45}" cy="${y + 40}" r="13" fill="${P.ink}"/>`; }
  const fans = Array.from({ length: Math.max(2, Math.floor(w / 260)) }, (_, i) => { const x = -w / 2 + 130 + i * 260; return `<path d="${rr(x - 50, -h - 40, 100, 44, 8)}" fill="${P.steelD}"/>${[0, 1, 2].map((k) => { const a = sp + k * 2.09; return `<path d="M${x} ${-h - 18}L${(x + Math.cos(a) * 34).toFixed(1)} ${(-h - 18 + Math.sin(a) * 12).toFixed(1)}" stroke="${P.steel}" stroke-width="8" stroke-linecap="round"/>`; }).join("")}`; }).join("");
  const heat = (o.heat || 0) > 0 ? Array.from({ length: 5 }, (_, i) => { const x = -w / 2 + w * (i + 0.5) / 5, ph = t * 2 + i; return `<path d="M${x} ${-h - 70}q20 -30 0 -60q-20 -30 0 -60" fill="none" stroke="#ffb066" stroke-width="7" stroke-linecap="round" opacity="${(0.35 * o.heat * (0.6 + 0.4 * Math.sin(ph))).toFixed(2)}" transform="translate(${(8 * Math.sin(ph)).toFixed(1)} ${(-((t * 30 + i * 20) % 30)).toFixed(1)})"/>`; }).join("") : "";
  return `${heat}${fans}${two(rr(-w / 2, -h, w, h, 10), o.c || "#5a6aa8", o.cD || "#44529a", 0, 12)}<path d="M${-w / 2 - 20} ${-h}h${w + 40}v-14h${-w - 40}Z" fill="#39447f"/><path d="${rr(-w / 2 + 40, -h + 90, w - 80, 200, 8)}" fill="#141038"/>${racks}`; };

// a clock face of radius r; m is minutes shown by the sweep (0..60), the hand points at m
export const clock = (m = 0, r = 120, o = {}) => { const a = (m / 60) * 6.283 - 1.571, sweep = clamp(m / 60), large = sweep > 0.5 ? 1 : 0, ex = Math.cos(a) * r * 0.86, ey = Math.sin(a) * r * 0.86;
  return `${disc(0, 0, r, o.face || P.cream, P.creamD)}${sweep > 0.002 && sweep < 0.999 ? `<path d="M0 0L0 ${-r * 0.86}A${r * 0.86} ${r * 0.86} 0 ${large} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}Z" fill="${o.sweep || P.gold}" opacity=".55"/>` : sweep >= 0.999 ? `<circle r="${r * 0.86}" fill="${o.sweep || P.gold}" opacity=".55"/>` : ""}
    ${Array.from({ length: 12 }, (_, i) => { const t = i * 0.5236; return `<path d="M${(Math.cos(t) * r * 0.78).toFixed(1)} ${(Math.sin(t) * r * 0.78).toFixed(1)}L${(Math.cos(t) * r * 0.9).toFixed(1)} ${(Math.sin(t) * r * 0.9).toFixed(1)}" stroke="${P.ink}" stroke-width="${i % 3 ? 5 : 9}" stroke-linecap="round"/>`; }).join("")}
    <path d="M0 0L${(Math.cos(a) * r * 0.72).toFixed(1)} ${(Math.sin(a) * r * 0.72).toFixed(1)}" stroke="${P.ink}" stroke-width="${r * 0.08}" stroke-linecap="round"/><circle r="${r * 0.08}" fill="${P.red}"/>`; };

// a glass silo of coins, 300 wide and 620 high, base on y = 0; fill 0..1 of its height; o.lid 0..1 how far the lid is down
export const silo = (fill = 0, o = {}) => { const H = 620, top = -H, lv = -40 - (H - 80) * clamp(fill); let coins = "";
  for (let y = -40; y > lv; y -= 34) for (let i = 0; i < 6; i++) coins += `<ellipse cx="${-112 + i * 45 + ((y / 34) % 2 ? 0 : 20)}" cy="${y}" rx="22" ry="11" fill="${(i + y) % 3 ? P.gold : P.goldD}"/>`;
  const lid = o.lid ?? 0, ly = top - 120 * (1 - ease(lid));
  return `<path d="${rr(-150, top, 300, H, 30)}" fill="#1b1550"/><clipPath id="silo${o.id || ""}"><path d="${rr(-140, top + 10, 280, H - 20, 24)}"/></clipPath><g clip-path="url(#silo${o.id || ""})">${coins}<rect x="-140" y="${lv - 4}" width="280" height="8" fill="#fff3c2" opacity="${fill > 0 ? 0.6 : 0}"/></g>
    <path d="${rr(-150, top, 300, H, 30)}" fill="#cfe9ff" opacity=".12" stroke="#cfe9ff" stroke-width="10"/><path d="M-110 ${top + 60}v${H - 160}" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".25"/>
    ${lid > 0 ? two(rr(-176, ly - 44, 352, 50, 16), P.steel, P.steelD, 0, 8) + `<path d="${rr(-40, ly - 70, 80, 30, 10)}" fill="${P.steelD}"/>` : ""}${o.mark ? `<path d="M-170 ${top + 6}h340" stroke="${P.red}" stroke-width="8" stroke-dasharray="20 12"/>` : ""}`; };

// a balance: tilt -1..1 (positive: the right pan goes down); L and R are drawn standing on each pan; base on y = 0, 760 wide
export const balance = (tilt = 0, L = "", R = "") => { const a = tilt * 0.22, arm = 340, hx = Math.cos(a) * arm, hy = Math.sin(a) * arm, py = -520;
  const pan = (x, y, inner) => `<path d="M${x - 130} ${y + 120}L${x} ${y}L${x + 130} ${y + 120}" fill="none" stroke="${P.steelD}" stroke-width="5"/>${at(x, y + 120, inner)}<path d="M${x - 150} ${y + 120}h300q-20 34 -150 34q-130 0 -150 -34Z" fill="${P.steel}"/>`;
  return `<path d="M-120 0h240l-40 -40h-160Z" fill="${P.steelD}"/><rect x="-14" y="${py}" width="28" height="${-py - 40}" fill="${P.steel}"/>
    <path d="M${-hx} ${py - hy}L${hx} ${py + hy}" stroke="${P.gold}" stroke-width="22" stroke-linecap="round"/>${disc(0, py, 30, P.gold, P.goldD)}${pan(-hx, py - hy, L)}${pan(hx, py + hy, R)}`; };

// a shipping container, 380 x 170, base on y = 0, with a fan grille; o.c its colour, o.on its lights
export const container = (o = {}) => { const c = o.c || "#d0613a", cD = o.cD || "#a84a2a";
  return `${two(rr(-190, -170, 380, 170, 8), c, cD, 0, 10)}${Array.from({ length: 9 }, (_, i) => `<path d="M${-160 + i * 40} -150v130" stroke="${cD}" stroke-width="8"/>`).join("")}<circle cx="120" cy="-85" r="44" fill="${P.ink}"/>${[0, 1, 2].map((k) => { const a = (o.spin || 0) + k * 2.09; return `<path d="M120 -85L${(120 + Math.cos(a) * 36).toFixed(1)} ${(-85 + Math.sin(a) * 36).toFixed(1)}" stroke="${P.steel}" stroke-width="10" stroke-linecap="round"/>`; }).join("")}
    ${[0, 1, 2].map((i) => `<circle cx="${-150 + i * 22}" cy="-148" r="6" fill="${(o.on ?? 1) > 0.5 ? P.green : "#3a2a7a"}"/>`).join("")}`; };

// a guard booth, 200 wide, base on y = 0; o.lamp 0..1, o.cap: draw the empty cap on its hook
export const booth = (o = {}) => `${two(rr(-100, -300, 200, 300, 10), "#5a6aa8", "#44529a", 0, 10)}<path d="M-124 -300h248l-24 -50h-200Z" fill="${P.red}"/><path d="${rr(-70, -250, 140, 110, 8)}" fill="${mix(P.ink, P.win, o.lamp ?? 0)}"/><path d="M-70 -120h140V0H-70Z" fill="${P.ink}"/>
  ${o.cap ? `<path d="M-40 -205h50" stroke="${P.steel}" stroke-width="6"/>${two("M-54 -200Q-50 -232 -14 -232Q22 -232 26 -200Z", "#2a3a8a", "#1d2a6a", 0, 6)}<path d="M-60 -200h96" stroke="#1d2a6a" stroke-width="8" stroke-linecap="round"/>` : ""}${disc(0, -362, 16, (o.lamp ?? 0) > 0.5 ? P.gold : "#3a2a7a", P.ink)}`;

// a power pylon, 260 wide, 560 high, base on y = 0
export const pylon = () => `<path d="M-110 0L-30 -560H30L110 0" fill="none" stroke="${P.steel}" stroke-width="14"/><path d="M-86 -150H86M-62 -300H62M-44 -430H44M-90 -150L62 -300M90 -150L-62 -300M-62 -300L44 -430M62 -300L-44 -430" stroke="${P.steelD}" stroke-width="8"/><path d="M-130 -480H130" stroke="${P.steel}" stroke-width="14" stroke-linecap="round"/>${[-120, 120].map((x) => `<circle cx="${x}" cy="-470" r="10" fill="${P.gold}"/>`).join("")}`;

// a lightning bolt, centred, ~120 high
export const bolt = (c = P.gold, k = 1) => at(0, 0, `<path d="M18 -62L-34 8H-2L-18 62L34 -12H2Z" fill="${c}" stroke="${mix(c, P.ink, 0.3)}" stroke-width="5" stroke-linejoin="round"/>`, k);
// a gold ✓ / red ✗ badge, `a` age since it appeared (from kit.check / kit.cross); re-exported for the sets
export { check, cross } from "./kit.js";
