// ═══════════════════════════════════════════════════════════════════════════
//  s06 · 70.45 – 99.00 · «والآن نهديكم هذه الأغنية… ألف مبارك لكم»
//  VOX: الدفتر يُغلق على «ألف مبارك» → علبة هدية بشريط ذهبي تُفتح → ضوء يبتلع الشاشة
//       ثم تبدأ الأغنية (نهاية هذا المشهد = بداية المشهد التالي: الضوء نفسه).
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const V = (li, i) => VO_WORDS[17].words[i].t + VO_OFFSET;
  const T = { close: 71.5, gift: 76.2, open: 84.0, mubarak: V(17, 13) - .05, burst: 91.5 };
  const P = {};
  INITS.push(async () => { P.big = (txt, col, size) => T7.TX(txt, { size: size || 130, color: col || PAL.navy, font: K7.FONTS.d, weight: 800 }); });
  cue.move('s06-close', when.ease(T.close, T.close + .8), { sound: 'paper/fs-397550-page-turn-03-wav-2' });
  cue.land('s06-gift', when.spring(T.gift, 'card'), { sound: 'thump/fs-133282-thump-on-carpet-2+tap' });
  cue.hero('s06-open', when.spring(T.open, 'snap'), { on: 'land', sound: 'thump+chime', pan: 0 });
  cue.appear('s06-mubarak', when.spring(T.mubarak, 'pop'), { sound: 'chime+tap' });
  SHOTS.push({
    a: 70.45, b: 99.0, tin: 'pageFlip', tdur: .7, draw: (t) => {
      const st = { x: kf(t, [[70.45, 560], [80, 540], [99, 552]]), y: kf(t, [[70.45, 960], [80, 1000], [99, 940]]), s: kf(t, [[70.45, 1.02], [78, 1.0], [90, .94], [99, 1.2]]), rot: kf(t, [[70.45, -.006], [90, .004], [99, -.01]]) };
      K7.parallax(() => T7.room(t, { plate: 'gold_rewards', blur: 30, dim: .74, zoom: 1.4, fx: .5, fy: .46, ray: true, motes: .6 }), st, { depth: .13 });
      K7.parallax(() => {
        // الدفتر يُغلق: ورقة كبيرة تنطبق
        const kc = clamp((t - T.close) / .8);
        if (kc < 1) { const kk = 1 - kc; T7.board(t, { seed: 9, dark: .3, vig: .8 }); g.save(); g.globalAlpha = kk; g.fillStyle = '#120c04'; g.fillRect(0, 0, W, H); g.restore(); }
        // علبة الهدية
        const kg = spring(t - T.gift, 170, 20);
        if (kg > .001) {
          const w = 700, h = 460, y0 = 1000;
          g.save(); g.translate(540, y0); g.rotate(-.01);
          g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 40; g.shadowOffsetY = 18;
          g.fillStyle = '#123058'; rrect(-w / 2, -h / 2, w, h, 14, g); g.fill(); g.restore();
          g.strokeStyle = PAL.gold; g.lineWidth = 6; rrect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 10, g); g.stroke();
          // حزام ذهبي
          const kO = clamp((t - T.open) / .9);
          g.fillStyle = PAL.gold; g.fillRect(-w / 2, -34 + (1 - kg) * -200, w, 68);
          g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(-w / 2, -34 + (1 - kg) * -200, w, 20);
          // العقدة
          g.save(); g.translate(0, -h / 2 + 6 + (1 - kg) * -260); g.scale(lerp(1.6, 1, kg), lerp(1.6, 1, kg));
          for (const s2 of [-1, 1]) { g.save(); g.rotate(s2 * .5); g.fillStyle = PAL.goldL; g.beginPath(); g.ellipse(s2 * 46, -14, 52, 32, s2 * .3, 0, 7); g.fill(); g.strokeStyle = PAL.goldD; g.lineWidth = 3; g.stroke(); g.restore(); }
          g.fillStyle = PAL.goldL; g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fill(); g.restore();
          // الغطاء ينفتح ويخرج ضوء
          if (kO > 0) {
            g.save(); g.translate(0, -h / 2); g.rotate(-kO * .5); g.translate(0, -kO * 260);
            g.fillStyle = '#17396a'; rrect(-w / 2, -60, w, 90, 10, g); g.fill();
            g.strokeStyle = PAL.gold; g.lineWidth = 5; rrect(-w / 2 + 6, -54, w - 12, 78, 8, g); g.stroke(); g.restore();
            g.save(); g.globalCompositeOperation = 'lighter';
            const R = 60 + kO * 1000, rg = g.createRadialGradient(0, -h / 2, 10, 0, -h / 2, R);
            rg.addColorStop(0, `rgba(255,246,214,${.9 * kO})`); rg.addColorStop(.35, `rgba(255,214,130,${.5 * kO})`); rg.addColorStop(1, 'rgba(255,200,110,0)');
            g.fillStyle = rg; g.beginPath(); g.arc(0, -h / 2, R, 0, 7); g.fill(); g.restore();
            K7.confetti(t, T.open, { x: 540, y: 700, n: 60, power: 1.25, spread: 2.2, seed: 88, grav: 520, dur: 3.2 });
          }
          g.restore();
        }
        // «ألف مبارك لكم»
        KT.show(P.big('ألف مبارك لكم', PAL.goldD, 148), t, { x: 540, y: 1560, t0: T.mubarak, in: 'pop', spring: 'pop', t1: 97.4, out: 'lift', outDur: .4 });
        K7.voWords(17, t, { x: 540, y: 1760, size: 50, font: K7.FONTS.u, weight: 700, color: PAL.paper, maxW: 940, gap: 16, within: [82, 99], hiMap: {} });
        K7.voWords(17, t, { x: 540, y: 140, size: 52, font: K7.FONTS.u, weight: 700, color: '#f0e6cc', maxW: 940, gap: 16, within: [70.45, 82] });
      }, st, { depth: .42 });
      // انفجار الضوء النهائي الذي يسلّمنا للأغنية
      const kb = clamp((t - T.burst) / 1.6);
      if (kb > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = E.cubicIn(kb);
        const rg = g.createRadialGradient(540, 900, 20, 540, 900, 200 + kb * 1400);
        rg.addColorStop(0, 'rgba(255,250,232,.95)'); rg.addColorStop(.5, 'rgba(255,228,150,.5)'); rg.addColorStop(1, 'rgba(255,210,120,0)');
        g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
        K7.twinkle(540, 900, t, T.burst, { n: 3, R: 400, dur: 1.0, size: 40, seed: 99 }); }
      K7.motes(t, { n: 26, alpha: .5, seed: 71 });
    }
  });
})();
