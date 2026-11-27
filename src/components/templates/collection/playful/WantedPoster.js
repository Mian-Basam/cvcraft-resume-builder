// The Wanted Poster: an aged Old-West wanted poster — Rye headline, framed photo, a tongue-in-cheek reward and the career record below.
import { pageStyle, mix, lines, dateRange, contactItems, Photo } from "../../shared";
import { fontOf, pick, levelWord, photoOf } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const LOWER_LEFT = ["experience", "projects"];
const LOWER_RIGHT = ["education", "certifications", "interests"];
const TITLES = {
  experience: "Last seen working at",
  projects: "Known jobs pulled",
  education: "Schooled at",
  certifications: "Commendations",
  interests: "Known hangouts",
  skills: "Known skills",
  languages: "Speaks",
};

export default function WantedPoster({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const rye = fontStack("rye");
  const ink = mix("#2a1a0c", primary, 0.22);
  const muted = mix(ink, "#e9d7b0", 0.35);
  const paper = "#ecdcb8";
  const red = mix(primary, "#7a1f12", 0.35);
  const rule = mix(ink, paper, 0.45);
  const fs = 12;

  const Star = ({ size = 12, color = ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M12 1.5l3.1 7 7.4.6-5.6 4.9 1.7 7.3L12 17.4l-6.6 3.9 1.7-7.3L1.5 9.1l7.4-.6z" fill={color} />
    </svg>
  );

  const Head = ({ k, center }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: center ? "center" : "flex-start", marginBottom: 8 }}>
      <Star size={11} color={red} />
      <span style={{ fontFamily: rye, fontSize: 16, letterSpacing: 1, color: ink, textTransform: "uppercase", lineHeight: 1.2 }}>{TITLES[k]}</span>
      <Star size={11} color={red} />
    </div>
  );

  const entry = (key, title, sub, date, bullets) => (
    <div key={key} style={{ marginBottom: 10, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <b style={{ fontSize: 13, color: ink }}>{title}</b>
        {date && <span style={{ fontSize: 11, fontStyle: "italic", color: muted, whiteSpace: "nowrap" }}>{date}</span>}
      </div>
      {sub && <div style={{ fontSize: 11.5, fontStyle: "italic", color: muted }}>{sub}</div>}
      {bullets.map((b, i) => (
        <div key={i} style={{ display: "flex", gap: 7, fontSize: fs, lineHeight: 1.5, marginTop: 2, color: ink }}>
          <span style={{ color: red, flexShrink: 0 }}>✦</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );

  const body = (k) => {
    if (k === "experience")
      return data.experience.map((e) => entry(e.id, e.role, [e.company, e.location].filter(Boolean).join(", "), dateRange(e.start, e.end), lines(e.bullets)));
    if (k === "projects") return data.projects.map((e) => entry(e.id, e.name, e.link, "", lines(e.description)));
    if (k === "education")
      return data.education.map((e) => entry(e.id, e.degree, [e.school, e.grade].filter(Boolean).join(", "), dateRange(e.start, e.end), []));
    if (k === "certifications") return data.certifications.map((c) => entry(c.id, c.name, c.issuer, c.year, []));
    if (k === "interests")
      return <p style={{ margin: 0, fontSize: fs, lineHeight: 1.55, color: ink }}>Often spotted near {data.interests.map((i) => i.name.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " and $1")}.</p>;
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: fs, color: ink, padding: "3px 0", borderBottom: `1px dotted ${rule}` }}>
          <span style={{ fontWeight: 700 }}>{s.name}</span>
          <span style={{ display: "flex", gap: 1 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={10} color={i < Math.round(((s.level ?? 0) / 100) * 5) ? red : rule} />
            ))}
          </span>
        </div>
      ));
    return data.languages.map((l) => (
      <div key={l.id} style={{ fontSize: fs, color: ink, padding: "2px 0" }}>
        <b>{l.name}</b> <span style={{ fontStyle: "italic", color: muted }}>— {levelWord(l.level).toLowerCase()}</span>
      </div>
    ));
  };

  const lowerLeft = pick(data, LOWER_LEFT);
  const lowerRight = pick(data, LOWER_RIGHT);
  const showSkills = pick(data, ["skills"]).length > 0;
  const showLangs = pick(data, ["languages"]).length > 0;
  const showSummary = pick(data, ["summary"]).length > 0;
  const contacts = contactItems(p);
  const crime = /design/i.test(p.title || "") ? "design work" : "work";

  const texture = [
    "radial-gradient(ellipse at 50% 45%, rgba(255,250,235,0.55) 0%, rgba(255,250,235,0) 60%)",
    "radial-gradient(circle at 12% 18%, rgba(120,80,30,0.16) 0 5%, transparent 14%)",
    "radial-gradient(circle at 86% 72%, rgba(120,80,30,0.14) 0 4%, transparent 12%)",
    "radial-gradient(circle at 70% 8%, rgba(120,80,30,0.10) 0 3%, transparent 9%)",
    "radial-gradient(circle at 20% 88%, rgba(120,80,30,0.12) 0 3%, transparent 10%)",
    "radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(92,58,20,0.34) 100%)",
    "repeating-linear-gradient(3deg, rgba(110,80,40,0.035) 0 2px, transparent 2px 7px)",
  ].join(", ");

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "baskerville"), color: ink, background: `${texture}, ${paper}`, padding: "26px 30px 24px", boxSizing: "border-box" })}>
      {/* nail holes */}
      {[[18, 18], [776 - 8, 18], [18, 1105 - 8], [776 - 8, 1105 - 8]].map(([x, y], i) => (
        <span key={i} style={{ position: "absolute", left: x - 4, top: y - 4, width: 9, height: 9, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #8a7a66, #3a2c1e)" }} />
      ))}

      <div style={{ border: `3px solid ${ink}`, outline: `1px solid ${ink}`, outlineOffset: 4, padding: "14px 26px 16px", minHeight: 1061, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: muted }}>
            <span style={{ flex: 1, height: 1.5, background: ink }} />
            By order of the hiring committee
            <span style={{ flex: 1, height: 1.5, background: ink }} />
          </div>
          <div style={{ fontFamily: rye, fontSize: 108, lineHeight: 1, letterSpacing: 6, color: ink, marginTop: 4, textShadow: `2px 2px 0 ${mix(paper, ink, 0.18)}` }}>WANTED</div>
          <div style={{ fontFamily: rye, fontSize: 21, letterSpacing: 2, color: red, marginTop: 2, textTransform: "uppercase" }}>For outstanding {crime}</div>
        </div>

        {/* skills · photo · contact */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {showSkills && (
              <section data-section="skills">
                <Head k="skills" center />
                {body("skills")}
              </section>
            )}
          </div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ padding: 7, border: `2px solid ${ink}`, background: mix(paper, "#ffffff", 0.3), boxShadow: `inset 0 0 0 3px ${paper}, 3px 3px 0 ${rule}` }}>
              <Photo
                src={photoOf(data, theme)}
                name={p.name}
                size={188}
                placeholderBg={mix(ink, paper, 0.35)}
                style={{ borderRadius: 0, filter: "sepia(0.55) contrast(1.05)", display: "block" }}
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {contacts.length > 0 && (
              <div data-section="contact">
                <div style={{ fontFamily: rye, fontSize: 15, letterSpacing: 0.5, color: ink, textAlign: "center", marginBottom: 7, textTransform: "uppercase" }}>Report sightings to</div>
                {contacts.map((c) => (
                  <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: ink, marginBottom: 4, wordBreak: "break-word" }}>
                    <Icon name={c.icon} size={13} color={red} />
                    <span>{c.value}</span>
                  </div>
                ))}
              </div>
            )}
            {showLangs && (
              <section data-section="languages">
                <Head k="languages" center />
                <div style={{ textAlign: "center" }}>{body("languages")}</div>
              </section>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div style={{ fontFamily: rye, fontSize: 40, lineHeight: 1.1, color: ink, letterSpacing: 1 }}>{p.name}</div>
          {p.title && <div style={{ fontSize: 13, fontStyle: "italic", color: muted, marginTop: 1 }}>alias &ldquo;the {p.title}&rdquo;</div>}
        </div>

        {/* reward */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "12px 0 10px" }}>
          <span style={{ flex: 1, height: 3, borderTop: `1.5px solid ${ink}`, borderBottom: `1.5px solid ${ink}` }} />
          <div style={{ textAlign: "center", border: `2px solid ${red}`, padding: "4px 22px 5px", background: mix(paper, accent, 0.15) }}>
            <div style={{ fontFamily: rye, fontSize: 30, lineHeight: 1.1, color: red, letterSpacing: 2 }}>REWARD</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ink, letterSpacing: 0.5 }}>One excellent job offer &amp; good coffee</div>
          </div>
          <span style={{ flex: 1, height: 3, borderTop: `1.5px solid ${ink}`, borderBottom: `1.5px solid ${ink}` }} />
        </div>

        {showSummary && (
          <p data-section="summary" style={{ margin: "0 auto 12px", maxWidth: 600, textAlign: "center", fontSize: 12.5, lineHeight: 1.6, color: ink }}>
            <b style={{ letterSpacing: 1, textTransform: "uppercase" }}>Description: </b>
            {p.summary}
          </p>
        )}

        {/* record */}
        {(lowerLeft.length > 0 || lowerRight.length > 0) && (
          <div style={{ display: "flex", gap: 22, borderTop: `1.5px solid ${ink}`, paddingTop: 12 }}>
            <div style={{ flex: 1.45, minWidth: 0 }}>
              {lowerLeft.map((k) => (
                <section key={k} data-section={k} style={{ marginBottom: 8 }}>
                  <Head k={k} />
                  {body(k)}
                </section>
              ))}
            </div>
            <div style={{ width: 1.5, background: rule }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {lowerRight.map((k) => (
                <section key={k} data-section={k} style={{ marginBottom: 8 }}>
                  <Head k={k} />
                  {body(k)}
                </section>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: 8, borderTop: `1px solid ${rule}`, display: "flex", justifyContent: "space-between", fontSize: 11, fontStyle: "italic", color: muted }}>
          <span>Approach with a job offer. Considered highly creative.</span>
          <span>Do not let this one get away.</span>
        </div>
      </div>
    </div>
  );
}
