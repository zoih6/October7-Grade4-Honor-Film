// ═══════════════════════════════════════════════════════════════════════════
//  s00 · 0.00 – 5.90 · «في رحاب العلم تزهر الأحلام…»
//  VOX: طبقات ورقيّة متوازية · نقطة حبر تهدأ → زهرة تتفتّح مع «تزهر الأحلام»
//  · سهم ذهبي مرسوم يشقّ الصفحة · طائرة ورقية تقود العين إلى اللقطة التالية.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const P = {};              // نصوص المشهد
  const B = { cx: 540, cy: 1180, w: 1700, h: 2900, res: .5 };
  // أوقات الكلمات (زمن الفيلم = t + VO_OFFSET)
  const W = (i) => VO_WORDS[0].words[i].t + VO_OFFSET;
  const T = { dot: .20, bloom: W(3) - .06, l1: W(1) - .06, l2: W(6) - .05, l3: W(8) - .05, kite: W(9) + .05, out: 5.90 };
  // مسارات الكاميرا (بداية كل لقطة = نهاية السابقة لاتصال الحركة)
  const CAM = {
    x: [[0, 508], [1.2, 470], [2.6, 552], [4.4, 566], [5.9, 700]],
    y: [[0, 430], [1.2, 620], [2.6, 900], [4.4, 1210], [5.9, 1330]],
    s: [[0, 2.7], [1.2, 1.78], [2.6, 1.24], [4.4, 1.03], [5.9, .90]],
    rot: [[0, .016], [2.6, -.004], [4.4, .006], [5.9, .02]],
  };

  INITS.push(async () => {
    A.board0 = K7.sheet({
      w: B.w, h: B.h, seed: 12, rough: 12, tone: 1, res: B.res, fib: 2.4, edgeShade: .5,
      content: (x, w, h) => {
        x.save(); x.globalAlpha = .07; x.strokeStyle = '#2b4a86'; x.lineWidth = 2;
        for (let y = 150; y < h; y += 96) { x.beginPath(); x.moveTo(70, y); x.lineTo(w - 70, y); x.stroke(); }
        x.globalAlpha = .18; x.strokeStyle = '#c9a227'; x.lineWidth = 5;
        x.beginPath(); x.moveTo(w - 132, 60); x.lineTo(w - 132, h - 60); x.stroke();
        x.restore();
      }
    });
    // كلمات تأكيد كبيرة (VOX: الكلمة المفتاحية تكبر لحظة نطقها)
    P.big = (txt, col, size) => T7.TX(txt, { size: size || 190, color: col || PAL.navy, font: K7.FONTS.d, weight: 800 });
    A.kite = null;
  });

  // ── أصوات من حركة الصورة ────────────────────────────────────────────────
  cue.land('s00-dot', when.spring(T.dot, 'snap'), { sound: 'tap', pan: 0 });
  cue.move('s00-pull', when.ease(0, 1.2), { sound: 'whoosh/fs-449992-whoosh-short-low-wav-1', pan: 0 });
  cue.hero('s00-bloom', when.spring(T.bloom, 'pop'), { on: 'appear', sound: 'chime+tap', pan: .1 });
  cue.move('s00-arrow', when.ease(W(6), W(7)), { sound: 'swish', pan: -.2 });
  cue.move('s00-kite1', when.ease(T.kite, T.kite + .95), { sound: 'swish', pan: -.3 });
  cue.move('s00-kite2', when.ease(W(11) + .1, 5.9), { sound: 'whoosh/fs-449994-whoosh-med-mid-wav-1', pan: .35 });

  // زهرة ذهبية (VOX: شكل يُرسم ثم يُملأ)
  function bloom(t, cx, cy, k) {
    if (k <= .001) return; const R = 150;
    g.save();
    K7.goldPath([[cx, cy + 16], [cx - 6, cy + 120], [cx + 22, cy + 232], [cx + 4, cy + 344]], clamp(k * 1.25), { width: 9, color: PAL.gold, glow: 12 });
    for (const [side, at] of [[-1, .42], [1, .74]]) { const kk = clamp((k - at) * 3.4); if (kk <= 0) continue;
      g.save(); g.translate(cx + side * 14, cy + 120 + at * 190); g.rotate(side * .75); g.scale(kk, kk);
      g.fillStyle = PAL.teal; g.beginPath(); g.ellipse(side * 44, -14, 62, 25, side * -.25, 0, 7); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(side * 92, -26); g.stroke(); g.restore(); }
    const kp = clamp((k - .18) * 2.2);
    if (kp > 0) {
      g.save(); g.translate(cx, cy - 42);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + .3, kd = clamp((k - .18 - i * .035) * 3); if (kd <= 0) continue;
        g.save(); g.rotate(a); const s = lerp(1.5, 1, kd) * (.4 + .6 * kd); g.scale(s, s);
        const gr = g.createLinearGradient(0, 0, 0, -R * .62); gr.addColorStop(0, PAL.goldD); gr.addColorStop(.55, PAL.gold); gr.addColorStop(1, PAL.goldL);
        g.fillStyle = gr; g.beginPath(); g.ellipse(0, -R * .34, R * .19, R * .36, 0, 0, 7); g.fill(); g.restore(); }
      const gr2 = g.createRadialGradient(0, 0, 4, 0, 0, 44); gr2.addColorStop(0, '#fff6d8'); gr2.addColorStop(.6, PAL.goldL); gr2.addColorStop(1, PAL.goldD);
      g.fillStyle = gr2; g.beginPath(); g.arc(0, 0, 40 * clamp(kp), 0, 7); g.fill();
      g.fillStyle = 'rgba(120,70,10,.5)'; for (let i = 0; i < 10; i++) { const a = i / 10 * 7 + 1.1; g.beginPath(); g.arc(Math.cos(a) * 19, Math.sin(a) * 19, 4.4, 0, 7); g.fill(); }
      g.restore();
      K7.twinkle(cx, cy - 42, t, T.bloom + .05, { n: 2, R: 140, dur: .8, size: 24, seed: 9 });
    }
    g.restore();
  }

  SHOTS.push({
    a: 0, b: 5.90, tin: 'cut', draw: (t) => {
      const st = K7.camAt(t, CAM);
      const sh = K7.lensShake(t, T.dot, 9, 30, 9); st.x += sh[0]; st.y += sh[1]; st.rot += sh[2];
      // ── طبقة ٣: غرفة دافئة (Parallax 0.14) ──
      K7.parallax(() => T7.room(t, { plate: 'desk_scrapbook', blur: 34, dim: .78, zoom: 1.45, ray: true, motes: .7 }), st, { depth: .14 });
      // ── طبقة ٢: صفحة الدفتر (Parallax 0.42) ──
      K7.parallax(() => {
        K7.drawSheet(A.board0, B.cx, B.cy, { rot: -.012, sc: 1 / A.board0.res * .98, lift: .2 });
        // نقطة الحبر
        const kd = spring(t - T.dot, 320, 26);
        if (kd > .001) {
          g.save(); g.shadowColor = 'rgba(255,208,110,.85)'; g.shadowBlur = 30;
          const gr = g.createRadialGradient(540 - 8, 478 - 10, 2, 540, 470, lerp(4, 26, kd));
          gr.addColorStop(0, '#fff8e2'); gr.addColorStop(.55, PAL.goldL); gr.addColorStop(1, PAL.gold);
          g.fillStyle = gr; g.beginPath(); g.arc(540, 470, lerp(4, 26, kd), 0, 7); g.fill(); g.restore();
          for (let i = 0; i < 3; i++) { const kr = clamp((t - T.dot - i * .11) / .8); if (kr <= 0 || kr >= 1) continue;
            g.save(); g.globalAlpha = (1 - kr) * .45; g.strokeStyle = i ? PAL.gold : '#7a4a10'; g.lineWidth = 5 * (1 - kr) + 1;
            g.beginPath(); g.ellipse(540, 470, 26 + kr * (140 + i * 60), (26 + kr * (140 + i * 60)) * .34, 0, 0, 7); g.stroke(); g.restore(); }
        }
        bloom(t, 540, 492, spring(t - T.bloom, 400, 22));
        // كلمة «الأحلام» البطلة تكبر لحظة نطقها
        const kl = clamp((t - W(4)) / .5);
        if (kl > 0) KT.show(P.big('الأحلام', PAL.goldD, 176), t, { x: 540, y: 934, t0: W(4), in: 'pop', spring: 'pop', t1: 5.3, out: 'lift', outDur: .3 });
        // سهم ذهبي يُرسم: من الزهرة إلى «تصنع الإنجازات»
        const ka = clamp((t - W(6)) / 1.05);
        if (ka > 0) K7.arrow([[672, 1122], [812, 1188], [700, 1290]], ka, { width: 8, color: PAL.goldD, seed: 7, head: .9, glow: 10 });
        // كلمة «الإنجازات»
        const kk = clamp((t - W(7)) / .5);
        if (kk > 0) KT.show(P.big('الإنجازات', PAL.navy, 168), t, { x: 540, y: 1330, t0: W(7), in: 'pop', spring: 'pop', t1: 5.5, out: 'lift', outDur: .3 });
      }, st, { depth: .42 });
      // ── طبقة ١ (أمام): ورقة الزاوية المموّهة + الطائرات (Parallax 1.0) ──
      const kite = (t0, dur, y0, y1, sc, blur) => { const kk = clamp((t - t0) / dur); if (kk <= 0 || kk >= 1) return;
        const e = E.cubicInOut(kk), px = lerp(W + 300, -330, e), py = lerp(y0, y1, e) + Math.sin(e * 6) * 26;
        g.save(); g.filter = `blur(${blur}px)`; K7.drawKite(px, py, sc, -.32 + e * .22, t, { tail: 1.1 }); g.restore(); };
      kite(T.kite, .95, H * .30, H * .12, 1.2, 2.5);
      kite(W(11) - .25, 1.5, H * .74, H * .46, 1.9, 4);
      const fg = A.fg0 || (A.fg0 = K7.sheet({ w: 760, h: 460, seed: 71, rough: 16, tone: 1, res: .5 }));
      g.save(); g.filter = 'blur(7px)'; g.globalAlpha = .95;
      g.translate(-140 + (st.x - 540) * .9, H + 90 - (st.y - 1180) * .9); g.rotate(-.24);
      g.drawImage(fg.c, -fg.c.width * .5, -fg.c.height * .5, fg.c.width * 1.45, fg.c.height * 1.45); g.restore();
      // ── كلمات التعليق (تبني نفسها) ──
      K7.voWords(0, t, { x: 540, y: 1690, size: 68, font: K7.FONTS.d, weight: 800, color: '#3d2c14', maxW: 880, gap: 22,
        range: [0, 11], hiMap: { 2: PAL.navy, 4: PAL.goldD, 7: PAL.navy, 11: PAL.teal } });
      KT.streak(t, W(9), { dur: .5, alpha: .26, angle: .3 });
    }
  });
})();
