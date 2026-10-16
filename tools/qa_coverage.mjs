// فحص تغطية اللقطات: لا فراغ، لا تداخل، وكل مشهد يُقيَّم فعليًا (PAGE=index.html node ../tools/qa_coverage.mjs)
import { chromium } from 'playwright';
import { resolve } from 'node:path'; import { pathToFileURL } from 'node:url';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto(pathToFileURL(resolve(process.env.PAGE || 'index.html')).href);
await p.waitForFunction(() => window.ready === true, null, { timeout: 90000 });
const r = await p.evaluate(() => {
  const T = FILM.duration, list = SHOTS.map((s) => [s.a, s.b]).sort((a, b) => a[0] - b[0]);
  const gaps = [], overlaps = [];
  if (list[0][0] > 0.001) gaps.push([0, list[0][0]]);
  for (let i = 1; i < list.length; i++) {
    if (list[i][0] > list[i - 1][1] + .001) gaps.push([list[i - 1][1], list[i][0]]);
    if (list[i][0] < list[i - 1][1] - .001) overlaps.push([list[i - 1][1], list[i][0]]);
  }
  if (list[list.length - 1][1] < T - .01) gaps.push([list[list.length - 1][1], T]);
  return { T, n: list.length, gaps, overlaps, first: list[0], last: list[list.length - 1] };
});
await b.close();
console.log(`duration ${r.T}s · shots ${r.n} · span ${r.first[0]}→${r.last[1]}`);
if (r.gaps.length) console.log('GAPS:', JSON.stringify(r.gaps)); else console.log('gaps: none ✓');
if (r.overlaps.length) console.log('OVERLAPS:', JSON.stringify(r.overlaps)); else console.log('overlaps: none ✓');
if (errs.length) { console.log('PAGE ERRORS:\n  ' + errs.join('\n  ')); process.exit(1); }
