import { Photo, pageStyle } from "./shared";
import { ContactList, Sections, fontOf, photoOf, pick } from "./kit";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "interests", "certifications"];

// Main column on the left, full-height coloured sidebar with photo on the right.
export default function Split({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const mainOpts = { primary, light: "#eee", text: "#262626", muted: "#6b6b6b", fs: 11.5, dateStyle: "below" };
  const sideOpts = {
    primary: accent,
    text: "#fff",
    muted: "rgba(255,255,255,0.75)",
    titleColor: "#fff",
    subColor: accent,
    fs: 11.5,
    dateStyle: "below",
    skillStyle: "bars",
    langStyle: "dots",
    interestStyle: "tags",
    barColor: accent,
    track: "rgba(255,255,255,0.25)",
    tagBg: "rgba(255,255,255,0.15)",
    tagColor: "#fff",
  };

  const MainHeading = ({ title }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: primary, margin: "0 0 12px" }}>
      {title}
      <span style={{ flex: 1, height: 2, background: accent, opacity: 0.6 }} />
    </h3>
  );
  const SideHeading = ({ title }) => (
    <h3
      style={{
        fontSize: 13,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 2,
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,0.35)",
        paddingBottom: 6,
        margin: "0 0 12px",
      }}
    >
      {title}
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "raleway"), color: "#262626", display: "flex" })}>
      <main style={{ flex: 1, minWidth: 0, padding: "56px 40px 48px 52px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.05, color: primary, margin: 0 }}>{p.name}</h1>
        {p.title && (
          <div style={{ fontSize: 14, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginTop: 8 }}>
            {p.title}
          </div>
        )}
        <div style={{ height: 30 }} />
        <Sections keys={pick(data, MAIN_KEYS)} data={data} o={mainOpts} Heading={MainHeading} />
      </main>
      <aside style={{ width: 260, flexShrink: 0, background: primary, color: "#fff", padding: "44px 28px" }}>
        <Photo
          src={photoOf(data, theme)}
          name={p.name}
          size={170}
          placeholderBg={accent}
          style={{ border: `5px solid ${accent}`, margin: "0 auto 26px" }}
        />
        <section style={{ marginBottom: 22 }}>
          <SideHeading title="Contact" />
          <ContactList p={p} fs={11} iconColor={accent} color="#fff" />
        </section>
        <Sections keys={pick(data, SIDE_KEYS)} data={data} o={sideOpts} Heading={SideHeading} gap={20} />
      </aside>
    </div>
  );
}
