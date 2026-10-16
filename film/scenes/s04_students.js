// ═══════════════════════════════════════════════════════════════════════════
//  s04 · 23.45 – 55.45 · نجوم الترتيب: مؤيد → سعد → أنهار → شوق → أنس → شموخ
//                                   → سمر → وليد → راشد → أسعد → أسعد → طاهر
//  VOX: كل لحظة = دفعة كاميرا مختلفة + مسرح ثابت + اسم يُنطَق + ختم ترتيب.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const V = (li, i) => VO_WORDS[li].words[i].t + VO_OFFSET;    // كلمة من السطر li
  const BY = {}; STUDENTS.forEach((s) => BY[s.id] = s);

  // بذور اللحظات: [الطالب، بداية، نوع الدفعة، اللوحة، كلمة الاسم داخل السطر]
  const BEATS = [
    { id: 'moayed', a: 23.45, b: 27.45, cam: 'crane', plate: 'notebooks', li: 3, wi: 1 },
    { id: 'saad', a: 27.45, b: 30.45, cam: 'push', plate: 'classroom_light', li: 4, wi: 1 },
    { id: 'anhar', a: 30.45, b: 33.45, cam: 'arc', plate: 'desk_scrapbook', li: 5, wi: 1 },
    { id: 'shouq', a: 33.45, b: 35.45, cam: 'tilt', plate: 'classroom_light', li: 6, wi: 1 },
    { id: 'anas', a: 35.45, b: 37.45, cam: 'dolly', plate: 'notebooks', li: 7, wi: 1 },
    { id: 'shomookh', a: 37.45, b: 40.45, cam: 'crane', plate: 'desk_scrapbook', li: 8, wi: 1 },
    { id: 'samar', a: 40.45, b: 42.45, cam: 'push', plate: 'classroom_light', li: 9, wi: 1 },
    { id: 'waleed', a: 42.45, b: 45.45, cam: 'arc', plate: 'notebooks', li: 10, wi: 1 },
    { id: 'rashed', a: 45.45, b: 47.45, cam: 'tilt', plate: 'desk_scrapbook', li: 11, wi: 1 },
    { id: 'asaadA', a: 47.45, b: 50.45, cam: 'dolly', plate: 'classroom_light', li: 12, wi: 1 },
    { id: 'asaadF', a: 50.45, b: 52.45, cam: 'crane', plate: 'notebooks', li: 13, wi: 1 },
    { id: 'taher', a: 52.45, b: 55.45, cam: 'push', plate: 'desk_scrapbook', li: 14, wi: 1 },
  ];
  // إيقاع الكاميرا: منحنيات مرتّبة لكل نوع دفعة
  const CAMK = {
    push: (t, a, b) => ({ x: kf(t, [[a, 556], [b, 560]]), y: kf(t, [[a, 940], [b, 862]]), s: kf(t, [[a, 1.02], [b, 1.1]]), rot: kf(t, [[a, .004], [b, -.006]]) }),
    crane: (t, a, b) => ({ x: kf(t, [[a, 546], [b, 566]]), y: kf(t, [[a, 1010], [b, 842]]), s: kf(t, [[a, 1.06], [b, 1.0]]), rot: kf(t, [[a, .012], [b, .002]]) }),
    arc: (t, a, b) => ({ x: kf(t, [[a, 470], [b, 620]]), y: kf(t, [[a, 900], [b, 946]]), s: kf(t, [[a, 1.08], [b, 1.02]]), rot: kf(t, [[a, -.014], [b, .012]]) }),
    tilt: (t, a, b) => ({ x: kf(t, [[a, 540], [b, 548]]), y: kf(t, [[a, 1006], [b, 890]]), s: kf(t, [[a, 1.04], [b, 1.0]]), rot: kf(t, [[a, -.01], [b, .008]]) }),
    dolly: (t, a, b) => ({ x: kf(t, [[a, 640], [b, 452]]), y: kf(t, [[a, 900], [b, 918]]), s: kf(t, [[a, 1.05], [b, 1.02]]), rot: kf(t, [[a, .016], [b, -.01]]) }),
  };
  const PLATE = { notebooks: 'notebooks', classroom_light: 'classroom_light', desk_scrapbook: 'desk_scrapbook' };

  INITS.push(async () => {
    // نصوص أسماء كل طالب (تُبنى داخل INITS لتفادي أي تأخير)
    STUDENTS.forEach((s) => T7.TX(s.name, { size: 84, color: PAL.paper, font: K7.FONTS.d, weight: 800 }));
  });

  BEATS.forEach((Bt, bi) => {
    const s = BY[Bt.id];
    const t0 = Bt.a + .62;                 // البطاقة تهبط بعد بداية اللحظة بقليل
    const tName = V(Bt.li, Bt.wi) - .06;   // الاسم عند نطقه
    const tSeal = Math.min(Bt.b - .55, tName + .55);
    const tLive = tName + .35;
    cue.cut('s04-' + Bt.id, Bt.a, { sound: bi === 0 ? 'paper/fs-397550-page-turn-03-wav-2' : 'transition' });
    cue.hero('s04-' + Bt.id + '-card', when.spring(t0, 'snap'), { on: 'land', sound: 'thump/fs-133282-thump-on-carpet-2+tap', pan: (bi % 3 - 1) * .25 });
    cue.appear('s04-' + Bt.id + '-seal', when.spring(tSeal, 'snap'), { sound: 'hit+tap', pan: -.3 });
    if (bi % 2 === 0) cue.appear('s04-' + Bt.id + '-live', when.spring(tLive, 'card'), { sound: 'paper', pan: .3 });

    SHOTS.push({
      a: Bt.a, b: Bt.b, tin: bi === 0 ? 'paperTear' : (bi % 3 === 0 ? 'tapeZip' : bi % 3 === 1 ? 'push' : 'pageFlip'),
      tdur: .55, draw: (t) => {
        const st = CAMK[Bt.cam](t, Bt.a, Bt.b);
        const sh = K7.lensShake(t, t0, 10, 26, 8); st.x += sh[0]; st.y += sh[1]; st.rot += sh[2];
        K7.parallax(() => T7.room(t, { plate: PLATE[Bt.plate], blur: 30, dim: .74, zoom: 1.46, fy: .44, ray: bi % 2 === 0, motes: .55 }), st, { depth: .13 });
        K7.parallax(() => {
          T7.portraitStage(s, t, { t0, seal0: tSeal, name0: tName, live0: (bi % 2 === 0 ? tLive : null), id: 1 + bi, sc: 1, out0: Bt.b + .4,
            room: { plate: PLATE[Bt.plate], ray: bi % 2 === 1 } });
          // كلمات التعليق: النافذة الزمنية للحظة هذه فقط (لا كلمات شاردة)
          K7.voWords(Bt.li, t, { x: 540, y: 112, size: 50, font: K7.FONTS.u, weight: 700, color: PAL.paper, maxW: 940, gap: 16,
            within: [Bt.a, Bt.b], hiMap: { 0: PAL.goldL } });
        }, st, { depth: .44 });
        K7.motes(t, { n: 18, alpha: .4, seed: 40 + bi * 7 });
        if (bi % 3 === 2) KT.streak(t, tName + .1, { dur: .5, alpha: .26, angle: .26 });
      }
    });
  });
})();
