// Static checks that must pass before every push:
// 1. built pages are up to date with src/content.mjs
// 2. zh and en pages have the same structure
// 3. no private data anywhere in the repository
// 4. no resource is loaded from another origin
import fs from 'node:fs';
import { execSync } from 'node:child_process';

let failed = 0;
const fail = (msg) => { failed++; console.error('✗', msg); };
const ok = (msg) => console.log('✓', msg);

// 1. Up to date
const before = ['index.html', 'en/index.html', '404.html'].map((f) => fs.readFileSync(f, 'utf8'));
execSync('node scripts/build.mjs', { stdio: 'ignore' });
const after = ['index.html', 'en/index.html', '404.html'].map((f) => fs.readFileSync(f, 'utf8'));
before.every((b, i) => b === after[i]) ? ok('built pages match src/content.mjs') : fail('pages were stale; rebuilt, commit them');

// 2. Same structure
const ids = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).join(',');
const [zh, en] = after;
ids(zh) === ids(en) ? ok(`zh/en share ids: ${ids(zh)}`) : fail(`zh/en ids differ:\n  ${ids(zh)}\n  ${ids(en)}`);

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
for (const [name, html] of [['index.html', zh], ['en/index.html', en], ['404.html', after[2]]]) {
  const loads = [...html.matchAll(/<(?:script|img|link|source|iframe)\b[^>]*?\s(?:src|href)="([^"]+)"/g)]
    .map((m) => m[0].startsWith('<link') && /rel="(canonical|alternate)"/.test(m[0]) ? null : m[1])
    .filter((u) => u && /^(https?:)?\/\//.test(u));
  loads.length ? fail(`${name} loads from another origin: ${loads.join(', ')}`) : ok(`${name}: same-origin resources only`);
  const blank = [...html.matchAll(/<a\b[^>]*href="https?:[^"]+"[^>]*>/g)].filter((m) => !/rel="noopener"/.test(m[0]));
  blank.length ? fail(`${name}: external links without rel="noopener"`) : ok(`${name}: external links carry rel="noopener"`);
  const sizeless = [...html.matchAll(/<img\b[^>]*>/g)].filter((m) => !/width="/.test(m[0]) || !/height="/.test(m[0]));
  sizeless.length ? fail(`${name}: images without width/height`) : ok(`${name}: every image has width and height`);
}

// Size budget
const kb = (f) => fs.statSync(f).size / 1024;
const budget = { 'index.html': 52, 'en/index.html': 52, 'assets/site.css': 22, 'assets/site.js': 9 };
for (const [f, max] of Object.entries(budget)) {
  kb(f) <= max ? ok(`${f} ${kb(f).toFixed(1)}KB ≤ ${max}KB`) : fail(`${f} is ${kb(f).toFixed(1)}KB, budget ${max}KB`);
}
const total = ['index.html', 'assets/site.css', 'assets/site.js', 'assets/media/avatar-320.webp'].reduce((s, f) => s + kb(f), 0);
total <= 90 ? ok(`first screen ${total.toFixed(0)}KB uncompressed ≤ 90KB`) : fail(`first screen ${total.toFixed(0)}KB > 90KB`);
const media = fs.readdirSync('assets/media').reduce((s, f) => s + kb(`assets/media/${f}`), 0);
media <= 1100 ? ok(`all images ${media.toFixed(0)}KB ≤ 1100KB (lazy-loaded below the fold)`) : fail(`images ${media.toFixed(0)}KB > 1100KB`);

if (failed) { console.error(`\n${failed} check(s) failed`); process.exit(1); }
console.log('\nall checks passed');
