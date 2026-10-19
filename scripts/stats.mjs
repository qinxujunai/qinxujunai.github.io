// Refreshes src/stats.json with live numbers for VoiceFlow from GitHub.
// Runs in GitHub Actions (.github/workflows/stats.yml) with GITHUB_TOKEN; locally it falls back to shields.io.
// Only writes the file when a number actually changed, so the scheduled job commits nothing on quiet days.
import fs from 'node:fs';

const REPO = 'qinxujunai/VoiceFlow';
const FILE = new URL('../src/stats.json', import.meta.url);
const token = process.env.GITHUB_TOKEN;
const headers = { 'User-Agent': 'qinxujunai.github.io', Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };

async function json(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fromGitHub() {
  const repo = await json(`https://api.github.com/repos/${REPO}`);
  let downloads = 0;
  let version = '';
  for (let page = 1; page < 20; page++) {
    const releases = await json(`https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`);
    if (!releases.length) break;
    for (const r of releases) {
      if (!version && !r.draft && !r.prerelease) version = r.tag_name;
      for (const a of r.assets) downloads += a.download_count;
    }
  }
  return { stars: repo.stargazers_count, forks: repo.forks_count, downloads, version };
}

async function fromShields() {
  const get = async (path) => (await json(`https://img.shields.io/github/${path}.json`)).value;
  const n = (v) => Number(String(v).replace(/[^\d.k]/gi, '').replace(/k$/i, '000'));
  return {
    stars: n(await get(`stars/${REPO}`)),
    forks: n(await get(`forks/${REPO}`)),
    downloads: n(await get(`downloads/${REPO}/total`)),
    version: await get(`v/release/${REPO}`),
  };
}

const current = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let next;
try {
  next = await fromGitHub();
} catch (e) {
  console.warn(`GitHub API unavailable (${e.message}); trying shields.io`);
  next = await fromShields();
}
for (const [k, v] of Object.entries(next)) {
  if (v === undefined || v === null || v === '' || Number.isNaN(v)) throw new Error(`bad value for ${k}: ${v}`);
}

const old = current.voiceflow;
const changed = ['stars', 'forks', 'downloads', 'version'].some((k) => old[k] !== next[k]);
if (changed) {
  current.voiceflow = { ...next, updated: new Date().toISOString().slice(0, 10) };
  fs.writeFileSync(FILE, JSON.stringify(current, null, 2) + '\n');
}
console.log(changed ? 'updated' : 'unchanged', JSON.stringify(current.voiceflow));
