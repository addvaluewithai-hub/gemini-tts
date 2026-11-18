// Episode 2 props, kept apart from night.js so Episode 1 cannot change: the enormous Moon, the paper bag of apples,
// the bitten apple, a lit window that breaks, the space station, the dime, and the orbit maths for the board.
import { def, rnd, clamp, lerp } from "../lib/fx.js";
import * as X from "../lib/explain.js";

const at = (x, y, k, rot, inner) => `<g transform="translate(${(+x).toFixed(1)} ${(+y).toFixed(1)}) rotate(${(+rot || 0).toFixed(2)}) scale(${(+k).toFixed(3)})">${inner}</g>`;

// ---- the Moon as Peek sees it: enormous, lit, with soft maria and craters (centre x, y; radius r)
export function bigMoon(x, y, r, glow = 1) {
  def("bmg", `<radialGradient id="bmg" cx=".4" cy=".36" r=".72"><stop offset="0" stop-color="#fffdf2"/><stop offset=".65" stop-color="#f1e9cf"/><stop offset="1" stop-color="#c4bb9f"/></radialGradient>`);
  def("bmglow", `<radialGradient id="bmglow"><stop offset=".3" stop-color="#e6eeff" stop-opacity=".55"/><stop offset=".55" stop-color="#9fb8ff" stop-opacity=".16"/><stop offset="1" stop-color="#9fb8ff" stop-opacity="0"/></radialGradient>`);
  const maria = [[-0.3, -0.25, 0.3, 0.22, -20], [0.18, -0.1, 0.22, 0.3, 30], [0.25, 0.32, 0.26, 0.16, 10], [-0.42, 0.22, 0.16, 0.24, -30], [0.0, 0.05, 0.14, 0.1, 0]];
  const craters = Array.from({ length: 14 }, (_, i) => { const a = rnd(i * 7 + 1) * 6.28, d = Math.sqrt(rnd(i * 3 + 2)) * 0.82, cr = 0.03 + rnd(i * 5 + 3) * 0.07;
    return `<circle cx="${(Math.cos(a) * d * r).toFixed(1)}" cy="${(Math.sin(a) * d * r).toFixed(1)}" r="${(cr * r).toFixed(1)}" fill="#a79f86" opacity=".35"/><circle cx="${(Math.cos(a) * d * r - cr * r * 0.25).toFixed(1)}" cy="${(Math.sin(a) * d * r - cr * r * 0.25).toFixed(1)}" r="${(cr * r * 0.7).toFixed(1)}" fill="#fffbe8" opacity=".25"/>`; }).join("");
  return at(x, y, 1, 0, `<circle r="${r * 2.1}" fill="url(#bmglow)" opacity="${glow}"/><circle r="${r}" fill="url(#bmg)"/>
    ${maria.map(([a, b, c, d, rot]) => `<ellipse cx="${a * r}" cy="${b * r}" rx="${c * r}" ry="${d * r}" fill="#b3ab92" opacity=".33" transform="rotate(${rot} ${a * r} ${b * r})"/>`).join("")}${craters}
    <circle r="${r}" fill="none" stroke="#fff8e0" stroke-width="${r * 0.02}" opacity=".5"/>`);
}

// ---- an apple with a bite out of it: two big front-tooth marks in the flesh (like Peek's two teeth)
export function bitten(x, y, r = 60, rot = 0, bite = 1, teeth = 1) {
  if (bite <= 0) return X.apple(x, y, r, rot);
  def("biteM", `<mask id="biteM" maskUnits="userSpaceOnUse" x="-120" y="-120" width="240" height="240"><rect x="-120" y="-120" width="240" height="240" fill="#fff"/><circle cx="66" cy="-2" r="34" fill="#000"/><circle cx="52" cy="-30" r="14" fill="#000"/><circle cx="52" cy="26" r="14" fill="#000"/></mask>`);
  const apple = X.apple(0, 0, 60, 0);
  return at(x, y, r / 60, rot, `<g mask="url(#biteM)">${apple}<path d="M40 -46 C24 -24 22 22 40 44" fill="none" stroke="#fff4d2" stroke-width="16" stroke-linecap="round"/></g>
    <path d="M38 -40 C26 -22 24 20 38 40" fill="none" stroke="#fffbe8" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <g opacity="${teeth}"><rect x="28" y="-19" width="13" height="17" rx="3" fill="#7a5426"/><rect x="28" y="2" width="13" height="17" rx="3" fill="#7a5426"/></g>`);
}

// ---- a brown paper bag of apples (base at 0, 0, about 220 tall)
export const bag = (n = 3) => `<path d="M-90 0 L-104 -190 L104 -190 L90 0 Z" fill="#b98a4e"/><path d="M-104 -190 L-80 -214 L80 -214 L104 -190 Z" fill="#d7a96a"/>
  <path d="M-70 -150 L-62 -20 M10 -170 L12 -30" stroke="#8d6533" stroke-width="5" opacity=".5"/>
  ${[[-46, -214, -10], [34, -222, 20], [-4, -240, 4]].slice(0, n).map(([x, y, r]) => X.apple(x, y, 44, r)).join("")}`;

// ---- a lit window (x, y top-left, w, h) that breaks at p 0..1: the glass flies, the room goes dark
export function windowPane(x, y, w, h, p = 0, t = 0) {
  const lit = p <= 0 ? 1 : Math.max(0.25, 1 - p * 0.9);
  const frame = `<rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" fill="#0b0920"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffcf7a" opacity="${(0.75 * lit).toFixed(2)}"/>`;
  if (p <= 0) return frame + `<path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.45} H${x + w}" stroke="#0b0920" stroke-width="8"/>`;
  const shards = Array.from({ length: 16 }, (_, i) => { const a = rnd(i * 5) * 6.28, v = 260 + rnd(i * 3) * 520, sx = x + w * (0.2 + 0.6 * rnd(i * 11)), sy = y + h * (0.2 + 0.6 * rnd(i * 13));
    const px = sx + Math.cos(a) * v * p, py = sy + Math.sin(a) * v * p * 0.6 + 900 * p * p, s = 10 + rnd(i * 7) * 18;
    return `<path d="M${px} ${py} l${s} ${-s * 0.4} l${-s * 0.3} ${s} Z" fill="#e8f6ff" opacity="${(0.9 * (1 - p * 0.6)).toFixed(2)}" transform="rotate(${(p * 700 + i * 40).toFixed(0)} ${px} ${py})"/>`; }).join("");
  const crack = `<path d="M${x + w * 0.5} ${y + h * 0.5} L${x} ${y + h * 0.2} M${x + w * 0.5} ${y + h * 0.5} L${x + w} ${y + h * 0.1} M${x + w * 0.5} ${y + h * 0.5} L${x + w * 0.2} ${y + h} M${x + w * 0.5} ${y + h * 0.5} L${x + w} ${y + h * 0.8}" stroke="#e8f6ff" stroke-width="5" opacity=".7"/>`;
  return frame + `<path d="M${x} ${y} h${w * 0.3} l${-w * 0.12} ${h * 0.3} Z M${x + w} ${y + h} h${-w * 0.25} l${w * 0.15} ${-h * 0.28} Z" fill="#e8f6ff" opacity=".7"/>` + crack + shards;
}

// ---- the space station, small and simple: a body, a module, two solar wings (centre x, y; size k; rot degrees)
export const station = (x, y, k = 1, rot = 0) => at(x, y, k, rot, `<rect x="-150" y="-12" width="300" height="24" rx="6" fill="#9aa4c8"/>
  ${[-1, 1].map((s) => `<g transform="translate(${s * 150} 0)"><rect x="-26" y="-90" width="52" height="180" fill="#2a4fb8" stroke="#9fd0ff" stroke-width="3"/><path d="M-26 -45 H26 M-26 0 H26 M-26 45 H26" stroke="#9fd0ff" stroke-width="2" opacity=".6"/></g>`).join("")}
  <rect x="-60" y="-30" width="120" height="60" rx="26" fill="#e8ecf8"/><rect x="-20" y="-46" width="40" height="92" rx="16" fill="#cfd6ee"/><circle cx="34" cy="0" r="10" fill="#57c8ff"/>`);

// ---- a US dime seen at an angle, with its thickness showing (centre x, y; radius r)
export const dime = (x, y, r = 50, flip = 0) => { const sy = Math.max(0.12, Math.abs(Math.cos(flip * Math.PI))), th = r * 0.09;
  return at(x, y, 1, 0, `<ellipse cx="0" cy="${th}" rx="${r}" ry="${r * sy}" fill="#8d939e"/><rect x="${-r}" y="0" width="${2 * r}" height="${th}" fill="#8d939e"/>
    <ellipse cx="0" cy="0" rx="${r}" ry="${r * sy}" fill="#d9dde4"/><ellipse cx="0" cy="0" rx="${r * 0.82}" ry="${r * 0.82 * sy}" fill="none" stroke="#a7adb8" stroke-width="3"/>
    <ellipse cx="${-r * 0.3}" cy="${-r * 0.3 * sy}" rx="${r * 0.3}" ry="${r * 0.12 * sy}" fill="#fff" opacity=".6"/>`); };

// ---- the bolted moon of Peek's home planet (centre x, y; radius r), a wrench beside it
export const boltedMoon = (x, y, r) => at(x, y, 1, 0, `<circle r="${r}" fill="#c9a3ff"/><circle r="${r}" fill="none" stroke="#efe0ff" stroke-width="5" opacity=".6"/>
  <circle cx="${-r * 0.3}" cy="${-r * 0.2}" r="${r * 0.18}" fill="#a77fe0" opacity=".6"/><circle cx="${r * 0.25}" cy="${r * 0.3}" r="${r * 0.22}" fill="#a77fe0" opacity=".6"/>
  ${[45, 135, 225, 315].map((d) => { const a = d * Math.PI / 180, bx = Math.cos(a) * r * 0.98, by = Math.sin(a) * r * 0.98;
    return `<path d="M${bx} ${by} L${bx + Math.cos(a) * r * 0.5} ${by + Math.sin(a) * r * 0.5}" stroke="#8a90a8" stroke-width="${r * 0.12}" stroke-linecap="round"/><polygon points="${[0, 1, 2, 3, 4, 5].map((k) => `${(bx + Math.cos(k * 1.047) * r * 0.14).toFixed(1)},${(by + Math.sin(k * 1.047) * r * 0.14).toFixed(1)}`).join(" ")}" fill="#c3c8da" stroke="#5a607a" stroke-width="3"/>`; }).join("")}`);

// ---- orbit maths: a throw from radius r0 (planet radius 1, GM 1), horizontal speed f times the circular speed there.
// Integrated with small steps (velocity Verlet); stops on landing or after one full turn. Points are [x, y, t] with
// y up; the throw starts at the top (0, r0) moving to +x, so the path runs clockwise.
export function throwPath(f, r0 = 1.15, steps = 6000) {
  const vc = Math.sqrt(1 / r0), T = 2 * Math.PI * Math.sqrt(r0 ** 3);
  let x = 0, y = r0, vx = f * vc, vy = 0, t = 0, ang = 0, landed = false;
  const dt = T / steps, pts = [[x, y, 0]];
  const acc = (x, y) => { const r = Math.hypot(x, y), k = -1 / (r * r * r); return [k * x, k * y]; };
  let [ax, ay] = acc(x, y);
  for (let i = 0; i < steps * 1.02; i++) {
    x += vx * dt + 0.5 * ax * dt * dt; y += vy * dt + 0.5 * ay * dt * dt;
    const [nx, ny] = acc(x, y); vx += 0.5 * (ax + nx) * dt; vy += 0.5 * (ay + ny) * dt; ax = nx; ay = ny; t += dt;
    const r = Math.hypot(x, y); ang = Math.atan2(x, y); if (ang < 0) ang += 2 * Math.PI;
    if (r <= 1) { const k = (1 / r); pts.push([x * k, y * k, t]); landed = true; break; }
    if (i > steps * 0.5 && ang < 0.02) { pts.push([0, r0, t]); break; }
    if (i % 4 === 0) pts.push([x, y, t]);
  }
  return { pts, landed, T, dur: t };
}
// the point a fraction p of the way (by time) along a path, and the path drawn so far
export function along(path, p) {
  const tt = clamp(p) * path.dur, pts = path.pts; let i = 1; while (i < pts.length - 1 && pts[i][2] < tt) i++;
  const [x0, y0, t0] = pts[i - 1], [x1, y1, t1] = pts[i], u = t1 > t0 ? clamp((tt - t0) / (t1 - t0)) : 1;
  return { x: lerp(x0, x1, u), y: lerp(y0, y1, u), i };
}
export const trail = (path, p, map, attrs = "") => { const { x, y, i } = along(path, p); if (p <= 0) return "";
  const d = path.pts.slice(0, i).map(([px, py]) => map(px, py)).concat([map(x, y)]).map(([a, b], k) => `${k ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join("");
  return `<path d="${d}" fill="none" ${attrs}/>`; };
