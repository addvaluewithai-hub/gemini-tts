#!/usr/bin/env python3
"""Measure a voice take line by line: pace, pitch range, loudness range.

usage: voice_measure.py take.wav take.transcript.json request.json [--json out.json]
The request's turns are the script lines; the transcript's words are aligned to them with difflib,
so a misheard or merged word does not shift the following lines.
"""
import json, sys, wave, re, difflib
import numpy as np

def norm(w):
    w = re.sub(r"[ً-ْـ]", "", w)
    w = re.sub(r"[^\w]", "", w)
    for a, b in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ة", "ه"), ("ى", "ي"), ("ث", "ت"), ("ض", "ظ"), ("ذ", "ز"), ("ء", "")):
        w = w.replace(a, b)
    return w.lower()

def load(path):
    with wave.open(path) as f:
        sr = f.getframerate(); n = f.getnframes(); ch = f.getnchannels()
        x = np.frombuffer(f.readframes(n), dtype=np.int16).astype(np.float32) / 32768
    if ch > 1: x = x.reshape(-1, ch).mean(axis=1)
    return x, sr

def f0_track(x, sr, hop=0.01, win=0.04, fmin=90, fmax=520):
    """Autocorrelation pitch per 10 ms; returns Hz (0 where unvoiced)."""
    H, W = int(sr * hop), int(sr * win)
    lo, hi = int(sr / fmax), int(sr / fmin)
    out = []
    for i in range(0, len(x) - W, H):
        s = x[i:i + W] - np.mean(x[i:i + W])
        e = float(np.dot(s, s))
        if e < 1e-3 * W * 0.02: out.append(0.0); continue
        ac = np.correlate(s, s, "full")[W - 1:]
        ac = ac / (ac[0] + 1e-9)
        seg = ac[lo:hi]
        k = int(np.argmax(seg)); v = float(seg[k])
        out.append(sr / (k + lo) if v > 0.45 else 0.0)
    return np.array(out), hop

def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x * x)) + 1e-9)

def measure(wav, tr, req):
    x, sr = load(wav)
    words = json.load(open(tr))["words"]
    turns = json.load(open(req))["turns"]
    lines = [[w for w in re.sub(r"<[^>]+>", " ", t["text"]).split() if norm(w)] for t in turns]
    flat = [(li, w) for li, ws in enumerate(lines) for w in ws]
    a = [norm(w) for _, w in flat]; b = [norm(w["text"]) for w in words]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    owner = [None] * len(words)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1): owner[j1 + k] = flat[i1 + k][0]
        elif tag in ("replace", "insert"):
            for j in range(j1, j2):
                i = min(i1 + (j - j1), max(i1, i2 - 1), len(flat) - 1)
                owner[j] = flat[i][0]
    # fill gaps forward
    last = 0
    for j in range(len(owner)):
        if owner[j] is None: owner[j] = last
        last = owner[j]
    f0, hop = f0_track(x, sr)
    res = []
    for li, ws in enumerate(lines):
        idx = [j for j, o in enumerate(owner) if o == li]
        if not idx: res.append(None); continue
        s, e = words[idx[0]]["start_ms"] / 1000, words[idx[-1]]["end_ms"] / 1000
        seg = x[int(s * sr):int(e * sr)]
        f = f0[int(s / hop):int(e / hop)]; f = f[f > 0]
        fr = np.array([rms_db(seg[i:i + int(sr * .05)]) for i in range(0, max(1, len(seg) - int(sr * .05)), int(sr * .05))])
        fr = fr[fr > -45]
        st = 12 * np.log2(f / 100) if len(f) else np.array([0.0])
        res.append(dict(widx=idx, script=ws, line=li + 1, start=round(s, 2), end=round(e, 2), dur=round(e - s, 2), words=len(ws), heard=len(idx),
                        wps=round(len(ws) / max(e - s, .01), 2),
                        f0_med=round(float(np.median(f)) if len(f) else 0, 0),
                        f0_range_st=round(float(np.percentile(st, 92) - np.percentile(st, 8)), 1),
                        loud_db=round(float(rms_db(seg)), 1),
                        loud_range_db=round(float(np.percentile(fr, 95) - np.percentile(fr, 10)) if len(fr) else 0, 1),
                        text=" ".join(w["text"] for w in (words[j] for j in idx))))
    return res, len(x) / sr

if __name__ == "__main__":
    res, total = measure(*sys.argv[1:4])
    print(f"total {total:.2f}s")
    print(" # start   end   dur  w/s  f0med  f0rng(st) loud  lrng  heard")
    for r in res:
        if r: print(f"{r['line']:2d} {r['start']:6.2f} {r['end']:6.2f} {r['dur']:5.2f} {r['wps']:4.2f} {r['f0_med']:5.0f}  {r['f0_range_st']:6.1f}  {r['loud_db']:6.1f} {r['loud_range_db']:5.1f}  {r['heard']}/{r['words']} {r['text']}")
    meds = np.array([r["f0_med"] for r in res if r]); louds = np.array([r["loud_db"] for r in res if r]); wps = np.array([r["wps"] for r in res if r])
    print(f"across lines: f0 median spread {12*np.log2(meds.max()/meds.min()):.1f} st, loudness spread {louds.max()-louds.min():.1f} dB, pace {wps.min():.2f}-{wps.max():.2f} w/s")
    if "--json" in sys.argv: json.dump(res, open(sys.argv[sys.argv.index("--json") + 1], "w"), ensure_ascii=False, indent=1)
