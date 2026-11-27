// Cloud Architect: sky-gradient header with cloud outlines, main column of experience and project case studies, sidebar with tiered tech stack and certification badges.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";
import Icon from "../../Icon";

const TITLES = { summary: "Profile", experience: "Experience", projects: "Case Studies", education: "Education" };
const SIDE_TITLES = { skills: "Technology Stack", certifications: "Certifications", languages: "Languages", interests: "Interests" };

const CLOUD = "M25 60 C10 60 2 50 4 40 C6 30 16 25 25 28 C28 14 42 6 56 10 C66 2 84 4 90 18 C104 16 116 28 112 42 C122 46 122 60 110 60 Z";

function tiers(skills) {
  const groups = [
    ["Expert", skills.filter((s) => (s.level ?? 0) >= 85)],
    ["Advanced", skills.filter((s) => (s.level ?? 0) >= 70 && (s.level ?? 0) < 85)],
    ["Working knowledge", skills.filter((s) => (s.level ?? 0) < 70)],
  ];
  return groups.filter((g) => g[1].length);
}

function abbr(text = "") {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 3).map((w) => w[0]).join("").toUpperCase();
  return (words[0] || "CERT").slice(0, 3).toUpperCase();
}

export default function CloudArchitect({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const text = "#1c2430";
  const muted = "#5e6878";
  const tint = mix(primary, "#ffffff", 0.93);
  const fs = 12;

  const main = pick(data, ["summary", "experience", "projects", "education"]);
  const side = pick(data, ["skills", "certifications", "languages", "interests"]);

  const Heading = ({ title, icon }) => (
    <h2 style={{ display: "flex", alignItems: "center", gap: 9, margin: "0 0 11px", fontSize: 14, fontWeight: 700, color: primary }}>
      <span style={{ width: 26, height: 26, borderRadius: 8, background: mix(primary, "#ffffff", 0.88), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={14} color={primary} />
      </span>
      {title}
      <span style={{ flex: 1, height: 2, borderRadius: 1, background: `linear-gradient(90deg, ${mix(accent, "#ffffff", 0.3)}, transparent)` }} />
    </h2>
  );

  const Bullets = ({ items }) =>
    items.length > 0 && (
      <ul style={{ listStyle: "disc", margin: "5px 0 0", paddingLeft: 17, fontSize: fs, lineHeight: 1.55, color: text }}>
        {items.map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
      </ul>
    );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience" || k === "education") {
      const items =
        k === "experience"
          ? data.experience.map((e) => ({ id: e.id, t: e.role, s: e.company, m: e.location, d: dateRange(e.start, e.end), b: lines(e.bullets) }))
          : data.education.map((e) => ({ id: e.id, t: e.degree, s: e.school, m: e.grade, d: dateRange(e.start, e.end), b: [] }));
      return items.map((e) => (
        <div key={e.id} style={{ marginBottom: 16, breakInside: "avoid" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{e.t}</div>
              {(e.s || e.m) && (
                <div style={{ fontSize: 11.5, marginTop: 1 }}>
                  {e.s && <span style={{ color: primary, fontWeight: 600 }}>{e.s}</span>}
                  {e.m && <span style={{ color: muted }}>{e.s ? " · " : ""}{e.m}</span>}
                </div>
              )}
            </div>
            {e.d && <span style={{ fontSize: 10.5, fontWeight: 600, color: primary, background: mix(primary, "#ffffff", 0.9), borderRadius: 999, padding: "2px 10px", whiteSpace: "nowrap" }}>{e.d}</span>}
          </div>
          <Bullets items={e.b} />
        </div>
      ));
    }
    if (k === "projects")
      return data.projects.map((e, i) => (
        <div key={e.id} style={{ marginBottom: 10, borderRadius: 10, background: tint, padding: "11px 14px 11px", borderLeft: `4px solid ${primary}`, breakInside: "avoid" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.5, color: mix(primary, "#ffffff", 0.25) }}>CASE {String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{e.name}</span>
          </div>
          {e.link && <div style={{ fontSize: 10.5, color: primary, marginTop: 2 }}>{e.link}</div>}
          {lines(e.description).length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 6, fontSize: fs, lineHeight: 1.55, color: text }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, color: "#ffffff", background: primary, borderRadius: 4, padding: "1px 6px", height: "fit-content", marginTop: 2 }}>OUTCOME</span>
              <div>{lines(e.description).map((l, j) => <div key={j}>{l}</div>)}</div>
            </div>
          )}
        </div>
      ));
    return null;
  };

  const sideBody = (k) => {
    if (k === "skills")
      return tiers(data.skills).map(([label, list]) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>
            <svg width="16" height="9" viewBox="0 0 124 64" aria-hidden="true"><path d={CLOUD} fill={accent} stroke={primary} strokeWidth="6" /></svg>
            {label}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {list.map((s) => (
              <span key={s.id} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 6, background: "#ffffff", color: text, border: `1px solid ${mix(primary, "#ffffff", 0.75)}` }}>{s.name}</span>
            ))}
          </div>
        </div>
      ));
    if (k === "certifications")
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(2, data.certifications.length)}, 1fr)`, gap: "10px 8px" }}>
          {data.certifications.map((c, i) => (
            <div key={c.id} style={{ textAlign: "center" }}>
              <svg width="58" height="64" viewBox="0 0 58 64" aria-hidden="true" style={{ display: "block", margin: "0 auto 4px" }}>
                <defs>
                  <linearGradient id={`cloud-badge-${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={primary} />
                    <stop offset="1" stopColor={mix(primary, accent, 0.55)} />
                  </linearGradient>
                </defs>
                <path d="M29 2 L54 16 L54 46 L29 62 L4 46 L4 16 Z" fill={`url(#cloud-badge-${i})`} />
                <path d="M29 7 L49.5 18.5 L49.5 43.5 L29 56.5 L8.5 43.5 L8.5 18.5 Z" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.2" />
                <text x="29" y={c.year ? 31 : 36} textAnchor="middle" fontSize="11" fontWeight="800" fill="#ffffff" fontFamily="inherit">{abbr(c.issuer || c.name)}</text>
                {c.year && <text x="29" y="44" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={mix(accent, "#ffffff", 0.4)} fontFamily="inherit">{c.year}</text>}
              </svg>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: text, lineHeight: 1.3 }}>{c.name}</div>
              {c.issuer && <div style={{ fontSize: 10, color: muted }}>{c.issuer}</div>}
            </div>
          ))}
        </div>
      );
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ marginBottom: 7, fontSize: fs, color: text }}>
          <div style={{ marginBottom: 3 }}>{l.name}</div>
          <div style={{ height: 5, borderRadius: 3, background: "#ffffff" }}>
            <div style={{ height: "100%", width: `${l.level ?? 0}%`, borderRadius: 3, background: `linear-gradient(90deg, ${primary}, ${mix(primary, accent, 0.6)})` }} />
          </div>
        </div>
      ));
    if (k === "interests")
      return <div style={{ fontSize: fs, color: text, lineHeight: 1.6 }}>{data.interests.map((i) => i.name).join(" · ")}</div>;
    return null;
  };

  const contacts = [
    ["mail", p.email],
    ["phone", p.phone],
    ["pin", p.address],
    ["globe", p.website],
  ].filter((c) => c[1]);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: text, background: "#ffffff", display: "flex", flexDirection: "column" })}>
      <header data-section="contact" style={{ position: "relative", overflow: "hidden", padding: "44px 44px 30px", background: `linear-gradient(120deg, ${mix(primary, "#000000", 0.15)}, ${primary} 55%, ${mix(primary, accent, 0.28)})`, color: "#ffffff" }}>
        <svg width="380" height="170" viewBox="0 0 380 170" aria-hidden="true" style={{ position: "absolute", right: -30, top: -10 }}>
          <g fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.5">
            <path d={CLOUD} transform="translate(170 20) scale(1.6)" />
            <path d={CLOUD} transform="translate(80 92) scale(0.9)" />
            <path d={CLOUD} transform="translate(300 110) scale(0.7)" />
          </g>
          <path d={CLOUD} transform="translate(190 34) scale(1.2)" fill="#ffffff" fillOpacity="0.08" />
        </svg>
        <div style={{ position: "relative" }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.1 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 14.5, fontWeight: 500, color: mix(accent, "#ffffff", 0.25), marginTop: 5 }}>{p.title}</div>}
          {contacts.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px", marginTop: 18, fontSize: 11 }}>
              {contacts.map(([icon, v]) => (
                <span key={icon} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name={icon} size={12} color={mix(accent, "#ffffff", 0.3)} />
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div style={{ flex: 1, display: "flex" }}>
        <main style={{ flex: 1, minWidth: 0, padding: "32px 28px 30px 44px" }}>
          {main.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 26 }}>
              <Heading title={TITLES[k]} icon={SECTION_META[k].icon} />
              {mainBody(k)}
            </section>
          ))}
        </main>
        {side.length > 0 && (
          <aside style={{ width: 232, flexShrink: 0, background: tint, padding: "32px 22px 30px" }}>
            {side.map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 26 }}>
                <Heading title={SIDE_TITLES[k]} icon={SECTION_META[k].icon} />
                {sideBody(k)}
              </section>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}
