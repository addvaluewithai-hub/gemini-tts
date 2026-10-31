#!/usr/bin/env bash
# usage: build.sh card.png audio.wav captions.vtt out.mp4
# Renders a 1920x1080 episode video: static card + live waveform strip + burned-in captions.
set -euo pipefail
CARD="$1"; AUDIO="$2"; VTT="$3"; OUT="$4"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
cp "$VTT" "$WORK/captions.vtt"
cd "$WORK"
ffmpeg -y -loglevel error -stats \
  -loop 1 -framerate 30 -i "$CARD" \
  -i "$AUDIO" \
  -filter_complex "\
[1:a]aformat=channel_layouts=mono,showwaves=s=1728x80:mode=cline:rate=30:colors=0xff4d5a:scale=sqrt:draw=full,format=rgba[wave];\
[0:v][wave]overlay=96:760:shortest=1,format=yuv420p[base];\
[base]subtitles=captions.vtt:force_style='FontName=Inter,FontSize=12,PrimaryColour=&H00F0F0F4,BackColour=&H99000000,BorderStyle=4,Outline=0,Shadow=0,MarginV=26,MarginL=24,MarginR=24,Alignment=2'[v]" \
  -map "[v]" -map 1:a \
  -c:v libx264 -preset medium -crf 20 -tune stillimage -r 30 \
  -c:a aac -b:a 160k -movflags +faststart -shortest "$OUT" 2>&1 | tr '\r' '\n' | tail -1
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of compact "$OUT"
