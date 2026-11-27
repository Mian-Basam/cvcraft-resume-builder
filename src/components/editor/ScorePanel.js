"use client";

import { useMemo, useState } from "react";
import { scoreResume } from "@/lib/resumeScore";

const colorFor = (s) => (s >= 85 ? "#16a34a" : s >= 70 ? "#65a30d" : s >= 50 ? "#d97706" : "#dc2626");

// Live resume score with a ring and a list of tips (failed checks first).
export default function ScorePanel({ resume }) {
  const { score, label, checks } = useMemo(() => scoreResume(resume), [resume]);
  const [open, setOpen] = useState(false);
  const todo = checks.filter((c) => !c.ok).sort((a, b) => b.weight - a.weight);
  const done = checks.filter((c) => c.ok);
  const color = colorFor(score);
  const r = 22;
  const circ = 2 * Math.PI * r;

  return (
    <div className="mb-5 rounded-lg border border-slate-200 bg-white">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 p-3 text-left">
        <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0" aria-hidden="true">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * circ} ${circ}`}
            transform="rotate(-90 28 28)"
          />
          <text x="28" y="33" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f172a">
            {score}
          </text>
        </svg>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-800">
            Resume score: <span style={{ color }}>{label}</span>
          </div>
          <div className="text-xs text-slate-500">
            {todo.length ? `${todo.length} tip${todo.length > 1 ? "s" : ""} to improve it` : "Everything checks out. Nice work!"}
          </div>
        </div>
        <span className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <ul className="space-y-1.5 border-t border-slate-100 px-3 py-3 text-xs">
          {todo.map((c) => (
            <li key={c.label} className="flex gap-2">
              <span className="mt-px font-bold text-amber-500">!</span>
              <span>
                <span className="font-medium text-slate-800">{c.label}.</span> <span className="text-slate-600">{c.tip}</span>
              </span>
            </li>
          ))}
          {done.map((c) => (
            <li key={c.label} className="flex gap-2 text-slate-500">
              <span className="font-bold text-green-600">✓</span>
              {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
