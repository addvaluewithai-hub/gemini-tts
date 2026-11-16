# Science part 3 (world picture): scenes and beats. The words come straight from the planner's script
# (../explain-science-03-ar/script.md) by sentence number, so they cannot drift; storyboard.py checks them again.
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = "<short pause> "
_src = open(os.path.join(HERE, "../explain-science-03-ar/script.md"), encoding="utf8").read().split("## Script", 1)[1]
_parts = re.split(r"^### (.+)$", _src, flags=re.M)[1:]
SECTIONS = [re.findall(r".+?(?:\.\.|[.؟?!:](?=\s)|$)\s*", re.sub(r"\s+", " ", _parts[i + 1]).strip()) for i in range(0, len(_parts), 2)]
_cur = None
def S(a, b=None): b = a if b is None else b; return " ".join(s.strip() for s in _cur[a:b + 1])
def H(r, **k): return {"say": S(*r), "shot": "host", **k}
def C(r, **k): return {"say": S(*r), "shot": "close", **k}
def W(r, **k): return {"say": S(*r), "shot": "wide", **k}
def B(r, board, step, side=None, **k):
    b = {"say": S(*r), "show": "board", "board": board, "step": step, **k}
    if side: b["host"] = side
    return b
def scene(i, id, story, style, beats):
    global _cur; _cur = SECTIONS[i]; bs = beats()
    return {"id": id, "story": story, "style": style, "beats": bs}

NOTES = [
 "World-language picture (one video, several audio tracks), drawn in the notebook look of explain-science-01-world: no Arabic on screen, no burned-in captions, every board beat a wordless illustrated shot. Script: ../explain-science-03-ar/script.md, words unchanged.",
 "Earth Report field file: Science, part 3 of 4. Why scientists change their minds: Semmelweis and handwashing (1847), Wegener and the moving continents (1912 to the 1960s), Barry Marshall drinking bacteria (1984, Nobel 2005), Newton and Mercury, the eggs-and-cholesterol headlines (2015), correlation versus cause, one study (a brick) versus the consensus (a wall).",
 "Facts (sources in ../explain-science-01-ar/plan.md): Vienna General Hospital 1847, deaths of new mothers in the doctors' clinic from about 18 percent (April) to about 2 (June) and 1 (July) after chlorinated-lime handwashing; Wegener 1912, rejected by 1930 (no mechanism), plate tectonics accepted in the late 1960s; Marshall drank H. pylori in 1984, gastritis, Nobel 2005 with Robin Warren; 2015 US Dietary Guidelines dropped the 300 mg cholesterol limit while still advising to keep it low.",
 "No health advice about eggs or anything else, and Marshall's drink is not shown as something to copy (the host says so). The calm, respectful tone for the mothers' deaths: no bodies, numbers and empty beds only.",
]

SCENES = [
 scene(0, "intro", None, "Opening of a field report: a short story told quietly, then the puzzle humans keep asking.", lambda: [
  C((0,), emote="serious"),
  B((1, 2), "s3intro", 0),
  B((3,), "s3intro", 1),
  B((4, 5), "s3intro", 2, "right", emote="worried"),
  H((6, 7), emote="neutral", gesture="present"),
  B((8,), "s3intro", 3),
  B((9, 10), "s3intro", 4, "left", emote="skeptical"),
  H((11,), emote="sly", gesture="count"),
 ]),
 scene(1, "vane", {"n": 1, "tag": "THE WEATHERVANE", "icon": "gear"}, "Correcting a misunderstanding, calm and a little dry.", lambda: [
  H((0, 1), emote="neutral"),
  B((2,), "vane", 0),
  B((3, 4), "vane", 1, "right", emote="serious"),
  C((5, 6), emote="deadpan"),
  B((7,), "vane", 2),
  B((8, 9), "vane", 3),
  B((10, 11), "vane", 4, "right", emote="neutral"),
 ]),
 scene(2, "semmel", {"n": 2, "tag": "WASH YOUR HANDS", "icon": "heart"}, "A true story told seriously and calmly; the deaths of mothers are not a joke. A little warmth at the end.", lambda: [
  B((0, 1), "semmel", 0),
  B((2, 3), "semmel", 1),
  B((4, 5), "semmel", 2, "right", emote="serious"),
  B((6, 7), "semmel", 3),
  B((8, 11), "semmel", 4, "right", emote="serious"),
  B((12,), "semmel", 5),
  B((13, 16), "semmel", 6),
  C((17, 18), emote="proud"),
  B((19, 22), "semmel", 7, "right", emote="worried"),
  B((23, 25), "semmel", 8),
  B((26, 27), "semmel", 9, "right", emote="serious"),
  H((28, 31), emote="serious", gesture="present"),
 ]),
 scene(3, "wegener", {"n": 3, "tag": "MOVING CONTINENTS", "icon": "ship"}, "Fair to both sides: the idea and the sensible doubt. Quietly satisfied at the end.", lambda: [
  B((0, 1), "wegener", 0),
  B((2,), "wegener", 1),
  B((3,), "wegener", 2),
  B((4, 5), "wegener", 3, "right", emote="neutral"),
  B((6, 10), "wegener", 4, "right", emote="skeptical"),
  B((11, 12), "wegener", 5),
  B((13, 14), "wegener", 6),
  B((15, 16), "wegener", 7),
  H((17, 19), emote="neutral", gesture="count"),
 ]),
 scene(4, "marshall", {"n": 4, "tag": "THE DRINK", "icon": "shield"}, "A bold story told with dry amazement; the warning not to copy him is said plainly and seriously.", lambda: [
  B((0, 1), "marshall", 0),
  B((2, 4), "marshall", 1),
  B((5, 6), "marshall", 2, "right", emote="skeptical"),
  B((7, 8), "marshall", 3),
  B((9, 10), "marshall", 4),
  B((11, 12), "marshall", 5),
  B((13, 14), "marshall", 6),
  C((15, 16), emote="serious"),
  H((17,), emote="neutral", gesture="present"),
 ]),
 scene(5, "newton", {"n": 5, "tag": "NEWTON", "icon": "comet"}, "Admiring, a little playful; the last two lines land neatly.", lambda: [
  H((0,), emote="sly"),
  B((1, 3), "newton", 0),
  B((4, 5), "newton", 1),
  B((6,), "newton", 2),
  B((7, 8), "newton", 3),
  C((9, 11), emote="deadpan"),
  B((12, 13), "newton", 4),
  B((14, 15), "newton", 5, "right", emote="proud"),
 ]),
 scene(6, "eggs", {"n": 6, "tag": "EGGS", "icon": "dup"}, "Calm and exact about what changed; the last line deadpan. No advice.", lambda: [
  H((0, 1), emote="sly"),
  B((2, 4), "eggs", 0),
  B((5, 7), "eggs", 1),
  B((8, 9), "eggs", 2),
  B((10, 12), "eggs", 3, "right", emote="neutral"),
  B((13, 15), "eggs", 4),
  C((16, 17), emote="deadpan"),
 ]),
 scene(7, "icecream", {"n": 7, "tag": "ICE CREAM", "icon": "sun"}, "A playful example, then a firm point about headlines.", lambda: [
  H((0, 1), emote="neutral", gesture="present"),
  B((2, 3), "icecream", 0),
  B((4, 5), "icecream", 1),
  B((6, 9), "icecream", 2),
  C((10,), emote="serious"),
  B((11, 12), "icecream", 3),
  B((13, 17), "icecream", 4, "right", emote="skeptical"),
  C((18, 20), emote="deadpan"),
 ]),
 scene(8, "brick", {"n": 8, "tag": "BRICK AND WALL", "icon": "rules"}, "The main idea of the report, clear and steady; the closing question asked plainly.", lambda: [
  H((0, 1), emote="neutral", gesture="present"),
  B((2, 3), "brick", 0),
  B((4, 6), "brick", 1),
  B((7, 9), "brick", 2),
  B((10, 13), "brick", 3),
  B((14, 17), "brick", 4),
  B((18,), "brick", 5, "right", emote="serious"),
  H((19, 21), emote="neutral", gesture="count"),
 ]),
 scene(9, "dict", {"n": 9, "tag": "WORDS", "icon": "key"}, "A quick aside, like reading two entries from a field dictionary.", lambda: [
  B((0, 3), "s3dict", 0),
  B((4, 5), "s3dict", 1, "right"),
 ]),
 scene(10, "recap", {"n": 10, "tag": "RECAP", "icon": "rules"}, "Summary, one sincere line, the teaser, and the sign-off.", lambda: [
  B((0, 2), "s3recap", 0, "right"),
  B((3, 4), "s3recap", 1, "right"),
  B((5, 7), "s3recap", 2, "right"),
  C((8, 10), emote="serious"),
  H((11, 14), emote="sly", gesture="count"),
  W((15, 17), emote="proud", gesture="wave"),
 ]),
]
for sc, ss in zip(SCENES, SECTIONS):   # every sentence used once, in order
    assert " ".join(b["say"] for b in sc["beats"]) == " ".join(s.strip() for s in ss), sc["id"]
