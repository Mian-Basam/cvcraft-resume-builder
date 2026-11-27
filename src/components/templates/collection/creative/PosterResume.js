// Poster Resume: single column gig-poster layout — oversized Bebas name, a ticker strip and hanging poster-type section heads.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const ROW_KEYS = ["summary", "experience", "education", "projects", "skills"];
const TRIO_KEYS = ["languages", "certifications", "interests"];

export default function PosterResume({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const bebas = fontStack("bebas");
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.2);
  const paper = mix(theme.light || "#f1f1f1", "#f7f1e6", 0.6);
  const muted = mix(ink, paper, 0.4);

  const words = (p.name || "").trim().toUpperCase().split(/\s+/).filter(Boolean);
  const first = words[0] || "";
  const rest = words.slice(1).join(" ");
  const longest = Math.max(first.length, rest.length, 1);
  const nameSize = Math.min(166, Math.floor(480 / (longest * 0.4)));

  const tickerBits = [p.title, p.address, p.website].filter(Boolean).map((t) => t.toUpperCase());
  const ticker = tickerBits.length ? Array.from({ length: 6 }, () => tickerBits).flat() : [];

  const rowHead = (k, i) => (
    <div style={{ width: 168, flexShrink: 0, paddingTop: 2 }}>
      <div style={{ fontFamily: bebas, fontSize: 13, letterSpacing: 2, color: muted }}>{String(i + 1).padStart(2, "0")} /</div>
      <div style={{ fontFamily: bebas, fontSize: 38, lineHeight: 0.88, color: primary, letterSpacing: 0.5 }}>{SECTION_META[k].title}</div>
    </div>
  );

  const Entries = ({ k }) => {
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, t: e.role, s: [e.company, e.location].filter(Boolean).join(", "), d: dateRange(e.start, e.end), b: lines(e.bullets) }))
        : k === "education"
        ? data.education.map((e) => ({ id: e.id, t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" · "), d: dateRange(e.start, e.end), b: [] }))
        : data.projects.map((e) => ({ id: e.id, t: e.name, s: e.link, d: "", b: lines(e.description) }));
    return items.map((e, j) => (
      <div key={e.id} style={{ marginTop: j ? 14 : 0, breakInside: "avoid" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: ink }}>{e.t}</span>
          {e.d && <span style={{ fontFamily: bebas, fontSize: 20, letterSpacing: 1, color: primary, whiteSpace: "nowrap" }}>{e.d}</span>}
        </div>
        {e.s && <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: muted, marginTop: 1 }}>{e.s}</div>}
        {e.b.map((b, n) => (
          <div key={n} style={{ display: "flex", gap: 9, fontSize: 12, lineHeight: 1.5, color: ink, marginTop: 4 }}>
            <span style={{ width: 7, height: 7, background: primary, flexShrink: 0, marginTop: 6 }} />
            <span>{b}</span>
          </div>
        ))}
      </div>
    ));
  };

  const body = (k) => {
    if (k === "summary") return <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: ink, fontWeight: 500 }}>{p.summary}</p>;
    if (k === "skills")
      return (
        <div style={{ fontFamily: bebas, fontSize: 24, lineHeight: 1.1, letterSpacing: 0.5, color: ink }}>
          {data.skills.map((s, j) => (
            <span key={s.id}>
              {j > 0 && <span style={{ color: primary, margin: "0 8px 0 10px" }}>/</span>}{j > 0 && " "}
              <span style={{ whiteSpace: "nowrap" }}>{s.name}</span>
            </span>
          ))}
        </div>
      );
    return <Entries k={k} />;
  };

  const trioBody = (k) => {
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ marginBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: ink, fontWeight: 600 }}>
            <span>{l.name}</span>
            <span style={{ fontFamily: bebas, fontSize: 15, color: primary, letterSpacing: 1 }}>{l.level ?? 0}%</span>
          </div>
          <div style={{ height: 4, background: mix(primary, paper, 0.8), marginTop: 3 }}>
            <div style={{ height: "100%", width: `${l.level ?? 0}%`, background: primary }} />
          </div>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 7 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ink, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontSize: 11, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((it) => (
          <span key={it.id} style={{ fontFamily: bebas, fontSize: 17, letterSpacing: 1, color: paper, background: ink, padding: "3px 10px 1px" }}>{it.name}</span>
        ))}
      </div>
    );
  };

  const rows = pick(data, ROW_KEYS);
  const trio = pick(data, TRIO_KEYS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "sora"), color: ink, background: paper })}>
      <header style={{ position: "relative", overflow: "hidden", background: primary, padding: "34px 44px 30px", display: "flex", gap: 20, alignItems: "flex-end" }}>
        <svg width="794" height="340" style={{ position: "absolute", left: 0, top: 0, opacity: 0.12 }}>
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={i * 70 - 200} y1="340" x2={i * 70 + 60} y2="0" stroke="#fff" strokeWidth="18" />
          ))}
        </svg>
        <h1 style={{ position: "relative", flex: 1, minWidth: 0, fontFamily: bebas, fontWeight: 400, fontSize: nameSize, lineHeight: 0.8, letterSpacing: -1, margin: 0, color: accent }}>
          <div>{first}</div>
          {rest && <div style={{ color: "#fff" }}>{rest}</div>}
        </h1>
        <div style={{ position: "relative", width: 214, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 22 }}>
          <div style={{ width: 118, height: 118, borderRadius: "50%", background: accent, color: primary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-12deg)", boxShadow: `0 0 0 6px ${primary}, 0 0 0 8px ${accent}` }}>
            <span style={{ fontFamily: bebas, fontSize: 15, letterSpacing: 3 }}>Now showing</span>
            <span style={{ fontFamily: bebas, fontSize: 46, lineHeight: 0.9 }}>CV</span>
            <span style={{ fontFamily: bebas, fontSize: 15, letterSpacing: 3 }}>No. 01</span>
          </div>
          <div data-section="contact" style={{ alignSelf: "stretch", borderTop: `2px solid ${accent}`, paddingTop: 12 }}>
            <ContactList p={p} fs={11} iconColor={accent} color="#fff" gap={6} />
          </div>
        </div>
      </header>

      {ticker.length > 0 && (
        <div style={{ background: dark, color: accent, height: 38, overflow: "hidden", whiteSpace: "nowrap", display: "flex", alignItems: "center", fontFamily: bebas, fontSize: 21, letterSpacing: 2 }}>
          {ticker.map((t, i) => (
            <span key={i} style={{ marginLeft: i ? 0 : -30 }}>
              {t}
              <span style={{ color: "#fff", margin: "0 16px" }}>✶</span>
            </span>
          ))}
        </div>
      )}

      <div style={{ padding: "4px 44px 26px" }}>
        {rows.map((k, i) => (
          <div key={k}>
            <section data-section={k} style={{ display: "flex", gap: 22, padding: "16px 0 14px" }}>
              {rowHead(k, i)}
              <div style={{ flex: 1, minWidth: 0 }}>{body(k)}</div>
            </section>
            <div style={{ height: 2, background: ink }} />
          </div>
        ))}
        {trio.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${trio.length}, 1fr)`, gap: 0, paddingTop: 14 }}>
            {trio.map((k, j) => (
              <div key={k} style={{ paddingLeft: j ? 20 : 0, paddingRight: 20, borderLeft: j ? `2px solid ${ink}` : "none" }}>
              <section data-section={k}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 9 }}>
                  <span style={{ fontFamily: bebas, fontSize: 13, letterSpacing: 2, color: muted }}>{String(rows.length + j + 1).padStart(2, "0")} /</span>
                  <span style={{ fontFamily: bebas, fontSize: 28, lineHeight: 0.9, color: primary }}>{SECTION_META[k].title}</span>
                </div>
                {trioBody(k)}
              </section>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
