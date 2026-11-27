// Building blocks shared by the resume templates.

import { useId } from "react";
import PortraitCharacter from "./portrait";
import { SimpleAvatar, parseAvatarToken } from "./simpleAvatar";

export const PAGE_WIDTH = 794; // A4 width at 96 dpi
export const PAGE_HEIGHT = 1123; // A4 height at 96 dpi

export function pageStyle(extra) {
  return {
    width: PAGE_WIDTH,
    minHeight: PAGE_HEIGHT,
    position: "relative",
    overflow: "hidden",
    background: "#fff",
    ...extra,
  };
}

export function dateRange(start, end) {
  return [start, end].filter(Boolean).join(" – ");
}

export function lines(text = "") {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Options for the illustrated character (used by the avatar builder and the presets).
export const HAIR_STYLES = [
  ["short", "Short"], ["quiff", "Quiff"], ["sidepart", "Side part"], ["spiky", "Spiky"], ["buzz", "Buzz"], ["curly", "Curly"],
  ["afro", "Afro"], ["bald", "Bald"], ["long", "Long"], ["wavy", "Wavy"], ["bob", "Bob"],
  ["ponytail", "Ponytail"], ["bun", "Bun"], ["braids", "Braids"], ["hijab", "Hijab"], ["turban", "Turban"],
];
export const FACIAL_HAIR = [["none", "None"], ["stubble", "Stubble"], ["moustache", "Moustache"], ["goatee", "Goatee"], ["beard", "Beard"], ["full", "Beard & goatee"]];
export const GLASSES = [["none", "None"], ["round", "Round"], ["square", "Square"], ["sun", "Sunglasses"]];
export const OUTFITS = [
  ["tshirt", "T-shirt"], ["shirt", "Shirt"], ["polo", "Polo"], ["blazer", "Blazer & tie"], ["hoodie", "Hoodie"],
  ["turtleneck", "Turtleneck"], ["knit", "Knit sweater"], ["wrap", "Wrap collar"],
];
export const ART_STYLES = [["portrait", "Portrait"], ["detailed", "Detailed"], ["simple", "Simple"]];
export const BACKGROUNDS = [["theme", "Template colour"], ["gradient", "Gradient"], ["glow", "Soft glow"], ["light", "Light grey"]];

// What sits behind the character in the round photo frame. base is the template's colour.
export function avatarBackground(bg, base) {
  if (bg === "gradient") return `linear-gradient(160deg, rgba(255,255,255,0.5), rgba(255,255,255,0) 65%), ${base}`;
  if (bg === "glow") return `radial-gradient(circle at 50% 42%, rgba(255,255,255,0.7), rgba(255,255,255,0) 58%), ${base}`;
  if (bg === "light") return "linear-gradient(180deg, #f7f8fa, #e4e8ee)";
  return base;
}

// Options only the Portrait style draws; the older styles show their closest match.
const OLDER_STYLE_FALLBACK = { hairStyle: { quiff: "sidepart" }, beard: { full: "beard" }, outfit: { polo: "shirt", knit: "tshirt", wrap: "shirt" } };
export const EXPRESSIONS = [["smile", "Smile"], ["grin", "Big smile"], ["calm", "Calm"]];

const CAP = "M61,92 C56,52 80,40 100,40 C120,40 144,52 139,92 C134,70 120,60 100,60 C80,60 66,70 61,92 Z";

// Detailed character: flat-vector portrait with large expressive eyes, a shaded nose, lips,
// hair built from layered shapes, and soft cel shading. Same options as the simple character.
const FACE = {
  male: "M60,92 C60,52 78,34 100,34 C122,34 140,52 140,92 C140,118 133,138 120,150 C114,155 107,158 100,158 C93,158 86,155 80,150 C67,138 60,118 60,92 Z",
  female: "M62,92 C62,52 80,36 100,36 C120,36 138,52 138,92 C138,117 130,136 118,148 C112,153 106,156 100,156 C94,156 88,153 82,148 C70,136 62,117 62,92 Z",
};
const SLICK = "M60,96 C56,52 78,30 100,30 C122,30 144,52 140,96 C134,66 120,54 100,52 C80,54 66,66 60,96 Z";
const SLICK_SHINE = ["M80,40 C90,35 110,34 122,40 C110,39 96,40 86,45 Z"];

// For each hair style: back (behind head), front (over the forehead), locks (fall in front of the
// shoulders), shine (lighter highlight shapes), plus a few style-specific extras.
const HAIR = {
  short: {
    back: ["M57,100 C50,60 66,30 98,26 C130,22 152,48 143,100 Z"],
    front: [
      "M56,96 C50,62 60,34 86,24 C102,18 124,20 138,32 C150,44 150,66 144,94 C142,80 138,70 132,64 C128,72 120,74 112,70 C116,64 116,58 114,54 C106,64 92,70 76,70 C82,66 86,62 88,58 C78,64 68,74 62,96 Z",
      "M84,26 C88,12 104,6 118,12 C108,13 100,18 96,26 Z",
      "M118,20 C130,14 146,18 152,30 C142,26 134,26 128,30 Z",
      "M62,50 C54,42 52,32 56,24 C60,36 68,42 74,44 Z",
    ],
    shine: ["M88,34 C100,27 116,27 128,34 C116,33 104,35 94,41 Z", "M68,56 C72,49 78,44 85,41 C80,47 76,52 72,58 Z"],
  },
  sidepart: {
    back: ["M58,100 C52,60 68,28 100,26 C132,24 150,50 142,100 Z"],
    front: ["M57,98 C49,58 70,26 104,24 C134,22 152,46 143,96 C141,76 132,62 118,54 C102,63 82,65 66,67 C62,76 59,86 57,98 Z"],
    shine: ["M76,42 C88,32 104,29 118,31 C106,34 94,38 84,46 Z"],
    part: "M116,26 C117,36 118,46 118,54",
  },
  spiky: {
    front: ["M58,94 L54,58 L68,63 L64,32 L82,47 L88,18 L100,41 L114,15 L118,43 L136,26 L134,57 L148,51 L142,94 C138,74 126,63 100,61 C76,63 62,74 58,94 Z"],
    shine: ["M88,26 L96,44 L90,46 Z", "M112,22 L114,44 L108,44 Z"],
  },
  buzz: { front: ["M62,88 C60,50 80,35 100,35 C120,35 140,50 138,88 C132,64 118,55 100,55 C82,55 68,64 62,88 Z"], opacity: 0.85 },
  curly: { back: "curls", front: [SLICK], bumps: [[69, 60], [83, 49], [100, 45], [117, 49], [131, 60]], r: 12 },
  afro: { back: "afro", front: [SLICK], bumps: [[67, 62], [81, 50], [100, 45], [119, 50], [133, 62]], r: 13 },
  bald: { front: [], shine: [] },
  long: {
    back: [
      "M58,80 C54,40 78,24 102,24 C128,24 150,42 146,82 C150,110 144,128 152,148 C160,168 152,186 160,206 L40,206 C48,186 40,168 48,148 C56,128 50,110 58,80 Z",
    ],
    front: ["M59,102 C53,58 74,29 102,29 C129,29 149,52 142,102 C138,79 128,61 112,55 C104,67 88,75 70,77 C66,83 62,92 59,102 Z"],
    locks: [
      "M62,84 C52,110 60,134 52,156 C46,172 52,188 62,198 C72,188 75,172 71,156 C67,138 72,116 70,96 Z",
      "M140,80 C150,108 142,132 150,154 C156,170 150,188 138,198 C130,188 128,172 132,156 C137,138 130,116 132,96 Z",
    ],
    shine: ["M106,37 C121,39 133,50 137,63 C129,55 119,49 108,46 Z", "M60,120 C57,134 56,148 54,160 C59,148 61,134 64,122 Z"],
  },
  wavy: {
    back: [
      "M58,80 C54,40 78,24 102,24 C128,24 150,42 146,82 C156,100 142,114 154,132 C166,150 148,166 160,184 C166,194 160,202 158,206 L42,206 C40,202 34,194 40,184 C52,166 34,150 46,132 C58,114 44,100 58,80 Z",
    ],
    front: ["M59,102 C53,58 74,29 102,29 C129,29 149,52 142,102 C136,78 122,60 100,54 C84,62 70,78 59,102 Z"],
    locks: [
      "M62,86 C50,104 64,118 54,136 C44,152 58,166 50,182 C46,190 54,198 62,200 C68,190 64,178 70,166 C78,150 64,138 72,122 C78,108 68,98 70,90 Z",
      "M138,86 C150,104 136,118 146,136 C156,152 142,166 150,182 C154,190 146,198 138,200 C132,190 136,178 130,166 C122,150 136,138 128,122 C122,108 132,98 130,90 Z",
    ],
    shine: ["M88,38 C100,33 114,34 124,40 C112,40 100,42 92,46 Z"],
  },
  bob: {
    back: ["M56,80 C52,40 78,26 100,26 C124,26 150,40 144,80 C148,108 150,134 152,150 C138,156 124,154 118,148 L82,148 C76,154 62,156 48,150 C50,134 52,108 56,80 Z"],
    front: ["M58,100 C54,52 78,30 100,30 C124,30 146,52 142,100 C141,86 140,78 137,72 C118,66 82,64 63,70 C61,78 59,88 58,100 Z"],
    shine: ["M78,40 C90,34 110,34 122,40 C110,40 96,42 86,46 Z"],
  },
  ponytail: {
    back: ["M128,44 C170,44 180,108 164,156 C160,170 146,168 148,154 C156,120 154,84 128,64 Z"],
    front: [SLICK],
    shine: SLICK_SHINE,
    tie: [134, 50],
  },
  bun: { back: "bun", front: [SLICK], shine: SLICK_SHINE },
  braids: { front: [SLICK], braids: true, part: "M100,30 C100,38 100,46 100,52", shine: SLICK_SHINE },
  hijab: { front: [] },
  turban: { front: [] },
};

function DetailedCharacter({ variant, shirt, hair, skin, hairStyle, glasses, beard, outfit, expression, freckles, earrings, eyes = "#6b4226" }) {
  const uid = useId().replace(/:/g, "");
  const faceClip = `face-${uid}`;
  const eyeClip = `eye-${uid}`;
  const female = variant === "female";
  const style = HAIR[hairStyle] ? hairStyle : female ? "long" : "short";
  const h = HAIR[style];
  const covered = style === "hijab";
  const face = female ? FACE.female : FACE.male;
  const skinShade = mix(skin, "#7a3b1e", 0.22);
  const skinDeep = mix(skin, "#000000", 0.32);
  const hairDark = mix(hair, "#000000", 0.32);
  const hairLight = mix(hair, "#ffffff", 0.3);
  const shirtShade = mix(shirt, "#000000", 0.2);
  const lip = mix(skin, "#d0545a", 0.5);
  const lipDark = mix(lip, "#000000", 0.35);
  const line = "#2a1d18";
  const tee = "#f3ead8";
  const showEarrings = earrings ?? female;
  const browColor = style === "bald" || covered || style === "turban" ? mix(skin, "#000000", 0.55) : hairDark;
  const earX = female ? 62 : 60;
  const EYE = "M70,100 C73,92.5 89.5,92 93,99.5 C90,106.5 73.5,107 70,100 Z";

  const ring = (count, radius, cy, from, to, r) =>
    Array.from({ length: count }, (_, i) => {
      const a = Math.PI * (from + (i / (count - 1)) * (to - from));
      return <circle key={i} cx={(100 + radius * Math.cos(a)).toFixed(1)} cy={(cy + radius * Math.sin(a)).toFixed(1)} r={r} fill={hair} />;
    });

  // One eye and brow drawn on the left; the right side is the same group mirrored.
  const eyeSide = (
    <>
      <path d={EYE} fill="#ffffff" />
      <g clipPath={`url(#${eyeClip})`}>
        <circle cx="81.8" cy="100" r="7" fill={eyes} />
        <circle cx="81.8" cy="100" r="7" fill="none" stroke={mix(eyes, "#000000", 0.4)} strokeWidth="1" />
        <circle cx="81.8" cy="100" r="3.3" fill="#1a1210" />
        <path d="M70,96.5 C75,93.5 88,93.5 93,96.5 L93,91 L70,91 Z" fill={skinShade} opacity="0.3" />
      </g>
      <circle cx="84.2" cy="97.4" r="2.3" fill="#ffffff" />
      <circle cx="79.4" cy="102.4" r="1" fill="#ffffff" opacity="0.85" />
      <path d="M69.5,100 C72.5,91 89.5,90.5 93.5,98.5" stroke={line} strokeWidth={female ? 2.8 : 2.4} fill="none" strokeLinecap="round" />
      {female && <path d="M70,98.5 L65,95 M72,95 L68.5,91 M75.5,92.5 L73.5,88.5" stroke={line} strokeWidth="1.6" strokeLinecap="round" />}
      <path d="M74,105.5 C78,108 86,108 90.5,105" stroke={skinShade} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      {female ? (
        <path d="M68,87 C74,80.5 85,79.5 93.5,83 L93,86 C85,83 76,84 69.5,89.5 Z" fill={browColor} />
      ) : (
        <path d="M67,87.5 C74,80 85,79 94.5,82.5 L94,87.5 C85,84.5 76,85.5 68.5,91 Z" fill={browColor} />
      )}
    </>
  );

  const paths = (list, fill, extra = {}) => (list || []).map((d, i) => <path key={i} d={d} fill={fill} {...extra} />);

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
      <defs>
        <clipPath id={faceClip}>
          <path d={face} />
        </clipPath>
        <clipPath id={eyeClip}>
          <path d={EYE} />
        </clipPath>
      </defs>

      {/* Hair and headscarf behind the head */}
      {Array.isArray(h.back) && paths(h.back, hair)}
      {Array.isArray(h.back) && (style === "long" || style === "wavy") && <path d="M66,112 C64,144 62,176 66,206 L134,206 C138,176 136,144 134,112 Z" fill={hairDark} />}
      {h.back === "bun" && (
        <>
          <circle cx="100" cy="24" r="19" fill={hair} />
          <path d="M87,18 C93,11 107,11 113,18 C106,15 94,15 87,18 Z" fill={hairLight} />
        </>
      )}
      {h.back === "curls" && ring(12, 48, 80, 0.92, 2.08, 16)}
      {h.back === "afro" && (
        <>
          <circle cx="100" cy="72" r="64" fill={hair} />
          {ring(15, 62, 72, 0.9, 2.1, 13)}
        </>
      )}
      {covered && <path d="M42,104 C36,32 72,16 100,16 C128,16 164,32 158,104 C160,134 168,160 182,196 C150,210 50,210 18,196 C32,160 40,134 42,104 Z" fill={hair} />}

      {/* Shoulders and outfit */}
      {outfit === "hoodie" ? (
        <>
          <path d="M78,162 Q100,190 122,162 L126,206 L74,206 Z" fill={tee} />
          <path d="M70,172 C66,152 82,143 100,143 C118,143 134,152 130,172 C122,162 112,158 100,158 C88,158 78,162 70,172 Z" fill={shirtShade} />
          <path d="M12,206 C16,178 44,166 74,162 L86,206 Z M188,206 C184,178 156,166 126,162 L114,206 Z" fill={shirt} />
          <path d="M74,162 L86,206 L80,206 L69,164 Z M126,162 L114,206 L120,206 L131,164 Z" fill={shirtShade} />
        </>
      ) : (
        <path d="M12,206 C16,178 44,166 80,163 L120,163 C156,166 184,178 188,206 Z" fill={shirt} />
      )}

      {/* Neck */}
      {!covered && (
        <>
          <path d="M85,138 L85,174 Q100,184 115,174 L115,138 Z" fill={skin} />
          <path d="M85,144 Q100,166 115,144 L115,160 Q100,174 85,160 Z" fill={skinShade} opacity="0.7" />
        </>
      )}
      {covered && <path d="M62,124 C70,156 88,170 100,170 C112,170 130,156 138,124 C148,156 158,176 168,198 L32,198 C42,176 52,156 62,124 Z" fill={hair} />}

      {/* Outfit details that sit over the neck */}
      {outfit === "tshirt" && <path d="M81,165 Q100,182 119,165" stroke={shirtShade} strokeWidth="5" fill="none" strokeLinecap="round" />}
      {outfit === "shirt" && (
        <>
          <path d="M100,180 L100,206" stroke={shirtShade} strokeWidth="1.6" />
          <path d="M84,160 L100,180 L91,192 L75,170 Z M116,160 L100,180 L109,192 L125,170 Z" fill={mix(shirt, "#ffffff", 0.4)} stroke={shirtShade} strokeWidth="1.2" />
        </>
      )}
      {outfit === "blazer" && (
        <>
          <path d="M83,163 L100,206 L117,163 Z" fill="#ffffff" />
          <path d="M84,161 L100,176 L95,182 Z M116,161 L100,176 L105,182 Z" fill="#e9ecf1" />
          <path d="M96,176 L104,176 L107,200 L100,206 L93,200 Z" fill={mix(shirt, "#000000", 0.55)} />
          <path d="M83,163 L98,206 L85,188 L70,172 Z M117,163 L102,206 L115,188 L130,172 Z" fill={shirtShade} />
        </>
      )}
      {outfit === "hoodie" && (
        <>
          <path d="M86,176 L84,200 M114,176 L116,200" stroke={tee} strokeWidth="2.6" strokeLinecap="round" />
          <rect x="81.5" y="198" width="5" height="7" rx="1.5" fill={mix(tee, "#000000", 0.2)} />
          <rect x="113.5" y="198" width="5" height="7" rx="1.5" fill={mix(tee, "#000000", 0.2)} />
        </>
      )}
      {outfit === "turtleneck" && !covered && <path d="M82,152 L118,152 L120,176 Q100,186 80,176 Z" fill={shirtShade} />}

      {/* Ears */}
      {!covered && style !== "turban" && (
        <>
          <ellipse cx={earX} cy="104" rx="7.5" ry="12" fill={skin} />
          <ellipse cx={200 - earX} cy="104" rx="7.5" ry="12" fill={skin} />
          <path d={`M${earX + 1},97 C${earX - 3},101 ${earX - 2},108 ${earX + 2},111`} stroke={skinShade} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d={`M${199 - earX},97 C${203 - earX},101 ${202 - earX},108 ${198 - earX},111`} stroke={skinShade} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Face with cel shading: one side, under the hair, and under the chin */}
      <path d={face} fill={skin} />
      <g clipPath={`url(#${faceClip})`}>
        <path d="M142,70 C141,112 132,140 112,158 L160,170 L160,70 Z" fill={skinShade} opacity="0.4" />
        {(h.front || []).map((d, i) => (
          <path key={i} d={d} transform="translate(0,6)" fill={skinShade} opacity="0.55" />
        ))}
      </g>

      <ellipse cx="75" cy="117" rx="8" ry="4.5" fill="#f19a8a" opacity="0.28" />
      <ellipse cx="125" cy="117" rx="8" ry="4.5" fill="#f19a8a" opacity="0.28" />
      {eyeSide}
      <g transform="matrix(-1 0 0 1 200 0)">{eyeSide}</g>

      {/* Nose: a soft shadow on one side and the tip */}
      <path d="M102,104 C103,112 107,118 105,123 C102,125.5 97,124.5 95,122 C98,122 101.5,121 101.5,117.5 C101.5,112 101,108 102,104 Z" fill={skinShade} opacity="0.9" />
      <path d="M94,122 C97,125.5 103,125.5 106.5,121.5" stroke={skinDeep} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.75" />
      {freckles &&
        [[72, 113], [78, 117], [75, 121], [128, 113], [122, 117], [125, 121], [92, 114], [108, 114]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill={skinDeep} opacity="0.65" />
        ))}

      {/* Facial hair */}
      {(beard === "beard" || beard === "stubble") && (
        <path
          d="M60,102 C60,130 72,152 88,160 C95,163 105,163 112,160 C128,152 140,130 140,102 C136,118 128,128 118,130 C112,126 106,125 100,126 C94,125 88,126 82,130 C72,128 64,118 60,102 Z"
          fill={hair}
          opacity={beard === "stubble" ? 0.25 : 1}
        />
      )}
      {(beard === "beard" || beard === "moustache" || beard === "goatee") && (
        <path d="M84,131 C90,123 98,124 100,127.5 C102,124 110,123 116,131 C109,133 104,132 100,130 C96,132 91,133 84,131 Z" fill={hair} />
      )}
      {beard === "goatee" && <path d="M91,144 Q100,161 109,144 Q100,149 91,144 Z" fill={hair} />}

      {/* Mouth */}
      {expression === "grin" ? (
        <>
          <path d="M87,133 Q100,150 113,133 Z" fill="#6e2a2a" />
          <path d="M89,134 L111,134 L109,138.5 L91,138.5 Z" fill="#ffffff" />
          <path d="M94,144 Q100,146.5 106,144" stroke="#e07a7a" strokeWidth="2.6" strokeLinecap="round" />
        </>
      ) : female ? (
        <>
          <path d="M87.5,134 Q94,130 100,132.5 Q106,130 112.5,134 Q100,136 87.5,134 Z" fill={lipDark} />
          <path d={expression === "calm" ? "M89,134.5 Q100,141 111,134.5 Q100,137 89,134.5 Z" : "M87.5,134 Q100,146 112.5,134 Q100,138.5 87.5,134 Z"} fill={lip} />
          {expression !== "calm" && <path d="M86,132.5 Q100,140 114,132.5" stroke={lipDark} strokeWidth="1.5" fill="none" strokeLinecap="round" />}
        </>
      ) : (
        <>
          <path
            d={expression === "calm" ? "M91,136 Q100,138 109,136" : "M86.5,132.5 Q100,144 113.5,132.5"}
            stroke={beard === "beard" ? "#f4d6c6" : lipDark}
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
          {beard !== "beard" && expression !== "calm" && <path d="M95,141.5 Q100,143 105,141.5" stroke={lip} strokeWidth="2" strokeLinecap="round" opacity="0.7" />}
        </>
      )}

      {/* Hair in front */}
      {paths(h.front, hair, { opacity: h.opacity || 1 })}
      {h.bumps && h.bumps.map(([x, y]) => <circle key={x} cx={x} cy={y} r={h.r} fill={hair} />)}
      {paths(h.locks, hair)}
      {paths(h.shine, hairLight, { opacity: 0.85 })}
      {h.part && <path d={h.part} stroke={hairDark} strokeWidth="2" fill="none" strokeLinecap="round" />}
      {h.tie && <circle cx={h.tie[0]} cy={h.tie[1]} r="5.5" fill={shirt} />}
      {style === "bald" && <path d="M76,52 C86,42 100,40 112,42 C100,45 88,49 80,56 Z" fill="#ffffff" opacity="0.3" />}
      {h.braids &&
        [57, 143].map((x) =>
          [116, 130, 144, 158, 172].map((y, i) => (
            <ellipse key={`${x}-${y}`} cx={x + (x < 100 ? -2 : 2)} cy={y} rx={9.5 - i * 0.6} ry="8.5" fill={hair} stroke={hairDark} strokeWidth="1.3" />
          )),
        )}
      {h.braids && [55, 145].map((x) => <circle key={x} cx={x} cy="183" r="3.8" fill={shirt} />)}
      {covered && (
        <>
          <path d="M60,110 C56,54 80,32 100,32 C120,32 144,54 140,110 C136,66 120,46 100,46 C80,46 64,66 60,110 Z" fill={hairDark} opacity="0.5" />
          <path d="M68,42 C82,28 118,28 132,42 C118,36 82,36 68,42 Z" fill={hairLight} opacity="0.6" />
        </>
      )}
      {style === "turban" && (
        <>
          <path d="M54,82 C50,32 80,12 100,12 C120,12 150,32 146,82 C134,62 116,56 100,56 C84,56 66,62 54,82 Z" fill={hair} />
          <path d="M64,70 C78,42 116,32 138,52 C116,40 84,44 64,70 Z M60,52 C78,26 112,18 132,30 C110,26 82,32 60,52 Z" fill={hairDark} opacity="0.6" />
        </>
      )}

      {showEarrings && !covered && (
        <>
          <circle cx={earX} cy="119" r="3.4" fill="#e8c35a" />
          <circle cx={200 - earX} cy="119" r="3.4" fill="#e8c35a" />
        </>
      )}

      {/* Glasses */}
      {glasses === "round" && (
        <g stroke={line} strokeWidth="2.6" fill="none">
          <circle cx="81.5" cy="100" r="13.5" />
          <circle cx="118.5" cy="100" r="13.5" />
          <path d="M95,99 Q100,95.5 105,99 M68,98 L60,95 M132,98 L140,95" strokeLinecap="round" />
        </g>
      )}
      {glasses === "square" && (
        <g stroke={line} strokeWidth="2.6" fill="none">
          <rect x="67" y="90" width="29" height="21" rx="4" />
          <rect x="104" y="90" width="29" height="21" rx="4" />
          <path d="M96,97 L104,97 M67,96 L60,94 M133,96 L140,94" strokeLinecap="round" />
        </g>
      )}
      {glasses === "sun" && (
        <g>
          <path d="M66,91 L97,91 L95,106 C93,113 70,113 68,106 Z M103,91 L134,91 L132,106 C130,113 107,113 105,106 Z" fill="#1e1e24" />
          <path d="M97,94 L103,94 M66,93 L60,91 M134,93 L140,91" stroke="#1e1e24" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M75,95 L84,95 M108,95 L117,95" stroke="#ffffff" strokeWidth="1.8" opacity="0.45" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

// Illustrated character used instead of a photo. variant: "male" | "female".
// art: "detailed" (default) or "simple". Older saved looks used glasses/beard booleans; those still work.
export function Character({ art, glasses, beard, ...rest }) {
  const props = {
    ...rest,
    glasses: glasses === true ? "round" : glasses || "none",
    beard: beard === true ? "beard" : beard || "none",
  };
  if (art === "portrait") return <PortraitCharacter shirt="#e9a23b" hair="#3b2a20" skin="#f2c6a0" outfit="tshirt" expression="smile" {...defined(props)} />;
  for (const [k, map] of Object.entries(OLDER_STYLE_FALLBACK)) if (map[props[k]]) props[k] = map[props[k]];
  if (art === "simple") return <SimpleCharacter {...props} />;
  return (
    <DetailedCharacter
      shirt="#e9a23b"
      hair="#3b2a20"
      skin="#f2c6a0"
      outfit="tshirt"
      expression="smile"
      {...defined(props)}
    />
  );
}

function defined(props) {
  return Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined));
}

// Original flat-style cartoon bust (the "Simple" art style).
function SimpleCharacter({
  variant,
  shirt = "#e9a23b",
  hair = "#3b2a20",
  skin = "#f2c6a0",
  hairStyle,
  glasses = "none",
  beard = "none",
  outfit = "tshirt",
  expression = "smile",
  freckles = false,
  earrings,
}) {
  const skinShade = mix(skin, "#000000", 0.12);
  const female = variant === "female";
  const style = hairStyle || (female ? "long" : "short");
  const glassesStyle = glasses === true ? "round" : glasses || "none";
  const facial = beard === true ? "beard" : beard || "none";
  const showEarrings = earrings ?? female;
  const covered = style === "hijab";
  const shirtShade = mix(shirt, "#000000", 0.22);
  const ink = "#2b2b2b";

  // Curls sit on an arc around the top and sides of the head.
  const ring = (count, radius, from, to, cy = 84) =>
    Array.from({ length: count }, (_, i) => {
      const a = Math.PI * (from + (i / (count - 1)) * (to - from));
      return [100 + radius * Math.cos(a), cy + radius * Math.sin(a)];
    });

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
      {/* Hair behind the head */}
      {style === "long" && <path d="M56,92 C48,44 78,30 100,30 C124,30 154,44 144,96 C152,140 152,176 136,190 L64,190 C48,176 48,140 56,92 Z" fill={hair} />}
      {style === "wavy" && (
        <path d="M56,92 C44,50 76,30 100,30 C126,30 158,50 144,96 C156,112 140,124 152,140 C164,158 146,170 150,190 L50,190 C54,170 36,158 48,140 C60,124 44,112 56,92 Z" fill={hair} />
      )}
      {style === "bob" && <path d="M54,94 C48,46 78,32 100,32 C124,32 154,46 146,94 L150,130 C140,138 128,136 122,130 L78,130 C72,136 60,138 50,130 Z" fill={hair} />}
      {style === "ponytail" && (
        <path d="M128,52 C166,52 172,110 158,150 C154,162 142,160 144,148 C150,116 148,86 126,68 Z" fill={hair} />
      )}
      {style === "bun" && <circle cx="100" cy="36" r="19" fill={hair} />}
      {style === "curly" && ring(11, 44, 0.95, 2.05).map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="15" fill={hair} />)}
      {style === "afro" && (
        <>
          <circle cx="100" cy="74" r="58" fill={hair} />
          {ring(14, 56, 0.9, 2.1, 74).map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="12" fill={hair} />)}
        </>
      )}
      {style === "turban" && <ellipse cx="100" cy="52" rx="50" ry="34" fill={hair} />}

      {/* Body and outfit */}
      <path d="M26,205 C30,152 66,134 100,134 C134,134 170,152 174,205 Z" fill={shirt} />
      {outfit === "tshirt" && <path d="M84,136 L100,162 L116,136 Z" fill="#ffffff" opacity="0.9" />}
      {outfit === "shirt" && (
        <>
          <path d="M86,136 L100,200 L114,136 Z" fill="#ffffff" opacity="0.95" />
          <path d="M84,134 L100,152 L92,164 L78,140 Z M116,134 L100,152 L108,164 L122,140 Z" fill="#ffffff" stroke={shirtShade} strokeWidth="1.5" />
          <circle cx="100" cy="172" r="2" fill={shirtShade} />
          <circle cx="100" cy="186" r="2" fill={shirtShade} />
        </>
      )}
      {outfit === "blazer" && (
        <>
          <path d="M80,136 L100,200 L120,136 Z" fill="#ffffff" />
          <path d="M95,144 L105,144 L108,176 L100,190 L92,176 Z" fill={mix(shirt, "#000000", 0.55)} />
          <path d="M95,138 L105,138 L104,146 L96,146 Z" fill={mix(shirt, "#000000", 0.55)} />
          <path d="M78,136 L96,186 L84,168 L70,150 Z M122,136 L104,186 L116,168 L130,150 Z" fill={shirtShade} />
        </>
      )}
      {outfit === "hoodie" && (
        <>
          <path d="M60,146 C64,128 82,122 100,122 C118,122 136,128 140,146 C126,158 114,162 100,162 C86,162 74,158 60,146 Z" fill={shirtShade} />
          <path d="M90,158 L88,186 M110,158 L112,186" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {!covered && <rect x="88" y="110" width="24" height="30" rx="9" fill={skinShade} />}
      {outfit === "turtleneck" && !covered && <rect x="82" y="124" width="36" height="22" rx="10" fill={shirtShade} />}

      {/* Headscarf drapes over the shoulders and frames the face */}
      {covered && (
        <path d="M48,100 C42,38 76,24 100,24 C124,24 158,38 152,100 C154,128 162,150 172,176 C150,184 50,184 28,176 C38,150 46,128 48,100 Z" fill={hair} />
      )}

      {!covered && style !== "turban" && (
        <>
          <circle cx="62" cy="92" r="9" fill={skinShade} />
          <circle cx="138" cy="92" r="9" fill={skinShade} />
        </>
      )}
      {style === "turban" && (
        <>
          <circle cx="62" cy="96" r="8" fill={skinShade} />
          <circle cx="138" cy="96" r="8" fill={skinShade} />
        </>
      )}
      <ellipse cx="100" cy="88" rx="38" ry="43" fill={skin} />

      {/* Hair in front of the head */}
      {style === "long" || style === "wavy" ? (
        <path d="M60,92 C58,54 80,40 100,40 C122,40 142,54 140,90 C130,64 112,58 94,62 C80,66 68,76 60,92 Z" fill={hair} />
      ) : null}
      {style === "short" && (
        <path d="M60,88 C56,52 78,38 102,38 C128,38 146,54 140,88 C136,74 128,66 116,62 C104,70 86,72 70,70 C64,74 61,80 60,88 Z" fill={hair} />
      )}
      {style === "sidepart" && <path d="M60,92 C54,52 82,34 108,38 C132,42 146,60 140,88 C132,66 112,56 88,58 C76,60 64,72 60,92 Z" fill={hair} />}
      {style === "spiky" && (
        <path d="M60,88 L58,58 L70,64 L72,40 L86,54 L96,30 L106,52 L120,34 L124,58 L138,46 L140,88 C134,70 120,62 100,62 C80,62 66,70 60,88 Z" fill={hair} />
      )}
      {style === "buzz" && <path d="M62,84 C60,54 80,44 100,44 C120,44 140,54 138,84 C132,66 118,58 100,58 C82,58 68,66 62,84 Z" fill={hair} opacity="0.75" />}
      {style === "bob" && <path d="M60,92 C56,50 80,38 100,38 C120,38 144,50 140,92 C139,82 138,76 136,72 L64,72 C62,76 61,82 60,92 Z" fill={hair} />}
      {(style === "bun" || style === "curly" || style === "ponytail" || style === "braids" || style === "afro") && <path d={CAP} fill={hair} />}
      {style === "curly" && [[72, 62], [86, 55], [100, 53], [114, 55], [128, 62]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="10" fill={hair} />)}
      {style === "afro" && [[70, 64], [84, 56], [100, 54], [116, 56], [130, 64]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="11" fill={hair} />)}
      {style === "ponytail" && <circle cx="132" cy="58" r="5" fill={shirt} />}
      {style === "braids" && (
        <>
          <path d="M100,42 L100,60" stroke={mix(hair, "#000000", 0.3)} strokeWidth="2" />
          {[60, 140].map((x) =>
            [104, 118, 132, 146, 160].map((y, i) => (
              <ellipse key={`${x}-${y}`} cx={x + (x < 100 ? -2 : 2)} cy={y} rx={9 - i * 0.6} ry="8" fill={hair} stroke={mix(hair, "#000000", 0.3)} strokeWidth="1.2" />
            )),
          )}
          <circle cx="58" cy="170" r="3.5" fill={shirt} />
          <circle cx="142" cy="170" r="3.5" fill={shirt} />
        </>
      )}
      {covered && <path d="M60,98 C56,56 80,42 100,42 C120,42 144,56 140,98 C136,70 120,56 100,56 C80,56 64,70 60,98 Z" fill={mix(hair, "#000000", 0.12)} />}
      {style === "turban" && (
        <>
          <path d="M58,78 C58,40 80,26 100,26 C120,26 142,40 142,78 C130,62 116,58 100,58 C84,58 70,62 58,78 Z" fill={hair} />
          <path d="M70,70 C84,46 116,40 132,56 M66,60 C84,36 110,32 128,40" stroke={mix(hair, "#000000", 0.2)} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {showEarrings && !covered && (
        <>
          <circle cx="62" cy="104" r="3.5" fill={shirt} />
          <circle cx="138" cy="104" r="3.5" fill={shirt} />
        </>
      )}

      {/* Face */}
      <path d="M78,80 Q86,75 94,80" stroke={style === "bald" || style === "hijab" || style === "turban" ? mix(skin, "#000000", 0.55) : hair} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M106,80 Q114,75 122,80" stroke={style === "bald" || style === "hijab" || style === "turban" ? mix(skin, "#000000", 0.55) : hair} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="86" cy="92" r="4.5" fill={ink} />
      <circle cx="114" cy="92" r="4.5" fill={ink} />
      <circle cx="87.5" cy="90.5" r="1.4" fill="#fff" />
      <circle cx="115.5" cy="90.5" r="1.4" fill="#fff" />
      {female && (
        <>
          <path d="M80,88 L77,85" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M120,88 L123,85" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      <circle cx="76" cy="104" r="6" fill="#f08a8a" opacity="0.35" />
      <circle cx="124" cy="104" r="6" fill="#f08a8a" opacity="0.35" />
      {freckles &&
        [[72, 100], [78, 104], [74, 107], [128, 100], [122, 104], [126, 107]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill={mix(skin, "#000000", 0.35)} />
        ))}

      {/* Facial hair */}
      {(facial === "beard" || facial === "stubble") && (
        <path
          d="M63,94 C62,126 82,142 100,142 C118,142 138,126 137,94 C132,110 122,118 112,115 Q100,122 88,115 C78,118 68,110 63,94 Z"
          fill={hair}
          opacity={facial === "stubble" ? 0.28 : 1}
        />
      )}
      {(facial === "beard" || facial === "moustache" || facial === "goatee") && <path d="M84,109 Q100,100 116,109 Q100,106 84,109 Z" fill={hair} />}
      {facial === "goatee" && <path d="M90,121 Q100,138 110,121 Q100,127 90,121 Z" fill={hair} />}

      {/* Mouth */}
      {expression === "grin" ? (
        <>
          <path d="M86,109 Q100,128 114,109 Z" fill="#7a2e2e" />
          <path d="M88,110 L112,110 L110,114 L90,114 Z" fill="#ffffff" />
        </>
      ) : expression === "calm" ? (
        <path d="M92,113 Q100,117 108,113" stroke={facial === "beard" ? "#f4d6c6" : "#8a4b3a"} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M88,110 Q100,121 112,110" stroke={facial === "beard" ? "#f4d6c6" : "#8a4b3a"} strokeWidth="3" fill="none" strokeLinecap="round" />
      )}

      {/* Glasses */}
      {glassesStyle === "round" && (
        <g stroke={ink} strokeWidth="2.6" fill="none">
          <circle cx="86" cy="92" r="11" />
          <circle cx="114" cy="92" r="11" />
          <path d="M97,91 Q100,88 103,91 M75,90 L62,86 M125,90 L138,86" strokeLinecap="round" />
        </g>
      )}
      {glassesStyle === "square" && (
        <g stroke={ink} strokeWidth="2.6" fill="none">
          <rect x="74" y="83" width="22" height="17" rx="3" />
          <rect x="104" y="83" width="22" height="17" rx="3" />
          <path d="M96,90 L104,90 M74,89 L62,86 M126,89 L138,86" strokeLinecap="round" />
        </g>
      )}
      {glassesStyle === "sun" && (
        <g>
          <path d="M72,84 L98,84 L96,98 C94,104 76,104 74,98 Z M102,84 L128,84 L126,98 C124,104 106,104 104,98 Z" fill="#1e1e24" />
          <path d="M98,87 L102,87 M72,86 L62,84 M128,86 L138,84" stroke="#1e1e24" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M78,88 L84,88" stroke="#ffffff" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
          <path d="M108,88 L114,88" stroke="#ffffff" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

// Builds the token the Photo component turns into a Character.
const TOKEN_FIELDS = ["variant", "shirt", "skin", "hair", "hairStyle", "glasses", "beard", "outfit", "expression", "freckles", "earrings", "art", "eyes", "bg"];
export function characterToken(look) {
  const v = { ...look, glasses: look.glasses === true ? "round" : look.glasses || "", beard: look.beard === true ? "beard" : look.beard || "" };
  return ["character", ...TOKEN_FIELDS.map((k) => (typeof v[k] === "boolean" ? (v[k] ? "1" : "0") : v[k] ?? ""))].join(":");
}
function parseToken(src) {
  const parts = src.split(":").slice(1);
  const look = {};
  TOKEN_FIELDS.forEach((k, i) => {
    const raw = parts[i];
    if (raw === undefined || raw === "") return;
    if (k === "freckles" || k === "earrings") look[k] = raw === "1";
    // Tokens from before the extra options stored glasses/beard as 1/0.
    else if (k === "glasses") look[k] = raw === "1" ? "round" : raw === "0" ? "none" : raw;
    else if (k === "beard") look[k] = raw === "1" ? "beard" : raw === "0" ? "none" : raw;
    else look[k] = raw;
  });
  return look;
}

// Round photo; shows the person's initials when no photo was uploaded.
// A src made by characterToken() ("character:<male|female>:<shirt>:...") draws the illustrated character instead.
export function Photo({ src, name, size, placeholderBg = "#cbd5e1", style }) {
  const base = {
    width: size,
    height: size,
    borderRadius: "50%",
    overflow: "hidden",
    boxSizing: "border-box",
    ...style,
  };
  if (src && src.startsWith("avatar:")) {
    const { kind, shirt } = parseAvatarToken(src);
    return (
      <div style={{ ...base, background: placeholderBg }}>
        <SimpleAvatar kind={kind} shirt={shirt} />
      </div>
    );
  }
  if (src && src.startsWith("character:")) {
    const look = parseToken(src);
    return (
      <div style={{ ...base, background: avatarBackground(look.bg, placeholderBg) }}>
        <Character {...look} />
      </div>
    );
  }
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name || "Photo"} style={{ ...base, objectFit: "cover" }} />;
  }
  return (
    <div
      style={{
        ...base,
        background: placeholderBg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.32,
        fontWeight: 700,
        letterSpacing: 2,
      }}
    >
      {initials(name)}
    </div>
  );
}

export function BulletList({ items, style, itemStyle }) {
  if (!items.length) return null;
  return (
    <ul style={{ listStyle: "disc", paddingLeft: 18, margin: 0, ...style }}>
      {items.map((text, i) => (
        <li key={i} style={{ marginBottom: 3, ...itemStyle }}>
          {text}
        </li>
      ))}
    </ul>
  );
}

// One entry on a vertical timeline: a line with a dot at each end, content on the right.
export function TimelineItem({ color, children, gap = 14 }) {
  const dot = { width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 };
  return (
    <div style={{ display: "flex", gap, marginBottom: 16, breakInside: "avoid" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
        <span style={dot} />
        <span style={{ flex: 1, width: 2, background: color }} />
        <span style={dot} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

export function contactItems(p) {
  return [
    { icon: "phone", value: p.phone },
    { icon: "mail", value: p.email },
    { icon: "pin", value: p.address },
    { icon: "globe", value: p.website },
  ].filter((c) => c.value);
}

function toRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Blend colour a toward colour b by t (0 = a, 1 = b). Used for tints and shades.
export function mix(a, b, t) {
  const ca = toRgb(a);
  const cb = toRgb(b);
  return `#${ca.map((v, i) => Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}
