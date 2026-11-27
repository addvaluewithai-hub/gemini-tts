// "A toxic gas in the bathroom": the Short, scene by scene. Every action is timed to a spoken word:
// W(line, word) is the moment that word starts in the cut voice track (voice/timeline.json).
import { clamp, lerp, E, tw, kf, pop, unpop, wob, bump, on, rnd, noise, n2, T, G, poseAt, star, mix } from "./kit.js";
import { C } from "./palette.js";
import { mom, momDefs, FACE } from "./mom.js";
import { toilet, bottles, gasCloud, motes, propDefs, sparkle, brush, pictToilet } from "./props.js";
import { setDefs, hallway, bathroom, bucket, mind, stage, alarm, balcony, endCard, vignette } from "./sets.js";
import { peekAt } from "./peekact.js";

let D, S, BL = [];
const W = (n, i) => D.lines[n - 1].words[i].s, LS = (n) => D.lines[n - 1].t0, LE = (n) => D.lines[n - 1].t1;
const env = (t) => { const x = t * 60, i = Math.floor(x); if (i < 0 || i + 1 >= D.env.length) return 0; return lerp(D.env[i], D.env[i + 1], x - i); };
export function setup(data) {
  D = data;
  S = { s2: W(3, 0) - 0.3, s3: W(4, 0) - 0.14, s4: W(5, 0) - 0.1, s5: W(6, 0) - 0.18, s6: LS(8), s7: W(9, 0) - 0.1, rinse: W(9, 8) - 0.16, s8: W(10, 0) - 0.14, s9: W(11, 0) - 0.12, s10: LS(12), end: D.voice_end - 0.14, total: D.total };
  BL = []; for (let i = 0, t = 0.9; t < D.total; i++) { BL.push(t); t += 1.9 + rnd(i * 5.3) * 2.2; }
}
const DEFS = `<defs>${setDefs}${propDefs}${momDefs}</defs>`;
const circleClip = (id, x, y, r, inner) => `<clipPath id="${id}"><circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(Math.max(0, r))}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
const cam = (inner, s, fx = 540, fy = 960, tx = 540, ty = 960, rot = 0) => `<g transform="translate(${n2(tx)} ${n2(ty)}) rotate(${n2(rot)}) scale(${n2(s)}) translate(${n2(-fx)} ${n2(-fy)})">${inner}</g>`;
const breathe = (t) => 0.5 + 0.5 * Math.sin(t * 2.6);
const blinkFace = (t, f) => { for (const b of BL) { const d = (t - b - 0.37) * 30; if (d >= 0 && d < 5 && f.happy < 0.5) return { ...f, open: f.open * (d < 2 ? 0.1 : (d - 1) / 4) }; } return f; };
const faceAt = (t, track) => blinkFace(t, poseAt(t, track.map(([a, f, d, e]) => [a, typeof f === "string" ? FACE[f] : f, d, e]), FACE.neutral));
const pt = (t, track) => { const p = poseAt(t, track.map(([a, v, d, e]) => [a, { x: v[0], y: v[1] }, d, e])); return { x: p.x, y: p.y }; };
const held = (inner, y = 0, rot = 0) => `<g transform="rotate(${rot}) translate(0 ${y})">${inner}</g>`;
const warn = (x, y, s, r = 0) => G(T(x, y, r, s), `<path d="M0 -92 L98 72 Q104 86 88 86 H-88 Q-104 86 -98 72Z" fill="${C.sun}" stroke="${C.ink}" stroke-width="14" stroke-linejoin="round"/><rect x="-11" y="-44" width="22" height="70" rx="11" fill="${C.ink}"/><circle cx="0" cy="52" r="13" fill="${C.ink}"/>`);
const xmark = (x, y, s, r = 0) => G(T(x, y, r, s), `<path d="M-50 -50 L50 50 M50 -50 L-50 50" stroke="#fff" stroke-width="44" stroke-linecap="round"/><path d="M-50 -50 L50 50 M50 -50 L-50 50" stroke="${C.red}" stroke-width="28" stroke-linecap="round"/>`);
const plus = (x, y, s) => G(T(x, y, 0, s), `<path d="M-46 0 H46 M0 -46 V46" stroke="${C.cream}" stroke-width="26" stroke-linecap="round"/>`);
const flash = (t, t0, d = 0.1, color = "#fff") => { const k = 1 - clamp((t - t0) / d); return t >= t0 && k > 0 ? `<rect width="1080" height="1920" fill="${color}" opacity="${n2(k * 0.9)}"/>` : ""; };
const airSwirl = (x, y, s, t, ph, color = "#fff", op = 0.8) => `<path d="M-160 20 C-80 -60 40 -60 70 0 C90 44 30 70 10 34 C0 12 28 0 40 14" transform="translate(${n2(x)} ${n2(y)}) scale(${s})" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round" stroke-dasharray="90 420" stroke-dashoffset="${n2(-(t * 520 + ph * 510) % 510)}" opacity="${op}"/>`;

// ---------------------------------------------------------------- 1. the hook: Peek outside the bathroom door
function sHook(t) {
  const puffT = W(1, 4) - 0.1, shy = W(2, 3);
  const puff = t < shy ? (0.45 + 0.55 * pop(t, puffT, 0.45)) * (1 + 0.06 * Math.sin(t * 5)) : unpop(t, shy + 0.05, 0.4) * (1 + wob(t, shy, 9, 6, 0.12));
  const skull = t < LS(2) - 0.05 ? tw(t, W(1, 5), W(1, 5) + 0.22, 0, 1) : tw(t, LS(2) - 0.05, LS(2) + 0.15, 1, 0);
  const bg = hallway(t, { gas: tw(t, 0, 2.6, 0.55, 1, E.out3), glow: 1, puff, skull });
  const track = [[0, { emote: "worried", armR: { x: 905, y: 500 }, look: 0.1 }], [W(1, 2) - 0.12, { emote: "serious", armR: { x: 915, y: 470 }, look: 0.75 }, 0.2],
    [W(1, 4) - 0.1, { emote: "surprised", armR: { x: 900, y: 430 }, look: 0 }, 0.14], [W(1, 6) - 0.05, { emote: "serious", armR: { x: 908, y: 600 }, look: 0 }, 0.25],
    [LE(1) + 0.08, { emote: "worried", gesture: "pockets", look: 0.9 }, 0.2], [LS(2) - 0.2, { emote: "deadpan", look: 0 }, 0.16],
    [W(2, 0) - 0.04, { emote: "deadpan", gesture: "pockets", look: 0 }, 0.18], [W(2, 3) - 0.05, { emote: "skeptical", gesture: "shrug", look: 0.4 }, 0.2], [LE(2), { emote: "eyeroll", gesture: "pockets" }, 0.2]];
  const shake = wob(t, W(2, 0), 4.5, 4, 16);
  const pk = peekAt(t, track, env, { x: 345 + shake, y: 1060 + bump(t, W(1, 4) - 0.1, 0.3) * -22, s: 1.14, blinks: BL });
  return cam(bg + pk, tw(t, 0, S.s2, 1.0, 1.07, E.out2), 560, 1000, 560, 1000);
}

// ---------------------------------------------------------------- 2. Friday: she declares war on the bathroom
const MX = 330, MY = 1650, MS = 1.12, TX = 790, TY = 1580, TS = 1.15;
function sWar(t) {
  const a = S.s2, tie = W(3, 2) - 0.05, tug = W(3, 3) + 0.12, glove = W(3, 4) - 0.1, snap = glove + 0.42, war = W(3, 5), lunge = W(3, 6) + 0.02;
  const x = tw(t, a + 0.1, a + 0.62, -320, MX, E.outBack), hopY = -bump(t, a + 0.1, 0.5) * 70;
  const face = faceAt(t, [[a, "grin"], [tie, "war", 0.2], [war - 0.05, { ...FACE.war, mo: 22, mw: 30, teeth: 1 }, 0.1], [war + 0.5, "war", 0.2], [lunge, { ...FACE.war, mo: 12, teeth: 1, lookX: 1 }, 0.12]]);
  const hl = pt(t, [[a, [-200, -260]], [tie, [-130, -735], 0.22, E.out3], [tug, [-235, -715], 0.08, E.out3], [tug + 0.14, [-140, -730], 0.12], [glove, [60, -415], 0.2], [glove + 0.26, [-30, -360], 0.16, E.out2], [snap, [-190, -330], 0.14, E.out5], [war - 0.12, [-150, -320], 0.12], [lunge, [-250, -420], 0.2]]);
  const hr = pt(t, [[a, [200, -270]], [tie, [130, -735], 0.22, E.out3], [tug, [235, -715], 0.08, E.out3], [tug + 0.14, [140, -730], 0.12], [glove, [150, -440], 0.2], [snap, [170, -470], 0.06], [snap + 0.1, [150, -430], 0.1], [war - 0.16, [190, -330], 0.12], [war, [215, -905], 0.16, E.outBack], [lunge, [345, -560], 0.16, E.outBack]]);
  const sq = wob(t, a + 0.6, 4, 7, 0.07) + kf(t, [[war - 0.22, 0], [war - 0.06, 0.1, E.out2], [war + 0.08, -0.07, E.out3], [war + 0.3, 0, E.outBack]]) + wob(t, lunge, 4, 6, 0.04);
  const showBrush = t > glove + 0.55, brushRot = kf(t, [[war - 0.16, -150], [war, 0, E.outBack], [lunge, 62, E.outBack]]);
  const m = G(T(x, MY + hopY, 0, MS), mom({ face, handL: hl, handR: hr, squash: sq, lean: tw(t, lunge, lunge + 0.18, 0, 9, E.outBack), tails: wob(t, tug, 5, 5, 30) + wob(t, a + 0.6, 3, 5, 14), headTilt: wob(t, tug, 6, 7, 5),
    breath: breathe(t), tt: t, heldR: showBrush ? held(`<g transform="scale(1.35)">${brush()}</g>`, 330 * pop(t, glove + 0.55, 0.2), brushRot) : "" }));
  const shut = tw(t, war + 0.02, war + 0.12, 1, 0.04, E.in3), shiver = t > lunge ? Math.sin(t * 46) * 7 * clamp(1 - (t - lunge) / 1.2, 0.3, 1) : 0;
  const tl = G(T(TX + shiver + wob(t, war + 0.12, 6, 6, 8), TY, tw(t, lunge, lunge + 0.2, 0, 5, E.outBack)), G(`scale(${TS})`, toilet({ lid: shut, squash: wob(t, war + 0.12, 5, 6, 0.06), t })));
  let rays = ""; const rk = bump(t, war - 0.02, 1.3); if (rk > 0) { for (let i = 0; i < 12; i++) { const an = (i * 30 + t * 30) * Math.PI / 180; rays += `<path d="M0 0 L${n2(Math.cos(an - 0.1) * 1900)} ${n2(Math.sin(an - 0.1) * 1900)} L${n2(Math.cos(an + 0.1) * 1900)} ${n2(Math.sin(an + 0.1) * 1900)}Z"/>`; } rays = `<rect width="1080" height="1920" fill="${C.ink}" opacity="${n2(rk * 0.35)}"/><g transform="translate(${MX} 1000)" fill="${C.sun}" opacity="${n2(rk * 0.4)}">${rays}</g>`; }
  const glint = t > war ? G(T(x + 215 * MS, MY - 1150 * MS), `<path d="${star(70 * bump(t, war + 0.05, 0.5))}" fill="#fff"/>`) : "";
  const snapFx = on(t, snap, snap + 0.2) ? G(T(x + 160 * MS, MY - 440 * MS), [0, 1, 2, 3, 4].map((i) => `<path d="M${n2(Math.cos(i * 1.256) * (30 + (t - snap) * 400))} ${n2(Math.sin(i * 1.256) * (30 + (t - snap) * 400))} l${n2(Math.cos(i * 1.256) * 34)} ${n2(Math.sin(i * 1.256) * 34)}" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`).join("")) : "";
  const sc = bathroom(t, {}) + rays + tl + m + glint + snapFx;
  return cam(sc, tw(t, a, S.s3, 1.0, 1.05, E.out2), 540, 1100, 540 + wob(t, war, 9, 6, 14), 1100 + wob(t, war + 0.02, 11, 6, 10));
}

// ---------------------------------------------------------------- 3. the doctrine: one cleans, two clean more, three..
function sDoctrine(t) {
  const b1 = W(4, 2) - 0.1, c1 = W(4, 3), b2 = W(4, 4) - 0.1, c2 = W(4, 5) + 0.1, b3 = W(4, 7) - 0.12, born = W(4, 8) - 0.05;
  const glory = tw(t, born, born + 0.5, 0, 1, E.out3), lev = tw(t, born, born + 0.9, 0, 120, E.out3) + (t > born ? Math.sin((t - born) * 2.4) * 14 : 0);
  const grime = kf(t, [[c1, 1], [c1 + 0.25, 0.62], [c2, 0.62], [c2 + 0.25, 0.28], [born, 0.28], [born + 0.3, 0]]);
  const tx = 600, ty = 1500 - lev, ts = 1.2;
  const dirt = grime > 0.01 ? `<g opacity="${n2(grime)}" fill="#7A6A2B">${[[-90, -430, 26], [70, -470, 18], [-40, -150, 30], [90, -110, 20], [-110, -90, 16], [20, -390, 14], [110, -330, 12]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${n2(r * 0.7)}"/>`).join("")}</g>
    ${[0, 1, 2].map((i) => `<path d="M${-60 + i * 60} -600 q-16 -24 0 -48 q16 -24 0 -48" transform="translate(0 ${n2(-8 * Math.sin(t * 3 + i))})" fill="none" stroke="#9BAE3C" stroke-width="9" stroke-linecap="round" opacity="${n2(grime * 0.9)}"/>`).join("")}` : "";
  const wing = (side) => `<g transform="translate(${side * 140} -420) scale(${side * pop(t, born + 0.15, 0.4)} ${pop(t, born + 0.15, 0.4)}) rotate(${n2(-16 + 15 * Math.sin(t * 9))})"><ellipse cx="96" cy="74" rx="84" ry="36" transform="rotate(14 96 74)" fill="#E3F0F4"/><ellipse cx="124" cy="28" rx="112" ry="44" transform="rotate(4 124 28)" fill="#F2F8FA"/><ellipse cx="140" cy="-30" rx="140" ry="56" transform="rotate(-12 140 -30)" fill="#fff"/><path d="M40 -30 C100 -70 190 -80 250 -60" fill="none" stroke="${C.porcelainLo}" stroke-width="7" stroke-linecap="round"/></g>`;
  const halo = glory > 0 ? `<ellipse cx="0" cy="${n2(-650 - 10 * Math.sin(t * 3))}" rx="${n2(120 * pop(t, born + 0.2, 0.35))}" ry="${n2(30 * pop(t, born + 0.2, 0.35))}" fill="none" stroke="${C.sun}" stroke-width="20"/><ellipse cx="0" cy="${n2(-650 - 10 * Math.sin(t * 3))}" rx="${n2(120 * pop(t, born + 0.2, 0.35))}" ry="${n2(30 * pop(t, born + 0.2, 0.35))}" fill="none" stroke="#FFF4C2" stroke-width="7"/>` : "";
  const sp = (x, y, r, t0, ph) => (t > t0 ? `<path d="${star(r * (pop(t, t0, 0.3) + 0.25 * Math.sin((t - t0) * 9 + ph)))}" transform="translate(${x} ${y}) rotate(${n2((t - t0) * 60)})" fill="#fff"/>` : "");
  const flies = grime > 0.3 ? [0, 1].map((i) => `<circle cx="${n2(Math.cos(t * (5 + i) + i * 3) * 190)}" cy="${n2(-380 + Math.sin(t * (7 + i * 2) + i) * 150)}" r="9" fill="${C.ink}" opacity="${n2(clamp((grime - 0.3) * 4))}"/>`).join("") : "";
  const tl = G(T(tx, ty, wob(t, c2 + 0.1, 3, 5, 3), ts), (glory > 0 ? wing(-1) + wing(1) : "") + toilet({ lid: 1 - bump(t, c2 + 0.12, 0.3) * 0.7, squash: wob(t, c1, 5, 7, 0.04) + wob(t, c2 + 0.1, 5, 6, 0.06) + wob(t, born, 3, 5, 0.05), shine: glory, t }) + dirt + flies + halo
    + sp(-175, -330, 46, c1, 0) + sp(170, -470, 40, c2, 1) + sp(-150, -520, 34, c2 + 0.08, 2) + sp(190, -200, 44, c2 + 0.16, 3));
  const shadow = `<ellipse cx="${tx}" cy="1516" rx="${n2(250 - lev * 0.5)}" ry="${n2(34 - lev * 0.08)}" fill="${C.ink}" opacity="${n2(0.28 - lev * 0.0008)}"/>`;
  const drop = (name, x, t0, num, up) => { const y = kf(t, [[t0, -340], [t0 + 0.42, 600, E.outBounce]]) - up * glory; if (t < t0) return "";
    return G(T(x, y, wob(t, t0 + 0.15, 4, 6, 7), 0.82), G(`scale(${n2(1 + wob(t, t0 + 0.16, 5, 8, 0.12))} ${n2(1 - wob(t, t0 + 0.16, 5, 8, 0.12))})`, bottles[name]()))
      + `<g transform="translate(${x} ${n2(676 - up * glory)}) scale(${n2(pop(t, t0 + 0.3, 0.3))})"><circle r="54" fill="${C.ink}"/><text y="29" text-anchor="middle" font-family="Anton" font-size="78" fill="${C.cream}">${num}</text></g>`; };
  const mface = faceAt(t, [[S.s3, "grin"], [b1 - 0.2, { ...FACE.neutral, lookX: 0.6, lookY: -0.8 }, 0.2], [c2, { ...FACE.grin, lookX: 0.6, lookY: -0.6 }, 0.2], [b3 + 0.1, { ...FACE.shock, lookX: 0.5, lookY: -0.6 }, 0.14], [born + 0.1, "dreamy", 0.3]]);
  const mr = pt(t, [[S.s3, [215, -250]], [W(4, 0) + 0.05, [120, -760], 0.25, E.outBack], [b1, [300, -640], 0.2], [b2, [315, -720], 0.2], [b3, [330, -760], 0.2], [born + 0.1, [50, -410], 0.3]]);
  const ml = pt(t, [[S.s3, [-215, -250]], [born + 0.1, [-40, -430], 0.3]]);
  const m = G(T(175, 1800 - bump(t, born + 0.1, 0.4) * 30, 0, 0.74), mom({ face: mface, handL: ml, handR: mr, bendR: t > born ? 1 : -1, lean: tw(t, born, born + 0.4, 4, -3), tails: wob(t, born, 3, 4, 20), breath: breathe(t), tt: t, headTilt: tw(t, born, born + 0.4, 0, -8) }));
  let glow = glory > 0 ? `<circle cx="${tx}" cy="${n2(ty - 330)}" r="${n2(520 * glory)}" fill="#FFF4C2" opacity="${n2(0.28 * glory)}"/>` : "";
  let extra = ""; if (glory > 0) for (let i = 0; i < 16; i++) extra += sparkle(80 + rnd(i * 3.3) * 920, 240 + rnd(i * 8.1) * 1150, 18 + rnd(i) * 26, t, rnd(i * 1.7), i % 3 ? "#fff" : C.sun);
  return mind(t, glory) + glow + drop("bleach", 250, b1, 1, 70) + drop("toilet", 560, b2, 2, 215) + drop("glass", 870, b3, 3, 70) + shadow + tl + m + extra;
}

// ---------------------------------------------------------------- 4. the chemistry: bleach + any of the three = gas
function sChem(t) {
  const inB = W(5, 1) - 0.12, p = [["toilet", W(5, 3) - 0.18, W(5, 5) - 0.1], ["vinegar", W(5, 6) - 0.22, W(5, 7) - 0.06], ["glass", W(5, 9) - 0.3, 99]];
  const out = W(5, 11) - 0.05, gasW = W(5, 12) - 0.06, samW = W(5, 13);
  const by = kf(t, [[inB, -620], [inB + 0.36, 1500, E.outBounce]]);
  const hits = p.map((q) => q[1] + 0.3), shake = hits.reduce((a, h) => a + wob(t, h, 9, 7, 9), 0) + (t > gasW ? Math.sin(t * 50) * 5 : 0);
  const bleach = t >= inB ? G(T(285 + shake, by, wob(t, inB + 0.3, 4, 6, 5), 2.05), bottles.bleach()) : "";
  let partners = "", pl = "";
  for (const [name, a, b] of p) { if (t < a) continue; const x = t < b ? tw(t, a, a + 0.32, 1600, 800, E.outBack) : tw(t, b, b + 0.28, 800, 1600, E.in3), y = t < b ? 1500 : tw(t, b, b + 0.28, 1500, 1050, E.in2);
    partners += G(T(x - shake, y, (t < b ? wob(t, a + 0.3, 5, 6, 8) : (t - b) * 400), 2.0), bottles[name]()); pl += plus(548, 1215, 1.3 * pop(t, a + 0.22, 0.25) * (t < b ? 1 : unpop(t, b, 0.15))); }
  const g = kf(t, [[hits[0], 0], [hits[0] + 0.3, 0.42, E.outBack], [hits[1], 0.42], [hits[1] + 0.3, 0.56, E.outBack], [hits[2], 0.56], [hits[2] + 0.3, 0.7, E.outBack], [out, 0.7], [out + 0.3, 0.9, E.out3], [gasW, 0.9], [gasW + 0.3, 1.45, E.outBack]]);
  const cloud = gasCloud(545, 640 - g * 40, 330, t * 1.5, { seed: 6, n: 11, grow: g * (1 + 0.04 * Math.sin(t * 6)), skull: tw(t, samW - 0.05, samW + 0.15, 0, 1) });
  const hiss = hits.map((h, i) => on(t, h, h + 0.5) ? [0, 1, 2, 3, 4, 5].map((k) => { const u = (t - h) / 0.5, an = -Math.PI / 2 + (k - 2.5) * 0.3; return `<circle cx="${n2(548 + Math.cos(an) * u * 260)}" cy="${n2(1130 + Math.sin(an) * u * 320)}" r="${n2(22 * (1 - u))}" fill="${C.gasHi}"/>`; }).join("") : "").join("");
  const flood = gasCloud(540, 900, 1000, t * 2, { seed: 9, n: 12, grow: tw(t, samW + 0.12, S.s5 + 0.02, 0, 1.25, E.in2), hi: false });
  return cam(stage(t, { sx: 540, sy: 1520, sw: 560 }) + cloud + bleach + partners + pl + hiss, tw(t, S.s4, S.s5, 1, 1.06), 540, 1000, 540, 1000) + flood;
}

// ---------------------------------------------------------------- 5. cough, burning eyes, chest pain. And she is proud
const badge = (x, kind, k) => k <= 0 ? "" : G(T(x, 285, 0, k), `<circle r="100" fill="${C.ink}" opacity=".35" transform="translate(6 10)"/><circle r="100" fill="${C.red}"/><circle r="100" fill="none" stroke="#fff" stroke-width="10"/>` + (
  kind === 0 ? `<path d="M-22 0 L10 -22 A40 40 0 1 0 10 22Z" fill="#fff"/><circle cx="-30" cy="-16" r="6" fill="${C.red}"/><path d="M28 -30 l32 -18 M34 0 h40 M28 30 l32 18" stroke="#fff" stroke-width="12" stroke-linecap="round"/>`
  : kind === 1 ? `<path d="M-62 -6 Q0 -62 62 -6 Q0 44 -62 -6Z" fill="#fff"/><circle cx="0" cy="-8" r="20" fill="${C.red}"/><path d="M-30 46 l-6 22 M0 52 l0 24 M30 46 l6 22" stroke="#fff" stroke-width="11" stroke-linecap="round"/>`
  : `<path d="M-10 -52 V-10 M-10 -24 C-50 -30 -62 10 -58 50 C-36 56 -18 44 -10 26Z M10 -24 C50 -30 62 10 58 50 C36 56 18 44 10 26 V-52" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/><path d="M-14 -4 l18 14 l-14 12 l20 16" fill="none" stroke="${C.red}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`));
function sSymptoms(t) {
  const c1 = W(6, 0) - 0.04, c2 = c1 + 0.3, eyeT = W(6, 1) - 0.05, chestT = W(6, 3) - 0.05, she = W(7, 0) - 0.05, proud = W(7, 1) - 0.06, sniff = W(7, 2) - 0.05, end = LE(7) + 0.12;
  const face = faceAt(t, [[S.s5 - 0.3, "worried"], [c1, "cough", 0.07], [c1 + 0.2, { ...FACE.cough, mo: 8 }, 0.08], [c2, "cough", 0.06], [c2 + 0.24, "worried", 0.12], [eyeT, "burn", 0.14], [chestT, "pain", 0.14],
    [she, { ...FACE.worried, open: 1.15, lookX: 0, mo: 0 }, 0.16], [proud, "proud", 0.14], [sniff, "sniff", 0.2], [end - 0.02, "shock", 0.07]]);
  const fan = Math.sin(t * 30) * 34;
  const hr = pt(t, [[S.s5 - 0.3, [215, -260]], [c1, [36, -585], 0.1, E.out3], [c2 + 0.3, [150, -420], 0.2], [eyeT, [165, -700], 0.16, E.outBack], [chestT, [30, -415], 0.16, E.outBack], [proud - 0.1, [200, -300], 0.12], [proud + 0.04, [158, -315], 0.14, E.outBack]]);
  const hl = pt(t, [[S.s5 - 0.3, [-215, -260]], [eyeT, [-165, -700], 0.16, E.outBack], [chestT, [-200, -280], 0.2], [proud - 0.1, [-200, -300], 0.12], [proud + 0.04, [-158, -315], 0.14, E.outBack]]);
  const fanning = on(t, eyeT + 0.16, chestT) ? fan : 0;
  const cough = (c) => bump(t, c, 0.22), ck = cough(c1) + cough(c2) + bump(t, end, 0.2);
  const chest = tw(t, proud, proud + 0.2, 0, 0.7, E.outBack) + tw(t, sniff, LE(7), 0, 0.5, E.io2) * (0.8 + 0.2 * Math.sin(t * 9));
  const sq = kf(t, [[proud - 0.16, 0], [proud - 0.04, 0.07, E.out2], [proud + 0.08, -0.05, E.out3], [proud + 0.3, 0, E.outBack]]) - ck * 0.03;
  const m = G(T(MX, MY, 0, MS), mom({ face, handL: { x: hl.x, y: hl.y - fanning }, handR: { x: hr.x, y: hr.y + fanning }, bendL: t > proud ? 1 : -1, bendR: t > proud ? -1 : 1, squash: sq, lean: ck * 9 + tw(t, chestT, chestT + 0.2, 0, 6) * (t < she ? 1 : tw(t, she, she + 0.2, 1, 0)),
    headY: ck * 22, headTilt: tw(t, proud, proud + 0.2, 0, -7, E.outBack) + tw(t, sniff, sniff + 0.4, 0, -12) + wob(t, end, 8, 6, 5), chest, tails: wob(t, c1, 6, 6, 22) + wob(t, c2, 6, 6, 22) + wob(t, proud, 4, 5, 18), breath: breathe(t * 1.6), tt: t }));
  const mouthX = MX + 60, mouthY = MY - (652 - 80) * MS;
  const spit = [c1, c2, end].map((c, j) => on(t, c, c + 0.45) ? [0, 1, 2, 3, 4].map((i) => { const u = (t - c) / 0.45, an = 0.25 + (i - 2) * 0.22; return `<circle cx="${n2(mouthX + Math.cos(an) * u * 260)}" cy="${n2(mouthY + Math.sin(an) * u * 200 + u * u * 60)}" r="${n2(20 * (1 - u) + 4)}" fill="${C.gasHi}" opacity="${n2(1 - u)}"/>`; }).join("") : "").join("");
  const pulse = on(t, chestT, she) ? [0, 1].map((i) => { const u = ((t - chestT) * 1.6 + i * 0.5) % 1; return `<circle cx="${MX + 20}" cy="${MY - 440 * MS}" r="${n2(40 + u * 150)}" fill="none" stroke="${C.red}" stroke-width="${n2(14 * (1 - u))}" opacity="${n2(1 - u)}"/>`; }).join("") : "";
  const wisps = t > sniff ? [0, 1, 2].map((i) => `<path d="M${760 - i * 60} ${1260 - i * 130} C${640 - i * 30} ${1000 - i * 60} ${560} ${880 - i * 30} ${MX + 40} ${n2(MY - 640 * MS)}" fill="none" stroke="${C.gasHi}" stroke-width="${18 - i * 3}" stroke-linecap="round" stroke-dasharray="120 300" stroke-dashoffset="${n2(-((t - sniff) * 620 + i * 140) % 420)}" opacity="${n2(0.85 * clamp((t - sniff) * 4))}"/>`).join("") : "";
  const irony = t > proud ? [[120, 760, 34, 0], [560, 640, 28, 0.4], [150, 1230, 24, 0.7], [540, 1090, 30, 0.2]].map(([x, y, r, ph]) => sparkle(x, y, r * pop(t, proud + ph * 0.3, 0.3), t, ph)).join("") : "";
  const tl = G(T(TX, TY, 0, TS), toilet({ lid: 1, t, shine: t > proud ? pop(t, proud + 0.1, 0.3) * 0.8 : 0 }));
  const back = gasCloud(TX, 1150, 260, t, { seed: 3, n: 9, grow: 1 }) + gasCloud(980, 700, 240, t * 0.8, { seed: 11, n: 7, grow: 0.9 }) + gasCloud(120, 520, 200, t * 0.9, { seed: 15, n: 7, grow: 0.8 });
  const front = gasCloud(60, 1760, 280, t * 1.1, { seed: 18, n: 8, grow: 1 }) + gasCloud(1000, 1800, 300, t, { seed: 19, n: 8, grow: 1 });
  const room = bathroom(t, { haze: 1 }) + back + tl + pulse + m + spit + wisps + irony + front + motes(t, 30, C.gasHi, { seed: 30, speed: 36, size: 9, op: 0.5 });
  const z = kf(t, [[S.s5, 1.42], [she - 0.1, 1.5, E.lin], [proud + 0.25, 1.2, E.io3], [end, 1.3, E.lin]]);
  const fx = kf(t, [[S.s5, 360], [she, 360], [proud + 0.25, 470]]), fy = kf(t, [[S.s5, 1010], [she, 1010], [proud + 0.25, 1100]]);
  const bk = [0, 1, 2].map((i) => badge(250 + i * 290, i, t < she ? pop(t, [c1, eyeT, chestT][i], 0.3) : unpop(t, she + i * 0.05, 0.2))).join("");
  const flood = gasCloud(540, 900, 1000, t * 2, { seed: 9, n: 12, grow: tw(t, S.s5, S.s5 + 0.45, 1.25, 0, E.out3), hi: false });
  return cam(room, z, fx, fy, 540 + ck * 10, 1000) + bk + flood;
}

// ---------------------------------------------------------------- 6. Peek: that is not the smell of clean, that is an alarm
function sAlarm(t) {
  const a = S.s6, shout = W(8, 4) - 0.02, peak = W(8, 5);
  const track = [[a, { emote: "surprised", gesture: "stop" }], [W(8, 0) - 0.08, { emote: "furious", gesture: "stop", loud: 1.2 }, 0.12], [W(8, 2), { emote: "furious", armL: { x: 330, y: 560 }, armR: { x: 880, y: 500 }, loud: 1.2 }, 0.12],
    [shout, { emote: "surprised", gesture: "cheer", loud: 1.4, mouth: { w: 0.92, smile: -0.3, jaw: 0.7, smirk: 0 } }, 0.1], [peak + 0.3, { emote: "furious", gesture: "stop" }, 0.2]];
  const s = kf(t, [[a, 1.2], [a + 0.22, 1.8, E.outBack], [shout, 1.86, E.lin], [shout + 0.14, 2.1, E.outBack], [S.s7, 2.04]]);
  const sh = (t > peak ? Math.sin(t * 70) * 12 * clamp(1 - (t - peak) / 0.5) : 0) + wob(t, a, 10, 8, 16);
  const pk = peekAt(t, track, env, { x: 540 + sh, y: 1010 + sh * 0.5, s, blinks: [] });
  const tri = warn(165, 1500, 1.35 * pop(t, peak - 0.03, 0.25) * (1 + 0.08 * Math.sin(t * 30)), -12) + warn(915, 1500, 1.35 * pop(t, peak + 0.05, 0.25) * (1 + 0.08 * Math.sin(t * 30 + 1)), 12);
  return alarm(t) + pk + tri + flash(t, a, 0.14) + flash(t, peak, 0.1, C.sun);
}

// ---------------------------------------------------------------- 7. the rule: bleach alone. rinse. open the window
const RULE = ["الكلور", "ما", "يتخلطش", "بأي", "منظف", "تاني"];
function sRule(t) {
  const a = S.s7, never = W(9, 7) - 0.03, hit = [W(9, 2) + 0.02, W(9, 4) - 0.02, W(9, 5) + 0.2];
  const y = kf(t, [[a, -700], [a + 0.3, 1330, E.in3]]), sq = wob(t, a + 0.3, 4.5, 7, 0.16) + wob(t, never, 5, 7, 0.08);
  const hero = G(T(540 + hit.reduce((s, h) => s + wob(t, h + 0.2, 10, 8, 6), 0), y, wob(t, W(9, 1), 4, 5, 6), 2.05), G(`scale(${n2(1 + sq * 0.6)} ${n2(1 - sq)})`, bottles.bleach()));
  const from = [[-300, 1000, -20], [1380, 1040, 20], [1300, 260, 30]], names = ["toilet", "vinegar", "glass"], edge = [[135, 1020], [945, 1030], [860, 700]];
  let att = "", ring = "";
  hit.forEach((h, i) => { const t0 = h - 0.06, t1 = h + 0.2; if (t < t0 || t > t1 + 0.6) return; const [fx, fy, r0] = from[i], [ex, ey] = edge[i];
    const x = t < t1 ? tw(t, t0, t1, fx, ex, E.in2) : tw(t, t1, t1 + 0.55, ex, fx + (fx < 540 ? -160 : 160), E.out2), yy = t < t1 ? tw(t, t0, t1, fy, ey, E.in2) : ey + (fy - ey) * tw(t, t1, t1 + 0.55, 0, 1, E.out2) - bump(t, t1, 0.55) * 260;
    att += G(T(x, yy, t < t1 ? r0 : r0 + (t - t1) * (i % 2 ? 900 : -900), 1.45), `<g transform="translate(0 150)">${bottles[names[i]]()}</g>`); });
  const lastHit = hit.filter((h) => t >= h + 0.2).pop(), rk = lastHit !== undefined ? clamp(1 - (t - lastHit - 0.2) / 0.5) : 0, red = t > never;
  ring = t > a + 0.3 ? `<circle cx="540" cy="1020" r="${n2(375 + rk * 26)}" fill="${red ? C.red : C.sky}" opacity="${n2(0.06 + rk * 0.14)}"/><circle cx="540" cy="1020" r="${n2(375 + rk * 26)}" fill="none" stroke="${red ? C.red : C.sky}" stroke-width="${n2(8 + rk * 16 + (red ? 8 : 0))}" opacity="${n2(0.45 + rk * 0.55)}" stroke-dasharray="${red ? "none" : "40 26"}" stroke-dashoffset="${n2(-t * 60)}"/>` : "";
  const burst = hit.map((h, i) => on(t, h + 0.2, h + 0.5) ? G(T(edge[i][0], edge[i][1]), [...Array(7)].map((_, k) => { const u = (t - h - 0.2) / 0.3, an = k * 0.9; return `<path d="M${n2(Math.cos(an) * (30 + u * 110))} ${n2(Math.sin(an) * (30 + u * 110))} l${n2(Math.cos(an) * 40 * (1 - u))} ${n2(Math.sin(an) * 40 * (1 - u))}" stroke="#fff" stroke-width="12" stroke-linecap="round"/>`; }).join("")) : "").join("");
  const wd = (i) => { const o = n2(tw(t, W(9, i + 1) - 0.04, W(9, i + 1) + 0.1, 0, 1)); return `<tspan fill-opacity="${o}" stroke-opacity="${o}">${RULE[i]}</tspan>`; };
  const line = (ws, y) => `<text y="${y}" text-anchor="middle" direction="rtl" font-family="Cairo" font-weight="900" font-size="112" fill="${C.ink}" stroke="${C.ink}" stroke-width="22" stroke-linejoin="round">${ws}</text><text y="${y}" text-anchor="middle" direction="rtl" font-family="Cairo" font-weight="900" font-size="112" fill="${C.cream}">${ws}</text>`;
  const tk = 1 + RULE.reduce((s, _, i) => s + bump(t, W(9, i + 1) - 0.02, 0.2) * 0.035, 0) + bump(t, never, 0.3) * 0.08;
  const text = `<g transform="translate(540 330) scale(${n2(tk)})">${line([0, 1, 2].map(wd).join(" "), 0)}${line([3, 4, 5].map(wd).join(" "), 140)}
    <rect x="${n2(-400 * pop(t, never, 0.25))}" y="178" width="${n2(800 * pop(t, never, 0.25))}" height="20" rx="10" fill="${C.red}"/></g>`;
  const row = names.map((n, i) => { const t0 = never + 0.02 + i * 0.11; return t < t0 - 0.12 ? "" : G(T(250 + i * 290, 1590, 0, 0.62 * pop(t, t0 - 0.12, 0.2)), bottles[n]()) + xmark(250 + i * 290, 1500, 1.35 * pop(t, t0, 0.18) * (1 + wob(t, t0, 8, 9, 0.2)), 8 - i * 8); }).join("");
  return stage(t, { sx: 540, sy: 1345, sw: 470, spot: tw(t, a + 0.25, a + 0.4, 0, 1) }) + ring + att + hero + burst + text + row;
}
function sRinse(t) {
  const a = S.rinse, pour = W(9, 8) + 0.1, winT = W(9, 14) + 0.02, win = tw(t, winT, winT + 0.4, 0, 1, E.outBack), haze = tw(t, winT, winT + 0.7, 0.55, 0, E.out2);
  const face = faceAt(t, [[a, "grin"], [winT + 0.1, "relief", 0.2]]);
  const tiltK = tw(t, pour - 0.1, pour + 0.2, 0, 1, E.outBack);
  const hr = pt(t, [[a, [250, -470]], [pour - 0.1, [300, -560], 0.25, E.outBack], [winT, [250, -480], 0.3]]), hl = pt(t, [[a, [120, -400]], [pour - 0.1, [150, -470], 0.25, E.outBack], [winT, [120, -410], 0.3]]);
  const bx = MX + 215 * MS, byy = MY - 470 * MS - tiltK * 70, bt = tiltK * 78 - tw(t, winT, winT + 0.3, 0, 60);
  const pouring = on(t, pour + 0.12, winT + 0.1);
  const stream = pouring ? `<path d="M${n2(bx + 190)} ${n2(byy - 110)} Q${TX - 10} ${n2(byy - 190)} ${TX} ${TY - 280 * TS}" fill="none" stroke="${C.water}" stroke-width="44" stroke-linecap="round"/><path d="M${n2(bx + 190)} ${n2(byy - 110)} Q${TX - 10} ${n2(byy - 190)} ${TX} ${TY - 280 * TS}" fill="none" stroke="${C.waterHi}" stroke-width="16" stroke-linecap="round" stroke-dasharray="40 60" stroke-dashoffset="${n2(-t * 700)}"/>` +
    [...Array(8)].map((_, i) => { const u = ((t * 1.8 + i / 8) % 1), an = -Math.PI / 2 + (i - 3.5) * 0.3; return `<circle cx="${n2(TX + Math.cos(an) * u * 220)}" cy="${n2(TY - 290 * TS + Math.sin(an) * u * 240 + u * u * 200)}" r="${n2(15 * (1 - u) + 4)}" fill="${C.waterHi}"/>`; }).join("") : "";
  const m = G(T(MX, MY, 0, MS), mom({ face, handL: hl, handR: hr, lean: tiltK * 5 - tw(t, winT, winT + 0.3, 0, 5), breath: breathe(t), tt: t, tails: wob(t, pour, 4, 5, 16), headTilt: tw(t, winT, winT + 0.3, 0, -8) }));
  const bk = G(T(bx, byy, 0, 1.35), bucket(bt));
  const tl = G(T(TX + (pouring ? Math.sin(t * 40) * 3 : 0), TY, 0, TS), toilet({ lid: 1, t, squash: pouring ? 0.015 * Math.sin(t * 30) : 0, shine: tw(t, pour + 0.5, pour + 1, 0, 0.8) }));
  const air = win > 0.2 ? [0, 1, 2].map((i) => airSwirl(700 - i * 190, 520 + i * 230, 1.3 - i * 0.15, t, i * 0.33, "#fff", n2(0.8 * clamp(win)))).join("") : "";
  const hz = haze > 0.01 ? `<rect width="1080" height="1920" fill="${C.gas}" opacity="${n2(0.3 * haze)}"/>` + (t > winT ? gasCloud(tw(t, winT, winT + 0.6, 520, 780, E.in2), tw(t, winT, winT + 0.6, 620, 360, E.in2), 150, t, { seed: 5, n: 6, grow: bump(t, winT - 0.1, 0.75) * 0.8 }) : "") : "";
  const room = bathroom(t, { win, day: win * 0.8, shelf: ["bleach"] }) + tl + m + bk + stream + air + hz;
  // a sheet of water washes the rule away and leaves the bathroom
  const wy = tw(t, a - 0.22, a + 0.5, -2300, 2100, E.io2);
  let wave = `<path d="M0 ${n2(wy)} ${[...Array(10)].map((_, i) => `q60 ${i % 2 ? -70 : 70} 120 0`).join(" ")} V${n2(wy + 2300)} ${[...Array(10)].map((_, i) => `q-60 ${i % 2 ? -80 : 80} -120 0`).join(" ")}Z" fill="${C.water}"/><path d="M0 ${n2(wy + 500)} ${[...Array(10)].map((_, i) => `q60 ${i % 2 ? -50 : 50} 120 0`).join(" ")} V${n2(wy + 1700)} H0Z" fill="${C.waterHi}" opacity=".35"/>`;
  return { room: cam(room, tw(t, a, S.s8, 1.0, 1.05), 600, 1000, 600, 1000), wave: t < a + 0.55 ? wave : "", cover: wy + 1150 };
}

// ---------------------------------------------------------------- 8. if it happens: out, fresh air, ambulance, tell them
const bubble = (x, y, k, inner, tail = 1, w = 300, h = 220) => k <= 0 ? "" : G(T(x, y, 0, k), `<path d="M${tail * 40} ${h / 2 - 6} l${tail * 70} 80 l${-tail * 10} -84Z" fill="${C.cream}"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="50" fill="${C.cream}"/>${inner}`);
const ambulance = (t) => `<g transform="translate(0 6)"><rect x="-104" y="-54" width="150" height="96" rx="16" fill="#fff" stroke="${C.ink}" stroke-width="8"/><path d="M46 -30 h40 l26 34 v38 h-66z" fill="#fff" stroke="${C.ink}" stroke-width="8" stroke-linejoin="round"/><path d="M58 -18 h22 l16 22 h-38z" fill="${C.sky}"/>
  <rect x="-104" y="10" width="216" height="14" fill="${C.red}"/><path d="M-90 -18 h22 l10 -20 l14 36 l10 -16 h26" fill="none" stroke="${C.red}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="-58" cy="46" r="22" fill="${C.ink}"/><circle cx="-58" cy="46" r="9" fill="#fff"/><circle cx="66" cy="46" r="22" fill="${C.ink}"/><circle cx="66" cy="46" r="9" fill="#fff"/>
  <rect x="-34" y="-76" width="34" height="22" rx="8" fill="${Math.sin(t * 22) > 0 ? C.red : C.blue}"/><circle cx="-17" cy="-66" r="${n2(40 + 10 * Math.sin(t * 22))}" fill="${Math.sin(t * 22) > 0 ? C.red : C.blue}" opacity=".25"/></g>`;
const phone = `<rect x="-26" y="-56" width="52" height="100" rx="12" fill="${C.ink}"/><rect x="-20" y="-46" width="40" height="72" rx="6" fill="${C.sky}"/>`;
function sBalcony(t) {
  const a = S.s8, out = W(10, 2) - 0.1, air = W(10, 4) - 0.05, hard = W(10, 6) - 0.05, call = W(10, 9) - 0.08, amb = W(10, 10) - 0.02, what = W(10, 13) - 0.06;
  const x = tw(t, a + 0.05, out + 0.42, -360, 540, E.out3), running = on(t, a, out + 0.42), step = running ? Math.abs(Math.sin(t * 16)) : 0;
  const face = faceAt(t, [[a, "cough"], [out, { ...FACE.worried, red: 0.9, tear: 0.5, mo: 10 }, 0.1], [air, { ...FACE.relief, red: 0.5 }, 0.2], [air + 0.5, { ...FACE.relief, red: 0.15, mo: 4 }, 0.3], [hard, { ...FACE.worried, red: 0.4, mo: 12 }, 0.16], [call, { ...FACE.talk, red: 0.3 }, 0.14]]);
  const talking = t > call + 0.25 ? 0.5 + 0.5 * Math.sin(t * 19) : 0, f2 = { ...face, mo: t > call + 0.25 ? 4 + 14 * talking : face.mo };
  const pant = on(t, hard, call) ? 0.5 + 0.5 * Math.sin(t * 17) : 0;
  const hr = pt(t, [[a, [230, -420]], [out, [200, -300], 0.2], [air, [345, -610], 0.28, E.outBack], [hard, [40, -415], 0.2, E.outBack], [call - 0.12, [210, -330], 0.14], [call + 0.12, [165, -700], 0.2, E.outBack]]);
  const hl = pt(t, [[a, [-230, -380]], [out, [-200, -300], 0.2], [air, [-345, -610], 0.28, E.outBack], [hard, [-205, -270], 0.25], [what, [-250, -470], 0.2, E.outBack]]);
  const chest = tw(t, air, air + 0.5, 0, 1, E.io2) * (t < hard ? 1 : 0) + pant * 0.6;
  const m = G(T(x, 1680 - step * 36, running ? 7 : 0, 1.22), mom({ face: f2, handL: { x: hl.x, y: hl.y + (running ? Math.sin(t * 16) * 60 : 0) }, handR: { x: hr.x, y: hr.y - (running ? Math.sin(t * 16) * 60 : 0) }, bendL: -1, headFront: t < call, chest, headTilt: tw(t, air, air + 0.3, 0, -9) * (t < hard ? 1 : tw(t, hard, hard + 0.2, 1, 0)) + (t > call ? 4 : 0),
    squash: wob(t, out + 0.42, 4, 6, 0.06), tails: (running ? -34 : 0) + wob(t, out + 0.42, 3, 4, 26) + 6 * Math.sin(t * 3), breath: breathe(t * (t > hard && t < call ? 3 : 1)), tt: t, overR: true, heldR: t > call ? held(`<g transform="scale(${n2(1.5 * pop(t, call, 0.2))})">${phone}</g>`, 0, 180) : "" }));
  const lines = running ? [0, 1, 2, 3].map((i) => `<rect x="${n2(x - 330 - i * 50 - ((t * 900) % 120))}" y="${1000 + i * 150}" width="${170 - i * 20}" height="14" rx="7" fill="#fff" opacity=".7"/>`).join("") : "";
  const sw = on(t, air - 0.1, hard + 0.2) ? [0, 1, 2, 3].map((i) => airSwirl(i % 2 ? 860 : 220, 640 + i * 150, (i % 2 ? -1.5 : 1.5), t, i * 0.25, i % 2 ? C.sky : "#fff", n2(0.9 * clamp((t - air + 0.1) * 5) * clamp((hard + 0.2 - t) * 5)))).join("") : "";
  const ring = t > call + 0.2 ? [0, 1].map((i) => { const u = ((t - call) * 2 + i * 0.5) % 1; return `<path d="M${n2(x + 300 + u * 60)} ${n2(1680 - 870 - u * 40)} a${n2(40 + u * 50)} ${n2(40 + u * 50)} 0 0 1 0 ${n2(80 + u * 100)}" transform="translate(0 ${n2(-u * 50)})" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="${n2(1 - u)}"/>`; }).join("") : "";
  const b1 = bubble(800, 520, pop(t, amb, 0.3) * (1 + 0.02 * Math.sin(t * 6)), ambulance(t), -1, 320, 240);
  const b2 = bubble(270, 600, pop(t, what, 0.3), G(T(-78, 78, 0, 0.5), bottles.bleach()) + plus(0, 4, 0.5).replace(C.cream, C.ink) + G(T(80, 78, 0, 0.5), bottles.toilet()), 1, 330, 230);
  return cam(balcony(t, { flutter: tw(t, air, air + 0.3, 0.6, 1.8), leak: tw(t, a, air + 1, 1, 0.5) }) + lines + sw + m + ring, tw(t, a, S.s9, 1.0, 1.05), 540, 1000, 540, 1000) + b1 + b2;
}

// ---------------------------------------------------------------- 9. the toilet shines anyway. She watches it like a son who got into medicine
function sPayoff(t) {
  const a = S.s9, q = W(11, 0), shineT = W(11, 1) - 0.05, stand = W(11, 3) - 0.15, as = W(11, 6) - 0.05, med = W(11, 8) - 0.08, done = W(11, 9) + 0.12;
  const px = 740, py = 1590, ps = 1.34;
  const lid = 1 - (bump(t, q, 0.22) + bump(t, q + 0.26, 0.22)) * 0.6 - bump(t, done + 0.1, 0.4) * 0.5;
  const tl = G(T(px, py - bump(t, as + 0.3, 0.3) * 30, wob(t, q, 4, 5, 4) + wob(t, done, 3, 4, 5), ps), toilet({ lid, t, shine: pop(t, shineT, 0.35), squash: wob(t, shineT, 5, 6, 0.05) + wob(t, med + 0.32, 5, 6, 0.08), doctor: tw(t, as, as + 0.3, 0, 1, E.out3), cap: tw(t, med, med + 0.34, 0, 1, E.in2), capSwing: wob(t, med + 0.34, 2.5, 3, 40) }));
  const gk = tw(t, shineT, shineT + 0.55, 0, 1, E.io2), gleam = on(t, shineT, shineT + 0.55) ? `<clipPath id="cGl"><rect x="${px - 230}" y="${py - 790}" width="460" height="800" rx="60"/></clipPath><g clip-path="url(#cGl)"><path d="M${n2(px - 420 + gk * 760)} ${py - 800} l90 0 l-190 820 l-90 0Z" fill="#fff" opacity=".7"/></g>` : "";
  const mx = kf(t, [[a + 0.12, -330], [a + 0.6, 385, E.outBack], [stand, 385], [stand + 0.4, 215, E.outBack]]), wipe = on(t, a + 0.55, stand), wa = t * 15;
  const face = faceAt(t, [[a, { ...FACE.war, bT: -0.4, mc: 10, lookX: 1 }], [stand, { ...FACE.moved, lookX: 1 }, 0.25], [med + 0.2, "joy", 0.14]]);
  const zag = t > med + 0.25, bounce = zag ? Math.abs(Math.sin((t - med) * 11)) * 26 : 0;
  const hr0 = pt(t, [[a, [200, -300]], [a + 0.5, [262, -520], 0.2, E.outBack], [stand, [200, -330], 0.16], [stand + 0.4, [70, -520], 0.3, E.outBack], [med + 0.2, [70, -590], 0.14, E.outBack]]), hl = pt(t, [[stand, [-200, -300]], [stand + 0.4, [10, -500], 0.3, E.outBack], [med + 0.2, [-300, -700], 0.2, E.outBack]]);
  const hr = wipe ? { x: hr0.x + Math.cos(wa) * 46, y: hr0.y + Math.sin(wa) * 70 } : hr0, rag = `<rect x="-46" y="-6" width="92" height="84" rx="22" fill="${C.pink}"/><path d="M-30 26 h60 M-30 50 h60" stroke="${C.pinkHi}" stroke-width="8"/>`;
  const m = t > a + 0.1 ? G(T(mx, 1700 - bounce - bump(t, stand, 0.4) * 40, 0, 1.08), mom({ overR: true, heldR: t < stand + 0.1 ? rag : "", face, handL: { x: hl.x, y: hl.y + (zag ? Math.sin(t * 22) * 30 : 0) }, handR: hr, bendR: 1, lean: (wipe ? 5 + 2 * Math.sin(wa) : 0) + tw(t, stand + 0.3, stand + 0.6, 0, 7) * (zag ? 0.3 : 1), headTilt: zag ? -6 + 3 * Math.sin(t * 22) : tw(t, stand + 0.4, stand + 0.8, 0, 10), tails: (wipe ? 12 * Math.sin(wa) : 0) + wob(t, stand + 0.5, 3, 4, 26) + (zag ? 10 * Math.sin(t * 22) : 0), breath: breathe(t), tt: t, squash: wob(t, stand + 0.5, 4, 6, 0.05) })) : "";
  const trill = zag ? [0, 1, 2].map((i) => { const u = ((t - med) * 3 + i / 3) % 1; return `<path d="M${n2(mx + 150 + u * 150)} ${n2(1700 - 720 - u * 120 - bounce)} q16 -22 32 0 q16 22 32 0" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="${n2(1 - u)}"/>`; }).join("") : "";
  let conf = ""; if (t > done) { const cols = [C.pink, C.sun, C.sky, C.gas, "#fff", C.scarfHi]; for (let i = 0; i < 46; i++) { const u = t - done, an = -Math.PI / 2 + (rnd(i * 2.2) - 0.5) * 2.4, v = 700 + rnd(i * 5.1) * 900; const x = px + Math.cos(an) * v * u * (1 - u * 0.25), y = py - 700 + Math.sin(an) * v * u + 900 * u * u;
    conf += `<rect x="-11" y="-18" width="22" height="36" rx="5" transform="translate(${n2(x)} ${n2(y)}) rotate(${n2(u * (300 + rnd(i) * 600) + i * 40)}) scale(1 ${n2(Math.cos(u * 12 + i))})" fill="${cols[i % 6]}"/>`; } }
  const ray = `<circle cx="${px}" cy="${py - 420}" r="${n2(640 * pop(t, shineT, 0.4))}" fill="url(#gGlowW)"/>`;
  return cam(bathroom(t, { win: 1, day: 1, shelf: ["bleach"] }) + ray + tl + gleam + m + trill + conf + motes(t, 16, "#fff", { seed: 40, speed: 18, size: 5, op: 0.45, h: 1400 }), tw(t, a, S.s10, 1.0, 1.06), 600, 1100, 600, 1100);
}

// ---------------------------------------------------------------- 10. the callback and the sign-off
function sSignoff(t) {
  const a = S.s10, ama = W(12, 0) - 0.12, fa = W(12, 5) - 0.12, shy = W(12, 6) + 0.1, pk0 = W(13, 0) - 0.12;
  const track = [[a - 0.1, { emote: "bored", bobY: 0 }], [a + 0.25, { emote: "bored", bobY: 16, look: 0 }, 0.3], [ama, { emote: "sly", armR: { x: 742, y: 520 }, look: -0.55 }, 0.22], [W(12, 3), { emote: "sly", armR: { x: 742, y: 520 }, look: 0.6 }, 0.2],
    [fa, { emote: "smug", armR: { x: 742, y: 520 }, look: 0 }, 0.18], [LE(12) - 0.25, { emote: "wink", gesture: "pockets" }, 0.16], [LE(12) + 0.02, { emote: "deadpan", look: 0.95 }, 0.14],
    [pk0, { emote: "proud", armR: { x: 800, y: 318 }, look: 0 }, 0.18], [W(13, 1), { emote: "grin", armR: { x: 800, y: 318 } }, 0.2], [LE(13) + 0.02, { emote: "wink", armR: { x: 860, y: 420 } }, 0.16]];
  const lean = kf(t, [[ama, 1.5], [ama + 0.3, 1.78, E.outBack], [LE(12) - 0.2, 1.82, E.lin], [pk0, 1.5, E.io3]]);
  const puff = bump(t, shy, 0.9) * (1 + wob(t, shy, 7, 5, 0.2));
  const bg = hallway(t, { gas: 0, glow: 0, puff: 0 }) + (puff > 0.01 ? gasCloud(880, 1500, 110, t * 2, { seed: 4, n: 6, grow: puff, squashY: 0.7 }) : "");
  const pk = peekAt(t, track, env, { x: 470, y: 960 + (lean - 1.5) * 110, s: lean, rot: tw(t, ama, ama + 0.3, 0, -3) * (t < pk0 ? 1 : tw(t, pk0, pk0 + 0.2, 1, 0)), blinks: BL });
  return cam(bg + pk, tw(t, a, S.end, 1.02, 1.08), 540, 1000, 540, 1000);
}
function sEnd(t) {
  const a = S.end + 0.22, bellT = a + 0.05, swing = wob(t, bellT + 0.1, 2.4, 1.6, 26);
  const letters = (word, y, t0) => [...word].map((ch, i) => { const k = pop(t, t0 + i * 0.035, 0.3), n = word.length; return `<text x="${n2((i - (n - 1) / 2) * 138)}" y="0" text-anchor="middle" font-family="Anton" font-size="250" fill="${C.cream}" transform="translate(540 ${y}) translate(${n2((i - (n - 1) / 2) * 0)} 0) scale(${n2(k)})" style="transform-box:fill-box;transform-origin:center">${ch}</text>`; }).join("");
  const word = (w, y, t0, size, fill) => { const k = pop(t, t0, 0.32); return `<g transform="translate(540 ${y}) scale(${n2(k)} ${n2(k * (1 + wob(t, t0 + 0.2, 4, 6, 0.08)))})"><text text-anchor="middle" font-family="Anton" font-size="${size}" letter-spacing="6" fill="${C.ink}" opacity=".45" transform="translate(8 12)">${w}</text><text text-anchor="middle" font-family="Anton" font-size="${size}" letter-spacing="6" fill="${fill}">${w}</text></g>`; };
  const bell = G(T(540, 420, 0, pop(t, bellT, 0.35)), `<g transform="rotate(${n2(swing)} 0 -150)"><circle cx="0" cy="-158" r="22" fill="none" stroke="${C.sun}" stroke-width="12"/><path d="M-120 60 C-96 30 -96 -20 -90 -50 C-80 -110 -44 -140 0 -140 C44 -140 80 -110 90 -50 C96 -20 96 30 120 60Z" fill="${C.sun}"/><path d="M-66 -70 C-58 -100 -36 -118 -8 -122" fill="none" stroke="#FFE9A8" stroke-width="14" stroke-linecap="round"/><rect x="-132" y="50" width="264" height="30" rx="15" fill="#E09A12"/><circle cx="${n2(-swing * 1.5)}" cy="92" r="26" fill="${C.pink}"/></g>
    ${[0, 1].map((i) => { const u = ((t - bellT) * 1.6 + i * 0.5) % 1; return t > bellT + 0.1 ? `<path d="M-170 -80 q-40 60 0 120" transform="translate(${n2(-u * 60)} 0)" fill="none" stroke="${C.cream}" stroke-width="12" stroke-linecap="round" opacity="${n2(1 - u)}"/><path d="M170 -80 q40 60 0 120" transform="translate(${n2(u * 60)} 0)" fill="none" stroke="${C.cream}" stroke-width="12" stroke-linecap="round" opacity="${n2(1 - u)}"/>` : ""; }).join("")}`);
  return endCard(t) + bell + word("EARTH", 860, a + 0.12, 270, C.cream) + word("REPORT", 1110, a + 0.24, 232, C.pink);
}

// ---------------------------------------------------------------- thumbnail (no words)
function thumb() {
  const t = 3.3, face = { ...FACE.burn, open: 0.55, mo: 16, mw: 30 };
  const m = G(T(330, 1960, -3, 1.42), mom({ face, handL: { x: -170, y: -700 }, handR: { x: 40, y: -430 }, tt: 0.4, lean: 3, tails: 14 }));
  const pk = peekAt(100, [[0, { emote: "surprised", armR: { x: 880, y: 470 }, look: -0.5 }]], () => 0.5, { x: 810, y: 1560, s: 1.12, rot: 6, blinks: [] });
  return cam(bathroom(t, { haze: 1 }), 1.5, 500, 900, 540, 960) + gasCloud(560, 430, 400, 2.2, { seed: 6, n: 12, grow: 1.0, skull: 1 }) + gasCloud(1000, 1150, 240, 1.2, { seed: 3, n: 8 }) + m + pk + gasCloud(80, 1800, 300, 1.2, { seed: 18, n: 8 }) + gasCloud(1010, 1860, 260, 1.2, { seed: 19, n: 8 })
    + G(T(900, 1010, 12, 1.25), warn(0, 0, 1));
}

// ---------------------------------------------------------------- the cut
export function frame(t) {
  if (t < 0) return DEFS + thumb();
  t = Math.max(0, Math.min(t, S.total - 1e-3));
  let s;
  if (t < S.s2) s = sHook(t);
  else if (t < S.s2 + 0.5) s = sHook(t) + circleClip("iris1", 760, 640, tw(t, S.s2, S.s2 + 0.5, 0, 1700, E.io3), sWar(t)) + `<circle cx="760" cy="640" r="${n2(tw(t, S.s2, S.s2 + 0.5, 0, 1700, E.io3))}" fill="none" stroke="${C.ink}" stroke-width="${n2(tw(t, S.s2, S.s2 + 0.5, 60, 0))}"/>`;
  else if (t < S.s3) s = sWar(t);
  else if (t < S.s3 + 0.45) { const r = tw(t, S.s3, S.s3 + 0.45, 0, 1800, E.io3); s = sWar(t) + [[420, 640, 22, 0], [470, 560, 34, 0.06]].map(([x, y, rr, d]) => `<circle cx="${x}" cy="${y}" r="${n2(rr * pop(t, S.s3 - 0.2 + d, 0.2))}" fill="#fff"/>`).join("") + circleClip("iris2", 560, 430, r, sDoctrine(t)) + `<circle cx="560" cy="430" r="${n2(r)}" fill="none" stroke="#fff" stroke-width="${n2(tw(t, S.s3, S.s3 + 0.45, 70, 0))}"/>`; }
  else if (t < S.s4) s = sDoctrine(t);
  else if (t < S.s4 + 0.3) { const r = tw(t, S.s4, S.s4 + 0.3, 1800, 0, E.in3); s = sChem(t) + circleClip("iris3", 600, 1000, r, sDoctrine(t)) + (r < 300 ? `<path d="${star(300 - r, 90, 8)}" transform="translate(600 1000) rotate(${n2(t * 200)})" fill="#fff" opacity="${n2(r / 300)}"/>` : ""); }
  else if (t < S.s5) s = sChem(t);
  else if (t < S.s6) s = sSymptoms(t);
  else if (t < S.s7) s = sAlarm(t);
  else if (t < S.s7 + 0.28) s = sRule(t) + circleClip("iris4", 540, 900, tw(t, S.s7, S.s7 + 0.28, 1500, 0, E.in3), sAlarm(t));
  else if (t < S.rinse - 0.22) s = sRule(t);
  else if (t < S.s8) { const r = sRinse(t); s = (r.cover < 960 && t < S.rinse + 0.2 ? sRule(t) : r.room) + r.wave; }
  else if (t < S.s8 + 0.36) { const k = tw(t, S.s8, S.s8 + 0.36, 0, 1, E.io3); s = `<g transform="translate(${n2(-1080 * k)} 0)">${sRinse(t).room}</g><g transform="translate(${n2(1080 * (1 - k))} 0)">${sBalcony(t)}</g>`; }
  else if (t < S.s9 - 0.3) s = sBalcony(t);
  else if (t < S.s9) s = sBalcony(t) + `<circle cx="800" cy="640" r="${n2(tw(t, S.s9 - 0.3, S.s9, 150, 1900, E.in3))}" fill="#FFF7CF"/>`;
  else if (t < S.s9 + 0.32) s = sPayoff(t) + `<rect width="1080" height="1920" fill="#FFF7CF" opacity="${n2(tw(t, S.s9, S.s9 + 0.32, 1, 0, E.out2))}"/>`;
  else if (t < S.s10 - 0.22) s = sPayoff(t);
  else if (t < S.s10) s = `<rect width="1080" height="1920" fill="${C.ink}"/>` + circleClip("iris5", 740, 900, tw(t, S.s10 - 0.22, S.s10, 1500, 0, E.in3), sPayoff(t));
  else if (t < S.s10 + 0.3) s = `<rect width="1080" height="1920" fill="${C.ink}"/>` + circleClip("iris6", 470, 900, tw(t, S.s10, S.s10 + 0.3, 0, 1600, E.out3), sSignoff(t));
  else if (t < S.end) s = sSignoff(t);
  else if (t < S.end + 0.3) s = sSignoff(t) + `<circle cx="470" cy="560" r="${n2(tw(t, S.end, S.end + 0.3, 0, 1900, E.in2))}" fill="#0C0822"/>`;
  else s = sEnd(t) + `<rect width="1080" height="1920" fill="#0C0822" opacity="${n2(tw(t, S.end + 0.3, S.end + 0.5, 1, 0))}"/>`;
  return DEFS + s + vignette;
}
export const scenes = () => S;
