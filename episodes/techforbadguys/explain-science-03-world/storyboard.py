#!/usr/bin/env python3
# Generates storyboard.json for science part 3 (world picture) from the planner's script
# (../explain-science-03-ar/script.md). Words are the script's, unchanged; the check at the bottom proves it.
import json, re, os
HERE = os.path.dirname(os.path.abspath(__file__))
H=lambda say,**k: {"say":say,"shot":"host",**k}
C=lambda say,**k: {"say":say,"shot":"close",**k}
W=lambda say,**k: {"say":say,"shot":"wide",**k}
def B(say,board,step,side=None,**k):
    b={"say":say,"show":"board","board":board,"step":step,**k}
    if side: b["host"]=side
    return b
P="<short pause> "

from scenes import SCENES as scenes, NOTES
# ---- the words are the script's: compare every section with the planner's text ----
src = open(os.path.join(HERE, "../explain-science-03-ar/script.md"), encoding="utf8").read().split("## Script", 1)[1]
parts = re.split(r"^### (.+)$", src, flags=re.M)[1:]
script = {parts[i].strip(): parts[i + 1].strip() for i in range(0, len(parts), 2)}
order = list(script.values())
plain = lambda t: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)).strip()
assert len(order) == len(scenes), (len(order), len(scenes))
for sc, want in zip(scenes, order):
    got = plain(" ".join(b["say"] for b in sc["beats"]))
    assert got == plain(want), f"scene {sc['id']} differs from the script:\n{got}\n---\n{plain(want)}"

boards = {k: {"kind": k} for k in sorted({b["board"] for sc in scenes for b in sc["beats"] if "board" in b})}
# keep ends written by sets/beats.cjs --write
out = os.path.join(HERE, "storyboard.json")
old = json.load(open(out, encoding="utf8")) if os.path.exists(out) else {}
for k, v in (old.get("boards") or {}).items():
    if k in boards and "ends" in v: boards[k]["ends"] = v["ends"]

STYLE = "A small alien spy on Earth filing a field report to his commanders back home about something he has observed among humans, in Egyptian Arabic, Cairo street dialect, not Modern Standard Arabic. He calls them يا فندم now and then. He explains what he found clearly and simply, a little amused. Brisk pace, noticeably quicker than ordinary conversation, and no dead air: he goes straight from one sentence into the next. Bright, higher-pitched, slightly nasal voice, never deep or gravelly. Dry, deadpan Egyptian sarcasm; he never laughs at his own jokes. English names are said the English way."
sb = {
 "title": "تقرير الأرض: العلم 3 (world picture)",
 "recorded_for": "2026-12-06",
 "layout": "explain", "date": "", "language": "ar-EG", "rtl": True, "voice": "Puck", "face": "pear",
 "notes": NOTES,
 "style": STYLE,
 "settings": {"lead": 0.3, "tail": 13, "tempo": 1.06, "tighten": {"max": 0.32, "keep": 0.22}, "captionChunk": 4, "bpm": 100, "musicGain": 0.45, "sfxGain": 0.25, "voiceGain": 1.35, "captions": False, "whooshGain": 0, "shots": {"host": {"s": 1.18, "y": 470}, "close": {"s": 1.42, "y": 410}}, "letterbox": False},
 "ending": {"card": {"kind": "endnext", "title": "NEXT", "next": "4 / 4", "icons": ["book", "eye", "rules"], "note": ""}},
 "brand": {"a": "Earth ", "b": "Report", "c": "", "tagline": ""},
 "theme": "lab",
 "boards": boards,
 "scenes": scenes,
}
if old.get("youtube"): sb["youtube"] = old["youtube"]
json.dump(sb, open(out, "w", encoding="utf8"), ensure_ascii=False, indent=1)
open(out, "a").write("\n")
words = sum(len(plain(b["say"]).split()) for s in scenes for b in s["beats"])
nb = sum(1 for s in scenes for b in s["beats"]); nh = sum(1 for s in scenes for b in s["beats"] if "shot" in b)
print(f"scenes {len(scenes)}, beats {nb} (host {nh}), words {words}")
