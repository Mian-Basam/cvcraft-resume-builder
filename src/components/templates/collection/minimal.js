// Layouts for the "minimal" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import SwissMinimal from "./minimal/SwissMinimal";
import QuietLuxury from "./minimal/QuietLuxury";
import ModernEssential from "./minimal/ModernEssential";
import InvisibleGrid from "./minimal/InvisibleGrid";
import MonochromePro from "./minimal/MonochromePro";
import AiryResume from "./minimal/AiryResume";
import GeometricMinimal from "./minimal/GeometricMinimal";
import TypographyFirst from "./minimal/TypographyFirst";

export const layouts = [
  { id: "swiss-minimal", name: "Swiss Minimal", component: SwissMinimal, collection: "minimal",
    styles: ["Minimal", "Professional"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "inter", description: "Strict Swiss grid with an oversized name, numbered sections and thin black rules." },
  { id: "quiet-luxury", name: "Quiet Luxury", component: QuietLuxury, collection: "minimal",
    styles: ["Minimal", "Professional"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "baskerville", description: "Ivory paper, a refined serif name and understated italic headings." },
  { id: "modern-essential", name: "Modern Essential", component: ModernEssential, collection: "minimal",
    styles: ["Minimal", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "manrope", description: "A prominent name over a compact left sidebar and a clean sans-serif main column." },
  { id: "invisible-grid", name: "Invisible Grid", component: InvisibleGrid, collection: "minimal",
    styles: ["Minimal", "Simple"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "sora", description: "Label, date and content snap to an unseen three-column grid with faint hairlines." },
  { id: "monochrome-pro", name: "Monochrome Pro", component: MonochromePro, collection: "minimal",
    styles: ["Minimal", "Modern", "Professional"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "montserrat", description: "Black and white with a solid black rail, a heavy-and-hairline name and one small colour accent." },
  { id: "airy-resume", name: "Airy Resume", component: AiryResume, collection: "minimal",
    styles: ["Minimal", "Simple"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "raleway", description: "Wide margins, a light name and roomy experience entries with dates floating above." },
  { id: "geometric-minimal", name: "Geometric Minimal", component: GeometricMinimal, collection: "minimal",
    styles: ["Minimal", "Modern", "Creative"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "poppins", description: "Two precise columns with a geometric marker per section, circle ratings and fine lines." },
  { id: "typography-first", name: "Typography First", component: TypographyFirst, collection: "minimal",
    styles: ["Minimal", "Creative"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "lato", description: "Text-led page with an oversized serif name, italic display headings and mono dates." },
];
