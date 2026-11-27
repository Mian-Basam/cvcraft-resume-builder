"use client";

import { useEffect, useState } from "react";
import { ART_STYLES, BACKGROUNDS, Character, EXPRESSIONS, FACIAL_HAIR, GLASSES, HAIR_STYLES, OUTFITS, avatarBackground } from "../templates/shared";
import { FEMALE_PRESETS, MALE_PRESETS } from "@/lib/avatarPresets";
import { lookWithDefaults } from "../templates/kit";
import { ADJUSTMENTS, FILTERS, cartoonize, getFilter } from "@/lib/avatarTools";

const EYES = ["#6b4226", "#3b2416", "#8a6a3a", "#4a7bb0", "#4f8a5b", "#6b7d8c"];
const SKINS = ["#fbe0cc", "#f2c6a0", "#e2aa7e", "#c68a5c", "#9a6440", "#6b4329"];
// The last four are headscarf / turban colours.
const HAIRS = ["#1f1a17", "#3b2a20", "#6b4423", "#a8692f", "#d9b26f", "#b8b8b8", "#b5452f", "#5b6b8c", "#8c4a5b", "#2f6b5e", "#2c3e7a"];

function Swatches({ label, value, options, onPick }) {
  // A colour read from the photo is shown first when it is not one of the presets.
  const list = options.includes(value) ? options : [value, ...options];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-[70px] shrink-0 text-xs font-medium text-slate-500">{label}</span>
      {list.map((c) => (
        <button
          key={c}
          type="button"
          title={c === value && !options.includes(c) ? "From your photo" : c}
          onClick={() => onPick(c)}
          className={`h-6 w-6 rounded-full border-2 ${c === value ? "border-indigo-600 ring-2 ring-indigo-200" : "border-white shadow"}`}
          style={{ background: c }}
        />
      ))}
    </div>
  );
}

const chip = (on) =>
  `rounded-full border px-2.5 py-1 text-xs font-medium ${on ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`;

// "My avatar" builder (illustrated character) and status for "Cartoon of my photo".
// Filter thumbnails made from the user's own photo, so they can compare looks before choosing.
function FilterGrid({ photo, value, onPick }) {
  const [thumbs, setThumbs] = useState({});
  useEffect(() => {
    let cancelled = false;
    setThumbs({});
    (async () => {
      for (const f of FILTERS) {
        // One at a time, yielding in between, so the editor stays responsive.
        await new Promise((r) => setTimeout(r, 0));
        if (cancelled) return;
        try {
          const url = await cartoonize(photo, f.id, {}, 150);
          if (!cancelled) setThumbs((t) => ({ ...t, [f.id]: url }));
        } catch {
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [photo]);

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onPick(f.id)}
          title={f.name}
          className={`overflow-hidden rounded-md border-2 text-left ${value === f.id ? "border-indigo-600 ring-2 ring-indigo-200" : "border-transparent hover:border-slate-300"}`}
        >
          <div className="aspect-square w-full bg-slate-100">
            {thumbs[f.id] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbs[f.id]} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full animate-pulse bg-slate-200" />
            )}
          </div>
          <div className="truncate px-1 py-0.5 text-[10px] font-medium text-slate-700">{f.name}</div>
        </button>
      ))}
    </div>
  );
}

function Adjust({ filterId, adjust, onChange }) {
  const f = getFilter(filterId);
  const values = { ...f.defaults, ...adjust };
  const changed = Object.keys(adjust).length > 0;
  return (
    <div className="mt-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Adjust</span>
        {changed && (
          <button type="button" onClick={() => onChange({})} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            Reset
          </button>
        )}
      </div>
      {ADJUSTMENTS.filter((s) => f.uses.includes(s.key)).map((s) => (
        <label key={s.key} className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-28 shrink-0">{s.label}</span>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={values[s.key]}
            onChange={(e) => onChange({ ...adjust, [s.key]: Number(e.target.value) })}
            className="min-w-0 flex-1 accent-indigo-600"
          />
        </label>
      ))}
    </div>
  );
}

// "My avatar" builder (illustrated character), or the filters and sliders for "Cartoon of my photo".
export default function AvatarPanel({
  mode,
  look: savedLook,
  shirt,
  photo,
  cartoonReady,
  cartoonFilter,
  cartoonAdjust,
  onCartoonFilter,
  onCartoonAdjust,
  onChange,
  onMatchPhoto,
  matching,
}) {
  if (mode === "cartoon") {
    return (
      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold text-slate-800">Cartoon of your photo</span>
          {photo && <span className="text-xs text-slate-400">{cartoonReady ? "Updated" : "Updating…"}</span>}
        </div>
        {!photo ? (
          <p className="text-xs">Upload a photo under Personal details to see it in 10 cartoon styles here.</p>
        ) : (
          <>
            <FilterGrid photo={photo} value={cartoonFilter} onPick={onCartoonFilter} />
            <Adjust filterId={cartoonFilter} adjust={cartoonAdjust} onChange={onCartoonAdjust} />
            <p className="mt-2 text-xs text-slate-400">Tip: a well-lit, front-facing photo with a plain background works best.</p>
          </>
        )}
      </div>
    );
  }

  return <AvatarBuilder look={savedLook} shirt={shirt} photo={photo} onChange={onChange} onMatchPhoto={onMatchPhoto} matching={matching} />;
}

function ChipRow({ label, options, value, onPick }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-[70px] shrink-0 text-xs font-medium text-slate-500">{label}</span>
      {options.map(([v, l]) => (
        <button key={v} type="button" className={chip(value === v)} onClick={() => onPick(v)}>
          {l}
        </button>
      ))}
    </div>
  );
}

// Stands in for the template colour behind the avatar while editing.
const PREVIEW_BG = "#cbd5e1";

const sameLook = (a, b) => ["variant", "skin", "hair", "hairStyle", "outfit", "expression", "glasses", "beard", "freckles", "eyes"].every((k) => a[k] === b[k]);

function AvatarBuilder({ look: savedLook, shirt, photo, onChange, onMatchPhoto, matching }) {
  const raw = lookWithDefaults(savedLook);
  // Looks saved before the extra options used true/false for glasses and beard.
  const look = {
    ...raw,
    glasses: raw.glasses === true ? "round" : raw.glasses || "none",
    beard: raw.beard === true ? "beard" : raw.beard || "none",
  };
  const set = (patch) => onChange({ ...look, ...patch });
  const [tab, setTab] = useState(look.variant === "male" ? "male" : "female");
  const presets = tab === "male" ? MALE_PRESETS : FEMALE_PRESETS;

  return (
    <div className="mb-5 rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full" style={{ background: avatarBackground(look.bg, PREVIEW_BG) }}>
          <Character {...look} shirt={shirt} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-800">My avatar</div>
          <p className="text-xs text-slate-500">Pick a ready-made avatar, then change anything below. It wears your template colour.</p>
          {photo && (
            <button type="button" onClick={onMatchPhoto} disabled={matching} className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50">
              {matching ? "Reading your photo…" : "Match skin & hair to my photo"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ready-made</span>
        <span className="flex-1" />
        {[
          ["female", `Female (${FEMALE_PRESETS.length})`],
          ["male", `Male (${MALE_PRESETS.length})`],
        ].map(([v, l]) => (
          <button key={v} type="button" className={chip(tab === v)} onClick={() => setTab(v)}>
            {l}
          </button>
        ))}
      </div>
      <div className="mb-3 grid grid-cols-8 gap-1.5">
        {presets.map((p, i) => (
          <button
            key={i}
            type="button"
            title={`Avatar ${i + 1}`}
            onClick={() => onChange({ ...p, art: look.art, bg: look.bg })}
            style={{ background: avatarBackground(look.bg, PREVIEW_BG) }}
            className={`aspect-square overflow-hidden rounded-full border-2 ${sameLook(look, p) ? "border-indigo-600 ring-2 ring-indigo-200" : "border-transparent hover:border-slate-300"}`}
          >
            <Character {...p} art={look.art} shirt={shirt} />
          </button>
        ))}
      </div>

      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Customise</div>
      <div className="space-y-2">
        <ChipRow label="Art style" options={ART_STYLES} value={look.art || "detailed"} onPick={(art) => set({ art })} />
        <ChipRow label="Background" options={BACKGROUNDS} value={look.bg || "theme"} onPick={(bg) => set({ bg })} />
        <ChipRow label="Face" options={[["female", "Female"], ["male", "Male"]]} value={look.variant} onPick={(variant) => set({ variant })} />
        <Swatches label="Skin" value={look.skin} options={SKINS} onPick={(skin) => set({ skin })} />
        <Swatches label="Hair colour" value={look.hair} options={HAIRS} onPick={(hair) => set({ hair })} />
        {look.art !== "simple" && (
          <Swatches label="Eye colour" value={look.eyes || EYES[0]} options={EYES} onPick={(eyes) => set({ eyes })} />
        )}
        <ChipRow label="Style" options={HAIR_STYLES} value={look.hairStyle} onPick={(hairStyle) => set({ hairStyle })} />
        <ChipRow label="Facial hair" options={FACIAL_HAIR} value={look.beard} onPick={(beard) => set({ beard })} />
        <ChipRow label="Glasses" options={GLASSES} value={look.glasses} onPick={(glasses) => set({ glasses })} />
        <ChipRow label="Outfit" options={OUTFITS} value={look.outfit} onPick={(outfit) => set({ outfit })} />
        <ChipRow label="Mouth" options={EXPRESSIONS} value={look.expression} onPick={(expression) => set({ expression })} />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-[70px] shrink-0 text-xs font-medium text-slate-500">Extras</span>
          <button type="button" className={chip(look.earrings ?? look.variant === "female")} onClick={() => set({ earrings: !(look.earrings ?? look.variant === "female") })}>
            Earrings
          </button>
          <button type="button" className={chip(look.freckles)} onClick={() => set({ freckles: !look.freckles })}>
            Freckles
          </button>
        </div>
      </div>
    </div>
  );
}
