#!/usr/bin/env python3
"""Cut the chosen take of every line into one voice track and write the word timeline the animation is timed to.

usage: voice_edit.py edit.json takes_dir requests_dir out.wav out_timeline.json
edit.json: { "lead": s, "lines": [ { "take": "a2g", "turn": index of the line inside that take's request when it is not the same as here, "request": "…a2.json", "tempo": 1.05, "maxpause": 0.35,
             "pre": s of sound kept before the first word (a gasp, a sigh), "gain": dB offset, "gap": s of silence after } ] }
Pauses longer than maxpause inside a line are shortened; tempo is applied with rubberband (pitch kept).
"""
import json, sys, os, subprocess, tempfile, wave
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from voice_measure import measure, load, rms_db, norm
import difflib

SR = 48000
def env_db(x, sr, hop=0.01):
    H = int(sr * hop); n = len(x) // H
    return np.array([rms_db(x[i * H:(i + 1) * H]) for i in range(n)]), hop

def write(path, x, sr):
    with wave.open(path, "w") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr)
        f.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

def repair(words):
    """The recogniser sometimes returns a run of words with no usable times (zero length, or starting before the word
    before them). Spread such a run over the gap it sits in, in proportion to the words' lengths."""
    out = [dict(w) for w in words]; g = 0; i = 0; fixed = 0
    while i < len(out):
        w = out[i]
        if w["start_ms"] < g - 60 or w["end_ms"] - w["start_ms"] < 20:
            j = i
            while j < len(out) and (out[j]["start_ms"] < g - 60 or out[j]["end_ms"] - out[j]["start_ms"] < 20) and not out[j]["end_ms"] > g + 200: j += 1
            if j < len(out) and out[j]["start_ms"] < g - 60 and out[j]["end_ms"] > g + 200: end = out[j]["end_ms"]; j += 1      # the run's last word kept a true end
            else: end = out[j]["start_ms"] if j < len(out) else g + 300 * (j - i)
            run = out[i:j]; tot = sum(len(q["text"]) + 1 for q in run); a = g
            for q in run: d = (end - g) * (len(q["text"]) + 1) / tot; q["start_ms"] = int(a); q["end_ms"] = int(a + d); a += d
            fixed += len(run); g = end; i = j
        else: g = w["end_ms"]; i += 1
    return out, fixed

def map_words(script, heard):
    """Times for every script word, also when the recogniser merged two words into one or split one in two:
    matching words keep their own times, the others share the span of the heard words they stand against."""
    a = [norm(w) for w in script]; b = [norm(h["text"]) for h in heard]; out = [None] * len(script)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1): out[i1 + k] = (heard[j1 + k]["start_ms"], heard[j1 + k]["end_ms"])
        elif i2 > i1:
            if j2 > j1: s0, e0 = heard[j1]["start_ms"], heard[j2 - 1]["end_ms"]
            else: s0 = heard[j1 - 1]["end_ms"] if j1 > 0 else heard[0]["start_ms"]; e0 = heard[j1]["start_ms"] if j1 < len(heard) else s0 + 250 * (i2 - i1)
            tot = sum(len(a[i]) + 1 for i in range(i1, i2)); t = s0
            for i in range(i1, i2): d = (e0 - s0) * (len(a[i]) + 1) / tot; out[i] = (int(t), int(t + d)); t += d
    return out

def main(cfg_path, takes, reqs, out_wav, out_tl):
    cfg = json.load(open(cfg_path)); cache = {}
    t = cfg.get("lead", 0.0); pieces = [np.zeros(int(t * SR), np.float32)]; lines = []
    for n, L in enumerate(cfg["lines"]):
        take = L["take"]
        if take not in cache:
            res, _ = measure(f"{takes}/{take}.wav", f"{takes}/{take}.json", f"{reqs}/{L['request']}")
            x, sr = load(f"{takes}/{take}.wav"); ww, nfix = repair(json.load(open(f"{takes}/{take}.json"))["words"]); cache[take] = (res, x, sr, ww)
            if nfix: print(f"  take {take}: {nfix} word times repaired")
        res, x, sr, words = cache[take]; r = res[L.get("turn", n)]
        if r["heard"] != r["words"]: print(f"  ! line {n+1} take {take}: heard {r['heard']} of {r['words']} words (times shared out)")
        e, hop = env_db(x, sr)
        # refine the line's bounds on the energy envelope: back to the onset, forward to the release
        i0 = int(r["start"] / hop); i1 = min(len(e) - 1, int(r["end"] / hop))
        while i0 > 0 and e[i0] > -42 and r["start"] - i0 * hop < 0.25: i0 -= 1
        while i0 < i1 and e[i0] < -42: i0 += 1
        while i1 < len(e) - 1 and e[i1] > -42 and i1 * hop - r["end"] < 0.45: i1 += 1
        while i1 > i0 and e[i1] < -42: i1 -= 1
        a = max(0.0, i0 * hop - 0.03 - L.get("pre", 0.0)); b = min(len(x) / sr, (i1 + 1) * hop + 0.06)
        seg = x[int(a * sr):int(b * sr)].copy(); se = e[int(a / hop):int(b / hop)]
        # shorten long pauses; keep a map from source time to output time
        keep = np.ones(len(seg), bool); cuts = []
        mp = L.get("maxpause")
        if mp:
            quiet = se < -38; j = 0
            while j < len(quiet):
                if quiet[j]:
                    k = j
                    while k < len(quiet) and quiet[k]: k += 1
                    d = (k - j) * hop
                    if d > mp and j > 0 and k < len(quiet):
                        c0 = j * hop + mp / 2; c1 = k * hop - mp / 2
                        keep[int(c0 * sr):int(c1 * sr)] = False; cuts.append((c0, c1))
                    j = k
                else: j += 1
        seg = seg[keep]
        fade = int(0.006 * sr); seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
        tempo = L.get("tempo", 1.0)
        with tempfile.TemporaryDirectory() as d:
            write(f"{d}/i.wav", seg, sr)
            af = (f"rubberband=tempo={tempo}:formant=preserved," if abs(tempo - 1) > 1e-3 else "") + f"aresample={SR}"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{d}/i.wav", "-af", af, "-ac", "1", f"{d}/o.wav"], check=True)
            y, _ = load(f"{d}/o.wav")
        ye, _ = env_db(y, SR, 0.05); act = ye[ye > -40]
        level = 10 * np.log10(np.mean(10 ** (act / 10))) if len(act) else -30
        y = y * 10 ** ((cfg.get("level", -19.0) + L.get("gain", 0.0) - level) / 20)
        def m(ts):  # source seconds -> output seconds on the final timeline
            u = ts - a
            for c0, c1 in cuts:
                if ts - a >= c1: u -= (c1 - c0)
                elif ts - a > c0: u -= (ts - a - c0)
            return t + max(0.0, u) / tempo
        ws = [dict(w=sw, s=round(m(a0 / 1000), 3), e=round(m(e0 / 1000), 3)) for sw, (a0, e0) in zip(r["script"], map_words(r["script"], [words[j] for j in r["widx"]]))]
        lines.append(dict(n=n + 1, take=take, t0=round(t, 3), t1=round(t + len(y) / SR, 3), speech0=round(m(i0 * hop), 3), words=ws))
        print(f"line {n+1:2d} {take} src {r['dur']:.2f}s -> {len(y)/SR:.2f}s at {t:6.2f}  cuts {sum(c1-c0 for c0,c1 in cuts):.2f}s tempo {tempo} level {level:.1f}")
        pieces.append(y); t += len(y) / SR
        g = L.get("gap", 0.25); pieces.append(np.zeros(int(g * SR), np.float32)); t += int(g * SR) / SR
    out = np.concatenate(pieces); write(out_wav, out, SR)
    json.dump(dict(fps=30, voice_end=round(t, 3), lines=lines), open(out_tl, "w"), ensure_ascii=False, indent=1)
    print(f"voice track {len(out)/SR:.2f}s")

if __name__ == "__main__":
    main(*sys.argv[1:6])
