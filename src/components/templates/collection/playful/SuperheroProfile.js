// The Superhero Profile: a comic-book page — inked panels, halftone dots, caption boxes, a speech-bubble origin story and power meters.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { fontOf, pick, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const INK = "#111111";
const SFX = ["ZAP!", "WHAM!", "BOOM!", "POW!"];

const dots = (color, size = 8, r = 1.3) => `radial-gradient(${color} ${r}px, transparent ${r + 0.4}px) 0 0 / ${size}px ${size}px`;

function burst(cx, cy, outer, inner, n = 14) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

export default function SuperheroProfile({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const bebas = fontStack("bebas");
  const yellow = mix(accent, "#ffe14d", 0.7);
  const paper = "#fdf8ec";
  const ink = INK;
  const muted = "#4a4a4a";

  const Panel = ({ k, label, children, style, bg = "#ffffff", grow = 1 }) => (
    <section
      data-section={k}
      style={{ position: "relative", flex: grow, minWidth: 0, background: bg, border: `3px solid ${ink}`, boxShadow: `4px 4px 0 ${ink}`, padding: "38px 14px 12px", boxSizing: "border-box", ...style }}
    >
      <div style={{ position: "absolute", left: -3, top: -3, background: yellow, border: `3px solid ${ink}`, padding: "3px 10px 1px", fontFamily: bebas, fontSize: 19, letterSpacing: 1, color: ink, lineHeight: 1.1 }}>{label}</div>
      {children}
    </section>
  );

  const pr = (k) => pick(data, [k]).length > 0;
  const contacts = contactItems(p);

  const mission = (e, i) => (
    <div key={e.id} style={{ position: "relative", flex: 1, minWidth: 0, background: "#ffffff", border: `3px solid ${ink}`, boxShadow: `4px 4px 0 ${ink}`, padding: "0 14px 12px", boxSizing: "border-box" }}>
      <div style={{ display: "inline-block", margin: "0 0 8px -14px", background: yellow, borderRight: `3px solid ${ink}`, borderBottom: `3px solid ${ink}`, padding: "4px 10px 3px", fontSize: 10.5, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", color: ink }}>
        {i === 0 ? "Our story continues" : "Meanwhile"}, {dateRange(e.start, e.end) || "earlier"}…
      </div>
      <div style={{ fontFamily: bebas, fontSize: 24, lineHeight: 1, color: primary, letterSpacing: 0.5 }}>{e.role}</div>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: muted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.4 }}>{[e.company, e.location].filter(Boolean).join(" · ")}</div>
      {lines(e.bullets).map((b, j) => (
        <div key={j} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5, marginTop: 5, color: ink }}>
          <span style={{ color: primary, fontWeight: 900, flexShrink: 0 }}>★</span>
          <span>{b}</span>
        </div>
      ))}
      <div style={{ height: 22 }} />
      <span style={{ position: "absolute", right: 10, bottom: 6, fontFamily: bebas, fontSize: 22, letterSpacing: 1, color: yellow, WebkitTextStroke: `1px ${ink}`, transform: "rotate(-8deg)" }}>{SFX[i % SFX.length]}</span>
    </div>
  );

  const row4 = ["education", "projects", "certifications"].filter(pr);
  const row5 = ["languages", "interests"].filter(pr);

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "nunito"), color: ink, background: `${dots(mix(primary, paper, 0.82), 9, 1.4)}, ${paper}`, padding: "20px 24px 18px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 15 })}>
      {/* cover panel */}
      <header style={{ position: "relative", border: `3px solid ${ink}`, boxShadow: `4px 4px 0 ${ink}`, background: `${dots(mix(primary, "#ffffff", 0.22), 10, 2.2)}, ${primary}`, padding: "18px 22px 18px", overflow: "hidden", minHeight: 204, boxSizing: "border-box" }}>
        <svg width="420" height="300" style={{ position: "absolute", right: -60, top: -40, opacity: 0.25 }}>
          {Array.from({ length: 18 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 18;
            return <polygon key={i} points={`250,150 ${250 + 400 * Math.cos(a)},${150 + 400 * Math.sin(a)} ${250 + 400 * Math.cos(a + 0.12)},${150 + 400 * Math.sin(a + 0.12)}`} fill="#ffffff" />;
          })}
        </svg>
        <div style={{ position: "relative", display: "inline-block", background: yellow, border: `3px solid ${ink}`, padding: "3px 12px 1px", fontFamily: bebas, fontSize: 20, letterSpacing: 2, color: ink, transform: "rotate(-2deg)" }}>
          Issue #1 · The Amazing
        </div>
        <h1 style={{ position: "relative", margin: "8px 0 0", fontFamily: bebas, fontWeight: 400, fontSize: 82, lineHeight: 0.88, letterSpacing: 1.5, color: "#ffffff", textShadow: `4px 4px 0 ${ink}`, WebkitTextStroke: `1.5px ${ink}`, maxWidth: 520 }}>{p.name}</h1>
        {p.title && (
          <div style={{ position: "relative", display: "inline-block", marginTop: 12, background: "#ffffff", border: `3px solid ${ink}`, padding: "5px 12px", fontSize: 12.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6, color: ink }}>
            Mild-mannered <span style={{ color: primary }}>{p.title}</span> by day…
          </div>
        )}
        <div style={{ position: "absolute", right: 18, top: 14, width: 190, height: 190 }}>
          <svg width="190" height="190" viewBox="0 0 190 190" style={{ position: "absolute", inset: 0 }}>
            <polygon points={burst(95, 95, 92, 62, 13)} fill={ink} transform="translate(4 4)" />
            <polygon points={burst(95, 95, 92, 62, 13)} fill={yellow} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-8deg)", textAlign: "center", color: ink }}>
            <span style={{ fontFamily: bebas, fontSize: 44, lineHeight: 0.9, color: primary, WebkitTextStroke: `1px ${ink}` }}>KA-POW!</span>
            <span style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: 1, marginTop: 2 }}>NOW AVAILABLE</span>
            <span style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: 1 }}>FOR HIRE</span>
          </div>
        </div>
      </header>

      {/* origin story + superpowers */}
      {(pr("summary") || pr("skills") || contacts.length > 0) && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1.35, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {pr("summary") && (
              <Panel k="summary" label="Origin story" bg={`${dots(mix(accent, "#ffffff", 0.55), 7, 1.1)}, #ffffff`}>
                <div style={{ position: "relative", background: "#ffffff", border: `2.5px solid ${ink}`, borderRadius: "50% / 42%", padding: "20px 30px", marginBottom: 16, textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, fontWeight: 600, color: ink }}>{p.summary}</p>
                  <svg width="36" height="28" style={{ position: "absolute", left: "36%", bottom: -24 }}>
                    <path d="M3,3 L12,26 L30,3" fill="#ffffff" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
                    <rect x="0" y="0" width="36" height="5.2" fill="#ffffff" />
                  </svg>
                </div>
              </Panel>
            )}
            {contacts.length > 0 && (
              <div data-section="contact" style={{ position: "relative", background: ink, color: "#ffffff", border: `3px solid ${ink}`, boxShadow: `4px 4px 0 ${primary}`, padding: "10px 14px" }}>
                <div style={{ fontFamily: bebas, fontSize: 18, letterSpacing: 1.5, color: yellow, marginBottom: 5 }}>Signal the hero</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 14px" }}>
                  {contacts.map((c) => (
                    <span key={c.icon} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, minWidth: 0, wordBreak: "break-word" }}>
                      <Icon name={c.icon} size={13} color={yellow} />
                      {c.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {pr("skills") && (
            <Panel k="skills" label="Professional superpowers" grow={1}>
              {data.skills.map((s) => (
                <div key={s.id} style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, color: ink }}>
                    <span>{s.name}</span>
                    <span style={{ fontFamily: bebas, fontSize: 15, letterSpacing: 1, color: primary }}>PWR {s.level ?? 0}</span>
                  </div>
                  <div style={{ height: 11, border: `2px solid ${ink}`, background: "#ffffff", marginTop: 3, boxSizing: "border-box" }}>
                    <div style={{ height: "100%", width: `${s.level ?? 0}%`, background: `${dots(mix(primary, "#000000", 0.25), 5, 1.2)}, ${mix(primary, "#ffffff", 0.25)}`, borderRight: `2px solid ${ink}`, boxSizing: "border-box" }} />
                  </div>
                </div>
              ))}
            </Panel>
          )}
        </div>
      )}

      {/* career missions */}
      {pr("experience") && (
        <section data-section="experience">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ background: ink, color: yellow, fontFamily: bebas, fontSize: 22, letterSpacing: 1.5, padding: "3px 12px 1px", transform: "skew(-8deg)" }}>Career missions</span>
            <span style={{ flex: 1, height: 3, background: ink }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {data.experience.map((e, i) => (
              <div key={e.id} style={{ flex: "1 1 300px", minWidth: 0, display: "flex" }}>{mission(e, i)}</div>
            ))}
          </div>
        </section>
      )}

      {row4.length > 0 && (
        <div style={{ display: "flex", gap: 16 }}>
          {row4.map((k) => {
            if (k === "education")
              return (
                <Panel key={k} k={k} label="Training grounds">
                  {data.education.map((e, i) => (
                    <div key={e.id} style={{ marginTop: i ? 8 : 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: ink }}>{e.degree}</div>
                      <div style={{ fontSize: 11.5, color: muted, fontWeight: 600 }}>{e.school}</div>
                      <div style={{ fontSize: 11, color: primary, fontWeight: 800 }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>
                    </div>
                  ))}
                </Panel>
              );
            if (k === "projects")
              return (
                <Panel key={k} k={k} label="Special missions" grow={1.3}>
                  {data.projects.map((e, i) => (
                    <div key={e.id} style={{ marginTop: i ? 8 : 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: ink }}>{e.name}</div>
                      {e.link && <div style={{ fontSize: 11, color: primary, fontWeight: 700 }}>{e.link}</div>}
                      {lines(e.description).map((b, j) => (
                        <div key={j} style={{ fontSize: 11.5, lineHeight: 1.45, color: ink, marginTop: 2 }}>{b}</div>
                      ))}
                    </div>
                  ))}
                </Panel>
              );
            return (
              <Panel key={k} k={k} label="Medals of honour">
                {data.certifications.map((c, i) => (
                  <div key={c.id} style={{ display: "flex", gap: 9, marginTop: i ? 8 : 0 }}>
                    <svg width="26" height="30" viewBox="0 0 26 30" style={{ flexShrink: 0 }}>
                      <path d="M7,0 L13,10 L19,0" fill={primary} stroke={ink} strokeWidth="1.5" />
                      <circle cx="13" cy="19" r="9" fill={yellow} stroke={ink} strokeWidth="2" />
                      <text x="13" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill={ink}>★</text>
                    </svg>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 900, color: ink, lineHeight: 1.3 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
                    </div>
                  </div>
                ))}
              </Panel>
            );
          })}
        </div>
      )}

      {row5.length > 0 && (
        <div style={{ display: "flex", gap: 16 }}>
          {row5.map((k) =>
            k === "languages" ? (
              <Panel key={k} k={k} label="Universal translator">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
                  {data.languages.map((l) => (
                    <span key={l.id} style={{ fontSize: 12, color: ink }}>
                      <b>{l.name}</b> <span style={{ color: muted }}>· {levelWord(l.level)}</span>
                    </span>
                  ))}
                </div>
              </Panel>
            ) : (
              <Panel key={k} k={k} label="Off-duty adventures" bg={`${dots(mix(primary, "#ffffff", 0.82), 7, 1.1)}, #ffffff`}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {data.interests.map((it) => (
                    <span key={it.id} style={{ fontSize: 11.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5, background: "#ffffff", border: `2px solid ${ink}`, borderRadius: 999, padding: "3px 11px", color: ink }}>{it.name}</span>
                  ))}
                </div>
              </Panel>
            )
          )}
        </div>
      )}

      <div style={{ marginTop: "auto", textAlign: "right", fontFamily: bebas, fontSize: 18, letterSpacing: 1.5, color: ink }}>
        To be continued… <span style={{ color: primary }}>at your company?</span>
      </div>
    </div>
  );
}
