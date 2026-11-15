// "The sun" (electricity part 4 of 4): cheap solar, the duck curve, batteries moving noon to night, wind, prices below zero.
//   0 a solar farm under the sun; a price line from 2010 slides down: "−90%"; a gold "1" medal on «من أرخص»
//   1 one day across the frame: the demand line draws itself on «الطلب على مدار اليوم», then the sun's hump fills in under
//     it at noon on «الضهر»
//   2 what is left for the other stations: the hump is taken out of the demand, the line sinks at noon («واطي قوي الضهر»)
//     and climbs like a wall at sunset («زي الحيطة») as the houses light; on «منحنى البطة» the line itself becomes a duck:
//     the belly is the noon dip, the neck the sunset wall, the head the evening peak, the beak the fall after it, the axis
//     its water; it blinks and bobs on «فعلاً بطة»
//   3 a battery fills from the noon sun and empties after sunset; a gold arc carries noon into night and the neck comes
//     down (host left: the chart sits right and high, the lower left is kept clear)
//   4 wind turbines that spin when they like, a jagged wind line beside the smooth demand line; then the planet's power as
//     one bar: sun and wind "~17%" in 2025
//   5 noon, too much power and no store: the price marker slides past 0 to "−$"; coins fly from the grid to the house that
//     takes the power (host right: the lower right is kept clear)
// Each shot takes o.vert for the portrait layout (sun.v.js).
import { clamp, lerp, ease, easeOut, seg, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, FW, FH, makeSet } from "./kit.js";
import { V } from "./sun.v.js";
import { P, E, mix, stars, house, pop, plate, tagV, pylon, battery } from "./elec.js";
import { calPage, coin, globe } from "./props.js";
import { bump, RED } from "./balance.js";

const sky = (c, tot, seed = 71) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 2900, 900, tot), c, 0.12);
const daySky = (c, tot, k = 1) => `<rect width="${FW}" height="${FH}" fill="${mix("#041624", "#2f7fa3", k)}"/>` + layer(stars(73, 60, -900, 2900, 700, tot), c, 0.12).replace(/<g /, `<g opacity="${(1 - k).toFixed(2)}" `);
const SUN = "#ffd98a";
const noon = (c, tot) => `<rect width="${FW}" height="${FH}" fill="#3f8fb0"/>`;
const sunDisc = (r = 110, t = 0) => `${rings(0, 0, r * 1.3 * (1 + 0.03 * Math.sin(t * 3)), "#ffe7a0", 0.28, 1.5)}<circle r="${r}" fill="${SUN}"/>`;
// a solar panel on its stand, base on y = 0, 240 wide
export const panel = (glint = 0) => `<path d="M-10 0V-70M60 0V-110" stroke="${P.steelD}" stroke-width="12"/>${two("M-120 -60L-60 -170H140L80 -60Z", "#1f4fa0", "#163a7a", 0, 8)}
  <path d="M-100 -96H120M-80 -133H130M-50 -60L10 -170M20 -60L80 -170" stroke="#5f8fe0" stroke-width="5"/>${glint > 0 ? `<path d="M-60 -150L-20 -150L-60 -80Z" fill="#fff" opacity="${(0.35 * glint).toFixed(2)}"/>` : ""}`;
const farm = (n, x0, dx, G, k, t, rows = 2) => { let g = ""; for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) g += at(x0 + i * dx + (r % 2) * dx * 0.5, G + r * 110, panel(0.5 + 0.5 * Math.sin(t * 2 + i)), k * (1 - r * 0.08)); return g; };
// a wind turbine, base on y = 0, h tall; angle in radians
export const turbine = (h, ang) => `<path d="M-14 0L-6 ${-h}H6L14 0Z" fill="#dfe8f0"/>${[0, 1, 2].map((i) => `<path d="M0 ${-h}l-18 ${-h * 0.08}Q-4 ${-h * 0.56} 0 ${-h * 0.58}Q10 ${-h * 0.3} 14 ${-h * 0.06}Z" fill="#eef4f8" transform="rotate(${((ang * 180) / Math.PI + i * 120).toFixed(1)} 0 ${-h})"/>`).join("")}<circle cy="${-h}" r="${h * 0.04}" fill="#bcd2dc"/>`;

// ---- the day chart ----
const D = (h) => 0.42 + 0.12 * Math.exp(-((h - 8.5) ** 2) / 6) + 0.05 * Math.exp(-((h - 14) ** 2) / 12) + 0.38 * Math.exp(-((h - 19.5) ** 2) / 3.5) - 0.1 * Math.exp(-((h - 3.5) ** 2) / 5);
const S = (h) => 0.36 * Math.pow(Math.max(0, Math.sin(((h - 6) / 12) * Math.PI)), 1.3);
const B = (h) => 0.12 * Math.exp(-((h - 12.5) ** 2) / 6) - 0.26 * Math.exp(-((h - 19.6) ** 2) / 3);    // the battery: charge at noon, give at night
const net = (h, sun = 1, bat = 0) => D(h) - sun * S(h) + bat * B(h);
const pathOf = (f, X0, X1, YB, H, h0 = 0, h1 = 24, N = 96) => { let d = ""; for (let i = 0; i <= N; i++) { const h = lerp(h0, h1, i / N); d += (i ? "L" : "M") + lerp(X0, X1, h / 24).toFixed(1) + " " + (YB - H * f(h)).toFixed(1); } return d; };
const hx = (h, X0, X1) => lerp(X0, X1, h / 24);
const axis = (X0, X1, YB, k = 1) => `<path d="M${X0 - 30} ${YB}H${X1 + 30}" stroke="#2c5d73" stroke-width="8" opacity="${k.toFixed(2)}"/>` + [0, 6, 12, 18, 24].map((h) => `<path d="M${hx(h, X0, X1)} ${YB}v18" stroke="#2c5d73" stroke-width="6" opacity="${k.toFixed(2)}"/>`).join("");
// small sun and moon marks under the axis: dawn, noon, sunset
const marks = (X0, X1, YB, k = 1) => k <= 0 ? "" : at(hx(12.5, X0, X1), YB + 80, `<circle r="30" fill="${SUN}"/>`, k) + at(hx(0.8, X0, X1), YB + 80, `<circle r="26" fill="${P.cream}"/><circle cx="-10" cy="-8" r="24" fill="#082a3a"/>`, k) + at(hx(23.2, X0, X1), YB + 80, `<circle r="26" fill="${P.cream}"/><circle cx="-10" cy="-8" r="24" fill="#082a3a"/>`, k);
// the duck drawn from the net line: body (top = the line, bottom = a round belly under the water), head, eye, beak, wing, tail
const duck = (f, X0, X1, YB, H, k, t, blink = 0, bob = 0) => { if (k <= 0) return "";
  const P0 = [hx(0, X0, X1), YB - H * f(0)], Pn = [hx(17.6, X0, X1), YB - H * f(17.6)];
  const top = pathOf(f, X0, X1, YB, H, 0, 17.6, 70);
  const body = `${top}C${Pn[0] + 30} ${YB + H * 0.15} ${hx(10, X0, X1)} ${YB + H * 0.42} ${hx(4, X0, X1)} ${YB + H * 0.3}C${hx(1, X0, X1)} ${YB + H * 0.22} ${P0[0] - 40} ${YB + H * 0.05} ${P0[0]} ${P0[1]}Z`;
  const neck = pathOf((h) => f(h) - 0.05, X0, X1, YB, H, 16.6, 19.4, 24);
  const hc = [hx(19.4, X0, X1), YB - H * f(19.4) + 24], R = H * 0.11;
  const bk = [hx(20.2, X0, X1), YB - H * f(20.2)], bk2 = [hx(22.4, X0, X1), YB - H * f(22.4)];
  const beak = `M${bk[0] - 10} ${bk[1] - 12}L${bk2[0]} ${bk2[1]}L${bk[0] - 10} ${bk[1] + 30}Z`;
  const wing = `M${hx(6.5, X0, X1)} ${YB - H * 0.02}Q${hx(10, X0, X1)} ${YB - H * 0.2} ${hx(13.5, X0, X1)} ${YB + H * 0.02}Q${hx(10, X0, X1)} ${YB + H * 0.12} ${hx(6.5, X0, X1)} ${YB - H * 0.02}Z`;
  const tail = `M${P0[0] + 30} ${P0[1] + 10}L${P0[0] - 50} ${P0[1] - 60}L${P0[0] + 50} ${P0[1] - 20}Z`;
  const eyeH = 1 - blink;
  const inner = `<g opacity="${k.toFixed(2)}">${two(tail, P.gold, P.goldD, 0, 6)}${two(body, P.gold, P.goldD, 0, 12)}<path d="${neck}" fill="none" stroke="${P.gold}" stroke-width="${(H * 0.16).toFixed(1)}" stroke-linecap="round"/>${disc(hc[0], hc[1], R, P.gold, P.goldD, 0.08)}<path d="${wing}" fill="${P.goldD}"/>
    <path d="${beak}" fill="${E.houseB}"/><ellipse cx="${hc[0] + R * 0.2}" cy="${hc[1] - R * 0.25}" rx="${R * 0.28}" ry="${(R * 0.32 * eyeH + 2).toFixed(1)}" fill="#fff"/><ellipse cx="${hc[0] + R * 0.28}" cy="${hc[1] - R * 0.22}" rx="${R * 0.14}" ry="${(R * 0.16 * eyeH + 1).toFixed(1)}" fill="${P.ink}"/></g>`;
  return `<g transform="translate(0 ${bob.toFixed(1)})">${inner}</g>`; };
const water = (X0, X1, YB, H, t, k) => k <= 0 ? "" : (() => { let d = `M${X0 - 200} ${YB + 40}`; for (let x = X0 - 200; x <= X1 + 200; x += 40) d += `L${x} ${(YB + 40 + 10 * Math.sin(x * 0.03 + t * 3)).toFixed(1)}`; d += `L${X1 + 200} ${YB + H * 0.6}H${X0 - 200}Z`; return `<path d="${d}" fill="${E.waterD}" opacity="${(0.9 * k).toFixed(2)}"/>`; })();

// ---- 0: the sun got cheap ----
function s0(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 600, 1.0], [9, 960, 620, 1.0]] : [[0, 960, 560, 1.08], [9, 960, 540, 1.0]]);
  const G = v ? 1300 : 760;
  const sun = at(v ? 700 : 400, v ? 120 : 240, sunDisc(v ? 120 : 120, tot), pop(a - 0.1) * bump(a, 1.8, 0.08));
  const fm = v ? farm(5, 520, 220, G, 0.85, tot) : farm(6, 120, 340, G, 1.15, tot);
  // the price line: high in 2010, down to now
  const GX = v ? 960 : 1300, GY = v ? 520 : 330, GW = v ? 700 : 760, GH = v ? 440 : 420;
  const p = ease(seg(a, 3.8, 5.6));
  const gfx = a > 2.5 ? at(GX, GY, `${two(rr(-GW / 2 - 40, -GH / 2 - 40, GW + 80, GH + 80, 24), "#0f3a55", "#0a2a3c", 0, 8)}<path d="M${-GW / 2} ${GH / 2}H${GW / 2}" stroke="#2c5d73" stroke-width="6"/>
    ${drawn(`M${-GW / 2 + 20} ${-GH / 2 + 30}C${-GW / 6} ${-GH / 2 + 60} ${-GW / 10} ${GH / 4} ${GW / 2 - 20} ${GH / 2 - 50}`, Math.max(0.02, p), P.gold, 14)}
    ${disc(-GW / 2 + 20, -GH / 2 + 30, 20, P.gold, P.goldD)}${a > 5.9 ? text(-GW / 2 + 100, GH / 2 - 26, "2010", 54, P.cream) : ""}`, pop(a - 2.61)) : "";
  const tg = a > 4.6 ? at(GX + GW * 0.18, GY - GH * 0.05, tagV("−90%", "", { size: 90 }), pop(a - 4.8) * bump(a, 5.66, 0.06)) : "";
  const medal = a > 6.6 ? at(v ? 960 : 700, v ? G - 330 : 560, `<path d="M-50 -140L-80 -260H-20L0 -170L20 -260H80L50 -140Z" fill="${E.houseA}"/>${disc(0, -60, 90, P.gold, P.goldD)}<circle cy="-60" r="66" fill="none" stroke="${P.goldD}" stroke-width="8"/>${text(0, -26, "1", 100, "#8a5200")}`, 1.3 * pop(a - 6.74) * bump(a, 7.65, 0.08)) : "";
  const g = noon(c, tot) + layer(`<rect x="-1200" y="${G}" width="4400" height="1400" fill="#1f6a7a"/>` + sun + fm + gfx + tg + medal, c);
  return { g, out: toScreen(c, v ? 700 : 400, v ? 120 : 240), outC: SUN, outZ: 14 };
}

// chart placement: landscape full width; portrait narrower and lower
const L = (v) => v ? { X0: 460, X1: 1460, YB: 900, H: 640 } : { X0: 200, X1: 1720, YB: 820, H: 560 };

// ---- 1: demand across the day, then the sun's hump ----
function s1(a, tot, s, o = {}) {
  const v = !!o.vert, { X0, X1, YB, H } = L(v), c = camAt(a, v ? [[0, 960, 640, 1.0], [4.03, 960, 640, 1.0]] : [[0, 960, 520, 1.0], [4.03, 960, 520, 1.0]]);
  const dp = ease(seg(a, 0.6, 2.0)), sp = ease(seg(a, 2.32, 3.4));
  const dem = drawn(pathOf(D, X0, X1, YB, H), Math.max(0.01, dp), P.cream, 14, 'stroke-linejoin="round"');
  const hump = sp > 0 ? `<path d="${pathOf((h) => S(h) * sp, X0, X1, YB, H, 5.5, 18.5, 60)}Z" fill="${SUN}" opacity=".85"/>` : "";
  const sh = 12.5, sunY = YB - H * (0.36 * sp) - 160;
  const sun = sp > 0 ? at(hx(sh, X0, X1), sunY, sunDisc(70, tot), pop(a - 2.4)) : "";
  const g = sky(c, tot, 77) + layer(axis(X0, X1, YB) + marks(X0, X1, YB, pop(a - 0.2)) + hump + dem + sun, c);
  return { g, in: toScreen(c, 960, YB - H * 0.4), inC: "#082a3a" };
}

// ---- 2: what is left: the duck ----
function s2(a, tot, s, o = {}) {
  const v = !!o.vert, { X0, X1, YB, H } = L(v), c = camAt(a, v ? [[0, 960, 640, 1.0], [7.4, 960, 640, 1.0], [8.3, 1000, 600, 1.12], [10.08, 1000, 600, 1.14]] : [[0, 960, 520, 1.0], [7.4, 960, 520, 1.0], [8.3, 960, 540, 1.06], [10.08, 960, 540, 1.08]]);
  const take = ease(seg(a, 0.2, 1.9)), duckK = ease(seg(a, 7.6, 8.3));
  const f = (h) => net(h, take);
  const ghost = `<path d="${pathOf(D, X0, X1, YB, H)}" fill="none" stroke="${P.cream}" stroke-width="6" stroke-dasharray="14 16" opacity="${(0.45 * (1 - duckK)).toFixed(2)}"/>`;
  const hump = take < 1 ? `<path d="${pathOf((h) => S(h) * (1 - take), X0, X1, YB, H, 5.5, 18.5, 60)}Z" fill="${SUN}" opacity="${(0.85 * (1 - take)).toFixed(2)}"/>` : "";
  const line = `<path d="${pathOf(f, X0, X1, YB, H)}" fill="none" stroke="${mix(E.el, P.goldD, duckK)}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/>`;
  // the belly and the wall, pointed out
  const belly = a > 1.2 && a < 7.6 ? at(hx(13, X0, X1), YB - H * f(13) + 70, `<path d="M0 -30V40M-26 14L0 40L26 14" fill="none" stroke="${E.el}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - 1.36) * (1 - seg(a, 7.3, 7.6)), 180) : "";
  const wall = a > 2.6 && a < 7.6 ? at(hx(17.2, X0, X1) - 80, YB - H * 0.55, `<path d="M0 120V-120M-30 -90L0 -120L30 -90" fill="none" stroke="${E.houseB}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - 2.87) * (1 - seg(a, 7.3, 7.6))) : "";
  const lit = seg(a, 4.4, 6.0);
  const homesRow = a > 4.3 ? Array.from({ length: 4 }, (_, i) => at(hx(17.4 + i * 1.3, X0, X1), YB - 4, house(i % 2 ? E.houseB : E.houseA, i % 2 ? E.houseBD : E.houseAD, { roof: E.roof, lit: [lit > 0.2 + i * 0.15, lit > 0.3 + i * 0.15, lit > 0.25 + i * 0.15] }), 0.22 * pop(a - 4.4 - i * 0.08) * (1 - duckK))).join("") : "";
  const blink = a > 9.4 && a < 9.6 ? 1 : 0, bob = duckK > 0 ? 8 * Math.sin(tot * 2.4) + (a > 9.4 ? 16 * Math.exp(-(a - 9.4) * 4) * Math.sin((a - 9.4) * 14) : 0) : 0;
  const dk = duck(f, X0, X1, YB, H, duckK, tot, blink, bob);
  const wt = water(X0, X1, YB, H, tot, duckK);
  const g = sky(c, tot, 79) + layer(axis(X0, X1, YB, 1 - duckK) + marks(X0, X1, YB, 1 - duckK) + hump + ghost + homesRow + dk + (duckK < 1 ? `<g opacity="${(1 - duckK).toFixed(2)}">${line}</g>` : "") + wt + belly + wall, c);
  return { g, out: toScreen(c, hx(13, X0, X1), YB - H * f(13)), outC: "#082a3a", outZ: 10 };
}

// ---- 3: the battery moves noon to night (host left) ----
function s3(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 640, 1.0], [5.47, 960, 640, 1.0]] : [[0, 960, 540, 1.0], [5.47, 960, 540, 1.0]]);
  const { X0, X1, YB, H } = v ? { X0: 460, X1: 1460, YB: 760, H: 600 } : { X0: 580, X1: 1820, YB: 700, H: 560 };
  const shift = ease(seg(a, 3.04, 4.6)), fillB = ease(seg(a, 1.22, 2.6)) * (1 - ease(seg(a, 3.04, 4.2)));
  const f = (h) => net(h, 1, shift);
  const ghost = shift > 0 ? `<path d="${pathOf((h) => net(h, 1, 0), X0, X1, YB, H)}" fill="none" stroke="${E.el}" stroke-width="6" stroke-dasharray="14 16" opacity=".45"/>` : "";
  const line = `<path d="${pathOf(f, X0, X1, YB, H)}" fill="none" stroke="${E.el}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/>`;
  const hump = `<path d="${pathOf(S, X0, X1, YB, H, 5.5, 18.5, 60)}Z" fill="${SUN}" opacity=".35"/>`;
  const BXb = hx(12.5, X0, X1), BYb = v ? YB + 560 : YB + 350, LY = YB - H - 20;
  const bat = at(BXb, BYb, `${battery({})}<path d="${rr(-90, -220 * fillB - 10, 180, 220 * fillB, 18)}" fill="${P.green}" opacity=".9"/>`, (v ? 0.9 : 0.8) * pop(a - 0.3));
  const feed = a > 1.2 && a < 2.8 ? [0, 1, 2].map((i) => { const q = ((a - 1.2) * 1.2 + i / 3) % 1; return `<circle cx="${BXb + 6 * Math.sin(i + a * 5)}" cy="${lerp(YB - H * 0.2, BYb - 300, q).toFixed(1)}" r="16" fill="${SUN}"/>`; }).join("") : "";
  const ex = hx(19.6, X0, X1), arc = `M${BXb + 60} ${BYb - 260}Q${(BXb + ex) / 2} ${BYb - 560} ${ex} ${YB - H * net(19.6, 1, 1) + 40}`;
  const carry = a > 3.0 ? drawn(arc, seg(a, 3.04, 3.8), P.gold, 16) + (a > 3.8 ? at(ex, YB - H * net(19.6, 1, 1) + 40, `<path d="M-30 -10L0 30L30 -10" fill="none" stroke="${P.gold}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - 3.8)) : "") : "";
  const sm = a > 4.1 ? at((BXb + ex) / 2 - 140, LY, `<circle r="40" fill="${SUN}"/>`, pop(a - 4.18)) + at((BXb + ex) / 2 + 140, LY, `<circle r="40" fill="${P.cream}"/><circle cx="-14" cy="-10" r="36" fill="#082a3a"/>`, pop(a - 4.59)) + (a > 4.4 ? at((BXb + ex) / 2, LY, `<path d="M-60 0H50M30 -20L56 0L30 20" fill="none" stroke="${P.cream}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - 4.4)) : "") : "";
  const g = sky(c, tot, 81) + layer(axis(X0, X1, YB) + hump + ghost + line + feed + bat + carry + sm, c);
  return { g, in: toScreen(c, hx(13, X0, X1), YB - H * f(13)), inC: "#082a3a" };
}

// ---- 4: the wind does as it likes; sun and wind ~17% (2025) ----
function s4(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 420, 1.0], [2.8, 960, 420, 1.0], [3.5, 960, 700, 1.0], [7.62, 960, 720, 1.0]] : [[0, 960, 480, 1.0], [2.8, 960, 470, 1.04], [3.6, 960, 760, 1.0], [7.62, 960, 760, 1.02]]);
  const G = v ? 700 : 760;
  // each turbine has its own mood: speed that comes and goes
  const ang = (i) => { let x = 0; const n = Math.floor(tot * 10); for (let k = 0; k < n; k++) x += 0.1 * Math.max(0, Math.sin(k * 0.1 * (0.7 + i * 0.35) + i * 2) * 4 + (rnd(i * 31 + Math.floor(k / 8)) - 0.5) * 3); return x; };
  const tb = (v ? [[700, 0.9], [960, 0.75], [1220, 0.85]] : [[220, 0.95], [540, 0.8], [860, 0.9]]).map(([x, k], i) => at(x, G, turbine(400, ang(i)), k * pop(a - 0.1 - i * 0.1))).join("");
  // wind vs demand, small chart
  const CX = v ? 960 : 1360, CY = v ? -120 : 360, CW = v ? 760 : 820, CH = 300;
  let wd = ""; for (let i = 0; i <= 40; i++) { const x = -CW / 2 + 30 + i * (CW - 60) / 40, y = CH * 0.3 - (rnd(i * 7 + 3) * 0.9 + 0.2 * Math.sin(i * 0.5)) * CH * 0.55; wd += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }
  const dm = pathOf(D, -CW / 2 + 30, CW / 2 - 30, CH * 0.36, CH * 0.75);
  const chart = a > 0.9 ? at(CX, CY, `${two(rr(-CW / 2, -CH / 2 - 30, CW, CH + 60, 22), "#0f3a55", "#0a2a3c", 0, 8)}${drawn(dm, seg(a, 2.05, 2.6), P.cream, 10)}${drawn(wd, seg(a, 1.18, 1.9), E.el, 10, 'stroke-linejoin="round"')}`, pop(a - 1.0)) : "";
  // the planet's power as one bar
  const BY = v ? 1180 : 1200, BW = v ? 820 : 1300, BX = 960 + (v ? 60 : 80), share = 0.17 * ease(seg(a, 5.2, 6.0));
  const bar = a > 3.0 ? at(BX, BY, `${two(rr(-BW / 2, -60, BW, 120, 60), "#0f3a55", "#0a2a3c", 0, 8)}<path d="${rr(-BW / 2 + 10, -50, (BW - 20) * share * 0.5 + 0.01, 100, 50)}" fill="${SUN}"/><path d="${rr(-BW / 2 + 10 + (BW - 20) * share * 0.5, -50, (BW - 20) * share * 0.5 + 0.01, 100, 0)}" fill="${E.el}"/>
    ${at(-BW / 2 - 90, 0, globe(80, tot * 0.05, { id: "s4" }))}`, pop(a - 3.08)) : "";
  const tg = a > 5.4 ? at(BX - BW / 2 + (BW - 20) * 0.17 + 150, BY - 150, tagV("~17%", "", { size: 90 }), pop(a - 5.6)) : "";
  const cal = a > 4.0 ? at(v ? 1300 : 1500, BY - 230, calPage("2025", "", 0.7, 150), pop(a - 4.21)) : "";
  const g = sky(c, tot, 83) + layer(`<rect x="-1200" y="${G}" width="4400" height="160" fill="${P.ground}"/>` + tb + chart + bar + tg + cal, c);
  return { g };
}

// ---- 5: below zero (host right) ----
function s5(a, tot, s, o = {}) {
  const v = !!o.vert, c = camAt(a, v ? [[0, 960, 640, 1.0], [6.82, 960, 640, 1.0]] : [[0, 960, 540, 1.0], [6.82, 960, 540, 1.02]]);
  const G = v ? 1250 : 800;
  const sun = at(v ? 600 : 260, v ? 0 : 160, sunDisc(100, tot), pop(a - 0.1));
  const fm = v ? farm(3, 500, 200, G, 0.7, tot, 1) : farm(3, 140, 200, G, 0.8, tot, 1);
  const PXl = v ? 1100 : 760;
  const py = at(PXl, G, pylon(v ? 460 : 520), pop(a - 0.2));
  const HX = v ? 1380 : 1080, hs = at(HX, G, house(E.houseA, E.houseAD, { roof: E.roof }), v ? 0.55 : 0.6);
  // too much: gold dots heap at the pylon's foot
  const n = Math.round(12 * seg(a, 1.06, 2.9));
  const heap = Array.from({ length: n }, (_, i) => `<circle cx="${(PXl - 140 + (i % 6) * 56 + (Math.floor(i / 6) % 2) * 28).toFixed(1)}" cy="${(G - 26 - Math.floor(i / 6) * 48).toFixed(1)}" r="24" fill="${SUN}"/>`).join("");
  // the price scale
  const MX = v ? 960 : 1480, MT = v ? -260 : 120, MB = v ? 400 : 600, Z = lerp(MT, MB, 0.55);
  const pv = kf(a, [[0, 0.9], [2.8, 0.75], [4.13, 0.3], [4.69, -0.55], [6.82, -0.6]]);
  const MY = lerp(Z, MT + 40, clamp(pv)) * (pv >= 0 ? 1 : 0) + (pv < 0 ? lerp(Z, MB - 40, clamp(-pv / 0.6)) : 0);
  const neg = pv < 0;
  const scale = a > 0.3 ? at(0, 0, `${two(rr(MX - 40, MT, 80, MB - MT, 40), "#0f3a55", "#0a2a3c", 0, 8)}<path d="${rr(MX - 30, Z, 60, MB - Z - 10, 30)}" fill="${RED}" opacity=".35"/><path d="M${MX - 90} ${Z}H${MX + 90}" stroke="${P.cream}" stroke-width="10"/>${text(MX - 150, Z + 30, "0", 84, P.cream)}
    ${at(MX + 150, MY, `${two("M-50 0L0 -56H170V56H0Z", neg ? RED : P.cream, neg ? "#c43a45" : P.creamD, 0, 6)}${text(85, 26, neg ? "−$" : "$", 72, neg ? "#fff" : "#8a5200")}`, 1, 0)}`, pop(a - 0.4)) : "";
  const flyC = a > 5.4 ? [0, 1, 2, 3].map((i) => { const q = clamp((a - 5.55 - i * 0.25) / 0.7); if (q <= 0 || q >= 1) return ""; const x = lerp(PXl, HX, q), y = lerp(G - 450, G - 180, q) - Math.sin(Math.PI * q) * 220; return at(x, y, coin(34)); }).join("") : "";
  const got = a > 6.2 ? at(HX + 120, G - 300, coin(40) + at(30, -20, coin(40)), pop(a - 6.2)) : "";
  const g = noon(c, tot) + layer(`<rect x="-1200" y="${G}" width="4400" height="1400" fill="#1f6a7a"/>` + sun + fm + py + heap + hs + flyC + got + scale, c);
  return { g, in: toScreen(c, v ? 600 : 260, v ? 0 : 160), inC: SUN };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export { s0, s1, s2, s3, s4, s5 };
export const sunSet = makeSet(SHOTS, V, P);
