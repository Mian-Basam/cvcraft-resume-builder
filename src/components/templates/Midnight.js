import Icon from "./Icon";
import { Photo, contactItems, pageStyle } from "./shared";
import { SectionBody, fontOf, photoOf, pick, SECTION_META } from "./kit";

const SIDE_KEYS = ["summary", "languages", "interests", "certifications"];
const MAIN_KEYS = ["experience", "education", "projects", "skills"];

// Dark sidebar, a coloured name banner across the page and skill percentage bars.
export default function Midnight({ data, theme }) {
  const { primary, accent, dark } = theme;
  const p = data.personal;

  const outlinePill = (title) => (
    <div
      style={{
        border: `2px solid ${accent}`,
        borderRadius: 999,
        padding: "6px 0",
        textAlign: "center",
        fontSize: 14,
        fontWeight: 500,
        margin: "0 0 14px",
      }}
    >
      {title}
    </div>
  );

  const filledPill = (title) => (
    <div
      style={{
        display: "inline-block",
        background: primary,
        color: "#fff",
        borderRadius: 999,
        padding: "6px 0",
        width: 170,
        textAlign: "center",
        fontSize: 14,
        fontWeight: 500,
        marginBottom: 14,
      }}
    >
      {title}
    </div>
  );

  const sideOpts = { primary: accent, text: "#e8e8e8", muted: "#bdbdbd", fs: 12, langStyle: "list", interestStyle: "list" };
  const mainOpts = { primary, text: "#222", muted: "#555", fs: 11.5, dateStyle: "below", titleColor: "#222", subColor: "#222" };

  const contact = contactItems(p).length > 0 && (
    <section key="contact" data-section="contact" style={{ marginBottom: 26 }}>
      {contactItems(p).map((c) => (
        <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, marginBottom: 12 }}>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name={c.icon} size={13} color={dark} strokeWidth={2.4} />
          </span>
          <span style={{ wordBreak: "break-word" }}>{c.value}</span>
        </div>
      ))}
    </section>
  );

  const sideKeys = pick(data, SIDE_KEYS);
  const sideNodes = sideKeys.map((k) =>
    k === "summary" ? (
      <section key="summary" data-section="summary" style={{ marginBottom: 24, textAlign: "center" }}>
        <h3 style={{ fontSize: 18, fontWeight: 500, color: "#fff", margin: "0 0 10px" }}>About Me</h3>
        <p style={{ fontSize: 11, lineHeight: 1.6, margin: 0 }}>{p.summary}</p>
      </section>
    ) : (
      <section key={k} data-section={k} style={{ marginBottom: 24 }}>
        {outlinePill(SECTION_META[k].title)}
        <div style={{ paddingLeft: 22 }}>
          <SectionBody k={k} data={data} o={sideOpts} />
        </div>
      </section>
    )
  );
  sideNodes.splice(sideKeys[0] === "summary" ? 1 : 0, 0, contact);

  const skillBars = (
    <>
      {data.skills.map((s) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 8 }}>
          <span style={{ width: 150 }}>{s.name}</span>
          <span style={{ flex: 1, height: 6, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${s.level ?? 0}%`, background: accent }} />
          </span>
          <span style={{ width: 40, textAlign: "right", fontSize: 14, color: primary }}>{s.level ?? 0}%</span>
        </div>
      ))}
    </>
  );

  return (
    <div
      className="resume-page"
      style={pageStyle({ fontFamily: fontOf(theme, "montserrat"), color: "#222", display: "flex" })}
    >
      <div style={{ width: 34, flexShrink: 0 }} />

      <aside style={{ width: 250, flexShrink: 0, background: dark, color: "#e8e8e8", padding: "252px 24px 40px" }}>
        {sideNodes}
      </aside>

      <main style={{ flex: 1, padding: "236px 44px 40px 30px" }}>
        {pick(data, MAIN_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 20 }}>
            {filledPill(k === "skills" ? "Skills Summary" : SECTION_META[k].title)}
            {k === "skills" ? skillBars : <SectionBody k={k} data={data} o={mainOpts} />}
          </section>
        ))}
      </main>

      <div
        style={{
          position: "absolute",
          top: 72,
          left: 0,
          right: 0,
          height: 130,
          zIndex: 1,
          background: `linear-gradient(105deg, ${primary} 0%, ${primary} 60%, ${accent} 160%)`,
        }}
      />
      <div style={{ position: "absolute", top: 84, left: 316, right: 30, zIndex: 2, color: "#fff" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.08, textTransform: "uppercase", margin: 0 }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 15, marginTop: 6 }}>{p.title}</div>}
      </div>
      <Photo
        src={photoOf(data, theme)}
        name={p.name}
        size={200}
        placeholderBg={accent}
        style={{ position: "absolute", top: 30, left: 60, zIndex: 3, border: `6px solid ${primary}` }}
      />
    </div>
  );
}
