// Mama: the co-star. An Egyptian mother on cleaning day: house galabeya with flowers, headscarf tied for work,
// yellow rubber gloves, plastic slippers. Local space: feet at (0,0), head near y = -640, about 780 tall.
import { tr, g, f1, ik, nextId, clamp, lerp, mix, rnd, blink } from "./lib.js";

export const MC = { skin: "#D9A06E", skinLo: "#BE8253", dress: "#FF7A3D", dressLo: "#E85B26", dressHi: "#FF9A5C", scarf: "#5B34B8", scarfLo: "#45258F", scarfHi: "#7C56DB", glove: "#FFD23F", gloveLo: "#F0AE10", slipper: "#2FA8FF", brow: "#3B2416" };

function eye(cx, cy, p, side) {
  const id = nextId("me"), rx = 25 * (p.eyeScale ?? 1), ry = 29 * (p.eyeScale ?? 1);
  const lid = clamp((side < 0 ? p.lidL ?? p.lid : p.lidR ?? p.lid) ?? 0.1), squint = clamp(p.squint ?? 0);
  const lx = clamp(p.look?.[0] ?? 0, -1, 1) * 10, ly = clamp(p.look?.[1] ?? 0, -1, 1) * 10, sick = p.sick ?? 0;
  const white = mix("#FFFFFF", "#FFB3B3", sick * 0.9), skin = p._skin, tilt = (p.browTilt ?? 0) * side * 14;
  if (lid >= 0.98) return `<path transform="${tr(cx, cy)}" d="M${-rx} 2 Q 0 ${p.happy ? -16 : 14} ${rx} 2" fill="none" stroke="${MC.brow}" stroke-width="7" stroke-linecap="round"/>`;
  return `<g transform="${tr(cx, cy)}"><clipPath id="${id}"><ellipse rx="${f1(rx)}" ry="${f1(ry)}"/></clipPath>
    <g clip-path="url(#${id})"><ellipse rx="${f1(rx)}" ry="${f1(ry)}" fill="${white}"/>
      <circle cx="${f1(lx)}" cy="${f1(ly)}" r="${f1(14 * (p.pupil ?? 1))}" fill="#2B170D"/><circle cx="${f1(lx - 5)}" cy="${f1(ly - 6)}" r="4.5" fill="#fff"/>
      <g transform="rotate(${f1(tilt)})"><rect x="${-rx * 2}" y="${f1(-ry * 3 + 2 * ry * lid)}" width="${rx * 4}" height="${ry * 2}" fill="${skin.lo}"/></g>
      <rect x="${-rx * 2}" y="${f1(ry - 2 * ry * squint * 0.45)}" width="${rx * 4}" height="${ry * 2}" fill="${skin.lo}"/></g>
    <path d="M${f1(-rx - 1)} ${f1(-ry * (0.5 - lid * 0.9))} Q 0 ${f1(-ry * (1.25 - lid * 1.9))} ${f1(rx + 1)} ${f1(-ry * (0.5 - lid * 0.9))}" transform="rotate(${f1(tilt)})" fill="none" stroke="${MC.brow}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M${f1(side * (rx + 1))} ${f1(-ry * (0.5 - lid * 0.9))} l ${side * 11} -8" stroke="${MC.brow}" stroke-width="5" stroke-linecap="round"/></g>`;
}

function mouth(p) {
  const m = p.mouth || {}, type = m.type || "smile", o = clamp(m.open ?? 0), sm = m.smile ?? 0.5, y = -572, w = 30 * (m.w ?? 1);
  const dark = "#5A1E1E";
  if (type === "o") return `<ellipse cx="0" cy="${y + 4}" rx="${f1(11 + o * 8)}" ry="${f1(8 + o * 16)}" fill="${dark}"/>`;
  if (type === "cough") return `<path d="M${-w} ${y - 4} Q 0 ${y - 16} ${w} ${y - 4} Q ${w * 1.15} ${f1(y + 16 + o * 30)} 0 ${f1(y + 20 + o * 34)} Q ${-w * 1.15} ${f1(y + 16 + o * 30)} ${-w} ${y - 4} Z" fill="${dark}"/><path d="M${-w * 0.7} ${y - 6} Q 0 ${y - 14} ${w * 0.7} ${y - 6} L ${w * 0.62} ${y + 4} Q 0 ${y - 2} ${-w * 0.62} ${y + 4} Z" fill="#fff"/><ellipse cx="0" cy="${f1(y + 14 + o * 28)}" rx="${f1(w * 0.5)}" ry="${f1(5 + o * 8)}" fill="#E8697A"/>`;
  if (type === "grit") return `<rect x="${-w}" y="${y - 9}" width="${w * 2}" height="22" rx="10" fill="#fff" stroke="${dark}" stroke-width="5"/><path d="M${-w * 0.4} ${y - 9} v 22 M ${w * 0.4} ${y - 9} v 22 M 0 ${y - 9} v 22" stroke="${dark}" stroke-width="3" opacity=".5"/>`;
  if (type === "wobble") return `<path d="M${-w} ${y + 4} q ${w * 0.25} -12 ${w * 0.5} 0 t ${w * 0.5} 0 t ${w * 0.5} 0 t ${w * 0.5} 0" fill="none" stroke="${dark}" stroke-width="6.5" stroke-linecap="round"/>`;
  if (type === "grin" || o > 0.08) return `<path d="M${-w} ${f1(y - sm * 8)} Q 0 ${f1(y + sm * 6)} ${w} ${f1(y - sm * 8)} Q ${w * 0.8} ${f1(y + 12 + o * 30 + sm * 14)} 0 ${f1(y + 14 + o * 34 + sm * 16)} Q ${-w * 0.8} ${f1(y + 12 + o * 30 + sm * 14)} ${-w} ${f1(y - sm * 8)} Z" fill="${dark}"/><path d="M${-w * 0.78} ${f1(y - sm * 6 + 1)} Q 0 ${f1(y + sm * 6 + 2)} ${w * 0.78} ${f1(y - sm * 6 + 1)} L ${w * 0.66} ${f1(y + 7)} Q 0 ${f1(y + 12 + sm * 4)} ${-w * 0.66} ${f1(y + 7)} Z" fill="#fff"/>`;
  return `<path d="M${-w} ${f1(y - sm * 10)} Q 0 ${f1(y + sm * 22)} ${w} ${f1(y - sm * 10)}" fill="none" stroke="${dark}" stroke-width="7" stroke-linecap="round"/>`;
}

function arm(side, target, p) {
  const sx = side * 108, sy = -498;
  const h = target || { x: side * 176, y: -268 };
  const k = ik(sx, sy, h.x, h.y, 122, 128, target?.bend ?? -side);
  const ang = Math.atan2(k.hy - k.ey, k.hx - k.ex) * 180 / Math.PI, rot = target?.rot ?? 0;
  const mx = lerp(k.ex, k.hx, 0.38), my = lerp(k.ey, k.hy, 0.38);
  const skin = p._skin;
  const held = target?.held ? (target.heldWorld ? `<g transform="rotate(${f1(-(ang + rot))})">${target.held}</g>` : target.held) : "";
  return `<path d="M${sx} ${sy} L ${f1(k.ex)} ${f1(k.ey)} L ${f1(k.hx)} ${f1(k.hy)}" fill="none" stroke="${skin.base}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${sx} ${sy} L ${f1(lerp(sx, k.ex, 0.72))} ${f1(lerp(sy, k.ey, 0.72))}" fill="none" stroke="${MC.dress}" stroke-width="58" stroke-linecap="round"/>
    <circle cx="${f1(lerp(sx, k.ex, 0.72))}" cy="${f1(lerp(sy, k.ey, 0.72))}" r="31" fill="${MC.dressLo}"/>
    <path d="M${f1(mx)} ${f1(my)} L ${f1(k.hx)} ${f1(k.hy)}" fill="none" stroke="${MC.glove}" stroke-width="50" stroke-linecap="round"/>
    <g transform="${tr(mx, my, ang)}"><rect x="-10" y="-30" width="22" height="60" rx="9" fill="${MC.gloveLo}"/></g>
    <g transform="${tr(k.hx, k.hy, ang + rot)}">${held && !target.heldFront ? held : ""}
      <circle cx="16" cy="0" r="33" fill="${MC.glove}"/><ellipse cx="12" cy="${-side * 30}" rx="15" ry="11" fill="${MC.glove}"/>
      ${target?.hand === "point" ? `<rect x="26" y="-11" width="50" height="22" rx="11" fill="${MC.glove}"/>` : ""}
      ${target?.hand === "pinky" ? `<rect x="14" y="${side * 14}" width="44" height="16" rx="8" transform="rotate(${side * 28} 14 ${side * 20})" fill="${MC.glove}"/>` : ""}
      <circle cx="24" cy="-10" r="10" fill="#FFE98A" opacity=".8"/>${held && target.heldFront ? held : ""}</g>`;
}

const FLOWERS = Array.from({ length: 34 }, (_, i) => [-210 + rnd(i * 3 + 1) * 420, -520 + rnd(i * 3 + 2) * 480, 0.7 + rnd(i * 3 + 3) * 0.6, rnd(i * 7) * 90]);

export function mama(p = {}) {
  if (p.t !== undefined) { const b = blink(p.t, 5); p = { ...p, lid: lerp(p.lid ?? 0.1, 1, b), lidL: p.lidL === undefined ? undefined : lerp(p.lidL, 1, b), lidR: p.lidR === undefined ? undefined : lerp(p.lidR, 1, b), squash: (p.squash ?? 0) + 0.008 * Math.sin(p.t * 2.3) }; }
  const s = p.s ?? 1, sq = p.squash ?? 0, sick = clamp(p.sick ?? 0);
  const skin = { base: mix(MC.skin, "#B9B77A", sick * 0.75), lo: mix(MC.skinLo, "#97975C", sick * 0.75) };
  p = { ...p, _skin: skin };
  const turn = clamp(p.turn ?? 0, -1, 1) * 16;            // a small head turn: features slide, scarf stays
  const hr = p.headRot ?? 0, hx = p.headX ?? 0, hy = p.headY ?? 0, sway = p.scarfSway ?? 0;
  const dressId = nextId("md"), faceId = nextId("mf");
  const dressPath = `M-112 -530 C -150 -520 -150 -420 -160 -330 C -172 -220 -214 -120 -206 -52 Q 0 -22 206 -52 C 214 -120 172 -220 160 -330 C 150 -420 150 -520 112 -530 Q 0 -560 -112 -530 Z`;
  const flowers = FLOWERS.map(([x, y, k, r]) => `<g transform="${tr(x, y, r, k)}"><circle r="8" cx="0" cy="-11" fill="#FFF3D6"/><circle r="8" cx="11" cy="0" fill="#FFF3D6"/><circle r="8" cx="0" cy="11" fill="#FFF3D6"/><circle r="8" cx="-11" cy="0" fill="#FFF3D6"/><circle r="6.5" fill="#FFD23F"/></g>`).join("");
  const body = `
    <rect x="-78" y="-70" width="40" height="64" rx="16" fill="${skin.lo}"/><rect x="38" y="-70" width="40" height="64" rx="16" fill="${skin.lo}"/>
    <g transform="${tr(-58, -6, -4)}"><rect x="-52" y="-16" width="104" height="30" rx="15" fill="${MC.slipper}"/><rect x="-30" y="-30" width="50" height="22" rx="11" fill="#1479D6"/></g>
    <g transform="${tr(58, -6, 4)}"><rect x="-52" y="-16" width="104" height="30" rx="15" fill="${MC.slipper}"/><rect x="-20" y="-30" width="50" height="22" rx="11" fill="#1479D6"/></g>
    <clipPath id="${dressId}"><path d="${dressPath}"/></clipPath>
    <path d="${dressPath}" fill="${MC.dress}"/>
    <g clip-path="url(#${dressId})">${flowers}
      <path d="M-240 -110 Q 0 -70 240 -110 L 240 0 L -240 0 Z" fill="${MC.dressLo}"/>
      <path d="M-240 -118 Q 0 -78 240 -118" fill="none" stroke="#FFD23F" stroke-width="9"/>
      <path d="M110 -540 C 170 -430 190 -200 230 -40 L 300 -40 L 300 -560 Z" fill="${MC.dressLo}" opacity=".45"/>
      <path d="M-46 -548 L 0 -440 L 46 -548 Z" fill="${MC.dressLo}"/><path d="M-46 -548 L 0 -440 L 46 -548" fill="none" stroke="#FFD23F" stroke-width="9" stroke-linejoin="round"/>
      <circle cx="0" cy="-408" r="8" fill="#FFD23F"/><circle cx="0" cy="-374" r="8" fill="#FFD23F"/></g>`;
  const head = `<g transform="${tr(hx, -530 + hy, hr, 1.3)}"><g transform="translate(0 530)">
    <rect x="-28" y="-560" width="56" height="50" rx="20" fill="${skin.lo}"/>
    <g transform="${tr(96 - turn * 0.5, -596, 18 + sway * 22)}"><path d="M0 0 C 40 -6 78 14 96 48 C 60 44 26 36 0 22 Z" fill="${MC.scarfLo}"/></g>
    <g transform="${tr(100 - turn * 0.5, -606, -6 + sway * 30)}"><path d="M0 0 C 44 -22 86 -14 112 8 C 74 20 34 22 0 20 Z" fill="${MC.scarf}"/></g>
    <ellipse cx="${f1(-turn * 0.4)}" cy="-656" rx="138" ry="140" fill="${MC.scarf}"/>
    <circle cx="${f1(104 - turn * 0.5)}" cy="-600" r="24" fill="${MC.scarfHi}"/>
    <clipPath id="${faceId}"><ellipse cx="${f1(turn * 0.5)}" cy="-630" rx="106" ry="112"/></clipPath>
    <ellipse cx="${f1(turn * 0.5)}" cy="-630" rx="106" ry="112" fill="${skin.base}"/>
    <g clip-path="url(#${faceId})"><ellipse cx="${f1(turn * 0.5)}" cy="-520" rx="130" ry="50" fill="${skin.lo}" opacity=".5"/>
      <path d="M-160 -790 L 160 -790 L 160 -716 Q ${f1(turn)} -662 -160 -716 Z" fill="${MC.scarf}"/>
      <path d="M-160 -716 Q ${f1(turn)} -662 160 -716" fill="none" stroke="${MC.scarfHi}" stroke-width="12"/></g>
    ${[[-70, -742], [-18, -764], [44, -758], [92, -728], [-104, -706], [118, -676], [-124, -650]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#FF7FBF"/>`).join("")}
    <g transform="translate(${f1(turn)} 0)">
      <ellipse cx="-66" cy="-596" rx="24" ry="15" fill="#F0705A" opacity="${f1(0.42 + (p.blush ?? 0) * 0.4 - sick * 0.3)}"/><ellipse cx="66" cy="-596" rx="24" ry="15" fill="#F0705A" opacity="${f1(0.42 + (p.blush ?? 0) * 0.4 - sick * 0.3)}"/>
      ${eye(-42, -642, p, -1)}${eye(42, -642, p, 1)}
      ${[-1, 1].map((sd) => { const raise = (sd < 0 ? p.browL : p.browR) ?? 0, tilt = (p.browTilt ?? 0) * sd * 20; return `<path transform="${tr(sd * 44, -690 - raise * 18, tilt)}" d="M-27 4 Q 0 -8 27 4" fill="none" stroke="${MC.brow}" stroke-width="10" stroke-linecap="round"/>`; }).join("")}
      <path d="M-5 -618 Q 12 -604 -3 -598" fill="none" stroke="${skin.lo}" stroke-width="7" stroke-linecap="round"/>
      ${mouth(p)}
      ${(p.tears ?? 0) > 0 ? [-1, 1].map((sd) => `<path d="M${sd * 44} -616 q ${sd * 10} 26 ${sd * 6} ${f1(20 + 60 * clamp(p.tears))}" fill="none" stroke="#8FE0FF" stroke-width="11" stroke-linecap="round" opacity=".95"/><circle cx="${sd * 50}" cy="${f1(-592 + 62 * clamp(p.tears))}" r="9" fill="#8FE0FF"/>`).join("") : ""}
      ${p.sweat ? `<path transform="${tr(-96, -700 + p.sweat * 40)}" d="M0 -18 C 11 -3 13 5 13 10 A 13 13 0 0 1 -13 10 C -13 5 -11 -3 0 -18 Z" fill="#9FE3FF" opacity="${f1(clamp(1.3 - p.sweat))}"/>` : ""}
    </g></g></g>`;
  const order = (front) => [-1, 1].map((sd) => { const t = sd < 0 ? p.armL : p.armR; return !(t && t.back) === front ? arm(sd, t, p) : ""; }).join("");
  const inner = `<ellipse cx="0" cy="8" rx="${f1(200 * (1 + sq))}" ry="24" fill="#03222E" opacity=".25"/>` +
    g(`rotate(${f1(p.lean ?? 0)}) scale(${f1((1 + sq * 0.6) * 100) / 100} ${f1((1 - sq) * 100) / 100})`, order(false) + body + head + order(true));
  return g(tr(p.x ?? 0, p.y ?? 0, 0, s * (p.flip ? -1 : 1), s), inner);
}
