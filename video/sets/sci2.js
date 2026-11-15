// Props for science part 2, in the notebook look of sci.js. Each is drawn around (0, 0), standing on y = 0 unless said.
import { clamp, lerp, ease, seg, rnd, rr, two, disc, rings, text, at, drawn } from "./kit.js";
import { P, mix } from "./sci.js";

// a bar of dark chocolate, 220 x 120 (centre); `bite` 0..1 takes a corner off
export const choc = (bite = 0) => { const sq = [0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((q) => `<path d="${rr(-100 + q * 50, -52 + r * 36, 44, 30, 5)}" fill="#7a4628"/><path d="${rr(-100 + q * 50, -52 + r * 36, 44, 8, 3)}" fill="#9a5c36"/>`)).join("");
  return `${two(rr(-110, -60, 220, 120, 10), "#5a3018", "#40200e", 0, 8)}${sq}${bite > 0 ? `<circle cx="110" cy="-60" r="${(50 * bite).toFixed(1)}" fill="${P.sky0}"/>` : ""}`; };
// a newspaper front page, 300 x 380 (centre): a masthead bar, a headline picture `pic`, lines of text
export const newspaper = (pic = "", k = 1, c = "#fffaf0") => at(0, 0, `${two(rr(-150, -190, 300, 380, 6), c, P.creamD, 8, 8)}<path d="${rr(-130, -172, 260, 34, 4)}" fill="${P.ink}"/><path d="M-130 -120h260" stroke="${P.ink}" stroke-width="10"/>
  <path d="${rr(-130, -100, 260, 150, 6)}" fill="#efe3c8"/>${at(0, -25, pic)}${[0, 1, 2, 3].map((i) => `<path d="M-130 ${78 + i * 28}h${i % 2 ? 200 : 260}" stroke="#b8a888" stroke-width="10" stroke-linecap="round"/>`).join("")}`, k);
// an arrow down over a scale (it slims you), 120 tall
export const slimArrow = (c = P.green) => `<path d="M-24 -60h48v50h30l-54 60l-54 -60h30Z" fill="${c}"/>`;
// a cooking pot, 260 wide, standing on y = 0; `steam` 0..1; `glow` gold ring; `lvl` water line height
export const pot = (o = {}) => { const tot = o.tot || 0;
  return `${two("M-130 -170H130V-30Q130 0 100 0H-100Q-130 0 -130 -30Z", o.c || P.steel, o.cD || P.steelD, 10, 0)}<path d="M-150 -170H150" stroke="${o.cD || P.steelD}" stroke-width="18" stroke-linecap="round"/><path d="M-150 -130h-30M150 -130h30" stroke="${P.ink}" stroke-width="14" stroke-linecap="round"/>
    ${o.lvl ? `<path d="M-130 ${-170 + 40}H130" stroke="${P.blue}" stroke-width="8" stroke-dasharray="16 10"/>` : ""}
    ${(o.steam || 0) > 0 ? [0, 1, 2].map((i) => { const q = (tot * 0.7 + i / 3) % 1; return `<path d="M${-60 + i * 60 + 10 * Math.sin(tot * 3 + i)} ${-190 - 120 * q}q-16 -18 0 -36q16 -18 0 -36" stroke="${P.chalk}" stroke-width="10" fill="none" stroke-linecap="round" opacity="${(0.8 * (1 - q) * o.steam).toFixed(2)}"/>`; }).join("") : ""}
    ${o.glow ? `<path d="M-140 -180H140V-30Q140 10 100 10H-100Q-140 10 -140 -30Z" fill="none" stroke="${P.gold}" stroke-width="10" opacity="${o.glow}"/>` : ""}`; };
// a stove flame under a pot, `h` 0..1
export const flame = (h = 1, tot = 0) => `<path d="M-60 0Q-50 ${-50 * h} -20 ${-30 * h}Q-10 ${-80 * h} 10 ${-40 * h}Q30 ${-70 * h + 6 * Math.sin(tot * 9)} 60 0Z" fill="${P.blue}"/><path d="M-30 0Q-20 ${-30 * h} 0 ${-20 * h}Q20 ${-36 * h} 30 0Z" fill="#9fd8ff"/>`;
// a spice jar, 80 wide; `tip` 0..1 tilts it to pour (to the left)
export const spice = (tip = 0) => at(0, 0, `${two(rr(-40, -120, 80, 120, 14), P.coral, P.coralD, 6, 0)}${two(rr(-46, -150, 92, 34, 10), P.gold, P.goldD, 0, 5)}<circle cx="0" cy="-60" r="18" fill="${P.cream}"/>`, 1, -110 * ease(tip));
// a pill box (closed) with a coloured band; `open` 0..1; `inside` "pill" or "sugar"
export const pillBox = (open = 0, inside = "pill", c = P.blue) => `${two(rr(-90, -110, 180, 110, 10), "#fffaf0", P.creamD, 6, 0)}<path d="${rr(-90, -70, 180, 26, 0)}" fill="${c}"/>
  ${open > 0 ? (inside === "sugar" ? [0, 1, 2].map((i) => two(rr(-60 + i * 40, -150 - 10 * open, 34, 34, 4), "#fff", "#e6e6e6", 0, 5)).join("") : [0, 1].map((i) => `<path d="${rr(-50 + i * 54, -150 - 10 * open, 46, 22, 11)}" fill="${c}"/>`).join("")) : ""}
  <g transform="translate(-90 -110) rotate(${(-70 * ease(open)).toFixed(1)})">${two(rr(0, -24, 180, 26, 8), "#fffaf0", P.creamD, 0, 5)}</g>`;
// an eye; `band` 0..1 draws a blindfold over it
export const eye = (band = 0, look = 0) => `<ellipse rx="70" ry="44" fill="#fff" stroke="${P.ink}" stroke-width="8"/><circle cx="${look * 20}" r="24" fill="${P.blue}"/><circle cx="${look * 20}" r="11" fill="${P.ink}"/>${band > 0 ? `<path d="${rr(-90 * band - 10, -18, 180 * band + 20, 36, 10)}" fill="${P.ink}"/><path d="M${90 * band} -10l40 -30M${90 * band} 10l44 20" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/>` : ""}`;
// a ladle (the cook), with eyes
export const ladle = (band = 0) => `<path d="M0 -40V-300" stroke="${P.steelD}" stroke-width="22" stroke-linecap="round"/>${two("M-80 -40Q-80 40 0 40Q80 40 80 -40Z", P.steel, P.steelD, 6, 0)}${at(0, -230, eye(band), 0.6)}`;
// a sailing ship facing right, about 760 wide, waterline at y = 0
export const ship = (tot = 0, o = {}) => { const sw = 3 * Math.sin(tot * 1.2);
  return `<g transform="rotate(${sw.toFixed(2)})">${two("M-380 -110H380L320 0H-320Z", P.wood, P.woodD, 0, 14)}<path d="M-380 -110H380" stroke="#5a3418" stroke-width="10"/>${[-240, -120, 0, 120, 240].map((x) => `<circle cx="${x}" cy="-60" r="16" fill="#3a2010"/>`).join("")}
    ${[-170, 60, 260].map((x, i) => `<path d="M${x} -110V${-560 + i * 60}" stroke="#5a3418" stroke-width="16"/><path d="M${x - 130 + i * 10} ${-500 + i * 60}Q${x + 20} ${-420 + i * 60} ${x - 130 + i * 10} ${-260 + i * 40}H${x + 140 - i * 10}Q${x + 170} ${-400 + i * 60} ${x + 140 - i * 10} ${-500 + i * 60}Z" fill="#fffaf0" stroke="${P.creamD}" stroke-width="6"/>`).join("")}
    <path d="M-170 -560V-640" stroke="#5a3418" stroke-width="8"/><path d="M-166 -640h70l-20 18l20 18h-70Z" fill="${o.flag || P.red}"/></g>`; };
// waves along y = 0 over [x0, x1]
export const waves = (x0, x1, tot, c = P.blue, cD = P.blueD) => { let d = `M${x0} 0`; for (let x = x0; x < x1; x += 120) d += `q30 ${-24 + 6 * Math.sin(tot * 2 + x)} 60 0t60 0`; return `<path d="${d}V600H${x0}Z" fill="${c}"/><path d="M${x0} 70H${x1}" stroke="${cD}" stroke-width="10" opacity=".4"/>`; };
// a hammock (a sick sailor: a cap on a pillow), 200 wide, hung from two hooks at y = 0; `well` 0..1 makes it bright
export const hammock = (c, cD, well = 0, empty = 0) => `<path d="M-120 0Q0 150 120 0" fill="none" stroke="${P.woodD}" stroke-width="10"/><circle cx="-120" r="10" fill="${P.ink}"/><circle cx="120" r="10" fill="${P.ink}"/>${two("M-110 6Q0 170 110 6Q60 40 0 44Q-60 40 -110 6Z", mix("#9aa3b8", c, 0.35 + 0.65 * well), mix("#7a8299", cD, 0.35 + 0.65 * well), 0, 8)}
  ${empty < 1 ? `<g opacity="${(1 - empty).toFixed(2)}">${disc(-60, 52, 30, "#fffaf0", P.creamD)}${two("M-90 42Q-60 0 -30 42Z", mix("#8a93b8", P.blue, well), mix("#6a7298", P.blueD, well), 0, 4)}<path d="M-40 70Q20 100 80 60" stroke="${mix("#6a7298", cD, 0.5)}" stroke-width="16" fill="none" stroke-linecap="round"/></g>` : ""}`;
// a bottle, 80 wide, with a label colour and a small mark drawn on it
export const bottle = (c, mark = "") => `${two("M-36 0V-150Q-36 -180 -16 -190V-230H16V-190Q36 -180 36 -150V0Z", c, mix(c, P.ink, 0.25), 6, 0)}<path d="${rr(-30, -130, 60, 60, 6)}" fill="#fffaf0"/>${mark}<path d="${rr(-18, -246, 36, 20, 4)}" fill="${P.woodD}"/>`;
// citrus: an orange and a lemon side by side
export const citrus = () => `${disc(-40, 0, 50, "#ff9f43", "#e07b1a")}<path d="M-40 -50q6 -16 18 -18" stroke="${P.greenD}" stroke-width="8" fill="none"/>${two("M10 0Q14 -50 60 -50Q110 -46 104 0Q110 46 60 50Q14 50 10 0Z", "#ffe066", "#e8c43a", 6, 4)}`;
// a big round counter label: `str` in a dark pill
export const tagNum = (str, size = 90, c = P.gold) => `<path d="${rr(-str.length * size * 0.28 - 40, -size * 0.75, str.length * size * 0.56 + 80, size * 1.15, size * 0.4)}" fill="${P.ink}"/>${text(0, size * 0.3, str, size, c)}`;
// a sheet of a research paper, 320 x 420 (centre): three blocks, question (?), method (flask), result (bars); `on` [q, m, r] 0..1
export const paperSheet = (on = [1, 1, 1], k = 1, glowM = 0) => at(0, 0, `${two(rr(-160, -210, 320, 420, 8), "#fffaf0", P.creamD, 8, 8)}<path d="M-130 -180h260" stroke="${P.ink}" stroke-width="12"/>
  ${on[0] > 0 ? at(-80, -100, `<path d="${rr(-50, -50, 100, 100, 12)}" fill="#efe3c8"/>${text(0, 30, "?", 80, P.violetD)}`, on[0]) + `<path d="M-10 -120h120M-10 -90h90" stroke="#b8a888" stroke-width="10" stroke-linecap="round" opacity="${on[0]}"/>` : ""}
  ${on[1] > 0 ? at(-80, 20, `${glowM > 0 ? rings(0, 0, 70, P.gold, 0.3 * glowM) : ""}<path d="${rr(-50, -50, 100, 100, 12)}" fill="${mix("#efe3c8", P.gold, glowM * 0.6)}"/><path d="M-12 -34V-6L-34 30H34L12 -6V-34Z" fill="none" stroke="${P.blueD}" stroke-width="8" stroke-linejoin="round"/>`, on[1]) + `<path d="M-10 0h120M-10 30h100M-10 60h70" stroke="#b8a888" stroke-width="10" stroke-linecap="round" opacity="${on[1]}"/>` : ""}
  ${on[2] > 0 ? at(-80, 140, `<path d="${rr(-50, -50, 100, 100, 12)}" fill="#efe3c8"/>${[0, 1, 2].map((i) => `<path d="${rr(-34 + i * 26, 30 - (20 + i * 20), 18, 20 + i * 20, 3)}" fill="${[P.coral, P.gold, P.green][i]}"/>`).join("")}`, on[2]) + `<path d="M-10 130h110M-10 160h80" stroke="#b8a888" stroke-width="10" stroke-linecap="round" opacity="${on[2]}"/>` : ""}`, k);
