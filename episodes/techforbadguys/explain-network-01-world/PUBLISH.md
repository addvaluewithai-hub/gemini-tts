# Network part 1 (world picture): for review, then publishing

Nothing is uploaded. The owner reviews this render first; the publisher uploads only after he names the video and time.
Release planned: Friday 20 November 2026.

## The render

- Branch `network-world`; voice job `techforbadguys-explain-network-01-ar-v` (Vertex, Puck, same direction as crypto
  part 1; listen-back 0.906, not flagged; missing words are number spellings and one stretch the transcriber skipped).
- Length **449.6 s (7:30)**, 1920 x 1080, 30 fps, 13,488 frames, -16.2 LUFS, 81 MB. R2: `network-01/episode/full-ar.mp4`.
- Reproduce: `CLOUD_NAME=lskr7x7h video/produce.sh episodes/techforbadguys/explain-network-01-world techforbadguys-explain-network-01-ar-v out.mp4`
  (cues and transcript come out unchanged).
- Look: the network file's own blue-teal night (`netNight` in `video/boards.js`), the owner asked for a look apart
  from the crypto file. Sets in `video/sets/` (props `net.js`), shot list `shots.md`. No Arabic on screen, no captions.
- Last 13 s: end card NEXT 2 / 4.

## English

- Voice job `techforbadguys-explain-network-01-dub-en` (warm Puck; listen-back 0.968), script in
  `../explain-network-01-dub-en/storyboard.json`, fitted with `dub.cjs` (0.90x to 1.18x, no late beat).
- `audio-en.m4a` in R2 (`network-01/episode/audio-en.m4a`, -16.2 LUFS, 449.6 s); `youtube/captions-en.srt`; `youtube/en.md`.

## Upload kit (`youtube/`)

`upload.md` (titles, tags, settings, pinned comment), `description.txt` (chapters, sources), `captions.srt`,
`thumbnail-a.jpg` (Arabic) and `thumbnail-en.jpg`. Shorts: `shorts-proposals.json` (five, in order of
recommendation, each with its own closing line in Arabic and English; not recorded or rendered until the owner picks)
and `shorts/thumb-<key>-intl.jpg` (no words).
