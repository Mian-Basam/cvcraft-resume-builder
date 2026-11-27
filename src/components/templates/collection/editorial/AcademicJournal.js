// The Academic Journal: first page of a journal article - running head, centred title and affiliation, abstract with keywords, numbered sections in two balanced columns and citation-style references.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, levelWord, pick } from "../../kit";

const BODY = ["experience", "education", "projects", "skills", "certifications", "languages", "interests"];
const TITLES = { experience: "Professional Experience", projects: "Publications & Projects", certifications: "Certifications & Credentials", skills: "Core Competencies" };

// "Jordan Ellis" -> "Ellis, J."
function citeName(name = "") {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (w.length < 2) return w[0] || "";
  return `${w[w.length - 1]}, ${w.slice(0, -1).map((x) => `${x[0].toUpperCase()}.`).join(" ")}`;
}
// Skill level as a scholarly grade.
const grade = (l = 0) => (l >= 90 ? "Expert" : l >= 75 ? "Advanced" : l >= 50 ? "Proficient" : "Familiar");
const stop = (t) => (t && !/[.!?]$/.test(t) ? `${t}.` : t);

export default function AcademicJournal({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const ink = "#1a1a1a";
  const body = "#333333";
  const muted = "#6b6b6b";
  const rule = "#c9c9c9";
  const serif = fontOf(theme, "baskerville");
  const year = new Date().getFullYear();
  const author = citeName(p.name);
  const contacts = contactItems(p);
  const fs = 12;
  // Journal-style history line: first role, latest role, this edition.
  const starts = data.experience.map((e) => parseInt((e.start || "").match(/(19|20)\d\d/)?.[0], 10)).filter(Boolean);
  const history = starts.length
    ? [`Received ${Math.min(...starts)}`, Math.max(...starts) !== Math.min(...starts) && `Revised ${Math.max(...starts)}`, `Published ${year}`].filter(Boolean).join("; ")
    : "";

  const bodyKeys = pick(data, BODY);
  const n = (k) => bodyKeys.indexOf(k) + 1;
  const Heading = ({ k }) => (
    <h2 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: ink, breakAfter: "avoid" }}>
      <span style={{ color: primary, marginRight: 8 }}>{n(k)}.</span>
      {TITLES[k] || SECTION_META[k].title}
    </h2>
  );
  const para = { margin: 0, fontSize: fs, lineHeight: 1.7, color: body };

  const sections = {
    experience: () =>
      data.experience.map((e, i) => (
        <div key={e.id} style={{ marginBottom: 16, breakInside: "avoid" }}>
          <h3 style={{ margin: 0, fontSize: fs + 0.5, fontWeight: 700, fontStyle: "italic", color: ink }}>
            {n("experience")}.{i + 1} {e.role}
          </h3>
          <p style={{ ...para, color: muted, marginTop: 2 }}>{[e.company, e.location, dateRange(e.start, e.end)].filter(Boolean).join(", ")}</p>
          {lines(e.bullets).length > 0 && (
            <ul style={{ margin: "4px 0 0", paddingLeft: 16, listStyle: "disc" }}>
              {lines(e.bullets).map((b, j) => (
                <li key={j} style={{ ...para, marginBottom: 3 }}>{stop(b)}</li>
              ))}
            </ul>
          )}
        </div>
      )),
    education: () =>
      data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 10, breakInside: "avoid" }}>
          <p style={{ ...para, fontWeight: 700, color: ink }}>{e.degree}</p>
          <p style={para}>{[e.school, dateRange(e.start, e.end)].filter(Boolean).join(", ")}{e.grade ? `. ${e.grade}` : ""}</p>
        </div>
      )),
    projects: () =>
      data.projects.map((e, i) => (
        <p key={e.id} style={{ ...para, paddingLeft: 24, textIndent: -24, marginBottom: 7, breakInside: "avoid" }}>
          <span style={{ color: primary }}>[{i + 1}]</span>
          {"  "}
          {author && `${author} `}
          <span style={{ fontWeight: 700, color: ink }}>{stop(e.name)}</span> {lines(e.description).length > 0 && <i>{stop(lines(e.description).join("; "))}</i>}
          {e.link && ` Available at: ${e.link}`}
        </p>
      )),
    certifications: () =>
      data.certifications.map((c) => (
        <p key={c.id} style={{ ...para, paddingLeft: 24, textIndent: -24, marginBottom: 6, breakInside: "avoid" }}>
          {author && `${author} `}
          {c.year && `(${c.year}). `}
          <i>{stop(c.name)}</i> {stop(c.issuer)}
        </p>
      )),
    skills: () => (
      <div style={{ breakInside: "avoid" }}>
        <p style={{ ...para, fontSize: 10.5, marginBottom: 5 }}>
          <b style={{ color: ink }}>Table 1.</b> Skills and self-assessed proficiency.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.2, color: body }}>
          <thead>
            <tr style={{ borderTop: `1.5px solid ${ink}`, borderBottom: `1px solid ${ink}` }}>
              <th style={{ textAlign: "left", fontWeight: 700, padding: "4px 0", color: ink }}>Skill</th>
              <th style={{ textAlign: "left", fontWeight: 700, padding: "4px 0", color: ink }}>Proficiency</th>
              <th style={{ textAlign: "right", fontWeight: 700, padding: "4px 0", color: ink }}>Level</th>
            </tr>
          </thead>
          <tbody>
            {data.skills.map((sk, i) => (
              <tr key={sk.id} style={{ borderBottom: i === data.skills.length - 1 ? `1.5px solid ${ink}` : "none" }}>
                <td style={{ padding: "4px 8px 4px 0" }}>{sk.name}</td>
                <td style={{ padding: "4px 8px 4px 0", fontStyle: "italic" }}>{grade(sk.level)}</td>
                <td style={{ padding: "4px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{sk.level ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    languages: () => <p style={para}>{data.languages.map((l) => `${l.name} (${levelWord(l.level).toLowerCase()})`).join("; ")}.</p>,
    interests: () => <p style={para}>{data.interests.map((i) => i.name).join("; ")}.</p>,
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: serif, color: ink, background: "#fff", padding: "34px 58px 50px", boxSizing: "border-box", display: "flex", flexDirection: "column" })}>
      {/* Running head */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontStyle: "italic", color: muted, paddingBottom: 6, borderBottom: `1px solid ${ink}` }}>
        <span>Curriculum Vitae{p.title ? ` · ${p.title}` : ""}</span>
        <span>Vol. 1 ({year}) · p. 1</span>
      </div>
      <div style={{ height: 3, background: primary, marginTop: 2 }} />

      {/* Title block */}
      <header style={{ textAlign: "center", padding: "40px 30px 30px" }}>
        <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: primary, fontWeight: 700 }}>Professional Record</div>
        <h1 style={{ margin: "10px 0 0", fontSize: 36, fontWeight: 700, lineHeight: 1.15, color: ink }}>
          {p.name}
          {contacts.length > 0 && <sup style={{ fontSize: 18, color: primary, marginLeft: 2 }}>*</sup>}
        </h1>
        {p.title && <div style={{ fontSize: 15, fontStyle: "italic", color: body, marginTop: 8 }}>{p.title}{p.address ? `, ${p.address}` : ""}</div>}
        {history && <div style={{ fontSize: 10.5, fontStyle: "italic", color: muted, marginTop: 12 }}>{history}</div>}
      </header>

      {/* Abstract and keywords */}
      {pick(data, ["summary"]).length > 0 && (
        <div style={{ borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}`, padding: "22px 40px", background: mix(primary, "#ffffff", 0.95) }}>
          {pick(data, ["summary"]).map((k) => (
            <section key={k} data-section={k}>
              <p style={{ ...para, fontSize: 12.5, lineHeight: 1.7, textAlign: "justify" }}>
                <b style={{ color: ink }}>Abstract. </b>
                {p.summary}
              </p>
            </section>
          ))}
        </div>
      )}

      {/* Two-column body */}
      <div style={{ columnCount: 2, columnGap: 32, columnRule: `1px solid ${rule}`, marginTop: 30 }}>
        {bodyKeys.map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 28, breakInside: k === "experience" ? "auto" : "avoid" }}>
            <Heading k={k} />
            {sections[k]()}
          </section>
        ))}
      </div>

      {/* Correspondence footnote */}
      {contacts.length > 0 && (
        <div data-section="contact" style={{ marginTop: "auto", paddingTop: 18 }}>
          <div style={{ width: 180, height: 1, background: ink, marginBottom: 8 }} />
          <p style={{ ...para, fontSize: 10.5, lineHeight: 1.6, color: muted }}>
            <sup style={{ color: primary }}>*</sup> Corresponding author{p.name ? `: ${p.name}` : ""}.{" "}
            {contacts.map((c) => `${{ phone: "Tel.", mail: "E-mail", pin: "Address", globe: "Web" }[c.icon]}: ${c.value}`).join("; ")}.
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ position: "absolute", left: 58, right: 58, bottom: 22, display: "flex", justifyContent: "space-between", fontSize: 10, color: muted, borderTop: `1px solid ${rule}`, paddingTop: 6 }}>
        <span>© {year} {p.name}</span>
        <span>1</span>
      </div>
    </div>
  );
}
