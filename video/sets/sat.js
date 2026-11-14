// "The towers went to space" (network part 1): four shots, nothing to read but a year and a speed.
//   0 a desert at night: a tower pops up out of the sand, then lifts off into the sky and folds into a satellite; a
//     calendar page 2025; the blue phone on a rock sends rings straight up to it and a link joins them
//   1 no dish: a satellite dish is crossed out; the camera tracks along one landscape, desert, sea (a small boat), a
//     mountain, and in each the little phone talks to the satellite passing overhead
//   2 pull back to the planet: the satellite races round it, a speed rolls to 27,000 km/h, the tiny phone on the planet
//     still links to it; a small flying saucer tries the same and fizzles ✗ (host left: everything right of x 420)
//   3 the planet with its dark patches (no coverage); a dashed handset (calls: still a test); more satellites arrive
//     and the dark patches shrink until none is left
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, play, frame, FW, FH, makeSet } from "./kit.js";
import { P, mix, fmt, stars } from "./bank.js";
import { calPage, globe } from "./props.js";
import { WAVE, pop, bluePhone, satellite, tower, radio } from "./net.js";

const V = [];
const dunes = (G, x0, x1, c1, c2) => { let d1 = `M${x0} ${G + 400}V${G}`, d2 = `M${x0} ${G + 400}V${G + 60}`; for (let x = x0; x <= x1; x += 80) { d1 += `L${x} ${(G - 50 - 40 * Math.sin(x / 260)).toFixed(1)}`; d2 += `L${x} ${(G + 40 - 30 * Math.sin(x / 190 + 1)).toFixed(1)}`; } return `<path d="${d1}V${G + 400}Z" fill="${c1}"/><path d="${d2}V${G + 400}Z" fill="${c2}"/>`; };
const rock = () => two("M-150 0L-120 -90L-40 -130L70 -120L140 -60L160 0Z", "#8a5a8c", "#6a3f6e", 10, 0);
const link = (a, b, p, o = 1) => (p <= 0 ? "" : drawn(`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`, p, WAVE, 10, `stroke-dasharray="1" opacity="${o}"`) + drawn(`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`, p, "#fff", 3, `opacity="${0.6 * o}"`));
const dish = () => `<path d="M0 0V-120" stroke="${P.steelD}" stroke-width="16"/>${two("M-150 -260Q0 -40 150 -260Z", "#e8ecff", "#aab4d4", 0, 10)}<path d="M0 -160L60 -250" stroke="${P.steelD}" stroke-width="8"/><circle cx="60" cy="-250" r="12" fill="${P.red}"/>`;
const boat = () => `${two("M-170 0L-130 60H130L170 0Z", P.red, P.redD, 0, 8)}<path d="M0 0V-200" stroke="${P.cream}" stroke-width="10"/>${two("M8 -190L120 -20H8Z", P.cream, P.creamD, 6, 0)}`;
const saucer = (w = 0) => `${two("M-110 0Q0 -60 110 0Q0 40 -110 0Z", "#b6f06a", "#7cc13a", 0, 6)}<path d="M-50 -24Q0 -110 50 -24Z" fill="#9fe7ff" opacity=".85"/>${[-70, 0, 70].map((x, i) => `<circle cx="${x}" cy="8" r="9" fill="${rnd(i + Math.floor(w * 6)) > 0.5 ? P.gold : "#4a6a2a"}"/>`).join("")}`;

// ---- 0: the tower lifts off and becomes a satellite ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.0], [1.7, 960, 600, 1.0], [2.4, 960, 420, 0.9], [3.8, 960, 430, 0.92], [6.55, 1000, 420, 0.96]]), G = 860;
  // the tower: up out of the sand on "towers", lifts off on "went to space" and folds into a satellite
  const up = easeOut(seg(a, 1.0, 1.4)), lift = easeIn(seg(a, 1.75, 2.35)), fold = ease(seg(a, 2.1, 2.5));
  const SAT = [1040, 140], ty = lerp(G + 560, G, up) - lift * (G - SAT[1] + 300);
  const tw = fold < 1 ? at(1040, ty, tower({ t: tot, lit: 1 }), 1.2 * (1 - 0.6 * fold), 0, `opacity="${(1 - fold).toFixed(2)}"`) : "";
  const flame = lift > 0 && fold < 1 ? `<path d="M${1040 - 40} ${ty}L1040 ${ty + 160 + 40 * Math.sin(tot * 30)}L${1040 + 40} ${ty}Z" fill="${P.gold}" opacity="${(1 - fold).toFixed(2)}"/>` : "";
  const drift = a > 2.5 ? (a - 2.5) * 30 : 0;
  const sat = fold > 0 ? at(SAT[0] - drift, SAT[1], (a > 2.5 ? rings(0, 0, 160, P.gold, 0.12) : "") + satellite(), 0.9 * fold * (fold >= 1 ? 1 : 1)) : "";
  const cal = at(400, 300, calPage("2025", "", 0.9, 120), pop(a - 2.52) * (1 - ease(seg(a, 3.7, 4.0))));
  // the phone on its rock: rings go up, the link draws itself
  const PH = [700, G - 120];
  const ph = at(PH[0], G - 110, bluePhone(), 0.9 * pop(a - 3.94));
  const up2 = seg(a, 4.77, 5.9), linkG = link([PH[0], PH[1] - 230], [SAT[0] - drift, SAT[1] + 50], up2);
  const ringsUp = a > 4.77 ? radio(PH[0], PH[1] - 230, tot, 260, { n: 3, arc: [-140, -40] }) : "";
  const moon = `<circle cx="1640" cy="150" r="60" fill="${P.cream}"/><circle cx="1615" cy="135" r="54" fill="${P.night0}"/>`;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(51, 110, -300, 2300, 800, tot) + moon, c, 0.2) + layer(dunes(G - 60, -600, 2600, "#4a2a6e", "#3a1f5e"), c, 0.6)
    + layer(dunes(G, -600, 2600, "#c47f5a", "#a8664a") + flame + tw + at(PH[0], G - 20, rock()) + ph + linkG + ringsUp + sat + cal, c);
  return { g, out: toScreen(c, SAT[0] - drift, SAT[1]), outC: P.night0, outZ: 14 };
}

// ---- 1: no dish; desert, sea, anywhere with sky ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [1.3, 960, 540, 1.0], [1.7, 1300, 540, 0.95], [2.1, 2400, 540, 0.95], [2.6, 2500, 540, 0.95], [3.0, 3700, 540, 0.95], [4.04, 3800, 540, 0.97]]), G = 860;
  // the satellite drifts along with the camera, high up
  const sx = c.x + 260, SY = 150;
  const dsh = at(960, G, dish(), 1.4 * pop(a - 0.0) * (1 - ease(seg(a, 1.3, 1.6))));
  const no = a > 0.31 ? at(960, G - 260, cross(0, 0, 110, P.red, a - 0.31), 1, 0, `opacity="${(1 - seg(a, 1.3, 1.6)).toFixed(2)}"`) : "";
  // three places: desert (x 1300), sea (x 2500), mountain (x 3800)
  const desert = dunes(G, 900, 1900, "#c47f5a", "#a8664a") + at(1300, G - 20, rock()) + at(1300, G - 110, bluePhone(), 0.8);
  const seaG = `<rect x="1900" y="${G - 40}" width="1300" height="600" fill="#1d4f9e"/>${[0, 1, 2].map((i) => `<path d="M${2000 + ((tot * 60 + i * 400) % 1100)} ${G + 20 + i * 50}q30 -18 60 0q30 18 60 0" stroke="#5fb6ff" stroke-width="7" fill="none" opacity=".6"/>`).join("")}`
    + at(2500, G - 40 + 8 * Math.sin(tot * 2), boat() + at(-90, 0, bluePhone(), 0.55), 1, 3 * Math.sin(tot * 1.6));
  const mountain = `${two(`M3200 ${G + 400}L3800 ${G - 520}L4400 ${G + 400}Z`, "#6a4fb0", "#4a3590", 30, 0)}<path d="M3700 ${G - 370}L3800 ${G - 520}L3900 ${G - 370}L3850 ${G - 400}L3800 ${G - 360}L3750 ${G - 400}Z" fill="${P.cream}"/>` + at(3800, G - 500, bluePhone(), 0.55);
  const spots = [[1300, G - 300, 1.54], [2450, G - 180, 2.26], [3800, G - 640, 2.86]];
  const links = spots.map(([x, y, t0]) => link([x, y], [sx, SY + 50], seg(a, t0, t0 + 0.35), 1 - seg(a, t0 + 0.55, t0 + 0.8))).join("");
  const ground = `<rect x="-600" y="${G}" width="5600" height="600" fill="#a8664a"/>`;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(53, 160, -300, 5000, 800, tot), c, 0.2) + layer(ground + desert + seaG + mountain + dsh + no + links + at(sx, SY, satellite(), 0.8), c);
  return { g, in: [960, 540], inC: P.night0, inZ: 14 };
}

// ---- 2: the planet; 27,000 km/h; the saucer cannot (host left) ----
const GL = [1150, 560], GR = 300;
function s2(a, tot) {
  const c = camAt(a, [[0, 1150, 440, 1.5], [1.6, 1150, 500, 1.0], [8.27, 1150, 520, 1.03]]);
  // the satellite on its orbit (an ellipse), faster once the speed is said
  const spAt = (t) => (t < 2.42 ? t * 0.08 : 2.42 * 0.08 + (t - 2.42) * 0.16), sp = spAt(a), an = -Math.PI / 2 + sp * 2 * Math.PI, ox = GL[0] + Math.cos(an) * 420, oy = GL[1] + Math.sin(an) * 330;
  const orbit = `<ellipse cx="${GL[0]}" cy="${GL[1]}" rx="420" ry="330" fill="none" stroke="#5fb6ff" stroke-width="5" stroke-dasharray="14 18" opacity=".5"/>`;
  const trail = a > 2.42 ? [1, 2, 3, 4].map((q) => { const b = an - q * 0.12; return `<circle cx="${GL[0] + Math.cos(b) * 420}" cy="${GL[1] + Math.sin(b) * 330}" r="${16 - q * 3}" fill="${P.gold}" opacity="${(0.5 - q * 0.1).toFixed(2)}"/>`; }).join("") : "";
  const sat = at(ox, oy, satellite(), 0.42);
  // the height: a small double arrow from the planet's rim to the orbit on "hundreds of kilometres"
  const hA = seg(a, 0.64, 1.0) * (1 - seg(a, 2.2, 2.5)), hgt = hA > 0 ? `<path d="M${GL[0]} ${GL[1] - GR - 10}V${GL[1] - 320}" stroke="${P.cream}" stroke-width="6" opacity="${hA}"/><path d="M${GL[0] - 16} ${GL[1] - GR - 26}l16 16l16 -16M${GL[0] - 16} ${GL[1] - 304}l16 -16l16 16" stroke="${P.cream}" stroke-width="6" fill="none" opacity="${hA}"/>` : "";
  // the speed rolls up
  const v = lerp(0, 27000, ease(seg(a, 2.42, 4.64))), speed = a > 2.42 ? at(1530, 160, `${rings(-40, -40, 90, P.gold, 0.12)}${number(-40, 0, fmt(v), 96, P.gold)}${text(-40, 60, "km/h", 48, P.cream)}`, pop(a - 2.42)) : "";
  // the tiny phone on the planet links to the satellite
  const pa = -Math.PI / 2 + spAt(6.0) * 2 * Math.PI, PP = [GL[0] + Math.cos(pa) * (GR - 10), GL[1] + Math.sin(pa) * (GR - 10)], ph = at(PP[0], PP[1], bluePhone(), 0.4 * pop(a - 5.18), pa * 180 / Math.PI + 90);
  const tip = [PP[0] + Math.cos(pa) * 90, PP[1] + Math.sin(pa) * 90], lk = a > 5.18 ? link(tip, [ox, oy], seg(a, 5.4, 5.8), 1 - seg(a, 6.5, 6.8)) : "";
  // the saucer tries: a weak ring, a spark, ✗
  const sIn = easeOut(seg(a, 6.3, 6.8)), SX = lerp(2200, 1650, sIn), SY = 820 + 10 * Math.sin(tot * 3);
  const fizz = a > 7.15 ? radio(SX, SY - 40, tot, 70, { n: 2, c: "#b6f06a", k: 1 - seg(a, 7.5, 7.9) }) : "";
  const sc = a > 6.3 ? at(SX, SY, saucer(tot), 1.1, 6 * Math.sin(tot * 2)) + fizz + (a > 7.42 ? at(SX + 10, SY - 150, cross(0, 0, 50, P.red, a - 7.42)) : "") : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(55, 140, -300, 2300, 1080, tot), c, 0.2) + layer(orbit + at(GL[0], GL[1], globe(GR, tot * 0.02, { id: "st" })) + hgt + ph + lk + trail + sat + speed + sc, c);
  return { g };
}

// ---- 3: no place left outside coverage ----
function s3(a, tot) {
  const c = camAt(a, [[0, 1150, 520, 1.03], [4.59, 960, 540, 1.1]]), G0 = [960, 560], R = 330;
  // dark patches on the planet (no coverage) shrink as satellites arrive
  const shrink = ease(seg(a, 2.4, 4.1));
  const patches = [[-0.5, -0.2, 0.32], [0.35, 0.3, 0.28], [0.1, -0.55, 0.22], [-0.2, 0.55, 0.2], [0.6, -0.25, 0.18]].map(([x, y, r], i) => `<circle cx="${G0[0] + x * R}" cy="${G0[1] + y * R}" r="${(r * R * (1 - shrink) * (1 + 0.04 * Math.sin(tot * 2 + i))).toFixed(1)}" fill="${P.ink}" opacity=".72"/>`).join("");
  const cover = shrink > 0 ? `<circle cx="${G0[0]}" cy="${G0[1]}" r="${R * 1.06}" fill="none" stroke="${WAVE}" stroke-width="${(14 * shrink).toFixed(1)}" opacity=".5"/>` : "";
  const N = 10; let sats = "";
  for (let i = 0; i < N; i++) { const arrive = seg(a, 1.3 + i * 0.12, 1.8 + i * 0.12); if (arrive <= 0) continue; const an = i * 2 * Math.PI / N + tot * 0.25, rr_ = lerp(900, 470, easeOut(arrive));
    sats += at(G0[0] + Math.cos(an) * rr_, G0[1] + Math.sin(an) * rr_ * 0.85, satellite(), 0.24); }
  // calls: a dashed handset, still a test
  const hs = 1 - seg(a, 1.6, 1.9), handset = a < 1.9 ? at(G0[0], G0[1], `${disc(0, 0, 120, P.cream, P.creamD)}<circle r="138" fill="none" stroke="${P.gold}" stroke-width="10" stroke-dasharray="22 16" transform="rotate(${(tot * 40).toFixed(1)})"/><path d="M-60 -40Q-70 -70 -40 -76L-20 -40Q-30 -20 -10 10Q10 40 30 30L60 50Q60 80 30 80Q-60 60 -60 -40Z" fill="${P.ink}"/>`, pop(a) * hs) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(57, 140, -300, 2300, 1080, tot), c, 0.2) + layer(at(G0[0], G0[1], globe(R, tot * 0.02, { id: "s3", night: 0 })) + patches + cover + sats + handset, c);
  return { g, in: toScreen(c, G0[0], G0[1]), inC: "#1d6fb8", inZ: 14 };
}

const SHOTS = [s0, s1, s2, s3];
// in a Short (cfg.vertical): portrait versions to come (V is empty, so landscape shots are reframed)
export const satSet = makeSet(SHOTS, V, P);
