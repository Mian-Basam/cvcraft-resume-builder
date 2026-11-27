import { useId } from "react";
import SidebarTimeline from "./layouts/SidebarTimeline";
import { fontOf, photoOf } from "./kit";

// Gradient bands across the top and bottom, a dark diagonal stripe and a ringed photo.
export default function Azure({ data, theme }) {
  const { primary, accent, dark, light } = theme;
  const decor = { position: "absolute", pointerEvents: "none", zIndex: 2 };
  // Unique ids so several copies on one page (thumbnail, preview, print) keep their own colours.
  const uid = useId().replace(/:/g, "");
  const topId = `azure-top-${uid}`;
  const bottomId = `azure-bottom-${uid}`;

  return (
    <SidebarTimeline
      data={data}
      font={fontOf(theme, "lato")}
      photoSrc={photoOf(data, theme)}
      sidebarBg={light}
      headingColor={dark}
      lineColor={dark}
      photoRing="#fff"
      photoOutline={dark}
      placeholderBg={primary}
      mainPaddingTop={110}
      decorations={
        <>
          <svg width="794" height="170" viewBox="0 0 794 170" style={{ ...decor, top: 0, left: 0 }}>
            <defs>
              <linearGradient id={topId} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor={primary} />
                <stop offset="1" stopColor={accent} />
              </linearGradient>
            </defs>
            <polygon points="0,0 794,0 794,30 0,92" fill={`url(#${topId})`} />
            <polygon points="520,0 572,0 794,128 794,172" fill={dark} />
          </svg>
          <svg width="794" height="70" viewBox="0 0 794 70" style={{ ...decor, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={bottomId} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor={primary} />
                <stop offset="1" stopColor={accent} />
              </linearGradient>
            </defs>
            <polygon points="0,56 794,10 794,70 0,70" fill={`url(#${bottomId})`} />
          </svg>
        </>
      }
    />
  );
}
