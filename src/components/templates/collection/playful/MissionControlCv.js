// The Mission Control CV: a two-column flight console — mission patch, systems-status skills with green GO lights, a mission log and a GO/NO-GO poll.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { fontOf, pick, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const MAIN = ["summary", "experience", "projects", "education", "certifications"];
const SIDE = ["skills", "languages", "interests"];
const TITLES = {
  summary: "Mission briefing",
  experience: "Mission log",
  projects: "Payloads deployed",
  education: "Flight training",
  certifications: "Commendations",
  skills: "Systems status",
  languages: "Comms protocols",
  interests: "Off-duty activities",
};

const GO = "#22c55e";
const HOLD = "#f59e0b";

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function MissionControlCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const mono = fontStack("plexmono");
  const bebas = fontStack("bebas");
  const ink = mix(theme.dark || "#1b1b1b", primary, 0.2);
  const muted = mix(ink, "#ffffff", 0.42);
  const consoleBg = mix(primary, "#05070d", 0.45);
  const panel = mix(consoleBg, "#ffffff", 0.07);
  const onDark = "#e8edf5";
  const onDarkMuted = mix(onDark, consoleBg, 0.35);
  const grid = mix(primary, "#ffffff", 0.94);
  const lineC = mix(primary, "#ffffff", 0.8);

  const led = (color, size = 9) => (
    <span style={{ width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 0 2px ${mix(color, "#ffffff", 0.6)}`, flexShrink: 0, display: "inline-block" }} />
  );

  const MainHead = ({ k, n }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: primary }}>{String(n).padStart(2, "0")} //</span>
      <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, letterSpacing: 2.2, textTransform: "uppercase", color: ink }}>{TITLES[k]}</span>
      <span style={{ flex: 1, height: 1, background: lineC }} />
    </div>
  );
  const SideHead = ({ k }) => (
    <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${mix(onDark, consoleBg, 0.75)}`, paddingBottom: 5, marginBottom: 10 }}>
      {TITLES[k]}
    </div>
  );

  const tag = (text, color) => (
    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1, color, border: `1.5px solid ${color}`, borderRadius: 3, padding: "1px 6px", whiteSpace: "nowrap" }}>{text}</span>
  );

  const mainBody = (k) => {
    if (k === "summary") return <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: ink }}>{p.summary}</p>;
    if (k === "experience")
      return data.experience.map((e, i) => {
        const active = /present|now|current/i.test(e.end || "") || !e.end;
        return (
          <div key={e.id} style={{ position: "relative", paddingLeft: 18, marginTop: i ? 18 : 0, breakInside: "avoid" }}>
            <span style={{ position: "absolute", left: 0, top: 4, width: 9, height: 9, borderRadius: "50%", border: `2px solid ${primary}`, background: active ? primary : "#ffffff" }} />
            {i < data.experience.length - 1 && <span style={{ position: "absolute", left: 5, top: 17, bottom: -12, width: 1.5, background: lineC }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: 10.5, color: muted }}>
              <span style={{ fontWeight: 700, color: primary }}>LOG {String(i + 1).padStart(3, "0")}</span>
              <span>T: {dateRange(e.start, e.end)}</span>
              <span style={{ marginLeft: "auto" }}>{active ? tag("● IN FLIGHT", "#16a34a") : tag("✓ COMPLETE", muted)}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: ink, marginTop: 3 }}>{e.role}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: muted }}>{[e.company, e.location].filter(Boolean).join(" · ")}</div>
            {lines(e.bullets).map((b, j) => (
              <div key={j} style={{ display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.5, marginTop: 5, color: ink }}>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: "#16a34a", flexShrink: 0, marginTop: 2 }}>[OK]</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        );
      });
    if (k === "projects")
      return data.projects.map((e, i) => (
        <div key={e.id} style={{ marginTop: i ? 10 : 0, border: `1px solid ${lineC}`, borderLeft: `4px solid ${primary}`, borderRadius: 4, padding: "8px 12px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: ink }}>{e.name}</span>
            {tag("DEPLOYED", primary)}
          </div>
          {e.link && <div style={{ fontFamily: mono, fontSize: 10.5, color: muted, marginTop: 1 }}>{e.link}</div>}
          {lines(e.description).map((b, j) => (
            <div key={j} style={{ fontSize: 12, lineHeight: 1.5, color: ink, marginTop: 3 }}>{b}</div>
          ))}
        </div>
      ));
    if (k === "education")
      return data.education.map((e, i) => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: i ? 8 : 0 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: ink }}>{e.degree}</div>
            <div style={{ fontSize: 11.5, color: muted, fontWeight: 600 }}>{[e.school, e.grade].filter(Boolean).join(" · ")}</div>
          </div>
          <span style={{ fontFamily: mono, fontSize: 10.5, color: muted, whiteSpace: "nowrap" }}>{dateRange(e.start, e.end)}</span>
        </div>
      ));
    return data.certifications.map((c, i) => (
      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: i ? 8 : 0 }}>
        <Icon name="star" size={16} color={primary} />
        <span style={{ fontSize: 12.5, fontWeight: 800, color: ink }}>{c.name}</span>
        <span style={{ fontSize: 11.5, color: muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</span>
      </div>
    ));
  };

  const sideBody = (k) => {
    if (k === "skills")
      return data.skills.map((s) => {
        const lvl = s.level ?? 0;
        const color = lvl >= 70 ? GO : lvl >= 45 ? HOLD : accent;
        const word = lvl >= 70 ? "GO" : lvl >= 45 ? "WARMING UP" : "STANDBY";
        return (
          <div key={s.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: onDark }}>
              {led(color)}
              <span style={{ flex: 1, minWidth: 0, fontWeight: 700 }}>{s.name}</span>
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: consoleBg, background: color, borderRadius: 3, padding: "1px 6px" }}>{word}</span>
            </div>
            <div style={{ display: "flex", gap: 2, marginTop: 5, marginLeft: 17 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} style={{ flex: 1, height: 4, borderRadius: 1, background: i < Math.round((lvl / 100) * 12) ? color : mix(onDark, consoleBg, 0.82) }} />
              ))}
            </div>
          </div>
        );
      });
    if (k === "languages")
      return data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: onDark, marginBottom: 6 }}>
          {led(GO, 7)}
          <span style={{ flex: 1, fontWeight: 700 }}>{l.name}</span>
          <span style={{ fontFamily: mono, fontSize: 10.5, color: onDarkMuted }}>{levelWord(l.level).toUpperCase()}</span>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((it) => (
          <span key={it.id} style={{ fontSize: 11.5, fontWeight: 700, color: onDark, border: `1px solid ${mix(onDark, consoleBg, 0.6)}`, borderRadius: 4, padding: "3px 9px" }}>{it.name}</span>
        ))}
      </div>
    );
  };

  const main = pick(data, MAIN);
  const side = pick(data, SIDE);
  const contacts = contactItems(p);
  const startYears = data.experience.map((e) => parseInt(e.start, 10)).filter((n) => n > 1900);
  const orbit = startYears.length ? new Date().getFullYear() - Math.min(...startYears) : 0;
  const stats = [
    ["Missions", data.experience.length],
    ["Yrs in orbit", orbit > 0 ? `${orbit}+` : ""],
    ["Payloads", data.projects.length],
    ["Systems", data.skills.length ? `${data.skills.length}/${data.skills.length}` : ""],
  ].filter(([, v]) => v);
  const poll = [...data.skills.slice(0, 3).map((s) => s.name), "Coffee supply"];

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "nunito"), color: ink, display: "flex", background: "#ffffff" })}>
      {/* console sidebar */}
      <aside style={{ width: 262, flexShrink: 0, background: consoleBg, color: onDark, padding: "30px 24px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <svg width="164" height="164" viewBox="0 0 148 148">
            <circle cx="74" cy="74" r="70" fill={panel} stroke={accent} strokeWidth="3" />
            <circle cx="74" cy="74" r="53" fill="none" stroke={mix(onDark, consoleBg, 0.7)} strokeWidth="1" />
            <ellipse cx="74" cy="76" rx="46" ry="15" fill="none" stroke={accent} strokeWidth="2" transform="rotate(-18 74 76)" />
            <circle cx="116" cy="62" r="4.5" fill={accent} />
            {[[50, 46], [100, 44], [52, 108], [98, 110], [34, 80]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.6" fill={onDark} />
            ))}
            <text x="74" y="88" textAnchor="middle" fontFamily={bebas} fontSize="38" fill={onDark} letterSpacing="2">{initials(p.name) || "CV"}</text>
            <path id="mc-arc" d="M16,74 A58,58 0 0 1 132,74" fill="none" />
            <path id="mc-arc2" d="M22,74 A52,52 0 0 0 126,74" fill="none" />
            <text fontFamily={mono} fontSize="9.5" fontWeight="700" fill={accent} letterSpacing="2.5">
              <textPath href="#mc-arc" startOffset="50%" textAnchor="middle">CREW MEMBER 01</textPath>
            </text>
            <text fontFamily={mono} fontSize="9.5" fontWeight="700" fill={onDarkMuted} letterSpacing="2.5" dominantBaseline="hanging">
              <textPath href="#mc-arc2" startOffset="50%" textAnchor="middle">★ AD ASTRA ★</textPath>
            </text>
          </svg>
        </div>

        {contacts.length > 0 && (
          <div data-section="contact" style={{ marginBottom: 30 }}>
            <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: accent, borderBottom: `1px solid ${mix(onDark, consoleBg, 0.75)}`, paddingBottom: 5, marginBottom: 10 }}>COMMS CHANNELS</div>
            {contacts.map((c) => (
              <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11.5, marginBottom: 7, wordBreak: "break-word" }}>
                <Icon name={c.icon} size={13} color={accent} />
                <span>{c.value}</span>
              </div>
            ))}
          </div>
        )}

        {side.map((k) => (
          <section key={k} data-section={k} style={{ marginBottom: 30 }}>
            <SideHead k={k} />
            {sideBody(k)}
          </section>
        ))}

        <div style={{ marginTop: "auto", fontFamily: mono, fontSize: 10.5, color: onDarkMuted, lineHeight: 1.6, borderTop: `1px dashed ${mix(onDark, consoleBg, 0.7)}`, paddingTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>{led(GO, 7)} TELEMETRY NOMINAL</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>{led(GO, 7)} CAFFEINE LEVELS OK</div>
        </div>
      </aside>

      {/* flight deck */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`, backgroundSize: "24px 24px" }}>
        <header style={{ padding: "30px 34px 18px", borderBottom: `2px solid ${ink}`, background: "rgba(255,255,255,0.86)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: mono, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.6, color: muted }}>
            {led(GO, 8)}
            <span>ALL SYSTEMS GO</span>
            <span style={{ marginLeft: "auto" }}>T-MINUS: READY NOW</span>
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: 42, lineHeight: 1.05, fontWeight: 900, letterSpacing: -0.5, color: ink }}>{p.name}</h1>
          {p.title && (
            <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 700, letterSpacing: 1.5, color: primary, marginTop: 6, textTransform: "uppercase" }}>
              Mission: {p.title}
            </div>
          )}
        </header>

        {stats.length > 0 && (
          <div style={{ display: "flex", margin: "18px 34px 0", border: `1.5px solid ${ink}`, borderRadius: 6, background: "#ffffff", overflow: "hidden" }}>
            {stats.map(([label, value], i) => (
              <div key={label} style={{ flex: 1, padding: "9px 12px 8px", borderLeft: i ? `1px solid ${lineC}` : "none" }}>
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: muted, textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontFamily: bebas, fontSize: 30, lineHeight: 1, color: primary, marginTop: 3 }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: "22px 34px 0", flex: 1 }}>
          {main.map((k, i) => (
            <section key={k} data-section={k} style={{ marginBottom: 28 }}>
              <MainHead k={k} n={i + 1} />
              {mainBody(k)}
            </section>
          ))}
        </div>

        <div style={{ margin: "0 34px 28px", border: `1.5px solid ${ink}`, borderRadius: 6, background: "#ffffff", overflow: "hidden" }}>
          <div style={{ background: ink, color: "#ffffff", fontFamily: mono, fontSize: 10.5, fontWeight: 700, letterSpacing: 2, padding: "5px 12px" }}>GO / NO-GO POLL · CAN WE HIRE?</div>
          <div style={{ display: "flex", flexWrap: "wrap", padding: "8px 12px", gap: "6px 18px" }}>
            {poll.map((name) => (
              <span key={name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: ink }}>
                {led(GO, 8)} {name}: <span style={{ fontFamily: mono, color: "#16a34a" }}>GO</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
