// Captures real product screens for the Work section and writes framed WebP files
// (transparent corners, so the page's own stage color shows through in both themes).
// Usage: node scripts/shots.mjs [path-to-Audio2Text-checkout]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const OUT = 'assets/work';
const WIDTH = 1280; // 2x of the 640px display width
fs.mkdirSync(OUT, { recursive: true });

const executablePath = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
  ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  : undefined;
const browser = await playwright.chromium.launch({
  executablePath,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
});

async function capture(url, prepare) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);
  const buf = await prepare(page);
  await ctx.close();
  return buf;
}

async function frame(input, name, { crop } = {}) {
  let img = sharp(input);
  if (crop) img = img.extract(crop);
  const resized = await img.resize({ width: WIDTH }).png().toBuffer();
  const { height } = await sharp(resized).metadata();
  const r = 20; // 10px at 2x
  const mask = Buffer.from(
    `<svg width="${WIDTH}" height="${height}"><rect width="${WIDTH}" height="${height}" rx="${r}" ry="${r}"/></svg>`,
  );
  const file = path.join(OUT, `${name}.webp`);
  await sharp(resized).composite([{ input: mask, blend: 'dest-in' }]).webp({ quality: 78, alphaQuality: 90, effort: 6 }).toFile(file);
  const meta = await sharp(file).metadata();
  console.log(name, `${meta.width}x${meta.height}`, `${Math.round(fs.statSync(file).size / 1024)}KB`);
}

// ai.vibecoding: the Claude Code terminal that anchors its first screen.
const vibe = await capture('https://qinxujunai.github.io/qinxujun-ai-vibecoding/', async (page) => {
  const terminal = page.locator('div', { hasText: 'Update Todos' }).filter({ has: page.locator('text=claude') });
  const handle = await terminal.last().elementHandle();
  await handle.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000); // let the terminal finish its script
  // walk up to the framed window (the first ancestor wider than 900px)
  const box = await handle.evaluate((el) => {
    let n = el;
    while (n && n.getBoundingClientRect().width < 900) n = n.parentElement;
    const r = n.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 620) };
  });
  return page.screenshot({ clip: box });
});
await frame(vibe, 'vibecoding');

// AI Work Method: its first screen.
const work = await capture('https://qinxujunai.github.io/ai-work-method/', (page) =>
  page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } }),
);
await frame(work, 'work-method');

// 万象成文: the result screen from the product's own repository docs.
const a2t = process.argv[2];
if (a2t) {
  const src = path.join(a2t, 'docs/assets/result-video-desktop.png');
  await frame(fs.readFileSync(src), 'wanxiang', { crop: { left: 0, top: 72, width: 1440, height: 828 } });
}

await browser.close();
