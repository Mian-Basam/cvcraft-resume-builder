"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LazyThumb from "@/components/LazyThumb";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { buildTheme, getLayout } from "@/components/templates";
import { buildLetterTheme, getLetterLayout } from "@/components/templates/letters";
import { duplicateDoc, makeCoverDoc, makeResumeDoc, readStore, updateStore } from "@/lib/documents";
import { emptyResume } from "@/lib/sampleResume";
import { emptyCover } from "@/lib/sampleCover";

const SCALE = 0.3;

function timeAgo(ms) {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(ms).toLocaleDateString();
}

function Thumb({ doc }) {
  if (doc.kind === "cover") {
    const L = getLetterLayout(doc.settings?.letterLayout).component;
    return <L data={{ ...emptyCover, ...doc.data }} theme={buildLetterTheme(doc.settings || {})} />;
  }
  const T = getLayout(doc.settings?.layoutId).component;
  return <T data={{ ...emptyResume, ...doc.data }} theme={buildTheme(doc.settings || {})} />;
}

// Lists every saved resume and cover letter, with open, rename, duplicate and delete.
export default function DocumentsPage() {
  const router = useRouter();
  const [store, setStore] = useState(null);
  const [filter, setFilter] = useState("all");
  const [renaming, setRenaming] = useState(null);

  useEffect(() => setStore(readStore()), []);
  const change = (fn) => setStore(updateStore(fn));

  const create = (doc) => {
    change((s) => {
      s.docs[doc.id] = doc;
      s.order.unshift(doc.id);
      s.activeId = doc.id;
      return s;
    });
    router.push(`/editor?doc=${doc.id}`);
  };

  const newCover = () => {
    // Start from the most recently edited resume so details and design match.
    const latestResume = store.order.map((id) => store.docs[id]).find((d) => d?.kind === "resume");
    create(makeCoverDoc({ from: latestResume }));
  };

  const duplicate = (doc) =>
    change((s) => {
      const copy = duplicateDoc(doc);
      s.docs[copy.id] = copy;
      s.order.splice(s.order.indexOf(doc.id), 0, copy.id);
      return s;
    });

  const remove = (doc) => {
    if (!confirm(`Delete “${doc.name}”? This cannot be undone.`)) return;
    change((s) => {
      delete s.docs[doc.id];
      s.order = s.order.filter((id) => id !== doc.id);
      if (s.activeId === doc.id) s.activeId = s.order[0] || null;
      return s;
    });
  };

  const rename = (doc, name) =>
    change((s) => {
      if (s.docs[doc.id]) s.docs[doc.id] = { ...s.docs[doc.id], name: name.trim() || doc.name };
      return s;
    });

  const docs = (store?.order || []).map((id) => store.docs[id]).filter(Boolean);
  const shown = docs.filter((d) => filter === "all" || d.kind === filter);
  const counts = { all: docs.length, resume: docs.filter((d) => d.kind === "resume").length, cover: docs.filter((d) => d.kind === "cover").length };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader active="documents" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My documents</h1>
            <p className="mt-1 text-slate-600">Your resumes and cover letters are saved in this browser.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => create(makeResumeDoc())} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700">
              + New resume
            </button>
            <button type="button" onClick={newCover} disabled={!store} className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
              + New cover letter
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-1">
          {[
            ["all", "All"],
            ["resume", "Resumes"],
            ["cover", "Cover letters"],
          ].map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${filter === k ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}
            >
              {l} ({counts[k]})
            </button>
          ))}
        </div>

        {store && shown.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            <p className="text-lg font-semibold text-slate-800">Nothing here yet</p>
            <p className="mt-1">Create a resume or cover letter to get started.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((doc) => (
            <div key={doc.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
              <Link href={`/editor?doc=${doc.id}`} className="relative block bg-slate-100 p-3">
                <div className="mx-auto overflow-hidden rounded shadow" style={{ width: Math.round(794 * SCALE) }}>
                  <LazyThumb scale={SCALE}>
                    <Thumb doc={doc} />
                  </LazyThumb>
                </div>
                <span
                  className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold ${doc.kind === "cover" ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"}`}
                >
                  {doc.kind === "cover" ? "Cover letter" : "Resume"}
                </span>
              </Link>
              <div className="border-t border-slate-100 p-3">
                {renaming === doc.id ? (
                  <input
                    autoFocus
                    defaultValue={doc.name}
                    onBlur={(e) => {
                      rename(doc, e.target.value);
                      setRenaming(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                      if (e.key === "Escape") setRenaming(null);
                    }}
                    className="w-full rounded border border-indigo-400 px-2 py-1 text-sm"
                  />
                ) : (
                  <div className="truncate font-semibold text-slate-800" title={doc.name}>
                    {doc.name}
                  </div>
                )}
                <div className="text-xs text-slate-500">Edited {timeAgo(doc.updatedAt)}</div>
                <div className="mt-2 flex flex-wrap gap-1 text-xs font-medium">
                  <Link href={`/editor?doc=${doc.id}`} className="rounded bg-indigo-600 px-2 py-1 text-white hover:bg-indigo-700">
                    Open
                  </Link>
                  <button type="button" onClick={() => setRenaming(doc.id)} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100">
                    Rename
                  </button>
                  <button type="button" onClick={() => duplicate(doc)} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100">
                    Duplicate
                  </button>
                  {doc.kind === "resume" && (
                    <button type="button" onClick={() => create(makeCoverDoc({ from: doc }))} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100" title="New cover letter that matches this resume">
                      + Letter
                    </button>
                  )}
                  <button type="button" onClick={() => remove(doc)} className="rounded px-2 py-1 text-red-500 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
