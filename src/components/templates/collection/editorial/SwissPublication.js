// The Swiss Publication: International Typographic Style page on a strict six-column grid with column tick marks, colophon metadata, a two-weight name and large light section numerals.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, levelWord, pick } from "../../kit";

const MAIN = ["summary", "experience", "education", "projects"];
const SIDE = ["skills", "languages", "certifications", "interests"];
const M = 48; // page margin
const G = 18; // gutter
const COL = (794 - 2 * M - 5 * G) / 6;

export default function SwissPublication({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const ink = "#111111";
  const body = "#333333";
  const muted = "#808080";
  const rule = "#d6d6d6";
  const sans = fontOf(theme, "inter");
  const contacts = contactItems(p);
  const [first, ...rest] = (p.name || "").trim().split(/\s+/);
  const mainKeys = pick(data, MAIN);
  const sideKeys = pick(data, SIDE);
  const order = [...mainKeys, ...sideKeys];
  const num = (k) => order.indexOf(k) + 1;
  const meta = { fontSize: 10, lineHeight: 1.45, letterSpacing: 0.3, color: muted };
  const label = { fontSize: 10, fontWeight: 600, letterSpacing: 0.3, color: primary, marginBottom: 3 };
  const span = (n) => n * COL + (n - 1) * G;

  const Numeral = ({ k }) => (
    <span style={{ fontSize: 84, fontWeight: 200, lineHeight: 0.78, letterSpacing: -4, color: primary, display: "block" }}>{num(k)}</span>
  );
  const Title = ({ k }) => <span style={{ fontSize: 12, fontWeight: 700, color: ink }}>{SECTION_META[k].title}</span>;

  // Main column: numeral in grid column 1, title across columns 2-4; entries put their metadata in column 1.
  const MainHead = ({ k }) => (
    <div style={{ display: "grid", gridTemplateColumns: `${COL}px 1fr`, columnGap: G, alignItems: "end", paddingTop: 10, borderTop: `1px solid ${ink}`, marginBottom: 14 }}>
      <Numeral k={k} />
      <div style={{ borderBottom: `1px solid ${rule}`, paddingBottom: 4 }}><Title k={k} /></div>
    </div>
  );
  const Row = ({ left, children }) => (
    <div style={{ display: "grid", gridTemplateColumns: `${COL}px 1fr`, columnGap: G, marginBottom: 14, breakInside: "avoid" }}>
      <div style={{ ...meta, paddingTop: 2 }}>{left}</div>
      <div>{children}</div>
    </div>
  );
  const Bullets = ({ items }) =>
    items.length > 0 && (
      <div style={{ marginTop: 6 }}>
        {items.map((b, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "14px 1fr", fontSize: 11, lineHeight: 1.5, color: body, marginBottom: 3 }}>
            <span style={{ color: primary }}>–</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
    );

  const main = {
    summary: () => (
      <Row left={p.title}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 400, lineHeight: 1.45, color: ink, letterSpacing: -0.2 }}>{p.summary}</p>
      </Row>
    ),
    experience: () =>
      data.experience.map((e) => (
        <Row
          key={e.id}
          left={
            <>
              <div style={{ color: ink, fontWeight: 600 }}>{dateRange(e.start, e.end)}</div>
              {e.location && <div>{e.location}</div>}
            </>
          }
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: ink, lineHeight: 1.25 }}>{e.role}</div>
          {e.company && <div style={{ fontSize: 11, color: primary, fontWeight: 500, marginTop: 1 }}>{e.company}</div>}
          <Bullets items={lines(e.bullets)} />
        </Row>
      )),
    education: () =>
      data.education.map((e) => (
        <Row key={e.id} left={<div style={{ color: ink, fontWeight: 600 }}>{dateRange(e.start, e.end)}</div>}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ink, lineHeight: 1.25 }}>{e.degree}</div>
          <div style={{ fontSize: 11, color: primary, fontWeight: 500, marginTop: 1 }}>{[e.school, e.grade].filter(Boolean).join(" / ")}</div>
        </Row>
      )),
    projects: () =>
      data.projects.map((e, i) => (
        <Row key={e.id} left={<div style={{ color: ink, fontWeight: 600 }}>{`Project ${i + 1}`}</div>}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ink, lineHeight: 1.25 }}>{e.name}</div>
          {e.link && <div style={{ fontSize: 11, color: primary, fontWeight: 500, marginTop: 1 }}>{e.link}</div>}
          <Bullets items={lines(e.description)} />
        </Row>
      )),
  };

  const line = { fontSize: 11, lineHeight: 1.45, color: body };
  const pair = (l, r, key) => (
    <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr auto", columnGap: G, padding: "5px 0", borderBottom: `1px solid ${rule}`, ...line }}>
      <span style={{ color: ink }}>{l}</span>
      <span style={{ ...meta, alignSelf: "center" }}>{r}</span>
    </div>
  );
  const side = {
    skills: () => data.skills.map((s) => pair(s.name, `${s.level ?? 0}`, s.id)),
    languages: () => data.languages.map((l) => pair(l.name, levelWord(l.level), l.id)),
    certifications: () =>
      data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: ink, lineHeight: 1.3 }}>{c.name}</div>
          <div style={{ ...meta, marginTop: 1 }}>{[c.issuer, c.year].filter(Boolean).join(" / ")}</div>
        </div>
      )),
    interests: () => data.interests.map((i) => <div key={i.id} style={{ ...line, padding: "3px 0", borderBottom: `1px solid ${rule}` }}>{i.name}</div>),
  };

  // Tick marks at every column edge, top and bottom, show the grid without crossing the text.
  const edges = Array.from({ length: 6 }, (_, i) => [M + i * (COL + G), M + i * (COL + G) + COL]).flat();

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: sans, color: ink, background: "#fff", padding: `40px ${M}px 54px`, boxSizing: "border-box" })}>
      {edges.map((x, i) => (
        <span key={i} style={{ position: "absolute", left: x, top: 0, width: 1, height: 14, background: i % 2 ? rule : primary }} />
      ))}
      {edges.map((x, i) => (
        <span key={`b${i}`} style={{ position: "absolute", left: x, bottom: 0, width: 1, height: 14, background: i % 2 ? rule : primary }} />
      ))}

      {/* Colophon metadata on the grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(6, ${COL}px)`, columnGap: G, paddingBottom: 14 }}>
        <div style={{ gridColumn: "span 2" }}>
          <div style={label}>Curriculum Vitae</div>
          <div style={meta}>{p.title}</div>
        </div>
        <div data-section="contact" style={{ gridColumn: "span 4", display: "grid", gridTemplateColumns: `repeat(2, ${span(2)}px)`, columnGap: G }}>
          {contacts.length > 0 && (
            <>
              <div>
                <div style={label}>Contact</div>
                {contacts.filter((c) => c.icon === "phone" || c.icon === "mail").map((c) => <div key={c.icon} style={{ ...meta, color: body }}>{c.value}</div>)}
              </div>
              <div>
                <div style={label}>Location / Web</div>
                {contacts.filter((c) => c.icon === "pin" || c.icon === "globe").map((c) => <div key={c.icon} style={{ ...meta, color: body }}>{c.value}</div>)}
              </div>
            </>
          )}
        </div>
      </div>

      <h1 style={{ margin: 0, fontSize: 70, lineHeight: 0.95, letterSpacing: -3.5, color: ink, paddingBottom: 18, borderBottom: `7px solid ${primary}` }}>
        <span style={{ fontWeight: 700 }}>{first}</span>
        {rest.length > 0 && <span style={{ fontWeight: 200 }}> {rest.join(" ")}</span>}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: `${span(4)}px ${span(2)}px`, columnGap: G, marginTop: 26 }}>
        <div>
          {mainKeys.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 14 }}>
              <MainHead k={k} />
              {main[k]()}
            </section>
          ))}
        </div>
        <div>
          {sideKeys.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: `${COL}px 1fr`, columnGap: G, alignItems: "end", paddingTop: 10, borderTop: `1px solid ${ink}`, marginBottom: 10 }}>
                <Numeral k={k} />
                <div style={{ paddingBottom: 4 }}><Title k={k} /></div>
              </div>
              {side[k]()}
            </section>
          ))}
        </div>
      </div>

      {/* Footer metadata */}
      <div style={{ position: "absolute", left: M, right: M, bottom: 24, display: "grid", gridTemplateColumns: `repeat(6, ${COL}px)`, columnGap: G, ...meta }}>
        <span style={{ gridColumn: "span 2", color: ink }}>{p.name}</span>
        <span style={{ gridColumn: "span 2" }}>{p.title}</span>
        <span style={{ gridColumn: "span 2", textAlign: "right" }}>1 / 1</span>
      </div>
    </div>
  );
}
