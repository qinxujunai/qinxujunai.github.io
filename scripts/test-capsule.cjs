const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  for (const width of [320, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    await page.goto(process.argv[2] || 'http://127.0.0.1:4179/');
    const capsule = page.locator('.demo-link .capsule');
    await capsule.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.demo-link .capsule').style.width === '86px');
    await page.waitForFunction(() => parseFloat(document.querySelector('.demo-link .capsule').style.width) > 150);
    await page.waitForFunction(() => document.querySelector('.demo-link .typed').classList.contains('long'));
    const dimensions = await capsule.evaluate(e => ({ width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height }));
    assert(dimensions.width <= 312 && dimensions.height === 40, `capsule dimensions: ${JSON.stringify(dimensions)}`);
    await page.waitForFunction(() => !!document.querySelector('.demo-link .demo-paste').textContent);
    assert.equal(await capsule.evaluate(e => e.classList.contains('is-delivered')), true);
    const box = await page.locator('.demo-link .demo-paste').boundingBox();
    assert(box && box.x >= 0 && box.x + box.width <= width + 1);
    console.log(`${width}: grows and delivers without overflow`);
    await page.close();
  }
  for (const path of ['/work/voiceflow/', '/en/work/voiceflow/']) for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, colorScheme: scheme });
    await page.goto(new URL(path, process.argv[2] || 'http://127.0.0.1:4179/').href);
    await page.locator('.case-demo').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => !!document.querySelector('.demo-paste').textContent);
    const colors = await page.locator('.demo-paste').evaluate(e => ({ text: getComputedStyle(e).color, background: getComputedStyle(e.closest('.case-head')).backgroundColor }));
    const luminance = s => { const c = s.match(/\d+/g).slice(0, 3).map(x => Number(x) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return .2126*c[0]+.7152*c[1]+.0722*c[2]; };
    const a = luminance(colors.text), b = luminance(colors.background);
    assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5, `${path} ${scheme}: insufficient contrast ${JSON.stringify(colors)}`);
    console.log(`${path} ${scheme}: delivery text contrast passed`);
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(process.argv[2] || 'http://127.0.0.1:4179/');
  assert((await page.locator('.demo-link .typed').textContent()).length > 0);
  console.log('reduced motion: static text retained');
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
