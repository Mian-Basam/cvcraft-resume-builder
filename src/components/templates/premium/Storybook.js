import { Photo, contactItems, mix, pageStyle } from "../shared";
import { SECTION_META, SectionBody, fontOf, photoOf, pick } from "../kit";
import { fontStack } from "@/lib/palettes";

const LEFT_KEYS = ["summary", "education", "languages", "interests"];
const RIGHT_KEYS = ["experience", "skills", "projects", "certifications"];

// A wobbly, hand-drawn looking rounded outline (deterministic, so prints match the preview).
function sketchPath(seed, amp) {
  const pts = [];
  const N = 160;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = 500 + 488 * Math.sign(c) * Math.abs(c) ** 0.4;
    const y = 500 + 488 * Math.sign(s) * Math.abs(s) ** 0.4;
    const n = amp * (Math.sin(t * 9 + seed) + 0.6 * Math.sin(t * 17 + seed * 1.7) + 0.3 * Math.sin(t * 31 + seed * 2.3));
    pts.push(`${(x - n * c).toFixed(1)},${(y - n * s).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

const STROKES = [
  { d: sketchPath(1, 5), w: 2.6, o: 0.95 },
  { d: sketchPath(4, 7), w: 1.5, o: 0.55 },
  { d: sketchPath(7, 9), w: 1, o: 0.35 },
];

// Premium: dreamy dark page with a sketched thought-bubble frame and storybook headings.
export default function Storybook({ data, theme }) {
  const { primary, accent, dark } = theme;
  const p = data.personal;
  const fancy = fontStack("cinzel");
  const glow = mix(accent, "#ffffff", 0.45);
  const first = (p.name || "My").trim().split(/\s+/)[0];
  const o = {
    primary: glow,
    text: "#ece6f6",
    muted: "#c9bfdc",
    titleColor: "#ffffff",
    subColor: glow,
    fs: 11,
    dateStyle: "below",
    skillStyle: "list",
    langStyle: "dots",
    interestStyle: "inline",
    barColor: glow,
    track: "rgba(255,255,255,0.22)",
  };

  const heading = (title) => (
    <h3 style={{ fontFamily: fancy, fontSize: 16, letterSpacing: 1, color: glow, margin: "0 0 10px" }}>~ {title} ~</h3>
  );
  const column = (keys, withContact) => (
    <div>
      {withContact && contactItems(p).length > 0 && (
        <section style={{ marginBottom: 14 }}>
          {heading("Contact Information")}
          {contactItems(p).map((c) => (
            <div key={c.icon} style={{ display: "flex", gap: 10, fontSize: 11, marginBottom: 4 }}>
              <span style={{ width: 62, fontFamily: fancy, fontSize: 10, color: "#c9bfdc", textTransform: "capitalize" }}>
                {{ phone: "Phone", mail: "Email", pin: "Address", globe: "Website" }[c.icon]}:
              </span>
              <span style={{ wordBreak: "break-word" }}>{c.value}</span>
            </div>
          ))}
        </section>
      )}
      {pick(data, keys).map((k) => (
        <section key={k} data-section={k} style={{ marginBottom: 14 }}>
          {heading(k === "summary" ? "Why Hire Me" : SECTION_META[k].title)}
          <SectionBody k={k} data={data} o={o} />
        </section>
      ))}
    </div>
  );

  return (
    <div
      className="resume-page"
      style={pageStyle({
        fontFamily: fontOf(theme, "lato"),
        color: "#ece6f6",
        background: `radial-gradient(ellipse at 50% 18%, ${mix(primary, "#ffffff", 0.12)} 0%, ${primary} 35%, ${mix(dark, primary, 0.3)} 100%)`,
      })}
    >
      {[
        [70, 120, 2],
        [720, 90, 2.5],
        [650, 1040, 2],
        [380, 1080, 1.5],
        [740, 640, 1.5],
      ].map(([x, y, r], i) => (
        <span key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: "#fff", opacity: 0.7, boxShadow: "0 0 6px #fff" }} />
      ))}

      <div style={{ position: "relative", margin: "24px 26px 0", padding: "46px 56px 34px" }}>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          {STROKES.map((s, i) => (
            <path key={i} d={s.d} fill="none" stroke="#fff" strokeWidth={s.w} strokeOpacity={s.o} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div style={{ position: "relative", textAlign: "center", marginBottom: 18 }}>
          <h1 style={{ fontFamily: fancy, fontSize: 34, fontWeight: 700, letterSpacing: 1, margin: 0, color: "#fff" }}>
            {first}&apos;s Resume
          </h1>
          {p.title && <div style={{ fontFamily: fancy, fontSize: 13, letterSpacing: 4, color: glow, marginTop: 6 }}>{p.title}</div>}
        </div>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34 }}>
          {column(LEFT_KEYS, true)}
          {column(RIGHT_KEYS, false)}
        </div>
      </div>

      <div style={{ position: "relative", height: 150 }}>
        <span style={{ position: "absolute", left: 150, top: 4, width: 30, height: 34, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.85)" }} />
        <span style={{ position: "absolute", left: 124, top: 38, width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.7)" }} />
        <Photo
          src={photoOf(data, theme)}
          name={p.name}
          size={104}
          placeholderBg={mix(accent, primary, 0.4)}
          style={{ position: "absolute", left: 30, top: 40, border: "3px solid rgba(255,255,255,0.9)", boxShadow: `0 0 0 5px ${glow}66` }}
        />
        <div style={{ position: "absolute", right: 56, top: 90, fontFamily: fancy, fontSize: 14, letterSpacing: 2, color: glow }}>~ Thank you for reading ~</div>
      </div>
    </div>
  );
}
