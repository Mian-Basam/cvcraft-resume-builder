// Layouts for the "special" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import ThreeColumnCv from "./special/ThreeColumnCv";
import HorizontalResume from "./special/HorizontalResume";
import SplitScreenCv from "./special/SplitScreenCv";
import AsymmetricMagazineCv from "./special/AsymmetricMagazineCv";
import TimelineSplitCv from "./special/TimelineSplitCv";
import InfographicPosterCv from "./special/InfographicPosterCv";
import AccordionCv from "./special/AccordionCv";
import FoldedBrochureCv from "./special/FoldedBrochureCv";

export const layouts = [
  { id: "three-column-cv", name: "Three-Column CV", component: ThreeColumnCv, collection: "special",
    styles: ["Modern", "Professional"], columns: 3, photo: false, ats: false, premium: false,
    defaultFont: "inter", description: "Name masthead over three capped columns: contact & skills, experience, projects & education." },
  { id: "horizontal-resume", name: "Horizontal Resume", component: HorizontalResume, collection: "special",
    styles: ["Modern", "Creative"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "inter", description: "Reads left to right: a career timeline axis with jobs above and studies below, then horizontal bands." },
  { id: "split-screen-cv", name: "Split-Screen CV", component: SplitScreenCv, collection: "special",
    styles: ["Creative", "Modern"], columns: 2, photo: true, ats: false, premium: false,
    defaultFont: "inter", description: "A true 50/50 page: colour-field identity half with a full-bleed portrait and giant name, facts on the other half." },
  { id: "asymmetric-magazine-cv", name: "Asymmetric Magazine CV", component: AsymmetricMagazineCv, collection: "special",
    styles: ["Creative", "Professional"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "lato", description: "Editorial spread: narrow right-aligned sidebar, wide column with oversized italic serif headings and a drop-cap lead." },
  { id: "timeline-split-cv", name: "Timeline Split CV", component: TimelineSplitCv, collection: "special",
    styles: ["Modern", "Creative"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "nunito", description: "A centred spine of year medallions: work on one side, studies, projects and certificates on the other." },
  { id: "infographic-poster-cv", name: "Infographic Poster CV", component: InfographicPosterCv, collection: "special",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: true,
    defaultFont: "inter", description: "Dark one-page poster: giant name, stats pulled from your bullets, a career-span chart, skill meters and bold tiles." },
  { id: "accordion-cv", name: "Accordion-Inspired CV", component: AccordionCv, collection: "special",
    styles: ["Modern", "Simple"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "manrope", description: "Sections as expanded accordion panels: dark header bars with counts and chevrons over compact info blocks." },
  { id: "folded-brochure-cv", name: "Folded Brochure CV", component: FoldedBrochureCv, collection: "special",
    styles: ["Creative", "Professional"], columns: 3, photo: false, ats: false, premium: false,
    defaultFont: "lato", description: "A tri-fold leaflet: coloured profile cover, experience panel and portfolio & skills panel split by dashed folds." },
];
