"use client";

import Link from "next/link";
import ScaledPage from "../editor/ScaledPage";
import { buildTheme, getLayout } from "../templates";
import { sampleResume } from "@/lib/sampleResume";

function Preview({ layoutId, paletteId, avatar, scale }) {
  const layout = getLayout(layoutId);
  const Template = layout.component;
  return (
    <ScaledPage fixedScale={scale}>
      <Template data={sampleResume} theme={buildTheme({ layoutId, paletteId, avatar })} />
    </ScaledPage>
  );
}

// Three overlapping live previews for the hero.
export function HeroStack() {
  const cards = [
    { layoutId: "classic", paletteId: "ocean", style: "left-0 top-10 -rotate-6" },
    { layoutId: "sandstone", paletteId: "sandstone", style: "right-0 top-10 rotate-6" },
    { layoutId: "horizon", paletteId: "navy-gold", style: "left-1/2 top-0 -translate-x-1/2 z-10" },
  ];
  return (
    <div className="relative mx-auto h-[400px] w-full max-w-[460px] sm:h-[440px]" aria-hidden="true">
      {cards.map((c) => (
        <div
          key={c.layoutId}
          className={`pointer-events-none absolute overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-slate-900/5 ${c.style}`}
        >
          <Preview layoutId={c.layoutId} paletteId={c.paletteId} scale={0.34} />
        </div>
      ))}
    </div>
  );
}

// A row of popular templates linking straight into the editor.
export function TemplateRow({ entries }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
      {entries.map((e) => (
        <Link
          key={e.id}
          href={`/editor?template=${e.id}`}
          className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="pointer-events-none overflow-hidden bg-slate-100 pt-2">
            <Preview layoutId={e.layoutId} paletteId={e.paletteId} avatar={e.avatar} scale={0.2} />
          </div>
          <div className="border-t border-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 group-hover:text-indigo-700">
            {e.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
