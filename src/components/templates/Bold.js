import { Photo, pageStyle } from "./shared";
import { ContactList, Sections, fontOf, photoOf, pick } from "./kit";

const MAIN_KEYS = ["summary", "experience", "projects"];
const SIDE_KEYS = ["education", "skills", "languages", "certifications", "interests"];

// Oversized two-tone name, rounded-square photo and a contact strip.
export default function Bold({ data, theme }) {
  const { primary, light } = theme;
  const p = data.personal;
  const words = (p.name || "").trim().split(/\s+/);
  const last = words.length > 1 ? words.pop() : "";
  const mainOpts = { primary, light, text: "#222", muted: "#6b6b6b", fs: 11.5, dateStyle: "right" };
  const sideOpts = { ...mainOpts, dateStyle: "below", skillStyle: "tags", langStyle: "bars", interestStyle: "tags" };

  const Heading = ({ title }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 800, color: "#141414", margin: "0 0 12px" }}>
      <span style={{ width: 12, height: 12, background: primary, borderRadius: 3 }} />
      {title}
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: "#222", padding: "50px 52px" })}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, margin: 0, color: "#141414", letterSpacing: -1 }}>
            {words.join(" ")} {last && <span style={{ color: primary }}>{last}</span>}
          </h1>
          {p.title && <div style={{ fontSize: 16, fontWeight: 600, color: "#444", marginTop: 10 }}>{p.title}</div>}
        </div>
        <Photo src={photoOf(data, theme)} name={p.name} size={120} placeholderBg={primary} style={{ borderRadius: 24, flexShrink: 0 }} />
      </header>
      <div style={{ background: light, borderRadius: 10, padding: "10px 16px", marginTop: 22 }}>
        <ContactList p={p} inline fs={11} iconColor={primary} color="#333" />
      </div>
      <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Sections keys={pick(data, MAIN_KEYS)} data={data} o={mainOpts} Heading={Heading} />
        </div>
        <div style={{ width: 230, flexShrink: 0 }}>
          <Sections keys={pick(data, SIDE_KEYS)} data={data} o={sideOpts} Heading={Heading} />
        </div>
      </div>
    </div>
  );
}
