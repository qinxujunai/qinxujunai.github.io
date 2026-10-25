// Copies the film site's hosts.json (where the film plays and downloads from; its source is src/hosts.json in the
// too-late-to-love-you repository) into src/film-hosts.json, so this site always plays from the same host.
// Run by npm run ship (with --strict: no copy, no ship) and every six hours by .github/workflows/stats.yml.
// To switch hosts, do not edit the copy: run npm run host -- tencent | cloudflare in the film repository.
import fs from 'node:fs';
const LIVE = 'https://qinxujunai.github.io/too-late-to-love-you/hosts.json';
const OUT = new URL('../src/film-hosts.json', import.meta.url);
const strict = process.argv.includes('--strict');
try {
  const r = await fetch(`${LIVE}?t=${Date.now()}`, { signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const h = await r.json();
  if (!h.hosts?.[h.active] || Object.keys(h.hosts).length !== 2 || !/^[0-9a-f]{32}$/.test(h.file?.md5 || '')) throw new Error('unexpected shape');
  // Only plain https addresses of the film file: this copy decides what the site may load from another origin.
  for (const [k, v] of Object.entries(h.hosts)) {
    const ok = (u, q) => { try { const x = new URL(u); return x.protocol === 'https:' && x.pathname === '/too-late-to-love-you.mp4' && (q ? x.search === '' || x.search === '?download=1' : x.search === ''); } catch { return false; } };
    if (!ok(v.play, false) || !ok(v.download, true)) throw new Error(`unexpected address for ${k}`);
  }
  const text = JSON.stringify(h, null, 2) + '\n';
  const before = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (text !== before) { fs.writeFileSync(OUT, text); console.log(`film hosts updated: active ${h.active}`); }
  else console.log(`film hosts unchanged: active ${h.active}`);
} catch (e) {
  console.error(`could not read ${LIVE}: ${e.message}${strict ? '' : ' (keeping src/film-hosts.json)'}`);
  if (strict) process.exit(1);
}
