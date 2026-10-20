// Captures each project website full-page at desktop width (1280px, 2x) for the project windows and phone cards.
// Usage: node scripts/capture-sites.cjs <out-dir>   then: npm run media -- <out-dir> site-voiceflow site-voiceflow-card …
const pw = (() => { try { return require('playwright'); } catch { return require('/opt/node22/lib/node_modules/playwright'); } })();
const out = process.argv[2];
const sites = { voiceflow: 'VoiceFlow/', wanxiang: 'Audio2Text/', 'ai-signal': 'ai-signal/', vibecoding: 'qinxujun-ai-vibecoding/' };
(async () => {
  const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
  for (const [name, path] of Object.entries(sites)) {
    for (const [tag, vp, dpr, mobile] of [['d', { width: 1280, height: 800 }, 2, false]]) {
      const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce', colorScheme: 'light', locale: 'zh-CN' });
      const p = await ctx.newPage();
      await p.goto('https://qinxujunai.github.io/' + path, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(1500);
      await p.addStyleTag({ content: '*{animation:none!important;transition:none!important} [class*="fixed"],[class*="sticky"],header{position:static!important}' }).catch(()=>{});
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      await p.screenshot({ path: `${out}/site-${name}-${tag}.png`, fullPage: true });
      console.log(name, tag, h);
      await ctx.close();
    }
  }
  await b.close();
})();
