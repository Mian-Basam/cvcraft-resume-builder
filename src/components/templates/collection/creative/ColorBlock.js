// Color Block: flush full-bleed colour panels — a split header and a stacked panel column — with geometric shapes as section marks.
import { pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["summary", "experience", "education", "projects"];
const SIDE_KEYS = ["skills", "languages", "certifications", "interests"];

function Shape({ i, color, size = 14 }) {
  const s = size;
  const kind = i % 4;
  if (kind === 0) return <span style={{ width: s, height: s, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
  if (kind === 1) return <span style={{ width: s, height: s, background: color, display: "inline-block", flexShrink: 0 }} />;
  if (kind === 2)
    return (
      <svg width={s} height={s} viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
        <polygon points="0,10 5,0 10,10" fill={color} />
      </svg>
    );
  return <span style={{ width: s, height: s / 2, borderRadius: `${s}px ${s}px 0 0`, background: color, display: "inline-block", flexShrink: 0 }} />;
}

export default function ColorBlock({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const display = fontStack("sora");
  const dark = theme.dark || "#1b1b1b";
  const ink = mix(dark, primary, 0.2);
  const muted = mix(ink, "#ffffff", 0.4);
  const tint = mix(primary, "#ffffff", 0.86);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);

  const mainKeys = pick(data, MAIN_KEYS);
  const sideKeys = pick(data, SIDE_KEYS);

  // Panel colour scheme for the stacked side column.
  const panels = [
    { bg: dark, text: "#ffffff", sub: "rgba(255,255,255,0.7)", bar: accent, track: "rgba(255,255,255,0.18)", deco: (c) => <span style={{ position: "absolute", right: 0, top: 0, width: 54, height: 54, borderBottomLeftRadius: 54, background: c.accent }} /> },
    { bg: accent, text: ink, sub: mix(ink, accent, 0.3), bar: primary, track: mix(accent, "#ffffff", 0.5), deco: (c) => (
      <svg width="46" height="46" style={{ position: "absolute", right: 0, top: 0 }}><polygon points="0,0 46,0 46,46" fill={c.primary} /></svg>
    ) },
    { bg: tint, text: ink, sub: muted, bar: primary, track: mix(primary, "#ffffff", 0.7), deco: (c) => <span style={{ position: "absolute", right: 16, top: 16, width: 28, height: 28, borderRadius: "50%", border: `6px solid ${c.primary}` }} /> },
    { bg: primary, text: "#ffffff", sub: "rgba(255,255,255,0.75)", bar: accent, track: "rgba(255,255,255,0.2)", deco: (c) => (
      <svg width="40" height="28" style={{ position: "absolute", right: 16, top: 18 }}>
        {Array.from({ length: 12 }, (_, j) => <circle key={j} cx={4 + (j % 4) * 11} cy={4 + Math.floor(j / 4) * 10} r="2.6" fill={c.accent} />)}
      </svg>
    ) },
  ];

  const Entries = ({ k }) => {
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, t: e.role, s: [e.company, e.location].filter(Boolean).join(" · "), d: dateRange(e.start, e.end), b: lines(e.bullets) }))
        : k === "education"
        ? data.education.map((e) => ({ id: e.id, t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" · "), d: dateRange(e.start, e.end), b: [] }))
        : data.projects.map((e) => ({ id: e.id, t: e.name, s: e.link, d: "", b: lines(e.description) }));
    return items.map((e) => (
      <div key={e.id} style={{ display: "grid", gridTemplateColumns: "104px 1fr", columnGap: 12, marginBottom: 16, breakInside: "avoid" }}>
        <div>
          {e.d && <div style={{ display: "inline-block", fontFamily: display, fontSize: 10.5, fontWeight: 700, color: ink, background: tint, padding: "3px 7px", lineHeight: 1.35, whiteSpace: "nowrap" }}>{e.d}</div>}
        </div>
        <div>
          <div style={{ fontFamily: display, fontSize: 14, fontWeight: 700, color: ink }}>{e.t}</div>
          {e.s && <div style={{ fontSize: 11.5, fontWeight: 600, color: primary, marginTop: 1 }}>{e.s}</div>}
          {e.b.map((b, n) => (
            <div key={n} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5, color: ink, marginTop: 4 }}>
              <span style={{ width: 6, height: 6, background: accent, outline: `1px solid ${primary}`, flexShrink: 0, marginTop: 6 }} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "poppins"), color: ink, background: "#ffffff", display: "flex", flexDirection: "column" })}>
      {/* header: two flush panels */}
      <header style={{ display: "flex", minHeight: 256 }}>
        <div style={{ flex: 1, background: primary, color: "#fff", padding: "44px 40px 36px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <span style={{ position: "absolute", right: -70, top: -70, width: 200, height: 200, borderRadius: "50%", background: mix(primary, "#ffffff", 0.1) }} />
          <span style={{ position: "absolute", right: 40, top: 34, width: 34, height: 34, background: accent }} />
          <span style={{ position: "absolute", right: 82, top: 76, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: `24px solid ${mix(primary, "#ffffff", 0.35)}` }} />
          <h1 style={{ position: "relative", fontFamily: display, fontSize: 58, fontWeight: 800, lineHeight: 0.96, letterSpacing: -2, margin: 0 }}>
            {words.map((w, i) => (
              <div key={i} style={{ color: i % 2 ? accent : "#fff" }}>{w}</div>
            ))}
          </h1>
          {p.title && (
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" }}>
              <span style={{ width: 28, height: 3, background: accent }} />
              {p.title}
            </div>
          )}
        </div>
        <div data-section="contact" style={{ borderRadius: 0, width: 290, flexShrink: 0, background: accent, padding: "44px 28px 30px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <span style={{ position: "absolute", left: 0, top: 0, width: 92, height: 46, borderRadius: "0 0 92px 92px", background: primary }} />
          <span style={{ position: "absolute", right: 22, top: 22, width: 46, height: 46, borderRadius: "50%", border: `3px solid ${ink}` }} />
          <ContactList p={p} fs={11.5} iconColor={ink} color={ink} gap={8} />
        </div>
      </header>

      <div style={{ flex: 1, display: "flex" }}>
        <main style={{ flex: 1, minWidth: 0, padding: "34px 32px 26px 40px" }}>
          {mainKeys.map((k, i) => (
            <section key={k} data-section={k} style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Shape i={i} color={i % 2 ? accent : primary} />
                <h3 style={{ fontFamily: display, fontSize: 14, fontWeight: 800, letterSpacing: 2.4, textTransform: "uppercase", color: ink, margin: 0 }}>{SECTION_META[k].title}</h3>
                <span style={{ flex: 1, height: 2, background: tint }} />
              </div>
              {k === "summary" ? (
                <p style={{ fontSize: 13.5, lineHeight: 1.65, margin: 0, color: ink }}>{p.summary}</p>
              ) : (
                <Entries k={k} />
              )}
            </section>
          ))}
        </main>

        <aside style={{ width: 290, flexShrink: 0, display: "flex", flexDirection: "column" }}>
          {sideKeys.map((k, i) => {
            const c = panels[i % panels.length];
            const o = {
              primary: c.bar, text: c.text, muted: c.sub, titleColor: c.text, subColor: c.sub, fs: 11.5, dateStyle: "below",
              skillStyle: "bars", langStyle: "segments", interestStyle: "tags", barColor: c.bar, track: c.track,
              tagBg: "transparent", tagColor: c.text, tagBorder: c.sub,
            };
            return (
              <section key={k} data-section={k} style={{ borderRadius: 0, position: "relative", overflow: "hidden", background: c.bg, color: c.text, padding: "26px 28px 24px", display: "flex", flexDirection: "column", flex: i === sideKeys.length - 1 ? 1 : "none" }}>
                {c.deco({ primary, accent })}
                <h3 style={{ fontFamily: display, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, textTransform: "uppercase", color: c.text, margin: "0 0 14px" }}>{SECTION_META[k].title}</h3>
                <div><SectionBody k={k} data={data} o={o} /></div>
                {i === sideKeys.length - 1 && (
                  <svg width="234" height="84" viewBox="0 0 234 84" style={{ marginTop: "auto", paddingTop: 24, display: "block", flexShrink: 0 }}>
                    <circle cx="42" cy="42" r="42" fill={c.bar} />
                    <rect x="96" y="0" width="84" height="84" fill="none" stroke={c.text} strokeWidth="3" opacity="0.6" />
                    <path d="M192 84 A42 42 0 0 1 234 42 L234 84 Z" fill={c.bar} />
                    <polygon points="120,84 150,32 180,84" fill={c.bar} opacity="0.55" />
                  </svg>
                )}
              </section>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
