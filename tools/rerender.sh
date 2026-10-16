#!/bin/bash
set -uo pipefail
REPO=/home/user/october7-grade4-honor-film
export PLAYWRIGHT_BROWSERS_PATH=/home/user/.cache/pw
cd "$REPO/film"
for spec in "$@"; do
  set -- $spec
  F=$1; T=$2; N=$3
  echo "── إعادة رندر $N ($F→$T) $(date +%H:%M:%S) ──"
  PAGE=index.html node ../tools/render.mjs --from "$F" --to "$T" --out "/home/user/.cache/out/parts/$N.silent.mp4" 2>&1 | tail -1
done
echo "── ضم + صوت + تشفير + رفع ──"
: > /home/user/.cache/final/concat.txt
ls -1 /home/user/.cache/out/parts/p*silent.mp4 | sort | while read -r f; do echo "file '$f'" >> /home/user/.cache/final/concat.txt; done
ffmpeg -v error -y -f concat -safe 0 -i /home/user/.cache/final/concat.txt -c copy /home/user/.cache/final/silent_all.mp4
ffmpeg -v error -y -i /home/user/.cache/final/silent_all.mp4 -i /home/user/.cache/mymix/mix_master.m4a -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest /home/user/.cache/final/film_full.mp4
TOK=$(cat /home/user/.cache/gh/tok); REL=$(cat /home/user/.cache/rel_id)
for spec in "$@"; do
  set -- $spec; N=$3
  curl -s -o /dev/null -w "$N → %{http_code}\n" -X POST -H "Authorization: Bearer $TOK" -H "Content-Type: video/mp4" \
   --data-binary "@/home/user/.cache/out/parts/$N.silent.mp4" \
   "https://uploads.github.com/repos/zoih6/October7-Grade4-Honor-Film/releases/$REL/assets?name=$N.mp4"
done
curl -s -o /dev/null -w "FULL → %{http_code}\n" -X POST -H "Authorization: Bearer $TOK" -H "Content-Type: video/mp4" \
 --data-binary "@/home/user/.cache/final/film_full.mp4" \
 "https://uploads.github.com/repos/zoih6/October7-Grade4-Honor-Film/releases/$REL/assets?name=October7-Film-FULL-1080x1920-v2.mp4"
# نسختا المشاركة
ffmpeg -v error -y -i /home/user/.cache/final/film_full.mp4 -vf scale=720:1280 -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart /home/user/.cache/final/mobile720.mp4
cp /home/user/.cache/final/mobile720.mp4 "$REPO/October7-Film-720p.mp4"
echo RERENDER_DONE
