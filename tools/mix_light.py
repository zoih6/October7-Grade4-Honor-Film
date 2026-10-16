#!/usr/bin/env python3
"""مزج خفيف الذاكرة يحاكي منهج opus-sound-layer: صوت + سرير موسيقي + مؤثرات موضوعة على أحداثها.
   يكتب music_ducked.wav و sfx.wav ثم يتولّى ffmpeg المزج والمصير (-14 LUFS, TP -1.5)."""
import json, os, sys, zlib
import numpy as np, soundfile as sf

SR = 48000
CUES = json.load(open('audio/cues.json'))
DUR = float(CUES.get('duration_s', 236.0))
KIT = CUES.get('kit', '/home/user/.cache/slfx/kit')
OUT = sys.argv[1] if len(sys.argv) > 1 else '/home/user/.cache/mymix'
os.makedirs(OUT, exist_ok=True)
N = int(DUR * SR)
catalog = json.load(open(os.path.join(KIT, 'catalog.json')))
count = {}

def kit_files(typ):
    d = catalog['types'].get(typ, {})
    if d.get('defaults'):
        return [os.path.join(KIT, i + '.wav') for i in d['defaults']]
    dd = os.path.join(KIT, typ)
    return sorted(os.path.join(dd, f) for f in os.listdir(dd) if f.endswith('.wav'))

def next_sound(token, seed):
    if os.path.isfile(token): fs = [token]
    elif '/' in token:
        f = os.path.join(KIT, token if token.endswith('.wav') else token + '.wav'); fs = [f]
    else: fs = kit_files(token)
    k = count.get(token, 0); count[token] = k + 1
    f = fs[k % len(fs)]
    x, sr = sf.read(f, dtype='float32')
    if x.ndim > 1: x = x.mean(axis=1)
    if sr != SR:
        n = int(len(x) * SR / sr); x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
    r = 1 + np.random.default_rng(seed).uniform(-.02, .02)
    n = int(len(x) / r); return np.interp(np.arange(n) * r, np.arange(len(x)), x).astype(np.float32), f

def peak_offset(x):
    return int(np.argmax(np.abs(x))) if len(x) else 0

def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2) + 1e-12) + 1e-12)

# ── الصوت ──────────────────────────────────────────────────────────────
y, sr = sf.read('audio/vo.mp3', dtype='float32')
if y.ndim > 1: y = y.mean(axis=1)
if sr != SR:
    n = int(len(y) * SR / sr); y = np.interp(np.linspace(0, len(y) - 1, n), np.arange(len(y)), y).astype(np.float32)
s = int(0.45 * SR); voice = np.zeros((N, 2), dtype=np.float32)
seg = y[: max(0, N - s)]; voice[s:s + len(seg), 0] = seg; voice[s:s + len(seg), 1] = seg
voice *= 10 ** ((-16 - rms_db(voice[:, 0])) / 20)          # الصوت إلى -16 dBFS RMS
sf.write(os.path.join(OUT, 'voice.wav'), voice, SR, subtype='PCM_16')
print('الصوت:', round(rms_db(voice[:, 0]), 1), 'dBFS RMS')

# ── السرير الموسيقي + الخفض تحت الصوت ─────────────────────────────────
mus, _ = sf.read('/home/user/.cache/bed_track.wav', dtype='float32')
mus = mus[:N] if len(mus) >= N else np.pad(mus, ((0, N - len(mus)), (0, 0)))
mus = mus.copy(); mus *= 10 ** ((-20 - rms_db(mus.mean(axis=1))) / 20)     # الموسيقى إلى -20 dBFS RMS
w = int(0.05 * SR); env = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(w) / w, mode='same'))
act = 20 * np.log10(env + 1e-12) > -45
duck = np.where(act, 10 ** (-11 / 20), 1.0).astype(np.float32)
for _ in range(3): duck = np.convolve(duck, np.ones(w) / w, mode='same').astype(np.float32)
mus *= duck[:, None]
sf.write(os.path.join(OUT, 'music_ducked.wav'), mus, SR, subtype='PCM_16')
bed_mono = (mus[:, 0] + voice[:, 0])
print('الموسيقى المخفوضة:', round(rms_db(mus.mean(axis=1)), 1), 'dBFS RMS')
del voice

# ── المؤثرات ──────────────────────────────────────────────────────────
sfx = np.zeros((N, 2), dtype=np.float32)
placed = 0
for c in CUES['cues']:
    snd = c.get('sound', '')
    if not snd: continue
    seed = zlib.crc32(str(c.get('id', '')).encode())
    layers = []
    for i, typ in enumerate(snd.split('+')):
        typ = typ.strip()
        if typ.startswith('synth:'): continue
        try: x2, f = next_sound(typ, seed + i)
        except SystemExit as e: print('  تخطّي:', e, file=sys.stderr); continue
        layers.append((x2, peak_offset(x2)))
    if not layers: continue
    pk = max(p for _, p in layers)
    n = max(pk - p + len(x2) for x2, p in layers)
    x = np.zeros(n, dtype=np.float32)
    for x2, p in layers: x[pk - p: pk - p + len(x2)] += x2
    t = float(c.get('t', c.get('frame', 0) / 30.0))
    start = int(round((t - pk / SR) * SR))
    a0, a1 = max(0, start), min(N, start + len(x))
    if a1 <= a0: continue
    ev = x[a0 - start: a1 - start]
    pkt = a0 + pk - start
    w0, w1 = max(0, pkt - int(.05 * SR)), min(N, pkt + int(.45 * SR))
    b_rms = np.sqrt(np.mean(bed_mono[w0:w1] ** 2) + 1e-12)
    b_pk = float(np.max(np.abs(bed_mono[w0:w1])) + 1e-9)
    e_rms = np.sqrt(np.mean(ev ** 2) + 1e-12); e_pk = float(np.max(np.abs(ev)) + 1e-9)
    lift = 5.0 if c.get('weight') == 'hero' else 3.5
    g = (b_rms * 10 ** (lift / 20)) / e_rms                      # مستوى الحدث فوق السرير
    g = min(g, (b_pk * 10 ** ((8 if c.get('weight') == 'hero' else 6) / 20)) / e_pk)   # سقف القمة
    g = min(g, 10 ** (-6 / 20) / e_pk)                            # لا يتجاوز -6 dBFS
    g = max(g, 10 ** (-30 / 20) / e_pk)                           # لا يقل عن مسموع
    pan = float(c.get('pan', 0)); a = (pan + 1) / 2 * np.pi / 2
    sfx[a0:a1, 0] += (ev * g * np.cos(a)).astype(np.float32)
    sfx[a0:a1, 1] += (ev * g * np.sin(a)).astype(np.float32)
    placed += 1
sf.write(os.path.join(OUT, 'sfx.wav'), sfx, SR, subtype='PCM_16')
print(f'المؤثرات: {placed} حدثًا موضوعة · ذروة {20*np.log10(np.max(np.abs(sfx))+1e-9):.1f} dBFS')
json.dump({'duration_s': DUR, 'cues': len(CUES['cues']), 'sfx_placed': placed}, open(os.path.join(OUT, 'mix_report.json'), 'w'))
print('MIXLIGHT_DONE')
