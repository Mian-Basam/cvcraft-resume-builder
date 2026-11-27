// Three simple, flat avatars shown in place of a photo. They wear the template's accent colour.

export const AVATAR_CHOICES = [
  ["female", "Woman"],
  ["male", "Man"],
  ["neutral", "Neutral"],
];

const DRAWN = new Set(AVATAR_CHOICES.map(([id]) => id));

// The picture setting as one of: photo, initials, female, male, neutral.
// Older documents used a cartoon of the photo or a custom-built avatar; those map to the nearest choice.
export function normalizeAvatar(mode, look) {
  if (mode === "photo" || mode === "initials" || DRAWN.has(mode)) return mode;
  if (mode === "custom") return look?.variant === "male" ? "male" : "female";
  return "photo";
}

// The value templates pass to <Photo src> for a drawn avatar.
export function avatarToken(kind, shirt) {
  return DRAWN.has(kind) ? `avatar:${kind}:${shirt || ""}` : "";
}

export function parseAvatarToken(src) {
  const [, kind, shirt] = src.split(":");
  return { kind, shirt: shirt || "#64748b" };
}

const SKIN = "#f1c7a5";
const SKIN_SHADE = "#e3b08c";

export function SimpleAvatar({ kind, shirt }) {
  if (kind === "neutral") {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
        <circle cx="50" cy="40" r="17" fill="#ffffff" opacity="0.92" />
        <path d="M14 100 C16 78 32 66 50 66 C68 66 84 78 86 100 Z" fill="#ffffff" opacity="0.92" />
      </svg>
    );
  }

  const female = kind === "female";
  const hair = female ? "#3b2a20" : "#2a211c";
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
      {/* Long hair behind the head */}
      {female && <path d="M31 46 C28 24 40 17 50 17 C60 17 72 24 69 46 L72 72 C65 76 58 74 56 68 L44 68 C42 74 35 76 28 72 Z" fill={hair} />}
      {/* Shoulders and neck */}
      <path d="M14 100 C16 80 31 72 50 72 C69 72 84 80 86 100 Z" fill={shirt} />
      <rect x="43" y="56" width="14" height="18" rx="6" fill={SKIN_SHADE} />
      <path d="M43 72 L50 81 L57 72 Z" fill={SKIN_SHADE} />
      {/* Ears and head */}
      {!female && <circle cx="33" cy="46" r="3.6" fill={SKIN_SHADE} />}
      {!female && <circle cx="67" cy="46" r="3.6" fill={SKIN_SHADE} />}
      <ellipse cx="50" cy="44" rx="17" ry="19" fill={SKIN} />
      {/* Hair on top */}
      {female ? (
        <path d="M32 42 C32 26 41 21 50 21 C60 21 69 27 68 42 C61 38 55 32 51 27 C47 34 40 39 32 42 Z" fill={hair} />
      ) : (
        <path d="M33 41 C31 26 41 20 51 20 C62 20 70 27 67 41 C65 34 59 30 50 30 C42 30 36 34 33 41 Z" fill={hair} />
      )}
      {/* Face */}
      <circle cx="43.5" cy="46" r="1.9" fill="#2b2b2b" />
      <circle cx="56.5" cy="46" r="1.9" fill="#2b2b2b" />
      <circle cx="39.5" cy="52" r="3" fill="#e88f8f" opacity="0.25" />
      <circle cx="60.5" cy="52" r="3" fill="#e88f8f" opacity="0.25" />
      <path d="M45 53.5 Q50 57.5 55 53.5" stroke="#9a5b45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
