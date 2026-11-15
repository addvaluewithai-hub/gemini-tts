# Publishing: `video/publish.py`

One command puts a finished video file on YouTube, TikTok or both. Any session can call it, and so can the owner.

```sh
# a Short from an episode's kit: title, description, tags, English title/description, thumbnail and TikTok caption
# all come from <episode>/youtube/shorts.json; the ids go back into the same file (`video`, `tiktok.upload`)
video/publish.py tiktok  short.mp4 --short episodes/<channel>/<episode> <key> --privacy draft
video/publish.py youtube short.mp4 --short episodes/<channel>/<episode> <key> --privacy private

# anything else: say it all on the command line
video/publish.py both clip.mp4 --privacy private \
  --title "..." --description-file desc.txt --tags "a,b,c" --lang ar \
  --en-title "..." --en-description-file desc-en.txt --thumbnail thumb.jpg --captions captions.srt \
  --playlist PLxxxx --caption-file tiktok-caption.txt [--cover-ms 1500] [--aigc] [--dry-run]
```

| `--privacy` | YouTube | TikTok |
| --- | --- | --- |
| `draft` | private | the owner's TikTok inbox: he adds the caption and posts in the app |
| `private` (default) | private | posted as SELF_ONLY (only the account sees it) |
| `unlisted` | unlisted | (refused) |
| `public` | public | PUBLIC_TO_EVERYONE |
| `--publish-at 2026-11-20T16:00:00Z` | private, goes public then | not possible through TikTok's API |

**Safety latch.** `public`, `unlisted` and `--publish-at` stop unless `--yes-public` is given. A session passes it only
when the owner said so in its conversation for those specific videos. `--dry-run` prints what would be sent.

**Captions on TikTok.** A YouTube description is not used on TikTok (it talks about subscribing and the bell). The
caption comes from `--caption`/`--caption-file`, or from the Short's `tiktok.caption` in shorts.json; without one the
command stops. Links in TikTok captions are not clickable: the captions point to the link in the bio.
An inbox draft carries no caption; the owner pastes it in the app.

## Signing in

TikTok (once a year, or when the app's keys change). Needs `TIKTOK_EARTHREPORT_ID` and `TIKTOK_EARTHREPORT_SECRET` in
the environment (the Sandbox keys while the app is in Sandbox; they start with `sb`).

```sh
video/publish.py tiktok-login-url            # give the owner this link; he signs in as @earthreportar
video/publish.py tiktok-login < address.txt  # the whole address he pastes back (channel-earth-report.pages.dev/tiktok/?code=...)
video/publish.py tiktok-whoami               # check: account and allowed privacy levels
video/publish.py tiktok-status <publish_id>  # where an upload is
```

Tokens live in `~/.config/tiktok-publish/token.json` (mode 600; `TIKTOK_TOKEN_FILE` overrides). The access token lasts
a day and is renewed from the refresh token, which rotates; the newest one is always saved. The container is
temporary, so a new session signs in again.

YouTube: as in `youtube_upload.py` (YT_CLIENT_ID / YT_CLIENT_SECRET plus a refresh token from `youtube_upload.py
auth-code`, saved in `~/.config/yt-upload/token.json`).

## TikTok limits (docs read 2026-11-14)

- Until TikTok audits the app (it is in **Sandbox** now), direct posts need the **account itself** set to Private in
  the TikTok app, not only a SELF_ONLY post: otherwise every init is refused with
  `unaudited_client_can_only_post_to_private_accounts` (seen 2026-11-15 on @earthreportar, a public account).
  Inbox drafts work, but open only in the full TikTok mobile app (not the website, not TikTok Lite).
- At most **5 pending inbox drafts in 24 hours** (`spam_risk_too_many_pending_share`).
- 6 init requests a minute per account; there is also a daily API post cap (`spam_risk_too_many_posts`).
- MP4/H.264, 23–60 fps, up to 10 minutes. Files up to 64 MB go in one piece, bigger ones in 10 MB chunks.

TikTok's and Google's refusals are printed as they come (`code: message log_id=...`), and the command stops.
