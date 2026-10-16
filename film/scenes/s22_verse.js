// ═══════════════════════════════════════════════════════════════════════════
//  s22 · 130.0 – 183.0 · أبيات الأغنية: لحظة كل طالب
//  VOX: بطاقة الطالب + لحظته الحيّة + بيته يُكتب على الإيقاع · خلفيات متبدّلة · دفع كاميرا.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const BY = {}; STUDENTS.forEach((s) => BY[s.id] = s);
  // [الطلاب، البداية، النهاية، اللوحة، نمط الكاميرا، بيت الأغنية]
  const M = [
    { ids: ['moataz'], a: 130.0, b: 134.3, plate: 'classroom_light', cam: 'push', text: 'معتز صار الأول الغالي هنا', hi: [2, 3] },
    { ids: ['moayed'], a: 134.3, b: 139.1, plate: 'notebooks', cam: 'crane', text: 'ومؤيد كالبدر أشرق بيننا', hi: [2] },
    { ids: ['saad'], a: 139.1, b: 143.4, plate: 'desk_scrapbook', cam: 'arc', text: 'سعد له أخلاق تسعد قلبنا', hi: [2] },
    { ids: ['anhar'], a: 143.4, b: 148.2, plate: 'school_warm', cam: 'dolly', text: 'أنهار تسقي بالنجاح عقولنا', hi: [1] },
    { ids: ['shouq'], a: 148.2, b: 152.4, plate: 'classroom_light', cam: 'tilt', text: 'ولشوقنا حلم يحلق فوقنا', hi: [1] },
    { ids: ['anas'], a: 152.4, b: 157.3, plate: 'gold_rewards', cam: 'push', text: 'أنس يوزع فرحة في صفنا', hi: [1] },
    { ids: ['shomookh'], a: 157.3, b: 161.5, plate: 'notebooks', cam: 'crane', text: 'وشموخ ترفع بالنجاح رؤوسنا', hi: [1] },
    { ids: ['samar', 'waleed'], a: 161.5, b: 166.4, plate: 'desk_scrapbook', cam: 'arc', text: 'سمر تزيد مع الوليد ضياءنا', hi: [0, 5] },
    { ids: ['rashed'], a: 166.4, b: 170.4, plate: 'classroom_light', cam: 'dolly', text: 'ولراشد عزم يشدد عزمنا', hi: [1] },
    { ids: ['asaadA', 'asaadF'], a: 170.4, b: 174.4, plate: 'school_warm', cam: 'tilt', text: 'أسعد وأسعد بهجة لقلوبنا', hi: [0, 2] },
    { ids: ['taher'], a: 174.4, b: 179.2, plate: 'gold_rewards', cam: 'push', text: 'ولطاهر فعل جميل بيننا', hi: [1] },
  ];
  const CAMK = {
    push: (t, a, b) => ({ x: kf(t, [[a, 556], [b, 560]]), y: kf(t, [[a, 950], [b, 862]]), s: kf(t, [[a, 1.02], [b, 1.12]]), rot: kf(t, [[a, .005], [b, -.007]]) }),
    crane: (t, a, b) => ({ x: kf(t, [[a, 546], [b, 570]]), y: kf(t, [[a, 1020], [b, 844]]), s: kf(t, [[a, 1.06], [b, 1.0]]), rot: kf(t, [[a, .014], [b, .002]]) }),
    arc: (t, a, b) => ({ x: kf(t, [[a, 466], [b, 626]]), y: kf(t, [[a, 900], [b, 950]]), s: kf(t, [[a, 1.08], [b, 1.02]]), rot: kf(t, [[a, -.016], [b, .014]]) }),
    tilt: (t, a, b) => ({ x: kf(t, [[a, 540], [b, 552]]), y: kf(t, [[a, 1016], [b, 892]]), s: kf(t, [[a, 1.05], [b, 1.0]]), rot: kf(t, [[a, -.012], [b, .01]]) }),
    dolly: (t, a, b) => ({ x: kf(t, [[a, 646], [b, 448]]), y: kf(t, [[a, 904], [b, 924]]), s: kf(t, [[a, 1.05], [b, 1.02]]), rot: kf(t, [[a, .018], [b, -.012]]) }),
  };
  const TIN = ['paperTear', 'tapeZip', 'push', 'pageFlip', 'whipUp', 'band'];
  INITS.push(async () => {
    M.forEach((m) => T7.lyric(m.text, -99, { from: 1e9, to: 1e9 + 1 })); // تسخين صور الكلمات (تُبنى مرة واحدة)
  });
  M.forEach((m, i) => {
    const s0 = BY[m.ids[0]], s1 = m.ids[1] ? BY[m.ids[1]] : null;
    const t0 = m.a + .45, tName = m.a + .85, tSeal = m.a + 1.25, tLive = m.a + .95;
    cue.cut('s22-' + i, m.a, { sound: i % 3 === 0 ? 'transition' : 'paper', pan: (i % 3 - 1) * .3 });
    cue.hero('s22-' + i + '-card', when.spring(t0, 'snap'), { on: 'land', sound: 'thump/fs-133282-thump-on-carpet-2+tap', pan: (i % 3 - 1) * .25 });
    cue.appear('s22-' + i + '-seal', when.spring(tSeal, 'snap'), { sound: 'hit+tap', pan: -.25 });
    if (i % 2 === 0) cue.appear('s22-' + i + '-live', when.spring(tLive, 'card'), { sound: 'paper', pan: .3 });
    (typeof SONG_BARS !== 'undefined' ? SONG_BARS.filter((b) => b > m.a + 1.4 && b < m.b - .4) : []).forEach((b, j) => {
      if (j % 2) return; cue.appear('s22-' + i + '-k' + j, b, { sound: 'pop', pitch: j % 4, pan: ((j % 3) - 1) * .4 }); });
    SHOTS.push({
      a: m.a, b: m.b, tin: TIN[i % TIN.length], tdur: .55, draw: (t) => {
        const kk = T7.kick(t, { decay: 5.5, amp: 1 });
        const st = CAMK[m.cam](t, m.a, m.b);
        st.x += kk * 7; st.y -= kk * 5; st.s += kk * .012;
        const sh = K7.lensShake(t, t0, 9, 26, 8); st.x += sh[0]; st.y += sh[1]; st.rot += sh[2];
        K7.parallax(() => T7.room(t, { plate: m.plate, blur: 30, dim: .74, zoom: 1.46, fy: .44, ray: i % 2 === 0, motes: .5 }), st, { depth: .13 });
        K7.parallax(() => {
          // بطاقة واحدة أو اثنتان
          if (!s1) {
            T7.portraitStage(s0, t, { t0, seal0: tSeal, name0: tName, live0: (i % 2 === 0 ? tLive : null), id: 1 + i, sc: 1, out0: m.b + .4,
              room: { plate: m.plate, ray: false } });
          } else {
            // لحظتان معًا: بطاقتان أصغر
            const k0 = spring(t - t0, 320, 26), k1 = spring(t - t0 - .18, 320, 26);
            const drift = kf(t, [[m.a, 0], [m.b, 100]]);
            T7.portraitStage(s0, t, { t0, seal0: tSeal, name0: null, live0: null, id: 1 + i, sc: 1, out0: m.b + .4, room: { plate: m.plate, ray: false } });
            // البطاقة الثانية تدخل جوار الأولى (تُرسم فوقها قليلًا)
            g.save(); g.translate(drift * .5, 0);
            const cl = T7.cards[s1.id];
            g.save(); g.globalAlpha = clamp(k1 * 2.2); g.translate(760, 700 + (1 - k1) * 60); g.rotate(.06 + (1 - k1) * .2); g.scale(.62, .62);
            g.shadowColor = 'rgba(15,8,0,.5)'; g.shadowBlur = 24; g.shadowOffsetY = 10; g.drawImage(cl.c, -cl.c.width / 2, -cl.c.height / 2); g.restore();
            KT.show(T7.TX(s1.name, { size: 62, color: PAL.paper, font: K7.FONTS.d, weight: 800 }), t, { x: 740, y: 1266, t0: tName, in: 'rise', dist: 24, t1: m.b + .3, out: 'lift', outDur: .24 });
            g.restore();
          }
          // بيت الأغنية
          T7.lyric(m.text, t, { x: 540, y: 1804, size: 74, font: K7.FONTS.d, weight: 800, color: PAL.paper, from: m.a + .5, to: m.b - .6,
            hi: PAL.goldL, hiIdx: m.hi, maxW: 960, gap: 20 });
        }, st, { depth: .44 });
        // بريق على الضربات
        if (kk > .45) { const r = rng(Math.round(t * 30)); K7.twinkle(200 + r() * 680, 300 + r() * 1200, t, t, { n: 1, R: 120, dur: .35, size: 20, seed: Math.round(t * 60) }); }
        K7.motes(t, { n: 18, alpha: .4, seed: 100 + i * 5 });
      }
    });
  });
})();
