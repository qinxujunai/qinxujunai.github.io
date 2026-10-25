// Run by npm run check. The fallback parser for shields.io counts (scripts/count.mjs).
import assert from 'node:assert/strict';
import { parseCount } from './count.mjs';

const good = { '0': 0, '12': 12, '1,234': 1234, '12,345,678': 12345678, '1.2k': 1200, '15k': 15000, '1.5M': 1500000, '2b': 2000000000, ' 7 ': 7 };
for (const [s, n] of Object.entries(good)) assert.equal(parseCount(s), n, s);
assert.equal(parseCount(42), 42);
for (const s of ['', 'invalid', 'repo not found', '-3', '1.2.3', '1,23', 'k', '12kk', '1.5', null, undefined, NaN, 1.5, -1]) assert.throws(() => parseCount(s), undefined, String(s));
console.log(`count parser: ${Object.keys(good).length + 1} valid and 14 invalid inputs behave`);
