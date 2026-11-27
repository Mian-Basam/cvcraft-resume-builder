// Art Director: magazine feature spread — masthead, editorial portrait with offset colour frame, drop-cap lead and creative-direction highlights.
import { Photo, pageStyle, mix, lines, dateRange } from "../../shared";
import { ContactList, SECTION_META, SectionBody, fontOf, photoOf, pick } from "../../kit";
import { fontStack } from "@/lib/palettes";

const MAIN_KEYS = ["experience", "education"];
const SIDE_KEYS = ["projects", "languages", "certifications", "interests"];

export default function ArtDirector({ data, theme }) {
  const { primary, accent } = theme;
  const p = data.personal;
  const serif = fontStack("playfair");
  const ink = mix(theme.dark || "#1b1b1b", primary, 0.15);
  const muted = mix(ink, "#ffffff", 0.42);
  const paper = mix(theme.light || "#f1f1f1", "#fffdf9", 0.7);
  const hair = mix(ink, paper, 0.75);
  const words = (p.name || "").trim().split(/\s+/).filter(Boolean);
  const first = words[0] || "";
  const rest = words.slice(1).join(" ");
  const summary = (p.summary || "").trim();

  const Kicker = ({ children, color = primary }) => (
    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color, marginBottom: 8 }}>{children}</div>
  );
  const Head = ({ k, label }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: 25, color: ink, margin: 0, lineHeight: 1 }}>{label || SECTION_META[k].title}</h3>
        <span style={{ flex: 1, height: 1, background: hair }} />
      </div>
    </div>
  );
  const SideHead = ({ k }) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, borderTop: `2px solid ${ink}`, paddingTop: 7, marginBottom: 9 }}>
      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 2.6, textTransform: "uppercase", color: ink }}>{SECTION_META[k].title}</span>
    </div>
  );

  const sideOpts = { primary, text: ink, muted, titleColor: ink, subColor: muted, fs: 11.5, dateStyle: "below", skillStyle: "list", langStyle: "dots", interestStyle: "tags", tagBg: "transparent", tagBorder: hair, barColor: primary, track: hair };

  const Entries = ({ k }) => {
    const items =
      k === "experience"
        ? data.experience.map((e) => ({ id: e.id, t: e.role, s: [e.company, e.location].filter(Boolean).join(", "), d: dateRange(e.start, e.end), b: lines(e.bullets) }))
        : data.education.map((e) => ({ id: e.id, t: e.degree, s: [e.school, e.grade].filter(Boolean).join(" — "), d: dateRange(e.start, e.end), b: [] }));
    return items.map((e) => (
      <div key={e.id} style={{ marginBottom: 15, breakInside: "avoid" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: primary }}>{e.d}</div>
        <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: ink, lineHeight: 1.2, marginTop: 2 }}>{e.t}</div>
        {e.s && <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 13, color: muted, marginTop: 1 }}>{e.s}</div>}
        {e.b.map((b, n) => (
          <div key={n} style={{ display: "flex", gap: 9, fontSize: 12, lineHeight: 1.55, color: ink, marginTop: 4 }}>
            <span style={{ color: primary, fontWeight: 700, flexShrink: 0 }}>§</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
    ));
  };

  const Highlights = () => (
    <div style={{ background: primary, color: "#fff", padding: "16px 18px 14px", position: "relative", overflow: "hidden" }}>
      <span style={{ position: "absolute", right: 10, top: -16, fontFamily: serif, fontSize: 110, lineHeight: 1, color: accent, opacity: 0.9 }}>“</span>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: accent, marginBottom: 10, position: "relative" }}>Creative direction</div>
      {data.projects.map((pr, i) => (
        <div key={pr.id} style={{ position: "relative", marginTop: i ? 12 : 0, paddingTop: i ? 12 : 0, borderTop: i ? "1px solid rgba(255,255,255,0.25)" : "none" }}>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 17, lineHeight: 1.2 }}>{pr.name}</div>
          {lines(pr.description).map((l, j) => (
            <div key={j} style={{ fontSize: 11.5, lineHeight: 1.5, marginTop: 5, color: "rgba(255,255,255,0.88)" }}>{l}</div>
          ))}
          {pr.link && <div style={{ fontSize: 10.5, letterSpacing: 1, marginTop: 6, color: accent }}>{pr.link}</div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="resume-page" style={pageStyle({ fontFamily: fontOf(theme, "manrope"), color: ink, background: paper, padding: "30px 44px 60px", boxSizing: "border-box" })}>
      {/* masthead */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 10.5, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: ink, paddingBottom: 8 }}>
        <span>The Portfolio Issue</span>
        <span style={{ color: primary }}>{p.title}</span>
        <span>{p.address}</span>
      </div>
      <div style={{ borderTop: `3px solid ${ink}`, borderBottom: `1px solid ${ink}`, height: 3, marginBottom: 24 }} />

      {/* hero spread */}
      <div style={{ display: "flex", gap: 34, marginBottom: 30 }}>
        <figure style={{ margin: 0, width: 300, flexShrink: 0 }}>
          <div style={{ position: "relative", padding: "0 14px 14px 0" }}>
            <div style={{ position: "absolute", left: 14, top: 14, right: 0, bottom: 0, background: accent }} />
            <Photo
              src={photoOf(data, theme)}
              name={p.name}
              size={286}
              placeholderBg={mix(primary, "#ffffff", 0.12)}
              style={{ position: "relative", width: 286, height: 392, borderRadius: 0, display: "block" }}
            />
          </div>
          <figcaption style={{ fontFamily: serif, fontStyle: "italic", fontSize: 11.5, color: muted, marginTop: 8 }}>
            {[p.name, p.title].filter(Boolean).join(", ")}
          </figcaption>
        </figure>

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Kicker>Profile — the art director</Kicker>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: 64, lineHeight: 0.95, letterSpacing: -1.5, margin: "0 0 18px", color: ink }}>
            <span style={{ fontStyle: "italic" }}>{first}</span>
            {rest && <br />}
            {rest && <span style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 0 }}>{rest}</span>}
          </h1>
          {summary && (
            <section data-section="summary" style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, margin: 0, color: ink }}>
                <span style={{ float: "left", fontFamily: serif, fontSize: 58, lineHeight: 0.82, fontWeight: 700, color: primary, margin: "4px 8px 0 0" }}>{summary[0]}</span>
                {summary.slice(1)}
              </p>
            </section>
          )}
          {pick(data, ["skills"]).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 16 }}>
              <Kicker color={muted}>Disciplines</Kicker>
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 17, lineHeight: 1.4, color: ink }}>
                {data.skills.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && <span style={{ color: primary, fontStyle: "normal", margin: "0 7px" }}>/</span>}
                    {i > 0 && " "}
                    <span style={{ whiteSpace: "nowrap" }}>{s.name}</span>
                  </span>
                ))}
              </div>
            </section>
          ))}
          <section data-section="contact" style={{ marginTop: "auto", borderTop: `1px solid ${hair}`, paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 }}>
            <ContactList p={p} fs={11} iconColor={primary} color={ink} gap={7} />
          </section>
        </div>
      </div>

      {/* feature columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 236px", columnGap: 30 }}>
        <main style={{ borderRight: `1px solid ${hair}`, paddingRight: 30 }}>
          {pick(data, MAIN_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 16 }}>
              <Head k={k} label={k === "experience" ? "Career story" : undefined} />
              <Entries k={k} />
            </section>
          ))}
        </main>
        <aside>
          {pick(data, SIDE_KEYS).map((k) => (
            <section key={k} data-section={k} style={{ marginBottom: 18 }}>
              {k === "projects" ? <Highlights /> : (
                <>
                  <SideHead k={k} />
                  <SectionBody k={k} data={data} o={sideOpts} />
                </>
              )}
            </section>
          ))}
        </aside>
      </div>
      <div style={{ position: "absolute", left: 44, right: 44, bottom: 24, borderTop: `1px solid ${ink}`, paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 10.5, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: muted }}>
        <span>{p.name}</span>
        <span style={{ fontFamily: serif, fontStyle: "italic", letterSpacing: 0.5, textTransform: "none", fontWeight: 400 }}>{p.website}</span>
        <span>P. 01</span>
      </div>
    </div>
  );
}
