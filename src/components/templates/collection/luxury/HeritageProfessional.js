// The Heritage Professional: ivory single column in traditional Baskerville, a ringed monogram crest, centred rule-flanked headings and subtle fine rules.
import { BulletList, contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";

const KEYS = ["summary", "experience", "education", "projects", "skills", "languages", "certifications", "interests"];

export default function HeritageProfessional({ data, theme }) {
  const p = data.personal;
  const green = theme.primary;
  const ivory = mix("#fbf8ef", theme.light || "#ffffff", 0.15);
  const ink = "#262622";
  const muted = "#6c6a60";
  const rule = mix(green, ivory, 0.7);
  const serif = fontOf(theme, "baskerville");
  const contacts = contactItems(p);
  const initials = (p.name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

  const Heading = ({ children }) => (
    <h2 style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 14px", fontSize: 12.5, fontWeight: 700, letterSpacing: 3.5, textTransform: "uppercase", color: green }}>
      <span style={{ flex: 1, height: 1, background: rule }} />
      {children}
      <span style={{ flex: 1, height: 1, background: rule }} />
    </h2>
  );

  const Entry = ({ title, sub, date, extra, bullets = [], last }) => (
    <div style={{ marginBottom: last ? 0 : 14, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: ink }}>{title}</div>
        {date && <div style={{ fontSize: 11, fontStyle: "italic", color: muted, whiteSpace: "nowrap" }}>{date}</div>}
      </div>
      {sub && <div style={{ fontSize: 11.5, fontStyle: "italic", color: green, marginTop: 2 }}>{sub}</div>}
      {extra && <div style={{ fontSize: 10.8, color: muted, marginTop: 2 }}>{extra}</div>}
      <BulletList items={bullets} style={{ fontSize: 11, lineHeight: 1.65, marginTop: 6, color: ink, listStyle: "square" }} />
    </div>
  );

  const stacked = (items) => (
    <div style={{ fontSize: 11.2, lineHeight: 1.75, color: ink, textAlign: "center" }}>
      {items.map((t, n) => (
        <div key={n}>{t}</div>
      ))}
    </div>
  );

  const body = (k) => {
    const last = (i, a) => i === a.length - 1;
    if (k === "summary") return <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.8, color: ink, textAlign: "center", padding: "0 30px" }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, i, a) => (
        <Entry key={e.id} last={last(i, a)} title={e.role} sub={[e.company, e.location].filter(Boolean).join(", ")} date={dateRange(e.start, e.end)} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e, i, a) => <Entry key={e.id} last={last(i, a)} title={e.degree} sub={e.school} date={dateRange(e.start, e.end)} extra={e.grade} />);
    if (k === "projects") return data.projects.map((e, i, a) => <Entry key={e.id} last={last(i, a)} title={e.name} sub={e.link} bullets={lines(e.description)} />);
    if (k === "certifications")
      return data.certifications.map((c, i, a) => <Entry key={c.id} last={last(i, a)} title={c.name} sub={c.issuer} date={c.year} />);
    return stacked(data[k].map((s) => s.name));
  };

  const ROW_KEYS = ["skills", "languages", "interests"];
  const keys = pick(data, KEYS).filter((k) => !ROW_KEYS.includes(k));
  const rowKeys = pick(data, ROW_KEYS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: serif, color: ink, background: ivory, padding: "44px 70px 36px", boxSizing: "border-box", display: "flex", flexDirection: "column" })}>
      {/* Fine border inset from the page edge */}
      <div style={{ position: "absolute", inset: 18, border: `1px solid ${rule}`, pointerEvents: "none" }} />

      <header style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 58, height: 58, margin: "0 auto 14px", borderRadius: "50%", border: `1px solid ${green}`, padding: 3, boxSizing: "border-box" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `1.5px solid ${green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontStyle: "italic", color: green, letterSpacing: 1, boxSizing: "border-box" }}>
            {initials}
          </div>
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 400, letterSpacing: 5, textTransform: "uppercase", color: ink }}>{p.name}</h1>
        {p.title && <div style={{ marginTop: 8, fontSize: 13, fontStyle: "italic", color: green }}>{p.title}</div>}
        <div style={{ margin: "16px auto 0", height: 3, borderTop: `1px solid ${green}`, borderBottom: `1px solid ${green}` }} />
        <div data-section="contact" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", fontSize: 10.8, color: muted, padding: "9px 0", borderBottom: `1px solid ${rule}` }}>
          {contacts.map((c, i) => (
            <span key={c.icon}>
              {i > 0 && <span style={{ margin: "0 12px", color: green }}>·</span>}
              {c.value}
            </span>
          ))}
        </div>
      </header>

      {keys.map((k) => (
        <section key={k} data-section={k} style={{ marginBottom: 20 }}>
          <Heading>{SECTION_META[k].title}</Heading>
          {body(k)}
        </section>
      ))}

      {rowKeys.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${rowKeys.length}, 1fr)`, gap: 26, marginBottom: 18 }}>
          {rowKeys.map((k) => (
            <section key={k} data-section={k}>
              <Heading>{SECTION_META[k].title}</Heading>
              {body(k)}
            </section>
          ))}
        </div>
      )}

      <footer style={{ marginTop: "auto", paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <span style={{ width: 60, height: 1, background: rule }} />
        <span style={{ width: 6, height: 6, border: `1px solid ${green}`, transform: "rotate(45deg)" }} />
        <span style={{ width: 60, height: 1, background: rule }} />
      </footer>
    </div>
  );
}
