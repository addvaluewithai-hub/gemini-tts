// "The middle man" in portrait (1080 x 1920), for the Shorts. Shot 5 is drawn again for the tall frame: the tower of
// coins and its €100,000 line up top, the cracked bank below; the scoop comes in from the upper right, takes the top of
// the tower and carries it down into the bank, which mends itself. The others are the landscape shots reframed.
import { ease, easeOut, easeIn, seg, spring, bez, camAt, layer, toScreen, rings, text, drawn, at, FW, FH } from "./kit.js";
import { P, bank, stars } from "./bank.js";
import { bump, cracks } from "./middle.js";

function m5V(a, tot) {
  const c = camAt(a, [[0, 540, 1010, 1.05], [4.53, 540, 1010, 1.08]]), G = 900, TX = 360, N = 16, LINE = 10, H = 28;
  const disk = (x, y) => `<path d="M${x - 130} ${y}v14a130 32 0 0 0 260 0v-14Z" fill="${P.goldD}"/><ellipse cx="${x}" cy="${y}" rx="130" ry="32" fill="${P.gold}"/><ellipse cx="${x}" cy="${y}" rx="92" ry="22" fill="none" stroke="${P.goldD}" stroke-width="5"/>`;
  const scoopT = seg(a, 2.07, 2.45), carry = seg(a, 2.45, 2.95), took = a > 2.45 ? 3 : 0, BX = 560, BY = 1640;
  const sp = scoopT < 1 ? bez([1000, 200], [800, 200], [TX + 120, G - (N - 1.5) * H - 40], easeOut(scoopT)) : bez([TX + 120, G - (N - 1.5) * H - 40], [900, 900], [BX, BY - 380], ease(carry));
  let tower = "";
  for (let i = 0; i < N; i++) { const t0 = 0.05 + i * 0.04; if (a < t0) continue; if (i >= N - took) continue; const y = G - 20 - i * H - 260 * (1 - easeOut(seg(a, t0, t0 + 0.14)));
    tower += disk(TX, y); }
  const ly = G - 20 - (LINE - 0.5) * H - 14, line = drawn(`M${TX - 180} ${ly}H${TX + 230}`, seg(a, 0.66, 1.13), "#fff3c2", 7, 'stroke-dasharray="0.03 0.025"') + (a > 0.75 ? text(TX + 250, ly + 20, "€100,000", 64, "#fff3c2", { anchor: "start", opacity: seg(a, 0.75, 1.0).toFixed(2) }) : "");
  const load = took && a < 2.97 ? [0, 1, 2].map((i) => disk(0, -i * H)).join("") : "";
  const ex = easeIn(seg(a, 2.95, 3.45)), spx = sp[0] + 500 * ex, spy = sp[1] - 900 * ex;
  const scoop = a > 2.0 && ex < 1 ? at(spx, spy, `<path d="M-40 -400L-10 -60" stroke="${P.steelD}" stroke-width="22"/>${load ? at(0, -14, load, 0.8) : ""}<path d="M-160 -40Q0 100 160 -40L130 -60Q0 40 -130 -60Z" fill="${P.steel}"/>`, 1, carry * -8) : "";
  const fed = a > 2.95 ? spring(a - 2.95, 7, 11) : 0, mend = 1.4 * (1 - seg(a, 3.35, 4.1));
  const bk = at(BX, BY, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: (fed > 0 ? rings(0, -150, 120 * fed, P.gold, 0.3) : "") + cracks(mend) }), [0.95 * bump(a, 3.92, 0.06), 0.95 * bump(a, 3.92, 0.06)]);
  const main = `<rect x="-600" y="${G}" width="2300" height="40" fill="#2c1a66"/><rect x="-600" y="${G}" width="2300" height="8" fill="#3a2a7a"/><rect x="-600" y="${BY}" width="2300" height="600" fill="#2c1a66"/>` + bk + tower + line + scoop + (a > 3.92 ? rings(BX, BY - 300, 340 * spring(a - 3.92, 6, 10), P.gold, 0.12 * (1 - seg(a, 4.2, 4.53))) : "");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(53, 90, -300, 1400, 2000, tot), c, 0.2) + layer(main, c);
  return { g, in: toScreen(c, TX, G - 20 - (N - 1) * H), inC: P.gold, inZ: 18, out: toScreen(c, BX, BY - 110), outC: P.ink, outZ: 18 };
}
export const V = [, , , { z: 1.25 }, { z: 0.75 }, m5V, { z: 0.85 }, { z: 0.85 }];
