// Builds every image on the site into assets/media/ as WebP at 1x and 2x.
// Usage: node scripts/media.mjs <source-dir>
// <source-dir> holds the originals that are not kept in this repository:
//   avatar.jpg|webp            portrait
//   voiceflow-app.png          VoiceFlow docs/design-implementation-v031.png
//   wanxiang-home.png          Audio2Text docs/assets/home-desktop.png
//   photo-*.webp|jpg           the owner's own photographs (see PHOTOS below)
// Two screens are captured live: the ai.vibecoding terminal and an AI Work Method panel.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const SRC = process.argv[2];
if (!SRC) { console.error('usage: node scripts/media.mjs <source-dir>'); process.exit(1); }
const OUT = 'assets/media';
fs.mkdirSync(OUT, { recursive: true });

const manifest = {};

async function emit(name, input, { width, widths, crop, quality = 74, square = false } = {}) {
  let base = sharp(input).rotate();
  if (crop) {
    // Crops given as fractions (0–1) are relative to the source size.
    const src = await sharp(input).metadata();
    const abs = crop.width <= 1
      ? { left: Math.round(crop.left * src.width), top: Math.round(crop.top * src.height), width: Math.round(crop.width * src.width), height: Math.round(crop.height * src.height) }
      : crop;
    base = base.extract(abs);
  }
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  const sizes = widths
    ? widths.map((w) => Math.min(w, meta.width))
    : [...new Set([width, Math.min(width * 2, meta.width)])].filter((w) => w >= width);
  const out = {};
  for (const w of sizes) {
    const file = path.join(OUT, `${name}-${w}.webp`);
    let img = sharp(buf);
    img = square ? img.resize(w, w, { fit: 'cover', position: 'attention' }) : img.resize({ width: Math.min(w, meta.width) });
    await img.webp({ quality, effort: 6 }).toFile(file);
    const m = await sharp(file).metadata();
    out[w] = { src: `/${file}`, w: m.width, h: m.height, kb: Math.round(fs.statSync(file).size / 1024) };
  }
  manifest[name] = out;
  console.log(name, Object.values(out).map((o) => `${o.w}x${o.h} ${o.kb}KB`).join(', '));
}

const find = (re) => {
  const f = fs.readdirSync(SRC).find((n) => re.test(n));
  if (!f) throw new Error(`missing source ${re}`);
  return path.join(SRC, f);
};

// Portrait: a tight head-and-shoulders crop of the ID photo.
await emit('avatar', find(/^avatar\./), { width: 160, square: true, quality: 80, crop: { left: 152, top: 70, width: 720, height: 720 } });

// Products
await emit('voiceflow-app', find(/^voiceflow-app\./), { width: 640 });
await emit('voiceflow-app-m', find(/^voiceflow-app\./), { widths: [720], crop: { left: 300, top: 110, width: 760, height: 570 } });
await emit('wanxiang', find(/^wanxiang-home\./), { width: 640, crop: { left: 120, top: 46, width: 1200, height: 584 } });
await emit('wanxiang-m', find(/^wanxiang-home\./), { widths: [720], crop: { left: 250, top: 46, width: 940, height: 544 } });

// Photographs, in display order. Landscapes, buildings and objects only: no faces, no logos.
const PHOTOS = ['photo-aerial', 'photo-pagoda', 'photo-gate', 'photo-wall', 'photo-dusk', 'photo-buddha', 'photo-sky', 'photo-autumn'];
for (const p of PHOTOS) await emit(p, find(new RegExp(`^${p}\\.`)), { widths: [540, 860], quality: 50 });

// Live captures
const executablePath = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
  ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  : undefined;
const browser = await playwright.chromium.launch({
  executablePath,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
});

async function capture(url, locate, minWidth, keep = 1) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  const target = locate(page);
  await target.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const handle = await target.evaluateHandle((el, minW) => {
    let n = el;
    while (n && n.getBoundingClientRect().width < minW) n = n.parentElement;
    n.scrollIntoView({ block: 'center' });
    return n;
  }, minWidth);
  await page.waitForTimeout(5000); // let reveal animations and scripted terminals finish
  await page.addStyleTag({ content: 'body > header, body > div > header, nav[class*="fixed"], header[class*="fixed"], header[class*="sticky"] { display: none !important; }' });
  await page.waitForTimeout(300);
  const box = await handle.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
  });
  const buf = await page.screenshot({ clip: { x: box.x, y: box.y, width: box.width, height: Math.round(box.height * keep) }, fullPage: true });
  await ctx.close();
  return buf;
}

const vibe = await capture('https://qinxujunai.github.io/qinxujun-ai-vibecoding/', (p) => p.locator('div', { hasText: 'Update Todos' }).filter({ has: p.locator('text=claude') }).last(), 900);
await emit('vibecoding', vibe, { width: 640 });
await emit('vibecoding-m', vibe, { widths: [720], crop: { left: 0, top: 0, width: 0.5, height: 1 } });
const method = await capture('https://qinxujunai.github.io/ai-work-method/', (p) => p.getByText('强模型负责想', { exact: false }).first(), 1100, 0.4);
await emit('work-method', method, { width: 640 });
await emit('work-method-m', method, { widths: [720], crop: { left: 0.07, top: 0.04, width: 0.86, height: 0.96 } });

await browser.close();
fs.writeFileSync('src/media.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('wrote src/media.json');
