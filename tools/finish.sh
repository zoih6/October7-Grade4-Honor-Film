#!/bin/bash
# سلسلة الإنهاء: إعادة الأجزاء الفاشلة → المزج الصوتي → ضم → تشفير → رفع
set -uo pipefail
REPO=/home/user/october7-grade4-honor-film
export PATH="$HOME/.local/bin:$PATH"
cd "$REPO"
while pgrep -f run_all_parts.sh >/dev/null; do sleep 20; done
echo "── الرندر انتهى $(date +%H:%M:%S) · بدء الإعادة ──"
for spec in "50 60 p06_f050-060" "70 80 p08_f070-080"; do set -- $spec; ./tools/part.sh "$1" "$2" "$3"; done
echo "── المزج الصوتي (منفردًا لتجنّب نفاد الذاكرة) ──"
cd "$REPO/film"
uv run sound-layer/scripts/mix.py audio/cues.json --out /home/user/.cache/mixa 2>&1 | tail -6
echo "MIX_EXIT=$?"
echo "── ضم الأجزاء + التشفير + الرفع ──"
cd "$REPO"; ./tools/assemble.sh
echo FINISH_DONE
