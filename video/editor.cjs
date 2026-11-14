// The editor: turns the cue file's `edit` list into shots, camera moves, screenshot inserts, big-number
// cards, hiding places and sound cues. Each entry starts at a spoken phrase (`at`) or a time (`t`) and
// lasts until the next entry. An entry with `shot` is a cut; one without it changes something inside
// the running shot. Like the director, it is deterministic: same cues and words, same frames.
//
//   shot    wide | host | close | two | side | low | insert        slide   name in slides.json (also goes on the studio screen)
//   story   { n, tag, icon? } for the chip                          fact    { big, small, tone, riser } - side shots only
//   mark    "headline" or [x, y, w, h] of the slide to highlight    zoom / center   how far the insert pushes in, and on what
//   duck    true: the host sinks behind the desk                    lurk    true: he reappears above the screen
//   peek    true: his head rises over an insert                     paper   pockets | holes | over
//   meme    { kind: chat | versus | list | receipt, ... } - our own drawings, side shots only; see MEMES in studio.html
//   scroll  screens per second the insert keeps scrolling down      (a slide can be several screens tall)
//   drone   { drop: "phrase" } starts the drone prop, false removes it
//   emote / gesture   pin the acting for this entry                 stutter n: hold each pose for n frames
//   trans   punch | whip | cut  (default: chosen from the two shots)
//   board   { kind, ... } with step: a motion-graphics board (boards.js), for shot "show" with kind "board"
//   host    in the explain layout, where the host is while something is shown: pip | right | left (default: not on screen)
//   calm    true: no nodding or bouncing on stressed words during this entry
//   music   0..1: how loud the music bed is from here on (for a passage that should not bounce along)

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (p) => p * p * (3 - 2 * p);
const lerp = (a, b, p) => a + (b - a) * p;
// Words are compared without case, punctuation or Arabic vowel marks, and with the alef, yeh and teh marbuta variants folded together.
const norm = (t) => t.toLowerCase().normalize("NFKD").replace(/[ً-ٰٟـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^a-z0-9ء-ي]/g, "");

// Camera framings in set coordinates (1920 x 1080): zoom and the point held at the centre of the frame.
const SHOTS = { wide: { s: 1, x: 960, y: 540 }, host: { s: 1.45, x: 600, y: 425 }, close: { s: 1.82, x: 566, y: 352 }, two: { s: 1.1, x: 1030, y: 455 },
  side: { s: 1.5, x: 900, y: 415 }, low: { s: 1.85, x: 566, y: 520 }, tv: { s: 2.25, x: 1450, y: 390 } };
// The "solo" layout has no wall screen: the host is centred, and a `show` shot fills the frame with a slide, a fact or a meme while he sits small in the corner.
const SOLO = { wide: { s: 1, x: 960, y: 540 }, host: { s: 1.42, x: 960, y: 430 }, close: { s: 1.82, x: 966, y: 352 }, low: { s: 1.85, x: 966, y: 520 } };
// The "short" layout is the solo set in a 1080 x 1920 frame: the host stays on screen the whole time, and a fact or a meme
// appears above him instead of replacing him. The stage moves him down and makes room when something is shown.
const SHORT = { wide: { s: 1.3, x: 960, y: 470 }, host: { s: 1.5, x: 960, y: 450 }, close: { s: 1.72, x: 966, y: 420 }, low: { s: 1.7, x: 966, y: 560 } };
// `vertical: true` on an explain cue file (size 1080 x 1920) is the same episode cut for Shorts: the host stays on screen
// the whole time, and a board sits above him as a card instead of filling the frame.
const PERSIST = ["shot", "kind", "slide", "story", "duck", "lurk", "paper", "drone", "music"];
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
  const segs = [], sfx = [], impacts = [], acting = [], paper = [{ t: -99, pose: "pockets" }], music = [];
  cues.edit.forEach((raw, n) => {
    let t = raw.t;
    if (raw.at !== undefined) { from = findPhrase(words, toks, raw.at, from); t = words[from].s + (raw.offset ?? -0.07); }
    const seg = { ...raw, t, n, cut: raw.shot !== undefined };
    for (const k of PERSIST) if (seg[k] === undefined) seg[k] = cur[k];
    if (raw.drone) seg.drone = { from: t, drop: raw.drone.drop ? words[findPhrase(words, toks, raw.drone.drop, from)].s : null };
    seg.full = seg.shot === "insert" || seg.shot === "show";              // something fills the frame
    if (seg.shot === "insert") seg.kind = "slide";
    if (seg.full && seg.kind === "slide" && !seg.slide) throw new Error("slide shot without a slide at " + (raw.at ?? raw.t));
    if (seg.mark === "headline") { const f = (slides[seg.slide] || {}).focus; seg.mark = f ? [f[0] - 0.008, f[1] - 0.012, f[2] + 0.016, f[3] + 0.024] : null; }
    segs.push(seg); cur = seg;
  });
  segs.forEach((seg, k) => {
    seg.end = k + 1 < segs.length ? segs[k + 1].t : Infinity;
    let a = k; while (a > 0 && !segs[a].cut) a--; seg.cutT = segs[a].t; seg.cutSeg = segs[a];
    let b = k + 1; while (b < segs.length && !segs[b].cut) b++; seg.nextCut = segs[b] || null;
    const prev = segs[k - 1] || { shot: null, story: null, duck: false, lurk: false, paper: "pockets" };
    seg.studio = seg.full ? (prev.studio || "wide") : seg.shot;
    if (seg.cut) {
      const toInsert = seg.full, fromInsert = !!prev.full, ratio = prev.shot && !toInsert && !fromInsert ? SHOTS[seg.shot].s / SHOTS[prev.shot].s : 1;
      seg.trans = seg.trans || (toInsert ? "insert" : fromInsert ? "whip" : ratio > 1.2 ? "punch" : ratio < 0.84 ? "whip" : "cut");
      seg.dir = k % 2 ? 1 : -1;
      if (k > 0) sfx.push(toInsert ? (seg.kind === "slide" ? { t: seg.t, type: "shutter" } : { t: seg.t, type: "tick", gain: 0.4 }) : seg.trans === "whip" ? { t: seg.t - 0.09, type: "whoosh", gain: cues.whooshGain ?? 1 } : seg.trans === "punch" ? { t: seg.t, type: "tick" } : { t: seg.t, type: "tick", gain: 0.5 });
      if (toInsert && k > 0 && (cues.whooshGain ?? 1) > 0) sfx.push({ t: seg.t - 0.16, type: "whoosh", gain: 0.7 * (cues.whooshGain ?? 1) });   // settings.whooshGain turns the cut whoosh down (0 = off)
    }
    if (seg.fact) { if (seg.fact.riser) sfx.push({ t: seg.t - 0.55, type: "riser", len: 0.55 }); sfx.push({ t: seg.t, type: seg.fact.tone === "bubble" ? "pop" : "impact" }); if (seg.fact.tone !== "bubble") impacts.push(seg.t); }
    if (seg.mark) sfx.push({ t: seg.t + 0.14, type: "swipe" });
    if (seg.kind === "board" && seg.full && !seg.cut && k > 0 && seg.step !== prev.step) sfx.push({ t: seg.t, type: "pop", gain: 0.55 });       // a board moving on a step
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
    if ((seg.music ?? 1) !== (prev.music ?? 1)) music.push({ t: seg.t, g: seg.music ?? 1 });
    if (seg.emote || seg.gesture || seg.calm) acting.push({ exact: true, from: seg.t, to: seg.end, emote: seg.emote, gesture: seg.gesture, calm: !!seg.calm });
    if (seg.drone && seg.drone !== prev.drone) {
      const d = seg.drone; let stop = Infinity; for (let j = k + 1; j < segs.length; j++) if (!segs[j].drone) { stop = segs[j].t; break; }
      if (d.drop !== null) { const y0 = droneAt(d.drop - d.from).y; d.land = d.drop + Math.sqrt(2 * (DRONE_FLOOR - y0) / G); impacts.push(d.land); sfx.push({ t: d.land, type: "thud" }); }
      sfx.push({ t: d.from, type: "drone", len: (d.drop ?? Math.min(stop, d.from + 8)) - d.from + 0.3 });
    }
  });
  return { segs, sfx, impacts, acting, paper, music };
}

// Step 2: one studio state per frame.
function build({ cues, plan, acting, slides, N, FPS, tAudio, caption }) {
  const { segs, impacts } = plan, frames = [], short = cues.layout === "short", explain = cues.layout === "explain", solo = cues.layout === "solo" || explain, vert = explain && !!cues.vertical, base = short || vert ? SHORT : solo ? SOLO : SHOTS,
    shots = cues.shots ? Object.fromEntries(Object.entries(base).map(([k, v]) => [k, { ...v, ...(cues.shots[k] || {}) }])) : base;   // settings.shots loosens or tightens a framing per episode
  let pip = 0, room = 0, side = "right";
  let hostY = 0, vY = 0, lurk = 0, peek = 0, scrim = 0, lb = 0, chipA = 0, kb = 1, cx = 0.5, cy = 0.3, storyT = -9, lastStory = null, lastInsertCut = -9;
  for (let i = 0; i < N; i++) {
    const tv = i / FPS, t = tAudio(i);
    let k = 0; while (k + 1 < segs.length && segs[k + 1].t <= t) k++;
    const seg = segs[k], cutSeg = seg.cutSeg, age = Math.max(0, t - seg.cutT), next = seg.nextCut, left = next ? next.t - t : 9, insert = !!seg.full && !short, slideOn = insert && seg.kind === "slide";

    // camera: the framing, a slow push, a little handheld life, then whatever the cut adds
    const base = shots[vert && seg.full ? "host" : seg.studio] || shots.wide; let s = base.s * (1 + Math.min(0.05, 0.014 * age)), x = base.x, y = base.y, blur = 0, flash = 0;
    x += (5 * Math.sin(2 * Math.PI * 0.13 * tv) + 3 * Math.sin(2 * Math.PI * 0.31 * tv + 1)) / s; y += 4 * Math.sin(2 * Math.PI * 0.17 * tv + 2) / s;
    const r = 0.22 * Math.sin(2 * Math.PI * 0.09 * tv);
    if ((!insert || vert) && k > 0 && !(vert && seg.full)) {
      if (cutSeg.trans === "punch") s *= 1 + 0.085 * Math.exp(-age * 11);
      else if (cutSeg.trans === "whip") { const w = Math.exp(-age * 17); x += cutSeg.dir * 640 * w / s; blur = 22 * w; }
      else s *= 1 + 0.03 * Math.exp(-age * 12);
    }
    if (!insert && next && next.full && !solo) { const p = clamp(1 - left / 0.2) ** 3; s = lerp(s, SHOTS.tv.s, p); x = lerp(x, SHOTS.tv.x, p); y = lerp(y, SHOTS.tv.y, p); blur = Math.max(blur, 9 * p); }
    else if (!insert && next && (next.trans === "whip" || (solo && !vert && next.full))) { const p = clamp(1 - left / 0.1) ** 2; x -= next.dir * 420 * p / s; blur = Math.max(blur, 18 * p); }
    for (const ti of impacts) if (t >= ti && t < ti + 0.6) { const a = Math.exp(-(t - ti) * 8); x += a * 15 * Math.sin(tv * 97) / s; y += a * 11 * Math.sin(tv * 83 + 1) / s; flash = Math.max(flash, 0.22 * Math.exp(-(t - ti) * 18)); }

    // the host: seated, ducked behind the desk, or gone from his chair altogether
    const hold = seg.stutter ? i - (i % seg.stutter) : i, a0 = acting[Math.max(0, hold)];
    const targetY = seg.lurk ? 600 : seg.duck ? (seg.duck === true ? 258 : seg.duck) : 0;
    vY = (vY + (targetY - hostY) * 0.2) * 0.6; hostY += vY;
    const body = { e: a0.e, paper: a0.paper, shift: a0.shift, bob: a0.bob, tilt: a0.tilt, armL: a0.armL, armR: a0.armR, shrug: a0.shrug, sway: a0.sway, bounce: a0.bounce, squash: a0.squash };
    lurk += ((seg.lurk && t > seg.t + 0.4 ? 1 : 0) - lurk) * 0.24;
    const sideHost = explain && (!vert || cues.portraitSets) && insert && (seg.host === "right" || seg.host === "left") ? seg.host : null;   // portraitSets: a Short whose sets fill the frame; he leans in from the side as in the episode
    if (sideHost) side = sideHost;
    peek += ((seg.peek || sideHost ? 1 : 0) - peek) * 0.26;
    const spy = (look) => ({ ...body, e: { ...a0.e, look, lookY: -0.1, symbol: null }, paper: "pockets", shift: 0, armL: null, armR: null, shrug: 0, sway: 0, bounce: 0, squash: 1 });

    // the screenshot insert: the window lands, the picture pushes in on what is being read, a marker runs over it
    let ins = null;
    if (insert && !slideOn) { const ease = 1 - Math.exp(-age * 15); ins = { slide: null, enter: clamp(age / 0.07), dx: 0, dy: 0, scale: 1, rot: 0, drift: tv % 2.4 / 2.4, k: 1, cx: 0.5, cy: 0.5, mark: null };
      if (next && !next.full) { const p = clamp(1 - left / 0.09) ** 2; blur = 16 * p; } }
    if (slideOn) {
      const sl = slides[seg.slide] || {}, m = seg.mark, f = m || sl.focus || [0.3, 0.2, 0.4, 0.2];
      const org = [...(seg.center || [f[0] + f[2] / 2, f[1] + f[3] / 2])]; org[1] += (seg.scroll || 0) * (t - seg.t);
      if (seg.cut && seg.t !== lastInsertCut) { lastInsertCut = seg.t; kb = 1; cx = 0.5; cy = 0.44; }      // every page opens at the top, then scrolls to what is being read
      kb += ((seg.zoom ?? (solo ? 1 : 1.1)) - kb) * 0.085; cx += (org[0] - cx) * 0.12; cy += (org[1] - cy) * 0.12;
      const ease = 1 - Math.exp(-age * 15) * Math.cos(age * 17);
      ins = { slide: seg.slide, enter: clamp(age / 0.07), dx: 0, dy: (1 - ease) * 70, scale: 0.93 + 0.07 * ease, rot: (1 - ease) * -1.6 + 0.25 * Math.sin(tv * 0.7), drift: tv % 2.4 / 2.4,
        k: kb * (1 + (solo ? 0.003 : 0.012) * age), cx, cy, mark: m ? { x: m[0], y: m[1], w: m[2], h: m[3], p: smooth(clamp((t - seg.t - 0.14) / 0.3)) } : null };
      flash = Math.max(flash, 0.3 * Math.exp(-age * 15));
      if (solo) Object.assign(ins, { dy: 0, rot: 0, scale: 1 + 0.045 * Math.exp(-age * 12) });
      if (next && !next.full) { const p = clamp(1 - left / 0.09) ** 2; ins.dx = solo ? 0 : -next.dir * 500 * p; blur = 16 * p; }
    }

    // big numbers, the story chip, letterbox on the tight shots
    let fact = null;
    if (seg.fact) { const fa = t - seg.t, stamp = seg.fact.tone === "stamp";
      fact = { big: seg.fact.big, small: seg.fact.small, tone: seg.fact.tone, a: clamp(fa / 0.05), sub: clamp((fa - 0.16) / 0.14),
        s: 1 + 1.5 * Math.exp(-fa * 22) - 0.07 * Math.exp(-fa * 8) * Math.sin(fa * 32), rot: (stamp ? -8 : -2) + 1.5 * Math.exp(-fa * 10), dx: 0, dy: stamp ? 60 : seg.fact.tone === "bubble" ? 40 : 0 }; }
    if (fact) { fact.chart = seg.fact.chart; fact.age = t - seg.t; }
    let meme = null;
    if (seg.meme) { const ma = t - seg.t; meme = { ...seg.meme, age: ma, a: clamp(ma / 0.06), s: 1 + 0.25 * Math.exp(-ma * 16) * Math.cos(ma * 20), rot: 1.5 * Math.exp(-ma * 9) }; }
    scrim += (((seg.fact || seg.meme) && !insert && !short ? 1 : 0) - scrim) * 0.3;
    // explain: the picture carries the lesson, so the host is on screen only where a beat asks for him (host: pip | right | left)
    pip += (((explain ? seg.host === "pip" : solo) && insert && !vert ? 1 : 0) - pip) * 0.3;
    room += (((short || vert) && (seg.fact || seg.meme || (vert && insert)) ? 1 : 0) - room) * (vert && i === 0 ? 1 : 0.26);       // a clip that opens on a board starts laid out for it
    const tight = !insert && (seg.shot === "close" || seg.shot === "low");
    lb += ((tight && !short && !vert && cues.letterbox !== false ? 62 : 0) - lb) * 0.22;
    if (seg.story !== lastStory) { lastStory = seg.story; storyT = t; }
    chipA += ((seg.story && (!tight || short || vert) ? 1 : 0) - chipA) * 0.25;
    const sl = slides[seg.slide];
    const chip = seg.story && chipA > 0.02 ? { n: seg.story.n, tag: seg.story.tag, icon: seg.story.icon || null, src: sl && (!insert || (solo && slideOn)) ? `${sl.source} · ${sl.date}` : "", a: chipA, pop: 1 + 0.22 * Math.exp(-(t - storyT) * 9), low: solo && insert && !vert } : null;

    let drone = null;
    if (seg.drone) { const d = seg.drone, u = t - d.from, enter = smooth(clamp(u / 0.9)), p = droneAt(u);
      if (d.drop !== null && t >= d.drop) { const p0 = droneAt(d.drop - d.from), dt = t - d.drop, fy = p0.y + 0.5 * G * dt * dt, down = fy >= DRONE_FLOOR;
        drone = { x: p0.x - 135, y: Math.min(fy, DRONE_FLOOR) - 68, r: down ? 14 : Math.min(60, 160 * dt), led: 0, spin: down ? 30 : 34, batt: 0, blink: 0 };
      } else drone = { x: lerp(2250, p.x, enter) - 135, y: lerp(120, p.y, enter) - 68, r: 5 * Math.sin(1.7 * u) - 9 * (1 - enter), led: Math.floor(tv * 6) % 2 ? 1 : 0.25, spin: 30 + 6 * (i % 2), batt: d.drop !== null ? clamp(1 - u / (d.drop - d.from)) : 1, blink: tv * 8 };
    }

    frames.push({ cam: { s, x, y, r }, blur, flash, scrim: scrim < 0.01 ? 0 : scrim, lb, brand: solo && insert ? 0 : 1, sweep: (tv * 40) % 360, room,
      pip: pip > 0.02 ? { ...body, y: hostY, amt: pip } : null,
      host: vert || !insert || ins.enter < 1 ? (hostY < 590 ? { ...body, y: hostY } : null) : null,
      lurk: lurk > 0.02 && (!insert || ins.enter < 1) ? { ...spy(0.75 * Math.sin(2 * Math.PI * 0.7 * tv)), amt: lurk } : null,
      peek: peek > 0.02 ? (explain ? { ...body, paper: "pockets", shift: 0, armL: null, armR: null, amt: peek, side } : { ...spy(-0.75), amt: peek, rise: 262, rot: -7 }) : null,
      // the host acting inside a full-frame set: placed by its feet, any size, optionally walking from one spot to another over the beat
      actor: insert && seg.actor ? (() => { const a = seg.actor, to = a.to || {}, span = Math.max(0.3, (Math.min(seg.end, seg.t + 30) - seg.t) * (a.over ?? 0.75)), p = a.to ? smooth(clamp((t - seg.t - (a.wait ?? 0)) / span)) : 0, moving = !!a.to && p > 0.01 && p < 0.99;
        return { ...body, ...(a.arms === false ? { armL: null, armR: null } : {}), x: lerp(a.x, to.x ?? a.x, p), y: lerp(a.y, to.y ?? a.y, p), size: lerp(a.size, to.size ?? a.size, p), flip: !!a.flip, hop: moving ? Math.abs(Math.sin(t * 10)) : 0, lean: moving ? 4 : 0 }; })() : null,
      board: insert && seg.kind === "board" ? { spec: seg.board, step: seg.step || 0, age: t - (seg.stepT ?? seg.t), total: t - seg.cutT } : null,
      tv: seg.slide, onair: Math.floor(tv * 0.8) % 2 ? 1 : 0.55, drone, insert: ins, fact, meme, chip, ...caption(i) });
  }
  return frames;
}

module.exports = { resolve, build, SHOTS, norm };
