// The Boardroom CV: single column — a deep-coloured masthead carrying the serif name and the executive biography, then board & executive appointments with "strategic impact" notes, credentials, and a closing three-up row of competencies, languages and interests. ATS-friendly.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["experience", "projects", "education", "certifications"];
const MINOR_KEYS = ["skills", "languages", "interests"];
const TITLES = {
  summary: "Executive Biography",
  experience: "Board & Executive Appointments",
  education: "Education",
  projects: "Strategic Initiatives",
  skills: "Competencies",
  languages: "Languages",
  certifications: "Credentials",
  interests: "Interests",
};

export default function BoardroomCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const serif = fontStack("playfair");
  const ink = "#1a1f2a";
  const text = "#2e3441";
  const muted = "#646c7a";
  const hair = mix(primary, "#ffffff", 0.78);
  const showBio = pick(data, ["summary"]).length > 0;
  const contacts = contactItems(p);

  const Heading = ({ children, small }) => (
    <h3 style={{ margin: "0 0 12px", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontFamily: serif, fontSize: small ? 14.5 : 17, fontWeight: 700, color: primary, whiteSpace: "nowrap" }}>{children}</span>
      {!small && <span style={{ flex: 1, height: 1, background: hair }} />}
      {!small && <span style={{ width: 6, height: 6, background: accent, transform: "rotate(45deg)", flexShrink: 0 }} />}
    </h3>
  );

  const Row = ({ title, sub, date, children, id }) => (
    <div key={id} style={{ display: "grid", gridTemplateColumns: "1fr auto", columnGap: 18, marginBottom: 14, breakInside: "avoid" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: serif, fontSize: 14.5, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: muted, marginTop: 2, letterSpacing: 0.2 }}>{sub}</div>}
      </div>
      {date ? <div style={{ fontSize: 10.5, fontWeight: 700, color: primary, letterSpacing: 1.4, textTransform: "uppercase", whiteSpace: "nowrap", paddingTop: 3 }}>{date}</div> : <span />}
      {children && <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>{children}</div>}
    </div>
  );

  const List = ({ items }) => (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: "flex", gap: 10, fontSize: 11.5, lineHeight: 1.55, color: text, marginBottom: 2 }}>
          <span style={{ color: primary, flexShrink: 0 }}>—</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );

  const body = (k) => {
    if (k === "experience")
      return data.experience.map((e) => {
        const b = lines(e.bullets);
        return (
          <Row key={e.id} id={e.id} title={e.role} sub={[e.company, e.location].filter(Boolean).join(", ")} date={dateRange(e.start, e.end)}>
            {b.length > 0 && (
              <div style={{ marginTop: 7, paddingLeft: 14, borderLeft: `2px solid ${hair}` }}>
                <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: muted, marginBottom: 3 }}>Strategic impact</div>
                <List items={b} />
              </div>
            )}
          </Row>
        );
      });
    if (k === "projects")
      return data.projects.map((e) => (
        <Row key={e.id} id={e.id} title={e.name} sub={e.link}>
          {lines(e.description).length > 0 && (
            <div style={{ marginTop: 5 }}>
              <List items={lines(e.description)} />
            </div>
          )}
        </Row>
      ));
    if (k === "education")
      return data.education.map((e) => <Row key={e.id} id={e.id} title={e.degree} sub={[e.school, e.grade].filter(Boolean).join(" · ")} date={dateRange(e.start, e.end)} />);
    if (k === "certifications")
      return data.certifications.map((c) => <Row key={c.id} id={c.id} title={c.name} sub={c.issuer} date={c.year} />);
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ fontSize: 11.5, color: text, lineHeight: 1.45, marginBottom: 3 }}>{s.name}</div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ fontSize: 11.5, color: text, lineHeight: 1.45, marginBottom: 3 }}>{l.name}</div>
      ));
    if (k === "interests")
      return data.interests.map((i) => (
        <div key={i.id} style={{ fontSize: 11.5, color: text, lineHeight: 1.45, marginBottom: 3 }}>{i.name}</div>
      ));
    return null;
  };

  const minor = pick(data, MINOR_KEYS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text })}>
      <header style={{ background: primary, color: "#fff", padding: "46px 60px 34px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: serif, fontSize: 38, fontWeight: 700, lineHeight: 1.1, color: "#fff" }}>{p.name}</h1>
            {p.title && <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: accent }}>{p.title}</div>}
          </div>
          {contacts.length > 0 && (
            <div data-section="contact" style={{ textAlign: "right", fontSize: 11, lineHeight: 1.7, color: "rgba(255,255,255,0.86)", flexShrink: 0 }}>
              {contacts.map((c) => (
                <div key={c.icon} style={{ whiteSpace: "nowrap" }}>{c.value}</div>
              ))}
            </div>
          )}
        </div>
        {showBio && (
          <section data-section="summary" style={{ marginTop: 22, paddingTop: 16, borderTop: `1px solid ${mix(primary, accent, 0.45)}` }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: accent, marginBottom: 6 }}>{TITLES.summary}</div>
            <p style={{ margin: 0, fontFamily: serif, fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.94)" }}>{p.summary}</p>
          </section>
        )}
      </header>
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "30px 60px 40px" }}>
        {pick(data, MAIN_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 18 }}>
            <Heading>{TITLES[k]}</Heading>
            {body(k)}
          </section>
        ))}
        {minor.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${minor.length}, 1fr)`, columnGap: 28, borderTop: `1px solid ${hair}`, paddingTop: 16, marginTop: 4 }}>
            {minor.map((k) => (
              <section key={k} data-section={k}>
                <Heading small>{TITLES[k]}</Heading>
                {body(k)}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
