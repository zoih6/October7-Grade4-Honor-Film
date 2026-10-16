// ═══════════════════════════════════════════════════════════════════════════
//  s03 · 19.90 – 24.60 · معتز أحمد حمود قائد (الأول) — اللحظة البطلة
//  VOX: البطاقة تتجمّع على المسرح · الاسم يُنطَق ويُكتب · التاج يُثبَّت · الختم يُهبط.
// ═══════════════════════════════════════════════════════════════════════════
(() => {
  const ST = STUDENTS[0];
  const L2 = VO_WORDS[2].words.map((w) => w.t + VO_OFFSET);
  const T = { card: 20.05, name: L2[11] - .06, crown: L2[12] + .05, seal: L2[14] + .05, live: L2[12] - .1, out: 23.45 };
  const P = {};
  const CAM = { x: [[19.9, 592], [21.2, 552], [23.0, 556], [24.6, 620]], y: [[19.9, 976], [20.9, 900], [23.0, 880], [24.6, 940]], s: [[19.9, 1.2], [20.9, 1.03], [23.0, 1.0], [24.6, 1.06]], rot: [[19.9, .015], [21.4, .002], [24.6, -.012]] };
  INITS.push(async () => { P.num = T7.G('١', { size: 460, font: K7.FONTS.n, weight: 900 }); });
  cue.cut('s03-in', 19.9, { sound: 'glitch' });
  cue.hero('s03-card', when.spring(T.card, 'snap'), { on: 'land', sound: 'thump/fs-133282-thump-on-carpet-2+tap', pan: 0 });
  cue.appear('s03-name', when.spring(T.name, 'pop'), { sound: 'chime', pan: .1 });
  cue.hero('s03-crown', when.spring(T.crown, 'snap'), { on: 'land', sound: 'thump+tap', pan: -.15 });
  cue.appear('s03-live', when.spring(T.live, 'card'), { sound: 'paper', pan: .3 });
  cue.appear('s03-seal', when.spring(T.seal, 'snap'), { sound: 'hit+tap', pan: -.3 });
  SHOTS.push({
    a: 19.9, b: 23.45, tin: 'zoom', tdur: .4, focus: [540, 470], draw: (t) => {
      const st = K7.camAt(t, CAM);
      const sh = K7.lensShake(t, T.card, 11, 24, 8), sh2 = K7.lensShake(t, T.crown, 8, 26, 8), sh3 = K7.lensShake(t, T.seal, 7, 30, 9);
      st.x += sh[0] + sh2[0] + sh3[0]; st.y += sh[1] + sh2[1] + sh3[1]; st.rot += sh[2];
      K7.parallax(() => T7.room(t, { plate: 'notebooks', blur: 30, dim: .76, zoom: 1.5, fy: .42, ray: true, motes: .6 }), st, { depth: .14 });
      K7.parallax(() => {
        g.save(); g.globalAlpha = .1 * clamp((t - T.card) / .8);
        g.drawImage(P.num.img, 540 - P.num.img.width / 2 + 150, 760 - P.num.img.height / 2); g.restore();
        T7.portraitStage(ST, t, { t0: T.card, crown0: T.crown, seal0: T.seal, name0: T.name, live0: T.live, id: 1, sc: 1.02, out0: T.out });
        K7.confetti(t, T.name, { x: 540, y: 460, n: 46, power: 1.15, spread: 2.6, seed: 91, grav: 700, dur: 2.6 });
        K7.twinkle(540, 156, t, T.crown + .1, { n: 3, R: 210, dur: .8, size: 26, seed: 15 });
        // «ونبدأ بنجوم الترتيب الأول» كعنوان أعلى الإطار
        K7.voWords(2, t, { x: 540, y: 108, size: 50, font: K7.FONTS.u, weight: 700, color: PAL.paper, maxW: 920, gap: 20, within: [19.9, 21.0], hiMap: { 0: PAL.goldL } });
        // اسم الطالب كاملًا ككلمات متزامنة مع النطق
        
      }, st, { depth: .44 });
      KT.streak(t, T.name + .1, { dur: .55, alpha: .3, angle: .28 });
      K7.motes(t, { n: 22, alpha: .45, seed: 33 });
    }
  });
})();
