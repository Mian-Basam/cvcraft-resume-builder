// The Invisible Grid: every element snaps to three unseen columns (label, date, content) with only faint hairlines between sections. ATS-friendly.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { DEFAULT_KEYS, SECTION_META, fontOf, pick } from "../../kit";

const TEXT = "#202124";
const MUTED = "#80848a";
const GRID = { display: "grid", gridTemplateColumns: "112px 104px minmax(0, 1fr)" };

function levelWord(l = 0) {
  if (l >= 95) return "Native";
  if (l >= 80) return "Fluent";
  if (l >= 60) return "Advanced";
  if (l >= 40) return "Intermediate";
  return "Basic";
}

function entriesOf(k, data) {
  if (k === "experience")
    return data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }));
  if (k === "education")
    return data.education.map((e) => ({ id: e.id, title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: [] }));
  if (k === "projects") return data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
  if (k === "certifications") return data.certifications.map((e) => ({ id: e.id, title: e.name, sub: e.issuer, date: e.year, bullets: [] }));
  if (k === "languages") return data.languages.map((l) => ({ id: l.id, title: l.name, sub: "", date: levelWord(l.level), bullets: [], light: true }));
  return [];
}

export default function InvisibleGrid({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const fs = 11.5;
  const hair = mix(primary, "#ffffff", 0.86);
  const contact = contactItems(p);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);

  const content = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, color: TEXT }}>{p.summary}</p>;
    if (k === "skills" || k === "interests")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 20, rowGap: 3, fontSize: fs, lineHeight: 1.55, color: TEXT }}>
          {data[k].map((s) => (
            <span key={s.id}>{s.name}</span>
          ))}
        </div>
      );
    return null;
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "sora"), color: TEXT, padding: "68px 60px 56px" })}>
      <header style={{ ...GRID, marginBottom: 44 }}>
        <h1 style={{ gridColumn: "1 / 3", margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: -1, lineHeight: 1.08, color: TEXT, paddingRight: 16 }}>
          {words.length > 1 ? (
            <>
              {words[0]}
              <br />
              {words.slice(1).join(" ")}
            </>
          ) : (
            p.name
          )}
        </h1>
        <div style={{ paddingTop: 3 }}>
          {p.title && <div style={{ fontSize: 14, fontWeight: 600, color: primary, marginBottom: 10 }}>{p.title}</div>}
          {contact.length > 0 && (
            <div data-section="contact" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 20, rowGap: 3, fontSize: fs - 0.5, color: MUTED }}>
              {contact.map((c) => (
                <span key={c.icon} style={{ wordBreak: "break-word" }}>
                  {c.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      {pick(data, DEFAULT_KEYS).map((k) => {
        const rows = entriesOf(k, data);
        return (
          <section key={k} data-section={k} style={{ ...GRID, marginBottom: 22 }}>
            <h3 style={{ margin: 0, gridRow: `1 / span ${Math.max(rows.length, 1)}`, fontSize: fs, fontWeight: 600, color: primary, paddingTop: 12, lineHeight: 1.4 }}>
              {SECTION_META[k].title}
            </h3>
            {rows.length === 0 ? (
              <div style={{ gridColumn: "2 / 4", borderTop: `1px solid ${hair}`, paddingTop: 12 }}>
                <div style={{ ...GRID, gridTemplateColumns: "104px minmax(0, 1fr)" }}>
                  <span />
                  {content(k)}
                </div>
              </div>
            ) : (
              rows.map((e, i) => (
                <div key={e.id} style={{ gridColumn: "2 / 4", display: "grid", gridTemplateColumns: "104px minmax(0, 1fr)", borderTop: i ? "none" : `1px solid ${hair}`, paddingTop: i ? (e.light ? 3 : 14) : 12 }}>
                  <div style={{ fontSize: fs - 1, color: MUTED, paddingTop: e.light ? 1 : 2, fontVariantNumeric: "tabular-nums", paddingRight: 12 }}>{e.date}</div>
                  <div>
                    <div style={{ fontSize: e.light ? fs : fs + 1.5, fontWeight: e.light ? 400 : 600, color: TEXT, lineHeight: 1.4 }}>{e.title}</div>
                    {e.sub && <div style={{ fontSize: fs - 0.5, color: MUTED, marginTop: 1 }}>{e.sub}</div>}
                    {e.bullets.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        {e.bullets.map((b, j) => (
                          <div key={j} style={{ display: "grid", gridTemplateColumns: "14px 1fr", fontSize: fs, lineHeight: 1.55, color: TEXT, marginBottom: 2 }}>
                            <span style={{ color: MUTED }}>·</span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
