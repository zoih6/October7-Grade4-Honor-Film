// ═══════════════════════════════════════════════════════════════════════════
//  s05 · 55.45 – 70.45 · الأستاذة سارة القاسمي — «غرست في قلوب طلابها حب العلم»
//  VOX: شتلة تنمو · أوراق بأسماء الطلاب الـ١٣ تتفتّح على الأغصان · ضوء دافئ · اسم بحرف كبير
//       ثم: سماء نجوم «إلى نجومنا الصغار» وكوكبة بأناملهم.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const V = (li, i) => VO_WORDS[li].words[i].t + VO_OFFSET;
  const W5 = VO_WORDS[15].words || [];
  const W6 = VO_WORDS[16].words || [];
  const T = { grow: 55.75, name: V(15, 4) - .06, leaves: V(15, 8), glow: V(15, 14), kids: V(16, 1) - .06, wish: V(16, 7) - .06 };
  const P = {};
  INITS.push(async () => {
    STUDENTS.forEach((s) => T7.TX(s.first, { size: 46, color: PAL.navy, font: K7.FONTS.d, weight: 800 }));
    P.leafSheets = STUDENTS.map((s, i) => K7.sheet({ w: 250, h: 96, seed: 200 + i, rough: 9, tone: 1, res: .8 }));
    P.big = (txt, col, size) => T7.TX(txt, { size: size || 132, color: col || PAL.goldL, font: K7.FONTS.d, weight: 800 });
  });
  cue.move('s05-grow', when.ease(T.grow, T.grow + 1.4), { sound: 'shimmer' });
  cue.hero('s05-name', when.spring(T.name, 'pop'), { on: 'appear', sound: 'chime+tap' });
  STUDENTS.forEach((s, i) => { if (i % 3) return; cue.appear('s05-leaf' + i, when.spring(T.leaves + i * .12, 'card'), { sound: 'paper', pitch: (i % 3) }); });
  cue.hero('s05-glow', when.spring(T.glow, 'card'), { on: 'land', sound: 'thump+tap' });
  cue.cut('s05-sky', T.kids - .3, { sound: 'transition' });
  cue.appear('s05-wish', when.spring(T.wish, 'pop'), { sound: 'chime' });

  // شجرة الأستاذة: ساق + أغصان + أوراق بأسماء الطلاب
  function tree(t, cx, baseY, k, leafK) {
    g.save();
    const pts = [[cx, baseY], [cx - 10, baseY - 220], [cx + 16, baseY - 420], [cx - 6, baseY - 620], [cx + 10, baseY - 800]];
    K7.goldPath(pts, clamp(k * 1.15), { width: 20, color: '#8a6524', glow: 10 });
    // الأغصان
    for (let i = 0; i < 8; i++) { const kk = clamp((k - .3 - i * .05) * 4); if (kk <= 0) continue;
      const side = i % 2 ? 1 : -1, y0 = baseY - 240 - i * 84, len = 250 - i * 14;
      K7.goldPath([[cx + 8, y0], [cx + side * len * .5, y0 - 40], [cx + side * len * kk, y0 - 96 - i * 8]], 1, { width: 11, color: '#8a6524' }); }
    // الأوراق (قصاصات أسماء)
    if (leafK > 0) STUDENTS.forEach((s, i) => {
      const k2 = clamp((leafK - i * .055) * 4); if (k2 <= .01) return;
      const side = i % 2 ? 1 : -1, y0 = baseY - 300 - i * 66, x0 = clamp(cx + side * (168 + (i % 3) * 52), 176, 904);
      const wd = T7.TX(s.first, { size: 46 }), im = wd.img;
      g.save(); g.globalAlpha = clamp(k2 * 2) * .96; g.translate(x0, y0 + (1 - k2) * 30); g.rotate(side * .06 + (1 - k2) * .2);
      g.save(); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 12; g.shadowOffsetY = 5;
      g.fillStyle = 'rgba(248,241,224,.95)'; rrect(-im.width / 2 - 14, -im.height / 2 - 6, im.width + 28, im.height + 12, 8, g); g.fill(); g.restore();
      g.strokeStyle = s.tied ? 'rgba(14,124,107,.6)' : 'rgba(201,162,39,.75)'; g.lineWidth = 2;
      rrect(-im.width / 2 - 14, -im.height / 2 - 6, im.width + 28, im.height + 12, 8, g); g.stroke();
      g.drawImage(im, -im.width / 2, -im.height / 2); g.restore();
    });
    g.restore();
  }

  // ── 55.45 – 65.45 · لحظة المربية ──
  SHOTS.push({
    a: 55.45, b: 65.45, tin: 'paperTear', tdur: .6, draw: (t) => {
      const st = { x: kf(t, [[55.45, 540], [62, 566], [65.45, 560]]), y: kf(t, [[55.45, 980], [62, 940], [65.45, 960]]), s: kf(t, [[55.45, 1.02], [62, 1.0], [65.45, 1.05]]), rot: kf(t, [[55.45, .01], [65.45, -.006]]) };
      K7.parallax(() => T7.room(t, { plate: 'classroom_light', blur: 30, dim: .76, zoom: 1.36, fy: .5, ray: true, motes: .7 }), st, { depth: .14 });
      K7.parallax(() => {
        // ضوء دافئ يتسع
        const kg = clamp((t - T.grow) / 1.3);
        g.save(); g.globalCompositeOperation = 'lighter';
        const rg = g.createRadialGradient(540, 900, 40, 540, 900, lerp(300, 900, kg));
        rg.addColorStop(0, `rgba(255,226,160,${.3 * kg})`); rg.addColorStop(1, 'rgba(255,200,110,0)');
        g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
        tree(t, 540, 1500, clamp((t - T.grow) / 1.6), clamp((t - T.leaves) / 2.6));
        // الاسم
        KT.show(P.big('الأستاذة سارة القاسمي', PAL.goldL, 98), t, { x: 540, y: 356, t0: T.name, in: 'pop', spring: 'pop', t1: 65.0, out: 'lift', outDur: .3 });
        // بيت شعر: «غرست في قلوب طلابها حب العلم»
        K7.voWords(15, t, { x: 540, y: 1680, size: 62, font: K7.FONTS.u, weight: 700, color: PAL.paper, maxW: 920, gap: 18, within: [57.5, 61.5], hiMap: { 0: PAL.goldL } });
        K7.voWords(15, t, { x: 540, y: 112, size: 50, font: K7.FONTS.u, weight: 700, color: '#e6dcc2', maxW: 940, gap: 16, within: [55.45, 57.4] });
        K7.confetti(t, T.glow, { x: 540, y: 900, n: 30, power: .8, spread: 2.6, seed: 77, grav: 560, dur: 2.4, size: .8 });
      }, st, { depth: .44 });
      K7.motes(t, { n: 26, alpha: .5, seed: 51 });
      KT.streak(t, T.glow, { dur: .5, alpha: .3, angle: .24 });
    }
  });
  // ── 65.45 – 70.45 · نجومنا الصغار ──
  SHOTS.push({
    a: 65.45, b: 70.45, tin: 'iris', tdur: .55, focus: [540, 800], draw: (t) => {
      const st = { x: kf(t, [[65.45, 540], [70.45, 560]]), y: kf(t, [[65.45, 900], [70.45, 830]]), s: kf(t, [[65.45, 1.06], [70.45, .98]]), rot: kf(t, [[65.45, -.004], [70.45, .008]]) };
      T7.sky(t, { y: .66, hue: '#0a1024', seed: 5, streak: kf(t, [[66.2, 0], [70.45, .45]]) });
      K7.parallax(() => {
        // كوكبة: ١٣ نجمة بأسماء (خطوط تربطها)
        const kk = clamp((t - T.kids) / 1.4);
        const pos = STUDENTS.map((s, i) => { const a = i / 13 * Math.PI * 2 + 1.2, r = 300 + (i % 4) * 46; return [540 + Math.cos(a) * r, 900 + Math.sin(a) * r * .72]; });
        if (kk > 0) { g.save(); g.globalAlpha = clamp(kk * 1.5) * .5; g.strokeStyle = 'rgba(180,205,255,.5)'; g.lineWidth = 1.6; g.setLineDash([8, 12]);
          g.beginPath(); pos.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke(); g.setLineDash([]); g.restore(); }
        pos.forEach(([x, y], i) => {
          const k2 = clamp((kk - i * .05) * 4); if (k2 <= .01) return;
          K7.star(x, y, 12 * k2 + 4, { color: i < 3 ? PAL.goldL : '#fff6e0', shadow: 20, inner: .4, rot: -.4 + i });
          if (i % 3 === 0) { const wd = T7.TX(STUDENTS[i].first, { size: 40 }), im = wd.img;
            g.save(); g.globalAlpha = clamp(k2 * 2) * .9; g.drawImage(im, x - im.width / 2, y + 22); g.restore(); }
        });
        KT.show(P.big('إلى نجومنا الصغار', PAL.goldL, 118), t, { x: 540, y: 320, t0: T.kids, in: 'pop', spring: 'pop', t1: 70.2, out: 'lift', outDur: .3 });
        KT.show(P.big('أنتم فخر اليوم وأمل الغد', '#f6eeda', 96), t, { x: 540, y: 1500, t0: T.wish, in: 'mask', t1: 70.3, out: 'lift', outDur: .3 });
        K7.voWords(16, t, { x: 540, y: 120, size: 50, font: K7.FONTS.u, weight: 700, color: '#dfe6f7', maxW: 940, gap: 16, within: [65.45, 67.6] });
        K7.voWords(16, t, { x: 540, y: 1800, size: 52, font: K7.FONTS.u, weight: 700, color: '#dfe6f7', maxW: 940, gap: 16, within: [67.7, 70.45] });
      }, st, { depth: .38 });
      K7.motes(t, { n: 22, alpha: .4, seed: 61 });
    }
  });
})();
