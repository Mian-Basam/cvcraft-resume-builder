// Layouts for the "infographic" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import SkillMatrix from "./infographic/SkillMatrix";
import AchievementDashboard from "./infographic/AchievementDashboard";
import JourneyMap from "./infographic/JourneyMap";
import CircularProfile from "./infographic/CircularProfile";
import DataStory from "./infographic/DataStory";
import ModularCards from "./infographic/ModularCards";
import ProgressionCv from "./infographic/ProgressionCv";

export const layouts = [
  { id: "skill-matrix", name: "Skill Matrix", component: SkillMatrix, collection: "infographic",
    styles: ["Modern", "Professional"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "inter", description: "Graph-paper side panel with a skills × level competency grid by category, beside a ruled experience table." },
  { id: "achievement-dashboard", name: "Achievement Dashboard", component: AchievementDashboard, collection: "infographic",
    styles: ["Modern", "Professional"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "manrope", description: "KPI tiles built from the numbers in your bullets, concise experience with highlighted figures and a metrics rail." },
  { id: "journey-map", name: "Journey Map", component: JourneyMap, collection: "infographic",
    styles: ["Creative", "Modern"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "nunito", description: "Education, roles, certifications and projects as dated stops along a winding dashed road, with a toolkit band." },
  { id: "circular-profile", name: "Circular Profile", component: CircularProfile, collection: "infographic",
    styles: ["Creative", "Modern"], columns: 2, photo: true, ats: false, premium: false,
    defaultFont: "poppins", description: "A round photo framed by a corner circle and orbit arc, circular section markers, skill rings and concentric language rings." },
  { id: "data-story", name: "Data Story", component: DataStory, collection: "infographic",
    styles: ["Modern", "Professional"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "sora", description: "A career report in numbered chapters: a Gantt-style career arc, outcome charts keyed to the figures in each bullet and a skills column chart." },
  { id: "modular-cards", name: "Modular Cards", component: ModularCards, collection: "infographic",
    styles: ["Modern", "Creative"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "spacegrotesk", description: "Outlined content modules on a dotted board, each with a coloured title strip, module code and hard offset shadow." },
  { id: "progression-cv", name: "Progression CV", component: ProgressionCv, collection: "infographic",
    styles: ["Modern", "Professional"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "montserrat", description: "Roles as numbered levels on a progress track, then hexagon-badged level cards with level-up steps and starred milestone achievements." },
];
