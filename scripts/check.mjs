// Static checks that must pass before every push:
// 1. built pages are up to date with src/
// 2. every zh page and its en twin have the same structure
// 3. no private data anywhere in the repository
// 4. no resource is loaded from another origin; every internal link points at a real file
// 5. size budgets
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

let failed = 0;
const fail = (msg) => { failed++; console.error('✗', msg); };
const ok = (msg) => console.log('✓', msg);

// 1. Up to date
import { CASES } from '../src/cases.mjs';
import { FILM } from '../src/content.mjs';
// The film repository checked out next to this one, if any (its folder may still carry the old name).
const SIBLING_FILM = [process.env.FILM_REPO, '../too-late-to-love-you', '../laibuji-aini'].find((d) => d && fs.existsSync(path.join(d, 'src/hosts.json'))) || '';
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
  [/(?:19|20)?\d{2}\s*年\s*(?:刚|才)?毕业|(?:graduated|graduation)\s+(?:in\s+)?(?:19|20)\d{2}/i, 'graduation year'],
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

// 3.1 Work history (2026-11-08): no employer, client or career phrase in any public file. The public site went without 经历 on
// 2026-10-26, yet names stayed behind in a build word list and in docs. Names are kept here only as truncated SHA-256
// hashes, so this list names none (the originals are kept outside this repository). Content
// that changes on its own (the day's AI Signal issue, GitHub numbers) is skipped: news may name a bank.
{
  const { createHash } = await import('node:crypto');
  const NAMES = [[4, 'a3e0c3db09735010'], [4, '5ac77b016b70a052'], [4, '0ed2fc3d4cef6624'], [4, '0a895bbfa90d5a07'], [2, '8fc8b350966cf58a'], [4, '87eaaaac9ac70849'], [3, '6196293ad68e2e62'], [4, '2cd625031f910f4e'], [4, 'e7e901fd1d79de18'], [4, '646ed1c833d68b2a'], [2, '0ce898abc91403c4'], [3, '2266404e01cef907'], [4, '1831f94f5c76fdfd'], [6, '6f81c35246921da1'], [6, '2603e5c0b205dd9c'], [4, 'cd4894588d2e7270'], [4, 'dabc435bb8d406e9'], [3, 'ee1de0e635eaf50c'],
    // Two schools he once interviewed with, and two career phrases (were plain-text rules above until 2026-11-08).
    [3, '4ccac1e33312c8ea'], [3, '4305738287193c0e'], [5, '02d5593de524fba7'], [7, 'c4514736bf75ff21']];
  const want = new Set(NAMES.map(([n, h]) => `${n}:${h}`));
  const lens = [...new Set(NAMES.map(([n]) => n))];
  const hits = [];
  for (const f of files.filter((x) => !/^src\/(signal|stats)\.json$/.test(x))) {
    const t = fs.readFileSync(f, 'utf8').replace(/<!--live-->[\s\S]*?<!--\/live-->/g, '').replace(/<wbr>|\s/g, '');
    const runs = t.match(/[㐀-鿿]{2,}/g) || [];
    for (const r of runs) for (const n of lens) for (let i = 0; i + n <= r.length; i++) {
      if (want.has(`${n}:${createHash('sha256').update(r.slice(i, i + n)).digest('hex').slice(0, 16)}`)) hits.push(`${f}: ${r.slice(Math.max(0, i - 4), i + n + 4)}`);
    }
  }
  hits.length ? fail(`employer or client names in public files:\n  ${hits.join('\n  ')}`) : ok('work history: no employer or client names in public files');
}

// 4. Same-origin resources only (links to other sites are fine; loading from them is not)
const exists = (url) => {
  const p = decodeURI(url.split('#')[0].split('?')[0]).replace(/^\//, '');
  return p === '' || fs.existsSync(p.endsWith('/') ? `${p}index.html` : p) || fs.existsSync(`${p}/index.html`);
};
for (const [name, h] of Object.entries(html)) {
  const loads = [...h.matchAll(/<(?:script|img|link|source|iframe|video)\b[^>]*?\s(?:src|href)="([^"]+)"/g)]
    .map((m) => m[0].startsWith('<link') && /rel="(canonical|alternate)"/.test(m[0]) ? null : m[1])
    .filter((u) => u && /^(https?:)?\/\//.test(u) && ![FILM.play, FILM.backup].includes(u));
  if (loads.length) fail(`${name} loads from another origin: ${loads.join(', ')}`);
  const blank = [...h.matchAll(/<a\b[^>]*href="https?:[^"]+"[^>]*>/g)].filter((m) => !/rel="noopener"/.test(m[0]));
  if (blank.length) fail(`${name}: external links without rel="noopener"`);
  const sizeless = [...h.matchAll(/<img\b[^>]*>/g)].filter((m) => !/width="/.test(m[0]) || !/height="/.test(m[0]));
  if (sizeless.length) fail(`${name}: images without width/height`);
  const internal = [...h.matchAll(/\s(?:href|src|srcset)="(\/[^"]*)"/g)].flatMap((m) => m[1].split(', ').map((u) => u.split(' ')[0]));
  // /too-late-to-love-you/ is the film's own repository on this same origin; it is checked
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
// 2026-11-09: +1KB for the interview and podcast cards in 阅读 (both languages); css 55 → 56KB for their styles. The first
// screen keeps its budget.
// 2026-11-09 (later): 30 → 31KB: two more books and fuller 「书里说」 for every book (he asked for each book's core idea).
// 2026-11-09 (third): 31 → 32KB: the shelf holds ten books (his cap). The first screen keeps its 40KB budget.
const heavy = PAGES.filter((f) => gz(f) > 32);
heavy.length ? fail(`over 32KB gzipped: ${heavy.map((f) => `${f} ${gz(f).toFixed(1)}KB`).join(', ')}`) : ok(`every page ≤ 32KB gzipped (home ${gz('index.html').toFixed(1)}KB, ${kb('index.html').toFixed(0)}KB raw)`);
// v26.6: the domestic film line, WeChat copy buttons and the book opening. The first screen keeps its own budget.
// site.js 17 → 19KB (2026-11-08): the AI Signal card swaps in the day's issue when the page opens (about 1.8KB with
// its comments). site.css was checked the same day: no unused selectors to remove. The first-screen budget is unchanged.
// site.js 19 → 21KB (2026-11-08, second time): off-screen sections are laid out while the phone is idle, and every
// in-page jump lays them all out first (home page blocking time on a mid-range phone 0.58 s → 0.23 s, scrolling still 0).
const budget = { 'assets/site.css': 56, 'assets/site.js': 21 };
for (const [f, max] of Object.entries(budget)) {
  kb(f) <= max ? ok(`${f} ${kb(f).toFixed(1)}KB ≤ ${max}KB`) : fail(`${f} is ${kb(f).toFixed(1)}KB, budget ${max}KB`);
}
const first = gz('index.html') + gz('assets/site.js') + kb('assets/media/avatar-160.webp');
first <= 40 ? ok(`first screen ${first.toFixed(0)}KB over the wire ≤ 40KB`) : fail(`first screen ${first.toFixed(0)}KB > 40KB`);
const media = fs.readdirSync('assets/media').reduce((s, f) => s + kb(`assets/media/${f}`), 0);
media <= 3000 ? ok(`all images ${media.toFixed(0)}KB ≤ 3000KB (lazy-loaded below the fold)`) : fail(`images ${media.toFixed(0)}KB > 3000KB`);

// The film (v27.18, 2026-10-25): plays from the video's own src (WeChat's in-app player on Android reads only src,
// never <source>), from the active host in src/film-hosts.json, with the other host as its only fallback; that copy
// matches the film site's src/hosts.json (npm run ship refreshes it first: scripts/film-hosts.mjs --strict).
{
  const want = `<video id="film" src="${FILM.play}" data-sources="${FILM.play} ${FILM.backup}"`;
  const pages = ['index.html', 'en/index.html'];
  const bad = pages.filter((p) => !html[p].includes(want) || !/<video id="film"[^>]*x5-playsinline[^>]*><\/video>/.test(html[p]));
  const hosts = Object.keys(FILM.hosts);
  bad.length || hosts.length !== 2 || !hosts.includes(FILM.active) ? fail(`the film must play from the active host (${FILM.active}) on src, with the other host as the only fallback and no <source> children: ${bad.join(', ')}`) : ok(`film plays from ${FILM.active} on src, the other host only if it cannot be reached`);
  const film = SIBLING_FILM && path.join(SIBLING_FILM, 'src/hosts.json');
  if (film) {
    const f = JSON.parse(fs.readFileSync(film, 'utf8'));
    f.active === FILM.active && JSON.stringify(f.hosts) === JSON.stringify(FILM.hosts) ? ok('film hosts match the film repository') : fail(`src/film-hosts.json (${FILM.active}) differs from the film repository's src/hosts.json (${f.active}): ship the film site first, then this one`);
  }
}

// The shields.io fallback parser for GitHub counts (v27.20: 「1.2k」 used to become 1.2).
try { execSync('node scripts/test-count.mjs', { stdio: 'pipe' }); ok('count parser handles 12, 1,234, 1.2k, 1.5M and rejects junk'); } catch (e) { fail(`count parser: ${e.stderr || e.message}`); }

// scripts/push.sh says "pushed" only after a real push (v27.20: the old loop printed it after four refused pushes).
try { execSync('bash scripts/test-push.sh', { stdio: 'pipe' }); ok('push.sh reports success only after a real push'); } catch (e) { fail(`push.sh: ${e.stdout || e.message}`); }

// Docs (v27.20): the memory files keep their sections (one was lost to a careless append), and the current docs
// do not send anyone to the old film repository.
{
  const need = { 'CLAUDE.md': ['## 他是谁', '## 他的原话', '## 决策记录', '## 否决过的方案', '## 待他补充', '## 工作环境备忘'], 'AGENTS.md': ['## 事实', '## 红线', '## 完成的定义'] };
  const lost = Object.entries(need).flatMap(([f, hs]) => hs.filter((h) => !fs.readFileSync(f, 'utf8').includes(`\n${h}`)).map((h) => `${f} ${h}`));
  lost.length ? fail(`missing sections: ${lost.join(', ')}`) : ok('CLAUDE.md and AGENTS.md keep all their sections');
  const stale = ['README.md', 'AGENTS.md'].filter((f) => /qinxujunai\/laibuji-aini\b|github\.io\/laibuji-aini\//.test(fs.readFileSync(f, 'utf8')));
  stale.length ? fail(`${stale.join(', ')} still point at the old film repository laibuji-aini`) : ok('README and AGENTS point at too-late-to-love-you');
}

// 6. Copy lock (2026-10-24): the copy is final. Any changed word fails here until the owner agrees and `npm run lock` records it.
import { checkCopy } from './copy-lock.mjs';
const copyProblems = checkCopy(PAGES);
copyProblems.length ? copyProblems.forEach(fail) : ok(`copy of ${PAGES.length} pages matches copy.lock.json; no relative time words`);

if (failed) { console.error(`\n${failed} check(s) failed`); process.exit(1); }
console.log('\nall checks passed');
