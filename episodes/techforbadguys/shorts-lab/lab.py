# Shorts lab (producer D): one standalone Short as a tiny vertical "episode". A Short's make.py lists its beats and
# calls build(); this writes storyboard.json (for storyboard.cjs request / cues) and youtube/shorts.json (for short.cjs,
# one part from the first word to two seconds after the sign-off line, filled in by part() once the voice is placed).
# The sign-off is the last beat, on the `signoff` board: the lab card (sets/shortend.v.js, look "lab").
import json, os, re
P = "<short pause> "
STYLE = ("A small alien spy on Earth filing a field report to his commanders back home about something he has observed among humans, "
 "in Egyptian Arabic, Cairo street dialect, not Modern Standard Arabic. He calls them يا فندم now and then. He explains what he found clearly "
 "and simply, a little amused. Brisk pace, noticeably quicker than ordinary conversation, and no dead air: he goes straight from one sentence "
 "into the next. Bright, higher-pitched, slightly nasal voice, never deep or gravelly. Dry, deadpan Egyptian sarcasm; he never laughs at his own "
 "jokes. English names are said the English way.")
def B(say, board, step, side=None, **k):
    b = {"say": say, "show": "board", "board": board, "step": step, **k}
    if side: b["host"] = side
    return b
def H(say, **k): return {"say": say, "shot": "host", **k}

def build(here, title, beats, boards, style_note, peek_fixed=True, dark=False, sources=None):
    boards = {**boards, "signoff": {"kind": "shortend", "look": "lab", "dark": dark}}
    out = os.path.join(here, "storyboard.json")
    old = json.load(open(out, encoding="utf8")) if os.path.exists(out) else {}
    for k, v in (old.get("boards") or {}).items():
        if k in boards and "ends" in v: boards[k]["ends"] = v["ends"]
    sb = {"title": title, "recorded_for": "shorts-lab", "layout": "explain", "date": "", "language": "ar-EG", "rtl": True, "voice": "Puck", "face": "pear",
          "notes": ["Shorts lab, standalone Short (producer D). Script from the writer, words unchanged.", *(sources or [])],
          "style": STYLE,
          "settings": {"lead": 0.3, "tail": 2, "tempo": 1.06, "tighten": {"max": 0.32, "keep": 0.22}, "captionChunk": 4, "bpm": 100, "musicGain": 0.45, "sfxGain": 0.25,
                       "voiceGain": 1.35, "captions": False, "whooshGain": 0, "shots": {"host": {"s": 1.18, "y": 470}, "close": {"s": 1.42, "y": 410}}, "letterbox": False},
          "ending": {"card": {"kind": "endnext", "title": "", "next": "", "icons": [], "note": ""}},
          "brand": {"a": "Earth ", "b": "Report", "c": "", "tagline": ""}, "theme": "lab",
          "boards": boards,
          "scenes": [{"id": "short", "story": None, "style": style_note, "beats": beats}]}
    json.dump(sb, open(out, "w", encoding="utf8"), ensure_ascii=False, indent=1); open(out, "a").write("\n")
    words = sum(len(re.sub(r"<[^>]+>", " ", b["say"]).split()) for b in beats)
    kit = os.path.join(here, "youtube"); os.makedirs(kit, exist_ok=True)
    sp = os.path.join(kit, "shorts.json")
    spec = json.load(open(sp, encoding="utf8")) if os.path.exists(sp) else {"shorts": [{"key": os.path.basename(here), "parts": []}]}
    spec.update({"note": "Standalone Short (shorts lab): one part, the whole voice; the sign-off card is the last beat.", "boardZoom": 0.85, "captions": False})
    if peek_fixed: spec["peekFixed"] = {"h": 0.3, "side": "right"}
    else: spec.pop("peekFixed", None)
    json.dump(spec, open(sp, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print(f"{title}: beats {len(beats)}, words {words}")

def part(here, hold=2.0):
    """Once cues/<name>.json exists: the Short is one part, from the first beat to `hold` s after the last word."""
    name = os.path.basename(here); video = os.path.join(here, "../../../../video")
    cues = json.load(open(os.path.join(video, "cues", name + ".json"), encoding="utf8"))
    w = json.load(open(os.path.join(here, "transcript.json"), encoding="utf8"))["words"]
    T, L = cues.get("tempo", 1), cues.get("lead", 0)
    end = w[-1]["end_ms"] / 1000 / T + L + hold
    sp = os.path.join(here, "youtube", "shorts.json"); spec = json.load(open(sp, encoding="utf8"))
    spec["shorts"][0]["parts"] = [[0, round(end, 2)]]; json.dump(spec, open(sp, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print("part", spec["shorts"][0]["parts"])
