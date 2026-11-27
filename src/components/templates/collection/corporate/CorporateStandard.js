// The Corporate Standard: two columns — full-width name header over a double rule, a compact tinted sidebar with labelled contact details and skills, and a chronological main column. ATS-friendly.
import { pageStyle, lines, dateRange, mix } from "../../shared";
import { pick, fontOf } from "../../kit";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];
const TITLES = {
  summary: "Professional Summary",
  experience: "Professional Experience",
  education: "Education",
  projects: "Key Projects",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};

function levelWord(l = 0) {
  if (l >= 95) return "Native";
  if (l >= 80) return "Fluent";
  if (l >= 60) return "Professional";
  if (l >= 40) return "Conversational";
  return "Basic";
}

export default function CorporateStandard({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#1a2230";
  const text = "#2d3442";
  const muted = "#5f6878";
  const panel = mix(primary, "#ffffff", 0.93);
  const divider = mix(primary, "#ffffff", 0.78);

  const MainHeading = ({ children }) => (
    <h3 style={{ margin: "0 0 10px", paddingBottom: 5, borderBottom: `1px solid ${divider}`, fontSize: 12.5, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: primary }}>
      {children}
    </h3>
  );
  const SideHeading = ({ children }) => (
    <h3 style={{ margin: "0 0 9px", fontSize: 10.5, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: primary, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 10, height: 2, background: primary }} />
      {children}
    </h3>
  );

  const contactRows = [
    ["Phone", p.phone],
    ["Email", p.email],
    ["Location", p.address],
    ["Web", p.website],
  ].filter((r) => r[1]);

  const entry = (id, title, sub, date, extra, bullets) => (
    <div key={id} style={{ marginBottom: 14, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: ink }}>{title}</div>
        {date && <div style={{ fontSize: 10.5, fontWeight: 600, color: muted, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{date}</div>}
      </div>
      {sub && <div style={{ fontSize: 11.5, fontWeight: 600, color: primary, marginTop: 1 }}>{sub}</div>}
      {extra && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{extra}</div>}
      {bullets.length > 0 && (
        <ul style={{ listStyle: "disc", margin: "5px 0 0", paddingLeft: 16, fontSize: 11.5, lineHeight: 1.55, color: text }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: 2 }}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => entry(e.id, e.role, [e.company, e.location].filter(Boolean).join(", "), dateRange(e.start, e.end), "", lines(e.bullets)));
    if (k === "education") return data.education.map((e) => entry(e.id, e.degree, e.school, dateRange(e.start, e.end), e.grade, []));
    if (k === "projects") return data.projects.map((e) => entry(e.id, e.name, e.link, "", "", lines(e.description)));
    return null;
  };

  const sideBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ fontSize: 11, color: text, padding: "4px 0", borderBottom: `1px solid ${divider}` }}>{s.name}</div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11, padding: "3px 0" }}>
          <span style={{ color: ink, fontWeight: 600 }}>{l.name}</span>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "interests") return <div style={{ fontSize: 11, color: text, lineHeight: 1.6 }}>{data.interests.map((i) => i.name).join(", ")}</div>;
    return null;
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text, display: "flex", flexDirection: "column" })}>
      <header style={{ padding: "44px 48px 0" }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: ink, letterSpacing: -0.4 }}>{p.name}</h1>
        {p.title && <div style={{ marginTop: 5, fontSize: 13, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", color: primary }}>{p.title}</div>}
        <div style={{ marginTop: 18, height: 3, background: primary }} />
        <div style={{ marginTop: 2, height: 1, background: primary }} />
      </header>
      <div style={{ display: "flex", flex: 1, padding: "0 48px 0 48px" }}>
        <aside style={{ width: 196, flexShrink: 0, background: panel, padding: "22px 18px 30px", borderBottom: `3px solid ${accent}` }}>
          {contactRows.length > 0 && (
            <div data-section="contact" style={{ marginBottom: 22 }}>
              <SideHeading>Contact</SideHeading>
              {contactRows.map(([label, value]) => (
                <div key={label} style={{ marginBottom: 7 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: muted }}>{label}</div>
                  <div style={{ fontSize: 11, color: ink, wordBreak: "break-word", marginTop: 1 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 22 }}>
              <SideHeading>{TITLES[k]}</SideHeading>
              {sideBody(k)}
            </section>
          ))}
        </aside>
        <main style={{ flex: 1, minWidth: 0, padding: "22px 0 30px 28px" }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 20 }}>
              <MainHeading>{TITLES[k]}</MainHeading>
              {mainBody(k)}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
