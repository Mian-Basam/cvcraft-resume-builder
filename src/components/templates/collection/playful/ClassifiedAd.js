// The Classified Ad: a newspaper classifieds page — masthead, a marker-circled "AVAILABLE" headline ad, boxed ad cells and tear-off contact tabs.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN = ["experience", "education", "projects"];
const SIDE = ["skills", "languages", "certifications", "interests"];

// Second-hand-goods wording for a skill level.
function condition(level = 0) {
  if (level >= 90) return "mint condition";
  if (level >= 80) return "excellent cond.";
  if (level >= 65) return "good cond.";
  if (level >= 45) return "lightly used";
  return "fixer-upper";
}

export default function ClassifiedAd({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const bebas = fontStack("bebas");
  const serifHead = fontStack("playfair");
  const caveat = fontStack("caveat");
  const ink = mix(theme.dark || "#1b1b1b", "#000000", 0.3);
  const paper = mix(theme.light || "#f1f1f1", "#f1ebdd", 0.75);
  const muted = mix(ink, paper, 0.38);
  const marker = "#d4452c"; // red marker pen, part of the concept
  const fs = 11.5;

  const Cell = ({ k, title, variant = "plain", children, style, grow }) => {
    const heads = {
      plain: { borderBottom: `1.5px solid ${ink}`, color: ink },
      inverse: { background: ink, color: paper, padding: "3px 8px 1px", margin: "-10px -10px 8px" },
      color: { background: primary, color: "#ffffff", padding: "3px 8px 1px", margin: "-10px -10px 8px" },
    };
    return (
      <section
        data-section={k}
        style={{ flex: grow ? 1 : undefined, border: variant === "dashed" ? `1.5px dashed ${ink}` : `1.5px solid ${ink}`, padding: 10, background: variant === "tint" ? mix(paper, primary, 0.07) : "transparent", ...style }}
      >
        <div style={{ fontFamily: bebas, fontSize: 21, letterSpacing: 1, lineHeight: 1.05, marginBottom: 7, paddingBottom: variant === "plain" ? 3 : 0, ...(heads[variant] || heads.plain) }}>{title}</div>
        {children}
      </section>
    );
  };

  const runIn = (lead, text) => (
    <p style={{ margin: 0, fontSize: fs, lineHeight: 1.55, color: ink }}>
      <b style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>{lead}</b> {text}
    </p>
  );

  const mainCell = (k) => {
    if (k === "experience")
      return (
        <Cell key={k} k={k} title="Positions previously held" variant="inverse">
          {data.experience.map((e, i) => (
            <div key={e.id} style={{ paddingTop: i ? 9 : 0, marginTop: i ? 9 : 0, borderTop: i ? `1px dotted ${muted}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                <b style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.3 }}>{e.role}</b>
                <span style={{ fontSize: 11, fontWeight: 700, color: primary, whiteSpace: "nowrap" }}>{dateRange(e.start, e.end)}</span>
              </div>
              <div style={{ fontSize: 11.5, fontStyle: "italic", color: muted, marginBottom: 2 }}>{[e.company, e.location].filter(Boolean).join(", ")}</div>
              {lines(e.bullets).map((b, j) => (
                <div key={j} style={{ display: "flex", gap: 7, fontSize: fs, lineHeight: 1.5, marginTop: 2 }}>
                  <span style={{ flexShrink: 0 }}>■</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </Cell>
      );
    if (k === "education")
      return (
        <Cell key={k} k={k} title="Educated, well-read" variant="dashed" grow>
          {data.education.map((e, i) => (
            <div key={e.id} style={{ marginTop: i ? 6 : 0 }}>
              {runIn(e.degree + ".", [e.school, dateRange(e.start, e.end), e.grade].filter(Boolean).join(", ") + ".")}
            </div>
          ))}
        </Cell>
      );
    return (
      <Cell key={k} k={k} title="Recent work, on view" variant="tint" grow>
        {data.projects.map((e, i) => (
          <div key={e.id} style={{ marginTop: i ? 6 : 0 }}>
            {runIn(e.name + ".", lines(e.description).join(" "))}
            {e.link && <div style={{ fontSize: 11, fontStyle: "italic", color: muted, marginTop: 2 }}>See {e.link}</div>}
          </div>
        ))}
      </Cell>
    );
  };

  const sideCell = (k) => {
    if (k === "skills")
      return (
        <Cell key={k} k={k} title="Skills for sale" variant="color">
          {data.skills.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "baseline", gap: 6, fontSize: fs, lineHeight: 1.5, marginBottom: 2 }}>
              <b style={{ whiteSpace: "nowrap" }}>{s.name}</b>
              <span style={{ flex: 1, borderBottom: `1px dotted ${muted}`, minWidth: 8 }} />
              <span style={{ fontStyle: "italic", color: muted, whiteSpace: "nowrap" }}>{condition(s.level)}</span>
            </div>
          ))}
          <div style={{ fontSize: 10.5, fontStyle: "italic", color: muted, marginTop: 4 }}>All items sold together. No reasonable offer refused.</div>
        </Cell>
      );
    if (k === "languages")
      return (
        <Cell key={k} k={k} title="Speaks fluently" variant="plain">
          {runIn("Languages:", data.languages.map((l) => `${l.name} (${levelWord(l.level).toLowerCase()})`).join(", ") + ".")}
        </Cell>
      );
    if (k === "certifications")
      return (
        <Cell key={k} k={k} title="Certified genuine" variant="dashed">
          {data.certifications.map((c, i) => (
            <div key={c.id} style={{ marginTop: i ? 5 : 0 }}>{runIn(c.name + ".", [c.issuer, c.year].filter(Boolean).join(", ") + ".")}</div>
          ))}
        </Cell>
      );
    return (
      <Cell key={k} k={k} title="Hobbies, will discuss" variant="tint">
        {runIn("Enjoys:", data.interests.map((it) => it.name).join(", ") + ". Will talk about them at length over coffee.")}
      </Cell>
    );
  };

  const main = pick(data, MAIN);
  const side = pick(data, SIDE);
  const showSummary = pick(data, ["summary"]).length > 0;
  const tabs = [p.phone, p.email].filter(Boolean);
  const anyContact = tabs.length || p.address || p.website;

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "merriweather"), color: ink, background: paper, padding: "26px 40px 22px", boxSizing: "border-box" })}>
      {/* masthead */}
      <header>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", color: muted, borderBottom: `1px solid ${ink}`, paddingBottom: 4 }}>
          <span>Vol. XII · No. 1</span>
          <span>Late edition</span>
          <span>Price: one interview</span>
        </div>
        <div style={{ fontFamily: serifHead, fontWeight: 900, fontSize: 44, textAlign: "center", lineHeight: 1.1, letterSpacing: -0.5, padding: "4px 0 2px" }}>The Daily Hire</div>
        <div style={{ borderTop: `3px solid ${ink}`, borderBottom: `1px solid ${ink}`, height: 3 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "8px 0 12px" }}>
          <span style={{ background: ink, color: paper, fontFamily: bebas, fontSize: 18, letterSpacing: 2, padding: "3px 12px 1px" }}>Classifieds · Section C</span>
          <span style={{ fontFamily: bebas, fontSize: 18, letterSpacing: 2 }}>Help offered</span>
          <span style={{ flex: 1, height: 1, background: ink }} />
          <span style={{ fontFamily: caveat, fontSize: 22, color: marker, transform: "rotate(-3deg)", whiteSpace: "nowrap" }}>this one! ↓</span>
        </div>
      </header>

      {/* headline ad, circled in marker */}
      <div style={{ position: "relative", padding: 7, marginBottom: 14 }}>
        <svg width="100%" height="100%" viewBox="0 0 714 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d="M8,4 C180,-2 520,1 708,5 C712,30 711,70 707,96 C520,101 200,99 6,95 C2,70 3,28 10,1" fill="none" stroke={marker} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.85" />
        </svg>
        <div style={{ position: "relative", border: `3px double ${ink}`, padding: "12px 16px 14px", background: paper }}>
          <div style={{ fontFamily: bebas, fontSize: 60, lineHeight: 0.92, letterSpacing: 0.5 }}>
            Available: <span style={{ color: primary }}>{p.title || "Professional"}</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>{p.name}</div>
              {showSummary && (
                <p data-section="summary" style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.6 }}>
                  <b>ONE CAREFUL OWNER.</b> {p.summary}
                </p>
              )}
            </div>
            <div style={{ width: 138, flexShrink: 0, textAlign: "center", border: `1.5px solid ${ink}`, padding: "8px 6px", transform: "rotate(2deg)", background: mix(paper, accent, 0.22) }}>
              <div style={{ fontFamily: bebas, fontSize: 15, letterSpacing: 1.5 }}>Starts</div>
              <div style={{ fontFamily: bebas, fontSize: 30, lineHeight: 0.95, color: primary }}>Immediately</div>
              <div style={{ fontSize: 10.5, fontStyle: "italic", marginTop: 3 }}>Serious offers only. Fun ones too.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ad grid */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1.75, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {main.includes("experience") && mainCell("experience")}
          {main.filter((k) => k !== "experience").length > 0 && (
            <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
              {main.filter((k) => k !== "experience").map((k) => (
                <div key={k} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                  {mainCell(k)}
                </div>
              ))}
            </div>
          )}
          <div style={{ flex: 1, minHeight: 60, border: `1.5px solid ${ink}`, padding: "10px 12px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: bebas, fontSize: 26, lineHeight: 0.95, textAlign: "center", borderRight: `1.5px solid ${ink}`, paddingRight: 14 }}>
              Lost &amp;<br />Found
            </div>
            <div style={{ fontSize: fs, lineHeight: 1.55 }}>
              <b>LOST:</b> one boring, beige CV. Answers to &ldquo;To whom it may concern&rdquo;. No reward.
              <br />
              <b>FOUND:</b> this one. Please keep.
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>{side.map(sideCell)}</div>
      </div>

      {/* tear-off contact ad */}
      {anyContact && (
        <div data-section="contact" style={{ marginTop: 14, border: `1.5px solid ${ink}`, borderBottom: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 12px" }}>
            <span style={{ fontFamily: bebas, fontSize: 30, lineHeight: 1, color: primary }}>Call now!</span>
            <span style={{ fontSize: 11.5, lineHeight: 1.5, flex: 1 }}>
              {[p.phone, p.email, p.address, p.website].filter(Boolean).join("  ·  ")}
            </span>
            <span style={{ fontSize: 10.5, fontStyle: "italic", color: muted }}>Take a tab ↓</span>
          </div>
          {tabs.length > 0 && (
            <div style={{ display: "flex", borderTop: `1.5px dashed ${ink}` }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{ flex: 1, height: 150, borderLeft: i ? `1.5px dashed ${ink}` : "none", borderBottom: `1.5px solid ${ink}`, position: "relative", overflow: "hidden", transform: i === 3 ? "translateY(5px) rotate(1.5deg)" : "none", background: paper }}>
                  <div style={{ position: "absolute", left: "50%", top: "50%", width: 146, transform: "translate(-50%, -50%) rotate(90deg)", textAlign: "center", fontSize: 10.5, lineHeight: 1.35, whiteSpace: "nowrap" }}>
                    <b>{p.name}</b>
                    {tabs.map((t) => (
                      <div key={t}>{t}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
