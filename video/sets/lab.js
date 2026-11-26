// Shorts lab (producer D): props for the standalone Shorts, drawn for the portrait frame (1080 x 1920), in the
// notebook palette of sci.js. Each prop is drawn around (0, 0), standing on y = 0 unless said otherwise.
import { clamp, lerp, ease, rr, two, disc, rings, text, drawn, at } from "./kit.js";
import { P, mix } from "./sci.js";

// ---- honey ----
export const jar = (fill = 1, lid = 1, glow = 0, old = 0) => { const c = mix("#f2b134", "#c97a10", 0.3), h = 300 * clamp(fill);
  return `${glow > 0 ? rings(0, -170, 220 * glow, P.gold, 0.22) : ""}${two("M-130 0Q-150 -150 -120 -300Q-110 -340 -70 -350H70Q110 -340 120 -300Q150 -150 130 0Z", old ? "#c9a06a" : "#f2f6ff", old ? "#a67c48" : "#cdd6ef", 8, 0)}
  ${old ? `<path d="M-130 -60Q0 -40 130 -60M-138 -150Q0 -130 138 -150M-130 -240Q0 -220 130 -240" stroke="#8a5e30" stroke-width="10" fill="none" opacity=".6"/>` : `<clipPath id="jarc"><path d="M-120 -4Q-140 -150 -110 -296H110Q140 -150 120 -4Z"/></clipPath><g clip-path="url(#jarc)"><rect x="-150" y="${-h}" width="300" height="${h}" fill="${c}"/><path d="M-80 ${-h + 30}Q-60 ${-h + 120} -84 ${-h + 200}" stroke="#ffe7a0" stroke-width="18" fill="none" opacity=".55" stroke-linecap="round"/></g>`}
  ${lid > 0 ? `<g transform="translate(0 ${-350 - 160 * (1 - lid)}) rotate(${-30 * (1 - lid)})">${two(rr(-90, -60, 180, 60, 14), old ? "#8a5e30" : P.coral, old ? "#6a4220" : P.coralD, 0, 6)}</g>` : ""}`; };
export const drip = (len = 1) => `<path d="M-20 0Q-20 ${60 * len} 0 ${90 * len}Q20 ${60 * len} 20 0Z" fill="#f2b134"/>${disc(0, 100 * len, 22, "#f2b134", "#c97a10")}`;
export const spoon = () => `<path d="M0 0L0 -260" stroke="${P.steel}" stroke-width="18" stroke-linecap="round"/><ellipse cy="40" rx="46" ry="62" fill="${P.steel}"/><ellipse cy="40" rx="34" ry="46" fill="#f2b134"/>`;
export const comb = (cols = 4, rows = 4, filled = 1, r = 70) => { let o = ""; const hx = (x, y, f) => { const p = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`; }).join("L"); return `<path d="M${p}Z" fill="${f ? "#f2b134" : "#f7d98a"}" stroke="#c97a10" stroke-width="10"/>`; };
  for (let rI = 0; rI < rows; rI++) for (let q = 0; q < cols; q++) { const x = (q - (cols - 1) / 2) * r * 1.74 + (rI % 2) * r * 0.87, y = (rI - (rows - 1) / 2) * r * 1.5; o += hx(x, y, (rI * cols + q) / (rows * cols) < filled); }
  return o; };
export const bee = (wing = 0, k = 1) => at(0, 0, `${[-1, 1].map((s) => `<ellipse cx="${s * 18}" cy="-46" rx="34" ry="${22 + 10 * Math.abs(Math.sin(wing))}" fill="#e8f4ff" opacity=".85" transform="rotate(${s * (30 + 30 * Math.sin(wing))} ${s * 6} -30)"/>`).join("")}
  ${two("M-60 0Q-60 -44 0 -44Q60 -44 60 0Q60 44 0 44Q-60 44 -60 0Z", "#f2b134", "#c97a10", 0, 6)}<path d="M-22 -42V42M10 -44V44M40 -36V36" stroke="${P.ink}" stroke-width="14"/>${disc(-72, -4, 28, P.ink, "#000")}<circle cx="-80" cy="-12" r="7" fill="#fff"/>`, k);
// a stone tomb wall: blocks, with carved pictures (an eye, a bird, a sun, wavy water), no letters
export const tombWall = (w = 1400, h = 1300) => { let o = `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="#d9b98a"/>`;
  for (let r = 0; r < h / 130; r++) for (let q = 0; q < w / 260 + 1; q++) o += `<path d="${rr(-w / 2 + q * 260 - (r % 2) * 130, -h + r * 130, 256, 126, 6)}" fill="none" stroke="#c4a070" stroke-width="6"/>`;
  const glyph = [`<path d="M-40 0Q0 -40 40 0Q0 40 -40 0Z" fill="none" stroke="#8a6a4a" stroke-width="8"/><circle r="12" fill="#8a6a4a"/>`, `<path d="M-30 30Q-20 -30 20 -20L40 -30L30 -6Q20 30 -30 30Z" fill="#8a6a4a"/>`, `<circle r="30" fill="none" stroke="#8a6a4a" stroke-width="8"/><circle r="8" fill="#8a6a4a"/>`, `<path d="M-40 0q10 -16 20 0t20 0t20 0t20 0" stroke="#8a6a4a" stroke-width="8" fill="none"/>`];
  for (let i = 0; i < 12; i++) o += at(-w / 2 + 160 + (i % 4) * (w - 320) / 3, -h + 180 + Math.floor(i / 4) * 160, glyph[i % 4], 0.9);
  return o; };
export const torch = (tot = 0) => `<path d="M0 0L-14 -140H14Z" fill="${P.woodD}"/><path d="M-26 -140Q-30 -${210 + 10 * Math.sin(tot * 11)} 0 -${250 + 14 * Math.sin(tot * 9)}Q30 -${210 + 10 * Math.sin(tot * 13)} 26 -140Z" fill="${P.gold}"/><path d="M-12 -140Q-14 -190 0 -${210 + 10 * Math.sin(tot * 10)}Q14 -190 12 -140Z" fill="#fff3b0"/>${rings(0, -190, 120, "#ffd98a", 0.16)}`;
export const waterDrop = (k = 1) => at(0, 0, `<path d="M0 -60Q40 -10 36 16Q30 50 0 50Q-30 50 -36 16Q-40 -10 0 -60Z" fill="#4a90c8"/><path d="M-12 10q0 16 14 22" stroke="#fff" stroke-width="6" fill="none" opacity=".5"/>`, k);
