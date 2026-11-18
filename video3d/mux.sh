#!/usr/bin/env bash
# Join a rendered cold open with its sound and a title card on black.
#   ./mux.sh picture.mp4 sound.wav out.mp4 "FIELD REPORT #1" "GRAVITY" [title_seconds]
set -euo pipefail
pic="$1"; snd="$2"; out="$3"; t1="$4"; t2="$5"; tdur="${6:-1.2}"
read -r W H < <(ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0 "$pic" | tr ',' ' ')
fs1=$((W * 7 / 100)); fs2=$((W * 13 / 100))
tmp=$(mktemp -d)
ffmpeg -loglevel error -y -f lavfi -i "color=c=black:s=${W}x${H}:r=30:d=${tdur}" \
  -vf "drawtext=font='Inter Black':text='${t1}':fontsize=${fs1}:fontcolor=0xffe66d:x=(w-tw)/2:y=h*0.42:alpha='min(1,t/0.15)',drawtext=font='Inter Black':text='${t2}':fontsize=${fs2}:fontcolor=white:x=(w-tw)/2:y=h*0.42+${fs1}*1.5:alpha='min(1,max(0,(t-0.12)/0.15))'" \
  -c:v libx264 -pix_fmt yuv420p "$tmp/title.mp4"
ffmpeg -loglevel error -y -i "$pic" -i "$tmp/title.mp4" -i "$snd" \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" -map "[v]" -map 2:a -c:v libx264 -crf 17 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart "$out"
rm -rf "$tmp"
echo "$out"
