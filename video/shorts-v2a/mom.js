// The co-star: an Egyptian mother on cleaning day. House galabeya, scarf tied for work, long rubber gloves, slippers.
// mom(p) draws her with her feet at the origin; every part of p can be animated.
// p.look = "us" draws the American version of the same rig (same faces, arms, hands, neckline, breathing, blinks):
// hair in a high ponytail that swings where the scarf tails swung (p.tails), an old T-shirt, jeans, fuzzy slippers,
// the same yellow rubber gloves. Without p.look she is drawn exactly as before.
import { clamp, lerp, G, T, n2, star } from "./kit.js";
import { C } from "./palette.js";

// Faces. Numbers only, so any two can be blended.
//  open: eye opening  happy: eyes closed in a smile  bY/bT: brow height / tilt (+ worried, - angry)
//  mw/mc/mo: mouth half width / curve (+ smile) / opening  red: irritated eyes  tear: streaming tears
export const FACE = {
  neutral: { open: 1, happy: 0, bY: 0, bT: 0, mw: 30, mc: 9, mo: 0, red: 0, tear: 0, blush: 0.35, spark: 0, teeth: 0, lookX: 0, lookY: 0 },
  war: { open: 0.72, happy: 0, bY: 10, bT: -0.85, mw: 28, mc: 4, mo: 0, blush: 0.2 },
  grin: { open: 1, happy: 0, bY: -4, bT: 0, mw: 40, mc: 16, mo: 14, teeth: 1, blush: 0.5 },
  dreamy: { open: 1.2, happy: 0, bY: -12, bT: 0.3, mw: 30, mc: 14, mo: 16, spark: 1, blush: 0.7 },
  shock: { open: 1.3, happy: 0, bY: -16, bT: 0.4, mw: 16, mc: 0, mo: 22, blush: 0.2 },
  cough: { open: 0.05, happy: 0, bY: 8, bT: -0.5, mw: 22, mc: -2, mo: 30, red: 0.3, blush: 0.6 },
  burn: { open: 0.42, happy: 0, bY: 2, bT: 0.9, mw: 30, mc: -10, mo: 8, red: 1, tear: 1, blush: 0.5, teeth: 1 },
  pain: { open: 0.2, happy: 0, bY: 6, bT: 1, mw: 34, mc: -12, mo: 12, red: 0.8, tear: 0.6, teeth: 1, blush: 0.4 },
  proud: { open: 0.5, happy: 1, bY: -8, bT: 0, mw: 42, mc: 18, mo: 0, red: 0.7, tear: 0.5, blush: 0.8 },
  sniff: { open: 0, happy: 1, bY: -14, bT: 0.2, mw: 20, mc: 12, mo: 0, red: 0.7, tear: 0.5, blush: 0.8 },
  worried: { open: 1.1, happy: 0, bY: -6, bT: 0.9, mw: 22, mc: -8, mo: 4, red: 0.6, tear: 0.3, blush: 0.3 },
  relief: { open: 0, happy: 1, bY: -4, bT: 0.3, mw: 18, mc: 4, mo: 14, red: 0.3, blush: 0.5 },
  talk: { open: 1, happy: 0, bY: -2, bT: 0.5, mw: 24, mc: 2, mo: 14, red: 0.3, blush: 0.4, teeth: 1 },
  moved: { open: 1.15, happy: 0, bY: -10, bT: 0.8, mw: 32, mc: 12, mo: 4, spark: 1, tear: 0.25, blush: 0.8 },
  joy: { open: 0, happy: 1, bY: -12, bT: 0, mw: 26, mc: 4, mo: 30, blush: 0.9 },
};

export const US = { skin: "#EFB088", skinHi: "#F8CCA8", skinLo: "#C98762", hair: "#7A3E22", hairHi: "#B0623A", hairLo: "#52260F", tie: "#7A3FF2",
  shirt: "#FF7F6A", shirtHi: "#FFA697", shirtLo: "#DE5747", jeans: "#3E5BB8", jeansLo: "#2C438E", jeansHi: "#6F8BE0" };
const SCOOP = "M-74 -548 C-72 -468 -36 -428 0 -428 C36 -428 72 -468 74 -548";      // the neckline: skin shows in it, the head sits on it
const DRESS = "M-118 -600 C-152 -470 -208 -200 -218 -28 Q0 14 218 -28 C208 -200 152 -470 118 -600 Q0 -652 -118 -600 Z";

function eye(x, f, side, tt) {
  const ry = 31 * clamp(f.open, 0, 1.35), wht = f.red > 0.02 ? `rgb(255,${Math.round(253 - 70 * f.red)},${Math.round(247 - 80 * f.red)})` : C.white;
  let s;
  if (f.happy > 0.5) s = `<path d="M${x - 26} 6 Q${x} ${-22} ${x + 26} 6" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>`;
  else if (f.open < 0.14) s = `<path d="M${x - 27} 0 Q${x} ${10} ${x + 27} 0" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/><path d="M${x + side * 27} 0 l${side * 12} ${-7}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
  else {
    const px = x + clamp(f.lookX, -1, 1) * 9, py = clamp(f.lookY, -1, 1) * 8 + 2, pr = Math.min(14, ry * 0.62);
    s = `<ellipse cx="${x}" cy="0" rx="27" ry="${n2(ry)}" fill="${wht}"/>
      <ellipse cx="${n2(px)}" cy="${n2(py)}" rx="${n2(pr)}" ry="${n2(Math.min(pr, ry * 0.9))}" fill="#3A1D10"/><circle cx="${n2(px + 5)}" cy="${n2(py - 5)}" r="${n2(pr * 0.32)}" fill="#fff"/>
      ${f.spark > 0.3 ? `<path d="${star(11)}" transform="translate(${n2(px - 5)} ${n2(py + 4)}) rotate(${n2(tt * 90)})" fill="#fff"/>` : ""}
      <path d="M${x - 29} ${n2(-ry * 0.55)} Q${x} ${n2(-ry * 1.25)} ${x + 29} ${n2(-ry * 0.55)}" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${x + side * 28} ${n2(-ry * 0.55)} l${side * 13} ${-9}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
  }
  if (f.tear > 0.05) {
    for (let k = 0; k < 2; k++) { const ph = (tt * 1.3 + k * 0.5 + (side > 0 ? 0.27 : 0)) % 1, ty = 26 + ph * 120, op = f.tear * (1 - ph) * 0.95;
      s += `<path d="M0 -13 C9 -2 10 6 0 11 C-10 6 -9 -2 0 -13Z" transform="translate(${n2(x + side * (10 + ph * 8))} ${n2(ty)}) scale(${n2(0.9 + ph * 0.5)})" fill="${C.water}" opacity="${n2(op)}"/>`; }
  }
  return s;
}
const brow = (x, f, side, col = "#2A130B") => { const y = -52 + f.bY - (f.happy > 0.5 ? 6 : 0), tilt = -f.bT * 15 * side; return `<path d="M${x - 28} ${n2(y + tilt)} Q${x} ${n2(y - 9)} ${x + 28} ${n2(y - tilt)}" fill="none" stroke="${col}" stroke-width="11" stroke-linecap="round"/>`; };
function mouth(f) {
  const w = f.mw, c = f.mc, o = Math.max(0, f.mo), y = 66;
  if (o < 2.5) return `<path d="M${-w} ${y} Q0 ${n2(y + c * 1.6)} ${w} ${y}" fill="none" stroke="#5A1230" stroke-width="8" stroke-linecap="round"/>`;
  const top = y + c * 0.5, bot = y + c * 0.9 + o * 1.6;
  return `<path d="M${-w} ${y} Q0 ${n2(top)} ${w} ${y} Q0 ${n2(bot + (bot - y) * 0.6)} ${-w} ${y} Z" fill="#5A1230"/>
    ${f.teeth > 0.5 ? `<path d="M${-w * 0.72} ${n2(y + 2)} Q0 ${n2(top + 4)} ${w * 0.72} ${n2(y + 2)} L${w * 0.6} ${n2(y + 9)} Q0 ${n2(top + 12)} ${-w * 0.6} ${n2(y + 9)} Z" fill="#fff"/>` : ""}
    <ellipse cx="0" cy="${n2(bot - 2)}" rx="${n2(w * 0.45)}" ry="${n2(Math.min(8, o * 0.35))}" fill="#E8607F"/>
    <path d="M${-w} ${y} Q0 ${n2(top)} ${w} ${y}" fill="none" stroke="#5A1230" stroke-width="6" stroke-linecap="round"/>`;
}
function headUS(f, p) {
  const tt = p.tt ?? 0, sw = p.tails ?? 0;      // sw: swing of the ponytail, degrees (the scarf tails' parameter)
  const lag = Math.sin(tt * 2.3) * 2;
  return `
  <path d="M-128 -10 C-150 -130 -80 -186 0 -186 C80 -186 150 -130 128 -10 C134 40 122 84 104 104 L-104 104 C-122 84 -134 40 -128 -10Z" fill="${US.hairLo}"/>
  <g transform="rotate(${n2(-22 + sw * 1.15 + lag)} 64 -166)"><path d="M64 -166 C126 -176 164 -120 160 -40 C156 30 136 90 104 130 C112 70 106 10 92 -40 C84 -90 70 -130 52 -150Z" fill="url(#mHairUS)"/>
    <g transform="rotate(${n2(sw * 0.6)} 120 60)"><path d="M126 20 C150 60 146 110 120 150 C124 110 120 70 108 40Z" fill="${US.hairLo}"/></g>
    <path d="M96 -140 C124 -110 136 -60 130 0" fill="none" stroke="${US.hairHi}" stroke-width="9" stroke-linecap="round" opacity=".6"/></g>
  <ellipse cx="62" cy="-166" rx="30" ry="24" transform="rotate(-30 62 -166)" fill="${US.tie}"/><ellipse cx="56" cy="-172" rx="16" ry="11" transform="rotate(-30 56 -172)" fill="#A77BFF"/>
  <ellipse cx="0" cy="0" rx="118" ry="124" fill="url(#mSkinUS)"/>
  <path d="M-128 6 C-150 -140 -70 -180 0 -180 C80 -180 146 -140 128 6 C120 -50 104 -84 74 -100 C40 -78 -20 -84 -50 -112 C-80 -100 -112 -66 -128 6Z" fill="url(#mHairUS)"/>
  <path d="M-92 -126 C-56 -160 20 -168 80 -138" fill="none" stroke="${US.hairHi}" stroke-width="11" stroke-linecap="round" opacity=".55"/>
  <path d="M-50 -112 C-30 -96 0 -88 30 -90" fill="none" stroke="${US.hairLo}" stroke-width="7" stroke-linecap="round" opacity=".6"/>
  <circle cx="-118" cy="36" r="8" fill="${C.cream}"/><circle cx="118" cy="36" r="8" fill="${C.cream}"/>
  <circle cx="-76" cy="44" r="26" fill="${C.pink}" opacity="${n2(0.42 * f.blush)}"/><circle cx="76" cy="44" r="26" fill="${C.pink}" opacity="${n2(0.42 * f.blush)}"/>
  <g fill="${US.skinLo}" opacity=".7">${[[-88, 30], [-70, 40], [-92, 50], [88, 30], [70, 40], [92, 50], [-10, 22], [10, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5"/>`).join("")}</g>
  <g transform="translate(0 -4)">${eye(-46, f, -1, tt)}${eye(46, f, 1, tt)}${brow(-46, f, -1, US.hairLo)}${brow(46, f, 1, US.hairLo)}</g>
  <path d="M-7 30 Q2 42 12 30" fill="none" stroke="${US.skinLo}" stroke-width="7" stroke-linecap="round"/>
  ${mouth(f)}`;
}
function head(f, p) {
  if (p.look === "us") return headUS(f, p);
  const tt = p.tt ?? 0, tails = p.tails ?? 0;      // tails: swing of the scarf ends, degrees
  return `
  <g transform="rotate(${n2(18 + tails)} 108 -62)"><path d="M100 -70 C150 -62 176 -22 170 30 C150 14 128 -4 96 -40 Z" fill="${C.scarfLo}"/></g>
  <g transform="rotate(${n2(-6 + tails * 1.4)} 108 -62)"><path d="M100 -76 C160 -90 204 -64 214 -18 C180 -30 140 -36 98 -48 Z" fill="${C.scarf}"/></g>
  <ellipse cx="0" cy="0" rx="118" ry="124" fill="url(#mSkin)"/>
  <path d="M-126 -22 C-150 -150 -70 -176 0 -176 C70 -176 150 -150 126 -22 C104 -74 60 -100 0 -102 C-60 -100 -104 -74 -126 -22 Z" fill="url(#mScarf)"/>
  <path d="M-96 -112 C-60 -150 30 -160 86 -128" fill="none" stroke="${C.scarfHi}" stroke-width="10" stroke-linecap="round" opacity=".55"/>
  ${[[-70, -132], [-20, -150], [36, -146], [84, -120], [-100, -94], [108, -86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${C.cream}" opacity=".85"/>`).join("")}
  <circle cx="110" cy="-66" r="22" fill="${C.scarfLo}"/><circle cx="106" cy="-70" r="15" fill="${C.scarf}"/>
  <circle cx="-116" cy="34" r="12" fill="none" stroke="${C.sun}" stroke-width="6"/><circle cx="116" cy="34" r="12" fill="none" stroke="${C.sun}" stroke-width="6"/>
  <circle cx="-76" cy="44" r="26" fill="${C.pink}" opacity="${n2(0.42 * f.blush)}"/><circle cx="76" cy="44" r="26" fill="${C.pink}" opacity="${n2(0.42 * f.blush)}"/>
  <g transform="translate(0 -4)">${eye(-46, f, -1, tt)}${eye(46, f, 1, tt)}${brow(-46, f, -1)}${brow(46, f, 1)}</g>
  <path d="M-7 30 Q2 42 12 30" fill="none" stroke="${C.skinLo}" stroke-width="7" stroke-linecap="round"/>
  ${mouth(f)}`;
}
// One arm, drawn the "rubber hose" way: a single curved stroke from shoulder to wrist, so there is no hinge to see.
// The elbow is only a control point. Its side is chosen continuously (outward and a little downward), so the arm
// straightens and re-bends instead of snapping when a pose changes. The hand is a mitt with a thumb, turned by the
// end of the curve plus a wrist lag (H.drag) that the animation supplies.
const BONE = 128;
function arm(S, H, side, held = "", handRot = 0, back = false, over = false, us = false) {
  let dx = H.x - S.x, dy = H.y - S.y, d = Math.hypot(dx, dy) || 1e-3; const max = 2 * BONE * 1.12;
  if (d > max) { dx *= max / d; dy *= max / d; d = max; }
  const Hc = { x: S.x + dx, y: S.y + dy }, nx = -dy / d, ny = dx / d;
  const h = Math.max(Math.min(Math.sqrt(Math.max(0, BONE * BONE - d * d / 4)), 0.42 * d + 14, 96), 0.09 * d);   // a soft bow: never a hairpin, never perfectly straight
  const bend = clamp((side * nx + 0.6 * ny) * 2.2, -1, 1);
  const E = { x: S.x + dx / 2 + nx * h * bend, y: S.y + dy / 2 + ny * h * bend };
  const K = { x: 2 * E.x - (S.x + Hc.x) / 2, y: 2 * E.y - (S.y + Hc.y) / 2 };              // the curve passes through E
  const path = `M${n2(S.x)} ${n2(S.y)} Q${n2(K.x)} ${n2(K.y)} ${n2(Hc.x)} ${n2(Hc.y)}`;
  const ang = Math.atan2(Hc.y - K.y, Hc.x - K.x) * 180 / Math.PI - 90 + handRot + (H.drag ?? 0);
  const gl = back ? C.gloveLo : C.glove, sl = back ? "#D98F12" : C.sun, fist = !!held;
  const mitt = fist
    ? `<ellipse cx="0" cy="6" rx="40" ry="38" fill="${gl}"/><ellipse cx="${-side * 22}" cy="20" rx="24" ry="15" transform="rotate(${side * 18} ${-side * 22} 20)" fill="${gl}"/><path d="M-20 34 q10 8 20 0 M2 36 q10 6 18 -4" fill="none" stroke="${C.gloveLo}" stroke-width="5" stroke-linecap="round" opacity="${back ? 0 : 0.8}"/>`
    : `<path d="M-31 -26 C-37 6 -30 40 -14 50 C-4 56 6 56 16 50 C32 40 37 6 31 -26 C20 -36 -20 -36 -31 -26Z" fill="${gl}"/>
       <ellipse cx="${-side * 36}" cy="-4" rx="13" ry="25" transform="rotate(${-side * 30} ${-side * 36} -4)" fill="${gl}"/>
       <path d="M-9 50 v-20 M9 50 v-22" stroke="${C.gloveLo}" stroke-width="5" stroke-linecap="round" opacity="${back ? 0 : 0.75}"/>`;
  if (us) return `<path d="${path}" fill="none" stroke="${gl}" stroke-width="56" stroke-linecap="round"/>
    <path d="${path}" pathLength="100" fill="none" stroke="${back ? US.skinLo : US.skin}" stroke-width="54" stroke-linecap="round" stroke-dasharray="44 100"/>
    <path d="${path}" pathLength="100" fill="none" stroke="${C.gloveLo}" stroke-width="66" stroke-dasharray="0 44 6 100"/>
    <path d="${path}" pathLength="100" fill="none" stroke="${back ? US.shirtLo : US.shirt}" stroke-width="80" stroke-linecap="round" stroke-dasharray="22 100"/>
    <path d="${path}" pathLength="100" fill="none" stroke="${back ? "#B8463A" : US.shirtLo}" stroke-width="82" stroke-dasharray="0 22 3 100"/>
    <g transform="translate(${n2(Hc.x)} ${n2(Hc.y)}) rotate(${n2(ang)})">${back || over ? "" : held}${mitt}${back || over ? held : ""}</g>`;
  return `<path d="${path}" fill="none" stroke="${gl}" stroke-width="56" stroke-linecap="round"/>
    <path d="${path}" pathLength="100" fill="none" stroke="${C.gloveLo}" stroke-width="62" stroke-dasharray="0 60 5 100"/>
    <path d="${path}" pathLength="100" fill="none" stroke="${sl}" stroke-width="78" stroke-linecap="round" stroke-dasharray="47 100"/>
    <path d="${path}" pathLength="100" fill="none" stroke="${back ? "#C9700F" : C.orange}" stroke-width="80" stroke-dasharray="0 47.5 4 100"/>
    <g transform="translate(${n2(Hc.x)} ${n2(Hc.y)}) rotate(${n2(ang)})">${back || over ? "" : held}${mitt}${back || over ? held : ""}</g>`;
}
// The American look below the neck: an old oversized T-shirt with a faded star, jeans rolled at the ankle, fuzzy slippers.
const TEE = "M-132 -604 C-168 -500 -186 -380 -184 -262 Q0 -232 184 -262 C186 -380 168 -500 132 -604 Q0 -652 -132 -604 Z";
function bodyUS(chest, hx, hy) {
  const leg = (side) => `<path d="M${side * 18} -280 L${side * 132} -280 C${side * 140} -200 ${side * 136} -110 ${side * 124} -40 L${side * 40} -40 C${side * 34} -120 ${side * 22} -200 ${side * 18} -280Z" fill="${US.jeans}"/>
      <path d="M${side * 38} -64 L${side * 126} -64 L${side * 124} -30 L${side * 40} -30Z" fill="${US.jeansHi}"/><path d="M${side * 104} -250 C${side * 112} -190 ${side * 110} -130 ${side * 102} -80" fill="none" stroke="${US.jeansLo}" stroke-width="8" stroke-linecap="round" opacity=".6"/>`;
  return `
    <g transform="scale(1.1 0.86)">${leg(-1)}${leg(1)}</g>
    <ellipse cx="-84" cy="-8" rx="70" ry="26" fill="${C.pinkLo}"/><ellipse cx="84" cy="-8" rx="70" ry="26" fill="${C.pinkLo}"/>
    <ellipse cx="-84" cy="-16" rx="66" ry="22" fill="${C.pink}"/><ellipse cx="84" cy="-16" rx="66" ry="22" fill="${C.pink}"/>
    ${[-120, -100, -70, -48, 48, 70, 100, 120].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? -30 : -34}" r="11" fill="${C.pinkHi}" opacity=".8"/>`).join("")}
    <g transform="scale(${n2(1.1 + chest * 0.05)} 0.86)"><path d="${TEE}" fill="url(#mShirtUS)"/>
    <g clip-path="url(#mTeeClip)"><path d="M-200 -300 Q0 -270 200 -300 L200 -230 L-200 -230Z" fill="${US.shirtLo}"/>
      <g transform="translate(-6 -430)" opacity=".85"><circle r="74" fill="none" stroke="${C.cream}" stroke-width="12" stroke-dasharray="20 12"/><path d="${star(48, 20, 5)}" fill="${C.cream}"/></g>
      <ellipse cx="150" cy="-420" rx="80" ry="240" fill="#B8463A" opacity=".2"/></g>
    </g>
    <path d="${SCOOP}Z" fill="${US.skin}"/>
    <g clip-path="url(#mScoopClip)"><ellipse cx="${n2(hx * 0.7)}" cy="${n2(-652 + hy + 150)}" rx="118" ry="64" fill="${US.skinLo}" opacity=".8"/></g>
    <path d="${SCOOP}" fill="none" stroke="${US.shirtLo}" stroke-width="19" stroke-linecap="round"/><path d="${SCOOP}" fill="none" stroke="${US.shirtHi}" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
}
export function mom(p = {}) {
  const f = { ...FACE.neutral, ...(p.face || {}) };
  const sq = p.squash ?? 0, lean = p.lean ?? 0, breath = p.breath ?? 0, chest = p.chest ?? 0;      // chest: 0..1 puffed up
  const hx = p.headX ?? 0, hy = (p.headY ?? 0) - breath * 5 - chest * 14, ht = p.headTilt ?? 0;
  const idle = Math.sin((p.tt ?? 0) * 1.7) * 5;
  const HL = p.handL || { x: -205 - idle, y: -235 }, HR = p.handR || { x: 205 + idle, y: -235 };
  // the shoulder lifts and reaches a little when its hand goes up or out
  const sh = (side, H) => { const up = clamp((-492 - H.y + 40) / 260), out = clamp((side * H.x - 240) / 160); return { x: side * (122 + 8 * out + 4 * up), y: -492 - breath * 4 - chest * 10 - 20 * up }; };
  const SL = sh(-1, HL), SR = sh(1, HR);
  const dots = [[-60, -470], [50, -430], [-110, -330], [10, -300], [120, -340], [-150, -190], [-40, -170], [80, -200], [160, -150], [-100, -80], [30, -70], [130, -60]];
  const us = p.look === "us";
  const body = us ? bodyUS(chest, hx, hy) : `
    <ellipse cx="-84" cy="-6" rx="64" ry="22" fill="${C.pinkLo}"/><ellipse cx="84" cy="-6" rx="64" ry="22" fill="${C.pinkLo}"/>
    <ellipse cx="-84" cy="-12" rx="60" ry="18" fill="${C.pink}"/><ellipse cx="84" cy="-12" rx="60" ry="18" fill="${C.pink}"/>
    <g transform="scale(${n2(1.1 + chest * 0.05)} 0.86)"><path d="${DRESS}" fill="url(#mDress)"/>
    <g clip-path="url(#mDressClip)">${dots.map(([x, y], i) => `<g transform="translate(${x} ${y})"><circle r="15" fill="${C.orange}"/><circle r="6" fill="${C.cream}"/></g>`).join("")}
      <path d="M-240 -70 Q0 -30 240 -70 L240 20 L-240 20Z" fill="${C.orange}"/><path d="M-240 -70 Q0 -30 240 -70" fill="none" stroke="${C.cream}" stroke-width="8" stroke-dasharray="2 22" stroke-linecap="round"/>
      <ellipse cx="150" cy="-320" rx="90" ry="330" fill="#B8560E" opacity=".22"/></g>
    </g>
    <path d="${SCOOP}Z" fill="${C.skin}"/>
    <g clip-path="url(#mScoopClip)"><ellipse cx="${n2(hx * 0.7)}" cy="${n2(-652 + hy + 150)}" rx="118" ry="64" fill="${C.skinLo}" opacity=".8"/></g>
    <path d="${SCOOP}" fill="none" stroke="${C.orange}" stroke-width="17" stroke-linecap="round"/><path d="${SCOOP}" fill="none" stroke="${C.cream}" stroke-width="6" stroke-dasharray="2 15" stroke-linecap="round"/>`;
  const hd = G(T(hx, -652 + hy, ht, 1.34), head(f, p));
  const aL = arm(SL, HL, -1, p.heldL || "", p.rotL ?? 0, p.backL ?? false, p.overL ?? false, us), aR = arm(SR, HR, 1, p.heldR || "", p.rotR ?? 0, p.backR ?? false, p.overR ?? false, us);
  const inner = `${p.backL ? aL : ""}${p.backR ? aR : ""}${body}${p.headFront === false ? hd : ""}${p.backL ? "" : aL}${p.backR ? "" : aR}${p.headFront === false ? "" : hd}`;
  return G(`rotate(${n2(lean)}) scale(${n2(1 + sq * 0.5)} ${n2(1 - sq)})`, inner);
}
export const momDefs = `
  <radialGradient id="mSkin" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="${C.skinHi}"/><stop offset=".6" stop-color="${C.skin}"/><stop offset="1" stop-color="${C.skinLo}"/></radialGradient>
  <linearGradient id="mScarf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.scarfHi}"/><stop offset=".45" stop-color="${C.scarf}"/><stop offset="1" stop-color="${C.scarfLo}"/></linearGradient>
  <linearGradient id="mDress" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC84A"/><stop offset=".6" stop-color="${C.sun}"/><stop offset="1" stop-color="#EE9A12"/></linearGradient>
  <clipPath id="mDressClip"><path d="${DRESS}"/></clipPath><clipPath id="mScoopClip"><path d="${SCOOP}Z"/></clipPath>`;
// Extra definitions for the American look (add next to momDefs; they do not change the original look).
export const momDefsUS = `
  <radialGradient id="mSkinUS" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="${US.skinHi}"/><stop offset=".6" stop-color="${US.skin}"/><stop offset="1" stop-color="${US.skinLo}"/></radialGradient>
  <linearGradient id="mHairUS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${US.hairHi}"/><stop offset=".5" stop-color="${US.hair}"/><stop offset="1" stop-color="${US.hairLo}"/></linearGradient>
  <linearGradient id="mShirtUS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${US.shirtHi}"/><stop offset=".55" stop-color="${US.shirt}"/><stop offset="1" stop-color="${US.shirtLo}"/></linearGradient>
  <clipPath id="mTeeClip"><path d="${TEE}"/></clipPath>`;
