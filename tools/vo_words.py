#!/usr/bin/env python3
"""أزمنة كلمات التعليق: onsets من الصوت + توزيع كلمات كل جملة عليها."""
import json, re
import numpy as np, librosa
VO='film/audio/vo.mp3'
LINES=[(0,5,'في رحاب العلم تزهر الأحلام، وبالاجتهاد تصنع الإنجازات، وتكتب أجمل حكايات النجاح.'),
(5,15,'من مدرسة سبعة أكتوبر، نلتقي اليوم لنحتفي بنجوم الصف الرابع الذين جعلوا من المثابرة طريقاً للتفوق، ومن الطموح بداية لمستقبل مشرق.'),
(15,23,'نبارك لأوائل الصف الرابع هذا الإنجاز الجميل، ونبدأ بنجوم الترتيب الأول: معتز أحمد حمود قائد (الأول).'),
(23,27,'ومؤيد جميل محمد أحمد (الأول مكرر).'),(27,30,'وسعد معاذ أحمد قاسم (الثاني).'),
(30,33,'وأنهار أمين محمد أحمد (الثاني مكرر).'),(33,35,'وشوق هاشم سعيد هزاع (الثالث).'),
(35,37,'وأنس عبده سعيد نعمان (الرابع).'),(37,40,'وشموخ محمد عبدالسلام (الخامس).'),
(40,42,'وسمر محمد عبدالله فرحان (السادس).'),(42,45,'ووليد صادق حمود فرحان (السادس مكرر).'),
(45,47,'وراشد ماجد قاسم مرشد (السابع).'),(47,50,'وأسعد علاء نعمان قائد (الثامن).'),
(50,52,'وأسعد فؤاد طاهر يحيى (التاسع).'),(52,55,'وطاهر بلال طاهر محمد (العاشر).'),
(55,65,'وكل التحية والتقدير لمربية الصف، الأستاذة سارة القاسمي، التي غرست في قلوب طلابها حب العلم ورعت خطواتهم نحو النجاح، فكان لجهدها أثر جميل في مسيرتهم.'),
(65,70,'إلى نجومنا الصغار، أنتم فخر اليوم وأمل الغد، وبكم تحلو حكايات النجاح.'),
(70,82,'والآن نهديكم هذه الأغنية احتفاء بتفوقكم وفرحاً بإنجازكم وذكرى جميلة تبقى في قلوبكم، ألف مبارك لكم وإلى مزيد من التألق والنجاح.')]
y,sr=librosa.load(VO,sr=22050,mono=True)
y,_=librosa.effects.trim(y,top_db=30)
onset=librosa.onset.onset_detect(y=y,sr=sr,units='time',backtrack=False,delta=0.02,wait=3)
merged=[]
for o in onset:
    if not merged or o-merged[-1]>0.09: merged.append(float(o))
out=[]
for (a,b,text) in LINES:
    words=[w for w in re.split(r'\s+',text.strip()) if w]
    span=[o for o in merged if a-0.2<=o<=b+0.2]
    wlen=np.array([max(1.6,len(w.replace('ـ',''))) for w in words],dtype=float)
    cum=np.cumsum(wlen)/wlen.sum()
    times=[]
    for i,c in enumerate(cum):
        target=a+(b-a)*max(0.0,c-wlen[i]/wlen.sum()*0.5)
        if len(span)>=len(words):
            j=int(np.argmin([abs(s-target) for s in span])); times.append(round(float(span[j]),3))
        else: times.append(round(float(target),3))
    for i in range(1,len(times)):
        if times[i]<=times[i-1]+0.12: times[i]=round(times[i-1]+0.14,3)
    out.append({'span':[a,b],'words':[{'w':w,'t':t} for w,t in zip(words,times)]})
json.dump(out,open('film/audio/vo_words.json','w'),ensure_ascii=False,indent=1)
print('lines',len(out),'words',sum(len(l['words']) for l in out),'onsets',len(merged))
