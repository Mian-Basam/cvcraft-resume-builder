"use client";

import { useEffect, useRef, useState } from "react";
import { Field, Panel, resizeImage } from "./EditorForm";
import Suggestions from "./Suggestions";
import { matchResumeDesign, pickPersonal, readStore } from "@/lib/documents";
import { todayLong } from "@/lib/sampleCover";

// Form for a cover letter: link to a resume, your details, the recipient and the letter itself.
export default function CoverForm({ data, settings, updatePersonal, updateField, updateSettings }) {
  const p = data.personal || {};
  const r = data.recipient || {};
  const fileRef = useRef(null);
  const [resumes, setResumes] = useState([]);
  const [linked, setLinked] = useState(settings.linkedResumeId || "");

  useEffect(() => {
    const store = readStore();
    const list = store.order.map((id) => store.docs[id]).filter((d) => d?.kind === "resume");
    setResumes(list);
    if (!settings.linkedResumeId && list[0]) setLinked(list[0].id);
  }, [settings.linkedResumeId]);

  // Copies name, contact details, photo, colours, font and picture style from a resume.
  const applyResume = () => {
    const doc = readStore().docs[linked];
    if (!doc) return;
    const personal = pickPersonal(doc.data.personal || {});
    updateField("personal", { ...p, ...Object.fromEntries(Object.entries(personal).map(([k, v]) => [k, v ?? ""])) });
    updateSettings(matchResumeDesign(doc));
  };

  const setRecipient = (key, value) => updateField("recipient", { ...r, [key]: value });
  const fill = (t) => t.replaceAll("{role}", p.title || "[role]").replaceAll("{company}", r.company || "[company]").replaceAll("{name}", p.name || "");

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      updatePersonal("photo", await resizeImage(file));
      updatePersonal("cartoon", "");
    } catch {
      alert("That file could not be read as an image.");
    }
    e.target.value = "";
  };

  return (
    <div>
      {resumes.length > 0 && (
        <Panel title="Match a resume" defaultOpen>
          <p className="text-xs text-slate-500">Copy your name, contact details, photo, colours and font from one of your resumes.</p>
          <div className="flex gap-2">
            <select value={linked} onChange={(e) => setLinked(e.target.value)} className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm">
              {resumes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={applyResume} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Match
            </button>
          </div>
        </Panel>
      )}

      <Panel title="Your details" defaultOpen>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
            {p.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photo} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
            {p.photo ? "Change photo" : "Upload photo"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" value={p.name} onChange={(v) => updatePersonal("name", v)} className="col-span-2" />
          <Field label="Job title" value={p.title} onChange={(v) => updatePersonal("title", v)} className="col-span-2" />
          <Field label="Email" value={p.email} onChange={(v) => updatePersonal("email", v)} />
          <Field label="Phone" value={p.phone} onChange={(v) => updatePersonal("phone", v)} />
          <Field label="Location" value={p.address} onChange={(v) => updatePersonal("address", v)} />
          <Field label="Website" value={p.website} onChange={(v) => updatePersonal("website", v)} />
        </div>
      </Panel>

      <Panel title="Recipient" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hiring manager's name" value={r.name} onChange={(v) => setRecipient("name", v)} />
          <Field label="Their job title" value={r.title} onChange={(v) => setRecipient("title", v)} />
          <Field label="Company" value={r.company} onChange={(v) => setRecipient("company", v)} />
          <Field label="Company address" value={r.address} onChange={(v) => setRecipient("address", v)} />
        </div>
      </Panel>

      <Panel title="Letter" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date" value={data.date} onChange={(v) => updateField("date", v)} hint={`Leave empty to use today (${todayLong()})`} />
          <Field label="Closing" value={data.closing} onChange={(v) => updateField("closing", v)} hint="e.g. Kind regards," />
          <Field label="Subject line" value={data.subject} onChange={(v) => updateField("subject", v)} className="col-span-2" />
          <Field label="Greeting" value={data.greeting} onChange={(v) => updateField("greeting", v)} className="col-span-2" hint="e.g. Dear Alex Morgan," />
          <Field
            label="Letter"
            type="textarea"
            rows={14}
            value={data.body}
            onChange={(v) => updateField("body", v)}
            className="col-span-2"
            hint="Leave an empty line between paragraphs."
            extra={
              <Suggestions
                mode="letter"
                fill={fill}
                existing={(data.body || "").split(/\n\s*\n/)}
                onPick={(t) => updateField("body", data.body?.trim() ? `${data.body.replace(/\s+$/, "")}\n\n${t}` : t)}
                label="Paragraph ideas"
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
