"use client";

import { memo, useEffect, useState } from "react";
import LazyThumb from "../LazyThumb";
import { buildTheme, layouts } from "../templates";

// The editor's row of template thumbnails. With 100+ layouts, drawing them all on every keystroke
// makes typing slow, so thumbnails render only when scrolled into view (LazyThumb) and catch up
// with the content half a second after typing stops.
function LayoutStrip({ data, settings, activeId, onPick }) {
  const [shown, setShown] = useState(data);
  useEffect(() => {
    const t = setTimeout(() => setShown(data), 500);
    return () => clearTimeout(t);
  }, [data]);

  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
      {layouts.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onPick(l)}
          title={l.description}
          className={`w-[88px] shrink-0 overflow-hidden rounded-md border-2 bg-white text-left ${
            l.id === activeId ? "border-indigo-600" : "border-transparent hover:border-slate-300"
          }`}
        >
          <LazyThumb scale={0.105}>
            <l.component data={shown} theme={buildTheme({ ...settings, layoutId: l.id })} />
          </LazyThumb>
          <div className="truncate px-1.5 py-1 text-[11px] font-medium text-slate-700">
            {l.premium && <span className="text-amber-500">★ </span>}
            {l.name}
          </div>
        </button>
      ))}
    </div>
  );
}

export default memo(LayoutStrip);
