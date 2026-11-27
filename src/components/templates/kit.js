// Section kit: ordering rules and reusable section bodies that layouts style with options.
import Icon, { interestIcon } from "./Icon";
import { BulletList, contactItems, dateRange, lines } from "./shared";
import { DEFAULT_SECTION_ORDER } from "@/lib/sampleResume";
import { avatarToken } from "./simpleAvatar";
import { fontStack } from "@/lib/palettes";

export const SECTION_META = {
  summary: { title: "Profile", icon: "user" },
  experience: { title: "Experience", icon: "experience" },
  education: { title: "Education", icon: "education" },
  projects: { title: "Projects", icon: "code" },
  skills: { title: "Skills", icon: "skills" },
  languages: { title: "Languages", icon: "language" },
  certifications: { title: "Certifications", icon: "star" },
  interests: { title: "Interests", icon: "heart" },
};

// All section keys, for single-column layouts.
export const DEFAULT_KEYS = DEFAULT_SECTION_ORDER;

export function fontOf(theme, fallback) {
  return fontStack(theme.font || fallback);
}

// Starting point for the "My avatar" builder.
export const DEFAULT_LOOK = { art: "portrait", bg: "theme", variant: "female", skin: "#f2c6a0", hair: "#3b2a20", hairStyle: "wavy", glasses: "none", beard: "none", outfit: "knit", expression: "smile", freckles: false };

// The saved avatar merged over the defaults. Looks saved before the Portrait style existed have
// no art field and were drawn in the Detailed style, so they keep it.
export function lookWithDefaults(saved) {
  const legacy = saved?.variant && !saved.art ? { art: "detailed" } : {};
  return { ...DEFAULT_LOOK, ...legacy, ...saved };
}

// What the photo slot shows: a drawn avatar (in the theme's accent colour), the photo, or "" for initials.
export function photoOf(data, theme) {
  const drawn = avatarToken(theme.avatar, theme.accent);
  if (drawn) return drawn;
  return theme.showPhoto === false ? "" : data.personal.photo;
}

export function hasContent(key, data) {
  if (key === "summary") return Boolean(data.personal.summary?.trim());
  return (data[key] || []).length > 0;
}

// The sections a column shows, in the user's order, without hidden or empty ones.
export function pick(data, keys) {
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const hidden = data.hiddenSections || [];
  const ordered = [...order.filter((k) => keys.includes(k)), ...keys.filter((k) => !order.includes(k))];
  return ordered.filter((k) => !hidden.includes(k) && hasContent(k, data));
}

// Experience, education, projects and certifications share one entry shape.
function entriesOf(key, data) {
  switch (key) {
    case "experience":
      return data.experience.map((e) => ({
        id: e.id,
        title: e.role,
        sub: [e.company, e.location].filter(Boolean).join(", "),
        date: dateRange(e.start, e.end),
        bullets: lines(e.bullets),
      }));
    case "education":
      return data.education.map((e) => ({
        id: e.id,
        title: e.degree,
        sub: e.school,
        date: dateRange(e.start, e.end),
        extra: e.grade,
        bullets: [],
      }));
    case "projects":
      return data.projects.map((e) => ({
        id: e.id,
        title: e.name,
        sub: e.link,
        date: "",
        bullets: lines(e.description),
      }));
    case "certifications":
      return data.certifications.map((e) => ({
        id: e.id,
        title: e.name,
        sub: e.issuer,
        date: e.year,
        bullets: [],
      }));
    default:
      return [];
  }
}

/*
  Options (o) used by the bodies:
  primary, accent, light   colours
  text, muted              text colours
  fs                       base font size
  dateStyle                "right" | "below" | "left"
  skillStyle, langStyle    "list" | "tags" | "bars" | "dots" | "inline" | "grid"
  interestStyle            "list" | "tags" | "inline" | "icons"
  track                    colour of empty bar / dot (defaults to a grey)
*/
function Entry({ e, o }) {
  const fs = o.fs || 12;
  const title = <div style={{ fontSize: fs + 1.5, fontWeight: 700, color: o.titleColor || o.text }}>{e.title}</div>;
  const sub = e.sub && (
    <div style={{ fontSize: fs, color: o.subColor || o.primary, fontWeight: 600, marginTop: 1 }}>{e.sub}</div>
  );
  const extra = e.extra && <div style={{ fontSize: fs - 0.5, color: o.muted, marginTop: 1 }}>{e.extra}</div>;
  const bullets = (
    <BulletList items={e.bullets} style={{ fontSize: fs, lineHeight: 1.5, marginTop: 4, color: o.text }} />
  );
  const date = e.date && <span style={{ fontSize: fs - 0.5, color: o.muted, whiteSpace: "nowrap" }}>{e.date}</span>;

  if (o.dateStyle === "left") {
    return (
      <div style={{ display: "flex", gap: 18, marginBottom: 14, breakInside: "avoid" }}>
        <div style={{ width: 88, flexShrink: 0, paddingTop: 2 }}>{date}</div>
        <div style={{ flex: 1, minWidth: 0, borderLeft: `2px solid ${o.line || o.light}`, paddingLeft: 14 }}>
          {title}
          {sub}
          {extra}
          {bullets}
        </div>
      </div>
    );
  }
  if (o.dateStyle === "below") {
    return (
      <div style={{ marginBottom: 14, breakInside: "avoid" }}>
        {title}
        {sub}
        <div>{date}</div>
        {extra}
        {bullets}
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 14, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        {title}
        {date}
      </div>
      {sub}
      {extra}
      {bullets}
    </div>
  );
}

// Circular progress ring with the percentage in the middle.
export function Ring({ value = 0, size = 56, stroke = 5, color, track = "#e5e7eb", textColor = "#333" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${(c * Math.min(100, Math.max(0, value))) / 100} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.24} fontWeight="700" fill={textColor}>
        {value}%
      </text>
    </svg>
  );
}

function Rating({ items, style, o }) {
  const fs = o.fs || 12;
  const track = o.track || "#e5e7eb";
  if (style === "rings") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 6px" }}>
        {items.map((s) => (
          <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center" }}>
            <Ring value={s.level ?? 0} size={52} color={o.barColor || o.primary} track={track} textColor={o.text} />
            <span style={{ fontSize: fs - 1.5, lineHeight: 1.2 }}>{s.name}</span>
          </div>
        ))}
      </div>
    );
  }
  if (style === "segments") {
    return items.map((s) => {
      const filled = Math.round(((s.level ?? 0) / 100) * 10);
      return (
        <div key={s.id} style={{ marginBottom: 8, fontSize: fs }}>
          <div style={{ marginBottom: 3 }}>{s.name}</div>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} style={{ flex: 1, height: 6, borderRadius: 2, background: i < filled ? o.barColor || o.primary : track }} />
            ))}
          </div>
        </div>
      );
    });
  }
  if (style === "tags") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((s) => (
          <span
            key={s.id}
            style={{
              fontSize: fs - 0.5,
              padding: "3px 10px",
              borderRadius: 999,
              background: o.tagBg || o.light,
              color: o.tagColor || o.text,
              border: o.tagBorder ? `1px solid ${o.tagBorder}` : undefined,
            }}
          >
            {s.name}
          </span>
        ))}
      </div>
    );
  }
  if (style === "bars") {
    return items.map((s) => (
      <div key={s.id} style={{ marginBottom: 8, fontSize: fs }}>
        <div style={{ marginBottom: 3 }}>{s.name}</div>
        <div style={{ height: 5, borderRadius: 3, background: track, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${s.level ?? 0}%`, background: o.barColor || o.primary }} />
        </div>
      </div>
    ));
  }
  if (style === "dots") {
    return items.map((s) => {
      const filled = Math.round(((s.level ?? 0) / 100) * 5);
      return (
        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: fs, marginBottom: 7 }}>
          <span>{s.name}</span>
          <span style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                style={{ width: 8, height: 8, borderRadius: "50%", background: i < filled ? o.barColor || o.primary : track }}
              />
            ))}
          </span>
        </div>
      );
    });
  }
  if (style === "inline") {
    return <div style={{ fontSize: fs, lineHeight: 1.6 }}>{items.map((s) => s.name).join("  ·  ")}</div>;
  }
  if (style === "grid") {
    return (
      <BulletList
        items={items.map((s) => s.name)}
        style={{ fontSize: fs, columns: 2, columnGap: 24 }}
        itemStyle={{ marginBottom: 4 }}
      />
    );
  }
  return <BulletList items={items.map((s) => s.name)} style={{ fontSize: fs }} itemStyle={{ marginBottom: 4 }} />;
}

export function SectionBody({ k, data, o }) {
  const fs = o.fs || 12;
  if (k === "summary") {
    return <p style={{ fontSize: fs, lineHeight: 1.6, margin: 0, color: o.text }}>{data.personal.summary}</p>;
  }
  if (k === "skills") return <Rating items={data.skills} style={o.skillStyle} o={o} />;
  if (k === "languages") return <Rating items={data.languages} style={o.langStyle || "list"} o={o} />;
  if (k === "interests") {
    if (o.interestStyle === "icons") {
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
          {data.interests.map((i) => (
            <div key={i.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: fs - 1 }}>
              <Icon name={interestIcon(i.name)} size={24} color={o.primary} strokeWidth={1.6} />
              {i.name}
            </div>
          ))}
        </div>
      );
    }
    return <Rating items={data.interests} style={o.interestStyle || "inline"} o={o} />;
  }
  return entriesOf(k, data).map((e) => <Entry key={e.id} e={e} o={o} />);
}

// Renders a column of sections. Heading is a component receiving { title, icon, k }.
export function Sections({ keys, data, o, Heading, gap = 22 }) {
  return keys.map((k) => (
    <section key={k} data-section={k} style={{ marginBottom: gap }}>
      <Heading k={k} title={SECTION_META[k].title} icon={SECTION_META[k].icon} />
      <SectionBody k={k} data={data} o={o} />
    </section>
  ));
}

// Contact details as a stacked list or one inline row.
export function ContactList({ p, inline = false, fs = 12, iconColor, color, gap = 8, separator, alignRight = false }) {
  const items = contactItems(p);
  if (inline) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: separator ? 8 : 16, fontSize: fs, color }}>
        {items.map((c, i) => (
          <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {separator && i > 0 && <span style={{ opacity: 0.5, marginRight: 2 }}>{separator}</span>}
            {iconColor && <Icon name={c.icon} size={fs + 1} color={iconColor} />}
            {c.value}
          </span>
        ))}
      </div>
    );
  }
  return items.map((c) => (
    <div
      key={c.icon}
      style={{ display: "flex", alignItems: "center", justifyContent: alignRight ? "flex-end" : "flex-start", gap: 10, fontSize: fs, marginBottom: gap, color }}
    >
      <Icon name={c.icon} size={fs + 3} color={iconColor || color} />
      <span style={{ wordBreak: "break-word" }}>{c.value}</span>
    </div>
  ));
}

// A 0-100 skill or language level as a word, for designs that avoid bars and dots.
export function levelWord(level = 0) {
  if (level >= 95) return "Native";
  if (level >= 80) return "Fluent";
  if (level >= 65) return "Advanced";
  if (level >= 45) return "Intermediate";
  return "Basic";
}
