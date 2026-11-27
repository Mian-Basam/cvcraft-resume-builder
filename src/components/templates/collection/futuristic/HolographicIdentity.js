// Holographic Identity: pearl page with a holographic ID card (photo, chip, barcode) leading a two-column layout; iridescent multi-stop accents built from the palette, dark type.
import { pageStyle, mix, lines, dateRange, contactItems, Photo } from "../../shared";
import { SECTION_META, fontOf, pick, photoOf, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "experience", "education", "projects", "certifications"];
const SIDE_KEYS = ["skills", "languages", "interests"];

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
  h = ((h % 360) + 360) % 360;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function hash(str = "") {
  let x = 2166136261;
  for (let i = 0; i < str.length; i++) x = Math.imul(x ^ str.charCodeAt(i), 16777619);
  return x >>> 0;
}

export default function HolographicIdentity({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const grot = fontStack("spacegrotesk");
  const mono = fontStack("plexmono");
  const ink = "#121318";
  const text = "#2a2c33";
  const muted = "#666a75";

  // Iridescent stops: the palette's hue swept either side, plus the accent.
  let [h, s] = hslOf(primary);
  if (s < 0.12) [h, s] = hslOf(accent);
  if (s < 0.12) h = 220;
  const i1 = hexOf(h, 0.75, 0.8);
  const i2 = hexOf(h + 55, 0.7, 0.82);
  const i3 = mix(accent, "#ffffff", 0.25);
  const i4 = hexOf(h - 60, 0.7, 0.83);
  const i5 = hexOf(h + 150, 0.6, 0.85);
  const holo = `linear-gradient(118deg, ${i1} 0%, ${i2} 22%, ${i3} 44%, ${i4} 64%, ${i5} 82%, ${i1} 100%)`;
  const holoLine = `linear-gradient(90deg, ${hexOf(h, 0.7, 0.6)}, ${hexOf(h + 55, 0.65, 0.62)}, ${mix(accent, primary, 0.2)}, ${hexOf(h - 60, 0.65, 0.62)})`;
  const deep = mix(primary, "#000000", 0.15);
  const sheen = "repeating-linear-gradient(118deg, rgba(255,255,255,0) 0 18px, rgba(255,255,255,0.28) 18px 22px, rgba(255,255,255,0) 22px 46px)";
  const fs = 12;
  const holoV = holoLine.replace("90deg", "180deg");

  const main = pick(data, MAIN_KEYS);
  const side = pick(data, SIDE_KEYS);
  const idNo = String(hash(p.name || "id")).padStart(10, "0").slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  const bars = String(hash((p.name || "") + (p.title || ""))).padStart(10, "7").split("").concat(idNo.replace(/\D/g, "").split(""));

  const Heading = ({ k }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ fontFamily: grot, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: ink }}>{SECTION_META[k].title}</span>
      <span style={{ flex: 1, height: 3, borderRadius: 3, background: holoLine, opacity: 0.85 }} />
    </div>
  );

  const Entry = ({ t, s: sub, d, b, lastOne }) => (
    <div style={{ display: "grid", gridTemplateColumns: "3px 1fr", columnGap: 14, marginBottom: lastOne ? 0 : 18, breakInside: "avoid" }}>
      <span style={{ background: holoV, borderRadius: 3 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
          <div style={{ fontFamily: grot, fontSize: 14.5, fontWeight: 700, color: ink, letterSpacing: -0.2 }}>{t}</div>
          {d && <span style={{ fontFamily: mono, fontSize: 10, color: muted, whiteSpace: "nowrap" }}>{d}</span>}
        </div>
        {sub && <div style={{ fontSize: fs, fontWeight: 600, color: deep, marginTop: 2 }}>{sub}</div>}
        {b.map((x, n) => (
          <div key={n} style={{ display: "flex", gap: 8, fontSize: fs, lineHeight: 1.55, color: text, marginTop: n ? 2 : 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: holoLine, flexShrink: 0, marginTop: 6.5 }} />
            <span>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, j) => <Entry key={e.id} lastOne={j === data.experience.length - 1} t={e.role} s={[e.company, e.location].filter(Boolean).join(" · ")} d={dateRange(e.start, e.end)} b={lines(e.bullets)} />);
    if (k === "education")
      return data.education.map((e, j) => <Entry key={e.id} lastOne={j === data.education.length - 1} t={e.degree} s={[e.school, e.grade].filter(Boolean).join(" · ")} d={dateRange(e.start, e.end)} b={[]} />);
    if (k === "projects")
      return data.projects.map((e, j) => <Entry key={e.id} lastOne={j === data.projects.length - 1} t={e.name} s={e.link} d="" b={lines(e.description)} />);
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {data.certifications.map((c) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, border: "1.5px solid transparent", borderRadius: 12, background: `linear-gradient(#fff, #fff) padding-box, ${holo} border-box`, padding: "7px 12px 7px 8px" }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: holo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="star" size={13} color={ink} strokeWidth={1.8} />
            </span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ink }}>{c.name}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const sideBody = (k) => {
    if (k === "skills")
      return data.skills.map((sk) => (
        <div key={sk.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: fs, color: text, marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{sk.name}</span>
            <span style={{ fontFamily: mono, fontSize: 10, color: muted }}>{sk.level ?? 0}</span>
          </div>
          <div style={{ height: 5, borderRadius: 5, background: "#eceef3" }}>
            <div style={{ height: "100%", width: `${sk.level ?? 0}%`, borderRadius: 5, background: holoLine }} />
          </div>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: fs, color: text, padding: "6px 0", borderBottom: "1px solid #eceef3" }}>
          <span style={{ fontWeight: 600 }}>{l.name}</span>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((x) => (
          <span key={x.id} style={{ fontSize: 11, fontWeight: 600, color: ink, borderRadius: 999, padding: "4px 11px", background: `linear-gradient(#fff, #fff) padding-box, ${holo} border-box`, border: "1.5px solid transparent" }}>{x.name}</span>
        ))}
      </div>
    );
  };

  const contacts = contactItems(p);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "sora"),
        color: text,
        background: `radial-gradient(circle at 100% 0%, ${i2}66 0, ${i1}33 180px, rgba(255,255,255,0) 360px), radial-gradient(circle at 0% 100%, ${i4}55 0, rgba(255,255,255,0) 320px), #fbfbfd`,
        padding: "44px 40px 30px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", columnGap: 34 }}>
        <aside>
          {/* holographic ID card */}
          <div style={{ position: "relative", borderRadius: 20, background: holo, padding: "20px 20px 18px", overflow: "hidden", boxShadow: `0 14px 30px ${mix(primary, "#ffffff", 0.4)}55, inset 0 0 0 1px rgba(255,255,255,0.6)` }}>
            <div style={{ position: "absolute", inset: 0, background: sheen, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: mono, fontSize: 9, letterSpacing: 1.8, color: ink }}>
                <span>IDENTITY · CV</span>
                <span style={{ width: 30, height: 22, borderRadius: 5, background: `linear-gradient(135deg, ${mix(accent, "#ffffff", 0.35)}, ${mix(accent, "#000000", 0.1)})`, border: `1px solid ${mix(accent, "#000000", 0.3)}`, position: "relative" }}>
                  <span style={{ position: "absolute", left: 9, top: 0, bottom: 0, width: 1, background: mix(accent, "#000000", 0.35) }} />
                  <span style={{ position: "absolute", right: 9, top: 0, bottom: 0, width: 1, background: mix(accent, "#000000", 0.35) }} />
                  <span style={{ position: "absolute", left: 0, right: 0, top: 10, height: 1, background: mix(accent, "#000000", 0.35) }} />
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 14 }}>
                <Photo src={photoOf(data, theme)} name={p.name} size={108} placeholderBg={deep} style={{ borderRadius: 18, border: "3px solid rgba(255,255,255,0.85)" }} />
                <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1, color: ink, lineHeight: 1.5, paddingBottom: 2 }}>
                  <div style={{ opacity: 0.7 }}>ID NO.</div>
                  <div style={{ fontWeight: 700 }}>{idNo}</div>
                </div>
              </div>
              <div style={{ fontFamily: grot, fontSize: 19, fontWeight: 700, color: ink, marginTop: 12, lineHeight: 1.1, letterSpacing: -0.3 }}>{p.name}</div>
              {p.title && <div style={{ fontSize: 11, fontWeight: 600, color: ink, opacity: 0.8, marginTop: 3, textTransform: "uppercase", letterSpacing: 1.4 }}>{p.title}</div>}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 24, marginTop: 12 }}>
                {bars.map((b, j) => (
                  <span key={j} style={{ width: (Number(b) % 3) + 1, height: j % 7 === 0 ? 24 : 20, background: ink, marginRight: Number(b) % 2 ? 2 : 1 }} />
                ))}
              </div>
            </div>
          </div>

          {contacts.length > 0 && (
            <div data-section="contact" style={{ marginTop: 26 }}>
              {contacts.map((c) => (
                <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11.5, color: text, marginBottom: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: holo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={c.icon} size={12} color={ink} />
                  </span>
                  <span style={{ wordBreak: "break-word" }}>{c.value}</span>
                </div>
              ))}
            </div>
          )}

          {side.map((k) => (
            <section key={k} data-section={k} style={{ marginTop: 28 }}>
              <Heading k={k} />
              {sideBody(k)}
            </section>
          ))}
        </aside>

        <main>
          <header style={{ paddingTop: 8, marginBottom: 30 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 2.5, color: muted, textTransform: "uppercase" }}>Visual identity / Résumé</div>
            <h1 style={{ margin: "10px 0 0", fontFamily: grot, fontSize: 62, fontWeight: 700, lineHeight: 0.95, letterSpacing: -2.4, color: ink }}>
              {words.map((w, i) => (
                <div key={i}>{w}</div>
              ))}
            </h1>
            <div style={{ height: 6, width: 150, borderRadius: 6, background: holoLine, marginTop: 16 }} />
          </header>
          {main.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 28 }}>
              <Heading k={k} />
              {mainBody(k)}
            </section>
          ))}
        </main>
      </div>

      {/* security strip with microprint */}
      <div style={{ flex: 1, minHeight: 12 }} />
      <footer style={{ position: "relative", height: 30, borderRadius: 8, background: holo, overflow: "hidden", display: "flex", alignItems: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)" }}>
        <div style={{ position: "absolute", inset: 0, background: sheen }} />
        <div style={{ position: "relative", fontFamily: mono, fontSize: 8, letterSpacing: 1.6, color: ink, opacity: 0.55, whiteSpace: "nowrap", overflow: "hidden", flex: 1, paddingLeft: 12 }}>
          {Array.from({ length: 8 }, () => `${(p.name || "IDENTITY").toUpperCase()} · ${idNo} · `).join("")}
        </div>
        <span style={{ position: "relative", fontFamily: mono, fontSize: 9.5, fontWeight: 700, letterSpacing: 1.5, color: ink, background: "rgba(255,255,255,0.7)", padding: "4px 10px", borderRadius: 6, marginRight: 8, whiteSpace: "nowrap" }}>CURRICULUM VITAE</span>
      </footer>
    </div>
  );
}
