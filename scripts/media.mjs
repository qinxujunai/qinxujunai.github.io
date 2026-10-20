// Builds every image on the site into assets/media/ as WebP at 1x and 2x.
// Usage: node scripts/media.mjs <source-dir> [name ...]
//   With names, only those images are rebuilt and merged into the existing src/media.json.
// <source-dir> holds the originals that are not kept in this repository:
//   avatar.jpg|webp            portrait
//   site-<name>-d.png / -m.png project websites, captured by scripts/capture-sites.cjs
//   photo-*.webp|jpg           the owner's own photographs (see PHOTOS below)
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

const only = process.argv.slice(3);
const want = (name) => !only.length || only.includes(name);
const manifest = only.length ? JSON.parse(fs.readFileSync('src/media.json', 'utf8')) : {};

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
  if (!want(name)) return;
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
// Project websites, captured full-page from qinxujunai.github.io (same origin) by scripts/capture-sites.cjs.
//   site-<name>-d.png: 1280px wide, 1x · site-<name>-m.png: 390px wide, 2x
// Shown inside a browser or phone frame that scrolls through the page as you scroll past it.
// Crops in CSS pixels of the capture (desktop 1280 wide, phone 390 wide; both captured at 2x).
// Each ends on a section edge of that site, short enough that the page moves about as fast as the scroll.
const SITES = {
  voiceflow: { d: { height: 2180 }, m: { height: 1380 } },
  wanxiang: { d: { height: 2250 }, m: { height: 1180 } },
  'ai-signal': { d: { left: 260, width: 760, height: 2100 }, m: { height: 2000 } },
  vibecoding: { d: { height: 2280 }, m: { height: 1040 } },
};
for (const [name, crop] of Object.entries(SITES)) {
  for (const [tag, cssWidth, out, widths, quality] of [['d', 1280, `site-${name}`, [1040, 2080], 58], ['m', 390, `site-${name}-m`, [500], 62]]) {
    const file = find(new RegExp(`^site-${name}-${tag}\\.`));
    const meta = await sharp(file).metadata();
    const k = meta.width / cssWidth;
    const c = crop[tag];
    const w = Math.round((c.width || cssWidth) * k);
    await emit(out, file, { widths: widths.map((x) => Math.min(x, w)), quality, crop: { left: Math.round((c.left || 0) * k), top: 0, width: w, height: Math.min(Math.round(c.height * k), meta.height) } });
  }
}

// Photographs, in display order. Landscapes, buildings and objects only: no faces, no logos.
// AI work from his portfolio (generated images; no brand logos, no licensed characters), then his photographs.
const PHOTOS = ['ai-hat', 'ai-vest', 'ai-shirt', 'ai-cup', 'ai-tin', 'ai-bag', 'ai-portrait', 'ai-lips', 'ai-leaves', 'ai-studio', 'photo-aerial', 'photo-pagoda', 'photo-dusk', 'photo-sky'];
for (const p of PHOTOS) await emit(p, find(new RegExp(`^${p}\\.`)), { widths: [540, 860], quality: 50 });

fs.writeFileSync('src/media.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('wrote src/media.json');
