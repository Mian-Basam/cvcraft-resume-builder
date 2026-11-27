// The Editorial Timeline: a career told as a feature article with kicker, headline, standfirst and byline, a year rail with datelined chapters, pull quotes lifted from the bullets and a closing fact file.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, levelWord, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const STORY = ["experience", "education", "projects"];
const FACTS = ["skills", "languages", "certifications", "interests"];
const RAIL = 74;

const yearOf = (v) => (v || "").match(/(19|20)\d\d/)?.[0] || v || "";
const sentence = (t) => (/[.!?]$/.test(t) ? t : `${t}.`);
// The bullet most worth quoting: one with a figure, else the first.
const quotable = (items) => items.find((b) => /\d/.test(b)) || items[0];

export default function EditorialTimeline({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const ink = "#1e1c19";
  const body = "#3f3b35";
  const muted = "#857e73";
  const hair = "#d8d0c2";
  const paper = "#faf7f1";
  const railColor = mix(primary, paper, 0.55);
  const serif = fontStack("playfair");
  const text = fontOf(theme, "merriweather");
  const contacts = contactItems(p);
  const caps = { fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" };

  const Kicker = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, ...caps, color: primary, marginBottom: 12, marginLeft: RAIL }}>
      {children}
      <span style={{ flex: 1, height: 1, background: hair }} />
    </div>
  );

  // One chapter on the year rail.
  const Chapter = ({ year, last, children }) => (
    <div style={{ display: "grid", gridTemplateColumns: `${RAIL}px 1fr`, breakInside: "avoid" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        {year ? (
          <span style={{ display: "inline-block", fontFamily: serif, fontSize: 24, fontWeight: 700, lineHeight: 1, color: primary, background: paper, padding: "2px 0 6px" }}>{year}</span>
        ) : (
          <span style={{ display: "block", width: 11, height: 11, borderRadius: "50%", border: `2px solid ${primary}`, background: paper, marginLeft: 16, marginTop: 5, boxSizing: "border-box" }} />
        )}
      </div>
      <div style={{ paddingBottom: last ? 4 : 24 }}>{children}</div>
    </div>
  );

  const PullQuote = ({ children }) => (
    <div style={{ margin: "18px 24px 6px", padding: "16px 0", borderTop: `3px solid ${primary}`, borderBottom: `1px solid ${primary}`, textAlign: "center" }}>
      <div style={{ fontFamily: serif, fontSize: 22, fontStyle: "italic", lineHeight: 1.35, color: ink, textWrap: "balance" }}>“{children}”</div>
    </div>
  );

  const Dateline = ({ place, date }) =>
    (place || date) && (
      <span style={{ ...caps, fontSize: 10.5, letterSpacing: 1.2, color: ink }}>
        {[place, date].filter(Boolean).join(", ")} —{" "}
      </span>
    );

  const story = {
    experience: () =>
      data.experience.map((e, i, all) => {
        const items = lines(e.bullets);
        return (
          <Chapter key={e.id} year={yearOf(e.start)} last={i === all.length - 1}>
            <div style={{ fontFamily: serif, fontSize: 21, fontWeight: 700, lineHeight: 1.2, color: ink }}>
              {e.role}
              {e.company && <span style={{ fontWeight: 400, fontStyle: "italic", color: muted }}>{` at ${e.company}`}</span>}
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 11.5, lineHeight: 1.8, color: body, textAlign: "justify" }}>
              <Dateline place={e.location} date={dateRange(e.start, e.end)} />
              {items.map(sentence).join(" ")}
            </p>
            {i % 2 === 0 && items.length > 0 && <PullQuote>{quotable(items)}</PullQuote>}
          </Chapter>
        );
      }),
    education: () =>
      data.education.map((e, i, all) => (
        <Chapter key={e.id} year={yearOf(e.start)} last={i === all.length - 1}>
          <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: ink }}>
            {e.degree}
            {e.school && <span style={{ fontWeight: 400, fontStyle: "italic", color: muted }}>{`, ${e.school}`}</span>}
          </div>
          <p style={{ margin: "5px 0 0", fontSize: 11.5, lineHeight: 1.75, color: body }}>
            <Dateline place="" date={dateRange(e.start, e.end)} />
            {e.grade ? sentence(e.grade) : ""}
          </p>
        </Chapter>
      )),
    projects: () =>
      data.projects.map((e, i, all) => (
        <Chapter key={e.id} year="" last={i === all.length - 1}>
          <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: ink }}>{e.name}</div>
          <p style={{ margin: "5px 0 0", fontSize: 11.5, lineHeight: 1.75, color: body }}>
            {e.link && <span style={{ ...caps, fontSize: 10.5, letterSpacing: 1.2, color: ink }}>{e.link} — </span>}
            {lines(e.description).map(sentence).join(" ")}
          </p>
        </Chapter>
      )),
  };
  const storyTitles = { experience: "The Career", education: "The Education", projects: "The Work" };

  const facts = {
    skills: () => data.skills.map((s) => s.name).join(", "),
    languages: () => data.languages.map((l) => `${l.name} (${levelWord(l.level)})`).join(", "),
    certifications: () => data.certifications.map((c) => [c.name, [c.issuer, c.year].filter(Boolean).join(" ")].filter(Boolean).join(", ")).join("; "),
    interests: () => data.interests.map((i) => i.name).join(", "),
  };
  const factKeys = pick(data, FACTS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: text, color: ink, background: paper, padding: "44px 60px 40px", boxSizing: "border-box" })}>
      {/* Headline block */}
      <header style={{ marginLeft: RAIL }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, ...caps, color: primary }}>
          <span style={{ background: primary, color: paper, padding: "3px 8px" }}>Feature</span>
          <span>{p.title ? `Profile of a ${p.title}` : "Career Profile"}</span>
        </div>
        <h1 style={{ margin: "14px 0 0", fontFamily: serif, fontSize: 64, fontWeight: 800, lineHeight: 1, letterSpacing: -1, color: ink }}>{p.name}</h1>
      </header>

      {pick(data, ["summary"]).map((k) => (
        <section key={k} data-section={k} style={{ marginLeft: RAIL, marginTop: 14 }}>
          <p style={{ margin: 0, fontFamily: serif, fontSize: 19.5, fontStyle: "italic", lineHeight: 1.45, color: body }}>{p.summary}</p>
        </section>
      ))}

      {contacts.length > 0 && (
        <div data-section="contact" style={{ marginLeft: RAIL, marginTop: 16, padding: "8px 0", borderTop: `1px solid ${ink}`, borderBottom: `1px solid ${hair}`, display: "flex", flexWrap: "wrap", gap: "2px 0", fontSize: 10.5, color: muted }}>
          <span style={{ fontWeight: 700, color: ink, marginRight: 14 }}>By {p.name}</span>
          {contacts.map((c) => (
            <span key={c.icon} style={{ marginRight: 14 }}>
              <span style={{ color: primary, marginRight: 6 }}>|</span>
              {c.value}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 28, position: "relative" }}>
        <span style={{ position: "absolute", left: 21, top: 30, bottom: 26, width: 1.5, background: railColor }} />
        {pick(data, STORY).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 18 }}>
            <Kicker>{storyTitles[k]}</Kicker>
            {story[k]()}
          </section>
        ))}
      </div>

      {/* Fact file box-out */}
      {factKeys.length > 0 && (
        <div style={{ marginLeft: RAIL, marginTop: 10, border: `1px solid ${ink}`, background: mix(primary, paper, 0.94) }}>
          <div style={{ ...caps, color: paper, background: ink, padding: "5px 12px" }}>Fact File</div>
          <div style={{ padding: "4px 16px 6px" }}>
            {factKeys.map((k, i) => (
              <section key={k} data-section={k} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 14, padding: "10px 0", borderTop: i ? `1px solid ${hair}` : "none" }}>
                <div style={{ ...caps, fontSize: 10, color: primary, paddingTop: 2 }}>{SECTION_META[k].title}</div>
                <div style={{ fontSize: 11.2, lineHeight: 1.6, color: body }}>{facts[k]()}</div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
