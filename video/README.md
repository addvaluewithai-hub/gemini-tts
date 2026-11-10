# video

Code-drawn visual assets for episodes rendered by the Gemini TTS factory.
Nothing here is used by the TTS worker itself.

## characters/

Twenty-nine candidate hosts for the techforbadguys channel, drawn as parametric SVG
in `characters/characters.js`. Each `draw(expression)` takes

```js
{ lid: 0..1, look: -1..1, mouth: "smirk" | "talk" | "flat" }
```

The channel premise: the host is an alien living undercover on Earth, and each
episode is the sarcastic field report it files to its home planet. The last
seven candidates (`grey` to `normal`) are drawn for that premise.

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

Rendered cards live in `characters/cards/` (`overview-all.png` shows the first fifteen, `overview-shortlist.png` the masked shortlist of ten, `overview-aliens.png` the undercover aliens). Regenerate them with:

```bash
cd video && npm install --no-package-lock
node characters/render-sheet.cjs characters/cards   # needs Playwright + Chromium
```

Fonts come from the `@fontsource/*` packages in `package.json` (all OFL) plus
JetBrains Mono from the system.
