// Infographic Poster CV: a dark one-page poster — giant condensed name, "by the numbers" stats pulled from the bullets, a career-span chart, skill meters and bold tiles.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, fontOf, pick, levelWord, Ring } from "../../kit";
import Icon, { interestIcon } from "../../Icon";
import { fontStack } from "@/lib/palettes";

const MAIN = ["experience", "skills", "languages"];
const TILES = ["education", "projects", "certifications", "interests"];

function yearOf(v, now) {
  const m = String(v || "").match(/\d{4}/);
  if (m) return Number(m[0]);
  if (/present|now|current|today/i.test(String(v || ""))) return now;
  return null;
}

// The most telling number in a bullet: a percentage first, otherwise the largest figure.
function statOf(text) {
  const found = [...text.matchAll(/(\$?\d[\d,.]*)(\s?%|\+|[kKmM]\b)?/g)]
    .map((m) => ({ raw: m[0].replace(/\s/g, ""), n: parseFloat(m[1].replace(/[$,]/g, "")), pct: /%/.test(m[2] || "") }))
    .filter((f) => !Number.isNaN(f.n) && !(f.n >= 1900 && f.n <= 2100));
  if (!found.length) return null;
  const pct = found.find((f) => f.pct);
  return pct || found.reduce((a, b) => (b.n > a.n ? b : a));
}

export default function InfographicPosterCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const dark = theme.dark || "#1b1b1b";
  const bg = mix(primary, dark, 0.45);
  const panel = mix(bg, "#ffffff", 0.07);
  const soft = mix("#ffffff", bg, 0.3);
  const faint = mix("#ffffff", bg, 0.82);
  const head = fontStack("oswald");
  const now = new Date().getFullYear();

  const main = pick(data, MAIN);
  const tiles = pick(data, TILES);
  const hasContact = Boolean(p.email || p.phone || p.address || p.website);
  const showSummary = pick(data, ["summary"]).length > 0;
  const showExp = main.includes("experience");

  // Stats: years in the field, then figures found in the experience bullets.
  const starts = data.experience.map((e) => yearOf(e.start, now)).filter((y) => y != null);
  const stats = [];
  if (showExp && starts.length) stats.push({ v: `${Math.max(1, now - Math.min(...starts))}+`, c: "Years of professional experience" });
  if (showExp)
    data.experience.forEach((e) =>
      lines(e.bullets).forEach((b) => {
        const s = statOf(b);
        if (s && stats.length < 4) stats.push({ v: s.raw, c: b });
      })
    );
  if (stats.length < 4 && data.projects.length) stats.push({ v: String(data.projects.length), c: data.projects.length === 1 ? "Featured project" : "Featured projects" });
  if (stats.length < 4 && data.skills.length) stats.push({ v: String(data.skills.length), c: "Core skills" });

  // Career span chart.
  const spans = data.experience.map((e) => ({ e, s: yearOf(e.start, now), f: yearOf(e.end, now) ?? now }));
  const valid = spans.filter((t) => t.s != null);
  const lo = valid.length ? Math.min(...valid.map((t) => t.s)) : 0;
  const hi = valid.length ? Math.max(...valid.map((t) => t.f), lo + 1) : 1;

  const Label = ({ children, color = accent }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ fontFamily: head, fontSize: 19, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color }}>{children}</span>
      <span style={{ flex: 1, height: 2, background: faint }} />
    </div>
  );

  const mainBody = (k) => {
    if (k === "experience")
      return spans.map((t, i) => {
        const left = t.s != null ? ((t.s - lo) / (hi - lo)) * 100 : 0;
        const width = t.s != null ? Math.max(6, ((t.f - t.s) / (hi - lo)) * 100) : 100;
        return (
          <div key={t.e.id} style={{ marginBottom: i < spans.length - 1 ? 24 : 0, breakInside: "avoid" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>{t.e.role}</span>
              <span style={{ fontFamily: head, fontSize: 14, color: accent, whiteSpace: "nowrap", letterSpacing: 1 }}>{dateRange(t.e.start, t.e.end)}</span>
            </div>
            {(t.e.company || t.e.location) && <div style={{ fontSize: 11.5, color: soft, marginTop: 2 }}>{[t.e.company, t.e.location].filter(Boolean).join(" · ")}</div>}
            {valid.length > 0 && (
              <div style={{ position: "relative", height: 8, background: faint, borderRadius: 4, margin: "8px 0 6px" }}>
                <div style={{ position: "absolute", left: `${left}%`, width: `${Math.min(width, 100 - left)}%`, top: 0, bottom: 0, background: accent, borderRadius: 4 }} />
              </div>
            )}
            {lines(t.e.bullets).map((b, j) => (
              <div key={j} style={{ display: "flex", gap: 8, fontSize: 11.5, lineHeight: 1.5, color: mix("#ffffff", bg, 0.12), marginTop: 4 }}>
                <span style={{ color: accent, fontWeight: 800 }}>+</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        );
      });
    if (k === "skills")
      return data.skills.map((s) => (
        <div key={s.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#fff", fontWeight: 600 }}>
            <span>{s.name}</span>
            <span style={{ fontFamily: head, color: accent }}>{s.level ?? 0}%</span>
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 5 }}>
            {Array.from({ length: 20 }, (_, n) => (
              <span key={n} style={{ flex: 1, height: 9, background: n < Math.round(((s.level ?? 0) / 100) * 20) ? accent : faint }} />
            ))}
          </div>
        </div>
      ));
    if (k === "languages")
      return (
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {data.languages.map((l) => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Ring value={l.level ?? 0} size={54} stroke={6} color={accent} track={faint} textColor="#fff" />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{l.name}</div>
                <div style={{ fontSize: 11, color: soft }}>{levelWord(l.level)}</div>
              </div>
            </div>
          ))}
        </div>
      );
    return null;
  };

  const tileStyle = (i) => {
    const variants = [
      { background: accent, color: mix(accent, dark, 0.85), sub: mix(accent, dark, 0.65) },
      { background: "#fff", color: mix(dark, primary, 0.2), sub: mix(dark, "#ffffff", 0.4) },
      { background: "transparent", color: "#fff", sub: soft, border: `2px solid ${accent}` },
      { background: panel, color: "#fff", sub: soft },
    ];
    return variants[i % 4];
  };

  const tileBody = (k, v) => {
    const row = (t, s, key) => (
      <div key={key} style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{t}</div>
        {s && <div style={{ fontSize: 11, color: v.sub, marginTop: 2, wordBreak: "break-word" }}>{s}</div>}
      </div>
    );
    if (k === "education") return data.education.map((e) => row(e.degree, [e.school, dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · "), e.id));
    if (k === "projects") return data.projects.map((e) => row(e.name, [e.link, lines(e.description).join(" ")].filter(Boolean).join(" — "), e.id));
    if (k === "certifications") return data.certifications.map((e) => row(e.name, [e.issuer, e.year].filter(Boolean).join(" · "), e.id));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {data.interests.map((i) => (
          <div key={i.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, fontSize: 11 }}>
            <Icon name={interestIcon(i.name)} size={24} color={v.color} strokeWidth={1.7} />
            {i.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "inter"), color: "#fff", background: bg, padding: "42px 40px 36px", boxSizing: "border-box" })}>
      {/* Poster head */}
      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
        <div style={{ minWidth: 0 }}>
          {p.title && <div style={{ fontFamily: head, fontSize: 16, letterSpacing: 5, textTransform: "uppercase", color: accent }}>{p.title}</div>}
          <h1 style={{ margin: "4px 0 0", fontFamily: head, fontWeight: 700, fontSize: 72, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: 1 }}>{p.name}</h1>
        </div>
        {hasContact && (
          <div data-section="contact" style={{ flexShrink: 0, background: panel, padding: "12px 16px", borderLeft: `4px solid ${accent}` }}>
            <ContactList p={p} fs={11.5} iconColor={accent} color="#fff" gap={6} />
          </div>
        )}
      </header>

      {/* By the numbers */}
      {stats.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, marginTop: 30, borderTop: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "18px 16px 18px", borderLeft: i ? `1px solid ${faint}` : "none" }}>
              <div style={{ fontFamily: head, fontSize: 58, fontWeight: 700, lineHeight: 1, color: accent }}>{s.v}</div>
              <div style={{ fontSize: 11, lineHeight: 1.45, color: soft, marginTop: 6 }}>{s.c}</div>
            </div>
          ))}
        </div>
      )}

      {showSummary && (
        <section data-section="summary" style={{ display: "flex", gap: 16, marginTop: 28, alignItems: "flex-start" }}>
          <span style={{ fontFamily: head, fontSize: 64, lineHeight: 0.8, color: accent }}>“</span>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: mix("#ffffff", bg, 0.08), fontWeight: 300 }}>{p.summary}</p>
        </section>
      )}

      {/* Main visual sections */}
      {main.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: showExp && main.length > 1 ? "1.25fr 1fr" : "1fr", gap: 30, marginTop: 32 }}>
          {showExp && (
            <section data-section="experience">
              <Label>Career highlights</Label>
              {mainBody("experience")}
            </section>
          )}
          {main.filter((k) => k !== "experience").length > 0 && (
            <div>
              {main
                .filter((k) => k !== "experience")
                .map((k) => (
                  <section key={k} data-section={k} style={{ marginBottom: 24 }}>
                    <Label>{SECTION_META[k].title}</Label>
                    {mainBody(k)}
                  </section>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tiles */}
      {tiles.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(tiles.length, 4)}, 1fr)`, gap: 12, marginTop: 30 }}>
          {tiles.map((k, i) => {
            const v = tileStyle(i);
            return (
              <section key={k} data-section={k} style={{ background: v.background, color: v.color, border: v.border, padding: "16px 16px 12px", minHeight: 150, boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon name={SECTION_META[k].icon} size={17} color={v.color} />
                  <span style={{ fontFamily: head, fontSize: 15, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{SECTION_META[k].title}</span>
                </div>
                {tileBody(k, v)}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
