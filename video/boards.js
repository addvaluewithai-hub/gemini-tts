// Motion-graphics boards for explainer episodes. Each board is a pure function of where it is in time:
//   board(spec, step, age, total, cfg) -> HTML for a 1920 x 1080 frame
// `step` is how many beats the board has been through, `age` the seconds since this step began, `total`
// the seconds since the board appeared. Earlier steps are drawn finished; the current one animates.
// Text can be Latin or Arabic; nothing here measures text, so labels stay short.
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (p) => { p = clamp(p); return p * p * (3 - 2 * p); };
const lerp = (a, b, p) => a + (b - a) * p;
const pop = (a) => (a <= 0 ? 0 : Math.min(1, a / 0.1) * (1 + 0.28 * Math.exp(-a * 11) * Math.cos(a * 17)));
const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const since = (i, step, age) => (i < step ? 99 : i === step ? age : -1);       // seconds since item i came in, or -1
const C = { ink: "#05060d", navy: "#11152e", panel: "#1c2250", line: "#7fd4ff", white: "#eef0ff", dim: "#9fb0ff", yellow: "#FFE66D", pink: "#ff4fa3", cyan: "#35c8ff", green: "#58d68d", red: "#ff4654", gold: "#f2b632", paper: "#f3efe4" };
const T = (x, y, text, size, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="${o.font || "Anton"}" font-size="${size}" fill="${o.fill || C.white}" opacity="${o.opacity ?? 1}" ${o.weight ? `font-weight="${o.weight}"` : ""} style="unicode-bidi:plaintext" ${o.extra || ""}>${esc(text)}</text>`;
const G = (x, y, s, inner, extra = "") => `<g transform="translate(${x} ${y}) scale(${s})" ${extra}>${inner}</g>`;
const svg = (inner, defs = "") => `<svg viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg"><defs><filter id="bglow"><feGaussianBlur stdDeviation="14"/></filter>${defs}</defs>${inner}</svg>`;
const heading = (text, a, y = 150) => (text ? G(960, y, pop(a), T(0, 0, text, 84, { fill: C.yellow })) : "");
const caption = (text, a, y = 890) => (text && a > 0 ? `<g opacity="${clamp(a / 0.25)}" transform="translate(0 ${(1 - ease(a / 0.3)) * 20})">${T(960, y, text, 50, { font: "Elite", fill: C.white })}</g>` : "");

// ---- icons, drawn around (0,0), roughly 200 units tall -------------------------------------------------
const ICON = {
  person: (c = C.cyan) => `<circle cx="0" cy="-52" r="40" fill="${c}"/><path d="M-66 84C-66 6 66 6 66 84Z" fill="${c}"/>`,
  bank: (c = C.white) => `<path d="M-100 -34L0 -96L100 -34Z" fill="${c}"/><rect x="-92" y="-22" width="184" height="16" fill="${c}"/>${[-72, -24, 24, 72].map((x) => `<rect x="${x - 13}" y="2" width="26" height="74" rx="4" fill="${c}"/>`).join("")}<rect x="-104" y="80" width="208" height="20" rx="4" fill="${c}"/>`,
  coin: (c = C.gold, letter = "B") => `<circle r="74" fill="${c}"/><circle r="58" fill="none" stroke="#7a5200" stroke-width="6" opacity=".55"/><text y="30" text-anchor="middle" font-family="Anton" font-size="86" fill="#5d3d00">${letter}</text><path d="M-12 -52v-14M12 -52v-14M-12 52v14M12 52v14" stroke="#5d3d00" stroke-width="9" stroke-linecap="round"/>`,
  cash: () => `<rect x="-100" y="-56" width="200" height="112" rx="12" fill="#3fae6a"/><rect x="-84" y="-40" width="168" height="80" rx="6" fill="none" stroke="#d7ffe6" stroke-width="5" opacity=".7"/><circle r="26" fill="#d7ffe6" opacity=".85"/>`,
  gold: () => `<path d="M-90 50L-60 -40H60L90 50Z" fill="${C.gold}"/><path d="M-60 -40H60L48 -8H-48Z" fill="#ffe08a"/>`,
  fish: () => `<path d="M-90 0C-40 -70 50 -60 80 0C50 60 -40 70 -90 0Z" fill="${C.cyan}"/><path d="M70 0L118 -44V44Z" fill="${C.cyan}"/><circle cx="-48" cy="-10" r="9" fill="${C.ink}"/>`,
  bread: () => `<path d="M-96 44C-120 -30 -60 -70 0 -70C60 -70 120 -30 96 44Z" fill="#d79a4a"/><path d="M-40 -50l12 44M0 -58l12 50M40 -50l12 44" stroke="#8a5a1c" stroke-width="9" stroke-linecap="round"/>`,
  phone: () => `<rect x="-58" y="-100" width="116" height="200" rx="20" fill="${C.white}"/><rect x="-46" y="-80" width="92" height="150" rx="8" fill="${C.panel}"/><text y="10" text-anchor="middle" font-family="Anton" font-size="44" fill="${C.yellow}">100</text><circle cy="84" r="7" fill="${C.panel}"/>`,
  file: (label = "") => `<path d="M-70 -96H30L74 -52V96H-70Z" fill="${C.paper}"/><path d="M30 -96V-52H74Z" fill="#cfc8b4"/><text y="30" text-anchor="middle" font-family="Anton" font-size="46" fill="${C.ink}">${esc(label)}</text>`,
  node: (c = C.cyan) => `<rect x="-58" y="-48" width="116" height="80" rx="10" fill="${c}"/><rect x="-46" y="-36" width="92" height="56" rx="4" fill="${C.navy}"/><path d="M-30 -18h60M-30 -2h44" stroke="${c}" stroke-width="7" stroke-linecap="round"/><rect x="-10" y="32" width="20" height="16" fill="${c}"/><rect x="-36" y="46" width="72" height="10" rx="5" fill="${c}"/>`,
  pizza: () => `<circle r="92" fill="#d79a4a"/><circle r="76" fill="#f4c84a"/>${[[-30, -30], [34, -18], [-8, 34], [40, 40], [-48, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#c8402f"/>`).join("")}<path d="M0 -76V76M-66 -38L66 38M-66 38L66 -38" stroke="#d79a4a" stroke-width="5"/>`,
  ghost: (c = C.white) => `<circle cx="0" cy="-52" r="44" fill="none" stroke="${c}" stroke-width="8" stroke-dasharray="14 12"/><path d="M-72 90C-72 6 72 6 72 90" fill="none" stroke="${c}" stroke-width="8" stroke-dasharray="14 12"/><text y="-28" text-anchor="middle" font-family="Anton" font-size="64" fill="${c}">?</text>`,
};
const icon = (name, ...a) => (ICON[name] || ICON.person)(...a);
const labelled = (x, y, s, name, label, a, o = {}) => G(x, y, s * pop(a), `${o.glow ? `<circle r="130" fill="${o.glow}" opacity=".25" filter="url(#bglow)"/>` : ""}${icon(name, ...(o.args || []))}`, `opacity="${o.opacity ?? 1}"`)
  + (label && a > 0.1 ? `<g opacity="${clamp((a - 0.1) / 0.2) * (o.opacity ?? 1)}">${T(x, y + 150 * s + 30, label, 46, { font: "Elite", fill: o.labelFill || C.white })}</g>` : "");

const BOARDS = {
  // A name and a line under it, for openings.
  titlecard(s, step, age, total) {
    return svg(`<g transform="translate(960 470) scale(${pop(total)})">${T(0, -150, s.kicker, 56, { font: "Elite", fill: C.dim })}${T(0, 0, s.title, 190, { fill: C.yellow })}</g>
      <rect x="${960 - 300 * ease((total - 0.3) / 0.5)}" y="540" width="${600 * ease((total - 0.3) / 0.5)}" height="10" rx="5" fill="${C.pink}"/>
      <g opacity="${clamp((total - 0.5) / 0.3)}">${T(960, 650, s.sub, 70, { fill: C.white })}</g>`);
  },
  // Things in a row, one per step, joined by arrows: barter, gold, paper, numbers.
  steps(s, step, age) {
    const n = s.items.length, x0 = 960 - (n - 1) * 190 * (n > 4 ? 0.9 : 1.15), dx = n > 1 ? (960 - x0) * 2 / (n - 1) : 0;
    const body = s.items.map((it, i) => { const a = since(i, step, age); if (a < 0) return ""; const x = x0 + i * dx, now = i === Math.min(step, n - 1);
      return (i ? `<path d="M${x - dx + 150} 480H${x - 150}" stroke="${C.line}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${dx}" stroke-dashoffset="${dx * (1 - ease(a / 0.4))}" opacity=".7"/><path d="M${x - 148} 480l-22 -16v32z" fill="${C.line}" opacity="${0.7 * clamp(a / 0.4)}"/>` : "")
        + labelled(x, 480, now ? 1.5 : 1.2, it.icon, it.label, a, { glow: now ? C.yellow : null, opacity: now ? 1 : 0.6, args: it.args })
        + (it.sub && a > 0.3 ? `<g opacity="${clamp((a - 0.3) / 0.3) * (now ? 1 : 0.55)}">${T(x, 850, it.sub, 42, { font: "Elite", fill: C.dim })}</g>` : ""); }).join("");
    return svg(heading(s.title, 1) + body + caption((s.captions || [])[step], age));
  },
  // A page of names and balances. Each step after the first moves an amount from one row to another.
  ledger(s, step, age) {
    const rows = s.rows.map((r) => ({ ...r })), W = 1240, x = 960 - W / 2, y0 = 270, rh = 150, ops = s.ops || [];
    let moving = null;
    ops.forEach((op, k) => { const a = since(k + 1, step, age); if (a < 0) return; const p = ease(a / 0.9);
      rows[op.from].amount -= op.amount * p; rows[op.to].amount += op.amount * p; if (a < 1.6) moving = { op, a }; });
    const body = rows.map((r, i) => { const a = step > 0 ? 9 : age - i * 0.18, y = y0 + i * rh, hit = moving && (moving.op.from === i || moving.op.to === i), up = moving && moving.op.to === i;
      return a <= 0 ? "" : `<g opacity="${clamp(a / 0.2)}"><rect x="${x + 30}" y="${y + 10}" width="${W - 60}" height="${rh - 20}" rx="14" fill="${hit ? (up ? "#173d2c" : "#40161c") : "#161b40"}"/>
        ${T(x + W - 80, y + 98, r.name, 76, { anchor: "end", font: "Elite" })}${T(x + 90, y + 104, Math.round(r.amount).toLocaleString("en"), 92, { anchor: "start", fill: hit ? (up ? C.green : C.red) : C.yellow })}</g>`; }).join("");
    const arrow = moving ? (() => { const { op, a } = moving, ya = y0 + op.from * rh + 75, yb = y0 + op.to * rh + 75, p = ease(a / 0.9), cx = x - 110, y = lerp(ya, yb, p);
      return `<path d="M${x + 20} ${ya}C${cx} ${ya} ${cx} ${yb} ${x + 20} ${yb}" fill="none" stroke="${C.line}" stroke-width="6" stroke-dasharray="12 12" opacity=".6"/>${G(x - 50 - 36 * Math.sin(Math.PI * p), y, 0.7, icon("coin"))}`; })() : "";
    return svg(`${heading(s.title, 1)}<rect x="${x}" y="${y0 - 30}" width="${W}" height="${rows.length * rh + 60}" rx="26" fill="${C.navy}" stroke="${C.line}" stroke-opacity=".35" stroke-width="4"/>
      ${body}${arrow}${caption((s.captions || [])[step], age, Math.min(890, y0 + rows.length * rh + 110))}`);
  },
  // People and a go-between. Each step is a move of a coin, a set of badges on someone, or a cross through them.
  flow(s, step, age) {
    const n = s.actors.length, xs = s.actors.map((_, i) => 960 + (i - (n - 1) / 2) * (n > 2 ? 620 : 900)), y = 540; let extra = "";
    const crossed = new Set();
    s.sequence.forEach((q, k) => { const a = since(k + 1, step, age); if (a < 0) return;
      if (q.move) { const [f, t] = q.move, p = ease(a / (q.slow ? 1.8 : 0.9)), x = lerp(xs[f], xs[t], p), yy = y - 250 - 66 * Math.sin(Math.PI * p);
        extra += `<path d="M${xs[f]} ${y - 230}Q${(xs[f] + xs[t]) / 2} ${y - 390} ${xs[t]} ${y - 230}" fill="none" stroke="${C.line}" stroke-width="6" stroke-dasharray="14 14" opacity=".5"/>`;
        if (a < (q.slow ? 2.6 : 1.5)) extra += G(x, yy, 0.72, icon(q.token || "coin")) + (q.label && a > 0.2 ? T((xs[f] + xs[t]) / 2, y - 190, q.label, 46, { font: "Elite", fill: C.yellow }) : ""); }
      if (q.badges) q.badges.forEach((b, j) => { const ba = a - j * (q.every ?? 0.45); if (ba <= 0) return; const bx = xs[q.at] + (j - (q.badges.length - 1) / 2) * 350, by = y + 330;
        extra += G(bx, by, pop(ba), `<rect x="-160" y="-44" width="320" height="88" rx="44" fill="${C.red}"/>${T(0, 20, b, 54, { fill: "#fff" })}`); });
      if (q.cross !== undefined) { crossed.add(q.cross); const p = ease(a / 0.35), cx = xs[q.cross];
        extra += `<path d="M${cx - 130} ${y - 130}L${cx - 130 + 260 * p} ${y - 130 + 260 * p}" stroke="${C.red}" stroke-width="26" stroke-linecap="round"/>${a > 0.25 ? `<path d="M${cx + 130} ${y - 130}L${cx + 130 - 260 * ease((a - 0.25) / 0.35)} ${y - 130 + 260 * ease((a - 0.25) / 0.35)}" stroke="${C.red}" stroke-width="26" stroke-linecap="round"/>` : ""}`; }
    });
    const actors = s.actors.map((ac, i) => labelled(xs[i], y, ac.big ? 1.6 : 1.3, ac.icon, ac.label, step > 0 ? 9 : age - i * 0.2, { args: ac.args, opacity: crossed.has(i) ? 0.35 : 1 })).join("");
    return svg(heading(s.title, 1) + actors + extra + caption((s.captions || [])[step], age));
  },
  // A digital thing copies itself; then two people each hold "the only one".
  copy(s, step, age) {
    let body = "";
    if (step === 0) body = labelled(960, 480, 1.3 * (1 + 0.03 * Math.sin(age * 5)), "file", "", age, { args: [s.file || "💰"] }) + (age > 0.2 ? T(960, 760, s.name || "", 54, { font: "Elite", fill: C.dim }) : "");
    else if (step === 1) { const k = Math.min(4, 1 + Math.floor(age / 0.35)), m = 2 ** k;
      for (let i = 0; i < m; i++) { const col = i % 8, row = Math.floor(i / 8), cols = Math.min(m, 8), a = age - Math.floor(Math.log2(i + 1)) * 0.35;
        body += G(960 + (col - (cols - 1) / 2) * 200, 430 + row * 250 - (m > 8 ? 60 : 0), 0.8 * pop(a), icon("file", s.file || "")); }
      body += G(960, 850, pop(age), `<rect x="-250" y="-46" width="230" height="92" rx="14" fill="${C.panel}" stroke="${C.line}" stroke-width="4"/>${T(-135, 20, "COPY", 54)}<rect x="20" y="-46" width="230" height="92" rx="14" fill="${C.panel}" stroke="${C.line}" stroke-width="4"/>${T(135, 20, "PASTE", 54)}`); }
    else { const p = ease(age / 0.8);
      body = labelled(960, 400, 1, "person", s.me, 9) + labelled(380, 620, 1.1, "person", s.a, 9, { args: [C.pink] }) + labelled(1540, 620, 1.1, "person", s.b, 9, { args: [C.green] })
        + G(lerp(960, 380, p), lerp(300, 410, p) - 40 * Math.sin(Math.PI * p), 0.7, icon("file", s.file || "")) + G(lerp(960, 1540, p), lerp(300, 410, p) - 40 * Math.sin(Math.PI * p), 0.7, icon("file", s.file || ""))
        + (age > 0.9 ? G(960, 830, pop(age - 0.9), `<g transform="rotate(-5)"><rect x="-430" y="-80" width="860" height="160" rx="20" fill="rgba(5,6,13,.5)" stroke="${C.red}" stroke-width="12"/>${T(0, 38, s.warn, 110, { fill: C.red })}</g>`) : ""); }
    return svg(heading(s.title, 1) + body + caption((s.captions || [])[step], age, 900));
  },
  // A line chart that draws itself, then a stamp across it.
  chart(s, step, age, total) {
    const pts = s.points, n = pts.length, X = (i) => 300 + i * (1320 / (n - 1)), lo = Math.min(...pts), hi = Math.max(...pts), Y = (v) => 800 - (v - lo) / (hi - lo) * 480;
    const p = ease(total / (s.draw || 2.4)), last = (n - 1) * p, k = Math.floor(last), f = last - k;
    const seen = pts.slice(0, k + 1).map((v, i) => `${X(i)} ${Y(v)}`); if (k < n - 1) seen.push(`${lerp(X(k), X(k + 1), f)} ${lerp(Y(pts[k]), Y(pts[k + 1]), f)}`);
    const [ex, ey] = seen[seen.length - 1].split(" ").map(Number);
    return svg(`${heading(s.title, 1)}<path d="M300 300V800H1620" fill="none" stroke="${C.line}" stroke-opacity=".5" stroke-width="5"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M300 ${420 + i * 120}H1620" stroke="${C.line}" stroke-opacity=".12" stroke-width="3"/>`).join("")}
      <path d="M${seen.join("L")}" fill="none" stroke="${s.color || C.red}" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${ex}" cy="${ey}" r="16" fill="${s.color || C.red}"/>
      ${(s.labels || []).map((l) => (last >= l.at ? `<g opacity="${clamp((last - l.at) / 0.6)}">${T(X(l.at), Y(pts[l.at]) - 40, l.text, 44, { font: "Elite" })}</g>` : "")).join("")}
      ${step >= 1 && s.stamp ? G(1180, 440, pop(since(1, step, age)), `<g transform="rotate(-8)"><rect x="-330" y="-84" width="660" height="168" rx="20" fill="rgba(5,6,13,.55)" stroke="${C.red}" stroke-width="12"/>${T(0, 38, s.stamp, 104, { fill: C.red })}</g>`) : ""}
      ${caption((s.captions || [])[step], age)}`);
  },
  // A paper: its title, a date stamped on it, and whoever wrote it.
  doc(s, step, age, total) {
    const inA = ease(total / 0.5), typed = s.title.slice(0, Math.floor(clamp((total - 0.3) / 1.2) * s.title.length));
    const lines = Array.from({ length: 9 }, (_, i) => `<rect x="-250" y="${-60 + i * 44}" width="${i % 4 === 3 ? 320 : 500}" height="14" rx="7" fill="#b9b2a2"/>`).join("");
    const a1 = since(1, step, age), a2 = since(2, step, age);
    return svg(`<g transform="translate(${lerp(960, 720, ease(a2 / 0.5))} ${540 + (1 - inA) * 700}) rotate(${-4 + (1 - inA) * 10})"><rect x="-330" y="-430" width="660" height="860" rx="10" fill="${C.paper}"/><rect x="-330" y="-430" width="660" height="860" rx="10" fill="none" stroke="#cfc8b4" stroke-width="6"/>
        <text x="0" y="-320" text-anchor="middle" font-family="Serif, Georgia, serif" font-size="46" fill="${C.ink}">${esc(typed.split("|")[0])}</text><text x="0" y="-262" text-anchor="middle" font-family="Serif, Georgia, serif" font-size="46" fill="${C.ink}">${esc(typed.split("|")[1] || "")}</text>
        <text x="0" y="-190" text-anchor="middle" font-family="Elite" font-size="30" fill="#5b5648" opacity="${clamp((total - 1.4) / 0.3)}">${esc(s.author)}</text>${lines}
        ${a1 > 0 ? `<g transform="translate(150 300) rotate(-12) scale(${pop(a1)})"><rect x="-170" y="-50" width="340" height="100" rx="12" fill="none" stroke="${C.red}" stroke-width="9"/><text y="20" text-anchor="middle" font-family="Anton" font-size="58" fill="${C.red}">${esc(s.date)}</text></g>` : ""}</g>
      ${a2 > 0 ? labelled(1380, 480, 1.5, "ghost", s.who, a2, { labelFill: C.yellow }) : ""}${caption((s.captions || [])[step], age, 900)}`);
  },
  // One ledger becomes many: a slowly turning globe of machines that all hold the same page.
  //   step 0 one big ledger   1 it spreads to every node   2 a payment ripples through   3 a cheat is outvoted
  network(s, step, age, total) {
    const N = s.n || 34, R = 330, cx = 960, cy = 520, rot = total * 0.22, pts = [];
    for (let i = 0; i < N; i++) { const yy = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - yy * yy), th = i * 2.399963 + rot;
      pts.push({ i, x: Math.cos(th) * r, y: yy, z: Math.sin(th) * r }); }
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), src = pts[3], cheat = pts[s.cheat ?? 11];
    const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z);
    let links = "";
    if (a1 > 0.6) for (const p of pts) for (const q of pts) if (p.i < q.i && dist(p, q) < 0.62) links += `<path d="M${cx + p.x * R * 1.9} ${cy + p.y * R}L${cx + q.x * R * 1.9} ${cy + q.y * R}" stroke="${C.line}" stroke-width="2.5" opacity="${0.1 + 0.12 * (p.z + q.z + 2) / 4}"/>`;
    const nodes = [...pts].sort((p, q) => p.z - q.z).map((p) => { const a = a1 < 0 ? -1 : a1 - 0.4 - p.i * 0.03; if (a <= 0) return "";
      const depth = (p.z + 1) / 2, sc = 0.34 + 0.34 * depth; let col = C.cyan, shake = 0, mark = "";
      if (a2 > 0) { const w = a2 * 1.6 - dist(p, src); if (w > 0 && w < 0.5) col = C.yellow; else if (w >= 0.5) col = C.green; }
      if (a3 > 0) { col = C.green; if (p.i === cheat.i) { col = a3 < 2.2 ? C.red : C.green; shake = a3 < 2.2 ? 6 * Math.sin(a3 * 40) : 0; mark = a3 > 0.2 && a3 < 2.2 ? "✗" : ""; }
        else if (dist(p, cheat) < 0.7 && a3 > 0.7 && a3 < 2.2) mark = "!"; }
      return G(cx + p.x * R * 1.9 + shake, cy + p.y * R, sc * pop(a), icon("node", col) + (mark ? `<text y="-70" text-anchor="middle" font-family="Anton" font-size="90" fill="${mark === "✗" ? C.red : C.yellow}">${mark}</text>` : ""), `opacity="${0.45 + 0.55 * depth}"`); }).join("");
    const big = a1 < 0.9 ? G(cx, cy, (step === 0 ? pop(total) : 1 - ease(a1 / 0.6)) * 2.6, icon(step === 0 ? "bank" : "node", step === 0 ? C.white : C.cyan)) : "";
    return svg(heading(s.title, 1) + links + nodes + big + caption((s.captions || [])[step], age, 905));
  },
  // The first page of the ledger as a solid block, turning, with a message set into its face.
  block(s, step, age, total) {
    const rx = 12, S = 420;
    const turn = step >= 1 ? lerp(-28, -4, step > 1 ? 1 : ease(age / 0.8)) + 4 * Math.sin(total * 0.6) : -28 + 9 * Math.sin(total * 0.6);
    const face = (tf, bg, inner = "") => `<div style="position:absolute;left:${-S / 2}px;top:${-S / 2}px;width:${S}px;height:${S}px;transform:${tf};background:${bg};border:6px solid ${C.line};border-radius:18px;box-shadow:inset 0 0 60px rgba(53,200,255,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px;text-align:center">${inner}</div>`;
    const a1 = since(1, step, age), text = s.message || "", shown = a1 > 0 ? text.slice(0, Math.floor(clamp(a1 / 2.2) * text.length)) : "";
    const front = `<div style="font-family:Anton;font-size:44px;color:${C.yellow};letter-spacing:.06em">${esc(s.label)}</div><div style="font-family:Elite;font-size:27px;line-height:1.3;color:${C.white};margin-top:18px;min-height:150px;direction:ltr">${esc(shown)}</div><div style="font-family:Anton;font-size:34px;color:${C.pink};margin-top:10px">${esc(s.date)}</div>`;
    const scale = pop(total) * (step >= 1 ? 1.25 : 1);
    return `<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;perspective:1800px">${svg(heading(s.title, 1) + `<ellipse cx="960" cy="860" rx="${300 * scale}" ry="34" fill="${C.cyan}" opacity=".25" filter="url(#bglow)"/>` + caption((s.captions || [])[step], age, 905)).replace("<svg ", '<svg style="position:absolute;left:0;top:0" ')}
      <div style="position:absolute;left:960px;top:540px;transform-style:preserve-3d;transform:scale(${scale}) rotateX(${-rx}deg) rotateY(${turn}deg)">
        ${face(`translateZ(${S / 2}px)`, "#141a44", front)}${face(`rotateY(180deg) translateZ(${S / 2}px)`, "#0d1230")}${face(`rotateY(90deg) translateZ(${S / 2}px)`, "#101638")}${face(`rotateY(-90deg) translateZ(${S / 2}px)`, "#101638")}${face(`rotateX(90deg) translateZ(${S / 2}px)`, "#1b2360")}${face(`rotateX(-90deg) translateZ(${S / 2}px)`, "#0a0d24")}
      </div></div>`;
  },
  // A big number that counts, what it bought, and what that is worth now.
  counter(s, step, age, total) {
    const v = Math.round(s.to * ease(total / (s.time || 1.4))), a1 = since(1, step, age), a2 = since(2, step, age);
    const items = Array.from({ length: s.count || 0 }, (_, i) => G(960 + (i - (s.count - 1) / 2) * 280, s.title ? 700 : 650, 1.1 * pop(a1 - i * 0.2), icon(s.icon))).join("");
    return svg(`${heading(s.title, 1)}${G(960, step >= 1 ? (s.title ? 330 : 250) : 520, pop(total) * (step >= 1 ? 0.72 : 1), T(0, 60, v.toLocaleString("en"), 240, { fill: C.yellow }) + T(0, 150, s.unit, 70, { fill: C.gold }))}
      ${a1 > 0 ? T(960, s.title ? 545 : 480, "=", 100, { fill: C.white, opacity: clamp(a1 / 0.2) }) + items.replaceAll("translate(", "translate(").replace(/, 640\)/g, ", 640)") : ""}
      ${a2 > 0 ? G(960, 880, pop(a2), `<rect x="-640" y="-70" width="1280" height="140" rx="24" fill="${C.panel}" stroke="${C.yellow}" stroke-width="5"/>${T(0, 26, s.now, 68, { fill: C.yellow })}`) : caption((s.captions || [])[step], age, 900)}`);
  },
  // Someone nobody can name: an outline, what they said, then gone, and what they left behind.
  person(s, step, age, total) {
    const a1 = since(1, step, age), a2 = since(2, step, age), a3 = since(3, step, age), fade = a2 > 0 ? 1 - 0.85 * ease(a2 / 1.2) : 1;
    return svg(`${heading(s.title, 1)}${G(640, 540, 2.1 * pop(total), icon("ghost", C.white), `opacity="${fade}"`)}<g opacity="${fade}">${T(640, 900, s.name, 64, { fill: C.yellow })}</g>
      ${a1 > 0 ? G(1280, 430, pop(a1), `<path d="M-330 -130H330Q360 -130 360 -100V100Q360 130 330 130H-200L-290 200L-270 130H-330Q-360 130 -360 100V-100Q-360 -130 -330 -130Z" fill="${C.paper}"/>${(s.quote || "").split("|").map((l, i, arr) => T(0, 12 + (i - (arr.length - 1) / 2) * 64, l, 50, { font: "Elite", fill: C.ink })).join("")}`, `opacity="${fade}"`) : ""}
      ${a3 > 0 ? G(1280, 600, pop(a3), `${[-150, -50, 50, 150].map((x, i) => G(x, 40 - (i % 2) * 30, 0.6, icon("coin"))).join("")}${T(0, 250, s.stat, 110, { fill: C.yellow })}${T(0, 320, s.statSub, 44, { font: "Elite", fill: C.dim })}`) : ""}`);
  },
  // The closing frame: what comes next, with room for the platform's own end-screen elements.
  endcard(s, step, age, total) {
    return svg(`${G(960, 190, pop(total), T(0, 0, s.title, 96, { fill: C.yellow }))}<g opacity="${clamp((total - 0.3) / 0.3)}">${T(960, 290, s.next, 60, { font: "Elite" })}</g>
      <rect x="250" y="390" width="760" height="428" rx="24" fill="none" stroke="${C.line}" stroke-width="5" stroke-dasharray="20 16" opacity=".5"/><circle cx="1420" cy="604" r="170" fill="none" stroke="${C.pink}" stroke-width="5" stroke-dasharray="20 16" opacity=".6"/>
      <g opacity="${clamp((total - 0.6) / 0.3)}">${T(960, 930, s.note, 46, { font: "Elite", fill: C.dim })}</g>`);
  },
};

export function board(spec, step, age, total, cfg = {}) {
  const fn = BOARDS[spec.kind]; if (!fn) return `<div style="color:#fff;font:40px Anton;padding:80px">unknown board: ${esc(spec.kind)}</div>`;
  return fn(spec, step, age, total, cfg);
}
export const BOARD_KINDS = Object.keys(BOARDS);
