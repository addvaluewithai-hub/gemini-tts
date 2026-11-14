// "Money" in portrait (1080 x 1920), for the Shorts: shots 0–8 of money.js redrawn for a tall frame. Same props, same
// timing (every action stays on its word); what sat side by side now stands one above the other and the camera moves
// down instead of across. The host leans in from the side low in the frame, so the lower corner on his side stays clear.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, cross, FW, FH } from "./kit.js";
import { P, mix, stars, skyline, clouds } from "./bank.js";
import { calPage, banknote, padlock, press, stall, fish, loaf, goldBar, car, bus, hills } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const arc = (from, to, p, bulge) => bez(from, [(from[0] + to[0]) / 2 + bulge, (from[1] + to[1]) / 2], to, ease(p));      // a throw from one tier to the other, bowing sideways
const hopTo = (from, to, p, h = 160) => bez(from, [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - h], to, ease(p));
// a tier to stand things on: a slab with its lit edge; `deep` fills everything below it (the lowest tier)
const ledge = (G, deep = false, fill = P.ground, x0 = -600, x1 = 1700) => `<rect x="${x0}" y="${G}" width="${x1 - x0}" height="70" fill="${fill}"/><rect x="${x0}" y="${G}" width="${x1 - x0}" height="12" fill="${mix(fill, "#ffffff", 0.12)}"/>${deep ? `<rect x="${x0}" y="${G + 70}" width="${x1 - x0}" height="900" fill="${mix(fill, "#000000", 0.25)}"/>` : `<path d="M${x0} ${G + 70}h${x1 - x0}l-40 26h${-(x1 - x0) + 80}Z" fill="${mix(fill, "#000000", 0.3)}"/>`}`;
const sky = () => `<rect width="${FW}" height="${FH}" fill="url(#bsky)"/>`;
const night = (fill) => `<rect width="${FW}" height="${FH}" fill="${fill || "url(#bnight)"}"/>`;
// the market at dusk, tall: the sun low behind the upper stall, hills behind each tier
const market = (c, tot, GA, GB) => sky() + layer(rings(760, GA - 260, 260 * (1 + 0.02 * Math.sin(tot * 1.3)), "#ffd27a", 0.2, 1.45) + `<circle cx="760" cy="${GA - 260}" r="170" fill="#ffd98a"/>` + clouds(tot, 260, 4, "#ffb199", 0.55), c, 0.14)
  + layer(hills(7, -900, 2000, GA - 20, 110, "#6a2f86") + (GB ? hills(19, -900, 2000, GB - 30, 90, "#4f2380") : ""), c, 0.6);

// ---- 0: a fish for a loaf. The fish stall above, the bread stall below; they swap ----
function v0(a, tot) {
  const c = camAt(a, [[0, 540, 1040, 1], [3.9, 540, 1060, 1.05]]), GA = 820, GB = 1620, S = 1.45;
  const F0 = [520, GA - 240], L0 = [540, GB - 230];
  const pf = seg(a, 2.75, 3.3), pl = seg(a, 2.95, 3.5), wag = Math.sin(tot * 9) * (a > 0.9 && a < 1.6 ? 1 : 0.2);
  const f = arc(F0, [L0[0] - 30, L0[1] - 20], pf, 420), l = arc(L0, [F0[0] + 30, F0[1] + 10], pl, -420), land = (t0) => (a > t0 ? 1 - 0.1 * Math.exp(-(a - t0) * 9) * Math.cos((a - t0) * 16) : 1);
  const main = ledge(GA) + ledge(GB, true) + at(540, GA, stall(P.blue, P.blueD), S) + at(540, GB, stall(P.pink, P.pinkD), S)
    + at(l[0], l[1], loaf(), [1.7, 1.7 * land(3.5)], 360 * ease(pl)) + at(f[0], f[1], fish(wag), [1.7 * (pf > 0.5 ? -1 : 1), 1.7 * land(3.3)], pf > 0 && pf < 1 ? 90 * Math.sin(Math.PI * pf) : 0)
    + (a > 3.3 ? rings(L0[0], L0[1] - 20, 180 * spring(a - 3.3, 7, 11), P.gold, 0.14 * (1 - seg(a, 3.6, 3.9))) : "");
  const g = market(c, tot, GA, GB) + layer(main, c);
  return { g, out: toScreen(c, F0[0] + 30, F0[1] + 10), outC: "#f0a65a", outZ: 20 };
}
// ---- 1: the baker below does not want fish; his shutter comes down, the plate above stays empty (host: right) ----
function v1(a, tot) {
  const c = camAt(a, [[0, 540, 1000, 1.0], [3.3, 540, 1010, 1.05]]), GA = 820, GB = 1560, S = 1.45, B = [440, GA], K = [420, GB];
  const out = ease(seg(a, 0.25, 0.9)), back = ease(seg(a, 1.6, 2.1)), y0 = B[1] - 240, y1 = K[1] - 400;
  const fx = B[0] + 380 * Math.sin(Math.PI * out) * (1 - back) - 260 * Math.sin(Math.PI * back), fy = lerp(lerp(y0, y1, out), y0, back);
  const sh = kf(a, [[1.32, 0], [1.55, 1.04], [1.66, 0.96], [1.75, 1]], easeIn), shake = a > 1.55 ? 8 * Math.exp(-(a - 1.55) * 8) * Math.sin((a - 1.55) * 50) : 0;
  const plate = a > 2.45 ? at(B[0] + 20 + 4 * Math.sin(a * 60) * Math.exp(-(a - 2.6) * 2) * (a > 2.6 ? 1 : 0), B[1] - 205 - 300 * (1 - easeOut(seg(a, 2.45, 2.62))), `<g transform="scale(1.45)"><ellipse rx="120" ry="26" fill="#fffaf0"/><ellipse rx="80" ry="15" fill="#e9e1d1"/><path d="M140 -6h70M160 -16v20M180 -16v20" stroke="${P.steel}" stroke-width="7" stroke-linecap="round"/></g>`) : "";
  const growl = a > 2.75 ? [0, 1, 2].map((i) => drawn(`M${B[0] - 250 - i * 40} ${B[1] - 330 - i * 30}q-24 -24 0 -48q24 -24 0 -48`, seg(a, 2.75 + i * 0.1, 2.95 + i * 0.1), "#cfc6ff", 6)).join("") : "";
  const main = ledge(GA) + ledge(GB, true) + at(B[0], GA, stall(P.blue, P.blueD), S) + at(K[0] + shake, GB, (sh < 0.95 ? at(0, -160, loaf()) : "") + stall(P.pink, P.pinkD, sh), S) + plate + growl
    + at(fx, fy, fish(Math.sin(tot * 9)), 1.7, out > 0 && out < 1 ? 90 * out : back > 0 ? -60 * Math.sin(Math.PI * back) : 0);
  const g = market(c, tot, GA, GB) + layer(main, c);
  return { g, in: toScreen(c, 540, GB - 230), inC: "#f0a65a", inZ: 20, out: toScreen(c, B[0] + 20, B[1] - 205), outC: "#fffaf0", outZ: 20 };
}
// ---- 2: salt, shells, then down to an island where a stone as big as a car hangs from a crane ----
function v2(a, tot) {
  const GS = 760, GH = 1500, GI = 2620, IS = 520;
  const c = camAt(a, [[0, 540, 640, 1.08], [1.5, 540, 660, 1.08], [2.25, 540, 1300, 1.04], [3.2, 540, 2250, 0.95], [3.75, 540, 2380, 1.08], [5.0, 540, 2330, 1.03], [6.4, 540, 2300, 1.0]]);
  const salt = at(560, GS - 180, `${two("M-80 0Q-96 -150 -50 -190L-60 -210H60L50 -190Q96 -150 80 0Z", P.cream, P.creamD, 0, 10)}<path d="M-56 -206Q0 -180 56 -206" stroke="${P.wood}" stroke-width="10" fill="none"/>${[[-30, -230], [0, -244], [26, -228], [-8, -224]].map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="16" rx="3" fill="#fff" transform="rotate(20 ${x} ${y})"/>`).join("")}`, [1.8 * pop(a - 1.69), 1.8 * pop(a - 1.69)]);
  const crate = at(560, GS, two(rr(-180, -180, 360, 180, 8), P.wood, P.woodD, 0, 12));
  const shells = at(540, GH - 380, `<rect x="-470" y="-60" width="18" height="460" fill="${P.woodD}"/><rect x="452" y="-60" width="18" height="460" fill="${P.woodD}"/><g transform="scale(1.9)"><path d="M-230 -26Q0 70 230 -26" stroke="${P.wood}" stroke-width="5" fill="none"/>${[-160, -80, 0, 80, 160].map((x, i) => at(x, 30 - Math.abs(x) * 0.14 + 6 * Math.sin(tot * 2 + i), `${two("M0 -28Q32 -24 30 6Q20 30 0 30Q-20 30 -30 6Q-32 -24 0 -28Z", "#ffe0ec", "#f0a8c4", 0, 6)}<path d="M0 -24V26M-16 -16L-8 24M16 -16L8 24" stroke="#f0a8c4" stroke-width="4"/>`, pop(a - 2.33 - i * 0.05))).join("")}</g>`);
  const st = pop(a - 3.77, 7, 12), lift = easeOut(seg(a, 5.55, 6.4)) * 260, swing = a > 5.55 ? 4 * Math.sin((a - 5.55) * 6) * Math.exp(-(a - 5.55) * 2) : 0, hookY = kf(a, [[4.9, GI - 1500], [5.45, GI - 530], [5.55, GI - 520]]) - lift;
  const stone = at(IS - 40, GI - 40 - 250 - lift, `<g transform="rotate(${swing})">${two(circ(0, 0, 250), "#c9b9a0", "#9e8c74", 14, 12)}<circle r="62" fill="${mix("#1d6fb8", P.sky1, 0.5)}"/>${[[-120, -90], [100, 120], [140, -60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#9e8c74"/>`).join("")}</g>`, [st, st]);
  const crane = a > 4.9 ? `<path d="M${IS - 40} ${hookY - 230}V${GI - 2400}" stroke="${P.ink}" stroke-width="8"/>${lift > 0 || a > 5.45 ? `<path d="M${IS - 40} ${hookY - 230}L${IS - 40} ${GI - 40 - 250 - lift - 62}" stroke="${P.ink}" stroke-width="8"/>` : ""}<path d="M${IS - 70} ${hookY - 230}h60v30h-60Z" fill="${P.gold}"/>` : "";
  const sea = `<rect x="-600" y="${GI}" width="2300" height="900" fill="#1d6fb8"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${-100 + i * 170 + 30 * Math.sin(tot + i)} ${GI + 50 + (i % 3) * 60}h90" stroke="#5fb6ff" stroke-width="8" stroke-linecap="round" opacity=".6"/>`).join("")}`;
  const island = sea + `<path d="M${IS - 470} ${GI + 30}Q${IS - 420} ${GI - 60} ${IS - 240} ${GI - 50}H${IS + 300}Q${IS + 420} ${GI - 50} ${IS + 470} ${GI + 30}Z" fill="#e8c88a"/>`
    + at(IS + 360, GI - 40, `<rect x="-10" y="-300" width="20" height="300" fill="${P.woodD}"/>${[0, 1, 2, 3].map((i) => `<path d="M0 -300q${(i < 2 ? -1 : 1) * 120} ${-40 + (i % 2) * 70} ${(i < 2 ? -1 : 1) * 200} ${30 + (i % 2) * 40}" stroke="#2fb26a" stroke-width="30" fill="none" stroke-linecap="round"/>`).join("")}`)
    + at(IS + 250, GI - 40, car(), [1.5 * pop(a - 4.24), 1.5 * pop(a - 4.24) * (a > 5.6 ? 1 + 0.05 * Math.sin(a * 30) * Math.exp(-(a - 5.6) * 4) : 1)]);
  const main = ledge(GS) + crate + salt + shells + island + stone + crane;
  const g = sky() + layer(clouds(tot, 300, 4, "#ffb199", 0.5) + clouds(tot * 0.7, 1500, 3, "#ffb199", 0.35), c, 0.3) + layer(hills(11, -900, 2000, GS - 10, 100, "#6a2f86") + hills(23, -900, 2000, GI - 10, 120, "#4f2380"), c, 0.7) + layer(main, c);
  return { g, in: toScreen(c, 560, GS - 330), inC: P.cream, inZ: 20 };
}
// ---- 3: gold. Rare, it keeps, and a fake one cracks ----
function v3(a, tot) {
  const c = camAt(a, [[0, 540, 960, 1.0], [1.5, 540, 960, 1.0], [2.0, 540, 940, 1.06], [4.3, 540, 950, 1.1]]), GY = 640;
  const drop = a < 1.55 ? -1600 : lerp(-1200, 0, easeIn(seg(a, 1.55, 1.8))), land = a > 1.8 ? spring(a - 1.8, 8, 14) : 0, sx = 1 + 0.25 * (1 - land) * (a > 1.8 ? 1 : 0);
  const ring = [["fish", 0], ["salt", 1], ["shell", 2], ["stone", 3]].map(([w, i]) => { const ang = a * 0.7 + i * Math.PI / 2, r = lerp(300, 1300, easeIn(seg(a, 1.3, 1.9))), x = 540 + Math.cos(ang) * r * 0.75, y = GY + 60 + Math.sin(ang) * r * 1.2;
    const inner = w === "fish" ? `<path d="M-40 0Q-10 -26 24 -14Q36 0 24 14Q-10 26 -40 0Z" fill="${P.blue}"/>` : w === "salt" ? `<path d="M-30 30Q-36 -20 -18 -40H18Q36 -20 30 30Z" fill="${P.cream}"/>` : w === "shell" ? `<path d="M0 -26Q30 -22 28 6Q18 28 0 28Q-18 28 -28 6Q-30 -22 0 -26Z" fill="#ffe0ec"/>` : `<circle r="34" fill="#c9b9a0"/><circle r="10" fill="${P.night1}"/>`;
    return at(x, y, inner, 2.4 * pop(a + 0.3 - i * 0.12)); }).join("");
  const shine = a > 2.0 ? `<clipPath id="vgshine"><circle r="160"/></clipPath><g clip-path="url(#vgshine)"><path d="M${-260 + ((a - 2.0) * 300) % 700} -200l60 0l-200 400l-60 0Z" fill="#fff" opacity=".35"/></g>` : "";
  const big = at(540, GY + drop, `${rings(0, 0, 250, P.gold, 0.18 * land)}<g transform="scale(${1.3 * sx} ${1.3 / sx})">${disc(0, 0, 160, P.gold, P.goldD)}<circle r="118" fill="none" stroke="${P.goldD}" stroke-width="14"/>${shine}</g>`);
  // the three proofs, one under the other: rare (a heap of rock with one glint), it keeps (the loaf beside it goes green), hard to fake (a grey coin cracks)
  const rare = at(300, 1330, `<g transform="scale(1.2)">${[[-120, 0, 90], [0, -10, 120], [120, 0, 90], [-60, -110, 80], [60, -110, 80], [0, -190, 70]].map(([x, y, r]) => disc(x, y, r, "#8a86a8", "#6b6790")).join("")}${rings(30, -120, 30 * (1 + 0.3 * Math.sin(tot * 6)), P.gold, 0.4)}${disc(30, -120, 16, P.gold, P.goldD)}</g>`, pop(a - 2.17));
  const mould = seg(a, 2.75, 3.4), keep = at(800, 1180, loaf(mould) + (mould > 0.6 ? [0, 1].map((i) => at(40 * Math.cos(tot * 7 + i * 3), -100 + 30 * Math.sin(tot * 9 + i * 2), `<circle r="7" fill="${P.ink}"/><ellipse cx="-6" cy="-8" rx="8" ry="5" fill="#cfc6ff"/><ellipse cx="6" cy="-8" rx="8" ry="5" fill="#cfc6ff"/>`)).join("") : ""), 1.9 * pop(a - 2.6));
  const fa = a - 3.54, crack = seg(a, 3.95, 4.2), fake = fa > 0 ? at(560, 1600, `<g transform="translate(${-40 * crack} ${30 * crack * crack}) rotate(${-20 * crack})"><clipPath id="vfkL"><path d="M-80 -80H4L-10 -20L10 20L-4 80H-80Z"/></clipPath><g clip-path="url(#vfkL)">${disc(0, 0, 70, "#b8b4c8", "#8a86a8")}</g></g>
    <g transform="translate(${40 * crack} ${30 * crack * crack}) rotate(${20 * crack})"><clipPath id="vfkR"><path d="M80 -80H4L-10 -20L10 20L-4 80H80Z"/></clipPath><g clip-path="url(#vfkR)">${disc(0, 0, 70, "#b8b4c8", "#8a86a8")}</g></g>${a > 3.8 ? `<circle cx="54" cy="-50" r="26" fill="${P.night1}"/>` : ""}${crack > 0 ? cross(0, -130, 34, P.red, a - 4.0) : ""}`, 1.7 * pop(fa)) : "";
  const g = night() + layer(stars(3, 90, -200, 1300, 1920, tot), c, 0.2) + layer(rings(540, GY, 460, P.violet, 0.12 * land, 1.5), c, 0.5) + layer(ring + rare + keep + fake + big, c);
  return { g, in: [540, 960], inC: P.ink, inZ: 12, out: toScreen(c, 540, GY), outC: P.gold, outZ: 18 };
}
// ---- 4: the gold goes into a strongbox above; the receipt drops from stall to stall below and becomes a banknote ----
function v4(a, tot) {
  const G = 880, GB = 1440, GC = 2000, SC = [250, G], SH = [760, G];
  const c = camAt(a, [[0, 420, 820, 1.28], [0.9, 430, 820, 1.28], [1.9, 620, 800, 1.25], [2.9, 680, 860, 1.22], [3.5, 560, 1180, 1.12], [4.6, 540, 1650, 1.12], [5.9, 540, 1720, 1.22]]);
  const sink = kf(a, [[0.2, 0], [0.42, 1.15], [0.55, 0.95], [0.66, 1]]), slide = ease(seg(a, 0.95, 1.9)), sackX = lerp(SC[0] + 90, SH[0], slide), sackY = lerp(G - 150 + 40 * sink, G - 80, slide) - 40 * Math.sin(Math.PI * slide);
  const scale = at(SC[0], G, `<path d="M-14 0h28l-6 -220h-16Z" fill="${P.steelD}"/><path d="M-150 ${-220 + 20 * sink}L150 ${-220 - 20 * sink}" stroke="${P.steel}" stroke-width="12" stroke-linecap="round"/>
    ${[[-150, 20], [150, -20]].map(([x, d]) => `<path d="M${x} ${-220 + d * sink}l-50 70h100Z" fill="none" stroke="${P.steel}" stroke-width="5"/><path d="M${x - 70} ${-150 + d * sink}h140l-14 16h-112Z" fill="${P.steel}"/>`).join("")}${slide < 0.3 ? "" : at(150, -160 + 20 * sink - 20, `<rect x="-30" y="-16" width="60" height="16" rx="4" fill="#8a86a8"/>`)}`);
  const sack = slide < 1 ? at(sackX, sackY, `${two("M-80 0Q-100 -110 -36 -130L-50 -160H50L36 -130Q100 -110 80 0Z", "#b07b4f", "#8a5a36", 0, 10)}${disc(0, -60, 32, P.gold, P.goldD)}${text(0, -46, "$", 40, "#8a5200")}`, [1 + 0.08 * sink * (1 - slide), 1 - 0.08 * sink * (1 - slide)]) : "";
  const shut = ease(seg(a, 1.85, 2.05)), lockA = a - 2.05;
  const shop = at(SH[0], G, `${two(rr(-200, -380, 400, 380, 8), "#3a4a8f", "#2c366f", 14, 0)}${two("M-230 -380L0 -470L230 -380Z", P.violetD, P.ink, 0, 10)}
    <path d="M-80 0V-200H80V0Z" fill="${P.ink}"/><path d="${rr(-80, -200, 160, 200 * shut, 0)}" fill="#5d678f"/>
    ${disc(0, -300, 46, P.gold, P.goldD)}${text(0, -282, "$", 56, "#8a5200")}<path d="${rr(120, -150, 50, 14, 4)}" fill="${P.ink}"/>${lockA > 0 ? at(0, -110, padlock(0.7, 0), pop(lockA)) : ""}`);
  const st = (x, y, col, colD) => at(x, y, two(rr(-120, -110, 240, 110, 8), col, colD, 0, 10) + `<path d="M-140 -260h280l-20 40h-240Z" fill="${col}"/><rect x="-120" y="-220" width="12" height="110" fill="${P.woodD}"/><rect x="108" y="-220" width="12" height="110" fill="${P.woodD}"/>`, 1.25);
  const stalls = st(300, GB, P.teal, P.tealD) + st(790, GB, P.pink, P.pinkD) + st(540, GC, P.blue, P.blueD);
  const stops = [[SH[0] + 145, G - 143], [300, GB - 188], [790, GB - 188], [540, GC - 188]], times = [2.9, 3.45, 4.0, 4.6];
  let rcpt = "";
  if (a > 2.9) { let p = stops[0], i = 0; for (; i < 3; i++) if (a >= times[i + 1]) p = stops[i + 1]; else break;
    if (i < 3 && a > times[i] + 0.12) { const q = seg(a, times[i] + 0.12, times[i + 1]); p = hopTo(stops[i], stops[i + 1], q, 120); }
    const grow = ease(seg(a, 5.0, 5.4)), slip = `${two(rr(-46, -30, 92, 60, 6), P.cream, P.creamD, 0, 6)}<path d="M-30 -10h44M-30 6h60" stroke="#c9b48a" stroke-width="6" stroke-linecap="round"/>${disc(26, 14, 12, P.red, P.redD)}`;
    rcpt = at(p[0], p[1] - 120 * grow, grow < 0.5 ? slip : banknote(1), [lerp(1.7, 2.6, grow) * Math.max(0.05, Math.abs(Math.cos(Math.PI * grow))), lerp(1.7, 2.6, grow)].map((v, j) => (j === 0 ? v : v * pop(a - 2.9))), 0); }
  const main = ledge(G) + ledge(GB) + ledge(GC, true) + scale + stalls + shop + sack + rcpt;
  const g = market(c, tot, G, GB) + layer(main, c);
  return { g, in: toScreen(c, SC[0], G - 220), inC: P.gold, inZ: 18, out: toScreen(c, 540, GC - 300), outC: "#6fe3a1", outZ: 20 };
}
// ---- 5: 1971, the gold slides out from under the note; the note stays up on its own (host: left) ----
function v5(a, tot) {
  const c = camAt(a, [[0, 540, 960, 1.0], [4.1, 540, 940, 1.05]]);
  const out = easeIn(seg(a, 1.41, 2.3)), wob = a > 2.2 ? 9 * Math.exp(-(a - 2.2) * 2.4) * Math.sin((a - 2.2) * 9) : 0, bob = 10 * Math.sin(tot * 1.5);
  const bar = at(560, 1240 + out * 1100, `${rings(0, -200, 320, P.gold, 0.16 * (1 - out))}${goldBar(3)}<path d="M-260 0h520" stroke="${P.goldD}" stroke-width="10"/>`, 1, out * 25);
  const nt = at(560, 860 + bob * seg(a, 2.6, 3.2), banknote(3.6), 1, wob);
  const pit = `<ellipse cx="560" cy="1820" rx="460" ry="70" fill="#0a0726"/>`;
  const cal = at(560, 360, calPage("1971", "", 1.15, 150), pop(a - 0.29));
  const g = night() + layer(stars(13, 90, -200, 1300, 1920, tot), c, 0.2) + layer(pit + bar + nt + cal, c);
  return { g, in: toScreen(c, 560, 860), inC: "#6fe3a1", inZ: 20 };
}
// ---- 6: whoever holds the press prints as much as he likes; the notes pile up on both sides ----
function v6(a, tot) {
  const c = camAt(a, [[0, 540, 1080, 1.22], [3.9, 540, 1020, 1.04]]), G = 1360;
  const ph = 0.9 * a + 1.1 * a * a, cyc = ph % 1, stamp = cyc < 0.3 ? Math.sin(Math.PI * cyc / 0.3) : 0, n = Math.floor(ph);
  const stackH = (side) => Math.min(760, n * 34 * (side ? 1 : 0.9)), stack = (x, h) => Array.from({ length: Math.floor(h / 16) }, (_, i) => at(x + 4 * Math.sin(i * 1.7), G + 330 - 10 - i * 16, `<path d="${rr(-110, -8, 220, 16, 4)}" fill="${i % 2 ? "#6fe3a1" : "#5fd391"}"/><path d="M-110 8h220" stroke="#3fbf7a" stroke-width="3"/>`)).join("");
  const flying = (() => { const u = cyc - 0.3; if (u < 0) return ""; const side = n % 2, x1 = side ? 860 : 220, p = clamp(u / 0.6), b = arc([540, G - 160], [x1, G + 320 - stackH(side)], p, side ? 260 : -260); return at(b[0], b[1], banknote(1.6), 1, (side ? 1 : -1) * 40 * p); })();
  const main = `<rect x="-300" y="${G}" width="1700" height="30" fill="#2c1a66"/><rect x="-300" y="${G + 330}" width="1700" height="400" fill="#2c1a66"/><rect x="380" y="${G}" width="320" height="330" fill="#241458"/>`
    + stack(220, stackH(0)) + stack(860, stackH(1)) + at(540, G, press(stamp, { lamp: Math.min(3, a * 1.2) }), 1.45) + flying
    + (a > 2.74 ? at(540, 420, calPage("2009", "", 1.0, 150), pop(a - 2.74)) : "");
  const g = night("#3b1d74") + layer(`<path d="M240 -200L540 ${G - 400}L840 -200Z" fill="#ffd98a" opacity=".08"/>` + skyline(61, -300, 1400, G - 120, 120, 420, "#4a2690"), c, 0.4) + layer(main, c);
  return { g, out: toScreen(c, 540, G - 160), outC: "#6fe3a1", outZ: 16 };
}
// ---- 7: one note, a hundred trillion: the zeros pile up as rows down a tall note ----
function v7(a, tot) {
  const zeros = Math.round(kf(a, [[1.0, 0], [2.3, 14]], (p) => p)), str = "1" + "0".repeat(zeros), groups = str.replace(/\B(?=(\d{3})+(?!\d))/g, ",").split(",");
  const rows = groups.length, H = 300 + rows * 170, top = 380;
  const c = { x: 540, y: lerp(820, top + H / 2, ease(seg(a, 0.6, 2.4))), z: lerp(1.2, clamp(1500 / (H + 300), 0.8, 1.2), ease(seg(a, 0.6, 2.4))) };
  const slideIn = easeOut(seg(a, 0, 0.6)), ny = lerp(-H - 200, top, slideIn);
  const body = `${two(rr(-330, 0, 660, H, 22), "#6fe3a1", "#3fbf7a", 8, 7)}<path d="${rr(-302, 26, 604, H - 52, 14)}" fill="none" stroke="#2b9a5e" stroke-width="6"/>${disc(0, 150, 86, "#5fd391", "#2b9a5e")}${text(0, 180, "$", 86, "#1f6a40")}`
    + groups.map((gr, i) => number(0, 330 + i * 170 + 40, gr + (i < rows - 1 ? "," : ""), 150, "#1f6a40")).join("");
  const nt = at(540, ny, body);
  const g = night("#3b1d74") + layer(stars(17, 90, -400, 1500, 2600, tot), c, 0.2) + layer(nt, c);
  return { g, in: toScreen(c, 540, ny + 150), inC: "#6fe3a1", inZ: 16, out: toScreen(c, 540, ny + 150), outC: "#6fe3a1", outZ: 16 };
}
// ---- 8: and it would not buy a bus ticket; the bus leaves ----
function v8(a, tot) {
  const c = camAt(a, [[0, 540, 1080, 0.95], [1.5, 560, 1060, 0.9]]), G = 1380, M = [700, G];
  const push = kf(a, [[0, -1200], [0.42, 640], [0.6, 600], [1.5, 560]]), busX = lerp(560, 2100, easeIn(seg(a, 0.8, 1.5)));
  const machine = at(M[0], G, `${two(rr(-110, -420, 220, 420, 18), P.teal, P.tealD, 12, 0)}<path d="${rr(-80, -390, 160, 110, 12)}" fill="${P.ink}"/>${a > 0.47 ? text(0, -310, "✗", 80, P.red) : text(0, -310, "1 $", 50, P.green)}<path d="${rr(-70, -230, 140, 16, 8)}" fill="${P.ink}"/>`, 1.3);
  const nt = at(push, G - 300, `${two(rr(-900, -60, 900, 120, 10), "#6fe3a1", "#3fbf7a", 5, 5)}${number(-450, 22, "100,000,000,000,000", 56, "#1f6a40")}`, 0.72, a > 0.47 ? -4 * Math.exp(-(a - 0.47) * 6) * Math.sin((a - 0.47) * 40) : 0);
  const busG = G - 520;
  const main = `<rect x="-400" y="${G}" width="2200" height="700" fill="${P.road}"/><rect x="-400" y="${G}" width="2200" height="14" fill="#3a2a7a"/>`
    + `<rect x="-400" y="${busG}" width="2200" height="40" fill="${P.road}"/>` + at(busX, busG, bus(), 1.05) + at(960, G, `<rect x="-8" y="-420" width="16" height="420" fill="${P.ink}"/>${disc(0, -440, 44, P.gold, P.goldD)}`) + machine + nt;
  const g = night() + layer(stars(23, 90, -200, 1300, 900, tot) + skyline(31, -300, 1400, busG - 20, 140, 460, "#221a5c", "#ffb066"), c, 0.4) + layer(main, c);
  return { g, in: toScreen(c, 300, G - 300), inC: "#6fe3a1", inZ: 16 };
}

export const VSHOTS = [v0, v1, v2, v3, v4, v5, v6, v7, v8];
