// ═══════════════════════════════════════════════════════════════════════════
//  brand.js — أصول الفيلم وعدّته الخاصّة: الصور، البطاقات، المسارح، النصوص.
//  يُحمَّل بعد kit7.js وقبل السيناريوهات. كل البناء داخل INITS (مرّة واحدة).
// ═══════════════════════════════════════════════════════════════════════════
const T7 = (() => {
  const AST = '../assets';
  const PL = ['desk_scrapbook', 'school_warm', 'classroom_light', 'notebooks', 'gold_rewards'];
  const cards = {};     // بطاقة كل طالب (ورقة + صورة)
  const live = {};      // بطاقة «حيّة» (نافذة فيديو)
  const tape = {};
  const words = {};     // ذاكرة النصوص
  const seals = {};

  // ── نصوص (تُبنى عند أول طلب داخل INITS) ────────────────────────────────
  function TX(text, o = {}) {
    const key = [text, o.size, o.font || K7.FONTS.d, o.weight || 800, o.color, o.stroke || ''].join('|');
    if (!words[key]) words[key] = KT.word(text, Object.assign({ font: K7.FONTS.d, weight: 800, size: 120, color: PAL.ink }, o));
    return words[key];
  }
  // نص بتدرّج ذهبي
  function G(text, o = {}) {
    const key = 'G' + [text, o.size, o.font || K7.FONTS.d, o.weight || 800].join('|');
    if (!words[key]) words[key] = K7.goldWord(text, o);
    return words[key];
  }

  // ── تحميل كل الأصول ────────────────────────────────────────────────────
  INITS.push(async () => {
    await loadImg('logo', `${AST}/real/logo.webp`);
    for (const p of PL) await loadImg(p, `${AST}/gen/${p}.jpg`);
    for (const s of STUDENTS) await loadImg('p_' + s.id, `${AST}/real/portraits_p/${IMGFILE[s.img]}.jpg`);
    const t1 = K7.tapeCanvas(300, 96, 21), t2 = K7.tapeCanvas(230, 78, 34), t3 = K7.tapeCanvas(340, 104, 55);
    tape.a = t1; tape.b = t2; tape.c = t3; A.tape7 = t2;
    // بطاقات الطلاب: ورقة + صورة + لاصق
    STUDENTS.forEach((s, i) => {
      const img = A['p_' + s.id];
      cards[s.id] = K7.photoCard(img, { w: 750, seed: 40 + i * 7, tapes: i % 2 ? 2 : 3, border: 20, corner: i % 2 ? 'tr' : 'tl' });
      live[s.id] = K7.photoCard(img, { w: 750, seed: 90 + i * 7, tapes: 2, border: 20, rough: 11 });
      live[s.id].win = { x: 0, y: 0, w: 0, h: 0 };   // تُملأ لاحقًا
    });
    // شعار المدرسة كختم دائري
    seals.logo = K7.logoSeal(210);
    seals.logoBig = K7.logoSeal(420);
    A.logoSeal = seals.logo;
  });
  // الإطارات الحيّة تُحمّل في دفعة ثانية (ذاكرة أخفّ)
  async function loadLiveAll() {
    for (const s of STUDENTS) if (!K7.LIVE[s.id]) await K7.loadLive(s.id, 12);
  }
  INITS.push(loadLiveAll);
  INITS.push(loadWamd);

  // ── المسارح: عالم الفيلم الواحد (ثلاث طبقات عمق) ───────────────────────
  // الغرفة الدافئة: الدفتر على الطاولة أمامًا، صورة عالية التمويه خلفًا، غبار في الضوء
  function room(t, { plate = 'desk_scrapbook', blur = 26, dim = .52, fx = .5, fy = .44, zoom = 1.06, ray = true, motes: mo = 1 } = {}) {
    const img = A[plate];
    g.save(); g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
    if (img) { const s = Math.max(W / img.width, H / img.height) * zoom; const w = img.width * s, h = img.height * s;
      g.save(); g.filter = `blur(${blur}px) saturate(1.05)`;
      g.drawImage(img, W / 2 - fx * w, H / 2 - fy * h, w, h); g.restore(); }
    g.fillStyle = `rgba(22,13,5,${dim})`; g.fillRect(0, 0, W, H);
    // تدرّج سفليّ أعمق (وزن بصري أسفل الإطار)
    const gr = g.createLinearGradient(0, H * .35, 0, H); gr.addColorStop(0, 'rgba(10,6,2,0)'); gr.addColorStop(1, 'rgba(10,6,2,.72)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (ray) rays(t, { x: -60, y: -420, ang: .78, n: 4, int: .085, spread: .55 });
    if (mo) K7.motes(t, { n: 22, alpha: .34 * mo, y0: -40, y1: H * .8 });
  }
  // ورق/لوح يغطّي الإطار (لوحة رئيسية للمشاهدة) - لون قابل للتحكم
  function board(t, { seed = 3, sc = 1, x = W / 2, y = H / 2, rot = 0, tone = 'paper', dark = .34, vig = 1 } = {}) {
    g.fillStyle = tone === 'paper' ? '#150d05' : '#0b1120'; g.fillRect(0, 0, W, H);
    if (!A['board' + seed]) A['board' + seed] = K7.sheet({ w: W, h: H, seed, rough: 10, tone: 1, res: .6, fib: 2.2 });
    const b = A['board' + seed];
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc);
    g.drawImage(b.c, -b.c.width / 2, -b.c.height / 2, b.c.width, b.c.height); g.restore();
    // تعميق: نبرة ورقية وسطى بدل الأبيض + تدرّج علوي/سفلي
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = `rgba(206,186,146,${1 - dark * .55})`; g.fillRect(0, 0, W, H); g.restore();
    g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(120,86,40,${dark * .7})`; g.fillRect(0, 0, W, H); g.restore();
    if (vig) { const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, `rgba(30,18,6,${.34 * vig})`); gr.addColorStop(.28, 'rgba(30,18,6,0)');
      gr.addColorStop(.72, 'rgba(30,18,6,0)'); gr.addColorStop(1, `rgba(24,14,4,${.5 * vig})`);
      g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  }
  // سماء ليلية مُولّدة (للنجوم والأمنيات)
  function sky(t, { y = .62, hue = '#0b1226', glow = '#2a4a86', stars = 68, seed = 5, streak = 0 } = {}) {
    const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, hue); gr.addColorStop(.42, '#152140'); gr.addColorStop(.72, '#2b3355'); gr.addColorStop(1, '#4a3a44');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const r = rng(seed);
    for (let i = 0; i < stars; i++) { const sx = r() * W, sy = r() * H * y, R = (.5 + r() * 1.9), a = .25 + r() * .7;
      const tw = .65 + .35 * Math.sin(t * (1.2 + r() * 2.4) + i);
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a * tw; g.fillStyle = r() < .18 ? '#ffe6b8' : '#ffffff';
      g.beginPath(); g.arc(sx, sy, R, 0, 7); g.fill(); g.restore(); }
    // سديم/توهّج أفقي
    g.save(); g.globalCompositeOperation = 'lighter';
    const rg = g.createRadialGradient(W * .5, H * y * .92, 10, W * .5, H * y * .92, W * .8);
    rg.addColorStop(0, 'rgba(120,150,220,.18)'); rg.addColorStop(1, 'rgba(120,150,220,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H * y); g.restore();
    if (streak) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = streak;
      const st = g.createLinearGradient(0, H * .1, W, H * .4); st.addColorStop(0, 'rgba(255,240,210,0)'); st.addColorStop(.5, 'rgba(255,240,210,.35)'); st.addColorStop(1, 'rgba(255,240,210,0)');
      g.fillStyle = st; g.save(); g.rotate(-.18); g.fillRect(-W, H * .16, W * 3, 90); g.restore(); g.restore(); }
  }
  // لوحة مبنى المدرسة (بخلفية مُعتّمة + إطار ورق)
  function schoolPlate(t, { zoom = 1.02, fx = .5, fy = .5, dim = .12 } = {}) {
    const img = A.school_warm; if (!img) return;
    const s = Math.max(W / img.width, H / img.height) * zoom, w = img.width * s, h = img.height * s;
    g.drawImage(img, W / 2 - fx * w, H / 2 - fy * h, w, h);
    if (dim) { g.fillStyle = `rgba(18,10,2,${dim})`; g.fillRect(0, 0, W, H); }
  }

  // ── طبق الترتيب (يُختم على البطاقة) ────────────────────────────────────
  function rankSeal(s, r = 132) {
    const key = 'rk' + s.id + r;
    if (!seals[key]) seals[key] = K7.sealCanvas({ r, text: s.num, sub: s.tied ? 'مكرر' : '', tone: s.n === 1 ? 'gold' : s.tied ? 'teal' : 'navy', font: K7.FONTS.b });
    return seals[key];
  }

  // ── بطاقة الطالب: تُرسم مع حركة دخول/خروج (ورقة + صورة + لاصق + ختم) ────
  // ظ: k = 0→1 (spring), ko = 0→1 خروج
  function drawCard(s, x, y, k, ko, t, { sc = 1, rot = 0, id = 1, live: liveK = 0, lift = 0, dimPhoto = 0 } = {}) {
    const cd = cards[s.id]; if (!cd) return;
    const bin = breathe(id, t, .45);
    const rot2 = rot + (1 - clamp(k)) * .1 + bin[2];
    const X = x + bin[0], Y = y + bin[1] - ko * 90;
    const scl = sc * lerp(.86, 1, k) * (1 - ko * .06);
    K7.drawSheet(cd, X, Y, { rot: rot2, sc: scl, alpha: clamp(k * 2.4) * (1 - ko), lift: Math.min(1, (1 - k) * 1.4 + lift) });
    // النافذة الحيّة داخل البطاقة
    if (liveK > 0 && K7.LIVE[s.id]) {
      const inr = cd.inner, w = inr.w * scl * .92, h = w * .62;
      const lx = X + (inr.x + inr.w / 2 - cd.c.width / (2 * cd.res)) * scl;
      const ly = Y + (inr.y + inr.h * .30 - cd.c.height / (2 * cd.res)) * scl;
      g.save(); g.rotate(0);
      K7.liveDraw(s.id, (t * .55) % 1, { x: lx, y: ly, w, h, alpha: clamp(liveK * 2) * (1 - ko), rot: rot2, sc: 1, seed: 30 + s.n });
      g.restore();
      // إطار النافذة الحيّة + شرائح الشريط
      g.save(); g.globalAlpha = clamp(liveK * 2) * (1 - ko); g.translate(lx, ly); g.rotate(rot2);
      g.strokeStyle = 'rgba(30,18,6,.5)'; g.lineWidth = 5; g.strokeRect(-w / 2, -h / 2, w, h);
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.strokeRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8);
      g.restore();
    }
    // اللاصق المثبّت
    const tc = tape[['a', 'b', 'c'][id % 3]];
    for (const tp of cd.tape) K7.drawTape(tc, X + tp.dx * scl, Y + tp.dy * scl, { rot: tp.rot + rot2, sc: scl * (.9 + tp.tone * .22), alpha: clamp(k * 2) * (1 - ko) });
    return { X, Y, sc: scl, rot: rot2, cd };
  }
  // ختم الترتيب على البطاقة
  function drawRank(s, cx, cy, k, t, { sc = 1, rot = -.14, alpha = 1 } = {}) {
    if (k <= .002) return; const se = rankSeal(s);
    const kk = spr(t - 0, 'snap');
    g.save(); g.globalAlpha = clamp(k * 3) * alpha; g.translate(cx, cy + (1 - clamp(k)) * -60); g.rotate(rot + (1 - clamp(k)) * .25);
    const s2 = sc * lerp(1.9, 1, clamp(k));
    g.scale(s2, s2); g.drawImage(se, -se.width / 2, -se.height / 2); g.restore();
  }


  // ── بطاقة «حيّة» صغيرة (بورتريه مصغّر يتحرّك) — تُعلَّق على البطاقة الكبيرة أو تُطوَّر ──
  function drawLiveCard(s, x, y, k, t, { sc = 1, rot = 0, wdt = 300, alpha = 1, tapeOn = true } = {}) {
    if (k <= .002 || alpha <= .002) return;
    const kk = clamp(k), w = K7.LIVE[s.id] ? wdt : wdt * .8;
    const r = rng(s.n * 13 + 7);
    const kd = spr(t - 0, 'card');
    const rot2 = rot + (1 - kk) * .22;
    const yy = y + (1 - kk) * -70;
    g.save(); g.globalAlpha = clamp(kk * 3) * alpha;
    // ورقة البطاقة
    const key = 'lvc' + s.id + wdt;
    if (!live[key]) live[key] = K7.sheet({ w, h: Math.round(w * 1.24), seed: 120 + s.n * 5, rough: 12, tone: 1, res: .8,
      content: (x2, w2, h2) => { x2.save(); x2.globalAlpha = .14; x2.fillStyle = '#2a1706'; x2.fillRect(14, 18, w2 - 28, h2 - 46); x2.restore(); } });
    const cd = live[key];
    g.save(); g.translate(x, yy); g.rotate(rot2); g.scale(sc, sc);
    g.shadowColor = 'rgba(20,10,0,.55)'; g.shadowBlur = 26; g.shadowOffsetY = 12;
    g.drawImage(cd.c, -cd.c.width / 2, -cd.c.height / 2); g.restore();
    // نافذة الفيديو الحيّة
    if (K7.LIVE[s.id] && kk > .35) {
      const iw = w, ih = w * 1.12;
      g.save(); g.translate(x, yy); g.rotate(rot2); g.scale(sc, sc);
      K7.liveDraw(s.id, (t * .62 + s.n * .13) % 1, { x: 0, y: -cd.ih * .06, w: iw, h: ih, alpha: clamp((kk - .35) * 4), seed: 60 + s.n });
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; g.strokeRect(-iw / 2 - 3, -ih / 2 - cd.ih * .06 - 3, iw + 6, ih + 6);
      g.strokeStyle = 'rgba(30,18,6,.45)'; g.lineWidth = 1.6; g.strokeRect(-iw / 2 - 6, -ih / 2 - cd.ih * .06 - 6, iw + 12, ih + 12);
      g.restore();
    }
    if (tapeOn) {
      const tc = tape['b'];
      K7.drawTape(tc, x + w * .34 * sc, yy - (live[key].ih * .5) * sc * .96, { rot: .45 + rot2, sc: sc * .8, alpha: clamp(kk * 3) * alpha });
    }
    g.restore();
  }

  // ═══ مسرح البورتريه: إخراج واحد ثابت لكل لحظات الطلاب (اتساق + نظافة) ═══
  // يضمن: بطاقة في الثلث الأعلى، اللحظة الحيّة يمينًا، ختم الترتيب يسارًا،
  //        لوحة الاسم في الوسط السفلي، ونصّ التعليق أسفلها — بلا تعارض أبدًا.
  function portraitStage(s, t, o) {
    const { t0 = 0, live0 = null, seal0 = null, crown0 = null, name0 = null, head0 = null,
      head = null, rot = -.012, sc = 1, camRot = 0, id = 1, room: roomOpt = {}, grayscale = false } = o || {};
    // الخلفية
    room(t, Object.assign({ plate: 'classroom_light', blur: 28, dim: .74, zoom: 1.42, fx: .5, fy: .44, ray: true, motes: .6 }, roomOpt));
    const kc = spring(t - t0, 320, 26);
    if (kc > .002) {
      // توهّج خلف البطاقة
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .42 * clamp(kc);
      const rg = g.createRadialGradient(540, 760, 40, 540, 820, 880);
      rg.addColorStop(0, 'rgba(255,222,150,.5)'); rg.addColorStop(1, 'rgba(255,190,90,0)');
      g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
      // البطاقة
      const cl = drawCard(s, 540, 730, kc, 0, t, { sc: sc * .98, rot, id, lift: clamp((1 - kc) * 1.6) });
      // إطار ذهبي يلتفّ حول البطاقة
      const kf = clamp((t - t0 - .45) / .7);
      if (kf > 0) { g.save(); g.globalAlpha = kf * .75; g.strokeStyle = PAL.gold; g.lineWidth = 5;
        const w2 = 790 * sc * .98, h2 = 1116 * sc * .98; rrect(540 - w2 / 2, 730 - h2 / 2, w2, h2, 18, g); g.stroke(); g.restore(); }
      // التاج (للأول)
      if (crown0 !== null) { const kcr = spring(t - crown0, 320, 24);
        if (kcr > .001) K7.crown(540 - 4, 156, 1.06 * sc, kcr, { alpha: clamp(kcr * 2), shine: clamp((t - crown0 - .2) / .5) * .7 }); }
      // اللحظة الحيّة
      if (live0 !== null) { const klv = spring(t - live0, 170, 20);
        if (klv > .001 && K7.LIVE[s.id]) {
          drawLiveCard(s, 862, 968, klv, t, { sc: .8 * sc, rot: -.15, wdt: 262 });
          g.save(); g.globalAlpha = clamp(klv * 3); g.translate(862, 1216); g.rotate(-.05);
          const tg = TX('لحظة التكريم', { size: 40, color: PAL.navy, font: K7.FONTS.b, weight: 800 }).img;
          const bw = tg.width + 28, bh = tg.height + 16;
          g.fillStyle = 'rgba(246,238,218,.96)'; rrect(-bw / 2, -bh / 2, bw, bh, 8, g); g.fill();
          g.strokeStyle = 'rgba(22,48,94,.5)'; g.lineWidth = 2; rrect(-bw / 2, -bh / 2, bw, bh, 8, g); g.stroke();
          g.drawImage(tg, -tg.width / 2, -tg.height / 2); g.restore(); }
      }
      // ختم الترتيب + الشريط
      if (seal0 !== null) { const kse = spring(t - seal0, 320, 24);
        if (kse > .001) {
          g.save(); g.globalAlpha = clamp(kse * 3); g.translate(142 - (1 - kse) * 70, 1148 + (1 - kse) * -46);
          g.rotate(-.2 + (1 - kse) * .35); const s2 = lerp(2.0, 1, kse); g.scale(s2, s2);
          const se = rankSeal(s, 138); g.drawImage(se, -se.width / 2, -se.height / 2); g.restore();
          for (let i = 0; i < 2; i++) { const kr = clamp((t - seal0 - i * .06) / .6); if (kr <= 0 || kr >= 1) continue;
            g.save(); g.globalAlpha = (1 - kr) * .5; g.strokeStyle = PAL.goldL; g.lineWidth = 8 * (1 - kr) + 2;
            g.beginPath(); g.arc(142, 1148, 120 + kr * 300, 0, 7); g.stroke(); g.restore(); }
          const sc2 = lerp(1.18, 1, kse);
          KT.show(sealName(s), t, { x: 142, y: 1316, t0: seal0 + .05, in: 'pop', spring: 'snap', sc: sc2, t1: o.out0 || null, out: 'lift', outDur: .26 });
        } }
      // لوحة الاسم
      if (name0 !== null) {
        const wd = TX(s.name, { size: 84, color: PAL.paper, font: K7.FONTS.d, weight: 800 });
        // شريط ورقي خلف الاسم
        const kw = clamp((t - name0) / .5);
        if (kw > 0) { const bw = Math.min(1000, wd.img.width + 140), bh = 138;
          g.save(); g.globalAlpha = kw; g.translate(540, 1584); g.rotate(-.008);
          g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 22; g.shadowOffsetY = 9;
          g.fillStyle = 'rgba(22,48,94,.94)'; rrect(-bw / 2, -bh / 2, bw, bh, 14, g); g.fill(); g.restore();
          g.strokeStyle = 'rgba(201,162,39,.85)'; g.lineWidth = 4; rrect(-bw / 2 + 9, -bh / 2 + 9, bw - 18, bh - 18, 10, g); g.stroke();
          g.restore(); }
        KT.show(wd, t, { x: 540, y: 1584, t0: name0, in: 'mask', t1: o.out0 || null, out: 'lift', outDur: .3 });
        const kn = clamp((t - name0 - .16) / .5);
        if (kn > 0) K7.goldPath([[854, 1660], [226, 1660]], kn, { width: 6, color: PAL.gold, glow: 12, alpha: .9 });
      }
      // نصّ التعليق
      if (head0 !== null && head) KT.show(head, t, { x: 540, y: 1766, t0: head0, in: 'rise', dist: 36, t1: o.out0 || null, out: 'lift', outDur: .28 });
    }
    return kc;
  }
  const _nameCache = {};
  function sealName(s) { const k = 'sn' + s.id; if (!_nameCache[k]) _nameCache[k] = TX(s.rank, { size: 84, color: PAL.navy, font: K7.FONTS.d, weight: 800 }); return _nameCache[k]; }

  // ═══ الأغنية: كتابة كلمات متزامنة + نبض الإيقاع ═══
  // نبضة: مقدار 0..1 من آخر ضربة (للاهتزاز الخفيف على الإيقاع)
  function kick(t, { decay = 9, amp = 1 } = {}) {
    const b = (typeof SONG_BEATS !== 'undefined' ? SONG_BEATS : []); if (!b.length) return 0;
    let last = -1; for (let i = 0; i < b.length; i++) { if (b[i] <= t) last = b[i]; else break; if (i > 400) break; }
    if (last < 0) return 0; return amp * Math.exp(-(t - last) * decay);
  }
  // كلمات الأغنية: تُكتب كلمة-كلمة خلال [from, to] (الصوت غنائي فالتوزيع متساوٍ ذكيًا)
  const _lyr = {};
  function lyric(text, t, o = {}) {
    const { x = 540, y = 1120, size = 104, font = K7.FONTS.d, weight = 800, color = PAL.navy, from = 0, to = 1,
      gap = 26, maxW = 880, lh = 1.3, align = 'center', sc = 1, alpha = 1, hi = PAL.goldD, hiIdx = [],
      enter = 'pop', shift = 0 } = o;
    const parts = String(text).split(/\s+/).filter(Boolean);
    const n = parts.length;
    const t0 = from + .06, t1 = Math.max(t0 + .3, to - .25);
    const step = (t1 - t0) / Math.max(1, n - 1);
    const imgs = parts.map((w, i) => { const c = (hiIdx.includes(i) ? hi : color), key = [w, size, font, weight, c].join('|');
      if (!_lyr[key]) _lyr[key] = KT.word(w, { size, font, weight, color: c }); return _lyr[key]; });
    // تخطيط أسطر
    const rows = [[]]; let cw = 0;
    imgs.forEach((im, i) => { const w2 = im.img.width + gap;
      if (cw + w2 > maxW && rows[rows.length - 1].length) { rows.push([]); cw = 0; }
      rows[rows.length - 1].push({ im, w: w2, i }); cw += w2; });
    const H2 = rows.length * size * lh;
    let ty = y - H2 / 2 + size * .5;
    rows.forEach((row) => {
      const tot = row.reduce((a, r2) => a + r2.w, 0);
      let tx = x + tot / 2 - gap / 2;
      row.forEach(({ im, w: w2, i }) => {
        const tt = t0 + i * step; const k = spring(t - tt, 320, 26);
        if (k > .002) {
          const late = t > tt + .8;
          g.save(); g.globalAlpha = alpha * clamp(k * 2.4) * (late ? .78 : 1);
          g.translate(tx - w2 / 2 + gap / 2 + shift, ty + (1 - k) * 26);
          const s2 = sc * lerp(.7, 1, k); g.scale(s2, s2);
          g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 12; g.shadowOffsetY = 5;
          g.drawImage(im.img, -im.img.width / 2, -im.img.height / 2); g.restore();
        }
        tx -= w2;
      });
      ty += size * lh;
    });
    return { y, h: H2 };
  }
  // شعار ومض المتحرك (إطارات مُستخرجة من ملف العميل)
  const WAMD = { arr: [], n: 72 };
  async function loadWamd() {
    WAMD.arr.length = 0;
    for (let i = 1; i <= WAMD.n; i++) { const k = 'wamd' + i; await loadImg(k, `${AST}/real/wamd/w${String(i).padStart(3, '0')}.jpg`); if (A[k]) WAMD.arr.push(A[k]); }
    WAMD.n = WAMD.arr.length || 1;
  }
  // لقطة كاملة الشاشة (المصدر 9:16): u = 0..1 من مدّة المقطع
  function wamdDraw(u, { x = W / 2, y = H / 2, w = W, alpha = 1, zoom = 1 } = {}) {
    const i0 = clamp(u) * (WAMD.n - 1); const a = Math.floor(i0), b2 = Math.min(WAMD.n - 1, a + 1), k = i0 - a;
    const im1 = WAMD.arr[a] || A.logo, im2 = WAMD.arr[b2] || im1;
    const h = w * (im1.height / im1.width) * zoom, w2 = w * zoom;
    g.save(); g.globalAlpha = alpha;
    g.drawImage(im1, x - w2 / 2, y - h / 2, w2, h);
    if (k > 0) { g.globalAlpha = alpha * k; g.drawImage(im2, x - w2 / 2, y - h / 2, w2, h); }
    g.restore();
  }
  // لوحة الطلاب كولاج جدار (شبكة قصاصات) — تُستخدم في اللازمة
  function collage(t, o = {}) {
    const { x = 540, y = 960, sc = 1, t0 = 0, rot = 0, cols = 3, gap = 22, wCard = 246, alpha = 1, live = false, dir = 'down' } = o;
    const rows = Math.ceil(STUDENTS.length / cols);
    STUDENTS.forEach((s, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      const pitch = wCard * 1.34 + gap;
      const px = x + (c - (cols - 1) / 2) * (wCard + gap), py = y + (r - (rows - 1) / 2) * pitch;
      const k = spring(t - (t0 + i * .06), 260, 24); if (k <= .002) return;
      g.save(); g.globalAlpha = clamp(k * 2.2) * alpha; g.translate(px, py + (1 - k) * 40); g.rotate(rot + (i % 3 - 1) * .03 + (1 - k) * .12);
      g.scale(sc * wCard / 790, sc * wCard / 790);
      g.shadowColor = 'rgba(15,8,0,.5)'; g.shadowBlur = 22; g.shadowOffsetY = 10;
      const cd = cards[s.id]; g.drawImage(cd.c, -cd.c.width / 2, -cd.c.height / 2);
      g.restore();
    });
  }
  return { TX, G, portraitStage, kick, lyric, loadWamd, wamdDraw, collage, cards, drawLiveCard, live, tape, seals, room, board, sky, schoolPlate, rankSeal, drawCard, drawRank, loadLiveAll, PLA: PL, AST };
})();
