#!/usr/bin/env python3
"""Episode 2 (Why doesn't the Moon fall?): the whole soundtrack and the timing file the picture reads.

  python3 audio/ep02_sound.py out/ep02-mix.wav --voices audio/ep02 --cues out/ep02.json
  python3 audio/ep02_sound.py out/ep02-mix.wav --voices audio/ep02 --cues out/ep02.json --placeholder

--placeholder builds everything without the recorded takes: each line's words get estimated times from the request
text (about 2.7 words a second after tightening) and a stand-in voice (shaped noise) so the loudness and the mouths
work. The cue file has exactly the keys the real one will have; when the takes arrive, drop the flag.

Timeline: the cold open is fixed (0 to RS). Report A runs from RS and is cut on its last word ("Because it...").
The Crowe interruption follows; its length comes from the Crowe and Commander takes. Report B starts on the rooftop
("...is falling") and runs to "Peek out."; the tag follows and the Short ends on it. Speech is never sped up
(tempo 1.0); silences are tightened as in Episode 1. Every effect is synthesized.
"""
import argparse, json, os, re, subprocess, tempfile
import numpy as np
from scipy import signal
from scipy.io import wavfile

ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("--voices", required=True)
ap.add_argument("--cues", required=True); ap.add_argument("--fps", type=int, default=30); ap.add_argument("--placeholder", action="store_true")
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

def take(name):
    if a.placeholder: return fake_take(name)
    sr, x = wavfile.read(os.path.join(a.voices, name + ".wav")); x = x.astype(np.float64) / 32768.0
    x = signal.resample_poly(x if x.ndim == 1 else x.mean(axis=1), SR, sr)
    words = json.load(open(os.path.join(a.voices, name + ".words.json")))["words"]
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

def prepared(name, pick=None, **kw):
    x, words = take(name)
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
RS = 11.6                                              # the cold open ends, report A starts (rooftop)
repA, wA = prepared("reportA", keep=0.2, over=0.28)
cut = len(wA) - 1                                      # report A is cut right after its last word, "it"
IS = RS + 0.15 + wA[cut][1] + 0.04                     # the interruption starts: the door slams
repA = repA[: int((wA[cut][1] + 0.04) * SR)]; repA = fades(repA, 0.004, 0.02)
crA, cwA = prepared("crowe", pick=lambda i, n: i < n // 2, keep=0.3, over=0.45)   # "Thrown... from up here."
crB, cwB = prepared("crowe", pick=lambda i, n: i >= n // 2, keep=0.3, over=0.45)  # "Small mouth... big teeth."
cmd, cmw = prepared("commander", keep=0.18, over=0.3)
I_CROWE = IS + 1.45                                    # Crowe steps out and speaks
I_CMD = I_CROWE + cwA[-1][1] + 0.5                    # the Commander crackles out of Peek's antennae
repB, wB = prepared("reportB", keep=0.2, over=0.28)
BS = I_CMD + cmw[-1][1] + 1.5                          # the beam crawls over the AC, moves on; Peek whispers "...is falling"
RB = len(repB) / SR
TS = BS + 0.0 + RB + 0.9                               # "Peek out." then he tiptoes off; the tag starts
END = TS + 5.2
DUR = round(END, 2)
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N); T = np.arange(N) / SR
def place(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    x = x[: N - i] * gain; L[i:i + len(x)] += x * np.sqrt(0.5 * (1 - pan)); R[i:i + len(x)] += x * np.sqrt(0.5 * (1 + pan))
tracks = {k: np.zeros(N) for k in ("peek", "commander", "crowe")}
caption_words = []
FIX = {"mi": "miles", "mi.": "miles", "2300": "2,300", "dime": "dime's", "dimes": "dime's"}   # speech-to-text mishearings, fixed in the captions
def fixw(w): return re.sub(r"(?i)\bpeak\b", "Peek", FIX.get(w.lower(), w))
def say(who, y, words, at, gain, line, treat=None):
    z = treat(y) if treat else y
    i = int(at * SR); n = min(len(z), N - i); tracks[who][i:i + n] += z[:n] * gain
    for s, e, w in words: caption_words.append({"t": round(at + s, 3), "e": round(at + e, 3), "w": fixw(w), "who": who, "line": line})

def radio(x):                                          # a small speaker: band-limited, a little crunch, a click in and out
    y = np.tanh(bp(x, 500, 3200) * 3) * 0.6
    y = y + bp(noise(len(y)), 1500, 4000) * 0.02
    return fades(y, 0.004, 0.02)

# cold open lines (fixed times; the picture is staged on them)
LINE_AT = {"back1": 0.62, "back2": 3.05, "back3": 5.55, "oops": 9.75}
x, w = take("throws")
groups = [[0], [1, 2], [3, 4]] if len(w) >= 5 else [[i] for i in range(len(w))]
for k, g in enumerate(groups[:3]):
    sel = [w[i] for i in g if i < len(w)]
    if not sel: continue
    y, ww = tighten(x, sel, keep=0.12, over=0.2)
    say("peek", fades(norm(y, 0.62 + 0.08 * k)), ww, LINE_AT[f"back{k + 1}"], 1.0, 1 + k)
y, w = prepared("oops", keep=0.2); say("peek", fades(norm(y, 0.5)), w, LINE_AT["oops"], 1.0, 4)
say("peek", norm(repA, 0.8), wA[: cut + 1], RS + 0.15, 1.0, 10)
say("crowe", fades(norm(crA, 0.8)), cwA, I_CROWE, 1.0, 20)
say("commander", norm(cmd, 0.85), cmw, I_CMD, 1.0, 21, radio)
say("peek", norm(repB, 0.72), wB, BS, 1.0, 30)
y_tag_crowe = TS + 1.6
say("crowe", fades(norm(crB, 0.8)), cwB, y_tag_crowe, 1.0, 40)

# ---------------------------------------------------------------- beats (for the pictures)
A0, B0 = RS + 0.15, BS
rwA = [(A0 + s, A0 + e, clean(w)) for s, e, w in wA[: cut + 1]]
rwB = [(B0 + s, B0 + e, clean(w)) for s, e, w in wB]
beats, idx = {}, 0
orderA = [("report", "commander field"), ("bolted", "their moon"), ("checked", "i checked"), ("falls", "and here"), ("coming", "so it is coming|so it's coming"),
          ("threw", "i threw"), ("harder", "the harder"), ("farther", "the farther"), ("round", "but their planet"), ("throw", "throw hard"), ("curves", "curves away"), ("fast", "as fast"),
          ("never", "it never"), ("around", "it falls all"), ("head", "and hits"), ("why", "so why"), ("because", "because it")]
for key, seq in orderA:
    idx = find(rwA, seq, idx, "reportA"); beats[key] = round(rwA[idx][0], 3)
beats["cut"] = round(IS, 3)
idx = 0
orderB = [("falling", "is falling"), ("alltime", "all the time"), ("sideways", "but it is also|but it's also"), ("without", "without the"), ("with", "with it"), ("dime", "a dime's|a dimes|a dime"),
          ("every", "every second"), ("bend", "just enough"), ("circle", "a circle"), ("days", "once every"), ("sum1", "so the moon"), ("sum2", "it moves sideways"), ("sum3", "keeps missing"),
          ("question", "which raises"), ("astro", "the same pull"), ("float", "so why do"), ("out", "investigating"), ("peekout", "peek out")]
for key, seq in orderB:
    idx = find(rwB, seq, idx, "reportB"); beats[key] = round(rwB[idx][0], 3)
i_side = find(rwB, "sideways", find(rwB, "but it is also|but it's also", 0, "reportB"), "reportB")
beats["mph"] = round(rwB[i_side + 1][0], 3)            # the first word after "sideways": the speed, however it was transcribed
beats["end"] = round(rwB[-1][1], 3)
beats.update({"crowe": round(I_CROWE, 3), "crowe_end": round(I_CROWE + cwA[-1][1], 3), "cmd": round(I_CMD, 3), "cmd_end": round(I_CMD + cmw[-1][1], 3),
              "tagline": round(y_tag_crowe, 3)})

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

# rain: very low outdoors in the cold open, very low in the interruption and the tag; silent under both report halves
rainL, rainR = hp(lp(noise(N), 7000), 400), hp(lp(noise(N), 7000), 400)
rg = np.where(T < RS, 0.011, 0.0) + np.where((T >= IS) & (T < BS + 0.9), 0.006, 0.0) + np.where(T >= TS, 0.007, 0.0)
rg = lp(rg, 8); L += rainL * rg; R += rainR * rg

# ---- cold open: the Moon looms (a dark swell), three throws, the bite, the window, the detector, "Oops", the title
n = int(1.4 * SR); t = tx(n); place(lp(noise(n), 160) * np.exp(-t * 1.6) * 2 + np.sin(2 * np.pi * 41 * t) * np.exp(-t * 2), 0.0, 0.35)      # frame one: a low swell under his face
for s_ in (0.05, 0.62): place(heart(), s_, 0.7)
REL = {1: 0.68, 2: 3.15, 3: 5.95}                                                   # the apple leaves his hand
place(whoosh(0.3, 600, 4000), REL[1] - 0.08, 0.22, 0.2)
place(thud(300, 45, 0.18), 1.92, 0.32, -0.1); place(pluck(660, 0.2), 1.93, 0.05)   # apple 1 bonks the roof, rolls
n = int(0.5 * SR); place(lp(noise(n), 400) * np.exp(-tx(n) * 6) * 0.6, 1.98, 0.15)
place(whoosh(0.5, 400, 3500), REL[2] - 0.15, 0.3, 0.3)
place(thud(180, 35, 0.25), 4.08, 0.22, 0.5)                                         # apple 2 lands across the alley
place(crunch(0.18), 4.62, 0.5); [place(crunch(0.08), s_, 0.18) for s_ in (4.86, 5.04, 5.2)]   # the bite, three chews
place(whoosh(0.55, 150, 1500), 5.25, 0.35, -0.2); place(whoosh(0.7, 500, 5000), REL[3] - 0.1, 0.4, 0.3)   # the spin, the throw
n = int(0.9 * SR); t = tx(n); f = 1800 * np.exp(-t * 1.2); place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.clip(t / 0.05, 0, 1) * np.exp(-t * 1.5), 6.0, 0.05)   # it whistles away
place(glass(), 6.86, 0.45, 0.25)                                                     # the window
for s_ in (7.55, 7.72, 7.85): place(thud(420, 70, 0.08), s_, 0.12)                   # the apple bounces on the street
n = int(0.6 * SR); place(lp(noise(n), 300) * np.exp(-tx(n) * 4) * 0.5, 7.9, 0.12)    # and rolls to his shoe
s_, gap = 7.55, 0.3
while s_ < 9.15: place(beep(1900, 0.05), s_, 0.09, 0.2); gap = max(0.08, gap * 0.8); s_ += gap
for i, f in enumerate((523.3, 392, 311.1)): place(pluck(f, 0.5, 0.3), 9.5 + i * 0.12, 0.05)                  # a small sad descent before "Oops"
place(thud(70, 9, 0.6), 10.35, 0.5)                                                  # title
for i, f in enumerate((392, 523.3, 659.3)): place(pluck(f, 0.6), 10.38 + i * 0.07, 0.07)

# ---- report A: the sneaking bed and small sounds on the beats; footsteps on the stairs under its last three seconds
bpm = 104; beat = 60 / bpm; bass = [110, 0, 130.8, 0, 146.8, 0, 164.8, 146.8, 110, 0, 130.8, 164.8, 146.8, 0, 130.8, 123.5]
def bed(t0, t1, gain=0.085, every=2):
    k, s_ = 0, t0
    while s_ < t1:
        fnote = bass[k % len(bass)]
        if fnote and k % every == 0 or (fnote and every == 1): place(pluck(fnote, 0.45, 0.3), s_, gain, -0.1)
        if k % 4 == 2: n = int(0.03 * SR); place(bp(noise(n), 2500, 7000) * np.exp(-tx(n) * 160), s_, gain * 0.6, 0.3)
        k += 1; s_ += beat / 2
bed(RS + 0.2, IS - 0.1, 0.085, 1)
for key in ("bolted", "falls", "threw", "round", "throw", "never", "why"): place(whoosh(0.24, 500, 3500), beats[key] - 0.22, 0.08)
for key in ("checked", "coming", "harder", "farther", "curves", "around"): place(pop(700 + 40 * (len(key) % 7)), beats[key] + 0.02, 0.07)
place(thud(240, 40, 0.2), beats["checked"] + 0.35, 0.25)                             # the NO BOLTS stamp
for at in (beats["threw"] + 0.3, beats["harder"], beats["farther"] - 0.15): place(whoosh(0.3, 700, 4000), at - 0.05, 0.07)   # the three board throws
place(glass(0.5), beats["farther"] + 0.6, 0.12, 0.3)                                 # the third throw's little window (shots/ep02.js THROWS)
place(thud(300, 45, 0.2), beats["head"] + 0.45, 0.35); place(pluck(1318.5, 0.3), beats["head"] + 0.47, 0.06)   # bonk
k, s_ = 0, IS - 3.0
while s_ < IS - 0.05: place(step(140 + 10 * (k % 2)), s_, 0.04 + 0.1 * (s_ - (IS - 3.0)) / 3.0, -0.4); s_ += 0.5; k += 1      # footsteps coming up the stairs

# ---- the interruption: the door slams, the detector, the torch, the Commander, the beam passing
place(boom(1.0), IS, 0.55, -0.3); place(clang(), IS + 0.03, 0.25, -0.3)
place(whoosh(0.35, 300, 3000), IS + 0.35, 0.3)                                       # Peek dives behind the AC
place(thud(160, 40, 0.15), IS + 0.75, 0.3)
drone = sum(np.sin(2 * np.pi * f * T) for f in (55, 65.4, 82.4)); dg = np.interp(T, [IS, IS + 0.6, BS + 0.6, BS + 2.0, TS - 0.2, TS + 0.4, END - 0.3, END], [0, 0.05, 0.05, 0.018, 0.018, 0.05, 0.07, 0])
place(lp(drone, 400) * dg, 0)
s_, gap = IS + 0.9, 0.42                                                             # the detector: slow, then fast when it turns to the AC
while s_ < BS:
    place(beep(1900, 0.05), s_, 0.08, -0.2)
    gap = 0.42 if s_ < I_CMD + 0.4 else max(0.12, gap * 0.85) if s_ < I_CMD + 2.2 else min(0.5, gap * 1.25); s_ += gap
for s_ in np.arange(IS + 1.25, I_CROWE + 1.0, 0.55): place(step(110), s_, 0.18, -0.2)
place(bp(noise(int(0.05 * SR)), 1500, 4500) * np.exp(-tx(int(0.05 * SR)) * 60), I_CMD - 0.05, 0.3, 0.1)   # radio click in
place(pop(320), I_CMD + cmw[-1][1] + 0.12, 0.3)                                      # he clamps his antennae
for i in range(3): place(heart(), I_CMD + cmw[-1][1] + 0.3 + i * 0.6, 0.6)
for s_ in np.arange(I_CMD + cmw[-1][1] + 1.0, BS + 0.6, 0.6): place(step(110), s_, 0.12, 0.3)             # Crowe walks off to the parapet

# ---- report B: a quieter bed (every other note), the detector very faint, small sounds on the beats
bed(BS + 0.9, TS - 0.6, 0.06, 2)
s_ = BS + 2.0
while s_ < TS - 1.0: place(beep(1900, 0.04), s_, 0.025, 0.5); s_ += 1.6
for key in ("alltime", "sideways", "without", "dime", "bend", "sum1", "question"): place(whoosh(0.24, 500, 3500), beats[key] - 0.22, 0.07)
for key in ("mph", "with", "every", "days", "sum2", "sum3", "astro"): place(pop(650 + 30 * (len(key) % 5)), beats[key] + 0.02, 0.06)
for i in range(4): place(step(180), beats["peekout"] + 0.6 + i * 0.22, 0.06, 0.2)  # he tiptoes off

# ---- the tag: the detector at the AC, the line, the hit when the next question lands
s_, gap = TS + 0.2, 0.36
while s_ < END - 0.1: place(beep(1900, 0.05), s_, 0.08, 0.2); gap = max(0.09, gap * 0.9); s_ += gap
bn = int(1.6 * SR); bt = tx(bn)
place(lp(sum(signal.sawtooth(2 * np.pi * f * bt) for f in (43.65, 43.9, 87.3, 65.4)), 600) * np.clip(bt / 0.02, 0, 1) * np.exp(-bt * 1.5), TS + 3.35, 0.26)
beats["next"] = round(TS + 3.35, 3)

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
    env[who] = np.round(np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1), 3).tolist()
json.dump({"fps": a.fps, "dur": DUR, "rs": RS, "is": round(IS, 3), "bs": round(BS, 3), "ts": round(TS, 3), "end": round(END, 3), "placeholder": a.placeholder,
           "lines": LINE_AT, "beats": beats, "words": sorted(caption_words, key=lambda w: w["t"]), **env}, open(a.cues, "w"))
print(f"{a.out}: {DUR} s{' (PLACEHOLDER voices)' if a.placeholder else ''}; A {RS}-{IS:.2f} ({IS - RS:.1f} s); interruption {IS:.2f}-{BS:.2f} ({BS - IS:.1f} s); B {BS:.2f}-{TS:.2f} ({TS - BS:.1f} s); tag {TS:.2f}-{END:.2f}")
print(beats)
