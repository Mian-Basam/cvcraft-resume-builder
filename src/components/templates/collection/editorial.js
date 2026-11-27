// Layouts for the "editorial" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import VogueResume from "./editorial/VogueResume";
import AnnualReport from "./editorial/AnnualReport";
import ModernJournal from "./editorial/ModernJournal";
import CoverStory from "./editorial/CoverStory";
import SwissPublication from "./editorial/SwissPublication";
import EditorialTimeline from "./editorial/EditorialTimeline";
import AcademicJournal from "./editorial/AcademicJournal";

export const layouts = [
  { id: "vogue-resume", name: "Vogue Resume", component: VogueResume, collection: "editorial",
    styles: ["Creative", "Professional"], columns: 2, photo: false, ats: false, premium: true,
    defaultFont: "montserrat", description: "Fashion-magazine page with a centred oversized serif name, italic datelines and a slim style-notes column." },
  { id: "annual-report", name: "Annual Report", component: AnnualReport, collection: "editorial",
    styles: ["Professional", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "inter", description: "Corporate report cover band, a key-figures strip pulled from your achievements and a tinted data column." },
  { id: "modern-journal", name: "Modern Journal", component: ModernJournal, collection: "editorial",
    styles: ["Minimal", "Professional"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "baskerville", description: "Literary-journal single column: serif title, italic introduction, ornament dividers and a run-in colophon." },
  { id: "cover-story", name: "Cover Story", component: CoverStory, collection: "editorial",
    styles: ["Creative", "Modern"], columns: 2, photo: true, ats: false, premium: true,
    defaultFont: "lato", description: "Magazine cover header with a name masthead, cover lines teasing each section, a framed portrait and barcode." },
  { id: "swiss-publication", name: "Swiss Publication", component: SwissPublication, collection: "editorial",
    styles: ["Minimal", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "inter", description: "Strict six-column grid with tick marks, colophon metadata, a two-weight name and large light section numerals." },
  { id: "editorial-timeline", name: "Editorial Timeline", component: EditorialTimeline, collection: "editorial",
    styles: ["Creative", "Professional"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "merriweather", description: "Career told as a feature article: headline, standfirst, datelined chapters on a year rail, pull quotes and a fact file." },
  { id: "academic-journal", name: "Academic Journal", component: AcademicJournal, collection: "editorial",
    styles: ["Professional", "Simple"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "baskerville", description: "Journal-article first page: running head, abstract and keywords, numbered sections in two columns and citation-style projects." },
];
