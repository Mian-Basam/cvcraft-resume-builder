import Horizon from "./Horizon";
import Azure from "./Azure";
import Sandstone from "./Sandstone";
import Midnight from "./Midnight";
import Classic from "./Classic";
import Executive from "./Executive";
import Minimal from "./Minimal";
import Compact from "./Compact";
import TimelinePro from "./TimelinePro";
import Banner from "./Banner";
import Split from "./Split";
import Wave from "./Wave";
import Geometric from "./Geometric";
import Bold from "./Bold";
import Elegant from "./Elegant";
import Aurora from "./premium/Aurora";
import Prestige from "./premium/Prestige";
import Infographic from "./premium/Infographic";
import Mosaic from "./premium/Mosaic";
import Ribbon from "./premium/Ribbon";
import Studio from "./premium/Studio";
import Arch from "./premium/Arch";
import Milestone from "./premium/Milestone";
import Storybook from "./premium/Storybook";
import Gazette from "./premium/Gazette";
import Scrapbook from "./premium/Scrapbook";
import Daydream from "./premium/Daydream";
import Sketchbook from "./premium/Sketchbook";
import Notebook from "./sketch/Notebook";
import PolaroidTape from "./sketch/PolaroidTape";
import JournalSpread from "./sketch/JournalSpread";
import MarginDoodles from "./sketch/MarginDoodles";
import { getPalette, palettes } from "@/lib/palettes";
import { normalizeAvatar } from "./simpleAvatar";
import { collectionLayouts } from "./collection";

export const STYLES = ["Modern", "Creative", "Professional", "Minimal", "Simple"];

// Base layouts. Every layout renders the same resume data.
// photo: the design is built around a photo; ats: simple structure that parses well;
// premium: our most detailed designs, shown with a Premium badge (free to use).
// character: illustrated style; the gallery offers each colour with a male and a female character.
export const layouts = [
  { id: "horizon", name: "Horizon", component: Horizon, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "lato", description: "Timeline layout with bold corner shapes and a photo sidebar." },
  { id: "azure", name: "Azure", component: Azure, styles: ["Modern"], columns: 2, photo: true, ats: false, defaultFont: "lato", description: "Gradient bands, ringed photo and timelines." },
  { id: "sandstone", name: "Sandstone", component: Sandstone, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Soft curves, pill headings, language bars and interest icons." },
  { id: "midnight", name: "Midnight", component: Midnight, styles: ["Modern"], columns: 2, photo: true, ats: false, defaultFont: "montserrat", description: "Dark sidebar, name banner and skill percentages.", excludePalettes: ["charcoal"] },
  { id: "classic", name: "Classic", component: Classic, styles: ["Professional", "Simple"], columns: 1, photo: false, ats: true, defaultFont: "merriweather", description: "Centred serif header with ruled sections." },
  { id: "executive", name: "Executive", component: Executive, styles: ["Professional"], columns: 1, photo: false, ats: true, defaultFont: "lato", description: "Strong header band and clear marked headings." },
  { id: "minimal", name: "Minimal", component: Minimal, styles: ["Minimal", "Simple"], columns: 1, photo: false, ats: true, defaultFont: "inter", description: "Quiet layout with labels in the margin." },
  { id: "compact", name: "Compact", component: Compact, styles: ["Professional", "Simple"], columns: 2, photo: false, ats: true, defaultFont: "inter", description: "Dense two-column page that fits a lot on one page." },
  { id: "timeline-pro", name: "Timeline Pro", component: TimelinePro, styles: ["Professional"], columns: 1, photo: false, ats: true, defaultFont: "raleway", description: "Date column with a rule beside every entry." },
  { id: "banner", name: "Banner", component: Banner, styles: ["Modern"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Coloured header with photo and a tinted side panel." },
  { id: "split", name: "Split", component: Split, styles: ["Modern"], columns: 2, photo: true, ats: false, defaultFont: "raleway", description: "Main column with a full-height coloured sidebar." },
  { id: "wave", name: "Wave", component: Wave, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Wavy header and footer with a photo." },
  { id: "geometric", name: "Geometric", component: Geometric, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "montserrat", description: "Diamond shapes, rounded photo and dot ratings." },
  { id: "bold", name: "Bold", component: Bold, styles: ["Modern", "Minimal"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Oversized two-tone name and a contact strip." },
  { id: "elegant", name: "Elegant", component: Elegant, styles: ["Professional", "Creative"], columns: 2, photo: true, ats: false, defaultFont: "lato", description: "Centred photo, serif headings and fine rules." },
  { id: "aurora", name: "Aurora", component: Aurora, premium: true, styles: ["Modern", "Creative"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Glowing gradient header, floating content card and skill rings." },
  { id: "prestige", name: "Prestige", component: Prestige, premium: true, styles: ["Professional"], columns: 2, photo: true, ats: false, defaultFont: "lato", description: "Rich colour panel, fine double frame and serif ornaments." },
  { id: "infographic", name: "Infographic", component: Infographic, premium: true, styles: ["Modern", "Creative"], columns: 2, photo: true, ats: false, defaultFont: "montserrat", description: "Icon timeline, skill segments and language rings." },
  { id: "mosaic", name: "Mosaic", component: Mosaic, premium: true, styles: ["Modern", "Creative"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Tiled header and every section in its own card." },
  { id: "ribbon", name: "Ribbon", component: Ribbon, premium: true, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "raleway", description: "Folded ribbon headings and a dotted sidebar." },
  { id: "studio", name: "Studio", component: Studio, premium: true, styles: ["Modern", "Minimal"], columns: 2, photo: true, ats: false, defaultFont: "inter", description: "Editorial layout with a vertical name strip and numbered sections." },
  { id: "arch", name: "Arch", component: Arch, premium: true, character: true, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "montserrat", description: "Tall arched sidebar with the portrait on top, pill skill bars and grade badges." },
  { id: "milestone", name: "Milestone", component: Milestone, premium: true, character: true, styles: ["Creative", "Modern"], columns: 2, photo: true, ats: false, defaultFont: "montserrat", description: "Infographic with a career timeline chart, colour-tagged cards and skill badges." },
  { id: "storybook", name: "Storybook", component: Storybook, premium: true, character: true, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "lato", description: "Dreamy dark page inside a sketched thought bubble with storybook headings." },
  { id: "gazette", name: "Gazette", component: Gazette, premium: true, character: true, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "raleway", description: "Vintage poster typography, three ruled columns and star ratings." },
  { id: "scrapbook", name: "Scrapbook", component: Scrapbook, premium: true, character: true, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Polaroid photo, tape, sticky notes and label headings on dotted paper." },
  { id: "daydream", name: "Daydream", component: Daydream, premium: true, character: true, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Pastel thought clouds around the portrait, with hearts and sparkles." },
  { id: "sketchbook", name: "Sketchbook", component: Sketchbook, premium: true, styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "merriweather", sketch: true, defaultGirl: "reader", description: "Annotated sketchbook page with an ink-sketch illustration, handwritten notes and a coffee ring." },
  { id: "notebook", name: "Notebook", component: Notebook, premium: true, sketch: true, defaultGirl: "bob", styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "lato", description: "Lined notebook page with spiral holes, highlighter headings and a pen-drawn girl." },
  { id: "polaroid-tape", name: "Polaroid & Tape", component: PolaroidTape, premium: true, sketch: true, defaultGirl: "ponytail", styles: ["Creative"], columns: 2, photo: true, ats: false, defaultFont: "poppins", description: "Taped polaroid of a sketch girl, sticky notes and washi-tape headings on a pinboard grid." },
  { id: "journal-spread", name: "Journal Spread", component: JournalSpread, premium: true, sketch: true, defaultGirl: "hijab", styles: ["Creative", "Professional"], columns: 2, photo: true, ats: false, defaultFont: "lato", description: "Open two-page journal with a ribbon bookmark, serif italics and a sketched portrait." },
  { id: "margin-doodles", name: "Margin Doodles", component: MarginDoodles, premium: true, sketch: true, defaultGirl: "braids", styles: ["Creative", "Modern"], columns: 2, photo: true, ats: false, defaultFont: "inter", description: "Clean white page with a doodled margin: sketch girl, stars, arrows and ticked skills." },
  ...collectionLayouts,
];

export function getLayout(id) {
  return layouts.find((l) => l.id === id) || layouts[0];
}

// The gallery: every layout in every palette it supports, ordered palette by palette
// so the first rows show each layout once instead of ten colours of the same one.
export const catalog = palettes.flatMap((pal) =>
  layouts
    .filter((layout) => !layout.excludePalettes?.includes(pal.id))
    .flatMap((layout) => {
      const base = {
        id: `${layout.id}--${pal.id}`,
        name: `${layout.name} ${pal.name}`,
        layoutId: layout.id,
        paletteId: pal.id,
        premium: Boolean(layout.premium),
      };
      if (!layout.character) return [base];
      return ["female", "male"].map((avatar) => ({
        ...base,
        id: `${base.id}--${avatar}`,
        name: `${base.name} (${avatar === "male" ? "Male" : "Female"})`,
        avatar,
      }));
    })
);

export function getCatalogEntry(id) {
  return catalog.find((c) => c.id === id);
}

// Theme object handed to a template: palette colours plus font and photo choices.
export function buildTheme(settings) {
  const layout = getLayout(settings.layoutId);
  // avatar: "photo" | "initials" | "female" | "male" | "neutral". Older saved settings only had showPhoto.
  const avatar = normalizeAvatar(settings.avatar || (settings.showPhoto === false ? "initials" : "photo"), settings.look);
  return {
    ...getPalette(settings.paletteId),
    font: settings.font || layout.defaultFont,
    avatar,
    look: settings.look,
    showPhoto: avatar === "photo",
    // Sketch layouts: which drawn girl to show, chosen per layout (see sketchGirls.js; "reader" is the Sketchbook original).
    sketchGirl: settings.sketchGirls?.[layout.id] || layout.defaultGirl || "bun",
  };
}
