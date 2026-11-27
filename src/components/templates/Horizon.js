import SidebarTimeline from "./layouts/SidebarTimeline";
import { fontOf, photoOf } from "./kit";

// Grey sidebar under a solid colour block, diagonal corner shapes and rounded bars.
export default function Horizon({ data, theme }) {
  const { primary, accent, light } = theme;
  const decor = { position: "absolute", pointerEvents: "none", zIndex: 2 };

  return (
    <SidebarTimeline
      data={data}
      font={fontOf(theme, "lato")}
      photoSrc={photoOf(data, theme)}
      sidebarBg={light}
      headingColor="#2b2b2b"
      lineColor="#3a3a3a"
      photoRing={accent}
      placeholderBg={primary}
      photoTopBlock={
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 150,
            background: accent,
          }}
        />
      }
      decorations={
        <>
          <svg width="460" height="210" viewBox="0 0 460 210" style={{ ...decor, top: 0, right: 0 }}>
            <polygon points="70,0 460,0 460,175" fill={primary} />
            <rect x="215" y="-22" width="160" height="34" rx="17" fill={accent} transform="rotate(16 295 -5)" />
            <rect x="385" y="118" width="120" height="34" rx="17" fill={accent} transform="rotate(24 445 135)" />
          </svg>
          <svg width="560" height="110" viewBox="0 0 560 110" style={{ ...decor, bottom: 0, left: 0 }}>
            <polygon points="0,18 320,110 0,110" fill={primary} />
            <rect x="290" y="72" width="190" height="30" rx="15" fill={accent} transform="rotate(12 385 87)" />
          </svg>
        </>
      }
    />
  );
}
