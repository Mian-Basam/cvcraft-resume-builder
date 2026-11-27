// Layouts for the "playful" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import MemeProfessional from "./playful/MemeProfessional";
import ProductPackagingCv from "./playful/ProductPackagingCv";
import ClassifiedAd from "./playful/ClassifiedAd";
import MissionControlCv from "./playful/MissionControlCv";
import SuperheroProfile from "./playful/SuperheroProfile";
import BingeWorthyCv from "./playful/BingeWorthyCv";
import GameCharacterCv from "./playful/GameCharacterCv";
import WantedPoster from "./playful/WantedPoster";

export const layouts = [
  { id: "meme-professional", name: "Meme Professional", component: MemeProfessional, collection: "playful",
    styles: ["Creative", "Professional"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "nunito", description: "Professional single column with tongue-in-cheek section labels and a footnote of office humour." },
  { id: "product-packaging-cv", name: "Product Packaging CV", component: ProductPackagingCv, collection: "playful",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "nunito", description: "You as a premium boxed product: brand front panel, a seal, a Skill Facts label, specs and a barcode." },
  { id: "classified-ad", name: "Classified Ad", component: ClassifiedAd, collection: "playful",
    styles: ["Creative"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "merriweather", description: "A newspaper classifieds page: marker-circled AVAILABLE headline, boxed ad cells and tear-off contact tabs." },
  { id: "mission-control-cv", name: "Mission Control CV", component: MissionControlCv, collection: "playful",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "nunito", description: "A flight-console sidebar with a mission patch and green GO lights beside a mission log on grid paper." },
  { id: "superhero-profile", name: "Superhero Profile", component: SuperheroProfile, collection: "playful",
    styles: ["Creative"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "nunito", description: "A comic-book page: inked panels, halftone dots, an origin-story speech bubble, power meters and career missions." },
  { id: "binge-worthy-cv", name: "Binge-Worthy CV", component: BingeWorthyCv, collection: "playful",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "nunito", description: "A dark streaming-style title page: show hero, jobs as episodes, top skills by match and more-like-this cards." },
  { id: "game-character-cv", name: "Game Character CV", component: GameCharacterCv, collection: "playful",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "nunito", description: "A retro RPG character sheet: class and level header, HP/MP/XP bars, stat blocks, a quest log and an inventory." },
  { id: "wanted-poster", name: "Wanted Poster", component: WantedPoster, collection: "playful",
    styles: ["Creative"], columns: 2, photo: true, ats: false, premium: false,
    defaultFont: "baskerville", description: "An aged Old-West wanted poster: Rye headline, framed photo, a tongue-in-cheek reward and the career record." },
];
