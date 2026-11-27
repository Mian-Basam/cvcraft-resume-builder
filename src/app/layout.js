import { Bebas_Neue, Caveat, Cinzel, Cormorant_Garamond, IBM_Plex_Mono, Inter, Lato, Libre_Baskerville, Manrope, Merriweather, Montserrat, Nunito, Oswald, Playfair_Display, Poppins, Press_Start_2P, Raleway, Rye, Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Every font a template or the font picker can use; see lib/palettes.js.
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700", "900"], variable: "--font-lato" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], variable: "--font-poppins" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["300", "400", "700", "900"], variable: "--font-merriweather" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
// Fonts for the 80-concept collection (see components/templates/collection).
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant" });
const spacegrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-spacegrotesk" });
const plexmono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plexmono" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const baskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-baskerville" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"], variable: "--font-bebas" });
const rye = Rye({ subsets: ["latin"], weight: ["400"], variable: "--font-rye" });
const pixel = Press_Start_2P({ subsets: ["latin"], weight: ["400"], variable: "--font-pixel" });

export const metadata = {
  title: "CVCraft – Resume Builder",
  description: "Build a professional resume with editable templates and download it as a PDF.",
};

export default function RootLayout({ children }) {
  const fontVars = [lato, inter, poppins, montserrat, raleway, merriweather, playfair, oswald, caveat, cinzel, cormorant, spacegrotesk, plexmono, manrope, baskerville, sora, nunito, bebas, rye, pixel].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fontVars}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
