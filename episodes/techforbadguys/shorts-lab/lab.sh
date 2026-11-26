#!/bin/bash
# Shorts lab (producer D): voice -> video for one standalone Short.
#   bash lab.sh <short dir name, e.g. lab-01-honey> <Vertex job id> <work dir>
# Waits for the voice, tightens it, places the beats, writes each board's shot lengths, renders with short.cjs
# (one part, the sign-off card as the last beat) and prints duration and loudness. Never prints secrets.
set -e
N=$1; JOB=$2; W=$3; ROOT=$(cd "$(dirname "$0")/../../.." && pwd); E=$ROOT/episodes/techforbadguys/shorts-lab/$N; B=https://res.cloudinary.com/${CLOUD_NAME:-lskr7x7h}
mkdir -p $W; cd $ROOT/video
get() { for i in $(seq 1 120); do curl -s -o "$2" "$B/$1/upload/v$(date +%s)$i/gemini-tts/$JOB.$3" || true; [ -f "$2" ] && [ "$(stat -c %s "$2")" -gt "$4" ] && return 0; sleep 20; done; echo "voice not ready: $3"; return 1; }
get raw $W/$N.transcript.json transcript.json 1000
get video $W/$N.wav wav 200000
node tighten.cjs $W/$N.wav $W/$N.transcript.json $W/$N.tight.wav $W/$N.tight.json --max 0.32 --keep 0.22 | tail -1
cp $W/$N.tight.json $E/transcript.json
node storyboard.cjs cues $E/storyboard.json $W/$N.tight.json cues/$N.json | tail -1
for b in $(python3 -c "import json;print(' '.join(k for k in json.load(open('$E/storyboard.json'))['boards'] if k!='signoff'))"); do node sets/beats.cjs $E/storyboard.json cues/$N.json $b --write >/dev/null; done
node storyboard.cjs cues $E/storyboard.json $W/$N.tight.json cues/$N.json >/dev/null
python3 $E/make.py part
WORKERS=${WORKERS:-5} node short.cjs $E $N $W/$N.tight.wav $W/$N-ar.mp4 > $W/$N.render.log 2>&1 || { tail -5 $W/$N.render.log; exit 1; }
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $W/$N-ar.mp4); l=$(ffmpeg -nostats -i $W/$N-ar.mp4 -af ebur128 -f null - 2>&1 | grep "I:" | tail -1)
echo "RENDERED $N $d $l"
