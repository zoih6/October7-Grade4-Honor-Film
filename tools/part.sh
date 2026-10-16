#!/bin/bash
# جزء: رندر نهائي (1080×1920 · 30fps) → دمج الصوت → رفع كأصل في GitHub Release → تحديث السجل
# usage: tools/part.sh 0 10 p01
set -uo pipefail
F=$1; T=$2; N=$3
REPO=/home/user/october7-grade4-honor-film
TOK=$(cat /home/user/.cache/gh/tok)
export PLAYWRIGHT_BROWSERS_PATH=/home/user/.cache/pw
mkdir -p /home/user/.cache/out/parts
echo "── [$N] بدء رندر $F → $T · $(date +%H:%M:%S) ──"
cd "$REPO/film"
if ! PAGE=index.html node ../tools/render.mjs --from "$F" --to "$T" --out "/home/user/.cache/out/parts/$N.silent.mp4" > "/home/user/.cache/out/parts/$N.log" 2>&1; then
  echo "!! [$N] فشل الرندر — لن يُرفع. آخر السجل:"; tail -4 "/home/user/.cache/out/parts/$N.log"; exit 1
fi
ffmpeg -v error -y -ss "$F" -i "/home/user/.cache/out/parts/$N.silent.mp4" -ss "$F" -i /home/user/.cache/audio/bed.m4a \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -movflags +faststart -shortest "/home/user/.cache/out/parts/$N.mp4" || { echo "!! [$N] فشل الصوت"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "/home/user/.cache/out/parts/$N.mp4")
SIZE=$(stat -c%s "/home/user/.cache/out/parts/$N.mp4")
echo "── [$N] جاهز: $DUR ث · $((SIZE/1048576))MB ──"
# رفع كأصل في الـRelease (لا يُثقل المستودع)
UP="https://uploads.github.com/repos/zoih6/October7-Grade4-Honor-Film/releases/$(cat /home/user/.cache/rel_id)/assets?name=$N.mp4"
for i in 1 2 3; do
  curl -s -o /home/user/.cache/out/parts/up.json -w "%{http_code}" -X POST \
    -H "Authorization: Bearer $TOK" -H "Content-Type: application/video" \
    --data-binary "@/home/user/.cache/out/parts/$N.mp4" "$UP" > /home/user/.cache/out/parts/code.txt
  CODE=$(cat /home/user/.cache/out/parts/code.txt)
  [ "$CODE" = "201" ] && { echo "── [$N] مرفوع ✓ ($DUR ث) ──"; break; }
  echo "…[$N] محاولة رفع $i أعادت $CODE"; sleep 5
done
[ "$(cat /home/user/.cache/out/parts/code.txt)" = "201" ] || echo "!! [$N] لم يُرفع — الملف محلي في /home/user/.cache/out/parts/$N.mp4"
echo "PART_${N}_DONE"
