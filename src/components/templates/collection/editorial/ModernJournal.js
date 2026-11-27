// The Modern Journal: single-column literary-journal page with a serif title, an italic introduction, ornament-ended section dividers, prose entries and a closing colophon.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, levelWord, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const LONG = ["experience", "education", "projects"];
const COLOPHON = ["skills", "languages", "certifications", "interests"];

export default function ModernJournal({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const ink = "#24211d";
  const body = "#45403a";
  const muted = "#8b8378";
  const hair = "#ddd5c8";
  const paper = "#fcfaf6";
  const display = fontStack("cormorant");
  const text = fontOf(theme, "baskerville");
  const contacts = contactItems(p);
  const smallCaps = { fontFamily: text, fontSize: 10.5, letterSpacing: 2.2, textTransform: "uppercase" };

  const Divider = ({ title }) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
      <span style={{ fontFamily: display, fontSize: 28, fontWeight: 500, fontStyle: "italic", lineHeight: 1, color: ink }}>{title}</span>
      <span style={{ flex: 1, height: 1, background: hair, alignSelf: "center", marginTop: 6 }} />
      <svg width="34" height="10" viewBox="0 0 34 10" style={{ alignSelf: "center", marginTop: 6, flexShrink: 0 }}>
        <circle cx="3" cy="5" r="1.6" fill={primary} />
        <path d="M17 0.5 L21.5 5 L17 9.5 L12.5 5 Z" fill="none" stroke={primary} strokeWidth="1.2" />
        <circle cx="17" cy="5" r="1.3" fill={primary} />
        <circle cx="31" cy="5" r="1.6" fill={primary} />
      </svg>
    </div>
  );

  // An entry: title and dates on one line, the source in italics, the bullets as a paragraph.
  const Entry = ({ title, source, date, note, items }) => (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
        <span style={{ fontFamily: display, fontSize: 20, fontWeight: 600, lineHeight: 1.2, color: ink }}>{title}</span>
        {date && <span style={{ ...smallCaps, color: primary, whiteSpace: "nowrap" }}>{date}</span>}
      </div>
      {(source || note) && (
        <div style={{ fontFamily: text, fontSize: 11.5, fontStyle: "italic", color: muted, marginTop: 2 }}>{[source, note].filter(Boolean).join(" — ")}</div>
      )}
      {items.length > 0 && (
        <p style={{ margin: "7px 0 0", fontFamily: text, fontSize: 11.2, lineHeight: 1.75, color: body, textAlign: "justify", hyphens: "auto" }}>
          {items.map((b, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: primary }}>{"  ·  "}</span>}
              {/[.!?]$/.test(b) ? b : `${b}.`}
            </span>
          ))}
        </p>
      )}
    </div>
  );

  const long = {
    experience: () =>
      data.experience.map((e) => (
        <Entry key={e.id} title={e.role} source={e.company} note={e.location} date={dateRange(e.start, e.end)} items={lines(e.bullets)} />
      )),
    education: () =>
      data.education.map((e) => <Entry key={e.id} title={e.degree} source={e.school} note={e.grade} date={dateRange(e.start, e.end)} items={[]} />),
    projects: () => data.projects.map((e) => <Entry key={e.id} title={e.name} source={e.link} date="" items={lines(e.description)} />),
  };

  const short = {
    skills: () => data.skills.map((s) => s.name).join(", "),
    languages: () => data.languages.map((l) => `${l.name} (${levelWord(l.level).toLowerCase()})`).join(", "),
    certifications: () => data.certifications.map((c) => [c.name, [c.issuer, c.year].filter(Boolean).join(", ")].filter(Boolean).join(" — ")).join("; "),
    interests: () => data.interests.map((i) => i.name).join(", "),
  };

  const colophon = pick(data, COLOPHON);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: text, color: ink, background: paper, padding: "58px 84px 50px", boxSizing: "border-box" })}>
      {/* Title page */}
      <header style={{ marginBottom: 26 }}>
        <div style={{ ...smallCaps, color: primary, display: "flex", alignItems: "center", gap: 12 }}>
          <span>{p.title || "Curriculum Vitae"}</span>
          <span style={{ width: 40, height: 1, background: primary }} />
        </div>
        <h1 style={{ margin: "14px 0 0", fontFamily: display, fontSize: 70, fontWeight: 500, lineHeight: 0.95, letterSpacing: -0.5, color: ink }}>{p.name}</h1>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ fontFamily: text, fontSize: 11, fontStyle: "italic", color: muted, marginTop: 16, display: "flex", flexWrap: "wrap", gap: "2px 0" }}>
            {contacts.map((c, i) => (
              <span key={c.icon}>
                {i > 0 && <span style={{ margin: "0 10px", color: hair }}>/</span>}
                {c.value}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Introduction */}
      {pick(data, ["summary"]).map((k) => (
        <section key={k} data-section={k} style={{ display: "grid", gridTemplateColumns: "118px 1fr", gap: 18, padding: "22px 0 24px", borderTop: `1px solid ${ink}`, borderBottom: `1px solid ${hair}`, marginBottom: 30 }}>
          <div style={{ ...smallCaps, fontSize: 10.5, color: muted, paddingTop: 6 }}>Introduction</div>
          <p style={{ margin: 0, fontFamily: display, fontSize: 21, fontStyle: "italic", lineHeight: 1.45, color: ink }}>{p.summary}</p>
        </section>
      ))}

      {pick(data, LONG).map((k) => (
        <section key={k} data-section={k} style={{ marginBottom: 22 }}>
          <Divider title={SECTION_META[k].title} />
          {long[k]()}
        </section>
      ))}

      {/* Colophon: the short lists as run-in lines */}
      {colophon.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <Divider title="Notes" />
          {colophon.map((k, i) => (
            <section key={k} data-section={k} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 16, padding: "9px 0", borderTop: i ? `1px solid ${mix(hair, paper, 0.3)}` : "none" }}>
              <span style={{ ...smallCaps, color: primary, paddingTop: 2 }}>{SECTION_META[k].title}</span>
              <span style={{ fontFamily: text, fontSize: 11.5, lineHeight: 1.6, color: body }}>{short[k]()}</span>
            </section>
          ))}
        </div>
      )}

    </div>
  );
}
