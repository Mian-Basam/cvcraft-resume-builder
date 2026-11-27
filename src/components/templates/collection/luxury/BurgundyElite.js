// The Burgundy Elite: cream editorial page with a newspaper-style masthead, drop-cap profile, burgundy section heads and a ruled column footer.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["experience", "education", "projects"];
const SHORT_KEYS = ["skills", "languages", "certifications", "interests"];

export default function BurgundyElite({ data, theme }) {
  const p = data.personal;
  const wine = theme.primary;
  const cream = mix("#f8f2e6", theme.accent, 0.04);
  const ink = "#2b2220";
  const muted = "#66574f";
  const hair = mix(wine, cream, 0.7);
  const display = fontStack("playfair");
  const serif = fontOf(theme, "cormorant");
  const contacts = contactItems(p);

  const DoubleRule = ({ thick = 3, gap = 3, color = wine, style }) => (
    <div style={{ borderTop: `${thick}px solid ${color}`, borderBottom: `1px solid ${color}`, height: gap, ...style }} />
  );

  const Head = ({ children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontFamily: display, fontSize: 14, fontWeight: 700, letterSpacing: 3.5, textTransform: "uppercase", color: wine }}>{children}</h2>
      </div>
      <div style={{ height: 1, background: wine, marginTop: 6 }} />
      <div style={{ height: 1, background: hair, marginTop: 2 }} />
    </div>
  );

  const Bullets = ({ items }) =>
    items.length ? (
      <ul style={{ listStyle: "none", margin: "6px 0 0", padding: 0 }}>
        {items.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5, color: ink, marginBottom: 2 }}>
            <span style={{ color: wine, flexShrink: 0 }}>—</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    ) : null;

  const Entry = ({ title, sub, date, extra, bullets = [], last }) => (
    <div style={{ marginBottom: last ? 0 : 18, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontFamily: display, fontSize: 15.5, fontWeight: 700, color: ink }}>{title}</div>
        {date && <div style={{ fontFamily: display, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: wine, whiteSpace: "nowrap" }}>{date}</div>}
      </div>
      {sub && <div style={{ fontSize: 15, fontStyle: "italic", color: muted, marginTop: 1 }}>{sub}</div>}
      {extra && <div style={{ fontSize: 13.5, color: muted }}>{extra}</div>}
      <Bullets items={bullets} />
    </div>
  );

  const mainBody = (k) => {
    const last = (i, a) => i === a.length - 1;
    if (k === "experience")
      return data.experience.map((e, i, a) => (
        <Entry key={e.id} last={last(i, a)} title={e.role} sub={[e.company, e.location].filter(Boolean).join(", ")} date={dateRange(e.start, e.end)} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e, i, a) => <Entry key={e.id} last={last(i, a)} title={e.degree} sub={e.school} date={dateRange(e.start, e.end)} extra={e.grade} />);
    return data.projects.map((e, i, a) => <Entry key={e.id} last={last(i, a)} title={e.name} sub={e.link} bullets={lines(e.description)} />);
  };

  const shortBody = (k) => {
    const row = { fontSize: 14, lineHeight: 1.45, color: ink, marginBottom: 4 };
    if (k === "skills" || k === "interests") return data[k].map((s) => <div key={s.id} style={row}>{s.name}</div>);
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ ...row, display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span>{l.name}</span>
          <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < Math.round(((l.level ?? 0) / 100) * 5) ? wine : hair }} />
            ))}
          </span>
        </div>
      ));
    return data.certifications.map((c) => (
      <div key={c.id} style={{ ...row, marginBottom: 8 }}>
        <div style={{ fontWeight: 700 }}>{c.name}</div>
        <div style={{ fontStyle: "italic", color: muted }}>{[c.issuer, c.year].filter(Boolean).join(", ")}</div>
      </div>
    ));
  };

  const shortKeys = pick(data, SHORT_KEYS);
  const initial = (p.summary || "").trim().charAt(0);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: serif, color: ink, background: cream, padding: "50px 62px 48px", boxSizing: "border-box", display: "flex", flexDirection: "column" })}>
      {/* Masthead */}
      <header style={{ textAlign: "center" }}>
        <DoubleRule />
        <h1 style={{ margin: "18px 0 6px", fontFamily: display, fontSize: 50, fontWeight: 700, letterSpacing: 1, lineHeight: 1.05, color: ink }}>{p.name}</h1>
        {p.title && <div style={{ fontSize: 17, fontStyle: "italic", color: wine, marginBottom: 14 }}>{p.title}</div>}
        <div data-section="contact" style={{ borderTop: `1px solid ${ink}`, borderBottom: `1px solid ${ink}`, padding: "7px 0", display: "flex", justifyContent: "center", flexWrap: "wrap", fontFamily: display, fontSize: 10.5, letterSpacing: 1.8, textTransform: "uppercase", color: ink }}>
          {contacts.map((c, i) => (
            <span key={c.icon}>
              {i > 0 && <span style={{ margin: "0 12px", color: wine }}>✦</span>}
              {c.value}
            </span>
          ))}
        </div>
      </header>

      {/* Profile with drop cap */}
      {pick(data, ["summary"]).map((k) => (
        <section key={k} data-section={k} style={{ margin: "26px 0 28px" }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: ink, textAlign: "justify" }}>
            <span style={{ float: "left", fontFamily: display, fontSize: 56, lineHeight: 0.85, fontWeight: 700, color: wine, margin: "6px 10px 0 0" }}>{initial}</span>
            {(p.summary || "").trim().slice(1)}
          </p>
        </section>
      ))}

      {pick(data, MAIN_KEYS).map((k) => (
        <section key={k} data-section={k} style={{ marginBottom: 26 }}>
          <Head>{SECTION_META[k].title}</Head>
          {mainBody(k)}
        </section>
      ))}

      {/* Ruled columns for the short sections */}
      {shortKeys.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${shortKeys.length}, 1fr)`, marginTop: 4 }}>
          {shortKeys.map((k, i) => (
            <section key={k} data-section={k} style={{ padding: i === 0 ? "0 18px 0 0" : "0 18px", borderLeft: i === 0 ? "none" : `1px solid ${hair}` }}>
              <Head>{SECTION_META[k].title}</Head>
              {shortBody(k)}
            </section>
          ))}
        </div>
      )}

      <footer style={{ marginTop: "auto", paddingTop: 22 }}>
        <DoubleRule thick={1} gap={2} />
      </footer>
    </div>
  );
}
