// The Journey Map: single column — education, roles, certifications and projects placed in date order as stops on a winding dashed road that switches sides between stops, ending with a toolkit band.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf, levelWord } from "../../kit";
import Icon from "../../Icon";
import { yearOf } from "./metrics";

const W = 698; // content width (794 - 2 × 48)
const LANE = 34; // road centre distance from the content edge
const MARK = 54; // stop marker diameter
const ROAD = 12; // road width
const GAP = 36; // height of the crossing between stops
const TYPE = { education: "Education", experience: "Role", certifications: "Certification", projects: "Project" };
const ICON = { education: "education", experience: "experience", certifications: "star", projects: "code" };
const ORDER = { education: 0, experience: 1, certifications: 2, projects: 3 };

export default function JourneyMap({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#1a1f29";
  const text = "#2e3440";
  const muted = "#697180";
  const road = mix(primary, "#ffffff", 0.78);
  const paper = mix(primary, "#ffffff", 0.965);

  const keys = pick(data, ["experience", "education", "certifications", "projects"]);
  const stops = [];
  if (keys.includes("education"))
    data.education.forEach((e) => stops.push({ k: "education", id: e.id, year: yearOf(e.end) || yearOf(e.start), title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(" · "), date: dateRange(e.start, e.end), bullets: [] }));
  if (keys.includes("experience"))
    data.experience.forEach((e) => stops.push({ k: "experience", id: e.id, year: yearOf(e.start), title: e.role, sub: [e.company, e.location].filter(Boolean).join(" · "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }));
  if (keys.includes("certifications"))
    data.certifications.forEach((c) => stops.push({ k: "certifications", id: c.id, year: yearOf(c.year), title: c.name, sub: c.issuer, date: "", bullets: [] }));
  if (keys.includes("projects"))
    data.projects.forEach((e) => stops.push({ k: "projects", id: e.id, year: null, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
  stops.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || ORDER[a.k] - ORDER[b.k]);

  const laneX = (i) => (i % 2 === 0 ? LANE : W - LANE);

  // Straight stretch of road (vertical) with its dashed centre line.
  const Stretch = ({ x, top, bottom }) => (
    <div style={{ position: "absolute", left: x - ROAD / 2, width: ROAD, top, bottom, background: road }}>
      <div style={{ position: "absolute", left: ROAD / 2 - 1, top: 0, bottom: 0, borderLeft: "2px dashed #ffffff" }} />
    </div>
  );

  const Crossing = ({ from, to }) => {
    const d = `M ${from} 0 C ${from} ${GAP * 0.95}, ${to} ${GAP * 0.05}, ${to} ${GAP}`;
    return (
      <svg width={W} height={GAP} viewBox={`0 0 ${W} ${GAP}`} style={{ display: "block" }} aria-hidden="true">
        <path d={d} fill="none" stroke={road} strokeWidth={ROAD} />
        <path d={d} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 6" />
      </svg>
    );
  };

  const Stop = ({ s, i }) => {
    const left = i % 2 === 0;
    const x = laneX(i);
    const isLast = i === stops.length - 1;
    const now = s.k === "experience" && /present|now|current/i.test(s.date);
    return (
      <div data-section={s.k} style={{ position: "relative", minHeight: MARK + 6, padding: left ? `0 40px 6px ${LANE + MARK / 2 + 22}px` : `0 ${LANE + MARK / 2 + 22}px 6px 40px`, textAlign: left ? "left" : "right", breakInside: "avoid" }}>
        <Stretch x={x} top={i === 0 ? MARK / 2 : 0} bottom={isLast ? `calc(100% - ${MARK / 2}px)` : 0} />
        <div style={{ position: "absolute", left: x - MARK / 2, top: 0, width: MARK, height: MARK, borderRadius: "50%", background: now ? primary : "#ffffff", border: `3px solid ${primary}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${paper}` }}>
          <Icon name={ICON[s.k]} size={13} color={now ? accent : primary} />
          {s.year && <span style={{ fontSize: 10.5, fontWeight: 800, color: now ? "#fff" : ink, lineHeight: 1.1, marginTop: 1 }}>{s.year}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: left ? "flex-start" : "flex-end", marginBottom: 3, paddingTop: 2 }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: ink, background: accent, padding: "2px 7px", borderRadius: 3 }}>{TYPE[s.k]}</span>
          {s.date && <span style={{ fontSize: 10.5, fontWeight: 700, color: muted }}>{s.date}</span>}
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: ink, lineHeight: 1.3 }}>{s.title}</div>
        {s.sub && <div style={{ fontSize: 11.5, fontWeight: 700, color: primary, marginTop: 2 }}>{s.sub}</div>}
        {s.bullets.length > 0 && (
          <div style={{ marginTop: 5 }}>
            {s.bullets.map((b, j) => (
              <div key={j} style={{ display: "flex", flexDirection: left ? "row" : "row-reverse", gap: 8, fontSize: 12, lineHeight: 1.55, color: text, marginBottom: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", border: `1.5px solid ${primary}`, flexShrink: 0, marginTop: 6, boxSizing: "border-box" }} />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const kit = pick(data, ["skills", "languages", "interests"]);
  const kitBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => {
        const n = Math.max(1, Math.round(((s.level || 0) / 100) * 5));
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 11.5, color: text, marginBottom: 6 }}>
            <span>{s.name}</span>
            <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <span style={{ width: 5, height: 2, background: i < n ? primary : road }} />}
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: i < n ? primary : "#fff", border: `1.5px solid ${i < n ? primary : road}`, boxSizing: "border-box" }} />
                </span>
              ))}
            </span>
          </div>
        );
      });
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ fontSize: 11.5, color: text, marginBottom: 6 }}>
          <span style={{ fontWeight: 700, color: ink }}>{l.name}</span>
          <span style={{ color: muted }}> · {levelWord(l.level)}</span>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.interests.map((it) => (
            <span key={it.id} style={{ fontSize: 11, color: ink, border: `1.5px dashed ${mix(primary, "#ffffff", 0.5)}`, padding: "2px 9px", borderRadius: 999 }}>{it.name}</span>
          ))}
        </div>
      );
    return null;
  };
  const KIT_TITLE = { skills: "Skills", languages: "Languages", interests: "Interests" };
  const contacts = contactItems(p);
  const showSummary = pick(data, ["summary"]).length > 0;

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "nunito"), color: text, background: paper, padding: "40px 48px 34px", boxSizing: "border-box" })}>
      <header style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
        <svg width="58" height="58" viewBox="0 0 58 58" style={{ flexShrink: 0 }} aria-hidden="true">
          <circle cx="29" cy="29" r="27" fill={primary} />
          <path d="M29 13c-6 0-10.5 4.6-10.5 10.3C18.5 31 29 43 29 43s10.5-12 10.5-19.7C39.5 17.6 35 13 29 13z" fill={accent} />
          <circle cx="29" cy="23.5" r="4" fill={primary} />
        </svg>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, color: ink, letterSpacing: -0.5, lineHeight: 1.05 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 5, fontSize: 14, fontWeight: 800, color: primary, letterSpacing: 1.2, textTransform: "uppercase" }}>{p.title}</div>}
        </div>
      </header>
      {contacts.length > 0 && (
        <div data-section="contact" style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 11.5, color: text, padding: "10px 0", borderTop: `2px dashed ${road}`, borderBottom: `2px dashed ${road}`, marginBottom: 18 }}>
          {contacts.map((c) => (
            <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name={c.icon} size={12} color={primary} />
              {c.value}
            </span>
          ))}
        </div>
      )}
      {showSummary && (
        <section data-section="summary" style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", color: primary, marginBottom: 6 }}>Profile</div>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: text }}>{p.summary}</p>
        </section>
      )}
      {stops.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", color: primary }}>The journey so far</span>
            <span style={{ flex: 1, borderTop: `2px dashed ${road}` }} />
            {stops[0].year && <span style={{ fontSize: 10.5, fontWeight: 800, color: muted }}>since {stops[0].year}</span>}
          </div>
          {stops.map((s, i) => (
            <div key={`${s.k}-${s.id}`}>
              {i > 0 && <Crossing from={laneX(i - 1)} to={laneX(i)} />}
              <Stop s={s} i={i} />
            </div>
          ))}
        </div>
      )}
      {kit.length > 0 && (
        <div style={{ display: "flex", gap: 0, background: "#ffffff", borderRadius: 12, border: `1.5px solid ${road}` }}>
          {kit.map((k, i) => (
            <section key={k} data-section={k} style={{ flex: k === "skills" ? 1.3 : 1, minWidth: 0, padding: "14px 18px 10px", borderLeft: i ? `1.5px dashed ${road}` : "none" }}>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", color: primary, marginBottom: 9 }}>{KIT_TITLE[k]}</div>
              {kitBody(k)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
