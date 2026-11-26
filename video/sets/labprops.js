// Props for the standalone Shorts of the shorts lab (episodes/techforbadguys/shorts-lab), drawn in the palette of the
// sets (bank.js) for the tall frame (1080 x 1920). Each is drawn around (0, 0).
//   space      the night sky of "One number": deep gradient, twinkling stars, a far nebula glow
//   moon, earth, rocket (Saturn V, `burn` 0..1), lander, footprint, phone (`glow`), agc (the Apollo Guidance Computer and its keypad)
//   bigNum     a huge number that counts up to its value (Anton, gold with a dark edge), the only text on that look
//   dictCard   the dictionary card of "Human dictionary": the word big, a rule, a short definition, a pronunciation strip
//   king, rune (Hagall ᚼ and Bjarkan ᛒ, drawn as strokes), btLogo (the two runes joined), tooth (a blue tooth)
import { clamp, lerp, ease, easeOut, seg, spring, rnd, rr, circ, two, disc, rings, text, at } from "./kit.js";
import { P } from "./bank.js";
export { P };

export const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const f1 = (n) => (+n).toFixed(1);

// ---- One number: space ----
export const space = (t, seed = 3, o = {}) => {
  const top = o.top || "#05061a", bot = o.bot || "#1a1050";
  let st = ""; for (let i = 0; i < 140; i++) { const x = rnd(seed * 7919 + 0 * 1009 + i) * 1080, y = rnd(seed * 7919 + 1 * 1009 + i) * 1920, r = 0.8 + rnd(seed * 7919 + 2 * 1009 + i) * 2.6, tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + rnd(seed * 7919 + 3 * 1009 + i) * 1.8) + i));
    st += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#fff" opacity="${(tw * (0.4 + 0.6 * rnd(seed * 7919 + 4 * 1009 + i))).toFixed(2)}"/>`; }
  return `<defs><linearGradient id="spc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
    <radialGradient id="neb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#8a5be0" stop-opacity=".45"/><stop offset="1" stop-color="#8a5be0" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#spc)"/><ellipse cx="${o.nx ?? 780}" cy="${o.ny ?? 420}" rx="620" ry="420" fill="url(#neb)"/>${st}`;
};
export const moon = (r = 200) => `<circle r="${r * 1.35}" fill="#fff6d8" opacity=".08"/><circle r="${r}" fill="#ece6d4"/><path d="M${-r} 0A${r} ${r} 0 0 0 ${r} 0A${r * 1.1} ${r * 0.9} 0 0 1 ${-r} 0Z" fill="#cfc6ae" opacity=".55"/>
  ${[[-0.35, -0.3, 0.2], [0.3, -0.1, 0.13], [0.05, 0.4, 0.17], [-0.45, 0.25, 0.09], [0.5, 0.42, 0.08]].map(([x, y, k]) => `<circle cx="${f1(x * r)}" cy="${f1(y * r)}" r="${f1(k * r)}" fill="#bdb39a"/><circle cx="${f1(x * r - k * r * 0.18)}" cy="${f1(y * r - k * r * 0.18)}" r="${f1(k * r * 0.78)}" fill="#d6cdb4"/>`).join("")}`;
export const earth = (r = 120, spin = 0) => `<circle r="${r * 1.18}" fill="${P.blue}" opacity=".18"/><circle r="${r}" fill="#2a7ae0"/><clipPath id="erc${Math.round(r)}"><circle r="${r}"/></clipPath>
  <g clip-path="url(#erc${Math.round(r)})"><g transform="translate(${f1(((spin * 60) % (r * 4)) - r * 2)} 0)">${[0, 1].map((k) => [[-0.6, -0.3, 0.45, 0.3], [0.2, 0.25, 0.5, 0.35], [-0.1, -0.65, 0.3, 0.18], [0.75, -0.35, 0.28, 0.22]].map(([x, y, w, h]) => `<ellipse cx="${f1((x + k * 2) * r)}" cy="${f1(y * r)}" rx="${f1(w * r)}" ry="${f1(h * r)}" fill="${P.green}"/>`).join("")).join("")}</g>
  <path d="M${-r} 0A${r} ${r} 0 0 0 ${r} 0" fill="none" stroke="#fff" stroke-width="${f1(r * 0.06)}" opacity=".25"/></g><circle r="${r}" fill="none" stroke="#bfe6ff" stroke-width="${f1(r * 0.05)}" opacity=".6"/>`;
// Saturn V, 120 wide at the base, nose at y = -900; burn 0..1 lights the engines
export const rocket = (burn = 0, t = 0) => { const fl = burn > 0 ? `<path d="M-50 40Q${f1(-20 + 8 * Math.sin(t * 40))} ${f1(260 + 90 * burn)} 0 ${f1(330 + 120 * burn)}Q${f1(20 + 8 * Math.cos(t * 37))} ${f1(260 + 90 * burn)} 50 40Z" fill="${P.gold}" opacity=".95"/><path d="M-26 40Q0 ${f1(200 + 60 * burn)} 26 40Z" fill="#fff3b0"/>` : "";
  return `${fl}${two("M-60 40V-540H60V40Z", "#f4f1ea", "#cfcabd", 0, 0)}<path d="M-60 -120H60M-60 -330H60" stroke="${P.ink}" stroke-width="10"/><path d="M-60 -60H60V-20H-60Z" fill="${P.ink}"/>
    <path d="M-44 -540L-30 -700H30L44 -540Z" fill="#f4f1ea"/><path d="M-30 -700L-16 -800H16L30 -700Z" fill="#dcd6c6"/><path d="M-4 -800V-900" stroke="#cfcabd" stroke-width="8"/>
    <path d="M-60 -20L-110 60V40Z" fill="${P.ink}"/><path d="M60 -20L110 60V40Z" fill="${P.ink}"/><path d="M-60 -470H60" stroke="${P.ink}" stroke-width="6" opacity=".35"/>
    <text x="0" y="-210" text-anchor="middle" font-family="Anton" font-size="64" fill="${P.ink}" opacity=".0">.</text>`; };
// the lunar module on its legs, 300 wide, feet on y = 0
export const lander = () => `<path d="M-110 -60L-160 0M110 -60L160 0M-60 -40L-90 0M60 -40L90 0" stroke="#c9c2a8" stroke-width="10" stroke-linecap="round"/><path d="M-180 0H-140M140 0H180" stroke="#c9c2a8" stroke-width="10"/>
  ${two("M-120 -150H120V-40H-120Z", P.gold, P.goldD, 0, 0)}<path d="M-120 -95H120" stroke="${P.goldD}" stroke-width="6" opacity=".6"/>
  ${two("M-80 -290L-100 -150H100L80 -290Z", "#d8dbe6", "#b9bfd2", 0, 0)}<path d="M-50 -260L-34 -210H34L50 -260Z" fill="${P.ink}"/><path d="M60 -290V-340" stroke="#d8dbe6" stroke-width="6"/><circle cx="60" cy="-346" r="12" fill="#d8dbe6"/>`;
export const footprint = () => `<g fill="#bdb39a">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${-60 + i * 18}" y="${-40 + (i % 2) * 4}" width="10" height="80" rx="4"/>`).join("")}</g><path d="M-70 -50Q0 -70 70 -50V50Q0 70 -70 50Z" fill="none" stroke="#a89f86" stroke-width="6"/>`;
// a phone, 300 x 600, screen glowing (glow 0..1); o.screen draws inside the screen (centre (0, 0), 260 x 520)
export const phone = (glow = 1, o = {}) => `${two(rr(-150, -300, 300, 600, 46), "#2b2f45", "#16182a", 0, 0)}<path d="${rr(-130, -270, 260, 540, 30)}" fill="${glow > 0 ? "#1d2a6b" : "#0b0d1a"}"/>
  <clipPath id="phs"><path d="${rr(-130, -270, 260, 540, 30)}"/></clipPath><g clip-path="url(#phs)" opacity="${clamp(glow).toFixed(2)}"><circle cy="-120" r="260" fill="${P.violet}" opacity=".35"/>${o.screen || ""}</g>
  <path d="${rr(-40, -286, 80, 10, 5)}" fill="#0b0d1a"/>`;
// the Apollo Guidance Computer: a grey box and its DSKY keypad, 420 wide; lit 0..1 lights the display
export const agc = (lit = 1, t = 0) => { const keys = Array.from({ length: 21 }, (_, i) => `<path d="${rr(-170 + (i % 7) * 50, 70 + Math.floor(i / 7) * 46, 40, 36, 6)}" fill="#e8e4d8"/>`).join("");
  return `${two(rr(-210, -230, 420, 460, 18), "#8c8f99", "#6d707b", 0, 0)}<path d="${rr(-180, -200, 360, 240, 10)}" fill="#1a1c22"/>
    ${[0, 1, 2].map((r) => `<text x="160" y="${-130 + r * 70}" text-anchor="end" font-family="Anton" font-size="56" fill="#5dff9a" opacity="${(lit * (0.7 + 0.3 * Math.sin(t * 6 + r))).toFixed(2)}">${["+00012", "-38144", "+00000"][r]}</text>`).join("")}${keys}`; };
// a huge number counting up to `value` (p 0..1 of the count), centred on (0, 0); o.prefix / o.suffix, o.fill, o.size
export const bigNum = (value, p = 1, o = {}) => { const v = Math.round(value * easeOut(clamp(p))), s = (o.prefix || "") + v.toLocaleString("en-US") + (o.suffix || ""), size = o.size || 300;
  return `<text x="0" y="${f1(size * 0.36)}" text-anchor="middle" font-family="Anton" font-size="${size}" fill="none" stroke="#05061a" stroke-width="${f1(size * 0.08)}" stroke-linejoin="round">${s}</text>
    <text x="0" y="${f1(size * 0.36)}" text-anchor="middle" font-family="Anton" font-size="${size}" fill="${o.fill || P.gold}">${s}</text>`; };

// ---- Human dictionary ----
// the dictionary card, 900 x 760, top at y = 0: word (big, in the card's script), a rule, the definition lines (drawn by
// the caller in o.inner, from y = 330), a pronunciation strip; `p` 0..1 opens it
export const dictCard = (word, p = 1, o = {}) => `<g opacity="${clamp(p * 2).toFixed(2)}">${two(rr(-450, 0, 900, o.h || 760, 34), "#fff8e8", "#ead9b6", 0, 14)}
  <path d="M-450 34Q-450 0 -416 0H416Q450 0 450 34V96H-450Z" fill="${o.band || P.blue}"/><circle cx="-390" cy="48" r="16" fill="#fff" opacity=".6"/><circle cx="-340" cy="48" r="16" fill="#fff" opacity=".35"/>
  <text x="0" y="230" text-anchor="middle" font-family="Anton" font-size="${o.size || 150}" fill="${P.ink}" letter-spacing="2">${word}</text>
  <path d="M-380 280H${f1(-380 + 760 * clamp(p))}" stroke="${o.band || P.blue}" stroke-width="8" stroke-linecap="round"/>${o.inner || ""}</g>`;
// a Viking king, 360 tall, feet on y = 0: a plain round helmet (no horns: they never wore them), red beard, cape, one dark blue tooth when he smiles
export const king = (o = {}) => { const smile = o.smile ?? 1;
  return `${two("M-150 0L-120 -170Q0 -210 120 -170L150 0Z", "#b52a3a", "#8d1f2c", 0, 0)}<path d="M-90 -170H90V-40H-90Z" fill="#6b4a2f"/><path d="M-90 -110H90" stroke="${P.gold}" stroke-width="12"/>
    <circle cy="-250" r="80" fill="#f3c9a3"/><path d="M-80 -250Q-90 -150 0 -130Q90 -150 80 -250Q60 -200 0 -205Q-60 -200 -80 -250Z" fill="#e0772e"/><path d="M-40 -232Q0 -205 40 -232" fill="${smile ? "#fff" : "none"}" stroke="#7a2f12" stroke-width="5"/>
    ${smile ? `<path d="${rr(-6, -232, 12, 14, 3)}" fill="#2b4fd6"/>` : ""}<circle cx="-28" cy="-262" r="8" fill="${P.ink}"/><circle cx="28" cy="-262" r="8" fill="${P.ink}"/>
    <path d="M-86 -280Q-86 -350 0 -352Q86 -350 86 -280Z" fill="#aab4d4"/><path d="M-90 -280H90" stroke="#8792bb" stroke-width="14"/><path d="M0 -352V-276" stroke="#8792bb" stroke-width="10"/>
    ${o.crown ? `<path d="M-60 -352L-40 -400L-20 -360L0 -410L20 -360L40 -400L60 -352Z" fill="${P.gold}"/>` : ""}`; };
// the two runes, strokes inside a 200-tall box centred on (0, 0); p 0..1 draws them
export const RUNE = { hagall: "M0 -100V100M-70 -60L70 60M70 -60L-70 60", bjarkan: "M-40 -100V100M-40 -100L50 -50L-40 0L50 50L-40 100" };
export const rune = (name, p = 1, colour = "#fff", w = 18) => `<path d="${RUNE[name]}" fill="none" stroke="${colour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="${clamp(p).toFixed(3)} 1"/>`;
// the Bluetooth mark: the two runes laid over each other; `join` 0..1 slides them together, the oval behind it
export const btLogo = (join = 1, o = {}) => { const d = (1 - ease(clamp(join))) * 120;
  return `${o.oval === false ? "" : `<path d="M0 -190C120 -190 150 -110 150 0C150 110 120 190 0 190C-120 190 -150 110 -150 0C-150 -110 -120 -190 0 -190Z" fill="#0a60d6" opacity="${clamp(join * 1.4).toFixed(2)}"/>`}
    ${at(-d, 0, rune("hagall", 1, "#fff", 18), 1.2)}${at(d, 0, rune("bjarkan", 1, "#fff", 18), 1.2)}`; };
// a blue tooth, 180 tall, root down to y = 90
export const tooth = (blue = 1) => `<path d="M-80 -60Q-90 -100 -50 -100Q-20 -100 0 -84Q20 -100 50 -100Q90 -100 80 -60Q70 -10 60 40Q50 90 30 90Q16 90 12 50Q6 20 0 20Q-6 20 -12 50Q-16 90 -30 90Q-50 90 -60 40Q-70 -10 -80 -60Z" fill="${blue > 0.5 ? "#2b6fe0" : "#f8f6ee"}" stroke="${blue > 0.5 ? "#1a48a8" : "#d9d3c2"}" stroke-width="8"/><path d="M-50 -70Q-40 -80 -24 -76" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/>`;
