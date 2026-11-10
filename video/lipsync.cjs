// Turns words with timestamps into mouth shapes over time.
//   words: [{ s, e, t }] seconds and text        level(t): 0..1 loudness of the audio at t
// Each word is looked up in the CMU pronouncing dictionary (letter rules for anything missing), its
// phonemes are spread across the part of the word where there is actually sound, and each phoneme maps
// to one of nine mouth shapes. shapeAt(t) returns the target { w, smile, jaw, tongue } or null in silence.

const VISEME = {
  A: { w: 0.82, smile: 0.16, jaw: 1.0 },     // AA AE AH: wide open
  E: { w: 0.98, smile: 0.22, jaw: 0.5 },     // EH IH IY Y: spread
  O: { w: 0.6, smile: 0.06, jaw: 0.85 },     // AO OW: round and open
  U: { w: 0.46, smile: 0.04, jaw: 0.36 },    // UW UH W: small and pursed
  R: { w: 0.62, smile: 0.08, jaw: 0.34 },    // ER R
  M: { w: 0.8, smile: 0.1, jaw: 0 },         // M B P: lips together
  F: { w: 0.76, smile: 0.14, jaw: 0.1 },     // F V: teeth on the lower lip
  L: { w: 0.8, smile: 0.16, jaw: 0.46, tongue: 1 }, // L TH DH: tongue up
  C: { w: 0.84, smile: 0.18, jaw: 0.22 },    // every other consonant: nearly closed
};
// phoneme -> [viseme, weight] sequence; diphthongs glide between two shapes
const PH = {
  AA: [["A", 1]], AE: [["A", 1]], AH: [["A", 1]], AY: [["A", 0.6], ["E", 0.4]], AW: [["A", 0.6], ["U", 0.4]],
  EH: [["E", 1]], EY: [["E", 1]], IH: [["E", 1]], IY: [["E", 1]], Y: [["E", 1]],
  AO: [["O", 1]], OW: [["O", 0.6], ["U", 0.4]], OY: [["O", 0.6], ["E", 0.4]],
  UW: [["U", 1]], UH: [["U", 1]], W: [["U", 1]], ER: [["R", 1]], R: [["R", 1]],
  M: [["M", 1]], B: [["M", 1]], P: [["M", 1]], F: [["F", 1]], V: [["F", 1]], L: [["L", 1]], TH: [["L", 1]], DH: [["L", 1]],
};
const STOPS = new Set(["P", "B", "T", "D", "K", "G"]);
const isVowel = (p) => /^[AEIOU]/.test(p);

const ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
function int2words(n) {
  if (n < 20) return [ONES[n]];
  if (n < 100) return [TENS[Math.floor(n / 10)], ...(n % 10 ? [ONES[n % 10]] : [])];
  if (n < 1000) return [ONES[Math.floor(n / 100)], "hundred", ...(n % 100 ? int2words(n % 100) : [])];
  if (n < 1e6) return [...int2words(Math.floor(n / 1000)), "thousand", ...(n % 1000 ? int2words(n % 1000) : [])];
  return String(n).split("").map((d) => ONES[+d]);
}
// "9.8" -> nine point eight, "2019" -> twenty nineteen, "40,000" -> forty thousand, "$400" -> four hundred dollars
function spoken(token) {
  let t = token.replace(/[’]/g, "'").replace(/^[^A-Za-z0-9$]+|[^A-Za-z0-9%]+$/g, "");
  if (!t) return [];
  if (/^\$?[\d,]+(\.\d+)*%?$/.test(t)) {
    const dollars = t.startsWith("$"), parts = t.replace(/[$,%]/g, "").split(".");
    const whole = (p) => (/^(19|20)\d\d$/.test(p) ? [...int2words(+p.slice(0, 2)), ...(+p.slice(2) ? int2words(+p.slice(2)) : ["hundred"])] : int2words(+p));
    return [...parts.flatMap((p, i) => (i ? ["point", ...whole(p)] : whole(p))), ...(dollars ? ["dollars"] : [])];
  }
  return t.split(/[-\/]/).filter(Boolean).map((x) => x.toLowerCase());
}
// Rough letter-to-sound for words the dictionary does not have.
function guess(word) {
  const out = []; let w = word.replace(/[^a-z]/g, "");
  const di = { th: "TH", sh: "SH", ch: "CH", ph: "F", oo: "UW", ee: "IY", ea: "IY", ou: "AW", ow: "OW", ai: "EY", ay: "EY", oa: "OW", ck: "K", ng: "NG", qu: "K" };
  const one = { a: "AE", e: "EH", i: "IH", o: "AA", u: "AH", y: "IY", b: "B", c: "K", d: "D", f: "F", g: "G", h: "HH", j: "JH", k: "K", l: "L", m: "M", n: "N", p: "P", q: "K", r: "R", s: "S", t: "T", v: "V", w: "W", x: "K", z: "Z" };
  for (let i = 0; i < w.length; i++) { const d = di[w.slice(i, i + 2)]; if (d) { out.push(d); i++; } else if (!(w[i] === "e" && i === w.length - 1 && out.length)) out.push(one[w[i]]); }
  return out.filter(Boolean);
}

async function build(words, level, opts = {}) {
  const { dictionary } = await import("cmu-pronouncing-dictionary");
  const HOP = 0.005, peakWin = [];
  for (const w of words) for (let t = w.s; t < w.e; t += 0.02) peakWin.push(level(t));
  const peak = peakWin.sort((a, b) => a - b)[Math.floor(peakWin.length * 0.95)] || 1, thr = peak * (opts.threshold ?? 0.1);
  const loud = (t) => Math.min(1.3, level(t) / peak);
  const segs = [], missing = [];
  words.forEach((word, i) => {
    // The transcript's times are rounded to 100 ms, so find where this word actually sounds.
    const lo = Math.max(word.s - 0.1, i ? (words[i - 1].e + word.s) / 2 : -1), hi = Math.min(word.e + 0.1, i + 1 < words.length ? (word.e + words[i + 1].s) / 2 : 1e9);
    let s = null, e = null;
    for (let t = lo; t <= hi; t += HOP) if (level(t) > thr) { if (s === null) s = t; e = t; }
    if (s === null || e - s < 0.04) { s = word.s; e = word.e; }
    const phones = spoken(word.t).flatMap((tok) => {
      const hit = dictionary[tok] || dictionary[tok.replace(/'s$/, "")];
      if (hit) return hit.split(" ");
      if (/^[a-z]{1,5}$/.test(tok) && tok === tok && word.t.replace(/[^A-Za-z]/g, "") === word.t.replace(/[^A-Z]/g, "")) return tok.split("").flatMap((ch) => (dictionary[ch] || "").split(" ")).filter(Boolean);
      missing.push(tok); return guess(tok);
    });
    if (!phones.length) return;
    const parts = phones.flatMap((p) => {
      const base = p.replace(/\d/, ""), stress = p.slice(-1);
      const weight = isVowel(base) ? (stress === "1" ? 2.2 : stress === "2" ? 1.8 : 1.3) : STOPS.has(base) ? 0.7 : 1;
      return (PH[base] || [["C", 1]]).map(([v, f]) => ({ v, weight: weight * f }));
    });
    const total = parts.reduce((a, p) => a + p.weight, 0); let t = s;
    for (const p of parts) { const d = (e - s) * p.weight / total; segs.push({ s: t, e: t + d, v: p.v }); t += d; }
  });
  const shapeAt = (t) => {
    let a = 0, b = segs.length - 1, k = -1;
    while (a <= b) { const m = (a + b) >> 1; if (segs[m].s <= t) { k = m; a = m + 1; } else b = m - 1; }
    if (k < 0 || t > segs[k].e + 0.02 || level(t) < thr * 0.6) return null;
    const v = VISEME[segs[k].v];
    // Loudness scales how far the jaw goes, so shouted vowels open wider than mumbled ones.
    return { w: v.w, smile: v.smile, jaw: v.jaw * Math.min(1.1, 0.5 + 0.62 * loud(t)), tongue: v.tongue || 0, viseme: segs[k].v };
  };
  return { shapeAt, segs, missing: [...new Set(missing)] };
}

module.exports = { build, VISEME, spoken, guess };
