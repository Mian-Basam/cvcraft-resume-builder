// The Achievement Dashboard: two columns under a KPI tile row — headline numbers pulled from the bullets (with mini meters), concise experience with highlighted figures, and a metrics rail with a skill bar chart and language gauges.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf, levelWord } from "../../kit";
import Icon from "../../Icon";
import { allMetrics, metricOf, splitAt, spans, yearsOfExperience } from "./metrics";

const MAIN_KEYS = ["summary", "experience", "projects", "education"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];
const TITLES = {
  summary: "Overview",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  interests: "Interests",
};
const ICONS = { summary: "user", experience: "experience", education: "education", projects: "code", skills: "skills", languages: "language", certifications: "star", interests: "heart" };
const KIND_RANK = { percent: 0, change: 1, money: 2, count: 3 };

export default function AchievementDashboard({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#131823";
  const text = "#2a303b";
  const muted = "#6a7280";
  const hair = "#e3e6eb";
  const track = mix(primary, "#ffffff", 0.88);
  const rail = mix(primary, "#ffffff", 0.95);

  const Heading = ({ k, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 12px" }}>
      <span style={{ width: 22, height: 22, borderRadius: 5, background: primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={ICONS[k] || "star"} size={12} color="#fff" />
      </span>
      <h3 style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: ink }}>{children}</h3>
    </div>
  );

  // Sentence with its key number set in bold primary.
  const Highlighted = ({ t }) => {
    const m = metricOf(t);
    const [a, b, c] = splitAt(t, m);
    return (
      <>
        {a}
        {b && <strong style={{ color: primary, fontWeight: 800 }}>{b}</strong>}
        {c}
      </>
    );
  };

  // KPI tiles: years of experience, then the strongest numbers from the bullets.
  const yrs = yearsOfExperience(data.experience);
  const roleSpans = spans(data.experience).sort((a, b) => a.from - b.from);
  const metrics = allMetrics(data)
    .map((m, i) => ({ ...m, i }))
    .sort((a, b) => KIND_RANK[a.kind] - KIND_RANK[b.kind] || a.i - b.i)
    .slice(0, yrs > 0 ? 3 : 4);
  const showKpis = pick(data, ["experience", "projects"]).length > 0 && (yrs > 0 || metrics.length > 0);

  const Mini = ({ m }) => {
    if (m.kind === "percent")
      return (
        <div style={{ height: 6, borderRadius: 3, background: track, overflow: "hidden" }}>
          <div style={{ width: `${Math.min(100, m.n)}%`, height: "100%", background: primary }} />
        </div>
      );
    if (m.kind === "change") {
      const max = Math.max(m.from, m.to) || 1;
      return (
        <div style={{ display: "grid", gap: 3 }}>
          {[
            ["before", m.from, mix(primary, "#ffffff", 0.6)],
            ["after", m.to, primary],
          ].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 34, fontSize: 9.5, color: muted }}>{l}</span>
              <span style={{ flex: 1, height: 5, borderRadius: 3, background: track, overflow: "hidden" }}>
                <span style={{ display: "block", width: `${(v / max) * 100}%`, height: "100%", background: c }} />
              </span>
            </div>
          ))}
        </div>
      );
    }
    const dots = Math.min(12, Math.max(1, Math.round(m.n > 12 ? 12 : m.n)));
    return (
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ flex: 1, height: 6, borderRadius: 2, background: i < dots ? primary : track }} />
        ))}
      </div>
    );
  };

  const Tile = ({ big, caption, source, children, filled }) => (
    <div style={{ flex: 1, minWidth: 0, borderRadius: 8, padding: "14px 14px 13px", background: filled ? primary : "#fff", border: filled ? "none" : `1px solid ${hair}`, boxShadow: filled ? "none" : "0 1px 2px rgba(16,24,40,0.05)", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: filled ? "#fff" : ink, letterSpacing: -0.8 }}>{big}</div>
      <div style={{ fontSize: 10.5, lineHeight: 1.4, color: filled ? mix(primary, "#ffffff", 0.8) : text, flex: 1 }}>{caption}</div>
      {children}
      {source && <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: filled ? accent : muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{source}</div>}
    </div>
  );

  const first = roleSpans.length ? roleSpans[0].from : 0;
  const last = roleSpans.length ? Math.max(...roleSpans.map((s) => s.to)) : 0;

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: text }}>{p.summary}</p>;
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: ink, lineHeight: 1.35 }}>{e.degree}</div>
            <div style={{ fontSize: 11.5, marginTop: 2 }}>
              <span style={{ color: primary, fontWeight: 600 }}>{e.school}</span>
              {e.grade && <span style={{ color: muted }}>{e.school ? ` · ${e.grade}` : e.grade}</span>}
            </div>
          </div>
          {dateRange(e.start, e.end) && <span style={{ fontSize: 10.5, fontWeight: 700, color: muted, whiteSpace: "nowrap", paddingTop: 2 }}>{dateRange(e.start, e.end)}</span>}
        </div>
      ));
    const rows =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, title: e.role, sub: [e.company, e.location].filter(Boolean).join(" · "), date: dateRange(e.start, e.end), bullets: lines(e.bullets) }))
        : data.projects.map((e) => ({ id: e.id, title: e.name, sub: e.link, date: "", bullets: lines(e.description) }));
    const tenure = k === "experience" && roleSpans.length > 1 && last > first && (
      <div style={{ border: `1px solid ${hair}`, borderRadius: 8, padding: "10px 14px 8px", marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: muted, marginBottom: 8 }}>Tenure by role</div>
        {[...roleSpans].reverse().map((s) => (
          <div key={s.e.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 132, flexShrink: 0, fontSize: 10.5, color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.e.role}</span>
            <span style={{ flex: 1, height: 12, position: "relative", background: `repeating-linear-gradient(90deg, ${hair} 0 1px, transparent 1px ${100 / (last - first)}%)` }}>
              <span style={{ position: "absolute", top: 0, bottom: 0, left: `${((s.from - first) / (last - first)) * 100}%`, width: `${(Math.max(0.4, s.to - s.from) / (last - first)) * 100}%`, background: s === roleSpans[roleSpans.length - 1] ? primary : mix(primary, "#ffffff", 0.45), borderRadius: 3 }} />
            </span>
            <span style={{ width: 24, flexShrink: 0, fontSize: 10, fontWeight: 800, color: ink, textAlign: "right" }}>{s.to - s.from}y</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: muted, marginLeft: 142, marginRight: 34 }}>
          <span>{first}</span>
          <span>{Math.round((first + last) / 2)}</span>
          <span>{last}</span>
        </div>
      </div>
    );
    return (
      <>
        {tenure}
        {rows.map((r, idx) => (
      <div key={r.id} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: idx < rows.length - 1 ? `1px dashed ${hair}` : "none", breakInside: "avoid" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: ink, lineHeight: 1.3 }}>{r.title}</div>
            {r.sub && <div style={{ fontSize: 11.5, color: primary, fontWeight: 600, marginTop: 2 }}>{r.sub}</div>}
          </div>
          {r.date && <span style={{ fontSize: 10.5, fontWeight: 700, color: ink, background: mix(accent, "#ffffff", 0.55), padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>{r.date}</span>}
        </div>
        {r.bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 9, fontSize: 12, lineHeight: 1.55, color: text, marginTop: i ? 4 : 8 }}>
            <span style={{ width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: `6px solid ${primary}`, flexShrink: 0, marginTop: 5 }} />
            <span>
              <Highlighted t={b} />
            </span>
          </div>
        ))}
      </div>
        ))}
      </>
    );
  };

  const Gauge = ({ value, label }) => {
    const r = 30;
    const len = Math.PI * r;
    return (
      <div style={{ textAlign: "center", width: 86 }}>
        <svg width="76" height="44" viewBox="0 0 76 44" style={{ display: "block", margin: "0 auto" }}>
          <path d="M8 40 A30 30 0 0 1 68 40" fill="none" stroke={track} strokeWidth="7" strokeLinecap="round" />
          <path d="M8 40 A30 30 0 0 1 68 40" fill="none" stroke={primary} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(len * Math.min(100, value || 0)) / 100} ${len}`} />
          <text x="38" y="38" textAnchor="middle" fontSize="12" fontWeight="800" fill={ink}>{value || 0}%</text>
        </svg>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: ink, marginTop: 3 }}>{label}</div>
        <div style={{ fontSize: 10, color: muted }}>{levelWord(value)}</div>
      </div>
    );
  };

  const sideBody = (k) => {
    if (k === "skills")
      return (
        <div>
          {data.skills.map((s) => (
            <div key={s.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: text, marginBottom: 3 }}>
                <span>{s.name}</span>
                <span style={{ fontWeight: 800, color: ink }}>{s.level || 0}</span>
              </div>
              <div style={{ height: 8, borderRadius: 2, background: track, position: "relative", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, s.level || 0)}%`, height: "100%", background: `linear-gradient(90deg, ${mix(primary, "#ffffff", 0.35)}, ${primary})` }} />
                {[25, 50, 75].map((t) => (
                  <span key={t} style={{ position: "absolute", left: `${t}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.7)" }} />
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: muted, marginTop: 2 }}>
            {[0, 25, 50, 75, 100].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      );
    if (k === "languages")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 8px" }}>
          {data.languages.map((l) => (
            <Gauge key={l.id} value={l.level} label={l.name} />
          ))}
        </div>
      );
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 9 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: ink, lineHeight: 1.35 }}>{e.degree}</div>
          {e.school && <div style={{ fontSize: 11.5, color: primary, fontWeight: 600, marginTop: 1 }}>{e.school}</div>}
          <div style={{ fontSize: 10.5, color: muted, marginTop: 2 }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: ink, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.interests.map((it) => (
            <span key={it.id} style={{ fontSize: 11, color: ink, background: "#fff", border: `1px solid ${hair}`, padding: "3px 9px", borderRadius: 4 }}>{it.name}</span>
          ))}
        </div>
      );
    return null;
  };

  const contacts = contactItems(p);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "manrope"), color: text, display: "flex", flexDirection: "column" })}>
      <header style={{ background: primary, color: "#fff", padding: "28px 44px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.08 }}>{p.name}</h1>
          {p.title && <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: accent, letterSpacing: 1.6, textTransform: "uppercase" }}>{p.title}</div>}
        </div>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "6px 18px", fontSize: 11, flexShrink: 0 }}>
            {contacts.map((c) => (
              <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>
                <Icon name={c.icon} size={12} color={accent} />
                {c.value}
              </span>
            ))}
          </div>
        )}
      </header>

      {showKpis && (
        <div style={{ padding: "20px 44px 4px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: ink }}>Key metrics</span>
            {first > 0 && <span style={{ fontSize: 10.5, color: muted }}>{first === last ? first : `${first} – ${last}`}</span>}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {yrs > 0 && (
              <Tile filled big={`${yrs}+`} caption={`years of professional experience across ${data.experience.length} ${data.experience.length === 1 ? "role" : "roles"}`} source="Career span">
                <div style={{ display: "flex", gap: 2, height: 6 }}>
                  {roleSpans.map((s) => (
                    <span key={s.e.id} style={{ flex: Math.max(1, s.to - s.from), background: accent, borderRadius: 2, opacity: 0.5 + (0.5 * (s.from - first + 1)) / (last - first + 1) }} />
                  ))}
                </div>
              </Tile>
            )}
            {metrics.map((m) => (
              <Tile key={m.text} big={m.value} caption={m.text} source={m.source}>
                <Mini m={m} />
              </Tile>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flex: 1, gap: 0, marginTop: 18 }}>
        <main style={{ flex: 1, minWidth: 0, padding: "4px 28px 24px 44px" }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 20 }}>
              <Heading k={k}>{TITLES[k]}</Heading>
              {mainBody(k)}
            </section>
          ))}
        </main>
        <aside style={{ width: 262, flexShrink: 0, boxSizing: "border-box", background: rail, padding: "20px 44px 30px 24px", borderTopLeftRadius: 14 }}>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 24 }}>
              <Heading k={k}>{TITLES[k]}</Heading>
              {sideBody(k)}
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
}
