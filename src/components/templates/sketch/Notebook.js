import { contactItems, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, pick } from "../kit";
import { INK, Marker, SketchPortrait, Underline, hand, usesPhoto } from "../sketchKit";

const MAIN_KEYS = ["experience", "education", "projects", "certifications"];
const SIDE_KEYS = ["skills", "languages", "interests"];

// Sketch: a page from a lined school notebook, with spiral holes, a red margin line,
// highlighter headings and a pen-drawn girl in the top corner.
export default function Notebook({ data, theme }) {
  const { accent } = theme;
  const p = data.personal;
  const muted = "#5a5650";
  const marker = mix(accent, "#ffffff", 0.35);
  const o = { primary: INK, light: mix(accent, "#ffffff", 0.6), text: INK, muted, subColor: mix(accent, "#000000", 0.5), fs: 11.5, dateStyle: "right" };
  const sideO = { ...o, skillStyle: "tags", tagBg: mix(accent, "#ffffff", 0.7), tagBorder: "transparent", langStyle: "dots", interestStyle: "inline", barColor: mix(accent, "#000000", 0.15) };

  const Heading = ({ title }) => (
    <h3 style={{ fontFamily: hand, fontSize: 28, fontWeight: 700, margin: "0 0 8px", color: INK, lineHeight: 1.1 }}>
      <Marker color={marker}>{title}</Marker>
    </h3>
  );

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "lato"),
        color: INK,
        position: "relative",
        backgroundColor: "#fdfcf6",
        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #cddcec 27px, #cddcec 28px)",
        backgroundPosition: "0 96px",
        padding: "36px 40px 30px 112px",
      })}
    >
      {/* Red margin line and spiral holes */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 90, borderLeft: "2px solid #e8a3a3" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 94, borderLeft: "1px solid #f0c4c4" }} />
      {Array.from({ length: 22 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 26, top: 30 + i * 50, width: 18, height: 18, borderRadius: "50%", background: "#e9e4d8", boxShadow: "inset 2px 2px 3px rgba(0,0,0,0.25)" }} />
      ))}

      <header style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 6 }}>
          <h1 style={{ fontFamily: hand, fontSize: 62, fontWeight: 700, lineHeight: 0.95, margin: 0 }}>{p.name}</h1>
          <Underline width={280} />
          {p.title && (
            <div style={{ fontFamily: hand, fontSize: 28, marginTop: 8 }}>
              <Marker color={marker}>{p.title}</Marker>
            </div>
          )}
          <div data-section="contact" style={{ fontFamily: hand, fontSize: 19, color: muted, marginTop: 12, display: "flex", flexWrap: "wrap", gap: "2px 14px" }}>
            {contactItems(p).map((c) => (
              <span key={c.icon}>✎ {c.value}</span>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: usesPhoto(data, theme) ? 8 : -10, transform: "rotate(2deg)" }}>
          <SketchPortrait data={data} theme={theme} width={170} photoStyle={{ border: "6px solid #fff", boxShadow: "0 3px 10px rgba(0,0,0,0.15)" }} />
        </div>
      </header>

      {pick(data, ["summary"]).length > 0 && (
        <section data-section="summary" style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: hand, fontSize: 21, lineHeight: 1.3, margin: 0 }}>{p.summary}</p>
        </section>
      )}

      <div style={{ display: "flex", gap: 28 }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 16 }}>
              <Heading title={SECTION_META[k].title} />
              <SectionBody k={k} data={data} o={o} />
            </section>
          ))}
        </main>
        <aside style={{ width: 200, flexShrink: 0 }}>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 16 }}>
              <Heading title={SECTION_META[k].title} />
              <SectionBody k={k} data={data} o={sideO} />
            </section>
          ))}
          <div style={{ fontFamily: hand, fontSize: 20, color: muted, transform: "rotate(-4deg)", marginTop: 10 }}>☺ thanks for reading!</div>
        </aside>
      </div>
    </div>
  );
}
