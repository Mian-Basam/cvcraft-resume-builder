// The Skill Matrix: two columns — a graph-paper side panel holding a competencies × level grid (tools, professional skills and languages as categories), beside a ruled experience table.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf } from "../../kit";
import { fontStack } from "@/lib/palettes";
import Icon from "../../Icon";
import { yearsOfExperience } from "./metrics";

const MAIN_KEYS = ["summary", "experience", "projects", "education"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];
const TITLES = {
  summary: "Profile",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};
const TECH = /adobe|figma|sketch\b|photoshop|illustrator|indesign|after effects|premiere|blender|cinema 4d|canva|excel|office|sql|python|java|script|typescript|react|angular|vue|node|css|html|aws|azure|gcp|docker|kubernetes|git|linux|c\+\+|c#|\.net|php|ruby|golang|swift|kotlin|tableau|power ?bi|sap|salesforce|hubspot|autocad|revit|matlab|jira|wordpress|seo|analytics|api|cloud|software|xd\b|unity|unreal/i;
const LEVELS = 5;
const cellsOf = (level) => (level > 0 ? Math.max(1, Math.round(((level || 0) / 100) * LEVELS)) : 0);

export default function SkillMatrix({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#161b24";
  const text = "#2b313c";
  const muted = "#666e7b";
  const grid = mix(primary, "#ffffff", 0.86);
  const panel = mix(primary, "#ffffff", 0.95);
  const mono = fontStack("plexmono");
  const NAME_W = 146;
  const CELL = 27;

  const SideHeading = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px" }}>
      <span style={{ display: "grid", gridTemplateColumns: "repeat(2, 5px)", gap: 1.5 }}>
        {[1, 1, 0, 1].map((f, i) => (
          <span key={i} style={{ width: 5, height: 5, background: f ? primary : accent }} />
        ))}
      </span>
      <h3 style={{ margin: 0, fontSize: 11.5, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: ink }}>{children}</h3>
    </div>
  );

  const MainHeading = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 12px" }}>
      <span style={{ width: 10, height: 10, background: primary, flexShrink: 0, boxShadow: `3px 3px 0 ${accent}` }} />
      <h3 style={{ margin: 0, fontSize: 12.5, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: ink, whiteSpace: "nowrap" }}>{children}</h3>
      <span style={{ flex: 1, height: 1, background: grid }} />
    </div>
  );

  // One matrix row: name, then LEVELS cells filled up to the level.
  const Row = ({ name, level, last }) => {
    const n = cellsOf(level);
    return (
      <div style={{ display: "flex", alignItems: "center", borderBottom: last ? "none" : `1px solid ${grid}` }}>
        <div style={{ width: NAME_W, flexShrink: 0, fontSize: 12, color: text, padding: "8px 8px 8px 0", lineHeight: 1.25 }}>{name}</div>
        {Array.from({ length: LEVELS }, (_, i) => (
          <div key={i} style={{ width: CELL, alignSelf: "stretch", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `1px solid ${grid}` }}>
            <span style={{ width: 17, height: 17, background: i < n ? (i === n - 1 ? primary : mix(primary, "#ffffff", 0.35)) : "#ffffff", border: i < n ? "none" : `1px solid ${grid}`, boxSizing: "border-box" }} />
          </div>
        ))}
      </div>
    );
  };

  const Group = ({ label, items }) => (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 600, color: primary, letterSpacing: 0.6, textTransform: "uppercase", padding: "10px 0 4px", borderBottom: `1.5px solid ${primary}` }}>{label}</div>
      {items.map((s, i) => (
        <Row key={s.id} name={s.name} level={s.level} last={i === items.length - 1} />
      ))}
    </div>
  );

  const sideKeys = pick(data, SIDE_KEYS);
  const hasMatrix = sideKeys.includes("skills") || sideKeys.includes("languages");
  const tech = data.skills.filter((s) => TECH.test(s.name));
  const prof = data.skills.filter((s) => !TECH.test(s.name));
  const split = tech.length > 0 && prof.length > 0;

  const sideBody = (k) => {
    if (k === "skills")
      return split ? (
        <>
          <Group label="Tools & technical" items={tech} />
          <Group label="Professional" items={prof} />
        </>
      ) : (
        <Group label="Core skills" items={data.skills} />
      );
    if (k === "languages") return <Group label="Languages" items={data.languages} />;
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
          {c.year && <span style={{ fontFamily: mono, fontSize: 10.5, color: "#fff", background: primary, padding: "2px 5px", flexShrink: 0, marginTop: 1 }}>{c.year}</span>}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{c.name}</div>
            {c.issuer && <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{c.issuer}</div>}
          </div>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: `1px solid ${grid}`, borderRight: "none", borderBottom: "none", background: "#fff" }}>
          {data.interests.map((it) => (
            <div key={it.id} style={{ fontSize: 11.5, color: text, padding: "7px 9px", borderRight: `1px solid ${grid}`, borderBottom: `1px solid ${grid}` }}>{it.name}</div>
          ))}
        </div>
      );
    return null;
  };

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.75, color: text }}>{p.summary}</p>;
    const rows =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, date: dateRange(e.start, e.end), title: e.role, sub: [e.company, e.location].filter(Boolean).join(" · "), bullets: lines(e.bullets) }))
        : k === "education"
          ? data.education.map((e) => ({ id: e.id, date: dateRange(e.start, e.end), title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(" · "), bullets: [] }))
          : data.projects.map((e) => ({ id: e.id, date: "", title: e.name, sub: e.link, bullets: lines(e.description) }));
    return (
      <div style={{ borderTop: `1px solid ${grid}` }}>
        {rows.map((r) => (
          <div key={r.id} style={{ display: "flex", borderBottom: `1px solid ${grid}`, breakInside: "avoid" }}>
            <div style={{ width: 84, flexShrink: 0, borderRight: `1px solid ${grid}`, padding: "13px 8px 13px 0", fontFamily: mono, fontSize: 10.5, color: primary, fontWeight: 600, lineHeight: 1.4 }}>
              {r.date || "project"}
            </div>
            <div style={{ flex: 1, minWidth: 0, padding: "12px 0 14px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: ink, lineHeight: 1.3 }}>{r.title}</div>
              {r.sub && <div style={{ fontSize: 11.5, color: primary, fontWeight: 600, marginTop: 2 }}>{r.sub}</div>}
              {r.bullets.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  {r.bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.6, color: text, marginBottom: 3 }}>
                      <span style={{ width: 5, height: 5, background: accent, border: `1px solid ${primary}`, flexShrink: 0, marginTop: 6 }} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const contacts = contactItems(p);
  const legend = ["Basic", "Intermediate", "Advanced", "Expert", "Master"];
  const yrs = yearsOfExperience(data.experience);
  const avg = data.skills.length ? Math.round(data.skills.reduce((t, s) => t + (s.level || 0), 0) / data.skills.length) : 0;
  const totals = [
    yrs > 0 && [`${yrs}`, "years experience"],
    data.experience.length > 0 && [`${data.experience.length}`, data.experience.length === 1 ? "role" : "roles"],
    data.skills.length > 0 && [`${data.skills.length}`, "skills mapped"],
    avg > 0 && [`${avg}%`, "avg. proficiency"],
    data.languages.length > 0 && [`${data.languages.length}`, data.languages.length === 1 ? "language" : "languages"],
  ].filter(Boolean);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text, display: "flex", flexDirection: "column" })}>
      <header style={{ padding: "42px 48px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, borderBottom: `2px solid ${primary}` }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: muted, letterSpacing: 1, marginBottom: 6 }}>[ competency profile ]</div>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: ink, letterSpacing: -0.8, lineHeight: 1.05 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 7, fontSize: 13.5, fontWeight: 700, color: primary, letterSpacing: 1.6, textTransform: "uppercase" }}>{p.title}</div>}
        </div>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "0", border: `1px solid ${grid}`, flexShrink: 0 }}>
            {contacts.map((c, i) => (
              <div key={c.icon} style={{ fontSize: 10.5, color: text, padding: "5px 10px", borderRight: i % 2 === 0 ? `1px solid ${grid}` : "none", borderBottom: i < contacts.length - 2 ? `1px solid ${grid}` : "none", whiteSpace: "nowrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name={c.icon} size={11} color={primary} />
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </header>
      <div style={{ display: "flex", flex: 1 }}>
        <aside
          style={{
            width: 336,
            flexShrink: 0,
            boxSizing: "border-box",
            padding: "30px 26px 30px 48px",
            background: panel,
            backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
            borderRight: `1px solid ${grid}`,
          }}
        >
          {hasMatrix && (
            <div style={{ background: "#fff", border: `1px solid ${grid}`, padding: "14px 12px 10px", margin: "0 -12px 26px" }}>
              <SideHeading>Competency Matrix</SideHeading>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: NAME_W, flexShrink: 0, fontSize: 10.5, color: muted, fontFamily: mono }}>skill \ level</div>
                {Array.from({ length: LEVELS }, (_, i) => (
                  <div key={i} style={{ width: CELL, textAlign: "center", fontFamily: mono, fontSize: 10.5, fontWeight: 600, color: ink }}>{i + 1}</div>
                ))}
              </div>
              {sideKeys
                .filter((k) => k === "skills" || k === "languages")
                .map((k) => (
                  <section key={k} data-section={k}>
                    {sideBody(k)}
                  </section>
                ))}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 8px", marginTop: 8, fontFamily: mono, fontSize: 9.5, color: muted, lineHeight: 1.4 }}>
                {legend.map((w, i) => (
                  <span key={w}>{i + 1} {w}</span>
                ))}
              </div>
            </div>
          )}
          {data.skills.length > 0 && sideKeys.includes("skills") && (
            <div style={{ marginBottom: 26 }}>
              <SideHeading>Top strengths</SideHeading>
              {[...data.skills]
                .sort((a, b) => (b.level || 0) - (a.level || 0))
                .slice(0, 3)
                .map((s, i) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 12, color: text }}>
                    <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700, color: ink, background: accent, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>{s.name}</span>
                    <span style={{ fontFamily: mono, fontSize: 10.5, color: muted }}>{legend[cellsOf(s.level) - 1] || ""}</span>
                  </div>
                ))}
            </div>
          )}
          {sideKeys
            .filter((k) => k !== "skills" && k !== "languages")
            .map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 26 }}>
                <SideHeading>{TITLES[k]}</SideHeading>
                {sideBody(k)}
              </section>
            ))}
        </aside>
        <main style={{ flex: 1, minWidth: 0, padding: "30px 48px 30px 30px" }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 30 }}>
              <MainHeading>{TITLES[k]}</MainHeading>
              {mainBody(k)}
            </section>
          ))}
        </main>
      </div>
      {totals.length > 0 && (
        <footer style={{ display: "flex", borderTop: `2px solid ${primary}` }}>
          {totals.map(([n, label], i) => (
            <div key={label} style={{ flex: 1, padding: "14px 0 18px", paddingLeft: i === 0 ? 48 : 18, borderLeft: i ? `1px solid ${grid}` : "none" }}>
              <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: primary, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 10.5, color: muted, marginTop: 5, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </footer>
      )}
    </div>
  );
}
