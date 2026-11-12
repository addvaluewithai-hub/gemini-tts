#!/bin/bash
# From a finished voice to a finished video, in one go:
#   video/produce.sh <episode dir> <job-id> <out.mp4> [work dir]
#   video/produce.sh episodes/techforbadguys/explain-crypto-05-ar techforbadguys-explain-crypto-05-ar /tmp/work/taqrir-05.mp4
# Waits for the factory's audio and transcript, takes the dead air out (tighten.cjs), places the storyboard's beats on
# the tightened audio (storyboard.cjs cues), renders (clip.cjs) and re-encodes for delivery with the loudness normalised.
# Every request to the CDN carries a fresh version number: a "not found" cached from an early poll is never served back.
set -e
EP=${1%/}; JOB=$2; OUT=$3; WORK=${4:-$(dirname "$OUT")}
ROOT=$(cd "$(dirname "$0")/.." && pwd); NAME=$(basename "$EP"); E="$ROOT/$EP"
CLOUD=${CLOUD_NAME:-as9o12al}; B=https://res.cloudinary.com/$CLOUD
mkdir -p "$WORK" "$(dirname "$OUT")"
get() { # get <raw|video> <file> <extension> <min bytes>
  for i in $(seq 1 150); do
    curl -s -o "$2" "$B/$1/upload/v$(date +%s)$i/gemini-tts/$JOB.$3" || true
    [ -f "$2" ] && [ "$(stat -c %s "$2")" -gt "$4" ] && return 0
    sleep 20
  done
  echo "voice not ready: $3"; return 1
}
get raw "$WORK/$NAME.transcript.json" transcript.json 5000
get video "$WORK/$NAME.wav" wav 1000000
cd "$ROOT/video"
node tighten.cjs "$WORK/$NAME.wav" "$WORK/$NAME.transcript.json" "$WORK/$NAME.tight.wav" "$WORK/$NAME.tight.json" --max 0.32 --keep 0.22
cp "$WORK/$NAME.tight.json" "$E/transcript.json"
node storyboard.cjs cues "$E/storyboard.json" "$WORK/$NAME.tight.json" "cues/$NAME.json"
while pgrep -f "node clip.cjs" >/dev/null; do sleep 10; done      # one render at a time
NODE_PATH=${NODE_PATH:-/opt/node-tools/node_modules} node clip.cjs "cues/$NAME.json" "$WORK/$NAME.tight.wav" "$WORK/$NAME.render.mp4" --workers ${WORKERS:-5} > "$WORK/$NAME.render.log" 2>&1
tail -1 "$WORK/$NAME.render.log"
ffmpeg -y -loglevel error -i "$WORK/$NAME.render.mp4" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -af "loudnorm=I=-16:TP=-2:LRA=11,aresample=48000" -c:a aac -b:a 192k -movflags +faststart "$OUT"
ls -la "$OUT"; echo "DONE $NAME"
