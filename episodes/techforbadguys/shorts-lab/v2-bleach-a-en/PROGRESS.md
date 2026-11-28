# Progress: bleach Short, studio A, version 2, English (US)

- [x] Script (`script.md`): 139 words, same 13 beats as the Arabic film, jokes rewritten for an American viewer, facts unchanged
- [x] Voice: Puck on the Vertex voice factory only, 4 full takes in 2 directions and 2 rounds (`voice/build-requests.mjs`),
  measured per line, best take per line cut (`voice/edit.json`, `voice/timeline.json`)
- [x] Build: `video/shorts-v2a/bleach_en.js` (Arabic cues mapped to English words by `cues_en.json`), `sets_us.js`,
  `sound_en.py`, the "us" look in `mom.js`. The Arabic film (`bleach.js`, `sound.py`, its voice files) is untouched and
  still renders the same.
- [x] Pass 1 render, review (contact sheet and bursts), fixes; pass 2 render, review; delivered

## Build commands (from the repo root; S = a scratch folder holding the takes as takes/en-a1.wav + .json, etc.)

    python3 video/shorts-v2a/voice_edit.py voice/edit.json $S/takes voice $S/voice.wav $S/timeline.json
    python3 video/shorts-v2a/build_data.py $S/timeline.json $S/voice.wav $S/data.json 2.0
    python3 video/shorts-v2a/sound_en.py $S/timeline.json $S/data.json $S/voice.wav $S/mix.wav
    cd video/shorts-v2a && node render.cjs --data $S/data.json --m bleach_en --workers 4 --out $S/film.mp4

Takes: https://res.cloudinary.com/lskr7x7h/video/upload/gemini-tts/techforbadguys-v2a-bleach-en-<a1|b1|a2|b2>.wav
(and `raw/upload/.../<id>.transcript.json`).

## Review notes

- Pass 1: a caption grouped "The rule" with "Ever" across the written rule; the rule's long row touched the frame
  edges on the beat swell (Anton 92 -> 84); the proud-photo phone was hidden behind her head (moved to the right hand,
  larger); frame one had no caption yet (first caption now on from frame one).
- Pass 2: 56.7 s, -15.2 LUFS, 1080x1920, 30 fps; key text inside x 60-960.

## Decision log

- Cues: rather than renumbering every action in a copy of the scenes, the copy keeps the Arabic word numbers and a
  table (`cues_en.json`) points each one at the English word that carries the same action; line starts and the written
  text read the English lines directly. A missing entry throws, so a script change cannot silently mistime the film.
- Round 1 takes ran 66-67 s with line pitch medians in a narrow band; round 2 was directed faster with the extremes
  pushed (the aside about 100 Hz, the alarm about 330 Hz). Round 2 take a2's line 12 was heard as "The cash you're
  thinking of", so that line came from b1.
