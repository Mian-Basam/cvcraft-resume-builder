// Product Engineer: single column with a label rail on the left, outcome-first bullets and project results. ATS-friendly.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { DEFAULT_KEYS, fontOf, pick } from "../../kit";

const TITLES = {
  summary: "Profile",
  experience: "Experience",
  education: "Education",
  projects: "Project Outcomes",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};

export default function ProductEngineer({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const text = "#1f2328";
  const muted = "#5f6672";
  const rule = "#e3e6ea";
  const fs = 12.5;

  const Bullets = ({ items, mark = "▸" }) =>
    items.length > 0 && (
      <ul style={{ listStyle: "none", margin: "5px 0 0", padding: 0, fontSize: fs, lineHeight: 1.55, color: text }}>
        {items.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 9, marginBottom: 4 }}>
            <span style={{ color: primary, flexShrink: 0, fontSize: fs - 1, lineHeight: `${fs * 1.55}px` }}>{mark}</span>
            <span>{/\d/.test(b) ? <span style={{ background: `linear-gradient(transparent 58%, ${mix(accent, "#ffffff", 0.55)} 58%)` }}>{b}</span> : b}</span>
          </li>
        ))}
      </ul>
    );

  const Entry = ({ title, sub, date, meta, bullets, mark }) => (
    <div style={{ marginBottom: 15, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: text }}>{title}</div>
        {date && <div style={{ fontSize: 11, fontWeight: 700, color: muted, whiteSpace: "nowrap" }}>{date}</div>}
      </div>
      {(sub || meta) && (
        <div style={{ fontSize: 12, marginTop: 1 }}>
          {sub && <span style={{ color: primary, fontWeight: 700 }}>{sub}</span>}
          {meta && <span style={{ color: muted }}>{sub ? ", " : ""}{meta}</span>}
        </div>
      )}
      <Bullets items={bullets} mark={mark} />
    </div>
  );

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} title={e.role} sub={e.company} date={dateRange(e.start, e.end)} meta={e.location} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => (
        <Entry key={e.id} title={e.degree} sub={e.school} date={dateRange(e.start, e.end)} meta={e.grade} bullets={[]} />
      ));
    if (k === "projects")
      return data.projects.map((e) => (
        <Entry key={e.id} title={e.name} sub={e.link} bullets={lines(e.description)} mark="✓" />
      ));
    if (k === "skills")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px 18px", fontSize: fs, color: text }}>
          {data.skills.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, background: accent, flexShrink: 0 }} />
              {s.name}
            </div>
          ))}
        </div>
      );
    if (k === "languages") return <div style={{ fontSize: fs, color: text }}>{data.languages.map((l) => l.name).join(", ")}</div>;
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ fontSize: fs, color: text, marginBottom: 3 }}>
          <b>{c.name}</b>
          {[c.issuer, c.year].filter(Boolean).length > 0 && <span style={{ color: muted }}>, {[c.issuer, c.year].filter(Boolean).join(", ")}</span>}
        </div>
      ));
    if (k === "interests") return <div style={{ fontSize: fs, color: text }}>{data.interests.map((i) => i.name).join(", ")}</div>;
    return null;
  };

  const contacts = [p.email, p.phone, p.address, p.website].filter(Boolean);
  const keys = pick(data, DEFAULT_KEYS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "manrope"), color: text, background: "#ffffff" })}>
      <header data-section="contact" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, padding: "46px 52px 26px", background: mix(primary, "#ffffff", 0.93), borderBottom: `3px solid ${primary}`, position: "relative" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, letterSpacing: -1, lineHeight: 1.05, color: "#111418" }}>{p.name}</h1>
          {p.title && (
            <div style={{ display: "inline-block", marginTop: 10, fontSize: 14, fontWeight: 700, color: primary, padding: "2px 0", borderBottom: `3px solid ${accent}` }}>{p.title}</div>
          )}
        </div>
        {contacts.length > 0 && (
          <div style={{ textAlign: "right", fontSize: 11.5, lineHeight: 1.7, color: muted }}>
            {contacts.map((c) => <div key={c}>{c}</div>)}
          </div>
        )}
      </header>

      <div style={{ padding: "8px 52px 36px" }}>
        {keys.map((k, i) => (
          <section key={k} data-section={k} style={{ display: "flex", gap: 24, padding: "18px 0 8px", borderTop: i ? `1px solid ${rule}` : "none" }}>
            <h2 style={{ width: 128, flexShrink: 0, margin: 0, paddingTop: 2, fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: primary, lineHeight: 1.35 }}>
              <span style={{ display: "block", fontSize: 10.5, color: mix(primary, "#ffffff", 0.35), marginBottom: 3, letterSpacing: 1 }}>{String(i + 1).padStart(2, "0")}</span>
              {TITLES[k]}
            </h2>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: k === "experience" || k === "projects" || k === "education" ? 0 : 10 }}>{body(k)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
