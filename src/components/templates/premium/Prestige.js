import { Photo, pageStyle } from "../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

// Premium: rich colour panel with fine accent frame lines, serif name and ornaments.
export default function Prestige({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const serif = fontStack("playfair");
  const mainOpts = { primary, light: "#eee", text: "#2a2a2a", muted: "#777", fs: 11.5, dateStyle: "right", subColor: primary };
  const sideOpts = {
    primary: accent,
    text: "#f4f4f4",
    muted: "rgba(255,255,255,0.7)",
    titleColor: "#fff",
    subColor: accent,
    fs: 11.5,
    dateStyle: "below",
    skillStyle: "list",
    langStyle: "dots",
    interestStyle: "list",
    barColor: accent,
    track: "rgba(255,255,255,0.22)",
  };

  const Ornament = ({ color, width = 70 }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width, height: 1, background: color }} />
      <span style={{ width: 7, height: 7, background: color, transform: "rotate(45deg)" }} />
      <span style={{ width, height: 1, background: color }} />
    </div>
  );

  const sideHeading = (title) => (
    <h3
      style={{
        fontFamily: serif,
        fontSize: 15,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: accent,
        textAlign: "center",
        margin: "0 0 12px",
      }}
    >
      {title}
    </h3>
  );

  const mainHeading = (title) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: serif, fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: primary, margin: "0 0 12px" }}>
      <span style={{ width: 8, height: 8, background: accent, transform: "rotate(45deg)", flexShrink: 0 }} />
      {title}
      <span style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "lato"), color: "#2a2a2a", display: "flex" })}>
      <aside style={{ width: 268, flexShrink: 0, background: primary, color: "#f4f4f4", padding: "56px 30px 48px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ padding: 5, borderRadius: "50%", border: `1.5px solid ${accent}` }}>
            <Photo src={photoOf(data, theme)} name={p.name} size={150} placeholderBg="rgba(255,255,255,0.12)" style={{ border: `3px solid ${accent}` }} />
          </div>
        </div>
        <section style={{ marginBottom: 24 }}>
          {sideHeading("Contact")}
          <ContactList p={p} fs={11} iconColor={accent} color="#f4f4f4" />
        </section>
        {pick(data, SIDE_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 24 }}>
            {sideHeading(SECTION_META[k].title)}
            <SectionBody k={k} data={data} o={sideOpts} />
          </section>
        ))}
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: "64px 50px 48px 40px" }}>
        <h1 style={{ fontFamily: serif, fontSize: 40, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: primary, margin: 0, lineHeight: 1.1 }}>
          {p.name}
        </h1>
        {p.title && (
          <div style={{ fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: "#777", margin: "10px 0 16px" }}>{p.title}</div>
        )}
        <Ornament color={accent} />
        <div style={{ height: 26 }} />
        {pick(data, MAIN_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 20 }}>
            {mainHeading(SECTION_META[k].title)}
            <SectionBody k={k} data={data} o={mainOpts} />
          </section>
        ))}
      </main>

      {/* Fine double frame drawn over the whole page */}
      <div style={{ position: "absolute", inset: 14, border: `1px solid ${accent}`, pointerEvents: "none", zIndex: 5 }} />
      <div style={{ position: "absolute", inset: 19, border: `0.5px solid ${accent}`, opacity: 0.6, pointerEvents: "none", zIndex: 5 }} />
    </div>
  );
}
