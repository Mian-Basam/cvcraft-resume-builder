// Layouts for the "corporate" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import CeoProfile from "./corporate/CeoProfile";
import CorporateStandard from "./corporate/CorporateStandard";
import ConsultingEdge from "./corporate/ConsultingEdge";
import LeadershipLadder from "./corporate/LeadershipLadder";
import BoardroomCv from "./corporate/BoardroomCv";
import FinanceProfessional from "./corporate/FinanceProfessional";
import LegalProfessional from "./corporate/LegalProfessional";
import GlobalExecutive from "./corporate/GlobalExecutive";

export const layouts = [
  { id: "ceo-profile", name: "CEO Profile", component: CeoProfile, collection: "corporate",
    styles: ["Professional", "Modern"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "inter", description: "Single column with a bold name, lead executive summary and a numbered band of leadership achievements." },
  { id: "corporate-standard", name: "Corporate Standard", component: CorporateStandard, collection: "corporate",
    styles: ["Professional", "Simple"], columns: 2, photo: false, ats: true, premium: false,
    defaultFont: "inter", description: "Two columns with a compact tinted contact sidebar, professional summary and chronological experience." },
  { id: "consulting-edge", name: "Consulting Edge", component: ConsultingEdge, collection: "corporate",
    styles: ["Professional", "Modern"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "inter", description: "Hanging-label single column where every role leads with its headline outcome and numbers stand out." },
  { id: "leadership-ladder", name: "Leadership Ladder", component: LeadershipLadder, collection: "corporate",
    styles: ["Professional", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "inter", description: "Two columns with a stair-stepped career progression timeline, leadership competencies and selected accomplishments." },
  { id: "boardroom-cv", name: "Boardroom CV", component: BoardroomCv, collection: "corporate",
    styles: ["Professional"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "inter", description: "Serif masthead with an executive biography, board appointments with strategic-impact notes and credentials." },
  { id: "finance-professional", name: "Finance Professional", component: FinanceProfessional, collection: "corporate",
    styles: ["Professional", "Modern"], columns: 2, photo: false, ats: true, premium: false,
    defaultFont: "inter", description: "Navy masthead, achievements set as a ledger with key figures in a numbers column, and a grey qualifications sidebar." },
  { id: "legal-professional", name: "Legal Professional", component: LegalProfessional, collection: "corporate",
    styles: ["Professional", "Simple"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "baskerville", description: "Traditional serif CV with centred ruled headings, practice areas, italic margin dates and professional credentials." },
  { id: "global-executive", name: "Global Executive", component: GlobalExecutive, collection: "corporate",
    styles: ["Professional", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "manrope", description: "Deep sidebar with a globe motif and languages, location-tagged international roles and a global footprint strip." },
];
