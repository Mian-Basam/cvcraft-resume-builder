// Interface CV: a dashboard screen — dark navigation sidebar listing the sections, a top bar with breadcrumbs, KPI tiles and compact content cards.
import { pageStyle, mix, lines, dateRange, contactItems, Photo } from "../../shared";
import { SECTION_META, fontOf, pick, photoOf, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const ALL = ["summary", "experience", "education", "projects", "skills", "languages", "certifications", "interests"];

export default function InterfaceCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const grot = fontStack("spacegrotesk");
  const mono = fontStack("plexmono");
  const side = mix(primary, "#0c0f14", 0.55);
  const canvas = mix(primary, "#f3f5f8", 0.93);
  const ink = "#161a22";
  const text = "#303643";
  const muted = "#6b7280";
  const border = "#e2e6ec";
  const tint = mix(primary, "#ffffff", 0.9);
  const fs = 11.5;

  const keys = pick(data, ALL);
  const has = (k) => keys.includes(k);

  const Card = ({ k, children, style, action }) => (
    <section data-section={k} style={{ background: "#ffffff", border: `1px solid ${border}`, borderRadius: 12, padding: "15px 17px 16px", boxShadow: "0 1px 2px rgba(16,24,40,0.04)", breakInside: "avoid", minWidth: 0, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 22, height: 22, borderRadius: 6, background: tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={SECTION_META[k].icon} size={12} color={primary} />
        </span>
        <span style={{ fontFamily: grot, fontSize: 13, fontWeight: 700, color: ink }}>{SECTION_META[k].title}</span>
        <span style={{ flex: 1 }} />
        {action && <span style={{ fontSize: 10, color: muted, border: `1px solid ${border}`, borderRadius: 6, padding: "1px 7px" }}>{action}</span>}
        <span style={{ display: "flex", gap: 2.5 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#a0a7b3" }} />
          ))}
        </span>
      </div>
      {children}
    </section>
  );

  const Row = ({ t, s, d, b, mark, lastOne }) => (
    <div style={{ display: "grid", gridTemplateColumns: "30px 1fr", columnGap: 11, paddingBottom: lastOne ? 0 : 13, marginBottom: lastOne ? 0 : 13, borderBottom: lastOne ? "none" : `1px dashed ${border}`, breakInside: "avoid" }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: mix(primary, "#ffffff", 0.15), color: "#ffffff", fontFamily: grot, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{mark}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ink }}>{t}</div>
          {d && <span style={{ fontSize: 10, fontWeight: 600, color: primary, background: tint, borderRadius: 999, padding: "2px 9px", whiteSpace: "nowrap" }}>{d}</span>}
        </div>
        {s && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{s}</div>}
        {b.map((x, n) => (
          <div key={n} style={{ display: "flex", gap: 8, fontSize: fs, lineHeight: 1.5, color: text, marginTop: n ? 1 : 5 }}>
            <span style={{ width: 4, height: 4, borderRadius: 1, background: accent, flexShrink: 0, marginTop: 7, outline: `1px solid ${mix(accent, "#000000", 0.25)}` }} />
            <span>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );
  const initial = (str) => (str || "?").trim().charAt(0).toUpperCase();

  const kpis = [
    ["experience", "Roles", data.experience.length],
    ["projects", "Projects", data.projects.length],
    ["skills", "Skills", data.skills.length],
    ["certifications", "Certificates", data.certifications.length],
  ].filter(([k, , n]) => n > 0 && has(k));

  const contacts = contactItems(p);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text, background: canvas, display: "flex" })}>
      {/* navigation sidebar */}
      <aside style={{ width: 200, flexShrink: 0, background: side, color: "#ffffff", padding: "24px 16px 22px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: grot, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, marginBottom: 24, color: "#ffffff" }}>
          <span style={{ display: "grid", gridTemplateColumns: "6px 6px", gap: 2 }}>
            {[1, 0.5, 0.5, 1].map((o, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: 1.5, background: accent, opacity: o }} />
            ))}
          </span>
          PROFILE.OS
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 9 }}>
          <Photo src={photoOf(data, theme)} name={p.name} size={40} placeholderBg={mix(primary, "#ffffff", 0.25)} style={{ border: `2px solid ${accent}` }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25 }}>{p.name}</div>
            {p.title && <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>{p.title}</div>}
          </div>
        </div>

        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.8, color: "rgba(255,255,255,0.45)", margin: "24px 0 8px 8px" }}>MENU</div>
        {keys.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 9px", borderRadius: 8, marginBottom: 2, fontSize: 11.5, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.72)", background: i === 0 ? "rgba(255,255,255,0.1)" : "transparent", position: "relative" }}>
            {i === 0 && <span style={{ position: "absolute", left: -16, top: 6, bottom: 6, width: 3, borderRadius: 3, background: accent }} />}
            <Icon name={SECTION_META[k].icon} size={13} color={i === 0 ? accent : "rgba(255,255,255,0.6)"} />
            {SECTION_META[k].title}
            <span style={{ flex: 1 }} />
            {data[k]?.length > 0 && <span style={{ fontFamily: mono, fontSize: 9.5, color: "rgba(255,255,255,0.5)" }}>{data[k].length}</span>}
          </div>
        ))}

        <div style={{ flex: 1 }} />
        {contacts.length > 0 && (
          <div data-section="contact" style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14 }}>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.8, color: "rgba(255,255,255,0.45)", margin: "0 0 9px 2px" }}>CONTACT</div>
            {contacts.map((c) => (
              <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 10.5, color: "rgba(255,255,255,0.85)", marginBottom: 8 }}>
                <Icon name={c.icon} size={12} color={accent} />
                <span style={{ wordBreak: "break-word" }}>{c.value}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* dashboard */}
      <main style={{ flex: 1, minWidth: 0, padding: "22px 22px 22px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: `1px solid ${border}` }}>
          <div style={{ fontSize: 11, color: muted }}>
            Résumé <span style={{ margin: "0 5px" }}>/</span> <span style={{ color: ink, fontWeight: 600 }}>Overview</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: muted, background: "#ffffff", border: `1px solid ${border}`, borderRadius: 8, padding: "4px 10px", width: 150 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              Search profile…
            </span>
            <span style={{ width: 24, height: 24, borderRadius: 8, background: primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="user" size={12} color="#ffffff" />
            </span>
          </div>
        </div>

        <div style={{ margin: "22px 0 18px" }}>
          <h1 style={{ margin: 0, fontFamily: grot, fontSize: 30, fontWeight: 700, letterSpacing: -0.8, color: ink, lineHeight: 1.1 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 12.5, color: muted, marginTop: 3 }}>{p.title}</div>}
        </div>

        {kpis.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${kpis.length}, 1fr)`, gap: 10, marginBottom: 14 }}>
            {kpis.map(([k, label, n], i) => (
              <div key={k} style={{ background: i === 0 ? primary : "#ffffff", color: i === 0 ? "#ffffff" : ink, border: `1px solid ${i === 0 ? primary : border}`, borderRadius: 12, padding: "12px 13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, color: i === 0 ? "rgba(255,255,255,0.75)" : muted }}>
                  {label}
                  <Icon name={SECTION_META[k].icon} size={12} color={i === 0 ? accent : primary} />
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontFamily: grot, fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{String(n).padStart(2, "0")}</span>
                  <span style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 18 }}>
                    {[5, 9, 7, 12, 10, 16].map((hgt, j) => (
                      <span key={j} style={{ width: 3, height: hgt, borderRadius: 1, background: i === 0 ? accent : mix(primary, "#ffffff", 0.55), opacity: 0.5 + j * 0.1 }} />
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {has("summary") && (
            <Card k="summary">
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: text }}>{p.summary}</p>
            </Card>
          )}
          {has("experience") && (
            <Card k="experience" action={`${data.experience.length} items`}>
              {data.experience.map((e, j) => (
                <Row key={e.id} lastOne={j === data.experience.length - 1} mark={initial(e.company || e.role)} t={e.role} s={[e.company, e.location].filter(Boolean).join(" · ")} d={dateRange(e.start, e.end)} b={lines(e.bullets)} />
              ))}
            </Card>
          )}
          {(has("education") || has("projects")) && (
            <div style={{ display: "grid", gridTemplateColumns: has("education") && has("projects") ? "1fr 1fr" : "1fr", gap: 14, alignItems: "stretch" }}>
              {has("education") && (
                <Card k="education">
                  {data.education.map((e, j) => (
                    <div key={e.id} style={{ marginTop: j ? 9 : 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: ink }}>{e.degree}</div>
                      <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{[e.school, e.grade].filter(Boolean).join(" · ")}</div>
                      {(e.start || e.end) && <div style={{ display: "inline-block", fontSize: 10, fontWeight: 600, color: primary, background: tint, borderRadius: 999, padding: "2px 9px", marginTop: 6 }}>{dateRange(e.start, e.end)}</div>}
                    </div>
                  ))}
                </Card>
              )}
              {has("projects") && (
                <Card k="projects">
                  {data.projects.map((e, j) => (
                    <div key={e.id} style={{ marginTop: j ? 9 : 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: ink }}>{e.name}</div>
                      {e.link && <div style={{ fontFamily: mono, fontSize: 10, color: primary, marginTop: 2, wordBreak: "break-word" }}>{e.link}</div>}
                      {lines(e.description).map((x, n) => (
                        <div key={n} style={{ fontSize: fs, lineHeight: 1.5, color: text, marginTop: 4 }}>{x}</div>
                      ))}
                    </div>
                  ))}
                </Card>
              )}
            </div>
          )}
          {has("skills") && (
            <Card k="skills" action="Level">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 22, rowGap: 10 }}>
                {data.skills.map((s) => (
                  <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr 60px 26px", alignItems: "center", gap: 8, fontSize: fs, color: text }}>
                    <span style={{ fontWeight: 600, color: ink }}>{s.name}</span>
                    <span style={{ height: 5, borderRadius: 5, background: "#edf0f4" }}>
                      <span style={{ display: "block", height: "100%", width: `${s.level ?? 0}%`, borderRadius: 5, background: primary }} />
                    </span>
                    <span style={{ fontFamily: mono, fontSize: 10, color: muted, textAlign: "right" }}>{s.level ?? 0}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {(has("languages") || has("certifications") || has("interests")) && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${["languages", "certifications", "interests"].filter(has).length}, 1fr)`, gap: 14 }}>
              {has("languages") && (
                <Card k="languages">
                  {data.languages.map((l) => (
                    <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: fs, color: ink, marginBottom: 5 }}>
                      <span style={{ fontWeight: 600 }}>{l.name}</span>
                      <span style={{ fontSize: 10, color: muted }}>{levelWord(l.level)}</span>
                    </div>
                  ))}
                </Card>
              )}
              {has("certifications") && (
                <Card k="certifications">
                  {data.certifications.map((c) => (
                    <div key={c.id} style={{ marginBottom: 5 }}>
                      <div style={{ fontSize: fs, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{c.name}</div>
                      <div style={{ fontSize: 10.5, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
                    </div>
                  ))}
                </Card>
              )}
              {has("interests") && (
                <Card k="interests">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {data.interests.map((x) => (
                      <span key={x.id} style={{ fontSize: 10.5, fontWeight: 600, color: ink, background: canvas, border: `1px solid ${border}`, borderRadius: 6, padding: "2px 8px" }}>{x.name}</span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
