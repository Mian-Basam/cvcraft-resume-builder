// Spatial Resume: asymmetric composition with an oversized name, floating 3D-shaded spheres and rings casting soft shadows, generous whitespace and staggered floating cards.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { SECTION_META, fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const CARD_KEYS = ["skills", "languages", "certifications", "interests"];

export default function SpatialResume({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const grot = fontStack("spacegrotesk");
  const ink = "#15161a";
  const text = "#2c2f36";
  const muted = "#6b707b";
  const fs = 11.5;

  const sphere = (c) => `radial-gradient(circle at 32% 28%, #ffffff 0%, ${mix(c, "#ffffff", 0.55)} 18%, ${c} 58%, ${mix(c, "#000000", 0.35)} 100%)`;
  const Floor = ({ style }) => <div style={{ position: "absolute", borderRadius: "50%", background: `radial-gradient(ellipse at center, ${mix(primary, "#000000", 0.4)}38 0%, rgba(0,0,0,0) 70%)`, ...style }} />;

  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const longest = Math.max(1, ...words.map((w) => w.length));
  const nameSize = Math.min(106, Math.floor(470 / (longest * 0.58)));

  const main = pick(data, MAIN_KEYS);
  const cards = pick(data, CARD_KEYS);
  const mainNoSummary = main.filter((k) => k !== "summary");

  const Entry = ({ t, s, d, b, lastOne }) => (
    <div style={{ marginBottom: lastOne ? 0 : 18, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontFamily: grot, fontSize: 16, fontWeight: 700, color: ink, letterSpacing: -0.3 }}>{t}</div>
        {d && <span style={{ fontSize: 11, color: muted, whiteSpace: "nowrap", fontWeight: 500 }}>{d}</span>}
      </div>
      {s && <div style={{ fontSize: fs, color: primary, fontWeight: 600, marginTop: 2 }}>{s}</div>}
      {b.map((x, n) => (
        <div key={n} style={{ display: "flex", gap: 10, fontSize: fs, lineHeight: 1.6, color: text, marginTop: n ? 1 : 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: sphere(accent), flexShrink: 0, marginTop: 6.5 }} />
          <span>{x}</span>
        </div>
      ))}
    </div>
  );

  const mainBody = (k) => {
    if (k === "experience")
      return data.experience.map((e, j) => <Entry key={e.id} lastOne={j === data.experience.length - 1} t={e.role} s={[e.company, e.location].filter(Boolean).join(", ")} d={dateRange(e.start, e.end)} b={lines(e.bullets)} />);
    if (k === "education")
      return data.education.map((e, j) => <Entry key={e.id} lastOne={j === data.education.length - 1} t={e.degree} s={[e.school, e.grade].filter(Boolean).join(" · ")} d={dateRange(e.start, e.end)} b={[]} />);
    return data.projects.map((e, j) => <Entry key={e.id} lastOne={j === data.projects.length - 1} t={e.name} s={e.link} d="" b={lines(e.description)} />);
  };

  const cardBody = (k) => {
    if (k === "skills")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.skills.map((s) => (
            <span key={s.id} style={{ fontSize: 11, fontWeight: 600, color: ink, background: mix(primary, "#ffffff", 0.9), borderRadius: 999, padding: "4px 11px" }}>{s.name}</span>
          ))}
        </div>
      );
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: fs, color: text, marginBottom: 5 }}>
          <span style={{ fontWeight: 600, color: ink }}>{l.name}</span>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 5 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ink }}>{c.name}</div>
          <div style={{ fontSize: 11, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    return <div style={{ fontFamily: grot, fontSize: 15, fontWeight: 500, color: ink, lineHeight: 1.45 }}>{data.interests.map((i) => i.name).join(" / ")}</div>;
  };

  const contacts = contactItems(p);
  const cardShadow = `0 22px 40px -12px ${mix(primary, "#000000", 0.3)}40, 0 2px 6px rgba(0,0,0,0.05)`;

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "spacegrotesk"), color: text, background: `linear-gradient(180deg, #ffffff 0%, ${mix(primary, "#ffffff", 0.95)} 100%)`, padding: "46px 50px 40px", boxSizing: "border-box" })}>
      {/* floating objects */}
      <div style={{ position: "absolute", right: 70, top: 30, width: 154, height: 154, borderRadius: "50%", background: sphere(primary) }} />
      <Floor style={{ right: 80, top: 200, width: 134, height: 20 }} />
      <div style={{ position: "absolute", right: 250, top: 64, width: 46, height: 46, borderRadius: "50%", background: sphere(accent) }} />
      <Floor style={{ right: 252, top: 124, width: 44, height: 10 }} />
      <div style={{ position: "absolute", right: 14, top: 600, width: 58, height: 58, borderRadius: "50%", border: `11px solid ${mix(accent, "#ffffff", 0.1)}`, boxSizing: "border-box", transform: "rotateX(62deg) rotate(20deg)", boxShadow: `inset 0 -3px 6px ${mix(accent, "#000000", 0.3)}66` }} />
      <div style={{ position: "absolute", left: 22, top: 560, width: 30, height: 30, borderRadius: 8, background: `linear-gradient(145deg, ${mix(primary, "#ffffff", 0.45)}, ${primary})`, transform: "rotate(24deg)", boxShadow: `0 12px 16px -6px ${mix(primary, "#000000", 0.3)}66` }} />
      <div style={{ position: "absolute", left: 40, bottom: 120, width: 18, height: 18, borderRadius: "50%", background: sphere(accent) }} />

      <header style={{ position: "relative" }}>
        <h1 style={{ margin: 0, fontFamily: grot, fontSize: nameSize, fontWeight: 700, lineHeight: 0.86, letterSpacing: -nameSize * 0.055, color: ink }}>
          {words.map((w, i) => (
            <div key={i} style={{ paddingLeft: i % 2 ? Math.round(nameSize * 0.9) : 0, color: i % 2 ? primary : ink }}>{w}</div>
          ))}
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 30, marginTop: 24, alignItems: "end" }}>
          {p.title ? (
            <div style={{ fontFamily: grot, fontSize: 20, fontWeight: 500, color: ink, letterSpacing: -0.3, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 34, height: 2, background: accent }} />
              {p.title}
            </div>
          ) : (
            <div />
          )}
          {contacts.length > 0 && (
            <div data-section="contact" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 18px", fontSize: 11.5, color: text }}>
              {contacts.map((c) => (
                <span key={c.icon} style={{ wordBreak: "break-word" }}>{c.value}</span>
              ))}
            </div>
          )}
        </div>
      </header>

      {main.includes("summary") && (
        <section data-section="summary" style={{ marginTop: 32, marginLeft: 170, marginRight: 60 }}>
          <p style={{ margin: 0, fontFamily: grot, fontSize: 18, lineHeight: 1.5, fontWeight: 400, color: ink, letterSpacing: -0.2 }}>{p.summary}</p>
        </section>
      )}

      <div style={{ marginTop: 30 }}>
        {mainNoSummary.map((k) => (
          <section key={k} data-section={k} style={{ display: "grid", gridTemplateColumns: "170px 1fr", marginBottom: 22 }}>
            <div style={{ fontFamily: grot, fontSize: 24, fontWeight: 300, letterSpacing: -0.8, color: ink, lineHeight: 1, paddingTop: 1 }}>
              {SECTION_META[k].title.toLowerCase()}
              <span style={{ color: accent }}>.</span>
            </div>
            <div style={{ paddingRight: 40 }}>{mainBody(k)}</div>
          </section>
        ))}
      </div>

      {cards.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 22, rowGap: 14, marginTop: 6, marginLeft: 120, alignItems: "start" }}>
          {cards.map((k, i) => (
            <section key={k} data-section={k} style={{ background: "#ffffff", borderRadius: 18, padding: "15px 18px 13px", boxShadow: cardShadow, transform: i % 2 ? "translateY(18px)" : "none" }}>
              <div style={{ fontFamily: grot, fontSize: 11, fontWeight: 700, letterSpacing: 2.4, textTransform: "uppercase", color: muted, marginBottom: 9, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: sphere(i % 2 ? accent : primary) }} />
                {SECTION_META[k].title}
              </div>
              {cardBody(k)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
