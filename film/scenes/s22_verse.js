// ═══════════════════════════════════════════════════════════════════════════
//  s22 · 130.0 – 183.0 · أبيات الأغنية: لحظة كل طالب
//  VOX: بطاقة الطالب + لحظته الحيّة + بيته يُكتب على الإيقاع · خلفيات متبدّلة · دفع كاميرا.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const BY = {}; STUDENTS.forEach((s) => BY[s.id] = s);
  // [الطلاب، البداية، النهاية، اللوحة، نمط الكاميرا، بيت الأغنية]
  const M = [
    { ids: ['moataz'], a: 129.7, b: 134.0, plate: 'classroom_light', cam: 'push', text: 'معتز صار الأول الغالي هنا', hi: [2, 3] },
    { ids: ['moayed'], a: 134.0, b: 138.6, plate: 'notebooks', cam: 'crane', text: 'ومؤيد كالبدر أشرق بيننا', hi: [2] },
    { ids: ['saad'], a: 138.6, b: 143.1, plate: 'desk_scrapbook', cam: 'arc', text: 'سعد له أخلاق تسعد قلبنا', hi: [2] },
    { ids: ['anhar'], a: 143.1, b: 147.3, plate: 'school_warm', cam: 'dolly', text: 'وأنهار تسقي بالنجاح عقولنا', hi: [1] },
    { ids: ['shouq'], a: 147.3, b: 151.9, plate: 'classroom_light', cam: 'tilt', text: 'ولشوقنا حلم يحلّق فوقنا', hi: [1] },
    { ids: ['anas'], a: 151.9, b: 156.2, plate: 'gold_rewards', cam: 'push', text: 'وأنس يوزّع فرحةً في صفّنا', hi: [1] },
    { ids: ['shomookh'], a: 156.2, b: 160.7, plate: 'notebooks', cam: 'crane', text: 'وشموخ ترفع بالنجاح رؤوسنا', hi: [1] },
    { ids: ['samar', 'waleed'], a: 160.7, b: 165.2, plate: 'desk_scrapbook', cam: 'arc', text: 'وسمر تزيد مع الوليد ضياءنا', hi: [1, 5] },
    { ids: ['rashed'], a: 165.2, b: 169.6, plate: 'classroom_light', cam: 'dolly', text: 'ولراشد عزمٌ يشدد عزمنا', hi: [1] },
    { ids: ['asaadA', 'asaadF'], a: 169.6, b: 174.1, plate: 'school_warm', cam: 'tilt', text: 'أسعد وأسعد بهجةٌ لقلوبنا', hi: [0, 2] },
    { ids: ['taher'], a: 174.1, b: 178.4, plate: 'gold_rewards', cam: 'push', text: 'ولطاهر فعلٌ جميلٌ بيننا', hi: [1] },
    { ids: [], a: 178.4, b: 183.0, plate: 'classroom_light', cam: 'crane', text: 'كل الأوائل شمعة في دربنا', hi: [0, 1, 2], group: true },
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
    const s0 = m.group ? null : BY[m.ids[0]], s1 = m.ids[1] ? BY[m.ids[1]] : null;
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
          // ── البيت الجماعي: «كل الأوائل شمعة في دربنا» ──
          if (m.group) {
            const kc = clamp((t - m.a - .3) / 1.1);
            if (kc > 0) {
              g.save(); g.globalCompositeOperation = 'lighter';
              const rg = g.createRadialGradient(540, 940, 40, 540, 940, 780); rg.addColorStop(0, `rgba(255,226,158,${.36 * kc})`); rg.addColorStop(1, 'rgba(255,200,110,0)');
              g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
              // ١٣ بطاقة في قوس
              STUDENTS.forEach((stu, j) => {
                const ang = (j - 6) * .21, R = 1080;
                const k2 = spring(t - (m.a + .35 + j * .045), 300, 25); if (k2 <= .002) return;
                const px = 540 + Math.sin(ang) * R * .82, py = 1500 - Math.cos(ang) * R * .62;
                g.save(); g.globalAlpha = clamp(k2 * 2.2); g.translate(px, py + (1 - k2) * 70); g.rotate(ang + (1 - k2) * .2); g.scale(.58, .58);
                g.shadowColor = 'rgba(12,6,0,.5)'; g.shadowBlur = 22; g.shadowOffsetY = 9;
                const cd = T7.cards[stu.id]; g.drawImage(cd.c, -cd.c.width / 2, -cd.c.height / 2); g.restore();
              });
              // وسام ذهبي مركزي بنجمة
              const km = spring(t - m.a - .5, 200, 20);
              if (km > .002) { g.save(); g.globalAlpha = clamp(km * 2.2); g.translate(540, 940); g.scale(km, km);
                g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; g.shadowOffsetY = 12;
                g.fillStyle = 'rgba(247,240,224,.97)'; g.beginPath(); g.arc(0, 0, 176, 0, 7); g.fill(); g.restore();
                g.strokeStyle = PAL.gold; g.lineWidth = 12; g.beginPath(); g.arc(0, 0, 172, 0, 7); g.stroke();
                g.strokeStyle = 'rgba(22,48,94,.35)'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 150, 0, 7); g.stroke();
                K7.star(0, -30, 84, { color: PAL.gold, grad: true, shadow: 22, inner: .44 });
                const wn = T7.TX('الأوائل', { size: 52, color: PAL.navy, font: K7.FONTS.d, weight: 800 }).img;
                g.drawImage(wn, -wn.width / 2, 46); g.restore(); }
            }
            T7.lyric(m.text, t, { x: 540, y: 1790, size: 92, font: K7.FONTS.d, weight: 800, color: PAL.paper, from: m.a + .4, to: m.b - .5,
              hi: PAL.goldL, hiIdx: m.hi, maxW: 960, gap: 24 });
            K7.confetti(t, m.a + .5, { x: 540, y: 1000, n: 70, power: 1.15, spread: 2.6, seed: 213, grav: 560, dur: 3.2 });
            return;
          }
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
