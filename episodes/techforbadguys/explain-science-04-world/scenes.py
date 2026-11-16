# Science part 4 (world picture): scenes and beats. The words come straight from the planner's script
# (../explain-science-04-ar/script.md) by sentence number, so they cannot drift; storyboard.py checks them again.
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = "<short pause> "
_src = open(os.path.join(HERE, "../explain-science-04-ar/script.md"), encoding="utf8").read().split("## Script", 1)[1]
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
 "World-language picture (one video, several audio tracks), drawn in the notebook look of explain-science-01-world: no Arabic on screen, no burned-in captions, every board beat a wordless illustrated shot. Script: ../explain-science-04-ar/script.md, words unchanged.",
 "Earth Report field file: Science, part 4 of 4 (the last). When science really fools us, and who catches it: publish or perish and torturing the data; Jan Hendrik Schön (2002); the 1998 vaccine-autism paper, withdrawn in 2010 (serious passage); the tobacco memo 'doubt is our product' (1969); the replication crisis (2015); paper mills and the 2023 record of withdrawn papers; who caught each one; a checklist for any science claim.",
 "Facts (sources in ../explain-science-01-ar/plan.md): Schön, Bell Labs, misconduct in at least 16 cases (2002); Wakefield, The Lancet 1998, 12 children, fully retracted February 2010, struck off May 2010, Brian Deer's investigation; 1969 tobacco memo; Open Science Collaboration 2015, 100 psychology studies, about a third replicated, effects about half; more than 10,000 retractions in 2023, more than 8,000 from Hindawi (Wiley).",
 "The vaccine passage is serious and calm: no jokes, no children shown hurt or ill, no syringes aimed at anyone, no medical advice (the host says so). Pictures show papers, records, a journalist's magnifier, and many studies finding no link. No company or country is mocked; the tobacco memo is told as a documented case.",
]

SCENES = [
 scene(0, "intro", None, "Opening of the last field report: a record number told with dry wonder, then the question.", lambda: [
  C((0,), emote="serious"),
  B((1, 3), "s4intro", 0),
  B((4,), "s4intro", 1, "right", emote="deadpan"),
  H((5, 6), emote="neutral", gesture="present"),
  B((7, 8), "s4intro", 2),
  H((9, 10), emote="sly", gesture="count"),
 ]),
 scene(1, "pressure", {"n": 1, "tag": "PUBLISH OR PERISH", "icon": "file"}, "An honest admission, dry and a little sympathetic; the torture line lands deadpan.", lambda: [
  H((0, 2), emote="deadpan"),
  B((3, 4), "pressure", 0),
  B((5, 8), "pressure", 1),
  B((9, 10), "pressure", 2),
  B((11, 12), "pressure", 3),
  C((13, 14), emote="deadpan"),
  B((15, 17), "pressure", 4, "right", emote="neutral"),
  B((18, 21), "pressure", 5, "right", emote="sly"),
 ]),
 scene(2, "schon", {"n": 2, "tag": "THE STAR", "icon": "atom"}, "A rise and fall told briskly; quiet respect for the scientists with rulers.", lambda: [
  B((0, 2), "schon", 0),
  B((3, 5), "schon", 1),
  B((6, 7), "schon", 2, "right", emote="skeptical"),
  B((8, 11), "schon", 3),
  B((12, 13), "schon", 4),
  B((14, 16), "schon", 5),
  H((17, 19), emote="neutral", gesture="present"),
 ]),
 scene(3, "wakefield", {"n": 3, "tag": "ONE PAPER", "icon": "shield"}, "Serious and calm throughout. No sarcasm, no jokes; slower, plain, respectful of the families.", lambda: [
  C((0,), emote="serious"),
  B((1, 3), "wakefield", 0),
  B((4, 5), "wakefield", 1),
  B((6, 7), "wakefield", 2),
  B((8, 9), "wakefield", 3),
  B((10,), "wakefield", 4),
  B((11, 12), "wakefield", 5, "right", emote="serious"),
  C((13, 15), emote="serious"),
 ]),
 scene(4, "doubt", {"n": 4, "tag": "SELLING DOUBT", "icon": "coin"}, "A documented case told plainly, with a dry edge; the closing question firm.", lambda: [
  B((0, 2), "doubt", 0),
  B((3, 5), "doubt", 1),
  B((6, 8), "doubt", 2, "right", emote="skeptical"),
  B((9, 10), "doubt", 3),
  B((11, 12), "doubt", 4),
  H((13, 14), emote="serious", gesture="count"),
 ]),
 scene(5, "replic", {"n": 5, "tag": "DO IT AGAIN", "icon": "dup"}, "Calm, a little sobering, then quietly proud of the scientists who checked themselves.", lambda: [
  H((0,), emote="serious"),
  B((1, 2), "replic", 0),
  B((3, 5), "replic", 1),
  B((6, 9), "replic", 2),
  C((10, 12), emote="neutral"),
  B((13, 15), "replic", 3, "right", emote="proud"),
  B((16,), "replic", 4),
 ]),
 scene(6, "mills", {"n": 6, "tag": "PAPER MILLS", "icon": "gear"}, "Amused by the clumsy fakes, then firm about what the record number means.", lambda: [
  H((0,), emote="neutral"),
  B((1, 3), "mills", 0),
  B((4, 5), "mills", 1),
  B((6, 8), "mills", 2, "right", emote="sly"),
  B((9,), "mills", 3),
  B((10, 11), "mills", 4),
  B((12, 13), "mills", 5),
  H((14, 17), emote="skeptical", gesture="shrug"),
  C((18, 20), emote="deadpan"),
 ]),
 scene(7, "sleuths", {"n": 7, "tag": "WHO CAUGHT THEM", "icon": "eye"}, "A brisk roll call, then honest about how slow it is; sincere at the end.", lambda: [
  H((0,), emote="neutral", gesture="count"),
  B((1, 2), "sleuths", 0),
  B((3, 4), "sleuths", 1),
  B((5, 6), "sleuths", 2),
  B((7, 8), "sleuths", 3),
  B((9, 10), "sleuths", 4),
  H((11, 14), emote="neutral"),
  B((15, 17), "sleuths", 5, "right", emote="serious"),
  C((18,), emote="serious"),
  B((19, 20), "sleuths", 6),
  H((21,), emote="proud", gesture="present"),
 ]),
 scene(8, "checklist", {"n": 8, "tag": "THE CHECKLIST", "icon": "rules"}, "A practical checklist read briskly; the last question sly.", lambda: [
  H((0,), emote="neutral", gesture="count"),
  B((1, 2), "checklist", 0),
  B((3, 4), "checklist", 1),
  B((5, 6), "checklist", 2),
  B((7, 8), "checklist", 3),
  B((9, 10), "checklist", 4),
  C((11, 13), emote="sly"),
 ]),
 scene(9, "dict", {"n": 9, "tag": "WORDS", "icon": "key"}, "A quick aside, like reading the last two entries from a field dictionary.", lambda: [
  B((0, 3), "s4dict", 0),
  B((4, 5), "s4dict", 1, "right"),
 ]),
 scene(10, "recap", {"n": 10, "tag": "RECAP", "icon": "rules"}, "Summary, the sincere closing line of the whole file, and the sign-off.", lambda: [
  B((0, 2), "s4recap", 0, "right"),
  B((3, 5), "s4recap", 1, "right"),
  B((6, 8), "s4recap", 2, "right"),
  C((9, 12), emote="serious"),
  H((13, 14), emote="sly", gesture="present"),
  W((15, 17), emote="proud", gesture="wave"),
 ]),
]
for sc, ss in zip(SCENES, SECTIONS):   # every sentence used once, in order
    assert " ".join(b["say"] for b in sc["beats"]) == " ".join(s.strip() for s in ss), sc["id"]
