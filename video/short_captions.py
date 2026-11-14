"""Subtitles for an episode's Shorts, in each Short's own timeline (the cut short.cjs makes), in the episode's
language and in a dub language.

  python3 short_captions.py <episode dir> <video cues.json> <dub words.json> <dub closing lines dir> <out dir> [--video-dir <dir>]

The episode language comes from the episode's transcript.json, re-spelled from its script (source_text) so the lines
read as written; each Short's closing line from youtube/shorts/cta-lines.json and its words file. The dub language
comes from `dub.cjs --words` (the dub's words in the video's cue time) and the closing line's recording
<dir>/<prefix><key>.wav with its .transcript.json (prefix via --cta-prefix). Writes <out>/<key>-<lang>.srt."""
import json, re, subprocess, sys, os
arg = sys.argv[1:]
def opt(name, default=None):
    if name in arg: i = arg.index(name); v = arg[i + 1]; del arg[i:i + 2]; return v
    return default
VIDEO_DIR, CTA_PREFIX, LANGS = opt("--video-dir"), opt("--cta-prefix", ""), opt("--langs", "ar,en").split(",")
EP, CUES, EN_WORDS, CTA_DIR, OUT = arg[:5]
_c = json.load(open(CUES)); TEMPO, LEAD, FPS = _c.get("tempo", 1), _c.get("lead", 0), 30
spec = json.load(open(f"{EP}/youtube/shorts.json"))
import difflib
def norm(x):
    x = re.sub(r"[\u064B-\u0652\u0640]", "", x); x = re.sub(r"[^\w]", "", x)
    return x.translate(str.maketrans("أإآةىؤئ", "اااهيوي")).lower()
def to_script(words, text):
    """The script's own words (spelling, punctuation) with the times speech recognition heard them at."""
    src = re.sub(r"<[^>]+>", " ", text).split(); a = [norm(x) for x in src]; b = [norm(w["t"]) for w in words]; out = [None] * len(src)
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == "equal":
            for k in range(i2 - i1): out[i1 + k] = dict(s=words[j1 + k]["s"], e=words[j1 + k]["e"], t=src[i1 + k])
        elif i2 > i1:
            if j2 > j1: t0, t1 = words[j1]["s"], words[j2 - 1]["e"]
            else: t0 = words[j1 - 1]["e"] if j1 > 0 else 0; t1 = words[j1]["s"] if j1 < len(words) else t0 + 0.3
            n = i2 - i1; L = sum(len(x) for x in src[i1:i2]) or 1; c = t0
            for k in range(n):
                d = (t1 - t0) * len(src[i1 + k]) / L; out[i1 + k] = dict(s=c, e=c + d, t=src[i1 + k]); c += d
    return out
CTA = json.load(open(f"{EP}/youtube/shorts/cta-lines.json"))
_t = json.load(open(f"{EP}/transcript.json"))
ar_words = to_script([dict(s=w["start_ms"] / 1000 / TEMPO, e=max(w["end_ms"], w["start_ms"] + 60) / 1000 / TEMPO, t=w["text"]) for w in _t["words"]], _t["source_text"])


def group(ws, maxw=7):          # words -> lines, breaking at sentence ends, at commas once a line has 4 words, at length or pauses
    lines, cur = [], []
    for i, w in enumerate(ws):
        cur.append(w); nx = ws[i + 1] if i + 1 < len(ws) else None
        if not nx or re.search(r"[.!?:;؟…]$", w["t"]) or (re.search(r"[،,]$", w["t"]) and len(cur) >= 4) or len(cur) >= maxw or nx["s"] - w["e"] > 0.6:
            lines.append((cur[0]["s"], cur[-1]["e"], " ".join(x["t"] for x in cur))); cur = []
    return lines

def fold(lines):
    out = []
    for s, e, t in lines:
        if out and len(t.split()) <= 2 and s - out[-1][1] < 0.35 and len(out[-1][2].split()) + len(t.split()) <= 10: out[-1] = (out[-1][0], e, out[-1][2] + " " + t)
        else: out.append((s, e, t))
    return out
en_words = json.load(open(EN_WORDS))["words"]

def frames(d): return round(d * FPS) / FPS
def dur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
def lead_silence(f):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", f, "-af", "silencedetect=n=-45dB:d=0.02", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"silence_start: (-?[\d.]+)\s.*?silence_end: ([\d.]+)", r, re.S)
    return float(m.group(2)) if m and float(m.group(1)) <= 0.01 else 0.0

def stamp(t):
    ms = max(0, round(t * 1000)); return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"
def write(path, cues):
    cues = sorted(cues); out = []
    for i, (s, e, t) in enumerate(cues):
        nx = cues[i + 1][0] if i + 1 < len(cues) else 1e9
        e = min(max(e + 0.25, s + 0.9), nx - 0.04)
        out.append(f"{i + 1}\n{stamp(s)} --> {stamp(e)}\n{t}\n")
    open(path, "w", encoding="utf8").write("\n".join(out))

for sh in spec["shorts"]:
    k = sh["key"]; ar, en = [], []; off = 0.0
    for a, b in sh["parts"]:
        hold = 0.15
        for s, e, t in fold(group([w for w in ar_words if a - 0.05 <= w["s"] < b])):
            ar.append((off + s - a, off + min(e, b + hold) - a, t))
        for s, e, t in fold(group([w for w in en_words if a - 0.05 <= w["s"] < b], 9)):
            en.append((off + max(s, a) - a, off + min(e, b + hold) - a, t))
        off += frames(b - a + hold)
    # the closing card
    cj = json.load(open(f"{EP}/youtube/{sh['end']['words']}")); cw = cj["words"]
    first, last = cw[0]["start_ms"] / 1000 / TEMPO, cw[-1]["end_ms"] / 1000 / TEMPO
    c0 = max(0, first - 0.08); room = (last + 0.3) - c0 + 1.0 - 0.3
    ws = [dict(s=w["start_ms"] / 1000 / TEMPO - c0, e=w["end_ms"] / 1000 / TEMPO - c0, t=w["text"]) for w in cw]
    ws = to_script(ws, CTA[k])
    ar += [(off + s, off + e, t) for s, e, t in fold(group(ws, 8))]
    ew = os.path.join(CTA_DIR, CTA_PREFIX + k)
    f = max(1, dur(ew + ".wav") / TEMPO / room); sil = lead_silence(ew + ".wav"); r = TEMPO * f
    ews = [dict(s=(w["start_ms"] / 1000 - sil) / r, e=(w["end_ms"] / 1000 - sil) / r, t=w["text"]) for w in json.load(open(ew + ".transcript.json"))["words"]]
    en += [(off + max(0, s), off + e, t) for s, e, t in fold(group(ews, 9))]
    total = off + frames((last + 0.3) - c0 + 1.0)
    os.makedirs(OUT, exist_ok=True); write(f"{OUT}/{k}-{LANGS[0]}.srt", ar); write(f"{OUT}/{k}-{LANGS[1]}.srt", en)
    have = f", video {dur(os.path.join(VIDEO_DIR, k + '.mp4')):.2f} s" if VIDEO_DIR and os.path.exists(os.path.join(VIDEO_DIR, k + ".mp4")) else ""
    print(f"{k}: {len(ar)} + {len(en)} lines; Short {total:.2f} s{have}; closing line sped {f:.2f}x")
