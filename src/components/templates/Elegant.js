import { Photo, pageStyle } from "./shared";
import { ContactList, Sections, fontOf, photoOf, pick } from "./kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

// Centred photo and serif name, double rule, two columns split by a hairline.
export default function Elegant({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  const serif = fontStack("playfair");
  const mainOpts = { primary, light, text: "#2a2a2a", muted: "#777", fs: 11.5, dateStyle: "below" };
  const sideOpts = { ...mainOpts, skillStyle: "list", langStyle: "dots", interestStyle: "list" };

  const Heading = ({ title }) => (
    <h3 style={{ fontFamily: serif, fontStyle: "italic", fontSize: 19, fontWeight: 500, color: primary, margin: "0 0 12px" }}>
      {title}
      <span style={{ display: "block", width: 40, height: 1.5, background: accent, marginTop: 5 }} />
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "lato"), color: "#2a2a2a", padding: "48px 60px" })}>
      <header style={{ textAlign: "center" }}>
        <Photo
          src={photoOf(data, theme)}
          name={p.name}
          size={120}
          placeholderBg={primary}
          style={{ margin: "0 auto", border: "3px solid #fff", boxShadow: `0 0 0 2px ${primary}` }}
        />
        <h1 style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, margin: "16px 0 0", color: "#1c1c1c" }}>{p.name}</h1>
        {p.title && (
          <div style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#777", marginTop: 6 }}>{p.title}</div>
        )}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <ContactList p={p} inline fs={11} color="#555" separator="•" />
        </div>
      </header>
      <div style={{ borderTop: `1px solid ${primary}`, borderBottom: `1px solid ${primary}`, height: 4, margin: "20px 0 26px" }} />
      <div style={{ display: "flex" }}>
        <div style={{ width: "34%", flexShrink: 0, borderRight: `1px solid ${light}`, paddingRight: 26 }}>
          <Sections keys={pick(data, SIDE_KEYS)} data={data} o={sideOpts} Heading={Heading} />
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingLeft: 26 }}>
          <Sections keys={pick(data, MAIN_KEYS)} data={data} o={mainOpts} Heading={Heading} />
        </div>
      </div>
    </div>
  );
}
