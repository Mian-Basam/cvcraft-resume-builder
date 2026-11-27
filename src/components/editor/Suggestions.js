"use client";

import { useMemo, useState } from "react";
import { LETTER_PARAGRAPHS, ROLES, guessRole } from "@/lib/writingHelp";

// "✨ Suggestions" toggle with ready-made text.
// mode: "summary" | "bullets" | "skills" | "letter". hint: text used to guess the role (usually the job title).
// onPick(text) receives the chosen text; existing lists what is already used so it can be marked.
export default function Suggestions({ mode, hint, onPick, existing = [], fill = (t) => t, label }) {
  const [open, setOpen] = useState(false);
  const guessed = useMemo(() => guessRole(hint), [hint]);
  const [roleTitle, setRoleTitle] = useState(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(Object.keys(LETTER_PARAGRAPHS)[0]);
  const role = ROLES.find((r) => r.title === roleTitle) || guessed || ROLES[0];
  const used = new Set(existing.map((e) => e.trim().toLowerCase()));

  const items =
    mode === "letter" ? LETTER_PARAGRAPHS[group].map(fill) : mode === "summary" ? role.summaries : mode === "skills" ? role.skills : role.bullets;
  const roles = ROLES.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()) || r.keywords.some((k) => k.includes(query.toLowerCase())));

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
      >
        ✨ {label || "Suggestions"} {open ? "▴" : "▾"}
      </button>
      {open && (
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50/50 p-2.5">
          {mode === "letter" ? (
            <div className="mb-2 flex flex-wrap gap-1">
              {Object.keys(LETTER_PARAGRAPHS).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${g === group ? "bg-amber-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-500">Role:</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search roles…"
                  className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs"
                />
              </div>
              <div className="flex max-h-16 flex-wrap gap-1 overflow-y-auto">
                {roles.map((r) => (
                  <button
                    key={r.title}
                    type="button"
                    onClick={() => setRoleTitle(r.title)}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${r.title === role.title ? "bg-amber-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          <ul className="max-h-56 space-y-1 overflow-y-auto">
            {items.map((t) => {
              const isUsed = used.has(t.trim().toLowerCase());
              return (
                <li key={t} className="flex items-start gap-2 rounded bg-white p-1.5 text-xs text-slate-700 ring-1 ring-slate-100">
                  <span className="flex-1">{t}</span>
                  <button
                    type="button"
                    disabled={isUsed}
                    onClick={() => onPick(t)}
                    className="shrink-0 rounded bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-300"
                  >
                    {isUsed ? "Added" : mode === "summary" ? "Use" : "+ Add"}
                  </button>
                </li>
              );
            })}
          </ul>
          {mode !== "skills" && <p className="mt-1.5 text-[11px] text-slate-500">Replace the [bracketed] parts with your own details.</p>}
        </div>
      )}
    </div>
  );
}
