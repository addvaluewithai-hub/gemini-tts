// Shorts lab 07 "snooze" (format: humans guide): the props card above Peek, who stays big in the studio. Always drawn
// at 1920 x 1080, so in a Short it sits as a card over the host (it is never a full-frame set). No text, no people.
//   0 the alarm clock held up like evidence: it rings and shakes under a spotlight
//   1 the clock set down on a small bedside table; an arrow-like glint points at it
//   2 night: the hands are set to six, the knob turning, the moon in the window
//   3 six o'clock: the clock rings exactly on time, the window turns to dawn
//   4 the pillow swings down and flattens the clock (the human's slap, no human drawn)
//   5 close on one big button on the clock's top, glowing, Zz above it
//   6 the clock rings again; the pillow slams again and stays on top of it
//   7 the scoreboard: a pillow with four tally marks, a clock with none
//   8 the clock reads 7:40, the pillow flies off, the clock stands there with innocent eyes, a red ✗ over it
//   9 the clock rings on its own in the empty room at six, nobody comes (the invasion plan)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, at, rr, two, disc, rings, text, frame, drawn, cross } from "./kit.js";
import { P } from "./bank.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const dur = (s, k, d) => (s.ends && s.ends[k]) || d;
const ROOM = { wall: "#2c2766", wallD: "#241f58", night: "#141a45", dawn: "#ffb066", floor: "#3a2a6a" };

// the alarm clock: two bells on top, a face with hands at h:m, little feet; ring: 0..1 how hard it rings (t: time)
export function alarm(h, m, ring = 0, t = 0, o = {}) {
  const sh = ring * 9 * Math.sin(t * 55), ah = ((h % 12) + m / 60) / 12 * Math.PI * 2 - Math.PI / 2, am = m / 60 * Math.PI * 2 - Math.PI / 2;
  const bell = (x, r) => at(x, -238, `<path d="M-46 22A46 46 0 0 1 46 22Z" fill="${P.gold}"/><path d="M-46 22H46" stroke="${P.goldD}" stroke-width="10"/>`, 1, r);
  const lines = ring > 0.05 ? [-1, 1].map((d) => `<path d="M${d * 150} -250q${d * 26} 30 0 60M${d * 182} -270q${d * 38} 50 0 100" fill="none" stroke="${P.gold}" stroke-width="10" stroke-linecap="round" opacity="${(ring * (0.55 + 0.45 * Math.sin(t * 24))).toFixed(2)}"/>`).join("") : "";
  const eyes = o.eyes ? `<ellipse cx="-38" cy="-150" rx="16" ry="${o.eyes}" fill="${P.ink}"/><ellipse cx="38" cy="-150" rx="16" ry="${o.eyes}" fill="${P.ink}"/>` : "";
  const body = `${bell(-82, -22 + sh * 2)}${bell(82, 22 - sh * 2)}<path d="M0 -200V-236" stroke="${P.steelD}" stroke-width="12"/><circle cx="0" cy="-242" r="13" fill="${P.steelD}"/>
    <path d="M-80 -18L-110 26M80 -18L110 26" stroke="${P.ink}" stroke-width="16" stroke-linecap="round"/>
    ${two("M-150 -110a150 150 0 1 0 300 0a150 150 0 1 0 -300 0Z", o.c || P.red, o.cD || P.redD, 10, 0)}
    <circle cx="0" cy="-110" r="118" fill="#fffaf0"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = i / 12 * Math.PI * 2; return `<path d="M${(Math.cos(a) * 96).toFixed(1)} ${(-110 + Math.sin(a) * 96).toFixed(1)}L${(Math.cos(a) * 108).toFixed(1)} ${(-110 + Math.sin(a) * 108).toFixed(1)}" stroke="${P.ink}" stroke-width="${i % 3 ? 5 : 10}" stroke-linecap="round"/>`; }).join("")}
    ${eyes}<path d="M0 -110L${(Math.cos(ah) * 58).toFixed(1)} ${(-110 + Math.sin(ah) * 58).toFixed(1)}" stroke="${P.ink}" stroke-width="14" stroke-linecap="round"/><path d="M0 -110L${(Math.cos(am) * 88).toFixed(1)} ${(-110 + Math.sin(am) * 88).toFixed(1)}" stroke="${P.ink}" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="-110" r="12" fill="${P.ink}"/>`;
  return at(sh, -Math.abs(sh) * 0.6, body, 1, sh * 0.8) + lines;
}
const pillow = (squash = 0) => two(`M-200 ${-70 + 30 * squash}Q0 ${-120 + 40 * squash} 200 ${-70 + 30 * squash}Q230 0 200 ${60 - 10 * squash}Q0 ${100 - 20 * squash} -200 ${60 - 10 * squash}Q-230 0 -200 ${-70 + 30 * squash}Z`, "#f4f1ff", "#c9c2ea", 0, 12);
const table = () => `${two(rr(-260, -30, 520, 40, 12), P.wood, P.woodD, 0, 10)}<path d="M-220 10V240M220 10V240" stroke="${P.woodD}" stroke-width="22" stroke-linecap="round"/>`;
const windowPane = (k, t) => { const dawn = clamp(k); return `<path d="${rr(-170, -170, 340, 340, 18)}" fill="#1a1446"/><path d="${rr(-150, -150, 300, 300, 10)}" fill="${dawn > 0 ? `#${[20, 26, 69].map((v, i) => Math.round(lerp(v, [255, 176, 102][i], dawn)).toString(16).padStart(2, "0")).join("")}` : "#141a45"}"/>
  ${dawn < 0.6 ? `<circle cx="60" cy="-60" r="40" fill="${P.cream}" opacity="${(1 - dawn / 0.6).toFixed(2)}"/><circle cx="44" cy="-72" r="36" fill="#141a45" opacity="${(1 - dawn / 0.6).toFixed(2)}"/>` : `<circle cx="0" cy="${(130 - 120 * dawn).toFixed(1)}" r="60" fill="#ffe27a"/>`}
  <path d="M0 -150V150M-150 0H150" stroke="#1a1446" stroke-width="14"/>`; };
const room = (dawn, t) => `<rect width="1920" height="1080" fill="${ROOM.wall}"/><rect y="780" width="1920" height="300" fill="${ROOM.floor}"/><rect y="780" width="1920" height="10" fill="#4a3a8a"/>${at(1560, 330, windowPane(dawn, t))}`;
const card = (g) => frame(g, { sky0: "#000", sky1: "#000", sky2: "#000", night0: "#141a45", night1: "#34206f" });

const SHOTS = [
  // 0 evidence
  (a, tot) => `<rect width="1920" height="1080" fill="#141a45"/><path d="M760 0L560 1080H1360L1160 0Z" fill="#fff3c2" opacity=".12"/>${rings(960, 560, 330, P.gold, 0.1)}${at(960, 760, alarm(6, 0, 1, tot), 1.45 * pop(a))}`,
  // 1 on the table
  (a, tot) => room(0, tot) + at(900, 780, table()) + at(900 - 300 * (1 - ease(seg(a, 0, 0.5))), 750, alarm(10, 50, 0, tot), 1.1) + (a > 0.6 ? at(1250, 450, `<path d="M0 0L-160 120" stroke="${P.gold}" stroke-width="18" stroke-linecap="round"/><path d="M-185 140L-120 130L-150 80Z" fill="${P.gold}"/>`, pop(a - 0.6)) : ""),
  // 2 setting it at night
  (a, tot, s, k) => { const p = ease(seg(a, 0.4, dur(s, k, 3) - 0.4)), hh = lerp(10, 18, p), mm = (hh % 1) * 60;
    return room(0, tot) + at(900, 780, table()) + at(900, 750, alarm(Math.floor(hh), mm, 0, tot), 1.1) + at(1080, 640, `<circle r="24" fill="${P.steelD}"/><path d="M-6 -24h12v-30h-12Z" fill="${P.steel}" transform="rotate(${(p * 720).toFixed(0)})"/>`, pop(a - 0.2)); },
  // 3 six o'clock, it rings on time
  (a, tot) => room(ease(seg(a, 0, 1.2)), tot) + at(900, 780, table()) + at(900, 750, alarm(6, 0, a > 0.6 ? 1 : 0, tot), 1.1) + (a > 0.6 ? rings(900, 640, 260 * pop(a - 0.6), P.gold, 0.12) : ""),
  // 4 the pillow comes down
  (a, tot) => { const d = easeIn(seg(a, 0.1, 0.45)), hit = a > 0.45, sq = hit ? 1 - 0.4 * Math.exp(-(a - 0.45) * 8) : 0;
    return room(1, tot) + at(900, 780, table()) + at(900, 750, alarm(6, 0, hit ? 0 : 1, tot), [1.1, 1.1 * (hit ? 0.72 + 0.28 * (1 - Math.exp(-(a - 0.45) * 6)) : 1)]) + at(900, lerp(-200, 500, d), pillow(hit ? 0.6 : 0), 1.2, lerp(-40, 0, d)) + (hit && a < 0.9 ? rings(900, 560, 300 * (a - 0.45) * 3, "#fff", 0.18) : ""); },
  // 5 the snooze button
  (a, tot) => { const press = a > 1.4 ? 1 - Math.exp(-(a - 1.4) * 6) : 0;
    return `<rect width="1920" height="1080" fill="#141a45"/>${rings(960, 560, 360, P.gold, 0.08 + 0.05 * Math.sin(tot * 4))}${at(960, 1260, alarm(6, 0, 0, tot), 3.2)}${at(960, 440, `${two(rr(-200, -70 + 30 * press, 400, 120 - 30 * press, 40), "#ff5fa2", "#d6407f", 0, 14)}${rings(0, 0, 230, "#ff5fa2", 0.12)}`, pop(a))}
      ${[0, 1, 2].map((i) => { const q = ((tot * 0.5 + i / 3) % 1); return text(960 + 140 + i * 50 + 30 * q, 300 - 120 * q - i * 30, "Z", 70 + i * 20, "#cfc6ff", { opacity: (1 - q).toFixed(2) }); }).join("")}`; },
  // 6 rings again; slap again; the pillow stays on top
  (a, tot) => { const d = easeIn(seg(a, 0.7, 1.05)), hit = a > 1.05;
    return room(1, tot) + at(900, 780, table()) + at(900, 750, alarm(6, 9, hit ? 0 : 1, tot), [1.1, hit ? 0.8 : 1.1]) + at(900, lerp(-200, 560, d), pillow(hit ? 0.8 : 0), 1.25) + (hit ? text(900, 430, "Z", 90, "#cfc6ff", { opacity: (0.5 + 0.5 * Math.sin(tot * 3)).toFixed(2) }) : ""); },
  // 7 the scoreboard
  (a, tot) => { const n = Math.min(4, Math.floor(seg(a, 0.6, 3.0) * 4.999));
    const ticks = Array.from({ length: n }, (_, i) => `<path d="M${-60 + i * 44} 120V280" stroke="${P.green}" stroke-width="20" stroke-linecap="round"/>`).join("");
    return `<rect width="1920" height="1080" fill="#141a45"/>${two(rr(260, 120, 1400, 840, 40), "#2c2766", "#1f1a52", 0, 14)}<path d="M960 170V910" stroke="#4a3a8a" stroke-width="10"/>
      ${at(610, 330, pillow(), 0.75 * pop(a))}${at(610, 380, ticks)}${at(1310, 470, alarm(6, 0, 0, tot), 0.8 * pop(a - 0.2))}${a > 3.2 ? at(1310, 720, text(0, 50, "0", 160, P.red), pop(a - 3.2)) : ""}`; },
  // 8 late: 7:40, the pillow flies off, the clock looks back innocent, and gets the blame
  (a, tot) => { const off = easeOut(seg(a, 0.2, 0.8));
    return room(1, tot) + at(900, 780, table()) + at(900, 750, alarm(7, 40, 0, tot, { eyes: 18 }), 1.1) + at(900 + 900 * off, 500 - 400 * off + 600 * off * off, pillow(), 1.2, 260 * off) + (a > 2.4 ? cross(1180, 380, 70, P.red, a - 2.4) : ""); },
  // 9 the invasion plan: six o'clock, it rings in an empty room and nobody comes
  (a, tot) => room(0.15, tot) + at(900, 780, table()) + at(900, 750, alarm(6, 0, 1, tot), 1.1) + at(900, 860, pillow(0.6), 0.9),
];

export function snoozeSet(s, step, age, total) {
  const k = Math.min(step, SHOTS.length - 1), g = SHOTS[k](age, total, s, k);
  // the bedroom shots: the camera closer on the clock, so it reads at the size of a card above the host
  return card([1, 2, 3, 4, 6, 8, 9].includes(k) ? `<rect width="1920" height="1080" fill="${ROOM.wall}"/><g transform="translate(960 600) scale(1.55) translate(-950 -560)">${g}</g>` : g);
}
