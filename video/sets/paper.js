// "Paper": four shots, one per beat of the paper scene: in the middle of the storm a nine-page paper goes out to a list
// of people who care about locks; its date and title; its promise; and nobody knows who wrote it.
//   0 the storm town at night, one lit window: nine pages fan out of it, fold into an envelope sealed with a padlock,
//     and copies of it drop into a row of padlocked mailboxes   1 the paper itself: 31 OCT 2008 clipped on, the title types
//     itself out, and under it a drawing of the blue house paying the pink house directly   2 the planet: a coin goes
//     from the blue house straight over to the pink house; the bank on top of the world can only watch it go by
//   3 the byline "Satoshi Nakamoto", then the desk it came from: a hooded coat on an empty chair, a "?" — and then
//     there are three chairs
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, play, frame } from "./kit.js";
import { P, mix, house, bank, coin, stars, skyline } from "./bank.js";
import { calPage, padlock, laptop, hoodChair, globe } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const elite = (x, y, t, size, fill, extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Elite" font-size="${size}" fill="${fill}" ${extra}>${String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`;
const page = (w, h, n = "") => `${two(rr(-w / 2, -h / 2, w, h, 6), "#fffaec", P.creamD, 0, 6)}${[0, 1, 2, 3].map((i) => `<path d="M${-w * 0.36} ${-h * 0.2 + i * h * 0.16}h${w * (i % 2 ? 0.5 : 0.72)}" stroke="#dccaa0" stroke-width="${(h * 0.05).toFixed(1)}" stroke-linecap="round"/>`).join("")}${n ? text(0, h * 0.46, n, h * 0.2, "#a58f5e") : ""}`;
const envelope = (seal = 1) => `${two(rr(-130, -85, 260, 170, 10), P.cream, P.creamD, 0, 8)}<path d="M-130 -85L0 10L130 -85" fill="none" stroke="${P.creamD}" stroke-width="8" stroke-linejoin="round"/>${seal > 0 ? at(0, 6, padlock(0.62), seal) : ""}`;
const mailbox = (flag, has) => `<rect x="-10" y="-220" width="20" height="220" fill="${P.ink}"/>${two("M-80 -220V-300Q-80 -350 0 -350Q80 -350 80 -300V-220Z", P.blue, P.blueD, 0, 10)}<path d="${rr(-50, -300, 100, 14, 7)}" fill="${P.ink}"/>${at(0, -255, padlock(0.42))}
  <g transform="translate(80 -300) rotate(${(-90 * flag).toFixed(1)})"><rect x="0" y="-6" width="12" height="70" fill="${P.ink}"/><path d="${rr(0, 40, 50, 30, 4)}" fill="${P.red}" transform="translate(0 0)"/></g>${has ? rings(0, -290, 70, P.gold, 0.2 * has) : ""}`;

// ---- 0: in the storm, nine pages out of one window, sealed and sent to everyone on the list ----
function s0(a, tot) {
  const c = camAt(a, [[0, 620, 600, 1.55], [1.2, 620, 560, 1.48], [2.6, 620, 440, 1.3], [3.5, 760, 470, 1.18], [4.5, 1500, 640, 1.2], [5.6, 2000, 680, 1.25], [6.26, 2020, 680, 1.27]]), G = 960, HX = 600, HK = 1.8, WIN = [HX, G - 214 * HK];
  const flash = Math.max(0, Math.sin(tot * 1.3) > 0.985 ? 1 : 0) * 0.25;
  const lit = a > 1.26 ? spring(a - 1.26, 7, 11) : 0;
  const hs = at(HX, G, house("#4b3d8f", "#36296e", { lit: [0, 0, 1], roof: "#2a1d5c" }), HK) + (lit > 0 ? rings(WIN[0], WIN[1], 90 * lit, P.win, 0.3) : "");
  // the nine pages: out of the window into a fan, then together into one envelope
  const C = [HX, 320], gather = ease(seg(a, 2.75, 3.15)), fold = seg(a, 3.1, 3.35);
  let pages = "";
  if (a > 1.64 && fold < 1) for (let i = 0; i < 9; i++) { const u = a - 1.64 - i * 0.08; if (u <= 0) continue; const ang = (-160 + i * 17.5) * Math.PI / 180, fan = [WIN[0] + Math.cos(ang) * 400, WIN[1] + 40 + Math.sin(ang) * 330], out = bez(WIN, [WIN[0], WIN[1] - 160], fan, ease(seg(u, 0, 0.35)));
    const p = [lerp(out[0], C[0], gather), lerp(out[1], C[1], gather)]; pages += at(p[0], p[1] + 5 * Math.sin(tot * 2 + i) * (1 - gather), page(110, 140, String(i + 1)), 1.5 * (1 - 0.3 * fold), lerp((i - 4) * 6, 0, gather)); }
  // the envelope and its copies, one into each mailbox
  const MB = [1300, 1540, 1780, 2020, 2260, 2500];
  let env = "", boxes = "";
  const sealA = a - 3.35;
  if (fold > 0) env += at(C[0], C[1] + 6 * Math.sin(tot * 2), envelope(sealA > 0 ? pop(sealA) : 0), 1.6 * pop(a - 3.1));
  MB.forEach((x, i) => { const t0 = 3.69 + i * 0.22, t1 = t0 + 0.7, u = seg(a, t0, t1), inBox = a > t1;
    if (a > t0 && !inBox) { const b = bez(C, [(C[0] + x) / 2, 40], [x, G - 400], ease(u)); env += at(b[0], b[1], envelope(1), 0.8 * (1 - 0.35 * u)); }
    boxes += at(x, G, mailbox(inBox ? spring(a - t1, 8, 13) : 0, inBox ? Math.exp(-(a - t1) * 3) : 0), 1.4); });
  const bolt = flash > 0 ? `<path d="M1500 -100L1440 200L1500 200L1420 460" stroke="#fff3c2" stroke-width="12" fill="none" opacity=".8"/>` : "";
  const g = `<rect width="1920" height="1080" fill="url(#bstorm)"/><rect width="1920" height="1080" fill="#fff" opacity="${flash.toFixed(2)}"/>` + layer(bolt + stars(61, 30, -300, 2600, 400, tot), c, 0.15)
    + layer(skyline(91, -600, 3000, G - 30, 120, 360, "#2a1250", "#5a2a6a"), c, 0.5) + layer(`<rect x="-600" y="${G}" width="3600" height="400" fill="#140a33"/>` + hs + boxes + pages + env, c);
  return { g, out: toScreen(c, 2260, G - 400), outC: P.cream, outZ: 18 };
}
// ---- 1: the paper: 31 Oct 2008; "Bitcoin: A Peer-to-Peer Electronic Cash System"; and a picture of what it means ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 420, 1.3], [2.6, 960, 420, 1.3], [5.0, 960, 450, 1.25], [5.75, 960, 820, 1.05], [7.08, 960, 830, 1.08]]);
  const PG = `${two(rr(410, 40, 1100, 1300, 10), "#fffaec", P.creamD, 0, 10)}${[0, 1, 2].map((i) => `<path d="M520 ${660 + i * 50}h${i % 2 ? 640 : 880}" stroke="#e8dcbc" stroke-width="16" stroke-linecap="round"/>`).join("")}`;
  const typed = (t0, t1, y, str, id) => { const p = seg(a, t0, t1); if (p <= 0) return ""; const w = 1080 * p;
    return `<clipPath id="${id}"><rect x="420" y="${y - 90}" width="${w.toFixed(1)}" height="130"/></clipPath><g clip-path="url(#${id})">${elite(960, y, str, 74, P.ink)}</g>${p < 1 ? `<rect x="${(420 + w).toFixed(1)}" y="${y - 72}" width="9" height="84" fill="${P.ink}" opacity="${Math.sin(tot * 20) > 0 ? 1 : 0}"/>` : ""}`; };
  const title = typed(2.75, 4.25, 460, "Bitcoin: A Peer-to-Peer", "pt1") + typed(4.3, 5.5, 570, "Electronic Cash System", "pt2");
  const clip = a > 0.57 ? at(1370, 190, `${calPage("31", "OCT", 0.85, 120)}${text(0, 136, "2008", 46, P.ink)}<path d="M-30 -150v-40q0 -20 20 -20h20q20 0 20 20v60" fill="none" stroke="${P.steel}" stroke-width="9"/>`, pop(a - 0.57), 6) : "";
  // the drawing under the title: one house pays the other, nothing in between
  const dr = seg(a, 5.6, 6.3), cp = ease(seg(a, 5.95, 6.6)), A = [640, 1000], Z = [1280, 1000], arc = (p) => bez([A[0] + 90, A[1] - 200], [960, 700], [Z[0] - 90, Z[1] - 200], p);
  const drawing = a > 5.3 ? at(A[0], A[1] + 120, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.1 * pop(a - 5.3)) + at(Z[0], Z[1] + 120, house(P.pink, P.pinkD, { lit: cp >= 1 ? [1, 1, 1] : [0, 0, 1] }), 1.1 * pop(a - 5.4))
    + drawn(`M${A[0] + 90} ${A[1] - 200}Q960 700 ${Z[0] - 90} ${Z[1] - 200}`, dr, P.gold, 10, 'stroke-dasharray=".02 .03"') + (cp > 0 && cp < 1 ? at(...arc(cp), coin(34)) : "") : "";
  const g = `<rect width="1920" height="1080" fill="#2c1a66"/>` + layer(`<rect x="-500" y="-500" width="3000" height="2500" fill="${P.wood}"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M-500 ${-300 + i * 300}H2500" stroke="${P.woodD}" stroke-width="10"/>`).join("")}`, c, 0.8) + layer(PG + title + clip + drawing, c);
  return { g, in: toScreen(c, 960, 460), inC: P.cream, inZ: 18, out: toScreen(c, Z[0], Z[1] + 60), outC: P.pink, outZ: 20 };
}
// ---- 2: the promise: money to anyone on the planet, straight there; the bank on top of the world only watches ----
function s2(a, tot) {
  const c = camAt(a, [[0, 800, 600, 1.1], [1.4, 800, 560, 0.95], [5.64, 800, 560, 0.98]]), O = [800, 770], R = 380;
  const onG = (deg, lift = 0) => [O[0] + Math.cos(deg * Math.PI / 180) * (R + lift), O[1] + Math.sin(deg * Math.PI / 180) * (R + lift)];
  const BH = onG(-142), PH = onG(-38), BK = onG(-90), src = onG(-142, 280), dst = onG(-38, 280), t0 = 1.43, t1 = 3.5, p = ease(seg(a, t0, t1)), ctrl = [O[0], -190], b = bez(src, ctrl, dst, p);
  let trail = ""; for (let q = 1; q <= 8; q++) { const pp = p - q * 0.025; if (pp <= 0 || p >= 1) continue; const bb = bez(src, ctrl, dst, pp); trail += `<circle cx="${bb[0].toFixed(1)}" cy="${bb[1].toFixed(1)}" r="${(12 - q).toFixed(1)}" fill="${P.gold}" opacity="${(0.7 - q * 0.07).toFixed(2)}"/>`; }
  const flying = a > t0 - 0.2 && a < t1 + 0.12 ? at(b[0], b[1] + (a < t0 ? 20 * (1 - seg(a, t0 - 0.2, t0)) : 0), coin(46), pop(a - t0 + 0.2) * (1 - seg(a, t1, t1 + 0.12))) : "";
  const arrived = a > t1 ? a - t1 : -1, hop = arrived > 0 ? 1 + 0.08 * Math.exp(-arrived * 7) * Math.cos(arrived * 14) : 1;
  // the bank's eyes follow the coin across the sky; then it gives up
  const lx = a < t0 ? 0 : clamp((b[0] - O[0]) / 260, -1, 1) * (a < t1 + 0.4 ? 1 : 1), lid = a < 4.33 ? 0.12 : 0.12 + 0.4 * ease(seg(a, 4.33, 4.7));
  const bk = at(BK[0], BK[1] + 4, bank({ night: 1, sign: [1, 1, 1, 1], inside: P.ink, eyes: { lx: a > t1 + 0.4 ? 1 : lx, ly: a < t0 || a > 4.33 ? 0.2 : -1, lid } }), 0.4);
  const glowP = arrived > 0 ? rings(PH[0], PH[1] - 110, 200 * spring(arrived, 7, 11), P.win, 0.16, 1.3) : "";
  const houses = at(BH[0], BH[1], house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.95, 52) + glowP + at(PH[0], PH[1], house(P.pink, P.pinkD, { lit: arrived > 0 ? [1, 1, 1] : [0, 0, 1] }), [0.95, 0.95 * hop], -52);
  const door = arrived > 0.5 ? at(PH[0], PH[1], `<path d="M-24 0V-66A24 24 0 0 1 24 -66V0Z" fill="${P.cream}"/>`, 0.95, -52) : "";
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(67, 90, -300, 2200, 1080, tot), c, 0.15) + layer(at(O[0], O[1], globe(R, tot * 0.01, { id: "pp" })) + bk + houses + door + trail + flying, c);
  const dp = [PH[0] - Math.sin(-52 * Math.PI / 180) * 50, PH[1] - Math.cos(52 * Math.PI / 180) * 50];
  return { g, in: toScreen(c, PH[0], PH[1] - 100), inC: P.pink, inZ: 20, out: toScreen(c, dp[0], dp[1]), outC: P.cream, outZ: 24 };
}
// ---- 3: the author: a name, an empty chair, nobody knows who; maybe one, maybe many ----
function s3(a, tot) {
  const z = Math.exp(kf(a, [[0, Math.log(4.2)], [1.2, Math.log(3.8)], [2.4, Math.log(1.35)], [5.95, Math.log(1.4)]])), c = { x: kf(a, [[0, 1120], [1.2, 1120], [2.4, 1000], [5.95, 1000]]), y: kf(a, [[0, 545], [1.2, 545], [2.4, 690], [5.95, 700]]), z };
  const G = 1010, DX = 1360, DY = 760;
  const wall = `<rect x="-600" y="-400" width="3200" height="1600" fill="#2c1a66"/><rect x="-600" y="${G}" width="3200" height="400" fill="#1d0f45"/>`;
  const board = `${two(rr(930, 210, 380, 400, 10), P.wood, P.woodD, 8, 8)}<path d="${rr(950, 230, 340, 360, 6)}" fill="#c99a62"/>`;
  const pg = `${two(rr(990, 250, 260, 330, 4), "#fffaec", P.creamD, 0, 5)}${elite(1120, 300, "Bitcoin", 26, P.ink)}${[0, 1, 2, 3].map((i) => `<path d="M1015 ${340 + i * 30}h${i % 2 ? 150 : 210}" stroke="#e8dcbc" stroke-width="10" stroke-linecap="round"/>`).join("")}${elite(1120, 545, "Satoshi Nakamoto", 25, P.ink)}<circle cx="1120" cy="248" r="10" fill="${P.red}"/>`;
  const lamp = `<path d="M${DX + 200} ${DY}v-200l-80 -80" stroke="${P.ink}" stroke-width="10" fill="none"/><path d="M${DX + 80} ${DY - 300}l-60 30l40 40Z" fill="${P.ink}"/><path d="M${DX + 30} ${DY - 255}L${DX - 160} ${DY}H${DX + 120}Z" fill="#ffd98a" opacity=".1"/>`;
  const desk = `${two(rr(DX - 330, DY, 660, 36, 8), P.wood, P.woodD, 0, 10)}<rect x="${DX - 300}" y="${DY + 36}" width="26" height="${G - DY - 36}" fill="${P.woodD}"/><rect x="${DX + 274}" y="${DY + 36}" width="26" height="${G - DY - 36}" fill="${P.woodD}"/>${at(DX + 60, DY, laptop("#9fe7ff", `<path d="M-90 -160h120M-90 -130h170M-90 -100h90" stroke="#3a6b8a" stroke-width="10" stroke-linecap="round"/>`), 1.05)}${rings(DX + 60, DY - 110, 140, "#9fe7ff", 0.1)}`;
  // the "?" over the chair: it bounces on "man", "woman"; on "group" there are three chairs
  const q = a - 3.03, bump = (t0) => (a > t0 ? 0.18 * Math.exp(-(a - t0) * 7) * Math.cos((a - t0) * 14) : 0), many = a > 4.85 ? spring(a - 4.85, 7, 11) : 0;
  const qm = (x, y, k) => at(x, y + 8 * Math.sin(tot * 2.4), `${rings(0, -60, 110, P.gold, 0.18)}${text(0, 20, "?", 220, P.gold)}`, k);
  const chairs = at(lerp(-300, 450, many), G, hoodChair({ colour: "#2f2468", colourD: "#221a52" }), 0.95) + at(lerp(2300, 1600, many), G, hoodChair({ colour: "#2f2468", colourD: "#221a52" }), 0.95) + at(880, G, hoodChair(), 1.3);
  const marks = (q > 0 ? qm(640, 500, 0.8 * pop(q) * (1 + bump(3.98) + bump(4.64))) : "") + (many > 0 ? qm(450, 580, 0.45 * many) + qm(1600, 580, 0.45 * many) : "");
  const g = layer(wall + board + pg + lamp + desk + chairs + marks, c);
  return { g, in: toScreen(c, 1120, 545), inC: P.cream, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3];
export const paperSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
