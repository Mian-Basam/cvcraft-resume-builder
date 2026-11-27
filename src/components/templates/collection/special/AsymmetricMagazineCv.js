// Asymmetric Magazine CV: editorial spread — a narrow right-aligned sidebar against a wide column with oversized italic serif headings, a drop-cap lead and hanging dates.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";

const NARROW = ["skills", "languages", "certifications", "interests"];
const WIDE = ["summary", "experience", "education", "projects"];
const SIDE_W = 186;

export default function AsymmetricMagazineCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.1);
  const muted = mix(ink, "#ffffff", 0.45);
  const rule = mix(ink, "#ffffff", 0.78);
  const paper = mix(theme.light || "#f1f1f1", "#ffffff", 0.55);
  const serif = fontStack("playfair");
  const accentInk = mix(accent, dark, 0.5);

  const narrow = pick(data, NARROW);
  const wide = pick(data, WIDE);
  const hasContact = Boolean(p.email || p.phone || p.address || p.website);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const first = words[0] || "";
  const rest = words.slice(1).join(" ");

  const SideHead = ({ children }) => (
    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 2.6, textTransform: "uppercase", color: primary, paddingBottom: 6, marginBottom: 10, borderBottom: `2px solid ${ink}` }}>{children}</div>
  );

  const BigHead = ({ k, n }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 18 }}>
      <h2 style={{ margin: 0, fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: 52, lineHeight: 0.95, color: ink, letterSpacing: -1 }}>{SECTION_META[k].title}</h2>
      <span style={{ flex: 1, height: 1, background: rule, marginBottom: 8 }} />
      <span style={{ fontFamily: serif, fontSize: 15, color: accentInk, marginBottom: 2 }}>№ {n}</span>
    </div>
  );

  const sideBody = (k) => {
    if (k === "skills")
      return data.skills.map((s, i) => (
        <div key={s.id} style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 8, fontSize: 12, color: ink, padding: "5px 0", borderBottom: `1px dotted ${rule}` }}>
          <span style={{ fontWeight: 600 }}>{s.name}</span>
          <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 12, color: muted, width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ fontSize: 12, color: ink, marginBottom: 6 }}>
          <span style={{ fontWeight: 600 }}>{l.name}</span>
          <div style={{ fontFamily: serif, fontStyle: "italic", color: muted, fontSize: 12 }}>{levelWord(l.level)}</div>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ fontSize: 12, color: ink, marginBottom: 8, lineHeight: 1.35 }}>
          <div style={{ fontWeight: 600 }}>{c.name}</div>
          <div style={{ fontFamily: serif, fontStyle: "italic", color: muted }}>{[c.issuer, c.year].filter(Boolean).join(", ")}</div>
        </div>
      ));
    return (
      <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 13.5, lineHeight: 1.55, color: ink }}>
        {data.interests.map((i) => i.name).join(", ")}
      </div>
    );
  };

  const Item = ({ date, title, sub, bullets }) => (
    <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 18, marginBottom: 17, breakInside: "avoid" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: primary, paddingTop: 4, lineHeight: 1.4 }}>{date}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: serif, fontSize: 17.5, fontWeight: 700, color: ink, lineHeight: 1.2 }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: muted, marginTop: 4, wordBreak: "break-word" }}>{sub}</div>}
        {bullets.map((b, j) => (
          <p key={j} style={{ margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.6, color: ink, textIndent: j ? 0 : 0 }}>
            <span style={{ color: accentInk, fontWeight: 800, marginRight: 6 }}>—</span>
            {b}
          </p>
        ))}
      </div>
    </div>
  );

  const wideBody = (k) => {
    if (k === "summary") {
      const text = p.summary.trim();
      return (
        <p style={{ margin: 0, fontFamily: serif, fontSize: 17, lineHeight: 1.6, color: ink }}>
          <span style={{ float: "left", fontFamily: serif, fontWeight: 700, fontSize: 66, lineHeight: 0.82, color: primary, margin: "6px 10px 0 0" }}>{text[0]}</span>
          {text.slice(1)}
        </p>
      );
    }
    if (k === "experience")
      return data.experience.map((e) => (
        <Item key={e.id} date={dateRange(e.start, e.end)} title={e.role} sub={[e.company, e.location].filter(Boolean).join(" · ")} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => (
        <Item key={e.id} date={dateRange(e.start, e.end)} title={e.degree} sub={[e.school, e.grade].filter(Boolean).join(" · ")} bullets={[]} />
      ));
    return data.projects.map((e) => <Item key={e.id} date="Project" title={e.name} sub={e.link} bullets={lines(e.description)} />);
  };

  let n = 0;
  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "lato"), color: ink, background: paper, padding: "38px 48px 64px", boxSizing: "border-box" })}>
      {/* Masthead */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: muted, borderBottom: `1px solid ${ink}`, paddingBottom: 8 }}>
        <span>The Résumé Issue</span>
        <span>{p.title}</span>
      </div>
      <header style={{ display: "grid", gridTemplateColumns: `${SIDE_W}px 1fr`, gap: 40, padding: "26px 0 24px", borderBottom: `6px solid ${primary}` }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", textAlign: "right" }}>
          <span style={{ width: 62, height: 62, background: accent, borderRadius: "50%", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: 22, color: mix(accent, dark, 0.85) }}>CV</span>
          {p.title && <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 18, lineHeight: 1.25, color: primary }}>{p.title}</div>}
        </div>
        <h1 style={{ margin: 0, fontFamily: serif, fontWeight: 700, fontSize: 84, lineHeight: 0.9, letterSpacing: -2.5, color: ink }}>
          {first}
          {rest && (
            <>
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 400, color: primary }}>{rest}</span>
            </>
          )}
        </h1>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: `${SIDE_W}px 1fr`, gap: 40, paddingTop: 26 }}>
        <aside style={{ textAlign: "right", borderRight: `1px solid ${rule}`, paddingRight: 20, marginRight: -20 }}>
          {hasContact && (
            <section data-section="contact" style={{ marginBottom: 32 }}>
              <SideHead>Contact</SideHead>
              <ContactList p={p} fs={11.5} iconColor={primary} color={ink} gap={7} alignRight />
            </section>
          )}
          {narrow.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 32 }}>
              <SideHead>{SECTION_META[k].title}</SideHead>
              {sideBody(k)}
            </section>
          ))}
        </aside>
        <main style={{ minWidth: 0 }}>
          {wide.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: k === "summary" ? 30 : 20 }}>
              {k !== "summary" && <BigHead k={k} n={++n} />}
              {wideBody(k)}
            </section>
          ))}
        </main>
      </div>
      <footer style={{ position: "absolute", left: 48, right: 48, bottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: muted, borderTop: `1px solid ${ink}`, paddingTop: 8 }}>
        <span>{p.name}</span>
        <span style={{ fontFamily: serif, fontStyle: "italic", letterSpacing: 0.5, textTransform: "none", fontSize: 12 }}>Curriculum Vitae</span>
        <span>p. 01</span>
      </footer>
    </div>
  );
}
