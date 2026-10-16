// ═══════════════════════════════════════════════════════════════════════════
//  kit7.js — عدة البيت لفيلم «دفتر الإنجاز» (مدرسة ٧ أكتوبر · أوائل الصف الرابع)
//  كل شيء دوال زمن محضة: لا Math.random، لا مؤقتات، لا انتقالات CSS.
//  يعتمد على core.js / helpers.js / fx.js / type.js (KT) — يُحمّل بعدها.
// ═══════════════════════════════════════════════════════════════════════════
const K7 = (() => {
  const P = PAL, TAU = Math.PI * 2;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ═══ 1 · ورَق ═════════════════════════════════════════════════════════════
  // مضلّع ورق ممزّق (مُولَّد ببذرة) — الحافة الخلفية أعرض من الأمام
  function tornPts(w, h, seed, rough = 8, step = 26) {
    const r = rng(seed), pts = [];
    const edge = (x0, y0, x1, y1) => {
      const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(3, Math.round(len / step));
      for (let i = 0; i <= n; i++) {
        const u = i / n, jx = (r() - .5) * rough * 2, jy = (r() - .5) * rough * 2;
        const taper = Math.sin(u * Math.PI) * .6 + .4;
        pts.push([x0 + (x1 - x0) * u + jx * taper, y0 + (y1 - y0) * u + jy * taper]);
      }
    };
    edge(0, 0, w, 0); edge(w, 0, w, h); edge(w, h, 0, h); edge(0, h, 0, 0);
    return pts;
  }
  const pathPts = (c, pts, ox = 0, oy = 0) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x + ox, y + oy) : c.moveTo(x + ox, y + oy)); c.closePath(); };

  // ورقة كاملة: ملمس، ألياف، حافة ممزّقة، ظل داخلي، اختياريًا محتوى داخلها
  function sheet({ w, h, seed = 1, rough = 8, tone = 0, content = null, res = 1, fib = 1, edgeShade = 1 } = {}) {
    const pad = 44, c = mk((w + pad * 2) * res, (h + pad * 2) * res), x = c.getContext('2d');
    x.scale(res, res);
    const pts = tornPts(w, h, seed, rough);
    // الظل الساقط
    x.save(); x.filter = `blur(${18 * res}px)`; x.fillStyle = 'rgba(38,22,6,.42)'; pathPts(x, pts, pad + 8, pad + 14); x.fill(); x.restore();
    x.save(); pathPts(x, pts, pad, pad); x.clip();
    // قاعدة الورق: لون نقي ثم ملمس مُبلَّط بالحجم الطبيعي (بلا تمدّد يوسّخ الصفحة)
    x.fillStyle = '#f9f2e0'; x.fillRect(-40, -40, w + pad * 2, h + pad * 2);
    const tex = A.paper_cream;
    if (tex) { x.globalAlpha = .22; const tw2 = tex.width, th2 = tex.height;
      for (let ty = -pad; ty < h + pad; ty += th2) for (let tx = -pad; tx < w + pad; tx += tw2) x.drawImage(tex, tx, ty, tw2, th2);
      x.globalAlpha = 1; }
    // تدرّج ضوئي (الورق ليس مسطّحًا): أفتح من الأعلى-اليمين
    const lg2 = x.createLinearGradient(pad, pad, pad + w, pad + h);
    lg2.addColorStop(0, 'rgba(255,252,240,.55)'); lg2.addColorStop(.45, 'rgba(255,250,235,.12)');
    lg2.addColorStop(1, `rgba(214,192,152,${.34 + tone * .06})`);
    x.fillStyle = lg2; x.fillRect(-40, -40, w + pad * 2, h + pad * 2);
    // ألياف خفيفة
    const RF = rng(seed + 91);
    for (let i = 0; i < 90 * fib; i++) { const a = RF() * TAU, d = RF() * Math.max(w, h) * .58, px = pad + w / 2 + Math.cos(a) * d, py = pad + h / 2 + Math.sin(a) * d * .92;
      x.strokeStyle = RF() < .5 ? 'rgba(176,150,104,.10)' : 'rgba(255,255,255,.24)'; x.lineWidth = .7 + RF() * .9;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + (RF() - .5) * 40, py + (RF() - .5) * 10); x.stroke(); }
    // ظل داخلي على الحافة (الورق سميك)
    x.save(); x.filter = 'blur(9px)'; x.strokeStyle = `rgba(120,88,40,${.26 * edgeShade})`; x.lineWidth = 13;
    pathPts(x, pts, pad, pad); x.stroke(); x.restore();
    if (content) { x.save(); x.translate(pad, pad); content(x, w, h); x.restore(); }
    x.restore();
    // حافة بيضاء ليفية
    x.save(); x.strokeStyle = 'rgba(252,246,232,.9)'; x.lineWidth = 3.2; pathPts(x, pts, pad, pad); x.stroke();
    x.strokeStyle = 'rgba(150,112,54,.35)'; x.lineWidth = 1.1; pathPts(x, pts, pad - 2.5, pad - 2.5); x.stroke(); x.restore();
    return { c, w: c.width / res, h: c.height / res, iw: w, ih: h, pad, res };
  }
  // رسم ورقة في إطار الكاميرا (مركزها عند x,y)
  function drawSheet(p, x, y, { rot = 0, sc = 1, alpha = 1, lift = 0, sx = 1 } = {}) {
    if (alpha <= .002) return;
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc * sx, sc); g.globalAlpha = alpha;
    if (lift > 0) { g.shadowColor = `rgba(20,10,0,${.5 * Math.min(1, lift)})`; g.shadowBlur = 40 * lift; g.shadowOffsetY = 26 * lift; }
    g.drawImage(p.c, -p.c.width / 2 + (lift * 6) * p.res, -p.c.height / 2 + (lift * 10) * p.res, p.c.width, p.c.height);
    g.restore();
  }

  // ═══ 2 · نافذة الصورة (بورتريه الطالب) ═══════════════════════════════════
  // ورقة + صورة داخل إطار غائر + شريط لاصق — قابلة للتحوّل إلى «حيّة»
  function photoCard(img, { w = 720, seed = 5, crop = null, tapes = 2, label = null, rough = 9, border = 16, corner = 'tr' } = {}) {
    const [sx0, sy0, sw, sh] = crop || [0, 0, img.width, img.height];
    const ih = Math.round(w * sh / sw);
    const inner = { x: 0, y: 0, w, h: ih };
    const p = sheet({
      w: w + border * 2, h: ih + border * 2, seed, rough, tone: 1, content: (x) => {
        // طبقة الصورة
        x.save(); x.globalAlpha = .16; x.fillStyle = '#2a1706'; x.fillRect(border + 5, border + 7, w, ih); x.restore();
        x.save(); x.beginPath(); x.rect(border, border, w, ih); x.clip();
        x.drawImage(img, sx0, sy0, sw, sh, border, border, w, ih);
        // معالجة: دفء خفيف + حبيبات
        x.globalCompositeOperation = 'soft-light'; x.fillStyle = 'rgba(255,196,120,.2)'; x.fillRect(border, border, w, ih);
        x.globalCompositeOperation = 'multiply'; x.fillStyle = 'rgba(250,236,214,.94)'; x.fillRect(border, border, w, ih);
        x.globalCompositeOperation = 'overlay'; x.fillStyle = 'rgba(255,238,208,.1)'; x.fillRect(border, border, w, ih);
        x.globalCompositeOperation = 'source-over';
        const R = rng(seed + 3);
        for (let i = 0; i < 260; i++) { x.fillStyle = R() < .5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'; x.fillRect(border + R() * w, border + R() * ih, 1.6, 1.6); }
        // إطار داخلي
        x.strokeStyle = 'rgba(60,38,12,.45)'; x.lineWidth = 3; x.strokeRect(border + 1.5, border + 1.5, w - 3, ih - 3);
        x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 6; x.strokeRect(border - 3, border - 3, w + 6, ih + 6);
        x.restore();
      }
    });
    p.inner = { x: p.pad + border, y: p.pad + border, w, h: ih };
    if (tapes) { p.tape = []; const R = rng(seed + 17);
      const topY = -ih / 2 - 6, botY = ih / 2 + 6;
      const spots = corner === 'tr'
        ? [[-w * .22, topY, -.42], [w * .2, topY, .38], [-w * .24, botY, -.33], [w * .24, botY, .44]]
        : [[w * .22, topY, .42], [-w * .2, topY, -.38], [w * .24, botY, .33], [-w * .24, botY, -.44]];
      for (let i = 0; i < tapes; i++) { const s = spots[i % spots.length]; p.tape.push({ dx: s[0], dy: s[1], rot: s[2] + (R() - .5) * .06, tone: R() }); }
    }
    p.img = img; p.crop = crop; p.border = border;
    return p;
  }
  // شريط لاصق (ورقي نصف شفاف)
  function tapeCanvas(w, h, seed, color = 'rgba(226,206,158,.72)') {
    const c = mk(w, h), x = c.getContext('2d'); const r = rng(seed);
    x.fillStyle = color; x.beginPath();
    const n = 14, jag = 4;
    for (let i = 0; i <= n; i++) { const px = i / n * w, py = (r() - .5) * jag; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    for (let i = 0; i <= n; i++) { const px = w - i / n * w, py = h + (r() - .5) * jag; x.lineTo(px, py); }
    x.closePath(); x.fill();
    for (let i = 0; i < 60; i++) { x.fillStyle = r() < .5 ? 'rgba(255,255,255,.16)' : 'rgba(140,110,60,.13)'; x.fillRect(r() * w, r() * h, 1.6, r() * h * .6); }
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(0, 1.2); x.lineTo(w, 1.2); x.moveTo(0, h - 1.6); x.lineTo(w, h - 1.6); x.stroke();
    return c;
  }
  function drawTape(c, x, y, { rot = 0, sc = 1, alpha = 1 } = {}) {
    g.save(); g.globalAlpha = alpha; g.translate(x, y); g.rotate(rot); g.scale(sc, sc);
    g.shadowColor = 'rgba(20,10,0,.35)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
    g.drawImage(c, -c.width / 2, -c.height / 2); g.restore();
  }

  // ═══ 3 · زخارف ═══════════════════════════════════════════════════════════
  function starPath(c, cx, cy, R, n = 5, inner = .42, rot = -Math.PI / 2) {
    c.beginPath();
    for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? R * inner : R, a = rot + i * Math.PI / n; const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr; i ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.closePath();
  }
  function star(cx, cy, R, { n = 5, rot = -Math.PI / 2, color = P.gold, alpha = 1, inner = .44, shadow = 0, grad = false } = {}) {
    if (alpha <= .004) return; g.save(); g.globalAlpha = alpha;
    if (shadow) { g.shadowColor = 'rgba(255,205,110,.75)'; g.shadowBlur = shadow; }
    starPath(g, cx, cy, R, n, inner, rot);
    if (grad) { const gr = g.createLinearGradient(cx, cy - R, cx, cy + R); gr.addColorStop(0, P.goldL); gr.addColorStop(.55, P.gold); gr.addColorStop(1, P.goldD); g.fillStyle = gr; } else g.fillStyle = color;
    g.fill(); g.restore();
  }
  // تاج ذهبي يُثبَّت على البورتريه
  function crown(cx, cy, s, k, { rot = 0, alpha = 1, shine = 0 } = {}) {
    if (k <= .002 || alpha <= .002) return;
    const w = 300 * s, h = 190 * s;
    g.save(); g.globalAlpha = alpha; g.translate(cx, cy); g.rotate(rot); g.scale(1, k);
    g.translate(0, (1 - k) * -80 * s);
    g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 26 * s; g.shadowOffsetY = 12 * s;
    // القاعدة
    const gr = g.createLinearGradient(0, -h * .5, 0, h * .55); gr.addColorStop(0, P.goldL); gr.addColorStop(.45, P.gold); gr.addColorStop(1, P.goldD);
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(-w / 2, h * .18); g.lineTo(-w / 2, -h * .3);
    g.lineTo(-w * .28, h * -.02); g.lineTo(-w * .06, -h * .42); g.lineTo(w * .06, -h * .06);
    g.lineTo(w * .28, -h * .44); g.lineTo(w * .5, -h * .06); g.lineTo(w / 2, h * .18);
    g.closePath(); g.fill();
    g.shadowColor = 'transparent';
    // اللمعة
    g.fillStyle = 'rgba(255,250,230,.32)'; g.beginPath(); g.moveTo(-w / 2, h * .18); g.lineTo(-w / 2, -h * .3); g.lineTo(-w * .3, h * .04); g.lineTo(-w * .3, h * .18); g.closePath(); g.fill();
    // كرات على الرؤوس
    for (const [px, py, r] of [[-w / 2, -h * .34, 17 * s], [-w * .06, -h * .46, 15 * s], [w * .28, -h * .48, 17 * s], [w / 2, -h * .1, 14 * s]]) {
      const g2 = g.createRadialGradient(px - r * .3, py - r * .35, r * .15, px, py, r); g2.addColorStop(0, '#fff6d8'); g2.addColorStop(.6, P.goldL); g2.addColorStop(1, P.goldD);
      g.fillStyle = g2; g.beginPath(); g.arc(px, py, r, 0, TAU); g.fill(); }
    // حزام
    g.fillStyle = P.navy; g.beginPath(); g.moveTo(-w / 2, h * .1); g.lineTo(w / 2, h * .1); g.lineTo(w / 2, h * .26); g.lineTo(-w / 2, h * .26); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(-w / 2, h * .1, w, 5 * s);
    g.fillStyle = P.goldL; g.beginPath(); g.arc(0, h * .18, 13 * s, 0, TAU); g.fill();
    // جواهر
    g.fillStyle = P.teal; for (const px of [-w * .3, 0, w * .3]) { starPath(g, px, h * .18, 9 * s, 4, .4); g.fill(); }
    if (shine > 0) { // بريق يعبر التاج
      g.save(); g.globalCompositeOperation = 'lighter'; g.translate(-w * .8 + shine * w * 1.6, 0); g.rotate(-.5);
      const lg = g.createLinearGradient(-40 * s, 0, 40 * s, 0); lg.addColorStop(0, 'rgba(255,255,240,0)'); lg.addColorStop(.5, 'rgba(255,252,235,.85)'); lg.addColorStop(1, 'rgba(255,255,240,0)');
      g.fillStyle = lg; g.fillRect(-46 * s, -h, 92 * s, h * 2); g.restore(); }
    g.restore();
  }
  // غصن غار (يُرسم بالكامل ثم يُفتح تدريجيًا)
  function laurel(cx, cy, R, k, { alpha = 1, color = P.gold, leaves = 9, w = 6, flip = 1, closed = false } = {}) {
    if (k <= .002) return; const kk = clamp(k);
    g.save(); g.globalAlpha = alpha; g.strokeStyle = color; g.fillStyle = color; g.lineWidth = w; g.lineCap = 'round';
    for (const dir of (closed ? [flip] : [-1, 1])) {
      const a0 = dir < 0 ? -Math.PI * .72 : -Math.PI * .28, a1 = dir < 0 ? Math.PI * .34 : Math.PI * .66;
      // الساق
      g.beginPath();
      for (let i = 0; i <= 22; i++) { const u = i / 22 * kk, a = lerp(a0, a1, u), rr = R * (1 + .06 * Math.sin(u * 5)); const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr * .96; i ? g.lineTo(px, py) : g.moveTo(px, py); }
      g.stroke();
      // الأوراق
      for (let i = 0; i <= leaves; i++) { const u = i / leaves; if (u > kk) break; const a = lerp(a0, a1, u), rr = R * (1 + .06 * Math.sin(u * 5));
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr * .96, L = 34 * (1 - .35 * u) * (R / 300);
        g.save(); g.translate(px, py); g.rotate(a + dir * .75); g.beginPath(); g.ellipse(L * .6, 0, L, L * .32, 0, 0, TAU); g.fill(); g.restore(); }
    }
    g.restore();
  }
  // نجوم صغيرة تلمع (بريق لحظي)
  function twinkle(cx, cy, t, t0, { n = 3, R = 60, color = '#fff8e0', size = 16, seed = 3, dur = .5 } = {}) {
    const r = rng(seed), k = clamp((t - t0) / dur); if (k <= 0 || k >= 1) return;
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.sin(k * Math.PI) * .9;
    for (let i = 0; i < n; i++) { const a = r() * TAU, d = R * (.3 + r() * .7), px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d, s = size * (.5 + r() * .8);
      g.save(); g.translate(px, py); g.rotate(a);
      const lg = g.createLinearGradient(-s * 2, 0, s * 2, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.5, color); lg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = lg; g.fillRect(-s * 2, -s * .14, s * 4, s * .28); g.fillRect(-s * .14, -s * 2, s * .28, s * 4); g.restore(); }
    g.restore();
  }
  // غبار/بريق عائم في ضوء النافذة (بطيء جدًا، طبقة عمق أولى)
  function motes(t, { n = 26, seed = 11, alpha = .5, color = '255,235,190', y0 = 0, y1 = H, size = 3.2 } = {}) {
    const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const bx = r() * W, by = y0 + r() * (y1 - y0), vx = 6 + r() * 12, vy = -(3 + r() * 9), ph = r() * 10, s = size * (.5 + r() * 1.1);
      const x = ((bx + vx * t) % (W + 80) + W + 80) % (W + 80) - 40;
      const y = ((by + vy * t) % (y1 - y0 + 80) + (y1 - y0) + 80) % (y1 - y0 + 80) + y0 - 40;
      const a = alpha * (.25 + .75 * Math.max(0, Math.sin(t * .5 + ph)));
      const gr = g.createRadialGradient(x, y, 0, x, y, s * 3.4); gr.addColorStop(0, `rgba(${color},${a})`); gr.addColorStop(1, `rgba(${color},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, s * 3.4, 0, TAU); g.fill();
    }
    g.restore();
  }
  // كونفيتي ورقي: انفجار بدفعة + جذب + ترفرف
  function confetti(t, t0, { x = W / 2, y = H * .5, n = 46, seed = 7, power = 1, spread = Math.PI, colors = null, grav = 620, dur = 2.6, size = 1 } = {}) {
    const r = rng(seed), cs = colors || [P.gold, P.goldL, P.navy, P.navyL, P.teal, P.green, P.red, '#f6eeda'];
    g.save();
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (r() - .5) * spread, sp = (420 + r() * 760) * power, vx = Math.cos(a) * sp, vy = Math.sin(a) * sp * .92;
      const tt = t - t0 - r() * .16; if (tt < 0 || tt > dur) continue;
      const px = x + vx * tt + Math.sin(tt * (3.4 + r() * 3) + i) * 24 * (1 - tt / dur * .4);
      const py = y + vy * tt + .5 * grav * tt * tt;
      const rot = (r() * TAU) + tt * (3 + r() * 5) * (r() < .5 ? 1 : -1);
      const w = (13 + r() * 16) * size, h = w * (.42 + r() * .5);
      const fade = 1 - clamp((tt - dur * .62) / (dur * .38));
      g.save(); g.globalAlpha = fade; g.translate(px, py); g.rotate(rot);
      g.fillStyle = cs[i % cs.length]; const sq = Math.abs(Math.cos(rot * 2.1));
      g.fillRect(-w / 2, -h / 2 * sq - 1, w, h * sq + 2); g.restore();
    }
    g.restore();
  }
  // شريط/لافتة (يُرسم كنص مُخزّن ثم يُفتح)
  function ribbonCanvas(text, { size = 64, tone = 'navy', font = 'Kufam', weight = 800, padX = 64, padY = 30, tail = 46 } = {}) {
    const m = mk(8, 8).getContext('2d'); m.font = `${weight} ${size}px ${font}`; m.direction = 'rtl';
    const tw2 = Math.ceil(m.measureText(text).width), w = tw2 + padX * 2, h = size * 1.62 + padY * 2;
    const c = mk(w + tail * 2 + 80, h + 80), x = c.getContext('2d'); x.translate(tail + 40, 40);
    const fill = tone === 'gold' ? P.gold : tone === 'navy' ? P.navy : tone === 'teal' ? P.teal : tone === 'cream' ? P.paper : tone;
    const ink = tone === 'gold' ? P.navy : P.paper;
    x.save(); x.shadowColor = 'rgba(20,10,0,.45)'; x.shadowBlur = 18; x.shadowOffsetY = 8;
    // الذيلان
    x.fillStyle = tone === 'gold' ? P.goldD : 'rgba(0,0,0,.35)';
    for (const dir of [-1, 1]) { x.beginPath(); x.moveTo(dir * (w / 2 - 6), h * .22); x.lineTo(dir * (w / 2 + tail), h * .1); x.lineTo(dir * (w / 2 + tail), h * .9); x.lineTo(dir * (w / 2 - 6), h * .78); x.closePath(); x.fill(); }
    x.restore();
    // الجسم
    const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, tone === 'gold' ? P.goldL : fill); gr.addColorStop(1, tone === 'gold' ? P.gold : fill);
    x.fillStyle = gr; x.beginPath(); x.moveTo(-w / 2, 0); x.lineTo(w / 2, 0); x.lineTo(w / 2, h); x.lineTo(-w / 2, h); x.closePath(); x.fill();
    x.strokeStyle = tone === 'gold' ? 'rgba(120,80,20,.5)' : 'rgba(255,255,255,.28)'; x.lineWidth = 3; x.stroke();
    x.fillStyle = tone === 'navy' || tone === 'teal' ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.22)'; x.fillRect(-w / 2, 0, w, h * .42);
    x.font = `${weight} ${size}px ${font}`; x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = ink;
    x.fillText(text, 0, h / 2 + 2);
    return { c, w, h, tail };
  }
  function drawRibbon(R, x, y, { k = 1, rot = 0, sc = 1, alpha = 1 } = {}) {
    if (k <= .002) return; const kk = clamp(k);
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha = alpha;
    g.beginPath(); g.rect(-R.c.width / 2, -R.c.height / 2, R.c.width * kk, R.c.height); g.clip();
    g.translate(-(1 - kk) * R.c.width / 2, 0);
    g.drawImage(R.c, -R.c.width / 2, -R.c.height / 2); g.restore();
  }
  // ختم/طبق دائري (يُستخدم للترتيب وشعار المدرسة)
  function sealCanvas({ r = 150, text = '', sub = '', tone = 'navy', font = 'Kufam', inner = null } = {}) {
    const c = mk(r * 2 + 40, r * 2 + 40), x = c.getContext('2d'); x.translate(r + 20, r + 20);
    const main = tone === 'gold' ? P.gold : tone === 'cream' ? P.paper : tone === 'red' ? P.red : P.navy;
    const onMain = tone === 'gold' || tone === 'cream' ? P.navy : P.paper;
    x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 22; x.shadowOffsetY = 10;
    x.fillStyle = main; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill(); x.restore();
    x.strokeStyle = tone === 'gold' ? P.goldD : 'rgba(255,255,255,.55)'; x.lineWidth = 5; x.beginPath(); x.arc(0, 0, r - 4, 0, TAU); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 2; x.beginPath(); x.arc(0, 0, r - 22, 0, TAU); x.stroke();
    // مخرّزات على الحافة
    x.save(); x.fillStyle = tone === 'gold' ? P.goldD : 'rgba(255,255,255,.22)';
    for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; x.save(); x.rotate(a); x.fillRect(r - 14, -2.4, 9, 4.8); x.restore(); } x.restore();
    if (inner) { x.save(); x.translate(-r * .52, -r * .1); inner(x, r * 1.04); x.restore(); }
    if (text) { x.font = `800 ${Math.round(r * .52)}px ${font}`; x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = onMain; x.fillText(text, 0, sub ? -r * .06 : r * .04); }
    if (sub) { x.font = `700 ${Math.round(r * .2)}px ${font}`; x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = tone === 'gold' || tone === 'cream' ? P.goldD : 'rgba(255,255,255,.8)'; x.fillText(sub, 0, r * .42); }
    return c;
  }
  // الشعار داخل حلقة ذهبية (شعار المدرسة)
  function logoSeal(r = 190, { ring = P.gold, bg = P.paper } = {}) {
    const c = mk(r * 2 + 40, r * 2 + 40), x = c.getContext('2d'); x.translate(r + 20, r + 20);
    x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 24; x.shadowOffsetY = 10;
    x.fillStyle = bg; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill(); x.restore();
    x.strokeStyle = ring; x.lineWidth = r * .062; x.beginPath(); x.arc(0, 0, r - r * .04, 0, TAU); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 2; x.beginPath(); x.arc(0, 0, r - r * .1, 0, TAU); x.stroke();
    if (A.logo) { const s = Math.min(r * 1.7 / A.logo.width, r * 1.7 / A.logo.height); x.drawImage(A.logo, -A.logo.width * s / 2, -A.logo.height * s / 2, A.logo.width * s, A.logo.height * s); }
    return c;
  }

  // ═══ 4 · صور حيّة (مقاطع الطلاب) — إطارات مُستخرجة مسبقًا ═════════════════
  const LIVE = { meta: {} };
  async function loadLive(id, n = 24) {
    const arr = []; LIVE.meta[id] = { n, t0: 0, dt: 1 / 12 };
    for (let i = 0; i < n; i++) { const k = 'live_' + id + '_' + String(i).padStart(2, '0'); await loadImg(k, `../assets/real/live/${id}/${String(i).padStart(2, '0')}.jpg`); arr.push(A[k]); }
    LIVE[id] = arr;
  }
  // نافذة الصورة الحيّة: يمتصّ بين إطارين (12fps → 30fps) = حركة ناعمة كالحلم
  function liveDraw(id, u, { x, y, w, h, alpha = 1, rot = 0, sc = 1, seed = 5, grain = true } = {}) {
    const arr = LIVE[id]; if (!arr || !arr.length || !arr[0]) return;
    const f = clamp(u) * (arr.length - 1), i0 = Math.floor(f), i1 = Math.min(arr.length - 1, i0 + 1), k = f - i0;
    g.save(); g.globalAlpha = alpha; g.translate(x, y); g.rotate(rot); g.scale(sc, sc);
    g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip();
    g.drawImage(arr[i0], -w / 2, -h / 2, w, h);
    if (k > 0) { g.globalAlpha = alpha * k; g.drawImage(arr[i1], -w / 2, -h / 2, w, h); g.globalAlpha = alpha; }
    // معالجة: دفء + تدرّج خفيف أسفل الإطار
    g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,190,110,.18)'; g.fillRect(-w / 2, -h / 2, w, h);
    g.globalCompositeOperation = 'source-over';
    const gr = g.createLinearGradient(0, h * .16, 0, h / 2); gr.addColorStop(0, 'rgba(24,12,2,0)'); gr.addColorStop(1, 'rgba(24,12,2,.32)'); g.fillStyle = gr; g.fillRect(-w / 2, h * .1, w, h * .5);
    if (grain) { const r = rng(seed + i0); for (let i = 0; i < 120; i++) { g.fillStyle = r() < .5 ? 'rgba(255,255,255,.045)' : 'rgba(0,0,0,.05)'; g.fillRect(-w / 2 + r() * w, -h / 2 + r() * h, 1.5, 1.5); } }
    g.restore();
  }

  // ═══ 5 · كاميرا ══════════════════════════════════════════════════════════
  // st: {x, y, s, rot} — النقطة التي تقع في مركز الإطار
  function cam(st, fn) { g.save(); g.translate(W / 2, H / 2); g.rotate(st.rot || 0); g.scale(st.s || 1, st.s || 1); g.translate(-st.x, -st.y); fn(); g.restore(); }
  function camAt(t, keys) { return { x: kf(t, keys.x), y: kf(t, keys.y), s: keys.s ? kf(t, keys.s) : 1, rot: keys.rot ? kf(t, keys.rot) : 0 }; }
  // رجّة عدسة (تستخدم للإيقاعات الثقيلة: ختم، ارتطام، انفجار)
  const lensShake = (t, t0, amp = 10, f = 26, dec = 7) => { if (t < t0) return [0, 0, 0]; const u = t - t0; return [Math.sin(u * f) * amp * Math.exp(-u * dec), Math.cos(u * f * 1.4) * amp * .7 * Math.exp(-u * dec), Math.sin(u * f * .8) * .004 * amp * Math.exp(-u * dec)]; };

  // ═══ 6 · المظهر العام (post) ═════════════════════════════════════════════
  function finish(t, { grain = .034, vig = .4, warm = .1 } = {}) {
    // دفء سينمائي
    g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(255,196,124,${warm})`; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(255,238,214,.985)'; g.fillRect(0, 0, W, H); g.restore();
    fxGrain(t, grain, 'overlay', 24);
    fxVignette(vig, { inner: .5 });
  }

  // ═══ 7 · نص ══════════════════════════════════════════════════════════════
  const FONTS = { d: 'Baloo', u: 'Almarai', n: 'Alexandria', b: 'Kufam', p: 'Marhey', t: 'Lalezar' };
  // كلمة مُخزّنة
  const W_ = (text, o = {}) => KT.word(text, Object.assign({ font: FONTS.d, weight: 800 }, o));
  // عرض نص مع افتراضات الفيلم
  function say(Wd, t, o) { return KT.show(Wd, t, Object.assign({ in: 'rise', dist: 46, spring: 'card', fade: .26 }, o)); }
  // جملة كبيرة بتدرّج ذهبي (تُستخدم للعبارات البطلة)
  function goldWord(text, o = {}) {
    const wd = KT.word(text, Object.assign({ font: FONTS.d, weight: 800, size: 150, color: P.navy }, o));
    const gd = goldify(wd.img); const out = Object.assign({}, wd, { img: gd }); return out;
  }
  // سطر نصّي داخل مساحة ضيقة (يلتفّ على أسطر) — يعيد canvas جاهزًا
  function multiline(lines, { size = 48, font = FONTS.u, weight = 700, color = P.paper, lh = 1.5, align = 'right', maxW = 0 } = {}) {
    const m = mk(8, 8).getContext('2d'); m.font = `${weight} ${size}px ${font}`; m.direction = 'rtl';
    const w = Math.max(...lines.map((l) => m.measureText(l).width)); const H2 = Math.ceil(size * lh * lines.length);
    const c = mk(Math.ceil(w) + 8, H2 + 8), x = c.getContext('2d');
    x.font = `${weight} ${size}px ${font}`; x.direction = 'rtl'; x.textBaseline = 'middle'; x.fillStyle = color;
    lines.forEach((l, i) => { const lw = x.measureText(l).width; x.textAlign = 'right'; x.fillText(l, align === 'right' ? c.width - 4 : align === 'center' ? c.width / 2 : 4, size * (.62 + i * lh)); });
    return c;
  }

  // ═══ 8 · انتقالات البيت (تسجّل في TRANS الخاص بالمحرك) ═══════════════════
  // كشط الورقة: ورقة تُكشط من الأمام فتظهر اللقطة الجديدة
  function registerTransitions() {
    TRANS.paperTear = { dur: .62, draw(k, drawOut, o) {
      const IN = _inBuf(), OUT = renderOut(drawOut), e = CURVE.camera(k), xl = lerp(-180, W + 180, e);
      const pts = [[xl, -40]]; const r = rng((o.i || 1) * 13 + 5);
      for (let y = 0; y <= H + 80; y += 74) pts.push([xl + (r() - .5) * 54, y]);
      pts.push([xl, H + 60], [W + 300, H + 60], [W + 300, -60]);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
      g.drawImage(IN, 0, 0);
      g.save(); g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); g.closePath(); g.clip();
      g.drawImage(OUT, 0, 0);
      g.filter = 'blur(3px)'; g.globalAlpha = .55; g.drawImage(OUT, -14, 0);
      g.restore();
      // حافة الورق الليفية + ظلّها
      g.save(); g.strokeStyle = 'rgba(250,244,228,.92)'; g.lineWidth = 7; g.beginPath(); pts.slice(0, -3).forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); g.stroke(); g.restore();
      g.save(); g.filter = 'blur(14px)'; g.globalAlpha = .5; g.fillStyle = '#000';
      g.beginPath(); pts.slice(0, -3).forEach(([px, py], i) => i ? g.lineTo(px + 26, py) : g.moveTo(px + 26, py)); g.lineTo(xl + 26, H + 60); g.closePath(); g.fill(); g.restore();
      g.restore();
    } };
    // شريط لاصق يمرّ ويقلب اللقطة
    TRANS.tapeZip = { dur: .5, draw(k, drawOut, o) {
      const IN = _inBuf(), OUT = renderOut(drawOut), e = CURVE.md3Emph(k), y = lerp(-H * .2, H * 1.2, e);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(OUT, 0, 0);
      g.save(); g.beginPath(); g.rect(0, y, W, H); g.clip(); g.drawImage(IN, 0, 0); g.restore();
      const t = A.tape7 || null;
      g.save(); g.translate(W / 2, y); g.rotate(-.06);
      g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; g.shadowOffsetY = 10;
      if (t) g.drawImage(t, -W * .75, -46, W * 1.5, 92); else { g.fillStyle = 'rgba(225,205,160,.9)'; g.fillRect(-W * .75, -40, W * 1.5, 80); }
      g.restore(); g.restore();
    } };
    // انقلاب صفحة الدفتر
    TRANS.pageFlip = { dur: .7, draw(k, drawOut, o) {
      const IN = _inBuf(), OUT = renderOut(drawOut), e = E.cubicInOut(clamp(k * 1.06));
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(IN, 0, 0);
      g.save(); g.translate(W, 0); const sq = Math.cos(e * Math.PI * .5);
      g.transform(sq, 0, 0, 1, 0, 0); g.translate(-W, 0);
      g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 34; g.shadowOffsetX = -24;
      g.drawImage(OUT, 0, 0);
      g.globalCompositeOperation = 'multiply'; g.fillStyle = `rgba(120,90,50,${.25 * Math.sin(e * Math.PI)})`; g.fillRect(0, 0, W, H);
      g.restore(); g.restore();
    } };
    // طائرة ورقية تعبر الشاشة وتكشف اللقطة
    TRANS.kiteWipe = { dur: .66, draw(k, drawOut, o) {
      const IN = _inBuf(), OUT = renderOut(drawOut), e = CURVE.camera(k);
      const x = lerp(W + 320, -420, e), y = lerp(H * .78, H * .2, e);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(IN, 0, 0);
      g.save(); const R = (1 - e) * 1.1;
      g.beginPath(); g.moveTo(x, y); g.arc(x, y, Math.max(W, H) * (1 + R), MATH_PI, MATH_PI + TAU * Math.min(1, e * 1.8)); g.closePath(); g.clip();
      // ملاحظة: نكشف المنطقة اليمنى أولًا (الشاشة العربية)
      g.restore();
      // بسيط ومضمون: كشف رأسي قطري
      g.save(); g.beginPath();
      g.moveTo(x - 260, 0); g.lineTo(W + 300, 0); g.lineTo(W + 300, H + 300); g.lineTo(x - 260 - 260, H + 300); g.closePath(); g.clip();
      g.drawImage(OUT, 0, 0); g.restore();
      drawKite(x, y, 1.5, -.28, o.t || 0, { tail: 1 });
      g.restore();
    } };
  }
  const MATH_PI = Math.PI;

  // ═══ 9 · طائرة ورقية ═════════════════════════════════════════════════════
  function drawKite(x, y, sc, rot, t, { tail = 1, alpha = 1, color = P.red, color2 = P.paper } = {}) {
    g.save(); g.globalAlpha = alpha; g.translate(x, y); g.rotate(rot); g.scale(sc, sc);
    if (tail) { // ذيل متعرّج
      g.strokeStyle = 'rgba(60,40,20,.5)'; g.lineWidth = 3 / sc; g.beginPath();
      for (let i = 0; i <= 26; i++) { const u = i / 26, yy = 120 + u * 420 * tail, xx = Math.sin(u * 7 + t * 2.4) * 26 * u; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke();
      for (let i = 1; i <= 5; i++) { const u = i / 6, yy = 120 + u * 420 * tail, xx = Math.sin(u * 7 + t * 2.4) * 26 * u;
        g.fillStyle = i % 2 ? P.gold : color; g.beginPath(); g.moveTo(xx - 14, yy); g.lineTo(xx + 14, yy); g.lineTo(xx, yy + 26); g.closePath(); g.fill(); }
    }
    g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 18; g.shadowOffsetY = 8;
    const s = 190;
    g.beginPath(); g.moveTo(0, -s * .62); g.lineTo(s * .46, 0); g.lineTo(0, s * .62); g.lineTo(-s * .46, 0); g.closePath();
    g.fillStyle = color; g.fill();
    g.shadowColor = 'transparent';
    g.fillStyle = color2; g.beginPath(); g.moveTo(0, -s * .62); g.lineTo(s * .46, 0); g.lineTo(0, s * .16); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(-s * .46, 0); g.lineTo(0, s * .62); g.lineTo(0, s * .16); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(40,24,8,.55)'; g.lineWidth = 4 / sc; g.beginPath(); g.moveTo(0, -s * .62); g.lineTo(0, s * .62); g.moveTo(-s * .46, 0); g.lineTo(s * .46, 0); g.stroke();
    g.restore();
  }

  // ═══ 10 · خطوط ذهبية (رسم تدريجي) ══════════════════════════════════════
  function goldPath(pts, k, { width = 6, color = P.gold, glow = 0, dash = null, alpha = 1 } = {}) {
    if (k <= .002) return; const kk = clamp(k);
    // قصّ المسار عند النسبة kk
    const seg = []; let total = 0; const L = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); total += d; }
    let want = total * kk; seg.push(pts[0]);
    for (let i = 0; i < L.length; i++) { if (want <= 0) break; const u = Math.min(1, want / L[i]);
      seg.push([lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)]); want -= L[i] * u; }
    g.save(); g.globalAlpha = alpha; g.lineCap = 'round'; g.lineJoin = 'round';
    if (glow) { g.shadowColor = 'rgba(255,214,120,.9)'; g.shadowBlur = glow; }
    g.strokeStyle = color; g.lineWidth = width; if (dash) g.setLineDash(dash);
    g.beginPath(); seg.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore();
  }


  // ═══ 11 · عدة VOX: كشف بتمزيق داخل اللقطة، أسهم ومسارات، طبقات Parallax، نصّ التعليق ═══
  // كشف ورقي (تُمزَّق قطعة الورق داخل اللقطة لتظهر صورة/نص تحتها)
  function tearReveal(x, y, w, h, k, seed, { draw, dir = 'ltr', rough = 14, tearW = 1, edge = true } = {}) {
    if (k <= .002) return; const kk = clamp(k), r = rng(seed);
    const jag = []; for (let i = 0; i <= 16; i++) jag.push((r() - .5) * rough * 2);
    const xl = dir === 'ltr' ? x - w / 2 - 60 + kk * (w + 120 + 60) : x + w / 2 + 60 - kk * (w + 120 + 60);
    g.save();
    g.beginPath();
    if (dir === 'ltr') { g.moveTo(x - w / 2 - 80, y - h / 2 - 40); g.lineTo(xl, y - h / 2 - 40);
      for (let i = 0; i <= 16; i++) g.lineTo(xl + jag[i], y - h / 2 + (h / 16) * i);
      g.lineTo(xl, y + h / 2 + 40); g.lineTo(x - w / 2 - 80, y + h / 2 + 40); }
    else { g.moveTo(x + w / 2 + 80, y - h / 2 - 40); g.lineTo(xl, y - h / 2 - 40);
      for (let i = 0; i <= 16; i++) g.lineTo(xl + jag[i], y - h / 2 + (h / 16) * i);
      g.lineTo(xl, y + h / 2 + 40); g.lineTo(x + w / 2 + 80, y + h / 2 + 40); }
    g.closePath(); g.clip();
    if (draw) draw(x, y, w, h, kk);
    g.restore();
    // حافة ورقية ممزّقة + ظلّ
    if (edge && kk < .999) {
      g.save(); g.beginPath(); const xs = xl;
      for (let i = 0; i <= 16; i++) { const px = xs + jag[i], py = y - h / 2 + (h / 16) * i; i ? g.lineTo(px, py) : g.moveTo(px, py); }
      g.strokeStyle = 'rgba(250,244,228,.95)'; g.lineWidth = 6 * tearW; g.stroke();
      g.strokeStyle = 'rgba(120,88,40,.4)'; g.lineWidth = 1.6; g.stroke(); g.restore();
      g.save(); g.filter = 'blur(12px)'; g.globalAlpha = .45; g.fillStyle = '#000';
      g.beginPath(); for (let i = 0; i <= 16; i++) { const px = xl + jag[i] + 14, py = y - h / 2 + (h / 16) * i; i ? g.lineTo(px, py) : g.moveTo(px, py); }
      g.lineTo(xl + 14, y + h / 2 + 30); g.lineTo(xl - 30, y + h / 2 + 30); g.lineTo(xl - 30, y - h / 2 - 30); g.closePath(); g.fill(); g.restore();
    }
  }
  // سهم مرسوم باليد (بلا انحناءات حادة) — يعمل مع RTL
  function arrow(pts, k, { width = 9, color = null, head = 1, wobble = 5, seed = 3, alpha = 1, glow = 0 } = {}) {
    if (k <= .002) return; const kk = clamp(k), col = color || P.goldD;
    const r = rng(seed);
    const jp = pts.map(([x, y], i) => [x + (r() - .5) * wobble, y + (r() - .5) * wobble]);
    // ذيل + رأس
    const n = jp.length - 1, tail = jp.slice(0, -1), tip = jp[n];
    const seg = [], L = []; let tot = 0;
    for (let i = 1; i < jp.length; i++) { const d = Math.hypot(jp[i][0] - jp[i-1][0], jp[i][1] - jp[i-1][1]); L.push(d); tot += d; }
    let want = tot * kk; seg.push(jp[0]);
    for (let i = 0; i < L.length; i++) { if (want <= 0) break; const u = Math.min(1, want / L[i]);
      seg.push([lerp(jp[i][0], jp[i+1][0], u), lerp(jp[i][1], jp[i+1][1], u)]); want -= L[i] * u; }
    g.save(); g.globalAlpha = alpha; g.lineCap = 'round'; g.lineJoin = 'round';
    if (glow) { g.shadowColor = 'rgba(255,210,120,.75)'; g.shadowBlur = glow; }
    g.strokeStyle = col; g.lineWidth = width;
    g.beginPath(); seg.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    // رأس السهم عند وصول الرسم
    const kh = clamp((kk - .82) / .18);
    if (kh > 0) { const p1 = jp[n], p0 = jp[n - 1], a = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), hs = 40 * head * kh;
      g.save(); g.translate(p1[0], p1[1]); g.rotate(a); g.fillStyle = col;
      g.beginPath(); g.moveTo(0, 0); g.lineTo(-hs, -hs * .48); g.lineTo(-hs * .78, 0); g.lineTo(-hs, hs * .48); g.closePath(); g.fill(); g.restore(); }
    g.restore();
  }
  // مسار منقّط بنقطة تسير عليه (VOX route)
  function route(pts, k, { color = P.goldD, width = 4, dot = 20, dash = [14, 14], seed = 5, alpha = 1 } = {}) {
    if (k <= .002) return; const kk = clamp(k);
    g.save(); g.globalAlpha = alpha; g.setLineDash(dash); g.lineCap = 'round';
    g.strokeStyle = color; g.lineWidth = width; g.beginPath();
    pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.setLineDash([]);
    // النقطة المتحركة
    const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); L.push(d); tot += d; }
    let want = tot * kk, cur = pts[0];
    for (let i = 0; i < L.length; i++) { if (want <= L[i]) { const u = want / L[i]; cur = [lerp(pts[i][0], pts[i+1][0], u), lerp(pts[i][1], pts[i+1][1], u)]; break; } want -= L[i]; }
    g.fillStyle = color; g.shadowColor = 'rgba(255,210,120,.8)'; g.shadowBlur = 14;
    g.beginPath(); g.arc(cur[0], cur[1], dot * .5, 0, TAU); g.fill(); g.restore();
  }
  // طبقات Parallax: fc(i) يعيد دالة رسم تُنفَّذ مع إزاحة تتناسب مع حركة الكاميرا
  function parallax(fn, st, { depth = .3, blur = 0, alpha = 1 } = {}) {
    g.save(); g.globalAlpha = alpha;
    g.translate(-(st.x - 540) * depth, -(st.y - 1030) * depth);
    if (st.s && Math.abs(st.s - 1) > .001) { const s2 = 1 + (st.s - 1) * depth; g.translate(540, 1030); g.scale(s2, s2); g.translate(-540, -1030); }
    if (blur) g.filter = `blur(${blur}px)`;
    fn(); g.restore();
  }
  // نصّ التعليق: كلمة بكلمة على إيقاع النطق (VOX: الجملة تبني نفسها)
  const _voCache = {};
  function voWords(lineIdx, t, o = {}) {
    const { x = 540, y = 1000, size = 76, font = null, weight = 800, color = null, hiMap = null,
      maxW = 900, lh = 1.32, align = 'center', mode = 'rise', gap = 26, dimAfter = 0, sc = 1, alpha = 1, range = null } = o;
    const line = VO_WORDS[lineIdx]; if (!line) return null;
    let i0 = range ? range[0] : 0, i1 = range ? range[1] : line.words.length - 1;
    if (o.within) { const [a, b] = o.within; let f = -1, l = -1;
      line.words.forEach((wd, i) => { const tt = wd.t + VO_OFFSET; if (tt >= a - .05 && tt <= b + .3) { if (f < 0) f = i; l = i; } });
      if (f < 0) return null; i0 = f; i1 = l; }
    const fnt = font || FONTS.d, col = color || P.paper;
    // بناء صور الكلمات + القياس
    const colOf = (i) => (hiMap && hiMap[i]) || col;
    const imgs = line.words.map((wd, i) => { if (i < i0 || i > i1) return { img: { width: 0, height: 0 }, empty: true };
      const c2 = colOf(i), key = [wd.w, size, fnt, weight, c2].join('|');
      if (!_voCache[key]) _voCache[key] = KT.word(wd.w, { size, font: fnt, weight, color: c2 }); return _voCache[key]; });
    // تخطيط الأسطر (RTL)
    const linesArr = [[]]; let curW = 0;
    imgs.forEach((im, i) => { if (im.empty) return; const w2 = im.img.width + gap;
      if (curW + w2 > maxW && linesArr[linesArr.length - 1].length) { linesArr.push([]); curW = 0; }
      linesArr[linesArr.length - 1].push({ im, w: w2, i }); curW += w2; });
    const H2 = Math.max(1, linesArr.length) * size * lh;
    let ty = y - H2 / 2 + size * .5;
    linesArr.forEach((row) => {
      const tot = row.reduce((a, r2) => a + r2.w, 0);
      let tx = align === 'center' ? x + tot / 2 - gap / 2 : align === 'right' ? x + tot - gap : x;
      row.forEach(({ im, w: w2, i }) => {
        if (im.empty || !im.img.width) return;
        const wd = line.words[i], t0 = wd.t + VO_OFFSET;
        const k = spring(t - t0, 320, 26);
        const isLast = i === line.words.length - 1;
        const late = dimAfter && t > t0 + dimAfter;
        const box = im.img;
        if (k > .002) {
          g.save(); g.globalAlpha = alpha * clamp(k * 2);
          g.translate(tx - w2 / 2 + gap / 2, ty + (1 - k) * (mode === 'drop' ? -34 : 34));
          const s3 = sc * lerp(mode === 'pop' ? .72 : .88, 1, k);
          g.scale(s3, s3);
          if (late) { g.globalAlpha *= .55; }
          g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 14; g.shadowOffsetY = 6;
          g.drawImage(box, -box.width / 2, -box.height / 2); g.restore();
          // لمعة على الكلمة المؤكَّدة
          if (late && dimAfter && t < t0 + dimAfter + .25) { g.save(); g.globalAlpha = alpha; K7twinkleAt(tx, ty - size * .1, t, t0 + dimAfter, size * .5); g.restore(); }
        }
        tx -= w2;
      });
      ty += size * lh;
    });
    return { y, h: H2 };
  }
  const K7twinkleAt = (x, y, t, t0, R) => twinkle(x, y, t, t0, { n: 1, R: R * .4, dur: .5, size: 14, seed: (x | 0) % 97 });
  return { sheet, drawSheet, tearReveal, arrow, route, parallax, voWords, tornPts, pathPts, photoCard, tapeCanvas, drawTape, star, starPath, crown, laurel, twinkle, motes,
    confetti, ribbonCanvas, drawRibbon, sealCanvas, logoSeal, LIVE, loadLive, liveDraw, cam, camAt, lensShake, finish,
    FONTS, W_, say, goldWord, multiline, registerTransitions, drawKite, goldPath, cap };
})();
