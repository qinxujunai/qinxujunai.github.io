// Refreshes src/signal.json with today's AI Signal issue, so the home page card is always the latest one.
// AI Signal publishes latest.json right after each 10:00 send (ai-signal/scripts/publish.js).
// Only plain fields are kept; the page renders them in its own type. Nothing changes if the fetch fails.
import fs from 'node:fs';

const URL_LATEST = 'https://qinxujunai.github.io/ai-signal/latest.json';
const FILE = new URL('../src/signal.json', import.meta.url);

try {
  const res = await fetch(URL_LATEST, { headers: { 'User-Agent': 'qinxujunai.github.io' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const d = await res.json();
  const str = (v) => (typeof v === 'string' ? v.trim() : '');
  const num = (v) => (Number.isFinite(+v) ? +v : 0);
  const next = {
    number: num(d.number), date: str(d.date), dateLabel: str(d.dateLabel),
    scanned: num(d.scanned), picked: num(d.picked), minutes: num(d.minutes),
    headline: str(d.headline), intro: str(d.intro),
    tldr: (Array.isArray(d.tldr) ? d.tldr : []).map(str).filter(Boolean).slice(0, 3),
    url: /^https:\/\/qinxujunai\.github\.io\/ai-signal\//.test(str(d.url)) ? str(d.url) : 'https://qinxujunai.github.io/ai-signal/latest/',
  };
  if (!next.headline || !/^\d{4}-\d{2}-\d{2}$/.test(next.date)) throw new Error('incomplete latest.json');
  const before = fs.existsSync(FILE) ? fs.readFileSync(FILE, 'utf8') : '';
  const after = JSON.stringify(next, null, 2) + '\n';
  if (before !== after) { fs.writeFileSync(FILE, after); console.log(`signal: issue ${next.number} (${next.date})`); }
  else console.log('signal: unchanged');
} catch (e) {
  console.log(`signal: kept the previous issue (${e.message})`);
}
