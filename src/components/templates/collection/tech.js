// Layouts for the "tech" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import DeveloperTerminal from "./tech/DeveloperTerminal";
import GitHubProfile from "./tech/GitHubProfile";
import AIEngineer from "./tech/AIEngineer";
import SystemArchitecture from "./tech/SystemArchitecture";
import CyberGrid from "./tech/CyberGrid";
import ProductEngineer from "./tech/ProductEngineer";
import CloudArchitect from "./tech/CloudArchitect";
import DataScientist from "./tech/DataScientist";

export const layouts = [
  { id: "developer-terminal", name: "Developer Terminal", component: DeveloperTerminal, collection: "tech",
    styles: ["Modern", "Creative"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "plexmono", description: "A dark terminal window where every section opens with a shell command." },
  { id: "github-profile", name: "GitHub Profile", component: GitHubProfile, collection: "tech",
    styles: ["Modern", "Professional"], columns: 2, photo: true, ats: false, premium: false,
    defaultFont: "inter", description: "A developer profile page: avatar sidebar, README summary, pinned repo cards and a contribution timeline." },
  { id: "ai-engineer", name: "AI Engineer", component: AIEngineer, collection: "tech",
    styles: ["Modern", "Professional"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "sora", description: "Clean single column with blue accents, a neural-net motif and measurable results in bold." },
  { id: "system-architecture", name: "System Architecture", component: SystemArchitecture, collection: "tech",
    styles: ["Modern", "Professional"], columns: 2, photo: false, ats: false, premium: true,
    defaultFont: "inter", description: "Blueprint grid with the tech stack drawn as a connected service diagram and experience in component blocks." },
  { id: "cyber-grid", name: "Cyber Grid", component: CyberGrid, collection: "tech",
    styles: ["Modern", "Creative"], columns: 2, photo: true, ats: false, premium: true,
    defaultFont: "spacegrotesk", description: "Dark neon grid with a HUD-bracketed header, hexagon portrait and glowing section rails." },
  { id: "product-engineer", name: "Product Engineer", component: ProductEngineer, collection: "tech",
    styles: ["Professional", "Simple"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "manrope", description: "Single column with a label rail, outcome-first bullets and project results." },
  { id: "cloud-architect", name: "Cloud Architect", component: CloudArchitect, collection: "tech",
    styles: ["Modern", "Professional"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "poppins", description: "Sky-gradient header, project case studies, a tiered tech stack and certification badges." },
  { id: "data-scientist", name: "Data Scientist", component: DataScientist, collection: "tech",
    styles: ["Modern", "Professional"], columns: 1, photo: false, ats: true, premium: false,
    defaultFont: "inter", description: "Single column led by a strip of key results pulled from your bullets, with numbered analytical sections." },
];
