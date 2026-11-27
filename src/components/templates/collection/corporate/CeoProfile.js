// The CEO Profile: single-column executive resume — oversized name, lead-paragraph executive summary, a numbered band of leadership achievements pulled from each role, then board-level experience. ATS-friendly.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf, DEFAULT_KEYS, SectionBody } from "../../kit";

const TITLES = {
  summary: "Executive Summary",
  experience: "Executive Experience",
  education: "Education",
  projects: "Strategic Initiatives",
  skills: "Core Competencies",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};

function Bullets({ items, color, fs }) {
  if (!items.length) return null;
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0" }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: "flex", gap: 10, fontSize: fs, lineHeight: 1.55, marginBottom: 3 }}>
          <span style={{ width: 4, height: 4, background: color, marginTop: fs * 0.78 - 2, flexShrink: 0 }} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CeoProfile({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#18202e";
  const text = "#2c3443";
  const muted = "#5d6677";
  const rule = "#d8dce3";
  const tint = mix(primary, "#ffffff", 0.94);
  const o = { primary, light: tint, text, muted, fs: 11.5, titleColor: ink, subColor: primary, dateStyle: "right", skillStyle: "grid", langStyle: "inline", interestStyle: "inline" };

  const jobs = data.experience.map((e) => ({ ...e, list: lines(e.bullets) }));
  const wins = jobs.filter((e) => e.list.length).slice(0, 4);
  const winIds = new Set(wins.map((e) => e.id));

  const Heading = ({ children }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 12px", fontSize: 11.5, fontWeight: 700, letterSpacing: 2.4, textTransform: "uppercase", color: primary }}>
      <span style={{ whiteSpace: "nowrap" }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: rule }} />
    </h3>
  );

  const contacts = contactItems(p);

  const body = (k) => {
    if (k === "summary") {
      return <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: ink, fontWeight: 400 }}>{p.summary}</p>;
    }
    if (k === "experience") {
      return (
        <>
          {wins.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: muted, marginBottom: 8 }}>Leadership Achievements</div>
              <div style={{ display: "grid", gridTemplateColumns: wins.length > 1 ? "1fr 1fr" : "1fr", gap: 10 }}>
                {wins.map((e, i) => (
                  <div key={e.id} style={{ background: tint, borderTop: `3px solid ${primary}`, padding: "12px 14px 12px", display: "flex", gap: 12 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: primary, lineHeight: 1, letterSpacing: -0.5 }}>{String(i + 1).padStart(2, "0")}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, lineHeight: 1.5, color: ink, fontWeight: 600 }}>{e.list[0]}</div>
                      <div style={{ fontSize: 10.5, color: muted, marginTop: 4 }}>{[e.role, e.company].filter(Boolean).join(", ")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {jobs.map((e) => {
            const rest = winIds.has(e.id) ? e.list.slice(1) : e.list;
            const date = dateRange(e.start, e.end);
            return (
              <div key={e.id} style={{ marginBottom: 16, breakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: ink }}>{e.role}</div>
                  {date && <div style={{ fontSize: 10.5, fontWeight: 600, color: muted, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{date}</div>}
                </div>
                {(e.company || e.location) && (
                  <div style={{ fontSize: 11.5, marginTop: 2 }}>
                    <span style={{ color: primary, fontWeight: 700, letterSpacing: 0.4 }}>{e.company}</span>
                    {e.company && e.location && <span style={{ color: rule }}>{"  |  "}</span>}
                    <span style={{ color: muted }}>{e.location}</span>
                  </div>
                )}
                <Bullets items={rest} color={primary} fs={11.5} />
              </div>
            );
          })}
        </>
      );
    }
    if (k === "skills") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px 18px" }}>
          {data.skills.map((s) => (
            <div key={s.id} style={{ display: "flex", gap: 9, alignItems: "baseline", fontSize: 11.5, color: text }}>
              <span style={{ width: 5, height: 5, background: accent, outline: `1px solid ${primary}`, flexShrink: 0, transform: "translateY(-2px)" }} />
              {s.name}
            </div>
          ))}
        </div>
      );
    }
    if (k === "education" || k === "certifications") {
      const rows = k === "education"
        ? data.education.map((e) => ({ id: e.id, a: e.degree, b: [e.school, e.grade].filter(Boolean).join(" · "), d: dateRange(e.start, e.end) }))
        : data.certifications.map((e) => ({ id: e.id, a: e.name, b: e.issuer, d: e.year }));
      return rows.map((r) => (
        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 6, fontSize: 11.5 }}>
          <div>
            <span style={{ fontWeight: 700, color: ink }}>{r.a}</span>
            {r.a && r.b && <span style={{ color: rule }}>{"  |  "}</span>}
            <span style={{ color: muted }}>{r.b}</span>
          </div>
          {r.d && <div style={{ fontSize: 10.5, fontWeight: 600, color: muted, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{r.d}</div>}
        </div>
      ));
    }
    if (k === "projects") {
      return data.projects.map((e) => (
        <div key={e.id} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11.5 }}>
            <span style={{ fontWeight: 700, color: ink }}>{e.name}</span>
            {e.name && e.link && <span style={{ color: rule }}>{"  |  "}</span>}
            <span style={{ color: primary }}>{e.link}</span>
          </div>
          <Bullets items={lines(e.description)} color={primary} fs={11.5} />
        </div>
      ));
    }
    return <SectionBody k={k} data={data} o={o} />;
  };

  const keys = pick(data, DEFAULT_KEYS);
  const minor = ["skills", "languages", "interests"];

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text, padding: "50px 60px 44px" })}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 28 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 42, fontWeight: 800, color: ink, letterSpacing: -1, lineHeight: 1.02 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, letterSpacing: 3.2, textTransform: "uppercase", color: primary }}>{p.title}</div>}
        </div>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ borderLeft: `1px solid ${rule}`, paddingLeft: 18, textAlign: "left", flexShrink: 0 }}>
            {contacts.map((c) => (
              <div key={c.icon} style={{ fontSize: 11, color: text, lineHeight: 1.75, whiteSpace: "nowrap" }}>{c.value}</div>
            ))}
          </div>
        )}
      </header>
      <div style={{ position: "relative", height: 4, background: primary, margin: "22px 0 26px" }}>
        <span style={{ position: "absolute", left: 0, top: 0, width: 72, height: 4, background: accent }} />
      </div>
      {keys.map((k) => (
        <section key={k} data-section={k} style={{ marginBottom: minor.includes(k) ? 16 : 20 }}>
          <Heading>{TITLES[k]}</Heading>
          {body(k)}
        </section>
      ))}
    </div>
  );
}
