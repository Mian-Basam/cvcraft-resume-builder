import { Photo, contactItems, dateRange, lines, mix, pageStyle } from "../shared";
import { SectionBody, fontOf, photoOf, pick } from "../kit";
import { fontStack } from "@/lib/palettes";

const COL1 = ["experience", "certifications"];
const COL2 = ["education", "skills"];
const COL3 = ["projects", "summary", "languages", "interests"];
const TITLES = {
  experience: "Work",
  certifications: "Award",
  education: "School",
  skills: "Skills",
  projects: "Project",
  summary: "About",
  languages: "Language",
  interests: "Hobby",
};

// Premium: vintage poster typography, three ruled columns, dates beside entries and star ratings.
export default function Gazette({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const display = fontStack("oswald");
  const ink = "#2f2f2f";
  const paper = "#f2ece0";
  const dateColor = mix(accent, "#000000", 0.3);
  const head = mix(primary, paper, 0.15);

  const words = (p.name || "").trim().split(/\s+/);
  const first = words.shift() || "";
  const rest = words.join(" ");
  const nameSize = Math.max(34, Math.min(70, 660 / Math.max(1, (p.name || "").length * 0.5)));

  const heading = (k) => (
    <h3 style={{ fontFamily: display, fontSize: 34, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: head, margin: "0 0 8px", lineHeight: 1 }}>
      {TITLES[k]}:
    </h3>
  );
  const entry = (id, title, date, sub, bullets) => (
    <div key={id} style={{ borderBottom: `1px solid ${ink}33`, padding: "6px 0 8px", breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
        <span style={{ fontFamily: display, fontSize: 14, fontWeight: 600, textTransform: "uppercase", color: ink }}>{title}</span>
        {date && <span style={{ fontFamily: display, fontSize: 15, color: dateColor, whiteSpace: "nowrap" }}>{date}</span>}
      </div>
      {sub && <div style={{ fontSize: 10.5, color: "#555" }}>{sub}</div>}
      {bullets.length > 0 && <div style={{ fontSize: 10, lineHeight: 1.45, color: "#444", marginTop: 3 }}>{bullets.join(" · ")}</div>}
    </div>
  );
  const stars = (level = 0) => {
    const n = level >= 80 ? 3 : level >= 50 ? 2 : 1;
    return (
      <span style={{ letterSpacing: 2, color: dateColor }}>
        {"★".repeat(n)}
        <span style={{ color: `${ink}26` }}>{"★".repeat(3 - n)}</span>
      </span>
    );
  };

  const body = {
    experience: () => data.experience.map((e) => entry(e.id, e.company, dateRange(e.start, e.end), [e.role, e.location].filter(Boolean).join(" · "), lines(e.bullets))),
    certifications: () => data.certifications.map((e) => entry(e.id, e.name, e.year, e.issuer, [])),
    education: () => data.education.map((e) => entry(e.id, e.school, dateRange(e.start, e.end), [e.degree, e.grade].filter(Boolean).join(" · "), [])),
    projects: () => data.projects.map((e) => entry(e.id, e.name, "", e.link, lines(e.description))),
    skills: () =>
      data.skills.map((s) => (
        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, padding: "3px 0" }}>
          <span>{s.name}</span>
          {stars(s.level)}
        </div>
      )),
    languages: () =>
      data.languages.map((s) => (
        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, padding: "3px 0" }}>
          <span>{s.name}</span>
          {stars(s.level)}
        </div>
      )),
    summary: () => <SectionBody k="summary" data={data} o={{ fs: 10.5, text: "#444" }} />,
    interests: () => <div style={{ fontSize: 11.5 }}>{data.interests.map((i) => i.name).join(" • ")}</div>,
  };
  const column = (keys) =>
    pick(data, keys).map((k) => (
      <section key={k} data-section={k} style={{ marginBottom: 16 }}>
        {heading(k)}
        {body[k]()}
      </section>
    ));

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "raleway"), color: ink, background: paper, padding: "30px 36px 30px" })}>
      <div style={{ textAlign: "center" }}>
        <span style={{ display: "inline-block", border: `1.5px solid ${ink}`, padding: "2px 14px", fontFamily: display, fontSize: 12, letterSpacing: 2 }}>
          HI, NICE TO MEET YOU
        </span>
      </div>
      <h1 style={{ fontFamily: display, fontSize: nameSize, fontWeight: 700, lineHeight: 1.05, textTransform: "uppercase", letterSpacing: 2, margin: "8px 0 6px", textAlign: "center", color: ink }}>
        <span style={{ color: head }}>{first}</span>
        {rest && <span style={{ display: "inline-block", width: nameSize * 0.22, height: nameSize * 0.22, borderRadius: "50%", background: dateColor, margin: `0 ${nameSize * 0.12}px`, verticalAlign: "middle" }} />}
        {rest}
      </h1>
      {p.title && (
        <div style={{ background: ink, color: paper, textAlign: "center", fontFamily: display, fontSize: 15, letterSpacing: 4, textTransform: "uppercase", padding: "4px 0" }}>
          {p.title}
        </div>
      )}
      <div style={{ borderBottom: `3px double ${ink}`, padding: "7px 0", textAlign: "center", fontFamily: display, fontSize: 12.5, letterSpacing: 0.5 }}>
        {contactItems(p).map((c) => c.value).join("  •  ")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginTop: 16 }}>
        <div style={{ paddingRight: 16 }}>{column(COL1)}</div>
        <div style={{ borderLeft: `1.5px solid ${ink}`, borderRight: `1.5px solid ${ink}`, padding: "0 16px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div style={{ padding: 5, borderRadius: "50%", border: `2px solid ${ink}` }}>
              <Photo src={photoOf(data, theme)} name={p.name} size={140} placeholderBg={head} style={{ border: `4px solid ${dateColor}` }} />
            </div>
          </div>
          {column(COL2)}
        </div>
        <div style={{ paddingLeft: 16 }}>{column(COL3)}</div>
      </div>
    </div>
  );
}
