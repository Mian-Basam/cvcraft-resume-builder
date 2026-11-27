import { contactItems, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, pick } from "../kit";
import { fontStack } from "@/lib/palettes";
import SketchGirl from "../sketchGirls";

// The ink-sketch girl this design is built around: a transparent PNG cut from the original sketch.
export const SKETCHBOOK_ART = "/templates/sketch-girl.png";

const MAIN_KEYS = ["experience", "education", "projects", "certifications"];
const SIDE_KEYS = ["skills", "languages", "interests"];
const INK = "#1f1c18";

// Premium: an annotated sketchbook page on aged paper: ink sketch, handwritten margin notes,
// a paint swatch in the template colour, a "note" card and a coffee ring.
// The sketch is shown unless the person picked "My photo" and uploaded one.
export default function Sketchbook({ data, theme }) {
  const { accent } = theme;
  const p = data.personal;
  const hand = fontStack("caveat");
  const muted = "#5c5448";
  const deepAccent = mix(accent, "#000000", 0.45);
  const usePhoto = theme.avatar === "photo" && p.photo;
  const showSummary = pick(data, ["summary"]).length > 0;
  const mainKeys = pick(data, MAIN_KEYS);
  const sideKeys = pick(data, SIDE_KEYS);

  const mainOpts = { primary: INK, light: mix(accent, "#ffffff", 0.6), text: INK, muted, subColor: deepAccent, fs: 11.5, dateStyle: "right" };
  const sideOpts = { primary: INK, light: mix(accent, "#ffffff", 0.6), text: INK, muted, fs: 11.5, barColor: accent, track: "rgba(31,28,24,0.12)", skillStyle: "bars", langStyle: "dots", interestStyle: "inline" };

  const Underline = ({ width = 150 }) => (
    <svg width={width} height="9" viewBox="0 0 150 9" preserveAspectRatio="none" style={{ display: "block" }}>
      <path d="M1 4 C40 1 90 7 149 3" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M8 8 C50 6 100 9 128 6.5" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
  const Heading = ({ title, size = 30 }) => (
    <div style={{ margin: "0 0 10px" }}>
      <div style={{ fontFamily: hand, fontSize: size, fontWeight: 700, color: INK, lineHeight: 1 }}>{title}</div>
      <Underline width={Math.min(170, title.length * size * 0.42 + 30)} />
    </div>
  );
  // A dab of paint, like the mustard swatch in the sketch.
  const Swatch = ({ width = 110, style }) => (
    <div style={{ width, height: 18, background: accent, opacity: 0.85, borderRadius: "40% 55% 45% 60% / 60% 40% 55% 45%", transform: "rotate(-1.5deg)", ...style }} />
  );

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "merriweather"),
        color: INK,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#efe4cc",
        backgroundImage: "radial-gradient(ellipse at 45% 35%, #f6eedd 0%, #eee2c8 60%, #dfcca6 100%)",
        padding: "34px 44px 30px",
      })}
    >
      {/* Folded top-right corner */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 64, height: 64, background: "linear-gradient(225deg, #2a2520 50%, #e3d4b3 50%)", boxShadow: "-3px 3px 6px rgba(0,0,0,0.15)" }} />

      {/* Header: margin note, name and title, paint swatch */}
      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: hand, fontSize: 22, color: muted }}>fig. 1</div>
          <h1 style={{ fontFamily: hand, fontSize: 56, fontWeight: 700, lineHeight: 0.95, margin: "2px 0 2px", color: INK }}>{p.name}</h1>
          <Underline width={260} />
          {p.title && <div style={{ fontFamily: hand, fontSize: 28, color: INK, marginTop: 6 }}>{p.title}</div>}
          <Swatch width={120} style={{ marginTop: 8 }} />
        </div>
        <div data-section="contact" style={{ fontFamily: hand, fontSize: 19, lineHeight: 1.35, textAlign: "right", paddingRight: 40 }}>
          <div style={{ color: muted, fontSize: 20 }}>p. 1</div>
          <div style={{ width: 70, borderTop: `1.5px solid ${INK}`, margin: "2px 0 6px auto" }} />
          {contactItems(p).map((c) => (
            <div key={c.icon} style={{ wordBreak: "break-word" }}>{c.value}</div>
          ))}
        </div>
      </header>

      <div style={{ display: "flex", gap: 34 }}>
        {/* Left: the sketch, then skills, languages and interests */}
        <aside style={{ width: 290, flexShrink: 0 }}>
          {usePhoto ? (
            // An uploaded photo sits in a frame, toned to match the paper.
            <figure style={{ margin: "0 0 6px", background: "#f3ead6", padding: 8, boxShadow: "0 4px 12px rgba(60,40,10,0.18)", transform: "rotate(-1.2deg)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.photo}
                alt={p.name || "Photo"}
                style={{ display: "block", width: "100%", aspectRatio: "1 / 1", objectFit: "cover", filter: "grayscale(0.35) sepia(0.3) contrast(1.05)" }}
              />
            </figure>
          ) : (
            theme.sketchGirl && theme.sketchGirl !== "reader" ? (
              <div style={{ width: 215, height: 258, margin: "0 auto" }}>
                <SketchGirl variant={theme.sketchGirl} accent={accent} />
              </div>
            ) : (
              // The original sketch is a transparent PNG, so it reads as drawn straight onto the page.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={SKETCHBOOK_ART} alt="" style={{ display: "block", width: 215, margin: "-6px auto 0" }} />
            )
          )}
          <div style={{ fontFamily: hand, fontSize: 18, color: muted, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span>↑</span> {usePhoto ? "the author, in person." : "quiet is not empty."}
          </div>

          {sideKeys.map((k) =>
            k === "interests" ? (
              // Interests on a hand-drawn "note" card.
              <section key={k} data-section={k} style={{ border: `1.6px solid ${INK}`, borderRadius: 3, padding: "10px 14px 12px", margin: "4px 6px 18px 0", transform: "rotate(0.8deg)", background: "rgba(255,255,255,0.25)" }}>
                <div style={{ fontFamily: hand, fontSize: 24, fontWeight: 700, lineHeight: 1 }}>note</div>
                <div style={{ width: 40, borderTop: `1.2px solid ${INK}`, margin: "3px 0 8px" }} />
                <div style={{ fontFamily: hand, fontSize: 20, lineHeight: 1.25 }}>{data.interests.map((i) => i.name).join(", ")}.</div>
              </section>
            ) : (
              <section key={k} data-section={k} style={{ marginBottom: 14 }}>
                <Heading title={SECTION_META[k].title} size={26} />
                <SectionBody k={k} data={data} o={sideOpts} />
              </section>
            ),
          )}

          {/* Leaf sprig, as in the margin of the sketch */}
          <svg width="46" height="90" viewBox="0 0 46 90" style={{ display: "block", margin: "6px 0 0 10px", opacity: 0.75 }} aria-hidden="true">
            <path d="M23 88 C22 60 24 30 26 4" stroke={INK} strokeWidth="1.3" fill="none" />
            {[12, 26, 40, 54, 68].map((y, i) => (
              <g key={y}>
                <path d={`M24 ${y + 8} C14 ${y + 6} 8 ${y} 6 ${y - 4} C14 ${y - 3} 20 ${y + 2} 24 ${y + 8} Z`} stroke={INK} strokeWidth="1" fill="none" transform={i % 2 ? "" : ""} />
                <path d={`M25 ${y + 2} C33 ${y} 39 ${y - 6} 41 ${y - 10} C33 ${y - 9} 27 ${y - 4} 25 ${y + 2} Z`} stroke={INK} strokeWidth="1" fill="none" />
              </g>
            ))}
          </svg>
        </aside>

        {/* Right: the summary as a quote, then the main sections */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {showSummary && (
            <section data-section="summary" style={{ marginBottom: 16, position: "relative" }}>
              <p style={{ fontFamily: hand, fontSize: 21, lineHeight: 1.25, margin: 0, color: INK }}>“{p.summary.trim()}”</p>
              <div style={{ fontFamily: hand, fontSize: 19, color: muted, textAlign: "right", marginTop: 4 }}>– {p.name}</div>
              <div style={{ width: 120, borderTop: `1.4px solid ${INK}`, margin: "4px 0 0 auto" }} />
            </section>
          )}

          {mainKeys.map((k, i) => (
            <section key={k} data-section={k} style={{ marginBottom: 16, position: "relative" }}>
              <Heading title={SECTION_META[k].title} />
              {/* A margin note beside the first section, like "return here." in the sketch */}
              {i === 0 && (
                <div style={{ position: "absolute", top: 2, right: 0, fontFamily: hand, fontSize: 19, color: muted, transform: "rotate(-3deg)" }}>
                  ← read this first.
                </div>
              )}
              <SectionBody k={k} data={data} o={mainOpts} />
            </section>
          ))}
        </main>
      </div>

      {/* Coffee ring in the corner */}
      <div style={{ position: "absolute", left: 210, bottom: 26, width: 130, height: 130, pointerEvents: "none" }} aria-hidden="true">
        <svg width="130" height="130" viewBox="0 0 150 150" style={{ position: "absolute", inset: 0 }}>
          <circle cx="75" cy="75" r="64" fill="none" stroke="#a87a45" strokeOpacity="0.45" strokeWidth="7" />
          <circle cx="75" cy="75" r="60" fill="none" stroke="#a87a45" strokeOpacity="0.25" strokeWidth="2" />
          <path d="M20 95 C14 70 22 40 45 24" stroke="#a87a45" strokeOpacity="0.35" strokeWidth="3" fill="none" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: hand, fontSize: 18, lineHeight: 1.1, color: INK }}>
          thanks for
          <br />
          reading ♡
        </div>
      </div>
    </div>
  );
}
