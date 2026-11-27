// The Modular Cards: two columns of separate, outlined content modules on a dotted board — each card has a coloured title strip, a module code and a hard offset shadow; skills sit in a tile grid with block meters.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";
import { yearsOfExperience } from "./metrics";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
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
const ICONS = { summary: "user", experience: "experience", education: "education", projects: "code", skills: "skills", languages: "language", certifications: "star", interests: "heart" };

export default function ModularCards({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#191d26";
  const text = "#2d323c";
  const muted = "#666d79";
  const board = mix(primary, "#ffffff", 0.92);
  const dot = mix(primary, "#ffffff", 0.75);
  const soft = mix(primary, "#ffffff", 0.88);
  const mono = fontStack("plexmono");

  const mainKeys = pick(data, MAIN_KEYS);
  const sideKeys = pick(data, SIDE_KEYS);
  const order = [...mainKeys, ...sideKeys];
  const code = (k) => `M-${String(order.indexOf(k) + 1).padStart(2, "0")}`;

  const Card = ({ k, side, children, title, label }) => (
    <section data-section={k === "snapshot" ? undefined : k} style={{ background: "#ffffff", border: `1.5px solid ${ink}`, borderRadius: 6, boxShadow: `5px 5px 0 ${side ? accent : primary}`, marginBottom: 28, overflow: "hidden", breakInside: "avoid" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: side ? accent : primary, borderBottom: `1.5px solid ${ink}` }}>
        <Icon name={ICONS[k] || "star"} size={13} color={side ? ink : "#ffffff"} />
        <h3 style={{ margin: 0, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: side ? ink : "#ffffff" }}>{title || TITLES[k]}</h3>
        <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 10, color: side ? ink : "#ffffff", opacity: 0.75 }}>{label || code(k)}</span>
      </div>
      <div style={{ padding: side ? "14px 14px" : "16px 18px" }}>{children}</div>
    </section>
  );

  const Entry = ({ title, sub, date, bullets, last }) => (
    <div style={{ paddingBottom: last ? 0 : 12, marginBottom: last ? 0 : 12, borderBottom: last ? "none" : `1.5px dashed ${soft}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{title}</div>
          {sub && <div style={{ fontSize: 11.5, fontWeight: 600, color: primary, marginTop: 2 }}>{sub}</div>}
        </div>
        {date && <span style={{ fontFamily: mono, fontSize: 10.5, color: ink, border: `1.5px solid ${ink}`, borderRadius: 4, padding: "1px 7px", whiteSpace: "nowrap", background: soft }}>{date}</span>}
      </div>
      {bullets && bullets.length > 0 && (
        <div style={{ marginTop: 7 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 9, fontSize: 12.5, lineHeight: 1.6, color: text, marginBottom: 4 }}>
              <span style={{ width: 7, height: 7, background: primary, borderRadius: 1.5, flexShrink: 0, marginTop: 6 }} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Blocks = ({ level, n = 5 }) => {
    const f = level > 0 ? Math.max(1, Math.round(((level || 0) / 100) * n)) : 0;
    return (
      <span style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: n }, (_, i) => (
          <span key={i} style={{ width: 12, height: 6, borderRadius: 1, background: i < f ? primary : soft }} />
        ))}
      </span>
    );
  };

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, i) => (
        <Entry key={e.id} title={e.role} sub={[e.company, e.location].filter(Boolean).join(" · ")} date={dateRange(e.start, e.end)} bullets={lines(e.bullets)} last={i === data.experience.length - 1} />
      ));
    if (k === "projects")
      return data.projects.map((e, i) => <Entry key={e.id} title={e.name} sub={e.link} bullets={lines(e.description)} last={i === data.projects.length - 1} />);
    if (k === "skills")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
          {data.skills.map((s) => (
            <div key={s.id} style={{ border: `1px solid ${soft}`, borderRadius: 4, padding: "7px 8px", background: mix(primary, "#ffffff", 0.97) }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: ink, lineHeight: 1.25, marginBottom: 5 }}>{s.name}</div>
              <Blocks level={s.level} />
            </div>
          ))}
        </div>
      );
    if (k === "education")
      return data.education.map((e, i) => (
        <div key={e.id} style={{ marginBottom: i < data.education.length - 1 ? 10 : 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{e.degree}</div>
          {e.school && <div style={{ fontSize: 11.5, color: primary, fontWeight: 600 }}>{e.school}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 4, fontFamily: mono, fontSize: 10.5, color: muted }}>
            {dateRange(e.start, e.end) && <span>{dateRange(e.start, e.end)}</span>}
            {e.grade && <span style={{ color: ink }}>{e.grade}</span>}
          </div>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l, i) => (
        <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: i < data.languages.length - 1 ? 8 : 0 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ink }}>{l.name}</div>
            <div style={{ fontSize: 10.5, color: muted }}>{levelWord(l.level)}</div>
          </div>
          <Blocks level={l.level} />
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c, i) => (
        <div key={c.id} style={{ marginBottom: i < data.certifications.length - 1 ? 9 : 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.interests.map((it) => (
            <span key={it.id} style={{ fontSize: 11, fontWeight: 600, color: ink, border: `1.5px solid ${ink}`, borderRadius: 4, padding: "2px 8px", boxShadow: `2px 2px 0 ${accent}` }}>{it.name}</span>
          ))}
        </div>
      );
    return null;
  };

  const yrs = yearsOfExperience(data.experience);
  const stats = [
    yrs > 0 && [yrs, "years"],
    mainKeys.includes("experience") && [data.experience.length, data.experience.length === 1 ? "role" : "roles"],
    mainKeys.includes("projects") && [data.projects.length, data.projects.length === 1 ? "project" : "projects"],
    sideKeys.includes("skills") && [data.skills.length, "skills"],
  ].filter(Boolean).slice(0, 3);

  const contacts = contactItems(p);
  const initials = (p.name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "spacegrotesk"),
        color: text,
        background: board,
        backgroundImage: `radial-gradient(${dot} 1.1px, transparent 1.3px)`,
        backgroundSize: "14px 14px",
        padding: "44px 40px 20px",
        boxSizing: "border-box",
      })}
    >
      <header style={{ display: "flex", background: "#ffffff", border: `1.5px solid ${ink}`, borderRadius: 6, boxShadow: `5px 5px 0 ${primary}`, marginBottom: 28, overflow: "hidden" }}>
        {initials && (
          <div style={{ width: 96, flexShrink: 0, background: primary, borderRight: `1.5px solid ${ink}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: "#ffffff", letterSpacing: 1 }}>{initials}</span>
            <span style={{ position: "absolute", left: 8, top: 6, fontFamily: mono, fontSize: 9.5, color: accent }}>ID</span>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0, padding: "24px 22px" }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: ink, letterSpacing: -0.6, lineHeight: 1.08 }}>{p.name}</h1>
          {p.title && (
            <div style={{ display: "inline-block", marginTop: 7, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: ink, background: accent, padding: "2px 9px", borderRadius: 3 }}>{p.title}</div>
          )}
        </div>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ flexShrink: 0, borderLeft: `1.5px dashed ${soft}`, padding: "14px 20px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 5 }}>
            {contacts.map((c) => (
              <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: text, whiteSpace: "nowrap" }}>
                <Icon name={c.icon} size={12} color={primary} />
                {c.value}
              </span>
            ))}
          </div>
        )}
      </header>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          {mainKeys.map((k) => (
            <Card key={k} k={k}>
              {body(k)}
            </Card>
          ))}
        </main>
        <aside style={{ width: 262, flexShrink: 0 }}>
          {stats.length > 1 && (
            <Card k="snapshot" side title="Snapshot" label="M-00">
              <div style={{ display: "flex", gap: 6 }}>
                {stats.map(([n, l]) => (
                  <div key={l} style={{ flex: 1, textAlign: "center", border: `1.5px solid ${ink}`, borderRadius: 4, padding: "8px 2px 6px" }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: primary, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: muted, marginTop: 4, textTransform: "uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {sideKeys.map((k) => (
            <Card key={k} k={k} side>
              {body(k)}
            </Card>
          ))}
        </aside>
      </div>
    </div>
  );
}
