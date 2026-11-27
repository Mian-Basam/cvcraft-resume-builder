import Icon from "../Icon";
import { BulletList, Photo, contactItems, dateRange, lines, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "interests", "certifications"];

// Premium: icon-node timeline, skill segments, language rings and an icon contact bar.
export default function Infographic({ data, theme }) {
  const { primary, accent, light, dark } = theme;
  const p = data.personal;
  const sideOpts = {
    primary,
    light,
    text: "#262626",
    muted: "#6b6b6b",
    fs: 11,
    dateStyle: "below",
    skillStyle: "segments",
    langStyle: "rings",
    interestStyle: "icons",
    barColor: primary,
    track: "#d9dde3",
  };

  const Heading = ({ title, icon }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: dark, margin: "0 0 14px" }}>
      <span style={{ width: 26, height: 26, borderRadius: 7, background: primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={14} color="#fff" strokeWidth={2.4} />
      </span>
      {title}
    </h3>
  );

  // Entries hang off a vertical line, each with a round icon node.
  const nodeEntries = (k) => {
    const icon = SECTION_META[k].icon;
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(", "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }))
        : k === "education"
          ? data.education.map((e) => ({ id: e.id, title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(" · "), date: dateRange(e.start, e.end), bullets: [] }))
          : data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
    return items.map((e, i) => (
      <div key={e.id} style={{ display: "flex", gap: 14, breakInside: "avoid" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={icon} size={12} color={dark} strokeWidth={2.4} />
          </span>
          {i < items.length - 1 && <span style={{ flex: 1, width: 2, background: light, margin: "2px 0" }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{e.title}</span>
            {e.date && (
              <span style={{ fontSize: 10.5, fontWeight: 600, color: "#fff", background: primary, borderRadius: 999, padding: "1px 8px", whiteSpace: "nowrap" }}>
                {e.date}
              </span>
            )}
          </div>
          {e.sub && <div style={{ fontSize: 11.5, fontWeight: 600, color: primary, marginTop: 2 }}>{e.sub}</div>}
          <BulletList items={e.bullets} style={{ fontSize: 11.5, lineHeight: 1.5, marginTop: 4 }} />
        </div>
      </div>
    ));
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "montserrat"), color: "#262626", padding: "40px 44px" })}>
      <header style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ padding: 5, borderRadius: "50%", background: `conic-gradient(${primary} 0 70%, ${accent} 70% 100%)` }}>
          <Photo src={photoOf(data, theme)} name={p.name} size={112} placeholderBg={dark} style={{ border: "4px solid #fff" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, margin: 0, color: dark, lineHeight: 1.1 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 14, fontWeight: 700, color: primary, textTransform: "uppercase", letterSpacing: 2, marginTop: 6 }}>{p.title}</div>}
        </div>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "20px 0 22px", padding: 10, borderRadius: 12, background: light }}>
        {contactItems(p).map((c) => (
          <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, background: "#fff", borderRadius: 999, padding: "4px 10px 4px 4px" }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={c.icon} size={11} color="#fff" strokeWidth={2.4} />
            </span>
            {c.value}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 26 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 18 }}>
              <Heading title={SECTION_META[k].title} icon={SECTION_META[k].icon} />
              {k === "summary" ? <SectionBody k={k} data={data} o={sideOpts} /> : nodeEntries(k)}
            </section>
          ))}
        </div>
        <div style={{ width: 228, flexShrink: 0, background: light, borderRadius: 14, padding: "18px 16px", alignSelf: "flex-start" }}>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 18 }}>
              <Heading title={SECTION_META[k].title} icon={SECTION_META[k].icon} />
              <SectionBody k={k} data={data} o={sideOpts} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
