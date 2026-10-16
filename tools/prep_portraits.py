#!/usr/bin/env python3
"""قصّ ذكي للصور: يحدّد مركز الطالب أفقيًا ثم يُنتج صورة بنسبة 3:4 موحّدة (900×1200)."""
import os, sys
from PIL import Image, ImageFilter, ImageStat
SRC = 'assets/real/portraits'; DST = 'assets/real/portraits_p'
os.makedirs(DST, exist_ok=True)
files = sorted(f for f in os.listdir(SRC) if f.endswith('.webp'))
for f in files:
    im = Image.open(os.path.join(SRC, f)).convert('RGB')
    W, H = im.size
    # ابحث عن مركز الشخص: طاقة الحواف في النطاق الرأسي 0.15–0.85
    band = im.crop((0, int(H*.12), W, int(H*.88))).resize((W//8, max(1,(int(H*.76))//8))).filter(ImageFilter.FIND_EDGES)
    st = ImageStat.Stat(band)
    px = band.load(); w2, h2 = band.size
    cols = [0]*w2
    for y in range(h2):
        for x in range(w2):
            cols[x] += sum(px[x, y])
    tot = sum(cols) or 1
    cx = sum(i*c for i, c in enumerate(cols)) / tot * 8
    # نافذة 3:4 بارتفاع 88% من الصورة
    ch = int(H * .88); cw = int(ch * .75)
    if cw > W: cw = W; ch = int(cw / .75)
    x0 = int(min(max(0, cx - cw/2), W - cw)); y0 = int(min(max(0, H*.045), H - ch))
    out = im.crop((x0, y0, x0+cw, y0+ch)).resize((900, 1200), Image.LANCZOS)
    name = os.path.splitext(f)[0] + '.jpg'
    out.save(os.path.join(DST, name), 'JPEG', quality=90, optimize=True)
    print(f'{f} -> {name}  src={W}x{H} cx={cx:.0f} crop={cw}x{ch}@{x0},{y0}')
