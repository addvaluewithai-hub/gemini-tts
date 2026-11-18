#!/usr/bin/env python3
"""Episode 1 (Gravity): the whole soundtrack and the timing file the picture reads.

  python3 audio/ep01_sound.py out/ep01-mix.wav --voices audio/ep01 --shared audio/voice --cues out/ep01.json

Timeline: the cold open is fixed (0 to RS); the report starts at RS and is as long as its voice take (silences
tightened, tempo 1.06); the tag and end card follow. Every effect is synthesized. The cue file holds the durations,
every spoken word with its time (for captions), the beats of the report (for the pictures) and the loudness of each
voice per frame (for the mouths).
"""
import argparse, json, os, re, subprocess, tempfile
import numpy as np
from scipy import signal
from scipy.io import wavfile

ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("--voices", required=True); ap.add_argument("--shared", required=True)
ap.add_argument("--cues", required=True); ap.add_argument("--fps", type=int, default=30)
a = ap.parse_args()
SR = 48000
rng = np.random.default_rng(11)
tx = lambda n: np.arange(n) / SR
def butter(kind, f, order=2): return signal.butter(order, np.array(f) / (SR / 2) if np.ndim(f) else f / (SR / 2), kind)
lp = lambda x, f: signal.lfilter(*butter("low", f), x)
hp = lambda x, f: signal.lfilter(*butter("high", f), x)
bp = lambda x, lo, hi: signal.lfilter(*butter("band", [lo, hi]), x)
noise = lambda n: rng.standard_normal(n)
norm = lambda x, peak=0.7: x / (np.abs(x).max() + 1e-9) * peak
def fades(x, i=0.008, o=0.03):
    x = x.copy(); n1, n2 = max(1, int(i * SR)), max(1, int(o * SR)); x[:n1] *= np.linspace(0, 1, n1); x[-n2:] *= np.linspace(1, 0, n2); return x
def atempo(x, tempo):
    if abs(tempo - 1) < 0.005: return x
    with tempfile.TemporaryDirectory() as d:
        p, q = os.path.join(d, "a.wav"), os.path.join(d, "b.wav"); wavfile.write(p, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", p, "-af", f"atempo={tempo}", q], check=True)
        return wavfile.read(q)[1].astype(np.float64) / 32768.0

# ---------------------------------------------------------------- voices
def take(folder, name):
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

def prepared(folder, name, tempo=1.0, fit=None, pick=None, **kw):
    x, words = take(folder, name)
    if pick: words = [w for w in words if pick(w)]
    y, w2 = tighten(x, words, **kw)
    if fit: tempo = max(tempo, (len(y) / SR) / fit)
    y = atempo(y, tempo)
    return y, [[s / tempo, e / tempo, w] for s, e, w in w2]

RS = 10.3                                             # the report starts here
report, rwords = prepared(a.voices, "report", tempo=1.06)
RD = len(report) / SR
TS = RS + 0.15 + RD + 0.25                            # the tag starts here
END = TS + 3.3                                        # end card
DUR = round(END + 2.6, 2)
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N); T = np.arange(N) / SR
def place(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    x = x[: N - i] * gain; L[i:i + len(x)] += x * np.sqrt(0.5 * (1 - pan)); R[i:i + len(x)] += x * np.sqrt(0.5 * (1 + pan))
tracks = {k: np.zeros(N) for k in ("peek", "commander", "crowe")}
caption_words = []
def say(who, y, words, at, gain, line, treat=None):
    z = treat(y) if treat else y
    i = int(at * SR); n = min(len(z), N - i); tracks[who][i:i + n] += z[:n] * gain
    for s, e, w in words: caption_words.append({"t": round(at + s, 3), "e": round(at + e, 3), "w": w.replace("Peak", "Peek"), "who": who, "line": line})

def radio(x):                                          # a small speaker: band-limited, a little crunch, a click in and out
    y = np.tanh(bp(x, 500, 3200) * 3) * 0.6
    y = y + bp(noise(len(y)), 1500, 4000) * 0.02
    return fades(y, 0.004, 0.02)
def echo(x, d=0.24, g=0.28):
    y = np.concatenate([x, np.zeros(int(d * SR * 2))]); y[int(d * SR):int(d * SR) + len(x)] += x * g; return y

y, w = prepared(a.voices, "commander", fit=1.75); say("commander", norm(y, 0.8), w, 1.5, 1.0, 0, radio)
y, w = prepared(a.voices, "relax", fit=0.95); say("peek", fades(norm(y, 0.7)), w, 3.28, 1.0, 1)
y, w = prepared(a.voices, "float", fit=2.2, keep=0.32); say("peek", fades(norm(y, 0.75)), w, 4.95, 1.0, 2, echo)
y, w = prepared(a.shared, "p4-uhoh", keep=0.1); say("peek", fades(norm(y, 0.6)), w, 7.38, 1.0, 3)
sc, _ = take(a.shared, "p5-scream"); sc = sc[int(0.2 * SR): int(1.7 * SR)]; sc = signal.resample(sc, int(len(sc) * 0.42)); sc = sc * np.linspace(1, 0.06, len(sc)) ** 1.4
i = int(7.8 * SR); tracks["peek"][i:i + len(sc)] += fades(norm(sc, 0.8), 0.01, 0.08)
say("peek", norm(report, 0.8), rwords, RS + 0.15, 1.0, 10)
y, w = prepared(a.voices, "here", keep=0.12); say("crowe", fades(norm(y, 0.8)), w, TS + 1.55, 1.0, 20)

# ---------------------------------------------------------------- beats of the report (for the pictures)
clean = lambda s: re.sub(r"[^a-z']", "", s.lower())
R0 = RS + 0.15
rw = [(R0 + s, R0 + e, clean(w)) for s, e, w in rwords]
def find(seq, start=0):
    seq = [clean(s) for s in seq.split()]
    for i in range(start, len(rw) - len(seq) + 1):
        if all(rw[i + j][2] == seq[j] for j in range(len(seq))): return i
    raise SystemExit(f"beat not found in the take: {seq}")
order = [("report", "commander field"), ("problem", "this planet"), ("falls", "everything falls"), ("apples", "apples"), ("cups", "cups"), ("me", "me"),
         ("gravity", "they call"), ("pulls", "everything pulls on"), ("heavier", "the heavier"), ("planet", "and the heaviest"), ("is", "is the planet"), ("wins", "so it wins"),
         ("you", "you pull"), ("notice", "it just"), ("jump", "jump"), ("back", "it pulls you"), ("phone", "drop your"), ("takes", "it takes"), ("humans", "humans do"), ("surprised", "and still"),
         ("sum1", "so everything"), ("sum2", "heavier pulls"), ("sum3", "that's gravity"), ("question", "which raises"), ("moon", "it even"), ("why", "so why"), ("out", "investigating"), ("peekout", "peek out")]
beats, idx = {}, 0
for key, seq in order:
    idx = find(seq, idx); beats[key] = round(rw[idx][0], 3)
beats["end"] = round(rw[-1][1], 3)

# ---------------------------------------------------------------- effects
def whoosh(d=0.6, lo=300, hi=3000):
    n = int(d * SR); t = tx(n); src = noise(n); out = np.zeros(n)
    for k, c in enumerate(np.geomspace(lo, hi, 6)): out += bp(src, c * 0.8, c * 1.2) * np.exp(-((t / d - (k + 1) / 7) ** 2) / 0.02)
    return out * np.sin(np.pi * t / d)
def thud(f=120, k=30, d=0.25):
    n = int(d * SR); t = tx(n); return np.sin(2 * np.pi * f * t * (1 - t)) * np.exp(-t * k) + bp(noise(n), 800, 5000) * np.exp(-t * 60) * 0.4
def boom():
    n = int(1.6 * SR); t = tx(n)
    return (np.sin(2 * np.pi * 46 * t * (1 - 0.3 * t)) * np.exp(-t * 4.5) * 1.4 + bp(noise(n), 200, 5000) * np.exp(-t * 7) * (1 + 0.5 * np.sin(2 * np.pi * 19 * t)) * 0.9
            + bp(noise(n), 2000, 8000) * np.exp(-t * 3) * (rng.random(n) < 0.015) * 5)
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

SLOW = (4.8, 7.2)
sm = np.clip((T - (SLOW[0] - 0.15)) / 0.25, 0, 1) * np.clip((SLOW[1] - T) / 0.05, 0, 1)
out_door = ((T < RS) | (T >= TS)) & (T < END)
# night rain: full outside in the cold open and the tag, a hush under the report
rainL, rainR = hp(lp(noise(N), 7000), 400), hp(lp(noise(N), 7000), 400)
rg = np.where(out_door, 0.04, 0.0) * (1 - 0.8 * sm) + np.where((T >= RS) & (T < TS), 0.012, 0.0)
rg = lp(rg, 8)
L += (rainL * (1 - sm) + lp(noise(N), 600) * 1.5 * sm) * rg; R += (rainR * (1 - sm) + lp(noise(N), 600) * 1.5 * sm) * rg

# the capsule comes in: a falling whistle and a rumble, then the hit
n = int(1.0 * SR); t = tx(n); f = 2600 * np.exp(-t * 1.5)
place(np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / 1.0) ** 1.5 * 0.5 + lp(noise(n), 300) * (t / 1.0) ** 2, 0.0, 0.3, -0.3)
place(boom(), 1.0, 0.75)
n = int(0.7 * SR); t = tx(n); place(hp(noise(n), 4000) * np.exp(-t * 5) * np.minimum(1, t / 0.02), 1.45, 0.12)      # hatch steam
place(pop(500), 1.45, 0.3); place(pop(1300), 1.62, 0.2)
for s_ in (1.46, 3.2): n = int(0.05 * SR); place(bp(noise(n), 1500, 4500) * np.exp(-tx(n) * 60), s_, 0.25)          # radio clicks
for i, s_ in enumerate((4.22, 4.38, 4.54)): place(thud(190, 55, 0.12), s_, 0.22, 0.2 * (1 if i % 2 else -1))             # three steps to the edge
place(whoosh(0.4), 4.62, 0.3)
for s_ in (5.0, 5.9, 6.75): place(heart(), s_, 0.8)
pn = int((SLOW[1] - SLOW[0]) * SR); pt = tx(pn)
pad = sum(np.sin(2 * np.pi * f * pt + 0.3 * np.sin(2 * np.pi * 0.3 * pt)) for f in (261.6, 329.6, 392.0, 493.9, 523.3)) * np.clip(pt / 0.5, 0, 1) * 0.6
harp = np.zeros(pn)
for i, f in enumerate((523.3, 659.3, 784, 987.8, 1046.5, 1318.5)):
    j = int((0.12 + i * 0.09) * SR); m = pn - j; harp[j:] += np.sin(2 * np.pi * f * tx(m)) * np.exp(-tx(m) * 3.5) * 0.6
place(lp(pad + harp, 4500), SLOW[0], 0.04)
sn = int(0.22 * SR); st = tx(sn); place(bp(noise(sn), 600, 3000) * np.sin(2 * np.pi * (40 - 120 * st) * st) * np.exp(-st * 8), SLOW[1] - 0.03, 0.4)
n = int(0.6 * SR); t = tx(n); f = 1500 * np.exp(-t * 2.2); place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.clip(t / 0.05, 0, 1), 7.82, 0.09)
place(whoosh(0.6, 150, 1500), 7.85, 0.3)
place(boom(), 8.4, 0.6); place(clang(), 8.52, 0.36, 0.1)
n = int(0.42 * SR); t = tx(n); place(np.sin(2 * np.pi * (300 + 260 * t / 0.42) * t + 3 * np.sin(2 * np.pi * 31 * t)) * np.sin(np.pi * t / 0.42) * 0.5, 8.95, 0.08)   # the lid creaks open
for i, f in enumerate((392, 523.3, 659.3)): place(pluck(f, 0.6), 9.32 + i * 0.09, 0.1)                                         # ta-da
place(thud(70, 9, 0.6), 9.5, 0.5)                                                                                              # title

# the report: a quiet sneaking bed (plucked bass and a soft click), and small sounds on the beats
bpm = 104; beat = 60 / bpm; bass = [110, 0, 130.8, 0, 146.8, 0, 164.8, 146.8, 110, 0, 130.8, 164.8, 146.8, 0, 130.8, 123.5]
k = 0; s_ = RS + 0.2
while s_ < TS - 0.3:
    fnote = bass[k % len(bass)]
    if fnote: place(pluck(fnote, 0.45, 0.3), s_, 0.085, -0.1)
    if k % 4 == 2: n = int(0.03 * SR); place(bp(noise(n), 2500, 7000) * np.exp(-tx(n) * 160), s_, 0.05, 0.3)
    k += 1; s_ += beat / 2
place(thud(300, 40, 0.15), beats["apples"] + 0.12, 0.3); place(pluck(880, 0.2), beats["apples"] + 0.14, 0.06)                   # the apple bonks his hat
n = int(0.35 * SR); t = tx(n); place(bp(noise(n), 3000, 9000) * np.exp(-t * 14) * (rng.random(n) < 0.08) * 4 + thud(400, 60, 0.35) * 0.4, beats["cups"] + 0.14, 0.14, 0.3)   # the cup breaks
place(whoosh(0.3, 400, 3000), beats["me"] - 0.02, 0.18)
for key in ("gravity", "heavier", "planet", "you", "jump", "phone", "humans", "sum1", "sum2", "sum3", "moon"):
    place(pop(700 + 40 * (hash(key) % 7)), beats[key] + 0.02, 0.07)
for key in ("gravity", "planet", "sum1", "question", "out"): place(whoosh(0.28, 500, 3500), beats[key] - 0.2, 0.1)
place(thud(90, 12, 0.5), beats["wins"] + 0.1, 0.3)
place(thud(260, 40, 0.15), beats["back"] + 0.35, 0.2)
n = int(0.2 * SR); t = tx(n); place(bp(noise(n), 3000, 9000) * np.exp(-t * 25) * (rng.random(n) < 0.1) * 4, beats["takes"] + 0.05, 0.1)   # the phone cracks
place(clang(), beats["peekout"] + 0.45, 0.2)                                                                                    # he shuts the lid

# the tag: the detector, a low drone, then the hit into the end card
drone = sum(np.sin(2 * np.pi * f * T) for f in (55, 65.4, 82.4)); dg = np.interp(T, [TS - 0.2, TS + 0.4, END - 0.05, END + 0.1], [0, 0.05, 0.07, 0])
place(lp(drone, 400) * dg, 0)
s_, gap = TS + 0.15, 0.36
while s_ < END - 0.05: place(beep(1900, 0.05), s_, 0.11, 0.2); gap = max(0.07, gap * 0.86); s_ += gap
bn = int(1.6 * SR); bt = tx(bn)
place(lp(sum(signal.sawtooth(2 * np.pi * f * bt) for f in (43.65, 43.9, 87.3, 65.4)), 600) * np.clip(bt / 0.02, 0, 1) * np.exp(-bt * 1.5), END - 0.02, 0.3)
for i, f in enumerate((440, 523.3, 659.3, 880)): place(pluck(f, 0.9), END + 0.5 + i * 0.1, 0.07)

place(tracks["peek"], 0, 1.55); place(tracks["commander"], 0, 1.3, -0.2); place(tracks["crowe"], 0, 1.5, -0.15)
mix = np.stack([L, R], axis=1); mix = np.tanh(mix * 1.15) / np.tanh(1.15); mix /= max(1e-9, np.abs(mix).max()) / 0.89
raw = a.out.replace(".wav", ".raw.wav"); wavfile.write(raw, SR, (mix * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", a.out], check=True); os.remove(raw)

hop = SR // a.fps; env = {}
for who, tr in tracks.items():
    rms = np.sqrt(np.convolve(tr ** 2, np.ones(hop) / hop, mode="same"))[::hop]
    env[who] = np.round(np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1), 3).tolist()
json.dump({"fps": a.fps, "dur": DUR, "rs": RS, "ts": round(TS, 3), "end": round(END, 3), "beats": beats, "words": sorted(caption_words, key=lambda w: w["t"]), **env}, open(a.cues, "w"))
print(f"{a.out}: {DUR} s; report {RD:.1f} s from {RS}; tag at {TS:.2f}; end card at {END:.2f}")
print({k: v for k, v in beats.items()})
