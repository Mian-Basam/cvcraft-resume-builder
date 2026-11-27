// Swiss Brutalist: rigid ruled grid, oversized section numerals, lowercase giant name and a high-contrast signal-colour cell.
import { pageStyle, lines, dateRange, contactItems } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

export default function SwissBrutalist({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const grot = fontStack("spacegrotesk");
  const ink = "#111111";
  const muted = "#5c5c5c";
  const rule = (w = 3) => ({ height: w, background: ink });

  const nameWords = (p.name || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  const longest = Math.max(1, ...nameWords.map((w) => w.length));
  const nameSize = Math.min(98, Math.floor(470 / (longest * 0.56)));

  const mainKeys = pick(data, MAIN_KEYS);
  const sideKeys = pick(data, SIDE_KEYS);
  const num = (k) => String([...mainKeys, ...sideKeys].indexOf(k) + 1).padStart(2, "0");

  const BigHead = ({ k }) => (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
      <span style={{ fontFamily: grot, fontWeight: 700, fontSize: 70, lineHeight: 0.74, letterSpacing: -5, color: primary, marginLeft: -4 }}>{num(k)}</span>
      <span style={{ fontFamily: grot, fontWeight: 700, fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: ink, paddingBottom: 1 }}>
        {SECTION_META[k].title} <span style={{ display: "inline-block", width: 9, height: 9, background: ink, marginLeft: 4 }} />
      </span>
    </div>
  );
  const SmallHead = ({ k }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 10 }}>
      <span style={{ fontFamily: grot, fontWeight: 700, fontSize: 44, lineHeight: 0.74, letterSpacing: -3, color: ink, background: accent, padding: "6px 6px 3px 4px" }}>{num(k)}</span>
      <span style={{ fontFamily: grot, fontWeight: 700, fontSize: 11.5, letterSpacing: 2.2, textTransform: "uppercase", color: ink }}>{SECTION_META[k].title}</span>
    </div>
  );

  const Entries = ({ k }) => {
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, t: e.role, s: [e.company, e.location].filter(Boolean).join(", "), d: dateRange(e.start, e.end), b: lines(e.bullets) }))
        : k === "education"
        ? data.education.map((e) => ({ id: e.id, t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" / "), d: dateRange(e.start, e.end), b: [] }))
        : data.projects.map((e, j) => ({ id: e.id, t: e.name, s: e.link, d: `No. ${String(j + 1).padStart(2, "0")}`, b: lines(e.description) }));
    return items.map((e, j) => (
      <div key={e.id} style={{ display: "grid", gridTemplateColumns: "96px 1fr", columnGap: 14, paddingTop: j ? 12 : 0, marginTop: j ? 12 : 0, borderTop: j ? `1px solid ${ink}` : "none", breakInside: "avoid" }}>
        <div style={{ fontFamily: grot, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: ink, paddingTop: 2, textTransform: "uppercase" }}>{e.d || "—"}</div>
        <div>
          <div style={{ fontFamily: grot, fontSize: 15, fontWeight: 700, letterSpacing: -0.3, color: ink, lineHeight: 1.2 }}>{e.t}</div>
          {e.s && <div style={{ fontSize: 11.5, color: muted, marginTop: 2 }}>{e.s}</div>}
          {e.b.map((b, n) => (
            <div key={n} style={{ display: "flex", gap: 8, fontSize: 11.5, lineHeight: 1.5, color: ink, marginTop: 4 }}>
              <span style={{ fontFamily: grot, fontWeight: 700 }}>→</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const sideBody = (k) => {
    if (k === "skills" || k === "languages")
      return data[k].map((s) => (
        <div key={s.id} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, borderBottom: `1px solid ${ink}`, padding: "5px 0 4px" }}>
          <span style={{ fontSize: 11.5, color: ink }}>{s.name}</span>
          <span style={{ fontFamily: grot, fontWeight: 700, fontSize: 18, letterSpacing: -1, color: ink, lineHeight: 1 }}>{s.level ?? 0}</span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ borderBottom: `1px solid ${ink}`, padding: "5px 0 6px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: ink }}>{c.name}</div>
          <div style={{ fontSize: 11, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" / ")}</div>
        </div>
      ));
    return (
      <div style={{ fontFamily: grot, fontSize: 20, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.12, color: ink }}>
        {data.interests.map((i) => (
          <div key={i.id}>{i.name.toLowerCase()}.</div>
        ))}
      </div>
    );
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "spacegrotesk"), color: ink, background: "#fff", padding: "34px 36px 30px", boxSizing: "border-box" })}>
      {/* header grid */}
      <div style={rule(6)} />
      <header style={{ display: "grid", gridTemplateColumns: "1fr 236px", minHeight: 236 }}>
        <div style={{ padding: "18px 18px 16px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: grot, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            <span>Curriculum vitae</span>
            <span>(cv)</span>
          </div>
          <h1 style={{ fontFamily: grot, fontWeight: 700, fontSize: nameSize, lineHeight: 0.84, letterSpacing: -nameSize * 0.06, margin: "18px 0 0", color: ink }}>
            {nameWords.map((w, i) => (
              <div key={i}>
                {w}
                {i === nameWords.length - 1 && <span style={{ color: primary }}>.</span>}
              </div>
            ))}
          </h1>
        </div>
        <div style={{ background: accent, borderLeft: `3px solid ${ink}`, padding: "18px 18px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {p.title && <div style={{ fontFamily: grot, fontSize: 24, fontWeight: 700, lineHeight: 1, letterSpacing: -1, color: ink, textAlign: "right" }}>{p.title}</div>}
          <div data-section="contact" style={{ fontSize: 11, lineHeight: 1.6, color: ink }}>
            {contactItems(p).map((c) => (
              <div key={c.icon} style={{ borderTop: `1px solid ${ink}`, padding: "3px 0", wordBreak: "break-word" }}>{c.value}</div>
            ))}
          </div>
        </div>
      </header>
      <div style={rule(6)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 236px" }}>
        <main style={{ paddingRight: 22 }}>
          {mainKeys.map((k, i) => (
            <div key={k}>
              {i > 0 && <div style={rule(3)} />}
              <section data-section={k} style={{ padding: "15px 0 13px" }}>
                <BigHead k={k} />
                {k === "summary" ? (
                  <p style={{ fontSize: 15.5, lineHeight: 1.45, fontWeight: 500, letterSpacing: -0.2, margin: 0, color: ink, textIndent: 110 }}>{p.summary}</p>
                ) : (
                  <Entries k={k} />
                )}
              </section>
            </div>
          ))}
        </main>
        <aside style={{ borderLeft: `3px solid ${ink}`, paddingLeft: 18 }}>
          {sideKeys.map((k, i) => (
            <div key={k}>
              {i > 0 && <div style={rule(3)} />}
              <section data-section={k} style={{ padding: "18px 0 16px" }}>
                <SmallHead k={k} />
                {sideBody(k)}
              </section>
            </div>
          ))}
        </aside>
      </div>
      <div style={{ ...rule(6), position: "absolute", left: 36, right: 36, bottom: 30 }} />
    </div>
  );
}
