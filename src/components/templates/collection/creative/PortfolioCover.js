// Portfolio Cover: a full-height personal-brand cover column beside abstract project thumbnail tiles and a compact experience list.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const LEFT_KEYS = ["summary", "skills", "languages"];
const RIGHT_KEYS = ["projects", "experience", "education", "certifications", "interests"];

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

// Abstract "artwork" for a project tile; the composition varies with the index.
function TileArt({ i, c }) {
  const k = i % 4;
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", height: "100%" }}>
      {k === 0 && (
        <>
          <rect width="400" height="200" fill={c.primary} />
          {Array.from({ length: 9 }, (_, j) => <rect key={j} x={j * 24} y="0" width="12" height="200" fill={c.soft} opacity="0.25" />)}
          <circle cx="285" cy="100" r="78" fill={c.accent} />
          <circle cx="285" cy="100" r="40" fill={c.primary} />
          <rect x="40" y="36" width="120" height="14" fill={c.accent} />
        </>
      )}
      {k === 1 && (
        <>
          <rect width="400" height="200" fill={c.accent} />
          {Array.from({ length: 12 }, (_, j) => <rect key={j} x={30 + (j % 4) * 40} y={30 + Math.floor(j / 4) * 40} width="28" height="28" fill={c.primary} opacity={j % 3 ? 1 : 0.3} />)}
          <polygon points="250,180 330,30 400,180" fill={c.primary} />
          <polygon points="300,180 350,90 400,180" fill={c.soft} />
        </>
      )}
      {k === 2 && (
        <>
          <rect width="400" height="200" fill={c.soft} />
          {[150, 120, 90, 60, 30].map((r, j) => <circle key={r} cx="400" cy="200" r={r * 1.4} fill={j % 2 ? c.soft : c.primary} />)}
          <rect x="40" y="40" width="70" height="70" rx="35" fill={c.accent} />
        </>
      )}
      {k === 3 && (
        <>
          <rect width="400" height="200" fill={c.dark} />
          <polygon points="0,200 400,0 400,200" fill={c.primary} />
          <circle cx="110" cy="80" r="44" fill="none" stroke={c.accent} strokeWidth="14" />
          <rect x="250" y="120" width="100" height="40" fill={c.accent} />
        </>
      )}
    </svg>
  );
}

export default function PortfolioCover({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const display = fontStack("sora");
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.2);
  const muted = mix(ink, "#ffffff", 0.42);
  const soft = mix(primary, "#ffffff", 0.82);
  const cover = mix(primary, dark, 0.15);
  const mono = initials(p.name);
  const colors = { primary, accent, soft, dark };

  const leftOpts = {
    primary: accent, text: "rgba(255,255,255,0.92)", muted: "rgba(255,255,255,0.65)", titleColor: "#fff", subColor: accent, fs: 11.5,
    skillStyle: "tags", langStyle: "bars", tagBg: "rgba(255,255,255,0.1)", tagColor: "#fff", tagBorder: "rgba(255,255,255,0.25)",
    barColor: accent, track: "rgba(255,255,255,0.18)",
  };
  const rightOpts = {
    primary, text: ink, muted, titleColor: ink, subColor: primary, fs: 11.5, dateStyle: "right",
    interestStyle: "tags", tagBg: soft, tagColor: ink,
  };

  const LeftHead = ({ title }) => (
    <h3 style={{ fontFamily: display, fontSize: 11, fontWeight: 700, letterSpacing: 2.6, textTransform: "uppercase", color: accent, margin: "0 0 10px" }}>{title}</h3>
  );
  const RightHead = ({ title, n }) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
      <h3 style={{ fontFamily: display, fontSize: 17, fontWeight: 800, letterSpacing: -0.4, color: ink, margin: 0 }}>{title}</h3>
      <span style={{ flex: 1, height: 1, background: mix(ink, "#ffffff", 0.82), alignSelf: "center" }} />
      {n != null && <span style={{ fontFamily: display, fontSize: 11, fontWeight: 600, color: muted }}>({n})</span>}
    </div>
  );

  const Thumbs = () => {
    const many = data.projects.length > 1;
    return (
      <div style={{ display: "grid", gridTemplateColumns: many ? "1fr 1fr" : "1fr", gap: 14 }}>
        {data.projects.map((pr, i) => (
          <div key={pr.id} style={{ breakInside: "avoid" }}>
            <div style={{ position: "relative", height: many ? 118 : 224, overflow: "hidden", borderRadius: 4 }}>
              <TileArt i={i} c={colors} />
              <span style={{ position: "absolute", left: 10, bottom: 10, background: "#fff", color: ink, fontFamily: display, fontSize: 11.5, fontWeight: 700, padding: "5px 10px", maxWidth: "80%", lineHeight: 1.3 }}>
                {pr.name}
              </span>
              <span style={{ position: "absolute", right: 10, top: 8, fontFamily: display, fontSize: 11, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}>{String(i + 1).padStart(2, "0")}</span>
            </div>
            {lines(pr.description).map((l, j) => (
              <div key={j} style={{ fontSize: 11.5, lineHeight: 1.5, color: ink, marginTop: j ? 2 : 7 }}>{l}</div>
            ))}
            {pr.link && <div style={{ fontSize: 11, fontWeight: 600, color: primary, marginTop: 3 }}>{pr.link} →</div>}
          </div>
        ))}
      </div>
    );
  };

  const Compact = ({ k }) => {
    const rows =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, d: dateRange(e.start, e.end), t: e.role, s: [e.company, e.location].filter(Boolean).join(", "), b: lines(e.bullets) }))
        : data.education.map((e) => ({ id: e.id, d: dateRange(e.start, e.end), t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" · "), b: [] }));
    return rows.map((r, j) => (
      <div key={r.id} style={{ display: "grid", gridTemplateColumns: "96px 1fr", columnGap: 12, padding: "11px 0", borderTop: j ? `1px solid ${mix(ink, "#ffffff", 0.88)}` : "none", breakInside: "avoid" }}>
        <span style={{ fontFamily: display, fontSize: 11, fontWeight: 700, color: primary, paddingTop: 2, whiteSpace: "nowrap" }}>{r.d}</span>
        <div>
          <div style={{ fontSize: 13, color: ink }}>
            <b style={{ fontFamily: display }}>{r.t}</b>
            {r.s && <span style={{ color: muted }}> — {r.s}</span>}
          </div>
          {r.b.length > 0 && <div style={{ fontSize: 11.5, lineHeight: 1.5, color: ink, marginTop: 3 }}>{r.b.join(". ")}.</div>}
        </div>
      </div>
    ));
  };

  const rightKeys = pick(data, RIGHT_KEYS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "sora"), color: ink, background: "#fff", display: "flex" })}>
      <aside style={{ width: 318, flexShrink: 0, background: cover, color: "#fff", padding: "40px 34px 36px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* brand mark */}
        <div style={{ position: "relative", height: 236, marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 104, top: 22, width: 170, height: 170, borderRadius: "50%", background: accent }} />
          <span style={{ position: "absolute", left: -4, top: -16, fontFamily: display, fontWeight: 800, fontSize: 216, lineHeight: 1, letterSpacing: -16, color: "transparent", WebkitTextStroke: "2px #fff" }}>{mono}</span>
          <span style={{ position: "absolute", left: 0, bottom: 4, width: 44, height: 6, background: accent }} />
        </div>
        <h1 style={{ fontFamily: display, fontSize: 46, fontWeight: 800, lineHeight: 1, letterSpacing: -1.8, margin: "0 0 12px" }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: accent, marginBottom: 22 }}>{p.title}</div>}
        {pick(data, LEFT_KEYS).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 22 }}>
            {k === "summary" ? (
              <p style={{ fontSize: 12.5, lineHeight: 1.65, margin: 0, color: "rgba(255,255,255,0.9)" }}>{p.summary}</p>
            ) : (
              <>
                <LeftHead title={SECTION_META[k].title} />
                <SectionBody k={k} data={data} o={leftOpts} />
              </>
            )}
          </section>
        ))}
        <section data-section="contact" style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.22)", paddingTop: 16 }}>
          <ContactList p={p} fs={11.5} iconColor={accent} color="#fff" gap={8} />
        </section>
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: "40px 38px 34px 36px" }}>
        {rightKeys.map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 26 }}>
            <RightHead title={k === "projects" ? "Selected work" : SECTION_META[k].title} n={k === "projects" ? data.projects.length : null} />
            {k === "projects" ? <Thumbs /> : k === "experience" || k === "education" ? <Compact k={k} /> : <SectionBody k={k} data={data} o={rightOpts} />}
          </section>
        ))}
      </main>
    </div>
  );
}
