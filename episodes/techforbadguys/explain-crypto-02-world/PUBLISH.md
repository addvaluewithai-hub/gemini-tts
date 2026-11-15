# Publishing crypto part 2 (world picture)

Not approved yet: this page describes the render sent to the owner for review. Nothing has been uploaded. Target
release: Sunday 22 Nov 2026.

## The video

- Branch `crypto-world`. Sets `video/sets/c2*.js` (shot list `shots.md`), shared props `video/sets/c2props.js`.
- Voice: job `techforbadguys-explain-crypto-02-ar-c` (Arabic, Puck, the same direction as part 1; recorded
  2026-11-12 for the slide version and kept, as part 1 kept its recording). Listen-back agreement: the heard text
  matches the script except numbers written as digits and spelling (88% exact word match, no missing or added lines).
- Length **427.5 s (7:07)**, 1920 x 1080, 30 fps; about 87 MB after the delivery encode; loudness −16.1 LUFS.

```
video/produce.sh episodes/techforbadguys/explain-crypto-02-world techforbadguys-explain-crypto-02-ar-c /path/to/crypto02-world.mp4
```

`transcript.json` and `video/cues/explain-crypto-02-world.json` come out unchanged (check `git diff`).

## Checked

- No Arabic on screen; chapter chips are English (`01 HASH` … `09 RECAP`); no captions burned in.
- Every illustrated beat is a drawn set in part 1's world; shots hand over through shapes (short colour flashes of
  about 0.2 s are those hand-overs).
- The last 13 s are the end card `NEXT 3/5` (key, safe, mask) for the end-screen elements.

## Upload kit (`youtube/`)

- `upload.md` (titles, tags, settings, pinned comment), `description.txt` (chapters and sources), `captions.srt`.
- `thumbnail-c.jpg`: the owner's own part 2 design (Arabic); `thumbnail-en.jpg`: the same picture in English.
- `en.md`: the English entry. The English audio and `captions-en.srt` wait for the English voice (script ready in
  `../explain-crypto-02-dub-en`, to be recorded on Vertex AI).
- `shorts.json`: six proposed Shorts with their own closing lines, for the owner to pick from; not rendered.
