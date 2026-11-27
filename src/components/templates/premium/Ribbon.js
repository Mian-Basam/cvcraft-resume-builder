import { Photo, pageStyle } from "../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

// Premium: folded ribbon headings, dotted sidebar texture and a ribbon under the photo.
export default function Ribbon({ data, theme }) {
  const { primary, accent, light, dark } = theme;
  const p = data.personal;
  const mainOpts = { primary, light, text: "#262626", muted: "#6b6b6b", fs: 11.5, dateStyle: "right" };
  const sideOpts = { ...mainOpts, dateStyle: "below", skillStyle: "dots", langStyle: "bars", interestStyle: "icons", track: "#d4d4d4" };

  // A notched ribbon that sticks out to the left with a small folded corner.
  const RibbonHeading = ({ title, color, width }) => (
    <div style={{ position: "relative", height: 30, width, margin: "0 0 14px -16px" }}>
      <svg width="100%" height="38" viewBox="0 0 200 38" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <polygon points="0,0 200,0 188,15 200,30 0,30" fill={color} />
        <polygon points="0,30 10,30 10,38" fill={dark} />
      </svg>
      <span style={{ position: "relative", display: "flex", alignItems: "center", height: 30, paddingLeft: 18, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff" }}>
        {title}
      </span>
    </div>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "raleway"), color: "#262626", display: "flex" })}>
      <aside
        style={{
          width: 256,
          flexShrink: 0,
          padding: "40px 22px 40px 30px",
          backgroundColor: light,
          backgroundImage: `radial-gradient(${primary}26 1.2px, transparent 1.6px)`,
          backgroundSize: "14px 14px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 26 }}>
          <Photo src={photoOf(data, theme)} name={p.name} size={156} placeholderBg={primary} style={{ border: "6px solid #fff", boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }} />
          <div style={{ marginTop: -14, background: accent, color: dark, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 16px", clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)", position: "relative" }}>
            {p.title || "Resume"}
          </div>
        </div>
        <section style={{ marginBottom: 20 }}>
          <RibbonHeading title="Contact" color={primary} width="calc(100% + 16px)" />
          <ContactList p={p} fs={11} iconColor={primary} color="#333" />
        </section>
        {pick(data, SIDE_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 20 }}>
            <RibbonHeading title={SECTION_META[k].title} color={primary} width="calc(100% + 16px)" />
            <SectionBody k={k} data={data} o={sideOpts} />
          </section>
        ))}
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: "52px 46px 40px 40px" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.05, color: dark, margin: 0 }}>{p.name}</h1>
        <div style={{ width: 80, height: 5, background: accent, borderRadius: 3, margin: "14px 0 30px" }} />
        {pick(data, MAIN_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 20 }}>
            <RibbonHeading title={SECTION_META[k].title} color={primary} width={210} />
            <SectionBody k={k} data={data} o={mainOpts} />
          </section>
        ))}
      </main>
    </div>
  );
}
