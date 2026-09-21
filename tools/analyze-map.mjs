/* Đọc ảnh bản đồ, tách nước khỏi đất, rồi cho biết mỗi điểm trong bộ dữ
 * liệu đứng trên mảnh đất nào.
 *
 * Kết quả của script này là trường thứ 7 ("khối đất") trong data/<game>.js.
 * Engine dùng nó để "⚡ Nối gần" thôi vẽ đường đi bộ xuyên biển.
 *
 * Chạy:  node tools/analyze-map.mjs [--game data/ffix.js] [--emit]
 *        --emit in ra JSON {tên điểm: id mảnh} để gắn lại vào file dữ liệu
 *
 * VÌ SAO PHẢI CHẠY NGOÀI APP: canvas bị "tainted" khi trang mở bằng
 * file://, nên app KHÔNG getImageData() được — đã đo, Chromium ném
 * SecurityError. Script này lách bằng cờ --allow-file-access-from-files,
 * thứ chỉ dùng được ở đây chứ không dùng được trên máy người dùng.
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); }
catch {
  pw = require(process.env.PLAYWRIGHT_PATH ||
    '/Users/pgd.quang/.nvm/versions/node/v22.23.2/lib/node_modules/playwright/index.js');
}
const arg = n => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i+1] : null; };
const EMIT = process.argv.includes('--emit');

const gameFile = arg('game') || 'data/ffix.js';
global.window = {};
require(path.resolve(gameFile));
const GAME = global.window.MAPGAMES[0];
const mapSrc = pathToFileURL(path.resolve(GAME.maps[0].src)).href;

const browser = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.goto(pathToFileURL(path.resolve('index.html')).href);

const out = await page.evaluate(async ({ src, seed }) => {
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('không đọc được ảnh')); img.src = src; });
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, W, H).data;

  /* Nước = xanh dương trội hẳn so với đỏ và lục. Ngưỡng này ăn được cả
     biển sâu lẫn biển nông của ảnh FF9; ảnh game khác có thể phải chỉnh. */
  const water = new Uint8Array(W * H);
  let nWater = 0;
  for (let i = 0, k = 0; k < W * H; k++, i += 4) {
    water[k] = (d[i+2] > d[i] + 18 && d[i+2] > d[i+1] + 6) ? 1 : 0;
    nWater += water[k];
  }

  /* Loang vùng 4 hướng để đánh số từng mảnh đất. */
  const lab = new Int32Array(W * H).fill(-1);
  const sizes = [];
  const qx = new Int32Array(W * H), qy = new Int32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (water[y*W+x] || lab[y*W+x] !== -1) continue;
    const id = sizes.length; let head = 0, tail = 0, n = 0;
    qx[tail] = x; qy[tail] = y; tail++; lab[y*W+x] = id;
    while (head < tail) {
      const cx = qx[head], cy = qy[head]; head++; n++;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const k = ny*W + nx;
        if (water[k] || lab[k] !== -1) continue;
        lab[k] = id; qx[tail] = nx; qy[tail] = ny; tail++;
      }
    }
    sizes.push(n);
  }

  /* Điểm rơi trúng nước (bến tàu, bãi đáp) thì lấy mảnh đất gần nhất. */
  const assign = seed.map(r => {
    const x = Math.round(r[3]*(W-1)), y = Math.round(r[4]*(H-1));
    let id = water[y*W+x] ? -1 : lab[y*W+x], dist = 0;
    if (id === -1) outer: for (let rad = 1; rad <= 60; rad++)
      for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue;
        const nx = x+dx, ny = y+dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (!water[ny*W+nx]) { id = lab[ny*W+nx]; dist = rad; break outer; }
      }
    return { name: r[2], declared: r[6] || null, id, dist };
  });

  return { W, H, pctWater: +(nWater/(W*H)*100).toFixed(1), blobs: sizes.length,
           big: sizes.map((n,i)=>({i,n})).filter(o=>o.n>2000).sort((a,b)=>b.n-a.n), assign };
}, { src: mapSrc, seed: GAME.seed });

await browser.close();

if (EMIT) {
  const m = {}; for (const a of out.assign) m[a.name] = a.id;
  console.log(JSON.stringify(m));
  process.exit(0);
}

console.log(`ảnh ${out.W}×${out.H} · nước ${out.pctWater}% · ${out.blobs} mảnh đất`);
console.log('\nMảnh lớn (>2000 px):');
for (const o of out.big.slice(0, 12)) console.log('  #' + String(o.i).padEnd(5), o.n.toLocaleString(), 'px');

const byBlob = {};
for (const a of out.assign) (byBlob[a.id] ||= []).push(a);
console.log('\nĐiểm theo mảnh đất (so với trường đã khai trong file dữ liệu):');
let mismatch = 0;
for (const [id, list] of Object.entries(byBlob).sort((a,b) => b[1].length - a[1].length)) {
  const declared = [...new Set(list.map(a => a.declared))];
  const bad = declared.length > 1;
  if (bad) mismatch++;
  console.log(`  #${String(id).padEnd(5)} ${String(list.length).padStart(2)} điểm  khai: ${declared.join(' / ')}${bad ? '  ← LỆCH' : ''}`);
  console.log('        ' + list.map(a => a.name + (a.dist ? ` (cách bờ ${a.dist}px)` : '')).join(' · '));
}
console.log(mismatch ? `\n✗ ${mismatch} mảnh có nhiều hơn một tên khai — dữ liệu và ảnh không khớp`
                     : '\n✓ mỗi mảnh đất ứng với đúng một tên khai trong file dữ liệu');
