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
const SITES = {
  voiceflow: { d: { height: 4000 }, m: { height: 9000 } },
  wanxiang: { d: { height: 4161 }, m: { height: 8832 } },
  'ai-signal': { d: { left: 260, width: 760, height: 3700 }, m: { height: 8000 } },
  vibecoding: { d: { height: 4600 }, m: { height: 9000 } },
};
for (const [name, crop] of Object.entries(SITES)) {
  const d = find(new RegExp(`^site-${name}-d\\.`));
  const dm = await sharp(d).metadata();
  await emit(`site-${name}`, d, { widths: [1280], quality: 60, crop: { left: crop.d.left || 0, top: 0, width: crop.d.width || dm.width, height: Math.min(crop.d.height, dm.height) } });
  const m = find(new RegExp(`^site-${name}-m\\.`));
  const mm = await sharp(m).metadata();
  await emit(`site-${name}-m`, m, { widths: [560], quality: 62, crop: { left: 0, top: 0, width: mm.width, height: Math.min(crop.m.height, mm.height) } });
}

// Photographs, in display order. Landscapes, buildings and objects only: no faces, no logos.
const PHOTOS = ['photo-aerial', 'photo-pagoda', 'photo-gate', 'photo-wall', 'photo-dusk', 'photo-buddha', 'photo-sky', 'photo-autumn'];
for (const p of PHOTOS) await emit(p, find(new RegExp(`^${p}\\.`)), { widths: [540, 860], quality: 50 });

fs.writeFileSync('src/media.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('wrote src/media.json');
