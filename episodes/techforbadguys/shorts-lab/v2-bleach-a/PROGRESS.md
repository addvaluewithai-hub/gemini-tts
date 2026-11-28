# Progress: bleach Short, studio A, version 2

Method: promptmetrics/video-skill (MIT), read as reference: requirements, script, storyboard, visual design, design
review. Changed for a 9:16 Short of under a minute; no script approval gate (the owner judges the finished film);
and this studio goes on past the design package and builds the film.

- [x] Requirements: Egyptian adults on phones, sound often off at first; say what never to do and what to do if it happens
- [x] Script (`script.md`): 116 words, hook first, rule in one plain line, five real jokes, facts only from the three sources
- [x] Voice: 13 directed turns, 4 takes in 2 directions, measured per line, best take per line cut together (`voice/`)
- [x] Storyboard (`storyboard.md`) and design spec (`design-spec.md`)
- [x] Build: `video/shorts-v2a/` (own SVG engine drawn in headless Chromium; Peek is the channel's rig, unchanged)
- [x] Pass 1 render, review, fixes; pass 2 render, review, fixes; final render
- [ ] Voice re-recorded on the Vertex factory (see the decision log)

## Design review (video-skill quality checklist, on the rendered frames)

| Check | Result |
|---|---|
| Overall look: flat, rounded, layered, small palette | Pass. Yellow-green is kept for the gas alone |
| Visual hierarchy, one focus per shot | Pass. Diagram shots are on a dark stage under one light |
| Element sizing (no "thumbnail syndrome") | Fixed in pass 2: bottles in scenes 4 and 7a were about 12% of the frame, now 30–45% |
| Text readability | Pass. One Arabic line, 112 px, checked at full size: «الكلور ما يتخلطش بأي منظف تاني» |
| Element overlap | Fixed: the rule ran off both edges on one row (pass 1); the halo sat on bottle 2; the number badges hid behind the toilet |
| Visual richness and ambient life | Pass. Every set has something moving: gas, motes, lamp, charm, heater light, laundry, clouds, blinks, breathing |
| Visual and script in sync | Pass by construction: actions are placed at word times from the cut voice track |
| Numbers and symbols match the words | Pass: badges 1 2 3 on «منظف / اتنين / تلاتة»; three symptom badges on the three symptoms; three crosses on three bottles |
| Safe zones | Pass: key content inside x 60–960, y 200–1560; the three crossed bottles sit at y 1410–1590, just above the caption area |
| Animation patterns | Pass: no CSS transitions or timers; every frame is a pure function of time |
| First frame sells the Short | Pass: Peek, wide-eyed, pointing at a bathroom door that leaks green gas. No fade, no logo |
| Expression mistakes found on stills | Fixed: brow tilt was inverted (worry drawn as anger); Peek's alarm shout read as a laugh; his "stop" hands read as covering his ears |

## Decision log

- Tool: own code-drawn SVG engine captured frame by frame with Playwright, not Remotion. Reason: the channel's Peek
  rig is plain SVG-string JavaScript and drops in unchanged; every frame is a pure function of time, so four
  browser pages draw the film in parallel in about two minutes, which made three full passes cheap.
- Peek: the owner asked, during the work, that the character not be changed. The rig is used as it is; only his
  acting (which emote, where the hands are, when he blinks) is new, in `peekact.js`.
- Voice factory: this session could not attach the Vertex voice repository, and the manager's reply (do not use this
  repository's API-key factory; send the requests to the manager instead) reached this session only after the film
  was finished. The first delivered file therefore uses takes from `gemini-tts`'s own factory (same model family and
  voice). The same four requests are being recorded on Vertex and the film will be re-cut to those takes; picture and
  sound re-time themselves from `voice/timeline.json`.
