#!/usr/bin/env python3
"""نسخ كلمات الأغنية بأزمنة كلمات (whisper) → /home/user/song_words.json"""
import json, sys
import numpy as np, librosa
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8", download_root="/home/user/.cache/fw")
y, _ = librosa.load("film/audio/song.mp3", sr=16000, mono=True)
y = np.ascontiguousarray(y.astype(np.float32))
segments, info = m.transcribe(y, language="ar", word_timestamps=True,
                              vad_filter=False, beam_size=1, condition_on_previous_text=False)
out = {"duration": info.duration, "segments": []}
for s in segments:
    words = [{"w": w.word.strip(), "a": round(w.start, 2), "b": round(w.end, 2)} for w in (s.words or [])]
    out["segments"].append({"a": round(s.start, 2), "b": round(s.end, 2), "text": s.text.strip(), "words": words})
    print(f"[{s.start:6.2f} → {s.end:6.2f}] {s.text.strip()}", flush=True)
json.dump(out, open("/home/user/song_words.json", "w"), ensure_ascii=False, indent=1)
print("SONG_TRANSCRIBE_DONE")
