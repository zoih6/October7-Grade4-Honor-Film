#!/bin/bash
# جزء واحد: رندر نهائي (1080×1920 · 30fps · sub=2) → دمج صوت المعاينة → رفع إلى GitHub
# usage: tools/part.sh 0 40 p01_f0-40
set -u
F=$1; T=$2; N=$3
REPO=/home/user/october7-grade4-honor-film
TOK=$(cat /home/user/.cache/gh/tok)
export PLAYWRIGHT_BROWSERS_PATH=/home/user/.cache/pw
mkdir -p /home/user/.cache/out "$REPO/preview/parts"
cd "$REPO/film"
echo "── [$N] رندر $F → $T عند $(date +%H:%M:%S) ──"
PAGE=index.html node ../tools/render.mjs --from "$F" --to "$T" --out "/home/user/.cache/out/$N.silent.mp4" 2>&1 | tail -3
rm -f "$REPO/preview/parts/$N.mp4"
ffmpeg -v error -y -ss "$F" -i "/home/user/.cache/out/$N.silent.mp4" -ss "$F" -i /home/user/.cache/audio/bed.m4a \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -movflags +faststart -shortest "$REPO/preview/parts/$N.mp4"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$REPO/preview/parts/$N.mp4")
echo "── [$N] جاهز $DUR ثانية · $(du -h "$REPO/preview/parts/$N.mp4" | cut -f1) ──"
cd "$REPO"
git add -A >/dev/null 2>&1
git -c user.name="October7 Studio" -c user.email="studio@local" commit -qm "جزء $N ($F–$T ث) — رندر نهائي 1080×1920" >/dev/null 2>&1
git push -q "https://x-access-token:$TOK@github.com/zoih6/October7-Grade4-Honor-Film.git" HEAD:main 2>&1 | tail -1
echo "── [$N] مرفوع إلى GitHub ✓ ──"
echo "PART_$N_DONE"
