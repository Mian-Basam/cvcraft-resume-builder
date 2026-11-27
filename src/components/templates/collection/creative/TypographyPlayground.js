// Typography Playground: single-column type specimen — mixed typefaces, words-as-headings with alternating alignment and size-by-level skills.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { SECTION_META, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const FULL_KEYS = ["summary", "experience", "education", "projects"];
const GRID_KEYS = ["skills", "languages", "certifications", "interests"];

export default function TypographyPlayground({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const F = { serif: fontStack("playfair"), bebas: fontStack("bebas"), mono: fontStack("plexmono"), corm: fontStack("cormorant"), sora: fontStack("sora") };
  const ink = mix(theme.dark || "#1b1b1b", primary, 0.15);
  const muted = mix(ink, "#ffffff", 0.42);
  const paper = mix(theme.light || "#f1f1f1", "#fbfaf6", 0.7);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const first = words[0] || "";
  const rest = words.slice(1).join(" ");
  const restSize = Math.min(140, Math.floor(400 / Math.max(1, rest.length * 0.42)));

  // Each section gets its own typographic voice.
  const VOICE = {
    summary: { word: "hello,", style: { fontFamily: F.serif, fontStyle: "italic", fontSize: 44 } },
    experience: { word: "WORK", style: { fontFamily: F.bebas, fontSize: 60, letterSpacing: 2, color: primary } },
    education: { word: "Studied", style: { fontFamily: F.corm, fontStyle: "italic", fontWeight: 600, fontSize: 48 } },
    projects: { word: "made.", style: { fontFamily: F.sora, fontWeight: 800, fontSize: 40, letterSpacing: -2, textDecoration: "underline", textDecorationColor: accent, textDecorationThickness: 6, textUnderlineOffset: 2 } },
    skills: { word: "CAN DO", style: { fontFamily: F.bebas, fontSize: 40, letterSpacing: 1, color: "transparent", WebkitTextStroke: `1.4px ${primary}` } },
    languages: { word: "speaks", style: { fontFamily: F.serif, fontStyle: "italic", fontSize: 34, color: primary } },
    certifications: { word: "certified", style: { fontFamily: F.mono, fontWeight: 600, fontSize: 24, letterSpacing: -1 } },
    interests: { word: "loves ♥", style: { fontFamily: F.corm, fontStyle: "italic", fontWeight: 700, fontSize: 38 } },
  };

  const Heading = ({ k, n, flip, small }) => {
    const v = VOICE[k];
    const label = (
      <span style={{ fontFamily: F.mono, fontSize: 10.5, color: muted, whiteSpace: "nowrap" }}>
        [{String(n).padStart(2, "0")}] {SECTION_META[k].title.toLowerCase()}
      </span>
    );
    const word = <span style={{ lineHeight: 0.9, color: ink, ...v.style, ...(small ? { fontSize: v.style.fontSize * 0.78 } : {}) }}>{v.word}</span>;
    const leader = <span style={{ flex: 1, borderBottom: `1.5px dotted ${mix(ink, paper, 0.55)}`, marginBottom: 6, minWidth: 20 }} />;
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: small ? 10 : 12 }}>
        {flip ? <>{label}{leader}{word}</> : <>{word}{label}{!small && leader}</>}
      </div>
    );
  };

  const Entries = ({ k }) => {
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, t: e.role, s: [e.company, e.location].filter(Boolean).join(", "), d: dateRange(e.start, e.end), b: lines(e.bullets) }))
        : k === "education"
        ? data.education.map((e) => ({ id: e.id, t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" — "), d: dateRange(e.start, e.end), b: [] }))
        : data.projects.map((e) => ({ id: e.id, t: e.name, s: e.link, d: "", b: lines(e.description) }));
    return items.map((e) => (
      <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", columnGap: 16, marginBottom: 12, breakInside: "avoid" }}>
        <div>
          <span style={{ fontFamily: F.sora, fontSize: 15, fontWeight: 700, color: ink, letterSpacing: -0.3 }}>{e.t}</span>
          {e.s && <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 14, color: primary }}>{"  "}— {e.s}</span>}
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: muted, paddingTop: 3, whiteSpace: "nowrap" }}>{e.d}</span>
        {e.b.length > 0 && (
          <div style={{ gridColumn: "1 / -1" }}>
            {e.b.map((b, n) => (
              <div key={n} style={{ display: "flex", gap: 10, fontSize: 12, lineHeight: 1.5, color: ink, marginTop: 4 }}>
                <span style={{ fontFamily: F.mono, color: primary, flexShrink: 0 }}>→</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const gridBody = (k) => {
    if (k === "skills") {
      const fonts = [F.sora, F.serif, F.bebas, F.corm, F.mono];
      return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: 14, rowGap: 4, lineHeight: 1.05 }}>
          {data.skills.map((s, i) => {
            const size = 12 + ((s.level ?? 50) / 100) * 12;
            const f = fonts[i % fonts.length];
            return (
              <span key={s.id} style={{ fontFamily: f, fontSize: f === F.bebas ? size * 1.2 : size, fontWeight: f === F.sora ? 700 : f === F.corm ? 600 : 400, fontStyle: f === F.serif || f === F.corm ? "italic" : "normal", color: i % 2 ? primary : ink }}>
                {s.name}
              </span>
            );
          })}
        </div>
      );
    }
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: F.serif, fontSize: 17, color: ink }}>{l.name}</span>
          <span style={{ flex: 1, borderBottom: `1px dotted ${muted}` }} />
          <span style={{ fontFamily: F.mono, fontSize: 11, color: primary }}>{l.level ?? 0}/100</span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 6 }}>
          <div style={{ fontFamily: F.sora, fontSize: 12.5, fontWeight: 700, color: ink }}>{c.name}</div>
          <div style={{ fontFamily: F.mono, fontSize: 10.5, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" // ")}</div>
        </div>
      ));
    const fonts = [F.bebas, F.serif, F.sora, F.corm];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 6px", color: ink }}>
        {data.interests.map((it, i) => (
          <span key={it.id} style={{ fontFamily: fonts[i % 4], fontSize: [24, 19, 15, 21][i % 4], fontStyle: i % 4 === 1 || i % 4 === 3 ? "italic" : "normal", fontWeight: i % 4 === 2 ? 700 : 500 }}>
            {it.name}
            {i < data.interests.length - 1 && <span style={{ color: primary, fontFamily: F.serif }}>&nbsp;&amp;</span>}
          </span>
        ))}
      </div>
    );
  };

  const fullKeys = pick(data, FULL_KEYS);
  const gridKeys = pick(data, GRID_KEYS);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "sora"), color: ink, background: paper, padding: "32px 50px 26px", boxSizing: "border-box" })}>
      <header style={{ position: "relative", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 11, color: muted }}>
          <span>/* hello, my name is */</span>
          <span>Aa Bb Cc — 01</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, paddingBottom: 12, borderBottom: `3px solid ${ink}` }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 88, lineHeight: 1, letterSpacing: -2, color: ink, marginTop: 4 }}>
              {first}
              <span style={{ fontFamily: F.sora, fontStyle: "normal", fontSize: 40, color: accent, WebkitTextStroke: `1.5px ${primary}`, marginLeft: 8, verticalAlign: "top", position: "relative", top: 14 }}>✱</span>
            </div>
            {rest && (
              <div style={{ fontFamily: F.bebas, fontSize: restSize, lineHeight: 0.8, letterSpacing: 3, color: primary, marginTop: -6 }}>{rest.toUpperCase()}</div>
            )}
          </div>
          <div style={{ width: 230, flexShrink: 0, textAlign: "right" }}>
            {p.title && (
              <div style={{ fontFamily: F.corm, fontStyle: "italic", fontWeight: 600, fontSize: 26, lineHeight: 1.05, color: ink, marginBottom: 12 }}>
                <div style={{ fontFamily: F.mono, fontStyle: "normal", fontSize: 11, color: primary, fontWeight: 400, marginBottom: 2 }}>{"<title>"}</div>
                {p.title}
              </div>
            )}
            <div data-section="contact" style={{ fontFamily: F.mono, fontSize: 10.5, lineHeight: 1.6, color: ink }}>
              {contactItems(p).map((c) => (
                <div key={c.icon}>{c.value}</div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {fullKeys.map((k, i) => (
        <section key={k} data-section={k} style={{ marginBottom: 20 }}>
          <Heading k={k} n={i + 1} flip={i % 2 === 1} />
          {k === "summary" ? (
            <p style={{ fontFamily: F.sora, fontSize: 14, lineHeight: 1.6, margin: 0, color: ink, maxWidth: 640 }}>{p.summary}</p>
          ) : (
            <Entries k={k} />
          )}
        </section>
      ))}

      {gridKeys.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 40, rowGap: 10, borderTop: `3px solid ${ink}`, paddingTop: 16, marginTop: 4 }}>
          {gridKeys.map((k, j) => (
            <section key={k} data-section={k} style={{ marginBottom: 8 }}>
              <Heading k={k} n={fullKeys.length + j + 1} small />
              {gridBody(k)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
