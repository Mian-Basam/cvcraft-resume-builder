// Layouts for the "creative" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import CreativeStudio from "./creative/CreativeStudio";
import PosterResume from "./creative/PosterResume";
import SwissBrutalist from "./creative/SwissBrutalist";
import ArtDirector from "./creative/ArtDirector";
import ColorBlock from "./creative/ColorBlock";
import TypographyPlayground from "./creative/TypographyPlayground";
import PortfolioCover from "./creative/PortfolioCover";

export const layouts = [
  { id: "creative-studio", name: "Creative Studio", component: CreativeStudio, collection: "creative",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "poppins", description: "Colourful identity block, offset sidebar and portfolio highlight cards." },
  { id: "poster-resume", name: "Poster Resume", component: PosterResume, collection: "creative",
    styles: ["Creative", "Modern"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "sora", description: "Gig-poster headline in oversized condensed type, a ticker strip and bold hanging heads." },
  { id: "swiss-brutalist", name: "Swiss Brutalist", component: SwissBrutalist, collection: "creative",
    styles: ["Creative", "Minimal"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "spacegrotesk", description: "Rigid ruled grid, oversized numerals and a giant lowercase name in high contrast." },
  { id: "art-director", name: "Art Director", component: ArtDirector, collection: "creative",
    styles: ["Creative", "Professional"], columns: 2, photo: true, ats: false, premium: true,
    defaultFont: "manrope", description: "Magazine feature spread with an editorial portrait, drop-cap lead and creative-direction highlights." },
  { id: "color-block", name: "Color Block", component: ColorBlock, collection: "creative",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "poppins", description: "Flush full-bleed colour panels, modular sections and geometric section marks." },
  { id: "typography-playground", name: "Typography Playground", component: TypographyPlayground, collection: "creative",
    styles: ["Creative"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "sora", description: "A type specimen of a résumé: mixed typefaces, words as headings and skills sized by level." },
  { id: "portfolio-cover", name: "Portfolio Cover", component: PortfolioCover, collection: "creative",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: true,
    defaultFont: "sora", description: "Full-height personal-brand cover, abstract project thumbnails and a compact experience list." },
];
