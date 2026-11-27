// The Typography First: text-led single column with an oversized Playfair name, italic display headings, heavy sans roles and monospaced dates. ATS-friendly.
import { contactItems, dateRange, lines, pageStyle } from "../../shared";
import { DEFAULT_KEYS, SECTION_META, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const INK = "#161616";
const MUTED = "#6e6e6e";
const RUN_IN = ["skills", "languages", "certifications", "interests"];

function entriesOf(k, data) {
  if (k === "experience")
    return data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }));
  if (k === "education")
    return data.education.map((e) => ({ id: e.id, title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: [] }));
  if (k === "projects") return data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
  if (k === "certifications") return data.certifications.map((e) => ({ id: e.id, title: e.name, sub: e.issuer, date: e.year, bullets: [] }));
  return [];
}

export default function TypographyFirst({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const display = fontStack("playfair");
  const mono = fontStack("plexmono");
  const fs = 12;
  const contact = contactItems(p);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const first = words[0] || "";
  const last = words.slice(1).join(" ");
  const longest = Math.max(first.length, last.length, 1);
  const nameSize = Math.min(104, Math.floor(674 / (longest * 0.56)));

  const body = (k) => {
    if (k === "summary")
      return <p style={{ margin: 0, fontFamily: display, fontSize: 17, lineHeight: 1.5, color: INK }}>{p.summary}</p>;
    if (k === "skills" || k === "languages" || k === "interests")
      return (
        <div style={{ fontSize: fs + 1.5, lineHeight: 1.7, color: INK }}>
          {data[k].map((s, i) => (
            <span key={s.id} style={{ whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: i % 2 ? 400 : 700 }}>{s.name}</span>
              {i < data[k].length - 1 && <span style={{ fontFamily: display, fontStyle: "italic", color: primary, margin: "0 8px" }}>&amp;</span>}{" "}
            </span>
          ))}
        </div>
      );
    return entriesOf(k, data).map((e, i) => (
      <div key={e.id} style={{ marginTop: i ? 16 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: fs + 2.5, fontWeight: 900, color: INK, letterSpacing: -0.2 }}>{e.title}</span>
            {e.sub && <span style={{ fontFamily: display, fontStyle: "italic", fontSize: fs + 2.5, color: primary }}>{"  "}— {e.sub}</span>}
          </div>
          {e.date && <span style={{ fontFamily: mono, fontSize: fs - 1, color: MUTED, whiteSpace: "nowrap" }}>{e.date}</span>}
        </div>
        {e.bullets.length > 0 && (
          <div style={{ marginTop: 5 }}>
            {e.bullets.map((b, j) => (
              <p key={j} style={{ margin: "0 0 2px", fontSize: fs, lineHeight: 1.6, color: "#2a2a2a" }}>
                {b}
                {/[.!?]$/.test(b) ? "" : "."}
              </p>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const headStyle = { fontFamily: display, fontStyle: "italic", fontWeight: 400, fontSize: 26, lineHeight: 1.1, color: INK, letterSpacing: -0.3 };

  // Short sections read as one run-in sentence after their heading.
  const runIn = (k) => {
    if (k === "certifications")
      return (
        <div style={{ fontSize: fs + 1.5, lineHeight: 1.7, color: INK }}>
          {data.certifications.map((c, i) => (
            <span key={c.id}>
              {i > 0 && <span style={{ fontFamily: display, fontStyle: "italic", color: primary, margin: "0 8px" }}>&amp;</span>}
              <span style={{ fontWeight: 700 }}>{c.name}</span>
              {(c.issuer || c.year) && (
                <span style={{ fontFamily: display, fontStyle: "italic", color: MUTED }}>
                  {" "}({[c.issuer, c.year].filter(Boolean).join(", ")})
                </span>
              )}{" "}
            </span>
          ))}
        </div>
      );
    return body(k);
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "lato"), color: INK, padding: "52px 60px 52px" })}>
      <header style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <h1 style={{ margin: 0, fontFamily: display, fontSize: nameSize, lineHeight: 0.92, letterSpacing: -nameSize * 0.03, color: INK, minWidth: 0 }}>
            <span style={{ display: "block", fontWeight: 800 }}>{first}</span>
            {last && <span style={{ display: "block", fontWeight: 400, fontStyle: "italic", color: primary }}>{last}</span>}
          </h1>
          {contact.length > 0 && (
            <div data-section="contact" style={{ fontFamily: mono, fontSize: 10.5, lineHeight: 1.7, color: MUTED, textAlign: "right", flexShrink: 0, paddingBottom: 6 }}>
              {contact.map((c) => (
                <div key={c.icon}>{c.value}</div>
              ))}
            </div>
          )}
        </div>
        {p.title && <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase", color: INK, marginTop: 18 }}>{p.title}</div>}
      </header>
      {pick(data, DEFAULT_KEYS).map((k) =>
        RUN_IN.includes(k) ? (
          <section key={k} data-section={k} style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 14 }}>
            <h3 style={{ ...headStyle, margin: 0, flexShrink: 0 }}>
              {SECTION_META[k].title}
              <span style={{ color: primary }}>.</span>
            </h3>
            <div style={{ minWidth: 0, flex: 1 }}>{runIn(k)}</div>
          </section>
        ) : (
          <section key={k} data-section={k} style={{ marginBottom: 22 }}>
            <h3 style={{ ...headStyle, margin: "0 0 8px" }}>
              {SECTION_META[k].title}
              <span style={{ color: primary }}>.</span>
            </h3>
            {body(k)}
          </section>
        )
      )}
    </div>
  );
}
