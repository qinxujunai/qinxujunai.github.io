// Static checks that must pass before every push:
// 1. built pages are up to date with src/
// 2. every zh page and its en twin have the same structure
// 3. no private data anywhere in the repository
// 4. no resource is loaded from another origin; every internal link points at a real file
// 5. size budgets
import fs from 'node:fs';
import { execSync } from 'node:child_process';

let failed = 0;
const fail = (msg) => { failed++; console.error('✗', msg); };
const ok = (msg) => console.log('✓', msg);

// 1. Up to date
import { CASES } from '../src/cases.mjs';
import { FILM_SOURCES } from '../src/content.mjs';
const PAGES = ['index.html', 'en/index.html', '404.html', ...CASES.flatMap((c) => [`work/${c.slug}/index.html`, `en/work/${c.slug}/index.html`])];
const readAll = () => Object.fromEntries(PAGES.map((f) => [f, fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '']));
const before = readAll();
execSync('node scripts/build.mjs', { stdio: 'ignore' });
const html = readAll();
PAGES.every((f) => before[f] === html[f]) ? ok(`${PAGES.length} built pages match src/`) : fail('pages were stale; rebuilt, commit them');

// 2. Same structure
const ids = (h) => [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).join(',');
for (const f of PAGES.filter((p) => !p.startsWith('en/') && p !== '404.html')) {
  const en = `en/${f}`;
  ids(html[f]) === ids(html[en]) ? ok(`${f} and ${en} share ids`) : fail(`ids differ:\n  ${f}: ${ids(html[f])}\n  ${en}: ${ids(html[en])}`);
}

// 2.5 Voice (v27.3, his words: 「苹果官网它会来一句说：『你是这样，你什么什么人』……它会这样说话吗？」).
// The page says what is here and what he does; it never tells the reader how to live or sorts people into kinds.
// His advice was spoken to one person; on a page it reads as a lecture. See docs/copy.md 「不对读者说教」.
{
  const LECTURE = [/什么样的人/, /那种人/, /这(三|几|两)个人/, /也听这/, /去听/, /你得/, /你要/, /你应该/, /你会发现/, /时候就做三件事/, /照着练就行/, /不要迷信/, /要懂一点/, /先解决自己的问题/, /重要的是为了/];
  const text = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, '').replace(/<wbr>/g, '');
  const hits = PAGES.filter((f) => !f.startsWith('en/')).flatMap((f) => LECTURE.filter((re) => re.test(text(html[f]).replace(/\s/g, ''))).map((re) => `${f}: ${re.source}`));
  hits.length ? fail(`lecturing copy:\n  ${hits.join('\n  ')}`) : ok('voice: no lecturing or labelling of readers');
}

// 3. Privacy: tracked text files only
const files = execSync('git ls-files --cached --others --exclude-standard', { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f && /\.(html|css|js|mjs|json|md|txt|xml|svg)$/.test(f) && !f.startsWith('node_modules/') && f !== 'package-lock.json' && f !== 'scripts/check.mjs');
const rules = [
  [/(?<!\d)1[3-9]\d{9}(?!\d)/, 'mobile number'],
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|cn|net|org|io)\b/, 'email address'],
  [/\d{1,2}\s*-\s*\d{1,2}\s*K\b/i, 'salary range'],
  [/期望薪资|\d{2}\s*岁/, 'salary or age'],
];
const allowEmail = /noreply@anthropic\.com/;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  for (const [re, what] of rules) {
    const m = re.exec(text);
    if (m && !(what === 'email address' && allowEmail.test(m[0]))) fail(`${f}: looks like a ${what}: "${m[0]}"`);
  }
}
if (fs.readdirSync('.').some((f) => /resume|简历|cv\.(pdf|docx?)$/i.test(f))) fail('a resume file is in the repository root');
ok(`privacy scan over ${files.length} files`);

// 4. Same-origin resources only (links to other sites are fine; loading from them is not)
const exists = (url) => {
  const p = decodeURI(url.split('#')[0].split('?')[0]).replace(/^\//, '');
  return p === '' || fs.existsSync(p.endsWith('/') ? `${p}index.html` : p) || fs.existsSync(`${p}/index.html`);
};
for (const [name, h] of Object.entries(html)) {
  const loads = [...h.matchAll(/<(?:script|img|link|source|iframe|video)\b[^>]*?\s(?:src|href)="([^"]+)"/g)]
    .map((m) => m[0].startsWith('<link') && /rel="(canonical|alternate)"/.test(m[0]) ? null : m[1])
    .filter((u) => u && /^(https?:)?\/\//.test(u) && !FILM_SOURCES.includes(u));
  if (loads.length) fail(`${name} loads from another origin: ${loads.join(', ')}`);
  const blank = [...h.matchAll(/<a\b[^>]*href="https?:[^"]+"[^>]*>/g)].filter((m) => !/rel="noopener"/.test(m[0]));
  if (blank.length) fail(`${name}: external links without rel="noopener"`);
  const sizeless = [...h.matchAll(/<img\b[^>]*>/g)].filter((m) => !/width="/.test(m[0]) || !/height="/.test(m[0]));
  if (sizeless.length) fail(`${name}: images without width/height`);
  const internal = [...h.matchAll(/\s(?:href|src|srcset)="(\/[^"]*)"/g)].flatMap((m) => m[1].split(', ').map((u) => u.split(' ')[0]));
  // /too-late-to-love-you/ is the film's own repository on this same origin (the film plays from there); it is checked
  // by that repository and on the live site, not in this checkout.
  const broken = [...new Set(internal.filter((u) => !u.startsWith('/too-late-to-love-you/') && !exists(u)))];
  if (broken.length) fail(`${name}: internal links to missing files: ${broken.join(', ')}`);
  const anchors = [...h.matchAll(/\shref="#([^"]+)"/g)].map((m) => m[1]).filter((id) => !h.includes(`id="${id}"`));
  if (anchors.length) fail(`${name}: anchors without a target: ${anchors.join(', ')}`);
}
ok(`${PAGES.length} pages: same-origin resources, noopener, sized images, internal links resolve`);

// 5. Size budget. Pages inline the stylesheet and the signature, which compress well: budget the gzip size.
import zlib from 'node:zlib';
const kb = (f) => fs.statSync(f).size / 1024;
const gz = (f) => zlib.gzipSync(fs.readFileSync(f)).length / 1024;
// v26 (2026-10-24): +2KB for the bookshelf and the three principles; v26.5 +2KB for 我推荐. The first screen has its own budget below.
const heavy = PAGES.filter((f) => gz(f) > 29);
heavy.length ? fail(`over 29KB gzipped: ${heavy.map((f) => `${f} ${gz(f).toFixed(1)}KB`).join(', ')}`) : ok(`every page ≤ 29KB gzipped (home ${gz('index.html').toFixed(1)}KB, ${kb('index.html').toFixed(0)}KB raw)`);
// v26.6: the domestic film line, WeChat copy buttons and the book opening. The first screen keeps its own budget.
const budget = { 'assets/site.css': 55, 'assets/site.js': 16 }; // v27.2: 52KB for the reading section's people; v27.17: 55KB (Apple's measured hover rules; the v27.15–16 extras removed)
for (const [f, max] of Object.entries(budget)) {
  kb(f) <= max ? ok(`${f} ${kb(f).toFixed(1)}KB ≤ ${max}KB`) : fail(`${f} is ${kb(f).toFixed(1)}KB, budget ${max}KB`);
}
const first = gz('index.html') + gz('assets/site.js') + kb('assets/media/avatar-160.webp');
first <= 40 ? ok(`first screen ${first.toFixed(0)}KB over the wire ≤ 40KB`) : fail(`first screen ${first.toFixed(0)}KB > 40KB`);
const media = fs.readdirSync('assets/media').reduce((s, f) => s + kb(`assets/media/${f}`), 0);
media <= 3000 ? ok(`all images ${media.toFixed(0)}KB ≤ 3000KB (lazy-loaded below the fold)`) : fail(`images ${media.toFixed(0)}KB > 3000KB`);

// The film plays from the video's own src (v27.18): WeChat's in-app player on Android reads only src, never <source>.
/<video id="film" src="https:\/\/media\.praxisai\.online\/too-late-to-love-you\.mp4" data-sources="[^"]+"[^>]*x5-playsinline/.test(html['index.html']) && /<video id="film"[^>]*><\/video>/.test(html['index.html']) ? ok('film plays from src with a scripted fallback (WeChat)') : fail('the film must play from src, with no <source> children: WeChat ignores them');

// 6. Copy lock (2026-10-24): the copy is final. Any changed word fails here until the owner agrees and `npm run lock` records it.
import { checkCopy } from './copy-lock.mjs';
const copyProblems = checkCopy(PAGES);
copyProblems.length ? copyProblems.forEach(fail) : ok(`copy of ${PAGES.length} pages matches copy.lock.json; no relative time words`);

if (failed) { console.error(`\n${failed} check(s) failed`); process.exit(1); }
console.log('\nall checks passed');
