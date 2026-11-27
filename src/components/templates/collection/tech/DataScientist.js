// Data Scientist: single column led by a strip of key results pulled from the bullets, with numbered analytical sections. ATS-friendly.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { DEFAULT_KEYS, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const TITLES = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects & Research",
  skills: "Technical Skills",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};

const STOP = new Set(["to", "from", "by", "of", "in", "for", "and", "with", "the", "a", "an", "per", "than", "over", "across", "on", "at", "into", "up", "down"]);

// Pull quantified results (percentages, counts with a unit word) out of experience and project bullets.
function extractStats(data) {
  const sources = [
    ...data.experience.flatMap((e) => lines(e.bullets).map((t) => [t, e.company || e.role])),
    ...data.projects.flatMap((p) => lines(p.description).map((t) => [t, p.name])),
  ];
  const found = [];
  sources.forEach(([t, from], si) => {
    for (const m of t.matchAll(/(\d[\d,.]*\d|\d)\s?(%|x\b|k\b|K\b|M\b|\+)?/g)) {
      const raw = m[1];
      const unit = m[2] || "";
      if (!unit && /^(19|20)\d\d$/.test(raw)) continue;
      const after = [];
      for (const w of t.slice(m.index + m[0].length).split(/[,.;:()]/)[0].trim().split(/\s+/).filter(Boolean)) {
        if (STOP.has(w.toLowerCase()) || /\d/.test(w)) break;
        after.push(w);
        if (after.length === 2) break;
      }
      let label = after.join(" ");
      if (unit === "%" || unit === "x" || !label) {
        if (!unit) continue;
        const before = t.slice(0, m.index).split(/\s+/).filter(Boolean);
        while (before.length && (STOP.has(before[before.length - 1].toLowerCase()) || /\d/.test(before[before.length - 1]))) before.pop();
        label = before.slice(-2).join(" ").replace(/[,.;:]/g, "");
      }
      if (!label) continue;
      const value = parseFloat(raw.replace(/,/g, "")) || 0;
      const score = unit === "%" || unit === "x" ? 3 : unit ? 2 : value >= 10 ? 1.5 : 1;
      found.push({ value: raw + unit, label: label[0].toUpperCase() + label.slice(1), from, score, order: si * 100 + m.index });
    }
  });
  const seen = new Set();
  return found
    .filter((s) => (seen.has(s.value) ? false : seen.add(s.value)))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 4)
    .sort((a, b) => a.order - b.order);
}

export default function DataScientist({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const mono = fontStack("plexmono");
  const text = "#1d2129";
  const muted = "#5c6370";
  const rule = "#dfe2e7";
  const fs = 12;
  const keys = pick(data, DEFAULT_KEYS);
  const stats = pick(data, ["experience", "projects"]).length ? extractStats(data) : [];

  const Heading = ({ k, i }) => (
    <h2 style={{ display: "flex", alignItems: "flex-end", gap: 10, margin: "0 0 9px", paddingBottom: 4, borderBottom: `1.5px solid ${text}`, fontSize: 14, fontWeight: 700, color: text }}>
      <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, color: primary }}>{String(i + 1).padStart(2, "0")}</span>
      <span style={{ flex: 1 }}>{TITLES[k]}</span>
      <span aria-hidden="true" style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 12, paddingBottom: 1 }}>
        {[5, 9, 7, 12].map((h, j) => <span key={j} style={{ width: 3, height: h, background: j === 3 ? accent : mix(primary, "#ffffff", 0.55) }} />)}
      </span>
    </h2>
  );

  const Entry = ({ title, sub, date, meta, bullets }) => (
    <div style={{ marginBottom: 12, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontSize: 13, color: text }}>
          <b>{title}</b>
          {sub && <span style={{ color: primary, fontWeight: 600 }}>, {sub}</span>}
        </div>
        {date && <span style={{ fontFamily: mono, fontSize: 10.5, color: muted, whiteSpace: "nowrap" }}>{date}</span>}
      </div>
      {meta && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{meta}</div>}
      {bullets.length > 0 && (
        <ul style={{ listStyle: "square", margin: "4px 0 0", paddingLeft: 17, fontSize: fs, lineHeight: 1.55, color: text }}>
          {bullets.map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
        </ul>
      )}
    </div>
  );

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} title={e.role} sub={e.company} date={dateRange(e.start, e.end)} meta={e.location} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => <Entry key={e.id} title={e.degree} sub={e.school} date={dateRange(e.start, e.end)} meta={e.grade} bullets={[]} />);
    if (k === "projects")
      return data.projects.map((e) => <Entry key={e.id} title={e.name} sub={e.link} bullets={lines(e.description)} />);
    if (k === "skills")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px 20px", fontSize: fs, color: text }}>
          {data.skills.map((s) => <div key={s.id}>{s.name}</div>)}
        </div>
      );
    if (k === "languages") return <div style={{ fontSize: fs, color: text }}>{data.languages.map((l) => l.name).join(", ")}</div>;
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: fs, color: text, marginBottom: 3 }}>
          <span>
            <b>{c.name}</b>
            {c.issuer && <span style={{ color: muted }}>, {c.issuer}</span>}
          </span>
          {c.year && <span style={{ fontFamily: mono, fontSize: 10.5, color: muted }}>{c.year}</span>}
        </div>
      ));
    if (k === "interests") return <div style={{ fontSize: fs, color: text }}>{data.interests.map((i) => i.name).join(", ")}</div>;
    return null;
  };

  const contacts = [p.email, p.phone, p.address, p.website].filter(Boolean);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text, background: "#ffffff" })}>
      <div style={{ padding: "38px 54px 30px" }}>
        <header data-section="contact" style={{ marginBottom: stats.length >= 2 ? 18 : 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1, color: "#111318" }}>{p.name}</h1>
              {p.title && <div style={{ fontSize: 14.5, fontWeight: 600, color: primary, marginTop: 5 }}>{p.title}</div>}
            </div>
            <svg width="120" height="44" viewBox="0 0 120 44" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M2 40 L118 40" stroke={rule} strokeWidth="1" />
              <path d="M4 34 L22 28 L38 31 L56 20 L72 23 L90 11 L114 5" fill="none" stroke={primary} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {[[4, 34], [22, 28], [38, 31], [56, 20], [72, 23], [90, 11]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.2" fill="#ffffff" stroke={primary} strokeWidth="1.5" />)}
              <circle cx="114" cy="5" r="3.6" fill={accent} stroke={primary} strokeWidth="1.5" />
            </svg>
          </div>
          {contacts.length > 0 && (
            <div style={{ fontFamily: mono, fontSize: 10.5, color: muted, marginTop: 12, display: "flex", flexWrap: "wrap", gap: "2px 0" }}>
              {contacts.map((c, i) => (
                <span key={c}>
                  {i > 0 && <span style={{ color: accent, margin: "0 10px" }}>|</span>}
                  {c}
                </span>
              ))}
            </div>
          )}
        </header>

        {stats.length >= 2 && (
          <div data-section="experience" style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, border: `1px solid ${rule}`, borderTop: `3px solid ${primary}`, marginBottom: 20, background: mix(primary, "#ffffff", 0.96) }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: "11px 14px 12px", borderLeft: i ? `1px solid ${rule}` : "none" }}>
                <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: primary, lineHeight: 1.1, letterSpacing: -0.5 }}>{s.value}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: text, marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10.5, color: muted, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.from}</div>
              </div>
            ))}
          </div>
        )}

        {keys.map((k, i) => (
          <section key={k} data-section={k} style={{ marginBottom: 16 }}>
            <Heading k={k} i={i} />
            {body(k)}
          </section>
        ))}
      </div>
    </div>
  );
}
