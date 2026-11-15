// "Mix" (electricity part 2): who makes the planet's electricity in 2025 (Ember, Global Electricity Review 2026).
//   0 a big pie builds slice by slice on each word: coal 33.0%, gas 21.8%, hydro ~14%, nuclear 8.9%, solar 8.7%, wind 8.5%
//   1 two bars: all renewables together climb segment by segment and pass coal by a hair: 33.8% against 33.0%
//   2 solar alone: a bar from ~1% (2015) grows to 8.7% (2025)
// The pie is the subject of shot 0 and hands over to the bars through its gold centre; numbers roll, never jump.
import { clamp, lerp, ease, easeOut, seg, spring, kf, camAt, layer, toScreen, rr, two, disc, rings, text, at, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, E, pop, electron } from "./elec.js";
import { sky, coalPile, flame, turbine, puff } from "./steam.js";
import { windmill, panel } from "./sources.js";
import { V } from "./mix.v.js";

// the slices, in the order the voice names them; t: when each arrives (seconds into shot 0)
export const SLICES = [
  { k: "coal", v: 33.0, c: "#3a3a48", cD: "#2a2a36", t: 3.23, lab: "33.0%" },
  { k: "gas", v: 21.8, c: "#4f8cff", cD: "#3a6fd6", t: 5.14, lab: "21.8%" },
  { k: "hydro", v: 14.0, c: "#2fb7e0", cD: "#2190b4", t: 6.28, lab: "~14%" },
  { k: "nuclear", v: 8.9, c: "#ff5fa2", cD: "#d6407f", t: 6.74, lab: "8.9%" },
  { k: "solar", v: 8.7, c: "#ffd04a", cD: "#f09a1a", t: 7.19, lab: "8.7%" },
  { k: "wind", v: 8.5, c: "#22c7b8", cD: "#15988f", t: 7.57, lab: "8.5%" },
  { k: "other", v: 5.1, c: "#4a6478", cD: "#3a5062", t: 7.57, lab: "" },
];
// a small picture for each slice (centre)
const ICON = {
  coal: () => coalPile(6, 0.6), gas: (t) => flame(t, 0.55), hydro: () => `<path d="M0 -40Q30 0 0 30Q-30 0 0 -40Z" fill="#d8f0ff"/>`,
  nuclear: () => `<circle r="16" fill="#fff"/><ellipse rx="40" ry="14" fill="none" stroke="#fff" stroke-width="5"/><ellipse rx="40" ry="14" fill="none" stroke="#fff" stroke-width="5" transform="rotate(60)"/><ellipse rx="40" ry="14" fill="none" stroke="#fff" stroke-width="5" transform="rotate(-60)"/>`,
  solar: () => `<circle r="22" fill="#fff6c8"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${(30 * Math.cos(i * 0.785)).toFixed(1)} ${(30 * Math.sin(i * 0.785)).toFixed(1)}L${(42 * Math.cos(i * 0.785)).toFixed(1)} ${(42 * Math.sin(i * 0.785)).toFixed(1)}" stroke="#fff6c8" stroke-width="6" stroke-linecap="round"/>`).join("")}`,
  wind: (t) => at(0, 40, windmill(t * 120, 90)), other: () => "",
};
const arc = (r, a0, a1) => { const p = (a) => [r * Math.sin(a), -r * Math.cos(a)], [x0, y0] = p(a0), [x1, y1] = p(a1); return `M0 0L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z`; };
// the pie at time a (centre), radius R; labels outside on a ring of radius R + 120
export function pie(a, tot, R = 330, o = {}) {
  let a0 = 0, out = "", labels = "";
  for (const s of SLICES) { const grow = ease(seg(a, s.t, s.t + 0.45)), span = (s.v / 100) * 2 * Math.PI, a1 = a0 + span * grow;
    if (grow > 0) { out += `<path d="${arc(R, a0, a1)}" fill="${s.c}" stroke="#061a2b" stroke-width="6"/>`;
      const mid = a0 + span / 2, lr = R + (o.lr ?? 120), lx = lr * Math.sin(mid), ly = -lr * Math.cos(mid), ix = R * 0.62 * Math.sin(mid), iy = -R * 0.62 * Math.cos(mid);
      out += at(ix, iy, ICON[s.k](tot), pop(a - s.t - 0.1) * (s.v > 8 ? 1 : 0.8));
      if (s.lab) labels += at(lx, ly, `${two(rr(-80, -38, 160, 76, 38), P.ink, "#020c15", 0, 6)}${text(0, 18, s.lab, 50, s.k === "coal" ? "#e8ecf6" : s.c)}`, pop(a - s.t - 0.15)); }
    a0 += span * (grow > 0 ? 1 : 0); }
  return `${rings(0, 0, R * 1.05, P.gold, 0.08, 1.2)}<circle r="${R + 10}" fill="#061a2b"/>` + out + `<circle r="${R * 0.18}" fill="#061a2b"/>` + labels; }

// ---- 0: the pie of 2025 ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.4], [3.1, 960, 560, 1.15], [8.15, 960, 560, 1.0]]);
  const cal = at(300, 250, calPage("2025", "", 1, 150), pop(a - 2.26) * (1 - seg(a, 7.6, 8.0)));
  const g = sky(c, tot, 79) + layer(at(960, 560, pie(a, tot, 330)) + cal, c);
  return { g, out: toScreen(c, 960, 560), outC: P.gold, outZ: 14 };
}

// ---- 1: renewables together pass coal, by a hair ----
// two bars side by side (or, in portrait, the same two bars narrower); X: their centres; H: px per percent
export function bars(a, tot, o = {}) {
  const XC = o.XC ?? 640, XR = o.XR ?? 1280, B = o.B ?? 900, H = o.H ?? 18, W = o.W ?? 300, c = camAt(a, o.cam || [[0, 960, 600, 1.0], [5.0, 960, 590, 1.02], [6.42, 960, 580, 1.06]]);
  const coal = 33.0 * ease(seg(a, 0.3, 1.0)), segs = [["hydro", 14.0, 2.93], ["wind", 8.5, 3.27], ["solar", 8.7, 3.6], ["other", 2.6, 4.37]];
  let y = B, ren = 0, stack = "";
  for (const [k, v, t0] of segs) { const g = ease(seg(a, t0, t0 + 0.4)), h = v * H * g; const s = SLICES.find((x) => x.k === k), col = k === "other" ? "#3ddc97" : s.c;
    if (h > 0) stack += `<path d="${rr(XR - W / 2, y - h, W, h, 0)}" fill="${col}" stroke="#061a2b" stroke-width="4"/>` + (h > 60 ? at(XR, y - h / 2, ICON[k](tot), 0.9) : "");
    y -= h; ren += v * g; }
  const coalH = coal * H, top = Math.min(B - coalH, y), hair = seg(a, 5.0, 5.4), mag = seg(a, 5.86, 6.2);
  const coalBar = `<path d="${rr(XC - W / 2, B - coalH, W, coalH, 0)}" fill="#3a3a48" stroke="#061a2b" stroke-width="4"/>` + (coalH > 80 ? at(XC, B - coalH / 2, coalPile(8, 0.8)) : "");
  const line = hair > 0 ? `<path d="M${XC - W / 2 - 40} ${B - 33 * H}H${XR + W / 2 + 40}" stroke="#e8ecf6" stroke-width="5" stroke-dasharray="16 12" opacity="${hair.toFixed(2)}"/>` : "";
  const glass = mag > 0 ? at(XR + W / 2 + 70, B - 33.4 * H, `<circle r="70" fill="#bfe4ff" opacity=".18" stroke="#e8ecf6" stroke-width="10"/><path d="M50 50L110 110" stroke="#e8ecf6" stroke-width="18" stroke-linecap="round"/>`, pop(mag)) : "";
  const lab = (x, v, col, t0) => at(x, B + 80, `${two(rr(-110, -42, 220, 84, 42), P.ink, "#020c15", 0, 6)}${text(0, 20, v.toFixed(1) + "%", 58, col)}`, pop(a - t0));
  const ground = `<rect x="-800" y="${B}" width="3600" height="900" fill="${P.ground}"/>`;
  const win = ren > 33.0 ? at(XR, top - 70, `<path d="M-40 10L0 -40L40 10Z" fill="${E.cu}"/>`, pop(a - 5.0)) : "";
  const g = sky(c, tot, 83) + layer(ground + coalBar + stack + line + glass + lab(XC, coal, "#e8ecf6", 0.3) + (a > 2.93 ? lab(XR, ren, "#3ddc97", 2.93) : "") + win, c);
  return { g, in: toScreen(c, XR, B - 300), inC: P.gold, out: toScreen(c, XR, B - 30 * H), outC: P.gold, outZ: 12 };
}
const s1 = (a, tot) => bars(a, tot);

// ---- 2: the sun alone: ~1% ten years ago, 8.7% now ----
export function sunbar(a, tot, o = {}) {
  const X = o.X ?? 960, B = o.B ?? 920, H = o.H ?? 70, c = camAt(a, o.cam || [[0, 960, 540, 1.1], [3.95, 960, 520, 1.0]]);
  const v = kf(a, [[1.39, 0], [2.0, 1], [2.87, 1], [3.5, 8.7]], ease), h = v * H, cal = a < 2.87 ? "2015" : "2025";
  const sun = at(X, B - h - 130, `${rings(0, 0, 80, "#ffd98a", 0.3, 1.5)}<circle r="56" fill="#ffd04a"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${(70 * Math.cos(i * 0.628 + tot)).toFixed(1)} ${(70 * Math.sin(i * 0.628 + tot)).toFixed(1)}L${(96 * Math.cos(i * 0.628 + tot)).toFixed(1)} ${(96 * Math.sin(i * 0.628 + tot)).toFixed(1)}" stroke="#ffd04a" stroke-width="10" stroke-linecap="round"/>`).join("")}`, pop(a - 0.1));
  const bar = h > 0 ? `<path d="${rr(X - 120, B - h, 240, h, 10)}" fill="#ffd04a" stroke="#f09a1a" stroke-width="6"/>` : "";
  const lab = at(X + 260, B - Math.max(h, 40) + 30, `${two(rr(-110, -42, 220, 84, 42), P.ink, "#020c15", 0, 6)}${text(0, 20, a < 2.87 ? "~1%" : v.toFixed(1) + "%", 58, "#ffd04a")}`, pop(a - 1.39));
  const year = at(X - 300, B - 300, calPage(cal, "", 1, 150), pop(a - 1.39) * (a > 2.87 && a < 3.0 ? 0.7 : 1));
  const g = sky(c, tot, 89) + layer(`<rect x="-800" y="${B}" width="3600" height="900" fill="${P.ground}"/>` + bar + sun + lab + year, c);
  return { g, in: toScreen(c, X, B - 300), inC: P.gold };
}
const s2 = (a, tot) => sunbar(a, tot);

export const SHOTS = [s0, s1, s2];
export const mixSet = makeSet(SHOTS, V, P);
