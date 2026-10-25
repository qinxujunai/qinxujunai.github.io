// Weekly link check (.github/workflows/links.yml): every outside link on the built pages, plus the film's play and
// download addresses on both hosts, must still open; and this site must play from the same host as the film site. A failure fails the workflow, and GitHub emails the owner.
// Redirects count as working (Douyin and WeChat Read share links redirect); 4xx/5xx and network errors do not.
import fs from 'node:fs';
import { CASES } from '../src/cases.mjs';
import { FILM } from '../src/content.mjs';

const pages = ['index.html', ...CASES.map((c) => `work/${c.slug}/index.html`)];
const urls = new Set(Object.values(FILM.hosts).flatMap((h) => [h.play, h.download]));
for (const p of pages) for (const m of fs.readFileSync(p, 'utf8').matchAll(/href="(https:\/\/[^"]+)"/g)) urls.add(m[1].replace(/&amp;/g, '&'));
for (const u of [...urls]) if (/^https:\/\/qinxujunai\.github\.io\/?$/.test(u)) urls.delete(u);

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
async function probe(u) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(u, { method: 'GET', redirect: 'manual', headers: { 'user-agent': UA, range: 'bytes=0-1023' }, signal: AbortSignal.timeout(20000) });
      if (r.status < 400) return r.status;
      if (r.status !== 429 && r.status < 500) return r.status;
    } catch (e) { if (i === 2) return e.name; }
    await new Promise((s) => setTimeout(s, 3000 * (i + 1)));
  }
  return 'retries exhausted';
}

const bad = [];
try {
  const live = await (await fetch(`https://qinxujunai.github.io/too-late-to-love-you/hosts.json?t=${Date.now()}`)).json();
  if (live.active !== FILM.active) bad.push(`the film site plays from ${live.active}, this site from ${FILM.active}: run npm run ship here`);
} catch (e) { bad.push(`film site hosts.json: ${e.message}`); }
for (const u of urls) {
  const s = await probe(u);
  const okay = typeof s === 'number' && s < 400;
  console.log(okay ? '✓' : '✗', s, u);
  if (!okay) bad.push(`${s} ${u}`);
}
if (bad.length) { console.error(`\n${bad.length} link(s) broken:\n${bad.join('\n')}`); process.exit(1); }
console.log(`\nall ${urls.size} links open`);
