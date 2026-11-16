// Props for the sets of crypto part 3 (keys, wallets, exchanges, lost keys, scams), drawn in the palette and style of
// parts 1 and 2 (bank.js, props.js, c2props.js). Each is drawn around (0, 0); "standing" props have their base on y = 0.
//   key       the gold private key; its blade is a strip of digits (`digits` shown, `unroll` 0..1 how far it has unrolled)
//   mailbox   the address: a post box on a pole with a long code on its front and a flag in the owner's colour
//   stamp     the signature stamp, and `mark`: the different pattern it leaves on each page
//   seedSlip  the cream slip with twelve short bars (the twelve words, never readable)
//   hotPhone  a phone wallet with wifi arcs; coldBox a small steel box with no antenna, with frost
//   tower     an exchange: a glass tower with a coin sign on top and a name plate; o.lit, o.crack, o.lean
//   receipt   the paper slip an exchange hands back instead of coins
//   drive     a hard drive; flash a flash drive with attempt dots; tin a popcorn tin
//   dump      a landfill heap; cuffs handcuffs; gavel; heart; bug (clipboard malware)
import { clamp, lerp, ease, seg, spring, rnd, rr, circ, two, disc, rings, text, number, drawn, at } from "./kit.js";
import { P, mix, coin, WHO, hexOf, whorl, page, slip, link } from "./c2props.js";
export { P, mix, coin, WHO, hexOf, whorl, page, slip, link };

const DIG = "9f3a17c04e8b62d5a0e197b3c58f246d1e0a7c39b5d8f2614e7a0c93b58d1f6";
// the key, 360 long at k = 1, lying to the right from its bow at (0, 0)
export const key = (o = {}) => { const c = o.c || P.gold, cD = o.cD || P.goldD, n = o.digits ?? 10, un = o.unroll ?? 1, len = 220 + 1400 * Math.max(0, un - 1);
  const shown = Math.min(DIG.length, Math.round(n * Math.max(un, 0.15)));
  const strip = `${two(rr(60, -26, Math.max(160, len), 52, 10), c, cD, 0, 6)}${text(80, 13, DIG.slice(0, shown), 34, P.ink, { anchor: "start", extra: 'letter-spacing="2"' })}`;
  return `${two(circ(0, 0, 70), c, cD)}<circle r="30" fill="${o.bg || P.ink}"/>${strip}${[0, 1, 2].map((i) => `<path d="${rr(len + 20 - i * 46, 20, 26, 36 + (i % 2) * 18, 4)}" fill="${cD}"/>`).join("")}`; };

// the address: a post box on a pole, 200 wide; o.code a short code, o.colour the flag, o.open 0..1 the lid
export const mailbox = (o = {}) => { const col = o.colour || P.blue, open = o.open || 0;
  return `<rect x="-10" y="-200" width="20" height="200" fill="${P.woodD}"/>${two(rr(-110, -330, 220, 140, 26), "#5a6aa8", "#44529a", 0, 10)}
    <g transform="translate(-110 -330) rotate(${(-70 * ease(open)).toFixed(1)})">${two(rr(0, 0, 220, 30, 12), "#6d7cc0", "#5a6aa8", 0, 6)}</g>
    <path d="${rr(-80, -280, 160, 18, 9)}" fill="${P.ink}"/><path d="${rr(-96, -250, 192, 46, 10)}" fill="${P.cream}"/>${text(0, -216, o.code || "bc1q" + hexOf(o.seed || 3, 6) + "…", 30, P.ink)}
    <rect x="110" y="-320" width="12" height="90" fill="${P.steelD}"/><path d="M122 -320h60l-14 22l14 22h-60Z" fill="${col}"/>`; };

// the signature mark a stamp leaves: one pattern per seed (a whorl, a star, a wave, rings)
export const mark = (seed = 1, r = 46, c) => { const col = c || [P.pink, P.teal, P.violet, P.blue][seed % 4], k = seed % 4;
  if (k === 0) return whorl(r, seed, col);
  if (k === 1) { let d = ""; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr_ = i % 2 ? r * 0.42 : r; d += `${i ? "L" : "M"}${(Math.cos(a) * rr_).toFixed(1)} ${(Math.sin(a) * rr_).toFixed(1)}`; } return `<circle r="${r * 1.02}" fill="${mix(col, "#ffffff", 0.78)}"/><path d="${d}Z" fill="${col}"/>`; }
  if (k === 2) return `<circle r="${r * 1.02}" fill="${mix(col, "#ffffff", 0.78)}"/>${[-0.5, 0, 0.5].map((y) => `<path d="M${-r * 0.8} ${y * r}q${r * 0.4} ${-r * 0.3} ${r * 0.8} 0t${r * 0.8} 0" fill="none" stroke="${col}" stroke-width="${r * 0.12}" stroke-linecap="round"/>`).join("")}`;
  return `<circle r="${r * 1.02}" fill="${mix(col, "#ffffff", 0.78)}"/>${[0.85, 0.55, 0.25].map((q) => `<circle r="${r * q}" fill="none" stroke="${col}" stroke-width="${r * 0.1}"/>`).join("")}`; };
// the stamp: a wooden handle over a round face; `seed` is the mark on its face
export const stamp = (seed = 1, o = {}) => `${two(rr(-26, -170, 52, 110, 18), P.wood, P.woodD, 6, 0)}${two("M-60 -70Q0 -100 60 -70V-30H-60Z", P.woodD, "#6a3e1f", 0, 6)}${two(rr(-74, -36, 148, 36, 10), P.red, P.redD, 0, 6)}${o.face ? at(0, 0, mark(seed, 30), [1, 0.35]) : ""}`;

// the twelve words: a cream slip with twelve short bars in three columns, 300 x 200
export const seedSlip = (o = {}) => { let g = `${two(rr(-150, -100, 300, 200, 10), P.cream, P.creamD, 0, 7)}`;
  for (let i = 0; i < 12; i++) { const cx = -100 + (i % 3) * 100, cy = -64 + Math.floor(i / 3) * 42, w = 40 + rnd(i * 5 + (o.seed || 1)) * 30;
    g += `${text(cx - 34, cy + 9, String(i + 1), 18, "#a58f5e", { anchor: "end" })}<path d="M${cx - 26} ${cy}h${w.toFixed(0)}" stroke="${o.ink || P.ink}" stroke-width="10" stroke-linecap="round"/>`; }
  return g; };

// a phone wallet, 200 x 380; o.inner is drawn on the screen (centre (0, -10)); o.wifi 0..1 the arcs' phase (they pulse when > 0)
export const hotPhone = (o = {}) => { const w = o.wifi ?? 0;
  const arcs = w > 0 ? [1, 2, 3].map((i) => { const ph = (w + i / 3) % 1, r = 60 + ph * 160; return `<path d="M${-r * 0.7} ${-200 - r * 0.7}A${r} ${r} 0 0 1 ${r * 0.7} ${-200 - r * 0.7}" fill="none" stroke="#9fe7ff" stroke-width="12" stroke-linecap="round" opacity="${(0.8 * (1 - ph)).toFixed(2)}"/>`; }).join("") : "";
  return `${arcs}${two(rr(-100, -190, 200, 380, 34), "#2c1f63", P.ink, 0, 10)}<path d="${rr(-84, -160, 168, 310, 16)}" fill="${o.glow || "#9fe7ff"}"/><path d="${rr(-30, -178, 60, 8, 4)}" fill="#1a0f3a"/>${o.inner || ""}`; };
// a cold wallet: a small steel box with a screen strip and two buttons, 240 x 140, frosted when o.frost > 0
export const coldBox = (o = {}) => { const fr = o.frost || 0, cr = o.crack || 0;
  return `${two(rr(-120, -70, 240, 140, 22), P.steel, P.steelD, 0, 10)}<path d="${rr(-90, -46, 130, 46, 8)}" fill="${P.ink}"/>${text(-25, -12, "••••", 30, P.green)}${disc(70, -24, 16, P.red, P.redD)}${disc(70, 26, 16, P.green, P.greenD)}
    ${fr > 0 ? `<path d="${rr(-120, -70, 240, 30, 16)}" fill="#e8f6ff" opacity="${(0.8 * fr).toFixed(2)}"/>${[-80, -20, 50].map((x) => `<path d="M${x} -40l8 22l8 -22" fill="#e8f6ff" opacity="${(0.8 * fr).toFixed(2)}"/>`).join("")}` : ""}
    ${cr > 0 ? drawn("M-110 -60L-50 -10L-70 20L10 30L40 70", cr, P.ink, 7) : ""}`; };

// an exchange: a glass tower 360 wide, base on y = 0; o.name on its plate, o.lit 0..1, o.h height, o.crack 0..1, o.mask
export const tower = (o = {}) => { const h = o.h || 760, lit = o.lit ?? 1, w = 360;
  let wins = ""; for (let r = 0; r < Math.floor((h - 200) / 70); r++) for (let i = 0; i < 4; i++) wins += `<path d="${rr(-150 + i * 78, -h + 150 + r * 70, 60, 44, 6)}" fill="${rnd(r * 7 + i + (o.seed || 0)) < lit ? "#9fe7ff" : "#203070"}" opacity="${rnd(r * 7 + i + (o.seed || 0)) < lit ? 0.9 : 1}"/>`;
  return `${two(rr(-w / 2, -h, w, h, 14), o.c || "#3c5bb0", o.cD || "#2c4590", 0, 12)}${wins}<path d="${rr(-w / 2 - 20, -40, w + 40, 40, 8)}" fill="#24346f"/>
    <path d="${rr(-110, -120, 220, 70, 10)}" fill="#141038"/><path d="${rr(-30, -110, 60, 70, 6)}" fill="${lit > 0.3 ? P.win : P.ink}"/>
    <rect x="-6" y="${-h - 90}" width="12" height="90" fill="${P.steelD}"/>${at(0, -h - 150, coin(70, "B"), 1)}
    ${o.name ? `<path d="${rr(-150, -h + 40, 300, 70, 12)}" fill="${P.ink}"/>${text(0, -h + 92, o.name, 52, o.nameC || P.gold)}` : ""}
    ${o.crack ? drawn(`M-120 ${-h + 120}L-40 ${-h * 0.6}L-90 ${-h * 0.4}L20 ${-h * 0.25}L-30 -60`, o.crack, P.ink, 10) : ""}`; };

// a receipt: a narrow paper strip with a zigzag bottom, 140 x 220
export const receipt = (o = {}) => `<path d="M-70 -110H70V100l-14 12l-14 -12l-14 12l-14 -12l-14 12l-14 -12l-14 12l-14 -12l-14 12l-14 -12V-110Z" fill="#fffaf0"/>${[0, 1, 2, 3].map((i) => `<path d="M-48 ${-80 + i * 32}h${60 + (i * 23) % 36}" stroke="#c9b48a" stroke-width="8" stroke-linecap="round"/>`).join("")}${o.amount ? text(0, 84, o.amount, 34, P.ink) : `<circle cx="34" cy="70" r="20" fill="${P.gold}"/>`}`;

// a hard drive, 220 x 150, platter visible; a flash drive with `dots` attempt dots, `used` of them red
export const drive = (o = {}) => `${two(rr(-110, -75, 220, 150, 14), "#5a6aa8", "#44529a", 0, 8)}<circle cx="-20" cy="0" r="56" fill="#cdd5ee"/><circle cx="-20" cy="0" r="12" fill="${P.steelD}"/><path d="M60 -50L-10 -6" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/>${o.glow ? rings(-20, 0, 70, P.gold, 0.25 * o.glow) : ""}`;
export const flash = (o = {}) => { const n = o.dots ?? 10, used = o.used || 0;
  return `<path d="${rr(150, -34, 60, 68, 8)}" fill="${P.steel}"/>${two(rr(-160, -60, 320, 120, 24), o.c || P.violet, o.cD || P.violetD, 0, 8)}${o.lock ? at(-100, 0, `<path d="M-14 -12v-10a14 14 0 0 1 28 0v10" fill="none" stroke="${P.cream}" stroke-width="7"/><path d="${rr(-20, -12, 40, 32, 6)}" fill="${P.cream}"/>`) : ""}
    ${Array.from({ length: n }, (_, i) => `<circle cx="${-40 + i * 19}" cy="0" r="7" fill="${i < used ? P.red : "#fff3c2"}"/>`).join("")}`; };
// a popcorn tin, 200 wide, base on y = 0; o.open 0..1 lifts the lid, o.glow lights what is inside
export const tin = (o = {}) => { const op = o.open || 0;
  return `${o.glow ? rings(0, -220, 120, P.gold, 0.3 * o.glow) : ""}${two(rr(-100, -230, 200, 230, 20), P.red, P.redD, 0, 10)}${[0, 1, 2].map((i) => `<path d="M${-70 + i * 60} -220v210" stroke="#fff" stroke-width="18" opacity=".85"/>`).join("")}
    ${[[-40, -250], [10, -262], [50, -248], [-10, -240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="#fff6d6"/>`).join("")}
    <g transform="translate(${(-110 * op).toFixed(1)} ${(-140 * ease(op)).toFixed(1)}) rotate(${(-30 * op).toFixed(1)})">${two(rr(-110, -250, 220, 34, 14), P.redD, "#a8283a", 0, 6)}</g>`; };
// a landfill heap, w wide, base on y = 0, with bags and bits; seed changes the mix
export const dump = (w = 1400, o = {}) => { const s = o.seed || 4; let bits = "";
  for (let i = 0; i < 40; i++) { const x = (rnd(s * 9 + i) - 0.5) * w * 0.85, hh = 260 * Math.sqrt(1 - Math.min(1, Math.abs(x) / (w / 2))), y = -rnd(s * 9 + i + 50) * hh * 0.9 - 20, col = ["#3a3570", "#2e5a4a", "#5a3a6a", "#6a5a3a"][i % 4];
    bits += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(30 + rnd(i + s) * 40).toFixed(0)}" ry="${(20 + rnd(i * 3 + s) * 20).toFixed(0)}" fill="${col}"/>`; }
  return `<path d="M${-w / 2} 0Q${-w / 4} -300 0 -300Q${w / 4} -300 ${w / 2} 0Z" fill="#2c2458"/>${bits}`; };
// handcuffs, 220 wide; o.shut 0..1
export const cuffs = (o = {}) => { const s = o.shut ?? 1; return `${[-60, 60].map((x) => `<circle cx="${x}" cy="0" r="44" fill="none" stroke="${P.steel}" stroke-width="14"/><path d="M${x - 44} 0a44 44 0 0 1 ${44 * (1 - s)} ${-44 * s}" stroke="${P.steelD}" stroke-width="14" fill="none"/>`).join("")}<path d="M-16 0h32" stroke="${P.steelD}" stroke-width="10"/>`; };
// a gavel, head up; `hit` 0..1 swings it down onto its block
export const gavel = (hit = 0) => `<path d="${rr(-110, -20, 220, 40, 10)}" fill="${P.woodD}"/><g transform="rotate(${(-40 + 40 * ease(hit)).toFixed(1)} 120 -60)">${two(rr(-40, -150, 160, 60, 14), P.wood, P.woodD, 0, 8)}<path d="${rr(110, -130, 140, 20, 8)}" fill="${P.wood}"/></g>`;
export const heart = (c = P.pink, k = 1) => at(0, 0, `<path d="M0 30C-60 -10 -60 -60 -24 -60C-8 -60 0 -46 0 -40C0 -46 8 -60 24 -60C60 -60 60 -10 0 30Z" fill="${c}"/>`, k);
// a clipboard-swapping bug, 120 wide
export const bug = (t = 0) => `<ellipse cx="0" cy="0" rx="50" ry="34" fill="${P.green}"/><circle cx="46" cy="-6" r="20" fill="${P.greenD}"/>${[-30, 0, 30].map((x, i) => `<path d="M${x} 20l${-10 + 6 * Math.sin(t * 20 + i)} 26M${x} -20l${-10 + 6 * Math.sin(t * 20 + i + 1)} -26" stroke="${P.ink}" stroke-width="6" stroke-linecap="round"/>`).join("")}<circle cx="54" cy="-12" r="5" fill="${P.ink}"/>`;
export { check, cross } from "./kit.js";
