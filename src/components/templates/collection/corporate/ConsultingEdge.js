// The Consulting Edge: single column on a hanging-label grid — each role leads with its headline outcome (numbers emphasised), followed by a compact role line and concise supporting bullets. ATS-friendly.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf, DEFAULT_KEYS } from "../../kit";

const TITLES = {
  summary: "Profile",
  experience: "Experience & Outcomes",
  education: "Education",
  projects: "Selected Engagements",
  skills: "Capabilities",
  languages: "Languages",
  certifications: "Credentials",
  interests: "Interests",
};

// Splits text so numbers (30%, $2.4M, 12, 3x) can be emphasised.
const NUM = /([$€£]?\d(?:[\d,]*\d)?(?:\.\d+)?(?:\s?%|x\b|\+|[kKmMbB]\b)?)/;
function Emph({ text, color }) {
  return text.split(NUM).map((s, i) =>
    i % 2 ? (
      <strong key={i} style={{ color, fontWeight: 800 }}>
        {s}
      </strong>
    ) : (
      s
    )
  );
}

function levelWord(l = 0) {
  if (l >= 95) return "Native";
  if (l >= 80) return "Fluent";
  if (l >= 60) return "Professional";
  if (l >= 40) return "Conversational";
  return "Basic";
}

export default function ConsultingEdge({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#161d2a";
  const text = "#2b3240";
  const muted = "#626b7b";
  const hair = "#dfe3e9";
  const tint = mix(primary, "#ffffff", 0.94);
  const fs = 11.5;

  const Meta = ({ left, right }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14 }}>
      <div style={{ fontSize: 11.5, color: ink, minWidth: 0 }}>{left}</div>
      {right && <div style={{ fontSize: 10.5, color: muted, whiteSpace: "nowrap", fontWeight: 600, letterSpacing: 0.6 }}>{right}</div>}
    </div>
  );

  const Dashes = ({ items }) =>
    items.length ? (
      <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0" }}>
        {items.map((t, i) => (
          <li key={i} style={{ display: "flex", gap: 9, fontSize: fs, lineHeight: 1.5, color: text, marginBottom: 2 }}>
            <span style={{ color: primary, fontWeight: 700, flexShrink: 0 }}>›</span>
            <span>
              <Emph text={t} color={primary} />
            </span>
          </li>
        ))}
      </ul>
    ) : null;

  const body = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, idx) => {
        const list = lines(e.bullets);
        const [head, ...rest] = list;
        return (
          <div key={e.id} style={{ marginBottom: 16, paddingTop: idx ? 14 : 0, borderTop: idx ? `1px dashed ${hair}` : "none", breakInside: "avoid" }}>
            {head && (
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.45, color: ink, marginBottom: 6, paddingLeft: 10, borderLeft: `3px solid ${accent}` }}>
                <Emph text={head} color={primary} />
              </div>
            )}
            <Meta
              left={
                <>
                  <span style={{ fontWeight: 700 }}>{e.role}</span>
                  {e.role && e.company && <span style={{ color: muted }}>{", "}</span>}
                  <span style={{ fontWeight: 600, color: primary }}>{e.company}</span>
                  {e.location && <span style={{ color: muted }}>{` · ${e.location}`}</span>}
                </>
              }
              right={dateRange(e.start, e.end)}
            />
            <Dashes items={rest} />
          </div>
        );
      });
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 6 }}>
          <Meta
            left={
              <>
                <span style={{ fontWeight: 700 }}>{e.degree}</span>
                {e.school && <span style={{ color: muted }}>{e.degree ? ` · ${e.school}` : e.school}</span>}
                {e.grade && <span style={{ color: muted }}>{` · ${e.grade}`}</span>}
              </>
            }
            right={dateRange(e.start, e.end)}
          />
        </div>
      ));
    if (k === "projects")
      return data.projects.map((e) => (
        <div key={e.id} style={{ marginBottom: 8 }}>
          <Meta left={<span style={{ fontWeight: 700 }}>{e.name}</span>} right={e.link} />
          <Dashes items={lines(e.description)} />
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 5 }}>
          <Meta
            left={
              <>
                <span style={{ fontWeight: 700 }}>{c.name}</span>
                {c.issuer && <span style={{ color: muted }}>{c.name ? ` · ${c.issuer}` : c.issuer}</span>}
              </>
            }
            right={c.year}
          />
        </div>
      ));
    if (k === "skills")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.skills.map((s) => (
            <span key={s.id} style={{ fontSize: 11, fontWeight: 600, color: ink, background: tint, padding: "3px 9px", borderRadius: 2 }}>
              {s.name}
            </span>
          ))}
        </div>
      );
    if (k === "languages")
      return (
        <div style={{ fontSize: fs, color: text }}>
          {data.languages.map((l, i) => (
            <span key={l.id}>
              {i > 0 && <span style={{ color: hair }}>{"   |   "}</span>}
              <span style={{ fontWeight: 700, color: ink }}>{l.name}</span>
              <span style={{ color: muted }}>{` (${levelWord(l.level)})`}</span>
            </span>
          ))}
        </div>
      );
    if (k === "interests") return <div style={{ fontSize: fs, color: text }}>{data.interests.map((i) => i.name).join(" · ")}</div>;
    return null;
  };

  const contacts = contactItems(p);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: text })}>
      <div style={{ display: "flex", height: 8 }}>
        <span style={{ width: 170, background: accent }} />
        <span style={{ flex: 1, background: primary }} />
      </div>
      <div style={{ padding: "38px 56px 40px" }}>
        <header style={{ display: "grid", gridTemplateColumns: "128px 1fr", columnGap: 24, marginBottom: 26 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: primary, paddingTop: 10 }}>Résumé</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: ink, letterSpacing: -0.6, lineHeight: 1.1 }}>{p.name}</h1>
            {p.title && <div style={{ marginTop: 4, fontSize: 14, fontWeight: 500, color: primary }}>{p.title}</div>}
            {contacts.length > 0 && (
              <div data-section="contact" style={{ marginTop: 12, display: "flex", flexWrap: "wrap", columnGap: 0, rowGap: 4, fontSize: 11, color: text }}>
                {contacts.map((c, i) => (
                  <span key={c.icon} style={{ whiteSpace: "nowrap" }}>
                    {i > 0 && <span style={{ color: hair, margin: "0 10px" }}>|</span>}
                    {c.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
        {pick(data, DEFAULT_KEYS).map((k) => (
          <section
            key={k}
            data-section={k}
            style={{ display: "grid", gridTemplateColumns: "128px 1fr", columnGap: 24, borderTop: `1px solid ${hair}`, padding: "14px 0 10px" }}
          >
            <h3 style={{ margin: 0, fontSize: 10.5, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: primary, lineHeight: 1.45, paddingTop: 2 }}>
              {TITLES[k]}
            </h3>
            <div style={{ minWidth: 0 }}>{body(k)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
