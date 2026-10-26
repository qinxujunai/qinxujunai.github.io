// Every page the build writes, for npm run check and npm run lock (one list, so a new page is never left out of either).
import fs from 'node:fs';
import { CASES } from '../src/cases.mjs';

const notes = JSON.parse(fs.readFileSync(new URL('../src/notes.json', import.meta.url), 'utf8')).length ? ['notes/index.html', 'en/notes/index.html'] : [];
export const PAGES = ['index.html', 'en/index.html', '404.html', ...notes, ...CASES.flatMap((c) => [`work/${c.slug}/index.html`, `en/work/${c.slug}/index.html`])];
