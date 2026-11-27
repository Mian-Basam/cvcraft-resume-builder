import { pageStyle } from "./shared";
import { ContactList, DEFAULT_KEYS, SECTION_META, SectionBody, fontOf, pick } from "./kit";

// Lots of white space: section labels in a narrow left column, content on the right. ATS-friendly.
export default function Minimal({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  const o = {
    primary,
    text: "#2a2a2a",
    muted: "#8a8a8a",
    fs: 11.5,
    dateStyle: "right",
    skillStyle: "tags",
    langStyle: "inline",
    interestStyle: "inline",
    tagBg: "#fff",
    tagBorder: "#d4d4d4",
    subColor: primary,
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: "#2a2a2a", padding: "70px 64px" })}>
      <header style={{ marginBottom: 44 }}>
        <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: -0.5, margin: 0, color: "#111" }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 14, color: primary, marginTop: 6 }}>{p.title}</div>}
        <div style={{ marginTop: 14 }}>
          <ContactList p={p} inline fs={11} color="#777" />
        </div>
      </header>
      {pick(data, DEFAULT_KEYS).map((k) => (
        <section key={k} data-section={k} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, marginBottom: 26 }}>
          <h3 style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#9a9a9a", margin: "3px 0 0" }}>
            {SECTION_META[k].title}
          </h3>
          <div>
            <SectionBody k={k} data={data} o={o} />
          </div>
        </section>
      ))}
    </div>
  );
}
