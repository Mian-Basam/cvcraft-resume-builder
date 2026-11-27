import Icon from "../Icon";
import { Photo, contactItems, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";
import { fontStack } from "@/lib/palettes";

const SIDE_KEYS = ["summary", "skills", "education", "languages", "projects", "certifications", "interests"];

function Heart({ x, y, size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, opacity: 0.45 }}>
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" fill="none" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}
function Sparkle({ x, y, size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, opacity: 0.5 }}>
      <path d="M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z" fill={color} />
    </svg>
  );
}

// Premium: soft pastel page where every section floats in its own thought cloud around the portrait.
export default function Daydream({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const hand = fontStack("caveat");
  const tints = [mix(primary, "#ffffff", 0.86), mix(accent, "#ffffff", 0.7), "#fdf3d6", "#e3f5ec", "#fde4ec", "#ece6fb"];
  const o = { primary, light: "#ffffff", text: "#3a3340", muted: "#7a7080", fs: 10.5, dateStyle: "below", skillStyle: "tags", langStyle: "dots", interestStyle: "icons", tagBg: "rgba(255,255,255,0.75)", barColor: primary, track: "rgba(0,0,0,0.12)" };

  // Rounded box with three bumps on top so it reads as a cloud; drop-shadow wraps the whole shape.
  const Cloud = ({ children, bg, style, k }) => (
    <div data-section={k} style={{ position: "relative", filter: "drop-shadow(0 4px 6px rgba(60,40,80,0.10))", marginTop: 18, breakInside: "avoid", ...style }}>
      {[
        ["14%", 40],
        ["40%", 52],
        ["70%", 36],
      ].map(([left, size]) => (
        <span key={left} style={{ position: "absolute", left, top: -size / 2.4, width: size, height: size, borderRadius: "50%", background: bg }} />
      ))}
      <div style={{ position: "relative", background: bg, borderRadius: 34, padding: "12px 18px 14px" }}>{children}</div>
    </div>
  );
  const heading = (title) => (
    <div style={{ fontFamily: hand, fontSize: 25, fontWeight: 700, color: primary, lineHeight: 1, marginBottom: 6 }}>
      {title} <span style={{ fontSize: 18 }}>♡</span>
    </div>
  );

  const keys = pick(data, SIDE_KEYS);
  const left = keys.filter((_, i) => i % 2 === 0);
  const right = keys.filter((_, i) => i % 2 === 1);
  const cloud = (k, i) => (
    <Cloud key={k} k={k} bg={tints[(SIDE_KEYS.indexOf(k) + i) % tints.length]}>
      {heading(k === "summary" ? "About me" : SECTION_META[k].title)}
      <SectionBody k={k} data={data} o={o} />
    </Cloud>
  );

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "poppins"),
        color: "#3a3340",
        background: `linear-gradient(165deg, ${mix(accent, "#ffffff", 0.8)} 0%, ${mix(primary, "#ffffff", 0.9)} 55%, #fdf0f4 100%)`,
        padding: "26px 30px 30px",
      })}
    >
      <Heart x={40} y={40} size={22} color={primary} />
      <Heart x={720} y={60} size={18} color={primary} />
      <Heart x={60} y={1050} size={20} color={primary} />
      <Sparkle x={680} y={170} size={16} color={accent} />
      <Sparkle x={110} y={300} size={14} color={accent} />
      <Sparkle x={730} y={1000} size={18} color={accent} />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Cloud bg="#ffffff" style={{ marginTop: 22 }}>
          <h1 style={{ fontFamily: hand, fontSize: 46, fontWeight: 700, color: mix(primary, "#000000", 0.2), margin: 0, padding: "0 18px", lineHeight: 1 }}>
            {p.name} <span style={{ color: accent }}>♥</span>
          </h1>
        </Cloud>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 210px 1fr", gap: 16, alignItems: "start", marginTop: 4 }}>
        <div>{left.map(cloud)}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 24 }}>
          <Photo
            src={photoOf(data, theme)}
            name={p.name}
            size={190}
            placeholderBg={mix(primary, "#ffffff", 0.3)}
            style={{ border: "6px solid #fff", boxShadow: `0 0 0 6px ${mix(accent, "#ffffff", 0.5)}, 0 10px 26px rgba(60,40,80,0.18)` }}
          />
          {p.title && <div style={{ fontFamily: hand, fontSize: 26, fontWeight: 700, color: primary, marginTop: 14, textAlign: "center" }}>{p.title}</div>}
          <Cloud bg="#ffffff" style={{ width: "100%" }}>
            {contactItems(p).map((c) => (
              <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9.5, marginBottom: 4 }}>
                <Icon name={c.icon} size={12} color={primary} />
                <span style={{ wordBreak: "break-word" }}>{c.value}</span>
              </div>
            ))}
          </Cloud>
        </div>
        <div>{right.map(cloud)}</div>
      </div>

      {pick(data, ["experience"]).length > 0 && (
        <Cloud k="experience" bg={mix(accent, "#ffffff", 0.75)} style={{ marginTop: 26 }}>
          {heading("Experience")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <SectionBody k="experience" data={data} o={{ ...o, dateStyle: "right" }} />
          </div>
        </Cloud>
      )}
    </div>
  );
}
