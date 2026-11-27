// Shared pieces for the sketch-style templates: ink colour, handwriting, hand-drawn lines and
// doodles, washi tape, and the portrait (a sketch girl, or the person's own photo).
import SketchGirl from "./sketchGirls";
import { fontStack } from "@/lib/palettes";

export const INK = "#1f1c18";
export const hand = fontStack("caveat");

// Which picture a sketch template shows: the uploaded photo when "My photo" is chosen and one exists,
// otherwise the sketch girl picked in the editor (theme.sketchGirl).
export function usesPhoto(data, theme) {
  return theme.avatar === "photo" && Boolean(data.personal.photo);
}

export function SketchPortrait({ data, theme, width, photoStyle, girlStyle }) {
  if (usesPhoto(data, theme)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.personal.photo}
        alt={data.personal.name || "Photo"}
        style={{ display: "block", width, aspectRatio: "1 / 1", objectFit: "cover", filter: "grayscale(0.3) sepia(0.25) contrast(1.05)", ...photoStyle }}
      />
    );
  }
  return (
    <div style={{ width, height: width * 1.2, ...girlStyle }}>
      <SketchGirl variant={theme.sketchGirl} accent={theme.accent} />
    </div>
  );
}

// Two loose pen strokes under a word.
export function Underline({ width = 150, color = INK, style }) {
  return (
    <svg width={width} height="9" viewBox="0 0 150 9" preserveAspectRatio="none" style={{ display: "block", ...style }} aria-hidden="true">
      <path d="M1 4 C40 1 90 7 149 3" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M8 8 C50 6 100 9 128 6.5" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Text with a highlighter-marker stroke behind its lower half.
export function Marker({ color, children, style }) {
  return (
    <span style={{ background: `linear-gradient(176deg, transparent 50%, ${color} 50%, ${color} 88%, transparent 88%)`, padding: "0 6px", ...style }}>{children}</span>
  );
}

export function Star({ size = 18, color = INK, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path d="M12 2.5 L14.3 9.2 L21.4 9.4 L15.8 13.7 L17.8 20.6 L12 16.5 L6.2 20.6 L8.2 13.7 L2.6 9.4 L9.7 9.2 Z" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function Sparkle({ size = 14, color = INK, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M19 5 L5 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Heart({ size = 14, color = INK, fill = "none", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path d="M12 20 C4 14 2 10 3.5 7 C5 4 9.5 3.5 12 7.5 C14.5 3.5 19 4 20.5 7 C22 10 20 14 12 20 Z" fill={fill} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// A loopy hand-drawn arrow pointing right.
export function LoopArrow({ width = 70, color = INK, style }) {
  return (
    <svg width={width} height={width * 0.45} viewBox="0 0 70 32" style={style} aria-hidden="true">
      <path d="M2 22 C14 4 30 4 30 16 C30 26 18 24 22 14 C26 6 44 10 66 18" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M58 11 L66 18 L56 22" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A hand-drawn tick box.
export function CheckBox({ size = 14, color = INK, tickColor }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }} aria-hidden="true">
      <path d="M3 3.5 L17 3 L16.5 17 L3.5 16.5 Z" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.5 10 L9 14 L18 2" fill="none" stroke={tickColor || color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A strip of washi tape with torn ends; children are written on it.
export function Tape({ color, children, rotate = -1.5, style }) {
  return (
    <div
      style={{
        display: "inline-block",
        background: color,
        opacity: 0.92,
        padding: "3px 18px 4px",
        transform: `rotate(${rotate}deg)`,
        clipPath: "polygon(0 8%, 4% 0, 7% 12%, 10% 0, 90% 0, 93% 10%, 96% 0, 100% 10%, 98% 50%, 100% 92%, 96% 100%, 93% 88%, 90% 100%, 10% 100%, 7% 90%, 4% 100%, 0 90%, 2% 50%)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
