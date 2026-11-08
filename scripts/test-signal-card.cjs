// The AI Signal card swaps in a newer issue when the page opens (assets/site.js, 2026-11-08). That code only runs
// over https, so the local QA (http) never exercises it. This test serves the built pages as if they were the live
// site (and from another domain) and answers latest.json with good, stale and broken data. Run by scripts/ship.sh.
// Usage: node scripts/test-signal-card.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
const built = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/signal.json'), 'utf8'));
const good = { number: 99, date: '2099-01-02', scanned: 75, picked: 31, minutes: 6, headline: 'NEW HEADLINE', intro: 'new intro', tldr: ['a1', 'a2', 'a3'] };
const unchanged = (g) => g.date === built.date && g.head !== 'NEW HEADLINE' && !/NaN|undefined|null|第 0 期/.test(g.when + g.meta);

const CASES = [
  ['a newer issue replaces the card', 'qinxujunai.github.io', good, (g) => g.date === '2099-01-02' && g.when === '第 99 期 · 2099 年 1 月 2 日 周五' && g.head === 'NEW HEADLINE' && g.items === 'a1|a2|a3' && g.meta === '从 75 条新内容里选了 31 条 · 约 6 分钟读完'],
  ['the same issue leaves it', 'qinxujunai.github.io', { ...good, date: built.date }, unchanged],
  ['an older issue leaves it', 'qinxujunai.github.io', { ...good, date: '2020-01-01' }, unchanged],
  ['an empty headline is ignored', 'qinxujunai.github.io', { ...good, headline: '' }, unchanged],
  ['a word for a count is ignored', 'qinxujunai.github.io', { ...good, picked: 'lots' }, unchanged],
  ['a null issue number is ignored', 'qinxujunai.github.io', { ...good, number: null }, unchanged],
  ['issue number 0 is ignored', 'qinxujunai.github.io', { ...good, number: 0 }, unchanged],
  ['an empty-string count is ignored', 'qinxujunai.github.io', { ...good, scanned: '' }, unchanged],
  ['a true count is ignored', 'qinxujunai.github.io', { ...good, minutes: true }, unchanged],
  ['broken JSON is ignored', 'qinxujunai.github.io', '{oops', unchanged],
  ['a 404 is ignored', 'qinxujunai.github.io', 404, unchanged],
  ['HTML in the data shows as text', 'qinxujunai.github.io', { ...good, headline: '<img src=x onerror=alert(1)>' }, (g) => g.head.startsWith('&lt;img')],
  ['fewer items and no intro hide the rest', 'qinxujunai.github.io', { ...good, tldr: ['only one'], intro: '' }, (g) => g.items === 'only one|-|-' && g.intro === true],
  ['another domain reads it from the full address', 'example.org', good, (g) => g.head === 'NEW HEADLINE'],
];

async function run(browser, [name, host, feed, expect]) {
  const page = await browser.newPage();
  const asked = [];
  await page.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (u.pathname === '/ai-signal/latest.json') {
      asked.push(u.href);
      if (feed === 404) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: typeof feed === 'string' ? feed : JSON.stringify(feed) });
    }
    if (u.hostname !== host) return r.abort();
    let f = path.join(ROOT, decodeURIComponent(u.pathname));
    if (f.endsWith(path.sep) || f.endsWith('/')) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) return r.fulfill({ status: 404, body: '' });
    r.fulfill({ status: 200, contentType: TYPES[path.extname(f)] || 'application/octet-stream', body: fs.readFileSync(f) });
  });
  await page.goto(`https://${host}/`);
  await page.waitForFunction(() => window.qxjReady);
  await page.waitForTimeout(600);
  const g = await page.evaluate(() => {
    const c = document.querySelector('.signal-card');
    const intro = c.querySelector('.sc-intro');
    return {
      date: c.dataset.date, when: c.querySelector('.sc-when').textContent, head: c.querySelector('.sc-head').innerHTML,
      intro: intro ? intro.hidden : null, meta: c.querySelector('.sc-meta').textContent,
      items: [...c.querySelectorAll('.sc-item')].map((i) => (i.style.display === 'none' ? '-' : i.lastChild.textContent)).join('|'),
    };
  });
  await page.close();
  const pass = asked.length === 1 && expect(g);
  console.log(`${pass ? '✓' : '✗'} AI Signal card: ${name}${pass ? '' : ` ${JSON.stringify(g)} asked=${asked.join(' ')}`}`);
  return pass;
}

(async () => {
  const opts = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' } : {};
  const browser = await chromium.launch(opts);
  let ok = true;
  for (const c of CASES) ok = (await run(browser, c)) && ok;
  await browser.close();
  console.log(ok ? 'AI Signal card: all cases behave' : 'AI Signal card: some cases failed');
  process.exit(ok ? 0 : 1);
})();
