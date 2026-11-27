// Neo-Futurist: single column on a white field with an electric highlight, a measured side rail and technical metadata (IDs, coordinates, revision codes) as decoration.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { SECTION_META, fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const KEYS = ["summary", "experience", "projects", "education", "skills", "languages", "certifications", "interests"];

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
// A saturated "electric" version of the palette's main hue (falls back to the accent hue for greys).
function electric(primary, accent) {
  let [h, s] = hslOf(primary);
  if (s < 0.12) [h, s] = hslOf(accent);
  if (s < 0.12) h = 214;
  const l = h > 40 && h < 190 ? 0.36 : 0.48;
  return hexOf(h, 0.92, l);
}
function hash(str = "") {
  let x = 2166136261;
  for (let i = 0; i < str.length; i++) x = Math.imul(x ^ str.charCodeAt(i), 16777619);
  return x >>> 0;
}

export default function NeoFuturist({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const grot = fontStack("spacegrotesk");
  const mono = fontStack("plexmono");
  const volt = electric(primary, accent);
  const ink = mix(primary, "#0d1117", 0.75);
  const muted = "#5d6470";
  const hair = "#dfe2e7";
  const fs = 11.5;

  const keys = pick(data, KEYS);
  const h = hash(p.name || "cv");
  const uid = `${(p.name || "X").split(/\s+/).map((w) => w[0]).join("").toUpperCase()}-${String(h % 9000 + 1000)}`;
  const lat = (h % 9000) / 100 - 45;
  const lon = ((h >> 8) % 36000) / 100 - 180;
  const coord = `${Math.abs(lat).toFixed(4)}° ${lat < 0 ? "S" : "N"} / ${Math.abs(lon).toFixed(4)}° ${lon < 0 ? "W" : "E"}`;
  const hex = (i) => `0x${(i + 1).toString(16).toUpperCase().padStart(2, "0")}`;
  const nameParts = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const first = nameParts.slice(0, -1).join(" ") || nameParts[0] || "";
  const last = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const count = (k) => (k === "summary" ? `${(p.summary || "").split(/\s+/).filter(Boolean).length} WORDS` : `N=${String((data[k] || []).length).padStart(2, "0")}`);

  const Row = ({ k, i, children }) => (
    <section data-section={k} style={{ display: "grid", gridTemplateColumns: "142px 1fr", columnGap: 22, padding: "14px 0 12px", borderTop: `1px solid ${hair}`, position: "relative", breakInside: "avoid" }}>
      <span style={{ position: "absolute", top: -3, left: 0, width: 5, height: 5, background: volt }} />
      <div>
        <div style={{ fontFamily: mono, fontSize: 9.5, color: "#9aa0a9", letterSpacing: 0.6 }}>
          <span style={{ color: volt }}>{hex(i)}</span> · {count(k)}
        </div>
        <div style={{ fontFamily: grot, fontSize: 13, fontWeight: 700, letterSpacing: 2.2, textTransform: "uppercase", color: ink, marginTop: 3 }}>{SECTION_META[k].title}</div>
      </div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </section>
  );

  const Entry = ({ t, s, d, b, last: isLast }) => (
    <div style={{ marginBottom: isLast ? 0 : 13, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontFamily: grot, fontSize: 14.5, fontWeight: 700, color: ink, letterSpacing: -0.2 }}>{t}</div>
        {d && <span style={{ fontFamily: mono, fontSize: 10, color: ink, whiteSpace: "nowrap", borderLeft: `2px solid ${volt}`, paddingLeft: 7 }}>{d}</span>}
      </div>
      {s && <div style={{ fontSize: fs, color: volt, fontWeight: 600, marginTop: 2 }}>{s}</div>}
      {b.map((x, n) => (
        <div key={n} style={{ display: "flex", gap: 9, fontSize: fs, lineHeight: 1.55, color: "#2b3038", marginTop: n ? 1 : 5 }}>
          <span style={{ fontFamily: mono, color: volt, flexShrink: 0 }}>/</span>
          <span>{x}</span>
        </div>
      ))}
    </div>
  );

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "#262b33", fontWeight: 400 }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, j) => <Entry key={e.id} last={j === data.experience.length - 1} t={e.role} s={[e.company, e.location].filter(Boolean).join(" · ")} d={dateRange(e.start, e.end)} b={lines(e.bullets)} />);
    if (k === "education")
      return data.education.map((e, j) => <Entry key={e.id} last={j === data.education.length - 1} t={e.degree} s={[e.school, e.grade].filter(Boolean).join(" · ")} d={dateRange(e.start, e.end)} b={[]} />);
    if (k === "projects")
      return data.projects.map((e, j) => <Entry key={e.id} last={j === data.projects.length - 1} t={e.name} s={e.link} d="" b={lines(e.description)} />);
    if (k === "skills")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 26, rowGap: 9 }}>
          {data.skills.map((s) => (
            <div key={s.id}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: fs, color: ink, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span style={{ fontFamily: mono, fontSize: 10, color: muted }}>{String(s.level ?? 0).padStart(3, "0")}</span>
              </div>
              <div style={{ position: "relative", height: 2, background: hair }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${s.level ?? 0}%`, background: volt }} />
                <span style={{ position: "absolute", top: -3, left: `calc(${s.level ?? 0}% - 4px)`, width: 6, height: 6, border: `1.5px solid ${volt}`, background: "#fff", transform: "rotate(45deg)" }} />
              </div>
            </div>
          ))}
        </div>
      );
    if (k === "languages")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 26px" }}>
          {data.languages.map((l) => (
            <div key={l.id} style={{ fontSize: fs, color: ink }}>
              <span style={{ fontWeight: 600 }}>{l.name}</span>
              <span style={{ fontFamily: mono, fontSize: 10, color: muted, marginLeft: 8, textTransform: "uppercase" }}>[{levelWord(l.level)}]</span>
            </div>
          ))}
        </div>
      );
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, fontSize: fs, color: ink, marginBottom: 4 }}>
          <span>
            <span style={{ fontWeight: 600 }}>{c.name}</span>
            {c.issuer && <span style={{ color: muted }}> · {c.issuer}</span>}
          </span>
          {c.year && <span style={{ fontFamily: mono, fontSize: 10, borderLeft: `2px solid ${volt}`, paddingLeft: 7 }}>{c.year}</span>}
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {data.interests.map((x, j) => (
          <span key={x.id} style={{ fontSize: fs, color: ink, border: `1px solid ${hair}`, padding: "3px 10px 3px 8px", display: "flex", gap: 7, alignItems: "baseline" }}>
            <span style={{ fontFamily: mono, fontSize: 9.5, color: volt }}>{String(j + 1).padStart(2, "0")}</span>
            {x.name}
          </span>
        ))}
      </div>
    );
  };

  const contacts = contactItems(p);
  const LABEL = { phone: "TEL", mail: "MAIL", pin: "LOC", globe: "NET" };
  const ticks = Array.from({ length: 11 }, (_, i) => i * 100);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "spacegrotesk"), color: ink, background: "#ffffff", padding: "34px 52px 30px 78px", boxSizing: "border-box", display: "flex", flexDirection: "column" })}>
      {/* measured side rail */}
      <div style={{ position: "absolute", left: 34, top: 34, bottom: 30, width: 1, background: hair }} />
      {ticks.map((t) => (
        <div key={t} style={{ position: "absolute", left: 30, top: 34 + t, display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ width: 9, height: 1, background: t === 0 ? volt : "#b9bec6" }} />
        </div>
      ))}
      {ticks.slice(1).map((t) => (
        <span key={`l${t}`} style={{ position: "absolute", left: 10, top: 34 + t - 22, fontFamily: mono, fontSize: 8, color: "#a6acb5", transform: "rotate(-90deg)", transformOrigin: "left top", whiteSpace: "nowrap" }}>
          Y{String(t).padStart(4, "0")}
        </span>
      ))}
      <div style={{ position: "absolute", left: 34, top: 34, width: 1, height: 160, background: volt }} />
      <div style={{ position: "absolute", right: 18, top: 330, writingMode: "vertical-rl", fontFamily: mono, fontSize: 8.5, letterSpacing: 2.5, color: "#a6acb5", whiteSpace: "nowrap" }}>
        SYS.CV // {uid} // {coord}
      </div>

      {/* metadata bar */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9.5, letterSpacing: 1.2, color: muted, textTransform: "uppercase" }}>
        <span>
          <span style={{ color: volt }}>●</span> ID {uid}
        </span>
        <span>{coord}</span>
        <span>REV.04 / STATUS: ACTIVE</span>
      </div>

      <header style={{ marginTop: 30 }}>
        <h1 style={{ margin: 0, fontFamily: grot, fontSize: 64, fontWeight: 300, lineHeight: 0.95, letterSpacing: -2.6, color: ink }}>
          {first} {last && <span style={{ fontWeight: 700, color: volt }}>{last}</span>}
        </h1>
        {p.title && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, fontFamily: grot, fontSize: 13, fontWeight: 600, letterSpacing: 4.5, textTransform: "uppercase", color: ink }}>
            <span style={{ width: 28, height: 2, background: volt }} />
            {p.title}
          </div>
        )}
        {/* ruler */}
        <div style={{ position: "relative", height: 12, marginTop: 20, backgroundImage: `repeating-linear-gradient(90deg, #c3c8cf 0 1px, transparent 1px 8px)`, backgroundSize: "100% 5px", backgroundRepeat: "no-repeat", backgroundPosition: "bottom", borderBottom: `1px solid #c3c8cf` }}>
          <span style={{ position: "absolute", left: 0, bottom: -1, width: "34%", height: 3, background: volt }} />
          <span style={{ position: "absolute", right: 0, top: -12, fontFamily: mono, fontSize: 8.5, color: "#a6acb5", letterSpacing: 1 }}>X 000 — 664</span>
        </div>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ display: "grid", gridTemplateColumns: `repeat(${contacts.length}, auto)`, justifyContent: "space-between", columnGap: 16, marginTop: 12 }}>
            {contacts.map((c, j) => (
              <div key={c.icon} style={{ minWidth: 0 }}>
                <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.2, color: "#9aa0a9" }}>
                  CH.{String(j + 1).padStart(2, "0")} <span style={{ color: volt }}>{LABEL[c.icon]}</span>
                </div>
                <div style={{ fontSize: 11.5, color: ink, marginTop: 2, wordBreak: "break-word" }}>{c.value}</div>
              </div>
            ))}
          </div>
        )}
      </header>

      <main style={{ marginTop: 26 }}>
        {keys.map((k, i) => (
          <Row key={k} k={k} i={i}>
            {body(k)}
          </Row>
        ))}
      </main>

      <div style={{ flex: 1, minHeight: 14 }} />
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${hair}`, paddingTop: 8, fontFamily: mono, fontSize: 8.5, letterSpacing: 1.5, color: "#a6acb5", textTransform: "uppercase" }}>
        <span>{uid} · end of transmission</span>
        <span style={{ display: "flex", gap: 3 }}>
          {[1, 0.6, 0.35, 0.18].map((o, j) => (
            <span key={j} style={{ width: 14, height: 4, background: volt, opacity: o }} />
          ))}
        </span>
      </footer>
    </div>
  );
}
