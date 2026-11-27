// Brutalist Architecture: board-formed concrete page, offset slab blocks with heavy black borders, section-cut hatching and a drawing title block.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { SECTION_META, fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

export default function BrutalistArchitecture({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const display = fontStack("bebas");
  const grot = fontStack("spacegrotesk");
  const mono = fontStack("plexmono");
  const ink = "#111111";
  const muted = "#4a4a48";
  const concrete = mix("#c9c7c2", primary, 0.06);
  const slab = mix("#efeeea", primary, 0.02);
  const B = `3px solid ${ink}`;
  const hatch = `repeating-linear-gradient(45deg, ${ink} 0 1.4px, transparent 1.4px 7px)`;

  const words = (p.name || "").trim().toUpperCase().split(/\s+/).filter(Boolean);
  const longest = Math.max(1, ...words.map((w) => w.length));
  const nameSize = Math.min(124, Math.floor(430 / (longest * 0.43)));

  const main = pick(data, MAIN_KEYS);
  const side = pick(data, SIDE_KEYS);
  const code = (k) => {
    const i = main.indexOf(k);
    return i >= 0 ? `A-${String(i + 1).padStart(2, "0")}` : `B-${String(side.indexOf(k) + 1).padStart(2, "0")}`;
  };
  const year = new Date().getFullYear();

  const Block = ({ k, children, offset = 0, shadow }) => (
    <section
      data-section={k}
      style={{ position: "relative", border: B, background: slab, marginBottom: 20, marginLeft: offset, marginRight: -offset, boxShadow: shadow ? `9px 9px 0 ${shadow}` : "none", breakInside: "avoid" }}
    >
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: B, height: 24 }}>
        <span style={{ background: ink, color: "#fff", fontFamily: mono, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.6, padding: "0 10px", display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase" }}>
          <span style={{ color: accent }}>{code(k)}</span>
          {SECTION_META[k].title}
        </span>
        <span style={{ flex: 1, background: hatch, opacity: 0.35 }} />
      </div>
      <div style={{ padding: "11px 15px 10px" }}>{children}</div>
    </section>
  );

  const entries = (k) => {
    if (k === "experience")
      return data.experience.map((e) => ({ id: e.id, t: e.role, s: [e.company, e.location].filter(Boolean).join(" / "), d: dateRange(e.start, e.end), b: lines(e.bullets) }));
    if (k === "education")
      return data.education.map((e) => ({ id: e.id, t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" / "), d: dateRange(e.start, e.end), b: [] }));
    return data.projects.map((e) => ({ id: e.id, t: e.name, s: e.link, d: "", b: lines(e.description) }));
  };

  const Entries = ({ k }) =>
    entries(k).map((e, j) => (
      <div key={e.id} style={{ display: "grid", gridTemplateColumns: e.d ? "86px 1fr" : "1fr", borderTop: j ? `2px solid ${ink}` : "none", marginTop: j ? 9 : 0, paddingTop: j ? 9 : 0, breakInside: "avoid" }}>
        {e.d && (
          <div style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700, lineHeight: 1.35, color: ink, borderRight: `2px solid ${ink}`, paddingRight: 6, marginRight: 12 }}>
            {e.d.split(" – ").map((x, n) => (
              <div key={n} style={{ whiteSpace: "nowrap" }}>{n ? `→ ${x}` : x}</div>
            ))}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: grot, fontSize: 15, fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.2, color: ink }}>{e.t}</div>
          {e.s && <div style={{ fontFamily: mono, fontSize: 10.5, color: muted, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.4, wordBreak: "break-word" }}>{e.s}</div>}
          {e.b.map((b, n) => (
            <div key={n} style={{ display: "flex", gap: 9, fontSize: 11.5, lineHeight: 1.5, color: ink, marginTop: 5 }}>
              <span style={{ width: 6, height: 6, background: primary, border: `1px solid ${ink}`, flexShrink: 0, marginTop: 5 }} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    ));

  const sideBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ marginBottom: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11.5, color: ink, marginBottom: 3 }}>
            <span style={{ fontWeight: 600 }}>{s.name}</span>
            <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700 }}>{String(s.level ?? 0).padStart(3, "0")}</span>
          </div>
          <div style={{ height: 9, border: `2px solid ${ink}`, background: "#fff" }}>
            <div style={{ height: "100%", width: `${s.level ?? 0}%`, background: primary }} />
          </div>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l, j) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, fontSize: 11.5, color: ink, padding: "5px 0", borderTop: j ? `2px solid ${ink}` : "none" }}>
          <span style={{ fontWeight: 600 }}>{l.name}</span>
          <span style={{ fontFamily: mono, fontSize: 10.5, textTransform: "uppercase" }}>{levelWord(l.level)}</span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c, j) => (
        <div key={c.id} style={{ padding: "4px 0 5px", borderTop: j ? `2px solid ${ink}` : "none" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{c.name}</div>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: muted, marginTop: 2 }}>{[c.issuer, c.year].filter(Boolean).join(" / ")}</div>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((i) => (
          <span key={i.id} style={{ border: `2px solid ${ink}`, background: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 8px", color: ink }}>{i.name}</span>
        ))}
      </div>
    );
  };

  const contacts = contactItems(p);
  const LABEL = { phone: "TEL", mail: "MAIL", pin: "SITE", globe: "WEB" };
  const cell = { borderRight: B, padding: "6px 10px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 };
  const cellLabel = { fontFamily: mono, fontSize: 9.5, letterSpacing: 1.4, color: muted };
  const cellValue = { fontFamily: grot, fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.2 };

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "spacegrotesk"),
        color: ink,
        backgroundColor: concrete,
        backgroundImage: `radial-gradient(circle at 22px 22px, rgba(0,0,0,0.2) 0 2.6px, transparent 3.2px), repeating-linear-gradient(0deg, transparent 0 186px, rgba(0,0,0,0.07) 186px 187.5px), repeating-linear-gradient(90deg, transparent 0 263px, rgba(0,0,0,0.05) 263px 264.5px)`,
        backgroundSize: "132px 93.5px, auto, auto",
        padding: "28px 34px 26px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      })}
    >
      {/* drawing strip */}
      <div style={{ display: "flex", border: B, background: slab, fontFamily: mono, fontSize: 9.5, letterSpacing: 1.6, textTransform: "uppercase", color: ink }}>
        <span style={{ padding: "5px 10px", borderRight: B, background: ink, color: "#fff", fontWeight: 700 }}>Elevation / North</span>
        <span style={{ padding: "5px 10px", borderRight: B }}>Curriculum vitae</span>
        <span style={{ flex: 1, background: hatch, opacity: 0.25 }} />
        <span style={{ padding: "5px 10px", borderLeft: B }}>Scale 1:1</span>
      </div>

      {/* header: name slab with an offset title block */}
      <header style={{ display: "grid", gridTemplateColumns: "1fr 252px", alignItems: "start", marginTop: 14 }}>
        <div style={{ border: `4px solid ${ink}`, background: slab, boxShadow: `12px 12px 0 ${primary}`, padding: "18px 22px 12px", minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative" }}>
          <span style={{ position: "absolute", top: 10, left: 22, fontFamily: mono, fontSize: 9.5, letterSpacing: 1.6, color: muted }}>PLAN — LEVEL 00</span>
          <h1 style={{ fontFamily: display, fontWeight: 400, fontSize: nameSize, lineHeight: 0.84, letterSpacing: 1, margin: "14px 0 0", color: ink, paddingRight: 30 }}>
            {words.map((w, i) => (
              <div key={i}>{w}</div>
            ))}
          </h1>
        </div>
        {(p.title || contacts.length > 0) && (
        <div style={{ marginTop: 52, marginLeft: -26, position: "relative", zIndex: 1, border: `4px solid ${ink}`, background: ink, color: "#fff" }}>
          {p.title && (
            <div style={{ background: primary, borderBottom: `4px solid ${ink}`, padding: "12px 14px 11px", fontFamily: grot, fontSize: 19, fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.4, color: "#fff" }}>
              {p.title}
            </div>
          )}
          {contacts.length > 0 && (
            <div data-section="contact" style={{ padding: "8px 14px 9px" }}>
              {contacts.map((c) => (
                <div key={c.icon} style={{ display: "flex", gap: 10, fontSize: 11, lineHeight: 1.45, padding: "2px 0" }}>
                  <span style={{ fontFamily: mono, fontSize: 9.5, color: accent, width: 34, flexShrink: 0, paddingTop: 1 }}>{LABEL[c.icon]}</span>
                  <span style={{ wordBreak: "break-word" }}>{c.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </header>

      {/* asymmetric plan: narrow service core + wide floor plate */}
      <div style={{ display: "grid", gridTemplateColumns: "212px 1fr", columnGap: 28, marginTop: 26 }}>
        <aside>
          {side.map((k, i) => (
            <Block key={k} k={k} offset={i % 2 ? 14 : 0}>
              {sideBody(k)}
            </Block>
          ))}
        </aside>
        <main>
          {main.map((k, i) => (
            <Block key={k} k={k} offset={i % 2 ? -14 : 0} shadow={i === 0 ? mix(primary, concrete, 0.35) : undefined}>
              {k === "summary" ? (
                <p style={{ margin: 0, fontFamily: grot, fontSize: 14.5, lineHeight: 1.5, fontWeight: 500, letterSpacing: -0.15, color: ink }}>{p.summary}</p>
              ) : (
                <Entries k={k} />
              )}
            </Block>
          ))}
        </main>
      </div>

      {/* drawing title block */}
      <div style={{ flex: 1, minHeight: 14 }} />
      <footer style={{ display: "grid", gridTemplateColumns: "1.5fr 1.4fr 0.8fr 0.8fr 60px", border: `4px solid ${ink}`, background: slab }}>
        <div style={cell}>
          <span style={cellLabel}>DRAWN BY</span>
          <span style={cellValue}>{p.name}</span>
        </div>
        <div style={cell}>
          <span style={cellLabel}>DRAWING</span>
          <span style={cellValue}>{p.title || "Curriculum vitae"}</span>
        </div>
        <div style={cell}>
          <span style={cellLabel}>SHEET</span>
          <span style={cellValue}>01 / 01</span>
        </div>
        <div style={cell}>
          <span style={cellLabel}>REV</span>
          <span style={cellValue}>{year}</span>
        </div>
        <div style={{ background: hatch, opacity: 0.55 }} />
      </footer>
    </div>
  );
}
