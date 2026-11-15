#!/usr/bin/env python3
# The English dub of science part 1: the Arabic storyboard's beats, in the same order, with English lines written to fit
# each beat's slot in the video (about 2.6 words a second; dub.cjs stretches 0.9x to 1.22x). Adapted, not translated:
# same facts, same order, jokes rebuilt for English speakers.
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "../explain-science-01-world/storyboard.json")
P = "<short pause> "
EN = [
 # intro (7)
 "Sir. Field report one, in a new file: Science.",
 "Humans have a thing called science. They trust it above almost anything.",
 "They fly because of it, take medicine because of it, build twenty floors high.",
 "And yet half the planet asks: why believe these scientists? What if they're fooling us?",
 "Today: what science is, and why they trust it.",
 "I'll start with the strangest story I found. In twenty eleven, scientists told the whole world: we've found something faster than light.",
 "Months later, the culprit: " + P + "a loose cable.",
 # announce (9)
 "It started in Europe, sir. A lab in Geneva, CERN, fires tiny particles called neutrinos through solid rock to a lab in Italy.",
 "About seven hundred and thirty kilometers. A team called OPERA timed the trip.",
 "In twenty eleven, the numbers looked strange: the particles arrived about sixty billionths of a second early.",
 "Faster than light. " + P + "Which is impossible.",
 "Einstein said nothing beats light. A century of physics rests on that.",
 "Two options, sir.",
 "Hide it in a drawer. Or announce it: we don't believe it either.",
 "They chose the second. A press conference: here are our numbers. Find our mistake.",
 "I had to sit down, sir. " + P + "At Command, admitting a mistake gets you sent to Archives.",
 # workshop (7)
 "First: humans think science is a big book of answers.",
 "Earth circles the Sun. Water boils at a hundred.",
 "That's not science, sir. That's what's left after it.",
 "Science is a method for not fooling yourself.",
 "Simple: say something testable. Test it. Then try hard to prove it wrong.",
 "If it survives, believe it a little. If it survives your rivals, believe it more.",
 "Science isn't a library, sir. It's a workshop. Anything in it can be taken apart and rebuilt. Even Einstein.",
 # shadow (13)
 "How old is this method? I went back over two thousand two hundred years.",
 "A man named Eratosthenes ran the Library of Alexandria.",
 "He heard that in a southern town, on one summer day at exactly noon, the Sun lit the bottom of a well. No shadow at all.",
 "So, same day, same hour, he planted a stick in Alexandria. It had a shadow.",
 "A small shadow, about seven degrees. One fiftieth of a circle.",
 "If the Earth were flat, the shadows would match.",
 "They don't. " + P + "So the Earth is round.",
 "A one-fiftieth difference means the towns are one fiftieth of the way around the planet.",
 "The distance was paced out: about five thousand stadia. Times fifty: two hundred and fifty thousand.",
 "Humans still argue about how long a stadion was, but by most counts that's very close to the real forty thousand kilometers.",
 "No plane, no satellite, no internet. A stick, a shadow, and a brain.",
 "But the number isn't the point, sir. Anyone with a stick and a friend in another town can repeat it today.",
 "No need to trust him. " + P + "Try it.",
 # dragon (11)
 "So what makes a claim scientific, and another one not?",
 "Imagine someone says: I have a dragon in my garage.",
 "Show me. It's invisible.",
 "Spread flour to see its footprints? It floats.",
 "Measure the heat of its fire? Cold fire.",
 "Every test, he has an excuse.",
 "True or false, that claim will never be science.",
 "Because no experiment could ever prove it wrong.",
 "The main rule of science: a claim must be able to fail. You must say: if this happens, I'm wrong.",
 "Einstein did exactly that. His theory said starlight passing the Sun must bend by a set amount. If not, the theory was wrong.",
 "In nineteen nineteen, humans waited for an eclipse and measured. " + P + "The light bent.",
 # cable (10)
 "Back to the particles faster than light. After the announcement, scientists everywhere started digging.",
 "Not to believe it. To break it. As it should be.",
 "Five months later, the team found the mistake.",
 "A fibre-optic cable carrying the GPS time signal... wasn't plugged all the way in.",
 "And a clock was off.",
 "Tiny problems, but enough to create those sixty billionths they were so excited about.",
 "Meanwhile, another experiment in the same Italian lab, ICARUS, timed the same particles: exactly the speed of light. Not faster, not slower.",
 "Cable fixed, math redone: the speed of light. Einstein wins.",
 "The leader had resigned.",
 "Who caught it, sir? Not a journalist. Not a government. Science itself. In under a year.",
 # theory (10)
 "There's a word humans misuse all the time: theory.",
 "On the street, a theory is a hunch. As in: I bet my neighbor steals my newspaper.",
 "But to scientists, the word means something else entirely.",
 "It starts as a hypothesis: a guess you can test.",
 "Tested a lot, survives, predicts things nobody has seen yet... only then is it a theory.",
 "A theory isn't the bottom of the ladder, sir. It's the top.",
 "Take gravity. Nobody calls it a hunch.",
 "Nobody steps off a roof to check.",
 "And that diseases come from tiny creatures you can't see, germs, is also a theory. It's why humans wash their hands.",
 "That one gets its own report.",
 # halley (10)
 "A harder test than explaining the past: predicting what will happen.",
 "In seventeen oh five, an Englishman, Edmond Halley, read old records of comets.",
 "He noticed one showed up about every seventy-six years.",
 "Not three comets. One comet, coming back.",
 "Using gravity, he said: it returns around seventeen fifty-eight.",
 "He died sixteen years before.",
 "And on Christmas night, seventeen fifty-eight... " + P + "the comet appeared.",
 "It bears his name.",
 "Imagine signing a prediction you won't live to see.",
 "Crazy, or sure of your method. " + P + "He wasn't crazy.",
 # trust (11)
 "Right. Back to the question: why do humans trust science?",
 "Not because scientists are smarter, or never wrong. They're wrong constantly, as we've seen.",
 "Humans trust it for two reasons.",
 "One: it's the only method built to hunt its own mistakes.",
 "Anyone can repeat the experiment. Prove the big names wrong, and you get a prize, not punishment.",
 "Not one scientist, sir. That's a mistake too.",
 "We trust many teams, in different countries, who dislike each other and chase the same prize, repeating the experiment and getting the same result.",
 "Then a conspiracy gets very hard. It needs everyone to agree.",
 "Scientists never agree on anything, sir... " + P + "except results that repeat.",
 "Reason two: it works. The phone in your hand, the plane overhead, the bridge you're crossing.",
 "All scientific predictions. Humans bet their lives on them daily. " + P + "And win.",
 # dict (2)
 "The Human Dictionary. Two words. Hypothesis: a testable guess, not yet proven.",
 "Theory: a hypothesis tested a thousand times that held. Not a hunch.",
 # recap (6)
 "Summary, sir. One: science isn't a book of answers. It's a method for not fooling yourself.",
 "Two: a scientific claim must be able to fail. Otherwise, it's a garage dragon.",
 "Three: scientists make mistakes, but the method catches them. Like the cable faster than light.",
 "I must admit: humans invented the only club on the planet that pays you to prove it wrong.",
 "Next report: how research is done, who checks it before it reaches you, and how one journalist fooled the world with chocolate.",
 "This was Earth Report. Agent Peek. End of transmission.",
]
sb = json.load(open(SRC, encoding="utf8"))
beats = [b for s in sb["scenes"] for b in s["beats"]]
assert len(beats) == len(EN), (len(beats), len(EN))
i = 0
for s in sb["scenes"]:
    for b in s["beats"]:
        b["say"] = EN[i]; i += 1
STYLE = "A small alien field agent reading his report on planet Earth aloud to his commanders back home, about something he has observed among humans. He calls them sir now and then. He explains what he found clearly and simply, a little amused. Quick, dry, deadpan. Brisk pace, noticeably quicker than ordinary conversation, and no dead air: he goes straight from one sentence into the next. A warm, smooth, rounded voice in a comfortable middle register, relaxed and close to the microphone: never shrill, never nasal, soft on the s sounds. American English. He lets a joke land flat and never laughs at it."
out = {**sb, "title": "Earth Report: Science 1 (English dub track for the world-picture video)", "language": "en-US", "rtl": False, "style": STYLE,
       "notes": ["English voice written to fit the timing of explain-science-01-world beat by beat (video/dub.cjs); only the audio is used, the picture is the world-picture video's.",
                 "Adapted from ../explain-science-01-ar/script.md, not translated: same facts, same order; jokes rebuilt for English speakers (sitting down / transferred to Archives; the neighbor stealing the newspaper; nobody steps off a roof to double-check; scientists agree only on results that keep coming back)."] + sb["notes"][2:]}
out.pop("youtube", None)
json.dump(out, open(os.path.join(HERE, "storyboard.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
plain = lambda t: re.sub(r"<[^>]+>", " ", t).split()
print("beats", len(EN), "words", sum(len(plain(t)) for t in EN))
