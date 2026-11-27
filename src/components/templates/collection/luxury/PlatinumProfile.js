// The Platinum Profile: brushed-silver header with a metallic seal, two columns, structured credential cards and metallic gradient rules and badges.
import { BulletList, dateRange, lines, mix, pageStyle } from "../../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, pick } from "../../kit";
import Icon from "../../Icon";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

export default function PlatinumProfile({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const ink = "#22262c";
  const muted = "#6d737c";
  // Silver tones lightly tinted by the palette so each palette reads as its own metal.
  const s1 = mix(primary, "#c9ced5", 0.82);
  const s2 = "#f6f7f9";
  const s3 = mix(primary, "#9aa1ab", 0.78);
  const deep = mix(primary, "#1c1f24", 0.25);
  const metal = (deg = 90) => `linear-gradient(${deg}deg, ${s3}, ${s1} 22%, ${s2} 48%, ${s1} 70%, ${s3})`;
  const soft = `linear-gradient(180deg, #ffffff, ${mix(s1, "#ffffff", 0.45)} 60%, ${mix(s1, "#ffffff", 0.2)})`;
  const sans = fontOf(theme, "montserrat");
  const initials = (p.name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

  const Heading = ({ children }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 16px", fontSize: 12, fontWeight: 700, letterSpacing: 3.5, textTransform: "uppercase", color: deep }}>
      <span style={{ width: 9, height: 9, background: metal(135), border: `1px solid ${s3}`, transform: "rotate(45deg)", flexShrink: 0 }} />
      {children}
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${s3}, rgba(255,255,255,0))` }} />
    </h3>
  );

  const DateBadge = ({ children }) => (
    <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6, color: deep, padding: "3px 10px", borderRadius: 999, background: soft, border: `1px solid ${s1}`, whiteSpace: "nowrap" }}>{children}</span>
  );

  const Entry = ({ title, sub, date, bullets = [] }) => (
    <div style={{ marginBottom: 24, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: ink }}>{title}</div>
        {date && <DateBadge>{date}</DateBadge>}
      </div>
      {sub && <div style={{ fontSize: 12, fontWeight: 500, color: primary, marginTop: 4 }}>{sub}</div>}
      <BulletList items={bullets} style={{ fontSize: 11.8, lineHeight: 1.7, marginTop: 8, color: ink }} />
    </div>
  );

  const Card = ({ icon, title, sub, meta, extra }) => (
    <div style={{ display: "flex", gap: 10, padding: "10px 12px", marginBottom: 10, background: "#fff", border: `1px solid ${s1}`, borderLeft: "none", position: "relative", breakInside: "avoid" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: metal(180) }} />
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: metal(135), border: `1px solid ${s3}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 3 }}>
        <Icon name={icon} size={13} color={deep} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: ink, lineHeight: 1.35 }}>{title}</div>
        {sub && <div style={{ fontSize: 10.8, color: primary, marginTop: 2 }}>{sub}</div>}
        {(meta || extra) && <div style={{ fontSize: 10.5, color: muted, marginTop: 2 }}>{[meta, extra].filter(Boolean).join("  ·  ")}</div>}
      </div>
    </div>
  );

  const sideBody = (k) => {
    if (k === "certifications")
      return data.certifications.map((c) => <Card key={c.id} icon="star" title={c.name} sub={c.issuer} meta={c.year} />);
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ marginBottom: 9, fontSize: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: ink }}>
            <span>{s.name}</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: "#e7e9ec", overflow: "hidden", boxShadow: "inset 0 1px 1px rgba(0,0,0,0.06)" }}>
            <div style={{ height: "100%", width: `${s.level ?? 0}%`, borderRadius: 3, background: `linear-gradient(180deg, ${s1}, ${s3} 55%, ${deep})` }} />
          </div>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.interests.map((i) => (
            <span key={i.id} style={{ fontSize: 10.8, padding: "3px 10px", borderRadius: 999, background: soft, border: `1px solid ${s1}`, color: deep }}>{i.name}</span>
          ))}
        </div>
      );
    return <SectionBody k={k} data={data} o={{ primary: deep, text: ink, muted, fs: 11, langStyle: "dots", barColor: s3, track: "#e3e5e8" }} />;
  };

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12.3, lineHeight: 1.8, color: ink }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} title={e.role} sub={[e.company, e.location].filter(Boolean).join(" — ")} date={dateRange(e.start, e.end)} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 }}>
          {data.education.map((e) => <Card key={e.id} icon="education" title={e.degree} sub={e.school} meta={dateRange(e.start, e.end)} extra={e.grade} />)}
        </div>
      );
    return data.projects.map((e) => <Entry key={e.id} title={e.name} sub={e.link} bullets={lines(e.description)} />);
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: sans, color: ink, display: "flex", flexDirection: "column" })}>
      {/* Brushed-silver header */}
      <header
        style={{
          position: "relative",
          padding: "62px 56px 52px",
          background: `linear-gradient(115deg, #f8f9fa 0%, ${mix(s1, "#ffffff", 0.55)} 38%, #fbfbfc 55%, ${mix(s1, "#ffffff", 0.4)} 100%)`,
          display: "flex",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={{ width: 108, height: 108, borderRadius: "50%", padding: 3, background: `conic-gradient(from 30deg, ${s3}, ${s2}, ${s1}, ${s3}, ${s2}, ${s1}, ${s3})`, flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${mix(deep, "#ffffff", 0.25)}, ${deep})`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${s2}`, boxSizing: "border-box" }}>
            <span style={{ fontSize: 32, fontWeight: 300, letterSpacing: 3, color: "#f3f4f6", marginLeft: 3 }}>{initials}</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 42, fontWeight: 300, letterSpacing: 7, textTransform: "uppercase", color: deep, lineHeight: 1.1 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", color: s3 === deep ? muted : mix(s3, "#000000", 0.25) }}>{p.title}</div>}
        </div>
      </header>
      <div style={{ height: 4, background: metal(90) }} />
      <div style={{ height: 1, background: s3 }} />

      <div style={{ display: "flex", flex: 1 }}>
        <main style={{ flex: 1, minWidth: 0, padding: "44px 36px 40px 56px" }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 36 }}>
              <Heading>{SECTION_META[k].title}</Heading>
              {mainBody(k)}
            </section>
          ))}
        </main>
        <aside style={{ width: 262, flexShrink: 0, padding: "40px 40px 40px 28px", background: `linear-gradient(180deg, ${mix(s1, "#ffffff", 0.7)}, #fafbfc 60%)`, borderLeft: `1px solid ${s1}` }}>
          <section data-section="contact" style={{ marginBottom: 26 }}>
            <Heading>Contact</Heading>
            <ContactList p={p} fs={10.8} iconColor={s3 === deep ? primary : mix(s3, "#000000", 0.2)} color={ink} gap={9} />
          </section>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 28 }}>
              <Heading>{k === "certifications" ? "Credentials" : SECTION_META[k].title}</Heading>
              {sideBody(k)}
            </section>
          ))}
        </aside>
      </div>
      <div style={{ height: 6, background: metal(90) }} />
    </div>
  );
}
