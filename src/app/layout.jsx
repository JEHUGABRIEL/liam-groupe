import { DM_Serif_Display, Roboto, Roboto_Mono } from "next/font/google";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SiteChrome from "@/components/layout/SiteChrome";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { getDomains, getSiteInfo } from "@/lib/site";
import "./globals.css";

const sans = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-sans", display: "swap" });
const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-serif", display: "swap" });
const mono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono", display: "swap" });

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "LIAM Groupe — Révéler les talents, créer des opportunités durables",
    template: "%s · LIAM Groupe",
  },
  description:
    "Structure pluridisciplinaire à Bangui : restaurant O'GAB, salle G-Fitness, Miss Centrafrique, entrepreneuriat, formation et événementiel.",
  icons: { icon: "/favicon.png" },
};

export default async function RootLayout({ children }) {
  const [siteInfo, domains] = await Promise.all([getSiteInfo(), getDomains()]);

  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a href="#principal" className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[200] focus:bg-accent focus:px-5 focus:py-3 focus:font-mono focus:text-[0.8rem] focus:font-bold focus:uppercase focus:text-white">
          Aller au contenu
        </a>
        <AuthProvider>
          <CartProvider>
            <ModalProvider siteInfo={siteInfo}>
              <SiteChrome
                header={<Header />}
                footer={<Footer siteInfo={siteInfo} domains={domains} />}
                extras={<><CartDrawer /><WhatsAppButton number={siteInfo.social?.whatsapp} /></>}
              >
                {children}
              </SiteChrome>
            </ModalProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
