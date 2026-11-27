"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import LazyThumb from "@/components/LazyThumb";
import SiteHeader from "@/components/SiteHeader";
import { STYLES, buildTheme, catalog, getLayout, layouts } from "@/components/templates";
import { palettes } from "@/lib/palettes";
import { COLLECTIONS } from "@/components/templates/collection";
import { sampleResume } from "@/lib/sampleResume";

const THUMB_SCALE = 0.28;
const premiumCount = catalog.filter((c) => c.premium).length;

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
      }`}
    >
      {children}
    </button>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </div>
  );
}

export default function TemplatesPage() {
  const [style, setStyle] = useState("All");
  const [columns, setColumns] = useState("any");
  const [photo, setPhoto] = useState("any");
  const [atsOnly, setAtsOnly] = useState(false);
  const [tier, setTier] = useState("any");
  const [character, setCharacter] = useState("any");
  const [paletteId, setPaletteId] = useState("any");
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("any");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((entry) => {
      const layout = getLayout(entry.layoutId);
      if (style !== "All" && !layout.styles.includes(style)) return false;
      if (columns !== "any" && layout.columns !== columns) return false;
      if (photo === "with" && !layout.photo) return false;
      if (photo === "without" && layout.photo) return false;
      if (atsOnly && !layout.ats) return false;
      if (tier === "premium" && !layout.premium) return false;
      if (tier === "standard" && layout.premium) return false;
      if (character !== "any" && entry.avatar !== character) return false;
      if (paletteId !== "any" && entry.paletteId !== paletteId) return false;
      if (collection === "original" && layout.collection) return false;
      if (collection !== "any" && collection !== "original" && layout.collection !== collection) return false;
      if (q && !`${entry.name} ${layout.description} ${layout.styles.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [style, columns, photo, atsOnly, tier, character, paletteId, query, collection]);

  const clear = () => {
    setStyle("All");
    setColumns("any");
    setPhoto("any");
    setAtsOnly(false);
    setTier("any");
    setCharacter("any");
    setPaletteId("any");
    setQuery("");
    setCollection("any");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader active="templates">
        <Link href="/editor" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700">
          Create my resume
        </Link>
      </SiteHeader>

      <section className="mx-auto max-w-7xl px-5 pb-6 pt-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Resume templates</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {catalog.length} templates across {layouts.length} layouts and {palettes.length} colour themes, including{" "}
          {premiumCount} premium designs. Every one is fully editable and free to use: pick one, fill in your details and download a PDF. You can switch template at any time without losing your
          content.
        </p>

        <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Chip active={atsOnly} onClick={() => setAtsOnly((v) => !v)}>
              ATS-friendly only
            </Chip>
            <button type="button" onClick={clear} className="ml-auto text-sm text-slate-500 hover:text-slate-800">
              Clear filters
            </button>
          </div>
          <FilterGroup label="Collection">
            <Chip active={collection === "any"} onClick={() => setCollection("any")}>All</Chip>
            <Chip active={collection === "original"} onClick={() => setCollection("original")}>Originals</Chip>
            {COLLECTIONS.filter(([key]) => layouts.some((l) => l.collection === key)).map(([key, label]) => (
              <Chip key={key} active={collection === key} onClick={() => setCollection(key)}>
                {label} ({layouts.filter((l) => l.collection === key).length})
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="Tier">
            <Chip active={tier === "any"} onClick={() => setTier("any")}>All</Chip>
            <Chip active={tier === "premium"} onClick={() => setTier("premium")}>★ Premium ({premiumCount})</Chip>
            <Chip active={tier === "standard"} onClick={() => setTier("standard")}>Standard</Chip>
          </FilterGroup>
          <FilterGroup label="Character">
            <Chip active={character === "any"} onClick={() => setCharacter("any")}>Any</Chip>
            <Chip active={character === "female"} onClick={() => setCharacter("female")}>Female character</Chip>
            <Chip active={character === "male"} onClick={() => setCharacter("male")}>Male character</Chip>
          </FilterGroup>
          <FilterGroup label="Style">
            {["All", ...STYLES].map((s) => (
              <Chip key={s} active={style === s} onClick={() => setStyle(s)}>
                {s}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="Layout">
            <Chip active={columns === "any"} onClick={() => setColumns("any")}>Any</Chip>
            <Chip active={columns === 1} onClick={() => setColumns(1)}>One column</Chip>
            <Chip active={columns === 2} onClick={() => setColumns(2)}>Two columns</Chip>
          </FilterGroup>
          <FilterGroup label="Photo">
            <Chip active={photo === "any"} onClick={() => setPhoto("any")}>Any</Chip>
            <Chip active={photo === "with"} onClick={() => setPhoto("with")}>With photo</Chip>
            <Chip active={photo === "without"} onClick={() => setPhoto("without")}>Without photo</Chip>
          </FilterGroup>
          <FilterGroup label="Colour">
            <Chip active={paletteId === "any"} onClick={() => setPaletteId("any")}>Any</Chip>
            {palettes.map((pal) => (
              <button
                key={pal.id}
                type="button"
                title={pal.name}
                onClick={() => setPaletteId(pal.id)}
                className={`h-8 w-8 rounded-full border-2 ${paletteId === pal.id ? "border-indigo-600 ring-2 ring-indigo-200" : "border-white shadow"}`}
                style={{ background: `linear-gradient(135deg, ${pal.primary} 50%, ${pal.accent} 50%)` }}
              />
            ))}
          </FilterGroup>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          Showing {results.length} of {catalog.length} templates
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No templates match these filters.{" "}
            <button type="button" onClick={clear} className="font-medium text-indigo-600">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {results.map((entry) => {
              const layout = getLayout(entry.layoutId);
              const Template = layout.component;
              return (
                <div key={entry.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
                  <div className="relative bg-slate-100 pt-3">
                    {layout.premium && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-2.5 py-0.5 text-xs font-bold text-amber-950 shadow">
                        ★ Premium
                      </span>
                    )}
                    <LazyThumb scale={THUMB_SCALE}>
                      <Template data={sampleResume} theme={buildTheme({ layoutId: entry.layoutId, paletteId: entry.paletteId, avatar: entry.avatar })} />
                    </LazyThumb>
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">
                      <Link
                        href={`/editor?template=${entry.id}`}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700"
                      >
                        Use this template
                      </Link>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 p-3">
                    <Link href={`/editor?template=${entry.id}`} className="font-semibold text-slate-900 hover:text-indigo-700">
                      {entry.name}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {layout.premium && <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Premium</span>}
                      {layout.ats && <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">ATS-friendly</span>}
                      {layout.photo && <span className="rounded bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">Photo</span>}
                      {layout.styles.map((s) => (
                        <span key={s} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
