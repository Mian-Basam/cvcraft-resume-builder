import { Photo, pageStyle } from "../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";

const MAIN_KEYS = ["summary", "experience", "projects"];
const SIDE_KEYS = ["education", "skills", "languages", "certifications", "interests"];

// Premium: tiled header (photo, name, contact) and every section in its own rounded card.
export default function Mosaic({ data, theme }) {
  const { primary, accent, light, dark } = theme;
  const p = data.personal;
  const mainOpts = { primary, light, text: "#262626", muted: "#6b6b6b", fs: 11.5, dateStyle: "right" };
  const sideOpts = { ...mainOpts, dateStyle: "below", skillStyle: "tags", langStyle: "bars", interestStyle: "tags", tagBg: "#fff", track: "#fff" };

  const card = (k, opts, bg) => (
    <section key={k} data-section={k} style={{ background: bg, borderRadius: 16, padding: "16px 18px", marginBottom: 12, breakInside: "avoid" }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: primary, margin: "0 0 10px" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent }} />
        {SECTION_META[k].title}
      </h3>
      <SectionBody k={k} data={data} o={opts} />
    </section>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: "#262626", background: "#f5f6f8", padding: 26 })}>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 210px", gap: 12, marginBottom: 12 }}>
        <Photo src={photoOf(data, theme)} name={p.name} size={160} placeholderBg={dark} style={{ borderRadius: 16 }} />
        <div style={{ background: primary, color: "#fff", borderRadius: 16, padding: "24px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, lineHeight: 1.08 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 14, fontWeight: 500, color: accent, marginTop: 6 }}>{p.title}</div>}
        </div>
        <div style={{ background: accent, borderRadius: 16, padding: "16px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <ContactList p={p} fs={10.5} iconColor={dark} color={dark} gap={7} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>{pick(data, MAIN_KEYS).map((k) => card(k, mainOpts, "#fff"))}</div>
        <div style={{ width: 240, flexShrink: 0 }}>{pick(data, SIDE_KEYS).map((k) => card(k, sideOpts, light))}</div>
      </div>
    </div>
  );
}
