// The Binge-Worthy CV: a generic streaming-service title page on dark — show-style hero, jobs as episodes, a top-skills row and "more like this" cards.
import { pageStyle, mix, lines, dateRange, contactItems } from "../../shared";
import { fontOf, pick, levelWord } from "../../kit";
import Icon from "../../Icon";
import { fontStack } from "@/lib/palettes";

const BG = "#141414";
const TEXT = "#e6e6e6";
const SOFT = "#b3b3b3";
const DIM = "#8f8f8f";
const MATCH = "#46d369";

const LEFT = ["experience", "skills"];
const RIGHT = ["projects", "education", "certifications", "languages", "interests"];
const TITLES = {
  experience: "Episodes",
  skills: "Top skills right now",
  projects: "More like this",
  education: "The prequel",
  certifications: "Awards & nominations",
  languages: "Audio & subtitles",
  interests: "Behind the scenes",
};

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function BingeWorthyCv({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const bebas = fontStack("bebas");
  const hot = mix(accent, "#ffffff", 0.1);
  const card = "#1f1f1f";
  const thumb = (i) => `linear-gradient(${135 + i * 40}deg, ${mix(primary, "#ffffff", 0.18)} 0%, ${mix(primary, accent, 0.55)} 60%, ${accent} 120%)`;

  const years = data.experience.flatMap((e) => [e.start, e.end]).filter(Boolean);
  const nums = years.map((y) => parseInt(y, 10)).filter((n) => n > 1900);
  const span = nums.length ? `${Math.min(...nums)} – ${data.experience.some((e) => /present|now|current/i.test(e.end || "")) ? "Present" : Math.max(...nums)}` : "";
  const seasons = data.experience.length;

  const Head = ({ k, right }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 17, fontWeight: 800, color: "#ffffff" }}>{TITLES[k]}</span>
      {right}
    </div>
  );

  const leftBody = (k) => {
    if (k === "experience")
      return data.experience.map((e, i) => (
        <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderTop: `1px solid #2e2e2e`, breakInside: "avoid" }}>
          <span style={{ width: 22, flexShrink: 0, fontSize: 22, fontWeight: 300, color: DIM, textAlign: "center", paddingTop: 22 }}>{i + 1}</span>
          <div style={{ width: 124, height: 72, flexShrink: 0, borderRadius: 4, background: thumb(i), position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", left: 8, top: 6, fontFamily: bebas, fontSize: 17, lineHeight: 1, color: "rgba(255,255,255,0.92)", letterSpacing: 0.5, right: 8 }}>{e.company}</span>
            <span style={{ position: "absolute", left: "50%", top: "54%", transform: "translate(-50%, -50%)", width: 26, height: 26, borderRadius: "50%", border: "2px solid #ffffff", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="12" viewBox="0 0 10 12"><path d="M1,0 L10,6 L1,12 Z" fill="#ffffff" /></svg>
            </span>
            <span style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: /present|now|current/i.test(e.end || "") ? "45%" : "100%", background: hot }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#ffffff" }}>{e.role}</span>
              <span style={{ fontSize: 11, color: SOFT, whiteSpace: "nowrap" }}>{dateRange(e.start, e.end)}</span>
            </div>
            <div style={{ fontSize: 11.5, color: hot, fontWeight: 700, marginTop: 1 }}>{[e.company, e.location].filter(Boolean).join(" · ")}</div>
            {lines(e.bullets).map((b, j) => (
              <div key={j} style={{ fontSize: 12, lineHeight: 1.5, color: SOFT, marginTop: 3 }}>{b}</div>
            ))}
          </div>
        </div>
      ));
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 12px" }}>
        {data.skills.slice(0, 10).map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "flex-end", minWidth: 0 }}>
            <span style={{ fontFamily: bebas, fontSize: 84, lineHeight: 0.76, color: BG, WebkitTextStroke: `2px ${mix(accent, "#ffffff", 0.3)}`, marginRight: -10, flexShrink: 0 }}>{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0, background: card, borderRadius: 4, padding: "8px 8px 7px", position: "relative", border: "1px solid #2e2e2e" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#ffffff", lineHeight: 1.2, minHeight: 29 }}>{s.name}</div>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: MATCH, marginTop: 3 }}>{s.level ?? 0}% match</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const rightBody = (k) => {
    if (k === "projects")
      return data.projects.map((e, i) => (
        <div key={e.id} style={{ background: card, borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: 82, background: thumb(i + 2), position: "relative", padding: "8px 10px", boxSizing: "border-box" }}>
            <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, fontWeight: 900, color: BG, background: hot, borderRadius: 2, padding: "1px 5px" }}>NEW</span>
            <div style={{ position: "absolute", left: 10, bottom: 8, right: 10, fontFamily: bebas, fontSize: 22, lineHeight: 0.95, color: "#ffffff", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>{e.name}</div>
          </div>
          <div style={{ padding: "8px 10px 10px" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, fontWeight: 800 }}>
              <span style={{ color: MATCH }}>{Math.max(80, 98 - i * 3)}% Match</span>
              <span style={{ color: SOFT, border: "1px solid #5a5a5a", borderRadius: 2, padding: "0 4px", fontSize: 10 }}>HD</span>
            </div>
            {lines(e.description).map((b, j) => (
              <div key={j} style={{ fontSize: 11.5, lineHeight: 1.45, color: SOFT, marginTop: 4 }}>{b}</div>
            ))}
            {e.link && <div style={{ fontSize: 10.5, color: DIM, marginTop: 4, wordBreak: "break-word" }}>{e.link}</div>}
          </div>
        </div>
      ));
    if (k === "education")
      return data.education.map((e) => (
        <div key={e.id} style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: "#ffffff" }}>{e.degree}</div>
          <div style={{ fontSize: 11.5, color: SOFT }}>{e.school}</div>
          <div style={{ fontSize: 11, color: DIM }}>{[dateRange(e.start, e.end), e.grade].filter(Boolean).join(" · ")}</div>
        </div>
      ));
    if (k === "certifications")
      return data.certifications.map((c) => (
        <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <Icon name="star" size={15} color={hot} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#ffffff", lineHeight: 1.3 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: DIM }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</div>
          </div>
        </div>
      ));
    if (k === "languages")
      return data.languages.map((l, i) => (
        <div key={l.id} style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 4, color: SOFT }}>
          <span style={{ width: 62, color: DIM }}>{i === 0 ? "Audio" : "Subtitles"}</span>
          <span>
            <b style={{ color: "#ffffff" }}>{l.name}</b> · {levelWord(l.level)}
          </span>
        </div>
      ));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.interests.map((it) => (
          <span key={it.id} style={{ fontSize: 11.5, fontWeight: 700, color: TEXT, background: "#2a2a2a", borderRadius: 3, padding: "3px 9px" }}>{it.name}</span>
        ))}
      </div>
    );
  };

  const left = pick(data, LEFT);
  const right = pick(data, RIGHT);
  const contacts = contactItems(p);
  const showSummary = pick(data, ["summary"]).length > 0;

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "nunito"), color: TEXT, background: BG, display: "flex", flexDirection: "column" })}>
      {/* hero */}
      <header style={{ position: "relative", minHeight: 392, padding: "18px 34px 22px", boxSizing: "border-box", overflow: "hidden", background: `radial-gradient(ellipse at 78% 30%, ${mix(primary, accent, 0.35)} 0%, ${mix(primary, BG, 0.25)} 38%, ${BG} 72%)` }}>
        <svg width="460" height="392" style={{ position: "absolute", right: 0, top: -60, opacity: 0.13 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={140 + i * 64} y={30 + (i % 2) * 40} width="52" height="300" rx="26" fill={accent} transform={`rotate(18 ${166 + i * 64} 180)`} />
          ))}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: `linear-gradient(transparent, ${BG})` }} />

        <nav style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, fontSize: 11.5, color: SOFT, marginBottom: 34 }}>
          <span style={{ fontFamily: bebas, fontSize: 24, letterSpacing: 1, color: hot, marginRight: 8 }}>{(p.name || "CV").split(/\s+/)[0]}TV</span>
          <span style={{ color: "#ffffff", fontWeight: 800 }}>Home</span>
          <span>Career</span>
          <span>Projects</span>
          <span>My List</span>
          <span style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 4, background: hot, color: BG, fontWeight: 900, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{initials(p.name)}</span>
        </nav>

        <div style={{ position: "relative", display: "flex", gap: 28 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 900, letterSpacing: 3, color: SOFT }}>
              <span style={{ width: 18, height: 3, background: hot, borderRadius: 2 }} />A CAREER ORIGINAL SERIES
            </div>
            <h1 style={{ margin: "2px 0 0", fontFamily: bebas, fontWeight: 400, fontSize: 84, lineHeight: 0.86, letterSpacing: 1, color: "#ffffff", textShadow: "0 3px 18px rgba(0,0,0,0.5)" }}>{p.name}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 12, fontSize: 12, fontWeight: 700, color: SOFT }}>
              <span style={{ color: MATCH, fontWeight: 900 }}>98% Match</span>
              {span && <span>{span}</span>}
              {seasons > 0 && <span>{seasons} {seasons === 1 ? "Season" : "Seasons"}</span>}
              <span style={{ border: `1px solid ${DIM}`, borderRadius: 2, padding: "0 5px", fontSize: 10.5 }}>HD</span>
              {p.title && <span style={{ color: "#ffffff" }}>{p.title}</span>}
            </div>
            {showSummary && (
              <p data-section="summary" style={{ margin: "12px 0 0", fontSize: 13, lineHeight: 1.6, color: TEXT, maxWidth: 440 }}>{p.summary}</p>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", color: BG, fontWeight: 900, fontSize: 13, padding: "7px 18px", borderRadius: 4 }}>
                <svg width="11" height="13" viewBox="0 0 10 12"><path d="M1,0 L10,6 L1,12 Z" fill={BG} /></svg> Hire
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(110,110,110,0.55)", color: "#ffffff", fontWeight: 800, fontSize: 13, padding: "7px 16px", borderRadius: 4 }}>
                + My List
              </span>
            </div>
          </div>
          {contacts.length > 0 && (
            <div data-section="contact" style={{ width: 210, flexShrink: 0, alignSelf: "flex-end", fontSize: 11.5, lineHeight: 1.55, color: SOFT }}>
              <div style={{ color: DIM, marginBottom: 4 }}>
                Starring: <span style={{ color: TEXT }}>{p.name}</span>
              </div>
              <div style={{ color: DIM, marginBottom: 2 }}>Where to watch:</div>
              {contacts.map((c) => (
                <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 7, color: TEXT, wordBreak: "break-word" }}>
                  <Icon name={c.icon} size={12} color={hot} />
                  {c.value}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* rows */}
      <div style={{ display: "flex", gap: 26, padding: "6px 34px 24px", flex: 1 }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          {left.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 22 }}>
              <Head
                k={k}
                right={
                  k === "experience" ? (
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: TEXT, border: "1px solid #4a4a4a", background: "#242424", borderRadius: 3, padding: "3px 10px" }}>All seasons ▾</span>
                  ) : null
                }
              />
              {leftBody(k)}
            </section>
          ))}
        </main>
        <aside style={{ width: 236, flexShrink: 0 }}>
          {right.map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 18 }}>
              <Head k={k} />
              {rightBody(k)}
            </section>
          ))}
        </aside>
      </div>

      <div style={{ margin: "0 34px 26px", display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid #2e2e2e", paddingTop: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#ffffff" }}>Are you still watching?</span>
        <span style={{ fontSize: 11.5, fontWeight: 900, color: BG, background: "#ffffff", borderRadius: 3, padding: "4px 12px" }}>Yes — let&rsquo;s talk</span>
        <span style={{ fontSize: 11.5, color: DIM, marginLeft: "auto" }}>Next episode starts at your company</span>
      </div>
    </div>
  );
}
