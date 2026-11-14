// Props and helpers shared by the sets of science part 1 (explain-science-01-world), drawn in the bank set's palette
// and style (bank.js, props.js). Each prop is drawn around (0, 0), standing on y = 0 unless said otherwise.
//
// Timing: a science shot is written against its own length D (how long its beat runs, `s.ends[k]` once
// sets/beats.cjs --write has run, else an estimate from the beat's words), and places its actions at fractions of D
// or at seconds measured from the words (see sets/README.md). `dur(s, k, est)` gives D.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, rr, circ, two, disc, rings, text, number, drawn, at, FW, FH, layer } from "./kit.js";
import { P as P0, mix, stars as stars0 } from "./bank.js";
// The science file's own look, so it does not read as the crypto file: a teal night instead of the violet one, an
// observatory blue-green dusk, mint and coral accents, chalk white for lines; amber (`gold`) stays "look here".
export const P = { ...P0, sky0: "#0a2f4f", sky1: "#1d6f86", sky2: "#ffc98a", night0: "#061726", night1: "#0e3f56", far: "#164a63", mid: "#12405a", ground: "#0b2c3d", road: "#08202d", soil: "#061a26",
  violet: "#2fb7a6", violetD: "#1f8c80", ink: "#071522", gold: "#ffbe47", goldD: "#f08a1a", mint: "#5ef0c8", mintD: "#2fc4a0", coral: "#ff7a6b", coralD: "#e0554a", chalk: "#eaf6f2", win: "#ffd27a" };
export const stars = (seed, n, x0, x1, y1, tot) => stars0(seed, n, x0, x1, y1, tot).replace(/#b9a8ff/g, "#9fd8e6");
export { mix };

export const dur = (s, k, est) => ((s && s.ends && s.ends[k]) || est);
export const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));

// ---- skies ----
export const nightSky = (c, tot, seed = 11, moon = true) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -600, 2600, 760, tot) + (moon ? `<circle cx="1560" cy="170" r="56" fill="${P.cream}"/><circle cx="1540" cy="156" r="50" fill="${P.night0}"/>` : ""), c, 0.15);
export const duskSky = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bsky)"/>`;
// a bright noon sky (the desert of the stick and the shadow)
export const noonSky = (id = "noon") => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5fd0"/><stop offset=".6" stop-color="#5fa6ff"/><stop offset="1" stop-color="#ffd9a0"/></linearGradient></defs><rect width="${FW}" height="${FH}" fill="url(#${id})"/>`;
// a lab or a room: a deep violet wall and a floor line at y = G (world units, through the camera)
export const room = (G, wall = "#2b1a63", floor = "#1c0f45") => `<rect x="-1500" y="-1500" width="5000" height="${G + 1500}" fill="${wall}"/><rect x="-1500" y="${G}" width="5000" height="1500" fill="${floor}"/><path d="M-1500 ${G}H3500" stroke="#1f6f7a" stroke-width="10"/>`;

// ---- light and particles ----
// the sun, radius r; `beams` 0..1 draws its rays
export const sun = (r = 120, tot = 0, beams = 1) => `${rings(0, 0, r * 1.5 * (1 + 0.03 * Math.sin(tot * 1.7)), "#ffe27a", 0.22, 1.5)}${beams > 0 ? Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6 + tot * 0.15; return `<path d="M${(Math.cos(a) * r * 1.15).toFixed(1)} ${(Math.sin(a) * r * 1.15).toFixed(1)}L${(Math.cos(a) * r * (1.15 + 0.45 * beams)).toFixed(1)} ${(Math.sin(a) * r * (1.15 + 0.45 * beams)).toFixed(1)}" stroke="#ffe27a" stroke-width="${r * 0.12}" stroke-linecap="round"/>`; }).join("") : ""}${disc(0, 0, r, "#ffe27a", "#ffb53a")}`;
// a neutrino: a small bright dot with a short trail to the left (direction: +x)
export const neutrino = (r = 18, trail = 140, c = "#7fffd4") => `<path d="M${-trail} 0L0 ${-r * 0.6}L0 ${r * 0.6}Z" fill="${c}" opacity=".35"/>${rings(0, 0, r * 1.6, c, 0.3)}<circle r="${r}" fill="#eafffa"/>`;
// a pulse of light: a short gold dash with a glow (direction: +x)
export const photon = (len = 160, c = "#ffe27a") => `<path d="M${-len} 0H0" stroke="${c}" stroke-width="10" stroke-linecap="round" opacity=".45"/><path d="M${-len * 0.4} 0H0" stroke="#fff6c8" stroke-width="16" stroke-linecap="round"/>${rings(0, 0, 26, c, 0.3)}`;

// ---- instruments ----
// a stopwatch, radius r, the hand at `hand` turns (0..1 = once round); `big` is a number on its face (or "")
export const stopwatch = (r = 120, hand = 0, big = "", o = {}) => { const a = hand * Math.PI * 2 - Math.PI / 2, face = o.face || P.cream;
  return `${two(rr(-r * 0.18, -r * 1.32, r * 0.36, r * 0.28, r * 0.06), P.steel, P.steelD, 0, 6)}<path d="M${-r * 0.7} ${-r * 0.78}l${-r * 0.14} ${-r * 0.14}" stroke="${P.steel}" stroke-width="${r * 0.12}" stroke-linecap="round"/>${disc(0, 0, r, o.rim || P.red, o.rimD || P.redD, 0.08)}<circle r="${r * 0.84}" fill="${face}"/>
    ${Array.from({ length: 12 }, (_, i) => { const t = i * Math.PI / 6; return `<path d="M${(Math.cos(t) * r * 0.7).toFixed(1)} ${(Math.sin(t) * r * 0.7).toFixed(1)}L${(Math.cos(t) * r * 0.8).toFixed(1)} ${(Math.sin(t) * r * 0.8).toFixed(1)}" stroke="${P.ink}" stroke-width="${r * 0.05}" stroke-linecap="round"/>`; }).join("")}
    ${big !== "" ? text(0, r * 0.5, big, r * 0.62, o.bigFill || P.red) : ""}<path d="M0 0L${(Math.cos(a) * r * 0.66).toFixed(1)} ${(Math.sin(a) * r * 0.66).toFixed(1)}" stroke="${P.ink}" stroke-width="${r * 0.07}" stroke-linecap="round"/><circle r="${r * 0.08}" fill="${P.ink}"/>`; };
// a wall clock, radius r; hands from `h` (hours, 0..12) and `m` (minutes, 0..60)
export const clock = (r = 100, h = 3, m = 0, rim = P.violet, rimD = P.violetD) => { const ah = (h / 12) * Math.PI * 2 - Math.PI / 2, am = (m / 60) * Math.PI * 2 - Math.PI / 2;
  return `${disc(0, 0, r, rim, rimD, 0.08)}<circle r="${r * 0.84}" fill="${P.cream}"/>${Array.from({ length: 12 }, (_, i) => { const t = i * Math.PI / 6; return `<circle cx="${(Math.cos(t) * r * 0.7).toFixed(1)}" cy="${(Math.sin(t) * r * 0.7).toFixed(1)}" r="${r * 0.05}" fill="${P.ink}"/>`; }).join("")}
    <path d="M0 0L${(Math.cos(ah) * r * 0.42).toFixed(1)} ${(Math.sin(ah) * r * 0.42).toFixed(1)}" stroke="${P.ink}" stroke-width="${r * 0.09}" stroke-linecap="round"/><path d="M0 0L${(Math.cos(am) * r * 0.64).toFixed(1)} ${(Math.sin(am) * r * 0.64).toFixed(1)}" stroke="${P.ink}" stroke-width="${r * 0.06}" stroke-linecap="round"/><circle r="${r * 0.08}" fill="${P.red}"/>`; };
// a magnifying glass, lens radius r, handle to the lower right; `inner` is drawn inside the lens (already scaled by the caller)
export const magnifier = (r = 90, inner = "", id = "mg") => `<path d="M${r * 0.7} ${r * 0.7}L${r * 1.6} ${r * 1.6}" stroke="${P.woodD}" stroke-width="${r * 0.34}" stroke-linecap="round"/><path d="M${r * 0.72} ${r * 0.72}L${r * 1.55} ${r * 1.55}" stroke="${P.wood}" stroke-width="${r * 0.22}" stroke-linecap="round"/>
  <clipPath id="${id}"><circle r="${r}"/></clipPath><circle r="${r}" fill="#cfe9ff" opacity=".35"/><g clip-path="url(#${id})">${inner}</g><circle r="${r}" fill="none" stroke="${P.steel}" stroke-width="${r * 0.16}"/><path d="M${-r * 0.55} ${-r * 0.25}A${r * 0.6} ${r * 0.6} 0 0 1 ${-r * 0.2} ${-r * 0.58}" stroke="#fff" stroke-width="${r * 0.1}" stroke-linecap="round" fill="none" opacity=".6"/>`;
// a thermometer, 300 tall, standing on y = 0; level 0..1
export const thermometer = (level = 0.3, c = P.red) => `${two(rr(-26, -300, 52, 250, 26), "#f2f6ff", "#cdd6ef", 6, 0)}${disc(0, -40, 44, c, mix(c, P.ink, 0.25))}<path d="${rr(-12, -40 - 220 * level, 24, 220 * level + 10, 12)}" fill="${c}"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M10 ${-90 - i * 40}h16" stroke="${P.steelD}" stroke-width="5"/>`).join("")}`;
// a flashlight pointing +x, 200 long; `on` 0..1 draws the beam (length `reach`)
export const flashlight = (on = 0, reach = 700) => `${on > 0 ? `<path d="M90 -30L${reach} ${-reach * 0.32}V${reach * 0.32}L90 30Z" fill="#fff3b0" opacity="${(0.28 * on).toFixed(3)}"/>` : ""}${two(rr(-110, -26, 160, 52, 14), P.steel, P.steelD, 0, 6)}${two("M50 -40L100 -54V54L50 40Z", P.steel, P.steelD, 0, 6)}<path d="M100 -48V48" stroke="${on > 0 ? "#fff3b0" : P.ink}" stroke-width="10"/><path d="${rr(-70, -10, 34, 20, 6)}" fill="${P.red}"/>`;
// a bag of flour, 160 wide, standing on y = 0; `tip` 0..1 tilts it to pour
export const flourBag = (tip = 0) => at(0, 0, `${two("M-80 0Q-92 -120 -60 -200H60Q92 -120 80 0Z", P.cream, P.creamD, 8, 0)}<path d="M-60 -200L-40 -232H40L60 -200Z" fill="${P.creamD}"/>${disc(0, -100, 34, P.gold, P.goldD)}<path d="M-14 -96q14 -26 28 0" stroke="#8a5200" stroke-width="7" fill="none"/>`, 1, -100 * ease(tip));
// a hammer, head at the top, 260 long; drawn upright around its grip end (0, 0)
export const hammer = (c = P.steel, cD = P.steelD) => `${two(rr(-14, -230, 28, 230, 12), P.wood, P.woodD, 5, 0)}${two(rr(-80, -290, 160, 70, 14), c, cD, 0, 8)}`;
// an idea card: a cream card with a "?" (a claim that can be tested) or a gold card with a "✓" (one that held)
export const card = (mark = "?", glow = 0, k = 1) => at(0, 0, `${glow > 0 ? rings(0, 0, 150 * (0.6 + 0.4 * glow), P.gold, 0.18 * glow) : ""}${two(rr(-90, -120, 180, 240, 18), mix(P.cream, P.gold, glow), mix(P.creamD, P.goldD, glow), 8, 8)}<path d="${rr(-70, -100, 140, 200, 12)}" fill="none" stroke="${mix("#d9c39a", "#f09a1a", glow)}" stroke-width="6"/>${text(0, 52, mark, 150, mix(P.violetD, "#8a5200", glow))}`, k);
// a lab bench with a flask, 520 wide, top on y = −180
export const bench = (o = {}) => `${two(rr(-260, -180, 520, 40, 8), P.wood, P.woodD, 0, 8)}<rect x="-230" y="-140" width="26" height="140" fill="${P.woodD}"/><rect x="204" y="-140" width="26" height="140" fill="${P.woodD}"/>${o.flask === false ? "" : at(-120, -180, flask(o.liquid || P.green))}`;
export const flask = (liquid = P.green, bub = 0) => `<path d="M-22 -150V-90L-80 -10Q-86 0 -74 0H74Q86 0 80 -10L22 -90V-150Z" fill="#cfe9ff" opacity=".35" stroke="#cfe9ff" stroke-width="6"/><path d="M-56 -36L-80 -8Q-84 0 -74 0H74Q84 0 80 -8L56 -36Z" fill="${liquid}"/><path d="${rr(-30, -166, 60, 18, 6)}" fill="${P.steel}"/>${bub > 0 ? [0, 1, 2].map((i) => `<circle cx="${-20 + i * 20}" cy="${-30 - ((bub * 60 + i * 30) % 90)}" r="${6 + i * 2}" fill="#fff" opacity=".6"/>`).join("") : ""}`;
// a laboratory building with a dome, 600 wide, base on y = 0; `lit` 0..1 its windows; `tag` a short Latin name on the band
export const lab = (o = {}) => { const lit = o.lit ?? 1, c = o.c || "#5a69b3", cD = o.cD || "#44529a";
  return `${two(rr(-300, -300, 600, 300, 8), c, cD, 14, 0)}${two("M-170 -300A170 170 0 0 1 170 -300Z", o.dome || P.steel, P.steelD, 0, 10)}<path d="M-12 -470V-560" stroke="${P.steelD}" stroke-width="10"/><circle cx="-12" cy="-566" r="12" fill="${P.red}"/>
    ${[-220, -110, 110, 220].map((x) => `<path d="${rr(x - 36, -240, 72, 90, 8)}" fill="${lit > 0.5 ? P.win : P.ink}"/>`).join("")}<path d="M-50 0V-120A50 50 0 0 1 50 -120V0Z" fill="${P.ink}"/>${o.tag ? `<path d="${rr(-150, -296, 300, 60, 10)}" fill="${P.ink}"/>${text(0, -250, o.tag, 46, P.gold)}` : ""}`; };
// a mountain with a tunnel mouth at its foot (the lab under the rock); base on y = 0
export const mountain = (w = 900, h = 520, o = {}) => `${two(`M${-w / 2} 0L${-w * 0.12} ${-h}L${w * 0.05} ${-h * 0.82}L${w * 0.2} ${-h * 0.95}L${w / 2} 0Z`, o.c || "#6a4bb0", o.cD || "#4d3390", 0, 0)}<path d="M${-w * 0.12} ${-h}L${-w * 0.2} ${-h * 0.8}L${-w * 0.1} ${-h * 0.84}L${-w * 0.02} ${-h * 0.76}L${w * 0.05} ${-h * 0.82}Z" fill="${P.cream}"/>`;
// a podium with a microphone stand, for a press conference; 260 wide, base on y = 0
export const podium = (o = {}) => `${two("M-130 0L-110 -280H110L130 0Z", o.c || P.blue, o.cD || P.blueD, 0, 10)}<path d="M-150 -280H150V-300H-150Z" fill="${P.ink}"/>${[-50, 0, 50].map((x, i) => `<path d="M${x * 0.4} -300L${x} -400" stroke="${P.ink}" stroke-width="8"/>${two(rr(x - 16, -440, 32, 56, 16), ["#ff5fa2", "#3ddc97", "#ffd04a"][i], P.ink, 0, 6)}`).join("")}${o.mark ? disc(0, -150, 56, P.gold, P.goldD) + o.mark : ""}`;
// a camera flash: a white star at (0, 0), p 0..1 through its life
export const flash = (p) => (p <= 0 || p >= 1 ? "" : `<g opacity="${(1 - p).toFixed(2)}" transform="scale(${(0.6 + p).toFixed(3)})"><path d="M0 -70L14 -14L70 0L14 14L0 70L-14 14L-70 0L-14 -14Z" fill="#fff"/>${rings(0, 0, 50, "#fff", 0.4)}</g>`);
// a desk drawer seen from the front, 360 wide, top on y = −220; `open` 0..1 pulls the drawer out (down and toward us)
export const drawerDesk = (open = 0, inner = "") => `${two(rr(-200, -240, 400, 240, 10), P.wood, P.woodD, 0, 10)}<path d="${rr(-220, -260, 440, 30, 8)}" fill="${P.woodD}"/>${inner}<g transform="translate(0 ${(40 * open).toFixed(1)}) scale(${(1 + 0.12 * open).toFixed(3)})">${two(rr(-170, -200, 340, 110, 10), "#c98a52", P.woodD, 0, 8)}<path d="${rr(-40, -160, 80, 22, 11)}" fill="${P.ink}"/></g>`;
// a lit desk with a candle and papers: the place a named person worked (a nameplate carries the name)
export const desk = (o = {}) => { const flame = o.flame ?? 1, tot = o.tot || 0;
  return `${two(rr(-300, -200, 600, 40, 8), P.wood, P.woodD, 0, 8)}<rect x="-270" y="-160" width="30" height="160" fill="${P.woodD}"/><rect x="240" y="-160" width="30" height="160" fill="${P.woodD}"/>
    <path d="M-200 -200l140 -16l10 16Z" fill="${P.cream}"/><path d="M-180 -214l150 -10l4 12Z" fill="${P.creamD}"/>
    ${o.plate ? `${two(rr(-30, -262, 230, 62, 8), P.gold, P.goldD, 0, 6)}${text(85, -217, o.plate, o.plate.length > 12 ? 30 : 38, "#8a5200")}` : ""}
    <path d="${rr(-250, -310, 34, 110, 6)}" fill="${P.cream}"/>${flame > 0 ? `${rings(-233, -334, 60 * flame, P.gold, 0.25)}<path d="M-233 ${-310 - 46 * flame}q-16 26 0 36q16 -10 0 -36Z" fill="${P.gold}" transform="rotate(${(4 * Math.sin(tot * 9)).toFixed(1)} -233 -310)"/>` : `<path d="M-233 -310q10 -30 -6 -60" stroke="${P.steel}" stroke-width="5" fill="none" opacity=".5"/>`}`; };
// a scroll, 120 tall (rolled), standing on its end
export const scroll = (c = P.cream, cD = P.creamD) => `${two(rr(-26, -120, 52, 120, 24), c, cD, 6, 0)}<ellipse cx="0" cy="-120" rx="26" ry="10" fill="${cD}"/>`;
// a bookshelf of scrolls and books, 520 wide, base on y = 0; `n` how many shelves
export const shelf = (seed = 1, n = 3, w = 520) => { let out = two(rr(-w / 2, -n * 170 - 20, w, n * 170 + 20, 8), P.woodD, "#5a3418", 0, 8);
  for (let r = 0; r < n; r++) { const y = -r * 170 - 20; out += `<path d="${rr(-w / 2 + 16, y - 150, w - 32, 150, 4)}" fill="#3a2010"/>`; let x = -w / 2 + 26; let i = 0;
    while (x < w / 2 - 50) { const bw = 26 + rnd(seed + r * 40 + i) * 26, bh = 90 + rnd(seed + r * 40 + i + 7) * 50, cc = [P.red, P.blue, P.green, P.violet, P.gold, P.pink, P.teal][Math.floor(rnd(seed + r * 40 + i + 3) * 7)];
      out += `<path d="${rr(x, y - bh, bw, bh, 4)}" fill="${cc}"/><path d="M${x + 4} ${y - bh + 16}h${bw - 8}" stroke="${P.ink}" stroke-width="4" opacity=".4"/>`; x += bw + 4; i++; } out += `<path d="${rr(-w / 2, y, w, 18, 4)}" fill="${P.wood}"/>`; }
  return out; };
// a ladder, `rungs` rungs `gap` apart, base on y = 0, 220 wide
export const ladder = (rungs = 4, gap = 150, c = P.wood, cD = P.woodD) => { const h = rungs * gap + 40;
  return `<path d="${rr(-120, -h, 26, h, 8)}" fill="${c}"/><path d="${rr(94, -h, 26, h, 8)}" fill="${c}"/>${Array.from({ length: rungs }, (_, i) => `<path d="${rr(-100, -40 - i * gap - 12, 200, 24, 8)}" fill="${cD}"/>`).join("")}`; };
// a plane facing right, 420 long
export const plane = (c = "#f2f6ff", cD = "#cdd6ef") => `${two("M-200 -14Q-200 -40 -150 -40H150Q210 -40 214 0Q210 30 150 30H-150Q-200 30 -200 -14Z", c, cD, 0, 8)}${two("M-20 -10L60 -10L-60 130H-110Z", P.blue, P.blueD, 0, 8)}${two("M-40 -36L20 -36L-60 -130H-100Z", P.blue, P.blueD, 0, 6)}${two("M-170 -36L-120 -36L-170 -110H-200Z", P.red, P.redD, 0, 6)}${[0, 1, 2, 3, 4].map((i) => `<circle cx="${-40 + i * 44}" cy="-10" r="9" fill="#2a80d2"/>`).join("")}<path d="M176 -18q20 4 26 16h-30Z" fill="#2a80d2"/>`;
// a satellite, 300 wide
export const satellite = () => `${[-1, 1].map((s) => `<path d="${rr(s > 0 ? 50 : -150, -36, 100, 72, 4)}" fill="#2a80d2"/>${[0, 1, 2].map((i) => `<path d="M${(s > 0 ? 50 : -150) + 33 * (i + 1)} -36V36" stroke="#9fd2ff" stroke-width="4"/>`).join("")}<path d="M${s * 30} 0H${s * 50}" stroke="${P.steel}" stroke-width="8"/>`).join("")}${two(rr(-30, -40, 60, 80, 10), P.gold, P.goldD, 0, 6)}<path d="M0 -40V-70" stroke="${P.steel}" stroke-width="6"/><circle cy="-74" r="10" fill="${P.red}"/>`;
// wifi waves (the internet), 200 wide, base point at (0, 0)
export const wifi = (c = P.blue) => `${[60, 110, 160].map((r) => `<path d="M${-r * 0.72} ${-r * 0.7}A${r} ${r} 0 0 1 ${r * 0.72} ${-r * 0.7}" stroke="${c}" stroke-width="22" fill="none" stroke-linecap="round"/>`).join("")}<circle cy="-8" r="16" fill="${c}"/>`;
// a phone, 150 x 290, standing on y = 0; `glow` the screen colour
export const phone = (glow = "#9fe7ff") => `${two(rr(-75, -290, 150, 290, 24), "#2c1f63", P.ink, 0, 8)}<path d="${rr(-62, -272, 124, 236, 12)}" fill="${glow}"/><circle cy="-18" r="9" fill="${P.steelD}"/>${[0, 1, 2].map((r) => [0, 1, 2].map((q) => `<path d="${rr(-48 + q * 34, -250 + r * 40, 26, 26, 6)}" fill="${[P.pink, P.gold, P.green][(r + q) % 3]}"/>`).join("")).join("")}`;
// a bridge span, 900 long, deck at y = 0
export const bridge = (c = P.red, cD = P.redD) => `${[-300, 300].map((x) => two(rr(x - 26, -300, 52, 520, 6), c, cD, 8, 0)).join("")}<path d="M-450 -40Q-300 -300 -300 -300Q0 -60 300 -300Q450 -40 450 -40" stroke="${c}" stroke-width="12" fill="none"/>${Array.from({ length: 11 }, (_, i) => { const x = -250 + i * 50; const y = -300 + 240 * (1 - Math.pow((x / 300), 2)); return `<path d="M${x} ${y.toFixed(1)}V0" stroke="${cD}" stroke-width="5"/>`; }).join("")}${two(rr(-460, -10, 920, 40, 6), "#5a69b3", "#44529a", 0, 8)}`;
// a tall building, `floors` floors of 46, 260 wide, base on y = 0
export const tower = (floors = 20, c = "#5a69b3", cD = "#44529a", seed = 3) => { const h = floors * 46 + 30;
  return `${two(rr(-130, -h, 260, h, 6), c, cD, 14, 0)}${Array.from({ length: floors }, (_, r) => [0, 1, 2, 3].map((q) => `<path d="${rr(-104 + q * 56, -h + 24 + r * 46, 40, 26, 4)}" fill="${rnd(seed + r * 9 + q) > 0.4 ? P.win : P.ink}"/>`).join("")).join("")}`; };
// a pill bottle, 140 tall, standing on y = 0
export const pillBottle = () => `${two(rr(-56, -150, 112, 150, 14), "#ff9f43", "#e07b1a", 8, 0)}<path d="${rr(-50, -110, 100, 66, 6)}" fill="${P.cream}"/>${two(rr(-64, -186, 128, 40, 10), "#f2f6ff", "#cdd6ef", 0, 6)}<path d="M-26 -78h52M0 -100v44" stroke="${P.red}" stroke-width="14" stroke-linecap="round"/>`;
// a gold medal on a ribbon, radius r
export const medal = (r = 70, label = "1") => `<path d="M-40 ${-r - 60}L-10 ${-r + 6}H10L40 ${-r - 60}" stroke="${P.red}" stroke-width="30" fill="none"/>${disc(0, 0, r, P.gold, P.goldD)}<circle r="${r * 0.72}" fill="none" stroke="${P.goldD}" stroke-width="${r * 0.1}"/>${text(0, r * 0.36, label, r, "#8a5200")}`;
// a trophy, 200 tall, standing on y = 0
export const trophy = () => `${two(rr(-70, -40, 140, 40, 6), P.woodD, "#5a3418", 0, 6)}<path d="M-20 -40V-80H20V-40Z" fill="${P.goldD}"/>${two("M-80 -200H80Q80 -80 0 -80Q-80 -80 -80 -200Z", P.gold, P.goldD, 10, 0)}<path d="M-80 -180Q-130 -180 -120 -130Q-110 -100 -70 -110M80 -180Q130 -180 120 -130Q110 -100 70 -110" stroke="${P.gold}" stroke-width="14" fill="none"/>`;
// a pennant on a pole in a colour (a team, not a country), standing on y = 0
export const pennant = (c, cD, wave = 0) => `<path d="M0 0V-180" stroke="${P.steel}" stroke-width="8"/><path d="M4 -180L${90 + 8 * Math.sin(wave)} ${-150 + 4 * Math.cos(wave)}L4 -120Z" fill="${c}"/><path d="M4 -150L${60 + 6 * Math.sin(wave)} -140L4 -126Z" fill="${cD}" opacity=".6"/>`;
// a gravestone, 200 wide, standing on y = 0; `year` on its face
export const grave = (year = "") => `${two("M-100 0V-200Q-100 -290 0 -290Q100 -290 100 -200V0Z", "#8a93b8", "#6a7298", 10, 0)}<path d="M-40 -220H40M0 -250V-170" stroke="#5a6288" stroke-width="12" stroke-linecap="round" opacity="0"/>${year ? text(0, -120, year, 64, "#3a3f63") : ""}<path d="M-130 0Q0 -30 130 0Z" fill="#2a4a3a"/>`;
// an hourglass, 240 tall, around (0, 0); `p` 0..1 how much sand has run down
export const hourglass = (p = 0, flip = 0) => { const top = 1 - clamp(p);
  return at(0, 0, `${two(rr(-90, -130, 180, 24, 8), P.wood, P.woodD, 0, 6)}${two(rr(-90, 106, 180, 24, 8), P.wood, P.woodD, 0, 6)}<path d="M-70 -106Q-70 -20 -8 0Q-70 20 -70 106H70Q70 20 8 0Q70 -20 70 -106Z" fill="#cfe9ff" opacity=".3" stroke="#cfe9ff" stroke-width="6"/>
    ${top > 0 ? `<path d="M${-60 * top} ${-10 - 80 * top}Q0 ${-14 - 86 * top} ${60 * top} ${-10 - 80 * top}L8 -4H-8Z" fill="${P.gold}"/>` : ""}${p > 0 && p < 1 ? `<path d="M0 0V${100 - 70 * p}" stroke="${P.gold}" stroke-width="5"/>` : ""}<path d="M-66 104Q0 ${104 - 90 * clamp(p)} 66 104Z" fill="${P.gold}"/>`, 1, 180 * flip); };
// a comet heading to the left: a bright head at (0, 0) and a tail to the right, `len` long
export const comet = (len = 520, tot = 0, k = 1) => at(0, 0, `<path d="M0 -40Q${len * 0.5} -70 ${len} -10L${len} 20Q${len * 0.5} 50 0 40Z" fill="#9fe7ff" opacity=".22"/><path d="M0 -24Q${len * 0.45} -40 ${len * 0.8} 0Q${len * 0.45} 30 0 24Z" fill="#cff6ff" opacity=".45"/>${Array.from({ length: 6 }, (_, i) => { const q = (tot * 0.8 + i / 6) % 1; return `<circle cx="${(60 + q * len * 0.8).toFixed(1)}" cy="${(Math.sin(i * 2.1) * 20 * q).toFixed(1)}" r="${(6 * (1 - q)).toFixed(1)}" fill="#fff"/>`; }).join("")}${rings(0, 0, 44, "#cff6ff", 0.3)}<circle r="26" fill="#fff"/>`, k);
// a garage, 760 wide, base on y = 0; `door` 0..1 how far the roller door is up; `inner` drawn in the opening (−300..300, −380..0)
export const garage = (door = 0, inner = "", o = {}) => `${two(rr(-380, -470, 760, 470, 8), o.c || "#5a69b3", o.cD || "#44529a", 16, 0)}${two("M-420 -460L0 -600L420 -460Z", "#3a1c71", P.ink, 0, 9)}<path d="${rr(-310, -390, 620, 390, 4)}" fill="#120a30"/>
  <clipPath id="gopen"><path d="${rr(-300, -380, 600, 380, 2)}"/></clipPath><g clip-path="url(#gopen)"><rect x="-300" y="-380" width="600" height="380" fill="${o.inside || "#2a1d5c"}"/><rect x="-300" y="-60" width="600" height="60" fill="#1f1450"/>${inner}
  ${door < 1 ? `<path d="${rr(-300, -380, 600, 380 * (1 - door), 0)}" fill="${P.steel}"/>${Array.from({ length: 9 }, (_, i) => -380 + (i + 1) * 42 < -380 + 380 * (1 - door) ? `<path d="M-300 ${-380 + (i + 1) * 42}H300" stroke="${P.steelD}" stroke-width="5"/>` : "").join("")}<path d="${rr(-40, -390 + 380 * (1 - door), 80, 14, 7)}" fill="${P.steelD}"/>` : ""}</g>`;
// the invisible dragon: only a dashed outline, `seen` 0..1 how much of it shows (0 = nothing at all)
export const dragonGhost = (seen = 1, tot = 0) => (seen <= 0 ? "" : `<g opacity="${clamp(seen).toFixed(3)}" fill="none" stroke="#b9a8ff" stroke-width="8" stroke-dasharray="22 18" stroke-linecap="round" stroke-dashoffset="${(-tot * 40).toFixed(1)}">
  <path d="M-200 -40Q-210 -150 -90 -170Q20 -180 70 -120Q100 -80 150 -100Q200 -120 190 -190Q230 -150 220 -90Q200 -30 120 -30Q60 -30 20 -60Q-40 -20 -200 -40Z"/><path d="M190 -190L170 -230L210 -210L215 -250L235 -200"/><path d="M-60 -170Q-80 -280 0 -300Q-10 -240 30 -180"/><path d="M-140 -40V0M-70 -40V0M10 -50V0M70 -40V0"/><path d="M-200 -40Q-280 -40 -300 -110"/></g>`);
// footprints walking along +x from (0, 0), `n` of them, `shown` how many are there
export const footprints = (n = 8, step = 70, shown = n, c = "#7a68b0") => Array.from({ length: Math.min(n, Math.floor(shown)) }, (_, i) => `<ellipse cx="${i * step}" cy="${i % 2 ? 12 : -12}" rx="20" ry="11" fill="${c}"/>`).join("");
// a fibre-optic cable plugging into a socket on the right: `gap` 0..1 how far the plug is out (1 = 60 units)
export const cablePlug = (gap = 0, tot = 0, glow = 1) => { const g = 60 * gap;
  return `<path d="M-700 40Q-400 40 -300 0H${-120 - g}" stroke="#ff9f43" stroke-width="28" fill="none" stroke-linecap="round"/><path d="M-700 40Q-400 40 -300 0H${-120 - g}" stroke="#ffd29a" stroke-width="8" fill="none" stroke-dasharray="20 30" stroke-dashoffset="${(-tot * 120).toFixed(1)}" opacity="${glow}"/>
    ${two(rr(-150 - g, -34, 90, 68, 10), P.steel, P.steelD, 0, 6)}<path d="${rr(-60 - g, -14, 60, 28, 4)}" fill="${P.gold}"/>${two(rr(0, -90, 220, 180, 14), "#2b5566", "#1c3c4a", 0, 10)}<circle cx="170" cy="-50" r="12" fill="${P.mint}"/><path d="${rr(0, -24, 40, 48, 4)}" fill="#061218"/>`; };
// a small grey box with an antenna and a dish (the GPS receiver), 220 wide, base on y = 0
export const gpsBox = (blink = 0) => `${two(rr(-110, -150, 220, 150, 14), P.steel, P.steelD, 0, 8)}<path d="${rr(-80, -120, 110, 60, 8)}" fill="#120a30"/><circle cx="60" cy="-90" r="14" fill="${blink > 0.5 ? P.green : "#1f5a4a"}"/><path d="M-60 -150V-230" stroke="${P.steelD}" stroke-width="10"/><path d="M-120 -250Q-60 -190 0 -250" fill="${P.steel}" stroke="${P.steelD}" stroke-width="6"/><circle cx="-60" cy="-232" r="10" fill="${P.red}"/>`;
// an apple
export const apple = () => `${disc(0, 0, 56, P.red, P.redD)}<path d="M0 -50Q4 -80 20 -90" stroke="${P.woodD}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M8 -70Q40 -96 60 -70Q30 -56 8 -70Z" fill="${P.green}"/>`;
// a microscope, 300 tall, standing on y = 0
export const microscope = () => `${two(rr(-130, -40, 260, 40, 10), P.steel, P.steelD, 0, 6)}<path d="M40 -40Q120 -140 40 -240" stroke="${P.steelD}" stroke-width="40" fill="none" stroke-linecap="round"/>${two(rr(-80, -150, 140, 24, 6), P.steel, P.steelD, 0, 4)}<g transform="rotate(-24 0 -220)">${two(rr(-30, -320, 60, 180, 14), "#f2f6ff", "#cdd6ef", 6, 0)}<path d="${rr(-38, -340, 76, 28, 8)}" fill="${P.ink}"/></g>`;
// a germ, radius r, colour c; `wob` makes it wriggle
export const germ = (r = 40, c = P.green, cD = P.greenD, wob = 0) => `${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4 + wob * 0.3; return `<path d="M${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}L${(Math.cos(a) * r * 1.4).toFixed(1)} ${(Math.sin(a) * r * 1.4).toFixed(1)}" stroke="${cD}" stroke-width="${r * 0.16}" stroke-linecap="round"/>`; }).join("")}${disc(0, 0, r, c, cD)}<circle cx="${-r * 0.3}" cy="${-r * 0.2}" r="${r * 0.18}" fill="#fff"/><circle cx="${r * 0.3}" cy="${-r * 0.2}" r="${r * 0.18}" fill="#fff"/><circle cx="${-r * 0.3}" cy="${-r * 0.18}" r="${r * 0.08}" fill="${P.ink}"/><circle cx="${r * 0.3}" cy="${-r * 0.18}" r="${r * 0.08}" fill="${P.ink}"/>`;
// a tap with a bar of soap and bubbles; `flow` 0..1 the water, `bub` 0.. the bubbles' time
export const tapSoap = (flow = 1, bub = 0) => `${two(rr(-300, -20, 600, 40, 10), "#f2f6ff", "#cdd6ef", 0, 8)}<path d="M-40 -260V-320H80Q120 -320 120 -280V-240" stroke="${P.steel}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="${rr(-60, -340, 40, 30, 8)}" fill="${P.red}"/>
  ${flow > 0 ? `<path d="M110 -230V-20" stroke="#9fd8ff" stroke-width="${(26 * flow).toFixed(1)}" stroke-linecap="round" opacity=".8"/>` : ""}${at(-170, -20, two(rr(-80, -60, 160, 60, 24), P.pink, P.pinkD, 0, 6))}
  ${bub > 0 ? Array.from({ length: 9 }, (_, i) => { const q = (bub * 0.4 + i / 9) % 1; return `<circle cx="${(-200 + i * 50 + 30 * Math.sin(bub + i)).toFixed(1)}" cy="${(-80 - q * 300).toFixed(1)}" r="${(14 + (i % 3) * 8).toFixed(1)}" fill="#e9f6ff" opacity="${(0.7 * (1 - q)).toFixed(2)}" stroke="#bfe6ff" stroke-width="3"/>`; }).join("") : ""}`;
// a doorway with a doormat and a newspaper, 260 wide, base on y = 0; `paper` 0..1 is there
export const door = (c, cD, paper = 1, open = 0) => `${two(rr(-150, -420, 300, 420, 8), "#3a2a7a", "#291d5c", 0, 0)}<path d="${rr(-110, -380, 220, 380, 6)}" fill="#120a30"/><g transform="translate(-110 0) scale(${(1 - 0.8 * open).toFixed(3)} 1) translate(110 0)">${two(rr(-110, -380, 220, 380, 6), c, cD, 10, 0)}<circle cx="70" cy="-190" r="12" fill="${P.gold}"/></g><path d="${rr(-130, -6, 260, 14, 6)}" fill="#7a4a2a"/>${paper > 0 ? `<g opacity="${clamp(paper)}">${two(rr(-60, -36, 120, 34, 6), P.cream, P.creamD, 0, 5)}<path d="M-40 -24h80M-40 -14h56" stroke="#a58f5e" stroke-width="5"/></g>` : ""}`;
// a little "?" thought cloud
export const thought = (mark = "?", k = 1) => at(0, 0, `<circle cx="-70" cy="110" r="14" fill="#f2f6ff"/><circle cx="-40" cy="70" r="22" fill="#f2f6ff"/>${two("M-90 0Q-120 -60 -60 -80Q-40 -130 20 -110Q80 -140 100 -80Q150 -60 120 0Q100 40 40 30Q0 60 -40 30Q-90 40 -90 0Z", "#f2f6ff", "#cdd6ef", 0, 8)}${text(10, 10, mark, 110, P.violetD)}`, k);
