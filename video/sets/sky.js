// Shorts lab 09 "sky" (format: the commander asks): a transmission. Drawn straight for the tall frame (1080 x 1920).
// Board spec: { shots: [ { who: "cmd" | "peek", text: "<Arabic line>", pic: "<picture>", words: [[s, e], ...] } ] },
// one entry per beat (`step`). The commander is never a face: his signal is a waveform on a big screen that moves only
// while he speaks (`words`, seconds from the start of the beat). Peek answers leaning in from the right (host: right).
// Every line appears as a speech bubble, in Arabic, word by word on its timing.
// Pictures (`pic`): screen (the commander's screen alone), sun (white sunlight arriving), prism (white light is all the
// colours), blue (the air scatters blue everywhere), noon (sun high, short path, blue sky), sunset (sun low, long path,
// the blue scattered away, red left), red (the red sky over the town), earth (the planet with its thin blue air).
import { clamp, lerp, ease, easeOut, seg, spring, rnd, at, rr, two, disc, rings, text, frame, setFrame, layer, drawn } from "./kit.js";
import { P, stars, skyline, clouds } from "./bank.js";

const W = 1080, H = 1920;
const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const C = { room: "#0b0f24", panel: "#151b3d", glow: "#5ff0d8", red: "#ff4d5a", blue: "#3fa9ff", sky: "#58b6ff", sun: "#fff3c2", gold: "#ffd04a" };
const RAINBOW = ["#ff4d5a", "#ff9a3c", "#ffd04a", "#3ddc97", "#3fa9ff", "#5a6bff", "#a35bff"];

// is the speaker talking at time a (seconds from the start of the beat)?
const talking = (sh, a) => (sh.words || []).some(([s, e]) => a >= s - 0.05 && a <= e + 0.05);
// how many words of the line have been said by time a
const said = (sh, a, n) => { const w = sh.words || []; if (!w.length) return Math.min(n, Math.floor(a / 0.32) + 1); let k = 0; w.forEach(([s]) => { if (a >= s - 0.1) k++; }); return Math.max(1, Math.min(n, k)); };

// Arabic lines broken to fit a width, right to left
const wrap = (str, max) => { const out = []; let cur = ""; String(str || "").split(/\s+/).filter(Boolean).forEach((w) => { if ((cur + " " + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); if (cur) out.push(cur); return out; };
// a speech bubble with the words said so far; tail: where it points (x offset from the bubble's centre, below or above)
function bubble(sh, a, cx, cy, o = {}) {
  const max = o.max || 17, size = o.size || 74, lines = wrap(sh.text, max), words = String(sh.text || "").split(/\s+/).filter(Boolean), k = said(sh, a, words.length);
  let left = k; const shown = lines.map((ln) => { const ws = ln.split(" "), take = Math.max(0, Math.min(ws.length, left)); left -= ws.length; return ws.slice(0, take).join(" "); });
  const lh = size * 1.32, h = lines.length * lh + 70, w = Math.min(980, Math.max(...lines.map((l) => l.length)) * size * 0.5 + 120), fill = o.fill || "#ffffff", ink = o.ink || "#141a33";
  const tx = o.tail || 0, up = o.up, ty = up ? -h / 2 : h / 2;
  const tail = up ? `M${tx - 40} ${ty + 4}L${tx + 30} ${ty - 70}L${tx + 50} ${ty + 4}Z` : `M${tx - 40} ${ty - 4}L${tx + 30} ${ty + 70}L${tx + 50} ${ty - 4}Z`;
  const body = `${two(rr(-w / 2, -h / 2, w, h, 46), fill, o.shade || "#c9d2ee", 0, 10)}<path d="${tail}" fill="${fill}"/>`
    + shown.map((ln, i) => `<text x="${w / 2 - 60}" y="${-h / 2 + 35 + lh * (i + 0.78)}" text-anchor="start" direction="rtl" font-family="Anton" font-size="${size}" fill="${ink}">${ln.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`).join("");
  return at(cx, cy, body, pop(a, 10, 14));
}

// the commander's screen: a big monitor, his signal as a waveform, a red light while he transmits
function screen(a, tot, sh, x, y, k = 1) {
  const on = talking(sh, a) && sh.who === "cmd", amp = on ? 1 : 0.08;
  let d = ""; for (let i = 0; i <= 120; i++) { const u = i / 120, xx = -380 + 760 * u, env = Math.sin(Math.PI * u), v = env * amp * (110 * Math.sin(u * 37 + tot * 19) * Math.sin(u * 9 - tot * 7) + 40 * Math.sin(u * 83 + tot * 31)); d += (i ? "L" : "M") + xx.toFixed(1) + " " + v.toFixed(1); }
  const grid = Array.from({ length: 9 }, (_, i) => `<path d="M${-400 + i * 100} -260V260" stroke="#16404a" stroke-width="3"/>`).join("") + Array.from({ length: 6 }, (_, i) => `<path d="M-420 ${-250 + i * 100}H420" stroke="#16404a" stroke-width="3"/>`).join("");
  const blink = 0.5 + 0.5 * Math.sin(tot * 6);
  return at(x, y, `${two(rr(-470, -330, 940, 660, 40), "#2a3366", "#1a2048", 0, 16)}<path d="${rr(-430, -290, 860, 580, 24)}" fill="#071a20"/>
    <clipPath id="skyscr"><path d="${rr(-430, -290, 860, 580, 24)}"/></clipPath><g clip-path="url(#skyscr)">${grid}
    ${on ? `<path d="${d}" fill="none" stroke="${C.glow}" stroke-width="26" opacity=".18" stroke-linejoin="round"/>` : ""}<path d="${d}" fill="none" stroke="${C.glow}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/></g>
    <circle cx="-380" cy="-250" r="18" fill="${on ? C.red : "#4a2030"}" opacity="${on ? (0.6 + 0.4 * blink).toFixed(2) : 1}"/>
    ${[0, 1, 2, 3].map((i) => `<path d="${rr(250 + i * 40, -262, 24, 20, 4)}" fill="${on && i < 1 + Math.floor((Math.sin(tot * 9 + i) + 1) * 1.6) ? C.glow : "#16404a"}"/>`).join("")}
    <path d="M-60 330L-90 420H90L60 330Z" fill="#1a2048"/><path d="${rr(-200, 410, 400, 30, 15)}" fill="#1a2048"/>`, k);
}

// ---- the pictures ----
const sunDisc = (r, c1 = C.sun, c2 = "#ffd98a", glow = 1) => `${rings(0, 0, r * 1.7, c2, 0.16 * glow, 1.4)}<circle r="${r}" fill="${c1}"/>`;
const air = (y0, y1, dots, t, colour = "#9fd4ff") => Array.from({ length: dots }, (_, i) => `<circle cx="${(rnd(i * 3) * W).toFixed(0)}" cy="${(y0 + rnd(i * 7 + 1) * (y1 - y0)).toFixed(0)}" r="${(4 + rnd(i) * 4).toFixed(1)}" fill="${colour}" opacity="${(0.35 + 0.35 * Math.sin(t * 2 + i)).toFixed(2)}"/>`).join("");
function beam(x0, y0, x1, y1, p, colour, width = 18) { const x = lerp(x0, x1, p), y = lerp(y0, y1, p); return `<path d="M${x0} ${y0}L${x.toFixed(1)} ${y.toFixed(1)}" stroke="${colour}" stroke-width="${width}" stroke-linecap="round"/>`; }

function picture(name, a, tot) {
  const c = { x: W / 2, y: 520, z: 1 };
  if (name === "sun") {   // white sunlight on its way: a white beam crossing black space to the planet's edge
    const p = easeOut(seg(a, 0.2, 1.6));
    return `<rect width="${W}" height="1100" fill="#05061a"/>${stars(3, 70, 0, W, 1100, tot)}${at(170, 300, sunDisc(130), pop(a))}${beam(260, 350, 1000, 820, p, "#ffffff", 26)}
      <path d="M-100 1100Q540 820 1180 1100Z" fill="#2a7fd0"/><path d="M-100 1100Q540 850 1180 1100" fill="none" stroke="${C.sky}" stroke-width="40" opacity=".5"/>`;
  }
  if (name === "prism") {   // white light is all the colours: the white beam fans out into a rainbow
    const p = easeOut(seg(a, 0.2, 1.2)), q = easeOut(seg(a, 0.9, 2.0));
    return `<rect width="${W}" height="1100" fill="#0a0d26"/>${beam(40, 560, 480, 560, p, "#ffffff", 30)}${at(540, 560, two("M0 -200L180 130H-180Z", "#cfe6ff", "#9cbbe6", 0, 10), pop(a - 0.1), 0, 'opacity=".92"')}
      ${q > 0 ? RAINBOW.map((col, i) => beam(600, 560, 1080, 360 + i * 66, q, col, 20)).join("") : ""}`;
  }
  if (name === "blue" || name === "noon") {   // the air scatters blue everywhere: blue bounces off the air, red goes straight on
    const p = easeOut(seg(a, 0.2, 1.4)), sc = seg(a, 0.8, 2.2);
    let bounce = ""; for (let i = 0; i < 16; i++) { const x = 160 + (i % 8) * 110, y = 420 + Math.floor(i / 8) * 260, ang = rnd(i) * Math.PI * 2, L = 140 * easeOut(seg(sc, i * 0.03, 0.5 + i * 0.03)); if (L > 1) bounce += `<path d="M${x} ${y}L${(x + Math.cos(ang) * L).toFixed(1)} ${(y + Math.sin(ang) * L).toFixed(1)}" stroke="${C.blue}" stroke-width="12" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="10" fill="#bfe3ff"/>`; }
    const skyCol = name === "noon" ? "#3a8fe8" : `#${[10, 13, 38].map((v, i) => Math.round(lerp(v, [58, 143, 232][i], ease(sc))).toString(16).padStart(2, "0")).join("")}`;
    return `<rect width="${W}" height="1100" fill="${skyCol}"/>${name === "noon" ? at(540, 140, sunDisc(110), pop(a)) + beam(540, 220, 540, 980, p, "#fff7d6", 22) : at(120, 160, sunDisc(100), pop(a)) + beam(200, 220, 1080, 900, p, "#ff6a4a", 14) + beam(200, 200, 1080, 880, p, "#ffd04a", 8)}
      ${bounce}${skyline(9, -100, 1200, 1100, 90, 260, "#203a7a", "#ffd98a")}`;
  }
  if (name === "sunset") {   // sun low: its light crosses much more air; the blue is scattered away on the way, red arrives
    const p = easeOut(seg(a, 0.2, 2.0)), dim = seg(a, 0.6, 2.2);
    let lost = ""; for (let i = 0; i < 12; i++) { const x = 120 + i * 80, y = 760 - i * 12, L = 90 * easeOut(seg(p, i / 14, i / 14 + 0.2)); if (L > 1) lost += `<path d="M${x} ${y}l${(L * Math.cos(-1.2 - rnd(i))).toFixed(1)} ${(L * Math.sin(-1.2 - rnd(i))).toFixed(1)}" stroke="${C.blue}" stroke-width="10" stroke-linecap="round" opacity=".85"/>`; }
    const sky = `<defs><linearGradient id="sksun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a5e"/><stop offset=".55" stop-color="${dim > 0.5 ? "#c2456a" : "#5a3a9a"}"/><stop offset="1" stop-color="${dim > 0.5 ? "#ff8a3c" : "#e8a25c"}"/></linearGradient></defs>`;
    return `${sky}<rect width="${W}" height="1100" fill="url(#sksun)"/>${at(1000, 880, sunDisc(110, "#ffb35c", "#ff7a3c"), pop(a))}${lost}
      ${beam(1000, 880, 60, 760, p, `#${[255, 255, 255].map((v, i) => Math.round(lerp(v, [255, 90, 60][i], dim)).toString(16).padStart(2, "0")).join("")}`, 16)}${skyline(13, -100, 1200, 1100, 90, 260, "#3a1a4a", "#ffd98a")}`;
  }
  if (name === "red") {   // the red sky over the town
    return `<defs><linearGradient id="skred" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1a5e"/><stop offset=".5" stop-color="#d6406a"/><stop offset="1" stop-color="#ff9a3c"/></linearGradient></defs><rect width="${W}" height="1100" fill="url(#skred)"/>
      ${at(540, 930, sunDisc(150, "#ffb35c", "#ff7a3c"), pop(a))}${clouds(tot, 420, 4, "#ff9fb0", 0.6)}${skyline(19, -100, 1200, 1100, 110, 330, "#2a1440", "#ffd98a")}`;
  }
  if (name === "earth") {   // the planet with its thin blue skin of air
    const z = lerp(1.0, 1.25, ease(seg(a, 0, 3)));
    return `<rect width="${W}" height="1100" fill="#05061a"/>${stars(7, 90, 0, W, 1100, tot)}${at(540, 600, `${rings(0, 0, 380, C.sky, 0.25, 1.06)}<circle r="360" fill="#2a7fd0"/><path d="M-200 -150q80 -60 160 0t120 60q-60 90 -170 60q-90 -20 -110 -120Z" fill="#3ddc97"/><path d="M60 120q90 -50 170 10t60 110q-110 40 -190 -20Z" fill="#3ddc97"/>`, z)}`;
  }
  return `<rect width="${W}" height="1100" fill="${C.room}"/>`;   // "screen": the room alone
}

export function skySet(s, step, age, total, cfg = {}) {
  setFrame(W, H);
  try {
    const shots = s.shots || [], k = Math.min(step, shots.length - 1), sh = shots[k] || { who: "cmd", text: "", pic: "screen" }, a = age, tot = total;
    const room = `<rect width="${W}" height="${H}" fill="${C.room}"/>${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${1120 + i * 60}H${W}" stroke="#12183a" stroke-width="3"/>`).join("")}`;
    // the commander's beats: his screen big, his line under it; Peek's beats: the picture on top, the screen small in its corner, his line under it
    let g = room;
    if (sh.who === "cmd") g += screen(a, tot, sh, 540, 560, 1.05) + bubble(sh, a, 540, 1240, { up: true, tail: 0, fill: "#e7fffb", shade: "#9fe7da" });
    else {
      g += `<clipPath id="skypic"><rect width="${W}" height="1100"/></clipPath><g clip-path="url(#skypic)">${picture(sh.pic, a, tot)}</g><rect y="1094" width="${W}" height="14" fill="#2a3366"/>`
        + screen(a, tot, sh, 160, 1260, 0.26) + bubble(sh, a, 470, 1330, { tail: 260, max: 15, size: 70 });
    }
    return frame(g, { sky0: "#000", sky1: "#000", sky2: "#000", night0: C.room, night1: C.room });
  } finally { setFrame(1920, 1080); }
}
