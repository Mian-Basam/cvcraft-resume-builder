"use client";

import { useState } from "react";
import { SECTION_META } from "../templates/kit";
import { DEFAULT_SECTION_ORDER } from "@/lib/sampleResume";

// Drag (or use the arrows) to reorder resume sections; the eye toggles a section on or off.
export default function SectionOrder({ order, hidden, onReorder, onToggle }) {
  const keys = [...order.filter((k) => SECTION_META[k]), ...DEFAULT_SECTION_ORDER.filter((k) => !order.includes(k))];
  const [dragKey, setDragKey] = useState(null);
  const [overKey, setOverKey] = useState(null);

  const moveTo = (from, toKey) => {
    const next = keys.filter((k) => k !== from);
    next.splice(next.indexOf(toKey) + (keys.indexOf(from) < keys.indexOf(toKey) ? 1 : 0), 0, from);
    onReorder(next);
  };

  const shift = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= keys.length) return;
    const next = [...keys];
    [next[index], next[target]] = [next[target], next[index]];
    onReorder(next);
  };

  return (
    <details open className="group mb-3 rounded-lg border border-slate-200 bg-white">
      <summary className="flex cursor-pointer select-none list-none items-center justify-between px-4 py-3 font-semibold text-slate-800">
        Sections &amp; order
        <span className="text-slate-400 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="px-4 pb-4">
        <p className="mb-2 text-xs text-slate-500">
          Drag to reorder. In two-column templates the order applies within each column.
        </p>
        <ul className="space-y-1.5">
          {keys.map((k, index) => {
            const isHidden = hidden.includes(k);
            return (
              <li
                key={k}
                draggable
                onDragStart={(e) => {
                  setDragKey(k);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", k);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (overKey !== k) setOverKey(k);
                }}
                onDragLeave={() => setOverKey((o) => (o === k ? null : o))}
                onDrop={(e) => {
                  e.preventDefault();
                  // Read the key from the drag data; state may not have updated yet.
                  const from = e.dataTransfer.getData("text/plain") || dragKey;
                  if (from && from !== k && keys.includes(from)) moveTo(from, k);
                  setDragKey(null);
                  setOverKey(null);
                }}
                onDragEnd={() => {
                  setDragKey(null);
                  setOverKey(null);
                }}
                className={`flex cursor-grab items-center gap-2 rounded-md border px-2 py-1.5 text-sm active:cursor-grabbing ${
                  overKey === k && dragKey !== k ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50"
                } ${dragKey === k ? "opacity-40" : ""}`}
              >
                <span className="select-none text-slate-400" aria-hidden="true">
                  ⋮⋮
                </span>
                <span className={`flex-1 ${isHidden ? "text-slate-400 line-through" : "text-slate-700"}`}>
                  {SECTION_META[k].title}
                </span>
                <button type="button" onClick={() => shift(index, -1)} className="rounded px-1.5 text-slate-500 hover:bg-slate-200" title="Move up">
                  ↑
                </button>
                <button type="button" onClick={() => shift(index, 1)} className="rounded px-1.5 text-slate-500 hover:bg-slate-200" title="Move down">
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(k)}
                  className={`rounded px-2 text-xs font-medium ${isHidden ? "text-indigo-600 hover:bg-indigo-50" : "text-slate-500 hover:bg-slate-200"}`}
                >
                  {isHidden ? "Show" : "Hide"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
