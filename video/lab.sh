#!/bin/bash
# A standalone Short of the shorts lab, from its recording to a finished 1080 x 1920 file:
#   video/lab.sh <episode dir> <voice.wav> <transcript.json> <out.mp4> [work dir] [extra cue JSON]
# The episode dir holds storyboard.json (one beat per line; the last beat shows the sign-off card). Tightens the voice,
# places the beats, stores each board's shot lengths (sets/beats.cjs --write), renders in portrait with clip.cjs and
# encodes at about -15 LUFS. The cue file gets the portrait settings plus "extra" (e.g. '{"portraitSets":false,"boardZoom":0.95}').
set -e
EP=${1%/}; WAV=$2; TR=$3; OUT=$4; WORK=${5:-$(dirname "$OUT")}; EXTRA=${6:-'{}'}
ROOT=$(cd "$(dirname "$0")/.." && pwd); NAME=$(basename "$EP"); E="$ROOT/$EP"
mkdir -p "$WORK"; cd "$ROOT/video"
node tighten.cjs "$WAV" "$TR" "$WORK/$NAME.tight.wav" "$WORK/$NAME.tight.json" --max ${TMAX:-0.32} --keep ${TKEEP:-0.22}
cp "$WORK/$NAME.tight.json" "$E/transcript.json"
node storyboard.cjs cues "$E/storyboard.json" "$E/transcript.json" "cues/$NAME.json"
for b in $(python3 -c "import json,sys; print(' '.join(k for k,v in json.load(open(sys.argv[1]))['boards'].items() if v.get('kind')!='shortend'))" "$E/storyboard.json"); do
  node sets/beats.cjs "$E/storyboard.json" "cues/$NAME.json" "$b" --write > /dev/null; done
node storyboard.cjs cues "$E/storyboard.json" "$E/transcript.json" "cues/$NAME.json"
python3 - "cues/$NAME.json" "cues/$NAME.v.json" "$EXTRA" <<'PY'
import json, sys
c = json.load(open(sys.argv[1])); c.update(size=[1080, 1920], vertical=True, portraitSets=True, lead=0, tail=2.4, captions=False); c.update(json.loads(sys.argv[3]))
json.dump(c, open(sys.argv[2], "w"))
PY
NODE_PATH=${NODE_PATH:-/opt/node-tools/node_modules} node clip.cjs "cues/$NAME.v.json" "$WORK/$NAME.tight.wav" "$WORK/$NAME.render.mp4" --workers ${WORKERS:-4} > "$WORK/$NAME.render.log" 2>&1
tail -1 "$WORK/$NAME.render.log"
ffmpeg -y -loglevel error -i "$WORK/$NAME.render.mp4" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 -af "loudnorm=I=-15:TP=-1.5:LRA=11,aresample=48000" -c:a aac -b:a 192k -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
ffmpeg -nostats -i "$OUT" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E "^\s+I:" | head -1
