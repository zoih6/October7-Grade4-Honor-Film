#!/bin/bash
# قائد الرندر: يقطع الفيلم إلى أجزاء 10 ثوانٍ ويرندر كل جزء ويرفعه فورًا
set -uo pipefail
cd /home/user/october7-grade4-honor-film
START=${1:-0}
END=${2:-236}
STEP=${3:-10}
T0=$(date +%s)
i=0
F=$START
while [ "$F" -lt "$END" ]; do
  T=$((F+STEP)); [ "$T" -gt "$END" ] && T=$END
  N=$(printf "p%02d_f%03d-%03d" $((F/STEP+1)) "$F" "$T")
  ./tools/part.sh "$F" "$T" "$N"
  F=$T
done
echo "ALL_PARTS_DONE في $(( ($(date +%s)-T0)/60 )) دقيقة"
