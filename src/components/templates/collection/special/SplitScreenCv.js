// Split-Screen CV: a true 50/50 page — a full-height colour field with a full-bleed portrait and giant stacked name on the left, all professional detail on the right.
import { pageStyle, mix, lines, dateRange, Photo } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick, photoOf, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const LEFT = ["summary", "interests"];
const RIGHT = ["experience", "education", "projects", "skills", "languages", "certifications"];
const HALF = 397;

export default function SplitScreenCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.12);
  const muted = mix(ink, "#ffffff", 0.42);
  const line = mix(primary, "#ffffff", 0.8);
  const bebas = fontStack("bebas");

  const left = pick(data, LEFT);
  const right = pick(data, RIGHT);
  const hasContact = Boolean(p.email || p.phone || p.address || p.website);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const first = words[0] || "";
  const rest = words.slice(1).join(" ");
  const longest = Math.max(first.length, rest.length, 1);
  const nameSize = Math.min(104, Math.floor(330 / (longest * 0.46)));

  const Head = ({ k, i }) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${line}` }}>
      <span style={{ fontFamily: bebas, fontSize: 17, color: accent === "#ffffff" ? primary : mix(accent, dark, 0.35), letterSpacing: 1 }}>{String(i + 1).padStart(2, "0")}</span>
      <h3 style={{ margin: 0, fontFamily: bebas, fontWeight: 400, fontSize: 26, letterSpacing: 1.5, color: primary, lineHeight: 1 }}>{SECTION_META[k].title}</h3>
    </div>
  );

  const entry = (t, s, d, bullets, key) => (
    <div key={key} style={{ marginBottom: 14, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: ink }}>{t}</span>
        {d && <span style={{ fontSize: 11.5, fontWeight: 600, color: muted, whiteSpace: "nowrap" }}>{d}</span>}
      </div>
      {s && <div style={{ fontSize: 12, fontWeight: 600, color: primary, marginTop: 2, wordBreak: "break-word" }}>{s}</div>}
      {bullets.map((b, j) => (
        <div key={j} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5, color: ink, marginTop: 5 }}>
          <span style={{ width: 5, height: 5, background: accent, flexShrink: 0, marginTop: 7 }} />
          <span>{b}</span>
        </div>
      ))}
    </div>
  );

  const body = (k) => {
    if (k === "experience")
      return data.experience.map((e) => entry(e.role, [e.company, e.location].filter(Boolean).join(", "), dateRange(e.start, e.end), lines(e.bullets), e.id));
    if (k === "education")
      return data.education.map((e) => entry(e.degree, [e.school, e.grade].filter(Boolean).join(" · "), dateRange(e.start, e.end), [], e.id));
    if (k === "projects") return data.projects.map((e) => entry(e.name, e.link, "", lines(e.description), e.id));
    if (k === "certifications") return data.certifications.map((e) => entry(e.name, e.issuer, e.year, [], e.id));
    if (k === "skills")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
          {data.skills.map((s) => (
            <div key={s.id} style={{ fontSize: 12.5, color: ink }}>
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                {[0, 1, 2, 3, 4].map((n) => (
                  <span key={n} style={{ flex: 1, height: 4, background: n < Math.round(((s.level ?? 0) / 100) * 5) ? primary : line }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    if (k === "languages")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
          {data.languages.map((l) => (
            <span key={l.id} style={{ fontSize: 12.5, color: ink }}>
              <b>{l.name}</b> <span style={{ color: muted }}>— {levelWord(l.level)}</span>
            </span>
          ))}
        </div>
      );
    return null;
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: ink, display: "flex" })}>
      {/* Identity half */}
      <div style={{ width: HALF, flexShrink: 0, background: primary, color: "#fff", display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ position: "relative", height: 420 }}>
          <Photo
            src={photoOf(data, theme)}
            name={p.name}
            size={420}
            placeholderBg={mix(primary, "#ffffff", 0.14)}
            style={{ width: HALF, height: 420, borderRadius: 0 }}
          />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -3, height: 243, background: `linear-gradient(180deg, ${primary}00 0%, ${primary}99 55%, ${primary} 100%)` }} />
        </div>
        <div style={{ padding: "0 36px", marginTop: -84, position: "relative" }}>
          <h1 style={{ margin: 0, fontFamily: bebas, fontWeight: 400, fontSize: nameSize, lineHeight: 0.86, letterSpacing: 1 }}>
            <div style={{ color: accent }}>{first}</div>
            {rest && <div style={{ color: "#fff" }}>{rest}</div>}
          </h1>
          {p.title && (
            <div style={{ marginTop: 14, display: "inline-block", background: accent, color: mix(accent, dark, 0.82), fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", padding: "6px 12px" }}>
              {p.title}
            </div>
          )}
        </div>
        <div style={{ padding: "26px 36px 36px", display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
          {left.includes("summary") && (
            <section data-section="summary">
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: mix("#ffffff", primary, 0.12), borderLeft: `3px solid ${accent}`, paddingLeft: 16 }}>{p.summary}</p>
            </section>
          )}
          {hasContact && (
            <section data-section="contact">
              <ContactList p={p} fs={12} iconColor={accent} color="#fff" gap={9} />
            </section>
          )}
          {left.includes("interests") && (
            <section data-section="interests" style={{ marginTop: "auto" }}>
              <div style={{ fontFamily: bebas, fontSize: 18, letterSpacing: 2, color: accent, marginBottom: 8 }}>{SECTION_META.interests.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.interests.map((i) => (
                  <span key={i.id} style={{ fontSize: 11.5, padding: "4px 11px", border: `1px solid ${mix(accent, primary, 0.3)}`, borderRadius: 999, color: "#fff" }}>{i.name}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Professional half */}
      <div style={{ width: HALF, flexShrink: 0, padding: "48px 36px 30px 38px", boxSizing: "border-box", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: accent }} />
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: muted, marginBottom: 22 }}>Curriculum Vitae</div>
        {right.map((k, i) => (
          <section key={k} data-section={k} style={{ marginBottom: 22 }}>
            <Head k={k} i={i} />
            {body(k)}
          </section>
        ))}
      </div>
    </div>
  );
}
