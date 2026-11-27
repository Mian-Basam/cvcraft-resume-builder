// Timeline Split CV: a centred spine with year medallions — work on the left, studies, projects and certificates on the right, alternating by date.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const SPINE = ["experience", "education", "projects", "certifications"];
const BOTTOM = ["skills", "languages", "interests"];

function yearOf(v, now) {
  const m = String(v || "").match(/\d{4}/);
  if (m) return Number(m[0]);
  if (/present|now|current|today/i.test(String(v || ""))) return now;
  return null;
}

export default function TimelineSplitCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.12);
  const muted = mix(ink, "#ffffff", 0.45);
  const pale = mix(primary, "#ffffff", 0.92);
  const accentPale = mix(accent, "#ffffff", 0.78);
  const accentInk = mix(accent, dark, 0.78);
  const display = fontStack("raleway");
  const now = new Date().getFullYear();

  const spineKeys = pick(data, SPINE);
  const bottom = pick(data, BOTTOM);
  const hasContact = Boolean(p.email || p.phone || p.address || p.website);
  const showSummary = pick(data, ["summary"]).length > 0;

  const items = [];
  spineKeys.forEach((k) => {
    if (k === "experience")
      data.experience.forEach((e) =>
        items.push({ k, id: e.id, side: "L", y: yearOf(e.start, now) ?? yearOf(e.end, now), date: dateRange(e.start, e.end), t: e.role, s: [e.company, e.location].filter(Boolean).join(", "), b: lines(e.bullets) })
      );
    if (k === "education")
      data.education.forEach((e) =>
        items.push({ k, id: e.id, side: "R", y: yearOf(e.start, now) ?? yearOf(e.end, now), date: dateRange(e.start, e.end), t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" · "), b: [] })
      );
    if (k === "projects")
      data.projects.forEach((e) => items.push({ k, id: e.id, side: "R", y: null, date: "", t: e.name, s: e.link, b: lines(e.description) }));
    if (k === "certifications")
      data.certifications.forEach((e) => items.push({ k, id: e.id, side: "R", y: yearOf(e.year, now), date: e.year, t: e.name, s: e.issuer, b: [] }));
  });
  items.forEach((it, i) => (it.i = i));
  items.sort((a, b) => (b.y ?? -1) - (a.y ?? -1) || a.i - b.i);

  const Card = ({ it }) => {
    const L = it.side === "L";
    return (
      <div data-section={it.k} style={{ position: "relative", background: L ? pale : accentPale, padding: "12px 16px", textAlign: L ? "right" : "left", borderRight: L ? `4px solid ${primary}` : "none", borderLeft: L ? "none" : `4px solid ${accent}`, breakInside: "avoid" }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: L ? primary : accentInk, display: "flex", gap: 6, justifyContent: L ? "flex-end" : "flex-start", alignItems: "center" }}>
          {!L && <Icon name={SECTION_META[it.k].icon} size={12} color={accentInk} />}
          {[SECTION_META[it.k].title.replace(/s$/, ""), it.date].filter(Boolean).join("  ·  ")}
          {L && <Icon name="experience" size={12} color={primary} />}
        </div>
        <div style={{ fontFamily: display, fontSize: 15, fontWeight: 800, color: ink, marginTop: 5, lineHeight: 1.25 }}>{it.t}</div>
        {it.s && <div style={{ fontSize: 11.5, fontWeight: 600, color: muted, marginTop: 2, wordBreak: "break-word" }}>{it.s}</div>}
        {it.b.map((b, j) => (
          <div key={j} style={{ fontSize: 12, lineHeight: 1.55, color: ink, marginTop: 5 }}>{b}</div>
        ))}
      </div>
    );
  };

  const Medal = ({ it }) =>
    it.y != null ? (
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: it.side === "L" ? primary : accent, color: it.side === "L" ? "#fff" : accentInk, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 13, fontWeight: 800, boxShadow: `0 0 0 5px #fff` }}>
        {it.y}
      </div>
    ) : (
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", border: `4px solid ${it.side === "L" ? primary : accent}`, marginTop: 15 }} />
    );

  const bottomBody = (k) => {
    if (k === "skills")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.skills.map((s) => (
            <span key={s.id} style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 10px", background: pale, color: primary, borderRadius: 4 }}>{s.name}</span>
          ))}
        </div>
      );
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: ink }}>
          <span style={{ fontWeight: 700 }}>{l.name}</span>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((i) => (
          <span key={i.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, padding: "4px 10px", border: `1px solid ${mix(accent, dark, 0.2)}`, borderRadius: 999, color: ink }}>{i.name}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "nunito"), color: ink, padding: "38px 46px 30px", boxSizing: "border-box" })}>
      <header style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: display, fontSize: 44, fontWeight: 800, letterSpacing: 1, color: ink, lineHeight: 1 }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: primary, marginTop: 10 }}>{p.title}</div>}
        {hasContact && (
          <div data-section="contact" style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <ContactList p={p} inline fs={11.5} iconColor={primary} color={ink} />
          </div>
        )}
      </header>
      {showSummary && (
        <section data-section="summary" style={{ margin: "18px auto 0", maxWidth: 600, textAlign: "center", fontSize: 13, lineHeight: 1.7, color: ink, borderTop: `1px solid ${mix(primary, "#ffffff", 0.75)}`, borderBottom: `1px solid ${mix(primary, "#ffffff", 0.75)}`, padding: "14px 10px" }}>
          {p.summary}
        </section>
      )}

      {items.length > 0 && (
        <div style={{ position: "relative", marginTop: 26 }}>
          <div style={{ position: "absolute", left: "50%", top: 10, bottom: 0, width: 3, marginLeft: -1.5, background: `linear-gradient(180deg, ${primary}, ${accent})` }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", alignItems: "center", marginBottom: 14, position: "relative" }}>
            <div style={{ textAlign: "right", fontFamily: display, fontSize: 13, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: primary }}>Work</div>
            <div style={{ justifySelf: "center", width: 14, height: 14, borderRadius: "50%", background: ink }} />
            <div style={{ fontFamily: display, fontSize: 13, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: accentInk }}>Study & Making</div>
          </div>
          {items.map((it, n) => (
            <div key={it.k + it.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", alignItems: "start", marginBottom: 14, marginTop: n && items[n - 1].side !== it.side ? -26 : 0, position: "relative" }}>
              <div>{it.side === "L" && <Card it={it} />}</div>
              <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                <span style={{ position: "absolute", top: 23, height: 2, width: 40, background: it.side === "L" ? primary : accent, [it.side === "L" ? "right" : "left"]: 40 }} />
                <div style={{ position: "relative" }}>
                  <Medal it={it} />
                </div>
              </div>
              <div>{it.side === "R" && <Card it={it} />}</div>
            </div>
          ))}
        </div>
      )}

      {bottom.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: bottom.map((k) => (k === "skills" ? "1.5fr" : "1fr")).join(" "), gap: 30, marginTop: 18, paddingTop: 18, borderTop: `3px solid ${ink}` }}>
          {bottom.map((k) => (
            <section key={k} data-section={k}>
              <div style={{ fontFamily: display, fontSize: 13, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: ink, marginBottom: 10 }}>{SECTION_META[k].title}</div>
              {bottomBody(k)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
