// Turns a count as shields.io prints it into a number: "12", "1,234", "1.2k", "15k", "1.5M".
// Anything else ("invalid", "repo not found", "", "-3") throws, so a bad answer never reaches src/stats.json.
// shields rounds large counts ("1.2k" may be 1,150–1,249); it is only the fallback when the GitHub API is down.
const UNIT = { '': 1, k: 1e3, m: 1e6, b: 1e9 };

export function parseCount(value) {
  if (typeof value === 'number') {
    if (Number.isSafeInteger(value) && value >= 0) return value;
    throw new Error(`not a count: ${value}`);
  }
  const m = /^\s*(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*([kmb]?)\s*$/i.exec(String(value ?? ''));
  // A fraction only makes sense with a unit (1.2k); a bare 1.5 is not a count.
  if (!m || (m[1].includes('.') && !m[2])) throw new Error(`not a count: ${JSON.stringify(value)}`);
  const n = Math.round(Number(m[1].replace(/,/g, '')) * UNIT[m[2].toLowerCase()]);
  if (!Number.isSafeInteger(n)) throw new Error(`not a count: ${JSON.stringify(value)}`);
  return n;
}
