// The director: turns words, audio level and the lip-sync track into a full performance, frame by frame.
// It reads each sentence and picks a feeling and a gesture for it, reacts in the pauses, nods and flashes
// the brows on stressed words, and lets everything settle through springs so nothing snaps. Deterministic:
// the same inputs always give the same frames. A cue file can override any sentence or pause.

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (p) => p * p * (3 - 2 * p);
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// ---- reading the script ---------------------------------------------------------------------------
const EMOTE_RULES = [
  [/[?؟]\s*$/, ["skeptical"]],
  [/\b(breach|exploit|attack|hack|compromised|critical|vulnerab|stolen|leak|remote code)/i, ["serious", "worried"]],
  [/\b(fun part|welcome|lighter|progress|good news|finally arrived|that's the show)\b/i, ["grin", "proud"]],
  [/\b(insist|clearly|honestly|lovingly|voluntarily|enthusiastically|we insist|polite|comforting)\b/i, ["smug", "sly"]],
  [/\b(sigh|handed them|automated|layoffs|never go away|still reading)\b/i, ["bored", "deadpan"]],
  [/\b(wrong|nobody|never|no play|not allowed|no\b)/i, ["sly", "deadpan", "smug"]],
  [/\d/, ["surprised", "proud"]],
];
const GESTURE_RULES = [
  [/[?؟]\s*$/, ["shrug"]],
  [/^(welcome)\b/i, ["wave"]],
  [/\b(sigh|handed them|automated|honestly)\b/i, ["facepalm", "shrug"]],
  [/^(lead story|story (two|three)|lightning round|something lighter|here is|so,)/i, ["presentHigh", "present"]],
  [/\b(which means|the play is|think|wonder|sit with)\b/i, ["chin"]],
  [/\d/, ["count", "point"]],
  [/\b(you|your)\b/i, ["point", "present", "pockets"]],
  [/\b(all of them|everyone|every)\b/i, ["cheer", "stop"]],
];
const DEFAULT_EMOTES = ["neutral", "sly", "smug", "neutral", "proud", "neutral", "skeptical"];
const DEFAULT_GESTURES = ["pockets", "present", "pockets", "point", "pockets", "presentHigh", "pockets", "shrug"];
const REACTIONS = { skeptical: ["skeptical", "eyeroll"], serious: ["deadpan", "bored"], worried: ["deadpan", "eyeroll"], grin: ["smug", "wink"], proud: ["smug", "wink"],
  smug: ["smug", "sly", "wink"], sly: ["deadpan", "smug"], bored: ["eyeroll", "deadpan"], deadpan: ["deadpan", "bored"], surprised: ["deadpan", "smug"], neutral: ["smug", "deadpan", "sly"] };

function sentences(words) {
  const out = []; let a = 0;
  words.forEach((w, i) => { if (/[.!?؟]["')]*$/.test(w.t) || i === words.length - 1) { out.push({ a, b: i, s: words[a].s, e: w.e, text: words.slice(a, i + 1).map((x) => x.t).join(" ") }); a = i + 1; } });
  out.forEach((s, i) => { s.gap = i + 1 < out.length ? out[i + 1].s - s.e : 9; });
  return out;
}

async function direct({ words, lip, level, cues, N, FPS, tAudio }) {
  const { EMOTES, GESTURES } = await import("./characters/acting.js");
  const { MOUTHS } = await import("./characters/peek3d.js");
  const R = rng(cues.seed ?? 17), pick = (list, avoid) => { const c = list.filter((x) => x !== avoid); const l = c.length ? c : list; return l[Math.floor(R() * l.length)]; };
  const shape = (m) => ({ tongue: 0, ...(typeof m === "string" ? MOUTHS[m] : m) });

  // 1. a plan per sentence, then a reaction for each real pause
  const sents = sentences(words); let lastE = null, lastG = null, di = 0, dg = 0;
  for (const s of sents) {
    const n = s.b - s.a + 1, er = EMOTE_RULES.find(([re]) => re.test(s.text)), gr = GESTURE_RULES.find(([re]) => re.test(s.text));
    s.emote = er ? pick(er[1], lastE) : n <= 3 ? pick(["deadpan", "smug"], lastE) : DEFAULT_EMOTES[di++ % DEFAULT_EMOTES.length];
    s.gesture = gr ? pick(gr[1], lastG) : n <= 3 ? "pockets" : DEFAULT_GESTURES[dg++ % DEFAULT_GESTURES.length];
    if (s.e - s.s < 0.9 && s.gesture !== "wave") s.gesture = "pockets";          // too short to get a hand out
    s.side = sents.indexOf(s) % 2 ? 1 : -1;
    s.react = s.gap >= 0.75 ? pick(REACTIONS[s.emote] || REACTIONS.neutral) : null;
    lastE = s.emote; lastG = s.gesture;
  }
  for (const o of (cues.acting || []).filter((c) => !c.exact)) for (const s of sents) if (s.s < o.to && s.e > o.from) { if (o.emote) s.emote = o.emote; if (o.gesture) s.gesture = o.gesture; if (o.react !== undefined) s.react = o.react; }
  const deadAt = (t) => (cues.deadpan || []).some(([a, b]) => t >= a && t <= b);

  // 2. stressed words: the loudest ones, at most one every 0.45 s
  const peakOf = (w) => { let m = 0; for (let t = w.s; t <= w.e; t += 0.01) m = Math.max(m, level(t)); return m; };
  const peaks = words.map(peakOf), sorted = [...peaks].sort((a, b) => a - b), cut = sorted[Math.floor(sorted.length * 0.72)] || 0;
  const beats = []; words.forEach((w, i) => { const strong = (peaks[i] >= cut && w.t.replace(/[^\p{L}\p{N}]/gu, "").length >= 4) || /\d/.test(w.t); const t = w.s + (w.e - w.s) * 0.35; if (strong && (!beats.length || t - beats[beats.length - 1] > 0.45)) beats.push(t); });
  const pulse = (t, len) => { let v = 0; for (const b of beats) { const d = (t - b) / len; if (d >= -0.25 && d < 1) v = Math.max(v, d < 0 ? smooth(1 + d * 4) : 1 - smooth(d)); } return v; };

  // 3. frame by frame, everything eased through its own spring
  const blinkR = rng(21), glanceR = rng(8), dur = N / FPS;
  const blinks = []; for (let t = 1.4; t < dur; t += 2.2 + blinkR() * 2.4) blinks.push(t);
  const glances = []; { let t = 0, v = 0; while (t < dur) { glances.push({ t, v }); t += 1.1 + glanceR() * 1.8; v = (glanceR() - 0.5) * 0.7; } }
  const SLIDE = 0.32, POCKET = { L: { x: 419, y: 872 }, R: { x: 781, y: 872 } };
  const paperAt = (t) => { let k = 0; while (k + 1 < cues.paper.length && cues.paper[k + 1].t <= t) k++; const cur = cues.paper[k], before = cues.paper[k - 1], p = clamp((t - cur.t) / SLIDE);
    if (before && p < 1) { if (cur.pose === "pockets") return { paper: before.pose, shift: smooth(p) * 800 }; if (before.pose === "pockets") return { paper: cur.pose, shift: (1 - smooth(p)) * 800 }; }
    return { paper: cur.pose, shift: 0 }; };

  const F = { browL: 0, browR: 0, browTilt: 0, lid: 0.14, eyeScale: 1, pupil: 1, squint: 0, look: 0, lookY: 0, blush: 0, ant: 0, tilt: 0 };
  const K = { browL: 0.3, browR: 0.3, browTilt: 0.28, lid: 0.4, eyeScale: 0.34, pupil: 0.34, squint: 0.3, look: 0.34, lookY: 0.3, blush: 0.12, ant: 0.2, tilt: 0.14 };
  const mouth = { ...shape("smirk") }, arm = { L: { ...POCKET.L }, R: { ...POCKET.R } };
  let shrug = 0, lean = 0, cam = 1, antL = 0, antR = 0, vL = 0, vR = 0, lastEmote = "neutral", emoteSince = -9, hop = null, prevTilt = 0, symbolSince = -9, symbol = null, lidWink = 0;
  const frames = [];

  for (let i = 0; i < N; i++) {
    const tv = i / FPS, t = tAudio(i), { paper, shift } = paperAt(t);
    const papery = paper !== "pockets" && shift < 400;
    const cur = sents.find((s) => t >= s.s - 0.12 && t <= s.e + 0.1), prev = [...sents].reverse().find((s) => s.e + 0.1 < t), next = sents.find((s) => s.s - 0.12 > t);
    const pausing = !cur && prev && prev.react && t > prev.e + 0.14 && (!next || t < next.s - 0.2);
    let name = cur ? cur.emote : pausing ? prev.react : "neutral";
    if (deadAt(t)) name = "deadpan";
    if (paper === "holes" && shift < 400) name = "sly"; if (paper === "over" && shift < 400) name = "serious";
    const pin = (cues.acting || []).find((o) => o.exact && t >= o.from && t < o.to);        // an editor entry pins the acting for exactly its own span
    if (pin && pin.emote && !(papery && paper !== "pockets")) name = pin.emote;
    const em = EMOTES[name] || EMOTES.neutral, gest = papery ? GESTURES.pockets : pin && pin.gesture ? GESTURES[pin.gesture] || GESTURES.pockets : cur ? GESTURES[cur.gesture] || GESTURES.pockets : pausing && name === "skeptical" ? GESTURES.shrug : GESTURES.pockets;
    if (name !== lastEmote) { lastEmote = name; emoteSince = tv; if (em.symbol) { symbol = em.symbol; symbolSince = tv; } if ((name === "grin" || name === "surprised" || name === "laugh") && !hop) hop = tv; if (R() < 0.6) blinks.push(tv + 0.04); }

    // face channels
    const beat = pulse(t, 0.3), speaking = !!lip.shapeAt(t + 0.035);
    let glance = 0; { let k = 0; while (k + 1 < glances.length && glances[k + 1].t <= tv) k++; const a = glances[Math.max(0, k - 1)].v, b = glances[k].v; glance = a + (b - a) * smooth(clamp((tv - glances[k].t) / 0.18)); }
    let look = (em.look ?? 0) + (em.look === undefined ? glance : glance * 0.25);
    if (paper === "holes" && shift < 400) look = tv < 0.42 ? -0.9 * smooth(clamp(tv / 0.14)) : tv < 0.8 ? -0.9 + 1.8 * smooth(clamp((tv - 0.42) / 0.14)) : 0.9 * (1 - smooth(clamp((tv - 0.8) / 0.14)));
    if (paper === "over" && shift < 400) look = 0.55 * Math.sin(2 * Math.PI * 0.75 * tv);
    const goal = { browL: (em.browL ?? 0) + 0.45 * beat, browR: (em.browR ?? 0) + 0.45 * beat, browTilt: em.browTilt ?? 0, lid: em.lid ?? 0.14, eyeScale: (em.eyeScale ?? 1) + 0.05 * beat,
      pupil: em.pupil ?? 1, squint: em.squint ?? 0, look, lookY: em.lookY ?? 0, blush: em.blush ?? 0, ant: em.ant ?? 0, tilt: (em.tilt ?? 0) + (cur ? cur.side * 2.4 : 0) };
    for (const k of Object.keys(F)) F[k] += (goal[k] - F[k]) * K[k];
    let lid = F.lid; for (const b of blinks) { const d = (tv - b) * FPS; if (d >= 0 && d < 6) lid = Math.max(lid, d < 2 ? (d + 1) / 2 : 1 - (d - 2) / 4); }
    lidWink += ((em.lidR ?? 0) - lidWink) * 0.4;

    // mouth: speech shapes nudged by the feeling, the feeling's own mouth when silent
    const sp = lip.shapeAt(t + 0.035); let mg, mr;
    if (sp && t >= cues.from) { mg = { w: sp.w, smile: sp.smile + (em.talk?.smile ?? 0), jaw: sp.jaw, smirk: em.talk?.smirk ?? 0.35, tongue: sp.tongue }; mr = { w: 0.5, smile: 0.5, jaw: sp.viseme === "M" ? 0.85 : 0.62, smirk: 0.3, tongue: 0.6 }; }
    else { const nx = lip.segs.find((g) => g.s > t), ls = [...lip.segs].reverse().find((g) => g.e <= t), mid = nx && ls && nx.s - t < 0.28 && t - ls.e < 0.28;
      mg = mid ? { w: 0.84, smile: 0.18 + (em.talk?.smile ?? 0), jaw: 0.03, smirk: em.talk?.smirk ?? 0.35, tongue: 0 } : shape(em.mouth ?? "smirk");
      mr = mid ? { w: 0.5, smile: 0.5, jaw: 0.7, smirk: 0.3, tongue: 0.6 } : { w: 0.22, smile: 0.22, jaw: 0.5, smirk: 0.18, tongue: 0.6 }; }
    for (const k of Object.keys(mouth)) mouth[k] += ((mg[k] ?? 0) - mouth[k]) * mr[k];

    // arms and shoulders
    const beatHand = 12 * pulse(t, 0.22), wob = gest.wave ? 30 * Math.sin(2 * Math.PI * 2.6 * tv) : 0;
    const tL = gest.armL ? { x: gest.armL.x, y: gest.armL.y + beatHand } : POCKET.L, tR = gest.armR ? { x: gest.armR.x + wob, y: gest.armR.y + beatHand - Math.abs(wob) * 0.2 } : POCKET.R;
    for (const [k, tg] of [["L", tL], ["R", tR]]) { arm[k].x += (tg.x - arm[k].x) * 0.2; arm[k].y += (tg.y - arm[k].y) * 0.2; }
    shrug += ((gest.shrug ?? 0) - shrug) * 0.25;
    const out = (k) => Math.hypot(arm[k].x - POCKET[k].x, arm[k].y - POCKET[k].y) > 14;
    const armL = out("L") ? { x: arm.L.x, y: arm.L.y, front: !!gest.armL?.front && arm.L.y < 760 } : null, armR = out("R") ? { x: arm.R.x, y: arm.R.y, front: !!gest.armR?.front && arm.R.y < 760 } : null;

    // body: sway, lean into each sentence, a hop on happy beats, a nod on stressed words
    lean += ((cur ? cur.side * 1.6 : 0) - lean) * 0.06;
    const sway = lean + 0.9 * Math.sin(2 * Math.PI * 0.17 * tv);
    let bounce = 2.5 * mouth.jaw, squash = 1;
    if (hop !== null) { const p = (tv - hop) / 0.34; if (p >= 1.5) hop = null; else if (p < 1) { bounce += 30 * 4 * p * (1 - p); squash = 1 + 0.04 * Math.sin(Math.PI * p); } else { squash = 1 - 0.06 * Math.sin(Math.PI * (p - 1) * 2); } }
    const nod = 9 * pulse(t, 0.26), tilt = F.tilt + 1.2 * Math.sin(2 * Math.PI * 0.13 * tv + 1) - 1.4 * mouth.jaw;
    const bob = -6 * mouth.jaw + nod + 2.2 * Math.sin(2 * Math.PI * 0.27 * tv);

    // antennae trail the head and wobble after every nod and hop
    const push = (tilt - prevTilt) * 2.2 + (beat > 0.9 ? 1.6 : 0); prevTilt = tilt;
    vL += (F.ant - antL) * 0.16 - vL * 0.24 - push; antL += vL; vR += (F.ant - antR) * 0.16 - vR * 0.24 + push; antR += vR;

    // little extras: a symbol that pops, a sweat drop that runs, a slow push-in while he reacts
    const sAge = tv - symbolSince, symbolPop = sAge < 1.1 ? (sAge < 0.12 ? 1.25 * smooth(sAge / 0.12) : sAge < 0.2 ? 1.25 - 0.25 * (sAge - 0.12) / 0.08 : sAge > 0.9 ? 1 - smooth((sAge - 0.9) / 0.2) : 1) : 0;
    const sweat = em.sweat ? ((tv - emoteSince) / 1.3) % 1 : 0;
    cam += (((pausing && prev.gap >= 1.0) || deadAt(t) ? 1.16 : papery ? 1.06 : 1) - cam) * 0.06;

    frames.push({ e: { lid, lidR: lidWink > 0.05 ? Math.max(lid, lidWink) : undefined, look: F.look, lookY: F.lookY, browL: F.browL, browR: F.browR, browTilt: F.browTilt, eyeScale: F.eyeScale, pupil: F.pupil,
        squint: F.squint, blush: F.blush, antL, antR, sweat, symbol: symbolPop > 0.02 ? symbol : null, symbolPop, m: { ...mouth } },
      paper, shift, armL, armR, shrug, sway, bounce, squash, bob, tilt, cam, emote: name, gesture: cur ? cur.gesture : "pockets", speaking });
  }
  return { frames, sents, beats };
}

module.exports = { direct, sentences };
