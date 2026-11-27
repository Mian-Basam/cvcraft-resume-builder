// Colour sets shared by every layout. Each layout reads the keys it needs:
// primary (main colour), accent (highlight), light (pale tint for panels), dark (near-black).
export const palettes = [
  { id: "navy-gold", name: "Navy & Gold", primary: "#14213d", accent: "#f6c945", light: "#f1f1f1", dark: "#1b1b1b" },
  { id: "ocean", name: "Ocean", primary: "#1f5fa8", accent: "#7cc0ef", light: "#eaf1f8", dark: "#1f2a36" },
  { id: "sandstone", name: "Sandstone", primary: "#5a4033", accent: "#d2b8a3", light: "#f3ebe4", dark: "#2b211c" },
  { id: "forest", name: "Forest", primary: "#2f4a3a", accent: "#9cc5a1", light: "#edf3ee", dark: "#1d2520" },
  { id: "plum", name: "Plum", primary: "#4a2558", accent: "#e3a7c0", light: "#f5eff6", dark: "#231a26" },
  { id: "crimson", name: "Crimson", primary: "#8c1c2b", accent: "#f08a8a", light: "#f8eeee", dark: "#231a1b" },
  { id: "teal", name: "Teal", primary: "#0f766e", accent: "#5eead4", light: "#ecf7f5", dark: "#17221f" },
  { id: "charcoal", name: "Charcoal", primary: "#2b2b2b", accent: "#9aa5b1", light: "#f1f2f4", dark: "#161616" },
  { id: "sunset", name: "Sunset", primary: "#9a3412", accent: "#fdba74", light: "#fbf1ea", dark: "#24160f" },
  { id: "indigo", name: "Indigo", primary: "#3730a3", accent: "#a5b4fc", light: "#eef0fb", dark: "#1a1b2e" },
];

export function getPalette(id) {
  return palettes.find((p) => p.id === id) || palettes[0];
}

// Fonts loaded in app/layout.js; `key` matches the CSS variable --font-<key>.
export const fonts = [
  { key: "lato", name: "Lato" },
  { key: "inter", name: "Inter" },
  { key: "poppins", name: "Poppins" },
  { key: "montserrat", name: "Montserrat" },
  { key: "raleway", name: "Raleway" },
  { key: "merriweather", name: "Merriweather" },
  { key: "playfair", name: "Playfair Display" },
  { key: "oswald", name: "Oswald (condensed)" },
  { key: "caveat", name: "Caveat (handwritten)" },
  { key: "cormorant", name: "Cormorant Garamond" },
  { key: "baskerville", name: "Libre Baskerville" },
  { key: "manrope", name: "Manrope" },
  { key: "sora", name: "Sora" },
  { key: "spacegrotesk", name: "Space Grotesk" },
  { key: "nunito", name: "Nunito" },
  { key: "plexmono", name: "IBM Plex Mono (code)" },
];

export function fontStack(key) {
  const fallback = {
    merriweather: "Georgia, serif",
    playfair: "Georgia, serif",
    cinzel: "Georgia, serif",
    cormorant: "Georgia, serif",
    baskerville: "Georgia, serif",
    rye: "Georgia, serif",
    plexmono: "Menlo, Consolas, monospace",
    pixel: "Menlo, Consolas, monospace",
    bebas: "Impact, 'Arial Narrow', sans-serif",
    caveat: "'Comic Sans MS', cursive",
  }[key];
  return `var(--font-${key}), ${fallback || "Helvetica, Arial, sans-serif"}`;
}
