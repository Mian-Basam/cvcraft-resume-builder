// The Monochrome Pro: black-and-white two columns with a solid black right rail, a heavy/hairline split name and one small palette accent.
import { contactItems, dateRange, lines, pageStyle } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";

const BLACK = "#0f0f0f";
const SIDE_W = 236;
const SIDE = ["skills", "languages", "certifications", "interests"];
const MAIN = ["summary", "experience", "education", "projects"];
const CONTACT_LABEL = { phone: "Phone", mail: "Email", pin: "Based in", globe: "Online" };

function skillWord(l = 0) {
  if (l >= 90) return "Expert";
  if (l >= 75) return "Advanced";
  if (l >= 50) return "Proficient";
  return "Familiar";
}
function langWord(l = 0) {
  if (l >= 95) return "Native";
  if (l >= 80) return "Fluent";
  if (l >= 60) return "Advanced";
  if (l >= 40) return "Intermediate";
  return "Basic";
}

export default function MonochromePro({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const fs = 11.5;
  const contact = contactItems(p);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const first = words[0] || "";
  const last = words.slice(1).join(" ");
  const longest = Math.max(first.length, last.length, 1);
  const nameSize = Math.min(48, Math.floor(450 / (longest * 0.8)));

  const MainHeading = ({ k }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 12px", fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: BLACK }}>
      {SECTION_META[k].title}
      <span style={{ flex: 1, height: 1, background: BLACK }} />
    </h3>
  );
  const SideHeading = ({ title }) => (
    <h3 style={{ margin: "0 0 12px", paddingBottom: 7, borderBottom: "1px solid rgba(255,255,255,0.28)", fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#fff" }}>
      {title}
    </h3>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, fontWeight: 400, color: "#222" }}>{p.summary}</p>;
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }))
        : k === "education"
        ? data.education.map((e) => ({ id: e.id, title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: [] }))
        : data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
    return items.map((e, i) => (
      <div key={e.id} style={{ marginTop: i ? 16 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontSize: fs + 2, fontWeight: 800, color: BLACK, letterSpacing: -0.1 }}>{e.title}</div>
          {e.date && <div style={{ fontSize: fs - 1, fontWeight: 300, letterSpacing: 1.5, textTransform: "uppercase", color: "#333", whiteSpace: "nowrap" }}>{e.date}</div>}
        </div>
        {e.sub && <div style={{ fontSize: fs, fontWeight: 300, color: "#333", marginTop: 2 }}>{e.sub}</div>}
        {e.bullets.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "7px 0 0" }}>
            {e.bullets.map((b, j) => (
              <li key={j} style={{ position: "relative", paddingLeft: 16, fontSize: fs, lineHeight: 1.55, color: "#222", marginBottom: 3 }}>
                <span style={{ position: "absolute", left: 0, top: 8, width: 6, height: 1.5, background: BLACK }} />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  const sideBody = (k) => {
    if (k === "skills" || k === "languages")
      return data[k].map((s) => (
        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: fs - 0.5, marginBottom: 6, lineHeight: 1.35 }}>
          <span style={{ fontWeight: 600 }}>{s.name}</span>
          <span style={{ fontWeight: 300, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>{k === "skills" ? skillWord(s.level) : langWord(s.level)}</span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ fontSize: fs - 0.5, marginBottom: 8, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 600 }}>{c.name}</div>
          {(c.issuer || c.year) && <div style={{ fontWeight: 300, color: "rgba(255,255,255,0.75)" }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>}
        </div>
      ));
    return data.interests.map((x) => (
      <div key={x.id} style={{ fontSize: fs - 0.5, fontWeight: 400, marginBottom: 5 }}>
        {x.name}
      </div>
    ));
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "montserrat"), color: BLACK })}>
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: SIDE_W, background: BLACK }} />
      <div style={{ position: "relative", display: "flex" }}>
        <main style={{ flex: 1, minWidth: 0, padding: "64px 40px 56px 54px" }}>
          <header style={{ marginBottom: 38 }}>
            <h1 style={{ margin: 0, fontSize: nameSize, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: 1, color: BLACK }}>
              <span style={{ display: "block", fontWeight: 900 }}>{first}</span>
              {last && <span style={{ display: "block", fontWeight: 200 }}>{last}</span>}
            </h1>
            <div style={{ width: 40, height: 4, background: primary, margin: "16px 0 12px" }} />
            {p.title && <div style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", color: "#333" }}>{p.title}</div>}
          </header>
          {pick(data, MAIN).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 28 }}>
              <MainHeading k={k} />
              {mainBody(k)}
            </section>
          ))}
        </main>
        <aside style={{ width: SIDE_W, flexShrink: 0, boxSizing: "border-box", padding: "72px 30px 56px", color: "#fff" }}>
          {contact.length > 0 && (
            <section data-section="contact" style={{ marginBottom: 30 }}>
              <SideHeading title="Contact" />
              {contact.map((c) => (
                <div key={c.icon} style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 10, fontWeight: 300, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>{CONTACT_LABEL[c.icon]}</div>
                  <div style={{ fontSize: fs - 0.5, fontWeight: 600, wordBreak: "break-word", lineHeight: 1.4 }}>{c.value}</div>
                </div>
              ))}
            </section>
          )}
          {pick(data, SIDE).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 28 }}>
              <SideHeading title={SECTION_META[k].title} />
              {sideBody(k)}
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
}
