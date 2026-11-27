// The Swiss Minimal: strict three-column grid, oversized black grotesque name, numbered sections between thin rules. ATS-friendly.
import { contactItems, dateRange, lines, pageStyle } from "../../shared";
import { DEFAULT_KEYS, SECTION_META, fontOf, pick } from "../../kit";

const INK = "#111111";
const COLS = "48px 136px 1fr";

function entriesOf(k, data) {
  if (k === "experience")
    return data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }));
  if (k === "education")
    return data.education.map((e) => ({ id: e.id, title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: [] }));
  if (k === "projects") return data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
  if (k === "certifications") return data.certifications.map((e) => ({ id: e.id, title: e.name, sub: e.issuer, date: e.year, bullets: [] }));
  return [];
}

function Row({ a, b, c, style }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: COLS, ...style }}>
      <div>{a}</div>
      <div style={{ paddingRight: 16 }}>{b}</div>
      <div style={{ minWidth: 0 }}>{c}</div>
    </div>
  );
}

export default function SwissMinimal({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const first = words[0] || "";
  const rest = words.slice(1).join(" ");
  const longest = Math.max(first.length, rest.length, 1);
  const nameSize = Math.min(76, Math.floor(674 / (longest * 0.62)));
  const contact = contactItems(p);
  const fs = 11.5;

  const body = (k) => {
    if (k === "summary") {
      return <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, fontWeight: 500, color: INK, letterSpacing: -0.1 }}>{p.summary}</p>;
    }
    if (k === "skills" || k === "languages" || k === "interests") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: 16, rowGap: 4, fontSize: fs + 0.5, color: INK, lineHeight: "18px" }}>
          {data[k].map((s) => (
            <span key={s.id}>{s.name}</span>
          ))}
        </div>
      );
    }
    return entriesOf(k, data).map((e, i) => (
      <div key={e.id} style={{ marginTop: i ? 14 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
          <div style={{ fontSize: fs + 2, fontWeight: 700, color: INK, letterSpacing: -0.2, lineHeight: "18px" }}>{e.title}</div>
          {e.date && (
            <div style={{ fontSize: fs - 0.5, color: "#555", fontVariantNumeric: "tabular-nums", letterSpacing: 0.2, whiteSpace: "nowrap" }}>{e.date}</div>
          )}
        </div>
        {e.sub && <div style={{ fontSize: fs, color: "#444", marginTop: 1 }}>{e.sub}</div>}
        {e.bullets.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0" }}>
            {e.bullets.map((b, j) => (
              <li key={j} style={{ display: "flex", gap: 9, fontSize: fs, lineHeight: 1.5, color: "#222", marginBottom: 2 }}>
                <span style={{ color: primary, fontWeight: 700 }}>–</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: INK, padding: "60px 60px 56px" })}>
      <header>
        <Row
          a={<div style={{ width: 14, height: 14, background: primary, marginTop: 4 }} />}
          c={<div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#555", paddingTop: 4 }}>Curriculum Vitae</div>}
          style={{ marginBottom: 20 }}
        />
        <h1 style={{ margin: 0, fontSize: nameSize, fontWeight: 800, letterSpacing: -nameSize * 0.045, lineHeight: 0.92, color: INK }}>
          {first}
          {rest && <br />}
          {rest}
          <span style={{ color: primary }}>.</span>
        </h1>
        <Row
          style={{ marginTop: 28, borderTop: `2px solid ${INK}`, paddingTop: 12 }}
          a={<span style={{ fontSize: 11, fontWeight: 700, color: primary }}>00</span>}
          b={p.title && <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{p.title}</div>}
          c={
            contact.length > 0 && (
              <div data-section="contact" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 16, rowGap: 4, fontSize: fs, color: "#222" }}>
                {contact.map((c) => (
                  <span key={c.icon} style={{ wordBreak: "break-word" }}>
                    {c.value}
                  </span>
                ))}
              </div>
            )
          }
        />
      </header>
      {pick(data, DEFAULT_KEYS).map((k, i) => (
        <section key={k} data-section={k} style={{ borderTop: `1px solid ${INK}`, paddingTop: 10, marginTop: 22 }}>
          <Row
            a={<span style={{ fontSize: 11, fontWeight: 700, color: primary, fontVariantNumeric: "tabular-nums", lineHeight: "18px" }}>{String(i + 1).padStart(2, "0")}</span>}
            b={<h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: INK, letterSpacing: -0.1, lineHeight: "18px" }}>{SECTION_META[k].title}</h3>}
            c={body(k)}
          />
        </section>
      ))}
    </div>
  );
}
