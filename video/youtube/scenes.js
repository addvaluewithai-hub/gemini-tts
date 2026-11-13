// Illustrated thumbnail scenes, drawn in a 1280 x 720 SVG space. No words live here: a scene draws pictures,
// the spec (art-*-ar.json) supplies every word, so an English version only changes the spec.
//   SCENES[name](opts, labels) -> { defs, back, front }
// `back` is drawn behind the host, `front` over him (a cart he sits in, a tombstone he hides behind).

// ---- small tools --------------------------------------------------------------------------------------
const rng = (seed = 1) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const f = (n) => Math.round(n * 10) / 10;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c, i) => `<stop offset="${Array.isArray(c) ? c[0] : i / (stops.length - 1)}" stop-color="${Array.isArray(c) ? c[1] : c}"/>`).join("")}</linearGradient>`;
const rad = (id, stops, cx = 0.5, cy = 0.5, r = 0.6) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map((c, i) => `<stop offset="${Array.isArray(c) ? c[0] : i / (stops.length - 1)}" stop-color="${Array.isArray(c) ? c[1] : c}" ${Array.isArray(c) && c[2] != null ? `stop-opacity="${c[2]}"` : ""}/>`).join("")}</radialGradient>`;
const FILTERS = `<filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#05060d" flood-opacity=".5"/></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="b4"><feGaussianBlur stdDeviation="4"/></filter><filter id="b12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="b30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>`;
const GOLD = lin("gold", ["#fff2b0", [0.35, "#ffcf3a"], [0.75, "#e39a0c"], "#a86400"], 1, 1) + lin("goldEdge", ["#c98200", "#7a4a00"]);
const rays = (cx, cy, n, color, op, r = 1600, rot = 0) => Array.from({ length: n }, (_, i) => { const a0 = ((i * 2) / (n * 2)) * Math.PI * 2 + rot, a1 = a0 + Math.PI / n;
  return `<path d="M${cx} ${cy}L${f(cx + Math.cos(a0) * r)} ${f(cy + Math.sin(a0) * r)}L${f(cx + Math.cos(a1) * r)} ${f(cy + Math.sin(a1) * r)}Z"/>`; }).join("").replace(/^/, `<g fill="${color}" opacity="${op}">`) + "</g>";
// a gold coin facing us, the generic B. tilt squashes it (0 = face on, 0.8 = nearly edge on)
const coin = (x, y, r, rot = 0, tilt = 0) => { const sy = 1 - tilt, th = r * 0.16 * (tilt > 0.05 ? 1 : 0);
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><g transform="scale(1 ${f(sy * 100) / 100})">${th ? `<ellipse cy="${f(th / sy)}" rx="${r}" ry="${r}" fill="url(#goldEdge)"/>` : `<circle r="${r}" fill="url(#goldEdge)" transform="translate(${f(r * 0.06)} ${f(r * 0.08)})"/>`}
  <circle r="${r}" fill="url(#gold)"/><circle r="${f(r * 0.8)}" fill="none" stroke="#a86400" stroke-width="${f(r * 0.07)}" opacity=".55"/>
  <g fill="#8a5200"><path d="M${f(-r * 0.3)} ${f(-r * 0.5)}h${f(r * 0.38)}c${f(r * 0.3)} 0 ${f(r * 0.3)} ${f(r * 0.44)} 0 ${f(r * 0.46)}c${f(r * 0.36)} 0 ${f(r * 0.36)} ${f(r * 0.54)} 0 ${f(r * 0.54)}h${f(-r * 0.38)}Z" fill="none" stroke="#8a5200" stroke-width="${f(r * 0.14)}" stroke-linejoin="round"/>
  <path d="M${f(-r * 0.12)} ${f(-r * 0.66)}v${f(r * 0.18)}M${f(r * 0.1)} ${f(-r * 0.66)}v${f(r * 0.18)}M${f(-r * 0.12)} ${f(r * 0.48)}v${f(r * 0.18)}M${f(r * 0.1)} ${f(r * 0.48)}v${f(r * 0.18)}" stroke="#8a5200" stroke-width="${f(r * 0.09)}" stroke-linecap="round"/></g>
  <ellipse cx="${f(-r * 0.35)}" cy="${f(-r * 0.45)}" rx="${f(r * 0.3)}" ry="${f(r * 0.14)}" transform="rotate(-35 ${f(-r * 0.35)} ${f(-r * 0.45)})" fill="#fff" opacity=".55"/></g></g>`; };
// a coin lying flat in a heap: an ellipse with an edge
const flatCoin = (x, y, r) => `<ellipse cx="${f(x)}" cy="${f(y + r * 0.14)}" rx="${r}" ry="${f(r * 0.36)}" fill="url(#goldEdge)"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${r}" ry="${f(r * 0.36)}" fill="url(#gold)"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 0.72)}" ry="${f(r * 0.24)}" fill="none" stroke="#a86400" stroke-width="2" opacity=".5"/>`;
const heap = (cx, base, w, h, r, seed) => { const R = rng(seed); let out = "";
  for (let row = 0; row < 40; row++) { const t = row / 40, y = base - t * h, half = w / 2 * Math.sqrt(1 - t) * 0.98; for (let k = 0; k < Math.max(1, half / (r * 0.7)); k++) { const x = cx + (R() * 2 - 1) * half; out += flatCoin(x, y + (R() - 0.5) * 8, r * (0.85 + R() * 0.3)); } }
  return out; };
const pizza = (x, y, r, sy = 0.42, seed = 3) => { const R = rng(seed); let top = "";
  for (let i = 0; i < 9; i++) { const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r * 0.62; top += `<ellipse cx="${f(Math.cos(a) * d)}" cy="${f(Math.sin(a) * d)}" rx="${f(r * 0.13)}" ry="${f(r * 0.13)}" fill="#c3362a"/><ellipse cx="${f(Math.cos(a) * d - r * 0.03)}" cy="${f(Math.sin(a) * d - r * 0.04)}" rx="${f(r * 0.05)}" ry="${f(r * 0.03)}" fill="#ff8a6a" opacity=".7"/>`; }
  for (let i = 0; i < 5; i++) { const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r * 0.6; top += `<ellipse cx="${f(Math.cos(a) * d)}" cy="${f(Math.sin(a) * d)}" rx="${f(r * 0.08)}" ry="${f(r * 0.04)}" transform="rotate(${f(R() * 180)} ${f(Math.cos(a) * d)} ${f(Math.sin(a) * d)})" fill="#2f8a3a"/>`; }
  return `<g transform="translate(${f(x)} ${f(y)})"><ellipse cy="${f(r * sy * 0.22 + 6)}" rx="${r}" ry="${f(r * sy)}" fill="#8a4a16"/><g transform="scale(1 ${sy})"><circle r="${r}" fill="#d8913f"/><circle r="${f(r * 0.86)}" fill="#ffd257"/><circle r="${f(r * 0.86)}" fill="url(#cheese)"/>${top}<path d="M0 ${-r * 0.86}V${r * 0.86}M${f(-r * 0.75)} ${f(-r * 0.43)}L${f(r * 0.75)} ${f(r * 0.43)}M${f(-r * 0.75)} ${f(r * 0.43)}L${f(r * 0.75)} ${f(-r * 0.43)}" stroke="#d8913f" stroke-width="${f(r * 0.03)}" opacity=".8"/></g></g>`; };
// a smooth path through points (Catmull-Rom as cubic Béziers)
const smooth = (P) => P.map((p, i) => { if (!i) return `M${f(p[0])} ${f(p[1])}`; const a = P[i - 2] || P[i - 1], b = P[i - 1], c = p, d = P[i + 1] || p;
  return `C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (d[0] - b[0]) / 6)} ${f(c[1] - (d[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`; }).join("");
const sampleSmooth = (P, n = 24) => { const out = []; for (let i = 1; i < P.length; i++) { const a = P[i - 2] || P[i - 1], b = P[i - 1], c = P[i], d = P[i + 1] || P[i];
  const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6], c2 = [c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6];
  for (let k = 0; k < n; k++) { const t = k / n, u = 1 - t; out.push([u * u * u * b[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * c[0], u * u * u * b[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * c[1]]); } }
  out.push(P[P.length - 1]); return out; };
const cloud = (x, y, s, c = "#fff", op = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}" opacity="${op}"><circle cx="-60" cy="10" r="44"/><circle cx="0" cy="-16" r="62"/><circle cx="66" cy="6" r="48"/><rect x="-104" y="10" width="214" height="44" rx="22"/></g>`;
const bubbles = (seed, n, x0, x1, y0, y1, rmax = 14, op = 0.5) => { const R = rng(seed); return Array.from({ length: n }, () => { const r = 3 + R() * rmax, x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0);
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="#bff0ff" stroke-width="2.5" opacity="${op}"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.22)}" fill="#fff" opacity="${op}"/>`; }).join(""); };

export const SCENES = {
  // crypto 1: a brass scale, a mountain of bitcoin on one pan and two pizzas on the other, perfectly level
  pizzaScale: () => {
    const P = { x: 500, y: 318 }, L = 300, hang = 190, tilt = 0;
    const defs = FILTERS + GOLD + rad("bg1", ["#ffc05a", [0.35, "#f2662a"], [0.72, "#a91f1c"], "#3d0710"], 0.42, 0.5, 0.75) + lin("brass", ["#ffe9a0", [0.5, "#d9a12a"], "#8a5a0c"], 1, 0)
      + lin("brassV", ["#ffe9a0", [0.5, "#d9a12a"], "#8a5a0c"], 0, 1) + rad("cheese", [["0", "#fff3a0", 0.9], ["1", "#ffb52e", 0]], 0.4, 0.35, 0.7);
    const end = (s) => ({ x: P.x + s * L * Math.cos(tilt), y: P.y + s * L * Math.sin(tilt) });
    const pan = (e) => { const y = e.y + hang;
      return `<path d="M${e.x} ${e.y}L${e.x - 140} ${y}M${e.x} ${e.y}L${e.x + 140} ${y}M${e.x} ${e.y}L${e.x} ${y + 26}" stroke="#5a3a08" stroke-width="5" opacity=".9"/>
      <path d="M${e.x - 160} ${y}Q${e.x} ${y + 120} ${e.x + 160} ${y}Z" fill="url(#brassV)" filter="url(#sh)"/><ellipse cx="${e.x}" cy="${y}" rx="160" ry="24" fill="#b27b14"/><ellipse cx="${e.x}" cy="${y - 2}" rx="148" ry="18" fill="#6e4806"/>`; };
    const l = end(-1), r = end(1);
    const back = `<rect width="1280" height="720" fill="url(#bg1)"/>${rays(P.x, P.y + 40, 18, "#fff3c0", 0.09)}
      <ellipse cx="${P.x}" cy="700" rx="420" ry="40" fill="#2a0508" opacity=".45" filter="url(#b12)"/>
      <path d="M${P.x - 130} 700L${P.x - 90} 640H${P.x + 90}L${P.x + 130} 700Z" fill="url(#brass)" filter="url(#sh)"/><rect x="${P.x - 16}" y="${P.y}" width="32" height="345" fill="url(#brass)"/>
      ${pan(l)}${pan(r)}
      <rect x="${l.x}" y="${P.y - 13}" width="${2 * L}" height="26" rx="13" fill="url(#brassV)" filter="url(#sh)"/><circle cx="${l.x}" cy="${l.y}" r="17" fill="url(#brass)"/><circle cx="${r.x}" cy="${r.y}" r="17" fill="url(#brass)"/>
      <circle cx="${P.x}" cy="${P.y}" r="30" fill="url(#brass)" filter="url(#sh)"/><path d="M${P.x} ${P.y - 30}L${P.x - 14} ${P.y - 92}H${P.x + 14}Z" fill="url(#brass)"/><circle cx="${P.x}" cy="${P.y - 96}" r="16" fill="url(#brass)"/>
      <g filter="url(#sh)">${heap(l.x, l.y + hang - 4, 290, 250, 24, 7)}</g>
      ${coin(l.x - 40, l.y + hang - 150, 50, -14)}${coin(l.x + 70, l.y + hang - 110, 46, 12)}${coin(l.x - 100, l.y + hang - 60, 40, -8)}
      <g filter="url(#sh)">${pizza(r.x, r.y + hang - 26, 118, 0.38, 3)}${pizza(r.x + 6, r.y + hang - 62, 112, 0.38, 9)}</g>
      ${coin(160, 140, 34, -20, 0.2)}${coin(860, 170, 28, 25, 0.4)}${coin(120, 610, 30, 15, 0.1)}`;
    return { defs, back };
  },

  // crypto 2: glowing blocks chained together, wires sucking a whole city dark
  blackout: (o) => {
    const defs = FILTERS + lin("night", ["#0b0a18", [0.6, "#171233"], "#2a1640"]) + lin("cubeT", ["#fff6b8", "#ffd640"], 1, 1) + lin("cubeL", ["#ffc21f", "#e08a00"]) + lin("cubeR", ["#c46e00", "#8a4600"]);
    const cube = (x, y, s) => { const h = s * 0.58;
      return `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="${s * 0.4}" rx="${s * 1.6}" ry="${s * 1.2}" fill="#ffcc33" opacity=".35" filter="url(#b30)"/>
      <path d="M0 ${-h}L${s} 0L0 ${h}L${-s} 0Z" transform="translate(0 ${-s * 0.55})" fill="url(#cubeT)"/>
      <path d="M${-s} ${-s * 0.55}L0 ${h - s * 0.55}V${h + s * 0.62}L${-s} ${s * 0.62}Z" fill="url(#cubeL)"/><path d="M${s} ${-s * 0.55}L0 ${h - s * 0.55}V${h + s * 0.62}L${s} ${s * 0.62}Z" fill="url(#cubeR)"/>
      <g transform="matrix(1 .58 0 1 ${-s * 0.5} ${s * 0.04 - s * 0.29})">${coin(0, 0, s * 0.36)}</g>
      <path d="M${-s} ${-s * 0.55}L0 ${-s * 0.55 - h}L${s} ${-s * 0.55}" fill="none" stroke="#fffbe0" stroke-width="4" opacity=".8"/></g>`; };
    const link = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-34" y="-15" width="68" height="30" rx="15" fill="none" stroke="#c9cee6" stroke-width="10"/><rect x="-34" y="-15" width="68" height="30" rx="15" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/></g>`;
    const R = rng(11); let city = "", wins = ""; const lit = o.lit ?? 0.05;
    for (let x = -20; x < 1300;) { const w = 60 + R() * 90, h = 70 + R() * 170; city += `<rect x="${f(x)}" y="${f(720 - h)}" width="${f(w)}" height="${f(h)}" fill="#06050c"/>`;
      for (let wy = 720 - h + 14; wy < 706; wy += 22) for (let wx = x + 10; wx < x + w - 14; wx += 18) wins += `<rect x="${f(wx)}" y="${f(wy)}" width="8" height="11" fill="${R() < lit ? "#ffd84a" : "#1a1830"}"/>`; x += w + 4; }
    const blocks = [[170, 150], [370, 250], [570, 175]];
    const wire = (x0, y0, x1, y1, sag) => { const d = `M${x1} ${y1}C${x1} ${y1 - sag} ${x0} ${y0 + sag} ${x0} ${y0}`;
      return `<path d="${d}" fill="none" stroke="#ffcc33" stroke-width="22" opacity=".25" filter="url(#b4)"/><path d="${d}" fill="none" stroke="#05050a" stroke-width="14"/><path d="${d}" fill="none" stroke="#fff6a0" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 34" filter="url(#glow)"/>`; };
    const bolt = (x, y, s, r) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M20 -100L-50 14H-4L-24 100L56 -22H8Z" fill="#fff36b" stroke="#fff" stroke-width="4" filter="url(#glow)"/>`;
    const back = `<rect width="1280" height="720" fill="url(#night)"/>${Array.from({ length: 60 }, () => `<circle cx="${f(R() * 1280)}" cy="${f(R() * 420)}" r="${f(R() * 1.8 + 0.5)}" fill="#fff" opacity="${f(R() * 0.6 + 0.2)}"/>`).join("")}
      ${wire(170, 250, 90, 560, 180)}${wire(370, 350, 330, 520, 120)}${wire(570, 270, 640, 560, 200)}${wire(600, 260, 900, 500, 220)}${wire(560, 280, 1120, 540, 260)}
      ${city}${wins}
      ${link(270, 205, 28)}${link(470, 215, -22)}
      ${blocks.map(([x, y]) => cube(x, y, 92)).join("")}
      ${bolt(80, 90, 0.6, -12)}${bolt(700, 90, 0.45, 18)}${bolt(470, 400, 0.4, 8)}`;
    return { defs, back };
  },

  // crypto 3: a landfill at dusk, and somewhere in it a hard drive glowing like treasure
  landfill: () => {
    const defs = FILTERS + GOLD + lin("dusk", ["#24301f", [0.45, "#5f6a3a"], [0.78, "#d39a46"], "#ffcf6a"]) + lin("hill", ["#3b4429", "#1b2013"]) + rad("treas", [["0", "#fff6c0", 1], [0.3, "#ffd23a", 0.8], ["1", "#ffb000", 0]], 0.5, 0.5, 0.5)
      + lin("drv", ["#e9edf7", "#9aa3bd"], 1, 1);
    const R = rng(5); let trash = "";
    const hillY = (x) => 420 + Math.pow((x - 640) / 640, 2) * 220 - 40 * Math.sin(x / 140);
    const bag = (c) => `<path d="M-44 14C-52 -22 -24 -40 -4 -34L-10 -46L6 -40L14 -50L16 -34C44 -30 54 0 44 18C22 32 -30 32 -44 14Z" fill="${c}"/><path d="M-26 -10C-14 -22 4 -22 14 -16" fill="none" stroke="#fff" stroke-width="4" opacity=".18"/><path d="M-30 4C-34 -8 -26 -18 -16 -20" fill="none" stroke="#fff" stroke-width="5" opacity=".14" stroke-linecap="round"/>`;
    const things = [
      () => bag(["#1d2a1d", "#263524", "#14181f", "#2c2a3a", "#1b2b3a"][Math.floor(R() * 5)]),
      () => bag(["#1d2a1d", "#14181f", "#2c2a3a"][Math.floor(R() * 3)]),
      () => `<path d="M-30 -26H30V22H-30Z" fill="#b08a54"/><path d="M-30 -26L-18 -38H40L30 -26Z" fill="#d6b07a"/><path d="M30 -26L40 -38V10L30 22Z" fill="#8a6a3c"/><path d="M-8 -26V22" stroke="#7a5a2c" stroke-width="4"/>`,
      () => `<rect x="-8" y="-30" width="16" height="44" rx="6" fill="${["#3fae6a", "#8fd0ff", "#c0392b"][Math.floor(R() * 3)]}" opacity=".9"/><rect x="-4" y="-38" width="8" height="10" fill="#e8e3d3"/>`,
      () => `<ellipse rx="30" ry="12" fill="none" stroke="#0c0c10" stroke-width="11"/>`,
      () => `<path d="M-24 -10L20 -18L26 8L-18 16Z" fill="#e8e3d3" opacity=".85"/><path d="M-14 -6L14 -10M-12 4L16 0" stroke="#8f96b8" stroke-width="3"/>`,
      () => `<rect x="-30" y="-24" width="60" height="44" rx="6" fill="#3a3f5c"/><rect x="-22" y="-16" width="40" height="28" rx="3" fill="#1b2b3a"/><path d="M-16 -10L10 6" stroke="#8fd0ff" stroke-width="3" opacity=".6"/>`];
    for (let i = 0; i < 210; i++) { const x = R() * 1300 - 10, y = hillY(x) + 6 + Math.pow(R(), 1.3) * (720 - hillY(x)), s = 0.7 + (y - 400) / 260, k = R();
      const pick = k < 0.62 ? (k < 0.4 ? 0 : 1) : k < 0.74 ? 2 : k < 0.82 ? 3 : k < 0.86 ? 4 : k < 0.94 ? 5 : 6;
      trash += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)}) rotate(${f(R() * 50 - 25)})">${things[pick]()}</g>`; }
    const hill = `M-10 720L-10 ${hillY(0)}${Array.from({ length: 33 }, (_, i) => `L${i * 40} ${f(hillY(i * 40))}`).join("")}L1290 720Z`;
    const gull = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-30 0Q-15 -16 0 0Q15 -16 30 0" fill="none" stroke="#1b2013" stroke-width="5" stroke-linecap="round"/>`;
    const D = { x: 640, y: 470 };
    const back = `<rect width="1280" height="720" fill="url(#dusk)"/><circle cx="380" cy="430" r="90" fill="#fff0b0" opacity=".6" filter="url(#b30)"/>
      ${gull(300, 120, 1.2)}${gull(380, 90, 0.8)}${gull(700, 150, 1)}${gull(240, 200, 0.7)}
      <path d="${hill}" fill="url(#hill)"/>${trash}
      <circle cx="${D.x}" cy="${D.y}" r="260" fill="url(#treas)"/>${rays(D.x, D.y, 14, "#fff2a8", 0.18, 420, 0.1)}
      <g transform="translate(${D.x} ${D.y}) rotate(-18)" filter="url(#sh)"><rect x="-96" y="-62" width="192" height="124" rx="12" fill="url(#drv)"/><circle cx="-14" cy="-4" r="44" fill="#d9dfee" stroke="#8f96b8" stroke-width="4"/><circle cx="-14" cy="-4" r="9" fill="#8f96b8"/><path d="M52 44L14 12" stroke="#4d5478" stroke-width="9" stroke-linecap="round"/><rect x="48" y="30" width="30" height="16" rx="4" fill="#58d68d"/></g>
      ${coin(560, 380, 34, -20)}${coin(735, 400, 30, 22)}${coin(690, 330, 24, 8)}`;
    return { defs, back };
  },

  // crypto 4: a roller coaster whose track is the price chart: five climbs, five drops, and the cart on top
  coaster: (o) => {
    const v = o.points || [0.3, 2.2, 0.9, 3.3, 1.7, 4.3, 2.6, 5.0, 3.3, 5.7, -1.4];
    const xs = o.xs || [-20, 70, 150, 230, 310, 390, 470, 550, 630, 720, 1150], Y = (q) => (o.base ?? 720) - q * (o.scale ?? 68);
    const P = v.map((q, i) => [xs[i], Y(q)]), S = sampleSmooth(P, 30);
    const defs = FILTERS + lin("sky4", ["#2a4cff", [0.38, "#8b4dff"], [0.7, "#ff4fa3"], "#ffad5a"]) + lin("rail", ["#ffffff", "#c9cee6"]);
    let ties = "", posts = "";
    S.forEach((p, i) => { if (i % 3) return; const q = S[Math.min(S.length - 1, i + 1)], a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
      ties += `<rect x="-5" y="-14" width="10" height="28" transform="translate(${f(p[0])} ${f(p[1] + 6)}) rotate(${f(a)})" fill="#7a2a5a"/>`; });
    S.forEach((p, i) => { if (i % 10 || p[1] > 700) return; posts += `<path d="M${f(p[0])} ${f(p[1] + 14)}V740" stroke="#4a1747" stroke-width="9"/>`;
      if (i % 20 === 0) posts += `<path d="M${f(p[0] - 30)} 740L${f(p[0])} ${f(p[1] + 30)}L${f(p[0] + 30)} 740" fill="none" stroke="#4a1747" stroke-width="5" opacity=".8"/>`; });
    const d = smooth(P), top = P[9];
    const back = `<rect width="1280" height="720" fill="url(#sky4)"/><circle cx="1060" cy="520" r="150" fill="#ffe08a" opacity=".85"/><circle cx="1060" cy="520" r="230" fill="#ffd36a" opacity=".3" filter="url(#b30)"/>
      ${cloud(180, 110, 1.1, "#fff", 0.5)}${cloud(560, 70, 0.8, "#fff", 0.35)}${cloud(1180, 300, 0.9, "#ffd9f0", 0.45)}
      ${posts}<path d="${d}" fill="none" stroke="#2a0f2e" stroke-width="30" stroke-linecap="round" opacity=".35" transform="translate(0 10)"/>${ties}
      <path d="${d}" fill="none" stroke="#ff2e88" stroke-width="12" stroke-linecap="round" transform="translate(0 -6)"/><path d="${d}" fill="none" stroke="url(#rail)" stroke-width="9" stroke-linecap="round" transform="translate(0 10)"/>
      <path d="M1000 330l40 70M1040 300l30 50" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>`;
    // the cart, tipped over the edge of the last peak
    const cx = top[0] + 22, cy = top[1] - 4;
    const front = `<g transform="translate(${cx} ${cy}) rotate(${o.cartRot ?? 20})" filter="url(#sh)"><path d="M-112 -70H104Q128 -70 124 -40L112 4H-108Z" fill="#ffd23f"/><path d="M-112 -70H104Q128 -70 124 -40L120 -26H-112Z" fill="#fff3b0" opacity=".6"/>
      <rect x="-112" y="-80" width="240" height="16" rx="8" fill="#ff2e88"/><circle cx="-70" cy="10" r="20" fill="#2a0f2e"/><circle cx="-70" cy="10" r="8" fill="#c9cee6"/><circle cx="70" cy="10" r="20" fill="#2a0f2e"/><circle cx="70" cy="10" r="8" fill="#c9cee6"/>
      <circle cx="0" cy="-34" r="22" fill="#ff2e88"/><circle cx="0" cy="-34" r="11" fill="#fff"/></g>`;
    return { defs, back, front };
  },

  // crypto 5: a moonlit graveyard of coins, and one coin with a dog on it dancing on a grave
  graveyard: (o) => {
    const M = o.moon || { x: 960, y: 290 }, Hd = o.hide || { x: 230, s: 3 };
    const defs = FILTERS + GOLD + lin("nightP", ["#120a2e", [0.55, "#3a1d6e"], "#5b2f7a"]) + lin("stone", ["#8e8aa8", "#4a4566"], 1, 1) + lin("ground5", ["#1d1636", "#0b0716"]) + rad("moon", ["#fbffe0", [0.7, "#d9f2a0"], "#a8d070"], 0.4, 0.4, 0.7);
    const R = rng(21);
    const stone = (x, y, s, rot = 0, mark = 0) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)}) rotate(${f(rot)})"><path d="M-46 0V-90A46 46 0 0 1 46 -90V0Z" fill="url(#stone)"/><path d="M-46 0V-90A46 46 0 0 1 -20 -131" fill="none" stroke="#c9c4e6" stroke-width="5" opacity=".5"/>
      ${mark % 2 ? `<path d="M0 -112V-52M-20 -92H20" stroke="#2c2846" stroke-width="9" stroke-linecap="round"/>` : `<circle cy="-82" r="26" fill="none" stroke="#2c2846" stroke-width="7"/><path d="M-8 -96V-68M8 -96V-68M-14 -82H14" stroke="#2c2846" stroke-width="6" stroke-linecap="round" transform="rotate(${mark * 40} 0 -82)"/>`}
      <ellipse cx="0" cy="2" rx="60" ry="9" fill="#05030c" opacity=".6"/></g>`;
    let rows = "";
    [[300, 0.42, 14], [360, 0.55, 11], [430, 0.7, 9], [520, 0.92, 7]].forEach(([y, s, n], r) => { for (let i = 0; i < n; i++) { const x = (i + 0.5) * (1280 / n) + (R() - 0.5) * 60; if (r === 3 && (Math.abs(x - M.x) < 150 || Math.abs(x - Hd.x) < 200)) continue; rows += stone(x, y + (R() - 0.5) * 16, s, (R() - 0.5) * 16, Math.floor(R() * 9)); } });
    const fog = (y, op) => `<ellipse cx="640" cy="${y}" rx="900" ry="40" fill="#b9a8ff" opacity="${op}" filter="url(#b30)"/>`;
    const dog = `<g transform="translate(${M.x} ${M.y + 20})">${coin(0, 0, 92, -10)}<g transform="scale(.62) translate(0 6)"><path d="M-70 -60L-92 -104L-40 -84ZM70 -60L92 -104L40 -84Z" fill="#a8641c"/><ellipse cx="0" cy="-10" rx="88" ry="80" fill="#e2a95a"/><ellipse cx="0" cy="26" rx="46" ry="38" fill="#fbe7c4"/><circle cx="-32" cy="-28" r="12" fill="#05060d"/><circle cx="32" cy="-28" r="12" fill="#05060d"/><circle cx="-28" cy="-32" r="4" fill="#fff"/><circle cx="36" cy="-32" r="4" fill="#fff"/><ellipse cx="0" cy="8" rx="15" ry="10" fill="#05060d"/><path d="M-22 32Q0 56 22 32" fill="#c0392b" stroke="#05060d" stroke-width="6" stroke-linecap="round"/></g></g>
      <path d="M${M.x - 120} ${M.y - 50}l-30 -16M${M.x - 110} ${M.y}l-36 -2M${M.x + 120} ${M.y - 50}l30 -16M${M.x + 112} ${M.y}l36 -2" stroke="#fff6b0" stroke-width="7" stroke-linecap="round"/>`;
    const back = `<rect width="1280" height="720" fill="url(#nightP)"/>${Array.from({ length: 70 }, () => `<circle cx="${f(R() * 1280)}" cy="${f(R() * 300)}" r="${f(R() * 1.8 + 0.4)}" fill="#fff" opacity="${f(R() * 0.7 + 0.2)}"/>`).join("")}
      <g transform="translate(${M.x - 560} ${M.y - 250})"><circle cx="560" cy="250" r="190" fill="#e8ffb0" opacity=".25" filter="url(#b30)"/><circle cx="560" cy="250" r="135" fill="url(#moon)"/><circle cx="510" cy="215" r="20" fill="#b8d88a" opacity=".6"/><circle cx="610" cy="300" r="28" fill="#b8d88a" opacity=".5"/><circle cx="600" cy="190" r="11" fill="#b8d88a" opacity=".6"/></g>
      <path d="M-10 320Q300 270 640 300T1290 300V720H-10Z" fill="url(#ground5)"/>${rows}${fog(350, 0.25)}${fog(470, 0.2)}
      <g transform="translate(${M.x} ${M.y + 220})">${stone(0, 0, 1.25, -3, 3)}</g>${dog}${fog(640, 0.3)}`;
    const front = stone(Hd.x, 740, Hd.s, Hd.rot ?? 3, 1);
    return { defs, back, front };
  },

  // network 1: a smartphone with an old telescopic antenna pulled out and broadcasting
  radioPhone: () => {
    const defs = FILTERS + lin("teal", ["#16a3a0", [0.6, "#0b6b78"], "#073d4f"]) + lin("chrome", ["#ffffff", [0.4, "#c9cee6"], [0.6, "#7c839e"], "#e6e9f5"], 1, 0) + lin("body6", ["#3a3f5c", "#11152e"], 1, 1) + lin("scr6", ["#ffb347", "#ff6a3d"]);
    const T = { x: 650, y: 150 }, ph = { x: 560, y: 450, rot: -10 };
    const waves = [120, 210, 300, 390, 480].map((r, i) => `<path d="M${T.x - r * 0.8} ${T.y - r * 0.15}A${r} ${r} 0 0 1 ${T.x + r * 0.8} ${T.y - r * 0.15}" fill="none" stroke="#ffe8b0" stroke-width="${16 - i * 2}" stroke-linecap="round" opacity="${0.85 - i * 0.14}" transform="rotate(-10 ${T.x} ${T.y}) scale(1 1) translate(0 ${r * 0.62})"/>`).join("");
    const ring = [90, 170, 250, 330, 410, 490].map((r, i) => `<circle cx="${T.x}" cy="${T.y}" r="${r}" fill="none" stroke="#ffe8b0" stroke-width="${14 - i * 1.6}" opacity="${0.6 - i * 0.08}"/>`).join("");
    const ticks = Array.from({ length: 21 }, (_, i) => `<path d="M${-120 + i * 12} ${i % 5 ? -6 : -16}V8" stroke="#2a0f2e" stroke-width="${i % 5 ? 3 : 5}"/>`).join("");
    const grille = Array.from({ length: 6 }, (_, j) => Array.from({ length: 5 }, (_, i) => `<circle cx="${-88 + i * 44}" cy="${70 + j * 30}" r="10" fill="#2a0f2e" opacity=".75"/>`).join("")).join("");
    const back = `<rect width="1280" height="720" fill="url(#teal)"/>${rays(T.x, T.y + 300, 20, "#fff", 0.05)}${ring}
      <g transform="translate(${ph.x} ${ph.y}) rotate(${ph.rot})">
        <path d="M86 -300L102 -630" stroke="#2a2e44" stroke-width="22" stroke-linecap="round" opacity=".35" transform="translate(10 10)"/>
        <path d="M86 -300L91 -410" stroke="url(#chrome)" stroke-width="20" stroke-linecap="round"/><path d="M91 -410L96 -520" stroke="url(#chrome)" stroke-width="15" stroke-linecap="round"/><path d="M96 -520L99 -580" stroke="url(#chrome)" stroke-width="10" stroke-linecap="round"/>
        <circle cx="99" cy="-590" r="22" fill="#ff6a3d" stroke="#fff" stroke-width="5" filter="url(#glow)"/>
        <rect x="-160" y="-310" width="320" height="610" rx="48" fill="#05060d" opacity=".4" transform="translate(16 18)" filter="url(#b12)"/>
        <rect x="-160" y="-310" width="320" height="610" rx="48" fill="url(#body6)"/><rect x="-142" y="-270" width="284" height="530" rx="26" fill="url(#scr6)"/>
        <rect x="-36" y="-294" width="72" height="12" rx="6" fill="#05060d"/>
        <g transform="translate(0 -150)"><rect x="-136" y="-50" width="272" height="100" rx="14" fill="#fff3d6"/>${ticks}<path d="M18 -42V42" stroke="#e8203c" stroke-width="7" stroke-linecap="round"/></g>
        <g transform="translate(0 20)">${grille}</g>
        <circle cx="0" cy="-20" r="0"/>
      </g>`;
    return { defs, back };
  },

  // network 2: under the sea, a shark biting the internet's cable
  sharkCable: (o) => {
    const defs = FILTERS + lin("sea", ["#0f7fb0", [0.45, "#08467a"], "#03132b"]) + lin("sand", ["#2c4f63", "#14283a"]) + lin("sharkB", ["#a9bfd6", [0.55, "#6f87a3"], "#3d526b"]) + lin("cab", ["#4a5170", "#1b1f33"]) + lin("ray", [["0", "#cfffff"], ["1", "#cfffff"]]);
    const R = rng(31);
    const shafts = Array.from({ length: 7 }, (_, i) => { const x = 80 + i * 190 + R() * 60; return `<path d="M${f(x)} -20L${f(x + 60)} -20L${f(x + 260)} 720L${f(x + 120)} 720Z" fill="#bff6ff" opacity="${f(0.05 + R() * 0.06)}"/>`; }).join("");
    const cab = [[-40, 640], [300, 600], [640, 560], [980, 590], [1320, 560]], cd = smooth(cab);
    const B = o.bite || { x: 690, y: 562 };
    const shark = `<g transform="translate(${B.x} ${B.y}) rotate(-24) scale(1.06)" filter="url(#sh)">
      <path d="M40 -30C140 -150 420 -170 640 -120L760 -200L740 -96C780 -60 780 -10 760 30L820 120L700 70C560 120 300 140 140 70Z" fill="url(#sharkB)"/>
      <path d="M330 -150L410 -300L470 -140Z" fill="#5d7591"/><path d="M300 70L250 170L390 90Z" fill="#5d7591"/>
      <path d="M140 70C300 140 560 120 700 70C560 60 300 70 140 20Z" fill="#eef4fb"/>
      <path d="M40 -30C20 -10 0 0 -30 -6L60 -60C110 -70 160 -50 180 -30Z" fill="url(#sharkB)"/>
      <path d="M-30 -6C-10 30 30 50 60 50L150 66C120 30 80 0 40 -30Z" fill="#eef4fb"/>
      <path d="M-24 -4L180 -26L150 64L60 50Z" fill="#5a0f1e"/>
      <path d="M-20 -6L0 14L16 -10L34 12L52 -14L70 10L88 -17L106 7L124 -20L142 4L160 -23" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
      <path d="M0 46L18 26L36 48L56 28L76 52L96 32L116 56L136 36" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="150" cy="-62" r="17" fill="#05060d"/><circle cx="145" cy="-67" r="5" fill="#fff"/><path d="M128 -84L176 -76" stroke="#3d526b" stroke-width="7" stroke-linecap="round"/>
      <path d="M220 -40Q230 -10 222 20M250 -44Q260 -12 252 22M280 -46Q290 -12 282 24" fill="none" stroke="#3d526b" stroke-width="6" stroke-linecap="round" opacity=".7"/></g>`;
    const back = `<rect width="1280" height="720" fill="url(#sea)"/>${shafts}${bubbles(9, 26, 0, 1280, 60, 640, 14, 0.5)}
      <path d="M-10 610Q200 570 420 620T900 610T1290 600V720H-10Z" fill="url(#sand)"/>
      <g opacity=".45">${[[90, 690], [1180, 660], [470, 700]].map(([x, y]) => `<path d="M${x} ${y}q-14 -60 6 -110q-30 40 -34 110M${x + 14} ${y}q20 -50 4 -90" fill="none" stroke="#1f7a6a" stroke-width="9" stroke-linecap="round"/>`).join("")}</g>
      <path d="${cd}" fill="none" stroke="#05060d" stroke-width="56" stroke-linecap="round" opacity=".35" transform="translate(0 12)" filter="url(#b4)"/>
      <path d="${cd}" fill="none" stroke="url(#cab)" stroke-width="50"/><path d="${cd}" fill="none" stroke="#8f96b8" stroke-width="50" stroke-dasharray="6 30" opacity=".5"/>
      <path d="${cd}" fill="none" stroke="#7ff6ff" stroke-width="8" stroke-dasharray="60 90" filter="url(#glow)" transform="translate(0 -4)"/>
      ${shark}
      <g transform="translate(${B.x + 30} ${B.y - 20})">${[[-60, -50], [70, -60], [-30, 50], [40, 60], [-80, 10], [90, 10]].map(([x, y]) => `<path d="M0 0L${x} ${y}" stroke="#7ff6ff" stroke-width="6" stroke-linecap="round" filter="url(#glow)"/>`).join("")}</g>`;
    const H = o.helmet;
    const front = H ? `<circle cx="${H.x}" cy="${H.y}" r="${H.r}" fill="#bff6ff" opacity=".14"/><circle cx="${H.x}" cy="${H.y}" r="${H.r}" fill="none" stroke="#e8fbff" stroke-width="7" opacity=".85"/>
      <path d="M${H.x - H.r * 0.7} ${H.y - H.r * 0.35}A${H.r * 0.8} ${H.r * 0.8} 0 0 1 ${H.x - H.r * 0.1} ${H.y - H.r * 0.78}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".7"/>
      <rect x="${H.x - H.r * 0.75}" y="${H.y + H.r * 0.82}" width="${H.r * 1.5}" height="${H.r * 0.22}" rx="${H.r * 0.08}" fill="#c98a3a" stroke="#7a4a10" stroke-width="5"/>${bubbles(4, 5, H.x + H.r * 0.4, H.x + H.r * 1.1, H.y - H.r * 1.6, H.y - H.r * 0.6, 12, 0.8)}` : "";
    return { defs, back, front };
  },

  // network 3: a face breaking into pixels that fly over the planet to a laptop on the other side
  pixelFace: (o) => {
    const defs = FILTERS + lin("mag", ["#3a0a5e", [0.5, "#8a1a8e"], "#ff3d9a"], 1, 1) + rad("globe", ["#2c7bd8", [0.7, "#123a7c"], "#0a1640"], 0.45, 0.3, 0.75) + lin("lap", ["#e6e9f5", "#9aa3bd"]);
    const R = rng(41), cols = ["#FF4FA3", "#FFA9D3", "#A81F65", "#FF7ABD", "#24242E", "#3BA7F0", "#CBA66E", "#ffffff", "#D2367F"];
    const L = o.laptop || { x: 1080, y: 420 };
    let px = "";
    for (let i = 0; i < 150; i++) { const t = Math.pow(R(), 0.8), x0 = o.from?.x ?? 430, y0 = o.from?.y ?? 360;
      const x = x0 + t * (L.x - x0) + (R() - 0.5) * 60 * (1 - t), y = y0 + t * (L.y - 70 - y0) - Math.sin(t * Math.PI) * (o.arc ?? 150) + (R() - 0.5) * (o.spread ?? 140) * (1 - t * 0.7), s = 34 - t * 22 + R() * 8;
      px += `<rect x="${f(x - s / 2)}" y="${f(y - s / 2)}" width="${f(s)}" height="${f(s)}" rx="3" fill="${cols[Math.floor(R() * cols.length)]}" transform="rotate(${f((R() - 0.5) * 40)} ${f(x)} ${f(y)})" opacity="${f(0.95 - t * 0.25)}"/>`; }
    const grid = Array.from({ length: 7 }, (_, i) => `<ellipse cx="640" cy="1180" rx="${f(820 * Math.cos((i / 7) * Math.PI / 2))}" ry="820" fill="none" stroke="#7fd4ff" stroke-width="2" opacity=".25"/>`).join("")
      + [380, 440, 520].map((y) => `<path d="M-200 ${y + 400}Q640 ${y - 60} 1480 ${y + 400}" fill="none" stroke="#7fd4ff" stroke-width="2" opacity=".2"/>`).join("");
    const back = `<rect width="1280" height="720" fill="url(#mag)"/>${rays(640, 1100, 26, "#fff", 0.04)}
      <circle cx="640" cy="1180" r="820" fill="#7fd4ff" opacity=".35" filter="url(#b30)"/><circle cx="640" cy="1180" r="820" fill="url(#globe)"/>${grid}
      <path d="M260 560q60 -40 140 -20t120 -30q40 10 30 50t-120 30q-90 10 -170 -30z M760 470q80 -30 160 0t110 60q-60 30 -150 10t-120 -70z" fill="#2fbf71" opacity=".55"/>
      <g transform="translate(${L.x} ${L.y})" filter="url(#sh)"><rect x="-150" y="-190" width="300" height="200" rx="14" fill="url(#lap)"/><rect x="-136" y="-176" width="272" height="172" rx="6" fill="#123a7c"/>
        <path d="M-186 10H186L166 44H-166Z" fill="url(#lap)"/></g>${px}`;
    return { defs, back };
  },
  // ---- the alternatives -------------------------------------------------------------------------------

  // crypto 1 (b): 2008, a bank cracked in two, chained shut, and the coins flying out through the crack
  bankCrack: () => {
    const defs = FILTERS + GOLD + lin("mint", ["#0d5c4a", [0.55, "#0a3d3a"], "#06201f"]) + lin("marble", ["#f4f1ea", "#c9c4b4"], 1, 1) + lin("marbleD", ["#bdb7a5", "#8d8775"]);
    const B = { x: 860, y: 640 };
    const col = (x) => `<rect x="${x - 24}" y="${B.y - 300}" width="48" height="280" fill="url(#marble)"/><path d="M${x - 10} ${B.y - 296}V${B.y - 24}M${x + 8} ${B.y - 296}V${B.y - 24}" stroke="#b5ae98" stroke-width="4"/><rect x="${x - 32}" y="${B.y - 316}" width="64" height="18" fill="url(#marbleD)"/><rect x="${x - 32}" y="${B.y - 24}" width="64" height="18" fill="url(#marbleD)"/>`;
    const crack = `M${B.x + 10} ${B.y - 470}L${B.x - 14} ${B.y - 400}L${B.x + 18} ${B.y - 330}L${B.x - 20} ${B.y - 250}L${B.x + 14} ${B.y - 170}L${B.x - 10} ${B.y - 80}L${B.x + 6} ${B.y}`;
    const fly = [[680, 330, 40, -20], [590, 270, 34, 15], [500, 360, 30, -30], [700, 230, 26, 25], [430, 280, 24, 10], [360, 380, 20, -15], [770, 300, 30, 5], [540, 200, 22, 30]];
    const back = `<rect width="1280" height="720" fill="url(#mint)"/>${rays(B.x, B.y - 300, 16, "#bfffe6", 0.05)}
      <path d="M0 400L120 380L240 470L360 430L480 560L600 520L720 640L800 610" fill="none" stroke="#ff4654" stroke-width="12" stroke-linejoin="round" opacity=".35"/>
      <ellipse cx="${B.x}" cy="${B.y + 10}" rx="360" ry="34" fill="#020a0a" opacity=".6" filter="url(#b12)"/>
      <g filter="url(#sh)"><path d="M${B.x - 330} ${B.y - 330}L${B.x} ${B.y - 480}L${B.x + 330} ${B.y - 330}Z" fill="url(#marble)"/><path d="M${B.x - 260} ${B.y - 350}L${B.x} ${B.y - 450}L${B.x + 260} ${B.y - 350}Z" fill="#e3ddcc"/>
      <rect x="${B.x - 340}" y="${B.y - 338}" width="680" height="26" fill="url(#marbleD)"/>${[-260, -150, 150, 260].map((dx) => col(B.x + dx)).join("")}
      <rect x="${B.x - 96}" y="${B.y - 260}" width="192" height="240" rx="8" fill="#2a2418"/><rect x="${B.x - 84}" y="${B.y - 248}" width="80" height="228" fill="#4a3a20"/><rect x="${B.x + 4}" y="${B.y - 248}" width="80" height="228" fill="#4a3a20"/>
      <rect x="${B.x - 380}" y="${B.y - 6}" width="760" height="26" fill="url(#marbleD)"/><rect x="${B.x - 400}" y="${B.y + 18}" width="800" height="26" fill="url(#marble)"/></g>
      <path d="${crack}" fill="none" stroke="#05060d" stroke-width="22" stroke-linejoin="round"/><path d="${crack}" fill="none" stroke="#ffd23f" stroke-width="7" stroke-linejoin="round" filter="url(#glow)"/>
      <path d="M${B.x - 120} ${B.y - 170}L${B.x + 120} ${B.y - 110}M${B.x - 120} ${B.y - 110}L${B.x + 120} ${B.y - 170}" stroke="#9aa3bd" stroke-width="16" stroke-dasharray="22 8"/>
      <g transform="translate(${B.x} ${B.y - 120})"><path d="M-30 -10V-38A30 30 0 0 1 30 -38V-10" fill="none" stroke="#c9cee6" stroke-width="13"/><rect x="-46" y="-14" width="92" height="74" rx="10" fill="#ffcf3a"/><circle cy="16" r="10" fill="#7a4a00"/><rect x="-4" y="18" width="8" height="22" fill="#7a4a00"/></g>
      ${fly.map(([x, y, r, rot]) => coin(x, y, r, rot, 0.15)).join("")}
      ${fly.slice(0, 5).map(([x, y, r]) => `<path d="M${x + r + 10} ${y + 6}l46 14M${x + r + 6} ${y + 20}l38 20" stroke="#ffe08a" stroke-width="5" stroke-linecap="round" opacity=".6"/>`).join("")}`;
    return { defs, back };
  },

  // crypto 2 (b): the host as a miner in a cave, swinging at a rock full of computer chips and coins
  mine: (o) => {
    const defs = FILTERS + GOLD + rad("cave", ["#5a2c7a", [0.55, "#2a1240"], "#0c0516"], 0.6, 0.45, 0.8) + lin("rock", ["#6a5a8a", "#2e2448"], 1, 1) + lin("chip", ["#2fbf71", "#0f6b3a"], 1, 1) + lin("wood", ["#c98a3a", "#7a4a10"], 1, 0) + lin("steel", ["#ffffff", "#9aa3bd", "#4d5478"], 0, 1);
    const R = rng(51), K = o.rock || { x: 820, y: 470 };
    const chip = (x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-40" y="-40" width="80" height="80" rx="8" fill="url(#chip)"/>${[-24, -8, 8, 24].map((p) => `<rect x="${p - 3}" y="-52" width="6" height="12" fill="#ffd23f"/><rect x="${p - 3}" y="40" width="6" height="12" fill="#ffd23f"/><rect x="-52" y="${p - 3}" width="12" height="6" fill="#ffd23f"/><rect x="40" y="${p - 3}" width="12" height="6" fill="#ffd23f"/>`).join("")}<rect x="-20" y="-20" width="40" height="40" rx="4" fill="#0a3d22"/></g>`;
    const sparks = Array.from({ length: 26 }, () => { const a = -Math.PI * (0.1 + R() * 0.9), d = 60 + R() * 160, x = (o.hit?.x ?? 690) + Math.cos(a) * d, y = (o.hit?.y ?? 360) + Math.sin(a) * d;
      return `<path d="M${f(x)} ${f(y)}l${f(Math.cos(a) * 26)} ${f(Math.sin(a) * 26)}" stroke="${R() < 0.5 ? "#ffd23f" : "#fff6c0"}" stroke-width="6" stroke-linecap="round" filter="url(#glow)"/>`; }).join("");
    const back = `<rect width="1280" height="720" fill="url(#cave)"/>
      <path d="M-10 -10H1290V90Q1100 160 900 110T500 140T120 100T-10 140Z" fill="#0a0414"/><path d="M-10 640Q300 600 640 630T1290 610V730H-10Z" fill="#120822"/>
      ${[[180, 70], [420, 110], [1040, 120], [760, 95]].map(([x, y]) => `<path d="M${x - 22} ${y}L${x} ${y + 70}L${x + 22} ${y}Z" fill="#0a0414"/>`).join("")}
      <g transform="translate(${K.x} ${K.y})" filter="url(#sh)"><path d="M-220 170L-260 40L-170 -120L-40 -200L120 -170L250 -60L280 90L220 180Z" fill="url(#rock)"/>
        <path d="M-170 -120L-40 -200L120 -170L60 -60L-90 -40Z" fill="#8a7aa8" opacity=".5"/><path d="M-90 -40L60 -60L250 -60M60 -60L120 60L280 90M-90 -40L-120 100L-220 170M120 60L-120 100" fill="none" stroke="#1c1530" stroke-width="5" opacity=".7"/>
        ${chip(-120, -70, 0.9, 12)}${chip(140, 20, 1.1, -8)}${chip(-20, 100, 0.7, 30)}${coin(40, -110, 46, 10)}${coin(-150, 60, 38, -20)}${coin(190, -90, 30, 20)}</g>
      <circle cx="${o.hit?.x ?? 690}" cy="${o.hit?.y ?? 360}" r="70" fill="#fff3a0" opacity=".55" filter="url(#b30)"/>${sparks}
      ${coin(560, 240, 34, -20, 0.2)}${coin(640, 160, 26, 30, 0.4)}${coin(470, 320, 22, 10, 0.1)}`;
    const P = o.pick || { x: 470, y: 250, rot: 30 };
    const front = `<g transform="translate(${P.x} ${P.y}) rotate(${P.rot})" filter="url(#sh)"><rect x="-10" y="-20" width="20" height="300" rx="8" fill="url(#wood)"/><path d="M-170 -34Q0 -96 170 -34L160 -14Q0 -60 -160 -14Z" fill="url(#steel)"/><rect x="-22" y="-56" width="44" height="50" rx="6" fill="#4d5478"/></g>`
      + (o.lamp ? `<g transform="translate(${o.lamp.x} ${o.lamp.y})"><path d="M0 0L${o.lamp.dx ?? 400} -60L${o.lamp.dx ?? 400} 120Z" fill="#fff6c0" opacity=".18" filter="url(#b12)"/><circle r="18" fill="#fff6c0" stroke="#4d5478" stroke-width="7" filter="url(#glow)"/></g>` : "");
    return { defs, back, front };
  },

  // crypto 3 (b): the popcorn tin, stuffed with bitcoin; the host pops out of it
  popcorn: (o) => {
    const defs = FILTERS + GOLD + lin("stage", ["#2a0a14", [0.6, "#5e0f22"], "#8a1428"]) + lin("tinW", ["#ffffff", "#d9d2c4"], 1, 0) + lin("tinR", ["#ff4654", "#b3131f"], 1, 0) + rad("spot", [["0", "#fff6d0", 0.75], ["1", "#fff6d0", 0]], 0.5, 0.5, 0.5);
    const T = o.tin || { x: 640, y: 720, w: 470, h: 300 }, R = rng(61);
    const kernel = (x, y, s) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><circle cx="-10" cy="0" r="16" fill="#fff6d6"/><circle cx="8" cy="-6" r="15" fill="#fffbe8"/><circle cx="6" cy="10" r="14" fill="#f6e2a8"/><circle cx="-4" cy="-12" r="10" fill="#fff"/></g>`;
    let pile = "";
    for (let i = 0; i < 70; i++) { const x = T.x + (R() * 2 - 1) * T.w * 0.48, y = T.y - T.h - R() * 70 + Math.abs(x - T.x) * 0.18; pile += R() < 0.42 ? coin(x, y, 22 + R() * 14, R() * 60 - 30, 0.25 + R() * 0.3) : kernel(x, y, 0.9 + R() * 0.6); }
    const stripes = Array.from({ length: 9 }, (_, i) => { const x0 = T.x - T.w / 2 + (i * T.w) / 9; return i % 2 ? "" : `<path d="M${f(x0)} ${T.y - T.h}H${f(x0 + T.w / 9)}L${f(x0 + T.w / 9 - 4 + (i - 4) * 4)} ${T.y}H${f(x0 + 4 + (i - 4) * 4)}Z" fill="url(#tinR)"/>`; }).join("");
    const spill = Array.from({ length: 14 }, (_, i) => { const x = 120 + R() * 1040, y = 560 + R() * 140; return R() < 0.5 ? coin(x, y, 22 + R() * 10, R() * 80 - 40, 0.55) : kernel(x, y, 0.8); }).join("");
    const back = `<rect width="1280" height="720" fill="url(#stage)"/><circle cx="${T.x}" cy="${T.y - T.h}" r="420" fill="url(#spot)"/>
      ${rays(T.x, T.y - T.h - 40, 22, "#ffd23f", 0.08)}${spill}
      <g transform="translate(${T.x + 300} ${T.y - 40}) rotate(28)" filter="url(#sh)"><ellipse rx="${T.w / 2 + 20}" ry="40" fill="#b3131f"/><ellipse rx="${T.w / 2 + 20}" ry="40" fill="url(#tinR)" transform="translate(0 -10)"/><ellipse rx="${T.w / 2 - 30}" ry="22" fill="#ff8a94" opacity=".5" transform="translate(0 -12)"/></g>`;
    const front = `<g filter="url(#sh)"><path d="M${T.x - T.w / 2} ${T.y - T.h}L${T.x - T.w / 2 + 16} ${T.y}H${T.x + T.w / 2 - 16}L${T.x + T.w / 2} ${T.y - T.h}Z" fill="url(#tinW)"/>${stripes}
      <ellipse cx="${T.x}" cy="${T.y - T.h}" rx="${T.w / 2 + 8}" ry="26" fill="none" stroke="#e8e3d3" stroke-width="14"/></g>${pile}`;
    return { defs, back, front };
  },

  // crypto 4 (b): a soap bubble with a bitcoin inside, and the host coming at it with a pin
  bubble: (o) => {
    const defs = FILTERS + GOLD + lin("deep", ["#0a3a44", [0.6, "#06222c"], "#03121a"]) + rad("film", [["0", "#ffffff", 0], [0.78, "#7ff6ff", 0.06], [0.9, "#ff8ad8", 0.28], [0.96, "#ffe66d", 0.45], ["1", "#7ff6ff", 0.7]], 0.5, 0.5, 0.5);
    const Bb = o.bubble || { x: 520, y: 360, r: 270 };
    const back = `<rect width="1280" height="720" fill="url(#deep)"/>${rays(Bb.x, Bb.y, 20, "#7ff6ff", 0.04)}${bubbles(71, 22, 0, 1280, 0, 720, 26, 0.35)}
      <circle cx="${Bb.x}" cy="${Bb.y}" r="${Bb.r + 60}" fill="#7ff6ff" opacity=".12" filter="url(#b30)"/>
      ${coin(Bb.x, Bb.y + 10, Bb.r * 0.55, -12)}
      <circle cx="${Bb.x}" cy="${Bb.y}" r="${Bb.r}" fill="url(#film)"/><circle cx="${Bb.x}" cy="${Bb.y}" r="${Bb.r}" fill="none" stroke="#e8fbff" stroke-width="5" opacity=".7"/>
      <path d="M${Bb.x - Bb.r * 0.72} ${Bb.y - Bb.r * 0.3}A${Bb.r * 0.78} ${Bb.r * 0.78} 0 0 1 ${Bb.x - Bb.r * 0.2} ${Bb.y - Bb.r * 0.74}" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="${Bb.x + Bb.r * 0.5}" cy="${Bb.y + Bb.r * 0.55}" rx="30" ry="14" transform="rotate(-40 ${Bb.x + Bb.r * 0.5} ${Bb.y + Bb.r * 0.55})" fill="#fff" opacity=".5"/>`;
    const N = o.pin || { x: 860, y: 420, rot: -128, len: 330 };
    const front = `<g transform="translate(${N.x} ${N.y}) rotate(${N.rot})" filter="url(#sh)"><path d="M0 -5L${N.len} -2L${N.len + 40} 0L${N.len} 2L0 5Z" fill="#e6e9f5"/><path d="M0 -2L${N.len} -1" stroke="#fff" stroke-width="2"/><circle cx="-16" r="30" fill="#ff4654"/><circle cx="-24" cy="-9" r="9" fill="#fff" opacity=".6"/></g>`;
    return { defs, back, front };
  },

  // crypto 5 (b): a coin with a dog on it, riding a rocket to the moon
  dogRocket: (o) => {
    const defs = FILTERS + GOLD + rad("sun5", ["#fff6b0", [0.45, "#ffd23f"], "#ff9a1f"], 0.7, 0.75, 0.9) + lin("flame", ["#ff2e2e", [0.4, "#ff7a1a"], [0.75, "#ffe066"], "#fff"], 1, 0) + lin("hull", ["#ffffff", [0.6, "#d9dfee"], "#8f96b8"], 0, 1);
    const Rk = o.rocket || { x: 640, y: 400, rot: -32 };
    const halftone = Array.from({ length: 14 }, (_, j) => Array.from({ length: 24 }, (_, i) => `<circle cx="${i * 56 + (j % 2) * 28}" cy="${j * 52}" r="${f(3 + (j / 14) * 9)}"/>`).join("")).join("");
    const dog = `<g transform="scale(.6) translate(0 6)"><path d="M-70 -60L-92 -104L-40 -84ZM70 -60L92 -104L40 -84Z" fill="#a8641c"/><ellipse cx="0" cy="-10" rx="88" ry="80" fill="#e2a95a"/><ellipse cx="0" cy="26" rx="46" ry="38" fill="#fbe7c4"/><circle cx="-32" cy="-28" r="12" fill="#05060d"/><circle cx="32" cy="-28" r="12" fill="#05060d"/><circle cx="-28" cy="-32" r="4" fill="#fff"/><circle cx="36" cy="-32" r="4" fill="#fff"/><ellipse cx="0" cy="8" rx="15" ry="10" fill="#05060d"/><path d="M-22 32Q0 56 22 32" fill="#c0392b" stroke="#05060d" stroke-width="6" stroke-linecap="round"/><path d="M-12 50Q0 72 12 50" fill="#ff6b8a"/></g>`;
    const back = `<rect width="1280" height="720" fill="url(#sun5)"/><g fill="#ff9a1f" opacity=".35">${halftone}</g>${rays(Rk.x, Rk.y, 18, "#fff", 0.16)}
      <circle cx="1120" cy="110" r="70" fill="#fffbe8"/><circle cx="1100" cy="96" r="14" fill="#e8dfc0"/><circle cx="1140" cy="130" r="10" fill="#e8dfc0"/>
      ${cloud(180, 640, 1.4, "#fff", 0.9)}${cloud(420, 690, 1.1, "#fff", 0.9)}${cloud(1000, 660, 1.3, "#fff", 0.9)}
      <g transform="translate(${Rk.x} ${Rk.y}) rotate(${Rk.rot})">
        <path d="M-200 -70Q-520 -30 -640 0Q-520 30 -200 70Q-250 0 -200 -70Z" fill="#ff7a1a" opacity=".55" filter="url(#b12)"/><path d="M-200 -50Q-440 -10 -520 0Q-440 10 -200 50Q-240 0 -200 -50Z" fill="url(#flame)"/><path d="M-200 -26Q-330 0 -200 26Z" fill="#fff"/>
        <g filter="url(#sh)"><path d="M-200 -60H120Q230 -60 280 0Q230 60 120 60H-200Z" fill="url(#hull)"/><path d="M200 -46Q250 -30 280 0Q250 30 200 46Z" fill="#ff4654"/>
        <path d="M-200 -60L-250 -130L-120 -60Z M-200 60L-250 130L-120 60Z" fill="#ff4654"/><rect x="-210" y="-64" width="24" height="128" rx="6" fill="#8f96b8"/></g>
        <g transform="translate(40 -6) rotate(${-Rk.rot})">${coin(0, 0, 96)}${dog}</g></g>
      ${[[300, 200], [380, 120], [880, 520]].map(([x, y]) => `<path d="M${x} ${y}l0 -20M${x} ${y}l0 20M${x} ${y}l-20 0M${x} ${y}l20 0" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`).join("")}`;
    return { defs, back };
  },

  // network 1 (b): a palm tree that is obviously a mobile mast in disguise
  palmTower: (o) => {
    const defs = FILTERS + lin("dusk6", ["#3a1d6e", [0.45, "#d94a7a"], [0.75, "#ff9a4a"], "#ffd27a"]) + lin("dune", ["#e0904a", "#9a4a2a"]) + lin("frond", ["#3fae6a", "#1d6b3a"], 1, 1) + lin("pole", ["#c9cee6", "#7c839e", "#c9cee6"], 1, 0);
    const X = o.x ?? 760, top = 150;
    const frond = (a, len) => { const r = (a * Math.PI) / 180, ex = Math.cos(r) * len, ey = Math.sin(r) * len, mx = ex * 0.5, my = ey * 0.5 - len * 0.25;
      return `<path d="M0 0Q${f(mx)} ${f(my - 30)} ${f(ex)} ${f(ey)}Q${f(mx)} ${f(my + 30)} 0 0Z" fill="url(#frond)"/><path d="M0 0Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}" fill="none" stroke="#155a2e" stroke-width="5"/>${Array.from({ length: 6 }, (_, i) => { const t = (i + 1) / 7; return `<path d="M${f(mx * 2 * t * (1 - t) + ex * t * t)} ${f(my * 2 * t * (1 - t) + ey * t * t)}l${f(-ey / len * 26)} ${f(ex / len * 26)}" stroke="#0f4a26" stroke-width="3" opacity=".6"/>`; }).join("")}`; };
    const lattice = Array.from({ length: 12 }, (_, i) => { const y0 = top + 40 + i * 44, w0 = 18 + i * 3.4, w1 = 18 + (i + 1) * 3.4; return `<path d="M${X - w0} ${y0}L${X + w1} ${y0 + 44}M${X + w0} ${y0}L${X - w1} ${y0 + 44}M${X - w0} ${y0}H${X + w0}" stroke="#7c839e" stroke-width="5"/>`; }).join("");
    const panel = (dx, dy, r) => `<g transform="translate(${X + dx} ${top + dy}) rotate(${r})"><rect x="-14" y="-50" width="28" height="100" rx="6" fill="#e6e9f5" stroke="#7c839e" stroke-width="4"/></g>`;
    const back = `<rect width="1280" height="720" fill="url(#dusk6)"/><circle cx="420" cy="520" r="170" fill="#ffe8a0" opacity=".85"/><circle cx="420" cy="520" r="250" fill="#ffd27a" opacity=".35" filter="url(#b30)"/>
      <path d="M-10 560Q300 500 640 560T1290 540V730H-10Z" fill="#c4683a"/><path d="M-10 620Q400 560 800 630T1290 610V730H-10Z" fill="url(#dune)"/>
      ${[[150, 560, 0.5], [1150, 545, 0.6]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#4a1a3a"><path d="M-8 0Q-14 -150 4 -300L14 -300Q0 -150 8 0Z"/>${[-160, -120, -60, -20, 20].map((a) => `<path transform="translate(8 -300) rotate(${a})" d="M0 0Q60 -30 140 10Q60 -10 0 0Z"/>`).join("")}</g>`).join("")}
      <path d="M${X - 18} ${top + 40}L${X - 60} 650H${X + 60}L${X + 18} ${top + 40}Z" fill="url(#pole)"/>${lattice}
      ${panel(-46, 40, -8)}${panel(46, 40, 8)}${panel(0, 26, 0)}
      <g transform="translate(${X} ${top + 10})">${[-170, -140, -110, -70, -40, -10, 15, 200, 170].map((a, i) => frond(a, 190 + (i % 3) * 30)).join("")}</g>
      <rect x="${X - 4}" y="${top - 70}" width="8" height="80" fill="#7c839e"/><circle cx="${X}" cy="${top - 74}" r="13" fill="#ff2e2e" filter="url(#glow)"/>
      ${[50, 90, 130].map((r, i) => `<path d="M${X - r} ${top - 74 - r * 0.3}A${r} ${r} 0 0 1 ${X + r} ${top - 74 - r * 0.3}" fill="none" stroke="#fff" stroke-width="${8 - i * 2}" stroke-linecap="round" opacity="${0.8 - i * 0.2}" transform="translate(0 ${r * 0.3})"/>`).join("")}
      <path d="M${X - 50} 650h100" stroke="#4d5478" stroke-width="10"/>`;
    return { defs, back };
  },

  // network 2 (b): a cloud cut open; inside, racks of servers and hoses running down to the ground
  noCloud: () => {
    const defs = FILTERS + lin("skyB", ["#3aa8ff", [0.7, "#a8dcff"], "#e8f6ff"]) + lin("rack", ["#2a2f45", "#11152e"], 1, 0) + rad("inside", ["#1a1f3a", "#05060d"], 0.5, 0.5, 0.6);
    const C = { x: 820, y: 260 }, R = rng(81);
    const puff = (c, op = 1) => `<g fill="${c}" opacity="${op}"><circle cx="${C.x - 250}" cy="${C.y + 40}" r="110"/><circle cx="${C.x - 110}" cy="${C.y - 70}" r="150"/><circle cx="${C.x + 80}" cy="${C.y - 90}" r="170"/><circle cx="${C.x + 250}" cy="${C.y + 10}" r="130"/><rect x="${C.x - 330}" y="${C.y}" width="660" height="150" rx="75"/></g>`;
    const racks = Array.from({ length: 5 }, (_, i) => { const x = C.x - 250 + i * 104; return `<rect x="${x}" y="${C.y - 120}" width="84" height="250" rx="6" fill="url(#rack)"/>${Array.from({ length: 9 }, (_, j) => `<rect x="${x + 8}" y="${C.y - 108 + j * 26}" width="68" height="18" rx="3" fill="#1d2440"/><circle cx="${x + 18}" cy="${C.y - 99 + j * 26}" r="4" fill="${R() < 0.5 ? "#58d68d" : R() < 0.5 ? "#35c8ff" : "#ff4654"}"/><circle cx="${x + 32}" cy="${C.y - 99 + j * 26}" r="4" fill="${R() < 0.6 ? "#58d68d" : "#1d2440"}"/>`).join("")}`; }).join("");
    const hoses = [[-200, 120, 120, 720], [-60, 150, 300, 720], [80, 150, 560, 720], [220, 120, 900, 720], [300, 90, 1240, 690]].map(([dx, dy, x1, y1], i) => `<path d="M${C.x + dx} ${C.y + dy}C${C.x + dx} ${C.y + dy + 200} ${x1} ${y1 - 260} ${x1} ${y1 + 20}" fill="none" stroke="#05060d" stroke-width="${26 - i}" opacity=".9"/><path d="M${C.x + dx} ${C.y + dy}C${C.x + dx} ${C.y + dy + 200} ${x1} ${y1 - 260} ${x1} ${y1 + 20}" fill="none" stroke="#5a6080" stroke-width="6" opacity=".7" transform="translate(-4 -2)"/>`).join("");
    const back = `<rect width="1280" height="720" fill="url(#skyB)"/>${cloud(140, 180, 0.9, "#fff", 0.7)}${cloud(320, 90, 0.6, "#fff", 0.6)}
      <path d="M-10 640Q400 600 800 650T1290 630V730H-10Z" fill="#3fae6a"/><path d="M-10 680Q500 650 1290 690V730H-10Z" fill="#2a8a52"/>${hoses}
      <g filter="url(#sh)">${puff("#ffffff")}</g>${puff("#dbeeff", 0.5)}
      <path d="M${C.x - 300} ${C.y - 140}H${C.x + 300}V${C.y + 150}H${C.x - 300}Z" fill="url(#inside)" transform="skewX(-4)"/>${racks}
      <path d="M${C.x - 300} ${C.y - 140}l40 -24l50 22l46 -26l52 24l48 -26l52 24l48 -24l52 22l48 -26l50 24l14 4M${C.x - 300} ${C.y + 150}l40 22l50 -22l46 26l52 -24l48 26l52 -24l48 24l52 -22l48 26l50 -24l14 -4" fill="none" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>`;
    return { defs, back };
  },

  // network 3 (b): the video call froze: a giant laptop, a face caught mid-blink, and the spinner
  frozenCall: (o) => {
    const defs = FILTERS + lin("slate", ["#2a2f45", [0.6, "#151a2e"], "#0b0e1c"]) + lin("lapB", ["#e6e9f5", "#8f96b8"]) + lin("screenB", ["#3a4a7a", "#1a2244"]);
    const L = o.laptop || { x: 760, y: 330, w: 760, h: 470 }, R = rng(91);
    const glitch = Array.from({ length: 14 }, () => { const y = L.y - L.h / 2 + 40 + R() * (L.h - 120), h = 6 + R() * 20, x = L.x - L.w / 2 + 30 + R() * 200;
      return `<rect x="${f(x)}" y="${f(y)}" width="${f(120 + R() * 360)}" height="${f(h)}" fill="${R() < 0.5 ? "#ff2e88" : "#35c8ff"}" opacity=".35"/>`; }).join("");
    const blocks = Array.from({ length: o.blocks ?? 7 }, () => { const s = 24 + R() * 30; return `<rect x="${f(L.x - 200 + R() * 400)}" y="${f(L.y - 60 + R() * 160)}" width="${f(s)}" height="${f(s)}" fill="${["#FF4FA3", "#A81F65", "#24242E", "#CBA66E"][Math.floor(R() * 4)]}" opacity=".55"/>`; }).join("");
    const spin = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<circle cx="${f(Math.cos(a) * 52)}" cy="${f(Math.sin(a) * 52)}" r="${f(6 + i * 0.9)}" fill="#fff" opacity="${f(0.2 + i * 0.08)}"/>`; }).join("");
    const back = `<rect width="1280" height="720" fill="url(#slate)"/>${rays(L.x, L.y, 24, "#fff", 0.025)}
      <g filter="url(#sh)"><rect x="${L.x - L.w / 2 - 22}" y="${L.y - L.h / 2 - 22}" width="${L.w + 44}" height="${L.h + 44}" rx="26" fill="url(#lapB)"/>
      <path d="M${L.x - L.w / 2 - 90} ${L.y + L.h / 2 + 22}H${L.x + L.w / 2 + 90}L${L.x + L.w / 2 + 50} ${L.y + L.h / 2 + 80}H${L.x - L.w / 2 - 50}Z" fill="url(#lapB)"/></g>
      <rect x="${L.x - L.w / 2}" y="${L.y - L.h / 2}" width="${L.w}" height="${L.h}" rx="8" fill="url(#screenB)"/>`;
    const front = `<g style="mix-blend-mode:screen">${glitch}</g>${blocks}
      <g transform="translate(${L.x + (o.spin?.dx ?? 0)} ${L.y + (o.spin?.dy ?? 0)}) scale(${o.spin?.s ?? 1})"><circle r="92" fill="#05060d" opacity=".55"/>${spin}</g>
      <g transform="translate(${L.x - L.w / 2 + 40} ${L.y + L.h / 2 - 50})"><rect x="0" y="-26" width="${L.w - 80}" height="52" rx="26" fill="#05060d" opacity=".55"/><circle cx="${L.w / 2 - 40 - 60}" r="18" fill="#ff4654"/><circle cx="${L.w / 2 - 40}" r="18" fill="#c9cee6"/><circle cx="${L.w / 2 - 40 + 60}" r="18" fill="#c9cee6"/></g>
      <g transform="translate(${L.x + L.w / 2 - 70} ${L.y - L.h / 2 + 40})"><rect x="-10" y="-14" width="10" height="28" fill="#ff4654"/><rect x="6" y="-4" width="10" height="18" fill="#5a6080"/><rect x="22" y="6" width="10" height="8" fill="#5a6080"/></g>`;
    return { defs, back, front };
  },
};
