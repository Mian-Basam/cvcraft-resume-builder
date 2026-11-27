import Icon, { interestIcon } from "../Icon";
import { BulletList, Photo, contactItems, dateRange, lines, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";

const SIDE_KEYS = ["skills", "languages", "interests"];
const MAIN_KEYS = ["summary", "experience", "education", "projects", "certifications"];

// Premium: tall arched sidebar with the photo in the arch, outlined pill skill bars and grade badges.
export default function Arch({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  const ink = mix(primary, "#000000", 0.15);
  const roleColor = mix(accent, "#000000", 0.35);
  const page = mix(light, "#e9e6df", 0.5);

  const Divider = () => <div style={{ width: 3, height: 34, background: "#fff", margin: "6px auto 16px", borderRadius: 2 }} />;
  const sideTitle = (t) => (
    <h3 style={{ textAlign: "center", fontSize: 19, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 14px" }}>{t}</h3>
  );
  const pillBar = (s) => (
    <div key={s.id} style={{ marginBottom: 10 }}>
      <div style={{ textAlign: "center", fontSize: 10.5, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{s.name}</div>
      <div style={{ height: 15, borderRadius: 999, border: `2px solid ${accent}`, padding: 1 }}>
        <div style={{ height: "100%", width: `${s.level ?? 0}%`, borderRadius: 999, background: accent }} />
      </div>
    </div>
  );

  const sideSection = {
    skills: () => data.skills.map(pillBar),
    languages: () => data.languages.map(pillBar),
    interests: () => (
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14 }}>
        {data.interests.map((i) => (
          <span key={i.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 10.5 }}>
            <Icon name={interestIcon(i.name)} size={22} color={accent} strokeWidth={1.8} />
            {i.name}
          </span>
        ))}
      </div>
    ),
  };

  const heading = (t) => (
    <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: ink, margin: "0 0 12px" }}>{t}</h3>
  );
  const dotEntry = (id, lead, role, date, bullets, badge) => (
    <div key={id} style={{ display: "flex", gap: 12, marginBottom: 14, breakInside: "avoid" }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: ink, marginTop: 3, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, textTransform: "uppercase", letterSpacing: 0.3 }}>
          <b>{lead}</b>
          {role && (
            <>
              {" "}- <span style={{ color: roleColor, textTransform: "none", fontWeight: 600 }}>{role}</span>
            </>
          )}
        </div>
        {date && <div style={{ fontSize: 11.5, color: roleColor, marginTop: 2 }}>{date}</div>}
        <BulletList items={bullets} style={{ fontSize: 11, lineHeight: 1.5, marginTop: 4 }} />
      </div>
      {badge}
    </div>
  );
  const gradeBadge = (grade) =>
    grade ? (
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: "#666" }}>Grade</div>
        <div style={{ minWidth: 46, height: 46, padding: "0 6px", borderRadius: 999, background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: grade.length > 3 ? 11 : 20, fontWeight: 700 }}>
          {grade.replace(/^GPA\s*/i, "")}
        </div>
      </div>
    ) : null;

  const mainSection = {
    summary: () => <SectionBody k="summary" data={data} o={{ fs: 11.5, text: "#333" }} />,
    experience: () =>
      data.experience.map((e) => dotEntry(e.id, e.company, e.role, [dateRange(e.start, e.end), e.location].filter(Boolean).join(" · "), lines(e.bullets))),
    education: () => data.education.map((e) => dotEntry(e.id, e.school, e.degree, dateRange(e.start, e.end), [], gradeBadge(e.grade))),
    projects: () => data.projects.map((e) => dotEntry(e.id, e.name, e.link, "", lines(e.description))),
    certifications: () => data.certifications.map((e) => dotEntry(e.id, e.name, e.issuer, e.year, [])),
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "montserrat"), color: "#2b2b2b", background: page, display: "flex", padding: "22px 0 36px 24px" })}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 150, background: accent }} />

      <aside style={{ position: "relative", width: 252, flexShrink: 0, background: primary, color: "#fff", borderRadius: "126px 126px 0 0", padding: "26px 26px 30px" }}>
        <Photo src={photoOf(data, theme)} name={p.name} size={196} placeholderBg={mix(primary, "#ffffff", 0.15)} style={{ margin: "0 auto", border: `5px solid ${accent}` }} />
        <Divider />
        {contactItems(p).length > 0 && (
          <section style={{ marginBottom: 8 }}>
            {sideTitle("Contact")}
            {contactItems(p).map((c) => (
              <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, marginBottom: 10 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={c.icon} size={13} color={primary} strokeWidth={2.4} />
                </span>
                <span style={{ wordBreak: "break-word" }}>{c.value}</span>
              </div>
            ))}
            <Divider />
          </section>
        )}
        {pick(data, SIDE_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 18 }}>
            {sideTitle(SECTION_META[k].title)}
            {sideSection[k]()}
          </section>
        ))}
      </aside>

      <main style={{ position: "relative", flex: 1, minWidth: 0, padding: "10px 40px 20px 34px" }}>
        <div style={{ height: 150, textAlign: "right", color: "#fff" }}>
          <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, textTransform: "uppercase", margin: "10px 0 0" }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 20, fontWeight: 400, marginTop: 8 }}>{p.title}</div>}
        </div>
        {pick(data, MAIN_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 20 }}>
            {heading(k === "summary" ? "Personal Information" : k === "experience" ? "Work Experience" : SECTION_META[k].title)}
            {mainSection[k]()}
          </section>
        ))}
      </main>
    </div>
  );
}
