import Icon from "../Icon";
import { BulletList, Photo, TimelineItem, contactItems, dateRange, lines, pageStyle } from "../shared";
import { pick } from "../kit";

const SIDE_KEYS = ["summary", "skills", "languages", "interests"];
const MAIN_KEYS = ["experience", "education", "projects", "certifications"];

// Layout: light sidebar with a round photo on the left, name plus timelines on the right.
// Templates customise it with colours, a block behind the photo and page decorations.
// Decorations sit above the sidebar and main column; the photo sits above the decorations.
export default function SidebarTimeline({
  data,
  font,
  photoSrc,
  sidebarBg,
  headingColor,
  lineColor,
  photoRing,
  photoOutline,
  placeholderBg,
  photoTopBlock,
  decorations,
  mainPaddingTop = 92,
}) {
  const p = data.personal;

  const heading = (icon, title, size = 20) => (
    <h3
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 19,
        fontWeight: 700,
        color: headingColor,
        margin: "0 0 12px",
      }}
    >
      <Icon name={icon} size={size} color={headingColor} strokeWidth={2.2} />
      {title}
    </h3>
  );

  const sideBlock = { marginBottom: 24 };
  const listStyle = { fontSize: 12, lineHeight: 1.5 };
  const sideList = (items) => <BulletList items={items} style={listStyle} itemStyle={{ marginBottom: 6 }} />;

  const contact = contactItems(p).length > 0 && (
    <section key="contact" data-section="contact" style={sideBlock}>
      {heading("contact", "Contact")}
      {contactItems(p).map((c) => (
        <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, marginBottom: 10 }}>
          <Icon name={c.icon} size={15} color={headingColor} />
          <span style={{ wordBreak: "break-word" }}>{c.value}</span>
        </div>
      ))}
    </section>
  );

  const sideSection = {
    summary: () => (
      <section key="summary" data-section="summary" style={sideBlock}>
        {heading("user", "About Me")}
        <p style={{ fontSize: 11.5, lineHeight: 1.55, textAlign: "justify", margin: 0 }}>{p.summary}</p>
      </section>
    ),
    skills: () => (
      <section key="skills" data-section="skills" style={sideBlock}>
        {heading("skills", "Skills")}
        {sideList(data.skills.map((s) => s.name))}
      </section>
    ),
    languages: () => (
      <section key="languages" data-section="languages" style={sideBlock}>
        {heading("language", "Language")}
        {sideList(data.languages.map((l) => l.name))}
      </section>
    ),
    interests: () => (
      <section key="interests" data-section="interests" style={sideBlock}>
        {heading("heart", "Interests")}
        {sideList(data.interests.map((i) => i.name))}
      </section>
    ),
  };

  // Contact sits right after the summary, or first when there is no summary.
  const sideKeys = pick(data, SIDE_KEYS);
  const sideNodes = sideKeys.map((k) => sideSection[k]());
  sideNodes.splice(sideKeys[0] === "summary" ? 1 : 0, 0, contact);

  const timelineEntry = (id, top, mid, sub, bullets) => (
    <TimelineItem key={id} color={lineColor}>
      {top && <div style={{ fontSize: 14, fontWeight: 700 }}>{top}</div>}
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginTop: 3 }}>{mid}</div>
      {sub && <div style={{ fontSize: 12, marginTop: 2, marginBottom: 6 }}>{sub}</div>}
      <BulletList items={bullets} style={{ fontSize: 12.5, lineHeight: 1.5 }} />
    </TimelineItem>
  );

  const mainSection = {
    education: () => (
      <section key="education" data-section="education" style={{ marginTop: 26 }}>
        {heading("education", "Education", 22)}
        {data.education.map((ed) =>
          timelineEntry(ed.id, dateRange(ed.start, ed.end), ed.school, [ed.degree, ed.grade].filter(Boolean).join(" · "), [])
        )}
      </section>
    ),
    experience: () => (
      <section key="experience" data-section="experience" style={{ marginTop: 26 }}>
        {heading("experience", "Experience", 22)}
        {data.experience.map((ex) =>
          timelineEntry(
            ex.id,
            dateRange(ex.start, ex.end),
            ex.role,
            [ex.company, ex.location].filter(Boolean).join(", "),
            lines(ex.bullets)
          )
        )}
      </section>
    ),
    projects: () => (
      <section key="projects" data-section="projects" style={{ marginTop: 26 }}>
        {heading("code", "Projects", 22)}
        {data.projects.map((pr) => timelineEntry(pr.id, "", pr.name, pr.link, lines(pr.description)))}
      </section>
    ),
    certifications: () => (
      <section key="certifications" data-section="certifications" style={{ marginTop: 26 }}>
        {heading("star", "Certifications", 22)}
        {data.certifications.map((c) => timelineEntry(c.id, c.year, c.name, c.issuer, []))}
      </section>
    ),
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: font, color: "#2f2f2f", display: "flex" })}>
      <aside
        style={{
          width: 270,
          flexShrink: 0,
          background: sidebarBg,
          position: "relative",
          padding: "272px 26px 96px 34px",
        }}
      >
        {photoTopBlock}
        <Photo
          src={photoSrc}
          name={p.name}
          size={200}
          placeholderBg={placeholderBg}
          style={{
            position: "absolute",
            top: 44,
            left: 35,
            zIndex: 3,
            border: `8px solid ${photoRing}`,
            boxShadow: photoOutline ? `0 0 0 3px ${photoOutline}` : undefined,
          }}
        />
        {sideNodes}
      </aside>

      <main style={{ flex: 1, padding: `${mainPaddingTop}px 52px 96px 34px` }}>
        <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.04, color: "#2b2b2b", margin: 0, maxWidth: 300 }}>
          {p.name}
        </h1>
        {p.title && <div style={{ fontSize: 17, color: "#555", marginTop: 10 }}>{p.title}</div>}
        <div style={{ height: 30 }} />
        {pick(data, MAIN_KEYS).map((k) => mainSection[k]())}
      </main>

      {decorations}
    </div>
  );
}
