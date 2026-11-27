// The Progression CV: single column — roles become numbered levels (L1 = first role) on a horizontal progress track, then level cards (latest first) with hexagon badges, level-up connectors and starred milestone achievements.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf, levelWord } from "../../kit";
import Icon from "../../Icon";
import { metricOf, splitAt, yearOf } from "./metrics";

const BOTTOM_KEYS = ["skills", "education", "certifications", "languages", "interests"];
const TITLES = { summary: "Profile", experience: "Levels", projects: "Projects", skills: "Skill Levels", education: "Education", certifications: "Certifications", languages: "Languages", interests: "Interests" };

function Hex({ size, fill, stroke, children, textColor, fs }) {
  const h = size * 1.1547;
  const pts = `${size / 2},1 ${size - 1},${h / 4} ${size - 1},${(h * 3) / 4} ${size / 2},${h - 1} 1,${(h * 3) / 4} 1,${h / 4}`;
  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} style={{ display: "block", flexShrink: 0 }}>
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth="2" />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={fs} fontWeight="800" fill={textColor}>{children}</text>
    </svg>
  );
}

export default function ProgressionCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#171b24";
  const text = "#2c313b";
  const muted = "#686f7c";
  const hair = "#e2e5ea";
  const pale = mix(primary, "#ffffff", 0.9);
  const mid = mix(primary, "#ffffff", 0.55);

  const keys = pick(data, ["summary", "experience", "projects", ...BOTTOM_KEYS]);
  const bottom = keys.filter((k) => BOTTOM_KEYS.includes(k));

  // Oldest role = level 1. Roles without a year keep their list position (the list is newest first).
  const roles = data.experience
    .map((e, i) => ({ e, i, y: yearOf(e.start) }))
    .sort((a, b) => (a.y && b.y ? a.y - b.y : b.i - a.i))
    .map((r, n) => ({ ...r, level: n + 1 }));
  const top = roles.length;
  const newestFirst = [...roles].reverse();

  const Heading = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 12px" }}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path d="M2 12 L7 6 L12 12" fill="none" stroke={mid} strokeWidth="2.2" />
        <path d="M2 7 L7 1 L12 7" fill="none" stroke={primary} strokeWidth="2.2" />
      </svg>
      <h3 style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: ink }}>{children}</h3>
      <span style={{ flex: 1, height: 1, background: hair }} />
    </div>
  );

  const edu = keys.includes("education") ? data.education[data.education.length - 1] : null;
  const nodes = [
    ...(edu ? [{ id: `edu-${edu.id}`, label: "Start", title: edu.degree, sub: [edu.school, yearOf(edu.end) || ""].filter(Boolean).join(" · "), edu: true }] : []),
    ...roles.map((r) => ({ id: r.e.id, label: `L${r.level}`, title: r.e.role, sub: [r.e.company, dateRange(r.e.start, r.e.end)].filter(Boolean).join(" · "), current: r.level === top })),
  ];
  const Track = () => (
    <div style={{ position: "relative", margin: "6px 0 28px", padding: "0 6px" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 21, height: 6, borderRadius: 3, background: pale }} />
      <div style={{ position: "absolute", left: 30, right: top > 1 ? 30 : "auto", width: top > 1 ? "auto" : 0, top: 21, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${mid}, ${primary})` }} />
      <div style={{ position: "relative", display: "flex", justifyContent: top > 1 ? "space-between" : "flex-start" }}>
        {nodes.map((n, i) => {
          const first = i === 0;
          const last = i === nodes.length - 1;
          return (
            <div key={n.id} style={{ width: 180, display: "flex", flexDirection: "column", alignItems: first ? "flex-start" : last ? "flex-end" : "center", textAlign: first ? "left" : last ? "right" : "center" }}>
              {n.edu ? (
                <span style={{ position: "relative", display: "block", width: 42, height: 48 }}>
                  <Hex size={42} fill={pale} stroke={mid} textColor={primary} fs={10}>{""}</Hex>
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="education" size={17} color={primary} />
                  </span>
                </span>
              ) : (
                <Hex size={42} fill={n.current ? primary : "#ffffff"} stroke={primary} textColor={n.current ? "#ffffff" : primary} fs={14}>{n.label}</Hex>
              )}
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: n.current ? primary : muted, marginTop: 5 }}>{n.edu ? "Foundation" : n.current ? "Current level" : `Level ${n.label.slice(1)}`}</div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: ink, marginTop: 2, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 10.5, color: muted, marginTop: 1, whiteSpace: "nowrap" }}>{n.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const Milestone = ({ t }) => {
    const m = metricOf(t);
    const [a, b, c] = splitAt(t, m);
    return (
      <div style={{ display: "flex", gap: 9, fontSize: 12.5, lineHeight: 1.6, color: text, marginBottom: 5 }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, background: m ? accent : pale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          {m ? (
            <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18.2 5.5 22l1.7-7.4-5.7-5 7.5-.7z" fill={ink} />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={primary} strokeWidth="3.5" />
            </svg>
          )}
        </span>
        <span>
          {a}
          {b && <strong style={{ color: ink, fontWeight: 800 }}>{b}</strong>}
          {c}
        </span>
      </div>
    );
  };

  const LevelCard = ({ r, next }) => {
    const current = r.level === top;
    const bullets = lines(r.e.bullets);
    return (
      <div style={{ display: "flex", gap: 18, breakInside: "avoid" }}>
        <div style={{ width: 92, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Hex size={58} fill={current ? primary : "#ffffff"} stroke={primary} textColor={current ? "#ffffff" : primary} fs={19}>{`L${r.level}`}</Hex>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: current ? primary : muted, marginTop: 4 }}>{current ? "Current" : `Level ${r.level}`}</div>
          {next && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 6, minHeight: 20 }}>
              <span style={{ flex: 1, width: 2, background: `repeating-linear-gradient(${mid} 0 4px, transparent 4px 8px)` }} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: ink, lineHeight: 1.3 }}>{r.e.role}</div>
            {dateRange(r.e.start, r.e.end) && <span style={{ fontSize: 11, fontWeight: 700, color: muted, whiteSpace: "nowrap" }}>{dateRange(r.e.start, r.e.end)}</span>}
          </div>
          {(r.e.company || r.e.location) && <div style={{ fontSize: 12, fontWeight: 700, color: primary, marginTop: 2 }}>{[r.e.company, r.e.location].filter(Boolean).join(" · ")}</div>}
          {bullets.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: muted, marginBottom: 5 }}>Milestones</div>
              {bullets.map((b, i) => (
                <Milestone key={i} t={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Level-up strip between two level cards.
  const LevelUp = ({ from, to }) => {
    const y = yearOf(to.e.start);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "-8px 0 18px 110px" }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: ink, background: accent, padding: "2px 8px", borderRadius: 999, letterSpacing: 0.6, textTransform: "uppercase" }}>
          ▲ L{from.level} → L{to.level}
        </span>
        <span style={{ fontSize: 10.5, color: muted }}>{y ? `Promoted to ${to.e.role} in ${y}` : `Moved up to ${to.e.role}`}</span>
      </div>
    );
  };

  const bottomBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => {
        const lv = s.level > 0 ? Math.max(1, Math.round(((s.level || 0) / 100) * 5)) : 0;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: "#fff", background: primary, borderRadius: 3, padding: "1px 5px", flexShrink: 0, minWidth: 26, textAlign: "center" }}>Lv{lv}</span>
            <span style={{ flex: 1, fontSize: 11.5, color: text, minWidth: 0 }}>{s.name}</span>
            <span style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ width: 9, height: 3 + i * 2, alignSelf: "flex-end", background: i < lv ? primary : pale, borderRadius: 1 }} />
              ))}
            </span>
          </div>
        );
      });
    if (k === "education" || k === "certifications") {
      const items =
        k === "education"
          ? data.education.map((e) => ({ id: e.id, t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" · "), d: dateRange(e.start, e.end), icon: "education" }))
          : data.certifications.map((c) => ({ id: c.id, t: c.name, s: c.issuer, d: c.year, icon: "star" }));
      return items.map((x) => (
        <div key={x.id} style={{ display: "flex", gap: 10, marginBottom: 9 }}>
          <span style={{ position: "relative", width: 30, height: 34, flexShrink: 0 }}>
            <Hex size={30} fill={pale} stroke={mid} textColor={primary} fs={10}>{""}</Hex>
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={x.icon} size={13} color={primary} />
            </span>
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: ink, lineHeight: 1.3 }}>{x.t}</div>
            {x.s && <div style={{ fontSize: 11, color: text }}>{x.s}</div>}
            {x.d && <div style={{ fontSize: 10.5, color: muted }}>{x.d}</div>}
          </div>
        </div>
      ));
    }
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: text, marginBottom: 6 }}>
          <span style={{ fontWeight: 700, color: ink }}>{l.name}</span>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    if (k === "interests") return <div style={{ fontSize: 11.5, color: text, lineHeight: 1.7 }}>{data.interests.map((i) => i.name).join(" · ")}</div>;
    return null;
  };

  const contacts = contactItems(p);
  // Bottom area: skills on the left, the rest stacked in two more columns.
  const colA = bottom.filter((k) => k === "skills");
  const rest = bottom.filter((k) => k !== "skills");
  const colB = rest.filter((k) => k === "education" || k === "certifications");
  const colC = rest.filter((k) => k === "languages" || k === "interests");
  const cols = [colA, colB, colC].filter((c) => c.length);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "montserrat"), color: text, padding: "42px 50px 30px", boxSizing: "border-box" })}>
      <header style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 22 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 33, fontWeight: 800, color: ink, letterSpacing: -0.4, lineHeight: 1.08 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: primary, letterSpacing: 1.6, textTransform: "uppercase" }}>{p.title}</div>}
          {contacts.length > 0 && (
            <div data-section="contact" style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 11, fontSize: 11, color: text }}>
              {contacts.map((c) => (
                <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name={c.icon} size={12} color={primary} />
                  {c.value}
                </span>
              ))}
            </div>
          )}
        </div>
        {top > 0 && keys.includes("experience") && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: muted }}>Career level</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ink }}>{top} of {top}</div>
            </div>
            <Hex size={64} fill={primary} stroke={accent} textColor="#ffffff" fs={22}>{`L${top}`}</Hex>
          </div>
        )}
      </header>

      {keys.includes("summary") && (
        <section data-section="summary" style={{ marginBottom: 26, background: pale, borderRadius: 8, padding: "12px 16px", borderLeft: `4px solid ${primary}` }}>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: text }}>{p.summary}</p>
        </section>
      )}

      {keys.includes("experience") && roles.length > 0 && (
        <section data-section="experience" style={{ marginBottom: 8 }}>
          <Heading>Career progression</Heading>
          {nodes.length > 1 && <Track />}
          {newestFirst.map((r, i) => (
            <div key={r.e.id}>
              <LevelCard r={r} next={i < newestFirst.length - 1} />
              {i < newestFirst.length - 1 && <LevelUp from={newestFirst[i + 1]} to={r} />}
            </div>
          ))}
        </section>
      )}

      {keys.includes("projects") && (
        <section data-section="projects" style={{ marginBottom: 24 }}>
          <Heading>Side projects</Heading>
          {data.projects.map((e) => (
            <div key={e.id} style={{ display: "flex", gap: 18, marginBottom: 10 }}>
              <div style={{ width: 92, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 2 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: primary, border: `1.5px solid ${primary}`, borderRadius: 999, padding: "2px 9px", textTransform: "uppercase" }}>Project</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: ink }}>{e.name}</div>
                {e.link && <div style={{ fontSize: 11, color: primary, fontWeight: 600, marginTop: 1 }}>{e.link}</div>}
                <div style={{ marginTop: 5 }}>
                  {lines(e.description).map((t, i) => (
                    <Milestone key={i} t={t} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {cols.length > 0 && (
        <div style={{ display: "flex", gap: 26, borderTop: `1px solid ${hair}`, paddingTop: 24 }}>
          {cols.map((c, i) => (
            <div key={i} style={{ flex: c === colA ? 1.25 : 1, minWidth: 0 }}>
              {c.map((k) => (
                <section key={k} data-section={k} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: ink, marginBottom: 9 }}>{TITLES[k]}</div>
                  {bottomBody(k)}
                </section>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
