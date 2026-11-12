# video

Code-drawn visual assets for episodes rendered by the Gemini TTS factory.
Nothing here is used by the TTS worker itself.

## characters/

Thirty-six candidate hosts for the techforbadguys channel, drawn as parametric SVG
in `characters/characters.js`. Each `draw(expression)` takes

```js
{ lid: 0..1, look: -1..1, mouth: "smirk" | "talk" | "flat" }
```

The channel premise: the host is an alien living undercover on Earth, and each
episode is the sarcastic field report it files to its home planet. The last
fourteen candidates are drawn for that premise: `grey` to `normal` play it
for laughs, `nullx` to `observer` keep it cold and minimal.

The expression object exists so the chosen character can later be animated from an episode's audio and
word timestamps (blink, glance, mouth driven by the voice level).

| id | name | idea |
|---|---|---|
| `glitch` | GLITCH | A beige CRT monitor that grew horns and a devil-tail power cable |
| `redacted` | MR. REDACTED | Trench coat, fedora, and a redaction bar over the eyes |
| `byte` | BYTE | The villain's unimpressed black cat with an open padlock on its collar |
| `skully` | SKULLY | A skull news anchor with a headset and a bow tie |
| `bandit` | BANDIT | A smug raccoon in a hoodie, born with the mask on |
| `phish` | PHISH | An anglerfish whose glowing lure is an @ sign |
| `trojan` | TROJAN | A wooden horse on wheels with eyes peeking out of the hatch |
| `cookie` | COOKIE | A bitten third-party cookie in sunglasses |
| `null` | NULL | An empty black hoodie with two glowing eyes and a cursor for a mouth |
| `quack` | QUACK | A rubber debug duck with a pirate eyepatch |
| `octo` | OCTO | A keylogger octopus with slit pupils |
| `locksley` | SIR LOCKSLEY | An open padlock with a monocle and a mustache |
| `toasty` | TOASTY | A smart toaster on Wi-Fi and three botnets |
| `spoof` | SPOOF | A ghost wearing a "HELLO I AM YOU" name tag |
| `proxy` | PROXY | A sly fox in a suit, sitting in the middle |
| `zero` | DR. ZERO | A plague doctor with red lenses and a bone beak |
| `patch` | PATCH | The invisible man: bandages, round dark glasses, bowler hat |
| `leak` | LEAK | A hazmat hood and gas mask that arrives after every data spill |
| `oni` | ONI | A black hoodie wearing a red demon mask with gold horns |
| `source` | THE SOURCE | A suit and tie with a paper bag over its head |
| `watcher` | WATCHER | A CCTV camera for a head on a corporate body |
| `zip` | ZIP | A balaclava with a zipper for a mouth |
| `grey` | AGENT GREY | A grey alien in a trench coat whose hat is his flying saucer |
| `hugh` | HUGH MANN | An alien in a half-unzipped human mask |
| `xeno` | XENO | A hooded visitor with antennae through the hood and an EARTH visitor badge |
| `zorp` | ZORP | A three-eyed field correspondent with a toupee and a headset |
| `peek` | PEEK | A spy behind a newspaper with three eye holes cut in it |
| `pilot` | PILOT | A tiny alien driving a human suit from a glass dome |
| `normal` | MR. NORMAL | A green alien in novelty glasses, fake nose, mustache and a HUMAN name tag |
| `nullx` | NULL-X | Null's hoodie with large glowing alien eyes in the void |
| `agentx` | AGENT X | Mr. Redacted as a grey alien whose eyes are too big for the redaction bar |
| `xray` | X-RAY | Skully as an alien skull: long cranium, slanted sockets, headset, bow tie |
| `visitor` | THE VISITOR | A bone-white grey in a black suit and tie, nothing else |
| `commander` | COMMANDER | A black helmet with a gold visor reflecting Earth |
| `hover` | HOVER | A suit with no head and a small flying saucer parked above the collar |
| `observer` | OBSERVER | A black hood with five glowing eyes |

Rendered cards live in `characters/cards/` (`overview-all.png` shows the first fifteen, `overview-shortlist.png` the masked shortlist of ten, `overview-aliens.png` and `overview-aliens-2.png` the undercover aliens). Regenerate them with:

```bash
cd video && npm install --no-package-lock
node characters/render-sheet.cjs characters/cards   # needs Playwright + Chromium
```

Fonts come from the `@fontsource/*` packages in `package.json` (all OFL) plus
JetBrains Mono from the system.

## characters/concepts.html

A third pass that leaves the bust-on-flat-colour template behind: nine ideas,
each in a different drawing style and with a different notion of what the host
is. Rendered cards are in `characters/concepts/`.

| id | idea | style |
|---|---|---|
| `pixel` | An alien anchor at a news desk | 16-bit sprite on a CRT |
| `neon` | The host is a sign in a window | Neon tubes on brick |
| `unit7` | No body, one eye in orbit | Glossy glass orb with a ring |
| `coo` | Undercover as a pigeon with a camera eye | Paper-cut shapes |
| `signal` | Never on Earth, only a transmission | Scanline hologram with glitch |
| `line` | A face drawn without lifting the pen | One continuous stroke |
| `zine` | A photocopied poster taped to a wall | Xerox halftone |
| `glyph` | The host is a text face | Pure type |
| `bureau` | No host, the report comes from an office | Official seal |

```bash
node characters/render-sheet.cjs characters/concepts concepts.html
```

## characters/peek.html

The direction picked so far: PEEK, the alien spy in a fedora with a
newspaper, reworked with two eyes and a visible face. The newspaper is a
recurring prop (folded under the arm, peeked over, or hidden behind with two
eye holes) rather than a permanent cover. `peekSpy(expression, variant, paper)`
and `peekPixel(mode)` in `characters.js` draw it; cards are in `characters/peek/`.

| variant | face |
|---|---|
| A / ROUND | Round head, round pupils, blush |
| B / SLY | Narrow head, slit pupils, smirk |
| C / SQUID | Round head with a tentacle beard |
| D / PIXEL | The same spy as a 24x24 sprite |

```bash
node characters/render-sheet.cjs characters/peek peek.html
```

## characters/peek3d.js

PEEK redrawn as a soft, volumetric cartoon instead of flat outlined vector:
radial gradients for form, no outlines, glossy eyes with iris detail and lid
shadows, a hat-brim shadow across the face, drop shadows and a light film
grain. Still pure SVG, still driven by the same expression object, so it can
be animated the same way.

`peek3d(expression, { face, paper, viewBox })` returns a full 1200x1200 scene.
`face` picks an entry of `FACES`, which holds everything that makes a face:
head outline, eye positions and sizes, iris and skin colours, mouth placement
and optional extras (ears, muzzle, brow, nose bump).

| face | idea |
|---|---|
| `A` | Wide round pink head, big amber eyes |
| `egg` | Tall narrow mint head, close-set heavy-lidded eyes, fin ears |
| `pear` | Small skull and huge cheeks, small blue eyes, nose bump, one tooth |
| `goggle` | Round lilac head, two huge teal eyes pressed together |
| `tall` | Small peach head, tall oval green eyes, pale muzzle |
| `block` | Square steel-blue head, heavy brow, small ember eyes |

`paper` is
`"pockets"` (hands in pockets, paper under the arm), `"roll"` (rolled newspaper
in hand), `"over"` (peeking over the paper) or `"holes"` (hidden behind it, two
eye holes). The full-body design
adds a tan trench coat, a PRESS card in the hat band and short legs.

```bash
node characters/render-sheet.cjs characters/peek3d peek3d.html
```

### The picked face: `pear`

`characters/pear.html` renders the chosen face on its own: full body, a
close-up, a hands close-up and four states. Hands are drawn as single silhouettes lit as one object, with three finger
bumps separated by soft creases and a thumb lobe. Building them from separate
finger shapes made them read as assembled parts no matter how the sizes were
tuned. The same glove-like hand appears relaxed (`mitt`), closed round the
rolled paper (`fist`) and over the edge of the open paper (`grip`).

The default resting pose is `paper: "pockets"`: hands in the coat pockets
with the rolled paper tucked under the arm, so the hands only appear when he
actually holds the paper. `paper: "roll"` keeps the hands-out version.
Faces with `teeth: true` get two front teeth under
the lip and a full upper row when talking.

```bash
node characters/render-sheet.cjs characters/pear pear.html
```

## Animated clips

`clip.cjs` renders the host talking over episode audio. Each frame is a pure
function of time, so a clip can be re-rendered or cut anywhere:

1. `lipsync.cjs` looks each word up in the CMU pronouncing dictionary (with
   number expansion and a letter-rule fallback), spreads its phonemes over the
   part of the word where the WAV actually has sound, and maps each phoneme to
   one of nine mouth shapes; loudness scales how far the jaw opens;
2. a small director adds blinks, glances, a head bob and tilt, the deadpan
   holds and the newspaper coming up or dropping away, as listed in a cue file;
3. `stage.html` draws the character plus word-synced captions, Chromium
   screenshots it, and ffmpeg encodes the frames with the audio.

```bash
cd video && npm install --no-package-lock
# audio: the WAV named in the episode's result.json (audio_url)
node clip.cjs cues/ep001-test.json /path/to/ep001.wav out.mp4
node clip.cjs cues/ep001-test.json /path/to/ep001.wav out.mp4 --still 2.0,15.5   # single frames
```

A cue file (`cues/*.json`) gives the episode folder, the audio range, a
silent lead-in, the face, when the newspaper pose changes
(`holes`, `pockets`, `over`) and the time ranges to hold a deadpan look.
Times are seconds of episode audio. Rendering runs at roughly real time on
four browser pages.

### One mouth

The mouth is a single parametric drawing (`mouth` in `peek3d.js`): two lip
curves that share their corners, driven by `w`, `smile`, `jaw`, `smirk` and
`tongue`. With `jaw` at 0 the curves coincide into the resting smirk, so idle,
deadpan and every speech shape are the same lips and the same two front teeth
with different numbers, and the director can blend between them without a
jump. `characters/visemes.html` renders the chart of shapes:

```bash
node characters/render-sheet.cjs characters/pear visemes.html
```

### Acting

`characters/acting.js` is the vocabulary: sixteen feelings (`EMOTES`: brows,
lids, eye size, gaze, the mouth held while silent, antennae, a nudge to the
speech shapes) and twelve gestures (`GESTURES`: hand targets; a hand with no
target stays in its pocket). `characters/acting.html` renders both as sheets
into `characters/acting/`.

`director.cjs` uses it to perform a script without hand animation:

- it splits the transcript into sentences and gives each a feeling and a
  gesture from keyword rules, falling back to a rotation so nothing repeats
  back to back;
- every real pause gets a reaction (deadpan, smug, eye-roll, wink, ...) and a
  slow push-in;
- the loudest words get a brow flash, a nod and a hand beat;
- the body sways, leans into each sentence and hops on happy beats; the
  antennae trail the head on springs;
- every channel is eased, so feelings and poses blend instead of switching.

`node clip.cjs <cues> <wav> <out> --plan` prints the choice made for each
sentence. `acting` entries in the cue file override a time range:

```json
{ "from": 12.9, "to": 14.8, "emote": "smug", "gesture": "point", "react": "deadpan" }
```

### Cue files by sentence

A cue can be placed with `match`, a pattern found in a sentence of the
transcript, instead of a time. That lets a cue file be written from the script
before the audio exists. `paper` entries take `match` and an optional `until`,
`acting` entries take `match`, and `chapters` gives the label shown above the
captions from a matching sentence on. `fix` corrects caption spellings without
touching timing, and can collapse a misheard phrase into one word:

```json
"fix": [["SS hole", "SSHole"], ["news appeal", "newspaper"]]
```

`"to": null` renders the whole episode. `cues/fr001.json` is the full example.

## Studio episodes

A cue file with an `edit` list is rendered on the news-desk set instead of the
plain stage: the host sits behind a desk next to a wall screen, and the camera
cuts between shots every second or two.

```sh
# 1. screenshots of the stories, into the episode folder
node capture.cjs ../episodes/<channel>/<episode>/slides.json ../episodes/<channel>/<episode>/slides
# 2. the episode
node clip.cjs cues/news-2026-11-10.json <voice.wav> out.mp4 --workers 6
```

| File | Job |
| --- | --- |
| `capture.cjs` | Screenshots each article from its header down (2.4 screens by default, `tall` per slide) to `slides/<name>.jpg` and records the headline's position in `slides/captured.json`, so an insert can scroll through the page. It answers a cookie notice with the notice's own button. A page that returns a bot check or an error is skipped; give that slide a `text` line in `slides.json` and it is shown as a plain text card with the source and date. |
| `studio.html` | The set (wall, screen, desk, props), the full-frame screenshot window, the big-number cards, the story chip and the captions. `window.draw(state)` paints one frame. |
| `editor.cjs` | Reads the `edit` list and produces the state for every frame: camera, transitions, what the screen shows, where the host is. Also emits the sound cues. |
| `sfx.cjs` | Synthesises every effect (whoosh, shutter, impact, pop, ding, riser, drone) and the music bed. No audio files are used besides the voice. |

### The edit list

Each entry starts at a spoken phrase (`at`, matched against the transcript
words, searching forward from the previous entry) or at a time (`t`), and runs
until the next entry. An entry with `shot` is a cut; an entry without one
changes something inside the running shot.

```json
{ "at": "Nvidia's board", "shot": "two", "slide": "nvidia", "story": { "n": 1, "tag": "NVIDIA" }, "gesture": "tv" },
{ "at": "independent investigation", "shot": "insert", "mark": [0.047, 0.843, 0.64, 0.036], "zoom": 1.5 },
{ "at": "foreign intelligence", "shot": "host", "duck": true, "emote": "worried" },
{ "at": "1.4 trillion", "shot": "side", "fact": { "big": "$1.4T", "small": "valuation, up to · CNBC", "riser": true } }
```

| Field | Meaning |
| --- | --- |
| `shot` | `wide`, `host`, `close`, `two` (host and screen), `side` (host left, room for a card), `low` (desk level), `insert` (the screenshot, full frame) |
| `slide` | Name in `slides.json`. Shown on the wall screen, and in the window for `insert`. `null` puts the channel ident back. |
| `story` | `{ n, tag }` for the chip in the corner; the chip also shows the slide's source and date. |
| `mark` | `"headline"` or `[x, y, w, h]`: a marker runs over that region. x and w are fractions of the width; y and h count 16:9 screens from the top, so y can pass 1 on a tall capture. |
| `zoom`, `center` | How far the insert pushes in, and the point it settles on (defaults to the marked region). Every insert opens at the top of the page and scrolls there. |
| `scroll` | Screens per second the insert keeps scrolling down. |
| `fact` | `{ big, small, tone, riser, chart }`: a card slammed in beside the host. `tone` is `bubble` or `stamp`; `chart: "down"` draws a falling line behind it. Use it on `side` shots. |
| `meme` | A drawing of our own beside the host, on `side` shots: `{ kind: "chat", user, bot }`, `{ kind: "versus", no, yes }` (two panels starring the host), `{ kind: "list", title, items }`, `{ kind: "receipt", title, items, total, foot }`. |
| `duck` | The host sinks behind the desk until only the hat and eyes show. |
| `lurk` | He leaves the chair and reappears above the wall screen. |
| `peek` | His head rises over the corner of an insert. |
| `paper` | `holes` or `over`: he hides behind the newspaper. `pockets` puts it away. |
| `drone` | `{ "drop": "phrase" }` flies a drone through the set and drops it on that phrase; `false` removes it. |
| `emote`, `gesture` | Pin the acting for this entry (see `characters/acting.js`). Otherwise the director decides. |
| `stutter` | Hold each pose for n frames. |
| `trans` | `punch`, `whip` or `cut`. By default it follows from the two shots. |

Top-level settings for a studio episode: `tempo` (speed the voice up without
changing pitch; times in the cue file are then in sped-up time), `lead` and
`tail` (seconds before the first word and after the last), `captionChunk`
(words per caption), `date` (shown in the corner), `bpm`, `musicGain`,
`sfxGain`, `voiceGain`.

`--plan` prints the resolved cut list with times before rendering, and
`--still 12.5,40` writes single frames for checking.

### What goes on screen, and what does not

Screenshots are taken from the story's own page and always carry the source
and date. Memes are drawn here with the host, not taken from existing meme
images. Video from third parties is not downloaded: the trailers and product
films linked from these stories sit on YouTube, and pulling them would break
its terms and invite copyright claims on the channel. The motion in an
episode comes from scrolling the real article, the camera, the props and the
host.

### Other languages

`cues/news-2026-11-10-ar.json` is the same episode with an Egyptian Arabic
voice. What a second language needs:

- its own script and factory request (`episodes/<channel>/<episode>-ar/`), with
  `transcript.language_codes` set, and its own cue file whose `at` phrases are
  taken from that transcript. `episode` can still point at the first
  episode's folder so both share one set of slides;
- `"rtl": true` for right-to-left captions and mirrored meme layouts. The
  display fonts carry Arabic glyphs under the same names (Lalezar for Anton,
  Cairo for the small text), so labels can be written in either language;
- `fix` entries for names and spellings the transcriber changed. Phrases are
  compared without case, punctuation or Arabic vowel marks, and with the alef,
  yeh and teh marbuta variants folded together, so `at` and `fix` can be typed
  the way the transcript prints them;
- nothing for lip sync: Arabic words are sounded out letter by letter.

## Storyboards: long episodes from one file

A hand-written cut list does not scale to an eight-minute episode, and it has
to be rewritten for every language. A storyboard keeps the script and its
direction together instead:

```json
{ "id": "ukraine", "story": { "n": 1, "tag": "روسيا وأوكرانيا" }, "slide": "ukraine", "style": "First file. Serious, then dry.",
  "beats": [
    { "say": "الملف الأول: الحرب.", "shot": "host", "emote": "serious" },
    { "say": "امبارح قعدوا يتفاوضوا في أبو ظبي...", "show": "slide" },
    { "say": "الجلسة قعدت أربع ساعات.", "show": "fact", "fact": { "big": "4 ساعات", "small": "مدة الجلسة · NPR" } },
    { "say": "يعني أقل من ساعة لكل سنة حرب.", "shot": "close", "emote": "deadpan" }
  ] }
```

```sh
# 1. the factory request (one turn per scene), plus script.md with the sources
node storyboard.cjs request ../episodes/<channel>/<episode>/storyboard.json <job-id>
# 2. run the factory; for a long request pass request_path instead of pasting the JSON
# 3. place every beat on the transcript and write the cue file
node storyboard.cjs cues ../episodes/<channel>/<episode>/storyboard.json <transcript.json> cues/<episode>.json
# 4. render as usual
node clip.cjs cues/<episode>.json <voice.wav> out.mp4
```

- A beat is either the host alone (`shot`: `wide`, `host`, `close`, `low`) or
  something shown (`show`: `slide`, `fact`, `meme`). Slide beats take `view`:
  `top` (the headline, marked), `body` or `deep` (further down the page), or
  their own `mark`, `center` and `zoom`. Neighbouring slide beats on the same
  page keep scrolling instead of cutting.
- Step 3 aligns the whole script against the whole transcript, so it does not
  matter that the transcriber respells names or writes numbers as digits. It
  also writes `<cues>.words.json`: the script's own words on the transcript's
  timings. Captions and lip sync use that file, so the screen shows what was
  written.
- A scene can set `music` (0 to 1) and `calm` for a passage that is not a
  joke; the next scene goes back to normal.

### The solo layout

Cue files made from a storyboard use `"layout": "solo"`. There is no wall
screen: the host sits alone at the desk in his shots, and anything shown
(an article, a number, a meme) fills the frame while he sits small at the
bottom right, still talking. The story chip moves to the bottom left over a
shown page so it never covers the headline. `cues/earth-report-001-ar.json`
is the first episode made this way.

### News that is not funny

`characters/acting.js` has four faces for it: `furious`, `annoyed`, `blank`
and `sad` (sheet: `characters/serious/serious.png`, page:
`characters/serious.html`). None of them smirk, and their talking mouths turn
down. Put `"calm": true` on a beat or a scene to stop the nodding and bouncing
on stressed words and keep the hands down, and `"music"` to lower the bed.

### The channel name

`brand` in a storyboard or cue file sets the name on the desk and in the
corner: `{ "a": "تقرير", "b": "الأرض", "c": "", "tagline": "..." }`, where `b`
is the word drawn in pink. It can be Latin or Arabic.

### Vertical shorts

A storyboard with `"layout": "short"` and `"size": [1080, 1920]` renders the
same set in a vertical frame. The host stays on screen the whole time: large
and centred when he is alone, smaller and lower when a fact or a meme sits
above him, with the captions between the two. There are no slides in this
layout, so it suits pieces that are not news.
`cues/humans-guide-001-ar.json` is the first one.

## Explainers: motion-graphics boards

`"layout": "explain"` is for episodes that teach something. The picture
carries the lesson and the host is a guest in it: a few studio shots, and
otherwise he leans in from the edge of the frame while a board is on screen.

`boards.js` draws the boards. Each is a pure function of its step and time,
so any frame can be rendered alone:

| Board | What it shows |
| --- | --- |
| `titlecard` | series name, title and a line under it |
| `steps` | things in a row joined by arrows, one more per step |
| `ledger` | a page of names and balances; each step moves an amount between rows |
| `flow` | people and a go-between; each step moves a coin, adds badges or crosses someone out |
| `copy` | a digital file copying itself, then two people holding "the only one" |
| `chart` | a line that draws itself, then a stamp |
| `doc` | a paper with its title, a date stamp and an unknown author |
| `network` | one ledger becoming a turning globe of machines; a payment ripples through; a cheat is outvoted |
| `block` | a 3D block with a message set into its face |
| `counter` | a number that counts up, what it bought, what that is worth |
| `person` | someone nobody can name: what they said, then gone, and what they left |
| `endcard` | what comes next, with room for the platform's end-screen elements |
| `hash` | a fingerprint machine: text in, a code out; change a letter and the code changes; no way back |
| `chain` | pages that each carry the last one's fingerprint; tamper with one and the rest break |
| `mine` | the guessing race: machines try numbers until one wins, is paid, and the others check it |
| `bars` | bars that grow one after another, with a line under them |
| `keys` | an address anyone may see and the key only its owner holds; the key signs a payment |
| `story` | one person's story: a thing, a headline, and a line more each step |
| `meter` | how much of a fixed supply is gone |
| `dict` | two words from the humans' vocabulary, one per step: the word and what it means |
| `fork` | who changes the rules: machines pick a rule book, and when they disagree the chain splits in two |
| `trace` | coins hop between unnamed addresses until one meets a name; then the whole trail has one |
| `rows` | a list that fills in a row at a time, each with a mark (`flag`, `x`, `check`, `half`), an optional `sub` line and `tag` |
| `lever` | borrowed money: a small stake under a big bet, and the fall in price that takes all of it |
| `versus` | two camps side by side, one per step |
| `vending` | a contract that runs itself, as a vending machine: coin in, rule checked, thing out |
| `stake` | guarding the ledger with a deposit: lock coins, get drawn by lot, lose the deposit for cheating |
| `graveyard` | a field of coins and how many of them are dead |
| `wave` | a sound becomes numbers: the wave, the points measured on it, then only the numbers |
| `cells` | land cut into cells with a tower each, channels reused, a phone checking in, a call handed over |
| `route` | a journey along a row of stops; each step lights the next leg (`link`: `radio`, `wire` or `sea`) |
| `globe` | a flat map of the planet with cables of light between the continents; one can be cut (`cutStep`) |
| `packets` | a message cut into numbered packets, each by its own path, put back in order; one can be lost (`lose`) |
| `pixels` | a picture as a grid of coloured squares, a close look at their numbers, then only what changed |
| `budget` | where the milliseconds go: a bar that grows a part at a time against a "natural" and a "limit" line |

In a storyboard, boards are named once under `boards` and used by beats:

```json
"boards": { "led": { "kind": "ledger", "title": "دفتر البنك", "rows": [...], "ops": [{ "from": 0, "to": 1, "amount": 30 }] } },
...
{ "say": "والأرقام دي ساكنة فين؟", "show": "board", "board": "led" },
{ "say": "لما علي يدفع لمنى...", "show": "board", "board": "led" },
{ "say": "مرتّبك بينزل: رقم.", "show": "board", "board": "led", "step": "hold", "host": "right" }
```

Each beat on a board moves it one step on, even if a studio shot came in
between. `"step": "hold"` keeps it where it is. `host` puts the host on screen
during a board: `right` or `left` (leaning in from that edge) or `pip` (seated
small in the corner); without it he is only heard. `ending.card` closes the
episode on an end card, and `tail` sets how long it holds.
`cues/explain-crypto-01-ar.json` is the first episode made this way.

### Taking out the dead air

The voice comes back with a pause after every turn and many small ones in
between. `tighten.cjs` cuts every silence longer than `--max` down to
`--keep` and moves the transcript's word times to match:

```sh
node tighten.cjs voice.wav transcript.json voice.tight.wav transcript.tight.json --max 0.32 --keep 0.22
node storyboard.cjs cues <storyboard.json> transcript.tight.json cues/<episode>.json
node clip.cjs cues/<episode>.json voice.tight.wav out.mp4
```

Run it before `storyboard.cjs cues`, so the beats are placed on the tightened
audio. `tempo` in the storyboard's settings then speeds the result up without
changing its pitch. On the first crypto file this removed 55 seconds of
silence from eight minutes.

## Upload kit

`youtube.cjs` makes everything an upload needs besides the video.

```
node youtube.cjs kit <storyboard.json> cues/<episode>.json <episode>/youtube   # description.txt, captions.srt, upload.md
node youtube.cjs art youtube/<specs>.json ../episodes/<channel>                # thumbnails, avatar, banners
```

The storyboard's `youtube` block holds what a person writes: three `titles`,
the opening `description` lines, `tags`, `settings`, the `pinned` comment and
the names of the first and last chapters. Chapters come from the cue file's
story changes, captions from the script's own timed words. Sources come from
`slides.json` when the episode shows captured pages; an episode without them
lists its sources by hand in `youtube.sources`.

A thumbnail spec is a tag, a two-line headline (`[[words]]` in yellow), an
optional line under it, the host's `emote` and `gesture`, and `icons`: any of
the boards' icons, placed in 1280 x 720 units.
