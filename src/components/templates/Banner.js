import Icon from "./Icon";
import { Photo, pageStyle } from "./shared";
import { ContactList, Sections, fontOf, photoOf, pick } from "./kit";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

// Full-width coloured header with photo, then a main column and a tinted side panel.
export default function Banner({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  const mainOpts = { primary, light, text: "#262626", muted: "#6b6b6b", fs: 11.5, dateStyle: "right" };
  const sideOpts = { ...mainOpts, skillStyle: "bars", langStyle: "dots", interestStyle: "tags", tagBg: "#fff", track: "#d9dde3" };

  const Heading = ({ title, icon }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 700, color: primary, margin: "0 0 12px" }}>
      <span style={{ width: 28, height: 28, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={15} color={primary} strokeWidth={2.2} />
      </span>
      {title}
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: "#262626" })}>
      <header style={{ background: primary, padding: "40px 56px", display: "flex", alignItems: "center", gap: 30 }}>
        <Photo
          src={photoOf(data, theme)}
          name={p.name}
          size={140}
          placeholderBg={accent}
          style={{ border: `5px solid ${accent}`, flexShrink: 0 }}
        />
        <div style={{ color: "#fff", minWidth: 0 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{p.name}</h1>
          {p.title && (
            <div style={{ fontSize: 14, fontWeight: 600, color: accent, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 6 }}>
              {p.title}
            </div>
          )}
          <div style={{ marginTop: 14 }}>
            <ContactList p={p} inline fs={11} iconColor={accent} color="#fff" />
          </div>
        </div>
      </header>
      <div style={{ display: "flex", gap: 30, padding: "34px 48px 40px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Sections keys={pick(data, MAIN_KEYS)} data={data} o={mainOpts} Heading={Heading} />
        </div>
        <div style={{ width: 230, flexShrink: 0, background: light, borderRadius: 12, padding: "22px 20px", alignSelf: "flex-start" }}>
          <Sections keys={pick(data, SIDE_KEYS)} data={data} o={sideOpts} Heading={Heading} gap={20} />
        </div>
      </div>
    </div>
  );
}
