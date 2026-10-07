# Gemini TTS Factory

An asynchronous Gemini speech factory that delivers generated audio **plus word-timestamp transcripts**, with GitHub Actions orchestration, model/key routing, and Cloudinary delivery.

The public README stays intentionally short. **Start here: [`docs/API.md`](docs/API.md)** — it contains the full request schema, transcript/timestamp contract, supported parameters, model routing, GitHub dispatch examples, Cloudinary setup, response format, limits, and troubleshooting.

> Important: multiple Gemini API keys only provide independent quota when the underlying Google projects/quotas are independent. Keys from the same project normally share that project's quota.
