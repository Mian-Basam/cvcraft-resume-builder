// The Vogue Resume: fashion-magazine page with a centred oversized Didone-style name, italic dateline experience blocks and a slim style-notes column.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, levelWord, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN = ["summary", "experience", "projects"];
const SIDE = ["education", "skills", "languages", "certifications", "interests"];

export default function VogueResume({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const ink = "#141414";
  const body = "#3b3b3b";
  const muted = "#8a8580";
  const hair = "#e4e0da";
  const bar = mix(theme.accent, primary, 0.35);
  const serif = fontStack("playfair");
  const sans = fontOf(theme, "montserrat");
  const name = (p.name || "").trim();
  const nameSize = Math.max(30, Math.min(112, 690 / Math.max(1, name.length * 0.74)));
  const contacts = contactItems(p);

  const Label = ({ children, center }) => (
    <div style={{ marginBottom: 14, textAlign: center ? "center" : "left" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 3.5, textTransform: "uppercase", color: ink }}>{children}</div>
      <div style={{ width: 26, height: 2, background: bar, marginTop: 7, marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }} />
    </div>
  );

  const Bullets = ({ items }) =>
    items.length > 0 && (
      <div style={{ marginTop: 9 }}>
        {items.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 10, fontSize: 11.5, lineHeight: 1.65, color: body, marginBottom: 5 }}>
            <span style={{ width: 4, height: 4, background: primary, transform: "rotate(45deg)", marginTop: 7, flexShrink: 0 }} />
            <span>{b}</span>
          </div>
        ))}
      </div>
    );

  // Experience and projects: italic dateline on the left, the story on the right.
  const Block = ({ date, title, sub, items, first }) => (
    <div style={{ display: "grid", gridTemplateColumns: "92px 1fr", gap: 18, padding: "20px 0 18px", borderTop: first ? "none" : `1px solid ${hair}`, breakInside: "avoid" }}>
      <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 15, lineHeight: 1.25, color: primary, paddingTop: 4 }}>
        {(date || "").split(" – ").map((d, i, a) => (
          <div key={i}>{d}{i < a.length - 1 ? " —" : ""}</div>
        ))}
      </div>
      <div>
        <div style={{ fontFamily: serif, fontSize: 25, fontStyle: "italic", lineHeight: 1.15, color: ink }}>{title}</div>
        {sub && <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: muted, marginTop: 6 }}>{sub}</div>}
        <Bullets items={items} />
      </div>
    </div>
  );

  const main = {
    summary: () => (
      <p style={{ margin: 0, fontFamily: serif, fontSize: 19.5, lineHeight: 1.55, color: ink }}>
        <span style={{ fontStyle: "italic", color: primary }}>{p.title ? `${p.title}. ` : ""}</span>
        {p.summary}
      </p>
    ),
    experience: () =>
      data.experience.map((e, i) => (
        <Block key={e.id} first={i === 0} date={dateRange(e.start, e.end)} title={e.role} sub={[e.company, e.location].filter(Boolean).join(" · ")} items={lines(e.bullets)} />
      )),
    projects: () =>
      data.projects.map((e, i) => (
        <Block key={e.id} first={i === 0} date="" title={e.name} sub={e.link} items={lines(e.description)} />
      )),
  };

  const row = { fontSize: 11.2, lineHeight: 1.5, color: body };
  const side = {
    education: () =>
      data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: serif, fontSize: 16, lineHeight: 1.25, color: ink }}>{e.degree}</div>
          <div style={{ ...row, fontStyle: "italic", marginTop: 3 }}>{e.school}</div>
          <div style={{ fontSize: 10.5, color: muted, letterSpacing: 1, marginTop: 2 }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join("  ·  ")}</div>
        </div>
      )),
    skills: () =>
      data.skills.map((s) => (
        <div key={s.id} style={{ ...row, padding: "6px 0", borderBottom: `1px solid ${hair}` }}>{s.name}</div>
      )),
    languages: () =>
      data.languages.map((l) => (
        <div key={l.id} style={{ ...row, display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span>{l.name}</span>
          <span style={{ fontFamily: serif, fontStyle: "italic", color: primary }}>{levelWord(l.level)}</span>
        </div>
      )),
    certifications: () =>
      data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: serif, fontSize: 15, lineHeight: 1.25, color: ink }}>{c.name}</div>
          <div style={{ fontSize: 10.5, color: muted, letterSpacing: 1, marginTop: 3 }}>{[c.issuer, c.year].filter(Boolean).join(", ")}</div>
        </div>
      )),
    interests: () => <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 15, lineHeight: 1.55, color: ink }}>{data.interests.map((i) => i.name).join(", ")}</div>,
  };

  const mainKeys = pick(data, MAIN);
  const sideKeys = pick(data, SIDE);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: sans, color: ink, background: "#fff", padding: "40px 52px 40px", boxSizing: "border-box" })}>
      {/* Folio line */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: muted, paddingBottom: 10 }}>
        <span>{p.address || "Portfolio"}</span>
        <span style={{ color: primary, fontWeight: 600 }}>Curriculum Vitae</span>
        <span>{p.title || ""}</span>
      </div>

      {/* Oversized name */}
      <h1 style={{ margin: 0, textAlign: "center", fontFamily: serif, fontWeight: 700, fontSize: nameSize, lineHeight: 1, letterSpacing: -1.5, textTransform: "uppercase", color: ink, padding: "6px 0 10px", borderTop: `1px solid ${ink}`, borderBottom: `4px double ${ink}`, whiteSpace: "nowrap" }}>
        {name}
      </h1>

      {/* Contact strip */}
      {contacts.length > 0 && (
        <div data-section="contact" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 0", padding: "11px 0", fontSize: 10.5, letterSpacing: 1.6, textTransform: "uppercase", color: body, borderBottom: `1px solid ${hair}` }}>
          {contacts.map((c, i) => (
            <span key={c.icon}>
              {i > 0 && <span style={{ color: bar, margin: "0 14px" }}>◆</span>}
              {c.value}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 40, marginTop: 34 }}>
        <div>
          {mainKeys.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: k === "summary" ? 36 : 26 }}>
              {k !== "summary" && <Label>{k === "projects" ? "Selected Work" : SECTION_META[k].title}</Label>}
              {main[k]()}
            </section>
          ))}
        </div>
        <aside style={{ borderLeft: `1px solid ${hair}`, paddingLeft: 26 }}>
          {sideKeys.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 32 }}>
              <Label>{SECTION_META[k].title}</Label>
              {side[k]()}
            </section>
          ))}
        </aside>
      </div>

      {/* Closing rule with a centred ornament */}
      <div style={{ position: "absolute", left: 52, right: 52, bottom: 30, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ flex: 1, height: 1, background: ink }} />
        <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 13, color: primary }}>{name}</span>
        <span style={{ flex: 1, height: 1, background: ink }} />
      </div>
    </div>
  );
}
