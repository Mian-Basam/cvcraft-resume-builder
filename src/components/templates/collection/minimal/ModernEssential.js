// The Modern Essential: prominent full-width name, then a compact left sidebar beside a clean sans-serif main column.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";

const TEXT = "#1f2328";
const MUTED = "#6b7178";
const SIDE = ["skills", "languages", "certifications", "interests"];
const MAIN = ["summary", "experience", "education", "projects"];
const CONTACT_LABEL = { phone: "Phone", mail: "Email", pin: "Location", globe: "Web" };

function levelWord(l = 0) {
  if (l >= 95) return "Native";
  if (l >= 80) return "Fluent";
  if (l >= 60) return "Advanced";
  if (l >= 40) return "Intermediate";
  return "Basic";
}

export default function ModernEssential({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const fs = 12;
  const contact = contactItems(p);
  const rule = mix(primary, "#ffffff", 0.82);

  const Heading = ({ k, title }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px", fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: TEXT }}>
      <span style={{ width: 6, height: 6, borderRadius: 1.5, background: primary }} />
      {title || SECTION_META[k].title}
    </h3>
  );

  const sideBody = (k) => {
    if (k === "skills" || k === "interests")
      return data[k].map((s) => (
        <div key={s.id} style={{ fontSize: fs - 0.5, lineHeight: 1.45, marginBottom: 4, color: TEXT }}>
          {s.name}
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: fs - 0.5, marginBottom: 4, color: TEXT }}>
          <span>{l.name}</span>
          <span style={{ color: MUTED }}>{levelWord(l.level)}</span>
        </div>
      ));
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 10, fontSize: fs - 0.5, lineHeight: 1.45 }}>
          <div style={{ fontWeight: 700, color: TEXT }}>{e.degree}</div>
          {e.school && <div style={{ color: TEXT }}>{e.school}</div>}
          {(e.start || e.end || e.grade) && <div style={{ color: MUTED }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>}
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 10, fontSize: fs - 0.5, lineHeight: 1.45 }}>
          <div style={{ fontWeight: 700, color: TEXT }}>{c.name}</div>
          {(c.issuer || c.year) && <div style={{ color: MUTED }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>}
        </div>
      ));
    return null;
  };

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, color: TEXT }}>{p.summary}</p>;
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(" · "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }))
        : k === "education"
        ? data.education.map((e) => ({ id: e.id, title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(" · "), date: dateRange(e.start, e.end), bullets: [] }))
        : data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
    return items.map((e, i) => (
      <div key={e.id} style={{ marginTop: i ? 20 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14 }}>
          <div style={{ fontSize: fs + 2.5, fontWeight: 700, color: TEXT, letterSpacing: -0.2 }}>{e.title}</div>
          {e.date && <div style={{ fontSize: fs - 0.5, fontWeight: 600, color: MUTED, whiteSpace: "nowrap" }}>{e.date}</div>}
        </div>
        {e.sub && <div style={{ fontSize: fs, fontWeight: 600, color: primary, marginTop: 2 }}>{e.sub}</div>}
        {e.bullets.length > 0 && (
          <ul style={{ margin: "7px 0 0", paddingLeft: 16, listStyle: "disc", fontSize: fs, lineHeight: 1.55, color: TEXT }}>
            {e.bullets.map((b, j) => (
              <li key={j} style={{ marginBottom: 3 }}>
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  const side = pick(data, SIDE);
  const main = pick(data, MAIN);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "manrope"), color: TEXT, padding: "64px 56px 56px" })}>
      <header style={{ marginBottom: 44, paddingTop: 8 }}>
        <h1 style={{ margin: 0, fontSize: 58, fontWeight: 800, letterSpacing: -2.2, lineHeight: 1.02, color: TEXT }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 17, fontWeight: 600, color: primary, marginTop: 8, letterSpacing: -0.2 }}>{p.title}</div>}
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "176px 1fr", columnGap: 44 }}>
        <aside style={{ borderRight: `1px solid ${rule}`, paddingRight: 22 }}>
          {contact.length > 0 && (
            <section data-section="contact" style={{ marginBottom: 28 }}>
              <Heading title="Contact" />
              {contact.map((c) => (
                <div key={c.icon} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: MUTED }}>{CONTACT_LABEL[c.icon]}</div>
                  <div style={{ fontSize: fs - 0.5, color: TEXT, wordBreak: "break-word", lineHeight: 1.4 }}>{c.value}</div>
                </div>
              ))}
            </section>
          )}
          {side.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 26 }}>
              <Heading k={k} />
              {sideBody(k)}
            </section>
          ))}
        </aside>
        <main>
          {main.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 34 }}>
              <Heading k={k} />
              {mainBody(k)}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
