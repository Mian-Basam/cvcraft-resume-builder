// The Cover Story: magazine-cover header (issue strip, name masthead, cover lines teasing the sections, framed portrait, barcode), a cover-story profile and a two-column feature.
import { Photo, contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, levelWord, photoOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN = ["experience", "education", "projects"];
const SIDE = ["skills", "languages", "certifications", "interests"];

// Cover lines that tease what is inside, built from the first entry of each section.
function coverLines(data) {
  const out = [];
  const e = data.experience[0];
  if (e && (e.role || e.company)) out.push({ kicker: "Career", text: [e.role, e.company].filter(Boolean).join(" at ") });
  if (data.skills.length) {
    const names = data.skills.slice(0, 3).map((s) => s.name);
    out.push({ kicker: "Craft", text: `${names.join(", ")}${data.skills.length > 3 ? " & more" : ""}` });
  }
  const ed = data.education[0];
  if (ed && (ed.degree || ed.school)) out.push({ kicker: "Schooling", text: [ed.degree, ed.school].filter(Boolean).join(", ") });
  const pr = data.projects[0];
  if (pr && pr.name) out.push({ kicker: "Featured", text: pr.name });
  return out.slice(0, 4);
}

function Barcode({ color, seed }) {
  const bars = Array.from({ length: 34 }, (_, i) => 1 + ((seed.charCodeAt(i % seed.length) + i * 7) % 3));
  let x = 0;
  return (
    <svg width="86" height="34" viewBox="0 0 86 34" style={{ display: "block" }}>
      {bars.map((w, i) => {
        const r = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="34" fill={color} /> : null;
        x += w + (i % 2 ? 0.6 : 0);
        return r;
      })}
    </svg>
  );
}

export default function CoverStory({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const coverBg = mix(primary, "#000000", 0.12);
  const accent = theme.accent;
  const onCover = "#ffffff";
  const soft = mix(coverBg, "#ffffff", 0.72);
  const ink = "#1c1b1a";
  const body = "#424040";
  const muted = "#85817c";
  const hair = "#e3dfd8";
  const serif = fontStack("playfair");
  const sans = fontOf(theme, "lato");
  const year = new Date().getFullYear();
  const name = (p.name || "").trim();
  const mastSize = Math.max(28, Math.min(92, 700 / Math.max(1, name.length * 0.68)));
  const teasers = coverLines(data);
  const contacts = contactItems(p);
  const kick = { fontSize: 10.5, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" };

  const Heading = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <span style={{ ...kick, color: "#fff", background: primary, padding: "3px 8px" }}>{children}</span>
      <span style={{ flex: 1, height: 2, background: ink }} />
    </div>
  );

  const Bullets = ({ items }) =>
    items.length > 0 && (
      <ul style={{ margin: "6px 0 0", padding: "0 0 0 15px", listStyle: "square", color: primary }}>
        {items.map((b, i) => (
          <li key={i} style={{ fontSize: 11.3, lineHeight: 1.55, color: body, marginBottom: 3 }}>{b}</li>
        ))}
      </ul>
    );

  const main = {
    experience: () =>
      data.experience.map((e, i) => (
        <article key={e.id} style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 16, paddingTop: i ? 14 : 2, marginTop: i ? 12 : 0, borderTop: i ? `1px solid ${hair}` : "none", breakInside: "avoid" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, color: primary, lineHeight: 1.4, paddingTop: 4 }}>{dateRange(e.start, e.end)}</div>
          <div>
            <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 700, lineHeight: 1.2, color: ink }}>{e.role}</div>
            <div style={{ fontSize: 11.3, fontStyle: "italic", color: muted, marginTop: 2 }}>{[e.company, e.location].filter(Boolean).join(", ")}</div>
            <Bullets items={lines(e.bullets)} />
          </div>
        </article>
      )),
    education: () =>
      data.education.map((e, i) => (
        <article key={e.id} style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 16, marginTop: i ? 10 : 0, breakInside: "avoid" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, color: primary, paddingTop: 4 }}>{dateRange(e.start, e.end)}</div>
          <div>
            <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: ink }}>{e.degree}</div>
            <div style={{ fontSize: 11.3, fontStyle: "italic", color: muted, marginTop: 2 }}>{[e.school, e.grade].filter(Boolean).join(" · ")}</div>
          </div>
        </article>
      )),
    projects: () =>
      data.projects.map((e, i) => (
        <article key={e.id} style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 16, marginTop: i ? 12 : 0, breakInside: "avoid" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, color: primary, paddingTop: 4 }}>{String(i + 1).padStart(2, "0")}</div>
          <div>
            <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: ink }}>{e.name}</div>
            {e.link && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{e.link}</div>}
            <Bullets items={lines(e.description)} />
          </div>
        </article>
      )),
  };

  const row = { fontSize: 11.3, lineHeight: 1.5, color: body };
  const side = {
    skills: () => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.skills.map((s) => (
          <span key={s.id} style={{ fontSize: 10.8, padding: "3px 9px", border: `1px solid ${ink}`, color: ink }}>{s.name}</span>
        ))}
      </div>
    ),
    languages: () =>
      data.languages.map((l) => (
        <div key={l.id} style={{ ...row, display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontWeight: 700, color: ink }}>{l.name}</span>
          <span style={{ color: muted }}>{levelWord(l.level)}</span>
        </div>
      )),
    certifications: () =>
      data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 7 }}>
          <div style={{ fontWeight: 700, fontSize: 11.5, color: ink }}>{c.name}</div>
          <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      )),
    interests: () => <div style={row}>{data.interests.map((i) => i.name).join(" / ")}</div>,
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: sans, color: ink, background: "#fbfaf7", boxSizing: "border-box" })}>
      {/* The cover */}
      <header style={{ background: coverBg, color: onCover, padding: "18px 40px 26px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...kick, fontWeight: 400, fontSize: 10, letterSpacing: 3, color: soft, paddingBottom: 8, borderBottom: `1px solid ${mix(coverBg, "#ffffff", 0.3)}` }}>
          <span>Issue No. 01</span>
          <span style={{ color: accent, fontWeight: 700 }}>The Career Issue</span>
          <span>{year}</span>
        </div>
        <h1 style={{ margin: "10px 0 0", fontFamily: serif, fontWeight: 900, fontSize: mastSize, lineHeight: 1, letterSpacing: -1.5, textTransform: "uppercase", color: onCover, whiteSpace: "nowrap" }}>{name}</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 230px", gap: 34, marginTop: 14 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {p.title && (
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 27, lineHeight: 1.1, color: accent, marginBottom: 10 }}>
                The {p.title}
                <div style={{ fontFamily: sans, fontStyle: "normal", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: soft, marginTop: 8 }}>An exclusive profile</div>
              </div>
            )}
            {teasers.map((t, i) => (
              <div key={i} style={{ padding: "7px 0", borderTop: `1px solid ${mix(coverBg, "#ffffff", 0.25)}` }}>
                <div style={{ ...kick, fontSize: 10, color: accent }}>{t.kicker}</div>
                <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, lineHeight: 1.25, color: onCover, marginTop: 3 }}>{t.text}</div>
              </div>
            ))}
          </div>
          <div style={{ position: "relative", alignSelf: "start" }}>
            <Photo
              src={photoOf(data, theme)}
              name={p.name}
              size={230}
              placeholderBg={mix(primary, "#ffffff", 0.3)}
              style={{ width: 230, height: 268, borderRadius: 0, border: "6px solid #fff", boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}
            />
            <div style={{ position: "absolute", left: -14, bottom: -12, background: "#fff", padding: "5px 6px 3px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
              <Barcode color="#111" seed={name || "resume"} />
            </div>
          </div>
        </div>
      </header>

      {/* Contact strip */}
      {contacts.length > 0 && (
        <div data-section="contact" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2px 16px", padding: "9px 40px", fontSize: 10.5, letterSpacing: 1, color: ink, background: mix(accent, "#ffffff", 0.55), borderBottom: `2px solid ${ink}` }}>
          {contacts.map((c) => (
            <span key={c.icon}>{c.value}</span>
          ))}
        </div>
      )}

      <div style={{ padding: "18px 40px 16px" }}>
        {/* The cover story itself */}
        {pick(data, ["summary"]).map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 22 }}>
            <div style={{ ...kick, color: primary, marginBottom: 8 }}>Cover Story</div>
            <p style={{ margin: 0, fontFamily: serif, fontSize: 17.5, fontWeight: 500, lineHeight: 1.45, color: ink, borderLeft: `4px solid ${accent}`, paddingLeft: 16 }}>{p.summary}</p>
          </section>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 210px", gap: 34 }}>
          <div>
            {pick(data, MAIN).map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 16 }}>
                <Heading>{{ experience: "The Story So Far", education: "Formative Years", projects: "Also in this Issue" }[k]}</Heading>
                {main[k]()}
              </section>
            ))}
          </div>
          <aside>
            {pick(data, SIDE).map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 18 }}>
                <div style={{ ...kick, color: ink, borderBottom: `2px solid ${ink}`, paddingBottom: 5, marginBottom: 9 }}>{SECTION_META[k].title}</div>
                {side[k]()}
              </section>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
