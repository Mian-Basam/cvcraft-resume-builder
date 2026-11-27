"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_HEIGHT, PAGE_WIDTH } from "../templates/shared";

// Shrinks a full-size A4 page to fit its container while keeping the real layout.
// fixedScale renders at that scale (thumbnails); showPageBreaks marks where pages split when printed.
export default function ScaledPage({ children, fixedScale, showPageBreaks = false, className = "" }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(fixedScale ?? 0.6);
  const [height, setHeight] = useState(PAGE_HEIGHT);

  useEffect(() => {
    const measure = () => {
      if (!fixedScale && outerRef.current) {
        setScale(Math.min(1, outerRef.current.clientWidth / PAGE_WIDTH));
      }
      if (innerRef.current) setHeight(innerRef.current.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (outerRef.current) observer.observe(outerRef.current);
    if (innerRef.current) observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, [fixedScale]);

  const pages = Math.ceil((height - 2) / PAGE_HEIGHT);
  const breaks = showPageBreaks ? Array.from({ length: Math.max(0, pages - 1) }, (_, i) => (i + 1) * PAGE_HEIGHT) : [];

  return (
    <div ref={outerRef} className="w-full">
      <div
        className={className}
        style={{ width: PAGE_WIDTH * scale, height: height * scale, margin: "0 auto", overflow: "hidden" }}
      >
        <div
          ref={innerRef}
          style={{ width: PAGE_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}
        >
          {children}
          {breaks.map((top, i) => (
            <div
              key={top}
              style={{ position: "absolute", left: 0, right: 0, top, borderTop: "2px dashed #f43f5e", zIndex: 50, pointerEvents: "none" }}
            >
              <span style={{ position: "absolute", right: 8, top: 4, background: "#f43f5e", color: "#fff", fontSize: 13, padding: "2px 8px", borderRadius: 4, fontFamily: "sans-serif" }}>
                Page {i + 2}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
