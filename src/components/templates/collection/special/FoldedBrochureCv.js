// Folded Brochure CV: a tri-fold leaflet on a portrait page — a coloured profile cover, an experience panel and a portfolio & skills panel, split by dashed folds with soft crease shading.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const COVER = ["summary", "languages"];
const MIDDLE = ["experience", "education", "certifications"];
const RIGHT = ["projects", "skills", "interests"];
const W = 794 / 3;

export default function FoldedBrochureCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.15);
  const muted = mix(ink, "#ffffff", 0.45);
  const paper = mix(theme.light || "#f1f1f1", "#fffdf8", 0.55);
  const tint = mix(primary, paper, 0.9);
  const serif = fontStack("cormorant");
  const sans = fontStack("montserrat");

  const cover = pick(data, COVER);
  const middle = pick(data, MIDDLE);
  const right = pick(data, RIGHT);
  const hasContact = Boolean(p.email || p.phone || p.address || p.website);
  const initials = (p.name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);

  const crease = (side) => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 34,
    [side]: 0,
    pointerEvents: "none",
    background: `linear-gradient(${side === "left" ? 90 : 270}deg, rgba(0,0,0,0.09), rgba(0,0,0,0.025) 40%, rgba(0,0,0,0) 100%)`,
  });

  const Head = ({ k, light }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600, fontSize: 31, lineHeight: 1, color: light ? "#fff" : primary }}>{SECTION_META[k].title}</div>
      <div style={{ width: 34, height: 2, background: accent, marginTop: 7 }} />
    </div>
  );

  const PanelNo = ({ n, light, auto = true }) => (
    <div style={{ marginTop: auto ? "auto" : 0, paddingTop: 18, display: "flex", alignItems: "center", gap: 8, fontFamily: sans, fontSize: 10.5, fontWeight: 700, letterSpacing: 2.5, color: light ? mix("#ffffff", primary, 0.35) : muted }}>
      <span style={{ flex: 1, height: 1, background: light ? mix("#ffffff", primary, 0.6) : mix(ink, paper, 0.8) }} />
      {n} / 3
    </div>
  );

  const BigNo = ({ n }) => (
    <div style={{ marginTop: "auto", fontFamily: serif, fontStyle: "italic", fontWeight: 600, fontSize: 120, lineHeight: 1, marginBottom: -6, color: mix(primary, paper, 0.88), textAlign: "right", userSelect: "none" }}>
      {String(n).padStart(2, "0")}
    </div>
  );

  const middleBody = (k) => {
    if (k === "certifications") return rightBody(k);
    if (k === "experience")
      return data.experience.map((e, i) => (
        <div key={e.id} style={{ position: "relative", paddingLeft: 16, paddingBottom: i < data.experience.length - 1 ? 28 : 2, borderLeft: `1px solid ${mix(primary, paper, 0.6)}`, breakInside: "avoid" }}>
          <span style={{ position: "absolute", left: -5, top: 2, width: 9, height: 9, borderRadius: "50%", background: accent, border: `2px solid ${primary}`, boxSizing: "border-box" }} />
          {dateRange(e.start, e.end) && <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: primary }}>{dateRange(e.start, e.end)}</div>}
          <div style={{ fontFamily: sans, fontSize: 14.5, fontWeight: 700, color: ink, marginTop: 5, lineHeight: 1.3 }}>{e.role}</div>
          {(e.company || e.location) && <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 15.5, color: muted, marginTop: 2 }}>{[e.company, e.location].filter(Boolean).join(", ")}</div>}
          {lines(e.bullets).map((b, j) => (
            <div key={j} style={{ fontSize: 12.5, lineHeight: 1.6, color: ink, marginTop: 8 }}>{b}</div>
          ))}
        </div>
      ));
    return data.education.map((e) => (
      <div key={e.id} style={{ background: tint, padding: "14px 16px", marginBottom: 10, breakInside: "avoid" }}>
        <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{e.degree}</div>
        {e.school && <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 14.5, color: muted, marginTop: 2 }}>{e.school}</div>}
        <div style={{ fontSize: 11, color: primary, fontWeight: 700, marginTop: 4 }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>
      </div>
    ));
  };

  const rightBody = (k) => {
    if (k === "projects")
      return data.projects.map((e) => (
        <div key={e.id} style={{ marginBottom: 10, border: `1px solid ${mix(primary, paper, 0.75)}`, background: "#fff", breakInside: "avoid" }}>
          <div style={{ background: primary, color: "#fff", padding: "18px 16px 14px", position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", right: -14, top: -14, width: 54, height: 54, borderRadius: "50%", background: accent, opacity: 0.85 }} />
            <div style={{ position: "relative", fontFamily: sans, fontSize: 14.5, fontWeight: 700, lineHeight: 1.3, paddingRight: 30 }}>{e.name}</div>
            {e.link && <div style={{ position: "relative", fontSize: 10.5, marginTop: 3, color: mix("#ffffff", primary, 0.2), wordBreak: "break-word" }}>{e.link}</div>}
          </div>
          {lines(e.description).length > 0 && (
            <div style={{ padding: "12px 16px 14px", fontSize: 12.5, lineHeight: 1.6, color: ink }}>{lines(e.description).join(" ")}</div>
          )}
        </div>
      ));
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 12.5, color: ink, padding: "9px 0", borderBottom: `1px dashed ${mix(ink, paper, 0.75)}` }}>
          <span style={{ fontWeight: 600 }}>{s.name}</span>
          <span style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2, 3, 4].map((n) => (
              <span key={n} style={{ width: 7, height: 7, borderRadius: "50%", background: n < Math.round(((s.level ?? 0) / 100) * 5) ? primary : mix(primary, paper, 0.8) }} />
            ))}
          </span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 8, background: tint, padding: "14px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 14, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(", ")}</div>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((i) => (
          <span key={i.id} style={{ fontSize: 12, padding: "6px 12px", background: tint, color: ink, borderRadius: 999 }}>{i.name}</span>
        ))}
      </div>
    );
  };

  const panel = { position: "relative", padding: "44px 28px 28px", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: 1123 };
  const Fold = ({ x }) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: x, width: 0, borderLeft: `1px dashed ${mix(ink, paper, 0.55)}`, zIndex: 2 }}>
      <svg width="12" height="8" viewBox="0 0 12 8" style={{ position: "absolute", top: 10, left: -6.5 }}><path d="M0 0 L6 7 L12 0" fill={mix(ink, paper, 0.4)} /></svg>
      <svg width="12" height="8" viewBox="0 0 12 8" style={{ position: "absolute", bottom: 10, left: -6.5 }}><path d="M0 8 L6 1 L12 8" fill={mix(ink, paper, 0.4)} /></svg>
    </div>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "lato"), color: ink, background: paper, display: "grid", gridTemplateColumns: `${W}px ${W}px ${W}px` })}>
      {/* Panel 1 — profile cover */}
      <div style={{ ...panel, background: primary, color: "#fff" }}>
        <div style={crease("right")} />
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 28, fontWeight: 600, color: accent }}>{initials}</div>
        <h1 style={{ margin: "24px 0 0", fontFamily: serif, fontWeight: 600, fontSize: 56, lineHeight: 0.95, letterSpacing: -0.5 }}>
          {words.map((w, i) => (
            <div key={i} style={{ fontStyle: i ? "italic" : "normal", color: i ? accent : "#fff" }}>{w}</div>
          ))}
        </h1>
        {p.title && <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginTop: 14, color: mix("#ffffff", primary, 0.15) }}>{p.title}</div>}
        <div style={{ width: "100%", height: 1, background: mix("#ffffff", primary, 0.6), margin: "24px 0" }} />
        {cover.includes("summary") && (
          <section data-section="summary" style={{ marginBottom: 30 }}>
            <Head k="summary" light />
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: mix("#ffffff", primary, 0.1) }}>{p.summary}</p>
          </section>
        )}
        {cover.includes("languages") && (
          <section data-section="languages" style={{ marginBottom: 24 }}>
            <Head k="languages" light />
            {data.languages.map((l) => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 0", borderBottom: `1px solid ${mix("#ffffff", primary, 0.75)}` }}>
                <span style={{ fontWeight: 700 }}>{l.name}</span>
                <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 14, color: accent }}>{levelWord(l.level)}</span>
              </div>
            ))}
          </section>
        )}
        {hasContact && (
          <section data-section="contact" style={{ marginTop: "auto", background: mix(primary, dark, 0.3), padding: "14px 14px 8px", margin: "auto -6px 0" }}>
            <ContactList p={p} fs={11} iconColor={accent} color="#fff" gap={7} />
          </section>
        )}
        <PanelNo n={1} light auto={!hasContact} />
      </div>

      {/* Panel 2 — experience */}
      <div style={panel}>
        <div style={crease("left")} />
        <div style={crease("right")} />
        {middle.map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 34 }}>
            <Head k={k} />
            {middleBody(k)}
          </section>
        ))}
        <BigNo n={2} />
        <PanelNo n={2} auto={false} />
      </div>

      {/* Panel 3 — portfolio & skills */}
      <div style={panel}>
        <div style={crease("left")} />
        {right.map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 34 }}>
            <Head k={k} />
            {rightBody(k)}
          </section>
        ))}
        <BigNo n={3} />
        <PanelNo n={3} auto={false} />
      </div>

      <Fold x={W} />
      <Fold x={W * 2} />
    </div>
  );
}
