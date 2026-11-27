import Icon from "./Icon";
import { Photo, TimelineItem, contactItems, pageStyle } from "./shared";
import { SectionBody, fontOf, photoOf, pick, SECTION_META } from "./kit";

const LEFT_KEYS = ["skills", "languages", "interests", "certifications"];
const RIGHT_KEYS = ["experience", "education", "projects"];

// Soft curved shapes, outlined pill headings, language bars and interest icons.
export default function Sandstone({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  const shape = { position: "absolute", pointerEvents: "none" };
  const showSummary = pick(data, ["summary"]).length > 0;

  const Pill = ({ children }) => (
    <div style={{ position: "relative", height: 38, marginBottom: 16 }}>
      <div style={{ position: "absolute", inset: "5px 12px 0 0", background: accent, borderRadius: 999 }} />
      <div style={{ position: "absolute", inset: "0 0 5px 12px", border: `1.5px solid ${primary}`, borderRadius: 999 }} />
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: primary,
        }}
      >
        {children}
      </div>
    </div>
  );

  const leftOpts = {
    primary,
    light,
    text: "#3a3a3a",
    muted: "#6b6b6b",
    fs: 12,
    skillStyle: "list",
    langStyle: "bars",
    interestStyle: "icons",
    barColor: primary,
    track: light,
  };

  const timelineEntry = (id, title, lines2, bullets) => (
    <TimelineItem key={id} color={primary} gap={12}>
      <div style={{ fontSize: 14.5, fontWeight: 600, color: primary, textDecoration: "underline", textTransform: "uppercase" }}>
        {title}
      </div>
      {lines2.filter(Boolean).map((l, i) => (
        <div key={i} style={{ fontSize: 12 }}>
          {l}
        </div>
      ))}
      {bullets.length > 0 && (
        <ul style={{ listStyle: "disc", paddingLeft: 18, margin: "4px 0 0", fontSize: 11.5, lineHeight: 1.5 }}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </TimelineItem>
  );

  const split = (t = "") => t.split("\n").map((l) => l.trim()).filter(Boolean);
  const range = (a, b) => [a, b].filter(Boolean).join(" – ");
  const rightSection = {
    experience: () =>
      data.experience.map((ex) =>
        timelineEntry(ex.id, ex.company, [ex.role, [range(ex.start, ex.end), ex.location].filter(Boolean).join(" · ")], split(ex.bullets))
      ),
    education: () =>
      data.education.map((ed) =>
        timelineEntry(ed.id, ed.school, [ed.degree, [range(ed.start, ed.end), ed.grade].filter(Boolean).join(" · ")], [])
      ),
    projects: () => data.projects.map((pr) => timelineEntry(pr.id, pr.name, [pr.link], split(pr.description))),
  };

  return (
    <div
      className="resume-page"
      style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: "#3a3a3a", display: "flex", flexDirection: "column" })}
    >
      {/* Background shapes */}
      <div style={{ ...shape, left: -60, top: 28, width: 390, height: 300, borderRadius: "0 150px 150px 0", background: accent }} />
      <div style={{ ...shape, left: -60, top: 44, width: 404, height: 300, borderRadius: "0 150px 150px 0", border: `2px solid ${primary}` }} />
      <div style={{ ...shape, right: -50, top: -30, width: 110, height: 380, borderRadius: "0 0 55px 55px", background: accent }} />
      <div style={{ ...shape, right: -38, top: -30, width: 110, height: 392, borderRadius: "0 0 55px 55px", border: `2px solid ${primary}` }} />
      <div style={{ ...shape, left: -70, top: 360, width: 110, height: 190, borderRadius: "0 95px 95px 0", background: light }} />

      <header style={{ display: "flex", position: "relative", height: 370 }}>
        <div style={{ width: 340, position: "relative", flexShrink: 0 }}>
          <Photo
            src={photoOf(data, theme)}
            name={p.name}
            size={232}
            placeholderBg={primary}
            style={{ position: "absolute", left: 60, top: 62, border: "6px solid #fff" }}
          />
        </div>
        <div style={{ flex: 1, paddingTop: 54, paddingRight: 96, paddingLeft: 28 }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.05, color: primary, margin: 0 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 15, fontWeight: 600, color: primary, marginTop: 8 }}>{p.title}</div>}
          {showSummary && <p data-section="summary" style={{ fontSize: 11.5, lineHeight: 1.6, marginTop: 18 }}>{p.summary}</p>}
        </div>
      </header>

      <div style={{ display: "flex", gap: 40, padding: "0 70px 0 56px", flex: 1, position: "relative" }}>
        <div style={{ width: 240, flexShrink: 0 }}>
          {pick(data, LEFT_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 26 }}>
              <Pill>{SECTION_META[k].title}</Pill>
              <div style={{ paddingLeft: 14 }}>
                <SectionBody k={k} data={data} o={leftOpts} />
              </div>
            </section>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {pick(data, RIGHT_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 22 }}>
              <Pill>{SECTION_META[k].title}</Pill>
              {rightSection[k]()}
            </section>
          ))}
        </div>
      </div>

      <footer style={{ position: "relative", marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "0 56px 18px", fontSize: 11 }}>
          {contactItems(p).map((c) => (
            <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name={c.icon} size={18} color={primary} strokeWidth={1.6} />
              {c.value}
            </span>
          ))}
        </div>
        <div style={{ height: 16, background: accent, margin: "0 30px", borderRadius: "12px 12px 0 0" }} />
      </footer>
    </div>
  );
}
