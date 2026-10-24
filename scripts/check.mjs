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
    .filter((u) => u && /^(https?:)?\/\//.test(u));
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
// v26 (2026-10-24): +2KB for the bookshelf and the three principles. The first screen has its own budget below.
const heavy = PAGES.filter((f) => gz(f) > 26);
heavy.length ? fail(`over 26KB gzipped: ${heavy.map((f) => `${f} ${gz(f).toFixed(1)}KB`).join(', ')}`) : ok(`every page ≤ 26KB gzipped (home ${gz('index.html').toFixed(1)}KB, ${kb('index.html').toFixed(0)}KB raw)`);
const budget = { 'assets/site.css': 48, 'assets/site.js': 14 };
for (const [f, max] of Object.entries(budget)) {
  kb(f) <= max ? ok(`${f} ${kb(f).toFixed(1)}KB ≤ ${max}KB`) : fail(`${f} is ${kb(f).toFixed(1)}KB, budget ${max}KB`);
}
const first = gz('index.html') + gz('assets/site.js') + kb('assets/media/avatar-160.webp');
first <= 40 ? ok(`first screen ${first.toFixed(0)}KB over the wire ≤ 40KB`) : fail(`first screen ${first.toFixed(0)}KB > 40KB`);
const media = fs.readdirSync('assets/media').reduce((s, f) => s + kb(`assets/media/${f}`), 0);
media <= 3000 ? ok(`all images ${media.toFixed(0)}KB ≤ 3000KB (lazy-loaded below the fold)`) : fail(`images ${media.toFixed(0)}KB > 3000KB`);

if (failed) { console.error(`\n${failed} check(s) failed`); process.exit(1); }
console.log('\nall checks passed');
