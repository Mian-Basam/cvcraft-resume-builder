// The Circular Profile: two columns — a large palette circle bleeding off the top corner frames a round photo with an orbit arc; circular section markers, skill rings, concentric language rings, round interest badges and year bubbles on entries.
import { pageStyle, lines, dateRange, mix, contactItems, Photo } from "../../shared";
import { pick, fontOf, photoOf, levelWord } from "../../kit";
import Icon, { interestIcon } from "../../Icon";

const MAIN_KEYS = ["summary", "experience", "projects"];
const SIDE_KEYS = ["skills", "languages", "education", "certifications", "interests"];
const TITLES = {
  summary: "About Me",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};
const ICONS = { summary: "user", experience: "experience", education: "education", projects: "code", skills: "skills", languages: "language", certifications: "star", interests: "heart" };
const BIG = 420; // diameter of the corner circle
const SIDE_W = 256;

export default function CircularProfile({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#1b1f27";
  const text = "#30353f";
  const muted = "#6b7280";
  const tint = mix(primary, "#ffffff", 0.92);
  const track = mix(primary, "#ffffff", 0.85);
  const photo = photoOf(data, theme);

  const Heading = ({ k }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 13px" }}>
      <span style={{ width: 30, height: 30, borderRadius: "50%", background: primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 0 3px #fff, 0 0 0 4.5px ${accent}` }}>
        <Icon name={ICONS[k]} size={14} color="#fff" />
      </span>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: ink, letterSpacing: 0.3 }}>{TITLES[k]}</h3>
      <span style={{ display: "flex", gap: 4, marginLeft: 2 }}>
        {[1, 0.55, 0.3].map((o) => (
          <span key={o} style={{ width: 5, height: 5, borderRadius: "50%", background: primary, opacity: o }} />
        ))}
      </span>
    </div>
  );

  const Ring = ({ value, size = 66, stroke = 6 }) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={primary} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(c * Math.min(100, value || 0)) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        <circle cx={size / 2} cy={size / 2} r={r - stroke - 2} fill={tint} />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{value || 0}</text>
      </svg>
    );
  };

  // Several languages as concentric arcs, outermost first.
  const LangRings = () => {
    const list = data.languages.slice(0, 4);
    const size = 104;
    const stroke = 7;
    const shades = [primary, mix(primary, "#ffffff", 0.35), mix(primary, accent, 0.6), accent];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
          {list.map((l, i) => {
            const r = size / 2 - stroke / 2 - i * (stroke + 4);
            const c = 2 * Math.PI * r;
            return (
              <g key={l.id}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={shades[i]} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(c * Math.min(100, l.level || 0)) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
              </g>
            );
          })}
        </svg>
        <div style={{ minWidth: 0 }}>
          {data.languages.map((l, i) => (
            <div key={l.id} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 7 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: shades[i] || primary, flexShrink: 0, marginTop: 3 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.25 }}>{l.name}</div>
                <div style={{ fontSize: 10.5, color: muted }}>{levelWord(l.level)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sideBody = (k) => {
    if (k === "skills")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px 6px" }}>
          {data.skills.map((s) => (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, textAlign: "center" }}>
              <Ring value={s.level} />
              <span style={{ fontSize: 10.5, lineHeight: 1.25, color: text }}>{s.name}</span>
            </div>
          ))}
        </div>
      );
    if (k === "languages") return <LangRings />;
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ width: 38, height: 38, borderRadius: "50%", background: primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="education" size={16} color="#fff" />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{e.degree}</div>
            {e.school && <div style={{ fontSize: 11, color: primary, fontWeight: 600 }}>{e.school}</div>}
            <div style={{ fontSize: 10.5, color: muted }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>
          </div>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 9 }}>
          <span style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${primary}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, color: primary, flexShrink: 0, boxSizing: "border-box" }}>{c.year || <Icon name="star" size={14} color={primary} />}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{c.name}</div>
            {c.issuer && <div style={{ fontSize: 10.5, color: muted }}>{c.issuer}</div>}
          </div>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 14px" }}>
          {data.interests.map((it) => (
            <div key={it.id} style={{ width: 62, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ width: 44, height: 44, borderRadius: "50%", background: tint, border: `1.5px solid ${track}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={interestIcon(it.name)} size={19} color={primary} strokeWidth={1.7} />
              </span>
              <span style={{ fontSize: 10.5, color: text, textAlign: "center", lineHeight: 1.2 }}>{it.name}</span>
            </div>
          ))}
        </div>
      );
    return null;
  };

  const Entry = ({ bubble, title, sub, date, bullets, extra }) => (
    <div style={{ display: "flex", gap: 14, marginBottom: 18, breakInside: "avoid" }}>
      <span style={{ width: 46, height: 46, borderRadius: "50%", background: tint, border: `2px solid ${primary}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: primary }}>{bubble}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{title}</div>
          {date && <span style={{ fontSize: 10.5, fontWeight: 600, color: ink, background: mix(accent, "#ffffff", 0.5), padding: "2px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>{date}</span>}
        </div>
        {sub && <div style={{ fontSize: 11.5, color: primary, fontWeight: 600, marginTop: 1 }}>{sub}</div>}
        {extra && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{extra}</div>}
        {bullets && bullets.length > 0 && (
          <div style={{ marginTop: 5 }}>
            {bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.55, color: text, marginBottom: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, border: `1px solid ${primary}`, flexShrink: 0, marginTop: 6, boxSizing: "border-box" }} />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const short = (y) => (y ? String(y).match(/\d{4}/)?.[0] || "" : "");

  const mainBody = (k) => {
    if (k === "summary")
      return <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: text, background: tint, borderRadius: 22, padding: "14px 20px" }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} bubble={short(e.start) || <Icon name="experience" size={16} color={primary} />} title={e.role} sub={[e.company, e.location].filter(Boolean).join(" · ")} date={dateRange(e.start, e.end)} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => (
        <Entry key={e.id} bubble={<Icon name="education" size={17} color={primary} />} title={e.degree} sub={e.school} extra={e.grade} date={dateRange(e.start, e.end)} />
      ));
    if (k === "projects")
      return data.projects.map((e) => (
        <Entry key={e.id} bubble={<Icon name="code" size={16} color={primary} />} title={e.name} sub={e.link} bullets={lines(e.description)} />
      ));
    return null;
  };

  const contacts = contactItems(p);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: text })}>
      <div aria-hidden="true" style={{ position: "absolute", left: -110, top: -150, width: BIG, height: BIG, borderRadius: "50%", background: primary }} />
      <div aria-hidden="true" style={{ position: "absolute", left: 232, top: 162, width: 50, height: 50, borderRadius: "50%", background: accent, opacity: 0.85 }} />
      <div aria-hidden="true" style={{ position: "absolute", right: -60, bottom: -60, width: 180, height: 180, borderRadius: "50%", border: `22px solid ${tint}` }} />

      <div style={{ position: "absolute", left: 50, top: 36 }}>
        <svg width="196" height="196" viewBox="0 0 196 196" style={{ position: "absolute", left: -18, top: -18 }} aria-hidden="true">
          <circle cx="98" cy="98" r="93" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeDasharray="420 600" transform="rotate(120 98 98)" />
          <circle cx="98" cy="98" r="93" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 6" />
        </svg>
        <Photo src={photo} name={p.name} size={160} placeholderBg={mix(primary, "#ffffff", 0.25)} style={{ border: "5px solid #ffffff" }} />
      </div>

      <header style={{ position: "relative", marginLeft: 342, padding: "56px 46px 0 0", minHeight: 236, boxSizing: "border-box" }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, color: ink, letterSpacing: -0.5, lineHeight: 1.1 }}>{p.name}</h1>
        {p.title && (
          <div style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 600, color: "#fff", background: primary, padding: "4px 14px", borderRadius: 999, letterSpacing: 1.2, textTransform: "uppercase" }}>{p.title}</div>
        )}
        {contacts.length > 0 && (
          <div data-section="contact" style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
            {contacts.map((c) => (
              <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: text, minWidth: 0 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${primary}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxSizing: "border-box" }}>
                  <Icon name={c.icon} size={11} color={primary} />
                </span>
                <span style={{ wordBreak: "break-word" }}>{c.value}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      <div style={{ position: "relative", display: "flex", gap: 30, padding: "48px 46px 24px 46px" }}>
        <aside style={{ width: SIDE_W, flexShrink: 0 }}>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 28 }}>
              <Heading k={k} />
              {sideBody(k)}
            </section>
          ))}
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 30 }}>
              <Heading k={k} />
              {mainBody(k)}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
