// Horizontal Resume: the page reads left-to-right in bands — a career timeline axis with jobs above and studies below, then skill, project and detail bands.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const ALL = ["summary", "experience", "education", "projects", "skills", "languages", "certifications", "interests"];
const TRIO = ["languages", "certifications", "interests"];

function yearOf(v, now) {
  const m = String(v || "").match(/\d{4}/);
  if (m) return Number(m[0]);
  if (/present|now|current|today/i.test(String(v || ""))) return now;
  return null;
}

export default function HorizontalResume({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.12);
  const muted = mix(ink, "#ffffff", 0.42);
  const pale = mix(primary, "#ffffff", 0.93);
  const line = mix(primary, "#ffffff", 0.75);
  const accentInk = mix(accent, dark, 0.78);
  const display = fontStack("sora");
  const now = new Date().getFullYear();

  const keys = pick(data, ALL);
  const hasContact = Boolean(p.email || p.phone || p.address || p.website);

  // Timeline points: every job and degree, numbered in date order.
  const showExp = keys.includes("experience");
  const showEdu = keys.includes("education");
  const pts = [
    ...(showExp ? data.experience : []).map((e) => ({ kind: "exp", e, s: yearOf(e.start, now), f: yearOf(e.end, now) })),
    ...(showEdu ? data.education : []).map((e) => ({ kind: "edu", e, s: yearOf(e.start, now), f: yearOf(e.end, now) })),
  ].map((t) => ({ ...t, s: t.s ?? t.f, f: t.f ?? t.s }));
  pts.sort((a, b) => (a.s ?? 9999) - (b.s ?? 9999));
  pts.forEach((t, i) => (t.n = i + 1));
  const dated = pts.filter((t) => t.s != null);
  const minY = dated.length ? Math.min(...dated.map((t) => t.s)) : null;
  const maxY = dated.length ? Math.max(...dated.map((t) => t.f), minY + 1) : null;
  const AXIS_W = 714;
  const x = (y) => ((y - minY) / (maxY - minY)) * (AXIS_W - 24) + 12;
  const step = maxY - minY > 14 ? 2 : 1;
  const ticks = minY != null ? Array.from({ length: Math.floor((maxY - minY) / step) + 1 }, (_, i) => minY + i * step) : [];

  const Tab = ({ children, color = primary, fg = "#fff" }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: color, color: fg, fontFamily: display, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "5px 12px 5px 14px", marginBottom: 14 }}>
      {children}
      <svg width="16" height="8" viewBox="0 0 16 8"><path d="M0 4h14M11 1l3 3-3 3" stroke={fg} strokeWidth="1.5" fill="none" /></svg>
    </div>
  );

  const Badge = ({ n, kind }) => (
    <span style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, fontFamily: display, background: kind === "exp" ? primary : accent, color: kind === "exp" ? "#fff" : accentInk }}>
      {n}
    </span>
  );

  const ExpCard = ({ t }) => (
    <div style={{ background: "#fff", border: `1px solid ${line}`, borderTop: `4px solid ${primary}`, padding: "12px 14px", breakInside: "avoid" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Badge n={t.n} kind="exp" />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: primary }}>{dateRange(t.e.start, t.e.end)}</span>
      </div>
      <div style={{ fontFamily: display, fontSize: 14.5, fontWeight: 700, color: ink, marginTop: 8 }}>{t.e.role}</div>
      {(t.e.company || t.e.location) && <div style={{ fontSize: 11.5, fontWeight: 600, color: muted, marginTop: 2 }}>{[t.e.company, t.e.location].filter(Boolean).join(" · ")}</div>}
      {lines(t.e.bullets).map((b, j) => (
        <div key={j} style={{ display: "flex", gap: 8, fontSize: 11.5, lineHeight: 1.55, color: ink, marginTop: 6 }}>
          <span style={{ width: 8, height: 2, background: accent, flexShrink: 0, marginTop: 8 }} />
          <span>{b}</span>
        </div>
      ))}
    </div>
  );

  const EduCard = ({ t }) => (
    <div style={{ background: "#fff", border: `1px solid ${line}`, borderBottom: `4px solid ${accent}`, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start", breakInside: "avoid" }}>
      <Badge n={t.n} kind="edu" />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: display, fontSize: 13.5, fontWeight: 700, color: ink }}>{t.e.degree}</div>
        <div style={{ fontSize: 11.5, color: muted, fontWeight: 600, marginTop: 2 }}>{[t.e.school, dateRange(t.e.start, t.e.end), t.e.grade].filter(Boolean).join(" · ")}</div>
      </div>
    </div>
  );

  const cols = (n, max = 3) => `repeat(${Math.max(1, Math.min(n, max))}, 1fr)`;
  const expPts = pts.filter((t) => t.kind === "exp");
  const eduPts = pts.filter((t) => t.kind === "edu");

  const Axis = ({ bg }) => (
    <div style={{ position: "relative", height: 92, margin: "14px 0 12px" }}>
      <svg width={AXIS_W} height="92" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1="0" y1="38" x2={AXIS_W - 6} y2="38" stroke={ink} strokeWidth="1.5" />
        <path d={`M${AXIS_W - 10} 33 L${AXIS_W} 38 L${AXIS_W - 10} 43`} fill="none" stroke={ink} strokeWidth="1.5" />
        {dated.map((t) => {
          const up = t.kind === "exp";
          return (
            <g key={t.n}>
              <rect x={x(t.s)} y={up ? 32 : 39} width={Math.max(6, x(t.f) - x(t.s))} height="5" fill={up ? primary : accent} />
              <line x1={x(t.s)} y1={up ? 32 : 44} x2={x(t.s)} y2={up ? 18 : 64} stroke={up ? primary : accentInk} strokeWidth="1" strokeDasharray="2 2" />
              <circle cx={x(t.s)} cy={up ? 10 : 74} r="9" fill={up ? primary : accent} />
              <text x={x(t.s)} y={up ? 13.5 : 77.5} textAnchor="middle" fontSize="10" fontWeight="800" fill={up ? "#fff" : accentInk}>{t.n}</text>
            </g>
          );
        })}
        {ticks.map((y) => (
          <g key={y}>
            <line x1={x(y)} y1="34" x2={x(y)} y2="42" stroke={ink} strokeWidth="1" />
            <text x={x(y)} y="57" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={muted} stroke={bg} strokeWidth="5" paintOrder="stroke" fontFamily="inherit">{y}</text>
          </g>
        ))}
      </svg>
    </div>
  );

  const band = (k, i) => {
    const bg = i % 2 ? "#fff" : pale;
    const pad = { padding: "18px 40px 22px", background: bg };
    if (k === "summary")
      return (
        <section key={k} data-section="summary" style={pad}>
          <Tab>Profile</Tab>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: ink }}>{p.summary}</p>
        </section>
      );
    if (k === "timeline")
      return (
        <div key={k} style={pad}>
          <Tab>Career Timeline</Tab>
          {expPts.length > 0 && (
            <section data-section="experience" style={{ display: "grid", gridTemplateColumns: cols(expPts.length), gap: 14 }}>
              {expPts.map((t) => <ExpCard key={t.n} t={t} />)}
            </section>
          )}
          {dated.length > 0 && <Axis bg={bg} />}
          {eduPts.length > 0 && (
            <section data-section="education" style={{ display: "grid", gridTemplateColumns: cols(eduPts.length, 2), gap: 14, marginTop: dated.length ? 0 : 14 }}>
              {eduPts.map((t) => <EduCard key={t.n} t={t} />)}
            </section>
          )}
        </div>
      );
    if (k === "skills")
      return (
        <section key={k} data-section="skills" style={pad}>
          <Tab>{SECTION_META.skills.title}</Tab>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(Math.max(data.skills.length, 1), 6)}, 1fr)`, gap: "14px 16px" }}>
            {data.skills.map((s) => (
              <div key={s.id}>
                <div style={{ fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.3, minHeight: 31 }}>{s.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 6, background: line }}>
                    <div style={{ width: `${s.level ?? 0}%`, height: "100%", background: primary }} />
                  </div>
                  <span style={{ fontSize: 10.5, color: muted, fontWeight: 600 }}>{s.level ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    if (k === "projects")
      return (
        <section key={k} data-section="projects" style={pad}>
          <Tab>{SECTION_META.projects.title}</Tab>
          <div style={{ display: "grid", gridTemplateColumns: cols(data.projects.length), gap: 14 }}>
            {data.projects.map((e) => (
              <div key={e.id} style={{ display: "flex", gap: 14, alignItems: "baseline", borderLeft: `4px solid ${accent}`, paddingLeft: 14, flexWrap: data.projects.length > 1 ? "wrap" : "nowrap" }}>
                <div style={{ flexShrink: 0, maxWidth: data.projects.length > 1 ? "none" : 260 }}>
                  <div style={{ fontFamily: display, fontSize: 14, fontWeight: 700, color: ink }}>{e.name}</div>
                  {e.link && <div style={{ fontSize: 11.5, color: primary, fontWeight: 600, marginTop: 2 }}>{e.link}</div>}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.55, color: ink }}>{lines(e.description).join(" ")}</div>
              </div>
            ))}
          </div>
        </section>
      );
    if (k === "trio") {
      const trio = keys.filter((t) => TRIO.includes(t));
      return (
        <div key={k} style={{ ...pad, display: "grid", gridTemplateColumns: `repeat(${trio.length}, 1fr)`, gap: 0 }}>
          {trio.map((t, j) => (
            <section key={t} data-section={t} style={{ padding: j ? "0 0 0 22px" : "0 22px 0 0", borderLeft: j ? `1px solid ${line}` : "none" }}>
              <Tab color={j % 2 ? accent : primary} fg={j % 2 ? accentInk : "#fff"}>{SECTION_META[t].title}</Tab>
              {t === "languages" &&
                data.languages.map((l) => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: ink, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700 }}>{l.name}</span>
                    <span style={{ color: muted }}>{levelWord(l.level)}</span>
                  </div>
                ))}
              {t === "certifications" &&
                data.certifications.map((c) => (
                  <div key={c.id} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: ink }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
                  </div>
                ))}
              {t === "interests" && (
                <div style={{ fontSize: 12, color: ink, lineHeight: 1.7 }}>
                  {data.interests.map((it, n) => (
                    <span key={it.id}>
                      {n > 0 && <span style={{ color: primary, margin: "0 6px" }}>→</span>}
                      {it.name}
                    </span>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      );
    }
    return null;
  };

  // Band order follows the user's order; jobs + studies share one timeline band, the small lists share one band.
  const bands = [];
  keys.forEach((k) => {
    const id = k === "experience" || k === "education" ? "timeline" : TRIO.includes(k) ? "trio" : k;
    if (!bands.includes(id)) bands.push(id);
  });

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: ink, display: "flex", flexDirection: "column" })}>
      <header style={{ background: primary, color: "#fff", padding: "38px 40px 30px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 30 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontFamily: display, fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>{p.name}</h1>
          {p.title && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
              <span style={{ width: 40, height: 3, background: accent }} />
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: accent }}>{p.title}</span>
            </div>
          )}
        </div>
        {hasContact && (
          <div data-section="contact" style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "auto auto", gap: "6px 22px" }}>
            <ContactList p={p} fs={11.5} iconColor={accent} color="#fff" gap={0} />
          </div>
        )}
      </header>
      <div style={{ height: 8, background: `repeating-linear-gradient(90deg, ${accent} 0 40px, ${mix(accent, primary, 0.5)} 40px 80px)` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {bands.map((b, i) => band(b, i))}
        <div style={{ flex: 1, background: bands.length % 2 ? "#fff" : pale }} />
      </div>
    </div>
  );
}
