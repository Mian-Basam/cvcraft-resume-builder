// The Black Label: matte-black two-column page, palette-driven gold typography, framed portrait plate and gilt hairlines.
import { Photo, dateRange, lines, mix, pageStyle } from "../../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, photoOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "experience", "projects", "education"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

export default function BlackLabel({ data, theme }) {
  const p = data.personal;
  const gold = mix(theme.accent, "#d8bd86", 0.3);
  const goldSoft = mix(gold, "#0e0e0e", 0.55);
  const text = "#d9d4ca";
  const muted = "#8f897e";
  const serif = fontStack("cormorant");
  const monogram = (p.name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join(" · ");
  const sans = fontOf(theme, "montserrat");

  const sideOpts = {
    primary: gold, text, muted, titleColor: "#f1ece2", subColor: gold, fs: 11, dateStyle: "below",
    skillStyle: "list", langStyle: "dots", interestStyle: "inline", barColor: gold, track: "#2e2c29",
  };

  const SideHeading = ({ children }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 14px", fontFamily: sans, fontSize: 10.5, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: gold }}>
      <span style={{ width: 16, height: 1, background: gold }} />
      {children}
    </h3>
  );

  const MainHeading = ({ children }) => (
    <h3 style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "0 0 16px", fontFamily: serif, fontSize: 23, fontWeight: 500, letterSpacing: 3.5, textTransform: "uppercase", color: gold }}>
      {children}
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${goldSoft}, rgba(0,0,0,0))`, alignSelf: "center" }} />
    </h3>
  );

  const Bullets = ({ items }) =>
    items.length ? (
      <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0" }}>
        {items.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 10, fontSize: 11, lineHeight: 1.6, color: text, marginBottom: 3 }}>
            <span style={{ width: 4, height: 4, marginTop: 7, background: gold, transform: "rotate(45deg)", flexShrink: 0 }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    ) : null;

  const Entry = ({ title, sub, date, extra, bullets = [] }) => (
    <div style={{ marginBottom: 18, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, color: "#f3eee4", lineHeight: 1.2 }}>{title}</div>
        {date && <div style={{ fontSize: 10.5, letterSpacing: 1.5, color: muted, whiteSpace: "nowrap" }}>{date}</div>}
      </div>
      {sub && <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: gold, marginTop: 4 }}>{sub}</div>}
      {extra && <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>{extra}</div>}
      <Bullets items={bullets} />
    </div>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontFamily: serif, fontSize: 16.5, fontStyle: "italic", lineHeight: 1.55, color: "#e6e1d7" }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} title={e.role} sub={[e.company, e.location].filter(Boolean).join("  ·  ")} date={dateRange(e.start, e.end)} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => <Entry key={e.id} title={e.degree} sub={e.school} date={dateRange(e.start, e.end)} extra={e.grade} />);
    if (k === "projects")
      return data.projects.map((e) => <Entry key={e.id} title={e.name} sub={e.link} bullets={lines(e.description)} />);
    return null;
  };

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: sans,
        color: text,
        background: "radial-gradient(ellipse at 18% 0%, #1d1c1a 0%, #111110 45%, #0b0b0b 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "60px 56px 40px",
        boxSizing: "border-box",
      })}
    >
      {/* Header: framed portrait plate + name */}
      <header style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ padding: 5, border: `1px solid ${goldSoft}`, flexShrink: 0 }}>
          <Photo
            src={photoOf(data, theme)}
            name={p.name}
            size={108}
            placeholderBg={mix(gold, "#111111", 0.72)}
            style={{ borderRadius: 0, border: `1px solid ${gold}` }}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 9.5, letterSpacing: 6, textTransform: "uppercase", color: muted, marginBottom: 6 }}>Curriculum Vitae</div>
          <h1 style={{ margin: 0, fontFamily: serif, fontSize: 50, fontWeight: 500, lineHeight: 1, letterSpacing: 3, textTransform: "uppercase", color: gold }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 10, fontSize: 11.5, letterSpacing: 5, textTransform: "uppercase", color: "#c9c2b5" }}>{p.title}</div>}
        </div>
      </header>

      <div style={{ height: 1, margin: "34px 0 36px", background: `linear-gradient(90deg, ${gold}, ${goldSoft} 45%, rgba(0,0,0,0))` }} />

      <div style={{ display: "flex", flex: 1 }}>
        <aside style={{ width: 210, flexShrink: 0, paddingRight: 30, borderRight: `1px solid ${mix(gold, "#111111", 0.75)}` }}>
          <section data-section="contact" style={{ marginBottom: 30 }}>
            <SideHeading>Contact</SideHeading>
            <ContactList p={p} fs={11} iconColor={gold} color={text} gap={10} />
          </section>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 30 }}>
              <SideHeading>{SECTION_META[k].title}</SideHeading>
              {k === "skills" ? (
                data.skills.map((s) => (
                  <div key={s.id} style={{ marginBottom: 10, fontSize: 11 }}>
                    <div style={{ marginBottom: 5, color: text }}>{s.name}</div>
                    <div style={{ height: 2, background: "#2e2c29" }}>
                      <div style={{ height: "100%", width: `${s.level ?? 0}%`, background: `linear-gradient(90deg, ${goldSoft}, ${gold})` }} />
                    </div>
                  </div>
                ))
              ) : (
                <SectionBody k={k} data={data} o={sideOpts} />
              )}
            </section>
          ))}
        </aside>

        <main style={{ flex: 1, minWidth: 0, paddingLeft: 36 }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 28 }}>
              <MainHeading>{SECTION_META[k].title}</MainHeading>
              {mainBody(k)}
            </section>
          ))}
        </main>
      </div>

      {/* Monogram mark at the foot of the page */}
      <footer style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
        <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(0,0,0,0), ${goldSoft})` }} />
        <span style={{ fontFamily: serif, fontSize: 15, letterSpacing: 6, textTransform: "uppercase", color: gold }}>{monogram}</span>
        <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${goldSoft}, rgba(0,0,0,0))` }} />
      </footer>
    </div>
  );
}
