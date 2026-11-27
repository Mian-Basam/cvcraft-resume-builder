// Three-Column CV: a name masthead over three equal-height columns — contact & skills, experience, projects & education — each with its own coloured cap.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const LEFT = ["skills", "languages", "interests"];
const CENTER = ["summary", "experience"];
const RIGHT = ["projects", "education", "certifications"];

export default function ThreeColumnCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.15);
  const muted = mix(ink, "#ffffff", 0.42);
  const leftBg = mix(primary, "#ffffff", 0.9);
  const rightBg = mix(accent, "#ffffff", 0.82);
  const display = fontStack("montserrat");

  const left = pick(data, LEFT);
  const center = pick(data, CENTER);
  const right = pick(data, RIGHT);
  const hasContact = Boolean(p.email || p.phone || p.address || p.website);

  const Head = ({ k, color = primary }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 14px" }}>
      <span style={{ width: 14, height: 3, background: color }} />
      <h3 style={{ margin: 0, fontFamily: display, fontSize: 13.5, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: ink }}>{SECTION_META[k].title}</h3>
    </div>
  );

  const Cap = ({ n, label, bg, fg }) => (
    <div style={{ background: bg, color: fg, height: 64, padding: "0 22px", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: display, fontSize: 24, fontWeight: 800, opacity: 0.55 }}>{n}</span>
      <span style={{ fontFamily: display, fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>{label}</span>
    </div>
  );

  const End = ({ n, bg }) => (
    <div style={{ padding: "0 22px 22px", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ flex: 1, height: 1, background: mix(bg, "#ffffff", 0.5) }} />
      <span style={{ fontFamily: display, fontSize: 10.5, fontWeight: 700, letterSpacing: 2, color: muted }}>{n} / 03</span>
    </div>
  );

  const leftBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ marginBottom: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: ink }}>
            <span>{s.name}</span>
            <span style={{ color: muted, fontWeight: 500 }}>{s.level ?? 0}</span>
          </div>
          <div style={{ height: 5, background: mix(primary, "#ffffff", 0.72), marginTop: 5 }}>
            <div style={{ width: `${s.level ?? 0}%`, height: "100%", background: primary }} />
          </div>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: ink, padding: "7px 0", borderBottom: `1px solid ${mix(primary, "#ffffff", 0.75)}` }}>
          <span style={{ fontWeight: 600 }}>{l.name}</span>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((i) => (
          <span key={i.id} style={{ fontSize: 12, padding: "4px 10px", border: `1px solid ${primary}`, color: primary, fontWeight: 600 }}>{i.name}</span>
        ))}
      </div>
    );
  };

  const centerBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75, color: ink }}>{p.summary}</p>;
    return data.experience.map((e, i) => (
      <div key={e.id} style={{ position: "relative", paddingLeft: 18, paddingBottom: i < data.experience.length - 1 ? 34 : 0, borderLeft: `2px solid ${mix(primary, "#ffffff", 0.75)}`, breakInside: "avoid" }}>
        <span style={{ position: "absolute", left: -6, top: 3, width: 10, height: 10, background: primary, borderRadius: "50%" }} />
        {dateRange(e.start, e.end) && (
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: primary }}>{dateRange(e.start, e.end)}</div>
        )}
        <div style={{ fontFamily: display, fontSize: 16, fontWeight: 700, color: ink, marginTop: 4 }}>{e.role}</div>
        {(e.company || e.location) && (
          <div style={{ fontSize: 12.5, color: muted, fontWeight: 600, marginTop: 3 }}>{[e.company, e.location].filter(Boolean).join(" · ")}</div>
        )}
        {lines(e.bullets).map((b, j) => (
          <div key={j} style={{ display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.6, color: ink, marginTop: 8 }}>
            <span style={{ color: primary, fontWeight: 800 }}>›</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
    ));
  };

  const rightBody = (k) => {
    const items =
      k === "projects"
        ? data.projects.map((e) => ({ id: e.id, t: e.name, s: e.link, d: "", b: lines(e.description) }))
        : k === "education"
        ? data.education.map((e) => ({ id: e.id, t: e.degree, s: e.school, d: dateRange(e.start, e.end), b: e.grade ? [e.grade] : [] }))
        : data.certifications.map((e) => ({ id: e.id, t: e.name, s: e.issuer, d: e.year, b: [] }));
    return items.map((e) => (
      <div key={e.id} style={{ background: "#fff", padding: "16px 16px", marginBottom: 14, borderTop: `3px solid ${primary}`, breakInside: "avoid" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{e.t}</div>
        {e.s && <div style={{ fontSize: 12, color: primary, fontWeight: 600, marginTop: 3, wordBreak: "break-word" }}>{e.s}</div>}
        {e.d && <div style={{ fontSize: 11.5, color: muted, marginTop: 3 }}>{e.d}</div>}
        {e.b.map((b, j) => (
          <div key={j} style={{ fontSize: 12, lineHeight: 1.55, color: ink, marginTop: 7 }}>{b}</div>
        ))}
      </div>
    ));
  };

  const col = { padding: "34px 22px 24px", flex: 1 };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: ink, display: "flex", flexDirection: "column" })}>
      <header style={{ padding: "64px 44px 44px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, borderBottom: `6px solid ${primary}` }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontFamily: display, fontSize: 50, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1, color: ink }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, letterSpacing: 3.5, textTransform: "uppercase", color: primary }}>{p.title}</div>}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {[primary, dark, accent].map((c, i) => (
            <span key={i} style={{ width: 26, height: 26, background: c }} />
          ))}
        </div>
      </header>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "232px 1fr 232px" }}>
        <aside style={{ background: leftBg, display: "flex", flexDirection: "column" }}>
          <Cap n="01" label="Contact · Skills" bg={primary} fg="#fff" />
          <div style={col}>
            {hasContact && (
              <section data-section="contact" style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px" }}>
                  <span style={{ width: 14, height: 3, background: primary }} />
                  <h3 style={{ margin: 0, fontFamily: display, fontSize: 13.5, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: ink }}>Contact</h3>
                </div>
                <ContactList p={p} fs={12} iconColor={primary} color={ink} gap={11} />
              </section>
            )}
            {left.map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 36 }}>
                <Head k={k} />
                {leftBody(k)}
              </section>
            ))}
          </div>
          <End n="01" bg={primary} />
        </aside>

        <main style={{ display: "flex", flexDirection: "column", borderLeft: `1px solid ${mix(primary, "#ffffff", 0.8)}`, borderRight: `1px solid ${mix(primary, "#ffffff", 0.8)}` }}>
          <Cap n="02" label="Experience" bg={dark} fg="#fff" />
          <div style={{ ...col, padding: "34px 26px 24px" }}>
            {center.map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 40 }}>
                <Head k={k} color={dark} />
                {centerBody(k)}
              </section>
            ))}
          </div>
          <End n="02" bg={dark} />
        </main>

        <aside style={{ background: rightBg, display: "flex", flexDirection: "column" }}>
          <Cap n="03" label="Projects · Study" bg={accent} fg={mix(dark, primary, 0.3)} />
          <div style={col}>
            {right.map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 32 }}>
                <Head k={k} color={mix(accent, dark, 0.35)} />
                {rightBody(k)}
              </section>
            ))}
          </div>
          <End n="03" bg={accent} />
        </aside>
      </div>
    </div>
  );
}
