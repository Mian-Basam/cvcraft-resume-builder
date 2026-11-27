// AI Engineer: clean single column with blue accents, a neural-net header motif and measurable results bolded in every bullet. ATS-friendly.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { DEFAULT_KEYS, fontOf, pick } from "../../kit";

const TITLES = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects & Models",
  skills: "Skills & AI Tools",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};

// Bold every number (with its unit) so measurable results stand out.
export function Metrics({ text, color }) {
  const parts = text.split(/(\d[\d,.]*\s?(?:%|x|k\b|K\b|M\b|\+)?)/g);
  return parts.map((t, i) => (i % 2 ? <strong key={i} style={{ color, fontWeight: 700 }}>{t}</strong> : t));
}

function NeuralNet({ a, b, line }) {
  const layers = [[18, 42, 66], [8, 30, 52, 74], [20, 42, 64], [42]];
  const xs = [10, 62, 114, 160];
  const edges = [];
  layers.slice(0, -1).forEach((ys, li) =>
    ys.forEach((y1) => layers[li + 1].forEach((y2) => edges.push([xs[li], y1, xs[li + 1], y2])))
  );
  return (
    <svg width="172" height="84" viewBox="0 0 172 84" aria-hidden="true" style={{ display: "block" }}>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={line} strokeWidth="0.9" />
      ))}
      {layers.map((ys, li) =>
        ys.map((y, j) => (
          <circle key={`${li}-${j}`} cx={xs[li]} cy={y} r={li === 3 ? 7 : 5} fill={li === 3 ? a : (j + li) % 3 === 0 ? b : "#ffffff"} stroke={a} strokeWidth="1.5" />
        ))
      )}
    </svg>
  );
}

export default function AIEngineer({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const blue = primary;
  const text = "#1e2430";
  const muted = "#5b6576";
  const rule = mix(primary, "#ffffff", 0.82);
  const fs = 12;

  const Heading = ({ k }) => (
    <h2 style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 9px", fontSize: 13, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: blue }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", border: `2px solid ${blue}`, boxShadow: `0 0 0 3px ${mix(accent, "#ffffff", 0.55)}`, flexShrink: 0 }} />
      {TITLES[k]}
      <span style={{ flex: 1, height: 1, background: rule }} />
    </h2>
  );

  const Bullets = ({ items }) =>
    items.length > 0 && (
      <ul style={{ listStyle: "disc", margin: "4px 0 0", paddingLeft: 17, fontSize: fs, lineHeight: 1.55, color: text }}>
        {items.map((b, i) => (
          <li key={i} style={{ marginBottom: 2 }}>
            <Metrics text={b} color={blue} />
          </li>
        ))}
      </ul>
    );

  const Entry = ({ title, sub, date, meta, bullets }) => (
    <div style={{ marginBottom: 12, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: text }}>
          {title}
          {sub && <span style={{ fontWeight: 500, color: blue }}><span style={{ color: mix(primary, "#ffffff", 0.6), margin: "0 8px" }}>|</span>{sub}</span>}
        </div>
        {date && <div style={{ fontSize: 11, color: muted, whiteSpace: "nowrap", fontWeight: 600 }}>{date}</div>}
      </div>
      {meta && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{meta}</div>}
      <Bullets items={bullets} />
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
        <div key={e.id} style={{ marginBottom: 10, padding: "8px 14px 9px", borderLeft: `3px solid ${accent}`, background: mix(primary, "#ffffff", 0.95), breakInside: "avoid" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{e.name}</div>
            {e.link && <div style={{ fontSize: 11, color: blue }}>{e.link}</div>}
          </div>
          <Bullets items={lines(e.description)} />
        </div>
      ));
    if (k === "skills")
      return (
        <div style={{ fontSize: fs, lineHeight: 1.7, color: text }}>
          {data.skills.map((s, i) => (
            <span key={s.id}>
              {i > 0 && <span style={{ color: mix(primary, "#ffffff", 0.5), margin: "0 8px" }}>·</span>}
              <span style={{ fontWeight: 600 }}>{s.name}</span>
            </span>
          ))}
        </div>
      );
    if (k === "languages")
      return (
        <div style={{ fontSize: fs, color: text }}>
          {data.languages.map((l) => l.name).join("  ·  ")}
        </div>
      );
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: fs, marginBottom: 3, color: text }}>
          <span>
            <b>{c.name}</b>
            {c.issuer && <span style={{ color: muted }}>, {c.issuer}</span>}
          </span>
          {c.year && <span style={{ color: muted, fontWeight: 600, fontSize: 11 }}>{c.year}</span>}
        </div>
      ));
    if (k === "interests") return <div style={{ fontSize: fs, color: text }}>{data.interests.map((i) => i.name).join("  ·  ")}</div>;
    return null;
  };

  const contacts = [p.email, p.phone, p.address, p.website].filter(Boolean);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "sora"), color: text, background: "#ffffff" })}>
      <div style={{ height: 6, background: `linear-gradient(90deg, ${primary}, ${accent})` }} />
      <div style={{ padding: "40px 56px 36px" }}>
        <header data-section="contact" style={{ display: "flex", alignItems: "center", gap: 24, paddingBottom: 18, marginBottom: 20, borderBottom: `2px solid ${rule}` }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: -0.8, color: "#111827", lineHeight: 1.1 }}>{p.name}</h1>
            {p.title && <div style={{ fontSize: 15, fontWeight: 600, color: blue, marginTop: 6 }}>{p.title}</div>}
            {contacts.length > 0 && (
              <div style={{ fontSize: 11, color: muted, marginTop: 10, lineHeight: 1.6 }}>
                {contacts.map((c, i) => (
                  <span key={c}>
                    {i > 0 && <span style={{ color: accent, fontWeight: 700, margin: "0 9px" }}>/</span>}
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          <NeuralNet a={blue} b={accent} line={mix(primary, "#ffffff", 0.72)} />
        </header>
        {pick(data, DEFAULT_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 21 }}>
            <Heading k={k} />
            {body(k)}
          </section>
        ))}
      </div>
    </div>
  );
}
