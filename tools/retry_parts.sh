#!/bin/bash
# يعيد رندر الأجزاء التي فشلت بعد انتهاء القائد الرئيسي
set -uo pipefail
cd /home/user/october7-grade4-honor-film
while pgrep -f run_all_parts.sh >/dev/null; do sleep 30; done
echo "── إعادة المحاولة بدأت $(date +%H:%M:%S) ──"
for spec in "50 60 p06_f050-060" "70 80 p08_f070-080"; do
  set -- $spec
  ./tools/part.sh "$1" "$2" "$3"
done
echo "RETRY_DONE"
