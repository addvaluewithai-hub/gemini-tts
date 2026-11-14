// "Satoshi vanished": five shots, one per beat. Satoshi is never a person: an empty chair with a hooded coat on it.
//   0 the chair at its laptop, 2011: a last envelope leaves the screen and goes out of the window into the night
//   1 the lid shuts and the door behind the desk opens on light (moved on)       2 the coat drops flat, the chair spins: gone
//   3 (in through the empty chair's colour) the code goes down the table to three other laptops; an empty podium under spotlights; an empty photo frame
//   4 a glass vault of coins, about a million; the years go by, cobwebs and dust grow, and the coins never move
// Shots 0–2 are one room on one clock (the beats run straight on), so they hand over by continuing, not through a shape.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, play, frame } from "./kit.js";
import { P, mix, coin, stars } from "./bank.js";
import { calPage, calFlip, laptop, hoodChair } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const GLOW = "#9fe7ff", LIGHT = "#fff3c2";
const envelope = (k = 1) => at(0, 0, `${two(rr(-70, -46, 140, 92, 10), P.cream, P.creamD, 0, 7)}<path d="M-66 -40L0 10L66 -40" fill="none" stroke="${P.creamD}" stroke-width="7" stroke-linejoin="round"/>${disc(0, 6, 15, P.red, P.redD)}`, k);

// ---- the room of shots 0–2, on one clock T (seconds since shot 0 began) ----
const DK = [1180, 700], CH = [820, 990];
function room(T, c, tot, s) {
  const E = s.ends || [], T1 = E[0] || 4.2, T2 = T1 + (E[1] || 1.49);
  // the last envelope: out of the screen, across the room, through the window into the night
  const ea = T - 2.64, eb = bez([DK[0], DK[1] - 165], [760, 120], [300, 300], ease(seg(ea, 0.15, 1.0))), env = ea > 0 && ea < 1.15 ? at(eb[0], eb[1], envelope(), (ea < 0.15 ? pop(ea) : 1) * lerp(1.1, 0.35, easeIn(seg(ea, 0.6, 1.1))), -10 * Math.sin(ea * 5)) : "";
  const twinkle = ea > 1.0 ? rings(300, 300, 50 * spring(ea - 1.0, 7, 11), P.cream, 0.3 * (1 - seg(ea, 1.4, 2.0))) : "";
  // the lid shuts; the door opens; the coat drops and the chair turns round
  const lid = T < T1 + 0.15 ? 1 : kf(T, [[T1 + 0.15, 1], [T1 + 0.5, -0.04], [T1 + 0.6, 0.02], [T1 + 0.68, 0]]), dOpen = ease(seg(T, T1 + 0.55, T1 + 1.0)), arrow = seg(T, T1 + 0.85, T1 + 1.25);
  const coat = T < T2 + 0.12 ? 1 : 1 - easeIn(seg(T, T2 + 0.12, T2 + 0.32)), puff = T > T2 + 0.28 ? T - T2 - 0.28 : -1, spin = T < T2 + 0.28 ? 0 : Math.PI * 2 * easeOut(seg(T, T2 + 0.28, T2 + 0.71));
  const screen = `${disc(0, -112, 40, "#ffffff", "#d6f4ff", 0.1)}<path d="M-14 -112h28M2 -126l14 14l-14 14" stroke="${P.blueD}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const wall = `<rect x="-600" y="-400" width="3200" height="1200" fill="#4a2b8a"/><rect x="-600" y="800" width="3200" height="700" fill="#3f2479"/><rect x="-600" y="792" width="3200" height="12" fill="#5c39a6"/>
    <path d="${rr(130, 160, 340, 300, 14)}" fill="${P.ink}"/><path d="${rr(150, 180, 300, 260, 8)}" fill="${P.night0}"/>${stars(91, 12, 160, 440, 430, tot)}<circle cx="400" cy="230" r="26" fill="${P.cream}"/><circle cx="390" cy="222" r="24" fill="${P.night0}"/><path d="M300 170V450M140 310H460" stroke="${P.ink}" stroke-width="12"/>`;
  const door = `<path d="${rr(1540, 300, 260, 500, 8)}" fill="${P.ink}"/>${dOpen > 0 ? `<path d="${rr(1556, 316, 228, 484, 4)}" fill="${LIGHT}"/><path d="M1556 800L1784 800L${1784 + 400 * dOpen} 1100L${1556 - 120 * dOpen} 1100Z" fill="${LIGHT}" opacity="${(0.35 * dOpen).toFixed(2)}"/>` : ""}
    <g transform="translate(1556 0) scale(${(1 - 0.92 * dOpen).toFixed(3)} 1) translate(-1556 0)">${two(rr(1556, 316, 228, 484, 4), "#7a55c9", "#5b3aa6", 0, 0)}<path d="${rr(1586, 350, 168, 170, 6)}" fill="#5b3aa6"/><path d="${rr(1586, 560, 168, 200, 6)}" fill="#5b3aa6"/><circle cx="1752" cy="580" r="12" fill="${P.gold}"/></g>
    ${arrow > 0 ? drawn("M1180 900H1600M1540 860L1600 900L1540 940", arrow, P.gold, 16, 'stroke-linejoin="round"') : ""}`;
  const cal = at(1340, 250, calPage(T > 1.32 ? "2011" : "2010", "", 0.8, 150) + calFlip("2010", "", seg(T, 1.32, 1.6), 150));
  const desk = `${two(rr(700, DK[1], 900, 34, 10), P.wood, P.woodD, 0, 8)}<rect x="740" y="${DK[1] + 34}" width="30" height="${800 - DK[1] - 34 + 120}" fill="${P.woodD}"/><rect x="1530" y="${DK[1] + 34}" width="30" height="${800 - DK[1] - 34 + 120}" fill="${P.woodD}"/>
    ${at(1430, DK[1], `<path d="M-30 0h60l-10 -70h-40Z" fill="${P.cream}"/><path d="M30 -54q26 0 22 22q-4 18 -24 14" stroke="${P.cream}" stroke-width="9" fill="none"/>${[0, 1].map((i) => `<path d="M${-8 + i * 16} ${-86 - 20 * ((tot * 0.6 + i * 0.5) % 1)}q8 -10 0 -20" stroke="#fff" stroke-width="5" fill="none" opacity="${(0.5 * (1 - ((tot * 0.6 + i * 0.5) % 1))).toFixed(2)}"/>`).join("")}`)}
    ${lid > 0.5 ? `<path d="M${DK[0] - 200} ${DK[1]}L${DK[0] - 420} ${DK[1] + 300}H${DK[0] + 420}L${DK[0] + 200} ${DK[1]}Z" fill="${GLOW}" opacity=".07"/>` : ""}${at(DK[0], DK[1], laptop(GLOW, ea > 0 && ea < 2 ? screen : "", Math.max(0.001, lid)), 1.5)}`;
  const dust = puff >= 0 && puff < 0.6 ? [0, 1, 2, 3, 4].map((i) => { const ang = -Math.PI * (0.1 + 0.2 * i), d = 140 * easeOut(puff / 0.5); return `<circle cx="${(CH[0] + Math.cos(ang) * d * 1.6).toFixed(1)}" cy="${(CH[1] - 260 + Math.sin(ang) * d * 0.6).toFixed(1)}" r="${(36 * (1 - puff / 0.6)).toFixed(1)}" fill="#cfc6ff" opacity=".5"/>`; }).join("") : "";
  const g = layer(wall + door + cal + desk + at(CH[0], CH[1], hoodChair({ coat, spin }), 1.45) + dust + env + twinkle, c);
  return g;
}
function s0(a, tot, s) { const c = camAt(a, [[0, 1000, 630, 0.9], [2.5, 1005, 628, 0.92], [4.2, 1010, 625, 0.94]]); return { g: room(a, c, tot, s), out: toScreen(c, DK[0], DK[1] - 165), outC: GLOW, outZ: 22 }; }
function s1(a, tot, s) { const c = camAt(a, [[0, 1010, 625, 0.94], [1.49, 1090, 620, 0.98]]); return { g: room((s.ends || [])[0] + a || 4.2 + a, c, tot, s), in: toScreen(c, DK[0], DK[1] - 165), inC: GLOW, inZ: 22 }; }
function s2(a, tot, s) { const E = s.ends || [], c = camAt(a, [[0, 1090, 620, 0.98], [0.2, 1000, 640, 0.97], [0.71, 990, 640, 1.0]]); return { g: room((E[0] || 4.2) + (E[1] || 1.49) + a, c, tot, s), out: toScreen(c, CH[0], CH[1] - 300), outC: "#4b3d8f", outZ: 18 }; }

// ---- 3: the code goes to other laptops; no farewell, no press conference, not even a photo ----
function s3(a, tot) {
  const c = camAt(a, [[0, 1440, 598, 0.91], [2.05, 1450, 598, 0.92], [2.7, 3300, 600, 1.1], [3.8, 3320, 600, 1.12], [4.35, 4200, 520, 1.25], [4.97, 4210, 520, 1.3]]), TY = 720;
  const wall = `<rect x="-600" y="-400" width="5600" height="1200" fill="#3b1d74"/><rect x="-600" y="800" width="5600" height="700" fill="#2c1a66"/><rect x="-600" y="792" width="5600" height="12" fill="#4a2b8a"/>`;
  const table = `${two(rr(760, TY, 1800, 30, 10), P.wood, P.woodD, 0, 8)}<rect x="800" y="${TY + 30}" width="26" height="120" fill="${P.woodD}"/><rect x="2500" y="${TY + 30}" width="26" height="120" fill="${P.woodD}"/>`;
  const L = [[1440, 1.6], [1810, 1.8], [2180, 2.0]];
  const lap = L.map(([x, t0]) => { const on = a > t0 ? spring(a - t0, 8, 13) : 0; return (on > 0 ? rings(x, TY - 150, 120 * on, P.teal, 0.12) : "") + at(x, TY, laptop(mix("#2a3a6a", "#9ff0e4", clamp(on)), on > 0.5 ? `<path d="M-60 -112h120M-60 -88h80M-60 -136h90" stroke="${P.tealD}" stroke-width="10" stroke-linecap="round"/>` : ""), 1.05); }).join("");
  // the code: a glowing box with braces, from the hooded chair's laptop down the table
  const go = ease(seg(a, 0.47, 1.5)), bx = lerp(1040, 1440, go), boxK = 1 + 0.12 * Math.sin(Math.PI * go);
  const lines = L.map(([x, t0], i) => (a > t0 - 0.2 && i > 0 ? drawn(`M1440 ${TY - 290}Q${(1440 + x) / 2} ${TY - 400} ${x} ${TY - 290}`, seg(a, t0 - 0.2, t0), P.gold, 6, 'stroke-dasharray="4 14"') : "")).join("");
  const box = at(bx, TY - 290 - 20 * Math.sin(Math.PI * go) + 6 * Math.sin(tot * 3), `${rings(0, 0, 90, P.gold, 0.25)}${two(rr(-80, -60, 160, 120, 18), P.gold, P.goldD, 0, 9)}${text(0, 28, "{ }", 80, "#8a5200")}`, 1.3 * boxK * pop(a + 0.3));
  // an empty podium: the spotlights come on and there is no one
  const lit = a > 2.97 ? spring(a - 2.97, 7, 11) : 0, PX = 3300, PY = 960;
  const podium = `${lit > 0 ? [-1, 1].map((d) => `<path d="M${PX + d * 520} -100L${PX + d * 120 - 200} ${PY}H${PX + d * 120 + 200}Z" fill="${LIGHT}" opacity="${(0.14 * clamp(lit)).toFixed(3)}"/>`).join("") + `<ellipse cx="${PX}" cy="${PY}" rx="${(320 * clamp(lit)).toFixed(1)}" ry="40" fill="${LIGHT}" opacity=".18"/>` : ""}
    ${[-70, 0, 70].map((d, i) => `<path d="M${PX + d * 0.6} ${PY - 420}L${PX + d} ${PY - 560}" stroke="${P.ink}" stroke-width="10"/>${two(rr(PX + d - 18, PY - 610, 36, 60, 18), "#5d678f", "#44507a", 4, 0)}`).join("")}
    ${two(`M${PX - 200} ${PY}L${PX - 160} ${PY - 420}H${PX + 160}L${PX + 200} ${PY}Z`, P.wood, P.woodD, 14, 0)}<path d="${rr(PX - 190, PY - 440, 380, 34, 8)}" fill="${P.woodD}"/>${disc(PX, PY - 260, 56, P.gold, P.goldD)}
    ${[0, 1, 2].map((i) => `<rect x="${PX - 600 + i * 70}" y="${PY - 120}" width="40" height="120" rx="8" fill="#2a1d5c"/><path d="${rr(PX - 614 + i * 70, PY - 150, 68, 40, 10)}" fill="#3a2a7a"/>`).join("")}${[0, 1, 2].map((i) => `<rect x="${PX + 420 + i * 70}" y="${PY - 120}" width="40" height="120" rx="8" fill="#2a1d5c"/><path d="${rr(PX + 406 + i * 70, PY - 150, 68, 40, 10)}" fill="#3a2a7a"/>`).join("")}`;
  // not even a photo: an empty frame on the wall
  const FX = 4200, FY = 470, q = a - 4.2;
  const pic = `${two(rr(FX - 210, FY - 260, 420, 520, 18), P.gold, P.goldD, 10, 10)}<path d="${rr(FX - 170, FY - 220, 340, 440, 8)}" fill="${P.ink}"/><path d="M${FX} ${FY - 330}L${FX - 120} ${FY - 260}M${FX} ${FY - 330}L${FX + 120} ${FY - 260}" stroke="${P.ink}" stroke-width="6"/><circle cx="${FX}" cy="${FY - 334}" r="10" fill="${P.gold}"/>
    ${q > 0 ? at(FX, FY + 70, text(0, 0, "?", 260, P.cream), pop(q)) : ""}`;
  const lapA = at(1040, TY, laptop(GLOW), 1.25);
  const g = layer(wall + pic + podium + table + lapA + lap + lines + box, c);
  return { g, in: toScreen(c, 1040, TY - 290), inC: "#4b3d8f", inZ: 18, out: toScreen(c, FX, FY), outC: P.ink, outZ: 18 };
}

// ---- 4: about a million coins, untouched year after year ----
function s4(a, tot) {
  const c = camAt(a, [[0, 920, 600, 1.18], [5.96, 940, 560, 1.0]]), VX = 860, VY = 760, W = 1060, H = 600;
  let pile = "";
  const rows = [13, 12, 11, 10, 9, 7, 5, 3];
  rows.forEach((n, r) => { for (let i = 0; i < n; i++) pile += at(VX + (i - (n - 1) / 2) * 74 + (r % 2) * 6, VY - 40 - r * 56, coin(40)); });
  const dust = seg(a, 3.3, 5.9), years = Math.round(kf(a, [[3.23, 2011], [5.3, 2026]], (p) => p)), flipP = a > 3.23 && a < 5.4 ? ((a - 3.23) / (2.07 / 15)) % 1 : 1;
  const web = (x, y, sx, sy, p) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" opacity=".85">${[[200, 20], [170, 110], [90, 180], [16, 200]].map((e, i) => drawn(`M0 0L${e[0]} ${e[1]}`, p * 2 - i * 0.15, "#cfc6ff", 4)).join("")}${[60, 120, 180].map((r, i) => drawn(`M${r} ${r * 0.1}Q${r * 0.66} ${r * 0.62} ${r * 0.08} ${r}`, p * 2 - 0.4 - i * 0.2, "#cfc6ff", 4)).join("")}</g>`;
  const sweep = `<clipPath id="vglass"><path d="${rr(VX - W / 2, VY - H, W, H, 20)}"/></clipPath><g clip-path="url(#vglass)"><path d="M${VX - W / 2 - 300 + ((tot * 260) % (W + 900))} ${VY - H}l120 0l-260 ${H}l-120 0Z" fill="#fff" opacity="${(0.12 * (1 - dust)).toFixed(3)}"/></g>`;
  const vault = `${rings(VX, VY - 300, 520, P.gold, 0.1 * (1 - 0.6 * dust), 1.25)}<path d="${rr(VX - W / 2, VY - H, W, H, 20)}" fill="${P.ink}"/>${pile}<path d="${rr(VX - W / 2, VY - 120, W, 120, 0)}" fill="#8a86a8" opacity="${(0.5 * dust).toFixed(2)}" transform="translate(0 0)"/>
    ${Array.from({ length: 40 }, (_, i) => `<circle cx="${(VX - W / 2 + 30 + rnd(i * 7) * (W - 60)).toFixed(0)}" cy="${(VY - 60 - rnd(i * 7 + 1) * 420).toFixed(0)}" r="${(4 + rnd(i * 7 + 2) * 5).toFixed(1)}" fill="#b8b4c8" opacity="${(0.8 * clamp(dust * 2 - rnd(i * 7 + 3))).toFixed(2)}"/>`).join("")}
    <path d="${rr(VX - W / 2, VY - H, W, H, 20)}" fill="#cfe9ff" opacity=".1" stroke="#cfe9ff" stroke-width="10"/>${sweep}${web(VX - W / 2 + 6, VY - H + 6, 1.1, 1.1, seg(a, 3.5, 5.0))}${web(VX + W / 2 - 6, VY - H + 6, -1.3, 1.3, seg(a, 4.0, 5.6))}
    ${two(rr(VX - W / 2 - 40, VY, W + 80, 60, 10), "#5d678f", "#44507a", 0, 10)}`;
  const plaque = at(VX, VY + 135, `${two(rr(-330, -70, 660, 140, 24), P.gold, P.goldD, 0, 10)}${text(0, 36, "≈ 1,000,000", 92, "#8a5200")}`, pop(a - 0.76));
  const cal = at(1600, 290, calPage(String(years), "", 1, 150) + (a > 3.23 && a < 5.4 ? calFlip(String(years - 1), "", flipP, 150) : ""), pop(a - 0.2));
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(`<rect x="-400" y="${VY + 60}" width="3000" height="600" fill="#141a45"/>`, c, 0.8) + layer(vault + plaque + cal, c);
  return { g, in: toScreen(c, VX, VY - 300), inC: P.ink, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4];
export const vanishSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
