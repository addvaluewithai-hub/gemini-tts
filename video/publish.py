#!/usr/bin/env python3
"""Publish one video file to YouTube and/or TikTok. See video/PUBLISH.md for how to call it.

  video/publish.py <youtube|tiktok|both> <video.mp4> [--privacy draft|private|unlisted|public] [--publish-at <UTC time>]
                   [--title ..] [--description .. | --description-file f] [--tags a,b,c] [--lang ar]
                   [--en-title ..] [--en-description .. | --en-description-file f] [--thumbnail f.jpg]
                   [--captions f.srt] [--playlist <id>] [--caption ..] [--caption-file f] [--cover-ms 1000] [--aigc]
                   [--no-comments] [--no-duet] [--no-stitch] [--short <episode dir> <key>] [--yes-public] [--dry-run]

  video/publish.py tiktok-login-url              # prints the sign-in link (the owner opens it, pastes back the address)
  video/publish.py tiktok-login < address.txt    # trades the pasted address for tokens (mode-600 file)
  video/publish.py tiktok-whoami                 # the signed-in account and the privacy levels it may post with
  video/publish.py tiktok-status <publish_id>    # where an upload is

Privacy: `draft` is a TikTok inbox draft (the owner finishes the post in the app) and a private YouTube upload;
`private` is a SELF_ONLY TikTok post and a private YouTube video; `public` and `--publish-at` need --yes-public,
which a session passes only when the owner said so for these videos. TikTok has no scheduling through the API.

--short <episode> <key> takes title, description, tags, English title/description and thumbnail from
<episode>/youtube/shorts.json, and the TikTok caption from that Short's `tiktok.caption` (there is no fallback:
a YouTube description talks about subscribing and the bell). The results are written back under the Short's
`video` (YouTube) and `tiktok` keys. Without --short each run's result is printed as one JSON line.

TikTok access: client key and secret from TIKTOK_EARTHREPORT_ID / TIKTOK_EARTHREPORT_SECRET, tokens in
TIKTOK_TOKEN_FILE (default ~/.config/tiktok-publish/token.json, mode 600). YouTube access as in youtube_upload.py.
No secret or token is ever printed.
"""
import argparse, json, math, os, secrets, sys, tempfile, time, urllib.error, urllib.parse, urllib.request, uuid

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

TT = "https://open.tiktokapis.com"
TT_REDIRECT = "https://channel-earth-report.pages.dev/tiktok/"
TT_SCOPES = "user.info.basic,video.upload,video.publish"
TT_DIR = os.path.expanduser("~/.config/tiktok-publish")
TT_TOKEN = os.path.expanduser(os.environ.get("TIKTOK_TOKEN_FILE", os.path.join(TT_DIR, "token.json")))
TT_STATE = os.path.join(TT_DIR, "state")
MB = 1024 * 1024


def _write600(path, text):
    os.makedirs(os.path.dirname(path), mode=0o700, exist_ok=True)
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f: f.write(text)


# ---------------------------------------------------------------- TikTok

def _tt_keys():
    k, s = os.environ.get("TIKTOK_EARTHREPORT_ID"), os.environ.get("TIKTOK_EARTHREPORT_SECRET")
    if not k or not s: sys.exit("TIKTOK_EARTHREPORT_ID / TIKTOK_EARTHREPORT_SECRET are not set in this session")
    return k.strip(), s.strip()


def _http(method, url, body=None, headers=None):
    """(status, headers, parsed JSON or raw text). Never raises on HTTP errors."""
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    try:
        r = urllib.request.urlopen(req, timeout=300); status, h, raw = r.status, r.headers, r.read()
    except urllib.error.HTTPError as e:
        status, h, raw = e.code, e.headers, e.read()
    try: data = json.loads(raw or b"{}")
    except ValueError: data = raw.decode("utf-8", "replace")
    return status, h, data


def _tt_token_request(fields):
    k, s = _tt_keys()
    st, _, j = _http("POST", TT + "/v2/oauth/token/", urllib.parse.urlencode({"client_key": k, "client_secret": s, **fields}).encode(),
                     {"Content-Type": "application/x-www-form-urlencoded"})
    if not isinstance(j, dict) or "access_token" not in j:
        e = j if isinstance(j, dict) else {"raw": str(j)[:300]}
        sys.exit(f"TikTok refused the token request ({st}): {e.get('error')}: {e.get('error_description')} log_id={e.get('log_id')}")
    j["obtained_at"] = int(time.time())
    _write600(TT_TOKEN, json.dumps(j))                          # refresh tokens rotate: always keep the newest
    return j


def tt_access_token():
    if not os.path.exists(TT_TOKEN): sys.exit("not signed in to TikTok: run `video/publish.py tiktok-login-url`")
    t = json.load(open(TT_TOKEN))
    if time.time() > t["obtained_at"] + int(t.get("expires_in", 0)) - 300:
        t = _tt_token_request({"grant_type": "refresh_token", "refresh_token": t["refresh_token"]})
    return t["access_token"]


def tt_api(path, body):
    st, _, j = _http("POST", TT + path, json.dumps(body).encode(), {"Authorization": "Bearer " + tt_access_token(), "Content-Type": "application/json; charset=UTF-8"})
    err = (j.get("error") or {}) if isinstance(j, dict) else {}
    if st >= 300 or err.get("code") not in (None, "ok"):
        sys.exit(f"TikTok refused {path} ({st}): {err.get('code')}: {err.get('message')} log_id={err.get('log_id')}")
    return j.get("data", {})


def tiktok_login_url():
    k, _ = _tt_keys(); st = secrets.token_urlsafe(16); _write600(TT_STATE, st)
    print("https://www.tiktok.com/v2/auth/authorize/?" + urllib.parse.urlencode(
        {"client_key": k, "scope": TT_SCOPES, "response_type": "code", "redirect_uri": TT_REDIRECT, "state": st}))


def tiktok_login():
    addr = sys.stdin.read().strip(); q = urllib.parse.parse_qs(urllib.parse.urlparse(addr).query)
    if "error" in q: sys.exit(f"TikTok sign-in failed: {q['error'][0]}: {q.get('error_description', [''])[0]}")
    if os.path.exists(TT_STATE) and q.get("state", [None])[0] != open(TT_STATE).read().strip():
        sys.exit("the address's state does not match the last sign-in link; make a new link")
    j = _tt_token_request({"grant_type": "authorization_code", "code": q["code"][0], "redirect_uri": TT_REDIRECT})
    print(f"signed in; scopes: {j.get('scope')}; token saved to {TT_TOKEN}")


def tiktok_whoami():
    d = tt_api("/v2/post/publish/creator_info/query/", {})
    print(json.dumps({k: d.get(k) for k in ("creator_username", "creator_nickname", "privacy_level_options", "max_video_post_duration_sec",
                                            "comment_disabled", "duet_disabled", "stitch_disabled")}, ensure_ascii=False))
    return d


def tiktok_status(pid, wait=True):
    for _ in range(60):
        d = tt_api("/v2/post/publish/status/fetch/", {"publish_id": pid})
        if not wait or d.get("status") not in ("PROCESSING_UPLOAD", "PROCESSING_DOWNLOAD"): return d
        time.sleep(5)
    return d


def tiktok_upload(video, mode, caption, cover_ms=None, aigc=False, no_comments=False, no_duet=False, no_stitch=False, public=False):
    """mode 'draft' -> the owner's TikTok inbox; 'direct' -> a post (SELF_ONLY unless public)."""
    size = os.path.getsize(video)
    if size <= 64 * MB: chunk, count = size, 1                 # one piece (TikTok: whole file under 5 MB, chunks of 5-64 MB)
    else: chunk = 10 * MB; count = size // chunk               # the last chunk takes the remainder
    source = {"source": "FILE_UPLOAD", "video_size": size, "chunk_size": chunk, "total_chunk_count": count}
    if mode == "draft":
        d = tt_api("/v2/post/publish/inbox/video/init/", {"source_info": source})
    else:
        info = tt_api("/v2/post/publish/creator_info/query/", {})
        level = "PUBLIC_TO_EVERYONE" if public else "SELF_ONLY"
        if level not in info.get("privacy_level_options", []):
            sys.exit(f"TikTok does not offer {level} to this account; it offers {info.get('privacy_level_options')}")
        post = {"title": caption or "", "privacy_level": level, "disable_comment": no_comments or info.get("comment_disabled", False),
                "disable_duet": no_duet or info.get("duet_disabled", False), "disable_stitch": no_stitch or info.get("stitch_disabled", False),
                "brand_content_toggle": False, "brand_organic_toggle": False}
        if cover_ms is not None: post["video_cover_timestamp_ms"] = int(cover_ms)
        if aigc: post["is_aigc"] = True
        d = tt_api("/v2/post/publish/video/init/", {"post_info": post, "source_info": source})
    pid, url = d["publish_id"], d["upload_url"]
    with open(video, "rb") as f:
        for i in range(count):
            start = i * chunk; end = size - 1 if i == count - 1 else start + chunk - 1
            f.seek(start); part = f.read(end - start + 1)
            st, _, j = _http("PUT", url, part, {"Content-Type": "video/mp4", "Content-Length": str(len(part)), "Content-Range": f"bytes {start}-{end}/{size}"})
            if st not in (200, 201, 206): sys.exit(f"TikTok refused chunk {i + 1}/{count} ({st}): {j}")
    s = tiktok_status(pid)
    out = {"publish_id": pid, "mode": mode, "privacy": "draft" if mode == "draft" else ("public" if public else "SELF_ONLY"),
           "status": s.get("status"), "uploaded": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    if s.get("fail_reason"): out["fail_reason"] = s["fail_reason"]
    if s.get("publicaly_available_post_id"): out["post_ids"] = s["publicaly_available_post_id"]
    return out


# ---------------------------------------------------------------- YouTube

def youtube_upload(video, title, description, tags, lang, privacy, publish_at, en=None, thumbnail=None, captions=None, playlist=None):
    import youtube_upload as Y
    assert len(title) <= 100, f"title is {len(title)} characters; YouTube's limit is 100"
    assert len(description.encode("utf-8")) <= 5000, "description is over 5000 bytes"
    status = {"privacyStatus": "private" if publish_at else privacy, "selfDeclaredMadeForKids": False, "embeddable": True, "license": "youtube"}
    if publish_at: status["publishAt"] = publish_at
    meta = {"snippet": {"title": title, "description": description, "tags": tags, "categoryId": "27", "defaultLanguage": lang, "defaultAudioLanguage": lang}, "status": status}
    if en: meta["localizations"] = {"en": en}
    size = os.path.getsize(video)
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8") as t:
        json.dump(meta, t, ensure_ascii=False); t.flush()
        _, h = Y.curl(["-X", "POST", f"{Y.API}/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status" + (",localizations" if en else ""),
                       "-H", "Content-Type: application/json; charset=UTF-8", "-H", "X-Upload-Content-Type: video/mp4", "-H", f"X-Upload-Content-Length: {size}",
                       "--data-binary", "@" + t.name], want_headers=True)
    v = json.loads(Y.curl(["-X", "PUT", h["location"], "-H", "Content-Type: video/mp4", "-T", video]))
    vid = v["id"]; out = {"id": vid, "url": f"https://youtu.be/{vid}", "privacy": v["status"]["privacyStatus"], "publishAt": v["status"].get("publishAt")}
    if thumbnail:
        try:
            Y.curl(["-X", "POST", f"{Y.API}/upload/youtube/v3/thumbnails/set?videoId={vid}&uploadType=media", "-H", "Content-Type: image/jpeg", "--data-binary", "@" + thumbnail])
            out["thumbnail"] = os.path.basename(thumbnail)
        except SystemExit as e: out["thumbnail_error"] = str(e)
    if captions:
        b = "x" + uuid.uuid4().hex
        body = (f"--{b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + json.dumps({"snippet": {"videoId": vid, "language": lang, "name": "", "isDraft": False}})
                + f"\r\n--{b}\r\nContent-Type: application/octet-stream\r\n\r\n").encode() + open(captions, "rb").read() + f"\r\n--{b}--\r\n".encode()
        with tempfile.NamedTemporaryFile("wb", suffix=".bin") as f:
            f.write(body); f.flush()
            try:
                Y.curl(["-X", "POST", f"{Y.API}/upload/youtube/v3/captions?uploadType=multipart&part=snippet", "-H", f"Content-Type: multipart/related; boundary={b}", "--data-binary", "@" + f.name])
                out["captions"] = lang
            except SystemExit as e: out["captions_error"] = str(e)
    if playlist:
        try:
            Y.curl(["-X", "POST", f"{Y.API}/youtube/v3/playlistItems?part=snippet", "-H", "Content-Type: application/json",
                    "-d", json.dumps({"snippet": {"playlistId": playlist, "resourceId": {"kind": "youtube#video", "videoId": vid}}})])
            out["playlist"] = playlist
        except SystemExit as e: out["playlist_error"] = str(e)
    return out


# ---------------------------------------------------------------- main

def _read(text, path):
    return open(path, encoding="utf-8").read().strip() if path else text


def main():
    cmd = sys.argv[1:2]
    if cmd == ["tiktok-login-url"]: return tiktok_login_url()
    if cmd == ["tiktok-login"]: return tiktok_login()
    if cmd == ["tiktok-whoami"]: return tiktok_whoami()
    if cmd == ["tiktok-status"]: return print(json.dumps(tiktok_status(sys.argv[2], wait=False), ensure_ascii=False))
    ap = argparse.ArgumentParser(prog="publish.py", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("target", choices=["youtube", "tiktok", "both"]); ap.add_argument("video")
    ap.add_argument("--privacy", default="private", choices=["draft", "private", "unlisted", "public"]); ap.add_argument("--publish-at")
    ap.add_argument("--title"); ap.add_argument("--description"); ap.add_argument("--description-file"); ap.add_argument("--tags", default="")
    ap.add_argument("--lang", default="ar"); ap.add_argument("--en-title"); ap.add_argument("--en-description"); ap.add_argument("--en-description-file")
    ap.add_argument("--thumbnail"); ap.add_argument("--captions"); ap.add_argument("--playlist")
    ap.add_argument("--caption", help="TikTok caption"); ap.add_argument("--caption-file"); ap.add_argument("--cover-ms", type=int)
    ap.add_argument("--aigc", action="store_true"); ap.add_argument("--no-comments", action="store_true"); ap.add_argument("--no-duet", action="store_true"); ap.add_argument("--no-stitch", action="store_true")
    ap.add_argument("--short", nargs=2, metavar=("EPISODE", "KEY")); ap.add_argument("--yes-public", action="store_true"); ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if not os.path.exists(a.video): sys.exit(f"no such file: {a.video}")
    goes_public = a.privacy in ("public", "unlisted") or a.publish_at
    if goes_public and not a.yes_public: sys.exit("public, unlisted or scheduled needs --yes-public (only with the owner's word for these videos)")
    if a.publish_at and a.target != "youtube": sys.exit("TikTok cannot be scheduled through the API; use --publish-at with target youtube only")

    title, desc, tags = a.title, _read(a.description, a.description_file), [t.strip() for t in a.tags.split(",") if t.strip()]
    en_title, en_desc, thumb, caption = a.en_title, _read(a.en_description, a.en_description_file), a.thumbnail, _read(a.caption, a.caption_file)
    sh = None
    if a.short:
        ep, key = a.short; sf = os.path.join(ep.rstrip("/"), "youtube", "shorts.json"); data = json.load(open(sf, encoding="utf-8"))
        sh = next((x for x in data["shorts"] if x["key"] == key), None) or sys.exit(f"no Short called {key}")
        full = data.get("full", "")
        title = title or sh["title"]; desc = desc or sh["description"].replace("{full}", full); tags = tags or sh.get("tags", [])
        if sh.get("en"): en_title = en_title or sh["en"]["title"]; en_desc = en_desc or sh["en"]["description"].replace("{full}", full)
        cand = os.path.join(ep, "youtube", "shorts", f"thumb-{key}.jpg"); thumb = thumb or (cand if os.path.exists(cand) else None)
        caption = caption or ((sh.get("tiktok") or {}).get("caption") or "").replace("{full}", full) or None
    if a.target in ("tiktok", "both") and caption is None:
        sys.exit("no TikTok caption: pass --caption/--caption-file, or put `tiktok.caption` on the Short")
    if a.target in ("youtube", "both") and not (title and desc is not None): sys.exit("YouTube needs --title and --description")
    if caption and len(caption.encode("utf-16-le")) // 2 > 2200: sys.exit("TikTok caption is over 2200 characters")

    en = {"title": en_title, "description": en_desc or ""} if en_title else None
    plan = {"target": a.target, "video": a.video, "privacy": a.privacy, "publish_at": a.publish_at, "title": title, "tags": tags,
            "en_title": en_title, "thumbnail": thumb, "caption": caption}
    if a.dry_run: return print(json.dumps(plan, ensure_ascii=False, indent=1))
    result = {}
    if a.target in ("youtube", "both"):
        yp = "private" if a.privacy == "draft" else a.privacy
        result["youtube"] = youtube_upload(a.video, title, desc or "", tags, a.lang, yp, a.publish_at, en, thumb, a.captions, a.playlist)
        print("youtube:", json.dumps(result["youtube"], ensure_ascii=False))
    if a.target in ("tiktok", "both"):
        mode = "draft" if a.privacy == "draft" else "direct"
        result["tiktok"] = tiktok_upload(a.video, mode, caption, a.cover_ms, a.aigc, a.no_comments, a.no_duet, a.no_stitch, public=a.privacy == "public")
        print("tiktok:", json.dumps(result["tiktok"], ensure_ascii=False))
    if sh is not None:
        if "youtube" in result:
            y = result["youtube"]; sh["video"] = {"id": y["id"], "url": f"https://youtube.com/shorts/{y['id']}", "privacy": y["privacy"], "publishAt": y["publishAt"]}
        if "tiktok" in result:
            t = sh.setdefault("tiktok", {})
            if t.get("upload"): t.setdefault("previous", []).append(t["upload"])
            t["upload"] = result["tiktok"]
        with open(sf, "w", encoding="utf-8") as h: json.dump(data, h, ensure_ascii=False, indent=1); h.write("\n")


if __name__ == "__main__":
    main()
