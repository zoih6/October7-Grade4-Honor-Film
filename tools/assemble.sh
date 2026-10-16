#!/bin/bash
# التجميع النهائي: ضم الأجزاء → صوت رئيسي → تشفير → رفع
set -uo pipefail
REPO=/home/user/october7-grade4-honor-film
TOK=$(cat /home/user/.cache/gh/tok); REL=$(cat /home/user/.cache/rel_id)
P=/home/user/.cache/out/parts
mkdir -p /home/user/.cache/final
ls -1 $P/p*silent.mp4 | sort > /home/user/.cache/final/list.txt
echo "أجزاء: $(wc -l < /home/user/.cache/final/list.txt)"
: > /home/user/.cache/final/concat.txt
while read -r f; do echo "file '$f'" >> /home/user/.cache/final/concat.txt; done < /home/user/.cache/final/list.txt
ffmpeg -v error -y -f concat -safe 0 -i /home/user/.cache/final/concat.txt -c copy /home/user/.cache/final/silent_all.mp4 || exit 1
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 /home/user/.cache/final/silent_all.mp4)
echo "مدة الفيلم الكامل: $D"
# الصوت: المزيج الرئيسي إن وُجد، وإلا مزيج ffmpeg
MIX=/home/user/.cache/mixa/mix.wav
[ -f "$MIX" ] || MIX=/home/user/.cache/audio/bed.m4a
echo "الصوت المستخدم: $MIX"
ffmpeg -v error -y -i /home/user/.cache/final/silent_all.mp4 -i "$MIX" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest /home/user/.cache/final/final_muxed.mp4 || exit 1
bash tools/encode_release.sh /home/user/.cache/final/final_muxed.mp4 /home/user/.cache/final/October7-Grade4-Honor-Film.mp4 2>&1 | tail -2 || cp /home/user/.cache/final/final_muxed.mp4 /home/user/.cache/final/October7-Grade4-Honor-Film.mp4
F=/home/user/.cache/final/October7-Grade4-Honor-Film.mp4
echo "الحجم النهائي: $(du -h $F | cut -f1) · المدة: $(ffprobe -v error -show_entries format=duration -of csv=p=0 $F)"
curl -s -o /dev/null -w "الرفع → %{http_code}\n" -X POST -H "Authorization: Bearer $TOK" -H "Content-Type: video/mp4" \
  --data-binary "@$F" "https://uploads.github.com/repos/zoih6/October7-Grade4-Honor-Film/releases/$REL/assets?name=October7-Grade4-Honor-Film-1080x1920.mp4"
cp "$F" "$REPO/october7-grade4-honor-film-full.mp4" 2>/dev/null || true
echo ASSEMBLE_DONE
