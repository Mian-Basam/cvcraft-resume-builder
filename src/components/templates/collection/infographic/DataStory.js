// The Data Story: single column report — numbered chapters with a serif lead, a career-arc Gantt chart on a year axis, outcome charts (bars, before/after columns, pictograms) keyed to the figures in each bullet, and a skills column chart.
import { pageStyle, lines, dateRange, mix, contactItems } from "../../shared";
import { pick, fontOf, levelWord } from "../../kit";
import { fontStack } from "@/lib/palettes";
import { metricOf, splitAt, yearOf } from "./metrics";

const W = 698; // content width
const LABEL_W = 168;
const FACT_KEYS = ["education", "certifications", "languages", "interests"];
const FACT_TITLES = { education: "Education", certifications: "Certifications", languages: "Languages", interests: "Interests" };

export default function DataStory({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const ink = "#15181f";
  const text = "#2d323c";
  const muted = "#6b7280";
  const hair = "#e2e5ea";
  const pale = mix(primary, "#ffffff", 0.86);
  const mid = mix(primary, "#ffffff", 0.5);
  const serif = fontStack("playfair");

  const keys = pick(data, ["summary", "experience", "projects", "skills", ...FACT_KEYS]);
  const chapters = keys.filter((k) => ["experience", "projects", "skills"].includes(k));
  const facts = keys.filter((k) => FACT_KEYS.includes(k));
  const numberOf = (k) => String(chapters.indexOf(k) + 1).padStart(2, "0");

  const Chapter = ({ k, title, note }) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, borderTop: `2px solid ${ink}`, paddingTop: 7, marginBottom: 12 }}>
      <span style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: primary, lineHeight: 1 }}>{numberOf(k)}</span>
      <h3 style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: ink }}>{title}</h3>
      {note && <span style={{ marginLeft: "auto", fontSize: 10.5, color: muted, fontStyle: "italic" }}>{note}</span>}
    </div>
  );

  // ---- Career arc: roles and study on one year axis.
  const bars = [];
  if (keys.includes("experience"))
    data.experience.forEach((e) => {
      const from = yearOf(e.start);
      if (from) bars.push({ id: e.id, label: e.role, from, to: Math.max(from, yearOf(e.end, true) || from), kind: "role", now: /present|now|current/i.test(e.end || "") });
    });
  if (keys.includes("education"))
    data.education.forEach((e) => {
      const from = yearOf(e.start) || yearOf(e.end);
      if (from) bars.push({ id: e.id, label: e.degree, from, to: Math.max(from, yearOf(e.end) || from), kind: "study" });
    });
  const certYears = keys.includes("certifications") ? data.certifications.map((c) => ({ id: c.id, y: yearOf(c.year), name: c.name })).filter((c) => c.y) : [];
  const allYears = [...bars.flatMap((b) => [b.from, b.to]), ...certYears.map((c) => c.y)];
  const y0 = allYears.length ? Math.min(...allYears) : 0;
  const y1 = allYears.length ? Math.max(...allYears) : 0;
  const span = Math.max(1, y1 - y0);
  const pct = (y) => ((y - y0) / span) * 100;
  const step = span > 14 ? 3 : span > 8 ? 2 : 1;
  const ticks = [];
  for (let y = y0; y <= y1; y += step) ticks.push(y);
  bars.sort((a, b) => a.from - b.from);

  const Arc = () => (
    <div style={{ marginBottom: 18 }}>
      {bars.map((b) => (
        <div key={b.id} style={{ display: "flex", alignItems: "center", height: 22 }}>
          <span style={{ width: LABEL_W, flexShrink: 0, fontSize: 11, color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 10 }}>{b.label}</span>
          <span style={{ flex: 1, position: "relative", height: "100%" }}>
            {ticks.map((t) => (
              <span key={t} style={{ position: "absolute", left: `${pct(t)}%`, top: 0, bottom: 0, borderLeft: `1px dotted ${hair}` }} />
            ))}
            <span
              style={{
                position: "absolute",
                top: 5,
                height: 12,
                left: `${pct(b.from)}%`,
                width: `max(10px, ${pct(b.to) - pct(b.from)}%)`,
                borderRadius: 2,
                background: b.kind === "study" ? `repeating-linear-gradient(135deg, ${mid} 0 3px, ${pale} 3px 6px)` : b.now ? primary : mid,
              }}
            />
          </span>
        </div>
      ))}
      {certYears.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", height: 22 }}>
          <span style={{ width: LABEL_W, flexShrink: 0, fontSize: 11, color: text, paddingRight: 10 }}>Certifications</span>
          <span style={{ flex: 1, position: "relative", height: "100%" }}>
            {certYears.map((c) => (
              <span key={c.id} style={{ position: "absolute", left: `${pct(c.y)}%`, top: 6, width: 10, height: 10, marginLeft: -5, background: accent, border: `1.5px solid ${primary}`, transform: "rotate(45deg)", boxSizing: "border-box" }} />
            ))}
          </span>
        </div>
      )}
      <div style={{ display: "flex", borderTop: `1px solid ${ink}`, marginTop: 2 }}>
        <span style={{ width: LABEL_W, flexShrink: 0 }} />
        <span style={{ flex: 1, position: "relative", height: 16 }}>
          {ticks.map((t) => (
            <span key={t} style={{ position: "absolute", left: `${pct(t)}%`, top: 3, transform: t === y0 ? "none" : t === y1 ? "translateX(-100%)" : "translateX(-50%)", fontSize: 10, color: muted }}>{t}</span>
          ))}
        </span>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 6, marginLeft: LABEL_W, fontSize: 10, color: muted }}>
        <Legend swatch={{ background: primary }} label="Current role" />
        <Legend swatch={{ background: mid }} label="Previous role" />
        {bars.some((b) => b.kind === "study") && <Legend swatch={{ background: `repeating-linear-gradient(135deg, ${mid} 0 3px, ${pale} 3px 6px)` }} label="Study" />}
        {certYears.length > 0 && <Legend swatch={{ background: accent, border: `1.5px solid ${primary}`, transform: "rotate(45deg) scale(0.8)" }} label="Certification" />}
      </div>
    </div>
  );
  const Legend = ({ swatch, label }) => (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 10, height: 10, borderRadius: 1, boxSizing: "border-box", ...swatch }} />
      {label}
    </span>
  );

  // ---- Outcome figure for one metric.
  const Figure = ({ m, tag }) => {
    let chart;
    if (m.kind === "percent") {
      chart = (
        <div style={{ height: 10, background: pale, borderRadius: 2, overflow: "hidden", marginTop: 5 }}>
          <div style={{ width: `${Math.min(100, m.n)}%`, height: "100%", background: primary }} />
        </div>
      );
    } else if (m.kind === "change") {
      const max = Math.max(m.from, m.to) || 1;
      const delta = m.from ? Math.round(((m.to - m.from) / m.from) * 100) : 0;
      chart = (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 40, marginTop: 4 }}>
          {[
            ["before", m.from, mid],
            ["after", m.to, primary],
          ].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 2 }}>
              <div style={{ width: 22, height: Math.max(3, (v / max) * 28), background: c, borderRadius: "2px 2px 0 0" }} />
              <span style={{ fontSize: 9.5, color: muted }}>{l}</span>
            </div>
          ))}
          {delta !== 0 && <span style={{ fontSize: 11, fontWeight: 800, color: ink, marginBottom: 14 }}>{delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`}%</span>}
        </div>
      );
    } else if (m.kind === "count" && m.n <= 30 && m.n >= 1) {
      chart = (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 5, maxWidth: 150 }}>
          {Array.from({ length: Math.round(m.n) }, (_, i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: primary }} />
          ))}
        </div>
      );
    } else {
      chart = (
        <div style={{ height: 10, marginTop: 5, background: `repeating-linear-gradient(90deg, ${primary} 0 6px, transparent 6px 9px)`, opacity: 0.85 }} />
      );
    }
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, color: ink, background: accent, borderRadius: 2, padding: "0 4px", lineHeight: "14px" }}>{tag}</span>
          <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: ink, lineHeight: 1 }}>{m.value}</span>
          {m.word && m.kind !== "change" && <span style={{ fontSize: 10.5, color: muted }}>{m.word}</span>}
          {m.kind === "change" && m.word && <span style={{ fontSize: 10.5, color: muted }}>{m.word}</span>}
        </div>
        {chart}
      </div>
    );
  };

  let tagIndex = 0;
  const nextTag = () => String.fromCharCode(65 + (tagIndex++ % 26));

  // An entry with its bullets on the left and the figures from those bullets on the right.
  // Bullets with their metric and a letter tag, numbered across the page (run in the page's own render).
  const tagged = (items) =>
    items.map((b) => {
      const m = metricOf(b);
      return { b, m, tag: m ? nextTag() : null };
    });

  const Story = ({ title, sub, date, ms }) => {
    const figs = ms.filter((x) => x.m);
    return (
      <div style={{ display: "flex", gap: 26, marginBottom: 16, breakInside: "avoid" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: ink, lineHeight: 1.3 }}>{title}</div>
            {date && <span style={{ fontSize: 10.5, fontWeight: 700, color: muted, whiteSpace: "nowrap" }}>{date}</span>}
          </div>
          {sub && <div style={{ fontSize: 11.5, fontWeight: 600, color: primary, marginTop: 2 }}>{sub}</div>}
          <div style={{ marginTop: 6 }}>
            {ms.map(({ b, m, tag }, i) => {
              const [a, num, c] = splitAt(b, m);
              return (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.6, color: text, marginBottom: 2 }}>
                  <span style={{ width: 14, flexShrink: 0, fontSize: 9.5, fontWeight: 800, color: tag ? ink : muted, textAlign: "center", paddingTop: 1 }}>{tag || "–"}</span>
                  <span>
                    {a}
                    {num && <strong style={{ color: ink, fontWeight: 800, boxShadow: `inset 0 -5px 0 ${mix(accent, "#ffffff", 0.35)}` }}>{num}</strong>}
                    {c}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {figs.length > 0 && (
          <div style={{ width: 196, flexShrink: 0, borderLeft: `1px solid ${hair}`, paddingLeft: 16, paddingTop: 2 }}>
            {figs.map((x) => (
              <Figure key={x.tag} m={x.m} tag={x.tag} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---- Skills column chart.
  const SkillChart = () => {
    const H = 92;
    const top = Math.max(...data.skills.map((x) => x.level || 0));
    return (
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ width: 28, flexShrink: 0, position: "relative", height: H }}>
          {[100, 50, 0].map((t) => (
            <span key={t} style={{ position: "absolute", right: 6, top: H - (t / 100) * H - 6, fontSize: 9.5, color: muted }}>{t}</span>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ position: "relative", height: H, borderBottom: `1px solid ${ink}`, display: "flex", alignItems: "flex-end", gap: 18, padding: "0 12px" }}>
            {[25, 50, 75, 100].map((t) => (
              <span key={t} style={{ position: "absolute", left: 0, right: 0, bottom: (t / 100) * H, borderTop: `1px dotted ${hair}` }} />
            ))}
            {data.skills.map((s, i) => (
              <div key={s.id} style={{ flex: 1, position: "relative", height: `${Math.min(100, s.level || 0)}%`, background: (s.level || 0) === top ? primary : mid, borderRadius: "3px 3px 0 0", maxWidth: 110 }}>
                <span style={{ position: "absolute", top: -16, left: 0, right: 0, textAlign: "center", fontSize: 10.5, fontWeight: 800, color: ink }}>{s.level || 0}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 18, padding: "5px 12px 0" }}>
            {data.skills.map((s) => (
              <div key={s.id} style={{ flex: 1, maxWidth: 110, textAlign: "center", fontSize: 10.5, lineHeight: 1.25, color: text }}>{s.name}</div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const factBody = (k) => {
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 7 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: ink, lineHeight: 1.35 }}>{e.degree}</div>
          <div style={{ fontSize: 11, color: text }}>{e.school}</div>
          <div style={{ fontSize: 10.5, color: muted }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: 7 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: ink, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontSize: 10.5, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ marginBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: ink }}>
            <span style={{ fontWeight: 700 }}>{l.name}</span>
            <span style={{ fontSize: 10.5, color: muted }}>{levelWord(l.level)}</span>
          </div>
          <div style={{ height: 4, background: pale, marginTop: 3 }}>
            <div style={{ height: "100%", width: `${Math.min(100, l.level || 0)}%`, background: primary }} />
          </div>
        </div>
      ));
    if (k === "interests") return <div style={{ fontSize: 11.5, color: text, lineHeight: 1.7 }}>{data.interests.map((i) => i.name).join(" · ")}</div>;
    return null;
  };

  const contacts = contactItems(p);
  const hasArc = bars.length > 0 && span >= 1;

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "sora"), color: text, padding: "40px 48px 30px", boxSizing: "border-box" })}>
      <header style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: muted, borderBottom: `1px solid ${hair}`, paddingBottom: 7, marginBottom: 14 }}>
          <span>Career report{y0 ? ` · ${y0}–${y1}` : ""}</span>
          {p.title && <span style={{ color: primary }}>{p.title}</span>}
        </div>
        <h1 style={{ margin: 0, fontFamily: serif, fontSize: 44, fontWeight: 700, color: ink, lineHeight: 1.02, letterSpacing: -0.5 }}>{p.name}</h1>
        {contacts.length > 0 && (
          <div data-section="contact" style={{ display: "flex", flexWrap: "wrap", gap: "4px 0", marginTop: 10, fontSize: 11, color: text }}>
            {contacts.map((c, i) => (
              <span key={c.icon} style={{ whiteSpace: "nowrap" }}>
                {i > 0 && <span style={{ color: mid, margin: "0 10px" }}>/</span>}
                {c.value}
              </span>
            ))}
          </div>
        )}
      </header>

      {keys.includes("summary") && (
        <section data-section="summary" style={{ marginBottom: 18, display: "flex", gap: 14 }}>
          <span style={{ width: 4, background: accent, flexShrink: 0 }} />
          <p style={{ margin: 0, fontFamily: serif, fontSize: 15, lineHeight: 1.55, color: ink, fontStyle: "italic" }}>{p.summary}</p>
        </section>
      )}

      {chapters.map((k) => {
        if (k === "experience")
          return (
            <section key={k} data-section={k} style={{ marginBottom: 14 }}>
              <Chapter k={k} title="Career arc & outcomes" note={hasArc ? "Fig. 1 — roles and study by year" : null} />
              {hasArc && <Arc />}
              {data.experience.map((e) => (
                <Story key={e.id} title={e.role} sub={[e.company, e.location].filter(Boolean).join(" · ")} date={dateRange(e.start, e.end)} ms={tagged(lines(e.bullets))} />
              ))}
            </section>
          );
        if (k === "projects")
          return (
            <section key={k} data-section={k} style={{ marginBottom: 14 }}>
              <Chapter k={k} title="Project outcomes" />
              {data.projects.map((e) => (
                <Story key={e.id} title={e.name} sub={e.link} ms={tagged(lines(e.description))} />
              ))}
            </section>
          );
        return (
          <section key={k} data-section={k} style={{ marginBottom: 20 }}>
            <Chapter k={k} title="Skills profile" note="Proficiency, 0–100" />
            <div style={{ paddingTop: 14 }}>
              <SkillChart />
            </div>
          </section>
        );
      })}

      {facts.length > 0 && (
        <div style={{ display: "flex", gap: 22, borderTop: `2px solid ${ink}`, paddingTop: 10 }}>
          {facts.map((k) => (
            <section key={k} data-section={k} style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: primary, marginBottom: 7 }}>{FACT_TITLES[k]}</div>
              {factBody(k)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
