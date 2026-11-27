// Cover letter designs. Each uses the same palettes, fonts and picture options as the resumes,
// so a letter can match its resume.
import Icon from "../Icon";
import { Photo, contactItems, mix, pageStyle } from "../shared";
import { fontOf, photoOf } from "../kit";
import { normalizeAvatar } from "../simpleAvatar";
import { getPalette, fontStack } from "@/lib/palettes";
import { todayLong } from "@/lib/sampleCover";

const paragraphs = (t = "") =>
  t
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean);

// Date, recipient, subject, greeting, paragraphs, closing and signature.
function LetterBody({ data, theme, accent, fs = 12.5 }) {
  const r = data.recipient || {};
  const p = data.personal || {};
  const recipientLines = [r.name, r.title, r.company, r.address].filter(Boolean);
  return (
    <div style={{ fontSize: fs, lineHeight: 1.65, color: "#2f2f2f" }}>
      <div style={{ color: "#666", marginBottom: 22 }}>{data.date || todayLong()}</div>
      {recipientLines.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          {recipientLines.map((l, i) => (
            <div key={i} style={{ fontWeight: i === 0 ? 700 : 400 }}>
              {l}
            </div>
          ))}
        </div>
      )}
      {data.subject && <div style={{ fontWeight: 700, color: accent, marginBottom: 18 }}>{data.subject}</div>}
      {data.greeting && <p style={{ margin: "0 0 14px" }}>{data.greeting}</p>}
      {paragraphs(data.body).map((t, i) => (
        <p key={i} style={{ margin: "0 0 14px", textAlign: "justify" }}>
          {t}
        </p>
      ))}
      <div style={{ marginTop: 26 }}>
        <div>{data.closing || "Sincerely,"}</div>
        <div style={{ fontFamily: fontStack("caveat"), fontSize: 30, color: accent, lineHeight: 1.2, marginTop: 6 }}>{p.name}</div>
        <div style={{ fontWeight: 700 }}>{p.name}</div>
        {p.title && <div style={{ color: "#666" }}>{p.title}</div>}
      </div>
    </div>
  );
}

function Contacts({ p, color, iconColor, gap = 16, column = false, size = 11.5 }) {
  return (
    <div style={{ display: "flex", flexDirection: column ? "column" : "row", flexWrap: "wrap", gap: column ? 9 : `6px ${gap}px`, fontSize: size, color }}>
      {contactItems(p).map((c) => (
        <span key={c.icon} style={{ display: "inline-flex", alignItems: "center", gap: 7, wordBreak: "break-word" }}>
          <Icon name={c.icon} size={13} color={iconColor || color} />
          {c.value}
        </span>
      ))}
    </div>
  );
}

function Banner({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "lato") })}>
      <header style={{ background: primary, color: "#fff", padding: "44px 60px 30px", display: "flex", alignItems: "center", gap: 26 }}>
        {theme.avatar !== "initials" && photoOf(data, theme) && (
          <Photo src={photoOf(data, theme)} name={p.name} size={104} placeholderBg={mix(primary, "#ffffff", 0.2)} style={{ border: `4px solid ${accent}` }} />
        )}
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: 0.5 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 15, color: accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>{p.title}</div>}
        </div>
      </header>
      <div style={{ background: light, padding: "12px 60px" }}>
        <Contacts p={p} color="#333" iconColor={primary} />
      </div>
      <div style={{ padding: "40px 60px 50px" }}>
        <LetterBody data={data} theme={theme} accent={primary} />
      </div>
    </div>
  );
}

function Sidebar({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), display: "flex" })}>
      <aside style={{ width: 250, flexShrink: 0, background: primary, color: "#fff", padding: "50px 28px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Photo src={photoOf(data, theme)} name={p.name} size={150} placeholderBg={mix(primary, "#ffffff", 0.2)} style={{ border: `5px solid ${accent}` }} />
        <h1 style={{ fontSize: 25, fontWeight: 700, margin: "22px 0 0", lineHeight: 1.2 }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 12.5, color: accent, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 8 }}>{p.title}</div>}
        <div style={{ width: 40, height: 3, background: accent, margin: "24px 0" }} />
        <div style={{ textAlign: "left", alignSelf: "stretch" }}>
          <Contacts p={p} color="#fff" iconColor={accent} column size={11} />
        </div>
      </aside>
      <main style={{ flex: 1, padding: "60px 50px" }}>
        <LetterBody data={data} theme={theme} accent={primary} fs={12} />
      </main>
    </div>
  );
}

function Classic({ data, theme }) {
  const { primary } = theme;
  const p = data.personal;
  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "merriweather"), padding: "56px 70px" })}>
      <header style={{ textAlign: "center", paddingBottom: 18, borderBottom: `2px solid ${primary}`, marginBottom: 34 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, color: primary }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginTop: 6 }}>{p.title}</div>}
        <div style={{ fontSize: 11, color: "#444", marginTop: 10 }}>{contactItems(p).map((c) => c.value).join("  ·  ")}</div>
      </header>
      <LetterBody data={data} theme={theme} accent={primary} fs={12} />
    </div>
  );
}

function Minimal({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), padding: "64px 72px" })}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 30, marginBottom: 44 }}>
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0, color: "#111", lineHeight: 1.05 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 15, color: primary, fontWeight: 600, marginTop: 8 }}>{p.title}</div>}
          <div style={{ width: 56, height: 5, background: accent, marginTop: 18, borderRadius: 3 }} />
        </div>
        <div style={{ flexShrink: 0, paddingTop: 6 }}>
          <Contacts p={p} color="#444" iconColor={primary} column size={11} />
        </div>
      </header>
      <LetterBody data={data} theme={theme} accent={primary} />
    </div>
  );
}

function Elegant({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const initials = (p.name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const rule = <div style={{ borderTop: `1px solid ${accent}`, borderBottom: `1px solid ${accent}`, height: 4 }} />;
  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "playfair"), padding: "50px 70px" })}>
      <header style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${accent}`, color: primary, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, letterSpacing: 2 }}>
          {initials}
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 400, letterSpacing: 4, textTransform: "uppercase", margin: 0, color: primary }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 13, fontStyle: "italic", color: "#666", marginTop: 6 }}>{p.title}</div>}
        <div style={{ margin: "18px 0 12px" }}>{rule}</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Contacts p={p} color="#444" iconColor={accent} size={11} />
        </div>
      </header>
      <LetterBody data={data} theme={theme} accent={primary} fs={12.5} />
    </div>
  );
}

function Modern({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "montserrat"), padding: "54px 60px 54px 84px" })}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 22, background: `linear-gradient(${primary}, ${accent})` }} />
      <header style={{ display: "flex", alignItems: "center", gap: 22, paddingBottom: 22, borderBottom: `2px solid ${light}`, marginBottom: 34 }}>
        {theme.avatar !== "initials" && photoOf(data, theme) && <Photo src={photoOf(data, theme)} name={p.name} size={86} placeholderBg={primary} style={{ border: `3px solid ${accent}` }} />}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: primary, textTransform: "uppercase", letterSpacing: 1 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 13, fontWeight: 600, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{p.title}</div>}
        </div>
        <div style={{ flexShrink: 0 }}>
          <Contacts p={p} color="#444" iconColor={primary} column size={10.5} />
        </div>
      </header>
      <LetterBody data={data} theme={theme} accent={primary} fs={12} />
    </div>
  );
}

export const letterLayouts = [
  { id: "banner", name: "Banner", component: Banner, defaultFont: "lato" },
  { id: "sidebar", name: "Sidebar", component: Sidebar, defaultFont: "poppins" },
  { id: "classic", name: "Classic", component: Classic, defaultFont: "merriweather" },
  { id: "minimal", name: "Minimal", component: Minimal, defaultFont: "inter" },
  { id: "elegant", name: "Elegant", component: Elegant, defaultFont: "playfair" },
  { id: "modern", name: "Modern", component: Modern, defaultFont: "montserrat" },
];

export function getLetterLayout(id) {
  return letterLayouts.find((l) => l.id === id) || letterLayouts[0];
}

export function buildLetterTheme(settings) {
  const layout = getLetterLayout(settings.letterLayout);
  const avatar = normalizeAvatar(settings.avatar || "photo", settings.look);
  return { ...getPalette(settings.paletteId), font: settings.font || layout.defaultFont, avatar, look: settings.look, showPhoto: avatar === "photo" };
}
