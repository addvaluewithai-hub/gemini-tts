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
