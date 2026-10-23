// Browser acceptance checks. Usage: node scripts/qa.mjs [base-url]   (default http://127.0.0.1:4173)
// Writes screenshots and a JSON summary to .qa/.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { CASES } from '../src/cases.mjs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
const ORIGIN = new URL(BASE).origin;
const OUT = '.qa';
fs.mkdirSync(OUT, { recursive: true });

const WECHAT_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x1800322d) NetType/WIFI Language/zh_CN';
const WECHAT_ANDROID =
  'Mozilla/5.0 (Linux; Android 14; V2309A Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220133 MMWEBSDK/20240404 MMWEBID/1234 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/4G Language/zh_CN ABI/arm64';
const SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

const executablePath = process.env.CHROME_PATH || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
  ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  : undefined);
const browser = await playwright.chromium.launch({ executablePath });

const results = [];
let failed = 0;
const check = (cond, msg) => { if (!cond) failed++; console.log(cond ? '✓' : '✗', msg); return cond; };

async function open({ path = '/', width = 390, height = 844, ua = WECHAT_IOS, scheme = 'light', mobile = true, js = true, motion = 'no-preference' }) {
  const ctx = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: mobile ? 3 : 2, isMobile: mobile, hasTouch: mobile,
    userAgent: mobile ? ua : undefined, colorScheme: scheme, javaScriptEnabled: js, reducedMotion: motion, locale: 'zh-CN',
  });
  const page = await ctx.newPage();
  const errors = [];
  const foreign = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { if (new URL(r.url()).origin !== ORIGIN && !r.url().startsWith('data:')) foreign.push(r.url()); });
  page.on('request', (r) => { if (/\.mp4(?:[?#]|$)/.test(r.url())) errors.push(`unexpected video download on personal site: ${r.url()}`); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  return { ctx, page, errors, foreign };
}

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 400) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(140); }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
}

// 1. Every page × theme × viewport: errors, foreign requests, axe, overflow, screenshots
const matrix = [];
for (const path of ['/', '/en/']) for (const scheme of ['light', 'dark']) {
  matrix.push({ path, scheme, width: 390, height: 844, ua: WECHAT_IOS, tag: 'iphone-wechat' });
  matrix.push({ path, scheme, width: 360, height: 780, ua: WECHAT_ANDROID, tag: 'android-wechat' });
  matrix.push({ path, scheme, width: 1440, height: 900, mobile: false, tag: 'desktop' });
}
// Case pages: phone in light, desktop in dark, both languages.
for (const c of CASES) for (const path of [`/work/${c.slug}/`, `/en/work/${c.slug}/`]) {
  matrix.push({ path, scheme: 'light', width: 390, height: 844, ua: WECHAT_IOS, tag: 'iphone-wechat' });
  matrix.push({ path, scheme: 'dark', width: 1440, height: 900, mobile: false, tag: 'desktop' });
}
for (const cfg of matrix) {
  const { ctx, page, errors, foreign } = await open(cfg);
  await page.goto(BASE + cfg.path, { waitUntil: 'load' });
  await page.waitForTimeout(2400);
  const slug = cfg.path.replace(/^\/(en\/)?/, '').replace(/\/$/, '').replace(/\//g, '-') || 'home';
  const name = `${cfg.path.startsWith('/en/') ? 'en' : 'zh'}-${slug}-${cfg.tag}-${cfg.scheme}`;
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await scrollThrough(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
  const overflow = await page.evaluate((w) => Math.max(document.documentElement.scrollWidth, window.innerWidth) - w, cfg.width);
  const hiddenReveals = await page.evaluate(() => [...document.querySelectorAll('.reveal')].filter((r) => !r.classList.contains('in')).length);
  await page.addScriptTag({ content: axeSource });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] });
    return r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  });
  check(errors.length === 0, `${name}: console/network errors ${errors.length} ${errors.join(' ; ')}`);
  check(foreign.length === 0, `${name}: requests to other origins ${foreign.length} ${foreign.join(' ')}`);
  check(axe.length === 0, `${name}: axe WCAG AA violations ${axe.length} ${axe.join(' ; ')}`);
  check(overflow <= 0, `${name}: horizontal overflow ${overflow}px`);
  check(hiddenReveals === 0, `${name}: tiles still hidden after scrolling ${hiddenReveals}`);
  results.push({ name, errors, foreign, axe, overflow });
  await ctx.close();
}

// 2. Weak network (Slow 3G-like), WeChat on Android: when is the intro readable, the QR loaded; CLS and LCP
{
  const { ctx, page } = await open({ ua: WECHAT_ANDROID, width: 360, height: 780 });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    window.__cls = 0; window.__lcp = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { const e = l.getEntries().at(-1); if (e) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  const t0 = Date.now();
  await page.goto(BASE + '/', { waitUntil: 'commit' });
  await page.locator('.hero h1').waitFor({ state: 'visible' });
  const lede = Date.now() - t0;
  await page.waitForLoadState('load');
  const load = Date.now() - t0;
  // Read LCP and CLS for the first screen before scrolling: a reader's scroll ends LCP, a script's does not.
  await page.waitForTimeout(500);
  const { cls, lcp } = await page.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp }));
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.qr').complete && document.querySelector('.qr').naturalWidth > 0);
  const qr = Date.now() - t0;
  const bytes = await page.evaluate(() => performance.getEntriesByType('resource').reduce((s, r) => s + (r.transferSize || 0), 0) + (performance.getEntriesByType('navigation')[0]?.transferSize || 0));
  check(lede < 3000, `slow 3G: intro readable after ${lede}ms`);
  check(lcp < 2500, `slow 3G: LCP ${Math.round(lcp)}ms`);
  check(cls <= 0.1, `slow 3G: CLS ${cls.toFixed(3)}`);
  console.log(`  load event ${load}ms, QR ready after scrolling ${qr}ms, transferred ${(bytes / 1024).toFixed(0)}KB`);
  results.push({ weakNetwork: { lede, load, qr, lcp, cls, bytes } });
  await ctx.close();
}

// 3. Contact hints per environment, and the save button
for (const [ua, tag, expectSave] of [[WECHAT_IOS, 'wechat', false], [SAFARI, 'phone', true]]) {
  const { ctx, page } = await open({ ua });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const hint = await page.locator('[data-qr-hint]').textContent();
  const expected = await page.locator('[data-qr-hint]').getAttribute(`data-hint-${tag}`);
  const saveVisible = await page.locator('[data-qr-save]').isVisible();
  check(hint === expected, `${tag}: contact hint "${hint}"`);
  check(saveVisible === expectSave, `${tag}: save button ${saveVisible ? 'shown' : 'hidden'}`);
  await ctx.close();
}

// 4. Without JavaScript the page is complete and the signature is visible
{
  const { ctx, page } = await open({ js: false });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const fill = await page.evaluate(() => getComputedStyle(document.querySelector('.hero .sig path')).fill);
  const qr = await page.locator('.qr').isVisible();
  check(fill !== 'none' && fill !== 'rgba(0, 0, 0, 0)' && fill !== 'transparent', `no JS: signature fill ${fill}`);
  check(qr, 'no JS: QR code present');
  await page.screenshot({ path: `${OUT}/zh-nojs.png` });
  await ctx.close();
}

// 5. Reduced motion: signature is static and fully inked immediately
{
  const { ctx, page } = await open({ motion: 'reduce' });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const fill = await page.evaluate(() => getComputedStyle(document.querySelector('.hero .sig path')).fill);
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.hero .sig path')).animationName);
  check(anim === 'none' && fill !== 'transparent' && fill !== 'rgba(0, 0, 0, 0)', `reduced motion: no animation, fill ${fill}`);
  await ctx.close();
}

// 6. The QR image on the page decodes to a WeChat contact
{
  const { PNG } = require('pngjs');
  const jsQR = require('jsqr');
  const res = await fetch(BASE + '/assets/wechat-qr.png');
  const png = PNG.sync.read(Buffer.from(await res.arrayBuffer()));
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  check(Boolean(code && code.data.startsWith('https://u.wechat.com/')), 'QR on the site decodes to a WeChat contact link');
  // The downloadable name cards carry the same code.
  for (const lang of ['zh', 'en']) {
    const r = await fetch(`${BASE}/assets/card-${lang}.png`);
    const card = PNG.sync.read(Buffer.from(await r.arrayBuffer()));
    const c2 = jsQR(new Uint8ClampedArray(card.data), card.width, card.height);
    check(Boolean(c2 && code && c2.data === code.data), `name card (${lang}) decodes to the same WeChat link`);
  }
}

await browser.close();
fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(results, null, 2));
if (failed) { console.error(`\n${failed} check(s) failed`); process.exit(1); }
console.log('\nall QA checks passed');
