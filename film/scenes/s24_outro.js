// ═══════════════════════════════════════════════════════════════════════════
//  s24 · 205.0 – 236.0 · الدعاء → الشعار الذهبي → شعار المدرسة → شعار ومض
//  VOX: نجوم ترتفع مع الدعاء · ختم الشعار على الورق · بطاقة ختامية · وسم الاستوديو.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const P = {};
  const T = { dua1: 205.6, dua2: 209.8, logo: 214.6, lock: 219.6, mubarak: 222.6, wamd: 231.2, end: 236.0 };
  INITS.push(async () => {
    P.dua = T7.G('يا ربي أسعدها وأسعد جمعنا', { size: 118, font: K7.FONTS.d, weight: 800 });
    P.mubarak = T7.G('ألف مبارك لكم', { size: 168, font: K7.FONTS.d, weight: 800 });
    P.school = T7.TX('مدرسة سبعة أكتوبر', { size: 96, color: PAL.paper, font: K7.FONTS.d, weight: 800 });
    P.g4 = T7.TX('أوائل الصف الرابع', { size: 76, color: PAL.goldL, font: K7.FONTS.d, weight: 800 });
    P.year = T7.TX('العام الدراسي ١٤٤٧ هـ', { size: 54, color: '#cfc4a8', font: K7.FONTS.u, weight: 700 });
    P.edaa = T7.TX('إهداء من مدرسة سبعة أكتوبر — أوائل الصف الرابع', { size: 46, color: PAL.navy, font: K7.FONTS.u, weight: 700 }).img;
    
  });
  cue.hero('s24-dua1', when.spring(T.dua1, 'pop'), { on: 'appear', sound: 'chime+tap' });
  cue.appear('s24-dua2', when.spring(T.dua2, 'pop'), { sound: 'shimmer' });
  cue.hero('s24-logo', when.spring(T.logo, 'snap'), { on: 'land', sound: 'thump+tap' });
  cue.appear('s24-school', when.spring(T.lock, 'card'), { sound: 'chime' });
  cue.hero('s24-mubarak', when.spring(T.mubarak, 'pop'), { on: 'appear', sound: 'thump+chime' });
  cue.move('s24-wamd', when.ease(T.wamd, T.wamd + .6), { sound: 'whoosh/fs-449992-whoosh-short-low-wav-1' });
  // ── 205.0 – 214.3 · الدعاء في السماء ──
  SHOTS.push({
    a: 205.0, b: 214.3, tin: 'flash', tdur: .3, draw: (t) => {
      const st = { x: kf(t, [[205, 540], [214.3, 556]]), y: kf(t, [[205, 900], [214.3, 810]]), s: kf(t, [[205, 1.05], [214.3, .97]]), rot: kf(t, [[205, -.004], [214.3, .01]]) };
      T7.sky(t, { y: .68, hue: '#080d1e', seed: 21, streak: kf(t, [[210, 0], [214.3, .5]]) });
      K7.parallax(() => {
        // نجوم ترتفع مع الإعادة
        const rises = [[T.dua1, 26], [T.dua2, 22]];
        rises.forEach(([t0, n], ri) => { for (let i = 0; i < n; i++) {
          const k = clamp((t - t0 - i * .09) / 2.6); if (k <= 0) return;
          const r = rng(300 + ri * 40 + i), x = 90 + r() * 900, y = 1720 - k * (900 + r() * 420);
          g.save(); g.globalAlpha = clamp(k * 3) * (1 - k * .25);
          K7.star(x, y, 10 + r() * 12, { color: r() < .3 ? PAL.goldL : '#fff6e4', shadow: 16, inner: .4, rot: r() * 3 }); g.restore();
        } });
        // شهاب
        const ks = clamp((t - T.dua2 - .3) / 1.2);
        if (ks > 0 && ks < 1) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.sin(ks * Math.PI);
          const x = lerp(900, 180, E.cubicIn(ks)), y = lerp(300, 760, E.cubicIn(ks));
          const lg = g.createLinearGradient(x, y, x + 240, y - 120); lg.addColorStop(0, 'rgba(255,246,214,.9)'); lg.addColorStop(1, 'rgba(255,246,214,0)');
          g.strokeStyle = lg; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 240, y - 120); g.stroke(); g.restore(); }
        KT.show(P.dua, t, { x: 540, y: 980, t0: T.dua1, in: 'mask', t1: T.dua2 - .3, out: 'lift', outDur: .3 });
        KT.show(P.dua, t, { x: 540, y: 980, t0: T.dua2, in: 'pop', spring: 'pop', t1: 214.0, out: 'lift', outDur: .35 });
        KT.show(P.g4, t, { x: 540, y: 1250, t0: T.dua1 + .5, in: 'rise', dist: 30, t1: 214.0, out: 'lift', outDur: .3 });
      }, st, { depth: .3 });
      K7.motes(t, { n: 24, alpha: .45, seed: 131 });
    }
  });
  // ── 214.3 – 236.0 · الخاتمة: الشعار + البطاقة + ومض ──
  SHOTS.push({
    a: 214.3, b: 236.0, tin: 'zoom', tdur: .45, focus: [540, 900], draw: (t) => {
      const kk = T7.kick(t, { decay: 6, amp: 1 });
      const st = { x: 540 + kk * 5, y: kf(t, [[214.3, 1000], [220, 940], [228, 900], [236, 940]]), s: kf(t, [[214.3, 1.06], [219, 1.0], [231, .96], [236, 1.0]]), rot: kf(t, [[214.3, .01], [224, -.004], [236, .006]]) };
      K7.parallax(() => T7.room(t, { plate: 'gold_rewards', blur: 32, dim: .8, zoom: 1.4, fy: .46, ray: true, motes: .6 }), st, { depth: .12 });
      K7.parallax(() => {
        // لوح الشهادة الفخم
        const kb = clamp((t - T.logo + .55) / .8);
        if (kb > 0) { const bw = lerp(700, 1004, E.cubicOut(kb)), bh = 1200, by = 930;
          g.save(); g.translate(540, by); g.rotate(-.006);
          g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 44; g.shadowOffsetY = 18;
          g.fillStyle = 'rgba(247,240,224,.98)'; rrect(-bw / 2, -bh / 2, bw, bh, 18, g); g.fill(); g.restore();
          g.strokeStyle = 'rgba(201,162,39,.65)'; g.lineWidth = 4; rrect(-bw / 2 + 14, -bh / 2 + 14, bw - 28, bh - 28, 14, g); g.stroke();
          g.strokeStyle = 'rgba(22,48,94,.22)'; g.lineWidth = 2; rrect(-bw / 2 + 24, -bh / 2 + 24, bw - 48, bh - 48, 12, g); g.stroke();
          // زخرفة زوايا
          [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
            g.save(); g.translate(sx * (bw / 2 - 40), sy * (bh / 2 - 40)); g.rotate(sx * sy < 0 ? 0 : Math.PI / 2 * (sx > 0 ? 1 : 0));
            g.strokeStyle = 'rgba(201,162,39,.8)'; g.lineWidth = 3;
            g.beginPath(); g.moveTo(0, 26); g.lineTo(0, 0); g.lineTo(sx > 0 ? -26 : 26, 0); g.stroke(); g.restore(); });
          K7.drawTape(T7.tape.a, -bw * .34, -bh / 2 + 8, { rot: -.38, sc: .95 });
          K7.drawTape(T7.tape.c, bw * .34, -bh / 2 + 8, { rot: .38, sc: .95 });
          g.restore(); }
        // ختم شعار المدرسة (يُهبط بقوة)
        const kl = spring(t - T.logo, 150, 19);
        if (kl > .001) {
          const sh = K7.lensShake(t, T.logo, 14, 26, 7);
          g.save(); g.globalAlpha = clamp(kl * 2); g.translate(540 + sh[0], 640 + sh[1]); g.scale(lerp(2.6, 1, kl), lerp(2.6, 1, kl)); g.rotate(-.04 + (1 - kl) * .25);
          g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 36; g.shadowOffsetY = 14;
          g.drawImage(T7.seals.logoBig, -T7.seals.logoBig.width / 2, -T7.seals.logoBig.height / 2); g.restore();
          for (let i = 0; i < 2; i++) { const kr = clamp((t - T.logo - i * .07) / .7); if (kr <= 0 || kr >= 1) continue;
            g.save(); g.globalAlpha = (1 - kr) * .45; g.strokeStyle = PAL.goldL; g.lineWidth = 8 * (1 - kr) + 2;
            g.beginPath(); g.arc(540, 640, 250 + kr * 440, 0, 7); g.stroke(); g.restore(); }
        }
        // أوائل الصف الرابع
        KT.show(T7.TX('أوائل الصف الرابع', { size: 84, color: PAL.navy, font: K7.FONTS.d, weight: 800 }), t,
          { x: 540, y: 950, t0: T.logo + .25, in: 'rise', dist: 30, t1: 235.4, out: 'lift', outDur: .3 });
        // شريط اسم المدرسة
        const kr2 = clamp((t - T.lock) / .6);
        if (kr2 > 0) { const wd = P.school.img, w0 = wd.width + 130, h0 = 116;
          g.save(); g.globalAlpha = kr2; g.translate(540, 1085); g.scale(lerp(.9, 1, E.cubicOut(kr2)), 1);
          g.save(); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 18; g.shadowOffsetY = 7;
          g.fillStyle = 'rgba(22,48,94,.97)'; rrect(-w0 / 2, -h0 / 2, w0, h0, 12, g); g.fill(); g.restore();
          g.strokeStyle = 'rgba(201,162,39,.9)'; g.lineWidth = 4; rrect(-w0 / 2 + 7, -h0 / 2 + 7, w0 - 14, h0 - 14, 9, g); g.stroke();
          K7.star(-w0 / 2 + 44, 0, 20, { color: PAL.gold, grad: true, shadow: 12 });
          K7.star(w0 / 2 - 44, 0, 20, { color: PAL.gold, grad: true, shadow: 12 });
          g.drawImage(wd, -wd.width / 2, -wd.height / 2); g.restore(); }
        // ألف مبارك لكم
        KT.show(P.mubarak, t, { x: 540, y: 1282, t0: T.mubarak, in: 'pop', spring: 'pop', t1: 235.6, out: 'lift', outDur: .3 });
        // صفّ الطلاب: ١٣ دائرة (طوابع) أسفل الشهادة
        STUDENTS.forEach((s, i) => {
          const ki = clamp((t - (T.mubarak + .8 + i * .06)) / .5); if (ki <= .004) return;
          const px = 540 + (i - (STUDENTS.length - 1) / 2) * 72, py = 1470;
          const im = A['p_' + s.id]; if (!im) return;
          g.save(); g.globalAlpha = clamp(ki * 2); g.translate(px, py + (1 - ki) * 20); g.scale(ki, ki);
          g.beginPath(); g.arc(0, 0, 30, 0, 7); g.save();
          g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 10; g.shadowOffsetY = 4; g.fillStyle = '#efe5cc'; g.fill(); g.restore();
          g.save(); g.clip();
          const sc2 = Math.max(62 / im.width, 62 / im.height) * 1.15, w2 = im.width * sc2, h2 = im.height * sc2;
          g.drawImage(im, -w2 / 2, -h2 * .42, w2, h2); g.restore();
          g.strokeStyle = i < 3 ? PAL.goldL : 'rgba(201,162,39,.85)'; g.lineWidth = i < 3 ? 4 : 3; g.beginPath(); g.arc(0, 0, 30, 0, 7); g.stroke(); g.restore();
        });
        // العام الدراسي
        KT.show(P.year, t, { x: 540, y: 1590, t0: T.mubarak + 1.2, in: 'rise', dist: 22, t1: 235.6, out: 'lift', outDur: .3 });
        K7.confetti(t, T.mubarak, { x: 540, y: 1280, n: 70, power: 1.15, spread: 2.6, seed: 199, grav: 560, dur: 3.4 });
      }, st, { depth: .4 });
      K7.motes(t, { n: 22, alpha: .4, seed: 141 });
      KT.streak(t, T.logo, { dur: .5, alpha: .28, angle: .26 });
      // ── ومض: لقطة كاملة الشاشة (المصدر 9:16) ──
      if (t > T.wamd - .85) {
        const kw = clamp((t - T.wamd + .85) / .85);
        T7.wamdDraw(clamp((t - T.wamd) / 4.9), { alpha: kw, zoom: lerp(1.05, 1, clamp((t - T.wamd) / 1.6)) });
        const kf2 = clamp((t - T.wamd - 2.1) / .7);
        if (kf2 > 0) { const wd = P.edaa; if (wd) { g.save(); g.globalAlpha = kf2 * .97; g.translate(540, 1832);
          const w0 = Math.min(1010, wd.width + 76), h0 = 96;
          g.save(); g.shadowColor = 'rgba(0,0,0,.25)'; g.shadowBlur = 16; g.restore();
          g.fillStyle = 'rgba(255,252,244,.9)'; rrect(-w0 / 2, -h0 / 2, w0, h0, 12, g); g.fill();
          g.strokeStyle = 'rgba(201,162,39,.75)'; g.lineWidth = 3; rrect(-w0 / 2 + 6, -h0 / 2 + 6, w0 - 12, h0 - 12, 9, g); g.stroke();
          g.drawImage(wd, -wd.width / 2, -wd.height / 2); g.restore(); } }
      }
    }
  });
})();
