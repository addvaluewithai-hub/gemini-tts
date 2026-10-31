# techforbadguys

A sarcastic tech-news show rendered through the Gemini TTS factory.

The joke of the channel: every episode is framed as a "briefing for villains",
and the punchline is always the same. The bad guys do not need clever tricks,
because the rest of us keep leaving the door open. Nothing in a script is
operational guidance. It is commentary on public news, delivered deadpan.

## Layout

```text
episodes/techforbadguys/
  README.md
  epNNN-YYYY-MM-DD/
    script.md       human-readable script with source links
    request.json    factory request (docs/API.md schema), single host, per-segment style
    dispatch.json   ready-to-send repository_dispatch body with a stable job_id
    result.json     factory result: model, Cloudinary audio/transcript/VTT URLs, duration
    ep001.vtt       caption cues derived from the rendered audio
    ep001.transcript.json  word-level timestamps
    card.png        1920x1080 title card used as the video background
  card.py           generates the title card with Pillow (edit the title and bullets per episode)
  build.sh          ffmpeg render: card + live waveform strip + burned-in captions -> MP4
```

Rendered `.mp4` and `.wav` files are ignored by git on purpose. The audio stays on
Cloudinary at the URL in `result.json`; the MP4 is re-creatable with `build.sh`.

## House style

- Host voice: `Algenib` (gravelly, dry). Keep it for continuity between episodes.
- One speaker. Use `turns` without `speaker` so each segment can carry its own `style`.
- Sarcasm lives in `style` and in the wording, never in stage directions inside `text`.
  The TTS model will read "say this sarcastically" out loud if you put it in `text`.
- Momentary beats go inline: `<short pause>`, `<long pause>`, `<sigh>`, `<chuckles>`.
- Only report stories that were verified against at least one primary or
  established outlet. Link them in `script.md`.
- Routing `quality`, WAV, 24 kHz, transcript with `en-US` hint and VTT on.

## Rendering an episode

Locally (needs `GEMINI_API_KEY_1`, and `CLOUDINARY_URL` unless `--no-upload`):

```bash
node src/cli.mjs \
  --file episodes/techforbadguys/ep001-2026-10-31/request.json \
  --job-id techforbadguys-ep001 \
  --result result.json
```

Through GitHub Actions, post `dispatch.json` as the body of a
`repository_dispatch` call (see docs/API.md section 12), or paste
`request.json` into the "Gemini TTS Factory" workflow_dispatch form with
`job_id` set to `techforbadguys-ep001`.

The validity of every `request.json` under this directory is checked by
`test/episodes.test.mjs`.

## Building the video

```bash
python3 episodes/techforbadguys/card.py episodes/techforbadguys/ep001-2026-10-31/card.png
curl -sSfL -o /tmp/ep001.wav "$(jq -r .audio_url episodes/techforbadguys/ep001-2026-10-31/result.json)"
episodes/techforbadguys/build.sh \
  episodes/techforbadguys/ep001-2026-10-31/card.png \
  /tmp/ep001.wav \
  episodes/techforbadguys/ep001-2026-10-31/ep001.vtt \
  episodes/techforbadguys/ep001-2026-10-31/techforbadguys-ep001.mp4
```

Needs ffmpeg with libass and the Inter font (falls back to DejaVu).
