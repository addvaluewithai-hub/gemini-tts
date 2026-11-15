// Crypto part 6, scene "s4": governments. Six shots in one street of government buildings (shot list:
// episodes/techforbadguys/explain-crypto-06-world/shots.md):
//   0 three government buildings, each with its flag; China's door slams shut, ✗
//   1 calendar 2021 under China; Europe's building opens a rule book, ✓; calendar END 2024
//   2 inside the US building two flags argue (bubbles clash); pull back to a map where each country's rule is a colour
//   3 a little house reads its own country's rule book before stepping toward the coin
//   4 every building stamps the same TAX form; then the central-bank vault rises
//   5 the vault mints its own digital coin; pins pop on 100+ countries of the globe
import { clamp, lerp, ease, easeOut, seg, spring, rnd, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s4.v.js";
import { P, mix, coin, house, stars, skyline, pill } from "./bank.js";
import { calPage, globe } from "./props.js";
import { cbVault } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 41) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -900, 3000, 1080, tot), c, 0.15);
const G = 860;
// a government building, 380 wide, base on y = 0: columns, a pediment, a door that can shut (shut 0..1), a flag
const flagOf = (k, wave) => { const w = (y) => (8 * Math.sin(wave + y * 0.05)).toFixed(1);
  if (k === "cn") return `<path d="M0 0h150v100H0Z" fill="#d93544"/><path d="M30 20l7 18h19l-15 11l6 18l-17 -11l-17 11l6 -18l-15 -11h19Z" fill="${P.gold}"/>`;
  if (k === "eu") return `<path d="M0 0h150v100H0Z" fill="#2a4fb8"/>${Array.from({ length: 10 }, (_, i) => { const an = i * 0.628; return `<circle cx="${(75 + Math.cos(an) * 30).toFixed(1)}" cy="${(50 + Math.sin(an) * 30).toFixed(1)}" r="5" fill="${P.gold}"/>`; }).join("")}`;
  return `<path d="M0 0h150v100H0Z" fill="#fff"/>${[0, 2, 4, 6].map((i) => `<path d="M0 ${i * 14.3}h150v14.3H0Z" fill="#d93544"/>`).join("")}<path d="M0 0h64v57H0Z" fill="#2a4fb8"/>${[0, 1, 2].map((r) => [0, 1, 2].map((q) => `<circle cx="${12 + q * 20}" cy="${12 + r * 17}" r="4" fill="#fff"/>`).join("")).join("")}`; };
const gov = (k, o = {}) => { const shut = o.shut || 0, wave = o.wave || 0;
  return `<rect x="150" y="-640" width="10" height="250" fill="${P.steelD}"/><g transform="translate(160 -640) skewY(${(3 * Math.sin(wave)).toFixed(1)})">${flagOf(k, wave)}</g>
    <path d="${rr(-200, -30, 400, 30, 6)}" fill="#c7b38a"/>${two(rr(-180, -360, 360, 330, 6), "#efe2c2", "#d8c6a0", 10, 0)}<path d="M-210 -360L0 -470L210 -360Z" fill="#d8c6a0"/>
    ${[-130, -65, 65, 130].map((x) => `<path d="${rr(x - 16, -340, 32, 300, 6)}" fill="#fff7e2"/>`).join("")}<path d="M-46 -30V-170A46 46 0 0 1 46 -170V-30Z" fill="${P.ink}"/>
    ${shut > 0 ? `<path d="M-46 -30V${(-30 - 160 * shut).toFixed(1)}H46V-30Z" fill="${P.steelD}"/>${[0, 1, 2, 3].map((i) => (i * 40 < 160 * shut ? `<path d="M-46 ${-30 - i * 40}h92" stroke="${P.steel}" stroke-width="6"/>` : "")).join("")}` : ""}
    ${o.label ? at(0, -500, pill(o.label, o.lc || P.violet, o.lcD || P.violetD, 160), 1) : ""}`; };
// a rule book, open 0..1, ~260 wide when open
const ruleBook = (open = 1, c = "#2a4fb8") => { const w = 120 * ease(open);
  return `${two(rr(-w - 8, -90, w + 8, 180, 10), c, mix(c, P.ink, 0.3), 0, 6)}${two(rr(0, -90, 128, 180, 10), c, mix(c, P.ink, 0.3), 0, 6)}${open > 0.3 ? `<path d="${rr(-w + 6, -78, w - 12, 156, 6)}" fill="${P.cream}"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${-w + 22} ${-52 + i * 28}h${Math.max(0, w - 46)}" stroke="#c9b48a" stroke-width="7" stroke-linecap="round"/>`).join("")}` : ""}<path d="${rr(14, -78, 100, 156, 6)}" fill="${P.cream}"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M30 ${-52 + i * 28}h70" stroke="#c9b48a" stroke-width="7" stroke-linecap="round"/>`).join("")}${text(64, 70, "§", 30, "#a58f5e")}`; };
const BX = { cn: 420, eu: 1000, us: 1580 };
function street(t, tot, o = {}) {
  let g = `<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/><path d="M-900 ${G + 60}h3800" stroke="${P.road}" stroke-width="40"/>`;
  [["cn", "CHINA", P.red, P.redD], ["eu", "EU", P.blue, P.blueD], ["us", "USA", P.violet, P.violetD]].forEach(([k, lab, lc, lcD], i) => {
    g += at(BX[k], G, gov(k, { shut: k === "cn" ? o.shut || 0 : 0, wave: tot * 2 + i, label: lab, lc, lcD }), (o.k || 1.25) * pop(t + 0.5 - i * 0.12)); });
  return o.fade === undefined ? g : `<g opacity="${clamp(o.fade).toFixed(2)}">${g}</g>`;
}
const bg = (c, tot) => night(c, tot) + layer(skyline(29, -900, 3000, G - 20, 80, 260, "#221a5c", "#ffb066"), c, 0.45);

// ---- 0: three buildings; China's door slams ----
function s0(a, tot) {
  const c = camAt(a, [[0, 1000, 470, 0.88], [1.2, 1000, 470, 0.9], [1.9, 600, 500, 1.04], [3.55, 590, 500, 1.06]]);
  const shut = ease(seg(a, 1.6, 2.0)), dust = a > 2.0 && a < 2.6 ? [0, 1, 2, 3, 4].map((i) => `<circle cx="${BX.cn - 60 + i * 30}" cy="${G - 20 - 30 * seg(a, 2.0, 2.6)}" r="${12 * (1 - seg(a, 2.0, 2.6))}" fill="${P.steel}" opacity=".6"/>`).join("") : "";
  const x = a > 2.05 ? cross(BX.cn, G - 330, 60, P.red, a - 2.05) : "", cal = a > 2.3 ? at(BX.cn - 360, G - 330, calPage("2021", "", 1, 140), 0.75 * pop(a - 2.3), -5) : "";
  return { g: bg(c, tot) + layer(street(a, tot, { shut }) + dust + x + cal, c), out: toScreen(c, BX.eu, G - 200), outC: "#efe2c2", outZ: 14 };
}
// ---- 1: Europe opens a rule book; END 2024 ----
function s1(a, tot) {
  const c = camAt(a, [[0, 700, 560, 1.05], [0.6, 1000, 480, 1.08], [3.04, 1000, 480, 1.1]]);
  const cal1 = at(BX.cn - 360, G - 330, calPage("2021", "", 1, 140), 0.75, -5), op = ease(seg(a, 0.45, 1.2));
  const bk = a > 0.2 ? at(BX.eu + 300, G - 330, rings(0, 0, 150, P.gold, 0.16 * op) + ruleBook(op), 1.3 * pop(a - 0.2)) : "";
  const ok = a > 1.3 ? check(BX.eu + 470, G - 450, 44, P.green, a - 1.3) : "", cal = a > 1.95 ? at(BX.eu + 300, G - 80, calPage("2024", "END", 1, 140), 0.7 * pop(a - 1.95), 5) : "";
  return { g: bg(c, tot) + layer(street(4 + a, tot, { shut: 1 }) + at(BX.cn, G - 330, cross(0, 0, 60, P.red, 5)) + cal1 + bk + ok + cal, c), in: [960, 560], inC: "#efe2c2", inZ: 14 };
}
// ---- 2 (host right): America argues with itself; a map of different rules ----
function s2(a, tot) {
  const back = ease(seg(a, 1.8, 2.6));
  const c = camAt(a, [[0, 1500, 460, 1.2], [1.6, 1520, 460, 1.25], [2.6, 960, 470, 0.95], [4.12, 940, 470, 0.95]]);
  const fight = a < 2.4 ? [0, 1].map((i) => { const ph = a * 6 + i * Math.PI, x = BX.us + (i ? 130 : -130) + 14 * Math.sin(ph), y = G - 720 - 20 * Math.abs(Math.sin(ph));
    return at(x, y, `<path d="${rr(-90, -55, 180, 110, 30)}" fill="${i ? P.red : P.blue}"/><path d="M${i ? -40 : 40} 50l${i ? -30 : 30} 40l${i ? 10 : -10} -40Z" fill="${i ? P.red : P.blue}"/>${text(0, 22, i ? "✗" : "!", 70, "#fff")}`, pop(a - 0.5 - i * 0.25) * (1 - back)); }).join("") : "";
  const sparks = a > 0.9 && a < 1.9 ? [0, 1, 2, 3, 4].map((i) => { const an = i * 1.256 + a * 4; return `<path d="M${BX.us} ${G - 720}l${(Math.cos(an) * 70).toFixed(0)} ${(Math.sin(an) * 70).toFixed(0)}" stroke="${P.gold}" stroke-width="7" stroke-linecap="round" opacity="${(1 - seg(a, 1.4, 1.9)).toFixed(2)}"/>`; }).join("") : "";
  // the map: patches that light up one after another, each a different colour (a different rule)
  const COLS = [P.red, P.blue, P.teal, P.gold, P.pink, P.violet, P.green, "#ff9f43"];
  const patches = back > 0 ? Array.from({ length: 10 }, (_, i) => { const x = 70 + (i % 5) * 300 + (Math.floor(i / 5) % 2) * 110, y = 230 + Math.floor(i / 5) * 270, on = seg(a, 2.3 + i * 0.1, 2.55 + i * 0.1);
    return at(x, y, `<path d="M0 0q60 -40 130 -10q40 40 10 90q-60 40 -130 10q-40 -50 -10 -90Z" fill="${mix("#3a2f7a", COLS[i % 8], on)}" opacity="${back.toFixed(2)}"/>`, 2) + (on > 0.5 ? at(x + 130, y + 90, coin(34, "B"), pop(on - 0.5)) : ""); }).join("") : "";
  return { g: bg(c, tot) + layer(street(8 + a, tot, { shut: 1, fade: 1 - back }) + sparks + fight + patches, c), out: [960, 520], outC: "#3a2f7a", outZ: 12 };
}
// ---- 3: a little house checks its own country's rule book before stepping toward the coin ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 640, 1.75], [2.87, 990, 640, 1.82]]);
  const HX = 700, read = ease(seg(a, 0.6, 1.3)), step = ease(seg(a, 2.0, 2.6));
  const g = `<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/>` + at(HX + 160 * step, G, house(P.teal, P.tealD, { lit: [1, 1, 1] }) + `<rect x="100" y="-360" width="8" height="120" fill="${P.steelD}"/>` + at(108, -360, flagOf("eu", tot * 3), 0.45), 0.9)
    + at(HX + 40, G - 430, rings(0, 0, 110, P.gold, 0.14 * read) + ruleBook(read, P.teal), 0.75 * pop(a - 0.3)) + (a > 1.45 ? check(HX + 170, G - 500, 30, P.green, a - 1.45) : "")
    + at(1260, G - 200, rings(0, 0, 90, P.gold, 0.18) + coin(70, "B"), pop(a - 0.1)) + (step > 0 ? `<path d="M${HX + 140} ${G - 40}h${(260 * step).toFixed(0)}" stroke="${P.gold}" stroke-width="6" stroke-dasharray="10 12"/>` : "");
  return { g: bg(c, tot) + layer(g, c), in: [960, 540], inC: "#3a2f7a", inZ: 12, out: toScreen(c, 1260, G - 200), outC: P.gold, outZ: 16 };
}
// ---- 4: every building stamps the same TAX form; the central-bank vault rises ----
const taxForm = (stamps) => `${two(rr(-150, -190, 300, 380, 12), P.cream, P.creamD, 0, 8)}${text(0, -130, "TAX", 64, P.ink)}${[0, 1, 2, 3].map((i) => `<path d="M-110 ${-70 + i * 40}h${150 + (i * 31) % 60}" stroke="#c9b48a" stroke-width="9" stroke-linecap="round"/>`).join("")}
  ${stamps.map((s, i) => (s > 0 ? at(-80 + i * 80, 120, `<circle r="34" fill="none" stroke="${[P.red, P.blue, P.violet][i]}" stroke-width="7"/>${text(0, 10, "✓", 32, [P.red, P.blue, P.violet][i])}`, 0.5 + 0.5 * spring(s, 10, 18), -12) : "")).join("")}`;
function s4(a, tot) {
  const rise = ease(seg(a, 2.75, 3.6));
  const c = camAt(a, [[0, 1000, 500, 0.92], [2.4, 1000, 500, 0.95], [3.77, 1000, 480, 0.95]]);
  const st = [1.75, 2.0, 2.25].map((t0) => a - t0);
  const arms = ["cn", "eu", "us"].map((k, i) => { const p = clamp(1 - Math.abs(a - 1.6 - i * 0.25) / 0.2); return p > 0 ? `<path d="M${BX[k]} ${G - 470}L${lerp(BX[k], 920 + i * 92, p)} ${lerp(G - 600, 610, p)}" stroke="${P.steel}" stroke-width="12" stroke-linecap="round"/>` : ""; }).join("");
  const form = at(1000, 400, taxForm(st), 1.4 * pop(a - 0.3));
  const vault = rise > 0 ? at(1000, G + 700 - 700 * rise, cbVault({ open: 0, sym: "$" }), 1.0) : "";
  return { g: bg(c, tot) + layer(street(12 + a, tot, { shut: 1, fade: 1 - rise }) + vault + arms + `<g opacity="${(1 - rise).toFixed(2)}">${form}</g>`, c), in: [960, 540], inC: P.gold, inZ: 16 };
}
// ---- 5 (host left): the vault mints its own digital coin; pins on 100+ countries ----
function s5(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.05], [1.9, 900, 540, 1.0], [2.4, 1120, 520, 0.98], [3.88, 1130, 520, 1.0]]);
  const VX = 760, mint = seg(a, 0.3, 1.8);
  const coins = [0, 1, 2].map((i) => { const p = seg(a, 0.5 + i * 0.35, 1.2 + i * 0.35); return p > 0 ? at(VX + 260 * ease(p) + i * 40, G - 260 - 160 * Math.sin(Math.PI * p) * (1 - i * 0.2), disc(0, 0, 44, "#9fe7ff", "#5fb6ff") + text(0, 16, "$", 44, P.ink), pop(p)) : ""; }).join("");
  const GX = 1450, GY = 470, R = 300;
  const pins = a > 2.2 ? Array.from({ length: 22 }, (_, i) => { const an = rnd(i * 7 + 3) * 6.28, rr_ = Math.sqrt(rnd(i * 7 + 4)) * R * 0.85, x = GX + Math.cos(an) * rr_, y = GY + Math.sin(an) * rr_ * 0.9, p = a - 2.25 - i * 0.04;
    return p > 0 ? at(x, y, `<path d="M0 0l-12 -30a14 14 0 1 1 24 0Z" fill="${["#9fe7ff", P.gold, P.pink][i % 3]}"/><circle cy="-34" r="6" fill="${P.ink}"/>`, pop(p)) : ""; }).join("") : "";
  const lab = a > 3.0 ? at(GX, GY - R - 70, pill("100+", P.blue, P.blueD, 170), pop(a - 3.0)) : "";
  const g = `<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/>` + at(VX, G, rings(0, -200, 260, "#9fe7ff", 0.12 * mint) + cbVault({ open: mint, sym: "$" }), 1.05) + coins
    + (a > 2.0 ? at(GX, GY, globe(R, tot * 0.02, { night: 0.3 }), pop(a - 2.0, 7, 12)) : "") + pins + lab;
  return { g: bg(c, tot) + layer(g, c) };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const c6s4Set = makeSet(SHOTS, V, P);
