// Saved documents (resumes and cover letters), kept in the browser's localStorage.
// Store shape: { docs: { [id]: doc }, order: [id, ...] (newest first), activeId }
// doc: { id, kind: "resume" | "cover", name, createdAt, updatedAt, data, settings }
import { emptyResume, sampleResume } from "./sampleResume";
import { emptyCover, sampleCover } from "./sampleCover";
import { palettes } from "./palettes";

export const STORE_KEY = "resume-builder:v3";
const V2_KEY = "resume-builder:v2";
const V1_KEY = "resume-builder:v1";

export const DEFAULT_SETTINGS = { layoutId: "horizon", paletteId: "navy-gold", font: null, showPhoto: true, avatar: null };
export const DEFAULT_COVER_SETTINGS = { letterLayout: "banner", paletteId: "navy-gold", font: null, avatar: null };

export function newDocId() {
  return `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function emptyStore() {
  return { docs: {}, order: [], activeId: null };
}

// Turns data saved by earlier versions (one resume per browser) into the first document.
function migrateOld() {
  try {
    const v2 = JSON.parse(localStorage.getItem(V2_KEY) || "null");
    if (v2?.resume) return makeResumeDoc({ resume: v2.resume, settings: v2.settings });
    const v1 = JSON.parse(localStorage.getItem(V1_KEY) || "null");
    if (v1?.resume) {
      const s = v1.settings || {};
      return makeResumeDoc({
        resume: v1.resume,
        settings: s.templateId ? { layoutId: s.templateId, paletteId: palettes[s.colorIndex || 0]?.id } : {},
      });
    }
  } catch {
    // Unreadable old data: start fresh.
  }
  return null;
}

export function readStore() {
  try {
    const store = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (store?.docs) return store;
  } catch {
    // fall through
  }
  const store = emptyStore();
  const old = typeof window !== "undefined" ? migrateOld() : null;
  if (old) {
    store.docs[old.id] = old;
    store.order = [old.id];
    store.activeId = old.id;
    // Save right away so every later read sees the same migrated document.
    writeStore(store);
  }
  return store;
}

export function writeStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    return true;
  } catch {
    // Storage full or blocked: the page still works for this visit.
    return false;
  }
}

// Reads, changes and saves the store in one step, so separate writers don't overwrite each other.
export function updateStore(fn) {
  const store = readStore();
  const next = fn(store) || store;
  writeStore(next);
  return next;
}

export function makeResumeDoc({ name, resume, settings } = {}) {
  const data = { ...emptyResume, ...(resume || sampleResume) };
  const now = Date.now();
  return {
    id: newDocId(),
    kind: "resume",
    name: name || (data.personal?.name ? `${data.personal.name} – Resume` : "My resume"),
    createdAt: now,
    updatedAt: now,
    data,
    settings: { ...DEFAULT_SETTINGS, ...(settings || {}) },
  };
}

// Which letter design goes best with a resume layout.
const LETTER_FOR_LAYOUT = {
  classic: "classic", executive: "classic", compact: "classic", minimal: "minimal", elegant: "elegant", prestige: "elegant", sketchbook: "elegant", "journal-spread": "elegant", notebook: "modern", "polaroid-tape": "modern", "margin-doodles": "modern",
  horizon: "sidebar", sandstone: "sidebar", midnight: "sidebar", split: "sidebar", geometric: "sidebar", arch: "sidebar", azure: "sidebar",
  bold: "modern", timelinepro: "modern", studio: "modern", mosaic: "modern",
};

// A cover letter can start from a resume: same name, contact details, colours, font and picture.
export function makeCoverDoc({ name, from } = {}) {
  const now = Date.now();
  const data = { ...emptyCover, ...sampleCover };
  let settings = { ...DEFAULT_COVER_SETTINGS };
  if (from) {
    const p = from.data.personal || {};
    data.personal = { ...data.personal, ...pickPersonal(p) };
    data.subject = p.title ? `Application for ${p.title}` : data.subject;
    settings = { ...settings, ...matchResumeDesign(from) };
  }
  return {
    id: newDocId(),
    kind: "cover",
    name: name || (from ? `${from.data.personal?.name || "My"} – Cover letter` : "My cover letter"),
    createdAt: now,
    updatedAt: now,
    data,
    settings,
  };
}

export function pickPersonal(p) {
  const { name, title, email, phone, address, website, photo, cartoon, cartoonKey } = p;
  return { name, title, email, phone, address, website, photo, cartoon, cartoonKey };
}

export function matchResumeDesign(resumeDoc) {
  const s = resumeDoc.settings || {};
  return {
    paletteId: s.paletteId,
    font: s.font,
    avatar: s.avatar,
    look: s.look,
    cartoonFilter: s.cartoonFilter,
    cartoonAdjust: s.cartoonAdjust,
    letterLayout: LETTER_FOR_LAYOUT[s.layoutId] || "banner",
    linkedResumeId: resumeDoc.id,
  };
}

export function duplicateDoc(doc) {
  const now = Date.now();
  return { ...JSON.parse(JSON.stringify(doc)), id: newDocId(), name: `${doc.name} (copy)`, createdAt: now, updatedAt: now };
}
