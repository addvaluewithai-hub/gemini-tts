# Publishing crypto part 2 (world picture)

The owner approved the final cut on 2026-11-15 ("عظمة"); the planner uploads and schedules it. Nothing has been uploaded. Target
release: Friday 20 Nov 2026, 18:00 Cairo.

## The video

- Branch `crypto-world`. Sets `video/sets/c2*.js` (shot list `shots.md`), shared props `video/sets/c2props.js`.
- Voice: job `techforbadguys-explain-crypto-02-ar-v` (Arabic, Puck, recorded on Vertex AI with no API key, the same
  model, voice and direction as part 1's -ar-v; Speech-to-Text listen-back agreement 0.913). Set ends retimed to it.
- Length **440.0 s (7:20)**, 1920 x 1080, 30 fps, 13,200 frames; about 88 MB after the delivery encode; −16.4 LUFS.
- English track: job `techforbadguys-explain-crypto-02-dub-en-w` (warm Puck, agreement 0.975), fitted with dub.cjs
  (median 1.09x, two beats up to 1.4 s late), mixed with the video's music and effects: `audio-en.m4a`, −17.5 LUFS.

## In R2 (bucket earth-report-assets)

`crypto-02/video-world.mp4`, `crypto-02/audio-en.m4a`, `crypto-02/thumbnail-ar.jpg`, `crypto-02/thumbnail-en.jpg`,
`crypto-02/captions-ar.srt`, `crypto-02/captions-en.srt`, `crypto-02/description-ar.txt`.

```
CLOUD_NAME=lskr7x7h video/produce.sh episodes/techforbadguys/explain-crypto-02-world techforbadguys-explain-crypto-02-ar-v /path/to/crypto02-world.mp4
```

`transcript.json` and `video/cues/explain-crypto-02-world.json` come out unchanged (check `git diff`).

## Checked

- No Arabic on screen; chapter chips are English (`01 HASH` … `09 RECAP`); no captions burned in.
- Every illustrated beat is a drawn set in part 1's world; shots hand over through shapes (short colour flashes of
  about 0.2 s are those hand-overs).
- The last 13 s are the end card `NEXT 3 / 6` (key, safe, mask) for the end-screen elements.

## Upload kit (`youtube/`)

- `upload.md` (titles, tags, settings, pinned comment), `description.txt` (chapters and sources), `captions.srt`.
- `thumbnail-c.jpg`: the owner's own part 2 design (Arabic); `thumbnail-en.jpg`: the same picture in English.
- `en.md`: the English entry. `captions-en.srt` is here; `audio-en.m4a` is in R2.
- `shorts.json`: six proposed Shorts with their own closing lines (recorded on Vertex, Arabic and English), for the owner to pick from; not rendered.
