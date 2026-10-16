#!/usr/bin/env python3
"""نبضات الأغنية: beat/downbeat من song.mp3 → film/song_beats.js (أزمنة الفيلم = 99 + t)."""
import json
import numpy as np, librosa
y, sr = librosa.load('film/audio/song.mp3', sr=22050, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time', trim=False)
onset_env = librosa.onset.onset_strength(y=y, sr=sr)
# downbeats: أقوى نبضة كل 4
bt = librosa.util.fix_frames(beats, x_min=0)
strength = onset_env[np.clip((beats * sr / 512).astype(int), 0, len(onset_env)-1)]
order = np.argsort(strength)[::-1]
down = sorted(beats[i] for i in np.argsort([-s for s in strength])[:len(beats)//4])
bars = [round(float(b) + 99.0, 3) for b in down]
beats_abs = [round(float(b) + 99.0, 3) for b in beats]
json.dump({'tempo': float(tempo), 'beats': beats_abs, 'downbeats': bars}, open('film/audio/song_beats.json','w'))
print('tempo %.1f  beats %d  downbeats %d' % (tempo, len(beats_abs), len(bars)))
