// Developer Terminal: a dark terminal window, single column, monospace, every section opened with a shell command.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { DEFAULT_KEYS, SECTION_META, fontOf, pick } from "../../kit";

const CMD = {
  summary: ["cat", "about.md"],
  experience: ["cat", "experience.md"],
  education: ["cat", "education.md"],
  projects: ["ls -l", "~/projects"],
  skills: ["cat", "skills.json"],
  languages: ["cat", "languages.json"],
  certifications: ["./verify", "--certs"],
  interests: ["echo", "$INTERESTS"],
};

function fluency(level = 0) {
  if (level >= 95) return "native";
  if (level >= 80) return "fluent";
  if (level >= 60) return "professional";
  if (level >= 40) return "intermediate";
  return "basic";
}

export default function DeveloperTerminal({ data, theme }) {
  const { primary, accent, dark } = theme;
  const p = data.personal;
  const bg = mix(dark || "#161616", "#000000", 0.3);
  const bar = mix(bg, "#ffffff", 0.07);
  const rule = mix(bg, "#ffffff", 0.14);
  const text = "#d6dae0";
  const muted = "#8d95a3";
  const key = mix(primary, "#ffffff", 0.62);
  const str = mix(accent, "#ffffff", 0.4);
  const fs = 11.5;
  const user = (p.name || "user").split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "user";

  const Prompt = ({ cmd, arg }) => (
    <span>
      <span style={{ color: muted }}>{user}@resume:~</span>
      <span style={{ color: accent, fontWeight: 700 }}>$ </span>
      <span style={{ color: text }}>{cmd} </span>
      <span style={{ color: key }}>{arg}</span>
    </span>
  );

  const Heading = ({ k }) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: 12, marginBottom: 9 }}>
      <Prompt cmd={CMD[k][0]} arg={CMD[k][1]} />
      <span style={{ flex: 1, borderBottom: `1px dashed ${rule}`, transform: "translateY(-3px)" }} />
      <span style={{ color: muted, fontSize: 10.5 }}>// {SECTION_META[k].title.toLowerCase()}</span>
    </div>
  );

  const Out = ({ children }) => (
    <div style={{ borderLeft: `2px solid ${rule}`, paddingLeft: 16, marginLeft: 4 }}>{children}</div>
  );

  const Bullets = ({ items }) =>
    items.map((b, i) => (
      <div key={i} style={{ display: "flex", gap: 8, fontSize: fs, lineHeight: 1.55, color: text, marginTop: 2 }}>
        <span style={{ color: accent, flexShrink: 0 }}>-</span>
        <span>{b}</span>
      </div>
    ));

  const Entry = ({ title, at, date, meta, bullets }) => (
    <div style={{ marginBottom: 11, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#ffffff" }}>
          <span style={{ color: accent }}>▸ </span>
          {title}
          {at && <span style={{ color: key, fontWeight: 400 }}> @ {at}</span>}
        </div>
        {date && <span style={{ fontSize: 10.5, color: muted, whiteSpace: "nowrap" }}>[{date}]</span>}
      </div>
      {meta && <div style={{ fontSize: 10.5, color: muted, margin: "1px 0 0 18px" }}># {meta}</div>}
      {bullets.length > 0 && <div style={{ marginLeft: 18, marginTop: 3 }}><Bullets items={bullets} /></div>}
    </div>
  );

  const body = (k) => {
    if (k === "summary")
      return <p style={{ margin: 0, fontSize: fs, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} title={e.role} at={e.company} date={dateRange(e.start, e.end)} meta={e.location} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => (
        <Entry key={e.id} title={e.degree} at={e.school} date={dateRange(e.start, e.end)} meta={e.grade} bullets={[]} />
      ));
    if (k === "projects")
      return data.projects.map((e) => (
        <div key={e.id} style={{ display: "flex", gap: 12, marginBottom: 10, breakInside: "avoid" }}>
          <span style={{ color: muted, fontSize: 10.5, flexShrink: 0, paddingTop: 2 }}>drwxr-xr-x</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#ffffff" }}>
              {e.name}
              <span style={{ color: accent }}>/</span>
            </div>
            {e.link && <div style={{ fontSize: 10.5, color: key, marginTop: 1 }}>→ {e.link}</div>}
            <div style={{ marginTop: 2 }}><Bullets items={lines(e.description)} /></div>
          </div>
        </div>
      ));
    if (k === "skills")
      return (
        <div style={{ fontSize: fs, lineHeight: 1.7 }}>
          <span style={{ color: muted }}>{"{"}</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 28, paddingLeft: 16 }}>
            {data.skills.map((s, i) => {
              const filled = Math.round(((s.level ?? 0) / 100) * 10);
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                  <span>
                    <span style={{ color: str }}>"{s.name}"</span>
                    <span style={{ color: muted }}>:</span>
                  </span>
                  <span style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                    {Array.from({ length: 10 }, (_, j) => (
                      <span key={j} style={{ width: 6, height: 9, background: j < filled ? accent : rule }} />
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
          <span style={{ color: muted }}>{"}"}</span>
        </div>
      );
    if (k === "languages")
      return (
        <div style={{ fontSize: fs, lineHeight: 1.7, display: "flex", flexWrap: "wrap", gap: "0 6px" }}>
          <span style={{ color: muted }}>{"{"}</span>
          {data.languages.map((l, i) => (
            <span key={l.id}>
              <span style={{ color: key }}>{l.name.toLowerCase()}</span>
              <span style={{ color: muted }}>: </span>
              <span style={{ color: str }}>"{fluency(l.level)}"</span>
              {i < data.languages.length - 1 && <span style={{ color: muted }}>,</span>}
            </span>
          ))}
          <span style={{ color: muted }}>{"}"}</span>
        </div>
      );
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ fontSize: fs, lineHeight: 1.6, color: text }}>
          <span style={{ color: accent, fontWeight: 700 }}>[ OK ] </span>
          <span style={{ color: "#ffffff", fontWeight: 600 }}>{c.name}</span>
          {c.issuer && <span style={{ color: key }}> · {c.issuer}</span>}
          {c.year && <span style={{ color: muted }}> · {c.year}</span>}
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ fontSize: fs, color: str }}>
          {data.interests.map((i) => i.name.toLowerCase().replace(/\s+/g, "-")).join("  ")}
        </div>
      );
    return null;
  };

  const contacts = [
    ["email", p.email],
    ["phone", p.phone],
    ["location", p.address],
    ["web", p.website],
  ].filter((c) => c[1]);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "plexmono"), background: bg, color: text })}>
      <div style={{ display: "flex", alignItems: "center", height: 32, padding: "0 16px", background: bar, borderBottom: `1px solid ${rule}` }}>
        <span style={{ display: "flex", gap: 7 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
        </span>
        <span style={{ flex: 1, textAlign: "center", fontSize: 10.5, color: muted }}>{user}@resume: ~ — zsh — 80×24</span>
        <span style={{ width: 47 }} />
      </div>

      <div style={{ padding: "26px 46px 30px" }}>
        <header data-section="contact" style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12 }}>
            <Prompt cmd="whoami" arg="" />
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: 38, lineHeight: 1.1, fontWeight: 700, color: "#ffffff", letterSpacing: -0.5 }}>
            {p.name}
            <span style={{ display: "inline-block", width: 16, height: 32, background: accent, marginLeft: 10, verticalAlign: -4 }} />
          </h1>
          {p.title && <div style={{ fontSize: 14, color: key, marginTop: 6 }}># {p.title}</div>}
          {contacts.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginTop: 14, fontSize: fs, padding: "10px 14px", border: `1px solid ${rule}`, borderRadius: 4, background: mix(bg, "#ffffff", 0.03) }}>
              {contacts.map(([k, v]) => (
                <div key={k} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <span style={{ color: accent }}>--{k}</span>
                  <span style={{ color: muted }}>=</span>
                  <span style={{ color: text }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </header>

        {pick(data, DEFAULT_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 18 }}>
            <Heading k={k} />
            <Out>{body(k)}</Out>
          </section>
        ))}

        <div style={{ fontSize: 12, marginTop: 4 }}>
          <Prompt cmd="" arg="" />
          <span style={{ display: "inline-block", width: 8, height: 14, background: accent, verticalAlign: -2 }} />
        </div>
      </div>
    </div>
  );
}
