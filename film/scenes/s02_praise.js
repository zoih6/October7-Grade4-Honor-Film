// ═══════════════════════════════════════════════════════════════════════════
//  s02 · 13.55 – 19.90 · «ومن الطموح بداية لمستقبل مشرق» → «نبارك لأوائل الصف الرابع…»
//  VOX: شمس الفجر ترتفع مع الكلمات · لافتة ورقية تُفتح · شريط ذهبي + إكليل + دفعة نحو النجمة.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const L1 = VO_WORDS[1].words.map((w) => w.t + VO_OFFSET), L2 = VO_WORDS[2].words.map((w) => w.t + VO_OFFSET);
  const T = { dawn: 13.55, sun: L1[18] - .05, band: 15.60, ribbon: L2[2] + .1, laurel: L2[4] + .05, push: L2[7] };
  const P = {};
  INITS.push(async () => {
    A.rb2 = K7.ribbonCanvas('أوائل الصف الرابع', { size: 86, tone: 'gold', font: K7.FONTS.b, weight: 800, padX: 70, tail: 50 });
    P.big = (txt, col, size) => T7.TX(txt, { size: size || 130, color: col || PAL.navy, font: K7.FONTS.d, weight: 800 });
  });
  cue.move('s02-dawn', when.ease(13.55, 14.6), { sound: 'riser' });
  cue.appear('s02-sun', when.spring(T.sun, 'pop'), { sound: 'chime' });
  cue.cut('s02-band', T.band, { sound: 'transition' });
  cue.hero('s02-ribbon', when.spring(T.ribbon, 'card'), { on: 'land', sound: 'thump+tap' });
  cue.appear('s02-laurel', when.spring(T.laurel + .3, 'card'), { sound: 'shimmer' });
  cue.move('s02-push', when.ease(T.push, T.push + 1.1), { sound: 'whoosh/fs-449994-whoosh-med-mid-wav-1' });
  cue.raw('s02-rise', Math.round((T.push + .95) * 30), { sound: 'riser', align: 'peak' });

  // ── 13.55 – 15.60 · فجر ──
  SHOTS.push({
    a: 13.55, b: 15.60, tin: 'iris', tdur: .55, focus: [540, 900], draw: (t) => {
      const st = { x: kf(t, [[13.55, 560], [15.6, 620]]), y: kf(t, [[13.55, 900], [15.6, 820]]), s: kf(t, [[13.55, 1.05], [15.6, .98]]), rot: kf(t, [[13.55, -.004], [15.6, .008]]) };
      T7.sky(t, { y: .62, hue: '#0a1022', streak: kf(t, [[L1[19], 0], [15.6, .5]]), seed: 8 });
      K7.parallax(() => {
        // شمس الفجر ترتفع وتُرسم مع الكلمات
        const kd = clamp((t - T.dawn) / 1.4), sy = lerp(1520, 1180, E.cubicOut(kd)), sr = lerp(70, 190, E.cubicOut(kd));
        g.save(); g.globalCompositeOperation = 'lighter';
        const rg = g.createRadialGradient(600, sy, 4, 600, sy, sr * 3.4);
        rg.addColorStop(0, `rgba(255,246,214,${.95 * kd})`); rg.addColorStop(.2, `rgba(255,214,130,${.7 * kd})`);
        rg.addColorStop(.55, `rgba(255,170,70,${.2 * kd})`); rg.addColorStop(1, 'rgba(255,150,60,0)');
        g.fillStyle = rg; g.beginPath(); g.arc(600, sy, sr * 3.4, 0, 7); g.fill();
        g.fillStyle = `rgba(255,250,230,${.95 * kd})`; g.beginPath(); g.arc(600, sy, sr, 0, 7); g.fill(); g.restore();
        // أفق المدينة
        g.save(); g.globalAlpha = .92; const r = rng(31);
        for (let i = 0; i < 13; i++) { const bx = i * 88 - 60 + r() * 30, bw = 44 + r() * 58, bh = 30 + r() * 100;
          const gr2 = g.createLinearGradient(0, 1250 - bh, 0, 1300); gr2.addColorStop(0, '#1b1930'); gr2.addColorStop(1, '#0d0b18');
          g.fillStyle = gr2; g.fillRect(bx, 1250 - bh, bw, bh + 60);
          g.fillStyle = 'rgba(255,206,140,.45)';
          for (let w2 = 0; w2 < 5; w2++) { if (r() > .5) continue; g.fillRect(bx + 8 + r() * (bw - 18), 1258 - bh + 12 + r() * (bh - 24), 7, 10); } }
        g.restore();
        g.save(); g.filter = 'blur(8px)'; g.globalAlpha = .55; g.fillStyle = '#080c1c'; g.fillRect(-20, 1300, W + 40, H - 1300); g.restore();
        // خط الأفق الذهبي يُرسم
        K7.goldPath([[90, 1272], [990, 1272]], clamp((t - 14.2) / .9), { width: 5, color: 'rgba(255,226,160,.85)', glow: 18 });
        // طائرة صغيرة
        const kk = clamp((t - 13.9) / 1.7); if (kk > 0 && kk < 1) { const e = E.sineInOut(kk);
          K7.drawKite(lerp(-120, W + 200, e), lerp(430, 300, e) + Math.sin(e * 5) * 18, .4, -.3, t, { tail: .5, alpha: .8 }); }
        K7.motes(t, { n: 18, alpha: .3, seed: 12 });
      }, st, { depth: .3 });
      // كلمات «ومن الطموح بداية لمستقبل مشرق»
      K7.voWords(1, t, { x: 540, y: 620, size: 86, font: K7.FONTS.d, weight: 800, color: PAL.paper, maxW: 880, gap: 24,
        range: [16, 20], hiMap: { 18: PAL.goldL, 20: PAL.goldL } });
      KT.streak(t, L1[19], { dur: .5, alpha: .3, angle: .3 });
    }
  });

  // ── 15.60 – 19.90 · اللافتة والشريط والدفعة ──
  SHOTS.push({
    a: 15.60, b: 19.90, tin: 'band', tdur: .5, accent: PAL.navy, draw: (t) => {
      const sc = kf(t, [[15.6, 1.05], [17.6, 1.0], [19.9, 1.3]]);
      const cx = kf(t, [[15.6, 540], [18.6, 556], [19.9, 590]]);
      const cy = kf(t, [[15.6, .54 * H], [17.8, .52 * H], [19.9, .42 * H]]);
      const st = { x: cx, y: cy, s: sc, rot: kf(t, [[15.6, -.006], [19.9, .018]]) };
      K7.parallax(() => T7.room(t, { plate: 'classroom_light', blur: 28, dim: .72, zoom: 1.34, fy: .46, ray: true, motes: .6 }), st, { depth: .16 });
      K7.parallax(() => {
        // اللافتة الورقية
        const kb = clamp((t - T.band) / .6);
        if (kb > 0) { const bw = lerp(620, 1060, E.cubicOut(kb)), bh = 640;
          g.save(); g.translate(540, cy); g.rotate(-.008);
          g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 34; g.shadowOffsetY = 14;
          g.fillStyle = 'rgba(246,238,218,.965)'; rrect(-bw / 2, -bh / 2, bw, bh, 16, g); g.fill(); g.restore();
          g.strokeStyle = 'rgba(201,162,39,.55)'; g.lineWidth = 3; rrect(-bw / 2 + 18, -bh / 2 + 18, bw - 36, bh - 36, 12, g); g.stroke();
          K7.drawTape(T7.tape.a, -bw * .38, -bh / 2 + 6, { rot: -.35, sc: .95 });
          K7.drawTape(T7.tape.c, bw * .38, -bh / 2 + 6, { rot: .35, sc: .95 });
          g.restore(); }
        // توهّج
        g.save(); g.globalCompositeOperation = 'lighter';
        const rg = g.createRadialGradient(540, cy, 40, 540, cy, 780);
        rg.addColorStop(0, 'rgba(255,222,150,.2)'); rg.addColorStop(1, 'rgba(255,210,140,0)');
        g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
        // الشريط الذهبي + الإكليل
        const kr = spring(t - T.ribbon, 150, 19);
        if (kr > .001) { K7.drawRibbon(A.rb2, 540, cy + 118, { k: kr, sc: .84, rot: -.008 });
          K7.confetti(t, T.ribbon + .12, { x: 540, y: cy + 60, n: 54, power: 1.05, spread: 2.2, seed: 63, grav: 640, dur: 2.8 }); }
        const kl = clamp((t - T.laurel) / 1.5);
        if (kl > 0) K7.laurel(540, cy + 118, 330, kl, { color: PAL.goldD, leaves: 11, w: 7, alpha: .85 });
        // نجمة تتضخّم مع الدفعة
        const kg = clamp((t - T.push) / 1.1);
        if (kg > 0) K7.star(540, cy - 280 - kg * 30, lerp(50, 320, E.cubicIn(kg)), { color: PAL.gold, grad: true, shadow: 30 + kg * 70, inner: .42 });
        // كلمات
        K7.voWords(2, t, { x: 540, y: cy - 66, size: 78, font: K7.FONTS.d, weight: 800, color: PAL.navy, maxW: 780, gap: 22,
          range: [0, 6], hiMap: { 1: PAL.goldD, 3: PAL.navy, 6: PAL.teal } });
        K7.voWords(2, t, { x: 540, y: cy + 336, size: 86, font: K7.FONTS.d, weight: 800, color: PAL.goldD, maxW: 800, gap: 24, range: [7, 10] });
      }, st, { depth: .42 });
      K7.motes(t, { n: 20, alpha: .4, seed: 21 });
    }
  });
})();
