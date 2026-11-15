# Publishing electricity part 1 (world picture)

The owner watched this render and approved it on 2026-11-15 («الفيديو جااااامد»). Nothing is uploaded to YouTube or
TikTok yet: the publisher uploads it once the owner confirms the publishing time (proposed: Wed 18 Nov 2026, 18:00 Cairo).

## The video

- R2 `electricity-01/episode/full-ar.mp4`: 507.1 s (8:27), 1920 x 1080, 30 fps, -15.9 LUFS, about 85 MB.
- Version for the four-part file (2026-11-15): the same picture, sound and timing the owner approved; only the end card now reads NEXT 2/4, and the titles, descriptions and thumbnail labels say 1/4 (owner approved the change). Replaces the earlier 2/3 render in R2.
- Rendered from commit `fbdca69` on branch `electricity-world` (`video/clip.cjs` on the tightened voice, then the delivery encode).
- Voice: Vertex job `techforbadguys-explain-electricity-01-ar-v` (agreement 0.894) with section 4 (current) from
  `-ar-v-t3` (0.978) spliced in at the section breaks, because the full take dropped «مابتشغّلش حاجة». The spliced and
  tightened voice is in R2 (`electricity-01/voice/`); to re-render, download `full-ar.tight.wav` and run
  `node clip.cjs cues/explain-electricity-01-world.json full-ar.tight.wav out.mp4` (produce.sh would fetch the unspliced take).
- English track: R2 `electricity-01/episode/audio-en.m4a` (job `techforbadguys-explain-electricity-01-dub-en-w`, warm Puck,
  agreement 0.955, fitted with dub.cjs, -16.0 LUFS). Studio: Languages, English, Audio.

## Checked

- Length 8:27; contact sheet every 10 s; no Arabic on screen; chapter chips English (01 CHARGE … 10 RECAP).
- The file's own look (teal and navy night, amber light, teal and orange houses), not the crypto violet.
- Joins in the voice (around 1:54 and 3:00 of the video) listened back with a second recognizer: clean.
- Last 13 s: the end card NEXT 2/4 for the end-screen elements.

## Upload kit (`youtube/`)

`upload.md` (titles, tags, settings, pinned comment), `description.txt` (chapters and sources), `captions.srt`,
`thumbnail-a.jpg`; English: `en.md`, `captions-en.srt`, `thumbnail-en.jpg`. Shorts: `shorts.json` (five proposals, not rendered yet).
