// The Global Executive: two columns — a deep-coloured sidebar with a line-drawn globe, contact, languages with proficiency and cross-cultural expertise; the main column opens with a "global footprint" of every location worked in and tags each leadership role with its country/city.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf } from "../../kit";
import Icon from "../../Icon";

const MAIN_KEYS = ["summary", "experience", "projects", "education", "certifications"];
const SIDE_KEYS = ["languages", "skills", "interests"];
const TITLES = {
  summary: "Global Leadership Profile",
  experience: "International Leadership Roles",
  education: "Education",
  projects: "Global Initiatives",
  skills: "Cross-Cultural Expertise",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};

function levelWord(l = 0) {
  if (l >= 95) return "Native";
  if (l >= 80) return "Fluent";
  if (l >= 60) return "Professional working";
  if (l >= 40) return "Conversational";
  return "Elementary";
}

export default function GlobalExecutive({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#161d29";
  const text = "#2b3240";
  const muted = "#606979";
  const hair = "#dfe3e9";
  const side = mix(primary, "#000000", 0.12);
  const sideMuted = "rgba(255,255,255,0.68)";
  const contacts = contactItems(p);
  const places = [...new Set(data.experience.map((e) => (e.location || "").trim()).filter(Boolean))];

  const MainHeading = ({ children }) => (
    <h3 style={{ margin: "0 0 11px", display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", color: primary }}>
      {children}
      <span style={{ flex: 1, height: 1, background: hair }} />
    </h3>
  );
  const SideHeading = ({ children }) => (
    <h3 style={{ margin: "0 0 10px", fontSize: 10.5, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: accent }}>{children}</h3>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return (
        <>
          {places.length > 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 14, fontSize: 10.5 }}>
              <span style={{ fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: muted, marginRight: 4 }}>Footprint</span>
              {places.map((pl) => (
                <span key={pl} style={{ padding: "2px 9px", border: `1px solid ${mix(primary, "#ffffff", 0.6)}`, borderRadius: 999, color: ink }}>{pl}</span>
              ))}
            </div>
          )}
          {data.experience.map((e) => {
            const b = lines(e.bullets);
            const date = dateRange(e.start, e.end);
            return (
              <div key={e.id} style={{ marginBottom: 15, breakInside: "avoid" }}>
                {date && <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: muted }}>{date}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginTop: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: ink, lineHeight: 1.3 }}>
                    {e.role}
                    {e.company && <span style={{ fontWeight: 600, color: primary }}>{e.role ? `  ·  ${e.company}` : e.company}</span>}
                  </div>
                  {e.location && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: primary, background: mix(primary, "#ffffff", 0.9), padding: "2px 8px 2px 6px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0 }}>
                      <Icon name="pin" size={11} color={primary} />
                      {e.location}
                    </span>
                  )}
                </div>
                {b.length > 0 && (
                  <ul style={{ listStyle: "disc", margin: "5px 0 0", paddingLeft: 16, fontSize: 11.5, lineHeight: 1.55, color: text }}>
                    {b.map((t, i) => (
                      <li key={i} style={{ marginBottom: 2 }}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </>
      );
    if (k === "projects")
      return data.projects.map((e) => (
        <div key={e.id} style={{ marginBottom: 11 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: ink }}>
            {e.name}
            {e.link && <span style={{ fontWeight: 500, fontSize: 11, color: muted }}>{`  ·  ${e.link}`}</span>}
          </div>
          {lines(e.description).map((t, i) => (
            <div key={i} style={{ fontSize: 11.5, lineHeight: 1.55, color: text, marginTop: 2 }}>{t}</div>
          ))}
        </div>
      ));
    if (k === "education" || k === "certifications") {
      const rows =
        k === "education"
          ? data.education.map((e) => ({ id: e.id, a: e.degree, b: [e.school, e.grade].filter(Boolean).join(" · "), d: dateRange(e.start, e.end) }))
          : data.certifications.map((c) => ({ id: c.id, a: c.name, b: c.issuer, d: c.year }));
      return rows.map((r) => (
        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 7 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: ink }}>{r.a}</div>
            {r.b && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{r.b}</div>}
          </div>
          {r.d && <div style={{ fontSize: 10.5, fontWeight: 700, color: muted, whiteSpace: "nowrap" }}>{r.d}</div>}
        </div>
      ));
    }
    return null;
  };

  const sideBody = (k) => {
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ marginBottom: 9, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>{l.name}</div>
          <div style={{ fontSize: 10.5, color: sideMuted, marginTop: 1 }}>{levelWord(l.level)}</div>
        </div>
      ));
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ fontSize: 11.5, color: "#fff", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>{s.name}</div>
      ));
    if (k === "interests") return <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>{data.interests.map((i) => i.name).join(" · ")}</div>;
    return null;
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "manrope"), color: text, display: "flex" })}>
      <aside style={{ width: 236, flexShrink: 0, background: side, color: "#fff", padding: "44px 26px 36px", position: "relative", overflow: "hidden" }}>
        <svg width="210" height="210" viewBox="0 0 100 100" style={{ position: "absolute", right: -70, bottom: -60, opacity: 0.16 }} aria-hidden="true">
          <g fill="none" stroke={accent} strokeWidth="0.8">
            <circle cx="50" cy="50" r="48" />
            <ellipse cx="50" cy="50" rx="20" ry="48" />
            <ellipse cx="50" cy="50" rx="36" ry="48" />
            <line x1="50" y1="2" x2="50" y2="98" />
            <line x1="2" y1="50" x2="98" y2="50" />
            <path d="M8 28 Q50 36 92 28" />
            <path d="M8 72 Q50 64 92 72" />
          </g>
        </svg>
        <svg width="46" height="46" viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block", marginBottom: 22 }}>
          <g fill="none" stroke={accent} strokeWidth="5">
            <circle cx="50" cy="50" r="45" />
            <ellipse cx="50" cy="50" rx="19" ry="45" />
            <line x1="5" y1="50" x2="95" y2="50" />
            <path d="M12 28 Q50 37 88 28" />
            <path d="M12 72 Q50 63 88 72" />
          </g>
        </svg>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ marginBottom: 26, position: "relative" }}>
            <SideHeading>Contact</SideHeading>
            {contacts.map((c) => (
              <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11, marginBottom: 8, color: "rgba(255,255,255,0.92)" }}>
                <Icon name={c.icon} size={13} color={accent} />
                <span style={{ wordBreak: "break-word" }}>{c.value}</span>
              </div>
            ))}
          </div>
        )}
        {pick(data, SIDE_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 24, position: "relative" }}>
            <SideHeading>{TITLES[k]}</SideHeading>
            {sideBody(k)}
          </section>
        ))}
      </aside>
      <main style={{ flex: 1, minWidth: 0, padding: "44px 46px 36px 38px" }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: ink, letterSpacing: -0.5, lineHeight: 1.08 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 6, fontSize: 13.5, fontWeight: 700, color: primary, letterSpacing: 1.6, textTransform: "uppercase" }}>{p.title}</div>}
          <div style={{ display: "flex", marginTop: 14, height: 3 }}>
            <span style={{ width: 48, background: accent }} />
            <span style={{ width: 48, background: primary }} />
          </div>
        </header>
        {pick(data, MAIN_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 20 }}>
            <MainHeading>{TITLES[k]}</MainHeading>
            {mainBody(k)}
          </section>
        ))}
      </main>
    </div>
  );
}
