// The Finance Professional: two columns in navy and grey — a solid masthead, experience bullets laid out as a ledger with each achievement's key figure pulled into a right-aligned numbers column, and a grey qualifications / expertise sidebar. ATS-friendly.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf } from "../../kit";

const MAIN_KEYS = ["summary", "experience", "projects"];
const SIDE_KEYS = ["certifications", "education", "skills", "languages", "interests"];
const TITLES = {
  summary: "Professional Summary",
  experience: "Experience & Quantified Achievements",
  education: "Education",
  projects: "Key Engagements",
  skills: "Financial Expertise",
  languages: "Languages",
  certifications: "Qualifications",
  interests: "Interests",
};

const NUM = "[$€£]?\\d(?:[\\d,]*\\d)?(?:\\.\\d+)?";
// The headline figure of a bullet: "5 → 3" for "from 5 … to 3", else a %, currency, multiple or the first number.
function figureOf(t) {
  const ft = t.match(new RegExp(`from (${NUM})(?:\\s?%)?[^\\d]{0,14}? to (${NUM}(?:\\s?%)?)`, "i"));
  if (ft) return `${ft[1]} → ${ft[2]}`;
  const strong = t.match(new RegExp(`[$€£]\\d(?:[\\d,]*\\d)?(?:\\.\\d+)?(?:\\s?[kKmMbB]n?\\b)?|\\d(?:[\\d,]*\\d)?(?:\\.\\d+)?(?:\\s?%|x\\b|\\+)`));
  if (strong) return strong[0].replace(/\s/g, "");
  const any = t.match(new RegExp(`\\d(?:[\\d,]*\\d)?(?:\\.\\d+)?`));
  return any ? any[0] : "";
}

export default function FinanceProfessional({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#151c28";
  const text = "#2b323f";
  const muted = "#5e6675";
  const grey = mix("#eef0f3", primary, 0.03);
  const greyLine = "#d3d8df";
  const contacts = contactItems(p);

  const MainHeading = ({ children }) => (
    <h3 style={{ margin: "0 0 11px", fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: primary, paddingBottom: 5, borderBottom: `2px solid ${primary}` }}>
      {children}
    </h3>
  );
  const SideHeading = ({ children }) => (
    <h3 style={{ margin: "0 0 9px", fontSize: 10.5, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: ink, paddingBottom: 4, borderBottom: `1px solid ${greyLine}` }}>
      {children}
    </h3>
  );

  const Ledger = ({ items }) => (
    <div style={{ marginTop: 7 }}>
      {items.map((t, i) => {
        const f = figureOf(t);
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 72px", columnGap: 14, alignItems: "baseline", padding: "4px 0", borderBottom: i < items.length - 1 ? `1px dotted ${greyLine}` : "none" }}>
            <div style={{ fontSize: 11.5, lineHeight: 1.5, color: text }}>{t}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: f ? primary : greyLine, textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{f || "—"}</div>
          </div>
        );
      })}
    </div>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => {
        const date = dateRange(e.start, e.end);
        const b = lines(e.bullets);
        return (
          <div key={e.id} style={{ marginBottom: 16, breakInside: "avoid" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: ink }}>{e.role}</div>
              {date && <div style={{ fontSize: 10.5, fontWeight: 700, color: muted, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{date}</div>}
            </div>
            {(e.company || e.location) && (
              <div style={{ fontSize: 11.5, marginTop: 1 }}>
                <span style={{ fontWeight: 700, color: primary }}>{e.company}</span>
                {e.location && <span style={{ color: muted }}>{e.company ? ` · ${e.location}` : e.location}</span>}
              </div>
            )}
            {b.length > 0 && <Ledger items={b} />}
          </div>
        );
      });
    if (k === "projects")
      return data.projects.map((e) => (
        <div key={e.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: ink }}>{e.name}</div>
            {e.link && <div style={{ fontSize: 10.5, color: muted }}>{e.link}</div>}
          </div>
          {lines(e.description).length > 0 && <Ledger items={lines(e.description)} />}
        </div>
      ));
    return null;
  };

  const sideBody = (k) => {
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 9 }}>
          <span style={{ width: 3, background: primary, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{c.name}</div>
            <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
          </div>
        </div>
      ));
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 9 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{e.degree}</div>
          {e.school && <div style={{ fontSize: 11, color: text, marginTop: 1 }}>{e.school}</div>}
          <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 11.5, color: text, padding: "3px 0" }}>
          <span style={{ color: primary, fontWeight: 800, flexShrink: 0 }}>+</span>
          {s.name}
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ fontSize: 11.5, color: text, padding: "2px 0" }}>{l.name}</div>
      ));
    if (k === "interests") return <div style={{ fontSize: 11.5, color: text, lineHeight: 1.6 }}>{data.interests.map((i) => i.name).join(", ")}</div>;
    return null;
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text, display: "flex", flexDirection: "column" })}>
      <header style={{ background: primary, color: "#fff", padding: "34px 44px 30px 46px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 31, fontWeight: 800, letterSpacing: -0.3, color: "#fff", lineHeight: 1.1 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 6, fontSize: 12.5, fontWeight: 600, letterSpacing: 2.2, textTransform: "uppercase", color: accent }}>{p.title}</div>}
        </div>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ display: "grid", gridTemplateColumns: "auto auto", columnGap: 10, rowGap: 3, fontSize: 11, flexShrink: 0 }}>
            {[["Tel", p.phone], ["Email", p.email], ["City", p.address], ["Web", p.website]]
              .filter((r) => r[1])
              .map(([label, value]) => [
                <span key={label + "l"} style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: mix(primary, "#ffffff", 0.6), textAlign: "right", paddingTop: 1 }}>{label}</span>,
                <span key={label} style={{ color: "#fff", whiteSpace: "nowrap" }}>{value}</span>,
              ])}
          </div>
        )}
      </header>
      <div style={{ height: 5, background: "#9aa3b0" }} />
      <div style={{ display: "flex", flex: 1 }}>
        <main style={{ flex: 1, minWidth: 0, padding: "28px 30px 34px 46px" }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 20 }}>
              <MainHeading>{TITLES[k]}</MainHeading>
              {mainBody(k)}
            </section>
          ))}
        </main>
        <aside style={{ width: 236, flexShrink: 0, background: grey, padding: "28px 26px 34px 24px" }}>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 20 }}>
              <SideHeading>{TITLES[k]}</SideHeading>
              {sideBody(k)}
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
}
