# Publishing crypto part 1 (world picture)

The owner approved the render described here on 2026-11-14 ("ready to publish"). This page is for the session that
uploads it; nothing has been uploaded yet.

## The approved video

- Rendered from commit `04be9b5` on branch `crypto-01-sets` (the only later commits add this page and the upload kit;
  no code, storyboard or cue changed after it).
- Voice: job `techforbadguys-explain-crypto-01-ar-c` (Arabic, already recorded; do not re-record).
- Length **447.0 s (7:27)**, 1920 x 1080, 30 fps, 13,410 frames; about 82 MB after the delivery encode.

To reproduce it, from the repository root at that commit (fonts first: `cd video && npm install`):

```
video/produce.sh episodes/techforbadguys/explain-crypto-01-world techforbadguys-explain-crypto-01-ar-c /path/to/crypto01-world.mp4
```

`produce.sh` downloads the recording, tightens it (`--max 0.32 --keep 0.22`, 521.2 s → 459.7 s), rewrites
`transcript.json` and `video/cues/explain-crypto-01-world.json` (both should come out unchanged; check `git diff`),
renders with `clip.cjs` (about 15 minutes on 4 CPUs) and encodes with loudness normalised to −16 LUFS.

## Check on the result before uploading

- Length 7:27; the voice is in sync (lips and the money scene's fish swap on "سمكة قصاد رغيف").
- **No Arabic anywhere on screen**: the channel name reads "Earth Report" top right and on the studio desk, chapter chips
  are English (`01 MONEY` … `12 RECAP`), no captions are burned in.
- Studio shots show Peek's hat and antennae whole, with no black bars above or below.
- Effects are quiet (`sfxGain` 0.25) and there is no whoosh on cuts (`whooshGain` 0).
- Every illustrated scene is the new drawn style (night town, bank, book); shots hand over through shapes, not cuts.
- The last 13 s are the end card ("NEXT 2/5") for the end-screen elements.

## Upload kit (`youtube/`)

- `upload.md`: the three titles (first recommended), tags, settings, pinned comment.
- `description.txt`: paste as it is; it holds the chapters (from this render's timing) and the sources.
- `thumbnail-a.jpg` (recommended: the coin heap worth $700,000,000 beside the two pizza boxes) and
  `thumbnail-b.jpg` (the coin): frames from the video itself, no Arabic.
- `captions.srt`: Arabic subtitles (a track viewers can switch on, not burned in). `captions-en.srt` and `en.md`:
  the English language entry (title, description, subtitles). `en.md` also names an English audio track
  `audio-en.m4a` that is not in the repository; skip it unless the owner supplies it.
- With `video/youtube_upload.py`: `video/youtube_upload.py episodes/techforbadguys/explain-crypto-01-world <video.mp4> --thumb a`
  uploads as private; public or scheduled only as the owner decides (`--privacy`, `--publish-at`). Try `--dry-run` first.
