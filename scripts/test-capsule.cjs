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
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(process.argv[2] || 'http://127.0.0.1:4179/');
  assert((await page.locator('.demo-link .typed').textContent()).length > 0);
  console.log('reduced motion: static text retained');
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
