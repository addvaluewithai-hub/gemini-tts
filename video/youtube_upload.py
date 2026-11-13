#!/usr/bin/env python3
"""Upload a finished episode to YouTube with everything in its kit.

  video/youtube_upload.py <episode dir> <video.mp4> [--privacy private|unlisted|public]
                          [--publish-at 2026-11-20T15:00:00Z] [--playlist <id>] [--thumb a|b] [--dry-run]

Takes the title (the first of `youtube.titles`), tags and language from the episode's storyboard.json, the
description from youtube/description.txt, the thumbnail and the captions from the same folder. Writes the
video's id and link to youtube/uploaded.json. Nothing is public unless --privacy public or --publish-at says so.

Access: the script mints and renews its own access tokens from a client id, client secret and refresh token,
taken from YT_CLIENT_ID, YT_CLIENT_SECRET and YT_REFRESH_TOKEN, or from the JSON token file named by YT_TOKEN_FILE
(default ~/.config/yt-upload/token.json, mode 600, keys client_id / client_secret / refresh_token). Without any of
those it uses YT_ACCESS_TOKEN, or, behind a proxy that adds the Authorization header itself, nothing.
Scopes needed: youtube.upload and youtube.force-ssl. Secrets never reach a command line: curl reads the
Authorization header and the token request's body from mode-600 temporary files.

One-time setup, with a code from Google's consent page (read from stdin, never from the command line):
  video/youtube_upload.py auth-code --redirect-uri https://developers.google.com/oauthplayground < code.txt
A playlist (prints its id):
  video/youtube_upload.py playlist "<title>" "<description>" [--privacy private]

All HTTP goes through curl, so the machine's proxy and certificate settings apply.
"""
import argparse, json, os, subprocess, sys, tempfile, time, uuid

API = "https://www.googleapis.com"
TOKEN_URL = "https://oauth2.googleapis.com/token"
TOKEN_FILE = os.path.expanduser(os.environ.get("YT_TOKEN_FILE", "~/.config/yt-upload/token.json"))
_token = {"access": os.environ.get("YT_ACCESS_TOKEN"), "expires": float("inf") if os.environ.get("YT_ACCESS_TOKEN") else 0}


def _secret_file(text):
    """A mode-600 temporary file holding `text`; the caller deletes it."""
    fd, path = tempfile.mkstemp(); os.fchmod(fd, 0o600)
    with os.fdopen(fd, "w") as f: f.write(text)
    return path


def _creds():
    c = {}
    if os.path.exists(TOKEN_FILE):
        c = json.load(open(TOKEN_FILE))
    for k, env in (("client_id", "YT_CLIENT_ID"), ("client_secret", "YT_CLIENT_SECRET"), ("refresh_token", "YT_REFRESH_TOKEN")):
        if os.environ.get(env): c[k] = os.environ[env]
    return c


def _token_request(fields):
    """POST form fields to Google's token endpoint; returns the JSON answer. Errors never echo the fields."""
    from urllib.parse import urlencode
    body = _secret_file(urlencode(fields))
    try:
        r = subprocess.run(["curl", "-sS", "-X", "POST", TOKEN_URL, "-H", "Content-Type: application/x-www-form-urlencoded", "--data-binary", "@" + body],
                           capture_output=True, text=True)
    finally:
        os.unlink(body)
    try:
        j = json.loads(r.stdout)
    except ValueError:
        sys.exit("token request failed: " + (r.stderr.strip() or r.stdout[:300]))
    if "error" in j:
        sys.exit(f"Google refused the token request: {j.get('error')}: {j.get('error_description', '')}")
    return j


def access_token(force=False):
    """A valid access token, renewed from the refresh token when it is about to expire; None behind an injecting proxy."""
    c = _creds()
    if not c.get("refresh_token"):
        return _token["access"]
    if force or time.time() > _token["expires"] - 300:
        j = _token_request({"client_id": c["client_id"], "client_secret": c["client_secret"], "refresh_token": c["refresh_token"], "grant_type": "refresh_token"})
        _token.update(access=j["access_token"], expires=time.time() + int(j.get("expires_in", 3600)))
    return _token["access"]


def auth_code(redirect_uri):
    """Exchange a one-time consent code (stdin) for a refresh token, saved to TOKEN_FILE with mode 600."""
    code = sys.stdin.read().strip()
    if "code=" in code:                                         # a whole pasted address works too
        from urllib.parse import urlparse, parse_qs
        code = parse_qs(urlparse(code).query)["code"][0]
    c = _creds()
    j = _token_request({"code": code, "client_id": c["client_id"], "client_secret": c["client_secret"], "redirect_uri": redirect_uri, "grant_type": "authorization_code"})
    if "refresh_token" not in j:
        sys.exit("Google gave no refresh token (was prompt=consent and access_type=offline in the link?)")
    os.makedirs(os.path.dirname(TOKEN_FILE), mode=0o700, exist_ok=True)
    fd = os.open(TOKEN_FILE, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f:
        json.dump({"client_id": c["client_id"], "client_secret": c["client_secret"], "refresh_token": j["refresh_token"]}, f)
    print(f"refresh token saved to {TOKEN_FILE}; scopes: {j.get('scope')}")


def curl(args, want_headers=False, _retry=True):
    tok = access_token()
    auth = _secret_file(f"Authorization: Bearer {tok}\n") if tok else None
    with tempfile.NamedTemporaryFile("r", suffix=".hdr") as hdr:
        try:
            r = subprocess.run(["curl", "-sS", "-D", hdr.name, *(["-H", "@" + auth] if auth else []), *args], capture_output=True, text=True)
        finally:
            if auth: os.unlink(auth)
        if r.returncode != 0:
            sys.exit("curl failed: " + r.stderr.strip())
        head = open(hdr.name).read()
    status = int(head.split()[1]) if head.startswith("HTTP") else 0
    for block in head.split("\r\n\r\n"):                       # the last response's headers win
        if block.strip().startswith("HTTP"):
            status = int(block.split()[1]); last = block
    headers = {k.strip().lower(): v.strip() for k, v in (l.split(":", 1) for l in last.split("\r\n")[1:] if ":" in l)}
    if status == 401 and _retry and _creds().get("refresh_token"):
        access_token(force=True); return curl(args, want_headers, _retry=False)
    if status >= 300:
        sys.exit(f"YouTube answered {status}: {r.stdout.strip()[:600]}")
    return (r.stdout, headers) if want_headers else r.stdout


def make_playlist(argv):
    ap = argparse.ArgumentParser(prog="youtube_upload.py playlist")
    ap.add_argument("title"); ap.add_argument("description"); ap.add_argument("--privacy", default="private", choices=["private", "unlisted", "public"])
    a = ap.parse_args(argv)
    body = {"snippet": {"title": a.title, "description": a.description, "defaultLanguage": "ar"}, "status": {"privacyStatus": a.privacy}}
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8") as f:
        json.dump(body, f, ensure_ascii=False); f.flush()
        p = json.loads(curl(["-X", "POST", f"{API}/youtube/v3/playlists?part=snippet,status", "-H", "Content-Type: application/json; charset=UTF-8", "--data-binary", "@" + f.name]))
    print(json.dumps({"id": p["id"], "url": f"https://www.youtube.com/playlist?list={p['id']}", "title": p["snippet"]["title"], "privacy": p["status"]["privacyStatus"]}, ensure_ascii=False))


def main():
    if sys.argv[1:2] == ["auth-code"]:
        ap = argparse.ArgumentParser(prog="youtube_upload.py auth-code"); ap.add_argument("--redirect-uri", default="https://developers.google.com/oauthplayground")
        return auth_code(ap.parse_args(sys.argv[2:]).redirect_uri)
    if sys.argv[1:2] == ["playlist"]:
        return make_playlist(sys.argv[2:])
    ap = argparse.ArgumentParser()
    ap.add_argument("episode"); ap.add_argument("video")
    ap.add_argument("--privacy", default="private", choices=["private", "unlisted", "public"])
    ap.add_argument("--publish-at"); ap.add_argument("--playlist"); ap.add_argument("--thumb", default="a"); ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    ep = a.episode.rstrip("/"); kit = os.path.join(ep, "youtube")
    sb = json.load(open(os.path.join(ep, "storyboard.json"), encoding="utf-8")); yt = sb["youtube"]
    lang = (sb.get("language") or "ar").split("-")[0]
    title = yt["titles"][0]; description = open(os.path.join(kit, "description.txt"), encoding="utf-8").read().strip()
    tags = yt.get("tags", [])
    assert len(title) <= 100, f"title is {len(title)} characters; the limit is 100"
    assert len(description.encode("utf-8")) <= 5000, "description is over 5000 bytes"
    status = {"privacyStatus": "private" if a.publish_at else a.privacy, "selfDeclaredMadeForKids": False, "embeddable": True, "license": "youtube"}
    if a.publish_at: status["publishAt"] = a.publish_at       # scheduled: stays private until then
    meta = {"snippet": {"title": title, "description": description, "tags": tags, "categoryId": "27", "defaultLanguage": lang, "defaultAudioLanguage": lang}, "status": status}
    size = os.path.getsize(a.video)
    print(f"{os.path.basename(ep)}: \"{title}\" · {size / 1e6:.0f} MB · {status['privacyStatus']}" + (f" until {a.publish_at}" if a.publish_at else ""))
    if a.dry_run:
        print(json.dumps(meta, ensure_ascii=False, indent=1)[:900]); return

    # 1. the video, as a resumable upload
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False); f.flush()
        _, h = curl(["-X", "POST", f"{API}/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", "-H", "Content-Type: application/json; charset=UTF-8",
                     "-H", "X-Upload-Content-Type: video/mp4", "-H", f"X-Upload-Content-Length: {size}", "--data-binary", "@" + f.name], want_headers=True)
    video = json.loads(curl(["-X", "PUT", h["location"], "-H", "Content-Type: video/mp4", "-T", a.video]))
    vid = video["id"]; out = {"id": vid, "url": f"https://youtu.be/{vid}", "title": title, "privacy": video["status"]["privacyStatus"], "publishAt": video["status"].get("publishAt")}
    print("  video", out["url"], out["privacy"])

    # 2. the thumbnail (needs a phone-verified channel)
    thumb = os.path.join(kit, f"thumbnail-{a.thumb}.jpg")
    try:
        curl(["-X", "POST", f"{API}/upload/youtube/v3/thumbnails/set?videoId={vid}&uploadType=media", "-H", "Content-Type: image/jpeg", "--data-binary", "@" + thumb]); out["thumbnail"] = os.path.basename(thumb); print("  thumbnail set")
    except SystemExit as e:
        out["thumbnail_error"] = str(e); print("  thumbnail NOT set:", e)

    # 3. the captions
    srt = os.path.join(kit, "captions.srt")
    if os.path.exists(srt):
        b = "x" + uuid.uuid4().hex
        body = (f"--{b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + json.dumps({"snippet": {"videoId": vid, "language": lang, "name": "", "isDraft": False}})
                + f"\r\n--{b}\r\nContent-Type: application/octet-stream\r\n\r\n").encode() + open(srt, "rb").read() + f"\r\n--{b}--\r\n".encode()
        with tempfile.NamedTemporaryFile("wb", suffix=".bin") as f:
            f.write(body); f.flush()
            try:
                curl(["-X", "POST", f"{API}/upload/youtube/v3/captions?uploadType=multipart&part=snippet", "-H", f"Content-Type: multipart/related; boundary={b}", "--data-binary", "@" + f.name]); out["captions"] = lang; print("  captions added")
            except SystemExit as e:
                out["captions_error"] = str(e); print("  captions NOT added:", e)

    # 4. the playlist
    if a.playlist:
        try:
            curl(["-X", "POST", f"{API}/youtube/v3/playlistItems?part=snippet", "-H", "Content-Type: application/json",
                  "-d", json.dumps({"snippet": {"playlistId": a.playlist, "resourceId": {"kind": "youtube#video", "videoId": vid}}})]); out["playlist"] = a.playlist; print("  added to playlist")
        except SystemExit as e:
            out["playlist_error"] = str(e); print("  NOT added to playlist:", e)
    json.dump(out, open(os.path.join(kit, "uploaded.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
