// Works out which form field a click on the resume preview refers to, by matching the clicked
// text against the resume data. This works for every template without marking each field in them.

// The form fields of each list section, as ids in EditorForm: edit-<section>-<item id>-<field>.
const LIST_FIELDS = {
  experience: ["role", "company", "location", "start", "end", "bullets"],
  education: ["degree", "school", "start", "end", "grade"],
  projects: ["name", "link", "description"],
  skills: ["name"],
  languages: ["name"],
  certifications: ["name", "issuer", "year"],
  interests: ["name"],
};
const PERSONAL_FIELDS = ["name", "title", "email", "phone", "address", "website"];

const norm = (t) => String(t ?? "").toLowerCase().replace(/\s+/g, " ").trim();

// The text of what was clicked: the element itself, or the nearest parent with text
// (an icon has none), stopping at the section so a click never picks up the whole page.
export function clickedText(target, stopAt) {
  let el = target;
  while (el && el !== stopAt) {
    const text = el.textContent?.trim();
    if (text) return text;
    el = el.parentElement;
  }
  return "";
}

// section: the data-section that was clicked (undefined for the header, name and other areas).
// Returns { fieldId, itemId, line } or null. line is the matched bullet line, to select in a textarea.
export function findEditTarget(text, section, data) {
  const t = norm(text);
  if (!t || t.length > 600) return null;
  let best = null;

  const consider = (fieldId, itemId, value) => {
    for (const raw of String(value ?? "").split("\n")) {
      const line = raw.replace(/^[-•*\s]+/, "").trim();
      const v = norm(line);
      if (!v) continue;
      let score = 0;
      if (v === t) score = 3;
      // The clicked text contains this value (e.g. "Austin, TX" inside "2021 – Present · Austin, TX"); prefer longer values.
      else if (v.length >= 2 && t.includes(v)) score = 2 + v.length / 1000;
      // The value contains the clicked text (e.g. a bullet split across styled pieces).
      else if (t.length >= 3 && v.includes(t)) score = 1 + t.length / 1000;
      if (score && (!best || score > best.score)) best = { score, fieldId, itemId, line };
    }
  };

  if (LIST_FIELDS[section]) {
    for (const item of data[section] || []) {
      for (const f of LIST_FIELDS[section]) consider(`edit-${section}-${item.id}-${f}`, `edit-${section}-${item.id}`, item[f]);
    }
  } else {
    // Header, contact block or summary: the personal details.
    const p = data.personal || {};
    for (const f of PERSONAL_FIELDS) consider(`edit-personal-${f}`, null, p[f]);
    consider("edit-summary", null, p.summary);
  }
  return best;
}
