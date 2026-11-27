import Icon from "../Icon";
import { Photo, contactItems, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";
import { fontStack } from "@/lib/palettes";

const RIGHT_KEYS = ["experience", "education", "skills", "projects", "certifications", "interests"];

// Premium: scrapbook page on dotted paper: polaroid photo, tape, sticky notes and label headings.
export default function Scrapbook({ data, theme }) {
  const { primary, accent, light, dark } = theme;
  const p = data.personal;
  const hand = fontStack("caveat");
  const showSummary = pick(data, ["summary"]).length > 0;
  const showLanguages = pick(data, ["languages"]).length > 0;
  const o = { primary, light, text: "#2d2a26", muted: "#6b6560", fs: 11, dateStyle: "right", skillStyle: "tags", interestStyle: "inline", tagBg: "#fff", tagBorder: mix(primary, "#ffffff", 0.6) };

  const Tape = ({ style }) => (
    <span style={{ position: "absolute", width: 74, height: 22, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 2px rgba(0,0,0,0.06)", ...style }} />
  );
  const Label = ({ title, icon }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: mix(primary, "#ffffff", 0.82), border: `1.5px solid ${dark}`, borderRadius: 8, padding: "2px 14px 2px 10px", margin: "0 0 8px" }}>
      <Icon name={icon} size={16} color={dark} strokeWidth={2} />
      <span style={{ fontFamily: hand, fontSize: 24, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: dark, lineHeight: 1.1 }}>{title}</span>
    </div>
  );

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "poppins"),
        color: "#2d2a26",
        backgroundColor: "#f7f0e6",
        backgroundImage: "radial-gradient(rgba(0,0,0,0.09) 1px, transparent 1.4px)",
        backgroundSize: "16px 16px",
        display: "flex",
        gap: 26,
        padding: "34px 36px 30px",
      })}
    >
      <div style={{ width: 330, flexShrink: 0 }}>
        <h1 style={{ fontFamily: hand, fontSize: 56, fontWeight: 700, lineHeight: 0.95, margin: 0, color: dark, textTransform: "uppercase" }}>{p.name}</h1>
        {p.title && <div style={{ fontFamily: hand, fontSize: 24, color: primary, marginTop: 2 }}>{p.title}</div>}

        <div style={{ position: "relative", background: "#fff", padding: "12px 12px 44px", margin: "22px 0 0 14px", width: 270, transform: "rotate(-3deg)", boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}>
          <Tape style={{ top: -12, left: 20, transform: "rotate(-24deg)" }} />
          <Tape style={{ top: -10, right: 12, transform: "rotate(18deg)" }} />
          <Photo src={photoOf(data, theme)} name={p.name} size={246} placeholderBg={primary} style={{ borderRadius: 0 }} />
          <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontFamily: hand, fontSize: 22, color: "#555" }}>hello there!</div>
        </div>

        {showSummary && (
          <div data-section="summary" style={{ position: "relative", background: mix(accent, "#ffffff", 0.55), padding: "20px 18px 16px", margin: "26px 6px 0 0", transform: "rotate(1.5deg)", boxShadow: "0 4px 10px rgba(0,0,0,0.10)", borderRadius: 4 }}>
            <Tape style={{ top: -11, left: 110, transform: "rotate(-4deg)" }} />
            <SectionBody k="summary" data={data} o={o} />
          </div>
        )}

        {showLanguages && (
          <div data-section="languages"
            style={{
              position: "relative",
              margin: "26px 20px 0 16px",
              padding: "16px 18px 12px",
              transform: "rotate(-1.5deg)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.10)",
              backgroundColor: "#fff",
              backgroundImage: `linear-gradient(${mix(primary, "#ffffff", 0.85)} 1px, transparent 1px), linear-gradient(90deg, ${mix(primary, "#ffffff", 0.85)} 1px, transparent 1px)`,
              backgroundSize: "14px 14px",
            }}
          >
            <Tape style={{ top: -11, left: 90 }} />
            <div style={{ fontFamily: hand, fontSize: 26, fontWeight: 700, textAlign: "center", textTransform: "uppercase", color: dark }}>Languages</div>
            <SectionBody k="languages" data={data} o={{ ...o, langStyle: "dots", barColor: mix(accent, "#000000", 0.2), track: "#e5e0da" }} />
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {contactItems(p).length > 0 && (
          <div style={{ position: "relative", background: mix(accent, "#ffffff", 0.35), padding: "18px 18px 12px", margin: "0 10px 24px 20px", transform: "rotate(2deg)", boxShadow: "0 4px 10px rgba(0,0,0,0.12)" }}>
            <svg width="22" height="48" viewBox="0 0 22 48" style={{ position: "absolute", top: -18, right: 26 }}>
              <path d="M6 30 V8 a5 5 0 0 1 10 0 V36 a8 8 0 0 1 -16 0 V14" fill="none" stroke="#8a8a8a" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <div style={{ fontFamily: hand, fontSize: 22, fontWeight: 700, textTransform: "uppercase", marginBottom: 4, color: dark }}>Info</div>
            {contactItems(p).map((c) => (
              <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10.5, marginBottom: 4 }}>
                <Icon name={c.icon} size={13} color={dark} />
                <span style={{ wordBreak: "break-word" }}>{c.value}</span>
              </div>
            ))}
          </div>
        )}
        {pick(data, RIGHT_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 14 }}>
            <Label title={SECTION_META[k].title} icon={SECTION_META[k].icon} />
            <SectionBody k={k} data={data} o={o} />
          </section>
        ))}
      </div>
    </div>
  );
}
