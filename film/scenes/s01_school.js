// ═══════════════════════════════════════════════════════════════════════════
//  s01 · 5.90 – 13.55 · «من مدرسة سبعة أكتوبر… الذين جعلوا من المثابرة طريقاً للتفوق»
//  VOX: تمزيق ورقي يكشف المدرسة · ختم يهبط · أسماء تتدلّى كقصاصات · مسار ذهبي يُرسم.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const L = VO_WORDS[1].words.map((w) => w.t + VO_OFFSET);   // أزمنة كلمات السطر الثاني
  const T = { tear: L[1] - .10, seal: L[3] - .06, meet: L[4] - .04, stars: L[7] - .05, list: L[8] - .05, path: L[10] - .05, end: 13.55 };
  const P = {};
  const N = STUDENTS.length;
  // قوس النجوم (داخل الإطار)
  const STARS = STUDENTS.map((s, i) => {
    const a = Math.PI * (1.15 + i * (0.70 / (N - 1))), R = 460;
    return { s, x: 540 + Math.cos(a) * R, y: 1000 + Math.sin(a) * R * .5, r: 26 + (i % 3) * 8 };
  });
  const CAM = { x: [[5.9, 700], [7.0, 560], [9.0, 540], [11.4, 560], [13.55, 720]], y: [[5.9, 1330], [7.0, 1010], [9.0, 1000], [11.4, 1180], [13.55, 1500]], s: [[5.9, .90], [7.2, 1.06], [10.6, 1.0], [13.55, .86]], rot: [[5.9, .02], [9.0, .004], [13.55, .016]] };

  INITS.push(async () => {
    STUDENTS.forEach((s) => T7.TX(s.first, { size: 54, color: PAL.navy, font: K7.FONTS.d, weight: 800 }));
    A.frT = K7.sheet({ w: 600, h: 260, seed: 21, rough: 20, tone: 1, res: .5 });
    A.frB = K7.sheet({ w: 600, h: 260, seed: 22, rough: 20, tone: 1, res: .5 });
    P.big = (txt, col, size) => T7.TX(txt, { size: size || 150, color: col || PAL.navy, font: K7.FONTS.d, weight: 800 });
  });

  cue.cut('s01-in', 5.90, { sound: 'transition' });
  cue.move('s01-tear', when.ease(T.tear, T.tear + .7), { sound: 'paper/fs-397550-page-turn-03-wav-2', pan: -.1 });
  cue.hero('s01-seal', when.spring(T.seal, 'snap'), { on: 'land', sound: 'thump/fs-133282-thump-on-carpet-2+chime' });
  cue.move('s01-meet', when.ease(T.meet, T.meet + .6), { sound: 'swish', pan: .2 });
  STUDENTS.forEach((s, i) => { if (i % 2) return;
    cue.appear('s01-star' + i, when.spring(T.stars + i * .16, 'snap'), { sound: 'pop', pitch: (i % 3), pan: (STARS[i].x / 540 - 1) * .5 }); });
  cue.move('s01-path', when.ease(T.path, T.path + 1.6), { sound: 'shimmer' });
  cue.appear('s01-topt', when.spring(13.0, 'pop'), { sound: 'chime', pan: .1 });

  // قائمة الأسماء (قصاصات صغيرة تتوالى) — ٧ + ٦
  function roster(t, t0) {
    const rows = [STUDENTS.slice(0, 7), STUDENTS.slice(7)];
    rows.forEach((row, ri) => {
      const y = 1160 + ri * 104, n = row.length, gap = 14;
      const wds = row.map((s) => T7.TX(s.first, { size: 54 }).img);
      const total = wds.reduce((a, im) => a + im.width * .74, 0) + gap * (n - 1);
      let x = 540 + total / 2;
      row.forEach((s, i) => {
        const im = wds[i], w = im.width * .74, h = im.height * .74;
        const k = spring(t - (t0 + (ri * 7 + i) * .08), 320, 26); if (k <= .002) return;
        x -= w / 2;
        g.save(); g.globalAlpha = clamp(k * 2.5); g.translate(x, y + (1 - k) * 24); g.rotate((1 - k) * .12);
        g.save(); g.shadowColor = 'rgba(20,10,0,.4)'; g.shadowBlur = 12; g.shadowOffsetY = 5;
        g.fillStyle = 'rgba(248,241,224,.95)'; rrect(-w / 2 - 11, -h / 2 - 5, w + 22, h + 10, 8, g); g.fill(); g.restore();
        g.strokeStyle = s.tied ? 'rgba(14,124,107,.6)' : 'rgba(201,162,39,.7)'; g.lineWidth = 2.2;
        rrect(-w / 2 - 11, -h / 2 - 5, w + 22, h + 10, 8, g); g.stroke();
        g.drawImage(im, -w / 2, -h / 2, w, h); g.restore();
        x -= w / 2 + gap;
      });
    });
  }

  SHOTS.push({
    a: 5.90, b: 13.55, tin: 'push', tdur: .5, whipDir: 1, draw: (t) => {
      const st = K7.camAt(t, CAM);
      const sh = K7.lensShake(t, T.seal, 15, 26, 6); st.x += sh[0] * .5; st.y += sh[1] * .5;
      // ── طبقة ٣: الغرفة (Parallax .12) ──
      K7.parallax(() => T7.room(t, { plate: 'desk_scrapbook', blur: 32, dim: .74, zoom: 1.4, ray: true, motes: .5 }), st, { depth: .12 });
      // ── طبقة ٢: المدرسة عبر تمزيق ورقي + الختم + النجوم (Parallax .45) ──
      K7.parallax(() => {
        // ورقة كبيرة تغطّي الإطار، تنمزق لتكشف الصورة
        const kr = clamp((t - T.tear) / .75);
        K7.tearReveal(540, 1000, 1240, 1560, 1 - kr, 31, {
          dir: 'rtl', rough: 16, tearW: 1.1,
          draw: () => { T7.schoolPlate(t, { zoom: 1.02 + (1 - kr) * .1, fx: .5, fy: .46, dim: .1 });
            g.fillStyle = 'rgba(20,12,4,.24)'; g.fillRect(0, 0, W, H); }
        });
        // إن لم يبدأ التمزيق بعد: الورقة فقط
        if (kr <= 0.001) { T7.board(t, { seed: 5, dark: .30 }); }
        // تدرّج سفلي لقراءة النص
        const gr = g.createLinearGradient(0, H * .45, 0, H); gr.addColorStop(0, 'rgba(14,8,2,0)'); gr.addColorStop(1, 'rgba(14,8,2,.86)');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        K7.motes(t, { n: 22, alpha: .4 });
        // ── ختم المدرسة (يهبط ثم يصغر إلى زاوية عليا) ──
        const ks = spring(t - T.seal, 150, 20);
        const sp = kf(t, [[T.seal, 0], [T.seal + 1.5, 0], [T.seal + 2.4, 1], [13.55, 1]]);
        const sx = lerp(540, 862, sp), sy = lerp(560, 300, sp), ss = lerp(1, .5, sp);
        if (ks > .001) {
          g.save(); g.globalAlpha = clamp(ks * 2); g.translate(sx + sh[0] * .4, sy + sh[1] * .4);
          g.rotate(-.05 + (1 - ks) * .3); g.scale(lerp(3.0, 1, ks) * ss, lerp(3.0, 1, ks) * ss);
          g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 40; g.shadowOffsetY = 16;
          g.drawImage(T7.seals.logoBig, -T7.seals.logoBig.width / 2, -T7.seals.logoBig.height / 2); g.restore();
          for (let i = 0; i < 2; i++) { const krr = clamp((t - T.seal - i * .07) / .7); if (krr <= 0 || krr >= 1) continue;
            g.save(); g.globalAlpha = (1 - krr) * .45; g.strokeStyle = PAL.goldL; g.lineWidth = 8 * (1 - krr) + 2;
            g.beginPath(); g.arc(sx, sy, (220 + krr * 430) * ss, 0, 7); g.stroke(); g.restore(); }
          K7.confetti(t, T.seal, { x: 540, y: 560, n: 22, power: .85, spread: 2.4, seed: 41, grav: 700, dur: 1.8, size: .8, colors: [PAL.gold, PAL.goldL, '#f6eeda', PAL.teal] });
        }
        // ── «نلتقي اليوم لنحتفي» : قصاصة تدخل وتُثبّت ──
        const km = clamp((t - T.meet) / .55);
        if (km > 0) {
          const wd = T7.TX('نلتقي اليوم لنحتفي', { size: 84, color: PAL.navy, font: K7.FONTS.u, weight: 700 }).img;
          g.save(); g.globalAlpha = km; g.translate(540, 1300 + (1 - km) * -40); g.rotate(-.012);
          g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 18; g.shadowOffsetY = 8;
          g.fillStyle = 'rgba(246,238,218,.96)'; rrect(-wd.width / 2 - 26, -wd.height / 2 - 18, wd.width + 52, wd.height + 36, 10, g); g.fill(); g.restore();
          K7.drawTape(T7.tape.a, 540 - wd.width * .34, 1300 - wd.height * .52, { rot: -.4, sc: .8, alpha: km });
          K7.drawTape(T7.tape.b, 540 + wd.width * .34, 1300 - wd.height * .52, { rot: .38, sc: .8, alpha: km });
          g.drawImage(wd, -wd.width / 2, -wd.height / 2); g.restore();
        }
        // ── النجوم الـ١٣ + الأسماء ──
        for (let i = 0; i < N; i++) {
          const s2 = STARS[i], t0 = T.stars + i * .16;
          const k = spring(t - t0, 300, 22); if (k <= .002) continue;
          g.save(); g.translate(s2.x, s2.y); g.scale(lerp(.2, 1, k) * (1 + .4 * clamp(1 - (t - t0) / .5)), lerp(.2, 1, k) * (1 + .4 * clamp(1 - (t - t0) / .5)));
          K7.star(0, 0, s2.r, { color: PAL.gold, grad: true, shadow: 26, inner: .42, rot: -Math.PI / 2 + (s2.x - 540) / 2600 });
          g.restore();
        }
        roster(t, T.list + .05);
        // ── المسار الذهبي: من المثابرة إلى التفوق ──
        const kp = clamp((t - T.path) / 1.7);
        if (kp > 0) {
          const pts = [[140, 1650], [300, 1560], [430, 1620], [600, 1480], [790, 1540], [940, 1380]];
          K7.route(pts, kp, { color: PAL.goldD, width: 5, dot: 22, dash: [16, 14] });
          const kend = clamp((t - T.path - 1.5) / .6);
          if (kend > 0) { K7.star(940, 1380, 34 * kend, { color: PAL.goldL, grad: true, shadow: 26 });
            K7.arrow([[1050, 1300], [980, 1345]], kend, { width: 7, color: PAL.goldD, seed: 12, head: .8 }); }
        }
        // كلمات التعليق المؤكَّدة
        KT.show(P.big('سبعة أكتوبر', PAL.goldL, 132), t, { x: 540, y: 700, t0: T.seal - .1, in: 'pop', spring: 'pop', t1: T.seal + 1.4, out: 'lift', outDur: .3, sc: lerp(1.1, 1, sp) });
        KT.show(P.big('بنجوم الصف الرابع', PAL.goldL, 120), t, { x: 540, y: 880, t0: T.stars, in: 'pop', spring: 'pop', t1: 12.4, out: 'lift', outDur: .3 });
      }, st, { depth: .45 });
      // ── طبقة ١: إطارات ورقية (Parallax 1.0) ──
      const fr = (im, x, y, sc, rot2, al) => { g.save(); g.globalAlpha = al; g.translate(x, y); g.rotate(rot2); g.scale(sc, sc);
        g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 24; g.shadowOffsetY = 10; g.drawImage(im.c, -im.c.width / 2, -im.c.height / 2); g.restore(); };
      fr(A.frT, 540 + (st.x - 540) * .8, 30, 1.34, -.03, .6);
      fr(A.frB, 540 - (st.x - 540) * .8, H - 24, 1.34, .024, .6);
      // ── كلمات التعليق أسفل الإطار ──
      K7.voWords(1, t, { x: 540, y: 1752, size: 60, font: K7.FONTS.d, weight: 800, color: PAL.paper, maxW: 900, gap: 20,
        range: [0, 15], hiMap: { 2: PAL.goldL, 3: PAL.goldL, 8: PAL.goldL, 9: PAL.goldL, 13: PAL.goldL } });
      KT.streak(t, T.seal, { dur: .45, alpha: .3, angle: .26 });
    }
  });
})();
