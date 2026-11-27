// The Airy Resume: one narrow, generously spaced column inside wide margins; dates float above each role and contact stays to a single quiet line. ATS-friendly.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { DEFAULT_KEYS, SECTION_META, fontOf, pick } from "../../kit";

const TEXT = "#2b2b2b";
const MUTED = "#8c8c8c";
// Short sections that line up as columns in one airy row when they follow each other.
const SHORT = ["skills", "languages", "certifications", "interests"];

function entriesOf(k, data) {
  if (k === "experience")
    return data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }));
  if (k === "education")
    return data.education.map((e) => ({ id: e.id, title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: [] }));
  if (k === "projects") return data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
  if (k === "certifications") return data.certifications.map((e) => ({ id: e.id, title: e.name, sub: e.issuer, date: e.year, bullets: [] }));
  return [];
}

export default function AiryResume({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const fs = 11.5;
  const soft = mix(primary, "#ffffff", 0.15);
  const contact = contactItems(p);

  const body = (k, column) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 1.5, lineHeight: 1.8, color: TEXT, fontWeight: 400 }}>{p.summary}</p>;
    if (column && k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ fontSize: fs, lineHeight: 1.6, marginBottom: 6 }}>
          <div style={{ color: "#1d1d1d", fontWeight: 500 }}>{c.name}</div>
          {(c.issuer || c.year) && <div style={{ color: MUTED }}>{[c.issuer, c.year].filter(Boolean).join(", ")}</div>}
        </div>
      ));
    if (column)
      return data[k].map((s) => (
        <div key={s.id} style={{ fontSize: fs, lineHeight: 1.6, marginBottom: 3, color: TEXT }}>
          {s.name}
        </div>
      ));
    if (k === "skills" || k === "languages" || k === "interests")
      return <div style={{ fontSize: fs + 0.5, lineHeight: 1.8, color: TEXT }}>{data[k].map((s) => s.name).join(",  ")}</div>;
    const items = entriesOf(k, data);
    const big = k === "experience";
    return items.map((e, i) => (
      <div key={e.id} style={{ marginTop: i ? (big ? 30 : 18) : 0 }}>
        {e.date && <div style={{ fontSize: fs - 1, letterSpacing: 1.8, textTransform: "uppercase", color: MUTED, marginBottom: 5, fontWeight: 500 }}>{e.date}</div>}
        <div style={{ fontSize: big ? fs + 4.5 : fs + 2.5, fontWeight: 500, color: "#1d1d1d", letterSpacing: -0.1, lineHeight: 1.3 }}>{e.title}</div>
        {e.sub && <div style={{ fontSize: fs, color: soft, marginTop: 3, fontWeight: 600 }}>{e.sub}</div>}
        {e.bullets.length > 0 && (
          <div style={{ marginTop: 9 }}>
            {e.bullets.map((b, j) => (
              <p key={j} style={{ margin: "0 0 5px", fontSize: fs, lineHeight: 1.7, color: TEXT, paddingLeft: 14, textIndent: -14 }}>
                <span style={{ display: "inline-block", width: 14, textIndent: 0, color: MUTED }}>–</span>
                {b}
              </p>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const heading = (k, column) => (
    <h3 style={{ margin: "0 0 14px", fontSize: 10.5, fontWeight: 700, letterSpacing: column ? 2.4 : 3.5, textTransform: "uppercase", color: primary }}>{SECTION_META[k].title}</h3>
  );

  const runs = [];
  pick(data, DEFAULT_KEYS).forEach((k) => {
    const last = runs[runs.length - 1];
    if (SHORT.includes(k) && last && SHORT.includes(last[0]) && last.length < 4) last.push(k);
    else runs.push([k]);
  });

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "raleway"), color: TEXT, padding: "76px 104px 48px" })}>
      <header style={{ marginBottom: 46 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 300, letterSpacing: 0.4, color: "#1a1a1a", lineHeight: 1.15 }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 14, fontWeight: 500, color: soft, marginTop: 8 }}>{p.title}</div>}
        {contact.length > 0 && (
          <div data-section="contact" style={{ marginTop: 18, fontSize: fs - 0.5, color: MUTED, lineHeight: 1.7 }}>
            {contact.map((c, i) => (
              <span key={c.icon} style={{ whiteSpace: "nowrap" }}>
                {i > 0 && <span style={{ margin: "0 10px", opacity: 0.6 }}>·</span>}
                {c.value}{" "}
              </span>
            ))}
          </div>
        )}
      </header>
      {runs.map((run) =>
        run.length === 1 ? (
          <section key={run[0]} data-section={run[0]} style={{ marginBottom: 32 }}>
            {heading(run[0])}
            {body(run[0], false)}
          </section>
        ) : (
          <div key={run.join("-")} style={{ display: "grid", gridTemplateColumns: `repeat(${run.length}, minmax(0, 1fr))`, columnGap: 22, marginBottom: 32 }}>
            {run.map((k) => (
              <section key={k} data-section={k}>
                {heading(k, true)}
                {body(k, true)}
              </section>
            ))}
          </div>
        )
      )}
    </div>
  );
}
