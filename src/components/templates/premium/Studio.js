import { Photo, pageStyle } from "../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";

const MAIN_KEYS = ["summary", "experience", "projects"];
const SIDE_KEYS = ["education", "skills", "languages", "certifications", "interests"];

// Premium: editorial layout with a vertical name strip, framed photo and numbered sections.
export default function Studio({ data, theme }) {
  const { primary, accent, dark } = theme;
  const p = data.personal;
  const mainOpts = { primary, light: "#eee", text: "#262626", muted: "#6b6b6b", fs: 11.5, dateStyle: "right" };
  const sideOpts = { ...mainOpts, dateStyle: "below", skillStyle: "tags", langStyle: "dots", interestStyle: "inline", tagBg: "#fff", tagBorder: "#d4d4d4" };

  const mainKeys = pick(data, MAIN_KEYS);
  const sideKeys = pick(data, SIDE_KEYS);
  // Number sections in reading order: main column first, then the side column.
  const number = Object.fromEntries([...mainKeys, ...sideKeys].map((k, i) => [k, String(i + 1).padStart(2, "0")]));

  const section = (k, o) => (
    <section key={k} data-section={k} style={{ marginBottom: 20 }}>
      <h3 style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "0 0 12px" }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: accent, lineHeight: 1 }}>{number[k]}</span>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: dark }}>{SECTION_META[k].title}</span>
        <span style={{ flex: 1, height: 1, background: "#ddd", alignSelf: "center" }} />
      </h3>
      <SectionBody k={k} data={data} o={o} />
    </section>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: "#262626", display: "flex" })}>
      <div style={{ width: 64, flexShrink: 0, background: primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: "#fff",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 10,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {p.name}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "48px 46px 40px 40px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 26, marginBottom: 30 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 50, fontWeight: 900, lineHeight: 0.98, letterSpacing: -1.5, color: dark, margin: 0 }}>{p.name}</h1>
            {p.title && (
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: primary, marginTop: 12 }}>{p.title}</div>
            )}
            <div style={{ marginTop: 16 }}>
              <ContactList p={p} fs={11} iconColor={primary} color="#444" gap={5} />
            </div>
          </div>
          <div style={{ position: "relative", width: 150, height: 180, flexShrink: 0, marginRight: 10 }}>
            <div style={{ position: "absolute", left: 10, top: 10, width: 150, height: 180, background: accent }} />
            <Photo
              src={photoOf(data, theme)}
              name={p.name}
              size={150}
              placeholderBg={primary}
              style={{ position: "relative", width: 150, height: 180, borderRadius: 0 }}
            />
          </div>
        </header>
        <div style={{ display: "flex", gap: 30 }}>
          <div style={{ flex: 1, minWidth: 0 }}>{mainKeys.map((k) => section(k, mainOpts))}</div>
          <div style={{ width: 200, flexShrink: 0 }}>{sideKeys.map((k) => section(k, sideOpts))}</div>
        </div>
      </div>
    </div>
  );
}
