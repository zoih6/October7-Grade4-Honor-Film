// ═══════════════════════════════════════════════════════════════════════════
//  s23 · 183.0 – 205.0 · لازمة الاحتفال (مرور الكاميرا على الشريط) + أبيات الأستاذة سارة
//  VOX: رصيف بطاقات (Dolly) · شجرة الأسماء · كلمات الأغنية تُكتب على الإيقاع.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const P = {};
  const T = { rail: 183.2, teach: 192.1, tree: 192.8, leaves: 194.2 };
  INITS.push(async () => {
    STUDENTS.forEach((s) => T7.TX(s.first, { size: 44, color: PAL.navy, font: K7.FONTS.d, weight: 800 }));
    P.tname = T7.G('أستاذة سارة', { size: 150, font: K7.FONTS.d, weight: 800 });
    P.tfam = T7.TX('من آل قاسم فضلها باق لنا', { size: 78, color: PAL.navy, font: K7.FONTS.d, weight: 800 });
  });
  cue.move('s23-rail', when.spring(T.rail, 'card'), { sound: 'whoosh/fs-449994-whoosh-med-mid-wav-1' });
  cue.move('s23-dolly', when.ease(184.5, 191.5), { sound: 'swish' });
  cue.hero('s23-teach', when.spring(T.teach, 'snap'), { on: 'land', sound: 'thump+tap' });
  cue.appear('s23-tree', when.spring(T.tree, 'card'), { sound: 'shimmer' });
  STUDENTS.forEach((s, i) => { if (i % 3) return; cue.appear('s23-l' + i, when.spring(T.leaves + i * .1, 'card'), { sound: 'paper', pitch: i % 3 }); });
  (typeof SONG_BARS !== 'undefined' ? SONG_BARS.filter((b) => b > 183 && b < 192) : []).forEach((b, i) => { if (i % 2) return; cue.appear('s23-b' + i, b, { sound: 'pop', pan: ((i % 4) / 3 - .5) * .7 }); });

  // رصيف البطاقات: ١٣ بطاقة على خطّ واحد تمرّ الكاميرا عليه
  function rail(t, t0) {
    const total = STUDENTS.length;
    STUDENTS.forEach((s, i) => {
      const x = 320 + i * 372, y = 1000 + (i % 2 ? -26 : 26);
      const k = spring(t - (t0 + i * .05), 260, 24); if (k <= .002) return;
      const cl = T7.cards[s.id];
      // نجمة صغيرة أعلى كل بطاقة (خارج تحويل البطاقة)
      const kst = clamp((t - (t0 + i * .05)) / .5);
      if (kst > .01) { g.save(); g.globalAlpha = clamp(kst * 2) * .95;
        K7.star(x, y - 486, 22 + Math.sin(t * 2 + i) * 2.5, { color: i < 3 ? PAL.goldL : PAL.gold, grad: true, shadow: 16, inner: .42 });
        g.restore(); }
      g.save(); g.globalAlpha = clamp(k * 2); g.translate(x, y + (1 - k) * 70); g.rotate((i % 2 ? .05 : -.05) + (1 - k) * .18); g.scale(.78, .78);
      g.save(); g.shadowColor = 'rgba(12,6,0,.55)'; g.shadowBlur = 30; g.shadowOffsetY = 14; g.drawImage(cl.c, -cl.c.width / 2, -cl.c.height / 2); g.restore();
      g.restore();
    });
  }
  SHOTS.push({
    a: 183.0, b: 192.1, tin: 'tapeZip', tdur: .55, draw: (t) => {
      const kk = T7.kick(t, { decay: 6, amp: 1 });
      // الكاميرا تتحرك أفقيًا على الرصيف (Dolly)
      const camX = kf(t, [[183, 300], [185.5, 900], [188, 1650], [190.5, 2400], [192.1, 3000]]);
      const st = { x: camX, y: kf(t, [[183, 1000], [192.1, 1010]]) + kk * -6, s: kf(t, [[183, .92], [192.1, .86]]) + kk * .01, rot: kf(t, [[183, .01], [192.1, -.008]]) };
      K7.parallax(() => T7.room(t, { plate: 'gold_rewards', blur: 30, dim: .74, zoom: 1.42, fy: .48, ray: true, motes: .6 }), st, { depth: .12 });
      K7.parallax(() => {
        // خط الرصيف الذهبي
        K7.goldPath([[0, 1290], [W * 6, 1290]], 1, { width: 10, color: 'rgba(201,162,39,.6)', glow: 10 });
        rail(t, T.rail);
        // كلمات اللازمة
        T7.lyric('أكتوبر غنى بأفراح لنا', t, { x: 540, y: 340, size: 100, from: 183.2, to: 187.4, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [0], maxW: 920, gap: 26 });
        T7.lyric('والصف رابع صار نجما بيننا', t, { x: 540, y: 1780, size: 80, from: 187.6, to: 191.8, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [4, 5], maxW: 920, gap: 22 });
      }, st, { depth: .5 });
      K7.motes(t, { n: 20, alpha: .45, seed: 111 });
      if (kk > .5) KT.streak(t, t, { dur: .16, alpha: kk * .16, angle: .24 });
    }
  });
  SHOTS.push({
    a: 192.1, b: 205.0, tin: 'iris', tdur: .5, focus: [540, 900], draw: (t) => {
      const kk = T7.kick(t, { decay: 7, amp: 1 });
      const st = { x: kf(t, [[192.1, 540], [205, 546]]) + kk * 5, y: kf(t, [[192.1, 1000], [199, 930], [205, 960]]), s: kf(t, [[192.1, 1.04], [205, .98]]), rot: kf(t, [[192.1, -.006], [205, .008]]) };
      K7.parallax(() => T7.room(t, { plate: 'classroom_light', blur: 30, dim: .76, zoom: 1.38, fy: .5, ray: true, motes: .7 }), st, { depth: .13 });
      K7.parallax(() => {
        // ضوء دافئ
        const kg = clamp((t - T.teach) / 1.2);
        g.save(); g.globalCompositeOperation = 'lighter';
        const rg = g.createRadialGradient(540, 900, 40, 540, 900, lerp(320, 940, kg));
        rg.addColorStop(0, `rgba(255,228,164,${.28 * kg})`); rg.addColorStop(1, 'rgba(255,200,110,0)');
        g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
        // الشجرة الذهبية بأسماء الطلاب
        const kg2 = clamp((t - T.tree) / 1.6);
        const pts = [[540, 1560], [528, 1320], [556, 1080], [532, 850], [548, 640]];
        K7.goldPath(pts, clamp(kg2 * 1.1), { width: 18, color: '#8a6524', glow: 10 });
        for (let i = 0; i < 8; i++) { const kk2 = clamp((kg2 - .3 - i * .05) * 4); if (kk2 <= 0) continue;
          const side = i % 2 ? 1 : -1, y0 = 1330 - i * 92, len = 240 - i * 16;
          K7.goldPath([[548, y0], [548 + side * len * .5, y0 - 44], [548 + side * len * kk2, y0 - 104]], 1, { width: 10, color: '#8a6524' }); }
        const leafK = clamp((t - T.leaves) / 2.6);
        STUDENTS.forEach((s, i) => {
          const k2 = clamp((leafK - i * .052) * 4); if (k2 <= .01) return;
          const side = i % 2 ? 1 : -1, x0 = Math.min(892, Math.max(188, 548 + side * (170 + (i % 3) * 54))), y0 = 1340 - i * 66;
          const im = T7.TX(s.first, { size: 44 }).img;
          g.save(); g.globalAlpha = clamp(k2 * 2) * .96; g.translate(x0, y0 + (1 - k2) * 26); g.rotate(side * .05 + (1 - k2) * .18);
          g.save(); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 12; g.shadowOffsetY = 5;
          g.fillStyle = 'rgba(248,241,224,.95)'; rrect(-im.width / 2 - 14, -im.height / 2 - 6, im.width + 28, im.height + 12, 8, g); g.fill(); g.restore();
          g.strokeStyle = s.tied ? 'rgba(14,124,107,.6)' : 'rgba(201,162,39,.75)'; g.lineWidth = 2;
          rrect(-im.width / 2 - 14, -im.height / 2 - 6, im.width + 28, im.height + 12, 8, g); g.stroke();
          g.drawImage(im, -im.width / 2, -im.height / 2); g.restore();
        });
        // اسمها الكبير
        KT.show(P.tname, t, { x: 540, y: 330, t0: T.teach, in: 'pop', spring: 'pop', t1: 205, out: 'lift', outDur: .3 });
        // بيتا الأغنية
        T7.lyric('أستاذة سارة تنور صفنا', t, { x: 540, y: 1660, size: 80, from: 192.3, to: 196.6, color: PAL.paper, hi: PAL.goldL, hiIdx: [0, 1], maxW: 940, gap: 22 });
        KT.show(P.tfam, t, { x: 540, y: 1800, t0: 196.9, in: 'mask', t1: 205, out: 'lift', outDur: .3 });
        T7.lyric('زرعت بحب درسنا في قلبنا', t, { x: 540, y: 120, size: 62, from: 201.1, to: 205, color: '#f0e6cc', hi: PAL.goldL, hiIdx: [1, 5], maxW: 940, gap: 18 });
        K7.confetti(t, T.teach, { x: 540, y: 900, n: 34, power: .85, spread: 2.6, seed: 177, grav: 560, dur: 2.6, size: .8 });
      }, st, { depth: .44 });
      K7.motes(t, { n: 24, alpha: .5, seed: 121 });
    }
  });
})();
