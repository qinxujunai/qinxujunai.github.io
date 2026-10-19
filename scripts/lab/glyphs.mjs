// Renders each character of 秦徐俊 from each candidate font into one comparison sheet (SVG).
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
const dir = process.argv[2];
const fonts = ['liu-jian-mao-cao', 'zhi-mang-xing', 'long-cang', 'ma-shan-zheng'];
export function glyphFor(pkg, ch, weight = '400') {
  const cssFile = ['400.css','500.css','300.css'].map((f) => path.join(pkg, f)).find((f) => fs.existsSync(f));
  const css = fs.readFileSync(cssFile, 'utf8');
  const code = ch.codePointAt(0);
  const block = css.split('@font-face').slice(1).find((b) => (/unicode-range:\s*([^;]+);/.exec(b)?.[1] ?? '').split(',').some((part) => { const [lo, hi] = part.trim().replace('U+', '').split('-').map((h) => parseInt(h, 16)); return code >= lo && code <= (hi ?? lo); }));
  const file = /url\(\.\/files\/([^)]+\.woff)\)/.exec(block)[1];
  const buf = fs.readFileSync(path.join(pkg, 'files', file));
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  return font.charToGlyph(ch).getPath(0, 88, 100).toPathData(1);
}
let out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 ' + (fonts.length * 120 + 20) + '" style="background:#fff">';
fonts.forEach((f, r) => {
  const pkg = fs.readdirSync(dir).map((d) => path.join(dir, d, 'package')).find((p) => p.includes(`fontsource-${f}-`) || p.endsWith(`fontsource-${f}/package`));
  out += `<text x="4" y="${r * 120 + 16}" font-size="10" font-family="sans-serif">${f}</text>`;
  [...'秦徐俊'].forEach((ch, i) => { out += `<path transform="translate(${10 + i * 130} ${r * 120 + 20})" fill="#111" d="${glyphFor(pkg, ch)}"/>`; });
});
fs.writeFileSync(path.join(dir, 'glyphs.svg'), out + '</svg>');
