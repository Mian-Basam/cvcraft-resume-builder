// The Meme Professional: a clean single-column CV whose only jokes live in the section labels, a few asides and a footnote.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, fontOf, pick, levelWord } from "../../kit";

const KEYS = ["summary", "experience", "education", "projects", "skills", "languages", "certifications", "interests"];

// [playful label, plain label, optional aside]
const LABELS = {
  summary: ["The TL;DR", "Profile", ""],
  experience: ["Places that paid me", "Experience", "no coffee machines were harmed"],
  education: ["Where I learned the rules", "Education", ""],
  projects: ["Things I've shipped", "Projects", ""],
  skills: ["Stuff I'm good at", "Skills", "self-assessed, coworker-approved"],
  languages: ["Ways I say hello", "Languages", ""],
  certifications: ["Official proof I'm legit", "Certifications", ""],
  interests: ["When I'm offline", "Interests", "yes, that happens"],
};

// A light-hearted, honest description of a skill level.
function skillQuip(level = 0) {
  if (level >= 90) return "could teach a class on it";
  if (level >= 80) return "really, genuinely good";
  if (level >= 65) return "solid and dependable";
  if (level >= 45) return "getting there fast";
  return "currently googling it";
}

export default function MemeProfessional({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = mix(theme.dark || "#1b1b1b", primary, 0.15);
  const muted = mix(ink, "#ffffff", 0.42);
  const rule = mix(primary, "#ffffff", 0.82);
  const hi = mix(accent, "#ffffff", 0.35);
  const fs = 12;

  const entry = (key, title, sub, date, bullets, extra) => (
    <div key={key} style={{ marginBottom: 13, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: ink }}>{title}</span>
        {date && <span style={{ fontSize: 11, fontWeight: 700, color: primary, whiteSpace: "nowrap" }}>{date}</span>}
      </div>
      {sub && <div style={{ fontSize: 11.5, fontWeight: 600, color: muted, marginTop: 1 }}>{sub}</div>}
      {extra && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{extra}</div>}
      {bullets.map((b, i) => (
        <div key={i} style={{ display: "flex", gap: 8, fontSize: fs, lineHeight: 1.5, marginTop: 4, color: ink }}>
          <span style={{ color: primary, fontWeight: 800, flexShrink: 0 }}>→</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: ink }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) =>
        entry(e.id, e.role, [e.company, e.location].filter(Boolean).join(", "), dateRange(e.start, e.end), lines(e.bullets))
      );
    if (k === "education")
      return data.education.map((e) => entry(e.id, e.degree, e.school, dateRange(e.start, e.end), [], e.grade));
    if (k === "projects") return data.projects.map((e) => entry(e.id, e.name, e.link, "", lines(e.description)));
    if (k === "certifications")
      return data.certifications.map((c) => entry(c.id, c.name, c.issuer, c.year, []));
    if (k === "skills")
      return (
        <div>
          {data.skills.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 9, marginTop: i ? 6 : 0, fontSize: fs }}>
              <span style={{ width: 17, height: 17, borderRadius: 5, background: hi, color: ink, fontSize: 10.5, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</span>
              <b style={{ color: ink, whiteSpace: "nowrap" }}>{s.name}</b>
              <span style={{ flex: 1, minWidth: 16, borderBottom: `1.5px dotted ${rule}`, alignSelf: "flex-end", marginBottom: 4 }} />
              <span style={{ color: muted, fontStyle: "italic", whiteSpace: "nowrap" }}>{skillQuip(s.level)}</span>
            </div>
          ))}
        </div>
      );
    if (k === "languages")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px", fontSize: fs }}>
          {data.languages.map((l) => (
            <span key={l.id}>
              <b style={{ color: ink }}>{l.name}</b> <span style={{ color: muted }}>({levelWord(l.level)})</span>
            </span>
          ))}
        </div>
      );
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {data.interests.map((it) => (
          <span key={it.id} style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 11px", borderRadius: 999, border: `1.5px solid ${rule}`, color: ink }}>
            {it.name}
          </span>
        ))}
      </div>
    );
  };

  const keys = pick(data, KEYS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "nunito"), color: ink, padding: "40px 58px 60px", boxSizing: "border-box" })}>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 8, background: primary }} />

      <header style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, color: ink, background: mix(primary, "#ffffff", 0.92), padding: "4px 12px", borderRadius: 999 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22a559" }} />
            Status: open to opportunities (and snacks)
          </span>
          <span style={{ fontSize: 11, color: muted, fontStyle: "italic" }}>Page 1 of 1 — we kept it short</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 46, lineHeight: 1.05, fontWeight: 900, letterSpacing: -1, color: ink }}>{p.name}</h1>
        {p.title && (
          <div style={{ marginTop: 6, fontSize: 19, fontWeight: 700, color: primary }}>
            <span style={{ background: `linear-gradient(transparent 60%, ${hi} 60%, ${hi} 94%, transparent 94%)`, padding: "0 3px", margin: "0 -3px" }}>{p.title}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: muted, fontStyle: "italic", marginLeft: 10 }}>(it's a real job, ask my mum)</span>
          </div>
        )}
        <div data-section="contact" style={{ marginTop: 14 }}>
          <ContactList p={p} inline fs={11.5} iconColor={primary} color={ink} />
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, fontSize: 10.5, fontWeight: 700, color: muted, letterSpacing: 0.5 }}>
          <span style={{ whiteSpace: "nowrap" }}>LOADING PERSONALITY…</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: rule, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(90deg, ${primary} 70%, ${mix(primary, accent, 0.7)})` }} />
          </div>
          <span style={{ color: primary }}>100%</span>
        </div>
      </header>

      {keys.map((k) => (
        <section key={k} data-section={k} style={{ display: "flex", gap: 26, padding: "12px 0", borderTop: `1.5px dashed ${rule}` }}>
          <div style={{ width: 186, flexShrink: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 900, lineHeight: 1.2, color: primary }}>{LABELS[k][0]}</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: muted, marginTop: 4 }}>{LABELS[k][1]}</div>
            {LABELS[k][2] && <div style={{ fontSize: 10.5, fontStyle: "italic", color: muted, marginTop: 5, lineHeight: 1.35 }}>({LABELS[k][2]})</div>}
          </div>
          <div style={{ flex: 1, minWidth: 0, marginBottom: k === "experience" || k === "projects" || k === "education" || k === "certifications" ? -13 : 0 }}>{body(k)}</div>
        </section>
      ))}

      <div style={{ position: "absolute", left: 58, right: 58, bottom: 26, display: "flex", justifyContent: "space-between", fontSize: 10.5, color: muted, fontStyle: "italic", borderTop: `1px solid ${rule}`, paddingTop: 8 }}>
        <span>* References available on request. They're lovely people.</span>
        <span>Printed with 0% buzzwords</span>
      </div>
    </div>
  );
}
