# Gemini TTS Factory

An asynchronous Gemini speech factory that delivers generated audio **plus word-timestamp transcripts**, with GitHub Actions orchestration, model/key routing, and Cloudinary delivery.

- **Humans / implementation details:** read [`docs/API.md`](docs/API.md).
- **Autonomous agents:** read [`docs/AGENT.md`](docs/AGENT.md) first.

Those internal docs cover the full request schema, the 30 curated studio voices, live Extended Voice Library discovery, custom voice IDs, transcript/timestamp behavior, model routing, GitHub dispatch, Cloudinary outputs, limits, and failure handling.

> Important: multiple Gemini API keys only provide independent quota when the underlying Google projects/quotas are independent. Keys from the same project normally share that project's quota.
