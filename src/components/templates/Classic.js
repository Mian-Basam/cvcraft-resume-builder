import { pageStyle } from "./shared";
import { ContactList, DEFAULT_KEYS, Sections, fontOf, pick } from "./kit";

// Single column, centred serif header and ruled section headings. ATS-friendly.
export default function Classic({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const o = { primary, text: "#222", muted: "#666", light: "#eee", fs: 11.5, dateStyle: "right", skillStyle: "inline", langStyle: "inline", interestStyle: "inline", subColor: "#444" };

  const Heading = ({ title }) => (
    <h3
      style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: primary,
        borderBottom: "1px solid #cfcfcf",
        paddingBottom: 4,
        margin: "0 0 10px",
      }}
    >
      {title}
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "merriweather"), color: "#222", padding: "56px 64px" })}>
      <header style={{ textAlign: "center", borderBottom: `2px solid ${primary}`, paddingBottom: 16, marginBottom: 22 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", margin: 0, color: "#1a1a1a" }}>
          {p.name}
        </h1>
        {p.title && <div style={{ fontSize: 14, color: primary, marginTop: 6, letterSpacing: 1 }}>{p.title}</div>}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <ContactList p={p} inline fs={11} color="#444" separator="|" />
        </div>
      </header>
      <Sections keys={pick(data, DEFAULT_KEYS)} data={data} o={o} Heading={Heading} gap={18} />
    </div>
  );
}
