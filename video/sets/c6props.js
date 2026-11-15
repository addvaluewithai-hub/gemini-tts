// Props for the sets of crypto part 6 (the hype and the law, the verdict, closing the file), drawn in the palette and
// style of parts 1 to 4 (bank.js, props.js, c2props.js, c3props.js, c4props.js). Each is drawn around (0, 0).
//   frame       a gold picture frame, o.inner drawn inside (centre (0, 0)); o.ape draws a pixel ape; o.grey fades it
//   ape         a pixel-art ape face (no real person), 12 x 12 cells
//   dogCoin     a gold coin with a dog face
//   rug         a red carpet, `pull` 0..1 yanks it to the right (things on it are drawn by the caller)
//   pump        a bicycle pump; `push` 0..1 the handle down
//   balloon     a coin blown up like a balloon, `size` 0..1, `pop` 0..1 bursts it
//   grave       a small gravestone with a coin mark; yoghurt a yoghurt pot with a date strip
//   cbVault     a central bank: a stern grey building with a vault door and its own coin on top
//   atom        the quantum machine: a glowing atom in a ring cage
//   megaphone   a megaphone (the richest man's post); podium a podium with a flag-coloured coin
//   folder      a file folder with a number tab, `open` 0..1
import { clamp, lerp, ease, seg, spring, rnd, rr, circ, two, disc, rings, text, number, drawn, at } from "./kit.js";
import { P, mix, coin, WHO, tower, receipt, key, seedSlip, gavel, heart, silo, balance, warehouse, clock, bolt, priceLine, whale, plank, newspaper, reportCard, fund, dial } from "./c4props.js";
export { P, mix, coin, WHO, tower, receipt, key, seedSlip, gavel, heart, silo, balance, warehouse, clock, bolt, priceLine, whale, plank, newspaper, reportCard, fund, dial };

// a pixel ape: brown cells around a lighter face, w is the whole width
const APE = ["....BBBB....", "..BBBBBBBB..", ".BBBBBBBBBB.", "BBFFFFFFFFBB", "BBFKFFFFKFBB", "BBFFFFFFFFBB", ".BFFFNNFFFB.", ".BFFFFFFFFB.", "..BFMMMMFB..", "..BBFFFFBB..", "...BBBBBB...", "............"];
export const ape = (w = 240, o = {}) => { const s = w / 12, C = { B: o.fur || "#7a4a2a", F: o.face || "#e8b98a", K: P.ink, N: "#5a3420", M: "#a0523a" }; let g = "";
  APE.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== ".") g += `<rect x="${(x * s - w / 2).toFixed(1)}" y="${(y * s - w / 2).toFixed(1)}" width="${(s + 0.6).toFixed(1)}" height="${(s + 0.6).toFixed(1)}" fill="${C[ch]}"/>`; }));
  return g; };
// a gold picture frame, w x h; inner centred at (0, 0)
export const frame = (w = 320, h = 260, o = {}) => { const gr = o.grey || 0, gold = mix(P.gold, "#7a7a8a", gr), goldD = mix(P.goldD, "#5a5a6a", gr);
  return `${two(rr(-w / 2 - 26, -h / 2 - 26, w + 52, h + 52, 10), gold, goldD, 0, 8)}<path d="${rr(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20, 4)}" fill="${goldD}"/><path d="${rr(-w / 2, -h / 2, w, h, 2)}" fill="${mix(o.bg || "#9fe7ff", "#3a3a4a", gr)}"/>
    <g opacity="${(1 - 0.7 * gr).toFixed(2)}">${o.ape ? ape(Math.min(w, h) * 0.86, o) : o.inner || ""}</g>`; };
// a gold coin with a dog face
export const dogCoin = (r = 60) => `${disc(0, 0, r, P.gold, P.goldD)}<circle r="${r * 0.78}" fill="none" stroke="${P.goldD}" stroke-width="${r * 0.06}"/>
  <path d="M${-r * 0.42} ${-r * 0.1}L${-r * 0.52} ${-r * 0.55}L${-r * 0.18} ${-r * 0.32}ZM${r * 0.42} ${-r * 0.1}L${r * 0.52} ${-r * 0.55}L${r * 0.18} ${-r * 0.32}Z" fill="#c47f22"/>
  <ellipse cx="0" cy="${r * 0.05}" rx="${r * 0.42}" ry="${r * 0.38}" fill="#f4c27a"/><circle cx="${-r * 0.16}" cy="${-r * 0.04}" r="${r * 0.06}" fill="${P.ink}"/><circle cx="${r * 0.16}" cy="${-r * 0.04}" r="${r * 0.06}" fill="${P.ink}"/>
  <ellipse cx="0" cy="${r * 0.16}" rx="${r * 0.1}" ry="${r * 0.07}" fill="${P.ink}"/><path d="M${-r * 0.12} ${r * 0.28}q${r * 0.12} ${r * 0.1} ${r * 0.24} 0" stroke="${P.ink}" stroke-width="${r * 0.04}" fill="none"/>`;
// a red carpet, w wide, lying on y = 0; pull 0..1 drags it to the right and lifts its end
export const rug = (w = 700, pull = 0) => { const dx = ease(pull) * w * 1.2, lift = Math.sin(Math.PI * clamp(pull)) * 40;
  return `<g transform="translate(${dx.toFixed(1)} 0)"><path d="M${-w / 2} 0h${w}l20 ${(-lift).toFixed(1)}v18l-20 ${(lift).toFixed(1)}h${-w}Z" fill="${P.redD}"/><path d="M${-w / 2} -14h${w}l20 ${(-lift).toFixed(1)}v14h${-w - 20}Z" fill="${P.red}"/>${[0.2, 0.5, 0.8].map((q) => `<path d="M${-w / 2 + w * q - 20} -8h40" stroke="${P.gold}" stroke-width="6"/>`).join("")}</g>`; };
// a bicycle pump, base on y = 0, about 300 high; push 0..1
export const pump = (push = 0) => { const y = -300 + 90 * ease(push);
  return `<path d="${rr(-90, -18, 180, 18, 6)}" fill="${P.steelD}"/>${two(rr(-30, -220, 60, 205, 10), P.blue, P.blueD, 8, 0)}<rect x="-6" y="${y.toFixed(1)}" width="12" height="${(-220 - y + 10).toFixed(1)}" fill="${P.steel}"/>${two(rr(-80, y - 22, 160, 30, 12), P.ink, "#000", 0, 6)}<path d="M30 -40q80 0 120 -60" stroke="${P.ink}" stroke-width="10" fill="none"/>`; };
// a coin blown up like a balloon on a string; size 0..1, pop 0..1 bursts it into shreds
export const balloon = (size = 1, pop = 0) => { if (pop > 0) { let g = ""; for (let i = 0; i < 8; i++) { const a = i * 0.785, d = 40 + 160 * ease(pop); g += `<path d="M${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d - 120).toFixed(1)}l14 -20l10 22Z" fill="${P.gold}" opacity="${(1 - pop).toFixed(2)}"/>`; } return g + `<path d="M0 0v-40" stroke="${P.steel}" stroke-width="4"/>`; }
  const r = 40 + 90 * size; return `<path d="M0 0Q-20 -${r * 0.4} 0 -${r * 0.6}" stroke="${P.steel}" stroke-width="4" fill="none"/>${at(0, -r * 0.6 - r, rings(0, 0, r, P.gold, 0.12) + `<ellipse rx="${r}" ry="${r * 1.08}" fill="${P.gold}"/><ellipse rx="${r * 0.8}" ry="${r * 0.86}" fill="none" stroke="${P.goldD}" stroke-width="${r * 0.06}"/>` + text(0, r * 0.3, "B", r * 0.9, P.goldD) + `<ellipse cx="${-r * 0.4}" cy="${-r * 0.5}" rx="${r * 0.18}" ry="${r * 0.1}" fill="#fff" opacity=".6"/>`)}`; };
// a small gravestone, base on y = 0, with a coin mark
export const grave = (k = 1, seed = 1) => at(0, 0, `${two("M-50 0V-90Q-50 -140 0 -140Q50 -140 50 -90V0Z", "#6d6a8a", "#55526e", 6, 0)}<circle cy="-90" r="22" fill="none" stroke="#4a4762" stroke-width="6"/><path d="M-8 -100v20M8 -100v20" stroke="#4a4762" stroke-width="5"/><path d="M-60 0h120" stroke="#2c2458" stroke-width="10"/>${rnd(seed) > 0.5 ? `<path d="M-30 -40h60" stroke="#4a4762" stroke-width="5"/>` : ""}`, k);
// a yoghurt pot with a short date strip
export const yoghurt = () => `${two("M-60 -150L-48 0H48L60 -150Z", "#f4f0e6", "#d9d2c0", 0, 6)}<path d="M-66 -168h132v20h-132Z" fill="${P.blue}"/><path d="${rr(-40, -110, 80, 30, 6)}" fill="${P.pink}"/><path d="M-30 -95h60" stroke="#fff" stroke-width="5"/>`;
// a central bank: grey columns, a round vault door, and its own coin on a pole; base on y = 0, 560 wide
export const cbVault = (o = {}) => { const open = o.open || 0;
  return `${two(rr(-280, -420, 560, 420, 8), "#8a90a8", "#6d728a", 0, 10)}<path d="M-310 -420L0 -560L310 -420Z" fill="#5a5e76"/>${[-220, -140, 140, 220].map((x) => `<path d="${rr(x - 18, -400, 36, 380, 6)}" fill="#a3a8c0"/>`).join("")}
    ${disc(0, -190, 110, "#b8bdd4", "#8a90a8")}<g transform="translate(0 -190) rotate(${(open * 160).toFixed(1)})">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 0L${(Math.cos(i * 1.047) * 80).toFixed(1)} ${(Math.sin(i * 1.047) * 80).toFixed(1)}" stroke="#6d728a" stroke-width="12"/>`).join("")}<circle r="22" fill="#6d728a"/></g>
    <rect x="-6" y="-640" width="12" height="90" fill="${P.steelD}"/>${at(0, -690, disc(0, 0, 54, o.coinC || "#9fe7ff", "#5fb6ff") + text(0, 18, o.sym || "◆", 48, P.ink))}`; };
// the quantum machine: a glowing atom in a ring cage, radius r; t is the time for the electrons
export const atom = (r = 120, t = 0) => `${rings(0, 0, r * 0.9, "#b98aff", 0.2)}<circle r="${r}" fill="none" stroke="${P.steel}" stroke-width="10"/>${[0, 1.05, 2.1].map((a) => `<ellipse rx="${r * 0.8}" ry="${r * 0.28}" fill="none" stroke="#c9a8ff" stroke-width="6" transform="rotate(${(a * 57.3).toFixed(1)})"/>`).join("")}
  ${[0, 1.05, 2.1].map((a, i) => { const p = t * 2.4 + i * 2; return `<circle cx="${(Math.cos(p) * r * 0.8 * Math.cos(a) - Math.sin(p) * r * 0.28 * Math.sin(a)).toFixed(1)}" cy="${(Math.cos(p) * r * 0.8 * Math.sin(a) + Math.sin(p) * r * 0.28 * Math.cos(a)).toFixed(1)}" r="${r * 0.07}" fill="#fff"/>`; }).join("")}<circle r="${r * 0.16}" fill="#e0c8ff"/>`;
// a megaphone pointing right, 200 long
export const megaphone = () => `${two("M-90 -30L60 -80V80L-90 30Z", P.red, P.redD, 0, 8)}<path d="${rr(-120, -30, 34, 60, 8)}" fill="${P.ink}"/><path d="M-70 30l-10 50h26l12 -50Z" fill="${P.ink}"/>${[0, 1, 2].map((i) => `<path d="M${80 + i * 26} -${40 + i * 16}q${20} ${40 + i * 16} 0 ${80 + i * 32}" stroke="${P.cream}" stroke-width="7" fill="none" opacity="${(0.8 - i * 0.2).toFixed(1)}"/>`).join("")}`;
// a podium with a flag-coloured coin on its front; base on y = 0
export const podium = () => `${two("M-120 0L-100 -220H100L120 0Z", "#3c5bb0", "#2c4590", 0, 10)}<path d="${rr(-140, -250, 280, 40, 8)}" fill="#24346f"/>${at(0, -130, disc(0, 0, 60, P.gold, P.goldD) + `<path d="M-40 -16h80M-40 0h80M-40 16h80" stroke="${P.red}" stroke-width="8"/><path d="${rr(-40, -30, 32, 26, 2)}" fill="${P.blue}"/>`)}<path d="M-20 -250v-60" stroke="${P.ink}" stroke-width="6"/><circle cx="-20" cy="-316" r="12" fill="${P.ink}"/>`;
// a file folder, 300 x 220, with a number tab; open 0..1 lifts the front flap
export const folder6 = (n = 1, open = 0, o = {}) => `${two(rr(-150, -110, 300, 220, 12), o.c || "#e8a23c", o.cD || "#c47f22", 0, 8)}<path d="M-150 -110h100l20 -28h-120Z" fill="${o.cD || "#c47f22"}"/>${text(-100, -118, String(n), 28, "#fff")}
  <g transform="translate(0 110) scale(1 ${(1 - open * 0.9).toFixed(3)}) translate(0 -110)">${two(rr(-160, -86, 320, 196, 12), o.f || "#ffc15a", o.c || "#e8a23c", 0, 8)}</g>`;
export { check, cross } from "./kit.js";
