// The Annual Report: corporate-publication page with a report cover band, a key-figures strip pulled from the bullets, a main column and a tinted data column.
import { contactItems, dateRange, lines, mix, pageStyle } from "../../shared";
import { SECTION_META, fontOf, levelWord, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN = ["summary", "experience", "projects"];
const SIDE = ["education", "skills", "languages", "certifications", "interests"];
const TITLES = { summary: "Overview", projects: "Key Projects" };
const NUM = /(\d[\d,.]*\s?%|[$€£]\s?\d[\d,.]*\s?[kKmMbB]?\+?|\d[\d,.]*[kKmM]?\+?)/;

// The most telling figure in a line of text (percentages first, then large numbers), or null.
function figureOf(text) {
  const pct = text.match(/\d[\d,.]*\s?%/);
  if (pct) return { value: pct[0].replace(/\s/g, ""), rank: 3 };
  const all = (text.match(/[$€£]?\d[\d,.]*[kKmM+]?/g) || []).filter((n) => !/^(19|20)\d\d$/.test(n));
  if (!all.length) return null;
  const big = all.find((n) => /[$€£,kKmM+]/.test(n) || parseFloat(n) >= 10);
  return { value: big || all[0], rank: big ? 2 : 1 };
}

// Key figures: years in practice plus up to three figures from experience and project bullets.
function keyFigures(data, year) {
  const out = [];
  const starts = data.experience.map((e) => parseInt((e.start || "").match(/(19|20)\d\d/)?.[0], 10)).filter(Boolean);
  if (starts.length) {
    const since = Math.min(...starts);
    if (year - since > 0) out.push({ value: `${year - since}+`, label: `Years in practice, since ${since}` });
  }
  const pool = [...data.experience.flatMap((e) => lines(e.bullets)), ...data.projects.flatMap((e) => lines(e.description))]
    .map((t, i) => ({ t, i, f: figureOf(t) }))
    .filter((x) => x.f)
    .sort((a, b) => b.f.rank - a.f.rank || a.i - b.i)
    .slice(0, 4 - out.length);
  pool.forEach((x) => out.push({ value: x.f.value, label: x.t.length > 78 ? `${x.t.slice(0, 76).trim()}…` : x.t }));
  return out;
}

// Roles with a start and end year, for the tenure chart.
function tenure(data, year) {
  const y = (v) => (/present|now|current/i.test(v || "") ? year : parseInt((v || "").match(/(19|20)\d\d/)?.[0], 10));
  return data.experience
    .map((e) => ({ id: e.id, label: e.company || e.role, from: y(e.start), to: y(e.end) || y(e.start) }))
    .filter((r) => r.from && r.to >= r.from);
}

export default function AnnualReport({ data, theme }) {
  const p = data.personal;
  const primary = theme.primary;
  const ink = "#1d2024";
  const body = "#3d4247";
  const muted = "#7a8088";
  const rule = "#d9dce0";
  const tint = mix(primary, "#ffffff", 0.93);
  const strong = mix(primary, "#000000", 0.05);
  const accent = mix(theme.accent, primary, 0.25);
  const serif = fontStack("playfair");
  const sans = fontOf(theme, "inter");
  const year = new Date().getFullYear();
  const figures = keyFigures(data, year);
  const contacts = contactItems(p);
  const bars = tenure(data, year);
  const lo = bars.length ? Math.min(...bars.map((b) => b.from)) : 0;
  const hi = bars.length ? Math.max(...bars.map((b) => b.to)) : 0;
  const span = Math.max(1, hi - lo);
  const step = span <= 5 ? 1 : span <= 12 ? 2 : 5;
  const ticks = Array.from({ length: span + 1 }, (_, i) => lo + i).filter((t) => t === hi || ((t - lo) % step === 0 && hi - t >= step));

  // Bullet text with its figures set in bold.
  const withFigures = (t) =>
    t.split(NUM).map((part, i) => (i % 2 ? <strong key={i} style={{ color: strong, fontWeight: 700 }}>{part}</strong> : part));

  const Heading = ({ k, small }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: small ? 10 : 16, paddingTop: small ? 0 : 9, borderTop: small ? "none" : `2px solid ${primary}` }}>
      <span style={{ fontSize: small ? 10.5 : 11.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: primary }}>{TITLES[k] || SECTION_META[k].title}</span>
      {small && <span style={{ flex: 1, height: 1, background: mix(primary, "#ffffff", 0.7) }} />}
    </div>
  );

  const Bullets = ({ items }) =>
    items.length > 0 && (
      <div style={{ marginTop: 7 }}>
        {items.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 9, fontSize: 11.2, lineHeight: 1.55, color: body, marginBottom: 4 }}>
            <span style={{ width: 8, height: 2, background: accent, marginTop: 8, flexShrink: 0 }} />
            <span>{withFigures(b)}</span>
          </div>
        ))}
      </div>
    );

  const main = {
    summary: () => <p style={{ margin: 0, fontFamily: serif, fontSize: 16, lineHeight: 1.65, color: ink }}>{p.summary}</p>,
    experience: () =>
      data.experience.map((e) => (
        <div key={e.id} style={{ marginBottom: 16, breakInside: "avoid" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: ink }}>{e.role}</span>
            {dateRange(e.start, e.end) && <span style={{ fontSize: 10.5, fontWeight: 600, color: primary, background: tint, padding: "2px 8px", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{dateRange(e.start, e.end)}</span>}
          </div>
          <div style={{ fontSize: 11.2, color: muted, marginTop: 2 }}>{[e.company, e.location].filter(Boolean).join("  |  ")}</div>
          <Bullets items={lines(e.bullets)} />
        </div>
      )).concat(
        bars.length > 1 ? (
          <div key="tenure" style={{ marginTop: 6, padding: "12px 14px 10px", border: `1px solid ${rule}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: muted, marginBottom: 10 }}>Tenure, {lo}–{hi}</div>
            {bars.map((b) => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                <span style={{ width: 112, flexShrink: 0, fontSize: 10.5, color: body, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.label}</span>
                <div style={{ flex: 1, position: "relative", height: 12, background: tint }}>
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: `${((b.from - lo) / span) * 100}%`, width: `${Math.max(3, ((b.to - b.from) / span) * 100)}%`, background: primary }} />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 112, flexShrink: 0 }} />
              <div style={{ flex: 1, position: "relative", height: 14, borderTop: `1px solid ${rule}` }}>
                {ticks.map((t) => (
                  <span key={t} style={{ position: "absolute", top: 3, left: `${((t - lo) / span) * 100}%`, transform: t === lo ? "none" : t === hi ? "translateX(-100%)" : "translateX(-50%)", fontSize: 10, color: muted, fontVariantNumeric: "tabular-nums" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ) : []
      ),
    projects: () =>
      data.projects.map((e) => (
        <div key={e.id} style={{ marginBottom: 14, breakInside: "avoid" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ink }}>{e.name}</div>
          {e.link && <div style={{ fontSize: 10.5, color: primary, marginTop: 2 }}>{e.link}</div>}
          <Bullets items={lines(e.description)} />
        </div>
      )),
  };

  const tr = { display: "flex", justifyContent: "space-between", gap: 10, fontSize: 11.2, lineHeight: 1.4, color: body, padding: "5px 0", borderBottom: `1px solid ${mix(primary, "#ffffff", 0.8)}` };
  const side = {
    education: () =>
      data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ink }}>{e.degree}</div>
          <div style={{ fontSize: 11.2, color: body, marginTop: 2 }}>{e.school}</div>
          <div style={{ fontSize: 10.5, color: muted, marginTop: 2 }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join("  |  ")}</div>
        </div>
      )),
    skills: () =>
      data.skills.map((s) => (
        <div key={s.id} style={{ marginBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.2, color: body, marginBottom: 3 }}>
            <span>{s.name}</span>
            <span style={{ fontWeight: 700, color: strong, fontVariantNumeric: "tabular-nums" }}>{s.level ?? 0}</span>
          </div>
          <div style={{ height: 6, background: mix(primary, "#ffffff", 0.82) }}>
            <div style={{ height: "100%", width: `${s.level ?? 0}%`, background: primary }} />
          </div>
        </div>
      )),
    languages: () =>
      data.languages.map((l) => (
        <div key={l.id} style={tr}>
          <span>{l.name}</span>
          <span style={{ fontWeight: 600, color: strong }}>{levelWord(l.level)}</span>
        </div>
      )),
    certifications: () =>
      data.certifications.map((c) => (
        <div key={c.id} style={{ ...tr, alignItems: "baseline" }}>
          <span>
            <span style={{ fontWeight: 600, color: ink }}>{c.name}</span>
            {c.issuer && <span style={{ display: "block", fontSize: 10.5, color: muted, marginTop: 1 }}>{c.issuer}</span>}
          </span>
          {c.year && <span style={{ fontWeight: 700, color: strong }}>{c.year}</span>}
        </div>
      )),
    interests: () => <div style={{ fontSize: 11.2, lineHeight: 1.6, color: body }}>{data.interests.map((i) => i.name).join("  ·  ")}</div>,
  };

  const mainKeys = pick(data, MAIN);
  const sideKeys = pick(data, SIDE);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: sans, color: ink, background: "#fff", boxSizing: "border-box", paddingBottom: 50 })}>
      {/* Report cover band */}
      <header style={{ background: primary, color: "#fff", padding: "34px 48px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 10.5, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: mix(primary, "#ffffff", 0.75) }}>
            <span style={{ width: 22, height: 3, background: theme.accent }} />
            Annual Report {year}
          </div>
          <h1 style={{ margin: "12px 0 0", fontFamily: serif, fontSize: 48, fontWeight: 600, lineHeight: 1.05, color: "#fff" }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 14, fontWeight: 300, letterSpacing: 0.5, marginTop: 6, color: mix(primary, "#ffffff", 0.88) }}>{p.title}</div>}
        </div>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ fontSize: 10.5, lineHeight: 1.75, textAlign: "right", color: mix(primary, "#ffffff", 0.88), borderLeft: `1px solid ${mix(primary, "#ffffff", 0.35)}`, paddingLeft: 18, flexShrink: 0 }}>
            {contacts.map((c) => (
              <div key={c.icon}>{c.value}</div>
            ))}
          </div>
        )}
      </header>

      {/* Key figures */}
      {figures.length > 0 && (
        <div style={{ margin: "22px 48px 8px", display: "flex", alignItems: "center", gap: 10, fontSize: 10.5, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: primary }}>
          Performance highlights
          <span style={{ flex: 1, height: 1, background: rule }} />
        </div>
      )}
      {figures.length > 0 && (
        <div style={{ margin: "0 48px", display: "grid", gridTemplateColumns: `repeat(${figures.length}, 1fr)`, background: tint, borderBottom: `3px solid ${accent}` }}>
          {figures.map((f, i) => (
            <div key={i} style={{ padding: "20px 16px 18px", borderLeft: i ? `1px solid ${mix(primary, "#ffffff", 0.75)}` : "none" }}>
              <div style={{ fontSize: 40, fontWeight: 300, lineHeight: 1, color: primary, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>{f.value}</div>
              <div style={{ fontSize: 10.5, lineHeight: 1.4, color: body, marginTop: 8 }}>{f.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 236px", gap: 30, padding: "28px 48px 0" }}>
        <div>
          {mainKeys.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 26 }}>
              <Heading k={k} />
              {main[k]()}
            </section>
          ))}
        </div>
        <aside style={{ background: tint, padding: "18px 18px 4px", alignSelf: "start", borderTop: `2px solid ${primary}` }}>
          {sideKeys.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 20 }}>
              <Heading k={k} small />
              {side[k]()}
            </section>
          ))}
        </aside>
      </div>

      {/* Footer folio */}
      <div style={{ position: "absolute", left: 48, right: 48, bottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: muted, borderTop: `1px solid ${rule}`, paddingTop: 9 }}>
        <span>{[p.name, `Annual Report ${year}`].filter(Boolean).join("  ·  ")}</span>
        <span style={{ fontWeight: 700, color: primary }}>01</span>
      </div>
    </div>
  );
}
