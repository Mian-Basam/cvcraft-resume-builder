// Layouts for the "futuristic" category of the 80-concept collection. Each entry follows the layout shape in ../../index.js.
import BrutalistArchitecture from "./futuristic/BrutalistArchitecture";
import NeoFuturist from "./futuristic/NeoFuturist";
import GlassmorphismCv from "./futuristic/GlassmorphismCv";
import BlueprintProfessional from "./futuristic/BlueprintProfessional";
import HolographicIdentity from "./futuristic/HolographicIdentity";
import SpatialResume from "./futuristic/SpatialResume";
import InterfaceCv from "./futuristic/InterfaceCv";

export const layouts = [
  { id: "brutalist-architecture", name: "Brutalist Architecture", component: BrutalistArchitecture, collection: "futuristic",
    styles: ["Creative", "Modern"], columns: 2, photo: false, ats: false, premium: false,
    defaultFont: "spacegrotesk", description: "Board-formed concrete page with offset slab blocks, heavy black borders, section-cut hatching and an architect's title block." },
  { id: "neo-futurist", name: "Neo-Futurist", component: NeoFuturist, collection: "futuristic",
    styles: ["Modern", "Minimal"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "spacegrotesk", description: "Single column on a white field with an electric highlight, a measured side rail and technical IDs and coordinates as decoration." },
  { id: "glassmorphism-cv", name: "Glassmorphism CV", component: GlassmorphismCv, collection: "futuristic",
    styles: ["Modern", "Creative"], columns: 2, photo: true, ats: false, premium: false,
    defaultFont: "manrope", description: "Frosted translucent panels layered over soft gradient blobs, with a nested glass contact card and gradient skill bars." },
  { id: "blueprint-professional", name: "Blueprint Professional", component: BlueprintProfessional, collection: "futuristic",
    styles: ["Modern", "Professional"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "spacegrotesk", description: "Single column on a blueprint sheet: white engineering grid, zoned drawing frame, detail callouts, dimension lines for dates and a title block." },
  { id: "holographic-identity", name: "Holographic Identity", component: HolographicIdentity, collection: "futuristic",
    styles: ["Modern", "Creative"], columns: 2, photo: true, ats: false, premium: true,
    defaultFont: "sora", description: "A holographic ID card with photo, chip and barcode leads two columns of dark type with iridescent gradient accents." },
  { id: "spatial-resume", name: "Spatial Resume", component: SpatialResume, collection: "futuristic",
    styles: ["Modern", "Creative"], columns: 1, photo: false, ats: false, premium: false,
    defaultFont: "spacegrotesk", description: "Asymmetric composition with an oversized offset name, floating shaded spheres and rings, generous whitespace and staggered floating cards." },
  { id: "interface-cv", name: "Interface CV", component: InterfaceCv, collection: "futuristic",
    styles: ["Modern", "Professional"], columns: 2, photo: true, ats: false, premium: false,
    defaultFont: "inter", description: "A dashboard screen: dark navigation sidebar listing your sections, breadcrumbs, KPI tiles and compact content cards." },
];
