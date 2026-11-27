// The Leadership Ladder: two columns — career progression drawn as an ascending staircase of roles (latest role on the highest step), with leadership competencies and selected accomplishments in a ruled side column.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf } from "../../kit";

const MAIN_KEYS = ["summary", "experience", "projects"];
const SIDE_KEYS = ["skills", "education", "certifications", "languages", "interests"];
const TITLES = {
  summary: "Leadership Profile",
  experience: "Career Progression",
  education: "Education",
  projects: "Selected Accomplishments",
  skills: "Leadership Competencies",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};

export default function LeadershipLadder({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#17202d";
  const text = "#2c3341";
  const muted = "#636c7c";
  const hair = "#dde1e7";
  const tint = mix(primary, "#ffffff", 0.93);
  const STEP = 26;

  const Heading = ({ children, side }) => (
    <h3 style={{ margin: "0 0 12px", fontSize: side ? 11 : 12, fontWeight: 800, letterSpacing: side ? 1.2 : 1.8, textTransform: "uppercase", color: ink, display: "flex", alignItems: "flex-start", gap: 9, lineHeight: 1.3 }}>
      <svg width="14" height="12" viewBox="0 0 14 12" style={{ flexShrink: 0, marginTop: 1 }}>
        <rect x="0" y="8" width="4" height="4" fill={accent} />
        <rect x="5" y="4" width="4" height="8" fill={primary} opacity="0.55" />
        <rect x="10" y="0" width="4" height="12" fill={primary} />
      </svg>
      {children}
    </h3>
  );

  const ladder = () => {
    const jobs = data.experience;
    const n = Math.min(jobs.length, 5);
    return (
      <div>
        {jobs.map((e, i) => {
          const step = Math.max(0, n - 1 - Math.min(i, n - 1));
          const bullets = lines(e.bullets);
          const date = dateRange(e.start, e.end);
          return (
            <div key={e.id} style={{ marginLeft: step * STEP, position: "relative", borderLeft: `2px solid ${primary}`, borderTop: `2px solid ${primary}`, padding: "10px 0 14px 16px", breakInside: "avoid" }}>
              <span style={{ position: "absolute", left: -6, top: -6, width: 10, height: 10, background: i === 0 ? accent : "#fff", border: `2px solid ${primary}` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: ink, lineHeight: 1.3 }}>{e.role}</div>
                  {(e.company || e.location) && (
                    <div style={{ fontSize: 11.5, marginTop: 2 }}>
                      <span style={{ color: primary, fontWeight: 700 }}>{e.company}</span>
                      {e.location && <span style={{ color: muted }}>{e.company ? ` · ${e.location}` : e.location}</span>}
                    </div>
                  )}
                </div>
                {date && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", background: primary, padding: "3px 8px", whiteSpace: "nowrap", letterSpacing: 0.4 }}>{date}</span>
                )}
              </div>
              {bullets.length > 0 && (
                <ul style={{ listStyle: "disc", margin: "6px 0 0", paddingLeft: 16, fontSize: 11.5, lineHeight: 1.55, color: text }}>
                  {bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience") return ladder();
    if (k === "projects")
      return data.projects.map((e) => (
        <div key={e.id} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <span style={{ width: 3, background: accent, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: ink }}>{e.name}</div>
            {e.link && <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{e.link}</div>}
            {lines(e.description).map((t, i) => (
              <div key={i} style={{ fontSize: 11.5, lineHeight: 1.5, color: text, marginTop: 3 }}>{t}</div>
            ))}
          </div>
        </div>
      ));
    return null;
  };

  const sideBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11.5, color: text, marginBottom: 6 }}>
          <span style={{ width: 9, height: 9, border: `1.5px solid ${primary}`, background: tint, flexShrink: 0 }} />
          {s.name}
        </div>
      ));
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 9 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{e.degree}</div>
          {e.school && <div style={{ fontSize: 11, color: primary, fontWeight: 600, marginTop: 1 }}>{e.school}</div>}
          <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "languages") return <div style={{ fontSize: 11.5, color: text, lineHeight: 1.6 }}>{data.languages.map((l) => l.name).join(" · ")}</div>;
    if (k === "interests") return <div style={{ fontSize: 11.5, color: text, lineHeight: 1.6 }}>{data.interests.map((i) => i.name).join(" · ")}</div>;
    return null;
  };

  const contacts = contactItems(p);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text, padding: "46px 52px 40px" })}>
      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, paddingBottom: 18, borderBottom: `1px solid ${hair}`, marginBottom: 24 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: ink, letterSpacing: -0.6, lineHeight: 1.08 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 6, fontSize: 13.5, fontWeight: 700, color: primary, letterSpacing: 1.4, textTransform: "uppercase" }}>{p.title}</div>}
          {contacts.length > 0 && (
            <div data-section="contact" style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: 11, color: text }}>
              {contacts.map((c) => (
                <span key={c.icon} style={{ whiteSpace: "nowrap" }}>{c.value}</span>
              ))}
            </div>
          )}
        </div>
        <svg width="96" height="66" viewBox="0 0 96 66" style={{ flexShrink: 0 }} aria-hidden="true">
          <path d="M0 66 H24 V48 H46 V30 H68 V12 H96 V66 Z" fill={mix(primary, "#ffffff", 0.9)} />
          <path d="M0 64 H22 V46 H44 V28 H66 V10 H94" fill="none" stroke={primary} strokeWidth="3" />
          <rect x="72" y="0" width="18" height="6" fill={accent} />
        </svg>
      </header>
      <div style={{ display: "flex", gap: 30 }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 22 }}>
              <Heading>{TITLES[k]}</Heading>
              {mainBody(k)}
            </section>
          ))}
        </main>
        <aside style={{ width: 222, flexShrink: 0, borderLeft: `1px solid ${hair}`, paddingLeft: 22 }}>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 22 }}>
              <Heading side>{TITLES[k]}</Heading>
              {sideBody(k)}
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
}
