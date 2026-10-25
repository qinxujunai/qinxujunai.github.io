// Refreshes src/stats.json with live GitHub numbers for the projects that ship a Windows installer.
// Runs in GitHub Actions (.github/workflows/stats.yml) with GITHUB_TOKEN; locally it falls back to shields.io.
// Only writes the file when a number actually changed, so the scheduled job commits nothing on quiet days.
//
// "downloads" counts installer downloads only (*.exe). Checksums, notices and the runtime packs an app
// fetches for itself on first run (万象成文's ffmpeg and model zips) are not people installing it.
import fs from 'node:fs';
import { parseCount } from './count.mjs';

const REPOS = { voiceflow: 'qinxujunai/VoiceFlow', wanxiang: 'qinxujunai/Audio2Text' };
const FILE = new URL('../src/stats.json', import.meta.url);
const token = process.env.GITHUB_TOKEN;
const headers = { 'User-Agent': 'qinxujunai.github.io', Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
const KEYS = ['stars', 'forks', 'downloads', 'version'];

async function json(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fromGitHub(repo) {
  const meta = await json(`https://api.github.com/repos/${repo}`);
  let downloads = 0;
  let version = '';
  for (let page = 1; page < 20; page++) {
    const releases = await json(`https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`);
    if (!releases.length) break;
    for (const r of releases) {
      if (!version && !r.draft && !r.prerelease) version = r.tag_name;
      for (const a of r.assets) if (/\.exe$/i.test(a.name)) downloads += a.download_count;
    }
  }
  return { stars: meta.stargazers_count, forks: meta.forks_count, downloads, version };
}

// Shields has no installer-only total, so a local run keeps the last downloads figure.
async function fromShields(repo, old) {
  const get = async (path) => (await json(`https://img.shields.io/github/${path}.json`)).value;
  return { stars: parseCount(await get(`stars/${repo}`)), forks: parseCount(await get(`forks/${repo}`)), downloads: old?.downloads ?? 0, version: await get(`v/release/${repo}`) };
}

const current = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let changed = false;
for (const [slug, repo] of Object.entries(REPOS)) {
  const old = current[slug];
  let next;
  try {
    next = await fromGitHub(repo);
  } catch (e) {
    console.warn(`GitHub API unavailable for ${repo} (${e.message}); trying shields.io`);
    next = await fromShields(repo, old);
  }
  for (const k of KEYS) {
    const v = next[k];
    // A version looks like v0.3.10 or 2.3.0; shields may answer 「no releases or repo not found」, which must not reach the page.
    const okValue = k === 'version' ? typeof v === 'string' && /^v?\d+(\.\d+)+$/.test(v.trim()) : Number.isSafeInteger(v) && v >= 0;
    if (!okValue) throw new Error(`bad value for ${slug}.${k}: ${JSON.stringify(v)}`);
  }
  if (!old || KEYS.some((k) => old[k] !== next[k])) {
    current[slug] = { ...next, updated: new Date().toISOString().slice(0, 10) };
    changed = true;
  }
  console.log(slug, JSON.stringify(current[slug]));
}
if (changed) fs.writeFileSync(FILE, JSON.stringify(current, null, 2) + '\n');
console.log(changed ? 'updated' : 'unchanged');
