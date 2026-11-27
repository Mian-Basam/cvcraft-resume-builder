import { pageStyle } from "./shared";
import { ContactList, Sections, fontOf, pick } from "./kit";

const MAIN_KEYS = ["summary", "experience", "projects", "education"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

// Dense two-column layout that fits a lot on one page. ATS-friendly.
export default function Compact({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  const base = { primary, light, text: "#222", muted: "#6b6b6b", fs: 11, dateStyle: "right" };
  const sideOpts = { ...base, dateStyle: "below", skillStyle: "tags", langStyle: "dots", interestStyle: "tags" };

  const Heading = ({ title }) => (
    <h3 style={{ fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: primary, margin: "0 0 10px" }}>
      {title}
      <span style={{ display: "block", width: 30, height: 2, background: accent, marginTop: 4 }} />
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: "#222", padding: "44px 48px" })}>
      <header style={{ borderBottom: `1px solid ${light}`, paddingBottom: 14, marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: primary, margin: 0 }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{p.title}</div>}
        <div style={{ marginTop: 8 }}>
          <ContactList p={p} inline fs={10.5} iconColor={primary} color="#444" />
        </div>
      </header>
      <div style={{ display: "flex", gap: 28 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Sections keys={pick(data, MAIN_KEYS)} data={data} o={base} Heading={Heading} gap={16} />
        </div>
        <div style={{ width: 220, flexShrink: 0, borderLeft: `1px solid ${light}`, paddingLeft: 22 }}>
          <Sections keys={pick(data, SIDE_KEYS)} data={data} o={sideOpts} Heading={Heading} gap={16} />
        </div>
      </div>
    </div>
  );
}
