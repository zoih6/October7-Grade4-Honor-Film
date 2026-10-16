// ═══════════════════════════════════════════════════════════════════════════
//  s20 · 99.0 – 112.0 · «One, two, three يلا!» — انطلاق الأغنية
//  VOX: أوراق الأرقام تُرمى على الإيقاع · بريق موسيقي · انفجار «يلا!» يقود للكولاج.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const P = {};
  const BARS = () => (typeof SONG_BARS !== 'undefined' ? SONG_BARS.filter((b) => b > 99.2 && b < 112) : [100.7, 101.7, 102.7, 104.6, 106, 107.4, 109, 110.4, 111.4]);
  const T = { start: 99.4, one: 100.75, two: 101.75, three: 102.7, yalla: 103.15, wall: 104.6, two2: 109.05, yalla2: 111.35, out: 112.0 };
  INITS.push(async () => {
    P.num = ['١', '٢', '٣'].map((n, i) => T7.TX(n, { size: 300, color: i === 2 ? PAL.goldD : PAL.navy, font: K7.FONTS.n, weight: 900 }));
    P.one = T7.TX('One', { size: 190, color: PAL.navy, font: K7.FONTS.n, weight: 900 });
    P.two = T7.TX('Two', { size: 190, color: PAL.teal, font: K7.FONTS.n, weight: 900 });
    P.three = T7.TX('Three', { size: 190, color: PAL.goldD, font: K7.FONTS.n, weight: 900 });
    P.yalla = T7.G('يلا!', { size: 300, font: K7.FONTS.d, weight: 800 });
    P.ready = T7.TX('استعدّوا للاحتفال', { size: 78, color: PAL.goldL, font: K7.FONTS.d, weight: 800 });
    P.class4 = T7.TX('أوائل الصف الرابع', { size: 92, color: PAL.paper, font: K7.FONTS.d, weight: 800 });
  });
  BARS().forEach((b, i) => { if (i % 2) return; cue.appear('s20-beat' + i, b, { sound: 'tick', pan: (i % 4 - 1.5) * .3 }); });
  cue.land('s20-one', when.spring(T.one, 'snap'), { sound: 'tap', pan: -.3 });
  cue.land('s20-two', when.spring(T.two, 'snap'), { sound: 'tap', pan: 0 });
  cue.hero('s20-three', when.spring(T.three, 'snap'), { on: 'land', sound: 'thump+tap', pan: .25 });
  cue.hero('s20-yalla', when.spring(T.yalla, 'pop'), { on: 'appear', sound: 'thump+chime' });
  cue.move('s20-wall', when.spring(T.wall, 'card'), { sound: 'whoosh/fs-449994-whoosh-med-mid-wav-1' });
  // نغمة/نوتة ذهبية مرسومة
  function note(x, y, s, rot, color) {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = color;
    g.beginPath(); g.ellipse(-14, 26, 26, 19, -.3, 0, 7); g.fill();
    g.fillRect(6, -58, 7, 88); g.beginPath(); g.moveTo(13, -58); g.quadraticCurveTo(56, -44, 46, -6); g.quadraticCurveTo(50, -40, 13, -40); g.closePath(); g.fill();
    g.restore();
  }
  SHOTS.push({
    a: 99.0, b: 112.0, tin: 'flash', tdur: .28, draw: (t) => {
      const kk = T7.kick(t, { decay: 7, amp: 1 });
      const st = { x: 540 + kk * 6, y: kf(t, [[99, 980], [103, 940], [107, 900], [112, 980]]), s: kf(t, [[99, 1.05], [104, 1.0], [112, 1.06]]) + kk * .012, rot: kf(t, [[99, -.01], [106, .008], [112, -.004]]) };
      K7.parallax(() => T7.room(t, { plate: 'gold_rewards', blur: 30, dim: .78, zoom: 1.44, fy: .46, ray: true, motes: .7 }), st, { depth: .13 });
      K7.parallax(() => {
        // استعدّوا
        KT.show(P.ready, t, { x: 540, y: 560, t0: T.start, in: 'pop', spring: 'pop', t1: T.one - .3, out: 'lift', outDur: .28 });
        // النوتات الموسيقية على الضربات
        BARS().forEach((b, i) => { const k2 = clamp((t - b) / .5); if (k2 <= 0 || k2 >= 1) return;
          const side = i % 2 ? 1 : -1;
          note(540 + side * (120 + (i % 3) * 90), 1180 - k2 * 180, .9 - k2 * .2, side * .2, i % 2 ? PAL.gold : PAL.goldL); });
        // أوراق الأرقام
        const cards3 = [{ wd: P.one, t0: T.one, x: 300, y: 1120, rot: -.07, col: PAL.navy }, { wd: P.two, t0: T.two, x: 540, y: 1180, rot: .02, col: PAL.teal }, { wd: P.three, t0: T.three, x: 780, y: 1120, rot: .07, col: PAL.goldD }];
        cards3.forEach((c, i) => {
          const k = spring(t - c.t0, 320, 24); if (k <= .002) return;
          const w = c.wd.img.width + 70, h = c.wd.img.height + 60;
          g.save(); g.globalAlpha = clamp(k * 2.4); g.translate(c.x, c.y + (1 - k) * -120); g.rotate(c.rot + (1 - k) * .3); g.scale(lerp(.8, 1, k), lerp(.8, 1, k));
          g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 24; g.shadowOffsetY = 10;
          g.fillStyle = 'rgba(248,241,224,.97)'; rrect(-w / 2, -h / 2, w, h, 14, g); g.fill(); g.restore();
          g.strokeStyle = c.col; g.lineWidth = 5; rrect(-w / 2 + 7, -h / 2 + 7, w - 14, h - 14, 10, g); g.stroke();
          g.drawImage(c.wd.img, -c.wd.img.width / 2, -c.wd.img.height / 2); g.restore();
          // كونفيتي صغير مع كل رقم
          K7.confetti(t, c.t0, { x: c.x, y: c.y, n: 16, power: .7, spread: 2.4, seed: 120 + i, grav: 700, dur: 1.6, size: .7, colors: [c.col, PAL.goldL, '#f6eeda'] });
        });
        // يلا!
        const ky = spring(t - T.yalla, 400, 22);
        if (ky > .002) {
          g.save(); g.globalAlpha = clamp(ky * 3); g.translate(540, 1560); const s2 = lerp(.4, 1, ky); g.scale(s2, s2);
          g.shadowColor = 'rgba(255,205,110,.8)'; g.shadowBlur = 26; g.drawImage(P.yalla.img, -P.yalla.img.width / 2, -P.yalla.img.height / 2); g.restore();
          K7.confetti(t, T.yalla, { x: 540, y: 1520, n: 70, power: 1.3, spread: 2.2, seed: 143, grav: 620, dur: 3.0 });
          K7.twinkle(540, 1560, t, T.yalla, { n: 3, R: 320, dur: .9, size: 34, seed: 71 });
        }
        // الإعادة الثانية «١ ٢ ٣ يلا» (109.0–112.3)
        if (t > T.two2 - .2) {
          const rp = [['١', T.two2], ['٢', T.two2 + .95], ['٣', T.two2 + 1.9]];
          rp.forEach(([txt, t0], i) => {
            const k = spring(t - t0, 340, 25); if (k <= .002) return;
            const wd = T7.TX(txt, { size: 170, color: i === 2 ? PAL.goldD : PAL.navy, font: K7.FONTS.n, weight: 900 });
            g.save(); g.globalAlpha = clamp(k * 2.4); g.translate(300 + i * 240, 700 + (1 - k) * -60); g.scale(lerp(.7, 1, k), lerp(.7, 1, k));
            g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 20; g.shadowOffsetY = 8;
            g.fillStyle = 'rgba(248,241,224,.96)'; rrect(-wd.img.width / 2 - 34, -wd.img.height / 2 - 28, wd.img.width + 68, wd.img.height + 56, 12, g); g.fill(); g.restore();
            g.rotate(i === 1 ? .03 : -.04);
            g.drawImage(wd.img, -wd.img.width / 2, -wd.img.height / 2); g.restore();
            K7.confetti(t, t0, { x: 300 + i * 240, y: 700, n: 12, power: .55, spread: 2.4, seed: 160 + i, grav: 700, dur: 1.3, size: .6 });
          });
          const ky2 = spring(t - T.yalla2, 420, 22);
          if (ky2 > .002) { g.save(); g.globalAlpha = clamp(ky2 * 3); g.translate(540, 1010); const s2 = lerp(.35, 1, ky2); g.scale(s2, s2);
            g.shadowColor = 'rgba(255,205,110,.85)'; g.shadowBlur = 26; g.drawImage(P.yalla.img, -P.yalla.img.width / 2, -P.yalla.img.height / 2); g.restore();
            K7.confetti(t, T.yalla2, { x: 540, y: 990, n: 54, power: 1.2, spread: 2.3, seed: 171, grav: 640, dur: 2.6 }); }
        }
        // بداية الكولاج: ١٣ بطاقة تتجمع
        const kw = clamp((t - T.wall) / 1.2);
        if (kw > 0) {
          T7.collage(t, { x: 540, y: 1000, sc: 1, t0: T.wall, cols: 4, wCard: 210, gap: 18, rot: -.01 });
          KT.show(P.class4, t, { x: 540, y: 300, t0: T.wall, in: 'mask', t1: 112.0, out: 'lift', outDur: .3 });
        }
      }, st, { depth: .42 });
      K7.motes(t, { n: 24, alpha: .5, seed: 81 });
      KT.streak(t, T.yalla, { dur: .55, alpha: .34, angle: .3 });
    }
  });
})();
