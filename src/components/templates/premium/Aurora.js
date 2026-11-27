import { Photo, pageStyle } from "../shared";
import { ContactList, Sections, fontOf, photoOf, pick } from "../kit";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

// Premium: gradient header with soft glowing shapes and a floating content card.
export default function Aurora({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  const glow = { position: "absolute", borderRadius: "50%", pointerEvents: "none" };
  const mainOpts = { primary, light, text: "#262626", muted: "#6b6b6b", fs: 11.5, dateStyle: "right" };
  const sideOpts = {
    ...mainOpts,
    dateStyle: "below",
    skillStyle: "rings",
    langStyle: "segments",
    interestStyle: "tags",
    barColor: primary,
    track: light,
  };

  const Heading = ({ title }) => (
    <h3 style={{ fontSize: 15, fontWeight: 800, color: primary, margin: "0 0 12px" }}>
      {title}
      <span style={{ display: "block", width: 36, height: 3, borderRadius: 2, marginTop: 4, background: `linear-gradient(90deg, ${primary}, ${accent})` }} />
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: "#262626", background: "#f6f7f9" })}>
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          height: 270,
          padding: "40px 52px",
          background: `linear-gradient(135deg, ${primary} 0%, ${primary} 45%, ${accent} 140%)`,
        }}
      >
        <div style={{ ...glow, width: 320, height: 320, right: -80, top: -140, background: `radial-gradient(circle, ${accent}cc 0%, transparent 70%)` }} />
        <div style={{ ...glow, width: 220, height: 220, right: 160, top: 90, background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)" }} />
        <div style={{ ...glow, width: 160, height: 160, left: -50, bottom: -70, background: `radial-gradient(circle, ${accent}99 0%, transparent 70%)` }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 28 }}>
          <Photo
            src={photoOf(data, theme)}
            name={p.name}
            size={126}
            placeholderBg="rgba(255,255,255,0.18)"
            style={{ border: "4px solid rgba(255,255,255,0.85)", flexShrink: 0 }}
          />
          <div style={{ color: "#fff" }}>
            <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0, lineHeight: 1.08 }}>{p.name}</h1>
            {p.title && (
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", opacity: 0.9, marginTop: 8 }}>
                {p.title}
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <ContactList p={p} inline fs={10.5} iconColor="#fff" color="rgba(255,255,255,0.92)" />
            </div>
          </div>
        </div>
      </header>

      <div
        style={{
          position: "relative",
          margin: "-62px 32px 32px",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.10)",
          padding: "28px 28px 12px",
          display: "flex",
          gap: 28,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Sections keys={pick(data, MAIN_KEYS)} data={data} o={mainOpts} Heading={Heading} gap={20} />
        </div>
        <div style={{ width: 210, flexShrink: 0, borderLeft: `1px solid ${light}`, paddingLeft: 22 }}>
          <Sections keys={pick(data, SIDE_KEYS)} data={data} o={sideOpts} Heading={Heading} gap={20} />
        </div>
      </div>
    </div>
  );
}
