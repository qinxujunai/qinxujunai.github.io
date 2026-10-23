// Captures each project website: full-page at desktop width (1280px, 2x) for the windows on wide screens,
// and the site's phone layout (390px wide, 3x) for the phone pictures.
// Usage: node scripts/capture-sites.cjs <out-dir> [name…]   then: npm run media -- <out-dir> site-voiceflow site-voiceflow-card …
const pw = (() => { try { return require('playwright'); } catch { return require('/opt/node22/lib/node_modules/playwright'); } })();
const out = process.argv[2];
const sites = { voiceflow: 'VoiceFlow/', wanxiang: 'Audio2Text/', 'ai-signal': 'ai-signal/', vibecoding: 'qinxujun-ai-vibecoding/', easyvibe: 'https://datawhalechina.github.io/easy-vibe/zh-cn/' };
// SITE_<NAME>=<url> captures from another address, e.g. a local build before it is deployed.
const only = process.argv.slice(3);
(async () => {
  // The cloud container has its own Chromium and an outbound proxy; elsewhere Playwright's own browser is used.
  const cloud = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const executablePath = require('fs').existsSync(cloud) ? cloud : undefined;
  const b = await pw.chromium.launch({ executablePath, ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}) });
  // A local build is reached directly, not through the proxy.
  const local = await pw.chromium.launch({ executablePath, args: ['--lang=zh-CN'] });
  for (const [name, path] of Object.entries(sites)) {
    if (only.length && !only.includes(name)) continue;
    const url = process.env[`SITE_${name.toUpperCase().replace(/-/g, '_')}`] || (path.startsWith('http') ? path : 'https://qinxujunai.github.io/' + path);
    // d: desktop, full page, for the windows on wide screens. c: the site's own phone layout (390 wide, 3x),
    // first screen, for phones: readable at about 1:1 instead of a desktop page shrunk to a third.
    for (const [tag, vp, dpr, mobile] of [['d', { width: 1280, height: 800 }, 2, false], ['c', { width: 390, height: 1200 }, 3, true]]) {
      const ctx = await (/^http:\/\/(127\.0\.0\.1|localhost)/.test(url) ? local : b).newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce', colorScheme: 'light', locale: 'zh-CN' });
      const p = await ctx.newPage();
      await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(1500);
      await p.addStyleTag({ content: '*{animation:none!important;transition:none!important} [class*="fixed"],[class*="sticky"],header{position:static!important}' }).catch(()=>{});
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      await p.screenshot({ path: `${out}/site-${name}-${tag}.png`, fullPage: tag === 'd' });
      console.log(name, tag, h);
      await ctx.close();
    }
  }
  await b.close();
  await local.close();
})();
