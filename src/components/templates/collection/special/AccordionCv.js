// Accordion-Inspired CV: every section is an expanded accordion panel — a dark header bar with index, item count and chevron toggle over compact info blocks, stacked like layered cards.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const ALL = ["summary", "experience", "education", "projects", "skills", "languages", "certifications", "interests"];
const HALF = ["education", "languages", "certifications", "interests"];

export default function AccordionCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.15);
  const bar = mix(dark, primary, 0.35);
  const muted = mix(ink, "#ffffff", 0.45);
  const page = mix(theme.light || "#f1f1f1", primary, 0.04);
  const block = mix(primary, "#ffffff", 0.94);
  const edge = mix(primary, "#ffffff", 0.82);
  const display = fontStack("manrope");

  const keys = pick(data, ALL);
  const hasContact = Boolean(p.email || p.phone || p.address || p.website);
  const count = (k) => (k === "summary" ? null : (data[k] || []).length);

  const Chevron = ({ color }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 15 6-6 6 6" />
    </svg>
  );

  const Bar = ({ k, n }) => {
    const c = count(k);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: bar, color: "#fff", padding: "0 10px 0 14px", height: 36 }}>
        <span style={{ fontFamily: display, fontSize: 11, fontWeight: 800, color: accent, width: 18 }}>{String(n).padStart(2, "0")}</span>
        <Icon name={SECTION_META[k].icon} size={15} color="#fff" />
        <span style={{ fontFamily: display, fontSize: 13, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", flex: 1 }}>{SECTION_META[k].title}</span>
        {c != null && <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: mix(bar, "#ffffff", 0.14), color: mix("#ffffff", bar, 0.2) }}>{c} {c === 1 ? "item" : "items"}</span>}
        <span style={{ width: 24, height: 24, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Chevron color={mix(accent, dark, 0.85)} />
        </span>
      </div>
    );
  };

  const Block = ({ title, sub, date, children }) => (
    <div style={{ background: block, borderLeft: `3px solid ${primary}`, padding: "10px 12px", breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
        <span style={{ fontFamily: display, fontSize: 13.5, fontWeight: 800, color: ink }}>{title}</span>
        {date && <span style={{ fontSize: 10.5, fontWeight: 700, color: primary, whiteSpace: "nowrap", background: "#fff", padding: "2px 7px", borderRadius: 3 }}>{date}</span>}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: muted, fontWeight: 600, marginTop: 2, wordBreak: "break-word" }}>{sub}</div>}
      {children}
    </div>
  );

  const bullets = (text) =>
    lines(text).map((b, j) => (
      <div key={j} style={{ display: "flex", gap: 7, fontSize: 11.5, lineHeight: 1.5, color: ink, marginTop: 5 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: primary, flexShrink: 0, marginTop: 6 }} />
        <span>{b}</span>
      </div>
    ));

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: ink }}>{p.summary}</p>;
    if (k === "experience")
      return (
        <div style={{ display: "grid", gridTemplateColumns: data.experience.length > 1 ? "1fr 1fr" : "1fr", gap: 10 }}>
          {data.experience.map((e) => (
            <Block key={e.id} title={e.role} sub={[e.company, e.location].filter(Boolean).join(", ")} date={dateRange(e.start, e.end)}>
              {bullets(e.bullets)}
            </Block>
          ))}
        </div>
      );
    if (k === "education")
      return (
        <div style={{ display: "grid", gap: 8 }}>
          {data.education.map((e) => (
            <Block key={e.id} title={e.degree} sub={[e.school, e.grade].filter(Boolean).join(" · ")} date={dateRange(e.start, e.end)} />
          ))}
        </div>
      );
    if (k === "projects")
      return (
        <div style={{ display: "grid", gridTemplateColumns: data.projects.length > 1 ? "1fr 1fr" : "1fr", gap: 10 }}>
          {data.projects.map((e) => (
            <Block key={e.id} title={e.name} sub={e.link}>
              {bullets(e.description)}
            </Block>
          ))}
        </div>
      );
    if (k === "certifications")
      return (
        <div style={{ display: "grid", gap: 8 }}>
          {data.certifications.map((e) => (
            <Block key={e.id} title={e.name} sub={e.issuer} date={e.year} />
          ))}
        </div>
      );
    if (k === "skills")
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
          {data.skills.map((s) => (
            <div key={s.id} style={{ background: block, padding: "8px 10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ink }}>{s.name}</div>
              <div style={{ height: 4, background: edge, marginTop: 6, borderRadius: 2 }}>
                <div style={{ width: `${s.level ?? 0}%`, height: "100%", background: primary, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      );
    if (k === "languages")
      return (
        <div style={{ display: "grid", gap: 6 }}>
          {data.languages.map((l) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", background: block, padding: "7px 10px", fontSize: 12 }}>
              <span style={{ fontWeight: 700, color: ink }}>{l.name}</span>
              <span style={{ color: primary, fontWeight: 600 }}>{levelWord(l.level)}</span>
            </div>
          ))}
        </div>
      );
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((i) => (
          <span key={i.id} style={{ fontSize: 12, fontWeight: 600, padding: "6px 11px", background: block, color: ink, borderRadius: 4 }}>{i.name}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "manrope"), color: ink, background: page, padding: "30px 38px 26px", boxSizing: "border-box" })}>
      {/* Header panel: the one "open" title item */}
      <header style={{ background: "#fff", boxShadow: `0 4px 0 ${edge}`, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 24px 16px", borderTop: `6px solid ${primary}` }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: display, fontSize: 38, fontWeight: 800, letterSpacing: -0.5, color: ink, lineHeight: 1.05 }}>{p.name}</h1>
            {p.title && <div style={{ fontSize: 14, fontWeight: 700, color: primary, marginTop: 6 }}>{p.title}</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 46 - i * 12, height: 6, borderRadius: 3, background: i ? edge : accent }} />
            ))}
          </div>
        </div>
        {hasContact && (
          <div data-section="contact" style={{ padding: "11px 24px", background: block, borderTop: `1px solid ${edge}` }}>
            <ContactList p={p} inline fs={11.5} iconColor={primary} color={ink} />
          </div>
        )}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoFlow: "row dense", gap: 13 }}>
        {keys.map((k, i) => (
          <section
            key={k}
            data-section={k}
            style={{ gridColumn: HALF.includes(k) ? "auto" : "1 / -1", background: "#fff", boxShadow: `0 4px 0 ${edge}, 0 8px 0 -3px ${mix(edge, page, 0.4)}`, alignSelf: "stretch", breakInside: "avoid" }}
          >
            <Bar k={k} n={i + 1} />
            <div style={{ padding: "11px 12px 12px" }}>{body(k)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
