import Icon from "../Icon";
import { BulletList, Photo, contactItems, dateRange, lines, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";

const MID_KEYS = ["languages", "interests"];
const END_KEYS = ["certifications", "projects"];

function yearOf(text, fallback) {
  if (!text || /present|now|current/i.test(text)) return fallback;
  const m = String(text).match(/\d{4}/);
  return m ? Number(m[0]) : null;
}

// Premium infographic: Gantt-style career timeline across a year axis, colour-tagged cards,
// and skill bars with letter badges.
export default function Milestone({ data, theme }) {
  const { primary, accent, light, dark } = theme;
  const p = data.personal;
  const colors = [primary, accent, mix(primary, accent, 0.5), mix(primary, "#000000", 0.35)];
  const thisYear = new Date().getFullYear();
  const showExp = pick(data, ["experience"]).length > 0;
  const showEdu = pick(data, ["education"]).length > 0;

  const entries = [
    ...(showEdu ? data.education.map((e) => ({ id: e.id, kind: "education", title: e.degree, sub: [e.school, e.grade].filter(Boolean).join(" · "), start: e.start, end: e.end, bullets: [] })) : []),
    ...(showExp ? data.experience.map((e) => ({ id: e.id, kind: "experience", title: e.role, sub: [e.company, e.location].filter(Boolean).join(", "), start: e.start, end: e.end, bullets: lines(e.bullets) })) : []),
  ]
    .map((e, i) => ({ ...e, color: colors[i % colors.length], s: yearOf(e.start, null), e2: yearOf(e.end, thisYear) }))
    .sort((a, b) => (a.s ?? 9999) - (b.s ?? 9999));

  const dated = entries.filter((e) => e.s);
  const minY = dated.length ? Math.min(...dated.map((e) => e.s)) : thisYear - 4;
  const maxY = Math.max(minY + 3, ...dated.map((e) => Math.max(e.s, e.e2 ?? e.s)));
  const span = maxY - minY + 1;
  const years = Array.from({ length: span }, (_, i) => minY + i);

  const Heading = ({ title, icon }) => (
    <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: dark, margin: "0 0 12px" }}>
      <Icon name={icon} size={16} color={primary} strokeWidth={2.4} />
      {title}
    </h3>
  );
  const sideOpts = { primary, light, text: "#262626", muted: "#6b6b6b", fs: 11, dateStyle: "below", langStyle: "rings", interestStyle: "icons", barColor: primary, track: light };
  const abbr = (name) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "montserrat"), color: "#262626", padding: "34px 40px" })}>
      <header style={{ display: "flex", alignItems: "center", gap: 22, paddingBottom: 18, borderBottom: `2px solid ${light}` }}>
        <div style={{ padding: 5, borderRadius: "50%", background: primary }}>
          <Photo src={photoOf(data, theme)} name={p.name} size={118} placeholderBg={mix(primary, "#ffffff", 0.2)} style={{ border: "4px solid #fff" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: dark, lineHeight: 1.1 }}>{p.name}</h1>
          {p.title && <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: primary, marginTop: 6 }}>{p.title}</div>}
          {pick(data, ["summary"]).length > 0 && <p style={{ fontSize: 10.5, lineHeight: 1.5, color: "#555", margin: "8px 0 0" }}>{p.summary}</p>}
        </div>
        <div style={{ width: 200, flexShrink: 0 }}>
          {contactItems(p).map((c) => (
            <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10.5, marginBottom: 7 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={c.icon} size={11} color={dark} strokeWidth={2.4} />
              </span>
              <span style={{ wordBreak: "break-word" }}>{c.value}</span>
            </div>
          ))}
        </div>
      </header>

      {dated.length > 0 && (
        <section data-section="experience" style={{ marginTop: 18 }}>
          <Heading title="Career timeline" icon="experience" />
          <div style={{ position: "relative" }}>
            {dated.map((e) => {
              const left = ((e.s - minY) / span) * 100;
              const width = Math.max(4, (((e.e2 ?? e.s) - e.s + 1) / span) * 100);
              return (
                <div key={e.id} style={{ position: "relative", height: 30 }}>
                  <div style={{ position: "absolute", left: `${left}%`, width: `${Math.min(width, 100 - left)}%`, top: 0 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, whiteSpace: "nowrap", color: e.color === accent ? mix(accent, "#000000", 0.4) : e.color, marginBottom: 2 }}>
                      {e.title}
                    </div>
                    <div style={{ height: 12, borderRadius: 999, background: e.color }} />
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", marginTop: 4, borderRadius: 6, overflow: "hidden" }}>
              {years.map((y, i) => (
                <div key={y} style={{ flex: 1, textAlign: "center", fontSize: 10.5, fontWeight: 700, color: "#fff", padding: "5px 0", background: i % 2 ? mix(primary, "#ffffff", 0.15) : primary }}>
                  {y}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {entries.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          {entries.map((e) => (
            <div key={e.id} style={{ borderLeft: `5px solid ${e.color}`, background: "#fafafa", borderRadius: 8, padding: "10px 12px", breakInside: "avoid" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>{SECTION_META[e.kind].title}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: e.color, borderRadius: 4, padding: "1px 6px" }}>{dateRange(e.start, e.end)}</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 4 }}>{e.title}</div>
              {e.sub && <div style={{ fontSize: 11, color: primary, fontWeight: 600 }}>{e.sub}</div>}
              <BulletList items={e.bullets} style={{ fontSize: 10.5, lineHeight: 1.45, marginTop: 4 }} />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 22, marginTop: 18 }}>
        {pick(data, ["skills"]).length > 0 && (
          <section data-section="skills" style={{ flex: 1 }}>
            <Heading title="Skills" icon="skills" />
            {data.skills.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: 6, background: colors[i % colors.length], color: "#fff", fontSize: 10.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {abbr(s.name)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11 }}>{s.name}</div>
                  <div style={{ height: 7, borderRadius: 4, background: light, marginTop: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.level ?? 0}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
        {[MID_KEYS, END_KEYS].map((keys, i) => (
          <div key={i} style={{ width: 190, flexShrink: 0 }}>
            {pick(data, keys).map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 14 }}>
                <Heading title={SECTION_META[k].title} icon={SECTION_META[k].icon} />
                <SectionBody k={k} data={data} o={sideOpts} />
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
