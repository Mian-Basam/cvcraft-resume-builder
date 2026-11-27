// Blueprint Professional: single column on a blueprint sheet with a white engineering grid, zoned drawing frame, detail callouts, dimension lines and a title block.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { SECTION_META, fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const NOTE_KEYS = ["languages", "certifications", "interests"];
const KEYS = ["summary", "experience", "education", "projects", "skills", "languages", "certifications", "interests"];

function hslOf(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function hexOf(h, s, l) {
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
// Blueprint paper in the palette's hue (greys fall back to the accent hue, then classic blue).
function paper(primary, accent) {
  let [h, s] = hslOf(primary);
  if (s < 0.12) [h, s] = hslOf(accent);
  if (s < 0.12) h = 214;
  return hexOf(h, 0.62, 0.3);
}

const W = "#ffffff";

// Horizontal dimension line with extension ticks and a centred label.
function DimLine({ label, color, bg, mono }) {
  const arrow = (dir) => ({ width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", [dir === "l" ? "borderRight" : "borderLeft"]: `8px solid ${color}` });
  return (
    <div style={{ position: "relative", height: 18, display: "flex", alignItems: "center" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: color }} />
      <span style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 1, background: color }} />
      <span style={arrow("l")} />
      <span style={{ flex: 1, height: 1, background: color }} />
      {label && <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1.5, color, background: bg, padding: "0 10px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>}
      {label && <span style={{ flex: 1, height: 1, background: color }} />}
      <span style={arrow("r")} />
    </div>
  );
}

export default function BlueprintProfessional({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const grot = fontStack("spacegrotesk");
  const mono = fontStack("plexmono");
  const bg = paper(primary, accent);
  const hi = mix(accent, W, 0.25);
  const soft = "rgba(255,255,255,0.78)";
  const faint = "rgba(255,255,255,0.45)";
  const line = "rgba(255,255,255,0.7)";
  const fs = 11.5;

  const keys = pick(data, KEYS);
  const letter = (k) => String.fromCharCode(65 + keys.indexOf(k));
  const notes = keys.filter((k) => NOTE_KEYS.includes(k));

  const Callout = ({ k, compact }) => compact ? (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${W}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 10, fontWeight: 700, color: W, flexShrink: 0 }}>{letter(k)}</span>
      <span style={{ fontFamily: grot, fontSize: 12.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: W }}>{SECTION_META[k].title}</span>
    </div>
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ width: 26, height: 26, borderRadius: "50%", border: `1.5px solid ${W}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 12, fontWeight: 700, color: W, flexShrink: 0, position: "relative" }}>
        {letter(k)}
        <span style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: W, opacity: 0.6 }} />
      </span>
      <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1.6, color: hi }}>DETAIL {letter(k)}</span>
      <span style={{ fontFamily: grot, fontSize: 14, fontWeight: 700, letterSpacing: 2.4, textTransform: "uppercase", color: W }}>{SECTION_META[k].title}</span>
      <span style={{ flex: 1, height: 0, borderTop: `1px dashed ${faint}` }} />
      <span style={{ fontFamily: mono, fontSize: 9, color: faint, letterSpacing: 1 }}>SEC {letter(k)}-{letter(k)}</span>
    </div>
  );

  // Vertical dimension between start and end year.
  const Span = ({ start, end }) => {
    const tri = (up) => ({ width: 0, height: 0, borderLeft: "3.5px solid transparent", borderRight: "3.5px solid transparent", [up ? "borderBottom" : "borderTop"]: `7px solid ${line}` });
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", minHeight: 48, fontFamily: mono, fontSize: 10, color: W, textAlign: "center" }}>
        <span style={{ whiteSpace: "nowrap" }}>{start || "—"}</span>
        <span style={{ width: 14, height: 1, background: line, marginTop: 3 }} />
        <span style={tri(true)} />
        <span style={{ flex: 1, width: 1, background: line, minHeight: 6 }} />
        <span style={tri(false)} />
        <span style={{ width: 14, height: 1, background: line, marginBottom: 3 }} />
        <span style={{ whiteSpace: "nowrap", color: end && /present|now|current/i.test(end) ? hi : W }}>{end || "—"}</span>
      </div>
    );
  };

  const Entry = ({ t, s, start, end, b, tag }) => (
    <div style={{ display: "grid", gridTemplateColumns: start || end ? "62px 1fr" : "1fr", columnGap: 16, marginBottom: 10, marginLeft: start || end ? 0 : 78, breakInside: "avoid" }}>
      {(start || end) && <Span start={start} end={end} />}
      <div style={{ border: `1px solid ${faint}`, padding: "9px 12px 9px", position: "relative", minWidth: 0 }}>
        {tag && <span style={{ position: "absolute", top: -7, right: 10, background: bg, padding: "0 6px", fontFamily: mono, fontSize: 9, color: hi, letterSpacing: 1 }}>{tag}</span>}
        <div style={{ fontFamily: grot, fontSize: 14, fontWeight: 700, color: W }}>{t}</div>
        {s && <div style={{ fontFamily: mono, fontSize: 10.5, color: hi, marginTop: 2, wordBreak: "break-word" }}>{s}</div>}
        {b.map((x, n) => (
          <div key={n} style={{ display: "flex", gap: 8, fontSize: fs, lineHeight: 1.5, color: soft, marginTop: n ? 2 : 5 }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: W, flexShrink: 0, paddingTop: 1 }}>{String(n + 1).padStart(2, "0")}</span>
            <span>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const cellTh = { fontFamily: mono, fontSize: 9, letterSpacing: 1.4, color: faint, padding: "4px 8px", borderBottom: `1px solid ${faint}`, textAlign: "left", fontWeight: 400 };
  const cellTd = { fontSize: fs, color: W, padding: "4px 8px", borderBottom: `1px solid rgba(255,255,255,0.18)` };

  const body = (k) => {
    if (k === "summary")
      return (
        <p style={{ margin: "0 0 0 36px", fontSize: 12.5, lineHeight: 1.6, color: soft, borderLeft: `2px solid ${hi}`, paddingLeft: 14 }}>{p.summary}</p>
      );
    if (k === "experience")
      return data.experience.map((e, j) => <Entry key={e.id} t={e.role} s={[e.company, e.location].filter(Boolean).join(" · ")} start={e.start} end={e.end} b={lines(e.bullets)} tag={`ITEM ${String(j + 1).padStart(2, "0")}`} />);
    if (k === "education")
      return data.education.map((e) => <Entry key={e.id} t={e.degree} s={[e.school, e.grade].filter(Boolean).join(" · ")} start={e.start} end={e.end} b={[]} />);
    if (k === "projects")
      return data.projects.map((e, j) => <Entry key={e.id} t={e.name} s={e.link} b={lines(e.description)} tag={`PRJ ${String(j + 1).padStart(2, "0")}`} />);
    if (k === "skills") {
      const half = Math.ceil(data.skills.length / 2);
      const cols = [data.skills.slice(0, half), data.skills.slice(half)].filter((c) => c.length);
      return (
        <div style={{ display: "grid", gridTemplateColumns: cols.map(() => "1fr").join(" "), columnGap: 22, marginLeft: 36, alignItems: "start" }}>
          {cols.map((col, c) => (
            <table key={c} style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ ...cellTh, width: 40 }}>NO.</th>
                  <th style={cellTh}>SPECIFICATION</th>
                  <th style={{ ...cellTh, textAlign: "right" }}>RATING</th>
                </tr>
              </thead>
              <tbody>
                {col.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ ...cellTd, fontFamily: mono, fontSize: 10, color: hi }}>S-{String(c * half + i + 1).padStart(2, "0")}</td>
                    <td style={cellTd}>{s.name}</td>
                    <td style={{ ...cellTd, textAlign: "right", fontFamily: mono, fontSize: 10.5 }}>{s.level ?? 0}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      );
    }
    return null;
  };

  const noteBody = (k) => {
    const row = (key, i, main, sub) => (
      <div key={key} style={{ display: "flex", gap: 8, fontSize: fs, color: W, lineHeight: 1.4, marginBottom: 4 }}>
        <span style={{ fontFamily: mono, fontSize: 10, color: hi, paddingTop: 1 }}>{String(i + 1).padStart(2, "0")}.</span>
        <span>
          {main}
          {sub && <span style={{ display: "block", fontFamily: mono, fontSize: 9.5, color: soft, letterSpacing: 0.5 }}>{sub}</span>}
        </span>
      </div>
    );
    if (k === "languages") return data.languages.map((l, i) => row(l.id, i, l.name, levelWord(l.level).toUpperCase()));
    if (k === "certifications") return data.certifications.map((c, i) => row(c.id, i, c.name, [c.issuer, c.year].filter(Boolean).join(" · ").toUpperCase()));
    return data.interests.map((x, i) => row(x.id, i, x.name));
  };

  const contacts = contactItems(p);
  const LABEL = { phone: "TEL", mail: "E-MAIL", pin: "LOCATION", globe: "WEB" };
  const zonesX = ["1", "2", "3", "4", "5", "6"];
  const zonesY = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const tb = { borderRight: `1px solid ${line}`, borderBottom: `1px solid ${line}`, padding: "4px 8px" };
  const tbL = { fontFamily: mono, fontSize: 8.5, letterSpacing: 1.2, color: faint, display: "block" };
  const tbV = { fontFamily: grot, fontSize: 11.5, fontWeight: 700, color: W, display: "block", lineHeight: 1.25 };

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "spacegrotesk"),
        color: W,
        backgroundColor: bg,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: "80px 80px, 80px 80px, 16px 16px, 16px 16px",
        backgroundPosition: "-1px -1px",
        padding: "46px 50px 40px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      })}
    >
      {/* drawing frame with zone markers */}
      <div style={{ position: "absolute", inset: 16, border: `1px solid ${line}`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 26, border: `2px solid ${W}`, pointerEvents: "none" }} />
      {zonesX.map((z, i) => (
        <span key={z} style={{ position: "absolute", top: 16, left: 26 + ((794 - 52) / 6) * (i + 0.5) - 4, height: 10, fontFamily: mono, fontSize: 8, color: soft, lineHeight: "10px" }}>{z}</span>
      ))}
      {zonesY.map((z, i) => (
        <span key={z} style={{ position: "absolute", left: 18, top: 26 + ((1123 - 52) / 8) * (i + 0.5) - 5, fontFamily: mono, fontSize: 8, color: soft }}>{z}</span>
      ))}

      <header style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9.5, letterSpacing: 1.6, color: soft }}>
          <span>GENERAL ARRANGEMENT — PROFESSIONAL PROFILE</span>
          <span>DWG CV-001 · REV A</span>
        </div>
        <h1 style={{ margin: "14px 0 6px", fontFamily: grot, fontSize: 42, fontWeight: 700, letterSpacing: 0.5, lineHeight: 1, color: W, textTransform: "uppercase" }}>{p.name}</h1>
        {p.title ? <DimLine label={p.title} color={hi} bg={bg} mono={mono} /> : <DimLine color={hi} bg={bg} mono={mono} />}
        {contacts.length > 0 && (
          <div data-section="contact" style={{ display: "grid", gridTemplateColumns: `repeat(${contacts.length}, 1fr)`, border: `1px solid ${line}`, marginTop: 12, background: "rgba(0,0,0,0.08)" }}>
            {contacts.map((c, i) => (
              <div key={c.icon} style={{ padding: "5px 9px", borderLeft: i ? `1px solid ${line}` : "none", minWidth: 0 }}>
                <div style={{ fontFamily: mono, fontSize: 8.5, letterSpacing: 1.4, color: hi }}>{LABEL[c.icon]}</div>
                <div style={{ fontSize: 11, color: W, marginTop: 1, wordBreak: "break-word" }}>{c.value}</div>
              </div>
            ))}
          </div>
        )}
      </header>

      <main style={{ marginTop: 18 }}>
        {keys.filter((k) => !NOTE_KEYS.includes(k)).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 8 }}>
            <Callout k={k} />
            {body(k)}
          </section>
        ))}
        {notes.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${notes.length}, 1fr)`, columnGap: 18, marginTop: 2 }}>
            {notes.map((k, i) => (
              <section key={k} data-section={k} style={{ border: `1px solid ${faint}`, padding: "8px 12px 10px", background: "rgba(0,0,0,0.06)" }}>
                <Callout k={k} compact />
                {noteBody(k)}
              </section>
            ))}
          </div>
        )}
      </main>

      <div style={{ flex: 1, minHeight: 10 }} />
      {/* title block */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.2, color: faint, lineHeight: 1.6 }}>
          <div>NOTES: DIMENSIONS IN YEARS.</div>
          <div>DO NOT SCALE DRAWING.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 52px 52px 46px", borderTop: `1px solid ${line}`, borderLeft: `1px solid ${line}`, background: "rgba(0,0,0,0.1)", flexShrink: 0 }}>
          <div style={tb}>
            <span style={tbL}>TITLE</span>
            <span style={{ ...tbV, whiteSpace: "nowrap" }}>{p.name}{p.title ? ` — ${p.title}` : ""}</span>
          </div>
          <div style={tb}>
            <span style={tbL}>DRAWN</span>
            <span style={tbV}>{(p.name || "").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").toUpperCase()}</span>
          </div>
          <div style={tb}>
            <span style={tbL}>SCALE</span>
            <span style={tbV}>1:1</span>
          </div>
          <div style={tb}>
            <span style={tbL}>SHEET</span>
            <span style={tbV}>1/1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
