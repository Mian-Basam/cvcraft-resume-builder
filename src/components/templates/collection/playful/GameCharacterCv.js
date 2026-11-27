// The Game Character CV: a retro RPG character sheet — notched pixel panels, class/level header with HP/MP/XP bars, stat blocks, quest log, achievements and inventory.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { fontOf, pick, levelWord } from "../../kit";
import Icon, { interestIcon } from "../../Icon";
import { fontStack } from "@/lib/palettes";

const LEFT = ["skills", "languages", "certifications", "interests"];
const RIGHT = ["summary", "experience", "projects", "education"];
const TITLES = {
  summary: "Character lore",
  experience: "Quest log",
  projects: "Side quests",
  education: "Training grounds",
  skills: "Stats",
  languages: "Dialects",
  certifications: "Achievements",
  interests: "Inventory",
};

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

// A notched "pixel" frame: a solid outline with the corners stepped in.
const pixelBox = (color, w = 3) => ({
  boxShadow: `0 -${w}px 0 0 ${color}, 0 ${w}px 0 0 ${color}, -${w}px 0 0 0 ${color}, ${w}px 0 0 0 ${color}`,
});

export default function GameCharacterCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const pixel = fontStack("pixel");
  const ink = mix(theme.dark || "#1b1b1b", primary, 0.35);
  const muted = mix(ink, "#ffffff", 0.4);
  const page = mix(primary, "#ffffff", 0.9);
  const bar = primary;
  const glow = mix(accent, "#ffffff", 0.15);
  const reward = "#1f9d55";

  const years = data.experience.map((e) => parseInt(e.start, 10)).filter((n) => n > 1900);
  const level = years.length ? Math.max(1, new Date().getFullYear() - Math.min(...years)) : Math.max(1, data.experience.length);

  const Head = ({ k }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: pixel, fontSize: 10.5, lineHeight: 1.4, color: primary, textTransform: "uppercase", marginBottom: 12 }}>
      <span>▶</span>
      {TITLES[k]}
    </div>
  );

  const Panel = ({ k, children, style }) => (
    <section data-section={k} style={{ background: "#ffffff", ...pixelBox(ink), padding: "16px 18px", marginBottom: 21, ...style }}>
      <Head k={k} />
      {children}
    </section>
  );

  const blocks = (value, n = 10, on = bar, off = mix(primary, "#ffffff", 0.85)) => (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ flex: 1, height: 10, background: i < Math.round((value / 100) * n) ? on : off }} />
      ))}
    </div>
  );

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: ink }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, i) => {
        const active = /present|now|current/i.test(e.end || "") || !e.end;
        return (
          <div key={e.id} style={{ marginTop: i ? 16 : 0, paddingTop: i ? 16 : 0, borderTop: i ? `2px dashed ${mix(primary, "#ffffff", 0.75)}` : "none", breakInside: "avoid" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: pixel, fontSize: 10, color: "#ffffff", background: active ? primary : muted, padding: "4px 6px 3px" }}>{active ? "ACTIVE" : "CLEARED"}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: muted, letterSpacing: 0.5 }}>{active ? "MAIN QUEST" : `QUEST ${String(data.experience.length - i).padStart(2, "0")}`}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: primary, whiteSpace: "nowrap" }}>{dateRange(e.start, e.end)}</span>
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 900, color: ink }}>{e.role}</div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: muted }}>{[e.company, e.location].filter(Boolean).join(" · ")}</div>
            {lines(e.bullets).map((b, j) => (
              <div key={j} style={{ display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.5, marginTop: 5, color: ink }}>
                <span style={{ fontWeight: 900, color: reward, flexShrink: 0, fontSize: 11, marginTop: 1 }}>+XP</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        );
      });
    if (k === "projects")
      return data.projects.map((e, i) => (
        <div key={e.id} style={{ marginTop: i ? 10 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 13.5, fontWeight: 900, color: ink }}>{e.name}</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: reward, whiteSpace: "nowrap" }}>✓ COMPLETE</span>
          </div>
          {e.link && <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>{e.link}</div>}
          {lines(e.description).map((b, j) => (
            <div key={j} style={{ fontSize: 12, lineHeight: 1.5, color: ink, marginTop: 2 }}>{b}</div>
          ))}
        </div>
      ));
    if (k === "education")
      return data.education.map((e, i) => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: i ? 8 : 0 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 900, color: ink }}>{e.degree}</div>
            <div style={{ fontSize: 11.5, color: muted, fontWeight: 600 }}>{[e.school, e.grade].filter(Boolean).join(" · ")}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: primary, whiteSpace: "nowrap" }}>{dateRange(e.start, e.end)}</span>
        </div>
      ));
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12, fontWeight: 800, color: ink, marginBottom: 4 }}>
            <span>{s.name}</span>
            <span style={{ fontFamily: pixel, fontSize: 10, color: primary }}>{s.level ?? 0}</span>
          </div>
          {blocks(s.level ?? 0)}
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: ink, marginBottom: 5 }}>
          <b>{l.name}</b>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c, i) => (
        <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: i ? 8 : 0, background: mix(accent, "#ffffff", 0.7), padding: "7px 9px" }}>
          <span style={{ width: 28, height: 28, background: ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="star" size={16} color={glow} strokeWidth={2.4} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: 0.8, color: muted }}>UNLOCKED{c.year ? ` · ${c.year}` : ""}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: ink, lineHeight: 1.3 }}>{c.name}</div>
            {c.issuer && <div style={{ fontSize: 11, color: muted }}>{c.issuer}</div>}
          </div>
        </div>
      ));
    const slots = Math.max(4, Math.ceil(data.interests.length / 2) * 2);
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {Array.from({ length: slots }, (_, i) => {
          const it = data.interests[i];
          return (
            <div key={i} style={{ minHeight: 56, background: it ? mix(primary, "#ffffff", 0.9) : mix(primary, "#ffffff", 0.96), border: `2px solid ${it ? mix(primary, "#ffffff", 0.55) : mix(primary, "#ffffff", 0.84)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "4px 6px", boxSizing: "border-box", minWidth: 0, textAlign: "center" }}>
              {it ? (
                <>
                  <Icon name={interestIcon(it.name)} size={18} color={primary} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: ink, lineHeight: 1.15, minWidth: 0, overflowWrap: "break-word" }}>{it.name}</span>
                </>
              ) : (
                <span style={{ fontSize: 10.5, color: mix(primary, "#ffffff", 0.6), fontWeight: 700 }}>empty slot</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const left = pick(data, LEFT);
  const right = pick(data, RIGHT);
  const contacts = contactItems(p);
  const meters = [
    ["HP", "Coffee", 100],
    ["MP", "Creativity", 95],
    ["XP", `To level ${level + 1}`, 72],
  ];

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "nunito"), color: ink, background: page, padding: "28px 30px 30px", boxSizing: "border-box", display: "flex", flexDirection: "column" })}>
      {/* character header */}
      <header style={{ background: primary, color: "#ffffff", ...pixelBox(ink, 4), padding: "18px 20px", display: "flex", gap: 20, marginBottom: 28 }}>
        <div style={{ width: 112, height: 112, flexShrink: 0, background: mix(primary, "#ffffff", 0.15), ...pixelBox(glow, 3), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontFamily: pixel, fontSize: 26, color: glow }}>{initials(p.name) || "P1"}</span>
          <span style={{ fontFamily: pixel, fontSize: 10, color: "#ffffff" }}>LV {level}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: pixel, fontSize: 10, color: glow, marginBottom: 6 }}>PLAYER 1 · READY</div>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.05, fontWeight: 900, letterSpacing: -0.3 }}>{p.name}</h1>
          {p.title && (
            <div style={{ fontSize: 14, fontWeight: 800, marginTop: 4, color: mix("#ffffff", accent, 0.35) }}>
              Class: {p.title}
            </div>
          )}
          {contacts.length > 0 && (
            <div data-section="contact" style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 10, fontSize: 11.5 }}>
              {contacts.map((c) => (
                <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name={c.icon} size={12} color={glow} />
                  {c.value}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 9 }}>
          {meters.map(([tag, label, v]) => (
            <div key={tag}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, marginBottom: 3 }}>
                <span>
                  <span style={{ fontFamily: pixel, fontSize: 10, color: glow, marginRight: 6 }}>{tag}</span>
                  {label}
                </span>
                <span>{v}%</span>
              </div>
              <div style={{ height: 10, background: mix(primary, "#000000", 0.35), padding: 2, boxSizing: "border-box" }}>
                <div style={{ height: "100%", width: `${v}%`, background: tag === "HP" ? "#3ddc84" : tag === "MP" ? glow : "#ffffff" }} />
              </div>
            </div>
          ))}
        </div>
      </header>

      <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
        <aside style={{ width: 252, flexShrink: 0, padding: "0 3px" }}>
          {left.map((k) => (
            <Panel key={k} k={k}>
              {body(k)}
            </Panel>
          ))}
        </aside>
        <main style={{ flex: 1, minWidth: 0, padding: "0 3px" }}>
          {right.map((k) => (
            <Panel key={k} k={k}>
              {body(k)}
            </Panel>
          ))}
        </main>
      </div>

      <div style={{ marginTop: "auto", background: ink, color: "#ffffff", ...pixelBox(ink, 4), padding: 4 }}>
        <div style={{ border: `3px solid ${mix("#ffffff", ink, 0.15)}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ flex: 1, fontSize: 13, lineHeight: 1.6 }}>
            <span style={{ fontFamily: pixel, fontSize: 10.5, color: glow, marginRight: 10 }}>GUIDE:</span>
            A wild {p.title || "professional"} appeared! They are well-equipped and ready for their next big quest. Recruit them to your party?
          </div>
          <div style={{ fontFamily: pixel, fontSize: 10.5, lineHeight: 2, flexShrink: 0 }}>
            <div style={{ color: glow }}>▶ YES!</div>
            <div style={{ color: mix("#ffffff", ink, 0.4) }}>&nbsp; NO</div>
          </div>
        </div>
      </div>
    </div>
  );
}
