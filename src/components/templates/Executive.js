import { pageStyle } from "./shared";
import { ContactList, DEFAULT_KEYS, Sections, fontOf, pick } from "./kit";

// Single column with a top colour band and bar-marked headings. ATS-friendly.
export default function Executive({ data, theme }) {
  const { primary, light } = theme;
  const p = data.personal;
  const o = { primary, light, text: "#262626", muted: "#666", fs: 11.5, dateStyle: "right", skillStyle: "grid", langStyle: "inline", interestStyle: "inline" };

  const Heading = ({ title }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px", color: "#1f1f1f" }}>
      <span style={{ width: 5, height: 18, background: primary, borderRadius: 2 }} />
      {title}
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "lato"), color: "#262626" })}>
      <div style={{ height: 12, background: primary }} />
      <div style={{ padding: "34px 56px 36px" }}>
        <header style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${light}` }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, color: "#1a1a1a" }}>{p.name}</h1>
          {p.title && (
            <div style={{ fontSize: 15, fontWeight: 700, color: primary, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>
              {p.title}
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <ContactList p={p} inline fs={11.5} iconColor={primary} color="#444" />
          </div>
        </header>
        <Sections keys={pick(data, DEFAULT_KEYS)} data={data} o={o} Heading={Heading} gap={15} />
      </div>
    </div>
  );
}
