#!/usr/bin/env python3
"""Episode 3 (Why do astronauts float?): the whole soundtrack and the timing file the picture reads.

  python3 audio/ep03_sound.py out/ep03-mix.wav --voices audio/ep03 --shared audio/voice --cues out/ep03.json
  python3 audio/ep03_sound.py out/ep03-mix.wav --voices audio/ep03 --shared audio/voice --cues out/ep03.json --placeholder

--placeholder builds everything without the recorded takes: each line's words get estimated times from the request
text (about 2.7 words a second after tightening) and a stand-in voice (shaped noise) so the loudness and the mouths
work. The cue file has exactly the keys the real one will have; when the takes arrive, drop the flag.

Timeline: the cold open is fixed (0 to RS). Report A runs from RS and is cut on its last word ("They are...").
The interruption follows (Crowe checks the plush toys' teeth); its length comes from his three lines. Report B starts on
the shelf ("...falling.") and runs to "Peek out."; the tag follows and the Short ends on it. Speech is never sped up
(tempo 1.0); silences are tightened as in Episode 1. Every effect is synthesized.
"""
import argparse, json, os, re, subprocess, tempfile
import numpy as np
from scipy import signal
from scipy.io import wavfile

ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("--voices", required=True)
ap.add_argument("--cues", required=True); ap.add_argument("--shared", default="audio/voice"); ap.add_argument("--fps", type=int, default=30); ap.add_argument("--placeholder", action="store_true")
a = ap.parse_args()
SR = 48000
rng = np.random.default_rng(12)
tx = lambda n: np.arange(n) / SR
def butter(kind, f, order=2): return signal.butter(order, np.array(f) / (SR / 2) if np.ndim(f) else f / (SR / 2), kind)
lp = lambda x, f: signal.lfilter(*butter("low", f), x)
hp = lambda x, f: signal.lfilter(*butter("high", f), x)
bp = lambda x, lo, hi: signal.lfilter(*butter("band", [lo, hi]), x)
noise = lambda n: rng.standard_normal(n)
norm = lambda x, peak=0.7: x / (np.abs(x).max() + 1e-9) * peak
def fades(x, i=0.008, o=0.03):
    x = x.copy(); n1, n2 = max(1, min(len(x) // 2, int(i * SR))), max(1, min(len(x) // 2, int(o * SR))); x[:n1] *= np.linspace(0, 1, n1); x[-n2:] *= np.linspace(1, 0, n2); return x

# ---------------------------------------------------------------- voices
def fake_take(name):
    """Estimated word times from the request text, and a stand-in voice: shaped noise, one burst a syllable."""
    text = json.load(open(os.path.join(a.voices, name + ".json")))["turns"][0]["text"]
    words, t = [], 0.3
    for tok in re.sub(r"<short pause>", " <P> ", re.sub(r"<long pause>", " <L> ", text)).split():
        if tok == "<P>": t += 0.45; continue
        if tok == "<L>": t += 1.0; continue
        core = re.sub(r"[^A-Za-z0-9']", "", tok)
        if not core: continue
        if tok.startswith("..."): t += 0.35
        d = 0.08 + 0.047 * len(core)
        words.append((t, t + d, tok.strip(".") if tok.startswith("...") else tok)); t += d + 0.06
        if re.search(r"\.\.\.$", tok): t += 0.4
        elif re.search(r"[.!?:]$", tok): t += 0.3
        elif tok.endswith(","): t += 0.15
    x = np.zeros(int((t + 0.4) * SR))
    for s, e, w in words:
        i, j = int(s * SR), int(e * SR); n = j - i; syl = max(1, len(re.findall(r"[aeiouy]+", w.lower())))
        env = np.abs(np.sin(np.pi * syl * np.arange(n) / n)) ** 0.6
        x[i:j] += bp(noise(n), 200, 3000) * env * 0.5
    return x, words

def take(name, folder=None):
    folder = folder or a.voices
    if a.placeholder and folder == a.voices: return fake_take(name)
    sr, x = wavfile.read(os.path.join(folder, name + ".wav")); x = x.astype(np.float64) / 32768.0
    x = signal.resample_poly(x if x.ndim == 1 else x.mean(axis=1), SR, sr)
    words = json.load(open(os.path.join(folder, name + ".words.json")))["words"]
    return x, [(w["start_ms"] / 1000, w["end_ms"] / 1000, w["text"]) for w in words]

def tighten(x, words, keep=0.2, over=0.3, lead=0.06, tail=0.12):
    """Cut the silence between words down to `keep` wherever it is longer than `over`; return audio and new word times."""
    parts, out_words, cursor = [], [], 0.0
    start = max(0.0, words[0][0] - lead)
    seg_start = start
    for i, (s, e, w) in enumerate(words):
        nxt = words[i + 1][0] if i + 1 < len(words) else None
        gap = (nxt - e) if nxt is not None else 0
        out_words.append([cursor + (s - seg_start), cursor + (e - seg_start), w])
        if nxt is None or gap > over:
            cut_end = e + (keep / 2 if nxt is not None else tail)
            piece = fades(x[int(seg_start * SR): int(min(len(x) / SR, cut_end) * SR)], 0.004, 0.012)
            parts.append(piece); cursor += len(piece) / SR
            if nxt is not None: seg_start = nxt - keep / 2
    return np.concatenate(parts), out_words

def prepared(name, pick=None, folder=None, **kw):
    x, words = take(name, folder)
    if pick: words = [w for i, w in enumerate(words) if pick(i, len(words))]
    return tighten(x, words, **kw)                    # tempo 1.0: speech is never sped up

clean = lambda s: re.sub(r"[^a-z0-9']", "", s.lower().replace("’", "'"))
def find(rw, options, start=0, name=""):
    for seq in options.split("|"):
        seq = [clean(x) for x in seq.split()]
        for i in range(start, len(rw) - len(seq) + 1):
            if all(rw[i + j][2] == seq[j] for j in range(len(seq))): return i
    raise SystemExit(f"beat not found in {name}: {options}")

# ---- the takes and the timeline
RS = 11.3                                              # the cold open ends, report A starts (the prize stall)
repA, wA = prepared("reportA", keep=0.2, over=0.28)
cut = len(wA) - 1                                      # report A is cut right after its last word, "are"
IS = RS + 0.15 + wA[cut][1] + 0.04                     # the interruption starts: the detector beeps nearby
repA = repA[: int((wA[cut][1] + 0.04) * SR)]; repA = fades(repA, 0.004, 0.02)
cx_, cw_ = take("crowe")
groups = [[0, 1], [2, 3], [4], list(range(5, len(cw_)))] if len(cw_) >= 6 else [[i] for i in range(len(cw_))]
crowe_lines = [tighten(cx_, [cw_[i] for i in g], keep=0.3, over=0.45) for g in groups]   # "Not you." / "Not you." / "...You." / "These teeth... are sewn on."
I_NOT1 = IS + 2.35                                     # Crowe has walked in and raised the apple to the first plush
I_NOT2 = I_NOT1 + crowe_lines[0][1][-1][1] + 1.05      # a half step to the next one
I_YOU = I_NOT2 + crowe_lines[1][1][-1][1] + 1.75       # the close on Peek; then a whole step past him to the plush beside him
repB, wB = prepared("reportB", keep=0.2, over=0.28)
BS = I_YOU + crowe_lines[2][1][-1][1] + 1.45           # he tucks it under his arm and walks off; Peek exhales: "...falling."
RB = len(repB) / SR
TS = BS + RB + 0.8                                     # "Peek out." then he hops down; the tag starts
END = TS + 5.0
DUR = round(END, 2)
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N); T = np.arange(N) / SR
def place(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    x = x[: N - i] * gain; L[i:i + len(x)] += x * np.sqrt(0.5 * (1 - pan)); R[i:i + len(x)] += x * np.sqrt(0.5 * (1 + pan))
tracks = {k: np.zeros(N) for k in ("peek", "commander", "crowe")}
caption_words = []
FIX = {"mi": "miles", "mi.": "miles", "17000": "17,000", "250": "250"}   # speech-to-text mishearings, fixed in the captions
def fixw(w): return re.sub(r"(?i)\bpeak\b", "Peek", FIX.get(w.lower(), w))
def say(who, y, words, at, gain, line, treat=None):
    z = treat(y) if treat else y
    i = int(at * SR); n = min(len(z), N - i); tracks[who][i:i + n] += z[:n] * gain
    for s, e, w in words: caption_words.append({"t": round(at + s, 3), "e": round(at + e, 3), "w": fixw(w), "who": who, "line": line})

LINE_AT = {"float": 2.55, "uhoh": 8.25}
y, w = prepared("float", keep=0.25, over=0.35); say("peek", fades(norm(y, 0.78)), w, LINE_AT["float"], 1.0, 1)
y, w = prepared("p4-uhoh", folder=a.shared, keep=0.1); say("peek", fades(norm(y, 0.6)), w, LINE_AT["uhoh"], 1.0, 2)
say("peek", norm(repA, 0.8), wA[: cut + 1], RS + 0.15, 1.0, 10)
for k, at in enumerate((I_NOT1, I_NOT2, I_YOU)): say("crowe", fades(norm(crowe_lines[k][0], 0.8)), crowe_lines[k][1], at, 1.0, 20 + k)
say("peek", norm(repB, 0.72), wB, BS, 1.0, 30)
TAGLINE = TS + 1.35
if len(crowe_lines) > 3: say("crowe", fades(norm(crowe_lines[3][0], 0.8)), crowe_lines[3][1], TAGLINE, 1.0, 40)

# ---------------------------------------------------------------- beats (for the pictures)
A0, B0 = RS + 0.15, BS
rwA = [(A0 + s, A0 + e, clean(w)) for s, e, w in wA[: cut + 1]]
rwB = [(B0 + s, B0 + e, clean(w)) for s, e, w in wB]
beats, idx = {}, 0
orderA = [("report", "commander field"), ("news", "good news"), ("bad", "bad news"), ("theory", "theory"), ("upwhere", "up where"), ("zero", "zero gravity|zero"),
          ("checked", "i checked"), ("wrong", "wrong"), ("station", "their station"), ("pull", "and the pull"), ("almost", "almost the"), ("why", "so why"), ("secret", "here is|here's"), ("they", "they are")]
for key, seq in orderA:
    idx = find(rwA, seq, idx, "reportA"); beats[key] = round(rwA[idx][0], 3)
beats["higher"] = round(rwA[find(rwA, "the higher", 0, "reportA")][0], 3)
beats["cut"] = round(IS, 3)
idx = 0
orderB = [("falling", "falling"), ("alltime", "all the time"), ("ride", "on that ride"), ("nothing", "nothing pushed|nothing"), ("floated", "so i floated|i floated"),
          ("never", "their station is"), ("falls", "it falls"), ("sideways", "but it moves|it moves sideways"), ("missing", "keeps missing|it keeps"), ("moon", "just like"), ("lower", "only lower"),
          ("sum1", "so astronauts"), ("sum2", "they float because"), ("sum3", "together with"), ("question", "which raises"), ("wrench", "up there"), ("heavy", "so do heavy|do heavy"),
          ("out", "investigating"), ("peekout", "peek out")]
for key, seq in orderB:
    idx = find(rwB, seq, idx, "reportB"); beats[key] = round(rwB[idx][0], 3)
i_side = find(rwB, "sideways", find(rwB, "but it moves|it moves sideways", 0, "reportB"), "reportB")
beats["mph"] = round(rwB[i_side + 1][0], 3)
beats["end"] = round(rwB[-1][1], 3)
beats.update({"not1": round(I_NOT1, 3), "not2": round(I_NOT2, 3), "you": round(I_YOU, 3), "you_end": round(I_YOU + crowe_lines[2][1][-1][1], 3), "tagline": round(TAGLINE, 3)})

# ---------------------------------------------------------------- effects
def whoosh(d=0.6, lo=300, hi=3000):
    n = int(d * SR); t = tx(n); src = noise(n); out = np.zeros(n)
    for k, c in enumerate(np.geomspace(lo, hi, 6)): out += bp(src, c * 0.8, c * 1.2) * np.exp(-((t / d - (k + 1) / 7) ** 2) / 0.02)
    return out * np.sin(np.pi * t / d)
def thud(f=120, k=30, d=0.25):
    n = int(d * SR); t = tx(n); return np.sin(2 * np.pi * f * t * (1 - t)) * np.exp(-t * k) + bp(noise(n), 800, 5000) * np.exp(-t * 60) * 0.4
def boom(d=1.6):
    n = int(d * SR); t = tx(n)
    return (np.sin(2 * np.pi * 46 * t * (1 - 0.3 * t)) * np.exp(-t * 4.5) * 1.4 + bp(noise(n), 200, 5000) * np.exp(-t * 7) * (1 + 0.5 * np.sin(2 * np.pi * 19 * t)) * 0.9)
def clang():
    n = int(1.2 * SR); t = tx(n)
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in ((180, 5), (433, 6), (870, 7), (1630, 9))) + bp(noise(n), 500, 4000) * np.exp(-t * 40)
def pluck(f, d=0.5, bright=0.5):
    n = int(d * SR); t = tx(n); return (np.sin(2 * np.pi * f * t) + bright * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 14) + 0.2 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 22)) * np.exp(-t * 7) * np.minimum(1, t / 0.004)
def pop(f=900): n = int(0.09 * SR); t = tx(n); return np.sin(2 * np.pi * f * t * (1 + 3 * t)) * np.exp(-t * 45)
def beep(f=1760, d=0.07): n = int(d * SR); t = tx(n); return np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.003) * np.exp(-t * 20)
def heart():
    n = int(0.5 * SR); t = tx(n)
    return lp(np.sin(2 * np.pi * 48 * t) * np.exp(-t * 18) + 0.7 * np.sin(2 * np.pi * 42 * (t - 0.18)) * np.exp(-np.clip(t - 0.18, 0, None) * 18) * (t > 0.18), 200)
def crunch(d=0.16):
    n = int(d * SR); t = tx(n); return bp(noise(n), 1200, 7000) * np.exp(-t * 18) * (rng.random(n) < 0.25) * 2 + thud(260, 50, d) * 0.3
def glass(d=1.0):
    n = int(d * SR); t = tx(n); out = bp(noise(n), 3000, 11000) * np.exp(-t * 9) * 1.2
    for k in range(14):                                  # little tinkles of falling glass
        s = 0.05 + rng.random() * 0.8; i = int(s * SR); m = n - i; f = 2500 + rng.random() * 4000
        out[i:] += np.sin(2 * np.pi * f * tx(m)) * np.exp(-tx(m) * 40) * 0.25
    return out + thud(200, 40, d) * 0.5
def step(f=150): return thud(f, 60, 0.12) * 0.7 + bp(noise(int(0.12 * SR)), 1500, 5000) * np.exp(-tx(int(0.12 * SR)) * 50) * 0.3

# rain: none at the fair (a dry night); a low crowd and fairground murmur outdoors, silent under both report halves
amb = lp(noise(N), 900) * 0.5 + bp(noise(N), 300, 2500) * 0.25
ag = np.where(T < RS, 0.02, 0.0) + np.where((T >= IS) & (T < BS + 0.9), 0.012, 0.0) + np.where(T >= TS, 0.014, 0.0)
ag = lp(ag, 6); L += amb * ag; R += np.roll(amb, 2400) * ag

# ---- cold open: the ratchet at the top, the release, the fall, the brakes, the detector at the bottom, "Uh-oh", the title
for s_ in np.arange(0.05, 2.0, 0.32): place(thud(900, 90, 0.05) + bp(noise(int(0.05 * SR)), 2000, 6000)[: int(0.05 * SR)] * np.exp(-tx(int(0.05 * SR)) * 80) * 0.5, s_, 0.16, 0.2)   # click... click...
for s_ in (0.1, 0.62, 1.12, 1.6): place(heart(), s_, 0.65)
place(boom(0.6), 2.0, 0.45); place(clang(), 2.02, 0.2)                                   # CLUNK: the release
n = int(2.4 * SR); t = tx(n); place(bp(noise(n), 200, 3000) * np.clip(t / 0.4, 0, 1) * np.clip((2.4 - t) / 0.1, 0, 1) * (0.4 + 0.6 * t / 2.4), 2.0, 0.35)   # the wind of the fall
pn = int(2.2 * SR); pt = tx(pn); pad = sum(np.sin(2 * np.pi * f * pt) for f in (261.6, 329.6, 392.0, 523.3)) * np.clip(pt / 0.3, 0, 1) * np.clip((2.2 - pt) / 0.2, 0, 1)
place(lp(pad, 4000), 2.2, 0.035)                                                         # the float: a soft chord
n = int(1.0 * SR); t = tx(n); place(bp(noise(n), 1500, 7000) * np.exp(-t * 3) * 0.8 + lp(noise(n), 200) * np.exp(-t * 4), 4.4, 0.45)   # the magnetic brakes
place(boom(0.8), 4.45, 0.35)
n = int(0.9 * SR); t = tx(n); place(lp(noise(n), 300) * np.clip((0.9 - t) / 0.2, 0, 1) * 0.6, 5.4, 0.2)    # the seats slide down into the station
for s_ in (5.9, 6.4): place(step(130), s_, 0.18, -0.4)                                     # Crowe's two steps
s_, gap = 5.6, 0.34
while s_ < 9.3: place(beep(1900, 0.05), s_, 0.09, -0.3); gap = max(0.09, gap * 0.9); s_ += gap
place(thud(70, 9, 0.6), 9.5, 0.5)                                                         # title
for i, f in enumerate((392, 523.3, 659.3)): place(pluck(f, 0.6), 9.53 + i * 0.07, 0.07)

# ---- report A: the sneaking bed and small sounds on the beats
bpm = 104; beat = 60 / bpm; bass = [110, 0, 130.8, 0, 146.8, 0, 164.8, 146.8, 110, 0, 130.8, 164.8, 146.8, 0, 130.8, 123.5]
def bed(t0, t1, gain=0.085, every=2):
    k, s_ = 0, t0
    while s_ < t1:
        fnote = bass[k % len(bass)]
        if fnote and (k % every == 0 or every == 1): place(pluck(fnote, 0.45, 0.3), s_, gain, -0.1)
        if k % 4 == 2: n = int(0.03 * SR); place(bp(noise(n), 2500, 7000) * np.exp(-tx(n) * 160), s_, gain * 0.6, 0.3)
        k += 1; s_ += beat / 2
bed(RS + 0.2, IS - 0.1, 0.085, 1)
for key in ("news", "theory", "checked", "station", "why"): place(whoosh(0.24, 500, 3500), beats[key] - 0.22, 0.08)
for key in ("bad", "higher", "upwhere", "zero", "pull", "almost"): place(pop(700 + 40 * (len(key) % 7)), beats[key] + 0.02, 0.07)
place(thud(240, 40, 0.2), beats["wrong"] + 0.15, 0.3)                                     # the WRONG stamp

# ---- the interruption: the detector close by, Crowe's steps, the apple held up to each toy, the grab, the steps away
s_, gap = IS + 0.05, 0.42
while s_ < BS - 0.3: place(beep(1900, 0.05), s_, 0.07, -0.2); gap = 0.42 if s_ < I_YOU else 0.6; s_ += gap
drone = sum(np.sin(2 * np.pi * f * T) for f in (55, 65.4, 82.4)); dg = np.interp(T, [IS, IS + 0.6, BS + 0.6, BS + 2.0, TS - 0.2, TS + 0.4, END - 0.3, END], [0, 0.05, 0.05, 0.018, 0.018, 0.05, 0.07, 0])
place(lp(drone, 400) * dg, 0)
place(pop(320), IS + 0.3, 0.25)                                                           # he snaps into the plush pose
for s_ in np.arange(IS + 1.25, I_NOT1 - 0.2, 0.5): place(step(120), s_, 0.16, -0.3)
for s_ in (I_NOT2 - 0.7, I_YOU - 0.95, I_YOU - 0.5): place(step(120), s_, 0.16, 0)
for i in range(3): place(heart(), I_NOT2 + 0.9 + i * 0.5, 0.6)                             # Peek holds his breath
n = int(0.25 * SR); place(bp(noise(n), 800, 3000) * np.exp(-tx(n) * 14), I_YOU + 0.75, 0.2)   # the plush grabbed (a soft squish)
for s_ in np.arange(I_YOU + 1.0, BS + 0.2, 0.45): place(step(120), s_, 0.12, 0.3)
n = int(0.6 * SR); t = tx(n); place(lp(noise(n), 1200) * np.sin(np.pi * t / 0.6), BS - 0.45, 0.12)   # Peek exhales

# ---- report B: a quieter bed, small sounds on the beats
bed(BS + 0.9, TS - 0.6, 0.06, 2)
for key in ("ride", "never", "falls", "moon", "sum1", "question"): place(whoosh(0.24, 500, 3500), beats[key] - 0.22, 0.07)
for key in ("nothing", "mph", "missing", "lower", "sum2", "sum3", "wrench"): place(pop(650 + 30 * (len(key) % 5)), beats[key] + 0.02, 0.06)
place(thud(260, 50, 0.15), beats["peekout"] + 0.7, 0.2)                                  # he hops down

# ---- the tag: the detector starts again, the hit when the next question lands
s_, gap = TS + 2.6, 0.4
while s_ < END - 0.1: place(beep(1900, 0.05), s_, 0.08, 0.2); gap = max(0.09, gap * 0.88); s_ += gap
bn = int(1.6 * SR); bt = tx(bn)
place(lp(sum(signal.sawtooth(2 * np.pi * f * bt) for f in (43.65, 43.9, 87.3, 65.4)), 600) * np.clip(bt / 0.02, 0, 1) * np.exp(-bt * 1.5), TS + 3.3, 0.26)
beats["next"] = round(TS + 3.3, 3)

place(tracks["peek"], 0, 1.55); place(tracks["commander"], 0, 1.3, -0.2); place(tracks["crowe"], 0, 1.5, -0.15)
mix = np.stack([L, R], axis=1); mix = np.tanh(mix * 1.15) / np.tanh(1.15); mix /= max(1e-9, np.abs(mix).max()) / 0.89
raw = a.out.replace(".wav", ".raw.wav"); os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True); wavfile.write(raw, SR, (mix * 32767).astype(np.int16))
# two-pass loudness: measure, then normalise linearly to -14 LUFS (a single dynamic pass lands short of the target)
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
m = json.loads(r.stderr[r.stderr.rindex("{"):])
ln = f"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", ln, "-ar", "48000", a.out], check=True); os.remove(raw)

hop = SR // a.fps; env = {}
for who, tr in tracks.items():
    rms = np.sqrt(np.convolve(tr ** 2, np.ones(hop) / hop, mode="same"))[::hop]
    live = rms[rms > 1e-4]                                 # (no Commander in this episode: an empty track stays silent)
    env[who] = np.round(np.clip(rms / (np.percentile(live, 90) + 1e-9), 0, 1), 3).tolist() if len(live) else [0.0] * len(rms)
json.dump({"fps": a.fps, "dur": DUR, "rs": RS, "is": round(IS, 3), "bs": round(BS, 3), "ts": round(TS, 3), "end": round(END, 3), "placeholder": a.placeholder,
           "lines": LINE_AT, "beats": beats, "words": sorted(caption_words, key=lambda w: w["t"]), **env}, open(a.cues, "w"))
print(f"{a.out}: {DUR} s{' (PLACEHOLDER voices)' if a.placeholder else ''}; A {RS}-{IS:.2f} ({IS - RS:.1f} s); interruption {IS:.2f}-{BS:.2f} ({BS - IS:.1f} s); B {BS:.2f}-{TS:.2f} ({TS - BS:.1f} s); tag {TS:.2f}-{END:.2f}")
print(beats)
