// System Architecture: blueprint-grid page, skills drawn as a connected service diagram, experience in structured component blocks.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const LABEL = {
  summary: "Overview",
  skills: "Technology stack",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};

function chunk(items, max) {
  const rows = Math.ceil(items.length / max);
  const size = Math.ceil(items.length / rows);
  return Array.from({ length: rows }, (_, i) => items.slice(i * size, (i + 1) * size));
}

export default function SystemArchitecture({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const mono = fontStack("plexmono");
  const text = "#1d2330";
  const muted = "#5d6677";
  const line = mix(primary, "#ffffff", 0.35);
  const soft = mix(primary, "#ffffff", 0.9);
  const grid = mix(primary, "#ffffff", 0.93);
  const fs = 12;

  const main = pick(data, ["summary", "experience", "projects"]);
  const side = pick(data, ["education", "certifications", "languages", "interests"]);
  const showSkills = pick(data, ["skills"]).length > 0;
  const order = [...(showSkills ? ["skills"] : []), ...main, ...side];
  const num = (k) => String(order.indexOf(k) + 1).padStart(2, "0");

  const Heading = ({ k }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px", fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: primary, textTransform: "uppercase" }}>
      <span style={{ width: 8, height: 8, background: accent, border: `1.5px solid ${primary}`, flexShrink: 0 }} />
      <span style={{ color: muted, fontWeight: 400 }}>{num(k)}</span>
      {LABEL[k] || SECTION_META[k].title}
      <span style={{ flex: 1, height: 0, borderTop: `1px dashed ${line}` }} />
    </div>
  );

  const Bullets = ({ items }) =>
    items.length > 0 && (
      <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: fs, lineHeight: 1.5, color: text }}>
        {items.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
            <span style={{ color: primary, fontFamily: mono, fontWeight: 700, flexShrink: 0 }}>→</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    );

  // A component block: header strip with ports, body below.
  const Block = ({ title, sub, date, meta, children, dashed }) => (
    <div style={{ position: "relative", border: `1.5px ${dashed ? "dashed" : "solid"} ${line}`, borderRadius: 4, background: "#ffffff", marginBottom: 14, breakInside: "avoid" }}>
      {["left", "right"].map((s) => (
        <span key={s} style={{ position: "absolute", [s]: -5, top: 12, width: 8, height: 8, borderRadius: "50%", background: "#ffffff", border: `1.5px solid ${primary}` }} />
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "6px 12px", background: soft, borderBottom: `1px solid ${mix(primary, "#ffffff", 0.75)}` }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: text }}>
          {title}
          {sub && <span style={{ fontWeight: 500, color: primary }}> · {sub}</span>}
        </div>
        {date && <span style={{ fontFamily: mono, fontSize: 10.5, color: muted, whiteSpace: "nowrap" }}>{date}</span>}
      </div>
      {(meta || children) && (
        <div style={{ padding: "7px 12px 8px" }}>
          {meta && <div style={{ fontFamily: mono, fontSize: 10.5, color: muted, marginBottom: children ? 4 : 0 }}>{meta}</div>}
          {children}
        </div>
      )}
    </div>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => {
        const b = lines(e.bullets);
        return (
          <Block key={e.id} title={e.role} sub={e.company} date={dateRange(e.start, e.end)} meta={e.location && `region: ${e.location}`}>
            {b.length > 0 && <Bullets items={b} />}
          </Block>
        );
      });
    if (k === "projects")
      return data.projects.map((e) => {
        const b = lines(e.description);
        return (
          <Block key={e.id} title={e.name} dashed meta={e.link && `endpoint: ${e.link}`}>
            {b.length > 0 && <Bullets items={b} />}
          </Block>
        );
      });
    return null;
  };

  const sideBody = (k) => {
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 9, fontSize: fs }}>
          <div style={{ fontWeight: 700, color: text, fontSize: 12 }}>{e.degree}</div>
          {e.school && <div style={{ color: primary, fontWeight: 600 }}>{e.school}</div>}
          <div style={{ fontFamily: mono, fontSize: 10.5, color: muted, marginTop: 2 }}>
            {[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}
          </div>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: fs }}>
          <span style={{ fontFamily: mono, color: primary, fontWeight: 700 }}>✓</span>
          <span>
            <span style={{ fontWeight: 700, color: text }}>{c.name}</span>
            <span style={{ display: "block", fontFamily: mono, fontSize: 10.5, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</span>
          </span>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: fs, marginBottom: 6, color: text }}>
          <span>{l.name}</span>
          <span style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ width: 9, height: 9, border: `1.5px solid ${primary}`, background: i < Math.round(((l.level ?? 0) / 100) * 5) ? primary : "#ffffff" }} />
            ))}
          </span>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.interests.map((i) => (
            <span key={i.id} style={{ fontFamily: mono, fontSize: 10.5, padding: "2px 8px", border: `1px solid ${line}`, borderRadius: 3, color: text, background: "#ffffff" }}>{i.name}</span>
          ))}
        </div>
      );
    return null;
  };

  const rows = chunk(data.skills, 5);
  const Box = ({ s, i }) => (
    <div style={{ position: "relative", zIndex: 1, display: "flex" }}>
      <span style={{ position: "absolute", left: "50%", top: -14, width: 2, height: 14, marginLeft: -1, background: line }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `1.5px solid ${primary}`, borderRadius: 4, background: "#ffffff", padding: "7px 10px 8px", boxShadow: `3px 3px 0 ${mix(accent, "#ffffff", 0.35)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9.5, color: muted }}>
          <span>svc-{String(i + 1).padStart(2, "0")}</span>
          <span>{s.level ?? 0}%</span>
        </div>
        <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: text, margin: "3px 0 6px", lineHeight: 1.25 }}>{s.name}</div>
        <div style={{ height: 4, background: soft, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${s.level ?? 0}%`, background: primary, borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
  const Row = ({ row, offset }) => (
    <div style={{ position: "relative", paddingTop: 14 }}>
      <span style={{ position: "absolute", top: 0, height: 2, background: line, left: `${50 / row.length}%`, right: `${50 / row.length}%` }} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${row.length}, 1fr)`, gap: 14 }}>
        {row.map((s, i) => <Box key={s.id} s={s} i={offset + i} />)}
      </div>
    </div>
  );

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "inter"),
        color: text,
        background: "#ffffff",
        backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      })}
    >
      <div style={{ padding: "36px 44px 64px" }}>
        <header data-section="contact" style={{ display: "flex", alignItems: "stretch", marginBottom: 24 }}>
          <div style={{ flex: 1, border: `2px solid ${primary}`, background: "#ffffff", padding: "14px 18px 15px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ position: "absolute", top: -9, left: 14, background: primary, color: "#ffffff", fontFamily: mono, fontSize: 9.5, padding: "1px 7px", letterSpacing: 1 }}>PRIMARY NODE</span>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: -0.6, color: text, lineHeight: 1.1 }}>{p.name}</h1>
            {p.title && <div style={{ fontFamily: mono, fontSize: 13, color: primary, marginTop: 5 }}>{p.title}</div>}
          </div>
          <div style={{ width: 38, display: "flex", alignItems: "center", flexShrink: 0 }}>
            <span style={{ flex: 1, height: 2, background: line }} />
            <span style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `7px solid ${line}` }} />
          </div>
          <div style={{ width: 236, flexShrink: 0, border: `1.5px dashed ${line}`, background: "#ffffff", padding: "11px 14px 5px" }}>
            <ContactList p={p} fs={11} iconColor={primary} color={text} gap={6} />
          </div>
        </header>

        {showSkills && (
          <section data-section="skills" style={{ marginBottom: 24 }}>
            <Heading k="skills" />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ background: primary, color: "#ffffff", padding: "7px 18px", borderRadius: 4, textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: mono, fontSize: 9.5, opacity: 0.8, letterSpacing: 1 }}>TECH STACK</div>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.title || "Core platform"}</div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "relative", marginBottom: rows.length > 1 ? 12 : 0 }}>
                <span style={{ position: "absolute", left: "50%", marginLeft: -1, width: 2, top: -2, bottom: rows.length > 1 ? -12 : "auto", height: rows.length > 1 ? "auto" : 18, background: line }} />
                <div style={{ height: 16 }} />
                {rows.slice(0, rows.length > 1 ? -1 : undefined).map((row, ri) => (
                  <div key={ri} style={{ marginTop: ri ? 12 : 0 }}>
                    <Row row={row} offset={rows.slice(0, ri).flat().length} />
                  </div>
                ))}
              </div>
              {rows.length > 1 && <Row row={rows[rows.length - 1]} offset={data.skills.length - rows[rows.length - 1].length} />}
            </div>
          </section>
        )}

        <div style={{ display: "flex", gap: 26 }}>
          <main style={{ flex: 1, minWidth: 0 }}>
            {main.map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 22 }}>
                <Heading k={k} />
                {mainBody(k)}
              </section>
            ))}
          </main>
          {side.length > 0 && (
            <aside style={{ width: 210, flexShrink: 0 }}>
              {side.map((k) => (
                <section key={k} data-section={k} style={{ marginBottom: 16, padding: "12px 14px 6px", background: "#ffffff", border: `1px solid ${mix(primary, "#ffffff", 0.75)}`, borderTop: `3px solid ${primary}` }}>
                  <Heading k={k} />
                  {sideBody(k)}
                </section>
              ))}
            </aside>
          )}
        </div>
      </div>
      <div style={{ position: "absolute", left: 44, right: 44, bottom: 22, display: "flex", alignItems: "center", gap: 18, fontFamily: mono, fontSize: 9.5, color: muted, borderTop: `1px solid ${mix(primary, "#ffffff", 0.75)}`, paddingTop: 8 }}>
        <span style={{ fontWeight: 700, color: primary, letterSpacing: 1 }}>LEGEND</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 12, height: 8, border: `1.5px solid ${line}` }} />role</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 12, height: 8, border: `1.5px dashed ${line}` }} />project</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: "50%", border: `1.5px solid ${primary}` }} />port</span>
        <span>→ outcome</span>
      </div>
    </div>
  );
}
