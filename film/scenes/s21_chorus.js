// ═══════════════════════════════════════════════════════════════════════════
//  s21 · 112.0 – 130.0 · «أكتوبر غنى بأفراح لنا … والص�� رابع صار نجما بيننا» ×٢
//  VOX: جدار القصاصات الـ١٣ يُبنى · الكلمات تُكتب على الإيقاع · انسحاب كاميرا يوسّع المشهد.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const P = {};
  const T = { wall: 112.1, l1: 112.35, l2: 116.35, pull: 120.6, wall2: 120.75, star: 125.3, end: 130.0 };
  INITS.push(async () => {
    P.title = T7.G('أكتوبر غنى', { size: 130, font: K7.FONTS.d, weight: 800 });
    P.sub = T7.TX('بأفراح لنا', { size: 104, color: PAL.navy, font: K7.FONTS.d, weight: 800 });
    P.l2 = T7.TX('والصف رابع صار نجما بيننا', { size: 96, color: PAL.navy, font: K7.FONTS.d, weight: 800 });
    P.flag = T7.TX('مدرسة سبعة أكتوبر', { size: 62, color: PAL.goldL, font: K7.FONTS.b, weight: 800 });
  });
  cue.move('s21-wall', when.spring(T.wall, 'card'), { sound: 'whoosh/fs-449992-whoosh-short-low-wav-1' });
  cue.hero('s21-title', when.spring(T.l1, 'pop'), { on: 'appear', sound: 'thump+tap' });
  cue.move('s21-pull', when.ease(T.pull, T.pull + 1.1), { sound: 'swish' });
  cue.hero('s21-star', when.spring(T.star, 'snap'), { on: 'land', sound: 'thump+chime' });
  (typeof SONG_BARS !== 'undefined' ? SONG_BARS.filter((b) => b > 112 && b < 130) : []).forEach((b, i) => {
    if (i % 2) return; cue.appear('s21-b' + i, b, { sound: 'pop', pan: ((i % 5) / 4 - .5) * .6 });
  });
  SHOTS.push({
    a: 112.0, b: 130.0, tin: 'paperTear', tdur: .6, draw: (t) => {
      const kk = T7.kick(t, { decay: 6, amp: 1 });
      const pull = kf(t, [[112, 1.06], [120, 1.02], [T.pull, 1.02], [124.5, .82], [130, .9]]);
      const st = { x: 540 + kk * 8, y: kf(t, [[112, 1000], [120, 960], [124.5, 1000], [130, 980]]) + kk * -6, s: pull + kk * .01, rot: kf(t, [[112, -.006], [122, .006], [130, -.008]]) };
      K7.parallax(() => T7.room(t, { plate: 'classroom_light', blur: 30, dim: .72, zoom: 1.4, fy: .48, ray: true, motes: .65 }), st, { depth: .12 });
      K7.parallax(() => {
        // جدار القصاصات (٤ أعمدة × ٤ صفوف)
        T7.collage(t, { x: 540, y: 1000, sc: 1, t0: T.wall, cols: 4, wCard: 210, gap: 18, rot: -.008 });
        // لافتة المدرسة (وسم صغير أعلى الشاشة)
        const wd = P.flag.img, w0 = wd.width + 80, h0 = wd.height + 40;
        const kf2 = clamp((t - 112.4) / .7) * (1 - clamp((t - 129.4) / .6));
        if (kf2 > 0) { g.save(); g.globalAlpha = kf2; g.translate(540, 268); const kfl = lerp(1.2, 1, clamp((t - 112.4) / .7)); g.scale(kfl, kfl);
          g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 22; g.shadowOffsetY = 8;
          g.fillStyle = 'rgba(18,40,82,.96)'; rrect(-w0 / 2, -h0 / 2, w0, h0, 12, g); g.fill(); g.restore();
          g.strokeStyle = 'rgba(201,162,39,.9)'; g.lineWidth = 4; rrect(-w0 / 2 + 8, -h0 / 2 + 8, w0 - 16, h0 - 16, 9, g); g.stroke();
          g.drawImage(wd, -wd.width / 2, -wd.height / 2); g.restore(); }
        // الكلمات (كتبة متزامنة)
        T7.lyric('أكتوبر غنّى بأفراح لنا', t, { x: 540, y: 1560, size: 104, from: T.l1, to: T.l2 - .15, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [0], maxW: 900, gap: 28 });
        T7.lyric('والصف رابع صار نجمان بيننا', t, { x: 540, y: 1730, size: 82, from: T.l2, to: 120.6, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [4, 5], maxW: 920, gap: 22 });
        T7.lyric('أكتوبر غنّى بأفراح لنا', t, { x: 540, y: 1560, size: 104, from: T.wall2, to: 125.2, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [0], maxW: 900, gap: 28 });
        T7.lyric('والصف رابع صار نجمان بيننا', t, { x: 540, y: 1730, size: 82, from: T.star, to: 129.6, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [4, 5], maxW: 920, gap: 22 });
        // التاج/النجمة المركزية في الإعادة الثانية
        const kstar = spring(t - T.star, 320, 24);
        if (kstar > .002) {
          g.save(); g.globalAlpha = clamp(kstar * 2.5); g.translate(540, 1006); g.scale(lerp(.3, 1, kstar), lerp(.3, 1, kstar));
          g.save(); g.globalCompositeOperation = 'lighter';
          const rg = g.createRadialGradient(0, 0, 20, 0, 0, 700); rg.addColorStop(0, 'rgba(255,232,170,.5)'); rg.addColorStop(1, 'rgba(255,210,120,0)');
          g.fillStyle = rg; g.fillRect(-700, -700, 1400, 1400); g.restore();
          K7.star(0, 0, 176, { color: PAL.gold, grad: true, shadow: 46, inner: .44 });
          g.strokeStyle = 'rgba(255,246,214,.85)'; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 216, 0, 7); g.stroke();
          K7.star(0, 0, 176 * .55, { color: '#fff8e6', shadow: 0, inner: .44, rot: -.35 }); g.restore();
          K7.confetti(t, T.star, { x: 540, y: 1000, n: 60, power: 1.1, spread: 2.4, seed: 161, grav: 600, dur: 3.0 });
        }
        // الكلمات (كتبة متزامنة)
        T7.lyric('أكتوبر غنّى بأفراح لنا', t, { x: 540, y: 1560, size: 104, from: T.l1, to: T.l2 - .15, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [0], maxW: 900, gap: 28 });
        T7.lyric('والصف رابع صار نجمان بيننا', t, { x: 540, y: 1730, size: 82, from: T.l2, to: 120.6, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [4, 5], maxW: 920, gap: 22 });
        T7.lyric('أكتوبر غنّى بأفراح لنا', t, { x: 540, y: 1560, size: 104, from: T.wall2, to: 125.2, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [0], maxW: 900, gap: 28 });
        T7.lyric('والصف رابع صار نجمان بيننا', t, { x: 540, y: 1730, size: 82, from: T.star, to: 129.6, color: '#f6ecd4', hi: PAL.goldL, hiIdx: [4, 5], maxW: 920, gap: 22 });
        // شريط سفلي للكلمات (قراءة مضمونة على الجوال)
        const ksc = clamp((t - 112.6) / .6);
        if (ksc > 0) { g.save(); g.globalAlpha = ksc * .92;
          const lg = g.createLinearGradient(0, 1420, 0, 1880);
          lg.addColorStop(0, 'rgba(8,7,14,0)'); lg.addColorStop(.35, 'rgba(8,7,14,.62)'); lg.addColorStop(1, 'rgba(8,7,14,.86)');
          g.fillStyle = lg; g.fillRect(0, 1420, W, 460);
          g.strokeStyle = 'rgba(201,162,39,.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(150, 1462); g.lineTo(930, 1462); g.stroke(); g.restore(); }
      }, st, { depth: .42 });
      K7.motes(t, { n: 22, alpha: .45, seed: 91 });
      if (kk > .5) KT.streak(t, t, { dur: .18, alpha: kk * .18, angle: .2 });
    }
  });
})();
