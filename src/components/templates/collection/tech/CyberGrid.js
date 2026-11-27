// Cyber Grid: dark page on a faint neon grid, HUD-bracketed header with a hexagon portrait, two columns with glowing section rails.
import { pageStyle, mix, lines, dateRange, Photo } from "../../shared";
import { SECTION_META, fontOf, photoOf, pick } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const HEX = "polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)";

export default function CyberGrid({ data, theme }) {
  const { primary, accent, dark } = theme;
  const p = data.personal;
  const mono = fontStack("plexmono");
  const bg = mix(mix(dark || "#161616", primary, 0.25), "#000000", 0.45);
  const panel = mix(bg, "#ffffff", 0.045);
  const neon = accent;
  const neonDim = mix(accent, bg, 0.55);
  const text = "#e2e8ef";
  const muted = "#9aa6b5";
  const fs = 12;

  const side = pick(data, ["skills", "languages", "certifications", "interests"]);
  const main = pick(data, ["summary", "experience", "projects", "education"]);
  const order = [...main, ...side];
  const num = (k) => String(order.indexOf(k) + 1).padStart(2, "0");

  const Heading = ({ k }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 11px" }}>
      <span style={{ fontFamily: mono, fontSize: 10.5, color: neon }}>[{num(k)}]</span>
      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff" }}>{SECTION_META[k].title}</span>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${neon}, ${mix(accent, bg, 0.85)})` }} />
      <span style={{ width: 6, height: 6, background: neon, transform: "rotate(45deg)" }} />
    </div>
  );

  const Corners = ({ size = 14, w = 2, color = neon }) =>
    [
      { top: 0, left: 0, borderTop: 1, borderLeft: 1 },
      { top: 0, right: 0, borderTop: 1, borderRight: 1 },
      { bottom: 0, left: 0, borderBottom: 1, borderLeft: 1 },
      { bottom: 0, right: 0, borderBottom: 1, borderRight: 1 },
    ].map((c, i) => {
      const st = { position: "absolute", width: size, height: size };
      for (const key of ["top", "left", "right", "bottom"]) if (key in c) st[key] = c[key];
      for (const key of ["borderTop", "borderLeft", "borderRight", "borderBottom"]) if (c[key]) st[key] = `${w}px solid ${color}`;
      return <span key={i} style={st} />;
    });

  const Entry = ({ title, sub, date, meta, bullets }) => (
    <div style={{ position: "relative", paddingLeft: 18, marginBottom: 16, breakInside: "avoid" }}>
      <span style={{ position: "absolute", left: 0, top: 5, width: 7, height: 7, border: `1.5px solid ${neon}`, transform: "rotate(45deg)", background: bg }} />
      <span style={{ position: "absolute", left: 4, top: 15, bottom: -8, width: 1, background: neonDim }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#ffffff" }}>{title}</div>
        {date && (
          <span style={{ fontFamily: mono, fontSize: 10, color: neon, border: `1px solid ${neonDim}`, padding: "1px 7px", whiteSpace: "nowrap" }}>{date}</span>
        )}
      </div>
      {(sub || meta) && (
        <div style={{ fontSize: 11.5, marginTop: 2 }}>
          {sub && <span style={{ color: neon, fontWeight: 600 }}>{sub}</span>}
          {meta && <span style={{ color: muted }}>{sub ? "  ·  " : ""}{meta}</span>}
        </div>
      )}
      {bullets.length > 0 && (
        <div style={{ marginTop: 5 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 9, fontSize: fs, lineHeight: 1.55, color: text, marginBottom: 2 }}>
              <span style={{ color: neon, fontFamily: mono, flexShrink: 0 }}>›</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: fs + 0.5, lineHeight: 1.65, color: text }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e) => (
        <Entry key={e.id} title={e.role} sub={e.company} date={dateRange(e.start, e.end)} meta={e.location} bullets={lines(e.bullets)} />
      ));
    if (k === "education")
      return data.education.map((e) => (
        <Entry key={e.id} title={e.degree} sub={e.school} date={dateRange(e.start, e.end)} meta={e.grade} bullets={[]} />
      ));
    if (k === "projects")
      return data.projects.map((e) => (
        <div key={e.id} style={{ position: "relative", padding: "11px 14px 10px", marginBottom: 10, background: panel, clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))", breakInside: "avoid" }}>
          <span style={{ position: "absolute", left: 0, top: 0, bottom: 14, width: 2, background: neon }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>{e.name}</span>
            {e.link && <span style={{ fontFamily: mono, fontSize: 10, color: neon }}>{e.link}</span>}
          </div>
          {lines(e.description).map((b, i) => (
            <div key={i} style={{ fontSize: fs, lineHeight: 1.55, color: text, marginTop: 4 }}>{b}</div>
          ))}
        </div>
      ));
    return null;
  };

  const sideBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => {
        const filled = Math.round(((s.level ?? 0) / 100) * 12);
        return (
          <div key={s.id} style={{ marginBottom: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: fs, color: text, marginBottom: 4 }}>
              <span>{s.name}</span>
              <span style={{ fontFamily: mono, fontSize: 10, color: muted }}>{s.level ?? 0}</span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} style={{ flex: 1, height: 5, transform: "skewX(-20deg)", background: i < filled ? neon : mix(bg, "#ffffff", 0.12) }} />
              ))}
            </div>
          </div>
        );
      });
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: fs, color: text, marginBottom: 7 }}>
          <span style={{ width: 70 }}>{l.name}</span>
          <span style={{ flex: 1, height: 3, background: mix(bg, "#ffffff", 0.12), position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${l.level ?? 0}%`, background: neon }} />
            <span style={{ position: "absolute", left: `calc(${l.level ?? 0}% - 3px)`, top: -2, width: 7, height: 7, background: neon, borderRadius: "50%" }} />
          </span>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", gap: 9, marginBottom: 8 }}>
          <Icon name="star" size={14} color={neon} />
          <div style={{ fontSize: fs, lineHeight: 1.35 }}>
            <div style={{ color: "#ffffff", fontWeight: 600 }}>{c.name}</div>
            <div style={{ color: muted, fontSize: 10.5, fontFamily: mono }}>{[c.issuer, c.year].filter(Boolean).join(" // ")}</div>
          </div>
        </div>
      ));
    if (k === "interests")
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.interests.map((i) => (
            <span key={i.id} style={{ fontSize: 10.5, padding: "3px 9px", border: `1px solid ${neonDim}`, color: text, textTransform: "uppercase", letterSpacing: 1 }}>{i.name}</span>
          ))}
        </div>
      );
    return null;
  };

  const contacts = [
    ["mail", p.email],
    ["phone", p.phone],
    ["pin", p.address],
    ["globe", p.website],
  ].filter((c) => c[1]);

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "spacegrotesk"),
        color: text,
        background: bg,
        backgroundImage: `radial-gradient(circle at 88% 4%, ${mix(accent, bg, 0.78)}, transparent 38%), linear-gradient(${mix(bg, accent, 0.07)} 1px, transparent 1px), linear-gradient(90deg, ${mix(bg, accent, 0.07)} 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 26px 26px, 26px 26px",
      })}
    >
      <div style={{ padding: "36px 40px 36px" }}>
        <header data-section="contact" style={{ marginBottom: 30 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, padding: "26px 28px" }}>
            <Corners />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: muted, letterSpacing: 2, marginBottom: 6 }}>&gt; PROFILE.SYS / LOADED</div>
              <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.05, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#ffffff", textShadow: `0 0 18px ${mix(accent, bg, 0.5)}` }}>
                {p.name}
              </h1>
              {p.title && <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: neon, marginTop: 8 }}>{p.title}</div>}
            </div>
            <div style={{ position: "relative", width: 118, height: 104, flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, clipPath: HEX, background: neon }} />
              <div style={{ position: "absolute", inset: 3, clipPath: HEX, overflow: "hidden", background: bg }}>
                <Photo src={photoOf(data, theme)} name={p.name} size={112} placeholderBg={mix(primary, bg, 0.3)} style={{ borderRadius: 0, width: 112, height: 98 }} />
              </div>
            </div>
          </div>
          {contacts.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${contacts.length}, auto)`, justifyContent: "space-between", gap: 10, marginTop: 12, padding: "9px 14px", background: panel, borderTop: `1px solid ${neonDim}`, borderBottom: `1px solid ${neonDim}` }}>
              {contacts.map(([icon, v]) => (
                <span key={icon} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: text, whiteSpace: "nowrap" }}>
                  <Icon name={icon} size={13} color={neon} />
                  {v}
                </span>
              ))}
            </div>
          )}
        </header>

        <div style={{ display: "flex", gap: 30 }}>
          <main style={{ flex: 1, minWidth: 0 }}>
            {main.map((k) => (
              <section key={k} data-section={k} style={{ marginBottom: 28 }}>
                <Heading k={k} />
                {mainBody(k)}
              </section>
            ))}
          </main>
          {side.length > 0 && (
            <aside style={{ width: 220, flexShrink: 0 }}>
              {side.map((k) => (
                <section key={k} data-section={k} style={{ position: "relative", marginBottom: 20, padding: "16px 16px 10px", background: panel }}>
                  <Corners size={8} w={1.5} color={neonDim} />
                  <Heading k={k} />
                  {sideBody(k)}
                </section>
              ))}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
