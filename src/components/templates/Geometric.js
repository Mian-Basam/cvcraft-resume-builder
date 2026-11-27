import { Photo, pageStyle } from "./shared";
import { ContactList, Sections, fontOf, photoOf, pick } from "./kit";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "interests", "certifications"];

// Tinted sidebar under rotated diamond shapes, rounded-square photo and dot ratings.
export default function Geometric({ data, theme }) {
  const { primary, accent, light, dark } = theme;
  const p = data.personal;
  const mainOpts = { primary, light, text: "#262626", muted: "#6b6b6b", fs: 11.5, dateStyle: "right" };
  const sideOpts = { ...mainOpts, dateStyle: "below", skillStyle: "dots", langStyle: "dots", interestStyle: "list", track: "#d6d6d6" };
  const shape = { position: "absolute", pointerEvents: "none" };

  const Heading = ({ title }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: dark, margin: "0 0 12px" }}>
      <span style={{ width: 10, height: 10, background: accent, transform: "rotate(45deg)", flexShrink: 0 }} />
      {title}
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "montserrat"), color: "#262626", display: "flex" })}>
      <aside style={{ width: 260, flexShrink: 0, background: light, position: "relative", padding: "262px 24px 60px 30px" }}>
        <div style={{ ...shape, top: -80, left: -80, width: 230, height: 230, background: primary, transform: "rotate(45deg)", borderRadius: 28 }} />
        <div style={{ ...shape, top: -30, left: 150, width: 110, height: 110, background: accent, transform: "rotate(45deg)", borderRadius: 18, opacity: 0.9 }} />
        <Photo
          src={photoOf(data, theme)}
          name={p.name}
          size={170}
          placeholderBg={primary}
          style={{ position: "absolute", top: 62, left: 45, borderRadius: 30, border: "6px solid #fff", zIndex: 2 }}
        />
        <section style={{ marginBottom: 22 }}>
          <Heading title="Contact" />
          <ContactList p={p} fs={11} iconColor={primary} color="#333" />
        </section>
        <Sections keys={pick(data, SIDE_KEYS)} data={data} o={sideOpts} Heading={Heading} gap={20} />
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: "70px 50px 90px 36px" }}>
        <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.08, color: dark, margin: 0 }}>{p.name}</h1>
        {p.title && (
          <div style={{ fontSize: 14, fontWeight: 600, color: primary, textTransform: "uppercase", letterSpacing: 2, marginTop: 8 }}>
            {p.title}
          </div>
        )}
        <div style={{ height: 34 }} />
        <Sections keys={pick(data, MAIN_KEYS)} data={data} o={mainOpts} Heading={Heading} />
      </main>

      <svg width="200" height="120" viewBox="0 0 200 120" style={{ ...shape, right: 0, bottom: 0 }}>
        <polygon points="200,0 200,120 60,120" fill={accent} />
        <polygon points="200,50 200,120 120,120" fill={primary} />
      </svg>
    </div>
  );
}
