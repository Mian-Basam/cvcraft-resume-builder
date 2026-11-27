"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import CoverForm from "@/components/editor/CoverForm";
import EditorForm from "@/components/editor/EditorForm";
import ScorePanel from "@/components/editor/ScorePanel";
import ScaledPage from "@/components/editor/ScaledPage";
import SectionOrder from "@/components/editor/SectionOrder";
import SiteHeader from "@/components/SiteHeader";
import LayoutStrip from "@/components/editor/LayoutStrip";
import { buildTheme, getLayout } from "@/components/templates";
import { buildLetterTheme, getLetterLayout, letterLayouts } from "@/components/templates/letters";
import { fonts, getPalette, palettes } from "@/lib/palettes";
import { DEFAULT_SECTION_ORDER } from "@/lib/sampleResume";
import { useDocument } from "@/lib/useDocument";
import { AVATAR_CHOICES } from "@/components/templates/simpleAvatar";
import { clickedText, findEditTarget } from "@/lib/clickToEdit";
import { SKETCH_GIRLS } from "@/components/templates/sketchGirls";

const iconBtn = "rounded-md p-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30";

export default function EditorPage() {
  const {
    doc,
    data: resume,
    settings,
    updatePersonal,
    updateField,
    updateList,
    setSectionOrder,
    toggleSection,
    updateSettings,
    reset,
    rename,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useDocument();
  const isCover = doc?.kind === "cover";
  const layout = isCover ? getLetterLayout(settings.letterLayout) : getLayout(settings.layoutId);
  const theme = isCover ? buildLetterTheme(settings) : buildTheme(settings);
  const Template = layout.component;

  // Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z or Ctrl+Y redoes, everywhere in the editor.
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);
  // On phones the form and the preview share the screen as two tabs.
  const [mobileView, setMobileView] = useState("edit");

  // Stable between renders so the memoised template strip doesn't redraw on every keystroke.
  const pickLayout = useCallback(
    (l) =>
      updateSettings({
        layoutId: l.id,
        // A few layouts skip palettes that look poor on them.
        ...(l.excludePalettes?.includes(currentPalette.current) ? { paletteId: "navy-gold" } : {}),
      }),
    [updateSettings],
  );
  const currentPalette = useRef(settings.paletteId);
  currentPalette.current = settings.paletteId;

  const chooseAvatar = (mode) => updateSettings({ avatar: mode, showPhoto: mode === "photo" });

  // Clicking the resume preview opens the matching part of the form, scrolls to it and puts the
  // cursor in the field: the exact field when the clicked text matches one (an email, a job title,
  // a bullet), otherwise the clicked section's panel. The header and contact go to "Personal details".
  const jumpToSection = (e) => {
    if (isCover) return;
    const sectionEl = e.target.closest("[data-section]");
    const key = sectionEl?.dataset.section;
    const panelId = key && key !== "summary" && key !== "contact" ? `edit-${key}` : "edit-personal";
    const exact = findEditTarget(clickedText(e.target, sectionEl?.parentElement), key, resume);
    setMobileView("edit");
    // Wait a frame so the form is visible (phones) before scrolling.
    requestAnimationFrame(() => {
      const panel = document.getElementById(panelId) || document.getElementById(exact?.fieldId)?.closest("details");
      const field = exact && document.getElementById(exact.fieldId);
      const target = field || (key === "summary" && document.getElementById("edit-summary")) || panel;
      if (!target) return;
      if (panel) panel.open = true;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      document.querySelectorAll(".jump-flash").forEach((el) => el.classList.remove("jump-flash"));
      const flash = (exact?.itemId && document.getElementById(exact.itemId)) || target;
      void flash.offsetWidth; // restart the highlight if clicked twice
      flash.classList.add("jump-flash");
      const input = target.querySelector("input:not([type=file]), textarea");
      if (!input) return;
      input.focus({ preventScroll: true });
      // A clicked bullet: select that line in the textarea.
      if (exact?.line && input.tagName === "TEXTAREA") {
        const at = input.value.indexOf(exact.line);
        if (at >= 0) input.setSelectionRange(at, at + exact.line.length);
      }
    });
  };

  const downloadPdf = () => {
    // The browser's print dialog saves the page as a PDF; the file name comes from the title.
    const previous = document.title;
    document.title = `${resume.personal?.name || "My"} - ${isCover ? "Cover letter" : "Resume"}`;
    window.print();
    document.title = previous;
  };

  const startOver = () => {
    if (confirm(`Replace your content with the example ${isCover ? "cover letter" : "resume"}? You can undo this.`)) reset();
  };

  return (
    <>
      <div className="screen-only flex h-screen flex-col">
        <SiteHeader active="editor">
          {doc && (
            <input
              value={doc.name}
              onChange={(e) => rename(e.target.value)}
              aria-label="Document name"
              title="Rename this document"
              className="w-44 rounded-md border border-transparent px-2 py-1 text-sm font-medium text-slate-700 hover:border-slate-300 focus:border-indigo-500 focus:outline-none sm:w-56"
            />
          )}
          <div className="flex items-center">
            <button type="button" onClick={undo} disabled={!canUndo} className={iconBtn} title="Undo (Ctrl/⌘+Z)" aria-label="Undo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 14 4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
              </svg>
            </button>
            <button type="button" onClick={redo} disabled={!canRedo} className={iconBtn} title="Redo (Ctrl/⌘+Shift+Z)" aria-label="Redo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 14 5-5-5-5" />
                <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
              </svg>
            </button>
          </div>
          <button type="button" onClick={startOver} className="text-sm text-slate-500 hover:text-slate-800">
            Start over
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            title="Opens your browser's print dialog. Choose “Save as PDF”."
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            Download PDF
          </button>
        </SiteHeader>

        <div className="flex border-b border-slate-200 bg-white md:hidden">
          {[
            ["edit", "Edit"],
            ["preview", "Preview"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMobileView(key)}
              className={`flex-1 py-2.5 text-sm font-semibold ${
                mobileView === key ? "border-b-2 border-indigo-600 text-indigo-700" : "text-slate-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <section
            className={`${mobileView === "edit" ? "block" : "hidden"} min-h-0 w-full flex-1 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-4 md:block md:w-[440px] md:flex-none`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{isCover ? "Letter design" : "Template"}</h2>
              {!isCover && (
                <Link href="/templates" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  Browse all templates →
                </Link>
              )}
            </div>
            {isCover && (
              <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                {letterLayouts.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => updateSettings({ letterLayout: l.id })}
                    className={`w-[88px] shrink-0 overflow-hidden rounded-md border-2 bg-white text-left ${
                      l.id === layout.id ? "border-indigo-600" : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <div className="pointer-events-none h-[118px] overflow-hidden">
                      <ScaledPage fixedScale={0.105}>
                        <l.component data={resume} theme={buildLetterTheme({ ...settings, letterLayout: l.id })} />
                      </ScaledPage>
                    </div>
                    <div className="truncate px-1.5 py-1 text-[11px] font-medium text-slate-700">{l.name}</div>
                  </button>
                ))}
              </div>
            )}
            {!isCover && <LayoutStrip data={resume} settings={settings} activeId={layout.id} onPick={pickLayout} />}

            {!isCover && <ScorePanel resume={resume} />}

            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Content</h2>
            {isCover ? (
              <CoverForm data={resume} settings={settings} updatePersonal={updatePersonal} updateField={updateField} updateSettings={updateSettings} />
            ) : (
              <>
                <SectionOrder
                  order={resume.sectionOrder?.length ? resume.sectionOrder : DEFAULT_SECTION_ORDER}
                  hidden={resume.hiddenSections || []}
                  onReorder={setSectionOrder}
                  onToggle={toggleSection}
                />
                <EditorForm resume={resume} updatePersonal={updatePersonal} updateList={updateList} avatar={theme.avatar} onAvatar={chooseAvatar} />
              </>
            )}
          </section>

          <section className={`${mobileView === "preview" ? "flex" : "hidden"} min-h-0 flex-1 flex-col bg-slate-200 md:flex`}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-300 bg-white/80 px-4 py-2 backdrop-blur">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-sm text-slate-500">Colour</span>
                {palettes
                  .filter((pal) => !layout.excludePalettes?.includes(pal.id))
                  .map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => updateSettings({ paletteId: pal.id })}
                      title={pal.name}
                      className={`h-6 w-6 rounded-full border-2 ${
                        pal.id === getPalette(settings.paletteId).id ? "border-indigo-600 ring-2 ring-indigo-200" : "border-white shadow"
                      }`}
                      style={{ background: `linear-gradient(135deg, ${pal.primary} 50%, ${pal.accent} 50%)` }}
                    />
                  ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-500">
                Font
                <select
                  value={settings.font || ""}
                  onChange={(e) => updateSettings({ font: e.target.value || null })}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
                >
                  <option value="">Template default</option>
                  {fonts.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-500">
                Picture
                <select
                  value={theme.avatar}
                  onChange={(e) => chooseAvatar(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
                >
                  <option value="photo">My photo</option>
                  <option value="initials">Initials</option>
                  {AVATAR_CHOICES.map(([id, label]) => (
                    <option key={id} value={id}>
                      Avatar: {label}
                    </option>
                  ))}
                </select>
              </label>
              {!isCover && layout.sketch && (
                <label className="flex items-center gap-2 text-sm text-slate-500">
                  Girl
                  <select
                    value={theme.sketchGirl}
                    onChange={(e) => updateSettings({ sketchGirls: { ...settings.sketchGirls, [layout.id]: e.target.value } })}
                    title="Shown unless Picture is “My photo” and you uploaded one"
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
                  >
                    {layout.id === "sketchbook" && <option value="reader">The reader (original)</option>}
                    {SKETCH_GIRLS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <span className="ml-auto text-sm font-medium text-slate-600">{layout.name}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">
              {!isCover && <p className="mx-auto mb-2 max-w-[794px] text-center text-xs text-slate-500">Tip: click anything on your resume to jump straight to where you edit it.</p>}
              <div className={`mx-auto max-w-[794px] ${isCover ? "" : "click-to-edit"}`} onClick={jumpToSection}>
                <ScaledPage className="bg-white shadow-xl" showPageBreaks>
                  <Template data={resume} theme={theme} />
                </ScaledPage>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="print-only">
        <Template data={resume} theme={theme} />
      </div>
    </>
  );
}
