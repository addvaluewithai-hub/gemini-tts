// The editor: turns the cue file's `edit` list into shots, camera moves, screenshot inserts, big-number
// cards, hiding places and sound cues. Each entry starts at a spoken phrase (`at`) or a time (`t`) and
// lasts until the next entry. An entry with `shot` is a cut; one without it changes something inside
// the running shot. Like the director, it is deterministic: same cues and words, same frames.
//
//   shot    wide | host | close | two | side | low | insert        slide   name in slides.json (also goes on the studio screen)
//   story   { n, tag } for the chip                                 fact    { big, small, tone, riser } - side shots only
//   mark    "headline" or [x, y, w, h] of the slide to highlight    zoom / center   how far the insert pushes in, and on what
//   duck    true: the host sinks behind the desk                    lurk    true: he reappears above the screen
//   peek    true: his head rises over an insert                     paper   pockets | holes | over
//   meme    { kind: chat | versus | list | receipt, ... } - our own drawings, side shots only; see MEMES in studio.html
//   scroll  screens per second the insert keeps scrolling down      (a slide can be several screens tall)
//   drone   { drop: "phrase" } starts the drone prop, false removes it
//   emote / gesture   pin the acting for this entry                 stutter n: hold each pose for n frames
//   trans   punch | whip | cut  (default: chosen from the two shots)

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (p) => p * p * (3 - 2 * p);
const lerp = (a, b, p) => a + (b - a) * p;
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, "");

// Camera framings in set coordinates (1920 x 1080): zoom and the point held at the centre of the frame.
const SHOTS = { wide: { s: 1, x: 960, y: 540 }, host: { s: 1.45, x: 600, y: 425 }, close: { s: 1.82, x: 566, y: 352 }, two: { s: 1.1, x: 1030, y: 455 },
  side: { s: 1.5, x: 900, y: 415 }, low: { s: 1.85, x: 566, y: 520 }, tv: { s: 2.25, x: 1450, y: 390 } };
const PERSIST = ["shot", "slide", "story", "duck", "lurk", "paper", "drone"];
const G = 2600, DRONE_FLOOR = 624;
const droneAt = (u) => ({ x: 1090 + 230 * Math.sin(0.9 * u + 0.6) - 10 * u, y: 250 + 46 * Math.sin(2.1 * u) + 18 * Math.sin(5.3 * u) });

function findPhrase(words, toks, phrase, from) {
  const want = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = from; i + want.length <= toks.length; i++) if (want.every((x, j) => toks[i + j] === x)) return i;
  throw new Error("edit phrase not found after word " + from + ": " + phrase);
}

// Step 1: fix every entry in time, fill in what carries over, and derive the acting, paper and sound cues.
function resolve(cues, words, slides) {
  const toks = words.map((w) => norm(w.t)); let from = 0, cur = { shot: "wide", slide: null, story: null, duck: false, lurk: false, paper: "pockets", drone: null };
  const segs = [], sfx = [], impacts = [], acting = [], paper = [{ t: -99, pose: "pockets" }];
  cues.edit.forEach((raw, n) => {
    let t = raw.t;
    if (raw.at !== undefined) { from = findPhrase(words, toks, raw.at, from); t = words[from].s + (raw.offset ?? -0.07); }
    const seg = { ...raw, t, n, cut: raw.shot !== undefined };
    for (const k of PERSIST) if (seg[k] === undefined) seg[k] = cur[k];
    if (raw.drone) seg.drone = { from: t, drop: raw.drone.drop ? words[findPhrase(words, toks, raw.drone.drop, from)].s : null };
    if (seg.shot === "insert" && !seg.slide) throw new Error("insert without a slide at " + (raw.at ?? raw.t));
    if (seg.mark === "headline") { const f = (slides[seg.slide] || {}).focus; seg.mark = f ? [f[0] - 0.008, f[1] - 0.012, f[2] + 0.016, f[3] + 0.024] : null; }
    segs.push(seg); cur = seg;
  });
  segs.forEach((seg, k) => {
    seg.end = k + 1 < segs.length ? segs[k + 1].t : Infinity;
    let a = k; while (a > 0 && !segs[a].cut) a--; seg.cutT = segs[a].t; seg.cutSeg = segs[a];
    let b = k + 1; while (b < segs.length && !segs[b].cut) b++; seg.nextCut = segs[b] || null;
    const prev = segs[k - 1] || { shot: null, story: null, duck: false, lurk: false, paper: "pockets" };
    seg.studio = seg.shot === "insert" ? (prev.studio || "wide") : seg.shot;
    if (seg.cut) {
      const toInsert = seg.shot === "insert", fromInsert = prev.shot === "insert", ratio = prev.shot && !toInsert && !fromInsert ? SHOTS[seg.shot].s / SHOTS[prev.shot].s : 1;
      seg.trans = seg.trans || (toInsert ? "insert" : fromInsert ? "whip" : ratio > 1.2 ? "punch" : ratio < 0.84 ? "whip" : "cut");
      seg.dir = k % 2 ? 1 : -1;
      if (k > 0) sfx.push(toInsert ? { t: seg.t, type: "shutter" } : seg.trans === "whip" ? { t: seg.t - 0.09, type: "whoosh" } : seg.trans === "punch" ? { t: seg.t, type: "tick" } : { t: seg.t, type: "tick", gain: 0.5 });
      if (toInsert && k > 0) sfx.push({ t: seg.t - 0.16, type: "whoosh", gain: 0.7 });
    }
    if (seg.fact) { if (seg.fact.riser) sfx.push({ t: seg.t - 0.55, type: "riser", len: 0.55 }); sfx.push({ t: seg.t, type: seg.fact.tone === "bubble" ? "pop" : "impact" }); if (seg.fact.tone !== "bubble") impacts.push(seg.t); }
    if (seg.mark) sfx.push({ t: seg.t + 0.14, type: "swipe" });
    if (seg.meme) { const m = seg.meme;
      if (m.kind === "chat") { m.delay = m.delay ?? 0.7; sfx.push({ t: seg.t, type: "pop" }, { t: seg.t + m.delay, type: "ding" }); }
      if (m.kind === "versus") { m.delay = m.delay ?? 0.6; sfx.push({ t: seg.t, type: "tick" }, { t: seg.t + m.delay, type: "impact", gain: 0.6 }); impacts.push(seg.t + m.delay); }
      if (m.kind === "list") { m.step = m.step ?? 0.3; m.items.forEach((_, i) => sfx.push({ t: seg.t + 0.2 + i * m.step, type: "pop", gain: 0.6 })); }
      if (m.kind === "receipt") sfx.push({ t: seg.t, type: "print" }); }
    if (seg.story && seg.story !== prev.story) sfx.push({ t: seg.t + 0.05, type: "ding" });
    if (!!seg.duck !== !!prev.duck) sfx.push({ t: seg.t, type: seg.duck ? "down" : "up" });
    if (seg.lurk && !prev.lurk) sfx.push({ t: seg.t + 0.42, type: "pop" });
    if (seg.peek) sfx.push({ t: seg.t + 0.12, type: "pop", gain: 0.7 });
    if (seg.paper !== prev.paper) paper.push({ t: seg.t, pose: seg.paper });
    if (seg.emote || seg.gesture) acting.push({ exact: true, from: seg.t, to: seg.end, emote: seg.emote, gesture: seg.gesture });
    if (seg.drone && seg.drone !== prev.drone) {
      const d = seg.drone; let stop = Infinity; for (let j = k + 1; j < segs.length; j++) if (!segs[j].drone) { stop = segs[j].t; break; }
      if (d.drop !== null) { const y0 = droneAt(d.drop - d.from).y; d.land = d.drop + Math.sqrt(2 * (DRONE_FLOOR - y0) / G); impacts.push(d.land); sfx.push({ t: d.land, type: "thud" }); }
      sfx.push({ t: d.from, type: "drone", len: (d.drop ?? Math.min(stop, d.from + 8)) - d.from + 0.3 });
    }
  });
  return { segs, sfx, impacts, acting, paper };
}

// Step 2: one studio state per frame.
function build({ cues, plan, acting, slides, N, FPS, tAudio, caption }) {
  const { segs, impacts } = plan, frames = [];
  let hostY = 0, vY = 0, lurk = 0, peek = 0, scrim = 0, lb = 0, chipA = 0, kb = 1, cx = 0.5, cy = 0.3, storyT = -9, lastStory = null, lastInsertCut = -9;
  for (let i = 0; i < N; i++) {
    const tv = i / FPS, t = tAudio(i);
    let k = 0; while (k + 1 < segs.length && segs[k + 1].t <= t) k++;
    const seg = segs[k], cutSeg = seg.cutSeg, age = Math.max(0, t - seg.cutT), next = seg.nextCut, left = next ? next.t - t : 9, insert = seg.shot === "insert";

    // camera: the framing, a slow push, a little handheld life, then whatever the cut adds
    const base = SHOTS[seg.studio]; let s = base.s * (1 + Math.min(0.05, 0.014 * age)), x = base.x, y = base.y, blur = 0, flash = 0;
    x += (5 * Math.sin(2 * Math.PI * 0.13 * tv) + 3 * Math.sin(2 * Math.PI * 0.31 * tv + 1)) / s; y += 4 * Math.sin(2 * Math.PI * 0.17 * tv + 2) / s;
    const r = 0.22 * Math.sin(2 * Math.PI * 0.09 * tv);
    if (!insert && k > 0) {
      if (cutSeg.trans === "punch") s *= 1 + 0.085 * Math.exp(-age * 11);
      else if (cutSeg.trans === "whip") { const w = Math.exp(-age * 17); x += cutSeg.dir * 640 * w / s; blur = 22 * w; }
      else s *= 1 + 0.03 * Math.exp(-age * 12);
    }
    if (!insert && next && next.shot === "insert") { const p = clamp(1 - left / 0.2) ** 3; s = lerp(s, SHOTS.tv.s, p); x = lerp(x, SHOTS.tv.x, p); y = lerp(y, SHOTS.tv.y, p); blur = Math.max(blur, 9 * p); }
    else if (!insert && next && next.trans === "whip") { const p = clamp(1 - left / 0.1) ** 2; x -= next.dir * 420 * p / s; blur = Math.max(blur, 18 * p); }
    for (const ti of impacts) if (t >= ti && t < ti + 0.6) { const a = Math.exp(-(t - ti) * 8); x += a * 15 * Math.sin(tv * 97) / s; y += a * 11 * Math.sin(tv * 83 + 1) / s; flash = Math.max(flash, 0.22 * Math.exp(-(t - ti) * 18)); }

    // the host: seated, ducked behind the desk, or gone from his chair altogether
    const hold = seg.stutter ? i - (i % seg.stutter) : i, a0 = acting[Math.max(0, hold)];
    const targetY = seg.lurk ? 600 : seg.duck ? (seg.duck === true ? 258 : seg.duck) : 0;
    vY = (vY + (targetY - hostY) * 0.2) * 0.6; hostY += vY;
    const body = { e: a0.e, paper: a0.paper, shift: a0.shift, bob: a0.bob, tilt: a0.tilt, armL: a0.armL, armR: a0.armR, shrug: a0.shrug, sway: a0.sway, bounce: a0.bounce, squash: a0.squash };
    lurk += ((seg.lurk && t > seg.t + 0.4 ? 1 : 0) - lurk) * 0.24;
    peek += ((seg.peek ? 1 : 0) - peek) * 0.26;
    const spy = (look) => ({ ...body, e: { ...a0.e, look, lookY: -0.1, symbol: null }, paper: "pockets", shift: 0, armL: null, armR: null, shrug: 0, sway: 0, bounce: 0, squash: 1 });

    // the screenshot insert: the window lands, the picture pushes in on what is being read, a marker runs over it
    let ins = null;
    if (insert) {
      const sl = slides[seg.slide] || {}, m = seg.mark, f = m || sl.focus || [0.3, 0.2, 0.4, 0.2];
      const org = [...(seg.center || [f[0] + f[2] / 2, f[1] + f[3] / 2])]; org[1] += (seg.scroll || 0) * (t - seg.t);
      if (seg.cut && seg.t !== lastInsertCut) { lastInsertCut = seg.t; kb = 1; cx = 0.5; cy = 0.44; }      // every page opens at the top, then scrolls to what is being read
      kb += ((seg.zoom ?? 1.1) - kb) * 0.085; cx += (org[0] - cx) * 0.12; cy += (org[1] - cy) * 0.12;
      const ease = 1 - Math.exp(-age * 15) * Math.cos(age * 17);
      ins = { slide: seg.slide, enter: clamp(age / 0.07), dx: 0, dy: (1 - ease) * 70, scale: 0.93 + 0.07 * ease, rot: (1 - ease) * -1.6 + 0.25 * Math.sin(tv * 0.7), drift: tv % 2.4 / 2.4,
        k: kb * (1 + 0.012 * age), cx, cy, mark: m ? { x: m[0], y: m[1], w: m[2], h: m[3], p: smooth(clamp((t - seg.t - 0.14) / 0.3)) } : null };
      flash = Math.max(flash, 0.3 * Math.exp(-age * 15));
      if (next && next.shot !== "insert") { const p = clamp(1 - left / 0.09) ** 2; ins.dx = -next.dir * 500 * p; blur = 16 * p; }
    }

    // big numbers, the story chip, letterbox on the tight shots
    let fact = null;
    if (seg.fact) { const fa = t - seg.t, stamp = seg.fact.tone === "stamp";
      fact = { big: seg.fact.big, small: seg.fact.small, tone: seg.fact.tone, a: clamp(fa / 0.05), sub: clamp((fa - 0.16) / 0.14),
        s: 1 + 1.5 * Math.exp(-fa * 22) - 0.07 * Math.exp(-fa * 8) * Math.sin(fa * 32), rot: (stamp ? -8 : -2) + 1.5 * Math.exp(-fa * 10), dx: 0, dy: stamp ? 60 : seg.fact.tone === "bubble" ? 40 : 0 }; }
    if (fact) { fact.chart = seg.fact.chart; fact.age = t - seg.t; }
    let meme = null;
    if (seg.meme) { const ma = t - seg.t; meme = { ...seg.meme, age: ma, a: clamp(ma / 0.06), s: 1 + 0.25 * Math.exp(-ma * 16) * Math.cos(ma * 20), rot: 1.5 * Math.exp(-ma * 9) }; }
    scrim += (((seg.fact || seg.meme) && !insert ? 1 : 0) - scrim) * 0.3;
    const tight = !insert && (seg.shot === "close" || seg.shot === "low");
    lb += ((tight ? 62 : 0) - lb) * 0.22;
    if (seg.story !== lastStory) { lastStory = seg.story; storyT = t; }
    chipA += ((seg.story && !tight ? 1 : 0) - chipA) * 0.25;
    const sl = slides[seg.slide];
    const chip = seg.story && chipA > 0.02 ? { n: seg.story.n, tag: seg.story.tag, src: sl && !insert ? `${sl.source} · ${sl.date}` : "", a: chipA, pop: 1 + 0.22 * Math.exp(-(t - storyT) * 9) } : null;

    let drone = null;
    if (seg.drone) { const d = seg.drone, u = t - d.from, enter = smooth(clamp(u / 0.9)), p = droneAt(u);
      if (d.drop !== null && t >= d.drop) { const p0 = droneAt(d.drop - d.from), dt = t - d.drop, fy = p0.y + 0.5 * G * dt * dt, down = fy >= DRONE_FLOOR;
        drone = { x: p0.x - 135, y: Math.min(fy, DRONE_FLOOR) - 68, r: down ? 14 : Math.min(60, 160 * dt), led: 0, spin: down ? 30 : 34, batt: 0, blink: 0 };
      } else drone = { x: lerp(2250, p.x, enter) - 135, y: lerp(120, p.y, enter) - 68, r: 5 * Math.sin(1.7 * u) - 9 * (1 - enter), led: Math.floor(tv * 6) % 2 ? 1 : 0.25, spin: 30 + 6 * (i % 2), batt: d.drop !== null ? clamp(1 - u / (d.drop - d.from)) : 1, blink: tv * 8 };
    }

    frames.push({ cam: { s, x, y, r }, blur, flash, scrim: scrim < 0.01 ? 0 : scrim, lb, brand: 1,
      host: !insert || ins.enter < 1 ? (hostY < 590 ? { ...body, y: hostY } : null) : null,
      lurk: lurk > 0.02 && (!insert || ins.enter < 1) ? { ...spy(0.75 * Math.sin(2 * Math.PI * 0.7 * tv)), amt: lurk } : null,
      peek: peek > 0.02 ? { ...spy(-0.75), amt: peek, rise: 262, rot: -7 } : null,
      tv: seg.slide, onair: Math.floor(tv * 0.8) % 2 ? 1 : 0.55, drone, insert: ins, fact, meme, chip, ...caption(i) });
  }
  return frames;
}

module.exports = { resolve, build, SHOTS };
