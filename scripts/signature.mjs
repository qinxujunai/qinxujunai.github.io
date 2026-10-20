// Composes the signature like a calligraphy colophon: brush-written name, one large character,
// two smaller ones leaning into each other, and a vermilion seal (白文「徐俊」) pressed at the end.
// Outputs src/signature.svg: one <path> per character (the hero writes them in order) + one seal path.
//
// Usage:
//   node scripts/signature.mjs <fonts-dir> <NotoSerifSC-Bold.otf> [layout]
//   <fonts-dir> holds unpacked @fontsource packages (fontsource-long-cang-*/package, ...).
//   Final: Ma Shan Zheng (regular script) with the vermilion seal — his choice, 2026-10-20.
//   Fonts are SIL OFL 1.1; only their outlines end up in the page, never the font files.
//   [layout] is one of the presets below (default: "final"). "sheet" writes a comparison sheet instead.
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';

const [fontsDir, sealFontFile, layout = 'final'] = process.argv.slice(2);
if (!fontsDir || !sealFontFile) {
  console.error('usage: node scripts/signature.mjs <fonts-dir> <NotoSerifSC-Bold.otf> [layout|sheet]');
  process.exit(1);
}

const cache = new Map();
function loadFace(name, ch) {
  const pkg = fs.readdirSync(fontsDir).map((d) => path.join(fontsDir, d, 'package')).find((p) => p.includes(`fontsource-${name}-`));
  const css = fs.readFileSync(path.join(pkg, '400.css'), 'utf8');
  const code = ch.codePointAt(0);
  const block = css.split('@font-face').slice(1).find((b) =>
    (/unicode-range:\s*([^;]+);/.exec(b)?.[1] ?? '').split(',').some((part) => {
      const [lo, hi] = part.trim().replace('U+', '').split('-').map((h) => parseInt(h, 16));
      return code >= lo && code <= (hi ?? lo);
    }));
  const file = path.join(pkg, 'files', /url\(\.\/files\/([^)]+\.woff)\)/.exec(block)[1]);
  if (!cache.has(file)) {
    const buf = fs.readFileSync(file);
    cache.set(file, opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)));
  }
  return cache.get(file);
}

// A glyph placed with its own size, position and slight rotation, like a hand that varies.
function placed(font, ch, { x, y, size, rotate = 0 }) {
  const face = loadFace(font, ch);
  const p = face.charToGlyph(ch).getPath(0, 0, size);
  const bb = p.getBoundingBox();
  const cx = (bb.x1 + bb.x2) / 2;
  const cy = (bb.y1 + bb.y2) / 2;
  const r = (rotate * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  for (const c of p.commands) {
    for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']]) {
      if (c[kx] === undefined) continue;
      const dx = c[kx] - cx;
      const dy = c[ky] - cy;
      c[kx] = x + dx * cos - dy * sin;
      c[ky] = y + dx * sin + dy * cos;
    }
  }
  return p;
}

// Deterministic pseudo-random, so the seal's worn edge is identical on every build.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

// 白文 seal: a vermilion block with the characters cut out (even-odd fill), worn edges.
// kind "tall": 徐 above 俊 in a vertical seal. kind "four": 秦徐俊印 in a square, read right column first.
// Every character is scaled uniformly into a square cell, so no stroke is stretched.
function seal(x, y, w, kind = 'tall') {
  const buf = fs.readFileSync(sealFontFile);
  const face = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const rand = rng(20261019);
  const cols = kind === 'four' ? 2 : 1;
  const pad = w * (cols === 2 ? 0.1 : 0.14);
  const gap = w * 0.05;
  const cell = (w - pad * 2 - gap * (cols - 1)) / cols;
  const h = pad * 2 + cell * 2 + gap;
  const pts = [];
  const edge = (x0, y0, x1, y1, n) => {
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const j = (rand() - 0.5) * w * 0.035;
      const nx = y1 - y0 ? 1 : 0;
      const ny = x1 - x0 ? 1 : 0;
      pts.push([x0 + (x1 - x0) * t + j * nx, y0 + (y1 - y0) * t + j * ny]);
    }
  };
  const r = w * 0.06;
  edge(x + r, y, x + w - r, y, 12);
  edge(x + w, y + r, x + w, y + h - r, 20);
  edge(x + w - r, y + h, x + r, y + h, 12);
  edge(x, y + h - r, x, y + r, 20);
  let d = `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z`;
  const cells = kind === 'four'
    ? [['秦', 1, 0], ['徐', 1, 1], ['俊', 0, 0], ['印', 0, 1]]
    : [['徐', 0, 0], ['俊', 0, 1]];
  for (const [ch, col, row] of cells) {
    const g = face.charToGlyph(ch).getPath(0, 0, 100);
    const bb = g.getBoundingBox();
    const bw = bb.x2 - bb.x1;
    const bh = bb.y2 - bb.y1;
    const k = cell / Math.max(bw, bh);
    const ox = x + pad + col * (cell + gap) + (cell - bw * k) / 2;
    const oy = y + pad + row * (cell + gap) + (cell - bh * k) / 2;
    for (const c of g.commands) {
      for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']]) {
        if (c[kx] === undefined) continue;
        c[kx] = ox + (c[kx] - bb.x1) * k;
        c[ky] = oy + (c[ky] - bb.y1) * k;
      }
    }
    d += g.toPathData(1);
  }
  return { d, h };
}

// Layout presets: [font, char, x, y, size, rotate]. Coordinates are in a 300 × 130 design box.
const LAYOUTS = {
  longcang: { glyphs: [['long-cang', '秦', 58, 64, 120, -4], ['long-cang', '徐', 146, 78, 92, -2], ['long-cang', '俊', 222, 72, 94, 3]], seal: [268, 86, 36] },
  zhimang: { glyphs: [['zhi-mang-xing', '秦', 58, 64, 116, -3], ['zhi-mang-xing', '徐', 144, 76, 90, -1], ['zhi-mang-xing', '俊', 220, 72, 90, 2]], seal: [266, 92, 28] },
  mixed: { glyphs: [['zhi-mang-xing', '秦', 58, 64, 120, -4], ['long-cang', '徐', 148, 78, 90, -2], ['long-cang', '俊', 222, 72, 90, 3]], seal: [266, 92, 28] },
  cursive: { glyphs: [['liu-jian-mao-cao', '秦', 56, 64, 120, -3], ['liu-jian-mao-cao', '徐', 140, 74, 96, 0], ['liu-jian-mao-cao', '俊', 214, 70, 96, 2]], seal: [262, 92, 28] },
  // Straighter variants (2026-10-20 review): one baseline, little rotation, seal optional.
  cursive2: { glyphs: [['liu-jian-mao-cao', '秦', 56, 64, 112, -2], ['liu-jian-mao-cao', '徐', 136, 70, 100, 0], ['liu-jian-mao-cao', '俊', 212, 68, 100, 1]], seal: [258, 88, 26] },
  zhimang2: { glyphs: [['zhi-mang-xing', '秦', 56, 64, 108, 0], ['zhi-mang-xing', '徐', 150, 66, 104, 0], ['zhi-mang-xing', '俊', 244, 66, 104, 0]], seal: null },
  kai: { glyphs: [['ma-shan-zheng', '秦', 56, 62, 106, 0], ['ma-shan-zheng', '徐', 148, 66, 98, 0], ['ma-shan-zheng', '俊', 238, 66, 98, 0]], seal: [288, 66, 26] },
  // Four-character square seal 秦徐俊印, an alternative.
  kai4: { glyphs: [['ma-shan-zheng', '秦', 56, 62, 106, 0], ['ma-shan-zheng', '徐', 148, 66, 98, 0], ['ma-shan-zheng', '俊', 238, 66, 98, 0]], seal: [286, 72, 38, 'four'] },
};
LAYOUTS.final = LAYOUTS.kai;

function compose(name) {
  const L = LAYOUTS[name];
  const paths = L.glyphs.map(([font, ch, x, y, size, rot]) => placed(font, ch, { x, y, size, rotate: rot }));
  const box = paths.map((p) => p.getBoundingBox()).reduce((a, b) => ({ x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1), x2: Math.max(a.x2, b.x2), y2: Math.max(a.y2, b.y2) }));
  const [sx, sy, sw, kind] = L.seal || [box.x2, box.y1, 0];
  const { d: sealD, h: sh } = L.seal ? seal(sx, sy, sw, kind) : { d: '', h: 0 };
  const vb = [Math.floor(box.x1) - 2, Math.floor(Math.min(box.y1, sy)) - 2, Math.ceil(Math.max(box.x2, sx + sw) - box.x1) + 4, Math.ceil(Math.max(box.y2, sy + sh) - Math.min(box.y1, sy)) + 4];
  // The seal's characters are cut out of the red block; a paper-coloured backing shows through them,
  // so they read as white on any page colour, as a real stamp does.
  const sealPath = L.seal ? `<path class="seal" fill="#fbf8f1" d="${sealD.slice(0, sealD.indexOf('Z') + 1)}"/><path class="seal" fill="#c8102e" fill-rule="evenodd" d="${sealD}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}">${paths.map((p) => `<path d="${p.toPathData(1)}"/>`).join('')}${sealPath}</svg>\n`;
}

if (layout === 'sheet') {
  const names = Object.keys(LAYOUTS).filter((n) => n !== 'final');
  for (const n of names) fs.writeFileSync(path.join(fontsDir, `sig-${n}.svg`), compose(n));
  console.log(names.map((n) => path.join(fontsDir, `sig-${n}.svg`)).join('\n'));
} else {
  fs.writeFileSync('src/signature.svg', compose(layout));
  console.log(`src/signature.svg (${layout})`);
}
