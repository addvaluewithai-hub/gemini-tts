// "New appetite", electricity part 4 of 4: the data centres.
//   0 a line of pylons at night; on «مخازن الكمبيوترات» a data centre lands (a long building of server racks, blinking);
//     on «الذكاء الاصطناعي» a chip with a glowing network lights on its roof; on «سحبت» the cables from the pylons fill with
//     gold pulses flowing in; "2024" on «ألفين أربعة وعشرين»; then the planet's electricity as a pie and a thin gold slice
//     pulls out with "~1.5%" on «واحد ونص في المية»
//   1 an IEA report card with two bars: 2024 and 2030; the second grows to double on «يتضاعف» with "×2"; the 2030 label on
//     «ألفين وتلاتين»
//   2 one small planet: on its top left the data centre glowing and drinking gold pulses, on its top right a house with an
//     unlit bulb over it («وفيه ناس لسه ماشافتش لمبة»). Host left: the lower left stays clear.
import { clamp, lerp, ease, seg, spring, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./hungry.v.js";
import { P, E, mix, stars, house, pop, bulb, pylon, pylonTips, span, plate } from "./elec.js";
import { calPage } from "./props.js";

const tagBox = (t, size = 70, fill = P.gold) => { const w = String(t).length * size * 0.5 + size; return `${two(rr(-w / 2, -size * 0.75, w, size * 1.5, size * 0.75), P.ink, "#0d0826", 0, 6)}${text(0, size * 0.34, t, size, fill)}`; };
const NIGHT = (c, tot, seed = 47) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 110, -800, 2800, 1100, tot), c, 0.15);

// the data centre, base on y = 0, 760 wide: a long building with racks seen through its glass, fans on the roof;
// on 0..1 its lights blink; ai 0..1 lights the chip sign on its roof
export const chip = (ai, t = 0) => { const net = [[-34, -30], [0, -40], [34, -26], [-30, 10], [6, 4], [32, 30], [-10, 36]], L = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5], [3, 6], [4, 6]];
  const pins = [-45, -15, 15, 45].map((p) => `<path d="M${p} -70V-86M${p} 70V86M-70 ${p}H-86M70 ${p}H86" stroke="${P.steel}" stroke-width="10" stroke-linecap="round"/>`).join("");
  return `${ai > 0 ? rings(0, 0, 120, E.el, 0.22 * ai, 1.5) : ""}${pins}${two(rr(-72, -72, 144, 144, 18), "#24506a", "#163a50", 0, 8)}<path d="${rr(-56, -56, 112, 112, 12)}" fill="#0a2230"/>
    ${L.map(([i, j], k) => `<path d="M${net[i][0]} ${net[i][1]}L${net[j][0]} ${net[j][1]}" stroke="${mix("#1d4a5e", E.el, ai * (0.6 + 0.4 * Math.sin(t * 5 + k)))}" stroke-width="5"/>`).join("")}
    ${net.map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="8" fill="${mix("#2a5a70", k % 2 ? P.gold : E.el, ai)}"/>`).join("")}`; };
export const dataCentre = (on, t, ai = 0, o = {}) => { const W = 380, H = 300;
  const racks = Array.from({ length: 6 }, (_, k) => `<path d="${rr(-W + 40 + k * 120, -H + 60, 96, H - 90, 8)}" fill="#0a2230"/>` + Array.from({ length: 6 }, (_, r) => { const lit = on > 0 && Math.sin(t * 7 + k * 3 + r * 1.7) > -0.3;
    return `<path d="${rr(-W + 48 + k * 120, -H + 70 + r * 36, 80, 24, 4)}" fill="#123447"/><circle cx="${-W + 112 + k * 120}" cy="${-H + 82 + r * 36}" r="6" fill="${lit ? (r % 2 ? P.green : E.el) : "#1d4a5e"}"/>`; }).join("")).join("");
  const fans = [-260, -120, 120, 260].map((x) => at(x, -H - 6, `<path d="${rr(-50, -30, 100, 30, 6)}" fill="#1c4157"/>${at(0, -16, [0, 1, 2].map((i) => `<path d="M0 0L-10 -4L0 -36L10 -4Z" fill="#7fa3b6" transform="rotate(${t * 400 * (on > 0 ? 1 : 0.1) + i * 120}) scale(1 .45)"/>`).join(""))}`)).join("");
  return `${on > 0 ? rings(0, -H / 2, W * 1.1, E.el, 0.07 * on, 1.2) : ""}${fans}${two(rr(-W, -H, 2 * W, H, 18), "#2b5a74", "#1c4157", 14, 0)}${racks}${o.chip !== false ? at(0, -H - 120, chip(ai, t), 0.9) : ""}`; };
// gold pulses along a path given as points
const pulses = (pts, t, on, n = 5, speed = 0.6) => { if (on <= 0) return ""; const seg2 = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), L = seg2.reduce((x, y) => x + y, 0);
  const pos = (q) => { let d = q * L; for (let i = 0; i < seg2.length; i++) { if (d <= seg2[i]) { const f = d / seg2[i]; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg2[i]; } return pts[pts.length - 1]; };
  return Array.from({ length: n }, (_, k) => { const [x, y] = pos(((t * speed + k / n) % 1)); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="${P.gold}" opacity="${on.toFixed(2)}"/>`; }).join(""); };

// ---- 0: the data centre drinks; ~1.5% of the planet's electricity ----
function s0(a, tot) {
  const v = portrait(), G = v ? 1320 : 860;
  const DX = v ? 960 : 760, PX = v ? 960 : 1440, PY = v ? 520 : 540;
  const c = v ? camAt(a, [[0, 820, 1100, 1.0], [2.2, 900, 1150, 0.95], [6.6, 960, 1120, 0.9], [7.3, 960, 760, 0.82], [9.87, 960, 760, 0.84]])
    : camAt(a, [[0, 520, 600, 1.12], [2.2, 640, 580, 1.05], [6.5, 760, 560, 1.0], [7.3, 1000, 520, 0.98], [9.87, 1020, 520, 1.0]]);
  const land = pop(a - 2.37, 7, 13), on = seg(a, 2.6, 3.0), ai = seg(a, 4.15, 4.6), draw = seg(a, 5.33, 5.8);
  // the pylons on the left, cables into the building
  const PYL = v ? [[200, G], [520, G]] : [[-120, G], [200, G]], tip = pylonTips(420)[2];
  const pyl = PYL.map(([x, y]) => at(x, y, pylon(420))).join("") + span([PYL[0][0], G + tip[1]], [PYL[1][0], G + tip[1]], 24, "#9aa6d8", 6);
  const inlet = [DX - 380, G - 200];
  const cablePts = [[PYL[1][0], G + tip[1]], [lerp(PYL[1][0], inlet[0], 0.5), G + tip[1] + 90], inlet];
  const cable = `<path d="M${cablePts[0][0]} ${cablePts[0][1]}Q${cablePts[1][0]} ${cablePts[1][1] + 60} ${inlet[0]} ${inlet[1]}" fill="none" stroke="${mix("#9aa6d8", P.gold, draw)}" stroke-width="${8 + 8 * draw}"/>`;
  const flow = pulses([[PYL[0][0], G + tip[1]], ...cablePts], tot, draw, 7, 0.7);
  const dc = land > 0 ? at(DX, G, dataCentre(on, tot, ai), land) : "";
  const ground = `<rect x="-800" y="${G}" width="3600" height="900" fill="${P.ground}"/>`;
  const cal = a > 5.8 ? at(v ? 960 : 1180, v ? 520 : 200, calPage("2024", "", 0.6, 150), pop(a - 5.93) * (1 - seg(a, 6.7, 7.0))) : "";
  // the planet's electricity as a pie; the thin slice pulls out
  const pieOn = pop(a - 6.9, 7, 13), R = 270, sl = 0.015 * 360, out = ease(seg(a, 7.4, 8.0));
  const ang = (d) => (d - 90) * Math.PI / 180, arc = (a0, a1, r) => `M0 0L${(r * Math.cos(ang(a0))).toFixed(1)} ${(r * Math.sin(ang(a0))).toFixed(1)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${(r * Math.cos(ang(a1))).toFixed(1)} ${(r * Math.sin(ang(a1))).toFixed(1)}Z`;
  const pie = a > 6.85 ? at(PX, PY, `${disc(0, 0, R + 14, "#164a62", "#0f3a4f", 0.06)}<path d="${arc(sl, 360, R)}" fill="#2f8fb0"/>${[60, 150, 250].map((d) => `<path d="M0 0L${(R * Math.cos(ang(d))).toFixed(1)} ${(R * Math.sin(ang(d))).toFixed(1)}" stroke="#164a62" stroke-width="6"/>`).join("")}
      <path d="M-26 -60L30 -60L4 -4H40L-34 80L-10 12H-46Z" fill="#164a62" opacity=".7"/>
      ${at(Math.cos(ang(sl / 2)) * 70 * out, Math.sin(ang(sl / 2)) * 70 * out, `${out > 0 ? rings(0, -R * 0.6, 50, P.gold, 0.3 * out, 1.5) : ""}<path d="${arc(-1, sl + 1, R + 10)}" fill="${P.gold}"/>`)}
      ${a > 7.35 ? at(v ? 0 : 0, -R - 110, tagBox("~1.5%", 76), pop(a - 7.4)) : ""}`, pieOn) : "";
  const g = NIGHT(c, tot) + layer(ground + pyl + cable + flow + dc + cal + pie, c);
  return { g, out: toScreen(c, PX, PY), outC: P.cream, outZ: 10 };
}

// ---- 1: the IEA expects it to double by 2030 ----
function s1(a, tot) {
  const v = portrait();
  const c = v ? camAt(a, [[0, 960, 960, 1.0], [4.31, 960, 980, 1.08]]) : camAt(a, [[0, 960, 540, 0.95], [4.31, 960, 560, 1.05]]);
  const CX = 960, CY = v ? 960 : 560;
  const base = 200, h1 = 160, grow = spring(Math.max(0, a - 2.04), 6, 10) * (a > 2.04 ? 1 : 0), h2 = h1 * (1 + grow);
  const doc = `${two(rr(-360, -420, 720, 760, 30), P.cream, P.creamD, 12, 10)}<path d="M-360 -390a30 30 0 0 1 30 -30h660a30 30 0 0 1 30 30v80h-720Z" fill="#1f6d8c"/>${text(0, -330, "IEA", 76, "#fff")}
    ${[0, 1, 2].map((i) => `<path d="${rr(-290, -270 + i * 34, 300 - i * 70, 14, 7)}" fill="${P.creamD}"/>`).join("")}
    <path d="M-280 ${base}H280" stroke="${P.ink}" stroke-width="8" stroke-linecap="round"/>
    ${two(rr(-200, base - h1, 140, h1, 10), "#2f8fb0", "#1f6d8c", 0, 8)}${text(-130, base + 70, "2024", 56, P.ink)}
    ${two(rr(60, base - h2, 140, h2, 10), P.gold, P.goldD, 0, 8)}${a > 3.4 ? at(130, base + 70, text(0, 0, "2030", 56, P.ink), pop(a - 3.44)) : ""}
    ${a > 2.3 ? `<path d="M-60 ${base - h1 - 30}Q0 ${base - 2 * h1 - 80} 50 ${base - 2 * h1 - 30}" fill="none" stroke="${P.red}" stroke-width="10" stroke-linecap="round" stroke-dasharray="1 0"/>${at(-10, base - 2 * h1 - 110, tagBox("×2", 60, P.gold), pop(a - 2.3))}` : ""}`;
  const g = NIGHT(c, tot, 49) + layer(at(CX, CY, doc, pop(a + 0.3)), c);
  return { g, in: toScreen(c, CX, CY), inC: P.cream, inZ: 10 };
}

// ---- 2: one planet: computers drinking, a house with no bulb ----
function s2(a, tot) {
  const v = portrait(), GX = v ? 960 : 1080, GY = v ? 1260 : 980, R = v ? 420 : 470;
  const c = v ? camAt(a, [[0, 960, 960, 0.95], [5.4, 960, 980, 1.0]]) : camAt(a, [[0, 1060, 560, 0.98], [5.4, 1080, 580, 1.05]]);
  const pos = (deg, up = 0) => { const q = (deg - 90) * Math.PI / 180; return [GX + (R + up) * Math.cos(q), GY + (R + up) * Math.sin(q)]; };
  const id = "hplan";
  const planet = `${rings(GX, GY, R, E.el, 0.06, 1.12)}<clipPath id="${id}"><circle cx="${GX}" cy="${GY}" r="${R}"/></clipPath>${disc(GX, GY, R, "#1d5f8a", "#164a6a", 0.08)}<g clip-path="url(#${id})"><path d="M${GX - R} ${GY - 80}Q${GX - 200} ${GY - 260} ${GX - 40} ${GY - 160}Q${GX + 80} ${GY - 60} ${GX - 120} ${GY + 20}Z" fill="#1f8a7a"/><path d="M${GX + 120} ${GY - 120}Q${GX + 380} ${GY - 260} ${GX + R} ${GY - 40}V${GY + 100}Q${GX + 200} ${GY + 40} ${GX + 120} ${GY - 120}Z" fill="#1f8a7a"/></g>`;
  const glow = seg(a, 1.48, 1.9);
  const [dx, dy] = pos(-32), [hx, hy] = pos(34);
  const dc = at(dx, dy, dataCentre(1, tot, glow, { chip: true }), 0.55 * pop(a + 0.2), -32);
  const drink = pulses([[GX - 60, GY + 40], [GX - 120, GY - 140], [dx + 40, dy + 60]], tot, glow, 6, 0.9);
  const hs = at(hx, hy, `${house(E.houseB, E.houseBD, { roof: E.roof, lit: [false, false, false] })}${a > 3.45 ? at(0, -420, bulb(0, {}), 1.0 * pop(a - 3.49)) : ""}`, 0.75 * pop(a - 0.35), 34);
  const g = NIGHT(c, tot, 51) + layer(planet + drink + dc + hs, c);
  return { g };
}

const SHOTS = [s0, s1, s2];
export const hungrySet = makeSet(SHOTS, V, P);
