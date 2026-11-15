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
