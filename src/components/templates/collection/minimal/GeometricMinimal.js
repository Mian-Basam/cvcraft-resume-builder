// The Geometric Minimal: two precisely aligned columns, a distinct geometric marker per section, circle-dot ratings and fine connecting lines.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";

const TEXT = "#22252a";
const MUTED = "#757a82";
const SIDE_W = 206;
const SIDE = ["skills", "languages", "certifications", "interests"];
const MAIN = ["summary", "experience", "education", "projects"];

// One shape per section, drawn in a 14px box.
function Marker({ k, color }) {
  const shape = {
    contact: (
      <g>
        <circle cx="7" cy="7" r="5.2" fill="none" stroke={color} strokeWidth="1.6" />
        <circle cx="7" cy="7" r="2" fill={color} />
      </g>
    ),
    summary: <circle cx="7" cy="7" r="5.5" fill={color} />,
    experience: <rect x="1.5" y="1.5" width="11" height="11" fill={color} />,
    education: <polygon points="7,1 13,12.5 1,12.5" fill={color} />,
    projects: <rect x="3" y="3" width="8" height="8" transform="rotate(45 7 7)" fill={color} />,
    skills: <circle cx="7" cy="7" r="5" fill="none" stroke={color} strokeWidth="1.6" />,
    languages: <path d="M1.5 9.5 A5.5 5.5 0 0 1 12.5 9.5 Z" fill={color} />,
    certifications: <rect x="2" y="2" width="10" height="10" fill="none" stroke={color} strokeWidth="1.6" />,
    interests: <polygon points="7,1.5 12.5,12 1.5,12" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />,
  }[k];
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0, display: "block" }}>
      {shape}
    </svg>
  );
}

function Dots({ level, color, track }) {
  const filled = Math.round(((level ?? 0) / 100) * 5);
  return (
    <span style={{ display: "flex", gap: 4 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", boxSizing: "border-box", background: i < filled ? color : "transparent", border: `1.2px solid ${i < filled ? color : track}` }} />
      ))}
    </span>
  );
}

export default function GeometricMinimal({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const fs = 12;
  const line = mix(primary, "#ffffff", 0.78);
  const contact = contactItems(p);
  const initials = (p.name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const Heading = ({ k, title }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 12px", fontSize: 11.5, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: TEXT }}>
      <Marker k={k} color={primary} />
      {title || SECTION_META[k].title}
      <span style={{ flex: 1, height: 1, background: line }} />
    </h3>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, color: TEXT }}>{p.summary}</p>;
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }))
        : k === "education"
        ? data.education.map((e) => ({ id: e.id, title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: [] }))
        : data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
    return items.map((e, i) => (
      <div key={e.id} style={{ marginTop: i ? 20 : 0, paddingLeft: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontSize: fs + 2, fontWeight: 600, color: TEXT }}>{e.title}</div>
          {e.date && <div style={{ fontSize: fs - 0.5, fontWeight: 500, color: primary, whiteSpace: "nowrap" }}>{e.date}</div>}
        </div>
        {e.sub && <div style={{ fontSize: fs, color: MUTED, marginTop: 1 }}>{e.sub}</div>}
        {e.bullets.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0" }}>
            {e.bullets.map((b, j) => (
              <li key={j} style={{ position: "relative", paddingLeft: 15, fontSize: fs, lineHeight: 1.55, color: TEXT, marginBottom: 3 }}>
                <span style={{ position: "absolute", left: 0, top: 6, width: 6, height: 6, borderRadius: "50%", border: `1.3px solid ${primary}`, boxSizing: "border-box" }} />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  const sideBody = (k) => {
    if (k === "skills" || k === "languages")
      return data[k].map((s) => (
        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, fontSize: fs - 0.5, marginBottom: 7, color: TEXT }}>
          <span>{s.name}</span>
          <Dots level={s.level} color={primary} track={line} />
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ fontSize: fs - 0.5, lineHeight: 1.45, marginBottom: 8 }}>
          <div style={{ fontWeight: 600, color: TEXT }}>{c.name}</div>
          {(c.issuer || c.year) && <div style={{ color: MUTED }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>}
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((x) => (
          <span key={x.id} style={{ fontSize: fs - 1, padding: "3px 10px", border: `1px solid ${line}`, borderRadius: 999, color: TEXT }}>
            {x.name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: TEXT, padding: "60px 54px 48px" })}>
      <header style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <svg width="96" height="96" viewBox="0 0 96 96" style={{ flexShrink: 0 }}>
          <circle cx="44" cy="48" r="40" fill="none" stroke={primary} strokeWidth="1.5" />
          <circle cx="78" cy="22" r="9" fill={accent} />
          <text x="44" y="49" textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="300" letterSpacing="2" fill={primary} fontFamily="inherit">
            {initials}
          </text>
        </svg>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.1, color: TEXT }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: 2.5, textTransform: "uppercase", color: primary, marginTop: 6 }}>{p.title}</div>}
        </div>
      </header>
      <div style={{ display: "flex", alignItems: "center", margin: "26px 0 34px" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: primary }} />
        <span style={{ flex: 1, height: 1, background: primary }} />
        <span style={{ width: 9, height: 9, background: primary }} />
      </div>
      <div style={{ display: "flex", minHeight: 820 }}>
        <aside style={{ width: SIDE_W, flexShrink: 0, paddingRight: 26, boxSizing: "border-box" }}>
          {contact.length > 0 && (
            <section data-section="contact" style={{ marginBottom: 30 }}>
              <Heading k="contact" title="Contact" />
              {contact.map((c) => (
                <div key={c.icon} style={{ display: "flex", gap: 10, alignItems: "baseline", fontSize: fs - 0.5, marginBottom: 6, color: TEXT, lineHeight: 1.4 }}>
                  <span style={{ width: 5, height: 5, background: primary, borderRadius: "50%", flexShrink: 0, transform: "translateY(-2px)" }} />
                  <span style={{ wordBreak: "break-word" }}>{c.value}</span>
                </div>
              ))}
            </section>
          )}
          {pick(data, SIDE).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 30 }}>
              <Heading k={k} />
              {sideBody(k)}
            </section>
          ))}
        </aside>
        <div style={{ width: 1, background: line, position: "relative", flexShrink: 0 }}>
          <span style={{ position: "absolute", top: 0, left: -4, width: 9, height: 9, borderRadius: "50%", background: "#fff", border: `1.5px solid ${primary}`, boxSizing: "border-box" }} />
          <span style={{ position: "absolute", bottom: 0, left: -3.5, width: 8, height: 8, background: primary }} />
        </div>
        <main style={{ flex: 1, minWidth: 0, paddingLeft: 28 }}>
          {pick(data, MAIN).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 34 }}>
              <Heading k={k} />
              {mainBody(k)}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
