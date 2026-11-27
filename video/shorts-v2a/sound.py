#!/usr/bin/env python3
"""Sound for the bleach Short: every effect is synthesised here (no samples) and lands on the same word cues as the
picture; a light music bed follows the scenes. Then voice + effects + music are mixed to about -15 LUFS.
usage: sound.py timeline.json data.json voice.wav out_mix.wav"""
import json, sys, subprocess, wave, re
import numpy as np
SR = 48000; TAU = 2 * np.pi
tl = json.load(open(sys.argv[1])); D = json.load(open(sys.argv[2])); TOTAL = D["total"]
W = lambda n, i: tl["lines"][n - 1]["words"][i]["s"]; LS = lambda n: tl["lines"][n - 1]["t0"]; LE = lambda n: tl["lines"][n - 1]["t1"]
S = dict(s2=W(3, 0) - 0.3, s3=W(4, 0) - 0.14, s4=W(5, 0) - 0.1, s5=W(6, 0) - 0.18, s6=LS(8), s7=W(9, 0) - 0.1, rinse=W(9, 8) - 0.16, s8=W(10, 0) - 0.14, s9=W(11, 0) - 0.12, s10=LS(12), end=tl["voice_end"] - 0.14)
rs = np.random.RandomState(7)
def tt(d): return np.arange(int(d * SR)) / SR
def noise(d, lo=0, hi=24000):
    n = int(d * SR); x = rs.randn(n); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); X[(f < lo) | (f > hi)] = 0; y = np.fft.irfft(X, n); return y / (np.max(np.abs(y)) + 1e-9)
def env(t, a=0.005, r=8): return np.minimum(1, t / a) * np.exp(-t * r)
def sweepn(d, f0, f1, bw=0.5, g=1):           # noise whose band slides from f0 to f1: whooshes
    n = int(d * SR); out = np.zeros(n); k = 8
    for j in range(k):
        a, b = int(j * n / k), int((j + 1) * n / k); fc = f0 * (f1 / f0) ** ((j + .5) / k); seg = noise((b - a) / SR + 0.02, fc * (1 - bw / 2), fc * (1 + bw / 2))[:b - a]; out[a:b] = seg
    t = tt(d)[:n]; return out * np.sin(np.pi * t / d) ** 1.5 * g
def tone(f, d, r=6, a=0.004, harm=(1, 0.3, 0.1), vib=0):
    t = tt(d); ph = TAU * np.cumsum(np.full(len(t), 1.0) * (f if np.isscalar(f) else f)) / SR
    if vib: ph = ph + vib * np.sin(TAU * 6 * t)
    return sum(h * np.sin((i + 1) * ph) for i, h in enumerate(harm)) * env(t, a, r)
def glide(f0, f1, d, r=5, harm=(1, .2)): t = tt(d); return tone(f0 * (f1 / f0) ** (t / d), d, r, harm=harm)
note = lambda semi: 220.0 * 2 ** (semi / 12)       # semitones from A3
def add(*a):
    n = max(len(x) for x in a); out = np.zeros(n)
    for x in a: out[:len(x)] += x
    return out
class Bus:
    def __init__(s): s.x = np.zeros(int((TOTAL + 1) * SR))
    def put(s, t, y, g=1.0):
        a = int(max(0, t) * SR); b = min(len(s.x), a + len(y))
        if b > a: s.x[a:b] += y[:b - a] * g
fx = Bus(); mu = Bus()
# ---- effects
def thud(g=1, f=70): t = tt(0.35); return (np.sin(TAU * (f * t + 40 * (1 - np.exp(-t * 20)) / 20)) * np.exp(-t * 11) + noise(0.35, 80, 900) * np.exp(-t * 40) * 0.5) * g
def click(f=2400, g=1): t = tt(0.06); return (noise(0.06, 1500, 9000) * np.exp(-t * 160) + np.sin(TAU * f * t) * np.exp(-t * 110) * 0.5) * g
def ding(semi, g=1, d=0.9): return add(tone(note(semi + 24), d, 5, harm=(1, 0, 0.35, 0, 0.12)), tone(note(semi + 36), d * 0.6, 9, harm=(0.4,))) * g
def poof(g=1): return add(sweepn(0.5, 300, 1800, 0.9) * 0.8, glide(160, 70, 0.4, 7) * 0.7) * g
def hiss(d=0.5, g=1): t = tt(d); return noise(d, 3500, 11000) * np.minimum(1, t / 0.02) * np.exp(-t * (3.2 / d)) * g
def whoosh(d=0.4, up=True, g=1): return sweepn(d, 300 if up else 3000, 3000 if up else 300, 0.8, g)
def boing(g=1): t = tt(0.4); f = 260 + 220 * np.exp(-t * 9) * np.cos(TAU * 9 * t); return np.sin(TAU * np.cumsum(f) / SR) * env(t, 0.004, 8) * g
def cough(g=1): t = tt(0.2); return (noise(0.2, 300, 2600) * np.minimum(1, t / 0.008) * np.exp(-t * 24) + glide(200, 120, 0.2, 18) * 0.5) * g

def siren(d, g=1): t = tt(d); f = 700 + 260 * np.sign(np.sin(TAU * 3.2 * t)); return (np.sin(TAU * np.cumsum(f) / SR) * 0.6 + np.sin(2 * TAU * np.cumsum(f) / SR) * 0.2) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.08) * g
def water(d, g=1): t = tt(d); return noise(d, 500, 5000) * (0.6 + 0.4 * np.sin(TAU * 11 * t + 3 * np.sin(TAU * 3 * t))) * np.minimum(1, t / 0.08) * np.minimum(1, (d - t) / 0.15) * g
def chirp(g=1): return np.concatenate([glide(2600, 3900, 0.07, 20, (1,)), np.zeros(int(.04 * SR)), glide(3000, 4300, 0.06, 20, (1,))]) * g
def choir(d, g=1):
    t = tt(d); out = np.zeros(len(t))
    for semi, a in ((3, 1), (7, .8), (10, .8), (15, .6), (19, .4)):
        for det in (-0.06, 0.05): out += a * np.sin(TAU * note(semi + det) * t + 0.4 * np.sin(TAU * 5.2 * t))
    return out * np.minimum(1, t / 0.25) * np.minimum(1, (d - t) / 0.4) * g / 6
def trill(d, g=1): t = tt(d); f = 1250 + 330 * np.sign(np.sin(TAU * 13 * t)); return np.sin(TAU * np.cumsum(f) / SR) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.1) * (0.7 + 0.3 * np.sin(TAU * 13 * t)) * g
def bell(g=1): t = tt(2.2); return sum(a * np.sin(TAU * f * t) * np.exp(-t * r) for f, a, r in ((1318, 1, 2.2), (2637, .5, 3.5), (3951, .3, 5), (5274, .15, 7), (1975, .25, 3))) * np.minimum(1, t / 0.002) * g

P = fx.put
P(0.0, noise(2.6, 2500, 9000) * np.linspace(0.5, 1, int(2.6 * SR)) * (0.6 + 0.4 * np.sin(TAU * 7 * tt(2.6))), 0.035)
P(0.0, whoosh(0.35, True), 0.25); P(W(1, 4) - 0.1, poof(), 0.4); P(W(1, 5), tone(note(-21), 0.9, 3, harm=(1, .5, .3)), 0.22); P(W(1, 5), tone(note(-15), 0.9, 3, harm=(1, .5, .3)), 0.18)
P(W(2, 0), boing(), 0.0); P(W(2, 3) + 0.05, glide(900, 300, 0.32, 6, (1, .3)), 0.14)
P(S["s2"], whoosh(0.5), 0.35); a = S["s2"]; P(a + 0.6, thud(), 0.5)
tie = W(3, 2) - 0.05; tug = W(3, 3) + 0.12; glove = W(3, 4) - 0.1; snap = glove + 0.42; war = W(3, 5); lunge = W(3, 6) + 0.02
P(tie, whoosh(0.2), 0.15); P(tug, hiss(0.12), 0.3); P(tug, click(900), 0.4); P(glove + 0.1, glide(300, 700, 0.28, 3, (1, .4)), 0.12); P(snap, click(3000), 0.9); P(snap, hiss(0.1), 0.4)
P(war - 0.2, whoosh(0.22), 0.3); P(war, tone(note(27), 1.0, 4, harm=(1, 0, .5, 0, .3)), 0.14); P(war, thud(1, 55), 0.7); P(war + 0.12, click(700), 0.9); P(war + 0.12, thud(0.6, 140), 0.5); P(lunge - 0.05, whoosh(0.25), 0.35)
for k in range(8): P(lunge + 0.15 + k * 0.07, click(500 + k * 20, 0.25), 0.5)
P(S["s3"], whoosh(0.45), 0.3); P(S["s3"] - 0.18, ding(12, d=0.3), 0.12); P(S["s3"] - 0.12, ding(16, d=0.3), 0.12)
b1 = W(4, 2) - 0.1; c1 = W(4, 3); b2 = W(4, 4) - 0.1; c2 = W(4, 5) + 0.1; b3 = W(4, 7) - 0.12; born = W(4, 8) - 0.05
for i, b in enumerate((b1, b2, b3)): P(b, whoosh(0.3, False), 0.18); P(b + 0.3, thud(0.8, 90 + i * 20), 0.5); P(b + 0.3, tone(note(i * 2 - 2), 0.3, 12), 0.2)
P(c1, ding(7), 0.22); [P(c2 + k * 0.08, ding(7 + 2 * k + 2), 0.2) for k in range(3)]
P(b3 + 0.45, np.concatenate([click(300, 0.5)] * 1), 0.3)
for k in range(10): P(born - 0.05 + k * 0.045, ding([0, 3, 7, 10, 12, 15, 19, 22, 24, 27][k], d=0.5), 0.1)
P(born, choir(S["s4"] - born + 0.05), 0.5)
P(S["s4"], glide(1500, 120, 0.28, 3, (1, .5, .3)), 0.25); P(S["s4"] + 0.22, click(1800), 0.8)
inB = W(5, 1) - 0.12; P(inB + 0.3, thud(1, 60), 0.6)
hits = [W(5, 3) - 0.18 + 0.3, W(5, 6) - 0.22 + 0.3, W(5, 9) - 0.3 + 0.3]
for i, h in enumerate(hits): P(h - 0.3, whoosh(0.3), 0.25); P(h, click(1000), 0.5); P(h, hiss(0.6), 0.32); P(h, glide(180 + i * 40, 330 + i * 60, 0.35, 5), 0.16)
gasW = W(5, 12) - 0.06; samW = W(5, 13)
P(W(5, 11) - 0.05, hiss(0.5), 0.25); P(gasW, poof(), 0.6); P(gasW, hiss(1.0), 0.35); P(samW, tone(note(-21), 1.2, 2.5, harm=(1, .6, .4, .2)), 0.3); P(samW, tone(note(-20), 1.2, 2.5, harm=(1, .6, .4)), 0.22); P(samW + 0.1, whoosh(0.5), 0.3)
c1_ = W(6, 0) - 0.04; eyeT = W(6, 1) - 0.05; chestT = W(6, 3) - 0.05; she = W(7, 0) - 0.05; proud = W(7, 1) - 0.06; sniff = W(7, 2) - 0.05; end7 = LE(7) + 0.12
P(c1_, cough(), 0.5); P(c1_ + 0.3, cough(), 0.45); P(c1_, ding(-2, d=0.25), 0.12); P(eyeT, hiss(0.45), 0.22); P(eyeT, ding(0, d=0.25), 0.12); P(chestT, ding(2, d=0.25), 0.12)
for k in range(3): P(chestT + 0.05 + k * 0.28, thud(0.8, 50), 0.5)
P(proud - 0.15, whoosh(0.18), 0.2); P(proud, ding(12, d=0.5), 0.2); P(proud + 0.1, ding(19, d=0.7), 0.2)
P(sniff + 0.1, sweepn(LE(7) - sniff, 500, 3500, 1.0), 0.22); P(end7, cough(), 0.5)
P(S["s6"], thud(1.2, 45), 0.8); P(S["s6"], whoosh(0.25), 0.4)
P(W(8, 4) - 0.02, siren(S["s7"] - W(8, 4) + 0.02), 0.13); P(W(8, 5), thud(1, 50), 0.6)
a7 = S["s7"]; P(a7, whoosh(0.3, False), 0.3); P(a7 + 0.3, thud(1.1, 62), 0.75)
for i, h in enumerate((W(9, 2) + 0.02, W(9, 4) - 0.02, W(9, 5) + 0.2)): P(h - 0.08, whoosh(0.26), 0.25); P(h + 0.2, boing(), 0.3); P(h + 0.2, click(800), 0.6)
for i in range(1, 7): P(W(9, i), click(1500 + i * 60, 0.5), 0.3)
never = W(9, 7) - 0.03; [P(never + 0.02 + i * 0.11, thud(1, 110), 0.6) or P(never + 0.02 + i * 0.11, click(1000), 0.5) for i in range(3)]
P(S["rinse"] - 0.22, water(0.8), 0.3); P(S["rinse"] - 0.2, whoosh(0.6, False), 0.25)
pour = W(9, 8) + 0.1; winT = W(9, 14) + 0.02; P(pour + 0.12, water(winT - pour + 0.05), 0.2)
P(winT, glide(500, 900, 0.18, 4, (1, .5)), 0.1); P(winT + 0.3, click(900), 0.5); P(winT + 0.15, whoosh(0.5), 0.25); P(winT + 0.45, chirp(), 0.12)
a8 = S["s8"]; P(a8, whoosh(0.4), 0.4)
out = W(10, 2) - 0.1; air = W(10, 4) - 0.05; hard = W(10, 6) - 0.05; call = W(10, 9) - 0.08; amb = W(10, 10) - 0.02; what = W(10, 13) - 0.06
for k in range(int((out + 0.42 - a8) / 0.196)): P(a8 + 0.08 + k * 0.196, thud(0.5, 120), 0.3)
P(a8 + 0.1, cough(), 0.3); P(air, sweepn(0.9, 400, 2500, 1.0), 0.3); P(air + 0.3, chirp(), 0.12); P(air + 0.75, chirp(), 0.09)
for k in range(3): P(hard + 0.1 + k * 0.37, sweepn(0.2, 900, 1600, 0.8), 0.12)
P(call, click(2000), 0.3); [P(call + 0.25 + k * 0.16, tone(1400, 0.09, 4, harm=(1,)), 0.1) for k in range(2)]
P(amb, ding(9, d=0.4), 0.2); P(amb + 0.05, siren(0.62), 0.07); P(what, ding(4, d=0.4), 0.2); P(what, click(1500), 0.3)
a9 = S["s9"]; P(a9 - 0.3, sweepn(0.6, 800, 5000, 0.8), 0.25)
q = W(11, 0); shineT = W(11, 1) - 0.05; stand = W(11, 3) - 0.15; as_ = W(11, 6) - 0.05; med = W(11, 8) - 0.08; done = W(11, 9) + 0.12
P(q, click(700), 0.5); P(q + 0.26, click(700), 0.5); [P(shineT + k * 0.09, ding(12 + [0, 4, 7, 12][k]), 0.16) for k in range(4)]; P(shineT, sweepn(0.5, 2000, 7000, 0.6), 0.15)
P(stand, whoosh(0.4), 0.2); P(stand + 0.5, thud(0.5, 100), 0.3); P(as_, whoosh(0.3), 0.2); P(as_ + 0.05, ding(7, d=0.4), 0.15)
P(med, whoosh(0.3, False), 0.25); P(med + 0.34, click(600), 0.8); P(med + 0.34, thud(0.6, 130), 0.4)
P(done, noise(0.25, 1500, 9000) * np.exp(-tt(0.25) * 18), 0.35); P(med + 0.3, trill(min(1.15, S["s10"] - med - 0.5)), 0.085)
for k, s_ in enumerate((0, 4, 7, 12)): P(done + k * 0.1, tone(note(s_ + 3), 0.5 if k < 3 else 0.9, 4, harm=(1, .5, .35, .2)), 0.12)
a10 = S["s10"]; P(a10 - 0.22, whoosh(0.45, False), 0.3); P(a10 + 0.05, whoosh(0.3), 0.2)
shy = W(12, 6) + 0.1; P(shy, sweepn(0.3, 500, 1200, 0.9), 0.14); P(shy + 0.35, glide(700, 350, 0.25, 7, (1, .3)), 0.07)
P(W(13, 0) - 0.05, click(1800), 0.35); P(W(13, 0) - 0.12, whoosh(0.18), 0.15)
aE = S["end"]; P(aE, whoosh(0.4), 0.35); P(aE + 0.36, bell(), 0.3); P(aE + 0.9, bell(), 0.14); P(aE + 0.34, thud(0.6, 80), 0.3); P(aE + 0.46, thud(0.6, 70), 0.3)

# ---- music: a sneaky plucked bass and marimba that change character with the scenes
def pluck(semi, d=0.5, g=1): return tone(note(semi - 24), d, 7, 0.003, (1, .5, .25, .12)) * g
def marimba(semi, g=1): return add(tone(note(semi), 0.5, 9, 0.002, (1, 0, 0, .25)), tone(note(semi + 12), 0.2, 22, 0.002, (0.3,))) * g
def shaker(g=1): t = tt(0.06); return noise(0.06, 5000, 12000) * np.exp(-t * 70) * g
def pad(semis, d, g=1):
    t = tt(d); out = sum(np.sin(TAU * note(s) * t) + 0.5 * np.sin(TAU * note(s) * 1.003 * t) for s in semis); return out * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.5) * g / len(semis)
BPM = 104; beat = 60 / BPM
def section(t0, t1, riff, lead=None, shake=True, g=1.0):
    k = 0; t = t0
    while t < t1 - 0.05:
        s = riff[k % len(riff)]
        if s is not None: mu.put(t, pluck(s, 0.45), 0.5 * g)
        if lead and lead[k % len(lead)] is not None: mu.put(t, marimba(lead[k % len(lead)]), 0.22 * g)
        if shake and k % 2 == 1: mu.put(t, shaker(), 0.12 * g)
        k += 1; t += beat / 2
sneak = [0, None, 3, None, 5, 6, 7, None, 0, None, 3, None, 2, None, -2, None]; sneakLead = [None, None, None, 12, None, None, None, 15, None, None, None, 12, None, 10, None, None]
march = [0, 0, 7, None, 0, 0, 7, 5, 3, 3, 10, None, 3, 3, 7, 5]; marchLead = [12, None, 15, 12, 19, None, 15, None, 15, None, 19, 15, 22, None, 19, None]
calm = [3, None, None, None, 10, None, None, None, 8, None, None, None, 10, None, None, None]
happy = [3, None, 10, None, 7, None, 10, None, 8, None, 12, None, 10, None, 14, None]; happyLead = [15, 19, 22, None, 19, 22, 27, None, 20, 24, 27, None, 22, 26, 29, None]
section(0.0, S["s2"], sneak, sneakLead, g=0.9); section(S["s2"], S["s3"], march, None, g=1.0); section(S["s3"], born, march, marchLead, g=0.9)
mu.put(S["s4"] + 0.3, pad([-12, -5, 0], S["s6"] - S["s4"] - 0.3), 0.16)
t = S["s4"] + 0.4
while t < S["s6"] - 0.1: mu.put(t, pluck(0 if int((t - S["s4"]) / beat) % 2 == 0 else 1, 0.3), 0.4); mu.put(t + beat / 2, shaker(), 0.1); t += beat
section(S["s7"] + 0.4, S["s8"], calm, None, shake=False, g=1.0); mu.put(S["s7"] + 0.4, pad([3, 10, 15], S["s8"] - S["s7"] - 0.4), 0.13)
section(S["s8"] + 0.3, hard, happy, None, g=0.8); mu.put(hard, pad([0, 7, 12], call - hard + 0.3), 0.12); section(call + 0.3, S["s9"] - 0.2, calm, None, shake=False, g=0.9)
section(S["s9"] + 0.2, med + 0.2, happy, happyLead, g=0.95)
section(S["s10"] + 0.3, S["end"] - 0.1, sneak, sneakLead, g=0.85)

def load(p):
    f = wave.open(p); x = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(np.float64) / 32768; assert f.getframerate() == SR; return x
def save(p, x):
    f = wave.open(p, "w"); f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); f.close()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", sys.argv[3], "-af", "highpass=f=70,acompressor=threshold=-22dB:ratio=3:attack=4:release=90:makeup=2.2", "-ar", str(SR), sys.argv[4] + ".voice.wav"], check=True)
v = load(sys.argv[4] + ".voice.wav"); n = int(TOTAL * SR); voice = np.zeros(n); voice[:min(n, len(v))] = v[:n]
# duck the music a little under the voice
H = SR // 50; lv = np.array([np.sqrt(np.mean(voice[i:i + H] ** 2)) for i in range(0, n, H)]); talk = (lv > 0.01).astype(float); sm = np.zeros(len(talk)); q = 0.0
for i in range(len(talk)): q += (talk[i] - q) * (0.3 if talk[i] > q else 0.06); sm[i] = q
duck = np.repeat(1 - 0.45 * sm, H)[:n]
mix = voice + fx.x[:n] * float(sys.argv[5] if len(sys.argv) > 5 else 0.5) + mu.x[:n] * duck * float(sys.argv[6] if len(sys.argv) > 6 else 0.17)
fade = int(0.25 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
out = sys.argv[4]; save(out + ".raw.wav", mix * 0.7); save(out + ".fx.wav", fx.x[:n] * 0.5); save(out + ".music.wav", mu.x[:n] * 0.5)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", out + ".raw.wav", "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1]); gain = -15.0 - I
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out + ".raw.wav", "-af", f"volume={gain:.2f}dB,alimiter=limit=0.89:attack=3:release=60:level=disabled", "-ar", "48000", out], check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
print("integrated", re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1], "LUFS, true peak", re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r)[-1], "dBFS, gain applied", round(gain, 2))
