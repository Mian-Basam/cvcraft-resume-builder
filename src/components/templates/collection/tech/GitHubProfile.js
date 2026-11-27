// GitHub Profile: a developer profile page — avatar sidebar with bio and skills, README summary, pinned repo cards, contribution timeline.
import { pageStyle, mix, lines, dateRange, Photo } from "../../shared";
import { ContactList, SECTION_META, fontOf, photoOf, pick } from "../../kit";
import Icon from "../../Icon";

const DOTS = ["#f1e05a", "#3572a5", "#e34c26", "#563d7c", "#2b7489", "#89e051", "#b07219"];

// Deterministic pseudo-random levels for the decorative activity grid.
function activity(seed, count) {
  let h = 2166136261;
  for (const ch of seed || "dev") h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Array.from({ length: count }, (_, i) => {
    h = Math.imul(h ^ (i + 7), 2654435761) >>> 0;
    const r = (h % 1000) / 1000;
    const wave = 0.5 + 0.5 * Math.sin(i / 23);
    const v = r * 0.65 + wave * 0.35;
    return v < 0.3 ? 0 : v < 0.48 ? 1 : v < 0.64 ? 2 : v < 0.8 ? 3 : 4;
  });
}

export default function GitHubProfile({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const text = "#1f2328";
  const muted = "#59636e";
  const border = "#d1d9e0";
  const link = primary;
  const user = (p.name || "developer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "developer";
  const fs = 12;

  const left = pick(data, ["skills", "languages", "certifications", "interests"]);
  const rank = (k) => (k === "summary" ? 0 : k === "projects" ? 1 : 2);
  // Pinned repositories sit right under the README, as on a profile page; the rest follow the user's order.
  const right = pick(data, ["summary", "projects", "experience", "education"]).sort((a, b) => rank(a) - rank(b));

  const SideHead = ({ k }) => (
    <div style={{ fontSize: 13, fontWeight: 700, color: text, margin: "0 0 8px" }}>
      {{ skills: "Technical skills", languages: "Languages", certifications: "Achievements", interests: "Topics" }[k]}
    </div>
  );

  const Pill = ({ children, strong }) => (
    <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 9px", borderRadius: 999, background: strong ? mix(primary, "#ffffff", 0.88) : "#ffffff", color: strong ? primary : muted, border: `1px solid ${strong ? mix(primary, "#ffffff", 0.7) : border}`, lineHeight: 1.5 }}>
      {children}
    </span>
  );

  const sideBody = (k) => {
    if (k === "skills")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {data.skills.map((s) => <Pill key={s.id} strong>{s.name}</Pill>)}
        </div>
      );
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: fs, marginBottom: 5, color: text }}>
          <span style={{ flex: 1 }}>{l.name}</span>
          <span style={{ width: 70, height: 6, borderRadius: 3, background: "#eaeef2", overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${l.level ?? 0}%`, background: primary }} />
          </span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 35% 30%, ${mix(accent, "#ffffff", 0.5)}, ${accent})`, border: `2px solid ${mix(accent, "#000000", 0.15)}` }}>
            <Icon name="star" size={16} color={mix(accent, "#000000", 0.6)} />
          </span>
          <span style={{ fontSize: fs - 0.5, lineHeight: 1.35, color: text }}>
            <b>{c.name}</b>
            <span style={{ display: "block", color: muted, fontSize: 10.5 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</span>
          </span>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {data.interests.map((i) => <Pill key={i.id}>#{i.name.toLowerCase().replace(/\s+/g, "-")}</Pill>)}
        </div>
      );
    return null;
  };

  const MainHead = ({ children, right: r }) => (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600, color: text, margin: "0 0 9px" }}>
      <span>{children}</span>
      {r && <span style={{ fontSize: 10.5, fontWeight: 400, color: muted }}>{r}</span>}
    </div>
  );

  const Timeline = ({ items }) => (
    <div style={{ position: "relative", paddingLeft: 26 }}>
      <span style={{ position: "absolute", left: 8, top: 4, bottom: 6, width: 2, background: "#e1e6eb" }} />
      {items.map((e) => (
        <div key={e.id} style={{ position: "relative", marginBottom: 12, breakInside: "avoid" }}>
          <span style={{ position: "absolute", left: -26, top: 1, width: 18, height: 18, borderRadius: "50%", background: "#ffffff", border: `2px solid ${border}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: primary }} />
          </span>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
            <div style={{ fontSize: 12.5, color: text }}>
              <b>{e.title}</b>
              {e.sub && <span style={{ color: link, fontWeight: 600 }}> · {e.sub}</span>}
            </div>
            {e.date && <span style={{ fontSize: 10.5, color: muted, whiteSpace: "nowrap" }}>{e.date}</span>}
          </div>
          {e.meta && <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{e.meta}</div>}
          {e.bullets.length > 0 && (
            <ul style={{ listStyle: "disc", margin: "5px 0 0", paddingLeft: 16, fontSize: fs, lineHeight: 1.5, color: text }}>
              {e.bullets.map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const cells = activity(p.name, 7 * 36);
  const shade = ["#ebeef1", mix(accent, "#ffffff", 0.55), accent, mix(accent, primary, 0.5), primary];

  const mainBody = (k) => {
    if (k === "summary")
      return (
        <div style={{ border: `1px solid ${border}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "7px 14px", background: "#f6f8fa", borderBottom: `1px solid ${border}`, fontSize: 10.5, color: muted, display: "flex", gap: 6, alignItems: "center" }}>
            <Icon name="book" size={12} color={muted} />
            <span><b style={{ color: text }}>{user}</b> / README.md</span>
          </div>
          <div style={{ padding: "12px 16px 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: text, paddingBottom: 5, marginBottom: 7, borderBottom: `1px solid #eaeef2` }}>
              Hi there, I&apos;m {(p.name || "").split(/\s+/)[0]}
            </div>
            <p style={{ margin: 0, fontSize: fs, lineHeight: 1.6, color: text }}>{p.summary}</p>
          </div>
        </div>
      );
    if (k === "projects") {
      const one = data.projects.length === 1;
      return (
        <div style={{ display: "grid", gridTemplateColumns: one ? "1fr" : "1fr 1fr", gap: 10 }}>
          {data.projects.map((e, i) => {
            const lang = data.skills[i % Math.max(1, data.skills.length)]?.name;
            return (
              <div key={e.id} style={{ border: `1px solid ${border}`, borderRadius: 6, padding: "11px 14px", display: "flex", flexDirection: "column", breakInside: "avoid" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon name="code" size={13} color={muted} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: link, flex: 1 }}>{e.name}</span>
                  <span style={{ fontSize: 9.5, color: muted, border: `1px solid ${border}`, borderRadius: 999, padding: "0 7px" }}>Public</span>
                </div>
                <div style={{ fontSize: fs - 0.5, color: muted, lineHeight: 1.5, margin: "5px 0 8px", flex: 1 }}>
                  {lines(e.description).join(" ")}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 10.5, color: muted }}>
                  {lang && (
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? accent : DOTS[i % DOTS.length], border: "1px solid rgba(0,0,0,0.12)" }} />
                      {lang}
                    </span>
                  )}
                  {e.link && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="globe" size={11} color={muted} />
                      {e.link}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    if (k === "experience")
      return (
        <Timeline
          items={data.experience.map((e) => ({ id: e.id, title: e.role, sub: e.company, date: dateRange(e.start, e.end), meta: e.location, bullets: lines(e.bullets) }))}
        />
      );
    if (k === "education")
      return (
        <Timeline items={data.education.map((e) => ({ id: e.id, title: e.degree, sub: e.school, date: dateRange(e.start, e.end), meta: e.grade, bullets: [] }))} />
      );
    return null;
  };

  const mainTitle = { summary: null, projects: "Pinned repositories", experience: "Contribution activity", education: "Education" };
  const tabs = [
    ["Overview", null],
    ["Repositories", data.projects.length || null],
    ["Experience", data.experience.length || null],
    ["Skills", data.skills.length || null],
  ];

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text, background: "#ffffff" })}>
      <div style={{ height: 46, background: mix(primary, "#000000", 0.35), display: "flex", alignItems: "center", gap: 12, padding: "0 40px", color: "#ffffff" }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="code" size={14} color="#ffffff" />
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{user}</span>
        <span style={{ flex: 1 }} />
        {p.website && <span style={{ fontSize: 10.5, opacity: 0.8 }}>{p.website}</span>}
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, paddingLeft: 296 }}>
        {tabs.map(([t, n], i) => (
          <div key={t} style={{ padding: "11px 13px 9px", fontSize: 11.5, color: i === 0 ? text : muted, fontWeight: i === 0 ? 600 : 400, borderBottom: i === 0 ? `2px solid ${accent}` : "2px solid transparent", marginBottom: -1, display: "flex", alignItems: "center", gap: 6 }}>
            {t}
            {n && <span style={{ fontSize: 10, background: "#eaeef2", color: text, borderRadius: 999, padding: "0 7px", fontWeight: 600 }}>{n}</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 30, padding: "0 40px 30px" }}>
        <aside style={{ width: 226, flexShrink: 0, marginTop: -30 }}>
          <Photo src={photoOf(data, theme)} name={p.name} size={210} placeholderBg={primary} style={{ border: `1px solid ${border}`, boxShadow: "0 0 0 4px #ffffff", position: "relative" }} />
          <div data-section="contact">
            <h1 style={{ margin: "14px 0 0", fontSize: 23, lineHeight: 1.2, fontWeight: 700, color: text }}>{p.name}</h1>
            {p.title && <div style={{ fontSize: 15, color: muted, fontWeight: 300, marginTop: 2 }}>{p.title}</div>}
            <div style={{ height: 14 }} />
            <ContactList p={p} fs={11.5} iconColor={muted} color={text} gap={8} />
          </div>
          {left.map((k) => (
            <section key={k} data-section={k} style={{ borderTop: `1px solid ${border}`, paddingTop: 16, marginTop: 18 }}>
              <SideHead k={k} />
              {sideBody(k)}
            </section>
          ))}
        </aside>

        <main style={{ flex: 1, minWidth: 0, paddingTop: 20 }}>
          {right.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 26 }}>
              {mainTitle[k] && (
                <MainHead right={k === "projects" && data.projects.length > 1 ? `${data.projects.length} repositories` : null}>{mainTitle[k]}</MainHead>
              )}
              {k === "experience" && (
                <div style={{ border: `1px solid ${border}`, borderRadius: 6, padding: "10px 12px 8px", marginBottom: 12 }}>
                  <div style={{ display: "grid", gridTemplateRows: "repeat(7, 9px)", gridAutoFlow: "column", gridAutoColumns: "9px", gap: 3, justifyContent: "space-between" }}>
                    {cells.map((v, i) => <span key={i} style={{ background: shade[v], borderRadius: 1.5 }} />)}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3, fontSize: 9.5, color: muted, marginTop: 6 }}>
                    Less
                    {shade.map((c) => <span key={c} style={{ width: 8, height: 8, borderRadius: 1.5, background: c, margin: "0 1px" }} />)}
                    More
                  </div>
                </div>
              )}
              {mainBody(k)}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
