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
if (want('avatar')) await emit('avatar', find(/^avatar\./), { width: 160, square: true, quality: 80, crop: { left: 72, top: 0, width: 880, height: 880 } });

// Products
// Project websites, captured full-page from qinxujunai.github.io (same origin) by scripts/capture-sites.cjs.
//   site-<name>-d.png: 1280px wide, 2x, full page · site-<name>-c.png: the phone layout, 390px wide, 3x
// d (wide screens) and card (phones) are each the site's first screen as built, nav included, cut on the
// site's own edge before its first picture or next section (v19: one picture, no scrolling inside it).
// Crops in CSS pixels of the captures.
const SITES = {
  // card: the phone picture, cut from the site's phone layout (390px wide, 3x; site-<name>-c.png), in CSS px.
  // It is the site's first screen exactly as built: from the top (its own nav included) down to the
  // blank space before its first picture or next section. Never a fixed ratio: a fixed 16:10 cut
  // through 万象成文's hero and its demo (v19).
  voiceflow: { d: { height: 620 }, card: { top: 0, height: 520 } },
  wanxiang: { d: { height: 432 }, card: { top: 0, height: 530 } },
  'ai-signal': { d: { height: 470 }, card: { top: 0, height: 385 } },
  vibecoding: { d: { height: 670 }, card: { top: 0, height: 610 } },
  // The products at work, for the home page (v21): today's AI Signal issue, and 万象成文's result page
  // (v24: a real run, a 52-second China News Service clip, CC BY 3.0, uploaded to the app in the cloud;
  // the same run as Audio2Text's site demo. Sources: result page at 1280 wide 2x (-d) and 390 wide 3x (-c)).
  'prod-ai-signal': { d: { left: 280, width: 720, top: 70, height: 490 }, card: { top: 70, height: 325 } },
  'prod-wanxiang': { d: { left: 130, width: 1020, top: 138, height: 684 }, card: { top: 358, height: 414 } },
  // Not his work: Datawhale's easy-vibe course, recommended near the end.
  // Its first screen is a splash: the logo, a line and two buttons.
  easyvibe: { d: { top: 200, height: 480 }, card: { top: 370, height: 300 } },
};
for (const [name, crop] of Object.entries(SITES)) {
  if (!want(`site-${name}`) && !want(`site-${name}-card`)) continue;
  const file = find(new RegExp(`^site-${name}-d\\.`));
  const meta = await sharp(file).metadata();
  const k = meta.width / 1280;
  const c = crop.d;
  const w = Math.round((c.width || 1280) * k);
  const left = Math.round((c.left || 0) * k);
  // Wide screens: the page from the top to a section edge, scrolled inside the window.
  await emit(`site-${name}`, file, { widths: [1040, 2080].map((x) => Math.min(x, w)), quality: 58, crop: { left, top: Math.round((c.top || 0) * k), width: w, height: Math.min(Math.round(c.height * k), meta.height - Math.round((c.top || 0) * k)) } });
  // Phones: the site's own phone first screen, 1080px wide so it stays sharp on 3x screens.
  const cfile = find(new RegExp(`^site-${name}-c\\.`));
  const kc = (await sharp(cfile).metadata()).width / 390;
  const cc = crop.card;
  const px = (v) => Math.round(v * kc);
  await emit(`site-${name}-card`, cfile, { widths: [1080], quality: 72, crop: { left: px(cc.left || 0), top: px(cc.top), width: px(cc.width || 390), height: px(cc.height) } });
}

// Photographs, in display order. Landscapes, buildings and objects only: no faces, no logos.
// AI work from his portfolio (generated images; no brand logos, no licensed characters), then his photographs.
const PHOTOS = ['ai-hat', 'ai-vest', 'ai-shirt', 'ai-cup', 'ai-tin', 'ai-bag', 'ai-portrait', 'ai-lips', 'ai-leaves', 'ai-studio', 'photo-aerial', 'photo-pagoda', 'photo-dusk', 'photo-sky'];
for (const p of PHOTOS) if (want(p)) await emit(p, find(new RegExp(`^${p}\\.`)), { widths: [540, 860], quality: 50 });

fs.writeFileSync('src/media.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('wrote src/media.json');
