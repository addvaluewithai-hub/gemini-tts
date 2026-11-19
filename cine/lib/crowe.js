// Agent Crowe on a rig: the black silhouette of Episode 1, now with joints and a real walk (the owner liked him black;
// what was wrong was that he slid like a paper cut-out). A shaded, drawn version of him is kept behind `dark: false`.
// He replaces sets/night.js `crowe` from Episode 2 on; Episode 1 keeps the old one.
//
// Feet on (0, 0), about 1170 tall with the hat, facing right in three-quarter view (mirror the group to face left).
//   crowe({ dark, walk, hand, aim, handL, lean, crouch, nod, glint, led, ledO, torch, jaw, filter, shadow, halo, haloO })
//     dark     true (the default) is the look the owner chose: the black silhouette of Episode 1 with its warm outline
//              (halo, haloO), only the glasses, the detector and the torch lens alight. false is the shaded, drawn
//              figure (it takes filter and jaw; the silhouette ignores them).
//     walk     distance walked so far, in his own units: the feet plant and the body bobs, with no sliding.
//              One full cycle (two steps) is WALK_CYCLE units; leave it undefined to stand.
//     hand     { x, y } where the torch hand is (default: held forward at chest height)
//     aim      which way the torch points, in degrees (0 = right, negative = up)
//     handL    { x, y } for the other hand (default: hanging; it carries the wrist detector)
//     lean     degrees the body leans forward from the hips; crouch 0..1 lowers the hips and bends the knees
//     nod      degrees the head tips down (negative = up)
//     glint    0..1, how bright the lenses of his glasses are; led / ledO the detector light's colour and brightness
//     torch    0..1, the torch lens glow; jaw 0..1 opens the mouth for speech
//     filter   a lighting filter id (act.js `night(...)`) for the whole figure
//   croweHands(o) -> { near: [x, y], far: [x, y], lens: [x, y] }   in the same coordinates, for beams and props
import { def } from "./fx.js";

export const WALK_CYCLE = 360;                         // two steps of 180
const HIP_Y = -452, THIGH = 216, SHIN = 214, UPPER = 168, FORE = 150, TORCH = 128;
const rad = (d) => d * Math.PI / 180, mixn = (a, b, p) => a + (b - a) * p, frac = (x) => x - Math.floor(x);
const sm = (u) => u * u * (3 - 2 * u);

function grads() {
  const lin = (id, attrs, stops) => def(id, `<linearGradient id="${id}" ${attrs}>${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("")}</linearGradient>`);
  const radg = (id, attrs, stops) => def(id, `<radialGradient id="${id}" ${attrs}>${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("")}</radialGradient>`);
  lin("cwCoat", 'x1="0" y1="0" x2="1" y2="0"', [[0, "#262b3a"], [0.18, "#59637d"], [0.42, "#454e66"], [0.78, "#2b3144"], [1, "#171a26"]]);
  lin("cwCoatD", 'x1="0" y1="0" x2="0" y2="1"', [[0, "#000", 0], [0.6, "#000", 0.08], [1, "#000", 0.38]]);
  lin("cwSleeve", 'x1="0" y1="0" x2="0" y2="1"', [[0, "#262b3a"], [0.32, "#5a6480"], [0.6, "#3f4860"], [1, "#191c29"]]);
  lin("cwLeg", 'x1="0" y1="0" x2="0" y2="1"', [[0, "#12141d"], [0.36, "#3a4156"], [0.62, "#2a3042"], [1, "#0d0f16"]]);
  lin("cwLapel", 'x1="0" y1="0" x2="1" y2="1"', [[0, "#4b556e"], [1, "#1c2030"]]);
  lin("cwShirt", 'x1="0" y1="0" x2="1" y2="0"', [[0, "#f3f5fa"], [1, "#b4bccd"]]);
  lin("cwTie", 'x1="0" y1="0" x2="1" y2="0"', [[0, "#b03445"], [1, "#5c1622"]]);
  lin("cwBelt", 'x1="0" y1="0" x2="0" y2="1"', [[0, "#30364a"], [0.4, "#1b1f2c"], [1, "#0c0e15"]]);
  radg("cwSkin", 'cx=".3" cy=".3" r=".95"', [[0, "#f6dcc1"], [0.55, "#dcb292"], [1, "#a97a5f"]]);
  lin("cwBrimShade", 'x1="0" y1="0" x2="0" y2="1"', [[0, "#070913", 0.92], [0.55, "#070913", 0.7], [1, "#070913", 0]]);
  radg("cwHat", 'cx=".28" cy=".2" r="1"', [[0, "#5d667f"], [0.5, "#2c3142"], [1, "#11131b"]]);
  lin("cwBrim", 'x1="0" y1="0" x2="1" y2="1"', [[0, "#586078"], [0.5, "#272b3a"], [1, "#0e1017"]]);
  lin("cwBand", 'x1="0" y1="0" x2="1" y2="0"', [[0, "#b23a4c"], [1, "#641a27"]]);
  radg("cwGlove", 'cx=".35" cy=".3" r=".9"', [[0, "#4a5066"], [0.6, "#1b1e2a"], [1, "#08090e"]]);
  lin("cwShoe", 'x1="0" y1="0" x2="0" y2="1"', [[0, "#474d61"], [0.35, "#1a1c26"], [1, "#050609"]]);
  lin("cwTorch", 'x1="0" y1="0" x2="0" y2="1"', [[0, "#8d95aa"], [0.4, "#3d4356"], [1, "#12141c"]]);
  radg("cwLens", 'cx=".4" cy=".35" r=".8"', [[0, "#ffffff"], [0.5, "#bfe6ff"], [1, "#5fb4e6"]]);
}

// two-bone reach from (ax, ay) to (tx, ty): the joint and the (clamped) end
function ik(ax, ay, tx, ty, l1, l2, bend) {
  let dx = tx - ax, dy = ty - ay, d = Math.hypot(dx, dy); const max = l1 + l2 - 2;
  if (d > max) { dx *= max / d; dy *= max / d; d = max; } if (d < 8) { d = 8; dy = 8; dx = 0; }
  const a = Math.atan2(dy, dx), c = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), ja = a + bend * c;
  return [ax + Math.cos(ja) * l1, ay + Math.sin(ja) * l1, ax + dx, ay + dy];
}
const limb = (ax, ay, bx, by, w, g, w2 = w) => { const L = Math.hypot(bx - ax, by - ay), a = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
  return `<g transform="translate(${ax.toFixed(1)} ${ay.toFixed(1)}) rotate(${a.toFixed(1)})"><path d="M0 ${-w / 2} L${L.toFixed(1)} ${-w2 / 2} A${w2 / 2} ${w2 / 2} 0 0 1 ${L.toFixed(1)} ${w2 / 2} L0 ${w / 2} A${w / 2} ${w / 2} 0 0 1 0 ${-w / 2} Z"${g ? ` fill="url(#${g})"` : ""}/></g>`; };

// where one foot is in the walk cycle: q in 0..1 (0 - 0.5 planted and sliding back under the body, 0.5 - 1 swinging forward)
function step(q, S) {
  if (q < 0.5) { const u = q / 0.5; return { x: S / 2 - u * S, y: 0, pitch: u > 0.8 ? (u - 0.8) / 0.2 * 16 : u < 0.12 ? -(0.12 - u) / 0.12 * 10 : 0 }; }
  const u = (q - 0.5) / 0.5; return { x: -S / 2 + sm(u) * S, y: -Math.sin(Math.PI * u) * 62, pitch: mixn(22, -12, sm(u)) };
}

function pose(o) {
  const { walk, lean = 0, crouch = 0, aim = -8 } = o, S = WALK_CYCLE / 2;
  const walking = walk != null, p = walking ? frac(walk / WALK_CYCLE) : 0;
  const bob = walking ? 9 * (1 + Math.cos(4 * Math.PI * p)) / 2 : 0, drop = bob + crouch * 190;
  const near = walking ? step(p, S) : { x: 34, y: 0, pitch: 0 }, far = walking ? step(frac(p + 0.5), S) : { x: -30, y: 0, pitch: 0 };
  const swing = walking ? Math.sin(2 * Math.PI * p) : 0;
  const a = rad(lean), ca = Math.cos(a), sa = Math.sin(a);
  const out = (x, y) => [x * ca - (y - HIP_Y) * sa, HIP_Y + x * sa + (y - HIP_Y) * ca + drop];          // torso frame -> his own frame
  const inn = (x, y) => { const yy = y - drop - HIP_Y; return [x * ca + yy * sa, HIP_Y - x * sa + yy * ca]; };   // and back
  const [dnx, dny] = out(232, -706 + swing * -8), [dfx, dfy] = out(-142 - swing * 70, -508 + Math.abs(swing) * 14);
  const hand = o.hand || { x: dnx, y: dny }, handL = o.handL || { x: dfx, y: dfy };
  const sN = [84, -792], sF = [-98, -794], hN = inn(hand.x, hand.y), hF = inn(handL.x, handL.y);
  const armN = ik(sN[0], sN[1], hN[0], hN[1], UPPER, FORE, 1), armF = ik(sF[0], sF[1], hF[0], hF[1], UPPER, FORE, hF[0] > sF[0] + 40 ? 1 : 1);
  const lens = out(armN[2] + Math.cos(rad(aim - lean)) * TORCH, armN[3] + Math.sin(rad(aim - lean)) * TORCH);
  return { S, walking, p, drop, near, far, swing, armN, armF, sN, sF, lens, out, near_: out(armN[2], armN[3]), far_: out(armF[2], armF[3]) };
}
export function croweHands(o = {}) { const q = pose(o); return { near: q.near_, far: q.far_, lens: q.lens }; }

const shoe = (x, y, pitch) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${pitch.toFixed(1)})"><path d="M-34 -30 C-40 -8 -40 0 -30 0 L84 0 C92 0 92 -16 78 -22 C56 -30 30 -34 16 -40 L-20 -40 Z" fill="url(#cwShoe)"/><path d="M-36 -6 L88 -6 L88 0 L-34 0 Z" fill="#030407"/><path d="M26 -30 C44 -27 60 -22 72 -17" fill="none" stroke="#8a93ab" stroke-width="4" stroke-linecap="round" opacity=".5"/></g>`;
function leg(hx, hy, f) {
  const ax = f.x, ay = -36 + f.y, [kx, ky] = ik(hx, hy, ax, ay, THIGH, SHIN, -1);
  return limb(hx, hy, kx, ky, 62, "cwLeg", 54) + limb(kx, ky, ax, ay, 54, "cwLeg", 44) + shoe(ax - 8, ay + 36, f.pitch);
}

// ---- the look the owner chose: the black silhouette of Episode 1 (the same head, quiff and long coat), now on the walking rig
function dark(o, q) {
  const { lean = 0, nod = 0, glint = 1, led = "#46ff7a", ledO = 1, torch = 1, aim = -8, halo = "#ffd9a0", haloO = 0.85, shadow = false } = o;
  const hipN = [14, HIP_Y + q.drop], hipF = [-12, HIP_Y + q.drop];
  const legD = (hx, hy, f) => { const ax = f.x, ay = -34 + f.y, [kx, ky] = ik(hx, hy, ax, ay, THIGH, SHIN, -1);
    return limb(hx, hy, kx, ky, 50, null, 42) + limb(kx, ky, ax, ay, 42, null, 32) + `<g transform="translate(${(ax - 6).toFixed(1)} ${(ay + 34).toFixed(1)}) rotate(${f.pitch.toFixed(1)})"><path d="M-30 -30 C-38 -8 -38 0 -28 0 L80 0 C88 0 88 -16 74 -22 C52 -30 28 -32 16 -40 L-18 -40 Z"/></g>`; };
  const legs = legD(hipF[0], hipF[1], q.far) + legD(hipN[0], hipN[1], q.near);
  // the coat's hem follows the legs a moment late: it opens with the stride and swings back
  const lag = q.walking ? Math.sin(2 * Math.PI * q.p - 0.9) : 0, open = q.walking ? Math.abs(q.swing) : 0;
  const fwd = Math.max(q.near.x, q.far.x) - 34, back = Math.min(q.near.x, q.far.x) + 30;
  const a1 = -150 + back * 0.55 + lag * 10, e1 = 112 + fwd * 0.5 + lag * 10, mid = lag * 14;
  const coat = `<path d="M-60 -822 C-108 -812 -118 -760 -110 -690 L-100 -330 C-104 -280 ${(a1 + 22).toFixed(1)} -250 ${a1.toFixed(1)} ${(-224 - open * 8).toFixed(1)} L${(-60 + back * 0.3 + mid).toFixed(1)} -214 L${mid.toFixed(1)} ${(-232 + open * 6).toFixed(1)} L${(70 + fwd * 0.3 + mid).toFixed(1)} -214 L${e1.toFixed(1)} ${(-226 - open * 8).toFixed(1)} C${(e1 - 8).toFixed(1)} -270 100 -300 102 -340 L108 -690 C116 -760 104 -814 62 -822 Z"/>`;
  const headT = `rotate(${nod} 4 -850)`;
  const head = `<g transform="${headT}"><path d="M-52 -838 L-84 -770 L-26 -800 Z"/><path d="M54 -838 L86 -770 L28 -800 Z"/><rect x="-16" y="-860" width="36" height="64" rx="10"/>
    <path d="M-40 -1000 C-46 -1052 40 -1062 50 -1004 L54 -930 C64 -926 70 -910 58 -904 L56 -876 C54 -850 30 -838 4 -838 C-24 -838 -42 -852 -42 -880 Z"/>
    <path d="M-44 -1000 C-52 -1070 30 -1086 62 -1040 C40 -1048 14 -1040 -6 -1022 C-20 -1010 -34 -1004 -44 -1000 Z"/></g>`;
  const [fex, fey, fhx, fhy] = q.armF, fa = Math.atan2(fhy - fey, fhx - fex) * 180 / Math.PI, farT = `translate(${fhx.toFixed(1)} ${fhy.toFixed(1)}) rotate(${fa.toFixed(1)})`;
  const armFar = limb(q.sF[0], q.sF[1], fex, fey, 42, null, 40) + limb(fex, fey, fhx, fhy, 40, null, 36) + `<g transform="${farT}"><rect x="-46" y="-30" width="84" height="60" rx="8"/></g>`;
  const [nex, ney, nhx, nhy] = q.armN, ta = aim - lean, nearT = `translate(${nhx.toFixed(1)} ${nhy.toFixed(1)}) rotate(${ta.toFixed(1)})`;
  const armNear = limb(q.sN[0] - 10, q.sN[1] + 10, nex, ney, 44, null, 40) + limb(nex, ney, nhx, nhy, 40, null, 36)
    + `<g transform="${nearT}"><circle cx="6" cy="0" r="24"/><rect x="-12" y="-17" width="112" height="34" rx="8"/><rect x="${TORCH - 30}" y="-25" width="30" height="50" rx="6"/></g>`;
  const torso = `<g transform="translate(0 ${q.drop.toFixed(1)}) rotate(${lean} 0 ${HIP_Y})">`;
  const shape = `${torso}${armFar}</g>${legs}${torso}${coat}${head}${armNear}</g>`;
  const lights = `${torso}<g transform="${headT}"><ellipse cx="20" cy="-952" rx="13" ry="8" fill="#bfe6ff" opacity="${(0.85 * glint).toFixed(2)}"/><ellipse cx="50" cy="-952" rx="9" ry="7" fill="#bfe6ff" opacity="${(0.7 * glint).toFixed(2)}"/></g>
    <g transform="${farT}"><rect x="-30" y="-20" width="30" height="40" rx="4" fill="${led}" opacity="${ledO}"/></g><g transform="${nearT}"><rect x="${TORCH - 4}" y="-22" width="6" height="44" rx="3" fill="#fff6dc" opacity="${(0.9 * torch).toFixed(2)}"/></g></g>`;
  return (shadow ? `<ellipse cx="10" cy="4" rx="170" ry="26" fill="#03040a" opacity=".45"/>` : "")
    + `<g fill="${halo}" opacity="${haloO}" transform="translate(-5 -4) scale(1.012)">${shape}</g><g fill="#04050e">${shape}</g>${lights}`;
}

export function crowe(o = {}) {
  if (o.dark !== false) return dark(o, pose(o));
  grads();
  const { lean = 0, nod = 0, glint = 1, led = "#46ff7a", ledO = 1, torch = 1, jaw = 0, aim = -8, shadow = false, filter = null } = o;
  const q = pose(o), sway = q.walking ? Math.sin(2 * Math.PI * q.p + 0.6) * 16 : 0, flare = q.walking ? Math.abs(q.swing) * 10 : 0;
  const hipN = [16, HIP_Y + q.drop], hipF = [-14, HIP_Y + q.drop];
  const legs = leg(hipF[0], hipF[1], q.far) + leg(hipN[0], hipN[1], q.near);

  // the far arm (behind the coat), with the detector on its wrist
  const [fex, fey, fhx, fhy] = q.armF, fa = Math.atan2(fhy - fey, fhx - fex) * 180 / Math.PI;
  const armFar = limb(q.sF[0], q.sF[1], fex, fey, 62, "cwSleeve", 50) + limb(fex, fey, fhx, fhy, 50, "cwSleeve", 42)
    + `<g transform="translate(${fhx.toFixed(1)} ${fhy.toFixed(1)}) rotate(${fa.toFixed(1)})"><rect x="-58" y="-27" width="24" height="54" rx="6" fill="#151823"/><rect x="-60" y="-36" width="44" height="46" rx="8" fill="#232838"/><rect x="-54" y="-30" width="32" height="24" rx="4" fill="${led}" opacity="${ledO}"/><ellipse cx="16" cy="0" rx="26" ry="24" fill="url(#cwGlove)"/></g>`;

  // the coat: shoulders, a belted waist, a hem that flares and swings with the walk
  const hl = -150 - flare + sway, hr = 134 + flare + sway;
  const coatD = `M-66 -832 C-104 -832 -132 -806 -128 -746 L-104 -566 C-112 -480 -128 -370 ${hl} -262 Q${(hl + hr) / 2} -236 ${hr} -254 C120 -366 106 -480 98 -566 L116 -746 C122 -806 100 -832 62 -834 Z`;
  def("cwB8", `<filter id="cwB8" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>`);
  const coat = `<clipPath id="cwCoatClip"><path d="${coatD}"/></clipPath><path d="${coatD}" fill="url(#cwCoat)"/><path d="${coatD}" fill="url(#cwCoatD)"/>
    <g clip-path="url(#cwCoatClip)"><ellipse cx="6" cy="-806" rx="110" ry="46" fill="#05060c" opacity=".5" filter="url(#cwB8)"/><ellipse cx="0" cy="-532" rx="130" ry="22" fill="#05060c" opacity=".45" filter="url(#cwB8)"/>
      <path d="M-98 -760 C-92 -660 -82 -600 -84 -572 M-90 -530 C-98 -440 -112 -350 ${hl + 26} -280" fill="none" stroke="#b8c2dc" stroke-width="16" stroke-linecap="round" opacity=".3" filter="url(#cwB8)"/></g>
    <path d="M10 -546 C16 -440 ${14 + sway * 0.6} -340 ${18 + sway} -250" fill="none" stroke="#10121b" stroke-width="7" stroke-linecap="round" opacity=".85"/>
    <path d="M30 -540 C40 -440 ${44 + sway * 0.6} -340 ${52 + sway} -252" fill="none" stroke="#6f7994" stroke-width="5" stroke-linecap="round" opacity=".25"/>
    <path d="M-70 -520 C-78 -430 -92 -340 ${-104 + sway} -268" fill="none" stroke="#10121b" stroke-width="6" stroke-linecap="round" opacity=".35"/>
    <path d="M-106 -584 L100 -584 L99 -544 L-105 -544 Z" fill="url(#cwBelt)"/><rect x="-8" y="-590" width="50" height="52" rx="8" fill="none" stroke="#aeb6c9" stroke-width="8"/><rect x="12" y="-574" width="26" height="8" rx="4" fill="#aeb6c9"/>
    ${[[-26, -700], [44, -700], [-22, -636], [46, -636]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#11131b"/><circle cx="${x - 3}" cy="${y - 3}" r="4" fill="#7c86a0" opacity=".8"/>`).join("")}
    <path d="M-30 -830 L10 -690 L52 -830 Z" fill="url(#cwShirt)"/><path d="M2 -822 L22 -822 L26 -796 L18 -712 L10 -696 L2 -712 L-2 -796 Z" fill="url(#cwTie)"/><path d="M-2 -826 L26 -826 L22 -800 L2 -800 Z" fill="#7d202e"/>
    <path d="M-46 -846 L-86 -772 L4 -676 L12 -702 Z" fill="url(#cwLapel)"/><path d="M62 -846 L92 -776 L14 -676 L10 -702 Z" fill="url(#cwLapel)"/>
    <path d="M-46 -846 L-86 -772 L-60 -744" fill="none" stroke="#7d87a2" stroke-width="4" stroke-linecap="round" opacity=".5"/>
    <path d="M-52 -866 L-92 -800 L-40 -822 Z" fill="#2a3042"/><path d="M62 -866 L96 -800 L50 -824 Z" fill="#1d2130"/>`;

  // the head, a little big for his body as a toy's would be: a long rounded jaw with stubble, a long drooping nose, round
  // glasses that catch the light, a grim mouth, and everything above the mouth in the shadow of the brim
  const FACE = "M-52 -1004 C-58 -940 -52 -888 -24 -864 C2 -842 44 -840 60 -864 C74 -884 70 -914 67 -936 C66 -962 66 -984 66 -1004 Z";
  const NOSE = "M56 -964 C82 -954 112 -924 110 -906 C108 -890 84 -888 62 -898 Z";
  def("cwFaceClip", `<clipPath id="cwFaceClip"><path d="${FACE}"/><path d="${NOSE}"/></clipPath>`);
  def("cwB8", `<filter id="cwB8" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>`);
  const lensGlow = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#141826"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#cwLens)" opacity="${(0.1 + 0.9 * glint).toFixed(2)}"/><ellipse cx="${cx - rx * 0.3}" cy="${cy - ry * 0.35}" rx="${rx * 0.3}" ry="${ry * 0.2}" fill="#fff" opacity="${(0.3 + 0.55 * glint).toFixed(2)}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#0c0e16" stroke-width="7"/>`;
  const head = `<g transform="rotate(${nod} 6 -850) translate(6 -850) scale(1.26) translate(-6 850)">
    <path d="M-20 -880 C-18 -850 -22 -826 -26 -806 L32 -806 C28 -826 26 -850 28 -880 Z" fill="#b98a6c"/><path d="M-20 -880 L28 -880 L27 -842 C10 -834 -8 -836 -21 -846 Z" fill="#05060c" opacity=".5"/>
    <path d="M-34 -836 L6 -800 L-38 -792 Z" fill="#eef1f7"/><path d="M40 -836 L10 -800 L46 -794 Z" fill="#c9d0de"/>
    <ellipse cx="-46" cy="-934" rx="14" ry="23" fill="#cf9f80"/><ellipse cx="-47" cy="-934" rx="6" ry="12" fill="#a97a5f"/>
    <path d="${FACE}" fill="url(#cwSkin)"/><path d="${NOSE}" fill="url(#cwSkin)"/>
    <g clip-path="url(#cwFaceClip)">
      <path d="M-50 -906 C-42 -872 -22 -858 4 -850 C30 -842 56 -850 64 -872 C68 -886 68 -898 66 -910 C52 -892 22 -884 -8 -892 C-26 -896 -40 -902 -50 -906 Z" fill="#4f5b78" opacity=".3" filter="url(#cwB8)"/>
      <rect x="-70" y="-1010" width="200" height="118" fill="url(#cwBrimShade)"/>
    </g>
    <path d="M66 -958 C84 -948 100 -930 104 -914" fill="none" stroke="#fbe9d6" stroke-width="5" stroke-linecap="round" opacity=".55"/>
    <path d="M60 -898 C54 -890 54 -882 58 -876" fill="none" stroke="#8a5c45" stroke-width="4" stroke-linecap="round" opacity=".55"/>
    <path d="M-54 -1004 C-58 -960 -56 -930 -50 -914 C-42 -910 -36 -914 -34 -924 L-32 -1004 Z" fill="#20222c"/>
    ${jaw > 0.04 ? `<ellipse cx="44" cy="-870" rx="15" ry="${(3 + jaw * 11).toFixed(1)}" fill="#2a0d12"/>` : ""}<path d="M24 -866 Q42 -${jaw > 0.04 ? 884 : 877} 61 -864" fill="none" stroke="#5a2f2c" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M30 -850 Q43 -846 54 -851" fill="none" stroke="#8a5c45" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>
    <path d="M-44 -944 L-4 -950" stroke="#0c0e16" stroke-width="7" stroke-linecap="round"/><path d="M34 -952 L42 -952" stroke="#0c0e16" stroke-width="7" stroke-linecap="round"/>
    ${lensGlow(16, -950, 22, 21)}${lensGlow(54, -950, 14, 19)}
    <g transform="rotate(-5 6 -1000)">
      <path d="M-64 -1002 C-74 -1066 -56 -1100 -18 -1104 C-4 -1092 12 -1092 26 -1106 C62 -1102 80 -1068 74 -1002 Z" fill="url(#cwHat)"/>
      <path d="M-65 -1032 C-20 -1020 30 -1020 75 -1032 L74 -1002 L-64 -1002 Z" fill="url(#cwBand)"/>
      <path d="M-42 -1090 C-56 -1068 -58 -1048 -56 -1038" fill="none" stroke="#aab3cb" stroke-width="8" stroke-linecap="round" opacity=".35"/>
      <ellipse cx="8" cy="-998" rx="124" ry="23" fill="url(#cwBrim)"/><path d="M-112 -1005 C-62 -1023 78 -1023 128 -1005" fill="none" stroke="#a3acc4" stroke-width="4" stroke-linecap="round" opacity=".55"/>
      <path d="M-116 -998 C-64 -977 80 -977 132 -998 C84 -983 -68 -983 -116 -998 Z" fill="#05060b" opacity=".85"/>
    </g></g>`;

  // the torch arm, in front of everything
  const [nex, ney, nhx, nhy] = q.armN, ta = aim - lean;
  const na = Math.atan2(nhy - ney, nhx - nex) * 180 / Math.PI;
  const armNear = `<circle cx="${q.sN[0]}" cy="${q.sN[1] + 2}" r="35" fill="url(#cwSleeve)"/>` + limb(q.sN[0], q.sN[1], nex, ney, 66, "cwSleeve", 52) + limb(nex, ney, nhx, nhy, 52, "cwSleeve", 44)
    + `<g transform="translate(${nhx.toFixed(1)} ${nhy.toFixed(1)}) rotate(${na.toFixed(1)})"><rect x="-44" y="-25" width="14" height="50" rx="5" fill="#141722"/></g>`
    + `<g transform="translate(${nhx.toFixed(1)} ${nhy.toFixed(1)}) rotate(${ta.toFixed(1)})"><rect x="-26" y="-17" width="118" height="34" rx="9" fill="url(#cwTorch)"/><path d="M84 -19 L110 -27 L${TORCH} -27 L${TORCH} 27 L110 27 L84 19 Z" fill="url(#cwTorch)"/>
      <rect x="${TORCH - 5}" y="-25" width="8" height="50" rx="3" fill="#fff6dc" opacity="${(0.25 + 0.75 * torch).toFixed(2)}"/><rect x="8" y="-17" width="10" height="34" fill="#0c0e15" opacity=".6"/>
      <ellipse cx="20" cy="2" rx="29" ry="26" fill="url(#cwGlove)"/><path d="M2 -12 C14 -22 32 -22 42 -10" fill="none" stroke="#6a7189" stroke-width="5" stroke-linecap="round" opacity=".6"/></g>`;

  const torso = `<g transform="translate(0 ${q.drop.toFixed(1)}) rotate(${lean} 0 ${HIP_Y})">`;
  const body = `${torso}${armFar}</g>${legs}${torso}${coat}${head}${armNear}</g>`;
  return (shadow ? `<ellipse cx="10" cy="4" rx="170" ry="26" fill="#03040a" opacity=".45"/>` : "") + (filter ? `<g filter="url(#${filter})">${body}</g>` : body);
}
