import { contactItems, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, pick } from "../kit";
import { INK, SketchPortrait, Underline, hand } from "../sketchKit";
import { fontStack } from "@/lib/palettes";

const LEFT_KEYS = ["skills", "languages", "interests"];
const RIGHT_KEYS = ["experience", "education", "projects", "certifications"];

// Sketch: an open journal, two pages with a shadowed gutter and a ribbon bookmark.
// The left page holds the sketch girl and the person; the right page holds their story.
export default function JournalSpread({ data, theme }) {
  const { accent } = theme;
  const p = data.personal;
  const serif = fontStack("playfair");
  const muted = "#5e564b";
  const deep = mix(accent, "#000000", 0.5);
  const o = { primary: INK, light: mix(accent, "#ffffff", 0.6), text: INK, muted, subColor: deep, fs: 11, dateStyle: "below" };
  const sideO = { ...o, skillStyle: "bars", barColor: accent, track: "rgba(0,0,0,0.1)", langStyle: "dots", interestStyle: "inline" };

  const Heading = ({ title }) => (
    <div style={{ margin: "0 0 8px" }}>
      <h3 style={{ fontFamily: serif, fontStyle: "italic", fontSize: 22, fontWeight: 600, margin: 0, color: INK }}>{title}</h3>
      <Underline width={Math.min(150, title.length * 11 + 20)} color={deep} />
    </div>
  );
  const page = { flex: 1, minWidth: 0, padding: "40px 34px 54px", position: "relative" };

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "lato"),
        color: INK,
        position: "relative",
        display: "flex",
        background: "linear-gradient(90deg, #ece2cc 0%, #f6f0e2 6%, #f4eddd 44%, #dccfb2 49.6%, #c9b994 50%, #dccfb2 50.4%, #f4eddd 56%, #f6f0e2 94%, #ece2cc 100%)",
      })}
    >
      {/* Ribbon bookmark */}
      <div style={{ position: "absolute", top: 0, left: 340, width: 22, height: 150, background: accent, zIndex: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)", boxShadow: "inset -3px 0 0 rgba(0,0,0,0.12)" }} />

      <div style={page}>
        <div style={{ fontFamily: hand, fontSize: 20, color: muted, marginBottom: 4 }}>chapter one ~</div>
        <div style={{ position: "relative", display: "flex", justifyContent: "center", margin: "0 0 6px" }}>
          <div style={{ position: "absolute", top: 26, width: 210, height: 210, borderRadius: "50%", background: mix(accent, "#ffffff", 0.7) }} />
          <SketchPortrait data={data} theme={theme} width={220} photoStyle={{ borderRadius: "50%", width: 210, margin: "14px 0", position: "relative" }} girlStyle={{ position: "relative" }} />
        </div>
        <h1 style={{ fontFamily: serif, fontStyle: "italic", fontSize: 38, fontWeight: 700, lineHeight: 1.05, margin: "6px 0 2px", textAlign: "center" }}>{p.name}</h1>
        {p.title && <div style={{ textAlign: "center", fontSize: 11.5, letterSpacing: 3, textTransform: "uppercase", color: deep, fontWeight: 700 }}>{p.title}</div>}
        <div style={{ textAlign: "center", color: deep, margin: "6px 0 10px", fontSize: 14 }}>❦</div>
        <div data-section="contact" style={{ fontFamily: hand, fontSize: 18, lineHeight: 1.3, textAlign: "center", marginBottom: 16 }}>
          {contactItems(p).map((c) => (
            <div key={c.icon} style={{ wordBreak: "break-word" }}>{c.value}</div>
          ))}
        </div>
        {pick(data, LEFT_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 14 }}>
            <Heading title={SECTION_META[k].title} />
            <SectionBody k={k} data={data} o={sideO} />
          </section>
        ))}
        <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", fontFamily: serif, fontStyle: "italic", fontSize: 12, color: muted }}>— 1 —</div>
      </div>

      <div style={page}>
        {pick(data, ["summary"]).length > 0 && (
          <section data-section="summary" style={{ marginBottom: 18, paddingRight: 30 }}>
            <p style={{ fontFamily: hand, fontSize: 21, lineHeight: 1.3, margin: 0 }}>
              <span style={{ fontFamily: serif, fontSize: 40, lineHeight: 0.6, float: "left", margin: "6px 6px 0 0", color: deep }}>“</span>
              {p.summary}
            </p>
          </section>
        )}
        {pick(data, RIGHT_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 16 }}>
            <Heading title={SECTION_META[k].title} />
            <SectionBody k={k} data={data} o={o} />
          </section>
        ))}
        <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", fontFamily: serif, fontStyle: "italic", fontSize: 12, color: muted }}>— 2 —</div>
      </div>
    </div>
  );
}
