// Props for science part 3 (explain-science-03-world), in the notebook look of sci.js. Each prop is drawn around
// (0, 0), standing on y = 0 unless said otherwise.
import { clamp, lerp, ease, rr, two, disc, rings, text, number, drawn, at } from "./kit.js";
import { P, mix } from "./sci.js";

// a bed seen from the side; `empty` 0..1 fades the blanket's hump (a quiet way to show a death: no bodies)
export const bed = (empty = 0, c = P.cream) => `${two(rr(-150, -70, 300, 40, 8), c, P.creamD, 0, 6)}<path d="M-150 -30V0M150 -30V0" stroke="${P.steelD}" stroke-width="12"/>${two(rr(-160, -130, 26, 100, 8), P.steel, P.steelD, 0, 0)}
  <path d="M-120 -70Q-40 -${70 + 70 * (1 - empty)} 80 -70Z" fill="${mix(P.blue, P.cream, 0.3)}" opacity="${(1 - 0.85 * empty).toFixed(2)}"/><ellipse cx="-110" cy="-82" rx="34" ry="14" fill="#fffaf0"/>`;
// a hospital front: a pediment, columns, and a door in the middle
export const hospital = (w = 900, h = 520) => `${two(rr(-w / 2, -h, w, h, 6), "#efe2c8", "#d9c6a2", 0, 0)}${two(`M${-w / 2 - 40} ${-h}L0 ${-h - 170}L${w / 2 + 40} ${-h}Z`, "#e7d4b0", "#cdb48a", 0, 0)}
  ${Array.from({ length: 6 }, (_, i) => `<path d="${rr(-w / 2 + 60 + i * (w - 160) / 5, -h + 40, 34, h - 40, 4)}" fill="#d9c6a2"/>`).join("")}<path d="${rr(-80, -230, 160, 230, 70)}" fill="#6a4a3a"/>
  ${two(rr(-60, -h - 110, 120, 70, 8), P.red, P.redD, 0, 0)}<path d="M-12 ${-h - 100}h24v50h-24zM-25 ${-h - 87}h50v24h-50z" fill="#fff"/>`;
// a doctor or a midwife as a simple figure: a round head and a coat; `c` the coat colour
export const figure = (c = P.blue, cD = P.blueD, face = 0) => `<g transform="scale(1.5)">${two("M-56 0Q-62 -150 0 -160Q62 -150 56 0Z", c, cD, 8, 0)}${disc(0, -200, 46, "#f2c9a0", "#d9a77a")}
  ${face < 0 ? `<path d="M-20 -206l12 6M20 -206l-12 6M-14 -180q14 -10 28 0" stroke="${P.ink}" stroke-width="6" fill="none"/>` : `<circle cx="-15" cy="-205" r="5" fill="${P.ink}"/><circle cx="15" cy="-205" r="5" fill="${P.ink}"/>`}</g>`;
// a basin of water on a stand, with a ripple
export const basin = (tot = 0, glow = 0) => `${glow > 0 ? rings(0, -170, 160 * glow, "#9fe7ff", 0.25) : ""}<path d="M-20 0V-140M20 0V-140" stroke="${P.woodD}" stroke-width="14"/>${two("M-150 -170Q-140 -90 0 -90Q140 -90 150 -170Z", "#f2f6ff", "#cdd6ef", 0, 8)}
  <ellipse cx="0" cy="-170" rx="150" ry="22" fill="#9fd4f5"/><ellipse cx="${8 * Math.sin(tot * 2)}" cy="-170" rx="70" ry="9" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`;
// two hands, palms out; `dots` 0..1 shows the invisible germs on them as faint violet dots
export const hands = (dots = 0, wash = 0) => [-1, 1].map((s) => at(s * 90, 0, `${two("M-50 0V-110Q-50 -130 -36 -130Q-24 -130 -24 -112V-150Q-24 -170 -10 -170Q4 -170 4 -150V-160Q4 -180 18 -180Q32 -180 32 -160V-140Q32 -160 46 -160Q58 -160 58 -140V-40Q58 0 20 0Z", "#f2c9a0", "#d9a77a", 6, 0)}
  ${dots > 0 ? Array.from({ length: 9 }, (_, i) => `<circle cx="${-30 + (i % 3) * 30}" cy="${-40 - Math.floor(i / 3) * 34}" r="${7 + (i % 2) * 3}" fill="#8a5bd6" opacity="${(0.75 * dots * (1 - wash)).toFixed(2)}"/>`).join("") : ""}`, [s, 1])).join("");
// a bar with its number on top (a share of deaths); h in px
export const bar = (h, c, num = "", size = 70) => `<path d="${rr(-70, -h, 140, h, 10)}" fill="${c}"/>${num ? text(0, -h - 24, num, size, P.ink) : ""}`;
// a weathervane: a pole, an arrow turning to angle `rot` (deg), and whatever rides on it
export const vane = (rot = 0, rider = "") => `<path d="M0 0V-420" stroke="${P.ink}" stroke-width="14"/><circle cy="-420" r="16" fill="${P.ink}"/>
  <g transform="translate(0 -420) rotate(${rot.toFixed(1)})"><path d="M-260 0H200" stroke="${P.ink}" stroke-width="12"/><path d="M200 -40L280 0L200 40Z" fill="${P.coral}"/><path d="M-260 -50L-200 0L-260 50L-300 50L-240 0L-300 -50Z" fill="${P.coral}"/>${rider ? at(-40, -20, rider) : ""}</g>
  ${["", "", "", ""].map((_, i) => { const a = i * Math.PI / 2; return `<path d="M0 -330L${(Math.cos(a) * 110).toFixed(0)} ${(-330 + Math.sin(a) * 30).toFixed(0)}" stroke="${P.ink}" stroke-width="6"/>`; }).join("")}`;
export const egg = (k = 1, crack = 0) => at(0, 0, `${two("M0 -110Q60 -110 70 -20Q70 40 0 40Q-70 40 -70 -20Q-60 -110 0 -110Z", "#fffaf0", "#ecdcbf", 6, 4)}${crack > 0 ? drawn("M-60 -20l20 -14l16 18l20 -18l18 16l20 -14", crack, P.ink, 6) : ""}`, k);
export const cup = (steam = 0, tot = 0) => `${two("M-70 -120H70L58 0H-58Z", "#fffaf0", P.creamD, 6, 0)}<path d="M70 -96Q120 -96 112 -50Q104 -20 62 -24" fill="none" stroke="${P.creamD}" stroke-width="14"/><ellipse cy="-120" rx="70" ry="14" fill="#6a4228"/>
  ${steam > 0 ? [-24, 18].map((x, i) => `<path d="M${x} -150q-16 -30 0 -60q16 -30 0 -60" fill="none" stroke="${P.steel}" stroke-width="8" stroke-linecap="round" opacity="${(0.5 * steam).toFixed(2)}" transform="translate(${(4 * Math.sin(tot * 3 + i)).toFixed(1)} 0)"/>`).join("") : ""}`;
// a hand-drawn map sheet with a pen: a coastline that a newer line corrects
export const mapSheet = (lines = 1, fix = 0) => `${two(rr(-340, -240, 680, 480, 10), "#fffaf0", P.creamD, 10, 10)}
  <path d="M-260 -120Q-140 -200 -40 -120T160 -100T260 -20" fill="none" stroke="${P.blue}" stroke-width="10" opacity="${lines > 0 ? 0.35 : 0}"/>
  ${drawn("M-260 -120Q-160 -170 -60 -110T140 -80T260 0", fix, P.blueD, 10)}<path d="M-280 140H280" stroke="${P.creamD}" stroke-width="6"/>`;
export const pen = () => `<path d="M0 0L-24 -40L120 -184L144 -160Z" fill="${P.gold}"/><path d="M0 0L-24 -40L-6 -46Z" fill="${P.ink}"/>`;
// a bust on a plinth, frozen: `web` adds a cobweb
export const bust = (web = 0) => `${two(rr(-120, -260, 240, 260, 8), "#d8d2c4", "#bdb6a6", 0, 8)}${two("M-90 -260Q-100 -340 -60 -360Q-90 -440 0 -460Q90 -440 60 -360Q100 -340 90 -260Z", "#cfc8b8", "#b0a898", 6, 0)}
  ${disc(0, -460, 70, "#d8d2c4", "#b0a898")}<path d="M-26 -470h18M8 -470h18M-20 -432q20 6 40 0" stroke="#8d8676" stroke-width="7" fill="none"/>
  ${web > 0 ? `<g opacity="${clamp(web).toFixed(2)}" stroke="#8d8676" stroke-width="3" fill="none"><path d="M120 -260L40 -330M120 -260L70 -360M120 -260L120 -380M120 -260L170 -360"/><path d="M60 -320Q90 -330 100 -300M80 -350Q110 -350 120 -320"/></g>` : ""}`;

// ---- the continents (simplified outlines, about 360 px tall) ----
export const SAM = "M-60 -200Q20 -230 90 -170Q160 -120 150 -40Q130 30 80 80Q40 140 20 200Q0 240 -20 200Q-10 120 -60 60Q-110 0 -110 -80Q-110 -170 -60 -200Z";
export const AFR = "M-150 -190Q-60 -230 40 -200Q120 -180 150 -100Q170 -20 130 40Q90 120 50 190Q20 230 0 190Q-20 120 -60 60Q-100 20 -160 -20Q-200 -80 -190 -140Q-180 -180 -150 -190Z";
export const continent = (d, c = P.green, cD = P.greenD) => two(d, c, cD, 6, 6);
export const fossil = (c = "#8a6a4a") => `<g fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"><path d="M-70 10Q-40 -30 0 -20Q40 -30 70 0"/><circle cx="84" cy="4" r="16"/>${[-50, -30, -10, 10, 30, 50].map((x) => `<path d="M${x} ${-18 - (x === -50 || x === 50 ? -8 : 0)}V${12 + Math.abs(x) * 0.1}"/>`).join("")}<path d="M-70 10L-100 30"/></g>`;
export const tent = (snow = 1) => `${two("M-140 0L0 -170L140 0Z", "#e86f4a", "#c4502a", 0, 0)}<path d="M0 -170L-30 0H30Z" fill="#7a2a1a"/><path d="M0 -170V-240" stroke="${P.ink}" stroke-width="8"/><path d="M0 -240L70 -220L0 -200Z" fill="${P.red}"/>${snow > 0 ? `<path d="M-120 -24L0 -150L120 -24" fill="none" stroke="#fff" stroke-width="10" opacity="${snow}"/>` : ""}`;
// a research ship with a sonar fan below it
export const sonarShip = (tot = 0, ping = 0) => `${ping > 0 ? [0, 1, 2].map((i) => { const p = (ping + i / 3) % 1; return `<path d="M${-200 * p} ${80 + 360 * p}Q0 ${110 + 420 * p} ${200 * p} ${80 + 360 * p}" fill="none" stroke="#bfe8ff" stroke-width="8" opacity="${(0.8 * (1 - p)).toFixed(2)}"/>`; }).join("") : ""}
  ${two("M-220 -20H220L180 60H-180Z", "#fffaf0", P.creamD, 0, 8)}${two(rr(-80, -110, 160, 90, 8), P.coral, P.coralD, 0, 6)}<path d="M40 -110V-180" stroke="${P.ink}" stroke-width="10"/><circle cx="40" cy="-186" r="14" fill="${P.gold}"/>`;

// ---- Marshall ----
export const stomach = (hot = 0) => { const c = mix("#f19aa6", P.red, clamp(hot)), cD = mix("#d07482", P.redD, clamp(hot));
  return `${two("M-60 -230Q-20 -240 -10 -190Q0 -140 60 -150Q180 -170 200 -50Q210 60 100 110Q-20 160 -110 90Q-170 40 -150 -40Q-140 -100 -90 -130Q-70 -150 -80 -200Q-84 -226 -60 -230Z", c, cD, 10, 8)}<path d="M180 70Q240 100 250 160" stroke="${cD}" stroke-width="44" fill="none" stroke-linecap="round"/>`; };
export const bug = (wob = 0, c = "#5fa98a", cD = "#3f8a6c") => `<path d="M-40 0Q-30 -20 -14 0T16 0T46 0" fill="none" stroke="${c}" stroke-width="18" stroke-linecap="round" transform="rotate(${(10 * Math.sin(wob)).toFixed(1)})"/><path d="M46 0q20 -10 30 -24M46 0q24 4 34 -4" stroke="${cD}" stroke-width="5" fill="none"/>`;
export const acidDrop = () => `<path d="M0 -40Q26 -6 24 12Q20 34 0 34Q-20 34 -24 12Q-26 -6 0 -40Z" fill="#c9e86a"/><path d="M-8 6q0 12 10 16" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/>`;
export const stressCloud = (tot = 0) => `<path d="M-90 20Q-130 -10 -90 -40Q-90 -90 -30 -80Q0 -120 50 -90Q110 -100 110 -40Q150 -10 110 20Z" fill="#8d8aa6"/>${[-40, 0, 40].map((x, i) => `<path d="M${x} 30l-14 34h16l-10 30" stroke="${P.gold}" stroke-width="8" fill="none" opacity="${(0.6 + 0.4 * Math.sin(tot * 6 + i)).toFixed(2)}"/>`).join("")}`;
export const glass = (fill = 1, bugs = 0, tot = 0) => `<path d="M-60 -200L-48 0H48L60 -200Z" fill="#cfe9ff" opacity=".35" stroke="#cfe9ff" stroke-width="6"/><path d="M${-60 + 12 * (1 - fill) * 0} ${-200 * fill + 0}L-48 0H48L${60 - 0} ${-200 * fill}Z" fill="#c9d98a" opacity="${fill > 0 ? 0.8 : 0}"/>
  ${bugs > 0 && fill > 0.1 ? [[-20, -60], [16, -110], [-6, -150]].filter(([, y]) => -y < 200 * fill).map(([x, y], i) => at(x, y, bug(tot * 4 + i), 0.45)).join("") : ""}`;

// ---- Newton ----
export const orbitRose = (turn = 0, n = 6, rx = 330, ry = 230, c = P.coral) => Array.from({ length: n }, (_, i) => `<ellipse rx="${rx}" ry="${ry}" fill="none" stroke="${c}" stroke-width="5" opacity="${(0.25 + 0.75 * (i === n - 1)).toFixed(2)}" transform="rotate(${(turn * (i + 1) / n).toFixed(2)})"/>`).join("");
export const telescope = (rot = -24) => `<g transform="rotate(${rot})">${two(rr(-30, -36, 300, 72, 30), P.blue, P.blueD, 0, 8)}${two(rr(250, -46, 60, 92, 20), P.blueD, "#24557d", 0, 0)}</g><path d="M0 0L-70 160M0 0L70 160M0 0V170" stroke="${P.ink}" stroke-width="10"/>`;
export const rocket = (flame = 1, tot = 0) => `${flame > 0 ? `<path d="M-30 80Q0 ${150 + 20 * Math.sin(tot * 20)} 30 80Z" fill="${P.gold}"/><path d="M-16 80Q0 ${120 + 12 * Math.sin(tot * 24)} 16 80Z" fill="#fff3b0"/>` : ""}${two("M0 -150Q50 -90 46 40L60 90H-60L-46 40Q-50 -90 0 -150Z", "#f2f6ff", "#cdd6ef", 0, 0)}
  <circle cy="-40" r="22" fill="${P.blue}" stroke="${P.steelD}" stroke-width="6"/><path d="M-46 40L-90 100L-50 90ZM46 40L90 100L50 90Z" fill="${P.red}"/>`;
// a house: walls, a roof, and an optional second floor `top` 0..1 being built (rises from the roof line)
export const house = (top = 0, c = "#e7d4b0", cD = "#cdb48a") => { const roofY = -300 - 260 * ease(clamp(top));
  return `${two(rr(-260, -300, 520, 300, 6), c, cD, 0, 8)}${[[-150, -200], [150, -200]].map(([x, y]) => `<path d="${rr(x - 50, y - 50, 100, 100, 6)}" fill="#9fd4f5" stroke="#fffaf0" stroke-width="10"/>`).join("")}<path d="${rr(-50, -150, 100, 150, 6)}" fill="#8a4a32"/>
    ${top > 0 ? `${two(rr(-240, roofY, 480, -300 - roofY, 6), "#cfe0f5", "#a9c1df", 0, 8)}${-300 - roofY > 120 ? [[-120, roofY + 110], [120, roofY + 110]].map(([x, y]) => `<path d="${rr(x - 45, y - 45, 90, 90, 6)}" fill="#9fd4f5" stroke="#fffaf0" stroke-width="10"/>`).join("") : ""}` : ""}
    ${two(`M-300 ${roofY}L0 ${roofY - 170}L300 ${roofY}Z`, "#b94a2a", "#8a3420", 0, 0)}`; };

// ---- eggs, ice cream ----
export const guide = (limit = 1, low = 0) => `${two(rr(-200, -280, 400, 280, 14), "#fffaf0", P.creamD, 8, 8)}${[0, 1, 2, 3].map((i) => `<path d="M-150 ${-230 + i * 50}h${i === 3 ? 160 : 300}" stroke="${P.creamD}" stroke-width="12" stroke-linecap="round"/>`).join("")}
  <g opacity="${clamp(limit).toFixed(2)}"><path d="M-170 -40H170" stroke="${P.red}" stroke-width="10" stroke-dasharray="20 12"/><path d="${rr(100, -70, 70, 50, 10)}" fill="${P.red}"/><path d="M118 -46h34" stroke="#fff" stroke-width="8"/></g>
  ${low > 0 ? at(130, -90, `<path d="M-14 -40h28v30h22l-36 40l-36 -40h22Z" fill="${P.green}"/>`, low) : ""}`;
export const plate = () => `<ellipse rx="150" ry="34" fill="#fffaf0" stroke="${P.creamD}" stroke-width="8"/><ellipse rx="90" ry="18" fill="none" stroke="${P.creamD}" stroke-width="5"/>`;
export const drop = (c = P.red) => `<path d="M0 -60Q40 -10 36 16Q30 50 0 50Q-30 50 -36 16Q-40 -10 0 -60Z" fill="${c}"/><path d="M-12 10q0 16 14 22" stroke="#fff" stroke-width="6" fill="none" opacity=".5"/>`;
export const seesaw = (tilt = 0, l = "", r = "") => `${two("M-60 0L0 -90L60 0Z", P.steel, P.steelD, 0, 0)}<g transform="translate(0 -90) rotate(${tilt.toFixed(1)})">${two(rr(-360, -18, 720, 36, 10), P.wood, P.woodD, 0, 6)}${l ? at(-260, -18, l) : ""}${r ? at(260, -18, r) : ""}</g>`;
export const cart = (open = 1) => `${two(rr(-170, -200, 340, 170, 16), "#fffaf0", P.creamD, 0, 8)}<path d="M-170 -160H170" stroke="${P.pink}" stroke-width="20"/><circle cx="-110" cy="-20" r="40" fill="${P.ink}"/><circle cx="110" cy="-20" r="40" fill="${P.ink}"/>
  <path d="M0 -200V-330" stroke="${P.steel}" stroke-width="10"/><path d="M-170 -330Q0 -420 170 -330Z" fill="${P.pink}"/><path d="M-170 -330Q-110 -300 -56 -330Q0 -300 56 -330Q110 -300 170 -330" fill="#fffaf0"/>
  ${open > 0 ? at(0, -230, iceCone(), 0.9 * open) : ""}`;
export const iceCone = (c = P.pink) => `<path d="M-34 0L0 90L34 0Z" fill="#e3b06a"/><path d="M-24 10l40 40M-10 0l36 36" stroke="#c48a3a" stroke-width="5"/>${disc(0, -20, 44, c, mix(c, P.ink, 0.2))}${disc(0, -60, 30, "#fffaf0", P.creamD)}`;
export const lifeguard = (flag = 1, tot = 0) => `<path d="M-80 0L-50 -260M80 0L50 -260M-70 -100H70" stroke="${P.wood}" stroke-width="18"/>${two(rr(-90, -340, 180, 90, 10), P.red, P.redD, 0, 6)}<path d="M-100 -350H100L80 -400H-80Z" fill="#fffaf0"/>
  <path d="M60 -400V-520" stroke="${P.ink}" stroke-width="8"/><path d="M60 -520L${140 + 10 * Math.sin(tot * 4)} -500L60 -480Z" fill="${flag > 0.5 ? P.red : P.gold}"/>`;
export const buoy = () => `<circle r="56" fill="none" stroke="${P.red}" stroke-width="30"/><circle r="56" fill="none" stroke="#fffaf0" stroke-width="30" stroke-dasharray="44 44"/>`;
export const lineChart = (pts, p = 1, c = P.coral, w = 10) => drawn("M" + pts.map(([x, y]) => `${x} ${y}`).join("L"), p, c, w, 'stroke-linejoin="round"');

// ---- bricks and walls ----
export const brick = (c = "#c8613f", cD = "#9e4a2f", crack = 0) => `${two(rr(-80, -40, 160, 80, 6), c, cD, 0, 8)}${crack > 0 ? drawn("M-30 -40L-10 -10L-26 10L-4 40", crack, P.ink, 6) : ""}`;
const BC = [["#c8613f", "#9e4a2f"], ["#b85a3c", "#8f442c"], ["#d26e4a", "#a85436"]];
// a wall of `rows` x `cols` bricks; `n` how many are laid so far (bottom up)
export const wall = (rows = 5, cols = 6, n = 99, crack = -1) => { let o = ""; let k = 0;
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols + (r % 2); q++) { if (k++ >= n) break; const x = (q - cols / 2 + 0.5) * 168 - (r % 2) * 84, y = -44 - r * 86, [c, cD] = BC[(r * 7 + q) % 3];
    if (q === cols && r % 2 === 0) continue; o += at(x, y, brick(c, cD, k - 1 === crack ? 1 : 0)); }
  return o; };
export const bin = () => `${two("M-90 -200H90L72 0H-72Z", P.steel, P.steelD, 0, 6)}<path d="${rr(-104, -230, 208, 34, 10)}" fill="${P.steelD}"/>${[-40, 0, 40].map((x) => `<path d="M${x} -170V-30" stroke="${P.steelD}" stroke-width="8"/>`).join("")}`;
export const weight = (c = P.ink) => `${two("M-110 0L-80 -170H80L110 0Z", c, mix(c, "#000", 0.3), 0, 8)}<path d="M-40 -170Q-40 -230 0 -230Q40 -230 40 -170" stroke="${c}" stroke-width="22" fill="none"/>`;
// a little lab (one team): a bench with a flask and a flag of its own colour (no countries)
export const team = (c, cD) => `${two(rr(-90, -60, 180, 60, 8), P.wood, P.woodD, 0, 6)}<path d="M-40 -60V-150" stroke="${P.ink}" stroke-width="6"/><path d="M-40 -150L20 -132L-40 -114Z" fill="${c}"/>
  <path d="M30 -60L40 -100V-130H60V-100L70 -60Z" fill="#cfe9ff" stroke="${cD}" stroke-width="5"/>`;
