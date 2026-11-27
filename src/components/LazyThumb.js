"use client";

import { useEffect, useRef, useState } from "react";
import ScaledPage from "./editor/ScaledPage";
import { PAGE_HEIGHT } from "./templates/shared";

// Renders a template preview only once it scrolls near the viewport, then keeps it.
export default function LazyThumb({ scale, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none overflow-hidden bg-white" style={{ height: Math.round(PAGE_HEIGHT * scale) }}>
      {visible && <ScaledPage fixedScale={scale}>{children}</ScaledPage>}
    </div>
  );
}
