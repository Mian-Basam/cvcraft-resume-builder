// The Royal Portfolio: emerald crest band with an arched portrait, a corner-bracketed formal profile and two champagne-trimmed columns.
import { BulletList, Photo, dateRange, lines, mix, pageStyle } from "../../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, photoOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

export default function RoyalPortfolio({ data, theme }) {
  const p = data.personal;
  const emerald = theme.primary;
  const champ = mix(theme.accent, "#e6d3a6", 0.4);
  const champDeep = mix(champ, "#5a4a2a", 0.35);
  const ivory = "#fdfbf6";
  const ink = "#25282a";
  const muted = "#6e6a62";
  const royal = fontStack("cinzel");
  const sans = fontOf(theme, "lato");
  const panel = mix(emerald, "#ffffff", 0.94);

  const sideOpts = {
    primary: emerald, text: ink, muted, titleColor: ink, subColor: emerald, fs: 11.2, dateStyle: "below",
    skillStyle: "dots", langStyle: "dots", interestStyle: "list", barColor: emerald, track: mix(champ, "#ffffff", 0.45),
  };

  const Heading = ({ children, center }) => (
    <div style={{ marginBottom: 14, textAlign: center ? "center" : "left" }}>
      <h3 style={{ margin: 0, fontFamily: royal, fontSize: 14.5, fontWeight: 700, letterSpacing: 2.5, color: emerald }}>{children}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, justifyContent: center ? "center" : "flex-start" }}>
        <span style={{ width: 30, height: 2, background: champDeep }} />
        <span style={{ width: 5, height: 5, background: champDeep, transform: "rotate(45deg)" }} />
        <span style={{ width: 12, height: 1, background: champDeep }} />
      </div>
    </div>
  );

  const Entry = ({ title, sub, date, extra, bullets = [] }) => (
    <div style={{ marginBottom: 18, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: ink }}>{title}</div>
        {date && <div style={{ fontFamily: royal, fontSize: 11, letterSpacing: 1, color: champDeep, whiteSpace: "nowrap", fontWeight: 700 }}>{date}</div>}
      </div>
      {sub && <div style={{ fontSize: 11.8, color: emerald, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
      {extra && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{extra}</div>}
      <BulletList items={bullets} style={{ fontSize: 11.5, lineHeight: 1.6, marginTop: 6, color: ink }} />
    </div>
  );

  const mainBody = (k) => {
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} title={e.role} sub={[e.company, e.location].filter(Boolean).join(", ")} date={dateRange(e.start, e.end)} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => <Entry key={e.id} title={e.degree} sub={e.school} date={dateRange(e.start, e.end)} extra={e.grade} />);
    return data.projects.map((e) => <Entry key={e.id} title={e.name} sub={e.link} bullets={lines(e.description)} />);
  };

  const Corner = ({ pos }) => {
    const v = pos.includes("t") ? { top: -1 } : { bottom: -1 };
    const h = pos.includes("l") ? { left: -1 } : { right: -1 };
    const b = `2px solid ${emerald}`;
    return (
      <span
        style={{
          position: "absolute", width: 16, height: 16, ...v, ...h,
          borderTop: pos.includes("t") ? b : "none", borderBottom: pos.includes("b") ? b : "none",
          borderLeft: pos.includes("l") ? b : "none", borderRight: pos.includes("r") ? b : "none",
        }}
      />
    );
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: sans, color: ink, background: ivory, display: "flex", flexDirection: "column" })}>
      {/* Crest band */}
      <header style={{ background: emerald, padding: "44px 56px 40px", display: "flex", alignItems: "center", gap: 34, position: "relative" }}>
        <div style={{ padding: 5, border: `1px solid ${champ}`, borderRadius: "74px 74px 6px 6px", flexShrink: 0 }}>
          <Photo
            src={photoOf(data, theme)}
            name={p.name}
            size={128}
            placeholderBg={mix(emerald, "#ffffff", 0.16)}
            style={{ height: 150, borderRadius: "64px 64px 3px 3px", border: `2px solid ${champ}` }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 26, height: 1, background: champ }} />
            <span style={{ width: 5, height: 5, background: champ, transform: "rotate(45deg)" }} />
            <span style={{ width: 26, height: 1, background: champ }} />
          </div>
          <h1 style={{ margin: 0, fontFamily: royal, fontSize: 40, fontWeight: 700, letterSpacing: 3, lineHeight: 1.1, color: champ }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 10, fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>{p.title}</div>}
          <div data-section="contact" style={{ marginTop: 16 }}>
            <ContactList p={p} inline fs={10.8} color="rgba(255,255,255,0.88)" iconColor={champ} />
          </div>
        </div>
      </header>
      <div style={{ height: 4, background: champ }} />
      <div style={{ height: 1, background: emerald, marginTop: 2 }} />

      {/* Formal profile */}
      {pick(data, ["summary"]).map((k) => (
        <section key={k} data-section={k} style={{ position: "relative", margin: "34px 56px 6px", padding: "26px 40px 22px", border: `1px solid ${mix(champ, ivory, 0.2)}`, textAlign: "center" }}>
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          <div style={{ position: "absolute", top: -9, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <span style={{ background: ivory, padding: "0 14px", fontFamily: royal, fontSize: 13, fontWeight: 700, letterSpacing: 4, color: emerald, lineHeight: "18px" }}>Profile</span>
          </div>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.75, color: ink, fontStyle: "italic" }}>{p.summary}</p>
        </section>
      ))}

      <div style={{ display: "flex", flex: 1, padding: "28px 56px 0" }}>
        <main style={{ flex: 1, minWidth: 0, paddingRight: 34 }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 24 }}>
              <Heading>{SECTION_META[k].title}</Heading>
              {mainBody(k)}
            </section>
          ))}
        </main>
        <aside style={{ width: 226, flexShrink: 0, background: panel, borderTop: `3px solid ${champDeep}`, padding: "24px 22px 28px", boxSizing: "border-box", marginBottom: 44 }}>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 24 }}>
              <Heading>{SECTION_META[k].title}</Heading>
              <SectionBody k={k} data={data} o={sideOpts} />
            </section>
          ))}
        </aside>
      </div>
      <div style={{ height: 8, background: emerald, borderTop: `2px solid ${champ}` }} />
    </div>
  );
}
