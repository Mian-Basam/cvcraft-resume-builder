import { pageStyle } from "./shared";
import { ContactList, DEFAULT_KEYS, Sections, fontOf, pick } from "./kit";

// Single column with a date column and vertical rule beside every entry. ATS-friendly.
export default function TimelinePro({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  const o = {
    primary,
    light,
    line: accent,
    text: "#232323",
    muted: "#666",
    fs: 11.5,
    dateStyle: "left",
    skillStyle: "tags",
    langStyle: "inline",
    interestStyle: "inline",
    barColor: primary,
  };

  const Heading = ({ title }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: primary, margin: "0 0 12px" }}>
      {title}
      <span style={{ flex: 1, height: 1, background: light }} />
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "raleway"), color: "#232323", padding: "52px 56px" })}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-end", marginBottom: 30 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 800, margin: 0, color: "#151515" }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 15, fontWeight: 600, color: primary, marginTop: 4 }}>{p.title}</div>}
        </div>
        <div>
          <ContactList p={p} fs={11} iconColor={primary} color="#444" gap={4} alignRight />
        </div>
      </header>
      <Sections keys={pick(data, DEFAULT_KEYS)} data={data} o={o} Heading={Heading} gap={20} />
    </div>
  );
}
