// "Money": fourteen shots, one per beat of the money scene, from barter to numbers on a screen. Nothing to read but
// dates and amounts. Each shot is built from the meaning of its line (see episodes/.../explain-crypto-01-world/shots.md).
//   0 a fish for a loaf          1 the baker shuts up shop, the plate stays empty   2 salt, shells, a stone the size of a car, a crane
//   3 gold: rare, keeps, cannot be faked   4 gold left in a strongbox, the receipt goes round the market and becomes paper
//   5 1971: the gold slides out from behind the note   6 the press prints at will   7 one note, a hundred trillion
//   8 it does not buy a bus ticket   9 most notes turn into digits on a screen   10 the town at night: every window a cell
//   11–13 the three jobs: pay, price, save; then all three go into a file
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, play, frame, setFrame } from "./kit.js";
import { VSHOTS } from "./money.v.js";
import { P, mix, fmt, house, coin, note, stars, skyline, clouds, dusk } from "./bank.js";
import { calPage, calFlip, banknote, padlock, press, jar, folder, tag, stall, fish, loaf, goldBar, monitor, car, bus, hills, pedestal } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const hopTo = (from, to, p, h = 160) => bez(from, [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - h], to, ease(p));
const ground = (G, x0 = -900, x1 = 4900, fill = P.ground) => `<rect x="${x0}" y="${G}" width="${x1 - x0}" height="800" fill="${fill}"/>`;
const sea = (G, x0, x1, tot) => `<rect x="${x0}" y="${G}" width="${x1 - x0}" height="800" fill="#1d6fb8"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${x0 + i * (x1 - x0) / 10 + 30 * Math.sin(tot + i)} ${G + 40 + (i % 3) * 50}h90" stroke="#5fb6ff" stroke-width="8" stroke-linecap="round" opacity=".6"/>`).join("")}`;
const market = (c, tot) => dusk(c, tot, 1500, 760) + layer(hills(7, -900, 3000, 760, 120, "#6a2f86"), c, 0.3) + layer(hills(19, -900, 3200, 820, 80, "#4f2380"), c, 0.6);

// ---- 0: a fish for a loaf ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1], [3.9, 960, 560, 1.08]]), G = 900, B = [540, G], K = [1380, G], S = 1.5;
  const fy = (p) => hopTo([B[0], G - 250], [K[0] - 40, G - 250], p, 260), ly = (p) => hopTo([K[0], G - 240], [B[0] + 40, G - 240], p, 300);
  const pf = seg(a, 2.75, 3.3), pl = seg(a, 2.95, 3.5), wag = Math.sin(tot * 9) * (a > 0.9 && a < 1.6 ? 1 : 0.2);
  const f = fy(pf), l = ly(pl), land = (t0) => (a > t0 ? 1 - 0.1 * Math.exp(-(a - t0) * 9) * Math.cos((a - t0) * 16) : 1);
  const main = ground(G) + at(B[0], G, stall(P.blue, P.blueD), S) + at(K[0], G, stall(P.pink, P.pinkD), S)
    + at(l[0], l[1], loaf(), [1.6, 1.6 * land(3.5)], 360 * ease(pl)) + at(f[0], f[1], fish(wag), [1.6 * (pf > 0.5 ? -1 : 1), 1.6 * land(3.3)], pf > 0 && pf < 1 ? -30 + 60 * pf : 0)
    + (a > 3.3 ? rings(K[0], G - 260, 180 * spring(a - 3.3, 7, 11), P.gold, 0.14 * (1 - seg(a, 3.6, 3.9))) : "");
  const g = market(c, tot) + layer(main, c);
  return { g, out: toScreen(c, B[0] + 40, G - 270), outC: "#f0a65a", outZ: 20 };
}
// ---- 1: the baker does not want fish; the shutter comes down, the plate stays empty ----
function s1(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.0], [3.3, 880, 560, 1.06]]), G = 900, B = [420, G], K = [1240, G], S = 1.5;
  const out = ease(seg(a, 0.25, 0.9)), back = ease(seg(a, 1.6, 2.1)), fx = lerp(lerp(B[0], K[0] - 360, out), B[0], back), fy = G - 250 - 160 * Math.sin(Math.PI * out) * (1 - back) - 120 * Math.sin(Math.PI * back);
  const sh = kf(a, [[1.32, 0], [1.55, 1.04], [1.66, 0.96], [1.75, 1]], easeIn), shake = a > 1.55 ? 8 * Math.exp(-(a - 1.55) * 8) * Math.sin((a - 1.55) * 50) : 0;
  const plate = a > 2.45 ? at(B[0] + 20 + 4 * Math.sin(a * 60) * Math.exp(-(a - 2.6) * 2) * (a > 2.6 ? 1 : 0), G - 205 - 300 * (1 - easeOut(seg(a, 2.45, 2.62))), `<g transform="scale(1.5)"><ellipse rx="120" ry="26" fill="#fffaf0"/><ellipse rx="80" ry="15" fill="#e9e1d1"/><path d="M140 -6h70M160 -16v20M180 -16v20" stroke="${P.steel}" stroke-width="7" stroke-linecap="round"/></g>`) : "";
  const growl = a > 2.75 ? [0, 1, 2].map((i) => drawn(`M${B[0] + 330 + i * 40} ${G - 330 - i * 30}q-24 -24 0 -48q24 -24 0 -48`, seg(a, 2.75 + i * 0.1, 2.95 + i * 0.1), "#cfc6ff", 6)).join("") : "";
  const main = ground(G) + at(B[0], G, stall(P.blue, P.blueD), S) + at(K[0] + shake, G, (sh < 0.95 ? at(0, -160, loaf()) : "") + stall(P.pink, P.pinkD, sh), S) + plate + growl
    + at(fx, fy, fish(Math.sin(tot * 9)), 1.6, back > 0 ? -40 * Math.sin(Math.PI * back) : 0);
  const g = market(c, tot) + layer(main, c);
  return { g, in: toScreen(c, K[0], G - 250), inC: "#f0a65a", inZ: 20, out: toScreen(c, B[0] + 20, G - 205), outC: "#fffaf0", outZ: 20 };
}
// ---- 2: salt, shells, and on an island a stone as big as a car: a wallet that needs a crane ----
function s2(a, tot) {
  const c = camAt(a, [[0, 680, 560, 1.08], [1.5, 720, 560, 1.08], [2.25, 1300, 540, 1.04], [3.2, 2350, 560, 0.95], [3.75, 2700, 560, 1.12], [5.0, 2740, 520, 1.05], [6.4, 2760, 500, 1.0]]), G = 860, IS = 2700;
  const salt = at(700, G - 180, `${two("M-80 0Q-96 -150 -50 -190L-60 -210H60L50 -190Q96 -150 80 0Z", P.cream, P.creamD, 0, 10)}<path d="M-56 -206Q0 -180 56 -206" stroke="${P.wood}" stroke-width="10" fill="none"/>${[[-30, -230], [0, -244], [26, -228], [-8, -224]].map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="16" rx="3" fill="#fff" transform="rotate(20 ${x} ${y})"/>`).join("")}`, [1.6 * pop(a - 1.69), 1.6 * pop(a - 1.69)]);
  const shells = at(1300, G - 420, `<g transform="scale(1.6)"><path d="M-150 0Q0 70 150 0" stroke="${P.wood}" stroke-width="6" fill="none"/>${[-120, -60, 0, 60, 120].map((x, i) => at(x, 30 - Math.abs(x) * 0.18 + 6 * Math.sin(tot * 2 + i), `${two("M0 -28Q32 -24 30 6Q20 30 0 30Q-20 30 -30 6Q-32 -24 0 -28Z", "#ffe0ec", "#f0a8c4", 0, 6)}<path d="M0 -24V26M-16 -16L-8 24M16 -16L8 24" stroke="#f0a8c4" stroke-width="4"/>`, pop(a - 2.33 - i * 0.05))).join("")}</g>`);
  const crates = at(700, G, two(rr(-180, -180, 360, 180, 8), P.wood, P.woodD, 0, 12)) + at(1300, G, `<rect x="-250" y="-460" width="18" height="460" fill="${P.woodD}"/><rect x="232" y="-460" width="18" height="460" fill="${P.woodD}"/>`);
  // the island, the stone, the car beside it for size, and the crane that comes for it
  const st = pop(a - 3.77, 7, 12), lift = easeOut(seg(a, 5.55, 6.4)) * 260, swing = a > 5.55 ? 4 * Math.sin((a - 5.55) * 6) * Math.exp(-(a - 5.55) * 2) : 0, hookY = kf(a, [[4.9, -700], [5.45, G - 530], [5.55, G - 520]]) - lift;
  const stone = at(IS - 60, G - 40 - 260 - lift, `<g transform="rotate(${swing})">${two(circ(0, 0, 250), "#c9b9a0", "#9e8c74", 14, 12)}<circle r="62" fill="${mix("#1d6fb8", P.sky1, 0.5)}"/>${[[-120, -90], [100, 120], [140, -60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#9e8c74"/>`).join("")}</g>`, [st, st]);
  const crane = a > 4.9 ? `<path d="M${IS - 60} ${hookY - 230}V-900" stroke="${P.ink}" stroke-width="8"/>${lift > 0 || a > 5.45 ? `<path d="M${IS - 60} ${hookY - 230}L${IS - 60} ${G - 40 - 260 - lift - 62}" stroke="${P.ink}" stroke-width="8"/>` : ""}<path d="M${IS - 90} ${hookY - 230}h60v30h-60Z" fill="${P.gold}"/>` : "";
  const island = sea(G, 1800, 4400, tot) + `<path d="M${IS - 420} ${G + 30}Q${IS - 380} ${G - 60} ${IS - 200} ${G - 50}H${IS + 300}Q${IS + 420} ${G - 50} ${IS + 460} ${G + 30}Z" fill="#e8c88a"/>`
    + at(IS + 300, G - 40, `<rect x="-10" y="-300" width="20" height="300" fill="${P.woodD}"/>${[0, 1, 2, 3].map((i) => `<path d="M0 -300q${(i < 2 ? -1 : 1) * 120} ${-40 + (i % 2) * 70} ${(i < 2 ? -1 : 1) * 200} ${30 + (i % 2) * 40}" stroke="#2fb26a" stroke-width="30" fill="none" stroke-linecap="round"/>`).join("")}`)
    + at(IS + 230, G - 40, car(), [1.7 * pop(a - 4.24), 1.7 * pop(a - 4.24) * (a > 5.6 ? 1 + 0.05 * Math.sin(a * 30) * Math.exp(-(a - 5.6) * 4) : 1)]);
  const main = ground(G, -900, 1900) + crates + salt + shells + island + stone + crane;
  const g = market(c, tot) + layer(main, c);
  return { g, in: toScreen(c, 700, G - 330), inC: P.cream, inZ: 20 };
}
// ---- 3: gold. Rare, it keeps, and a fake one cracks ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [1.5, 960, 540, 1.0], [2.0, 960, 520, 1.08], [4.3, 960, 520, 1.12]]);
  const drop = a < 1.55 ? -900 : lerp(-700, 0, easeIn(seg(a, 1.55, 1.8))), land = a > 1.8 ? spring(a - 1.8, 8, 14) : 0, sx = 1 + 0.25 * (1 - land) * (a > 1.8 ? 1 : 0);
  // what came before goes round and makes room: fish, salt, a shell, a stone
  const ring = [["fish", 0], ["salt", 1], ["shell", 2], ["stone", 3]].map(([w, i]) => { const ang = a * 0.7 + i * Math.PI / 2, r = lerp(300, 1300, easeIn(seg(a, 1.3, 1.9))), x = 960 + Math.cos(ang) * r * 1.4, y = 500 + Math.sin(ang) * r * 0.75;
    const inner = w === "fish" ? `<path d="M-40 0Q-10 -26 24 -14Q36 0 24 14Q-10 26 -40 0Z" fill="${P.blue}"/>` : w === "salt" ? `<path d="M-30 30Q-36 -20 -18 -40H18Q36 -20 30 30Z" fill="${P.cream}"/>` : w === "shell" ? `<path d="M0 -26Q30 -22 28 6Q18 28 0 28Q-18 28 -28 6Q-30 -22 0 -26Z" fill="#ffe0ec"/>` : `<circle r="34" fill="#c9b9a0"/><circle r="10" fill="${P.night1}"/>`;
    return at(x, y, inner, 2.4 * pop(a + 0.3 - i * 0.12)); }).join("");
  const shine = a > 2.0 ? `<clipPath id="gshine"><circle r="160"/></clipPath><g clip-path="url(#gshine)"><path d="M${-260 + ((a - 2.0) * 300) % 700} -200l60 0l-200 400l-60 0Z" fill="#fff" opacity=".35"/></g>` : "";
  const big = at(960, 470 + drop, `${rings(0, 0, 220, P.gold, 0.18 * land)}<g transform="scale(${sx} ${1 / sx})">${disc(0, 0, 160, P.gold, P.goldD)}<circle r="118" fill="none" stroke="${P.goldD}" stroke-width="14"/>${shine}</g>`);
  // rare: a heap of grey rock with one glint in it
  const rare = at(400, 940, `<g transform="scale(1.35)">${[[-120, 0, 90], [0, -10, 120], [120, 0, 90], [-60, -110, 80], [60, -110, 80], [0, -190, 70]].map(([x, y, r]) => disc(x, y, r, "#8a86a8", "#6b6790")).join("")}${rings(30, -120, 30 * (1 + 0.3 * Math.sin(tot * 6)), P.gold, 0.4)}${disc(30, -120, 16, P.gold, P.goldD)}</g>`, pop(a - 2.17));
  // it keeps: a loaf beside it goes green
  const mould = seg(a, 2.75, 3.4), keep = at(1500, 420, loaf(mould) + (mould > 0.6 ? [0, 1].map((i) => at(40 * Math.cos(tot * 7 + i * 3), -100 + 30 * Math.sin(tot * 9 + i * 2), `<circle r="7" fill="${P.ink}"/><ellipse cx="-6" cy="-8" rx="8" ry="5" fill="#cfc6ff"/><ellipse cx="6" cy="-8" rx="8" ry="5" fill="#cfc6ff"/>`)).join("") : ""), 2.0 * pop(a - 2.6));
  // hard to fake: a grey coin comes in, takes a bite and cracks in two
  const fa = a - 3.54, crack = seg(a, 3.95, 4.2), fake = fa > 0 ? at(1460, 820, `<g transform="translate(${-40 * crack} ${30 * crack * crack}) rotate(${-20 * crack})"><clipPath id="fkL"><path d="M-80 -80H4L-10 -20L10 20L-4 80H-80Z"/></clipPath><g clip-path="url(#fkL)">${disc(0, 0, 70, "#b8b4c8", "#8a86a8")}</g></g>
    <g transform="translate(${40 * crack} ${30 * crack * crack}) rotate(${20 * crack})"><clipPath id="fkR"><path d="M80 -80H4L-10 -20L10 20L-4 80H80Z"/></clipPath><g clip-path="url(#fkR)">${disc(0, 0, 70, "#b8b4c8", "#8a86a8")}</g></g>${a > 3.8 ? `<circle cx="54" cy="-50" r="26" fill="${P.night1}"/>` : ""}${crack > 0 ? cross(0, -130, 34, P.red, a - 4.0) : ""}`, 1.6 * pop(fa)) : "";
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(3, 50, -200, 2100, 1080, tot), c, 0.2) + layer(rings(960, 470, 420, P.violet, 0.12 * land, 1.5), c, 0.5) + layer(ring + rare + keep + fake + big, c);
  return { g, in: [960, 540], inC: P.ink, inZ: 12, out: toScreen(c, 960, 470), outC: P.gold, outZ: 18 };
}
// ---- 4: gold is heavy; it goes into a strongbox, a receipt comes out and goes round the market as paper ----
function s4(a, tot) {
  const c = camAt(a, [[0, 640, 590, 1.22], [0.9, 660, 590, 1.22], [1.9, 860, 580, 1.25], [2.9, 980, 590, 1.3], [3.5, 1250, 600, 1.28], [4.6, 1800, 600, 1.28], [5.9, 1900, 590, 1.32]]), G = 860, SC = [380, G], SH = [900, G];
  const sink = kf(a, [[0.2, 0], [0.42, 1.15], [0.55, 0.95], [0.66, 1]]), slide = ease(seg(a, 0.95, 1.9)), sackX = lerp(SC[0] + 90, SH[0], slide), sackY = lerp(G - 150 + 40 * sink, G - 80, slide) - 40 * Math.sin(Math.PI * slide);
  const scale = at(SC[0], G, `<path d="M-14 0h28l-6 -220h-16Z" fill="${P.steelD}"/><path d="M-150 ${-220 + 20 * sink}L150 ${-220 - 20 * sink}" stroke="${P.steel}" stroke-width="12" stroke-linecap="round"/>
    ${[[-150, 20], [150, -20]].map(([x, d]) => `<path d="M${x} ${-220 + d * sink}l-50 70h100Z" fill="none" stroke="${P.steel}" stroke-width="5"/><path d="M${x - 70} ${-150 + d * sink}h140l-14 16h-112Z" fill="${P.steel}"/>`).join("")}${slide < 0.3 ? "" : at(150, -160 + 20 * sink - 20, `<rect x="-30" y="-16" width="60" height="16" rx="4" fill="#8a86a8"/>`)}`);
  const sack = slide < 1 ? at(sackX - 90 * (1 - slide) * 0, sackY, `${two("M-80 0Q-100 -110 -36 -130L-50 -160H50L36 -130Q100 -110 80 0Z", "#b07b4f", "#8a5a36", 0, 10)}${disc(0, -60, 32, P.gold, P.goldD)}${text(0, -46, "$", 40, "#8a5200")}`, [1 + 0.08 * sink * (1 - slide), 1 - 0.08 * sink * (1 - slide)]) : "";
  const shut = ease(seg(a, 1.85, 2.05)), lockA = a - 2.05;
  const shop = at(SH[0], G, `${two(rr(-200, -380, 400, 380, 8), "#3a4a8f", "#2c366f", 14, 0)}${two("M-230 -380L0 -470L230 -380Z", P.violetD, P.ink, 0, 10)}
    <path d="M-80 0V-200H80V0Z" fill="${P.ink}"/><path d="M-80 0V${-200 + 200 * (1 - shut)}H80V0Z" fill="#5d678f" transform="translate(0 ${-200 * (1 - shut) * 0})"/><path d="${rr(-80, -200, 160, 200 * shut, 0)}" fill="#5d678f"/>
    ${disc(0, -300, 46, P.gold, P.goldD)}${text(0, -282, "$", 56, "#8a5200")}<path d="${rr(120, -150, 50, 14, 4)}" fill="${P.ink}"/>${lockA > 0 ? at(0, -110, padlock(0.7, 0), pop(lockA)) : ""}`);
  // the receipt: out of the slot, then from stall to stall, and it ends up a banknote
  const stalls = [[1250, P.teal, P.tealD], [1600, P.pink, P.pinkD], [1950, P.blue, P.blueD]].map(([x, col, colD]) => at(x, G, two(rr(-120, -110, 240, 110, 8), col, colD, 0, 10) + `<path d="M-140 -260h280l-20 40h-240Z" fill="${col}"/><rect x="-120" y="-220" width="12" height="110" fill="${P.woodD}"/><rect x="108" y="-220" width="12" height="110" fill="${P.woodD}"/>`)).join("");
  const stops = [[SH[0] + 145, G - 143], [1250, G - 150], [1600, G - 150], [1950, G - 150]], times = [2.9, 3.45, 4.0, 4.6];
  let rcpt = "";
  if (a > 2.9) { let p = [SH[0] + 145, G - 143], i = 0; for (; i < 3; i++) if (a >= times[i + 1]) p = stops[i + 1]; else break;
    if (i < 3 && a > times[i] + 0.12) { const q = seg(a, times[i] + 0.12, times[i + 1]); p = hopTo(stops[i], stops[i + 1], q, 150); }
    const grow = ease(seg(a, 5.0, 5.4)), slip = `${two(rr(-46, -30, 92, 60, 6), P.cream, P.creamD, 0, 6)}<path d="M-30 -10h44M-30 6h60" stroke="#c9b48a" stroke-width="6" stroke-linecap="round"/>${disc(26, 14, 12, P.red, P.redD)}`;
    rcpt = at(p[0], p[1] - 80 * grow, grow < 0.5 ? slip : banknote(1), [lerp(1.6, 2.2, grow) * Math.max(0.05, Math.abs(Math.cos(Math.PI * grow))), lerp(1.6, 2.2, grow)] .map((v, j) => (j === 0 ? v : v * pop(a - 2.9))), 0); }
  const main = ground(G) + scale + stalls + shop + sack + rcpt;
  const g = market(c, tot) + layer(main, c);
  return { g, in: toScreen(c, SC[0], G - 220), inC: P.gold, inZ: 18, out: toScreen(c, 1950, G - 230), outC: "#6fe3a1", outZ: 20 };
}
// ---- 5: 1971, the gold slides out from behind the note; the note stays up on its own ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1000, 520, 1.0], [4.1, 1000, 520, 1.06]]);
  const out = easeIn(seg(a, 1.41, 2.3)), wob = a > 2.2 ? 9 * Math.exp(-(a - 2.2) * 2.4) * Math.sin((a - 2.2) * 9) : 0, bob = 8 * Math.sin(tot * 1.5);
  const bar = at(1060, 760 + out * 900, `${rings(0, -200, 300, P.gold, 0.16 * (1 - out))}${goldBar(2.6)}<path d="M-230 0h460" stroke="${P.goldD}" stroke-width="10"/>`, 1, out * 25);
  const noteK = 3.2, nt = at(1060, 470 + bob * seg(a, 2.6, 3.2), banknote(noteK), 1, wob);
  const pit = `<ellipse cx="1060" cy="1040" rx="420" ry="60" fill="#0a0726"/>`;
  const cal = at(1600, 230, calPage("1971", "", 0.95, 150), pop(a - 0.29));
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(13, 60, -200, 2100, 1080, tot), c, 0.2) + layer(pit + bar + nt + cal, c);
  return { g, in: toScreen(c, 1060, 470), inC: "#6fe3a1", inZ: 20 };
}
// ---- 6: whoever holds the press prints as much as he likes ----
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.3], [3.9, 960, 560, 1.12]]), G = 940;
  // the plate goes up and down faster and faster: phase is the integral of a rising rate
  const rate = (t) => 0.9 + 2.2 * t, ph = 0.9 * a + 1.1 * a * a, cyc = ph % 1, stamp = cyc < 0.3 ? Math.sin(Math.PI * cyc / 0.3) : 0, n = Math.floor(ph);
  const stackH = (side) => Math.min(560, n * 30 * (side ? 1 : 0.9)), stack = (x, h) => Array.from({ length: Math.floor(h / 16) }, (_, i) => at(x + 4 * Math.sin(i * 1.7), G - 10 - i * 16, `<path d="${rr(-100, -8, 200, 16, 4)}" fill="${i % 2 ? "#6fe3a1" : "#5fd391"}"/><path d="M-100 8h200" stroke="#3fbf7a" stroke-width="3"/>`)).join("");
  const flying = [0, 1].map((j) => { const u = cyc - 0.3 - j * 0; if (u < 0) return ""; const side = n % 2, x0 = 960, x1 = side ? 1480 : 440, p = clamp(u / 0.6), b = hopTo([x0, G - 160], [x1, G - 30 - stackH(side)], p, 260); return at(b[0], b[1], banknote(1.5), 1, (side ? 1 : -1) * 360 * p * 0); }).join("");
  const main = `<rect x="-300" y="${G}" width="2500" height="400" fill="#2c1a66"/>` + stack(440, stackH(0)) + stack(1480, stackH(1)) + at(960, G, press(stamp, { lamp: Math.min(3, a * 1.2) }), 1.45) + flying
    + (a > 2.74 ? at(330, 300, calPage("2009", "", 0.85, 150), pop(a - 2.74)) : "");
  const g = `<rect width="1920" height="1080" fill="#3b1d74"/>` + layer(`<path d="M600 -200L960 300L1320 -200Z" fill="#ffd98a" opacity=".08"/>` + skyline(61, -300, 2300, 700, 80, 300, "#4a2690"), c, 0.4) + layer(main, c);
  return { g, out: toScreen(c, 960, G - 160), outC: "#6fe3a1", outZ: 16 };
}
// ---- 7: one note, a hundred trillion ----
function s7(a, tot) {
  const zeros = Math.round(kf(a, [[1.0, 0], [2.3, 14]], (p) => p)), str = "1" + "0".repeat(zeros), grp = str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const len = 640 + grp.length * 52 * (zeros > 0 ? 1 : 0.6), x0 = 300, z = clamp(1700 / (len + 300), 0.8, 1.3);
  const c = { x: x0 + len / 2 - 40, y: 540, z: lerp(1.3, z, ease(seg(a, 0.3, 2.4))) };
  const slideIn = easeOut(seg(a, 0, 0.6)), nx = lerp(-len, x0, slideIn);
  const nt = at(nx, 540, `${two(rr(0, -150, len, 300, 18), "#6fe3a1", "#3fbf7a", 8, 7)}<path d="${rr(20, -128, len - 40, 256, 12)}" fill="none" stroke="#2b9a5e" stroke-width="6"/>${disc(130, 0, 80, "#5fd391", "#2b9a5e")}${text(130, 28, "$", 80, "#1f7a48")}
    ${number(260 + grp.length * 25, 40, grp, 110, "#1f6a40")}`);
  const g = `<rect width="1920" height="1080" fill="#3b1d74"/>` + layer(stars(17, 50, -400, 3000, 1080, tot), c, 0.2) + layer(nt, c);
  return { g, in: toScreen(c, nx + 130, 540), inC: "#6fe3a1", inZ: 16, out: toScreen(c, nx + 130, 540), outC: "#6fe3a1", outZ: 16 };
}
// ---- 8: and it would not buy a bus ticket ----
function s8(a, tot) {
  const c = camAt(a, [[0, 920, 600, 1.2], [1.5, 1000, 590, 1.12]]), G = 880, M = [820, G];
  const push = kf(a, [[0, -900], [0.42, 560], [0.6, 440], [1.5, 300]]), busX = lerp(1250, 2900, easeIn(seg(a, 0.8, 1.5)));
  const machine = at(M[0], G, `${two(rr(-110, -420, 220, 420, 18), P.teal, P.tealD, 12, 0)}<path d="${rr(-80, -390, 160, 110, 12)}" fill="${P.ink}"/>${a > 0.47 ? text(0, -310, "✗", 80, P.red) : text(0, -310, "1 $", 50, P.green)}<path d="${rr(-70, -240, 140, 20, 8)}" fill="${P.ink}"/><path d="${rr(-50, -140, 100, 16, 6)}" fill="${P.ink}"/>`);
  const nt = at(push, G - 230, `${two(rr(-900, -60, 900, 120, 10), "#6fe3a1", "#3fbf7a", 5, 5)}${number(-450, 22, "100,000,000,000,000", 56, "#1f6a40")}`, 1, a > 0.47 ? -4 * Math.exp(-(a - 0.47) * 6) * Math.sin((a - 0.47) * 40) : 0);
  const main = `<rect x="-400" y="${G}" width="3000" height="400" fill="${P.road}"/><rect x="-400" y="${G}" width="3000" height="14" fill="#3a2a7a"/>` + at(1560, G, `<rect x="-8" y="-420" width="16" height="420" fill="${P.ink}"/>${disc(0, -440, 44, P.gold, P.goldD)}`) + at(busX, G, bus()) + machine + nt + (a > 0.47 ? cross(M[0], G - 520, 56, P.red, a - 0.47) : "");
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(23, 60, -200, 2200, 700, tot) + skyline(31, -300, 2400, G - 20, 100, 330, "#221a5c", "#ffb066"), c, 0.4) + layer(main, c);
  return { g, in: toScreen(c, 300, G - 230), inC: "#6fe3a1", inZ: 16 };
}
// ---- 9: most of their money is not paper at all: numbers on a screen ----
function s9(a, tot) {
  const c = camAt(a, [[0, 960, 590, 1.2], [2.6, 1000, 580, 1.22], [3.55, 1300, 520, 1.45]]), G = 900, SX = 1330, N = 10;
  let notes = "", digits = "";
  const glyph = (i) => String((i * 7 + 3) % 10);
  for (let i = N - 1; i >= 0; i--) { const y = G - 40 - i * 52, t0 = 1.13 + (N - 1 - i) * 0.16, u = a - t0, keep = i === 0;
    if (keep || u < 0) { notes += at(600, y, banknote(2.6), 1, (i % 3 - 1) * 2); continue; }
    if (u < 0.18) { notes += at(600, y - 40 * (u / 0.18), banknote(2.6), [Math.max(0.05, Math.cos(Math.PI / 2 * u / 0.18)), 1]); continue; }
    const p = seg(u, 0.18, 0.75), row = Math.floor((N - 1 - i) / 3), col = (N - 1 - i) % 3, to = [SX - 150 + col * 150, 290 + row * 104], b = bez([600, y - 40], [900, 120], to, ease(p));
    digits += at(b[0], b[1], (p < 1 ? rings(0, -24, 34, P.gold, 0.3) : "") + text(0, 0, glyph(i), lerp(110, 96, p), p < 1 ? "#fff3c2" : P.green)); }
  const glow = seg(a, 2.55, 2.9);
  const scr = at(SX, G, monitor(mix("#10284f", "#123a5c", glow), "") + (glow > 0 ? rings(0, -260, 200, P.teal, 0.12 * glow) : ""), 1.5);
  const main = `<rect x="-400" y="${G}" width="3000" height="400" fill="${P.wood}"/><rect x="-400" y="${G + 20}" width="3000" height="400" fill="${P.woodD}"/>` + scr + notes + digits;
  const g = `<rect width="1920" height="1080" fill="#4a2b8a"/>` + layer(`<rect x="-400" y="-300" width="3000" height="1200" fill="#4a2b8a"/>` + `<path d="${rr(120, 120, 360, 300, 14)}" fill="${P.ink}"/><path d="${rr(140, 140, 320, 260, 8)}" fill="${P.night1}"/>` + stars(41, 10, 150, 450, 380, tot), c, 0.6) + layer(main, c);
  return { g, out: toScreen(c, SX, G - 390), outC: "#123a5c", outZ: 16 };
}
// ---- 10: the town at night: every window is a cell with a number in it, and everyone sleeps soundly ----
function s10(a, tot) {
  const z = kf(a, [[0, 5.2], [1.4, 1.0], [4.4, 0.97]]), c = { x: kf(a, [[0, 820], [1.4, 860], [4.4, 860]]), y: kf(a, [[0, 470], [1.4, 520], [4.4, 520]]), z }, G = 860;
  let town = "", cells = "";
  const fronts = [[P.blue, P.blueD], [P.violet, P.violetD], [P.pink, P.pinkD], [P.teal, P.tealD]];
  for (let i = 0; i < 9; i++) { const x = 90 + i * 225, h = 300 + rnd(i * 5 + 2) * 260, f = fronts[i % 4];
    town += at(x, G, two(rr(-95, -h, 190, h, 8), f[0], f[1], 14, 0));
    for (let r = 0; r < Math.floor((h - 60) / 82); r++) for (let q = 0; q < 2; q++) { const wx = x - 66 + q * 76, wy = G - h + 30 + r * 82, d = String(Math.floor(rnd(i * 97 + r * 13 + q) * 10)), ch = a > 0.6 + rnd(i * 7 + r + q) * 0.8 ? d : rnd(i + r * 3 + q + Math.floor(tot * 8)) > 0.5 ? "1" : "0";
      cells += `<rect x="${wx}" y="${wy}" width="56" height="62" rx="6" fill="${P.win}"/>` + text(wx + 28, wy + 50, ch, 46, "#8a3a10"); } }
  // the windows join up into one table across the sky
  const grid = seg(a, 2.39, 3.0), lines = grid > 0 ? Array.from({ length: 9 }, (_, i) => drawn(`M-100 ${200 + i * 82}H2000`, grid - i * 0.04, "#ffd98a", 3, 'opacity=".45"')).join("") + Array.from({ length: 22 }, (_, i) => drawn(`M${-30 + i * 92} 120V${G}`, grid - i * 0.02, "#ffd98a", 3, 'opacity=".35"')).join("") : "";
  const zz = a > 3.46 ? [200, 650, 1100, 1380].map((x, i) => [0, 1, 2].map((j) => { const u = ((a - 3.46 - i * 0.12) * 0.9 + j / 3) % 1; return a - 3.46 - i * 0.12 > j * 0.25 ? text(x + 40 * u + 10 * Math.sin(tot * 2 + j), 520 - 160 * u, "z", 30 + 14 * j, P.cream, { opacity: (0.9 * (1 - u)).toFixed(2) }) : ""; }).join("")).join("") : "";
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(29, 70, -400, 2400, 700, tot) + `<circle cx="1500" cy="160" r="56" fill="${P.cream}"/><circle cx="1480" cy="146" r="50" fill="${P.night0}"/>`, c, 0.15) + layer(lines, c, 0.5)
    + layer(`<rect x="-500" y="${G}" width="3000" height="500" fill="#141a45"/>` + town + cells + zz, c);
  return { g, in: [960, 540], inC: "#123a5c", inZ: 12 };
}
// ---- 11–13: three jobs on three pedestals, one camera across all three beats ----
const PX = [520, 960, 1400], PG = 880;
function jobs(t, c, tot, s) {
  const on = (i) => (t > 1.6 + i * 0.14 ? spring(t - 1.6 - i * 0.14, 7, 11) : 0), T2 = (s.ends || [])[11] || 3.09, T3 = T2 + ((s.ends || [])[12] || 1.11), filing = seg(t, T3 + 1.0, T3 + 1.6);
  const into = (i, inner, x, y) => { const p = ease(seg(filing, i * 0.15, 0.6 + i * 0.15)), b = bez([x, y], [(x + 960) / 2, 200], [960, 560], p); return at(b[0], b[1], inner, 1.5 * (1 - 0.6 * p)); };
  // pay: a coin goes into the shop's slot, a bag of bread comes out
  const cu = t - 2.45, cy = cu < 0 ? -600 : lerp(PG - 420, PG - 250, easeIn(seg(cu, 0, 0.22))), bagA = t - 2.7;
  const shop = `${two(rr(-110, -250, 220, 150, 14), P.blue, P.blueD, 10, 0)}<path d="M-120 -250h240l-20 -40h-200Z" fill="${P.cream}"/><path d="${rr(-40, -240, 80, 12, 6)}" fill="${P.ink}"/>`
    + (cu > 0 && cu < 0.26 ? at(0, cy - PG, coin(30)) : "") + (bagA > 0 ? at(-150 * easeOut(seg(bagA, 0, 0.3)), -120 - 60 * Math.sin(Math.PI * seg(bagA, 0, 0.3)), `${two("M-40 0L-46 -80H46L40 0Z", "#d9b27a", "#b98f58", 0, 6)}<path d="M-20 -80q-10 -40 10 -50M10 -80q4 -44 20 -46" stroke="#f0a65a" stroke-width="16" stroke-linecap="round" fill="none"/>`, pop(bagA)) : "");
  // price: a tag flips onto a fish
  const ta = t - T2, tagged = `${fish()}${ta > 0 ? at(10, -90, tag("3"), [Math.max(0.05, Math.abs(Math.cos(Math.PI * (1 - seg(ta, 0, 0.3))))) * pop(ta), pop(ta)], -10) : ""}`;
  // save: coins drop into a jar under a rising moon
  const ja = t - T3, fill = clamp(ja / 0.9), drops = ja > 0 && ja < 1.0 ? [0, 1, 2].map((i) => { const u = (ja - i * 0.25) / 0.3; return u > 0 && u < 1 ? at(0, -420 + 300 * easeIn(u), coin(18)) : ""; }).join("") : "";
  const moon = ja > -0.2 ? at(PX[2] + 170, lerp(PG - 300, PG - 700, easeOut(seg(ja, 0, 1.2))), `${rings(0, 0, 60, P.cream, 0.15)}<circle r="44" fill="${P.cream}"/><circle cx="-16" cy="-12" r="40" fill="#3b1d74"/>`) : "";
  const objs = [[shop, PX[0], PG + 18], [tagged, PX[1], PG - 200], [jar(fill) + drops, PX[2], PG - 130]];
  let out = moon + PX.map((x, i) => at(x, PG, pedestal(on(i), [P.blue, P.gold, P.pink][i], [P.blueD, P.goldD, P.pinkD][i]), [1.3, 1.3 * pop(t - 0.1 - i * 0.12, 7, 11)])).join("");
  objs.forEach(([inner, x, y], i) => { out += filing > 0 ? into(i, inner, x, y) : at(x, y, inner, 1.5 * pop(t - 0.3 - i * 0.12)); });
  // the file: it opens, takes all three, shuts and gets a clip
  if (filing > 0 || t > T3 + 0.9) { const op = 1 - ease(seg(t, T3 + 1.55, T3 + 1.85)), clip = t - T3 - 1.9;
    out = out.replace("", "") + at(960, 560, folder(op, "") + (clip > 0 ? at(0, -150, `<path d="M-30 -30h60v70h-60Z" fill="none" stroke="${P.gold}" stroke-width="12"/>`, pop(clip)) + rings(0, 0, 300 * spring(clip, 7, 11), P.gold, 0.12 * (1 - seg(clip, 0.4, 1))) : ""), 1.7 * pop(t - T3 - 0.9)); }
  const g = `<rect width="1920" height="1080" fill="#3b1d74"/>` + layer(stars(37, 40, -200, 2200, 600, tot) + `<rect x="-400" y="${PG}" width="3000" height="400" fill="#2c1a66"/>`, c, 0.5) + layer(out, c);
  return g;
}
function s11(a, tot, s) { const c = camAt(a, [[0, 960, 590, 1.02], [1.5, 960, 580, 1.0], [2.2, 960, 580, 0.98], [2.45, 640, 590, 1.18], [3.09, 620, 600, 1.22]]); return { g: jobs(a, c, tot, s) }; }
function s12(a, tot, s) { const T2 = (s.ends || [])[11] || 3.09, c = camAt(a, [[0, 620, 600, 1.22], [0.3, 960, 590, 1.24], [1.11, 970, 590, 1.26]]); return { g: jobs(T2 + a, c, tot, s) }; }
function s13(a, tot, s) { const T3 = ((s.ends || [])[11] || 3.09) + ((s.ends || [])[12] || 1.11), c = camAt(a, [[0, 970, 590, 1.26], [0.3, 1300, 560, 1.22], [0.9, 1260, 560, 1.15], [1.25, 900, 560, 0.98], [3.27, 900, 560, 1.0]]); return { g: jobs(T3 + a, c, tot, s) }; }

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13];
// cfg.vertical (a Short): the portrait shots of money.v.js, drawn 1080 x 1920; steps without one fall back to the landscape shot
export const moneySet = (s, step, age, total, cfg = {}) => {
  if (!cfg.vertical || step >= VSHOTS.length) return frame(play(SHOTS, s, step, age, total), P);
  setFrame(1080, 1920); try { return frame(play(VSHOTS, { ...s, ends: s.vends || s.ends }, step, age, total), P); } finally { setFrame(1920, 1080); }
};
