// The Executive Signature: single column with a signature-style italic serif name over a fine rule, hanging serif section labels and navy accents.
import { BulletList, contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, SectionBody, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const KEYS = ["summary", "experience", "education", "projects", "skills", "languages", "certifications", "interests"];

export default function ExecutiveSignature({ data, theme }) {
  const p = data.personal;
  const navy = theme.primary;
  const accent = theme.accent;
  const ink = "#24272e";
  const muted = "#6b6f78";
  const rule = mix(navy, "#ffffff", 0.78);
  const serif = fontStack("cormorant");
  const sans = fontOf(theme, "lato");
  const opts = {
    primary: navy, text: ink, muted, titleColor: ink, subColor: navy, fs: 11.5, dateStyle: "right",
    skillStyle: "inline", langStyle: "inline", interestStyle: "inline",
  };
  const contacts = contactItems(p);

  const Entry = ({ title, sub, date, extra, bullets = [], last }) => (
    <div style={{ marginBottom: last ? 0 : 16, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontFamily: serif, fontSize: 18.5, fontWeight: 700, color: navy, lineHeight: 1.2 }}>{title}</div>
        {date && <div style={{ fontSize: 11, color: muted, whiteSpace: "nowrap", letterSpacing: 0.5 }}>{date}</div>}
      </div>
      {sub && <div style={{ fontFamily: serif, fontSize: 15, fontStyle: "italic", color: ink, marginTop: 1 }}>{sub}</div>}
      {extra && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{extra}</div>}
      <BulletList items={bullets} style={{ fontSize: 11.5, lineHeight: 1.6, marginTop: 6, color: ink }} />
    </div>
  );

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12, lineHeight: 1.75, color: ink }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, i, a) => (
        <Entry key={e.id} last={i === a.length - 1} title={e.role} sub={[e.company, e.location].filter(Boolean).join(", ")} date={dateRange(e.start, e.end)} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e, i, a) => <Entry key={e.id} last={i === a.length - 1} title={e.degree} sub={e.school} date={dateRange(e.start, e.end)} extra={e.grade} />);
    if (k === "projects") return data.projects.map((e, i, a) => <Entry key={e.id} last={i === a.length - 1} title={e.name} sub={e.link} bullets={lines(e.description)} />);
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 14, fontSize: 11.5, marginBottom: 6, color: ink }}>
          <span>
            <strong style={{ color: navy }}>{c.name}</strong>
            {c.issuer && <span style={{ color: muted }}>{`  —  ${c.issuer}`}</span>}
          </span>
          {c.year && <span style={{ color: muted, whiteSpace: "nowrap" }}>{c.year}</span>}
        </div>
      ));
    return <SectionBody k={k} data={data} o={opts} />;
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: sans, color: ink, padding: "70px 74px 56px", boxSizing: "border-box", display: "flex", flexDirection: "column" })}>
      {/* Signature block */}
      <header style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <h1 style={{ margin: 0, fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 64, lineHeight: 1, letterSpacing: -0.5, color: navy }}>{p.name}</h1>
        </div>
        <div style={{ position: "relative", height: 1, background: navy, margin: "10px 0 12px", opacity: 0.85 }}>
          <span style={{ position: "absolute", right: 0, top: -2, width: 5, height: 5, borderRadius: "50%", background: accent, boxShadow: `0 0 0 1px ${navy}` }} />
        </div>
        <div data-section="contact" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20, flexWrap: "wrap" }}>
          {p.title && <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: navy }}>{p.title}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 0", fontSize: 11, color: muted }}>
            {contacts.map((c, i) => (
              <span key={c.icon}>
                {i > 0 && <span style={{ margin: "0 9px", color: rule }}>|</span>}
                {c.value}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Hanging section labels */}
      {pick(data, KEYS).map((k) => (
        <section key={k} data-section={k} style={{ display: "flex", marginBottom: 30 }}>
          <h2 style={{ width: 150, flexShrink: 0, margin: 0, paddingTop: 3, paddingRight: 18, fontFamily: serif, fontSize: 15.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: navy, lineHeight: 1.25 }}>
            {SECTION_META[k].title}
          </h2>
          <div style={{ flex: 1, minWidth: 0, borderLeft: `1px solid ${rule}`, paddingLeft: 24, paddingTop: 2 }}>{body(k)}</div>
        </section>
      ))}

      <footer style={{ marginTop: "auto", paddingTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 24, color: navy, lineHeight: 1 }}>{p.name}</div>
          <div style={{ width: 150, height: 1, background: rule, marginTop: 6, marginLeft: "auto" }} />
        </div>
      </footer>
    </div>
  );
}
