// The Quiet Luxury: single column on ivory paper, refined Cormorant name, understated italic headings and hairline details. ATS-friendly.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { DEFAULT_KEYS, SECTION_META, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const IVORY = "#faf7f0";
const CHARCOAL = "#2e2d2b";
// Short sections that pair up side by side when they follow each other.
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

export default function QuietLuxury({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const serif = fontStack("cormorant");
  const tone = mix(primary, CHARCOAL, 0.35);
  const hair = mix(primary, IVORY, 0.65);
  const muted = "#77726a";
  const fs = 11.5;
  const contact = contactItems(p);

  const smallCaps = { fontSize: 10.5, letterSpacing: 1.6, textTransform: "uppercase", color: muted, whiteSpace: "nowrap" };
  const italic = { fontFamily: serif, fontStyle: "italic", fontSize: fs + 3, color: tone, marginTop: 1 };

  // Each "/" sits before its item; the row is shifted left by one separator width and clipped,
  // so the separator that starts a wrapped line is hidden and no line ever ends with a dangling "/".
  const inlineList = (items) => (
    <div style={{ fontSize: fs, lineHeight: 1.8, color: CHARCOAL, overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap", marginLeft: -22 }}>
        {items.map((s) => (
          <span key={s.id} style={{ whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", width: 22, textAlign: "center", color: hair }}>/</span>
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );

  const body = (k, paired) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.7, color: CHARCOAL }}>{p.summary}</p>;
    if (k === "skills" || k === "languages" || k === "interests") return inlineList(data[k]);
    if (k === "certifications" && paired) {
      return data.certifications.map((c, i) => (
        <div key={c.id} style={{ marginTop: i ? 8 : 0 }}>
          <div style={{ fontSize: fs, fontWeight: 700, lineHeight: 1.5 }}>{c.name}</div>
          {(c.issuer || c.year) && <div style={{ ...italic, fontSize: fs + 2 }}>{[c.issuer, c.year].filter(Boolean).join(", ")}</div>}
        </div>
      ));
    }
    return entriesOf(k, data).map((e, i) => (
      <div key={e.id} style={{ marginTop: i ? 16 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 18 }}>
          <div style={{ fontSize: fs + 1.5, fontWeight: 700, color: CHARCOAL }}>{e.title}</div>
          {e.date && <div style={smallCaps}>{e.date}</div>}
        </div>
        {e.sub && <div style={italic}>{e.sub}</div>}
        {e.bullets.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0" }}>
            {e.bullets.map((b, j) => (
              <li key={j} style={{ position: "relative", paddingLeft: 16, fontSize: fs, lineHeight: 1.6, color: CHARCOAL, marginBottom: 1 }}>
                <span style={{ position: "absolute", left: 2, top: 8, width: 4, height: 4, borderRadius: "50%", background: hair }} />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  const heading = (k) => (
    <h3 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 20, color: tone, margin: "0 0 7px", letterSpacing: 0.2 }}>
      {SECTION_META[k].title}
    </h3>
  );

  // Consecutive short sections become rows of two (or three) quiet columns.
  const runs = [];
  pick(data, DEFAULT_KEYS).forEach((k) => {
    const last = runs[runs.length - 1];
    if (SHORT.includes(k) && last && SHORT.includes(last[0])) last.push(k);
    else runs.push([k]);
  });
  const rows = runs.flatMap((run) => {
    if (run.length <= 3) return [run];
    const out = [];
    for (let i = 0; i < run.length; i += 2) out.push(run.slice(i, i + 2));
    return out;
  });

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "baskerville"), color: CHARCOAL, background: IVORY, padding: "64px 88px 52px" })}>
      <header style={{ marginBottom: 38 }}>
        <h1 style={{ fontFamily: serif, fontSize: 50, fontWeight: 500, letterSpacing: 0.5, lineHeight: 1, margin: 0, color: CHARCOAL }}>{p.name}</h1>
        {p.title && <div style={{ ...smallCaps, color: tone, letterSpacing: 4, marginTop: 12, whiteSpace: "normal" }}>{p.title}</div>}
        <div style={{ width: 44, height: 1, background: primary, margin: "20px 0 14px" }} />
        {contact.length > 0 && (
          <div data-section="contact" style={{ display: "flex", flexWrap: "wrap", columnGap: 26, rowGap: 4, fontSize: fs - 0.5, color: muted }}>
            {contact.map((c) => (
              <span key={c.icon}>{c.value}</span>
            ))}
          </div>
        )}
      </header>
      {rows.map((row) =>
        row.length === 1 ? (
          <section key={row[0]} data-section={row[0]} style={{ marginBottom: 28 }}>
            {heading(row[0])}
            {body(row[0], false)}
          </section>
        ) : (
          <div key={row.join("-")} style={{ display: "grid", gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`, columnGap: 40, marginBottom: 28 }}>
            {row.map((k) => (
              <section key={k} data-section={k}>
                {heading(k)}
                {body(k, true)}
              </section>
            ))}
          </div>
        )
      )}
    </div>
  );
}
