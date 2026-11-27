"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { emptyResume, sampleResume } from "./sampleResume";
import { emptyCover, sampleCover } from "./sampleCover";
import { getCatalogEntry } from "@/components/templates";
import { DEFAULT_SETTINGS, makeCoverDoc, makeResumeDoc, readStore, updateStore } from "./documents";

const HISTORY_LIMIT = 100;
// Edits to the same field closer together than this count as one undo step (typing a word).
const COALESCE_MS = 800;
// Values the editor works out by itself; changing them is not an undo step.
const DERIVED_FIELDS = new Set(["cartoon", "cartoonKey"]);

// Opens one saved document (from ?doc=<id>, else the last one used) and keeps it saved.
// A ?template=<catalog id> from the gallery applies that design to the open resume.
// Provides undo/redo over both the content and the design settings.
export function useDocument() {
  const [doc, setDoc] = useState(null); // { id, kind, name }
  const [state, setState] = useState({ data: sampleResume, settings: DEFAULT_SETTINGS });
  const current = useRef(state);
  const [loaded, setLoaded] = useState(false);
  const [history, setHistory] = useState({ past: 0, future: 0 });
  const past = useRef([]);
  const future = useRef([]);
  const last = useRef({ key: null, at: 0 });
  const params = useRef(null);

  useEffect(() => {
    // React may run this twice in development; read the URL only once.
    if (params.current === null) {
      const q = new URLSearchParams(window.location.search);
      params.current = { doc: q.get("doc"), template: q.get("template"), kind: q.get("new") };
    }
    const { doc: wanted, template, kind } = params.current;
    let store = readStore();
    let target = null;

    if (kind === "cover" || kind === "resume") {
      target = kind === "cover" ? makeCoverDoc() : makeResumeDoc();
    } else {
      target = store.docs[wanted] || store.docs[store.activeId] || store.order.map((id) => store.docs[id]).find((d) => d.kind === "resume");
      if (!target) target = makeResumeDoc();
    }

    // Gallery link: apply the chosen design to a resume (start a new one if a cover letter is open).
    const entry = getCatalogEntry(template);
    if (entry) {
      if (target.kind !== "resume") target = makeResumeDoc();
      target = {
        ...target,
        settings: { ...target.settings, layoutId: entry.layoutId, paletteId: entry.paletteId, ...(entry.avatar ? { avatar: entry.avatar } : {}) },
      };
    }

    store = updateStore((s) => {
      s.docs[target.id] = s.docs[target.id] ? { ...s.docs[target.id], settings: target.settings } : target;
      if (!s.order.includes(target.id)) s.order.unshift(target.id);
      s.activeId = target.id;
      return s;
    });
    // A second run (development) must reopen this document, not create another one.
    params.target = { doc: target.id, template: null, kind: null };
    const saved = store.docs[target.id];
    const base = saved.kind === "cover" ? emptyCover : emptyResume;
    setDoc({ id: saved.id, kind: saved.kind, name: saved.name });
    const initial = { data: { ...base, ...saved.data }, settings: saved.settings || {} };
    current.current = initial;
    setState(initial);
    window.history.replaceState(null, "", `${window.location.pathname}?doc=${saved.id}`);
    setLoaded(true);
  }, []);

  // Save every change back into the store.
  useEffect(() => {
    if (!loaded || !doc) return;
    updateStore((s) => {
      const d = s.docs[doc.id];
      if (!d) return s;
      s.docs[doc.id] = { ...d, name: doc.name, data: state.data, settings: state.settings, updatedAt: Date.now() };
      return s;
    });
  }, [state, doc, loaded]);

  // Every edit goes through here. key groups rapid edits to one field into one undo step;
  // silent edits (derived values) never become undo steps. The latest state lives in a ref so
  // several edits in one event build on each other, and state updaters stay free of side effects.
  const apply = useCallback((next) => {
    current.current = next;
    setState(next);
    setHistory({ past: past.current.length, future: future.current.length });
  }, []);

  const commit = useCallback(
    (updater, key, silent = false) => {
      const prev = current.current;
      const next = updater(prev);
      if (next === prev) return;
      if (!silent) {
        const now = Date.now();
        const sameBurst = key && last.current.key === key && now - last.current.at < COALESCE_MS;
        if (!sameBurst) {
          past.current = [...past.current.slice(-HISTORY_LIMIT + 1), prev];
          future.current = [];
        }
        last.current = { key, at: now };
      }
      apply(next);
    },
    [apply],
  );

  const undo = useCallback(() => {
    if (!past.current.length) return;
    const target = past.current[past.current.length - 1];
    past.current = past.current.slice(0, -1);
    future.current = [current.current, ...future.current];
    last.current = { key: null, at: 0 };
    apply(target);
  }, [apply]);

  const redo = useCallback(() => {
    if (!future.current.length) return;
    const [target, ...rest] = future.current;
    future.current = rest;
    past.current = [...past.current, current.current];
    last.current = { key: null, at: 0 };
    apply(target);
  }, [apply]);

  const updatePersonal = useCallback(
    (field, value) =>
      commit((s) => ({ ...s, data: { ...s.data, personal: { ...s.data.personal, [field]: value } } }), `personal.${field}`, DERIVED_FIELDS.has(field)),
    [commit],
  );
  // Top-level field of the document (lists for a resume; recipient, body, etc. for a letter).
  const updateField = useCallback((key, value) => commit((s) => ({ ...s, data: { ...s.data, [key]: value } }), `field.${key}`), [commit]);
  const updateList = updateField;
  const setSectionOrder = useCallback((sectionOrder) => commit((s) => ({ ...s, data: { ...s.data, sectionOrder } }), null), [commit]);
  const toggleSection = useCallback(
    (key) =>
      commit((s) => {
        const hidden = s.data.hiddenSections || [];
        return { ...s, data: { ...s.data, hiddenSections: hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key] } };
      }, null),
    [commit],
  );
  const updateSettings = useCallback(
    (patch) => commit((s) => ({ ...s, settings: { ...s.settings, ...patch } }), `settings.${Object.keys(patch).sort().join(",")}`),
    [commit],
  );
  const replaceData = useCallback((data) => commit((s) => ({ ...s, data }), null), [commit]);
  const reset = useCallback(() => replaceData(doc?.kind === "cover" ? sampleCover : sampleResume), [replaceData, doc]);
  const rename = useCallback((name) => setDoc((d) => ({ ...d, name })), []);

  return {
    doc,
    data: state.data,
    resume: state.data,
    settings: state.settings,
    loaded,
    updatePersonal,
    updateField,
    updateList,
    setSectionOrder,
    toggleSection,
    updateSettings,
    replaceData,
    reset,
    rename,
    undo,
    redo,
    canUndo: history.past > 0,
    canRedo: history.future > 0,
  };
}
