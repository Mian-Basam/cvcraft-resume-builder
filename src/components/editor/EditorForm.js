"use client";

import { useRef } from "react";
import Suggestions from "./Suggestions";
import { AVATAR_CHOICES } from "../templates/simpleAvatar";

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

// id lets a click on a resume section open and scroll to its panel (see the editor page).
export function Panel({ title, defaultOpen = false, id, children }) {
  return (
    <details id={id} open={defaultOpen} className="group mb-3 scroll-mt-4 rounded-lg border border-slate-200 bg-white">
      <summary className="flex cursor-pointer select-none list-none items-center justify-between px-4 py-3 font-semibold text-slate-800">
        {title}
        <span className="text-slate-400 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="space-y-3 px-4 pb-4">{children}</div>
    </details>
  );
}

export function Field({ label, value, onChange, type = "text", rows = 3, hint, className = "", extra, id }) {
  return (
    <label id={id} className={`block scroll-mt-4 rounded-md ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {type === "textarea" ? (
        <textarea className={inputCls} rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : type === "range" ? (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 accent-indigo-600"
          />
          <span className="w-10 text-right text-xs text-slate-500">{value ?? 0}%</span>
        </div>
      ) : (
        <input className={inputCls} type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {extra && <div className="mt-1.5">{extra}</div>}
    </label>
  );
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

// Editable list of entries (jobs, degrees, skills...) with add, remove and reorder.
function ListPanel({ id, title, items, onChange, fields, emptyItem, itemTitle, addLabel, headerExtra }) {
  const update = (id, key, value) => onChange(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  const remove = (id) => onChange(items.filter((it) => it.id !== id));
  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <Panel id={id} title={`${title} (${items.length})`}>
      {headerExtra}
      {items.map((item, index) => (
        <div key={item.id} id={id && `${id}-${item.id}`} className="scroll-mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-slate-700">{itemTitle(item) || `Entry ${index + 1}`}</span>
            <div className="flex shrink-0 gap-1 text-xs">
              <button type="button" onClick={() => move(index, -1)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-200" title="Move up">
                ↑
              </button>
              <button type="button" onClick={() => move(index, 1)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-200" title="Move down">
                ↓
              </button>
              <button type="button" onClick={() => remove(item.id)} className="rounded px-2 py-1 text-red-500 hover:bg-red-50">
                Remove
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <Field
                key={f.key}
                id={id && `${id}-${item.id}-${f.key}`}
                label={f.label}
                type={f.type}
                hint={f.hint}
                rows={f.rows}
                value={item[f.key]}
                onChange={(v) => update(item.id, f.key, v)}
                className={f.half ? "col-span-1" : "col-span-2"}
                extra={f.extra?.(item, (key, value) => update(item.id, key, value))}
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { ...emptyItem, id: newId() }])}
        className="w-full rounded-md border border-dashed border-indigo-300 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
      >
        + {addLabel}
      </button>
    </Panel>
  );
}

// Resizes an uploaded photo so it stays small enough for browser storage.
export function resizeImage(file, maxSize = 400) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export default function EditorForm({ resume, updatePersonal, updateList, avatar, onAvatar }) {
  const p = resume.personal;
  const fileRef = useRef(null);

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      updatePersonal("photo", await resizeImage(file));
    } catch {
      alert("That file could not be read as an image.");
    }
    e.target.value = "";
  };

  return (
    <div>
      <Panel id="edit-personal" title="Personal details" defaultOpen>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-200">
            {p.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photo} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              {p.photo ? "Change photo" : "Upload photo"}
            </button>
            {p.photo && (
              <button
                type="button"
                onClick={() => updatePersonal("photo", "")}
                className="rounded-md px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
              >
                Remove
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </div>
        </div>
        {onAvatar && (
          <div className="flex flex-wrap items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-xs text-indigo-900">
            <span className="font-medium">Picture:</span>
            {[["photo", "My photo"], ["initials", "Initials"], ...AVATAR_CHOICES].map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => onAvatar(mode)}
                className={`rounded-full border px-2.5 py-1 font-semibold ${
                  avatar === mode ? "border-indigo-600 bg-indigo-600 text-white" : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field id="edit-personal-name" label="Full name" value={p.name} onChange={(v) => updatePersonal("name", v)} className="col-span-2" />
          <Field id="edit-personal-title" label="Job title" value={p.title} onChange={(v) => updatePersonal("title", v)} className="col-span-2" />
          <Field id="edit-personal-email" label="Email" value={p.email} onChange={(v) => updatePersonal("email", v)} />
          <Field id="edit-personal-phone" label="Phone" value={p.phone} onChange={(v) => updatePersonal("phone", v)} />
          <Field id="edit-personal-address" label="Location" value={p.address} onChange={(v) => updatePersonal("address", v)} />
          <Field id="edit-personal-website" label="Website" value={p.website} onChange={(v) => updatePersonal("website", v)} />
          <Field
            id="edit-summary"
            label="About me / summary"
            type="textarea"
            rows={4}
            value={p.summary}
            onChange={(v) => updatePersonal("summary", v)}
            className="col-span-2"
            extra={<Suggestions mode="summary" hint={p.title} existing={[p.summary || ""]} onPick={(t) => updatePersonal("summary", t)} label="Summary ideas" />}
          />
        </div>
      </Panel>

      <ListPanel
        title="Experience"
        addLabel="Add job"
        id="edit-experience"
        items={resume.experience}
        onChange={(items) => updateList("experience", items)}
        itemTitle={(it) => [it.role, it.company].filter(Boolean).join(" at ")}
        emptyItem={{ role: "", company: "", location: "", start: "", end: "", bullets: "" }}
        fields={[
          { key: "role", label: "Job title" },
          { key: "company", label: "Company", half: true },
          { key: "location", label: "Location", half: true },
          { key: "start", label: "Start", half: true },
          { key: "end", label: "End", half: true },
          {
            key: "bullets",
            label: "Achievements",
            type: "textarea",
            rows: 4,
            hint: "One bullet point per line",
            extra: (item, set) => (
              <Suggestions
                mode="bullets"
                hint={item.role || p.title}
                existing={(item.bullets || "").split("\n")}
                onPick={(t) => set("bullets", item.bullets?.trim() ? `${item.bullets.replace(/\s+$/, "")}\n${t}` : t)}
                label="Bullet ideas"
              />
            ),
          },
        ]}
      />

      <ListPanel
        title="Education"
        addLabel="Add education"
        id="edit-education"
        items={resume.education}
        onChange={(items) => updateList("education", items)}
        itemTitle={(it) => it.school}
        emptyItem={{ degree: "", school: "", start: "", end: "", grade: "" }}
        fields={[
          { key: "school", label: "School / university" },
          { key: "degree", label: "Degree" },
          { key: "start", label: "Start", half: true },
          { key: "end", label: "End", half: true },
          { key: "grade", label: "Grade / GPA (optional)" },
        ]}
      />

      <ListPanel
        title="Projects"
        addLabel="Add project"
        id="edit-projects"
        items={resume.projects}
        onChange={(items) => updateList("projects", items)}
        itemTitle={(it) => it.name}
        emptyItem={{ name: "", link: "", description: "" }}
        fields={[
          { key: "name", label: "Project name" },
          { key: "link", label: "Link (optional)" },
          { key: "description", label: "Description", type: "textarea", rows: 3, hint: "One bullet point per line" },
        ]}
      />

      <ListPanel
        title="Skills"
        addLabel="Add skill"
        headerExtra={
          <Suggestions
            mode="skills"
            hint={p.title}
            existing={resume.skills.map((s) => s.name || "")}
            onPick={(t) => updateList("skills", [...resume.skills, { id: newId(), name: t, level: 70 }])}
            label="Suggested skills"
          />
        }
        id="edit-skills"
        items={resume.skills}
        onChange={(items) => updateList("skills", items)}
        itemTitle={(it) => it.name}
        emptyItem={{ name: "", level: 70 }}
        fields={[
          { key: "name", label: "Skill" },
          { key: "level", label: "Level (used by templates with bars)", type: "range" },
        ]}
      />

      <ListPanel
        title="Languages"
        addLabel="Add language"
        id="edit-languages"
        items={resume.languages}
        onChange={(items) => updateList("languages", items)}
        itemTitle={(it) => it.name}
        emptyItem={{ name: "", level: 60 }}
        fields={[
          { key: "name", label: "Language" },
          { key: "level", label: "Level", type: "range" },
        ]}
      />

      <ListPanel
        title="Certifications"
        addLabel="Add certification"
        id="edit-certifications"
        items={resume.certifications}
        onChange={(items) => updateList("certifications", items)}
        itemTitle={(it) => it.name}
        emptyItem={{ name: "", issuer: "", year: "" }}
        fields={[
          { key: "name", label: "Certification" },
          { key: "issuer", label: "Issuer", half: true },
          { key: "year", label: "Year", half: true },
        ]}
      />

      <ListPanel
        title="Interests"
        addLabel="Add interest"
        id="edit-interests"
        items={resume.interests}
        onChange={(items) => updateList("interests", items)}
        itemTitle={(it) => it.name}
        emptyItem={{ name: "" }}
        fields={[{ key: "name", label: "Interest" }]}
      />
    </div>
  );
}
