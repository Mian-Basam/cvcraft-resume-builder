// Data helpers shared by the infographic templates: headline numbers pulled out of bullet text, and year spans.

const STOP = new Set(["to", "from", "by", "in", "of", "and", "or", "the", "a", "an", "per", "for", "with", "on", "at"]);
const NUM = /(\$\s?)?(\d[\d,]*(?:\.\d+)?)(\s?%|x\b|k\b|m\b|\+)?/gi;

function toNumber(s) {
  return parseFloat(String(s).replace(/[^\d.]/g, "")) || 0;
}

// 40000 -> "40K", 1250000 -> "1.3M"; small numbers unchanged.
export function compact(n, raw) {
  if (n >= 1e6) return `${+(n / 1e6).toFixed(1)}M`;
  if (n >= 1e4) return `${+(n / 1e3).toFixed(1)}K`;
  return raw;
}

/*
  The most "headline" number in a sentence, or null.
  { kind: "percent" | "money" | "change" | "count", value (display), n (number), word (unit word after it),
    match (exact substring), index, from, to (for "change") }
*/
export function metricOf(text) {
  const t = text || "";
  const ft = t.match(/from\s+(\$?\d[\d,.]*\s?%?)\s*([A-Za-z]+)?\s+to\s+(\$?\d[\d,.]*\s?%?)/i);
  if (ft) {
    const from = toNumber(ft[1]);
    const to = toNumber(ft[3]);
    return { kind: "change", value: `${ft[1].trim()}→${ft[3].trim()}`, n: to, from, to, word: ft[2] || "", match: ft[0], index: ft.index };
  }
  const found = [];
  let m;
  NUM.lastIndex = 0;
  while ((m = NUM.exec(t))) {
    const n = toNumber(m[2]);
    const suffix = (m[3] || "").trim().toLowerCase();
    const isYear = !m[1] && !suffix && /^\d{4}$/.test(m[2]) && n >= 1900 && n <= 2099;
    if (isYear) continue;
    const after = t.slice(m.index + m[0].length).match(/^\s*([A-Za-z][A-Za-z-]*)/);
    const word = after && !STOP.has(after[1].toLowerCase()) ? after[1] : "";
    let kind = "count";
    if (suffix === "%") kind = "percent";
    else if (m[1]) kind = "money";
    let value = m[0].replace(/\s+/g, "");
    if (kind === "count" && !suffix) value = compact(n, m[2]);
    found.push({ kind, value, n, word, match: m[0], index: m.index, rank: kind === "count" ? (suffix ? 1 : 0) : 2 });
  }
  if (!found.length) return null;
  found.sort((a, b) => b.rank - a.rank || b.n - a.n);
  return found[0];
}

// Every bullet (experience + projects) that carries a number, with where it came from.
export function allMetrics(data) {
  const out = [];
  (data.experience || []).forEach((e) =>
    String(e.bullets || "").split("\n").map((s) => s.trim()).filter(Boolean).forEach((b) => {
      const m = metricOf(b);
      if (m) out.push({ ...m, text: b, source: e.company || e.role, key: "experience" });
    }),
  );
  (data.projects || []).forEach((p) =>
    String(p.description || "").split("\n").map((s) => s.trim()).filter(Boolean).forEach((b) => {
      const m = metricOf(b);
      if (m) out.push({ ...m, text: b, source: p.name, key: "projects" });
    }),
  );
  return out;
}

// Split a sentence around its metric so the number can be styled: [before, match, after].
export function splitAt(text, m) {
  if (!m) return [text, "", ""];
  return [text.slice(0, m.index), m.match, text.slice(m.index + m.match.length)];
}

const THIS_YEAR = new Date().getFullYear();

// First 4-digit year in a date string; "Present"/"Now"/"Current" (or empty end) -> this year.
export function yearOf(s, isEnd) {
  const str = String(s || "");
  const m = str.match(/(19|20)\d{2}/);
  if (m) return +m[0];
  if (/present|now|current|today/i.test(str) || (isEnd && !str)) return THIS_YEAR;
  return null;
}

// Experience entries with numeric start/end years (entries without a start year are skipped).
export function spans(list) {
  return (list || [])
    .map((e) => ({ e, from: yearOf(e.start), to: yearOf(e.end, true) }))
    .filter((s) => s.from)
    .map((s) => ({ ...s, to: Math.max(s.from, s.to || s.from) }));
}

// Whole years from the earliest start to the latest end, or 0.
export function yearsOfExperience(list) {
  const s = spans(list);
  if (!s.length) return 0;
  return Math.max(...s.map((x) => x.to)) - Math.min(...s.map((x) => x.from));
}
