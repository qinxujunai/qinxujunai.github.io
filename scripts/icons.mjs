// Builds favicon.svg, apple-touch-icon.png, share.png (WeChat/social thumbnail), og.png and the
// downloadable name cards (assets/card-zh.png, assets/card-en.png) from the signature, so every
// image carries the same hand. The cards embed assets/wechat-qr.png; npm run qa checks they still scan.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { content } from '../src/content.mjs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const svg = fs.readFileSync('src/signature.svg', 'utf8');
const firstGlyph = /<path d="([^"]+)"\/>/.exec(svg)[1];

// Favicon: the first character of the signature on ink-blue.
const nums = firstGlyph.match(/-?\d+(\.\d+)?/g).map(Number);
const xs = nums.filter((_, i) => i % 2 === 0);
const ys = nums.filter((_, i) => i % 2 === 1);
const [gx, gy] = [Math.min(...xs), Math.min(...ys)];
const [gw, gh] = [Math.max(...xs) - gx, Math.max(...ys) - gy];
const scale = 46 / Math.max(gw, gh);
const tx = (64 - gw * scale) / 2 - gx * scale;
const ty = (64 - gh * scale) / 2 - gy * scale;
const qin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1d2b4f"/><path fill="#f5f7fb" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})" d="${firstGlyph}"/></svg>\n`;
fs.writeFileSync('favicon.svg', qin);

const executablePath = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
  ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  : undefined;
const browser = await playwright.chromium.launch({ executablePath });

async function render(file, w, h, html) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}
    body{font-family:-apple-system,'PingFang SC','Noto Sans CJK SC','Microsoft YaHei',sans-serif;color:#16181c;background:#fff}
  </style></head><body>${html}</body></html>`);
  await page.screenshot({ path: file, type: 'png' });
  await page.close();
  console.log(file);
}

await render('apple-touch-icon.png', 180, 180, `<div style="width:180px;height:180px">${qin.replace('<svg', '<svg width="180" height="180"').replace('rx="14"', 'rx="0"')}</div>`);

await render(
  'share.png',
  300,
  300,
  `<div style="width:300px;height:300px;display:grid;place-items:center;background:#fff">
    ${svg.replace('<svg', '<svg style="width:236px;height:auto;fill:#1d2b4f"')}</div>`,
);

await render(
  'og.png',
  1200,
  630,
  `<div style="box-sizing:border-box;width:1200px;height:630px;padding:96px 104px;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between">
    ${svg.replace('<svg', '<svg style="height:190px;width:auto;fill:#1d2b4f;margin-left:-8px"')}
    <div>
      <div style="font-size:44px;font-weight:600;line-height:1.35;letter-spacing:.01em">${content.zh.lede}</div>
      <div style="margin-top:20px;font-size:28px;color:#5e6570">qinxujunai.github.io</div>
    </div></div>`,
);

// Name card, portrait for a phone album: the same card as the contact section, QR large enough to scan.
const dataUri = (f, type) => `data:${type};base64,${fs.readFileSync(f).toString('base64')}`;
const qr = dataUri('assets/wechat-qr.png', 'image/png');
const avatar = dataUri('assets/media/avatar-320.webp', 'image/webp');
for (const lang of ['zh', 'en']) {
  const c = content[lang];
  await render(
    `assets/card-${lang}.png`,
    1080,
    1350,
    `<div style="box-sizing:border-box;width:1080px;height:1350px;padding:96px;background:#f5f5f7;display:flex;flex-direction:column;justify-content:center">
      <div style="border-radius:56px;background:#1d1d1f;color:#f5f5f7;padding:72px 68px 64px;box-shadow:0 40px 80px -30px rgba(0,0,0,.45)">
        <div style="display:flex;align-items:center;justify-content:space-between">
          ${svg.replace('<svg', '<svg style="height:120px;width:auto;fill:#f5f5f7"')}
          <img src="${avatar}" style="width:128px;height:128px;border-radius:50%">
        </div>
        <div style="margin-top:72px;font-size:56px;font-weight:600">${c.name}</div>
        <div style="margin-top:10px;font-size:30px;color:#a1a1a6">${c.role} · ${c.org}</div>
        <div style="margin-top:40px;font-size:38px;line-height:1.35">${c.lede}</div>
        <div style="margin-top:56px;display:flex;align-items:center;gap:40px">
          <img src="${qr}" style="width:300px;height:300px;padding:16px;background:#fff;border-radius:28px">
          <div style="font-size:28px;line-height:1.5;color:#a1a1a6">${lang === 'zh' ? '微信扫一扫<br>加我微信' : 'Scan with WeChat<br>to add me'}<br><br>qinxujunai.github.io</div>
        </div>
      </div></div>`,
  );
}

await browser.close();
