// Shorts lab "useful-01-bleach", drawn for the tall frame only (1080 x 1920), full frame: no Peek over the scenes.
// Script: Writer, branch shorts-writer, episodes/techforbadguys/shorts-lab/useful-01-bleach/script.md.
// Peek appears only in the three studio shots (0, 6, 10), drawn here as a portrait studio; he stands in it as the
// storyboard's `actor` (editor.cjs), so the bottles are drawn at his hands. No Arabic on screen; symbols only.
// One mother in every scene: headscarf, teal house dress, apron, yellow rubber gloves. One small tiled bathroom.
//   0 STUDIO: a bottle in each hand, arms wide            6 STUDIO: one bottle slides far along the desk from the other
//   1 she pours bleach, reaches for the second; 1 + 1     7 the balcony: breathing, then the phone at her ear
//   2 close on the bowl: the liquids meet, the cloud      8 the rule, four beats: one bottle; rinse; window open; no mixing
//   3 bleach + toilet cleaner + vinegar -> the cloud      9 the clean bathroom, window open; one tiny stain winks
//   4 bleach + glass spray -> a paler cloud              10 STUDIO: he salutes with one bottle only
//   5 she coughs, eyes watering; the cloud fills the room
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, rr, two, rings, at, makeSet } from "./kit.js";
import { P, pop } from "./labprops.js";

const f1 = (n) => (+n).toFixed(1);
// ---- props ----
// bottles, base on y = 0, about 300 tall; each carries a symbol, never a brand
const hazard = (c = "#ff9f1c") => `<path d="M0 -46L46 0L0 46L-46 0Z" fill="${c}" stroke="#1a0f3a" stroke-width="6"/><path d="M0 -24V8" stroke="#1a0f3a" stroke-width="9" stroke-linecap="round"/><circle cy="22" r="6" fill="#1a0f3a"/>`;
export const bleach = () => `${two("M-90 0V-210Q-90 -250 -50 -255H40Q90 -250 90 -210V0Z", "#f7f9ff", "#d5dbeb", 0, 0)}<path d="M-30 -255V-300H30V-255Z" fill="#2a80d2"/><path d="M-38 -300H38V-322H-38Z" fill="#3fa9ff"/>
  <path d="M50 -235Q120 -230 110 -150Q105 -110 80 -110" stroke="#d5dbeb" stroke-width="18" fill="none"/>${at(0, -110, hazard())}`;
const toiletIcon = (c) => `<path d="M-26 -30H26V-8H-26Z M-30 -8H30Q30 20 0 26Q-30 20 -30 -8Z M-14 26H14V38H-14Z" fill="${c}"/>`;
export const toiletCleaner = () => `${two("M-70 0V-200Q-70 -230 -40 -232H40Q70 -230 70 -200V0Z", "#3ddc97", "#1fa86c", 0, 0)}<path d="M-20 -232L-10 -290L60 -320L70 -300L10 -270V-232Z" fill="#1fa86c"/>
  <circle cy="-110" r="46" fill="#fff"/>${at(0, -108, toiletIcon("#1fa86c"))}`;
export const vinegar = () => `${two("M-56 0V-170Q-56 -200 -30 -215V-280H30V-215Q56 -200 56 -170V0Z", "#ffe9b0", "#e9cf88", 0, 0)}<path d="M-34 -280H34V-300H-34Z" fill="#a86a3a"/><path d="M-56 -150H56V-60H-56Z" fill="#fff8e8" opacity=".9"/>${at(0, -105, `<path d="M0 -30Q24 0 0 30Q-24 0 0 -30Z" fill="#c9a227"/>`)}`;
export const glassSpray = () => `${two("M-60 0V-190Q-60 -210 -40 -214H40Q60 -210 60 -190V0Z", "#7fd4ff", "#3fa9ff", 0, 0)}<path d="M-24 -214V-250H24V-214Z" fill="#2b2f45"/><path d="M-40 -250H60L70 -270H-30Z" fill="#2b2f45"/><path d="M-30 -250Q-50 -215 -26 -200" stroke="#2b2f45" stroke-width="10" fill="none"/>
  <path d="${rr(-40, -150, 80, 70, 8)}" fill="#fff"/><path d="M0 -150V-80M-40 -115H40" stroke="#3fa9ff" stroke-width="6"/>`;
// the cloud: blobby, yellow-green (or pale), grows with g 0..1
export const cloud = (g, t, o = {}) => { const c = o.c || "#c8e04a", n = o.n || 9, R = o.r || 220; let s = "";
  for (let i = 0; i < n; i++) { const ang = (i / n) * Math.PI * 2 + t * 0.2, rr2 = R * (0.35 + 0.65 * rnd(i * 13 + 7)) * g, x = Math.cos(ang) * R * 0.75 * g + Math.sin(t * 0.8 + i) * 10, y = Math.sin(ang) * R * 0.45 * g + Math.cos(t * 0.7 + i) * 8;
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(0, rr2))}" fill="${c}"/>`; }
  return `<g opacity="${f1(clamp(g * 1.6) * (o.a ?? 0.82))}">${s}<circle r="${f1(R * 0.6 * g)}" fill="${c}"/></g>`; };
const plus = (k = 1) => `<g transform="scale(${k})"><path d="M-50 0H50M0 -50V50" stroke="#fff" stroke-width="26" stroke-linecap="round"/></g>`;
const check = (k = 1) => `<g transform="scale(${k})"><circle r="70" fill="${P.green}"/><path d="M-32 0L-8 26L36 -24" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const cross = (k = 1) => `<g transform="scale(${k})"><circle r="70" fill="${P.red}"/><path d="M-30 -30L30 30M30 -30L-30 30" stroke="#fff" stroke-width="18" stroke-linecap="round"/></g>`;
const noMix = (k = 1) => `<g transform="scale(${k})"><circle r="150" fill="none" stroke="${P.red}" stroke-width="30"/><path d="M-106 -106L106 106" stroke="${P.red}" stroke-width="30" stroke-linecap="round"/></g>`;
// a toilet, 360 wide, base on y = 0; o.stain draws the little stain with eyes (wink 0..1)
export const toilet = (o = {}) => `${two("M-120 -560H120V-380H-120Z", "#ffffff", "#dfe4ee", 0, 0)}<path d="M-130 -585H130V-555H-130Z" fill="#eef1f7"/>
  ${two("M-180 -380H180Q180 -230 60 -200L70 0H-70L-60 -200Q-180 -230 -180 -380Z", "#ffffff", "#dfe4ee", 0, 0)}<ellipse cy="-378" rx="160" ry="36" fill="#e4e9f2"/><ellipse cy="-376" rx="120" ry="24" fill="${o.water || "#bfe6ff"}"/>
  ${o.stain ? `<g transform="translate(70 -290)"><ellipse rx="26" ry="16" fill="#8a6a3a"/><circle cx="-8" cy="-2" r="4" fill="#fff"/><path d="M4 -2h10" stroke="#fff" stroke-width="${f1(3 + 2 * (o.wink || 0))}"/></g>` : ""}`;
// the bathroom: tiles, floor, door on the left, window up right (open 0..1); returns the room behind everything
export const bathroom = (t, o = {}) => { const open = clamp(o.open || 0);
  let tiles = ""; for (let y = 0; y < 1300; y += 90) for (let x = 0; x < 1080; x += 90) tiles += `<rect x="${x + 3}" y="${y + 3}" width="84" height="84" rx="6" fill="${((x + y) / 90) % 2 ? "#cfe8f2" : "#dbf0f7"}"/>`;
  const win = `<g transform="translate(760 210)"><rect x="-150" y="-120" width="300" height="240" rx="10" fill="#6a7fb0"/>${open > 0 ? `<rect x="-140" y="-110" width="280" height="220" fill="#8fd3ff"/><circle cx="70" cy="-40" r="34" fill="#ffe66d"/>` : `<rect x="-140" y="-110" width="280" height="220" fill="#b9d4e6"/>`}
    <g transform="translate(-140 0) scale(${f1(1 - 0.85 * open)} 1)"><rect x="0" y="-110" width="140" height="220" fill="#d6e8f5" opacity=".95" stroke="#6a7fb0" stroke-width="8"/></g><g transform="translate(140 0) scale(${f1(1 - 0.85 * open)} 1)"><rect x="-140" y="-110" width="140" height="220" fill="#d6e8f5" opacity=".95" stroke="#6a7fb0" stroke-width="8"/></g></g>`;
  const door = `<rect x="40" y="420" width="260" height="${o.doorOpen ? 0 : 880}" fill="#c08a5a"/>${o.doorOpen ? "" : `<circle cx="270" cy="860" r="14" fill="${P.gold}"/>`}`;
  return `<rect width="1080" height="1920" fill="#cfe8f2"/>${tiles}${win}${door}<rect y="1300" width="1080" height="620" fill="#9fb4c8"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 150} 1300L${i * 150 - 120} 1920" stroke="#8aa0b6" stroke-width="5"/>`).join("")}<rect y="1290" width="1080" height="16" fill="#86a0b8"/>`;
};
// the mother, 1000 tall, feet on y = 0. pose: { armL, armR } as [x, y] hand targets (relative), cough 0..1, tears, eyesShut, phone
export const mother = (t, o = {}) => { const cough = o.cough || 0, bend = 10 * cough * Math.abs(Math.sin(t * 9)), hL = o.armL || [-210, -520], hR = o.armR || [210, -520];
  const sh = [-120, -700], shR = [120, -700];
  const arm = (s, h) => `<path d="M${s[0]} ${s[1]}Q${f1((s[0] + h[0]) / 2 + (h[0] < 0 ? -40 : 40))} ${f1((s[1] + h[1]) / 2 + 30)} ${h[0]} ${h[1]}" stroke="#2fa59a" stroke-width="70" fill="none" stroke-linecap="round"/><circle cx="${h[0]}" cy="${h[1]}" r="46" fill="#ffd23f"/><path d="M${h[0] - 30} ${h[1] - 30}l-12 -22M${h[0]} ${h[1] - 44}v-22M${h[0] + 30} ${h[1] - 30}l12 -22" stroke="#ffd23f" stroke-width="18" stroke-linecap="round"/>`;
  const eyes = o.eyesShut || cough > 0.5 ? `<path d="M-60 -862q22 -14 44 0M16 -862q22 -14 44 0" stroke="#1a0f3a" stroke-width="9" fill="none" stroke-linecap="round"/>` : `<circle cx="-38" cy="-862" r="13" fill="#1a0f3a"/><circle cx="38" cy="-862" r="13" fill="#1a0f3a"/><circle cx="-34" cy="-866" r="4" fill="#fff"/><circle cx="42" cy="-866" r="4" fill="#fff"/>`;
  const mouth = cough > 0.3 ? `<ellipse cx="0" cy="-806" rx="22" ry="${f1(12 + 10 * Math.abs(Math.sin(t * 9)))}" fill="#7a2f3a"/>` : o.smile ? `<path d="M-30 -812Q0 -788 30 -812" stroke="#7a2f3a" stroke-width="9" fill="none" stroke-linecap="round"/>` : `<path d="M-22 -806H22" stroke="#7a2f3a" stroke-width="9" stroke-linecap="round"/>`;
  const tears = o.tears ? [[-50, -840], [50, -840]].map(([x, y]) => `<path d="M${x} ${f1(y + 20 + ((t * 60) % 40))}q-10 18 0 24q10 -6 0 -24Z" fill="#7fd4ff"/>`).join("") : "";
  return `<g transform="rotate(${f1(bend * 0.3)} 0 0)">
    <path d="M-150 0L-130 -680Q0 -720 130 -680L150 0Z" fill="#2fa59a"/><path d="M-110 -620H110L120 -80H-120Z" fill="#fff4dc" opacity=".92"/><path d="M-110 -620Q0 -560 110 -620" stroke="#ead7ad" stroke-width="10" fill="none"/>
    ${arm(sh, hL)}${arm(shR, hR)}
    <path d="M-150 -820Q-160 -1000 0 -1010Q160 -1000 150 -820Q150 -690 0 -680Q-150 -690 -150 -820Z" fill="#8a5be0"/><ellipse cx="0" cy="-845" rx="102" ry="116" fill="#d9a77a"/>
    <path d="M-104 -880Q-100 -990 0 -992Q100 -990 104 -880Q70 -950 0 -952Q-70 -950 -104 -880Z" fill="#8a5be0"/>${eyes}<path d="M-6 -840Q0 -826 8 -830" stroke="#b97f56" stroke-width="6" fill="none"/>${mouth}${tears}
    ${o.phone ? `<g transform="translate(118 -860) rotate(-12)"><rect x="-26" y="-60" width="52" height="110" rx="10" fill="#2b2f45"/></g>` : ""}</g>`;
};
// the portrait studio for Peek's own shots: a night wall with light panels, a big screen with the Earth, the desk top
const studio = (t) => `<rect width="1080" height="1920" fill="#1e1650"/><rect width="1080" height="1920" fill="url(#bnight)" opacity=".6"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${60 + i * 260}" y="140" width="200" height="900" rx="20" fill="#2c2370"/><rect x="${80 + i * 260}" y="160" width="160" height="860" rx="14" fill="#3a2f8a" opacity=".6"/>`).join("")}
  <circle cx="540" cy="520" r="260" fill="#ff5fa2" opacity=".12"/><rect y="1380" width="1080" height="540" fill="#2a1d66"/><rect y="1360" width="1080" height="34" fill="#5a46b0"/>`;
// Peek's hands in the studio shots: the actor stands at x 540, feet at y 1720, 1250 tall (storyboard); his rig is 1200 wide,
// so a hand at rig (hx, hy) lands at (540 + (hx - 600) * k, 1720 - 1250 * 0.845 + hy * k), k = 1250 / 1200
const K = 1250 / 1200, hand = (hx, hy) => [540 + (hx - 600) * K, 1720 - 1250 * 0.845 + hy * K];

// ---- 0: STUDIO, a bottle in each hand, arms wide ----
function s0(a, tot) {
  const [lx, ly] = hand(330, 470), [rx, ry] = hand(870, 470);
  const gas = seg(a, 4.6, 6.4);
  const g = studio(tot) + at(lx - 30, ly + 90, bleach(), 0.8) + at(rx + 30, ry + 90, toiletCleaner(), 0.85) + (gas > 0 ? at(540, lerp(620, 420, gas), cloud(gas * 0.7, tot, { r: 200 })) : "");
  return { g };
}
// ---- 1: she pours bleach into the toilet, then reaches for the second bottle; 1 + 1 over her head ----
function s1(a, tot) {
  const pour = seg(a, 0.2, 1.0) * (1 - seg(a, 2.2, 2.6)), reach = seg(a, 2.4, 3.2);
  const stream = pour > 0.3 ? `<path d="M590 960Q640 1060 640 1150" stroke="#f0f6ff" stroke-width="16" fill="none" opacity=".9"/>` : "";
  const bub = at(300, 230, `<ellipse rx="200" ry="120" fill="#fff"/><circle cx="-60" cy="140" r="26" fill="#fff"/><circle cx="-90" cy="190" r="14" fill="#fff"/><text x="0" y="40" text-anchor="middle" font-family="Anton" font-size="120" fill="#1a0f3a">1 + 1</text>`, pop(a - 1.2));
  const g = bathroom(tot) + at(700, 1560, toilet(), 1.0) + at(930, 1300, toiletCleaner(), 0.75)
    + at(310, 1700, mother(tot, { armL: [-160, -480], armR: lerp(1, 0, reach) ? [lerp(250, 540, reach), lerp(-760, -560, reach)] : [250, -760] }), 1.0)
    + (reach < 0.5 ? at(560, 960, bleach(), 0.7, -100 * pour) : "") + stream + bub;
  return { g };
}
// ---- 2: close on the bowl: the liquids meet and a yellow-green cloud starts to rise ----
function s2(a, tot) {
  const meet = seg(a, 0.2, 1.0), rise = seg(a, 0.8, 2.4);
  const water = `<ellipse cx="540" cy="1150" rx="380" ry="120" fill="#e9eef6"/><ellipse cx="540" cy="1150" rx="320" ry="88" fill="#bfe6ff"/>`;
  const streams = `<path d="M330 600Q380 900 ${f1(lerp(380, 500, meet))} 1120" stroke="#f0f6ff" stroke-width="22" fill="none"/><path d="M760 600Q700 900 ${f1(lerp(700, 580, meet))} 1120" stroke="#3ddc97" stroke-width="22" fill="none"/>`;
  const fizz = meet > 0.7 ? Array.from({ length: 10 }, (_, i) => `<circle cx="${f1(470 + rnd(i) * 140)}" cy="${f1(1140 - ((tot * 120 + i * 30) % 120))}" r="${f1(6 + rnd(i + 9) * 8)}" fill="#fff" opacity=".8"/>`).join("") : "";
  const g = `<rect width="1080" height="1920" fill="#cfe8f2"/><path d="M60 900Q60 1500 540 1560Q1020 1500 1020 900Z" fill="#fff"/><path d="M60 900Q540 820 1020 900Q540 1000 60 900Z" fill="#e4e9f2"/>` + water + streams + fizz + at(540, lerp(1100, 760, rise), cloud(rise, tot, { r: 260 }));
  return { g };
}
// ---- 3: bleach + toilet cleaner + vinegar; a plus; the yellow-green cloud ----
function s3(a, tot) {
  const c = seg(a, 1.6, 3.2);
  const g = `<rect width="1080" height="1920" fill="#2a1d66"/><rect y="1240" width="1080" height="680" fill="#1f1450"/>` + at(540, 760, cloud(c, tot, { r: 380, n: 11 }))
    + at(220, 1240, bleach(), 1.0 * pop(a)) + at(540, 1000, plus(1.2), pop(a - 0.4)) + at(700, 1240, toiletCleaner(), 1.0 * pop(a - 0.6)) + at(940, 1240, vinegar(), 0.95 * pop(a - 0.9));
  return { g };
}
// ---- 4: bleach + a glass-cleaner spray; a second, paler cloud ----
function s4(a, tot) {
  const c = seg(a, 1.2, 2.8);
  const g = `<rect width="1080" height="1920" fill="#2a1d66"/><rect y="1240" width="1080" height="680" fill="#1f1450"/>` + at(540, 760, cloud(c, tot, { r: 360, c: "#e8e4f8", a: 0.75 }))
    + at(280, 1240, bleach(), 1.05 * pop(a)) + at(540, 1000, plus(1.2), pop(a - 0.3)) + at(800, 1240, glassSpray(), 1.15 * pop(a - 0.5));
  return { g };
}
// ---- 5: she coughs, eyes watering, a hand on her chest; the cloud fills the closed bathroom ----
function s5(a, tot) {
  const fill = seg(a, 0, 4), z = 1 + 0.08 * seg(a, 0, 5);
  const room = bathroom(tot) + at(780, 1560, toilet(), 1.0) + at(400, 1750, mother(tot, { cough: 1, tears: 1, armL: [-60, -620], armR: [80, -760] }), 1.05);
  const g = `<g transform="translate(540 1000) scale(${f1(z)}) translate(-540 -1000)">${room}</g>` + at(700, 1100, cloud(0.6 + 0.6 * fill, tot, { r: 520, n: 13, a: 0.55 + 0.2 * fill }));
  return { g };
}
// ---- 6: STUDIO, he looks at the two bottles on the desk, then one slides slowly far away from the other ----
function s6(a, tot) {
  const slide = ease(seg(a, 0.8, 2.8));
  const g = studio(tot) + at(lerp(200, 110, slide), 1380, bleach(), 0.8) + at(lerp(880, 980, slide), 1380, toiletCleaner(), 0.85);
  return { g };
}
// ---- 7: the balcony: breathing fresh air, the bathroom door wide open behind; then the phone at her ear, the bottles in the doorway ----
function s7(a, tot, s) { const D = (s.ends || [])[7] || 8, ph = a > D * 0.5;
  const sky = `<rect width="1080" height="1920" fill="#8fd3ff"/><circle cx="880" cy="260" r="90" fill="#ffe66d"/>${[[200, 300], [620, 200]].map(([x, y]) => `<ellipse cx="${x + 20 * Math.sin(tot * 0.4)}" cy="${y}" rx="120" ry="40" fill="#fff" opacity=".9"/>`).join("")}`;
  const house = `<rect x="0" y="500" width="520" height="1420" fill="#e9d6b8"/><rect x="90" y="760" width="340" height="700" fill="#cfe8f2"/>${at(330, 1440, `${toilet()}`, 0.45)}${at(170, 1455, bleach(), 0.5)}${at(260, 1455, toiletCleaner(), 0.5)}
    ${at(250, 1000, cloud(0.5 * (1 - seg(a, 0, D)), tot, { r: 160 }))}<rect x="60" y="740" width="30" height="740" fill="#c08a5a"/>`;
  const rail = `<rect x="520" y="1480" width="560" height="440" fill="#d9c6a6"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${540 + i * 80}" y="1300" width="16" height="190" fill="#6a5a8a"/>`).join("")}<rect x="520" y="1290" width="560" height="22" fill="#6a5a8a"/>`;
  const air = ph ? "" : [0, 1, 2].map((i) => { const u = (tot * 0.6 + i / 3) % 1; return `<path d="M${f1(1000 - 260 * u)} ${700 + i * 70}h-90" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="${f1(1 - u)}"/>`; }).join("");
  const g = sky + house + rail + at(790, 1750, mother(tot, ph ? { phone: 1, armR: [120, -860], armL: [-120, -480] } : { eyesShut: 1, smile: 1, armL: [-260, -640], armR: [260, -640] }), 0.95) + air;
  return { g };
}
// ---- 8: the rule, four beats in order: one bottle alone; rinse with lots of water; the window open; the bleach with a no-mixing sign ----
function s8(a, tot, s) { const q = [0, 3.0, 5.25, 6.7],   // on the words: "one cleaner" / "rinse" / "the window" / "never mix"
   k = a < q[1] ? 0 : a < q[2] ? 1 : a < q[3] ? 2 : 3, b = a - q[k];
  let g;
  if (k === 0) g = `<rect width="1080" height="1920" fill="#dbf0f7"/><rect y="1300" width="1080" height="620" fill="#9fb4c8"/>` + at(540, 1320, bleach(), 1.6 * pop(b)) + at(540, 420, check(1.4), pop(b - 0.4));
  else if (k === 1) { const pourA = seg(b, 0.2, 1.0);
    g = bathroom(tot) + at(560, 1620, toilet({ water: "#9fd8ff" }), 1.15) + at(lerp(820, 720, pourA), 900, `${two("M-120 0L-100 -200H100L120 0Z", "#3fa9ff", "#2a80d2", 0, 0)}<path d="M-100 -200Q0 -260 100 -200" stroke="#2b2f45" stroke-width="10" fill="none"/>`, 1.1, -60 * pourA)
      + (pourA > 0.5 ? `<path d="M610 820Q560 920 590 1180" stroke="#8fd3ff" stroke-width="40" fill="none" opacity=".9" stroke-linecap="round"/>` : "") + at(220, 380, `${at(0, 0, `<path d="M-60 40Q-60 -60 0 -80Q60 -60 60 40Q60 90 0 90Q-60 90 -60 40Z" fill="#3fa9ff"/>`)}${at(120, 0, `<path d="M-60 40Q-60 -60 0 -80Q60 -60 60 40Q60 90 0 90Q-60 90 -60 40Z" fill="#3fa9ff"/>`)}${at(240, 0, `<path d="M-60 40Q-60 -60 0 -80Q60 -60 60 40Q60 90 0 90Q-60 90 -60 40Z" fill="#3fa9ff"/>`)}`, 0.8 * pop(b - 0.5)); }
  else if (k === 2) { const op = seg(b, 0.1, 0.8);
    g = `<g transform="translate(-1000 -100) scale(2.2)">${bathroom(tot, { open: op })}</g>` + [0, 1, 2, 3].map((i) => { const u = (tot * 0.7 + i / 4) % 1; return `<path d="M${f1(900 - 600 * u)} ${300 + i * 120}h-140" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity="${f1(op * (1 - u))}"/><path d="M${f1(760 - 600 * u)} ${300 + i * 120}l26 -18M${f1(760 - 600 * u)} ${300 + i * 120}l26 18" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity="${f1(op * (1 - u))}"/>`; }).join("") + at(540, 1500, check(1.4), pop(b - 0.8)); }
  else g = `<rect width="1080" height="1920" fill="#2a1d66"/><rect y="1300" width="1080" height="620" fill="#1f1450"/>` + at(380, 1300, bleach(), 1.4 * pop(b)) + at(820, 1300, toiletCleaner(), 0.9 * pop(b - 0.2)) + at(820, 1120, cross(1.1), pop(b - 0.6)) + at(540, 600, noMix(1.5), pop(b - 0.3));
  return { g };
}
// ---- 9: the clean, aired bathroom; one tiny stubborn stain winks on the bowl ----
function s9(a, tot) {
  const z = lerp(1, 1.9, ease(seg(a, 0.6, 2.4))), wink = Math.sin(a * 3) > 0.7 ? 1 : 0;
  const room = bathroom(tot, { open: 1 }) + at(560, 1560, toilet({ stain: 1, wink }), 1.1) + [0, 1, 2, 3].map((i) => { const x = 200 + 220 * i, y = 700 + 120 * (i % 2), tw = Math.abs(Math.sin(tot * 3 + i)); return `<path d="M${x} ${y - 30 * tw}V${y + 30 * tw}M${x - 30 * tw} ${y}H${x + 30 * tw}" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`; }).join("");
  const g = `<g transform="translate(630 1270) scale(${f1(z)}) translate(-630 -1270)">${room}</g>`;
  return { g };
}
// ---- 10: STUDIO, he salutes with one bottle only ----
function s10(a, tot) {
  const [rx, ry] = hand(872, 462);
  const g = studio(tot) + at(rx + 20, ry + 120, bleach(), 0.75);
  return { g };
}
// ---- thumbnail only (step 11, not in the video): the mother's worried face, the two bottles, the cloud between them ----
function thumb(a, tot) {
  const g = bathroom(1.2) + `<rect width="1080" height="1920" fill="#1a1240" opacity=".25"/>` + at(540, 230, cloud(1, 1.2, { r: 420, n: 12, a: 0.95 })) + at(540, 2250, mother(1.2, { tears: 1, armL: [-60, -620], armR: [80, -760], cough: 0.2 }), 1.9) + at(190, 1250, bleach(), 1.5, -10) + at(890, 1250, toiletCleaner(), 1.5, 10);
  return { g };
}
const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, thumb];
export const labBleachSet = makeSet(SHOTS, SHOTS, P);
