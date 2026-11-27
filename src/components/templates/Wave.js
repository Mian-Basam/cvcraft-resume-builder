import { Photo, pageStyle } from "./shared";
import { ContactList, Sections, fontOf, photoOf, pick } from "./kit";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "interests", "certifications"];

// Coloured header ending in a double wave, with matching waves at the foot of the page.
export default function Wave({ data, theme }) {
  const { primary, accent, light } = theme;
  const p = data.personal;
  const mainOpts = { primary, light, text: "#2a2a2a", muted: "#6b6b6b", fs: 11.5, dateStyle: "right" };
  const sideOpts = { ...mainOpts, dateStyle: "below", skillStyle: "dots", langStyle: "bars", interestStyle: "tags" };

  const Heading = ({ title }) => (
    <h3 style={{ fontSize: 16, fontWeight: 700, color: primary, margin: "0 0 12px" }}>
      {title}
      <svg width="44" height="8" viewBox="0 0 44 8" style={{ display: "block", marginTop: 3 }}>
        <path d="M0,4 Q5.5,0 11,4 T22,4 T33,4 T44,4" stroke={accent} strokeWidth="2.2" fill="none" />
      </svg>
    </h3>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: "#2a2a2a" })}>
      <header style={{ position: "relative", background: primary, padding: "40px 56px 74px", display: "flex", alignItems: "center", gap: 28 }}>
        <Photo
          src={photoOf(data, theme)}
          name={p.name}
          size={140}
          placeholderBg={accent}
          style={{ border: "5px solid #fff", flexShrink: 0 }}
        />
        <div style={{ color: "#fff" }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 15, fontWeight: 500, color: accent, marginTop: 6 }}>{p.title}</div>}
        </div>
        <svg width="794" height="60" viewBox="0 0 794 60" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: -1 }}>
          <path d="M0,22 C160,62 300,-8 460,18 C620,44 700,6 794,22 L794,60 L0,60 Z" fill={accent} />
          <path d="M0,34 C160,74 300,4 460,30 C620,56 700,18 794,34 L794,60 L0,60 Z" fill="#fff" />
        </svg>
      </header>

      <div style={{ display: "flex", gap: 32, padding: "18px 48px 100px" }}>
        <div style={{ width: 225, flexShrink: 0 }}>
          <section style={{ marginBottom: 22 }}>
            <Heading title="Contact" />
            <ContactList p={p} fs={11} iconColor={primary} color="#333" />
          </section>
          <Sections keys={pick(data, SIDE_KEYS)} data={data} o={sideOpts} Heading={Heading} />
        </div>
        <div style={{ flex: 1, minWidth: 0, borderLeft: `1px solid ${light}`, paddingLeft: 28 }}>
          <Sections keys={pick(data, MAIN_KEYS)} data={data} o={mainOpts} Heading={Heading} />
        </div>
      </div>

      <svg width="794" height="70" viewBox="0 0 794 70" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: 0 }}>
        <path d="M0,30 C200,0 420,60 794,18 L794,70 L0,70 Z" fill={accent} />
        <path d="M0,42 C200,12 420,72 794,30 L794,70 L0,70 Z" fill={primary} />
      </svg>
    </div>
  );
}
