import { contactItems, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, pick } from "../kit";
import { INK, SketchPortrait, Tape, hand, usesPhoto } from "../sketchKit";

const MAIN_KEYS = ["experience", "education", "projects", "certifications"];

// Sketch: a pinboard page: the sketch girl on a taped polaroid, sticky notes for contact,
// skills and languages, and washi-tape section headings.
export default function PolaroidTape({ data, theme }) {
  const { accent, primary } = theme;
  const p = data.personal;
  const muted = "#5c5750";
  const o = { primary: INK, light: mix(accent, "#ffffff", 0.6), text: INK, muted, subColor: mix(accent, "#000000", 0.5), fs: 11.5, dateStyle: "right" };
  const tapeColor = mix(accent, "#ffffff", 0.25);
  const showSkills = pick(data, ["skills"]).length > 0;
  const showLanguages = pick(data, ["languages"]).length > 0;
  const showInterests = pick(data, ["interests"]).length > 0;

  const Sticky = ({ k, bg, rotate, title, children }) => (
    <section data-section={k} style={{ background: bg, padding: "12px 14px 14px", margin: "0 0 16px", transform: `rotate(${rotate}deg)`, boxShadow: "2px 4px 8px rgba(0,0,0,0.12)", position: "relative" }}>
      <div style={{ position: "absolute", top: -8, left: "50%", marginLeft: -22, width: 44, height: 16, background: "rgba(255,255,255,0.6)", transform: "rotate(-3deg)" }} />
      <div style={{ fontFamily: hand, fontSize: 24, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: hand, fontSize: 19, lineHeight: 1.25 }}>{children}</div>
    </section>
  );

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "poppins"),
        color: INK,
        backgroundColor: "#f3f0e9",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        display: "flex",
        gap: 30,
        padding: "34px 38px 30px",
      })}
    >
      <aside style={{ width: 250, flexShrink: 0 }}>
        {/* Polaroid */}
        <div style={{ position: "relative", background: "#fff", padding: "12px 12px 46px", transform: "rotate(-3deg)", boxShadow: "0 6px 16px rgba(0,0,0,0.14)", margin: "8px 0 26px" }}>
          <div style={{ position: "absolute", top: -12, left: -14, width: 80, height: 24, background: tapeColor, opacity: 0.85, transform: "rotate(-35deg)" }} />
          <div style={{ position: "absolute", top: -10, right: -12, width: 80, height: 24, background: tapeColor, opacity: 0.85, transform: "rotate(32deg)" }} />
          <div style={{ background: mix(accent, "#ffffff", 0.78), display: "flex", justifyContent: "center", overflow: "hidden", height: 226 }}>
            <SketchPortrait data={data} theme={theme} width={usesPhoto(data, theme) ? 226 : 196} girlStyle={{ marginTop: 6 }} />
          </div>
          <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontFamily: hand, fontSize: 26, color: "#444" }}>
            {(p.name || "").split(" ")[0] || "me"} ♡
          </div>
        </div>

        <Sticky k="contact" bg={mix(accent, "#ffffff", 0.55)} rotate={1.5} title="find me">
          {contactItems(p).map((c) => (
            <div key={c.icon} style={{ wordBreak: "break-word" }}>{c.value}</div>
          ))}
        </Sticky>
        {showSkills && (
          <Sticky k="skills" bg="#fff6b8" rotate={-1.5} title="good at">
            {data.skills.map((s) => (
              <div key={s.id}>✓ {s.name}</div>
            ))}
          </Sticky>
        )}
        {showLanguages && (
          <Sticky k="languages" bg={mix(primary, "#ffffff", 0.82)} rotate={1} title="speaks">
            {data.languages.map((l) => l.name).join(", ")}
          </Sticky>
        )}
        {showInterests && (
          <Sticky k="interests" bg="#fde2e4" rotate={-1} title="loves">
            {data.interests.map((i) => i.name).join(", ")}
          </Sticky>
        )}
      </aside>

      <main style={{ flex: 1, minWidth: 0, paddingTop: 6 }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.05, margin: 0, letterSpacing: -0.5 }}>{p.name}</h1>
        {p.title && <div style={{ fontFamily: hand, fontSize: 28, color: mix(accent, "#000000", 0.45), marginTop: 2 }}>{p.title}</div>}
        {pick(data, ["summary"]).length > 0 && (
          <section data-section="summary" style={{ margin: "14px 0 20px", fontSize: 12, lineHeight: 1.65, color: "#3d3933" }}>
            {p.summary}
          </section>
        )}
        {pick(data, MAIN_KEYS).map((k, i) => (
          <section key={k} data-section={k} style={{ marginBottom: 18 }}>
            <Tape color={tapeColor} rotate={i % 2 ? 1.2 : -1.5} style={{ marginBottom: 10 }}>
              <span style={{ fontFamily: hand, fontSize: 24, fontWeight: 700, color: INK }}>{SECTION_META[k].title}</span>
            </Tape>
            <SectionBody k={k} data={data} o={o} />
          </section>
        ))}
      </main>
    </div>
  );
}
