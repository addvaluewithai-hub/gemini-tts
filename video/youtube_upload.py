#!/usr/bin/env python3
"""Upload a finished episode to YouTube with everything in its kit.

  video/youtube_upload.py <episode dir> <video.mp4> [--privacy private|unlisted|public]
                          [--publish-at 2026-11-20T15:00:00Z] [--playlist <id>] [--thumb a|b] [--dry-run]

Takes the title (the first of `youtube.titles`), tags and language from the episode's storyboard.json, the
description from youtube/description.txt, the thumbnail and the captions from the same folder. Writes the
video's id and link to youtube/uploaded.json. Nothing is public unless --privacy public or --publish-at says so.

The access token is never read by this script when it runs behind a proxy that adds the Authorization
header for www.googleapis.com; otherwise set YT_ACCESS_TOKEN. Scopes needed: youtube.upload and
youtube.force-ssl. All HTTP goes through curl, so the machine's proxy and certificate settings apply.
"""
import argparse, json, os, subprocess, sys, tempfile, uuid

API = "https://www.googleapis.com"
AUTH = "Authorization: Bearer " + os.environ.get("YT_ACCESS_TOKEN", "added-by-proxy")


def curl(args, want_headers=False):
    with tempfile.NamedTemporaryFile("r", suffix=".hdr") as hdr:
        r = subprocess.run(["curl", "-sS", "-D", hdr.name, "-H", AUTH, *args], capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit("curl failed: " + r.stderr.strip())
        head = open(hdr.name).read()
    status = int(head.split()[1]) if head.startswith("HTTP") else 0
    for block in head.split("\r\n\r\n"):                       # the last response's headers win
        if block.strip().startswith("HTTP"):
            status = int(block.split()[1]); last = block
    headers = {k.strip().lower(): v.strip() for k, v in (l.split(":", 1) for l in last.split("\r\n")[1:] if ":" in l)}
    if status >= 300:
        sys.exit(f"YouTube answered {status}: {r.stdout.strip()[:600]}")
    return (r.stdout, headers) if want_headers else r.stdout


def main():
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
    video = json.loads(curl(["-X", "PUT", h["location"], "-H", "Content-Type: video/mp4", "--data-binary", "@" + a.video]))
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
