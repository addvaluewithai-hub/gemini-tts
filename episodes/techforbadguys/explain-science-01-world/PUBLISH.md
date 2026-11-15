# Publishing science part 1 (world picture, notebook look)

Rendered on 2026-11-15 for the owner's review; **not approved yet, nothing uploaded**. Planned slot: Tuesday 24 Nov 2026.

## The video

- Branch `science-world` (gemini-tts). Voice: Vertex AI job `techforbadguys-explain-science-01-ar-v` (Puck, the crypto
  direction; listen-back agreement 0.92), tightened 504.6 s → 444.4 s, 89% of words matched exactly.
- Length **432.6 s (7:12.6)**, 1920 x 1080, 30 fps, 12,978 frames, −16.2 LUFS, 72 MB.
- In the asset store: `science-01/episode/full-ar.mp4` (see channel-earth-report `content/assets.json`).
- Reproduce: `CLOUD_NAME=lskr7x7h video/produce.sh episodes/techforbadguys/explain-science-01-world techforbadguys-explain-science-01-ar-v out.mp4`
  (the voice lives on the `lskr7x7h` Cloudinary account, not produce.sh's default).

## Look

The science file's own look: a scientist's notebook in daylight (sand graph paper, terracotta, sage, ink), navy only for
real night (the comet, the eclipse). Studio theme `lab` (warm walls, terracotta desk, plum desk front). No Arabic on
screen, no captions burned in, chapter chips in English, the last 13 s are the end card (NEXT 2/5).

## Upload kit (`youtube/`)

- `upload.md`, `description.txt` (Arabic chapters from this render, sources), `captions.srt`.
- `thumbnail-a.jpg` (recommended: the loose cable) and `thumbnail-b.jpg` (the stick on the globe); English
  `thumbnail-en.jpg` / `thumbnail-en-b.jpg`.
- English entry: `en.md`, `captions-en.srt`; audio track `science-01/episode/audio-en.m4a` in the asset store
  (Vertex job `techforbadguys-explain-science-01-dub-en-w`, warm Puck, fitted with dub.cjs, −16 LUFS).
- Shorts: `shorts.json` holds five proposals (cable, stick, dragon, halley, theory) with parts and closing lines
  (`shorts/cta-lines.json`, `cta-lines-en.json`); closing lines are recorded and the Shorts rendered once the owner
  picks; language-free thumbnails in `shorts/thumb-<key>-intl.jpg`.

## Status when the file was paused (owner, 15 Nov 2026)

The Science File is paused by the owner; the file is being re-split (five parts instead of four). Where things stand:

- **Part 1** (this folder): rendered, checked and sent to the owner; no feedback yet. Files in R2 under `science-01/`.
  After the re-split the storyboard, title, thumbnails and footer already say 1/5 and the end card says NEXT 2/5, but
  the **render in R2 (`science-01/episode/full-ar.mp4`) still shows "2 / 4" on its end card**: re-render with produce.sh
  (command above) before publishing. Shorts: five proposals in `youtube/shorts.json`, closing lines not recorded.
- **Part 2** (`../explain-science-02-world`): storyboard (words unchanged), Arabic voice on Vertex (job
  `techforbadguys-explain-science-02-ar-v`, 7:11.7 with the end card), every scene drawn (`video/sets/part2a.js`,
  `part2b.js`, `part2c.js`, props `sci2.js`), English dub recorded and fitted (job
  `techforbadguys-explain-science-02-dub-en-w`), upload kit, thumbnails AR/EN, four Shorts proposals. Rendered once
  (end card NEXT 3/5); not yet reviewed by the owner. Files in R2 under `science-02/`.
- **Parts 3 to 5**: on hold; the planner is rewriting them as three parts (rejected-then-right; why science seems to
  contradict itself; when science really fools us).
