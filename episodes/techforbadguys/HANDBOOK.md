# Earth Report explainers: how an episode is made

Everything a new session needs to produce a "field file" for the channel **تقرير الأرض (Earth Report)** without the
history of earlier conversations. The finished cryptocurrency file (`explain-crypto-01-ar` … `-05-ar`) is the
reference: read two of its `storyboard.json` files before writing anything.

## The show

- **Host:** Peek, a small alien spy on Earth (pear face, fedora, trench coat). He files field reports to his
  command back home about things he has observed among humans. He addresses his commanders (يا فندم), never the
  viewer.
- **Language:** Egyptian Arabic, Cairo street dialect, as the common dialect for an Arabic-speaking audience. Not
  Modern Standard Arabic. Nothing in an episode is about Egypt or any one country: examples come from around the
  planet, amounts are in dollars, and law or regulation is shown as a world map, not one country's rules.
- **A file** is a short series on one subject (three to five reports). Each report answers one question and runs
  **7 to 10 minutes**.
- **Tone:** dry, deadpan sarcasm about institutions, governments, companies and human habits; he never laughs at his
  own jokes. A joke usually closes a beat ("البشر مش مبدعين في الأسامي"). Where real people are hurt (fraud,
  disasters, war) he is serious and says so plainly; mark those passages `calm` and lower the music.
- **It teaches.** Simple enough for someone who has never met the subject. One idea per beat, an everyday analogy
  for every mechanism (a hash is a meat grinder: mince never becomes meat again), then the real-world story that
  proves it.
- **Other languages come later** (English first). So: no country-specific segment; every name and currency in an
  example lives in the storyboard; all on-screen text lives in the storyboard, never in `boards.js`; jokes are
  rebuilt per language, not translated; and every figure is either timeless or said with its date, never "today"
  or "last week".
- Out of scope on purpose: investment or medical advice, how-to-profit content, predictions, religious rulings,
  one country's taxes or laws.

## Shape of a report

1. **Intro** (20 to 40 s): "يا فندم، تقرير ميداني رقم N في ملف …" then one line that says what the report is
   about, then a hook (the strangest true fact in the episode), then the question.
2. **Six to ten numbered sections**, each with a `story` chip `{ n, tag }`. Boards carry the lesson; the host
   appears in a few studio shots and leans in from the side over a held board. Keep studio time under a third.
3. **قاموس البشر**: a `dict` board with two words from the humans' vocabulary, about 12 seconds.
4. **Recap**: a `list` meme with three points and the host as picture-in-picture, one sincere line, a teaser for the
   next report, and the sign-off: "ده كان تقرير الأرض. العميل Peek. انتهى الإرسال."
5. **End card** (`ending.card`): 13 seconds with room for the platform's end-screen elements.

## Facts

- Search before scripting. Prefer primary sources; when only secondary sources exist, say figures approximately
  ("حوالي", "أكتر من") and date them.
- Keep a `plan.md` in the file's first episode folder: outline per episode, each fact with its link, and a separate
  list of what is stated from general knowledge without a fresh search. Commit it before the first script.
- Every storyboard's `notes` list the facts the script relies on, in English.
- Tell the user at the end which facts are well sourced and which are not, and that you could not listen to the
  audio.

## Length

Measured, not estimated: the voice reads about **170 words a minute** after tightening and tempo. A report needs
**1,250 words or more** by the generator's own count to pass 7:00 (1,230 words gave 7:27 with the 13 s end card;
1,050 gave 6:20). Estimates made while writing run about a third too high, so count, then add substance (another
mechanism, another true story), never padding.

## Storyboard

`storyboard.json` is the source of truth. The crypto episodes were written with a small Python generator; these
helpers are all it used:

```python
H=lambda say,**k: {"say":say,"shot":"host",**k}        # host at the desk
C=lambda say,**k: {"say":say,"shot":"close",**k}       # close-up, for a punchline or a serious line
W=lambda say,**k: {"say":say,"shot":"wide",**k}        # the sign-off
B=lambda say,board,**k: {"say":say,"show":"board","board":board,**k}                                 # the board moves on one step
K=lambda say,board,side="right",**k: {"say":say,"show":"board","board":board,"step":"hold","host":side,**k}   # he talks over the board as it is
M=lambda say,meme,**k: {"say":say,"show":"meme","meme":meme,**k}                                      # the recap list
P="<short pause> "                                      # a beat before a punchline
```

- A scene is `{ id, story: { n, tag } | None, style, beats, calm?, music? }`. `style` is one English sentence of
  direction for that passage's delivery.
- A board advances one step per `B` beat. Use `step=N` to jump, `K` to hold. Boards are named in `sb["boards"]`.
- Emotes: `serious smug skeptical deadpan sly neutral proud bored annoyed grin worried` (and `furious sad blank`
  for grave passages). Gestures: `count present shrug cheer wave`.
- Top-level fields used by every explainer:

```python
"layout":"explain","language":"ar-EG","rtl":True,"voice":"Puck","face":"pear","date":"",
"settings":{"lead":0.3,"tail":13,"tempo":1.06,"tighten":{"max":0.32,"keep":0.22},"captionChunk":4,"bpm":100,"musicGain":0.45,"sfxGain":0.55,"voiceGain":1.35},
"brand":{"a":"تقرير","b":"الأرض","c":"","tagline":"ملف ميداني: <اسم الملف>"},
"ending":{"card":{"title":"التقرير الجاي","next":"<العنوان> · الجزء N من M","note":"اشترك علشان باقي التقارير توصل"}},
```

- The voice style prompt, used unchanged:

> A small alien spy on Earth filing a field report to his commanders back home about something he has observed
> among humans, in Egyptian Arabic, Cairo street dialect, not Modern Standard Arabic. He calls them يا فندم now
> and then. He explains what he found clearly and simply, a little amused. Brisk pace, noticeably quicker than
> ordinary conversation, and no dead air: he goes straight from one sentence into the next. Bright,
> higher-pitched, slightly nasal voice, never deep or gravelly. Dry, deadpan Egyptian sarcasm; he never laughs at
> his own jokes. English names are said the English way.

- Numbers are written out in words in `say` (ألفين ستة وعشرين), names in Latin letters stay Latin.

## Boards

`video/boards.js` holds the motion-graphics boards; `video/README.md` has the table of kinds. Each is a pure
function of `(spec, step, age, total)`. Before using a board in an episode, render test frames and look at them:
labels overflow easily, so keep them short, and `story` lines over about 26 characters need `"size": 54`.
A small harness that screenshots boards at chosen steps is worth writing first (load `boards.js` in a page that
registers the fonts from `video/node_modules/@fontsource`, call `board(spec, step, age, total, {})`, screenshot).

Add a new kind when a mechanism has no good picture among the existing ones; add it at the end of `BOARDS`, with a
comment that says what it shows and what each step does, and add its row to the README table.

## Pipeline

```
cd video && npm install                      # fonts; Playwright and Chromium are already on the machine
node storyboard.cjs request ../episodes/techforbadguys/<episode>/storyboard.json <job-id>     # request.json, script.md
git add … && git commit && git push          # the factory reads request.json from the branch
# run the workflow tts.yml on your branch with inputs job_id and request_path=episodes/techforbadguys/<episode>/request.json
video/produce.sh episodes/techforbadguys/<episode> <job-id> <work dir>/<name>.mp4             # waits for the voice, then does the rest
node youtube.cjs kit ../episodes/techforbadguys/<episode>/storyboard.json cues/<episode>.json ../episodes/techforbadguys/<episode>/youtube
node youtube.cjs art youtube/<specs>.json ../episodes/techforbadguys
```

- The workflow is triggered with the GitHub tools (`run_workflow`, `workflow_id: tts.yml`, `ref`: your branch).
  The voice takes about two minutes. Its secrets live in the repository; never print or commit them.
- `produce.sh` runs for 15 to 20 minutes per episode (about 22 frames a second on 4 CPUs). Run it in the
  background and one at a time.
- After a render, pull a dozen stills across the video into one contact sheet and look at it before delivering.
  Check the aligner's line too: "matched exactly" should be above 80%.
- Videos are not committed. Deliver them to the user from the work directory.
- The `youtube` block in the storyboard (titles, description lines, tags, settings, pinned comment, sources) and
  the thumbnail specs are described under "Upload kit" in `video/README.md`; `explain-crypto-01-ar/storyboard.json`
  and `video/youtube/art-crypto-file-ar.json` are worked examples.

## Things already learned the hard way

- Do not poll a CDN URL that does not exist yet and then download the same URL: the "not found" is cached.
  `produce.sh` avoids it with a fresh version number per request.
- Foreground `sleep` loops are blocked; wait with a background command that exits when a marker appears.
- Arabic on screen: no letter-spacing; write ranges as "3 إلى 4"; a percentage renders as "%10", which is normal.
- Two-item `steps` boards and long `story` lines were the usual overflow; `rows` with a `sub` line need short text.
- The host's side lean covers the outer 300 px of a held board; keep the important part of a board near the middle.
- A stamp and a small line on the same thumbnail overlap; use one of them.

## English versions

The English files (`explain-crypto-0N-en`, `explain-network-0N-en`) are adaptations of the Arabic ones, not
translations: same facts, order and boards; the lines and every joke rewritten for English speakers (names Alice,
Bob, Carol; dollars). Each storyboard's first note lists the jokes that were replaced.

- Fields: `"language":"en-US","rtl":false`, brand `EARTH / REPORT` with tagline `FIELD FILE: <SUBJECT>`, glossary
  "The Human Dictionary", sign-off "This has been Earth Report. Agent Peek. End of transmission." The style prompt
  is Earth Report 001's English one plus the brisk, no-dead-air sentence of the Arabic explainers.
- Length, measured on crypto part 1: the voice reads about **182 words a minute raw and 216 after tightening and
  tempo**. 1,767 words gave 8:24 with the end card. Aim for 1,650 to 1,900 words.
- Years and amounts are written as digits ("2008", "$41"); the transcriber writes them as digits too, and the
  aligner matched 97 to 98 percent.
- Boards: `board()` sets `cfg.ltr` from the storyboard's `rtl:false` (a board's own `dir` still wins); `ledger`,
  `story`, `chain`, `rows`, `versus` and `lever` follow it, and the title card lifts its kicker over Latin capitals
  and takes an optional `size` for long titles (110 to 160). Arabic frames are unchanged.
- Latin text is wider than the Arabic: on a four-item `steps` board keep each `sub` under about 16 characters; `story`
  lines start at x 760, so keep them under about 30 characters (or `"size": 54`); `route` labels one or two words.
- Thumbnails: `video/youtube/art-*-file-en.json`. Text sits on the left, so icons go by the host's hand
  (x about 1150, y 610) on the `a` thumbnails and near x 1000 on the `peek` ones.
