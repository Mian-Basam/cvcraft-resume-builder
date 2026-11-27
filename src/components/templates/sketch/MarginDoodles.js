import { contactItems, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, pick } from "../kit";
import { CheckBox, Heart, INK, LoopArrow, SketchPortrait, Sparkle, Star, hand } from "../sketchKit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["experience", "education", "projects", "certifications"];

// Sketch: a clean white page with a wide doodled margin: the sketch girl among stars and arrows,
// contact details, skills as ticked boxes, and interests with little hearts.
export default function MarginDoodles({ data, theme }) {
  const { accent } = theme;
  const p = data.personal;
  const serif = fontStack("playfair");
  const muted = "#5f5a54";
  const deep = mix(accent, "#000000", 0.5);
  const o = { primary: INK, light: mix(accent, "#ffffff", 0.6), text: "#2a2723", muted, subColor: deep, fs: 11.5, dateStyle: "right" };

  const Heading = ({ title }) => (
    <div style={{ position: "relative", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8 }}>
      <Star size={16} color={deep} />
      <h3 style={{ fontSize: 14, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", margin: 0, color: INK, position: "relative" }}>
        {title}
        <svg width="100%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: -7 }} aria-hidden="true">
          <path d="M1 5 C20 1 40 7 60 3 C75 1 88 6 99 3" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </h3>
    </div>
  );
  const MarginTitle = ({ children }) => <div style={{ fontFamily: hand, fontSize: 25, fontWeight: 700, lineHeight: 1, margin: "0 0 6px" }}>{children}</div>;

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: INK, display: "flex", background: "#fff" })}>
      {/* The doodle margin */}
      <aside style={{ width: 250, flexShrink: 0, background: mix(accent, "#ffffff", 0.86), padding: "30px 24px", position: "relative", borderRight: `2px dashed ${mix(accent, "#000000", 0.2)}` }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Star size={22} color={INK} style={{ position: "absolute", left: 4, top: 18 }} />
          <Sparkle size={14} color={deep} style={{ position: "absolute", right: 10, top: 6 }} />
          <Sparkle size={11} color={INK} style={{ position: "absolute", left: 18, top: 150 }} />
          <Heart size={16} color={deep} fill={accent} style={{ position: "absolute", right: 4, top: 120 }} />
          <SketchPortrait data={data} theme={theme} width={180} photoStyle={{ borderRadius: "50%", border: `3px solid ${INK}`, width: 170, margin: "10px 0" }} />
        </div>
        <div style={{ fontFamily: hand, fontSize: 20, textAlign: "center", color: muted, marginBottom: 18 }}>hi, it&apos;s me!</div>

        <section data-section="contact" style={{ marginBottom: 18 }}>
          <MarginTitle>say hello</MarginTitle>
          {contactItems(p).map((c) => (
            <div key={c.icon} style={{ display: "flex", gap: 6, fontSize: 11.5, lineHeight: 1.5, wordBreak: "break-word" }}>
              <span style={{ color: deep }}>→</span>
              {c.value}
            </div>
          ))}
        </section>

        {pick(data, ["skills"]).length > 0 && (
          <section data-section="skills" style={{ marginBottom: 18 }}>
            <MarginTitle>can do</MarginTitle>
            {data.skills.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, marginBottom: 5 }}>
                <CheckBox size={14} tickColor={deep} />
                {s.name}
              </div>
            ))}
          </section>
        )}
        {pick(data, ["languages"]).length > 0 && (
          <section data-section="languages" style={{ marginBottom: 18 }}>
            <MarginTitle>speaks</MarginTitle>
            <SectionBody k="languages" data={data} o={{ ...o, langStyle: "dots", barColor: deep }} />
          </section>
        )}
        {pick(data, ["interests"]).length > 0 && (
          <section data-section="interests">
            <MarginTitle>loves</MarginTitle>
            {data.interests.map((i) => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, marginBottom: 4 }}>
                <Heart size={12} color={deep} fill={mix(accent, "#ffffff", 0.3)} />
                {i.name}
              </div>
            ))}
          </section>
        )}
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: "40px 40px 30px 36px" }}>
        <h1 style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, lineHeight: 1, margin: 0 }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: deep, marginTop: 8 }}>{p.title}</div>}
        {pick(data, ["summary"]).length > 0 && (
          <section data-section="summary" style={{ display: "flex", gap: 10, alignItems: "flex-start", margin: "18px 0 24px" }}>
            <LoopArrow width={58} color={INK} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: hand, fontSize: 21, lineHeight: 1.3, margin: 0 }}>{p.summary}</p>
          </section>
        )}
        {pick(data, MAIN_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 20 }}>
            <Heading title={SECTION_META[k].title} />
            <SectionBody k={k} data={data} o={o} />
          </section>
        ))}
      </main>
    </div>
  );
}
