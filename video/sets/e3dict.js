// The human dictionary of electricity part 3 of 4: two shots, each a word in Latin letters with a picture.
//   0 BLACKOUT: a plate drops on «Blackout»; the country's grid, all lit, goes dark from one corner on «الشبكة كلها تقع»
//   1 LOAD SHEDDING: a plate on «Load shedding»; a street of five blocks; one goes dark for "2 h" on «يطفّوا», then it comes
//     back and the next one goes dark, in turn, never all at once (a check on «مايقعش»); a daily timetable card comes in on
//     «بلاد كتير». Host right: the lower right is kept clear.
import { clamp, lerp, ease, seg, spring, camAt, layer, toScreen, rr, two, disc, rings, text, at, check, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./e3dict.v.js";
import { P, E, mix, stars, house, pop, plate } from "./elec.js";
import { land, TOWNS } from "./blackstart.js";

const NIGHT = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(53, 90, -600, 2600, 1000, tot), c, 0.15);
const tagBox = (t, size = 70, fill = P.gold) => { const w = String(t).length * size * 0.5 + size; return `${two(rr(-w / 2, -size * 0.75, w, size * 1.5, size * 0.75), P.ink, "#0d0826", 0, 6)}${text(0, size * 0.34, t, size, fill)}`; };

// ---- 0: Blackout ----
function s0(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 620, 0.7], [5.19, 960, 640, 0.72]]) : camAt(a, [[0, 960, 600, 0.92], [5.19, 960, 600, 0.95]]);
  const PY = v ? -60 : 70;
  const pl = at(960, PY - 260 * (1 - pop(a - 2.46)), plate("BLACKOUT", v ? 120 : 100), pop(a - 2.46));
  const on = (i) => 1 - clamp((a - 3.95 - (TOWNS[i][0] - 300) / 1400 * 0.6) / 0.15);
  const g = NIGHT(c, tot) + layer(at(0, v ? 120 : 80, land(on, { noDam: true })) + pl, c);
  return { g, out: toScreen(c, 960, 640), outC: "#04121e", outZ: 12 };
}

// ---- 1: Load shedding ----
function s1(a, tot) {
  const v = portrait(), c = v ? camAt(a, [[0, 960, 760, 1.0], [9.03, 960, 770, 1.0]]) : camAt(a, [[0, 900, 520, 1.0], [9.03, 880, 520, 1.02]]);
  const N = 5, G = v ? 1060 : 800;
  // which block is dark at time a: block 0 from 2.11, 1 from 3.58, then one more each 1.0 s
  const T = [2.11, 3.58, 4.58, 5.58, 6.58, 7.58];
  const darkIdx = a < T[0] ? -1 : (() => { let k = 0; while (k < T.length - 1 && a > T[k + 1]) k++; return k % N; })();
  const pl = at(v ? 960 : 560, v ? 150 : 140, plate("LOAD SHEDDING", v ? 76 : 80), pop(a - 0.41));
  const blocks = Array.from({ length: N }, (_, i) => { const d = i === darkIdx ? 1 : 0, x = v ? 320 + (i % 3) * 320 : 200 + i * 250, y = v ? G - (i < 3 ? 260 : -120) : G;
    return at(x + (v && i >= 3 ? 160 : 0), y, `${at(-60, 0, house(E.houseA, E.houseAD, { roof: E.roof, lit: [!d, !d, !d] }), 0.55)}${at(60, 0, house(E.houseB, E.houseBD, { roof: E.roof, lit: [!d, !d, !d] }), 0.55)}`); }).join("");
  const bx = (i) => v ? 320 + (i % 3) * 320 + (i >= 3 ? 160 : 0) : 200 + i * 250, by = (i) => v ? G - (i < 3 ? 260 : -120) - 200 : G - 220;
  const tag = darkIdx >= 0 ? at(bx(darkIdx), by(darkIdx), tagBox("2 h", 50), pop(a - (T.find((t) => a >= t && a < t + 1.2) ?? T[0]))) : "";
  const ok = a > 4.88 ? at(v ? 960 : 1360, v ? 1500 : 560, check(0, 0, 50, P.green, a - 4.88)) : "";
  // the daily timetable: rows of blocks, columns of hours; dark cells step down the diagonal
  const TX = v ? 960 : 1360, TY = v ? 1580 : 300;
  const table = a > 5.8 ? at(TX, TY + (v ? 120 : 0), `${two(rr(-230, -170, 460, 330, 22), P.cream, P.creamD, 0, 8)}<path d="${rr(-230, -170, 460, 60, 22)}" fill="${RED_T}"/>${[0, 1, 2, 3, 4].map((h) => `<circle cx="${-150 + h * 75}" cy="-140" r="16" fill="#fff"/><path d="M${-150 + h * 75} -140v-10M${-150 + h * 75} -140h8" stroke="${P.ink}" stroke-width="3"/>`).join("")}
    ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, h) => `<rect x="${-180 + h * 75}" y="${-90 + r * 60}" width="60" height="44" rx="6" fill="${(h + r) % 5 === Math.floor(a * 1.4) % 5 ? P.ink : "#e9d9b4"}"/>`).join("")).join("")}`, (v ? 0.9 : 0.8) * pop(a - 5.83)) : "";
  const g = NIGHT(c, tot) + layer(`<rect x="-900" y="${G}" width="3800" height="1400" fill="${P.ground}"/>` + blocks + tag + ok + table + pl, c);
  return { g, in: toScreen(c, 960, 520), inC: "#04121e" };
}
const RED_T = "#ff4d5a";

export const SHOTS = [s0, s1];
export const e3dictSet = makeSet(SHOTS, V, P);
