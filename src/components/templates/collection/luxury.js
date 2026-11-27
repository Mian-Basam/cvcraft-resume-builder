// Layouts for the "luxury" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import BlackLabel from "./luxury/BlackLabel";
import ExecutiveSignature from "./luxury/ExecutiveSignature";
import PlatinumProfile from "./luxury/PlatinumProfile";
import BurgundyElite from "./luxury/BurgundyElite";
import RoyalPortfolio from "./luxury/RoyalPortfolio";
import MaisonResume from "./luxury/MaisonResume";
import HeritageProfessional from "./luxury/HeritageProfessional";

export const layouts = [
  { id: "black-label", name: "Black Label", component: BlackLabel, collection: "luxury",
    styles: ["Professional", "Modern"], columns: 2, photo: true, ats: false, premium: true,
    defaultFont: "montserrat", description: "Matte-black page with gold typography, a framed portrait plate and gilt hairlines." },
  { id: "executive-signature", name: "Executive Signature", component: ExecutiveSignature, collection: "luxury",
    styles: ["Professional", "Minimal"], columns: 1, photo: false, ats: true, premium: true,
    defaultFont: "lato", description: "Signature-style italic serif name over a fine rule, hanging serif labels and navy accents." },
  { id: "platinum-profile", name: "Platinum Profile", component: PlatinumProfile, collection: "luxury",
    styles: ["Professional", "Modern"], columns: 2, photo: false, ats: false, premium: true,
    defaultFont: "montserrat", description: "Brushed-silver header with a metallic seal, structured credential cards and metallic rules." },
  { id: "burgundy-elite", name: "Burgundy Elite", component: BurgundyElite, collection: "luxury",
    styles: ["Professional"], columns: 1, photo: false, ats: false, premium: true,
    defaultFont: "cormorant", description: "Cream editorial page with a newspaper masthead, drop-cap profile and burgundy section heads." },
  { id: "royal-portfolio", name: "Royal Portfolio", component: RoyalPortfolio, collection: "luxury",
    styles: ["Professional", "Creative"], columns: 2, photo: true, ats: false, premium: true,
    defaultFont: "lato", description: "Emerald crest band with an arched portrait, a corner-bracketed formal profile and champagne trim." },
  { id: "maison-resume", name: "Maison Resume", component: MaisonResume, collection: "luxury",
    styles: ["Minimal", "Creative"], columns: 1, photo: false, ats: false, premium: true,
    defaultFont: "montserrat", description: "Magazine-cover layout: oversized serif name, pull-quote profile and numbered features." },
  { id: "heritage-professional", name: "Heritage Professional", component: HeritageProfessional, collection: "luxury",
    styles: ["Professional", "Simple"], columns: 1, photo: false, ats: true, premium: true,
    defaultFont: "baskerville", description: "Ivory page in traditional Baskerville with a ringed monogram, rule-flanked headings and fine rules." },
];
