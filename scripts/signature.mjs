// Turns the name into SVG outline paths from an OFL handwriting font, so the page
// ships the signature as inline SVG and never loads a font file.
// Usage: node scripts/signature.mjs <fontsource-package-dir> [text] > out.svg
// When a photo of the real signature exists, replace the output with a traced version.
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';

const [pkgDir, text = '秦徐俊', tracking = '0.78'] = process.argv.slice(2);
if (!pkgDir) {
  console.error('usage: node scripts/signature.mjs <fontsource-package-dir> [text]');
  process.exit(1);
}

const css = fs.readFileSync(path.join(pkgDir, '400.css'), 'utf8');
const codes = [...text].map((ch) => ch.codePointAt(0));

// Find the unicode-range chunk(s) holding each character.
const blocks = css.split('@font-face').slice(1);
const fonts = new Map();
for (const code of codes) {
  const block = blocks.find((b) => {
    const range = /unicode-range:\s*([^;]+);/.exec(b)?.[1] ?? '';
    return range.split(',').some((part) => {
      const [lo, hi] = part.trim().replace('U+', '').split('-').map((h) => parseInt(h, 16));
      return code >= lo && code <= (hi ?? lo);
    });
  });
  if (!block) throw new Error(`no chunk for U+${code.toString(16)}`);
  const file = /url\(\.\/files\/([^)]+\.woff)\)/.exec(block)[1];
  if (!fonts.has(file)) {
    const buf = fs.readFileSync(path.join(pkgDir, 'files', file));
    fonts.set(file, opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)));
  }
  fonts.get(file).__codes = [...(fonts.get(file).__codes ?? []), code];
}

const size = 100;
let x = 0;
const paths = [];
for (const ch of text) {
  const font = [...fonts.values()].find((f) => f.__codes.includes(ch.codePointAt(0)));
  const glyph = font.charToGlyph(ch);
  const p = glyph.getPath(x, size * 0.88, size);
  paths.push(p.toPathData(1));
  x += (glyph.advanceWidth / font.unitsPerEm) * size * Number(tracking); // tighter than type, like a hand
}

const box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
for (const d of paths) {
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  for (let i = 0; i < nums.length; i += 2) {
    box.x1 = Math.min(box.x1, nums[i]); box.x2 = Math.max(box.x2, nums[i]);
    box.y1 = Math.min(box.y1, nums[i + 1]); box.y2 = Math.max(box.y2, nums[i + 1]);
  }
}
const pad = 2;
const vb = [box.x1 - pad, box.y1 - pad, box.x2 - box.x1 + pad * 2, box.y2 - box.y1 + pad * 2].map((n) => Math.round(n));
process.stdout.write(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}">` +
    paths.map((d) => `<path d="${d}"/>`).join('') +
    '</svg>\n',
);
