// The Legal Professional: traditional single-column CV — centred small-caps serif name over a thick-and-thin double rule, centred serif section headings flanked by rules, practice areas in a two-column list, and dates set in an italic margin column. ATS-friendly.
import { pageStyle, lines, dateRange, contactItems } from "../../shared";
import { pick, fontOf, DEFAULT_KEYS } from "../../kit";
import { fontStack } from "@/lib/palettes";

const TITLES = {
  summary: "Professional Profile",
  experience: "Professional Experience",
  education: "Education",
  projects: "Representative Matters",
  skills: "Practice Areas",
  languages: "Languages",
  certifications: "Admissions & Credentials",
  interests: "Interests",
};

export default function LegalProfessional({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const serif = fontStack("baskerville");
  const ink = "#1b1b1f";
  const text = "#2c2c33";
  const muted = "#5f5f68";
  const rule = "#c9c9cf";
  const contacts = contactItems(p);
  const fs = 11.5;

  const Heading = ({ children }) => (
    <h3 style={{ margin: "0 0 12px", display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ flex: 1, height: 1, background: rule }} />
      <span style={{ fontFamily: serif, fontSize: 13.5, fontWeight: 700, color: primary, letterSpacing: 2.4, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: rule }} />
    </h3>
  );

  // Entry with dates in an italic margin column on the left.
  const Entry = ({ date, title, sub, extra, bullets = [] }) => (
    <div style={{ display: "grid", gridTemplateColumns: "104px 1fr", columnGap: 18, marginBottom: 12, breakInside: "avoid" }}>
      <div style={{ fontStyle: "italic", fontSize: 11, color: muted, paddingTop: 2, lineHeight: 1.4 }}>{date}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: serif, fontSize: 13, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{title}</div>
        {sub && <div style={{ fontSize: fs, fontStyle: "italic", color: primary, marginTop: 1 }}>{sub}</div>}
        {extra && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{extra}</div>}
        {bullets.length > 0 && (
          <ul style={{ listStyle: "none", margin: "5px 0 0", padding: 0 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: 9, fontSize: fs, lineHeight: 1.55, color: text, marginBottom: 2 }}>
                <span style={{ color: primary, flexShrink: 0 }}>–</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} date={dateRange(e.start, e.end)} title={e.role} sub={[e.company, e.location].filter(Boolean).join(", ")} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => <Entry key={e.id} date={dateRange(e.start, e.end)} title={e.degree} sub={e.school} extra={e.grade} />);
    if (k === "projects")
      return data.projects.map((e) => <Entry key={e.id} date="" title={e.name} sub={e.link} bullets={lines(e.description)} />);
    if (k === "certifications")
      return data.certifications.map((c) => <Entry key={c.id} date={c.year} title={c.name} sub={c.issuer} />);
    if (k === "skills")
      return (
        <ul style={{ listStyle: "none", margin: 0, padding: "0 0 0 122px", columns: 2, columnGap: 28 }}>
          {data.skills.map((s) => (
            <li key={s.id} style={{ display: "flex", gap: 9, fontSize: fs, lineHeight: 1.5, color: text, marginBottom: 4, breakInside: "avoid" }}>
              <span style={{ color: primary, flexShrink: 0, fontFamily: serif }}>§</span>
              <span>{s.name}</span>
            </li>
          ))}
        </ul>
      );
    if (k === "languages" || k === "interests")
      return (
        <div style={{ paddingLeft: 122, fontSize: fs, color: text, lineHeight: 1.6 }}>
          {data[k].map((x) => x.name).join(" · ")}
        </div>
      );
    return null;
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "baskerville"), color: text, padding: "54px 66px 46px" })}>
      <header style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: serif, fontSize: 30, fontWeight: 400, letterSpacing: 4, color: ink, fontVariant: "small-caps", lineHeight: 1.15 }}>{p.name}</h1>
        {p.title && <div style={{ marginTop: 6, fontFamily: serif, fontStyle: "italic", fontSize: 14, color: primary }}>{p.title}</div>}
        {contacts.length > 0 && (
          <div data-section="contact" style={{ marginTop: 10, display: "flex", justifyContent: "center", flexWrap: "wrap", fontSize: 11, color: text }}>
            {contacts.map((c, i) => (
              <span key={c.icon} style={{ whiteSpace: "nowrap" }}>
                {i > 0 && <span style={{ color: primary, margin: "0 10px" }}>◆</span>}
                {c.value}
              </span>
            ))}
          </div>
        )}
        <div style={{ marginTop: 16, height: 3, background: primary }} />
        <div style={{ marginTop: 2, height: 1, background: primary }} />
      </header>
      <div style={{ marginTop: 22 }}>
        {pick(data, DEFAULT_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 16 }}>
            <Heading>{TITLES[k]}</Heading>
            {body(k)}
          </section>
        ))}
      </div>
    </div>
  );
}
