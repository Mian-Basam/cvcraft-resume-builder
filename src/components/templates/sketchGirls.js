import { useId } from "react";

// Hand-drawn ink girls for the sketch-style templates. Each is a head-and-shoulders bust in black
// ink with hatching; one piece of clothing (scarf, sweater, hijab...) is in the template's accent colour.
// A displacement filter makes the lines wobble slightly, like a pen drawing.

export const SKETCH_GIRLS = [
  { id: "bun", name: "Messy bun & glasses" },
  { id: "bob", name: "Curly bob" },
  { id: "hijab", name: "Hijab" },
  { id: "braids", name: "Long braids" },
  { id: "pixie", name: "Pixie cut" },
  { id: "ponytail", name: "Ponytail" },
];

const INK = "#1f1c18";

// Small seeded random so every render draws the same strands.
function rng(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Parallel wavy strands between two lines, for hair texture.
function fall(r, { x0, y0, x1, y1, n, spread, sway = 6 }) {
  return Array.from({ length: n }, (_, i) => {
    const o = (i - (n - 1) / 2) * spread;
    const sx = x0 + o + (r() - 0.5) * 3, ex = x1 + o * 1.15 + (r() - 0.5) * 6;
    const cx = (sx + ex) / 2 + (r() - 0.5) * sway * 2, cy = (y0 + y1) / 2;
    return `M${sx.toFixed(1)} ${y0} Q${cx.toFixed(1)} ${cy} ${ex.toFixed(1)} ${y1 + (r() - 0.5) * 6}`;
  });
}

// Strands fanning out from a point, for hair pulled into a bun or ponytail.
function fan(r, { cx, cy, r0, r1, a0, a1, n, bend = 0.25 }) {
  return Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * (i + r() * 0.6)) / n;
    const s = r0 + r() * 4, e = r1 + (r() - 0.5) * 8;
    const x1 = cx + Math.cos(a) * s, y1 = cy + Math.sin(a) * s;
    const x2 = cx + Math.cos(a) * e, y2 = cy + Math.sin(a) * e;
    const m = (s + e) / 2, ab = a + bend * (r() - 0.3);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(cx + Math.cos(ab) * m).toFixed(1)} ${(cy + Math.sin(ab) * m).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  });
}

// Hair pulled back: strands from points along the hairline curving to one point (a bun or tie).
function converge(r, points, [tx, ty]) {
  return points.map(([x, y]) => {
    const cx = (x + tx) / 2 + (r() - 0.5) * 8, cy = (y + ty) / 2 - 4 + (r() - 0.5) * 6;
    return `M${x} ${y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${tx + (r() - 0.5) * 4} ${ty + (r() - 0.5) * 3}`;
  });
}
const arcPoints = (cx, cy, rx, ry, a0, a1, n) =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / (n - 1);
    return [+(cx + Math.cos(a) * rx).toFixed(1), +(cy + Math.sin(a) * ry).toFixed(1)];
  });

// A braid: overlapping hatched links that alternate left and right.
function Braid({ x0, y0, x1, y1, links, fill }) {
  return Array.from({ length: links }, (_, i) => {
    const t = (i + 0.5) / links;
    const x = x0 + (x1 - x0) * t + Math.sin(t * 5) * 2, y = y0 + (y1 - y0) * t;
    const rot = i % 2 ? 28 : -28;
    const ry = ((y1 - y0) / links) * 0.75;
    return (
      <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
        <ellipse cx={x} cy={y} rx={ry * 0.62} ry={ry} fill={fill} />
        <ellipse cx={x} cy={y} rx={ry * 0.62} ry={ry} fill="none" stroke={INK} strokeWidth="1.1" />
      </g>
    );
  });
}

const FACE = "M72 90 C72 62 128 62 128 90 C128 114 120 132 100 142 C80 132 72 114 72 90 Z";
const NECK = "M88 128 L112 128 L115 168 L85 168 Z";
const BODY = "M28 240 C32 198 58 176 88 166 C96 172 104 172 112 166 C142 176 168 198 172 240 Z";

const LOOKS = {
  bun: { skin: "#f3d9c4", hair: INK, outfit: "scarf" },
  bob: { skin: "#ecc6a6", hair: "#4a3222", outfit: "turtleneck" },
  hijab: { skin: "#e2b48e", hair: INK, outfit: "hijab" },
  braids: { skin: "#a8714d", hair: INK, outfit: "sweater" },
  pixie: { skin: "#f5dccb", hair: "#8a6a35", outfit: "blazer" },
  ponytail: { skin: "#efcfb4", hair: "#6e3519", outfit: "hoodie" },
};

export default function SketchGirl({ variant = "bun", accent = "#e0a83a", style }) {
  const uid = useId().replace(/:/g, "");
  const look = LOOKS[variant] || LOOKS.bun;
  const r = rng([...variant].reduce((s, c) => s + c.charCodeAt(0), 0) * 97);
  const hatch = `${uid}h`, cross = `${uid}c`, hairHatch = `${uid}hh`, accentHatch = `${uid}ah`, wobble = `${uid}w`, faceClip = `${uid}f`;
  const line = { stroke: INK, strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const thin = { ...line, strokeWidth: 0.8, opacity: 0.75 };
  const hairLine = { ...line, stroke: look.hair, strokeWidth: 1 };
  const paths = (list, s) => list.map((d, i) => <path key={i} d={d} {...s} />);

  // ---- clothing ----
  const outfit = {
    scarf: (
      <>
        <path d={BODY} fill={`url(#${hatch})`} opacity="0.85" />
        <path d={BODY} {...line} />
        <path d="M74 150 C82 176 118 176 126 150 C138 160 140 178 126 190 C110 200 90 200 74 190 C62 178 62 160 74 150 Z" fill={accent} />
        <path d="M108 188 C114 206 112 222 106 240 L90 240 C96 222 98 206 92 192 Z" fill={accent} />
        <path d="M74 150 C82 176 118 176 126 150 C138 160 140 178 126 190 C110 200 90 200 74 190 C62 178 62 160 74 150 Z" fill={`url(#${accentHatch})`} />
        {paths(["M74 150 C82 176 118 176 126 150", "M126 150 C138 160 140 178 126 190 C110 200 90 200 74 190 C62 178 62 160 74 150", "M72 168 C90 184 112 184 130 168", "M108 188 C114 206 112 222 106 240", "M92 192 C98 206 96 222 90 240"], line)}
      </>
    ),
    turtleneck: (
      <>
        <path d={BODY} fill={accent} />
        <path d={BODY} fill={`url(#${accentHatch})`} />
        <path d="M84 146 C86 160 86 166 84 172 C94 178 106 178 116 172 C114 166 114 160 116 146 Z" fill={accent} />
        {paths([BODY.replace(" Z", ""), "M84 146 C86 160 86 166 84 172 C94 178 106 178 116 172 C114 166 114 160 116 146", "M86 156 L114 156", "M85 164 L115 164"], line)}
        {paths(["M60 200 C62 214 60 228 58 240", "M140 200 C138 214 140 228 142 240"], thin)}
      </>
    ),
    hijab: (
      <>
        <path d={BODY} fill={`url(#${cross})`} opacity="0.9" />
        <path d={BODY} {...line} />
      </>
    ),
    sweater: (
      <>
        <path d={BODY} fill={accent} />
        <path d={BODY} fill={`url(#${accentHatch})`} />
        <path d={BODY.replace(" Z", "")} {...line} />
        {paths(["M80 170 C92 186 108 186 120 170", "M50 214 L52 240", "M150 214 L148 240", "M70 226 L72 240", "M130 226 L128 240"], thin)}
      </>
    ),
    blazer: (
      <>
        <path d={BODY} fill={`url(#${cross})`} opacity="0.9" />
        <path d="M88 166 L100 210 L112 166 C108 172 104 174 100 174 C96 174 92 172 88 166 Z" fill={accent} />
        <path d="M100 210 L100 240" {...line} />
        {paths([BODY.replace(" Z", ""), "M88 166 L100 210 L112 166", "M88 166 L76 196 L92 200 L100 210", "M112 166 L124 196 L108 200 L100 210"], line)}
      </>
    ),
    hoodie: (
      <>
        <path d={BODY} fill={accent} />
        <path d={BODY} fill={`url(#${accentHatch})`} />
        <path d="M70 172 C78 196 122 196 130 172 C122 182 78 182 70 172 Z" fill={`url(#${hatch})`} />
        {paths([BODY.replace(" Z", ""), "M70 172 C78 196 122 196 130 172", "M92 188 L90 214", "M108 188 L110 214"], line)}
        <circle cx="90" cy="216" r="2" fill={INK} />
        <circle cx="110" cy="216" r="2" fill={INK} />
      </>
    ),
  }[look.outfit];

  // ---- hair behind the head ----
  const back = {
    bob: (
      <>
        <path d="M62 128 C50 96 58 50 100 48 C142 50 150 96 138 128 C130 134 124 126 126 118 L74 118 C76 126 70 134 62 128 Z" fill={`url(#${hairHatch})`} />
        <path d="M62 128 C50 96 58 50 100 48 C142 50 150 96 138 128 C130 134 124 126 126 118" {...line} />
        <path d="M74 118 C76 126 70 134 62 128" {...line} />
        {paths(fall(r, { x0: 66, y0: 80, x1: 60, y1: 126, n: 5, spread: 3, sway: 5 }), hairLine)}
        {paths(fall(r, { x0: 134, y0: 80, x1: 140, y1: 126, n: 5, spread: 3, sway: 5 }), hairLine)}
      </>
    ),
    braids: (
      <>
        <Braid x0={68} y0={92} x1={56} y1={232} links={13} fill={`url(#${hairHatch})`} />
        <Braid x0={132} y0={92} x1={144} y1={232} links={13} fill={`url(#${hairHatch})`} />
      </>
    ),
    ponytail: (
      <>
        <path d="M128 54 C160 58 170 98 158 142 C152 162 160 178 150 194 C144 172 138 152 140 132 C144 104 140 76 124 62 Z" fill={`url(#${hairHatch})`} />
        <path d="M128 54 C160 58 170 98 158 142 C152 162 160 178 150 194 C144 172 138 152 140 132 C144 104 140 76 124 62" {...line} />
        {paths(fall(r, { x0: 146, y0: 70, x1: 152, y1: 180, n: 5, spread: 3, sway: 10 }), hairLine)}
      </>
    ),
  }[variant];

  // ---- hair on top of the head (drawn over the face) ----
  const top = {
    bun: (
      <>
        <path d="M68 102 C58 66 78 48 100 48 C124 48 144 66 132 102 C128 84 118 72 100 70 C84 72 72 84 68 102 Z" fill={`url(#${hairHatch})`} />
        <circle cx="100" cy="36" r="16" fill={`url(#${hairHatch})`} />
        {paths(["M86 40 C82 22 112 16 116 32 C118 44 96 50 92 38 C90 30 106 26 108 36", "M88 30 C94 22 106 22 110 28"], line)}
        {paths(converge(r, arcPoints(100, 100, 30, 30, Math.PI * 1.08, Math.PI * 1.92, 14), [100, 52]), hairLine)}
        {paths(["M68 102 C58 66 78 48 100 48 C124 48 144 66 132 102", "M68 102 C72 84 84 72 100 70 C118 72 128 84 132 102", "M100 54 C96 62 98 68 100 70", "M70 96 C60 114 70 128 58 148", "M131 96 C144 112 134 130 146 146", "M78 68 C68 80 74 92 70 104", "M84 22 C80 14 88 10 92 16", "M114 24 C122 14 128 22 120 28"], line)}
      </>
    ),
    bob: (
      <>
        <path d="M72 90 C74 70 88 60 100 60 C114 60 126 70 128 90 C120 80 114 86 106 78 C100 88 90 80 84 88 C80 82 76 88 72 90 Z" fill={`url(#${hairHatch})`} />
        {paths(["M72 90 C74 70 88 60 100 60 C114 60 126 70 128 90", "M72 90 C76 88 80 82 84 88 C90 80 100 88 106 78 C114 86 120 80 128 90"], line)}
        {[[62, 70], [58, 92], [60, 112], [138, 70], [142, 92], [140, 112], [80, 52], [100, 48], [120, 52]].map(([x, y], i) => (
          <path key={i} d={`M${x - 5} ${y} c0 -6 10 -6 10 0 c0 5 -7 5 -7 1`} {...line} strokeWidth="1.1" />
        ))}
      </>
    ),
    hijab: (
      <>
        <path d="M56 104 C52 60 78 40 100 40 C122 40 148 60 144 104 C146 134 136 154 126 168 C142 176 158 194 164 214 C140 220 60 220 36 214 C42 194 58 176 74 168 C64 154 54 134 56 104 Z M72 92 C72 116 80 132 100 142 C120 132 128 116 128 92 C128 66 72 66 72 92 Z" fill={accent} fillRule="evenodd" />
        <path d="M56 104 C52 60 78 40 100 40 C122 40 148 60 144 104 C146 134 136 154 126 168 C142 176 158 194 164 214 C140 220 60 220 36 214 C42 194 58 176 74 168 C64 154 54 134 56 104 Z M72 92 C72 116 80 132 100 142 C120 132 128 116 128 92 C128 66 72 66 72 92 Z" fill={`url(#${accentHatch})`} fillRule="evenodd" />
        {paths(["M56 104 C52 60 78 40 100 40 C122 40 148 60 144 104 C146 134 136 154 126 168 C142 176 158 194 164 214", "M56 104 C54 134 64 154 74 168 C58 176 42 194 36 214", "M70 90 C68 62 132 62 130 90", "M74 168 C90 178 110 178 126 168", "M66 120 C72 150 88 162 100 166", "M134 120 C128 150 112 162 100 166", "M60 190 C80 204 120 204 140 190"], line)}
        {paths(["M62 80 C70 60 90 50 100 50", "M138 80 C130 60 110 50 100 50", "M64 140 C70 152 78 160 86 164", "M136 140 C130 152 122 160 114 164"], thin)}
      </>
    ),
    braids: (
      <>
        <path d="M68 100 C62 64 82 48 100 48 C118 48 138 64 132 100 C128 80 116 70 100 70 C84 70 72 80 68 100 Z" fill={`url(#${hairHatch})`} />
        {paths(["M68 100 C62 64 82 48 100 48 C118 48 138 64 132 100", "M68 100 C72 80 84 70 100 70 C116 70 128 80 132 100", "M100 48 L100 70"], line)}
        {paths(fall(r, { x0: 88, y0: 52, x1: 76, y1: 92, n: 6, spread: 3, sway: 3 }), hairLine)}
        {paths(fall(r, { x0: 112, y0: 52, x1: 124, y1: 92, n: 6, spread: 3, sway: 3 }), hairLine)}
      </>
    ),
    pixie: (
      <>
        <path d="M70 98 C62 62 84 44 106 46 C130 48 140 70 130 98 C128 84 122 74 112 70 C98 78 84 76 74 86 C72 90 70 94 70 98 Z" fill={`url(#${hairHatch})`} />
        {paths(["M70 98 C62 62 84 44 106 46 C130 48 140 70 130 98", "M74 86 C84 76 98 78 112 70 C122 74 128 84 130 98", "M74 84 C88 62 114 58 128 72"], line)}
        {paths(fan(r, { cx: 104, cy: 50, r0: 3, r1: 24, a0: Math.PI * 0.12, a1: Math.PI * 0.88, n: 16, bend: 0.3 }), hairLine)}
        <circle cx="71" cy="112" r="5" {...line} strokeWidth="1.2" />
        <circle cx="129" cy="112" r="5" {...line} strokeWidth="1.2" />
      </>
    ),
    ponytail: (
      <>
        <path d="M70 96 C66 62 84 50 100 50 C118 50 134 62 130 96 C126 78 114 68 100 68 C86 68 74 78 70 96 Z" fill={`url(#${hairHatch})`} />
        {paths(["M70 96 C66 62 84 50 100 50 C118 50 134 62 130 96", "M70 96 C74 78 86 68 100 68 C114 68 126 78 130 96"], line)}
        {paths(converge(r, arcPoints(100, 98, 29, 30, Math.PI * 1.05, Math.PI * 1.8, 12), [126, 56]), hairLine)}
        <ellipse cx="129" cy="55" rx="7" ry="5" fill={accent} transform="rotate(-30 129 55)" />
        <ellipse cx="129" cy="55" rx="7" ry="5" {...line} transform="rotate(-30 129 55)" />
      </>
    ),
  }[variant];

  return (
    <svg viewBox="0 0 200 240" width="100%" height="100%" style={{ display: "block", overflow: "visible", ...style }} aria-hidden="true">
      <defs>
        <pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.8" />
        </pattern>
        <pattern id={cross} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.9" />
          <line x1="0" y1="0" x2="4" y2="0" stroke={INK} strokeWidth="0.6" />
        </pattern>
        <pattern id={hairHatch} width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(70)">
          <rect width="3.2" height="3.2" fill={look.hair} opacity="0.25" />
          <line x1="0" y1="0" x2="0" y2="3.2" stroke={look.hair} strokeWidth="1.3" />
          <line x1="0" y1="0" x2="3.2" y2="0" stroke={look.hair} strokeWidth="0.5" />
        </pattern>
        <pattern id={accentHatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.7" opacity="0.45" />
        </pattern>
        <clipPath id={faceClip}>
          <path d={FACE} />
        </clipPath>
        <filter id={wobble} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
      </defs>
      <g filter={`url(#${wobble})`}>
        {back}
        {outfit}
        <path d={NECK} fill={look.skin} />
        <path d="M100 166 L94 150" {...thin} />
        {paths(["M88 128 C89 144 88 156 85 168", "M112 128 C111 144 112 156 115 168"], line)}
        <path d={FACE} fill={look.skin} />
        {/* Shading down the right side of the face */}
        <g clipPath={`url(#${faceClip})`} opacity="0.4">
          <rect x="114" y="70" width="20" height="80" fill={`url(#${hatch})`} />
          <rect x="84" y="128" width="40" height="20" fill={`url(#${hatch})`} />
        </g>
        <path d={FACE} {...line} />
        {variant !== "hijab" && variant !== "bob" && paths(["M72 92 C66 90 64 102 70 106", "M128 92 C134 90 136 102 130 106"], line)}
        {/* Face */}
        {paths(["M80 86 Q87 81 95 85", "M105 85 Q113 81 120 86"], { ...line, strokeWidth: 1.8 })}
        {paths(["M80 96 Q87 90 94 96", "M106 96 Q113 90 120 96", "M80 96 L77 94", "M120 96 L123 94"], line)}
        {paths(["M82 98.5 Q87 100.5 92 98.5", "M108 98.5 Q113 100.5 118 98.5"], thin)}
        <circle cx="87" cy="95.5" r="2.6" fill={INK} />
        <circle cx="113" cy="95.5" r="2.6" fill={INK} />
        <circle cx="88" cy="94.6" r="0.7" fill="#fff" />
        <circle cx="114" cy="94.6" r="0.7" fill="#fff" />
        <path d="M101 99 C99 106 97 110 99 112 C101 113 103 112 105 111" {...line} strokeWidth="1.2" />
        <path d="M92 121 Q100 126 108 121" {...line} />
        <path d="M95 124.5 Q100 127 105 124.5" {...thin} />
        <ellipse cx="83" cy="110" rx="5" ry="3" fill="#e58f8f" opacity="0.22" />
        <ellipse cx="117" cy="110" rx="5" ry="3" fill="#e58f8f" opacity="0.22" />
        {top}
        {variant === "bun" && (
          <>
            <circle cx="87" cy="96" r="11" {...line} strokeWidth="1.6" />
            <circle cx="113" cy="96" r="11" {...line} strokeWidth="1.6" />
            <path d="M98 95 Q100 93 102 95" {...line} strokeWidth="1.6" />
            {paths(["M76 94 L70 92", "M124 94 L130 92"], line)}
          </>
        )}
      </g>
    </svg>
  );
}
