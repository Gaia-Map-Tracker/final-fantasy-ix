/* Nghiệm thu bằng TRÌNH DUYỆT THẬT, mở qua file:// đúng như người dùng mở.
 *
 * Lint sạch hay "code nhìn đúng" không chứng minh được gì về thứ có giao
 * diện — phải mở ra, đếm phần tử thật, và chụp ảnh nhìn bằng mắt.
 *
 * Chạy:  node tools/check.mjs [--shot out.png] [--engine webkit]
 *
 * --engine webkit chạy trên engine của Safari. Đáng chạy trước khi giao:
 * [ĐO 2026-09-20] Safari qua file:// KHÔNG lưu được ảnh vào IndexedDB
 * (hỏng ở tầng giao dịch, tx.error = null) — mọi thứ khác thì bình thường.
 *
 * Cần:   npm i -g playwright  (và `playwright install chromium webkit`)
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require('playwright');
} catch {
  // playwright cài toàn cục thì không nằm trong node_modules cạnh repo
  pw = require(process.env.PLAYWRIGHT_PATH ||
    '/Users/pgd.quang/.nvm/versions/node/v22.23.2/lib/node_modules/playwright/index.js');
}
const arg = name => { const i = process.argv.indexOf('--' + name); return i > -1 ? process.argv[i + 1] : null; };
const engineName = arg('engine') || 'chromium';
const engine = pw[engineName];
if (!engine) { console.error('Không có engine "' + engineName + '"'); process.exit(2); }

/* Số đo của bản trước khi tách dữ liệu ra data/ — mọi slice phải giữ
   nguyên mấy con số này, lệch một cái là hành vi đã đổi. */
const BASELINE = {
  pins: 44, edges: 0, cats: 8, progress: '0 / 44',
  mapName: 'Bản đồ thế giới',
  mapSel: ['world'],
  linkTypes: ['walk', 'boat', 'chocobo', 'airship', 'gargant'],
  imgW: 1400, imgH: 1400,
};

const shot = arg('shot');
const url = pathToFileURL(path.resolve('index.html')).href;

console.log('· engine: ' + engineName);
const browser = await engine.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on('console', m => {
  const t = m.text();
  // WebKit kêu ca về file:// cho mọi tài nguyên thiếu; đó không phải lỗi của app
  if (m.type() === 'error' && !/Not allowed to load local resource|Failed to load resource/.test(t))
    errs.push('[console] ' + t);
});
page.on('pageerror', e => errs.push('[pageerror] ' + e.message));

await page.goto(url);
await page.waitForTimeout(1800);

const got = await page.evaluate(() => ({
  pins:      document.querySelectorAll('#pins .pin').length,
  edges:     document.querySelectorAll('#links line.edge').length,
  cats:      document.querySelectorAll('#catlist .cat').length,
  progress:  document.getElementById('pTxt').textContent,
  mapName:   document.getElementById('mapName').textContent,
  mapSel:    [...document.querySelectorAll('#mapSel option')].map(o => o.value),
  linkTypes: [...document.querySelectorAll('#linkType option')].map(o => o.value),
  imgW:      document.getElementById('mapimg').naturalWidth,
  imgH:      document.getElementById('mapimg').naturalHeight,
  fallback:  getComputedStyle(document.getElementById('fallback')).display,
  routeSec:  getComputedStyle(document.getElementById('routeSec')).display,
  progSec:   getComputedStyle(document.getElementById('progSec')).display,
}));

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let bad = 0;
for (const [k, want] of Object.entries(BASELINE)) {
  const ok = eq(got[k], want);
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗'} ${k.padEnd(10)} ${JSON.stringify(got[k])}${ok ? '' : `  ← chờ ${JSON.stringify(want)}`}`);
}
console.log(`· fallback=${got.fallback} routeSec=${got.routeSec} progSec=${got.progSec}`);

if (errs.length) { bad++; console.log('✗ lỗi trình duyệt:\n' + errs.join('\n')); }
else console.log('✓ không có lỗi console');

if (shot) { await page.screenshot({ path: shot }); console.log('· ảnh: ' + shot); }
await browser.close();

console.log(bad ? `\n✗ LỆCH ${bad} CHỖ — chưa được commit` : '\n✓ khớp baseline');
process.exit(bad ? 1 : 0);
