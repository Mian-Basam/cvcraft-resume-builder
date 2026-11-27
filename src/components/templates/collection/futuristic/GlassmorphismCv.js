// Glassmorphism CV: frosted translucent panels layered over soft palette-coloured gradient blobs, two columns, with a nested glass contact card in the header.
import { pageStyle, mix, lines, dateRange, contactItems, Photo } from "../../shared";
import { SECTION_META, fontOf, pick, photoOf, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

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
const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

export default function GlassmorphismCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const sora = fontStack("sora");
  const ink = mix(primary, "#0f1115", 0.62);
  const text = "#272b33";
  const muted = "#5b6270";
  const deep = mix(primary, "#000000", 0.1);
  const volt = electric(primary, accent);
  const grad = `linear-gradient(125deg, ${deep}, ${volt})`;
  const fs = 12;

  const glass = {
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.9)",
    borderRadius: 20,
    boxShadow: `0 10px 30px ${mix(primary, "#ffffff", 0.3)}22, inset 0 1px 0 rgba(255,255,255,0.95)`,
  };

  const blob = (style, color, a = "bb") => (
    <div style={{ position: "absolute", borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, ${color}${a} 0%, ${color}55 42%, ${color}00 70%)`, ...style }} />
  );

  const main = pick(data, MAIN_KEYS);
  const side = pick(data, SIDE_KEYS);

  const Heading = ({ k }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ width: 28, height: 28, borderRadius: 9, background: grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 8px ${primary}40` }}>
        <Icon name={SECTION_META[k].icon} size={15} color="#ffffff" strokeWidth={2.1} />
      </span>
      <span style={{ fontFamily: sora, fontSize: 14.5, fontWeight: 700, color: ink, letterSpacing: 0.2 }}>{SECTION_META[k].title}</span>
    </div>
  );

  const Panel = ({ k, children, style }) => (
    <section data-section={k} style={{ ...glass, padding: "20px 22px 20px", marginBottom: 20, breakInside: "avoid", ...style }}>
      <Heading k={k} />
      {children}
    </section>
  );

  const Entry = ({ t, s, d, b, extra, lastOne }) => (
    <div style={{ position: "relative", paddingLeft: 16, paddingBottom: lastOne ? 0 : 14, marginBottom: lastOne ? 0 : 14, borderBottom: lastOne ? "none" : "1px solid rgba(255,255,255,0.95)", breakInside: "avoid" }}>
      <span style={{ position: "absolute", left: 0, top: 5, width: 7, height: 7, borderRadius: "50%", background: grad, boxShadow: `0 0 0 3px ${mix(primary, "#ffffff", 0.82)}` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <div style={{ fontFamily: sora, fontSize: 14, fontWeight: 700, color: ink }}>{t}</div>
        {d && <span style={{ fontSize: 10.5, fontWeight: 600, color: ink, background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,1)", borderRadius: 999, padding: "2px 9px", whiteSpace: "nowrap" }}>{d}</span>}
      </div>
      {s && <div style={{ fontSize: fs, fontWeight: 600, color: mix(primary, "#000000", 0.05), marginTop: 2 }}>{s}</div>}
      {extra && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{extra}</div>}
      {b.length > 0 && (
        <ul style={{ margin: "6px 0 0", paddingLeft: 16, listStyle: "disc", fontSize: fs, lineHeight: 1.6, color: text }}>
          {b.map((x, n) => (
            <li key={n} style={{ marginBottom: 2 }}>{x}</li>
          ))}
        </ul>
      )}
    </div>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, j) => <Entry key={e.id} lastOne={j === data.experience.length - 1} t={e.role} s={[e.company, e.location].filter(Boolean).join(" · ")} d={dateRange(e.start, e.end)} b={lines(e.bullets)} />);
    if (k === "education")
      return data.education.map((e, j) => <Entry key={e.id} lastOne={j === data.education.length - 1} t={e.degree} s={e.school} extra={e.grade} d={dateRange(e.start, e.end)} b={[]} />);
    return data.projects.map((e, j) => <Entry key={e.id} lastOne={j === data.projects.length - 1} t={e.name} s={e.link} d="" b={lines(e.description)} />);
  };

  const sideBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ marginBottom: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: fs, color: text, marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{s.name}</span>
            <span style={{ fontSize: 10.5, color: muted }}>{s.level ?? 0}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.85)", boxShadow: `inset 0 1px 2px ${primary}22` }}>
            <div style={{ height: "100%", width: `${s.level ?? 0}%`, borderRadius: 99, background: grad }} />
          </div>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: fs, color: text, background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.95)", borderRadius: 12, padding: "7px 11px", marginBottom: 7 }}>
          <span style={{ fontWeight: 600 }}>{l.name}</span>
          <span style={{ fontSize: 10.5, color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((i) => (
          <span key={i.id} style={{ fontSize: 11, color: ink, fontWeight: 600, background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,1)", borderRadius: 999, padding: "4px 11px" }}>{i.name}</span>
        ))}
      </div>
    );
  };

  const contacts = contactItems(p);

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "manrope"),
        color: text,
        background: `linear-gradient(155deg, ${mix(primary, "#ffffff", 0.9)} 0%, ${mix(accent, "#ffffff", 0.86)} 55%, ${mix(primary, "#ffffff", 0.88)} 100%)`,
        padding: "38px 32px 30px",
        boxSizing: "border-box",
      })}
    >
      {blob({ width: 460, height: 460, left: -150, top: -160 }, volt, "aa")}
      {blob({ width: 470, height: 470, right: -190, top: 170 }, accent, "dd")}
      {blob({ width: 380, height: 380, left: -120, top: 560 }, mix(accent, primary, 0.35), "99")}
      {blob({ width: 520, height: 520, right: -140, bottom: -200 }, mix(volt, "#ffffff", 0.2), "aa")}
      {blob({ width: 260, height: 260, left: 300, top: 360 }, mix(primary, accent, 0.6), "66")}

      <div style={{ position: "relative" }}>
        {/* header glass with a nested contact card */}
        <header style={{ ...glass, borderRadius: 26, padding: "28px 26px", display: "flex", alignItems: "center", gap: 24, marginBottom: 22 }}>
          <div style={{ padding: 4, borderRadius: "50%", background: "rgba(255,255,255,0.8)", boxShadow: `0 6px 18px ${primary}33`, flexShrink: 0 }}>
            <Photo src={photoOf(data, theme)} name={p.name} size={112} placeholderBg={grad} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: sora, fontSize: 38, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.2, color: ink }}>{p.name}</h1>
            {p.title && (
              <div style={{ display: "inline-block", marginTop: 10, background: grad, color: "#ffffff", fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", borderRadius: 999, padding: "5px 14px" }}>
                {p.title}
              </div>
            )}
          </div>
          {contacts.length > 0 && (
            <div data-section="contact" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,1)", borderRadius: 16, padding: "11px 14px 5px", boxShadow: `0 6px 16px ${primary}1a`, flexShrink: 0, maxWidth: 236 }}>
              {contacts.map((c) => (
                <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11, color: text, marginBottom: 6 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 7, background: mix(primary, "#ffffff", 0.85), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={c.icon} size={11} color={deep} />
                  </span>
                  <span style={{ wordBreak: "break-word" }}>{c.value}</span>
                </div>
              ))}
            </div>
          )}
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", columnGap: 18, alignItems: "start" }}>
          <aside>
            {side.map((k) => (
              <Panel key={k} k={k}>
                {sideBody(k)}
              </Panel>
            ))}
          </aside>
          <main>
            {main.map((k) => (
              <Panel key={k} k={k}>
                {mainBody(k)}
              </Panel>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
