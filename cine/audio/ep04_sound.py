#!/usr/bin/env python3
"""Episode 4 (Do heavy things fall faster?): the whole soundtrack and the timing file the picture reads.

  python3 audio/ep04_sound.py out/ep04-mix.wav --voices audio/ep04 --shared audio/voice --cues out/ep04.json
  python3 audio/ep04_sound.py out/ep04-mix.wav --voices audio/ep04 --shared audio/voice --cues out/ep04.json --placeholder

--placeholder builds everything without the recorded takes: each line's words get estimated times from the request
text (about 2.7 words a second after tightening) and a stand-in voice (shaped noise) so the loudness and the mouths
work. The cue file has exactly the keys the real one will have; when the takes arrive, drop the flag.

Timeline: the cold open follows Peek's line ("Heavy... light... for SCIENCE!"): the plank is yanked on "science", the
fall takes 1.0 s (4.9 m), the landing, Crowe looks around and up, "Oh... no.", the title. Report A runs from RS and is
cut on its last word ("Because the ball..."). The interruption follows (the store chime; Crowe on the customer-service
microphone: "Attention, shoppers." "Have you seen... this?"; the TV wall). Report B starts behind the box ("...is also
forty times harder to get moving.") and runs to "Peek out."; the tag (Crowe's detector plays "...Peek out." back;
"...Peek.") follows and the Short ends on it. Speech is never sped up (tempo 1.0); silences are tightened as in
Episode 1. Every effect is synthesized.
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
FALL = 1.0                                             # 4.9 m takes 1.0 s
LINE_AT = {"drop": 0.3}                                # "Stay... stay... If it goes... heavy one first... then the apple..."
yD, wD = prepared("drop", keep=0.45, over=0.55)
cD = [clean(w) for _, _, w in wD]
i_if = next((i for i, w in enumerate(cD) if w == "if"), max(0, len(wD) - 7))
i_heavy = next((i for i, w in enumerate(cD) if w.startswith("heavy")), i_if + 3)
STAY2, IFGOES, HEAVYW = LINE_AT["drop"] + wD[min(1, len(wD) - 1)][0], LINE_AT["drop"] + wD[i_if][0], LINE_AT["drop"] + wD[i_heavy][0]
GO = LINE_AT["drop"] + wD[-1][1] + 0.25                # the plank swings down: both are let go at the same instant
YANK = GO                                              # (the name the pictures use for the release)
LAND = YANK + FALL                                     # one bang
yO, wO = prepared("p1-ohno", pick=lambda i, n: i >= 1, folder=a.shared, keep=0.2)   # "Oh no." (the take opens with a breath, as in Episode 1)
OHNO = LAND + 3.1                                      # the held beat, the looks down, left, right, then up at the empty shelf edge
TITLE = OHNO + wO[-1][1] + 0.35
RS = round(TITLE + 1.5, 3)                             # the cold open ends, report A starts
repA, wA = prepared("reportA", keep=0.2, over=0.28)
cut = len(wA) - 1                                      # report A is cut right after its last word, "ball"
wA[cut][2] = wA[cut][2].rstrip(".,") + "..."
IS = RS + 0.15 + wA[cut][1] + 0.04                     # the interruption starts: the store chime
repA = repA[: int((wA[cut][1] + 0.04) * SR)]; repA = fades(repA, 0.004, 0.02)
cx_, cw_ = take("crowe")
if len(cw_) == 7: groups = [[0, 1], [2, 3, 4, 5], [6]]  # "Attention, shoppers." / "Have you seen... this?" / "...Peek." (the transcript has no stops)
else:
    groups, g = [], []
    for i, w in enumerate(cw_):
        g.append(i)
        if re.search(r"[.?!]$", w[2]) and not w[2].endswith("..."): groups.append(g); g = []
    if g: groups.append(g)
    while len(groups) > 3: groups[-2] += groups.pop()
crowe_lines = [tighten(cx_, [cw_[i] for i in g], keep=0.35, over=0.5) for g in groups]
CHIME = IS + 0.08
I_ATT = IS + 0.45                                       # on Crowe at the desk, the microphone
I_HYS = I_ATT + crowe_lines[0][1][-1][1] + 0.3         # he lifts the plush to the camera
TVW = I_HYS + crowe_lines[1][1][-1][1] + 0.1           # the TV wall fills with the plush's face
FEEDS = TVW + 0.85                                     # the screens flick to the security cameras; one swivels to the shelf top
HAT = FEEDS + 0.35                                      # the top of Peek's hat on one screen
PILLOW = FEEDS + 0.8                                  # Peek's shot: the red light, the pillow over the lens
STATIC = PILLOW + 0.4
TURN = PILLOW + 0.6                                   # the desk: Crowe turns to the monitors and takes one step
repB, wB = prepared("reportB", keep=0.2, over=0.28)
wB[0][2] = "..." + wB[0][2].lstrip(".")
BS = TURN + 0.75                                # Peek crouched behind the box, then "...is also forty times harder..."
RB = len(repB) / SR
TS = BS + RB + 1.5                                     # "Peek out." then the jump into the pillows (1 s fall); the tag starts
po_i = max(0, len(wB) - 2)                             # "Peek out." from the reportB take, through the detector
po0, po1 = wB[po_i][0] - 0.04, wB[-1][1] + 0.08
radio_src = repB[int(po0 * SR): int(po1 * SR)]
PO = TS + 0.4
CPEEK = PO + (po1 - po0) + 0.7                        # "...Peek." Crowe lifts the plush to his face
TAG_END = CPEEK + (crowe_lines[2][1][-1][1] if len(crowe_lines) > 2 else 0.8)
NEXT = TAG_END + 0.55
END = NEXT + 1.6
DUR = round(END, 2)
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N); T = np.arange(N) / SR
def place(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    x = x[: N - i] * gain; L[i:i + len(x)] += x * np.sqrt(0.5 * (1 - pan)); R[i:i + len(x)] += x * np.sqrt(0.5 * (1 + pan))
tracks = {k: np.zeros(N) for k in ("peek", "commander", "crowe", "radio")}
caption_words = []
FIX = {"mi": "miles", "mph": "miles an hour", "mi/h": "miles an hour", "out.": "out.", "commander.": "Commander.", "moon,": "Moon,", "moon?": "Moon?", "moon.": "Moon.", "moon": "Moon",
       "stake,": "Stay...", "stake.": "stay...", "shoppers,": "shoppers.", "this": "this?", "peak?": "Peek.", "peak.": "Peek.", "one?": "one:", "theory?": "Theory:", "bang,": "bang."}   # speech-to-text fixes for the captions   # speech-to-text fixes for the captions
def fixw(w): return re.sub(r"(?i)\bpeak\b", "Peek", FIX.get(w.lower(), w))
def say(who, y, words, at, gain, line, treat=None):
    z = treat(y) if treat else y
    i = int(at * SR); n = min(len(z), N - i); tracks[who][i:i + n] += z[:n] * gain
    for s, e, w in words: caption_words.append({"t": round(at + s, 3), "e": round(at + e, 3), "w": fixw(w), "who": who, "line": line})
def pa(y):                                             # the store's loudspeakers: band-limited, a little grit, the hall's echoes
    z = bp(y, 250, 4200); z = np.tanh(z * 2.2) / 2.2
    out = np.concatenate([z, np.zeros(int(1.2 * SR))])
    for d, g in ((0.11, 0.45), (0.23, 0.3), (0.37, 0.2), (0.55, 0.12)): i = int(d * SR); out[i:i + len(z)] += lp(z, 2500) * g
    return out
def radio(y):                                          # the detector's tiny speaker: narrow, crackly
    z = bp(y, 600, 2800); z = np.tanh(z * 4) / 4 + bp(noise(len(z)), 2000, 6000) * 0.012 * (rng.random(len(z)) < 0.08)
    return z

say("peek", fades(norm(yD, 0.8)), wD, LINE_AT["drop"], 1.0, 1)
say("peek", fades(norm(yO, 0.55)), wO, OHNO, 1.0, 2)
say("peek", norm(repA, 0.8), wA[: cut + 1], RS + 0.15, 1.0, 10)
for k, at in enumerate((I_ATT, I_HYS)): say("crowe", fades(norm(crowe_lines[k][0], 0.8)), crowe_lines[k][1], at, 1.0, 20 + k, pa)
say("peek", norm(repB, 0.72), wB, BS, 1.0, 30)
say("radio", fades(norm(radio_src, 0.6)), [(s - po0, e - po0, w) for s, e, w in wB[po_i:]], PO, 1.0, 40, radio)
if len(crowe_lines) > 2: say("crowe", fades(norm(crowe_lines[2][0], 0.8)), crowe_lines[2][1], CPEEK, 1.0, 41)

# ---------------------------------------------------------------- beats (for the pictures)
A0, B0 = RS + 0.15, BS
rwA = [(A0 + s, A0 + e, clean(w)) for s, e, w in wA[: cut + 1]]
rwB = [(B0 + s, B0 + e, clean(w)) for s, e, w in wB]
beats, idx = {}, 0
orderA = [("report", "commander field|field report"), ("ran", "i ran"), ("accident", "by accident"), ("agent", "right above"), ("remember", "remember"),
          ("ball40", "the ball is"), ("pull40", "so their planet|so their"), ("theory", "theory"), ("first", "the ball lands|lands first"), ("wrong", "wrong"),
          ("land2", "they landed"), ("bang", "one bang"), ("because", "because the ball|because")]
for key, seq in orderA:
    idx = find(rwA, seq, idx, "reportA"); beats[key] = round(rwA[idx][0], 3)
beats["cut"] = round(IS, 3)
idx = 0
orderB = [("harder", "is also|also"), ("carts", "same push"), ("empty", "the empty"), ("full", "the full"), ("stuff", "more pull"), ("evens", "it evens"),
          ("speeds", "everything speeds"), ("mph", "twentytwo|twenty two|22"), ("second", "every second"), ("feather", "except a feather|except"), ("air", "air pushes"),
          ("wide", "but on|on light"), ("moon", "on their moon"), ("astro", "an astronaut"), ("together", "they landed"), ("sum1", "so more"), ("sum2", "but harder"),
          ("sum3", "only air"), ("question", "which raises"), ("bunny", "up there"), ("weigh", "so why"), ("out", "investigating"), ("peekout", "peek out")]
for key, seq in orderB:
    idx = find(rwB, seq, idx, "reportB"); beats[key] = round(rwB[idx][0], 3)
beats["end"] = round(rwB[-1][1], 3)
beats.update({"stay2": round(STAY2, 3), "ifgoes": round(IFGOES, 3), "heavyw": round(HEAVYW, 3), "yank": round(YANK, 3), "feeds": round(FEEDS, 3), "hat": round(HAT, 3), "pillow": round(PILLOW, 3), "static": round(STATIC, 3), "turn": round(TURN, 3), "land": round(LAND, 3), "ohno": round(OHNO, 3), "title": round(TITLE, 3),
              "chime": round(CHIME, 3), "att": round(I_ATT, 3), "att_end": round(I_ATT + crowe_lines[0][1][-1][1], 3), "hys": round(I_HYS, 3), "hys_this": round(I_HYS + crowe_lines[1][1][-1][0], 3),
              "hys_end": round(I_HYS + crowe_lines[1][1][-1][1], 3), "tvw": round(TVW, 3), "po": round(PO, 3), "po_end": round(PO + po1 - po0, 3), "cpeek": round(CPEEK, 3), "tagline_end": round(TAG_END, 3)})

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
def pluck(f, d=0.5, bright=0.5):
    n = int(d * SR); t = tx(n); return (np.sin(2 * np.pi * f * t) + bright * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 14) + 0.2 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 22)) * np.exp(-t * 7) * np.minimum(1, t / 0.004)
def pop(f=900): n = int(0.09 * SR); t = tx(n); return np.sin(2 * np.pi * f * t * (1 + 3 * t)) * np.exp(-t * 45)
def beep(f=1760, d=0.07): n = int(d * SR); t = tx(n); return np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.003) * np.exp(-t * 20)
def heart():
    n = int(0.5 * SR); t = tx(n)
    return lp(np.sin(2 * np.pi * 48 * t) * np.exp(-t * 18) + 0.7 * np.sin(2 * np.pi * 42 * (t - 0.18)) * np.exp(-np.clip(t - 0.18, 0, None) * 18) * (t > 0.18), 200)
def crack(d=0.5):
    n = int(d * SR); t = tx(n); return bp(noise(n), 1500, 9000) * np.exp(-t * 14) * (rng.random(n) < 0.35) * 1.6 + thud(300, 40, d) * 0.3
def step(f=150): return thud(f, 60, 0.12) * 0.7 + bp(noise(int(0.12 * SR)), 1500, 5000) * np.exp(-tx(int(0.12 * SR)) * 50) * 0.3
def chime(f1=659.3, f2=523.3):
    n = int(1.6 * SR); t = tx(n); b = lambda f, s: np.sin(2 * np.pi * f * (t - s)) * np.exp(-np.clip(t - s, 0, None) * 2.6) * (t >= s) * (1 + 0.3 * np.sin(2 * np.pi * 2 * f * (t - s)))
    return b(f1, 0) + b(f2, 0.42)
def rustle(d=0.3): n = int(d * SR); return bp(noise(n), 1500, 6000) * np.sin(np.pi * tx(n) / d) * 0.5

# the store at night: the hum of the lights and the fridges, quiet under the reports
amb = lp(noise(N), 500) * 0.4 + np.sin(2 * np.pi * 120 * T) * 0.08 + bp(noise(N), 3000, 8000) * 0.05
ag = np.where(T < RS, 0.03, 0.0) + np.where((T >= IS) & (T < BS + 0.9), 0.02, 0.0) + np.where(T >= TS, 0.025, 0.0) + np.where((T >= RS) & (T < TS), 0.008, 0.0)
ag = lp(ag, 6); L += amb * ag; R += np.roll(amb, 2400) * ag

# ---- cold open: the plank, the fall, the landing, Crowe's steps, the held silence, "Oh... no.", the title
def creak(d=0.5, f=180):
    n = int(d * SR); t = tx(n); return bp(signal.sawtooth(2 * np.pi * (f + 60 * np.sin(2 * np.pi * 3 * t)) * t) * (rng.random(n) < 0.6), 300, 2500) * np.sin(np.pi * t / d)
for s_ in (0.5, 1.6, IFGOES - 0.2, HEAVYW + 0.1): place(creak(0.45, 160 + 40 * rng.random()), s_, 0.12, 0.2)   # the plank, teetering
for i in range(int((GO - 0.2) / 0.5)): place(heart(), 0.2 + i * 0.5, 0.5)
place(creak(0.3, 120), GO - 0.25, 0.2); place(whoosh(0.18, 400, 2500), GO - 0.02, 0.2); place(thud(300, 60, 0.1), GO + 0.12, 0.25, 0.3)   # it swings down, clacks against the rack
n = int(FALL * SR); t = tx(n); place(bp(noise(n), 300, 4000) * (t / FALL) ** 1.5, YANK, 0.28)   # the air rushing past
for s_ in np.arange(YANK - 0.55, LAND - 0.1, 0.42): place(step(120), s_, 0.18, -0.4)   # Crowe walks in under them
place(boom(1.2), LAND, 0.6); place(crack(), LAND, 0.4, -0.2)                            # the ball, the tile
place(pop(1400), LAND, 0.35, 0.25); place(pop(1100), LAND + 0.32, 0.18, 0.3); place(pop(1000), LAND + 0.55, 0.08, 0.3)   # the apple, bouncing
for s_ in (LAND + 0.95, LAND + 1.45, LAND + 2.05): place(rustle(0.25), s_, 0.12)          # he looks down, across, up
for i in range(3): place(heart(), OHNO - 0.5 + i * 0.45, 0.55)
place(thud(70, 9, 0.6), TITLE, 0.5)
for i, f in enumerate((392, 523.3, 659.3)): place(pluck(f, 0.6), TITLE + 0.03 + i * 0.07, 0.07)

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
for key in ("ran", "remember", "ball40", "theory", "because"): place(whoosh(0.24, 500, 3500), beats[key] - 0.22, 0.08)
for key in ("accident", "agent", "pull40", "first", "land2"): place(pop(700 + 40 * (len(key) % 7)), beats[key] + 0.02, 0.07)
place(thud(240, 40, 0.2), beats["wrong"] + 0.15, 0.3); place(boom(0.5), beats["bang"] + 0.1, 0.12)                                     # the WRONG stamp

# ---- the interruption: the chime, the voice on the speakers, the TV wall switching on, Peek's heart
place(chime(), CHIME, 0.22)
for i in range(9): place(beep(1600 - 60 * i, 0.03), FEEDS + i * 0.05, 0.05, -0.6 + 0.15 * i)   # the screens flick to the cameras
n = int(0.45 * SR); place(bp(noise(n), 2000, 5000) * (0.6 + 0.4 * np.sin(2 * np.pi * 40 * tx(n))) * np.sin(np.pi * tx(n) / 0.45), FEEDS + 0.05, 0.08)   # the camera's motor
place(beep(2900, 0.05), PILLOW + 0.05, 0.08)                                              # its red light
place(thud(140, 30, 0.25), STATIC - 0.03, 0.3); n = int(1.0 * SR); place(bp(noise(n), 3000, 9000) * np.exp(-tx(n) * 2.5), STATIC, 0.07)   # the pillow, the static
place(step(120), TURN + 0.45, 0.18, -0.2)                                                  # Crowe's step toward the monitors
drone = sum(np.sin(2 * np.pi * f * T) for f in (55, 65.4, 82.4)); dg = np.interp(T, [IS, IS + 0.6, BS + 0.6, BS + 2.0, TS - 0.2, TS + 0.4, END - 0.3, END], [0, 0.05, 0.05, 0.018, 0.018, 0.05, 0.07, 0])
place(lp(drone, 400) * dg, 0)
n = int(0.3 * SR); place(bp(noise(n), 600, 3000) * np.exp(-tx(n) * 12), I_HYS - 0.35, 0.12)   # he lifts the plush
for i in range(9): place(beep(2400 + 80 * i, 0.03), TVW + 0.04 + i * 0.04, 0.05, -0.6 + 0.15 * i)   # the screens switch over, one by one
for i in range(4): place(heart(), HAT + i * 0.45, 0.6)

# ---- report B: a quieter bed, small sounds on the beats; the jump into the pillows
bed(BS + 0.9, TS - 0.6, 0.06, 2)
for key in ("carts", "stuff", "speeds", "feather", "moon", "sum1", "question"): place(whoosh(0.24, 500, 3500), beats[key] - 0.22, 0.07)
n = int(0.9 * SR); place(bp(noise(n), 1500, 6000) * (rng.random(n) < 0.3) * np.exp(-tx(n) * 3), beats["empty"] + 0.1, 0.06, 0.4)   # the empty cart rattles off
for key in ("full", "evens", "second", "air", "astro", "together", "sum2", "sum3", "bunny"): place(pop(650 + 30 * (len(key) % 5)), beats[key] + 0.02, 0.06)
place(thud(90, 20, 0.4), beats["peekout"] + 1.5, 0.25); place(rustle(1.2), beats["peekout"] + 1.5, 0.15)   # the pillows, the feathers

# ---- the tag: the detector's crackle and playback, then the hit when the next question lands
n = int(0.4 * SR); place(bp(noise(n), 1500, 6000) * (rng.random(n) < 0.2) * np.exp(-tx(n) * 6), PO - 0.35, 0.12)
s_, gap = TAG_END + 0.1, 0.4
while s_ < END - 0.1: place(beep(1900, 0.05), s_, 0.08, 0.2); gap = max(0.09, gap * 0.88); s_ += gap
bn = int(1.6 * SR); bt = tx(bn)
place(lp(sum(signal.sawtooth(2 * np.pi * f * bt) for f in (43.65, 43.9, 87.3, 65.4)), 600) * np.clip(bt / 0.02, 0, 1) * np.exp(-bt * 1.5), NEXT, 0.26)
beats["next"] = round(NEXT, 3)

place(tracks["peek"], 0, 1.55); place(tracks["commander"], 0, 1.3, -0.2); place(tracks["crowe"], 0, 1.5, -0.15); place(tracks["radio"], 0, 1.3, -0.1)
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
print(f"{a.out}: {DUR} s{' (PLACEHOLDER voices)' if a.placeholder else ''}; cold open 0-{RS:.2f}; A {RS}-{IS:.2f} ({IS - RS:.1f} s); interruption {IS:.2f}-{BS:.2f} ({BS - IS:.1f} s); B {BS:.2f}-{TS:.2f} ({TS - BS:.1f} s); tag {TS:.2f}-{END:.2f} ({END - TS:.1f} s)")
print(beats)
