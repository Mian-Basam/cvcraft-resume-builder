// Small stroke icon set used inside resume templates (24x24 grid).
const ICONS = {
  phone: {
    paths: [
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    ],
  },
  mail: { rects: [[2, 4, 20, 16, 2]], paths: ["m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"] },
  pin: { paths: ["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"], circles: [[12, 10, 3]] },
  globe: {
    circles: [[12, 12, 10]],
    paths: ["M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", "M2 12h20"],
  },
  user: { paths: ["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"], circles: [[12, 7, 4]] },
  contact: {
    paths: ["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20", "M9 10h7", "M9 6h7"],
  },
  education: { paths: ["M22 10 12 5 2 10l10 5 10-5z", "M6 12v5c3 3 9 3 12 0v-5", "M22 10v6"] },
  experience: {
    rects: [[2, 7, 20, 14, 2]],
    paths: ["M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"],
  },
  skills: {
    paths: [
      "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      "M9 18h6",
      "M10 22h4",
    ],
  },
  language: {
    paths: ["m5 8 6 6", "m4 14 6-6 2-3", "M2 5h12", "M7 2h1", "m22 22-5-10-5 10", "M14 18h6"],
  },
  heart: {
    paths: [
      "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
    ],
  },
  camera: {
    paths: [
      "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
    ],
    circles: [[12, 13, 3]],
  },
  plane: {
    paths: [
      "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
    ],
  },
  music: { paths: ["M9 18V5l12-2v13"], circles: [[6, 18, 3], [18, 16, 3]] },
  book: { paths: ["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"] },
  pen: { paths: ["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"] },
  code: { paths: ["m16 18 6-6-6-6", "m8 6-6 6 6 6"] },
  star: {
    paths: ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"],
  },
};

export default function Icon({ name, size = 16, color = "currentColor", strokeWidth = 2, style }) {
  const icon = ICONS[name] || ICONS.star;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {icon.rects?.map(([x, y, w, h, rx], i) => (
        <rect key={`r${i}`} x={x} y={y} width={w} height={h} rx={rx} />
      ))}
      {icon.circles?.map(([cx, cy, r], i) => (
        <circle key={`c${i}`} cx={cx} cy={cy} r={r} />
      ))}
      {icon.paths?.map((d, i) => (
        <path key={`p${i}`} d={d} />
      ))}
    </svg>
  );
}

// Picks an icon that matches an interest's name, falling back to a star.
export function interestIcon(name = "") {
  const n = name.toLowerCase();
  const rules = [
    [["photo", "camera"], "camera"],
    [["travel", "trip", "flight"], "plane"],
    [["music", "sing", "guitar", "piano"], "music"],
    [["read", "book", "writ"], "book"],
    [["design", "art", "draw", "paint"], "pen"],
    [["code", "program", "tech"], "code"],
    [["sport", "run", "fit", "volunteer", "yoga"], "heart"],
  ];
  const hit = rules.find(([words]) => words.some((w) => n.includes(w)));
  return hit ? hit[1] : "star";
}
