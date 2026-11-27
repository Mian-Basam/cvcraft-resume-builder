// "Portrait" art style: a modern flat-vector bust with realistic proportions, soft gradient
// lighting, layered hair with strand lines, and shaped brows, nose and lips.
// Takes the same options as the other character styles, plus a few that only this style draws well.

import { useId } from "react";
import { mix } from "./shared";

const FACE = {
  female: "M68,98 C67,64 81,47 100,47 C119,47 133,64 132,98 C132,123 124,140 113,148 C108,152 104,153 100,153 C96,153 92,152 87,148 C76,140 68,123 68,98 Z",
  male: "M66,96 C65,61 80,45 100,45 C120,45 135,61 134,96 C134,119 129,136 119,146 C113,152 107,155 100,155 C93,155 87,152 81,146 C71,136 66,119 66,96 Z",
};
const BODY = "M10,206 C14,180 44,166 84,163 L116,163 C156,166 186,180 190,206 Z";
const SLICK = "M64,100 C58,56 80,35 100,35 C120,35 142,56 136,100 C132,72 118,57 100,56 C82,57 68,72 64,100 Z";
const SLICK_STRANDS = ["M100,38 C88,42 78,52 72,66", "M100,38 C112,42 122,52 128,66", "M92,40 C84,48 79,58 76,70", "M108,40 C116,48 121,58 124,70"];

// Each style: back (behind the head and shoulders), front (over the forehead), locks (in front of the
// shoulders), strands (darker texture lines), shine (lighter streaks).
const HAIR = {
  short: {
    front: ["M64,96 C58,60 72,32 100,30 C128,30 144,56 136,96 C134,80 131,70 126,64 C116,62 108,58 102,54 C96,60 82,64 72,66 C68,74 65,84 64,96 Z"],
    strands: ["M80,40 C88,46 92,52 96,58", "M104,36 C110,42 116,52 120,62", "M120,38 C126,46 130,56 132,70", "M72,50 C70,58 68,66 67,74"],
    shine: ["M84,40 C96,34 112,34 124,41"],
  },
  quiff: {
    front: [
      "M65,98 C60,72 63,52 73,42 C80,26 98,17 117,19 C133,21 143,31 139,44 C143,57 141,73 135,96 C133,80 130,70 125,64 C112,61 96,60 84,64 C76,67 70,77 67,98 Z",
      "M73,44 C68,31 77,19 91,16 C85,23 83,31 85,39 Z",
    ],
    sides: true,
    strands: ["M80,58 C85,42 99,31 120,28", "M90,61 C96,47 109,39 130,37", "M101,60 C107,50 120,46 136,48", "M76,48 C82,34 92,26 104,22"],
    shine: ["M88,40 C98,30 112,26 126,28", "M96,50 C104,42 116,38 130,40"],
  },
  sidepart: {
    front: ["M64,98 C58,58 76,32 102,31 C128,30 144,54 136,96 C134,76 126,64 114,58 C100,64 84,66 70,70 C67,78 65,88 64,98 Z"],
    part: "M114,33 C115,42 116,50 114,58",
    strands: ["M112,40 C100,42 86,50 76,62", "M110,48 C98,52 86,58 74,68", "M124,42 C120,50 120,58 124,66"],
    shine: ["M106,38 C94,40 84,46 78,54"],
  },
  spiky: {
    front: ["M64,96 L60,62 L72,66 L68,38 L84,50 L88,24 L100,44 L112,22 L118,46 L134,30 L132,58 L142,54 L136,96 C132,78 120,66 100,64 C80,66 68,78 64,96 Z"],
    strands: ["M88,30 L94,52", "M112,28 L110,52", "M74,46 L82,60", "M130,38 L124,58"],
    shine: ["M90,34 L95,48", "M113,30 L111,46"],
  },
  buzz: {
    front: ["M66,92 C64,58 80,41 100,41 C120,41 136,58 134,92 C130,72 118,62 100,61 C82,62 70,72 66,92 Z"],
    opacity: 0.82,
    strands: [],
    shine: ["M86,47 C96,44 108,44 116,47"],
  },
  curly: { back: "curls", front: [SLICK], bumps: [[70, 62], [84, 50], [100, 46], [116, 50], [130, 62]], r: 12 },
  afro: { back: "afro", front: [SLICK], bumps: [[68, 64], [82, 51], [100, 46], [118, 51], [132, 64]], r: 13 },
  bald: { front: [] },
  long: {
    back: [
      "M60,84 C56,44 78,28 102,28 C128,28 148,46 144,86 C146,116 144,140 150,170 C152,186 150,198 152,206 L48,206 C50,198 48,186 50,170 C56,140 54,116 60,84 Z",
    ],
    front: ["M66,104 C60,62 78,36 100,36 C122,36 140,62 134,104 C130,80 120,62 104,52 C100,60 90,70 72,80 C69,88 67,96 66,104 Z"],
    locks: ["M68,90 C58,118 62,146 56,172 C54,184 58,194 64,200 C72,190 74,176 72,160 C70,138 74,114 71,96 Z"],
    strands: ["M104,40 C96,50 86,60 74,68", "M110,42 C120,52 128,66 132,84", "M66,110 C62,136 62,160 60,186"],
    lockStrands: ["M66,104 C62,128 64,152 60,176"],
    shine: ["M98,40 C88,46 80,54 74,64", "M116,44 C124,52 128,62 131,74"],
  },
  wavy: {
    back: [
      "M60,84 C56,44 78,28 102,28 C128,28 148,46 144,86 C152,104 142,118 152,136 C162,154 146,168 156,186 C160,194 156,202 154,206 L46,206 C44,202 40,194 44,186 C54,168 38,154 48,136 C58,118 48,104 60,84 Z",
    ],
    front: ["M66,106 C58,62 78,34 104,34 C126,34 142,58 134,104 C130,80 122,66 110,56 C100,66 86,72 76,78 C70,86 68,96 66,106 Z"],
    locks: ["M68,92 C56,108 66,120 58,136 C50,152 62,164 54,180 C50,190 56,198 62,202 C70,192 66,180 72,168 C80,152 68,140 74,124 C78,110 70,100 72,94 Z"],
    strands: ["M108,38 C98,48 88,60 76,70", "M114,40 C124,52 130,64 132,84", "M120,44 C128,56 133,70 134,92"],
    lockStrands: ["M68,100 C60,112 68,124 62,138 C56,152 64,164 58,180"],
    shine: ["M100,40 C92,46 84,54 78,64", "M118,46 C126,56 130,66 132,78"],
  },
  bob: {
    back: ["M58,86 C54,44 78,30 100,30 C122,30 146,44 142,86 C144,110 146,132 148,146 C136,152 124,150 118,144 L82,144 C76,150 64,152 52,146 C54,132 56,110 58,86 Z"],
    front: ["M64,100 C58,54 80,36 100,36 C120,36 142,54 136,100 C135,86 134,78 131,72 C112,66 88,66 69,72 C66,80 65,90 64,100 Z"],
    strands: ["M80,44 C78,54 78,62 80,70", "M92,40 C90,50 90,60 92,68", "M108,40 C110,50 110,60 108,68", "M120,44 C122,54 122,62 120,70", "M58,100 C58,116 56,130 54,142", "M142,100 C142,116 144,130 146,142"],
    shine: ["M82,42 C94,37 108,37 120,42"],
  },
  ponytail: {
    back: ["M126,46 C168,48 176,110 162,156 C158,170 144,168 146,154 C154,120 152,86 128,66 Z"],
    front: [SLICK],
    strands: SLICK_STRANDS,
    shine: ["M86,42 C96,38 106,38 114,41"],
    tie: [132, 52],
  },
  bun: { back: "bun", front: [SLICK], strands: SLICK_STRANDS, shine: ["M86,42 C96,38 106,38 114,41"] },
  braids: { front: [SLICK], braids: true, part: "M100,36 C100,44 100,50 100,56", strands: SLICK_STRANDS.slice(2), shine: ["M84,44 C90,40 96,39 98,39", "M102,39 C108,39 114,40 118,44"] },
  hijab: { front: [] },
  turban: { front: [] },
};

export default function PortraitCharacter({ variant, shirt, hair, skin, hairStyle, glasses, beard, outfit, expression, freckles, earrings, eyes = "#6b4226" }) {
  const uid = useId().replace(/:/g, "");
  const id = (n) => `${n}-${uid}`;
  const female = variant === "female";
  const style = HAIR[hairStyle] ? hairStyle : female ? "long" : "short";
  const h = HAIR[style];
  const covered = style === "hijab";
  const face = female ? FACE.female : FACE.male;

  const skinLight = mix(skin, "#ffffff", 0.14);
  const skinShade = mix(skin, "#7a3b1e", 0.24);
  const skinDeep = mix(skin, "#2a120a", 0.42);
  const hairDark = mix(hair, "#000000", 0.38);
  const hairLight = mix(hair, "#ffffff", 0.28);
  const shirtLight = mix(shirt, "#ffffff", 0.12);
  const shirtShade = mix(shirt, "#000000", 0.22);
  const shirtDeep = mix(shirt, "#000000", 0.45);
  const lip = mix(skin, "#c9505a", female ? 0.62 : 0.32);
  const lipDark = mix(lip, "#3a0e10", 0.4);
  const line = "#2b1f1a";
  const frame = "#3a332f";
  const browColor = style === "bald" || covered || style === "turban" ? mix(skin, "#1a0e08", 0.6) : mix(hair, "#000000", 0.2);
  const showEarrings = earrings ?? female;
  const earX = female ? 68.5 : 67;
  const neckL = female ? 88 : 86;
  const neckR = 200 - neckL;

  const hairFill = `url(#${id("hair")})`;
  const paths = (list, fill, extra = {}) => (list || []).map((d, i) => <path key={i} d={d} fill={fill} {...extra} />);
  const strokes = (list, color, width, extra = {}) =>
    (list || []).map((d, i) => <path key={i} d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" {...extra} />);
  // Mirrors a group across the centre line, for symmetric locks, braids and eyes.
  const mirror = (node) => <g transform="matrix(-1 0 0 1 200 0)">{node}</g>;

  const ring = (count, radius, cy, from, to, r) =>
    Array.from({ length: count }, (_, i) => {
      const a = Math.PI * (from + (i / (count - 1)) * (to - from));
      const x = 100 + radius * Math.cos(a);
      const y = cy + radius * Math.sin(a);
      return (
        <g key={i}>
          <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} fill={hairFill} />
          <path d={`M${(x - r * 0.5).toFixed(1)},${(y + r * 0.1).toFixed(1)} a${r * 0.5},${r * 0.45} 0 0 1 ${r},0`} stroke={hairDark} strokeWidth="1.4" fill="none" opacity="0.55" />
        </g>
      );
    });

  // One eye and brow on the left; the right one is the same group mirrored.
  const EYE = "M76.5,101 C80,95.4 92,95.4 95.5,101 C92,105.6 80,105.6 76.5,101 Z";
  const eyeSide = (
    <>
      <path d="M76,96.4 C80,92 92,92 96,96.4" stroke={skinShade} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d={EYE} fill="#fbf7f2" />
      <g clipPath={`url(#${id("eye")})`}>
        <circle cx="86" cy="100.4" r="5.1" fill={`url(#${id("iris")})`} />
        <circle cx="86" cy="100.4" r="2.4" fill="#140d0a" />
        <path d="M76,98.6 C80,95 92,95 96,98.6 L96,93 L76,93 Z" fill={skinShade} opacity="0.35" />
      </g>
      <circle cx="87.9" cy="98.6" r="1.4" fill="#ffffff" />
      <circle cx="84.4" cy="102.2" r="0.6" fill="#ffffff" opacity="0.8" />
      <path d="M76.2,100.8 C80,94.9 92,94.9 95.8,100.4" stroke={line} strokeWidth={female ? 2.1 : 1.7} fill="none" strokeLinecap="round" />
      {female && <path d="M76.8,100.2 L73.2,97.6 M78.6,98.2 L76,95.2" stroke={line} strokeWidth="1.2" strokeLinecap="round" />}
      <path d="M79.5,105.2 C83,106.6 89,106.6 92.5,105" stroke={skinShade} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      {female ? (
        <path d="M75,92 C79,86.6 88,85.4 95.5,88 L95.2,90.6 C88.5,88.8 81,89.6 76.4,93.6 Z" transform="translate(0,-2)" fill={browColor} />
      ) : (
        <path d="M74,92.5 C78.5,86.6 88,85.6 96.5,87.6 L96.2,91.6 C88.5,90 80.5,90.6 75.6,94.6 Z" transform="translate(0,-2)" fill={browColor} />
      )}
    </>
  );

  const body = (
    <>
      <path d={BODY} fill={`url(#${id("shirt")})`} />
      <path d="M10,206 C14,180 44,166 84,163 L88,163 C56,170 36,184 30,206 Z" fill={shirtLight} opacity="0.45" />
      <path d="M190,206 C186,180 156,166 116,163 L112,163 C144,170 164,184 170,206 Z" fill={shirtShade} opacity="0.5" />
    </>
  );

  const neck = !covered && (
    <>
      <path d={`M${neckL + 1},130 L${neckL},172 Q100,181 ${neckR},172 L${neckR - 1},130 Z`} fill={skin} />
      <path d={`M${neckL},138 Q100,164 ${neckR},138 L${neckR},158 Q100,172 ${neckL},158 Z`} fill={skinShade} opacity="0.6" />
      <path d={`M${neckR - 7},140 L${neckR},140 L${neckR},172 L${neckR - 5},174 Z`} fill={skinShade} opacity="0.35" />
    </>
  );

  // Collar and neckline details drawn over the neck.
  const outfitTop = (() => {
    if (covered) return null;
    switch (outfit) {
      case "tshirt":
        return (
          <>
            <path d="M82,163 C88,177 112,177 118,163" stroke={shirtShade} strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M84,164.5 C90,175 110,175 116,164.5" stroke={shirtLight} strokeWidth="1.2" fill="none" opacity="0.6" />
          </>
        );
      case "shirt":
        return (
          <>
            <path d="M92,163 L100,182 L108,163 Z" fill={skin} />
            <path d="M100,182 L100,206" stroke={shirtShade} strokeWidth="1.4" />
            {[190, 200].map((y) => <circle key={y} cx="103" cy={y} r="1.4" fill={shirtDeep} />)}
            <path d="M85,158 L100,182 L91,192 L76,168 Z M115,158 L100,182 L109,192 L124,168 Z" fill={mix(shirt, "#ffffff", 0.35)} stroke={shirtShade} strokeWidth="1.1" strokeLinejoin="round" />
          </>
        );
      case "polo":
        return (
          <>
            <path d="M91,163 L100,184 L109,163 Z" fill={skin} />
            <path d="M91,163 L100,184 L109,163" stroke={skinShade} strokeWidth="1" fill="none" opacity="0.6" />
            <rect x="96.5" y="182" width="7" height="24" rx="1.5" fill={shirtShade} opacity="0.55" />
            {[189, 199].map((y) => <circle key={y} cx="100" cy={y} r="1.7" fill={mix(shirt, "#ffffff", 0.55)} />)}
            <path d="M86,159 C80,163 74,168 70,174 L90,184 L100,184 Z M114,159 C120,163 126,168 130,174 L110,184 L100,184 Z" fill={shirt} stroke={shirtDeep} strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M74,173 L90,181 M126,173 L110,181" stroke={shirtLight} strokeWidth="1" opacity="0.6" />
          </>
        );
      case "blazer":
        return (
          <>
            <path d="M84,163 L100,206 L116,163 Z" fill="#f7f8fa" />
            <path d="M86,161 L100,176 L95,183 Z M114,161 L100,176 L105,183 Z" fill="#e3e7ee" />
            <path d="M96.5,176 L103.5,176 L106.5,199 L100,206 L93.5,199 Z" fill={shirtDeep} />
            <path d="M97,176 L103,176 L102,181 L98,181 Z" fill={mix(shirtDeep, "#000000", 0.3)} />
            <path d="M84,163 L98,206 L84,190 L70,174 Z M116,163 L102,206 L116,190 L130,174 Z" fill={shirtShade} />
            <path d="M84,163 L98,206 M116,163 L102,206" stroke={shirtDeep} strokeWidth="1" opacity="0.6" />
          </>
        );
      case "hoodie":
        return (
          <>
            <path d="M80,164 Q100,188 120,164 L124,206 L76,206 Z" fill="#f3ead8" />
            <path d="M68,174 C64,152 80,142 100,142 C120,142 136,152 132,174 C124,163 113,159 100,159 C87,159 76,163 68,174 Z" fill={shirtShade} />
            <path d="M72,170 C78,162 88,158 100,158 C112,158 122,162 128,170" stroke={shirtDeep} strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M88,178 L86,201 M112,178 L114,201" stroke="#f3ead8" strokeWidth="2.4" strokeLinecap="round" />
          </>
        );
      case "turtleneck":
        return (
          <>
            <path d={`M${neckL - 3},150 L${neckR + 3},150 L${neckR + 5},176 Q100,186 ${neckL - 5},176 Z`} fill={shirtShade} />
            {[90, 95, 100, 105, 110].map((x) => <path key={x} d={`M${x},152 L${x},180`} stroke={shirtDeep} strokeWidth="1" opacity="0.35" />)}
          </>
        );
      case "wrap": {
        const inner = mix("#a3c08a", shirt, 0.12);
        return (
          <>
            <path d="M88,163 L100,190 L112,163 L118,164 L100,200 L82,164 Z" fill="#f4ecdc" />
            <path d="M120,164 L100,202 L104,206 L130,168 Z" fill={inner} />
            <path d="M80,164 L104,206 L96,206 L70,168 Z" fill={inner} />
            <path d="M80,164 L104,206" stroke={mix(inner, "#000000", 0.2)} strokeWidth="1.2" />
            <path d="M70,168 L96,206 L58,206 C58,190 62,177 70,168 Z" fill={shirtShade} opacity="0.55" />
            <path d="M130,168 L104,206 L142,206 C142,190 138,177 130,168 Z" fill={shirtShade} opacity="0.4" />
          </>
        );
      }
      case "knit":
        return (
          <>
            <path d="M80,163 C87,181 113,181 120,163" stroke={mix(shirt, "#000000", 0.16)} strokeWidth="7" fill="none" strokeLinecap="round" />
            {[84, 89, 94, 100, 106, 111, 116].map((x, i) => (
              <path key={x} d={`M${x},${i === 0 || i === 6 ? 165 : 169} l0,6`} stroke={shirtDeep} strokeWidth="0.9" opacity="0.45" />
            ))}
            {[44, 62, 138, 156].map((x) => (
              <path key={x} d={`M${x},184 c-2,4 2,6 0,10 c-2,4 2,6 0,10`} stroke={shirtDeep} strokeWidth="1.4" fill="none" opacity="0.28" />
            ))}
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
      <defs>
        <clipPath id={id("face")}>
          <path d={face} />
        </clipPath>
        <clipPath id={id("eye")}>
          <path d={EYE} />
        </clipPath>
        <linearGradient id={id("skin")} x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0" stopColor={mix(skin, skinShade, 0.35)} />
          <stop offset="0.2" stopColor={skinLight} />
          <stop offset="0.62" stopColor={skin} />
          <stop offset="1" stopColor={skinShade} />
        </linearGradient>
        <linearGradient id={id("hair")} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor={mix(hair, "#ffffff", 0.12)} />
          <stop offset="0.45" stopColor={hair} />
          <stop offset="1" stopColor={hairDark} />
        </linearGradient>
        <linearGradient id={id("shirt")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shirtLight} />
          <stop offset="1" stopColor={shirtShade} />
        </linearGradient>
        <linearGradient id={id("beard")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hair} stopOpacity="0.2" />
          <stop offset="0.28" stopColor={hair} stopOpacity="0.92" />
          <stop offset="1" stopColor={hairDark} />
        </linearGradient>
        <radialGradient id={id("iris")} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor={mix(eyes, "#ffffff", 0.25)} />
          <stop offset="1" stopColor={mix(eyes, "#000000", 0.35)} />
        </radialGradient>
      </defs>

      {/* Hair or headscarf behind the head */}
      {Array.isArray(h.back) && paths(h.back, hairFill)}
      {Array.isArray(h.back) && (style === "long" || style === "wavy") && (
        <path d="M70,114 C68,146 66,178 70,206 L130,206 C134,178 132,146 130,114 Z" fill={hairDark} opacity="0.85" />
      )}
      {h.back === "bun" && (
        <>
          <circle cx="100" cy="30" r="18" fill={hairFill} />
          {strokes(["M88,26 C94,20 106,20 112,26", "M86,33 C94,27 106,27 114,33"], hairDark, 1.3, { opacity: 0.6 })}
        </>
      )}
      {h.back === "curls" && ring(12, 48, 82, 0.92, 2.08, 15)}
      {h.back === "afro" && (
        <>
          <circle cx="100" cy="74" r="62" fill={hairFill} />
          {ring(15, 61, 74, 0.9, 2.1, 13)}
        </>
      )}
      {style === "ponytail" && strokes(["M140,62 C154,88 156,118 150,152", "M134,58 C148,80 150,106 146,136"], hairDark, 1.3, { opacity: 0.55 })}
      {covered && (
        <path d="M40,106 C34,34 70,22 100,22 C130,22 166,34 160,106 C162,136 172,164 186,206 L14,206 C28,164 38,136 40,106 Z" fill={hairFill} />
      )}

      {body}
      {neck}
      {covered && (
        <>
          <path d="M64,122 C72,156 88,170 100,170 C112,170 128,156 136,122 C146,156 160,180 172,206 L28,206 C40,180 54,156 64,122 Z" fill={hairFill} />
          {strokes(["M66,140 C76,166 92,180 100,182", "M134,140 C124,166 108,180 100,182", "M52,170 C60,186 70,196 80,206"], hairDark, 1.4, { opacity: 0.45 })}
        </>
      )}
      {outfitTop}

      {/* Ears */}
      {!covered && style !== "turban" && (
        <>
          {[earX, 200 - earX].map((x, i) => (
            <g key={i}>
              <ellipse cx={x} cy="104" rx="6.5" ry="11" fill={i ? skinShade : skin} />
              <path d={i ? `M${x - 1},97 C${x + 3},101 ${x + 2},108 ${x - 2},111` : `M${x + 1},97 C${x - 3},101 ${x - 2},108 ${x + 2},111`} stroke={skinDeep} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5" />
            </g>
          ))}
        </>
      )}

      {/* Face with soft side lighting, a shadow under the hair line and a little cheek colour */}
      <path d={face} fill={`url(#${id("skin")})`} />
      <g clipPath={`url(#${id("face")})`}>
        {(h.front || []).map((d, i) => (
          <path key={i} d={d} transform="translate(1,5)" fill={skinShade} opacity="0.45" />
        ))}
        {covered && <path d="M62,112 C58,60 80,40 100,40 C120,40 142,60 138,112 C134,70 120,52 100,52 C80,52 66,70 62,112 Z" transform="translate(0,5)" fill={skinShade} opacity="0.45" />}
        <path d="M60,138 C80,160 120,160 140,138 L140,170 L60,170 Z" fill={skinShade} opacity="0.25" />
      </g>
      <ellipse cx="80" cy="117" rx="8" ry="4.5" fill="#e8796b" opacity={female ? 0.2 : 0.1} />
      <ellipse cx="120" cy="117" rx="8" ry="4.5" fill="#e8796b" opacity={female ? 0.2 : 0.1} />

      {eyeSide}
      {mirror(eyeSide)}

      {/* Nose: a shaded bridge, a soft tip and the nostril wings */}
      <path d="M101.5,102 C102.5,110 104.5,116 106,120.5 C104,123.8 100,124.4 97,123.6 C100,122 102,118.5 101.4,113 Z" fill={skinShade} opacity="0.7" />
      <ellipse cx="99" cy="119.5" rx="3" ry="2" fill={skinLight} opacity="0.6" />
      <path d="M93.5,120 C92.5,123 95,125.2 97.5,124.4 M106.5,120 C107.5,123 105,125.2 102.5,124.4" stroke={skinDeep} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.65" />

      {freckles &&
        [[76, 112], [81, 115], [78, 118], [124, 112], [119, 115], [122, 118], [93, 112], [107, 112]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill={skinDeep} opacity="0.55" />
        ))}

      {/* Facial hair: a cut-out keeps the lips visible */}
      {(beard === "beard" || beard === "full" || beard === "stubble") && (
        <path
          d="M66,96 C66,128 77,151 92,158 C96,160 104,160 108,158 C123,151 134,128 134,96 C133,108 130,116 124,120 C118,123 112,125 106,126 C102,125.5 98,125.5 94,126 C88,125 82,123 76,120 C70,116 67,108 66,96 Z M89,135 C89,140 111,140 111,135 C111,131 89,131 89,135 Z"
          fill={beard === "stubble" ? hair : `url(#${id("beard")})`}
          fillRule="evenodd"
          opacity={beard === "stubble" ? 0.28 : 1}
        />
      )}
      {(beard === "beard" || beard === "full") &&
        strokes(["M72,118 L74,124", "M78,124 L80,131", "M128,118 L126,124", "M122,124 L120,131", "M86,148 L88,154", "M114,148 L112,154", "M100,152 L100,158"], hairDark, 1.2, { opacity: 0.5 })}
      {(beard === "beard" || beard === "full" || beard === "moustache" || beard === "goatee") && (
        <path d="M86,131 C91,124.5 97,124.5 100,127.6 C103,124.5 109,124.5 114,131 C108,132.5 104,131.6 100,130 C96,131.6 92,132.5 86,131 Z" fill={beard === "full" ? hairDark : hair} />
      )}
      {(beard === "goatee" || beard === "full") && (
        <path d="M92,141 C94,152 106,152 108,141 C104,143.5 96,143.5 92,141 Z" fill={beard === "full" ? hairDark : hair} />
      )}

      {/* Mouth */}
      {expression === "grin" ? (
        <>
          <path d="M88,133 C92,144 108,144 112,133 C106,135 94,135 88,133 Z" fill="#5e1f22" />
          <path d="M90,133.8 C96,135.6 104,135.6 110,133.8 L109,136.8 C103,138 97,138 91,136.8 Z" fill="#ffffff" />
          <path d="M93,140.5 C97,142.4 103,142.4 107,140.5" stroke="#d9626a" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M86,132 C89,131 91,132 92,133.6 M114,132 C111,131 109,132 108,133.6" stroke={skinDeep} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.6" />
        </>
      ) : female ? (
        <>
          <path d="M88,133 C92.5,129.2 97,128.8 100,130.7 C103,128.8 107.5,129.2 112,133 C107,134 103,134.3 100,134 C97,134.3 93,134 88,133 Z" fill={lipDark} />
          <path d={expression === "calm" ? "M88.5,133 C93,138.6 107,138.6 111.5,133 C106,134.4 94,134.4 88.5,133 Z" : "M88,133 C92,140.4 108,140.4 112,133 C107,134.6 93,134.6 88,133 Z"} fill={lip} />
          <path d="M95,135.6 C98,136.6 102,136.6 105,135.6" stroke="#ffffff" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.35" />
          {expression !== "calm" && <path d="M87.6,132.2 C88.6,133.6 88.8,134.2 88.2,135.2 M112.4,132.2 C111.4,133.6 111.2,134.2 111.8,135.2" stroke={skinDeep} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />}
        </>
      ) : (
        <>
          <path d={expression === "calm" ? "M91,134.5 C95,135.6 105,135.6 109,134.5" : "M89,133.6 C94,137.4 106,137.4 111,133.6"} stroke={lipDark} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M94,138.6 C98,140.4 102,140.4 106,138.6" stroke={lip} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Hair in front */}
      {h.sides && (
        <>
          <path d="M66,98 C64,84 65,72 70,64 L72,92 Z" fill={hair} opacity="0.55" />
          <path d="M134,98 C136,84 135,72 130,64 L128,92 Z" fill={hair} opacity="0.55" />
        </>
      )}
      {paths(h.front, hairFill, { opacity: h.opacity || 1 })}
      {h.bumps &&
        h.bumps.map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={h.r} fill={hairFill} />
            <path d={`M${x - 5},${y + 2} a5,4 0 0 1 10,0`} stroke={hairDark} strokeWidth="1.3" fill="none" opacity="0.55" />
          </g>
        ))}
      {h.locks &&
        [false, true].map((flip) => {
          const lock = (
            <g transform="translate(-4,0)">
              {paths(h.locks, hairFill)}
              {strokes(h.lockStrands, hairDark, 1.3, { opacity: 0.55 })}
            </g>
          );
          return <g key={String(flip)}>{flip ? mirror(lock) : lock}</g>;
        })}
      {strokes(h.strands, hairDark, 1.3, { opacity: 0.55 })}
      {strokes(h.shine, hairLight, 2.2, { opacity: 0.7 })}
      {h.part && <path d={h.part} stroke={hairDark} strokeWidth="1.8" fill="none" strokeLinecap="round" />}
      {h.tie && <circle cx={h.tie[0]} cy={h.tie[1]} r="5" fill={shirt} stroke={shirtShade} strokeWidth="1" />}
      {style === "bald" && <path d="M78,58 C86,50 98,48 110,50" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3" />}
      {h.braids &&
        [61, 139].map((x) =>
          [116, 130, 144, 158, 172].map((y, i) => (
            <ellipse key={`${x}-${y}`} cx={x + (x < 100 ? -2 : 2)} cy={y} rx={9 - i * 0.6} ry="8" fill={hairFill} stroke={hairDark} strokeWidth="1.2" />
          )),
        )}
      {h.braids && [59, 141].map((x) => <circle key={x} cx={x} cy="183" r="3.6" fill={shirt} />)}
      {covered && (
        <>
          <path d="M62,112 C58,60 80,40 100,40 C120,40 142,60 138,112 C134,70 120,52 100,52 C80,52 66,70 62,112 Z" fill={hairDark} opacity="0.55" />
          {strokes(["M70,40 C84,30 116,30 130,40", "M60,64 C70,46 84,38 100,36"], hairLight, 1.6, { opacity: 0.5 })}
        </>
      )}
      {style === "turban" && (
        <>
          <path d="M56,84 C50,32 80,14 100,14 C120,14 150,32 144,84 C132,64 116,58 100,58 C84,58 68,64 56,84 Z" fill={hairFill} />
          {strokes(["M64,72 C78,44 116,34 138,54", "M60,54 C78,28 112,20 132,32", "M70,34 C88,22 112,22 128,28"], hairDark, 1.8, { opacity: 0.5 })}
        </>
      )}

      {showEarrings && !covered && [earX, 200 - earX].map((x) => (
        <g key={x}>
          <circle cx={x} cy="116" r="2.6" fill="#e2b84f" />
          <circle cx={x - 0.8} cy="115.2" r="0.8" fill="#fff6d6" />
        </g>
      ))}

      {/* Glasses: thin frames with a faint lens glare */}
      {glasses === "round" && (
        <g>
          <circle cx="86" cy="101" r="12" fill="#ffffff" opacity="0.08" />
          <circle cx="114" cy="101" r="12" fill="#ffffff" opacity="0.08" />
          <g stroke={frame} strokeWidth="2" fill="none">
            <circle cx="86" cy="101" r="12" />
            <circle cx="114" cy="101" r="12" />
            <path d="M98,100 Q100,97.5 102,100 M74,99 L66,96 M126,99 L134,96" strokeLinecap="round" />
          </g>
          <path d="M79,95 L83,92 M107,95 L111,92" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
        </g>
      )}
      {glasses === "square" && (
        <g>
          <g stroke={frame} fill="none" strokeLinejoin="round">
            <rect x="73" y="92" width="25" height="18" rx="4" strokeWidth="2" />
            <rect x="102" y="92" width="25" height="18" rx="4" strokeWidth="2" />
            <path d="M74,93 L97,93 M103,93 L126,93" strokeWidth="3" strokeLinecap="round" />
            <path d="M98,98 Q100,96.5 102,98 M73,97 L66,95 M127,97 L134,95" strokeWidth="2" strokeLinecap="round" />
          </g>
          <path d="M77,97 L81,94.5 M106,97 L110,94.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
        </g>
      )}
      {glasses === "sun" && (
        <g>
          <path d="M72,92 L98,92 L96.5,105 C94.5,112 75,112 73.5,105 Z M102,92 L128,92 L126.5,105 C125,112 105.5,112 103.5,105 Z" fill="#1e1e24" />
          <path d="M98,94.5 L102,94.5 M72,94 L66,92 M128,94 L134,92" stroke="#1e1e24" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M77,96 L85,96 M107,96 L115,96" stroke="#ffffff" strokeWidth="1.6" opacity="0.4" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
