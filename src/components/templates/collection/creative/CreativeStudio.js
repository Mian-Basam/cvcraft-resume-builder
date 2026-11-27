// Creative Studio: asymmetric layout — a colourful identity block, an offset right sidebar and portfolio highlight cards.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "projects", "experience", "education"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function CreativeStudio({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const display = fontStack("sora");
  const ink = mix(theme.dark || "#1b1b1b", primary, 0.25);
  const cream = mix(theme.light || "#f1f1f1", "#fdf8f0", 0.65);
  const side = mix(accent, cream, 0.74);
  const muted = mix(ink, "#ffffff", 0.4);
  const deep = mix(primary, "#000000", 0.25);
  const nameParts = (p.name || "").trim().split(/\s+/);
  const first = nameParts[0] || "";
  const rest = nameParts.slice(1).join(" ");

  const mainOpts = { primary, text: ink, muted, titleColor: ink, subColor: primary, fs: 11.5, dateStyle: "right" };
  const sideOpts = {
    primary, text: ink, muted, titleColor: ink, subColor: primary, fs: 11.5, dateStyle: "below",
    skillStyle: "segments", langStyle: "dots", interestStyle: "tags",
    barColor: primary, track: mix(primary, "#ffffff", 0.75), tagBg: "#ffffff", tagColor: ink, tagBorder: mix(primary, "#ffffff", 0.7),
  };

  const MainHeading = ({ title }) => (
    <h3 style={{ fontFamily: display, fontSize: 19, fontWeight: 700, color: ink, margin: "0 0 12px", letterSpacing: -0.3 }}>
      <span style={{ background: `linear-gradient(transparent 58%, ${mix(accent, "#ffffff", 0.25)} 58%)`, padding: "0 4px" }}>{title}</span>
    </h3>
  );
  const SideHeading = ({ title }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: display, fontSize: 11.5, fontWeight: 700, letterSpacing: 2.2, textTransform: "uppercase", color: primary, margin: "0 0 11px" }}>
      <span style={{ position: "relative", width: 16, height: 12, flexShrink: 0 }}>
        <span style={{ position: "absolute", left: 0, top: 0, width: 12, height: 12, borderRadius: "50%", background: accent }} />
        <span style={{ position: "absolute", left: 6, top: 3, width: 9, height: 9, background: primary, mixBlendMode: "multiply" }} />
      </span>
      {title}
    </h3>
  );

  const ProjectCards = () => {
    const many = data.projects.length > 1;
    return (
      <div style={{ display: "grid", gridTemplateColumns: many ? "1fr 1fr" : "1fr", gap: 12 }}>
        {data.projects.map((pr, i) => {
          const hue = i % 2 ? accent : primary;
          const swatch = (
            <div style={{ position: "relative", overflow: "hidden", background: hue, ...(many ? { height: 70 } : { width: 150, minHeight: 112, flexShrink: 0 }) }}>
              <span style={{ position: "absolute", right: -26, bottom: -34, width: 96, height: 96, borderRadius: "50%", background: i % 2 ? primary : accent }} />
              <span style={{ position: "absolute", right: 46, top: 14, width: 22, height: 22, borderRadius: 5, border: `3px solid ${mix(hue, "#ffffff", 0.35)}`, transform: "rotate(20deg)" }} />
              <span style={{ position: "absolute", left: 14, top: 10, fontFamily: display, fontWeight: 800, fontSize: 30, color: i % 2 ? primary : "#fff", letterSpacing: -1 }}>{String(i + 1).padStart(2, "0")}</span>
            </div>
          );
          return (
            <div key={pr.id} style={{ display: "flex", flexDirection: many ? "column" : "row", background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: `0 1px 0 ${mix(primary, "#ffffff", 0.8)}, 0 6px 18px ${mix(primary, "#ffffff", 0.88)}`, breakInside: "avoid" }}>
              {swatch}
              <div style={{ padding: "16px 20px 16px", flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: display, fontSize: 14.5, fontWeight: 700, color: ink }}>{pr.name}</div>
                {lines(pr.description).map((l, j) => (
                  <div key={j} style={{ fontSize: 12, lineHeight: 1.55, color: ink, marginTop: 4 }}>{l}</div>
                ))}
                {pr.link && <div style={{ fontSize: 11, fontWeight: 600, color: primary, marginTop: 6 }}>↗ {pr.link}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const Experience = ({ k }) =>
    data[k].map((e) => {
      const title = k === "experience" ? e.role : e.degree;
      const sub = k === "experience" ? [e.company, e.location].filter(Boolean).join(" · ") : [e.school, e.grade].filter(Boolean).join(" · ");
      const date = dateRange(e.start, e.end);
      const bullets = k === "experience" ? lines(e.bullets) : [];
      return (
        <div key={e.id} style={{ display: "flex", gap: 14, marginBottom: 16, breakInside: "avoid" }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", border: `2.5px solid ${primary}`, marginTop: 4, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: display, fontSize: 14, fontWeight: 700, color: ink }}>{title}</span>
              {date && <span style={{ fontSize: 10.5, fontWeight: 600, color: primary, background: side, padding: "2px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>{date}</span>}
            </div>
            {sub && <div style={{ fontSize: 12, color: muted, marginTop: 1 }}>{sub}</div>}
            {bullets.map((b, j) => (
              <div key={j} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.55, color: ink, marginTop: 4 }}>
                <span style={{ color: primary, fontWeight: 700 }}>–</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      );
    });

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: ink, background: cream, display: "flex" })}>
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* identity block */}
        <header style={{ position: "relative", overflow: "hidden", background: primary, color: "#fff", padding: "58px 40px 54px", borderBottomRightRadius: 110, minHeight: 250 }}>
          <span style={{ position: "absolute", right: -60, bottom: -120, width: 260, height: 260, borderRadius: "50%", background: accent }} />
          <span style={{ position: "absolute", right: 120, top: -50, width: 130, height: 130, borderRadius: "50%", border: `16px solid ${mix(primary, "#ffffff", 0.14)}` }} />
          <span style={{ position: "absolute", right: 40, top: 40, width: 46, height: 46, background: mix(accent, primary, 0.35), transform: "rotate(18deg)", borderRadius: 8 }} />
          <svg width="90" height="40" style={{ position: "absolute", left: 40, bottom: 22, opacity: 0.35 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <circle key={i} cx={5 + (i % 8) * 11} cy={5 + Math.floor(i / 8) * 11} r="2" fill="#fff" />
            ))}
          </svg>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fff", color: primary, fontFamily: display, fontWeight: 800, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 1 }}>
              {initials(p.name)}
            </div>
            {p.title && (
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: primary, background: accent, padding: "5px 12px", borderRadius: 999 }}>{p.title}</span>
            )}
          </div>
          <h1 style={{ position: "relative", fontFamily: display, fontSize: 60, fontWeight: 800, lineHeight: 0.96, letterSpacing: -2.5, margin: "0 0 24px" }}>
            {first}
            {rest && <br />}
            {rest && <span style={{ color: mix(accent, "#ffffff", 0.1) }}>{rest}</span>}
          </h1>
        </header>

        <div style={{ padding: "36px 34px 34px 40px" }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: k === "summary" ? 30 : 26 }}>
              {k === "summary" ? (
                <p style={{ fontFamily: display, fontSize: 15, lineHeight: 1.65, fontWeight: 400, color: ink, margin: 0, borderLeft: `4px solid ${accent}`, paddingLeft: 16 }}>{p.summary}</p>
              ) : (
                <>
                  <MainHeading title={k === "projects" ? "Portfolio highlights" : SECTION_META[k].title} />
                  {k === "projects" ? <ProjectCards /> : k === "experience" || k === "education" ? <Experience k={k} /> : <SectionBody k={k} data={data} o={mainOpts} />}
                </>
              )}
            </section>
          ))}
        </div>
      </main>

      <aside style={{ width: 250, flexShrink: 0, background: side, padding: "64px 26px 40px 28px", borderTopLeftRadius: 0, position: "relative" }}>
                <section data-section="contact" style={{ marginBottom: 32 }}>
          <SideHeading title="Say hello" />
          <ContactList p={p} fs={11.5} iconColor={primary} color={ink} gap={10} />
        </section>
        {pick(data, SIDE_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 30 }}>
            <SideHeading title={SECTION_META[k].title} />
            <SectionBody k={k} data={data} o={sideOpts} />
          </section>
        ))}
      </aside>
    </div>
  );
}
