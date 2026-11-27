// The Maison Resume: magazine-cover single column with an oversized light serif name, a pull-quote profile, numbered features and generous whitespace.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const PAIR_KEYS = ["education", "projects"];
const SHORT_KEYS = ["skills", "languages", "certifications", "interests"];

export default function MaisonResume({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const accent = theme.accent;
  const ink = "#1f1f1f";
  const muted = "#7b7b7b";
  const hair = "#dedbd6";
  const serif = fontStack("cormorant");
  const sans = fontOf(theme, "montserrat");
  const contacts = contactItems(p);
  const [first, ...rest] = (p.name || "").split(/\s+/).filter(Boolean);

  // Running feature numbers in the order sections appear.
  const order = [...pick(data, ["experience"]), ...pick(data, PAIR_KEYS), ...pick(data, SHORT_KEYS)];
  const num = (k) => String(order.indexOf(k) + 1).padStart(2, "0");

  const Kicker = ({ k, stack }) =>
    stack ? (
      <div style={{ marginBottom: 14, paddingTop: 12, borderTop: `1px solid ${hair}` }}>
        <div style={{ fontFamily: serif, fontSize: 26, fontStyle: "italic", color: primary, lineHeight: 1 }}>{num(k)}</div>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: ink, marginTop: 6 }}>{SECTION_META[k].title}</div>
      </div>
    ) : (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
      <span style={{ fontFamily: serif, fontSize: 26, fontStyle: "italic", color: primary, lineHeight: 1 }}>{num(k)}</span>
      <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 4.5, textTransform: "uppercase", color: ink }}>{SECTION_META[k].title}</span>
      <span style={{ flex: 1, height: 1, background: hair, alignSelf: "center" }} />
    </div>
  );

  const Bullets = ({ items }) =>
    items.length ? (
      <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0 }}>
        {items.map((b, i) => (
          <li key={i} style={{ fontSize: 11, lineHeight: 1.65, color: "#3a3a3a", marginBottom: 4, paddingLeft: 14, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 8, width: 6, height: 1, background: primary }} />
            {b}
          </li>
        ))}
      </ul>
    ) : null;

  const Feature = ({ date, title, sub, extra, bullets = [] }) => (
    <div style={{ breakInside: "avoid" }}>
      {date && <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: primary, marginBottom: 6 }}>{date}</div>}
      <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, lineHeight: 1.15, color: ink }}>{title}</div>
      {sub && <div style={{ fontFamily: serif, fontSize: 15.5, fontStyle: "italic", color: muted, marginTop: 3 }}>{sub}</div>}
      {extra && <div style={{ fontSize: 10.8, color: muted, marginTop: 4 }}>{extra}</div>}
      <Bullets items={bullets} />
    </div>
  );

  const pairBody = (k) =>
    k === "education"
      ? data.education.map((e) => (
          <div key={e.id} style={{ marginBottom: 16 }}>
            <Feature date={dateRange(e.start, e.end)} title={e.degree} sub={e.school} extra={e.grade} />
          </div>
        ))
      : data.projects.map((e) => (
          <div key={e.id} style={{ marginBottom: 16 }}>
            <Feature title={e.name} sub={e.link} bullets={lines(e.description)} />
          </div>
        ));

  const shortBody = (k) => {
    const row = { fontSize: 11, lineHeight: 1.5, color: "#3a3a3a", marginBottom: 5 };
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: serif, fontSize: 16, lineHeight: 1.2, color: ink }}>{c.name}</div>
          <div style={{ ...row, color: muted, marginTop: 2 }}>{[c.issuer, c.year].filter(Boolean).join(", ")}</div>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={row}>
          {l.name}
          {l.level != null && <span style={{ color: muted }}>{`  ·  ${l.level >= 90 ? "Native" : l.level >= 70 ? "Fluent" : l.level >= 45 ? "Professional" : "Basic"}`}</span>}
        </div>
      ));
    return data[k].map((s) => <div key={s.id} style={row}>{s.name}</div>);
  };

  const pairKeys = pick(data, PAIR_KEYS);
  const shortKeys = pick(data, SHORT_KEYS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: sans, color: ink, background: "#fffdfa", padding: "52px 84px 50px", boxSizing: "border-box", display: "flex", flexDirection: "column" })}>
      {/* Cover line */}
      <div data-section="contact" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px 18px", paddingBottom: 10, borderBottom: `1px solid ${ink}`, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#4a4a4a" }}>
        {contacts.map((c) => (
          <span key={c.icon}>{c.value}</span>
        ))}
      </div>

      {/* Cover name */}
      <header style={{ padding: "40px 0 30px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 30 }}>
        <h1 style={{ margin: 0, fontFamily: serif, fontWeight: 300, fontSize: 84, lineHeight: 0.92, letterSpacing: -1, color: ink }}>
          {first}
          {rest.length > 0 && (
            <>
              <br />
              <span style={{ fontStyle: "italic", color: primary, paddingLeft: 64 }}>{rest.join(" ")}</span>
            </>
          )}
        </h1>
        {p.title && (
          <div style={{ textAlign: "right", paddingBottom: 10, flexShrink: 0, maxWidth: 200 }}>
            <div style={{ width: 34, height: 2, background: accent, marginLeft: "auto", marginBottom: 12 }} />
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", lineHeight: 1.7, color: ink }}>{p.title}</div>
          </div>
        )}
      </header>

      {/* Pull-quote profile */}
      {pick(data, ["summary"]).map((k) => (
        <section key={k} data-section={k} style={{ display: "flex", gap: 22, margin: "0 0 38px 0", paddingTop: 28, borderTop: `1px solid ${hair}` }}>
          <span style={{ fontFamily: serif, fontSize: 92, lineHeight: 0.7, color: accent === "#ffffff" ? primary : mix(accent, primary, 0.25), flexShrink: 0, width: 46 }}>“</span>
          <p style={{ margin: 0, fontFamily: serif, fontSize: 21, fontStyle: "italic", fontWeight: 400, lineHeight: 1.45, color: "#2c2c2c" }}>{p.summary}</p>
        </section>
      ))}

      {pick(data, ["experience"]).map((k) => (
        <section key={k} data-section={k} style={{ marginBottom: 40 }}>
          <Kicker k={k} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px 48px" }}>
            {data.experience.map((e) => (
              <Feature key={e.id} date={dateRange(e.start, e.end)} title={e.role} sub={[e.company, e.location].filter(Boolean).join(", ")} bullets={lines(e.bullets)} />
            ))}
          </div>
        </section>
      ))}

      {pairKeys.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${pairKeys.length}, 1fr)`, gap: 48, marginBottom: 26 }}>
          {pairKeys.map((k) => (
            <section key={k} data-section={k}>
              <Kicker k={k} />
              {pairBody(k)}
            </section>
          ))}
        </div>
      )}

      {shortKeys.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${shortKeys.length}, 1fr)`, gap: "26px 26px" }}>
          {shortKeys.map((k) => (
            <section key={k} data-section={k}>
              <Kicker k={k} stack />
              {shortBody(k)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
