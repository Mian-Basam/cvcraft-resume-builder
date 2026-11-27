// The Product Packaging CV: the candidate as a premium boxed product — brand front panel, seal, "Skill Facts" label, specs and barcode.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { fontOf, pick, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const LEFT = ["summary", "experience", "projects", "education", "certifications"];
const RIGHT = ["skills", "languages", "interests"];

const TITLES = {
  summary: "About this product",
  experience: "Field-tested at",
  projects: "Key features",
  education: "Manufactured at",
  certifications: "Quality seals",
  languages: "Compatible with",
  interests: "Ingredients",
};

// Deterministic barcode bars from a string.
function bars(text = "cv") {
  const out = [];
  let seed = 7;
  for (let i = 0; i < 46; i++) {
    seed = (seed * 31 + text.charCodeAt(i % Math.max(1, text.length)) + i) % 997;
    out.push(1 + (seed % 3));
  }
  return out;
}

export default function ProductPackagingCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const bebas = fontStack("bebas");
  const ink = mix(theme.dark || "#1b1b1b", primary, 0.2);
  const muted = mix(ink, "#ffffff", 0.4);
  const card = mix(theme.light || "#f1f1f1", "#ffffff", 0.55);
  const tint = mix(primary, "#ffffff", 0.9);
  const years = data.experience.map((e) => parseInt(e.start, 10)).filter((n) => n > 1900);
  const est = years.length ? Math.min(...years) : "";

  const Head = ({ k }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ fontFamily: bebas, fontSize: 22, letterSpacing: 1.2, color: primary, lineHeight: 1 }}>{TITLES[k]}</span>
      <span style={{ flex: 1, height: 2, background: `repeating-linear-gradient(90deg, ${mix(primary, "#ffffff", 0.6)} 0 6px, transparent 6px 10px)` }} />
    </div>
  );

  const leftBody = (k) => {
    if (k === "summary")
      return <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: ink }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, i) => (
        <div key={e.id} style={{ display: "flex", gap: 14, marginTop: i ? 14 : 0, breakInside: "avoid" }}>
          <div style={{ width: 58, flexShrink: 0, textAlign: "center", border: `1.5px solid ${primary}`, borderRadius: 6, padding: "5px 0 4px", alignSelf: "flex-start" }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.2, color: muted }}>BATCH</div>
            <div style={{ fontFamily: bebas, fontSize: 24, lineHeight: 1, color: primary }}>{String(i + 1).padStart(2, "0")}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: ink }}>{e.role}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: primary, whiteSpace: "nowrap" }}>{dateRange(e.start, e.end)}</span>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: muted }}>{[e.company, e.location].filter(Boolean).join(" · ")}</div>
            {lines(e.bullets).map((b, j) => (
              <div key={j} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5, marginTop: 3, color: ink }}>
                <span style={{ color: primary, flexShrink: 0 }}>✦</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      ));
    if (k === "projects")
      return data.projects.map((e, i) => (
        <div key={e.id} style={{ display: "flex", gap: 11, marginTop: i ? 10 : 0 }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            <Icon name="star" size={12} color={ink} strokeWidth={2.4} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: ink }}>{e.name}</div>
            {e.link && <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>{e.link}</div>}
            {lines(e.description).map((b, j) => (
              <div key={j} style={{ fontSize: 12, lineHeight: 1.5, color: ink, marginTop: 2 }}>{b}</div>
            ))}
          </div>
        </div>
      ));
    if (k === "education")
      return data.education.map((e, i) => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: i ? 8 : 0 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: ink }}>{e.degree}</div>
            <div style={{ fontSize: 11.5, color: muted, fontWeight: 600 }}>{[e.school, e.grade].filter(Boolean).join(" · ")}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: primary, whiteSpace: "nowrap" }}>{dateRange(e.start, e.end)}</span>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {data.certifications.map((c) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px 6px 6px", borderRadius: 999, background: tint }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: primary, color: accent, border: `2px dashed ${accent}`, boxShadow: `0 0 0 2px ${primary}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: bebas, fontSize: 13, flexShrink: 0 }}>
              {c.year ? `’${String(c.year).slice(-2)}` : "✓"}
            </span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: ink }}>{c.name}</div>
              {c.issuer && <div style={{ fontSize: 10.5, color: muted, fontWeight: 600 }}>{c.issuer}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const black = "#111111";
  const facts = (
    <section data-section="skills" style={{ background: "#ffffff", border: `2px solid ${black}`, padding: "8px 10px 9px", color: black, marginBottom: 16 }}>
      <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: -0.5 }}>Skill Facts</div>
      <div style={{ fontSize: 11, marginTop: 4, borderBottom: `1px solid ${black}`, paddingBottom: 3 }}>Serving size: 1 full-time hire</div>
      <div style={{ fontSize: 11, display: "flex", justifyContent: "space-between", fontWeight: 800, borderBottom: `8px solid ${black}`, padding: "3px 0 4px" }}>
        <span>Servings per team</span>
        <span>Unlimited</span>
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 800, textAlign: "right", borderBottom: `1px solid ${black}`, padding: "3px 0" }}>% Daily Value*</div>
      {data.skills.map((s) => (
        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, borderBottom: `1px solid ${black}`, padding: "4px 0" }}>
          <span>
            <b>{s.name}</b>
          </span>
          <b>{s.level ?? 0}%</b>
        </div>
      ))}
      <div style={{ height: 4, background: black, marginTop: -1 }} />
      <div style={{ fontSize: 10.5, lineHeight: 1.35, marginTop: 5 }}>
        * Percent Daily Values are based on a 40-hour week. Your results may be even better.
      </div>
    </section>
  );

  const rightBody = (k) => {
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: `1px dotted ${mix(primary, "#ffffff", 0.6)}`, color: ink }}>
          <b>{l.name}</b>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    return (
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: ink }}>
        <b style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>Contains: </b>
        {data.interests.map((it) => it.name).join(", ")}
        {". "}
        <span style={{ color: muted, fontStyle: "italic" }}>May contain traces of coffee.</span>
      </p>
    );
  };

  const specRows = [
    ["Model", p.title],
    ["Origin", p.address],
    ["Phone", p.phone],
    ["Email", p.email],
    ["Web", p.website],
  ].filter((r) => r[1]);

  const left = pick(data, LEFT);
  const right = pick(data, RIGHT);
  const code = bars(p.name || "cv");

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "nunito"), color: ink, background: mix(primary, "#ffffff", 0.86), padding: 18, boxSizing: "border-box" })}>
      <div style={{ background: card, borderRadius: 14, overflow: "hidden", minHeight: 1087, boxSizing: "border-box", position: "relative", display: "flex", flexDirection: "column" }}>
        {/* front of pack */}
        <header style={{ position: "relative", background: primary, padding: "26px 34px 24px", overflow: "hidden", color: "#ffffff" }}>
          <svg width="760" height="230" style={{ position: "absolute", right: -40, top: -40, opacity: 0.1 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx="560" cy="120" r={40 + i * 34} fill="none" stroke="#ffffff" strokeWidth="10" />
            ))}
          </svg>
          <div style={{ position: "relative", fontSize: 10.5, fontWeight: 800, letterSpacing: 3, color: accent }}>
            PREMIUM CREATIVE TALENT{est ? ` · EST. ${est}` : ""}
          </div>
          <h1 style={{ position: "relative", margin: "6px 0 0", fontFamily: bebas, fontWeight: 400, fontSize: 76, lineHeight: 0.9, letterSpacing: 1, maxWidth: 520 }}>{p.name}</h1>
          {p.title && (
            <div style={{ position: "relative", display: "inline-block", marginTop: 10, background: accent, color: primary, fontWeight: 900, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", padding: "5px 14px", borderRadius: 4 }}>
              {p.title}
            </div>
          )}
          <div style={{ position: "absolute", right: 34, top: 26, width: 132, height: 132, transform: "rotate(10deg)" }}>
            <svg width="132" height="132" viewBox="0 0 132 132" style={{ position: "absolute", inset: 0 }}>
              <polygon
                fill={accent}
                points={Array.from({ length: 32 }, (_, i) => {
                  const r = i % 2 ? 56 : 66;
                  const a = (Math.PI * i) / 16;
                  return `${66 + r * Math.cos(a)},${66 + r * Math.sin(a)}`;
                }).join(" ")}
              />
              <circle cx="66" cy="66" r="47" fill="none" stroke={primary} strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: primary, textAlign: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.5 }}>NEW &amp;</span>
              <span style={{ fontFamily: bebas, fontSize: 28, lineHeight: 0.95 }}>IMPROVED</span>
              <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 1 }}>100% ORIGINAL</span>
            </div>
          </div>
        </header>
        <div style={{ background: ink, color: "#ffffff", display: "flex", justifyContent: "space-between", padding: "7px 34px", fontSize: 10.5, fontWeight: 800, letterSpacing: 2 }}>
          <span>NET WT. 1 PROFESSIONAL</span>
          <span style={{ color: accent }}>★ NO ARTIFICIAL BUZZWORDS ★</span>
          <span>READY TO USE</span>
        </div>

        <div style={{ display: "flex", gap: 26, padding: "22px 30px 22px 34px", flex: 1 }}>
          <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            {left.map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 22 }}>
                <Head k={k} />
                {leftBody(k)}
              </section>
            ))}
            <div style={{ marginTop: "auto", display: "flex", gap: 14, alignItems: "stretch", border: `1.5px dashed ${mix(primary, "#ffffff", 0.5)}`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontFamily: bebas, fontSize: 20, lineHeight: 1, color: primary, width: 74, flexShrink: 0, letterSpacing: 1 }}>Directions for use</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.55, color: ink, flex: 1 }}>
                {["Hire. Add one interesting brief.", "Allow time to steep in coffee and research.", "Enjoy results. Repeat as often as needed."].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <b style={{ color: primary }}>{i + 1}.</b>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside style={{ width: 244, flexShrink: 0, display: "flex", flexDirection: "column" }}>
            {right.includes("skills") && facts}

            {specRows.length > 0 && (
              <div data-section="contact" style={{ border: `1.5px solid ${primary}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ background: primary, color: "#ffffff", fontFamily: bebas, fontSize: 19, letterSpacing: 1.5, padding: "5px 12px 3px" }}>Specifications</div>
                <div style={{ padding: "4px 12px 6px", background: "#ffffff" }}>
                  {specRows.map(([label, value], i) => (
                    <div key={label} style={{ display: "flex", gap: 10, fontSize: 11.5, padding: "4px 0", borderTop: i ? `1px solid ${tint}` : "none" }}>
                      <span style={{ width: 46, flexShrink: 0, fontWeight: 800, color: primary }}>{label}</span>
                      <span style={{ color: ink, wordBreak: "break-word", minWidth: 0 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {right.filter((k) => k !== "skills").map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 16 }}>
                <Head k={k} />
                {rightBody(k)}
              </section>
            ))}

            <div style={{ marginTop: "auto", background: "#ffffff", borderRadius: 6, padding: "10px 12px 6px", alignSelf: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "flex-end", height: 46, gap: 1.5 }}>
                {code.map((w, i) => (
                  <span key={i} style={{ width: w, height: i % 11 === 0 ? 46 : 40, background: i % 2 ? "transparent" : black }} />
                ))}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 10.5, letterSpacing: 2.2, color: black, marginTop: 3 }}>{p.website || "0 12345 67890 5"}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
